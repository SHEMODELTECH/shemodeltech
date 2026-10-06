// src/components/TierBadge.jsx
// Shows a track medal wrapped in a tier-colored ring + label.
// The medal image is kept exactly as designed; the RING and LABEL carry the level
// color, uniform across every track. The label is the level name:
// Novice, Associate, Advanced, Expert.

import React from 'react';

// Tier color system. Each level has a ring gradient, a solid accent, a soft
// background, and readable text - tuned to read clearly as grey/light pink/pink/black.
export const TIERS = {
  Novice:    { label: 'Novice',  ring: 'linear-gradient(135deg,#9ca3af,#6b7280)', accent: '#6b7280', bg: '#f3f4f6', text: '#374151' },
  Associate: { label: 'Associate', ring: 'linear-gradient(135deg,#F9C6DD,#EC5C9C)', accent: '#EC5C9C', bg: '#FDF2F7', text: '#B0105C' },
  Advanced:  { label: 'Advanced', ring: 'linear-gradient(135deg,#E0146C,#8C0D49)', accent: '#D41470', bg: '#FCE4EF', text: '#8C0D49' },
  Expert:    { label: 'Expert',   ring: 'linear-gradient(135deg,#404040,#000000)', accent: '#000000', bg: '#F5F5F5', text: '#000000' },
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
