// src/utils/updateSocial.js
// Reactions, comments, reposts, and sharing for members' updates on the Proof Wall.
//   activity/{id}: reactions {uid: emoji}, reactionNames {uid: name}, commentCount, repostCount
//   activity/{id}/comments/{cid}: uid, name, photoURL, text, createdAt
import { addDoc, collection, deleteDoc, deleteField, doc, getDocs, increment, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const REACTIONS = [
  ['👍', 'Like'], ['❤️', 'Love'], ['👏', 'Celebrate'], ['🙌', 'Support'], ['💡', 'Insightful'], ['😂', 'Funny'],
];

export const setReaction = (activityId, uid, name, emoji) =>
  updateDoc(doc(db, 'activity', activityId), emoji
    ? { [`reactions.${uid}`]: emoji, [`reactionNames.${uid}`]: name || 'A member' }
    : { [`reactions.${uid}`]: deleteField(), [`reactionNames.${uid}`]: deleteField() });

export const listComments = async (activityId) => {
  const s = await getDocs(query(collection(db, 'activity', activityId, 'comments'), orderBy('createdAt', 'asc')));
  return s.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addComment = async (activityId, me, text) => {
  const ref = await addDoc(collection(db, 'activity', activityId, 'comments'), {
    uid: me.uid, name: me.name || 'A member', photoURL: me.photoURL || null, text: text.trim(), createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'activity', activityId), { commentCount: increment(1) }).catch(() => {});
  return ref.id;
};

export const deleteComment = async (activityId, commentId) => {
  await deleteDoc(doc(db, 'activity', activityId, 'comments', commentId));
  await updateDoc(doc(db, 'activity', activityId), { commentCount: increment(-1) }).catch(() => {});
};

// Repost: a new update that shows the original inside it.
export const repostUpdate = async (original, me, text) => {
  const src = original.repostOf || original; // repost the original, not a repost
  await addDoc(collection(db, 'activity'), {
    type: 'update',
    isDummy: false,
    actorId: me.uid,
    actorName: me.name || 'A member',
    text: (text || '').trim(),
    repostOf: {
      id: src.id || original.id,
      actorId: src.actorId || null,
      actorName: src.actorName || 'A member',
      text: src.text || '',
      imageUrl: src.imageUrl || null,
      link: src.link || null,
      projectTitle: src.projectTitle || null,
    },
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'activity', src.id || original.id), { repostCount: increment(1) }).catch(() => {});
};

export const postUrl = (id) => `${window.location.origin}/proof-wall?post=${id}`;
