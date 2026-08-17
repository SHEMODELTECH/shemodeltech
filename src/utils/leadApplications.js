// src/utils/leadApplications.js
//
// Applying to LEAD a cohort project.
//
// WHY THIS REPLACES THE OLD FLOW
// Previously the first person to click "Apply to Lead" instantly became the
// owner. On an open board that was fine. In a cohort it is not: one flaky
// lead sinks a whole team's eight weeks, and there was no way to choose
// between two good candidates. Leads are now SELECTED after an interview.
//
// RANKED CHOICES
// An applicant ranks up to 3 projects. With ~6 projects and many applicants,
// most people will not get their first choice, and a strong candidate who
// loses one project should be offered another rather than nothing. Ranking
// makes that automatic instead of a manual scramble.
//
// SCHEDULING
// Interviews happen on Google Meet. We store the link and time rather than
// building video or a calendar OAuth integration, at ~6 interviews per
// 8-week cycle, that is not worth the consent-screen friction.

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const LEAD_APP_STATUS = {
  SUBMITTED: 'submitted',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  ASSIGNED: 'assigned', // got a project to lead
  OFFERED_ROLE: 'offered_role', // not leading, but invited as a contributor
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
};

export const MAX_RANKED_CHOICES = 3;

// ---------------------------------------------------------------------
// Applicant side
// ---------------------------------------------------------------------

/**
 * Apply to lead, ranking up to 3 projects in preference order.
 * One live application per person per cohort.
 */
export const applyToLead = async ({
  cohortId,
  applicant,
  rankedProjectIds,
  pitch,
  experience,
  availabilityHours,
}) => {
  if (!rankedProjectIds?.length) {
    throw new Error('Choose at least one project you would like to lead.');
  }
  if (rankedProjectIds.length > MAX_RANKED_CHOICES) {
    throw new Error(`You can rank up to ${MAX_RANKED_CHOICES} projects.`);
  }
  if (!pitch || pitch.trim().length < 40) {
    throw new Error(
      'Tell us a little more about why you want to lead, a couple of sentences at least.'
    );
  }

  const existing = await getDocs(
    query(
      collection(db, 'lead_applications'),
      where('cohortId', '==', cohortId),
      where('applicantUid', '==', applicant.uid)
    )
  );
  const live = existing.docs.find(
    (d) => ![LEAD_APP_STATUS.WITHDRAWN, LEAD_APP_STATUS.REJECTED].includes(d.data().status)
  );
  if (live) {
    throw new Error('You already have an application in for this cohort.');
  }

  const ref = await addDoc(collection(db, 'lead_applications'), {
    cohortId,
    applicantUid: applicant.uid,
    applicantEmail: applicant.email,
    applicantName: applicant.displayName || applicant.email,
    applicantPhoto: applicant.photoURL || null,
    rankedProjectIds,
    pitch: pitch.trim(),
    experience: (experience || '').trim() || null,
    availabilityHours: availabilityHours || null,
    status: LEAD_APP_STATUS.SUBMITTED,
    // Reviewer fields, filled in later.
    interviewScheduledAt: null,
    meetLink: null,
    reviewerNotes: null,
    decidedBy: null,
    decidedAt: null,
    assignedProjectId: null,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

/** Applicant withdraws. The only self-service change they can make. */
export const withdrawApplication = async (appId) =>
  updateDoc(doc(db, 'lead_applications', appId), {
    status: LEAD_APP_STATUS.WITHDRAWN,
    withdrawnAt: serverTimestamp(),
  });

/** This person's application for a cohort, if any. */
export const getMyApplication = async (cohortId, uid) => {
  const snap = await getDocs(
    query(
      collection(db, 'lead_applications'),
      where('cohortId', '==', cohortId),
      where('applicantUid', '==', uid)
    )
  );
  if (snap.empty) return null;
  const live = snap.docs.find((d) => d.data().status !== LEAD_APP_STATUS.WITHDRAWN);
  const chosen = live || snap.docs[0];
  return { id: chosen.id, ...chosen.data() };
};

// ---------------------------------------------------------------------
// Reviewer side (admin + editor)
// ---------------------------------------------------------------------

/** The review queue for a cohort. One indexed query, no N+1. */
export const getApplicationsForCohort = async (cohortId) => {
  const snap = await getDocs(
    query(
      collection(db, 'lead_applications'),
      where('cohortId', '==', cohortId),
      orderBy('createdAt', 'asc')
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Group applications by project, so a reviewer sees "4 people want to lead
 * Project A, nobody wants Project D", which is the view that actually
 * drives decisions.
 */
export const groupByProject = (applications, projects) => {
  const map = new Map(projects.map((p) => [p.id, { project: p, applicants: [] }]));
  for (const app of applications) {
    if ([LEAD_APP_STATUS.WITHDRAWN, LEAD_APP_STATUS.REJECTED].includes(app.status)) continue;
    (app.rankedProjectIds || []).forEach((pid, rank) => {
      const entry = map.get(pid);
      if (entry) entry.applicants.push({ ...app, rank: rank + 1 });
    });
  }
  // Within a project, first choices before second, then earliest applied.
  for (const entry of map.values()) {
    entry.applicants.sort(
      (a, b) => a.rank - b.rank || (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
    );
  }
  return [...map.values()];
};

/** Record a scheduled Google Meet interview and notify the applicant. */
export const scheduleInterview = async ({ appId, scheduledAt, meetLink, reviewer }) => {
  await updateDoc(doc(db, 'lead_applications', appId), {
    status: LEAD_APP_STATUS.INTERVIEW_SCHEDULED,
    interviewScheduledAt: scheduledAt,
    meetLink: meetLink || null,
    scheduledBy: reviewer?.email || null,
    updatedAt: serverTimestamp(),
  });

  const snap = await getDoc(doc(db, 'lead_applications', appId));
  const app = snap.data();
  await notify(
    app.applicantUid,
    {
      type: 'lead_interview_scheduled',
      title: 'Your lead interview is scheduled',
      body: `We'd love to talk about you leading a project. ${
        scheduledAt ? `Scheduled for ${new Date(scheduledAt).toLocaleString()}.` : ''
      }`,
      link: meetLink || '/cohort/apply-to-lead',
    },
    app.applicantEmail
  );
};

/** Save private notes during or after the interview. Reviewer-only. */
export const saveReviewerNotes = async (appId, notes, reviewer) =>
  updateDoc(doc(db, 'lead_applications', appId), {
    reviewerNotes: notes,
    notesBy: reviewer?.email || null,
    updatedAt: serverTimestamp(),
  });

/**
 * Assign this applicant as lead of a project.
 * Only admin/editor can do this, firestore.rules enforces it, because
 * `submitterId` on a project is reviewer-writable only.
 */
export const assignAsLead = async ({ appId, projectId, applicant, reviewer }) => {
  const projectRef = doc(db, 'projects', projectId);
  const projectSnap = await getDoc(projectRef);
  if (!projectSnap.exists()) throw new Error('Project not found.');
  const project = projectSnap.data();

  if (project.leadConfirmed) {
    throw new Error('That project already has a confirmed lead.');
  }

  await updateDoc(projectRef, {
    submitterId: applicant.applicantUid,
    submitterEmail: applicant.applicantEmail,
    submitterName: applicant.applicantName,
    leadConfirmed: true,
    leadAssignedBy: reviewer?.email || null,
    leadAssignedAt: serverTimestamp(),
    status: 'setup', // lead now refines the brief and opens roles
    isActive: true,
    leadHealth: 'ok',
    missedCheckins: 0,
    lastCheckinAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await updateDoc(doc(db, 'lead_applications', appId), {
    status: LEAD_APP_STATUS.ASSIGNED,
    assignedProjectId: projectId,
    decidedBy: reviewer?.email || null,
    decidedAt: serverTimestamp(),
  });

  await notify(
    applicant.applicantUid,
    {
      type: 'lead_assigned',
      title: `You're leading "${project.projectTitle || project.title}"`,
      body: 'Open your project to refine the brief and open roles for your team.',
      link: `/projects/${projectId}/setup`,
    },
    applicant.applicantEmail
  );
};

/**
 * Not selected to lead, but invited to join as a contributor instead.
 *
 * This matters: someone confident enough to apply to lead is exactly who you
 * want on a team. Losing them to a bare rejection is the most expensive
 * mistake in the whole selection process, so this is one click, not a
 * manual message.
 */
export const rejectAsLeadInviteAsContributor = async ({
  appId,
  applicant,
  suggestedProjectId,
  suggestedRole,
  message,
  reviewer,
}) => {
  await updateDoc(doc(db, 'lead_applications', appId), {
    status: LEAD_APP_STATUS.OFFERED_ROLE,
    suggestedProjectId: suggestedProjectId || null,
    suggestedRole: suggestedRole || null,
    decisionMessage: message || null,
    decidedBy: reviewer?.email || null,
    decidedAt: serverTimestamp(),
  });

  let projectTitle = 'a project in this cohort';
  if (suggestedProjectId) {
    try {
      const ps = await getDoc(doc(db, 'projects', suggestedProjectId));
      if (ps.exists()) projectTitle = ps.data().projectTitle || ps.data().title;
    } catch (_) {
      /* fall back to generic wording */
    }
  }

  await notify(
    applicant.applicantUid,
    {
      type: 'lead_role_offered',
      title: 'We\u2019d like you on a team this cohort',
      body:
        message ||
        `We had more strong lead applicants than projects. We'd love you on ${projectTitle}${
          suggestedRole ? ` as ${suggestedRole}` : ''
        }.`,
      link: suggestedProjectId ? `/projects/${suggestedProjectId}` : '/projects',
    },
    applicant.applicantEmail
  );
};

/** Straight rejection, with a reason. Used sparingly. */
export const rejectApplication = async ({ appId, applicant, reason, reviewer }) => {
  await updateDoc(doc(db, 'lead_applications', appId), {
    status: LEAD_APP_STATUS.REJECTED,
    decisionMessage: reason || null,
    decidedBy: reviewer?.email || null,
    decidedAt: serverTimestamp(),
  });
  await notify(
    applicant.applicantUid,
    {
      type: 'lead_not_selected',
      title: 'Update on your lead application',
      body:
        reason ||
        'You weren\u2019t selected to lead this cohort, but you can apply again next cycle.',
      link: '/projects',
    },
    applicant.applicantEmail
  );
};

/**
 * After leads are assigned, find applicants who ranked a still-unled project
 * second or third, so a strong candidate who lost their first choice gets
 * offered another rather than nothing.
 */
export const getFallbackCandidates = (applications, unassignedProjectId) =>
  applications
    .filter(
      (a) =>
        a.status === LEAD_APP_STATUS.SUBMITTED || a.status === LEAD_APP_STATUS.INTERVIEW_SCHEDULED
    )
    .map((a) => ({ ...a, rank: (a.rankedProjectIds || []).indexOf(unassignedProjectId) + 1 }))
    .filter((a) => a.rank > 0)
    .sort((a, b) => a.rank - b.rank);

// ---------------------------------------------------------------------
/**
 * Notify a member in the app AND by email.
 *
 * In-app alone is not enough here: a woman waiting on a lead decision is not
 * sitting on the site refreshing, so a bell she never sees is the same as no
 * decision at all. Email is the channel that actually reaches her.
 *
 * @param {string} uid
 * @param {object} payload  { type, title, body, link }
 * @param {string} [email]  recipient address; skips email if omitted
 */
const notify = async (uid, payload, email) => {
  if (!uid) return;

  // In-app first: it is the record, and must not fail because email fails.
  try {
    await addDoc(collection(db, 'notifications'), {
      userId: uid,
      recipientId: uid,
      isRead: false,
      read: false,
      createdAt: serverTimestamp(),
      ...payload,
    });
  } catch (e) {
    console.error('notify failed:', e); // never block the decision on a notification
  }

  if (!email) return;
  try {
    const site = window.location.origin;
    await fetch('/api/notifications/send-generic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: payload.title || 'Update from She Model Tech',
        heading: payload.title,
        body: payload.body || '',
        ctaLabel: 'Open She Model Tech',
        ctaUrl: payload.link
          ? `${site}${payload.link.startsWith('http') ? '' : ''}${payload.link}`
          : site,
      }),
    });
  } catch (e) {
    console.error('notify email failed:', e); // non-blocking
  }
};
