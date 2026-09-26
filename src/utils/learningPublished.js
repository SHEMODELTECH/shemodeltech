// src/utils/learningPublished.js
//
// Courses published to Learning from the Teacher area. Learning's built-in
// courses come from files in the code; these come from the database, so staff
// can publish without a code change.
//
//   learning_courses/{id}             title, summary, track, level, minutes, kind,
//                                     parts, chunkCount, sourceTeacherId,
//                                     publishedAt/By, updatedAt/By
//   learning_courses/{id}/chunks/{n}  { data }   the course content
//
// Publishing COPIES the teacher material, so later edits in Teacher don't reach
// students until someone presses "Update the published version".
// Anyone may read (like the rest of the catalog); only admins and editors may
// publish, update, or unpublish (see firestore.rules).

import { lessonsToMarkdown, parseLessons } from './teacherCourses';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COL = 'learning_courses';
const CHUNK_CHARS = 300000;
export const PUBLISHED_PREFIX = 'p-';

const who = (user) => ({ uid: user.uid, email: user.email || '', name: user.displayName || user.email || '' });

// Rough time to complete for written notes, the same way built-in courses are
// estimated: reading at ~200 words a minute plus ~30 minutes per hands-on section.
export const estimateMinutes = (markdown) => {
  const words = (markdown || '').split(/\s+/).filter(Boolean).length;
  const sections = (markdown || '').split(/^##\s+/m).slice(1);
  const practical = sections.filter((s) => /(\bLab\b|\*\*Step \d|Practical exercise|Hands-on)/i.test(s)).length;
  return Math.max(10, Math.round((words / 200 + practical * 30) / 15) * 15);
};

export const listPublished = async () => {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getPublished = async (id) => {
  const s = await getDoc(doc(db, COL, id));
  return s.exists() ? { id: s.id, ...s.data() } : null;
};

export const getPublishedContent = async (id, chunkCount) => {
  const parts = await Promise.all(
    Array.from({ length: chunkCount || 0 }, (_, i) => getDoc(doc(db, COL, id, 'chunks', String(i))))
  );
  return parts.map((p) => (p.exists() ? p.data().data || '' : '')).join('');
};

// Shape a published course like a built-in one, so the catalog, search, cards,
// and progress tracking treat it the same way.
export const toCatalogCourse = (p) => ({
  slug: `${PUBLISHED_PREFIX}${p.id}`,
  publishedId: p.id,
  track: p.track,
  title: p.title,
  summary: p.summary || '',
  level: p.level || 'Beginner',
  minutes: p.minutes || 0,
  projects: p.parts || 0,
  kind: p.kind === 'html' ? 'published-html' : 'published-markdown',
  format: p.format || p.kind,
  authorUid: p.authorUid || '',
  authorName: p.authorName || '',
  order: p.order ?? 999,
  references: [],
  markdown: '',
});

/**
 * Publish (or update) a teacher course in Learning.
 * `details`: { title, summary, track, level, minutes }
 */
export const publishToLearning = async (teacherCourse, content, details, user) => {
  // Video courses are published as Markdown (one part per lesson).
  const isVideo = teacherCourse.kind === 'video';
  if (isVideo) content = lessonsToMarkdown(parseLessons(content));
  const kind = isVideo ? 'markdown' : teacherCourse.kind;
  const existingId = teacherCourse.published?.learningId;
  const ref = existingId ? doc(db, COL, existingId) : doc(collection(db, COL));
  const prev = existingId ? await getPublished(existingId) : null;
  const batch = writeBatch(db);

  const chunks = [];
  for (let i = 0; i < content.length; i += CHUNK_CHARS) chunks.push(content.slice(i, i + CHUNK_CHARS));
  if (!chunks.length) chunks.push('');
  chunks.forEach((data, i) => batch.set(doc(db, COL, ref.id, 'chunks', String(i)), { data }));
  for (let i = chunks.length; i < (prev?.chunkCount || 0); i++) batch.delete(doc(db, COL, ref.id, 'chunks', String(i)));

  const parts = kind === 'markdown' ? (content.match(/^##\s+/gm) || []).length || 1 : 1;
  batch.set(
    ref,
    {
      title: details.title.trim(),
      summary: (details.summary || '').trim(),
      track: details.track,
      level: details.level || 'Beginner',
      minutes: Number(details.minutes) || (kind === 'markdown' ? estimateMinutes(content) + (isVideo ? parts * 10 : 0) : 60),
      kind,
      format: isVideo ? 'video' : kind,
      parts,
      chunkCount: chunks.length,
      sourceTeacherId: teacherCourse.id,
      // Who wrote it (shown on the course page, with their Mentor badge).
      authorUid: teacherCourse.review?.submittedBy?.uid || teacherCourse.createdBy?.uid || user.uid,
      authorName: teacherCourse.review?.submittedBy?.name || teacherCourse.createdBy?.name || '',
      updatedAt: serverTimestamp(),
      updatedBy: who(user),
      ...(prev ? {} : { publishedAt: serverTimestamp(), publishedBy: who(user) }),
    },
    { merge: true }
  );
  batch.set(
    doc(db, 'teacher_courses', teacherCourse.id),
    {
      published: {
        learningId: ref.id,
        track: details.track,
        at: serverTimestamp(),
        by: who(user),
      },
      publishRequested: null,
    },
    { merge: true }
  );
  await batch.commit();
  return ref.id;
};

export const unpublishFromLearning = async (teacherCourse) => {
  const id = teacherCourse.published?.learningId;
  if (!id) return;
  const prev = await getPublished(id);
  const batch = writeBatch(db);
  for (let i = 0; i < (prev?.chunkCount || 0); i++) batch.delete(doc(db, COL, id, 'chunks', String(i)));
  batch.delete(doc(db, COL, id));
  batch.set(doc(db, 'teacher_courses', teacherCourse.id), { published: null }, { merge: true });
  await batch.commit();
};
