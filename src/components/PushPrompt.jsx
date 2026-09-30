// src/components/PushPrompt.jsx
// "Get the She Model Tech app": a dashboard card that shows the ONE step this
// device still needs (install, then turn on notifications) and disappears
// once both are done. Installing gives the app icon and its red unread number.
import React, { useEffect, useState } from 'react';
import { enablePushForCurrentUser } from '../utils/pushNotifications';

// The iPhone Share icon and the Android menu icon, drawn inline so people
// recognise what to tap.
const ShareIcon = () => (
  <svg aria-label="Share" role="img" viewBox="0 0 24 24" className="inline-block w-5 h-5 align-text-bottom text-sky-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12" /><path d="M8 7l4-4 4 4" /><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" />
  </svg>
);
const AddIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="inline-block w-5 h-5 align-text-bottom" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 8v8M8 12h8" />
  </svg>
);
const MenuIcon = () => (
  <svg aria-label="Menu" role="img" viewBox="0 0 24 24" className="inline-block w-5 h-5 align-text-bottom" fill="currentColor">
    <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
  </svg>
);
const isAndroid = () => /android/i.test(navigator.userAgent || '');
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent || '');
const isInstalled = () => window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
const permission = () => (typeof Notification === 'undefined' ? 'unsupported' : Notification.permission);

const PushPrompt = () => {
  const [perm, setPerm] = useState(permission());
  const [installed, setInstalled] = useState(isInstalled());
  const [canInstall, setCanInstall] = useState(!!window.__smtInstallPrompt);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onAvail = () => setCanInstall(!!window.__smtInstallPrompt);
    const onDone = () => { setInstalled(true); setCanInstall(false); };
    window.addEventListener('smt-installable', onAvail);
    window.addEventListener('smt-installed', onDone);
    return () => { window.removeEventListener('smt-installable', onAvail); window.removeEventListener('smt-installed', onDone); };
  }, []);

  const ios = isIOS();
  // Which step is left on this device?
  let step = null;
  if (!installed && ios) step = 'ios-install';
  else if (!installed && canInstall) step = 'install';
  else if (!installed && isAndroid()) step = 'android-install';
  else if (perm === 'default') step = 'notify';
  else if (perm === 'denied') step = 'blocked';
  if (!step) return null;

  const install = async () => {
    const e = window.__smtInstallPrompt;
    if (!e) return;
    setBusy(true);
    try {
      e.prompt();
      const choice = await e.userChoice;
      if (choice?.outcome === 'accepted') { window.__smtInstallPrompt = null; setCanInstall(false); }
    } catch (_) { /* ignore */ }
    setBusy(false);
  };
  const turnOn = async () => {
    setBusy(true);
    await enablePushForCurrentUser({ interactive: true });
    setPerm(permission());
    setBusy(false);
  };

  const text = {
    'ios-install': <>In Safari, tap <ShareIcon /> at the bottom of the screen, then <strong><AddIcon /> Add to Home Screen</strong>.</>,
    'android-install': <>Tap <MenuIcon /> at the top of Chrome, then <strong>Install app</strong> (or <strong>Add to Home screen</strong>).</>,
    install: 'Install She Model Tech for quick access and notifications.',
    notify: 'Turn on notifications for messages, decisions, and badges.',
    blocked: 'Notifications are blocked. Allow them for this site in your phone or browser settings.',
  }[step];

  return (
    <div className="rounded-xl border border-pink-200 bg-pink-50 p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="m-0 text-sm text-gray-800"><strong>Get the She Model Tech app.</strong> {text}</p>
      {step === 'install' && (
        <button onClick={install} disabled={busy} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">Install</button>
      )}
      {step === 'notify' && (
        <button onClick={turnOn} disabled={busy} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">{busy ? 'Turning on…' : 'Turn on'}</button>
      )}
    </div>
  );
};

export default PushPrompt;
