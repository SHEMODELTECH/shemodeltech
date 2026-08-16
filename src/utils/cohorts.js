// src/utils/cohorts.js
// Cohort lifecycle for She Model Tech.
//
// Cohorts run in BACK-TO-BACK 8-WEEK CYCLES. While cohort N is building,
// cohort N+1 is being staffed, so nothing idles:
//
//   Week 1  N starts building
//   Week 2  N+1 projects revealed - LEAD APPLICATIONS OPEN
//   Week 3  Lead applications close; reviewers interview
//   Week 4  Leads assigned; each lead refines their project
//   Week 5  CONTRIBUTOR APPLICATIONS OPEN
//   Week 6  Leads review, approve, suggest reassignments
//   Week 7  Teams locked
//   Week 8  N completes (badges + certificates); N+1 becomes the new N
//
// Signup is never closed. People who arrive between cohorts join the
// platform fully (courses, community, profile) and go on the waitlist.

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
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ---------------------------------------------------------------------
// Shape
// ---------------------------------------------------------------------
export const COHORT_LENGTH_WEEKS = 8;
export const GRACE_PERIOD_DAYS = 7;

// Default number of projects per cohort. Deliberately UNDER-SUPPLIED:
// 6 projects x ~5 people = ~30 members. Publishing more projects than the
// cohort can staff produces half-empty teams that all stall, which is the
// worst outcome - everyone experiences failure. Fewer, fuller teams finish.
export const DEFAULT_PROJECTS_PER_COHORT = 6;

// A team is COMMUNITY-funded (free, unsponsored) unless a company sponsors
// it. Both run identically - sponsorship changes who pays a stipend, never
// how the project is run or who owns it.
export const COHORT_FUNDING = { COMMUNITY: 'community', SPONSORED: 'sponsored' };

export const COHORT_STATUS = {
  DRAFT: 'draft', // projects generated, not yet revealed
  LEAD_RECRUITMENT: 'lead_recruitment', // lead applications open
  LEAD_REVIEW: 'lead_review', // applications closed, interviewing
  TEAM_FORMATION: 'team_formation', // leads assigned, contributors applying
  BUILDING: 'building', // teams locked, cohort running
  GRACE: 'grace', // past end date, inside the grace window
  COMPLETE: 'complete',
};

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const addWeeks = (date, w) => new Date(date.getTime() + w * WEEK_MS);
const addDays = (date, d) => new Date(date.getTime() + d * DAY_MS);
const iso = (d) => d.toISOString().slice(0, 10);

/**
 * Build the full date schedule for a cohort from its build start date.
 * Every downstream feature (reveal, reminders, grace) reads these.
 */
export const buildSchedule = (startDate) => {
  const start = new Date(startDate);
  const end = addWeeks(start, COHORT_LENGTH_WEEKS);
  return {
    startDate: iso(start),
    endDate: iso(end),
    graceEndDate: iso(addDays(end, GRACE_PERIOD_DAYS)),
    // Staffing milestones for the NEXT cohort, relative to this one's start.
    revealDate: iso(addWeeks(start, 1)), // week 2
    leadApplyCloseDate: iso(addWeeks(start, 2)), // week 3
    leadsAssignedByDate: iso(addWeeks(start, 3)), // week 4
    teamOpenDate: iso(addWeeks(start, 4)), // week 5
    teamLockDate: iso(addWeeks(start, 6)), // week 7
  };
};

/** Next sequential cohort number. */
export const getNextCohortNumber = async () => {
  const snap = await getDocs(query(collection(db, 'cohorts'), orderBy('number', 'desc'), limit(1)));
  if (snap.empty) return 1;
  return (snap.docs[0].data().number || 0) + 1;
};

/** The cohort currently building (what members see as "this cohort"). */
export const getActiveCohort = async () => {
  const snap = await getDocs(
    query(
      collection(db, 'cohorts'),
      where('status', 'in', [COHORT_STATUS.BUILDING, COHORT_STATUS.GRACE]),
      limit(1)
    )
  );
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
};

/** The cohort currently being staffed (open for lead/team applications). */
export const getFormingCohort = async () => {
  const snap = await getDocs(
    query(
      collection(db, 'cohorts'),
      where('status', 'in', [
        COHORT_STATUS.LEAD_RECRUITMENT,
        COHORT_STATUS.LEAD_REVIEW,
        COHORT_STATUS.TEAM_FORMATION,
      ]),
      limit(1)
    )
  );
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
};

export const getCohort = async (cohortId) => {
  const snap = await getDoc(doc(db, 'cohorts', cohortId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/**
 * Create a cohort. Starts in DRAFT so projects can be generated and
 * reviewed before anyone sees them - never auto-publish unreviewed briefs
 * into a live cohort.
 */
export const createCohort = async ({ startDate, projectCount, createdBy }) => {
  const number = await getNextCohortNumber();
  const schedule = buildSchedule(startDate);
  const ref = await addDoc(collection(db, 'cohorts'), {
    number,
    name: `Cohort ${number}`,
    status: COHORT_STATUS.DRAFT,
    projectCount: projectCount || DEFAULT_PROJECTS_PER_COHORT,
    ...schedule,
    createdBy: createdBy || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: ref.id, number, ...schedule };
};

export const setCohortStatus = async (cohortId, status) =>
  updateDoc(doc(db, 'cohorts', cohortId), { status, updatedAt: serverTimestamp() });

/** All projects belonging to a cohort. */
export const getCohortProjects = async (cohortId) => {
  const snap = await getDocs(query(collection(db, 'projects'), where('cohortId', '==', cohortId)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Completion stats - the number that actually matters. "22 of 30 completed"
 * is what you show a partner company; "400 members" is not.
 */
export const getCohortStats = async (cohortId) => {
  const projects = await getCohortProjects(cohortId);
  const completed = projects.filter(
    (p) => p.status === 'completed' || p.status === 'awaiting_payment_confirmation'
  );
  const lapsed = projects.filter((p) => p.status === 'lapsed');
  const memberCount = projects.reduce((n, p) => n + 1 + (p.members?.length || 0), 0);
  const completedMembers = completed.reduce((n, p) => n + 1 + (p.members?.length || 0), 0);
  return {
    projects: projects.length,
    completed: completed.length,
    lapsed: lapsed.length,
    inProgress: projects.length - completed.length - lapsed.length,
    memberCount,
    completedMembers,
    completionRate: projects.length ? Math.round((completed.length / projects.length) * 100) : 0,
  };
};

/** Days remaining until a date (negative = overdue). */
export const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / DAY_MS);
};
