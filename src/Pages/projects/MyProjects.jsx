// src/Pages/projects/MyProjects.jsx - View projects you applied to or created

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';

const formatTimeline = (t) => ({ '1-week': '1 Week', '2-weeks': '2 Weeks', '1-month': '1 Month', '2-3-months': '2-3 Months', '3-6-months': '3-6 Months', '6-months-plus': '6+ Months', 'flexible': 'Flexible' }[t] || t);

const statusColors = {
  submitted: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
  approved: 'bg-blue-600/20 text-blue-500 border-blue-600/30',
  rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
  removed: 'bg-red-500/20 text-red-300 border-red-500/30',
  completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  active: 'bg-blue-600/20 text-blue-500 border-blue-600/30',
};

const MyProjects = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [postedProjects, setPostedProjects] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('applied');
  const [projectFilter, setProjectFilter] = useState('ongoing');
  const [sortBy, setSortBy] = useState('newest');

  const filteredApplications = applications.filter(app => {
    if (projectFilter === 'completed') {
      return app.status === 'completed' || app.completionStatus;
    }
    return app.status !== 'completed' && !app.completionStatus;
  });

  const filteredPosted = postedProjects.filter(p => {
    if (projectFilter === 'completed') return p.status === 'completed';
    return p.status !== 'completed';
  });

  useEffect(() => {
    if (!currentUser) { setLoading(false); return; }

    const appQ = query(collection(db, 'project_applications'), where('applicantEmail', '==', currentUser.email));
    const unsubApps = onSnapshot(appQ, (snap) => {
      const apps = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      apps.sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0));
      setApplications(apps);
      setLoading(false);
    }, (err) => {
      console.error('Error loading applications:', err);
      toast.error('Error loading your applications');
      setLoading(false);
    });

    const postQ = query(collection(db, 'projects'), where('submitterEmail', '==', currentUser.email));
    const unsubPosts = onSnapshot(postQ, (snap) => {
      const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      posts.sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0));
      setPostedProjects(posts);
    });

    const badgeQ = query(collection(db, 'member_badges'), where('memberEmail', '==', currentUser.email));
    const unsubBadges = onSnapshot(badgeQ, (snap) => {
      const b = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      b.sort((a, b) => (b.awardedAt?.toDate?.() || 0) - (a.awardedAt?.toDate?.() || 0));
      setBadges(b);
    });

    return () => { unsubApps(); unsubPosts(); unsubBadges(); };
  }, [currentUser]);

  const statCounts = {
    applied: applications.length,
    approved: applications.filter(a => a.status === 'approved').length,
    posted: postedProjects.length,
    completed: postedProjects.filter(p => p.status === 'completed').length,
    badges: badges.length,
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Loading your projects...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      
      <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#ffffff' }}>
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-20 sm:py-28">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-500">Projects</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Manage your applications, posted projects, and earned badges</p>

            {/* Stats - directly under header like finance */}
            <div className="flex flex-wrap justify-center gap-4 xs:gap-6 mt-6">
              {[
                { label: 'Applied', value: statCounts.applied, color: 'text-blue-600' },
                { label: 'Approved', value: statCounts.approved, color: 'text-blue-600' },
                { label: 'Posted', value: statCounts.posted, color: 'text-blue-500' },
                { label: 'Completed', value: statCounts.completed, color: 'text-blue-400' },
                { label: 'Badges', value: statCounts.badges, color: 'text-orange-500' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className={`text-xl xs:text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-gray-500 text-[10px] xs:text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Filters and Sort - horizontal layout like finance */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-gray-900 font-semibold text-sm mb-2">Filter by Category</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'applied', label: `Applied (${applications.length})` },
                    { id: 'posted', label: `Posted (${postedProjects.length})` },
                    { id: 'badges', label: `Badges (${badges.length})` },
                  ].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all min-h-[40px] ${
                        tab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
                      }`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              {tab !== 'badges' && (
                <div>
                  <p className="text-gray-900 font-semibold text-sm mb-2">Sort By</p>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:border-blue-500 focus:outline-none">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              )}
            </div>

            {/* Status sub-filter row */}
            {tab !== 'badges' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-900 font-semibold text-sm mb-2">Filter by Status</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setProjectFilter('ongoing')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all min-h-[40px] ${projectFilter === 'ongoing' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-100'}`}>
                    Ongoing
                  </button>
                  <button onClick={() => setProjectFilter('completed')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all min-h-[40px] ${projectFilter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-100'}`}>
                    Completed
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Applied Tab */}
          {tab === 'applied' && (
            filteredApplications.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-900 text-xl font-bold mb-2">
                  {applications.length === 0 ? 'No Applications Yet' : `No ${projectFilter} projects found`}
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  {applications.length === 0 ? "You haven't applied to any projects yet" : `No ${projectFilter} applications match`}
                </p>
                {applications.length === 0 && (
                  <Link to="/projects" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-gray-900 font-bold rounded-xl text-sm transition-all hover:from-blue-500 hover:to-blue-600">
                    Browse Projects
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {(sortBy === 'oldest' ? [...filteredApplications].reverse() : filteredApplications).map(app => (
                  <div key={app.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:bg-white/[0.07] transition-all">
                    <Link to={`/projects/${app.projectId}`} className="block">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-gray-900 font-bold text-base truncate">{app.projectTitle}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${statusColors[app.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                              {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-500 text-xs">
                            <span>Role: {app.role}</span>
                            {app.createdAt?.toDate && (
                              <span>Applied {new Date(app.createdAt.toDate()).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* The project owner sent a message about this application -
                        the conversation lives in Messages. */}
                    {app.status === 'submitted' && app.feedbackRequest?.message && (
                      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-amber-800 text-xs">
                          <span className="font-semibold">Message from the project owner:</span> "{app.feedbackRequest.message}"
                        </p>
                        <Link
                          to={app.feedbackRequest.requestedByUid ? `/messages?with=${app.feedbackRequest.requestedByUid}` : '/messages'}
                          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-all"
                        >
                          Open conversation →
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {/* Posted Tab */}
          {tab === 'posted' && (
            filteredPosted.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-900 text-xl font-bold mb-2">
                  {postedProjects.length === 0 ? 'No Posted Projects' : `No ${projectFilter} projects found`}
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  {postedProjects.length === 0 ? "You haven't posted any projects yet" : `No ${projectFilter} projects match`}
                </p>
                {postedProjects.length === 0 && (
                  <Link to="/projects/submit" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-gray-900 font-bold rounded-xl text-sm transition-all hover:from-blue-600 hover:to-blue-700">
                    Post a Project
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {(sortBy === 'oldest' ? [...filteredPosted].reverse() : filteredPosted).map(project => (
                  <Link key={project.id} to={`/projects/${project.id}`}
                    className="block bg-gray-50 border border-gray-200 rounded-xl p-5 hover:bg-white/[0.07] transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-gray-900 font-bold text-base truncate">{project.projectTitle}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${project.status === 'completed' ? statusColors.completed : statusColors.active}`}>
                            {project.status === 'completed' ? 'Completed' : 'Active'}
                          </span>
                        </div>
                        {project.timeline && (
                          <p className="text-blue-500 text-xs font-semibold mb-1">{formatTimeline(project.timeline)}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-500 text-xs">
                          <span className="font-bold text-blue-500">
                            Collaborative
                          </span>
                          {project.createdAt?.toDate && (
                            <span>Posted {new Date(project.createdAt.toDate()).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}

          {/* Badges Tab */}
          {tab === 'badges' && (
            badges.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-900 text-xl font-bold mb-2">No Badges Earned Yet</p>
                <p className="text-gray-400 text-sm mb-6">Complete projects to earn tech badges</p>
                <Link to="/projects" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-gray-900 font-bold rounded-xl text-sm transition-all hover:from-blue-500 hover:to-blue-600">
                  Browse Projects
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {badges.map(badge => (
                  <div key={badge.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:bg-white/[0.07] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-gray-900 flex-shrink-0">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-gray-900 font-bold text-base truncate">{badge.badgeName}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-500 border border-orange-500/30 flex-shrink-0">
                            {badge.badgeLevel}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-500 text-xs">
                          <span>{badge.projectTitle}</span>
                          {badge.awardedAt?.toDate && (
                            <span>Awarded {new Date(badge.awardedAt.toDate()).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Back to Dashboard */}
          <div className="mt-10 text-center">
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-500 text-sm font-semibold">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProjects;
