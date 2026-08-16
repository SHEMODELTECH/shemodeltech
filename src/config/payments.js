// src/config/payments.js
//
// PAYMENTS: MONEY IN ONLY.
//
// Stripe handles what companies pay US:
//   - Talent Access subscriptions (recurring, monthly or annual)
//   - Cohort sponsorships (one-off)
//
// Stripe deliberately does NOT handle what companies pay MEMBERS.
//
// WHY NOT — this is the important part
// On a company-hosted cohort, the company pays members DIRECTLY and we never
// touch the funds. That is not a limitation, it is the thing that keeps the
// whole structure safe:
//
//   1. If we collected a company's money and paid it out to members, the
//      substance becomes "company bought labour, platform was the middleman."
//      That is the staffing-intermediary position we deliberately avoided,
//      and it brings worker-classification exposure with it.
//   2. Moving other people's money is money transmission. Doing it properly
//      means Stripe Connect, per-member KYC onboarding, and a materially
//      heavier compliance surface.
//
// So: companies pay members directly, members confirm receipt on-platform,
// disputes go to the dispute room. We stay the venue.
//
// STIPENDS ARE DIFFERENT. Sponsorship money is paid to the nonprofit, and the
// nonprofit pays a training stipend to a participant. That is our own money
// going out, not a passthrough — legally a different thing. Stipends are paid
// manually (bank transfer) until volume justifies Stripe Connect.

export const PAYMENT_ENABLED = true;

export const CURRENCY = 'usd';

// Talent Access. Set the real Stripe Price IDs in env once created in the
// Stripe dashboard — never hardcode live IDs in the repo.
export const PLANS = {
  TALENT_ACCESS_MONTHLY: {
    id: 'talent_access_monthly',
    name: 'Talent Access',
    interval: 'month',
    priceId: process.env.REACT_APP_STRIPE_PRICE_MONTHLY || null,
    amount: 149,
    features: [
      'Search the full Talent Board of verified graduates',
      'Filter by badge track, level and completed projects',
      'See verified evidence — repositories, commit history, certificates',
      'Unlimited direct messaging',
      'Save and organise candidates',
      'Host your own paid projects',
    ],
  },
  TALENT_ACCESS_ANNUAL: {
    id: 'talent_access_annual',
    name: 'Talent Access (annual)',
    interval: 'year',
    priceId: process.env.REACT_APP_STRIPE_PRICE_ANNUAL || null,
    amount: 1490, // two months free
    badge: 'Save 17%',
    features: null, // same as monthly
  },
};

// Sponsorship is quoted per TEAM, not per cohort — a far easier first sale,
// and a cohort can carry several sponsors.
export const SPONSORSHIP_TIERS = [
  {
    id: 'sponsor_team',
    name: 'Sponsor a team',
    amount: 5000,
    blurb: 'Funds stipends for one team of ~5 women through an 8-week cohort.',
  },
  {
    id: 'sponsor_two_teams',
    name: 'Sponsor two teams',
    amount: 9500,
    blurb: 'Two teams, ~10 women.',
  },
  {
    id: 'sponsor_cohort',
    name: 'Sponsor a full cohort',
    amount: 27000,
    blurb: 'All six teams, ~30 women, with headline acknowledgement.',
  },
];

export const getPlan = (id) =>
  Object.values(PLANS).find(p => p.id === id) || null;

export const getSponsorshipTier = (id) =>
  SPONSORSHIP_TIERS.find(t => t.id === id) || null;

export const formatPrice = (amount, interval) => {
  const s = `$${Number(amount).toLocaleString('en-US')}`;
  return interval ? `${s}/${interval}` : s;
};
