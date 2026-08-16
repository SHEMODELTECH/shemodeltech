// src/config/membership.js
//
// MEMBERSHIP IS BUILT BUT DORMANT.
//
// Everything — tiers, gating, checkout, activation — is fully implemented, but
// ENFORCEMENT is off. Flip ONE flag when you're ready to charge, and the whole
// system wakes up. Nothing else needs changing.
//
// While dormant:
//   - Every company gets full Talent Access features, free.
//   - Pricing pages show "coming soon" instead of a checkout button.
//   - Nobody is ever blocked or asked to pay.
//
// This is deliberate. You're spending this year building cohorts and
// graduates. A paywall with nothing behind it drives companies away before
// you have anything to sell them.
//
// ── HOW ACTIVATION WORKS WHEN YOU TURN IT ON ──────────────────────────
//
// You'll paste a payment link (Stripe Payment Link, Paystack, Flutterwave —
// whatever you use) and set its redirect URL to:
//
//     https://shemodeltech.com/partner/activate
//
// SECURITY WARNING — READ THIS
// A redirect URL is NOT proof of payment. It's just a web address: anyone who
// sees it once can share it, bookmark it, or guess it, and would get premium
// free. Auto-granting access on arrival would mean your paid tier is
// effectively public within a week of the first sale.
//
// So the activation page does NOT grant access. It records a CLAIM — who they
// are and their payment reference — and notifies you. You confirm the payment
// landed in your account, then activate with one click from the admin panel.
//
// At your volume (a handful of companies) that's seconds of work per sale, and
// it is airtight. When volume justifies it, switch ACTIVATION_MODE to
// 'stripe_webhook', which verifies payment cryptographically with no manual
// step (see api/payments/stripe-webhook.js — already built).

// ── THE ONE FLAG ──────────────────────────────────────────────────────
// false = everything free, nothing gated, no payment prompts anywhere.
// true  = tiers enforced, checkout live.
export const MEMBERSHIP_ENFORCED = false;

// 'manual'         — activation claims reviewed and approved by an admin.
// 'stripe_webhook' — Stripe verifies payment automatically (needs Stripe keys).
export const ACTIVATION_MODE = 'manual';

// Paste your payment link here when you go live. Leave null to hide the
// buttons entirely.
export const PAYMENT_LINKS = {
  monthly: process.env.REACT_APP_PAYMENT_LINK_MONTHLY || null,
  annual: process.env.REACT_APP_PAYMENT_LINK_ANNUAL || null,
  sponsorship: process.env.REACT_APP_PAYMENT_LINK_SPONSOR || null,
};

// ── EARLY BIRD TRIAL ──────────────────────────────────────────────────
// Every company gets a free trial when charging begins.
//
// IMPORTANT: the clock starts when ENFORCEMENT starts, not at signup.
// A company joining today would otherwise burn its trial during a period
// when everything was free anyway - so it would "expire" while nothing was
// gated, and they'd have had no real trial at all when charging began.
//
// So: while dormant, no trial is consumed. On the day you flip
// MEMBERSHIP_ENFORCED to true, set ENFORCEMENT_START_DATE below. Every
// existing company then gets TRIAL_MONTHS from that date; companies that
// join afterwards get TRIAL_MONTHS from their signup.
export const TRIAL_MONTHS = 3;

// Set this to the ISO date you turn enforcement on, e.g. '2027-01-15'.
// Leave null while dormant.
export const ENFORCEMENT_START_DATE = null;

// Shown to companies so the free period never reads as permanent - being
// explicit now is what makes charging later feel expected rather than like a
// bait and switch.
export const TRIAL_NOTICE = {
  badge: 'Early access',
  short: `Free early access · ${TRIAL_MONTHS} months on us when paid plans begin`,
  body: 'Every feature is free while we build our first cohorts of verified '
      + `graduates. When paid plans begin, you'll get ${TRIAL_MONTHS} months free `
      + 'before anything is charged.',
};

/**
 * When does this company's trial end?
 * Returns null while dormant (nothing is being consumed yet).
 */
export const trialEndsAt = (company) => {
  if (!MEMBERSHIP_ENFORCED || !ENFORCEMENT_START_DATE) return null;
  // Whichever is later: enforcement day, or the day they joined.
  const enforcement = new Date(ENFORCEMENT_START_DATE);
  const joined = company?.createdAt
    ? new Date(company.createdAt.seconds ? company.createdAt.seconds * 1000 : company.createdAt)
    : enforcement;
  const start = joined > enforcement ? joined : enforcement;
  const end = new Date(start);
  end.setMonth(end.getMonth() + TRIAL_MONTHS);
  return end;
};

/** Is this company inside its free trial right now? */
export const isInTrial = (company) => {
  const end = trialEndsAt(company);
  if (!end) return false;
  return new Date() <= end;
};

export const trialDaysLeft = (company) => {
  const end = trialEndsAt(company);
  if (!end) return null;
  return Math.max(0, Math.ceil((end - new Date()) / 86400000));
};

export const ACTIVATION_STATUS = {
  CLAIMED: 'claimed',     // company says they paid; awaiting confirmation
  ACTIVATED: 'activated',
  REJECTED: 'rejected',   // no matching payment found
};

/**
 * Should this feature be gated right now?
 * Returns false while dormant, so every caller behaves as if everyone is a
 * partner without needing to know about the flag.
 */
export const isGatingActive = () => MEMBERSHIP_ENFORCED;

/** Copy for pricing surfaces while dormant. */
export const DORMANT_NOTICE = {
  badge: 'Early access',
  title: 'Free early access',
  body: 'We\u2019re building our first cohorts of verified graduates. Every feature '
      + 'below is free for your company while we do. When paid plans begin, '
      + `you\u2019ll get ${TRIAL_MONTHS} months free before anything is charged.`,
};
