// src/components/PremiumBadge.jsx
// Small labels for Premium status: "Premium", "Featured", "Verified Partner".
import React from 'react';

const STYLES = {
  premium: 'bg-amber-50 text-amber-800 border-amber-200',
  featured: 'bg-pink-50 text-pink-700 border-pink-200',
  partner: 'bg-gradient-to-r from-amber-100 to-yellow-50 text-amber-900 border-amber-300',
};
const LABELS = { premium: 'Premium', featured: 'Featured', partner: 'Verified Partner' };

const PremiumBadge = ({ kind = 'premium', size = 'sm' }) => (
  <span
    className={`inline-flex items-center gap-1 font-bold rounded-full border ${STYLES[kind]} ${
      size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
    }`}
    title={kind === 'partner' ? 'Verified company with a Premium partnership' : LABELS[kind]}
  >
    <span aria-hidden="true">{kind === 'partner' ? '✔' : '★'}</span>
    {LABELS[kind]}
  </span>
);

export default PremiumBadge;
