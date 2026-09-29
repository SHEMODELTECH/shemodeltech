// src/utils/sponsors.js
// Companies that fund a cohort are thanked with their logo in "Thank you to our
// sponsors". Admins add them in Admin → Overview → Sponsors.
//   sponsors/{id}: name, url, logoUrl, until (Timestamp | null), createdAt
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const COL = 'sponsors';
const ms = (v) => (v?.toMillis ? v.toMillis() : v ? new Date(v).getTime() : null);

export const listSponsors = async () => {
  const s = await getDocs(query(collection(db, COL), orderBy('createdAt', 'desc')));
  return s.docs.map((d) => ({ id: d.id, ...d.data() }));
};
export const activeSponsors = (list) => list.filter((x) => !ms(x.until) || ms(x.until) > Date.now());

export const addSponsor = ({ name, url, logoUrl, until }) =>
  addDoc(collection(db, COL), {
    name: name.trim(),
    url: (url || '').trim() || null,
    logoUrl,
    until: until ? Timestamp.fromDate(new Date(`${until}T23:59:59`)) : null,
    createdAt: serverTimestamp(),
  });

export const removeSponsor = (id) => deleteDoc(doc(db, COL, id));
