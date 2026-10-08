// src/components/admin/CourseFeedbackAdmin.jsx
// Admin → Course feedback: star ratings, reactions and comments learners left
// on each Learning course (built-in and mentor courses).
//
//   course_feedback/{courseKey}/ratings/{uid}    { stars 1-5, name, at }
//   course_feedback/{courseKey}/reactions/{uid}  { type }
//   course_feedback/{courseKey}/comments/{id}    { text, uid, name, at }
//
// The list uses server-side counts (no downloading every rating); a course's
// full detail loads when you open it.
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  collection, count, deleteDoc, doc, getAggregateFromServer, getCountFromServer, getDocs, limit, orderBy, query, sum,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { COURSES_BY_TRACK } from '../../utils/foundationsCoursesData';
import { trackMeta } from '../../utils/foundationsCourses';
import { listPublished, PUBLISHED_PREFIX } from '../../utils/learningPublished';
import { feedbackKey, REACTIONS } from '../../Pages/learning/CourseFeedback';

const TRACKS = ['TechDev', 'TechArchs', 'TechQA', 'TechGuard', 'TechPO', 'TechLeads', 'start', 'company'];
const toDate = (t) => (t?.toDate ? t.toDate() : t ? new Date(t) : null);
const fmt = (t) => {
  const d = toDate(t);
  return d ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';
};
const stars = (avg) => '★★★★★'.slice(0, Math.round(avg)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(avg));

// Run async jobs a few at a time.
const runLimited = async (jobs, n = 8) => {
  const out = new Array(jobs.length);
  let i = 0;
  const worker = async () => {
    while (i < jobs.length) {
      const k = i++;
      // eslint-disable-next-line no-await-in-loop
      out[k] = await jobs[k]().catch(() => null);
    }
  };
  await Promise.all(Array.from({ length: Math.min(n, jobs.length) }, worker));
  return out;
};

const base = (c) => `course_feedback/${feedbackKey(c.track, c.slug)}`;

const CourseDetail = ({ c, isAdmin, onCommentRemoved }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    let alive = true;
    Promise.all([
      getDocs(collection(db, base(c), 'ratings')),
      getDocs(collection(db, base(c), 'reactions')),
      getDocs(query(collection(db, base(c), 'comments'), orderBy('at', 'desc'), limit(100))),
    ])
      .then(([r, re, cm]) => {
        if (!alive) return;
        setData({
          ratings: r.docs.map((d) => d.data()),
          reactions: re.docs.map((d) => d.data()),
          comments: cm.docs.map((d) => ({ id: d.id, ...d.data() })),
        });
      })
      .catch(() => alive && setData({ ratings: [], reactions: [], comments: [], failed: true }));
    return () => { alive = false; };
  }, [c]);

  const remove = async (cm) => {
    if (!window.confirm('Delete this comment for everyone?')) return;
    try {
      await deleteDoc(doc(db, base(c), 'comments', cm.id));
      setData((d) => ({ ...d, comments: d.comments.filter((x) => x.id !== cm.id) }));
      onCommentRemoved();
      toast.success('Comment deleted.');
    } catch (e) {
      toast.error('Could not delete it.');
    }
  };

  if (!data) return <p className="text-sm text-gray-400 mt-3">Loading…</p>;
  if (data.failed) return <p className="text-sm text-red-600 mt-3">Could not load this course's feedback.</p>;
  const dist = [5, 4, 3, 2, 1].map((n) => data.ratings.filter((r) => r.stars === n).length);
  const total = data.ratings.length;
  return (
    <div className="mt-3 border-t border-gray-100 pt-3 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ratings</p>
          {total === 0 ? <p className="text-sm text-gray-500 mt-1">No ratings yet.</p> : (
            <div className="mt-1 space-y-1">
              {dist.map((n, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-3">{5 - i}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-600" style={{ width: `${(n / total) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right">{n}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">How learners found it</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {REACTIONS.map(([type, emoji, label]) => (
              <span key={type} className="text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-200 text-gray-700">
                {emoji} {label} <span className="font-normal text-gray-500">{data.reactions.filter((r) => r.type === type).length}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Comments</p>
        {data.comments.length === 0 ? <p className="text-sm text-gray-500 mt-1">No comments yet.</p> : (
          <ul className="mt-1 space-y-2">
            {data.comments.map((cm) => (
              <li key={cm.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-gray-500"><span className="font-semibold text-gray-900">{cm.name || 'Learner'}</span> · {fmt(cm.at)}</p>
                  {isAdmin && <button onClick={() => remove(cm)} className="text-xs font-semibold text-gray-500 hover:text-red-600">Delete</button>}
                </div>
                <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap break-words">{cm.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const CourseFeedbackAdmin = ({ isAdmin = false }) => {
  const [rows, setRows] = useState(null);
  const [latest, setLatest] = useState(null);
  const [track, setTrack] = useState('');
  const [sort, setSort] = useState('most');
  const [showEmpty, setShowEmpty] = useState(false);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(null);

  const load = useCallback(async () => {
    setRows(null);
    setLatest(null);
    let published = [];
    try { published = await listPublished(); } catch (_) { /* built-in only */ }
    const courses = [];
    Object.entries(COURSES_BY_TRACK).forEach(([t, list]) => (list || []).forEach((c) => courses.push({ track: t, slug: c.slug, title: c.title, mentor: '' })));
    published.forEach((p) => courses.push({ track: p.track, slug: `${PUBLISHED_PREFIX}${p.id}`, title: p.title, mentor: p.authorName || 'a mentor' }));

    const results = await runLimited(courses.map((c) => async () => {
      const [agg, cm] = await Promise.all([
        getAggregateFromServer(collection(db, base(c), 'ratings'), { n: count(), total: sum('stars') }).catch(() => null),
        getCountFromServer(collection(db, base(c), 'comments')).catch(() => null),
      ]);
      const n = agg ? agg.data().n || 0 : 0;
      return { ...c, ratings: n, avg: n ? (agg.data().total || 0) / n : 0, comments: cm ? cm.data().count : 0 };
    }));
    const list = results.filter(Boolean);
    setRows(list);

    // The newest comments across courses (a few from each course that has any).
    const withComments = list.filter((c) => c.comments > 0);
    const recent = await runLimited(withComments.map((c) => async () => {
      const s = await getDocs(query(collection(db, base(c), 'comments'), orderBy('at', 'desc'), limit(3)));
      return s.docs.map((d) => ({ id: d.id, ...d.data(), course: c }));
    }));
    setLatest(recent.flat().filter(Boolean).sort((a, b) => (toDate(b.at)?.getTime() || 0) - (toDate(a.at)?.getTime() || 0)).slice(0, 15));
  }, []);
  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => {
    if (!rows) return [];
    const q = search.trim().toLowerCase();
    const list = rows
      .filter((c) => !track || c.track === track)
      .filter((c) => showEmpty || c.ratings > 0 || c.comments > 0)
      .filter((c) => !q || c.title.toLowerCase().includes(q));
    const by = {
      most: (a, b) => (b.ratings + b.comments) - (a.ratings + a.comments) || a.title.localeCompare(b.title),
      low: (a, b) => (a.ratings ? a.avg : 9) - (b.ratings ? b.avg : 9),
      high: (a, b) => b.avg - a.avg || b.ratings - a.ratings,
      name: (a, b) => a.title.localeCompare(b.title),
    };
    return list.sort(by[sort]);
  }, [rows, track, showEmpty, search, sort]);

  const totals = useMemo(() => {
    if (!rows) return null;
    const rated = rows.filter((c) => c.ratings > 0);
    const n = rated.reduce((a, c) => a + c.ratings, 0);
    const s = rated.reduce((a, c) => a + c.avg * c.ratings, 0);
    return { ratings: n, avg: n ? s / n : 0, comments: rows.reduce((a, c) => a + c.comments, 0), courses: rated.length, all: rows.length };
  }, [rows]);

  const courseLink = (c) => `/learning/${c.track}/${c.slug}`;

  return (
    <div className="space-y-4">
      <p className="text-gray-500 text-sm">Star ratings, reactions and comments learners left on each course. Open a course to see all of it.</p>

      {totals && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            [totals.ratings ? `${totals.avg.toFixed(1)} ★` : '–', 'Average rating'],
            [totals.ratings, 'Ratings'],
            [totals.comments, 'Comments'],
            [`${totals.courses} of ${totals.all}`, 'Courses rated'],
          ].map(([v, l]) => (
            <div key={l} className="bg-white border border-gray-200 rounded-xl p-3">
              <p className="text-2xl font-bold text-gray-900">{v}</p>
              <p className="text-xs text-gray-500">{l}</p>
            </div>
          ))}
        </div>
      )}

      {latest && latest.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="font-bold text-gray-900 text-sm mb-2">Latest comments</p>
          <ul className="space-y-2">
            {latest.map((cm) => (
              <li key={`${cm.course.slug}-${cm.id}`} className="text-sm">
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-900">{cm.name || 'Learner'}</span> on{' '}
                  <Link to={courseLink(cm.course)} className="font-semibold text-pink-700 hover:underline">{cm.course.title}</Link> · {fmt(cm.at)}
                </p>
                <p className="text-gray-800 line-clamp-2 break-words">{cm.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses"
          className="flex-1 min-w-0 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
        <select value={track} onChange={(e) => setTrack(e.target.value)} aria-label="Track" className="sm:w-56 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">All tracks</option>
          {TRACKS.map((t) => <option key={t} value={t}>{trackMeta(t).label}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort" className="sm:w-48 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="most">Most feedback</option>
          <option value="low">Lowest rated first</option>
          <option value="high">Highest rated first</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={showEmpty} onChange={(e) => setShowEmpty(e.target.checked)} className="accent-pink-600" />
        Also show courses with no feedback yet
      </label>

      {rows === null ? (
        <p className="text-gray-400 text-sm">Counting feedback on every course…</p>
      ) : shown.length === 0 ? (
        <p className="text-gray-400 text-sm">{showEmpty ? 'No courses match.' : 'No feedback yet. Tick the box above to see every course.'}</p>
      ) : (
        <ul className="space-y-2">
          {shown.map((c) => {
            const id = `${c.track}/${c.slug}`;
            return (
              <li key={id} className="bg-white border border-gray-200 rounded-xl p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={courseLink(c)} className="font-semibold text-gray-900 hover:text-pink-700">{c.title}</Link>
                    <p className="text-xs text-gray-500">{trackMeta(c.track).label}{c.mentor ? ` · by ${c.mentor}` : ''}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {c.ratings > 0 ? (
                      <p className="text-sm font-bold text-gray-900">
                        <span className="text-pink-600" aria-hidden="true">{stars(c.avg)}</span> {c.avg.toFixed(1)}
                      </p>
                    ) : <p className="text-sm text-gray-400">Not rated</p>}
                    <p className="text-xs text-gray-500">{c.ratings} rating{c.ratings === 1 ? '' : 's'} · {c.comments} comment{c.comments === 1 ? '' : 's'}</p>
                  </div>
                </div>
                <button onClick={() => setOpen(open === id ? null : id)} className="mt-2 text-xs font-semibold text-pink-700 hover:underline">
                  {open === id ? 'Hide details' : 'See ratings and comments'}
                </button>
                {open === id && (
                  <CourseDetail c={c} isAdmin={isAdmin}
                    onCommentRemoved={() => setRows((rs) => rs.map((x) => (x === c ? { ...x, comments: Math.max(0, x.comments - 1) } : x)))} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CourseFeedbackAdmin;
