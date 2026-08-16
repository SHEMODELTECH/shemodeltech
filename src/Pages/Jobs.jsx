// src/Pages/Jobs.jsx - Jobs Board with Location Filter

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useResponsive } from '../hooks/useResponsive';
import Navbar from '../components/Navbar';
import {
  collection, query, where, orderBy, onSnapshot, updateDoc, doc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';

const Jobs = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [isCompany, setIsCompany] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    import('firebase/firestore').then(({ doc, getDoc }) => {
      getDoc(doc(db, 'users', currentUser.uid))
        .then(s => { if (s.exists()) setIsCompany(!!s.data().isCompany); })
        .catch(() => {});
    });
  }, [currentUser]);

  const jobTypes = [
    { id: 'all',         label: 'All' },
    { id: 'job',         label: 'Jobs' },
    { id: 'freelance',   label: 'Freelance' },
    { id: 'scholarship', label: 'Scholarships' },
    { id: 'grant',       label: 'Grants' },
    { id: 'partnership', label: 'Partnerships' },
  ];

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login', { replace: true, state: { from: '/jobs' } });
    }
  }, [currentUser, authLoading, navigate]);

  useEffect(() => {
    if (authLoading || !currentUser) return;

    // No orderBy in the query so it never depends on a composite index
    // (which may not exist yet on a fresh project). Sort client-side instead.
    const q = query(
      collection(db, 'hub_posts'),
      where('status', 'in', ['active', 'closed'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => {
        const raw = d.data();
        return {
          id: d.id,
          ...raw,
          createdAt: raw.createdAt?.toDate(),
          expiresAt: raw.expiresAt?.toDate(),
        };
      }).filter(p => {
        const notExpired = !p.expiresAt || new Date() < p.expiresAt;
        // Companies only see their own posts (they don't browse others').
        const visibleToMe = !isCompany || p.posterId === currentUser?.uid || p.userId === currentUser?.uid;
        return notExpired && visibleToMe;
      })
      // Newest first, sorted in JS (handles missing createdAt gracefully).
      .sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0));

      setPosts(data);
      setFilteredPosts(data);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching jobs:', err);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser, authLoading, isCompany]);

  useEffect(() => {
    let filtered = [...posts];

    // Category filter
    if (selectedType !== 'all') {
      if (selectedType === 'job') {
        filtered = filtered.filter(p => !p.category || p.category === 'job');
      } else {
        filtered = filtered.filter(p => p.category === selectedType);
      }
    }

    // Location filter
    if (locationFilter.trim()) {
      const loc = locationFilter.toLowerCase().trim();
      filtered = filtered.filter(p =>
        (p.location && p.location.toLowerCase().includes(loc)) ||
        (p.city && p.city.toLowerCase().includes(loc)) ||
        (p.state && p.state.toLowerCase().includes(loc)) ||
        (p.jobType === 'remote' || p.jobType === 'freelance') // remote/freelance: location-agnostic, always show
      );
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.companyName && p.companyName.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'newest') return (b.createdAt || 0) - (a.createdAt || 0);
      if (sortBy === 'oldest') return (a.createdAt || 0) - (b.createdAt || 0);
      if (sortBy === 'expiring') {
        if (!a.expiresAt) return 1;
        if (!b.expiresAt) return -1;
        return a.expiresAt - b.expiresAt;
      }
      return 0;
    });

    setFilteredPosts(filtered);
  }, [posts, selectedType, locationFilter, searchQuery, sortBy]);

  const handlePostClick = async (post) => {
    try {
      await updateDoc(doc(db, 'hub_posts', post.id), { viewCount: (post.viewCount || 0) + 1 });
      if (post.externalLink) {
        await updateDoc(doc(db, 'hub_posts', post.id), { clickCount: (post.clickCount || 0) + 1 });
        window.open(post.externalLink, '_blank');
      }
    } catch (e) { console.error(e); }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this job post?')) return;
    try {
      await updateDoc(doc(db, 'hub_posts', postId), { status: 'deleted', deletedAt: serverTimestamp() });
      toast.success('Post deleted');
    } catch (e) { toast.error('Error deleting post'); }
  };

  const handleMarkClosed = async (postId, currentStatus) => {
    const closing = currentStatus !== 'closed';
    if (!window.confirm(closing ? 'Mark as closed?' : 'Reopen this job?')) return;
    try {
      await updateDoc(doc(db, 'hub_posts', postId), {
        status: closing ? 'closed' : 'active',
        closedAt: closing ? serverTimestamp() : null
      });
      toast.success(closing ? 'Job closed' : 'Job reopened');
    } catch (e) { toast.error('Error updating'); }
  };

  const formatTimeAgo = (date) => {
    if (!date) return '';
    const diff = new Date() - date;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const formatExpiration = (expiresAt) => {
    if (!expiresAt) return 'Open';
    const days = Math.ceil((expiresAt - new Date()) / 86400000);
    if (days < 0) return 'Expired';
    if (days === 0) return 'Closes today';
    if (days === 1) return '1 day left';
    if (days < 7) return `${days} days left`;
    return `Closes ${expiresAt.toLocaleDateString()}`;
  };

  const getTypeBadge = (jobType) => {
    const map = {
      'full-time':  { label: 'Full-time',       cls: 'bg-blue-100 text-gray-900' },
      'part-time':  { label: 'Part-time',       cls: 'bg-blue-100 text-gray-900' },
      'contract':   { label: 'Contract',        cls: 'bg-purple-100 text-gray-900' },
      'freelance':  { label: 'Freelance',       cls: 'bg-blue-100 text-gray-900' },
      'internship': { label: 'Internship',      cls: 'bg-green-100 text-gray-900' },
      'remote':     { label: 'Virtual / Online', cls: 'bg-teal-100 text-gray-900' },
    };
    return map[jobType] || { label: jobType || 'Job', cls: 'bg-orange-100 text-gray-900' };
  };

  const getCategoryBadge = (cat) => {
    const map = {
      'job':         { label: 'Job',         cls: 'bg-orange-100 text-orange-700' },
      'freelance':   { label: 'Freelance',   cls: 'bg-blue-100 text-blue-700' },
      'scholarship': { label: 'Scholarship', cls: 'bg-emerald-100 text-emerald-700' },
      'grant':       { label: 'Grant',       cls: 'bg-violet-100 text-violet-700' },
      'partnership': { label: 'Partnership', cls: 'bg-pink-100 text-pink-700' },
    };
    return map[cat] || map['job'];
  };

  const clearAll = () => {
    setSearchQuery('');
    setLocationFilter('');
    setSelectedType('all');
  };

  const hasActiveFilters = searchQuery || locationFilter || selectedType !== 'all';

  if (authLoading || (currentUser && loading)) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Opportunities...</p>
          </div>
        </div>
      </>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="max-w-6xl mx-auto">

          {/* Hero */}
          <section className="mb-10 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-3 sm:mb-4">Opportunities</h1>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-5 sm:mb-6">Jobs · Freelance · Scholarships · Grants · Partnerships</p>
            {isCompany && (
              <button
                onClick={() => navigate('/jobs/post')}
                className="px-6 py-3 min-h-[44px] bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-lg"
              >
                Post an Opportunity
              </button>
            )}
          </section>

          {/* Job Type Pills */}
          <section className="mb-5">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="relative">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide justify-start sm:justify-center flex-nowrap sm:flex-wrap">
                {jobTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex-shrink-0 ${
                      selectedType === type.id
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              <div className="absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden" />
              </div>
            </div>
          </section>

          {/* Filters Row */}
          <section className="mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3 mb-4">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Search title, company, skills…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none text-sm"
                />

                {/* Location */}
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="City, state, or 'remote'…"
                    value={locationFilter}
                    onChange={e => setLocationFilter(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none text-sm"
                  />
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:border-orange-400 focus:outline-none text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="expiring">Closing Soon</option>
                </select>
              </div>

              {/* Results count */}
              <div className="flex items-center justify-end gap-4 text-sm">
                <span className="text-gray-600">
                  <span className="text-orange-400 font-semibold">{filteredPosts.length}</span> opportunities found
                </span>
                {hasActiveFilters && (
                  <button onClick={clearAll} className="text-orange-400 hover:text-orange-300 font-semibold">
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Job Cards */}
          <section>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {posts.length === 0 ? (isCompany ? 'No jobs posted yet' : 'No jobs available yet') : 'No jobs match your filters'}
                </h3>
                <p className="text-gray-500 mb-8">
                  {posts.length === 0 ? (isCompany ? '' : 'Check back soon for new opportunities.') : 'Try adjusting your filters.'}
                </p>
                {hasActiveFilters && (
                  <button onClick={clearAll} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all">Clear Filters</button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPosts.map(post => {
                  const typeBadge = getTypeBadge(post.jobType);
                  const catBadge = getCategoryBadge(post.category);
                  const showTypeBadge = (!post.category || post.category === 'job' || post.category === 'freelance') && post.jobType;
                  const isOwnPost = post.posterId === currentUser.uid;
                  const isClosed = post.status === 'closed';
                  const expiringSoon = post.expiresAt && (post.expiresAt - new Date()) < 7 * 86400000;

                  return (
                    <div key={post.id} className="group">
                      <div className={`bg-white border rounded-xl p-5 sm:p-6 h-full flex flex-col ${
                        isClosed ? 'border-gray-200 opacity-75' : 'border-gray-200'
                      }`}>

                        {/* Header row */}
                        <div className="flex items-start justify-between mb-3 gap-2">
                          <div className="flex flex-wrap gap-1.5">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${catBadge.cls}`}>
                              {catBadge.label}
                            </span>
                            {showTypeBadge && (
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${typeBadge.cls}`}>
                                {typeBadge.label}
                              </span>
                            )}
                            {post.workAuth === 'provided' || post.workAuthProvided ? (
                              <span className="bg-green-100 text-gray-900 px-2.5 py-1 rounded-lg text-xs font-semibold">Visa/sponsorship provided</span>
                            ) : post.workAuth === 'required' ? (
                              <span className="bg-blue-100 text-gray-900 px-2.5 py-1 rounded-lg text-xs font-semibold">Must be authorized to work</span>
                            ) : post.workAuth === 'not_required' ? (
                              <span className="bg-teal-100 text-gray-900 px-2.5 py-1 rounded-lg text-xs font-semibold">Work authorization not required</span>
                            ) : null}
                            {isClosed && (
                              <span className="bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg text-xs font-semibold">Closed</span>
                            )}
                          </div>
                          {isOwnPost && (
                            <div className="flex gap-1 flex-shrink-0">
                              <button onClick={() => navigate(`/jobs/${post.id}/edit`)}
                                className="text-blue-500 hover:text-blue-600 px-2 py-1 text-xs font-semibold min-h-[44px] flex items-center">
                                Edit
                              </button>
                              <button onClick={() => handleMarkClosed(post.id, post.status)}
                                className={`${isClosed ? 'text-blue-400' : 'text-orange-500'} px-2 py-1 text-xs font-semibold hover:opacity-75 min-h-[44px] flex items-center`}>
                                {isClosed ? 'Reopen' : 'Close'}
                              </button>
                              <button onClick={() => handleDeletePost(post.id)}
                                className="text-red-400 hover:text-red-300 px-2 py-1 text-xs font-semibold min-h-[44px] flex items-center">
                                Delete
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Title & company */}
                        <h3 className={`text-lg font-bold mb-1 line-clamp-2 ${isClosed ? 'text-gray-400' : 'text-gray-900'}`}>
                          {post.title}
                        </h3>
                        {post.companyName && (
                          <p className="text-orange-400 text-sm font-semibold mb-2 truncate">{post.companyName}</p>
                        )}

                        {/* Location + salary */}
                        <div className="flex flex-wrap gap-2 text-xs mb-3">
                          {post.location && (
                            <span className="flex items-center gap-1 text-gray-600">
                              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {post.location}
                            </span>
                          )}
                          {post.salaryRange && (
                            <span className="flex items-center gap-1 text-blue-500">
                              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {post.salaryRange}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className={`text-sm mb-4 line-clamp-3 flex-grow ${isClosed ? 'text-gray-500' : 'text-gray-600'}`}>
                          {post.description}
                        </p>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {post.tags.slice(0, isMobile ? 2 : 3).map((tag, i) => (
                              <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{tag}</span>
                            ))}
                            {post.tags.length > (isMobile ? 2 : 3) && (
                              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                                +{post.tags.length - (isMobile ? 2 : 3)}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="mt-auto pt-4 border-t border-gray-200">
                          <div className="flex justify-between text-xs text-gray-500 mb-3">
                            <span className="truncate max-w-[120px] flex items-center gap-1">{post.posterName}</span>
                            <span className={expiringSoon && !isClosed ? 'text-red-400' : ''}>
                              {formatExpiration(post.expiresAt)}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mb-3">
                            <span>{formatTimeAgo(post.createdAt)}</span>
                            <span>{post.viewCount || 0} views</span>
                          </div>
                          <button
                            onClick={() => !isClosed && handlePostClick(post)}
                            disabled={isClosed}
                            className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${
                              isClosed
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                            }`}
                          >
                            {isClosed ? 'Position Closed' : 'Apply Now →'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        <style jsx>{`select option { background-color: #111; color: white; }`}</style>
      </div>
  );
};

export default Jobs;
