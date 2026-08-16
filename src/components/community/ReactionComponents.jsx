// src/components/community/ReactionComponents.jsx - She Model Tech Reactions - FULLY RESPONSIVE

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

/**
 * Reaction Avatars Component
 * Shows profile pictures of users who reacted to a post
 * Fully responsive for all screen sizes
 */
export const ReactionAvatars = ({ postId, userIds = [], reactionCount, onClick }) => {
  const [avatarUsers, setAvatarUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const MAX_AVATARS = 5;

  useEffect(() => {
    const fetchAvatarUsers = async () => {
      if (!userIds || userIds.length === 0) {
        setAvatarUsers([]);
        return;
      }

      setLoading(true);
      try {
        const userIdsToFetch = userIds.slice(0, MAX_AVATARS);
        
        if (userIdsToFetch.length === 0) {
          setAvatarUsers([]);
          setLoading(false);
          return;
        }

        const usersQuery = query(
          collection(db, 'users'),
          where('uid', 'in', userIdsToFetch)
        );
        
        const usersSnapshot = await getDocs(usersQuery);
        const users = usersSnapshot.docs.map(doc => {
          const userData = doc.data();
          return {
            uid: doc.id,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            displayName: userData.displayName || '',
            photoURL: userData.photoURL || null,
            initials: userData.initials || '',
            profile: userData.profile || {}
          };
        });

        const foundUserIds = users.map(user => user.uid);
        const missingUserIds = userIdsToFetch.filter(id => !foundUserIds.includes(id));
        
        const missingUsers = missingUserIds.map(id => ({
          uid: id,
          firstName: '',
          lastName: '',
          displayName: 'She Model Tech Member',
          photoURL: null,
          initials: 'TM',
          profile: {}
        }));

        setAvatarUsers([...users, ...missingUsers]);
      } catch (error) {
        console.error('Error fetching avatar users:', error);
        setAvatarUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatarUsers();
  }, [userIds]);

  if (reactionCount === 0) return null;

  return (
    <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
      {/* Profile Pictures Stack */}
      <div className="flex -space-x-1 xs:-space-x-1.5 sm:-space-x-2">
        {loading ? (
          Array.from({ length: Math.min(3, reactionCount) }).map((_, index) => (
            <div
              key={index}
              className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 bg-gray-600 rounded-full border border-gray-800 xs:border-2 animate-pulse"
            />
          ))
        ) : (
          avatarUsers.slice(0, MAX_AVATARS).map((user, index) => (
            <div
              key={user.uid || index}
              className="relative group"
              style={{ zIndex: MAX_AVATARS - index }}
            >
              <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 rounded-full border border-gray-800 xs:border-2 overflow-hidden bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center cursor-pointer">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-900 font-bold text-[10px] xs:text-xs sm:text-sm">
                    {user.firstName && user.lastName 
                      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                      : user.initials || user.displayName?.charAt(0)?.toUpperCase() || 'U'
                    }
                  </span>
                )}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 xs:mb-1.5 sm:mb-2 px-1.5 xs:px-2 py-0.5 xs:py-1 bg-white text-gray-900 text-[10px] xs:text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 max-w-24 xs:max-w-32 sm:max-w-none pointer-events-none">
                <div className="truncate">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.displayName || 'She Model Tech Member'
                  }
                </div>
                {user.profile?.title && (
                  <div className="text-pink-600 text-[9px] xs:text-xs truncate hidden sm:block">
                    {user.profile.title}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {reactionCount > MAX_AVATARS && (
          <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 rounded-full border border-gray-800 xs:border-2 bg-gray-700 flex items-center justify-center text-gray-900 text-[10px] xs:text-xs font-bold cursor-pointer">
            +{reactionCount - MAX_AVATARS}
          </div>
        )}
      </div>

      {/* Like count and text */}
      <button
        onClick={onClick}
        className="text-gray-400 hover:text-gray-900 active:text-gray-600 text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-0.5 xs:gap-1 group"
        aria-label={`View ${reactionCount} ${reactionCount === 1 ? 'like' : 'likes'}`}
      >
        <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
        <span className="group-hover:underline hidden sm:inline">
          {reactionCount} {reactionCount === 1 ? 'like' : 'likes'}
        </span>
        <span className="group-hover:underline sm:hidden">
          {reactionCount}
        </span>
      </button>
    </div>
  );
};

/**
 * Reactions Modal Component
 * Shows full list of users who reacted to a post
 * Fully responsive for all screen sizes
 */
export const ReactionsModal = ({ isOpen, onClose, postId, reactions, reactionCount }) => {
  if (!isOpen || !postId) return null;

  const reactionUsers = reactions[postId] || [];

  return (
    <div 
      className="fixed inset-0 bg-gray-500 z-[150] flex items-center justify-center p-3 xs:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl xs:rounded-2xl border border-gray-200 shadow-2xl w-full max-w-[calc(100vw-1.5rem)] xs:max-w-sm sm:max-w-md max-h-[90vh] sm:max-h-[32rem] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 xs:p-5 sm:p-6 border-b border-pink-600/10">
          <h3 className="text-base xs:text-lg font-bold text-gray-900 flex items-center gap-1.5 xs:gap-2">
            <svg className="w-4 h-4 xs:w-5 xs:h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="hidden xs:inline">
              Liked by {reactionCount} {reactionCount === 1 ? 'person' : 'people'}
            </span>
            <span className="xs:hidden">
              {reactionCount} {reactionCount === 1 ? 'like' : 'likes'}
            </span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 active:text-gray-600 transition-colors p-1 xs:p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center group"
            aria-label="Close modal"
            title="Close"
          >
            <svg className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>

        {/* Users List */}
        <div className="overflow-y-auto max-h-56 xs:max-h-60 sm:max-h-80 overscroll-contain">
          {reactionUsers.length === 0 ? (
            <div className="p-6 xs:p-8 sm:p-10 text-center">
              <div className="animate-spin rounded-full h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 border-b-2 border-pink-500 mx-auto mb-3 xs:mb-4"></div>
              <p className="text-gray-400 text-xs xs:text-sm">Loading reactions...</p>
            </div>
          ) : (
            <div className="p-2 xs:p-3 sm:p-4 space-y-2 xs:space-y-2.5 sm:space-y-3">
              {reactionUsers.map((user, index) => (
                <div 
                  key={user.uid || index} 
                  className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 p-2 xs:p-2.5 sm:p-3 rounded-lg hover:bg-gray-50 active:bg-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-900 font-bold text-xs xs:text-sm">
                        {user.firstName && user.lastName 
                          ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                          : user.initials || user.displayName?.charAt(0)?.toUpperCase() || 'U'
                        }
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate text-sm xs:text-base">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user.displayName || 'She Model Tech Member'
                      }
                    </p>
                    {user.profile?.title && (
                      <p className="text-pink-600 text-xs xs:text-sm truncate">
                        {user.profile.title}
                      </p>
                    )}
                  </div>
                  <div className="text-red-400 text-xs xs:text-sm flex-shrink-0">
                    <svg className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 xs:p-3.5 sm:p-4 border-t border-pink-600/10 bg-gray-100">
          <p className="text-gray-400 text-[10px] xs:text-xs text-center">
            She Model Tech Community
          </p>
        </div>
      </div>
    </div>
  );
};
