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

import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, deleteField, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
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

export const listMyOrgRequests = async (uid) => {
  const snap = await getDocs(query(collection(db, 'org_requests'), where('requesterUid', '==', uid)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

// What the organization is told when its request moves on.
export const STATUS_MESSAGES = {
  proposal_sent: 'We’ve prepared a proposal for you. Check your messages and email.',
  signed: 'Your training agreement is signed. We’ll be in touch about next steps.',
  in_progress: 'Your training is under way.',
  completed: 'Your training is complete. Thank you for working with She Model Tech.',
  approved: 'Your course license is approved. We’ll set up your organization next.',
  active: 'Your course license is active. Open your organization dashboard to invite learners.',
  ended: 'Your course license has ended.',
  declined: 'We’re not able to take this request forward right now. Check your messages for details.',
};

export const listMyAssignments = async (uid) => {
  const snap = await getDocs(query(collection(db, 'org_requests'), where('assignedMentorUids', 'array-contains', uid)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateOrgRequest = (id, data) => updateDoc(doc(db, 'org_requests', id), { ...data, updatedAt: serverTimestamp() });

// Trainers: approved mentors who opt in. Default criteria (adjustable):
// an approved mentor with at least one published course, approved by an admin.
export const TRAINER_CRITERIA = 'Approved mentors with at least one published course can ask to be available for training contracts. An admin reviews each request.';

// ---------------------------------------------------------------------------
// Phase 2: organizations with learners (course licensing).
//
//   organizations/{orgId}: name, type, requestId, adminUids[], courses[{ track, slug, title }],
//     editionIds[] (Mentor Hub courses shared as instructor editions), inviteCode,
//     allowMinors, status ('active' | 'ended'), createdAt
//   organizations/{orgId}/members/{uid}: uid, name, email, consent, minor, joinedAt
//   users/{uid}.orgMemberships.{orgId} = true; users/{uid}.isMinor = true (13 to 17)
// ---------------------------------------------------------------------------

const newCode = () => Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6);

export const createOrganization = async (request, adminUids, staff) => {
  const ref = await addDoc(collection(db, 'organizations'), {
    name: request.orgName,
    type: request.orgType,
    requestId: request.id,
    adminUids,
    courses: [],
    editionIds: [],
    inviteCode: newCode(),
    allowMinors: ['school', 'university'].includes(request.orgType),
    status: 'active',
    createdBy: staff.email || '',
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'org_requests', request.id), { organizationId: ref.id, updatedAt: serverTimestamp() });
  return ref.id;
};

export const getOrganization = async (id) => {
  const s = await getDoc(doc(db, 'organizations', id));
  return s.exists() ? { id: s.id, ...s.data() } : null;
};
export const listOrganizations = async () => {
  const snap = await getDocs(collection(db, 'organizations'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
export const listMyOrganizations = async (uid) => {
  const snap = await getDocs(query(collection(db, 'organizations'), where('adminUids', 'array-contains', uid)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
export const findOrgByInvite = async (code) => {
  const snap = await getDocs(query(collection(db, 'organizations'), where('inviteCode', '==', code)));
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
};
export const updateOrganization = (id, data) => updateDoc(doc(db, 'organizations', id), data);

// Instructor editions: share a Mentor Hub course with an organization's instructors.
export const shareEdition = async (org, courseId, share) => {
  await updateDoc(doc(db, 'organizations', org.id), { editionIds: share ? arrayUnion(courseId) : arrayRemove(courseId) });
  await updateDoc(doc(db, 'teacher_courses', courseId), {
    orgInstructorUids: share ? arrayUnion(...org.adminUids) : arrayRemove(...org.adminUids),
  });
};

export const joinOrganization = async (org, user, profile, { minor }) => {
  await setDoc(doc(db, 'organizations', org.id, 'members', user.uid), {
    uid: user.uid,
    name: profile?.displayName || user.displayName || user.email,
    email: user.email,
    consent: true,
    minor: !!minor,
    inviteCode: org.inviteCode,
    joinedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'users', user.uid), {
    [`orgMemberships.${org.id}`]: true,
    ...(minor ? { isMinor: true } : {}),
  });
};

export const leaveOrganization = async (orgId, uid) => {
  await deleteDoc(doc(db, 'organizations', orgId, 'members', uid));
  await updateDoc(doc(db, 'users', uid), { [`orgMemberships.${orgId}`]: deleteField() }).catch(() => {});
};

export const listOrgMembers = async (orgId) => {
  const snap = await getDocs(collection(db, 'organizations', orgId, 'members'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
