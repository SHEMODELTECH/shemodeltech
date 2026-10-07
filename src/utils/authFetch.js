// src/utils/authFetch.js
// fetch() for our own /api endpoints that need a signed-in member: adds the
// member's Firebase ID token so the server can verify who is asking.
import { auth } from '../firebase/config';

export const authHeaders = async (extra = {}) => {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;
  return { ...extra, ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

// An AbortSignal that fires after `ms`. Uses AbortSignal.timeout where the
// browser has it, otherwise an AbortController + setTimeout.
export const timeoutSignal = (ms) => {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') return AbortSignal.timeout(ms);
  if (typeof AbortController === 'undefined') return undefined;
  const c = new AbortController();
  setTimeout(() => c.abort(), ms);
  return c.signal;
};

const DEFAULT_TIMEOUT_MS = 60 * 1000;

// options.timeoutMs overrides the 60 s default (0 or null = no timeout). A
// caller's own options.signal is kept (combined with the timeout when the
// browser supports AbortSignal.any). A timeout rejects like a network error,
// so callers' existing catch blocks handle it.
export const authFetch = async (url, options = {}) => {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...rest } = options;
  let signal = rest.signal;
  const t = timeoutMs ? timeoutSignal(timeoutMs) : undefined;
  if (t) {
    if (!signal) signal = t;
    else if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.any === 'function') signal = AbortSignal.any([signal, t]);
  }
  return fetch(url, { ...rest, ...(signal ? { signal } : {}), headers: await authHeaders(rest.headers || {}) });
};
