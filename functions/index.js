const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Initialize Nodemailer transporter for certificate emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email?.user,
    pass: functions.config().email?.password
  }
});

// Middleware to verify admin token - adapted to your existing admin system
async function verifyAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const email = decodedToken.email;
    
    // Check if user exists in adminUsers collection (your existing pattern)
    const adminDoc = await db.collection('adminUsers').doc(email).get();
    
    if (!adminDoc.exists) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    req.user = { uid: decodedToken.uid, email: email, isAdmin: true };
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ==================== YOUR EXISTING FUNCTIONS ====================

// Auto-moderate posts trigger
exports.moderatePost = functions.firestore
  .document('posts/{postId}')
  .onCreate(async (snap, context) => {
    const post = snap.data();
    
    // Simple keyword filtering
    const bannedWords = ['spam', 'inappropriate', 'scam'];
    const content = `${post.title} ${post.content}`.toLowerCase();
    
    const hasBannedWords = bannedWords.some(word => content.includes(word));
    
    if (hasBannedWords) {
      await snap.ref.update({
        status: 'rejected',
        moderationNote: 'Automatically rejected: inappropriate content detected',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });

// Admin API for moderating posts
app.post('/moderate-post', verifyAdmin, async (req, res) => {
  try {
    const { postId, status, moderationNote } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.collection('posts').doc(postId).update({
      status,
      moderationNote,
      moderatorId: req.user.uid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, message: `Post ${status} successfully` });
  } catch (error) {
    console.error('Error moderating post:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin API for reviewing applications
app.post('/review-application', verifyAdmin, async (req, res) => {
  try {
    const { applicationId, status, reviewNotes } = req.body;
    
    if (!['under_review', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.collection('applications').doc(applicationId).update({
      status,
      reviewNotes,
      reviewedBy: req.user.uid,
      reviewedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, message: `Application ${status} successfully` });
  } catch (error) {
    console.error('Error reviewing application:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get pending posts for admin dashboard
app.get('/pending-posts', verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('posts')
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .get();

    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(posts);
  } catch (error) {
    console.error('Error fetching pending posts:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get applications for admin dashboard
app.get('/applications', verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('applications')
      .orderBy('submittedAt', 'desc')
      .get();

    const applications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== NEW ENHANCED CERTIFICATE & BADGE FUNCTIONS ====================

// Function to generate PDF certificate
async function generateCertificatePDF(certificateData) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .certificate {
          width: 800px;
          background: white;
          padding: 60px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          border-radius: 20px;
          text-align: center;
          position: relative;
        }
        .header {
          margin-bottom: 40px;
        }
        .logo {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #4CAF50, #45a049);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 36px;
          font-weight: bold;
        }
        .title {
          font-size: 48px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 24px;
          color: #666;
          margin-bottom: 40px;
        }
        .recipient {
          font-size: 36px;
          font-weight: bold;
          color: #4CAF50;
          margin: 30px 0;
          text-decoration: underline;
        }
        .project-title {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          margin: 20px 0;
          font-style: italic;
        }
        .description {
          font-size: 18px;
          color: #666;
          line-height: 1.6;
          margin: 30px 0;
        }
        .footer {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .signature {
          text-align: center;
        }
        .signature-line {
          width: 200px;
          height: 2px;
          background: #333;
          margin: 0 auto 10px;
        }
        .date {
          font-size: 16px;
          color: #666;
        }
        .badge {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
          box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
        }
        .border {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 20px;
          border: 5px solid #4CAF50;
          border-radius: 15px;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="border"></div>
        <div class="badge">🏆</div>
        
        <div class="header">
          <div class="logo">FO</div>
          <h1 class="title">Certificate of Achievement</h1>
          <p class="subtitle">Project ${certificateData.type === 'project_owner' ? 'Ownership' : 'Completion'}</p>
        </div>
        
        <div class="content">
          <p style="font-size: 20px; color: #666;">This certifies that</p>
          <h2 class="recipient">${certificateData.recipientName}</h2>
          <p style="font-size: 20px; color: #666;">has successfully ${certificateData.type === 'project_owner' ? 'led and completed' : 'participated in'} the project</p>
          <h3 class="project-title">"${certificateData.projectTitle}"</h3>
          
          <div class="description">
            ${certificateData.type === 'project_owner' ? 
              `As the Project Owner, ${certificateData.recipientName} demonstrated exceptional leadership, 
               project management skills, and successfully guided a team of ${certificateData.certificateData?.teamSize || 'multiple'} members 
               to project completion.` :
              `This participant contributed significantly to the project's success through their expertise, 
               collaboration, and dedication to achieving the project goals.`
            }
          </div>
        </div>
        
        <div class="footer">
          <div class="signature">
            <div class="signature-line"></div>
            <p><strong>She Model Tech</strong></p>
            <p>Platform Authority</p>
          </div>
          <div class="date">
            <p><strong>Completion Date</strong></p>
            <p>${new Date(certificateData.certificateData?.completionDate || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await page.setContent(html);
  const pdf = await page.pdf({
    format: 'A4',
    landscape: true,
    printBackground: true
  });
  
  await browser.close();
  return pdf;
}

// Function to upload PDF to Firebase Storage and get download URL
async function uploadCertificateToStorage(pdfBuffer, certificateId) {
  const bucket = admin.storage().bucket();
  const fileName = `certificates/${certificateId}.pdf`;
  const file = bucket.file(fileName);
  
  await file.save(pdfBuffer, {
    metadata: {
      contentType: 'application/pdf'
    }
  });
  
  // Make the file publicly accessible
  await file.makePublic();
  
  // Get the public URL
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: '03-09-2491' // Far future date
  });
  
  return url;
}

// Enhanced certificate generation - triggered when certificate document is created
exports.generateAdvancedCertificate = functions.firestore
  .document('certificates/{certificateId}')
  .onCreate(async (snap, context) => {
    const certificateData = snap.data();
    const certificateId = context.params.certificateId;
    
    try {
      console.log('Generating certificate for:', certificateData.recipientEmail);
      
      // Generate PDF
      const pdfBuffer = await generateCertificatePDF(certificateData);
      
      // Upload to Firebase Storage
      const downloadUrl = await uploadCertificateToStorage(pdfBuffer, certificateId);
      
      // Update the certificate document with the download URL
      await snap.ref.update({
        downloadUrl: downloadUrl,
        status: 'generated',
        generatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Send email notification if email config exists
      if (functions.config().email?.user) {
        await sendCertificateEmail(certificateData, downloadUrl);
      }
      
      console.log('Certificate generated successfully:', downloadUrl);
      
    } catch (error) {
      console.error('Error generating certificate:', error);
      
      // Update certificate with error status
      await snap.ref.update({
        status: 'error',
        error: error.message,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });

// Cloud Function triggered when badges are awarded
exports.processBadgeNotifications = functions.firestore
  .document('member_badges/{badgeId}')
  .onCreate(async (snap, context) => {
    const badgeData = snap.data();
    
    try {
      console.log('Processing badge notification for:', badgeData.memberEmail);
      
      // Send badge notification email if email config exists
      if (functions.config().email?.user) {
        await sendBadgeNotificationEmail(badgeData);
      }
      
      console.log('Badge notification sent successfully');
      
    } catch (error) {
      console.error('Error sending badge notification:', error);
    }
  });

// Cloud Function for project completion notifications
exports.notifyProjectCompletion = functions.firestore
  .document('group_completions/{completionId}')
  .onUpdate(async (change, context) => {
    const afterData = change.after.data();
    const beforeData = change.before.data();
    
    // Check if evaluation form was just submitted
    if (!beforeData.evaluationForm?.submittedAt && afterData.evaluationForm?.submittedAt) {
      try {
        console.log('Project completion detected, sending notifications');
        
        // Get group data
        const groupDoc = await db.collection('groups').doc(afterData.groupId).get();
        
        if (!groupDoc.exists) {
          console.error('Group not found:', afterData.groupId);
          return;
        }
        
        const groupData = groupDoc.data();
        
        // Get all group members
        const membersSnapshot = await db.collection('group_members')
          .where('groupId', '==', afterData.groupId)
          .where('status', '==', 'active')
          .get();
        
        // Send notifications to all members if email config exists
        if (functions.config().email?.user) {
          const notifications = membersSnapshot.docs.map(async (memberDoc) => {
            const memberData = memberDoc.data();
            await sendProjectCompletionEmail(memberData, groupData, afterData);
          });
          
          await Promise.all(notifications);
        }
        
        console.log('Project completion notifications sent successfully');
        
      } catch (error) {
        console.error('Error sending project completion notifications:', error);
      }
    }
  });

// Email notification functions
async function sendCertificateEmail(certificateData, downloadUrl) {
  const mailOptions = {
    from: functions.config().email.user,
    to: certificateData.recipientEmail,
    subject: '🎉 Your Project Completion Certificate is Ready!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4CAF50, #45a049); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🏆 Congratulations!</h1>
          <p style="margin: 10px 0 0; font-size: 18px;">Your certificate is ready for download</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Dear ${certificateData.recipientName},</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #666;">
            Congratulations on successfully completing the project <strong>"${certificateData.projectTitle}"</strong>!
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #666;">
            Your ${certificateData.type === 'project_owner' ? 'Project Ownership' : 'Project Completion'} certificate 
            has been generated and is now available for download.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadUrl}" 
               style="background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 5px; font-weight: bold; display: inline-block;">
              📥 Download Certificate
            </a>
          </div>
          
          <p style="font-size: 14px; color: #999; margin-top: 30px;">
            This certificate validates your achievement and can be shared on your professional profiles.
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">© ${new Date().getFullYear()} She Model Tech</p>
        </div>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
}

async function sendBadgeNotificationEmail(badgeData) {
  const badgeCategories = {
    'mentorship': { name: 'TechMO Badges', icon: '🏆' },
    'quality-assurance': { name: 'TechQA Badges', icon: '🔍' },
    'development': { name: 'TechDev Badges', icon: '💻' },
    'leadership': { name: 'TechLeads Badges', icon: '👑' },
    'design': { name: 'TechArchs Badges', icon: '🎨' },
    'security': { name: 'TechGuard Badges', icon: '🛡️' }
  };
  
  const categoryInfo = badgeCategories[badgeData.badgeCategory] || { name: 'TechTalent Badge', icon: '🏆' };
  
  const mailOptions = {
    from: functions.config().email.user,
    to: badgeData.memberEmail,
    subject: `🏆 You've Earned a ${categoryInfo.name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FFD700, #FFA500); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">${categoryInfo.icon} Badge Earned!</h1>
          <p style="margin: 10px 0 0; font-size: 18px;">Congratulations on your achievement</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Dear ${badgeData.memberName},</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #666;">
            Excellent work! You've been awarded a <strong>${categoryInfo.name}</strong> 
            for your ${badgeData.contribution} contribution to the project 
            <strong>"${badgeData.projectTitle}"</strong>.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #4CAF50;">
            <h3 style="margin: 0 0 10px; color: #333;">Badge Details:</h3>
            <p style="margin: 5px 0;"><strong>Category:</strong> ${categoryInfo.name}</p>
            <p style="margin: 5px 0;"><strong>Level:</strong> ${badgeData.badgeLevel?.charAt(0).toUpperCase() + badgeData.badgeLevel?.slice(1)}</p>
            <p style="margin: 5px 0;"><strong>Project:</strong> ${badgeData.projectTitle}</p>
            ${badgeData.skillsDisplayed && badgeData.skillsDisplayed.length > 0 ? 
              `<p style="margin: 5px 0;"><strong>Skills:</strong> ${badgeData.skillsDisplayed.join(', ')}</p>` : ''
            }
          </div>
          
          <p style="font-size: 14px; color: #999; margin-top: 30px;">
            This badge is now part of your professional profile and can be showcased to potential employers.
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">© ${new Date().getFullYear()} She Model Tech</p>
        </div>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
}

async function sendProjectCompletionEmail(memberData, groupData, completionData) {
  const isAdmin = memberData.userEmail === completionData.adminEmail;
  
  const mailOptions = {
    from: functions.config().email.user,
    to: memberData.userEmail,
    subject: `🎉 Project "${groupData.projectTitle}" Has Been Completed!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4CAF50, #45a049); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Project Completed!</h1>
          <p style="margin: 10px 0 0; font-size: 18px;">${groupData.projectTitle}</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Dear ${memberData.userName || memberData.userEmail},</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #666;">
            Great news! The project <strong>"${groupData.projectTitle}"</strong> has been officially completed.
          </p>
          
          ${isAdmin ? `
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2e7d32; margin: 0 0 10px;">🏆 As Project Owner:</h3>
              <p style="margin: 0; color: #1b5e20;">
                Your Project Ownership certificate has been generated and will be available in your dashboard shortly.
              </p>
            </div>
          ` : `
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1976d2; margin: 0 0 10px;">🏆 Your Contribution:</h3>
              <p style="margin: 0; color: #0d47a1;">
                You've been awarded a TechTalent badge for your valuable contribution to this project. 
                Check your profile to see your new achievement!
              </p>
            </div>
          `}
          
          <p style="font-size: 14px; color: #999; margin-top: 30px;">
            Thank you for being part of this successful collaboration. We look forward to seeing you in future projects!
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">© ${new Date().getFullYear()} She Model Tech</p>
        </div>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
}

// Admin API to get completion statistics
app.get('/completion-stats', verifyAdmin, async (req, res) => {
  try {
    const [groupsSnapshot, badgesSnapshot, certificatesSnapshot] = await Promise.all([
      db.collection('groups').where('status', '==', 'completed').get(),
      db.collection('member_badges').get(),
      db.collection('certificates').get()
    ]);

    const stats = {
      completedProjects: groupsSnapshot.size,
      totalBadgesAwarded: badgesSnapshot.size,
      certificatesGenerated: certificatesSnapshot.size,
      badgeBreakdown: {}
    };

    // Calculate badge category breakdown
    badgesSnapshot.docs.forEach(doc => {
      const badge = doc.data();
      const category = badge.badgeCategory;
      if (!stats.badgeBreakdown[category]) {
        stats.badgeBreakdown[category] = 0;
      }
      stats.badgeBreakdown[category]++;
    });

    res.json(stats);
  } catch (error) {
    console.error('Error fetching completion stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Your existing simple certificate generation (keeping for backward compatibility)
exports.generateCertificate = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userName, certificateType } = data;

  try {
    // For now, just create a record - we'll add PDF generation later
    const certificateDoc = await db.collection('certificates').add({
      userId: context.auth.uid,
      userName,
      certificateType,
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'generated'
    });

    return { 
      success: true, 
      certificateId: certificateDoc.id,
      message: 'Certificate record created successfully'
    };
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate certificate');
  }
});

exports.api = functions.https.onRequest(app);

// Configure environment variables with:
// firebase functions:config:set email.user="your-email@gmail.com"
// firebase functions:config:set email.password="your-app-password"
