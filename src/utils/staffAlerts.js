// src/utils/staffAlerts.js
//
// One place to tell people something happened, on every channel:
//   - the in-app notification bell (notifications collection)
//   - a push notification (if they allowed them)
//   - an email
//
// alertStaff()   -> admins (and optionally editors) when something needs review:
//                   project reviews, lead / mentor applications, mentor courses,
//                   letter requests, deletion requests, new company accounts.
// notifyMember() -> one member, e.g. a decision on their application or course.
//
// Everything here is best-effort: a failed email or push never breaks the
// action that triggered it.

import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { authFetch } from './authFetch';
import { sendPush } from './pushNotifications';

const SITE = typeof window !== 'undefined' ? window.location.origin : 'https://shemodeltech.com';

const esc = (t) =>
  String(t || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const bell = (uid, { type, title, body, link }) =>
  addDoc(collection(db, 'notifications'), {
    userId: uid,
    recipientId: uid,
    type,
    title,
    body,
    message: `${title} - ${body}`,
    link: link || null,
    isRead: false,
    read: false,
    createdAt: serverTimestamp(),
  }).catch(() => {});

const email = (to, { title, body, link, ctaLabel }) =>
  to
    ? authFetch('/api/notifications/send-generic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject: title,
          heading: esc(title),
          body: esc(body),
          ctaLabel: ctaLabel || 'Open She Model Tech',
          ctaUrl: link ? `${SITE}${link.startsWith('/') ? link : `/${link}`}` : SITE,
        }),
      }).catch(() => {})
    : Promise.resolve();

// Staff by role: ['admin'] or ['admin', 'editor'].
export const getStaff = async (roles = ['admin']) => {
  try {
    const snap = await getDocs(query(collection(db, 'users'), where('role', 'in', roles)));
    return snap.docs.map((d) => ({ uid: d.id, email: d.data().email || '' }));
  } catch (_) {
    return [];
  }
};

/**
 * Alert staff that something needs attention.
 * @param {object} a  { type, title, body, link, roles = ['admin'], sendEmail = true, ctaLabel, exceptUid }
 */
export const alertStaff = async ({ type = 'staff_alert', title, body, link = '/admin', roles = ['admin'], sendEmail = true, ctaLabel = 'Review it', exceptUid = null }) => {
  try {
    const staff = (await getStaff(roles)).filter((s) => s.uid !== exceptUid);
    if (!staff.length) return;
    await Promise.all(staff.map((s) => bell(s.uid, { type, title, body, link })));
    sendPush({ recipientUids: staff.map((s) => s.uid), title, body, link });
    if (sendEmail) {
      for (const s of staff) await email(s.email, { title, body, link, ctaLabel });
    }
  } catch (e) {
    console.warn('alertStaff failed:', e?.message);
  }
};

/**
 * Tell one member about something (bell + push + optional email).
 * @param {string} uid
 * @param {object} n  { type, title, body, link, sendEmail = true, ctaLabel, emailTo }
 */
export const notifyMember = async (uid, { type = 'update', title, body, link, sendEmail = true, ctaLabel, emailTo } = {}) => {
  if (!uid) return;
  try {
    await bell(uid, { type, title, body, link });
    sendPush({ recipientUid: uid, title, body, link });
    if (sendEmail) {
      let to = emailTo;
      if (!to) {
        const u = await getDoc(doc(db, 'users', uid)).catch(() => null);
        to = u && u.exists() ? u.data().email : '';
      }
      await email(to, { title, body, link, ctaLabel });
    }
  } catch (e) {
    console.warn('notifyMember failed:', e?.message);
  }
};
