// src/utils/courseStats.js
// Course numbers shown to everyone, and course views for staff.
//
//   public_stats/courses   { updatedAt, courses: { <courseKey>: { enrolled, completed, ratingCount, ratingAvg } } }
//     One small document the catalog reads for every card, instead of counting
//     each course separately. Refreshed by the daily job and whenever staff open
//     Admin → Course feedback.
//   course_views/{courseKey}   { views }   staff only; one per visitor per course per day.
//
// Public numbers (rating, enrolled, completed) only show once a course has at
// least PUBLIC_MIN learners, so a new course never looks empty.
import { doc, getDoc, increment, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { courseKey } from './mentorStats';

export const PUBLIC_MIN = 10;
export const showPublicStats = (s) => !!s && (s.enrolled || 0) >= PUBLIC_MIN;

// The summary for the catalog (read once per visit, kept for 5 minutes).
let cache = null; // { at, promise }
export const getPublicCourseStats = () => {
  if (!cache || Date.now() - cache.at > 5 * 60 * 1000) {
    const promise = getDoc(doc(db, 'public_stats', 'courses'))
      .then((s) => (s.exists() ? s.data().courses || {} : {}))
      .catch(() => ({}));
    cache = { at: Date.now(), promise };
  }
  return cache.promise;
};
export const statsFor = (map, track, slug) => (map || {})[courseKey(track, slug)] || null;

// Staff: save the summary (Admin → Course feedback computes it live).
export const savePublicCourseStats = (courses) =>
  setDoc(doc(db, 'public_stats', 'courses'), { courses, updatedAt: serverTimestamp() });

// Count a view of a course page: once per browser, per course, per day.
const VIEW_KEY = 'smt-course-views-v1';
export const recordCourseView = (track, slug) => {
  const key = courseKey(track, slug);
  const today = new Date().toISOString().slice(0, 10);
  let seen = {};
  try { seen = JSON.parse(localStorage.getItem(VIEW_KEY) || '{}'); } catch (_) { seen = {}; }
  if (seen[key] === today) return;
  Object.keys(seen).forEach((k) => { if (seen[k] !== today) delete seen[k]; });
  seen[key] = today;
  try { localStorage.setItem(VIEW_KEY, JSON.stringify(seen)); } catch (_) { /* private mode */ }
  setDoc(doc(db, 'course_views', key), { views: increment(1) }, { merge: true }).catch(() => {});
};

// "120" / "1.2k"
export const short = (n) => {
  const x = Number(n) || 0;
  if (x < 1000) return String(x);
  return `${(x / 1000).toFixed(x < 10000 ? 1 : 0).replace(/\.0$/, '')}k`;
};
