// src/components/BadgeShowcase.jsx
// A member's badge, small and to the point:
//   BadgeTile - the "current badge" box in the profile header (medal, level,
//               "Current badge"), like a trophy card.
//   BadgeRow  - one slim row for the dashboard: medal, level, how far to the
//               next one, and any other tracks.
// Her strongest track is the one shown (her chosen track wins a tie).
import React from 'react';
import { Link } from 'react-router-dom';
import TierBadge from './TierBadge';
import { BADGE_TRACKS, badgesInTrack, levelForCount } from '../config/badgeTracks';

const LEVELS = ['Novice', 'Associate', 'Advanced', 'Expert'];
const NEEDS = { Novice: 1, Associate: 3, Advanced: 7, Expert: 12 }; // badges in the track

// Per-track counts, strongest first.
export const trackStandings = (profile) =>
  BADGE_TRACKS.map((t) => ({ ...t, count: badgesInTrack(profile, t.key) }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count || (a.name === profile?.primarySkillTrack ? -1 : 0));

const ownTrack = (profile) => BADGE_TRACKS.find((t) => t.name === profile?.primarySkillTrack) || BADGE_TRACKS[0];

const describe = (top) => {
  const level = levelForCount(top.count) || 'Novice';
  const next = LEVELS[LEVELS.indexOf(level) + 1] || null;
  const toNext = next ? NEEDS[next] - top.count : 0;
  return { level, next, toNext };
};

// Profile header: the current badge as a small trophy card.
export const BadgeTile = ({ profile, className = '' }) => {
  const standings = trackStandings(profile);
  const top = standings[0];
  if (!top) {
    const t = ownTrack(profile);
    return (
      <Link to="/badges" className={`flex flex-col items-center text-center rounded-xl bg-[#FDF2F7] border border-pink-100 px-5 py-4 w-full sm:w-44 ${className}`}>
        <TierBadge image={t.img} alt="No badge yet" level="Novice" size={56} showLabel={false} earned={false} />
        <p className="mt-2 text-sm font-bold text-gray-700">No badge yet</p>
        <p className="text-xs text-gray-500">Current badge</p>
      </Link>
    );
  }
  const { level } = describe(top);
  const more = standings.length - 1;
  return (
    <Link to="/badges" title="How badges work" className={`flex flex-col items-center text-center rounded-xl bg-[#FDF2F7] border border-pink-100 px-5 py-4 w-full sm:w-44 ${className}`}>
      <TierBadge image={top.img} alt={`${top.name} ${level}`} level={level} size={64} showLabel={false} />
      <p className="mt-2 text-sm font-bold text-gray-900">{top.name} {level}</p>
      <p className="text-xs text-gray-600">Current badge</p>
      {more > 0 && <p className="mt-1 text-[11px] font-semibold text-pink-700">+{more} more track{more === 1 ? '' : 's'}</p>}
    </Link>
  );
};

// Dashboard: one slim row.
export const BadgeRow = ({ profile }) => {
  const standings = trackStandings(profile);
  const top = standings[0];
  if (!top) {
    const t = ownTrack(profile);
    return (
      <div className="flex items-center gap-3">
        <TierBadge image={t.img} alt="No badge yet" level="Novice" size={36} showLabel={false} earned={false} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">No badge yet</p>
          <p className="text-xs text-gray-500">Finish a project to earn your first.</p>
        </div>
        <Link to="/projects" className="flex-shrink-0 text-sm font-semibold text-pink-700 hover:underline">Find a project</Link>
      </div>
    );
  }
  const { level, next, toNext } = describe(top);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <TierBadge image={top.img} alt={`${top.name} ${level}`} level={level} size={44} showLabel={false} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900">{top.name} {level}</p>
        <p className="text-xs text-gray-500">
          {next ? `${toNext} more project${toNext === 1 ? '' : 's'} to ${next}` : 'Top level'}
        </p>
      </div>
      {standings.slice(1).map((t) => {
        const lvl = levelForCount(t.count) || 'Novice';
        return (
          <span key={t.key} className="inline-flex items-center gap-1.5" title={`${t.name} ${lvl}`}>
            <TierBadge image={t.img} alt={`${t.name} ${lvl}`} level={lvl} size={24} showLabel={false} />
            <span className="text-xs font-semibold text-gray-700">{t.name}</span>
          </span>
        );
      })}
      <Link to="/badges" className="flex-shrink-0 text-sm font-semibold text-pink-700 hover:underline">How badges work</Link>
    </div>
  );
};
