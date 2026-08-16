// api/notifications/[type].js
// Consolidated notification router - handles all notification types in a single serverless function
// This replaces 6 separate files to stay within Vercel Hobby plan's 12 function limit

const { sendMail } = require('../../lib/mailer');

// Brand/config - override via Vercel env vars, never hardcode again.
const SITE = process.env.SITE_URL || 'https://shemodeltech.com';
const BRAND_NAME = 'She Model Tech';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'shemodeltech@gmail.com';

// ============================================================
// SHARED UTILITIES
// ============================================================


function checkEnvVars() {
  const missing = [];
  if (!process.env.EMAIL_USER) missing.push('EMAIL_USER');
  if (!process.env.EMAIL_PASSWORD) missing.push('EMAIL_PASSWORD');
  return missing;
}

// ============================================================
// EMAIL TEMPLATES
// ============================================================

function getApplicationApprovedEmail(applicationData, projectData) {
  const projectTitle = projectData?.projectTitle || applicationData.projectTitle || 'Project';
  const groupId = projectData?.groupId;
  const groupUrl = groupId 
    ? `${SITE}/groups/${groupId}` 
    : `${SITE}/my-groups`;

  return {
    to: applicationData.applicantEmail,
    cc: applicationData.additionalEmails || [],
    subject: `Application Approved: Welcome to ${projectTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #9C27B0, #7B1FA2); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .button { background-color: #9C27B0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .welcome-box { background: #f3e5f5; border: 2px solid #9C27B0; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .badge-box { background: #fff3e0; border: 2px solid #FF9800; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to the Team!</h1>
            </div>
            <div class="content">
              <h2>Congratulations, ${applicationData.applicantName || 'Team Member'}!</h2>
              <div class="welcome-box">
                <h3 style="color: #9C27B0; margin: 0;">You're In!</h3>
                <p style="margin: 10px 0; color: #7B1FA2; font-size: 18px;">Your application has been approved!</p>
              </div>
              <p>The project owner has reviewed your application and is excited to have you join their team. This is the beginning of your journey to earning valuable TechTalent Badges!</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #9C27B0; margin-top: 0;">Project Details:</h3>
                <p><strong>Project:</strong> ${projectTitle}</p>
                <p><strong>Your Role:</strong> ${applicationData.roleAppliedFor || 'Team Member'}</p>
                <p><strong>Project Owner:</strong> ${projectData?.contactName || applicationData.projectOwner || 'Project Team'}</p>
                <p><strong>Approval Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              <div class="badge-box">
                <h3 style="color: #E65100; margin-top: 0;">Earn TechTalent Badges</h3>
                <p style="color: #666; margin: 10px 0;">As you work on this project, you'll earn <strong>TechTalent Badges</strong> that showcase your skills, achievements, and problem-solving abilities.</p>
              </div>
              <h3 style="color: #9C27B0;">What's Next?</h3>
              <ul>
                <li>Join your project group and meet your team members</li>
                <li>Review project requirements and timeline</li>
                <li>Start contributing and earning your badges</li>
                <li>Collaborate with your team in the group workspace</li>
                <li>Use our AI-powered Career Navigator for personalized guidance</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${groupUrl}" class="button">Join Your Team Group</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} She Model Tech. All rights reserved.</p>
              <p><em>Where Projects Power Careers</em></p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Application Approved: Welcome to ${projectTitle}\n\nCongratulations, ${applicationData.applicantName || 'Team Member'}!\nYour application has been approved!\n\nProject: ${projectTitle}\nRole: ${applicationData.roleAppliedFor || 'Team Member'}\nProject Owner: ${projectData?.contactName || applicationData.projectOwner || 'Project Team'}\n\nJoin Your Team: ${groupUrl}`
  };
}

function getApplicationRejectedEmail(applicationData, projectData, rejectionReason) {
  const projectTitle = projectData?.projectTitle || 'Project';
  const applicantName = applicationData.applicantName || 'Applicant';
  const companyName = projectData?.companyName || projectData?.contactName || 'Team';
  const projectOwnerName = projectData.contactName || 'Project Owner';

  return {
    to: applicationData.applicantEmail,
    replyTo: projectData.contactEmail || undefined,
    subject: `Application Update: ${projectTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { max-width: 700px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #FF6B35, #F7931E); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .button { background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .info-box { background: #fff3e0; border: 2px solid #FF9800; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .info-section { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #FF6B35; }
            .feedback-section { background: #f3e5f5; border: 1px solid #9c27b0; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Update</h1>
              <p style="margin: 5px 0; font-size: 18px;">Regarding your application to "${projectTitle}"</p>
            </div>
            <div class="content">
              <h2>Hello ${applicantName},</h2>
              <div class="info-box">
                <h3 style="color: #E65100; margin: 0 0 10px 0;">Application Status Update</h3>
                <p style="margin: 5px 0; font-size: 16px;">Thank you for your interest in <strong>"${projectTitle}"</strong>.</p>
                <p style="margin: 10px 0; color: #666;">After careful consideration, we have decided not to move forward with your application at this time.</p>
              </div>
              <div class="info-section">
                <h3 style="color: #FF6B35; margin-top: 0;">Project Details</h3>
                <p><strong>Project:</strong> ${projectTitle}</p>
                <p><strong>Company/Team:</strong> ${companyName}</p>
                <p><strong>Decision Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              ${rejectionReason && rejectionReason.trim() ? `
              <div class="feedback-section">
                <h3 style="color: #7b1fa2; margin-top: 0;">Feedback from ${projectOwnerName}</h3>
                <p style="color: #333; line-height: 1.6; white-space: pre-line; font-style: italic;">"${rejectionReason}"</p>
              </div>` : ''}
              <div style="background: #e8f5e9; border: 1px solid #4CAF50; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h3 style="color: #2E7D32; margin-top: 0;">Keep Moving Forward!</h3>
                <p style="color: #2E7D32;">This decision doesn't reflect on your skills or potential. Continue building your skills with other projects!</p>
              </div>
              <div style="text-align: center;"><a href="${SITE}/projects" class="button">Explore More Projects</a></div>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">Best regards,<br/><strong>${projectOwnerName}</strong><br/>${companyName}</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} She Model Tech. All rights reserved.</p>
              <p><em>Where Projects Power Careers</em></p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Application Update: ${projectTitle}\n\nHello ${applicantName},\nAfter careful consideration, we have decided not to move forward with your application at this time.\n${rejectionReason ? `\nFeedback: "${rejectionReason}"\n` : ''}\nExplore More Projects: ${SITE}/projects`
  };
}

function getBadgeAwardedEmail(badgeData, projectData, memberData) {
  const badgeCategories = {
    'mentorship': { name: 'TechMO Badge', color: '#F59E0B', emoji: '🎓', image: '/Images/TechMO.png', description: 'Mentorship & Leadership Excellence' },
    'quality-assurance': { name: 'TechQA Badge', color: '#3B82F6', emoji: '🔍', image: '/Images/TechQA.png', description: 'Quality Assurance & Testing Mastery' },
    'development': { name: 'TechDev Badge', color: '#10B981', emoji: '💻', image: '/Images/TechDev.png', description: 'Development & Programming Skills' },
    'leadership': { name: 'TechLeads Badge', color: '#8B5CF6', emoji: '👑', image: '/Images/TechLeads.png', description: 'Technical Leadership & Project Management' },
    'design': { name: 'TechArchs Badge', color: '#F97316', emoji: '🎨', image: '/Images/TechArchs.png', description: 'Architecture & Design Excellence' },
    'security': { name: 'TechGuard Badge', color: '#EF4444', emoji: '🛡️', image: '/Images/TechGuard.png', description: 'Security & Protection Expertise' }
  };

  const badgeInfo = badgeCategories[badgeData.badgeCategory] || { name: 'TechTalent Badge', color: '#6B7280', emoji: '🏆', image: '/Images/512X512.png', description: 'Technical Excellence Recognition' };
  const badgeLevel = (badgeData.badgeLevel || 'novice').charAt(0).toUpperCase() + (badgeData.badgeLevel || 'novice').slice(1);

  return {
    to: memberData.memberEmail,
    cc: memberData.additionalEmails || [],
    subject: `Congratulations! You've Earned a ${badgeInfo.name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, ${badgeInfo.color}, #1F2937); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .button { background-color: ${badgeInfo.color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .badge-showcase { background: linear-gradient(135deg, ${badgeInfo.color}20, ${badgeInfo.color}10); border: 2px solid ${badgeInfo.color}; padding: 25px; border-radius: 12px; margin: 20px 0; text-align: center; }
            .skill-tag { background-color: ${badgeInfo.color}20; color: ${badgeInfo.color}; padding: 6px 12px; border-radius: 20px; font-size: 12px; margin: 2px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${badgeInfo.emoji} Badge Awarded!</h1>
              <p style="font-size: 18px; margin: 10px 0;">Outstanding Achievement Recognized</p>
            </div>
            <div class="content">
              <h2>Congratulations, ${memberData.memberName || 'Team Member'}!</h2>
              <div class="badge-showcase">
                <img src="${SITE}${badgeInfo.image}" alt="${badgeInfo.name}" style="width: 80px; height: 80px; margin: 0 auto 15px auto; display: block; border-radius: 8px;" onerror="this.style.display='none';" />
                <h3 style="color: ${badgeInfo.color}; margin: 0 0 5px 0; font-size: 24px;">${badgeInfo.name}</h3>
                <p style="margin: 0 0 5px 0; color: #6B7280; font-size: 14px; font-style: italic;">${badgeInfo.description}</p>
                <p style="margin: 5px 0; color: #4B5563; font-size: 18px; font-weight: bold;">${badgeLevel} Level</p>
                <p style="margin: 10px 0; color: #6B7280; font-size: 14px;">Awarded for exceptional contribution to "${projectData.projectTitle}"</p>
              </div>
              <p>Your project owner <strong>${projectData.contactName || 'Project Team'}</strong> has recognized your outstanding contribution!</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #E5E7EB;">
                <h3 style="color: ${badgeInfo.color}; margin: 0 0 15px 0;">Badge Details</h3>
                <p><strong>Project:</strong> ${projectData.projectTitle}</p>
                <p><strong>Your Role:</strong> ${memberData.memberRole || 'Team Member'}</p>
                <p><strong>Award Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Contribution Quality:</strong> ${(badgeData.contribution || 'good').charAt(0).toUpperCase() + (badgeData.contribution || 'good').slice(1)}</p>
              </div>
              ${badgeData.skillsDisplayed && badgeData.skillsDisplayed.length > 0 ? `
                <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h4 style="color: #374151; margin-top: 0;">Skills Demonstrated:</h4>
                  <div>${badgeData.skillsDisplayed.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}</div>
                </div>` : ''}
              ${badgeData.adminNotes ? `
                <div style="background: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h4 style="color: #92400E; margin-top: 0;">Recognition Notes:</h4>
                  <p style="color: #92400E; margin: 0; font-style: italic;">"${badgeData.adminNotes}"</p>
                </div>` : ''}
              <div style="text-align: center; margin: 30px 0;">
                <a href="${SITE}/" class="button">View Your Badge Collection</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} She Model Tech. All rights reserved.</p>
              <p><em>Where Projects Power Careers</em></p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Congratulations! You've Earned a ${badgeInfo.name}\n\nDear ${memberData.memberName || 'Team Member'},\nBadge: ${badgeInfo.name} (${badgeLevel})\nProject: ${projectData.projectTitle}\nRole: ${memberData.memberRole || 'Team Member'}\n\nView your badges: ${SITE}/`
  };
}

function getNewApplicationEmail(body) {
  const { projectOwnerEmail, projectOwnerName, applicantName, applicantEmail, roleAppliedFor, projectTitle, projectType, experience, skills, portfolio, motivation, hoursPerWeek, availableStart, applicationDate } = body;

  return {
    to: projectOwnerEmail,
    replyTo: applicantEmail,
    subject: `New Application: ${applicantName} wants to join "${projectTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { max-width: 700px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .button { background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .applicant-box { background: #e8f5e9; border: 2px solid #4CAF50; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-section { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #4CAF50; }
            .action-box { background: #fff3e0; border: 2px solid #FF9800; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Project Application!</h1>
            </div>
            <div class="content">
              <h2>Hi ${projectOwnerName || 'Project Owner'},</h2>
              <div class="applicant-box">
                <h3 style="color: #2E7D32; margin: 0 0 15px 0;">New Applicant Details</h3>
                <p><strong>Name:</strong> ${applicantName}</p>
                <p><strong>Email:</strong> <a href="mailto:${applicantEmail}">${applicantEmail}</a></p>
                <p><strong>Role:</strong> ${roleAppliedFor || 'Not specified'}</p>
                <p><strong>Availability:</strong> ${hoursPerWeek || 'Not specified'} ${hoursPerWeek ? 'hours/week' : ''}</p>
                ${portfolio && portfolio !== 'Not provided' ? `<p><strong>Portfolio:</strong> <a href="${portfolio}">View Portfolio</a></p>` : ''}
              </div>
              ${experience ? `<div class="detail-section"><h3 style="color: #4CAF50; margin-top: 0;">Experience</h3><p style="white-space: pre-line;">${experience}</p></div>` : ''}
              ${skills ? `<div class="detail-section"><h3 style="color: #4CAF50; margin-top: 0;">Skills</h3><p>${skills}</p></div>` : ''}
              ${motivation ? `<div class="detail-section"><h3 style="color: #4CAF50; margin-top: 0;">Motivation</h3><p style="font-style: italic;">"${motivation}"</p></div>` : ''}
              <div class="action-box">
                <h3 style="color: #E65100; margin-top: 0;">Action Required</h3>
                <p>Review this application and decide whether to approve or reject it.</p>
                <a href="${SITE}/projects/owner-dashboard" class="button">Review Application Now</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} She Model Tech. All rights reserved.</p>
              <p><em>Where Projects Power Careers</em></p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `New Application for ${projectTitle}\n\nApplicant: ${applicantName} (${applicantEmail})\nRole: ${roleAppliedFor || 'Not specified'}\n\nReview: ${SITE}/projects/owner-dashboard`
  };
}

function getProjectReviewApprovedEmail(body) {
  const { projectOwnerEmail, projectOwnerName, projectTitle, groupId, teamSize, approvalDate } = body;
  const badgeAssignmentUrl = `${SITE}/career/project-completion/${groupId}`;

  return {
    to: projectOwnerEmail,
    subject: `Project Approved: Ready to Award TechTalent Badges - "${projectTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container { max-width: 700px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .button { background-color: #FF9800; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; font-size: 16px; }
            .footer { background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .success-box { background: #e8f5e9; border: 2px solid #4CAF50; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .badge-box { background: #fff3e0; border: 2px solid #FF9800; padding: 20px; border-radius: 8px; margin: 25px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Project Approved! 🎉</h1>
              <p style="font-size: 18px;">Time to Award TechTalent Badges</p>
            </div>
            <div class="content">
              <h2>Congratulations, ${projectOwnerName || 'Project Owner'}!</h2>
              <div class="success-box">
                <h3 style="color: #2E7D32; margin: 0;">"${projectTitle}" Has Been Approved!</h3>
                <p style="color: #666;">Your project completion has been reviewed and approved.</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                <p><strong>Project:</strong> ${projectTitle}</p>
                <p><strong>Team Size:</strong> ${teamSize || 'Not specified'} member(s)</p>
                <p><strong>Approval Date:</strong> ${new Date(approvalDate || Date.now()).toLocaleDateString()}</p>
              </div>
              <div class="badge-box">
                <h3 style="color: #E65100; margin-top: 0;">Next Step: Award TechTalent Badges 🏆</h3>
                <p style="color: #666;">You can now assign TechTalent Badges to your team members based on their contributions!</p>
                <div style="text-align: center;"><a href="${badgeAssignmentUrl}" class="button">🏆 Assign Badges Now</a></div>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} She Model Tech. All rights reserved.</p>
              <p><em>Where Projects Power Careers</em></p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Project Approved: ${projectTitle}\n\nYou can now assign TechTalent Badges!\nAssign Badges: ${badgeAssignmentUrl}`
  };
}

function getProjectReviewRejectedEmail(body) {
  const { projectOwnerEmail, projectOwnerName, projectTitle, groupId, rejectionReason, rejectionDate, resubmissionUrl } = body;
  const formattedDate = new Date(rejectionDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return {
    to: projectOwnerEmail,
    subject: `Project Review Update: "${projectTitle}" - Revision Required`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden;">
                <tr><td style="background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Project Review Update</h1>
                  <p style="color: #FFF3E0; margin: 10px 0 0 0;">Revision Required</p>
                </td></tr>
                <tr><td style="padding: 40px 30px;">
                  <p style="color: #333; font-size: 16px;">Hello <strong>${projectOwnerName}</strong>,</p>
                  <p style="color: #333; font-size: 16px;">Thank you for submitting <strong>"${projectTitle}"</strong> for review. We need you to make some revisions before approval.</p>
                  <div style="background-color: #FFF3E0; border-left: 4px solid #FF9800; padding: 20px; margin: 25px 0; border-radius: 4px;">
                    <h3 style="color: #F57C00; margin: 0 0 10px 0;">Required Changes:</h3>
                    <p style="color: #333; white-space: pre-line;">${rejectionReason}</p>
                  </div>
                  <div style="background-color: #E3F2FD; border-left: 4px solid #2196F3; padding: 15px; margin: 25px 0; border-radius: 4px;">
                    <p style="color: #1976D2; font-weight: bold;">Common Issues to Check:</p>
                    <ul style="color: #333; font-size: 14px;">
                      <li>Repository must be public and accessible</li>
                      <li>The <strong>SHEMODELTECH</strong> GitHub account must be added as a collaborator on the repository (github.com/SHEMODELTECH)</li>
                      <li>All team member names should be visible</li>
                      <li>Repository URL should be valid and working</li>
                    </ul>
                  </div>
                  <table width="100%" style="margin: 30px 0;"><tr><td align="center">
                    <a href="${resubmissionUrl}" style="display: inline-block; background: linear-gradient(135deg, #FF9800, #F57C00); color: #fff; text-decoration: none; padding: 15px 40px; border-radius: 25px; font-weight: bold;">Go to Group Page</a>
                  </td></tr></table>
                  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 30px;">
                    <p><strong>Project:</strong> ${projectTitle}</p>
                    <p><strong>Review Date:</strong> ${formattedDate}</p>
                    <p><strong>Group ID:</strong> ${groupId}</p>
                  </div>
                </td></tr>
                <tr><td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="color: #666; font-size: 14px;">Need help? Contact <a href="mailto:${SUPPORT_EMAIL}" style="color: #FF9800;">${SUPPORT_EMAIL}</a></p>
                  <p style="color: #999; font-size: 12px;">She Model Tech | Building Tomorrow's Tech Leaders</p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
      </html>
    `,
    text: `Project Review Update: "${projectTitle}" - Revision Required\n\nRequired Changes: ${rejectionReason}\n\nResubmit: ${resubmissionUrl}`
  };
}

function getProjectSubmittedAdminEmail(projectData) {
  const projectTitle = projectData.projectTitle || 'Untitled Project';
  const submitterName = projectData.submitterName || 'Unknown';
  const submitterEmail = projectData.submitterEmail || '';
  const adminEmails = process.env.ADMIN_EMAILS || process.env.EMAIL_USER;

  return {
    to: adminEmails,
    subject: `New Project Submitted: ${projectTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #F97316, #EA580C); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .button { background-color: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>New Project Submitted</h1></div>
            <div class="content">
              <h2>A new project needs review</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Project:</strong> ${projectTitle}</p>
                <p><strong>Submitted by:</strong> ${submitterName} (${submitterEmail})</p>
                <p><strong>Industry:</strong> ${projectData.industryTrack || 'Not specified'}</p>
                <p><strong>Timeline:</strong> ${projectData.timeline || 'Not specified'}</p>
                <p><strong>Type:</strong> ${projectData.pricingType === 'paid' ? 'Paid' : 'Free'}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              <div style="text-align: center;"><a href="${SITE}/admin" class="button">Review in Admin Dashboard</a></div>
            </div>
            <div class="footer"><p>She Model Tech Admin Notifications</p></div>
          </div>
        </body>
      </html>
    `,
    text: `New Project Submitted: ${projectTitle}\nBy: ${submitterName} (${submitterEmail})\nReview: ${SITE}/admin`
  };
}

function getProjectApprovedEmail(projectData) {
  const projectTitle = projectData.projectTitle || 'Your Project';
  const contactEmail = projectData.contactEmail || projectData.submitterEmail;
  const contactName = projectData.contactName || projectData.submitterName || 'Project Owner';

  return {
    to: contactEmail,
    subject: `Project Approved: ${projectTitle} is Now Live!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #22C55E, #16A34A); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .button { background-color: #22C55E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>Project Approved!</h1></div>
            <div class="content">
              <h2>Congratulations, ${contactName}!</h2>
              <p>Your project <strong>"${projectTitle}"</strong> has been approved and is now live on She Model Tech. Team members can now discover and apply to join your project.</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #22C55E; margin-top: 0;">What's Next?</h3>
                <ul>
                  <li>Review applications as they come in</li>
                  <li>Approve team members to start collaborating</li>
                  <li>Complete the project to award TechTalent Badges</li>
                </ul>
              </div>
              <div style="text-align: center;"><a href="${SITE}/projects/my-projects" class="button">Manage Your Project</a></div>
            </div>
            <div class="footer"><p>She Model Tech - Build Together, Grow Together</p></div>
          </div>
        </body>
      </html>
    `,
    text: `Project Approved: ${projectTitle}\nYour project is now live on She Model Tech!\nManage it: ${SITE}/projects/my-projects`
  };
}

function getMentionEmail(notificationData, mentionedUser, mentioner, postData) {
  const mentionerName = mentioner.displayName || mentioner.firstName || mentioner.email || 'Someone';
  const mentionedName = mentionedUser.displayName || mentionedUser.firstName || 'there';
  const postUrl = `${SITE}/community/post/${notificationData.postId || ''}`;

  return {
    to: mentionedUser.email,
    subject: `${mentionerName} mentioned you on She Model Tech`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .button { background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>You Were Mentioned!</h1></div>
            <div class="content">
              <h2>Hey ${mentionedName}!</h2>
              <p><strong>${mentionerName}</strong> mentioned you in a ${notificationData.type === 'reply_mention' ? 'reply' : 'post'} on She Model Tech.</p>
              ${postData?.content ? `<div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #3B82F6; margin: 20px 0; color: #374151;">${postData.content.substring(0, 200)}${postData.content.length > 200 ? '...' : ''}</div>` : ''}
              <div style="text-align: center;"><a href="${postUrl}" class="button">View Post</a></div>
            </div>
            <div class="footer"><p>She Model Tech Community</p></div>
          </div>
        </body>
      </html>
    `,
    text: `${mentionerName} mentioned you on She Model Tech. View: ${postUrl}`
  };
}

function getNewApplicationToOwnerEmail(body) {
  const { projectOwnerEmail, projectOwnerName, applicantName, applicantEmail, projectTitle, role, skills, message } = body;

  return {
    to: projectOwnerEmail,
    subject: `New Application for "${projectTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #8B5CF6, #7C3AED); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .button { background-color: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>New Application Received!</h1></div>
            <div class="content">
              <h2>Hi ${projectOwnerName || 'there'}!</h2>
              <p>Someone has applied to join your project on She Model Tech.</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #8B5CF6; margin-top: 0;">Application Details</h3>
                <p><strong>Project:</strong> ${projectTitle}</p>
                <p><strong>Applicant:</strong> ${applicantName || 'Not specified'} (${applicantEmail})</p>
                <p><strong>Role:</strong> ${role || 'Not specified'}</p>
                ${skills ? `<p><strong>Skills:</strong> ${skills}</p>` : ''}
                ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
              </div>
              <div style="text-align: center;"><a href="${SITE}/projects/my-projects" class="button">Review Application</a></div>
            </div>
            <div class="footer"><p>She Model Tech - Build Together, Grow Together</p></div>
          </div>
        </body>
      </html>
    `,
    text: `New application for "${projectTitle}" from ${applicantName} (${applicantEmail}). Role: ${role}. Review: ${SITE}/projects/my-projects`
  };
}

// ============================================================
// MAIN HANDLER
// ============================================================

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  // Extract notification type from URL path
  const type = req.query.type;
  console.log(`📧 Notification request: ${type}`);

  // Check environment variables
  const missing = checkEnvVars();
  if (missing.length > 0) {
    console.log('❌ Missing environment variables:', missing);
    return res.status(500).json({ success: false, error: `Missing environment variables: ${missing.join(', ')}` });
  }

  try {
    let emailConfig;

    switch (type) {
      case 'send-application-approved': {
        const { applicationData, projectData } = req.body;
        if (!applicationData || !applicationData.applicantEmail) {
          return res.status(400).json({ success: false, error: 'Application data and applicant email are required' });
        }
        emailConfig = getApplicationApprovedEmail(applicationData, projectData);
        break;
      }

      case 'send-application-rejected': {
        const { applicationData, projectData, rejectionReason } = req.body;
        if (!applicationData || !projectData || !applicationData.applicantEmail) {
          return res.status(400).json({ success: false, error: 'Application data, project data, and applicant email are required' });
        }
        emailConfig = getApplicationRejectedEmail(applicationData, projectData, rejectionReason);
        break;
      }

      case 'send-badge-awarded': {
        const { badgeData, projectData, memberData } = req.body;
        if (!badgeData || !memberData?.memberEmail || !projectData) {
          return res.status(400).json({ success: false, error: 'Badge data, member email, and project data are required' });
        }
        emailConfig = getBadgeAwardedEmail(badgeData, projectData, memberData);
        break;
      }

      case 'send-new-application': {
        const { projectOwnerEmail, applicantEmail, projectTitle } = req.body;
        if (!projectOwnerEmail || !applicantEmail || !projectTitle) {
          return res.status(400).json({ success: false, error: 'Project owner email, applicant email, and project title are required' });
        }
        emailConfig = getNewApplicationEmail(req.body);
        break;
      }

      case 'send-project-review-approved': {
        const { projectOwnerEmail, projectTitle, groupId } = req.body;
        if (!projectOwnerEmail || !projectTitle || !groupId) {
          return res.status(400).json({ success: false, error: 'Project owner email, project title, and group ID are required' });
        }
        emailConfig = getProjectReviewApprovedEmail(req.body);
        break;
      }

      case 'send-project-review-rejected': {
        emailConfig = getProjectReviewRejectedEmail(req.body);
        break;
      }

      case 'send-project-submitted-admin': {
        const { projectData: submittedProject } = req.body;
        if (!submittedProject || !submittedProject.projectTitle) {
          return res.status(400).json({ success: false, error: 'Project data with title is required' });
        }
        emailConfig = getProjectSubmittedAdminEmail(submittedProject);
        break;
      }

      case 'send-project-approved': {
        const { projectData: approvedProject } = req.body;
        if (!approvedProject || (!approvedProject.contactEmail && !approvedProject.submitterEmail)) {
          return res.status(400).json({ success: false, error: 'Project data with contact/submitter email is required' });
        }
        emailConfig = getProjectApprovedEmail(approvedProject);
        break;
      }

      case 'send-mention-email': {
        const { notificationData: mentionNotif, mentionedUser, mentioner, postData: mentionPost } = req.body;
        if (!mentionedUser?.email || !mentioner) {
          return res.status(400).json({ success: false, error: 'Mentioned user email and mentioner data are required' });
        }
        emailConfig = getMentionEmail(mentionNotif, mentionedUser, mentioner, mentionPost);
        break;
      }

      case 'send-new-application-to-owner': {
        const { projectOwnerEmail: ownerEmail, applicantEmail: appEmail, projectTitle: projTitle } = req.body;
        if (!ownerEmail || !appEmail || !projTitle) {
          return res.status(400).json({ success: false, error: 'Project owner email, applicant email, and project title are required' });
        }
        emailConfig = getNewApplicationToOwnerEmail(req.body);
        break;
      }

      default:
        return res.status(404).json({ success: false, error: `Unknown notification type: ${type}` });
    }

    const result = await sendMail({
      to: emailConfig.to,
      cc: emailConfig.cc || [],
      replyTo: emailConfig.replyTo || undefined,
      subject: emailConfig.subject,
      text: emailConfig.text,
      html: emailConfig.html
    });

    console.log(`✅ ${type} email sent:`, result.messageId);

    return res.status(200).json({
      success: true,
      message: `${type} email sent successfully`,
      results: [{ type, recipient: emailConfig.to, messageId: result.messageId }]
    });

  } catch (error) {
    console.error(`❌ Error sending ${type} email:`, error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
