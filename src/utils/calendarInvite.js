// src/utils/calendarInvite.js
//
// One-click "Schedule interview", opens Google Calendar with the event
// already filled in: title, time, description, and the applicant added as a
// guest. The reviewer adds Google Meet with one click and hits Save; Google
// emails the invitation.
//
// WHY A LINK AND NOT THE CALENDAR API
// The API route would create the event (and the Meet link) automatically, but
// it needs a calendar OAuth scope. That means a scarier consent screen for
// every user at signup, token storage and refresh, and a real chunk of work, // to save a couple of clicks on roughly six interviews per 8-week cycle.
// A pre-filled template URL gets the same outcome with no OAuth surface at
// all. Revisit if you're ever running 30 interviews a cycle.

const pad = (n) => String(n).padStart(2, '0');

/** Google wants UTC basic format: 20260815T140000Z */
const toGoogleUTC = (date) => {
 const d = new Date(date);
 return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`
 + `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
};

/**
 * Build a Google Calendar "create event" URL.
 *
 * @param {string} title
 * @param {Date|string} start
 * @param {number} durationMinutes
 * @param {string} details
 * @param {string[]} guests email addresses to invite
 * @param {string} location
 */
export const googleCalendarUrl = ({
 title, start, durationMinutes = 30, details = '', guests = [], location = '',
}) => {
 if (!start) return null;
 const startDate = new Date(start);
 if (Number.isNaN(startDate.getTime())) return null;
 const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

 const params = new URLSearchParams({
 action: 'TEMPLATE',
 text: title,
 dates: `${toGoogleUTC(startDate)}/${toGoogleUTC(endDate)}`,
 details,
 ctz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
 });
 if (location) params.set('location', location);
 // `add` invites guests, Google emails them when the event is saved.
 if (guests.length) params.set('add', guests.filter(Boolean).join(','));

 return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/** Pre-filled invite for a lead interview. */
export const leadInterviewInvite = ({ applicant, projectTitle, when, durationMinutes = 30 }) =>
 googleCalendarUrl({
 title: `She Model Tech, lead interview: ${applicant.applicantName}`,
 start: when,
 durationMinutes,
 guests: [applicant.applicantEmail],
 details: [
 `Lead interview for "${projectTitle}".`,
 '',
 `Applicant: ${applicant.applicantName}`,
 applicant.availabilityHours ? `Availability: ${applicant.availabilityHours}h/week` : '',
 '',
 'Add Google Meet to this event before saving, then paste the Meet link',
 'back into the review screen so she gets it in her notification.',
 ].filter(Boolean).join('\n'),
 });

/** Pre-filled invite for a company interviewing a member. */
export const companyInterviewInvite = ({ applicantEmail, applicantName, projectTitle, when }) =>
 googleCalendarUrl({
 title: `Interview: ${applicantName}, ${projectTitle}`,
 start: when,
 durationMinutes: 30,
 guests: [applicantEmail],
 details: `Interview for "${projectTitle}", arranged via She Model Tech.`,
 });
