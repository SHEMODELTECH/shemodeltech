// src/Pages/user/UserProfile.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import TierBadge from '../../components/TierBadge';
import { collection, query, where, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import FollowButton from '../../components/community/FollowButton';

const badgeData = [
  { id: 'techmo', title: 'TechPO', image: '/Images/TechMO.png', label: 'Product / Project Owner' },
  { id: 'techqa', title: 'TechQA', image: '/Images/TechQA.png', label: 'Quality Assurance' },
  { id: 'techdev', title: 'TechDev', image: '/Images/TechDev.png', label: 'Development' },
  { id: 'techleads', title: 'TechLeads', image: '/Images/TechLeads.png', label: 'Non-Technical Roles' },
  { id: 'techarchs', title: 'TechArchs', image: '/Images/TechArchs.png', label: 'Low/No-Code Developer' },
  { id: 'techguard', title: 'TechGuard', image: '/Images/TechGuard.png', label: 'Cybersecurity' },
];

// Track aliases so we can count badges per track regardless of how category/id is stored.
const TRACK_ALIASES = {
  development: ['development', 'techdev', 'developer'],
  'quality-assurance': ['quality-assurance', 'techqa', 'quality', 'qa'],
  security: ['security', 'techguard', 'cybersecurity', 'network'],
  leadership: ['leadership', 'techleads', 'leader', 'non-technical'],
  design: ['design', 'techarchs', 'architecture', 'low-code', 'no-code'],
  mentorship: ['mentorship', 'techpo', 'techmo', 'product', 'project-owner'],
};

// Derive a badge's tier LIVE from how many badges the user holds in the same track
// (matches dashboard + certificate). This replaces the unreliable frozen badge.level.
const deriveBadgeLevel = (allBadges, badge) => {
  const fieldsOf = (b) => [b.category, b.id, b.title, b.badgeCategory].map(x => (x || '').toString().toLowerCase());
  const mine = fieldsOf(badge);
  let aliases = mine;
  for (const [, group] of Object.entries(TRACK_ALIASES)) {
    if (group.some(a => mine.some(f => f === a || f.includes(a)))) { aliases = group; break; }
  }
  const count = (allBadges || []).filter(b => {
    const f = fieldsOf(b);
    return aliases.some(a => f.some(fl => fl === a || fl.includes(a)));
  }).length;
  return count >= 11 ? 'Expert' : count >= 6 ? 'Advanced' : count >= 2 ? 'Associate' : 'Novice';
};

const UserProfile = () => {
  const { userEmail } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const userParam = userEmail ? decodeURIComponent(userEmail).trim() : '';

  const [profile, setProfile] = useState(null);
  // The VIEWER's own profile - needed for the messaging rules:
  // free company accounts can't message anyone, and free individual
  // accounts can't message company accounts.
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [photoLightbox, setPhotoLightbox] = useState(false); // full-size profile picture viewer
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!currentUser) { navigate('/login'); }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!userParam || !currentUser) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        let userData = null;

        const isOwnEmail = currentUser.email?.toLowerCase() === userParam.toLowerCase();
        const isOwnUid = currentUser.uid === userParam;

        if (isOwnEmail || isOwnUid) {
          const snap = await getDoc(doc(db, 'users', currentUser.uid));
          if (snap.exists()) userData = { uid: snap.id, ...snap.data() };
        }

        if (!userData) {
          const snap = await getDoc(doc(db, 'users', userParam));
          if (snap.exists()) userData = { uid: snap.id, ...snap.data() };
        }

        if (!userData) {
          const emailQ = query(collection(db, 'users'), where('email', '==', userParam.toLowerCase()), limit(1));
          const emailSnap = await getDocs(emailQ);
          if (!emailSnap.empty) {
            const d = emailSnap.docs[0];
            userData = { uid: d.id, ...d.data() };
          }
        }

        if (!userData) {
          const allQ = query(collection(db, 'users'), limit(50));
          const allSnap = await getDocs(allQ);
          const match = allSnap.docs.find(d => {
            const data = d.data();
            return data.email?.toLowerCase() === userParam.toLowerCase() || d.id === userParam;
          });
          if (match) userData = { uid: match.id, ...match.data() };
        }

        if (userData) {
          setProfile(userData);
          // Total projects DONE (paid or free). Auto-populates from the
          // projects collection: any project with status 'completed' where
          // this user was a team member (tracked by uid OR email in the
          // members array) or the owner. Deduped by project id.
          try {
            const done = new Set();
            const collect = (snap) => snap.docs.forEach(d => {
              const p = d.data();
              if (p.status === 'completed') done.add(d.id);
            });
            try {
              collect(await getDocs(query(collection(db, 'projects'), where('members', 'array-contains', userData.uid))));
            } catch (_) {}
            if (userData.email) {
              try {
                collect(await getDocs(query(collection(db, 'projects'), where('members', 'array-contains', userData.email))));
              } catch (_) {}
            }
            try {
              collect(await getDocs(query(collection(db, 'projects'), where('submitterId', '==', userData.uid))));
            } catch (_) {}
            setCompletedCount(done.size);
          } catch (e) {
            console.log('Could not fetch completed projects:', e.message);
          }
        } else {
          setNotFound(true);
        }
      } catch (e) {
        console.error('Error loading profile:', e);
        setNotFound(true);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userParam, currentUser]);

  const getInitials = (name, email) => {
    if (name) {
      const parts = name.trim().split(' ');
      return parts.length >= 2
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : name[0].toUpperCase();
    }
    return email?.[0]?.toUpperCase() || '?';
  };

  const formatDate = (ts) => {
    if (!ts) return null;
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-gray-400 font-bold">?</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">This member hasn't set up their profile yet.</p>
          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-200 transition-all">
              Go Back
            </button>
            <button onClick={() => navigate('/members-directory')} className="flex-1 bg-pink-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-pink-700 transition-all">
              Browse Members
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.uid === profile.uid || currentUser?.email?.toLowerCase() === profile.email?.toLowerCase();
  const displayName = profile.displayName || profile.email?.split('@')[0] || 'Member';
  const initials = getInitials(displayName, profile.email);
  const userBadges = profile.badges || [];
  const skillTrackLabels = {
    'TechDev': 'Development', 'TechQA': 'Quality Assurance', 'TechPO': 'Product / Project Owner', 'TechMO': 'Product / Project Owner',
    'TechArchs': 'Architecture', 'TechLeads': 'Leadership', 'TechGuard': 'Cybersecurity'
  };

  return (
    <div className="min-h-screen bg-white pb-12">
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="h-20 bg-gradient-to-r from-pink-50 to-pink-100" />

          <div className="px-6 pb-6">
            {/* Avatar + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 mb-4">
              <div>
                {profile.photoURL ? (
                  <button
                    type="button"
                    onClick={() => setPhotoLightbox(true)}
                    className="rounded-full cursor-zoom-in hover:ring-2 hover:ring-pink-300 transition-all"
                    aria-label={`View ${displayName}'s profile picture`}
                  >
                    <img src={profile.photoURL} alt={displayName} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm" />
                  </button>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-pink-600 flex items-center justify-center border-4 border-white shadow-sm">
                    <span className="text-2xl text-white font-bold">{initials}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isOwnProfile && (
                  <button onClick={() => navigate('/settings')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all">
                    Edit Profile
                  </button>
                )}
                {!isOwnProfile && (
                  <>
                    <FollowButton targetUser={profile} currentUser={currentUser} size="sm" />
                    <button
                      onClick={() => navigate(`/messages?to=${profile.uid}`)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Message
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Name */}
            <h1 className="text-2xl font-bold text-gray-900 mb-0.5 flex items-center gap-2 flex-wrap">
              {displayName}
              {profile.isCompany && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  Company / Organisation
                </span>
              )}
            </h1>
            {profile.isCompany && profile.companyProfile?.companyName && (
              <p className="text-gray-700 text-sm font-semibold">{profile.companyProfile.companyName}</p>
            )}
            {profile.specialization && (
              <p className="text-gray-600 text-sm">{profile.specialization}</p>
            )}
            {profile.createdAt && (
              <p className="text-gray-400 text-xs mt-1">Member since {formatDate(profile.createdAt)}</p>
            )}

            {/* Stats Row - Badges, Certificates, and total Projects done.
                Projects auto-populates after every successful completion,
                paid or free. (The skill track still shows in Details below.) */}
            <div className="flex flex-wrap gap-3 mt-5">
              {!profile.isCompany && (
                <>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
                    <p className="text-xl font-bold text-gray-900">{userBadges.length}</p>
                    <p className="text-gray-500 text-xs">Badges</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
                    <p className="text-xl font-bold text-gray-900">{completedCount}</p>
                    <p className="text-gray-500 text-xs">Certificates</p>
                  </div>
                  <div className="bg-pink-50 border border-pink-200 rounded-lg px-4 py-3 text-center">
                    <p className="text-xl font-bold text-pink-700">{completedCount}</p>
                    <p className="text-pink-500 text-xs">Projects Done</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Badges Section */}
        {!profile.isCompany && userBadges.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Badges Earned</h3>
            <p className="text-gray-400 text-xs mb-4">Each badge shows the level reached and the contribution rating given by the project owner - verified proof of real collaborative work.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {userBadges.map((badge, i) => {
                const bd = badgeData.find(b => b.id === badge.id || b.title === badge.title || b.id === badge.id?.toLowerCase());
                const contribStyle = {
                  excellent: 'bg-green-100 text-green-700',
                  good: 'bg-pink-100 text-pink-700',
                  fair: 'bg-amber-100 text-amber-700',
                }[badge.contribution] || 'bg-gray-100 text-gray-600';
                // Tier is derived from how many badges this user has in this track
                // (live), so it matches the dashboard/certificate - not the frozen level.
                const trackLevel = deriveBadgeLevel(userBadges, badge);
                return (
                  <div key={i} className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex justify-center mb-1">
                      <TierBadge image={bd?.image || '/Images/TechDev.png'} alt={badge.title || badge.id} level={trackLevel} size={40} showLabel={false} />
                    </div>
                    <p className="text-xs text-gray-900 font-medium">{bd?.label || badge.title || badge.id}</p>
                    <p className="text-xs text-gray-400">{trackLevel}</p>
                    {badge.contribution && (
                      <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${contribStyle}`}>
                        {badge.contribution}
                      </span>
                    )}
                    {badge.projectTitle && (
                      <p className="text-[10px] text-gray-400 mt-1 truncate" title={badge.projectTitle}>{badge.projectTitle}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Details Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.experienceLevel && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Experience Level</p>
                <p className="text-gray-900 font-medium text-sm capitalize">{profile.experienceLevel}</p>
              </div>
            )}
            {profile.primarySkillTrack && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Skill Track</p>
                <p className="text-gray-900 font-medium text-sm">{skillTrackLabels[profile.primarySkillTrack] || profile.primarySkillTrack}</p>
              </div>
            )}
            {(profile.country || profile.city || profile.state) && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Location</p>
                <p className="text-gray-900 font-medium text-sm">{[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}</p>
              </div>
            )}
            {profile.linkedinUrl && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">LinkedIn</p>
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 text-sm font-medium hover:underline truncate block">{profile.linkedinUrl}</a>
              </div>
            )}
            {profile.githubUrl && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">GitHub</p>
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 text-sm font-medium hover:underline truncate block">{profile.githubUrl}</a>
              </div>
            )}
            {profile.portfolioUrl && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Portfolio</p>
                <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 text-sm font-medium hover:underline truncate block">{profile.portfolioUrl}</a>
              </div>
            )}
            {profile.emailPublic && profile.email && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Email</p>
                <p className="text-gray-900 font-medium text-sm">{profile.email}</p>
              </div>
            )}
            {profile.isCompany && profile.companyProfile?.companyName && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 sm:col-span-2">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Company</p>
                <p className="text-gray-900 font-medium text-sm">{profile.companyProfile.companyName}</p>
                {profile.companyProfile.companyLocation && (
                  <p className="text-gray-400 text-xs mt-0.5">{profile.companyProfile.companyLocation}</p>
                )}
              </div>
            )}
          </div>

          {/* Empty state */}
          {!profile.experienceLevel && !profile.primarySkillTrack && !profile.country && !profile.city && !profile.linkedinUrl && !profile.githubUrl && !profile.portfolioUrl && (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">
                {isOwnProfile
                  ? 'Your profile is empty. Add your details in Settings.'
                  : "This member hasn't filled in their profile yet."}
              </p>
              {isOwnProfile && (
                <button onClick={() => navigate('/settings')} className="mt-3 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-all">
                  Complete Your Profile
                </button>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Full-size profile picture viewer - tap the avatar to open, tap anywhere to close */}
      {photoLightbox && profile.photoURL && (
        <div onClick={() => setPhotoLightbox(false)} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out">
          <img
            src={profile.photoURL}
            alt={displayName}
            className="max-w-full max-h-full sm:max-w-md sm:max-h-[80vh] rounded-2xl object-contain shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
          <button onClick={() => setPhotoLightbox(false)} className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 rounded-full w-10 h-10 flex items-center justify-center" aria-label="Close">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
