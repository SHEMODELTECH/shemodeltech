// src/config/premium.js
//
// PREMIUM IS BUILT BUT PAYMENTS ARE OFF.
//
// Premium features work today for anyone an admin grants Premium to
// (Admin > Users > Grant premium). Checkout stays off until PREMIUM_PAYMENTS_ON
// is true and payment links are set; until then, "Get Premium" buttons invite
// people to contact the team instead.
//
// Premium is for companies only. Members get every career tool free; mentors
// get featured placement and priority support free. Courses are never sold.
//
// Premium status lives on the user document:
//   users/{uid}.premium = { active: true, since, until (optional), grantedBy, plan }
// Only admins can set it (Firestore rules block self-granting).

// Online Premium payments are now switched on in Admin → Launch settings
// (Company Premium payments). This constant is kept only for reference.
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

// Featured on the Talent Board: mentors, for the extra work they give (free).
// Everyone else is ranked on their skills and badges; featuring can't be bought.
export const isFeaturedTalent = (profile) => isMentorProfile(profile);

// Priority support: companies with Premium, and every mentor (free).
export const hasPrioritySupport = (profile) => isMentorProfile(profile) || (!!profile?.isCompany && isPremium(profile));

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
  // Free for every mentor, as thanks for the extra work they give.
  mentors: [
    ['Featured courses and mentor profile', 'Your courses and profile are featured in Learning.'],
    ['Featured on the Talent Board', 'Mentors appear at the top of the Talent Board.'],
    ['Priority support', 'Message the She Model Tech team directly, and your requests are handled first.'],
  ],
};
