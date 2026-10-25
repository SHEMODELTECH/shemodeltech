// src/utils/badgeLinkedIn.js
// "Add to LinkedIn" for a badge: opens LinkedIn's Add license or certification
// form, already filled in (the badge email uses the same wording).
import { BRAND } from '../config/brand';
export const badgeLinkedInUrl = (trackName, level) => {
  const now = new Date();
  const p = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: `${trackName} ${level} badge, She Model Tech`,
    // organizationId links the entry to our LinkedIn page, so our logo shows.
    organizationId: BRAND.linkedinOrgId,
    issueYear: String(now.getFullYear()),
    issueMonth: String(now.getMonth() + 1),
    certUrl: 'https://shemodeltech.com/badges',
  });
  return `https://www.linkedin.com/profile/add?${p.toString()}`;
};
