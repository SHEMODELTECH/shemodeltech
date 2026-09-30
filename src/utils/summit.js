// src/utils/summit.js
// The She Model Tech Summit.
//
//   summits/{id}: title, tagline, startDate, endDate, venue, format, description,
//     agenda, speakers, workshops (plain text, one item per line), published,
//     sponsors [{ name, logoUrl, url }], partnerOptions (text), createdAt
//   summitRegistrations/{summitId}_{uid}: summitId, uid, name, email, checkedIn,
//     shareProfile (recruiters may view her Talent Board profile), createdAt
//   summitPartners/{id}: summitId, companyName, contactName, contactEmail, option,
//     message, status, companyUid (if signed in), createdAt
//
// Sponsorships are acknowledgment only (logo, name, thank-you). Partner
// payments are invoiced outside the platform for now.

import { addDoc, collection, deleteField, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase/config';

// Summit requests from companies. Each needs a company tier (once tiers are on);
// She Model Tech approves every request. Funding goes through Support our mission.
export const PARTNER_OPTIONS = {
  booth: 'Exhibitor table',
  workshop: 'Host a workshop',
  panel: 'Panel seat (sponsored session)',
  speaking: 'Speaking slot (sponsored session)',
};
// The tier perk each request needs.
export const PARTNER_OPTION_PERK = { booth: 'summitTable', workshop: 'summitWorkshop', panel: 'summitPanel', speaking: 'summitSpeaker' };
export const PARTNER_STATUSES = ['new', 'approved', 'invoiced', 'paid', 'confirmed', 'declined'];
export const PARTNER_STATUS_LABELS = { new: 'New', approved: 'Approved', invoiced: 'Invoiced', paid: 'Paid', confirmed: 'Confirmed', declined: 'Declined' };
export const SUMMIT_LIMITS = { messageMinWords: 5, messageMaxChars: 1500 };

// The summit shown to the public: the latest published one.
// The summit shown to the public: registration open (published) first, otherwise
// one announced as coming soon (visitors can ask to be notified).
export const getCurrentSummit = async () => {
  const [pub, ann] = await Promise.all([
    getDocs(query(collection(db, 'summits'), where('published', '==', true), limit(10))),
    getDocs(query(collection(db, 'summits'), where('announced', '==', true), limit(10))),
  ]);
  const byDate = (a, b) => String(b.startDate || '').localeCompare(String(a.startDate || ''));
  const published = pub.docs.map((d) => ({ id: d.id, ...d.data() })).sort(byDate);
  if (published[0]) return published[0];
  const announced = ann.docs.map((d) => ({ id: d.id, ...d.data() })).sort(byDate);
  return announced[0] || null;
};

// "Notify me": members asking to hear when registration opens.
// summitInterest/{summitId}_{uid}; summitId is 'next' before any summit is announced.
export const notifyMe = (summitId, user, name) =>
  setDoc(doc(db, 'summitInterest', `${summitId}_${user.uid}`), {
    summitId, uid: user.uid, email: user.email, name: name || user.displayName || '', emailed: false, createdAt: serverTimestamp(),
  });
export const getMyInterest = async (summitId, uid) => {
  const s = await getDoc(doc(db, 'summitInterest', `${summitId}_${uid}`)).catch(() => null);
  return !!(s && s.exists());
};
// When registration opens: email everyone who asked (for this summit or 'next').
export const emailInterested = async (summit, notify) => {
  const snap = await getDocs(query(collection(db, 'summitInterest'), where('summitId', 'in', [summit.id, 'next'])));
  let n = 0;
  for (const d of snap.docs) {
    const w = d.data();
    if (w.emailed) continue;
    await notify(w.uid, {
      type: 'summit_open',
      title: 'Summit registration is open',
      body: `${summit.title}: registration is open. Reserve your place and your workshop seats.`,
      link: '/summit',
      ctaLabel: 'Register',
      emailTo: w.email,
    }).catch(() => {});
    await updateDoc(doc(db, 'summitInterest', d.id), { emailed: true }).catch(() => {});
    n += 1;
  }
  return n;
};

// Workshop seats: count registrations that reserved a workshop.
export const workshopTaken = async (summitId, sessionId) => {
  const c = await getCountFromServer(query(collection(db, 'summitRegistrations'), where('summitId', '==', summitId), where('workshops', 'array-contains', sessionId)));
  return c.data().count;
};
export const updateMyWorkshops = (summitId, uid, workshops) =>
  updateDoc(doc(db, 'summitRegistrations', `${summitId}_${uid}`), { workshops });

export const listSummits = async () => {
  const snap = await getDocs(query(collection(db, 'summits'), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
export const saveSummit = async (id, data) => {
  if (id) {
    await updateDoc(doc(db, 'summits', id), { ...data, updatedAt: serverTimestamp() });
    return id;
  }
  const ref = await addDoc(collection(db, 'summits'), { ...data, sponsors: data.sponsors || [], createdAt: serverTimestamp() });
  return ref.id;
};

const regId = (summitId, uid) => `${summitId}_${uid}`;
export const getMyRegistration = async (summitId, uid) => {
  const s = await getDoc(doc(db, 'summitRegistrations', regId(summitId, uid)));
  return s.exists() ? s.data() : null;
};
export const registerForSummit = (summit, user, profile, shareProfile, workshops = []) =>
  setDoc(doc(db, 'summitRegistrations', regId(summit.id, user.uid)), {
    summitId: summit.id,
    uid: user.uid,
    name: profile?.displayName || user.displayName || user.email,
    email: user.email,
    shareProfile: !!shareProfile,
    workshops,
    checkedIn: false,
    createdAt: serverTimestamp(),
  });
export const listRegistrations = async (summitId) => {
  const snap = await getDocs(query(collection(db, 'summitRegistrations'), where('summitId', '==', summitId)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
export const setCheckedIn = async (reg, checkedIn) => {
  await updateDoc(doc(db, 'summitRegistrations', reg.id), { checkedIn });
  // Summit Attendee badge: separate from skill badges (doesn't count toward paid-project eligibility).
  await updateDoc(doc(db, 'users', reg.uid), { [`summitAttendance.${reg.summitId}`]: checkedIn ? true : deleteField() }).catch(() => {});
};

export const createPartnerRequest = (summitId, form, uid = null) =>
  addDoc(collection(db, 'summitPartners'), { ...form, summitId, companyUid: uid, status: 'new', createdAt: serverTimestamp() });
export const listPartnerRequests = async (summitId) => {
  const snap = await getDocs(query(collection(db, 'summitPartners'), where('summitId', '==', summitId)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
};
export const listMyPartnerRequests = async (uid) => {
  const snap = await getDocs(query(collection(db, 'summitPartners'), where('companyUid', '==', uid)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
export const setPartnerStatus = (id, status) => updateDoc(doc(db, 'summitPartners', id), { status });
