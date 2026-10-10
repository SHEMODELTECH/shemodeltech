// src/utils/noLinks.js
// Forms anyone can send (Contact us, Fund a cohort, Join the team) and events
// members host: no web links in the text, so nobody can slip a phishing link
// into a message the team opens. The database rules check the same thing
// (firestore.rules: noLink, safeProfileLink, safeJoinLink), so this is just the
// friendly message before sending.

// http:, https:, www., or a common web address followed by a path
// ("bit.ly/abc", "example.com/login"). Email addresses (name@example.com) and
// words like "Node.js/React" are fine.
const TLDS = 'com|net|org|io|ly|co|me|xyz|app|dev|info|biz|link|site|online|top|click|ru|cn|tk|gl|gd|cc|to|in|ng|uk|us';
const LINK = new RegExp(`(https?:|www\\.|[a-z0-9-]+\\.(${TLDS})\\/)`, 'i');
export const hasLink = (text) => LINK.test(String(text || ''));
export const NO_LINKS_MSG = 'Please remove any web links. For safety, we don’t accept links in this form.';

// Join the team: a profile on LinkedIn, GitHub, Behance, or Dribbble only.
const PROFILE_HOSTS = /^https:\/\/([a-z0-9-]+\.)*(linkedin\.com|github\.com|behance\.net|dribbble\.com)(\/.*)?$/i;
export const normalizeLink = (v) => {
  const t = String(v || '').trim();
  if (!t) return '';
  return /^https?:\/\//i.test(t) ? t.replace(/^http:\/\//i, 'https://') : `https://${t}`;
};
export const isProfileLink = (v) => PROFILE_HOSTS.test(normalizeLink(v));

// Hosted events: the joining link must be a known meeting service.
const MEETING_HOSTS = /^https:\/\/([a-z0-9-]+\.)*(zoom\.us|meet\.google\.com|teams\.microsoft\.com|teams\.live\.com|webex\.com|streamyard\.com|youtube\.com|youtu\.be)(\/.*)?$/i;
export const isMeetingLink = (v) => MEETING_HOSTS.test(normalizeLink(v));
export const MEETING_SERVICES = 'Zoom, Google Meet, Microsoft Teams, Webex, StreamYard, or YouTube';
