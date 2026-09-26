// src/Pages/TalentBoard.jsx - Discover and recruit verified talent
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import MentorBadge from '../components/MentorBadge';
import { mentorStatsByUid } from '../utils/mentorStats';
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
  // Learner ratings and completions for mentors' published courses.
  const [mentorStats, setMentorStats] = useState({});
  useEffect(() => {
    mentorStatsByUid().then(setMentorStats).catch(() => setMentorStats({}));
  }, []);

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
            // Mentors are listed too, even before they earn a project badge.
            const isMentor = !!u.isTeacher || (u.mentorApprovedCourses || 0) > 0;
            return hasBadgeArray || hasTotal || hasBadgeCounts || hasCertificates || inMemberBadges || isMentor;
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

  const isMentor = (t) => !!t.isTeacher || (t.mentorApprovedCourses || 0) > 0;
  const statsOf = (t) => mentorStats[t.uid || t.id];
  // Mentors rank first: highest-rated (with at least one rating), then by
  // published courses; everyone else follows alphabetically.
  const rank = (t) => {
    if (!isMentor(t)) return 0;
    const st = statsOf(t);
    return 1 + (st?.ratingCount ? st.avg * 10 + Math.min(st.ratingCount, 50) / 10 : 0) + (t.mentorApprovedCourses || 0) / 100;
  };
  const filtered = talents
    .filter(t => {
      const matchesSearch = !searchTerm ||
        (t.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.specialization || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBadge =
        !filterBadge ||
        (filterBadge === 'mentors'
          ? isMentor(t)
          : (t.badges || []).some(b => b.badgeName?.includes(filterBadge) || b.badgeCategory === filterBadge));
      return matchesSearch && matchesBadge;
    })
    .sort((a, b) => rank(b) - rank(a) || (a.displayName || '').localeCompare(b.displayName || ''));
  const topMentors = talents
    .filter((t) => isMentor(t) && statsOf(t)?.ratingCount)
    .sort((a, b) => rank(b) - rank(a))
    .slice(0, 4);

  return (
    
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Talent Board</h1>
        <p className="text-gray-500 text-sm mb-6">Discover and connect with verified women in tech.</p>

        {/* Where a company stands on access. Says up front that the free
            period is temporary, so charging later is expected rather than a
            surprise. Renders nothing for members. */}
        <AccessBanner company={viewerProfile} />

        {/* Top-rated mentors: rated by learners on their courses in Learning */}
        {topMentors.length > 0 && !searchTerm && !filterBadge && (
          <div className="mb-6 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-pink-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">Top-rated mentors</p>
            <p className="text-sm text-gray-600 mb-3">Rated by learners on the courses they published in She Model Tech Learning.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {topMentors.map((t) => {
                const st = statsOf(t);
                return (
                  <button key={t.id} onClick={() => navigate(`/profile/${encodeURIComponent(t.email)}`)}
                    className="bg-white rounded-xl border border-indigo-100 p-3 text-left hover:border-indigo-300">
                    <p className="text-sm font-semibold text-gray-900 truncate">{t.displayName || 'Mentor'}</p>
                    <p className="text-xs text-amber-600 font-semibold mt-0.5">
                      ★ {st.avg.toFixed(1)} <span className="text-gray-500 font-normal">({st.ratingCount} rating{st.ratingCount === 1 ? '' : 's'})</span>
                    </p>
                    <p className="text-xs text-gray-500">{st.courses.length} course{st.courses.length === 1 ? '' : 's'} · {st.completions} completed</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

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
            <option value="mentors">Mentors</option>
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
                {isMentor(talent) && (
                  <div className="mt-2 flex flex-col items-center gap-1">
                    <MentorBadge count={talent.mentorApprovedCourses || 0} isMentor size="sm" />
                    {statsOf(talent)?.ratingCount > 0 && (
                      <p className="text-xs font-semibold text-amber-600">
                        ★ {statsOf(talent).avg.toFixed(1)} <span className="text-gray-400 font-normal">({statsOf(talent).ratingCount})</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    
  );
};

export default TalentBoard;
