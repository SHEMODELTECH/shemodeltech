// src/components/TrackPicker.jsx
// Choose your track (sign-up and Settings): the six tracks as tap-to-open rows
// (what it's about, the careers that fit, "Choose"). Once chosen, it folds to
// one line with "Change". "Not sure yet" is a small link under the list.
import React, { useState } from 'react';
import TierBadge from './TierBadge';
import TrackGuide from './TrackGuide';
import { BADGE_TRACKS } from '../config/badgeTracks';

export const NOT_SURE = 'notsure';
export const isRealTrack = (v) => BADGE_TRACKS.some((t) => t.name === v);

const TrackPicker = ({ value, onChange }) => {
  const chosen = BADGE_TRACKS.find((t) => t.name === value);
  const [open, setOpen] = useState(!chosen);

  if (chosen && !open) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-pink-500 bg-white p-3 sm:p-4">
        <TierBadge image={chosen.img} alt="" level="Novice" size={36} showLabel={false} />
        <span className="flex-1 min-w-0">
          <span className="block font-semibold text-gray-900">{chosen.name}</span>
          <span className="block text-xs text-gray-600">{chosen.label}</span>
        </span>
        <button type="button" onClick={() => setOpen(true)} className="text-sm font-semibold text-pink-700 hover:underline">
          Change
        </button>
      </div>
    );
  }

  return (
    <div>
      <TrackGuide
        selected={value}
        onChoose={(name) => { onChange(name); setOpen(false); }}
      />
      {value === NOT_SURE ? (
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-semibold text-gray-900">Not sure yet.</span> That's fine, we'll help you discover one. Tap a track any time to choose it.
        </p>
      ) : (
        <button type="button" onClick={() => onChange(NOT_SURE)} className="mt-2 text-sm font-semibold text-pink-700 hover:underline">
          Not sure yet? Skip for now
        </button>
      )}
    </div>
  );
};

export default TrackPicker;
