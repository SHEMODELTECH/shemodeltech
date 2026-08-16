// =================================================================
// COMPLETE FILE: src/utils/emailNotifications.js
// =================================================================

// Client-side utility for sending email notifications

/**
 * Send email notification via API
 * @param {string} endpoint - The API endpoint (without /api/notifications/)
 * @param {object} data - The data to send in the request body
 * @returns {Promise<object>} - Response from the email API
 */
const sendEmailNotification = async (endpoint, data) => {
  try {
    console.log(`📧 Sending email notification via ${endpoint}...`);
    
    const response = await fetch(`/api/notifications/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Email notification sent successfully:`, result.results);
      return { success: true, results: result.results };
    } else {
      console.error(`❌ Email notification failed:`, result.error);
      return { success: false, error: result.error };
    }
    
  } catch (error) {
    console.error(`💥 Error sending email notification:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Send project approval notification
 * @param {object} projectData - Project data including contactEmail, projectTitle, etc.
 */
export const notifyProjectApproved = async (projectData) => {
  return await sendEmailNotification('send-project-approved', {
    projectData: projectData
  });
};

/**
 * Send project review approval notification
 * @param {object} completionData - Completion data including adminEmail, projectTitle, etc.
 */
export const notifyProjectReviewApproved = async (completionData) => {
  return await sendEmailNotification('send-project-review-approved', {
    completionData: completionData
  });
};

/**
 * Send event published notification
 * @param {object} eventData - Event data including organizerEmail, eventTitle, etc.
 */
export const notifyEventPublished = async (eventData) => {
  return await sendEmailNotification('send-event-published', {
    eventData: eventData
  });
};

/**
 * Send application approval notification
 * @param {object} applicationData - Application data including applicantEmail, projectTitle, etc.
 */
export const notifyApplicationApproved = async (applicationData) => {
  return await sendEmailNotification('send-application-approved', {
    applicationData: applicationData
  });
};

/**
 * Send project submission notification to admins
 * @param {object} projectData - Project data for admin review
 */
export const notifyAdminsProjectSubmitted = async (projectData) => {
  return await sendEmailNotification('send-project-submitted-admin', {
    projectData: projectData
  });
};

/**
 * Send badge awarded notification to member
 * @param {object} badgeData - Badge data (category, level, contribution, etc.)
 * @param {object} projectData - Project data (title, id, etc.)
 * @param {object} memberData - Member data (email, name, role, etc.)
 */
export const notifyBadgeAwarded = async (badgeData, projectData, memberData) => {
  return await sendEmailNotification('send-badge-awarded', {
    badgeData,
    projectData,
    memberData
  });
};

/**
 * Send application rejected notification
 * @param {object} applicationData - Application data including applicantEmail
 * @param {object} projectData - Project data
 * @param {string} rejectionReason - Reason for rejection
 */
export const notifyApplicationRejected = async (applicationData, projectData, rejectionReason = '') => {
  return await sendEmailNotification('send-application-rejected', {
    applicationData,
    projectData,
    rejectionReason
  });
};

/**
 * Send new application notification to project owner
 * @param {object} data - { projectOwnerEmail, projectOwnerName, applicantName, applicantEmail, projectTitle, role, skills, message }
 */
export const notifyNewApplicationToOwner = async (data) => {
  return await sendEmailNotification('send-new-application-to-owner', data);
};

/**
 * Safely send email notification with error handling
 * @param {Function} notificationFunction - The notification function to call
 * @param {object} data - Data to pass to the notification function
 * @param {string} successMessage - Success message for toast/console
 * @param {boolean} showToast - Whether to show toast notifications (default: false)
 */
export const safeEmailNotification = async (notificationFunction, data, successMessage = '', showToast = false) => {
  try {
    const result = await notificationFunction(data);
    
    if (result.success) {
      const message = successMessage || 'Email notification sent successfully';
      console.log(`✅ ${message}`);
      
      if (showToast && window.toast) {
        window.toast.success(message);
      }
      
      return result;
    } else {
      const errorMessage = `Email notification failed: ${result.error}`;
      console.warn(`⚠️ ${errorMessage}`);
      
      if (showToast && window.toast) {
        window.toast.warn('Email notification failed, but action completed successfully');
      }
      
      return result;
    }
  } catch (error) {
    const errorMessage = `Email notification error: ${error.message}`;
    console.error(`❌ ${errorMessage}`);
    
    if (showToast && window.toast) {
      window.toast.warn('Email notification failed, but action completed successfully');
    }
    
    return { success: false, error: error.message };
  }
};

/**
 * Send mention notification email
 * @param {object} notificationData - Notification data (type, postId, etc.)
 * @param {object} mentionedUser - User who was mentioned
 * @param {object} mentioner - User who did the mentioning
 * @param {object} postData - Optional post data for context
 */
export const notifyUserMentioned = async (notificationData, mentionedUser, mentioner, postData = null) => {
  return await sendEmailNotification('send-mention-email', {
    notificationData,
    mentionedUser, 
    mentioner,
    postData
  });
};

/**
 * Send mention notification with enhanced error handling and logging
 * @param {object} notificationData - Notification data
 * @param {object} mentionedUser - User who was mentioned  
 * @param {object} mentioner - User who did the mentioning
 * @param {object} postData - Optional post data
 * @param {boolean} showToast - Whether to show toast notifications
 */
export const safeMentionNotification = async (notificationData, mentionedUser, mentioner, postData = null, showToast = false) => {
  const successMessage = `Mention notification sent to ${mentionedUser.firstName && mentionedUser.lastName 
    ? `${mentionedUser.firstName} ${mentionedUser.lastName}` 
    : mentionedUser.displayName || mentionedUser.email}`;
    
  return await safeEmailNotification(
    (data) => notifyUserMentioned(data.notificationData, data.mentionedUser, data.mentioner, data.postData),
    { notificationData, mentionedUser, mentioner, postData },
    successMessage,
    showToast
  );
};
