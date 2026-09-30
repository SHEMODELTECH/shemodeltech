// src/components/AgeCheck.jsx
// Members who joined before sign-up asked their age are asked once. Until they
// answer, they can't join paid projects (which need 18+); everything else works.
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const AgeCheck = () => {
  const { currentUser } = useAuth();
  const [show, setShow] = useState(false);
  const [age, setAge] = useState('');
  const [consent, setConsent] = useState(false);
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid)).then((s) => {
      const d = s.data() || {};
      if (d.onboardingComplete && !d.isCompany && !d.ageGroup && !['admin', 'editor'].includes(d.role)) setShow(true);
    }).catch(() => {});
  }, [currentUser]);
  if (!show) return null;

  const save = async () => {
    if (!age) return toast.error('Please choose your age group.');
    if (age === 'under13') {
      toast.error('She Model Tech is for people 13 and older. Please contact us to close your account.');
      await signOut(auth).catch(() => {});
      return;
    }
    if (age === '13-17' && !consent) return toast.error('Please confirm your parent or guardian knows and agrees.');
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), age === '13-17'
        ? { ageGroup: '13-17', isMinor: true, guardianConsent: true, guardianConsentAt: new Date() }
        : { ageGroup: '18plus' });
      setShow(false);
      toast.success('Thanks!');
    } catch (e) {
      toast.error('Could not save. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="age-h">
      <div className="w-full max-w-md bg-white rounded-2xl p-5">
        <h2 id="age-h" className="text-lg font-bold text-gray-900">One quick question</h2>
        <p className="text-sm text-gray-600 mt-1">How old are you? Free projects are open from 13; paid projects are for members 18 and older. You’ll need to answer to join projects.</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {[['18plus', '18 or older'], ['13-17', '13 to 17'], ['under13', 'Under 13']].map(([v, l]) => (
            <button key={v} type="button" aria-pressed={age === v} onClick={() => setAge(v)}
              className={`text-sm font-semibold px-4 py-2 rounded-full border ${age === v ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300 text-gray-700'}`}>{l}</button>
          ))}
        </div>
        {age === '13-17' && (
          <label className="flex items-start gap-2 mt-3 text-sm text-gray-800">
            <input type="checkbox" className="mt-1" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>My parent or guardian knows I’m on She Model Tech and agrees.</span>
          </label>
        )}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={save} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AgeCheck;
