// src/components/community/Sidebars.jsx 

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getUserCounts, getFollowingStatusForUsers } from '../../utils/followSystem';
import FollowButton from './FollowButton';
import { ClickableUserAvatar } from '../ClickableUser';
import { EnhancedClickableUserName } from './UserComponents';

/**
 * User Quick Links Sidebar - Actions and Navigation
 * Fully responsive for all screen sizes
 */
export const UserQuickLinksSidebar = ({ currentUser, onNavigate, isMobile = false }) => {
  const quickLinks = [
    { title: 'Home', path: '/dashboard' },
    { title: 'Workspace', path: '/my-workspaces' },
    { title: 'Projects', path: '/projects' },
    { title: 'Network', path: '/members-directory' },
  ];

  const handleLinkClick = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  if (!currentUser) return null;

  const containerClass = isMobile 
    ? "p-3 xs:p-4 h-full" 
    : "sticky top-[5.5rem] lg:top-[5.5rem] xl:top-24 h-fit max-h-[calc(100vh-6.5rem)] overflow-hidden";

  return (
    <div className={containerClass}>
      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-3">
        {/* Banner */}
        <div className="h-14 bg-gradient-to-r from-pink-50 to-pink-100" />
        {/* Avatar + Name */}
        <div className="px-4 pb-4 -mt-6">
          <button onClick={() => handleLinkClick(`/profile/${currentUser.email}`)} className="block mb-2">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-pink-600 flex items-center justify-center text-white text-lg font-bold border-2 border-white shadow-sm">
                {currentUser.displayName?.[0] || 'U'}
              </div>
            )}
          </button>
          <button onClick={() => handleLinkClick(`/profile/${currentUser.email}`)} className="text-left">
            <p className="text-gray-900 font-semibold text-sm hover:underline">{currentUser.displayName || 'User'}</p>
          </button>
          <p className="text-gray-500 text-xs mt-0.5 truncate">{currentUser.email}</p>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-100 px-4 py-3">
          <button onClick={() => handleLinkClick(`/profile/${currentUser.email}`)} className="text-pink-600 text-xs font-medium hover:underline">
            View profile
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <div className="space-y-1">
          {quickLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => handleLinkClick(link.path)}
              className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left"
            >
              {link.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Follow Suggestions Sidebar
 * Fully responsive for all screen sizes
 */
export const FollowSuggestionsSidebar = ({ currentUser, isMobile = false }) => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingStatus, setFollowingStatus] = useState({});
  const [userCounts, setUserCounts] = useState({
    followers: 0,
    following: 0
  });

  // Load suggested users to follow
  useEffect(() => {
    const loadSuggestedUsers = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        const usersQuery = query(
          collection(db, 'users'),
          limit(20)
        );
        
        const usersSnapshot = await getDocs(usersQuery);
        const allUsers = usersSnapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        }));
        
        const badgesQuery = query(collection(db, 'member_badges'));
        const badgesSnapshot = await getDocs(badgesQuery);
        
        const userActivityMap = {};
        badgesSnapshot.docs.forEach(doc => {
          const badge = doc.data();
          if (badge.memberEmail) {
            if (!userActivityMap[badge.memberEmail]) {
              userActivityMap[badge.memberEmail] = { badges: 0, lastActivity: null };
            }
            userActivityMap[badge.memberEmail].badges++;
            
            const badgeDate = badge.awardedAt && typeof badge.awardedAt.toDate === 'function' 
              ? badge.awardedAt.toDate() 
              : new Date();
            
            if (!userActivityMap[badge.memberEmail].lastActivity || 
                badgeDate > userActivityMap[badge.memberEmail].lastActivity) {
              userActivityMap[badge.memberEmail].lastActivity = badgeDate;
            }
          }
        });
        
        const candidateUsers = allUsers
          .filter(user => 
            user.uid !== currentUser.uid && 
            user.email && 
            user.email.includes('@')
          )
          .map(user => {
            const activity = userActivityMap[user.email] || { badges: 0, lastActivity: null };
            return {
              uid: user.uid,
              email: user.email,
              name: user.displayName || user.email.split('@')[0],
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              displayName: user.displayName || user.email.split('@')[0],
              photoURL: user.photoURL || null,
              badges: activity.badges,
              lastActivity: activity.lastActivity,
              followerCount: 0,
              userStatus: activity.badges >= 5 ? 'veteran' : 
                         activity.badges >= 1 ? 'achiever' : 'newcomer'
            };
          });
        
        const userIds = candidateUsers.map(user => user.uid);
        const statusMap = await getFollowingStatusForUsers(currentUser, userIds);
        
        const unfollowedUsers = candidateUsers.filter(user => 
          !statusMap[user.uid]
        );
        
        const suggestedUsersList = unfollowedUsers
          .sort((a, b) => {
            if (a.badges !== b.badges) return b.badges - a.badges;
            if (a.lastActivity && b.lastActivity) {
              return b.lastActivity - a.lastActivity;
            }
            return a.lastActivity ? -1 : 1;
          })
          .slice(0, 5);
        
        setSuggestedUsers(suggestedUsersList);
        
        const finalStatusMap = {};
        suggestedUsersList.forEach(user => {
          finalStatusMap[user.uid] = false;
        });
        setFollowingStatus(finalStatusMap);
        
      } catch (error) {
        console.error('Error loading suggested users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestedUsers();
  }, [currentUser]);

  // Load current user's follow counts
  useEffect(() => {
    const loadUserCounts = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const counts = await getUserCounts(currentUser.uid);
          setUserCounts(counts);
        } catch (error) {
          console.error('Failed to load user counts:', error);
        }
      }
    };

    loadUserCounts();
  }, [currentUser]);

  const handleCountUpdate = (countData) => {
    setUserCounts(countData.currentUser);
    
    setSuggestedUsers(prev => prev.map(user => 
      user.uid === countData.targetUserId 
        ? { ...user, followerCount: countData.targetUser.followers }
        : user
    ));

    if (countData.targetUserId && followingStatus[countData.targetUserId] === false) {
      setSuggestedUsers(prev => prev.filter(user => user.uid !== countData.targetUserId));
      
      setFollowingStatus(prev => ({
        ...prev,
        [countData.targetUserId]: true
      }));
    }
  };

  const getUserStatusInfo = (userStatus) => {
    const statusInfo = {
      veteran: { 
        label: 'Veteran', 
        color: 'text-orange-500', 
        bg: 'bg-orange-500/20', 
        border: 'border-orange-500/30',
      },
      achiever: { 
        label: 'Achiever', 
        color: 'text-pink-600', 
        bg: 'bg-pink-600/20', 
        border: 'border-gray-200',
      },
      newcomer: { 
        label: 'Newcomer', 
        color: 'text-pink-600', 
        bg: 'bg-pink-600/20', 
        border: 'border-gray-200',
      }
    };
    return statusInfo[userStatus] || statusInfo.newcomer;
  };

  if (!currentUser) return null;

  const containerClass = isMobile 
    ? "p-3 xs:p-4 h-full" 
    : "h-fit space-y-3";

  return (
    <div className={containerClass}>
      {/* Discover People Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-4 pb-3">
          <h3 className="text-gray-900 font-semibold text-sm flex items-center gap-2">
            <svg className="w-4 h-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Discover People
          </h3>
          <p className="text-gray-500 text-xs mt-0.5">New connections to follow</p>
        </div>

        {/* Stats */}
        <div className="mx-4 mb-3 p-3 bg-pink-50 border border-pink-100 rounded-lg">
          <div className="grid grid-cols-2 gap-3 text-center">
            <button onClick={() => window.location.href = '/my-connections?tab=following'} className="hover:bg-pink-100 rounded-lg p-1 transition-colors">
              <div className="text-lg font-bold text-pink-600">{userCounts.following}</div>
              <div className="text-xs text-pink-500">Following</div>
            </button>
            <button onClick={() => window.location.href = '/my-connections?tab=followers'} className="hover:bg-pink-100 rounded-lg p-1 transition-colors">
              <div className="text-lg font-bold text-pink-600">{userCounts.followers}</div>
              <div className="text-xs text-pink-500">Followers</div>
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="px-4 pb-4">
          {loading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500 mx-auto mb-2"></div>
              <p className="text-gray-400 text-xs">Finding people...</p>
            </div>
          ) : suggestedUsers.length === 0 ? (
            <div className="text-center py-4">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 text-xs">All caught up! You're following everyone we can suggest.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {suggestedUsers.map((user) => (
                <div key={user.uid} className="flex items-center gap-3">
                  <ClickableUserAvatar user={user} size="md" className="flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <EnhancedClickableUserName user={user} className="font-medium text-gray-900 text-sm truncate block" />
                    <p className="text-gray-500 text-xs">{user.badges > 0 ? `${user.badges} badge${user.badges !== 1 ? 's' : ''}` : 'New member'}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <FollowButton targetUser={user} currentUser={currentUser} size="xs" onCountUpdate={handleCountUpdate} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-3">
          <p className="text-gray-400 text-xs text-center">Expand your professional network</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Company Information Sidebar
 * Fully responsive for all screen sizes
 */
export const CompanyInfoSidebar = ({ isMobile = false }) => {
  const navigate = useNavigate();
  
  const companyLinks = [
    {
      title: 'Support',
      url: '/support',
      external: false
    },
    {
      title: 'About',
      url: '/about',
      external: false
    },
    {
      title: 'Terms of Service',
      url: '/terms',
      external: false
    },
    {
      title: 'Privacy Policy',
      url: '/privacy',
      external: false
    }
  ];

  const handleLinkClick = (link) => {
    if (link.external) {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link.url);
    }
  };

  const containerClass = isMobile 
    ? "p-3 xs:p-4 h-full" 
    : "h-fit";

  return (
    <div className={containerClass}>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="text-center px-4 py-5">
          <img 
            src="/Images/512X512.png" 
            alt="She Model Tech Logo" 
            className="w-12 h-12 mx-auto mb-2 rounded-xl"
          />
          <p className="text-gray-500 text-xs mt-1 leading-relaxed">
            Accelerating tech careers through projects, badges, and community.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 px-4 pb-4">
          {companyLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => handleLinkClick(link)}
              className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 text-xs font-medium text-gray-700 text-center transition-colors"
            >
              {link.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
