// src/components/TrackGuide.jsx
// The six badge tracks as tap-to-open panels: the medal and name, and when
// opened, one line on what the track is about and the careers that fit it.
// Used on How badges work, and at sign-up (with "Choose this track").
import React, { useState } from 'react';
import TierBadge from './TierBadge';
import { BADGE_TRACKS, TRACK_GUIDE } from '../config/badgeTracks';

const TrackGuide = ({ onChoose = null, selected = '', columns = 1, defaultOpen = null }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`grid gap-3 items-start ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
      {BADGE_TRACKS.map((t) => {
        const g = TRACK_GUIDE[t.name] || { about: t.desc, careers: [] };
        const isOpen = open === t.name;
        const isPicked = selected === t.name;
        const panelId = `track-${t.name}`;
        return (
          <div key={t.key} className={`rounded-xl bg-white border ${isPicked ? 'border-pink-500' : 'border-gray-200'}`}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : t.name)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full flex items-center gap-3 p-3 sm:p-4 text-left"
            >
              <TierBadge image={t.img} alt="" level="Novice" size={36} showLabel={false} />
              <span className="flex-1 min-w-0">
                <span className="block font-semibold text-gray-900">{t.name}</span>
                <span className="block text-xs text-gray-600">{t.label}</span>
              </span>
              {isPicked && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-600 text-white">Your track</span>}
              <svg className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div id={panelId} className="px-3 sm:px-4 pb-4">
                <p className="text-sm text-gray-700">{g.about}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-gray-500">Careers that fit</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {g.careers.map((c) => (
                    <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-800">{c}</span>
                  ))}
                </div>
                {onChoose && (
                  <button
                    type="button"
                    onClick={() => onChoose(t.name)}
                    className={`mt-3 text-sm font-semibold px-4 py-2 rounded-lg ${isPicked ? 'bg-gray-100 text-gray-700' : 'bg-pink-600 hover:bg-pink-700 text-white'}`}
                  >
                    {isPicked ? 'Chosen' : `Choose ${t.name}`}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TrackGuide;
