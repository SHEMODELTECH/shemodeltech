// src/utils/projectRoles.js
// Canonical role options shared by the project CREATE page (ProjectSubmission)
// and the project EDIT page (ProjectSetup) so the two never drift apart.
//
// The first six mirror the six badge tracks - the platform's key roles -
// so posted roles line up with the paths talent actually train on. The remaining
// entries are common supporting roles. On both pages a project owner who doesn't
// find a fitting role can pick "Other (type your own)" (the '__other__' value) and
// write their own.
export const ROLE_TEMPLATES = [
  // Six key She Model Tech roles (match the six badge tracks)
  'Coding Developer',
  'Low/No-Code Developer',
  'Quality Tester',
  'Network & Cybersecurity',
  'Product / Project Owner',
  'Non-Technical Role',
  // Additional common roles
  'Designer', 'Data Analyst', 'Content Writer', 'Marketing', 'Mentor',
];

export const EXPERIENCE_LEVELS = ['any-level', 'beginner', 'intermediate', 'advanced'];

// --- Minimum team size: no solo projects ---
// A project is a team effort. The owner counts as one person, so a project needs
// the owner PLUS at least one approved member. Nobody can be the only person on
// a project. This is enforced in three places, all reading the constants below:
//   1. Posting / editing  - the roles must offer at least MIN_MEMBERS enough seats
//      (ProjectSubmission.jsx, ProjectSetup.jsx)
//   2. Review submission  - projectReview.js / ProjectCompletion.jsx
//   3. Completion         - ProjectCompletion.jsx
export const MIN_TEAM_SIZE = 2;

// How many approved members are needed on top of the owner.
export const MIN_MEMBERS = MIN_TEAM_SIZE - 1;

// Total seats a set of team roles offers (owner not included).
export const countRoleSeats = (roles = []) =>
  roles.reduce((sum, r) => sum + (parseInt(r.count, 10) || 0), 0);

// Do these roles offer enough seats to reach the minimum team size?
export const rolesMeetMinTeamSize = (roles = []) => countRoleSeats(roles) >= MIN_MEMBERS;

// Does this many approved members reach the minimum team size (owner + members)?
export const membersMeetMinTeamSize = (memberCount = 0) => (memberCount || 0) >= MIN_MEMBERS;

// Shared copy so every surface explains the rule the same way.
export const MIN_TEAM_SIZE_ROLES_ERROR =
  `A project is a team effort - you can't be the only one on it. Your roles must add up to at least ${MIN_MEMBERS} ${MIN_MEMBERS === 1 ? 'person' : 'people'} besides you.`;

export const MIN_TEAM_SIZE_MEMBERS_ERROR =
  `A project needs a team of at least ${MIN_TEAM_SIZE} - you plus ${MIN_MEMBERS} approved ${MIN_MEMBERS === 1 ? 'member' : 'members'}. Approve someone onto the team first.`;
