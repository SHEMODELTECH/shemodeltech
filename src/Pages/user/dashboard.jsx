// src/Pages/user/dashboard.jsx - Dashboard Overview
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import FindFirstProject from '../../components/FindFirstProject';
import AIRecommendations from '../../components/AIRecommendations';
import DiscoverTrack from '../../components/DiscoverTrack';
import TierBadge from '../../components/TierBadge';
import { computeMemberEarnings, computeCompanyDisbursements, formatMoney } from '../../utils/paidProjects';

const badgeData = [
  { id: 'techmo', title: 'TechPO', image: '/Images/TechMO.png', label: 'Product / Project Owner' },
  { id: 'techqa', title: 'TechQA', image: '/Images/TechQA.png', label: 'Quality Assurance' },
  { id: 'techdev', title: 'TechDev', image: '/Images/TechDev.png', label: 'Development' },
  { id: 'techleads', title: 'TechLeads', image: '/Images/TechLeads.png', label: 'Non-Technical Roles' },
  { id: 'techarchs', title: 'TechArchs', image: '/Images/TechArchs.png', label: 'Low/No-Code Developer' },
  { id: 'techguard', title: 'TechGuard', image: '/Images/TechGuard.png', label: 'Cybersecurity' },
];

const DashboardOverview = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({ projectsCompleted: 0, ongoingProjects: 0, badgesEarned: 0 });
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyStats, setCompanyStats] = useState({ jobsPosted: 0, totalApplied: 0, totalViews: 0 });
  const [companyJobs, setCompanyJobs] = useState([]);
  const [earnings, setEarnings] = useState({ earnedTotal: 0, pendingTotal: 0, rows: [] });
  const [disbursements, setDisbursements] = useState({ disbursedTotal: 0, pendingTotal: 0, rows: [] });

  // Account card money summary: companies see money OUT (disbursed/pending
  // payouts on their paid projects); talent sees earnings (earned/pending).
  useEffect(() => {
    if (!currentUser || !profileData) return;
    if (profileData.isCompany) {
      computeCompanyDisbursements(currentUser.uid)
        .then(setDisbursements)
        .catch(e => console.log('Dashboard disbursements skipped:', e.message));
    } else {
      computeMemberEarnings(currentUser.uid, currentUser.email)
        .then(setEarnings)
        .catch(e => console.log('Dashboard earnings skipped:', e.message));
    }
  }, [currentUser, profileData]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      try {
        // Fetch profile
        const userSnap = await getDoc(doc(db, 'users', currentUser.uid));
        if (userSnap.exists()) {
          const data = userSnap.data();
          setProfileData(data);
          setStats(prev => ({ ...prev, badgesEarned: (data.badges || []).length }));
          // Completed-project count: distinct projects where this user earned a badge.
          // This is reliable even if the user isn't in a project's members array.
          const completedFromBadges = new Set(
            (data.badges || []).map(b => b.projectId).filter(Boolean)
          );
          if (completedFromBadges.size > 0) {
            setStats(prev => ({ ...prev, projectsCompleted: completedFromBadges.size }));
          }
        }

        // Fetch ongoing projects (single where to avoid composite index; filter+sort in JS)
        try {
          const projectsQ = query(
            collection(db, 'projects'),
            where('members', 'array-contains', currentUser.uid)
          );
          const projectsSnap = await getDocs(projectsQ);
          const projects = projectsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
            .filter(p => p.status === 'active')
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
            .slice(0, 5);
          setOngoingProjects(projects);
          setStats(prev => ({ ...prev, ongoingProjects: projects.length }));
        } catch (e) {
          console.log('Projects query skipped:', e.message);
        }

        // Fetch completed projects (single where; filter in JS)
        try {
          const completedQ = query(
            collection(db, 'projects'),
            where('members', 'array-contains', currentUser.uid)
          );
          const completedSnap = await getDocs(completedQ);
          const completedList = completedSnap.docs.map(d => ({ id: d.id, ...d.data() }))
            .filter(p => p.status === 'completed');
          setCompletedProjects(completedList.slice(0, 5));
          // Use the larger of: projects-query count, or badge-derived count (set above).
          setStats(prev => ({ ...prev, projectsCompleted: Math.max(prev.projectsCompleted || 0, completedList.length) }));
        } catch (e) {
          console.log('Completed projects query skipped:', e.message);
        }
      } catch (e) {
        console.error('Error fetching dashboard data:', e);
      }
      setLoading(false);
    };
    fetchData();
  }, [currentUser]);

  // Company dashboard: load their posted (paid) projects and applications.
  // The job board section is retired for companies - they hire via paid projects.
  useEffect(() => {
    if (!currentUser || !profileData?.isCompany) return;
    let active = true;
    (async () => {
      try {
        const { collection: col, getDocs, query: q, where } = await import('firebase/firestore');
        const snap = await getDocs(q(col(db, 'projects'), where('submitterId', '==', currentUser.uid)));
        const projects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const totalApplied = projects.reduce((s, p) => s + (p.applicationCount || 0), 0);
        const activeCount = projects.filter(p => p.status === 'active' || p.status === 'awaiting_payment_confirmation').length;
        if (active) {
          setCompanyJobs(projects);
          setCompanyStats({ jobsPosted: projects.length, totalApplied, totalViews: activeCount });
        }
      } catch (e) { console.error('load company stats failed', e); }
    })();
    return () => { active = false; };
  }, [currentUser, profileData]);

  if (loading) {
    return (
      
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      
    );
  }

  return (
    
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

        {/* Cold-start: nudge unfinished Foundations first (learn, then projects). */}
        {!loading && !profileData?.isCompany && ongoingProjects.length === 0 && completedProjects.length === 0 &&
          !(profileData?.foundationsComplete && profileData.foundationsComplete[profileData?.primarySkillTrack]) && (
          <div className="bg-gradient-to-br from-blue-50 to-orange-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Start with your Foundations</h2>
            <p className="text-gray-600 text-sm mb-4">Before you join a project, complete a short set of foundational lessons for your track. It only takes a little while, and then you'll be ready to contribute.</p>
            <button onClick={() => navigate('/foundations')} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all">
              Go to Foundations
            </button>
          </div>
        )}

        {/* Cold-start: show "find your first project" only if the user has joined none yet. */}
        {!loading && ongoingProjects.length === 0 && completedProjects.length === 0 && !profileData?.isCompany && (
          <FindFirstProject profile={profileData} />
        )}

        {/* AI-matched projects + Foundations courses for this member (individuals only). */}
        {!loading && !profileData?.isCompany && (
          <AIRecommendations currentUser={currentUser} />
        )}

        {/* Help users who haven't settled on a track (new to tech or unsure) discover one. */}
        {!loading && !profileData?.isCompany && !profileData?.primarySkillTrack && ongoingProjects.length === 0 && completedProjects.length === 0 && (
          <div className="mb-6">
            <DiscoverTrack />
          </div>
        )}

        {/* Stats Cards */}
        {profileData?.isCompany ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-1">Paid Projects Posted</p>
              <p className="text-3xl font-bold text-gray-900">{companyStats.jobsPosted}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-1">Applications Received</p>
              <p className="text-3xl font-bold text-gray-900">{companyStats.totalApplied}</p>
              <p className="text-gray-400 text-xs mt-1">Across all your paid projects</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-1">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900">{companyStats.totalViews}</p>
              <p className="text-gray-400 text-xs mt-1">Running or awaiting payment confirmation</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-1">Projects Completed</p>
              <p className="text-3xl font-bold text-gray-900">{stats.projectsCompleted}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-1">Ongoing Projects</p>
              <p className="text-3xl font-bold text-gray-900">{stats.ongoingProjects}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-1">Badges Earned</p>
              <p className="text-3xl font-bold text-gray-900">{stats.badgesEarned}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-1">Talent Board</p>
              <p className="text-3xl font-bold text-gray-900">{stats.badgesEarned > 0 ? 'Listed' : '-'}</p>
              <p className="text-gray-400 text-xs mt-1">{stats.badgesEarned > 0 ? 'Recruiters can find you' : 'Earn a badge to get listed'}</p>
            </div>
          </div>
        )}



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {profileData?.isCompany ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Your Paid Projects</h3>
                  <div className="flex items-center gap-4">
                    <Link to="/projects/submit" className="text-blue-600 text-sm font-medium hover:underline">+ Post Paid Project</Link>
                    <Link to="/projects/owner-dashboard" className="text-blue-600 text-sm font-medium hover:underline">Manage</Link>
                  </div>
                </div>
                {companyJobs.length === 0 ? (
                  <p className="text-gray-400 text-sm">No paid projects posted yet. Post a paid project to hire a team - you set the pay per person for every role, and it's visible to talent before they apply.</p>
                ) : (
                  <div className="space-y-3">
                    {companyJobs.map(p => (
                      <div key={p.id} onClick={() => navigate('/projects/owner-dashboard')} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                        <div className="min-w-0 flex-1">
                          <p className="text-gray-900 text-sm font-medium truncate">{p.projectTitle || 'Untitled project'}</p>
                          <p className="text-gray-400 text-xs mt-0.5 capitalize">
                            {p.status === 'awaiting_payment_confirmation' ? 'Awaiting payment confirmation' : p.status || 'active'}
                            {p.isPaid && p.totalBudget > 0 ? ` · $${Number(p.totalBudget).toLocaleString()} budget` : ''}
                          </p>
                        </div>
                        <div className="flex gap-4 flex-shrink-0 ml-3 text-center">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{p.applicationCount || 0}</p>
                            <p className="text-gray-400 text-[11px]">applied</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{(p.members || []).length}</p>
                            <p className="text-gray-400 text-[11px]">on team</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
            <>
            {/* Join a Project CTA */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Join a project</h3>
              <p className="text-gray-600 text-sm mb-4">Browse active projects looking for collaborators. Earn badges by completing real-world work.</p>
              <button onClick={() => navigate('/projects')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all">
                Browse Projects
              </button>
            </div>

            {/* Ongoing Projects */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Ongoing Projects</h3>
                <Link to="/projects/my-projects" className="text-blue-600 text-sm font-medium hover:underline">See All</Link>
              </div>
              {ongoingProjects.length === 0 ? (
                <p className="text-gray-400 text-sm">No ongoing projects. Browse projects to get started.</p>
              ) : (
                <div className="space-y-3">
                  {ongoingProjects.map(project => (
                    <div key={project.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                      <div className="min-w-0 flex-1">
                        <p className="text-gray-900 text-sm font-medium truncate">{project.projectTitle || project.title || 'Untitled Project'}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{project.industryTrack || project.category || 'General'}</p>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-md flex-shrink-0 ml-3">Active</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Projects */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Completed Projects</h3>
                <Link to="/project-vault" className="text-blue-600 text-sm font-medium hover:underline">View All</Link>
              </div>
              {completedProjects.length === 0 ? (
                <p className="text-gray-400 text-sm">No completed projects yet. Finish a project to see it here.</p>
              ) : (
                <div className="space-y-3">
                  {completedProjects.map(project => (
                    <div key={project.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                      <div className="min-w-0 flex-1">
                        <p className="text-gray-900 text-sm font-medium truncate">{project.projectTitle || project.title || 'Untitled Project'}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{project.industryTrack || project.category || 'General'}</p>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-md flex-shrink-0 ml-3">Completed</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Your Badges */}
            {!profileData?.isCompany && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Your Badges</h3>
              <p className="text-gray-500 text-xs mb-4">Earn badges by completing projects in each track.</p>

              {/* Badge Levels */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4 p-2.5 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-[10px] font-medium mr-0.5">Levels:</p>
                {['Novice', 'Associate', 'Advanced', 'Expert'].map((level, i) => (
                  <span key={level} className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                    i === 0 ? 'bg-blue-50 text-blue-600' :
                    i === 1 ? 'bg-blue-100 text-blue-700' :
                    i === 2 ? 'bg-orange-50 text-orange-600' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {level}
                  </span>
                ))}
              </div>

              {/* All 6 Badges */}
              <div className="space-y-3">
                {badgeData.map((badge) => {
                  // Match all earned badges in this category (robust: id / title / category, case-insensitive).
                  const key = (s) => (s || '').toString().toLowerCase();
                  const matches = (profileData?.badges || []).filter(b =>
                    key(b.id) === key(badge.id) ||
                    key(b.title) === key(badge.title) ||
                    key(b.category) === key(badge.title) ||
                    key(b.category) === key(badge.id)
                  );
                  const earned = matches.length > 0;
                  // Level is derived LIVE from how many badges earned in this track,
                  // so it advances as more are earned (Novice 1, Associate 2-5, Advanced 6-10, Expert 11+).
                  const count = matches.length;
                  const level = count >= 11 ? 'Expert' : count >= 6 ? 'Advanced' : count >= 2 ? 'Associate' : 'Novice';
                  return (
                    <div key={badge.id} className={`flex items-center gap-3 p-3 rounded-lg border ${earned ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 bg-gray-50/50'}`}>
                      <TierBadge image={badge.image} alt={badge.title} level={level} size={40} earned={!!earned} showLabel={!!earned} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-semibold ${earned ? 'text-gray-900' : 'text-gray-400'}`}>{badge.title}</p>
                          {earned && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">{level}{count > 1 ? ` · ${count}` : ''}</span>
                          )}
                        </div>
                        <p className={`text-xs ${earned ? 'text-gray-600' : 'text-gray-400'}`}>{badge.label}</p>
                      </div>
                      {earned ? (
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-gray-300 text-xs flex-shrink-0">Locked</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            )}

            {/* Account & Earnings */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">My Account</h3>
                <Link to="/account" className="text-blue-600 text-sm font-medium hover:underline">View Account</Link>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {profileData?.isCompany ? (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-blue-700 text-[10px] uppercase tracking-wider font-semibold">Disbursed</p>
                      <p className="text-lg font-black text-blue-700">{formatMoney(disbursements.disbursedTotal)}</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-amber-700 text-[10px] uppercase tracking-wider font-semibold">Pending</p>
                      <p className="text-lg font-black text-amber-700">{formatMoney(disbursements.pendingTotal)}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-700 text-[10px] uppercase tracking-wider font-semibold">Earned</p>
                      <p className="text-lg font-black text-green-700">{formatMoney(earnings.earnedTotal)}</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-amber-700 text-[10px] uppercase tracking-wider font-semibold">Pending</p>
                      <p className="text-lg font-black text-amber-700">{formatMoney(earnings.pendingTotal)}</p>
                    </div>
                  </>
                )}
              </div>
              <p className="text-gray-400 text-xs">{profileData?.isCompany
                ? 'Money across your paid projects: Disbursed is confirmed received by members; Pending is the total to be paid to all persons on your ongoing projects.'
                : 'Earnings from paid projects you\'re approved for. Confirmed payments (including any dispute-adjusted amounts) show under Earned.'}</p>
            </div>

            {/* Plan */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Your account</h3>
              <p className="text-blue-600 font-semibold text-lg mb-1">Free</p>
              <p className="text-gray-400 text-xs mb-3">
                She Model Tech is free for everyone. Unlimited collaborative projects, all
                Foundations courses, every badge track, the Talent Board, unlimited
                messaging, and the Proof Wall &mdash; nothing is held back.
              </p>
              <Link to="/settings?tab=membership" className="text-blue-600 text-sm font-medium hover:underline">
                See what&rsquo;s included
              </Link>
            </div>

            {/* Talent Board */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-base font-bold text-gray-900 mb-1">Talent Board</h3>
              <p className="text-gray-600 text-xs mb-3">{profileData?.isCompany ? 'Browse verified talent and find people for your team.' : "You're visible to recruiters and companies on the Talent Board."}</p>
              <Link to="/talent-board" className="text-blue-600 text-sm font-medium hover:underline">View Talent Board</Link>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default DashboardOverview;
