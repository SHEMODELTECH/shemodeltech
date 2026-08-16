// src/utils/foundationsContributions.js
// Community-contributed Foundations lessons: eligibility, submission, review, rating.
// Contributors submit ONLY their own original content, as a link (we host nothing).
// Eligibility: an Associate+ badge (2+ completed projects) in the relevant track.

import {
  collection, addDoc, getDocs, query, where, doc, updateDoc,
  serverTimestamp, setDoc, getDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Map a track id to ALL the values a stored badge might use for it. Badges store
// category as a raw key like 'development' and id like 'techdev', so we match broadly.
const TRACK_ALIASES = {
  techdev:    ['techdev', 'development', 'tech dev', 'developer'],
  techarchs:  ['techarchs', 'design', 'architecture', 'low-code', 'no-code'],
  techqa:     ['techqa', 'quality-assurance', 'quality', 'qa'],
  techguard:  ['techguard', 'security', 'cybersecurity', 'network'],
  techpo:     ['techpo', 'techmo', 'mentorship', 'product', 'project-owner', 'po'],
  techleads:  ['techleads', 'leadership', 'leader', 'non-technical'],
};

const trackToCategory = (trackId) => {
  if (!trackId) return [];
  const t = trackId.toString().toLowerCase();
  // Find the canonical track key whose alias list this trackId belongs to.
  for (const [key, aliases] of Object.entries(TRACK_ALIASES)) {
    if (key === t || aliases.includes(t)) return [key, ...aliases];
  }
  return [t];
};

// Count how many badges a user has earned in a given track. Matches against the
// badge's category, id, AND title (any of them), case-insensitively, because the
// app stores these inconsistently (category='development', id='techdev', etc.).
const countBadgesForTrack = (userData, trackId) => {
  if (!userData || !Array.isArray(userData.badges)) return 0;
  const forms = trackToCategory(trackId);
  return userData.badges.filter(b => {
    const fields = [b.category, b.id, b.title, b.badgeCategory]
      .map(x => (x || '').toString().toLowerCase());
    // Match if any badge field equals or contains any of the track's forms.
    return forms.some(f => fields.some(fld => fld === f || fld.includes(f)));
  }).length;
};

// Derive level from count (Novice 1, Associate 2-5, Advanced 6-10, Expert 11+).
const levelFromCount = (n) => n >= 11 ? 'Expert' : n >= 6 ? 'Advanced' : n >= 2 ? 'Associate' : n >= 1 ? 'Novice' : null;

// Canonical track id + display label for each track key.
const TRACK_INFO = {
  techdev:   { id: 'TechDev',   label: 'Coding Developer' },
  techarchs: { id: 'TechArchs', label: 'Low/No-Code Developer' },
  techqa:    { id: 'TechQA',    label: 'Quality Tester' },
  techguard: { id: 'TechGuard', label: 'Network & Cybersecurity' },
  techpo:    { id: 'TechPO',    label: 'Product / Project Owner' },
  techleads: { id: 'TechLeads', label: 'Non-Technical Roles' },
};

// Which canonical track key does a single badge belong to? Checks all its fields.
const badgeToTrackKey = (badge) => {
  const fields = [badge.category, badge.id, badge.title, badge.badgeCategory]
    .map(x => (x || '').toString().toLowerCase());
  for (const [key, aliases] of Object.entries(TRACK_ALIASES)) {
    if (fields.some(fld => fld === key || aliases.some(a => fld === a || fld.includes(a)))) return key;
  }
  return null;
};

// All distinct track keys the user has ANY badge in (1+), as canonical track ids.
export const badgeTrackIds = (userData) => {
  if (!userData || !Array.isArray(userData.badges)) return [];
  const keys = new Set();
  userData.badges.forEach(b => { const k = badgeToTrackKey(b); if (k) keys.add(k); });
  return Array.from(keys).map(k => TRACK_INFO[k]?.id).filter(Boolean);
};

// Which tracks is this user eligible to contribute to? Returns [{id, label, count, level}].
// Eligible = Associate+ (2+ badges) in that track. Works regardless of profile track.
export const eligibleTrackList = (userData) => {
  if (!userData || !Array.isArray(userData.badges)) return [];
  const counts = {};
  userData.badges.forEach(b => {
    const key = badgeToTrackKey(b);
    if (key) counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .filter(([, n]) => n >= 2)
    .map(([key, n]) => ({ ...TRACK_INFO[key], count: n, level: levelFromCount(n) }))
    .filter(t => t.id);
};

// Public: the user's current level in a track, derived from badge count.
export const levelForTrack = (userData, trackId) => levelFromCount(countBadgesForTrack(userData, trackId));

// Which tracks is this user eligible to contribute to? Returns array of track ids.
// Eligible = Associate+ (2+ badges) in a track. Derived from COUNT, not the frozen
// per-badge level (which never upgrades after award).
export const eligibleTracks = (userData) => {
  if (!userData || !Array.isArray(userData.badges)) return [];
  const eligible = new Set();
  // Collect all distinct categories present on the user's badges.
  const cats = new Set();
  userData.badges.forEach(b => {
    const c = (b.category || b.id || '').toString();
    if (c) cats.add(c);
  });
  cats.forEach(cat => {
    if (countBadgesForTrack(userData, cat) >= 2) eligible.add(cat);
  });
  return Array.from(eligible);
};

// Is the user eligible for a specific track? (Associate+ = 2+ badges in it.)
export const isEligibleForTrack = (userData, trackId) => {
  return countBadgesForTrack(userData, trackId) >= 2;
};

// Submit a new contribution (status: pending).
export const submitContribution = async ({ trackId, title, url, description, authorId, authorName, authorBadgeLevel }) => {
  return addDoc(collection(db, 'foundationsContributions'), {
    trackId,
    title: title.trim(),
    url: url.trim(),
    description: description.trim(),
    authorId,
    authorName,
    authorBadgeLevel: authorBadgeLevel || null,
    status: 'pending', // pending | approved | changes_requested | rejected
    reviewNote: null,
    ratingSum: 0,
    ratingCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// Resubmit (after changes requested) — sets back to pending.
export const resubmitContribution = async (id, { title, url, description }) => {
  return updateDoc(doc(db, 'foundationsContributions', id), {
    title: title.trim(), url: url.trim(), description: description.trim(),
    status: 'pending', updatedAt: serverTimestamp(),
  });
};

// Admin review actions.
export const reviewContribution = async (id, action, note = '') => {
  const status = action === 'approve' ? 'approved'
    : action === 'changes' ? 'changes_requested'
    : 'rejected';
  return updateDoc(doc(db, 'foundationsContributions', id), {
    status, reviewNote: note || null, updatedAt: serverTimestamp(),
  });
};

// Fetch approved contributions for a track (for the Foundations community section).
export const getApprovedForTrack = async (trackId) => {
  const snap = await getDocs(query(
    collection(db, 'foundationsContributions'),
    where('trackId', '==', trackId)
  ));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .filter(c => c.status === 'approved')
    .sort((a, b) => {
      const ra = a.ratingCount ? a.ratingSum / a.ratingCount : 0;
      const rb = b.ratingCount ? b.ratingSum / b.ratingCount : 0;
      return rb - ra; // best-rated first
    });
};

// Fetch a member's own contributions (any status) — for their dashboard/profile.
export const getMyContributions = async (authorId) => {
  const snap = await getDocs(query(
    collection(db, 'foundationsContributions'),
    where('authorId', '==', authorId)
  ));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

// Fetch ALL contributions (any status) for the admin management view.
export const getAllContributions = async () => {
  const snap = await getDocs(collection(db, 'foundationsContributions'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};

// Admin edits a contribution's content directly (title / url / description).
export const adminEditContribution = async (id, { title, url, description }) => {
  return updateDoc(doc(db, 'foundationsContributions', id), {
    ...(title !== undefined ? { title: title.trim() } : {}),
    ...(url !== undefined ? { url: url.trim() } : {}),
    ...(description !== undefined ? { description: description.trim() } : {}),
    updatedAt: serverTimestamp(),
  });
};

// Admin removes a contribution entirely.
export const adminDeleteContribution = async (id) => {
  const { deleteDoc } = await import('firebase/firestore');
  return deleteDoc(doc(db, 'foundationsContributions', id));
};

// Fetch pending+changes items for admin review.
export const getReviewQueue = async () => {
  const snap = await getDocs(collection(db, 'foundationsContributions'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .filter(c => c.status === 'pending')
    .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
};

// Aggregate an author's teaching rating across all their approved contributions
// (computed on read, so no cross-user writes are needed). Returns {avg, count, lessons}.
export const getAuthorTeachingRating = async (authorId) => {
  const snap = await getDocs(query(
    collection(db, 'foundationsContributions'),
    where('authorId', '==', authorId)
  ));
  const approved = snap.docs.map(d => d.data()).filter(c => c.status === 'approved');
  let sum = 0, count = 0;
  approved.forEach(c => { sum += (c.ratingSum || 0); count += (c.ratingCount || 0); });
  return { avg: count ? sum / count : 0, count, lessons: approved.length };
};
// double-voting; aggregates kept on the parent for cheap display).
export const rateContribution = async (contributionId, userId, stars) => {
  const ratingRef = doc(db, 'foundationsContributions', contributionId, 'ratings', userId);
  const parentRef = doc(db, 'foundationsContributions', contributionId);
  const existing = await getDoc(ratingRef);
  const parentSnap = await getDoc(parentRef);
  if (!parentSnap.exists()) return;
  const p = parentSnap.data();
  let sum = p.ratingSum || 0, count = p.ratingCount || 0;
  if (existing.exists()) {
    sum = sum - (existing.data().stars || 0) + stars; // replace previous
  } else {
    sum += stars; count += 1;
  }
  await setDoc(ratingRef, { stars, userId, updatedAt: serverTimestamp() });
  await updateDoc(parentRef, { ratingSum: sum, ratingCount: count });
};
