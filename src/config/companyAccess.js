// src/config/companyAccess.js
//
// WHO PAYS WHAT
//
// Women pay nothing. Ever. They are the supply, and metering supply to
// monetise demand is backwards.
//
// Companies pay. Two independent products, deliberately NOT bundled:
//
// 1. SPONSORSHIP, one-off, per team. Funds member stipends.
// Sponsors WATCH, ACKNOWLEDGE and RECRUIT.
// They never DIRECT, REVIEW or OWN the work.
// 2. TALENT ACCESS, recurring annual. Talent Board search, filtering,
// verified evidence, outreach at volume, saved candidates.
//
// A company can buy either without the other.
//
// WHAT STAYS FREE FOR COMPANIES, ON PURPOSE
// Activity Wall, claps, posting roles, and a small allowance of direct
// messages. An empty platform is worth nothing to anyone, and blocking a
// company from reaching a member would block the member's opportunity, which
// is the opposite of the point. We sell TOOLING (search, filtering, evidence,
// volume), never permission to see that our members exist.
//
// VERIFICATION IS NOT SOLD
// The verified badge is how a member can trace who she is talking to. It is
// earned by submitting company registration details and is FREE. If it were
// purchased, a scammer would simply stay unverified while a legitimate small
// company looked untrustworthy, inverting the safety signal.

import { MEMBERSHIP_ENFORCED, isInTrial } from './membership';

export const COMPANY_TIER = {
  FREE: 'free',
  PARTNER: 'partner', // active Talent Access subscription
};

// Free companies get a small outreach allowance so a real opportunity is
// never blocked. Volume outreach is the paid product.
export const FREE_COMPANY_DM_LIMIT = 5;

export const isPartner = (company) => {
  // Admins and editors always have full capabilities - they need to exercise
  // every paid surface before launch.
  if (company?.role === 'admin' || company?.role === 'editor') return true;
  // While membership is dormant, every company has full access. One flag in
  // membership.js turns enforcement on everywhere.
  if (!MEMBERSHIP_ENFORCED) return true;
  if (!company) return false;
  // Early-bird trial: full access, no card, clock starts at enforcement.
  if (isInTrial(company)) return true;
  if (company.tier === COMPANY_TIER.PARTNER) {
    // An expired subscription silently downgrades to free.
    if (!company.partnerUntil) return true;
    return new Date(company.partnerUntil) >= new Date();
  }
  return false;
};

/**
 * Capabilities, resolved from a company profile.
 * While MEMBERSHIP_ENFORCED is false, everything below resolves to true and
 * outreach is unlimited - no company is ever blocked or asked to pay.
 */
export const companyCapabilities = (company) => {
  const partner = isPartner(company);
  return {
    tier: partner ? COMPANY_TIER.PARTNER : COMPANY_TIER.FREE,
    // Free for every company, permanently (not tied to any plan):
    // the Talent Board, messaging, posting paid projects, and outreach.
    canPostToWall: true,
    canReactToPosts: true,
    canReplyToMembers: true,
    canSponsorCohort: true,
    canSearchTalentBoard: true,
    canFilterByBadge: true,
    canViewVerifiedEvidence: true, // repos, commit history, certificates
    canSaveCandidates: true,
    unlimitedOutreach: true,
    outreachLimit: Infinity,
  };
};

// What's free on She Model Tech (for members and companies).
export const FREE_FEATURES = [
  'Unlimited access to the Talent Board',
  'Posting paid projects (after free company verification)',
  'Unlimited messaging',
  'Unlimited collaboration on paid and free projects',
  'Unlimited certificates of completion and badges on projects',
  'Access to She Model Tech self-paced courses and mentor courses',
  'Unlimited freelance work: paid projects can hire a single person',
];

// Kept for when optional paid extras are introduced; nothing above depends on it.
export const PARTNER_FEATURES = ['Priority support'];
