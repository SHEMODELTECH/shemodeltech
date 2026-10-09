// lib/companyTasks.js
// Scheduled notices for jobs and company tiers (run from api/cron/project-reminders.js).
//
// jobTasks (every few minutes and daily):
//   - a new job post (open, application window started, posted in the last 3
//     days, not yet announced): members get a bell notice and a phone
//     notification (members under 18 and company accounts are skipped, since
//     they can't apply); staff get an alert. Marked announcedAt.
//   - applications close in 2 days or less: the company is reminded (once per
//     closing date, closingNoticeFor), so changing the date reminds again.
//   - applications closed (in the last 7 days): the company is told (closedNoticeFor).
// tierTasks (daily):
//   - a company tier ends within 7 days: warn the company (once per end date).
//   - a company tier ended: tell the company (once per end date).
const admin = require('./firebaseAdmin');
const { sendMail } = require('./mailer');
const { pushToUids } = require('./push');
const { escapeHtml } = require('./escapeHtml');

const SITE = process.env.SITE_URL || 'https://shemodeltech.com';
const DAY = 86400000;
const esc = (t) => escapeHtml(t || '');
const ts = () => admin.firestore.FieldValue.serverTimestamp();
const isoDay = (ms) => new Date(ms).toISOString().slice(0, 10);
const fmt = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const toMs = (v) => (!v ? null : v.toMillis ? v.toMillis() : v.seconds ? v.seconds * 1000 : new Date(v).getTime() || null);

// Bell + push + email to one account.
const tell = async (db, uid, { type, title, body, link, ctaLabel = 'Open She Model Tech' }) => {
  const snap = await db.collection('users').doc(uid).get().catch(() => null);
  const u = snap && snap.exists ? snap.data() : {};
  await db.collection('notifications').add({
    userId: uid, recipientId: uid, type, title, body, message: `${title} - ${body}`,
    link, isRead: false, read: false, createdAt: ts(),
  });
  await pushToUids([uid], { title, body, link }).catch(() => {});
  if (u.email) {
    await sendMail({
      to: u.email,
      subject: title,
      text: `${title}\n\n${body}\n\n${SITE}${link}`,
      html: `<h2 style="margin:0 0 12px">${esc(title)}</h2><p>${esc(body)}</p><p style="margin:22px 0"><a href="${esc(`${SITE}${link}`)}" style="background:#D41470;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700;display:inline-block">${esc(ctaLabel)}</a></p>`,
    }).catch((e) => console.error('company notice email failed:', e.message));
  }
};

// Applications are accepted between opensOn and closesOn (YYYY-MM-DD).
const windowOf = (job) => {
  const today = isoDay(Date.now());
  const opens = job.opensOn || null;
  const closes = job.closesOn || (job.expiresAt ? String(job.expiresAt).slice(0, 10) : null);
  return { today, opens, closes, open: !(opens && today < opens) && !(closes && today > closes) };
};

async function announceJob(db, job, stats) {
  // Claim the job first: if this run is cut off part way (time limit), the next
  // run (a few minutes later) must not announce it to everyone a second time.
  await db.collection('jobs').doc(job.id).update({ announcedAt: ts() });
  // Only the fields we need, not every member's whole profile.
  const users = await db.collection('users').select('role', 'isCompany', 'isMinor', 'onboardingComplete').get();
  const staff = [];
  const members = [];
  users.docs.forEach((d) => {
    const u = d.data();
    if (['admin', 'editor'].includes(u.role)) staff.push(d.id);
    if (u.isCompany === true || u.isMinor === true || u.onboardingComplete !== true) return;
    if (d.id === job.companyUid) return;
    members.push(d.id);
  });
  const title = `New job: ${job.title}`;
  const body = `${job.companyName || 'A company'} is hiring${job.type ? ` (${String(job.type).replace('-', ' ')})` : ''}. See the details and apply.`;
  const link = `/jobs/${job.id}`;
  for (let i = 0; i < members.length; i += 450) {
    const batch = db.batch();
    members.slice(i, i + 450).forEach((uid) => {
      batch.set(db.collection('notifications').doc(), {
        userId: uid, recipientId: uid, type: 'new_job', title, body, message: title,
        link, jobId: job.id, isRead: false, read: false, createdAt: ts(),
      });
    });
    // eslint-disable-next-line no-await-in-loop
    await batch.commit();
  }
  await pushToUids(members, { title, body, link, level: 'social' }).catch(() => {});
  // Staff: a heads-up that a job went live (bell + push).
  for (let i = 0; i < staff.length; i += 450) {
    const batch = db.batch();
    staff.slice(i, i + 450).forEach((uid) => {
      batch.set(db.collection('notifications').doc(), {
        userId: uid, recipientId: uid, type: 'job_posted', title: 'A company posted a job',
        body: `${job.companyName || 'A company'}: "${job.title}".`, message: 'A company posted a job',
        link, isRead: false, read: false, createdAt: ts(),
      });
    });
    // eslint-disable-next-line no-await-in-loop
    await batch.commit();
  }
  await pushToUids(staff, { title: 'A company posted a job', body: `${job.companyName || 'A company'}: "${job.title}".`, link }).catch(() => {});
  await db.collection('jobs').doc(job.id).update({ announcedTo: members.length });
  stats.jobsAnnounced = (stats.jobsAnnounced || 0) + 1;
}

async function jobTasks(db, stats = {}) {
  const snap = await db.collection('jobs').where('status', '==', 'open').limit(500).get();
  const now = Date.now();
  for (const d of snap.docs) {
    const job = { id: d.id, ...d.data() };
    const w = windowOf(job);
    const created = toMs(job.createdAt) || 0;
    try {
      // New job, now open for applications.
      if (!job.announcedAt && w.open && created > now - 3 * DAY) {
        // eslint-disable-next-line no-await-in-loop
        await announceJob(db, job, stats);
      }
      // Closing in 2 days or less.
      if (w.open && w.closes && job.closingNoticeFor !== w.closes && w.closes <= isoDay(now + 2 * DAY)) {
        // eslint-disable-next-line no-await-in-loop
        await tell(db, job.companyUid, {
          type: 'job_closing',
          title: 'Your job post closes soon',
          body: `Applications for "${job.title}" close on ${fmt(w.closes)}. Edit the post to extend the date, or let it close.`,
          link: `/jobs/${encodeURIComponent(job.id)}/edit`,
          ctaLabel: 'Edit the post',
        });
        // eslint-disable-next-line no-await-in-loop
        await d.ref.update({ closingNoticeFor: w.closes });
      }
      // Closed in the last 7 days.
      if (w.closes && w.today > w.closes && w.closes >= isoDay(now - 7 * DAY) && job.closedNoticeFor !== w.closes) {
        // eslint-disable-next-line no-await-in-loop
        await tell(db, job.companyUid, {
          type: 'job_closed',
          title: 'Applications have closed',
          body: `"${job.title}" no longer takes applications. To reopen it, edit the post and set new dates.`,
          link: '/jobs/mine',
          ctaLabel: 'Your job posts',
        });
        // eslint-disable-next-line no-await-in-loop
        await d.ref.update({ closedNoticeFor: w.closes });
      }
    } catch (e) {
      console.error(`job ${job.id} notice failed:`, e.message);
    }
  }
  return stats;
}

async function tierTasks(db, stats = {}) {
  const snap = await db.collection('users').where('isCompany', '==', true).get();
  const now = Date.now();
  for (const d of snap.docs) {
    const u = d.data();
    if (!u.companyTier) continue;
    const until = toMs(u.companyTierUntil);
    if (!until) continue; // no end date
    const key = isoDay(until);
    const label = u.companyTier === 'supporter' ? 'Supporter' : 'Champion';
    try {
      if (until > now && until - now <= 7 * DAY && u.tierEndingNoticeFor !== key) {
        // eslint-disable-next-line no-await-in-loop
        await tell(db, d.id, {
          type: 'tier_ending',
          title: `Your ${label} tier ends soon`,
          body: `Your ${label} tier ends on ${fmt(key)}. Renew to keep posting jobs and unlimited messaging.`,
          link: '/premium',
          ctaLabel: 'Renew',
        });
        // eslint-disable-next-line no-await-in-loop
        await d.ref.update({ tierEndingNoticeFor: key });
        stats.tierWarnings = (stats.tierWarnings || 0) + 1;
      }
      if (until <= now && u.tierEndedNoticeFor !== key) {
        // eslint-disable-next-line no-await-in-loop
        await tell(db, d.id, {
          type: 'tier_ended',
          title: `Your ${label} tier has ended`,
          body: 'Your company is now on the free plan: the Talent Board stays open, with up to 5 new conversations a month. Job posting needs a tier.',
          link: '/premium',
          ctaLabel: 'See company tiers',
        });
        // eslint-disable-next-line no-await-in-loop
        await d.ref.update({ tierEndedNoticeFor: key });
        stats.tierEnded = (stats.tierEnded || 0) + 1;
      }
    } catch (e) {
      console.error(`tier notice for ${d.id} failed:`, e.message);
    }
  }
  return stats;
}

module.exports = { jobTasks, tierTasks, windowOf };
