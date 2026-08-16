// src/utils/profileCompletion.js
// Single source of truth for "is this user's profile complete enough to
// create or join a project". Mirrors the required fields enforced during
// onboarding so the gate stays consistent everywhere.
//
// Required for everyone: a display name and at least one selected interest.
// Individuals additionally need: experience level + a LinkedIn URL.
// Companies additionally need: company name + a (business) company email.

const BLOCKED_EMAIL_DOMAINS = [
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in',
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
  'aol.com', 'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'proton.me', 'zoho.com', 'yandex.com',
  'mail.com', 'gmx.com', 'fastmail.com', 'tutanota.com',
];

const isBusinessEmail = (email) => {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  return !BLOCKED_EMAIL_DOMAINS.includes(domain);
};

const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

// Returns { complete: boolean, missing: string[] }.
// Pass the user's Firestore user-doc data.
//
// We intentionally gate on the ESSENTIAL fields only - the ones truly needed to
// participate (a name, plus the account-type's core identifier). Country and
// LinkedIn are encouraged but should not block someone from applying or posting,
// which previously caused valid, onboarded users to be stuck on "complete your profile".
export const checkProfileComplete = (userData) => {
  const missing = [];
  if (!userData) return { complete: false, missing: ['your profile'] };

  // Must have a display name.
  if (!nonEmpty(userData.displayName)) missing.push('your name');

  if (userData.isCompany) {
    const cp = userData.companyProfile || {};
    const companyName = cp.companyName || userData.companyName;
    if (!nonEmpty(companyName)) missing.push('company name');
  } else {
    // For individuals, require at least one interest OR an experience level.
    const hasInterests = Array.isArray(userData.interests) && userData.interests.length > 0;
    const hasExperience = nonEmpty(userData.experienceLevel);
    if (!hasInterests && !hasExperience) missing.push('your interests or experience level');
  }

  // Complete if the essentials are present and onboarding wasn't explicitly left undone.
  const complete = missing.length === 0 && (userData.onboardingComplete !== false);
  return { complete, missing };
};
