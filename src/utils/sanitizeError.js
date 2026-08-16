// src/utils/sanitizeError.js
// Central place to clean raw error strings before they are shown to users.
// We never expose internal vendor/tooling names (e.g. the word "Firebase")
// or raw error codes like "(auth/...)" - members should only ever see
// She Model Tech-branded, human-friendly wording.

/**
 * Strip vendor branding and raw error codes from a message string.
 * Safe to call on anything - non-strings are returned untouched.
 * @param {string} message
 * @returns {string}
 */
export const sanitizeErrorMessage = (message) => {
  if (typeof message !== 'string' || !message) return message;

  let cleaned = message
    // "Firebase: something went wrong (auth/some-code)." -> "something went wrong."
    .replace(/Firebase\s*:\s*/gi, '')
    // Remove raw error codes like "(auth/password-does-not-meet-requirements)"
    .replace(/\(\s*(auth|firestore|storage|functions|messaging|database)\/[a-z0-9-]+\s*\)\.?/gi, '')
    // Replace any leftover vendor mentions with our own wording
    .replace(/firebase/gi, 'She Model Tech')
    .replace(/firestore/gi, 'our database')
    .trim();

  // Tidy up double spaces / dangling punctuation left behind by the removals.
  cleaned = cleaned.replace(/\s{2,}/g, ' ').replace(/\s+([.,!?])/g, '$1').trim();
  if (cleaned && !/[.!?]$/.test(cleaned)) cleaned += '.';

  // If all that's left is something meaningless like "Error.", fall back.
  if (!cleaned || /^error[.!]?$/i.test(cleaned) || cleaned.length < 4) {
    return 'An unexpected error occurred. Please try again.';
  }

  return cleaned;
};

/**
 * Turn the auth password-policy error into a clean, branded-free sentence.
 * Input example:
 *   "Firebase: Missing password requirements: [Password must contain a
 *    non-alphanumeric character] (auth/password-does-not-meet-requirements)."
 * Output:
 *   "Your password doesn't meet the requirements: Password must contain a
 *    non-alphanumeric character."
 * @param {string} rawMessage
 * @returns {string}
 */
export const formatPasswordRequirementError = (rawMessage) => {
  const fallback = 'Your password doesn\'t meet the requirements. Use at least 8 characters with a letter, a number, and a symbol (e.g. ! @ # $ %).';
  if (typeof rawMessage !== 'string') return fallback;
  const match = rawMessage.match(/\[([^\]]+)\]/);
  if (match && match[1]) {
    const requirements = match[1]
      .split(',')
      .map((r) => sanitizeErrorMessage(r).replace(/\.$/, ''))
      .filter(Boolean)
      .join('; ');
    if (requirements) return `Your password doesn't meet the requirements: ${requirements}.`;
  }
  return fallback;
};

export default sanitizeErrorMessage;
