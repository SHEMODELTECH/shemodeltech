// src/components/UpdateActions.jsx
// LinkedIn-style actions under a member's update: React (emojis), Comment,
// Repost, and Send. Only for updates, not other Proof Wall items.
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { REACTIONS, addComment, deleteComment, listComments, postUrl, repostUpdate, setReaction } from '../utils/updateSocial';

const Btn = ({ onClick, children, active, label }) => (
  <button type="button" onClick={onClick} aria-label={label}
    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${active ? 'text-pink-700' : 'text-gray-600'} hover:bg-gray-100`}>
    {children}
  </button>
);

const UpdateActions = ({ a, me, onChange }) => {
  const [picker, setPicker] = useState(false);
  const [comments, setComments] = useState(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [reposting, setReposting] = useState(false);
  const [repostText, setRepostText] = useState('');
  const [whoOpen, setWhoOpen] = useState(false); // who reacted (hover or tap)
  const mine = (a.reactions || {})[me.uid];
  const reactions = Object.values(a.reactions || {});
  const top = [...new Set(reactions)].slice(0, 3);

  const react = async (emoji) => {
    setPicker(false);
    const next = mine === emoji ? null : emoji;
    const reactionsNext = { ...(a.reactions || {}) };
    const namesNext = { ...(a.reactionNames || {}) };
    const photosNext = { ...(a.reactionPhotos || {}) };
    if (next) { reactionsNext[me.uid] = next; namesNext[me.uid] = me.name; photosNext[me.uid] = me.photoURL || ''; }
    else { delete reactionsNext[me.uid]; delete namesNext[me.uid]; delete photosNext[me.uid]; }
    onChange({ ...a, reactions: reactionsNext, reactionNames: namesNext, reactionPhotos: photosNext });
    try { await setReaction(a.id, me.uid, me.name, next, me.photoURL); } catch (e) { onChange(a); toast.error('Could not react.'); }
  };
  const toggleComments = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && comments === null) setComments(await listComments(a.id).catch(() => []));
  };
  const send = async () => {
    const url = postUrl(a.id);
    try {
      if (navigator.share) await navigator.share({ title: 'She Model Tech', text: `${a.actorName || 'A member'} on She Model Tech`, url });
      else { await navigator.clipboard.writeText(url); toast.success('Link copied. Paste it in a message.'); }
    } catch (_) { /* cancelled */ }
  };

  return (
    <div className="mt-2">
      {(reactions.length > 0 || a.commentCount > 0 || a.repostCount > 0) && (
        <div className="flex items-center justify-between text-xs text-gray-500 pb-1.5">
          {reactions.length > 0 ? (
            <span className="relative" onMouseEnter={() => setWhoOpen(true)} onMouseLeave={() => setWhoOpen(false)}>
              <button type="button" onClick={() => setWhoOpen((o) => !o)} aria-expanded={whoOpen} aria-label="See who reacted"
                className="flex items-center gap-1.5 hover:underline">
                {/* Small photos of the people who reacted, like LinkedIn */}
                <span className="flex -space-x-1.5">
                  {Object.keys(a.reactions || {}).slice(0, 3).map((u) => {
                    const photo = a.reactionPhotos?.[u];
                    const name = a.reactionNames?.[u] || '?';
                    return photo ? (
                      <img key={u} src={photo} alt="" className="w-5 h-5 rounded-full border-2 border-white object-cover" />
                    ) : (
                      <span key={u} className="w-5 h-5 rounded-full border-2 border-white bg-pink-100 text-pink-700 text-[9px] font-bold flex items-center justify-center">{name.charAt(0).toUpperCase()}</span>
                    );
                  })}
                </span>
                <span>{top.join('')} {reactions.length}</span>
              </button>
              {whoOpen && (
                <div className="absolute left-0 top-full mt-1 z-20 w-60 max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg p-2" role="dialog" aria-label="Reactions">
                  <p className="text-[11px] font-semibold text-gray-500 px-1 pb-1">Reactions</p>
                  {Object.entries(a.reactions || {}).map(([u, emoji]) => {
                    const photo = a.reactionPhotos?.[u];
                    const name = a.reactionNames?.[u] || 'A member';
                    return (
                      <div key={u} className="flex items-center gap-2 px-1 py-1">
                        <span className="relative shrink-0">
                          {photo ? <img src={photo} alt="" className="w-7 h-7 rounded-full object-cover" /> : <span className="w-7 h-7 rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center">{name.charAt(0).toUpperCase()}</span>}
                          <span className="absolute -bottom-1 -right-1 text-[11px]">{emoji}</span>
                        </span>
                        <span className="text-xs text-gray-800 truncate">{name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </span>
          ) : <span />}
          <span>
            {a.commentCount > 0 && <button type="button" onClick={toggleComments} className="hover:underline">{a.commentCount} comment{a.commentCount === 1 ? '' : 's'}</button>}
            {a.commentCount > 0 && a.repostCount > 0 && ' · '}
            {a.repostCount > 0 && `${a.repostCount} repost${a.repostCount === 1 ? '' : 's'}`}
          </span>
        </div>
      )}
      <div className="relative flex border-t border-gray-100 pt-1">
        {picker && (
          <div className="absolute bottom-full left-0 mb-1 flex gap-1 bg-white border border-gray-200 shadow-lg rounded-full px-2 py-1 z-10" role="menu">
            {REACTIONS.map(([e, l]) => (
              <button key={l} type="button" onClick={() => react(e)} title={l} aria-label={l} className="text-xl hover:scale-125 transition-transform px-0.5">{e}</button>
            ))}
          </div>
        )}
        <Btn onClick={() => (mine ? react(mine) : setPicker((p) => !p))} active={!!mine} label="React">
          <span aria-hidden="true">{mine || '👍'}</span>{mine ? REACTIONS.find(([e]) => e === mine)?.[1] : 'Like'}
        </Btn>
        <button type="button" onClick={() => setPicker((p) => !p)} aria-label="Choose a reaction" className="px-1 text-gray-400 hover:text-gray-700 text-xs">▾</button>
        <Btn onClick={toggleComments} label="Comment"><span aria-hidden="true">💬</span>Comment</Btn>
        <Btn onClick={() => setReposting((r) => !r)} label="Repost"><span aria-hidden="true">🔁</span>Repost</Btn>
        <Btn onClick={send} label="Send"><span aria-hidden="true">📤</span>Send</Btn>
      </div>

      {reposting && (
        <div className="mt-2 rounded-lg border border-gray-200 p-3">
          <textarea rows={2} maxLength={1000} value={repostText} onChange={(e) => setRepostText(e.target.value)}
            placeholder="Add your thoughts (optional)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setReposting(false)} className="text-xs font-semibold text-gray-600 px-3 py-1.5">Cancel</button>
            <button type="button" onClick={async () => {
              try { await repostUpdate(a, me, repostText); setReposting(false); setRepostText(''); onChange({ ...a, repostCount: (a.repostCount || 0) + 1 }, true); toast.success('Reposted to the Proof Wall.'); }
              catch (e) { toast.error('Could not repost.'); }
            }} className="text-xs font-semibold bg-pink-600 text-white px-3 py-1.5 rounded-lg">Repost</button>
          </div>
        </div>
      )}

      {open && (
        <div className="mt-2 space-y-2">
          <div className="flex gap-2">
            <input value={draft} maxLength={1000} onChange={(e) => setDraft(e.target.value)} placeholder="Add a comment…"
              onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.nextSibling?.click(); }}
              className="flex-1 min-w-0 border border-gray-300 rounded-full px-3 py-1.5 text-sm" />
            <button type="button" disabled={!draft.trim()} onClick={async () => {
              const text = draft.trim(); if (!text) return;
              try {
                const id = await addComment(a.id, me, text);
                setComments((c) => [...(c || []), { id, uid: me.uid, name: me.name, photoURL: me.photoURL, text }]);
                setDraft('');
                onChange({ ...a, commentCount: (a.commentCount || 0) + 1 });
              } catch (e) { toast.error('Could not comment.'); }
            }} className="text-xs font-semibold bg-pink-600 text-white px-3 py-1.5 rounded-full disabled:opacity-40">Post</button>
          </div>
          {(comments || []).map((c) => (
            <div key={c.id} className="flex gap-2">
              {c.photoURL ? <img src={c.photoURL} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" /> : <span className="w-7 h-7 rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center shrink-0">{(c.name || '?').charAt(0)}</span>}
              <div className="min-w-0 bg-gray-50 rounded-xl px-3 py-2">
                <p className="text-xs font-semibold text-gray-900">{c.name}</p>
                <p className="text-sm text-gray-700 break-words">{c.text}</p>
                {(c.uid === me.uid || me.isAdmin) && (
                  <button type="button" onClick={async () => { try { await deleteComment(a.id, c.id); setComments((xs) => xs.filter((x) => x.id !== c.id)); onChange({ ...a, commentCount: Math.max(0, (a.commentCount || 1) - 1) }); } catch (e) { toast.error('Could not delete.'); } }}
                    className="text-[11px] text-gray-400 hover:text-red-600 mt-0.5">Delete</button>
                )}
              </div>
            </div>
          ))}
          {comments && comments.length === 0 && <p className="text-xs text-gray-400">No comments yet. Start the conversation.</p>}
        </div>
      )}
    </div>
  );
};

export default UpdateActions;
