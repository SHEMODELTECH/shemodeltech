// src/config/premium.js
//
// PREMIUM IS BUILT BUT PAYMENTS ARE OFF.
//
// Premium features work today for anyone an admin grants Premium to
// (Admin > Users > Grant premium). Checkout stays off until PREMIUM_PAYMENTS_ON
// is true and payment links are set; until then, "Get Premium" buttons invite
// people to contact the team instead.
//
// Business model: Premium is a flat monthly subscription. For mentors who sell
// courses, She Model Tech takes no percentage of course sales.
//
// Premium status lives on the user document:
//   users/{uid}.premium = { active: true, since, until (optional), grantedBy, plan }
// Only admins can set it (Firestore rules block self-granting).

export const PREMIUM_PAYMENTS_ON = false;

export const PREMIUM_PAYMENT_LINK = process.env.REACT_APP_PREMIUM_PAYMENT_LINK || null;

// Is this profile Premium right now?
export const isPremium = (profile) => {
  const p = profile?.premium;
  if (!p?.active) return false;
  if (p.until && new Date(p.until) < new Date()) return false;
  return true;
};

// Mentors get featured placement free.
export const isMentorProfile = (profile) => !!profile?.isTeacher || (profile?.mentorApprovedCourses || 0) > 0;

// Featured on the Talent Board: Premium members, and mentors for free.
export const isFeaturedTalent = (profile) => isPremium(profile) || isMentorProfile(profile);

// Companies: verification is free; Premium adds the "Verified Partner" badge.
export const isVerifiedPartner = (profile) => !!profile?.isCompany && !!profile?.isVerified && isPremium(profile);

export const PREMIUM_FEATURES = {
  companies: [
    ['Verified Partner badge', 'A highlighted badge on your profile, jobs, and projects (verification itself stays free).'],
    ['Post jobs', 'Advertise full-time, part-time, contract, and internship roles on the She Model Tech Jobs board.'],
    ['Featured projects and jobs', 'Your projects and jobs appear at the top of their lists with a Featured tag.'],
    ['In-app promotion', 'Your jobs and projects are promoted on members\u2019 dashboards.'],
    ['Priority support', 'Message the She Model Tech team directly, and your requests are handled first.'],
  ],
  members: [
    ['Featured on the Talent Board', 'Appear at the top of the Talent Board with a Featured tag. Free for mentors.'],
    ['AI-powered top project and job matches', 'Personal recommendations for the jobs and projects that fit you best.'],
    ['Priority support', 'Message the She Model Tech team directly, and your requests are handled first.'],
  ],
  mentors: [
    ['Featured courses and instructor profile', 'Your courses and profile are featured in Learning. Free for all mentors.'],
    ['Featured on the Talent Board', 'Free for all mentors.'],
    ['Sell courses', 'Set your own course prices and keep every sale. Premium is a flat monthly subscription; She Model Tech takes no commission per course. (Coming when course payments open.)'],
  ],
};
