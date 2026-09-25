// src/utils/notificationHelpers.js - Enhanced Notification Helper Functions
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

// 🔥 Enhanced group post notification with proper name fields
export const createGroupPostNotification = async (post, groupMembers, authorId) => {
  try {
    const notifications = [];
    
    // Notify all group members except the author
    const membersToNotify = groupMembers.filter(member => 
      member.userId !== authorId && member.status === 'active'
    );

    for (const member of membersToNotify) {
      const notification = {
        userId: member.userId,
        type: 'group_post',
        groupId: post.groupId,
        groupTitle: post.groupTitle || 'Project Group',
        postId: post.id,
        postTitle: post.title,
        
        // Enhanced author information for proper display
        mentionedBy: post.authorId,
        mentionedByName: post.authorDisplayName || post.authorName || 'Team Member',
        mentionedByFirstName: post.authorFirstName || '',
        mentionedByLastName: post.authorLastName || '',
        mentionedByPhoto: post.authorPhoto || null,
        
        // Legacy fields for backward compatibility
        authorName: post.authorDisplayName || post.authorName || 'Team Member',
        authorId: post.authorId,
        
        message: `${post.authorDisplayName || post.authorName || 'Team Member'} posted: "${post.title}"`,
        isRead: false,
        createdAt: serverTimestamp()
      };
      
      notifications.push(addDoc(collection(db, 'notifications'), notification));
    }

    await Promise.all(notifications);
    console.log(`✅ Created ${notifications.length} group post notifications`);
  } catch (error) {
    console.error('❌ Error creating group post notifications:', error);
  }
};

// 🔥 Enhanced group reply notification with proper name fields
export const createGroupReplyNotification = async (reply, groupMembers, postAuthorId, postTitle) => {
  try {
    const notifications = [];
    
    // Notify post author if they're not the reply author
    if (postAuthorId && postAuthorId !== reply.authorId) {
      const postAuthorMember = groupMembers.find(member => member.userId === postAuthorId);
      if (postAuthorMember) {
        const notification = {
          userId: postAuthorId,
          type: 'group_reply',
          groupId: reply.groupId,
          postId: reply.postId,
          replyId: reply.id,
          postTitle: postTitle,
          replyContent: reply.content,
          
          // Enhanced author information for proper display
          mentionedBy: reply.authorId,
          mentionedByName: reply.authorDisplayName || reply.authorName || 'Team Member',
          mentionedByFirstName: reply.authorFirstName || '',
          mentionedByLastName: reply.authorLastName || '',
          mentionedByPhoto: reply.authorPhoto || null,
          
          // Legacy fields for backward compatibility
          authorName: reply.authorDisplayName || reply.authorName || 'Team Member',
          authorId: reply.authorId,
          
          message: `${reply.authorDisplayName || reply.authorName || 'Team Member'} replied to your post: "${postTitle}"`,
          isRead: false,
          createdAt: serverTimestamp()
        };
        
        notifications.push(addDoc(collection(db, 'notifications'), notification));
      }
    }

    await Promise.all(notifications);
    console.log(`✅ Created ${notifications.length} group reply notifications`);
  } catch (error) {
    console.error('❌ Error creating group reply notifications:', error);
  }
};

// 🔥 Create member joined notification
export const createMemberJoinedNotification = async (groupId, groupTitle, newMemberName, groupMembers) => {
  try {
    const notifications = [];
    
    // Notify all existing group members
    for (const member of groupMembers) {
      if (member.status === 'active') {
        const notification = {
          userId: member.userId,
          type: 'group_member_joined',
          groupId: groupId,
          groupTitle: groupTitle,
          newMemberName: newMemberName,
          message: `${newMemberName} joined ${groupTitle}`,
          isRead: false,
          createdAt: serverTimestamp()
        };
        
        notifications.push(addDoc(collection(db, 'notifications'), notification));
      }
    }

    await Promise.all(notifications);
    console.log(`✅ Created ${notifications.length} member joined notifications`);
  } catch (error) {
    console.error('❌ Error creating member joined notifications:', error);
  }
};

// 🔥 Create badge awarded notification
export const createBadgeAwardedNotification = async (userId, badgeInfo, projectTitle) => {
  try {
    const notification = {
      userId: userId,
      type: 'badge_awarded',
      badgeCategory: badgeInfo.category,
      badgeLevel: badgeInfo.level,
      projectTitle: projectTitle,
      message: `You earned a ${badgeInfo.level} ${badgeInfo.category} badge for completing ${projectTitle}!`,
      isRead: false,
      createdAt: serverTimestamp()
    };
    
    await addDoc(collection(db, 'notifications'), notification);
    console.log(`✅ Created badge awarded notification for user ${userId}`);
  } catch (error) {
    console.error('❌ Error creating badge awarded notification:', error);
  }
};

// 🔥 Create group completion notification
export const createGroupCompletionNotification = async (groupId, groupTitle, groupMembers) => {
  try {
    const notifications = [];
    
    // Notify all group members
    for (const member of groupMembers) {
      const notification = {
        userId: member.userId,
        type: 'group_completed',
        groupId: groupId,
        groupTitle: groupTitle,
        message: `${groupTitle} has been completed! Check your dashboard for badges.`,
        isRead: false,
        createdAt: serverTimestamp()
      };
      
      notifications.push(addDoc(collection(db, 'notifications'), notification));
    }

    await Promise.all(notifications);
    console.log(`✅ Created ${notifications.length} group completion notifications`);
  } catch (error) {
    console.error('❌ Error creating group completion notifications:', error);
  }
};

// 🔥 Create notification for new company post - ALL MEMBERS GET NOTIFIED
export const createCompanyPostNotification = async (post, members, authorId) => {
  try {
    const notifications = [];
    
    // Notify all company members except the author
    const membersToNotify = members.filter(member => 
      member.userId !== authorId && member.status === 'active'
    );

    for (const member of membersToNotify) {
      const notification = {
        userId: member.userId,
        userEmail: member.userEmail,
        type: 'company_post',
        companyId: post.companyId,
        companyName: post.companyName,
        postId: post.id,
        postTitle: post.title,
        
        // Enhanced author information for proper display
        mentionedBy: post.authorId,
        mentionedByName: post.authorDisplayName || post.authorName || 'Team Member',
        mentionedByFirstName: post.authorFirstName || '',
        mentionedByLastName: post.authorLastName || '',
        mentionedByPhoto: post.authorPhoto || null,
        
        // Legacy fields for backward compatibility
        authorName: post.authorDisplayName || post.authorName || 'Team Member',
        authorId: post.authorId,
        
        title: 'New Company Post',
        message: `${post.authorDisplayName || post.authorName || 'Team Member'} posted "${post.title}" in ${post.companyName}`,
        
        // Additional data for client-side handling
        data: {
          companyId: post.companyId,
          postId: post.id,
          authorId: authorId,
          authorName: post.authorDisplayName || post.authorName,
          postTitle: post.title,
          companyName: post.companyName
        },
        
        isRead: false,
        read: false, // Duplicate for backward compatibility
        createdAt: serverTimestamp()
      };
      
      notifications.push(addDoc(collection(db, 'notifications'), notification));
    }
    
    await Promise.all(notifications);
    console.log(`✅ Created ${notifications.length} company post notifications for all members`);
    
  } catch (error) {
    console.error('❌ Error creating company post notifications:', error);
  }
};

// 🔥 Create notification for new company comment
export const createCompanyCommentNotification = async (comment, members, postAuthorId, postTitle, postCompanyName) => {
  try {
    const notifications = [];
    
    // Notify post author if they're not the comment author
    if (postAuthorId && postAuthorId !== comment.authorId) {
      const postAuthor = members.find(member => member.userId === postAuthorId);
      if (postAuthor && postAuthor.status === 'active') {
        const notification = {
          userId: postAuthorId,
          userEmail: postAuthor.userEmail,
          type: 'company_comment',
          companyId: comment.companyId,
          companyName: postCompanyName,
          postId: comment.postId,
          commentId: comment.id,
          postTitle: postTitle,
          commentContent: comment.content,
          
          // Enhanced author information for proper display
          mentionedBy: comment.authorId,
          mentionedByName: comment.authorDisplayName || comment.authorName || 'Team Member',
          mentionedByFirstName: comment.authorFirstName || '',
          mentionedByLastName: comment.authorLastName || '',
          mentionedByPhoto: comment.authorPhoto || null,
          
          // Legacy fields for backward compatibility
          authorName: comment.authorDisplayName || comment.authorName || 'Team Member',
          authorId: comment.authorId,
          
          title: 'New Comment on Your Post',
          message: `${comment.authorDisplayName || comment.authorName || 'Team Member'} commented on your post "${postTitle}"`,
          
          // Additional data for client-side handling
          data: {
            companyId: comment.companyId,
            postId: comment.postId,
            commentId: comment.id,
            authorId: comment.authorId,
            authorName: comment.authorDisplayName || comment.authorName,
            postTitle: postTitle
          },
          
          isRead: false,
          read: false, // Duplicate for backward compatibility
          createdAt: serverTimestamp()
        };
        
        notifications.push(addDoc(collection(db, 'notifications'), notification));
      }
    }
    
    await Promise.all(notifications);
    console.log(`✅ Created ${notifications.length} company comment notifications`);
    
  } catch (error) {
    console.error('❌ Error creating company comment notifications:', error);
  }
};

// 🔥 Create notification for new company member joined - ALL MEMBERS GET NOTIFIED
export const createCompanyMemberJoinedNotification = async (companyId, companyName, newMemberName, companyMembers) => {
  try {
    const notifications = [];
    
    // Notify all existing company members except the new member
    for (const member of companyMembers) {
      if (member.status === 'active') {
        const notification = {
          userId: member.userId,
          userEmail: member.userEmail,
          type: 'company_member_joined',
          companyId: companyId,
          companyName: companyName,
          newMemberName: newMemberName,
          title: 'New Team Member',
          message: `${newMemberName} joined ${companyName}`,
          isRead: false,
          read: false,
          createdAt: serverTimestamp()
        };
        
        notifications.push(addDoc(collection(db, 'notifications'), notification));
      }
    }

    await Promise.all(notifications);
    console.log(`✅ Created ${notifications.length} company member joined notifications for all members`);
  } catch (error) {
    console.error('❌ Error creating company member joined notifications:', error);
  }
};
