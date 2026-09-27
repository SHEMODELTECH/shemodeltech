// src/Pages/projects/ProposeProjectPage.jsx
// Projects > Propose a project. Open to members with at least one earned badge.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import ProposeProject from '../../components/ProposeProject';

const ProposeProjectPage = () => {
  const { currentUser } = useAuth();
  const [allowed, setAllowed] = useState(null);
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      const u = (await getDoc(doc(db, 'users', currentUser.uid)).catch(() => null))?.data() || {};
      if (['admin', 'editor'].includes(u.role)) return setAllowed(true);
      if (u.isCompany) return setAllowed(false);
      const fromProfile = (Array.isArray(u.badges) && u.badges.length > 0) || (u.totalBadges || 0) > 0
        || Object.values(u.badgeCounts || {}).some((n) => Number(n) > 0);
      if (fromProfile) return setAllowed(true);
      const b = await getDocs(query(collection(db, 'member_badges'), where('memberUid', '==', currentUser.uid), limit(1))).catch(() => null);
      setAllowed(!!b && !b.empty);
    })();
  }, [currentUser]);

  if (allowed === null) return <p className="text-gray-500 text-sm">Loading...</p>;
  if (!allowed) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-gray-900">Propose a project</h1>
        <p className="text-gray-700 mt-2">
          This unlocks after you complete at least one project, as a lead or a collaborator, and earn your first badge.
        </p>
        <Link to="/projects" className="inline-block mt-4 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
          Find a project to join
        </Link>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Propose a project</h1>
      <ProposeProject startOpen />
    </div>
  );
};

export default ProposeProjectPage;
