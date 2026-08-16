// src/Pages/MyJobPosts.jsx - FULLY RESPONSIVE WITH UNIVERSAL NAVBAR

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  doc, 
  updateDoc,
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';

const MyJobPosts = () => {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Filter by jobType within job posts only
  const categories = [
    { id: 'all', label: 'All Jobs' },
    { id: 'full-time', label: 'Full-time' },
    { id: 'freelancer', label: 'Freelancer' },
    { id: 'internship', label: 'Internship' },
  ];

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login', { 
        replace: true,
        state: { from: '/jobs/my-posts', message: 'Please sign in to view your posts' }
      });
    }
  }, [currentUser, authLoading, navigate]);

  useEffect(() => {
    if (!currentUser) return;

    // Single where() so no composite index is needed (fresh projects lack them).
    // Exclude 'deleted' and sort client-side.
    const postsQuery = query(
      collection(db, 'hub_posts'),
      where('posterId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        expiresAt: doc.data().expiresAt?.toDate()
      }))
      .filter(p => p.status !== 'deleted')
      .sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0));

      setMyPosts(posts);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching posts:', error);
      toast.error('Error loading your posts');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const filteredPosts = myPosts
    .filter(post => post.category === 'job' || !post.category) // only job posts
    .filter(post => selectedCategory === 'all' || post.jobType === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'views':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'clicks':
          return (b.clickCount || 0) - (a.clickCount || 0);
        default:
          return 0;
      }
    });

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await updateDoc(doc(db, 'hub_posts', postId), {
        status: 'deleted',
        deletedAt: new Date()
      });
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleMarkClosed = async (postId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'closed' ? 'active' : 'closed';
      await updateDoc(doc(db, 'hub_posts', postId), {
        status: newStatus,
        closedAt: newStatus === 'closed' ? new Date() : null
      });
      toast.success(`Post marked as ${newStatus === 'closed' ? 'closed' : 'active'}`);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'Unknown';
    const seconds = Math.floor((new Date() - date) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
      }
    }
    
    return 'Just now';
  };

  const getCategoryBadge = (category) => {
    const categoryInfo = categories.find(cat => cat.id === category);
    return categoryInfo ? categoryInfo.label : category;
  };

  const getStatusBadge = (post) => {
    const now = new Date();
    
    if (post.status === 'closed') {
      return { label: 'Closed', color: 'bg-gray-500', textColor: 'text-white' };
    }
    
    if (post.status === 'expired' || (post.expiresAt && post.expiresAt < now)) {
      return { label: 'Expired', color: 'bg-red-500', textColor: 'text-white' };
    }
    
    if (post.status === 'active') {
      return { label: 'Active', color: 'bg-blue-500', textColor: 'text-white' };
    }
    
    return { label: 'Unknown', color: 'bg-gray-500', textColor: 'text-white' };
  };

  if (authLoading || !currentUser) {
    return (
      <>
        <Navbar />
        <div 
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: '#000000' }}
        >
          <div className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 rounded-xl xs:rounded-2xl p-6 xs:p-7 sm:p-8 border border-white/20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-white text-base xs:text-lg">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen overflow-x-hidden flex flex-col relative"
        style={{ backgroundColor: '#000000' }}
      >
    
        <main className="flex-grow pt-16 xs:pt-18 sm:pt-20">
          <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-6 xs:py-8 sm:py-12 max-w-7xl">
            
            {/* Hero Section */}
            <section className="text-center mb-8 xs:mb-10 sm:mb-12">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black mb-3 xs:mb-4 sm:mb-6"
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #ffffff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 40px rgba(255,255,255,0.3)',
                    filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.9))'
                  }}>
                My{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-500 to-orange-500">
                  Job Posts
                </span>
              </h1>
              <p className="text-sm xs:text-base sm:text-lg text-gray-700 mb-4 xs:mb-5 sm:mb-6 px-2">
                Manage your job listings
              </p>
              
              {/* Stats */}
              <div className="flex justify-center gap-4 xs:gap-5 sm:gap-6 mb-6 xs:mb-7 sm:mb-8">
                <div className="text-center">
                  <div className="text-2xl xs:text-3xl font-bold text-blue-400">{myPosts.length}</div>
                  <div className="text-gray-400 text-xs xs:text-sm">Total Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl xs:text-3xl font-bold text-blue-400">
                    {myPosts.filter(p => p.status === 'active').length}
                  </div>
                  <div className="text-gray-400 text-xs xs:text-sm">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl xs:text-3xl font-bold text-orange-400">
                    {myPosts.reduce((sum, p) => sum + (p.viewCount || 0), 0)}
                  </div>
                  <div className="text-gray-400 text-xs xs:text-sm">Total Views</div>
                </div>
              </div>
            </section>

            {/* Filters */}
            <section className="mb-6 xs:mb-7 sm:mb-8">
              <div className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 border border-white/20">
                
                {/* Category Filter - centered */}
                <div className="mb-4 xs:mb-5 sm:mb-6 text-center">
                  <h3 className="text-white font-semibold mb-2 xs:mb-3 text-sm xs:text-base">Filter by Category</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 xs:px-4 py-2 rounded-lg font-medium transition-all text-xs xs:text-sm min-h-[44px] ${
                          selectedCategory === cat.id
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-white/10 text-gray-600 hover:bg-white/20 active:bg-white/30'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort - centered dropdown */}
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-2 xs:mb-3 text-sm xs:text-base">Sort By</h3>
                  <div className="flex justify-center">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2.5 text-sm font-medium min-h-[44px] min-w-[180px] cursor-pointer hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px', paddingRight: '36px' }}
                    >
                      <option value="newest" className="bg-gray-900 text-white">Newest</option>
                      <option value="oldest" className="bg-gray-900 text-white">Oldest</option>
                      <option value="views" className="bg-gray-900 text-white">Most Views</option>
                      <option value="clicks" className="bg-gray-900 text-white">Most Clicks</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Posts List */}
            <section>
              {loading ? (
                <div className="text-center py-12 xs:py-14 sm:py-16">
                  <div className="animate-spin rounded-full h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
                  <p className="text-white text-base xs:text-lg">Loading your posts...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12 xs:py-14 sm:py-16">
                  <h3 className="text-xl xs:text-2xl font-bold text-white mb-3 xs:mb-4">No Posts Found</h3>
                  <p className="text-gray-400 mb-6 xs:mb-7 sm:mb-8 text-sm xs:text-base px-3">
                    {selectedCategory === 'all' 
                      ? "You haven't posted any jobs yet"
                      : `No ${getCategoryBadge(selectedCategory)} posts found`}
                  </p>
                  <Link
                    to="/hub/post"
                    className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 xs:px-7 sm:px-8 py-2.5 xs:py-3 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 active:from-orange-700 active:to-orange-800 transition-all text-sm xs:text-base min-h-[44px]"
                  >
                    Post a Job
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
                  {filteredPosts.map(post => {
                    const statusBadge = getStatusBadge(post);
                    
                    return (
                      <div
                        key={post.id}
                        className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 border border-white/20 hover:border-blue-400/40 transition-all"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3 xs:mb-4 gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="px-2.5 xs:px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs xs:text-sm font-semibold whitespace-nowrap">
                                {getCategoryBadge(post.category)}
                              </span>
                              <span className={`px-2.5 xs:px-3 py-1 ${statusBadge.color} ${statusBadge.textColor} rounded-full text-xs xs:text-sm font-semibold whitespace-nowrap`}>
                                {statusBadge.label}
                              </span>
                            </div>
                            <h3 className="text-lg xs:text-xl font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
                            <p className="text-gray-600 text-xs xs:text-sm line-clamp-2">{post.description}</p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 xs:gap-4 mb-3 xs:mb-4 text-xs xs:text-sm text-gray-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {post.viewCount || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            </svg>
                            {post.clickCount || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatTimeAgo(post.createdAt)}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-wrap">
                          <a
                            href={post.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-3 xs:px-4 py-2 rounded-lg font-semibold text-center transition-all text-xs xs:text-sm min-h-[44px] flex items-center justify-center"
                          >
                            View Link
                          </a>
                          <button
                            onClick={() => handleMarkClosed(post.id, post.status)}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-3 xs:px-4 py-2 rounded-lg font-semibold transition-all text-xs xs:text-sm min-h-[44px]"
                          >
                            {post.status === 'closed' ? 'Reopen' : 'Close'}
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-3 xs:px-4 py-2 rounded-lg font-semibold transition-all text-xs xs:text-sm min-h-[44px]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </main>

        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
          
          * {
            font-family: 'Inter', sans-serif;
          }
          
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(34, 197, 94, 0.5);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(34, 197, 94, 0.7);
          }
        `}</style>
      </div>
    </>
  );
};

export default MyJobPosts;
