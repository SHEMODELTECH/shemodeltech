// src/utils/leadHealth.js
// Detecting an unresponsive project lead, and reassigning the project.
//
// WHY THIS EXISTS
// The lead is a single point of failure: only the project owner can submit
// for review. If she goes quiet in week 6, her whole team loses their badges
// through no fault of their own. That is the most damaging thing that can
// happen to a member in a cohort, so it needs to be caught EARLY and
// automatically - not discovered at the deadline.
//
// THREE SIGNALS, in order of reliability:
//
//  1. PASSIVE (primary) - `users.projectActivity[projectId]` is stamped every
//     time someone opens the workspace. If the lead hasn't opened it in
//     QUIET_DAYS while the project is building, that is objective evidence
//     and nobody had to accuse anyone.
//
//  2. LEAD CHECK-IN (dead-man's switch) - once a week the lead clicks one
//     button. Five seconds when she's present; silence is unambiguous when
//     she isn't. Miss MAX_MISSED_CHECKINS in a row and the project flags.
//
//  3. MEMBER FLAG (backstop) - members can raise a concern, but it takes
//     MIN_FLAGS_TO_ESCALATE independent members to escalate. Reporting your
//     team lead is socially costly, so this must never be the only route;
//     requiring two also protects a lead from one bad-faith report.
//
// All three land in the same reviewer queue. A human always makes the call -
// nothing auto-removes a lead.

import {
  collection, doc, getDoc, getDocs, updateDoc, addDoc, query, where,
  orderBy, limit, serverTimestamp, arrayUnion,
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Tuning
export const QUIET_DAYS = 10;            // no workspace visit = concerning
export const CHECKIN_INTERVAL_DAYS = 7;  // lead confirms once a week
export const MAX_MISSED_CHECKINS = 2;    // two misses = auto-flag
export const MIN_FLAGS_TO_ESCALATE = 2;  // independent members required

export const LEAD_HEALTH = {
  OK: 'ok',
  QUIET: 'quiet',           // passive signal only - watch, don't act
  AT_RISK: 'at_risk',       // multiple signals - reviewer should look
  UNRESPONSIVE: 'unresponsive', // confirmed by a reviewer
};

const DAY_MS = 24 * 60 * 60 * 1000;

const daysSince = (ts) => {
  if (!ts) return Infinity;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return Math.floor((Date.now() - d.getTime()) / DAY_MS);
};

/**
 * Assess a lead's responsiveness from the signals available.
 * Read-only - safe to call anywhere.
 */
export const assessLeadHealth = async (project) => {
  if (!project?.submitterId) {
    return { level: LEAD_HEALTH.OK, reasons: [], daysQuiet: 0 };
  }
  const reasons = [];

  // Signal 1: passive workspace activity
  let daysQuiet = Infinity;
  try {
    const snap = await getDoc(doc(db, 'users', project.submitterId));
    if (snap.exists()) {
      const pa = snap.data().projectActivity || {};
      daysQuiet = daysSince(pa[project.id] || snap.data().lastActiveAt);
    }
  } catch (_) { /* treat as unknown, not as guilt */ }

  if (daysQuiet !== Infinity && daysQuiet >= QUIET_DAYS) {
    reasons.push(`Lead hasn't opened the workspace in ${daysQuiet} days`);
  }

  // Signal 2: missed check-ins
  const missed = project.missedCheckins || 0;
  if (missed >= MAX_MISSED_CHECKINS) {
    reasons.push(`Missed ${missed} weekly check-ins`);
  }

  // Signal 3: member flags (unique members only)
  const flags = project.leadFlags || [];
  const uniqueFlaggers = [...new Set(flags.map(f => f.byUid))];
  if (uniqueFlaggers.length >= MIN_FLAGS_TO_ESCALATE) {
    reasons.push(`${uniqueFlaggers.length} team members raised a concern`);
  }

  let level = LEAD_HEALTH.OK;
  if (project.leadHealth === LEAD_HEALTH.UNRESPONSIVE) {
    level = LEAD_HEALTH.UNRESPONSIVE;
  } else if (reasons.length >= 2) {
    level = LEAD_HEALTH.AT_RISK;
  } else if (reasons.length === 1) {
    level = LEAD_HEALTH.QUIET;
  }

  return { level, reasons, daysQuiet: daysQuiet === Infinity ? null : daysQuiet };
};

/** The lead's weekly "still on track" click. Clears the missed counter. */
export const recordLeadCheckin = async (projectId, uid, note = '') => {
  await updateDoc(doc(db, 'projects', projectId), {
    lastCheckinAt: serverTimestamp(),
    lastCheckinBy: uid,
    lastCheckinNote: note || null,
    missedCheckins: 0,
    leadHealth: LEAD_HEALTH.OK,
    updatedAt: serverTimestamp(),
  });
};

/** Is the lead's weekly check-in due? */
export const isCheckinDue = (project) => {
  if (!project?.lastCheckinAt) return true;
  return daysSince(project.lastCheckinAt) >= CHECKIN_INTERVAL_DAYS;
};

/**
 * A team member raises a concern about the lead. Requires
 * MIN_FLAGS_TO_ESCALATE distinct members before it reaches a reviewer, so
 * one person cannot unseat a lead on their own.
 */
export const flagLeadUnresponsive = async (projectId, member, reason) => {
  const ref = doc(db, 'projects', projectId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Project not found');
  const data = snap.data();

  const existing = data.leadFlags || [];
  if (existing.some(f => f.byUid === member.uid)) {
    throw new Error('You have already raised a concern on this project.');
  }

  await updateDoc(ref, {
    leadFlags: arrayUnion({
      byUid: member.uid,
      byName: member.name || member.email,
      reason: reason || null,
      at: new Date().toISOString(),
    }),
    updatedAt: serverTimestamp(),
  });

  const uniqueCount = new Set([...existing.map(f => f.byUid), member.uid]).size;
  if (uniqueCount >= MIN_FLAGS_TO_ESCALATE) {
    await updateDoc(ref, { leadHealth: LEAD_HEALTH.AT_RISK });
    try {
      await addDoc(collection(db, 'admin_notifications'), {
        type: 'lead_unresponsive',
        projectId,
        projectTitle: data.projectTitle || data.title || 'A project',
        message: `${uniqueCount} members reported the lead as unresponsive.`,
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (_) { /* non-blocking */ }
  }
  return { escalated: uniqueCount >= MIN_FLAGS_TO_ESCALATE, flags: uniqueCount };
};

/**
 * Reviewer reassigns the lead. The outgoing lead is NOT deleted from the
 * project - she keeps her contribution record and can still be evaluated
 * for a contributor badge, because going quiet is usually life, not malice.
 *
 * Firestore rules allow only admin/editor to change `submitterId`.
 */
export const reassignLead = async ({
  projectId, newLead, reviewer, reason,
}) => {
  const ref = doc(db, 'projects', projectId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Project not found');
  const data = snap.data();

  await updateDoc(ref, {
    submitterId: newLead.uid,
    submitterEmail: newLead.email,
    submitterName: newLead.name || newLead.email,
    leadConfirmed: true,
    leadHealth: LEAD_HEALTH.OK,
    missedCheckins: 0,
    leadFlags: [],
    lastCheckinAt: serverTimestamp(),
    leadHistory: arrayUnion({
      previousUid: data.submitterId || null,
      previousName: data.submitterName || null,
      newUid: newLead.uid,
      newName: newLead.name || newLead.email,
      reason: reason || 'Lead became unresponsive',
      byReviewer: reviewer?.email || null,
      at: new Date().toISOString(),
    }),
    updatedAt: serverTimestamp(),
  });

  // Tell the team - they have been carrying uncertainty.
  const notify = async (uid, title, body) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId: uid, recipientId: uid, type: 'lead_reassigned',
        title, body, projectId, read: false, createdAt: serverTimestamp(),
      });
    } catch (_) { /* non-blocking */ }
  };

  const teamUids = new Set([...(data.members || [])]);
  if (data.submitterId) teamUids.add(data.submitterId);
  teamUids.add(newLead.uid);

  for (const uid of teamUids) {
    await notify(
      uid,
      'Your project has a new lead',
      `${newLead.name || newLead.email} is now leading "${data.projectTitle || 'your project'}".`
    );
  }
};

/**
 * Candidates to take over: approved members already on the project. Promoting
 * from inside is faster and better than recruiting a stranger mid-build.
 */
export const getReassignmentCandidates = async (project) => {
  const uids = project.members || [];
  if (!uids.length) return [];
  const out = [];
  for (const uid of uids) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (!snap.exists()) continue;
      const u = snap.data();
      if (u.isCompany) continue; // companies cannot lead collaborative projects
      const health = await (async () => {
        const pa = u.projectActivity || {};
        return daysSince(pa[project.id] || u.lastActiveAt);
      })();
      out.push({
        uid,
        email: u.email,
        name: u.displayName || u.email,
        photoURL: u.photoURL || null,
        daysSinceActive: health === Infinity ? null : health,
      });
    } catch (_) { /* skip */ }
  }
  // Most recently active first - the likeliest to actually pick it up.
  return out.sort((a, b) => (a.daysSinceActive ?? 999) - (b.daysSinceActive ?? 999));
};

/**
 * Every project a reviewer should look at right now.
 *
 * PERFORMANCE NOTE - this deliberately does NOT compute health in the browser.
 * The obvious implementation (fetch all active projects, then read each lead's
 * user doc to check activity) is an N+1: 200 active projects means 201
 * sequential round-trips, which freezes the tab for ~20 seconds.
 *
 * Instead, the nightly cron (api/cron/project-reminders.js) computes
 * `leadHealth` and `leadDaysQuiet` and writes them ONTO the project document.
 * This is then a single indexed query with a hard limit. One read, always,
 * regardless of how many projects exist.
 *
 * Requires a composite index on projects: (leadHealth ASC, endDate ASC).
 */
export const getProjectsNeedingReview = async (max = 50) => {
  const snap = await getDocs(
    query(
      collection(db, 'projects'),
      where('leadHealth', 'in', [LEAD_HEALTH.AT_RISK, LEAD_HEALTH.QUIET]),
      orderBy('endDate', 'asc'),
      limit(max)
    )
  );
  const order = { [LEAD_HEALTH.AT_RISK]: 0, [LEAD_HEALTH.QUIET]: 1 };
  return snap.docs
    .map(d => {
      const project = { id: d.id, ...d.data() };
      return {
        project,
        health: {
          level: project.leadHealth,
          reasons: project.leadHealthReasons || [],
          daysQuiet: project.leadDaysQuiet ?? null,
        },
      };
    })
    .sort((a, b) => order[a.health.level] - order[b.health.level]);
};
