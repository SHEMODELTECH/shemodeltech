// src/components/PremiumBadge.jsx
//
// She Model Tech is free for everyone. There are no paid tiers, no PRO badge,
// and no gated features.
//
// This module is kept as a compatibility shim so any remaining call site keeps
// working:
//   - <PremiumBadge /> renders nothing.
//   - isPremium() always returns true, so every gate it guards is open.
// New code should not import from here.

export const PremiumBadge = () => null;

// Every member has full access.
export const isPremium = () => true;

export default PremiumBadge;
