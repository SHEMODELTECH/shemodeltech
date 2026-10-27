// src/utils/conference.js
// She Model Tech Conference page (shemodeltech.com/conference).
//   conference_page/info   - what the page shows: date, venue, registration,
//                            speakers, partner organizations. Staff edit it in
//                            Admin → Conference; anyone can read it.
//   conference_notify/{uid} - members who tapped "Notify me" before
//                            registration opened (Admin → Send an announcement
//                            has this list as an audience).
// Registration itself runs through Events: staff create the conference as an
// event and link it here, so places, reminders, and the joining link work as
// for any event.
import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const SPEAKER_ROLES = ['Tech talk', 'Panelist', 'Workshop', 'Leadership Development', 'Ministration', 'Host'];

// Conference partner packages (separate from the year-round company tiers).
export const PARTNER_PACKAGES = [
  ['Community partner', 'Meet our community at the networking and career fair, with a table and your logo on the conference page.'],
  ['Session partner', 'Lead a workshop, take a panel seat, or run a Leadership Development session. Content is agreed with She Model Tech.'],
  ['Pitch competition partner', 'Fund or co-fund the prize, present the award on stage, and see your logo on the pitch competition.'],
  ['Founders partner', 'For investors, incubators, and accelerators: meet founders who’ve agreed to be introduced, run office hours, and help ideas grow toward seed stage.'],
];

export const PROGRAM = [
  ['talks', 'Tech Talks', 'Practical talks from people building with technology today: AI, product, security, careers, and more.'],
  ['panel', 'Panel Discussion', 'Honest conversations with leaders and founders about building a career in tech.'],
  ['workshops', 'Workshops', 'Hands-on sessions where you learn a skill and practise it on the day.'],
  ['leadership', 'Leadership Development', 'Interactive sessions on leading teams, communicating with confidence, and growing as a leader.'],
  ['pitch', 'Pitch Competition', 'Founders from our community pitch their ideas for prize money.'],
  ['ministration', 'Ministration', 'A time of worship, encouragement, and reflection.'],
  ['networking', 'Networking & Career Fair', 'Meet organizations and people: partners, mentors, founders, and members from around the world.'],
];

const ref = doc(db, 'conference_page', 'info');

export const getConferencePage = async () => {
  try {
    const s = await getDoc(ref);
    return s.exists() ? s.data() : {};
  } catch (_) { return {}; }
};
export const saveConferencePage = (data, by) => setDoc(ref, { ...data, updatedAt: serverTimestamp(), updatedBy: by || null }, { merge: true });

// "Learn more / register" goes to the conference event in Events. Staff paste
// the event's address (or its id).
export const eventIdFrom = (v) => {
  const t = String(v || '').trim();
  const m = t.match(/\/events\/([A-Za-z0-9_-]+)/);
  if (m && m[1] !== 'host' && m[1] !== 'manage') return m[1];
  return /^[A-Za-z0-9_-]{6,}$/.test(t) ? t : '';
};

// Notify me
const nref = (uid) => doc(db, 'conference_notify', uid);
export const isNotified = async (uid) => {
  try { return (await getDoc(nref(uid))).exists(); } catch (_) { return false; }
};
export const notifyMe = (uid) => setDoc(nref(uid), { uid, createdAt: serverTimestamp() });
export const stopNotify = (uid) => deleteDoc(nref(uid));
export const notifyList = async () => (await getDocs(collection(db, 'conference_notify'))).docs.map((d) => d.id);
