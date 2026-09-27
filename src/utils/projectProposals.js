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
import { ROLLING_POOL } from './leadApplications';

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

export const approveProposal = async (p, staff) => {
  const projectRef = await addDoc(collection(db, 'projects'), {
    projectTitle: p.title,
    projectDescription: p.description,
    industryTrack: p.track,
    timeline: 'flexible',
    proposedRoles: p.rolesNeeded ? p.rolesNeeded.split(/\n|,/).map((r) => ({ title: r.trim() })).filter((r) => r.title) : [],
    teamRoles: [],
    maxTeamSize: 0,
    status: 'lead_recruitment',
    isActive: true,
    isGenerated: false,
    proposedBy: { uid: p.uid, name: p.name },
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
  // The proposer's lead application for their own project.
  await addDoc(collection(db, 'lead_applications'), {
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
  }).catch(() => {});
  await updateDoc(doc(db, 'project_proposals', p.id), {
    status: 'approved',
    projectId: projectRef.id,
    decidedAt: serverTimestamp(),
    decidedBy: staff.email || '',
  });
  notifyLeadWaitlist(p.title);
  notifyMember(p.uid, {
    type: 'project_proposal_decision',
    title: 'Your project idea was approved',
    body: `"${p.title}" is now a She Model Tech project. We'll set up a short chat about leading it.`,
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
