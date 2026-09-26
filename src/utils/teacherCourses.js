// src/utils/teacherCourses.js
//
// Teacher courses: teaching notes and instructor editions for admins and
// editors only. They live in their own collection (teacher_courses) and never
// appear in She Model Tech Learning, which is built from src/Pages/courses.
//
//   teacher_courses/{id}            title, description, kind, track, status,
//                                   sizeBytes, chunkCount, fileName,
//                                   createdAt/By, updatedAt/By
//   teacher_courses/{id}/chunks/{n} { data }   the content, split into pieces
//
// Content is split into chunks because a single Firestore document is capped
// at about 1 MB. Firestore rules restrict every read and write to admins and
// editors (deleting a whole course is admin-only).
//
// kind: 'html'      an uploaded, self-contained HTML course (shown in a
//                   sandboxed frame, so its scripts can't touch the app)
//       'markdown'  notes written on the page, rendered like Learning courses

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COL = 'teacher_courses';
const CHUNK_CHARS = 300000; // well under 1 MB even for multi-byte text
export const MAX_BYTES = 5 * 1024 * 1024;

export const byteSize = (text) => new Blob([text || '']).size;

const who = (user) => ({
  uid: user.uid,
  email: user.email || '',
  name: user.displayName || user.email || '',
});

export const listTeacherCourses = async () => {
  const snap = await getDocs(query(collection(db, COL), orderBy('updatedAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getTeacherCourse = async (id) => {
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getTeacherContent = async (id, chunkCount) => {
  const parts = await Promise.all(
    Array.from({ length: chunkCount || 0 }, (_, i) => getDoc(doc(db, COL, id, 'chunks', String(i))))
  );
  return parts.map((p) => (p.exists() ? p.data().data || '' : '')).join('');
};

/**
 * Create or update a teacher course. Pass `content` to replace the content;
 * leave it undefined to change only the details (title, status...).
 * Returns the course id.
 */
export const saveTeacherCourse = async ({ id, meta, content, previousChunkCount = 0 }, user) => {
  const ref = id ? doc(db, COL, id) : doc(collection(db, COL));
  const batch = writeBatch(db);
  const base = {
    title: (meta.title || '').trim(),
    description: (meta.description || '').trim(),
    kind: meta.kind,
    track: meta.track || '',
    status: meta.status || 'draft',
    updatedAt: serverTimestamp(),
    updatedBy: who(user),
  };
  if (!id) {
    base.createdAt = serverTimestamp();
    base.createdBy = who(user);
  }
  if (content !== undefined) {
    const size = byteSize(content);
    if (size > MAX_BYTES) throw new Error('This file is larger than 5 MB.');
    const chunks = [];
    for (let i = 0; i < content.length; i += CHUNK_CHARS) chunks.push(content.slice(i, i + CHUNK_CHARS));
    if (!chunks.length) chunks.push('');
    chunks.forEach((data, i) => batch.set(doc(db, COL, ref.id, 'chunks', String(i)), { data }));
    for (let i = chunks.length; i < previousChunkCount; i++) batch.delete(doc(db, COL, ref.id, 'chunks', String(i)));
    base.chunkCount = chunks.length;
    base.sizeBytes = size;
    if (meta.fileName !== undefined) base.fileName = meta.fileName || '';
  }
  batch.set(ref, base, { merge: true });
  await batch.commit();
  return ref.id;
};

export const deleteTeacherCourse = async (course) => {
  const batch = writeBatch(db);
  for (let i = 0; i < (course.chunkCount || 0); i++) batch.delete(doc(db, COL, course.id, 'chunks', String(i)));
  batch.delete(doc(db, COL, course.id));
  await batch.commit();
};

// A title for an uploaded HTML file: its <title>, else the file name.
export const titleFromHtml = (html, fileName = '') => {
  const t = (html.match(/<title>([^<]*)<\/title>/i) || [])[1];
  return (t || fileName.replace(/\.html?$/i, '').replace(/[-_]+/g, ' ')).trim();
};

// ---- Video courses ----
// A video course is stored as JSON ({ lessons: [{ title, url, notes }] }) so it
// stays easy to edit, and shown as Markdown: one part per lesson, each with its
// video and notes, so it gets the same reader, progress, and full screen as
// every other course.
export const parseLessons = (content) => {
  try {
    const data = JSON.parse(content || '{}');
    return Array.isArray(data.lessons) ? data.lessons : [];
  } catch (_) {
    return [];
  }
};

export const lessonsToMarkdown = (lessons) =>
  lessons
    .filter((l) => (l.url || '').trim() || (l.notes || '').trim())
    .map((l, i) => {
      const title = (l.title || '').trim() || `Lesson ${i + 1}`;
      const video = (l.url || '').trim() ? `\`\`\`video\n${l.url.trim()}\n${title}\n\`\`\`\n\n` : '';
      return `## ${i + 1}. ${title}\n\n${video}${(l.notes || '').trim()}\n`;
    })
    .join('\n');

// What the reader shows for any teacher course kind.
export const displayMarkdown = (kind, content) => (kind === 'video' ? lessonsToMarkdown(parseLessons(content)) : content);

// ---- Review: teacher courses for students need admin approval ----
// review.status: 'pending'   submitted, waiting for an admin (teacher can edit or withdraw)
//                'declined'  not approved; the note says why (teacher can edit and resubmit)
//                'withdrawn' pulled back by the teacher (can resubmit)
//                'approved'  published to Learning by an admin
// Older courses may carry publishRequested instead; treat it as pending.
export const reviewStatus = (c) => c?.review?.status || (c?.publishRequested ? 'pending' : null);

const notifyUser = (userId, title, body, link) =>
  addDoc(collection(db, 'notifications'), {
    userId,
    recipientId: userId,
    type: 'teacher_course_review',
    title,
    body,
    message: `${title} - ${body}`,
    link,
    isRead: false,
    read: false,
    createdAt: serverTimestamp(),
  }).catch(() => {});

export const submitForReview = async (course, user, details) => {
  await updateDoc(doc(db, COL, course.id), {
    review: {
      status: 'pending',
      submittedAt: new Date().toISOString(),
      submittedBy: who(user),
      level: details.level || 'Beginner',
      minutes: details.minutes || '',
      track: details.track || '',
      isUpdate: !!course.published,
      note: null,
    },
    publishRequested: null,
  });
  // Let admins know there's something to review.
  try {
    const admins = await getDocs(query(collection(db, 'users'), where('role', '==', 'admin')));
    await Promise.all(
      admins.docs.map((a) =>
        notifyUser(
          a.id,
          course.published ? 'A mentor updated a published course' : 'A mentor course is waiting for approval',
          `${user.displayName || user.email}: "${course.title}"`,
          `/teacher/${course.id}`
        )
      )
    );
  } catch (_) {
    /* notifications are best-effort */
  }
};

export const withdrawSubmission = async (course, user) => {
  await updateDoc(doc(db, COL, course.id), {
    review: { ...(course.review || {}), status: 'withdrawn', withdrawnAt: new Date().toISOString(), withdrawnBy: who(user) },
    publishRequested: null,
  });
};

export const declineSubmission = async (course, admin, note) => {
  await updateDoc(doc(db, COL, course.id), {
    review: { ...(course.review || {}), status: 'declined', decidedAt: new Date().toISOString(), decidedBy: who(admin), note: (note || '').trim() || null },
    publishRequested: null,
  });
  const to = course.review?.submittedBy?.uid || course.createdBy?.uid;
  if (to) {
    await notifyUser(
      to,
      'Your course was not approved yet',
      (note || '').trim() || `"${course.title}" needs changes before it can be published. Edit it and resubmit.`,
      `/teacher/${course.id}`
    );
  }
};

export const markApproved = async (course, admin) => {
  await updateDoc(doc(db, COL, course.id), {
    review: { ...(course.review || {}), status: 'approved', decidedAt: new Date().toISOString(), decidedBy: who(admin), note: null },
    publishRequested: null,
  });
  const to = course.review?.submittedBy?.uid || course.createdBy?.uid;
  if (to && to !== admin.uid) {
    await notifyUser(to, 'Your course is published', `"${course.title}" is now live for learners in Learning.`, `/teacher/${course.id}`);
    // Mentor badge: counts approved courses (an approved update doesn't count again).
    if (!course.review?.isUpdate && !course.mentorBadgeCounted) {
      try {
        const u = await getDoc(doc(db, 'users', to));
        const prev = u.exists() ? u.data().mentorApprovedCourses || 0 : 0;
        await updateDoc(doc(db, 'users', to), {
          mentorApprovedCourses: prev + 1,
          mentorBadgeSince: u.data()?.mentorBadgeSince || new Date().toISOString(),
        });
        await updateDoc(doc(db, COL, course.id), { mentorBadgeCounted: true });
        const level = prev + 1 >= 10 ? 'Lead Mentor' : prev + 1 >= 3 ? 'Senior Mentor' : 'Mentor';
        const levelUp = prev === 0 || prev + 1 === 3 || prev + 1 === 10;
        if (levelUp) {
          await notifyUser(to, `You earned the ${level} badge`, 'It now shows on your profile and on your courses in Learning.', course.review?.submittedBy?.email ? `/profile/${course.review.submittedBy.email}` : '/learning');
        }
      } catch (e) {
        console.error('mentor badge', e);
      }
    }
  }
};
