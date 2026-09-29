// src/utils/courseOverrides.js
// Staff (admins and editors) can edit or remove the built-in She Model Tech
// courses without a code change. Changes live in Firestore and are applied on
// top of the built-in course data:
//
//   course_overrides/{track__slug}: track, slug, hidden, title, summary, level,
//     minutes, hasContent, chunkCount, updatedAt, updatedBy
//   course_overrides/{track__slug}/chunks/{n}: { data }   (edited course text)
//
// New courses are added through the Mentor Hub (staff can publish directly).

import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';

const COL = 'course_overrides';
const CHUNK = 200000;
export const overrideId = (track, slug) => `${track}__${slug}`;

// In-memory cache, kept live, so course lists can apply it synchronously.
let cache = {};
let version = 0;
const listeners = new Set();
let started = false;
export const startCourseOverrides = () => {
  if (started) return;
  started = true;
  onSnapshot(
    collection(db, COL),
    (snap) => {
      const next = {};
      snap.docs.forEach((d) => { next[d.id] = d.data(); });
      cache = next;
      version += 1;
      listeners.forEach((fn) => fn(version));
    },
    () => {}
  );
};
export const subscribeOverrides = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const getOverride = (track, slug) => cache[overrideId(track, slug)] || null;
export const hiddenCourses = () => Object.values(cache).filter((o) => o.hidden);

// Apply edits (title, summary, level, minutes) and hide removed courses.
export const applyOverrides = (track, courses) =>
  courses
    .filter((c) => !getOverride(track, c.slug)?.hidden)
    .map((c) => {
      const o = getOverride(track, c.slug);
      if (!o) return c;
      return {
        ...c,
        ...(o.title ? { title: o.title } : {}),
        ...(o.summary ? { summary: o.summary } : {}),
        ...(o.level ? { level: o.level } : {}),
        ...(o.minutes ? { minutes: Number(o.minutes) } : {}),
        editedByStaff: true,
        overrideHasContent: !!o.hasContent,
      };
    });

export const getOverrideContent = async (track, slug) => {
  const id = overrideId(track, slug);
  const meta = await getDoc(doc(db, COL, id));
  if (!meta.exists() || !meta.data().hasContent) return null;
  const n = meta.data().chunkCount || 0;
  const parts = await Promise.all(Array.from({ length: n }, (_, i) => getDoc(doc(db, COL, id, 'chunks', String(i)))));
  return parts.map((p) => (p.exists() ? p.data().data || '' : '')).join('');
};

const who = (u) => ({ uid: u?.uid || null, name: u?.displayName || u?.email || '' });

export const saveCourseEdit = async (track, slug, { title, summary, level, minutes, markdown, originalMarkdown }, user) => {
  const id = overrideId(track, slug);
  const prev = (await getDoc(doc(db, COL, id))).data() || {};
  const batch = writeBatch(db);
  const contentChanged = typeof markdown === 'string' && markdown !== originalMarkdown;
  let chunkCount = 0;
  if (contentChanged) {
    const chunks = [];
    for (let i = 0; i < markdown.length; i += CHUNK) chunks.push(markdown.slice(i, i + CHUNK));
    if (!chunks.length) chunks.push('');
    chunks.forEach((data, i) => batch.set(doc(db, COL, id, 'chunks', String(i)), { data }));
    chunkCount = chunks.length;
  }
  for (let i = contentChanged ? chunkCount : 0; i < (prev.chunkCount || 0); i++) {
    if (!contentChanged) break;
    batch.delete(doc(db, COL, id, 'chunks', String(i)));
  }
  batch.set(doc(db, COL, id), {
    track,
    slug,
    hidden: !!prev.hidden,
    title: (title || '').trim(),
    summary: (summary || '').trim(),
    level: level || '',
    minutes: Number(minutes) || 0,
    hasContent: contentChanged ? true : !!prev.hasContent,
    chunkCount: contentChanged ? chunkCount : prev.chunkCount || 0,
    updatedAt: serverTimestamp(),
    updatedBy: who(user),
  }, { merge: true });
  await batch.commit();
};

export const setCourseHidden = async (track, slug, hidden, user, title = '') => {
  await setDoc(doc(db, COL, overrideId(track, slug)), {
    track, slug, hidden, ...(title ? { hiddenTitle: title } : {}), updatedAt: serverTimestamp(), updatedBy: who(user),
  }, { merge: true });
};

// Undo every edit and bring the original course back.
export const resetCourse = async (track, slug) => {
  const id = overrideId(track, slug);
  const prev = (await getDoc(doc(db, COL, id))).data() || {};
  const batch = writeBatch(db);
  for (let i = 0; i < (prev.chunkCount || 0); i++) batch.delete(doc(db, COL, id, 'chunks', String(i)));
  batch.delete(doc(db, COL, id));
  await batch.commit();
};

export const listOverrides = async () => {
  const s = await getDocs(collection(db, COL));
  return s.docs.map((d) => ({ id: d.id, ...d.data() }));
};
export { deleteDoc };
