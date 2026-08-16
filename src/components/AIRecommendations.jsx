// src/components/AIRecommendations.jsx
// "Your best matches" - the single best AI-matched project and Foundations
// course for this member, based on their profile (background, roles, skills,
// badges, interests, industry interests).
// Individuals only; fails quietly (renders nothing) if the AI is unavailable.

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAIRecommendations } from '../utils/aiRecommendations';

const Spark = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const AIRecommendations = ({ currentUser }) => {
  const navigate = useNavigate();
  const [recs, setRecs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async (force = false) => {
    if (!currentUser) return;
    try {
      force ? setRefreshing(true) : setLoading(true);
      const r = await getAIRecommendations(currentUser, { force });
      setRecs(r);
      setFailed(false);
    } catch (e) {
      console.error('AI recommendations failed:', e);
      setFailed(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  useEffect(() => { load(false); }, [load]);

  // Nothing to show: stay out of the way (no error boxes on the dashboard).
  if (failed && !recs) return null;
  if (!loading && (!recs || (recs.projects.length === 0 && recs.courses.length === 0))) return null;

  const project = recs?.projects?.[0] || null;
  const course = recs?.courses?.[0] || null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 mb-6">
      <div className="flex items-center justify-between gap-3 mb-1">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-orange-400 text-white flex items-center justify-center"><Spark /></span>
          Your best matches
        </h2>
        <button
          onClick={() => load(true)}
          disabled={refreshing || loading}
          className="text-blue-600 hover:text-blue-700 text-xs font-semibold px-2 py-1 rounded-lg transition-all disabled:opacity-50"
          title="Refresh recommendations"
        >
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
      <p className="text-gray-400 text-xs mb-4">
        Picked for you by AI from your skills, badges, and interests.{' '}
        <Link to="/settings" className="text-blue-500 hover:text-blue-600 hover:underline">Keep your profile fresh</Link> for sharper matches.
      </p>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Best project */}
          {project && (
            <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all flex flex-col">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wide mb-1.5">Best project for you</p>
              <div className="flex items-start justify-between gap-2">
                <Link to={`/projects/${project.id}`} className="text-sm font-bold text-gray-900 hover:text-blue-600 leading-snug">
                  {project.title}
                </Link>
                <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                  {project.match}% match
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {project.needsLead && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">Needs a lead</span>}
                {project.paid && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Paid</span>}
                {project.industry && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{project.industry}</span>}
              </div>
              <p className="text-gray-600 text-xs mt-2 leading-relaxed flex-1">
                <Spark className="w-3 h-3 inline text-orange-400 mr-1 -mt-0.5" />{project.reason}
              </p>
              <button
                onClick={() => navigate(`/projects/${project.id}`)}
                className="mt-3 self-start bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
              >
                {project.needsLead ? 'View & apply to lead →' : 'View & apply →'}
              </button>
            </div>
          )}

          {/* Best course */}
          {course && (
            <div className="border border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-all flex flex-col">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wide mb-1.5">Best course for you</p>
              <Link to="/foundations" className="text-sm font-bold text-gray-900 hover:text-blue-600 leading-snug">
                {course.title}
              </Link>
              <div className="mt-1.5">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100">{course.trackLabel}</span>
              </div>
              <p className="text-gray-600 text-xs mt-2 leading-relaxed flex-1">
                <Spark className="w-3 h-3 inline text-orange-400 mr-1 -mt-0.5" />{course.reason}
              </p>
              <button
                onClick={() => navigate('/foundations')}
                className="mt-3 self-start bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
              >
                Start learning →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
