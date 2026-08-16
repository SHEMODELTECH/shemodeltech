// src/Pages/admin/AdminPanel.jsx - Platform admin dashboard (admin-only)
// Tabs: Overview (stats) · Projects · Users · Generate · Moderation
// Gated by users/{uid}.role. Admins get everything; editors get the
// reviewer surfaces (cohorts, lead applications, project review) but not
// delete/role management.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
 collection, getDocs, doc, getDoc, updateDoc, deleteDoc, addDoc,
 query, orderBy, limit, serverTimestamp, where,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { isReviewerRole, isAdminRole, roleLabel } from '../../utils/permissions';
import { toast } from 'react-toastify';
import { generateProject } from '../../utils/projectGenerator';
import { getRandomTemplate, TEMPLATE_COUNT } from '../../utils/projectTemplates';
import { seedDummyActivity, deleteDummyActivity, countDummyActivity } from '../../utils/activityFeed';
import { REVIEW_STATUS, approveProjectReview, requestChanges, rejectProjectReview, getProjectMemberEmails } from '../../utils/projectReview';
import { clearAllTestData } from '../../utils/adminDataReset';
import { batchGenerateProjects } from '../../utils/batchGenerateProjects';
import { getReviewQueue, reviewContribution, getAllContributions, adminEditContribution, adminDeleteContribution } from '../../utils/foundationsContributions';
import { sendPush } from '../../utils/pushNotifications';

const fmtDate = (ts) => {
 try {
 const d = ts?.toDate ? ts.toDate() : (ts ? new Date(ts) : null);
 return d ? d.toLocaleDateString() : '-';
 } catch { return '-'; }
};

const statusStyle = {
 lead_recruitment: 'bg-amber-100 text-amber-700',
 setup: 'bg-purple-100 text-purple-700',
 active: 'bg-pink-100 text-pink-700',
 completed: 'bg-green-100 text-green-700',
};

const AdminPanel = () => {
 const { currentUser } = useAuth();
 const navigate = useNavigate();
 const [checking, setChecking] = useState(true);
 const [isAdmin, setIsAdmin] = useState(false); // full powers: delete, roles
 const [isReviewer, setIsReviewer] = useState(false); // admin OR editor: review surfaces
 const [myRole, setMyRole] = useState(null); // shown in the header badge
 const [tab, setTab] = useState('overview');

 const [stats, setStats] = useState({ users: 0, projects: 0, posts: 0, badges: 0, completed: 0, leadRecruitment: 0 });
 const [users, setUsers] = useState([]);
 const [projects, setProjects] = useState([]);
 const [posts, setPosts] = useState([]);
 const [loadingData, setLoadingData] = useState(true);

 // Generate tab
 const [generating, setGenerating] = useState(false);
 const [publishing, setPublishing] = useState(false);
 const [draft, setDraft] = useState(null);
 const [useAI, setUseAI] = useState(false); // default: free template library
 const [seeding, setSeeding] = useState(false);
 const [dummyCount, setDummyCount] = useState(null);

 const [userSearch, setUserSearch] = useState('');

 // --- Reviews tab ---
 const [reviewProjects, setReviewProjects] = useState([]);
 const [deletionReqs, setDeletionReqs] = useState([]);
 const [loadingReviews, setLoadingReviews] = useState(false);
 const [feedbackById, setFeedbackById] = useState({});
 const [actingId, setActingId] = useState(null);

 // --- Danger Zone: clear test data ---
 const [clearing, setClearing] = useState(false);
 const [batchCount, setBatchCount] = useState(24);
 const [batchRunning, setBatchRunning] = useState(false);
 const [fQueue, setFQueue] = useState([]);
 const [fLoading, setFLoading] = useState(false);
 const [fAll, setFAll] = useState([]);
 const [fEditing, setFEditing] = useState(null); // contribution id being edited
 const [fEditForm, setFEditForm] = useState({ title: '', url: '', description: '' });

 const loadFQueue = useCallback(async () => {
 setFLoading(true);
 try { setFQueue(await getReviewQueue()); } catch (_) {}
 try { setFAll(await getAllContributions()); } catch (_) {}
 setFLoading(false);
 }, []);

 const startEdit = (c) => {
 setFEditing(c.id);
 setFEditForm({ title: c.title || '', url: c.url || '', description: c.description || '' });
 };

 const saveEdit = async (id) => {
 try {
 await adminEditContribution(id, fEditForm);
 toast.success('Lesson updated.');
 setFEditing(null);
 loadFQueue();
 } catch (e) { toast.error('Update failed: ' + e.message); }
 };

 const removeContribution = async (id) => {
 if (!window.confirm('Permanently remove this lesson? This cannot be undone.')) return;
 try {
 await adminDeleteContribution(id);
 toast.success('Lesson removed.');
 loadFQueue();
 } catch (e) { toast.error('Remove failed: ' + e.message); }
 };

 const handleReview = async (id, action) => {
 let note = '';
 if (action === 'changes') {
 note = window.prompt('What needs to change? (the contributor can revise and resubmit)') || '';
 if (!note) return;
 }
 if (action === 'reject' && !window.confirm('Reject this contribution? The author cannot resubmit a rejected item.')) return;
 try {
 await reviewContribution(id, action, note);
 // Notify the author of the outcome.
 const item = fQueue.find(q => q.id === id);
 if (item?.authorId) {
 const msg = action === 'approve' ? `Your Foundations lesson "${item.title}" was approved and is now live.`
 : action === 'changes' ? `Your Foundations lesson "${item.title}" needs changes: ${note}`
 : `Your Foundations lesson "${item.title}" was not accepted.`;
 try { await addDoc(collection(db, 'notifications'), { userId: item.authorId, type: action === 'approve' ? 'contribution_approved' : 'contribution_review', message: msg, isRead: false, createdAt: serverTimestamp() }); } catch (_) {}
 }
 toast.success(action === 'approve' ? 'Approved and published.' : action === 'changes' ? 'Sent back for changes.' : 'Rejected.');
 loadFQueue();
 } catch (e) { toast.error('Action failed: ' + e.message); }
 };

 const runBatchGenerate = async () => {
 const n = parseInt(batchCount, 10) || 24;
 if (!window.confirm(`Publish ${n} starter projects to the board? They will be open for lead recruitment.`)) return;
 setBatchRunning(true);
 try {
 const { created, errors } = await batchGenerateProjects(n);
 if (created > 0) toast.success(`Published ${created} project${created !== 1 ? 's' : ''}${errors ? ` (${errors} failed)` : ''}.`);
 else toast.error('No projects were created. Check your permissions and rules.');
 } catch (e) {
 toast.error('Batch generation failed: ' + e.message);
 }
 setBatchRunning(false);
 };
 const [clearConfirm, setClearConfirm] = useState('');
 const [alsoResetUsers, setAlsoResetUsers] = useState(true);
 const [clearProgress, setClearProgress] = useState('');
 const [clearSummary, setClearSummary] = useState(null);

 const handleClearAllData = async () => {
 if (clearConfirm !== 'DELETE') {
 toast.error('Type DELETE to confirm.');
 return;
 }
 if (!window.confirm('This permanently deletes ALL projects, applications, posts, messages, notifications, badges and certificates. User accounts are kept. This cannot be undone. Continue?')) {
 return;
 }
 setClearing(true);
 setClearSummary(null);
 setClearProgress('Starting…');
 try {
 const summary = await clearAllTestData(
 { resetUsers: alsoResetUsers },
 (coll, count) => setClearProgress(`Clearing ${coll}… (${count})`)
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
 const snap = await getDocs(query(collection(db, 'projects'), where('reviewStatus', '==', REVIEW_STATUS.SUBMITTED)));
 const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
 rows.sort((a, b) => (b.reviewSubmittedAt?.seconds || 0) - (a.reviewSubmittedAt?.seconds || 0));
 setReviewProjects(rows);
 } catch (e) {
 console.error('loadReviews failed:', e);
 toast.error('Could not load review queue.');
 }
 setLoadingReviews(false);
 }, []);

 useEffect(() => { if (tab === 'reviews' && isAdmin) loadReviews(); }, [tab, isAdmin, loadReviews]);

 useEffect(() => {
 if (tab === 'deletions' && isAdmin) {
 getDocs(collection(db, 'deletionRequests'))
 .then(snap => setDeletionReqs(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(r => r.status === 'pending')))
 .catch(() => setDeletionReqs([]));
 }
 }, [tab, isAdmin]);

 const approveDeletion = async (req) => {
 if (!window.confirm(`Delete "${req.projectTitle}"? This permanently removes the project.`)) return;
 try {
 await deleteDoc(doc(db, 'projects', req.projectId));
 await updateDoc(doc(db, 'deletionRequests', req.id), { status: 'approved', resolvedAt: new Date() });
 setDeletionReqs(prev => prev.filter(r => r.id !== req.id));
 } catch (e) { console.error('approveDeletion', e); alert('Could not delete the project.'); }
 };

 const declineDeletion = async (req) => {
 try {
 await updateDoc(doc(db, 'deletionRequests', req.id), { status: 'declined', resolvedAt: new Date() });
 await updateDoc(doc(db, 'projects', req.projectId), { deletionRequested: false }).catch(() => {});
 setDeletionReqs(prev => prev.filter(r => r.id !== req.id));
 } catch (e) { console.error('declineDeletion', e); alert('Could not update the request.'); }
 };
 useEffect(() => { if (tab === 'foundations' && isAdmin) loadFQueue(); }, [tab, isAdmin, loadFQueue]);

 // Collect owner + approved member uids for a project (for push notifications).
 const getProjectRecipientUids = async (project) => {
 const uids = new Set();
 if (project.submitterId) uids.add(project.submitterId);
 (project.members || []).forEach(m => { if (m) uids.add(m); });
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
 setReviewProjects(prev => prev.filter(p => p.id !== project.id));
 } catch (e) { toast.error('Approve failed: ' + e.message); }
 setActingId(null);
 };

 const doRequestChanges = async (project) => {
 const fb = (feedbackById[project.id] || '').trim();
 if (!fb) { toast.error('Add a note describing the changes needed.'); return; }
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
 setReviewProjects(prev => prev.filter(p => p.id !== project.id));
 } catch (e) { toast.error('Failed: ' + e.message); }
 setActingId(null);
 };

 const doReject = async (project) => {
 if (!window.confirm('Reject this project? Badges cannot be assigned and it cannot be re-submitted.')) return;
 const fb = (feedbackById[project.id] || '').trim();
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
 setReviewProjects(prev => prev.filter(p => p.id !== project.id));
 } catch (e) { toast.error('Reject failed: ' + e.message); }
 setActingId(null);
 };

 // --- Admin gate ---
 useEffect(() => {
 if (!currentUser) { navigate('/login', { replace: true }); return; }
 getDoc(doc(db, 'users', currentUser.uid))
 .then(snap => {
 const role = snap.exists() ? snap.data().role : null;
 if (!isReviewerRole(role)) {
 toast.error('Admins and editors only');
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

 // --- Load all data once admin-confirmed ---
 const loadData = useCallback(async () => {
 setLoadingData(true);
 try {
 const [usersSnap, projectsSnap, postsSnap] = await Promise.all([
 getDocs(collection(db, 'users')),
 getDocs(collection(db, 'projects')),
 getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50))).catch(() => getDocs(collection(db, 'posts'))),
 ]);

 const userList = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
 const projectList = projectsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
 const postList = postsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

 let badgeTotal = 0;
 userList.forEach(u => { badgeTotal += Array.isArray(u.badges) ? u.badges.length : 0; });

 setUsers(userList);
 setProjects(projectList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
 setPosts(postList);
 setStats({
 users: userList.length,
 projects: projectList.length,
 posts: postList.length,
 badges: badgeTotal,
 completed: projectList.filter(p => p.status === 'completed').length,
 leadRecruitment: projectList.filter(p => p.status === 'lead_recruitment').length,
 });
 } catch (e) {
 console.error(e);
 toast.error('Failed to load admin data.');
 }
 setLoadingData(false);
 }, []);

 useEffect(() => { if (isAdmin) loadData(); }, [isAdmin, loadData]);

 const refreshDummyCount = useCallback(async () => {
 setDummyCount(await countDummyActivity());
 }, []);

 useEffect(() => { if (tab === 'seed') refreshDummyCount(); }, [tab, refreshDummyCount]);

 // --- Actions ---
 const toggleAdmin = async (u) => {
 if (!isAdmin) { toast.error('Only admins can change roles.'); return; }
 const makeAdmin = u.role !== 'admin';
 if (u.id === currentUser.uid && !makeAdmin) {
 toast.error("You can't remove your own admin access.");
 return;
 }
 if (!window.confirm(`${makeAdmin ? 'Promote' : 'Demote'} ${u.displayName || u.email}?`)) return;
 try {
 await updateDoc(doc(db, 'users', u.id), { role: makeAdmin ? 'admin' : 'member' });
 setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: makeAdmin ? 'admin' : 'member' } : x));
 toast.success(`${makeAdmin ? 'Promoted to admin' : 'Demoted to member'}.`);
 } catch (e) { console.error(e); toast.error('Update failed.'); }
 };

 // Editors get all pro features and every Foundations course, but no elevated
 // delete/moderation powers - they can only delete their own data, like any
 // member. Assigning the role is admin-only (this panel + Firestore rules).
 const toggleEditor = async (u) => {
 if (u.id === currentUser.uid) {
 toast.error("You can't change your own role.");
 return;
 }
 const makeEditor = u.role !== 'editor';
 const newRole = makeEditor ? 'editor' : 'member';
 if (!window.confirm(`${makeEditor ? 'Make' : 'Remove'} editor: ${u.displayName || u.email}?`)) return;
 try {
 await updateDoc(doc(db, 'users', u.id), { role: newRole });
 setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: newRole } : x));
 toast.success(makeEditor ? 'Promoted to editor.' : 'Editor role removed.');
 } catch (e) { console.error(e); toast.error('Update failed.'); }
 };

 const deleteProject = async (p) => {
 if (!window.confirm(`Delete project "${p.projectTitle || p.title}"? This cannot be undone.`)) return;
 try {
 await deleteDoc(doc(db, 'projects', p.id));
 setProjects(prev => prev.filter(x => x.id !== p.id));
 setStats(s => ({ ...s, projects: s.projects - 1 }));
 toast.success('Project deleted.');
 } catch (e) { console.error(e); toast.error('Delete failed.'); }
 };

 const deletePost = async (p) => {
 if (!isAdmin) { toast.error('Only admins can delete.'); return; }
 if (!window.confirm('Delete this post? This cannot be undone.')) return;
 try {
 await deleteDoc(doc(db, 'posts', p.id));
 setPosts(prev => prev.filter(x => x.id !== p.id));
 setStats(s => ({ ...s, posts: s.posts - 1 }));
 toast.success('Post deleted.');
 } catch (e) { console.error(e); toast.error('Delete failed.'); }
 };

 const handleSeedDummy = async () => {
 setSeeding(true);
 try {
 const n = await seedDummyActivity();
 toast.success(`Added ${n} sample activity items to the Proof Wall.`);
 await refreshDummyCount();
 } catch (e) { console.error(e); toast.error('Could not seed sample activity.'); }
 setSeeding(false);
 };

 const handleDeleteDummy = async () => {
 if (!isAdmin) { toast.error('Only admins can do this.'); return; }
 if (!window.confirm('Delete ALL sample (dummy) activity items? Real activity is never touched.')) return;
 setSeeding(true);
 try {
 const n = await deleteDummyActivity();
 toast.success(`Deleted ${n} sample activity items.`);
 await refreshDummyCount();
 } catch (e) { console.error(e); toast.error('Could not delete sample activity.'); }
 setSeeding(false);
 };

 const handleGenerate = async () => {
 setGenerating(true);
 try {
 if (useAI) {
 // AI generation (requires a funded Anthropic API key on the server)
 setDraft(await generateProject());
 toast.success('Generated with AI - review and publish.');
 } else {
 // Free, instant: pick from the built-in template library
 setDraft(getRandomTemplate());
 toast.success('Loaded a project - review and publish.');
 }
 } catch (e) {
 console.error(e);
 toast.error(useAI ? 'AI generation failed (check API credits).' : 'Could not load a template.');
 }
 setGenerating(false);
 };

 const handlePublish = async () => {
 if (!draft) return;
 setPublishing(true);
 try {
 const newRef = await addDoc(collection(db, 'projects'), {
 projectTitle: draft.projectTitle,
 projectDescription: draft.projectDescription,
 projectGoals: draft.projectGoals || null,
 industryTrack: draft.industryTrack,
 timeline: 'flexible',
 proposedRoles: draft.proposedRoles,
 teamRoles: [],
 maxTeamSize: 0,
 status: 'lead_recruitment',
 isActive: true,
 isGenerated: true,
 leadConfirmed: false,
 submitterId: null,
 submitterEmail: null,
 submitterName: 'She Model Tech (Auto-generated)',
 isCompanyPost: false,
 viewCount: 0,
 applicationCount: 0,
 createdAt: serverTimestamp(),
 updatedAt: serverTimestamp(),
 });
 // Proof Wall: log a "needs a lead" event so it shows under that filter.
 try {
 const { logActivity: logProof } = await import('../../utils/activityFeed');
 await logProof({
 type: 'lead',
 actorName: 'She Model Tech',
 projectId: newRef.id,
 projectTitle: draft.projectTitle,
 meta: 'Open to anyone, apply to lead',
 });
 } catch (e) { console.log('Proof log skipped:', e.message); }
 toast.success('Published in lead recruitment.');
 setDraft(null);
 loadData();
 setTab('projects');
 } catch (e) { console.error(e); toast.error('Publish failed.'); }
 setPublishing(false);
 };

 if (checking) {
 return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div></div>;
 }
 if (!isReviewer) return null;

 const filteredUsers = users.filter(u => {
 if (!userSearch.trim()) return true;
 const q = userSearch.toLowerCase();
 return (u.displayName || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
 });

 const tabs = [
 ['overview', 'Overview'],
 ['reviews', 'Reviews'],
 ['projects', 'Projects'],
 ['users', 'Users'],
 ['generate', 'Generate'],
 ['foundations', 'Foundations'],
 ['seed', 'Seed'],
 ['moderation', 'Moderation'],
 ['deletions', 'Deletion Requests'],
 ['danger', 'Danger Zone'],
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
 Admin Dashboard
 {myRole && (
 <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${
 isAdmin ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'
 }`}>
 {roleLabel(myRole)}
 </span>
 )}
 </h1>
 <p className="text-gray-500 text-sm mb-6">Manage projects, users, and content across She Model Tech.</p>

 {/* Tabs */}
 <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
 {tabs.map(([key, label]) => (
 <button key={key} onClick={() => setTab(key)}
 className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-all ${tab === key ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
 {label}
 </button>
 ))}
 </div>

 {loadingData && <div className="py-10 text-center text-gray-400 text-sm">Loading…</div>}

 {/* DANGER ZONE */}
 {tab === 'danger' && (
 <div className="space-y-4 max-w-2xl">
 <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
 <h2 className="text-lg font-bold text-red-700 mb-1">Clear all test data</h2>
 <p className="text-gray-600 text-sm mb-3">
 Permanently deletes all projects, applications, the Proof Wall feed, posts, messages, notifications, jobs, badges, and certificates. <strong>User accounts are kept</strong> so people can still log in. All platform functionality stays intact - only the data is wiped. This cannot be undone.
 </p>

 <label className="flex items-center gap-2 mb-3 text-sm text-gray-700">
 <input type="checkbox" checked={alsoResetUsers} onChange={e => setAlsoResetUsers(e.target.checked)} />
 Also reset every user's badges &amp; certificates (recommended for a clean slate)
 </label>

 <p className="text-gray-600 text-sm mb-2">Type <span className="font-mono font-bold">DELETE</span> to confirm:</p>
 <input
 value={clearConfirm}
 onChange={e => setClearConfirm(e.target.value)}
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
 {tab === 'reviews' && (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <p className="text-gray-500 text-sm">Projects submitted for completion review.</p>
 <button onClick={loadReviews} className="text-pink-600 text-sm font-semibold hover:underline">Refresh</button>
 </div>
 {loadingReviews ? (
 <p className="text-gray-400 text-sm py-6 text-center">Loading review queue…</p>
 ) : reviewProjects.length === 0 ? (
 <p className="text-gray-400 text-sm py-6 text-center">No projects awaiting review.</p>
 ) : reviewProjects.map(p => (
 <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-5">
 <div className="flex items-start justify-between gap-3 mb-3">
 <div className="min-w-0">
 <h3 className="font-bold text-gray-900">{p.projectTitle || p.title || 'Untitled project'}</h3>
 <p className="text-gray-500 text-xs mt-0.5">Submitted by {p.reviewSubmittedBy || 'unknown'}</p>
 </div>
 <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-100 text-gray-900">Awaiting review</span>
 </div>

 <div className="space-y-1.5 mb-4 text-sm">
 <p className="text-gray-600">
 Submission link:{' '}
 {p.reviewSubmissionUrl
 ? <a href={p.reviewSubmissionUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline break-all">{p.reviewSubmissionUrl}</a>
 : <span className="text-red-500">none</span>}
 </p>
 <p className="text-gray-600">
 Workspace:{' '}
 {p.reviewWorkspaceUrl
 ? <a href={p.reviewWorkspaceUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline break-all">{p.reviewWorkspaceUrl}</a>
 : <span className="text-gray-400">n/a</span>}
 </p>
 </div>

 <textarea
 value={feedbackById[p.id] || ''}
 onChange={e => setFeedbackById(prev => ({ ...prev, [p.id]: e.target.value }))}
 placeholder="Feedback for the team (required for 'Request changes', optional for 'Reject')…"
 rows={2}
 className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none mb-3"
 />

 <div className="flex flex-wrap gap-2">
 <button onClick={() => doApprove(p)} disabled={actingId === p.id}
 className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50">
 {actingId === p.id ? '…' : 'Approve'}
 </button>
 <button onClick={() => doRequestChanges(p)} disabled={actingId === p.id}
 className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg disabled:opacity-50">
 Request changes
 </button>
 <button onClick={() => doReject(p)} disabled={actingId === p.id}
 className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-semibold rounded-lg disabled:opacity-50">
 Reject
 </button>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* OVERVIEW */}
 {!loadingData && tab === 'overview' && (
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
 <StatCard label="Total Users" value={stats.users} />
 <StatCard label="Total Projects" value={stats.projects} sub={`${stats.completed} completed`} />
 <StatCard label="Awaiting Lead" value={stats.leadRecruitment} sub="lead recruitment" />
 <StatCard label="Community Posts" value={stats.posts} sub="recent (last 50)" />
 <StatCard label="Badges Issued" value={stats.badges} />
 <StatCard label="Admins" value={users.filter(u => u.role === 'admin').length} />
 <StatCard label="Editors" value={users.filter(u => u.role === 'editor').length} />
 </div>
 )}

 {/* PROJECTS */}
 {!loadingData && tab === 'projects' && (
 <div className="space-y-2">
 {projects.length === 0 ? <p className="text-gray-400 text-sm">No projects yet.</p> : projects.map(p => (
 <div key={p.id} className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg p-3">
 <div className="min-w-0">
 <p className="text-gray-900 text-sm font-medium truncate">{p.projectTitle || p.title || 'Untitled'}</p>
 <p className="text-gray-400 text-xs">
 {p.isGenerated ? 'Auto-generated' : `by ${p.submitterName || 'Owner'}`} · {fmtDate(p.createdAt)}
 </p>
 </div>
 <div className="flex items-center gap-2 flex-shrink-0">
 <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${statusStyle[p.status] || 'bg-gray-100 text-gray-600'}`}>
 {(p.status || 'unknown').replace('_', ' ')}
 </span>
 <button onClick={() => navigate(`/projects/${p.id}`)} className="text-pink-600 text-xs font-semibold">View</button>
 {isAdmin && (
 <button onClick={() => deleteProject(p)} className="text-red-500 text-xs font-semibold">Delete</button>
 )}
 </div>
 </div>
 ))}
 </div>
 )}

 {!loadingData && tab === 'deletions' && (
 <div className="space-y-2">
 {deletionReqs.length === 0 ? <p className="text-gray-400 text-sm">No pending deletion requests.</p> : deletionReqs.map(r => (
 <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-3">
 <div className="flex items-start justify-between gap-3">
 <div className="min-w-0">
 <p className="text-gray-900 text-sm font-medium truncate">{r.projectTitle || 'Untitled project'}</p>
 <p className="text-gray-400 text-xs">Requested by {r.ownerEmail || 'owner'}</p>
 <p className="text-gray-600 text-xs mt-1"><span className="font-semibold">Reason:</span> {r.reason || '(none)'}</p>
 </div>
 <div className="flex items-center gap-2 flex-shrink-0">
 <button onClick={() => navigate(`/projects/${r.projectId}`)} className="text-pink-600 text-xs font-semibold">View</button>
 <button onClick={() => declineDeletion(r)} className="text-gray-500 text-xs font-semibold">Decline</button>
 <button onClick={() => approveDeletion(r)} className="text-red-500 text-xs font-semibold">Approve &amp; Delete</button>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* USERS */}
 {!loadingData && tab === 'users' && (
 <div>
 <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search by name or email"
 className="w-full mb-4 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none" />
 <div className="space-y-2">
 {filteredUsers.map(u => (
 <div key={u.id} className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg p-3">
 <div className="min-w-0">
 <p className="text-gray-900 text-sm font-medium truncate">
 {u.displayName || 'No name'}
 {u.role === 'admin' && <span className="ml-2 text-[10px] font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded">ADMIN</span>}
 {u.role === 'editor' && <span className="ml-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">EDITOR</span>}
 {u.isCompany && <span className="ml-2 text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">COMPANY</span>}
 </p>
 <p className="text-gray-400 text-xs truncate">{u.email} · {u.country || 'no country'} · joined {fmtDate(u.createdAt)}</p>
 </div>
 <div className="flex-shrink-0 flex items-center gap-2">
 <button onClick={() => toggleEditor(u)}
 className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${u.role === 'editor' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
 {u.role === 'editor' ? 'Remove editor' : 'Make editor'}
 </button>
 {isAdmin && <button onClick={() => toggleAdmin(u)}
 className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${u.role === 'admin' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-pink-600 text-white hover:bg-pink-700'}`}>
 {u.role === 'admin' ? 'Remove admin' : 'Make admin'}
 </button>}
 </div>
 </div>
 ))}
 {filteredUsers.length === 0 && <p className="text-gray-400 text-sm">No users match.</p>}
 </div>
 </div>
 )}

 {/* GENERATE */}
 {!loadingData && tab === 'foundations' && (
 <div>
 <h2 className="text-lg font-bold text-gray-900 mb-1">Foundations contributions</h2>
 <p className="text-gray-500 text-sm mb-4">Review community-submitted lessons. Approve to publish, request changes (author can resubmit), or reject.</p>
 {fLoading ? <p className="text-gray-400 text-sm">Loading…</p> : fQueue.length === 0 ? (
 <p className="text-gray-400 text-sm">No pending contributions.</p>
 ) : (
 <div className="space-y-3">
 {fQueue.map(c => (
 <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-4">
 <div className="flex items-start justify-between gap-3">
 <div className="min-w-0">
 <p className="font-bold text-gray-900 text-sm">{c.title}</p>
 <p className="text-xs text-gray-500 mt-0.5">By {c.authorName}{c.authorBadgeLevel ? ` · ${c.authorBadgeLevel}` : ''} · track: {c.trackId}</p>
 <p className="text-sm text-gray-600 mt-1">{c.description}</p>
 <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-xs text-pink-600 break-all">{c.url}</a>
 </div>
 </div>
 <div className="flex gap-2 mt-3">
 <button onClick={() => handleReview(c.id, 'approve')} className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">Approve</button>
 <button onClick={() => handleReview(c.id, 'changes')} className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">Request changes</button>
 <button onClick={() => handleReview(c.id, 'reject')} className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">Reject</button>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* All contributions: full management - edit or remove any lesson, any status. */}
 <h3 className="text-base font-bold text-gray-900 mt-8 mb-1">All community lessons</h3>
 <p className="text-gray-500 text-sm mb-3">Every contribution, any status. Edit details or remove any lesson.</p>
 {fLoading ? <p className="text-gray-400 text-sm">Loading…</p> : fAll.length === 0 ? (
 <p className="text-gray-400 text-sm">No contributions yet.</p>
 ) : (
 <div className="space-y-3">
 {fAll.map(c => {
 const statusColor = c.status === 'approved' ? 'bg-green-100 text-green-700'
 : c.status === 'pending' ? 'bg-amber-100 text-amber-700'
 : c.status === 'changes_requested' ? 'bg-pink-100 text-pink-700'
 : 'bg-red-100 text-red-700';
 return (
 <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-4">
 {fEditing === c.id ? (
 <div className="space-y-2">
 <input value={fEditForm.title} onChange={e => setFEditForm(p => ({ ...p, title: e.target.value }))} placeholder="Title" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
 <input value={fEditForm.url} onChange={e => setFEditForm(p => ({ ...p, url: e.target.value }))} placeholder="Link" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
 <textarea value={fEditForm.description} onChange={e => setFEditForm(p => ({ ...p, description: e.target.value }))} placeholder="Description" rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none" />
 <div className="flex gap-2">
 <button onClick={() => saveEdit(c.id)} className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">Save</button>
 <button onClick={() => setFEditing(null)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg">Cancel</button>
 </div>
 </div>
 ) : (
 <>
 <div className="flex items-start justify-between gap-3">
 <div className="min-w-0">
 <div className="flex items-center gap-2 flex-wrap">
 <p className="font-bold text-gray-900 text-sm">{c.title}</p>
 <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor}`}>{c.status}</span>
 </div>
 <p className="text-xs text-gray-500 mt-0.5">By {c.authorName}{c.authorBadgeLevel ? ` · ${c.authorBadgeLevel}` : ''}{c.authorLeft ? ' · former member' : ''} · track: {c.trackId}{c.ratingCount ? ` · ★ ${(c.ratingSum / c.ratingCount).toFixed(1)} (${c.ratingCount})` : ''}</p>
 <p className="text-sm text-gray-600 mt-1">{c.description}</p>
 <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-xs text-pink-600 break-all">{c.url}</a>
 </div>
 </div>
 <div className="flex gap-2 mt-3">
 <button onClick={() => startEdit(c)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg">Edit</button>
 {c.status !== 'approved' && <button onClick={() => handleReview(c.id, 'approve')} className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">Approve</button>}
 <button onClick={() => removeContribution(c.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">Remove</button>
 </div>
 </>
 )}
 </div>
 );
 })}
 </div>
 )}
 </div>
 )}

 {!loadingData && tab === 'generate' && (
 <div>
 {/* Batch generator, top up the board with varied starter projects in one click */}
 <div className="bg-pink-50 border border-pink-200 rounded-xl p-5 mb-6">
 <h2 className="text-base font-bold text-gray-900 mb-1">Batch generate starter projects</h2>
 <p className="text-gray-600 text-sm mb-4">Instantly populate the board with a varied set of beginner-friendly projects across different tracks, so new members always have something to join. Each opens for lead recruitment.</p>
 <div className="flex flex-wrap items-center gap-3">
 <label className="text-sm text-gray-700 font-medium">How many:</label>
 <select value={batchCount} onChange={e => setBatchCount(parseInt(e.target.value, 10))}
 className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:border-pink-500 focus:outline-none">
 <option value={12}>12 projects</option>
 <option value={24}>24 projects</option>
 <option value={30}>30 projects</option>
 </select>
 <button onClick={runBatchGenerate} disabled={batchRunning}
 className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all">
 {batchRunning ? 'Publishing…' : `Generate ${batchCount} projects`}
 </button>
 </div>
 </div>

 <p className="text-gray-500 text-sm mb-4">Or publish a single software or AI project (no physical prototypes) into lead recruitment - anyone can apply to lead, then the confirmed lead refines it and opens the team.</p>

 {/* Source toggle */}
 <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
 <label className="flex items-center gap-2 cursor-pointer">
 <input type="checkbox" checked={useAI} onChange={e => { setUseAI(e.target.checked); setDraft(null); }}
 className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
 <span className="text-sm text-gray-700 font-medium">Use AI generation</span>
 </label>
 <span className="text-xs text-gray-400">
 {useAI
 ? 'Writes a fresh project via Claude (needs Anthropic API credits).'
 : `Free - picks from ${TEMPLATE_COUNT} built-in project templates. No cost.`}
 </span>
 </div>

 <button onClick={handleGenerate} disabled={generating}
 className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-all disabled:opacity-50">
 {generating ? 'Loading…' : draft ? (useAI ? 'Regenerate' : 'Load another') : (useAI ? 'Generate a Project' : 'Load a Project')}
 </button>
 {draft && (
 <div className="mt-5 bg-white border border-gray-200 rounded-xl p-5 space-y-3">
 <div><p className="text-gray-400 text-xs uppercase font-semibold">Title</p><p className="text-gray-900 font-bold">{draft.projectTitle}</p></div>
 <div><p className="text-gray-400 text-xs uppercase font-semibold">Industry</p><p className="text-gray-700 text-sm capitalize">{draft.industryTrack}</p></div>
 <div><p className="text-gray-400 text-xs uppercase font-semibold">Description</p><p className="text-gray-700 text-sm">{draft.projectDescription}</p></div>
 {draft.projectGoals && <div><p className="text-gray-400 text-xs uppercase font-semibold">Goals</p><p className="text-gray-700 text-sm">{draft.projectGoals}</p></div>}
 <div>
 <p className="text-gray-400 text-xs uppercase font-semibold mb-1">Proposed Roles</p>
 <div className="space-y-1">
 {draft.proposedRoles.map((r, i) => (
 <div key={i} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">{r.role} · <span className="capitalize">{r.experienceLevel}</span> · {r.count} {r.count === 1 ? 'person' : 'people'}</div>
 ))}
 </div>
 </div>
 <div className="flex gap-3 pt-1">
 <button onClick={handlePublish} disabled={publishing} className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-5 py-2 rounded-lg disabled:opacity-50">
 {publishing ? 'Publishing…' : 'Publish in Lead Recruitment'}
 </button>
 <button onClick={() => setDraft(null)} disabled={publishing} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm px-4 py-2 rounded-lg">Discard</button>
 </div>
 </div>
 )}
 </div>
 )}

 {/* SEED (dummy Proof Wall content) */}
 {!loadingData && tab === 'seed' && (
 <div>
 <p className="text-gray-500 text-sm mb-2">Seed the Proof Wall with sample activity so it doesn't look empty at launch. Every sample item is flagged as dummy and can be safely bulk-deleted later, without touching any real activity.</p>
 <p className="text-gray-400 text-xs mb-5">
 {dummyCount === null ? 'Checking how many sample items exist…' : `${dummyCount} sample item${dummyCount === 1 ? '' : 's'} currently on the wall.`}
 </p>
 <div className="flex flex-wrap gap-3">
 <button onClick={handleSeedDummy} disabled={seeding}
 className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all disabled:opacity-50">
 {seeding ? 'Working…' : 'Add sample activity'}
 </button>
 {isAdmin && <button onClick={handleDeleteDummy} disabled={seeding || dummyCount === 0}
 className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm px-5 py-2.5 rounded-lg transition-all disabled:opacity-40">
 {seeding ? 'Working…' : 'Delete all sample activity'}
 </button>}
 </div>
 <p className="text-gray-400 text-xs mt-4 leading-relaxed">Tip: add sample activity now for launch, then once real members start earning badges and shipping projects, come back and delete it all in one click.</p>
 </div>
 )}

 {/* MODERATION */}
 {!loadingData && tab === 'moderation' && (
 <div className="space-y-2">
 <p className="text-gray-500 text-sm mb-2">Recent community posts (latest 50). Delete anything that violates guidelines.</p>
 {posts.length === 0 ? <p className="text-gray-400 text-sm">No posts.</p> : posts.map(p => (
 <div key={p.id} className="flex items-start justify-between gap-3 bg-white border border-gray-200 rounded-lg p-3">
 <div className="min-w-0">
 <p className="text-gray-900 text-xs font-semibold">{p.authorName || 'Unknown'} <span className="text-gray-400 font-normal">· {fmtDate(p.createdAt)}</span></p>
 {p.title && <p className="text-gray-800 text-sm font-medium mt-0.5">{p.title}</p>}
 <p className="text-gray-600 text-sm mt-0.5 line-clamp-3">{p.content || '(no text)'}</p>
 </div>
 <button onClick={() => deletePost(p)} className="flex-shrink-0 text-red-500 text-xs font-semibold">Delete</button>
 </div>
 ))}
 </div>
 )}
 </div>
 );
};

export default AdminPanel;
