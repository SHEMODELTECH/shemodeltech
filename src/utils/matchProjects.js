// src/utils/matchProjects.js
// Lightweight, transparent project matching for the "find your first project" wizard.
// No ML — a weighted score on profile overlap. Easy to reason about and tune.

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { suggestTracks, trackForRole } from './roleTaxonomy';

// Map an experience level to a rank for closeness comparison.
const LEVEL_RANK = { beginner: 0, 'any-level': 0, intermediate: 1, advanced: 2, expert: 3 };

const norm = (s) => (s || '').toString().trim().toLowerCase();

// Score one project against a user profile. Higher = better fit.
const scoreProject = (project, profile) => {
  let score = 0;
  const reasons = [];

  const userTrack = norm(profile.primarySkillTrack);
  const userSkills = (profile.skills && profile.skills.length
    ? profile.skills
    : norm(profile.specialization).split(',')).map(norm).filter(Boolean);
  const userLevel = LEVEL_RANK[norm(profile.experienceLevel)] ?? 0;
  const userInterests = (profile.interests || []).map(norm);

  // 1) Track match (industryTrack vs user's primary track or interests).
  const projTrack = norm(project.industryTrack);
  if (projTrack && userTrack && projTrack === userTrack) { score += 30; reasons.push('Matches your track'); }
  else if (projTrack && userInterests.includes(projTrack)) { score += 18; reasons.push('Matches your interests'); }

  // 2) Skill overlap against the project's roles' skills.
  const roleSkills = [];
  (project.proposedRoles || project.teamRoles || []).forEach(r => {
    norm(r.skills).split(',').forEach(s => { if (s.trim()) roleSkills.push(s.trim()); });
  });
  let overlap = 0;
  userSkills.forEach(us => { if (roleSkills.some(rs => rs.includes(us) || us.includes(rs))) overlap++; });
  if (overlap > 0) { score += Math.min(overlap * 12, 36); reasons.push(`${overlap} skill${overlap > 1 ? 's' : ''} in common`); }

  // 2b) Track affinity: map the user's skills/specialization/interests to the best
  //     track(s), then reward projects whose roles fall in those tracks. This is how
  //     a non-exact background (e.g. "chemistry + data analysis") still finds a fit.
  const userText = [profile.specialization, (profile.skills || []).join(' '), (profile.interests || []).join(' '), profile.primarySkillTrack].join(' ');
  const rankedTracks = suggestTracks(userText).filter(t => t._score > 0).map(t => t.id);
  if (rankedTracks.length) {
    const projTrackIds = new Set();
    (project.proposedRoles || project.teamRoles || []).forEach(r => {
      const tid = trackForRole(r.role);
      if (tid) projTrackIds.add(tid);
    });
    const topTrack = rankedTracks[0];
    if (projTrackIds.has(topTrack)) { score += 20; reasons.push('Fits your strongest track'); }
    else if (rankedTracks.some(t => projTrackIds.has(t))) { score += 10; reasons.push('Fits one of your tracks'); }
  }

  // 3) Has a beginner / any-level open role (great for first-timers).
  const hasOpenLevel = (project.proposedRoles || project.teamRoles || []).some(r => {
    const lvl = norm(r.experienceLevel);
    return lvl === 'beginner' || lvl === 'any-level' || lvl === '';
  });
  if (hasOpenLevel) { score += 15; if (userLevel <= 1) reasons.push('Open to newcomers'); }

  // 4) Slight freshness boost so new projects surface.
  const created = project.createdAt?.seconds || 0;
  score += Math.min((created / 1e10), 5);

  // 5) Track-aware project-type fit (prevents dead-ends for newcomers):
  //    - TechLeads people want projects that NEED a lead (something to step into).
  //    - Everyone else wants active projects that already HAVE a lead and open roles to join.
  const isLeadTrack = norm(profile.primarySkillTrack) === 'techleads';
  const needsLead = project.status === 'lead_recruitment' && !project.leadConfirmed;
  const hasLeadActive = project.status === 'active' && (project.leadConfirmed || project.submitterId);
  if (isLeadTrack && needsLead) { score += 25; reasons.push('Needs a lead - step up'); }
  else if (!isLeadTrack && hasLeadActive) { score += 20; reasons.push('Open to join'); }
  else if (!isLeadTrack && needsLead) { score += 5; } // still shippable, lower priority

  return { score, reasons };
};

/**
 * Return open projects ranked by fit for the given profile.
 * Always returns something (falls back to newest) so the wizard is never empty.
 */
export const matchProjects = async (profile, max = 6) => {
  let docs = [];
  try {
    const snap = await getDocs(query(
      collection(db, 'projects'),
      where('status', 'in', ['active', 'lead_recruitment', 'setup'])
    ));
    docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .filter(p => p.reviewStatus !== 'rejected');
  } catch (e) {
    console.error('matchProjects fetch failed:', e.message);
    return [];
  }

  const scored = docs.map(p => {
    const { score, reasons } = scoreProject(p, profile);
    return { ...p, _score: score, _reasons: reasons };
  });

  // Sort by score desc, then newest. If everything scored ~0 (sparse profile or
  // board), this still yields newest-first, which is a sensible fallback.
  scored.sort((a, b) => (b._score - a._score) || ((b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));

  return scored.slice(0, max);
};
