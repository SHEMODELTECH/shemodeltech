// src/utils/teachers.js
//
// Teachers: members an admin has approved to create teaching materials.
//
//   users/{uid}.isTeacher = true          set only by an admin (Firestore rules
//   users/{uid}.teacherSince              stop members setting it themselves)
//   teacher_applications/{uid}            one application per person:
//     { applicantUid, applicantEmail, applicantName, tracks[], experience,
//       motivation, links, status: 'pending'|'approved'|'declined',
//       createdAt, decidedAt, decidedBy, note }
//
// Teachers can open Teacher, see all materials, and create and edit their own.
// Publishing to students goes through admins and editors (a publish request).

import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const TEACH_TRACKS = [
  ['TechDev', 'Coding Developer'],
  ['TechArchs', 'Low/No-Code'],
  ['TechQA', 'Quality Tester'],
  ['TechGuard', 'Cybersecurity'],
  ['TechPO', 'Product Owner'],
  ['TechLeads', 'Non-Technical'],
];

export const getMyTeacherApplication = async (uid) => {
  const s = await getDoc(doc(db, 'teacher_applications', uid));
  return s.exists() ? { id: s.id, ...s.data() } : null;
};

export const applyToTeach = async (user, form) => {
  await setDoc(doc(db, 'teacher_applications', user.uid), {
    applicantUid: user.uid,
    applicantEmail: user.email || '',
    applicantName: (form.name || user.displayName || user.email || '').trim(),
    tracks: form.tracks || [],
    experience: (form.experience || '').trim(),
    motivation: (form.motivation || '').trim(),
    links: (form.links || '').trim(),
    status: 'pending',
    createdAt: serverTimestamp(),
  });
};

export const listTeacherApplications = async () => {
  const snap = await getDocs(collection(db, 'teacher_applications'));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

const notify = (userId, title, body, link) =>
  addDoc(collection(db, 'notifications'), {
    userId,
    recipientId: userId,
    type: 'teacher_status',
    title,
    body,
    message: `${title} - ${body}`,
    link,
    isRead: false,
    read: false,
    createdAt: serverTimestamp(),
  }).catch(() => {});

// Admin: make someone a teacher, or remove teacher access.
export const setTeacher = async (userId, value, admin) => {
  await updateDoc(doc(db, 'users', userId), {
    isTeacher: value,
    teacherSince: value ? new Date().toISOString() : null,
    teacherAssignedBy: value ? admin.email || '' : null,
  });
  if (value) {
    await notify(userId, 'You are now a She Model Tech mentor', 'Open the Mentor Hub in Learning to create and share courses.', '/teacher');
  }
};

// Admin: approve or decline an application.
export const decideTeacherApplication = async (app, approve, admin, note = '') => {
  await updateDoc(doc(db, 'teacher_applications', app.id), {
    status: approve ? 'approved' : 'declined',
    decidedAt: serverTimestamp(),
    decidedBy: admin.email || '',
    note: note.trim() || null,
  });
  if (approve) {
    await updateDoc(doc(db, 'users', app.applicantUid), {
      isTeacher: true,
      teacherSince: new Date().toISOString(),
      teacherAssignedBy: admin.email || '',
    });
    await notify(app.applicantUid, 'Your mentor application was approved', 'Welcome! Open the Mentor Hub in Learning to start creating courses.', '/teacher');
  } else {
    await notify(
      app.applicantUid,
      'Update on your mentor application',
      note.trim() || 'Thank you for applying. We are not able to approve it right now; you are welcome to apply again later.',
      '/teach'
    );
  }
};
