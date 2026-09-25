// src/utils/eventGroupHelpers.js
// Event Group Helper Functions for Firebase Integration

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  increment,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ================================================================
// EVENT GROUP MANAGEMENT
// ================================================================

// Create a new event group (used in AdminDashboard.jsx)
export const createEventGroup = async (eventData, adminUser) => {
  try {
    console.log('🎪 Creating event group for event:', eventData.eventTitle);
    
    const eventGroupRef = doc(collection(db, 'event_groups'));
    
    const eventGroupData = {
      id: eventGroupRef.id,
      eventId: eventData.id || eventData.eventId,
      groupType: 'event',
      eventTitle: eventData.eventTitle || 'Untitled Event',
      description: eventData.eventDescription || eventData.description || 'Event group for networking and discussions',
      eventType: eventData.eventType || 'workshop',
      format: eventData.format || 'online',
      duration: eventData.duration || '2 hours',
      eventDate: eventData.eventDate || new Date(),
      tags: eventData.tags || [],
      
      // Admin info (event organizer)
      adminEmail: eventData.organizerEmail || eventData.contactEmail || '',
      adminName: eventData.organizerName || eventData.contactName || 'Event Organizer',
      adminId: eventData.submitterId || eventData.organizerId || '',
      
      // Metadata
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'active',
      memberCount: 1,
      maxMembers: 100,
      createdBy: 'event_approval',
      approvedBy: adminUser.email || 'admin',
      
      // Settings
      settings: {
        allowMemberPosting: true,
        allowMemberInvites: false,
        isPrivate: false,
        requireApproval: true,
        allowDiscussions: true,
        allowEventUpdates: true,
        allowFileSharing: true,
        allowPolls: false,
        notificationsEnabled: true
      },
      
      // Stats
      stats: {
        totalPosts: 0,
        totalComments: 0,
        lastActivity: serverTimestamp(),
        activeMembers: 1
      }
    };

    await setDoc(eventGroupRef, eventGroupData);
    console.log('✅ Event group created with ID:', eventGroupRef.id);

    // Add organizer as admin member
    await addEventGroupMember({
      eventGroupId: eventGroupRef.id,
      eventId: eventData.id || eventData.eventId,
      userEmail: eventData.organizerEmail || eventData.contactEmail || '',
      userName: eventData.organizerName || eventData.contactName || 'Event Organizer',
      userId: eventData.submitterId || eventData.organizerId || '',
      role: 'admin',
      status: 'active',
      eventRole: 'Event Organizer',
      joinMethod: 'auto_creation'
    });

    console.log('✅ Event organizer added as group admin');

    return { success: true, eventGroupId: eventGroupRef.id };
  } catch (error) {
    console.error('❌ Error creating event group:', error);
    throw error;
  }
};

// Get event group details
export const getEventGroup = async (eventGroupId) => {
  try {
    const eventGroupDoc = await getDoc(doc(db, 'event_groups', eventGroupId));
    if (eventGroupDoc.exists()) {
      const data = eventGroupDoc.data();
      return {
        id: eventGroupDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        eventDate: data.eventDate?.toDate ? data.eventDate.toDate() : data.eventDate
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting event group:', error);
    throw error;
  }
};

// Get event groups for a specific event
export const getEventGroups = async (eventId) => {
  try {
    const groupsQuery = query(
      collection(db, 'event_groups'),
      where('eventId', '==', eventId),
      where('status', '==', 'active')
    );
    
    const groupsSnapshot = await getDocs(groupsQuery);
    return groupsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        eventDate: data.eventDate?.toDate ? data.eventDate.toDate() : data.eventDate
      };
    });
  } catch (error) {
    console.error('Error getting event groups:', error);
    return [];
  }
};

// ================================================================
// MEMBER MANAGEMENT
// ================================================================

// Add member to event group
export const addEventGroupMember = async (memberData) => {
  try {
    console.log('👤 Adding member to event group:', memberData.eventGroupId);
    
    const memberDoc = await addDoc(collection(db, 'event_group_members'), {
      eventGroupId: memberData.eventGroupId || '',
      eventId: memberData.eventId || '',
      userEmail: memberData.userEmail || '',
      userName: memberData.userName || '',
      userId: memberData.userId || '',
      userPhoto: memberData.userPhoto || null,
      role: memberData.role || 'member',
      status: memberData.status || 'pending',
      
      // Timestamps
      appliedAt: memberData.appliedAt || serverTimestamp(),
      joinedAt: memberData.status === 'active' ? serverTimestamp() : null,
      approvedAt: memberData.status === 'active' ? serverTimestamp() : null,
      
      // Application details
      joinMethod: memberData.joinMethod || 'application',
      applicationMessage: memberData.applicationMessage || '',
      eventRole: memberData.eventRole || 'Attendee',
      joinedFrom: memberData.joinedFrom || 'unknown',
      
      // Approval tracking
      approvedBy: memberData.approvedBy || '',
      
      // Activity tracking
      lastSeen: serverTimestamp(),
      postsCount: 0,
      commentsCount: 0,
      
      // Notification preferences
      notifications: {
        emailNotifications: true,
        groupUpdates: true,
        newMembers: false,
        newPosts: true,
        eventReminders: true,
        weeklyDigest: false
      }
    });

    console.log('✅ Member added with ID:', memberDoc.id);

    // Update group member count if member is active
    if (memberData.status === 'active') {
      await updateDoc(doc(db, 'event_groups', memberData.eventGroupId), {
        memberCount: increment(1),
        'stats.lastActivity': serverTimestamp(),
        'stats.activeMembers': increment(1)
      });
      console.log('✅ Group member count updated');
    }

    return memberDoc.id;
  } catch (error) {
    console.error('❌ Error adding event group member:', error);
    throw error;
  }
};

// Approve member application
export const approveEventGroupMember = async (memberId, approverEmail) => {
  try {
    console.log('✅ Approving member:', memberId);
    
    const memberRef = doc(db, 'event_group_members', memberId);
    const memberDoc = await getDoc(memberRef);
    
    if (!memberDoc.exists()) {
      throw new Error('Member not found');
    }
    
    const memberData = memberDoc.data();
    
    await updateDoc(memberRef, {
      status: 'active',
      approvedAt: serverTimestamp(),
      approvedBy: approverEmail,
      joinedAt: serverTimestamp()
    });

    // Update group member count
    await updateDoc(doc(db, 'event_groups', memberData.eventGroupId), {
      memberCount: increment(1),
      'stats.lastActivity': serverTimestamp(),
      'stats.activeMembers': increment(1)
    });

    console.log('✅ Member approved and group updated');
    return true;
  } catch (error) {
    console.error('❌ Error approving member:', error);
    throw error;
  }
};

// Remove member from group
export const removeEventGroupMember = async (memberId, removerEmail, reason = '') => {
  try {
    console.log('🗑️ Removing member:', memberId);
    
    const memberRef = doc(db, 'event_group_members', memberId);
    const memberDoc = await getDoc(memberRef);
    
    if (!memberDoc.exists()) {
      throw new Error('Member not found');
    }
    
    const memberData = memberDoc.data();
    
    await updateDoc(memberRef, {
      status: 'removed',
      removedAt: serverTimestamp(),
      removedBy: removerEmail,
      removalReason: reason
    });

    // Update group member count if member was active
    if (memberData.status === 'active') {
      await updateDoc(doc(db, 'event_groups', memberData.eventGroupId), {
        memberCount: increment(-1),
        'stats.lastActivity': serverTimestamp(),
        'stats.activeMembers': increment(-1)
      });
    }

    console.log('✅ Member removed and group updated');
    return true;
  } catch (error) {
    console.error('❌ Error removing member:', error);
    throw error;
  }
};

// Get event group members
export const getEventGroupMembers = async (eventGroupId, status = 'active') => {
  try {
    const membersQuery = query(
      collection(db, 'event_group_members'),
      where('eventGroupId', '==', eventGroupId),
      where('status', '==', status),
      orderBy('joinedAt', 'desc')
    );
    
    const membersSnapshot = await getDocs(membersQuery);
    return membersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        appliedAt: data.appliedAt?.toDate(),
        joinedAt: data.joinedAt?.toDate(),
        approvedAt: data.approvedAt?.toDate(),
        lastSeen: data.lastSeen?.toDate()
      };
    });
  } catch (error) {
    console.error('Error getting event group members:', error);
    return [];
  }
};

// Get user's event group status
export const getUserEventGroupStatus = async (eventGroupId, userEmail) => {
  try {
    const memberQuery = query(
      collection(db, 'event_group_members'),
      where('eventGroupId', '==', eventGroupId),
      where('userEmail', '==', userEmail)
    );
    
    const memberSnapshot = await getDocs(memberQuery);
    if (memberSnapshot.empty) {
      return null;
    }
    
    const memberDoc = memberSnapshot.docs[0];
    const data = memberDoc.data();
    return {
      id: memberDoc.id,
      ...data,
      appliedAt: data.appliedAt?.toDate(),
      joinedAt: data.joinedAt?.toDate()
    };
  } catch (error) {
    console.error('Error getting user status:', error);
    return null;
  }
};

// Check if user is event group member
export const isEventGroupMember = async (eventGroupId, userEmail) => {
  try {
    const memberQuery = query(
      collection(db, 'event_group_members'),
      where('eventGroupId', '==', eventGroupId),
      where('userEmail', '==', userEmail),
      where('status', '==', 'active')
    );
    
    const memberSnapshot = await getDocs(memberQuery);
    return !memberSnapshot.empty;
  } catch (error) {
    console.error('Error checking membership:', error);
    return false;
  }
};

// Check if user is event group admin
export const isEventGroupAdmin = async (eventGroupId, userEmail) => {
  try {
    const memberQuery = query(
      collection(db, 'event_group_members'),
      where('eventGroupId', '==', eventGroupId),
      where('userEmail', '==', userEmail),
      where('status', '==', 'active'),
      where('role', '==', 'admin')
    );
    
    const memberSnapshot = await getDocs(memberQuery);
    return !memberSnapshot.empty;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Get user's event group memberships
export const getUserEventGroupMemberships = async (userEmail) => {
  try {
    const membershipsQuery = query(
      collection(db, 'event_group_members'),
      where('userEmail', '==', userEmail),
      where('status', '==', 'active'),
      orderBy('joinedAt', 'desc')
    );
    
    const membershipsSnapshot = await getDocs(membershipsQuery);
    return membershipsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        appliedAt: data.appliedAt?.toDate(),
        joinedAt: data.joinedAt?.toDate(),
        lastSeen: data.lastSeen?.toDate()
      };
    });
  } catch (error) {
    console.error('Error getting user memberships:', error);
    return [];
  }
};

// ================================================================
// POST MANAGEMENT (For future use)
// ================================================================

// Create event group post
export const createEventGroupPost = async (postData) => {
  try {
    const postDoc = await addDoc(collection(db, 'event_group_posts'), {
      eventGroupId: postData.eventGroupId,
      eventId: postData.eventId,
      authorEmail: postData.authorEmail,
      authorName: postData.authorName,
      authorId: postData.authorId,
      authorPhoto: postData.authorPhoto || null,
      authorRole: postData.authorRole || 'member',
      
      title: postData.title || '',
      content: postData.content,
      postType: postData.postType || 'discussion',
      
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'published',
      isPinned: false,
      isAnnouncement: postData.postType === 'announcement',
      
      likesCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      
      category: postData.category || 'general',
      threadLevel: 0,
      tags: postData.tags || [],
      searchKeywords: generateSearchKeywords(postData.title + ' ' + postData.content),
      mentionedUsers: [],
      attachments: [],
      links: []
    });

    // Update group stats
    await updateDoc(doc(db, 'event_groups', postData.eventGroupId), {
      'stats.totalPosts': increment(1),
      'stats.lastActivity': serverTimestamp()
    });

    return postDoc.id;
  } catch (error) {
    console.error('Error creating event group post:', error);
    throw error;
  }
};

// Get event group posts
export const getEventGroupPosts = async (eventGroupId, limit = 20) => {
  try {
    const postsQuery = query(
      collection(db, 'event_group_posts'),
      where('eventGroupId', '==', eventGroupId),
      where('status', '==', 'published'),
      orderBy('isPinned', 'desc'),
      orderBy('createdAt', 'desc')
    );
    
    const postsSnapshot = await getDocs(postsQuery);
    return postsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      };
    });
  } catch (error) {
    console.error('Error getting event group posts:', error);
    return [];
  }
};

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

// Generate search keywords from text
const generateSearchKeywords = (text) => {
  if (!text) return [];
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2)
    .slice(0, 20);
};

// Safe helper to get event group by event ID
export const getEventGroupByEventId = async (eventId) => {
  try {
    const groupsQuery = query(
      collection(db, 'event_groups'),
      where('eventId', '==', eventId),
      where('status', '==', 'active')
    );
    
    const groupsSnapshot = await getDocs(groupsQuery);
    if (!groupsSnapshot.empty) {
      const doc = groupsSnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        eventDate: data.eventDate?.toDate ? data.eventDate.toDate() : data.eventDate
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting event group by event ID:', error);
    return null;
  }
};

// Debug function to list all event groups
export const debugListEventGroups = async () => {
  try {
    const groupsSnapshot = await getDocs(collection(db, 'event_groups'));
    console.log('🎪 All Event Groups:');
    groupsSnapshot.docs.forEach(doc => {
      console.log('Group ID:', doc.id, 'Data:', doc.data());
    });
    return groupsSnapshot.docs.length;
  } catch (error) {
    console.error('Error listing event groups:', error);
    return 0;
  }
};

// Debug function to list all event group members
export const debugListEventGroupMembers = async (eventGroupId) => {
  try {
    const membersSnapshot = await getDocs(
      query(collection(db, 'event_group_members'), where('eventGroupId', '==', eventGroupId))
    );
    console.log('👥 Event Group Members for', eventGroupId + ':');
    membersSnapshot.docs.forEach(doc => {
      console.log('Member ID:', doc.id, 'Data:', doc.data());
    });
    return membersSnapshot.docs.length;
  } catch (error) {
    console.error('Error listing event group members:', error);
    return 0;
  }
};
