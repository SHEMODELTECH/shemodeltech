// src/utils/aiRecommendations.js
// AI-powered "Recommended for you": projects + Foundations courses matched to a
// member's profile (academic background, roles, skills, badges, interests).
//
// How it works:
//   1. Gather the member's profile, earned badges, and past applications.
//   2. Gather candidates: open active projects + the Foundations course catalog
//      (compact fields only - titles/summaries, never full markdown).
//   3. Ask Claude (Haiku, via the existing /api/claude-proxy) to pick the best
//      matches and return STRICT JSON with a one-line personalized reason each.
//   4. Validate every returned id against the candidate lists (drop anything
//      the model invented) and hydrate with real titles.
//   5. Cache the result on the user document for 24h (or until the profile
//      changes) so we don't spend an API call on every dashboard visit.

import {
  doc, getDoc, updateDoc, collection, query, where, getDocs, limit,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { CLAUDE_API_CONFIG } from '../config/claudeApiConfig';
import { COURSES_BY_TRACK } from './foundationsCoursesData';
import { trackMeta } from './foundationsCourses';
import { getIndustryLabel } from './industryTracks';

const CACHE_HOURS = 24;
const MAX_PROJECT_CANDIDATES = 20;
const MAX_COURSE_CANDIDATES = 36;

// ---------- Gathering ----------

const truncate = (s, n) => {
  const t = (s || '').toString().trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
};

// A small stable fingerprint of the inputs that matter. If the member's profile
// or the candidate pool changes meaningfully, the cache is invalidated.
const fingerprint = (obj) => {
  const s = JSON.stringify(obj);
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
  return String(h);
};

const gatherProfile = async (currentUser) => {
  const snap = await getDoc(doc(db, 'users', currentUser.uid));
  const u = snap.exists() ? snap.data() : {};

  // Badges earned (roles + levels the member has proven).
  let badges = [];
  try {
    const bSnap = await getDocs(query(
      collection(db, 'member_badges'),
      where('memberEmail', '==', currentUser.email),
      limit(20)
    ));
    badges = bSnap.docs.map(d => {
      const b = d.data();
      return `${b.badgeName || ''}${b.badgeLevel ? ` (${b.badgeLevel})` : ''}`.trim();
    }).filter(Boolean);
  } catch (_) { /* non-blocking */ }

  // Roles they've applied for / held on projects (signal of what they do).
  let rolesHeld = [];
  let appliedProjectIds = [];
  try {
    const aSnap = await getDocs(query(
      collection(db, 'project_applications'),
      where('applicantEmail', '==', currentUser.email),
      limit(30)
    ));
    aSnap.docs.forEach(d => {
      const a = d.data();
      if (a.role && !rolesHeld.includes(a.role)) rolesHeld.push(a.role);
      if (a.projectId) appliedProjectIds.push(a.projectId);
    });
  } catch (_) { /* non-blocking */ }

  return {
    userDoc: u,
    appliedProjectIds,
    profile: {
      education: [u.highestEducation, u.specialization].filter(Boolean).join(' in ') || 'Not stated',
      track: u.primarySkillTrack || 'Not chosen yet',
      experienceLevel: u.experienceLevel || 'Not stated',
      skills: (Array.isArray(u.skills) ? u.skills : []).slice(0, 20).join(', ')
        || u.skillsText || 'Not stated',
      interests: (Array.isArray(u.interests) ? u.interests : []).slice(0, 12).join(', ') || 'Not stated',
      industryInterests: (Array.isArray(u.industryInterests) ? u.industryInterests : [])
        .slice(0, 12).map(getIndustryLabel).join(', ') || 'Not stated',
      badges: badges.slice(0, 10).join('; ') || 'None yet',
      rolesHeld: rolesHeld.slice(0, 8).join(', ') || 'None yet',
      country: u.country || '',
    },
  };
};

const gatherProjectCandidates = async (currentUser, appliedProjectIds) => {
  try {
    // Match the same pool the Projects page shows: active projects accepting
    // collaborators AND auto-generated projects still looking for a lead.
    const snap = await getDocs(query(
      collection(db, 'projects'),
      where('status', 'in', ['active', 'lead_recruitment'])
    ));
    const applied = new Set(appliedProjectIds || []);
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(p =>
        p.applicationsOpen !== false &&
        p.reviewStatus !== 'rejected' &&
        p.submitterId !== currentUser.uid &&
        p.submitterEmail !== currentUser.email &&
        !applied.has(p.id)
      )
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      .slice(0, MAX_PROJECT_CANDIDATES)
      .map(p => ({
        id: p.id,
        title: p.projectTitle || p.title || 'Untitled',
        industry: p.industryTrack || '',
        paid: !!p.isPaid,
        needsLead: p.status === 'lead_recruitment',
        description: truncate(p.projectDescription || p.description || '', 180),
        roles: (p.teamRoles || p.proposedRoles || []).slice(0, 5)
          .map(r => `${r.role || ''}${r.skills ? ` [${truncate(r.skills, 60)}]` : ''}${r.experienceLevel ? ` (${r.experienceLevel})` : ''}`)
          .join('; '),
      }));
  } catch (e) {
    console.error('gatherProjectCandidates failed:', e);
    return [];
  }
};

const gatherCourseCandidates = (userDoc) => {
  const completed = userDoc?.foundationsCourses || {}; // { trackId: { slug: true } }
  const out = [];
  Object.keys(COURSES_BY_TRACK).forEach(trackId => {
    if (trackId === 'company') return;
    (COURSES_BY_TRACK[trackId] || []).forEach(c => {
      if (completed[trackId] && completed[trackId][c.slug]) return; // skip finished
      out.push({
        track: trackId,
        slug: c.slug,
        title: c.title,
        summary: truncate(c.summary, 140),
      });
    });
  });
  return out.slice(0, MAX_COURSE_CANDIDATES);
};

// ---------- Prompt + parse ----------

const buildPrompt = (profile, projects, courses) => `You are the recommendation engine for She Model Tech, a platform where people learn tech skills through Foundations courses and prove them by building real projects in teams.

MEMBER PROFILE
- Academic background: ${profile.education}
- Primary skill track: ${profile.track}
- Experience level: ${profile.experienceLevel}
- Skills & certifications: ${profile.skills}
- Interests: ${profile.interests}
- Industries they're interested in: ${profile.industryInterests}
- Badges earned: ${profile.badges}
- Roles held/applied for: ${profile.rolesHeld}

OPEN PROJECTS (candidates)
${projects.map(p => `- id:${p.id} | ${p.title} | industry:${p.industry} | ${p.paid ? 'PAID' : 'collaborative'} | ${p.needsLead ? 'NEEDS A LEAD (member can apply to lead it)' : 'accepting collaborators'} | roles: ${p.roles} | ${p.description}`).join('\n') || '(none available)'}

FOUNDATIONS COURSES (candidates)
${courses.map(c => `- track:${c.track} slug:${c.slug} | ${c.title} | ${c.summary}`).join('\n') || '(none available)'}

TASK
Pick the SINGLE best match of each kind FOR THIS SPECIFIC MEMBER:
- Exactly 1 project: the strongest fit (only from the candidate list, referenced by its exact id).
- Exactly 1 course: the strongest fit (only from the candidate list, referenced by its exact track and slug).
For each pick, write "reason": ONE short sentence (max 18 words) that references something concrete from THEIR profile (their background, a skill, a badge, or an interest). For the project also give "match": an integer 50-99 estimating fit.
Strongly prefer projects in industries they're interested in. Prefer projects with a role at or near their experience level. Prefer a course in their track or one that fills a gap their goals imply. If a candidate list is empty, return an empty array for it.

OUTPUT
Respond with ONLY valid JSON, no markdown fences, no preamble, exactly this shape:
{"projects":[{"id":"...","match":85,"reason":"..."}],"courses":[{"track":"...","slug":"...","reason":"..."}]}`;

const parseModelJson = (text) => {
  if (!text) return null;
  let t = text.trim().replace(/^```(json)?/i, '').replace(/```$/, '').trim();
  // If the model added any stray prose, grab the outermost JSON object.
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try { return JSON.parse(t.slice(start, end + 1)); } catch { return null; }
};

// ---------- Main entry ----------

/**
 * Get AI recommendations for the signed-in member.
 * @param {object} currentUser - Firebase auth user
 * @param {object} opts - { force: boolean } to bypass the 24h cache
 * @returns {Promise<{projects: Array, courses: Array, generatedAt: number} | null>}
 */
export const getAIRecommendations = async (currentUser, opts = {}) => {
  if (!currentUser?.uid) return null;

  const { userDoc, appliedProjectIds, profile } = await gatherProfile(currentUser);
  if (userDoc?.isCompany) return null; // individuals only

  const [projectCandidates, courseCandidates] = await Promise.all([
    gatherProjectCandidates(currentUser, appliedProjectIds),
    Promise.resolve(gatherCourseCandidates(userDoc)),
  ]);

  const key = fingerprint({
    v: 2, // bump when the recommendation shape/logic changes to invalidate old caches
    profile,
    p: projectCandidates.map(p => p.id),
    c: courseCandidates.length,
  });

  // Serve from cache if fresh and the inputs haven't changed.
  const cached = userDoc?.aiRecs;
  const fresh = cached?.generatedAt && (Date.now() - cached.generatedAt) < CACHE_HOURS * 3600 * 1000;
  if (!opts.force && fresh && cached.key === key && cached.data) {
    return { ...cached.data, generatedAt: cached.generatedAt, fromCache: true };
  }

  if (projectCandidates.length === 0 && courseCandidates.length === 0) return null;

  // Call Claude through the existing server-side proxy (the key never touches the client).
  const response = await fetch('/api/claude-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: CLAUDE_API_CONFIG.models.default,
      max_tokens: 400,
      messages: [{ role: 'user', content: buildPrompt(profile, projectCandidates, courseCandidates) }],
    }),
  });
  if (!response.ok) throw new Error(`Recommendation service error (${response.status})`);
  const data = await response.json();
  const text = (data?.content || []).filter(b => b.type === 'text' || b.text).map(b => b.text).join('\n');
  const parsed = parseModelJson(text);
  if (!parsed) throw new Error('Could not read recommendations');

  // Validate against real candidates - drop anything the model invented.
  const projById = new Map(projectCandidates.map(p => [p.id, p]));
  const courseByKey = new Map(courseCandidates.map(c => [`${c.track}/${c.slug}`, c]));

  const projects = (Array.isArray(parsed.projects) ? parsed.projects : [])
    .filter(r => r && projById.has(r.id))
    .slice(0, 1)
    .map(r => {
      const p = projById.get(r.id);
      return {
        id: p.id,
        title: p.title,
        industry: p.industry,
        paid: p.paid,
        needsLead: !!p.needsLead,
        match: Math.max(50, Math.min(99, parseInt(r.match, 10) || 70)),
        reason: truncate(r.reason, 160) || 'A good fit for your profile.',
      };
    });

  const courses = (Array.isArray(parsed.courses) ? parsed.courses : [])
    .filter(r => r && courseByKey.has(`${r.track}/${r.slug}`))
    .slice(0, 1)
    .map(r => {
      const c = courseByKey.get(`${r.track}/${r.slug}`);
      return {
        track: c.track,
        trackLabel: trackMeta(c.track).label,
        slug: c.slug,
        title: c.title,
        reason: truncate(r.reason, 160) || 'Builds on your current skills.',
      };
    });

  const result = { projects, courses };
  const generatedAt = Date.now();

  // Cache on the user doc (best-effort; a cache failure shouldn't break the UI).
  try {
    await updateDoc(doc(db, 'users', currentUser.uid), {
      aiRecs: { data: result, generatedAt, key },
    });
  } catch (_) {}

  return { ...result, generatedAt, fromCache: false };
};

export default getAIRecommendations;
