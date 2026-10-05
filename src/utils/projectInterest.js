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

// ── Lead intent: someone tapped "Lead this project" but may not have submitted
//    the lead application. lead_intent/{projectId}_{uid}: projectId, uid, name, createdAt
export const recordLeadIntent = (projectId, user, name) =>
  setDoc(doc(db, 'lead_intent', `${projectId}_${user.uid}`), {
    projectId, uid: user.uid, name: name || user.displayName || 'A member', createdAt: serverTimestamp(),
  }).catch(() => {});

export const listLeadIntent = async (projectId) => {
  const s = await getDocs(query(collection(db, 'lead_intent'), where('projectId', '==', projectId)));
  return s.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Submitted: clear her "started" entries.
export const clearLeadIntent = async (uid) => {
  const s = await getDocs(query(collection(db, 'lead_intent'), where('uid', '==', uid))).catch(() => null);
  if (s) await Promise.all(s.docs.map((d) => deleteDoc(d.ref).catch(() => {})));
};

// Staff invite someone to apply to lead (a project, or any project that needs a lead).
export const inviteToLead = (uid, project = null) =>
  addDoc(collection(db, 'notifications'), {
    userId: uid,
    type: 'lead_invite',
    title: 'You’re invited to lead',
    message: project
      ? `She Model Tech invites you to apply to lead "${project.projectTitle || 'a project'}". It only takes a few minutes, and your application isn’t sent until you tap Submit.`
      : 'She Model Tech invites you to apply to lead a project. Pick a project that needs a lead and tap Submit to send your application.',
    link: project ? `/apply-to-lead?project=${project.id}` : '/apply-to-lead',
    ...(project ? { projectId: project.id } : {}),
    isRead: false,
    createdAt: serverTimestamp(),
  });
