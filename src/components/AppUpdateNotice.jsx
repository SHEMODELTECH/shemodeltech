// src/components/AppUpdateNotice.jsx
// Keeps open copies of the app up to date. The app installed on a phone can
// stay open for days without reloading, so it would keep showing old courses
// and features. Every few minutes, and whenever the app comes back to the
// screen, we compare this copy's build ID with the deployed one
// (/version.json). When a newer version is out:
//   - the next time the member moves to another page, the app reloads there
//     (nothing is lost, since they were leaving the page anyway);
//   - meanwhile a small notice offers "Refresh now".
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const BUILD_ID = process.env.REACT_APP_BUILD_ID || '';
const CHECK_EVERY_MS = 10 * 60 * 1000;

const AppUpdateNotice = () => {
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const firstPath = useRef(location.pathname + location.search);

  // Look for a newer deployed version.
  useEffect(() => {
    if (!BUILD_ID) return undefined; // local development
    let stop = false;
    const check = async () => {
      if (stop || document.visibilityState !== 'visible' || !navigator.onLine) return;
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const { id } = await res.json();
        if (id && id !== BUILD_ID && !stop) setReady(true);
      } catch (_) {
        /* offline or blocked: try again later */
      }
    };
    const first = setTimeout(check, 15000);
    const timer = setInterval(check, CHECK_EVERY_MS);
    const onShow = () => { if (document.visibilityState === 'visible') check(); };
    document.addEventListener('visibilitychange', onShow);
    window.addEventListener('focus', onShow);
    window.addEventListener('online', check);
    return () => {
      stop = true;
      clearTimeout(first);
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onShow);
      window.removeEventListener('focus', onShow);
      window.removeEventListener('online', check);
    };
  }, []);

  // When an update is waiting, load it as the member moves to another page.
  useEffect(() => {
    const here = location.pathname + location.search;
    if (ready && here !== firstPath.current) window.location.reload();
    firstPath.current = here;
  }, [ready, location.pathname, location.search]);

  if (!ready || hidden) return null;
  return (
    <div
      role="status"
      className="fixed z-[60] left-1/2 -translate-x-1/2 bottom-[calc(1rem+env(safe-area-inset-bottom))] w-[calc(100%-2rem)] max-w-md bg-gray-900 text-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3"
    >
      <p className="m-0 flex-1 text-sm">A new version of She Model Tech is ready.</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap"
      >
        Refresh now
      </button>
      <button type="button" onClick={() => setHidden(true)} aria-label="Later" className="text-gray-300 hover:text-white px-1 text-lg leading-none">
        ×
      </button>
    </div>
  );
};

export default AppUpdateNotice;
