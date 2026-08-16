// src/components/AccessBanner.jsx
//
// Tells a company where it stands on access, shown on the Talent Board and
// other paid surfaces.
//
// The point of this banner is HONESTY ABOUT TIMING. If companies use
// everything free for a year and then hit a paywall with no warning, it reads
// as a bait and switch and they leave. Saying "free while we build, then a
// 3-month trial" from the very first screen makes charging later expected
// rather than a betrayal, and costs nothing to say now.

import React from 'react';
import { Link } from 'react-router-dom';
import {
 MEMBERSHIP_ENFORCED, DORMANT_NOTICE, TRIAL_MONTHS,
 isInTrial, trialDaysLeft,
} from '../config/membership';

const AccessBanner = ({ company }) => {
 if (!company?.isCompany) return null;

 // Dormant: everything free, and we say why and what comes next.
 if (!MEMBERSHIP_ENFORCED) {
 return (
 <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-5">
 <div className="flex items-center gap-2 mb-1 flex-wrap">
 <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-600 text-white uppercase tracking-wide">
 {DORMANT_NOTICE.badge}
 </span>
 <p className="text-gray-900 text-sm font-bold">{DORMANT_NOTICE.title}</p>
 </div>
 <p className="text-gray-600 text-xs leading-relaxed">{DORMANT_NOTICE.body}</p>
 </div>
 );
 }

 if (company.tier === 'partner') return null;

 if (isInTrial(company)) {
 const left = trialDaysLeft(company);
 const ending = left <= 14;
 return (
 <div className={`rounded-xl p-4 mb-5 border ${
 ending ? 'bg-amber-50 border-amber-300' : 'bg-pink-50 border-pink-200'
 }`}>
 <p className="text-gray-900 text-sm font-bold mb-1">
 {left} day{left === 1 ? '' : 's'} left of your free {TRIAL_MONTHS}-month access
 </p>
 <p className="text-gray-600 text-xs mb-2 leading-relaxed">
 Everything stays unlocked until then. No card on file, nothing charged
 automatically.
 </p>
 <Link to="/partner" className="text-pink-600 text-xs font-semibold hover:underline">
 See Talent Access plans
 </Link>
 </div>
 );
 }

 // Trial over, no plan.
 return (
 <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5">
 <p className="text-gray-900 text-sm font-bold mb-1">Your free access has ended</p>
 <p className="text-gray-600 text-xs mb-2 leading-relaxed">
 You can still post roles, reply to members, and take part in the community
 for free. Search, filtering and verified evidence need Talent Access.
 </p>
 <Link to="/partner" className="text-pink-600 text-xs font-semibold hover:underline">
 See plans
 </Link>
 </div>
 );
};

export default AccessBanner;
