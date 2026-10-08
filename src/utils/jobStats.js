// src/utils/jobStats.js
// How each job post is doing, for the company that posted it (and staff).
//
//   job_stats/{jobId}   { views, applyLink, applyEmail }
//     views       members who opened the job (once per person per day)
//     applyLink   clicks on Apply (the company's own application page)
//     applyEmail  clicks on Apply by email
// Applications happen on the company's own site, so these clicks are what
// She Model Tech can count. The company's own visits don't count. Counts only:
// no names are stored.
import { doc, getDoc, increment, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const KEY = 'smt-job-counted-v1';
const today = () => new Date().toISOString().slice(0, 10);

const bump = (jobId, field, me, companyUid) => {
  if (!jobId || !me?.uid || me.uid === companyUid) return;
  let seen = {};
  try { seen = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (_) { seen = {}; }
  const mark = `${field}:${jobId}:${me.uid}`;
  const d = today();
  if (seen[mark] === d) return;
  Object.keys(seen).forEach((k) => { if (seen[k] !== d) delete seen[k]; });
  seen[mark] = d;
  try { localStorage.setItem(KEY, JSON.stringify(seen)); } catch (_) { /* private mode */ }
  setDoc(doc(db, 'job_stats', jobId), { [field]: increment(1) }, { merge: true }).catch(() => {});
};

export const recordJobView = (job, me) => bump(job?.id, 'views', me, job?.companyUid);
export const recordApplyClick = (job, me, how) => bump(job?.id, how === 'email' ? 'applyEmail' : 'applyLink', me, job?.companyUid);

// Stats for a company's jobs: { jobId: { views, applyLink, applyEmail } }.
// One read per job (the rules check each job belongs to the reader).
export const loadJobStats = async (ids) => {
  const list = [...new Set((ids || []).filter(Boolean))];
  const out = {};
  await Promise.all(list.map(async (id) => {
    try {
      const s = await getDoc(doc(db, 'job_stats', id));
      if (s.exists()) out[id] = s.data();
    } catch (_) { /* leave at zero */ }
  }));
  return out;
};
