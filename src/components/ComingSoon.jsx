// src/components/ComingSoon.jsx
//
// The "built, visible, not yet live" pattern for every paid surface.
//
// While MEMBERSHIP_ENFORCED is false we deliberately SHOW the paid features
// rather than hiding them. Companies need to see what is coming so they can
// plan for it, and the free period reads as a deliberate stage rather than an
// absence of a business model. What we must not do is let anyone try to pay,
// or imply a price we have not committed to.
//
// So on every dormant paid surface:
//   - a COMING SOON ribbon on the card
//   - the CTA rendered but visibly disabled and non-clickable
//   - prices hidden (there is no point anchoring a number we may change
//     before launch, and a wrong price is worse than no price)
//
// When you flip MEMBERSHIP_ENFORCED to true, every one of these reverts to a
// live button and real pricing with no further edits.
//
// ADMINS AND EDITORS ALWAYS SEE THE LIVE VERSION.
// Reviewers need to exercise checkout, sponsorship and hosting before launch.
// A paywall they cannot get past means those paths ship untested, and the
// first person to hit a bug in them would be a paying customer.

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { usePaidFeaturesVisible } from '../utils/permissions';

/** Corner ribbon. Place inside a `relative` card. */
export const ComingSoonRibbon = ({ label = 'Coming soon' }) => {
  const { currentUser } = useAuth();
  const { visible } = usePaidFeaturesVisible(currentUser?.uid);
  if (visible) return null;
  return (
    <span className="absolute -top-3 right-4 z-10 bg-pink-600 text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-sm">
      {label}
    </span>
  );
};

/**
 * A CTA that becomes an inert placeholder while dormant.
 * Renders a real <button> with `disabled` (not a styled div) so assistive
 * tech announces it as unavailable rather than as a working control.
 */
export const ComingSoonButton = ({
  onClick,
  children,
  label = 'Coming soon',
  className = '',
  disabled = false,
}) => {
  const { currentUser } = useAuth();
  const { visible } = usePaidFeaturesVisible(currentUser?.uid);
  if (!visible) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className={`w-full bg-gray-200 text-gray-500 font-semibold text-sm py-3 rounded-lg cursor-not-allowed ${className}`}
      >
        {label}
      </button>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
};

/**
 * Price display. Hidden entirely while dormant.
 * Anchoring a number we may revise before launch is worse than showing none:
 * the first price a company sees is the one they remember.
 */
export const Price = ({ amount, interval, note, className = '' }) => {
  const { currentUser } = useAuth();
  const { visible } = usePaidFeaturesVisible(currentUser?.uid);
  if (!visible) {
    return (
      <div className={className}>
        <p className="text-2xl font-bold text-gray-400">Pricing to be announced</p>
        <p className="text-gray-400 text-xs mt-1">
          Free for everyone while we run our first cohorts.
        </p>
      </div>
    );
  }
  return (
    <div className={className}>
      <p className="text-3xl font-bold text-gray-900">
        ${Number(amount).toLocaleString('en-US')}
        {interval && <span className="text-base font-normal text-gray-500">/{interval}</span>}
      </p>
      {note && <p className="text-gray-400 text-xs mt-1">{note}</p>}
    </div>
  );
};

/** Explains why everything is greyed out. One per page, not per card. */
export const ComingSoonNotice = () => {
  const { currentUser } = useAuth();
  const { visible, isReviewer } = usePaidFeaturesVisible(currentUser?.uid);

  // Reviewers see a note explaining WHY the paid flows are live for them, so
  // nobody mistakes a preview for the member-facing experience.
  if (isReviewer) {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-8">
        <p className="text-purple-900 text-sm font-bold mb-1">Reviewer preview</p>
        <p className="text-purple-800 text-xs leading-relaxed">
          Paid features are live for you so you can test them. Everyone else sees
          &ldquo;coming soon&rdquo; until membership is switched on.
        </p>
      </div>
    );
  }
  if (visible) return null;
  return (
    <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-8">
      <p className="text-gray-900 text-sm font-bold mb-1">Everything below is free right now</p>
      <p className="text-gray-600 text-xs leading-relaxed">
        We&rsquo;re running our first cohorts and building the pool of verified graduates. Paid
        plans open next year, and you&rsquo;ll get three months free when they do. Nothing here is
        charged, and there&rsquo;s no card to add.
      </p>
    </div>
  );
};

export default ComingSoonRibbon;
