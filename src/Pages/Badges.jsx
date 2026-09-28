// src/Pages/Badges.jsx
// How badges work: tracks, levels, and what they unlock.
import React from 'react';
import { Link } from 'react-router-dom';
import TierBadge from '../components/TierBadge';

const TRACKS = [
  ['TechPO', '/Images/TechMO.png', 'Product / Project Owner', 'Leading projects, planning, and product decisions.'],
  ['TechQA', '/Images/TechQA.png', 'Quality Assurance', 'Testing, finding bugs, and making sure the product works.'],
  ['TechDev', '/Images/TechDev.png', 'Development', 'Writing code: frontend, backend, data, and AI.'],
  ['TechLeads', '/Images/TechLeads.png', 'Non-Technical Roles', 'Design, research, content, marketing, and operations.'],
  ['TechArchs', '/Images/TechArchs.png', 'Low/No-Code Developer', 'Building with tools like Webflow, Bubble, and automation platforms.'],
  ['TechGuard', '/Images/TechGuard.png', 'Cybersecurity', 'Keeping products and people safe.'],
];

const LEVELS = [
  ['Novice', 'Steel', 'Your 1st and 2nd completed projects in a track.'],
  ['Associate', 'Bronze', 'Your 3rd to 6th projects in a track.'],
  ['Advanced', 'Silver', 'Your 7th to 11th projects in a track.'],
  ['Expert', 'Gold', 'Your 12th project in a track, and beyond.'],
];

const Badges = () => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">How badges work</h1>
    <p className="text-gray-600 mt-2 max-w-[65ch]">
      Badges are verified proof of real work. You earn one each time you complete a She Model Tech project, in the track
      that matches your role on the team. They’re never bought, and never given for courses alone.
    </p>

    <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">How you earn one</h2>
    <ol className="grid sm:grid-cols-3 gap-3 list-none p-0">
      {[
        ['Join a project', 'Apply for a role on a free She Model Tech project, or lead one.'],
        ['Build with your team', 'Work together in the project workspace until the work is done.'],
        ['Get reviewed', 'She Model Tech reviews the finished work and awards badges based on each person’s role and contribution.'],
      ].map(([t, d], i) => (
        <li key={t} className="rounded-xl bg-white border border-gray-200 p-4">
          <p className="text-sm font-bold text-pink-700">{i + 1}. {t}</p>
          <p className="text-sm text-gray-700 mt-1">{d}</p>
        </li>
      ))}
    </ol>
    <p className="text-xs text-gray-500 mt-2">Paid projects pay you instead of awarding badges, and give you a verified paid work-experience record.</p>

    <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">Six tracks</h2>
    <div className="grid sm:grid-cols-2 gap-3">
      {TRACKS.map(([name, img, label, desc]) => (
        <div key={name} className="flex items-center gap-4 rounded-xl bg-white border border-gray-200 p-4">
          <TierBadge image={img} alt={name} level="Novice" size={48} showLabel={false} />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900">{name} <span className="text-gray-500 font-normal">· {label}</span></p>
            <p className="text-sm text-gray-600">{desc}</p>
          </div>
        </div>
      ))}
    </div>

    <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">Four levels</h2>
    <p className="text-sm text-gray-600 mb-3">Each track has its own level. The more projects you complete in a track, the higher it goes.</p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {LEVELS.map(([lvl, metal, desc]) => (
        <div key={lvl} className="rounded-xl bg-white border border-gray-200 p-4 text-center">
          <div className="flex justify-center">
            <TierBadge image="/Images/TechDev.png" alt={`${lvl} badge`} level={lvl} size={56} />
          </div>
          <p className="font-bold text-gray-900 mt-2">{lvl}</p>
          <p className="text-xs text-gray-500">{metal}</p>
          <p className="text-sm text-gray-700 mt-2">{desc}</p>
        </div>
      ))}
    </div>

    <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">What badges unlock</h2>
    <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
      <li><strong>The Talent Board:</strong> your first badge lists you where hiring companies search for talent.</li>
      <li><strong>Paid work:</strong> paid projects are open to members with at least one earned badge.</li>
      <li><strong>Bigger roles:</strong> intermediate roles need an Associate badge in that track, and advanced roles need an Advanced one.</li>
      <li><strong>Proposing projects:</strong> once you have a badge, you can propose your own project to lead.</li>
      <li><strong>A verifiable record:</strong> every badge links to the real project, so employers can see exactly what you built.</li>
    </ul>

    <div className="mt-8 rounded-2xl bg-pink-50 border border-pink-100 p-5 flex flex-wrap items-center justify-between gap-3">
      <p className="m-0 font-semibold text-gray-900">Ready to earn your next badge?</p>
      <Link to="/projects" className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">Find a project</Link>
    </div>
  </div>
);

export default Badges;
