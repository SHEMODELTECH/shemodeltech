// src/utils/roleEligibility.js
// Who can apply to a role.
//
// Every role is open to every member: the level on a role (beginner, any level,
// intermediate, advanced) is a GUIDE, not a lock, so members can challenge
// themselves. Beginner and Any Level show "Good for beginners"; Intermediate and
// Advanced show "Stretch role, best with some experience".
//
// Other rules stay where they are: 18+ for paid projects, at least one earned
// badge for paid company projects, and a complete profile.

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { roleTrack } from '../config/badgeTracks';

export const BADGE_LEVELS = ['Novice', 'Associate', 'Advanced', 'Expert'];
export const ROLE_LEVELS = ['beginner', 'intermediate', 'advanced'];

// The badge track a role counts toward (set on the role, or matched from its name).
export const mapRoleToCategory = (role) => roleTrack(typeof role === 'string' ? { role } : role);

// Highest badge level a member holds in a track (for display only).
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

// Always eligible; returns the role's track and the member's current level there.
export const checkRoleEligibility = (userData, role) => {
  const category = mapRoleToCategory(role || {});
  return { eligible: true, required: null, current: getMemberLevelInCategory(userData, category), category, reason: null };
};

export const checkRoleEligibilityForUser = async (uid, role) => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return checkRoleEligibility(snap.exists() ? snap.data() : null, role);
  } catch (e) {
    return checkRoleEligibility(null, role);
  }
};
