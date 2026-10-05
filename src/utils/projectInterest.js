// src/utils/projectInterest.js
// "Notify me when roles open" on coming-soon projects (a lead is still setting
// them up). Staff see who's interested; members are told when roles open.
//   project_interest/{projectId}_{uid}: projectId, uid, name, createdAt (no contact details)
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const id = (projectId, uid) => `${projectId}_${uid}`;

export const isInterested = async (projectId, uid) => {
  const s = await getDoc(doc(db, 'project_interest', id(projectId, uid))).catch(() => null);
  return !!(s && s.exists());
};
export const addInterest = (projectId, user, name) =>
  setDoc(doc(db, 'project_interest', id(projectId, user.uid)), {
    projectId, uid: user.uid, name: name || user.displayName || 'A member', createdAt: serverTimestamp(),
  });
export const removeInterest = (projectId, uid) => deleteDoc(doc(db, 'project_interest', id(projectId, uid)));

export const listInterest = async (projectId) => {
  const s = await getDocs(query(collection(db, 'project_interest'), where('projectId', '==', projectId)));
  return s.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// When the lead opens the roles: tell everyone who asked, then clear the list.
export const notifyInterested = async (projectId, projectTitle) => {
  const people = await listInterest(projectId).catch(() => []);
  for (const p of people) {
    await addDoc(collection(db, 'notifications'), {
      userId: p.uid,
      type: 'roles_open',
      title: 'Roles are open',
      message: `"${projectTitle}" is open for applications. Apply for a role now.`,
      link: `/projects/${projectId}`,
      projectId,
      isRead: false,
      createdAt: serverTimestamp(),
    }).catch(() => {});
    await deleteDoc(doc(db, 'project_interest', p.id)).catch(() => {});
  }
  return people.length;
};
