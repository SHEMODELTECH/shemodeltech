// src/utils/emailVerification.js
// Confirmed email (anti-spam). firestore.rules (isVerified) only lets a member
// post, message and apply once her email is confirmed. Exempt: accounts whose
// profile was created before 2026-10-09 06:25 UTC (or has no createdAt), and staff.
// Google sign-ins are already confirmed.
//
// This file mirrors that rule for the app: who should see the "Confirm your
// email" notice, how to pick up a confirmation made in another tab (reload the
// user, then refresh the ID token so the database sees email_verified=true),
// and a friendly message when a write is refused because of it.
import { auth } from '../firebase/config';

// Same moment as timestamp.value(1791527100000) in firestore.rules (2026-10-09 06:25 UTC).
export const VERIFY_REQUIRED_FROM = 1791527100000;

export const CONFIRM_EMAIL_MESSAGE =
  'Please confirm your email first. Open the link we emailed you, then try again.';

const STAFF_ROLES = ['admin', 'editor'];

const toMillis = (v) => {
  if (!v) return null;
  if (typeof v.toMillis === 'function') return v.toMillis();
  if (v instanceof Date) return v.getTime();
  return null; // anything else: the rules treat it as grandfathered too
};

// Joined before the cut-off, or a profile with no (timestamp) createdAt.
export const isGrandfathered = (profile) => {
  const ms = toMillis(profile?.createdAt);
  return ms == null || ms < VERIFY_REQUIRED_FROM;
};

const usesPassword = (user) => (user?.providerData || []).some((p) => p?.providerId === 'password');

// Should this signed-in member confirm her email before posting/messaging/applying?
// `profile` is her users/{uid} doc (null while loading: answer false).
export const needsEmailConfirmation = (user, profile) => {
  if (!user || user.emailVerified || !usesPassword(user) || !profile) return false;
  if (STAFF_ROLES.includes(profile.role)) return false;
  return !isGrandfathered(profile);
};

// What the app last worked out for the signed-in member (set by
// EmailConfirmBanner once her profile loads). null = not known yet.
let knownNeedsConfirmation = null;
export const setKnownNeedsConfirmation = (v) => { knownNeedsConfirmation = v; };

// Reload the signed-in user; if her email is now confirmed, refresh the ID token
// so Firestore sees email_verified=true right away. Returns true when confirmed.
export const refreshEmailVerified = async () => {
  const u = auth.currentUser;
  if (!u) return false;
  try { await u.reload(); } catch (_) { /* offline: try again later */ }
  const cur = auth.currentUser;
  if (!cur?.emailVerified) return false;
  try { await cur.getIdToken(true); } catch (_) { /* next normal refresh picks it up */ }
  knownNeedsConfirmation = false;
  try { window.dispatchEvent(new Event('smt:email-verified')); } catch (_) {}
  return true;
};

const isPermissionDenied = (err) => {
  const code = String(err?.code || '');
  return code === 'permission-denied' || code.endsWith('/permission-denied')
    || /missing or insufficient permissions/i.test(String(err?.message || ''));
};

// Was this write refused because the member hasn't confirmed her email?
export const isConfirmEmailError = (err) => {
  if (!isPermissionDenied(err)) return false;
  const u = auth.currentUser;
  if (!u || u.emailVerified || !usesPassword(u)) return false;
  if (knownNeedsConfirmation != null) return knownNeedsConfirmation;
  // Profile not loaded yet: the account's creation time is a close stand-in.
  const created = Date.parse(u.metadata?.creationTime || '');
  return Number.isFinite(created) && created >= VERIFY_REQUIRED_FROM;
};

// The message to show for a failed write: the confirm-email hint when that's
// the reason, otherwise `fallback` (or the error's own message).
export const writeErrorMessage = (err, fallback) =>
  isConfirmEmailError(err)
    ? CONFIRM_EMAIL_MESSAGE
    : fallback || err?.message || 'Something went wrong. Please try again.';
