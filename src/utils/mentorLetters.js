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
//     draftText, attachment { url, name, size }, emailingDraft, letterFile { url, name, size },
//     status: 'pending' | 'sent' | 'declined', adminNote, createdAt, decidedAt, decidedBy

import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { alertStaff, notifyMember } from './staffAlerts';

const COL = 'mentor_letter_requests';

export const LETTER_TYPES = {
  recommendation: 'Recommendation letter',
  volunteer: 'Volunteer service letter',
};

export const requestLetter = async (user, form) => {
  const ref = await addDoc(collection(db, COL), {
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
  alertStaff({
    type: 'mentor_letter_requested',
    title: `New ${(LETTER_TYPES[form.type] || 'letter').toLowerCase()} request`,
    body: `${(form.name || user.displayName || user.email || 'A mentor').trim()} requested a letter: ${(form.purpose || '').trim().slice(0, 140)}`,
    link: '/admin',
    roles: ['admin'],
  });
  return ref;
};

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

export const decideLetterRequest = async (req, status, admin, note = '', letterFile = null) => {
  await updateDoc(doc(db, COL, req.id), {
    status,
    adminNote: note.trim() || null,
    decidedAt: serverTimestamp(),
    decidedBy: admin.email || '',
    // The finished letter, if staff attached it (the mentor downloads it in the Mentor Hub).
    ...(letterFile ? { letterFile } : {}),
  });
  const label = LETTER_TYPES[req.type] || 'letter';
  await notifyMember(req.uid, {
    type: 'mentor_letter',
    title: status === 'sent' ? `Your ${label.toLowerCase()} has been sent` : `Update on your ${label.toLowerCase()} request`,
    body:
      status === 'sent'
        ? (letterFile
            ? `Your letter is ready to download in the Mentor Hub.${note.trim() ? ` ${note.trim()}` : ''}`
            : note.trim() || `We've emailed it to ${req.email}. Thank you for mentoring with She Model Tech.`)
        : note.trim() || 'We are not able to provide this letter right now.',
    link: '/teacher',
    emailTo: req.email,
  });
};
