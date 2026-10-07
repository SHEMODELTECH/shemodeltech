// src/config/tiers.js
// Company tiers: Supporter < Champion. Set by admins in Admin → Users.
// (An older "Partner" tier is read as Champion, so nobody loses a perk.)
// They replace the old single "Premium". While the "Company tiers" switch in
// Admin → Launch settings is off, companies keep today's free access.

export const TIERS = ['supporter', 'champion'];
export const TIER_LABEL = { supporter: 'Supporter', partner: 'Champion', champion: 'Champion' };
const RANK = { supporter: 1, partner: 3, champion: 3 };

// Payment links (Vercel env), used when "Tier payments" is on.
export const TIER_PAYMENT_LINKS = {
  supporter: process.env.REACT_APP_TIER_SUPPORTER_LINK || null,
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
  return t === 'partner' ? 'champion' : t;
};
export const tierRank = (profile) => RANK[companyTier(profile)] || 0;

// What each tier includes (minimum tier for each perk).
export const PERKS = [
  ['postJobs', 'supporter', 'Post jobs'],
  ['talentBoard', 'supporter', 'Full Talent Board with unlimited messaging'],
  ['verifiedBadge', 'supporter', 'Verified company badge'],
  ['featuredJobs', 'champion', 'Featured jobs'],
  ['promotion', 'champion', 'In-app promotion (featured placement)'],
  ['prioritySupport', 'champion', 'Priority support'],
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
