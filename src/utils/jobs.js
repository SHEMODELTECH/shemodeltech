// src/utils/jobs.js
// She Model Tech Jobs board. Browsing is free for everyone; posting is a
// Premium feature for verified companies.
//
//   jobs/{id}: companyUid, companyName, title, type, location, remote,
//     description, applyUrl, applyEmail, tracks[], salary, status ('open'|'closed'),
//     featured, createdAt, updatedAt, expiresAt (ISO)

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export const JOB_TYPES = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
};

export const JOB_TRACKS = {
  TechDev: 'Coding Developer',
  TechArchs: 'Low/No-Code',
  TechQA: 'Quality Tester',
  TechGuard: 'Cybersecurity',
  TechPO: 'Product Owner',
  TechLeads: 'Non-Technical',
};

// Shown on every field (She Model Tech principle: limits are visible up front).
export const JOB_LIMITS = {
  titleMinWords: 2,
  titleMaxChars: 120,
  descMinWords: 50,
  descMaxChars: 8000,
  locationMaxChars: 100,
  salaryMaxChars: 80,
  daysOpen: 60,
};

const COL = 'jobs';

export const listOpenJobs = async () => {
  const snap = await getDocs(query(collection(db, COL), where('status', '==', 'open'), limit(300)));
  const now = new Date().toISOString();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((j) => !j.expiresAt || j.expiresAt > now)
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

export const listMyJobs = async (uid) => {
  const snap = await getDocs(query(collection(db, COL), where('companyUid', '==', uid)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

export const getJob = async (id) => {
  const s = await getDoc(doc(db, COL, id));
  return s.exists() ? { id: s.id, ...s.data() } : null;
};

const clean = (form) => ({
  title: form.title.trim(),
  type: form.type,
  location: form.location.trim(),
  remote: !!form.remote,
  description: form.description.trim(),
  applyUrl: form.applyUrl.trim() || null,
  applyEmail: form.applyEmail.trim() || null,
  tracks: form.tracks || [],
  salary: form.salary.trim() || null,
});

export const createJob = async (company, form) =>
  addDoc(collection(db, COL), {
    ...clean(form),
    companyUid: company.uid,
    companyName: company.companyProfile?.companyName || company.displayName || 'Company',
    status: 'open',
    featured: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + JOB_LIMITS.daysOpen * 86400000).toISOString(),
  });

export const updateJob = (id, form) => updateDoc(doc(db, COL, id), { ...clean(form), updatedAt: serverTimestamp() });
export const setJobStatus = (id, status) => updateDoc(doc(db, COL, id), { status, updatedAt: serverTimestamp() });
export const setJobFeatured = (id, featured) => updateDoc(doc(db, COL, id), { featured });
export const deleteJob = (id) => deleteDoc(doc(db, COL, id));
