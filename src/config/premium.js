// src/config/premium.js
// The old single "Premium" plan has been replaced by company tiers
// (Supporter, Partner, Champion) in src/config/tiers.js. These helpers are kept
// so older screens keep working, and now read the tier instead.
import { companyTier } from './tiers';

export const isPremium = (profile) => !!profile?.isCompany && !!companyTier(profile);

// Mentors are featured on the Talent Board and get priority support (free perks).
export const isMentorProfile = (profile) => !!profile?.isTeacher || (profile?.mentorApprovedCourses || 0) > 0;
export const isFeaturedTalent = (profile) => isMentorProfile(profile);
export const hasPrioritySupport = (profile) => isMentorProfile(profile) || (!!profile?.isCompany && companyTier(profile) === 'champion');

// The public Verified Partner badge: a verified company with any tier.
export const isVerifiedPartner = (profile) => !!profile?.isCompany && !!profile?.isVerified && !!companyTier(profile);
