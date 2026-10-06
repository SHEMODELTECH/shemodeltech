// src/config/adminSections.js
// Admin sections, in menu order: [key, label, who sees it].
export const ADMIN_SECTIONS = [
  ['overview', 'Overview', 'all'],
  ['users', 'Users', 'all'],
  ['teachers', 'Mentors', 'reviewer'],
  ['summit', 'Summit', 'reviewer'],
  ['team', 'Team', 'admin'],
  ['announcements', 'Send an announcement', 'admin'],
  ['feedback', 'Member feedback', 'admin'],
  ['sponsors', 'Sponsors', 'admin'],
  ['launch', 'Settings', 'admin'],
  ['moderation', 'Moderation', 'all'],
  ['deletions', 'Deletion Requests', 'admin'],
  ['danger', 'Danger Zone', 'admin'],
];
