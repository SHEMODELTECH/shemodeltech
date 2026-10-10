// src/utils/badgeLinkedIn.js
// "Add to LinkedIn" for a badge: opens LinkedIn's Add license or certification
// form, already filled in (the badge email uses the same wording).
export const badgeLinkedInUrl = (trackName, level) => {
  const now = new Date();
  const p = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: `${trackName} ${level} badge, She Model Tech`,
    organizationName: 'SHE MODEL TECH Inc.',
    issueYear: String(now.getFullYear()),
    issueMonth: String(now.getMonth() + 1),
    certUrl: 'https://shemodeltech.com/badges',
  });
  return `https://www.linkedin.com/profile/add?${p.toString()}`;
};
