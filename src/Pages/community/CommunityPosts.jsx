// src/Pages/community/CommunityPosts.jsx - FULLY RESPONSIVE WITH BLUE/ORANGE THEME
// Complete transformation with Universal Navbar, SVG icons, responsive design

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { safeMentionNotification } from '../../utils/emailNotifications';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  limit, 
  startAfter, 
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  writeBatch
} from 'firebase/firestore';
import { db } from '../../firebase/config';

// Import utilities
import { 
  safeFirestoreOperation, 
  showSuccessMessage, 
  showWarningMessage 
} from '../../utils/errorHandler';
import { extractMentions, validateMentions } from '../../utils/mentionUtils';
import { handleFollowToggle, getUserCounts } from '../../utils/followSystem';
import { formatDate, formatTime, copyToClipboard } from '../../utils/communityHelpers';

// Import components
import NotificationBell from '../../components/NotificationBell';
import { ClickableUserAvatar } from '../../components/ClickableUser';
import ImageGallery from '../../components/community/ImageGallery';
import { RichTextContent, TruncatedRichContent } from '../../components/community/LinkRendering';
import { EnhancedClickableUserName, TaggedUsers, TaggedUsersSmall } from '../../components/community/UserComponents';
import MentionTextarea from '../../components/community/MentionTextarea';
import { ReactionAvatars, ReactionsModal } from '../../components/community/ReactionComponents';
import { 
  MobileSidebarToggle, 
  MobileSidebarDrawer 
} from '../../components/community/MobileSidebar';
import { 
  UserQuickLinksSidebar, 
  FollowSuggestionsSidebar,
  CompanyInfoSidebar 
} from '../../components/community/Sidebars';

const CommunityPosts = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // UI State
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  
  // Posts State
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [indexError, setIndexError] = useState(false);

  // View Mode State
  const [viewMode, setViewMode] = useState('all');
  const [showViewMenu, setShowViewMenu] = useState(false);

  // Reply State
  const [showReplies, setShowReplies] = useState(new Set());
  const [replies, setReplies] = useState({});
  const [replyText, setReplyText] = useState({});
  const [submittingReply, setSubmittingReply] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});
  const [editingReply, setEditingReply] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState('');
  const [savingReplyEdit, setSavingReplyEdit] = useState(false);
  const [replyCounts, setReplyCounts] = useState({});
  const [replyTaggedUsers, setReplyTaggedUsers] = useState({});

  // Edit State
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete State
  const [deletingPost, setDeletingPost] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Reactions State
  const [postReactions, setPostReactions] = useState({});
  const [reactionCounts, setReactionCounts] = useState({});
  const [showReactionsModal, setShowReactionsModal] = useState(null);
  const [reactionsData, setReactionsData] = useState({});
  const [submittingReaction, setSubmittingReaction] = useState({});

  // Repost State
  const [showRepostModal, setShowRepostModal] = useState(null);
  const [submittingRepost, setSubmittingRepost] = useState(false);

  const CONTENT_LIMIT = 300;
  const POSTS_PER_PAGE = 10;

  // Track reply listeners for cleanup
  const replyUnsubsRef = useRef({});

  // Cleanup all reply listeners on unmount
  useEffect(() => {
    return () => {
      Object.values(replyUnsubsRef.current).forEach(unsub => {
        if (typeof unsub === 'function') unsub();
      });
      replyUnsubsRef.current = {};
    };
  }, []);

  // Mouse tracking
  // Close dropdown menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.view-menu-container')) {
        setShowViewMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleLeftSidebar = () => setLeftSidebarOpen(!leftSidebarOpen);
  const handleCloseSidebars = () => setLeftSidebarOpen(false);
  const handleNavigation = (path) => {
    navigate(path);
    handleCloseSidebars();
  };

  const togglePostExpansion = (postId) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const isPostAuthor = (post) => currentUser && (post.authorId === currentUser.uid);
  const isReplyAuthor = (reply) => currentUser && (reply.authorId === currentUser.uid);

  const handleSharePost = async (postId) => {
    try {
      const postUrl = `${window.location.origin}/community/post/${postId}`;
      const success = await copyToClipboard(postUrl);
      
      if (success) {
        showSuccessMessage('Post link copied to clipboard!', { autoClose: 2000 });
      } else {
        prompt('Copy this link to share the post:', postUrl);
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      showWarningMessage('Unable to copy link. Please try again.');
    }
  };

  const loadPostReactions = (posts) => {
    const reactions = {};
    const counts = {};
    
    posts.forEach(post => {
      reactions[post.id] = post.likes || [];
      counts[post.id] = post.likeCount || 0;
      if (!post.repostCount) post.repostCount = 0;
      if (!post.reposts) post.reposts = [];
    });
    
    setPostReactions(prev => ({ ...prev, ...reactions }));
    setReactionCounts(prev => ({ ...prev, ...counts }));
  };

  const loadReplyCounts = async (posts) => {
    const counts = {};
    
    // Fetch reply counts in parallel instead of sequentially
    await Promise.all(
      posts.map(async (post) => {
        try {
          await safeFirestoreOperation(async () => {
            const repliesQuery = query(collection(db, 'posts', post.id, 'replies'));
            const snapshot = await getDocs(repliesQuery);
            counts[post.id] = snapshot.size;
          }, `loading reply count for post ${post.id}`);
        } catch (error) {
          counts[post.id] = 0;
        }
      })
    );
    
    setReplyCounts(prev => ({ ...prev, ...counts }));
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let q;
        
        if (viewMode === 'myPosts' && currentUser) {
          q = query(
            collection(db, 'posts'),
            where('authorId', '==', currentUser.uid),
            limit(POSTS_PER_PAGE)
          );
        } else if (viewMode === 'mentions' && currentUser) {
          q = query(
            collection(db, 'posts'),
            where('taggedUserIds', 'array-contains', currentUser.uid),
            limit(POSTS_PER_PAGE)
          );
        } else {
          q = query(
            collection(db, 'posts'),
            orderBy('createdAt', 'desc'),
            limit(POSTS_PER_PAGE)
          );
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const postsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt || Date.now()),
            updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : null,
            authorId: doc.data().authorId
          }))
          // Sort newest-first client-side (filtered views drop orderBy to avoid index need).
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          
          setPosts(postsData);
          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
          setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
          setLoading(false);

          loadPostReactions(postsData);
          loadReplyCounts(postsData);
        }, (error) => {
          console.error('Error fetching posts:', error);
          
          if (error.code === 'failed-precondition' && error.message.includes('index')) {
            setIndexError(true);
            showWarningMessage('Unable to load posts at the moment. Please try again in a few minutes.');
          } else {
            showWarningMessage('Unable to load posts. Please check your connection and try again.');
          }
          
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error setting up posts listener:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentUser, viewMode]);

  const loadMorePosts = async () => {
    if (!hasMore || loadingMore || !lastDoc) return;
    
    setLoadingMore(true);
    
    try {
      await safeFirestoreOperation(async () => {
        let q;

        // Filtered views (myPosts/mentions) drop orderBy to avoid composite indexes,
        // so cursor pagination doesn't apply - they show the first page only.
        if ((viewMode === 'myPosts' || viewMode === 'mentions')) {
          setHasMore(false);
          return;
        }

        if (viewMode === 'myPosts' && currentUser) {
          q = query(
            collection(db, 'posts'),
            where('authorId', '==', currentUser.uid),
            orderBy('createdAt', 'desc'),
            startAfter(lastDoc),
            limit(POSTS_PER_PAGE)
          );
        } else if (viewMode === 'mentions' && currentUser) {
          q = query(
            collection(db, 'posts'),
            where('taggedUserIds', 'array-contains', currentUser.uid),
            orderBy('createdAt', 'desc'),
            startAfter(lastDoc),
            limit(POSTS_PER_PAGE)
          );
        } else {
          q = query(
            collection(db, 'posts'),
            orderBy('createdAt', 'desc'),
            startAfter(lastDoc),
            limit(POSTS_PER_PAGE)
          );
        }

        const snapshot = await getDocs(q);
        const newPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt || Date.now()),
          updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : null,
          authorId: doc.data().authorId
        }));

        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === POSTS_PER_PAGE);
        
        loadPostReactions(newPosts);
        loadReplyCounts(newPosts);
      }, 'loading more posts');
    } catch (error) {
      console.error('Error loading more posts:', error);
      showWarningMessage('Failed to load more posts. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  };

  const changeViewMode = (mode) => {
    if (mode !== viewMode) {
      setViewMode(mode);
      setShowViewMenu(false);
      setPosts([]);
      setLoading(true);
      setHasMore(true);
      setLastDoc(null);
      setIndexError(false);
      setReplyCounts({});
      setPostReactions({});
      setReactionCounts({});
    }
  };

  const handlePostReaction = async (postId, isCurrentlyLiked) => {
    if (!currentUser) {
      showWarningMessage('Please login to react to posts');
      return;
    }

    setSubmittingReaction(prev => ({ ...prev, [postId]: true }));

    try {
      await safeFirestoreOperation(async () => {
        const postRef = doc(db, 'posts', postId);
        
        if (isCurrentlyLiked) {
          await updateDoc(postRef, {
            likes: arrayRemove(currentUser.uid),
            likeCount: increment(-1),
            updatedAt: serverTimestamp()
          });
          
          setPostReactions(prev => ({
            ...prev,
            [postId]: (prev[postId] || []).filter(uid => uid !== currentUser.uid)
          }));
          setReactionCounts(prev => ({
            ...prev,
            [postId]: Math.max(0, (prev[postId] || 0) - 1)
          }));
        } else {
          await updateDoc(postRef, {
            likes: arrayUnion(currentUser.uid),
            likeCount: increment(1),
            updatedAt: serverTimestamp()
          });
          
          setPostReactions(prev => ({
            ...prev,
            [postId]: [...(prev[postId] || []), currentUser.uid]
          }));
          setReactionCounts(prev => ({
            ...prev,
            [postId]: (prev[postId] || 0) + 1
          }));
          
          showSuccessMessage('Post liked!', { autoClose: 1500 });
        }
      }, isCurrentlyLiked ? 'unliking post' : 'liking post');

    } catch (error) {
      console.error('Error reacting to post:', error);
    } finally {
      setSubmittingReaction(prev => ({ ...prev, [postId]: false }));
    }
  };

  const isPostLikedByUser = (postId) => {
    return currentUser && postReactions[postId] && postReactions[postId].includes(currentUser.uid);
  };

  const openReactionsModal = async (postId, userIds) => {
    if (!userIds || userIds.length === 0) {
      setShowReactionsModal(postId);
      return;
    }

    setShowReactionsModal(postId);
    
    if (reactionsData[postId]) {
      return;
    }

    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('uid', 'in', userIds.slice(0, 10))
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
      const missingUserIds = userIds.filter(id => !foundUserIds.includes(id));
      
      const missingUsers = missingUserIds.map(id => ({
        uid: id,
        firstName: '',
        lastName: '',
        displayName: 'She Model Tech Member',
        photoURL: null,
        initials: 'TM',
        profile: {}
      }));

      const allUsers = [...users, ...missingUsers];

      setReactionsData(prev => ({
        ...prev,
        [postId]: allUsers
      }));

    } catch (error) {
      console.error('Error fetching users who reacted to post:', error);
      setReactionsData(prev => ({
        ...prev,
        [postId]: []
      }));
    }
  };

  const closeReactionsModal = () => {
    setShowReactionsModal(null);
  };

  const loadReplies = async (postId) => {
    // Unsubscribe any existing listener for this post before creating a new one
    if (replyUnsubsRef.current[postId]) {
      replyUnsubsRef.current[postId]();
      delete replyUnsubsRef.current[postId];
    }

    setLoadingReplies(prev => ({ ...prev, [postId]: true }));
    
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
        
        setReplies(prev => ({
          ...prev,
          [postId]: repliesData
        }));
        setLoadingReplies(prev => ({ ...prev, [postId]: false }));
      }, (error) => {
        console.error('Error fetching replies:', error);
        showWarningMessage('Unable to load replies. Please try again.');
        setLoadingReplies(prev => ({ ...prev, [postId]: false }));
      });

      // Store the unsubscriber for cleanup
      replyUnsubsRef.current[postId] = unsubscribe;

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up replies listener:', error);
      showWarningMessage('Unable to load replies. Please try again.');
      setLoadingReplies(prev => ({ ...prev, [postId]: false }));
    }
  };

  const toggleReplies = (postId) => {
    setShowReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        // Unsubscribe the reply listener when collapsing
        if (replyUnsubsRef.current[postId]) {
          replyUnsubsRef.current[postId]();
          delete replyUnsubsRef.current[postId];
        }
      } else {
        newSet.add(postId);
        if (!replies[postId]) {
          loadReplies(postId);
        }
      }
      return newSet;
    });
  };

  const handleReplyMentionSelect = (postId, user) => {
    setReplyTaggedUsers(prev => ({
      ...prev,
      [postId]: [
        ...(prev[postId] || []).filter(u => u.uid !== user.uid),
        user
      ]
    }));
  };

  const handleReplyRemoveTag = (postId, indexOrAll) => {
    setReplyTaggedUsers(prev => {
      if (indexOrAll === 'all') {
        return {
          ...prev,
          [postId]: []
        };
      } else {
        return {
          ...prev,
          [postId]: (prev[postId] || []).filter((_, i) => i !== indexOrAll)
        };
      }
    });
  };

  const handleReplyChange = (postId, text) => {
    setReplyText(prev => ({ ...prev, [postId]: text }));
  };

  const submitReply = async (postId) => {
    if (!currentUser || !replyText[postId]?.trim()) return;

    setSubmittingReply(prev => ({ ...prev, [postId]: true }));

    const mentions = extractMentions(replyText[postId]);
    
    try {
      const allTaggedUsers = await safeFirestoreOperation(async () => {
        const mentionedUsers = await validateMentions(mentions);
        const explicitlyTagged = replyTaggedUsers[postId] || [];
        const combined = [...explicitlyTagged];
        
        mentionedUsers.forEach(user => {
          const exists = combined.find(u => u.uid === user.uid);
          if (!exists) {
            combined.push(user);
          }
        });

        await addDoc(collection(db, 'posts', postId, 'replies'), {
          content: replyText[postId].trim(),
          authorName: currentUser.displayName || currentUser.email,
          authorId: currentUser.uid,
          authorPhoto: currentUser.photoURL || null,
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
          const notifications = combined.map(user => ({
            userId: user.uid,
            type: 'reply_mention',
            postId: postId,
            replyContent: replyText[postId].trim(),
            mentionedBy: currentUser.uid,
            mentionedByName: currentUser.displayName || currentUser.email,
            mentionedByFirstName: currentUser.firstName || '',
            mentionedByLastName: currentUser.lastName || '',
            mentionedByPhoto: currentUser.photoURL || null,
            message: `${currentUser.displayName || currentUser.email} mentioned you in a reply`,
            isRead: false,
            createdAt: serverTimestamp()
          }));
          
          for (const notification of notifications) {
            await addDoc(collection(db, 'notifications'), notification);
            
            const taggedUser = combined.find(user => user.uid === notification.userId);
            if (taggedUser) {
              try {
                await safeMentionNotification(
                  notification,
                  taggedUser,
                  {
                    ...currentUser,
                    firstName: currentUser.firstName || '',
                    lastName: currentUser.lastName || '',
                    profile: currentUser.profile || {}
                  },
                  {
                    id: postId,
                    content: replyText[postId].trim(),
                    type: 'reply'
                  },
                  false
                );
              } catch (emailError) {
                console.error('Email notification failed:', emailError);
              }
            }
          }
        }

        return combined;
      }, 'posting reply');

      setReplyText(prev => ({ ...prev, [postId]: '' }));
      setReplyTaggedUsers(prev => ({ ...prev, [postId]: [] }));
      
      setReplyCounts(prev => ({
        ...prev,
        [postId]: (prev[postId] || 0) + 1
      }));
      
      const tagMessage = allTaggedUsers.length > 0 
        ? ` ${allTaggedUsers.length} user${allTaggedUsers.length !== 1 ? 's' : ''} will be notified.`
        : '';
      showSuccessMessage(`Reply posted successfully!${tagMessage}`);
      
    } catch (error) {
      console.error('Error submitting reply:', error);
      showWarningMessage('Failed to post reply. Please try again.');
    } finally {
      setSubmittingReply(prev => ({ ...prev, [postId]: false }));
    }
  };

  const startEditingPost = (post) => {
    setEditingPost(post.id);
    setEditContent(prev => ({
      ...prev,
      [post.id]: {
        title: post.title || '',
        content: post.content || ''
      }
    }));
  };

  const cancelEditingPost = () => {
    setEditingPost(null);
    setEditContent({});
  };

  const savePostEdit = async (postId) => {
    if (!editContent[postId]?.content?.trim()) {
      showWarningMessage('Post content cannot be empty');
      return;
    }

    setSavingEdit(true);

    try {
      await safeFirestoreOperation(async () => {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          title: editContent[postId].title?.trim() || '',
          content: editContent[postId].content.trim(),
          isEdited: true,
          updatedAt: serverTimestamp()
        });
      }, 'updating post');

      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              title: editContent[postId].title?.trim() || '',
              content: editContent[postId].content.trim(),
              isEdited: true,
              updatedAt: new Date()
            }
          : post
      ));

      setEditingPost(null);
      setEditContent({});
      showSuccessMessage('Post updated successfully!');
    } catch (error) {
      console.error('Error updating post:', error);
      showWarningMessage('Failed to update post. Please try again.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleEditContentChange = (postId, field, value) => {
    setEditContent(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        [field]: value
      }
    }));
  };

  const deletePost = async (postId) => {
    setDeletingPost(prev => ({ ...prev, [postId]: true }));

    try {
      await safeFirestoreOperation(async () => {
        const postRef = doc(db, 'posts', postId);
        
        const repliesQuery = query(collection(db, 'posts', postId, 'replies'));
        const repliesSnapshot = await getDocs(repliesQuery);
        
        const batch = writeBatch(db);
        repliesSnapshot.docs.forEach((replyDoc) => {
          batch.delete(replyDoc.ref);
        });
        
        batch.delete(postRef);
        
        await batch.commit();
      }, 'deleting post');

      setPosts(prev => prev.filter(post => post.id !== postId));
      setShowDeleteConfirm(null);
      showSuccessMessage('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      showWarningMessage('Failed to delete post. Please try again.');
    } finally {
      setDeletingPost(prev => ({ ...prev, [postId]: false }));
    }
  };

  const startEditingReply = (reply) => {
    setEditingReply(reply.id);
    setEditReplyContent(reply.content);
  };

  const cancelEditingReply = () => {
    setEditingReply(null);
    setEditReplyContent('');
  };

  const saveReplyEdit = async (postId, replyId) => {
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

      setReplies(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).map(reply => 
          reply.id === replyId 
            ? { 
                ...reply, 
                content: editReplyContent.trim(),
                isEdited: true,
                updatedAt: new Date()
              }
            : reply
        )
      }));

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

  const deleteReply = async (postId, replyId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) {
      return;
    }

    try {
      await safeFirestoreOperation(async () => {
        const replyRef = doc(db, 'posts', postId, 'replies', replyId);
        await deleteDoc(replyRef);
      }, 'deleting reply');

      setReplies(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(reply => reply.id !== replyId)
      }));
      
      setReplyCounts(prev => ({
        ...prev,
        [postId]: Math.max(0, (prev[postId] || 1) - 1)
      }));

      showSuccessMessage('Reply deleted successfully');
    } catch (error) {
      console.error('Error deleting reply:', error);
      showWarningMessage('Failed to delete reply. Please try again.');
    }
  };

  const hasUserReposted = (post) => {
    return currentUser && post.reposts && post.reposts.includes(currentUser.uid);
  };

  const openRepostModal = (postId) => {
    setShowRepostModal(postId);
  };

  const closeRepostModal = () => {
    setShowRepostModal(null);
  };

  const handleRepost = async (originalPostId) => {
    if (!currentUser) {
      showWarningMessage('Please login to repost');
      return;
    }

    const originalPost = posts.find(p => p.id === originalPostId);
    if (!originalPost) {
      showWarningMessage('Original post not found');
      return;
    }

    if (hasUserReposted(originalPost)) {
      showWarningMessage('You have already reposted this');
      return;
    }

    setSubmittingRepost(true);

    try {
      await safeFirestoreOperation(async () => {
        // If reposting a repost, trace back to the root original content
        const isRepostOfRepost = originalPost.type === 'repost';
        const rootAuthorId = isRepostOfRepost ? originalPost.originalAuthorId : originalPost.authorId;
        const rootAuthorName = isRepostOfRepost ? originalPost.originalAuthorName : (originalPost.authorName || 'Unknown');
        const rootAuthorEmail = isRepostOfRepost ? originalPost.originalAuthorEmail : (originalPost.authorEmail || '');
        const rootAuthorPhoto = isRepostOfRepost ? originalPost.originalAuthorPhoto : (originalPost.authorPhoto || null);
        const rootContent = isRepostOfRepost ? originalPost.originalContent : (originalPost.content || '');
        const rootTitle = isRepostOfRepost ? originalPost.originalTitle : (originalPost.title || '');
        const rootCreatedAt = isRepostOfRepost ? originalPost.originalCreatedAt : originalPost.createdAt;
        const rootMedia = isRepostOfRepost ? (originalPost.originalMedia || []) : (originalPost.media || []);
        const rootTaggedUsers = isRepostOfRepost ? (originalPost.originalTaggedUsers || []) : (originalPost.taggedUsers || []);

        const repostData = {
          type: 'repost',
          originalPostId: originalPostId,
          originalAuthorId: rootAuthorId,
          originalAuthorName: rootAuthorName,
          originalAuthorEmail: rootAuthorEmail,
          originalAuthorPhoto: rootAuthorPhoto,
          originalContent: rootContent,
          originalTitle: rootTitle,
          originalCreatedAt: rootCreatedAt,
          originalMedia: rootMedia,
          originalTaggedUsers: rootTaggedUsers,
          authorName: currentUser.displayName || currentUser.email,
          authorId: currentUser.uid,
          authorEmail: currentUser.email,
          authorPhoto: currentUser.photoURL || null,
          authorFirstName: currentUser.firstName || '',
          authorLastName: currentUser.lastName || '',
          authorInitials: currentUser.initials || '',
          authorTitle: currentUser.profile?.title || '',
          createdAt: serverTimestamp(),
          likes: [],
          likeCount: 0,
          repostCount: 0,
          reposts: []
        };

        await addDoc(collection(db, 'posts'), repostData);

        const originalPostRef = doc(db, 'posts', originalPostId);
        await updateDoc(originalPostRef, {
          reposts: arrayUnion(currentUser.uid),
          repostCount: increment(1),
          updatedAt: serverTimestamp()
        });

        setPosts(prev => prev.map(post => 
          post.id === originalPostId 
            ? { 
                ...post, 
                reposts: [...(post.reposts || []), currentUser.uid],
                repostCount: (post.repostCount || 0) + 1
              }
            : post
        ));
      }, 'creating repost');

      closeRepostModal();
      showSuccessMessage('Post reposted successfully!');
    } catch (error) {
      console.error('Error reposting:', error);
      showWarningMessage('Failed to repost. Please try again.');
    } finally {
      setSubmittingRepost(false);
    }
  };

  const RepostModal = ({ postId }) => {
    if (!showRepostModal || showRepostModal !== postId) return null;

    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    return (
      <div 
        className="fixed inset-0 bg-gray-500 z-[150] flex items-center justify-center p-3 xs:p-4"
        onClick={closeRepostModal}
      >
        <div 
          className="bg-white rounded-xl xs:rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 xs:p-5 sm:p-6 border-b border-gray-200">
            <h3 className="text-base xs:text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Repost to your feed?
            </h3>
            <button
              onClick={closeRepostModal}
              className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px]"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4 xs:p-5 sm:p-6">
            <div className="bg-gray-50 rounded-lg p-3 xs:p-4 border border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white font-bold">
                  {post.authorPhoto ? (
                    <img src={post.authorPhoto} alt="" loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <span>{(post.authorName || 'U').charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">{post.authorName || 'Unknown'}{}</p>
                  <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
                </div>
              </div>
              
              {post.title && (
                <h4 className="font-bold text-gray-900 mb-2 text-sm">{post.title}</h4>
              )}
              
              <RichTextContent 
                content={post.content?.substring(0, 200) + (post.content?.length > 200 ? '...' : '')}
                className="text-gray-600 text-xs xs:text-sm"
              />
              
              {post.media && post.media.length > 0 && (
                <div className="mt-3">
                  <div className="text-blue-600 text-xs flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {post.media.length} image{post.media.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 xs:mt-4 p-3 xs:p-4 bg-blue-600/10 border border-gray-200 rounded-lg">
              <p className="text-blue-500 text-xs xs:text-sm flex items-start gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                This will share the post to your followers and appear in your feed
              </p>
            </div>
          </div>

          <div className="p-4 xs:p-5 sm:p-6 border-t border-gray-200 bg-gray-100">
            <div className="flex gap-2 xs:gap-3">
              <button
                onClick={closeRepostModal}
                disabled={submittingRepost}
                className="flex-1 px-3 xs:px-4 py-2 xs:py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium disabled:opacity-50 min-h-[44px] text-sm xs:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRepost(postId)}
                disabled={submittingRepost}
                className="flex-1 px-3 xs:px-4 py-2 xs:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] text-sm xs:text-base"
              >
                {submittingRepost ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Reposting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Repost
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading && posts.length === 0) {
    return (
      <>
        
        <div className="min-h-screen bg-white flex items-center justify-center px-3 xs:px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm xs:text-base">Loading She Model Tech Community...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      
      <div className="min-h-screen overflow-x-hidden " style={{ backgroundColor: '#ffffff' }}>

        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 py-4 xs:py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

            {/* Left Sidebar - desktop only */}
            <aside className="hidden lg:block lg:col-span-3">
              <UserQuickLinksSidebar currentUser={currentUser} onNavigate={handleNavigation} />
            </aside>

            <main className="lg:col-span-6">
              {indexError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h3 className="text-red-400 font-semibold mb-1">Service Temporarily Unavailable</h3>
                      <p className="text-gray-600 text-sm">
                        We're experiencing technical difficulties. Our team has been notified and is working on it. Please try again in a few minutes.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4 xs:mb-6">
                {/* Start a post - LinkedIn style */}
                <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 mb-4">
                  <div className="flex items-center gap-3">
                    {currentUser?.photoURL ? (
                      <img src={currentUser.photoURL} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {currentUser?.displayName?.[0] || 'U'}
                      </div>
                    )}
                    <Link
                      to="/community/submit"
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-full text-gray-500 text-sm hover:bg-gray-100 transition-colors text-left"
                    >
                      Start a post
                    </Link>
                  </div>
                </div>

                {/* Filter */}
                <div className="relative view-menu-container flex justify-end">
                  <button
                    onClick={() => setShowViewMenu(!showViewMenu)}
                    className="flex items-center gap-2 px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg xs:rounded-xl transition-all duration-300 min-h-[44px] text-sm xs:text-base text-gray-900"
                  >
                    <span className="font-medium">
                      {viewMode === 'all' && 'All Posts'}
                      {viewMode === 'myPosts' && 'My Posts'}
                      {viewMode === 'mentions' && 'Mentions'}
                    </span>
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showViewMenu && (
                    <div className="absolute top-full mt-2 w-48 xs:w-56 bg-white border border-gray-200 rounded-lg xs:rounded-xl shadow-2xl overflow-hidden z-50">
                      <button
                        onClick={() => changeViewMode('all')}
                        className={`w-full text-left px-3 xs:px-4 py-2.5 xs:py-3 hover:bg-gray-100 transition-colors text-sm xs:text-base ${
                          viewMode === 'all' ? 'bg-blue-600/20 text-blue-500' : 'text-gray-900'
                        }`}
                      >
                        All Posts
                      </button>
                      <button
                        onClick={() => changeViewMode('myPosts')}
                        className={`w-full text-left px-3 xs:px-4 py-2.5 xs:py-3 hover:bg-gray-100 transition-colors text-sm xs:text-base ${
                          viewMode === 'myPosts' ? 'bg-blue-600/20 text-blue-500' : 'text-gray-900'
                        }`}
                      >
                        My Posts
                      </button>
                      <button
                        onClick={() => changeViewMode('mentions')}
                        className={`w-full text-left px-3 xs:px-4 py-2.5 xs:py-3 hover:bg-gray-100 transition-colors text-sm xs:text-base ${
                          viewMode === 'mentions' ? 'bg-blue-600/20 text-blue-500' : 'text-gray-900'
                        }`}
                      >
                        Mentions
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 xs:space-y-5 sm:space-y-6">
                {posts.length === 0 && !loading ? (
                  <div className="text-center py-12 xs:py-14 sm:py-16">
                    <svg className="w-16 h-16 xs:w-20 xs:h-20 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="text-xl xs:text-2xl font-bold text-gray-900 mb-2">
                      {viewMode === 'myPosts' && 'No Posts Yet'}
                      {viewMode === 'mentions' && 'No Mentions Yet'}
                      {viewMode === 'all' && 'No Posts Yet'}
                    </h3>
                    <p className="text-gray-400 mb-6 text-sm xs:text-base">
                      {viewMode === 'myPosts' && 'Share your first post with the home feed!'}
                      {viewMode === 'mentions' && 'No one has mentioned you in a post yet'}
                      {viewMode === 'all' && 'Be the first to share something!'}
                    </p>
                    {viewMode !== 'mentions' && (
                      <Link
                        to="/community/submit"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all min-h-[48px]"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Post
                      </Link>
                    )}
                  </div>
                ) : (
                  posts.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all overflow-hidden"
                    >
                      <div className="p-3 xs:p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-3 xs:mb-4">
                          <div className="flex items-start gap-2 xs:gap-3 flex-1 min-w-0">
                            <ClickableUserAvatar 
                              user={{
                                uid: post.authorId,
                                email: post.authorEmail,
                                photoURL: post.authorPhoto,
                                firstName: post.authorFirstName,
                                lastName: post.authorLastName,
                                displayName: post.authorName,
                                initials: post.authorInitials
                              }}
                              size="md"
                              className="flex-shrink-0"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center flex-wrap gap-2">
                                <EnhancedClickableUserName
                                  user={{
                                    uid: post.authorId,
                                    email: post.authorEmail,
                                    firstName: post.authorFirstName,
                                    lastName: post.authorLastName,
                                    displayName: post.authorName
                                  }}
                                  className="font-semibold text-gray-900 hover:text-blue-500 transition-colors text-sm xs:text-base"
                                />
                                
                                {post.authorTitle && (
                                  <span className="text-blue-600 text-xs bg-blue-600/20 px-2 xs:px-2.5 py-0.5 xs:py-1 rounded-full border border-gray-200 hidden sm:inline">
                                    {post.authorTitle}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs xs:text-sm text-gray-400 mt-0.5 xs:mt-1">
                                <span>{formatDate(post.createdAt)}</span>
                                <span>•</span>
                                <span>{formatTime(post.createdAt)}</span>
                                {post.isEdited && (
                                  <>
                                    <span>•</span>
                                    <span className="text-blue-600 italic">Edited</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {isPostAuthor(post) && (
                            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                              {editingPost !== post.id && (
                                <>
                                  <button
                                    onClick={() => startEditingPost(post)}
                                    className="p-1.5 xs:p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                    title="Edit post"
                                  >
                                    <svg className="h-4 w-4 xs:h-5 xs:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteConfirm(post.id)}
                                    disabled={deletingPost[post.id]}
                                    className="p-1.5 xs:p-2 text-gray-400 hover:text-red-400 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                    title="Delete post"
                                  >
                                    {deletingPost[post.id] ? (
                                      <div className="animate-spin rounded-full h-4 w-4 xs:h-5 xs:w-5 border-b-2 border-red-400"></div>
                                    ) : (
                                      <svg className="h-4 w-4 xs:h-5 xs:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    )}
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {showDeleteConfirm === post.id && (
                          <div className="mb-4 p-3 xs:p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-red-400 font-medium mb-3 text-sm xs:text-base">
                              Are you sure you want to delete this post? This action cannot be undone.
                            </p>
                            <div className="flex gap-2 xs:gap-3">
                              <button
                                onClick={() => deletePost(post.id)}
                                disabled={deletingPost[post.id]}
                                className="flex-1 px-3 xs:px-4 py-2 bg-red-500 hover:bg-red-600 text-gray-900 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm xs:text-base min-h-[44px]"
                              >
                                {deletingPost[post.id] ? 'Deleting...' : 'Delete'}
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(null)}
                                disabled={deletingPost[post.id]}
                                className="flex-1 px-3 xs:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-900 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm xs:text-base min-h-[44px]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {post.type === 'repost' && (
  <div className="mb-3 xs:mb-4">
    <div className="flex items-center gap-2 mb-2 text-blue-500 text-xs xs:text-sm">
      <svg className="w-4 h-4 xs:w-5 xs:h-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <span>Reposted from <span className="font-semibold">{post.originalAuthorName}</span></span>
    </div>
    
    {/* Original Post Content Card */}
    <div className="p-3 xs:p-4 bg-gray-50 border border-gray-200 rounded-lg">
      {/* Original Author Info */}
      <div className="flex items-center gap-2 xs:gap-3 mb-3">
        <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
          {post.originalAuthorPhoto ? (
            <img src={post.originalAuthorPhoto} alt="" loading="lazy" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs xs:text-sm">{(post.originalAuthorName || 'U').charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-xs xs:text-sm">{post.originalAuthorName || 'Unknown'}</p>
          {post.originalCreatedAt && (
  <p className="text-[10px] xs:text-xs text-gray-400">
    {formatDate(
      post.originalCreatedAt instanceof Date 
        ? post.originalCreatedAt 
        : post.originalCreatedAt?.toDate 
          ? post.originalCreatedAt.toDate() 
          : post.originalCreatedAt?.seconds 
            ? new Date(post.originalCreatedAt.seconds * 1000) 
            : new Date(post.originalCreatedAt)
    )}
  </p>
)}
        </div>
      </div>

      {/* Original Title */}
      {post.originalTitle && (
        <h3 className="text-sm xs:text-base font-bold text-gray-900 mb-2">{post.originalTitle}</h3>
      )}

      {/* Original Content */}
      {post.originalContent && (
        <TruncatedRichContent
          content={post.originalContent}
          postId={`repost-${post.id}`}
          limit={CONTENT_LIMIT}
          expandedPosts={expandedPosts}
          onToggleExpansion={togglePostExpansion}
        />
      )}

      {/* Original Tagged Users */}
      {post.originalTaggedUsers && post.originalTaggedUsers.length > 0 && (
        <TaggedUsers taggedUsers={post.originalTaggedUsers} />
      )}

      {/* Original Media */}
      {post.originalMedia && post.originalMedia.length > 0 && (
        <div className="mt-3">
          <ImageGallery images={post.originalMedia} />
        </div>
      )}
    </div>
  </div>
)}

                        {post.title && editingPost !== post.id && (
                          <h2 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 mb-2 xs:mb-3">
                            {post.title}
                          </h2>
                        )}

                        {editingPost === post.id ? (
                          <div className="space-y-3 xs:space-y-4">
                            <input
                              type="text"
                              value={editContent[post.id]?.title || ''}
                              onChange={(e) => handleEditContentChange(post.id, 'title', e.target.value)}
                              placeholder="Post title (optional)"
                              className="w-full p-2 xs:p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-colors text-sm xs:text-base"
                            />
                            <textarea
                              value={editContent[post.id]?.content || ''}
                              onChange={(e) => handleEditContentChange(post.id, 'content', e.target.value)}
                              rows={6}
                              className="w-full p-2 xs:p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-colors resize-none text-sm xs:text-base"
                            />
                            <div className="flex gap-2 xs:gap-3">
                              <button
                                onClick={() => savePostEdit(post.id)}
                                disabled={savingEdit}
                                className="flex-1 px-3 xs:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 text-sm xs:text-base min-h-[44px]"
                              >
                                {savingEdit ? 'Saving...' : 'Save Changes'}
                              </button>
                              <button
                                onClick={cancelEditingPost}
                                disabled={savingEdit}
                                className="px-3 xs:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-900 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm xs:text-base min-h-[44px]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <TruncatedRichContent
                              content={post.content}
                              postId={post.id}
                              limit={CONTENT_LIMIT}
                              expandedPosts={expandedPosts}
                              onToggleExpansion={togglePostExpansion}
                            />

                            {post.taggedUsers && post.taggedUsers.length > 0 && (
                              <TaggedUsers taggedUsers={post.taggedUsers} />
                            )}

                            {post.media && post.media.length > 0 && (
                              <ImageGallery images={post.media} />
                            )}
                          </>
                        )}

                        {editingPost !== post.id && (
                          <div className="mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-gray-200 flex items-center justify-between text-xs xs:text-sm">
                            <div className="flex items-center gap-3 xs:gap-4">
                              {reactionCounts[post.id] > 0 && (
                                <ReactionAvatars
                                  postId={post.id}
                                  userIds={postReactions[post.id] || []}
                                  reactionCount={reactionCounts[post.id]}
                                  onClick={() => openReactionsModal(post.id, postReactions[post.id])}
                                />
                              )}
                            </div>
                            
                            <div className="flex items-center gap-3 xs:gap-4 text-gray-400">
                              {replyCounts[post.id] > 0 && (
                                <button
                                  onClick={() => toggleReplies(post.id)}
                                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  {replyCounts[post.id]} {replyCounts[post.id] === 1 ? 'reply' : 'replies'}
                                </button>
                              )}
                              {post.repostCount > 0 && (
                                <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                  <span className="hidden sm:inline">{post.repostCount} {post.repostCount === 1 ? 'repost' : 'reposts'}</span>
                                  <span className="sm:hidden">{post.repostCount}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {editingPost !== post.id && (
                          <div className="mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-gray-200 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 xs:gap-2 flex-wrap">
                              <button
                                onClick={() => handlePostReaction(post.id, isPostLikedByUser(post.id))}
                                disabled={submittingReaction[post.id]}
                                className={`flex items-center gap-1 xs:gap-1.5 px-2 xs:px-3 py-1.5 xs:py-2 rounded-lg font-medium transition-all duration-300 text-xs xs:text-sm min-h-[44px] ${
                                  isPostLikedByUser(post.id)
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-400 border border-gray-200'
                                } disabled:opacity-50`}
                              >
                                {submittingReaction[post.id] ? (
                                  <div className="animate-spin rounded-full h-3 w-3 xs:h-4 xs:w-4 border-b-2 border-current"></div>
                                ) : (
                                  <svg className="w-4 h-4 xs:w-5 xs:h-5" fill={isPostLikedByUser(post.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                )}
                                <span className="hidden sm:inline">Like</span>
                              </button>

                              <button
                                onClick={() => toggleReplies(post.id)}
                                className="flex items-center gap-1 xs:gap-1.5 px-2 xs:px-3 py-1.5 xs:py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-400 hover:text-blue-600 font-medium transition-all duration-300 text-xs xs:text-sm min-h-[44px]"
                              >
                                <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="hidden sm:inline">Reply</span>
                              </button>

                              <button
                                onClick={() => openRepostModal(post.id)}
                                disabled={hasUserReposted(post)}
                                className={`flex items-center gap-1 xs:gap-1.5 px-2 xs:px-3 py-1.5 xs:py-2 rounded-lg font-medium transition-all duration-300 text-xs xs:text-sm min-h-[44px] ${
                                  hasUserReposted(post)
                                    ? 'bg-blue-600/20 text-blue-600 border border-gray-200 cursor-not-allowed'
                                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-400 hover:text-blue-600'
                                } disabled:opacity-50`}
                              >
                                <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span className="hidden sm:inline">{hasUserReposted(post) ? 'Reposted' : 'Repost'}</span>
                              </button>
                            </div>

                            <button
                              onClick={() => handleSharePost(post.id)}
                              className="flex items-center gap-1 xs:gap-1.5 px-2 xs:px-3 py-1.5 xs:py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-400 hover:text-blue-500 font-medium transition-all duration-300 text-xs xs:text-sm min-h-[44px]"
                            >
                              <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                              <span className="hidden sm:inline">Share</span>
                            </button>
                          </div>
                        )}

                        {showReplies.has(post.id) && (
                          <div className="mt-4 xs:mt-5 sm:mt-6 pt-4 xs:pt-5 sm:pt-6 border-t border-gray-200">
                            <div className="mb-4 xs:mb-5 sm:mb-6">
                              <MentionTextarea
                                value={replyText[post.id] || ''}
                                onChange={(text) => handleReplyChange(post.id, text)}
                                placeholder="Write a reply... Use @ to mention someone"
                                className="w-full p-2 xs:p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-colors resize-none text-sm xs:text-base"
                                rows={3}
                                onMentionSelect={(user) => handleReplyMentionSelect(post.id, user)}
                                showLinkButton={false}
                              />
                              
                              {replyTaggedUsers[post.id] && replyTaggedUsers[post.id].length > 0 && (
                                <TaggedUsersSmall
                                  taggedUsers={replyTaggedUsers[post.id]}
                                  onRemoveTag={(index) => handleReplyRemoveTag(post.id, index)}
                                />
                              )}

                              <button
                                onClick={() => submitReply(post.id)}
                                disabled={!replyText[post.id]?.trim() || submittingReply[post.id]}
                                className="mt-2 xs:mt-3 px-3 xs:px-4 py-1.5 xs:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs xs:text-sm min-h-[44px]"
                              >
                                {submittingReply[post.id] ? 'Posting...' : 'Post Reply'}
                              </button>
                            </div>

                            {loadingReplies[post.id] ? (
                              <div className="text-center py-6 xs:py-8">
                                <div className="animate-spin rounded-full h-6 w-6 xs:h-8 xs:w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                                <p className="text-gray-400 text-xs xs:text-sm">Loading replies...</p>
                              </div>
                            ) : replies[post.id] && replies[post.id].length > 0 ? (
                              <div className="space-y-3 xs:space-y-4">
                                {replies[post.id].map((reply) => (
                                  <div
                                    key={reply.id}
                                    className="bg-gray-50 rounded-lg p-3 xs:p-4 border border-gray-200"
                                  >
                                    <div className="flex items-start gap-2 xs:gap-3">
                                      <ClickableUserAvatar 
                                        user={{
                                          uid: reply.authorId,
                                          photoURL: reply.authorPhoto,
                                          firstName: reply.authorFirstName,
                                          lastName: reply.authorLastName,
                                          displayName: reply.authorName,
                                          initials: reply.authorInitials
                                        }}
                                        size="sm"
                                        className="flex-shrink-0"
                                      />
                                      
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1 xs:mb-2">
                                          <div className="flex items-center flex-wrap gap-2">
                                            <EnhancedClickableUserName
                                              user={{
                                                uid: reply.authorId,
                                                firstName: reply.authorFirstName,
                                                lastName: reply.authorLastName,
                                                displayName: reply.authorName
                                              }}
                                              className="font-semibold text-gray-900 hover:text-blue-500 transition-colors text-xs xs:text-sm"
                                            />
                                            
                                            {reply.authorTitle && (
                                              <span className="text-blue-600 text-xs bg-blue-600/20 px-1.5 py-0.5 rounded-full border border-gray-200 hidden sm:inline">
                                                {reply.authorTitle}
                                              </span>
                                            )}
                                          </div>

                                          {isReplyAuthor(reply) && (
                                            <div className="flex items-center gap-1">
                                              {editingReply !== reply.id && (
                                                <>
                                                  <button
                                                    onClick={() => startEditingReply(reply)}
                                                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                                    title="Edit reply"
                                                  >
                                                    <svg className="h-3 w-3 xs:h-4 xs:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                  </button>
                                                  <button
                                                    onClick={() => deleteReply(post.id, reply.id)}
                                                    className="p-1 text-gray-400 hover:text-red-400 hover:bg-gray-100 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                                    title="Delete reply"
                                                  >
                                                    <svg className="h-3 w-3 xs:h-4 xs:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                  </button>
                                                </>
                                              )}
                                            </div>
                                          )}
                                        </div>

                                        <div className="text-xs text-gray-400 mb-2">
                                          {formatDate(reply.createdAt)} • {formatTime(reply.createdAt)}
                                          {reply.isEdited && (
                                            <span className="ml-2 italic text-blue-600">Edited</span>
                                          )}
                                        </div>

                                        {editingReply === reply.id ? (
                                          <div className="space-y-2 xs:space-y-3">
                                            <textarea
                                              value={editReplyContent}
                                              onChange={(e) => setEditReplyContent(e.target.value)}
                                              rows={3}
                                              className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-colors resize-none text-sm"
                                            />
                                            <div className="flex gap-2">
                                              <button
                                                onClick={() => saveReplyEdit(post.id, reply.id)}
                                                disabled={savingReplyEdit}
                                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 text-xs min-h-[44px]"
                                              >
                                                {savingReplyEdit ? 'Saving...' : 'Save'}
                                              </button>
                                              <button
                                                onClick={cancelEditingReply}
                                                disabled={savingReplyEdit}
                                                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-900 rounded-lg font-medium transition-colors disabled:opacity-50 text-xs min-h-[44px]"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <>
                                            <RichTextContent 
                                              content={reply.content}
                                              className="text-gray-700 leading-relaxed whitespace-pre-wrap text-xs xs:text-sm"
                                            />
                                            
                                            {reply.taggedUsers && reply.taggedUsers.length > 0 && (
                                              <TaggedUsers taggedUsers={reply.taggedUsers} />
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 xs:py-8 text-gray-400 text-xs xs:text-sm">
                                No replies yet. Be the first to reply!
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  ))
                )}

                {hasMore && posts.length > 0 && (
                  <div className="text-center py-6 xs:py-8">
                    <button
                      onClick={loadMorePosts}
                      disabled={loadingMore}
                      className="px-6 xs:px-8 py-3 xs:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg xs:rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 min-h-[56px] text-sm xs:text-base"
                    >
                      {loadingMore ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Loading...
                        </span>
                      ) : (
                        'Load More Posts'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </main>

            <aside className="hidden lg:block lg:col-span-3">
              <div className="space-y-6">
                <FollowSuggestionsSidebar currentUser={currentUser} />
                <CompanyInfoSidebar />
              </div>
            </aside>
          </div>
        </div>

        <MobileSidebarDrawer
          isOpen={leftSidebarOpen}
          onClose={handleCloseSidebars}
          title="Quick Actions"
          position="left"
        >
          <UserQuickLinksSidebar 
            currentUser={currentUser}
            onNavigate={handleNavigation}
            isMobile={true}
          />
        </MobileSidebarDrawer>

        <MobileSidebarToggle
          leftSidebarOpen={leftSidebarOpen}
          onToggleLeftSidebar={handleToggleLeftSidebar}
        />

        {posts.map(post => (
          <RepostModal key={`repost-modal-${post.id}`} postId={post.id} />
        ))}

        <ReactionsModal
          isOpen={showReactionsModal !== null}
          onClose={closeReactionsModal}
          postId={showReactionsModal}
          reactions={reactionsData}
          reactionCount={showReactionsModal ? reactionCounts[showReactionsModal] : 0}
        />
      </div>
    </>
  );
};

export default CommunityPosts;
