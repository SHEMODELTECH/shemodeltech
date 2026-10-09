// lib/escapeHtml.js
// Helpers for putting untrusted values (names, titles, messages, URLs) into
// email HTML and email headers. Anything a member typed, or anything read from
// a Firestore document members can edit, goes through one of these before it
// is placed in an email.

/** Escape text for an HTML text node or a quoted attribute value. */
const escapeHtml = (value) =>
  String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Return the URL if it is an absolute http(s) URL, otherwise `fallback`.
 * The result is NOT escaped; use safeHref for an href attribute.
 */
const safeUrl = (value, fallback = '') => {
  const s = String(value == null ? '' : value).trim();
  if (!s) return fallback;
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : fallback;
  } catch (_) {
    return fallback;
  }
};

/** An http(s) URL ready for an href="..." attribute (escaped), or the escaped fallback. */
const safeHref = (value, fallback = '') => escapeHtml(safeUrl(value, fallback));

/** Plain-text header value (subject, names): no CR/LF, so no header injection. */
const headerSafe = (value) => String(value == null ? '' : value).replace(/[\r\n]+/g, ' ').trim();

module.exports = { escapeHtml, safeUrl, safeHref, headerSafe };
