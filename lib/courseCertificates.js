// lib/courseCertificates.js
// Issues course certificates on the server, after checking the learner really
// finished the course. (The website can't create course certificates itself:
// see learning_certificates in firestore.rules.)
//
// A certificate needs:
//   - a summary of at least 30 words for every module (one course summary for
//     interactive and mentor HTML courses)
//   - every quiz passed with 70% or more (recorded per module)
//   - a reply to another learner in the course forum, once at least one other
//     learner has posted there
//   - the learner's name on her account (certificates never show an email)
// The Start Here course has no certificate.
//
// POST /api/notifications/issue-certificate  { track, slug }  ->  { id }
const admin = require('./firebaseAdmin');
const manifest = require('./courseManifest.json');
const { courseRequirements, certificateCode, certificateId } = require('./courseRequirements');

const SUMMARY_MIN_WORDS = 30;
const PUBLISHED_PREFIX = 'p-';
const TRACK_LABELS = {
  TechDev: 'Coding Developer', TechArchs: 'Low/No-Code Developer', TechQA: 'Quality Tester',
  TechGuard: 'Network & Cybersecurity', TechPO: 'Product / Project Owner', TechLeads: 'Non-Technical Roles',
};
const words = (t) => (String(t || '').trim().match(/\S+/g) || []).length;
const courseKey = (track, slug) => `${track}__${slug}`.replace(/[^A-Za-z0-9_-]/g, '-');

const readChunks = async (ref, n) => {
  const snaps = await Promise.all(Array.from({ length: n || 0 }, (_, i) => ref.collection('chunks').doc(String(i)).get()));
  return snaps.map((s) => (s.exists ? s.data().data || '' : '')).join('');
};

// The course and what it requires, or null if there's no such course.
const loadCourse = async (db, track, slug) => {
  if (slug.startsWith(PUBLISHED_PREFIX)) {
    const ref = db.collection('learning_courses').doc(slug.slice(PUBLISHED_PREFIX.length));
    const snap = await ref.get();
    if (!snap.exists) return null;
    const p = snap.data();
    if (p.track !== track) return null;
    const base = { title: p.title, level: p.level || '', minutes: p.minutes || 0, trackLabel: TRACK_LABELS[track] || track };
    if (p.kind === 'html') return { ...base, courseSummary: true, modules: 0, quizParts: 0 };
    const req = courseRequirements(await readChunks(ref, p.chunkCount));
    return { ...base, courseSummary: false, ...req };
  }
  const m = manifest[`${track}/${slug}`];
  if (!m) return null;
  let course = { ...m, courseSummary: m.kind === 'interactive' };
  // Staff may have edited or hidden a built-in course.
  const ov = await db.collection('course_overrides').doc(`${track}__${slug}`).get();
  if (ov.exists) {
    const o = ov.data();
    if (o.hidden) return null;
    course = { ...course, title: o.title || course.title, level: o.level || course.level, minutes: o.minutes || course.minutes };
    if (o.hasContent && !course.courseSummary) {
      course = { ...course, ...courseRequirements(await readChunks(ov.ref, o.chunkCount)) };
    }
  }
  return course;
};

// Has she replied to another learner, when others have posted in the forum?
const forumDone = async (db, track, slug, uid) => {
  const threads = await db.collection('course_forum').doc(courseKey(track, slug)).collection('threads').limit(100).get();
  const others = threads.docs.filter((d) => d.data().uid !== uid);
  if (!others.length) return true;
  for (const t of others.slice(0, 50)) {
    // eslint-disable-next-line no-await-in-loop
    const r = await t.ref.collection('replies').where('uid', '==', uid).limit(1).get();
    if (!r.empty) return true;
  }
  return false;
};

async function issueCourseCertificate(req, res, user) {
  const { track, slug } = req.body || {};
  if (typeof track !== 'string' || typeof slug !== 'string' || !track || !slug || slug.length > 200) {
    return res.status(400).json({ error: 'Missing course.' });
  }
  if (track === 'start') return res.status(400).json({ error: 'The Start Here course has no certificate.' });
  const db = admin.firestore();
  const uid = user.uid;
  const id = certificateId(uid, track, slug);
  const certRef = db.collection('learning_certificates').doc(id);

  // Already issued: return it (and tidy older ones: no email, add the code).
  const existing = await certRef.get();
  if (existing.exists) {
    const d = existing.data();
    if ('email' in d || !d.code) {
      await certRef.update({ email: admin.firestore.FieldValue.delete(), code: certificateCode(id) }).catch(() => {});
    }
    return res.status(200).json({ id });
  }

  const course = await loadCourse(db, track, slug);
  if (!course) return res.status(404).json({ error: 'Course not found.' });

  const userSnap = await db.collection('users').doc(uid).get();
  const profile = userSnap.exists ? userSnap.data() : {};
  const name = String(profile.displayName || '').trim();

  const missing = [];
  if (!name || name.includes('@')) missing.push('Add your full name in Settings (it appears on your certificate).');

  const progress = await db.collection('users').doc(uid).collection('learning_progress').doc(slug.replace(/[/]/g, '_')).get();
  const summaries = (progress.exists && progress.data().summaries) || {};
  if (course.courseSummary) {
    if (words(summaries.course?.text) < SUMMARY_MIN_WORDS) missing.push('Write your course summary (at least 30 words).');
  } else {
    const done = Object.entries(summaries).filter(([k, v]) => k !== 'overview' && k !== 'course' && words(v?.text) >= SUMMARY_MIN_WORDS).length;
    if (done < course.modules) missing.push(`Summarize every module (${done} of ${course.modules} done).`);
  }

  if (course.quizParts > 0) {
    const passed = Object.keys(((profile.learningQuizPassed || {})[track] || {})[slug] || {}).length;
    if (passed < course.quizParts) missing.push(`Pass every quiz with 70% or more (${passed} of ${course.quizParts} modules passed).`);
  }

  if (!(await forumDone(db, track, slug, uid))) missing.push('Reply to another learner in the course forum.');

  if (missing.length) return res.status(400).json({ error: 'Not finished yet.', missing });

  const data = {
    uid,
    name,
    courseTitle: course.title,
    track,
    trackLabel: course.trackLabel || '',
    slug,
    level: course.level || '',
    minutes: course.minutes || 0,
    code: certificateCode(id),
    completedOn: new Date().toISOString().slice(0, 10),
    issuedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  await certRef.set(data);
  return res.status(200).json({ id });
}

module.exports = { issueCourseCertificate };
