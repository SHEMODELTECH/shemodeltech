// src/Pages/Badges.jsx
// How badges work, shown mostly with the medals themselves: how you earn one,
// the four levels, the six tracks, and what they unlock. Few words.
import React from 'react';
import { Link } from 'react-router-dom';
import TierBadge from '../components/TierBadge';
import TrackGuide from '../components/TrackGuide';

const LEVELS = [
  ['Novice', '1+ project', 56],
  ['Associate', '3+ projects', 64],
  ['Advanced', '7+ projects', 72],
  ['Expert', '12+ projects', 80],
];

const Badges = () => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">How badges work</h1>
    <p className="text-gray-600 mt-2">Verified proof of real work. Earned on projects, never bought.</p>

    {/* How you earn one */}
    <ol className="mt-6 grid grid-cols-3 gap-2 sm:gap-3 list-none p-0">
      {['Join a project', 'Build with your team', 'Get reviewed'].map((t, i) => (
        <li key={t} className="rounded-xl bg-white border border-gray-200 p-3 sm:p-4 text-center">
          <span className="mx-auto w-7 h-7 rounded-full bg-pink-600 text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
          <p className="mt-2 text-sm font-semibold text-gray-900">{t}</p>
        </li>
      ))}
    </ol>

    {/* Four levels, per track */}
    <section className="mt-8 rounded-2xl bg-[#FDF2F7] border border-pink-100 p-5 sm:p-6" aria-labelledby="levels-h">
      <h2 id="levels-h" className="text-lg font-bold text-gray-900">Four levels in each track</h2>
      <div className="mt-5 grid grid-cols-4 gap-2 items-end">
        {LEVELS.map(([lvl, needs, size]) => (
          <div key={lvl} className="flex flex-col items-center text-center">
            <TierBadge image="/Images/TechDev.png" alt={`${lvl} badge`} level={lvl} size={size} showLabel={false} />
            <p className="mt-2 text-sm font-bold text-gray-900">{lvl}</p>
            <p className="text-xs text-gray-600">{needs}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Six tracks: tap one to see what it's about and the careers that fit */}
    <h2 className="text-lg font-bold text-gray-900 mt-8">Six tracks</h2>
    <p className="text-sm text-gray-600 mt-1 mb-3">Tap a track to see the careers that fit it.</p>
    <TrackGuide columns={2} />

    {/* What they unlock */}
    <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">What badges unlock</h2>
    <div className="flex flex-wrap gap-2">
      {['A place on the Talent Board', 'Paid projects', 'A record employers can check'].map((t) => (
        <span key={t} className="text-sm font-semibold px-3 py-1.5 rounded-full bg-white border border-pink-200 text-gray-800">{t}</span>
      ))}
    </div>
    <p className="text-xs text-gray-500 mt-3">Paid projects pay you instead of awarding a badge.</p>

    <div className="mt-8 rounded-2xl bg-pink-50 border border-pink-100 p-5 flex flex-wrap items-center justify-between gap-3">
      <p className="m-0 font-semibold text-gray-900">Ready for your next badge?</p>
      <Link to="/projects" className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">Find a project</Link>
    </div>
  </div>
);

export default Badges;
