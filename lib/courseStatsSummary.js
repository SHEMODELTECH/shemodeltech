// lib/courseStatsSummary.js
// Daily: count learners enrolled, courses completed and star ratings for every
// Learning course, and save them in public_stats/courses for the catalog to
// read in one go (src/utils/courseStats.js). Admin → Course feedback refreshes
// the same document whenever staff open it.
const manifest = require('./courseManifest.json');

const keyOf = (track, slug) => `${track}__${slug}`.replace(/[^A-Za-z0-9_-]/g, '-');

const refreshCourseStats = async (db, admin, deadline) => {
  const courses = Object.keys(manifest).map((k) => {
    const i = k.indexOf('/');
    return { track: k.slice(0, i), slug: k.slice(i + 1) };
  });
  const pub = await db.collection('learning_courses').get().catch(() => null);
  if (pub) pub.docs.forEach((d) => { if (d.data().track) courses.push({ track: d.data().track, slug: `p-${d.id}` }); });

  const summary = {};
  const one = async ({ track, slug }) => {
    const key = keyOf(track, slug);
    const [en, done, ratings] = await Promise.all([
      db.collection('course_enrollments').doc(key).collection('learners').count().get(),
      db.collection('learning_certificates').where('slug', '==', slug).count().get(),
      db.collection('course_feedback').doc(key).collection('ratings').select('stars').get(),
    ]);
    const enrolled = en.data().count || 0;
    const stars = ratings.docs.map((d) => Number(d.get('stars')) || 0).filter((n) => n > 0);
    if (!enrolled && !stars.length) return;
    summary[key] = {
      enrolled,
      completed: done.data().count || 0,
      ratingCount: stars.length,
      ratingAvg: stars.length ? Math.round((stars.reduce((a, b) => a + b, 0) / stars.length) * 100) / 100 : 0,
    };
  };
  for (let i = 0; i < courses.length; i += 8) {
    if (Date.now() > deadline) return { skipped: true };
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(courses.slice(i, i + 8).map((c) => one(c).catch(() => {})));
  }
  await db.collection('public_stats').doc('courses').set({
    courses: summary,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { courses: Object.keys(summary).length };
};

module.exports = { refreshCourseStats };
