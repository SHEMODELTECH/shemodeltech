// src/utils/feedback.js
// Short feedback after a project: project_feedback/{projectId}_{uid}
//   rating (1-5), recommend ('yes' | 'maybe' | 'no'), comment, projectTitle, name, createdAt
import { collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const myFeedback = async (projectId, uid) => {
  const s = await getDoc(doc(db, 'project_feedback', `${projectId}_${uid}`)).catch(() => null);
  return s && s.exists() ? s.data() : null;
};
export const saveFeedback = (projectId, user, data) =>
  setDoc(doc(db, 'project_feedback', `${projectId}_${user.uid}`), {
    projectId, uid: user.uid, ...data, createdAt: serverTimestamp(),
  });
export const listFeedback = async (max = 200) => {
  const s = await getDocs(query(collection(db, 'project_feedback'), orderBy('createdAt', 'desc'), limit(max)));
  return s.docs.map((d) => ({ id: d.id, ...d.data() }));
};
