// src/utils/projectProposals.js
// Members can propose their own project to lead. An admin or editor reviews it;
// on approval it becomes an open She Model Tech project and the proposer gets a
// lead application for it (so the usual short chat before leading still applies).
// Also: notifying the lead waitlist when a new project needs a lead.
//
//   project_proposals/{id}: uid, name, email, title, description, track,
//     rolesNeeded, whyLead, status ('new' | 'approved' | 'declined'), note,
//     projectId, createdAt, decidedAt, decidedBy

import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { alertStaff, notifyMember } from './staffAlerts';
import { ROLLING_POOL, assignAsLead } from './leadApplications';

export const PROPOSAL_LIMITS = {
  titleMinWords: 3,
  titleMaxChars: 120,
  descMinWords: 40,
  descMaxChars: 4000,
  rolesMaxChars: 500,
  whyMinWords: 20,
  whyMaxChars: 1500,
};

export const TRACKS = {
  TechDev: 'Coding Developer',
  TechArchs: 'Low/No-Code',
  TechQA: 'Quality Tester',
  TechGuard: 'Cybersecurity',
  TechPO: 'Product Owner',
  TechLeads: 'Non-Technical',
};

export const proposeProject = async (user, form) => {
  const ref = await addDoc(collection(db, 'project_proposals'), {
    uid: user.uid,
    name: user.displayName || user.email,
    email: user.email,
    title: form.title.trim(),
    description: form.description.trim(),
    track: form.track,
    rolesNeeded: form.rolesNeeded.trim(),
    whyLead: form.whyLead.trim(),
    status: 'new',
    createdAt: serverTimestamp(),
  });
  alertStaff({
    type: 'project_proposal',
    title: 'A member proposed a project',
    body: `${user.displayName || user.email} proposed "${form.title.trim()}" and would like to lead it.`,
    link: '/admin/lead-applications',
    roles: ['admin', 'editor'],
  });
  return ref;
};

export const listMyProposals = async (uid) => {
  const snap = await getDocs(query(collection(db, 'project_proposals'), where('uid', '==', uid)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const listProposals = async () => {
  const snap = await getDocs(query(collection(db, 'project_proposals'), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Tell everyone on the lead waitlist that a project needs a lead, then clear it.
export const notifyLeadWaitlist = async (projectTitle) => {
  try {
    const snap = await getDocs(query(collection(db, 'waitlist'), where('interest', '==', 'lead')));
    await Promise.all(
      snap.docs.map(async (d) => {
        const w = d.data();
        await notifyMember(w.userId, {
          type: 'lead_waitlist',
          title: 'A new project needs a lead',
          body: `"${projectTitle}" is open for lead applications.`,
          link: '/apply-to-lead',
          ctaLabel: 'Apply to lead',
          emailTo: w.email,
        });
        await deleteDoc(doc(db, 'waitlist', d.id)).catch(() => {});
      })
    );
    return snap.size;
  } catch (_) {
    return 0;
  }
};

// Free cohorts that haven't started yet, earliest first: where an approved
// proposal goes (the current cohort if it hasn't started, otherwise the next).
export const listOpenCohorts = async () => {
  const snap = await getDocs(collection(db, 'cohorts'));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    // Free cohorts whose build hasn't started (draft, lead applications, interviews, team forming).
    .filter((c) => !c.isPaid && !['complete', 'completed', 'grace', 'building'].includes(c.status))
    .sort((a, b) => String(a.startAt || a.startDate).localeCompare(String(b.startAt || b.startDate)));
};

export const approveProposal = async (p, staff, cohort) => {
  if (!cohort) throw new Error('Choose a cohort for this project first.');
  const projectRef = await addDoc(collection(db, 'projects'), {
    projectTitle: p.title,
    projectDescription: p.description,
    industryTrack: p.track,
    timeline: 'flexible',
    proposedRoles: p.rolesNeeded ? p.rolesNeeded.split(/\n|,/).map((r) => ({ title: r.trim() })).filter((r) => r.title) : [],
    teamRoles: [],
    maxTeamSize: 0,
    status: 'lead_recruitment',
    // Visible now if the cohort has been revealed; otherwise with the cohort's reveal.
    isActive: cohort.status !== 'draft',
    isGenerated: false,
    proposedBy: { uid: p.uid, name: p.name },
    // Part of the cohort: same start and deadline; the lead can't change the dates.
    cohortId: cohort.id,
    cohortNumber: cohort.number || null,
    startDate: cohort.startDate,
    endDate: cohort.endDate,
    startAt: cohort.startAt || null,
    isCohort: true,
    cohortPaid: false,
    ...(cohort.creator?.uid ? { observers: [cohort.creator.uid], observerInfo: [{ uid: cohort.creator.uid, name: cohort.creator.name, label: 'She Model Tech (created this cohort)' }], createdByUid: cohort.creator.uid } : {}),
    leadConfirmed: false,
    submitterId: null,
    submitterEmail: null,
    submitterName: 'She Model Tech',
    isCompanyPost: false,
    viewCount: 0,
    applicationCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  // The proposer's lead application, then assign her straight away: approving
  // her proposal is the decision.
  const appRef = await addDoc(collection(db, 'lead_applications'), {
    cohortId: ROLLING_POOL,
    applicantUid: p.uid,
    applicantName: p.name,
    applicantEmail: p.email,
    rankedProjectIds: [projectRef.id],
    applicantPhoto: null,
    pitch: p.whyLead,
    experience: null,
    availabilityHours: null,
    status: 'submitted',
    fromProposal: true,
    interviewScheduledAt: null,
    meetLink: null,
    reviewerNotes: null,
    decidedBy: null,
    decidedAt: null,
    assignedProjectId: null,
    createdAt: serverTimestamp(),
  });
  await assignAsLead({
    appId: appRef.id,
    projectId: projectRef.id,
    applicant: { applicantUid: p.uid, applicantName: p.name, applicantEmail: p.email, id: appRef.id },
    reviewer: staff,
  });
  await updateDoc(doc(db, 'project_proposals', p.id), {
    status: 'approved',
    projectId: projectRef.id,
    decidedAt: serverTimestamp(),
    decidedBy: staff.email || '',
  });
  notifyMember(p.uid, {
    type: 'project_proposal_decision',
    title: 'Your project idea was approved, and you’re its lead',
    body: `"${p.title}" is part of ${cohort.name || 'the next cohort'}, starting ${cohort.startDate} with a deadline of ${cohort.endDate}. Set up your project and start building your team.`,
    link: `/projects/${projectRef.id}`,
  });
  return projectRef.id;
};

export const declineProposal = async (p, staff, note) => {
  await updateDoc(doc(db, 'project_proposals', p.id), {
    status: 'declined',
    note: (note || '').trim() || null,
    decidedAt: serverTimestamp(),
    decidedBy: staff.email || '',
  });
  notifyMember(p.uid, {
    type: 'project_proposal_decision',
    title: 'Update on your project idea',
    body: (note || '').trim() || `We aren't taking "${p.title}" forward right now. You're welcome to propose another idea.`,
    link: '/apply-to-lead',
  });
};
