// src/hooks/usePosterName.js - Returns correct poster name based on profile type
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Hook that fetches user profile and returns the appropriate poster name.
 * - Company accounts → company name
 * - Individual accounts → displayName (first + last)
 * 
 * @param {object} currentUser - Firebase auth user
 * @returns {{ posterName: string, isCompany: boolean, loading: boolean }}
 */
const usePosterName = (currentUser) => {
  const [posterName, setPosterName] = useState('');
  const [isCompany, setIsCompany] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.isCompany && data.companyProfile?.companyName) {
            setPosterName(data.companyProfile.companyName);
            setIsCompany(true);
          } else {
            setPosterName(data.displayName || currentUser.displayName || currentUser.email?.split('@')[0] || 'User');
            setIsCompany(false);
          }
        } else {
          setPosterName(currentUser.displayName || currentUser.email?.split('@')[0] || 'User');
          setIsCompany(false);
        }
      } catch (e) {
        console.error('Error fetching poster name:', e);
        setPosterName(currentUser.displayName || 'User');
        setIsCompany(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  return { posterName, isCompany, loading };
};

export default usePosterName;
