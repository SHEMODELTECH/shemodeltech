// src/utils/companyPaths.js
// Company accounts don't run projects or take courses. They can still open a
// project's details (from the Proof Wall) to read about it and see the team.
const BLOCKED_PREFIXES = [
  '/projects/owner-dashboard', '/projects/my-projects', '/projects/propose',
  '/projects/new-paid', '/projects/sponsor-cohort', '/project-vault', '/disputes',
  '/my-workspaces', '/learning', '/teacher',
];
export const isBlockedForCompany = (path) => {
  if (path === '/projects') return true;
  if (BLOCKED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) return true;
  // A project's own pages other than its details: workspace, setup, completion.
  return /^\/projects\/[^/]+\/(workspace|setup|complete|completion|edit)/.test(path);
};
