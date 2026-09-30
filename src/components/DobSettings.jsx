// src/components/DobSettings.jsx
// Settings → Account: a member can add or correct her date of birth. Age is
// worked out from it, so paid projects (18+) open automatically at 18.
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { ageFrom, dobFields } from '../utils/age';

const DobSettings = () => {
  const { currentUser } = useAuth();
  const [me, setMe] = useState(null);
  const [dob, setDob] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid)).then((s) => { const d = s.data() || {}; setMe(d); setDob(d.dateOfBirth || ''); }).catch(() => {});
  }, [currentUser]);
  if (!me || me.isCompany) return null;

  const save = async () => {
    const a = ageFrom(dob);
    if (a === null) return toast.error('Enter your date of birth.');
    if (a < 13) return toast.error('She Model Tech is for people 13 and older.');
    setBusy(true);
    try {
      const data = { ...dobFields(dob) };
      // Turned 18 (or corrected to 18+) and not marked under 18: open paid projects.
      if (!me.isMinor && a >= 18) data.ageGroup = '18plus';
      await updateDoc(doc(db, 'users', currentUser.uid), data);
      setMe((m) => ({ ...m, ...data }));
      toast.success('Date of birth saved.');
    } catch (e) {
      toast.error(me.isMinor ? 'Members under 18 can only correct their date of birth with She Model Tech’s help. Contact us through Support.' : 'Could not save. Please try again.');
    }
    setBusy(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-gray-900 font-bold text-base mb-1">Date of birth</h3>
      <p className="text-gray-500 text-sm mb-3">Used only to check age: free projects are open from 13, paid projects from 18. It isn’t shown on your profile.</p>
      <div className="flex flex-wrap items-end gap-3">
        <input type="date" aria-label="Date of birth" max={new Date().toISOString().slice(0, 10)} value={dob} onChange={(e) => setDob(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-56" />
        <button onClick={save} disabled={busy} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">{busy ? 'Saving…' : 'Save'}</button>
      </div>
    </div>
  );
};

export default DobSettings;
