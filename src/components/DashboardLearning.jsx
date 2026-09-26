// src/components/DashboardLearning.jsx
// "Your learning" on the member dashboard: courses in progress (with a
// Continue link to the last part opened), how many are completed, and a way
// into She Model Tech Learning.
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { coursesForTrack, tracksWithCourses } from '../utils/foundationsCourses';
import { PUBLISHED_PREFIX, listPublished, toCatalogCourse } from '../utils/learningPublished';

const DashboardLearning = ({ profile }) => {
  const [published, setPublished] = useState([]);
  useEffect(() => {
    listPublished().then((l) => setPublished(l.map(toCatalogCourse))).catch(() => {});
  }, []);

  const { inProgress, completed } = useMemo(() => {
    const enrolled = profile?.learningEnrolled || {};
    const done = profile?.foundationsCourses || {};
    const last = profile?.learningLastPart || {};
    const find = (track, slug) =>
      slug.startsWith(PUBLISHED_PREFIX)
        ? published.find((p) => p.slug === slug)
        : tracksWithCourses().includes(track)
        ? coursesForTrack(track).find((c) => c.slug === slug)
        : null;
    const rows = [];
    Object.entries(enrolled).forEach(([track, slugs]) =>
      Object.entries(slugs || {}).forEach(([slug, at]) => {
        if ((done[track] || {})[slug]) return;
        const c = find(track, slug);
        if (c) rows.push({ track, slug, title: c.title, part: (last[track] || {})[slug] || 1, at: String(at || '') });
      })
    );
    rows.sort((a, b) => b.at.localeCompare(a.at));
    const completedCount = Object.values(done).reduce((n, t) => n + Object.values(t || {}).filter(Boolean).length, 0);
    return { inProgress: rows, completed: completedCount };
  }, [profile, published]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Your learning</h3>
        <Link to="/learning/my" className="text-pink-600 text-sm font-semibold hover:underline">My learning</Link>
      </div>
      {inProgress.length === 0 ? (
        <p className="text-gray-500 text-sm">
          {completed > 0
            ? `You've completed ${completed} course${completed === 1 ? '' : 's'}. Pick your next one in Learning.`
            : 'Build your skills with free, hands-on courses, and earn a certificate for each one you finish.'}
        </p>
      ) : (
        <ul className="space-y-2">
          {inProgress.slice(0, 3).map((c) => (
            <li key={c.track + c.slug} className="flex items-center justify-between gap-3 border border-gray-100 rounded-lg p-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{c.title}</p>
                <p className="text-xs text-gray-500">{c.part > 1 ? `Part ${c.part}` : 'Not started yet'}</p>
              </div>
              <Link
                to={`/learning/${c.track}/${c.slug}/learn${c.part > 1 ? `?part=${c.part}` : ''}`}
                className="flex-shrink-0 text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg"
              >
                Continue
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <Link to="/learning" className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
          Browse courses
        </Link>
        {completed > 0 && (
          <span className="text-xs text-gray-500">{completed} completed, each with a certificate</span>
        )}
      </div>
    </div>
  );
};

export default DashboardLearning;
