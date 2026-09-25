// src/utils/pushNotifications.js
// Client-side push: request permission, register the device's FCM token on the
// user's doc, and a helper to ask the server to send a push to other users.

import { getToken, onMessage, isSupported } from 'firebase/messaging';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth, messaging } from '../firebase/config';
import { toast } from 'react-toastify';

// Your Web Push certificate "Key pair" (VAPID public key) from Firebase Console →
// Project Settings → Cloud Messaging → Web Push certificates.
// Stored as an env var so it isn't hard-coded; falls back to empty (no push).
const VAPID_KEY = process.env.REACT_APP_FIREBASE_VAPID_KEY || '';

// Register the service worker and wait until it is ACTIVE (required before getToken).
async function registerSW() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    // If already active, we're done.
    if (reg.active) return reg;

    // Otherwise wait for the installing/waiting worker to reach "activated".
    const worker = reg.installing || reg.waiting;
    if (worker) {
      await new Promise((resolve) => {
        const done = () => { if (worker.state === 'activated') resolve(); };
        worker.addEventListener('statechange', done);
        // Safety timeout so we never hang forever.
        setTimeout(resolve, 6000);
        done();
      });
    }
    // Belt-and-suspenders: also wait for the registration to be ready.
    try { await navigator.serviceWorker.ready; } catch (e) { /* ignore */ }
    return reg;
  } catch (e) {
    console.warn('SW registration failed:', e?.message);
    return null;
  }
}

// Ask permission + get token + save it to the signed-in user's doc.
// Call this after login, or from a "Enable notifications" button.
export async function enablePushForCurrentUser({ interactive = false } = {}) {
  try {
    // Environment detection for accurate, actionable messaging.
    const ua = navigator.userAgent || '';
    const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;

    // On iOS, the Notification + Push APIs don't exist in a normal Safari tab -
    // they only appear once the site is installed to the Home Screen (iOS 16.4+).
    const hasPushApis = typeof Notification !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
    const supported = hasPushApis && await isSupported().catch(() => false);
    if (!supported || !messaging) {
      if (interactive) {
        if (isIOS && !isStandalone) {
          toast.info('On iPhone/iPad: tap Share → Add to Home Screen, then open She Model Tech from the Home Screen icon and enable notifications from there.');
        } else {
          toast.info('Push notifications aren\u2019t supported in this browser. Try Chrome or Edge, or on iPhone add She Model Tech to your Home Screen.');
        }
      }
      return false;
    }
    if (!VAPID_KEY) {
      if (interactive) toast.error('Push is not configured yet (missing VAPID key).');
      return false;
    }
    const user = auth.currentUser;
    if (!user) return false;

    // Permission
    if (Notification.permission === 'denied') {
      if (interactive) toast.info('Notifications are blocked. Enable them in your browser settings.');
      return false;
    }
    if (Notification.permission !== 'granted') {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return false;
    }

    const registration = await registerSW();
    // Wait until the service worker is fully active - getToken can fail if it isn't.
    if (registration) {
      try { await navigator.serviceWorker.ready; } catch (e) { /* ignore */ }
    }
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration || undefined,
    });
    if (!token) return false;

    await updateDoc(doc(db, 'users', user.uid), {
      fcmTokens: arrayUnion(token),
    });
    if (interactive) { toast.success('Notifications enabled on this device.'); playNotificationSound(); }
    return true;
  } catch (e) {
    console.error('enablePush failed:', e);
    if (interactive) toast.error('Could not enable notifications: ' + (e?.message || e?.code || 'unknown error'));
    return false;
  }
}

// Play a short notification "ding" using the Web Audio API (no sound file needed).
// Browsers require a prior user interaction before audio can play; since the user
// clicked "Enable notifications", that requirement is satisfied in practice.
export function playNotificationSound() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    // Two quick tones for a pleasant chime.
    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = now + i * 0.12;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.3);
    });
    setTimeout(() => { try { ctx.close(); } catch (e) {} }, 800);
  } catch (e) { /* ignore */ }
}

// Foreground messages (site open + focused) - show a toast AND play a sound,
// since the OS notification is suppressed while the tab is focused.
export function listenForForegroundPush() {
  if (!messaging) return;
  try {
    onMessage(messaging, (payload) => {
      const title = payload.notification?.title || 'She Model Tech';
      const body = payload.notification?.body || '';
      playNotificationSound();
      toast.info(`${title}${body ? ': ' + body : ''}`);
    });
  } catch (e) { /* ignore */ }
}

// Ask the server to push to one or more users. Uses the signed-in user's
// Firebase ID token to authorize the call.
export async function sendPush({ recipientUid, recipientUids, title, body, link }) {
  try {
    const user = auth.currentUser;
    if (!user) return;
    const idToken = await user.getIdToken();
    await fetch('/api/send-push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ recipientUid, recipientUids, title, body, link }),
    });
  } catch (e) {
    // Non-blocking: push failures should never break the core action.
    console.warn('sendPush failed:', e?.message);
  }
}
