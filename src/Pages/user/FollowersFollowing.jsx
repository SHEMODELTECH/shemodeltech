// src/Pages/user/FollowersFollowing.jsx - FULLY RESPONSIVE WITH UNIVERSAL NAVBAR

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';

import { 
  followUser, 
  unfollowUser, 
  getFollowingStatusForUsers, 
  handleFollowToggle 
} from '../../utils/followSystem';

const FollowersFollowing = () => {
  const { userEmail } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isFollowersPage = location.pathname.includes('/followers');
  const isFollowingPage = location.pathname.includes('/following');
  const isMembersPage = !userEmail || location.pathname.includes('/members');
  
  const [activeTab, setActiveTab] = useState(
    isFollowersPage ? 'followers' : 
    isFollowingPage ? 'following' : 
    'members'
  );
  
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [followingStatus, setFollowingStatus] = useState({});
  const [actionLoading, setActionLoading] = useState({});

  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadgeCategory, setSelectedBadgeCategory] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [minProjects, setMinProjects] = useState(0);
  const [minBadges, setMinBadges] = useState(0);
  const [sortBy, setSortBy] = useState('recent');
  const [showOnlyBadgedUsers, setShowOnlyBadgedUsers] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [totalFollowing, setTotalFollowing] = useState(0);
  const [loadingPage, setLoadingPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const USERS_PER_PAGE = 20;
  const usersPerPage = 9;
  
  const decodedEmail = userEmail ? decodeURIComponent(userEmail) : null;

  const badgeCategories = {
    'mentorship': { 
      name: 'TechPO',
      color: 'text-orange-500', 
      bgColor: 'from-orange-500/20 to-orange-600/20',
      skills: ['Mentorship', 'Leadership', 'Technical Coaching', 'Team Development']
    },
    'quality-assurance': { 
      name: 'TechQA',
      color: 'text-blue-600', 
      bgColor: 'from-blue-500/20 to-blue-600/20',
      skills: ['Quality Assurance', 'Testing', 'Bug Detection', 'Test Automation']
    },
    'development': { 
      name: 'TechDev',
      color: 'text-blue-600', 
      bgColor: 'from-blue-500/20 to-blue-600/20',
      skills: ['Programming', 'Software Development', 'Code Review', 'Debugging']
    },
    'leadership': { 
      name: 'TechLeads',
      color: 'text-blue-600', 
      bgColor: 'from-blue-500/20 to-blue-600/20',
      skills: ['Project Management', 'Leadership', 'Strategic Planning', 'Team Coordination']
    },
    'design': { 
      name: 'TechArchs',
      color: 'text-blue-600', 
      bgColor: 'from-blue-500/20 to-blue-600/20',
      skills: ['No-Code Development', 'UI/UX Design', 'Visual Design', 'Platform Architecture']
    },
    'security': { 
      name: 'TechGuard',
      color: 'text-red-400', 
      bgColor: 'from-red-500/20 to-red-600/20',
      skills: ['Cybersecurity', 'Network Security', 'Cloud Administration', 'DevOps']
    }
  };

  const allSkills = Object.values(badgeCategories).flatMap(cat => cat.skills);
  const uniqueSkills = [...new Set(allSkills)].sort();

  const showSuccessMessage = (message) => toast.success(message);
  const showWarningMessage = (message) => toast.warn(message);
  const showErrorMessage = (message) => toast.error(message);

  const handleFollowToggleLocal = async (userId, isCurrentlyFollowing) => {
    if (!currentUser) {
      showWarningMessage('Please log in to follow users');
      return;
    }

    if (currentUser.uid === userId) {
      showWarningMessage("You can't follow yourself!");
      return;
    }

    setActionLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      const user = [...followers, ...following, ...members].find(u => u.uid === userId);
      
      const success = await handleFollowToggle(
        currentUser,
        userId,
        isCurrentlyFollowing,
        user,
        (targetUserId, newStatus) => {
          setFollowingStatus(prev => ({ ...prev, [targetUserId]: newStatus }));
          
          if (activeTab === 'following' && !newStatus) {
            setFollowing(prev => prev.filter(user => user.uid !== targetUserId));
            setTotalFollowing(prev => Math.max(0, prev - 1));
          }
        }
      );
      
      if (!success) {
        console.log('Follow/unfollow operation failed');
      }
      
    } catch (error) {
      console.error('Error in follow toggle:', error);
      showWarningMessage('Unable to update follow status. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const loadFollowingStatus = async () => {
    if (!currentUser) {
      setFollowingStatus({});
      return;
    }

    try {
      const allUserIds = [
        ...followers.map(user => user.uid),
        ...following.map(user => user.uid),
        ...members.map(member => member.uid)
      ].filter(Boolean);

      if (allUserIds.length > 0) {
        const statusMap = await getFollowingStatusForUsers(currentUser, allUserIds);
        setFollowingStatus(statusMap);
      }
    } catch (error) {
      console.error('Error loading following status:', error);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleUserClick = (user) => {
    try {
      if (user.email) {
        const encodedEmail = encodeURIComponent(user.email);
        navigate(`/profile/${encodedEmail}`);
      } else {
        toast.warn('Unable to view profile - missing user information');
      }
    } catch (error) {
      console.error('Error navigating to user profile:', error);
      toast.error('Unable to view user profile');
    }
  };

  const fetchMembersDirectory = async () => {
    if (!currentUser) return;

    setLoadingPage(true);
    
    try {
      const usersQuery = query(collection(db, 'users'), limit(500));
      const usersSnapshot = await getDocs(usersQuery);

      if (usersSnapshot.size === 0) {
        setMembers([]);
        setFilteredMembers([]);
        setLoadingPage(false);
        return;
      }

      const badgesQuery = query(collection(db, 'member_badges'), limit(2000));
      const badgesSnapshot = await getDocs(badgesQuery);
      
      const badgesByMember = {};
      badgesSnapshot.docs.forEach(doc => {
        try {
          const badge = { id: doc.id, ...doc.data() };
          const email = badge.memberEmail;
          
          if (email) {
            if (!badgesByMember[email]) {
              badgesByMember[email] = [];
            }
            badgesByMember[email].push({
              ...badge,
              awardedAt: badge.awardedAt && typeof badge.awardedAt.toDate === 'function' 
                ? badge.awardedAt.toDate() 
                : badge.awardedAt instanceof Date 
                ? badge.awardedAt 
                : new Date()
            });
          }
        } catch (badgeError) {
          console.warn('Error processing badge:', doc.id, badgeError);
        }
      });

      const membersData = await Promise.all(
        usersSnapshot.docs.map(async (userDoc) => {
          try {
            const userData = userDoc.data();
            const email = userData.email;
            
            if (!email || !email.includes('@')) {
              return null;
            }

            if (userDoc.id === currentUser.uid) {
              return null;
            }

            let memberInfo = {
              uid: userDoc.id,
              email,
              name: userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || email.split('@')[0],
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              displayName: userData.displayName || '',
              photoURL: userData.photoURL || null,
              joinedDate: userData.createdAt && typeof userData.createdAt.toDate === 'function' 
                ? userData.createdAt.toDate() 
                : userData.createdAt instanceof Date 
                ? userData.createdAt 
                : null,
              lastLogin: userData.lastLogin && typeof userData.lastLogin.toDate === 'function'
                ? userData.lastLogin.toDate()
                : userData.lastLogin instanceof Date
                ? userData.lastLogin
                : null,
              profile: userData.profile || {}
            };

            const projectsQuery = query(
              collection(db, 'group_members'),
              where('userEmail', '==', email)
            );
            const projectsSnapshot = await getDocs(projectsQuery);
            
            const projectHistory = [];
            for (const membershipDoc of projectsSnapshot.docs) {
              const membershipData = membershipDoc.data();
              
              try {
                const groupDoc = await getDoc(doc(db, 'groups', membershipData.groupId));
                if (groupDoc.exists()) {
                  const groupData = groupDoc.data();
                  projectHistory.push({
                    id: membershipDoc.id,
                    ...membershipData,
                    projectTitle: groupData.projectTitle || 'Untitled Project',
                    projectDescription: groupData.description || '',
                    projectStatus: groupData.status || 'active'
                  });
                }
              } catch (projectError) {
                console.error(`Error fetching project ${membershipData.groupId}:`, projectError);
              }
            }

            const certificatesQuery = query(
              collection(db, 'certificates'),
              where('recipientEmail', '==', email)
            );
            const certificatesSnapshot = await getDocs(certificatesQuery);
            const certificates = certificatesSnapshot.docs.length;

            const badges = badgesByMember[email] || [];
            const badgesByCategory = badges.reduce((acc, badge) => {
              const category = badge.badgeCategory || 'other';
              acc[category] = (acc[category] || 0) + 1;
              return acc;
            }, {});

            const completedProjects = projectHistory.filter(p => 
              p.status === 'completed' || p.projectStatus === 'completed'
            ).length;
            
            const adminProjects = projectHistory.filter(p => p.role === 'admin').length;
            
            const memberScore = Math.min(100, 
              (badges.length * 8) + 
              (certificates * 12) + 
              (completedProjects * 6) + 
              (adminProjects * 15) +
              (projectHistory.length * 2)
            );

            const memberSkills = new Set();
            badges.forEach(badge => {
              const category = badgeCategories[badge.badgeCategory];
              if (category) {
                category.skills.forEach(skill => memberSkills.add(skill));
              }
            });

            if (memberSkills.size === 0) {
              memberSkills.add('Software Development');
              memberSkills.add('Problem Solving');
            }

            const lastActive = Math.max(
              memberInfo.lastLogin ? memberInfo.lastLogin.getTime() : 0,
              badges.length > 0 ? Math.max(...badges.map(b => {
                if (b.awardedAt && typeof b.awardedAt.getTime === 'function') {
                  return b.awardedAt.getTime();
                }
                return 0;
              })) : 0,
              projectHistory.length > 0 ? Math.max(...projectHistory.map(p => {
                if (p.joinedAt && typeof p.joinedAt.getTime === 'function') {
                  return p.joinedAt.getTime();
                }
                return 0;
              })) : 0,
              memberInfo.joinedDate ? memberInfo.joinedDate.getTime() : Date.now() - (365 * 24 * 60 * 60 * 1000)
            );

            const topBadgeCategory = Object.entries(badgesByCategory)
              .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

            const getUserStatus = () => {
              if (badges.length >= 5) return 'veteran';
              if (badges.length >= 1) return 'achiever';
              if (projectHistory.length >= 1) return 'participant';
              return 'newcomer';
            };

            const userStatus = getUserStatus();

            return {
              ...memberInfo,
              badges: badges.length,
              certificates,
              totalProjects: projectHistory.length,
              completedProjects,
              adminProjects,
              badgesByCategory,
              memberScore,
              skills: Array.from(memberSkills),
              lastActive,
              topBadgeCategory,
              detailedBadges: badges.slice(0, 10),
              projectHistory: projectHistory.slice(0, 10),
              userStatus,
              isActive: lastActive > (Date.now() - (90 * 24 * 60 * 60 * 1000)),
              hasAchievements: badges.length > 0 || certificates > 0 || completedProjects > 0
            };
          } catch (memberError) {
            console.error(`Error processing member ${userDoc.id}:`, memberError);
            return null;
          }
        })
      );

      const validMembers = membersData.filter(member => member && member.email);
      
      setMembers(validMembers);
      setFilteredMembers(validMembers);
    } catch (error) {
      console.error('Error fetching members directory:', error);
      toast.error('Failed to load members directory');
      setMembers([]);
      setFilteredMembers([]);
    } finally {
      setLoadingPage(false);
    }
  };

  const fetchUserData = async () => {
    if (!decodedEmail) return;
    
    try {
      setLoading(true);

      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', decodedEmail)
      );
      
      const usersSnapshot = await getDocs(usersQuery);
      
      if (usersSnapshot.empty) {
        toast.error('User not found');
        navigate('/community');
        return;
      }

      const userDoc = usersSnapshot.docs[0];
      const userData = userDoc.data();
      const userId = userDoc.id;

      setUserProfile({
        uid: userId,
        ...userData
      });

      const followersIds = userData.followers || [];
      const followingIds = userData.following || [];
      
      setTotalFollowers(followersIds.length);
      setTotalFollowing(followingIds.length);

      if (currentUser) {
        const currentUserDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (currentUserDoc.exists()) {
          const currentUserData = currentUserDoc.data();
          const currentUserFollowing = currentUserData.following || [];
          
          const statusMap = {};
          [...followersIds, ...followingIds].forEach(userId => {
            statusMap[userId] = currentUserFollowing.includes(userId);
          });
          setFollowingStatus(statusMap);
        }
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaginatedUsers = async (tab, page) => {
    if (!userProfile || tab === 'members') return;

    setLoadingPage(true);
    
    try {
      const isFollowersTab = tab === 'followers';
      const userIds = isFollowersTab 
        ? (userProfile.followers || [])
        : (userProfile.following || []);

      const startIndex = (page - 1) * USERS_PER_PAGE;
      const endIndex = startIndex + USERS_PER_PAGE;
      const paginatedUserIds = userIds.slice(startIndex, endIndex);

      if (paginatedUserIds.length === 0) {
        if (isFollowersTab) {
          setFollowers([]);
        } else {
          setFollowing([]);
        }
        setLoadingPage(false);
        return;
      }

      const allUsers = [];
      const batchSize = 10;
      
      for (let i = 0; i < paginatedUserIds.length; i += batchSize) {
        const batch = paginatedUserIds.slice(i, i + batchSize);
        
        try {
          const usersQuery = query(
            collection(db, 'users'),
            where('uid', 'in', batch)
          );
          
          const usersSnapshot = await getDocs(usersQuery);
          const batchUsers = usersSnapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
          }));
          
          allUsers.push(...batchUsers);
        } catch (batchError) {
          console.error('Error fetching user batch:', batchError);
        }
      }

      const sortedUsers = paginatedUserIds.map(id => 
        allUsers.find(user => user.uid === id)
      ).filter(Boolean);

      if (isFollowersTab) {
        setFollowers(sortedUsers);
      } else {
        setFollowing(sortedUsers);
      }

    } catch (error) {
      console.error('Error fetching paginated users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'members') {
      loadFollowingStatus().then(() => {
        fetchMembersDirectory();
      }).catch((err) => {
        console.error('Error loading members:', err);
        setLoading(false);
      });
      setLoading(false);
    } else if (decodedEmail) {
      fetchUserData();
    }
  }, [decodedEmail, currentUser, activeTab]);

  useEffect(() => {
    if (activeTab === 'members') {
      return;
    } else if (userProfile) {
      fetchPaginatedUsers(activeTab, currentPage);
    }
  }, [userProfile, activeTab, currentPage]);

  useEffect(() => {
    loadFollowingStatus();
  }, [followers, following, members, currentUser]);

  useEffect(() => {
    if (activeTab === 'members') {
      let filtered = [...members];

      if (showOnlyBadgedUsers) {
        filtered = filtered.filter(member => member.hasAchievements);
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(member => 
          member.name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query) ||
          member.skills.some(skill => skill.toLowerCase().includes(query))
        );
      }

      if (selectedBadgeCategory !== 'all') {
        filtered = filtered.filter(member => 
          member.badgesByCategory[selectedBadgeCategory] > 0
        );
      }

      if (selectedSkill) {
        filtered = filtered.filter(member => 
          member.skills.includes(selectedSkill)
        );
      }

      if (minProjects > 0) {
        filtered = filtered.filter(member => 
          member.totalProjects >= minProjects
        );
      }

      if (minBadges > 0) {
        filtered = filtered.filter(member => 
          member.badges >= minBadges
        );
      }

      switch (sortBy) {
        case 'badges':
          filtered.sort((a, b) => b.badges - a.badges);
          break;
        case 'projects':
          filtered.sort((a, b) => b.totalProjects - a.totalProjects);
          break;
        case 'recent':
          filtered.sort((a, b) => b.lastActive - a.lastActive);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'score':
          filtered.sort((a, b) => b.memberScore - a.memberScore);
          break;
        default:
          break;
      }

      setFilteredMembers(filtered);
      setCurrentPage(1);
    } else {
      const users = activeTab === 'followers' ? followers : following;
      
      if (!searchTerm.trim()) {
        setFilteredUsers(users);
        return;
      }

      const filtered = users.filter(user => {
        const name = user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}`
          : user.displayName || '';
        const email = user.email || '';
        const title = user.profile?.title || '';
        
        const searchLower = searchTerm.toLowerCase();
        return (
          name.toLowerCase().includes(searchLower) ||
          email.toLowerCase().includes(searchLower) ||
          title.toLowerCase().includes(searchLower)
        );
      });

      setFilteredUsers(filtered);
    }
  }, [members, followers, following, activeTab, searchQuery, selectedBadgeCategory, selectedSkill, minProjects, minBadges, sortBy, showOnlyBadgedUsers, searchTerm]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm('');
    setSearchQuery('');
    setShowFilters(false);
    
    if (tab === 'members') {
      setSelectedBadgeCategory('all');
      setSelectedSkill('');
      setMinProjects(0);
      setMinBadges(0);
      setSortBy('recent');
      setShowOnlyBadgedUsers(false);
    }
    
    if (tab === 'members') {
      navigate('/members', { replace: true });
    } else if (decodedEmail) {
      const newPath = `/profile/${encodeURIComponent(decodedEmail)}/${tab}`;
      navigate(newPath, { replace: true });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBadgeCategory('all');
    setSelectedSkill('');
    setMinProjects(0);
    setMinBadges(0);
    setSortBy('recent');
    setShowOnlyBadgedUsers(false);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (activeTab === 'members') return;
    
    const totalPages = getTotalPages();
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setSearchTerm('');
    }
  };

  const getTotalPages = () => {
    if (activeTab === 'members') return Math.ceil(filteredMembers.length / usersPerPage);
    const total = activeTab === 'followers' ? totalFollowers : totalFollowing;
    return Math.ceil(total / USERS_PER_PAGE);
  };

  const getCurrentUsers = () => {
    if (activeTab === 'members') {
      return filteredMembers;
    }
    return searchTerm.trim() ? filteredUsers : (activeTab === 'followers' ? followers : following);
  };

  const FollowButton = ({ targetUser, isFollowing, size = 'sm' }) => {
    const loading = actionLoading[targetUser.uid];

    const sizeClasses = {
      xs: 'px-2 xs:px-2.5 py-1.5 xs:py-2 text-xs min-w-[60px] xs:min-w-[70px]',
      sm: 'px-2.5 xs:px-3 py-2 xs:py-2.5 text-xs xs:text-sm min-w-[70px] xs:min-w-[80px]',
      md: 'px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-sm xs:text-base min-w-[80px] xs:min-w-[100px]'
    };

    if (!currentUser || currentUser.uid === targetUser.uid) return null;

    return (
      <button
        onClick={() => handleFollowToggleLocal(targetUser.uid, isFollowing)}
        disabled={loading}
        className={`${sizeClasses[size]} rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 min-h-[44px] ${
          isFollowing
            ? 'bg-gray-500/20 text-gray-600 border border-gray-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 active:bg-red-500/30'
            : 'bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 active:from-orange-700 active:to-blue-800 text-gray-900'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-1">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
            <span className="hidden xs:inline">...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-1">
            {isFollowing ? (
              <>
                <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden xs:inline">Following</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden xs:inline">Follow</span>
              </>
            )}
          </span>
        )}
      </button>
    );
  };

  const UserCard = ({ user }) => (
    <div className="bg-gray-100 rounded-lg xs:rounded-xl border border-gray-200 p-3 xs:p-4 sm:p-5">
      <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
        <button
          onClick={() => handleUserClick(user)}
          className="relative flex-shrink-0 group active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-gray-900 font-bold shadow-lg cursor-pointer">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" loading="lazy" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs xs:text-sm sm:text-base md:text-lg font-bold">
                {user.firstName && user.lastName 
                  ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                  : user.initials || user.displayName?.charAt(0)?.toUpperCase() || 'U'
                }
              </span>
            )}
          </div>
          
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 bg-blue-600 rounded-full border-2 border-gray-900"></div>
        </button>
        
        <div className="flex-1 min-w-0">
          <button
            onClick={() => handleUserClick(user)}
            className="text-left w-full group active:scale-[0.98] transition-transform"
          >
            <h3 className="font-bold text-gray-900 text-xs xs:text-sm sm:text-base md:text-lg truncate group-hover:text-orange-400 transition-colors">
              {user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user.displayName || 'Professional User'
              }
            </h3>
            {user.profile?.title && (
              <p className="text-blue-600 text-[10px] xs:text-xs sm:text-sm truncate">
                {user.profile.title}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-1 xs:gap-1.5 sm:gap-2 text-[10px] xs:text-xs text-gray-400 mt-0.5 xs:mt-1">
              {user.followerCount > 0 && (
                <span>{user.followerCount} followers</span>
              )}
              {user.postCount > 0 && (
                <>
                  {user.followerCount > 0 && <span>•</span>}
                  <span>{user.postCount} posts</span>
                </>
              )}
              {user.profile?.company && (
                <>
                  {(user.followerCount > 0 || user.postCount > 0) && <span className="hidden sm:inline">•</span>}
                  <span className="truncate max-w-[100px] sm:max-w-none">{user.profile.company}</span>
                </>
              )}
            </div>
          </button>
        </div>
        
        <div className="flex-shrink-0">
          <FollowButton
            targetUser={user}
            isFollowing={followingStatus[user.uid] || false}
            size={isMobile ? "xs" : "sm"}
          />
        </div>
      </div>
    </div>
  );

  const MemberCard = ({ member }) => {
    const topCategory = member.topBadgeCategory ? badgeCategories[member.topBadgeCategory] : null;
    
    return (
      <div className="group">
        <div className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 border border-gray-200 shadow-2xl h-full flex flex-col">
          
          <div className="flex items-center mb-3 xs:mb-4 sm:mb-6">
            <div className="relative flex-shrink-0 mr-2 xs:mr-3 sm:mr-4">
              <button
                onClick={() => handleUserClick(member)}
                className="relative group active:scale-95 transition-transform"
              >
                {member.photoURL ? (
                  <img 
                    src={member.photoURL} 
                    alt={`${member.name}'s profile`} loading="lazy"
                    className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 xs:ring-3 sm:ring-4 ring-blue-400/50"
                  />
                ) : (
                  <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-orange-500 to-blue-500 flex items-center justify-center ring-2 xs:ring-3 sm:ring-4 ring-blue-400/50">
                    <span className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-900 font-bold">
                      {member.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                {member.isActive && (
                  <div className="absolute -bottom-0.5 -right-0.5 xs:-bottom-1 xs:-right-1 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            </div>
            
            <div className="flex-grow min-w-0">
              <button
                onClick={() => handleUserClick(member)}
                className="text-left group w-full active:scale-[0.98] transition-transform"
              >
                <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-black text-gray-900 group-hover:text-orange-400 transition-colors duration-300 truncate">
                  {member.name}
                </h3>
                
                {topCategory && (
                  <div className="flex items-center mt-0.5 xs:mt-1 sm:mt-2">
                    <svg className={`w-3 h-3 xs:w-4 xs:h-4 ${topCategory.color} mr-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span className="text-[10px] xs:text-xs text-gray-600 truncate">{topCategory.name}</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 xs:gap-2 sm:gap-3 mb-3 xs:mb-4 sm:mb-6">
            <div className="bg-orange-500/10 rounded-md xs:rounded-lg p-1.5 xs:p-2 sm:p-3 text-center border border-orange-500/20">
              <div className="text-sm xs:text-base sm:text-lg font-bold text-orange-500">{member.badges}</div>
              <div className="text-[10px] xs:text-xs text-orange-500">Badges</div>
            </div>
            <div className="bg-blue-600/10 rounded-md xs:rounded-lg p-1.5 xs:p-2 sm:p-3 text-center border border-gray-200">
              <div className="text-sm xs:text-base sm:text-lg font-bold text-blue-600">{member.totalProjects}</div>
              <div className="text-[10px] xs:text-xs text-blue-500">Projects</div>
            </div>
            <div className="bg-blue-600/10 rounded-md xs:rounded-lg p-1.5 xs:p-2 sm:p-3 text-center border border-blue-600/20">
              <div className="text-sm xs:text-base sm:text-lg font-bold text-blue-600">{member.memberScore}</div>
              <div className="text-[10px] xs:text-xs text-blue-500">Score</div>
            </div>
          </div>

          <div className="mb-3 xs:mb-4 sm:mb-6 flex-grow">
            <div className="text-gray-400 text-xs xs:text-sm mb-1.5 xs:mb-2">Skills:</div>
            <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2">
              {member.skills.slice(0, isMobile ? 2 : 3).map((skill, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-600 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded xs:rounded-md sm:rounded-lg text-[10px] xs:text-xs border border-gray-200 truncate">
                  {skill}
                </span>
              ))}
              {member.skills.length > (isMobile ? 2 : 3) && (
                <span className="bg-gray-100 text-gray-600 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded xs:rounded-md sm:rounded-lg text-[10px] xs:text-xs border border-gray-200">
                  +{member.skills.length - (isMobile ? 2 : 3)}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-1.5 xs:gap-2">
            <button
              onClick={() => handleUserClick(member)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-gray-900 px-2 xs:px-3 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 transition-all duration-300 text-[10px] xs:text-xs sm:text-sm min-h-[44px] flex items-center justify-center"
            >
              <svg className="w-3 h-3 xs:w-4 xs:h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden xs:inline">View Profile</span>
              <span className="xs:hidden">View</span>
            </button>
            <FollowButton
              targetUser={member}
              isFollowing={followingStatus[member.uid] || false}
              size={isMobile ? "xs" : "sm"}
            />
          </div>
        </div>
      </div>
    );
  };

  const PaginationControls = () => {
    if (activeTab === 'members') return null;
    
    const totalPages = getTotalPages();
    const total = activeTab === 'followers' ? totalFollowers : totalFollowing;
    
    if (totalPages <= 1) return null;

    return (
      <div className="mt-6 xs:mt-7 sm:mt-8 flex flex-col items-center gap-3 xs:gap-4">
        <div className="text-gray-400 text-xs xs:text-sm text-center px-4">
          Showing {((currentPage - 1) * USERS_PER_PAGE) + 1} - {Math.min(currentPage * USERS_PER_PAGE, total)} of {total} users
        </div>
        
        <div className="flex items-center gap-2 xs:gap-3 px-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loadingPage}
            className="px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 bg-gray-100 border border-gray-200 text-gray-900 rounded-lg xs:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 active:bg-white/40 transition-colors text-xs xs:text-sm min-h-[44px] flex items-center gap-1"
          >
            <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden xs:inline">Previous</span>
          </button>
          
          <span className="px-2 xs:px-3 sm:px-4 py-2 text-gray-900 text-xs xs:text-sm">
            <span className="hidden sm:inline">Page </span>{currentPage}<span className="hidden sm:inline"> of {totalPages}</span>
            <span className="sm:hidden">/{totalPages}</span>
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loadingPage}
            className="px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 bg-gray-100 border border-gray-200 text-gray-900 rounded-lg xs:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 active:bg-white/40 transition-colors text-xs xs:text-sm min-h-[44px] flex items-center gap-1"
          >
            <span className="hidden xs:inline">Next</span>
            <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const getMembersPageData = () => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const currentMembers = filteredMembers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredMembers.length / usersPerPage);
    
    return { currentMembers, totalPages, startIndex, endIndex };
  };

  if (loading) {
    return (
      <>
        
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-3 xs:px-4">
          <div className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 rounded-xl xs:rounded-2xl p-6 xs:p-7 sm:p-8 border border-gray-200 text-center max-w-sm w-full">
            <div className="animate-spin rounded-full h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-900 text-sm xs:text-base sm:text-lg">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">

        <main className=" pb-12 xs:pb-14 sm:pb-16">
          <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-4 xs:py-6 sm:py-8 max-w-7xl">
            
            {userProfile && activeTab !== 'members' && (
              <section className="mb-4 xs:mb-5 sm:mb-6 md:mb-8">
                <div className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 border border-gray-200">
                  <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 md:gap-6 mb-3 xs:mb-4 sm:mb-6">
                    <button
                      onClick={() => handleUserClick(userProfile)}
                      className="relative flex-shrink-0 group active:scale-95 transition-transform"
                    >
                      <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-gray-900 font-bold shadow-lg cursor-pointer">
                        {userProfile?.photoURL ? (
                          <img 
                            src={userProfile.photoURL} 
                            alt="Profile" loading="lazy" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold">
                            {userProfile?.firstName && userProfile?.lastName 
                              ? `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}`.toUpperCase()
                              : userProfile?.initials || userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'
                            }
                          </span>
                        )}
                      </div>
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => handleUserClick(userProfile)}
                        className="text-left group w-full active:scale-[0.98] transition-transform"
                      >
                        <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-gray-900 mb-1 xs:mb-2 group-hover:text-orange-400 transition-colors truncate" 
                            style={{
                              textShadow: '0 0 20px rgba(255,255,255,0.3), 2px 2px 4px rgba(0,0,0,0.9)',
                              fontFamily: '"Inter", sans-serif'
                            }}>
                          {userProfile?.firstName && userProfile?.lastName 
                            ? `${userProfile.firstName} ${userProfile.lastName}`
                            : userProfile?.displayName || 'Professional User'
                          }
                        </h1>
                      </button>
                      {userProfile?.profile?.title && (
                        <p className="text-blue-600 text-xs xs:text-sm sm:text-base md:text-lg font-medium mb-1 xs:mb-2 truncate">
                          {userProfile.profile.title}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-4 text-gray-600 text-xs xs:text-sm sm:text-base">
                        <span>{totalFollowers} followers</span>
                        <span>•</span>
                        <span>{totalFollowing} following</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Tabs */}
            <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8">
              <div className="bg-gray-100 rounded-xl xs:rounded-2xl border border-gray-200 p-1 xs:p-1.5 sm:p-2">
                <div className="flex gap-1">
                  {userProfile && (
                    <>
                      <button
                        onClick={() => handleTabChange('followers')}
                        className={`flex-1 px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl font-semibold transition-all duration-300 active:scale-95 text-xs xs:text-sm sm:text-base min-h-[44px] flex items-center justify-center ${
                          activeTab === 'followers'
                            ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-gray-900 shadow-lg'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100'
                        }`}
                      >
                        <svg className="w-4 h-4 xs:w-5 xs:h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="hidden xs:inline">Followers</span>
                        <span className="text-[10px] xs:text-xs opacity-80 ml-1">({totalFollowers})</span>
                      </button>
                      <button
                        onClick={() => handleTabChange('following')}
                        className={`flex-1 px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl font-semibold transition-all duration-300 active:scale-95 text-xs xs:text-sm sm:text-base min-h-[44px] flex items-center justify-center ${
                          activeTab === 'following'
                            ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-gray-900 shadow-lg'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100'
                        }`}
                      >
                        <svg className="w-4 h-4 xs:w-5 xs:h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span className="hidden xs:inline">Following</span>
                        <span className="text-[10px] xs:text-xs opacity-80 ml-1">({totalFollowing})</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleTabChange('members')}
                    className={`flex-1 px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl font-semibold transition-all duration-300 active:scale-95 text-xs xs:text-sm sm:text-base min-h-[44px] flex items-center justify-center ${
                      activeTab === 'members'
                        ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-gray-900 shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100'
                    }`}
                  >
                    <svg className="w-4 h-4 xs:w-5 xs:h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="hidden sm:inline">Members</span>
                    <span className="sm:hidden">M</span>
                    <span className="text-[10px] xs:text-xs opacity-80 ml-1">
                      ({members.length > 0 ? members.length : 'All'})
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Members Filters */}
            {activeTab === 'members' && (
              <section className="mb-4 xs:mb-5 sm:mb-6 md:mb-8">
                <div className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-6 border border-gray-200">
                  
                  <div className="mb-3 xs:mb-4 sm:mb-6">
                    <input
                      type="text"
                      placeholder="Search by name, email, or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-100 border border-gray-200 rounded-lg xs:rounded-xl px-3 xs:px-4 sm:px-6 py-2.5 xs:py-3 sm:py-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 text-xs xs:text-sm sm:text-base"
                    />
                  </div>

                  <div className="mb-3 xs:mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="flex items-center cursor-pointer active:scale-95 transition-transform">
                      <input
                        type="checkbox"
                        checked={showOnlyBadgedUsers}
                        onChange={(e) => setShowOnlyBadgedUsers(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`relative inline-flex h-5 w-9 xs:h-6 xs:w-11 items-center rounded-full transition-colors ${
                        showOnlyBadgedUsers ? 'bg-blue-600' : 'bg-gray-600'
                      }`}>
                        <span className={`inline-block h-3 w-3 xs:h-4 xs:w-4 transform rounded-full bg-white transition-transform ${
                          showOnlyBadgedUsers ? 'translate-x-5 xs:translate-x-6' : 'translate-x-1'
                        }`} />
                      </div>
                      <span className="ml-2 xs:ml-3 text-gray-900 text-xs xs:text-sm sm:text-base">Show only members with achievements</span>
                    </label>
                    
                    <div className="text-[10px] xs:text-xs sm:text-sm text-gray-400">
                      {showOnlyBadgedUsers 
                        ? `Showing ${members.filter(m => m.hasAchievements).length} members with achievements`
                        : `Showing all ${members.length} members`
                      }
                    </div>
                  </div>

                  <div className="mb-3 xs:mb-4 sm:hidden">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-gray-900 px-3 xs:px-4 py-2.5 xs:py-3 rounded-lg xs:rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 min-h-[44px] text-xs xs:text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                    </button>
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-4 sm:mb-6 ${!showFilters && isMobile ? 'hidden' : ''}`}>
                    
                    <select
                      value={selectedBadgeCategory}
                      onChange={(e) => setSelectedBadgeCategory(e.target.value)}
                      className="bg-gray-100 border border-gray-200 rounded-lg xs:rounded-xl px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 text-gray-900 focus:border-blue-500 focus:outline-none transition-all duration-300 text-xs xs:text-sm sm:text-base"
                    >
                      <option value="all">All Badge Types</option>
                      {Object.entries(badgeCategories).map(([key, category]) => (
                        <option key={key} value={key}>{category.name}</option>
                      ))}
                    </select>

                    <select
                      value={selectedSkill}
                      onChange={(e) => setSelectedSkill(e.target.value)}
                      className="bg-gray-100 border border-gray-200 rounded-lg xs:rounded-xl px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 text-gray-900 focus:border-blue-500 focus:outline-none transition-all duration-300 text-xs xs:text-sm sm:text-base"
                    >
                      <option value="">All Skills</option>
                      {uniqueSkills.map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                    </select>

                    <select
                      value={minProjects}
                      onChange={(e) => setMinProjects(Number(e.target.value))}
                      className="bg-gray-100 border border-gray-200 rounded-lg xs:rounded-xl px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 text-gray-900 focus:border-blue-500 focus:outline-none transition-all duration-300 text-xs xs:text-sm sm:text-base"
                    >
                      <option value={0}>Any Projects</option>
                      <option value={1}>1+ Projects</option>
                      <option value={3}>3+ Projects</option>
                      <option value={5}>5+ Projects</option>
                      <option value={10}>10+ Projects</option>
                    </select>

                    <select
                      value={minBadges}
                      onChange={(e) => setMinBadges(Number(e.target.value))}
                      className="bg-gray-100 border border-gray-200 rounded-lg xs:rounded-xl px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 text-gray-900 focus:border-blue-500 focus:outline-none transition-all duration-300 text-xs xs:text-sm sm:text-base"
                    >
                      <option value={0}>Any Badges</option>
                      <option value={1}>1+ Badges</option>
                      <option value={5}>5+ Badges</option>
                      <option value={10}>10+ Badges</option>
                      <option value={15}>15+ Badges</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-gray-100 border border-gray-200 rounded-lg xs:rounded-xl px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 text-gray-900 focus:border-blue-500 focus:outline-none transition-all duration-300 text-xs xs:text-sm sm:text-base"
                    >
                      <option value="recent">Recently Active</option>
                      <option value="badges">Most Badges</option>
                      <option value="projects">Most Projects</option>
                      <option value="score">Highest Score</option>
                      <option value="name">Name A-Z</option>
                    </select>

                    <button
                      onClick={clearFilters}
                      className="bg-red-500 text-white px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl font-semibold hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800 transition-all duration-300 text-xs xs:text-sm sm:text-base min-h-[44px]"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-gray-600 text-xs xs:text-sm sm:text-base">
                    <span>
                      <span className="text-orange-400 font-semibold">{filteredMembers.length}</span> members found
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Search Bar for followers/following */}
            {activeTab !== 'members' && getCurrentUsers().length > 0 && (
              <div className="mb-3 xs:mb-4 sm:mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 xs:px-4 py-2.5 xs:py-3 pl-10 xs:pl-12 bg-gray-100 border border-gray-200 rounded-lg xs:rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20 text-xs xs:text-sm sm:text-base"
                  />
                  <svg className="absolute left-3 xs:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 xs:h-5 xs:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchTerm && (
                  <p className="text-gray-400 text-[10px] xs:text-xs sm:text-sm mt-2 px-2">
                    {getCurrentUsers().length} result{getCurrentUsers().length !== 1 ? 's' : ''} found
                  </p>
                )}
              </div>
            )}

            {/* Content Section */}
            <section>
              {loadingPage ? (
                <div className="text-center py-8 xs:py-10 sm:py-12">
                  <div className="animate-spin rounded-full h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-900 text-sm xs:text-base sm:text-lg">Loading users...</p>
                </div>
              ) : (
                <div>
                  <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 xs:mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {activeTab === 'followers' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        ) : activeTab === 'following' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        )}
                      </svg>
                      {activeTab === 'followers' ? 'Followers' : 
                       activeTab === 'following' ? 'Following' : 
                       'Members Directory'}
                    </span>
                    {!searchTerm && !searchQuery && activeTab !== 'members' && (
                      <span className="text-[10px] xs:text-xs sm:text-sm bg-gray-500/20 text-gray-400 px-2 xs:px-3 py-1 rounded-full self-start sm:self-auto">
                        Page {currentPage} of {getTotalPages()}
                      </span>
                    )}
                  </h2>
                  
                  {getCurrentUsers().length === 0 ? (
                    <div className="text-center py-10 xs:py-12 sm:py-16 px-4">
                      <svg className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        {searchTerm || searchQuery
                          ? 'No users found' 
                          : activeTab === 'followers' 
                          ? 'No followers yet' 
                          : activeTab === 'following'
                          ? 'Not following anyone yet'
                          : 'No members found'
                        }
                      </h3>
                      <p className="text-gray-600 text-xs xs:text-sm sm:text-base max-w-md mx-auto">
                        {searchTerm || searchQuery
                          ? 'Try adjusting your search terms'
                          : activeTab === 'members'
                          ? 'Loading members directory...'
                          : userProfile?.uid === currentUser?.uid 
                          ? (activeTab === 'followers' 
                            ? "Share great content to attract followers!"
                            : "Discover and follow other developers in the platform!"
                          )
                          : (activeTab === 'followers'
                            ? "This user doesn't have any followers yet."
                            : "This user isn't following anyone yet."
                          )
                        }
                      </p>
                    </div>
                  ) : (
                    <>
                      {activeTab === 'members' ? (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
                            {(() => {
                              const { currentMembers } = getMembersPageData();
                              return currentMembers.map((member) => (
                                <MemberCard key={member.uid} member={member} />
                              ));
                            })()}
                          </div>
                          
                          {(() => {
                            const { totalPages, startIndex, endIndex } = getMembersPageData();
                            
                            if (totalPages > 1) {
                              return (
                                <div className="flex justify-center items-center mt-6 xs:mt-8 sm:mt-12 px-4">
                                  <div className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 rounded-xl xs:rounded-2xl p-3 xs:p-4 sm:p-6 border border-gray-200 w-full max-w-lg">
                                    <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-4">
                                      
                                      <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className={`flex items-center px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 rounded-lg xs:rounded-xl font-semibold transition-all duration-300 active:scale-95 text-xs xs:text-sm min-h-[44px] ${
                                          currentPage === 1
                                            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-gray-900 hover:from-blue-600 hover:to-blue-700'
                                        }`}
                                      >
                                        <svg className="w-3 h-3 xs:w-4 xs:h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        <span className="hidden xs:inline">Previous</span>
                                      </button>

                                      <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                                        {[...Array(Math.min(totalPages, isMobile ? 3 : 5))].map((_, index) => {
                                          let pageNum;
                                          const maxPages = isMobile ? 3 : 5;
                                          if (totalPages <= maxPages) {
                                            pageNum = index + 1;
                                          } else if (currentPage <= Math.ceil(maxPages/2)) {
                                            pageNum = index + 1;
                                          } else if (currentPage >= totalPages - Math.floor(maxPages/2)) {
                                            pageNum = totalPages - maxPages + 1 + index;
                                          } else {
                                            pageNum = currentPage - Math.floor(maxPages/2) + index;
                                          }

                                          if (pageNum < 1 || pageNum > totalPages) return null;

                                          return (
                                            <button
                                              key={pageNum}
                                              onClick={() => setCurrentPage(pageNum)}
                                              className={`w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-lg xs:rounded-xl font-semibold transition-all duration-300 active:scale-95 text-xs xs:text-sm ${
                                                currentPage === pageNum
                                                  ? 'bg-blue-600 text-white'
                                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-white/30'
                                              }`}
                                            >
                                              {pageNum}
                                            </button>
                                          );
                                        })}
                                      </div>

                                      <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`flex items-center px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 rounded-lg xs:rounded-xl font-semibold transition-all duration-300 active:scale-95 text-xs xs:text-sm min-h-[44px] ${
                                          currentPage === totalPages
                                            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-gray-900 hover:from-blue-600 hover:to-blue-700'
                                        }`}
                                      >
                                        <span className="hidden xs:inline">Next</span>
                                        <svg className="w-3 h-3 xs:w-4 xs:h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                      </button>
                                    </div>

                                    <div className="text-center text-gray-600 text-[10px] xs:text-xs sm:text-sm">
                                      Page {currentPage} of {totalPages} • {filteredMembers.length} total members
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
                            {getCurrentUsers().map((user) => (
                              <UserCard key={user.uid} user={user} />
                            ))}
                          </div>
                          
                          {!searchTerm && <PaginationControls />}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </section>
          </div>
        </main>

        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
          * { font-family: 'Inter', sans-serif; }
          
          select option {
            background-color: rgba(0, 0, 0, 0.9);
            color: white;
          }

          @media (min-width: 375px) {
            .xs\\:inline { display: inline; }
            .xs\\:hidden { display: none; }
          }
        `}</style>
      </div>
    </>
  );
};

export default FollowersFollowing;
