// src/components/CommentThread.jsx
// Comments on a Proof Wall update: emoji reactions on each comment, and
// replies (one level, like LinkedIn). Replying to a reply adds to the same thread.
// Authors can edit their own comments and replies; anyone can report one.
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  REACTIONS, addComment, deleteComment, editComment, notifyCommentAuthors, notifyMentions, notifyReaction, setCommentReaction,
} from '../utils/updateSocial';
import ReactionsModal from './ReactionsModal';
import { usePhotos } from '../hooks/usePhotos';
import { MentionTextarea } from './MentionTextarea';
import EmojiPicker from './EmojiPicker';
import ReportButton from './ReportButton';

// MentionTextarea keeps its own ref, so point the emoji picker at the textarea inside a wrapper.
const textareaIn = (wrapRef) => ({ get current() { return wrapRef.current?.querySelector('textarea') || null; } });

const nameOf = (u) => ((u.firstName && u.lastName) ? `${u.firstName} ${u.lastName}` : (u.displayName || 'member')).trim();

// A comment box: @mentions, an emoji button, and a send button.
const Composer = ({ value, onChange, onPick, placeholder, autoFocus, onSubmit, label }) => {
  const wrapRef = useRef(null);
  return (
    <div className="flex gap-2 items-start">
      <div ref={wrapRef} className="flex-1 min-w-0">
        <MentionTextarea plainNames rows={1} autoFocus={autoFocus} value={value} onChange={onChange} onMentionSelect={onPick}
          placeholder={placeholder} maxLength={1000}
          className="w-full border border-gray-300 rounded-2xl px-3 py-1.5 text-sm resize-none" />
      </div>
      <EmojiPicker targetRef={textareaIn(wrapRef)} value={value} onChange={onChange} up={false} className="shrink-0" />
      <button type="button" disabled={!value.trim()} onClick={onSubmit}
        className="text-xs font-semibold bg-pink-600 text-white px-3 py-1.5 rounded-full disabled:opacity-40 shrink-0">{label}</button>
    </div>
  );
};

// Show "@First Last" mentions in pink.
const withMentions = (text, mentions) => {
  const names = (mentions || []).map((m) => `@${m.name}`).filter(Boolean);
  if (!names.length) return text;
  const esc = names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return String(text).split(new RegExp(`(${esc.join('|')})`, 'g')).map((part, i) => (names.includes(part)
    ? <span key={i} className="font-semibold text-pink-700">{part}</span> : part));
};

const Avatar = ({ photo, name, size = 'w-7 h-7' }) => (photo
  ? <img src={photo} alt="" loading="lazy" className={`${size} rounded-full object-cover shrink-0`} />
  : <span className={`${size} rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center shrink-0`}>{(name || '?').charAt(0).toUpperCase()}</span>);

const Comment = ({ c, me, activityId, isReply, onReply, onUpdate, onDelete }) => {
  const [picker, setPicker] = useState(false);
  const [who, setWho] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState('');
  const [editMentions, setEditMentions] = useState([]);
  const [saving, setSaving] = useState(false);
  const editWrapRef = useRef(null);
  const mine = (c.reactions || {})[me.uid];
  const list = Object.entries(c.reactions || {});
  const photoOf = usePhotos([c.uid, ...Object.keys(c.reactions || {})], { ...(c.reactionPhotos || {}), [c.uid]: c.photoURL || '' });
  const emojis = [...new Set(list.map(([, e]) => e))].slice(0, 3);

  const react = async (emoji) => {
    setPicker(false);
    const next = mine === emoji ? null : emoji;
    const r = { ...(c.reactions || {}) }; const n = { ...(c.reactionNames || {}) }; const ph = { ...(c.reactionPhotos || {}) };
    if (next) { r[me.uid] = next; n[me.uid] = me.name; ph[me.uid] = me.photoURL || ''; } else { delete r[me.uid]; delete n[me.uid]; delete ph[me.uid]; }
    onUpdate({ ...c, reactions: r, reactionNames: n, reactionPhotos: ph });
    try {
      await setCommentReaction(activityId, c.id, me, next);
      if (next && !mine) {
        notifyReaction({ item: c, ownerUid: c.uid, me, emoji: next, pathParts: ['activity', activityId, 'comments', c.id], activityId, isComment: true });
      }
    } catch (e) { onUpdate(c); toast.error('Could not react.'); }
  };

  const startEdit = () => { setEditDraft(c.text || ''); setEditMentions(c.mentions || []); setEditing(true); };
  const saveEdit = async () => {
    const t = editDraft.trim();
    if (!t) { toast.error("A comment can't be empty."); return; }
    const kept = editMentions.filter((m) => t.includes(`@${m.name}`));
    setSaving(true);
    try {
      await editComment(activityId, c.id, t, kept);
      // Only people newly tagged in the edit hear about it.
      const before = new Set((c.mentions || []).map((m) => m.uid));
      notifyMentions(kept.filter((m) => !before.has(m.uid)), me, activityId);
      onUpdate({ ...c, text: t, mentions: kept, editedAt: new Date() });
      setEditing(false);
    } catch (e) { toast.error('Could not save your edit.'); }
    setSaving(false);
  };
  const kind = isReply ? 'reply' : 'comment';

  return (
    <div className={`flex gap-2 ${isReply ? 'ml-9' : ''}`}>
      <Avatar photo={photoOf(c.uid)} name={c.name} size={isReply ? 'w-6 h-6' : 'w-7 h-7'} />
      <div className="min-w-0 flex-1">
        {editing ? (
          <div className="space-y-1.5">
            <div className="flex gap-2 items-start">
              <div ref={editWrapRef} className="flex-1 min-w-0">
                <MentionTextarea plainNames rows={2} autoFocus value={editDraft} onChange={setEditDraft} maxLength={1000}
                  onMentionSelect={(u) => { const uid = u.uid || u.id; setEditMentions((xs) => (xs.some((m) => m.uid === uid) ? xs : [...xs, { uid, name: nameOf(u) }])); }}
                  placeholder={`Edit your ${kind}…`}
                  className="w-full border border-gray-300 rounded-2xl px-3 py-1.5 text-sm resize-none" />
              </div>
              <EmojiPicker targetRef={textareaIn(editWrapRef)} value={editDraft} onChange={setEditDraft} up={false} className="shrink-0" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={saveEdit} disabled={saving || !editDraft.trim()}
                className="text-xs font-semibold bg-pink-600 text-white px-3 py-1.5 rounded-full disabled:opacity-40">{saving ? 'Saving…' : 'Save'}</button>
              <button type="button" onClick={() => setEditing(false)} className="text-xs font-semibold text-gray-600 px-3 py-1.5">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-xs font-semibold text-gray-900">{c.name}</p>
            <p className="text-sm text-gray-700 break-words whitespace-pre-wrap">{withMentions(c.text, c.mentions)}</p>
          </div>
        )}
        {!editing && (
        <div className="relative flex flex-wrap items-center gap-3 mt-1 pl-1 text-[11px] text-gray-500">
          {picker && (
            <div className="absolute bottom-full left-0 mb-1 flex gap-1 bg-white border border-gray-200 shadow-lg rounded-full px-2 py-1 z-10" role="menu">
              {REACTIONS.map(([e, l]) => <button key={l} type="button" onClick={() => react(e)} title={l} aria-label={l} className="text-lg hover:scale-125 transition-transform">{e}</button>)}
            </div>
          )}
          <button type="button" onClick={() => (mine ? react(mine) : setPicker((p) => !p))} className={`font-semibold hover:text-gray-800 ${mine ? 'text-pink-700' : ''}`}>
            {mine ? `${mine} ${REACTIONS.find(([e]) => e === mine)?.[1]}` : 'Like'}
          </button>
          <button type="button" onClick={() => setPicker((p) => !p)} aria-label="Choose a reaction" className="hover:text-gray-800">▾</button>
          <button type="button" onClick={() => onReply(c)} className="font-semibold hover:text-gray-800">Reply</button>
          {list.length > 0 && (
            <span className="relative">
              <button type="button" onClick={() => setWho(true)} className="hover:underline">{emojis.join('')} {list.length}</button>
              {who && (
                <ReactionsModal reactions={c.reactions} names={c.reactionNames} photos={Object.fromEntries(Object.keys(c.reactions || {}).map((u) => [u, photoOf(u)]))} onClose={() => setWho(false)} />
              )}
            </span>
          )}
          {c.editedAt && <span className="text-gray-400">edited</span>}
          {c.uid === me.uid && (
            <button type="button" onClick={startEdit} className="hover:text-gray-800">Edit</button>
          )}
          {(c.uid === me.uid || me.isAdmin) && (
            <button type="button" onClick={() => onDelete(c)} className="hover:text-red-600">Delete</button>
          )}
          <ReportButton
            me={{ uid: me.uid, name: me.name }}
            target={{
              area: 'proofwall',
              kind,
              path: `activity/${activityId}/comments/${c.id}`,
              link: `/proof-wall?post=${activityId}`,
              excerpt: c.text || '',
              authorUid: c.uid,
              authorName: c.name,
            }}
          />
        </div>
        )}
      </div>
    </div>
  );
};

const CommentThread = ({ activityId, ownerUid, me, comments, setComments, onCountChange }) => {
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState(null); // top-level comment being replied to
  const [replyDraft, setReplyDraft] = useState('');
  const [replyTarget, setReplyTarget] = useState(null); // the comment or reply whose Reply was tapped
  const [mentions, setMentions] = useState([]); // people tagged in the comment being written
  const [replyMentions, setReplyMentions] = useState([]);
  const pick = (setter) => (u) => {
    const uid = u.uid || u.id;
    const name = nameOf(u);
    setter((xs) => (xs.some((m) => m.uid === uid) ? xs : [...xs, { uid, name }]));
  };

  const top = comments.filter((c) => !c.parentId);
  const repliesOf = (id) => comments.filter((c) => c.parentId === id);
  const update = (next) => setComments((xs) => xs.map((x) => (x.id === next.id ? next : x)));

  const post = async (text, parentId = null, tagged = []) => {
    const t = text.trim(); if (!t) return false;
    // Only people whose "@First Last" is still in the text.
    const kept = tagged.filter((m) => t.includes(`@${m.name}`));
    try {
      const id = await addComment(activityId, me, t, parentId, kept);
      setComments((xs) => [...xs, { id, uid: me.uid, name: me.name, photoURL: me.photoURL, text: t, parentId, mentions: kept }]);
      onCountChange(1);
      notifyMentions(kept, me, activityId);
      // The update's author and, for a reply, the comment's author (once each, not twice if also tagged).
      const parents = parentId
        ? [replyTarget, comments.find((x) => x.id === parentId)].filter(Boolean)
        : [];
      notifyCommentAuthors({ activityId, me, ownerUid, parents, mentions: kept, text: t });
      return true;
    } catch (e) { toast.error('Could not post.'); return false; }
  };
  const remove = async (c) => {
    try {
      await deleteComment(activityId, c.id, c.parentId || null);
      // Deleting a comment also hides its replies from view.
      const gone = new Set([c.id, ...repliesOf(c.id).map((r) => r.id)]);
      setComments((xs) => xs.filter((x) => !gone.has(x.id)));
      onCountChange(-1);
    } catch (e) { toast.error('Could not delete.'); }
  };
  const startReply = (c) => {
    const parent = c.parentId ? top.find((t) => t.id === c.parentId) || c : c;
    setReplyTo(parent);
    setReplyTarget(c);
    setReplyDraft(c.parentId ? `@${c.name} ` : '');
    setReplyMentions(c.parentId && c.uid !== me.uid ? [{ uid: c.uid, name: c.name }] : []);
  };

  return (
    <div className="mt-2 space-y-3">
      <Composer value={draft} onChange={setDraft} onPick={pick(setMentions)} label="Post"
        placeholder="Add a comment… Type @ to mention someone"
        onSubmit={async () => { if (await post(draft, null, mentions)) { setDraft(''); setMentions([]); } }} />
      {top.map((c) => (
        <div key={c.id} className="space-y-2">
          <Comment c={c} me={me} activityId={activityId} onReply={startReply} onUpdate={update} onDelete={remove} />
          {repliesOf(c.id).map((r) => (
            <Comment key={r.id} c={r} me={me} activityId={activityId} isReply onReply={startReply} onUpdate={update} onDelete={remove} />
          ))}
          {replyTo?.id === c.id && (
            <div className="ml-9">
              <Composer value={replyDraft} onChange={setReplyDraft} onPick={pick(setReplyMentions)} label="Reply" autoFocus
                placeholder={`Reply to ${c.name}…`}
                onSubmit={async () => { if (await post(replyDraft, c.id, replyMentions)) { setReplyDraft(''); setReplyTo(null); setReplyMentions([]); } }} />
            </div>
          )}
        </div>
      ))}
      {comments.length === 0 && <p className="text-xs text-gray-400">No comments yet. Start the conversation.</p>}
    </div>
  );
};

export default CommentThread;
