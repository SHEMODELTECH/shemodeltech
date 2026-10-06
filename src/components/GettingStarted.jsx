// src/components/GettingStarted.jsx
// "Getting started" checklist at the top of a member's dashboard: five steps
// that tick themselves off as she does each one, each with a "Show me" link to
// the right page. It hides itself once every step is done, or when she taps
// "Hide" (saved on her profile, so it stays hidden on every device).
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, doc, getDocs, limit, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export const START_COURSE = { track: 'start', slug: 'how-she-model-tech-works' };

// True if any of these queries finds at least one document.
const anyFound = async (queries) => {
  for (const q of queries) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const s = await getDocs(q);
      if (!s.empty) return true;
    } catch (_) {
      /* a query the rules or indexes don't allow just counts as "not yet" */
    }
  }
  return false;
};

const GettingStarted = ({ uid, profile }) => {
  const [hidden, setHidden] = useState(!!profile?.gettingStartedHidden);
  const [joined, setJoined] = useState(null);
  const [posted, setPosted] = useState(null);

  useEffect(() => {
    if (!uid || hidden) return;
    let dead = false;
    anyFound([
      query(collection(db, 'projects'), where('members', 'array-contains', uid), limit(1)),
      query(collection(db, 'project_applications'), where('applicantUid', '==', uid), limit(1)),
      query(collection(db, 'lead_applications'), where('applicantUid', '==', uid), limit(1)),
      query(collection(db, 'project_interest'), where('uid', '==', uid), limit(1)),
      query(collection(db, 'lead_intent'), where('uid', '==', uid), limit(1)),
    ]).then((v) => !dead && setJoined(v));
    anyFound([query(collection(db, 'activity'), where('actorId', '==', uid), limit(1))]).then((v) => !dead && setPosted(v));
    return () => {
      dead = true;
    };
  }, [uid, hidden]);

  if (!uid || !profile || profile.isCompany || hidden) return null;

  const badges = Array.isArray(profile.badges) ? profile.badges.length : 0;
  const steps = [
    {
      title: 'Complete your profile',
      text: 'Add your skill track, experience level, and LinkedIn in Settings.',
      done: !!profile.profileComplete,
      to: '/settings?tab=profile',
    },
    {
      title: 'Take the Start Here course',
      text: 'A short guide to how She Model Tech works.',
      done: !!profile.foundationsCourses?.[START_COURSE.track]?.[START_COURSE.slug],
      to: `/learning/${START_COURSE.track}/${START_COURSE.slug}`,
    },
    {
      title: 'Join a project, or apply to lead one',
      text: 'Open Projects and tap Join the Project on one that interests you.',
      done: joined === true || badges > 0,
      to: '/projects',
    },
    {
      title: 'Share an update on the Proof Wall',
      text: 'Tell the community what you’re working on.',
      done: posted === true,
      to: '/proof-wall',
    },
    {
      title: 'Earn your first badge',
      text: 'Complete a project with your team and have it reviewed.',
      done: badges > 0,
      to: '/badges',
    },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  // Still checking: don't flash steps as "not done" while the queries run.
  if (joined === null || posted === null) return null;
  if (doneCount === steps.length) return null;
  const next = steps.find((s) => !s.done);

  const hide = async () => {
    setHidden(true);
    try {
      await updateDoc(doc(db, 'users', uid), { gettingStartedHidden: true });
    } catch (_) {
      /* hidden for this visit even if the save fails */
    }
  };

  return (
    <section className="mb-6 bg-white border border-pink-200 rounded-xl p-5 sm:p-6" aria-labelledby="gs-h">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 id="gs-h" className="text-lg font-bold text-gray-900">Getting started</h2>
          <p className="text-sm text-gray-600 mt-0.5">
            {doneCount} of {steps.length} done. Your next step: <span className="font-semibold text-gray-900">{next.title.toLowerCase()}</span>.
          </p>
        </div>
        <button onClick={hide} className="flex-shrink-0 text-xs font-semibold text-gray-500 hover:text-gray-900">
          Hide
        </button>
      </div>

      <div className="mt-3 h-2 rounded-full bg-pink-50 overflow-hidden" aria-hidden="true">
        <div className="h-full bg-pink-600 rounded-full transition-all" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
      </div>

      <ol className="mt-4 divide-y divide-gray-100">
        {steps.map((s, i) => (
          <li key={s.title} className="py-3 flex items-center gap-3">
            <span
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                s.done ? 'bg-pink-600 text-white' : s === next ? 'border-2 border-pink-600 text-pink-700' : 'border border-gray-300 text-gray-500'
              }`}
              aria-hidden="true"
            >
              {s.done ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              ) : (
                i + 1
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-semibold ${s.done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {s.title}
                <span className="sr-only">{s.done ? ' (done)' : ''}</span>
              </p>
              {!s.done && <p className="text-xs text-gray-500 mt-0.5">{s.text}</p>}
            </div>
            {!s.done && (
              <Link
                to={s.to}
                className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg ${
                  s === next ? 'bg-pink-600 hover:bg-pink-700 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Show me
              </Link>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
};

export default GettingStarted;
