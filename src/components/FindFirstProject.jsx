// src/components/FindFirstProject.jsx
// "Recommended for you" on every member's dashboard: up to three open projects
// that fit her profile. The AI's best match comes first (with its reason),
// then the closest profile matches, leaving out projects she's already on.
// One card instead of two, so the dashboard stays short.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchProjects } from '../utils/matchProjects';
import { getAIRecommendations } from '../utils/aiRecommendations';

const SHOW = 3;

const FindFirstProject = ({ profile, uid, currentUser }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      // The AI match is a bonus: if it's unavailable, the profile matches still show.
      const [ai, rules] = await Promise.all([
        currentUser ? getAIRecommendations(currentUser).catch(() => null) : Promise.resolve(null),
        matchProjects(profile || {}, 10).catch(() => []),
      ]);
      const list = [];
      const seen = new Set();
      const add = (it) => {
        if (!it.id || seen.has(it.id) || list.length >= SHOW) return;
        seen.add(it.id);
        list.push(it);
      };
      const top = ai?.projects?.[0];
      if (top) {
        add({
          id: top.id,
          title: top.title,
          blurb: top.reason || '',
          tags: [top.needsLead && 'Needs a lead', top.paid && 'Paid', top.match && `${top.match}% match`].filter(Boolean),
        });
      }
      rules
        .filter((p) => !uid || (!(p.members || []).includes(uid) && p.submitterId !== uid))
        .forEach((p) =>
          add({
            id: p.id,
            title: p.projectTitle || p.title || 'Project',
            blurb: (p.projectDescription || '').length > 110 ? `${p.projectDescription.slice(0, 110)}…` : p.projectDescription || '',
            tags: (p._reasons || []).slice(0, 2),
          })
        );
      if (active) setItems(list);
    })();
    return () => { active = false; };
  }, [profile, uid, currentUser]);

  if (items === null) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="h-4 w-40 bg-gray-100 rounded animate-pulse mb-3" />
        <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }
  if (!items.length) return null;

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 mb-6" aria-labelledby="recommended-h">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 id="recommended-h" className="text-lg font-bold text-gray-900">Recommended for you</h2>
        <button onClick={() => navigate('/projects')} className="text-sm font-semibold text-pink-700 hover:underline whitespace-nowrap">
          All projects
        </button>
      </div>
      <div className="space-y-3">
        {items.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(`/projects/${p.id}`)}
            className="w-full text-left bg-white border border-gray-200 hover:border-pink-400 rounded-lg p-4 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-gray-900 font-semibold text-sm truncate">{p.title}</p>
                {p.blurb && <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{p.blurb}</p>}
                {p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.tags.map((t, i) => (
                      <span key={i} className="text-xs font-medium px-2 py-0.5 bg-pink-50 text-pink-700 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold text-pink-600 flex-shrink-0 mt-1">View</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default FindFirstProject;
