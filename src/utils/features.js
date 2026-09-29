// src/utils/features.js
// Launch switches, controlled by admins in Admin → Overview → Launch settings.
// Stored in app_settings/features. Focus mode (the first months) keeps paid work,
// paid cohorts, and sponsorships paused, and takes organization requests as
// "register interest" only.
import { useEffect, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const FEATURE_DEFAULTS = {
  paidProjects: false, // companies post paid projects, company cohorts, freelance
  paidCohorts: false, // She Model Tech paid cohorts
  sponsorships: false, // companies sponsor a cohort (otherwise: register interest)
  orgTraining: false, // training and curriculum requests (otherwise: register interest)
  jobPosting: false, // companies post jobs (a Premium feature)
  companyTiers: false, // Supporter, Partner, Champion rules apply to companies
  premiumPayments: false, // companies pay for tiers online (otherwise: "Ask about a tier")
};

let current = { ...FEATURE_DEFAULTS };
const listeners = new Set();
let started = false;
const start = () => {
  if (started) return;
  started = true;
  onSnapshot(
    doc(db, 'app_settings', 'features'),
    (s) => {
      current = { ...FEATURE_DEFAULTS, ...(s.exists() ? s.data() : {}) };
      listeners.forEach((fn) => fn(current));
    },
    () => {}
  );
};

export const useFeatures = () => {
  const [f, setF] = useState(current);
  useEffect(() => {
    start();
    listeners.add(setF);
    setF(current);
    return () => listeners.delete(setF);
  }, []);
  return f;
};

export const setFeature = (key, on, user) =>
  setDoc(doc(db, 'app_settings', 'features'), { [key]: !!on, updatedAt: serverTimestamp(), updatedBy: user?.email || null }, { merge: true });
