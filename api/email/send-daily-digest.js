// =================================================================
// api/email/send-daily-digest.js, She Model Tech "Pick up where you left off"
// Daily check. Sends ONLY to users who have something in-progress or stalled,
// so nobody is bombarded. No pending items = no email that day.
// =================================================================

const { sendMail } = require('../../lib/mailer');
const admin = require('firebase-admin');

if (!admin.apps.length) {
 try {
 admin.initializeApp({
 credential: admin.credential.cert({
 type: 'service_account',
 project_id: process.env.FIREBASE_PROJECT_ID || 'she-model-tech',
 private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
 client_email: process.env.FIREBASE_CLIENT_EMAIL,
 }),
 projectId: process.env.FIREBASE_PROJECT_ID || 'she-model-tech',
 });
 } catch (err) {
 console.error('Firebase Admin init failed:', err.message);
 throw err;
 }
}

const db = admin.firestore();
const SITE = 'https://shemodeltech.com';
const QUIET_DAYS = 3; // "went quiet" threshold

const tsToDate = (t) => {
 try { return t?.toDate ? t.toDate() : (t?._seconds ? new Date(t._seconds * 1000) : null); }
 catch { return null; }
};
const daysSince = (d) => d ? Math.floor((Date.now() - d.getTime()) / 86400000) : 999;

module.exports = async function handler(req, res) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
 res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
 if (req.method === 'OPTIONS') return res.status(200).end();

 // Vercel Cron sends "Authorization: Bearer <CRON_SECRET>" when CRON_SECRET is
 // set in Vercel. The old user-agent check can be faked by anyone, so it's only
 // used while CRON_SECRET isn't set yet.
 const cronSecret = process.env.CRON_SECRET;
 const isVercelCron = cronSecret
   ? req.headers.authorization === `Bearer ${cronSecret}`
   : !!(req.headers['x-vercel-cron'] || req.headers['user-agent']?.includes('vercel-cron'));
 const isDev = process.env.NODE_ENV === 'development' || req.headers.host?.includes('localhost');
 const apiKey = req.headers['x-api-key'] || req.query.apiKey;
 const validKey = process.env.DAILY_DIGEST_API_KEY;
 // Test mode: ?to=someone@example.com sends only to that one address.
 const testTo = String(req.query.to || '').trim().toLowerCase();
 // Allowed: Vercel's scheduler (CRON_SECRET), or a request with the digest API
 // key. Anything else is refused, so no one can trigger mass emails.
 if (!isDev && !isVercelCron && !(validKey && apiKey === validKey)) {
 return res.status(401).json({ error: 'Unauthorized' });
 }

 try {

 // Pull all projects once and index by id.
 const projectsSnap = await db.collection('projects').get();
 const projects = {};
 projectsSnap.docs.forEach(d => { projects[d.id] = { id: d.id, ...d.data() }; });

 // Pull all users (opted in or no preference set defaults to receiving reminders).
 const usersSnap = testTo
   ? await db.collection('users').where('email', '==', testTo).limit(1).get()
   : await db.collection('users').get();
 if (testTo && usersSnap.empty) return res.status(404).json({ success: false, error: `No member with email ${testTo}` });

 let sent = 0, skipped = 0, failed = 0;

 for (const uDoc of usersSnap.docs) {
 const user = { uid: uDoc.id, ...uDoc.data() };
 if (!user.email || !user.email.includes('@')) { skipped++; continue; }
 // Respect opt-out (default ON unless explicitly disabled).
 if (user.emailPreferences && user.emailPreferences.reminders === false) { skipped++; continue; }
 if (user.isCompany) { skipped++; continue; }

 const items = []; // each: { headline, detail, link }

 // Gather the projects this user is involved in.
 const involved = Object.values(projects).filter(p =>
 (p.members || []).includes(user.uid) ||
 p.submitterId === user.uid
 );

 for (const p of involved) {
 const title = p.projectTitle || p.title || 'your project';
 const link = `${SITE}/projects/${p.id}`;

 // STATE 1: stepped up to lead but stalled at setup (never opened the team).
 if (p.submitterId === user.uid && p.status === 'setup') {
 items.push({
 headline: `Finish setting up "${title}"`,
 detail: 'You stepped up to lead this project but haven\'t opened it to the team yet. Set the roles and start recruiting.',
 link: `${SITE}/projects/${p.id}/setup`,
 });
 continue;
 }

 // STATE 2: approved member who has never been active on this project.
 const isMember = (p.members || []).includes(user.uid);
 const projActivity = tsToDate(user.projectActivity?.[p.id]);
 if (isMember && p.status === 'active' && !projActivity) {
 items.push({
 headline: `Your team on "${title}" is waiting`,
 detail: 'You were approved but haven\'t opened the workspace yet. Jump in and meet your team.',
 link: `${SITE}/projects/${p.id}/workspace`,
 });
 continue;
 }

 // STATE 3: active member who went quiet for a few days.
 if (isMember && p.status === 'active' && projActivity && daysSince(projActivity) >= QUIET_DAYS) {
 items.push({
 headline: `Pick up where you left off on "${title}"`,
 detail: `It's been ${daysSince(projActivity)} days. Your team is counting on your part.`,
 link: `${SITE}/projects/${p.id}/workspace`,
 });
 }
 }

 // STATE 4: applied to lead a project that still needs a lead (their application is pending action).
 try {
 const apps = await db.collection('project_applications')
 .where('applicantUid', '==', user.uid).get();
 apps.docs.forEach(a => {
 const app = a.data();
 const p = projects[app.projectId];
 if (p && p.status === 'lead_recruitment' && !p.leadConfirmed && /lead/i.test(app.role || '')) {
 const title = p.projectTitle || p.title || 'a project';
 // Only if not already added.
 if (!items.some(i => i.link.includes(p.id))) {
 items.push({
 headline: `You applied to lead "${title}"`,
 detail: 'This project still needs a lead. If you\'re ready, confirm and set up your team.',
 link: `${SITE}/projects/${p.id}`,
 });
 }
 }
 });
 } catch (_) { /* non-blocking */ }

 // STATE 5: a course they started but haven't opened in a few days.
 try {
   const enrolled = user.learningEnrolled || {};
   const done = user.foundationsCourses || {}; // completed courses, by track and slug
   const lastPart = user.learningLastPart || {};
   const opened = user.learningLastOpened || {};
   for (const [track, slugs] of Object.entries(enrolled)) {
     for (const [slug, at] of Object.entries(slugs || {})) {
       if (done?.[track]?.[slug]) continue;
       const last = tsToDate(opened?.[track]?.[slug]) || tsToDate(at);
       if (last && daysSince(last) < QUIET_DAYS) continue;
       const part = lastPart?.[track]?.[slug];
       const nice = slug.replace(/^p-/, '').replace(/-(beginner|intermediate|advanced)-course$/, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
       items.push({
         headline: `Continue ${nice}${part ? `, Part ${part}` : ''}`,
         detail: 'You started this course. A few minutes today keeps you moving toward your certificate.',
         link: `${SITE}/learning/${track}/${slug}`,
       });
       if (items.filter((i) => i.link.includes('/learning/')).length >= 2) break;
     }
   }
 } catch (_) { /* non-blocking */ }

 // STATE 6: unread notifications (messages, decisions, invitations).
 try {
   const unread = await db.collection('notifications').where('userId', '==', user.uid).where('isRead', '==', false).limit(20).get();
   if (unread.size > 0) {
     items.push({
       headline: `You have ${unread.size}${unread.size === 20 ? '+' : ''} unread notification${unread.size === 1 ? '' : 's'}`,
       detail: 'Messages, decisions, and invitations are waiting for you.',
       link: `${SITE}/notifications`,
     });
   }
 } catch (_) { /* non-blocking */ }

 // CRITICAL: nothing pending = no email... UNLESS the user is idle and we
 // want to gently encourage them to join a project in their track. To avoid
 // spamming, this nudge is throttled (at most once every few days per user).
 if (items.length === 0) {
 const NUDGE_COOLDOWN_DAYS = 4;
 const lastNudge = tsToDate(user.lastJoinNudge);
 const cooledDown = !lastNudge || daysSince(lastNudge) >= NUDGE_COOLDOWN_DAYS;

 // Is the user currently idle? (no active project they're a member/lead of)
 const hasActiveWork = involved.some(p =>
 (p.status === 'active' || p.status === 'setup' || p.status === 'lead_recruitment')
 && ((p.members || []).includes(user.uid) || p.submitterId === user.uid)
 );

 if (cooledDown && !hasActiveWork) {
 // Find open projects in the user's track to recommend.
 const userTrack = (user.primarySkillTrack || '').toString().toLowerCase();
 const openInTrack = Object.values(projects).filter(p => {
 const open = p.status === 'lead_recruitment' || p.status === 'active' || p.status === 'open';
 if (!open) return false;
 // Not already involved.
 if ((p.members || []).includes(user.uid) || p.submitterId === user.uid) return false;
 // Match track if we know it; otherwise any open project is fine.
 if (!userTrack) return true;
 const pTrack = (p.track || p.primaryTrack || p.category || '').toString().toLowerCase();
 return !pTrack || pTrack.includes(userTrack) || userTrack.includes(pTrack);
 }).slice(0, 3);

 // Has the user ever completed a project? (shapes the wording)
 const hasCompleted = involved.some(p => p.status === 'completed')
 || (Array.isArray(user.badges) && user.badges.length > 0);

 if (openInTrack.length > 0) {
 const trackLabel = user.primarySkillTrack || 'your track';
 const headline = hasCompleted
 ? `Ready for your next project, ${ (user.displayName || '').split(' ')[0] || 'there'}?`
 : 'Join your first project and start earning badges';
 const detail = hasCompleted
 ? `Great work finishing your last project. Keep your momentum going - here are open ${trackLabel} projects looking for people like you.`
 : `You're all set up. The fastest way to grow and earn your first badge is to join a real project. Here are open ${trackLabel} projects you can join now.`;
 items.push({
 headline,
 detail,
 link: `${SITE}/projects`,
 suggestions: openInTrack.map(p => ({
 title: p.projectTitle || p.title || 'Open project',
 link: `${SITE}/projects/${p.id}`,
 })),
 });
 // Stamp the nudge so we don't repeat it tomorrow.
 try { await db.collection('users').doc(user.uid).update({ lastJoinNudge: new Date() }); } catch (_) {}
 }
 }
 }

 // Test sample (?to=you&sample=1): always send, so staff can see the design.
 if (items.length === 0 && testTo && String(req.query.sample || '') === '1') {
   items.push({
     headline: 'You’re all caught up (sample)',
     detail: 'This is a sample of the daily digest. Members only receive it when something is waiting for them.',
     link: `${SITE}/dashboard`,
   });
 }

 // Still nothing? No email.
 if (items.length === 0) { skipped++; continue; }

 const name = user.displayName || user.email.split('@')[0];
 const isNudgeOnly = items.length === 1 && !!items[0].suggestions;
 const html = renderEmail(name, items, isNudgeOnly);
 try {
 await sendMail({
 to: user.email,
 subject: items.length === 1 ? items[0].headline : `You have ${items.length} things to pick up on She Model Tech`,
 html,
 });
 sent++;
 } catch (e) { console.error(`${user.email}:`, e.message); failed++; }
 }
 try { await db.collection('email_logs').add({ type: 'daily_reminder', timestamp: new Date(), stats: { sent, skipped, failed } }); } catch (_) {}

 // Show the result in Vercel's logs.
 console.log(`Daily digest: ${sent} sent, ${skipped} skipped (nothing pending, opted out, or company), ${failed} failed`);
 return res.json({ success: true, stats: { sent, skipped, failed } });
 } catch (error) {
 console.error('Daily reminder error:', error);
 return res.status(500).json({ success: false, error: error.message });
 }
};

function renderEmail(name, items, isNudgeOnly) {
 const rows = items.map(it => {
 const suggestionsHtml = (it.suggestions && it.suggestions.length)
 ? `<div style="margin:6px 0 12px">${it.suggestions.map(s =>
 `<a href="${s.link}" style="display:block;background:#ffffff;border:1px solid #e5e7eb;border-radius:6px;padding:9px 12px;margin-bottom:6px;text-decoration:none;color:#2563EB;font-size:13px;font-weight:600">${s.title} &rarr;</a>`
 ).join('')}</div>`
 : '';
 const btnLabel = it.suggestions ? 'Browse all projects' : 'Continue';
 return `
 <div style="border-left:4px solid #F97316;background:#fff8f5;border-radius:8px;padding:14px;margin-bottom:10px">
 <p style="margin:0 0 4px;font-size:14px;font-weight:bold;color:#2563EB">${it.headline}</p>
 <p style="margin:0 0 10px;font-size:13px;color:#111827">${it.detail}</p>
 ${suggestionsHtml}
 <a href="${it.link}" style="display:inline-block;background:linear-gradient(135deg,#F97316,#EA580C);color:#ffffff;text-decoration:none;font-weight:600;font-size:13px;padding:8px 16px;border-radius:6px">${btnLabel}</a>
 </div>`;
 }).join('');

 return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
 <body style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;color:#111827">
 <div style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb">
 <div style="background:linear-gradient(135deg,#F97316,#EA580C);color:#fff;padding:24px;text-align:center">
 <h1 style="margin:0;font-size:19px">${isNudgeOnly ? 'There\'s a project waiting for you' : 'Pick up where you left off'}</h1>
 <p style="margin:8px 0 0;font-size:13px;opacity:.95">Hi ${name}, ${isNudgeOnly ? 'here are projects in your track to jump into' : 'here\'s what\'s waiting for you on She Model Tech'}</p>
 </div>
 <div style="padding:22px">
 ${rows}
 <p style="text-align:center;margin-top:16px"><a href="${SITE}/dashboard" style="color:#2563EB;text-decoration:none;font-size:12px;font-weight:600">Go to your dashboard</a></p>
 </div>
 <div style="background:#1f2937;color:#d1d5db;padding:16px;text-align:center;font-size:11px">
 <p style="margin:0"><b>She Model Tech</b> · Ascend. Achieve. Advance.</p>
 <p style="margin:6px 0 0"><a href="${SITE}/settings" style="color:#F97316;text-decoration:none">Manage email settings</a></p>
 </div>
 </div></body></html>`;
}
