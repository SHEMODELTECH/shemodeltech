// WhoLikedModal.jsx - Component to show who liked a post

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const WhoLikedModal = ({ isOpen, onClose, postId, userIds = [], postTitle }) => {
  const [likedUsers, setLikedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !userIds || userIds.length === 0) {
      setLikedUsers([]);
      return;
    }

    const fetchLikedUsers = async () => {
      setLoading(true);
      try {
        // Split userIds into chunks of 10 (Firestore 'in' query limit)
        const chunks = [];
        for (let i = 0; i < userIds.length; i += 10) {
          chunks.push(userIds.slice(i, i + 10));
        }

        const allUsers = [];
        
        for (const chunk of chunks) {
          if (chunk.length === 0) continue;
          
          const usersQuery = query(
            collection(db, 'users'),
            where('uid', 'in', chunk)
          );
          
          const usersSnapshot = await getDocs(usersQuery);
          const users = usersSnapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
          }));
          
          allUsers.push(...users);
        }

        // Handle users not found in the users collection
        const foundUserIds = allUsers.map(user => user.uid);
        const missingUserIds = userIds.filter(id => !foundUserIds.includes(id));
        
        const missingUsers = missingUserIds.map(id => ({
          uid: id,
          displayName: 'Unknown User',
          email: 'user@example.com',
          photoURL: null
        }));

        setLikedUsers([...allUsers, ...missingUsers]);
      } catch (error) {
        console.error('Error fetching liked users:', error);
        setLikedUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedUsers();
  }, [isOpen, userIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-2xl w-full max-w-[95vw] sm:max-w-md max-h-[90vh] sm:max-h-[80vh] md:max-h-[70vh] overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 md:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center flex-wrap gap-1 sm:gap-2">
                <span className="text-red-400">❤️</span>
                <span className="truncate">
                  Liked by {userIds.length} {userIds.length === 1 ? 'person' : 'people'}
                </span>
              </h3>
              {postTitle && (
                <p className="text-gray-400 text-xs sm:text-sm mt-1 truncate">
                  "{postTitle}"
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <svg className="h-5 w-5 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 md:p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-6 sm:py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">Loading who liked this post...</p>
            </div>
          ) : likedUsers.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💔</div>
              <p className="text-gray-600 text-sm sm:text-base">No likes yet</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {likedUsers.map((user, index) => (
                <div 
                  key={user.uid || index} 
                  className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-red-400/30 flex-shrink-0">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-gray-900 font-bold text-xs sm:text-sm">
                        {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                      {user.displayName || user.email || 'Unknown User'}
                    </div>
                    {user.email && user.displayName && (
                      <div className="text-gray-400 text-xs sm:text-sm truncate">
                        {user.email}
                      </div>
                    )}
                  </div>
                  
                  {/* Heart Icon */}
                  <div className="text-red-400 text-xs sm:text-sm flex-shrink-0">
                    ❤️
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 md:p-6 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-gray-900 px-4 py-2.5 sm:py-2 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhoLikedModal;
