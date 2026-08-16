// src/Pages/community/SinglePost.jsx - She Model Tech Single Post View

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  doc,
  getDoc,
  collection, 
  query, 
  where,
  orderBy, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { db } from '../../firebase/config';

// Import utilities
import { 
  safeFirestoreOperation, 
  showSuccessMessage, 
  showWarningMessage 
} from '../../utils/errorHandler';
import { extractMentions, validateMentions } from '../../utils/mentionUtils';
import { safeMentionNotification } from '../../utils/emailNotifications';
import { formatDate, formatTime, copyToClipboard } from '../../utils/communityHelpers';

// Import components
import Navbar from '../../components/Navbar';
import { ClickableUserAvatar } from '../../components/ClickableUser';
import ImageGallery from '../../components/community/ImageGallery';
import { RichTextContent } from '../../components/community/LinkRendering';
import { EnhancedClickableUserName, TaggedUsers, TaggedUsersSmall } from '../../components/community/UserComponents';
import MentionTextarea from '../../components/community/MentionTextarea';
import { ReactionAvatars, ReactionsModal } from '../../components/community/ReactionComponents';
import FollowButton from '../../components/community/FollowButton';
import usePosterName from '../../hooks/usePosterName';

/**
 * She Model Tech - Single Post View
 * Display individual post with full details and replies
 */
const SinglePost = () => {
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { posterName: profilePosterName, isCompany: profileIsCompany } = usePosterName(currentUser);

  // Post State
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Reply State
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyTaggedUsers, setReplyTaggedUsers] = useState([]);

  // Edit State
  const [editingPost, setEditingPost] = useState(false);
  const [editContent, setEditContent] = useState({ title: '', content: '' });
  const [savingEdit, setSavingEdit] = useState(false);

  const [editingReply, setEditingReply] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState('');
  const [savingReplyEdit, setSavingReplyEdit] = useState(false);

  // Delete State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);

  // Reactions State
  const [postReactions, setPostReactions] = useState([]);
  const [reactionCount, setReactionCount] = useState(0);
  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const [reactionsData, setReactionsData] = useState([]);
  const [submittingReaction, setSubmittingReaction] = useState(false);

  // Ref to track reply listener for cleanup
  const replyUnsubRef = useRef(null);

  // Cleanup reply listener on unmount
  useEffect(() => {
    return () => {
      if (replyUnsubRef.current) {
        replyUnsubRef.current();
        replyUnsubRef.current = null;
      }
    };
  }, []);

  /**
   * Load post data
   */
  useEffect(() => {
    const loadPost = async () => {
      if (!postId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const postData = {
          id: postSnap.id,
          ...postSnap.data(),
          createdAt: postSnap.data().createdAt?.toDate ? postSnap.data().createdAt.toDate() : new Date(postSnap.data().createdAt || Date.now()),
          updatedAt: postSnap.data().updatedAt?.toDate ? postSnap.data().updatedAt.toDate() : null
        };

        setPost(postData);
        setPostReactions(postData.likes || []);
        setReactionCount(postData.likeCount || 0);
        setLoading(false);

        // Load replies
        loadReplies();
      } catch (error) {
        console.error('Error loading post:', error);
        showWarningMessage('Failed to load post. Please try again.');
        setLoading(false);
      }
    };

    loadPost();

    // Cleanup reply listener when postId changes
    return () => {
      if (replyUnsubRef.current) {
        replyUnsubRef.current();
        replyUnsubRef.current = null;
      }
    };
  }, [postId]);

  /**
   * Load replies for the post
   */
  const loadReplies = () => {
    if (!postId) return;

    // Unsubscribe previous listener if exists
    if (replyUnsubRef.current) {
      replyUnsubRef.current();
      replyUnsubRef.current = null;
    }

    setLoadingReplies(true);

    try {
      const repliesQuery = query(
        collection(db, 'posts', postId, 'replies'),
        orderBy('createdAt', 'asc')
      );

      const unsubscribe = onSnapshot(repliesQuery, (snapshot) => {
        const repliesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt || Date.now()),
          updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : null
        }));
        
        setReplies(repliesData);
        setLoadingReplies(false);
      }, (error) => {
        console.error('Error loading replies:', error);
        setLoadingReplies(false);
      });

      // Store for cleanup
      replyUnsubRef.current = unsubscribe;

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up replies listener:', error);
      setLoadingReplies(false);
    }
  };

  /**
   * Check if current user is post author
   */
  const isPostAuthor = () => {
    return currentUser && post && (post.authorId === currentUser.uid);
  };

  /**
   * Check if current user is reply author
   */
  const isReplyAuthor = (reply) => {
    return currentUser && (reply.authorId === currentUser.uid);
  };

  /**
   * Check if post is liked by current user
   */
  const isPostLikedByUser = () => {
    return currentUser && postReactions && postReactions.includes(currentUser.uid);
  };

  /**
   * Handle post reactions (like/unlike)
   */
  const handlePostReaction = async (isCurrentlyLiked) => {
    if (!currentUser) {
      showWarningMessage('Please login to react to posts');
      return;
    }

    if (!post) return;

    setSubmittingReaction(true);

    try {
      await safeFirestoreOperation(async () => {
        const postRef = doc(db, 'posts', postId);
        
        if (isCurrentlyLiked) {
          await updateDoc(postRef, {
            likes: arrayRemove(currentUser.uid),
            likeCount: increment(-1),
            updatedAt: serverTimestamp()
          });
          
          setPostReactions(prev => prev.filter(uid => uid !== currentUser.uid));
          setReactionCount(prev => Math.max(0, prev - 1));
        } else {
          await updateDoc(postRef, {
            likes: arrayUnion(currentUser.uid),
            likeCount: increment(1),
            updatedAt: serverTimestamp()
          });
          
          setPostReactions(prev => [...prev, currentUser.uid]);
          setReactionCount(prev => prev + 1);
          
          showSuccessMessage('Post liked! ❤️', { autoClose: 1500 });
        }
      }, isCurrentlyLiked ? 'unliking post' : 'liking post');

    } catch (error) {
      console.error('Error reacting to post:', error);
    } finally {
      setSubmittingReaction(false);
    }
  };

  /**
   * Open reactions modal
   */
  const openReactionsModal = async () => {
    if (!postReactions || postReactions.length === 0) {
      setShowReactionsModal(true);
      return;
    }

    setShowReactionsModal(true);

    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('uid', 'in', postReactions.slice(0, 10))
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
      const missingUserIds = postReactions.filter(id => !foundUserIds.includes(id));
      
      const missingUsers = missingUserIds.map(id => ({
        uid: id,
        firstName: '',
        lastName: '',
        displayName: 'She Model Tech Member',
        photoURL: null,
        initials: 'TM',
        profile: {}
      }));

      setReactionsData([...users, ...missingUsers]);
    } catch (error) {
      console.error('Error fetching users who reacted:', error);
      setReactionsData([]);
    }
  };

  /**
   * Handle mention selection for replies
   */
  const handleReplyMentionSelect = (user) => {
    setReplyTaggedUsers(prev => {
      const exists = prev.find(u => u.uid === user.uid);
      if (exists) return prev;
      return [...prev, user];
    });
  };

  /**
   * Remove tagged user from reply
   */
  const handleReplyRemoveTag = (indexOrAll) => {
    if (indexOrAll === 'all') {
      setReplyTaggedUsers([]);
    } else {
      setReplyTaggedUsers(prev => prev.filter((_, i) => i !== indexOrAll));
    }
  };

  /**
   * Submit reply with mentions
   */
  const submitReply = async () => {
    if (!currentUser || !replyText.trim()) return;

    setSubmittingReply(true);

    const mentions = extractMentions(replyText);
    
    try {
      const allTaggedUsers = await safeFirestoreOperation(async () => {
        const mentionedUsers = await validateMentions(mentions);
        const combined = [...replyTaggedUsers];
        
        mentionedUsers.forEach(user => {
          const exists = combined.find(u => u.uid === user.uid);
          if (!exists) {
            combined.push(user);
          }
        });

        await addDoc(collection(db, 'posts', postId, 'replies'), {
          content: replyText.trim(),
          authorName: profilePosterName || currentUser.displayName || currentUser.email,
          authorId: currentUser.uid,
          authorPhoto: currentUser.photoURL || null,
          isCompanyPost: profileIsCompany,
          authorFirstName: currentUser.firstName || '',
          authorLastName: currentUser.lastName || '',
          authorInitials: currentUser.initials || '',
          authorTitle: currentUser.profile?.title || '',
          taggedUsers: combined,
          taggedUserIds: combined.map(user => user.uid),
          mentions: combined.map(user => `@${user.displayName || user.email.split('@')[0]}`),
          createdAt: serverTimestamp()
        });

        if (combined.length > 0) {
          const batch = writeBatch(db);
          
          combined.forEach(user => {
            const notificationRef = doc(collection(db, 'notifications'));
            batch.set(notificationRef, {
              userId: user.uid,
              type: 'reply_mention',
              postId: postId,
              replyContent: replyText.trim(),
              mentionedBy: currentUser.uid,
              mentionedByName: currentUser.displayName || currentUser.email,
              mentionedByFirstName: currentUser.firstName || '',
              mentionedByLastName: currentUser.lastName || '',
              mentionedByPhoto: currentUser.photoURL || null,
              message: `${currentUser.displayName || currentUser.email} mentioned you in a reply`,
              isRead: false,
              createdAt: serverTimestamp()
            });
          });
          
          await batch.commit();

          // Send email notifications
          for (const user of combined) {
            try {
              await safeMentionNotification(
                {
                  userId: user.uid,
                  type: 'reply_mention',
                  postId: postId,
                  mentionedBy: currentUser.uid,
                  mentionedByName: currentUser.displayName || currentUser.email,
                  mentionedByFirstName: currentUser.firstName || '',
                  mentionedByLastName: currentUser.lastName || '',
                  mentionedByPhoto: currentUser.photoURL || null
                },
                user,
                {
                  ...currentUser,
                  firstName: currentUser.firstName || '',
                  lastName: currentUser.lastName || '',
                  profile: currentUser.profile || {}
                },
                {
                  id: postId,
                  content: replyText.trim(),
                  type: 'reply'
                },
                false
              );
            } catch (emailError) {
              console.error('Email notification failed:', emailError);
            }
          }
        }

        return combined;
      }, 'posting reply');

      setReplyText('');
      setReplyTaggedUsers([]);
      
      const tagMessage = allTaggedUsers.length > 0 
        ? ` ${allTaggedUsers.length} user${allTaggedUsers.length !== 1 ? 's' : ''} will be notified.`
        : '';
      showSuccessMessage(`Reply posted successfully!${tagMessage}`);
      
    } catch (error) {
      console.error('Error submitting reply:', error);
      showWarningMessage('Failed to post reply. Please try again.');
    } finally {
      setSubmittingReply(false);
    }
  };

  /**
   * Start editing post
   */
  const startEditingPost = () => {
    setEditingPost(true);
    setEditContent({
      title: post.title || '',
      content: post.content || ''
    });
  };

  /**
   * Cancel post editing
   */
  const cancelEditingPost = () => {
    setEditingPost(false);
    setEditContent({ title: '', content: '' });
  };

  /**
   * Save edited post
   */
  const savePostEdit = async () => {
    if (!editContent.content?.trim()) {
      showWarningMessage('Post content cannot be empty');
      return;
    }

    setSavingEdit(true);

    try {
      await safeFirestoreOperation(async () => {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          title: editContent.title?.trim() || '',
          content: editContent.content.trim(),
          isEdited: true,
          updatedAt: serverTimestamp()
        });
      }, 'updating post');

      setPost(prev => ({
        ...prev,
        title: editContent.title?.trim() || '',
        content: editContent.content.trim(),
        isEdited: true,
        updatedAt: new Date()
      }));

      setEditingPost(false);
      setEditContent({ title: '', content: '' });
      showSuccessMessage('Post updated successfully!');
    } catch (error) {
      console.error('Error updating post:', error);
      showWarningMessage('Failed to update post. Please try again.');
    } finally {
      setSavingEdit(false);
    }
  };

  /**
   * Delete post
   */
  const deletePost = async () => {
    setDeletingPost(true);

    try {
      await safeFirestoreOperation(async () => {
        const postRef = doc(db, 'posts', postId);
        
        // Delete all replies first
        const repliesQuery = query(collection(db, 'posts', postId, 'replies'));
        const repliesSnapshot = await getDocs(repliesQuery);
        
        const batch = writeBatch(db);
        repliesSnapshot.docs.forEach((replyDoc) => {
          batch.delete(replyDoc.ref);
        });
        
        // Delete the post
        batch.delete(postRef);
        
        await batch.commit();
      }, 'deleting post');

      showSuccessMessage('Post deleted successfully');
      navigate('/community');
    } catch (error) {
      console.error('Error deleting post:', error);
      showWarningMessage('Failed to delete post. Please try again.');
    } finally {
      setDeletingPost(false);
    }
  };

  /**
   * Start editing reply
   */
  const startEditingReply = (reply) => {
    setEditingReply(reply.id);
    setEditReplyContent(reply.content);
  };

  /**
   * Cancel reply editing
   */
  const cancelEditingReply = () => {
    setEditingReply(null);
    setEditReplyContent('');
  };

  /**
   * Save edited reply
   */
  const saveReplyEdit = async (replyId) => {
    if (!editReplyContent.trim()) {
      showWarningMessage('Reply content cannot be empty');
      return;
    }

    setSavingReplyEdit(true);

    try {
      await safeFirestoreOperation(async () => {
        const replyRef = doc(db, 'posts', postId, 'replies', replyId);
        await updateDoc(replyRef, {
          content: editReplyContent.trim(),
          isEdited: true,
          updatedAt: serverTimestamp()
        });
      }, 'updating reply');

      setReplies(prev => prev.map(reply => 
        reply.id === replyId 
          ? { 
              ...reply, 
              content: editReplyContent.trim(),
              isEdited: true,
              updatedAt: new Date()
            }
          : reply
      ));

      setEditingReply(null);
      setEditReplyContent('');
      showSuccessMessage('Reply updated successfully!');
    } catch (error) {
      console.error('Error updating reply:', error);
      showWarningMessage('Failed to update reply. Please try again.');
    } finally {
      setSavingReplyEdit(false);
    }
  };

  /**
   * Delete reply
   */
  const deleteReply = async (replyId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) {
      return;
    }

    try {
      await safeFirestoreOperation(async () => {
        const replyRef = doc(db, 'posts', postId, 'replies', replyId);
        await deleteDoc(replyRef);
      }, 'deleting reply');

      setReplies(prev => prev.filter(reply => reply.id !== replyId));
      showSuccessMessage('Reply deleted successfully');
    } catch (error) {
      console.error('Error deleting reply:', error);
      showWarningMessage('Failed to delete reply. Please try again.');
    }
  };

  /**
   * Share post
   */
  const handleSharePost = async () => {
    try {
      const postUrl = window.location.href;
      const success = await copyToClipboard(postUrl);
      
      if (success) {
        showSuccessMessage('📋 Post link copied to clipboard!', { autoClose: 2000 });
      } else {
        prompt('Copy this link to share the post:', postUrl);
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      showWarningMessage('Unable to copy link. Please try again.');
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-gray-50">
        
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-6 xs:py-8 max-w-4xl">
          <div className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-sm p-4 xs:p-5 sm:p-6 md:p-8">
            <div className="animate-pulse space-y-4 xs:space-y-5 sm:space-y-6">
              <div className="h-4 xs:h-5 sm:h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2 xs:space-y-3">
                <div className="h-3 xs:h-4 bg-gray-200 rounded"></div>
                <div className="h-3 xs:h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-6 xs:py-8 max-w-4xl">
          <div className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-sm p-6 xs:p-8 sm:p-10 md:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-5xl xs:text-6xl sm:text-7xl mb-4 xs:mb-5 sm:mb-6">🔍</div>
              <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-2 xs:mb-3 sm:mb-4">
                Post Not Found
              </h2>
              <p className="text-sm xs:text-base text-gray-600 mb-6 xs:mb-7 sm:mb-8">
                The post you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => navigate('/community')}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl font-semibold transition-colors text-sm xs:text-base min-h-[44px]"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      

      <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-4 xs:py-6 sm:py-8 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/community')}
          className="flex items-center text-gray-600 hover:text-pink-600 mb-4 xs:mb-5 sm:mb-6 transition-colors font-medium text-sm xs:text-base group min-h-[44px] px-2"
        >
          <svg className="w-4 h-4 xs:w-5 xs:h-5 mr-1.5 xs:mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        {/* Main Post Card */}
        <div className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow mb-4 xs:mb-5 sm:mb-6">
          <div className="p-4 xs:p-5 sm:p-6 md:p-8">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4 xs:mb-5 sm:mb-6">
              <div className="flex items-start space-x-2 xs:space-x-3 sm:space-x-4 flex-1 min-w-0">
                <ClickableUserAvatar 
                  user={{
                    uid: post.authorId,
                    photoURL: post.authorPhoto,
                    firstName: post.authorFirstName || '',
                    lastName: post.authorLastName || '',
                    initials: post.authorInitials || '',
                    displayName: post.authorName
                  }}
                  className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-2 mb-1">
                    <EnhancedClickableUserName
                      user={{
                        uid: post.authorId,
                        firstName: post.authorFirstName || '',
                        lastName: post.authorLastName || '',
                        displayName: post.authorName,
                        profile: { title: post.authorTitle || '' }
                      }}
                      className="font-bold text-gray-900 hover:text-pink-600 transition-colors text-sm xs:text-base sm:text-lg truncate"
                    />
                    {post.authorTitle && (
                      <span className="text-xs xs:text-sm text-gray-500 truncate">
                        {post.authorTitle}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1 xs:gap-1.5 sm:gap-2 text-[10px] xs:text-xs sm:text-sm text-gray-500">
                    <span>{formatDate(post.createdAt)}</span>
                    <span>•</span>
                    <span>{formatTime(post.createdAt)}</span>
                    {post.isEdited && (
                      <>
                        <span>•</span>
                        <span className="italic">Edited</span>
                      </>
                    )}
                  </div>
                  {currentUser && post.authorId !== currentUser.uid && (
                    <div className="mt-2">
                      <FollowButton 
                        targetUserId={post.authorId}
                        size="sm"
                        className="text-xs xs:text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Post Actions Dropdown */}
              {isPostAuthor() && (
                <div className="relative flex-shrink-0 ml-2">
                  <button
                    onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                    className="p-1.5 xs:p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Post options"
                  >
                    <svg className="w-5 h-5 xs:w-6 xs:h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </button>

                  {showDeleteConfirm && (
                    <div className="absolute right-0 top-full mt-1 xs:mt-2 bg-white rounded-lg xs:rounded-xl shadow-lg border border-gray-200 py-1 xs:py-2 z-10 min-w-[160px] xs:min-w-[180px]">
                      {!editingPost && (
                        <button
                          onClick={() => {
                            startEditingPost();
                            setShowDeleteConfirm(false);
                          }}
                          className="w-full px-3 xs:px-4 py-2 xs:py-2.5 text-left text-xs xs:text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center min-h-[44px]"
                        >
                          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Post
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          if (window.confirm('Are you sure you want to delete this post?')) {
                            deletePost();
                          }
                        }}
                        disabled={deletingPost}
                        className="w-full px-3 xs:px-4 py-2 xs:py-2.5 text-left text-xs xs:text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center disabled:opacity-50 min-h-[44px]"
                      >
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {deletingPost ? 'Deleting...' : 'Delete Post'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Post Content - Edit Mode */}
            {editingPost ? (
              <div className="space-y-3 xs:space-y-4">
                {post.title !== undefined && (
                  <input
                    type="text"
                    value={editContent.title}
                    onChange={(e) => setEditContent({...editContent, title: e.target.value})}
                    placeholder="Post title (optional)"
                    className="w-full px-3 xs:px-4 py-2 xs:py-2.5 border border-gray-300 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm xs:text-base"
                  />
                )}
                <textarea
                  value={editContent.content}
                  onChange={(e) => setEditContent({...editContent, content: e.target.value})}
                  rows={6}
                  placeholder="Post content"
                  className="w-full px-3 xs:px-4 py-2 xs:py-2.5 border border-gray-300 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-vertical text-sm xs:text-base"
                />
                <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                  <button
                    onClick={savePostEdit}
                    disabled={savingEdit || !editContent.content?.trim()}
                    className="flex-1 xs:flex-none bg-pink-600 hover:bg-pink-700 text-white px-4 xs:px-6 py-2 xs:py-2.5 rounded-lg xs:rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm xs:text-base min-h-[44px]"
                  >
                    {savingEdit ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={cancelEditingPost}
                    disabled={savingEdit}
                    className="flex-1 xs:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 xs:px-6 py-2 xs:py-2.5 rounded-lg xs:rounded-xl font-semibold transition-colors disabled:opacity-50 text-sm xs:text-base min-h-[44px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Repost indicator + original content */}
                {post.type === 'repost' && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3 text-pink-500 text-sm">
                      <svg className="w-5 h-5 text-pink-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Reposted from <Link to={`/profile/${post.originalAuthorEmail || ''}`} className="font-semibold hover:underline">{post.originalAuthorName}</Link></span>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        {post.originalAuthorPhoto ? (
                          <img src={post.originalAuthorPhoto} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold">
                            {(post.originalAuthorName || 'U')[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{post.originalAuthorName || 'Unknown'}</p>
                          {post.originalCreatedAt && (
                            <p className="text-xs text-gray-400">
                              {formatDate(post.originalCreatedAt instanceof Date ? post.originalCreatedAt : post.originalCreatedAt?.toDate ? post.originalCreatedAt.toDate() : post.originalCreatedAt?.seconds ? new Date(post.originalCreatedAt.seconds * 1000) : new Date(post.originalCreatedAt))}
                            </p>
                          )}
                        </div>
                      </div>
                      {post.originalTitle && <h3 className="text-base font-bold text-gray-900 mb-2">{post.originalTitle}</h3>}
                      {post.originalContent && (
                        <div className="prose prose-sm max-w-none mb-3">
                          <RichTextContent content={post.originalContent} />
                        </div>
                      )}
                      {post.originalMedia && post.originalMedia.length > 0 && (
                        <div className="mt-3">
                          <ImageGallery images={post.originalMedia} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Post Title */}
                {post.title && (
                  <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-3 xs:mb-4 sm:mb-5 break-words">
                    {post.title}
                  </h1>
                )}

                {/* Post Content */}
                <div className="prose prose-sm xs:prose-base sm:prose-lg max-w-none mb-4 xs:mb-5 sm:mb-6">
                  <RichTextContent content={post.content} />
                </div>

                {/* Tagged Users */}
                {post.taggedUsers && post.taggedUsers.length > 0 && (
                  <div className="mb-4 xs:mb-5 sm:mb-6">
                    <TaggedUsers users={post.taggedUsers} />
                  </div>
                )}

                {/* Post Images */}
                {post.images && post.images.length > 0 && (
                  <div className="mb-4 xs:mb-5 sm:mb-6">
                    <ImageGallery images={post.images} />
                  </div>
                )}

                {/* Engagement Section */}
                <div className="flex flex-wrap items-center gap-3 xs:gap-4 sm:gap-6 pt-4 xs:pt-5 sm:pt-6 border-t border-gray-200">
                  {/* Like Button */}
                  <button
                    onClick={() => handlePostReaction(isPostLikedByUser())}
                    disabled={submittingReaction}
                    className={`flex items-center space-x-1.5 xs:space-x-2 px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl font-semibold transition-all text-xs xs:text-sm sm:text-base min-h-[44px] ${
                      isPostLikedByUser()
                        ? 'bg-pink-50 text-pink-700 hover:bg-pink-50'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className={`w-4 h-4 xs:w-5 xs:h-5 flex-shrink-0 ${isPostLikedByUser() ? 'fill-current' : ''}`} fill={isPostLikedByUser() ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{isPostLikedByUser() ? 'Liked' : 'Like'}</span>
                    {reactionCount > 0 && (
                      <span className="font-bold">({reactionCount})</span>
                    )}
                  </button>

                  {/* Reactions Display */}
                  {reactionCount > 0 && (
                    <div className="flex-shrink-0">
                      <ReactionAvatars
                        reactions={postReactions}
                        onViewAll={openReactionsModal}
                        maxDisplay={3}
                      />
                    </div>
                  )}

                  {/* Reply Count */}
                  <div className="flex items-center space-x-1.5 xs:space-x-2 text-gray-600 text-xs xs:text-sm sm:text-base">
                    <svg className="w-4 h-4 xs:w-5 xs:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="font-medium">{replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}</span>
                  </div>

                  {/* Share Button */}
                  <button
                    onClick={handleSharePost}
                    className="flex items-center space-x-1.5 xs:space-x-2 px-3 xs:px-4 py-1.5 xs:py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg xs:rounded-xl font-semibold transition-colors text-xs xs:text-sm sm:text-base min-h-[44px]"
                  >
                    <svg className="w-4 h-4 xs:w-5 xs:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="hidden xs:inline">Share</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Replies Section */}
        <div className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-sm">
          <div className="p-4 xs:p-5 sm:p-6 md:p-8">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-4 xs:mb-5 sm:mb-6">
              Replies ({replies.length})
            </h2>

            {/* Reply Input */}
            {currentUser && (
              <div className="mb-6 xs:mb-7 sm:mb-8">
                <div className="flex items-start space-x-2 xs:space-x-3">
                  <ClickableUserAvatar
                    user={currentUser}
                    className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <MentionTextarea
                      value={replyText}
                      onChange={setReplyText}
                      onMentionSelect={handleReplyMentionSelect}
                      placeholder="Write a reply..."
                      className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-vertical text-sm xs:text-base"
                      rows={3}
                    />
                    
                    {replyTaggedUsers.length > 0 && (
                      <div className="mt-2 xs:mt-3">
                        <TaggedUsersSmall
                          users={replyTaggedUsers}
                          onRemove={handleReplyRemoveTag}
                          canRemove={true}
                        />
                      </div>
                    )}

                    <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 mt-3 xs:mt-4">
                      <button
                        onClick={submitReply}
                        disabled={submittingReply || !replyText.trim()}
                        className="flex-1 xs:flex-none bg-pink-600 hover:bg-pink-700 text-white px-4 xs:px-6 py-2 xs:py-2.5 rounded-lg xs:rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm xs:text-base min-h-[44px]"
                      >
                        {submittingReply ? 'Posting...' : 'Post Reply'}
                      </button>
                      {replyText.trim() && (
                        <button
                          onClick={() => {
                            setReplyText('');
                            setReplyTaggedUsers([]);
                          }}
                          disabled={submittingReply}
                          className="flex-1 xs:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 xs:px-6 py-2 xs:py-2.5 rounded-lg xs:rounded-xl font-semibold transition-colors text-sm xs:text-base min-h-[44px]"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Replies List */}
            {loadingReplies ? (
              <div className="space-y-4 xs:space-y-5 sm:space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex space-x-2 xs:space-x-3">
                    <div className="rounded-full bg-gray-200 h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 flex-shrink-0"></div>
                    <div className="flex-1 space-y-2 xs:space-y-3">
                      <div className="h-3 xs:h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 xs:h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : replies.length === 0 ? (
              <div className="text-center py-8 xs:py-10 sm:py-12">
                <div className="text-4xl xs:text-5xl sm:text-6xl mb-3 xs:mb-4">💬</div>
                <p className="text-sm xs:text-base text-gray-500">
                  No replies yet. Be the first to reply!
                </p>
              </div>
            ) : (
              <div className="space-y-4 xs:space-y-5 sm:space-y-6">
                {replies.map((reply) => (
                  <div key={reply.id} className="border-b border-gray-200 last:border-0 pb-4 xs:pb-5 sm:pb-6 last:pb-0">
                    <div className="flex items-start space-x-2 xs:space-x-3">
                      <ClickableUserAvatar
                        user={{
                          uid: reply.authorId,
                          photoURL: reply.authorPhoto,
                          firstName: reply.authorFirstName || '',
                          lastName: reply.authorLastName || '',
                          initials: reply.authorInitials || '',
                          displayName: reply.authorName
                        }}
                        className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-0 mb-2 xs:mb-3">
                          <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-2">
                            <EnhancedClickableUserName
                              user={{
                                uid: reply.authorId,
                                firstName: reply.authorFirstName || '',
                                lastName: reply.authorLastName || '',
                                displayName: reply.authorName,
                                profile: { title: reply.authorTitle || '' }
                              }}
                              className="font-bold text-gray-900 hover:text-pink-600 transition-colors text-xs xs:text-sm sm:text-base truncate"
                            />
                            {reply.authorTitle && (
                              <span className="text-[10px] xs:text-xs text-gray-500 truncate">
                                {reply.authorTitle}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 xs:gap-3">
                            <div className="flex items-center gap-1 xs:gap-1.5 text-[10px] xs:text-xs text-gray-500">
                              <span>{formatDate(reply.createdAt)}</span>
                              {reply.isEdited && (
                                <>
                                  <span>•</span>
                                  <span className="italic">Edited</span>
                                </>
                              )}
                            </div>
                            {isReplyAuthor(reply) && (
                              <div className="flex items-center gap-1">
                                {editingReply !== reply.id && (
                                  <button
                                    onClick={() => startEditingReply(reply)}
                                    className="p-1 xs:p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-pink-600 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                                    aria-label="Edit reply"
                                  >
                                    <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteReply(reply.id)}
                                  className="p-1 xs:p-1.5 hover:bg-red-50 rounded text-gray-500 hover:text-red-600 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                                  aria-label="Delete reply"
                                >
                                  <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {editingReply === reply.id ? (
                          <div className="space-y-2 xs:space-y-3">
                            <textarea
                              value={editReplyContent}
                              onChange={(e) => setEditReplyContent(e.target.value)}
                              rows={3}
                              className="w-full px-3 xs:px-4 py-2 xs:py-2.5 border border-gray-300 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-vertical text-sm xs:text-base"
                            />
                            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                              <button
                                onClick={() => saveReplyEdit(reply.id)}
                                disabled={savingReplyEdit || !editReplyContent.trim()}
                                className="flex-1 xs:flex-none bg-pink-600 hover:bg-pink-700 text-white px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs xs:text-sm min-h-[44px]"
                              >
                                {savingReplyEdit ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={cancelEditingReply}
                                disabled={savingReplyEdit}
                                className="flex-1 xs:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl font-semibold transition-colors text-xs xs:text-sm min-h-[44px]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="prose prose-sm xs:prose-base max-w-none text-gray-700 mb-2 xs:mb-3 break-words">
                              <RichTextContent content={reply.content} />
                            </div>
                            {reply.taggedUsers && reply.taggedUsers.length > 0 && (
                              <div className="mt-2 xs:mt-3">
                                <TaggedUsersSmall users={reply.taggedUsers} />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reactions Modal */}
      {showReactionsModal && (
        <ReactionsModal
          isOpen={showReactionsModal}
          onClose={() => {
            setShowReactionsModal(false);
            setReactionsData([]);
          }}
          reactions={reactionsData}
          totalCount={reactionCount}
        />
      )}
    </div>
  );
};

export default SinglePost;
