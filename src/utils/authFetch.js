// src/utils/authFetch.js
// fetch() for our own /api endpoints that need a signed-in member: adds the
// member's Firebase ID token so the server can verify who is asking.
import { auth } from '../firebase/config';

export const authHeaders = async (extra = {}) => {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;
  return { ...extra, ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

export const authFetch = async (url, options = {}) =>
  fetch(url, { ...options, headers: await authHeaders(options.headers || {}) });
