// src/Pages/learning/LearningHome.jsx
// The course catalog at /learning: search, filters, a "Continue learning" row
// for enrolled members, and every course as a card in a grid, grouped by track.
// Also serves /learning/my ("My learning"): only the member's enrolled courses.

import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LearningLayout, { signInAndReturn } from './LearningLayout';
import { CheckIcon, TRACK_ORDER, coursePartTitles, formatTime, look, useLearning } from './shared';
import { coursesForTrack, trackMeta, tracksWithCourses } from '../../utils/foundationsCourses';

// "Coding Developer Foundations" -> "Coding Developer"
export const trackName = (t) => trackMeta(t).label.replace(/\s+Foundations$/, '');

const LEVELS = ['Beginner', 'Project-based', 'Advanced'];

const courseUrl = (c) => `/learning/${c.track}/${c.slug}`;

// ---------- Course card ----------
export const CourseCard = ({ course, status, progress }) => {
  const L = look(course.track);
  return (
    <Link to={courseUrl(course)} className="lr-card group" style={{ '--c': L.accent, '--t': L.tint }}>
      <div className="lr-card-top">
        <span className="text-xs font-semibold" style={{ color: L.accent }}>
          {L.short}
        </span>
        {L.img ? (
          <img src={L.img} alt="" className="w-11 h-12 object-contain" />
        ) : (
          <span className="w-9 h-9 rounded-full" style={{ background: L.accent }} aria-hidden="true" />
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-[15px] leading-snug line-clamp-2 group-hover:underline decoration-1 underline-offset-2">
          {course.title}
        </h3>
        {course.summary && <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{course.summary}</p>}
        <div className="mt-auto pt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          {course.level && <span className="font-semibold text-gray-700">{course.level}</span>}
          {course.minutes > 0 && <span>{formatTime(course.minutes)}</span>}
          {course.kind === 'interactive' && <span className="lr-inter">Interactive</span>}
        </div>
        {status === 'done' && (
          <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <CheckIcon className="w-3.5 h-3.5" /> Completed
          </p>
        )}
        {status === 'enrolled' && (
          <div className="mt-3">
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${Math.round(progress * 100)}%`, background: L.accent }} />
            </div>
            <p className="text-xs text-gray-500 mt-1">In progress</p>
          </div>
        )}
      </div>
    </Link>
  );
};

const LearningHome = ({ mine = false }) => {
  const navigate = useNavigate();
  const lr = useLearning();
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState('all');
  const [level, setLevel] = useState('all');

  // Every course, tagged with its track, in authored order.
  const all = useMemo(() => {
    const tracks = [...TRACK_ORDER, 'company'].filter((t) => tracksWithCourses().includes(t));
    return tracks.flatMap((t) => coursesForTrack(t).map((c) => ({ ...c, track: t })));
  }, []);

  const statusOf = (c) => (lr.isDone(c.track, c.slug) ? 'done' : lr.isEnrolled(c.track, c.slug) ? 'enrolled' : null);
  const progressOf = (c) => {
    const n = coursePartTitles(c).length || 1;
    return Math.min(1, (lr.lastPartOf(c.track, c.slug) - 1) / n);
  };

  const inProgress = all.filter((c) => statusOf(c) === 'enrolled');

  const q = query.trim().toLowerCase();
  const filtered = all.filter(
    (c) =>
      (!mine || statusOf(c)) &&
      (track === 'all' || c.track === track) &&
      (level === 'all' || c.level === level) &&
      (!q || `${c.title} ${c.summary} ${trackMeta(c.track).label}`.toLowerCase().includes(q))
  );
  const grouped = !mine && track === 'all' && level === 'all' && !q;

  const chip = (id, label) => (
    <button
      key={id}
      onClick={() => setTrack(id)}
      aria-pressed={track === id}
      className={`lr-chip ${track === id ? 'is-active' : ''}`}
    >
      {label}
    </button>
  );

  return (
    <LearningLayout>
      {/* Hero */}
      {!mine ? (
        <section className="lr-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <p className="text-sm font-semibold text-pink-700 mb-3">She Model Tech Learning</p>
            <h1 className="fd-display text-4xl sm:text-5xl text-gray-900 max-w-3xl">
              Learn the skills. Prove them on real projects.
            </h1>
            <p className="text-gray-600 text-lg mt-4 max-w-2xl">
              {all.length} free, hands-on courses across six tech tracks, from your first program to AI
              engineering, product, security, and leadership.
            </p>
            <div className="mt-7 max-w-xl relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses: Python, Agile, API testing"
                aria-label="Search courses"
                className="w-full rounded-xl border border-gray-300 bg-white pl-12 pr-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
          <h1 className="fd-display text-3xl sm:text-4xl text-gray-900">My learning</h1>
          <p className="text-gray-600 mt-2">Courses you&rsquo;ve enrolled in, and the ones you&rsquo;ve finished.</p>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Continue learning */}
        {!mine && lr.signedIn && inProgress.length > 0 && !q && (
          <section className="pt-10" aria-labelledby="continue-h">
            <h2 id="continue-h" className="text-xl font-bold text-gray-900 mb-4">Continue learning</h2>
            <div className="lr-grid">
              {inProgress.slice(0, 4).map((c) => (
                <CourseCard key={c.track + c.slug} course={c} status="enrolled" progress={progressOf(c)} />
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <section className="pt-10" aria-label="Filter courses">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
            <div className="lr-chips">
              {chip('all', 'All tracks')}
              {TRACK_ORDER.filter((t) => tracksWithCourses().includes(t)).map((t) => chip(t, look(t).short))}
              {tracksWithCourses().includes('company') && chip('company', 'For companies')}
            </div>
            <div className="flex items-center gap-3">
              {mine && (
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search my courses"
                  aria-label="Search my courses"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              )}
              <label className="sr-only" htmlFor="lr-level">Level</label>
              <select
                id="lr-level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="all">All levels</option>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Courses */}
        {mine && !lr.loading && !lr.signedIn ? (
          <div className="text-center py-20">
            <p className="text-gray-900 font-semibold mb-2">Sign in to see your courses</p>
            <button onClick={() => signInAndReturn(navigate, '/learning/my')} className="fd-btn" style={{ '--acc': '#DB2777' }}>Sign in</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-900 font-semibold mb-1">
              {mine ? 'You haven\u2019t enrolled in a course yet' : 'No courses match that search'}
            </p>
            <p className="text-gray-500 text-sm mb-5">
              {mine ? 'Browse the catalog and enroll in anything that interests you. Every course is free.' : 'Try a different word, or clear the filters.'}
            </p>
            {mine ? (
              <Link to="/learning" className="fd-btn" style={{ '--acc': '#DB2777' }}>Browse courses</Link>
            ) : (
              <button onClick={() => { setQuery(''); setTrack('all'); setLevel('all'); }} className="fd-btn" style={{ '--acc': '#DB2777' }}>
                Clear filters
              </button>
            )}
          </div>
        ) : grouped ? (
          [...TRACK_ORDER, 'company']
            .filter((t) => filtered.some((c) => c.track === t))
            .map((t) => {
              const list = filtered.filter((c) => c.track === t);
              return (
                <section key={t} className="pt-10" aria-labelledby={`h-${t}`}>
                  <div className="flex items-end justify-between gap-4 mb-4">
                    <div>
                      <h2 id={`h-${t}`} className="text-xl font-bold text-gray-900">{trackName(t)}</h2>
                      <p className="text-sm text-gray-600 mt-1 max-w-2xl">{trackMeta(t).intro}</p>
                    </div>
                    {list.length > 4 && (
                      <button onClick={() => setTrack(t)} className="text-sm font-semibold text-pink-700 hover:underline whitespace-nowrap">
                        See all {list.length}
                      </button>
                    )}
                  </div>
                  <div className="lr-grid">
                    {list.slice(0, 4).map((c) => (
                      <CourseCard key={c.slug} course={c} status={statusOf(c)} progress={progressOf(c)} />
                    ))}
                  </div>
                </section>
              );
            })
        ) : (
          <section className="pt-8">
            <p className="text-sm text-gray-500 mb-4">
              {filtered.length} course{filtered.length === 1 ? '' : 's'}
            </p>
            <div className="lr-grid">
              {filtered.map((c) => (
                <CourseCard key={c.track + c.slug} course={c} status={statusOf(c)} progress={progressOf(c)} />
              ))}
            </div>
          </section>
        )}

        {/* How learning leads to badges */}
        {!mine && (
          <section className="mt-16 rounded-2xl bg-gray-50 border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900">From courses to real work</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
              {[
                ['Learn', 'Take any course, free, at your own pace.'],
                ['Build with a team', 'Join a She Model Tech project in your track and deliver real work.'],
                ['Earn the badge', 'Your work is reviewed and the badge goes on your profile.'],
                ['Get paid work', 'One badge unlocks paid projects from verified companies.'],
              ].map(([t, d], i) => (
                <div key={t} className="flex gap-3">
                  <span className="w-7 h-7 flex-shrink-0 rounded-full bg-pink-100 text-pink-700 text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{d}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/projects" className="inline-block mt-6 text-sm font-semibold text-pink-700 hover:underline">
              Browse projects
            </Link>
          </section>
        )}
      </div>

      <style>{LR_CSS}</style>
    </LearningLayout>
  );
};

export const LR_CSS = `
.lr-hero { background: linear-gradient(180deg, #FDF2F8 0%, #FFFFFF 100%); border-bottom:1px solid #F3F4F6; }
.lr-grid { display:grid; gap:1.25rem; grid-template-columns:1fr; }
@media (min-width:560px) { .lr-grid { grid-template-columns:repeat(2, minmax(0,1fr)); } }
@media (min-width:900px) { .lr-grid { grid-template-columns:repeat(3, minmax(0,1fr)); } }
@media (min-width:1200px) { .lr-grid { grid-template-columns:repeat(4, minmax(0,1fr)); } }
.lr-card { display:flex; flex-direction:column; background:#fff; border:1px solid #E5E7EB; border-radius:1rem; overflow:hidden;
  transition:border-color .15s, box-shadow .15s, transform .15s; }
.lr-card:hover { border-color:var(--c); box-shadow:0 8px 24px rgba(17,24,39,.08); transform:translateY(-2px); }
.lr-card:focus-visible { outline:2px solid var(--c); outline-offset:2px; }
.lr-card-top { height:88px; background:var(--t); display:flex; align-items:flex-end; justify-content:space-between;
  padding:.75rem 1rem; border-bottom:3px solid var(--c); }
.lr-inter { font-weight:700; color:var(--c); background:var(--t); padding:.1rem .45rem; border-radius:999px; }
.lr-chips { display:flex; gap:.5rem; overflow-x:auto; scrollbar-width:none; padding-bottom:.25rem; }
.lr-chips::-webkit-scrollbar { display:none; }
@media (min-width:768px) { .lr-chips { flex-wrap:wrap; overflow:visible; } }
.lr-chip { flex-shrink:0; font-size:.875rem; font-weight:600; color:#374151; background:#F3F4F6; padding:.5rem .9rem; border-radius:999px;
  transition:background .15s, color .15s; }
.lr-chip:hover { background:#E5E7EB; }
.lr-chip.is-active { background:#111827; color:#fff; }
.lr-chip:focus-visible { outline:2px solid #DB2777; outline-offset:2px; }
@media (prefers-reduced-motion: reduce) { .lr-card { transition:none; } .lr-card:hover { transform:none; } }
`;

export default LearningHome;
