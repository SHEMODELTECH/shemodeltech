// src/components/PresenceTracker.jsx
// Keeps the signed-in member's "Active now" status up to date while She Model
// Tech is open (see utils/presence.js). Renders nothing.
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserDocCached, invalidateUserDoc } from '../utils/firestoreHelpers';
import { PRESENCE_PREF_EVENT, stopPresenceNow, trackPresence } from '../utils/presence';

const PresenceTracker = () => {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid || null;
  const [prefTick, setPrefTick] = useState(0);

  // Re-read the preference when Settings changes it.
  useEffect(() => {
    const onPref = () => setPrefTick((n) => n + 1);
    window.addEventListener(PRESENCE_PREF_EVENT, onPref);
    return () => window.removeEventListener(PRESENCE_PREF_EVENT, onPref);
  }, []);

  useEffect(() => {
    if (!uid) return undefined;
    let alive = true;
    if (prefTick) invalidateUserDoc(uid);
    getUserDocCached(uid)
      .then((data) => {
        if (!alive) return;
        trackPresence(uid, (data || {}).showActivity !== false);
      })
      .catch(() => { if (alive) trackPresence(uid, true); });
    return () => {
      alive = false;
      stopPresenceNow().catch(() => {});
    };
  }, [uid, prefTick]);

  return null;
};

export default PresenceTracker;
