// src/components/PushPrompt.jsx
// Dashboard reminder to turn on phone notifications. It stays on this device
// until notifications are turned on here, then disappears.
import React, { useState } from 'react';
import { enablePushForCurrentUser } from '../utils/pushNotifications';

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent || '');
const isInstalled = () => window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
const permission = () => (typeof Notification === 'undefined' ? 'unsupported' : Notification.permission);

const PushPrompt = () => {
  const [perm, setPerm] = useState(permission());
  const [busy, setBusy] = useState(false);
  if (perm === 'granted') return null;
  // iPhone: notifications only work once the site is added to the Home Screen.
  const needsHomeScreen = isIOS() && !isInstalled();
  if (perm === 'unsupported' && !needsHomeScreen) return null;

  const turnOn = async () => {
    setBusy(true);
    await enablePushForCurrentUser({ interactive: true });
    setPerm(permission());
    setBusy(false);
  };

  return (
    <div className="rounded-xl border border-pink-200 bg-pink-50 p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="m-0 text-sm text-gray-800">
        <strong>Get notifications on your phone.</strong>{' '}
        {needsHomeScreen
          ? 'In Safari, tap Share, then Add to Home Screen. Open She Model Tech from the icon and turn them on here.'
          : perm === 'denied'
          ? 'Notifications are blocked. Allow them for this site in your phone or browser settings.'
          : 'Messages, decisions, and badges, as they happen.'}
      </p>
      {!needsHomeScreen && perm !== 'denied' && (
        <button onClick={turnOn} disabled={busy} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">
          {busy ? 'Turning on…' : 'Turn on'}
        </button>
      )}
    </div>
  );
};

export default PushPrompt;
