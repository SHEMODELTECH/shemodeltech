// src/utils/foundationsCourses.js
// The Foundations course library. Courses are authored as markdown under
// src/Pages/courses/<Track>/*.md and pulled in at build time by
// scripts/generateCourses.js (which writes foundationsCoursesData.js).
//
// This replaces the old foundationsContent.js (short external checklists) and
// foundationsLessons.js (short on-platform lessons). Foundations is now a growing
// library of practical, project-based courses that take a newcomer from zero to a
// portfolio piece. To add a course, drop a new .md into the right track folder and
// rebuild - nothing here needs editing.

import { COURSES_BY_TRACK } from './foundationsCoursesData';

// Display name + one-line intro per track. Kept here (not derived from a course file)
// so a track can show a heading even before its first course lands. Company is a
// special, non-skill track: a short guide on reading badges.
const TRACK_META = {
  TechDev:   { label: 'Coding Developer Foundations',        intro: 'Build real, shippable software project by project, learning each idea at the moment you use it.' },
  TechArchs: { label: 'Low/No-Code Developer Foundations',   intro: 'Ship working products on no-code and low-code platforms, one hands-on build at a time.' },
  TechQA:    { label: 'Quality Tester Foundations',          intro: 'Learn to find, report, and prevent bugs by testing real software, manually and with automation.' },
  TechGuard: { label: 'Network & Cybersecurity Foundations', intro: 'Defend and run real systems: security, networking, cloud, and DevOps, built up through practical projects.' },
  TechPO:    { label: 'Product / Project Owner Foundations', intro: 'Own product vision and delivery: turn ideas into backlogs, requirements, and shipped outcomes.' },
  TechLeads: { label: 'Non-Technical Roles Foundations',     intro: 'Lead and support tech teams without coding: delivery, writing, research, and communication.' },
  company:   { label: 'Understanding Badges',                intro: 'A short guide for companies: how members prove their skills here, so you can read profiles and hire with confidence.' },
};

export const trackMeta = (trackId) => TRACK_META[trackId] || { label: trackId, intro: '' };

// All courses for a track, in authored order (already sorted by the generator).
export const coursesForTrack = (trackId) => (trackId && COURSES_BY_TRACK[trackId]) || [];

// A single course by its slug (filename without .md).
export const getCourse = (trackId, slug) =>
  coursesForTrack(trackId).find((c) => c.slug === slug) || null;

// Every track that currently has at least one course. Used for admin review and as a
// browse fallback when a user's own track has no courses yet.
export const tracksWithCourses = () =>
  Object.keys(COURSES_BY_TRACK).filter((k) => (COURSES_BY_TRACK[k] || []).length > 0);

export const trackHasCourses = (trackId) => coursesForTrack(trackId).length > 0;
