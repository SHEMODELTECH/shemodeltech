// src/Pages/learning/CourseFeedback.jsx
// Ratings, reactions, and comments on mentor courses in Learning.
//
//   course_feedback/{courseKey}/ratings/{uid}    { stars 1-5, uid, name, at }
//   course_feedback/{courseKey}/reactions/{uid}  { type, uid, at }
//   course_feedback/{courseKey}/comments/{id}    { text, uid, name, at }
//
// Anyone can read. Signed-in learners can rate and react once each (they can
// change or remove it) and comment; they can delete their own comments, and
// staff can remove any comment.

import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { signInAndReturn } from './LearningLayout';
import { friendlyError } from '../../components/NoteDialog';

export const REACTIONS = [
  ['helpful', '👍', 'Helpful'],
  ['love', '❤️', 'Love it'],
  ['insightful', '💡', 'Insightful'],
  ['inspiring', '🎉', 'Inspiring'],
];

export const feedbackKey = (track, slug) => `${track}__${slug}`.replace(/[^A-Za-z0-9_-]/g, '-');

const timeAgo = (ts) => {
  const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
  if (!d) return '';
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

const Star = ({ filled, className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill={filled ? '#F59E0B' : 'none'} stroke={filled ? '#F59E0B' : '#D1D5DB'} strokeWidth="1.6">
    <path strokeLinejoin="round" d="M12 3.5l2.6 5.3 5.9.9-4.25 4.1 1 5.8L12 16.9l-5.25 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5z" />
  </svg>
);

const CourseFeedback = ({ track, slug, courseTitle, isStaff = false, displayName = '' }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const key = feedbackKey(track, slug);
  const base = `course_feedback/${key}`;
  const [ratings, setRatings] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [comments, setComments] = useState([]);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [staff, setStaff] = useState(isStaff);

  useEffect(() => {
    let alive = true;
    Promise.all([
      getDocs(collection(db, base, 'ratings')),
      getDocs(collection(db, base, 'reactions')),
      getDocs(query(collection(db, base, 'comments'), orderBy('at', 'desc'))),
    ])
      .then(([r, re, c]) => {
        if (!alive) return;
        setRatings(r.docs.map((d) => ({ id: d.id, ...d.data() })));
        setReactions(re.docs.map((d) => ({ id: d.id, ...d.data() })));
        setComments(c.docs.map((d) => ({ id: d.id, ...d.data() })));
      })
      .catch(() => alive && setRatings([]));
    return () => {
      alive = false;
    };
  }, [base]);

  useEffect(() => {
    if (!currentUser || isStaff) return;
    getDoc(doc(db, 'users', currentUser.uid))
      .then((s) => setStaff(['admin', 'editor'].includes(s.data()?.role)))
      .catch(() => {});
  }, [currentUser, isStaff]);

  const myName = displayName || currentUser?.displayName || (currentUser?.email || '').split('@')[0] || 'Learner';
  const mine = currentUser ? (ratings || []).find((r) => r.id === currentUser.uid) : null;
  const myReaction = currentUser ? reactions.find((r) => r.id === currentUser.uid)?.type : null;
  const avg = useMemo(() => {
    if (!ratings?.length) return 0;
    return ratings.reduce((a, r) => a + (r.stars || 0), 0) / ratings.length;
  }, [ratings]);
  const dist = [5, 4, 3, 2, 1].map((n) => (ratings || []).filter((r) => r.stars === n).length);

  const needSignIn = () => {
    signInAndReturn(navigate, location.pathname);
  };

  const rate = async (stars) => {
    if (!currentUser) return needSignIn();
    const prev = ratings;
    const entry = { id: currentUser.uid, uid: currentUser.uid, name: myName, stars };
    setRatings((rs) => [...(rs || []).filter((r) => r.id !== currentUser.uid), entry]);
    try {
      await setDoc(doc(db, base, 'ratings', currentUser.uid), { uid: currentUser.uid, name: myName, stars, at: serverTimestamp() });
      toast.success('Thanks for rating this course.');
    } catch (e) {
      setRatings(prev);
      toast.error(friendlyError(e, 'Could not save your rating.'));
    }
  };

  const react = async (type) => {
    if (!currentUser) return needSignIn();
    const prev = reactions;
    const ref = doc(db, base, 'reactions', currentUser.uid);
    try {
      if (myReaction === type) {
        setReactions((rs) => rs.filter((r) => r.id !== currentUser.uid));
        await deleteDoc(ref);
      } else {
        setReactions((rs) => [...rs.filter((r) => r.id !== currentUser.uid), { id: currentUser.uid, type }]);
        await setDoc(ref, { uid: currentUser.uid, type, at: serverTimestamp() });
      }
    } catch (e) {
      setReactions(prev);
      toast.error(friendlyError(e, 'Could not save your reaction.'));
    }
  };

  const comment = async (e) => {
    e.preventDefault();
    if (!currentUser) return needSignIn();
    const t = text.trim();
    if (!t) return;
    if (t.length > 2000) return toast.error('Comments can be up to 2,000 characters.');
    setBusy(true);
    try {
      const ref = await addDoc(collection(db, base, 'comments'), { uid: currentUser.uid, name: myName, text: t, at: serverTimestamp() });
      setComments((cs) => [{ id: ref.id, uid: currentUser.uid, name: myName, text: t, at: new Date() }, ...cs]);
      setText('');
    } catch (err) {
      toast.error(friendlyError(err, 'Could not post your comment.'));
    }
    setBusy(false);
  };

  const removeComment = async (c) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteDoc(doc(db, base, 'comments', c.id));
      setComments((cs) => cs.filter((x) => x.id !== c.id));
    } catch (err) {
      toast.error(friendlyError(err, 'Could not delete it.'));
    }
  };

  const shown = hover || mine?.stars || 0;

  return (
    <section className="pt-10" aria-labelledby="fb-h">
      <h2 id="fb-h" className="text-xl font-bold text-gray-900 mb-4">Ratings and comments</h2>

      <div className="grid sm:grid-cols-[220px_minmax(0,1fr)] gap-6 border border-gray-200 rounded-2xl p-5 bg-white">
        {/* Average */}
        <div>
          <p className="text-4xl font-extrabold text-gray-900">{ratings?.length ? avg.toFixed(1) : '–'}</p>
          <div className="flex mt-1" aria-label={ratings?.length ? `Average ${avg.toFixed(1)} out of 5` : 'No ratings yet'}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} filled={n <= Math.round(avg)} />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {ratings === null ? 'Loading...' : `${ratings.length} rating${ratings.length === 1 ? '' : 's'}`}
          </p>
          {ratings?.length > 0 && (
            <div className="mt-3 space-y-1">
              {dist.map((n, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-3">{5 - i}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${ratings.length ? (n / ratings.length) * 100 : 0}%` }} />
                  </div>
                  <span className="w-5 text-right">{n}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Your rating + reactions */}
        <div>
          <p className="text-sm font-semibold text-gray-900">{mine ? 'Your rating' : 'Rate this course'}</p>
          <div className="flex gap-1 mt-1" role="radiogroup" aria-label={`Rate ${courseTitle}`} onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={mine?.stars === n}
                aria-label={`${n} star${n === 1 ? '' : 's'}`}
                onMouseEnter={() => setHover(n)}
                onFocus={() => setHover(n)}
                onBlur={() => setHover(0)}
                onClick={() => rate(n)}
                className="p-0.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <Star filled={n <= shown} className="w-7 h-7" />
              </button>
            ))}
          </div>
          {!currentUser && <p className="text-xs text-gray-500 mt-1">Sign in to rate, react, and comment.</p>}

          <p className="text-sm font-semibold text-gray-900 mt-5">How did you find it?</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {REACTIONS.map(([type, emoji, label]) => {
              const n = reactions.filter((r) => r.type === type).length;
              const on = myReaction === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => react(type)}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    on ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <span aria-hidden="true">{emoji}</span> {label}
                  {n > 0 && <span className="text-gray-500 font-normal">{n}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-6">
        <form onSubmit={comment} className="border border-gray-200 rounded-2xl p-4 bg-white">
          <label htmlFor="fb-comment" className="text-sm font-semibold text-gray-900">
            Leave a comment
          </label>
          <textarea
            id="fb-comment"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => !currentUser && needSignIn()}
            placeholder={currentUser ? 'What did you learn? What would make it better?' : 'Sign in to comment'}
            className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">{text.length}/2000</span>
            <button type="submit" disabled={busy || !text.trim()} className="fd-btn disabled:opacity-50">
              {busy ? 'Posting...' : 'Post comment'}
            </button>
          </div>
        </form>

        <ul className="mt-4 space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm">
                  <span className="font-semibold text-gray-900">{c.name || 'Learner'}</span>{' '}
                  <span className="text-gray-500">· {timeAgo(c.at)}</span>
                </p>
                {currentUser && (c.uid === currentUser.uid || staff) && (
                  <button onClick={() => removeComment(c)} className="text-xs font-semibold text-gray-500 hover:text-red-700">
                    Delete
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">{c.text}</p>
            </li>
          ))}
          {ratings !== null && comments.length === 0 && (
            <li className="text-sm text-gray-500">No comments yet. Be the first to share what you thought.</li>
          )}
        </ul>
      </div>
    </section>
  );
};

export default CourseFeedback;
