// src/Pages/learning/CourseForum.jsx
// A discussion forum for each course: learners ask questions, share their
// capstone projects, and reply to each other.
//
//   course_forum/{courseKey}/threads/{id}
//     uid, name, kind ('question' | 'discussion' | 'capstone'), title, body,
//     link (optional, e.g. a capstone project URL), at, replyCount, lastAt
//   course_forum/{courseKey}/threads/{id}/replies/{rid}
//     uid, name, body, at
//
// Anyone can read. Signed-in members post and reply; they can delete their own
// posts, and staff can remove anything.

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { signInAndReturn } from './LearningLayout';
import { friendlyError } from '../../components/NoteDialog';
import { notifyMember } from '../../utils/staffAlerts';
import { courseKey } from '../../utils/mentorStats';

const KINDS = {
  question: { label: 'Question', cls: 'bg-sky-50 text-sky-700' },
  discussion: { label: 'Discussion', cls: 'bg-gray-100 text-gray-700' },
  capstone: { label: 'Capstone project', cls: 'bg-pink-50 text-pink-700' },
};

const timeAgo = (ts) => {
  const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
  if (!d) return 'just now';
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

const Thread = ({ base, t, me, isStaff, myName, courseTitle, onDeleted }) => {
  const [open, setOpen] = useState(false);
  const [replies, setReplies] = useState(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(t.replyCount || 0);
  const location = useLocation();

  const load = async () => {
    const snap = await getDocs(query(collection(db, base, 'threads', t.id, 'replies'), orderBy('at', 'asc'), limit(200)));
    setReplies(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };
  const toggle = () => {
    setOpen((o) => !o);
    if (!replies) load().catch(() => setReplies([]));
  };

  const reply = async (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setBusy(true);
    try {
      const ref = await addDoc(collection(db, base, 'threads', t.id, 'replies'), { uid: me.uid, name: myName, body, at: serverTimestamp() });
      await updateDoc(doc(db, base, 'threads', t.id), { replyCount: increment(1), lastAt: serverTimestamp() }).catch(() => {});
      setReplies((rs) => [...(rs || []), { id: ref.id, uid: me.uid, name: myName, body, at: new Date() }]);
      setCount((c) => c + 1);
      setText('');
      if (t.uid !== me.uid) {
        notifyMember(t.uid, {
          type: 'forum_reply',
          title: `${myName} replied to your post`,
          body: `"${t.title}" in ${courseTitle}: ${body.slice(0, 140)}`,
          link: `${location.pathname}#forum`,
          ctaLabel: 'Read the reply',
        });
      }
    } catch (err) {
      toast.error(friendlyError(err, 'Could not post your reply.'));
    }
    setBusy(false);
  };

  const removeReply = async (r) => {
    if (!window.confirm('Delete this reply?')) return;
    try {
      await deleteDoc(doc(db, base, 'threads', t.id, 'replies', r.id));
      setReplies((rs) => rs.filter((x) => x.id !== r.id));
      setCount((c) => Math.max(0, c - 1));
    } catch (err) {
      toast.error(friendlyError(err, 'Could not delete it.'));
    }
  };
  const removeThread = async () => {
    if (!window.confirm('Delete this post and its replies?')) return;
    try {
      await deleteDoc(doc(db, base, 'threads', t.id));
      onDeleted(t.id);
    } catch (err) {
      toast.error(friendlyError(err, 'Could not delete it.'));
    }
  };

  const k = KINDS[t.kind] || KINDS.discussion;
  return (
    <li className="border border-gray-200 rounded-xl bg-white">
      <button type="button" onClick={toggle} aria-expanded={open} className="w-full text-left p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${k.cls}`}>{k.label}</span>
          <span className="text-xs text-gray-500">
            {t.name || 'Learner'} · {timeAgo(t.at)} · {count} repl{count === 1 ? 'y' : 'ies'}
          </span>
        </div>
        <p className="font-semibold text-gray-900 mt-1.5">{t.title}</p>
        {!open && t.body && <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{t.body}</p>}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <p className="text-sm text-gray-800 whitespace-pre-wrap mt-3">{t.body}</p>
          {t.link && (
            <a href={t.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-semibold text-pink-700 hover:underline break-all">
              {t.link}
            </a>
          )}
          {me && (t.uid === me.uid || isStaff) && (
            <button onClick={removeThread} className="block mt-2 text-xs font-semibold text-gray-500 hover:text-red-700">Delete post</button>
          )}
          <ul className="mt-4 space-y-2">
            {(replies || []).map((r) => (
              <li key={r.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-gray-500"><span className="font-semibold text-gray-800">{r.name || 'Learner'}</span> · {timeAgo(r.at)}</p>
                  {me && (r.uid === me.uid || isStaff) && (
                    <button onClick={() => removeReply(r)} className="text-xs font-semibold text-gray-500 hover:text-red-700">Delete</button>
                  )}
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap mt-1">{r.body}</p>
              </li>
            ))}
            {replies && replies.length === 0 && <li className="text-sm text-gray-500">No replies yet.</li>}
            {!replies && <li className="text-sm text-gray-500">Loading replies...</li>}
          </ul>
          {me ? (
            <form onSubmit={reply} className="mt-3">
              <label className="sr-only" htmlFor={`reply-${t.id}`}>Your reply</label>
              <textarea id={`reply-${t.id}`} rows={2} value={text} onChange={(e) => setText(e.target.value)} maxLength={3000}
                placeholder="Write a reply"
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
              <button type="submit" disabled={busy || !text.trim()} className="mt-2 fd-btn !py-1.5 !px-3 text-sm disabled:opacity-50">
                {busy ? 'Posting...' : 'Reply'}
              </button>
            </form>
          ) : null}
        </div>
      )}
    </li>
  );
};

const CourseForum = ({ track, slug, courseTitle, hasCapstone = false, displayName = '', onCapstonePosted }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const base = `course_forum/${courseKey(track, slug)}`;
  const [threads, setThreads] = useState(null);
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ kind: 'question', title: '', body: '', link: '' });
  const [busy, setBusy] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const myName = displayName || currentUser?.displayName || (currentUser?.email || '').split('@')[0] || 'Learner';

  useEffect(() => {
    getDocs(query(collection(db, base, 'threads'), orderBy('at', 'desc'), limit(100)))
      .then((snap) => setThreads(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch(() => setThreads([]));
  }, [base]);

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid))
      .then((s) => setIsStaff(['admin', 'editor'].includes(s.data()?.role)))
      .catch(() => {});
  }, [currentUser]);

  const startPost = (kind) => {
    if (!currentUser) return signInAndReturn(navigate, `${location.pathname}#forum`);
    setForm((f) => ({ ...f, kind }));
    setOpen(true);
  };

  const post = async (e) => {
    e.preventDefault();
    const title = form.title.trim();
    const body = form.body.trim();
    if (!title) return toast.error('Add a short title.');
    if (body.split(/\s+/).filter(Boolean).length < (form.kind === 'capstone' ? 20 : 3)) {
      return toast.error(form.kind === 'capstone' ? 'Describe your capstone project in at least 20 words.' : 'Add a little more detail.');
    }
    setBusy(true);
    try {
      const data = { uid: currentUser.uid, name: myName, kind: form.kind, title, body, link: form.link.trim() || null, at: serverTimestamp(), replyCount: 0, lastAt: serverTimestamp() };
      const ref = await addDoc(collection(db, base, 'threads'), data);
      setThreads((ts) => [{ id: ref.id, ...data, at: new Date() }, ...(ts || [])]);
      setOpen(false);
      setForm({ kind: 'question', title: '', body: '', link: '' });
      toast.success(form.kind === 'capstone' ? 'Capstone shared. You can now complete the course.' : 'Posted.');
      if (form.kind === 'capstone' && onCapstonePosted) onCapstonePosted();
    } catch (err) {
      toast.error(friendlyError(err, 'Could not post.'));
    }
    setBusy(false);
  };

  const shown = (threads || []).filter((t) => filter === 'all' || t.kind === filter);
  const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';

  return (
    <section id="forum" className="pt-10 scroll-mt-24" aria-labelledby="forum-h">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h2 id="forum-h" className="text-xl font-bold text-gray-900">Course forum</h2>
          <p className="text-sm text-gray-600 mt-1">Ask questions, help others, and share your work.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => startPost('question')} className="fd-btn !py-2 !px-3 text-sm">Ask a question</button>
          {hasCapstone && (
            <button onClick={() => startPost('capstone')} className="text-sm font-semibold border border-pink-300 text-pink-700 bg-white px-3 py-2 rounded-lg hover:bg-pink-50">
              Share your capstone
            </button>
          )}
        </div>
      </div>

      {open && (
        <form onSubmit={post} className="border border-gray-200 rounded-2xl p-4 bg-white mb-4 space-y-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Type of post">
            {Object.entries(KINDS)
              .filter(([k]) => k !== 'capstone' || hasCapstone)
              .map(([k, v]) => (
                <button key={k} type="button" aria-pressed={form.kind === k} onClick={() => setForm({ ...form, kind: k })}
                  className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${form.kind === k ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300 text-gray-700'}`}>
                  {v.label}
                </button>
              ))}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="forum-title">Title</label>
            <input id="forum-title" className={input} value={form.title} maxLength={150}
              placeholder={form.kind === 'capstone' ? 'My capstone: ...' : 'What do you want to ask or discuss?'}
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="forum-body">
              {form.kind === 'capstone' ? 'Describe your project' : 'Details'}
              {form.kind === 'capstone' && <span className="font-normal text-gray-500"> (at least 20 words)</span>}
            </label>
            <textarea id="forum-body" rows={5} className={input} value={form.body} maxLength={5000}
              placeholder={form.kind === 'capstone' ? 'What you built, how you approached it, what you learned, and anything you would like feedback on.' : ''}
              onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="forum-link">
              Link <span className="font-normal text-gray-500">(optional{form.kind === 'capstone' ? ': your project, repository, or demo' : ''})</span>
            </label>
            <input id="forum-link" type="url" className={input} value={form.link} placeholder="https://"
              onChange={(e) => setForm({ ...form, link: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={busy} className="fd-btn disabled:opacity-50">{busy ? 'Posting...' : 'Post'}</button>
            <button type="button" onClick={() => setOpen(false)} className="text-sm font-semibold text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100">Cancel</button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Filter posts">
        {[['all', 'All'], ['question', 'Questions'], ['discussion', 'Discussions'], ...(hasCapstone ? [['capstone', 'Capstones']] : [])].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} aria-pressed={filter === v}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${filter === v ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {l}
          </button>
        ))}
      </div>

      {threads === null ? (
        <p className="text-sm text-gray-500">Loading the forum...</p>
      ) : shown.length === 0 ? (
        <p className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl p-6 text-center">
          No posts yet. Be the first to ask a question or start a discussion.
        </p>
      ) : (
        <ul className="space-y-2">
          {shown.map((t) => (
            <Thread key={t.id} base={base} t={t} me={currentUser} isStaff={isStaff} myName={myName} courseTitle={courseTitle}
              onDeleted={(id) => setThreads((ts) => ts.filter((x) => x.id !== id))} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default CourseForum;
