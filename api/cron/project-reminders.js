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

const { certificateCode } = require('../../lib/courseRequirements');
const { jobTasks, tierTasks } = require('../../lib/companyTasks');
const admin = require('../../lib/firebaseAdmin');
const { sendMail } = require('../../lib/mailer');
const { pushToUids } = require('../../lib/push');

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
 ${cta ? `<p style="margin:24px 0"><a href="${cta.url}" style="background:#D41470;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700;display:inline-block">${cta.label}</a></p>` : ''}
 <hr style="border:none;border-top:1px solid #eee;margin:28px 0"/>
 <p style="color:#A3A3A3;font-size:12px">${BRAND_NAME} &middot; <a href="${SITE}" style="color:#A3A3A3">shemodeltech.com</a><br/>
 Questions? <a href="mailto:${SUPPORT_EMAIL}" style="color:#A3A3A3">${SUPPORT_EMAIL}</a></p>
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
 const uids = (project.members || []).filter((u) => typeof u === 'string' && u);
 // One round trip for the whole team instead of one read per member.
 try {
 const snaps = uids.length ? await db.getAll(...uids.map((uid) => db.collection('users').doc(uid))) : [];
 snaps.forEach((snap) => {
 if (snap.exists && snap.data().email) {
 people.push({ email: snap.data().email, isLead: false });
 }
 });
 } catch (_) { /* skip the members, never abort the project */ }
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
// ─────────────────────────────────────────────────────────────
// EVENTS (all online)
// - Waitlist: when a place frees up, the earliest person waiting moves up.
// - Reminders with the joining link: 1 day before and 30 minutes before.
// Each send is flagged on the registration, so re-runs never double-email.
// ─────────────────────────────────────────────────────────────
const EV_SITE = process.env.SITE_URL || 'https://shemodeltech.com';
const evEsc = (t) => String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const evWhen = (iso) => {
 const d = new Date(iso);
 const day = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/New_York' });
 const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York', timeZoneName: 'short' });
 return `${day}, ${time}`;
};

async function eventTasks(db, stats) {
 const now = Date.now();
 const snap = await db.collection('events').where('published', '==', true).get();
 for (const eDoc of snap.docs) {
 const ev = { id: eDoc.id, ...eDoc.data() };
 if (ev.status === 'cancelled' || !ev.startAt) continue;
 const start = Date.parse(ev.startAt);
 if (!start || start < now - 15 * 60000 || start > now + 26 * 3600000) {
 // Only events starting within about a day need work (waitlist moves too).
 if (!(start > now && Number(ev.capacity) > 0)) continue;
 }
 const regsSnap = await db.collection('eventRegistrations').where('eventId', '==', ev.id).get();
 const regs = regsSnap.docs.map((d) => ({ ref: d.ref, ...d.data() }));
 const userCache = {};
 const userOf = async (uid) => {
 if (!userCache[uid]) {
 const u = await db.collection('users').doc(uid).get().catch(() => null);
 userCache[uid] = u && u.exists ? u.data() : {};
 }
 return userCache[uid];
 };
 const tell = async (uid, title, message, htmlBody, ctaUrl, ctaLabel) => {
 const u = await userOf(uid);
 if (u.email) {
 await sendMail({
 to: u.email,
 subject: title,
 text: `${title}\n\n${message}\n\n${ctaUrl}`,
 html: `<h2 style="margin:0 0 12px">${evEsc(title)}</h2><p>Hi ${evEsc((u.displayName || '').split(' ')[0] || 'there')},</p>${htmlBody}<p style="margin:22px 0"><a href="${ctaUrl}" style="background:#D41470;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700;display:inline-block">${evEsc(ctaLabel)}</a></p>`,
 }).catch((e) => console.error('event email failed:', e.message));
 }
 const link = ctaUrl.startsWith(EV_SITE) ? ctaUrl.slice(EV_SITE.length) || '/events' : ctaUrl;
 await db.collection('notifications').add({
 userId: uid, recipientId: uid, type: 'event_reminder', title, body: message, message: `${title} - ${message}`,
 link, isRead: false, read: false, createdAt: admin.firestore.FieldValue.serverTimestamp(),
 });
 await pushToUids([uid], { title, body: message, link });
 };

 // Waitlist: fill free places in the order people joined.
 const cap = Number(ev.capacity) || 0;
 if (cap > 0 && start > now) {
 let placed = regs.filter((r) => r.status === 'registered').length;
 const waiting = regs.filter((r) => r.status === 'waitlist')
 .sort((a, b) => (a.createdAt?.toMillis?.() || 0) - (b.createdAt?.toMillis?.() || 0));
 for (const r of waiting) {
 if (placed >= cap) break;
 await r.ref.update({ status: 'registered', movedUpAt: admin.firestore.FieldValue.serverTimestamp() });
 r.status = 'registered';
 placed += 1;
 const url = `${EV_SITE}/events/${ev.id}`;
 await tell(r.uid, `You have a place: ${ev.title}`, `${evWhen(ev.startAt)} (Eastern time). A place opened up, so you’re now registered.`,
 `<p>A place opened up for <strong>${evEsc(ev.title)}</strong>, so you’re now registered.</p><p><strong>When:</strong> ${evWhen(ev.startAt)} (Eastern time), online.</p><p>We’ll email you the joining link before it starts.</p>`,
 url, 'See the event');
 stats.eventWaitlistMoves = (stats.eventWaitlistMoves || 0) + 1;
 }
 }

 // Reminders with the joining link.
 const msLeft = start - now;
 if (msLeft > 26 * 3600000 || msLeft < -10 * 60000) continue;
 const info = await db.collection('events').doc(ev.id).collection('private').doc('info').get().catch(() => null);
 const joinUrl = (info && info.exists && info.data().joinUrl) || `${EV_SITE}/events/${ev.id}`;
 // A few registrants at a time: one at a time (email + bell + push each)
 // could run past the serverless time limit for a big event.
 const remindOne = async (r) => {
 if (r.status !== 'registered') return;
 // We're live now (from the start time to 10 minutes after).
 if (msLeft <= 0 && !r.remindedLive) {
 await tell(r.uid, `We're live now: ${ev.title}`, 'It has started. Tap to join.',
 `<p><strong>${evEsc(ev.title)}</strong> has started. Come and join us!</p><p>Joining link: <a href="${joinUrl}">${evEsc(joinUrl)}</a></p>`,
 joinUrl, 'Join now');
 await r.ref.update({ remindedLive: true, reminded30: true, reminded1d: true });
 stats.eventLiveNow = (stats.eventLiveNow || 0) + 1;
 return;
 }
 // 30 minutes before (sent from 35 minutes out until the start).
 if (msLeft > 0 && msLeft <= 35 * 60000 && !r.reminded30) {
 await tell(r.uid, `Starting soon: ${ev.title}`, 'It starts in about 30 minutes. Use the joining link to get in.',
 `<p><strong>${evEsc(ev.title)}</strong> starts in about 30 minutes, online.</p><p>Joining link: <a href="${joinUrl}">${evEsc(joinUrl)}</a></p>`,
 joinUrl, 'Join now');
 await r.ref.update({ reminded30: true, reminded1d: true });
 stats.eventReminders30 = (stats.eventReminders30 || 0) + 1;
 return;
 }
 // 1 day before (anything from 24 hours down to 40 minutes out).
 if (msLeft <= 24 * 3600000 && msLeft > 40 * 60000 && !r.reminded1d) {
 await tell(r.uid, `Tomorrow: ${ev.title}`, `${evWhen(ev.startAt)} (Eastern time), online. Here’s your joining link.`,
 `<p>A reminder that <strong>${evEsc(ev.title)}</strong> is coming up.</p><p><strong>When:</strong> ${evWhen(ev.startAt)} (Eastern time), online.</p><p>Joining link: <a href="${joinUrl}">${evEsc(joinUrl)}</a></p><p>We’ll send one more reminder 30 minutes before it starts.</p>`,
 joinUrl, 'Open the joining link');
 await r.ref.update({ reminded1d: true });
 stats.eventReminders1d = (stats.eventReminders1d || 0) + 1;
 }
 };
 const results = await inBatches(regs, 5, remindOne);
 results.forEach((x) => { if (x.status === 'rejected') console.error('event reminder failed:', x.reason?.message); });
 }
}

// Older certificates stored the learner's email (certificates are public), and
// had no code for /verify. Remove the email and add the code, a batch at a time.
// Once they're all done this is one empty query per run.
const tidyCertificates = async (db) => {
 const snap = await db.collection('learning_certificates').where('email', '>=', '').limit(200).get();
 if (snap.empty) return 0;
 const batch = db.batch();
 snap.docs.forEach((d) => batch.update(d.ref, { email: admin.firestore.FieldValue.delete(), code: certificateCode(d.id) }));
 await batch.commit();
 return snap.size;
};

// Notifications older than 6 months are deleted, a few batches per daily run,
// so the database stays lean. Members see their latest notifications anyway
// (the Notifications page shows the newest first, 50 at a time).
const NOTIFICATION_MAX_AGE_DAYS = 180;
const cleanOldNotifications = async (db, deadline) => {
 const cutoff = admin.firestore.Timestamp.fromMillis(Date.now() - NOTIFICATION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000);
 let removed = 0;
 for (let round = 0; round < 10 && Date.now() < deadline; round += 1) {
 // eslint-disable-next-line no-await-in-loop
 const snap = await db.collection('notifications').where('createdAt', '<', cutoff).limit(400).get();
 if (snap.empty) break;
 const batch = db.batch();
 snap.docs.forEach((d) => batch.delete(d.ref));
 // eslint-disable-next-line no-await-in-loop
 await batch.commit();
 removed += snap.size;
 if (snap.size < 400) break;
 }
 return removed;
};

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
 // Frequent runs (an outside timer every few minutes) only handle events.
 if (req.query && req.query.task === 'events') {
 const evStats = {};
 try {
 await eventTasks(db, evStats);
 evStats.certificatesTidied = await tidyCertificates(db).catch((e) => { console.error('certificate tidy failed:', e.message); return 0; });
 await jobTasks(db, evStats).catch((e) => console.error('job notices failed:', e.message));
 return res.status(200).json({ ok: true, ...evStats });
 } catch (e) {
 console.error('event tasks failed:', e.message);
 return res.status(500).json({ error: e.message });
 }
 }
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

 // Stop starting new projects well before the function's time limit, so the
 // run always ends cleanly (anything left is picked up tomorrow; every send
 // is logged, so nothing is sent twice).
 const startedAt = Date.now();
 const TIME_BUDGET_MS = 40000;
 const PROJECT_CONCURRENCY = 5;

 const processProject = async (docSnap) => {
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
 // Take this project's share of the budget straight away (no await in
 // between), so projects running side by side can't overspend it.
 const toSend = team.slice(0, Math.max(emailBudget, 0));
 emailBudget -= toSend.length;
 if (team.length && !toSend.length) {
 // Out of email budget for today: leave it unlogged so tomorrow's run sends it.
 stats.skipped += 1;
 } else {
 // eslint-disable-next-line no-await-in-loop
 const results = await inBatches(toSend, EMAIL_CONCURRENCY, async (p) => {
 const { subject, html } = isGrace
 ? graceEmail(project, graceWindow - graceUsed + 1, p.isLead)
 : reminderEmail(project, daysLeft, p.isLead);
 await sendMail({ to: p.email, subject, html });
 });

 const sent = results.filter(r => r.status === 'fulfilled').length;
 if (isGrace) stats.graceNudges += sent; else stats.reminders += sent;

 // eslint-disable-next-line no-await-in-loop
 await markSent(db, key, {
 projectId: project.id, daysLeft, recipients: sent, grace: isGrace,
 });
 // Phone push to the whole team (members choose this in Settings).
 const name = project.projectTitle || project.title || 'your project';
 const pushTitle = isGrace ? `Overdue: ${name}` : daysLeft === 0 ? `Due today: ${name}` : daysLeft === 1 ? `Due tomorrow: ${name}` : `${daysLeft} days left: ${name}`;
 const pushBody = isGrace
 ? `The deadline has passed. You have ${Math.max(graceWindow - graceUsed + 1, 0)} grace day(s) left to submit.`
 : 'Check your tasks and keep your team updated in the workspace.';
 // eslint-disable-next-line no-await-in-loop
 await pushToUids([project.submitterId, ...(project.members || [])], { title: pushTitle, body: pushBody, link: `/projects/${project.id}/workspace` });
 }
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
 };
 const docs = snap.docs;
 for (let i = 0; i < docs.length; i += PROJECT_CONCURRENCY) {
 if (Date.now() - startedAt > TIME_BUDGET_MS) {
 stats.deferred = docs.length - i;
 console.warn(`project-reminders: time budget reached, ${stats.deferred} projects left for the next run`);
 break;
 }
 // eslint-disable-next-line no-await-in-loop
 await Promise.all(docs.slice(i, i + PROJECT_CONCURRENCY).map(processProject));
 }

 // ── Events: reminders and waitlist moves (also runs every few minutes via ?task=events) ──
 try { await eventTasks(db, stats); } catch (e) { console.error('event tasks skipped:', e.message); }
 // ── Jobs and company tiers: new-job notices, closing reminders, tier endings ──
 try { await jobTasks(db, stats); } catch (e) { console.error('job notices skipped:', e.message); }
 try { await tierTasks(db, stats); } catch (e) { console.error('tier notices skipped:', e.message); }
 // ── Housekeeping: delete notifications older than 6 months (stops well before the time limit) ──
 try {
 stats.oldNotificationsDeleted = await cleanOldNotifications(db, startedAt + 52000);
 } catch (e) { console.error('notification clean-up skipped:', e.message); }

 return res.status(200).json({ ok: true, ...stats });
 } catch (err) {
 console.error('project-reminders failed:', err);
 try { } catch (_) { /* noop */ }
 return res.status(500).json({ error: err.message, ...stats });
 }
};
