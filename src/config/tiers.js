// src/config/tiers.js
// Company tiers: Supporter < Partner < Champion. Set by admins in Admin → Users.
// They replace the old single "Premium". While the "Company tiers" switch in
// Admin → Launch settings is off, companies keep today's free access.

export const TIERS = ['supporter', 'partner', 'champion'];
export const TIER_LABEL = { supporter: 'Supporter', partner: 'Partner', champion: 'Champion' };
const RANK = { supporter: 1, partner: 2, champion: 3 };

// Payment links (Vercel env), used when "Tier payments" is on.
export const TIER_PAYMENT_LINKS = {
  supporter: process.env.REACT_APP_TIER_SUPPORTER_LINK || null,
  partner: process.env.REACT_APP_TIER_PARTNER_LINK || null,
  champion: process.env.REACT_APP_TIER_CHAMPION_LINK || null,
};

const toMs = (v) => {
  if (!v) return null;
  if (typeof v.toMillis === 'function') return v.toMillis();
  if (v.seconds) return v.seconds * 1000;
  const t = new Date(v).getTime();
  return Number.isNaN(t) ? null : t;
};

// The company's active tier ('supporter' | 'partner' | 'champion'), or null.
export const companyTier = (profile) => {
  const t = profile?.companyTier;
  if (!RANK[t]) return null;
  const until = toMs(profile.companyTierUntil);
  if (until && until < Date.now()) return null;
  return t;
};
export const tierRank = (profile) => RANK[companyTier(profile)] || 0;

// What each tier includes (minimum tier for each perk).
export const PERKS = [
  ['postJobs', 'supporter', 'Post jobs'],
  ['talentBoard', 'supporter', 'Full Talent Board with unlimited messaging'],
  ['verifiedBadge', 'supporter', 'Verified Partner badge'],
  ['sponsorRecognition', 'supporter', 'Sponsor recognition in the app'],
  ['summitTable', 'supporter', 'Summit exhibitor table (request)'],
  ['featuredJobs', 'partner', 'Featured jobs'],
  ['summitWorkshop', 'partner', 'Host a Summit workshop (request)'],
  ['summitPanel', 'partner', 'Summit panel seat (sponsored session, approved by She Model Tech)'],
  ['proposeChallenge', 'partner', 'Propose a challenge for a She Model Tech cohort'],
  ['summitSpeaker', 'champion', 'Summit speaking slot (sponsored session, approved by She Model Tech)'],
  ['prioritySupport', 'champion', 'Priority support'],
  ['promotion', 'champion', 'In-app promotion (featured placement)'],
];
const PERK_MIN = Object.fromEntries(PERKS.map(([k, t]) => [k, RANK[t]]));

/**
 * Does this company have a perk?
 * tiersOn: the "Company tiers" launch switch. While off, access perks (the
 * Talent Board and messaging) stay open as today; tier-only extras stay off.
 */
export const hasPerk = (profile, perk, tiersOn) => {
  if (['admin', 'editor'].includes(profile?.role)) return true;
  if (!tiersOn) return perk === 'talentBoard';
  return tierRank(profile) >= (PERK_MIN[perk] || 99);
};

export const perksFor = (tier) => PERKS.filter(([, t]) => RANK[t] <= RANK[tier]).map(([, , label]) => label);

// Free companies (no tier, tiers on): new conversations per UTC month.
export const FREE_MESSAGE_LIMIT = 5;
