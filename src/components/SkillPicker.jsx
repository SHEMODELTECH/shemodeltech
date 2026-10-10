// src/components/SkillPicker.jsx
//
// Pick skills from a curated list, with a free-text fallback.
//
// Selection keeps the data consistent enough for companies to filter the
// Talent Board reliably, which is the point of collecting it at all. The
// "add your own" path exists because no list is complete, and telling a woman
// her skill isn't on our list is a poor first impression.
//
// No category boxes: she sees a dozen chips straight away, picked for the track
// she chose (a general mix if she hasn't chosen one), and "Show more skills"
// opens every other skill as one flat list. Search covers everything.

import React, { useState, useMemo } from 'react';
import { ALL_SKILLS, suggestedFor, searchSkills } from '../utils/skillOptions';

const SkillPicker = ({ value = [], onChange, max = 20, track = '' }) => {
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const suggested = suggestedFor(track);
  const rest = useMemo(() => ALL_SKILLS.filter((x) => !suggested.includes(x)), [suggested]);
  const selected = Array.isArray(value) ? value : [];

  const results = useMemo(() => searchSkills(query), [query]);
  const custom = query.trim();
  const canAddCustom =
    custom.length > 1 &&
    !results.some((r) => r.toLowerCase() === custom.toLowerCase()) &&
    !selected.some((s) => s.toLowerCase() === custom.toLowerCase());

  const toggle = (skill) => {
    if (selected.includes(skill)) {
      onChange(selected.filter((s) => s !== skill));
      return;
    }
    if (selected.length >= max) return;
    onChange([...selected, skill]);
  };

  const addCustom = () => {
    if (!canAddCustom || selected.length >= max) return;
    onChange([...selected, custom]);
    setQuery('');
  };

  return (
    <div>
      {/* Selected */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {selected.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              className="inline-flex items-center gap-1.5 bg-pink-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-pink-700 transition-colors"
            >
              {s}
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Remove {s}</span>
            </button>
          ))}
        </div>
      )}

      {/* Search / add your own */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (results.length === 1) toggle(results[0]);
              else addCustom();
            }
          }}
          placeholder="Search skills, or type your own"
          className="flex-1 min-w-0 px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-pink-500 text-sm outline-none"
        />
        {canAddCustom && (
          <button
            type="button"
            onClick={addCustom}
            className="shrink-0 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 rounded-lg"
          >
            Add
          </button>
        )}
      </div>

      {/* Search results */}
      {query.trim() && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {results.length === 0 && !canAddCustom && (
            <p className="text-gray-400 text-xs">No matches. Type it out and tap Add.</p>
          )}
          {results.map((s) => (
            <Chip key={s} skill={s} selected={selected.includes(s)} onClick={() => toggle(s)} />
          ))}
        </div>
      )}

      {/* Suggested chips, then every other skill on request */}
      {!query.trim() && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">{track && suggested !== suggestedFor('') ? `Popular for ${track}` : 'Popular skills'}</p>
          <div className="flex flex-wrap gap-1.5">
            {suggested.map((s) => (
              <Chip key={s} skill={s} selected={selected.includes(s)} onClick={() => toggle(s)} />
            ))}
          </div>
          {showAll && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {rest.map((s) => (
                <Chip key={s} skill={s} selected={selected.includes(s)} onClick={() => toggle(s)} />
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="mt-2 text-sm font-semibold text-pink-700 hover:underline"
          >
            {showAll ? 'Show fewer skills' : 'Show more skills'}
          </button>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        {selected.length === 0
          ? 'Pick at least one. Anything you can already do counts, including non-technical strengths.'
          : `${selected.length} selected${selected.length >= max ? ' (max)' : ''}`}
      </p>
    </div>
  );
};

const Chip = ({ skill, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
      selected
        ? 'bg-pink-600 border-pink-600 text-white'
        : 'bg-white border-gray-300 text-gray-700 hover:border-pink-400'
    }`}
  >
    {skill}
  </button>
);

export default SkillPicker;
