// lib/mailer.js
//
// ONE place email is sent from. Every API route uses this.
//
// PROVIDER IS AUTOMATIC:
// RESEND_API_KEY set -> Resend (recommended)
// otherwise -> SMTP via nodemailer (Gmail app password)
//
// WHY RESEND
// Gmail SMTP caps at roughly 500 messages/day. A single cohort's daily digest
// + weekly digest + deadline reminders to whole teams gets close to that, so
// Gmail is a launch-day ceiling rather than a long-term answer. Resend is free
// to 3,000/month, needs no app password (which Google is retiring anyway), and
// lets you send from hello@shemodeltech.com once the domain is verified, which
// reads far better on a nonprofit's password-reset emails than a gmail address.
//
// SWITCHING PROVIDERS IS AN ENV CHANGE, NOT A CODE CHANGE. Set RESEND_API_KEY
// and redeploy; unset it and you're back on SMTP.
//
// ENV
// RESEND_API_KEY re_xxxxx from resend.com/api-keys
// EMAIL_FROM 'She Model Tech <hello@shemodeltech.com>' (Resend)
// EMAIL_USER shemodeltech@gmail.com (SMTP)
// EMAIL_PASSWORD 16-char Gmail app password (SMTP)

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
 * Send one email. Throws on failure, callers decide whether that should
 * abort their flow (it usually shouldn't; a failed notification must never
 * block a badge award or a project submission).
 */
// ---------------------------------------------------------------------------
// BRANDING: every email gets the She Model Tech look in one place.
// - Accent colours from older templates (blues, purples, oranges, greens) are
//   mapped to shades of She Model Tech pink.
// - A header with the logo and a footer are added (unless the email already
//   shows the logo), so all emails look the same.
// ---------------------------------------------------------------------------
const SITE = (process.env.SITE_URL || 'https://shemodeltech.com').replace(/\/$/, '');
const LOGO_URL = `${SITE}/Images/she-model-tech-logo.png`;
const PINK = { main: '#C8175D', dark: '#9D1149', bright: '#E8317A', soft: '#F9D0E0', tint: '#FCE7F0', wash: '#FDF4F8' };
const COLOR_MAP = {
  // blues
  '#2563eb': PINK.main, '#1d4ed8': PINK.dark, '#3b82f6': PINK.bright, '#60a5fa': PINK.bright,
  '#eff6ff': PINK.wash, '#dbeafe': PINK.tint, '#bfdbfe': PINK.soft, '#1e40af': PINK.dark,
  // purples
  '#9c27b0': PINK.main, '#7b1fa2': PINK.dark, '#8b5cf6': PINK.bright, '#7c3aed': PINK.main,
  '#f3e5f5': PINK.tint, '#ede9fe': PINK.tint, '#f544cb': PINK.bright,
  // oranges
  '#f97316': PINK.main, '#ea580c': PINK.dark, '#ff6b35': PINK.bright, '#ff9800': PINK.main,
  '#f57c00': PINK.dark, '#e65100': PINK.dark, '#fff3e0': PINK.tint, '#fff8f5': PINK.wash,
  // greens used as accents and buttons
  '#4caf50': PINK.main, '#45a049': PINK.dark, '#22c55e': PINK.main, '#2e7d32': PINK.dark, '#e8f5e9': PINK.tint,
};
const recolor = (html) =>
  html.replace(/#[0-9a-fA-F]{6}\b/g, (hex) => COLOR_MAP[hex.toLowerCase()] || hex);

const HEADER = `
<div style="background:#ffffff;border-bottom:4px solid ${PINK.main};padding:18px 16px;text-align:center">
  <a href="${SITE}" style="text-decoration:none"><img src="${LOGO_URL}" alt="She Model Tech" width="150" style="max-width:150px;height:auto;display:inline-block" /></a>
</div>`;
const FOOTER = `
<div style="background:${PINK.wash};border-top:1px solid ${PINK.soft};padding:18px 16px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280">
  <a href="${SITE}" style="color:${PINK.main};text-decoration:none;font-weight:bold">shemodeltech.com</a><br />
  © ${new Date().getFullYear()} SHE MODEL TECH Inc., a 501(c)(3) nonprofit.
</div>`;

function brandEmail(html) {
  let out = recolor(html);
  // Older templates show a small square icon; the header logo replaces it.
  out = out.replace(/<img[^>]*Images\/512X512\.png[^>]*>/g, '');
  if (out.includes('she-model-tech-logo.png')) return out;
  const wrapOpen = `<div style="background:${PINK.wash};padding:16px 0"><div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid ${PINK.soft}">${HEADER}`;
  const wrapClose = `${FOOTER}</div></div>`;
  if (/<body[^>]*>/i.test(out)) {
    return out.replace(/<body([^>]*)>/i, `<body$1>${wrapOpen}`).replace(/<\/body>/i, `${wrapClose}</body>`);
  }
  return `${wrapOpen}${out}${wrapClose}`;
}

async function sendMail({ to, cc, subject, html, text, replyTo }) {
 if (!to || !subject || !html) {
 throw new Error('sendMail requires to, subject and html.');
 }
 const payload = { to, cc, subject, html: brandEmail(html), text, replyTo };
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

/** True if email is configured at all, lets callers skip work cleanly. */
function isConfigured() {
 return usingResend() || !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
}

module.exports = {
  brandEmail,
 sendMail, sendBatch, isConfigured, fromAddress,
 provider: () => (usingResend() ? 'resend' : 'smtp'),
 BRAND_NAME,
};
