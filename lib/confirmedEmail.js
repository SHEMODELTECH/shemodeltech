// lib/confirmedEmail.js
// Server-side copy of isVerified() in firestore.rules: contacting other people
// (emails, push notifications) needs a confirmed email address. Exempt:
//   - members whose users doc has no createdAt, a createdAt that isn't a
//     timestamp, or one before 10 Oct 2026 (grandfathered),
//   - She Model Tech staff (role admin or editor).
// Google sign-ins are already confirmed (email_verified in the ID token).
// Keep this in step with isGrandfathered() / isVerified() in firestore.rules.
const admin = require('./firebaseAdmin');

const CUTOFF_MS = Date.UTC(2026, 9, 10); // 10 Oct 2026 00:00 UTC
const STAFF_ROLES = ['admin', 'editor'];

const toMillis = (v) => {
  if (!v) return null;
  if (typeof v.toMillis === 'function') return v.toMillis();
  if (v instanceof Date) return v.getTime();
  return null; // not a timestamp: the rules treat it as grandfathered
};

/**
 * @param {object} decoded   verified Firebase ID token ({ uid, email_verified, ... })
 * @param {object|null} [userData]  the caller's users doc data if already read
 *   (null = the doc doesn't exist; undefined = read it here)
 * @returns {Promise<boolean>}
 */
async function isConfirmedEmail(decoded, userData) {
  if (!decoded || !decoded.uid) return false;
  if (decoded.email_verified === true) return true;
  let data = userData;
  if (data === undefined) {
    const snap = await admin.firestore().collection('users').doc(decoded.uid).get();
    data = snap.exists ? snap.data() : null;
  }
  if (!data) return false; // no profile: same as hasProfile() == false
  if (STAFF_ROLES.includes(data.role)) return true;
  const c = data.createdAt;
  if (c == null) return true;
  const ms = toMillis(c);
  if (ms == null) return true;
  return ms < CUTOFF_MS;
}

/** Replies 403 and returns false when the caller hasn't confirmed their email. */
async function requireConfirmedEmail(decoded, res, userData) {
  if (await isConfirmedEmail(decoded, userData)) return true;
  res.status(403).json({ success: false, error: 'Please confirm your email address first (check your inbox for the link).' });
  return false;
}

module.exports = { isConfirmedEmail, requireConfirmedEmail, CUTOFF_MS, STAFF_ROLES };
