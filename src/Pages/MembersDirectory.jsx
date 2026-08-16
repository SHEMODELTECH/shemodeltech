import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useScrollLock } from '../hooks/useResponsive';

import { 
  collection, 
  query, 
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';
import FollowButton from '../components/community/FollowButton';

const MembersDirectory = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  
  // Lock body scroll when modal is open
  useScrollLock(showMemberModal);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 9;

  const [userCounts, setUserCounts] = useState({});

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login', { 
        replace: true,
        state: { from: '/members', message: 'Please sign in to access the member directory' }
      });
    }
  }, [currentUser, authLoading, navigate]);

  const handleCountUpdate = (countData) => {
    if (countData.targetUserId) {
      setUserCounts(prev => ({
        ...prev,
        [countData.targetUserId]: countData.targetUser
      }));
    }
  };

  // Fetch all users
  useEffect(() => {
    if (authLoading || !currentUser) return;

    const processSnapshot = (snapshot) => {
      const membersData = snapshot.docs.map((userDoc) => {
        try {
          const userData = userDoc.data();
          const email = userData.email;
          if (!email || !email.includes('@')) return null;
          return {
            uid: userDoc.id,
            email,
            name: userData.displayName || email.split('@')[0],
            displayName: userData.displayName || email.split('@')[0],
            photoURL: userData.photoURL || null,
            specialization: userData.specialization || '',
            experienceLevel: userData.experienceLevel || '',
            primarySkillTrack: userData.primarySkillTrack || '',
            city: userData.city || '',
            state: userData.state || '',
            emailPublic: userData.emailPublic || false,
            role: userData.role || 'member',
            joinedDate: userData.createdAt?.toDate?.() || null,
            lastActive: userData.lastLogin?.toDate?.()?.getTime() || userData.createdAt?.toDate?.()?.getTime() || 0,
            isActive: userData.lastLogin?.toDate?.()
              ? userData.lastLogin.toDate().getTime() > (Date.now() - 90 * 24 * 60 * 60 * 1000)
              : false,
          };
        } catch (e) {
          return null;
        }
      }).filter(m => m && m.email);
      setMembers(membersData);
      setFilteredMembers(membersData);
      setLoading(false);
    };

    setLoading(true);
    // Use getDocs with limit instead of onSnapshot on entire users collection
    const fetchMembers = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('lastLogin', 'desc'), limit(100));
        const snapshot = await getDocs(q);
        processSnapshot(snapshot);
      } catch (error) {
        console.error('Members fetch error:', error);
        // Fallback without orderBy if index missing
        try {
          const fallbackQ = query(collection(db, 'users'), limit(100));
          const snapshot = await getDocs(fallbackQ);
          processSnapshot(snapshot);
        } catch (e2) {
          console.error('Members fallback error:', e2);
          toast.error('Failed to load member directory.');
          setLoading(false);
        }
      }
    };
    fetchMembers();
  }, [currentUser, authLoading]);

  // Apply filters
  useEffect(() => {
    let filtered = [...members];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(q) ||
        (member.university && member.university.toLowerCase().includes(q)) ||
        (member.major && member.major.toLowerCase().includes(q)) ||
        (member.city && member.city.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => b.lastActive - a.lastActive);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredMembers(filtered);
    setCurrentPage(1);
  }, [members, searchQuery, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('recent');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredMembers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const goToNextPage = () => { if (currentPage < totalPages) goToPage(currentPage + 1); };
  const goToPrevPage = () => { if (currentPage > 1) goToPage(currentPage - 1); };

  const openMemberModal = (member) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  const closeMemberModal = () => {
    setShowMemberModal(false);
    setSelectedMember(null);
  };

  const copyEmail = async (email) => {
    try {
      if (!currentUser || !email.includes('@')) {
        toast.error('Access denied');
        return;
      }
      await navigator.clipboard.writeText(email);
      toast.success('Email copied!');
    } catch (err) {
      toast.error('Failed to copy email');
    }
  };

  if (authLoading || (currentUser && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
        <div className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 rounded-2xl p-5 sm:p-8 border border-gray-200 text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-900 text-lg">
            {authLoading ? 'Checking authentication...' : 'Loading member directory...'}
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col relative bg-white">

      <main className="flex-grow pb-12 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 py-6 max-w-6xl">
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Members</h1>
            <p className="text-gray-500 text-sm">Discover and connect with tech professionals in the community.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6 max-w-sm">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900">{members.length}</div>
              <div className="text-gray-500 text-xs mt-0.5">Total Members</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900">{members.filter(m => m.isActive).length}</div>
              <div className="text-gray-500 text-xs mt-0.5">Recently Active</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search by name, skill, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:border-pink-500 focus:outline-none"
              >
                <option value="recent">Recently Active</option>
                <option value="name">Name A-Z</option>
              </select>
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                Clear
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              <span className="text-pink-600 font-medium">{filteredMembers.length}</span> members found
              {filteredMembers.length > 0 && (
                <span> -- Showing {startIndex + 1}-{Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length}</span>
              )}
            </p>
          </div>

          {/* Members Grid */}
          <section>
            {filteredMembers.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No members found</h3>
                <p className="text-gray-600">
                  {members.length === 0 
                    ? "Loading member directory..."
                    : "Try adjusting your search to find more members."
                  }
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currentMembers.map((member) => (
                    <div key={member.email} className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-pink-300 hover:shadow-sm transition-all cursor-pointer" onClick={() => openMemberModal(member)}>
                        
                        {/* Avatar */}
                        <div className="relative inline-block mb-3">
                          {member.photoURL ? (
                            <img src={member.photoURL} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 mx-auto" />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-lg mx-auto">
                              {member.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                          )}
                          {member.isActive && (
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-pink-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        
                        {/* Name and info */}
                        <p className="text-gray-900 text-sm font-semibold truncate flex items-center justify-center gap-1">
                          {member.name}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5 truncate">{member.specialization || member.primarySkillTrack || 'Tech Professional'}</p>
                        {(member.city || member.state) && (
                          <p className="text-gray-400 text-xs mt-0.5 truncate">{[member.city, member.state].filter(Boolean).join(', ')}</p>
                        )}
                        
                        {/* Actions */}
                        <div className="flex items-center justify-center gap-2 mt-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/profile/${encodeURIComponent(member.email)}`); }}
                            className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-pink-600 text-white hover:bg-pink-700 transition-all"
                          >
                            View Profile
                          </button>
                          
                          {member.uid !== currentUser.uid && (
                            <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                              <FollowButton
                                targetUser={member}
                                currentUser={currentUser}
                                size="sm"
                                onCountUpdate={handleCountUpdate}
                              />
                            </div>
                          )}
                        </div>

                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={goToPrevPage}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            currentPage === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Previous
                        </button>

                        <div className="flex items-center gap-1">
                          {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                            let pageNum;
                            if (totalPages <= 5) pageNum = index + 1;
                            else if (currentPage <= 3) pageNum = index + 1;
                            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + index;
                            else pageNum = currentPage - 2 + index;

                            if (pageNum < 1 || pageNum > totalPages) return null;

                            return (
                              <button
                                key={pageNum}
                                onClick={() => goToPage(pageNum)}
                                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                                  currentPage === pageNum
                                    ? 'bg-pink-600 text-white'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            currentPage === totalPages
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Next
                        </button>
                    </div>
                    <p className="text-center mt-3 text-gray-500 text-xs">Page {currentPage} of {totalPages}</p>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {/* Member Detail Modal */}
      {showMemberModal && selectedMember && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className="relative mr-5">
                  {selectedMember.photoURL ? (
                    <img 
                      src={selectedMember.photoURL} 
                      alt={`${selectedMember.name}'s profile`}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-pink-400/50"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-pink-500 flex items-center justify-center ring-4 ring-pink-400/50">
                      <span className="text-2xl text-gray-900 font-bold">
                        {selectedMember.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                  {selectedMember.isActive && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-pink-500 rounded-full border-4 border-white flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">{selectedMember.name}</h2>
                  
                  {selectedMember.university && (
                    <p className="text-pink-600 text-sm font-semibold">{selectedMember.university}</p>
                  )}
                  {selectedMember.major && (
                    <p className="text-gray-400 text-sm">{selectedMember.major}</p>
                  )}
                  
                  <div className="flex items-center mt-2">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      selectedMember.isActive ? 'bg-pink-500' : 'bg-gray-400'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      selectedMember.isActive ? 'text-pink-600' : 'text-gray-400'
                    }`}>
                      {selectedMember.isActive ? 'Recently Active' : 'Less Active'}
                    </span>
                  </div>
                  
                  {selectedMember.joinedDate && selectedMember.joinedDate.toLocaleDateString && (
                    <p className="text-gray-400 text-sm mt-1">
                      Member since {selectedMember.joinedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={closeMemberModal}
                className="text-gray-400 hover:text-gray-900 transition-colors text-2xl ml-4"
              >
                ×
              </button>
            </div>

            {/* Member Details */}
            <div className="space-y-6">
              
              {/* Info */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-pink-600 font-semibold mb-4 text-lg">About</h3>
                <div className="space-y-3">
                  {selectedMember.specialization && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Specialization</span>
                      <span className="text-gray-900 font-medium">{selectedMember.specialization}</span>
                    </div>
                  )}
                  {selectedMember.experienceLevel && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Experience Level</span>
                      <span className="text-gray-900 font-medium capitalize">{selectedMember.experienceLevel}</span>
                    </div>
                  )}
                  {selectedMember.primarySkillTrack && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Skill Track</span>
                      <span className="text-gray-900 font-medium">{selectedMember.primarySkillTrack}</span>
                    </div>
                  )}
                  {(selectedMember.city || selectedMember.state) && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location</span>
                      <span className="text-gray-900 font-medium">{[selectedMember.city, selectedMember.state].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                  {!selectedMember.specialization && !selectedMember.experienceLevel && !selectedMember.city && !selectedMember.primarySkillTrack && (
                    <p className="text-gray-500 text-sm text-center py-4">This member hasn't updated their profile details yet.</p>
                  )}
                </div>
              </div>

              {/* Connect Section */}
              <div className="bg-pink-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-pink-600 font-semibold mb-4 text-lg">Connect</h3>
                <p className="text-gray-600 mb-4">
                  Want to connect with {selectedMember.name}? Follow them or view their full profile.
                </p>
                <div className="flex gap-3">
                  {selectedMember.uid !== currentUser.uid && (
                    <div className="flex-1">
                      <FollowButton
                        targetUser={selectedMember}
                        currentUser={currentUser}
                        size="md"
                        onCountUpdate={handleCountUpdate}
                        fullWidth={true}
                      />
                    </div>
                  )}
                  
                  <button
                    onClick={() => { closeMemberModal(); navigate(`/profile/${encodeURIComponent(selectedMember.email)}`); }}
                    className="flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-300 bg-pink-600 text-white hover:bg-pink-700"
                  >
                    View Profile
                  </button>
                </div>

                {/* Email - only shown if member has it set to public */}
                {selectedMember.emailPublic && selectedMember.email && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-xs font-medium mb-0.5">Email</p>
                        <p className="text-gray-900 text-sm">{selectedMember.email}</p>
                      </div>
                      <button
                        onClick={() => copyEmail(selectedMember.email)}
                        className="px-3 py-2 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-100 transition-all"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        select option {
          background-color: white;
          color: #111827;
        }
      `}</style>
    </div>
  );
};

export default MembersDirectory;
