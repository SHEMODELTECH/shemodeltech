// src/Pages/learning/CourseForum.jsx
// A discussion forum for each course: learners ask questions, discuss, and
// reply to each other. (Capstones were removed: team projects replace them.
// Older capstone posts still show, labelled "Project share".)
//
//   course_forum/{courseKey}/threads/{id}
//     uid, name, kind ('question' | 'discussion' | old 'capstone'), title, body,
//     link (optional), at, replyCount, lastAt, reactions {uid: emoji},
//     mentions [uid], editedAt
//   course_forum/{courseKey}/threads/{id}/replies/{rid}
//     uid, name, body, at, reactions {uid: emoji}, mentions [uid], editedAt
// (Mentor Hub discussions use the same shape under teacher_forum.)
//
// Anyone can read. Enrolled members post, reply, react and @mention people
// active in the forum; authors edit and delete their own posts and replies,
// and staff can remove anything. ?thread=ID opens and scrolls to a post.

import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import EmojiPicker from '../../components/EmojiPicker';
import ReportButton from '../../components/ReportButton';

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
  question: { label: 'Question', cls: 'bg-pink-50 text-pink-700' },
  discussion: { label: 'Discussion', cls: 'bg-gray-100 text-gray-700' },
  // Older posts shared as capstones (capstones were removed: projects replace them).
  capstone: { label: 'Project share', cls: 'bg-pink-50 text-pink-700' },
};

const REACTIONS = ['👍', '❤️', '🎉', '💡', '🙏'];
const MAX_FILE = 1024 * 1024; // 1 MB
const FILE_ACCEPT = 'image/png,image/jpeg,image/gif,image/webp,.pdf,.doc,.docx,.txt';

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

// ---------- Mentions ----------
// People who can be @mentioned: authors of loaded posts and replies in this
// forum, plus the course mentor. Stored as { uid: name }.
// Returns the uids whose "@Name" appears in the text (longest names first, so
// "@Ada" does not also match inside "@Ada Lovelace"), never including `selfUid`.
const findMentions = (text, people, selfUid) => {
  let rest = String(text || '');
  const out = [];
  Object.entries(people || {})
    .filter(([, n]) => n)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([uid, name]) => {
      const tag = `@${name}`;
      if (rest.includes(tag)) {
        if (uid !== selfUid && !out.includes(uid)) out.push(uid);
        rest = rest.split(tag).join(' ');
      }
    });
  return out.slice(0, 20);
};

// A textarea with a small "@" suggestion list (people active in this forum).
const MentionField = ({ textareaRef, value, onChange, people, selfUid, className, ...rest }) => {
  const [q, setQ] = useState(null); // { start, text } while typing a mention
  const [sel, setSel] = useState(0);
  const options = q
    ? Object.entries(people || {})
        .filter(([uid, n]) => n && uid !== selfUid && n.toLowerCase().startsWith(q.text.toLowerCase()))
        .slice(0, 6)
    : [];
  const detect = (val, pos) => {
    const before = val.slice(0, pos);
    const m = before.match(/(^|\s)@([^@\n]{0,30})$/);
    if (m) {
      setQ({ start: before.length - m[2].length - 1, end: pos, text: m[2] });
      setSel(0);
    } else setQ(null);
  };
  const pick = ([, name]) => {
    const el = textareaRef.current;
    const insert = `@${name} `;
    const next = value.slice(0, q.start) + insert + value.slice(q.end);
    onChange(next);
    setQ(null);
    setTimeout(() => {
      if (el) {
        el.focus();
        el.selectionStart = el.selectionEnd = q.start + insert.length;
      }
    }, 0);
  };
  const onKeyDown = (e) => {
    if (!options.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => (s + 1) % options.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => (s - 1 + options.length) % options.length); }
    else if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); pick(options[sel]); }
    else if (e.key === 'Escape') setQ(null);
  };
  return (
    <div className="relative">
      <textarea ref={textareaRef} value={value} className={className} {...rest}
        onChange={(e) => { onChange(e.target.value); detect(e.target.value, e.target.selectionStart); }}
        onKeyDown={onKeyDown}
        onBlur={() => setTimeout(() => setQ(null), 150)}
        aria-autocomplete="list" aria-expanded={options.length > 0} />
      {options.length > 0 && (
        <ul role="listbox" aria-label="People to mention"
          className="absolute z-30 left-0 top-full mt-1 w-64 max-w-full bg-white border border-gray-200 rounded-xl shadow-lg py-1">
          {options.map((o, i) => (
            <li key={o[0]} role="option" aria-selected={i === sel}>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); pick(o); }}
                className={`w-full text-left text-sm px-3 py-1.5 ${i === sel ? 'bg-pink-50 text-pink-700' : 'text-gray-800 hover:bg-gray-50'}`}>
                @{o[1]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Phones get the share sheet; computers copy the link.
const shareLink = async (path, title) => {
  const url = `${window.location.origin}${path}`;
  const phone = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
  if (phone && navigator.share) {
    try { await navigator.share({ title, url }); return; } catch (e) { if (e?.name === 'AbortError') return; }
  }
  try {
    await navigator.clipboard.writeText(url);
    toast.success('Link copied.');
  } catch (_) {
    window.prompt('Copy this link:', url);
  }
};

const Edited = ({ at }) => (at ? <span className="text-gray-400"> · edited</span> : null);

// Reactions row for a post or a reply.
const ReactionRow = ({ reactions, me, onReact, small = false }) =>
  REACTIONS.map((e) => {
    const n = Object.values(reactions).filter((x) => x === e).length;
    const on = me && reactions[me.uid] === e;
    if (small && n === 0 && !on) return null;
    return (
      <button key={e} type="button" onClick={() => onReact(e)} aria-pressed={!!on} aria-label={`React ${e}`}
        className={`${small ? 'text-xs' : 'text-sm'} px-2 py-0.5 rounded-full border ${on ? 'border-pink-400 bg-pink-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
        {e}{n > 0 && <span className="ml-1 text-xs text-gray-600">{n}</span>}
      </button>
    );
  });

// One reply: reactions, edit, reply-to, report, delete.
const Reply = ({ r, base, threadId, threadLink, me, myName, isStaff, people, canParticipate, onNeedSignIn, onNeedEnroll, onReplyTo, onRemove, onChanged, courseTitle }) => {
  const [reactions, setReactions] = useState(r.reactions || {});
  const [showPicker, setShowPicker] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(r.body);
  const [saving, setSaving] = useState(false);
  const editRef = useRef(null);
  const notified = useRef(false);
  const path = `${base}/threads/${threadId}/replies/${r.id}`;

  const react = async (emoji) => {
    if (!me) return onNeedSignIn();
    if (!canParticipate) return onNeedEnroll();
    setShowPicker(false);
    const mine = reactions[me.uid];
    const next = { ...reactions };
    if (mine === emoji) delete next[me.uid];
    else next[me.uid] = emoji;
    setReactions(next);
    try {
      await updateDoc(doc(db, path), { [`reactions.${me.uid}`]: mine === emoji ? deleteField() : emoji });
      // Bell only, only when adding a reaction, once per session.
      if (!mine && r.uid !== me.uid && !notified.current) {
        notified.current = true;
        notifyMember(r.uid, {
          type: 'forum_reaction',
          title: `${myName} reacted ${emoji} to your reply`,
          body: `In ${courseTitle}: "${String(r.body || '').slice(0, 100)}"`,
          link: threadLink,
          sendEmail: false,
          push: false,
        });
      }
    } catch (err) {
      setReactions(reactions);
      toast.error(friendlyError(err, 'Could not save your reaction.'));
    }
  };

  const save = async (e) => {
    e.preventDefault();
    const body = draft.trim();
    if (countWords(body) < FORUM_LIMITS.replyMinWords)
      return toast.error(`Replies need at least ${FORUM_LIMITS.replyMinWords} words (you have ${countWords(body)}).`);
    setSaving(true);
    try {
      const mentions = findMentions(body, people, me.uid);
      await updateDoc(doc(db, path), { body, mentions, editedAt: serverTimestamp() });
      const before = r.mentions || [];
      onChanged({ ...r, body, mentions, editedAt: new Date() });
      setEditing(false);
      mentions.filter((u) => !before.includes(u)).forEach((u) =>
        notifyMember(u, {
          type: 'forum_mention',
          title: `${myName} mentioned you in ${courseTitle}`,
          body: body.slice(0, 140),
          link: threadLink,
          sendEmail: false,
          ctaLabel: 'Read it',
        }));
    } catch (err) {
      toast.error(friendlyError(err, 'Could not save your changes.'));
    }
    setSaving(false);
  };

  const mineReply = me && r.uid === me.uid;
  return (
    <li className="bg-gray-50 border border-gray-100 rounded-lg p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-gray-500">
          <span className="font-semibold text-gray-800">{r.name || 'Learner'}</span> · {timeAgo(r.at)}<Edited at={r.editedAt} />
        </p>
        <span className="flex items-center gap-2">
          {mineReply && !editing && (
            <button onClick={() => { setDraft(r.body === '(attachment)' ? '' : r.body); setEditing(true); }} className="text-xs font-semibold text-gray-500 hover:text-gray-900">Edit</button>
          )}
          {me && (mineReply || isStaff) && (
            <button onClick={() => onRemove(r)} className="text-xs font-semibold text-gray-500 hover:text-red-700">Delete</button>
          )}
          <ReportButton
            target={{ area: 'course_forum', kind: 'reply', path, link: threadLink, excerpt: String(r.body || '').slice(0, 200), authorUid: r.uid, authorName: r.name || '' }}
            me={me ? { uid: me.uid, name: myName } : null} />
        </span>
      </div>
      {editing ? (
        <form onSubmit={save} className="mt-2">
          <label className="sr-only" htmlFor={`edit-reply-${r.id}`}>Edit your reply</label>
          <MentionField textareaRef={editRef} id={`edit-reply-${r.id}`} rows={2} value={draft} onChange={setDraft} people={people} selfUid={me.uid}
            maxLength={FORUM_LIMITS.replyMaxChars}
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500" />
          <LimitHint text={draft} minWords={FORUM_LIMITS.replyMinWords} maxChars={FORUM_LIMITS.replyMaxChars} />
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <button type="submit" disabled={saving} className="fd-btn !py-1.5 !px-3 text-sm disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={() => setEditing(false)} className="text-sm font-semibold text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100">Cancel</button>
            <EmojiPicker targetRef={editRef} value={draft} onChange={setDraft} />
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-800 whitespace-pre-wrap mt-1"><Linkified text={r.body} /></p>
      )}
      <Attachment a={r.attachment} />
      <div className="flex flex-wrap items-center gap-1.5 mt-2" role="group" aria-label="Reactions">
        <ReactionRow reactions={reactions} me={me} onReact={react} small />
        <span className="relative">
          <button type="button" onClick={() => (me ? (canParticipate ? setShowPicker((o) => !o) : onNeedEnroll()) : onNeedSignIn())}
            aria-expanded={showPicker} aria-label="Add a reaction"
            className="text-xs px-2 py-0.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-500">
            ☺+
          </button>
          {showPicker && (
            <span className="absolute z-20 bottom-full mb-1 left-0 flex gap-0.5 bg-white border border-gray-200 rounded-full shadow-lg px-1.5 py-1">
              {REACTIONS.map((e) => (
                <button key={e} type="button" onClick={() => react(e)} aria-label={`React ${e}`}
                  className={`text-base px-1 rounded-full hover:bg-gray-100 ${me && reactions[me.uid] === e ? 'bg-pink-50' : ''}`}>{e}</button>
              ))}
            </span>
          )}
        </span>
        {!mineReply && (
          <button type="button" onClick={() => onReplyTo(r)} className="text-xs font-semibold text-pink-700 hover:underline px-1">Reply</button>
        )}
      </div>
    </li>
  );
};

const Thread = ({ base, t: initial, me, isStaff, myName, courseTitle, onDeleted, onNeedSignIn, canParticipate, onNeedEnroll, canReview, onReplied = null, people, addPeople, autoOpen = false }) => {
  const [t, setT] = useState(initial);
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
  const liRef = useRef(null);
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
  const [replyTo, setReplyTo] = useState(null); // { uid, name } when replying to a reply
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(t.replyCount || 0);
  const location = useLocation();
  // The link that opens this post (shared, reported, and used in notifications).
  const threadLink = `${location.pathname}?thread=${t.id}#forum`;

  // Editing the post (author only).
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ title: '', body: '', link: '' });
  const [saving, setSaving] = useState(false);
  const editBodyRef = useRef(null);

  const load = async () => {
    const snap = await getDocs(query(collection(db, base, 'threads', t.id, 'replies'), orderBy('at', 'asc'), limit(200)));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setReplies(list);
    addPeople(list);
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
  // "Reply" on a reply: focus the reply box with "@Name " filled in.
  const replyToReply = (r) => {
    if (!me) return onNeedSignIn();
    if (!canParticipate) return onNeedEnroll();
    const tag = `@${r.name || 'Learner'} `;
    setReplyTo({ uid: r.uid, name: r.name || 'Learner' });
    setText((cur) => (cur.includes(tag.trim()) ? cur : cur.trim() ? `${cur.trim()} ${tag}` : tag));
    setTimeout(() => {
      const el = replyRef.current;
      if (el) {
        el.focus();
        el.selectionStart = el.selectionEnd = el.value.length;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  // Opened from a shared link: expand this post and scroll to it.
  useEffect(() => {
    if (!autoOpen) return undefined;
    setOpen(true);
    load().catch(() => setReplies([]));
    const timer = setTimeout(() => {
      const el = liRef.current;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-2', 'ring-pink-400');
      }
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpen]);

  const reply = async (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body && !file) return;
    if (body && countWords(body) < FORUM_LIMITS.replyMinWords)
      return toast.error(`Replies need at least ${FORUM_LIMITS.replyMinWords} words (you have ${countWords(body)}).`);
    setBusy(true);
    try {
      const attachment = await uploadAttachment(file, 'forum');
      const mentions = findMentions(body, people, me.uid);
      const data = { uid: me.uid, name: myName, body: body || '(attachment)', attachment, at: serverTimestamp(), ...(mentions.length ? { mentions } : {}) };
      const ref = await addDoc(collection(db, base, 'threads', t.id, 'replies'), data);
      await updateDoc(doc(db, base, 'threads', t.id), { replyCount: increment(1), lastAt: serverTimestamp() }).catch(() => {});
      setReplies((rs) => [...(rs || []), { id: ref.id, ...data, at: new Date() }]);
      setCount((c) => c + 1);
      setText('');
      setFile(null);
      if (onReplied) onReplied();
      // One notice per person: the post's author, the person replied to, then anyone mentioned.
      const told = new Set([me.uid]);
      const tell = (uid, n) => {
        if (!uid || told.has(uid)) return;
        told.add(uid);
        notifyMember(uid, { link: threadLink, sendEmail: false, ...n });
      };
      const snippet = body.slice(0, 140);
      tell(t.uid, { type: 'forum_reply', title: `${myName} replied to your post`, body: `"${t.title}" in ${courseTitle}: ${snippet}`, ctaLabel: 'Read the reply' });
      if (replyTo && body.includes(`@${replyTo.name}`))
        tell(replyTo.uid, { type: 'forum_reply', title: `${myName} replied to you`, body: `On "${t.title}" in ${courseTitle}: ${snippet}`, ctaLabel: 'Read the reply' });
      mentions.forEach((uid) =>
        tell(uid, { type: 'forum_mention', title: `${myName} mentioned you in ${courseTitle}`, body: `On "${t.title}": ${snippet}`, ctaLabel: 'Read it' }));
      setReplyTo(null);
    } catch (err) {
      toast.error(friendlyError(err, 'Could not post your reply.'));
    }
    setBusy(false);
  };

  const startEdit = () => {
    setDraft({ title: t.title || '', body: t.body || '', link: t.link || '' });
    setEditing(true);
    setOpen(true);
  };
  const saveEdit = async (e) => {
    e.preventDefault();
    const title = draft.title.trim();
    const body = draft.body.trim();
    const minBody = t.kind === 'capstone' ? FORUM_LIMITS.capstoneMinWords : FORUM_LIMITS.bodyMinWords;
    if (countWords(title) < FORUM_LIMITS.titleMinWords)
      return toast.error(`The title needs at least ${FORUM_LIMITS.titleMinWords} words (you have ${countWords(title)}).`);
    if (countWords(body) < minBody)
      return toast.error(`${t.kind === 'capstone' ? 'Your project description' : 'The details'} need at least ${minBody} words (you have ${countWords(body)}).`);
    setSaving(true);
    try {
      const mentions = findMentions(`${title}\n${body}`, people, me.uid);
      const changes = { title, body, link: draft.link.trim() || null, mentions };
      await updateDoc(doc(db, base, 'threads', t.id), { ...changes, editedAt: serverTimestamp() });
      const before = t.mentions || [];
      setT((cur) => ({ ...cur, ...changes, editedAt: new Date() }));
      setEditing(false);
      mentions.filter((u) => !before.includes(u)).forEach((u) =>
        notifyMember(u, {
          type: 'forum_mention',
          title: `${myName} mentioned you in ${courseTitle}`,
          body: `"${title}": ${body.slice(0, 120)}`,
          link: threadLink,
          sendEmail: false,
          ctaLabel: 'Read it',
        }));
    } catch (err) {
      toast.error(friendlyError(err, 'Could not save your changes.'));
    }
    setSaving(false);
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
  const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';
  const minBody = t.kind === 'capstone' ? FORUM_LIMITS.capstoneMinWords : FORUM_LIMITS.bodyMinWords;
  return (
    <li ref={liRef} id={`forum-thread-${t.id}`} className="border border-gray-200 rounded-xl bg-white scroll-mt-24">
      <button type="button" onClick={toggle} aria-expanded={open} className="w-full text-left p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${k.cls}`}>{k.label}</span>
          <span className="text-xs text-gray-500">
            {t.name || 'Learner'} · {timeAgo(t.at)} · {count} repl{count === 1 ? 'y' : 'ies'}<Edited at={t.editedAt} />
          </span>
        </div>
        <p className="font-semibold text-gray-900 mt-1.5">{t.title}</p>
        {!open && t.body && <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{t.body}</p>}
      </button>
      <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3" role="group" aria-label="Reactions and replies">
        <ReactionRow reactions={reactions} me={me} onReact={react} />
        <span className="flex-1" />
        {count > 0 && (
          <button type="button" onClick={toggle} className="text-xs font-semibold text-gray-600 hover:text-gray-900 px-2 py-1">
            {open ? 'Hide replies' : `View ${count} repl${count === 1 ? 'y' : 'ies'}`}
          </button>
        )}
        <button type="button" onClick={() => shareLink(threadLink, t.title)} aria-label="Share a link to this post"
          className="text-xs font-semibold text-gray-600 hover:text-gray-900 px-2 py-1">
          🔗 Share
        </button>
        <button type="button" onClick={startReply}
          className="text-xs font-semibold text-pink-700 border border-pink-200 bg-white hover:bg-pink-50 px-3 py-1 rounded-full">
          💬 Reply
        </button>
      </div>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {editing ? (
            <form onSubmit={saveEdit} className="mt-3 space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor={`edit-title-${t.id}`}>
                  Title <span className="font-normal text-gray-500">(at least {FORUM_LIMITS.titleMinWords} words, up to {FORUM_LIMITS.titleMaxChars} characters)</span>
                </label>
                <input id={`edit-title-${t.id}`} className={input} value={draft.title} maxLength={FORUM_LIMITS.titleMaxChars}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
                <LimitHint text={draft.title} minWords={FORUM_LIMITS.titleMinWords} maxChars={FORUM_LIMITS.titleMaxChars} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor={`edit-body-${t.id}`}>
                  Details <span className="font-normal text-gray-500">(at least {minBody} words, up to {FORUM_LIMITS.bodyMaxChars} characters)</span>
                </label>
                <MentionField textareaRef={editBodyRef} id={`edit-body-${t.id}`} rows={5} className={input} value={draft.body} maxLength={FORUM_LIMITS.bodyMaxChars}
                  people={people} selfUid={me.uid} onChange={(v) => setDraft((d) => ({ ...d, body: v }))} />
                <LimitHint text={draft.body} minWords={minBody} maxChars={FORUM_LIMITS.bodyMaxChars} />
                <EmojiPicker targetRef={editBodyRef} value={draft.body} onChange={(v) => setDraft((d) => ({ ...d, body: v }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor={`edit-link-${t.id}`}>
                  Link <span className="font-normal text-gray-500">(optional)</span>
                </label>
                <input id={`edit-link-${t.id}`} type="url" className={input} value={draft.link} placeholder="https://"
                  onChange={(e) => setDraft({ ...draft, link: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="fd-btn !py-1.5 !px-3 text-sm disabled:opacity-50">{saving ? 'Saving...' : 'Save changes'}</button>
                <button type="button" onClick={() => setEditing(false)} className="text-sm font-semibold text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100">Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <p className="text-sm text-gray-800 whitespace-pre-wrap mt-3"><Linkified text={t.body} /></p>
              <Attachment a={t.attachment} />
              {t.link && (
                <a href={t.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-semibold text-pink-700 hover:underline break-all">
                  {t.link}
                </a>
              )}
            </>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {me && t.uid === me.uid && !editing && (
              <button onClick={startEdit} className="text-xs font-semibold text-gray-500 hover:text-gray-900">Edit post</button>
            )}
            {me && (t.uid === me.uid || isStaff) && (
              <button onClick={removeThread} className="text-xs font-semibold text-gray-500 hover:text-red-700">Delete post</button>
            )}
            <ReportButton
              target={{ area: 'course_forum', kind: 'post', path: `${base}/threads/${t.id}`, link: threadLink, excerpt: `${t.title}: ${String(t.body || '').slice(0, 160)}`, authorUid: t.uid, authorName: t.name || '' }}
              me={me ? { uid: me.uid, name: myName } : null} />
          </div>
          <ul className="mt-4 space-y-2">
            {(replies || []).map((r) => (
              <Reply key={r.id} r={r} base={base} threadId={t.id} threadLink={threadLink} me={me} myName={myName} isStaff={isStaff} people={people}
                canParticipate={canParticipate} onNeedSignIn={onNeedSignIn} onNeedEnroll={onNeedEnroll} courseTitle={courseTitle}
                onReplyTo={replyToReply} onRemove={removeReply}
                onChanged={(nr) => setReplies((rs) => rs.map((x) => (x.id === nr.id ? nr : x)))} />
            ))}
            {replies && replies.length === 0 && <li className="text-sm text-gray-500">No replies yet.</li>}
            {!replies && <li className="text-sm text-gray-500">Loading replies...</li>}
          </ul>
          {me && canParticipate ? (
            <form onSubmit={reply} className="mt-3">
              <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor={`reply-${t.id}`}>
                Your reply <span className="font-normal text-gray-500">(at least {FORUM_LIMITS.replyMinWords} words, up to {FORUM_LIMITS.replyMaxChars} characters)</span>
              </label>
              <MentionField textareaRef={replyRef} id={`reply-${t.id}`} rows={2} value={text} onChange={setText} maxLength={FORUM_LIMITS.replyMaxChars}
                people={people} selfUid={me.uid}
                placeholder="Write a reply (type @ to mention someone; links are clickable)"
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

const CourseForum = ({ track, slug, courseTitle, hasCapstone = false, displayName = '', onCapstonePosted, onReplied = null, root = 'course_forum', forumKey = null, authorUid = null, title = 'Course forum', intro = 'Ask questions, help others, and share your work.', canParticipate = true, onEnroll = null, learningId = null }) => {
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [people, setPeople] = useState({}); // uid -> name, for @mentions
  const myName = displayName || currentUser?.displayName || (currentUser?.email || '').split('@')[0] || 'Learner';
  // ?thread=ID (from a shared link): open that post and scroll to it.
  const sharedId = new URLSearchParams(location.search).get('thread');

  const addPeople = useCallback((items) => {
    setPeople((p) => {
      let next = p;
      (items || []).forEach((x) => {
        if (x?.uid && x.name && !next[x.uid]) next = { ...next, [x.uid]: x.name };
      });
      return next;
    });
  }, []);

  useEffect(() => {
    getDocs(query(collection(db, base, 'threads'), orderBy('at', 'desc'), limit(100)))
      .then((snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setThreads(list);
        addPeople(list);
      })
      .catch(() => setThreads([]));
  }, [base, addPeople]);

  // A shared post older than the latest 100: fetch it on its own.
  useEffect(() => {
    if (!sharedId || !threads || threads.some((x) => x.id === sharedId)) return;
    getDoc(doc(db, base, 'threads', sharedId))
      .then((s) => { if (s.exists()) setThreads((ts) => (ts.some((x) => x.id === s.id) ? ts : [{ id: s.id, ...s.data() }, ...ts])); })
      .catch(() => {});
  }, [sharedId, threads, base]);
  useEffect(() => { if (sharedId) setFilter('all'); }, [sharedId]);

  // The course mentor can always be mentioned.
  useEffect(() => {
    if (!authorUid || !currentUser) return;
    getDoc(doc(db, 'users', authorUid))
      .then((s) => {
        const u = s.data() || {};
        const name = (u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.displayName || '').trim();
        if (name) addPeople([{ uid: authorUid, name }]);
      })
      .catch(() => {});
  }, [authorUid, currentUser, addPeople]);

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid))
      .then((s) => {
        setIsStaff(['admin', 'editor'].includes(s.data()?.role));
        setIsAdmin(s.data()?.role === 'admin');
      })
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
      const mentions = findMentions(`${title}\n${body}`, people, currentUser.uid);
      const data = {
        uid: currentUser.uid, name: myName, kind: form.kind, title, body, link: form.link.trim() || null, attachment,
        at: serverTimestamp(), replyCount: 0, lastAt: serverTimestamp(),
        track, ...(learningId ? { learningId } : {}),
        ...(mentions.length ? { mentions } : {}),
        ...(form.kind === 'capstone' ? { review: { status: 'pending' } } : {}),
      };
      const ref = await addDoc(collection(db, base, 'threads'), data);
      setThreads((ts) => [{ id: ref.id, ...data, at: new Date() }, ...(ts || [])]);
      setOpen(false);
      setForm({ kind: 'question', title: '', body: '', link: '' });
      setFile(null);
      const link = `${location.pathname}?thread=${ref.id}#forum`;
      // Anyone mentioned hears about it once (the mentor too, instead of the new-post notice).
      mentions.forEach((uid) =>
        notifyMember(uid, {
          type: 'forum_mention',
          title: `${myName} mentioned you in ${courseTitle}`,
          body: `"${title}": ${body.slice(0, 120)}`,
          link,
          sendEmail: false,
          ctaLabel: 'Read it',
        }));
      // Let the course's mentor know about new posts.
      if (authorUid && authorUid !== currentUser.uid && !mentions.includes(authorUid)) {
        notifyMember(authorUid, {
          type: 'forum_post',
          title: `New ${KINDS[data.kind]?.label.toLowerCase() || 'post'} in your course forum`,
          body: `${myName} posted "${title}" in ${courseTitle}.`,
          link,
          ctaLabel: 'Open the forum',
        });
      }
      toast.success(form.kind === 'capstone' ? 'Capstone shared. A mentor or She Model Tech will review it.' : 'Posted.');
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

  const shown = (threads || []).filter((t) => filter === 'all' || t.kind === filter || t.id === sharedId);
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
              .filter(([k]) => k !== 'capstone')
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
            <MentionField textareaRef={bodyRef} id="forum-body" rows={5} className={input} value={form.body} maxLength={FORUM_LIMITS.bodyMaxChars} aria-describedby="forum-body-hint"
              people={people} selfUid={currentUser?.uid}
              placeholder={form.kind === 'capstone' ? 'What you built, how you approached it, what you learned, and anything you would like feedback on.' : 'Type @ to mention someone in this forum.'}
              onChange={(v) => setForm((f) => ({ ...f, body: v }))} />
            <LimitHint
              id="forum-body-hint"
              text={form.body}
              minWords={form.kind === 'capstone' ? FORUM_LIMITS.capstoneMinWords : FORUM_LIMITS.bodyMinWords}
              maxChars={FORUM_LIMITS.bodyMaxChars}
            />
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <EmojiPicker targetRef={bodyRef} value={form.body} onChange={(v) => setForm((f) => ({ ...f, body: v }))} />
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
        {[['all', 'All'], ['question', 'Questions'], ['discussion', 'Discussions']].map(([v, l]) => (
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
            <Thread key={t.id} base={base} t={t} me={currentUser} isStaff={isAdmin} myName={myName} courseTitle={courseTitle} onReplied={onReplied}
              onDeleted={(id) => setThreads((ts) => ts.filter((x) => x.id !== id))}
              onNeedSignIn={() => signInAndReturn(navigate, `${location.pathname}#forum`)}
              canParticipate={canParticipate}
              onNeedEnroll={needEnroll}
              canReview={isStaff || (!!learningId && !!authorUid && currentUser?.uid === authorUid)}
              people={people} addPeople={addPeople} autoOpen={t.id === sharedId} />
          ))}
        </ul>
      )}
    </section>
  );
};

export default CourseForum;
