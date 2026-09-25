// src/utils/roleEligibility.js
// Enforced role-difficulty matching for project applications.
//
// A project role carries an experienceLevel (beginner | intermediate | advanced | any-level).
// A member earns badges per category with a level (Novice | Associate | Advanced | Expert),
// derived from how many projects they've completed in that category.
//
// This module decides whether a given member is eligible to APPLY to a given role,
// based on the badge level they've earned in that role's category. Beginner and
// any-level roles are always open (so newcomers always have an on-ramp); higher
// roles unlock as members earn badges. Enforcement keeps the Talent Board signal
// trustworthy for recruiters and protects project outcomes for skilled members.

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Ordered ladders so we can compare with >=
export const BADGE_LEVELS = ['Novice', 'Associate', 'Advanced', 'Expert'];
export const ROLE_LEVELS = ['beginner', 'intermediate', 'advanced'];

// Minimum earned badge level required to apply to a role of a given difficulty.
// beginner / any-level => no badge required (open to everyone, including brand-new members).
// intermediate => must have earned at least an Associate badge in that category.
// advanced => must have earned at least an Advanced badge in that category.
const ROLE_REQUIREMENT = {
  'beginner': null,
  'any-level': null,
  '': null,
  'intermediate': 'Associate',
  'advanced': 'Advanced',
};

// Map a free-text role name to one of the six badge categories.
// Mirrors mapRoleToCategory in ProjectCompletion.jsx so eligibility and
// awarding stay consistent.
export const mapRoleToCategory = (role) => {
  const r = (role || '').toLowerCase();
  if (r.includes('mentor')) return 'mentorship';
  if (r.includes('qa') || r.includes('test')) return 'quality-assurance';
  if (r.includes('lead') || r.includes('project')) return 'leadership';
  if (r.includes('design') || r.includes('arch')) return 'design';
  if (r.includes('security') || r.includes('guard')) return 'security';
  return 'development';
};

// Highest badge level a member holds in a category, given their user doc.
// Reads the badges[] array (each entry has { category, level }). Returns null
// if they hold none in that category.
export const getMemberLevelInCategory = (userData, category) => {
  if (!userData) return null;
  const badges = Array.isArray(userData.badges) ? userData.badges : [];
  let bestIndex = -1;
  for (const b of badges) {
    if (b.category === category) {
      const idx = BADGE_LEVELS.indexOf(b.level);
      if (idx > bestIndex) bestIndex = idx;
    }
  }
  return bestIndex >= 0 ? BADGE_LEVELS[bestIndex] : null;
};

// Core check (pure): is a member with `userData` eligible to apply to `role`?
// Returns { eligible, required, current, category, reason }.
export const checkRoleEligibility = (userData, role) => {
  const level = (role?.experienceLevel || 'any-level').toLowerCase();
  const required = ROLE_REQUIREMENT[level] ?? null;
  const category = mapRoleToCategory(role?.role);

  // Open roles: anyone can apply.
  if (!required) {
    return { eligible: true, required: null, current: null, category, reason: null };
  }

  const current = getMemberLevelInCategory(userData, category);
  const currentIdx = current ? BADGE_LEVELS.indexOf(current) : -1;
  const requiredIdx = BADGE_LEVELS.indexOf(required);
  const eligible = currentIdx >= requiredIdx;

  const categoryLabel = {
    'development': 'Development', 'quality-assurance': 'Quality Assurance',
    'mentorship': 'Mentorship', 'leadership': 'Leadership',
    'design': 'Design / Architecture', 'security': 'Security',
  }[category] || category;

  return {
    eligible,
    required,
    current,
    category,
    reason: eligible
      ? null
      : `Requires a ${required}+ ${categoryLabel} badge. ${current ? `You currently hold ${current}.` : 'You have not earned one yet.'} Complete more ${categoryLabel} roles on lower-level projects to unlock this.`,
  };
};

// Async convenience: load the member's user doc by uid, then check one role.
export const checkRoleEligibilityForUser = async (uid, role) => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    const userData = snap.exists() ? snap.data() : null;
    return checkRoleEligibility(userData, role);
  } catch (e) {
    // On read failure, fail OPEN for open roles but CLOSED for gated roles,
    // so enforcement is never silently bypassed.
    const level = (role?.experienceLevel || 'any-level').toLowerCase();
    const required = ROLE_REQUIREMENT[level] ?? null;
    if (!required) return { eligible: true, required: null, current: null, category: mapRoleToCategory(role?.role), reason: null };
    return { eligible: false, required, current: null, category: mapRoleToCategory(role?.role), reason: 'Could not verify your badge level. Please try again.' };
  }
};
