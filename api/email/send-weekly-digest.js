// =================================================================
// api/email/send-weekly-digest.js, She Model Tech Weekly Digest
// Cron: Sundays 9 AM. A clean, professional weekly summary.
// =================================================================

const { sendMail } = require('../../lib/mailer');
const { subDays } = require('date-fns');
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
 console.log('Starting She Model Tech weekly digest...');

 const sevenDaysAgo = subDays(new Date(), 7);

 const safeFetch = async (col, dateField, since, lim = 20) => {
 try {
 const snap = await db.collection(col).where(dateField, '>=', since).orderBy(dateField, 'desc').limit(lim).get();
 return snap.docs.map(d => ({ id: d.id, ...d.data() }));
 } catch (e) { console.warn(`${col}:`, e.message); return []; }
 };

 const safeCount = async (col, dateField, since) => {
 try {
 const snap = await db.collection(col).where(dateField, '>=', since).get();
 return snap.size;
 } catch (e) { return 0; }
 };

 // Fetch this week's platform content (only what She Model Tech actually has).
 // There is no job board. The second list is paid projects posted by
 // verified companies (company_cohorts) that are open for applications.
 const [cohortsNew, paidRaw, newCourses] = await Promise.all([
 // New She Model Tech cohorts published this week (free and paid).
 safeFetch('cohorts', 'publishedAt', sevenDaysAgo),
 Promise.resolve([]),
 // New mentor courses published to She Model Tech Learning this week.
 safeFetch('learning_courses', 'publishedAt', sevenDaysAgo),
 ]);
 const paid = paidRaw.filter(c => c.status === 'hiring');
 // Projects that became visible this week, from the new cohorts.
 let projects = [];
 for (const c of cohortsNew.slice(0, 5)) {
 try {
 const ps = await db.collection('projects').where('cohortId', '==', c.id).where('isActive', '==', true).limit(5).get();
 ps.forEach((d) => projects.push({ id: d.id, ...d.data(), cohortPaid: !!c.isPaid }));
 } catch (_) { /* optional */ }
 }
 const newMembersCount = await safeCount('users', 'createdAt', sevenDaysAgo);

 console.log(`Week: ${projects.length} projects, ${paid.length} paid projects, ${newCourses.length} new courses, ${newMembersCount} new members`);

 // Every individual member gets it, unless she turned the weekly email off.
 const allUsers = await db.collection('users').get();
 let users = allUsers.docs
 .map(d => ({ uid: d.id, ...d.data() }))
 .filter(u => u.email?.includes('@') && !u.isCompany && u.emailPreferences?.weeklyDigest !== false)
 .map(u => ({ uid: u.uid, email: u.email, displayName: u.displayName, isMinor: !!u.isMinor }));
 if (users.length === 0 && !testTo) {
 return res.json({ success: true, message: 'No members to email' });
 }
 // Batches: under 500 members everyone gets it on Sunday. At 500+ (Gmail's
 // daily limit), half on Sunday and half on Monday; each member keeps her half.
 if (!testTo) {
 const BATCH_AT = 500;
 const halfOf = (uid) => [...String(uid)].reduce((n, ch) => n + ch.charCodeAt(0), 0) % 2;
 const monday = new Date().getUTCDay() === 1;
 if (users.length >= BATCH_AT) {
 users = users.filter(u => halfOf(u.uid) === (monday ? 1 : 0));
 console.log(`Weekly digest: sending batch ${monday ? 2 : 1} of 2 (${users.length} members)`);
 } else if (monday) {
 return res.json({ success: true, message: 'Under 500 members: everyone was emailed on Sunday' });
 }
 }
 if (testTo) {
   // Test run: just this address (it must be a member, so the email has real data).
   const one = await db.collection('users').where('email', '==', testTo).limit(1).get();
   users = one.docs.map(d => ({ uid: d.id, email: d.data().email, displayName: d.data().displayName, isMinor: !!d.data().isMinor }));
   if (!users.length) return res.status(404).json({ success: false, error: `No member with email ${testTo}` });
 }
 console.log(`${users.length} members to email (weekly)`);

 // Per-user weekly activity, only She Model Tech's real notification types.
 for (const user of users) {
 try {
 const notifSnap = await db.collection('notifications')
 .where('userId', '==', user.uid)
 .where('createdAt', '>=', sevenDaysAgo)
 .orderBy('createdAt', 'desc').limit(100).get();
 const notifs = notifSnap.docs.map(d => d.data());

 user.applications = notifs.filter(n => n.type === 'project_application');
 user.approvals = notifs.filter(n => n.type === 'application_approved');
 user.badges = notifs.filter(n => n.type === 'project_completed' || n.type === 'badge_awarded');

 const convSnap = await db.collection('conversations')
 .where('participants', 'array-contains', user.uid).get();
 user.unreadMessages = 0;
 convSnap.docs.forEach(d => { user.unreadMessages += (d.data().unreadBy?.[user.uid] || 0); });
 } catch (e) {
 user.applications = []; user.approvals = []; user.badges = []; user.unreadMessages = 0;
 }
 }

 // Each member's own projects: ongoing ones (never completed), and any she
 // completed this week.
 let mine = [];
 try {
 const ms = await db.collection('projects').where('status', 'in', ['setup', 'active', 'overdue', 'completed']).get();
 mine = ms.docs.map(d => ({ id: d.id, ...d.data() }));
 } catch (_) { /* optional */ }
 const toDate = (v) => (v?.toDate ? v.toDate() : v ? new Date(v) : null);
 const daysLeftOf = (p) => {
 const end = toDate(p.endDate);
 if (!end || isNaN(end)) return null;
 return Math.ceil((end - new Date()) / 86400000);
 };
 const yourProjects = (user) => {
 const involved = mine.filter(p => (p.members || []).includes(user.uid) || p.submitterId === user.uid);
 const ongoing = involved.filter(p => ['setup', 'active', 'overdue'].includes(p.status));
 const doneThisWeek = involved.filter(p => p.status === 'completed' && toDate(p.completedAt) >= sevenDaysAgo);
 if (!ongoing.length && !doneThisWeek.length) return '';
 const label = { setup: 'Setting up', active: 'Active', overdue: 'Past the deadline' };
 const row = (p) => {
 const lead = p.submitterId === user.uid;
 const left = daysLeftOf(p);
 const when = p.status === 'overdue' ? 'Finish up and submit for review'
 : left == null ? '' : left > 1 ? `${left} days left` : left === 1 ? '1 day left' : left === 0 ? 'Due today' : '';
 return `<div class="it"><h3><a href="${SITE}/projects/${p.id}/workspace" style="color:#111111;text-decoration:none">${p.projectTitle || 'Project'}</a></h3><p>${lead ? 'You lead this project' : 'Team member'} · ${label[p.status]}${when ? ` · ${when}` : ''}</p></div>`;
 };
 return `<div class="sc"><h2>Your Projects</h2>
${ongoing.map(row).join('')}
${doneThisWeek.map(p => `<div class="it"><h3>Completed this week: ${p.projectTitle || 'Project'}</h3><p>Well done! See your badge and certificate in the <a href="${SITE}/project-vault" style="color:#D41470">Project Vault</a>.</p></div>`).join('')}
</div>`;
 };

 // Projects members can join right now, grouped (not only this week's).
 let joinable = [];
 try {
 const js = await db.collection('projects').where('status', 'in', ['lead_recruitment', 'setup', 'active']).get();
 joinable = js.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.isActive !== false && p.reviewStatus !== 'rejected');
 } catch (_) { /* optional */ }
 const groupsFor = (user) => {
 const ok = joinable.filter(p => !(user.isMinor && (p.isPaid || p.cohortPaid))); // paid is 18+
 return {
 needsLead: ok.filter(p => p.status === 'lead_recruitment' && !p.leadConfirmed).slice(0, 4),
 comingSoon: ok.filter(p => p.status === 'setup').slice(0, 4),
 open: ok.filter(p => p.status === 'active').slice(0, 4),
 };
 };
 const joinSection = (user) => {
 const g = groupsFor(user);
 const row = (p, note) => `<div class="it"><h3><a href="${SITE}/projects/${p.id}" style="color:#111111;text-decoration:none">${p.projectTitle || 'Project'}</a></h3><p>${note}${(p.isPaid || p.cohortPaid) ? ' · Paid, 18 and older' : ''}</p></div>`;
 const block = (title, list, note) => list.length ? `<p style="margin:10px 0 6px;font-size:12px;font-weight:bold;color:#404040;text-transform:uppercase;letter-spacing:.04em">${title}</p>${list.map(p => row(p, note)).join('')}` : '';
 const waitlist = g.needsLead.length === 0
 ? `<p style="font-size:12px;color:#111111;margin:10px 0 0">Want to lead a project? No project needs a lead right now. <a href="${SITE}/apply-to-lead" style="color:#D41470">Join the lead waitlist</a> and we'll email you when one does.</p>`
 : '';
 if (!g.needsLead.length && !g.comingSoon.length && !g.open.length) {
 return `<div class="sc"><h2>Projects You Can Join</h2><p style="font-size:12px;color:#111111">New cohorts open throughout the year.</p>${waitlist}</div>`;
 }
 return `<div class="sc"><h2>Projects You Can Join</h2>
${block('Needs a lead', g.needsLead, 'Tap Join to apply to lead it or join the team')}
${block('Coming soon', g.comingSoon, 'A lead is setting up roles. Tap Join to be told when roles open')}
${block('Open for applications', g.open, 'Apply for a role now')}
${waitlist}
<a href="${SITE}/projects" class="btn" style="color:#ffffff">See all projects</a></div>`;
 };

 // ── Weekly email template (clean, on-brand, no emojis) ──────────
 const generateEmail = (user) => {
 const name = user.displayName || user.email.split('@')[0];
 const weekStart = subDays(new Date(), 7).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
 const weekEnd = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
 const totalActivity = user.applications.length + user.approvals.length + user.badges.length + user.unreadMessages;

 return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
body{font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;line-height:1.6;color:#111111}
.c{background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E5E5E5}
.hd{background:linear-gradient(135deg,#D97706,#D97706);color:#fff;padding:28px;text-align:center}
.hd h1{margin:0;font-size:21px}.hd p{margin:8px 0 0;font-size:13px;opacity:.95}
.ct{padding:24px}
.sc{margin-bottom:24px}.sc h2{color:#D41470;font-size:15px;border-bottom:2px solid #D41470;padding-bottom:6px;margin-bottom:14px}
.sts{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0}
.st{flex:1;min-width:80px;text-align:center;background:#FDF2F7;padding:12px 4px;border-radius:8px}
.sn{font-size:22px;font-weight:bold;color:#D41470}.sl{font-size:9px;color:#111111;text-transform:uppercase;letter-spacing:.04em}
.it{padding:12px;margin-bottom:8px;border-radius:8px;border-left:4px solid #D97706;background:#fff8f5}
.it h3{margin:0 0 4px;font-size:13px;color:#111111}.it p{margin:0;font-size:12px;color:#111111}
.btn{display:block;padding:12px;border-radius:8px;text-decoration:none;text-align:center;font-weight:600;font-size:13px;margin:6px 0;color:#ffffff !important;background:linear-gradient(135deg,#D97706,#D97706)}
.btn.blue{background:linear-gradient(135deg,#D41470,#D41470)}
.ft{background:#262626;color:#D4D4D4;padding:18px;text-align:center;font-size:11px}.ft a{color:#D97706;text-decoration:none}
</style></head><body><div class="c">
<div class="hd"><h1>Your Weekly Recap</h1><p>Hi ${name}, here is your week on She Model Tech</p>
<div style="margin-top:8px;font-size:11px;opacity:.85">${weekStart} to ${weekEnd}</div></div>
<div class="ct">

<div class="sc"><h2>Your Week in Numbers</h2>
<div class="sts">
<div class="st"><div class="sn">${user.applications.length}</div><div class="sl">Applications</div></div>
<div class="st"><div class="sn">${user.approvals.length}</div><div class="sl">Approvals</div></div>
<div class="st"><div class="sn">${user.badges.length}</div><div class="sl">Badges</div></div>
<div class="st"><div class="sn">${user.unreadMessages}</div><div class="sl">Messages</div></div>
</div>
${user.unreadMessages > 0 ? `<div class="it" style="border-left-color:#D41470;background:#FDF2F7"><p>You have <b>${user.unreadMessages} unread message${user.unreadMessages>1?'s':''}</b> waiting.</p></div>` : ''}
${user.badges.length > 0 ? `<div class="it" style="border-left-color:#22C55E;background:#f0fdf4"><p>You earned <b>${user.badges.length} badge${user.badges.length>1?'s':''}</b> this week. Well done.</p></div>` : ''}
${totalActivity === 0 ? `<p style="color:#111111;font-size:12px;text-align:center">A quiet week. Join a project or share a Proof Wall update to get going.</p>` : ''}
<a href="${SITE}/notifications" class="btn" style="color:#ffffff">View all activity</a>
</div>

<div class="sc"><h2>Platform This Week</h2>
<div class="sts">
<div class="st"><div class="sn">${projects.length}</div><div class="sl">New Projects</div></div>
<div class="st"><div class="sn">${paid.length}</div><div class="sl">Paid Projects</div></div>
<div class="st"><div class="sn">${newMembersCount}</div><div class="sl">New Members</div></div>
</div></div>

${cohortsNew.length > 0 ? `<div class="sc"><h2>New Cohorts This Week</h2>
${cohortsNew.slice(0,4).map(c => `<div class="it">
<h3>${c.name || 'New cohort'}</h3>
<p>${c.isPaid ? `Paid cohort · $${Number(c.payPerPerson) || 0} per person · 18 and older` : 'Free cohort · earn a badge'} · apply to lead or join a team</p>
</div>`).join('')}
<a href="${SITE}/projects" class="btn" style="color:#ffffff">See the projects</a></div>` : ''}

${yourProjects(user)}

${joinSection(user)}

${projects.length > 0 ? `<div class="sc"><h2>New Projects to Join</h2>
${projects.slice(0,5).map(p => `<div class="it">
<h3>${p.projectTitle || 'Project'}</h3>
<p>${(p.projectDescription || '').substring(0, 90)}${(p.projectDescription||'').length > 90 ? '...' : ''}</p>
</div>`).join('')}
<a href="${SITE}/projects" class="btn" style="color:#ffffff">Browse projects</a></div>` : ''}

${paid.length > 0 ? `<div class="sc"><h2>New Paid Projects</h2>
${paid.slice(0,4).map(c => `<div class="it">
<h3>${c.title || 'Paid project'}</h3>
<p>${c.companyName || ''} · earn a badge to apply</p>
</div>`).join('')}
<a href="${SITE}/projects" class="btn" style="color:#ffffff">See paid projects</a></div>` : ''}

${newCourses.length > 0 ? `<div class="sc"><h2>New Courses from Our Mentors</h2>
${newCourses.slice(0,4).map(c => `<div class="it">
<h3><a href="${SITE}/learning/${c.track}/p-${c.id}" style="color:#111111;text-decoration:none">${c.title || 'New course'}</a></h3>
<p>${[c.level, c.authorName ? `by ${c.authorName}` : ''].filter(Boolean).join(' · ')}${c.summary ? ` · ${c.summary.substring(0, 80)}${c.summary.length > 80 ? '...' : ''}` : ''}</p>
</div>`).join('')}
<a href="${SITE}/learning" class="btn" style="color:#ffffff">Browse free courses</a></div>` : ''}

<div class="sc"><h2>Quick Links</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:6px"><tr>
<td width="33%" align="center" style="background:#FDF2F7;border:1px solid #bfdbfe;border-radius:8px;padding:14px 4px"><a href="${SITE}/proof-wall" style="color:#D41470;text-decoration:none;font-weight:600;font-size:12px">Proof Wall</a></td>
<td width="33%" align="center" style="background:#FDF2F7;border:1px solid #bfdbfe;border-radius:8px;padding:14px 4px"><a href="${SITE}/messages" style="color:#D41470;text-decoration:none;font-weight:600;font-size:12px">Messages</a></td>
<td width="33%" align="center" style="background:#FDF2F7;border:1px solid #bfdbfe;border-radius:8px;padding:14px 4px"><a href="${SITE}/talent-board" style="color:#D41470;text-decoration:none;font-weight:600;font-size:12px">Talent Board</a></td>
</tr></table></div>

</div>
<div class="ft"><p><b>She Model Tech</b></p><p><a href="${SITE}/proof-wall">Proof Wall</a> · <a href="${SITE}/projects">Projects</a> · <a href="${SITE}/learning">Learning</a> · <a href="${SITE}/settings">Email settings</a></p>
<p style="margin-top:6px">Weekly digest · ${new Date().getFullYear()} She Model Tech</p></div>
</div></body></html>`;
 };

 // Send emails
 let successful = 0, failed = 0;
 for (const user of users) {
 try {
 const eng = user.applications.length + user.approvals.length + user.badges.length + user.unreadMessages;
 const range = `${subDays(new Date(),7).toLocaleDateString('en-US',{month:'short',day:'numeric'})} to ${new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'})}`;
 const subj = eng > 0
 ? `Your She Model Tech week: ${eng} update${eng>1?'s':''} (${range})`
 : `Your She Model Tech weekly recap (${range})`;
 await sendMail({ to: user.email, subject: subj, html: generateEmail(user) });
 successful++;
 } catch (err) { console.error(`${user.email}:`, err.message); failed++; }
 }

 try { await db.collection('email_logs').add({ type: 'weekly_digest', timestamp: new Date(), stats: { recipients: users.length, successful, failed } }); } catch (_) {}

 console.log(`Weekly digest: ${successful} sent, ${failed} failed`);
 return res.json({ success: true, stats: { recipients: users.length, successful, failed } });

 } catch (error) {
 console.error('Weekly digest error:', error);
 return res.status(500).json({ success: false, error: error.message });
 }
};
