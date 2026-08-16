// src/utils/repostUtils.js - Repost utility functions

import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp, 
  increment, 
  arrayUnion 
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Creates a repost of an existing post
 * @param {Object} currentUser - The current authenticated user
 * @param {Object} repostData - The repost data containing originalPost, comment, and taggedUsers
 * @returns {Promise} - Promise that resolves when repost is created
 */
export const createRepost = async (currentUser, repostData) => {
  if (!currentUser) {
    throw new Error('User must be authenticated to create reposts');
  }

  if (!repostData.originalPost) {
    throw new Error('Original post is required for repost');
  }

  try {
    // 🔥 FIXED: Helper function to convert undefined to null for Firestore
    const sanitizeForFirestore = (value) => value === undefined ? null : value;
    
    const originalPost = repostData.originalPost;
    
    // Create the repost document
    const repostDoc = {
      // Repost-specific fields
      isRepost: true,
      originalPostId: originalPost.id,
      originalPost: {
        id: originalPost.id,
        title: sanitizeForFirestore(originalPost.title) || '',
        content: sanitizeForFirestore(originalPost.content) || '',
        authorName: sanitizeForFirestore(originalPost.authorName) || 'Unknown User',
        authorId: sanitizeForFirestore(originalPost.authorId) || '',
        authorPhoto: sanitizeForFirestore(originalPost.authorPhoto), // Will be null if undefined
        authorFirstName: sanitizeForFirestore(originalPost.authorFirstName) || '',
        authorLastName: sanitizeForFirestore(originalPost.authorLastName) || '',
        authorInitials: sanitizeForFirestore(originalPost.authorInitials) || '',
        authorTitle: sanitizeForFirestore(originalPost.authorTitle) || '',
        createdAt: originalPost.createdAt || null,
        images: originalPost.images || []
      },
      repostComment: repostData.comment || '',
      
      // Author information for the reposter
      authorId: currentUser.uid,
      authorName: currentUser.displayName || currentUser.email,
      authorPhoto: sanitizeForFirestore(currentUser.photoURL),
      authorFirstName: sanitizeForFirestore(currentUser.firstName) || '',
      authorLastName: sanitizeForFirestore(currentUser.lastName) || '',
      authorInitials: sanitizeForFirestore(currentUser.initials) || '',
      authorTitle: sanitizeForFirestore(currentUser.profile?.title) || '',
      authorRole: currentUser.role || 'student',
      
      // Tagging fields
      taggedUsers: repostData.taggedUsers || [],
      taggedUserIds: repostData.taggedUserIds || [],
      mentions: repostData.taggedUsers?.map(user => `@${user.displayName || user.email?.split('@')[0]}`) || [],
      
      // Standard post fields
      likes: [],
      likeCount: 0,
      repostCount: 0,
      reposts: [],
      
      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Add the repost to the posts collection
    const docRef = await addDoc(collection(db, 'posts'), repostDoc);

    // Update the original post's repost count and array
    const originalPostRef = doc(db, 'posts', repostData.originalPost.id);
    await updateDoc(originalPostRef, {
      repostCount: increment(1),
      reposts: arrayUnion(currentUser.uid),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Repost created successfully:', docRef.id);

    return {
      id: docRef.id,
      ...repostDoc
    };

  } catch (error) {
    console.error('❌ Error creating repost:', error);
    
    // Provide more specific error messages
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied: Unable to create repost. Please check your authentication.');
    } else if (error.code === 'invalid-argument') {
      throw new Error('Invalid data: Please check that all required fields are properly filled.');
    } else if (error.message.includes('undefined')) {
      throw new Error('Data validation error: Some required fields are missing.');
    } else {
      throw new Error(`Failed to create repost: ${error.message}`);
    }
  }
};

/**
 * Checks if a user has already reposted a specific post
 * @param {Object} post - The post to check
 * @param {string} userId - The user ID to check
 * @returns {boolean} - True if user has reposted, false otherwise
 */
export const hasUserReposted = (post, userId) => {
  if (!post || !userId) {
    return false;
  }

  // Check if the user ID is in the reposts array
  return post.reposts && Array.isArray(post.reposts) && post.reposts.includes(userId);
};

/**
 * Gets the repost count for a post
 * @param {Object} post - The post to get repost count for
 * @returns {number} - The number of reposts
 */
export const getRepostCount = (post) => {
  if (!post) {
    return 0;
  }

  return post.repostCount || 0;
};

/**
 * Validates repost data before creation
 * @param {Object} repostData - The repost data to validate
 * @returns {Object} - Validation result with isValid and errors
 */
export const validateRepostData = (repostData) => {
  const errors = [];

  if (!repostData.originalPost) {
    errors.push('Original post is required');
  }

  if (!repostData.originalPost?.id) {
    errors.push('Original post ID is required');
  }

  if (!repostData.originalPost?.title) {
    errors.push('Original post title is required');
  }

  if (!repostData.originalPost?.authorId) {
    errors.push('Original post author ID is required');
  }

  // Validate tagged users if provided
  if (repostData.taggedUsers && !Array.isArray(repostData.taggedUsers)) {
    errors.push('Tagged users must be an array');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Formats repost data for display
 * @param {Object} repost - The repost object
 * @returns {Object} - Formatted repost data
 */
export const formatRepostForDisplay = (repost) => {
  if (!repost || !repost.isRepost) {
    return repost;
  }

  return {
    ...repost,
    displayType: 'repost',
    originalAuthor: repost.originalPost?.authorName || 'Unknown',
    repostAuthor: repost.authorName || 'Unknown',
    hasComment: !!(repost.repostComment && repost.repostComment.trim()),
    tagCount: repost.taggedUsers?.length || 0
  };
};

/**
 * Error handler for repost operations
 * @param {Error} error - The error to handle
 * @returns {Object} - Formatted error response
 */
export const handleRepostError = (error) => {
  console.error('Repost operation error:', error);

  let userMessage = 'Failed to process repost. Please try again.';
  
  if (error.code === 'permission-denied') {
    userMessage = 'You don\'t have permission to repost this content.';
  } else if (error.code === 'not-found') {
    userMessage = 'The original post could not be found.';
  } else if (error.code === 'invalid-argument') {
    userMessage = 'Invalid repost data. Please check your input.';
  } else if (error.message.includes('Missing or insufficient permissions')) {
    userMessage = 'Permission denied. Please check your authentication.';
  }

  return {
    success: false,
    error: userMessage,
    details: error.message
  };
};
