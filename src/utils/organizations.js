// src/utils/organizations.js
// Organizations: training contracts and course licensing.
//
//   org_requests/{id}: type ('training' | 'licensing' | 'both'), orgName, orgType,
//     learners, topics, courses, format, timeline, contactName, contactEmail,
//     contactPhone, message, status, assignedMentorUids[], assignedMentors[],
//     contractValue, adminNotes, createdAt, updatedAt, requesterUid (if signed in)
//
// Payments are invoiced outside the platform for now; contractValue is recorded
// here so the organization can report where the money goes.

import { addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export const ORG_TYPES = {
  school: 'School',
  university: 'University',
  company: 'Company',
  nonprofit: 'Nonprofit',
  government: 'Government',
  other: 'Other',
};

export const REQUEST_TYPES = {
  training: 'Training for our learners or staff',
  licensing: 'License your courses',
  both: 'Both',
};

// Status pipelines. Training: New > Proposal sent > Signed > In progress > Completed.
export const TRAINING_STATUSES = ['new', 'proposal_sent', 'signed', 'in_progress', 'completed', 'declined'];
export const LICENSING_STATUSES = ['new', 'approved', 'active', 'ended', 'declined'];
export const STATUS_LABELS = {
  new: 'New',
  proposal_sent: 'Proposal sent',
  signed: 'Signed',
  in_progress: 'In progress',
  completed: 'Completed',
  approved: 'Approved',
  active: 'Active',
  ended: 'Ended',
  declined: 'Declined',
};
export const statusesFor = (type) => (type === 'licensing' ? LICENSING_STATUSES : TRAINING_STATUSES);

// Visible limits (She Model Tech principle).
export const ORG_LIMITS = { topicsMinWords: 5, topicsMaxChars: 1500, messageMaxChars: 2000, nameMaxChars: 150 };

export const createOrgRequest = (form, uid = null) =>
  addDoc(collection(db, 'org_requests'), {
    ...form,
    learners: Number(form.learners) || 0,
    requesterUid: uid,
    status: 'new',
    assignedMentorUids: [],
    assignedMentors: [],
    contractValue: null,
    adminNotes: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

export const listOrgRequests = async () => {
  const snap = await getDocs(query(collection(db, 'org_requests'), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const listMyAssignments = async (uid) => {
  const snap = await getDocs(query(collection(db, 'org_requests'), where('assignedMentorUids', 'array-contains', uid)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateOrgRequest = (id, data) => updateDoc(doc(db, 'org_requests', id), { ...data, updatedAt: serverTimestamp() });

// Trainers: approved mentors who opt in. Default criteria (adjustable):
// an approved mentor with at least one published course, approved by an admin.
export const TRAINER_CRITERIA = 'Approved mentors with at least one published course can ask to be available for training contracts. An admin reviews each request.';
