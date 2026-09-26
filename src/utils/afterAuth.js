// src/utils/afterAuth.js
// Where to send someone after they sign in or finish onboarding. Pages that
// ask a visitor to sign in (She Model Tech Learning) store a return path; only
// /learning paths are honoured, so this can't be used to redirect elsewhere.
export const afterAuthPath = (fallback = '/dashboard') => {
  try {
    const p = sessionStorage.getItem('smt_return_to');
    sessionStorage.removeItem('smt_return_to');
    if (p && /^\/learning(\/|$|\?)/.test(p)) return p;
  } catch (_) {
    /* storage unavailable */
  }
  return fallback;
};
