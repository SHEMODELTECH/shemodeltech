// src/utils/memberIndex.js
// The member directory for the Talent Board and Search (built on the server
// by lib/memberIndex.js, a few times a day). Reading it costs a handful of
// document reads instead of one per member.
//
//   public_index/members            { updatedAt, chunks, count, listed }
//   public_index/members_<n>        { entries: [...] }
//
// Members who joined after the last build are added from a small query, so a
// brand-new member can be found straight away. Until the server has built the
// directory once, this falls back to reading member records directly.
// Kept in memory for 10 minutes while the app is open.
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const TTL_MS = 10 * 60 * 1000;
let cache = { at: 0, promise: null };

const str = (v, n) => (typeof v === 'string' ? v.slice(0, n) : '');

// Same shape as the server's entries (lib/memberIndex.js).
export const toDirectoryEntry = (uid, u) => {
  if (!u || u.isMinor || u.accountDeleted || u.deleted || u.onboardingComplete === false) return null;
  const companyName = str(u.companyName, 120) || str(u.companyProfile?.companyName, 120) || null;
  const displayName = str(u.displayName, 120) || null;
  if (!displayName && !companyName) return null;
  const badges = (Array.isArray(u.badges) ? u.badges : []).slice(0, 40).map((b) => ({
    id: str(b?.id, 40), category: str(b?.category, 40), badgeCategory: str(b?.badgeCategory, 40), title: str(b?.title || b?.badgeName || '', 60),
  }));
  const badgeCounts = u.badgeCounts && typeof u.badgeCounts === 'object' ? u.badgeCounts : null;
  const isMentor = !!u.isTeacher || (u.mentorApprovedCourses || 0) > 0;
  const hasBadge = badges.length > 0 || (u.totalBadges || 0) > 0
    || (badgeCounts && Object.values(badgeCounts).some((n) => (n || 0) > 0))
    || (Array.isArray(u.certificates) && u.certificates.length > 0);
  return {
    uid,
    displayName,
    companyName,
    photoURL: str(u.photoURL, 600) || null,
    specialization: str(u.specialization, 120) || null,
    primarySkillTrack: str(u.primarySkillTrack, 40) || null,
    isCompany: !!u.isCompany,
    isTeacher: !!u.isTeacher,
    mentorApprovedCourses: Number(u.mentorApprovedCourses) || 0,
    badges,
    badgeCounts,
    totalBadges: Number(u.totalBadges) || 0,
    listed: !u.isCompany && (hasBadge || isMentor),
  };
};

const fromSnap = (snap) => snap.docs.map((d) => toDirectoryEntry(d.id, d.data())).filter(Boolean);

const load = async () => {
  const meta = await getDoc(doc(db, 'public_index', 'members'));
  if (!meta.exists()) {
    // Not built yet (first day after this update): read member records directly.
    return fromSnap(await getDocs(query(collection(db, 'users'), limit(500))));
  }
  const { chunks = 0, updatedAt } = meta.data();
  const parts = await Promise.all(
    Array.from({ length: chunks }, (_, i) => getDoc(doc(db, 'public_index', `members_${i}`)))
  );
  const byUid = new Map();
  parts.forEach((p) => (p.exists() ? p.data().entries || [] : []).forEach((e) => byUid.set(e.uid, e)));
  // Members who joined since the directory was built.
  if (updatedAt) {
    try {
      const fresh = await getDocs(query(collection(db, 'users'), where('createdAt', '>', updatedAt), limit(50)));
      fromSnap(fresh).forEach((e) => byUid.set(e.uid, e));
    } catch (_) {
      /* the directory alone is fine */
    }
  }
  return [...byUid.values()];
};

export const loadMemberDirectory = () => {
  if (cache.promise && Date.now() - cache.at < TTL_MS) return cache.promise;
  const promise = load();
  cache = { at: Date.now(), promise };
  promise.catch(() => {
    if (cache.promise === promise) cache = { at: 0, promise: null };
  });
  return promise;
};
