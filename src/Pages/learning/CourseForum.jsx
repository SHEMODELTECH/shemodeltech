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

import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
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
import { alertStaff, notifyMember } from '../../utils/staffAlerts';
import NoteDialog from '../../components/NoteDialog';
import { courseKey } from '../../utils/mentorStats';
import LimitHint, { countWords } from '../../components/LimitHint';

// Limits, shown on every field (and the maximums are enforced by the database rules).
export const FORUM_LIMITS = {
  titleMinWords: 3,
  titleMaxChars: 150,
  bodyMinWords: 10,
  capstoneMinWords: 20,
  bodyMaxChars: 5000,
  replyMinWords: 2,
  replyMaxChars: 3000,
};
import { uploadDocumentToBlob, uploadImageToBlob } from '../../utils/blobStorage';

const KINDS = {
  question: { label: 'Question', cls: 'bg-sky-50 text-sky-700' },
  discussion: { label: 'Discussion', cls: 'bg-gray-100 text-gray-700' },
  capstone: { label: 'Capstone project', cls: 'bg-pink-50 text-pink-700' },
};

const EMOJIS = ['😀', '😂', '😊', '😍', '🤔', '😅', '🙏', '👏', '🙌', '💪', '👍', '👎', '❤️', '🔥', '🎉', '✨', '💡', '✅', '❓', '🚀', '💻', '📚', '🧠', '🌟'];
const REACTIONS = ['👍', '❤️', '🎉', '💡', '🙏'];
const MAX_FILE = 1024 * 1024; // 1 MB
const FILE_ACCEPT = 'image/png,image/jpeg,image/gif,image/webp,.pdf,.doc,.docx,.txt';

// Emoji picker: inserts at the cursor of the given textarea.
const EmojiPicker = ({ targetRef, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const insert = (e) => {
    const el = targetRef.current;
    const start = el ? el.selectionStart : value.length;
    const end = el ? el.selectionEnd : value.length;
    const next = value.slice(0, start) + e + value.slice(end);
    onChange(next);
    setOpen(false);
    setTimeout(() => {
      if (el) {
        el.focus();
        el.selectionStart = el.selectionEnd = start + e.length;
      }
    }, 0);
  };
  return (
    <span className="relative inline-block">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Add an emoji" aria-expanded={open}
        className="text-lg leading-none px-2 py-1 rounded-lg hover:bg-gray-100">😊</button>
      {open && (
        <span className="absolute z-20 bottom-full mb-1 left-0 grid grid-cols-8 gap-0.5 bg-white border border-gray-200 rounded-xl shadow-lg p-2 w-64">
          {EMOJIS.map((e) => (
            <button key={e} type="button" onClick={() => insert(e)} className="text-lg p-1 rounded hover:bg-gray-100" aria-label={`Insert ${e}`}>
              {e}
            </button>
          ))}
        </span>
      )}
    </span>
  );
};

// Attach one small file (up to 1 MB).
const AttachButton = ({ file, onFile, id }) => (
  <span className="inline-flex items-center gap-2 text-sm">
    <label htmlFor={id} className="cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-100 text-gray-700" title="Attach a file (up to 1 MB)">
      📎 <span className="sr-only">Attach a file (up to 1 MB)</span>
    </label>
    <input id={id} type="file" accept={FILE_ACCEPT} className="hidden"
      onChange={(e) => {
        const f = e.target.files[0] || null;
        e.target.value = '';
        if (f && f.size > MAX_FILE) return toast.error('Files must be 1 MB or smaller.');
        onFile(f);
      }} />
    {file && (
      <span className="inline-flex items-center gap-1 text-xs bg-gray-100 rounded-full px-2 py-0.5">
        {file.name}
        <button type="button" onClick={() => onFile(null)} aria-label="Remove attachment" className="text-gray-500 hover:text-red-700">×</button>
      </span>
    )}
  </span>
);

const uploadAttachment = async (file, folder) => {
  if (!file) return null;
  const isImage = /^image\//.test(file.type);
  const r = isImage ? await uploadImageToBlob(file, folder) : await uploadDocumentToBlob(file, folder);
  return { url: r.url, name: file.name, size: file.size, type: file.type || '' };
};

const Attachment = ({ a }) =>
  !a?.url ? null : /^image\//.test(a.type) ? (
    <a href={a.url} target="_blank" rel="noopener noreferrer" className="block mt-2">
      <img src={a.url} alt={a.name || 'Attached image'} className="max-h-64 rounded-lg border border-gray-200" />
    </a>
  ) : (
    <a href={a.url} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-pink-700 border border-pink-200 rounded-lg px-3 py-1.5 hover:bg-pink-50">
      📄 {a.name || 'Attachment'}
    </a>
  );

// Text with clickable links (http/https only).
const Linkified = ({ text }) => {
  const parts = String(text || '').split(/(https?:\/\/[^\s<]+)/g);
  return parts.map((p, i) =>
    /^https?:\/\//.test(p) ? (
      <a key={i} href={p} target="_blank" rel="noopener noreferrer nofollow" className="text-pink-700 underline break-all">
        {p}
      </a>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    )
  );
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

const Thread = ({ base, t, me, isStaff, myName, courseTitle, onDeleted, onNeedSignIn, canParticipate, onNeedEnroll, canReview }) => {
  // Capstone review: admins, editors, or the course's mentor approve a capstone
  // before the learner can complete the course and get the certificate.
  const [review, setReview] = useState(t.review || null);
  const [changesOpen, setChangesOpen] = useState(false);
  const [reviewBusy, setReviewBusy] = useState(false);
  const location2 = useLocation();
  const decide = async (status, note = '') => {
    setReviewBusy(true);
    try {
      const next = { status, note: note.trim() || null, by: { uid: me.uid, name: myName }, at: new Date().toISOString() };
      await updateDoc(doc(db, base, 'threads', t.id), { review: next });
      setReview(next);
      setChangesOpen(false);
      notifyMember(t.uid, {
        type: 'capstone_review',
        title: status === 'approved' ? 'Your capstone was approved' : 'Changes requested on your capstone',
        body:
          status === 'approved'
            ? `"${t.title}" in ${courseTitle} was approved. You can now complete the course and get your certificate.`
            : `${note.trim() || 'Please update your capstone and share it again.'}`,
        link: `${location2.pathname}#forum`,
        ctaLabel: status === 'approved' ? 'Complete the course' : 'See the note',
      });
      toast.success(status === 'approved' ? 'Capstone approved. The learner has been notified.' : 'Changes requested. The learner has been notified.');
    } catch (err) {
      toast.error(friendlyError(err, 'Could not save the review.'));
    }
    setReviewBusy(false);
  };
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const replyRef = useRef(null);
  const [reactions, setReactions] = useState(t.reactions || {});
  const react = async (emoji) => {
    if (!me) return onNeedSignIn();
    if (!canParticipate) return onNeedEnroll();
    const mine = reactions[me.uid];
    const next = { ...reactions };
    if (mine === emoji) delete next[me.uid];
    else next[me.uid] = emoji;
    setReactions(next);
    try {
      await updateDoc(doc(db, base, 'threads', t.id), { [`reactions.${me.uid}`]: mine === emoji ? deleteField() : emoji });
    } catch (err) {
      setReactions(reactions);
      toast.error(friendlyError(err, 'Could not save your reaction.'));
    }
  };
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
  const startReply = () => {
    if (!me) return onNeedSignIn();
    if (!canParticipate) return onNeedEnroll();
    setOpen(true);
    if (!replies) load().catch(() => setReplies([]));
    setTimeout(() => replyRef.current?.focus(), 50);
  };

  const reply = async (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body && !file) return;
    if (body && countWords(body) < FORUM_LIMITS.replyMinWords)
      return toast.error(`Replies need at least ${FORUM_LIMITS.replyMinWords} words (you have ${countWords(body)}).`);
    setBusy(true);
    try {
      const attachment = await uploadAttachment(file, 'forum');
      const ref = await addDoc(collection(db, base, 'threads', t.id, 'replies'), {
        uid: me.uid, name: myName, body: body || '(attachment)', attachment, at: serverTimestamp(),
      });
      await updateDoc(doc(db, base, 'threads', t.id), { replyCount: increment(1), lastAt: serverTimestamp() }).catch(() => {});
      setReplies((rs) => [...(rs || []), { id: ref.id, uid: me.uid, name: myName, body: body || '(attachment)', attachment, at: new Date() }]);
      setCount((c) => c + 1);
      setText('');
      setFile(null);
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
          {t.kind === 'capstone' && (
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              review?.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : review?.status === 'changes' ? 'bg-amber-50 text-amber-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {review?.status === 'approved' ? 'Approved' : review?.status === 'changes' ? 'Changes requested' : 'Waiting for review'}
            </span>
          )}
          <span className="text-xs text-gray-500">
            {t.name || 'Learner'} · {timeAgo(t.at)} · {count} repl{count === 1 ? 'y' : 'ies'}
          </span>
        </div>
        <p className="font-semibold text-gray-900 mt-1.5">{t.title}</p>
        {!open && t.body && <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{t.body}</p>}
      </button>
      <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3" role="group" aria-label="Reactions and replies">
        {REACTIONS.map((e) => {
          const n = Object.values(reactions).filter((x) => x === e).length;
          const on = me && reactions[me.uid] === e;
          return (
            <button key={e} type="button" onClick={() => react(e)} aria-pressed={!!on} aria-label={`React ${e}`}
              className={`text-sm px-2 py-0.5 rounded-full border ${on ? 'border-pink-400 bg-pink-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
              {e}{n > 0 && <span className="ml-1 text-xs text-gray-600">{n}</span>}
            </button>
          );
        })}
        <span className="flex-1" />
        {count > 0 && (
          <button type="button" onClick={toggle} className="text-xs font-semibold text-gray-600 hover:text-gray-900 px-2 py-1">
            {open ? 'Hide replies' : `View ${count} repl${count === 1 ? 'y' : 'ies'}`}
          </button>
        )}
        <button type="button" onClick={startReply}
          className="text-xs font-semibold text-pink-700 border border-pink-200 bg-white hover:bg-pink-50 px-3 py-1 rounded-full">
          💬 Reply
        </button>
      </div>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <p className="text-sm text-gray-800 whitespace-pre-wrap mt-3"><Linkified text={t.body} /></p>
          <Attachment a={t.attachment} />
          {t.link && (
            <a href={t.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-semibold text-pink-700 hover:underline break-all">
              {t.link}
            </a>
          )}
          {t.kind === 'capstone' && review?.status === 'changes' && review?.note && (
            <p className="mt-3 text-sm bg-amber-50 border border-amber-200 rounded-lg p-3 text-gray-800">
              <strong>Reviewer's note:</strong> {review.note}
            </p>
          )}
          {t.kind === 'capstone' && canReview && me && t.uid !== me.uid && (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <span className="text-sm font-semibold text-gray-800 mr-auto">Review this capstone</span>
              <button onClick={() => decide('approved')} disabled={reviewBusy || review?.status === 'approved'}
                className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-50">
                {review?.status === 'approved' ? 'Approved' : 'Approve'}
              </button>
              <button onClick={() => setChangesOpen(true)} disabled={reviewBusy}
                className="text-xs font-semibold border border-gray-300 bg-white px-3 py-1.5 rounded-lg hover:bg-gray-50">
                Request changes
              </button>
            </div>
          )}
          <NoteDialog
            open={changesOpen}
            title="Request changes to this capstone"
            description="Tell the learner what to improve. They'll see this note and can share an updated capstone."
            placeholder="For example: add a link to your repository and describe how you tested your program."
            required
            confirmLabel="Send to the learner"
            tone="primary"
            busy={reviewBusy}
            onCancel={() => setChangesOpen(false)}
            onConfirm={(note) => decide('changes', note)}
          />
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
                <p className="text-sm text-gray-800 whitespace-pre-wrap mt-1"><Linkified text={r.body} /></p>
                <Attachment a={r.attachment} />
              </li>
            ))}
            {replies && replies.length === 0 && <li className="text-sm text-gray-500">No replies yet.</li>}
            {!replies && <li className="text-sm text-gray-500">Loading replies...</li>}
          </ul>
          {me && canParticipate ? (
            <form onSubmit={reply} className="mt-3">
              <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor={`reply-${t.id}`}>
                Your reply <span className="font-normal text-gray-500">(at least {FORUM_LIMITS.replyMinWords} words, up to {FORUM_LIMITS.replyMaxChars} characters)</span>
              </label>
              <textarea ref={replyRef} id={`reply-${t.id}`} rows={2} value={text} onChange={(e) => setText(e.target.value)} maxLength={FORUM_LIMITS.replyMaxChars}
                placeholder="Write a reply (links are clickable)"
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
              <LimitHint text={text} minWords={FORUM_LIMITS.replyMinWords} maxChars={FORUM_LIMITS.replyMaxChars} />
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <button type="submit" disabled={busy || (!text.trim() && !file)} className="fd-btn !py-1.5 !px-3 text-sm disabled:opacity-50">
                  {busy ? 'Posting...' : 'Reply'}
                </button>
                <EmojiPicker targetRef={replyRef} value={text} onChange={setText} />
                <AttachButton id={`reply-file-${t.id}`} file={file} onFile={setFile} />
              </div>
            </form>
          ) : (
            <p className="mt-3 text-sm text-gray-600">
              {me ? 'Enroll in this course to reply.' : 'Sign in and enroll in this course to reply.'}
            </p>
          )}
        </div>
      )}
    </li>
  );
};

const CourseForum = ({ track, slug, courseTitle, hasCapstone = false, displayName = '', onCapstonePosted, root = 'course_forum', forumKey = null, authorUid = null, title = 'Course forum', intro = 'Ask questions, help others, and share your work.', canParticipate = true, onEnroll = null, learningId = null }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const base = `${root}/${forumKey || courseKey(track, slug)}`;
  const bodyRef = useRef(null);
  const [file, setFile] = useState(null);
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

  const needEnroll = () => toast.info('Enroll in this course to post, reply, and react in its forum.');
  const startPost = (kind) => {
    if (!currentUser) return signInAndReturn(navigate, `${location.pathname}#forum`);
    if (!canParticipate) return needEnroll();
    setForm((f) => ({ ...f, kind }));
    setOpen(true);
  };

  const post = async (e) => {
    e.preventDefault();
    const title = form.title.trim();
    const body = form.body.trim();
    const minBody = form.kind === 'capstone' ? FORUM_LIMITS.capstoneMinWords : FORUM_LIMITS.bodyMinWords;
    if (countWords(title) < FORUM_LIMITS.titleMinWords)
      return toast.error(`The title needs at least ${FORUM_LIMITS.titleMinWords} words (you have ${countWords(title)}).`);
    if (countWords(body) < minBody)
      return toast.error(`${form.kind === 'capstone' ? 'Your project description' : 'The details'} need at least ${minBody} words (you have ${countWords(body)}).`);
    setBusy(true);
    try {
      const attachment = await uploadAttachment(file, 'forum');
      const data = {
        uid: currentUser.uid, name: myName, kind: form.kind, title, body, link: form.link.trim() || null, attachment,
        at: serverTimestamp(), replyCount: 0, lastAt: serverTimestamp(),
        track, ...(learningId ? { learningId } : {}),
        ...(form.kind === 'capstone' ? { review: { status: 'pending' } } : {}),
      };
      const ref = await addDoc(collection(db, base, 'threads'), data);
      setThreads((ts) => [{ id: ref.id, ...data, at: new Date() }, ...(ts || [])]);
      setOpen(false);
      setForm({ kind: 'question', title: '', body: '', link: '' });
      setFile(null);
      // Let the course's mentor know about new posts.
      if (authorUid && authorUid !== currentUser.uid) {
        notifyMember(authorUid, {
          type: 'forum_post',
          title: `New ${KINDS[data.kind]?.label.toLowerCase() || 'post'} in your course forum`,
          body: `${myName} posted "${title}" in ${courseTitle}.`,
          link: `${location.pathname}#forum`,
          ctaLabel: 'Open the forum',
        });
      }
      toast.success(form.kind === 'capstone' ? 'Capstone shared. A mentor or the She Model Tech team will review it.' : 'Posted.');
      if (form.kind === 'capstone') {
        if (onCapstonePosted) onCapstonePosted();
        alertStaff({
          type: 'capstone_submitted',
          title: 'A capstone is waiting for review',
          body: `${myName} shared "${title}" in ${courseTitle}.`,
          link: `${location.pathname}#forum`,
          roles: ['admin', 'editor'],
          ctaLabel: 'Review it',
        });
      }
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
          <h2 id="forum-h" className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">{intro}</p>
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

      {!canParticipate && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-700">
            {currentUser
              ? 'Only learners enrolled in this course can post, reply, and react. You can read the discussion.'
              : 'Sign in and enroll in this course to post, reply, and react. You can read the discussion.'}
          </p>
          {currentUser ? (
            onEnroll && (
              <button onClick={onEnroll} className="fd-btn !py-2 !px-3 text-sm">
                Enroll to join
              </button>
            )
          ) : (
            <button onClick={() => signInAndReturn(navigate, `${location.pathname}#forum`)} className="fd-btn !py-2 !px-3 text-sm">
              Sign in
            </button>
          )}
        </div>
      )}

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
            <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="forum-title">
              Title <span className="font-normal text-gray-500">(at least {FORUM_LIMITS.titleMinWords} words, up to {FORUM_LIMITS.titleMaxChars} characters)</span>
            </label>
            <input id="forum-title" className={input} value={form.title} maxLength={FORUM_LIMITS.titleMaxChars} aria-describedby="forum-title-hint"
              placeholder={form.kind === 'capstone' ? 'My capstone: ...' : 'What do you want to ask or discuss?'}
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <LimitHint id="forum-title-hint" text={form.title} minWords={FORUM_LIMITS.titleMinWords} maxChars={FORUM_LIMITS.titleMaxChars} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="forum-body">
              {form.kind === 'capstone' ? 'Describe your project' : 'Details'}{' '}
              <span className="font-normal text-gray-500">
                (at least {form.kind === 'capstone' ? FORUM_LIMITS.capstoneMinWords : FORUM_LIMITS.bodyMinWords} words, up to {FORUM_LIMITS.bodyMaxChars} characters)
              </span>
            </label>
            <textarea ref={bodyRef} id="forum-body" rows={5} className={input} value={form.body} maxLength={FORUM_LIMITS.bodyMaxChars} aria-describedby="forum-body-hint"
              placeholder={form.kind === 'capstone' ? 'What you built, how you approached it, what you learned, and anything you would like feedback on.' : ''}
              onChange={(e) => setForm({ ...form, body: e.target.value })} />
            <LimitHint
              id="forum-body-hint"
              text={form.body}
              minWords={form.kind === 'capstone' ? FORUM_LIMITS.capstoneMinWords : FORUM_LIMITS.bodyMinWords}
              maxChars={FORUM_LIMITS.bodyMaxChars}
            />
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <EmojiPicker targetRef={bodyRef} value={form.body} onChange={(v) => setForm({ ...form, body: v })} />
              <AttachButton id="forum-file" file={file} onFile={setFile} />
              <span className="text-xs text-gray-500">Links are clickable. Attach an image, PDF, or document up to 1 MB.</span>
            </div>
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
              onDeleted={(id) => setThreads((ts) => ts.filter((x) => x.id !== id))}
              onNeedSignIn={() => signInAndReturn(navigate, `${location.pathname}#forum`)}
              canParticipate={canParticipate}
              onNeedEnroll={needEnroll}
              canReview={isStaff || (!!learningId && !!authorUid && currentUser?.uid === authorUid)} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default CourseForum;
