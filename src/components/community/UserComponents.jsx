// src/components/community/UserComponents.jsx - She Model Tech User Interaction Components - FULLY RESPONSIVE

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { showWarningMessage } from '../../utils/errorHandler';

/**
 * Enhanced Clickable User Name Component for She Model Tech
 * Fully responsive for all screen sizes
 */
export const EnhancedClickableUserName = ({ user, className = "", children, showTitle = true }) => {
  const navigate = useNavigate();
  
  const handleUserClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (user?.email) {
        const encodedEmail = encodeURIComponent(user.email);
        navigate(`/profile/${encodedEmail}`);
      } else if (user?.uid) {
        navigate(`/profile/${user.uid}`);
      } else {
        console.warn('User object missing both email and uid:', user);
        showWarningMessage('Unable to view user profile - missing user information');
      }
    } catch (error) {
      console.error('Error navigating to user profile:', error);
      showWarningMessage('Unable to view user profile');
    }
  };

  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.displayName || user?.name || 'She Model Tech Member';

  return (
    <button
      onClick={handleUserClick}
      className={`${className} clickable-username hover:underline active:no-underline cursor-pointer transition-all duration-200 text-left`}
      title={showTitle ? `View profile of ${displayName}` : undefined}
      aria-label={`View profile of ${displayName}`}
    >
      {children || displayName}
    </button>
  );
};

/**
 * Tagged Users Display Component with Clickable Names
 * Fully responsive for all screen sizes
 */
export const TaggedUsers = ({ taggedUsers = [], onRemoveTag }) => {
  const navigate = useNavigate();
  
  const handleUserClick = (user) => {
    try {
      if (user.email) {
        const encodedEmail = encodeURIComponent(user.email);
        navigate(`/profile/${encodedEmail}`);
      } else if (user.uid) {
        navigate(`/profile/${user.uid}`);
      } else {
        showWarningMessage('Unable to view user profile');
      }
    } catch (error) {
      console.error('Error navigating to user profile:', error);
      showWarningMessage('Unable to view user profile');
    }
  };

  if (!taggedUsers.length) return null;
  
  return (
    <div className={`${onRemoveTag ? 'mt-3 xs:mt-4 p-3 xs:p-4 bg-blue-600/10 border border-gray-200 rounded-lg xs:rounded-xl' : 'flex flex-wrap items-center gap-1 xs:gap-1.5 sm:gap-2 mt-2 xs:mt-2.5 sm:mt-3 text-xs sm:text-sm'}`}>
      {onRemoveTag && (
        <div className="flex items-center justify-between mb-2 xs:mb-3">
          <h4 className="text-orange-300 font-medium text-xs xs:text-sm flex items-center gap-1 xs:gap-2">
            <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Tagged She Model Tech Members ({taggedUsers.length}):
          </h4>
          <button
            type="button"
            onClick={() => onRemoveTag('all')}
            className="text-gray-400 hover:text-gray-900 active:text-gray-600 text-[10px] xs:text-xs transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
      
      {!onRemoveTag && <span className="text-gray-400 text-xs xs:text-sm">Tagged:</span>}
      
      <div className={onRemoveTag ? "flex flex-wrap gap-1.5 xs:gap-2" : "contents"}>
        {taggedUsers.map((user, index) => (
          <span key={user.uid || index} className={onRemoveTag ? "" : "flex items-center"}>
            {onRemoveTag ? (
              <div className="flex items-center gap-1.5 xs:gap-2 bg-blue-600/20 border border-blue-600/40 rounded-lg px-2 xs:px-3 py-1.5 xs:py-2 text-orange-300">
                <div className="w-5 h-5 xs:w-6 xs:h-6 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] xs:text-xs">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleUserClick(user)}
                  className="text-xs xs:text-sm font-medium hover:text-gray-500 active:text-orange-200 transition-colors truncate max-w-24 xs:max-w-32"
                >
                  @{user.displayName || user.email?.split('@')[0]}
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveTag(index)}
                  className="text-blue-600 hover:text-orange-200 active:text-orange-300 ml-0.5 xs:ml-1 font-bold text-sm xs:text-base transition-colors flex-shrink-0"
                  title="Remove tag"
                  aria-label="Remove tag"
                >
                  &times;
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleUserClick(user)}
                  className="text-blue-600 hover:text-orange-300 active:text-orange-200 transition-colors tagged-user-link px-0.5 xs:px-1 py-0.5 rounded text-xs xs:text-sm"
                  title={`View profile of ${user.displayName || user.email?.split('@')[0]}`}
                >
                  @{user.displayName || user.email?.split('@')[0]}
                </button>
                {index < taggedUsers.length - 1 && <span className="text-gray-400 ml-0.5 xs:ml-1 text-xs xs:text-sm">,</span>}
              </>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

/**
 * Small Tagged Users Component for Forms
 * Fully responsive for all screen sizes
 */
export const TaggedUsersSmall = ({ taggedUsers = [], onRemoveTag }) => {
  if (!taggedUsers.length) return null;
  
  return (
    <div className="mt-2 xs:mt-3 p-2 xs:p-2.5 sm:p-3 bg-blue-600/10 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between mb-1 xs:mb-1.5 sm:mb-2">
        <h4 className="text-orange-300 font-medium text-[10px] xs:text-xs sm:text-sm flex items-center gap-1">
          <svg className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Tagged ({taggedUsers.length}):
        </h4>
        <button
          type="button"
          onClick={() => onRemoveTag('all')}
          className="text-gray-400 hover:text-gray-900 active:text-gray-600 text-[10px] xs:text-xs transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2">
        {taggedUsers.map((user, index) => (
          <div 
            key={user.uid || index} 
            className="flex items-center gap-1 bg-blue-600/20 border border-blue-600/40 rounded px-1.5 xs:px-2 py-0.5 xs:py-1 text-orange-300"
          >
            <div className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white font-bold text-[8px] xs:text-[9px] sm:text-xs flex-shrink-0">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[7px] xs:text-[8px] sm:text-xs">
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-[10px] xs:text-xs font-medium truncate max-w-16 xs:max-w-20 sm:max-w-24">
              @{user.displayName || user.email?.split('@')[0]}
            </span>
            <button
              type="button"
              onClick={() => onRemoveTag(index)}
              className="text-blue-600 hover:text-orange-200 active:text-orange-300 ml-0.5 font-bold text-xs xs:text-sm transition-colors flex-shrink-0"
              title="Remove tag"
              aria-label="Remove tag"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
