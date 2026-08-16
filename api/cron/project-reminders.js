// api/cron/project-reminders.js
//
// Nightly job (Vercel Cron). Does ALL the heavy lifting server-side so the
// browser never has to:
//
// 1. Deadline reminders at T-14, T-7, T-3, T-1 and T-0, to the WHOLE TEAM
// (lead + every approved member).
// 2. Moves projects past their deadline into the 7-day GRACE period and
// nudges daily.
// 3. LAPSES projects whose grace has expired (never deletes them).
// 4. Computes LEAD HEALTH and writes it onto the project document, so the
// reviewer queue is one indexed read instead of an N+1 in the browser.
// 5. Increments missed weekly check-ins.
//
// WHY THIS IS A CRON AND NOT BROWSER CODE
// This runs on Vercel's servers on a schedule. It never executes in anyone's
// browser, never blocks a page, and its cost does not grow with how many
// people are using the site. A member browsing the platform at 3am is
// completely unaffected by it.
//
// SAFETY
// - Idempotent: every send is recorded in `reminder_log`, so re-running the
// job (or a retry after a timeout) cannot double-email anyone.
// - Chunked: emails go out in small batches with a concurrency cap, so a
// large cohort cannot blow the serverless execution limit or trip Gmail's
// rate limits.
// - Fail-soft: one bad project or one bad address never aborts the run.

const admin = require('../../lib/firebaseAdmin');
const { sendMail } = require('../../lib/mailer');

const SITE = process.env.SITE_URL || 'https://shemodeltech.com';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'shemodeltech@gmail.com';
const BRAND_NAME = 'She Model Tech';

// Days-before-deadline on which we email. Keep this list short: a reminder
// every day trains people to ignore reminders.
const REMINDER_DAYS = [14, 7, 3, 1, 0];
const GRACE_PERIOD_DAYS = 7;
const QUIET_DAYS = 10;
const CHECKIN_INTERVAL_DAYS = 7;
const MAX_MISSED_CHECKINS = 2;

// Email throughput controls.
const EMAIL_CONCURRENCY = 4; // parallel sends
const MAX_EMAILS_PER_RUN = 400; // hard ceiling; anything beyond waits for tomorrow

const DAY_MS = 24 * 60 * 60 * 1000;

const dayDiff = (dateStr) => {
 if (!dateStr) return null;
 const target = new Date(dateStr);
 const today = new Date();
 target.setHours(0, 0, 0, 0);
 today.setHours(0, 0, 0, 0);
 return Math.round((target - today) / DAY_MS);
};

const daysSinceTs = (ts) => {
 if (!ts) return null;
 const d = ts.toDate ? ts.toDate() : new Date(ts);
 return Math.floor((Date.now() - d.getTime()) / DAY_MS);
};

// ---------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------


const shell = (title, body, cta) => `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#353331">
 <h1 style="font-size:20px;margin:0 0 16px">${title}</h1>
 ${body}
 ${cta ? `<p style="margin:24px 0"><a href="${cta.url}" style="background:#F544CB;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700;display:inline-block">${cta.label}</a></p>` : ''}
 <hr style="border:none;border-top:1px solid #eee;margin:28px 0"/>
 <p style="color:#9ca3af;font-size:12px">${BRAND_NAME} &middot; <a href="${SITE}" style="color:#9ca3af">shemodeltech.com</a><br/>
 Questions? <a href="mailto:${SUPPORT_EMAIL}" style="color:#9ca3af">${SUPPORT_EMAIL}</a></p>
</div>`;

const reminderEmail = (project, daysLeft, isLead) => {
 const url = `${SITE}/projects/${project.id}/workspace`;
 const title = project.projectTitle || project.title || 'your project';

 if (daysLeft === 0) {
 return {
 subject: `Today is the deadline for "${title}"`,
 html: shell(
 `Today is the deadline`,
 `<p>The deadline for <strong>${title}</strong> is today.</p>
 <p>If you need more time, ${isLead ? 'you can request a one-week extension from the workspace' : 'ask your project lead to request a one-week extension'}, there's a ${GRACE_PERIOD_DAYS}-day grace period, so nothing is lost yet.</p>`,
 { url, label: 'Open the workspace' }
 ),
 };
 }
 const urgency = daysLeft <= 3 ? 'is nearly here' : 'is coming up';
 return {
 subject: `${daysLeft} day${daysLeft === 1 ? '' : 's'} left on "${title}"`,
 html: shell(
 `${daysLeft} day${daysLeft === 1 ? '' : 's'} to go`,
 `<p>The deadline for <strong>${title}</strong> ${urgency}, <strong>${daysLeft} day${daysLeft === 1 ? '' : 's'}</strong> left.</p>
 ${isLead ? `<p>As project lead, you'll submit the work for review when the team is ready. Make sure the GitHub repository is up to date and that <strong>SHEMODELTECH</strong> has been added as a collaborator.</p>` : `<p>Now is a good moment to push anything you haven't committed yet, so your contribution is on the record.</p>`}`,
 { url, label: 'Open the workspace' }
 ),
 };
};

const graceEmail = (project, graceDaysLeft, isLead) => {
 const url = `${SITE}/projects/${project.id}/workspace`;
 const title = project.projectTitle || project.title || 'your project';
 return {
 subject: `Grace period: ${graceDaysLeft} day${graceDaysLeft === 1 ? '' : 's'} left on "${title}"`,
 html: shell(
 `You're in the grace period`,
 `<p><strong>${title}</strong> passed its deadline and is now in the ${GRACE_PERIOD_DAYS}-day grace period.</p>
 <p><strong>${graceDaysLeft} day${graceDaysLeft === 1 ? '' : 's'}</strong> remain to submit${isLead ? '' : ', your lead needs to submit for review'}.</p>
 <p>Badges and certificates are awarded after review, so it's worth finishing.</p>`,
 { url, label: 'Open the workspace' }
 ),
 };
};

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

/** Run tasks with a small concurrency cap so we never flood the mail server. */
async function inBatches(items, size, worker) {
 const out = [];
 for (let i = 0; i < items.length; i += size) {
 const slice = items.slice(i, i + size);
 // eslint-disable-next-line no-await-in-loop
 out.push(...await Promise.allSettled(slice.map(worker)));
 }
 return out;
}

/** Everyone on the project: lead + approved members. */
async function getTeamEmails(db, project) {
 const people = [];
 if (project.submitterEmail) {
 people.push({ email: project.submitterEmail, isLead: true });
 }
 const uids = project.members || [];
 for (const uid of uids) {
 try {
 // eslint-disable-next-line no-await-in-loop
 const snap = await db.collection('users').doc(uid).get();
 if (snap.exists && snap.data().email) {
 people.push({ email: snap.data().email, isLead: false });
 }
 } catch (_) { /* skip one bad member, never abort the project */ }
 }
 // De-duplicate: the lead can also appear in members on some older docs.
 const seen = new Set();
 return people.filter(p => {
 if (seen.has(p.email)) return false;
 seen.add(p.email);
 return true;
 });
}

/** Idempotency: has this exact reminder already gone out? */
async function alreadySent(db, key) {
 const snap = await db.collection('reminder_log').doc(key).get();
 return snap.exists;
}
async function markSent(db, key, meta) {
 await db.collection('reminder_log').doc(key).set({
 ...meta, sentAt: new Date().toISOString(),
 });
}

// ---------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------
module.exports = async (req, res) => {
 // Vercel Cron sends a bearer token; reject anything else so this can't be
 // triggered by a stranger hitting the URL.
 const secret = process.env.CRON_SECRET;
 if (secret) {
 const auth = req.headers.authorization || '';
 if (auth !== `Bearer ${secret}`) {
 return res.status(401).json({ error: 'unauthorized' });
 }
 }

 const db = admin.firestore();
 const stats = {
 scanned: 0, reminders: 0, graceMoved: 0, graceNudges: 0,
 lapsed: 0, healthUpdated: 0, missedCheckins: 0, errors: 0, skipped: 0,
 };
 let emailBudget = MAX_EMAILS_PER_RUN;

 try {
 // Only projects that are actually running. Indexed query, bounded.
 const snap = await db.collection('projects')
 .where('status', 'in', ['active', 'setup', 'overdue'])
 .get();

 stats.scanned = snap.size;

 for (const docSnap of snap.docs) {
 const project = { id: docSnap.id, ...docSnap.data() };
 const ref = docSnap.ref;

 try {
 // ---------- 4 & 5. Lead health (cheap, no email) ----------
 const updates = {};
 let daysQuiet = null;
 if (project.submitterId) {
 // eslint-disable-next-line no-await-in-loop
 const leadSnap = await db.collection('users').doc(project.submitterId).get();
 if (leadSnap.exists) {
 const u = leadSnap.data();
 const pa = u.projectActivity || {};
 daysQuiet = daysSinceTs(pa[project.id] || u.lastActiveAt);
 }
 }

 const reasons = [];
 if (daysQuiet !== null && daysQuiet >= QUIET_DAYS) {
 reasons.push(`Lead hasn't opened the workspace in ${daysQuiet} days`);
 }

 // Missed weekly check-in?
 const sinceCheckin = daysSinceTs(project.lastCheckinAt);
 let missed = project.missedCheckins || 0;
 if (sinceCheckin === null || sinceCheckin >= CHECKIN_INTERVAL_DAYS) {
 const lastCounted = project.lastMissedCountedAt
 ? daysSinceTs(project.lastMissedCountedAt) : null;
 // Only increment once per interval, not every night.
 if (lastCounted === null || lastCounted >= CHECKIN_INTERVAL_DAYS) {
 missed += 1;
 updates.missedCheckins = missed;
 updates.lastMissedCountedAt = new Date().toISOString();
 stats.missedCheckins += 1;
 }
 }
 if (missed >= MAX_MISSED_CHECKINS) {
 reasons.push(`Missed ${missed} weekly check-ins`);
 }

 const flags = project.leadFlags || [];
 const uniqueFlaggers = [...new Set(flags.map(f => f.byUid))];
 if (uniqueFlaggers.length >= 2) {
 reasons.push(`${uniqueFlaggers.length} team members raised a concern`);
 }

 const health = project.leadHealth === 'unresponsive'
 ? 'unresponsive'
 : reasons.length >= 2 ? 'at_risk'
 : reasons.length === 1 ? 'quiet'
 : 'ok';

 if (project.leadHealth !== health
 || project.leadDaysQuiet !== daysQuiet) {
 updates.leadHealth = health;
 updates.leadDaysQuiet = daysQuiet;
 updates.leadHealthReasons = reasons;
 stats.healthUpdated += 1;
 }

 // ---------- Deadline maths ----------
 const daysLeft = dayDiff(project.endDate);

 if (daysLeft !== null) {
 // ---------- 3. Lapse after grace ----------
 const graceUsed = -daysLeft;
 const extraGrace = (project.extensionDays || 0);
 const graceWindow = GRACE_PERIOD_DAYS + extraGrace;

 if (graceUsed > graceWindow && project.status !== 'lapsed') {
 // Lapsed: NOT deleted, NOT failed. Work stays visible, the team
 // can still submit late, and a reviewer can still award badges to
 // members who genuinely contributed - the usual cause is one
 // absent lead, not a team that didn't work.
 updates.status = 'lapsed';
 updates.lapsedAt = new Date().toISOString();
 stats.lapsed += 1;
 } else if (daysLeft < 0 && project.status !== 'overdue'
 && project.status !== 'lapsed') {
 updates.status = 'overdue';
 updates.graceStartedAt = new Date().toISOString();
 stats.graceMoved += 1;
 }

 // ---------- 1 & 2. Emails ----------
 const isGrace = daysLeft < 0 && graceUsed <= graceWindow;
 const shouldEmail =
 (daysLeft >= 0 && REMINDER_DAYS.includes(daysLeft)) || isGrace;

 if (shouldEmail && emailBudget > 0) {
 const key = isGrace
 ? `${project.id}_grace_${graceUsed}`
 : `${project.id}_t${daysLeft}`;

 // eslint-disable-next-line no-await-in-loop
 if (await alreadySent(db, key)) {
 stats.skipped += 1;
 } else {
 // eslint-disable-next-line no-await-in-loop
 const team = await getTeamEmails(db, project);
 const toSend = team.slice(0, emailBudget);

 // eslint-disable-next-line no-await-in-loop
 const results = await inBatches(toSend, EMAIL_CONCURRENCY, async (p) => {
 const { subject, html } = isGrace
 ? graceEmail(project, graceWindow - graceUsed + 1, p.isLead)
 : reminderEmail(project, daysLeft, p.isLead);
 await sendMail({ to: p.email, subject, html });
 });

 const sent = results.filter(r => r.status === 'fulfilled').length;
 emailBudget -= toSend.length;
 if (isGrace) stats.graceNudges += sent; else stats.reminders += sent;

 // eslint-disable-next-line no-await-in-loop
 await markSent(db, key, {
 projectId: project.id, daysLeft, recipients: sent, grace: isGrace,
 });
 }
 }
 }

 if (Object.keys(updates).length) {
 // eslint-disable-next-line no-await-in-loop
 await ref.update(updates);
 }
 } catch (err) {
 // One bad project must never abort the whole run.
 stats.errors += 1;
 console.error(`project ${project.id} failed:`, err.message);
 }
 }

 try { } catch (_) { /* noop */ }
 return res.status(200).json({ ok: true, ...stats });
 } catch (err) {
 console.error('project-reminders failed:', err);
 try { } catch (_) { /* noop */ }
 return res.status(500).json({ error: err.message, ...stats });
 }
};
