// src/config/brand.js
// Single source of truth for brand identity.
//
// Everything the platform shows publicly - name, domain, support address,
// social handles, logo paths - is defined here. Change a value once and it
// updates everywhere.
//
// ── STATUS ─────────────────────────────────────────────────────────────
// domain / url : shemodeltech.com, LIVE.
// IMPORTANT: shemodeltech.com must also be added as an Authorized Domain
// in the Firebase Console (Authentication → Settings → Authorized domains),
// or sign-in, email verification and password reset will all fail.
// supportEmail : shemodeltech@gmail.com - LIVE. A branded address on the new
// domain (e.g. hello@shemodeltech.com) would look stronger to partners.
// socials : still the old Ascivan LinkedIn pages. Update when the new
// accounts exist.
// ───────────────────────────────────────────────────────────────────────

export const BRAND = {
  // Display name
  name: 'She Model Tech',
  shortName: 'She Model Tech',

  // Legal / footer entity line
  legalName: 'She Model Tech',

  // Live domain.
  domain: 'shemodeltech.com',
  url: 'https://shemodeltech.com',

  // Support inbox.
  supportEmail: 'shemodeltech@gmail.com',

  // Social handles. TODO: update once the new accounts exist.
  // GitHub organisation - teams add us as a collaborator on their project repo.
  github: 'https://github.com/SHEMODELTECH',
  githubOrg: 'SHEMODELTECH',

  socials: {
    linkedin: 'https://www.linkedin.com/company/ascivanhq/',
  },

  // Logo assets
  logo: {
    // Square mark - navbars, avatars, app icons, favicons
    mark: '/Images/512X512.png',
    // Full horizontal lockup (mark + wordmark) - hero, footer, emails
    full: '/Images/she-model-tech-logo.png',
  },

  // Tagline, as it appears on the logo lockup.
  tagline: 'Achieve · Ascend · Advance',
  taglineWords: ['Achieve', 'Ascend', 'Advance'],

  // Brand palette, sampled from the logo and the brand shape assets.
  colors: {
    pink: '#F544CB', // primary - tagline "Connect", wave
    pinkDeep: '#F72585', // logo hair
    magenta: '#EB48D5', // wave shape
    purple: '#8948EB', // burst shape, logo accent
    green: '#00E78E', // tagline accent
    mint: '#48EB94', // bar + arc shapes
    mintPale: '#E5F2E4', // soft star fill / tinted backgrounds
    ink: '#353331', // outlines and body text
  },

  // Decorative brand shapes (public/Images/brand/)
  shapes: {
    starMint: '/Images/brand/shape-star-mint.png',
    burstPurple: '/Images/brand/shape-burst-purple.png',
    barGreen: '/Images/brand/shape-bar-green.png',
    arcGreen: '/Images/brand/shape-arc-green.png',
    sparkle: '/Images/brand/shape-sparkle.png',
    wavePink: '/Images/brand/shape-wave-pink.png',
  },

  // Photography
  images: {
    teamHero: '/Images/brand/team-hero.png',
  },
};

export default BRAND;
