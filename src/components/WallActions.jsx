// src/components/WallActions.jsx
// Proof Wall pieces shared by every card:
//   <WallStats>    views · clicks (and reposts) under a post
//   <WallActions>  React (emojis), Repost and Send, for cards that aren't
//                  updates: Needs a lead, badges, shipped projects, milestones,
//                  Open projects and Top Talent. No comments: only updates have them.
//   useWallView()  counts a view once the card is at least half on screen.
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { REACTIONS } from '../utils/updateSocial';
import { compact, notifyWallReaction, recordView, repostCard, setWallReaction } from '../utils/wallStats';
import ReactionsModal from './ReactionsModal';
import { usePhotos } from '../hooks/usePhotos';

const Eye = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const Pointer = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>
);

// "👁 120 views · 34 clicks"
export const WallStats = ({ stats = {}, className = '' }) => (
  <div className={`flex items-center gap-3 text-[11px] text-gray-500 ${className}`}>
    <span className="inline-flex items-center gap-1" title="Members who saw this">
      <Eye />{compact(stats.views)} view{stats.views === 1 ? '' : 's'}
    </span>
    <span className="inline-flex items-center gap-1" title="Members who opened what it links to">
      <Pointer />{compact(stats.clicks)} click{stats.clicks === 1 ? '' : 's'}
    </span>
  </div>
);

// Count a view when the card is at least half visible (once per member per day).
// `ready`: the card's numbers have loaded, so the new view adds to them.
export const useWallView = (key, me, ownerUid, onCounted, ready = true) => {
  const ref = useRef(null);
  const cb = useRef(onCounted);
  cb.current = onCounted;
  useEffect(() => {
    const el = ref.current;
    if (!ready || !el || !key || !me?.uid || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        if (recordView(key, me, ownerUid) && cb.current) cb.current();
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [key, me?.uid, ownerUid, ready]); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
};

const Btn = ({ onClick, children, active, label }) => (
  <button type="button" onClick={onClick} aria-label={label}
    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${active ? 'text-pink-700' : 'text-gray-600'} hover:bg-gray-100`}>
    {children}
  </button>
);

/**
 * card: { key, kind, headline, text, link (page on the site, for Send and the repost),
 *         ownerUid (told about reactions), what ("your badge", ...), actorId, actorName, projectTitle }
 * stats: wall_stats data for card.key; onStats(next) updates it on screen.
 */
const WallActions = ({ card, stats = {}, onStats, me, onReposted }) => {
  const [picker, setPicker] = useState(false);
  const [reposting, setReposting] = useState(false);
  const [repostText, setRepostText] = useState('');
  const [busy, setBusy] = useState(false);
  const [whoOpen, setWhoOpen] = useState(false);
  const photoOf = usePhotos(Object.keys(stats.reactions || {}), stats.reactionPhotos);
  const mine = (stats.reactions || {})[me.uid];
  const reactions = Object.values(stats.reactions || {});
  const top = [...new Set(reactions)].slice(0, 3);
  const fullUrl = `${window.location.origin}${card.link || '/proof-wall'}`;

  const react = async (emoji) => {
    setPicker(false);
    const next = mine === emoji ? null : emoji;
    const before = stats;
    const r = { ...(stats.reactions || {}) };
    const n = { ...(stats.reactionNames || {}) };
    const p = { ...(stats.reactionPhotos || {}) };
    if (next) { r[me.uid] = next; n[me.uid] = me.name; p[me.uid] = me.photoURL || ''; }
    else { delete r[me.uid]; delete n[me.uid]; delete p[me.uid]; }
    onStats({ ...stats, reactions: r, reactionNames: n, reactionPhotos: p });
    try {
      await setWallReaction(card.key, me, next);
      if (next && !mine) notifyWallReaction({ key: card.key, stats: before, ownerUid: card.ownerUid, me, emoji: next, what: card.what || 'your post on the Proof Wall', link: card.link || '/proof-wall' });
    } catch (e) {
      onStats(before);
      toast.error('Could not react.');
    }
  };

  const send = async () => {
    try {
      if (navigator.share) await navigator.share({ title: 'She Model Tech', text: card.headline || 'On She Model Tech', url: fullUrl });
      else { await navigator.clipboard.writeText(fullUrl); toast.success('Link copied. Paste it in a message.'); }
    } catch (_) { /* cancelled */ }
  };

  const doRepost = async () => {
    setBusy(true);
    try {
      await repostCard(card, me, repostText);
      setReposting(false);
      setRepostText('');
      onStats({ ...stats, repostCount: (stats.repostCount || 0) + 1 });
      toast.success('Reposted to the Proof Wall.');
      if (onReposted) onReposted();
    } catch (e) {
      toast.error('Could not repost.');
    }
    setBusy(false);
  };

  return (
    <div className="mt-2">
      {(reactions.length > 0 || stats.repostCount > 0) && (
        <div className="flex items-center justify-between text-xs text-gray-500 pb-1.5">
          {reactions.length > 0 ? (
            <span className="relative">
              <button type="button" onClick={() => setWhoOpen((o) => !o)} aria-expanded={whoOpen} aria-label="See who reacted"
                className="flex items-center gap-1.5 hover:underline">
                <span className="flex -space-x-1.5">
                  {Object.keys(stats.reactions || {}).slice(0, 3).map((u) => {
                    const photo = photoOf(u);
                    const name = stats.reactionNames?.[u] || '?';
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
                <ReactionsModal reactions={stats.reactions} names={stats.reactionNames}
                  photos={Object.fromEntries(Object.keys(stats.reactions || {}).map((u) => [u, photoOf(u)]))}
                  onClose={() => setWhoOpen(false)} />
              )}
            </span>
          ) : <span />}
          {stats.repostCount > 0 && <span>{stats.repostCount} repost{stats.repostCount === 1 ? '' : 's'}</span>}
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
        <Btn onClick={() => (mine ? react(mine) : setPicker((x) => !x))} active={!!mine} label="React">
          <span aria-hidden="true">{mine || '👍'}</span>{mine ? REACTIONS.find(([e]) => e === mine)?.[1] : 'Like'}
        </Btn>
        <button type="button" onClick={() => setPicker((x) => !x)} aria-label="Choose a reaction" className="px-1 text-gray-400 hover:text-gray-700 text-xs">▾</button>
        <Btn onClick={() => setReposting((x) => !x)} label="Repost"><span aria-hidden="true">🔁</span>Repost</Btn>
        <Btn onClick={send} label="Send"><span aria-hidden="true">📤</span>Send</Btn>
      </div>
      {reposting && (
        <div className="mt-2 rounded-lg border border-gray-200 p-3">
          <textarea rows={2} maxLength={1000} value={repostText} onChange={(e) => setRepostText(e.target.value)}
            placeholder="Add your thoughts (optional)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setReposting(false)} className="text-xs font-semibold text-gray-600 px-3 py-1.5">Cancel</button>
            <button type="button" disabled={busy} onClick={doRepost} className="text-xs font-semibold bg-pink-600 text-white px-3 py-1.5 rounded-lg disabled:opacity-50">Repost</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WallActions;
