// src/components/TierBadge.jsx
// Shows a track medal wrapped in a tier-colored ring + label.
// The medal image is kept exactly as designed; the RING and LABEL carry the level
// color, uniform across every track: Steel=Novice, Bronze=Associate,
// Silver=Advanced, Gold=Expert.

import React from 'react';

// Tier color system. Each level has a ring gradient, a solid accent, a soft
// background, and readable text - tuned to read clearly as steel/bronze/silver/gold.
export const TIERS = {
  Novice:    { label: 'Steel',  ring: 'linear-gradient(135deg,#9ca3af,#6b7280)', accent: '#6b7280', bg: '#f3f4f6', text: '#374151' },
  Associate: { label: 'Bronze', ring: 'linear-gradient(135deg,#d8975a,#a55b2e)', accent: '#b45309', bg: '#fdf3e7', text: '#92400e' },
  Advanced:  { label: 'Silver', ring: 'linear-gradient(135deg,#e5e7eb,#9ca3af)', accent: '#94a3b8', bg: '#f8fafc', text: '#475569' },
  Expert:    { label: 'Gold',   ring: 'linear-gradient(135deg,#fcd34d,#d97706)', accent: '#d97706', bg: '#fffbeb', text: '#92400e' },
};

// Normalise any level string to a known tier (defaults to Novice).
export const tierFor = (level) => {
  const key = (level || '').toString().trim().toLowerCase();
  if (key.startsWith('expert')) return 'Expert';
  if (key.startsWith('advanc')) return 'Advanced';
  if (key.startsWith('assoc')) return 'Associate';
  return 'Novice';
};

// size: pixel size of the medal. showLabel: show the tier name pill below.
export default function TierBadge({ image, alt = 'badge', level = 'Novice', size = 48, showLabel = true, earned = true }) {
  const tierKey = tierFor(level);
  const tier = TIERS[tierKey];
  const ringThickness = Math.max(2, Math.round(size * 0.06));
  const pad = ringThickness + 2;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div
        style={{
          width: size + pad * 2,
          height: size + pad * 2,
          borderRadius: '9999px',
          background: earned ? tier.ring : 'linear-gradient(135deg,#e5e7eb,#d1d5db)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: ringThickness,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: size, height: size, borderRadius: '9999px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src={image} alt={alt} style={{ width: '82%', height: '82%', objectFit: 'contain', opacity: earned ? 1 : 0.4, filter: earned ? 'none' : 'grayscale(1)' }} />
        </div>
      </div>
      {showLabel && earned && (
        <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 8px', borderRadius: 9999, background: tier.bg, color: tier.text, lineHeight: '16px' }}>
          {tier.label}
        </span>
      )}
    </div>
  );
}
