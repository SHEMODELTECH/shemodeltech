// src/utils/recruiterOutreach.js
//
// OUTREACH LIMITS APPLY TO COMPANIES ONLY. NEVER TO MEMBERS.
//
// A member can always message any company, without limit. She can always
// reply to anyone. Nothing she does is metered, she is the reason the
// platform exists, and blocking her outreach would block her opportunity.
//
// Free company accounts get a small allowance of outbound messages
// (FREE_COMPANY_DM_LIMIT) so a genuine opportunity is never blocked by a
// paywall. What Talent Access sells is VOLUME plus the tooling around it, // search, badge filtering, verified evidence, saved candidates, not
// permission to see that our members exist.
//
// A company can always REPLY to a member who contacted them first, even at
// zero remaining allowance. Otherwise a member's message could land in a
// silence she'd read as rejection.

import {
 doc, getDoc, setDoc, updateDoc, increment, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { companyCapabilities, FREE_COMPANY_DM_LIMIT } from '../config/companyAccess';

export { FREE_COMPANY_DM_LIMIT };

const monthKey = () => {
 const d = new Date();
 return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Can this account start a NEW conversation?
 * Members: always. Companies: partner = unlimited, free = allowance.
 */
export const getOutreachStatus = async (userData, uid) => {
 // Members are never limited.
 if (!userData?.isCompany) {
 return { limited: false, remaining: Infinity, isCompany: false, partner: false };
 }

 const caps = companyCapabilities(userData);
 if (caps.unlimitedOutreach) {
 return { limited: false, remaining: Infinity, isCompany: true, partner: true };
 }

 let used = 0;
 try {
 const snap = await getDoc(doc(db, 'outreach', `${uid}_${monthKey()}`));
 if (snap.exists()) used = snap.data().count || 0;
 } catch (_) { /* fail open: never block on a read error */ }

 const remaining = Math.max(0, caps.outreachLimit - used);
 return {
 limited: remaining <= 0,
 remaining,
 used,
 limit: caps.outreachLimit,
 isCompany: true,
 partner: false,
 };
};

/** Count one new outbound conversation. No-op for members and partners. */
export const recordOutreach = async (userData, uid) => {
 if (!userData?.isCompany) return;
 if (companyCapabilities(userData).unlimitedOutreach) return;

 const ref = doc(db, 'outreach', `${uid}_${monthKey()}`);
 try {
 const snap = await getDoc(ref);
 if (snap.exists()) {
 await updateDoc(ref, { count: increment(1), updatedAt: serverTimestamp() });
 } else {
 await setDoc(ref, {
 recruiterId: uid, month: monthKey(), count: 1, createdAt: serverTimestamp(),
 });
 }
 } catch (e) {
 console.error('outreach counter failed:', e); // never block the message
 }
};

// Job posting is unlimited and free for everyone, posting a role is how a
// company discovers our talent is worth paying for.
export const FREE_JOB_POST_LIMIT = Infinity;
export const getJobPostStatus = async () => ({ limited: false, remaining: Infinity });
export const recordJobPost = async () => {};
