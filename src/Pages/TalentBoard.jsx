// src/Pages/TalentBoard.jsx - Discover and recruit verified talent
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import AccessBanner from '../components/AccessBanner';

const badgeOptions = [
  { id: '', label: 'All Tracks' },
  { id: 'TechDev', label: 'Development' },
  { id: 'TechQA', label: 'Quality Assurance' },
  { id: 'TechPO', label: 'Product / Project Owner' },
  { id: 'TechArchs', label: 'Low/No-Code Developer' },
  { id: 'TechLeads', label: 'Non-Technical Roles' },
  { id: 'TechGuard', label: 'Cybersecurity' },
];

const TalentBoard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBadge, setFilterBadge] = useState('');
  const [viewerProfile, setViewerProfile] = useState(null);

  // Only needed to decide what the access banner should say.
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid))
      .then(snap => { if (snap.exists()) setViewerProfile(snap.data()); })
      .catch(() => {});
  }, [currentUser]);

  // The Talent Board is open to every signed-in member - no plan check.

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        // Fetch users; don't orderBy a field that some docs may lack (that silently drops them).
        const q = query(collection(db, 'users'), limit(500));
        const snap = await getDocs(q);
        const allUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Collect uids that have earned a badge from the member_badges collection too,
        // so anyone with a badge there is included even if their user doc wasn't denormalized.
        const badgedUids = new Set();
        try {
          const mbSnap = await getDocs(query(collection(db, 'member_badges'), limit(1000)));
          mbSnap.docs.forEach(d => {
            const uid = d.data().userId || d.data().uid || d.data().memberId;
            if (uid) badgedUids.add(uid);
          });
        } catch (e) { /* ignore */ }

        const users = allUsers
          .filter(u => {
            if (u.isCompany) return false;
            const thisUid = u.uid || u.id;
            if (thisUid === currentUser?.uid) return false;
            if (u.onboardingComplete === false) return false;
            const hasBadgeArray = Array.isArray(u.badges) && u.badges.length > 0;
            const hasTotal = (u.totalBadges || 0) > 0;
            const hasBadgeCounts = u.badgeCounts && Object.values(u.badgeCounts).some(n => (n || 0) > 0);
            const hasCertificates = Array.isArray(u.certificates) && u.certificates.length > 0;
            const inMemberBadges = badgedUids.has(thisUid);
            return hasBadgeArray || hasTotal || hasBadgeCounts || hasCertificates || inMemberBadges;
          })
          .sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));
        setTalents(users);
      } catch (e) {
        console.error('Error fetching talents:', e);
      }
      setLoading(false);
    };
    if (currentUser) fetchTalents();
    else setLoading(false);
  }, [currentUser]);

  const filtered = talents.filter(t => {
    const matchesSearch = !searchTerm || 
      (t.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.specialization || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBadge = !filterBadge || (t.badges || []).some(b => b.badgeName?.includes(filterBadge) || b.badgeCategory === filterBadge);
    return matchesSearch && matchesBadge;
  });

  return (
    
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Talent Board</h1>
        <p className="text-gray-500 text-sm mb-6">Discover and connect with verified women in tech.</p>

        {/* Where a company stands on access. Says up front that the free
            period is temporary, so charging later is expected rather than a
            surprise. Renders nothing for members. */}
        <AccessBanner company={viewerProfile} />

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name or skill..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none"
          />
          <select
            value={filterBadge}
            onChange={e => setFilterBadge(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:border-pink-500 focus:outline-none"
          >
            {badgeOptions.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No talent found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(talent => (
              <div
                key={talent.id}
                onClick={() => navigate(`/profile/${encodeURIComponent(talent.email)}`)}
                className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-pink-300 hover:shadow-sm transition-all cursor-pointer"
              >
                {talent.photoURL ? (
                  <img src={talent.photoURL} alt={talent.displayName} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-gray-100" />
                ) : (
                  <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-pink-600 flex items-center justify-center text-white font-bold text-lg">
                    {(talent.displayName || 'U')[0]}
                  </div>
                )}
                <p className="text-gray-900 text-sm font-semibold truncate">{talent.displayName || 'User'}</p>
                <p className="text-gray-400 text-xs mt-0.5 truncate">{talent.specialization || talent.primarySkillTrack || 'Tech Professional'}</p>
                {talent.primarySkillTrack && (
                  <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 bg-pink-50 text-pink-600 rounded-md">
                    {badgeOptions.find(b => b.id === talent.primarySkillTrack)?.label || talent.primarySkillTrack}
                  </span>
                )}
                {talent.badges && talent.badges.length > 0 && (
                  <p className="text-gray-400 text-xs mt-1">{talent.badges.length} badge{talent.badges.length !== 1 ? 's' : ''}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    
  );
};

export default TalentBoard;
