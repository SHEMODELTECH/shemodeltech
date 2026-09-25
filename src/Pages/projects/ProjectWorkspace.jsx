// src/Pages/projects/ProjectWorkspace.jsx - Workspace with Forum + Resources
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, updateDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, arrayUnion, arrayRemove, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import LeadCheckIn from '../../components/LeadCheckIn';
import DeadlineBanner from '../../components/DeadlineBanner';
import { toast } from 'react-toastify';
import { logActivity } from '../../utils/activityLog';
import { uploadImageToBlob, validateImageFile } from '../../utils/blobStorage';
import { formatMoney } from '../../utils/paidProjects';

const formatTime = (ts) => {
  if (!ts) return '';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ProjectWorkspace = () => {
  const { projectId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('forum');

  // Forum state
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newPostLink, setNewPostLink] = useState('');
  const [newPostImage, setNewPostImage] = useState(null); // {file, preview}
  const [uploadingImage, setUploadingImage] = useState(false);
  const [posting, setPosting] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editText, setEditText] = useState('');
  const messagesEndRef = useRef(null);
  const [showReactors, setShowReactors] = useState(null); // 'postId-emoji' key
  const [lightbox, setLightbox] = useState(null); // full-size image URL when an image is tapped

  // Resource state
  const [resources, setResources] = useState({ submissionUrl: '', meetingUrl: '', detailsUrl: '', notes: '' });
  const [savingResources, setSavingResources] = useState(false);

  // Team state
  const [teamMembers, setTeamMembers] = useState([]);

  // Leave-project state (paid projects: leaving forfeits pay, requires a
  // reason, and automatically opens a dispute record for admin + owner review)
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const snap = await getDoc(doc(db, 'projects', projectId));
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() };
          setProject(data);
          if (data.resources) {
            setResources({
              submissionUrl: data.resources.submissionUrl || '',
              meetingUrl: data.resources.meetingUrl || '',
              detailsUrl: data.resources.detailsUrl || '',
              notes: data.resources.notes || '',
            });
          }
        }
      } catch (e) { console.error('Error fetching project:', e); }
      setLoading(false);
    };
    fetchProject();
    // Record that this user is active on this project (for re-engagement reminders).
    if (currentUser?.uid) {
      import('../../utils/activityStamp').then(({ stampActivity }) => stampActivity(currentUser.uid, projectId));
    }
  }, [projectId, currentUser]);

  // Fetch team members
  useEffect(() => {
    if (!project) return;
    const fetchTeam = async () => {
      try {
        // Get approved applications
        const appQ = query(collection(db, 'project_applications'), where('projectId', '==', projectId), where('status', '==', 'approved'));
        const appSnap = await getDocs(appQ);
        const members = appSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Fetch user profiles for each member
        const enriched = await Promise.all(members.map(async (m) => {
          try {
            const userQ = query(collection(db, 'users'), where('email', '==', m.applicantEmail));
            const userSnap = await getDocs(userQ);
            if (!userSnap.empty) {
              const userData = userSnap.docs[0].data();
              return { ...m, photoURL: userData.photoURL || null, displayName: userData.displayName || m.applicantName };
            }
          } catch (e) {}
          return m;
        }));

        // Add owner
        const ownerEntry = {
          applicantName: project.submitterName || project.contactName || 'Project Owner',
          applicantEmail: project.submitterEmail,
          role: 'Project Owner',
          photoURL: project.submitterPhoto || null,
          isOwner: true,
        };
        setTeamMembers([ownerEntry, ...enriched]);
      } catch (e) { console.error('Error fetching team:', e); }
    };
    fetchTeam();
  }, [project, projectId]);

  // Listen to forum posts
  useEffect(() => {
    if (!projectId) return;
    const q = query(collection(db, 'projects', projectId, 'forum'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [projectId]);

  useEffect(() => {
    if (activeTab === 'forum') messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [posts, activeTab]);

  const isOwner = project?.submitterId === currentUser?.uid || project?.submitterEmail === currentUser?.email;

  // My own approved application on this project (used for the leave flow + my pay).
  const myMembership = teamMembers.find(m =>
    !m.isOwner && (m.applicantUid === currentUser?.uid || m.applicantEmail === currentUser?.email)
  );

  // Leave the project. On paid projects this forfeits the member's pay,
  // requires a stated reason, and automatically opens a dispute record so
  // the owner and admin can review it.
  const handleLeaveProject = async () => {
    if (!myMembership) return;
    if (!leaveReason.trim()) { toast.error('Please state your reason for leaving. This is required.'); return; }
    setLeaving(true);
    try {
      // 1. Mark the application as left (forfeits pay on paid projects).
      await updateDoc(doc(db, 'project_applications', myMembership.id), {
        status: 'left',
        leftAt: serverTimestamp(),
        leaveReason: leaveReason.trim(),
      });

      // 2. Update the project: remove from members, record the reason, and
      //    open an automatic dispute entry (visible to owner + admin; the
      //    dedicated Dispute page ships in Phase B and reads this data).
      const updates = {
        members: arrayRemove(currentUser.uid),
        leaveReasons: arrayUnion({
          uid: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName || currentUser.email,
          role: myMembership.role || '',
          reason: leaveReason.trim(),
          at: new Date().toISOString(),
        }),
      };
      if (project.isPaid) {
        updates.disputeHistory = arrayUnion({
          memberName: currentUser.displayName || currentUser.email,
          memberEmail: currentUser.email,
          action: 'left',
          reason: leaveReason.trim(),
          note: 'Member left mid-project. Pay forfeited. Auto-opened for review.',
          at: new Date().toISOString(),
        });
        // Pay forfeiture is enforced by the application status flipping to
        // 'left' - earnings only count APPROVED applications.
      }
      await updateDoc(doc(db, 'projects', projectId), updates);

      // 3. Notify the owner.
      try {
        if (project.submitterId) {
          await addDoc(collection(db, 'notifications'), {
            userId: project.submitterId,
            type: project.isPaid ? 'payment_disputed' : 'project_completed',
            message: `${currentUser.displayName || currentUser.email} left "${project.projectTitle}"${project.isPaid ? ' (paid project - pay forfeited, auto-flagged for review)' : ''}. Reason: ${leaveReason.trim()}`,
            projectId,
            read: false,
            createdAt: serverTimestamp(),
          });
        }
      } catch (_) {}

      toast.success('You have left the project.');
      navigate('/projects');
    } catch (e) {
      console.error('Leave project failed:', e);
      toast.error('Could not leave the project. Please try again.');
    }
    setLeaving(false);
  };

  // Forum handlers
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const v = validateImageFile(file);
    if (v && v.valid === false) { toast.error(v.error || 'Invalid image.'); return; }
    setNewPostImage({ file, preview: URL.createObjectURL(file) });
  };

  const handlePost = async () => {
    if (!newPost.trim() && !newPostLink.trim() && !newPostImage) return;
    setPosting(true);
    try {
      let imageUrl = null;
      if (newPostImage) {
        setUploadingImage(true);
        const result = await uploadImageToBlob(newPostImage.file, 'workspace');
        imageUrl = result?.url || result || null;
        setUploadingImage(false);
      }
      await addDoc(collection(db, 'projects', projectId, 'forum'), {
        text: newPost.trim(),
        link: newPostLink.trim() || null,
        imageUrl: imageUrl,
        authorId: currentUser.uid,
        authorEmail: currentUser.email,
        authorName: currentUser.displayName || currentUser.email,
        authorPhoto: currentUser.photoURL || null,
        createdAt: serverTimestamp(),
        editedAt: null,
        reactions: {},
        parentId: null,
      });
      setNewPost('');
      setNewPostLink('');
      setNewPostImage(null);
    } catch (e) { toast.error('Failed to post'); setUploadingImage(false); }
    setPosting(false);
  };

  const handleReply = async (parentId) => {
    if (!replyText.trim()) return;
    try {
      await addDoc(collection(db, 'projects', projectId, 'forum'), {
        text: replyText.trim(),
        link: null,
        authorId: currentUser.uid,
        authorEmail: currentUser.email,
        authorName: currentUser.displayName || currentUser.email,
        authorEmail: currentUser.email,
        authorPhoto: currentUser.photoURL || null,
        createdAt: serverTimestamp(),
        editedAt: null,
        reactions: {},
        parentId,
      });
      setReplyTo(null);
      setReplyText('');
    } catch (e) { toast.error('Failed to reply'); }
  };

  const handleEdit = async (postId) => {
    if (!editText.trim()) return;
    try {
      await updateDoc(doc(db, 'projects', projectId, 'forum', postId), {
        text: editText.trim(),
        editedAt: serverTimestamp(),
      });
      setEditingPost(null);
      setEditText('');
    } catch (e) { toast.error('Failed to edit'); }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try { await deleteDoc(doc(db, 'projects', projectId, 'forum', postId)); } catch (e) { toast.error('Failed to delete'); }
  };

  const handleReact = async (postId, emoji) => {
    try {
      const postRef = doc(db, 'projects', projectId, 'forum', postId);
      const post = posts.find(p => p.id === postId) || posts.flatMap(p => getReplies(p.id)).find(r => r.id === postId);
      const reactions = post?.reactions || {};
      const reactorInfo = post?.reactorInfo || {};
      const current = reactions[emoji] || [];
      const has = current.includes(currentUser.uid);
      const updated = has ? current.filter(u => u !== currentUser.uid) : [...current, currentUser.uid];
      const info = { ...reactorInfo };
      if (has) {
        // only remove their info if they have no other reactions on this post
        const stillReacts = Object.entries(reactions).some(([e, arr]) => e !== emoji && (arr || []).includes(currentUser.uid));
        if (!stillReacts) delete info[currentUser.uid];
      } else {
        info[currentUser.uid] = { name: currentUser.displayName || currentUser.email, photo: currentUser.photoURL || '' };
      }
      await updateDoc(postRef, { [`reactions.${emoji}`]: updated, reactorInfo: info });
    } catch (e) { console.error(e); }
  };

  // Resource handlers
  const handleSaveResources = async () => {
    // Submission link is mandatory for the project lead - it's how work gets verified.
    if (!resources.submissionUrl || !resources.submissionUrl.trim()) {
      toast.error('A project submission link is required. Add a GitHub repo (or another platform) so your work can be reviewed and verified.');
      return;
    }
    setSavingResources(true);
    try {
      await updateDoc(doc(db, 'projects', projectId), { resources });
      toast.success('Resources updated');
      logActivity(projectId, { type: 'workspace_updated', actor: currentUser?.email, actorName: currentUser?.displayName || currentUser?.email, description: 'Resources updated' });
    } catch (e) { toast.error('Failed to save'); }
    setSavingResources(false);
  };

  const tabs = [
    { id: 'forum', label: 'Discussion' },
    { id: 'resources', label: 'Resources' },
    { id: 'team', label: `Team (${teamMembers.length})` },
  ];

  const topPosts = posts.filter(p => !p.parentId);
  const getReplies = (parentId) => posts.filter(p => p.parentId === parentId);
  const emojis = ['👍', '❤️', '🎉', '🔥', '👀'];

  // Build uid → name map from team members + posts
  const uidNameMap = {};
  if (currentUser) uidNameMap[currentUser.uid] = 'You';
  teamMembers.forEach(m => { if (m.applicantUid) uidNameMap[m.applicantUid] = m.displayName || m.applicantName; if (m.applicantEmail) uidNameMap[m.applicantEmail] = m.displayName || m.applicantName; });
  posts.forEach(p => { if (p.authorId) uidNameMap[p.authorId] = p.authorName; });

  const getReactorNames = (reactorUids) => {
    if (!reactorUids || reactorUids.length === 0) return '';
    return reactorUids.map(uid => uidNameMap[uid] || 'Someone').join(', ');
  };

  // Render small profiles (avatar + name) of the people who reacted.
  const renderReactorProfiles = (reactorUids, post) => {
    if (!reactorUids || reactorUids.length === 0) return null;
    const info = post?.reactorInfo || {};
    return (
      <div className="flex flex-col gap-1">
        {reactorUids.map(ruid => {
          const meta = info[ruid] || {};
          const name = meta.name || uidNameMap[ruid] || 'Someone';
          const photo = meta.photo;
          return (
            <div key={ruid} className="flex items-center gap-1.5">
              {photo
                ? <img src={photo} alt={name} className="w-4 h-4 rounded-full object-cover" />
                : <span className="w-4 h-4 rounded-full bg-pink-500 text-white text-[8px] font-bold flex items-center justify-center">{(name || '?').charAt(0).toUpperCase()}</span>}
              <span>{name}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Aggregate everyone who reacted (across all emojis) and show their avatars.
  const renderReactorSummary = (post) => {
    const reactions = post?.reactions || {};
    const info = post?.reactorInfo || {};
    const uids = [...new Set(Object.values(reactions).flat())].filter(Boolean);
    if (uids.length === 0) return null;
    return (
      <div className="flex items-center gap-1.5 mt-2">
        <div className="flex -space-x-1.5">
          {uids.slice(0, 6).map(uid => {
            const meta = info[uid] || {};
            const name = meta.name || uidNameMap[uid] || 'Someone';
            return meta.photo ? (
              <img key={uid} src={meta.photo} alt={name} title={name} className="w-5 h-5 rounded-full object-cover border border-white" />
            ) : (
              <span key={uid} title={name} className="w-5 h-5 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">{(name || '?').charAt(0).toUpperCase()}</span>
            );
          })}
        </div>
        <span className="text-gray-500 text-[11px]">{uids.length === 1 ? '1 reaction' : `${uids.length} reactions`}</span>
      </div>
    );
  };

  const inputCls = "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none";

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div></div>;
  if (!project) return <div className="text-center py-20"><p className="text-gray-900 font-semibold">Project not found</p></div>;
  if (project.reviewStatus === 'rejected') return (
    <div className="max-w-2xl mx-auto text-center py-20 px-4">
      <h2 className="text-xl font-bold text-red-600 mb-2">This project was rejected</h2>
      <p className="text-gray-500 text-sm mb-1">The workspace is closed. No badges or certificates were awarded.</p>
      {project.reviewFeedback && <p className="text-gray-400 text-xs">Reviewer note: {project.reviewFeedback}</p>}
    </div>
  );

  if (project.status === 'cancelled') return (
    <div className="max-w-2xl mx-auto text-center py-20 px-4">
      <h2 className="text-xl font-bold text-red-600 mb-2">This project was closed</h2>
      <p className="text-gray-500 text-sm">This project was closed because the project lead deleted their account. No badges or certificates can be awarded for it.</p>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto">
      <button onClick={() => navigate(`/projects/${projectId}`)} className="text-gray-500 hover:text-gray-900 text-sm mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Project
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{project.projectTitle || project.title} - Workspace</h1>

      {/* Weekly lead check-in (renders only for the lead, only when due) */}
      <LeadCheckIn
        project={{ ...project, id: projectId }}
        currentUser={currentUser}
        onDone={() => window.location.reload()}
      />

      {/* Deadline / grace banner for the whole team */}
      <DeadlineBanner project={{ ...project, id: projectId }} />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${activeTab === tab.id ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Discussion Forum */}
      {activeTab === 'forum' && (
        <div>
          {/* Posts */}
          <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-1">
            {topPosts.length === 0 && (
              <div className="text-center py-10"><p className="text-gray-400 text-sm">No posts yet. Start a discussion!</p></div>
            )}
            {topPosts.map(post => (
              <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-4">
                {/* Header: avatar + name, side by side */}
                <div className="flex items-center gap-3">
                  <a href={`/profile/${encodeURIComponent(post.authorEmail || '')}`} className="flex-shrink-0">
                    {post.authorPhoto ? (
                      <img src={post.authorPhoto} alt={post.authorName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white text-sm font-bold">{(post.authorName || 'U')[0].toUpperCase()}</div>
                    )}
                  </a>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a href={`/profile/${encodeURIComponent(post.authorEmail || '')}`} className="text-gray-900 text-sm font-semibold hover:text-pink-600 hover:underline">{post.authorName}</a>
                      <span className="text-gray-400 text-xs">{formatTime(post.createdAt)}</span>
                      {post.editedAt && <span className="text-gray-400 text-[10px] italic">edited</span>}
                    </div>
                  </div>
                </div>
                {/* Body: full width, below the header */}
                <div className="mt-3">
                    {/* Content */}
                    {editingPost === post.id ? (
                      <div className="mt-2 space-y-2">
                        <textarea value={editText} onChange={e => setEditText(e.target.value)} className={inputCls + " resize-none"} rows={2} />
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(post.id)} className="bg-pink-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg">Save</button>
                          <button onClick={() => setEditingPost(null)} className="text-gray-500 text-xs px-3 py-1.5">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap">{post.text}</p>
                        {post.imageUrl && <img src={post.imageUrl} alt="attachment" onClick={() => setLightbox(post.imageUrl)} className="w-full max-h-96 object-contain bg-gray-50 mt-3 rounded-lg border border-gray-200 cursor-zoom-in hover:opacity-95 transition-opacity" />}
                        {post.link && <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-pink-600 text-xs hover:underline mt-2 block truncate">{post.link}</a>}
                      </>
                    )}
                    {/* Reactions */}
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {emojis.map(emoji => {
                        const reactors = post.reactions?.[emoji] || [];
                        const count = reactors.length;
                        const reacted = reactors.includes(currentUser?.uid);
                        const key = `${post.id}-${emoji}`;
                        return (
                          <div key={emoji} className="relative">
                            <button
                              onClick={() => handleReact(post.id, emoji)}
                              onMouseEnter={() => count > 0 && setShowReactors(key)}
                              onMouseLeave={() => setShowReactors(null)}
                              className={`text-xs px-1.5 py-0.5 rounded-full border transition-all ${reacted ? 'border-pink-300 bg-pink-50' : 'border-gray-200 hover:bg-gray-50'}`}
                            >
                              {emoji}{count > 0 && <span className="ml-0.5 text-gray-600">{count}</span>}
                            </button>
                            {showReactors === key && count > 0 && (
                              <div className="absolute bottom-full left-0 mb-1 bg-gray-900 text-white text-[10px] rounded-lg px-2 py-1.5 whitespace-nowrap z-10 shadow-lg">
                                {renderReactorProfiles(reactors, post)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <button onClick={() => { setReplyTo(post.id); setReplyText(''); }} className="text-gray-500 text-xs hover:text-pink-600 ml-2">Reply</button>
                      {post.authorId === currentUser?.uid && (
                        <>
                          <button onClick={() => { setEditingPost(post.id); setEditText(post.text); }} className="text-gray-400 text-xs hover:text-gray-600 ml-1">Edit</button>
                          <button onClick={() => handleDelete(post.id)} className="text-gray-400 text-xs hover:text-red-500 ml-1">Delete</button>
                        </>
                      )}
                    </div>
                    {renderReactorSummary(post)}
                    {/* Replies */}
                    {getReplies(post.id).length > 0 && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-3">
                        {getReplies(post.id).map(reply => (
                          <div key={reply.id} className="flex items-start gap-2">
                            {reply.authorPhoto ? (
                              <img src={reply.authorPhoto} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">{(reply.authorName || 'U')[0].toUpperCase()}</div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <a href={`/profile/${encodeURIComponent(reply.authorEmail || '')}`} className="text-gray-900 text-xs font-semibold hover:text-pink-600 hover:underline">{reply.authorName}</a>
                                <span className="text-gray-400 text-[10px]">{formatTime(reply.createdAt)}</span>
                                {reply.editedAt && <span className="text-gray-400 text-[10px] italic">edited</span>}
                              </div>
                              <p className="text-gray-600 text-xs mt-0.5">{reply.text}</p>
                              <div className="flex items-center gap-1 mt-1">
                                {emojis.map(emoji => {
                                  const c = (reply.reactions?.[emoji] || []).length;
                                  const r = (reply.reactions?.[emoji] || []).includes(currentUser?.uid);
                                  return c > 0 || r ? (
                                    <button key={emoji} onClick={() => handleReact(reply.id, emoji)} className={`text-[10px] px-1 py-0.5 rounded-full border ${r ? 'border-pink-300 bg-pink-50' : 'border-gray-200'}`}>
                                      {emoji}{c > 0 && <span className="ml-0.5">{c}</span>}
                                    </button>
                                  ) : null;
                                })}
                                {reply.authorId === currentUser?.uid && (
                                  <button onClick={() => handleDelete(reply.id)} className="text-gray-400 text-[10px] hover:text-red-500 ml-1">Delete</button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Reply input */}
                    {replyTo === post.id && (
                      <div className="mt-3 flex gap-2">
                        <input value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReply(post.id)} className={inputCls + " text-xs"} placeholder="Write a reply..." />
                        <button onClick={() => handleReply(post.id)} className="bg-pink-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex-shrink-0">Reply</button>
                      </div>
                    )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* New post */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <textarea value={newPost} onChange={e => setNewPost(e.target.value)} className={inputCls + " resize-none"} rows={3} placeholder="Share an update, question, or file..." />
            {newPostImage && (
              <div className="relative inline-block">
                <img src={newPostImage.preview} alt="preview" className="max-h-40 rounded-lg border border-gray-200" />
                <button onClick={() => setNewPostImage(null)} className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <input value={newPostLink} onChange={e => setNewPostLink(e.target.value)} className={inputCls + " text-xs flex-1"} placeholder="Attach a link (optional)" />
              <label className="flex-shrink-0 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium px-3 py-2 rounded-lg transition-all flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Image
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </label>
              <button onClick={handlePost} disabled={posting || uploadingImage || (!newPost.trim() && !newPostLink.trim() && !newPostImage)} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-50 transition-all flex-shrink-0">
                {uploadingImage ? 'Uploading...' : posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resources */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          {/* Display resources */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-gray-900">Project Resources</h3>
            {resources.submissionUrl ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div><p className="text-gray-500 text-xs font-medium">Project Submission URL</p><a href={resources.submissionUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 text-sm hover:underline truncate block">{resources.submissionUrl}</a></div>
              </div>
            ) : <p className="text-gray-400 text-xs">No submission URL set</p>}

            {resources.meetingUrl ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div><p className="text-gray-500 text-xs font-medium">Meeting URL</p><a href={resources.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 text-sm hover:underline truncate block">{resources.meetingUrl}</a></div>
              </div>
            ) : <p className="text-gray-400 text-xs">No meeting URL set</p>}

            {resources.detailsUrl ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div><p className="text-gray-500 text-xs font-medium">Project Details URL</p><a href={resources.detailsUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 text-sm hover:underline truncate block">{resources.detailsUrl}</a></div>
              </div>
            ) : <p className="text-gray-400 text-xs">No details URL set</p>}

            {resources.notes && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-xs font-medium mb-1">Important Notes</p>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{resources.notes}</p>
              </div>
            )}
          </div>

          {/* Edit resources - owner only */}
          {isOwner && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <h3 className="text-base font-bold text-gray-900">Edit Resources</h3>
              {resources.submissionUrl && resources.submissionUrl.trim() ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-1">
                  <p className="text-green-800 text-xs font-medium">You are all set. It is advised you also add a meeting link and a project details link, if you haven't done so, to help your team collaborate.</p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-1">
                  <p className="text-amber-800 text-xs font-medium">As project lead, a submission link is required. Use a GitHub repository (free and recommended) or another platform of your choice, so the team's work can be reviewed and badges can be verified on completion.</p>
                </div>
              )}
              <div>
                <label className="block text-gray-500 text-xs font-medium mb-1">Project Submission URL <span className="text-red-500">*</span></label>
                <input type="url" value={resources.submissionUrl} onChange={e => setResources(p => ({ ...p, submissionUrl: e.target.value }))} className={inputCls} placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="block text-gray-500 text-xs font-medium mb-1">Meeting URL</label>
                <input type="url" value={resources.meetingUrl} onChange={e => setResources(p => ({ ...p, meetingUrl: e.target.value }))} className={inputCls} placeholder="https://zoom.us/... or Google Meet link" />
              </div>
              <div>
                <label className="block text-gray-500 text-xs font-medium mb-1">Project Details URL</label>
                <input type="url" value={resources.detailsUrl} onChange={e => setResources(p => ({ ...p, detailsUrl: e.target.value }))} className={inputCls} placeholder="https://docs.google.com/..." />
              </div>
              <div>
                <label className="block text-gray-500 text-xs font-medium mb-1">Important Notes</label>
                <textarea value={resources.notes} onChange={e => setResources(p => ({ ...p, notes: e.target.value }))} className={inputCls + " resize-none"} rows={3} placeholder="Any important updates or notes for the team..." />
              </div>
              <button onClick={handleSaveResources} disabled={savingResources} className="bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-all disabled:opacity-50">
                {savingResources ? 'Saving...' : 'Save Resources'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Team */}
      {activeTab === 'team' && (
        <div className="space-y-3">
          {/* Paid project: compensation table - everyone's pay is visible by design */}
          {project?.isPaid && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-900">Compensation</h3>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">PAID PROJECT</span>
              </div>
              <p className="text-gray-500 text-xs mb-3">Pay per person, per role, set by the project owner. Paid on verified completion. No badges are awarded on paid projects. Leaving mid-project forfeits your pay.</p>
              <div className="space-y-1.5">
                {(project.teamRoles || []).map((r, i) => (
                  <div key={i} className="flex items-center justify-between bg-white border border-amber-100 rounded-lg px-3 py-2">
                    <span className="text-gray-900 text-sm font-medium">{r.role} <span className="text-gray-400 text-xs">x{r.count || 1}</span></span>
                    <span className="text-amber-700 text-sm font-black">{formatMoney(r.payAmount)} / person</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">Team Members</h3>
            {teamMembers.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No team members yet.</p>
            ) : (
              <div className="space-y-3">
                {teamMembers.map((member, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {member.photoURL ? (
                      <img src={member.photoURL} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {(member.applicantName || member.displayName || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <a href={`/profile/${encodeURIComponent(member.applicantEmail)}`} className="text-gray-900 text-sm font-semibold hover:text-pink-600 hover:underline">
                        {member.displayName || member.applicantName}
                      </a>
                      <p className="text-gray-500 text-xs">{member.role}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        {member.portfolioUrl && <a href={member.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 text-[10px] hover:underline">Portfolio</a>}
                        {member.linkedinUrl && <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 text-[10px] hover:underline">LinkedIn</a>}
                      </div>
                    </div>
                    {member.isOwner && (
                      <span className="text-[10px] font-semibold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full flex-shrink-0">Owner</span>
                    )}
                    {project?.isPaid && !member.isOwner && (Number(member.payAmount) || 0) > 0 && (
                      <span className="text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full flex-shrink-0">{formatMoney(member.payAmount)}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leave project (approved members only, not the owner) */}
          {myMembership && !isOwner && project?.status !== 'completed' && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-1">Leave This Project</h3>
              <p className="text-gray-500 text-xs mb-3">
                {project?.isPaid
                  ? 'Leaving a paid project mid-way means you forfeit your pay. You must state your reason, and the departure is automatically flagged for review by the project owner and admin.'
                  : 'You must state your reason for leaving. It will be recorded on the project and visible to the owner and admin.'}
              </p>
              <button onClick={() => setShowLeaveModal(true)} className="text-red-600 border border-red-200 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-lg transition-all">
                Leave Project
              </button>
            </div>
          )}
        </div>
      )}

      {/* Leave-project modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !leaving && setShowLeaveModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Leave "{project?.projectTitle}"?</h3>
            {project?.isPaid && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                <p className="text-red-700 text-xs font-semibold">This is a paid project. If you leave now, you forfeit your pay{myMembership && (Number(myMembership.payAmount) || 0) > 0 ? ` of ${formatMoney(myMembership.payAmount)}` : ''}. Your departure will be automatically flagged for review.</p>
              </div>
            )}
            <label className="block text-gray-600 text-xs font-semibold mb-1">Reason for leaving * (required)</label>
            <textarea value={leaveReason} onChange={e => setLeaveReason(e.target.value)} rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-900 text-sm focus:border-pink-500 focus:outline-none resize-none mb-4"
              placeholder="Explain why you're leaving this project..." />
            <div className="flex gap-2">
              <button onClick={() => setShowLeaveModal(false)} disabled={leaving} className="flex-1 py-2.5 text-gray-600 text-sm font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                Stay on Project
              </button>
              <button onClick={handleLeaveProject} disabled={leaving || !leaveReason.trim()} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-all disabled:opacity-50">
                {leaving ? 'Leaving...' : project?.isPaid ? 'Leave & Forfeit Pay' : 'Leave Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info notice */}
      <div className="mt-8 bg-pink-50 border border-pink-200 rounded-xl p-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-gray-900 text-sm font-semibold mb-0.5">Keep all project conversations here</p>
          <p className="text-gray-600 text-xs leading-relaxed">Use the Discussion tab for all project communications. Conversations logged here serve as your record and can be reviewed by admins if any issue comes up.</p>
        </div>
      </div>

      {/* Image lightbox - tap an attachment to view it full size */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out">
          <img src={lightbox} alt="attachment" className="max-w-full max-h-full rounded-lg object-contain" onClick={e => e.stopPropagation()} />
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 rounded-full w-10 h-10 flex items-center justify-center" aria-label="Close">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectWorkspace;
