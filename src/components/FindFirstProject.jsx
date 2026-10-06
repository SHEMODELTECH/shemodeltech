// src/components/FindFirstProject.jsx
// "Recommended projects" on every member's dashboard: the open project that
// best fits her profile, leaving out projects she's already on.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchProjects } from '../utils/matchProjects';

const FindFirstProject = ({ profile, uid }) => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      // Single best match she isn't already on; "Browse all projects" covers the rest.
      const results = (await matchProjects(profile || {}, 10))
        .filter((p) => !uid || (!(p.members || []).includes(uid) && p.submitterId !== uid))
        .slice(0, 1);
      if (active) { setMatches(results); setLoading(false); }
    })();
    return () => { active = false; };
  }, [profile, uid]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="h-4 w-40 bg-gray-100 rounded animate-pulse mb-3" />
        <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  if (!matches.length) return null;

  return (
    <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Recommended projects</h2>
      <p className="text-gray-600 text-sm mb-4">
        Joining a team is the best way to grow: you build real work, earn verified badges, and get discovered. Here's a project that fits your profile.
      </p>

      <div className="space-y-3">
        {matches.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(`/projects/${p.id}`)}
            className="w-full text-left bg-white border border-gray-200 hover:border-pink-400 rounded-lg p-4 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-gray-900 font-semibold text-sm truncate">{p.projectTitle || p.title || 'Project'}</p>
                <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{(p.projectDescription || '').slice(0, 110)}{(p.projectDescription || '').length > 110 ? '…' : ''}</p>
                {p._reasons && p._reasons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p._reasons.slice(0, 2).map((r, i) => (
                      <span key={i} className="text-xs font-medium px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full">{r}</span>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold text-pink-600 flex-shrink-0 mt-1">View</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button onClick={() => navigate('/projects')} className="text-sm font-semibold text-pink-600 hover:text-pink-700">
          Browse all projects
        </button>
      </div>
    </div>
  );
};

export default FindFirstProject;
