// src/config/adminSections.js
// Admin sections, in menu order: [key, label, who sees it, group].
// The side menu shows them under small group headings (ADMIN_GROUPS).
export const ADMIN_GROUPS = ['People', 'Content', 'Business', 'System'];

export const ADMIN_SECTIONS = [
  ['overview', 'Overview', 'all', null],
  // People
  ['users', 'Users', 'all', 'People'],
  ['learners', 'Learners', 'all', 'People'],
  ['teachers', 'Mentors', 'reviewer', 'People'],
  ['team', 'Team', 'admin', 'People'],
  ['deletions', 'Deletion Requests', 'admin', 'People'],
  // Content
  ['proofwall', 'Proof Wall', 'admin', 'Content'],
  ['moderation', 'Reports', 'all', 'Content'],
  ['coursefeedback', 'Course feedback', 'all', 'Content'],
  ['events', 'Events', 'reviewer', 'Content'],
  ['announcements', 'Send an announcement', 'admin', 'Content'],
  // Business
  ['sponsors', 'Sponsors', 'admin', 'Business'],
  ['feedback', 'Member feedback', 'admin', 'Business'],
  // System
  ['launch', 'Settings', 'admin', 'System'],
  ['danger', 'Danger Zone', 'admin', 'System'],
];
