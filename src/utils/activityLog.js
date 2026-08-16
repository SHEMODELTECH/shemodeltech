// src/utils/activityLog.js - Centralized activity logging for projects
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Logs an activity to the project's activityLog array in Firestore.
 * All logs are compressed into a single array on the project document
 * to minimize reads/writes.
 * 
 * Activity types:
 * - project_created, project_updated, project_completed
 * - member_applied, member_approved, member_rejected
 * - workspace_updated, resource_added, resource_removed
 * - payment_requested, payment_confirmed, payment_disputed, dispute_resolved
 * - badge_awarded, certificate_issued
 */
export const logActivity = async (projectId, activity) => {
  if (!projectId) return;
  try {
    const entry = {
      type: activity.type,
      actor: activity.actor || 'system',
      actorName: activity.actorName || 'System',
      description: activity.description || '',
      metadata: activity.metadata || {},
      timestamp: new Date().toISOString(),
    };
    await updateDoc(doc(db, 'projects', projectId), {
      activityLog: arrayUnion(entry),
    });
  } catch (e) {
    console.error('Activity log error:', e.message);
  }
};
