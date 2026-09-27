// api/public-request.js
// Alerts She Model Tech about a new organization request or Summit partner
// request (signed in or not): a bell notification for staff, an email to the
// team inbox (SUPPORT_EMAIL) and to staff, and a confirmation to the requester.
//
// Safe to call without sign-in because it only acts on a real document that was
// created in the last 15 minutes and hasn't been alerted yet; it never sends
// anything the caller writes, only a notice pointing staff to the Admin tabs.
const admin = require('../lib/firebaseAdmin');
const { sendMail } = require('../lib/mailer');

const SITE = process.env.SITE_URL || 'https://shemodeltech.com';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'shemodeltech@gmail.com';
const KINDS = {
  org: { col: 'org_requests', title: (d) => `New organization request: ${d.orgName || 'an organization'}` },
  partner: { col: 'summitPartners', title: (d) => `New Summit partner request: ${d.companyName || 'a company'}` },
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', SITE);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const kind = KINDS[req.body?.kind];
  const id = String(req.body?.id || '');
  if (!kind || !/^[A-Za-z0-9]{10,40}$/.test(id)) return res.status(400).json({ error: 'Bad request' });

  const db = admin.firestore();
  const ref = db.collection(kind.col).doc(id);
  try {
    const result = await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) return null;
      const d = snap.data();
      const created = d.createdAt?.toMillis ? d.createdAt.toMillis() : 0;
      if (d.staffAlerted || Date.now() - created > 15 * 60 * 1000) return null;
      tx.update(ref, { staffAlerted: true });
      return d;
    });
    if (!result) return res.status(200).json({ ok: true, skipped: true });

    const title = kind.title(result);
    const staff = await db.collection('users').where('role', 'in', ['admin', 'editor']).get();
    const esc = (t) => String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const lines = req.body.kind === 'org'
      ? [['Organization', result.orgName], ['Type', result.orgType], ['Interested in', result.type], ['Learners', result.learners], ['Format', result.format], ['Timeline', result.timeline], ['Topics', result.topics], ['Courses', result.courses], ['Contact', `${result.contactName || ''} <${result.contactEmail || ''}> ${result.contactPhone || ''}`], ['Message', result.message]]
      : [['Company', result.companyName], ['Option', result.option], ['Contact', `${result.contactName || ''} <${result.contactEmail || ''}>`], ['Message', result.message]];
    const detailHtml = lines.filter(([, v]) => v).map(([k, v]) => `<p><strong>${k}:</strong> ${esc(v)}</p>`).join('');
    const detailText = lines.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');
    // The team inbox always gets the full request.
    await sendMail({
      to: SUPPORT_EMAIL,
      replyTo: result.contactEmail || undefined,
      subject: title,
      text: `${title}\n\n${detailText}\n\nManage it in the Admin dashboard: ${SITE}/admin`,
      html: `<p><strong>${esc(title)}</strong></p>${detailHtml}<p><a href="${SITE}/admin">Manage it in the Admin dashboard</a></p>`,
    }).catch(() => {});
    // A confirmation for the person who sent it.
    if (result.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.contactEmail)) {
      await sendMail({
        to: result.contactEmail,
        subject: 'We received your request - She Model Tech',
        text: `Thank you for contacting She Model Tech. We received your request and will reply within a few working days.\n\n${detailText}`,
        html: `<p>Thank you for contacting She Model Tech. We received your request and will reply within a few working days.</p>${detailHtml}`,
      }).catch(() => {});
    }
    await Promise.all(
      staff.docs.map(async (u) => {
        await db.collection('notifications').add({
          userId: u.id,
          recipientId: u.id,
          type: req.body.kind === 'org' ? 'org_request' : 'summit_partner',
          title,
          body: 'Review it in the Admin dashboard.',
          message: title,
          link: '/admin',
          isRead: false,
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        const email = u.data().email;
        if (email && email.toLowerCase() !== SUPPORT_EMAIL.toLowerCase()) {
          await sendMail({
            to: email,
            subject: title,
            text: `${title}\n\nReview it in the Admin dashboard: ${SITE}/admin`,
            html: `<p><strong>${title.replace(/</g, '&lt;')}</strong></p><p><a href="${SITE}/admin">Review it in the Admin dashboard</a></p>`,
          }).catch(() => {});
        }
      })
    );
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('public-request alert failed:', e.message);
    return res.status(500).json({ error: 'Could not send the alert' });
  }
};
