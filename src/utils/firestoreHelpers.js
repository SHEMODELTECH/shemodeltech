// src/utils/firestoreHelpers.js - Helpers for Firestore operations
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Sanitize email for use as Firestore map key (dots are not allowed in field paths)
export const sanitizeEmailKey = (email) => {
  if (!email) return '';
  return email.replace(/\./g, '_dot_').replace(/@/g, '_at_');
};

// Reverse sanitization to get original email
export const unsanitizeEmailKey = (key) => {
  if (!key) return '';
  return key.replace(/_dot_/g, '.').replace(/_at_/g, '@');
};

// ---------------------------------------------------------------------------
// Shared, short-lived cache of the signed-in member's own users/{uid} doc.
// The route guard, sidebar layout, age check and staff guard all need this
// doc when a page opens; without sharing, each one downloaded it separately
// (3-4 reads of the same doc per page). Callers only READ the returned data
// (never mutate it). Call invalidateUserDoc(uid) after writing to the doc
// when a later read must see the change.
// ---------------------------------------------------------------------------
const userDocCache = new Map(); // uid -> { at, promise }

export const getUserDocCached = (uid, maxAgeMs = 15000) => {
  if (!uid) return Promise.resolve(null);
  const hit = userDocCache.get(uid);
  if (hit && Date.now() - hit.at < maxAgeMs) return hit.promise;
  const entry = { at: Date.now(), promise: null };
  entry.promise = getDoc(doc(db, 'users', uid)).then((s) => (s.exists() ? s.data() : null));
  // Never keep a failed read: the next caller tries again.
  entry.promise.catch(() => {
    if (userDocCache.get(uid) === entry) userDocCache.delete(uid);
  });
  userDocCache.set(uid, entry);
  return entry.promise;
};

export const invalidateUserDoc = (uid) => {
  if (uid) userDocCache.delete(uid);
  else userDocCache.clear();
};
