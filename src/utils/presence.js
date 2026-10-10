// src/utils/presence.js
// "Active now" / "Last active 2 days ago" for members.
//
// Each signed-in member has one small doc, presence/{uid}:
//   { state: 'online' | 'offline', lastActive: <server time>, hidden: bool }
// While the site or app is open and visible, it is refreshed every few
// minutes. When the member switches away, closes the tab, or signs out, it
// is marked offline straight away. Anyone whose last refresh is older than
// ONLINE_WINDOW_MS counts as offline too (covers closed laptops, lost signal).
// Members can hide their status in Settings (users/{uid}.showActivity ===
// false): then others see nothing at all, and nothing is refreshed.
import { useEffect, useState } from 'react';
import { collection, doc, documentId, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase/config';

// Every 10 minutes keeps database writes low on the free plan; switching away
// or closing the tab still marks a member offline straight away.
const HEARTBEAT_MS = 10 * 60 * 1000; // refresh every 10 minutes while visible
export const ONLINE_WINDOW_MS = 15 * 60 * 1000; // no refresh for 15 minutes = offline

const write = (uid, state, hidden = false) =>
  setDoc(doc(db, 'presence', uid), { state, hidden, lastActive: serverTimestamp() }).catch(() => {});

// Start tracking this member. Returns a function that stops it (and marks
// them offline). Call again after the Settings toggle changes.
export const startPresence = (uid, enabled) => {
  if (!uid) return () => Promise.resolve();
  if (!enabled) {
    write(uid, 'offline', true);
    return () => Promise.resolve();
  }
  let timer = null;
  const beat = () => write(uid, 'online');
  const goOnline = () => {
    beat();
    clearInterval(timer);
    timer = setInterval(beat, HEARTBEAT_MS);
  };
  const goOffline = () => {
    clearInterval(timer);
    timer = null;
    return write(uid, 'offline');
  };
  const onVisibility = () => (document.visibilityState === 'visible' ? goOnline() : goOffline());
  if (document.visibilityState === 'visible') goOnline();
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pagehide', goOffline);
  return () => {
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('pagehide', goOffline);
    return goOffline();
  };
};

// The one tracker for this browser tab (see components/PresenceTracker.jsx).
let active = null;
export const trackPresence = (uid, enabled) => {
  if (active) active();
  active = startPresence(uid, enabled);
};
// Mark offline now (awaited by logout, while still signed in).
export const stopPresenceNow = async () => {
  const stop = active;
  active = null;
  if (stop) await stop();
};
// Settings calls this after the "Show when I'm active" toggle changes.
export const PRESENCE_PREF_EVENT = 'smt-presence-pref';

const toMs = (t) => (t?.toMillis ? t.toMillis() : typeof t === 'number' ? t : t ? Date.parse(t) || 0 : 0);

// What to show for one presence doc: null (hidden or unknown), or
// { online: true } or { online: false, lastActive: ms }.
export const describePresence = (p, now = Date.now()) => {
  if (!p || p.hidden) return null;
  const last = toMs(p.lastActive);
  if (!last) return null;
  if (p.state === 'online' && now - last < ONLINE_WINDOW_MS) return { online: true };
  return { online: false, lastActive: last };
};

// "5 minutes ago", "3 hours ago", "2 days ago", "3 weeks ago", "Mar 4, 2026".
export const timeAgo = (ms, now = Date.now()) => {
  const s = Math.max(0, Math.round((now - ms) / 1000));
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'} ago`;
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return plural(m, 'minute');
  const h = Math.round(m / 60);
  if (h < 24) return plural(h, 'hour');
  const d = Math.round(h / 24);
  if (d < 14) return plural(d, 'day');
  if (d < 60) return plural(Math.round(d / 7), 'week');
  return `on ${new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
};

// Re-render every minute so "Active now" turns into "Last active…" on time.
const useMinuteTick = () => {
  const [, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 60 * 1000);
    return () => clearInterval(id);
  }, []);
};

// Live presence for one member (null while loading or when hidden).
export const usePresence = (uid) => {
  const [p, setP] = useState(null);
  useMinuteTick();
  useEffect(() => {
    if (!uid) { setP(null); return undefined; }
    return onSnapshot(doc(db, 'presence', uid), (s) => setP(s.exists() ? s.data() : null), () => setP(null));
  }, [uid]);
  return describePresence(p);
};

// Live presence for a list of members (e.g. a project team): { uid: info }.
export const usePresenceMany = (uids) => {
  const key = [...new Set((uids || []).filter(Boolean))].sort().join(',');
  const [map, setMap] = useState({});
  useMinuteTick();
  useEffect(() => {
    const ids = key ? key.split(',') : [];
    if (!ids.length) { setMap({}); return undefined; }
    const found = {};
    const unsubs = [];
    for (let i = 0; i < ids.length; i += 30) {
      const chunk = ids.slice(i, i + 30);
      unsubs.push(onSnapshot(query(collection(db, 'presence'), where(documentId(), 'in', chunk)), (snap) => {
        chunk.forEach((id) => { delete found[id]; });
        snap.docs.forEach((d) => { found[d.id] = d.data(); });
        setMap({ ...found });
      }, () => {}));
    }
    return () => unsubs.forEach((u) => u());
  }, [key]);
  const out = {};
  Object.entries(map).forEach(([id, p]) => { out[id] = describePresence(p); });
  return out;
};
