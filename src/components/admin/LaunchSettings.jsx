// src/components/admin/LaunchSettings.jsx
// Admin → Overview: switch paused features on when you're ready. The milestones
// next to each switch are a guide only; nothing turns on by itself.
import React, { useEffect, useState } from 'react';
import { collection, getCountFromServer, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase/config';
import { setFeature, useFeatures } from '../../utils/features';

const ROWS = [
  ['paidProjects', 'Paid projects from companies', 'Companies post paid projects, company cohorts, and freelance work. Members need a badge to apply.', 'badgeHolders', 20, 'members with a badge'],
  ['sponsorships', 'Sponsored cohorts', 'Companies sponsor a cohort and pay She Model Tech. While off, companies can only register interest.', 'completedCohorts', 2, 'completed cohorts'],
  ['jobPosting', 'Job posting (before tiers)', 'Lets companies post jobs while Company tiers is off. Once tiers are on, any tier can post and this switch no longer matters.', null, null, 'Usually leave off'],
  ['companyTiers', 'Company tiers', 'Supporter, Partner, and Champion rules apply to companies. Companies without a tier become free companies (5 new conversations a month, no job posting). Set tiers first in Admin → Users.', null, null, 'Tiers assigned to your early partners'],
  ['premiumPayments', 'Tier payments', 'Companies can pay for a tier online (links in REACT_APP_TIER_SUPPORTER_LINK, _PARTNER_LINK, _CHAMPION_LINK). While off, they “Ask about” a tier and you set it in Admin → Users.', null, null, 'Bank account and Stripe set up'],
];

const LaunchSettings = ({ currentUser }) => {
  const features = useFeatures();
  const [stats, setStats] = useState({ badgeHolders: null, completedCohorts: null });
  useEffect(() => {
    (async () => {
      let badgeHolders = null;
      let completedCohorts = null;
      try {
        const s = await getDocs(collection(db, 'member_badges'));
        badgeHolders = new Set(s.docs.map((d) => d.data().memberUid || d.data().memberEmail)).size;
      } catch (_) { /* optional */ }
      try {
        completedCohorts = (await getCountFromServer(query(collection(db, 'cohorts'), where('status', '==', 'complete')))).data().count;
      } catch (_) { /* optional */ }
      setStats({ badgeHolders, completedCohorts });
    })();
  }, []);

  const toggle = async (key, on) => {
    try {
      await setFeature(key, on, currentUser);
      toast.success(on ? 'Switched on.' : 'Switched off.');
    } catch (e) {
      toast.error('Could not change the setting.');
    }
  };

  return (
    <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-5">
      <h2 className="text-lg font-bold text-gray-900">Launch settings</h2>
      <p className="text-sm text-gray-500 mb-4">Focus mode: free training cohorts first. Switch each feature on when you’re ready.</p>
      <ul className="space-y-3">
        {ROWS.map(([key, title, desc, statKey, target, goalLabel]) => {
          const on = !!features[key];
          const value = statKey ? stats[statKey] : null;
          return (
            <li key={key} className="flex flex-wrap items-start justify-between gap-3 border border-gray-100 rounded-xl p-4">
              <div className="min-w-0 max-w-xl">
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
                <p className="text-xs mt-1.5 text-gray-500">
                  Suggested before switching on:{' '}
                  {statKey ? (
                    <span className={value != null && value >= target ? 'text-emerald-700 font-semibold' : 'font-semibold'}>
                      {value == null ? '…' : value} of {target} {goalLabel}
                    </span>
                  ) : (
                    <span className="font-semibold">{goalLabel}</span>
                  )}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={`${title}: ${on ? 'on' : 'off'}`}
                onClick={() => toggle(key, !on)}
                className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition ${on ? 'bg-emerald-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${on ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LaunchSettings;
