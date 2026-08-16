// lib/mailer.js
//
// ONE place email is sent from. Every API route uses this.
//
// PROVIDER IS AUTOMATIC:
//   RESEND_API_KEY set  -> Resend  (recommended)
//   otherwise           -> SMTP via nodemailer (Gmail app password)
//
// WHY RESEND
// Gmail SMTP caps at roughly 500 messages/day. A single cohort's daily digest
// + weekly digest + deadline reminders to whole teams gets close to that, so
// Gmail is a launch-day ceiling rather than a long-term answer. Resend is free
// to 3,000/month, needs no app password (which Google is retiring anyway), and
// lets you send from hello@shemodeltech.com once the domain is verified — which
// reads far better on a nonprofit's password-reset emails than a gmail address.
//
// SWITCHING PROVIDERS IS AN ENV CHANGE, NOT A CODE CHANGE. Set RESEND_API_KEY
// and redeploy; unset it and you're back on SMTP.
//
// ENV
//   RESEND_API_KEY   re_xxxxx from resend.com/api-keys
//   EMAIL_FROM       'She Model Tech <hello@shemodeltech.com>'  (Resend)
//   EMAIL_USER       shemodeltech@gmail.com                     (SMTP)
//   EMAIL_PASSWORD   16-char Gmail app password                 (SMTP)

const nodemailer = require('nodemailer');

const BRAND_NAME = 'She Model Tech';

const fromAddress = () => {
  if (process.env.EMAIL_FROM) return process.env.EMAIL_FROM;
  const addr = process.env.EMAIL_USER || 'onboarding@resend.dev';
  return `${BRAND_NAME} <${addr}>`;
};

const usingResend = () => !!process.env.RESEND_API_KEY;

// --- Resend -----------------------------------------------------------
async function sendViaResend({ to, cc, subject, html, text, replyTo }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress(),
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(text ? { text } : {}),
      ...(cc && cc.length ? { cc: Array.isArray(cc) ? cc : [cc] } : {}),
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }
  return res.json();
}

// --- SMTP -------------------------------------------------------------
let cachedTransport = null;

function smtpTransport() {
  if (cachedTransport) return cachedTransport;
  // NOTE: the method is createTransport, NOT createTransporter. Two files in
  // this repo previously called createTransporter, which throws at runtime.
  cachedTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
    pool: true,
    maxConnections: 4,
    maxMessages: 100,
  });
  return cachedTransport;
}

async function sendViaSmtp({ to, cc, subject, html, text, replyTo }) {
  return smtpTransport().sendMail({
    from: { name: BRAND_NAME, address: process.env.EMAIL_USER },
    to, subject, html,
    ...(text ? { text } : {}),
    ...(cc && cc.length ? { cc } : {}),
    ...(replyTo ? { replyTo } : {}),
  });
}

// --- Public API -------------------------------------------------------

/**
 * Send one email. Throws on failure — callers decide whether that should
 * abort their flow (it usually shouldn't; a failed notification must never
 * block a badge award or a project submission).
 */
async function sendMail({ to, cc, subject, html, text, replyTo }) {
  if (!to || !subject || !html) {
    throw new Error('sendMail requires to, subject and html.');
  }
  const payload = { to, cc, subject, html, text, replyTo };
  const result = usingResend()
    ? await sendViaResend(payload)
    : await sendViaSmtp(payload);
  // Normalise the id field so callers can log one thing either way.
  return { ...result, messageId: result?.id || result?.messageId || null };
}

/**
 * Send to many recipients with a concurrency cap, so a large cohort can't
 * blow the serverless time limit or trip provider rate limits.
 * Never throws: returns counts, because one bad address must not abort a run.
 */
async function sendBatch(messages, concurrency = 4) {
  let sent = 0;
  const errors = [];
  for (let i = 0; i < messages.length; i += concurrency) {
    const slice = messages.slice(i, i + concurrency);
    // eslint-disable-next-line no-await-in-loop
    const results = await Promise.allSettled(slice.map(m => sendMail(m)));
    results.forEach((r, idx) => {
      if (r.status === 'fulfilled') sent += 1;
      else errors.push({ to: slice[idx].to, error: r.reason?.message });
    });
  }
  return { sent, failed: errors.length, errors };
}

/** True if email is configured at all — lets callers skip work cleanly. */
function isConfigured() {
  return usingResend() || !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
}

module.exports = {
  sendMail, sendBatch, isConfigured, fromAddress,
  provider: () => (usingResend() ? 'resend' : 'smtp'),
  BRAND_NAME,
};
