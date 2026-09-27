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

import { addDoc, collection, deleteField, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export const PARTNER_OPTIONS = {
  booth: 'Exhibitor booth or recruiting table',
  workshop: 'Sponsored workshop',
  speaking: 'Speaking slot',
  sponsorship: 'Sponsorship (logo and name acknowledgment)',
};
export const PARTNER_STATUSES = ['new', 'approved', 'invoiced', 'paid', 'confirmed', 'declined'];
export const PARTNER_STATUS_LABELS = { new: 'New', approved: 'Approved', invoiced: 'Invoiced', paid: 'Paid', confirmed: 'Confirmed', declined: 'Declined' };
export const SUMMIT_LIMITS = { messageMinWords: 5, messageMaxChars: 1500 };

// The summit shown to the public: the latest published one.
export const getCurrentSummit = async () => {
  const snap = await getDocs(query(collection(db, 'summits'), where('published', '==', true), limit(10)));
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  list.sort((a, b) => String(b.startDate || '').localeCompare(String(a.startDate || '')));
  return list[0] || null;
};

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
export const registerForSummit = (summit, user, profile, shareProfile) =>
  setDoc(doc(db, 'summitRegistrations', regId(summit.id, user.uid)), {
    summitId: summit.id,
    uid: user.uid,
    name: profile?.displayName || user.displayName || user.email,
    email: user.email,
    shareProfile: !!shareProfile,
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
