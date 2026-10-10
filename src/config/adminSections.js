// src/config/adminSections.js
// Admin sections, in menu order: [key, label, who sees it, group, moved?].
// `moved`: the section now lives on its own page (Learning or Events → Manage),
// so the Admin menu leaves it out; the label is still used for the page title.
// The side menu shows them under small group headings (ADMIN_GROUPS).
export const ADMIN_GROUPS = ['People', 'Content', 'Business', 'System'];

export const ADMIN_SECTIONS = [
  ['overview', 'Overview', 'all', null],
  // People
  ['users', 'Users', 'all', 'People'],
  ['learners', 'Learners', 'all', 'People', true],
  ['teachers', 'Mentors', 'reviewer', 'People', true],
  ['team', 'Team', 'admin', 'People'],
  ['deletions', 'Deletion Requests', 'admin', 'People'],
  // Content
  ['proofwall', 'Proof Wall', 'admin', 'Content'],
  ['moderation', 'Reports', 'all', 'Content'],
  ['coursefeedback', 'Course feedback', 'all', 'Content', true],
  ['events', 'Events', 'reviewer', 'Content', true],
  ['announcements', 'Send an announcement', 'admin', 'Content'],
  // Business
  ['sponsors', 'Sponsors', 'admin', 'Business'],
  ['feedback', 'Member feedback', 'admin', 'Business'],
  // System
  ['launch', 'Settings', 'admin', 'System'],
  ['danger', 'Danger Zone', 'admin', 'System'],
];
