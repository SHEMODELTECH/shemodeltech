// src/utils/mentorStats.js
// Public numbers about mentors' courses in Learning: how many learners
// completed each course (from issued certificates) and learner ratings.
// Everything read here is public, so it works for any visitor.

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { PUBLISHED_PREFIX, listPublished } from './learningPublished';

const feedbackKey = (track, slug) => `${track}__${slug}`.replace(/[^A-Za-z0-9_-]/g, '-');

// Completions and ratings for one published course.
export const courseStats = async (track, slug) => {
  const [certs, ratings] = await Promise.all([
    getDocs(query(collection(db, 'learning_certificates'), where('slug', '==', slug))).catch(() => null),
    getDocs(collection(db, 'course_feedback', feedbackKey(track, slug), 'ratings')).catch(() => null),
  ]);
  const stars = ratings ? ratings.docs.map((d) => d.data().stars || 0) : [];
  return {
    completions: certs ? certs.size : 0,
    ratingCount: stars.length,
    ratingSum: stars.reduce((a, b) => a + b, 0),
  };
};

// All published mentor courses with their stats, grouped by mentor uid:
// { [uid]: { courses: [{ slug, track, title, teacherId, completions, ratingCount, ratingSum }],
//            completions, ratingCount, ratingSum, avg } }
export const mentorStatsByUid = async () => {
  const published = await listPublished();
  const rows = await Promise.all(
    published
      .filter((p) => p.authorUid)
      .map(async (p) => {
        const slug = `${PUBLISHED_PREFIX}${p.id}`;
        const st = await courseStats(p.track, slug);
        return { uid: p.authorUid, slug, track: p.track, title: p.title, teacherId: p.sourceTeacherId, ...st };
      })
  );
  const out = {};
  rows.forEach((r) => {
    const m = out[r.uid] || (out[r.uid] = { courses: [], completions: 0, ratingCount: 0, ratingSum: 0, avg: 0 });
    m.courses.push(r);
    m.completions += r.completions;
    m.ratingCount += r.ratingCount;
    m.ratingSum += r.ratingSum;
  });
  Object.values(out).forEach((m) => {
    m.avg = m.ratingCount ? m.ratingSum / m.ratingCount : 0;
  });
  return out;
};
