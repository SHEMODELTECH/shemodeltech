// src/components/admin/LearnersAdmin.jsx
// Admin → Learners: who is enrolled in which Learning course, how far they
// are, and when they were last on She Model Tech.
//
// Built from the member records the admin panel already loads (users):
//   learningEnrolled.<track>.<slug>   = enrolment time (ISO)
//   learningLastPart.<track>.<slug>   = the part they last opened (1-based)
//   foundationsCourses.<track>.<slug> = true when the course is completed
//   learningQuizPassed.<track>.<slug> = { partId: true } quizzes passed (70%+)
//   lastSeenAt                        = last visit (written once a day)
// plus presence/{uid} (one read per learner) for "Active now" and a more
// exact last-active time.
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, documentId, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { COURSES_BY_TRACK } from '../../utils/foundationsCoursesData';
import { trackMeta } from '../../utils/foundationsCourses';
import { listPublished, PUBLISHED_PREFIX } from '../../utils/learningPublished';
import { ONLINE_WINDOW_MS, timeAgo } from '../../utils/presence';

const PAGE = 50;
const DAY = 24 * 60 * 60 * 1000;
const toMs = (t) => (t?.toMillis ? t.toMillis() : typeof t === 'number' ? t : t ? Date.parse(t) || 0 : 0);
const fmtDate = (ms) => (ms ? new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—');
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

const LearnersAdmin = ({ users = [] }) => {
  const [published, setPublished] = useState([]);
  const [presence, setPresence] = useState({});
  const [search, setSearch] = useState('');
  const [course, setCourse] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('seen');
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    listPublished().then(setPublished).catch(() => setPublished([]));
  }, []);

  // Course details by "track/slug": built-in courses and published mentor courses.
  const courseInfo = useMemo(() => {
    const m = {};
    Object.entries(COURSES_BY_TRACK).forEach(([track, list]) =>
      (list || []).forEach((c) => {
        m[`${track}/${c.slug}`] = { title: c.title, parts: c.partCount || (c.modules || []).length || 0 };
      })
    );
    published.forEach((p) => {
      m[`${p.track}/${PUBLISHED_PREFIX}${p.id}`] = { title: p.title, parts: p.parts || 0, mentor: p.authorName || '' };
    });
    return m;
  }, [published]);

  // One entry per learner, with each course they enrolled in.
  const learners = useMemo(() => {
    const out = [];
    users.forEach((u) => {
      const enrolled = u.learningEnrolled || {};
      const courses = [];
      Object.entries(enrolled).forEach(([track, slugs]) =>
        Object.entries(slugs || {}).forEach(([slug, at]) => {
          if (!at) return;
          const key = `${track}/${slug}`;
          const info = courseInfo[key] || {};
          const done = !!((u.foundationsCourses || {})[track] || {})[slug];
          const last = Number(((u.learningLastPart || {})[track] || {})[slug]) || 0;
          const quizzes = Object.keys(((u.learningQuizPassed || {})[track] || {})[slug] || {}).length;
          const parts = info.parts || 0;
          const pct = done ? 100 : parts ? Math.min(99, Math.round((Math.max(0, last - 1) / parts) * 100)) : 0;
          courses.push({
            key, track, slug, done, last, quizzes, parts, pct,
            title: info.title || slug.replace(/[-_]+/g, ' '),
            mentor: info.mentor || '',
            removed: !courseInfo[key],
            enrolledMs: toMs(at),
          });
        })
      );
      if (!courses.length) return;
      courses.sort((a, b) => b.enrolledMs - a.enrolledMs);
      out.push({
        id: u.id,
        name: u.displayName || u.name || u.fullName || '',
        email: u.email || '',
        photo: u.photoURL || '',
        role: u.role || 'member',
        seenMs: toMs(u.lastSeenAt),
        courses,
      });
    });
    return out;
  }, [users, courseInfo]);

  // Presence for learners only (one read per 30 learners).
  const idsKey = learners.map((l) => l.id).sort().join(',');
  useEffect(() => {
    const ids = idsKey ? idsKey.split(',') : [];
    if (!ids.length) return;
    let alive = true;
    (async () => {
      const found = {};
      for (let i = 0; i < ids.length; i += 30) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const snap = await getDocs(query(collection(db, 'presence'), where(documentId(), 'in', ids.slice(i, i + 30))));
          snap.docs.forEach((d) => { found[d.id] = d.data(); });
        } catch (_) { /* skip this batch */ }
      }
      if (alive) setPresence(found);
    })();
    return () => { alive = false; };
  }, [idsKey]);

  const now = Date.now();
  const seenOf = (l) => {
    const p = presence[l.id];
    const pMs = p ? toMs(p.lastActive) : 0;
    const online = !!(p && p.state === 'online' && now - pMs < ONLINE_WINDOW_MS);
    return { online, ms: Math.max(l.seenMs, pMs) };
  };

  // Courses that have learners, for the filter (with how many each).
  const courseOptions = useMemo(() => {
    const counts = {};
    learners.forEach((l) => l.courses.forEach((c) => {
      counts[c.key] = counts[c.key] || { key: c.key, title: c.title, track: c.track, n: 0, done: 0 };
      counts[c.key].n += 1;
      if (c.done) counts[c.key].done += 1;
    }));
    return Object.values(counts).sort((a, b) => b.n - a.n || a.title.localeCompare(b.title));
  }, [learners]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = learners
      .map((l) => {
        const cs = l.courses.filter((c) =>
          (!course || c.key === course) &&
          (status === 'done' ? c.done : status === 'progress' ? !c.done : true)
        );
        return { ...l, shownCourses: cs, seen: seenOf(l) };
      })
      .filter((l) => l.shownCourses.length)
      .filter((l) => !q || `${l.name} ${l.email}`.toLowerCase().includes(q));
    if (status === 'inactive') list = list.filter((l) => !l.seen.ms || now - l.seen.ms > 14 * DAY);
    const by = {
      seen: (a, b) => (b.seen.online - a.seen.online) || b.seen.ms - a.seen.ms,
      enrolled: (a, b) => Math.max(...b.shownCourses.map((c) => c.enrolledMs)) - Math.max(...a.shownCourses.map((c) => c.enrolledMs)),
      name: (a, b) => (a.name || a.email).localeCompare(b.name || b.email),
      quiet: (a, b) => a.seen.ms - b.seen.ms,
    };
    return list.sort(by[sort] || by.seen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learners, search, course, status, sort, presence]);

  useEffect(() => { setShown(PAGE); }, [search, course, status, sort]);

  const totals = useMemo(() => {
    let enrolments = 0;
    let completed = 0;
    let active7 = 0;
    learners.forEach((l) => {
      enrolments += l.courses.length;
      completed += l.courses.filter((c) => c.done).length;
      const s = seenOf(l);
      if (s.online || (s.ms && now - s.ms < 7 * DAY)) active7 += 1;
    });
    return { learners: learners.length, enrolments, completed, active7 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learners, presence]);

  const downloadCsv = () => {
    const lines = [['Name', 'Email', 'Course', 'Track', 'Enrolled', 'Progress', 'Last part opened', 'Quizzes passed', 'Completed', 'Last seen'].map(csvCell).join(',')];
    rows.forEach((l) => l.shownCourses.forEach((c) => {
      lines.push([
        l.name, l.email, c.title, trackMeta(c.track).label, fmtDate(c.enrolledMs), `${c.pct}%`,
        c.parts ? `${c.last || 0} of ${c.parts}` : c.last || '', c.quizzes, c.done ? 'Yes' : 'No',
        l.seen.online ? 'Active now' : fmtDate(l.seen.ms),
      ].map(csvCell).join(','));
    }));
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `she-model-tech-learners-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const Stat = ({ label, value }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );

  const seenLabel = (s) => (s.online ? 'Active now' : s.ms ? `Last seen ${timeAgo(s.ms, now)}` : 'Not seen yet');

  return (
    <div className="space-y-4">
      <p className="text-gray-500 text-sm">Everyone enrolled in a Learning course, how far they are, and when they were last here.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Stat label="Learners" value={totals.learners} />
        <Stat label="Course enrolments" value={totals.enrolments} />
        <Stat label="Courses completed" value={totals.completed} />
        <Stat label="Here in the last 7 days" value={totals.active7} />
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email"
          className="flex-1 min-w-0 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
        <select value={course} onChange={(e) => setCourse(e.target.value)} aria-label="Course"
          className="sm:w-64 min-w-0 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">All courses ({courseOptions.length})</option>
          {courseOptions.map((c) => (
            <option key={c.key} value={c.key}>{c.title} · {c.n} enrolled{c.done ? `, ${c.done} done` : ''}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {[['all', 'All'], ['progress', 'In progress'], ['done', 'Completed'], ['inactive', 'Away 14+ days']].map(([k, label]) => (
          <button key={k} onClick={() => setStatus(k)}
            className={`px-3 py-1.5 rounded-lg font-semibold ${status === k ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            {label}
          </button>
        ))}
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort"
          className="ml-auto bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm">
          <option value="seen">Recently seen first</option>
          <option value="quiet">Longest away first</option>
          <option value="enrolled">Newest enrolment first</option>
          <option value="name">Name A–Z</option>
        </select>
        <button onClick={downloadCsv} disabled={!rows.length}
          className="text-sm font-semibold text-pink-700 border border-pink-200 rounded-lg px-3 py-1.5 hover:bg-pink-50 disabled:opacity-50">
          Download CSV
        </button>
      </div>

      <p className="text-xs text-gray-500">{rows.length} learner{rows.length === 1 ? '' : 's'}</p>

      {rows.length === 0 ? (
        <p className="text-gray-400 text-sm">{learners.length ? 'No learners match.' : 'No one has enrolled in a course yet.'}</p>
      ) : (
        <ul className="space-y-2">
          {rows.slice(0, shown).map((l) => {
            const expanded = open === l.id || l.shownCourses.length <= 2;
            const list = expanded ? l.shownCourses : l.shownCourses.slice(0, 2);
            return (
              <li key={l.id} className="bg-white border border-gray-200 rounded-xl p-3">
                <div className="flex items-start gap-3">
                  {l.photo
                    ? <img src={l.photo} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                    : <span className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center flex-shrink-0">{(l.name || l.email || '?').charAt(0).toUpperCase()}</span>}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      {l.email
                        ? <Link to={`/profile/${encodeURIComponent(l.email)}`} className="font-semibold text-gray-900 hover:text-pink-700 truncate">{l.name || l.email}</Link>
                        : <span className="font-semibold text-gray-900 truncate">{l.name || 'Member'}</span>}
                      {l.role !== 'member' && <span className="text-[11px] font-semibold text-gray-500 uppercase">{l.role}</span>}
                    </div>
                    {l.email && <p className="text-xs text-gray-500 truncate">{l.email}</p>}
                  </div>
                  <p className={`text-xs whitespace-nowrap flex items-center gap-1 ${l.seen.online ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                    {l.seen.online && <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />}
                    {seenLabel(l.seen)}
                  </p>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {list.map((c) => (
                    <li key={c.key} className="text-sm">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                        <span className="min-w-0 text-gray-800">
                          {c.removed
                            ? <span className="text-gray-500">{c.title} <span className="text-xs">(no longer listed)</span></span>
                            : <Link to={`/learning/${c.track}/${c.slug}`} className="hover:text-pink-700">{c.title}</Link>}
                          <span className="text-xs text-gray-500"> · {trackMeta(c.track).label}{c.mentor ? ` · by ${c.mentor}` : ''}</span>
                        </span>
                        <span className={`text-xs whitespace-nowrap ${c.done ? 'font-semibold text-pink-700' : 'text-gray-600'}`}>
                          {c.done ? 'Completed' : c.parts ? `Part ${Math.max(1, c.last)} of ${c.parts}` : 'Started'}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={c.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${c.title} progress`}>
                        <div className={`h-full ${c.done ? 'bg-pink-600' : 'bg-gray-800'}`} style={{ width: `${Math.max(c.pct, 2)}%` }} />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Enrolled {fmtDate(c.enrolledMs)} · {c.quizzes} quiz{c.quizzes === 1 ? '' : 'zes'} passed
                      </p>
                    </li>
                  ))}
                </ul>
                {l.shownCourses.length > 2 && (
                  <button onClick={() => setOpen(open === l.id ? null : l.id)} className="mt-2 text-xs font-semibold text-pink-700 hover:underline">
                    {open === l.id ? 'Show fewer' : `Show all ${l.shownCourses.length} courses`}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {rows.length > shown && (
        <button onClick={() => setShown((n) => n + PAGE)} className="w-full text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg py-2 hover:bg-gray-50">
          Show more ({rows.length - shown} left)
        </button>
      )}
    </div>
  );
};

export default LearnersAdmin;
