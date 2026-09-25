// src/Pages/admin/AdminDashboard.jsx - Black Background with Blue/Orange Accents

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp, 
  getDoc,
  getDocs,
  addDoc
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { usePermissions, roleLabel } from '../../utils/permissions';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCompletions, setPendingCompletions] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  // Reviewer access: ADMIN or EDITOR. Editors can approve, request changes,
  // and reject project submissions - they just can't delete anything.
  // Gated on users/{uid}.role, matching firestore.rules exactly. (This screen
  // used to check an `adminUsers` collection keyed by email, which was a
  // second, competing admin system; consolidated onto role.)
  const { isAdmin, isReviewer, role, loading: permsLoading } =
    usePermissions(currentUser?.uid);

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return; }
    if (!permsLoading && !isReviewer) navigate('/');
  }, [currentUser, permsLoading, isReviewer, navigate]);

  // Fetch pending project completion reviews
  useEffect(() => {
    if (!isReviewer) return;
    
    console.log('Admin Dashboard: Fetching pending project reviews...');
    
    const completionsQuery = query(
      collection(db, 'project_completion_requests'),
      where('status', '==', 'pending_admin_approval')
    );
    
    const unsubscribe = onSnapshot(completionsQuery, async (snapshot) => {
      console.log('Pending project reviews found:', snapshot.docs.length);
      
      const completionsList = [];
      
      for (const completionDoc of snapshot.docs) {
        const completionData = { id: completionDoc.id, ...completionDoc.data() };
        
        try {
          const groupDoc = await getDoc(doc(db, 'groups', completionData.groupId));
          if (groupDoc.exists()) {
            completionData.groupData = groupDoc.data();
          }
          
          const membersQuery = query(
            collection(db, 'group_members'),
            where('groupId', '==', completionData.groupId)
          );
          const membersSnapshot = await getDocs(membersQuery);
          completionData.teamSize = membersSnapshot.docs.filter(d => d.data().status === 'active').length;
          
        } catch (error) {
          console.error('Error fetching completion details:', error);
        }
        
        completionsList.push(completionData);
      }
      
      console.log('Processed project reviews:', completionsList.length);
      setPendingCompletions(completionsList);
      setLoading(false);
    }, (error) => {
      console.error('❌ Error fetching pending project reviews:', error);
      setLoading(false);
    });
    
    return unsubscribe;
  }, [isReviewer]);

  // Fetch all projects
  useEffect(() => {
    if (!isReviewer) return;
    
    console.log('🔍 Admin Dashboard: Fetching projects...');
    
    const allProjectsQuery = query(
      collection(db, 'client_projects'),
      orderBy('submissionDate', 'desc')
    );
    
    const unsubscribe = onSnapshot(allProjectsQuery, (snapshot) => {
      console.log('Total projects found:', snapshot.docs.length);
      
      const allProjects = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          submissionDate: data.submissionDate?.toDate()
        };
      });
      
      setAllProjects(allProjects);
    }, (error) => {
      console.error('❌ Error fetching projects:', error);
    });
    
    return unsubscribe;
  }, [isReviewer]);

  // Project Completion Approval with Email Notification
  const approveProjectCompletion = async (completionId, completionData) => {
    try {
      console.log('✅ Admin approving project completion:', completionId);
      
      // Update completion request as approved
      await updateDoc(doc(db, 'project_completion_requests', completionId), {
        'adminApproval.approved': true,
        'adminApproval.approvedAt': serverTimestamp(),
        'adminApproval.approvedBy': currentUser.email,
        status: 'admin_approved',
        phase: 'badge_assignment',
        badgeAssignmentStatus: 'ready'
      });

      // Update group status
      await updateDoc(doc(db, 'groups', completionData.groupId), {
        status: 'ready_for_badge_assignment',
        'completionStatus.adminApproved': true,
        'completionStatus.approvedAt': serverTimestamp()
      });

      // Send Firebase notification
      await addDoc(collection(db, 'notifications'), {
        recipientEmail: completionData.adminEmail,
        type: 'project_review_approved',
        title: 'Project Completion Approved!',
        message: `Your project "${completionData.projectTitle}" completion has been approved. You can now assign badges to your team members.`,
        groupId: completionData.groupId,
        completionId: completionId,
        createdAt: serverTimestamp(),
        read: false,
        priority: 'high'
      });

      // Send email notification
      try {
        const emailData = {
          projectOwnerEmail: completionData.adminEmail,
          projectOwnerName: completionData.adminName,
          projectTitle: completionData.projectTitle,
          groupId: completionData.groupId,
          teamSize: completionData.teamSize,
          approvalDate: new Date().toISOString(),
          adminEmail: currentUser.email
        };
        
        console.log('📧 Sending approval email notification...');
        const response = await fetch('/api/notifications/send-project-review-approved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData)
        });
        
        const result = await response.json();
        if (result.success) {
          console.log('✅ Approval email sent successfully');
        } else {
          console.error('❌ Email sending failed:', result.error);
        }
      } catch (emailError) {
        console.error('❌ Email notification failed:', emailError);
        // Don't fail the approval if email fails
      }

      console.log('✅ Project completion approved successfully');
      toast.success(`Project "${completionData.projectTitle}" approved! Owner can now assign badges.`);
      
    } catch (error) {
      console.error('❌ Error approving project completion:', error);
      toast.error('Error approving project completion: ' + error.message);
    }
  };

  // Project Completion Rejection with Email Notification
  const rejectProjectCompletion = async (completionId, completionData, rejectionReason = '') => {
    try {
      console.log('❌ Admin rejecting project completion:', completionId);
      
      const reason = rejectionReason || prompt(
        'Please provide a detailed reason for rejection:\n\n' +
        'Common reasons:\n' +
        '• GitHub repository is not public\n' +
        '• She Model Tech not added as collaborator\n' +
        '• Team member names not visible in project\n' +
        '• Project appears incomplete or low quality\n' +
        '• Repository URL is invalid or inaccessible\n' +
        '• Project doesn\'t meet team requirements\n\n' +
        'Your reason:'
      );
      
      if (!reason) {
        toast.error('Rejection reason is required');
        return;
      }

      // Update completion request as rejected
      await updateDoc(doc(db, 'project_completion_requests', completionId), {
        'adminApproval.approved': false,
        'adminApproval.rejectedAt': serverTimestamp(),
        'adminApproval.rejectedBy': currentUser.email,
        'adminApproval.rejectionReason': reason,
        status: 'admin_rejected'
      });

      // Reset group status
      await updateDoc(doc(db, 'groups', completionData.groupId), {
        status: 'active',
        'completionStatus.isReadyForCompletion': false,
        'completionStatus.submittedForReview': false
      });

      // Send Firebase notification
      await addDoc(collection(db, 'notifications'), {
        recipientEmail: completionData.adminEmail,
        type: 'project_review_rejected',
        title: 'Project Completion Needs Revision ⚠️',
        message: `Your project "${completionData.projectTitle}" completion requires changes before approval.\n\nReason: ${reason}\n\nPlease address these issues and resubmit for review.`,
        groupId: completionData.groupId,
        completionId: completionId,
        rejectionReason: reason,
        createdAt: serverTimestamp(),
        read: false,
        priority: 'high'
      });

      // Send email notification for rejection
      try {
        const emailData = {
          projectOwnerEmail: completionData.adminEmail,
          projectOwnerName: completionData.adminName || 'Project Owner',
          projectTitle: completionData.projectTitle,
          groupId: completionData.groupId,
          rejectionReason: reason,
          rejectionDate: new Date().toISOString(),
          adminEmail: currentUser.email,
          resubmissionUrl: `/groups/${completionData.groupId}`
        };
        
        console.log('📧 Sending rejection email notification...');
        const response = await fetch('/api/notifications/send-project-review-rejected', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData)
        });
        
        const result = await response.json();
        if (result.success) {
          console.log('✅ Rejection email sent successfully');
        } else {
          console.error('❌ Email sending failed:', result.error);
        }
      } catch (emailError) {
        console.error('❌ Email notification failed:', emailError);
        // Don't fail the rejection if email fails
      }

      console.log('✅ Project completion rejected');
      toast.success(`Project completion rejected. Detailed feedback sent to project owner.`);
      
    } catch (error) {
      console.error('❌ Error rejecting project completion:', error);
      toast.error('Error rejecting project completion: ' + error.message);
    }
  };

  // Delete project and its associated group
  const deleteProject = async (projectId, projectData) => {
    try {
      console.log('🗑️ Deleting project and associated group:', projectId);
      
      const confirmDelete = window.confirm(
        `Are you sure you want to PERMANENTLY DELETE this project?\n\n` +
        `Project: "${projectData.projectTitle}"\n` +
        `Company: ${projectData.companyName || 'N/A'}\n\n` +
        `This action cannot be undone and will:\n` +
        `• Delete the project permanently\n` +
        `• Remove any associated group\n` +
        `• Delete all group members\n` +
        `• Remove group posts and content\n\n` +
        `Click OK to continue.`
      );
      
      if (!confirmDelete) {
        return;
      }

      const secondConfirm = window.prompt(
        'Type "DELETE" in capital letters to confirm permanent deletion:'
      );
      
      if (secondConfirm !== 'DELETE') {
        toast.error('Deletion cancelled - confirmation text did not match.');
        return;
      }

      // Delete associated group if exists
      if (projectData.groupId) {
        console.log('🗑️ Deleting associated group:', projectData.groupId);
        
        // Delete group members
        const groupMembersQuery = query(
          collection(db, 'group_members'),
          where('groupId', '==', projectData.groupId)
        );
        const membersSnapshot = await getDocs(groupMembersQuery);
        const memberDeletePromises = membersSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(memberDeletePromises);
        console.log(`✅ Deleted ${membersSnapshot.docs.length} group members`);

        // Delete group posts
        const groupPostsQuery = query(
          collection(db, 'group_posts'),
          where('groupId', '==', projectData.groupId)
        );
        const postsSnapshot = await getDocs(groupPostsQuery);
        const postDeletePromises = postsSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(postDeletePromises);
        console.log(`✅ Deleted ${postsSnapshot.docs.length} group posts`);

        // Delete the group
        await deleteDoc(doc(db, 'groups', projectData.groupId));
        console.log('✅ Deleted group document');
      }

      // Delete notifications
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('projectId', '==', projectId)
      );
      const notificationsSnapshot = await getDocs(notificationsQuery);
      const notificationDeletePromises = notificationsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(notificationDeletePromises);
      console.log(`✅ Deleted ${notificationsSnapshot.docs.length} notifications`);

      // Delete the project
      await deleteDoc(doc(db, 'client_projects', projectId));
      console.log('✅ Deleted project document');

      // Send notification to project owner
      if (projectData.contactEmail) {
        await addDoc(collection(db, 'notifications'), {
          recipientEmail: projectData.contactEmail,
          type: 'project_deleted',
          title: 'Project Deleted by Admin',
          message: `Your project "${projectData.projectTitle}" has been permanently deleted by an administrator. If you believe this was done in error, please contact support.`,
          projectId: projectId,
          deletedAt: serverTimestamp(),
          deletedBy: currentUser.email,
          createdAt: serverTimestamp(),
          read: false
        });
      }

      toast.success(`Project "${projectData.projectTitle}" and its associated group have been permanently deleted.`);
      console.log('✅ Project deletion completed successfully');

    } catch (error) {
      console.error('❌ Error deleting project:', error);
      toast.error('Error deleting project: ' + error.message);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base">Checking admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden flex flex-col relative bg-black">
      
      {/* Header */}
      <Navbar />
    
      {/* Main Content */}
      <main className="flex-grow pt-20 md:pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
          
          {/* Admin Header */}
          <section className="mb-12">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight text-white"
                  style={{
                    fontFamily: '"Inter", sans-serif'
                  }}>
                Admin{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-pink-500 to-orange-500">
                  Dashboard
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">Simplified Project Management</p>
            </div>
          </section>

          {/* Stats Cards */}
          <section className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 border-2 border-orange-500/30 shadow-lg">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-orange-500 text-xl sm:text-2xl">🔍</div>
                    <span className="text-orange-500 text-xs font-medium px-2 py-1 bg-orange-500/10 rounded-full border border-orange-500/30">Reviews</span>
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-400 text-xs font-medium mb-1">Pending Reviews</p>
                    <p className="text-2xl sm:text-3xl font-black text-orange-500 mb-1">{pendingCompletions.length}</p>
                    <p className="text-gray-500 text-xs">Awaiting approval</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 border-2 border-pink-500/30 shadow-lg">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-pink-500 text-xl sm:text-2xl">📁</div>
                    <span className="text-pink-500 text-xs font-medium px-2 py-1 bg-pink-500/10 rounded-full border border-pink-500/30">Projects</span>
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-400 text-xs font-medium mb-1">Total Projects</p>
                    <p className="text-2xl sm:text-3xl font-black text-pink-500 mb-1">{allProjects.length}</p>
                    <p className="text-gray-500 text-xs">In system</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 border-2 border-pink-500/30 shadow-lg">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-pink-500 text-xl sm:text-2xl">✅</div>
                    <span className="text-pink-500 text-xs font-medium px-2 py-1 bg-pink-500/10 rounded-full border border-pink-500/30">Status</span>
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-400 text-xs font-medium mb-1">System Status</p>
                    <p className="text-2xl sm:text-3xl font-black text-pink-500 mb-1">Active</p>
                    <p className="text-gray-500 text-xs">All systems operational</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content Section */}
          <section>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Project Completion Reviews</h2>
              
              <div className="mb-6 p-4 sm:p-6 bg-orange-500/10 border-2 border-orange-500/30 rounded-xl">
                <h4 className="text-orange-500 font-bold mb-2 text-base sm:text-lg">📋 Project Review Guidelines</h4>
                <p className="text-gray-600 text-sm sm:text-base mb-2">
                  Please verify the following before approving:
                </p>
                <ul className="text-gray-600 text-sm sm:text-base space-y-1 ml-4">
                  <li>✓ GitHub repository is public and accessible</li>
                  <li>✓ She Model Tech is added as collaborator</li>
                  <li>✓ All team member names are visible in the project</li>
                  <li>✓ Project appears complete and functional</li>
                  <li>✓ Repository URL works and leads to the correct project</li>
                </ul>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-sm sm:text-base">Loading project reviews...</p>
                </div>
              ) : pendingCompletions.length === 0 ? (
                <div className="text-center py-12 bg-gray-900 rounded-2xl border-2 border-pink-500/30">
                  <div className="text-5xl sm:text-6xl mb-4">🎉</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">All caught up!</h3>
                  <p className="text-gray-600 text-sm sm:text-base">No project reviews pending.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {pendingCompletions.map((completion) => (
                    <div key={completion.id} className="bg-gray-900 rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-pink-500/30 shadow-xl">
                      
                      {/* Project Header */}
                      <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                          <h3 className="text-xl md:text-2xl font-bold text-white">{completion.projectTitle}</h3>
                          <span className="px-4 py-2 bg-orange-500/20 text-orange-500 rounded-full text-sm font-semibold border-2 border-orange-500/30 w-fit">
                            ⏳ Pending Review
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-sm">
                          <div className="p-4 bg-pink-500/10 border-2 border-pink-500/30 rounded-xl">
                            <span className="text-pink-500 font-semibold block mb-2">👤 Project Owner</span>
                            <span className="text-white font-medium">{completion.adminName || completion.adminEmail}</span>
                          </div>
                          <div className="p-4 bg-pink-500/10 border-2 border-pink-500/30 rounded-xl">
                            <span className="text-pink-500 font-semibold block mb-2">👥 Team Size</span>
                            <span className="text-white font-medium">{completion.teamSize || 0} members</span>
                          </div>
                          <div className="p-4 bg-orange-500/10 border-2 border-orange-500/30 rounded-xl">
                            <span className="text-orange-500 font-semibold block mb-2">📅 Submitted</span>
                            <span className="text-white font-medium">{completion.submittedForApprovalAt?.toDate?.()?.toLocaleDateString()}</span>
                          </div>
                          <div className="p-4 bg-orange-500/10 border-2 border-orange-500/30 rounded-xl">
                            <span className="text-orange-500 font-semibold block mb-2">🆔 Group ID</span>
                            <span className="text-white font-medium text-xs break-all">{completion.groupId}</span>
                          </div>
                        </div>
                      </div>

                      {/* Repository & Project URLs */}
                      <div className="mb-8">
                        <div className="p-6 bg-gradient-to-br from-pink-500/20 to-pink-600/20 border-2 border-pink-500/30 rounded-xl">
                          <h5 className="text-pink-400 font-bold text-lg mb-4 flex items-center">
                            🔗 Repository & Project Information
                          </h5>
                          
                          {(() => {
                            let githubUrl = null;
                            let projectUrl = null;
                            let demoUrl = null;
                            
                            if (completion.projectReview) {
                              githubUrl = completion.projectReview.repositoryUrl || completion.projectReview.githubRepositoryUrl || completion.projectReview.githubUrl;
                              projectUrl = completion.projectReview.projectUrl || completion.projectReview.projectLink;
                              demoUrl = completion.projectReview.demoUrl || completion.projectReview.liveDemoUrl;
                            }
                            
                            if (!githubUrl || !projectUrl) {
                              const possibleGitHubFields = [
                                'githubRepositoryUrl', 'GitHub Repository URL', 'githubUrl', 'repositoryUrl',
                                'repository_url', 'repo_url', 'github_url', 'gitUrl', 'codeUrl',
                                'projectRepository', 'sourceCode', 'repoLink', 'githubLink'
                              ];
                              
                              const possibleProjectFields = [
                                'projectUrl', 'Project URL', 'projectLink', 'website', 'siteUrl',
                                'project_url', 'mainUrl', 'appUrl', 'websiteUrl'
                              ];
                              
                              if (!githubUrl) {
                                for (const field of possibleGitHubFields) {
                                  if (completion[field] && completion[field].trim() !== '') {
                                    githubUrl = completion[field];
                                    break;
                                  }
                                }
                              }
                              
                              if (!projectUrl) {
                                for (const field of possibleProjectFields) {
                                  if (completion[field] && completion[field].trim() !== '') {
                                    projectUrl = completion[field];
                                    break;
                                  }
                                }
                              }
                            }
                            
                            if (githubUrl || projectUrl) {
                              return (
                                <div className="space-y-4">
                                  {githubUrl && (
                                    <div>
                                      <label className="text-pink-500 font-semibold block mb-2">
                                        GitHub Repository URL: <span className="text-orange-500">*Required</span>
                                      </label>
                                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                        <a 
                                          href={githubUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="flex-1 bg-gray-800 border-2 border-pink-500/30 rounded-lg px-4 py-3 text-pink-500 hover:text-pink-400 transition-colors break-all"
                                        >
                                          {githubUrl}
                                        </a>
                                        <button
                                          onClick={() => window.open(githubUrl, '_blank')}
                                          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap w-full sm:w-auto shadow-sm"
                                        >
                                          Open GitHub →
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {projectUrl && (
                                    <div>
                                      <label className="text-orange-300 font-semibold block mb-2">
                                        Project URL:
                                      </label>
                                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                        <a 
                                          href={projectUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="flex-1 bg-gray-800 border-2 border-orange-500/30 rounded-lg px-4 py-3 text-orange-300 hover:text-orange-200 transition-colors break-all"
                                        >
                                          {projectUrl}
                                        </a>
                                        <button
                                          onClick={() => window.open(projectUrl, '_blank')}
                                          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap w-full sm:w-auto shadow-sm"
                                        >
                                          Visit Project →
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {demoUrl && (
                                    <div>
                                      <label className="text-pink-500 font-semibold block mb-2">
                                        Live Demo URL:
                                      </label>
                                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                        <a 
                                          href={demoUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="flex-1 bg-gray-800 border-2 border-pink-500/30 rounded-lg px-4 py-3 text-pink-500 hover:text-pink-400 transition-colors break-all"
                                        >
                                          {demoUrl}
                                        </a>
                                        <button
                                          onClick={() => window.open(demoUrl, '_blank')}
                                          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap w-full sm:w-auto shadow-sm"
                                        >
                                          Try Demo →
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            } else {
                              return (
                                <div className="text-orange-500 bg-orange-500/10 border-2 border-orange-500/30 rounded-lg p-4">
                                  ⚠️ No repository or project URLs found in the completion data
                                </div>
                              );
                            }
                          })()}
                        </div>
                      </div>

                      {/* Project Details Section */}
                      <div className="mb-8 space-y-6">
                        
                        {completion.projectReview?.projectSummary && (
                          <div className="p-6 bg-gray-800 border-2 border-gray-700 rounded-xl">
                            <h5 className="text-gray-600 font-bold text-lg mb-4 flex items-center">
                              📝 Project Summary
                            </h5>
                            <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-4">
                              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                {completion.projectReview.projectSummary}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {completion.projectReview?.technologiesUsed && (
                          <div className="p-6 bg-pink-500/10 border-2 border-pink-500/30 rounded-xl">
                            <h5 className="text-pink-400 font-bold text-lg mb-4 flex items-center">
                              💻 Technologies Used
                            </h5>
                            <div className="bg-gray-900 border-2 border-pink-500/30 rounded-lg p-4">
                              <p className="text-pink-600 leading-relaxed text-sm sm:text-base">
                                {completion.projectReview.technologiesUsed}
                              </p>
                            </div>
                          </div>
                        )}

                        {completion.projectReview?.keyFeatures && (
                          <div className="p-6 bg-orange-500/10 border-2 border-orange-500/30 rounded-xl">
                            <h5 className="text-orange-400 font-bold text-lg mb-4 flex items-center">
                              ⭐ Key Features
                            </h5>
                            <div className="bg-gray-900 border-2 border-orange-500/30 rounded-lg p-4">
                              <p className="text-gray-500 leading-relaxed text-sm sm:text-base">
                                {completion.projectReview.keyFeatures}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <button
                          onClick={() => approveProjectCompletion(completion.id, completion)}
                          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-xl flex items-center justify-center"
                        >
                          ✅ Approve Project Review
                        </button>
                        
                        <button
                          onClick={() => rejectProjectCompletion(completion.id, completion)}
                          className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-xl flex items-center justify-center"
                        >
                          <span className="mr-2 text-xl">❌</span>
                          Request Changes
                        </button>
                      </div>

                      {/* Review Guidelines Reminder */}
                      <div className="mt-6 p-4 bg-orange-500/10 border-2 border-orange-500/30 rounded-xl">
                        <p className="text-orange-400 text-sm">
                          <strong>⚠️ Before approving:</strong> Ensure the repository is accessible, She Model Tech is added as collaborator, 
                          team member names are visible, and the project meets completion standards.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* All Projects List for Deletion */}
              <div className="mt-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">All Projects Management</h2>
                
                <div className="mb-6 p-4 sm:p-6 bg-orange-500/10 border-2 border-orange-500/30 rounded-xl">
                  <h4 className="text-orange-500 font-bold mb-2 text-base sm:text-lg">🗑️ Delete Projects</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Delete any project and its associated group permanently. This action cannot be undone.
                  </p>
                </div>

                {allProjects.length === 0 ? (
                  <div className="text-center py-12 bg-gray-900 rounded-2xl border-2 border-pink-500/30">
                    <div className="text-5xl sm:text-6xl mb-4">📁</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">No projects found</h3>
                    <p className="text-gray-600 text-sm sm:text-base">No projects exist in the system.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {allProjects.map((project) => {
                      const getStatusColor = (status) => {
                        switch (status) {
                          case 'approved': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
                          case 'pending':
                          case 'pending_approval':
                          case 'submitted': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
                          case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
                          default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
                        }
                      };

                      return (
                        <div key={project.id} className="bg-gray-900 rounded-xl p-4 border-2 border-gray-700 hover:border-pink-500/50 transition-all duration-300">
                          
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-sm font-bold text-white truncate">
                                {project.projectTitle}
                              </h3>
                              <span className={`px-2 py-1 rounded text-xs font-semibold border-2 ${getStatusColor(project.status)}`}>
                                {project.status || 'pending'}
                              </span>
                            </div>
                            
                            <div className="space-y-1 text-xs text-gray-400">
                              <div className="flex justify-between">
                                <span>Company:</span>
                                <span className="text-white truncate ml-2 max-w-32">
                                  {project.companyName || 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Contact:</span>
                                <span className="text-white truncate ml-2 max-w-32">
                                  {project.contactName}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Submitted:</span>
                                <span className="text-white">
                                  {project.submissionDate?.toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Has Group:</span>
                                <span className={project.groupId ? 'text-pink-400' : 'text-gray-400'}>
                                  {project.groupId ? 'Yes' : 'No'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-2 p-2 bg-gray-800 border border-gray-700 rounded text-xs text-gray-600">
                              {project.projectDescription?.length > 100 ? 
                                `${project.projectDescription.substring(0, 100)}...` : 
                                project.projectDescription || 'No description'}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => deleteProject(project.id, project)}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-xs font-semibold transition-colors duration-300 shadow-sm"
                          >
                            🗑️ Delete Project & Group
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Custom Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        button:hover {
          transform: translateY(-1px);
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 640px) {
          button, a, input, textarea, select {
            min-height: 44px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
