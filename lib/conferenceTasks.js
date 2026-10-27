// lib/conferenceTasks.js
// Daily: tell admins and editors about new She Model Tech Conference
// registrations from the last 24 hours (one summary, not one alert per person).
// Bell notification and email. Runs from the daily job (api/cron/project-reminders).
const { sendMail } = require('./mailer');
const { escapeHtml } = require('./escapeHtml');

const SITE = process.env.SITE_URL || 'https://shemodeltech.com';

const conferenceDigest = async (db, admin) => {
  const since = admin.firestore.Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);
  const fresh = await db.collection('conference_registrations').where('createdAt', '>=', since).get();
  if (fresh.empty) return 0;
  const total = (await db.collection('conference_registrations').count().get()).data().count;
  const names = fresh.docs.map((d) => d.data().name || 'A member').slice(0, 30);
  const n = fresh.size;
  const title = `${n} new conference registration${n === 1 ? '' : 's'} (${total} in total)`;
  const body = `In the last 24 hours: ${names.join(', ')}${fresh.size > names.length ? ', and more' : ''}.`;
  const staff = await db.collection('users').where('role', 'in', ['admin', 'editor']).get();
  await Promise.all(staff.docs.map(async (u) => {
    await db.collection('notifications').add({
      userId: u.id, recipientId: u.id, type: 'conference_digest', title, body, message: `${title} - ${body}`,
      link: '/admin?tab=conference', isRead: false, read: false, createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const email = u.data().email;
    if (email) {
      await sendMail({
        to: email,
        subject: `She Model Tech Conference: ${title}`,
        text: `${title}\n\n${body}\n\nSee the list in Admin → Conference: ${SITE}/admin?tab=conference`,
        html: `<p><strong>${escapeHtml(title)}</strong></p><p>${escapeHtml(body)}</p><p><a href="${SITE}/admin?tab=conference">See the list in Admin → Conference</a></p>`,
      }).catch(() => {});
    }
  }));
  return n;
};

module.exports = { conferenceDigest };
