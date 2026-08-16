// firebase/autoSetup.js
import { db } from './config';
import { 
  collection, 
  doc, 
  setDoc, 
  serverTimestamp,
  writeBatch 
} from 'firebase/firestore';

/**
 * Complete Firebase Database Auto-Setup
 * Creates all 17 collections with initial documents
 */

const autoSetupFirebase = async () => {
  console.log('🚀 Starting Firebase Database Auto-Setup...\n');
  
  const batch = writeBatch(db);
  const timestamp = serverTimestamp();
  const setupResults = [];

  try {
    // ============================================
    // 1. CLIENT_PROJECTS
    // ============================================
    console.log('📁 1/17 Setting up client_projects...');
    const sampleProject = {
      projectTitle: "Sample E-Commerce Platform",
      projectDescription: "Build a full-stack e-commerce platform with React and Node.js",
      projectType: "Web Development",
      timeline: "8 weeks",
      requiredSkills: "React, Node.js, MongoDB, Express",
      projectGoals: "Create a scalable online shopping platform",
      experienceLevel: "Intermediate",
      budget: "$0 - Educational Project",
      maxTeamSize: 6,
      contactEmail: "sample@example.com",
      contactName: "Sample Contact",
      status: "approved",
      workflowStage: "active",
      isActive: true,
      availableForApplications: true,
      submitterId: "system",
      submitterEmail: "shemodeltech@gmail.com",
      submitterName: "System",
      createdAt: timestamp,
      updatedAt: timestamp,
      submissionDate: timestamp,
      viewCount: 0,
      applicationCount: 0,
      contentAnalysis: {
        completenessScore: 100,
        hasCompanyInfo: true,
        hasSpecificDates: false
      }
    };
    batch.set(doc(db, 'client_projects', 'sample_project_1'), sampleProject);
    setupResults.push({ collection: 'client_projects', status: 'success' });

    // ============================================
    // 2. PROJECT_APPLICATIONS
    // ============================================
    console.log('📁 2/17 Setting up project_applications...');
    const sampleApplication = {
      projectId: "sample_project_1",
      projectTitle: "Sample E-Commerce Platform",
      applicantId: "sample_user_1",
      applicantName: "John Doe",
      applicantEmail: "john@example.com",
      experience: "2 years in web development",
      motivation: "Want to gain experience in e-commerce",
      skills: "React, Node.js, JavaScript",
      status: "pending",
      submittedAt: timestamp,
      createdAt: timestamp
    };
    batch.set(doc(db, 'project_applications', 'sample_app_1'), sampleApplication);
    setupResults.push({ collection: 'project_applications', status: 'success' });

    // ============================================
    // 3. APPLICATIONS (Community Membership)
    // ============================================
    console.log('📁 3/17 Setting up applications...');
    const sampleMemberApp = {
      userId: "sample_user_1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1234567890",
      status: "approved",
      applicationData: {
        experience: "2 years",
        motivation: "Want to learn and collaborate",
        skills: "JavaScript, React, Node.js",
        availability: "10 hours per week"
      },
      submittedAt: timestamp,
      approvedAt: timestamp
    };
    batch.set(doc(db, 'applications', 'sample_member_app_1'), sampleMemberApp);
    setupResults.push({ collection: 'applications', status: 'success' });

    // ============================================
    // 4. GROUPS
    // ============================================
    console.log('📁 4/17 Setting up groups...');
    const sampleGroup = {
      projectTitle: "Sample E-Commerce Platform",
      description: "Building an e-commerce platform together",
      projectDescription: "Full-stack e-commerce project",
      projectType: "Web Development",
      adminEmail: "admin@example.com",
      adminName: "Admin User",
      adminId: "admin_user_1",
      memberCount: 1,
      status: "active",
      originalProjectId: "sample_project_1",
      createdAt: timestamp,
      updatedAt: timestamp,
      lastActivity: timestamp,
      completionStatus: {
        isReadyForCompletion: false,
        submittedForReview: false,
        completedAt: null,
        certificatesGenerated: false,
        isSoloProject: false
      }
    };
    batch.set(doc(db, 'groups', 'sample_group_1'), sampleGroup);
    setupResults.push({ collection: 'groups', status: 'success' });

    // ============================================
    // 5. GROUP_MEMBERS
    // ============================================
    console.log('📁 5/17 Setting up group_members...');
    const sampleMember = {
      groupId: "sample_group_1",
      userId: "admin_user_1",
      userEmail: "admin@example.com",
      userName: "Admin User",
      photoURL: null,
      role: "admin",
      projectRole: "Project Manager",
      status: "active",
      joinedAt: timestamp,
      createdAt: timestamp,
      addedBy: "system"
    };
    batch.set(doc(db, 'group_members', 'sample_member_1'), sampleMember);
    setupResults.push({ collection: 'group_members', status: 'success' });

    // ============================================
    // 6. GROUP_POSTS
    // ============================================
    console.log('📁 6/17 Setting up group_posts...');
    const samplePost = {
      groupId: "sample_group_1",
      authorId: "admin_user_1",
      authorName: "Admin User",
      authorEmail: "admin@example.com",
      authorPhoto: null,
      title: "Welcome to the Project!",
      content: "Let's build something amazing together. Looking forward to collaborating with everyone!",
      type: "announcement",
      groupTitle: "Sample E-Commerce Platform",
      createdAt: timestamp,
      updatedAt: timestamp,
      replyCount: 0,
      isPinned: true,
      isEdited: false,
      likes: [],
      likeCount: 0,
      replies: []
    };
    batch.set(doc(db, 'group_posts', 'sample_post_1'), samplePost);
    setupResults.push({ collection: 'group_posts', status: 'success' });

    // ============================================
    // 7. POST_REPLIES
    // ============================================
    console.log('📁 7/17 Setting up post_replies...');
    const sampleReply = {
      postId: "sample_post_1",
      groupId: "sample_group_1",
      authorId: "sample_user_1",
      authorName: "John Doe",
      authorEmail: "john@example.com",
      authorPhoto: null,
      content: "Excited to be part of this project!",
      createdAt: timestamp,
      updatedAt: timestamp,
      isEdited: false
    };
    batch.set(doc(db, 'post_replies', 'sample_reply_1'), sampleReply);
    setupResults.push({ collection: 'post_replies', status: 'success' });

    // ============================================
    // 8. PROJECT_COMPLETION_REQUESTS
    // ============================================
    console.log('📁 8/17 Setting up project_completion_requests...');
    const sampleCompletion = {
      groupId: "sample_group_1",
      adminEmail: "admin@example.com",
      adminName: "Admin User",
      adminId: "admin_user_1",
      projectTitle: "Sample E-Commerce Platform",
      originalProjectId: "sample_project_1",
      status: "draft",
      phase: "project_review",
      createdAt: timestamp,
      teamSize: 1,
      teamMembers: [{
        memberName: "Admin User",
        memberEmail: "admin@example.com",
        role: "admin",
        joinedAt: new Date()
      }],
      projectReview: {
        projectUrl: "",
        repositoryUrl: "",
        projectSummary: "",
        keyFeatures: "",
        technologiesUsed: "",
        projectStatus: "in_progress"
      },
      evaluationForm: {
        memberEvaluations: []
      },
      adminApproval: {
        approved: false
      },
      finalCompletion: {
        completed: false,
        certificatesGenerated: false,
        badgesAwarded: false,
        isSoloProject: false
      }
    };
    batch.set(doc(db, 'project_completion_requests', 'sample_completion_1'), sampleCompletion);
    setupResults.push({ collection: 'project_completion_requests', status: 'success' });

    // ============================================
    // 9. MEMBER_BADGES
    // ============================================
    console.log('📁 9/17 Setting up member_badges...');
    const sampleBadge = {
      memberEmail: "john@example.com",
      memberName: "John Doe",
      badgeCategory: "development",
      badgeLevel: "Novice",
      projectTitle: "Sample E-Commerce Platform",
      groupId: "sample_group_1",
      awardedAt: timestamp,
      awardedBy: "system",
      awardedByName: "System",
      contribution: "Contributed to frontend development",
      skillsDisplayed: ["React", "JavaScript", "HTML/CSS"],
      adminNotes: "Great first project contribution",
      teamSize: 1
    };
    batch.set(doc(db, 'member_badges', 'sample_badge_1'), sampleBadge);
    setupResults.push({ collection: 'member_badges', status: 'success' });

    // ============================================
    // 10. CERTIFICATES
    // ============================================
    console.log('📁 10/17 Setting up certificates...');
    const sampleCertificate = {
      type: "project_completion",
      recipientEmail: "john@example.com",
      recipientName: "John Doe",
      recipientId: "sample_user_1",
      projectTitle: "Sample E-Commerce Platform",
      groupId: "sample_group_1",
      generatedAt: timestamp,
      certificateData: {
        projectDescription: "Built a full-stack e-commerce platform",
        completionDate: new Date().toISOString(),
        teamSize: 1,
        badgesAwarded: 1,
        projectType: "Web Development",
        isSoloProject: false
      }
    };
    batch.set(doc(db, 'certificates', 'sample_cert_1'), sampleCertificate);
    setupResults.push({ collection: 'certificates', status: 'success' });

    // ============================================
    // 11. NOTIFICATIONS
    // ============================================
    console.log('📁 11/17 Setting up notifications...');
    const sampleNotification = {
      recipientEmail: "john@example.com",
      recipientName: "John Doe",
      recipientId: "sample_user_1",
      recipientType: "member",
      type: "badge_awarded",
      title: "New Badge Earned!",
      message: "Congratulations! You've earned the TechDev - Novice badge for your work on Sample E-Commerce Platform.",
      badgeCategory: "development",
      badgeLevel: "Novice",
      projectTitle: "Sample E-Commerce Platform",
      createdAt: timestamp,
      read: false,
      priority: "normal"
    };
    batch.set(doc(db, 'notifications', 'sample_notif_1'), sampleNotification);
    setupResults.push({ collection: 'notifications', status: 'success' });

    // ============================================
    // 12. USERS
    // ============================================
    console.log('📁 12/17 Setting up users...');
    const systemUser = {
      uid: "system",
      email: "shemodeltech@gmail.com",
      displayName: "System",
      firstName: "System",
      lastName: "User",
      photoURL: null,
      createdAt: timestamp,
      lastLogin: timestamp,
      followers: [],
      following: [],
      followerCount: 0,
      followingCount: 0,
      emailPreferences: {
        receiveFollowerNotifications: true,
        receiveBadgeNotifications: true,
        receiveProjectInvites: true,
        marketingEmails: false
      },
      profile: {
        title: "System Account",
        company: "She Model Tech",
        bio: "System account for automated operations"
      }
    };
    batch.set(doc(db, 'users', 'system'), systemUser);

    const sampleUser = {
      uid: "sample_user_1",
      email: "john@example.com",
      displayName: "John Doe",
      firstName: "John",
      lastName: "Doe",
      photoURL: null,
      createdAt: timestamp,
      lastLogin: timestamp,
      followers: [],
      following: [],
      followerCount: 0,
      followingCount: 0,
      emailPreferences: {
        receiveFollowerNotifications: true,
        receiveBadgeNotifications: true,
        receiveProjectInvites: true,
        marketingEmails: true
      },
      profile: {
        title: "Full Stack Developer",
        company: "Tech Startup",
        bio: "Passionate about building great web applications"
      }
    };
    batch.set(doc(db, 'users', 'sample_user_1'), sampleUser);
    setupResults.push({ collection: 'users', status: 'success' });

    // ============================================
    // 13. TECH_EVENTS
    // ============================================
    console.log('📁 13/17 Setting up tech_events...');
    const sampleEvent = {
      eventTitle: "Web Development Workshop",
      eventDescription: "Learn modern web development best practices",
      eventType: "workshop",
      eventDate: timestamp,
      duration: "2 hours",
      meetingUrl: "https://meet.example.com/workshop",
      organizerName: "Tech Team",
      status: "approved",
      selectedProjectIds: ["sample_project_1"],
      associatedProjects: [{
        projectTitle: "Sample E-Commerce Platform",
        id: "sample_project_1"
      }],
      createdAt: timestamp,
      updatedAt: timestamp
    };
    batch.set(doc(db, 'tech_events', 'sample_event_1'), sampleEvent);
    setupResults.push({ collection: 'tech_events', status: 'success' });

    // ============================================
    // 14. CAREER_ANALYSES
    // ============================================
    console.log('📁 14/17 Setting up career_analyses...');
    const sampleAnalysis = {
      userId: "sample_user_1",
      userEmail: "john@example.com",
      userName: "John Doe",
      educationLevel: "Bachelor's Degree",
      studyField: "Computer Science",
      yearsExperience: "2",
      currentRole: "Junior Developer",
      techInterests: "Full Stack Development, Cloud Computing",
      experienceLevel: "intermediate",
      timeCommitment: "10-15 hours per week",
      targetSalary: "$80,000 - $100,000",
      transitionTimeline: "6-12 months",
      futureGoal: "Senior Full Stack Developer",
      analysis: "Based on your background in Computer Science and 2 years of experience...",
      createdAt: timestamp,
      updatedAt: timestamp,
      lastAccessed: timestamp
    };
    batch.set(doc(db, 'career_analyses', 'sample_analysis_1'), sampleAnalysis);
    setupResults.push({ collection: 'career_analyses', status: 'success' });

    // ============================================
    // 15. AI_CAREER_CONTENT
    // ============================================
    console.log('📁 15/17 Setting up ai_career_content...');
    const sampleCareerContent = {
      userId: "sample_user_1",
      userEmail: "john@example.com",
      careerRecommendations: [{
        title: "Full Stack Developer",
        match: 92,
        description: "Build end-to-end web applications",
        whyGoodFit: "Your CS background and 2 years experience align perfectly",
        keySkills: ["React", "Node.js", "MongoDB", "AWS"],
        salaryRange: "$80,000 - $120,000",
        demandLevel: "High",
        entryPath: "Continue building projects and contribute to open source"
      }],
      personalizedRoadmap: {
        careerTitle: "Full Stack Developer",
        matchScore: 92,
        totalDuration: "6 months",
        weeklyCommitment: "10-15 hours",
        phases: [{
          title: "Advanced Frontend",
          timeline: "2 months",
          description: "Master React and modern frontend tools",
          milestones: ["Build 3 React projects", "Learn TypeScript", "Master state management"],
          skills: ["React", "TypeScript", "Redux"],
          completed: false
        }]
      },
      lastGenerated: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    batch.set(doc(db, 'ai_career_content', 'sample_career_1'), sampleCareerContent);
    setupResults.push({ collection: 'ai_career_content', status: 'success' });

    // ============================================
    // 16. FOLLOWS
    // ============================================
    console.log('📁 16/17 Setting up follows...');
    const sampleFollow = {
      followerId: "sample_user_1",
      followerEmail: "john@example.com",
      followerName: "John Doe",
      followerDisplayName: "John Doe",
      followerPhotoURL: null,
      followingId: "admin_user_1",
      followingEmail: "admin@example.com",
      followingName: "Admin User",
      followingDisplayName: "Admin User",
      followingPhotoURL: null,
      status: "active",
      createdAt: timestamp,
      updatedAt: timestamp,
      notifyOnNewPost: true,
      notifyOnBadge: true
    };
    batch.set(doc(db, 'follows', 'sample_follow_1'), sampleFollow);
    setupResults.push({ collection: 'follows', status: 'success' });

    // ============================================
    // 17. DIRECTORY_ACCESS
    // ============================================
    console.log('📁 17/17 Setting up directory_access...');
    const sampleAccess = {
      userEmail: "john@example.com",
      userName: "John Doe",
      userPhoto: null,
      userId: "sample_user_1",
      accessType: "manual_approval",
      approved: true,
      status: "active",
      approvedAt: timestamp,
      approvedBy: "shemodeltech@gmail.com",
      requestedAt: timestamp
    };
    batch.set(doc(db, 'directory_access', 'john@example.com'), sampleAccess);
    setupResults.push({ collection: 'directory_access', status: 'success' });

    // ============================================
    // COMMIT BATCH
    // ============================================
    console.log('\n📤 Committing all documents to Firebase...');
    await batch.commit();

    // ============================================
    // SUCCESS SUMMARY
    // ============================================
    console.log('\n✅ DATABASE SETUP COMPLETE!\n');
    console.log('📊 Setup Summary:');
    console.log('─────────────────────────────────────');
    setupResults.forEach((result, index) => {
      console.log(`${index + 1}. ${result.collection}: ✅ ${result.status}`);
    });
    console.log('─────────────────────────────────────');
    console.log(`\n🎉 Successfully created ${setupResults.length} collections with sample data!`);
    
    console.log('\n⚠️  NEXT STEPS:');
    console.log('1. Deploy Firestore Security Rules:');
    console.log('   firebase deploy --only firestore:rules');
    console.log('\n2. Deploy Firestore Indexes:');
    console.log('   firebase deploy --only firestore:indexes');
    console.log('\n3. Or create indexes manually as you encounter them in the console');
    
    return {
      success: true,
      collectionsCreated: setupResults.length,
      results: setupResults
    };

  } catch (error) {
    console.error('\n❌ ERROR during setup:', error);
    console.error('Error details:', error.message);
    
    return {
      success: false,
      error: error.message,
      results: setupResults
    };
  }
};

export { autoSetupFirebase };
