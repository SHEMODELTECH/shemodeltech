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
// Timestamps or ISO strings.
const anyDate = (v) => {
 if (!v) return null;
 const t = tsToDate(v);
 if (t) return t;
 const d = new Date(v);
 return isNaN(d) ? null : d;
};

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

 // Cohorts published in the last day (shown to everyone on the daily email).
 let newCohorts = [];
 try {
 const since = admin.firestore.Timestamp.fromDate(new Date(Date.now() - 24 * 3600 * 1000));
 const cs = await db.collection('cohorts').where('publishedAt', '>=', since).get();
 newCohorts = cs.docs.map((d) => ({ id: d.id, ...d.data() }));
 } catch (_) { /* optional */ }

 // Batches: at 500+ members (Gmail's daily limit), email half the members
 // one weekday and the other half the next. Each member keeps her half.
 const BATCH_AT = 500;
 const halfOf = (uid) => [...String(uid)].reduce((n, ch) => n + ch.charCodeAt(0), 0) % 2;
 const eligible = usersSnap.docs.filter(d => {
 const u = d.data();
 return u.email && u.email.includes('@') && !u.isCompany && !(u.emailPreferences && u.emailPreferences.reminders === false);
 }).length;
 const batching = !testTo && eligible >= BATCH_AT;
 const todaysHalf = Math.floor(Date.now() / 86400000) % 2;
 if (batching) console.log(`Daily digest: ${eligible} members, sending batch ${todaysHalf + 1} of 2 today`);

 for (const uDoc of usersSnap.docs) {
 const user = { uid: uDoc.id, ...uDoc.data() };
 if (batching && halfOf(user.uid) !== todaysHalf) { skipped++; continue; }
 if (!user.email || !user.email.includes('@')) { skipped++; continue; }
 // Respect opt-out (default ON unless explicitly disabled).
 if (user.emailPreferences && user.emailPreferences.reminders === false) { skipped++; continue; }
 if (user.isCompany) { skipped++; continue; }
 // "3 times a week" members: Monday, Wednesday and Friday only.
 if (user.emailPreferences?.dailyFrequency === '3x' && ![1, 3, 5].includes(new Date().getUTCDay())) { skipped++; continue; }

 const items = []; // each: { headline, detail, link }
 const firstName = (user.displayName || '').split(' ')[0] || 'there';

 // Gather the projects this user is involved in.
 const involved = Object.values(projects).filter(p =>
 (p.members || []).includes(user.uid) ||
 p.submitterId === user.uid
 );

 // WELCOME (new members, first 2 weeks): day 2 and day 7, until she joins a project.
 const createdAt = anyDate(user.createdAt);
 const onAProject = involved.some(p => ['active', 'setup', 'lead_recruitment', 'overdue', 'completed'].includes(p.status));
 if (createdAt && daysSince(createdAt) <= 14 && !onAProject) {
 const age = daysSince(createdAt);
 if (age >= 7 && !user.welcome?.day7) {
 items.push({
 headline: `${firstName}, your first project is waiting`,
 detail: 'Most members join their first project in week one. Pick one that interests you and tap Join: lead it, or join the team. No experience needed, your team and lead will help you grow.',
 link: `${SITE}/projects`,
 });
 if (!testTo) db.collection('users').doc(user.uid).update({ 'welcome.day7': new Date().toISOString() }).catch(() => {});
 } else if (age >= 2 && age < 7 && !user.welcome?.day2) {
 items.push({
 headline: `Getting started, ${firstName}`,
 detail: 'Three steps to your first badge: 1) Take a short course in Learning. 2) Tap Join on a project and choose your badge track. 3) Meet your team in the workspace. You’ve got this.',
 link: `${SITE}/learning`,
 });
 if (!testTo) db.collection('users').doc(user.uid).update({ 'welcome.day2': new Date().toISOString() }).catch(() => {});
 }
 }

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

 // STATE 3b: the lead of a running project who went quiet for a few days.
 if (p.submitterId === user.uid && !isMember && p.status === 'active' && projActivity && daysSince(projActivity) >= QUIET_DAYS) {
 items.push({
 headline: `Your team on "${title}" needs its lead`,
 detail: `It's been ${daysSince(projActivity)} days since you were in the workspace. Check in with your team and keep the project moving.`,
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

 // STATE 4b: tapped "Lead this project" but never submitted the lead application.
 try {
 const intents = await db.collection('lead_intent').where('uid', '==', user.uid).get();
 if (!intents.empty) {
 const apps = await db.collection('lead_applications').where('applicantUid', '==', user.uid).get();
 const applied = apps.docs.some(d => ['submitted', 'interview_scheduled', 'accepted', 'assigned'].includes(d.data().status));
 if (!applied) {
 const pid = intents.docs[0].data().projectId;
 const title = projects[pid]?.projectTitle || 'the project';
 items.push({
 headline: 'Finish your lead application',
 detail: `You started applying to lead "${title}", but it hasn't been sent yet. It only takes a few minutes: fill it in and tap Submit.`,
 link: `${SITE}/apply-to-lead?project=${pid}`,
 });
 }
 }
 } catch (_) { /* optional */ }

 // STATE 7: a new cohort was published in the last day.
 for (const c of newCohorts) {
 if (c.isPaid && user.isMinor) continue; // paid cohorts are 18 and older
 items.push({
 headline: `New cohort: ${c.name || 'projects are open'}`,
 detail: c.isPaid ? `Paid cohort, $${Number(c.payPerPerson) || 0} per person. Apply to lead or join a team.` : 'Free cohort. Apply to lead or join a team and earn a badge.',
 link: `${SITE}/projects`,
 });
 }

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

 // JOIN A PROJECT
 // - Members not on any project: a join suggestion every Monday, Wednesday and Friday.
 // - Any member with nothing else waiting: always a join suggestion, so
 //   every member hears from She Model Tech each weekday.
 {
 const hasActiveWork = involved.some(p =>
 ['active', 'setup', 'lead_recruitment', 'overdue'].includes(p.status)
 && ((p.members || []).includes(user.uid) || p.submitterId === user.uid)
 );
 const weekday = new Date().getUTCDay(); // 1 Mon, 3 Wed, 5 Fri
 const joinDay = weekday === 1 || weekday === 3 || weekday === 5;
 if ((joinDay && !hasActiveWork) || items.length === 0) {
 const userTrack = (user.primarySkillTrack || '').toString().toLowerCase();
 const joinable = Object.values(projects).filter(p => {
 // Needs a lead, coming soon (a lead is setting up), or open for applications.
 if (!['lead_recruitment', 'setup', 'active', 'open'].includes(p.status)) return false;
 if (p.isActive === false) return false;
 if (user.isMinor && (p.isPaid || p.cohortPaid)) return false; // paid is 18+
 if ((p.members || []).includes(user.uid) || p.submitterId === user.uid) return false;
 return true;
 });
 // Her track first, then any other project.
 const inTrack = (p) => {
 const pTrack = (p.track || p.primaryTrack || p.category || '').toString().toLowerCase();
 return userTrack && pTrack && (pTrack.includes(userTrack) || userTrack.includes(pTrack));
 };
 const picks = [...joinable.filter(inTrack), ...joinable.filter(p => !inTrack(p))].slice(0, 3);
 const hasCompleted = involved.some(p => p.status === 'completed')
 || (Array.isArray(user.badges) && user.badges.length > 0);
 const first = (user.displayName || '').split(' ')[0] || 'there';

 if (picks.length > 0) {
 const headline = hasActiveWork
 ? `More projects you can join, ${first}`
 : hasCompleted ? `Ready for your next project, ${first}?` : 'Join a project and start earning badges';
 const detail = hasActiveWork
 ? 'These projects are looking for people right now.'
 : hasCompleted
 ? 'Great work finishing your last project. Keep your momentum going with one of these.'
 : 'The fastest way to grow and earn your first badge is to join a real project. Here are projects you can join now.';
 items.push({
 headline,
 detail: `${detail} On a project that is coming soon, tap Join to apply to lead it or join the team.`,
 link: `${SITE}/projects`,
 suggestions: picks.map(p => ({ title: p.projectTitle || p.title || 'Open project', link: `${SITE}/projects/${p.id}` })),
 });
 } else {
 // Nothing to join right now: point her to the lead waitlist.
 items.push({
 headline: 'Want to lead a project?',
 detail: "New cohorts open throughout the year. Join the lead waitlist and we'll email you when a project needs a lead.",
 link: `${SITE}/apply-to-lead`,
 });
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
 // WE MISS YOU: not on the site for 30+ days. One warm message (at most
 // once a month) instead of the usual list.
 const lastSeen = anyDate(user.lastSeenAt);
 if (lastSeen && daysSince(lastSeen) >= 30 && daysSince(anyDate(user.missYouAt)) >= 30) {
 const openCount = Object.values(projects).filter(p => ['lead_recruitment', 'setup', 'active'].includes(p.status) && p.isActive !== false).length;
 items.length = 0;
 items.push({
 headline: `We miss you, ${firstName}!`,
 detail: `It’s been a while, and a lot has happened at She Model Tech. ${openCount > 0 ? `There ${openCount === 1 ? 'is 1 project' : `are ${openCount} projects`} you can join right now.` : 'New cohorts open throughout the year.'} One easy step back in: open Projects and tap Join on one that interests you.`,
 link: `${SITE}/projects`,
 });
 if (!testTo) db.collection('users').doc(user.uid).update({ missYouAt: new Date().toISOString() }).catch(() => {});
 }

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
 `<a href="${s.link}" style="display:block;background:#ffffff;border:1px solid #E5E5E5;border-radius:6px;padding:9px 12px;margin-bottom:6px;text-decoration:none;color:#D41470;font-size:13px;font-weight:600">${s.title} &rarr;</a>`
 ).join('')}</div>`
 : '';
 const btnLabel = it.suggestions ? 'Browse all projects' : 'Continue';
 return `
 <div style="border-left:4px solid #D97706;background:#fff8f5;border-radius:8px;padding:14px;margin-bottom:10px">
 <p style="margin:0 0 4px;font-size:14px;font-weight:bold;color:#D41470">${it.headline}</p>
 <p style="margin:0 0 10px;font-size:13px;color:#111111">${it.detail}</p>
 ${suggestionsHtml}
 <a href="${it.link}" style="display:inline-block;background:linear-gradient(135deg,#D97706,#D97706);color:#ffffff;text-decoration:none;font-weight:600;font-size:13px;padding:8px 16px;border-radius:6px">${btnLabel}</a>
 </div>`;
 }).join('');

 return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
 <body style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;color:#111111">
 <div style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E5E5E5">
 <div style="background:linear-gradient(135deg,#D97706,#D97706);color:#fff;padding:24px;text-align:center">
 <h1 style="margin:0;font-size:19px">${isNudgeOnly ? 'There\'s a project waiting for you' : 'Pick up where you left off'}</h1>
 <p style="margin:8px 0 0;font-size:13px;opacity:.95">Hi ${name}, ${isNudgeOnly ? 'here are projects in your track to jump into' : 'here\'s what\'s waiting for you on She Model Tech'}</p>
 </div>
 <div style="padding:22px">
 ${rows}
 <p style="text-align:center;margin-top:16px"><a href="${SITE}/dashboard" style="color:#D41470;text-decoration:none;font-size:12px;font-weight:600">Go to your dashboard</a></p>
 </div>
 <div style="background:#262626;color:#D4D4D4;padding:16px;text-align:center;font-size:11px">
 <p style="margin:0"><b>She Model Tech</b> · Ascend. Achieve. Advance.</p>
 <p style="margin:6px 0 0"><a href="${SITE}/settings" style="color:#D97706;text-decoration:none">Manage email settings</a></p>
 </div>
 </div></body></html>`;
}
