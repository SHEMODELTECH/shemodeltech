// src/utils/learningCertificates.js
//
// Certificates of completion for She Model Tech Learning courses.
//
//   learning_certificates/{certId}
//     uid, name, email, courseTitle, track, trackLabel, slug, level, minutes,
//     issuedAt (server time), completedOn (ISO date)
//
// One certificate per person per course: the id is built from the member's id,
// the track, and the course, so issuing again returns the same certificate.
// Certificates are public to read so anyone with the link can verify them;
// only the learner can create their own, and nobody can change one afterwards.

import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export const certificateId = (uid, track, slug) =>
  `${uid}_${track}_${slug}`.replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 400);

// Short, readable code printed on the certificate, e.g. SMT-4K9Q-2XWD. Derived
// from the full id, so the same certificate always shows the same code.
export const certificateCode = (id) => {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < id.length; i++) {
    h1 = Math.imul(h1 ^ id.charCodeAt(i), 16777619) >>> 0;
    h2 = Math.imul(h2 ^ id.charCodeAt(id.length - 1 - i), 2246822519) >>> 0;
  }
  const code = (h1.toString(36) + h2.toString(36)).toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(8, '0').slice(0, 8);
  return `SMT-${code.slice(0, 4)}-${code.slice(4, 8)}`;
};

export const certificateUrl = (id) => `${window.location.origin}/learning/certificate/${id}`;

export const getCertificate = async (id) => {
  const s = await getDoc(doc(db, 'learning_certificates', id));
  return s.exists() ? { id: s.id, ...s.data() } : null;
};

/**
 * Issue (or fetch) the certificate for a completed course.
 * learner: { uid, name, email }   course: { track, trackLabel, slug, title, level, minutes }
 */
export const issueCertificate = async (learner, course) => {
  const id = certificateId(learner.uid, course.track, course.slug);
  const existing = await getCertificate(id);
  if (existing) return existing;
  const data = {
    uid: learner.uid,
    name: (learner.name || learner.email || 'She Model Tech learner').trim(),
    email: learner.email || '',
    courseTitle: course.title,
    track: course.track,
    trackLabel: course.trackLabel || '',
    slug: course.slug,
    level: course.level || '',
    minutes: course.minutes || 0,
    completedOn: new Date().toISOString().slice(0, 10),
    issuedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'learning_certificates', id), data);
  return { id, ...data };
};

// LinkedIn "Add to profile" link for a certificate.
export const linkedInAddUrl = (cert) => {
  const d = new Date(cert.completedOn || Date.now());
  const p = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: cert.type === 'mentor' ? `She Model Tech Mentor: ${cert.courseTitle}` : cert.courseTitle,
    organizationName: 'SHE MODEL TECH Inc.',
    issueYear: String(d.getFullYear()),
    issueMonth: String(d.getMonth() + 1),
    certUrl: certificateUrl(cert.id),
    certId: certificateCode(cert.id),
  });
  return `https://www.linkedin.com/profile/add?${p.toString()}`;
};

// ---- Mentor certificates ----
// A Certificate of Recognition for every mentor course published to Learning.
// Stored with the learning certificates (type: 'mentor') so the same page
// shows and verifies them. Issued when an admin approves the course; a mentor
// can also get one for a course that was published before this existed.
const TRACK_LABELS = {
  TechDev: 'Coding Developer',
  TechArchs: 'Low/No-Code',
  TechQA: 'Quality Tester',
  TechGuard: 'Cybersecurity',
  TechPO: 'Product Owner',
  TechLeads: 'Non-Technical',
};

export const mentorCertificateId = (uid, courseId) =>
  `${uid}_mentor_${courseId}`.replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 400);

export const issueMentorCertificate = async (mentor, course) => {
  const id = mentorCertificateId(mentor.uid, course.courseId);
  const existing = await getCertificate(id);
  if (existing) return existing;
  const data = {
    type: 'mentor',
    uid: mentor.uid,
    name: (mentor.name || mentor.email || 'She Model Tech mentor').trim(),
    email: mentor.email || '',
    courseId: course.courseId,
    courseTitle: course.title,
    track: course.track || '',
    trackLabel: course.trackLabel || TRACK_LABELS[course.track] || '',
    level: course.level || '',
    minutes: course.minutes || 0,
    completedOn: new Date().toISOString().slice(0, 10),
    issuedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'learning_certificates', id), data);
  return { id, ...data };
};

export const listMentorCertificates = async (uid) => {
  const snap = await getDocs(
    query(collection(db, 'learning_certificates'), where('uid', '==', uid), where('type', '==', 'mentor'))
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.completedOn || '').localeCompare(a.completedOn || ''));
};
