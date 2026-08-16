// components/NotificationBell.jsx - FULLY RESPONSIVE FOR ALL SCREEN SIZES

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../firebase/config';

const NotificationBell = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(null);

  // Fetch notifications
  useEffect(() => {
    if (!currentUser) return;

    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setNotifications(notificationsData);
      setUnreadCount(notificationsData.filter(n => !n.isRead).length);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        isRead: true
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(
        unreadNotifications.map(notification =>
          updateDoc(doc(db, 'notifications', notification.id), {
            isRead: true
          })
        )
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Handle View All Notifications
  const handleViewAllNotifications = () => {
    setShowDropdown(false);
    navigate('/notifications');
  };

  // Handle notification click with navigation
  const handleNotificationClick = async (notification) => {
    try {
      setNavigating(notification.id);

      // Mark notification as read when clicked
      if (!notification.isRead) {
        await markAsRead(notification.id);
      }

      // Close the dropdown
      setShowDropdown(false);

      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 150));

      // Navigate based on notification type
      switch (notification.type) {
        case 'group_post':
        case 'group_reply':
        case 'group_member_joined':
        case 'group_completed':
          if (notification.groupId) {
            navigate(`/groups/${notification.groupId}`);
          }
          break;

        case 'reply_mention':
        case 'repost_mention':
        case 'like':
          navigate('/community');
          break;

        case 'follow':
          if (notification.mentionedByEmail) {
            navigate(`/profile/${encodeURIComponent(notification.mentionedByEmail)}`);
          } else {
            navigate('/community');
          }
          break;

        case 'badge_awarded':
          navigate('/dashboard');
          break;

        // Admin-review lifecycle: open the project itself - the completion
        // ("manage project") page for the owner, the workspace for the team.
        case 'project_review_approved':
        case 'project_needs_changes':
        case 'project_review_rejected':
          if (notification.projectId) {
            navigate(notification.forOwner
              ? `/projects/${notification.projectId}/complete`
              : `/projects/${notification.projectId}/workspace`);
          } else {
            navigate('/notifications');
          }
          break;

        // Payment + dispute lifecycle: open the project's dispute room where
        // the payment table and confirmations live.
        case 'payment_confirmation':
        case 'payment_confirmed':
        case 'payment_disputed':
        case 'dispute_resolved':
          if (notification.projectId) navigate(`/disputes/${notification.projectId}`);
          else navigate('/notifications');
          break;

        case 'project_completed':
        case 'project_application':
        case 'application_approved':
        case 'application_rejected':
          if (notification.projectId) navigate(`/projects/${notification.projectId}`);
          else navigate('/notifications');
          break;

        default:
          // Any other project-linked notification opens the project; the rest
          // keep the community/proof-wall fallback.
          if (notification.projectId) navigate(`/projects/${notification.projectId}`);
          else navigate('/community');
          break;
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
      setShowDropdown(false);
    } finally {
      setNavigating(null);
    }
  };

  // Format time ago
  const timeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reply_mention': return '💬';
      case 'repost_mention': return '🔄';
      case 'like': return '❤️';
      case 'follow': return '👥';
      case 'group_post': return '📝';
      case 'group_reply': return '💬';
      case 'group_member_joined': return '👥';
      case 'badge_awarded': return '🏆';
      case 'group_completed': return '🎉';
      default: return '🔔';
    }
  };

  // Get notification action text
  const getNotificationAction = (type) => {
    switch (type) {
      case 'reply_mention': return 'mentioned you in a reply';
      case 'repost_mention': return 'mentioned you in a repost';
      case 'like': return 'liked your post';
      case 'follow': return 'started following you';
      case 'group_post': return 'posted in';
      case 'group_reply': return 'replied to your post';
      case 'group_member_joined': return 'joined';
      case 'badge_awarded': return 'awarded you a badge';
      case 'group_completed': return 'project completed';
      default: return 'sent you a notification';
    }
  };

  if (!currentUser) return null;

  return (
    <div className="relative">
      {/* 🔔 NOTIFICATION BELL BUTTON - Fully Responsive */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative text-gray-900 hover:text-blue-600 transition-all duration-300 group p-1 sm:p-0"
        aria-label={`${unreadCount} unread notifications`}
        title={`${unreadCount} unread notifications`}
      >
        {/* Bell Icon - Responsive sizes */}
        <svg 
          className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 transition-all duration-300 group-hover:text-orange-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={2}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>

        {/* Notification Badge - Responsive positioning */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 xs:-top-2 xs:-right-2 bg-red-500 text-white text-[10px] xs:text-xs font-bold rounded-full min-w-[16px] xs:min-w-[20px] h-[16px] xs:h-[20px] flex items-center justify-center animate-pulse shadow-lg border border-gray-900 xs:border-2">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Glow effect */}
        {unreadCount > 0 && (
          <span className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse"></span>
        )}
      </button>

      {/* 📋 NOTIFICATIONS DROPDOWN - Fully Responsive */}
      {showDropdown && (
        <div className="fixed xs:absolute left-2 right-2 xs:left-auto xs:right-0 top-16 xs:top-full mt-0 xs:mt-2 w-auto xs:w-80 sm:w-96 md:w-[26rem] lg:w-[28rem] bg-gray-900/98 xs:bg-gray-900/95 border border-gray-200 rounded-xl xs:rounded-2xl shadow-2xl z-[9999] max-h-[calc(100vh-5rem)] xs:max-h-[85vh] sm:max-h-96 overflow-hidden">
          
          {/* Header - Responsive padding and text */}
          <div className="flex items-center justify-between p-3 xs:p-3 sm:p-4 border-b border-gray-200 sticky top-0 bg-gray-900/95 z-10">
            <h3 className="text-gray-900 font-bold text-sm xs:text-base flex items-center gap-1.5 xs:gap-2">
              <span className="text-base xs:text-lg">🔔</span>
              <span className="hidden xs:inline">Notifications</span>
              <span className="xs:hidden">Alerts</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] xs:text-xs px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h3>
            
            <div className="flex items-center gap-1.5 xs:gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-blue-600 hover:text-orange-400 text-[11px] xs:text-xs font-medium transition-colors px-2 py-1 hover:bg-gray-50 rounded hidden xs:block"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setShowDropdown(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors p-1 rounded hover:bg-gray-100"
                aria-label="Close notifications"
              >
                <svg className="h-4 w-4 xs:h-5 xs:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Mark All Read Button */}
          {unreadCount > 0 && (
            <div className="xs:hidden px-3 py-2 border-b border-gray-200 bg-gray-900/50">
              <button
                onClick={markAllAsRead}
                className="text-blue-600 hover:text-orange-400 text-xs font-medium transition-colors w-full text-left"
              >
                ✓ Mark all as read
              </button>
            </div>
          )}

          {/* Notifications List - Responsive height */}
          <div className="overflow-y-auto max-h-[calc(100vh-12rem)] xs:max-h-60 sm:max-h-80 overscroll-contain">
            {loading ? (
              <div className="p-6 xs:p-8 sm:p-10 text-center">
                <div className="animate-spin rounded-full h-6 w-6 xs:h-8 xs:w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                <p className="text-gray-400 text-xs xs:text-sm">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 xs:p-8 sm:p-10 text-center">
                <div className="text-3xl xs:text-4xl mb-3">🔔</div>
                <p className="text-gray-400 text-sm xs:text-base font-medium mb-1">No notifications yet</p>
                <p className="text-gray-500 text-xs xs:text-sm">You'll see updates about mentions, likes, and replies here</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.slice(0, 20).map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 xs:p-3.5 sm:p-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-all duration-200 group ${
                      !notification.isRead ? 'bg-blue-500/5 border-l-2 xs:border-l-[3px] border-blue-500' : ''
                    } ${navigating === notification.id ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <div className="flex items-start gap-2 xs:gap-2.5 sm:gap-3">
                      {/* Notification Icon - Responsive size */}
                      <div className="flex-shrink-0 w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 bg-blue-600/20 rounded-full flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                        <span className="text-sm xs:text-base">
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>

                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        {/* User info - Responsive */}
                        <div className="flex items-center gap-1.5 xs:gap-2 mb-1">
                          {(notification.mentionedByPhoto || notification.followedByPhoto) ? (
                            <img 
                              src={notification.mentionedByPhoto || notification.followedByPhoto} 
                              alt="Profile" 
                              className="w-4 h-4 xs:w-5 xs:h-5 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-4 h-4 xs:w-5 xs:h-5 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-[10px] xs:text-xs text-gray-900 font-bold">
                                {(notification.mentionedByFirstName || notification.mentionedByName || notification.followedByName || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="text-gray-900 font-medium text-xs xs:text-sm truncate">
                            {notification.mentionedByFirstName && notification.mentionedByLastName 
                              ? `${notification.mentionedByFirstName} ${notification.mentionedByLastName}`
                              : notification.mentionedByName || notification.followedByName || 'A member'
                            }
                          </span>
                          {!notification.isRead && (
                            <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-blue-500 rounded-full flex-shrink-0 animate-pulse"></div>
                          )}
                        </div>

                        {/* Action text - Responsive */}
                        <p className="text-gray-600 text-xs xs:text-sm mb-1.5 xs:mb-2 line-clamp-2">
                          {getNotificationAction(notification.type)}
                          {notification.groupTitle && (notification.type === 'group_post' || notification.type === 'group_member_joined') && (
                            <span className="text-blue-600 font-medium"> {notification.groupTitle}</span>
                          )}
                          {notification.badgeLevel && notification.type === 'badge_awarded' && (
                            <span className="text-orange-500 font-medium"> {notification.badgeLevel}</span>
                          )}
                        </p>

                        {/* Preview content - Responsive */}
                        {(notification.replyContent || notification.repostComment) && (
                          <p className="text-gray-400 text-[11px] xs:text-xs bg-gray-100 rounded px-2 py-1.5 xs:p-2 mb-1.5 xs:mb-2 line-clamp-2">
                            "{notification.replyContent || notification.repostComment}"
                          </p>
                        )}

                        {/* Footer - Time and actions */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-gray-500 text-[11px] xs:text-xs whitespace-nowrap">
                            {timeAgo(notification.createdAt)}
                          </span>
                          
                          <div className="flex items-center gap-1.5 xs:gap-2 min-w-0">
                            {notification.postTitle && (
                              <span className="text-blue-600 text-[11px] xs:text-xs truncate max-w-[60px] xs:max-w-20 sm:max-w-24">
                                "{notification.postTitle}"
                              </span>
                            )}
                            
                            {/* Loading/Click indicator - Responsive */}
                            {navigating === notification.id ? (
                              <div className="w-3 h-3 xs:w-3.5 xs:h-3.5 border border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                            ) : (
                              <div className="text-gray-400 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100 flex items-center text-[11px] xs:text-xs flex-shrink-0">
                                <span className="hidden sm:inline mr-1">View</span>
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - View All - Responsive */}
          {notifications.length > 0 && (
            <div className="p-3 xs:p-3 sm:p-4 border-t border-gray-200 bg-gray-100 sticky bottom-0">
              <button
                onClick={handleViewAllNotifications}
                className="w-full text-center text-blue-600 hover:text-orange-400 text-xs xs:text-sm font-medium transition-colors py-1 hover:bg-gray-50 rounded"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close - Responsive overlay */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-[9998] bg-gray-100 xs:bg-transparent" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
