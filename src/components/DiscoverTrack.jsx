// src/components/DiscoverTrack.jsx
// Helps anyone — a non-tech person curious about tech, or a CS grad who's unsure —
// find which of the 6 badge-tracks fits them, based on their background and interests.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { suggestTracks, TRACKS } from '../utils/roleTaxonomy';

const INTEREST_OPTIONS = [
  'Building things / writing code',
  'Designing how things look and work',
  'Finding problems and ensuring quality',
  'Security, infrastructure, and systems',
  'Planning, organising, analysing data',
  'Leading and mentoring people',
  'Research and analysis',
  'Writing and documentation',
];

const DiscoverTrack = ({ onPickTrack }) => {
  const navigate = useNavigate();
  const [field, setField] = useState('');
  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState(null);

  const toggle = (opt) => {
    setSelected(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
  };

  const handleSubmit = () => {
    const text = [field, ...selected].join(' ');
    const ranked = suggestTracks(text);
    // If nothing scored, still show the top general tracks rather than an empty result.
    const top = ranked.some(t => t._score > 0) ? ranked.filter(t => t._score > 0).slice(0, 3) : TRACKS.slice(0, 3);
    setResults(top);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      {!results ? (
        <>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Discover your tech track</h2>
          <p className="text-gray-600 text-sm mb-4">
            New to tech, switching fields, or not sure which role fits you? Tell us a little about yourself and we'll point you to the right track and roles.
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-1">What's your background or field?</label>
          <input
            type="text"
            value={field}
            onChange={e => setField(e.target.value)}
            placeholder="e.g., chemistry, finance, computer science, design, marketing"
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none mb-4"
          />

          <p className="text-sm font-medium text-gray-700 mb-2">What kind of work interests you? (pick any)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
            {INTEREST_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={`text-left text-sm px-3 py-2 rounded-lg border transition-all ${
                  selected.includes(opt)
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!field.trim() && selected.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all"
          >
            Show my tracks
          </button>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Tracks that fit you</h2>
          <p className="text-gray-600 text-sm mb-4">Based on what you shared, these tracks suit you best. Each leads to a verified badge as you complete real projects.</p>

          <div className="space-y-3">
            {results.map(track => (
              <div key={track.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <img src={`/Images/${track.badge}.png`} alt={track.badge} className="w-8 h-8 flex-shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{track.badge} - {track.label}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{track.summary}</p>
                <p className="text-xs text-gray-500">Roles: {track.roles.join(', ')}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-5">
            <button onClick={() => navigate('/projects')} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all">
              Find projects in these tracks
            </button>
            <button onClick={() => setResults(null)} className="text-sm font-medium text-gray-500 hover:text-gray-700">
              Start over
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DiscoverTrack;
