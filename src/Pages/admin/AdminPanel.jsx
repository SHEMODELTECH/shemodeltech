// src/Pages/admin/AdminPanel.jsx - Platform admin dashboard (admin-only)
// Tabs: Overview (stats) · Projects · Users · Generate · Moderation
// Gated by users/{uid}.role. Admins get everything; editors get the
// reviewer surfaces (lead applications, project review) but not
// delete/role management.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy, limit, where, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { isReviewerRole, isAdminRole, roleLabel } from '../../utils/permissions';
import { toast } from 'react-toastify';
import {
  REVIEW_STATUS,
  approveProjectReview,
  requestChanges,
  rejectProjectReview,
  getProjectMemberEmails,
} from '../../utils/projectReview';
import { clearAllTestData } from '../../utils/adminDataReset';
import { sendPush } from '../../utils/pushNotifications';
import { TEACH_TRACKS, decideTeacherApplication, listTeacherApplications, setTeacher } from '../../utils/teachers';
import { deleteTeacherCourse, listTeacherCourses, reviewStatus } from '../../utils/teacherCourses';
import NoteDialog, { friendlyError } from '../../components/NoteDialog';
import { notifyMember } from '../../utils/staffAlerts';
import { TIERS, TIER_LABEL, companyTier } from '../../config/tiers';
import { LETTER_TYPES, decideLetterRequest, listLetterRequests } from '../../utils/mentorLetters';
import { uploadDocumentToBlob } from '../../utils/blobStorage';
import OrgRequestsTab from '../../components/admin/OrgRequestsTab';
import SummitTab from '../../components/admin/SummitTab';
import AttentionBoard from '../../components/admin/AttentionBoard';
import { unpublishFromLearning } from '../../utils/learningPublished';
import LaunchSettings from '../../components/admin/LaunchSettings';
import SponsorsAdmin from '../../components/admin/SponsorsAdmin';
import GiftsAdmin from '../../components/admin/GiftsAdmin';

const fmtDate = (ts) => {
  try {
    const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
    return d ? d.toLocaleDateString() : '-';
  } catch {
    return '-';
  }
};

const statusStyle = {
  lead_recruitment: 'bg-amber-100 text-amber-700',
  setup: 'bg-purple-100 text-purple-700',
  active: 'bg-pink-100 text-pink-700',
  completed: 'bg-green-100 text-green-700',
};

// `only`: show one section on its own page (Project reviews or Projects), opened
// from the Projects menu. Without it, this is the dashboard.
const AdminPanel = ({ only = null }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // full powers: delete, roles
  const [isReviewer, setIsReviewer] = useState(false); // admin OR editor: review surfaces
  const [myRole, setMyRole] = useState(null); // shown in the header badge
  const [tab, setTab] = useState(only || 'overview');
  // Editors can't open admin-only tabs (deleting is admin-only).
  useEffect(() => {
    if (!isAdmin && ['danger', 'deletions'].includes(tab)) setTab('overview');
  }, [isAdmin, tab]);

  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    posts: 0,
    badges: 0,
    completed: 0,
    leadRecruitment: 0,
  });
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  // Paid projects She Model Tech posted (from a staff account), with applicant counts.
  const [smtPaid, setSmtPaid] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Generate tab

  const [userSearch, setUserSearch] = useState('');
  // 'all' or 'unverified' (company accounts waiting for verification)
  const [userView, setUserView] = useState('all');

  // --- Reviews tab ---
  const [reviewProjects, setReviewProjects] = useState([]);
  const [deletionReqs, setDeletionReqs] = useState([]);
  const [teacherApps, setTeacherApps] = useState(null);
  const [pendingCourses, setPendingCourses] = useState(null);
  // Every mentor course, so admins can review or delete any of them directly.
  const [allCourses, setAllCourses] = useState(null);
  const [courseQuery, setCourseQuery] = useState('');
  const [courseView, setCourseView] = useState('all'); // all | published | pending | draft | orphaned
  const deleteCourseDirect = async (c) => {
    const mentorGone = c.createdBy?.uid && !users.some((u) => u.id === c.createdBy.uid && (u.isTeacher || ['admin', 'editor'].includes(u.role)));
    if (!window.confirm(`Delete "${c.title}"${c.published ? ' and remove it from Learning' : ''}? This can't be undone.${mentorGone ? '' : ' The mentor will be notified.'}`)) return;
    try {
      if (c.published) await unpublishFromLearning(c);
      await deleteTeacherCourse(c);
      if (c.createdBy?.uid && !mentorGone) {
        notifyMember(c.createdBy.uid, {
          type: 'teacher_course_deleted',
          title: 'A course was removed',
          body: `She Model Tech removed "${c.title}" from the Mentor Hub. Message us if you have questions.`,
          link: '/teacher',
        });
      }
      setAllCourses((xs) => (xs || []).filter((x) => x.id !== c.id));
      setPendingCourses((xs) => (xs || []).filter((x) => x.id !== c.id));
      toast.success('Course deleted.');
    } catch (e) {
      toast.error(friendlyError(e, 'Could not delete the course.'));
    }
  };
  const [letterReqs, setLetterReqs] = useState(null);
  const [letterDialog, setLetterDialog] = useState(null); // { req, status: 'sent' | 'declined' }
  const [letterBusy, setLetterBusy] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [feedbackById, setFeedbackById] = useState({});
  // Request changes / Reject open a dialog for the reviewer's note.
  const [reviewDialog, setReviewDialog] = useState(null); // { project, mode: 'changes' | 'reject' }
  const [actingId, setActingId] = useState(null);

  // --- Danger Zone: clear test data ---
  const [clearing, setClearing] = useState(false);

  const [clearConfirm, setClearConfirm] = useState('');
  const [alsoResetUsers, setAlsoResetUsers] = useState(true);
  const [clearProgress, setClearProgress] = useState('');
  const [clearSummary, setClearSummary] = useState(null);

  const handleClearAllData = async () => {
    if (clearConfirm !== 'DELETE') {
      toast.error('Type DELETE to confirm.');
      return;
    }
    if (
      !window.confirm(
        'This permanently deletes ALL projects, applications, posts, messages, notifications, badges and certificates. User accounts are kept. This cannot be undone. Continue?'
      )
    ) {
      return;
    }
    setClearing(true);
    setClearSummary(null);
    setClearProgress('Starting…');
    try {
      const summary = await clearAllTestData({ resetUsers: alsoResetUsers }, (coll, count) =>
        setClearProgress(`Clearing ${coll}… (${count})`)
      );
      setClearSummary(summary);
      setClearProgress('');
      setClearConfirm('');
      toast.success('Test data cleared.');
      loadData?.();
    } catch (e) {
      console.error(e);
      toast.error('Clear failed: ' + e.message);
    }
    setClearing(false);
  };

  const loadReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      // Projects awaiting review (submitted) - fetched separately so admins see the queue.
      const snap = await getDocs(
        query(collection(db, 'projects'), where('reviewStatus', '==', REVIEW_STATUS.SUBMITTED))
      );
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      rows.sort(
        (a, b) => (b.reviewSubmittedAt?.seconds || 0) - (a.reviewSubmittedAt?.seconds || 0)
      );
      setReviewProjects(rows);
    } catch (e) {
      console.error('loadReviews failed:', e);
      toast.error('Could not load review queue.');
    }
    setLoadingReviews(false);
  }, []);

  useEffect(() => {
    // Admins and editors both review projects (free and paid).
    if ((tab === 'reviews' || only === 'projects') && isReviewer) loadReviews();
  }, [tab, isReviewer, loadReviews]);

  // Teachers: applications to review, and who currently teaches.
  useEffect(() => {
    if (tab === 'teachers' && isReviewer) {
      if (isAdmin) listTeacherApplications()
        .then(setTeacherApps)
        .catch(() => setTeacherApps([]));
      listTeacherCourses()
        .then((list) => {
          setAllCourses(list);
          setPendingCourses(list.filter((c) => reviewStatus(c) === 'pending' || c.removalRequest?.status === 'pending'));
        })
        .catch(() => { setPendingCourses([]); setAllCourses([]); });
      listLetterRequests()
        .then(setLetterReqs)
        .catch(() => setLetterReqs([]));
    }
  }, [tab, isAdmin]);

  // Declining opens a dialog so the note can be as long as needed.
  const [declineApp, setDeclineApp] = useState(null);
  const [deciding, setDeciding] = useState(false);
  const decideTeacher = async (app, approve, note = '') => {
    setDeciding(true);
    try {
      await decideTeacherApplication(app, approve, currentUser, note || '');
      setTeacherApps((xs) => xs.map((x) => (x.id === app.id ? { ...x, status: approve ? 'approved' : 'declined' } : x)));
      if (approve) setUsers((prev) => prev.map((u) => (u.id === app.applicantUid ? { ...u, isTeacher: true } : u)));
      setDeclineApp(null);
      toast.success(approve ? `${app.applicantName} is now a mentor.` : 'Application declined.');
    } catch (e) {
      console.error(e);
      toast.error(friendlyError(e, 'Could not update the application.'));
    }
    setDeciding(false);
  };

  const decideLetter = async (req, status, note, file) => {
    setLetterBusy(true);
    try {
      let letterFile = null;
      if (status === 'sent' && file) letterFile = await uploadDocumentToBlob(file, `mentor-letters/${req.uid}/final`);
      await decideLetterRequest(req, status, currentUser, note, letterFile);
      setLetterReqs((xs) => xs.map((x) => (x.id === req.id ? { ...x, status, adminNote: note || null } : x)));
      setLetterDialog(null);
      toast.success(status === 'sent' ? 'Marked as sent. The mentor has been notified.' : 'Request declined. The mentor has been notified.');
    } catch (e) {
      console.error(e);
      toast.error(friendlyError(e, 'Could not update the request.'));
    }
    setLetterBusy(false);
  };

  const toggleTeacher = async (u) => {
    const make = !u.isTeacher;
    if (!window.confirm(`${make ? 'Make' : 'Remove'} mentor: ${u.displayName || u.email}?`)) return;
    try {
      await setTeacher(u.id, make, currentUser);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isTeacher: make } : x)));
      toast.success(make ? 'They are now a mentor.' : 'Mentor access removed.');
    } catch (e) {
      console.error(e);
      toast.error('Update failed.');
    }
  };

  useEffect(() => {
    if (tab === 'deletions' && isAdmin) {
      getDocs(collection(db, 'deletionRequests'))
        .then((snap) =>
          setDeletionReqs(
            snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((r) => r.status === 'pending')
          )
        )
        .catch(() => setDeletionReqs([]));
    }
  }, [tab, isAdmin]);

  const approveDeletion = async (req) => {
    if (!window.confirm(`Delete "${req.projectTitle}"? This permanently removes the project.`))
      return;
    try {
      await deleteDoc(doc(db, 'projects', req.projectId));
      await updateDoc(doc(db, 'deletionRequests', req.id), {
        status: 'approved',
        resolvedAt: new Date(),
      });
      setDeletionReqs((prev) => prev.filter((r) => r.id !== req.id));
    } catch (e) {
      console.error('approveDeletion', e);
      alert('Could not delete the project.');
    }
  };

  const declineDeletion = async (req) => {
    try {
      await updateDoc(doc(db, 'deletionRequests', req.id), {
        status: 'declined',
        resolvedAt: new Date(),
      });
      await updateDoc(doc(db, 'projects', req.projectId), { deletionRequested: false }).catch(
        () => {}
      );
      setDeletionReqs((prev) => prev.filter((r) => r.id !== req.id));
    } catch (e) {
      console.error('declineDeletion', e);
      alert('Could not update the request.');
    }
  };
  useEffect(() => {}, [tab, isAdmin]);

  // Collect owner + approved member uids for a project (for push notifications).
  const getProjectRecipientUids = async (project) => {
    const uids = new Set();
    if (project.submitterId) uids.add(project.submitterId);
    (project.members || []).forEach((m) => {
      if (m) uids.add(m);
    });
    return Array.from(uids);
  };

  const doApprove = async (project) => {
    setActingId(project.id);
    try {
      const emails = await getProjectMemberEmails(project.id);
      await approveProjectReview(project, currentUser, emails);
      const title = project.projectTitle || project.title || 'Your project';
      sendPush({
        recipientUids: await getProjectRecipientUids(project),
        title: 'Project approved',
        body: `"${title}" was approved by She Model Tech. Badges can now be assigned.`,
        link: `/projects/${project.id}`,
      });
      toast.success('Approved. Owner and team notified.');
      setReviewProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch (e) {
      toast.error(friendlyError(e, 'Could not approve it.'));
    }
    setActingId(null);
  };

  const doRequestChanges = async (project, note) => {
    const fb = (note || '').trim();
    if (!fb) {
      toast.error('Add a note describing the changes needed.');
      return;
    }
    setActingId(project.id);
    try {
      const emails = await getProjectMemberEmails(project.id);
      await requestChanges(project, currentUser, fb, emails);
      const title = project.projectTitle || project.title || 'Your project';
      sendPush({
        recipientUids: await getProjectRecipientUids(project),
        title: 'Changes requested',
        body: `"${title}" needs changes before approval. Reviewer note: ${fb}`,
        link: `/projects/${project.id}/complete`,
      });
      toast.success('Sent back for changes. Owner notified.');
      setReviewDialog(null);
      setReviewProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch (e) {
      toast.error(friendlyError(e, 'Could not send it back for changes.'));
    }
    setActingId(null);
  };

  const doReject = async (project, note) => {
    const fb = (note || '').trim();
    setActingId(project.id);
    try {
      const emails = await getProjectMemberEmails(project.id);
      await rejectProjectReview(project, currentUser, fb, emails);
      const title = project.projectTitle || project.title || 'Your project';
      sendPush({
        recipientUids: await getProjectRecipientUids(project),
        title: 'Project not approved',
        body: `"${title}" was not approved. No badges will be assigned for this project.`,
        link: `/projects/${project.id}`,
      });
      toast.success('Rejected. Owner and team notified.');
      setReviewDialog(null);
      setReviewProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch (e) {
      toast.error(friendlyError(e, 'Could not reject it.'));
    }
    setActingId(null);
  };

  // --- Admin gate ---
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }
    getDoc(doc(db, 'users', currentUser.uid))
      .then((snap) => {
        const role = snap.exists() ? snap.data().role : null;
        if (!isReviewerRole(role)) {
          navigate('/dashboard', { replace: true });
          return;
        }
        setMyRole(role);
        setIsReviewer(true);
        // Editors get the review surfaces but NOT delete / role management.
        setIsAdmin(isAdminRole(role));
      })
      .catch(() => navigate('/dashboard', { replace: true }))
      .finally(() => setChecking(false));
  }, [currentUser, navigate]);

  // --- Load all data once staff-confirmed (admin or editor) ---
  const loadData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [usersSnap, projectsSnap, postsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'projects')),
        getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50))).catch(() =>
          getDocs(collection(db, 'posts'))
        ),
      ]);

      const userList = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const projectList = projectsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const postList = postsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      let badgeTotal = 0;
      userList.forEach((u) => {
        badgeTotal += Array.isArray(u.badges) ? u.badges.length : 0;
      });

      setUsers(userList);
      setProjects(
        projectList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      );
      setPosts(postList);
      setStats({
        users: userList.length,
        projects: projectList.length,
        posts: postList.length,
        badges: badgeTotal,
        completed: projectList.filter((p) => p.status === 'completed').length,
        leadRecruitment: projectList.filter((p) => p.status === 'lead_recruitment').length,
      });
    } catch (e) {
      console.error(e);
      toast.error('Failed to load admin data.');
    }
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (!isReviewer || tab !== 'projects') return;
    (async () => {
      try {
        const staffIds = new Set(users.filter((u) => ['admin', 'editor'].includes(u.role)).map((u) => u.id));
        // Paid work She Model Tech posted (as a company) in the main projects collection.
        const mine = projects.filter((p) => p.isCompanyPost && staffIds.has(p.submitterId) && p.status !== 'completed');
        const withCounts = await Promise.all(
          mine.map(async (c) => {
            const a = await getDocs(query(collection(db, 'project_applications'), where('projectId', '==', c.id))).catch(() => null);
            return { ...c, title: c.projectTitle, waiting: a ? a.docs.filter((d) => d.data().status === 'submitted').length : 0 };
          })
        );
        setSmtPaid(withCounts);
      } catch (_) {
        setSmtPaid([]);
      }
    })();
  }, [isReviewer, tab, users, projects]);

  // Admins and editors both see the dashboard data (editors just can't delete or change roles).
  useEffect(() => {
    if (isReviewer) loadData();
  }, [isReviewer, loadData]);

  // --- Actions ---
  // Company verification is the approval gate for posting paid projects:
  // an unverified company cannot open the "Host a project" form at all.
  // Admin-only (Firestore rules block companies from setting it themselves).
  // Ask a company for more details before verifying: marks the request, tells
  // them (bell + email), and opens a message to them with a starter note.
  const requestCompanyInfo = async (u) => {
    const name = u.companyProfile?.companyName || u.displayName || 'there';
    try {
      await updateDoc(doc(db, 'users', u.id), {
        'companyProfile.verificationStatus': 'info_requested',
        'companyProfile.infoRequestedAt': new Date().toISOString(),
        'companyProfile.infoRequestedBy': currentUser.uid,
      });
      setUsers((prev) =>
        prev.map((x) =>
          x.id === u.id ? { ...x, companyProfile: { ...(x.companyProfile || {}), verificationStatus: 'info_requested' } } : x
        )
      );
      notifyMember(u.id, {
        type: 'company_info_requested',
        title: 'We need a few details to verify your company',
        body: 'The She Model Tech team sent you a message. Reply there, and update your company details in Settings.',
        link: `/messages?with=${currentUser.uid}`,
        ctaLabel: 'Read the message',
      });
    } catch (e) {
      console.error(e);
      toast.error(friendlyError(e, 'Could not mark the request.'));
      return;
    }
    const starter =
      `Hi ${name}, thank you for joining She Model Tech. Before we verify your company, could you share: ` +
      '(1) your company website, (2) a contact phone number, and (3) your business registration or EIN. ' +
      'You can reply here and update your details in Settings. Thank you!';
    navigate(`/messages?to=${u.id}&text=${encodeURIComponent(starter)}`);
  };

  // Company tiers (Supporter, Partner, Champion): set by an admin.
  const [tierFor, setTierFor] = useState(null); // user being edited
  const [tierDraft, setTierDraft] = useState({ tier: '', until: '' });
  const openTier = (u) => {
    const until = u.companyTierUntil?.toDate ? u.companyTierUntil.toDate() : u.companyTierUntil ? new Date(u.companyTierUntil) : null;
    setTierDraft({ tier: u.companyTier || '', until: until ? until.toISOString().slice(0, 10) : '' });
    setTierFor(u);
  };
  const saveTier = async () => {
    const u = tierFor;
    const name = u.companyProfile?.companyName || u.displayName || u.email;
    try {
      const data = tierDraft.tier
        ? { companyTier: tierDraft.tier, companyTierUntil: tierDraft.until ? Timestamp.fromDate(new Date(`${tierDraft.until}T23:59:59`)) : null, companyTierSetBy: currentUser.email }
        : { companyTier: null, companyTierUntil: null, companyTierSetBy: currentUser.email };
      await updateDoc(doc(db, 'users', u.id), data);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, ...data } : x)));
      if (tierDraft.tier) {
        notifyMember(u.id, {
          type: 'tier_set',
          title: `Welcome to She Model Tech ${TIER_LABEL[tierDraft.tier]}`,
          body: tierDraft.until ? `Your ${TIER_LABEL[tierDraft.tier]} tier is active until ${new Date(`${tierDraft.until}T12:00:00`).toLocaleDateString()}.` : `Your ${TIER_LABEL[tierDraft.tier]} tier is active.`,
          link: '/premium',
        });
      }
      toast.success(tierDraft.tier ? `${name} is now ${TIER_LABEL[tierDraft.tier]}.` : `Tier removed from ${name}.`);
      setTierFor(null);
    } catch (e) {
      toast.error(friendlyError(e, 'Could not update the tier.'));
    }
  };

  const toggleCompanyVerified = async (u) => {
    if (!isAdmin) {
      toast.error('Only admins can verify companies.');
      return;
    }
    const verify = !u.isVerified;
    const name = u.companyName || u.displayName || u.email;
    if (
      !window.confirm(
        verify
          ? `Verify ${name}? They will be able to post paid projects that members can apply to.`
          : `Remove verification from ${name}? They will no longer be able to post new paid projects.`
      )
    )
      return;
    try {
      await updateDoc(doc(db, 'users', u.id), {
        isVerified: verify,
        verifiedAt: verify ? new Date().toISOString() : null,
        verifiedBy: verify ? currentUser.email : null,
        'companyProfile.verificationStatus': verify ? 'verified' : 'pending',
      });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isVerified: verify } : x)));
      if (verify) {
        try {
          await addDoc(collection(db, 'notifications'), {
            userId: u.id,
            recipientId: u.id,
            type: 'company_verified',
            title: 'Your company is verified',
            body: 'You can now post paid projects. Members will see them on the Projects page.',
            message: 'Your company is verified. You can now post paid projects.',
            link: '/projects/new-paid',
            isRead: false,
            read: false,
            createdAt: new Date(),
          });
        } catch (e) {
          console.error('verify notification failed:', e);
        }
      }
      toast.success(verify ? 'Company verified.' : 'Verification removed.');
    } catch (e) {
      console.error(e);
      toast.error('Update failed.');
    }
  };

  const toggleAdmin = async (u) => {
    if (!isAdmin) {
      toast.error('Only admins can change roles.');
      return;
    }
    const makeAdmin = u.role !== 'admin';
    if (u.id === currentUser.uid && !makeAdmin) {
      toast.error("You can't remove your own admin access.");
      return;
    }
    if (!window.confirm(`${makeAdmin ? 'Promote' : 'Demote'} ${u.displayName || u.email}?`)) return;
    try {
      await updateDoc(doc(db, 'users', u.id), { role: makeAdmin ? 'admin' : 'member' });
      setUsers((prev) =>
        prev.map((x) => (x.id === u.id ? { ...x, role: makeAdmin ? 'admin' : 'member' } : x))
      );
      toast.success(`${makeAdmin ? 'Promoted to admin' : 'Demoted to member'}.`);
    } catch (e) {
      console.error(e);
      toast.error('Update failed.');
    }
  };

  // Editors get every reviewer power, but no elevated
  // delete/moderation powers - they can only delete their own data, like any
  // member. Assigning the role is admin-only (this panel + Firestore rules).
  const toggleEditor = async (u) => {
    if (u.id === currentUser.uid) {
      toast.error("You can't change your own role.");
      return;
    }
    const makeEditor = u.role !== 'editor';
    const newRole = makeEditor ? 'editor' : 'member';
    if (!window.confirm(`${makeEditor ? 'Make' : 'Remove'} editor: ${u.displayName || u.email}?`))
      return;
    try {
      await updateDoc(doc(db, 'users', u.id), { role: newRole });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role: newRole } : x)));
      toast.success(makeEditor ? 'Promoted to editor.' : 'Editor role removed.');
    } catch (e) {
      console.error(e);
      toast.error('Update failed.');
    }
  };

  const deleteProject = async (p) => {
    if (!window.confirm(`Delete project "${p.projectTitle || p.title}"? This cannot be undone.`))
      return;
    try {
      await deleteDoc(doc(db, 'projects', p.id));
      setProjects((prev) => prev.filter((x) => x.id !== p.id));
      setStats((s) => ({ ...s, projects: s.projects - 1 }));
      toast.success('Project deleted.');
    } catch (e) {
      console.error(e);
      toast.error('Delete failed.');
    }
  };

  const deletePost = async (p) => {
    if (!isAdmin) {
      toast.error('Only admins can delete.');
      return;
    }
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'posts', p.id));
      setPosts((prev) => prev.filter((x) => x.id !== p.id));
      setStats((s) => ({ ...s, posts: s.posts - 1 }));
      toast.success('Post deleted.');
    } catch (e) {
      console.error(e);
      toast.error('Delete failed.');
    }
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
      </div>
    );
  }
  if (!isReviewer) return null;

  const filteredUsers = users.filter((u) => {
    if (userView === 'unverified' && !(u.isCompany && !u.isVerified)) return false;
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return (
      (u.displayName || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)
    );
  });

  const tabs = [
    ['overview', 'Overview'],
    ['users', 'Users'],
    ...(isReviewer ? [['teachers', 'Mentors'], ['summit', 'Summit']] : []),
    ...(isAdmin ? [['sponsors', 'Sponsors']] : []),
    ['moderation', 'Moderation'],
    // Deleting anything is admin-only: editors never see these.
    ...(isAdmin ? [['deletions', 'Deletion Requests'], ['danger', 'Danger Zone']] : []),
  ];

  const StatCard = ({ label, value, sub }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-gray-400 text-xs mt-0.5">{sub}</p>}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-3">
        {only === 'reviews' ? 'Project reviews' : only === 'projects' ? 'Projects' : isAdmin ? 'Admin Dashboard' : 'Editor Dashboard'}
        {myRole && (
          <span
            className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${
              isAdmin ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'
            }`}
          >
            {roleLabel(myRole)}
          </span>
        )}
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {only === 'reviews'
          ? 'Projects submitted by their leads for She Model Tech review.'
          : only === 'projects'
          ? 'Projects to review, extra-time requests, and every active project (view or delete).'
          : 'Important decisions and company requests. Projects, cohorts, and reviews are in the Projects menu.'}
      </p>

      {/* Tabs */}
      {!only && <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-all ${tab === key ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            {label}
          </button>
        ))}
      </div>}

      {loadingData && <div className="py-10 text-center text-gray-400 text-sm">Loading…</div>}

      {/* DANGER ZONE */}
      {tab === 'danger' && isAdmin && (
        <div className="space-y-4 max-w-2xl">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
            <h2 className="text-lg font-bold text-red-700 mb-1">Clear all test data</h2>
            <p className="text-gray-600 text-sm mb-3">
              Permanently deletes all projects, applications, the Proof Wall feed, posts, messages,
              notifications, jobs, badges, and certificates. <strong>User accounts are kept</strong>{' '}
              so people can still log in. All platform functionality stays intact - only the data is
              wiped. This cannot be undone.
            </p>

            <label className="flex items-center gap-2 mb-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={alsoResetUsers}
                onChange={(e) => setAlsoResetUsers(e.target.checked)}
              />
              Also reset every user's badges &amp; certificates (recommended for a clean slate)
            </label>

            <p className="text-gray-600 text-sm mb-2">
              Type <span className="font-mono font-bold">DELETE</span> to confirm:
            </p>
            <input
              value={clearConfirm}
              onChange={(e) => setClearConfirm(e.target.value)}
              placeholder="DELETE"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none mb-3 font-mono"
            />

            <button
              onClick={handleClearAllData}
              disabled={clearing || clearConfirm !== 'DELETE'}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {clearing ? 'Clearing…' : 'Clear all test data'}
            </button>

            {clearProgress && <p className="text-gray-500 text-xs mt-3">{clearProgress}</p>}

            {clearSummary && (
              <div className="mt-4 bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-gray-700 text-sm font-semibold mb-2">Cleared:</p>
                <div className="text-xs text-gray-600 space-y-0.5 max-h-60 overflow-y-auto">
                  {Object.entries(clearSummary).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span>{k}</span>
                      <span className="font-mono">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* REVIEWS */}
      <NoteDialog
        open={!!reviewDialog}
        title={reviewDialog?.mode === 'reject' ? 'Reject this project' : 'Request changes'}
        description={
          reviewDialog?.mode === 'reject'
            ? `"${reviewDialog?.project?.projectTitle || reviewDialog?.project?.title || 'This project'}" will not be approved: no badges can be assigned and it can't be resubmitted. Explain why (optional); the owner and team will see it.`
            : `Tell the team exactly what to fix before resubmitting "${reviewDialog?.project?.projectTitle || reviewDialog?.project?.title || 'this project'}". The owner and team will see this note.`
        }
        placeholder={
          reviewDialog?.mode === 'reject'
            ? 'For example: the repository is empty and the submission does not match the project brief.'
            : 'For example:\n- Make the GitHub repository public\n- Add She Model Tech as a collaborator\n- Add a README describing each team member\'s part'
        }
        required={reviewDialog?.mode === 'changes'}
        confirmLabel={reviewDialog?.mode === 'reject' ? 'Reject project' : 'Send back for changes'}
        tone={reviewDialog?.mode === 'reject' ? 'danger' : 'primary'}
        busy={!!reviewDialog && actingId === reviewDialog.project.id}
        onCancel={() => setReviewDialog(null)}
        onConfirm={(note) =>
          reviewDialog.mode === 'reject' ? doReject(reviewDialog.project, note) : doRequestChanges(reviewDialog.project, note)
        }
      />

      {(tab === 'reviews' || only === 'projects') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-900 font-bold">Projects to review</h3>
              <p className="text-gray-500 text-sm">Projects submitted by their leads for completion review.</p>
            </div>
            <button
              onClick={loadReviews}
              className="text-pink-600 text-sm font-semibold hover:underline"
            >
              Refresh
            </button>
          </div>
          {loadingReviews ? (
            <p className="text-gray-400 text-sm py-6 text-center">Loading review queue…</p>
          ) : reviewProjects.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">No projects awaiting review.</p>
          ) : (
            reviewProjects.map((p) => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900">
                      {p.projectTitle || p.title || 'Untitled project'}
                      {p.isPaid && (
                        <span className="ml-2 align-middle text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                          PAID{p.payPerPerson ? ` · $${p.payPerPerson}/person` : ''}
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Submitted by {p.reviewSubmittedBy || 'unknown'}
                    </p>
                  </div>
                  <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-100 text-gray-900">
                    Awaiting review
                  </span>
                </div>

                <div className="space-y-1.5 mb-4 text-sm">
                  <p className="text-gray-600">
                    Submission link:{' '}
                    {p.reviewSubmissionUrl ? (
                      <a
                        href={p.reviewSubmissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:underline break-all"
                      >
                        {p.reviewSubmissionUrl}
                      </a>
                    ) : (
                      <span className="text-red-500">none</span>
                    )}
                  </p>
                  <p className="text-gray-600">
                    Workspace:{' '}
                    {p.reviewWorkspaceUrl ? (
                      <a
                        href={p.reviewWorkspaceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:underline break-all"
                      >
                        {p.reviewWorkspaceUrl}
                      </a>
                    ) : (
                      <span className="text-gray-400">n/a</span>
                    )}
                  </p>
                </div>


                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => doApprove(p)}
                    disabled={actingId === p.id}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
                  >
                    {actingId === p.id ? '…' : 'Approve'}
                  </button>
                  <button
                    onClick={() => setReviewDialog({ project: p, mode: 'changes' })}
                    disabled={actingId === p.id}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
                  >
                    Request changes
                  </button>
                  <button
                    onClick={() => setReviewDialog({ project: p, mode: 'reject' })}
                    disabled={actingId === p.id}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-semibold rounded-lg disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* OVERVIEW */}
      {tierFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="tier-h">
          <div className="w-full max-w-md bg-white rounded-2xl p-5">
            <h2 id="tier-h" className="text-lg font-bold text-gray-900">Set tier: {tierFor.companyProfile?.companyName || tierFor.displayName || tierFor.email}</h2>
            <label className="block text-sm font-semibold text-gray-800 mt-4 mb-1" htmlFor="tier-sel">Tier</label>
            <select id="tier-sel" value={tierDraft.tier} onChange={(e) => setTierDraft((d) => ({ ...d, tier: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">None (free company)</option>
              {TIERS.map((t) => <option key={t} value={t}>{TIER_LABEL[t]}</option>)}
            </select>
            {tierDraft.tier && (
              <>
                <label className="block text-sm font-semibold text-gray-800 mt-3 mb-1" htmlFor="tier-until">Until <span className="font-normal text-gray-500">(optional; leave empty for no end date)</span></label>
                <input id="tier-until" type="date" min={new Date().toISOString().slice(0, 10)} value={tierDraft.until} onChange={(e) => setTierDraft((d) => ({ ...d, until: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </>
            )}
            <p className="text-xs text-gray-500 mt-3">Tiers take effect when Company tiers is switched on in Launch settings. You can set them any time.</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setTierFor(null)} className="text-sm font-semibold text-gray-600 px-4 py-2">Cancel</button>
              <button onClick={saveTier} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}
      {!loadingData && tab === 'overview' && isAdmin && <LaunchSettings currentUser={currentUser} />}
      {/* Sponsors tab (admins): sponsor thank-yous and recorded gifts. */}
      {!loadingData && tab === 'sponsors' && isAdmin && (
        <div>
          <SponsorsAdmin />
          <GiftsAdmin />
        </div>
      )}
      {!loadingData && tab === 'overview' && (
        <AttentionBoard isAdmin={isAdmin} onTab={(t, v) => { setUserView(v || 'all'); setTab(t); }} />
      )}
      {!loadingData && tab === 'overview' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard label="Total Users" value={stats.users} />
          <StatCard
            label="Total Projects"
            value={stats.projects}
            sub={`${stats.completed} completed`}
          />
          <StatCard label="Awaiting Lead" value={stats.leadRecruitment} sub="lead recruitment" />
          <StatCard label="Community Posts" value={stats.posts} sub="recent (last 50)" />
          <StatCard label="Badges Issued" value={stats.badges} />
          <StatCard label="Admins" value={users.filter((u) => u.role === 'admin').length} />
          <StatCard label="Editors" value={users.filter((u) => u.role === 'editor').length} />
        </div>
      )}

      {/* PROJECTS */}
      {!loadingData && tab === 'projects' && smtPaid.length > 0 && (
        <div className="mb-6">
          <h3 className="text-gray-900 font-bold mb-2">She Model Tech paid projects</h3>
          {smtPaid.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg p-3 mb-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">{c.title}</p>
                <p className="text-xs text-gray-500">{c.status} · {c.waiting} application{c.waiting === 1 ? '' : 's'} waiting</p>
              </div>
              <Link to={`/projects/owner-dashboard#project-${c.id}`} className="text-xs font-semibold bg-pink-600 text-white px-3 py-1.5 rounded-lg">Review applicants</Link>
            </div>
          ))}
        </div>
      )}

      {!loadingData && tab === 'projects' && projects.some((p) => p.extensionRequest?.status === 'pending') && (
        <div className="mb-6">
          <h3 className="text-gray-900 font-bold mb-2">Extra time requested by cohort leads</h3>
          {projects.filter((p) => p.extensionRequest?.status === 'pending').map((p) => (
            <div key={p.id} className="bg-white border border-purple-200 rounded-xl p-4 mb-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{p.projectTitle}</p>
                  <p className="text-xs text-gray-500">
                    Deadline {p.endDate} · asking for {p.extensionRequest.days} more days
                  </p>
                  <p className="text-sm text-gray-700 mt-1">{p.extensionRequest.reason}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      const d = new Date(`${p.endDate}T12:00:00`);
                      d.setDate(d.getDate() + Number(p.extensionRequest.days || 7));
                      const newEnd = d.toISOString().slice(0, 10);
                      const data = {
                        endDate: newEnd,
                        extensionDays: (p.extensionDays || 0) + Number(p.extensionRequest.days || 7),
                        extensionRequest: { ...p.extensionRequest, status: 'approved', decidedBy: currentUser.email },
                      };
                      try {
                        await updateDoc(doc(db, 'projects', p.id), data);
                        setProjects((xs) => xs.map((x) => (x.id === p.id ? { ...x, ...data } : x)));
                        if (p.submitterId) notifyMember(p.submitterId, { type: 'extension_decision', title: 'Extra time approved', body: `"${p.projectTitle}" now ends on ${newEnd}.`, link: `/projects/${p.id}/workspace` });
                        toast.success(`Approved. New deadline ${newEnd}.`);
                      } catch (e) {
                        toast.error(friendlyError(e, 'Could not approve it.'));
                      }
                    }}
                    className="text-xs font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={async () => {
                      const data = { extensionRequest: { ...p.extensionRequest, status: 'declined', decidedBy: currentUser.email } };
                      try {
                        await updateDoc(doc(db, 'projects', p.id), data);
                        setProjects((xs) => xs.map((x) => (x.id === p.id ? { ...x, ...data } : x)));
                        if (p.submitterId) notifyMember(p.submitterId, { type: 'extension_decision', title: 'Extra time not approved', body: `"${p.projectTitle}" keeps its deadline of ${p.endDate}. Message us if you need to talk it through.`, link: `/projects/${p.id}/workspace` });
                        toast.success('Declined.');
                      } catch (e) {
                        toast.error(friendlyError(e, 'Could not decline it.'));
                      }
                    }}
                    className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loadingData && tab === 'projects' && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h3 className="text-gray-900 font-bold">Active projects ({projects.filter((p) => p.status !== 'completed').length})</h3>
            <Link to="/project-vault" className="text-xs font-semibold text-pink-700 hover:underline">
              {projects.filter((p) => p.status === 'completed').length} completed projects are in the Project Vault
            </Link>
          </div>
          {projects.filter((p) => p.status !== 'completed').length === 0 ? (
            <p className="text-gray-400 text-sm">No active projects.</p>
          ) : (
            projects.filter((p) => p.status !== 'completed').map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg p-3"
              >
                <div className="min-w-0">
                  <p className="text-gray-900 text-sm font-medium truncate">
                    {p.projectTitle || p.title || 'Untitled'}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {p.isGenerated ? 'Auto-generated' : `by ${p.submitterName || 'Owner'}`} ·{' '}
                    {fmtDate(p.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-full ${statusStyle[p.status] || 'bg-gray-100 text-gray-600'}`}
                  >
                    {(p.status || 'unknown').replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="text-pink-600 text-xs font-semibold"
                  >
                    View
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => deleteProject(p)}
                      className="text-red-500 text-xs font-semibold"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!loadingData && tab === 'deletions' && isAdmin && (
        <div className="space-y-2">
          {deletionReqs.length === 0 ? (
            <p className="text-gray-400 text-sm">No pending deletion requests.</p>
          ) : (
            deletionReqs.map((r) => (
              <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-gray-900 text-sm font-medium truncate">
                      {r.projectTitle || 'Untitled project'}
                    </p>
                    <p className="text-gray-400 text-xs">Requested by {r.ownerEmail || 'owner'}</p>
                    <p className="text-gray-600 text-xs mt-1">
                      <span className="font-semibold">Reason:</span> {r.reason || '(none)'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => navigate(`/projects/${r.projectId}`)}
                      className="text-pink-600 text-xs font-semibold"
                    >
                      View
                    </button>
                    <button
                      onClick={() => declineDeletion(r)}
                      className="text-gray-500 text-xs font-semibold"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => approveDeletion(r)}
                      className="text-red-500 text-xs font-semibold"
                    >
                      Approve &amp; Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* USERS */}
      {!loadingData && tab === 'users' && (
        <div>
          <input
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full mb-3 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none"
          />
          <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Show">
            {[['all', `Everyone (${users.length})`], ['unverified', `Companies to verify (${users.filter((u) => u.isCompany && !u.isVerified).length})`]].map(([v, l]) => (
              <button key={v} type="button" aria-pressed={userView === v} onClick={() => setUserView(v)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full ${userView === v ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{l}</button>
            ))}
          </div>
          {userView === 'unverified' && filteredUsers.length === 0 && (
            <p className="text-sm text-gray-500 mb-3">No companies are waiting for verification.</p>
          )}
          <div className="space-y-2">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg p-3"
              >
                <div className="min-w-0">
                  <p className="text-gray-900 text-sm font-medium truncate">
                    <Link
                      to={`/profile/${encodeURIComponent(u.email || u.id)}`}
                      className="hover:text-pink-700 hover:underline"
                      title="Open profile"
                    >
                      {u.companyProfile?.companyName || u.displayName || 'No name'}
                    </Link>
                    {u.role === 'admin' && (
                      <span className="ml-2 text-[10px] font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded">
                        ADMIN
                      </span>
                    )}
                    {u.role === 'editor' && (
                      <span className="ml-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        EDITOR
                      </span>
                    )}
                    {u.isCompany && (
                      <span className="ml-2 text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                        COMPANY
                      </span>
                    )}
                    {u.isTeacher && (
                      <span className="ml-2 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        MENTOR
                      </span>
                    )}
                    {u.isCompany && companyTier(u) && (
                      <span className="ml-2 text-[10px] font-bold text-pink-800 bg-pink-50 px-1.5 py-0.5 rounded uppercase">
                        {TIER_LABEL[companyTier(u)]}
                      </span>
                    )}
                    {u.isCompany && u.isVerified && (
                      <span className="ml-2 text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                        VERIFIED
                      </span>
                    )}
                    {u.isCompany && !u.isVerified && (
                      <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        u.companyProfile?.verificationStatus === 'info_requested'
                          ? 'text-amber-700 bg-amber-50'
                          : u.companyProfile?.verificationStatus === 'details_updated'
                          ? 'text-sky-700 bg-sky-50'
                          : 'text-gray-600 bg-gray-100'
                      }`}>
                        {u.companyProfile?.verificationStatus === 'info_requested'
                          ? 'INFO REQUESTED'
                          : u.companyProfile?.verificationStatus === 'details_updated'
                          ? 'DETAILS UPDATED'
                          : 'PENDING VERIFICATION'}
                      </span>
                    )}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {u.email} · {u.country || 'no country'} · joined {fmtDate(u.createdAt)}
                  </p>
                </div>
                <div className="flex-shrink-0 flex flex-wrap items-center justify-end gap-2">
                  {u.id !== currentUser?.uid && (
                    <button
                      onClick={() => navigate(`/messages?to=${u.id}`)}
                      title={`Message ${u.companyProfile?.companyName || u.displayName || 'this member'}`}
                      aria-label={`Message ${u.companyProfile?.companyName || u.displayName || 'this member'}`}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-pink-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                  )}
                  {isAdmin && u.isCompany && (
                    <button
                      onClick={() => openTier(u)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-pink-600 text-white hover:bg-pink-700"
                    >
                      {companyTier(u) ? `Tier: ${TIER_LABEL[companyTier(u)]}` : 'Set tier'}
                    </button>
                  )}
                  {isAdmin && u.isCompany && !u.isVerified && (
                    <button
                      onClick={() => requestCompanyInfo(u)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200"
                    >
                      Request info
                    </button>
                  )}
                  {isAdmin && u.isCompany && (
                    <button
                      onClick={() => toggleCompanyVerified(u)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${u.isVerified ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                    >
                      {u.isVerified ? 'Unverify company' : 'Verify company'}
                    </button>
                  )}
                  {isAdmin && !u.isCompany && (
                    <button
                      onClick={() => toggleTeacher(u)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${u.isTeacher ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                    >
                      {u.isTeacher ? 'Remove mentor' : 'Make mentor'}
                    </button>
                  )}
                  {isAdmin && (
                  <button
                    onClick={() => toggleEditor(u)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${u.role === 'editor' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                  >
                    {u.role === 'editor' ? 'Remove editor' : 'Make editor'}
                  </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => toggleAdmin(u)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${u.role === 'admin' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-pink-600 text-white hover:bg-pink-700'}`}
                    >
                      {u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && <p className="text-gray-400 text-sm">No users match.</p>}
          </div>
        </div>
      )}

      {/* GENERATE */}

      {/* SEED (dummy Proof Wall content) */}

      {/* TEACHERS */}
      {!loadingData && tab === 'teachers' && isReviewer && (
        <div className="space-y-6">
          <NoteDialog
            open={!!declineApp}
            title="Decline this application"
            description={declineApp ? `Optional note to ${declineApp.applicantName}. They'll see it on the Become a mentor page and can apply again.` : ''}
            placeholder="For example: we'd love to see a sample lesson or a link to a talk you've given."
            confirmLabel="Decline application"
            busy={deciding}
            onCancel={() => setDeclineApp(null)}
            onConfirm={(note) => decideTeacher(declineApp, false, note)}
          />
          <NoteDialog
            open={!!letterDialog}
            title={letterDialog?.status === 'sent' ? 'Mark letter as sent' : 'Decline letter request'}
            description={
              letterDialog
                ? letterDialog.status === 'sent'
                  ? `Attach the finished ${(LETTER_TYPES[letterDialog.req.type] || 'letter').toLowerCase()} for ${letterDialog.req.name} to download, or confirm you've emailed it to ${letterDialog.req.email}. You can add a note too.`
                  : `Let ${letterDialog.req.name} know why (optional).`
                : ''
            }
            placeholder={letterDialog?.status === 'sent' ? 'For example: sent to your email; the PDF is also attached.' : ''}
            confirmLabel={letterDialog?.status === 'sent' ? 'Mark as sent' : 'Decline request'}
            tone={letterDialog?.status === 'sent' ? 'primary' : 'danger'}
            busy={letterBusy}
            onCancel={() => setLetterDialog(null)}
            fileLabel={letterDialog?.status === 'sent' ? 'Attach the finished letter (optional)' : ''}
            fileAccept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            fileHelp="PDF or Word, up to 3 MB. The mentor can download it from the Mentor Hub."
            onConfirm={(note, file) => decideLetter(letterDialog.req, letterDialog.status, note, file)}
          />
          <div>
            <h3 className="text-gray-900 font-bold mb-2">Mentor letter requests</h3>
            {letterReqs === null ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : letterReqs.filter((r) => r.status === 'pending').length === 0 ? (
              <p className="text-gray-400 text-sm">No letter requests waiting.</p>
            ) : (
              <div className="space-y-3">
                {letterReqs
                  .filter((r) => r.status === 'pending')
                  .map((r) => (
                    <div key={r.id} className="bg-white border border-indigo-200 rounded-xl p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-gray-900 font-semibold">
                            {LETTER_TYPES[r.type]} <span className="text-gray-500 font-normal">for {r.name}</span>
                          </p>
                          <p className="text-gray-400 text-xs">
                            {r.email}
                            {r.recipient ? ` · to ${r.recipient}` : ''}
                            {r.deadline ? ` · needed by ${r.deadline}` : ''}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setLetterDialog({ req: r, status: 'sent' })} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                            Mark as sent
                          </button>
                          <button onClick={() => setLetterDialog({ req: r, status: 'declined' })} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                            Decline
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-800 mt-2"><strong>Purpose:</strong> {r.purpose}</p>
                      {/* The mentor's draft letter */}
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        {r.attachment?.url && (
                          <a href={r.attachment.url} target="_blank" rel="noopener noreferrer"
                            className="font-semibold text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50">
                            Open attached draft ({r.attachment.name})
                          </a>
                        )}
                        {r.emailingDraft && (
                          <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded">Mentor will email the draft</span>
                        )}
                        {!r.draftText && !r.attachment && !r.emailingDraft && <span className="text-gray-400">No draft provided</span>}
                      </div>
                      {r.draftText && (
                        <details className="mt-2">
                          <summary className="text-xs font-semibold text-gray-700 cursor-pointer">
                            Pasted draft ({r.draftText.split(/\s+/).filter(Boolean).length} words)
                          </summary>
                          <div className="mt-2 relative">
                            <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-80 overflow-y-auto font-sans">{r.draftText}</pre>
                            <button
                              onClick={() => navigator.clipboard.writeText(r.draftText).then(() => toast.success('Draft copied.')).catch(() => {})}
                              className="absolute top-2 right-2 text-xs font-semibold bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-50"
                            >
                              Copy
                            </button>
                          </div>
                        </details>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-gray-900 font-bold mb-2">Mentor courses awaiting a decision</h3>
            {pendingCourses === null ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : pendingCourses.length === 0 ? (
              <p className="text-gray-400 text-sm">No mentor courses waiting for approval.</p>
            ) : (
              <div className="space-y-2">
                {pendingCourses.map((c) => (
                  <div key={c.id} className="bg-white border border-amber-200 rounded-lg p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-gray-900 text-sm font-medium truncate">
                        {c.title}{' '}
                        {c.removalRequest?.status === 'pending' ? (
                          <span className="text-red-700 text-xs font-semibold">(removal requested)</span>
                        ) : (
                          c.published && <span className="text-amber-700 text-xs font-semibold">(update to a published course)</span>
                        )}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        By {c.review?.submittedBy?.name || c.createdBy?.name || 'a mentor'}
                        {c.review?.submittedAt ? ` · submitted ${new Date(c.review.submittedAt).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                    <Link to={`/teacher/${c.id}`} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-pink-600 text-white hover:bg-pink-700">
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-gray-900 font-bold mb-2">All mentor courses</h3>
            {allCourses === null ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : (() => {
              const mentorActive = (c) => users.some((u) => u.id === c.createdBy?.uid && (u.isTeacher || ['admin', 'editor'].includes(u.role)));
              const stateOf = (c) => (c.published ? 'published' : reviewStatus(c) === 'pending' ? 'pending' : 'draft');
              const counts = {
                all: allCourses.length,
                published: allCourses.filter((c) => c.published).length,
                pending: allCourses.filter((c) => stateOf(c) === 'pending').length,
                draft: allCourses.filter((c) => stateOf(c) === 'draft').length,
                orphaned: allCourses.filter((c) => !mentorActive(c)).length,
              };
              const q = courseQuery.trim().toLowerCase();
              const rows = allCourses
                .filter((c) => courseView === 'all' || (courseView === 'orphaned' ? !mentorActive(c) : stateOf(c) === courseView))
                .filter((c) => !q || `${c.title} ${c.createdBy?.name || ''}`.toLowerCase().includes(q));
              return (
                <>
                  <div className="flex flex-wrap gap-2 mb-2" role="group" aria-label="Show courses">
                    {[['all', 'All'], ['published', 'Published'], ['pending', 'Awaiting review'], ['draft', 'Drafts'], ['orphaned', 'Mentor no longer active']].map(([v, l]) => (
                      <button key={v} type="button" aria-pressed={courseView === v} onClick={() => setCourseView(v)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full ${courseView === v ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        {l} ({counts[v]})
                      </button>
                    ))}
                  </div>
                  <input value={courseQuery} onChange={(e) => setCourseQuery(e.target.value)} placeholder="Search by course or mentor"
                    className="w-full mb-3 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-pink-500 focus:outline-none" />
                  {rows.length === 0 ? (
                    <p className="text-gray-400 text-sm">No courses match.</p>
                  ) : (
                    <div className="space-y-2">
                      {rows.map((c) => (
                        <div key={c.id} className="bg-white border border-gray-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-gray-900 text-sm font-medium truncate">{c.title}</p>
                            <p className="text-gray-400 text-xs">
                              {c.published ? 'Published' : stateOf(c) === 'pending' ? 'Awaiting review' : 'Draft'} · by {c.createdBy?.name || 'unknown'}
                              {!mentorActive(c) && <span className="text-red-600 font-semibold"> · mentor no longer active</span>}
                              {c.removalRequest?.status === 'pending' && <span className="text-red-700 font-semibold"> · deletion requested</span>}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/teacher/${c.id}`} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50">Open</Link>
                            {isAdmin && (
                              <button onClick={() => deleteCourseDirect(c)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100">Delete</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
          {/* Applications and mentor roles are admin-only. */}
          {isAdmin && (<>
          <div>
            <h3 className="text-gray-900 font-bold mb-2">Mentor applications</h3>
            {teacherApps === null ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : teacherApps.filter((a) => a.status === 'pending').length === 0 ? (
              <p className="text-gray-400 text-sm">No pending applications.</p>
            ) : (
              <div className="space-y-3">
                {teacherApps
                  .filter((a) => a.status === 'pending')
                  .map((a) => (
                    <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-gray-900 font-semibold">{a.applicantName}</p>
                          <p className="text-gray-400 text-xs">{a.applicantEmail} · applied {fmtDate(a.createdAt)}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Tracks: {(a.tracks || []).map((t) => (TEACH_TRACKS.find(([id]) => id === t) || [t, t])[1]).join(', ') || 'none'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => decideTeacher(a, true)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                            Approve
                          </button>
                          <button onClick={() => setDeclineApp(a)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                            Decline
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-800 mt-3"><strong>Experience:</strong> {a.experience}</p>
                      <p className="text-sm text-gray-800 mt-1"><strong>Why:</strong> {a.motivation}</p>
                      {a.links && <p className="text-sm text-gray-800 mt-1 break-words"><strong>Links:</strong> {a.links}</p>}
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-gray-900 font-bold mb-2">Current mentors</h3>
            {users.filter((u) => u.isTeacher).length === 0 ? (
              <p className="text-gray-400 text-sm">No mentors yet. Approve an application, or use "Make mentor" in Users.</p>
            ) : (
              <div className="space-y-2">
                {users
                  .filter((u) => u.isTeacher)
                  .map((u) => (
                    <div key={u.id} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-gray-900 text-sm font-medium truncate">{u.displayName || u.email}</p>
                        <p className="text-gray-400 text-xs truncate">{u.email}</p>
                      </div>
                      <button onClick={() => toggleTeacher(u)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
                        Remove mentor
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
          </>)}
        </div>
      )}

      {!loadingData && tab === 'summit' && isReviewer && <SummitTab />}

      {/* MODERATION */}
      {!loadingData && tab === 'moderation' && (
        <div className="space-y-2">
          <p className="text-gray-500 text-sm mb-2">
            Recent community posts (latest 50). Delete anything that violates guidelines.
          </p>
          {posts.length === 0 ? (
            <p className="text-gray-400 text-sm">No posts.</p>
          ) : (
            posts.map((p) => (
              <div
                key={p.id}
                className="flex items-start justify-between gap-3 bg-white border border-gray-200 rounded-lg p-3"
              >
                <div className="min-w-0">
                  <p className="text-gray-900 text-xs font-semibold">
                    {p.authorName || 'Unknown'}{' '}
                    <span className="text-gray-400 font-normal">· {fmtDate(p.createdAt)}</span>
                  </p>
                  {p.title && <p className="text-gray-800 text-sm font-medium mt-0.5">{p.title}</p>}
                  <p className="text-gray-600 text-sm mt-0.5 line-clamp-3">
                    {p.content || '(no text)'}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => deletePost(p)}
                    className="flex-shrink-0 text-red-500 text-xs font-semibold"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
