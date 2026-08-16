// src/config/companyAccess.js
//
// WHO PAYS WHAT
//
// Women pay nothing. Ever. They are the supply, and metering supply to
// monetise demand is backwards.
//
// Companies pay. Two independent products, deliberately NOT bundled:
//
//   1. SPONSORSHIP  — one-off, per team. Funds member stipends.
//                     Sponsors WATCH, ACKNOWLEDGE and RECRUIT.
//                     They never DIRECT, REVIEW or OWN the work.
//   2. TALENT ACCESS — recurring annual. Talent Board search, filtering,
//                     verified evidence, outreach at volume, saved candidates.
//
// A company can buy either without the other.
//
// WHAT STAYS FREE FOR COMPANIES, ON PURPOSE
// Activity Wall, claps, posting roles, and a small allowance of direct
// messages. An empty platform is worth nothing to anyone, and blocking a
// company from reaching a member would block the member's opportunity — which
// is the opposite of the point. We sell TOOLING (search, filtering, evidence,
// volume), never permission to see that our members exist.
//
// VERIFICATION IS NOT SOLD
// The verified badge is how a member can trace who she is talking to. It is
// earned by submitting company registration details and is FREE. If it were
// purchased, a scammer would simply stay unverified while a legitimate small
// company looked untrustworthy — inverting the safety signal.

import { MEMBERSHIP_ENFORCED, isInTrial } from './membership';

export const COMPANY_TIER = {
  FREE: 'free',
  PARTNER: 'partner', // active Talent Access subscription
};

// Free companies get a small outreach allowance so a real opportunity is
// never blocked. Volume outreach is the paid product.
export const FREE_COMPANY_DM_LIMIT = 5;

export const isPartner = (company) => {
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
    // Always free
    canPostRoles: true,
    canPostToWall: true,
    canReactToPosts: true,
    canReplyToMembers: true,        // never block a reply to an inbound message
    canSponsorCohort: true,
    // Paid tooling
    canSearchTalentBoard: partner,
    canFilterByBadge: partner,
    canViewVerifiedEvidence: partner, // repos, commit history, certificates
    canSaveCandidates: partner,
    unlimitedOutreach: partner,
    outreachLimit: partner ? Infinity : FREE_COMPANY_DM_LIMIT,
  };
};

// Feature list for the partner pitch page.
export const PARTNER_FEATURES = [
  'Search the full Talent Board of verified graduates',
  'Filter by badge track, level, and completed projects',
  'See verified evidence — repositories, commit history, certificates',
  'Unlimited direct messaging to members',
  'Save and organise candidates',
  'Priority support',
];

export const FREE_FEATURES = [
  'Post roles and opportunities',
  'Post to the community Activity Wall',
  `Message up to ${FREE_COMPANY_DM_LIMIT} members`,
  'Reply to any member who contacts you',
  'Sponsor a cohort team',
];
