// src/Pages/user/UserProfile.jsx
// A member's profile, laid out as a portfolio: who she is (photo, headline,
// About, links), then the proof - finished projects, badges, courses
// completed (with certificates), mentoring - then skills and education.

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { BadgeTile, trackStandings } from '../../components/BadgeShowcase';
import { levelForCount } from '../../config/badgeTracks';
import { badgeLinkedInUrl } from '../../utils/badgeLinkedIn';
import CollapseToggle, { useCollapsed } from '../../components/CollapseToggle';
import { collection, query, where, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import FollowButton from '../../components/community/FollowButton';
import MentorBadge from '../../components/MentorBadge';
import { listMentorCertificates } from '../../utils/learningCertificates';
import { mentorStatsByUid } from '../../utils/mentorStats';
import PremiumBadge from '../../components/PremiumBadge';
import { isPremium, isVerifiedPartner } from '../../config/premium';
import PresenceBadge from '../../components/PresenceBadge';
import { founderOf } from '../../utils/founders';


// Only open web links (http/https) that members typed into their profile.
const safeUrl = (u) => {
  const v = String(u || '').trim();
  if (!v) return null;
  const withScheme = /^https?:\/\//i.test(v) ? v : /^[a-z][a-z0-9+.-]*:/i.test(v) ? null : `https://${v}`;
  try {
    const url = new URL(withScheme);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch (_) {
    return null;
  }
};

const EDUCATION_LABEL = { high_school: 'High school', undergrad: 'Undergraduate', masters: 'Master\u2019s', phd: 'PhD' };

const toMs = (v) => (v?.toMillis ? v.toMillis() : v?.seconds ? v.seconds * 1000 : v ? new Date(v).getTime() || 0 : 0);

const Card = ({ title, children, action, folded = false, id }) => (
  <section id={id} className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 mb-6 print:break-inside-avoid scroll-mt-24">
    <div className={`flex items-center justify-between gap-3 ${folded ? 'print:mb-4' : 'mb-4'}`}>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

// Her latest Proof Wall updates (only her own posts, newest first). Reads a
// handful of her activity items; no special index needed.
const fmtDay = (ts) => {
  const d = ts?.toDate ? ts.toDate() : null;
  return d ? d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '';
};
const RecentUpdates = ({ uid, viewerUid }) => {
  const [items, setItems] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [folded, toggle] = useCollapsed('profile-updates', viewerUid);
  useEffect(() => {
    if (!uid) return;
    let alive = true;
    getDocs(query(collection(db, 'activity'), where('actorId', '==', uid), limit(40)))
      .then((s) => {
        if (!alive) return;
        const rows = s.docs.map((d) => ({ id: d.id, ...d.data() }))
          .filter((a) => a.type === 'update' && (a.text || a.imageUrl))
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setItems(rows);
      })
      .catch(() => alive && setItems([]));
    return () => { alive = false; };
  }, [uid]);
  if (!items || items.length === 0) return null;
  const shown = showAll ? items.slice(0, 10) : items.slice(0, 3);
  return (
    <Card
      title="Recent updates"
      folded={folded}
      action={(
        <span className="flex items-center gap-3 print:hidden">
          {folded && <span className="text-sm text-gray-500">{items.length}</span>}
          <CollapseToggle collapsed={folded} onToggle={toggle} controls="profile-updates-list" />
        </span>
      )}
    >
      <div id="profile-updates-list" className={folded ? 'hidden print:block' : ''}>
        <ul className="divide-y divide-gray-100">
          {shown.map((a) => (
            <li key={a.id} className="py-3 flex gap-3">
              {a.imageUrl && <img src={a.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200 flex-shrink-0" />}
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">{[a.projectTitle, fmtDay(a.createdAt)].filter(Boolean).join(' · ')}</p>
                {a.text && <p className="text-sm text-gray-800 mt-0.5 line-clamp-3 whitespace-pre-line">{a.text}</p>}
                <Link to={`/proof-wall?post=${a.id}`} className="inline-block mt-1 text-xs font-semibold text-pink-700 hover:underline print:hidden">View on the Proof Wall</Link>
              </div>
            </li>
          ))}
        </ul>
        {items.length > 3 && (
          <button type="button" onClick={() => setShowAll((v) => !v)} className="mt-2 text-sm font-semibold text-pink-700 hover:underline print:hidden">
            {showAll ? 'Show fewer' : `Show more (${Math.min(items.length, 10) - 3})`}
          </button>
        )}
      </div>
    </Card>
  );
};

const UserProfile = () => {
  const { userEmail } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // The router has already decoded the address; decode again only if that's
  // safe (a stray % would otherwise crash the page).
  const userParam = (() => {
    if (!userEmail) return '';
    try { return decodeURIComponent(userEmail).trim(); } catch (_) { return String(userEmail).trim(); }
  })();

  const [profile, setProfile] = useState(null);
  const [mentorCerts, setMentorCerts] = useState([]);
  const [mentorStats, setMentorStats] = useState(null);
  // Accepted founder (Founders page): a Founder label by her name.
  const [founder, setFounder] = useState(null);
  useEffect(() => {
    let alive = true;
    setFounder(null);
    if (profile?.uid && currentUser) founderOf(profile.uid).then((f) => { if (alive) setFounder(f); });
    return () => { alive = false; };
  }, [profile?.uid, currentUser]);
  // Staff can view profiles of learners under 18; other members can't.
  const [viewerStaff, setViewerStaff] = useState(false);
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid)).then((s) => setViewerStaff(['admin', 'editor'].includes(s.data()?.role))).catch(() => {});
  }, [currentUser?.uid]); // eslint-disable-line react-hooks/exhaustive-deps
  // The VIEWER's own profile - needed for the messaging rules:
  // free company accounts can't message anyone, and free individual
  // accounts can't message company accounts.
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [photoLightbox, setPhotoLightbox] = useState(false); // full-size profile picture viewer
  // Finished projects (as lead or team member) and course certificates.
  const [doneProjects, setDoneProjects] = useState([]);
  const completedCount = doneProjects.length;
  const [courseCerts, setCourseCerts] = useState([]);
  // Long sections can be folded (remembered on this device; printing shows everything).
  const [mentorFolded, toggleMentor] = useCollapsed('profile-mentor', currentUser?.uid);
  const [coursesFolded, toggleCourses] = useCollapsed('profile-courses', currentUser?.uid);

  useEffect(() => {
    if (!currentUser) { navigate('/login'); }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!userParam || !currentUser) return;
    let active = true;

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

        // Emails saved with capitals: try the exact text too (was a scan of 50 users).
        if (!userData && userParam !== userParam.toLowerCase()) {
          const exactSnap = await getDocs(query(collection(db, 'users'), where('email', '==', userParam), limit(1)));
          if (!exactSnap.empty) {
            const d = exactSnap.docs[0];
            userData = { uid: d.id, ...d.data() };
          }
        }

        if (!active) return;
        if (userData) {
          setProfile(userData);
          if (userData?.uid) {
            // Course certificates (public, like the certificate pages themselves).
            getDocs(query(collection(db, 'learning_certificates'), where('uid', '==', userData.uid)))
              .then((snap) => {
                if (!active) return;
                const list = snap.docs
                  .map((d) => ({ id: d.id, ...d.data() }))
                  .filter((c) => c.type !== 'mentor')
                  .sort((a, b) => String(b.completedOn || '').localeCompare(String(a.completedOn || '')));
                setCourseCerts(list);
              })
              .catch(() => { if (active) setCourseCerts([]); });
            listMentorCertificates(userData.uid)
              .then((certs) => {
                if (!active) return;
                setMentorCerts(certs);
                // Course stats are only shown for mentors with published courses;
                // they cost several reads per published course, so skip otherwise.
                if (certs.length > 0) {
                  mentorStatsByUid().then((all) => { if (active) setMentorStats(all[userData.uid] || null); }).catch(() => {});
                } else {
                  setMentorStats(null);
                }
              })
              .catch(() => { if (active) setMentorCerts([]); });
          }
          // Total projects DONE (paid or free). Auto-populates from the
          // projects collection: any project with status 'completed' where
          // this user was a team member (tracked by uid OR email in the
          // members array) or the owner. Deduped by project id.
          try {
            const done = new Map();
            const collect = (snap) => snap.docs.forEach(d => {
              const p = d.data();
              if (p.status === 'completed' && !done.has(d.id)) {
                done.set(d.id, {
                  id: d.id,
                  title: p.projectTitle || p.title || 'Project',
                  lead: p.submitterId === userData.uid,
                  paid: !!p.isPaid,
                  at: toMs(p.completedAt || p.updatedAt || p.createdAt),
                });
              }
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
            if (active) setDoneProjects([...done.values()].sort((a, b) => b.at - a.at));
          } catch (e) {
            console.log('Could not fetch completed projects:', e.message);
          }
        } else {
          setNotFound(true);
        }
      } catch (e) {
        console.error('Error loading profile:', e);
        if (active) setNotFound(true);
      }
      if (active) setLoading(false);
    };

    fetchProfile();
    return () => { active = false; };
  }, [userParam, currentUser?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  const getInitials = (name, email) => {
    if (name) {
      const parts = name.trim().split(' ').filter(Boolean);
      return parts.length >= 2
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : name[0].toUpperCase();
    }
    return email?.[0]?.toUpperCase() || '?';
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
            <button onClick={() => navigate('/proof-wall')} className="flex-1 bg-pink-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-pink-700 transition-all">
              Go to the Proof Wall
            </button>
          </div>
        </div>
      </div>
    );
  }

  const topBadge = trackStandings(profile)[0] || null;
  const isOwnProfile = currentUser?.uid === profile.uid || currentUser?.email?.toLowerCase() === profile.email?.toLowerCase();
  if (profile.isMinor && !isOwnProfile && !viewerStaff) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900">This profile is private</h1>
        <p className="text-gray-600 mt-2">Profiles of learners under 18 aren’t shown publicly.</p>
      </div>
    );
  }
  const displayName = profile.displayName || profile.email?.split('@')[0] || 'Member';
  const initials = getInitials(displayName, profile.email);
  const skillTrackLabels = {
    'TechDev': 'Development', 'TechQA': 'Quality Assurance', 'TechPO': 'Product / Project Owner', 'TechMO': 'Product / Project Owner',
    'TechArchs': 'Architecture', 'TechLeads': 'Leadership', 'TechGuard': 'Cybersecurity'
  };

  const memberSinceMs = toMs(profile.createdAt);
  const memberSince = memberSinceMs ? new Date(memberSinceMs).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : null;
  const headline = profile.isCompany ? null : [
    skillTrackLabels[profile.primarySkillTrack] || profile.primarySkillTrack,
    profile.experienceLevel && profile.experienceLevel[0].toUpperCase() + profile.experienceLevel.slice(1),
    [profile.city, profile.country].filter(Boolean).join(', '),
  ].filter(Boolean).join(' · ');
  const links = [
    ['LinkedIn', safeUrl(profile.linkedinUrl)],
    ['GitHub', safeUrl(profile.githubUrl)],
    ['Portfolio', safeUrl(profile.portfolioUrl)],
  ].filter(([, href]) => href).map(([label, href]) => ({ label, href }));
  const skillList = [...new Set(
    (profile.skillsText ? profile.skillsText.split(',') : Array.isArray(profile.skills) ? profile.skills : [])
      .map((x) => String(x).trim())
      .filter(Boolean)
  )].slice(0, 20);
  const education = [EDUCATION_LABEL[profile.highestEducation], profile.specialization].filter(Boolean).join(', ');

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

        {/* Profile header: who she is, her numbers, and her current badge. */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex-shrink-0">
                {profile.photoURL ? (
                  <button
                    type="button"
                    onClick={() => setPhotoLightbox(true)}
                    className="rounded-full cursor-zoom-in hover:ring-2 hover:ring-pink-300 transition-all"
                    aria-label={`View ${displayName}'s profile picture`}
                  >
                    <img src={profile.photoURL} alt={displayName} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-gray-200" />
                  </button>
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-pink-600 flex items-center justify-center">
                    <span className="text-2xl text-white font-bold">{initials}</span>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-0.5 flex items-center gap-2 flex-wrap">
                  {displayName}
                  <MentorBadge count={profile.mentorApprovedCourses || 0} isMentor={!!profile.isTeacher} showCount />
                  {founder && (
                    <Link to={`/founders#${founder.uid}`} title={`Founder of ${founder.ideaName}`} className="inline-flex items-center text-xs font-bold uppercase tracking-wide bg-gray-900 text-white px-2.5 py-0.5 rounded-full hover:bg-black">Founder</Link>
                  )}
                  {/* Companies show a badge only with Premium: the gold Verified Partner badge. */}
                  {isVerifiedPartner(profile) && <PremiumBadge kind="partner" size="md" />}
                  {profile.isCompany && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 bg-pink-100 text-pink-700 rounded-full">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      Company / Organisation
                    </span>
                  )}
                </h1>
                {/* Active now / Last active … (nothing if they've turned it off) */}
                {profile.uid && <PresenceBadge uid={profile.uid} className="mb-1" />}
                {profile.isCompany && profile.companyProfile?.companyName && (
                  <p className="text-gray-700 text-sm font-semibold">{profile.companyProfile.companyName}</p>
                )}
                {headline && <p className="text-gray-700 text-sm mt-0.5">{headline}</p>}
              </div>
            </div>

            {/* Her numbers, then her current badge (like a trophy card). */}
            {!profile.isCompany && (
              <div className="flex items-center gap-8 sm:gap-10">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 leading-tight">Completed<br />projects</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{completedCount}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { try { document.getElementById('courses-completed')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (_) { /* ignore */ } }}
                  className="text-left group"
                >
                  <span className="block text-xs sm:text-sm text-gray-500 leading-tight">Certificates<br />awarded</span>
                  <span className="flex items-center gap-1 text-2xl font-bold text-gray-900 mt-1">
                    {courseCerts.length}
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-pink-600 print:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </button>
              </div>
            )}
            {!profile.isCompany && (
              <div className="flex flex-col items-center gap-1.5 w-full sm:w-auto">
                <BadgeTile profile={profile} />
                {isOwnProfile && topBadge && (
                  <a
                    href={badgeLinkedInUrl(topBadge.name, levelForCount(topBadge.count) || 'Novice')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#0A66C2] hover:underline print:hidden"
                  >
                    Add to LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>

          {profile.bio && (
            <p className="text-gray-800 text-[15px] leading-relaxed mt-5 max-w-2xl whitespace-pre-line">{profile.bio}</p>
          )}

          {/* Links */}
          {links.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-pink-700 border border-pink-200 hover:bg-pink-50 px-3 py-1.5 rounded-lg"
                >
                  {l.label}
                </a>
              ))}
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <p className="text-gray-400 text-xs">{memberSince ? `Member since ${memberSince}` : ''}</p>
            <div className="flex items-center gap-2 print:hidden">
              <button onClick={() => window.print()} className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-all">
                Print
              </button>
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
        </div>

        {/* Projects she finished: the strongest proof, so it comes first. */}
        {!profile.isCompany && (doneProjects.length > 0 || isOwnProfile) && (
          <Card title="Projects">
            {doneProjects.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {doneProjects.map((p) => (
                  <li key={p.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={`/projects/${p.id}`} className="text-sm font-semibold text-gray-900 hover:text-pink-700 hover:underline">{p.title}</Link>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {[p.lead ? 'Project lead' : 'Team member', p.paid ? 'Paid project' : null, p.at ? new Date(p.at).getFullYear() : null].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <span className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700">Completed</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm text-gray-600">Projects you finish show here, with your role.</p>
                <Link to="/projects" className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-center print:hidden">Find a project</Link>
              </div>
            )}
          </Card>
        )}

        {/* Mentor: badge, published courses, and certificates (public; prints too) */}
        {(profile.isTeacher || (profile.mentorApprovedCourses || 0) > 0 || mentorCerts.length > 0) && (
          <div className="bg-white rounded-xl border border-pink-200 p-6 mb-6 print:break-inside-avoid">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-700" aria-hidden="true">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">She Model Tech Mentor</h2>
                  <p className="text-gray-500 text-xs">
                    {mentorCerts.length
                      ? `${mentorCerts.length} course${mentorCerts.length === 1 ? '' : 's'} published in She Model Tech Learning${
                          mentorStats ? ` · ${mentorStats.enrollments || 0} learners enrolled · ${mentorStats.completions} completion${mentorStats.completions === 1 ? '' : 's'}${mentorStats.ratingCount ? ` · ★ ${mentorStats.avg.toFixed(1)} average rating` : ''}` : ''
                        }`
                      : 'Approved mentor at SHE MODEL TECH Inc., a registered 501(c)(3) nonprofit'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MentorBadge count={mentorCerts.length || profile.mentorApprovedCourses || 0} isMentor />
                {mentorCerts.length > 0 && (
                  <span className="print:hidden"><CollapseToggle collapsed={mentorFolded} onToggle={toggleMentor} controls="profile-mentor-courses" /></span>
                )}
              </div>
            </div>
            {mentorCerts.length > 0 && (
              <ul id="profile-mentor-courses" className={`mt-4 divide-y divide-gray-100 border-t border-gray-100 ${mentorFolded ? 'hidden print:block' : ''}`}>
                {mentorCerts.map((c) => (
                  <li key={c.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{c.courseTitle}</p>
                      <p className="text-xs text-gray-500">
                        {(() => {
                          const pc = mentorStats?.courses.find((x) => x.teacherId === c.courseId);
                          return [
                            c.trackLabel,
                            c.completedOn && `Published ${new Date(`${c.completedOn}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}`,
                            pc && `${pc.enrollments || 0} enrolled`,
                            pc && `${pc.completions} completed`,
                            pc?.ratingCount ? `★ ${(pc.ratingSum / pc.ratingCount).toFixed(1)} (${pc.ratingCount})` : '',
                          ].filter(Boolean).join(' · ');
                        })()}
                      </p>
                    </div>
                    <span className="flex flex-wrap items-center gap-2 print:hidden">
                      {(() => {
                        const pc = mentorStats?.courses.find((x) => x.teacherId === c.courseId);
                        return pc ? (
                          <a href={`/learning/${pc.track}/${pc.slug}`} className="text-xs font-semibold text-white bg-pink-600 px-3 py-1.5 rounded-lg hover:bg-pink-700">
                            View course
                          </a>
                        ) : null;
                      })()}
                      <a href={`/learning/certificate/${c.id}`} className="text-xs font-semibold text-pink-700 border border-pink-200 px-3 py-1.5 rounded-lg hover:bg-pink-50">
                        Certificate
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Courses completed, each with its certificate. */}
        {!profile.isCompany && (courseCerts.length > 0 || isOwnProfile) && (
          <Card
            id="courses-completed"
            title="Courses completed"
            folded={coursesFolded && courseCerts.length > 0}
            action={courseCerts.length > 0 ? (
              <span className="flex items-center gap-3 print:hidden">
                {coursesFolded && <span className="text-sm text-gray-500">{courseCerts.length}</span>}
                <CollapseToggle collapsed={coursesFolded} onToggle={toggleCourses} controls="profile-courses-list" />
              </span>
            ) : null}
          >
            {courseCerts.length > 0 ? (
              <ul id="profile-courses-list" className={`divide-y divide-gray-100 ${coursesFolded ? 'hidden print:block' : ''}`}>
                {courseCerts.map((c) => (
                  <li key={c.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{c.courseTitle}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {[c.trackLabel, c.completedOn && `Completed ${new Date(`${c.completedOn}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}`].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <Link to={`/learning/certificate/${c.id}`} className="text-xs font-semibold text-pink-700 border border-pink-200 px-3 py-1.5 rounded-lg hover:bg-pink-50 print:hidden">
                      Certificate
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm text-gray-600">Finish a course and its certificate shows here.</p>
                <Link to="/learning" className="text-sm font-semibold border border-gray-300 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg text-center print:hidden">Browse courses</Link>
              </div>
            )}
          </Card>
        )}

        {/* Her latest Proof Wall updates */}
        {!profile.isCompany && profile.uid && <RecentUpdates uid={profile.uid} viewerUid={currentUser?.uid} />}

        {/* Skills and education */}
        {!profile.isCompany && (skillList.length > 0 || education) && (
          <Card title="Skills & education">
            {skillList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skillList.map((k) => (
                  <span key={k} className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-800">{k}</span>
                ))}
              </div>
            )}
            {education && <p className={`text-sm text-gray-700 ${skillList.length ? 'mt-4' : ''}`}>{education}</p>}
          </Card>
        )}

        {/* Companies: their details */}
        {profile.isCompany && profile.companyProfile?.companyName && (
          <Card title="Company">
            <p className="text-gray-900 font-medium text-sm">{profile.companyProfile.companyName}</p>
            {profile.companyProfile.companyLocation && (
              <p className="text-gray-500 text-xs mt-0.5">{profile.companyProfile.companyLocation}</p>
            )}
          </Card>
        )}

        {/* Her own, nearly empty profile: one nudge to fill it in. */}
        {isOwnProfile && !profile.isCompany && !profile.bio && !links.length && !skillList.length && (
          <div className="rounded-xl border border-dashed border-pink-300 bg-pink-50/40 p-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
            <p className="text-sm text-gray-700">Add a short About line, your skills and your LinkedIn so companies and teammates know you.</p>
            <button onClick={() => navigate('/settings')} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Complete your profile</button>
          </div>
        )}

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
