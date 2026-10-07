// src/utils/reports.js
// Members can report a post, comment or reply that breaks the guidelines.
// Reports go to reports/{id} and staff are alerted; staff review them in
// Admin → Moderation. Reporting never hides anything by itself: staff decide.
import {
  addDoc, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { alertStaff } from './staffAlerts';

export const REPORT_REASONS = [
  ['spam', 'Spam or advertising'],
  ['harassment', 'Harassment, bullying or hate'],
  ['inappropriate', 'Inappropriate or sexual content'],
  ['scam', 'Scam, fraud or a suspicious link'],
  ['personal', 'Shares someone’s private information'],
  ['other', 'Something else'],
];

export const reasonLabel = (key) => (REPORT_REASONS.find(([k]) => k === key) || [key, key])[1];

/**
 * Report a piece of content.
 * @param {object} target { area: 'proofwall'|'team_forum'|'course_forum', kind: 'post'|'comment'|'reply',
 *   path: Firestore path of the item, link: where staff can see it, excerpt, authorUid, authorName }
 * @param {object} me { uid, name }
 * @param {string} reason one of REPORT_REASONS keys
 * @param {string} details optional text
 */
export const reportContent = async (target, me, reason, details = '') => {
  const excerpt = String(target.excerpt || '').slice(0, 300);
  await addDoc(collection(db, 'reports'), {
    area: target.area || 'other',
    kind: target.kind || 'post',
    path: target.path || '',
    link: target.link || '',
    excerpt,
    authorUid: target.authorUid || null,
    authorName: target.authorName || '',
    reason,
    details: String(details || '').slice(0, 500),
    reporterUid: me.uid,
    reporterName: me.name || '',
    status: 'open',
    createdAt: serverTimestamp(),
  });
  alertStaff({
    type: 'content_report',
    title: 'Content reported',
    body: `${me.name || 'A member'} reported a ${target.kind || 'post'} (${reasonLabel(reason)}): "${excerpt.slice(0, 120)}"`,
    link: '/admin?tab=moderation',
    roles: ['admin', 'editor'],
    ctaLabel: 'Review it',
    exceptUid: me.uid,
  });
};

// Staff: reports waiting for review (newest first), or recent closed ones.
export const listReports = async (status = 'open', max = 100) => {
  const snap = await getDocs(query(collection(db, 'reports'), where('status', '==', status), limit(max)));
  const ms = (t) => (t?.toMillis ? t.toMillis() : 0);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => ms(b.createdAt) - ms(a.createdAt));
};

// Staff: close a report. outcome 'removed' (content deleted) or 'dismissed' (no action).
export const closeReport = (id, outcome, staff) =>
  updateDoc(doc(db, 'reports', id), {
    status: 'closed',
    outcome,
    closedBy: staff.uid,
    closedByName: staff.name || '',
    closedAt: serverTimestamp(),
  });

// Kept for callers that want newest reports without a status filter.
export const recentReports = async (max = 50) => {
  const snap = await getDocs(query(collection(db, 'reports'), orderBy('createdAt', 'desc'), limit(max)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
