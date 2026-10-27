// src/utils/founders.js
// Founders: members (13+, at least one badge, not companies) apply to pitch
// their idea at She Model Tech Conference. Staff accept or decline in
// Admin → Founders. Accepted founders are listed on the Founders page with the
// roles they need, and build their team by messaging members (Talent Board).
// One pitch per member: founder_pitches/{uid}. The database rules check the
// same limits (firestore.rules: founder_pitches).
import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export const FOUNDER_STAGES = [
  ['idea', 'Idea'],
  ['prototype', 'Prototype'],
  ['live', 'Live with users'],
];
export const stageLabel = (s) => (FOUNDER_STAGES.find(([k]) => k === s) || [null, 'Idea'])[1];

// Character limits: [minimum, maximum]. Shown on the form up front.
export const PITCH_LIMITS = {
  ideaName: [2, 80],
  problem: [20, 600],
  audience: [5, 300],
  solution: [20, 800],
  rolesNeeded: [0, 300],
  why: [20, 800],
};
export const MAX_TRACKS = 6;

export const CONFERENCE_NOTE = 'Accepted founders are invited to pitch at She Model Tech Conference. Date and venue to be announced.';

// Who can apply: members 13 and over (not companies) with at least one badge.
export const founderBlocker = (profile) => {
  if (!profile) return 'signin';
  if (profile.isCompany) return 'company';
  if (!['18plus', '13-17'].includes(profile.ageGroup)) return 'age';
  if (!(profile.badges || []).length) return 'badge';
  return null;
};

const ref = (uid) => doc(db, 'founder_pitches', uid);
const FIELDS = ['ideaName', 'problem', 'audience', 'solution', 'stage', 'tracksNeeded', 'rolesNeeded', 'why'];
const clean = (f) => ({
  ideaName: f.ideaName.trim(),
  problem: f.problem.trim(),
  audience: f.audience.trim(),
  solution: f.solution.trim(),
  stage: f.stage,
  tracksNeeded: (f.tracksNeeded || []).slice(0, MAX_TRACKS),
  rolesNeeded: f.rolesNeeded.trim(),
  why: f.why.trim(),
});

export const getMyPitch = async (uid) => {
  try {
    const s = await getDoc(ref(uid));
    return s.exists() ? { id: s.id, ...s.data() } : null;
  } catch (_) { return null; }
};

// New pitch, or a pending/declined one sent again (back to review).
export const submitPitch = async (uid, name, form, existing) => {
  const data = clean(form);
  if (existing) {
    await updateDoc(ref(uid), { ...data, status: 'pending', updatedAt: serverTimestamp() });
  } else {
    await setDoc(ref(uid), { uid, name: String(name || 'Member').slice(0, 120), ...data, status: 'pending', createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }
};

// Accepted founders keep their team needs up to date (no new review).
export const updateTeamNeeds = (uid, { tracksNeeded, rolesNeeded }) =>
  updateDoc(ref(uid), { tracksNeeded: (tracksNeeded || []).slice(0, MAX_TRACKS), rolesNeeded: String(rolesNeeded || '').trim(), updatedAt: serverTimestamp() });

export const withdrawPitch = (uid) => deleteDoc(ref(uid));

export const listFounders = async () => {
  const s = await getDocs(query(collection(db, 'founder_pitches'), where('status', '==', 'accepted')));
  return s.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// An accepted founder's pitch, or null (others aren't readable).
export const founderOf = async (uid) => {
  if (!uid) return null;
  const p = await getMyPitch(uid);
  return p && p.status === 'accepted' ? p : null;
};

export const PITCH_FIELDS = FIELDS;
