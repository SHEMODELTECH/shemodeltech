// src/utils/followSystem.js - Unified Follow System for All Components
// src/utils/followSystem.js - Unified Follow System for All Components

import { 
  doc, 
  getDoc, 
  setDoc,
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  increment, 
  writeBatch, 
  addDoc, 
  collection, 
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';

// Enhanced error handling and user feedback
const showSuccessMessage = (message) => toast.success(message);
const showWarningMessage = (message) => toast.warn(message);
const showErrorMessage = (message) => toast.error(message);

// Safe Firestore operation wrapper
const safeFirestoreOperation = async (operation, operationName) => {
  try {
    await operation();
    console.log(`✅ ${operationName} completed successfully`);
  } catch (error) {
    console.error(`❌ ${operationName} failed:`, error);
    throw error;
  }
};

// 🔥 NEW: Get user's follower and following counts
export const getUserCounts = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get user document to check for stored counts first
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // Return stored counts if they exist
      const followers = userData.followerCount || 0;
      const following = userData.followingCount || 0;
      
      return {
        followers,
        following
      };
    } else {
      // If user document doesn't exist, return zero counts
      return {
        followers: 0,
        following: 0
      };
    }
  } catch (error) {
    console.error('Error getting user counts:', error);
    return {
      followers: 0,
      following: 0
    };
  }
};

/**
 * Follow a user - Updates Firestore documents for both users
 * @param {Object} currentUser - The user doing the following
 * @param {string} targetUserId - UID of the user to follow
 * @param {Object} targetUserData - Optional: target user data to avoid extra fetch
 * @param {Function} onCountUpdate - Optional: callback for count updates
 * @returns {boolean} - Success status
 */
export const followUser = async (currentUser, targetUserId, targetUserData = null, onCountUpdate = null) => {
  if (!currentUser || currentUser.uid === targetUserId) {
    console.log('❌ Cannot follow: invalid user or trying to follow self');
    return false;
  }

  console.log('🔄 Following user:', targetUserId);

  try {
    // Get references to both user documents
    const currentUserRef = doc(db, 'users', currentUser.uid);
    const targetUserRef = doc(db, 'users', targetUserId);
    
    // Verify both users exist before attempting follow
    const [currentUserDoc, targetUserDoc] = await Promise.all([
      getDoc(currentUserRef),
      getDoc(targetUserRef)
    ]);
    
    // Auto-create current user doc if missing (new Google sign-in users)
    if (!currentUserDoc.exists()) {
      console.warn('⚠️ Current user doc missing - creating it now');
      await setDoc(currentUserRef, {
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Member',
        photoURL: currentUser.photoURL || null,
        following: [],
        followers: [],
        followingCount: 0,
        followerCount: 0,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      }, { merge: true });
    }
    
    if (!targetUserDoc.exists()) {
      console.error('❌ Target user document does not exist');
      throw new Error('The user you are trying to follow was not found.');
    }

    // Check if already following
    const currentUserData = currentUserDoc.exists() ? currentUserDoc.data() : {};
    const currentFollowing = currentUserData.following || [];
    
    if (currentFollowing.includes(targetUserId)) {
      console.log('⚠️ Already following this user');
      showWarningMessage('You are already following this user');
      return false;
    }

    // Perform the follow operation using batch write for consistency
    await safeFirestoreOperation(async () => {
      const batch = writeBatch(db);
      
      // Update current user's following list and count
      batch.update(currentUserRef, {
        following: arrayUnion(targetUserId),
        followingCount: increment(1),
        lastUpdated: serverTimestamp()
      });
      
      // Update target user's followers list and count
      batch.update(targetUserRef, {
        followers: arrayUnion(currentUser.uid),
        followerCount: increment(1),
        lastUpdated: serverTimestamp()
      });

      // Commit the batch
      await batch.commit();

      // 🔥 NEW: Get updated counts and call callback if provided
      if (onCountUpdate) {
        const [currentUserCounts, targetUserCounts] = await Promise.all([
          getUserCounts(currentUser.uid),
          getUserCounts(targetUserId)
        ]);

        onCountUpdate({
          currentUser: currentUserCounts,
          targetUser: targetUserCounts,
          targetUserId: targetUserId,
          action: 'follow'
        });
      }

      // Create notification separately (non-critical)
      try {
        const targetData = targetUserData || targetUserDoc.data();
        await addDoc(collection(db, 'notifications'), {
          userId: targetUserId,
          type: 'follow',
          followedBy: currentUser.uid,
          followedByName: currentUser.displayName || 
                         `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 
                         currentUser.email,
          followedByFirstName: currentUser.firstName || '',
          followedByLastName: currentUser.lastName || '', 
          followedByPhoto: currentUser.photoURL || null,
          targetUserName: targetData.displayName || 
                          `${targetData.firstName || ''} ${targetData.lastName || ''}`.trim() || 
                          targetData.email,
          message: `${currentUser.displayName || currentUser.firstName || currentUser.email} started following you`,
          isRead: false,
          createdAt: serverTimestamp()
        });
        console.log('✅ Follow notification created');
      } catch (notificationError) {
        console.warn('⚠️ Failed to create notification (non-critical):', notificationError);
        // Don't fail the entire operation for notification errors
      }
    }, 'following user');
    
    console.log('✅ Successfully followed user');
    return true;
    
  } catch (error) {
    console.error('❌ Error following user:', error);
    
    // Enhanced error messages
    if (error.code === 'permission-denied') {
      showWarningMessage('Permission denied. Please check your account permissions and try again.');
    } else if (error.code === 'not-found') {
      showWarningMessage('User not found. They may have deactivated their account.');
    } else if (error.code === 'unauthenticated') {
      showWarningMessage('Please log in again to follow users.');
    } else if (error.message) {
      showWarningMessage(error.message);
    } else {
      showWarningMessage('Failed to follow user. Please try again later.');
    }
    
    return false;
  }
};

/**
 * Unfollow a user - Updates Firestore documents for both users
 * @param {Object} currentUser - The user doing the unfollowing
 * @param {string} targetUserId - UID of the user to unfollow
 * @param {Function} onCountUpdate - Optional: callback for count updates
 * @returns {boolean} - Success status
 */
export const unfollowUser = async (currentUser, targetUserId, onCountUpdate = null) => {
  if (!currentUser || currentUser.uid === targetUserId) {
    console.log('❌ Cannot unfollow: invalid user or trying to unfollow self');
    return false;
  }

  console.log('🔄 Unfollowing user:', targetUserId);

  try {
    // Get references to both user documents
    const currentUserRef = doc(db, 'users', currentUser.uid);
    const targetUserRef = doc(db, 'users', targetUserId);
    
    const [currentUserDoc, targetUserDoc] = await Promise.all([
      getDoc(currentUserRef),
      getDoc(targetUserRef)
    ]);
    
    if (!currentUserDoc.exists()) {
      console.error('❌ Current user document does not exist');
      throw new Error('Your user profile was not found. Please try logging in again.');
    }
    
    if (!targetUserDoc.exists()) {
      console.error('❌ Target user document does not exist');  
      throw new Error('The user you are trying to unfollow was not found.');
    }

    // Check if actually following
    const currentUserData = currentUserDoc.data();
    const currentFollowing = currentUserData.following || [];
    
    if (!currentFollowing.includes(targetUserId)) {
      console.log('⚠️ Not following this user');
      showWarningMessage('You are not following this user');
      return false;
    }

    // Perform the unfollow operation using batch write for consistency
    await safeFirestoreOperation(async () => {
      const batch = writeBatch(db);
      
      // Update current user's following list and count
      batch.update(currentUserRef, {
        following: arrayRemove(targetUserId),
        followingCount: increment(-1),
        lastUpdated: serverTimestamp()
      });
      
      // Update target user's followers list and count
      batch.update(targetUserRef, {
        followers: arrayRemove(currentUser.uid),
        followerCount: increment(-1), 
        lastUpdated: serverTimestamp()
      });

      // Commit the batch
      await batch.commit();

      // 🔥 NEW: Get updated counts and call callback if provided
      if (onCountUpdate) {
        const [currentUserCounts, targetUserCounts] = await Promise.all([
          getUserCounts(currentUser.uid),
          getUserCounts(targetUserId)
        ]);

        onCountUpdate({
          currentUser: currentUserCounts,
          targetUser: targetUserCounts,
          targetUserId: targetUserId,
          action: 'unfollow'
        });
      }
    }, 'unfollowing user');
    
    console.log('✅ Successfully unfollowed user');
    return true;
    
  } catch (error) {
    console.error('❌ Error unfollowing user:', error);
    
    // Enhanced error messages
    if (error.code === 'permission-denied') {
      showWarningMessage('Permission denied. Please check your account permissions and try again.');
    } else if (error.code === 'not-found') {
      showWarningMessage('User not found. They may have deactivated their account.');
    } else if (error.code === 'unauthenticated') {
      showWarningMessage('Please log in again to unfollow users.');
    } else if (error.message) {
      showWarningMessage(error.message);
    } else {
      showWarningMessage('Failed to unfollow user. Please try again later.');
    }
    
    return false;
  }
};

/**
 * Get user's following status for multiple users
 * @param {Object} currentUser - The current user
 * @param {Array} userIds - Array of user IDs to check
 * @returns {Object} - Object mapping user IDs to following status
 */
export const getFollowingStatusForUsers = async (currentUser, userIds) => {
  if (!currentUser || !userIds || userIds.length === 0) {
    return {};
  }

  try {
    const currentUserDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (!currentUserDoc.exists()) {
      return {};
    }

    const userData = currentUserDoc.data();
    const following = userData.following || [];
    
    const statusMap = {};
    userIds.forEach(userId => {
      statusMap[userId] = following.includes(userId);
    });
    
    return statusMap;
  } catch (error) {
    console.error('Error loading following status:', error);
    return {};
  }
};

/**
 * Convert email to user ID for compatibility with old email-based system
 * @param {string} email - User email
 * @returns {string|null} - User ID or null if not found
 */
export const getUserIdFromEmail = async (email) => {
  if (!email) return null;
  
  try {
    const usersQuery = query(
      collection(db, 'users'),
      where('email', '==', email)
    );
    
    const snapshot = await getDocs(usersQuery);
    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user ID from email:', error);
    return null;
  }
};

/**
 * Handle follow/unfollow toggle with proper user feedback
 * @param {Object} currentUser - Current user object
 * @param {string} targetUserId - Target user ID
 * @param {boolean} isCurrentlyFollowing - Current following status
 * @param {Object} targetUserData - Optional target user data
 * @param {Function} onStatusChange - Callback for status change
 * @param {Function} onCountUpdate - Optional: callback for count updates
 * @returns {boolean} - Success status
 */
export const handleFollowToggle = async (
  currentUser, 
  targetUserId, 
  isCurrentlyFollowing, 
  targetUserData = null,
  onStatusChange = null,
  onCountUpdate = null
) => {
  if (!currentUser) {
    showWarningMessage('Please log in to follow users');
    return false;
  }

  if (currentUser.uid === targetUserId) {
    showWarningMessage("You can't follow yourself! 😊");
    return false;
  }

  try {
    let success = false;
    let newStatus = isCurrentlyFollowing;

    if (isCurrentlyFollowing) {
      success = await unfollowUser(currentUser, targetUserId, onCountUpdate);
      if (success) {
        newStatus = false;
        
        // Find user name for success message
        const userName = targetUserData?.displayName || 
                        targetUserData?.firstName + ' ' + targetUserData?.lastName || 
                        'user';
        showSuccessMessage(`Unfollowed ${userName}`);
      }
    } else {
      success = await followUser(currentUser, targetUserId, targetUserData, onCountUpdate);
      if (success) {
        newStatus = true;
        
        // Find user name for success message
        const userName = targetUserData?.displayName || 
                        targetUserData?.firstName + ' ' + targetUserData?.lastName || 
                        'user';
        showSuccessMessage(`Now following ${userName}! 🎉`);
      }
    }
    
    // Call status change callback if provided
    if (success && onStatusChange) {
      onStatusChange(targetUserId, newStatus);
    }
    
    return success;
    
  } catch (error) {
    console.error('❌ Error in follow toggle:', error);
    showWarningMessage('Unable to update follow status. Please try again.');
    return false;
  }
};
