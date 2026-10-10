// src/Pages/TalentBoard.jsx - Discover and recruit verified talent
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { doc, getDoc } from 'firebase/firestore';
import MentorBadge from '../components/MentorBadge';
import { isFeaturedTalent } from '../config/premium';
import { mentorStatsByUid } from '../utils/mentorStats';
import { db } from '../firebase/config';
import AccessBanner from '../components/AccessBanner';
import { BADGE_TRACKS, badgesInTrack, levelForCount } from '../config/badgeTracks';
import { loadMemberDirectory } from '../utils/memberIndex';
import TierBadge from '../components/TierBadge';
import { trackStandings } from '../components/BadgeShowcase';

const badgeOptions = [
  { id: '', label: 'All Tracks' },
  { id: 'TechDev', label: 'Development' },
  { id: 'TechQA', label: 'Quality Assurance' },
  { id: 'TechPO', label: 'Product / Project Owner' },
  { id: 'TechArchs', label: 'Low/No-Code Developer' },
  { id: 'TechLeads', label: 'Non-Technical Roles' },
  { id: 'TechGuard', label: 'Cybersecurity' },
];

// Mentor course numbers kept in memory for 5 minutes while the app is open.
const TALENT_CACHE = { mentor: null, mentorAt: 0 };

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
    if (TALENT_CACHE.mentor && Date.now() - TALENT_CACHE.mentorAt < 5 * 60 * 1000) {
      setMentorStats(TALENT_CACHE.mentor);
      return;
    }
    mentorStatsByUid()
      .then((m) => {
        TALENT_CACHE.mentor = m;
        TALENT_CACHE.mentorAt = Date.now();
        setMentorStats(m);
      })
      .catch(() => setMentorStats({}));
  }, []);

  // Only needed to decide what the access banner should say.
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid))
      .then(snap => { if (snap.exists()) setViewerProfile(snap.data()); })
      .catch(() => {});
  }, [currentUser]);

  // The Talent Board is open to every signed-in member - no plan check.

  // Every member (with or without a badge; not companies), from the member directory: a few
  // reads instead of one per member (src/utils/memberIndex.js).
  useEffect(() => {
    if (!currentUser) { setLoading(false); return undefined; }
    let alive = true;
    loadMemberDirectory()
      .then((entries) => {
        if (!alive) return;
        setTalents(entries
          .filter((e) => !e.isCompany && e.uid !== currentUser.uid)
          .map((e) => ({ ...e, id: e.uid }))
          .sort((a, b) => (a.displayName || '').localeCompare(b.displayName || '')));
      })
      .catch((e) => console.error('Error fetching talents:', e))
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [currentUser]);

  const isMentor = (t) => !!t.isTeacher || (t.mentorApprovedCourses || 0) > 0;
  const statsOf = (t) => mentorStats[t.uid || t.id];
  // Mentors rank first: highest-rated (with at least one rating), then by
  // published courses; everyone else follows alphabetically.
  // Mentors are featured first; everyone else is ranked on skills and badges.
  // Then members with badges, highest level first; then everyone else.
  const rank = (t) => {
    const featuredBoost = isFeaturedTalent(t) ? 1000 : 0;
    if (!isMentor(t)) {
      const top = trackStandings(t)[0];
      return featuredBoost + (top ? Math.min(top.count, 99) / 100 : 0);
    }
    const st = statsOf(t);
    return featuredBoost + 1 + (st?.ratingCount ? st.avg * 10 + Math.min(st.ratingCount, 50) / 10 : 0) + (t.mentorApprovedCourses || 0) / 100;
  };
  // Filtering and ranking run only when their inputs change, not on every render.
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return talents
    .filter(t => {
      const matchesSearch = !term ||
        (t.displayName || '').toLowerCase().includes(term) ||
        (t.specialization || '').toLowerCase().includes(term);
      const matchesBadge =
        !filterBadge ||
        (filterBadge === 'mentors'
          ? isMentor(t)
          // Profile badges store the track key in `category` (e.g. 'development')
          // and a label in `title`; older ones used badgeCategory/badgeName.
          : badgesInTrack(t, BADGE_TRACKS.find(x => x.name === filterBadge)?.key || filterBadge) > 0 ||
            (t.badges || []).some(b => String(b.title ?? b.badgeName ?? '').includes(filterBadge)));
      return matchesSearch && matchesBadge;
    })
    .sort((a, b) => rank(b) - rank(a) || (a.displayName || '').localeCompare(b.displayName || ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [talents, searchTerm, filterBadge, mentorStats]);
  const topMentors = useMemo(() => talents
    .filter((t) => isMentor(t) && statsOf(t)?.ratingCount)
    .sort((a, b) => rank(b) - rank(a))
    .slice(0, 4),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [talents, mentorStats]);
  // Render the grid a page at a time (the board can hold hundreds of people).
  const PAGE = 48;
  const [shown, setShown] = useState(PAGE);
  useEffect(() => setShown(PAGE), [searchTerm, filterBadge]);

  return (
    
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Talent Board</h1>
        <p className="text-gray-500 text-sm mb-6">Discover women in tech on She Model Tech. Badges show verified work.</p>

        {/* Where a company stands on access. Says up front that the free
            period is temporary, so charging later is expected rather than a
            surprise. Renders nothing for members. */}
        <AccessBanner company={viewerProfile} />

        {/* Top-rated mentors: rated by learners on their courses in Learning */}
        {topMentors.length > 0 && !searchTerm && !filterBadge && (
          <div className="mb-6 rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-50 to-pink-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-pink-700">Top-rated mentors</p>
            <p className="text-sm text-gray-600 mb-3">Rated by learners on the courses they published in She Model Tech Learning.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {topMentors.map((t) => {
                const st = statsOf(t);
                return (
                  <button key={t.id} onClick={() => navigate(`/profile/${encodeURIComponent(t.uid)}`)}
                    className="bg-white rounded-xl border border-pink-100 p-3 text-left hover:border-pink-300">
                    <p className="text-sm font-semibold text-gray-900 truncate">{t.displayName || 'Mentor'}</p>
                    <p className="text-xs text-pink-600 font-semibold mt-0.5">
                      ★ {st.avg.toFixed(1)} <span className="text-gray-500 font-normal">({st.ratingCount} rating{st.ratingCount === 1 ? '' : 's'})</span>
                    </p>
                    <p className="text-xs text-gray-500">{st.courses.length} course{st.courses.length === 1 ? '' : 's'} · {st.enrollments || 0} enrolled · {st.completions} completed</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search and Filter (once there's someone to find) */}
        {(loading || talents.length > 0) && (
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
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
          </div>
        ) : talents.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-gray-300 rounded-2xl">
            <p className="text-gray-900 font-semibold mb-1">The Talent Board is just getting started</p>
            <p className="text-gray-600 text-sm max-w-md mx-auto mb-5">
              Members appear here as they join. Badges, earned on real projects, show verified work.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link to="/projects" className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Find a project</Link>
              <Link to="/badges" className="text-sm font-semibold border border-gray-300 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg">How badges work</Link>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-700 text-sm mb-3">No one matches that search.</p>
            <button onClick={() => { setSearchTerm(''); setFilterBadge(''); }} className="text-sm font-semibold text-pink-700 hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.slice(0, shown).map((talent) => {
              const top = trackStandings(talent)[0];
              const lvl = top ? (levelForCount(top.count) || 'Novice') : null;
              const trackLabel = badgeOptions.find((x) => x.id === talent.primarySkillTrack)?.label || talent.primarySkillTrack;
              return (
                <button
                  type="button"
                  key={talent.id}
                  onClick={() => navigate(`/profile/${encodeURIComponent(talent.uid)}`)}
                  className="bg-gray-50 hover:bg-white border border-gray-100 hover:border-pink-200 hover:shadow-sm rounded-2xl p-4 text-center transition-all"
                >
                  {/* Photo, with her current badge pinned to it */}
                  <span className="relative block w-20 h-20 sm:w-24 sm:h-24 mx-auto">
                    {talent.photoURL ? (
                      <img src={talent.photoURL} alt="" loading="lazy" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="w-full h-full rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-2xl">
                        {(talent.displayName || 'U')[0]}
                      </span>
                    )}
                    {top && (
                      <span className="absolute -bottom-1 -right-1" title={`${top.name} ${lvl}`}>
                        <TierBadge image={top.img} alt={`${top.name} ${lvl}`} level={lvl} size={22} showLabel={false} />
                      </span>
                    )}
                  </span>
                  <span className="block mt-3 text-gray-900 text-sm sm:text-base font-bold truncate">{talent.displayName || 'Member'}</span>
                  <span className="block text-xs text-gray-600 truncate">
                    {top ? `${top.name} ${lvl}` : (trackLabel || 'Member')}
                  </span>
                  {isMentor(talent) && (
                    <span className="mt-2 flex flex-col items-center gap-1">
                      <MentorBadge count={talent.mentorApprovedCourses || 0} isMentor size="sm" />
                      {statsOf(talent)?.ratingCount > 0 && (
                        <span className="text-xs font-semibold text-pink-600">
                          ★ {statsOf(talent).avg.toFixed(1)} <span className="text-gray-400 font-normal">({statsOf(talent).ratingCount})</span>
                        </span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
        {!loading && filtered.length > shown && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShown((n) => n + PAGE)}
              className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Show more ({filtered.length - shown} more)
            </button>
          </div>
        )}
      </div>
    
  );
};

export default TalentBoard;
