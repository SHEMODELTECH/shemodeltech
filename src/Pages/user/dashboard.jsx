// src/Pages/user/dashboard.jsx - Dashboard Overview
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import FindFirstProject from '../../components/FindFirstProject';
import CompanyVerificationBanner from '../../components/CompanyVerificationBanner';
import DiscoverTrack from '../../components/DiscoverTrack';
import { trackStandings } from '../../components/BadgeShowcase';
import { isRealTrack } from '../../components/TrackPicker';
import TierBadge from '../../components/TierBadge';
import { BADGE_TRACKS, levelForCount } from '../../config/badgeTracks';
import GettingStarted from '../../components/GettingStarted';
import { PromotedStrip } from '../../components/PriorityBanners';
import ContinueLearning from '../../components/ContinueLearning';
import { TIER_LABEL, companyTier } from '../../config/tiers';
import PayoutReminder from '../../components/PayoutReminder';
import PushPrompt from '../../components/PushPrompt';
import {
  computeMemberEarnings,
  computeCompanyDisbursements,
  formatMoney,
} from '../../utils/paidProjects';


const DashboardOverview = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({ projectsCompleted: 0, ongoingProjects: 0, badgesEarned: 0 });
  const [ongoingProjects, setOngoingProjects] = useState([]);
  // Projects this member was approved to LEAD that aren't open yet ('setup').
  const [setupProjects, setSetupProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyStats, setCompanyStats] = useState({
    jobsPosted: 0,
    totalApplied: 0,
    totalViews: 0,
  });
  const [companyJobs, setCompanyJobs] = useState([]);
  const [earnings, setEarnings] = useState({ earnedTotal: 0, pendingTotal: 0, rows: [] });
  const [disbursements, setDisbursements] = useState({
    disbursedTotal: 0,
    pendingTotal: 0,
    rows: [],
  });

  // Account card money summary: companies see money OUT (disbursed/pending
  // payouts on their paid projects); talent sees earnings (earned/pending).
  useEffect(() => {
    if (!currentUser || !profileData) return;
    if (profileData.isCompany) {
      computeCompanyDisbursements(currentUser.uid)
        .then(setDisbursements)
        .catch((e) => console.log('Dashboard disbursements skipped:', e.message));
    } else {
      computeMemberEarnings(currentUser.uid, currentUser.email)
        .then(setEarnings)
        .catch((e) => console.log('Dashboard earnings skipped:', e.message));
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
          setStats((prev) => ({ ...prev, badgesEarned: (data.badges || []).length }));
          // Completed-project count: distinct projects where this user earned a badge.
          // This is reliable even if the user isn't in a project's members array.
          const completedFromBadges = new Set(
            (data.badges || []).map((b) => b.projectId).filter(Boolean)
          );
          if (completedFromBadges.size > 0) {
            setStats((prev) => ({ ...prev, projectsCompleted: completedFromBadges.size }));
          }
        }

        // Fetch ongoing projects (single where to avoid composite index; filter+sort in JS)
        let memberProjectDocs = null; // reused below for completed projects (same query)
        try {
          const projectsQ = query(
            collection(db, 'projects'),
            where('members', 'array-contains', currentUser.uid)
          );
          const projectsSnap = await getDocs(projectsQ);
          memberProjectDocs = projectsSnap.docs;
          const byId = new Map();
          projectsSnap.docs.forEach((d) => byId.set(d.id, { id: d.id, ...d.data() }));

          // Projects she LEADS. A lead is the owner (submitterId), not in
          // `members`, so without this an approved lead never saw her own
          // project on the dashboard until it was opened.
          // Companies post paid projects rather than lead cohort ones; their
          // projects already have their own dashboard section.
          const isCompanyUser = userSnap.exists() && !!userSnap.data().isCompany;
          if (!isCompanyUser) try {
            const ledSnap = await getDocs(
              query(collection(db, 'projects'), where('submitterId', '==', currentUser.uid))
            );
            ledSnap.docs.forEach((d) =>
              byId.set(d.id, { id: d.id, ...d.data(), isLead: true })
            );
          } catch (e) {
            console.log('Led projects query skipped:', e.message);
          }

          const all = [...byId.values()].filter((p) => p.reviewStatus !== 'rejected');
          setSetupProjects(all.filter((p) => p.isLead && p.status === 'setup'));
          const projects = all
            .filter((p) => p.status === 'active' || (p.isLead && p.status === 'setup'))
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
            .slice(0, 5);
          setOngoingProjects(projects);
          setStats((prev) => ({ ...prev, ongoingProjects: projects.length }));
        } catch (e) {
          console.log('Projects query skipped:', e.message);
        }

        // Fetch completed projects (single where; filter in JS)
        try {
          let completedDocs = memberProjectDocs;
          if (!completedDocs) {
            const completedQ = query(
              collection(db, 'projects'),
              where('members', 'array-contains', currentUser.uid)
            );
            completedDocs = (await getDocs(completedQ)).docs;
          }
          const completedList = completedDocs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((p) => p.status === 'completed');
          setCompletedProjects(completedList.slice(0, 5));
          // Use the larger of: projects-query count, or badge-derived count (set above).
          setStats((prev) => ({
            ...prev,
            projectsCompleted: Math.max(prev.projectsCompleted || 0, completedList.length),
          }));
        } catch (e) {
          console.log('Completed projects query skipped:', e.message);
        }
      } catch (e) {
        console.error('Error fetching dashboard data:', e);
      }
      setLoading(false);
    };
    fetchData();
  }, [currentUser?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  // Company dashboard: load their posted (paid) projects and applications.
  // The job board section is retired for companies - they hire via paid projects.
  useEffect(() => {
    if (!currentUser || !profileData?.isCompany) return;
    let active = true;
    (async () => {
      try {
        const { collection: col, getDocs, query: q, where } = await import('firebase/firestore');
        const snap = await getDocs(
          q(col(db, 'projects'), where('submitterId', '==', currentUser.uid))
        );
        const projects = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const totalApplied = projects.reduce((s, p) => s + (p.applicationCount || 0), 0);
        const activeCount = projects.filter(
          (p) => p.status === 'active' || p.status === 'awaiting_payment_confirmation'
        ).length;
        if (active) {
          setCompanyJobs(projects);
          setCompanyStats({ jobsPosted: projects.length, totalApplied, totalViews: activeCount });
        }
      } catch (e) {
        console.error('load company stats failed', e);
      }
    })();
    return () => {
      active = false;
    };
  }, [currentUser, profileData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  // Members with paid work see their earnings beside their badges.
  const showEarnings = earnings.earnedTotal > 0 || earnings.pendingTotal > 0;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Her numbers first, in one slim row; the badge box shows her medal. */}
      {!profileData?.isCompany && (() => {
        const top = trackStandings(profileData)[0];
        const own = BADGE_TRACKS.find((t) => t.name === profileData?.primarySkillTrack) || BADGE_TRACKS[0];
        const lvl = top ? (levelForCount(top.count) || 'Novice') : 'Novice';
        return (
          <div className="mb-6 bg-white border border-gray-200 rounded-xl grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200 overflow-hidden">
            {[
              ['Projects completed', stats.projectsCompleted, null],
              ['Ongoing projects', stats.ongoingProjects, null],
              ['Badges earned', stats.badgesEarned, null, '/badges'],
              ['Talent Board', 'Listed', stats.badgesEarned > 0 ? 'Recruiters can find you' : 'A badge moves you up', '/talent-board'],
            ].map(([label, value, note, to]) => {
              const body = (
                <>
                  <p className="text-gray-500 text-xs sm:text-sm">{label}</p>
                  {label === 'Badges earned' ? (
                    <div className="flex items-center gap-2 mt-1">
                      <TierBadge image={(top || own).img} alt={top ? `${top.name} ${lvl}` : 'No badge yet'} level={lvl} size={32} showLabel={false} earned={!!top} />
                      <span className="text-xl sm:text-2xl font-bold text-gray-900">{value}</span>
                    </div>
                  ) : (
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
                  )}
                  {note && <p className="text-gray-400 text-xs mt-0.5">{note}</p>}
                </>
              );
              // The badge box is pink, like the badge on her profile.
              const tint = label === 'Badges earned' ? 'bg-[#FDF2F7] hover:bg-pink-50' : 'hover:bg-gray-50';
              return to
                ? <Link key={label} to={to} className={`p-4 ${tint}`}>{body}</Link>
                : <div key={label} className="p-4">{body}</div>;
            })}
          </div>
        );
      })()}

      {/* 1. Things that need her: set up a project she leads, payout details, notifications. */}
      {/* Approved lead: her project is hers to prepare before it starts. */}
      {!loading &&
        setupProjects.map((p) => (
          <div
            key={p.id}
            className="mb-6 bg-gray-50 border border-gray-300 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-gray-900 font-semibold text-sm">
                You're leading &ldquo;{p.projectTitle || p.title || 'your project'}&rdquo;
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Your lead application was approved. Edit the details, adjust the team roles and
                size, then open it for applications
                {p.startDate ? ` before it starts on ${new Date(p.startDate).toLocaleDateString()}` : ''}.
              </p>
            </div>
            <button
              onClick={() => navigate(`/projects/${p.id}/setup`)}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-all flex-shrink-0"
            >
              Set up project
            </button>
          </div>
        ))}

      {/* Unverified companies: status and a direct line to the team */}
      {!loading && profileData?.isCompany && <CompanyVerificationBanner profile={profileData} />}
      {!loading && !profileData?.isCompany && currentUser && <PayoutReminder uid={currentUser.uid} profile={profileData} />}
      {!loading && currentUser && <PushPrompt />}

      {/* 2. New members: four steps that tick off as she goes. */}
      {!loading && currentUser && <GettingStarted uid={currentUser.uid} profile={profileData} />}

      {profileData?.isCompany ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link to="/premium" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-pink-300">
            <p className="text-gray-500 text-sm mb-1">Your plan</p>
            <p className="text-2xl font-bold text-gray-900">{companyTier(profileData) ? TIER_LABEL[companyTier(profileData)] : 'Free company'}</p>
            <p className="text-pink-700 text-xs font-semibold mt-1">See company tiers</p>
          </Link>
          <Link to="/talent-board" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-pink-300">
            <p className="text-gray-500 text-sm mb-1">Talent Board</p>
            <p className="text-2xl font-bold text-gray-900">Browse talent</p>
            <p className="text-gray-400 text-xs mt-1">Verified members with real project proof</p>
          </Link>
          <Link to="/jobs/mine" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-pink-300">
            <p className="text-gray-500 text-sm mb-1">Jobs</p>
            <p className="text-2xl font-bold text-gray-900">Your job posts</p>
            <p className="text-gray-400 text-xs mt-1">Post and manage roles</p>
          </Link>
        </div>
      ) : (
        <>
          {/* 3. Courses she's started, and how many she's finished. */}
          <ContinueLearning profile={profileData} uid={currentUser?.uid} />

          {/* 5. Up to three projects that fit her (AI pick first), then featured jobs and projects. */}
          {!loading && <FindFirstProject profile={profileData} uid={currentUser?.uid} currentUser={currentUser} />}
      {/* Help users who haven't settled on a track (new to tech or unsure) discover one. */}
      {!loading &&
        !isRealTrack(profileData?.primarySkillTrack) &&
        ongoingProjects.length === 0 &&
        completedProjects.length === 0 && (
          <div className="mb-6">
            <DiscoverTrack />
          </div>
        )}

          {!loading && <PromotedStrip />}
        </>
      )}

      {/* Members: account on the left, badges in the right sidebar; companies: what members are building. */}
      <div className={profileData?.isCompany ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}>
        {profileData?.isCompany && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">What She Model Tech members are building</h3>
              <p className="text-gray-500 text-sm mb-4">Follow projects, badges earned, and work shipped on the Proof Wall. Open any project to see the team.</p>
              <div className="flex flex-wrap gap-2">
                <Link to="/proof-wall" className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Open the Proof Wall</Link>
                <Link to="/conference" className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">Conference</Link>
              </div>
            </div>
          </div>
        )}

        {/* Right column */}
        <div className={profileData?.isCompany ? 'space-y-6' : 'grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'}>
          {/* Earnings: only for members with paid work (earned or pending). */}
          {!profileData?.isCompany && showEarnings && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 lg:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">My Account</h3>
              <Link to="/account" className="text-pink-600 text-sm font-medium hover:underline">
                View Account
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {profileData?.isCompany ? (
                <>
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                    <p className="text-pink-700 text-[10px] uppercase tracking-wider font-semibold">
                      Disbursed
                    </p>
                    <p className="text-lg font-black text-pink-700">
                      {formatMoney(disbursements.disbursedTotal)}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                    <p className="text-gray-800 text-[10px] uppercase tracking-wider font-semibold">
                      Pending
                    </p>
                    <p className="text-lg font-black text-gray-800">
                      {formatMoney(disbursements.pendingTotal)}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                    <p className="text-pink-700 text-[10px] uppercase tracking-wider font-semibold">
                      Earned
                    </p>
                    <p className="text-lg font-black text-pink-700">
                      {formatMoney(earnings.earnedTotal)}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                    <p className="text-gray-800 text-[10px] uppercase tracking-wider font-semibold">
                      Pending
                    </p>
                    <p className="text-lg font-black text-gray-800">
                      {formatMoney(earnings.pendingTotal)}
                    </p>
                  </div>
                </>
              )}
            </div>
            <p className="text-gray-400 text-xs">
              {profileData?.isCompany
                ? 'Money across your paid projects: Disbursed is confirmed received by members; Pending is the total to be paid to all persons on your ongoing projects.'
                : "Earnings from paid projects you're approved for. Confirmed payments (including any dispute-adjusted amounts) show under Earned."}
            </p>
          </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
