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

export const SPONSOR_LIMITS = { titleMinWords: 3, titleMaxChars: 150, focusMinWords: 30, focusMaxChars: 3000, messageMaxChars: 1500 };

export const createSponsorRequest = async (company, form) => {
  const companyName = company.companyProfile?.companyName || company.displayName || 'A company';
  const ref = await addDoc(collection(db, 'sponsor_requests'), {
    companyUid: company.uid,
    companyName,
    projects: Math.max(1, Number(form.projects) || 1),
    people: Math.max(1, Number(form.people) || 1),
    budget: Number(form.budget) || 0,
    payPerPerson: Number(form.payPerPerson) || 0,
    problemTitle: (form.problemTitle || '').trim(),
    focus: form.focus.trim(), // the problem statement
    timeline: form.timeline.trim(),
    message: form.message.trim(),
    status: 'new',
    createdAt: serverTimestamp(),
  });
  alertStaff({
    type: 'sponsor_request',
    title: 'A company wants to sponsor a cohort',
    body: `${companyName}: ${Math.max(1, Number(form.projects) || 1)} project(s), ${Number(form.people) || 1} people, $${Number(form.budget) || 0}. ${(form.problemTitle || '').trim()}`,
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
    title: req.problemTitle ? `Your sponsored cohort is set up: "${req.problemTitle}"` : 'Your sponsored cohort is set up',
    body: `${cohort.name || 'Your cohort'} starts ${cohort.startDate}. You’ll be added to every project workspace once projects are revealed.`,
    link: '/projects/owner-dashboard',
  });
};

export const declineSponsorRequest = async (req, note, staff) => {
  await updateDoc(doc(db, 'sponsor_requests', req.id), {
    status: 'declined',
    note: note || null,
    decidedByUid: staff?.uid || null,
    decidedByName: staff?.displayName || staff?.email || null,
  });
  const what = req.problemTitle ? `"${req.problemTitle}"` : 'your sponsorship request';
  notifyMember(req.companyUid, {
    type: 'sponsor_declined',
    title: `Update on ${what}`,
    body: `${note ? `${note} ` : 'We’re not able to schedule this sponsorship right now. '}Reply in Messages to talk it through.`,
    // Opens a conversation with the team member who reviewed it.
    link: staff?.uid ? `/messages?to=${staff.uid}` : '/support',
    ctaLabel: 'Message us',
  });
};

// Projects a company sponsors (it follows them in the workspace).
export const listSponsoredProjects = async (uid) => {
  const s = await getDocs(query(collection(db, 'projects'), where('observers', 'array-contains', uid)));
  // Hidden drafts stay hidden until She Model Tech reveals the cohort.
  return s.docs.map((d) => ({ id: d.id, ...d.data() })).filter((p) => p.isActive !== false);
};

// She Model Tech confirms the sponsor's payment before the cohort is created.
export const markSponsorPaid = async (req, staff) => {
  await updateDoc(doc(db, 'sponsor_requests', req.id), { status: 'paid', paidConfirmedBy: staff.email || '', paidConfirmedAt: new Date().toISOString() });
  notifyMember(req.companyUid, {
    type: 'sponsor_paid',
    title: req.problemTitle ? `Sponsorship payment received: "${req.problemTitle}"` : 'Sponsorship payment received',
    body: 'Thank you. We’re creating your cohort and will add your representative to every project workspace.',
    link: '/projects/owner-dashboard',
  });
};

export const listSponsoredCohorts = async (uid) => {
  const s = await getDocs(query(collection(db, 'cohorts'), where('sponsor.uid', '==', uid)));
  return s.docs.map((d) => ({ id: d.id, ...d.data() }));
};
