// src/components/FindFirstProject.jsx
// Cold-start helper: surfaces matched projects so a new member can join one in
// their first session. Steers toward team projects with open beginner roles.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchProjects } from '../utils/matchProjects';

const FindFirstProject = ({ profile }) => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const results = await matchProjects(profile || {}, 1); // single best match - "Browse all projects" covers the rest
      if (active) { setMatches(results); setLoading(false); }
    })();
    return () => { active = false; };
  }, [profile]);

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
    <div className="bg-gradient-to-br from-blue-50 to-orange-50 border border-blue-200 rounded-xl p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Find your first project</h2>
      <p className="text-gray-600 text-sm mb-4">
        Joining a team is the best way to start: you build real work, earn verified badges, and get discovered. Here's a project that fits your profile.
      </p>

      <div className="space-y-3">
        {matches.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(`/projects/${p.id}`)}
            className="w-full text-left bg-white border border-gray-200 hover:border-blue-400 rounded-lg p-4 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-gray-900 font-semibold text-sm truncate">{p.projectTitle || p.title || 'Project'}</p>
                <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{(p.projectDescription || '').slice(0, 110)}{(p.projectDescription || '').length > 110 ? '…' : ''}</p>
                {p._reasons && p._reasons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p._reasons.slice(0, 2).map((r, i) => (
                      <span key={i} className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{r}</span>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold text-blue-600 flex-shrink-0 mt-1">View</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button onClick={() => navigate('/projects')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          Browse all projects
        </button>
        <span className="text-gray-300">·</span>
        <button onClick={() => navigate('/projects/submit')} className="text-sm font-medium text-gray-500 hover:text-gray-700">
          Or start your own
        </button>
      </div>
    </div>
  );
};

export default FindFirstProject;
