// src/components/BadgeShowcase.jsx
// A member's badge at a glance: her strongest track's current level, large in
// the middle, with the level before it and the next one faded on either side.
// Other tracks she's earned in sit underneath as small medals. Few words.
// Used on the dashboard and her profile.
import React from 'react';
import { Link } from 'react-router-dom';
import TierBadge from './TierBadge';
import { BADGE_TRACKS, badgesInTrack, levelForCount } from '../config/badgeTracks';

const LEVELS = ['Novice', 'Associate', 'Advanced', 'Expert'];
const NEEDS = { Novice: 1, Associate: 3, Advanced: 7, Expert: 12 }; // badges in the track

// Per-track counts, strongest first (her chosen track wins a tie).
export const trackStandings = (profile) =>
  BADGE_TRACKS.map((t) => ({ ...t, count: badgesInTrack(profile, t.key) }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count || (a.name === profile?.primarySkillTrack ? -1 : 0));

const Side = ({ track, level, note }) => (
  <div className="flex flex-col items-center text-center w-20 sm:w-28 opacity-50">
    <TierBadge image={track.img} alt={`${track.name} ${level}`} level={level} size={52} showLabel={false} />
    <p className="mt-2 text-[11px] sm:text-xs font-semibold text-gray-700 leading-tight">{track.name} {level}</p>
    <p className="text-[10px] sm:text-[11px] text-gray-500 leading-tight">{note}</p>
  </div>
);

const BadgeShowcase = ({ profile, completedProjects = null, own = true, className = '' }) => {
  const standings = trackStandings(profile);
  const top = standings[0];

  // No badge yet: her track's medal, greyed, and one way forward.
  if (!top) {
    const track = BADGE_TRACKS.find((t) => t.name === profile?.primarySkillTrack) || BADGE_TRACKS[0];
    return (
      <div className={`rounded-2xl bg-gray-50 border border-gray-200 p-5 sm:p-6 text-center ${className}`}>
        <div className="flex justify-center">
          <TierBadge image={track.img} alt={track.name} level="Novice" size={88} showLabel={false} earned={false} />
        </div>
        <p className="mt-3 font-bold text-gray-900">No badge yet</p>
        <p className="text-sm text-gray-600">{own ? 'Finish a project to earn your first.' : 'Badges appear here as projects are completed.'}</p>
        {own && (
          <Link to="/projects" className="inline-block mt-4 text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">
            Find a project
          </Link>
        )}
      </div>
    );
  }

  const level = levelForCount(top.count) || 'Novice';
  const i = LEVELS.indexOf(level);
  const prev = i > 0 ? LEVELS[i - 1] : null;
  const next = i < LEVELS.length - 1 ? LEVELS[i + 1] : null;
  const toNext = next ? NEEDS[next] - top.count : 0;
  const others = standings.slice(1);

  return (
    <div className={`rounded-2xl bg-[#FDF2F7] border border-pink-100 p-4 sm:p-6 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
        <p className="text-gray-600">Current badge: <span className="font-bold text-gray-900">{top.name} {level}</span></p>
        {completedProjects !== null && (
          <p className="text-gray-600">Completed projects: <span className="font-bold text-gray-900">{completedProjects}</span></p>
        )}
      </div>

      <div className="mt-5 flex items-center justify-center gap-3 sm:gap-8">
        {prev ? <Side track={top} level={prev} note="Earned" /> : <div className="w-20 sm:w-28" aria-hidden="true" />}
        <div className="flex flex-col items-center text-center">
          <TierBadge image={top.img} alt={`${top.name} ${level}`} level={level} size={96} showLabel={false} />
          <p className="mt-3 font-bold text-gray-900">{top.name} {level}</p>
          <p className="text-xs text-gray-600">Current badge</p>
        </div>
        {next
          ? <Side track={top} level={next} note={`${toNext} more project${toNext === 1 ? '' : 's'}`} />
          : <div className="w-20 sm:w-28 text-center text-xs font-semibold text-gray-700">Top level</div>}
      </div>

      {(others.length > 0 || own) && (
        <div className="mt-5 pt-4 border-t border-pink-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {others.map((t) => {
              const lvl = levelForCount(t.count) || 'Novice';
              return (
                <span key={t.key} className="inline-flex items-center gap-2" title={`${t.name} ${lvl}`}>
                  <TierBadge image={t.img} alt={`${t.name} ${lvl}`} level={lvl} size={28} showLabel={false} />
                  <span className="text-xs font-semibold text-gray-800">{t.name} {lvl}</span>
                </span>
              );
            })}
          </div>
          <Link to="/badges" className="text-sm font-semibold text-pink-700 hover:underline whitespace-nowrap">How badges work</Link>
        </div>
      )}
    </div>
  );
};

export default BadgeShowcase;
