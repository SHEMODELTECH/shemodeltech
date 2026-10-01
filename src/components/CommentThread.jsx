// src/components/CommentThread.jsx
// Comments on a Proof Wall update: emoji reactions on each comment, and
// replies (one level, like LinkedIn). Replying to a reply adds to the same thread.
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { REACTIONS, addComment, deleteComment, setCommentReaction } from '../utils/updateSocial';

const Avatar = ({ photo, name, size = 'w-7 h-7' }) => (photo
  ? <img src={photo} alt="" className={`${size} rounded-full object-cover shrink-0`} />
  : <span className={`${size} rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center shrink-0`}>{(name || '?').charAt(0).toUpperCase()}</span>);

const Comment = ({ c, me, activityId, isReply, onReply, onUpdate, onDelete }) => {
  const [picker, setPicker] = useState(false);
  const [who, setWho] = useState(false);
  const mine = (c.reactions || {})[me.uid];
  const list = Object.entries(c.reactions || {});
  const emojis = [...new Set(list.map(([, e]) => e))].slice(0, 3);

  const react = async (emoji) => {
    setPicker(false);
    const next = mine === emoji ? null : emoji;
    const r = { ...(c.reactions || {}) }; const n = { ...(c.reactionNames || {}) }; const ph = { ...(c.reactionPhotos || {}) };
    if (next) { r[me.uid] = next; n[me.uid] = me.name; ph[me.uid] = me.photoURL || ''; } else { delete r[me.uid]; delete n[me.uid]; delete ph[me.uid]; }
    onUpdate({ ...c, reactions: r, reactionNames: n, reactionPhotos: ph });
    try { await setCommentReaction(activityId, c.id, me, next); } catch (e) { onUpdate(c); toast.error('Could not react.'); }
  };

  return (
    <div className={`flex gap-2 ${isReply ? 'ml-9' : ''}`}>
      <Avatar photo={c.photoURL} name={c.name} size={isReply ? 'w-6 h-6' : 'w-7 h-7'} />
      <div className="min-w-0 flex-1">
        <div className="bg-gray-50 rounded-xl px-3 py-2">
          <p className="text-xs font-semibold text-gray-900">{c.name}</p>
          <p className="text-sm text-gray-700 break-words whitespace-pre-wrap">{c.text}</p>
        </div>
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
            <span className="relative" onMouseEnter={() => setWho(true)} onMouseLeave={() => setWho(false)}>
              <button type="button" onClick={() => setWho((w) => !w)} className="hover:underline">{emojis.join('')} {list.length}</button>
              {who && (
                <div className="absolute left-0 top-full mt-1 z-20 w-52 max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg p-2">
                  {list.map(([u, e]) => (
                    <div key={u} className="flex items-center gap-2 px-1 py-1">
                      <span className="relative"><Avatar photo={c.reactionPhotos?.[u]} name={c.reactionNames?.[u]} size="w-6 h-6" /><span className="absolute -bottom-1 -right-1 text-[10px]">{e}</span></span>
                      <span className="text-xs text-gray-800 truncate">{c.reactionNames?.[u] || 'A member'}</span>
                    </div>
                  ))}
                </div>
              )}
            </span>
          )}
          {(c.uid === me.uid || me.isAdmin) && (
            <button type="button" onClick={() => onDelete(c)} className="hover:text-red-600">Delete</button>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentThread = ({ activityId, me, comments, setComments, onCountChange }) => {
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState(null); // top-level comment being replied to
  const [replyDraft, setReplyDraft] = useState('');

  const top = comments.filter((c) => !c.parentId);
  const repliesOf = (id) => comments.filter((c) => c.parentId === id);
  const update = (next) => setComments((xs) => xs.map((x) => (x.id === next.id ? next : x)));

  const post = async (text, parentId = null) => {
    const t = text.trim(); if (!t) return false;
    try {
      const id = await addComment(activityId, me, t, parentId);
      setComments((xs) => [...xs, { id, uid: me.uid, name: me.name, photoURL: me.photoURL, text: t, parentId }]);
      onCountChange(1);
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
    setReplyDraft(c.parentId ? `@${c.name} ` : '');
  };

  return (
    <div className="mt-2 space-y-3">
      <div className="flex gap-2">
        <input value={draft} maxLength={1000} onChange={(e) => setDraft(e.target.value)} placeholder="Add a comment…"
          onKeyDown={async (e) => { if (e.key === 'Enter' && await post(draft)) setDraft(''); }}
          className="flex-1 min-w-0 border border-gray-300 rounded-full px-3 py-1.5 text-sm" />
        <button type="button" disabled={!draft.trim()} onClick={async () => { if (await post(draft)) setDraft(''); }}
          className="text-xs font-semibold bg-pink-600 text-white px-3 py-1.5 rounded-full disabled:opacity-40">Post</button>
      </div>
      {top.map((c) => (
        <div key={c.id} className="space-y-2">
          <Comment c={c} me={me} activityId={activityId} onReply={startReply} onUpdate={update} onDelete={remove} />
          {repliesOf(c.id).map((r) => (
            <Comment key={r.id} c={r} me={me} activityId={activityId} isReply onReply={startReply} onUpdate={update} onDelete={remove} />
          ))}
          {replyTo?.id === c.id && (
            <div className="ml-9 flex gap-2">
              <input autoFocus value={replyDraft} maxLength={1000} onChange={(e) => setReplyDraft(e.target.value)} placeholder={`Reply to ${c.name}…`}
                onKeyDown={async (e) => { if (e.key === 'Enter' && await post(replyDraft, c.id)) { setReplyDraft(''); setReplyTo(null); } }}
                className="flex-1 min-w-0 border border-gray-300 rounded-full px-3 py-1.5 text-sm" />
              <button type="button" disabled={!replyDraft.trim()} onClick={async () => { if (await post(replyDraft, c.id)) { setReplyDraft(''); setReplyTo(null); } }}
                className="text-xs font-semibold bg-pink-600 text-white px-3 py-1.5 rounded-full disabled:opacity-40">Reply</button>
            </div>
          )}
        </div>
      ))}
      {comments.length === 0 && <p className="text-xs text-gray-400">No comments yet. Start the conversation.</p>}
    </div>
  );
};

export default CommentThread;
