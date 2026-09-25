// src/utils/activityFeed.js
// Powers the "Proof Wall" - a feed of verified achievements + limited work updates.
//
// Real events (badge earned, project shipped, lead confirmed, milestone) are written
// by logActivity() from the moments they happen. Dummy seed events (for launch, so the
// wall isn't empty) are written by seedDummyActivity() and carry isDummy:true so they
// can be safely bulk-deleted once real activity flows in.

import {
  collection, addDoc, getDocs, query, where, orderBy, limit,
  deleteDoc, doc, serverTimestamp, writeBatch,
  updateDoc, arrayUnion, arrayRemove, increment, deleteField,
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Activity types and the icon/color the UI maps them to.
export const ACTIVITY_TYPES = {
  badge:     { label: 'Badge earned',     icon: 'award' },
  ship:      { label: 'Project shipped',  icon: 'rocket' },
  lead:      { label: 'Looking for a lead', icon: 'flag' },
  milestone: { label: 'Milestone',        icon: 'trophy' },
  update:    { label: 'Project update',   icon: 'message' },
};

// --- Write a REAL activity event (call from badge/ship/lead/milestone moments) ---
export const logActivity = async (event) => {
  try {
    await addDoc(collection(db, 'activity'), {
      type: event.type,                       // 'badge' | 'ship' | 'lead' | 'milestone' | 'update'
      actorId: event.actorId || null,
      actorName: event.actorName || 'A member',
      projectId: event.projectId || null,
      projectTitle: event.projectTitle || null,
      badgeName: event.badgeName || null,
      text: event.text || null,               // for 'update' posts
      imageUrl: event.imageUrl || null,       // optional image on an update
      link: event.link || null,               // optional link on an update
      mentions: event.mentions || [],         // [{uid, name}] mentioned team members
      meta: event.meta || null,               // small extra string e.g. "3 completed projects"
      isDummy: false,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    // Never let activity logging break the underlying action.
    console.error('logActivity failed:', e);
  }
};

// --- Read the wall ---
export const getActivity = async (max = 50, typeFilter = null) => {
  try {
    // Fetch recent activity ordered by time (single-field index, always available),
    // then filter by type client-side to avoid needing a composite index.
    const q = query(collection(db, 'activity'), orderBy('createdAt', 'desc'), limit(max * 3));
    const snap = await getDocs(q);
    let rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (typeFilter) rows = rows.filter(r => r.type === typeFilter);
    return rows.slice(0, max);
  } catch (e) {
    console.error('getActivity failed:', e);
    // Fallback without orderBy (in case the time index is still building)
    try {
      const snap = await getDocs(query(collection(db, 'activity'), limit(max * 3)));
      let rows = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      if (typeFilter) rows = rows.filter(r => r.type === typeFilter);
      return rows.slice(0, max);
    } catch { return []; }
  }
};

// --- DUMMY seed data (launch placeholder; every item flagged isDummy:true) ---
const DUMMY_EVENTS = [
  { type: 'badge', actorName: 'Amara O.', badgeName: 'TechDev · Advanced', meta: 'Verified through 3 completed projects' },
  { type: 'ship', actorName: 'A team of 4', projectTitle: 'Open-Source Event Platform', meta: 'Badges issued to all contributors' },
  { type: 'update', actorName: 'Chidi T.', projectTitle: 'AI Study Summarizer', text: 'Backend is feature-complete. Now wiring the summary pipeline, looking for one more QA contributor.' },
  { type: 'lead', projectTitle: 'Carbon Footprint Calculator', meta: 'Open to anyone, apply to lead' },
  { type: 'milestone', actorName: 'Tunde A.', meta: 'Completed a 5th project, now top 10% of builders' },
  { type: 'badge', actorName: 'Zainab K.', badgeName: 'TechQA · Associate', meta: 'Earned on Recipe Planner project' },
  { type: 'ship', actorName: 'A team of 3', projectTitle: 'Personal Finance Tracker', meta: 'Shipped and archived to Project Vault' },
  { type: 'badge', actorName: 'David M.', badgeName: 'TechLeads · Advanced', meta: 'Led 2 projects to completion' },
  { type: 'lead', projectTitle: 'AI Customer-Support Chatbot', meta: 'Open to anyone, apply to lead' },
  { type: 'update', actorName: 'Fatima S.', projectTitle: 'Accessibility Audit Tool', text: 'Shipped the contrast scanner. Next up: heading-structure checks.' },
  { type: 'milestone', actorName: 'Kwame B.', meta: 'Earned badges across 3 different tracks' },
  { type: 'badge', actorName: 'Lola A.', badgeName: 'TechArchs · Associate', meta: 'Earned on Inventory Dashboard' },
];

export const seedDummyActivity = async () => {
  const batch = writeBatch(db);
  const col = collection(db, 'activity');
  let count = 0;
  // Stagger createdAt slightly so they sort in a natural order.
  const now = Date.now();
  DUMMY_EVENTS.forEach((e, i) => {
    const ref = doc(col);
    batch.set(ref, {
      type: e.type,
      actorId: null,
      actorName: e.actorName || null,
      projectId: null,
      projectTitle: e.projectTitle || null,
      badgeName: e.badgeName || null,
      text: e.text || null,
      meta: e.meta || null,
      isDummy: true,
      createdAt: new Date(now - i * 3600 * 1000), // each an hour older
    });
    count++;
  });
  await batch.commit();
  return count;
};

// --- Bulk delete ONLY dummy items (safe; never touches real activity) ---
export const deleteDummyActivity = async () => {
  const snap = await getDocs(query(collection(db, 'activity'), where('isDummy', '==', true)));
  if (snap.empty) return 0;
  // Firestore batches cap at 500 ops; chunk to be safe.
  const docs = snap.docs;
  let deleted = 0;
  for (let i = 0; i < docs.length; i += 450) {
    const batch = writeBatch(db);
    docs.slice(i, i + 450).forEach(d => batch.delete(d.ref));
    await batch.commit();
    deleted += Math.min(450, docs.length - i);
  }
  return deleted;
};

// Count dummy items currently present (for the admin UI).
export const countDummyActivity = async () => {
  try {
    const snap = await getDocs(query(collection(db, 'activity'), where('isDummy', '==', true)));
    return snap.size;
  } catch (e) {
    console.error('countDummyActivity failed:', e);
    return 0;
  }
};

// --- Love (positive-only reaction) ---
// Toggles the current user's love on an activity item.
// Stores uids in `celebratedBy` + denormalized `celebrateCount`,
// plus a small `celebratedByNames` map {uid: name} for showing who reacted.
export const toggleCelebrate = async (activityId, uid, currentlyCelebrated, userName, userPhoto) => {
  const ref = doc(db, 'activity', activityId);
  const patch = {
    celebratedBy: currentlyCelebrated ? arrayRemove(uid) : arrayUnion(uid),
    celebrateCount: increment(currentlyCelebrated ? -1 : 1),
  };
  // maintain a names+photo map keyed by uid (dot-path update)
  patch[`celebratedByNames.${uid}`] = currentlyCelebrated ? deleteField() : (userName || 'A member');
  patch[`celebratedByPhotos.${uid}`] = currentlyCelebrated ? deleteField() : (userPhoto || '');
  await updateDoc(ref, patch);
};

// --- Edit your own update post ---
export const editUpdate = async (activityId, newText, newProjectTitle) => {
  const ref = doc(db, 'activity', activityId);
  const patch = { text: newText };
  if (newProjectTitle !== undefined) patch.projectTitle = newProjectTitle;
  await updateDoc(ref, patch);
};

// --- Delete your own update post ---
export const deleteActivityItem = async (activityId) => {
  await deleteDoc(doc(db, 'activity', activityId));
};
