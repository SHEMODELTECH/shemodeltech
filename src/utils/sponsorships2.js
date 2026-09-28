// src/utils/sponsorships2.js
// Companies sponsor a cohort led by She Model Tech.
// The company funds it; She Model Tech runs lead applications, leads run their
// teams, and She Model Tech pays the leads and collaborators. The sponsoring
// company is added to every project workspace in the cohort.
//
//   sponsor_requests/{id}: companyUid, companyName, projects, payPerPerson,
//     focus, timeline, message, status ('new' | 'scheduled' | 'declined'),
//     cohortId, createdAt

import { addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { alertStaff, notifyMember } from './staffAlerts';

export const SPONSOR_LIMITS = { focusMinWords: 5, focusMaxChars: 1000, messageMaxChars: 1500 };

export const createSponsorRequest = async (company, form) => {
  const companyName = company.companyProfile?.companyName || company.displayName || 'A company';
  const ref = await addDoc(collection(db, 'sponsor_requests'), {
    companyUid: company.uid,
    companyName,
    projects: Math.max(1, Number(form.projects) || 1),
    payPerPerson: Number(form.payPerPerson) || 0,
    focus: form.focus.trim(),
    timeline: form.timeline.trim(),
    message: form.message.trim(),
    status: 'new',
    createdAt: serverTimestamp(),
  });
  alertStaff({
    type: 'sponsor_request',
    title: 'A company wants to sponsor a cohort',
    body: `${companyName}: ${Math.max(1, Number(form.projects) || 1)} project(s). ${form.focus.trim().slice(0, 120)}`,
    link: '/admin/cohorts',
    roles: ['admin'],
  });
  return ref.id;
};

export const listMySponsorRequests = async (uid) => {
  const s = await getDocs(query(collection(db, 'sponsor_requests'), where('companyUid', '==', uid)));
  return s.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const listSponsorRequests = async () => {
  const s = await getDocs(query(collection(db, 'sponsor_requests'), orderBy('createdAt', 'desc')));
  return s.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const markSponsorScheduled = async (req, cohort) => {
  await updateDoc(doc(db, 'sponsor_requests', req.id), { status: 'scheduled', cohortId: cohort.id, cohortName: cohort.name || null });
  notifyMember(req.companyUid, {
    type: 'sponsor_scheduled',
    title: 'Your sponsored cohort is set up',
    body: `${cohort.name || 'Your cohort'} starts ${cohort.startDate}. You’ll be added to every project workspace once projects are revealed.`,
    link: '/projects/owner-dashboard',
  });
};

export const declineSponsorRequest = async (req, note) => {
  await updateDoc(doc(db, 'sponsor_requests', req.id), { status: 'declined', note: note || null });
  notifyMember(req.companyUid, { type: 'sponsor_declined', title: 'Update on your sponsorship request', body: note || 'We’re not able to schedule this sponsorship right now. Message us to talk it through.', link: '/projects/owner-dashboard' });
};

// Projects a company sponsors (it follows them in the workspace).
export const listSponsoredProjects = async (uid) => {
  const s = await getDocs(query(collection(db, 'projects'), where('observers', 'array-contains', uid)));
  return s.docs.map((d) => ({ id: d.id, ...d.data() }));
};
