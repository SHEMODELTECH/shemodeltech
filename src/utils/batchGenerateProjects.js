// src/utils/batchGenerateProjects.js
// Admin tool: publish a batch of varied starter projects from the template
// library in one click.
//
// Projects are generated PER COHORT. The default is 6 - deliberately
// under-supplied (6 projects x ~5 people = ~30 members), because publishing
// more projects than a cohort can staff produces half-empty teams that all
// stall. Fewer, fuller teams actually finish.

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { PROJECT_TEMPLATES } from './projectTemplates';
import { logActivity as logProof } from './activityFeed';
import { DEFAULT_PROJECTS_PER_COHORT } from './cohorts';

// Shuffle a copy of an array (Fisher-Yates).
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Pick `count` templates spread across as many different tracks as possible,
// so a batch feels diverse rather than 30 near-identical projects.
const pickVaried = (count) => {
  const byTrack = {};
  PROJECT_TEMPLATES.forEach(t => {
    const k = t.industryTrack || 'other';
    (byTrack[k] = byTrack[k] || []).push(t);
  });
  // Shuffle within each track, then round-robin across tracks.
  const tracks = shuffle(Object.keys(byTrack));
  const queues = tracks.map(k => shuffle(byTrack[k]));
  const picked = [];
  let exhausted = false;
  while (picked.length < count && !exhausted) {
    exhausted = true;
    for (const q of queues) {
      if (q.length) {
        picked.push(q.shift());
        exhausted = false;
        if (picked.length >= count) break;
      }
    }
  }
  return picked;
};

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
export const batchGenerateProjects = async (
  count = DEFAULT_PROJECTS_PER_COHORT,
  opts = {}
) => {
  const {
    cohortId = null, cohortNumber = null,
    startDate = null, endDate = null,
    draft = true,
  } = opts;
  const templates = pickVaried(count);
  let created = 0, errors = 0;
  const ids = [];

  for (const t of templates) {
    try {
      const newRef = await addDoc(collection(db, 'projects'), {
        projectTitle: t.projectTitle,
        projectDescription: t.projectDescription,
        projectGoals: t.projectGoals || null,
        industryTrack: t.industryTrack,
        timeline: 'flexible',
        proposedRoles: t.proposedRoles,
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
      if (!draft) try {
        await logProof({
          type: 'lead',
          actorName: 'She Model Tech',
          projectId: newRef.id,
          projectTitle: t.projectTitle,
          meta: 'Open to anyone, apply to lead',
        });
      } catch (_) { /* non-blocking */ }
      created++;
    } catch (e) {
      console.error('Batch generate failed for', t.projectTitle, e.message);
      errors++;
    }
  }

  return { created, errors, ids };
};
