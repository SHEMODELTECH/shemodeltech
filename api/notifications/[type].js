// api/notifications/[type].js
// Consolidated notification router - handles all notification types in a single serverless function
// This replaces 6 separate files to stay within Vercel Hobby plan's 12 function limit
//
// Members need a confirmed email (lib/confirmedEmail.js), and every type works
// out its recipient on the server from the action it belongs to (see BUILDERS).

const { sendMail } = require('../../lib/mailer');
const admin = require('../../lib/firebaseAdmin');
const { requireUser, throttle } = require('../../lib/requireUser');
const { issueCourseCertificate } = require('../../lib/courseCertificates');
const { guardEmail, getSender, takeQuota, uidForEmail } = require('../../lib/sendGuard');
const { requireConfirmedEmail } = require('../../lib/confirmedEmail');
const { escapeHtml: esc, safeUrl } = require('../../lib/escapeHtml');

// Brand/config - override via Vercel env vars, never hardcode again.
const SITE = process.env.SITE_URL || 'https://shemodeltech.com';
// Our LinkedIn page number (same as src/config/brand.js linkedinOrgId), so
// badges added to LinkedIn show our logo.
const LINKEDIN_ORG_ID = '69187114';
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
  // The project's own page (it opens the team workspace for members).
  const groupUrl = projectData?.projectId
    ? `${SITE}/projects/${encodeURIComponent(projectData.projectId)}`
    : `${SITE}/my-workspaces`;

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
            .header { background: linear-gradient(135deg, #D41470, #7B1FA2); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .button { background-color: #D41470; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .welcome-box { background: #f3e5f5; border: 2px solid #D41470; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .badge-box { background: #FEF3C7; border: 2px solid #D97706; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to the Team!</h1>
            </div>
            <div class="content">
              <h2>Congratulations, ${esc(applicationData.applicantName || 'Team Member')}!</h2>
              <div class="welcome-box">
                <h3 style="color: #D41470; margin: 0;">You're In!</h3>
                <p style="margin: 10px 0; color: #7B1FA2; font-size: 18px;">Your application has been approved!</p>
              </div>
              <p>The project owner has reviewed your application and is excited to have you join their team. This is the beginning of your journey to earning valuable TechTalent Badges!</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #D41470; margin-top: 0;">Project Details:</h3>
                <p><strong>Project:</strong> ${esc(projectTitle)}</p>
                <p><strong>Your Role:</strong> ${esc(applicationData.roleAppliedFor || 'Team Member')}</p>
                <p><strong>Project Owner:</strong> ${esc(projectData?.contactName || applicationData.projectOwner || 'Project Team')}</p>
                <p><strong>Approval Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              <div class="badge-box">
                <h3 style="color: #B45309; margin-top: 0;">Earn TechTalent Badges</h3>
                <p style="color: #666; margin: 10px 0;">As you work on this project, you'll earn <strong>TechTalent Badges</strong> that showcase your skills, achievements, and problem-solving abilities.</p>
              </div>
              <h3 style="color: #D41470;">What's Next?</h3>
              <ul>
                <li>Join your project group and meet your team members</li>
                <li>Review project requirements and timeline</li>
                <li>Start contributing and earning your badges</li>
                <li>Collaborate with your team in the group workspace</li>
                <li>Use our AI-powered Career Navigator for personalized guidance</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${esc(groupUrl)}" class="button">Open your project</a>
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
    text: `Application Approved: Welcome to ${projectTitle}\n\nCongratulations, ${applicationData.applicantName || 'Team Member'}!\nYour application has been approved!\n\nProject: ${projectTitle}\nRole: ${applicationData.roleAppliedFor || 'Team Member'}\nProject Owner: ${projectData?.contactName || applicationData.projectOwner || 'Project Team'}\n\nOpen your project: ${groupUrl}`
  };
}

function getApplicationRejectedEmail(applicationData, projectData, rejectionReason) {
  const projectTitle = projectData?.projectTitle || 'Project';
  const applicantName = applicationData.applicantName || 'Applicant';
  const companyName = projectData?.companyName || projectData?.contactName || 'Team';
  const projectOwnerName = projectData.contactName || 'Project Owner';

  return {
    to: applicationData.applicantEmail,
    replyTo: (projectData.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(projectData.contactEmail))) ? projectData.contactEmail : undefined,
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
            .info-box { background: #FEF3C7; border: 2px solid #D97706; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .info-section { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #FF6B35; }
            .feedback-section { background: #f3e5f5; border: 1px solid #D41470; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Update</h1>
              <p style="margin: 5px 0; font-size: 18px;">Regarding your application to "${esc(projectTitle)}"</p>
            </div>
            <div class="content">
              <h2>Hello ${esc(applicantName)},</h2>
              <div class="info-box">
                <h3 style="color: #B45309; margin: 0 0 10px 0;">Application Status Update</h3>
                <p style="margin: 5px 0; font-size: 16px;">Thank you for your interest in <strong>"${esc(projectTitle)}"</strong>.</p>
                <p style="margin: 10px 0; color: #666;">After careful consideration, we have decided not to move forward with your application at this time.</p>
              </div>
              <div class="info-section">
                <h3 style="color: #FF6B35; margin-top: 0;">Project Details</h3>
                <p><strong>Project:</strong> ${esc(projectTitle)}</p>
                <p><strong>Company/Team:</strong> ${esc(companyName)}</p>
                <p><strong>Decision Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              ${rejectionReason && String(rejectionReason).trim() ? `
              <div class="feedback-section">
                <h3 style="color: #7b1fa2; margin-top: 0;">Feedback from ${esc(projectOwnerName)}</h3>
                <p style="color: #333; line-height: 1.6; white-space: pre-line; font-style: italic;">"${esc(rejectionReason)}"</p>
              </div>` : ''}
              <div style="background: #e8f5e9; border: 1px solid #4CAF50; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <h3 style="color: #2E7D32; margin-top: 0;">Keep Moving Forward!</h3>
                <p style="color: #2E7D32;">This decision doesn't reflect on your skills or potential. Continue building your skills with other projects!</p>
              </div>
              <div style="text-align: center;"><a href="${SITE}/projects" class="button">Explore More Projects</a></div>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">Best regards,<br/><strong>${esc(projectOwnerName)}</strong><br/>${esc(companyName)}</p>
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
  // Her own profile, where the Badges section lists every badge she's earned.
  const badgesUrl = memberData?.memberEmail
    ? `${SITE}/profile/${encodeURIComponent(String(memberData.memberEmail).toLowerCase())}`
    : `${SITE}/dashboard`;
  const badgeCategories = {
    'mentorship': { name: 'TechMO Badge', color: '#F59E0B', emoji: '🎓', image: '/Images/TechMO.png', description: 'Mentorship & Leadership Excellence' },
    'quality-assurance': { name: 'TechQA Badge', color: '#D41470', emoji: '🔍', image: '/Images/TechQA.png', description: 'Quality Assurance & Testing Mastery' },
    'development': { name: 'TechDev Badge', color: '#10B981', emoji: '💻', image: '/Images/TechDev.png', description: 'Development & Programming Skills' },
    'leadership': { name: 'TechLeads Badge', color: '#D41470', emoji: '👑', image: '/Images/TechLeads.png', description: 'Technical Leadership & Project Management' },
    'design': { name: 'TechArchs Badge', color: '#D97706', emoji: '🎨', image: '/Images/TechArchs.png', description: 'Architecture & Design Excellence' },
    'security': { name: 'TechGuard Badge', color: '#EF4444', emoji: '🛡️', image: '/Images/TechGuard.png', description: 'Security & Protection Expertise' }
  };

  const badgeInfo = badgeCategories[badgeData.badgeCategory] || { name: 'TechTalent Badge', color: '#737373', emoji: '🏆', image: '/Images/512X512.png', description: 'Technical Excellence Recognition' };
  const badgeLevel = String(badgeData.badgeLevel || 'novice').charAt(0).toUpperCase() + String(badgeData.badgeLevel || 'novice').slice(1);
  const contribution = String(badgeData.contribution || 'good');
  const skills = Array.isArray(badgeData.skillsDisplayed) ? badgeData.skillsDisplayed : [];
  // "Add to LinkedIn": opens LinkedIn's Add license or certification form, filled in.
  const now = new Date();
  const linkedInUrl = `https://www.linkedin.com/profile/add?${new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: `${badgeInfo.name.replace(/ Badge$/, '')} ${badgeLevel} badge, She Model Tech`,
    organizationId: LINKEDIN_ORG_ID,
    issueYear: String(now.getFullYear()),
    issueMonth: String(now.getMonth() + 1),
    certUrl: `${SITE}/badges`,
  }).toString()}`;

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
            .header { background: linear-gradient(135deg, ${badgeInfo.color}, #262626); color: white; padding: 30px; text-align: center; }
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
              <h2>Congratulations, ${esc(memberData.memberName || 'Team Member')}!</h2>
              <div class="badge-showcase">
                <img src="${SITE}${badgeInfo.image}" alt="${badgeInfo.name}" style="width: 80px; height: 80px; margin: 0 auto 15px auto; display: block; border-radius: 8px;" onerror="this.style.display='none';" />
                <h3 style="color: ${badgeInfo.color}; margin: 0 0 5px 0; font-size: 24px;">${badgeInfo.name}</h3>
                <p style="margin: 0 0 5px 0; color: #737373; font-size: 14px; font-style: italic;">${badgeInfo.description}</p>
                <p style="margin: 5px 0; color: #525252; font-size: 18px; font-weight: bold;">${esc(badgeLevel)} Level</p>
                <p style="margin: 10px 0; color: #737373; font-size: 14px;">Awarded for exceptional contribution to "${esc(projectData.projectTitle)}"</p>
              </div>
              <p>Your project owner <strong>${esc(projectData.contactName || 'Project Team')}</strong> has recognized your outstanding contribution!</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #E5E5E5;">
                <h3 style="color: ${badgeInfo.color}; margin: 0 0 15px 0;">Badge Details</h3>
                <p><strong>Project:</strong> ${esc(projectData.projectTitle)}</p>
                <p><strong>Your Role:</strong> ${esc(memberData.memberRole || 'Team Member')}</p>
                <p><strong>Award Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Contribution Quality:</strong> ${esc(contribution.charAt(0).toUpperCase() + contribution.slice(1))}</p>
              </div>
              ${skills.length > 0 ? `
                <div style="background: #F5F5F5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h4 style="color: #404040; margin-top: 0;">Skills Demonstrated:</h4>
                  <div>${skills.map(skill => `<span class="skill-tag">${esc(skill)}</span>`).join('')}</div>
                </div>` : ''}
              ${badgeData.adminNotes ? `
                <div style="background: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h4 style="color: #92400E; margin-top: 0;">Recognition Notes:</h4>
                  <p style="color: #92400E; margin: 0; font-style: italic;">"${esc(badgeData.adminNotes)}"</p>
                </div>` : ''}
              <div style="text-align: center; margin: 30px 0;">
                <a href="${esc(badgesUrl)}" class="button">View Your Badge Collection</a>
                <p style="margin: 6px 0 0 0;"><a href="${esc(linkedInUrl)}" style="color: #0A66C2; font-weight: bold; text-decoration: none;">Add it to LinkedIn</a></p>
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
    text: `Congratulations! You've Earned a ${badgeInfo.name}\n\nDear ${memberData.memberName || 'Team Member'},\nBadge: ${badgeInfo.name} (${badgeLevel})\nProject: ${projectData.projectTitle}\nRole: ${memberData.memberRole || 'Team Member'}\n\nView your badges: ${badgesUrl}\nAdd it to LinkedIn: ${linkedInUrl}`
  };
}

function getMentionEmail(notificationData, mentionedUser, mentioner, postData) {
  const mentionerName = mentioner.displayName || mentioner.firstName || mentioner.email || 'Someone';
  const mentionedName = mentionedUser.displayName || mentionedUser.firstName || 'there';
  const postUrl = `${SITE}/post/${encodeURIComponent(notificationData?.postId || '')}`;
  const postContent = typeof postData?.content === 'string' ? postData.content : '';

  return {
    to: mentionedUser.email,
    subject: `${mentionerName} mentioned you on She Model Tech`,
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8">
          <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #D41470, #D41470); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .button { background-color: #D41470; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>You Were Mentioned!</h1></div>
            <div class="content">
              <h2>Hey ${esc(mentionedName)}!</h2>
              <p><strong>${esc(mentionerName)}</strong> mentioned you in a ${notificationData?.type === 'reply_mention' ? 'reply' : 'post'} on She Model Tech.</p>
              ${postContent ? `<div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #D41470; margin: 20px 0; color: #404040;">${esc(postContent.substring(0, 200))}${postContent.length > 200 ? '...' : ''}</div>` : ''}
              <div style="text-align: center;"><a href="${esc(postUrl)}" class="button">View Post</a></div>
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
            .header { background: linear-gradient(135deg, #D41470, #D41470); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
            .button { background-color: #D41470; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>New Application Received!</h1></div>
            <div class="content">
              <h2>Hi ${esc(projectOwnerName || 'there')}!</h2>
              <p>Someone has applied to join your project on She Model Tech.</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #D41470; margin-top: 0;">Application Details</h3>
                <p><strong>Project:</strong> ${esc(projectTitle)}</p>
                <p><strong>Applicant:</strong> ${esc(applicantName || 'Not specified')} (${esc(applicantEmail)})</p>
                <p><strong>Role:</strong> ${esc(role || 'Not specified')}</p>
                ${skills ? `<p><strong>Skills:</strong> ${esc(skills)}</p>` : ''}
                ${message ? `<p><strong>Message:</strong> ${esc(message)}</p>` : ''}
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
// WHO MAY SEND WHAT
// ============================================================
// Types nothing in the app calls any more. They used to send a She Model
// Tech-branded email to any address with the caller's own text and reply-to,
// so they are switched off (410 Gone). The dynamic route stays.
const GONE_TYPES = new Set([
  'send-new-application',
  'send-project-review-approved',
  'send-project-review-rejected',
  'send-project-submitted-admin',
  'send-project-approved',
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (v, max) => String(v == null ? '' : v).slice(0, max);
const millis = (t) => (t && typeof t.toMillis === 'function' ? t.toMillis() : 0);

class Refusal extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const refuse = (status, message) => {
  throw new Refusal(status, message);
};

const fs = () => admin.firestore();

// The sign-in email of an account (falls back to the profile's email).
async function emailForUid(uid) {
  if (!uid || typeof uid !== 'string') return null;
  try {
    const u = await admin.auth().getUser(uid);
    if (u && u.email) return u.email;
  } catch (_) {
    /* not a sign-in account: try the profile */
  }
  const s = await fs().collection('users').doc(uid).get();
  const e = s.exists ? s.data().email : null;
  return e && EMAIL_RE.test(String(e)) ? String(e) : null;
}

async function docData(col, id) {
  if (!id || typeof id !== 'string' || id.includes('/')) return null;
  const s = await fs().collection(col).doc(id).get();
  return s.exists ? s.data() : null;
}

// send-application-approved / send-application-rejected
// The project's lead (or staff) tells an applicant about a decision already
// saved on the application. Recipient and project details come from the
// database, never from the request.
async function buildApplicationDecision(type, body, user, sender) {
  const appId = clip(body.applicationId || (body.applicationData && body.applicationData.id), 200);
  if (!appId) refuse(400, 'applicationId is required');
  const app = await docData('project_applications', appId);
  if (!app) refuse(404, 'Application not found');
  const project = await docData('projects', app.projectId);
  if (!project) refuse(404, 'Project not found');
  if (!sender.staff) {
    if (project.submitterId !== user.uid) refuse(403, 'Only the project lead can send this.');
    const want = type === 'send-application-approved' ? 'approved' : 'rejected';
    if (app.status !== want) refuse(409, `This application is not ${want}.`);
  }
  const to = await emailForUid(app.applicantUid || app.applicantId);
  if (!to) refuse(400, 'The applicant has no email address.');
  const projectTitle = clip(project.projectTitle || project.title || app.projectTitle || 'Project', 200);
  const leadName = clip(project.contactName || (sender.data && sender.data.displayName) || user.name || 'Project Lead', 120);
  if (type === 'send-application-approved') {
    return getApplicationApprovedEmail(
      { applicantEmail: to, applicantName: clip(app.applicantName, 120), roleAppliedFor: clip(app.role, 120), projectOwner: leadName },
      { projectTitle, contactName: leadName, projectId: app.projectId }
    );
  }
  return getApplicationRejectedEmail(
    { applicantEmail: to, applicantName: clip(app.applicantName, 120) },
    {
      projectTitle,
      contactName: leadName,
      companyName: clip(project.companyName, 120) || undefined,
      // Replies go to the sender's own sign-in address.
      contactEmail: user.email || undefined,
    },
    clip(body.rejectionReason, 1000)
  );
}

// send-badge-awarded: the project's lead (or staff) tells a team member.
async function buildBadgeAwarded(type, body, user, sender) {
  const { badgeData, projectData, memberData } = body;
  if (!badgeData || !memberData || !memberData.memberEmail || !projectData || !projectData.projectId) {
    refuse(400, 'Badge data, member email, and project id are required');
  }
  const project = await docData('projects', clip(projectData.projectId, 200));
  if (!project) refuse(404, 'Project not found');
  const memberUid = await uidForEmail(memberData.memberEmail);
  if (!memberUid) refuse(403, 'Emails can only go to She Model Tech members.');
  if (!sender.staff) {
    if (project.submitterId !== user.uid) refuse(403, 'Only the project lead can send this.');
    const email = String(memberData.memberEmail).trim().toLowerCase();
    const members = (Array.isArray(project.members) ? project.members : []).map((m) => String(m));
    const onTeam = memberUid === project.submitterId
      || members.includes(memberUid)
      || members.some((m) => m.toLowerCase() === email);
    if (!onTeam) refuse(403, 'That person is not on this project.');
  }
  const to = await emailForUid(memberUid);
  if (!to) refuse(400, 'The member has no email address.');
  return getBadgeAwardedEmail(
    {
      badgeCategory: clip(badgeData.badgeCategory, 40),
      badgeLevel: clip(badgeData.badgeLevel, 40),
      contribution: clip(badgeData.contribution, 40),
      skillsDisplayed: Array.isArray(badgeData.skillsDisplayed) ? badgeData.skillsDisplayed.slice(0, 20).map((s) => clip(s, 60)) : [],
      adminNotes: clip(badgeData.adminNotes, 1000),
    },
    { projectTitle: clip(project.projectTitle || project.title || 'Project', 200), contactName: clip(project.contactName, 120) || undefined },
    { memberEmail: to, memberName: clip(memberData.memberName, 120), memberRole: clip(memberData.memberRole, 120) }
  );
}

// send-new-application-to-owner: an applicant tells the project's lead. She
// must have applied to that project; the lead's address comes from the lead's
// account, and the details from her saved application.
async function buildNewApplicationToOwner(type, body, user, sender) {
  const projectId = clip(body.projectId, 200);
  if (!projectId) refuse(400, 'projectId is required');
  const project = await docData('projects', projectId);
  if (!project) refuse(404, 'Project not found');
  const q = await fs().collection('project_applications')
    .where('projectId', '==', projectId)
    .where('applicantUid', '==', user.uid)
    .limit(1)
    .get();
  const app = q.empty ? null : q.docs[0].data();
  if (!app && !sender.staff) refuse(403, 'Apply to this project first.');
  if (!sender.staff && !(await throttle(`newapp_${user.uid}_${projectId}`, 300))) {
    refuse(429, 'The lead was just told about your application.');
  }
  const to = (await emailForUid(project.submitterId))
    || (EMAIL_RE.test(String(project.submitterEmail || '')) ? String(project.submitterEmail) : null);
  if (!to) refuse(400, 'This project has no lead to tell yet.');
  const src = app || body;
  return getNewApplicationToOwnerEmail({
    projectOwnerEmail: to,
    projectOwnerName: clip(project.contactName || project.submitterName, 120),
    applicantName: clip((sender.data && sender.data.displayName) || user.name || user.email, 120),
    applicantEmail: clip(user.email, 200),
    projectTitle: clip(project.projectTitle || project.title || 'Project', 200),
    role: clip(src.role, 120),
    skills: clip(src.skills, 1000),
    message: clip(src.message, 2000),
  });
}

// send-mention-email: someone tagged in a Community reply. The sender must have
// written a reply on that post that tags this member; each reply emails each
// tagged member once.
async function buildMention(type, body, user, sender) {
  const { notificationData, mentionedUser } = body;
  const postId = clip(notificationData && notificationData.postId, 200);
  if (!mentionedUser || !mentionedUser.email || !postId || postId.includes('/')) {
    refuse(400, 'Mentioned user email and post id are required');
  }
  const recipientUid = await uidForEmail(mentionedUser.email);
  if (!recipientUid) refuse(403, 'Emails can only go to She Model Tech members.');
  if (recipientUid === user.uid) refuse(400, 'You mentioned yourself.');
  let content = '';
  if (!sender.staff) {
    const mine = await fs().collection('posts').doc(postId).collection('replies')
      .where('authorId', '==', user.uid)
      .limit(200)
      .get();
    const tagging = mine.docs
      .filter((d) => Array.isArray(d.data().taggedUserIds) && d.data().taggedUserIds.includes(recipientUid))
      .sort((a, b) => millis(b.data().createdAt) - millis(a.data().createdAt));
    if (!tagging.length) refuse(403, 'You can only email people you mentioned.');
    const reply = tagging[0];
    if (!(await throttle(`mention_${postId}_${reply.id}_${recipientUid}`, 7 * 24 * 3600))) {
      refuse(429, 'This member was already emailed about this reply.');
    }
    content = String(reply.data().content || '');
  } else {
    content = body.postData && typeof body.postData.content === 'string' ? body.postData.content : '';
  }
  const to = await emailForUid(recipientUid);
  if (!to) refuse(400, 'The member has no email address.');
  const r = await docData('users', recipientUid);
  return getMentionEmail(
    { type: 'reply_mention', postId },
    { email: to, displayName: clip((r && (r.displayName || r.firstName)) || '', 120) },
    { displayName: clip((sender.data && sender.data.displayName) || user.name || 'A member', 120) },
    { content: clip(content, 2000) }
  );
}

const BUILDERS = {
  'send-application-approved': buildApplicationDecision,
  'send-application-rejected': buildApplicationDecision,
  'send-badge-awarded': buildBadgeAwarded,
  'send-new-application-to-owner': buildNewApplicationToOwner,
  'send-mention-email': buildMention,
};

// ============================================================
// MAIN HANDLER
// ============================================================

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  // Extract notification type from URL path
  const type = req.query.type;
  if (GONE_TYPES.has(type)) {
    return res.status(410).json({ success: false, error: `${type} is no longer available.` });
  }

  // Only signed-in members can trigger emails (stops this being used to send
  // spam through our email account).
  const user = await requireUser(req, res);
  if (!user) return;

  console.log(`📧 Notification request: ${type}`);

  // Course certificates are issued here too (Vercel Hobby allows 12 functions).
  if (type === 'issue-certificate') {
    try {
      return await issueCourseCertificate(req, res, user);
    } catch (e) {
      console.error('issue-certificate failed:', e);
      return res.status(500).json({ error: 'Could not issue the certificate. Please try again.' });
    }
  }

  if (type !== 'send-generic' && !BUILDERS[type]) {
    return res.status(404).json({ success: false, error: `Unknown notification type: ${type}` });
  }

  // Check environment variables
  const missing = checkEnvVars();
  if (missing.length > 0) {
    console.log('❌ Missing environment variables:', missing);
    return res.status(500).json({ success: false, error: `Missing environment variables: ${missing.join(', ')}` });
  }

  try {
    let emailConfig;
    const reqBody = req.body && typeof req.body === 'object' ? req.body : {};

    if (type === 'send-generic') {
      // Generic: mirrors an in-app notification to email. Used by cohort
      // decisions (assigned / interview / offered a role / not selected) so a
      // member is not left refreshing a page waiting for news.
      if (!reqBody.to || !reqBody.subject || !reqBody.body) {
        return res.status(400).json({ success: false, error: 'to, subject and body are required' });
      }
      // Staff can email anyone; members only email members (companies only
      // people they're talking to), plain text, with a daily cap, and need a
      // confirmed email unless they're writing to staff.
      const g = await guardEmail(user, reqBody);
      if (!g.ok) return res.status(g.status || 403).json({ success: false, error: g.error });
      // heading and body are HTML on purpose: callers send them already
      // escaped (staff letters use <br/> and <strong>), and guardEmail strips
      // tags and escapes stray < > for members. ctaLabel is plain text and
      // ctaUrl must be an http(s) link.
      const { to, subject, heading, body, ctaLabel, ctaUrl } = g.email;
      const genericCta = ctaUrl ? safeUrl(ctaUrl) : '';
      emailConfig = {
        to,
        subject,
        text: `${heading || subject}\n\n${body}\n\n${ctaUrl ? `${ctaLabel || 'Open'}: ${ctaUrl}` : ''}`,
        html: `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#353331">
  <h1 style="font-size:20px;margin:0 0 16px">${heading || esc(subject)}</h1>
  <p style="font-size:15px;line-height:1.6;color:#444">${body}</p>
  ${genericCta ? `<p style="margin:24px 0"><a href="${esc(genericCta)}" style="background:#D41470;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700;display:inline-block">${esc(ctaLabel || 'Open She Model Tech')}</a></p>` : ''}
  <hr style="border:none;border-top:1px solid #eee;margin:28px 0"/>
  <p style="color:#A3A3A3;font-size:12px">${BRAND_NAME} &middot; <a href="${SITE}" style="color:#A3A3A3">shemodeltech.com</a><br/>
  Questions? <a href="mailto:${SUPPORT_EMAIL}" style="color:#A3A3A3">${SUPPORT_EMAIL}</a></p>
</div>`,
      };
    } else {
      // Every other type: a confirmed email (same as isVerified() in
      // firestore.rules), a recipient the server ties to the action, and the
      // daily email cap for members.
      const sender = await getSender(user.uid);
      if (!(await requireConfirmedEmail(user, res, sender.data))) return undefined;
      emailConfig = await BUILDERS[type](type, reqBody, user, sender);
      if (!sender.staff && !(await takeQuota(user.uid, 'email', 1))) refuse(429, 'Daily email limit reached.');
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
    if (error instanceof Refusal) {
      return res.status(error.status).json({ success: false, error: error.message });
    }
    console.error(`❌ Error sending ${type} email:`, error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
