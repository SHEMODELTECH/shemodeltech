// src/utils/wallStats.js
// Views, clicks, emoji reactions and reposts for everything on the Proof Wall:
// activity posts, open projects and Top Talent cards.
//
//   wall_stats/{key}   key = a_<activityId> | p_<projectId> | t_<memberUid>
//     views, clicks, repostCount           counters that move up by one
//     reactions {uid: emoji}, reactionNames, reactionPhotos   (not for updates:
//       updates keep their reactions on the activity post itself)
//     reactionNotified {uid: true}         the owner was told about this person's reaction
//
// A view is counted when a card is at least half on screen; a click when someone
// opens what the card points to. Each member counts once per card per day, so
// scrolling up and down or clicking twice doesn't inflate the numbers, and
// people don't count their own views or clicks.
import {
  collection, deleteField, doc, documentId, getDocs, increment, query, setDoc, updateDoc, where, addDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { notifyMember } from './staffAlerts';

const COL = 'wall_stats';
export const statKey = (kind, id) => (id ? `${kind}_${String(id).replace(/[^A-Za-z0-9_-]/g, '-')}` : null);

// Stats for many cards at once (one query per 30).
export const loadStats = async (keys) => {
  const ids = [...new Set((keys || []).filter(Boolean))];
  const out = {};
  for (let i = 0; i < ids.length; i += 30) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const snap = await getDocs(query(collection(db, COL), where(documentId(), 'in', ids.slice(i, i + 30))));
      snap.docs.forEach((d) => { out[d.id] = d.data(); });
    } catch (_) { /* leave these at zero */ }
  }
  return out;
};

// Once per member, per card, per day (kept in this browser).
const SEEN_KEY = 'smt-wall-counted-v1';
const today = () => new Date().toISOString().slice(0, 10);
const counted = (() => {
  let mem = null;
  const read = () => {
    if (mem) return mem;
    try { mem = JSON.parse(localStorage.getItem(SEEN_KEY) || '{}'); } catch (_) { mem = {}; }
    const d = today();
    Object.keys(mem).forEach((k) => { if (mem[k] !== d) delete mem[k]; }); // only today's
    return mem;
  };
  return {
    has: (k) => read()[k] === today(),
    add: (k) => {
      read()[k] = today();
      try { localStorage.setItem(SEEN_KEY, JSON.stringify(mem)); } catch (_) { /* private mode: count once per visit */ }
    },
  };
})();

const bump = (key, field, me, ownerUid) => {
  if (!key || !me?.uid || (ownerUid && ownerUid === me.uid)) return false;
  const mark = `${field}:${key}:${me.uid}`;
  if (counted.has(mark)) return false;
  counted.add(mark);
  setDoc(doc(db, COL, key), { [field]: increment(1) }, { merge: true }).catch(() => {});
  return true;
};
// Return true when it counted (so the screen can add one straight away).
export const recordView = (key, me, ownerUid) => bump(key, 'views', me, ownerUid);
export const recordClick = (key, me, ownerUid) => bump(key, 'clicks', me, ownerUid);

// Emoji reaction on a card (not an update). emoji null takes it off.
export const setWallReaction = (key, me, emoji) =>
  emoji
    ? setDoc(doc(db, COL, key), {
      reactions: { [me.uid]: emoji },
      reactionNames: { [me.uid]: me.name || 'A member' },
      reactionPhotos: { [me.uid]: me.photoURL || '' },
    }, { merge: true })
    : updateDoc(doc(db, COL, key), {
      [`reactions.${me.uid}`]: deleteField(),
      [`reactionNames.${me.uid}`]: deleteField(),
      [`reactionPhotos.${me.uid}`]: deleteField(),
    });

// Tell the owner (bell only), once per person per card.
const toldThisSession = new Set();
export const notifyWallReaction = ({ key, stats, ownerUid, me, emoji, what, link }) => {
  if (!ownerUid || ownerUid === me.uid || !emoji) return;
  if ((stats?.reactions || {})[me.uid] || (stats?.reactionNotified || {})[me.uid]) return;
  const mark = `${key}:${me.uid}`;
  if (toldThisSession.has(mark)) return;
  toldThisSession.add(mark);
  notifyMember(ownerUid, {
    type: 'proofwall_reaction',
    title: `${me.name || 'A member'} reacted ${emoji} to ${what}`,
    body: 'Open the Proof Wall to see it.',
    link,
    sendEmail: false,
    push: false,
  });
  setDoc(doc(db, COL, key), { reactionNotified: { [me.uid]: true } }, { merge: true }).catch(() => {});
};

// Repost a card as a new update that shows the card inside it.
//   card: { key, headline, text, link (a page on the site), actorId, actorName, projectTitle, kind }
export const repostCard = async (card, me, text) => {
  await addDoc(collection(db, 'activity'), {
    type: 'update',
    isDummy: false,
    actorId: me.uid,
    actorName: me.name || 'A member',
    text: (text || '').trim(),
    repostOf: {
      id: null,
      kind: card.kind || 'card',
      actorId: card.actorId || null,
      actorName: card.headline || card.actorName || 'She Model Tech',
      text: String(card.text || '').slice(0, 600),
      imageUrl: null,
      link: card.link || null,
      projectTitle: card.projectTitle || null,
    },
    createdAt: serverTimestamp(),
  });
  setDoc(doc(db, COL, card.key), { repostCount: increment(1) }, { merge: true }).catch(() => {});
};

// 1234 -> "1.2k"
export const compact = (n) => {
  const x = Number(n) || 0;
  if (x < 1000) return String(x);
  if (x < 1e6) return `${(x / 1000).toFixed(x < 10000 ? 1 : 0).replace(/\.0$/, '')}k`;
  return `${(x / 1e6).toFixed(1).replace(/\.0$/, '')}m`;
};
