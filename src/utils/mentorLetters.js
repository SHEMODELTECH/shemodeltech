// src/utils/mentorLetters.js
// Mentors can request a letter from SHE MODEL TECH Inc.:
//   'recommendation'  a recommendation letter
//   'volunteer'       a volunteer service letter (confirming mentoring service
//                     for a registered 501(c)(3) nonprofit)
// Admins handle requests in Admin > Mentors and mark them sent (the letter is
// written and emailed by the team) or declined with a note.
//
//   mentor_letter_requests/{id}
//     uid, name, email, type, purpose, recipient, deadline,
//     draftText, attachment { url, name, size }, emailingDraft,
//     status: 'pending' | 'sent' | 'declined', adminNote, createdAt, decidedAt, decidedBy

import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const COL = 'mentor_letter_requests';

export const LETTER_TYPES = {
  recommendation: 'Recommendation letter',
  volunteer: 'Volunteer service letter',
};

export const requestLetter = async (user, form) =>
  addDoc(collection(db, COL), {
    uid: user.uid,
    name: (form.name || user.displayName || user.email || '').trim(),
    email: user.email || '',
    type: form.type,
    purpose: (form.purpose || '').trim(),
    recipient: (form.recipient || '').trim(),
    deadline: form.deadline || '',
    // The mentor's draft: pasted text, an attached file, and/or a promise to email it.
    draftText: (form.draftText || '').trim(),
    attachment: form.attachment || null,
    emailingDraft: !!form.emailingDraft,
    status: 'pending',
    createdAt: serverTimestamp(),
  });

export const myLetterRequests = async (uid) => {
  const snap = await getDocs(query(collection(db, COL), where('uid', '==', uid)));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

export const withdrawLetterRequest = (id) => deleteDoc(doc(db, COL, id));

export const listLetterRequests = async () => {
  const snap = await getDocs(collection(db, COL));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

export const decideLetterRequest = async (req, status, admin, note = '') => {
  await updateDoc(doc(db, COL, req.id), {
    status,
    adminNote: note.trim() || null,
    decidedAt: serverTimestamp(),
    decidedBy: admin.email || '',
  });
  const label = LETTER_TYPES[req.type] || 'letter';
  await addDoc(collection(db, 'notifications'), {
    userId: req.uid,
    recipientId: req.uid,
    type: 'mentor_letter',
    title: status === 'sent' ? `Your ${label.toLowerCase()} has been sent` : `Update on your ${label.toLowerCase()} request`,
    body:
      status === 'sent'
        ? note.trim() || `We've emailed it to ${req.email}. Thank you for mentoring with She Model Tech.`
        : note.trim() || 'We are not able to provide this letter right now.',
    message: status === 'sent' ? `Your ${label.toLowerCase()} has been sent` : `Update on your ${label.toLowerCase()} request`,
    link: '/teacher',
    isRead: false,
    read: false,
    createdAt: serverTimestamp(),
  }).catch(() => {});
};
