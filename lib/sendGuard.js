// lib/sendGuard.js
// Who may send what through our email and push endpoints.
//
// She Model Tech staff (admins and editors) can send to anyone (donor letters,
// cohort decisions, announcements). Everyone else:
//   - only to people with a She Model Tech account (never outside addresses),
//   - companies only to staff or to people they already have a conversation
//     with (so the 5-new-conversations limit can't be bypassed),
//   - a daily cap per sender, and at most 50 push recipients per request,
//   - emails are plain text only (no HTML) and links stay on She Model Tech.
const admin = require('./firebaseAdmin');
const { isConfirmedEmail } = require('./confirmedEmail');

const SITE = process.env.SITE_URL || 'https://shemodeltech.com';
const DAILY_CAP = { email: 60, push: 500 };
const MAX_PUSH_RECIPIENTS = 50;

const isStaffRole = (role) => ['admin', 'editor'].includes(role);
const today = () => new Date().toISOString().slice(0, 10);

// data: the sender's users doc (null when there is none).
const getSender = async (uid) => {
  const s = await admin.firestore().collection('users').doc(uid).get();
  const d = s.exists ? s.data() : {};
  return { uid, staff: isStaffRole(d.role), company: d.isCompany === true, data: s.exists ? d : null };
};

// Are all these uids She Model Tech staff? (One round trip.)
const allStaff = async (uids) => {
  if (!uids.length) return false;
  const db = admin.firestore();
  const snaps = await db.getAll(...uids.map((uid) => db.collection('users').doc(uid)));
  return snaps.every((u) => u.exists && isStaffRole(u.data().role));
};

// Counts this send against the sender's daily cap. Returns false if over it.
const takeQuota = async (uid, kind, n) => {
  const db = admin.firestore();
  const ref = db.collection('_sendcap').doc(`${uid}_${today()}`);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const used = snap.exists ? snap.data()[kind] || 0 : 0;
    if (used + n > DAILY_CAP[kind]) return false;
    tx.set(ref, { [kind]: used + n, day: today() }, { merge: true });
    return true;
  });
};

// uids this company may reach: staff, plus people it has a conversation with.
const companyAllows = async (senderUid, uids) => {
  const db = admin.firestore();
  const convs = await db.collection('conversations').where('participants', 'array-contains', senderUid).get();
  const partners = new Set();
  convs.docs.forEach((d) => (d.data().participants || []).forEach((p) => p !== senderUid && partners.add(p)));
  const others = uids.filter((uid) => !partners.has(uid));
  if (!others.length) return true;
  // One round trip for all of them instead of one read per person.
  const snaps = await db.getAll(...others.map((uid) => db.collection('users').doc(uid)));
  return snaps.every((u) => u.exists && isStaffRole(u.data().role));
};

const uidForEmail = async (email) => {
  const db = admin.firestore();
  const e = String(email || '').trim();
  // Sign-in accounts match emails without caring about capital letters.
  try {
    const u = await admin.auth().getUserByEmail(e);
    if (u && u.uid) return u.uid;
  } catch (_) {
    /* not a sign-in email: try the profiles */
  }
  for (const v of [...new Set([e, e.toLowerCase()])]) {
    // eslint-disable-next-line no-await-in-loop
    const q = await db.collection('users').where('email', '==', v).limit(1).get();
    if (!q.empty) return q.docs[0].id;
  }
  return null;
};

// Plain text only; keep any already-escaped entities as they are.
const plain = (t, max) => String(t || '').replace(/<[^>]*>/g, '').slice(0, max);
// For the HTML parts (heading, body): also turn any stray < or > left over
// (an unclosed "<a href=..." would otherwise join the next tag in the email)
// into text. Already-escaped entities like &amp; are kept as they are.
const plainHtml = (t, max) => plain(t, max).replace(/</g, '&lt;').replace(/>/g, '&gt;');
const safeLink = (url) => {
  const u = String(url || '');
  if (!u) return SITE;
  if (u.startsWith('/')) return `${SITE}${u}`;
  try {
    const host = new URL(u).hostname;
    const site = new URL(SITE).hostname;
    return host === site || host === `www.${site}` || `www.${host}` === site ? u : SITE;
  } catch (_) {
    return SITE;
  }
};

/** Check a generic email. Returns { ok, error, status, email } (email cleaned for non-staff). */
const guardEmail = async (user, mail) => {
  const sender = await getSender(user.uid);
  if (sender.staff) return { ok: true, email: mail };
  const to = Array.isArray(mail.to) ? mail.to : [mail.to];
  if (to.length !== 1) return { ok: false, status: 403, error: 'One recipient at a time.' };
  const recipientUid = await uidForEmail(to[0]);
  if (!recipientUid) return { ok: false, status: 403, error: 'Emails can only go to She Model Tech members.' };
  // Same as the database rules: a confirmed email is needed to contact
  // members, but anyone may reach She Model Tech staff (help).
  if (!(await isConfirmedEmail(user, sender.data)) && !(await allStaff([recipientUid]))) {
    return { ok: false, status: 403, error: 'Please confirm your email address first.' };
  }
  if (sender.company && !(await companyAllows(user.uid, [recipientUid]))) {
    return { ok: false, status: 403, error: 'Start a conversation with this member first.' };
  }
  if (!(await takeQuota(user.uid, 'email', 1))) return { ok: false, status: 429, error: 'Daily email limit reached.' };
  return {
    ok: true,
    email: {
      ...mail,
      to: to[0],
      subject: plain(mail.subject, 160),
      heading: plainHtml(mail.heading, 160),
      body: plainHtml(mail.body, 3000),
      ctaLabel: plain(mail.ctaLabel, 60),
      ctaUrl: safeLink(mail.ctaUrl),
    },
  };
};

/** Check a push request. Returns { ok, error, status, uids, link }. */
const guardPush = async (user, uids, link) => {
  const sender = await getSender(user.uid);
  if (sender.staff) return { ok: true, uids: uids.slice(0, 1000), link: link || '/' };
  const list = [...new Set(uids.filter((u) => typeof u === 'string' && u && u !== user.uid))];
  if (!list.length) return { ok: false, status: 400, error: 'No recipients' };
  if (list.length > MAX_PUSH_RECIPIENTS) return { ok: false, status: 403, error: 'Too many recipients.' };
  // Confirmed email needed, except for notifying She Model Tech staff.
  if (!(await isConfirmedEmail(user, sender.data)) && !(await allStaff(list))) {
    return { ok: false, status: 403, error: 'Please confirm your email address first.' };
  }
  if (sender.company && !(await companyAllows(user.uid, list))) {
    return { ok: false, status: 403, error: 'Start a conversation with this member first.' };
  }
  if (!(await takeQuota(user.uid, 'push', list.length))) return { ok: false, status: 429, error: 'Daily notification limit reached.' };
  const l = String(link || '/');
  return { ok: true, uids: list, link: l.startsWith('/') ? l : '/' };
};

module.exports = { guardEmail, guardPush, plain, plainHtml, safeLink, getSender, takeQuota, uidForEmail, allStaff, isStaffRole };
