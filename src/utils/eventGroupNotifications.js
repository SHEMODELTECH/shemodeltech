// src/utils/eventGroupNotifications.js
// 🔥 FINAL COMPLETE VERSION - Client-side functions for event group join notifications

import { collection, doc, getDoc, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';

/**
 * Send email notification to event group admin when someone requests to join
 * @param {string} eventGroupId - The ID of the event group
 * @param {Object} applicantData - Data about the person requesting to join
 * @param {string} applicationMessage - Optional message from the applicant
 */
export const sendEventGroupJoinNotification = async (eventGroupId, applicantData, applicationMessage = '') => {
  try {
    console.log('📧 Sending event group join notification...', { eventGroupId, applicantData });

    // 1. Get event group details
    const eventGroupDoc = await getDoc(doc(db, 'event_groups', eventGroupId));
    if (!eventGroupDoc.exists()) {
      throw new Error('Event group not found');
    }
    
    const eventGroupData = {
      id: eventGroupDoc.id,
      ...eventGroupDoc.data()
    };

    // 2. Get event group admins
    const adminsQuery = query(
      collection(db, 'event_group_members'),
      where('eventGroupId', '==', eventGroupId),
      where('role', '==', 'admin'),
      where('status', '==', 'active')
    );
    
    const adminsSnapshot = await getDocs(adminsQuery);
    
    if (adminsSnapshot.empty) {
      console.warn('No active admins found for event group:', eventGroupId);
      // Fallback: try to get the event group creator
      const creatorEmail = eventGroupData.createdBy || eventGroupData.adminEmail;
      if (creatorEmail) {
        await sendNotificationEmail({
          eventGroupData,
          applicantData: {
            ...applicantData,
            applicationMessage
          },
          adminData: {
            email: creatorEmail,
            name: 'Event Group Admin'
          }
        });
        return true;
      } else {
        throw new Error('No admin found to notify');
      }
    }

    // 3. Send email to all admins
    const emailPromises = adminsSnapshot.docs.map(async (adminDoc) => {
      const adminData = adminDoc.data();
      
      return sendNotificationEmail({
        eventGroupData,
        applicantData: {
          ...applicantData,
          applicationMessage
        },
        adminData: {
          email: adminData.userEmail,
          name: adminData.userName || 'Event Group Admin'
        }
      });
    });

    await Promise.all(emailPromises);
    
    console.log('✅ Successfully sent event group join notifications');
    return true;

  } catch (error) {
    console.error('❌ Error sending event group join notification:', error);
    throw error;
  }
};

/**
 * Internal function to send the actual notification email
 */
const sendNotificationEmail = async ({ eventGroupData, applicantData, adminData }) => {
  try {
    const response = await fetch('/api/notifications/send-event-group-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventGroupData,
        applicantData,
        adminData
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send notification email');
    }

    console.log('✅ Email notification sent successfully:', result);
    return result;

  } catch (error) {
    console.error('❌ Error sending notification email:', error);
    throw error;
  }
};

/**
 * Handle the complete event group join request process
 * @param {string} eventGroupId - The ID of the event group
 * @param {Object} currentUser - The current user object from auth
 * @param {string} eventRole - The role they want in the event (optional)
 * @param {string} applicationMessage - Message from the applicant (optional)
 */
export const requestToJoinEventGroup = async (eventGroupId, currentUser, eventRole = 'Attendee', applicationMessage = '') => {
  try {
    console.log('🎪 Processing event group join request...', { eventGroupId, currentUser, eventRole });

    // 1. Check if user is already a member or has pending application
    const existingMemberQuery = query(
      collection(db, 'event_group_members'),
      where('eventGroupId', '==', eventGroupId),
      where('userEmail', '==', currentUser.email)
    );
    
    const existingMemberSnapshot = await getDocs(existingMemberQuery);
    
    if (!existingMemberSnapshot.empty) {
      const existingMember = existingMemberSnapshot.docs[0].data();
      
      if (existingMember.status === 'active') {
        toast.info('You are already a member of this event group!');
        return { success: false, reason: 'already_member' };
      } else if (existingMember.status === 'pending') {
        toast.info('Your application is already pending review!');
        return { success: false, reason: 'already_pending' };
      }
    }

    // 2. Create the membership application record
    const applicationData = {
      eventGroupId: eventGroupId,
      userEmail: currentUser.email,
      userName: currentUser.displayName || currentUser.email,
      userPhoto: currentUser.photoURL || null,
      eventRole: eventRole,
      status: 'pending',
      appliedAt: serverTimestamp(),
      applicationMessage: applicationMessage.trim(),
      appliedBy: currentUser.uid
    };

    console.log('📝 Creating membership application...', applicationData);
    
    const docRef = await addDoc(collection(db, 'event_group_members'), applicationData);
    
    console.log('✅ Membership application created with ID:', docRef.id);

    // 3. Send email notification to admins
    try {
      await sendEventGroupJoinNotification(eventGroupId, {
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email,
        userPhoto: currentUser.photoURL || null,
        eventRole: eventRole,
        applicationMessage: applicationMessage.trim(),
        appliedAt: new Date(),
        appliedBy: currentUser.uid
      }, applicationMessage);

      console.log('✅ Email notification sent to group admins');
      
    } catch (emailError) {
      console.error('⚠️ Application created but email notification failed:', emailError);
      // Don't fail the entire operation if email fails
    }

    toast.success('🎉 Your request to join the event group has been submitted!');
    return { 
      success: true, 
      applicationId: docRef.id,
      message: 'Application submitted successfully. Group admins will review your request.' 
    };

  } catch (error) {
    console.error('❌ Error processing event group join request:', error);
    toast.error('Failed to submit join request: ' + error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send notification when an admin approves a join request
 * @param {string} eventGroupId - The ID of the event group
 * @param {Object} memberData - Data about the approved member
 */
export const sendEventGroupApprovalNotification = async (eventGroupId, memberData) => {
  try {
    // Get event group details
    const eventGroupDoc = await getDoc(doc(db, 'event_groups', eventGroupId));
    if (!eventGroupDoc.exists()) {
      throw new Error('Event group not found');
    }
    
    const eventGroupData = {
      id: eventGroupDoc.id,
      ...eventGroupDoc.data()
    };

    // Create notification record
    await addDoc(collection(db, 'notifications'), {
      recipientEmail: memberData.userEmail,
      type: 'event_group_approved',
      title: 'Welcome to the Event Group! 🎉',
      message: `Your request to join "${eventGroupData.eventTitle || eventGroupData.title}" has been approved. Welcome to the group!`,
      eventGroupId: eventGroupId,
      eventId: eventGroupData.eventId || null,
      createdAt: serverTimestamp(),
      read: false,
      data: {
        eventGroupTitle: eventGroupData.eventTitle || eventGroupData.title,
        eventGroupId: eventGroupId,
        memberRole: memberData.eventRole || 'Attendee'
      }
    });

    console.log('✅ Approval notification created for:', memberData.userEmail);
    return true;

  } catch (error) {
    console.error('❌ Error sending approval notification:', error);
    throw error;
  }
};

/**
 * Get the current user's membership status for an event group
 * @param {string} eventGroupId - The ID of the event group
 * @param {string} userEmail - The user's email address
 * @returns {string|null} - Status: 'active', 'pending', 'rejected', or null if not found
 */
export const getUserEventGroupStatus = async (eventGroupId, userEmail) => {
  try {
    console.log('🔍 Checking user event group status...', { eventGroupId, userEmail });

    const memberQuery = query(
      collection(db, 'event_group_members'),
      where('eventGroupId', '==', eventGroupId),
      where('userEmail', '==', userEmail)
    );
    
    const memberSnapshot = await getDocs(memberQuery);
    
    if (memberSnapshot.empty) {
      console.log('👤 User not found in event group');
      return null;
    }

    // Get the most recent membership record (in case there are multiple)
    const memberDoc = memberSnapshot.docs[0];
    const memberData = memberDoc.data();
    
    console.log('✅ Found user membership status:', memberData.status);
    return memberData.status;

  } catch (error) {
    console.error('❌ Error checking user event group status:', error);
    throw error;
  }
};

/**
 * Check if a user is an admin of an event group
 * @param {string} eventGroupId - The ID of the event group
 * @param {string} userEmail - The user's email address
 * @returns {boolean} - True if user is an admin
 */
export const isUserEventGroupAdmin = async (eventGroupId, userEmail) => {
  try {
    const adminQuery = query(
      collection(db, 'event_group_members'),
      where('eventGroupId', '==', eventGroupId),
      where('userEmail', '==', userEmail),
      where('role', '==', 'admin'),
      where('status', '==', 'active')
    );
    
    const adminSnapshot = await getDocs(adminQuery);
    return !adminSnapshot.empty;

  } catch (error) {
    console.error('❌ Error checking admin status:', error);
    return false;
  }
};

/**
 * Get all event groups a user is a member of
 * @param {string} userEmail - The user's email address
 * @returns {Array} - Array of event group data
 */
export const getUserEventGroups = async (userEmail) => {
  try {
    console.log('🔍 Getting user event groups...', { userEmail });

    const memberQuery = query(
      collection(db, 'event_group_members'),
      where('userEmail', '==', userEmail),
      where('status', '==', 'active')
    );
    
    const memberSnapshot = await getDocs(memberQuery);
    
    if (memberSnapshot.empty) {
      console.log('👤 User not a member of any event groups');
      return [];
    }

    // Get event group details for each membership
    const eventGroupPromises = memberSnapshot.docs.map(async (memberDoc) => {
      const memberData = memberDoc.data();
      const eventGroupDoc = await getDoc(doc(db, 'event_groups', memberData.eventGroupId));
      
      if (eventGroupDoc.exists()) {
        return {
          id: eventGroupDoc.id,
          ...eventGroupDoc.data(),
          memberRole: memberData.role || 'member',
          joinedAt: memberData.joinedAt?.toDate()
        };
      }
      return null;
    });

    const eventGroups = await Promise.all(eventGroupPromises);
    const validEventGroups = eventGroups.filter(group => group !== null);
    
    console.log('✅ Found user event groups:', validEventGroups.length);
    return validEventGroups;

  } catch (error) {
    console.error('❌ Error getting user event groups:', error);
    throw error;
  }
};

// Export all functions
export default {
  sendEventGroupJoinNotification,
  requestToJoinEventGroup,
  sendEventGroupApprovalNotification,
  getUserEventGroupStatus,
  isUserEventGroupAdmin,
  getUserEventGroups
};
