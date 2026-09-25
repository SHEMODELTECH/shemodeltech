// src/utils/deleteUserContent.js
// Utility to delete all user-generated content when a user deletes their account

import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  writeBatch,
  updateDoc,
  arrayRemove,
  arrayUnion,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { deleteUser as firebaseDeleteUser } from 'firebase/auth';

/**
 * Delete all content created by a user across all Firestore collections
 * Call this BEFORE deleting the Firebase Auth account
 *
 * @param {string} userId - The user's UID
 * @param {string} userEmail - The user's email
 * @returns {object} - Summary of deleted items
 */
export const deleteAllUserContent = async (userId, userEmail) => {
  const summary = {
    posts: 0,
    replies: 0,
    notifications: 0,
    follows: 0,
    likes: 0,
    reposts: 0,
    userDoc: 0,
    errors: [],
  };

  const normalizedEmail = userEmail?.toLowerCase()?.trim() || '';

  try {
    // ─────────────────────────────────────────────
    // 1. DELETE USER'S COMMUNITY POSTS & THEIR REPLIES
    // ─────────────────────────────────────────────
    try {
      const postsQuery = query(collection(db, 'posts'), where('authorId', '==', userId));
      const postsSnapshot = await getDocs(postsQuery);

      for (const postDoc of postsSnapshot.docs) {
        // Delete all replies under this post
        const repliesQuery = query(collection(db, 'posts', postDoc.id, 'replies'));
        const repliesSnapshot = await getDocs(repliesQuery);

        const batch = writeBatch(db);
        repliesSnapshot.docs.forEach((replyDoc) => {
          batch.delete(replyDoc.ref);
          summary.replies++;
        });

        // Delete the post itself
        batch.delete(postDoc.ref);
        await batch.commit();
        summary.posts++;
      }
      console.log(`✅ Deleted ${summary.posts} posts and ${summary.replies} associated replies`);
    } catch (error) {
      console.error('Error deleting posts:', error);
      summary.errors.push(`Posts: ${error.message}`);
    }

    // ─────────────────────────────────────────────
    // 2. DELETE USER'S REPLIES ON OTHER PEOPLE'S POSTS
    // ─────────────────────────────────────────────
    try {
      // We need to search all posts for replies by this user
      const allPostsQuery = query(collection(db, 'posts'));
      const allPostsSnapshot = await getDocs(allPostsQuery);

      let otherRepliesDeleted = 0;
      for (const postDoc of allPostsSnapshot.docs) {
        const repliesQuery = query(
          collection(db, 'posts', postDoc.id, 'replies'),
          where('authorId', '==', userId)
        );
        const repliesSnapshot = await getDocs(repliesQuery);

        if (repliesSnapshot.docs.length > 0) {
          const batch = writeBatch(db);
          repliesSnapshot.docs.forEach((replyDoc) => {
            batch.delete(replyDoc.ref);
            otherRepliesDeleted++;
          });
          await batch.commit();
        }
      }
      summary.replies += otherRepliesDeleted;
      console.log(`✅ Deleted ${otherRepliesDeleted} replies on other users' posts`);
    } catch (error) {
      console.error('Error deleting replies on other posts:', error);
      summary.errors.push(`Replies on others' posts: ${error.message}`);
    }

    // ─────────────────────────────────────────────
    // 3. REMOVE USER'S LIKES FROM ALL POSTS
    // ─────────────────────────────────────────────
    try {
      const likedPostsQuery = query(
        collection(db, 'posts'),
        where('likes', 'array-contains', userId)
      );
      const likedPostsSnapshot = await getDocs(likedPostsQuery);

      for (const postDoc of likedPostsSnapshot.docs) {
        await updateDoc(postDoc.ref, {
          likes: arrayRemove(userId),
          likeCount: increment(-1),
        });
        summary.likes++;
      }
      console.log(`✅ Removed likes from ${summary.likes} posts`);
    } catch (error) {
      console.error('Error removing likes:', error);
      summary.errors.push(`Likes: ${error.message}`);
    }

    // ─────────────────────────────────────────────
    // 4. REMOVE USER'S REPOSTS FROM ALL POSTS
    // ─────────────────────────────────────────────
    try {
      const repostedPostsQuery = query(
        collection(db, 'posts'),
        where('reposts', 'array-contains', userId)
      );
      const repostedPostsSnapshot = await getDocs(repostedPostsQuery);

      for (const postDoc of repostedPostsSnapshot.docs) {
        await updateDoc(postDoc.ref, {
          reposts: arrayRemove(userId),
          repostCount: increment(-1),
        });
        summary.reposts++;
      }
      console.log(`✅ Removed reposts from ${summary.reposts} posts`);
    } catch (error) {
      console.error('Error removing reposts:', error);
      summary.errors.push(`Reposts: ${error.message}`);
    }

    // ─────────────────────────────────────────────
    // 5. DELETE USER'S NOTIFICATIONS (sent and received)
    // ─────────────────────────────────────────────
    try {
      // Notifications sent TO this user
      const receivedNotifQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', userId)
      );
      const receivedSnapshot = await getDocs(receivedNotifQuery);

      for (const notifDoc of receivedSnapshot.docs) {
        await deleteDoc(notifDoc.ref);
        summary.notifications++;
      }

      // Notifications sent BY this user
      const sentNotifQuery = query(
        collection(db, 'notifications'),
        where('mentionedBy', '==', userId)
      );
      const sentSnapshot = await getDocs(sentNotifQuery);

      for (const notifDoc of sentSnapshot.docs) {
        await deleteDoc(notifDoc.ref);
        summary.notifications++;
      }

      // Also try email-based notifications
      if (normalizedEmail) {
        const emailNotifQuery = query(
          collection(db, 'notifications'),
          where('recipientEmail', '==', normalizedEmail)
        );
        const emailSnapshot = await getDocs(emailNotifQuery);

        for (const notifDoc of emailSnapshot.docs) {
          await deleteDoc(notifDoc.ref);
          summary.notifications++;
        }
      }

      console.log(`✅ Deleted ${summary.notifications} notifications`);
    } catch (error) {
      console.error('Error deleting notifications:', error);
      summary.errors.push(`Notifications: ${error.message}`);
    }

    // ─────────────────────────────────────────────
    // 6. DELETE FOLLOW RELATIONSHIPS
    // ─────────────────────────────────────────────
    try {
      // Where this user is the follower
      const followingQuery = query(collection(db, 'follows'), where('followerId', '==', userId));
      const followingSnapshot = await getDocs(followingQuery);

      for (const followDoc of followingSnapshot.docs) {
        await deleteDoc(followDoc.ref);
        summary.follows++;
      }

      // Where this user is being followed
      const followersQuery = query(collection(db, 'follows'), where('followingId', '==', userId));
      const followersSnapshot = await getDocs(followersQuery);

      for (const followDoc of followersSnapshot.docs) {
        await deleteDoc(followDoc.ref);
        summary.follows++;
      }

      console.log(`✅ Deleted ${summary.follows} follow relationships`);
    } catch (error) {
      console.error('Error deleting follows:', error);
      summary.errors.push(`Follows: ${error.message}`);
    }

    // ─────────────────────────────────────────────
    // 7. DELETE USER'S BADGES
    // ─────────────────────────────────────────────
    try {
      const badgeQueries = [
        query(collection(db, 'member_badges'), where('memberId', '==', userId)),
      ];

      if (normalizedEmail) {
        badgeQueries.push(
          query(collection(db, 'member_badges'), where('memberEmail', '==', normalizedEmail))
        );
      }

      let badgesDeleted = 0;
      for (const q of badgeQueries) {
        const snapshot = await getDocs(q);
        for (const docSnap of snapshot.docs) {
          await deleteDoc(docSnap.ref);
          badgesDeleted++;
        }
      }
      console.log(`✅ Deleted ${badgesDeleted} badges`);
    } catch (error) {
      console.error('Error deleting badges:', error);
      summary.errors.push(`Badges: ${error.message}`);
    }

    // ─────────────────────────────────────────────
    // 8. DELETE USER'S CERTIFICATES
    // ─────────────────────────────────────────────
    try {
      const certQueries = [
        query(collection(db, 'certificates'), where('recipientId', '==', userId)),
      ];

      if (normalizedEmail) {
        certQueries.push(
          query(collection(db, 'certificates'), where('recipientEmail', '==', normalizedEmail))
        );
      }

      let certsDeleted = 0;
      for (const q of certQueries) {
        const snapshot = await getDocs(q);
        for (const docSnap of snapshot.docs) {
          await deleteDoc(docSnap.ref);
          certsDeleted++;
        }
      }
      console.log(`✅ Deleted ${certsDeleted} certificates`);
    } catch (error) {
      console.error('Error deleting certificates:', error);
      summary.errors.push(`Certificates: ${error.message}`);
    }

    // ─────────────────────────────────────────────
    // 9. REMOVE USER FROM GROUP MEMBERSHIPS
    // ─────────────────────────────────────────────
    try {
      const memberQueries = [query(collection(db, 'group_members'), where('userId', '==', userId))];

      if (normalizedEmail) {
        memberQueries.push(
          query(collection(db, 'group_members'), where('userEmail', '==', normalizedEmail))
        );
      }

      let membershipsDeleted = 0;
      for (const q of memberQueries) {
        const snapshot = await getDocs(q);
        for (const docSnap of snapshot.docs) {
          await deleteDoc(docSnap.ref);
          membershipsDeleted++;
        }
      }
      console.log(`✅ Removed from ${membershipsDeleted} group memberships`);
    } catch (error) {
      console.error('Error removing group memberships:', error);
      summary.errors.push(`Group memberships: ${error.message}`);
    }

    // ─────────────────────────────────────────────
    // 10. DELETE USER'S PROJECT APPLICATIONS
    // ─────────────────────────────────────────────
    try {
      const appQueries = [
        query(collection(db, 'project_applications'), where('applicantId', '==', userId)),
      ];

      if (normalizedEmail) {
        appQueries.push(
          query(
            collection(db, 'project_applications'),
            where('applicantEmail', '==', normalizedEmail)
          )
        );
      }

      let appsDeleted = 0;
      for (const q of appQueries) {
        const snapshot = await getDocs(q);
        for (const docSnap of snapshot.docs) {
          await deleteDoc(docSnap.ref);
          appsDeleted++;
        }
      }
      console.log(`✅ Deleted ${appsDeleted} project applications`);
    } catch (error) {
      console.error('Error deleting applications:', error);
      summary.errors.push(`Applications: ${error.message}`);
    }

    // ─────────────────────────────────────────────
    // 10.5 HANDLE PROJECTS (owned + member)
    //  - Owned & not completed/rejected → mark cancelled with a reason.
    //  - Member of any project → remove from members + leave a note.
    //  Completed/rejected projects are left intact so the team keeps their proof.
    // ─────────────────────────────────────────────
    try {
      let cancelled = 0,
        leftTeams = 0;

      // (a) Projects this user OWNS.
      const ownedSnap = await getDocs(
        query(collection(db, 'projects'), where('submitterId', '==', userId))
      );
      for (const pDoc of ownedSnap.docs) {
        const data = pDoc.data();
        const isCompleted = data.status === 'completed';
        const isRejected = data.reviewStatus === 'rejected';
        if (!isCompleted && !isRejected) {
          await updateDoc(pDoc.ref, {
            status: 'cancelled',
            cancelledReason: 'lead_deleted',
            cancelledAt: new Date(),
            applicationsOpen: false,
          });
          cancelled++;
        }
      }

      // (b) Projects this user is a MEMBER of (remove from roster + note).
      const memberSnap = await getDocs(
        query(collection(db, 'projects'), where('members', 'array-contains', userId))
      );
      for (const pDoc of memberSnap.docs) {
        // Don't bother if this is their own already-cancelled project.
        if (pDoc.data().submitterId === userId) continue;
        await updateDoc(pDoc.ref, {
          members: arrayRemove(userId),
          teamUpdates: arrayUnion({
            type: 'member_left',
            message: 'A team member left the platform and was removed from the team.',
            at: new Date().toISOString(),
          }),
        });
        leftTeams++;
      }

      summary.projectsCancelled = cancelled;
      summary.projectsLeft = leftTeams;
      console.log(`Projects: cancelled ${cancelled} owned, left ${leftTeams} teams`);
    } catch (error) {
      console.error('Error handling projects:', error);
      summary.errors.push(`Projects: ${error.message}`);
    }

    // ─────────────────────────────────────────────
    // 11. DELETE USER DOCUMENT FROM 'users' COLLECTION
    // ─────────────────────────────────────────────
    try {
      // Try by document ID = userId
      const userDocRef = doc(db, 'users', userId);
      await deleteDoc(userDocRef);
      summary.userDoc++;
      console.log(`✅ Deleted user document`);
    } catch (error) {
      console.error('Error deleting user document:', error);
      summary.errors.push(`User document: ${error.message}`);
    }

    console.log('🏁 User content deletion complete:', summary);
    return summary;
  } catch (error) {
    console.error('Fatal error during user content deletion:', error);
    summary.errors.push(`Fatal: ${error.message}`);
    return summary;
  }
};

/**
 * Full account deletion: deletes all content then the Firebase Auth account
 *
 * @param {object} user - Firebase Auth user object (currentUser)
 * @returns {object} - Summary of what was deleted
 */
export const deleteUserAccount = async (user) => {
  if (!user || !user.uid) {
    throw new Error('Invalid user object');
  }

  const userId = user.uid;
  const userEmail = user.email || '';

  console.log(`🗑️ Starting full account deletion for: ${userEmail} (${userId})`);

  // Step 1: Delete all Firestore content FIRST
  const summary = await deleteAllUserContent(userId, userEmail);

  // Step 2: Try to delete Firebase Auth account
  try {
    await firebaseDeleteUser(user);
    console.log('✅ Firebase Auth account deleted');
    summary.authDeleted = true;
  } catch (error) {
    console.warn('⚠️ Could not delete Auth account:', error.code);
    summary.authDeleted = false;
    // Don't throw - content is already deleted
    // User will be signed out and can't access anything anyway
  }

  return summary;
};
