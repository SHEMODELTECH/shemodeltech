// src/utils/activityStamp.js
// Records when a user was last active on the platform / a project, so the daily
// reminder email can detect "went quiet" and nudge them to pick up where they left off.

import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

// Stamp the user's overall last-active time, and (optionally) their last activity
// on a specific project. Non-blocking and safe to call on page view.
export const stampActivity = async (uid, projectId = null) => {
  if (!uid) return;
  try {
    const update = { lastActiveAt: serverTimestamp() };
    if (projectId) {
      // Per-project last-active map: { [projectId]: timestamp }
      update[`projectActivity.${projectId}`] = serverTimestamp();
    }
    await updateDoc(doc(db, 'users', uid), update);
  } catch (e) {
    // Non-critical; never block the UI for this.
    console.log('activity stamp skipped:', e.message);
  }
};
