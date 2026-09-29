// src/utils/jobs.js
// She Model Tech Jobs board: full-time, part-time, contract, and internship
// roles that companies recruit for (separate from projects, which have teams
// and workspaces). Browsing is free; posting is Premium for verified companies.
//
//   jobs/{id}: companyUid, companyName, title, type, location, remote,
//     description, applyUrl, applyEmail, salary, status ('open'|'closed'),
//     featured, createdAt, updatedAt, expiresAt (ISO)

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { alertStaff, notifyMember } from './staffAlerts';

export const JOB_TYPES = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
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
    .filter((j) => (!j.expiresAt || j.expiresAt > now) && jobWindow(j).state !== 'closed')
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

// Applications are accepted between opensOn and closesOn (YYYY-MM-DD).
const endOfDay = (d) => new Date(`${d}T23:59:59`).toISOString();
export const jobWindow = (job) => {
  const today = new Date().toISOString().slice(0, 10);
  const opens = job.opensOn || null;
  const closes = job.closesOn || (job.expiresAt ? job.expiresAt.slice(0, 10) : null);
  if (opens && today < opens) return { state: 'upcoming', opens, closes };
  if (closes && today > closes) return { state: 'closed', opens, closes };
  return { state: 'open', opens, closes };
};

const clean = (form) => ({
  title: form.title.trim(),
  type: form.type,
  location: form.location.trim(),
  remote: !!form.remote,
  description: form.description.trim(),
  applyUrl: form.applyUrl.trim() || null,
  applyEmail: form.applyEmail.trim() || null,
  salary: form.salary.trim() || null,
  opensOn: form.opensOn || null,
  closesOn: form.closesOn || null,
  ...(form.closesOn ? { expiresAt: endOfDay(form.closesOn) } : {}),
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
    ...(form.closesOn ? {} : { expiresAt: new Date(Date.now() + JOB_LIMITS.daysOpen * 86400000).toISOString() }),
  });

export const updateJob = (id, form) => updateDoc(doc(db, COL, id), { ...clean(form), updatedAt: serverTimestamp() });
export const setJobStatus = (id, status) => updateDoc(doc(db, COL, id), { status, updatedAt: serverTimestamp() });
export const setJobFeatured = (id, featured) => updateDoc(doc(db, COL, id), { featured });
// Only She Model Tech staff delete job posts.
export const deleteJob = (id) => deleteDoc(doc(db, COL, id));

// A company asks for its post to be deleted: the post is unpublished at once
// (nobody can apply) and staff review the request.
export const requestJobDeletion = async (job, user, reason) => {
  await updateDoc(doc(db, COL, job.id), {
    status: 'removal_requested',
    statusBeforeRemoval: job.status || 'open',
    removalRequest: { reason: (reason || '').trim(), at: new Date().toISOString(), by: user?.uid || null },
    updatedAt: serverTimestamp(),
  });
  alertStaff({
    type: 'job_deletion_requested',
    title: 'A company asked to delete a job post',
    body: `${job.companyName}: "${job.title}". ${(reason || '').slice(0, 140)}`,
    link: '/jobs?review=1',
    roles: ['admin', 'editor'],
  });
};

export const listJobDeletionRequests = async () => {
  const snap = await getDocs(query(collection(db, COL), where('status', '==', 'removal_requested')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Staff decline the request: the post goes back to how it was.
export const restoreJob = async (job) => {
  await updateDoc(doc(db, COL, job.id), { status: job.statusBeforeRemoval || 'open', removalRequest: null, updatedAt: serverTimestamp() });
  notifyMember(job.companyUid, { type: 'job_deletion_declined', title: 'Your job post is live again', body: `"${job.title}" was not deleted and is published again. Message us if you have questions.`, link: `/jobs/${job.id}` });
};
export const approveJobDeletion = async (job) => {
  await deleteDoc(doc(db, COL, job.id));
  notifyMember(job.companyUid, { type: 'job_deleted', title: 'Your job post was deleted', body: `"${job.title}" has been deleted as you asked.`, link: '/jobs/mine' });
};
