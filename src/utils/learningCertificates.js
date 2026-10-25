// src/utils/learningCertificates.js
//
// Certificates of completion for She Model Tech Learning courses.
//
//   learning_certificates/{certId}
//     uid, name, courseTitle, track, trackLabel, slug, level, minutes, code,
//     issuedAt (server time), completedOn (ISO date)
//
// One certificate per person per course: the id is built from the member's id,
// the track, and the course, so issuing again returns the same certificate.
// Certificates are public to read so anyone with the link can verify them.
// Course certificates are issued by the server (api/notifications/issue-certificate)
// after it checks the course is finished; they never store an email.
import { BRAND } from '../config/brand';

import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { authFetch } from './authFetch';

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
 * Issue (or fetch) the certificate for a completed course. The server checks
 * the course is really finished (summaries, quizzes passed with 70%+, forum
 * reply) and issues it; the website can't create course certificates itself.
 * Throws an Error with `.missing` (a list of what's left) when it isn't finished.
 */
export const issueCertificate = async (course) => {
  const res = await authFetch('/api/notifications/issue-certificate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ track: course.track, slug: course.slug }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.id) {
    const err = new Error(body.error || 'Could not issue the certificate.');
    err.missing = Array.isArray(body.missing) ? body.missing : [];
    throw err;
  }
  return { id: body.id };
};

// LinkedIn "Add to profile" link for a certificate.
export const linkedInAddUrl = (cert) => {
  const d = new Date(cert.completedOn || Date.now());
  const p = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: cert.type === 'mentor' ? `She Model Tech Mentor: ${cert.courseTitle}` : cert.courseTitle,
    // organizationId links the entry to our LinkedIn page, so our logo shows.
    organizationId: BRAND.linkedinOrgId,
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
    name: (mentor.name || 'She Model Tech mentor').trim(),
    courseId: course.courseId,
    courseTitle: course.title,
    track: course.track || '',
    trackLabel: course.trackLabel || TRACK_LABELS[course.track] || '',
    level: course.level || '',
    minutes: course.minutes || 0,
    completedOn: new Date().toISOString().slice(0, 10),
    issuedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'learning_certificates', id), { ...data, code: certificateCode(id) });
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
