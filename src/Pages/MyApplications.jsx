// src/Pages/MyApplications.jsx - Track job applications submitted by the user

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';

const statusColors = {
  submitted: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', label: 'Submitted' },
  reviewed: { bg: 'bg-orange-500/20', text: 'text-orange-500', border: 'border-orange-500/30', label: 'Under Review' },
  accepted: { bg: 'bg-blue-500/20', text: 'text-blue-500', border: 'border-blue-500/30', label: 'Accepted' },
  rejected: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30', label: 'Rejected' },
  interview: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Interview' },
};

const MyApplications = () => {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login', { replace: true, state: { from: '/jobs/my-applications', message: 'Please sign in to view your applications' } });
    }
  }, [currentUser, authLoading, navigate]);

  useEffect(() => {
    if (!currentUser) return;

    const appQuery = query(
      collection(db, 'applications'),
      where('userId', '==', currentUser.uid)
    );

    const unsub = onSnapshot(appQuery,
      (snap) => {
        const apps = snap.docs.map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0));
        setApplications(apps);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading applications:', err);
        toast.error('Error loading your applications');
        setLoading(false);
      }
    );

    return () => unsub();
  }, [currentUser]);

  const filtered = filterStatus === 'all'
    ? applications
    : applications.filter(a => a.status === filterStatus);

  const statCounts = {
    total: applications.length,
    submitted: applications.filter(a => a.status === 'submitted').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (authLoading || !currentUser) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#000' }}>
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-20 sm:py-28">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-orange-400">Applications</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Track and manage your job applications</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total', value: statCounts.total, color: 'text-white' },
              { label: 'Pending', value: statCounts.submitted, color: 'text-blue-400' },
              { label: 'Accepted', value: statCounts.accepted, color: 'text-blue-400' },
              { label: 'Rejected', value: statCounts.rejected, color: 'text-red-400' },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
            <p className="text-white font-semibold text-sm mb-3">Filter by Status</p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'submitted', label: 'Submitted' },
                { id: 'reviewed', label: 'Under Review' },
                { id: 'interview', label: 'Interview' },
                { id: 'accepted', label: 'Accepted' },
                { id: 'rejected', label: 'Rejected' },
              ].map(f => (
                <button key={f.id} onClick={() => setFilterStatus(f.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    filterStatus === f.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/10 text-gray-600 hover:bg-white/20'
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Applications List */}
          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Loading your applications...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white text-xl font-bold mb-2">
                {applications.length === 0 ? 'No Applications Yet' : 'No Results'}
              </p>
              <p className="text-gray-400 text-sm mb-6">
                {applications.length === 0
                  ? "You haven't applied to any jobs yet. Browse jobs and start applying!"
                  : 'No applications match the selected filter.'}
              </p>
              {applications.length === 0 && (
                <Link to="/jobs" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl text-sm transition-all hover:from-orange-600 hover:to-orange-700">
                  Browse Jobs
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(app => {
                const status = statusColors[app.status] || statusColors.submitted;
                const date = app.submittedAt?.toDate?.() || (app.submittedAt ? new Date(app.submittedAt) : null);

                return (
                  <div key={app.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.07] transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-bold text-base truncate">
                            {app.applicationData?.jobTitle || app.firstName + ' ' + app.lastName}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${status.bg} ${status.text} border ${status.border} flex-shrink-0`}>
                            {status.label}
                          </span>
                        </div>
                        {app.applicationData?.companyName && (
                          <p className="text-gray-400 text-sm">{app.applicationData.companyName}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-gray-500 text-xs">
                          {date && (
                            <span>Applied {date.toLocaleDateString()}</span>
                          )}
                          {app.applicationData?.skills && (
                            <span className="truncate max-w-[200px]">Skills: {app.applicationData.skills}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Back to Dashboard */}
          <div className="mt-10 text-center">
            <Link to="/dashboard" className="text-orange-400 hover:text-orange-300 text-sm font-semibold">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyApplications;
