// src/Pages/projects/ProjectOwnerDashboard.jsx - Manage Your Projects

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, getDoc, setDoc, updateDoc, addDoc, getDocs, deleteDoc, increment, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { sendPush } from '../../utils/pushNotifications';
import { toast } from 'react-toastify';
import { notifyApplicationApproved, notifyApplicationRejected } from '../../utils/emailNotifications';
import JoinedProjects from '../../components/JoinedProjects';
import NoteDialog, { friendlyError } from '../../components/NoteDialog';
import { markOwnerPaidAll, isReadyToComplete, healPaidProjectStatus } from '../../utils/paidProjects';
import { alertStaff, notifyMember } from '../../utils/staffAlerts';
import { isPremium } from '../../config/premium';
import PremiumBadge from '../../components/PremiumBadge';
import { listMySponsorRequests, listSponsoredCohorts, listSponsoredProjects } from '../../utils/sponsorships2';
import { useFeatures } from '../../utils/features';

const industryTracks = [
  { value: 'healthcare', label: 'Healthcare / Medical' },
  { value: 'finance', label: 'Finance / Fintech' },
  { value: 'education', label: 'Education' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'entertainment', label: 'Entertainment / Media' },
  { value: 'government', label: 'Government' },
  { value: 'technology', label: 'Technology / Software / SaaS' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'transportation', label: 'Transportation / Logistics' },
  { value: 'realestate', label: 'Real Estate / PropTech' },
  { value: 'energy', label: 'Energy / Utilities' },
  { value: 'agriculture', label: 'Agriculture / AgTech' },
  { value: 'manufacturing', label: 'Manufacturing / Industrial' },
  { value: 'legal', label: 'Legal Tech' },
  { value: 'nonprofit', label: 'Non-Profit / Social Impact' },
  { value: 'travel', label: 'Travel / Hospitality' },
  { value: 'sports', label: 'Sports / Fitness' },
  { value: 'food', label: 'Food / Beverage' },
  { value: 'fashion', label: 'Fashion / Retail' },
  { value: 'construction', label: 'Construction / Infrastructure' },
  { value: 'marketing', label: 'Marketing / Advertising' },
];

const getIndustryLabel = (val) => industryTracks.find(t => t.value === val)?.label || val;
const formatTimeline = (t) => ({ '1-week': '1 Week', '2-weeks': '2 Weeks', '1-month': '1 Month', '2-3-months': '2-3 Months', '3-6-months': '3-6 Months', '6-months-plus': '6+ Months', 'flexible': 'Flexible' }[t] || t);

const ProjectOwnerDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [myProjects, setMyProjects] = useState([]);
  // Individuals see two tabs: projects they lead/created, and projects they
  // applied to or joined (free or paid). Companies only have their own.
  const [view, setView] = useState('lead');
  const [isCompany, setIsCompany] = useState(false);
  const features = useFeatures();
  // "Manage project" from a workspace opens just that project.
  const focusId = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('project');
  // Projects in cohorts this company sponsors (it's added to their workspaces).
  const [sponsored, setSponsored] = useState([]);
  useEffect(() => {
    if (!currentUser) return;
    listSponsoredProjects(currentUser.uid).then(setSponsored).catch(() => {});
    listSponsoredCohorts(currentUser.uid).then(setSponsoredCohorts).catch(() => {});
    listMySponsorRequests(currentUser.uid)
      .then((l) => setSponsorReqs(l.sort((x, y) => (y.createdAt?.seconds || 0) - (x.createdAt?.seconds || 0))))
      .catch(() => {});
  }, [currentUser]);
  const [sponsoredCohorts, setSponsoredCohorts] = useState([]);
  const [sponsorReqs, setSponsorReqs] = useState([]);
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid))
      .then((s) => setIsCompany(!!s.data()?.isCompany))
      .catch(() => {});
  }, [currentUser]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) { setLoading(false); return; }
    const q = query(collection(db, 'projects'), where('submitterEmail', '==', currentUser.email));
    const unsub = onSnapshot(q, async (snap) => {
      const list = [];
      for (const d of snap.docs) {
        const project = { id: d.id, ...d.data() };
        // SELF-HEAL: a paid project where the owner marked everyone paid and
        // every member confirmed should be 'completed' - flip it so the card
        // stops showing "Awaiting Payment Confirmation". The write re-fires
        // this snapshot with the corrected status.
        if (isReadyToComplete(project)) {
          const healed = await healPaidProjectStatus(project);
          if (healed) project.status = 'completed';
        }
        // Fetch applications
        try {
          const appQ = query(collection(db, 'project_applications'), where('projectId', '==', d.id));
          const appSnap = await getDocs(appQ);
          project.applications = appSnap.docs.map(a => ({ id: a.id, ...a.data() }));
          project.pendingCount = project.applications.filter(a => a.status === 'submitted').length;
          project.approvedMembers = project.applications.filter(a => a.status === 'approved');
        } catch (e) { project.applications = []; project.pendingCount = 0; project.approvedMembers = []; }
        list.push(project);
      }
      list.sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0));
      setMyProjects(list);
      setLoading(false);
    });
    return unsub;
  }, [currentUser]);

  // Paid projects: owner marks all members paid; members then confirm receipt.
  // If everyone already confirmed, the project completes immediately.
  const markAllPaid = async (project) => {
    const ok = window.confirm(
      `Confirm you have paid ALL members of "${project.projectTitle}" the amounts shown. Each member will be asked to confirm they received their payment, and the project closes when all confirmations match.`
    );
    if (!ok) return;
    try {
      const completed = await markOwnerPaidAll(project, currentUser);
      toast.success(completed ? 'All confirmed - project completed and moved to the Project Vault!' : 'Marked as paid. Members have been asked to confirm receipt.');
    } catch (e) {
      toast.error(e.message || 'Could not mark as paid.');
    }
  };

  // Arriving from a workspace's "Manage project": scroll to that project.
  useEffect(() => {
    const h = typeof window !== 'undefined' ? window.location.hash : '';
    if (!h.startsWith('#project-') || !myProjects.length) return;
    setTimeout(() => document.getElementById(h.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  }, [myProjects.length]);

  // When a role is already full, the lead chooses what to do in a proper dialog
  // (suggest another role, message the applicant, or grow the team).
  const [roleFull, setRoleFull] = useState(null);
  const [altRole, setAltRole] = useState('');
  const [altNote, setAltNote] = useState('');

  const approveApplication = async (project, app, opts = {}) => {
    try {
      // Soft cap: how many are already approved for this same role vs the role's target count.
      const roleName = app.role;
      const roleDef = (project.teamRoles || []).find(r => r.role === roleName);
      const cap = roleDef ? (parseInt(roleDef.count, 10) || 0) : 0;
      const approvedForRole = (project.applications || [])
        .filter(a => a.status === 'approved' && a.role === roleName).length;
      if (cap > 0 && approvedForRole >= cap && !opts.force) {
        const openRoles = (project.teamRoles || [])
          .filter((r) => r.role && r.role !== roleName)
          .filter((r) => (project.applications || []).filter((a) => a.status === 'approved' && a.role === r.role).length < (parseInt(r.count, 10) || 0))
          .map((r) => r.role);
        setAltRole(openRoles[0] || '');
        setAltNote('');
        setRoleFull({ project, app, roleName, approvedForRole, cap, openRoles });
        return;
      }

      await updateDoc(doc(db, 'project_applications', app.id), {
        status: 'approved', approvedAt: serverTimestamp(), approvedBy: currentUser.email,
      });
      // Add member to project members array
      await updateDoc(doc(db, 'projects', project.id), { 
        applicationCount: increment(0),
        members: arrayUnion(app.applicantUid || app.applicantId || app.applicantEmail),
      });
      toast.success(`${app.applicantName} approved!`);

      // Immediately reflect the approval in local state so the UI updates
      // (the projects listener may not refire just from an application status change).
      setMyProjects(prev => prev.map(p => {
        if (p.id !== project.id) return p;
        const applications = (p.applications || []).map(a => a.id === app.id ? { ...a, status: 'approved' } : a);
        return {
          ...p,
          applications,
          pendingCount: applications.filter(a => a.status === 'submitted').length,
          approvedMembers: applications.filter(a => a.status === 'approved'),
        };
      }));

      // Send notification to applicant
      try {
        const userQ = query(collection(db, 'users'), where('email', '==', app.applicantEmail));
        const userSnap = await getDocs(userQ);
        if (!userSnap.empty) {
          await addDoc(collection(db, 'notifications'), {
            userId: userSnap.docs[0].id,
            type: 'application_approved',
            message: `Your application for "${project.projectTitle}" has been approved! You can now access the workspace.`,
            projectId: project.id,
            projectTitle: project.projectTitle,
            mentionedByName: currentUser.displayName || currentUser.email,
            mentionedByPhoto: currentUser.photoURL || null,
            isRead: false,
            createdAt: serverTimestamp(),
          });
          // Push to the approved member (non-blocking)
          sendPush({
            recipientUid: userSnap.docs[0].id,
            title: 'Application approved',
            body: `Your application for "${project.projectTitle}" was approved! You can now access the workspace.`,
            link: `/projects/${project.id}`,
          });
        }
      } catch (notifErr) { console.error('Approval notification error:', notifErr); }

      // Send approval email to applicant
      try {
        await notifyApplicationApproved({
          applicantEmail: app.applicantEmail,
          applicantName: app.applicantName,
          projectTitle: project.projectTitle,
          roleAppliedFor: app.role,
          projectOwner: project.contactName || currentUser.displayName,
        });
      } catch (emailErr) {
        console.error('Approval email failed (non-blocking):', emailErr);
      }
    } catch (e) { toast.error('Error approving: ' + e.message); }
  };

  const rejectApplication = async (app) => {
    try {
      await updateDoc(doc(db, 'project_applications', app.id), {
        status: 'rejected', rejectedAt: serverTimestamp(), rejectedBy: currentUser.email,
      });
      toast.success(`Application rejected`);

      // Reflect immediately in local state.
      setMyProjects(prev => prev.map(p => {
        const applications = (p.applications || []).map(a => a.id === app.id ? { ...a, status: 'rejected' } : a);
        return {
          ...p,
          applications,
          pendingCount: applications.filter(a => a.status === 'submitted').length,
          approvedMembers: applications.filter(a => a.status === 'approved'),
        };
      }));

      // Send rejection email to applicant
      try {
        await notifyApplicationRejected(
          { applicantEmail: app.applicantEmail, applicantName: app.applicantName },
          { projectTitle: app.projectTitle },
          ''
        );
      } catch (emailErr) {
        console.error('Rejection email failed (non-blocking):', emailErr);
      }
    } catch (e) { toast.error('Error rejecting: ' + e.message); }
  };

  // Third option beside Approve/Reject: message the applicant directly (e.g.
  // "Send me your portfolio"). This creates/reuses a conversation between the
  // owner and the applicant in Messages, drops the request in as the first
  // message, and notifies the applicant - who replies right in their inbox.
  const requestApplicantInfo = async (project, app, message) => {
    const msg = (message || '').trim();
    if (!msg) { toast.error('Type a short message for the applicant.'); return; }
    if (!app.applicantUid) { toast.error('This applicant cannot be messaged.'); return; }
    try {
      // 1) Ensure the conversation exists (same deterministic id Messages uses).
      const convId = [currentUser.uid, app.applicantUid].sort().join('_');
      const convRef = doc(db, 'conversations', convId);
      const convSnap = await getDoc(convRef);
      if (!convSnap.exists()) {
        await setDoc(convRef, {
          participants: [currentUser.uid, app.applicantUid],
          lastMessage: '',
          lastMessageAt: serverTimestamp(),
          createdAt: serverTimestamp(),
          unreadBy: { [currentUser.uid]: 0, [app.applicantUid]: 0 },
        });
      }

      // 2) Drop the request into the chat, with the project as context.
      const chatText = `About your application for "${project.projectTitle}" (${app.role}): ${msg}`;
      await addDoc(collection(db, 'conversations', convId, 'messages'), {
        text: chatText,
        senderId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      await updateDoc(convRef, {
        lastMessage: chatText,
        lastMessageAt: serverTimestamp(),
        [`unreadBy.${app.applicantUid}`]: increment(1),
      });

      // 3) Record the request on the application so the owner card keeps context.
      await updateDoc(doc(db, 'project_applications', app.id), {
        feedbackRequest: {
          message: msg,
          requestedBy: currentUser.email,
          requestedByUid: currentUser.uid,
          requestedAt: serverTimestamp(),
        },
      });
      setMyProjects(prev => prev.map(p => {
        const applications = (p.applications || []).map(a =>
          a.id === app.id ? { ...a, feedbackRequest: { message: msg, requestedBy: currentUser.email, requestedByUid: currentUser.uid } } : a
        );
        return { ...p, applications };
      }));

      // 4) No separate in-app notification: the chat message IS the notification -
      // it lands in the applicant's Messages inbox with an unread badge, exactly
      // like any other message. A push (device) notification still goes out,
      // matching what Messages does for every normal message, and links to the inbox.
      try {
        await sendPush({
          recipientUid: app.applicantUid,
          title: 'Message about your application',
          body: `"${project.projectTitle}": ${msg}`,
          link: '/messages',
        });
      } catch (_) {}

      toast.success('Message sent - the conversation is in your inbox.');
    } catch (e) { toast.error('Could not send the message: ' + e.message); }
  };

  const removeMember = async (project, app) => {
    if (!window.confirm(`Remove ${app.applicantName} from this project? This cannot be undone.`)) return;
    try {
      await updateDoc(doc(db, 'project_applications', app.id), {
        status: 'removed', removedAt: serverTimestamp(), removedBy: currentUser.email,
      });
      toast.success(`${app.applicantName} removed from project`);
    } catch (e) { toast.error('Error removing member: ' + e.message); }
  };

  const toggleApplications = async (project) => {
    try {
      const newState = project.applicationsOpen === false ? true : false;
      await updateDoc(doc(db, 'projects', project.id), { applicationsOpen: newState });
      toast.success(newState ? 'Applications opened' : 'Applications closed');
    } catch (e) { toast.error('Error updating applications status'); }
  };

  // Owners can't delete directly - they request deletion (admin approves).
  // Only allowed while no members have joined; otherwise they must close/dispute.
  // Featuring a project (Premium): it appears first on the Projects board and
  // in members' dashboards.
  const [premiumOwner, setPremiumOwner] = useState(false);
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid))
      .then((snap) => setPremiumOwner(isPremium(snap.data()) || snap.data()?.role === 'admin'))
      .catch(() => {});
  }, [currentUser]);
  const toggleFeatured = async (project) => {
    try {
      await updateDoc(doc(db, 'projects', project.id), { featured: !project.featured });
      setMyProjects((ps) => ps.map((p) => (p.id === project.id ? { ...p, featured: !project.featured } : p)));
      toast.success(project.featured ? 'No longer featured.' : 'Featured at the top of Projects.');
    } catch (e) {
      toast.error(friendlyError(e, 'Could not update it.'));
    }
  };

  const applicantUid = (app) => app?.applicantUid || app?.applicantId || null;

  // Suggest a different role: tell her (bell + email) and open a conversation.
  const suggestRole = async () => {
    const { project, app, roleName } = roleFull;
    const uid = applicantUid(app);
    const text = `Hi ${app.applicantName || ''}! The ${roleName} role on "${project.projectTitle}" is already filled. Would you like to join as ${altRole} instead?${altNote.trim() ? ` ${altNote.trim()}` : ''}`;
    if (uid) {
      notifyMember(uid, {
        type: 'role_suggestion',
        title: `A different role on "${project.projectTitle}"`,
        body: `The ${roleName} role is full. The lead suggests ${altRole} instead. Reply in Messages.`,
        link: `/messages?with=${currentUser.uid}`,
        ctaLabel: 'Reply in Messages',
      });
      setRoleFull(null);
      navigate(`/messages?to=${uid}&text=${encodeURIComponent(text)}`);
    } else {
      toast.error('Could not find this applicant’s account to message.');
    }
  };

  // Approve her straight into the other role (she's told which role).
  const approveAsOtherRole = async () => {
    const { project, app } = roleFull;
    try {
      await updateDoc(doc(db, 'project_applications', app.id), { role: altRole, originalRole: app.role });
      setRoleFull(null);
      await approveApplication(project, { ...app, role: altRole }, { force: true });
    } catch (e) {
      toast.error(friendlyError(e, 'Could not approve.'));
    }
  };

  // Asking for a reason opens a dialog (room to explain), not the browser prompt.
  const [deleteFor, setDeleteFor] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const requestDeletion = (project) => {
    if ((project.approvedMembers?.length || 0) > 0) {
      toast.error('This project has members. Close or dispute it instead of deleting.');
      return;
    }
    setDeleteFor(project);
  };
  const sendDeletionRequest = async (project, reason) => {
    if (!reason.trim()) { toast.error('Please add a reason for the request.'); return; }
    setDeleting(true);
    try {
      await addDoc(collection(db, 'deletionRequests'), {
        projectId: project.id,
        projectTitle: project.projectTitle || project.title || '',
        ownerId: currentUser.uid,
        ownerEmail: currentUser.email,
        reason: reason.trim(),
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'projects', project.id), { deletionRequested: true });
      setMyProjects(prev => prev.map(p => p.id === project.id ? { ...p, deletionRequested: true } : p));
      toast.success('Deletion request sent. An admin will review it.');
      alertStaff({
        type: 'deletion_requested',
        title: 'Project deletion requested',
        body: `${currentUser.displayName || currentUser.email} asked to delete "${project.projectTitle || project.title || 'a project'}": ${reason.trim().slice(0, 140)}`,
        link: '/admin',
        roles: ['admin'],
      });
      setDeleteFor(null);
    } catch (e) { console.error('deletion request failed', e); toast.error(friendlyError(e, 'Could not send the request.')); }
    setDeleting(false);
  };

  if (loading) {
    return (
      <>
        
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      
      <div className="min-h-screen overflow-x-hidden " style={{ backgroundColor: '#ffffff' }}>
        {roleFull && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="rolefull-h"
            onKeyDown={(e) => e.key === 'Escape' && setRoleFull(null)}>
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
              <h2 id="rolefull-h" className="text-lg font-bold text-gray-900">The {roleFull.roleName} role is full</h2>
              <p className="text-sm text-gray-600 mt-1">
                {roleFull.approvedForRole} of {roleFull.cap} filled. What would you like to do for {roleFull.app.applicantName || 'this applicant'}?
              </p>

              {roleFull.openRoles.length > 0 ? (
                <div className="mt-4 rounded-xl border border-pink-200 bg-pink-50/50 p-4">
                  <p className="text-sm font-semibold text-gray-900">Offer a different role</p>
                  <label className="block text-xs text-gray-600 mt-2" htmlFor="alt-role">Role with space</label>
                  <select id="alt-role" value={altRole} onChange={(e) => setAltRole(e.target.value)} className="mt-1 w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white">
                    {roleFull.openRoles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <label className="block text-xs text-gray-600 mt-3" htmlFor="alt-note">Add a note <span className="text-gray-400">(optional, up to 300 characters)</span></label>
                  <textarea id="alt-note" rows={2} maxLength={300} value={altNote} onChange={(e) => setAltNote(e.target.value)} className="mt-1 w-full text-sm border border-gray-300 rounded-lg px-3 py-2" />
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button onClick={suggestRole} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Suggest it and chat</button>
                    <button onClick={approveAsOtherRole} className="text-sm font-semibold border border-pink-300 text-pink-700 bg-white px-4 py-2 rounded-lg">Approve as {altRole || 'this role'}</button>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2">“Suggest it and chat” notifies her and opens a conversation, and her application stays open for her answer.</p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-600">No other roles have space right now.</p>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {applicantUid(roleFull.app) && (
                  <button
                    onClick={() => { const uid = applicantUid(roleFull.app); setRoleFull(null); navigate(`/messages?to=${uid}`); }}
                    className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Message her
                  </button>
                )}
                <button
                  onClick={() => { const { project, app } = roleFull; setRoleFull(null); approveApplication(project, app, { force: true }); }}
                  className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Approve anyway (grow the team)
                </button>
                <button onClick={() => setRoleFull(null)} className="text-sm font-semibold text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 ml-auto">Cancel</button>
              </div>
            </div>
          </div>
        )}
        <NoteDialog
          open={!!deleteFor}
          title="Request deletion"
          description={deleteFor ? `Why do you want to delete "${deleteFor.projectTitle || deleteFor.title || 'this project'}"? An admin will review your request.` : ''}
          placeholder="For example: this was created by mistake, or it duplicates another project."
          required
          confirmLabel="Send request"
          busy={deleting}
          onCancel={() => setDeleteFor(null)}
          onConfirm={(reason) => sendDeletionRequest(deleteFor, reason)}
        />
        <main className="pb-16 sm:pb-20">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900">My <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500">Projects</span></h1>
                <p className="text-gray-400 text-sm mt-1">{view === 'joined' && !isCompany ? 'Projects you applied to or joined' : isCompany ? `${myProjects.length} paid project${myProjects.length !== 1 ? 's' : ''} you posted · ${sponsored.length} sponsored` : `${myProjects.length} project${myProjects.length !== 1 ? 's' : ''} you lead`}</p>
              </div>
              {isCompany ? (
                <div className="flex flex-wrap gap-2">
                  {features.paidProjects && (
                    <Link to="/projects/new-paid" className="inline-flex items-center justify-center px-5 py-2.5 min-h-[44px] bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg">
                      Post a paid project
                    </Link>
                  )}
                  <Link to="/projects/sponsor-cohort" className="inline-flex items-center justify-center px-5 py-2.5 min-h-[44px] bg-white border border-pink-300 text-pink-700 hover:bg-pink-50 font-bold rounded-xl text-sm transition-all">
                    {features.sponsorships ? 'Sponsor a cohort' : 'Partner with us'}
                  </Link>
                </div>
              ) : (
                <Link to="/projects" className="inline-flex items-center justify-center px-5 py-2.5 min-h-[44px] bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg">
                  Apply to lead a project
                </Link>
              )}
            </div>

            {!isCompany && (
              <div className="flex gap-1.5 mb-6">
                {[['lead', 'Projects I lead'], ['joined', 'Projects I joined']].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setView(id)}
                    className={`text-sm font-semibold px-4 py-2 rounded-full transition-all ${
                      view === id ? 'bg-pink-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {view === 'joined' && !isCompany ? (
              <JoinedProjects currentUser={currentUser} />
            ) : (
            <>
            {isCompany && (sponsorReqs.length > 0 || sponsoredCohorts.length > 0) && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Your sponsorships</h2>
                <ul className="space-y-2">
                  {sponsorReqs.map((r) => {
                    const cohort = sponsoredCohorts.find((c) => c.id === r.cohortId);
                    const revealed = cohort && sponsored.some((p) => p.cohortId === cohort.id);
                    const [label, tone] =
                      r.status === 'declined' ? ['Not scheduled', 'bg-gray-100 text-gray-700']
                      : r.status === 'new' ? ['Received · awaiting payment', 'bg-amber-50 text-amber-800']
                      : r.status === 'paid' ? ['Payment received · setting up', 'bg-sky-50 text-sky-700']
                      : revealed ? ['Running', 'bg-emerald-50 text-emerald-700']
                      : ['Cohort created · being prepared', 'bg-pink-50 text-pink-700'];
                    return (
                      <li key={r.id} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-gray-900">{r.problemTitle || 'Sponsored cohort'}</p>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tone}`}>{label}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {r.projects} project{r.projects === 1 ? '' : 's'}{r.people ? ` · ${r.people} people` : ''}{r.budget ? ` · $${r.budget}` : ''}
                          {cohort ? ` · ${cohort.name}, starts ${cohort.startDate}` : ''}
                        </p>
                        {r.status === 'declined' && (
                          <div className="mt-2 text-sm text-gray-700">
                            {r.note && <p className="m-0">{r.note}</p>}
                            <Link to={r.decidedByUid ? `/messages?to=${r.decidedByUid}` : '/support'} className="inline-block mt-2 text-xs font-semibold text-pink-700 hover:underline">
                              Message us about it
                            </Link>
                          </div>
                        )}
                        {r.status === 'scheduled' && !revealed && (
                          <p className="text-xs text-gray-600 mt-2">You’ll see each project here, with its workspace, once She Model Tech reveals them.</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {isCompany && sponsored.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Cohorts you sponsor</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {sponsored.map((p) => (
                    <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4">
                      <p className="font-semibold text-gray-900">{p.projectTitle}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {p.cohortNumber ? `Cohort ${p.cohortNumber} · ` : ''}{p.status === 'completed' ? 'Completed' : p.leadConfirmed ? 'Team building' : 'Choosing a lead'}
                      </p>
                      <Link to={`/projects/${p.id}/workspace`} className="inline-block mt-3 text-xs font-semibold bg-gray-900 text-white px-3 py-1.5 rounded-lg">Open workspace</Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {[
                ['Total Projects', myProjects.length, 'from-pink-500 to-pink-600'],
                ['Team Members', myProjects.reduce((s, p) => s + (p.approvedMembers?.length || 0), 0), 'from-pink-500 to-pink-600'],
                ['Completed', myProjects.filter(p => p.status === 'completed' || p.reviewStatus === 'rejected').length, 'from-pink-500 to-pink-600'],
              ].map(([label, val, grad]) => (
                <div key={label} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">{label}</p>
                  <p className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${grad} mt-1`}>{val}</p>
                </div>
              ))}
            </div>

            {myProjects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg font-semibold mb-2">{isCompany ? 'No paid projects yet' : 'No projects yet'}</p>
                <p className="text-gray-500 text-sm mb-6">
                  {isCompany
                    ? features.paidProjects
                      ? 'Post a paid project to hire a team, or sponsor a cohort led by She Model Tech.'
                      : 'Paid projects open soon. Until then, partner with us to support our training cohorts.'
                    : 'Apply to lead a project to get started.'}
                </p>
                {isCompany ? (
                  <Link to={features.paidProjects ? '/projects/new-paid' : '/projects/sponsor-cohort'} className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-xl text-sm">{features.paidProjects ? 'Post a paid project' : 'Partner with us'}</Link>
                ) : (
                  <Link to="/projects" className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-xl text-sm">Browse projects</Link>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {focusId && (
                  <div className="flex flex-wrap items-center justify-between gap-2 -mb-2">
                    <p className="text-sm text-gray-600">Managing one project.</p>
                    <Link to="/projects/owner-dashboard" className="text-sm font-semibold text-pink-700 hover:underline">Show all my projects</Link>
                  </div>
                )}
                {myProjects.filter((pr) => !focusId || pr.id === focusId).map(project => (
                  <div key={project.id} id={`project-${project.id}`} className={`scroll-mt-24 rounded-2xl ${typeof window !== 'undefined' && window.location.hash === `#project-${project.id}` ? 'ring-2 ring-pink-400 ring-offset-2' : ''}`}>
                  <ProjectCard project={project} currentUser={currentUser}
                    onApprove={(app) => approveApplication(project, app)}
                    onReject={rejectApplication}
                    onRequestInfo={(app, message) => requestApplicantInfo(project, app, message)}
                    onRemove={(app) => removeMember(project, app)}
                    onToggleApplications={toggleApplications}
                    onRequestDeletion={() => requestDeletion(project)}
                    onMarkAllPaid={markAllPaid}
                    canFeature={premiumOwner}
                    onToggleFeatured={() => toggleFeatured(project)}
                  />
                  </div>
                ))}
              </div>
            )}
            </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

const ProjectCard = ({ project, currentUser, onApprove, onReject, onRequestInfo, onRemove, onToggleApplications, onRequestDeletion, onMarkAllPaid, canFeature, onToggleFeatured }) => {
  const [showApps, setShowApps] = useState(false);
  // Which pending application has the "request info" composer open, and its text.
  const [requestingFor, setRequestingFor] = useState(null);
  // Interview invitations: time + meeting link, sent in the notification.
  const [interviewFor, setInterviewFor] = useState(null);
  const [ivWhen, setIvWhen] = useState('');
  const [ivLink, setIvLink] = useState('');
  const [ivNote, setIvNote] = useState('');
  const sendInterview = async (app) => {
    if (!ivWhen) return toast.error('Pick a date and time for the interview.');
    if (ivLink && !/^https?:\/\//i.test(ivLink.trim())) return toast.error('The meeting link must start with https://');
    try {
      await updateDoc(doc(db, 'project_applications', app.id), { interviewAt: ivWhen, meetLink: ivLink.trim() || null, interviewNote: ivNote.trim() || null });
      const uid = app.applicantUid || app.applicantId;
      const when = new Date(ivWhen).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      if (uid) {
        notifyMember(uid, {
          type: 'interview_invite',
          title: `Interview for "${project.projectTitle}"`,
          body: [`${when}.`, ivLink.trim() ? `Join here: ${ivLink.trim()}` : null, ivNote.trim() || null].filter(Boolean).join(' '),
          link: ivLink.trim() || `/projects/${project.id}`,
          ctaLabel: ivLink.trim() ? 'Join the interview' : 'See the project',
        });
      }
      toast.success('Interview invitation sent.');
      setInterviewFor(null);
      setIvWhen('');
      setIvLink('');
      setIvNote('');
    } catch (e) {
      toast.error('Could not send the invitation.');
    }
  };
  const [requestText, setRequestText] = useState('');
  const isRejected = project.reviewStatus === 'rejected';
  const isCompleted = project.status === 'completed' || isRejected;
  // Finished (completed or not approved) projects stay compact until opened.
  const [showDetails, setShowDetails] = useState(false);
  const compact = isCompleted && !showDetails;
  const isAwaitingPayment = project.status === 'awaiting_payment_confirmation';
  // Lead approved but the project isn't open for applications yet.
  const isSetup = project.status === 'setup';
  const pendingApps = (project.applications || []).filter(a => a.status === 'submitted');
  const approvedApps = (project.applications || []).filter(a => a.status === 'approved');

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-gray-900 font-bold text-base sm:text-lg">{project.projectTitle}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-0.5 bg-gray-100 rounded-md text-gray-600 text-[10px] font-medium">{getIndustryLabel(project.industryTrack)}</span>
            <span className="px-2 py-0.5 bg-gray-100 rounded-md text-gray-600 text-[10px] font-medium">{formatTimeline(project.timeline)}</span>
            {project.isPaid ? (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Paid Project
              </span>
            ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-600/20 text-pink-500">
              Collaborative
            </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isRejected ? 'bg-red-50 text-red-600 border-red-200' : isAwaitingPayment ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-pink-600/20 text-pink-500 border-pink-600/30'}`}>
            {isRejected ? 'Rejected' : isCompleted ? 'Completed' : isAwaitingPayment ? 'Awaiting Payment Confirmation' : isSetup ? 'Setting up' : 'Active'}
          </span>
        </div>
      </div>

      {isCompleted && (
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <p className="text-xs text-gray-500">
            {isRejected ? 'Not approved in review' : 'Completed'} · {approvedApps.length} team member{approvedApps.length === 1 ? '' : 's'}
          </p>
          <button type="button" onClick={() => setShowDetails((v) => !v)} className="text-xs font-semibold text-pink-700 hover:underline">
            {showDetails ? 'Hide details' : 'Show details'}
          </button>
        </div>
      )}

      {/* Approved Members */}
      {!compact && approvedApps.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-400 text-xs font-semibold mb-2">Team Members ({approvedApps.length})</p>
          <div className="space-y-2">
            {approvedApps.map(app => (
              <div key={app.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div>
                  <Link to={`/profile/${encodeURIComponent(app.applicantEmail)}`} className="text-gray-900 text-sm font-semibold hover:text-pink-600 hover:underline">{app.applicantName}</Link>
                  <p className="text-gray-500 text-xs">{app.role}{project.isPaid && (Number(app.payAmount) || 0) > 0 ? ` · $${Number(app.payAmount).toLocaleString()} on completion` : ''}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {app.portfolioUrl && <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 text-[10px] hover:underline">Portfolio</a>}
                    {app.linkedinUrl && <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 text-[10px] hover:underline">LinkedIn</a>}
                  </div>
                </div>
                {!isCompleted && (
                  <button onClick={() => onRemove(app)} className="text-red-400 hover:text-red-300 text-xs font-semibold transition-colors px-2 py-1">
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions: one clear next step, the everyday links, and the rest under "More". */}
      {(() => {
        const reviewLabel = project.isCompanyPost
          ? 'Mark work done'
          : project.isPaid
          ? (project.reviewStatus === 'approved' ? 'Mark work done'
            : project.reviewStatus === 'submitted' ? 'Review pending'
            : project.reviewStatus === 'needs_changes' ? 'Make the requested changes'
            : project.reviewStatus === 'rejected' ? 'Not approved'
            : 'Submit for review')
          : (project.reviewStatus === 'approved' ? 'Assign badges'
            : project.reviewStatus === 'submitted' ? 'Review pending'
            : project.reviewStatus === 'needs_changes' ? 'Make the requested changes'
            : project.reviewStatus === 'rejected' ? 'Not approved'
            : 'Submit for review');
        const active = !isCompleted && !isAwaitingPayment;
        // The single most useful next step for the lead.
        let next = null;
        if (active && pendingApps.length > 0) {
          next = {
            text: `${pendingApps.length} application${pendingApps.length === 1 ? '' : 's'} waiting for your decision.`,
            button: (
              <button onClick={() => setShowApps(!showApps)} className="px-4 py-2 min-h-[40px] bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg text-xs">
                {showApps ? 'Hide applications' : `Review applications (${pendingApps.length})`}
              </button>
            ),
          };
        } else if (active && isSetup) {
          next = {
            text: 'Finish setting up your project so members can join.',
            button: <Link to={`/projects/${project.id}/setup`} className="px-4 py-2 min-h-[40px] bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg text-xs flex items-center">Continue setup</Link>,
          };
        } else if (active) {
          next = {
            text: project.isCompanyPost
              ? 'When the work is finished, mark it done. Then pay each member; they confirm payment and the project closes.'
              : project.reviewStatus === 'submitted' ? 'Your project is with She Model Tech for review.' : 'When the work is finished, send it to She Model Tech for review.',
            button: (
              <Link to={`/projects/${project.id}/complete`} className={`px-4 py-2 min-h-[40px] font-semibold rounded-lg text-xs flex items-center ${project.reviewStatus === 'submitted' ? 'bg-gray-100 text-gray-700' : 'bg-pink-600 hover:bg-pink-700 text-white'}`}>
                {reviewLabel}
              </Link>
            ),
          };
        }
        return (
          <div className="mb-4 space-y-3">
            {next && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-pink-50/60 border border-pink-100 px-4 py-3">
                <p className="text-sm text-gray-800"><span className="font-semibold">Next step:</span> {next.text}</p>
                {next.button}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <Link to={`/projects/${project.id}/workspace`} className="px-4 py-2 min-h-[40px] bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg text-xs flex items-center">Open workspace</Link>
              <Link to={`/projects/${project.id}`} className="px-4 py-2 min-h-[40px] bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg text-xs flex items-center">View details</Link>
              {active && !isSetup && (
                <Link to={`/projects/${project.id}/setup`} className="px-4 py-2 min-h-[40px] bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg text-xs flex items-center">Edit project</Link>
              )}
              {active && pendingApps.length > 0 && !isSetup && (
                <Link to={`/projects/${project.id}/complete`} className="px-4 py-2 min-h-[40px] bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg text-xs flex items-center">{reviewLabel}</Link>
              )}
              {isAwaitingPayment && (
                <>
                  {!project.ownerPaidAll && (
                    <button onClick={() => onMarkAllPaid(project)} className="px-4 py-2 min-h-[40px] bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg text-xs flex items-center">
                      I've paid everyone
                    </button>
                  )}
                  <Link to={`/disputes/${project.id}`} className="px-4 py-2 min-h-[40px] bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 font-semibold rounded-lg text-xs flex items-center">
                    Payment status{Object.values(project.paymentConfirmations || {}).some(c => c?.status === 'disputed') ? ' · Dispute open' : ''}
                  </Link>
                </>
              )}
              {!isCompleted && (
                <details className="relative">
                  <summary className="list-none cursor-pointer px-4 py-2 min-h-[40px] bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg text-xs flex items-center gap-1">
                    More <span aria-hidden="true">▾</span>
                  </summary>
                  <div className="absolute z-20 mt-1 w-60 rounded-xl border border-gray-200 bg-white shadow-lg p-1.5 text-sm">
                    {active && !isSetup && (
                      <button onClick={() => onToggleApplications(project)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-800">
                        {project.applicationsOpen === false ? 'Open applications' : 'Close applications'}
                        <span className="block text-xs text-gray-500">{project.applicationsOpen === false ? 'Let members apply again' : 'Stop new members applying'}</span>
                      </button>
                    )}
                    {canFeature ? (
                      <button onClick={onToggleFeatured} className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-amber-800">
                        {project.featured ? 'Stop featuring' : '★ Feature this project'}
                      </button>
                    ) : (
                      <a href="/premium" className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-amber-700">★ Feature with Premium</a>
                    )}
                    {(project.approvedMembers?.length || 0) === 0 && (
                      project.deletionRequested ? (
                        <span className="block px-3 py-2 text-amber-600">Deletion requested</span>
                      ) : (
                        <button onClick={onRequestDeletion} className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 border-t border-gray-100 mt-1">
                          Request deletion
                        </button>
                      )
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        );
      })()}

      {/* Pending Applications */}
      {showApps && pendingApps.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <p className="text-pink-600 text-xs font-semibold">Pending Applications</p>
          {pendingApps.map(app => (
            <div key={app.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <Link to={`/profile/${encodeURIComponent(app.applicantEmail)}`} className="text-gray-900 font-semibold text-sm hover:text-pink-600 hover:underline">{app.applicantName}</Link>
                  <p className="text-gray-400 text-xs mt-1">Role: <span className="text-gray-900">{app.role}</span></p>
                  <p className="text-gray-400 text-xs">Skills: <span className="text-gray-900">{app.skills}</span></p>
                  {app.message && <p className="text-gray-600 text-xs mt-2 italic">"{app.message}"</p>}
                  <div className="flex items-center gap-3 mt-2">
                    {app.portfolioUrl && <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 text-xs hover:underline">Portfolio / Resume</a>}
                    {app.linkedinUrl && <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 text-xs hover:underline">LinkedIn</a>}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => onApprove(app)} className="px-3 py-1.5 min-h-[36px] bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg text-xs transition-all">
                    Approve
                  </button>
                  <button onClick={() => onReject(app)} className="px-3 py-1.5 min-h-[36px] bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-xs transition-all border border-red-200">
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      if (requestingFor === app.id) { setRequestingFor(null); return; }
                      setRequestingFor(app.id);
                      setRequestText(app.feedbackRequest?.message || 'Send me your portfolio.');
                    }}
                    className="px-3 py-1.5 min-h-[36px] bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-lg text-xs transition-all border border-amber-200"
                  >
                    Request Info
                  </button>
                  <button
                    onClick={() => setInterviewFor(interviewFor === app.id ? null : app.id)}
                    className="px-3 py-1.5 min-h-[36px] bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-lg text-xs transition-all border border-sky-200"
                  >
                    Invite to interview
                  </button>
                </div>
              </div>
              {interviewFor === app.id && (
                <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50/50 p-3 space-y-2">
                  <div className="grid sm:grid-cols-2 gap-2">
                    <label className="text-xs text-gray-700">Date and time
                      <input type="datetime-local" value={ivWhen} onChange={(e) => setIvWhen(e.target.value)} className="block w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 text-sm" />
                    </label>
                    <label className="text-xs text-gray-700">Meeting link <span className="text-gray-400">(optional)</span>
                      <input value={ivLink} onChange={(e) => setIvLink(e.target.value)} placeholder="https://meet.google.com/..." className="block w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 text-sm" />
                    </label>
                  </div>
                  <label className="text-xs text-gray-700 block">Note <span className="text-gray-400">(optional, up to 300 characters)</span>
                    <textarea rows={2} maxLength={300} value={ivNote} onChange={(e) => setIvNote(e.target.value)} className="block w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 text-sm" />
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => sendInterview(app)} className="text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-lg">Send invitation</button>
                    <button onClick={() => setInterviewFor(null)} className="text-xs font-semibold text-gray-600 px-3 py-2">Cancel</button>
                  </div>
                  {app.interviewAt && <p className="text-[11px] text-gray-500">Already invited for {new Date(app.interviewAt).toLocaleString()}.</p>}
                </div>
              )}

              {/* Earlier request - the conversation continues in Messages */}
              {app.feedbackRequest?.message && requestingFor !== app.id && (
                <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-3">
                  <p className="text-amber-800 text-xs"><span className="font-semibold">You asked:</span> "{app.feedbackRequest.message}"</p>
                  <Link to={`/messages?with=${app.applicantUid}`} className="inline-block mt-1.5 text-pink-600 text-xs font-semibold hover:underline">
                    Open conversation →
                  </Link>
                </div>
              )}

              {/* Composer for the request */}
              {requestingFor === app.id && (
                <div className="mt-3 bg-white border border-amber-200 rounded-lg p-3 space-y-2">
                  <p className="text-gray-600 text-xs">Ask the applicant for something specific (e.g. their portfolio). This starts a conversation in <span className="font-semibold">Messages</span> - they reply from their inbox and you can chat from there.</p>
                  <textarea
                    value={requestText}
                    onChange={e => setRequestText(e.target.value)}
                    rows={2}
                    placeholder='e.g. "Send me your portfolio."'
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none resize-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setRequestingFor(null)} className="text-gray-500 text-xs font-semibold px-3 py-1.5">Cancel</button>
                    <button
                      onClick={() => { onRequestInfo(app, requestText); setRequestingFor(null); }}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-all"
                    >
                      Send request
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectOwnerDashboard;
