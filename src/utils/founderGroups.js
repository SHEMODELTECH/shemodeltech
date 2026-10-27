// src/utils/founderGroups.js
// Founder team groups: one group per accepted founder (founder_groups/{founderUid}),
// for the team to talk together after the first one-to-one messages.
//   - The founder invites members with at least one badge; each invitee joins
//     or declines herself (nobody is added without agreeing). Up to 20 people.
//   - Chat: text (links allowed, with a "you're leaving" warning), emojis, up
//     to 3 images per message, edit and delete your own messages; the founder
//     can delete any message.
//   - The founder archives (read-only), reopens, or deletes the group.
//   - Members can report the group; staff can read it only after a report.
// The database rules enforce the same (firestore.rules: founder_groups).
import {
  addDoc, arrayRemove, arrayUnion, collection, deleteDoc, deleteField, doc, getDoc, getDocs,
  limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where, writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const MAX_GROUP = 20;
export const MAX_IMAGES = 3;
export const MAX_TEXT = 2000;

const gref = (gid) => doc(db, 'founder_groups', gid);

export const getGroup = async (gid) => {
  try {
    const s = await getDoc(gref(gid));
    return s.exists() ? { id: s.id, ...s.data() } : null;
  } catch (_) { return null; }
};

export const watchGroup = (gid, cb) => onSnapshot(gref(gid), (s) => cb(s.exists() ? { id: s.id, ...s.data() } : null), () => cb(null));

export const createGroup = (founderUid, founderName, ideaName) => setDoc(gref(founderUid), {
  founderUid,
  name: `${String(ideaName || 'My').slice(0, 70)} team`,
  members: [founderUid],
  memberNames: { [founderUid]: String(founderName || 'Founder').slice(0, 120) },
  invited: [],
  status: 'active',
  reported: false,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  lastMessageAt: serverTimestamp(),
});

// Groups she's in (profile and Founders page) and invites waiting for her.
export const groupsOf = async (uid) => {
  const s = await getDocs(query(collection(db, 'founder_groups'), where('members', 'array-contains', uid)));
  return s.docs.map((d) => ({ id: d.id, ...d.data() }));
};
export const invitesFor = async (uid) => {
  const s = await getDocs(query(collection(db, 'founder_groups'), where('invited', 'array-contains', uid)));
  return s.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const invite = async (group, uid, name, founderName) => {
  await updateDoc(gref(group.id), { invited: arrayUnion(uid), updatedAt: serverTimestamp() });
  // Bell notification (best effort).
  addDoc(collection(db, 'notifications'), {
    userId: uid, recipientId: uid, type: 'founder_invite', isRead: false, read: false, createdAt: serverTimestamp(),
    title: `${founderName} invited you to join ${group.name}`,
    message: `${founderName} invited you to join ${group.name}. Open Founders to join or decline.`,
    link: '/founders',
  }).catch(() => {});
};
export const cancelInvite = (gid, uid) => updateDoc(gref(gid), { invited: arrayRemove(uid), updatedAt: serverTimestamp() });
export const removeMember = (gid, uid) => updateDoc(gref(gid), { members: arrayRemove(uid), [`memberNames.${uid}`]: deleteField(), updatedAt: serverTimestamp() });
export const acceptInvite = (gid, uid, name) => updateDoc(gref(gid), {
  invited: arrayRemove(uid), members: arrayUnion(uid), [`memberNames.${uid}`]: String(name || 'Member').slice(0, 120), updatedAt: serverTimestamp(),
});
export const declineInvite = (gid, uid) => updateDoc(gref(gid), { invited: arrayRemove(uid), updatedAt: serverTimestamp() });
export const leaveGroup = (gid, uid) => updateDoc(gref(gid), { members: arrayRemove(uid), [`memberNames.${uid}`]: deleteField(), updatedAt: serverTimestamp() });
export const setGroupStatus = (gid, status) => updateDoc(gref(gid), { status, updatedAt: serverTimestamp() });
export const markReported = (gid) => updateDoc(gref(gid), { reported: true, reportedAt: serverTimestamp() });
export const closeReport = (gid) => updateDoc(gref(gid), { reported: false, reportedAt: deleteField() });

// Delete the chat first, then the group.
export const deleteGroup = async (gid) => {
  for (;;) {
    // eslint-disable-next-line no-await-in-loop
    const s = await getDocs(query(collection(db, 'founder_groups', gid, 'messages'), limit(400)));
    if (s.empty) break;
    const b = writeBatch(db);
    s.docs.forEach((d) => b.delete(d.ref));
    // eslint-disable-next-line no-await-in-loop
    await b.commit();
  }
  await deleteDoc(gref(gid));
};

// ---- Messages ----
export const watchMessages = (gid, cb) => onSnapshot(
  query(collection(db, 'founder_groups', gid, 'messages'), orderBy('createdAt', 'asc'), limit(300)),
  (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
  () => cb(null),
);
export const sendMessage = async (gid, me, text, images) => {
  await addDoc(collection(db, 'founder_groups', gid, 'messages'), {
    senderUid: me.uid, senderName: String(me.name || 'Member').slice(0, 120), text: String(text || '').slice(0, MAX_TEXT),
    images: (images || []).slice(0, MAX_IMAGES), createdAt: serverTimestamp(),
  });
  updateDoc(gref(gid), { lastMessageAt: serverTimestamp() }).catch(() => {});
};
export const editMessage = (gid, mid, text) => updateDoc(doc(db, 'founder_groups', gid, 'messages', mid), { text: String(text || '').slice(0, MAX_TEXT), editedAt: serverTimestamp() });
export const deleteMessage = (gid, mid) => deleteDoc(doc(db, 'founder_groups', gid, 'messages', mid));

// The people she has one-to-one conversations with: who the founder can invite.
export const conversationPartners = async (uid) => {
  const s = await getDocs(query(collection(db, 'conversations'), where('participants', 'array-contains', uid), limit(200)));
  const ids = new Set();
  s.docs.forEach((d) => (d.data().participants || []).forEach((p) => { if (p !== uid) ids.add(p); }));
  const out = await Promise.all([...ids].map(async (id) => {
    try {
      const u = await getDoc(doc(db, 'users', id));
      if (!u.exists()) return null;
      const d = u.data();
      return { uid: id, name: d.displayName || 'Member', photoURL: d.photoURL || null, hasBadge: !!(d.badges || []).length && !d.isCompany };
    } catch (_) { return null; }
  }));
  return out.filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
};
