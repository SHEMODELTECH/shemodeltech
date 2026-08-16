// src/utils/toastSanitizer.js
// Import this once (from src/index.jsx). It wraps react-toastify so that any
// toast shown anywhere in the app is scrubbed of vendor branding ("Firebase",
// raw auth/firestore error codes, etc.) before the user sees it.
// This is a safety net - individual call sites should still prefer the
// friendly messages from getAuthErrorMessage / handleFirebaseError.

import { toast } from 'react-toastify';
import { sanitizeErrorMessage } from './sanitizeError';

const NEEDS_CLEANING = /(firebase|firestore|\((auth|storage|functions|messaging|database)\/[a-z0-9-]+\))/i;

const wrap = (fn) => {
  if (typeof fn !== 'function' || fn.__smtSanitized) return fn;
  const wrapped = (content, options) => {
    if (typeof content === 'string' && NEEDS_CLEANING.test(content)) {
      content = sanitizeErrorMessage(content);
    }
    return fn(content, options);
  };
  wrapped.__smtSanitized = true;
  return wrapped;
};

['error', 'warn', 'warning', 'info', 'success'].forEach((method) => {
  if (typeof toast[method] === 'function') {
    toast[method] = wrap(toast[method]);
  }
});

export default toast;
