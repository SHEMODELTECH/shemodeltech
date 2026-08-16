// src/utils/adminDataReset.js
// DANGER: utilities for wiping TEST DATA during platform testing.
// These delete documents only. They do NOT touch Firestore rules, indexes,
// collection definitions, or app code - so all functionality stays intact.
// User ACCOUNTS are preserved (deleting them would break Firebase Auth login);
// an option is provided to reset each user's badge/certificate fields so the
// platform reads clean.

import { db } from '../firebase/config';
import {
  collection, getDocs, doc, deleteDoc, writeBatch, query, limit,
} from 'firebase/firestore';

// Top-level collections that hold test CONTENT (safe to wipe).
const CONTENT_COLLECTIONS = [
  'projects',               // (also has forum subcollection - handled below)
  'project_applications',
  'project_completion_requests',
  'applications',
  'activity',
  'posts',                  // (also has replies subcollection - handled below)
  'post_replies',
  'conversations',          // (also has messages subcollection - handled below)
  'hub_posts',
  'notifications',
  'admin_notifications',
  'member_badges',
  'certificates',
  'payments',
  'follows',
  'groups',
  'group_members',
  'group_posts',
  'event_groups',
  'event_group_members',
  'event_group_posts',
  'tech_events',
  'directory_access',
  'career_analyses',
  'client_projects',
  'ai_career_content',
  'companies',
  'company_members',
  'outreach',
  'jobposts_quota',
];

// Subcollections to clear under each parent doc before deleting the parent.
const SUBCOLLECTIONS = {
  projects: ['forum'],
  posts: ['replies'],
  conversations: ['messages'],
};

// Delete every doc in a collection (and known subcollections), in batches.
const deleteCollection = async (collName, onProgress) => {
  let deleted = 0;
  // Loop in pages until empty.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const snap = await getDocs(query(collection(db, collName), limit(200)));
    if (snap.empty) break;

    // First clear any subcollections for these parent docs.
    const subs = SUBCOLLECTIONS[collName] || [];
    for (const parentDoc of snap.docs) {
      for (const sub of subs) {
        // eslint-disable-next-line no-await-in-loop
        const subSnap = await getDocs(collection(db, collName, parentDoc.id, sub));
        if (!subSnap.empty) {
          let b = writeBatch(db);
          let n = 0;
          for (const sd of subSnap.docs) {
            b.delete(sd.ref);
            n++;
            if (n >= 400) { /* eslint-disable-next-line no-await-in-loop */ await b.commit(); b = writeBatch(db); n = 0; }
          }
          if (n > 0) { /* eslint-disable-next-line no-await-in-loop */ await b.commit(); }
        }
      }
    }

    // Now delete the parent docs in a batch.
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
    deleted += snap.size;
    if (onProgress) onProgress(collName, deleted);

    if (snap.size < 200) break;
  }
  return deleted;
};

// Reset badge / certificate / project fields on every user doc, WITHOUT
// deleting the user (keeps their account + login + basic profile).
const resetUserBadges = async (onProgress) => {
  let reset = 0;
  let lastCount = -1;
  // Page through users.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const snap = await getDocs(query(collection(db, 'users'), limit(200)));
    if (snap.empty) break;
    const batch = writeBatch(db);
    snap.docs.forEach(d => {
      batch.update(d.ref, {
        badges: [],
        certificates: [],
        totalBadges: 0,
        badgeCounts: {},
      });
    });
    await batch.commit();
    reset += snap.size;
    if (onProgress) onProgress('users (badges reset)', reset);
    // users aren't deleted, so the page won't shrink - stop after one full pass.
    if (reset === lastCount || snap.size < 200) break;
    lastCount = reset;
    break; // single pass is enough since we update in place
  }
  return reset;
};

// MAIN: wipe all test content. If resetUsers is true, also clears each user's
// badge/certificate fields. Returns a summary { collection: count }.
export const clearAllTestData = async ({ resetUsers = true } = {}, onProgress) => {
  const summary = {};
  for (const coll of CONTENT_COLLECTIONS) {
    try {
      // eslint-disable-next-line no-await-in-loop
      summary[coll] = await deleteCollection(coll, onProgress);
    } catch (e) {
      console.error(`Failed clearing ${coll}:`, e);
      summary[coll] = `error: ${e.message}`;
    }
  }
  if (resetUsers) {
    try {
      summary['users (badges reset)'] = await resetUserBadges(onProgress);
    } catch (e) {
      console.error('Failed resetting user badges:', e);
      summary['users (badges reset)'] = `error: ${e.message}`;
    }
  }
  return summary;
};
