// src/utils/projectReview.js
// Admin review pipeline for project completion.
//
// A project must be reviewed and APPROVED by an admin before the owner can
// assign badges / mark it complete. Flow:
//
//   none  ->  submitted  ->  needs_changes  ->  submitted  ->  ...  ->  approved
//                       \->  rejected (terminal: no badges, no resubmit)
//                        \-> approved  (owner may now assign badges)
//
// The review subject is the project's submission link (from the Resources tab)
// PLUS the workspace link, which we auto-include on submit.

import { db } from '../firebase/config';
import {
  doc, updateDoc, addDoc, collection, query, where, getDocs, serverTimestamp,
} from 'firebase/firestore';
import { membersMeetMinTeamSize, MIN_TEAM_SIZE_MEMBERS_ERROR } from './projectRoles';
import { validateSubmission, GITHUB_ORG } from './githubSubmission';

export const REVIEW_STATUS = {
  NONE: 'none',
  SUBMITTED: 'submitted',
  NEEDS_CHANGES: 'needs_changes',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Build the canonical workspace URL for a project (auto-included in submissions).
export const buildWorkspaceUrl = (projectId) =>
  `${typeof window !== 'undefined' ? window.location.origin : 'https://shemodeltech.com'}/projects/${projectId}/workspace`;

// Notify a single user (by email) via the notifications collection.
const notifyByEmail = async (email, payload) => {
  if (!email) return;
  try {
    const snap = await getDocs(query(collection(db, 'users'), where('email', '==', email)));
    if (!snap.empty) {
      await addDoc(collection(db, 'notifications'), {
        userId: snap.docs[0].id,
        isRead: false,
        createdAt: serverTimestamp(),
        ...payload,
      });
    }
  } catch (e) { console.error('notifyByEmail failed:', e); }
};

// Notify a list of member emails.
const notifyMembers = async (memberEmails, payload) => {
  for (const email of memberEmails) {
    // eslint-disable-next-line no-await-in-loop
    await notifyByEmail(email, payload);
  }
};

// --- OWNER: submit (or re-submit) the project for review ---
//
// A submission now requires a GITHUB REPOSITORY plus confirmation that the
// SHEMODELTECH account was invited as a collaborator. A public link proves a
// project exists; commit history proves WHO BUILT IT, and that is what a badge
// actually certifies.
//
// @param {object} submission
//   { repoUrl, collaboratorInvited, liveUrl?, notes? }
//   A bare string is still accepted for backwards compatibility with older
//   callers, and is treated as the repo URL.
export const submitProjectForReview = async (project, owner, submission) => {
  const projectId = project.id;

  const payload = typeof submission === 'string'
    ? { repoUrl: submission, collaboratorInvited: false }
    : (submission || {});

  const { valid, errors, repoUrl } = validateSubmission(payload);
  if (!valid) throw new Error(errors.join(' '));

  const submissionUrl = repoUrl;

  // No solo projects: a project can't go to review with the owner as its only
  // person. Checked here (not just in the UI) so every caller is covered.
  const memberEmails = await getProjectMemberEmails(projectId);
  if (!membersMeetMinTeamSize(memberEmails.length)) {
    throw new Error(MIN_TEAM_SIZE_MEMBERS_ERROR);
  }

  const workspaceUrl = buildWorkspaceUrl(projectId);

  // Review round counter. There is no hard cap on resubmissions, but the
  // round number is tracked so reviewers can see a team is on attempt 5 and
  // switch to talking to the lead directly - endless rounds usually mean the
  // brief was unclear, not that the team is incapable.
  const round = (project.reviewRound || 0) + 1;

  await updateDoc(doc(db, 'projects', projectId), {
    reviewStatus: REVIEW_STATUS.SUBMITTED,
    reviewSubmittedAt: serverTimestamp(),
    reviewSubmittedBy: owner?.email || null,
    reviewSubmissionUrl: submissionUrl,
    reviewRepoUrl: submissionUrl,
    reviewLiveUrl: (payload.liveUrl || '').trim() || null,
    reviewSubmissionNotes: (payload.notes || '').trim() || null,
    // The lead asserts the invite was sent; the reviewer verifies it before
    // approving. Stored so a false claim is on the record.
    collaboratorInvited: !!payload.collaboratorInvited,
    collaboratorInvitedOrg: GITHUB_ORG,
    collaboratorConfirmedByReviewer: false,
    reviewWorkspaceUrl: workspaceUrl,
    reviewRound: round,
    reviewFeedback: null, // clear any prior "needs changes" note on resubmit
  });

  // Notify admins (via a queue collection the AdminPanel reads).
  try {
    await addDoc(collection(db, 'admin_notifications'), {
      type: 'project_review_submitted',
      projectId,
      projectTitle: project.projectTitle || project.title || 'Untitled project',
      submittedBy: owner?.email || null,
      submissionUrl,
      repoUrl: submissionUrl,
      collaboratorInvited: !!payload.collaboratorInvited,
      reviewRound: round,
      workspaceUrl,
      isRead: false,
      createdAt: serverTimestamp(),
    });
  } catch (e) { console.error('admin notify failed:', e); }

  return { workspaceUrl, reviewRound: round };
};

// --- ADMIN: send back for changes (unlimited back-and-forth) ---
export const requestChanges = async (project, admin, feedback, memberEmails = []) => {
  const projectId = project.id;
  await updateDoc(doc(db, 'projects', projectId), {
    reviewStatus: REVIEW_STATUS.NEEDS_CHANGES,
    reviewFeedback: feedback || 'Changes requested. Please review and re-submit.',
    reviewedAt: serverTimestamp(),
    reviewedBy: admin?.email || null,
    // Keep the running count of how many times this has gone back and forth.
    changesRequestedCount: (project.changesRequestedCount || 0) + 1,
  });

  const title = project.projectTitle || project.title || 'your project';
  // Owner
  await notifyByEmail(project.reviewSubmittedBy || project.submitterEmail, {
    type: 'project_needs_changes',
    projectId,
    projectTitle: title,
    forOwner: true,
    message: `"${title}" needs changes before approval. Reviewer note: ${feedback || 'See details and re-submit.'}`,
  });
  // Team
  await notifyMembers(memberEmails, {
    type: 'project_needs_changes',
    projectId,
    projectTitle: title,
    message: `"${title}" needs changes before approval. Your project lead will update and re-submit.`,
  });
};

// --- ADMIN: approve (owner may now assign badges) ---
export const approveProjectReview = async (project, admin, memberEmails = []) => {
  const projectId = project.id;
  await updateDoc(doc(db, 'projects', projectId), {
    reviewStatus: REVIEW_STATUS.APPROVED,
    reviewApprovedAt: serverTimestamp(),
    reviewApprovedBy: admin?.email || null,
    reviewFeedback: null,
  });

  const title = project.projectTitle || project.title || 'your project';
  // Owner - can now assign badges. forOwner routes the notification click to
  // the project completion ("manage project") page instead of the proof wall.
  await notifyByEmail(project.reviewSubmittedBy || project.submitterEmail, {
    type: 'project_review_approved',
    projectId,
    projectTitle: title,
    forOwner: true,
    message: `"${title}" has been approved! You can now assign badges to your team.`,
  });
  // Team - clicking opens the project workspace.
  await notifyMembers(memberEmails, {
    type: 'project_review_approved',
    projectId,
    projectTitle: title,
    message: `"${title}" has been approved by She Model Tech! Your project lead will now assign badges.`,
  });
};

// --- ADMIN: reject (terminal: no badges, no resubmit) ---
export const rejectProjectReview = async (project, admin, feedback, memberEmails = []) => {
  const projectId = project.id;
  await updateDoc(doc(db, 'projects', projectId), {
    reviewStatus: REVIEW_STATUS.REJECTED,
    reviewRejectedAt: serverTimestamp(),
    reviewRejectedBy: admin?.email || null,
    reviewFeedback: feedback || 'This project did not meet the requirements for approval.',
  });

  const title = project.projectTitle || project.title || 'your project';
  await notifyByEmail(project.reviewSubmittedBy || project.submitterEmail, {
    type: 'project_review_rejected',
    projectId,
    projectTitle: title,
    message: `"${title}" was not approved. ${feedback || ''} No badges can be assigned and the project cannot be re-submitted.`,
  });
  await notifyMembers(memberEmails, {
    type: 'project_review_rejected',
    projectId,
    projectTitle: title,
    message: `"${title}" was not approved by She Model Tech. No badges will be assigned for this project.`,
  });
};

// Helper: fetch approved member emails for a project (for team notifications).
export const getProjectMemberEmails = async (projectId) => {
  try {
    const snap = await getDocs(query(
      collection(db, 'project_applications'),
      where('projectId', '==', projectId),
      where('status', '==', 'approved'),
    ));
    return snap.docs.map(d => d.data().applicantEmail).filter(Boolean);
  } catch (e) {
    console.error('getProjectMemberEmails failed:', e);
    return [];
  }
};
