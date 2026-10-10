// lib/memberIndex.js
//
// The member directory behind the Talent Board and Search.
//
// Those pages used to read every member record (up to 1,500 reads per visit,
// and anyone past the first 500 members was silently left out). Instead, the
// server builds a compact directory a few times a day and saves it in a
// handful of documents:
//
//   public_index/members            { updatedAt, chunks, count, listed }
//   public_index/members_0, _1 ...  { entries: [ ...members ] } (each under ~700 KB)
//
// Each entry has only what those pages show: name, photo, track, what she
// studies, badges (for the track filter), mentor status, and whether she's
// listed on the Talent Board (a badge, or a mentor). No emails. Learners under
// 18 are never included. Signed-in members can read it (firestore.rules);
// only this server code writes it.
//
// Built by the nightly job, and by the frequent events run when it's more
// than REBUILD_HOURS old, so new badges show within a few hours. Members who
// joined since the last build are topped up in the browser
// (src/utils/memberIndex.js).

// Firestore documents max out at 1 MB; split well below that.
const CHUNK_BYTES = 700 * 1024;
const REBUILD_HOURS = 6;
const COL = 'public_index';

const USER_FIELDS = [
  'displayName', 'photoURL', 'specialization', 'primarySkillTrack', 'isCompany', 'companyName',
  'companyProfile', 'isTeacher', 'mentorApprovedCourses', 'badges', 'badgeCounts', 'totalBadges',
  'certificates', 'isMinor', 'onboardingComplete', 'accountDeleted', 'deleted',
];

const str = (v, n) => (typeof v === 'string' ? v.slice(0, n) : '');

const compactBadges = (badges) =>
  (Array.isArray(badges) ? badges : []).slice(0, 40).map((b) => ({
    id: str(b && b.id, 40),
    category: str(b && b.category, 40),
    badgeCategory: str(b && b.badgeCategory, 40),
    title: str((b && (b.title || b.badgeName)) || '', 60),
  }));

const buildMemberIndex = async (db) => {
  const [usersSnap, badgeSnap] = await Promise.all([
    db.collection('users').select(...USER_FIELDS).get(),
    // Badge records, for members whose profile doesn't list their badges yet.
    db.collection('member_badges').select('memberUid', 'userId', 'uid', 'memberId').get().catch(() => null),
  ]);
  const badged = new Set();
  if (badgeSnap) {
    badgeSnap.docs.forEach((d) => {
      const x = d.data();
      const uid = x.memberUid || x.userId || x.uid || x.memberId;
      if (uid) badged.add(uid);
    });
  }

  const entries = [];
  usersSnap.docs.forEach((d) => {
    const u = d.data();
    if (u.isMinor || u.accountDeleted || u.deleted) return; // under-18s are never listed
    if (u.onboardingComplete === false) return;
    const name = str(u.displayName, 120) || str(u.companyName, 120) || str(u.companyProfile && u.companyProfile.companyName, 120);
    if (!name) return;
    const badges = compactBadges(u.badges);
    const badgeCounts = u.badgeCounts && typeof u.badgeCounts === 'object' ? u.badgeCounts : null;
    const isMentor = !!u.isTeacher || (u.mentorApprovedCourses || 0) > 0;
    const hasBadge = badges.length > 0 || (u.totalBadges || 0) > 0
      || (badgeCounts && Object.values(badgeCounts).some((n) => (n || 0) > 0))
      || (Array.isArray(u.certificates) && u.certificates.length > 0)
      || badged.has(d.id);
    entries.push({
      uid: d.id,
      displayName: str(u.displayName, 120) || null,
      companyName: str(u.companyName, 120) || str(u.companyProfile && u.companyProfile.companyName, 120) || null,
      photoURL: str(u.photoURL, 600) || null,
      specialization: str(u.specialization, 120) || null,
      primarySkillTrack: str(u.primarySkillTrack, 40) || null,
      isCompany: !!u.isCompany,
      isTeacher: !!u.isTeacher,
      mentorApprovedCourses: Number(u.mentorApprovedCourses) || 0,
      badges,
      badgeCounts,
      totalBadges: Number(u.totalBadges) || 0,
      // On the Talent Board: individuals with a badge, and mentors.
      listed: !u.isCompany && (hasBadge || isMentor),
    });
  });
  entries.sort((a, b) => (a.displayName || a.companyName || '').localeCompare(b.displayName || b.companyName || ''));

  const chunks = [[]];
  let size = 0;
  entries.forEach((e) => {
    const n = Buffer.byteLength(JSON.stringify(e)) + 16;
    if (size + n > CHUNK_BYTES && chunks[chunks.length - 1].length) {
      chunks.push([]);
      size = 0;
    }
    chunks[chunks.length - 1].push(e);
    size += n;
  });

  const now = new Date();
  const metaRef = db.collection(COL).doc('members');
  const prev = await metaRef.get().catch(() => null);
  const prevChunks = (prev && prev.exists && prev.data().chunks) || 0;

  // Write the chunks first, then the summary that points at them.
  for (let i = 0; i < chunks.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await db.collection(COL).doc(`members_${i}`).set({ entries: chunks[i], at: now });
  }
  await metaRef.set({
    updatedAt: now,
    chunks: chunks.length,
    count: entries.length,
    listed: entries.filter((e) => e.listed).length,
  });
  // Remove chunks left over from a bigger directory.
  for (let i = chunks.length; i < prevChunks; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await db.collection(COL).doc(`members_${i}`).delete().catch(() => {});
  }
  return { members: entries.length, listed: entries.filter((e) => e.listed).length, chunks: chunks.length };
};

// Rebuild only when the directory is older than REBUILD_HOURS (or missing).
const rebuildMemberIndexIfStale = async (db) => {
  const meta = await db.collection(COL).doc('members').get().catch(() => null);
  const at = meta && meta.exists && meta.data().updatedAt;
  const ms = at && typeof at.toMillis === 'function' ? at.toMillis() : 0;
  if (ms && Date.now() - ms < REBUILD_HOURS * 3600 * 1000) return { skipped: true };
  return buildMemberIndex(db);
};

module.exports = { buildMemberIndex, rebuildMemberIndexIfStale };
