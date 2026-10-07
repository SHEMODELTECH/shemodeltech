// src/Pages/projects/ProjectWorkspace.jsx - Workspace with Forum + Resources
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, updateDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, arrayUnion, arrayRemove, where, getDocs, limitToLast } from 'firebase/firestore';
import { db } from '../../firebase/config';
import LeadCheckIn from '../../components/LeadCheckIn';
import DeadlineBanner from '../../components/DeadlineBanner';
import { toast } from 'react-toastify';
import { logActivity } from '../../utils/activityLog';
import { uploadImageToBlob, validateImageFile } from '../../utils/blobStorage';
import { formatMoney } from '../../utils/paidProjects';
import { usePresenceMany } from '../../utils/presence';
import { PresenceView } from '../../components/PresenceBadge';
import EmojiPicker from '../../components/EmojiPicker';
import ReportButton from '../../components/ReportButton';
import { teamForumLink, buildMentionables, findMentions, splitMentions, sendTeamNotices } from '../../utils/teamForum';

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

// A text box that suggests teammates after "@" and inserts "@Full Name".
// Suggestions come only from this project's team (`people`).
const MentionBox = ({ inputRef, value, onChange, people = [], multiline = false, onKeyDown, className = '', ...rest }) => {
  const [match, setMatch] = useState(null); // { start, query }
  const [active, setActive] = useState(0);

  const suggestions = match
    ? people.filter((p) => {
        const q = match.query.toLowerCase();
        if (!q) return true;
        const n = p.name.toLowerCase();
        return n.startsWith(q) || n.split(/\s+/).some((w) => w.startsWith(q));
      }).slice(0, 6)
    : [];
  const open = suggestions.length > 0;

  const detect = (text, cursor) => {
    const before = text.slice(0, cursor);
    const m = before.match(/(^|\s)@([^@\n]{0,30})$/);
    if (!m) { setMatch(null); return; }
    const q = m[2];
    // Stop suggesting once the text after "@" no longer fits any name.
    if (/\s{2,}/.test(q)) { setMatch(null); return; }
    setMatch({ start: before.length - q.length - 1, query: q.trimStart() });
    setActive(0);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    detect(e.target.value, e.target.selectionStart ?? e.target.value.length);
  };

  const pick = (p) => {
    const el = inputRef?.current;
    const cursor = el && typeof el.selectionStart === 'number' ? el.selectionStart : value.length;
    const insert = `@${p.name} `;
    const next = value.slice(0, match.start) + insert + value.slice(cursor);
    onChange(next);
    setMatch(null);
    setTimeout(() => {
      if (el) { el.focus(); el.selectionStart = el.selectionEnd = match.start + insert.length; }
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (open) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % suggestions.length); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + suggestions.length) % suggestions.length); return; }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); pick(suggestions[Math.min(active, suggestions.length - 1)]); return; }
      if (e.key === 'Escape') { e.preventDefault(); setMatch(null); return; }
    }
    if (onKeyDown) onKeyDown(e);
  };

  const Field = multiline ? 'textarea' : 'input';
  return (
    <div className="relative flex-1 min-w-0">
      <Field ref={inputRef} value={value} onChange={handleChange} onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setMatch(null), 150)} className={className} {...rest} />
      {open && (
        <ul role="listbox" className="absolute z-30 left-0 top-full mt-1 w-64 max-w-full bg-white border border-gray-200 rounded-xl shadow-lg py-1">
          {suggestions.map((p, i) => (
            <li key={p.uid} role="option" aria-selected={i === active}>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); pick(p); }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-sm ${i === active ? 'bg-pink-50 text-pink-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                {p.photo
                  ? <img src={p.photo} alt="" className="w-5 h-5 rounded-full object-cover" />
                  : <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center">{p.name.charAt(0).toUpperCase()}</span>}
                <span className="truncate">{p.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ProjectWorkspace = () => {
  const { projectId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  // ?tab=forum|resources|team opens that tab; &post=ID scrolls to a post or reply.
  const [activeTab, setActiveTab] = useState(() => (['forum', 'resources', 'team'].includes(searchParams.get('tab')) ? searchParams.get('tab') : 'forum'));
  const focusPostRef = useRef(searchParams.get('post'));
  const [highlightId, setHighlightId] = useState(null);

  // Forum state
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newPostLink, setNewPostLink] = useState('');
  const [newPostImage, setNewPostImage] = useState(null); // {file, preview}
  const [uploadingImage, setUploadingImage] = useState(false);
  const [posting, setPosting] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyTarget, setReplyTarget] = useState(null); // { uid, name } when replying to a reply
  const [editingPost, setEditingPost] = useState(null);
  const [editText, setEditText] = useState('');
  const newPostRef = useRef(null);
  const replyInputRef = useRef(null);
  const editInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showReactors, setShowReactors] = useState(null); // 'postId-emoji' key
  const [lightbox, setLightbox] = useState(null); // full-size image URL when an image is tapped

  // Resource state
  const [resources, setResources] = useState({ submissionUrl: '', meetingUrl: '', detailsUrl: '', notes: '' });
  const [savingResources, setSavingResources] = useState(false);

  // Team state
  const [teamMembers, setTeamMembers] = useState([]);
  // Which teammates are on She Model Tech right now (Team tab).
  const teamPresence = usePresenceMany(teamMembers.map((m) => m.uid));

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

        // Fetch user profiles for all members in batches of 30 (one query per
        // batch instead of one per member).
        const emails = [...new Set([...members.map((m) => m.applicantEmail), project.submitterEmail].filter(Boolean))];
        const byEmail = {};
        for (let i = 0; i < emails.length; i += 30) {
          try {
            const userSnap = await getDocs(query(collection(db, 'users'), where('email', 'in', emails.slice(i, i + 30))));
            userSnap.docs.forEach((d) => {
              const u = d.data();
              if (u.email && !byEmail[u.email]) byEmail[u.email] = { ...u, uid: d.id };
            });
          } catch (e) {}
        }
        const enriched = members.map((m) => {
          const userData = byEmail[m.applicantEmail];
          return userData
            ? { ...m, uid: userData.uid, photoURL: userData.photoURL || null, displayName: userData.displayName || m.applicantName }
            : m;
        });

        // Add owner
        const ownerEntry = {
          applicantName: project.submitterName || project.contactName || 'Project Owner',
          applicantEmail: project.submitterEmail,
          role: 'Project Owner',
          photoURL: project.submitterPhoto || null,
          uid: byEmail[project.submitterEmail]?.uid || null,
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
    // Keep the live listener bounded: the most recent 500 posts and replies.
    const q = query(collection(db, 'projects', projectId, 'forum'), orderBy('createdAt', 'asc'), limitToLast(500));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      },
      (err) => console.error('Error listening to the forum:', err)
    );
    return () => unsub();
  }, [projectId]);

  // Release the image preview's object URL when it is replaced, removed, or on unmount.
  useEffect(() => {
    const url = newPostImage?.preview;
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [newPostImage]);

  // Follow ?tab= when it changes (e.g. opening a notification while already here).
  useEffect(() => {
    const t = searchParams.get('tab');
    if (['forum', 'resources', 'team'].includes(t)) setActiveTab(t);
    if (searchParams.get('post')) focusPostRef.current = searchParams.get('post');
  }, [searchParams]);

  useEffect(() => {
    if (activeTab !== 'forum') return;
    const target = focusPostRef.current;
    if (target) {
      // Opened from a link to one post or reply: scroll to it once it has loaded.
      if (!posts.some((p) => p.id === target)) return;
      focusPostRef.current = null;
      setTimeout(() => {
        document.getElementById(`forum-${target}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightId(target);
        setTimeout(() => setHighlightId(null), 2500);
      }, 50);
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [posts, activeTab]);

  const isOwner = project?.submitterId === currentUser?.uid || project?.submitterEmail === currentUser?.email;

  // Forum: who can be @mentioned (this team only) and who hears about new posts.
  const ownerFallback = project?.submitterId ? [{ uid: project.submitterId, applicantName: project.submitterName || project.contactName || 'Project Owner' }] : [];
  const forumPeople = buildMentionables([...teamMembers, ...ownerFallback], project?.observerInfo || []);
  const mentionPeople = forumPeople.filter((p) => p.uid !== currentUser?.uid);
  const teamName = project?.projectTitle || project?.title || 'your project';
  const myName = currentUser?.displayName || currentUser?.email || 'A teammate';
  const snippet = (t) => { const x = (t || '').replace(/\s+/g, ' ').trim(); return x.length > 120 ? `${x.slice(0, 117)}...` : x; };

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
            type: project.isPaid ? 'payment_disputed' : 'member_left',
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
      const text = newPost.trim();
      const mentions = findMentions(text, mentionPeople);
      const ref = await addDoc(collection(db, 'projects', projectId, 'forum'), {
        text,
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
        mentions,
      });
      // Tell the rest of the team: a mention notice for anyone tagged, a
      // new-post notice for everyone else (one notice each).
      const link = teamForumLink(projectId, ref.id);
      const body = snippet(text) || (imageUrl ? 'Shared an image.' : 'Shared a link.');
      sendTeamNotices(currentUser.uid, [
        ...mentions.map((uid) => [uid, { type: 'team_mention', title: `${myName} mentioned you in ${teamName}`, body, link, ctaLabel: 'Open the discussion' }]),
        ...forumPeople.map((p) => [p.uid, { type: 'team_post', title: `${myName} posted in ${teamName}`, body, link, ctaLabel: 'Open the discussion' }]),
      ]);
      setNewPost('');
      setNewPostLink('');
      setNewPostImage(null);
    } catch (e) { toast.error('Failed to post'); setUploadingImage(false); }
    setPosting(false);
  };

  const openReply = (postId, target = null) => {
    setReplyTo(postId);
    setEditingPost(null);
    // Replying to a reply: one level of nesting, starting with "@Name ".
    const t = target && target.uid !== currentUser?.uid ? target : null;
    setReplyTarget(t);
    setReplyText(t ? `@${t.name} ` : '');
    setTimeout(() => {
      const el = replyInputRef.current;
      if (el) { el.focus(); el.selectionStart = el.selectionEnd = el.value.length; }
    }, 0);
  };

  const handleReply = async (parentId) => {
    const text = replyText.trim();
    if (!text) return;
    const target = replyTarget;
    try {
      const mentions = findMentions(text, mentionPeople);
      const ref = await addDoc(collection(db, 'projects', projectId, 'forum'), {
        text,
        link: null,
        authorId: currentUser.uid,
        authorEmail: currentUser.email,
        authorName: currentUser.displayName || currentUser.email,
        authorPhoto: currentUser.photoURL || null,
        createdAt: serverTimestamp(),
        editedAt: null,
        reactions: {},
        parentId,
        mentions,
        replyToUid: target?.uid || null,
      });
      setReplyTo(null);
      setReplyText('');
      setReplyTarget(null);
      // One notice each: the person replied to, then anyone tagged, then the
      // post's author, then everyone who already replied in this thread.
      const parent = posts.find((p) => p.id === parentId);
      const link = teamForumLink(projectId, ref.id);
      const body = snippet(text);
      const n = (type, title) => ({ type, title, body, link, ctaLabel: 'Open the discussion' });
      sendTeamNotices(currentUser.uid, [
        ...(target ? [[target.uid, n('team_reply', `${myName} replied to you in ${teamName}`)]] : []),
        ...mentions.map((uid) => [uid, n('team_mention', `${myName} mentioned you in ${teamName}`)]),
        ...(parent?.authorId ? [[parent.authorId, n('team_reply', `${myName} replied to your post in ${teamName}`)]] : []),
        ...posts.filter((p) => p.parentId === parentId).map((p) => [p.authorId, n('team_reply', `${myName} also replied to a post in ${teamName}`)]),
      ]);
    } catch (e) { toast.error('Failed to reply'); }
  };

  // Edit your own post or reply. Anyone newly tagged in the edit is told once.
  const handleEdit = async (postId) => {
    const text = editText.trim();
    if (!text) return;
    const item = posts.find((p) => p.id === postId);
    try {
      const mentions = findMentions(text, mentionPeople);
      await updateDoc(doc(db, 'projects', projectId, 'forum', postId), {
        text,
        editedAt: serverTimestamp(),
        mentions,
      });
      setEditingPost(null);
      setEditText('');
      // Older posts have no `mentions` field: also count tags already in the text.
      const before = [...(item?.mentions || []), ...findMentions(item?.text, mentionPeople)];
      const added = mentions.filter((uid) => !before.includes(uid));
      if (added.length) {
        const link = teamForumLink(projectId, postId);
        sendTeamNotices(currentUser.uid, added.map((uid) => [uid, { type: 'team_mention', title: `${myName} mentioned you in ${teamName}`, body: snippet(text), link, ctaLabel: 'Open the discussion' }]));
      }
    } catch (e) { toast.error('Failed to edit'); }
  };

  const startEdit = (item) => {
    setEditingPost(item.id);
    setEditText(item.text || '');
    setReplyTo(null);
  };

  // Show "@Full Name" tags in pink.
  const renderText = (text) => splitMentions(text, forumPeople).map((seg, i) => (
    seg.mention
      ? <span key={i} className="text-pink-600 font-semibold">{seg.text}</span>
      : <React.Fragment key={i}>{seg.text}</React.Fragment>
  ));

  const reportTarget = (item, kind) => ({
    area: 'team_forum',
    kind,
    path: `projects/${projectId}/forum/${item.id}`,
    link: teamForumLink(projectId, item.id),
    excerpt: snippet(item.text),
    authorUid: item.authorId || null,
    authorName: item.authorName || '',
  });
  const me = currentUser ? { uid: currentUser.uid, name: myName } : null;

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
  // Group replies once per render instead of scanning every post for each thread.
  const repliesByParent = {};
  posts.forEach(p => { if (p.parentId) (repliesByParent[p.parentId] = repliesByParent[p.parentId] || []).push(p); });
  const getReplies = (parentId) => repliesByParent[parentId] || [];
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
      <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
        <h1 className="text-2xl font-bold text-gray-900">{project.projectTitle || project.title} - Workspace</h1>
        {isOwner && (
          <Link
            to={`/projects/owner-dashboard?project=${projectId}`}
            className="inline-flex items-center gap-1.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Manage project
          </Link>
        )}
      </div>

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
              <div key={post.id} id={`forum-${post.id}`} className={`bg-white border rounded-xl p-4 transition-colors ${highlightId === post.id ? 'border-pink-400 ring-2 ring-pink-100' : 'border-gray-200'}`}>
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
                        <MentionBox multiline inputRef={editInputRef} value={editText} onChange={setEditText} people={mentionPeople} className={inputCls + " resize-none"} rows={2} />
                        <div className="flex items-center gap-2">
                          <EmojiPicker targetRef={editInputRef} value={editText} onChange={setEditText} up={false} />
                          <button onClick={() => handleEdit(post.id)} className="bg-pink-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg">Save</button>
                          <button onClick={() => setEditingPost(null)} className="text-gray-500 text-xs px-3 py-1.5">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap">{renderText(post.text)}</p>
                        {post.imageUrl && <img src={post.imageUrl} alt="attachment" loading="lazy" onClick={() => setLightbox(post.imageUrl)} className="w-full max-h-96 object-contain bg-gray-50 mt-3 rounded-lg border border-gray-200 cursor-zoom-in hover:opacity-95 transition-opacity" />}
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
                      <button onClick={() => openReply(post.id)} className="text-gray-500 text-xs hover:text-pink-600 ml-2">Reply</button>
                      {post.authorId === currentUser?.uid && (
                        <>
                          <button onClick={() => startEdit(post)} className="text-gray-400 text-xs hover:text-gray-600 ml-1">Edit</button>
                          <button onClick={() => handleDelete(post.id)} className="text-gray-400 text-xs hover:text-red-500 ml-1">Delete</button>
                        </>
                      )}
                      <ReportButton target={reportTarget(post, 'post')} me={me} className="ml-1" />
                    </div>
                    {renderReactorSummary(post)}
                    {/* Replies */}
                    {getReplies(post.id).length > 0 && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-3">
                        {getReplies(post.id).map(reply => (
                          <div key={reply.id} id={`forum-${reply.id}`} className={`flex items-start gap-2 rounded-lg transition-colors ${highlightId === reply.id ? 'bg-pink-50' : ''}`}>
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
                              {editingPost === reply.id ? (
                                <div className="mt-1 flex items-center gap-2">
                                  <MentionBox inputRef={editInputRef} value={editText} onChange={setEditText} people={mentionPeople}
                                    onKeyDown={e => { if (e.key === 'Enter') handleEdit(reply.id); if (e.key === 'Escape') setEditingPost(null); }}
                                    className={inputCls + " text-xs"} />
                                  <EmojiPicker targetRef={editInputRef} value={editText} onChange={setEditText} up={false} />
                                  <button onClick={() => handleEdit(reply.id)} className="bg-pink-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex-shrink-0">Save</button>
                                  <button onClick={() => setEditingPost(null)} className="text-gray-500 text-xs px-2 py-1.5 flex-shrink-0">Cancel</button>
                                </div>
                              ) : (
                                <p className="text-gray-600 text-xs mt-0.5 whitespace-pre-wrap">{renderText(reply.text)}</p>
                              )}
                              <div className="flex items-center gap-1 mt-1 flex-wrap">
                                {emojis.map(emoji => {
                                  const c = (reply.reactions?.[emoji] || []).length;
                                  const r = (reply.reactions?.[emoji] || []).includes(currentUser?.uid);
                                  return c > 0 || r ? (
                                    <button key={emoji} onClick={() => handleReact(reply.id, emoji)} className={`text-[10px] px-1 py-0.5 rounded-full border ${r ? 'border-pink-300 bg-pink-50' : 'border-gray-200'}`}>
                                      {emoji}{c > 0 && <span className="ml-0.5">{c}</span>}
                                    </button>
                                  ) : null;
                                })}
                                <button
                                  onClick={() => openReply(post.id, { uid: reply.authorId, name: forumPeople.find(p => p.uid === reply.authorId)?.name || reply.authorName })}
                                  className="text-gray-500 text-[10px] hover:text-pink-600 ml-1">Reply</button>
                                {reply.authorId === currentUser?.uid && (
                                  <>
                                    <button onClick={() => startEdit(reply)} className="text-gray-400 text-[10px] hover:text-gray-600 ml-1">Edit</button>
                                    <button onClick={() => handleDelete(reply.id)} className="text-gray-400 text-[10px] hover:text-red-500 ml-1">Delete</button>
                                  </>
                                )}
                                <ReportButton target={reportTarget(reply, 'reply')} me={me} className="!text-[10px] ml-1" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Reply input */}
                    {replyTo === post.id && (
                      <div className="mt-3 flex items-center gap-2">
                        <MentionBox inputRef={replyInputRef} value={replyText} onChange={setReplyText} people={mentionPeople}
                          onKeyDown={e => { if (e.key === 'Enter') handleReply(post.id); if (e.key === 'Escape') { setReplyTo(null); setReplyTarget(null); } }}
                          className={inputCls + " text-xs"} placeholder={replyTarget ? `Reply to ${replyTarget.name}...` : 'Write a reply... (type @ to tag a teammate)'} />
                        <EmojiPicker targetRef={replyInputRef} value={replyText} onChange={setReplyText} />
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
            <MentionBox multiline inputRef={newPostRef} value={newPost} onChange={setNewPost} people={mentionPeople} className={inputCls + " resize-none"} rows={3} placeholder="Share an update, question, or file... Type @ to tag a teammate." />
            {newPostImage && (
              <div className="relative inline-block">
                <img src={newPostImage.preview} alt="preview" className="max-h-40 rounded-lg border border-gray-200" />
                <button onClick={() => setNewPostImage(null)} className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <EmojiPicker targetRef={newPostRef} value={newPost} onChange={setNewPost} />
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
            {(project.observerInfo || []).length > 0 && (
              <div className="mb-5">
                <h3 className="text-base font-bold text-gray-900 mb-2">Organization and trainers</h3>
                <p className="text-xs text-gray-500 mb-3">They follow this workspace and take part in the Discussion.</p>
                <div className="flex flex-wrap gap-2">
                  {project.observerInfo.map((o) => (
                    <span key={o.uid} className="text-sm bg-pink-50 text-pink-800 border border-pink-100 rounded-full px-3 py-1">
                      {o.name} <span className="text-pink-500 text-xs">· {o.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
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
                      <PresenceView info={teamPresence[member.uid]} className="mt-0.5" />
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
