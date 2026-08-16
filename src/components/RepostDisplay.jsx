// components/RepostModal.jsx - Updated for Professional Names with Mentions
import React, { useState } from 'react';
import { MentionTextarea } from './MentionTextarea';
import { getProfessionalDisplayName, getProfessionalInitials, getMentionHandle } from '../utils/mentionUtils';

export const RepostModal = ({ isOpen, onClose, post, onRepost, isSubmitting }) => {
  const [repostComment, setRepostComment] = useState('');
  const [taggedUsers, setTaggedUsers] = useState([]);

  const handleMentionSelect = (user) => {
    setTaggedUsers(prev => {
      const exists = prev.find(u => u.uid === user.uid);
      if (!exists) {
        return [...prev, user];
      }
      return prev;
    });
  };

  const handleRepost = () => {
    onRepost({
      originalPost: post,
      comment: repostComment.trim(),
      taggedUsers
    });
  };

  const handleClose = () => {
    setRepostComment('');
    setTaggedUsers([]);
    onClose();
  };

  if (!isOpen || !post) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-500 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-2xl w-full max-w-[95vw] sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
            <span className="text-blue-600 mr-1.5 sm:mr-2">🔄</span>
            <span>Repost</span>
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-900 transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 flex-shrink-0"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-5 md:p-6 overflow-y-auto flex-1">
          {/* Repost Comment Input with Professional Mentions */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-gray-900 font-medium mb-2 sm:mb-3 text-sm sm:text-base">
              Add your thoughts (optional)
            </label>
            <MentionTextarea
              value={repostComment}
              onChange={setRepostComment}
              onMentionSelect={handleMentionSelect}
              placeholder="What do you think about this post? Use @ to mention someone..."
              className="w-full p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-orange-400/20 resize-none min-h-[80px] sm:min-h-[100px] transition-colors"
              rows="4"
            />
            
            {/* Show Professional Tagged Users */}
            {taggedUsers.length > 0 && (
              <div className="mt-2 sm:mt-3 p-2.5 sm:p-3 bg-gray-100 border border-gray-200 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">People you mentioned:</div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {taggedUsers.map((user) => (
                    <div key={user.uid} className="flex items-center space-x-1.5 sm:space-x-2 bg-blue-500/10 rounded-full px-2 sm:px-3 py-1">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-blue-500 flex items-center justify-center text-gray-900 font-bold text-[8px] sm:text-xs flex-shrink-0">
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
                      <div className="flex flex-col min-w-0">
                        <span className="text-orange-400 text-xs sm:text-sm font-medium truncate">
                          {getProfessionalDisplayName(user)}
                        </span>
                        {user.profile?.title && (
                          <span className="text-blue-600/70 text-[10px] sm:text-xs truncate">
                            {user.profile.title}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setTaggedUsers(prev => prev.filter(u => u.uid !== user.uid))}
                        className="text-gray-400 hover:text-red-400 transition-colors flex-shrink-0 p-0.5"
                        aria-label="Remove user"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Original Post Preview with Professional Names */}
          <div className="bg-white/40 border border-gray-200 rounded-xl p-3 sm:p-4">
            <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-gray-900 font-bold flex-shrink-0">
                {post.authorPhoto ? (
                  <img 
                    src={post.authorPhoto} 
                    alt={getProfessionalDisplayName(post)} 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-xs sm:text-sm">
                    {/* Use professional initials */}
                    {post.authorFirstName && post.authorLastName 
                      ? `${post.authorFirstName.charAt(0)}${post.authorLastName.charAt(0)}`.toUpperCase()
                      : post.authorInitials || post.authorName?.charAt(0)?.toUpperCase() || '👤'
                    }
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {/* Use professional name */}
                  {post.authorFirstName && post.authorLastName 
                    ? `${post.authorFirstName} ${post.authorLastName}`
                    : post.authorName || 'Professional User'
                  }
                </div>
                {/* Show professional title */}
                {post.authorTitle && (
                  <div className="text-blue-600 text-xs sm:text-sm truncate">
                    {post.authorTitle}
                  </div>
                )}
                <div className="text-gray-400 text-xs sm:text-sm">
                  {post.createdAt?.toLocaleDateString ? 
                    post.createdAt.toLocaleDateString() : 
                    'Unknown date'
                  }
                </div>
              </div>
            </div>
            
            <h4 className="text-gray-900 font-bold mb-1.5 sm:mb-2 text-sm sm:text-base">{post.title}</h4>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              {post.content?.length > 200 
                ? `${post.content.substring(0, 200)}...` 
                : post.content
              }
            </p>
            
            {post.images && post.images.length > 0 && (
              <div className="mt-2 sm:mt-3 text-gray-400 text-xs sm:text-sm flex items-center">
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {post.images.length} image{post.images.length > 1 ? 's' : ''}
              </div>
            )}

            {/* Show original post's professional tagged users */}
            {post.taggedUsers && post.taggedUsers.length > 0 && (
              <div className="mt-2 sm:mt-3 text-xs sm:text-sm">
                <span className="text-gray-400">Originally tagged: </span>
                <span className="inline-flex flex-wrap gap-x-1">
                  {post.taggedUsers.map((user, index) => (
                    <span key={user.uid || index}>
                      <span className="text-blue-600/70">
                        @{getMentionHandle(user)}
                      </span>
                      {index < post.taggedUsers.length - 1 && <span className="text-gray-400">,</span>}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 md:p-6 border-t border-gray-200 bg-gray-100 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div className="text-gray-400 text-xs sm:text-sm">
              {taggedUsers.length > 0 && (
                <span className="block sm:inline">
                  Will notify {taggedUsers.length} mentioned professional{taggedUsers.length > 1 ? 's' : ''} 
                  <span className="hidden sm:inline"> • </span>
                  <br className="sm:hidden" />
                </span>
              )}
              <span>This will be shared with your network</span>
            </div>
            <div className="flex space-x-2 sm:space-x-3">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRepost}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                    <span className="hidden sm:inline">Reposting...</span>
                    <span className="sm:hidden">Posting...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-1.5 sm:mr-2">🔄</span>
                    <span className="hidden sm:inline">
                      Repost{taggedUsers.length > 0 && ` & Notify ${taggedUsers.length}`}
                    </span>
                    <span className="sm:hidden">
                      Repost{taggedUsers.length > 0 && ` (${taggedUsers.length})`}
                    </span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
