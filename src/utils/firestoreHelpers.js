// src/utils/firestoreHelpers.js - Helpers for Firestore operations

// Sanitize email for use as Firestore map key (dots are not allowed in field paths)
export const sanitizeEmailKey = (email) => {
  if (!email) return '';
  return email.replace(/\./g, '_dot_').replace(/@/g, '_at_');
};

// Reverse sanitization to get original email
export const unsanitizeEmailKey = (key) => {
  if (!key) return '';
  return key.replace(/_dot_/g, '.').replace(/_at_/g, '@');
};
