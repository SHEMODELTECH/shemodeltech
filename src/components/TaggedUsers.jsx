// components/TaggedUsers.jsx - Updated for Professional Names (firstName/lastName)
import React from 'react';

export const TaggedUsers = ({ taggedUsers = [] }) => {
  if (!taggedUsers.length) return null;
  
  // Helper function to get professional display name
  const getProfessionalDisplayName = (user) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.displayName || 'Professional User';
  };

  // Helper function to get professional initials
  const getProfessionalInitials = (user) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return user.initials || user.displayName?.charAt(0)?.toUpperCase() || 'U';
  };

  // Helper function to get mention handle (for @username display)
  const getMentionHandle = (user) => {
    // Use firstName + lastName for handle if available, otherwise fall back to displayName or email
    if (user.firstName && user.lastName) {
      return `${user.firstName}${user.lastName}`.replace(/\s+/g, ''); // Remove spaces
    }
    return user.displayName || user.email?.split('@')[0] || 'user';
  };
  
  return (
    <div className="flex items-start sm:items-center space-x-1.5 sm:space-x-2 mt-2 sm:mt-3 text-xs sm:text-sm">
      <span className="text-gray-400 flex-shrink-0 pt-0.5 sm:pt-0">Tagged:</span>
      <div className="flex items-center flex-wrap gap-1 sm:gap-2">
        {taggedUsers.map((user, index) => (
          <div key={user.uid || index} className="flex items-center">
            <div className="flex items-center space-x-1 bg-blue-500/10 hover:bg-blue-500/20 rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 transition-colors group cursor-pointer">
              {/* User Avatar with Professional Initials */}
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-blue-500 flex items-center justify-center text-gray-900 font-bold text-[8px] sm:text-xs flex-shrink-0">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={getProfessionalDisplayName(user)} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {getProfessionalInitials(user)}
                  </span>
                )}
              </div>
              
              {/* Professional Display Name with @ handle */}
              <span className="text-blue-600 hover:text-orange-400 transition-colors text-xs sm:text-sm whitespace-nowrap">
                @{getMentionHandle(user)}
              </span>
            </div>
            
            {/* Comma separator */}
            {index < taggedUsers.length - 1 && (
              <span className="text-gray-400 ml-0.5 sm:ml-1">,</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
