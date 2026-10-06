// src/utils/batchGenerateProjects.js
// Admin tool: publish a batch of varied starter projects from the template
// library in one click.
//
// Projects are generated PER COHORT. The default is 6 - deliberately
// under-supplied (6 projects x ~5 people = ~30 members), because publishing
// more projects than a cohort can staff produces half-empty teams that all
// stall. Fewer, fuller teams actually finish.

import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { pickCohortSet } from './projectTemplates';
import { logActivity as logProof } from './activityFeed';
import { DEFAULT_PROJECTS_PER_COHORT } from './cohorts';

// Projects come from the library (projectTemplates.js). pickCohortSet spreads
// them across themes, skips titles already on the board, and fits each team's
// roles so the cohort, together, covers all six badge tracks.

/**
 * Publish a batch of starter projects for a cohort.
 *
 * @param {number} count      how many to create (default 6, one cohort's worth)
 * @param {object} opts
 * @param {string} opts.cohortId      cohort these belong to (required for tracking)
 * @param {number} opts.cohortNumber  for display, e.g. "Cohort 3"
 * @param {string} opts.startDate     cohort build start (YYYY-MM-DD)
 * @param {string} opts.endDate       cohort deadline (YYYY-MM-DD)
 * @param {boolean} opts.draft        create hidden (isActive:false) for review
 *                                    before reveal. Defaults to true - never
 *                                    auto-publish unreviewed briefs into a
 *                                    live cohort.
 * @returns {Promise<{created:number, errors:number, ids:string[]}>}
 */
export const batchGenerateProjects = async (count = DEFAULT_PROJECTS_PER_COHORT, opts = {}) => {
  const {
    cohortId = null,
    cohortNumber = null,
    startDate = null,
    endDate = null,
    startAt = null,
    isPaid = false,
    payPerPerson = 0,
    sponsor = null,
    creator = null,
    teamSize = null,
    draft = true,
  } = opts;
  const snap = await getDocs(collection(db, 'projects')).catch(() => null);
  const used = snap ? snap.docs.map((d) => d.data().projectTitle || d.data().title) : [];
  const templates = pickCohortSet(count, { teamSize, exclude: used, theme: opts.theme || null });
  let created = 0,
    errors = 0;
  const ids = [];

  for (const t of templates) {
    try {
      const newRef = await addDoc(collection(db, 'projects'), {
        projectTitle: t.projectTitle,
        projectDescription: t.projectDescription,
        projectGoals: t.projectGoals || null,
        problemStatement: t.problemStatement || null,
        weeklyPlan: t.weeklyPlan || [],
        theme: t.theme || null,
        industryTrack: t.industryTrack,
        timeline: 'flexible',
        // Already fitted to the team size (the lead plus teamSize - 1 people).
        // The lead can add roles but can't remove or reduce these.
        proposedRoles: t.proposedRoles,
        briefRoles: t.briefRoles || t.proposedRoles,
        ...(teamSize ? { maxTeamSize: Number(teamSize) } : {}),
        teamRoles: [],
        maxTeamSize: 0,
        status: 'lead_recruitment',
        // Draft projects are hidden until a reviewer reveals the cohort.
        isActive: !draft,
        isGenerated: true,
        leadConfirmed: false,
        // Cohort tagging - without this you cannot tell cohort 3's projects
        // from cohort 2's, which breaks the reveal, reminders and stats.
        cohortId,
        cohortNumber,
        // Community-funded by default. Becomes 'sponsored' (with a company
        // name + logo) only when a sponsorship is marked FUNDED.
        fundingType: 'community',
        sponsorName: null,
        sponsorLogo: null,
        startDate,
        endDate,
        startAt,
        // Cohort projects: dates are fixed by She Model Tech; on paid cohorts the
        // lead can't change anything (content, roles, skills, people needed).
        isCohort: !!cohortId,
        ...(() => {
          const obs = [];
          const info = [];
          if (creator?.uid) { obs.push(creator.uid); info.push({ uid: creator.uid, name: creator.name, label: 'She Model Tech (created this cohort)' }); }
          if (sponsor?.uid && sponsor.uid !== creator?.uid) { obs.push(sponsor.uid); info.push({ uid: sponsor.uid, name: sponsor.name, label: 'Sponsor' }); }
          return obs.length ? { observers: obs, observerInfo: info, createdByUid: creator?.uid || null, ...(sponsor ? { sponsor } : {}) } : {};
        })(),
        cohortPaid: !!isPaid,
        ...(isPaid ? { isPaid: true, paidBy: 'She Model Tech', payPerPerson: Number(payPerPerson) || 0 } : {}),
        submitterId: null,
        submitterEmail: null,
        submitterName: 'She Model Tech (Auto-generated)',
        isCompanyPost: false,
        viewCount: 0,
        applicationCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      ids.push(newRef.id);
      // Proof Wall: only announce projects that are actually visible.
      if (!draft)
        try {
          await logProof({
            type: 'lead',
            actorName: 'She Model Tech',
            projectId: newRef.id,
            projectTitle: t.projectTitle,
            meta: 'Open to anyone, apply to lead',
          });
        } catch (_) {
          /* non-blocking */
        }
      created++;
    } catch (e) {
      console.error('Batch generate failed for', t.projectTitle, e.message);
      errors++;
    }
  }

  return { created, errors, ids };
};
