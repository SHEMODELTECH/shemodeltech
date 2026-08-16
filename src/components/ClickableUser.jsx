// src/components/ClickableUser.jsx - Responsive Clickable User Components
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { showWarningMessage } from '../utils/errorHandler';

/**
 * ClickableUserAvatar Component
 * Renders a clickable user avatar that navigates to the user's profile
 */
export const ClickableUserAvatar = ({ 
  user, 
  size = "md", 
  className = "", 
  showOnlineStatus = false,
  onClick,
  ...props 
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If custom onClick is provided, use it
    if (onClick) {
      onClick(user);
      return;
    }

    // Navigate to user profile
    try {
      if (user.email) {
        const encodedEmail = encodeURIComponent(user.email);
        navigate(`/profile/${encodedEmail}`);
      } else if (user.uid) {
        // Fallback to uid if email is not available
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

  // Responsive size configurations
  const sizeClasses = {
    xs: 'w-5 h-5 sm:w-6 sm:h-6',
    sm: 'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8',
    md: 'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10',
    lg: 'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12',
    xl: 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16',
    '2xl': 'w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
    xl: 'text-lg sm:text-xl',
    '2xl': 'text-xl sm:text-2xl'
  };

  const onlineStatusSize = {
    xs: 'w-2 h-2 -bottom-0.5 -right-0.5 border',
    sm: 'w-2 h-2 sm:w-2.5 sm:h-2.5 -bottom-0.5 -right-0.5 border sm:border-2',
    md: 'w-2.5 h-2.5 sm:w-3 sm:h-3 -bottom-0.5 -right-0.5 border sm:border-2',
    lg: 'w-3 h-3 sm:w-3.5 sm:h-3.5 -bottom-0.5 -right-0.5 border-2',
    xl: 'w-3.5 h-3.5 sm:w-4 sm:h-4 -bottom-1 -right-1 border-2',
    '2xl': 'w-4 h-4 sm:w-5 sm:h-5 -bottom-1 -right-1 border-2 sm:border-3'
  };

  // Generate initials
  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    } else if (user.displayName) {
      const parts = user.displayName.split(' ');
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
      }
      return user.displayName.charAt(0).toUpperCase();
    } else if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return '?';
  };

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-blue-500 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400/50 relative flex-shrink-0 ${className}`}
      title={`View profile of ${user.displayName || user.firstName + ' ' + user.lastName || user.email?.split('@')[0] || 'user'}`}
      aria-label={`View profile of ${user.displayName || user.firstName + ' ' + user.lastName || user.email?.split('@')[0] || 'user'}`}
      {...props}
    >
      {user.photoURL ? (
        <img 
          src={user.photoURL} 
          alt="Profile" 
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, hide it and show initials
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <span className={`text-gray-900 font-bold ${textSizeClasses[size]}`}>
          {getInitials()}
        </span>
      )}
      
      {/* Online status indicator */}
      {showOnlineStatus && (
        <div className={`absolute ${onlineStatusSize[size]} bg-blue-500 rounded-full border-white`}></div>
      )}
    </button>
  );
};

/**
 * ClickableUserName Component
 * Renders a clickable user name that navigates to the user's profile
 */
export const ClickableUserName = ({ 
  user, 
  className = "", 
  showTitle = true,
  maxLength = null,
  onClick,
  ...props 
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If custom onClick is provided, use it
    if (onClick) {
      onClick(user);
      return;
    }

    // Navigate to user profile
    try {
      if (user.email) {
        const encodedEmail = encodeURIComponent(user.email);
        navigate(`/profile/${encodedEmail}`);
      } else if (user.uid) {
        // Fallback to uid if email is not available
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

  // Get display name
  const getDisplayName = () => {
    let name = '';
    
    if (user.firstName && user.lastName) {
      name = `${user.firstName} ${user.lastName}`;
    } else if (user.displayName) {
      name = user.displayName;
    } else if (user.email) {
      name = user.email.split('@')[0];
    } else {
      name = 'Unknown User';
    }

    // Truncate if maxLength is specified
    if (maxLength && name.length > maxLength) {
      return name.substring(0, maxLength) + '...';
    }

    return name;
  };

  // Get user title/role
  const getUserTitle = () => {
    if (user.profile?.title) {
      return user.profile.title;
    } else if (user.role) {
      return user.role;
    }
    return null;
  };

  return (
    <div className="flex flex-col min-w-0">
      <button
        onClick={handleClick}
        className={`text-left cursor-pointer hover:underline focus:outline-none focus:underline transition-colors duration-200 truncate text-sm sm:text-base ${className}`}
        title={`View profile of ${getDisplayName()}`}
        aria-label={`View profile of ${getDisplayName()}`}
        {...props}
      >
        {getDisplayName()}
      </button>
      
      {showTitle && getUserTitle() && (
        <span className="text-xs sm:text-sm text-blue-600 truncate">
          {getUserTitle()}
        </span>
      )}
    </div>
  );
};

/**
 * ClickableUserCard Component
 * A combination of avatar and name in a card format
 */
export const ClickableUserCard = ({ 
  user, 
  size = "md", 
  className = "",
  showTitle = true,
  showOnlineStatus = false,
  horizontal = true,
  onClick
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If custom onClick is provided, use it
    if (onClick) {
      onClick(user);
      return;
    }

    // Navigate to user profile
    try {
      if (user.email) {
        const encodedEmail = encodeURIComponent(user.email);
        navigate(`/profile/${encodedEmail}`);
      } else if (user.uid) {
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

  return (
    <button
      onClick={handleClick}
      className={`flex ${horizontal ? 'flex-row items-center space-x-2 sm:space-x-3' : 'flex-col items-center space-y-2'} p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400/50 cursor-pointer w-full ${className}`}
      aria-label={`View profile of ${user.displayName || user.firstName + ' ' + user.lastName || user.email?.split('@')[0] || 'user'}`}
    >
      <ClickableUserAvatar 
        user={user}
        size={size}
        showOnlineStatus={showOnlineStatus}
        onClick={(e) => e.stopPropagation()} // Prevent double click
      />
      
      <ClickableUserName
        user={user}
        showTitle={showTitle}
        className="text-gray-900 hover:text-orange-400"
        onClick={(e) => e.stopPropagation()} // Prevent double click
      />
    </button>
  );
};

export default { ClickableUserAvatar, ClickableUserName, ClickableUserCard };
