// src/components/SkillPicker.jsx
//
// Pick skills from a curated list, with a free-text fallback.
//
// Selection keeps the data consistent enough for companies to filter the
// Talent Board reliably, which is the point of collecting it at all. The
// "add your own" path exists because no list is complete, and telling a woman
// her skill isn't on our list is a poor first impression.
//
// Groups start collapsed except the first: seven expanded lists of ~20 skills
// is an intimidating wall on a phone.

import React, { useState, useMemo } from 'react';
import { SKILL_GROUPS, searchSkills } from '../utils/skillOptions';

const SkillPicker = ({ value = [], onChange, max = 20 }) => {
  const [query, setQuery] = useState('');
  const [openGroup, setOpenGroup] = useState(SKILL_GROUPS[0].track);
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

      {/* Grouped browse */}
      {!query.trim() && (
        <div className="space-y-1.5">
          {SKILL_GROUPS.map((g) => {
            const open = openGroup === g.track;
            const countInGroup = g.skills.filter((s) => selected.includes(s)).length;
            return (
              <div key={g.track} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenGroup(open ? null : g.track)}
                  className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    {g.track}
                    {countInGroup > 0 && (
                      <span className="ml-2 text-[10px] font-bold text-pink-600">
                        {countInGroup}
                      </span>
                    )}
                  </span>
                  <span className="text-gray-400 text-xs">{open ? '−' : '+'}</span>
                </button>
                {open && (
                  <div className="flex flex-wrap gap-1.5 p-3 pt-0">
                    {g.skills.map((s) => (
                      <Chip
                        key={s}
                        skill={s}
                        selected={selected.includes(s)}
                        onClick={() => toggle(s)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
