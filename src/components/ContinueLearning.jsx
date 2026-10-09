// src/components/ContinueLearning.jsx
// Dashboard card: the courses a member has started (up to 3, most recent
// first), how far she's got, and a button back into each, plus how many
// courses she's completed. Reads the progress already saved on her profile
// (the same fields the Learning pages use), so it costs no extra reads.
// Hidden until she's started or finished a course. "Hide" folds it to one
// line (still with a Continue button), remembered on this device.
import React from 'react';
import { Link } from 'react-router-dom';
import CollapseToggle, { useCollapsed } from './CollapseToggle';
import { coursesForTrack, trackMeta } from '../utils/foundationsCourses';

const toMs = (v) => {
  if (!v) return 0;
  if (typeof v === 'number') return v;
  if (typeof v.toMillis === 'function') return v.toMillis();
  return new Date(v).getTime() || 0;
};

const ContinueLearning = ({ profile, uid }) => {
  const [collapsed, toggle] = useCollapsed('continue-learning', uid);
  if (!profile) return null;
  const enrolled = profile.learningEnrolled || {};
  const done = profile.foundationsCourses || {};
  const lastPart = profile.learningLastPart || {};

  const completedCount = Object.values(done).reduce((n, slugs) => n + Object.keys(slugs || {}).length, 0);

  // Started but not finished, built-in courses (mentor courses are listed in My learning).
  const started = [];
  Object.entries(enrolled).forEach(([track, slugs]) => {
    const catalog = coursesForTrack(track);
    Object.entries(slugs || {}).forEach(([slug, at]) => {
      if ((done[track] || {})[slug]) return;
      const course = catalog.find((c) => c.slug === slug);
      if (!course) return;
      const parts = course.partCount || 1;
      const part = Math.max(1, Number((lastPart[track] || {})[slug]) || 1);
      started.push({
        track,
        slug,
        part,
        title: course.title,
        trackLabel: trackMeta(track).label || track,
        progress: Math.min(1, (part - 1) / parts),
        at: toMs(at),
      });
    });
  });
  started.sort((a, b) => b.at - a.at);

  if (started.length === 0 && completedCount === 0) return null;

  const first = started[0];
  const continueUrl = (c) => `/learning/${c.track}/${c.slug}/learn?part=${c.part}`;

  if (collapsed) {
    return (
      <section className="mb-6 bg-white border border-gray-200 rounded-xl p-4" aria-labelledby="continue-learning-h">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <h2 id="continue-learning-h" className="text-base font-bold text-gray-900">Continue learning</h2>
            <p className="text-sm text-gray-600 truncate">
              {first
                ? `${started.length} ${started.length === 1 ? 'course' : 'courses'} in progress · ${first.title} ${Math.round(first.progress * 100)}%`
                : `${completedCount} ${completedCount === 1 ? 'course' : 'courses'} completed`}
            </p>
          </div>
          {first && (
            <Link to={continueUrl(first)} className="hidden sm:inline-block flex-shrink-0 text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">
              Continue
            </Link>
          )}
          <CollapseToggle collapsed onToggle={toggle} controls="continue-learning-body" />
        </div>
        {first && (
          <Link to={continueUrl(first)} className="sm:hidden mt-3 block text-center text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">
            Continue
          </Link>
        )}
      </section>
    );
  }

  return (
    <section className="mb-6 bg-white border border-gray-200 rounded-xl p-5 sm:p-6" aria-labelledby="continue-learning-h">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 id="continue-learning-h" className="text-lg font-bold text-gray-900">Continue learning</h2>
        <div className="flex items-center gap-4">
          <Link to="/learning/my" className="text-sm font-semibold text-pink-700 hover:underline whitespace-nowrap">My learning</Link>
          <CollapseToggle collapsed={false} onToggle={toggle} controls="continue-learning-body" />
        </div>
      </div>

      <div id="continue-learning-body">
      {started.length > 0 ? (
        <ul className="space-y-3">
          {started.slice(0, 3).map((c) => (
            <li key={`${c.track}/${c.slug}`} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-pink-700">{c.trackLabel}</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{c.title}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden" role="progressbar" aria-valuenow={Math.round(c.progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`${c.title} progress`}>
                    <div className="h-full bg-pink-600 rounded-full" style={{ width: `${Math.round(c.progress * 100)}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 w-9 text-right">{Math.round(c.progress * 100)}%</span>
                </div>
              </div>
              <Link
                to={continueUrl(c)}
                className="flex-shrink-0 text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg"
              >
                Continue
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-gray-600">Nothing in progress. Pick your next course whenever you're ready.</p>
          <Link to="/learning" className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-center">Browse courses</Link>
        </div>
      )}

      {completedCount > 0 && (
        <p className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{completedCount}</span> {completedCount === 1 ? 'course' : 'courses'} completed.{' '}
          <Link to="/learning/my" className="text-pink-700 font-semibold hover:underline">See your certificates</Link>
        </p>
      )}
      </div>
    </section>
  );
};

export default ContinueLearning;
