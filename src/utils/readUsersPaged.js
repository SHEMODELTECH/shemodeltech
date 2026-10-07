// src/utils/readUsersPaged.js
// Staff sends (announcements, event invites): read users/ a page at a time
// (ordered by document ID, so no extra index) instead of one huge getDocs, and
// keep only the fields the send needs so the full profiles don't sit in memory.
import { collection, documentId, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
import { db } from '../firebase/config';

const PAGE = 500;

// Returns [{ uid, email, isCompany, onboardingComplete, isMinor, emailPreferences }].
// onProgress(readSoFar) is called after each page.
export const readUsersForSending = async (onProgress) => {
  const out = [];
  let last = null;
  for (;;) {
    const q = last
      ? query(collection(db, 'users'), orderBy(documentId()), startAfter(last), limit(PAGE))
      : query(collection(db, 'users'), orderBy(documentId()), limit(PAGE));
    // eslint-disable-next-line no-await-in-loop
    const snap = await getDocs(q);
    snap.docs.forEach((d) => {
      const u = d.data() || {};
      out.push({
        uid: d.id,
        email: u.email,
        isCompany: u.isCompany,
        onboardingComplete: u.onboardingComplete,
        isMinor: u.isMinor,
        emailPreferences: u.emailPreferences ? { reminders: u.emailPreferences.reminders } : undefined,
      });
    });
    if (onProgress) onProgress(out.length);
    if (snap.docs.length < PAGE) break;
    last = snap.docs[snap.docs.length - 1];
  }
  return out;
};
