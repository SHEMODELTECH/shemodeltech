// src/Pages/ProofWall.jsx
// The Proof Wall - a feed of verified achievements (not social posts).
// Reads system-generated events + limited work updates from the `activity` collection.
// Members can share a work-focused project update; everything else is auto-generated proof.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getActivity, logActivity, ACTIVITY_TYPES, toggleCelebrate, editUpdate, deleteActivityItem } from '../utils/activityFeed';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';
import { uploadImageToBlob, validateImageFile } from '../utils/blobStorage';
import { MentionTextarea } from '../components/MentionTextarea';

const fmtAgo = (ts) => {
  try {
    const d = ts?.toDate ? ts.toDate() : (ts ? new Date(ts) : null);
    if (!d) return '';
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString();
  } catch { return ''; }
};

// Icon + color treatment per activity type (badge-forward "trophy wall" feel).
const typeStyle = {
  badge:     { bg: 'bg-amber-100',  fg: 'text-amber-600',  shape: 'rounded-xl', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ship:      { bg: 'bg-green-100',  fg: 'text-green-600',  shape: 'rounded-xl', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  lead:      { bg: 'bg-blue-100',   fg: 'text-blue-600',   shape: 'rounded-xl', icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 2H21l-3 6 3 6h-8.5l-1-2H5a2 2 0 00-2 2zm9-13.5V9' },
  milestone: { bg: 'bg-purple-100', fg: 'text-purple-600', shape: 'rounded-xl', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  update:    { bg: 'bg-gray-100',   fg: 'text-gray-600',   shape: 'rounded-full', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
};

// Render the headline sentence for each event type.
const renderHeadline = (a) => {
  const name = <span className="font-semibold">{a.actorName || 'A member'}</span>;
  const proj = a.projectTitle ? <span className="font-semibold">{a.projectTitle}</span> : null;
  switch (a.type) {
    case 'badge':
      return <>{name} earned the <span className="font-semibold">{a.badgeName}</span> badge</>;
    case 'ship':
      return <>{name} shipped {proj}</>;
    case 'lead':
      return a.actorId
        ? <>{name} stepped up to lead {proj}</>
        : <>{proj} is looking for a lead</>;
    case 'milestone':
      return <>{name} {a.meta ? a.meta.replace(/^Completed /, 'completed ') : 'reached a milestone'}</>;
    case 'update':
      return <>{name} posted an update on {proj}</>;
    default:
      return <>{name}</>;
  }
};

const FILTERS = [
  { id: 'all', label: 'All Activity' },
  { id: 'update', label: 'Updates' },
  { id: 'lead', label: 'Needs a lead' },
  { id: 'open', label: 'Open projects' },
];

// Companies see All Activity, Updates plus a "Top Talent" discovery tab (recent badge
// earners). Individuals get the contributor tabs.
const COMPANY_FILTERS = [
  { id: 'all', label: 'All Activity' },
  { id: 'update', label: 'Updates' },
  { id: 'talent', label: 'Top Talent' },
];
const filtersFor = (isCompany) => isCompany ? COMPANY_FILTERS : FILTERS;

// Filter ids that map directly to an activity `type` in the feed. Everything else
// ('all', 'open', 'talent') loads the unfiltered feed and/or its own data source.
const ACTIVITY_TYPE_FILTERS = ['update', 'lead', 'badge', 'ship', 'milestone'];

const ProofWall = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [posterInfo, setPosterInfo] = useState({}); // actorId -> { photoURL, email, name }
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null); // full-size image URL when an image is tapped
  const [filter, setFilter] = useState('all');
  const [myData, setMyData] = useState(null);

  // Share-update composer
  const [showCompose, setShowCompose] = useState(false);
  const [updateText, setUpdateText] = useState('');
  const [updateProject, setUpdateProject] = useState('');
  const [updateLink, setUpdateLink] = useState('');
  const [updateImage, setUpdateImage] = useState(null); // {file, preview}
  const [updateMentions, setUpdateMentions] = useState([]); // [{uid, name}]
  const [uploadingImg, setUploadingImg] = useState(false);
  const [posting, setPosting] = useState(false);

  // Inline edit state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editProject, setEditProject] = useState('');

  const uid = currentUser?.uid;

  // Optimistic celebrate toggle
  const handleCelebrate = async (a) => {
    if (!uid) return;
    const celebrated = (a.celebratedBy || []).includes(uid);
    const myName = myData?.displayName || currentUser?.displayName || 'You';
    const myPhoto = myData?.photoURL || currentUser?.photoURL || '';
    setItems(prev => prev.map(x => {
      if (x.id !== a.id) return x;
      const names = { ...(x.celebratedByNames || {}) };
      const photos = { ...(x.celebratedByPhotos || {}) };
      if (celebrated) { delete names[uid]; delete photos[uid]; }
      else { names[uid] = myName; photos[uid] = myPhoto; }
      return {
        ...x,
        celebratedBy: celebrated ? (x.celebratedBy || []).filter(u => u !== uid) : [...(x.celebratedBy || []), uid],
        celebrateCount: Math.max(0, (x.celebrateCount || 0) + (celebrated ? -1 : 1)),
        celebratedByNames: names,
        celebratedByPhotos: photos,
      };
    }));
    try {
      await toggleCelebrate(a.id, uid, celebrated, myName, myPhoto);
    } catch (e) {
      console.error(e);
      toast.error('Could not update reaction.');
      load(filter);
    }
  };

  const startEdit = (a) => {
    setEditingId(a.id);
    setEditText(a.text || '');
    setEditProject(a.projectTitle || '');
  };

  const saveEdit = async (a) => {
    if (!editText.trim()) { toast.error('Update can\'t be empty.'); return; }
    try {
      await editUpdate(a.id, editText.trim(), editProject.trim());
      setItems(prev => prev.map(x => x.id === a.id ? { ...x, text: editText.trim(), projectTitle: editProject.trim() } : x));
      setEditingId(null);
      toast.success('Update edited.');
    } catch (e) { console.error(e); toast.error('Could not save edit.'); }
  };

  const handleDelete = async (a) => {
    if (!window.confirm('Delete this update? This cannot be undone.')) return;
    try {
      await deleteActivityItem(a.id);
      setItems(prev => prev.filter(x => x.id !== a.id));
      toast.success('Update deleted.');
    } catch (e) { console.error(e); toast.error('Could not delete.'); }
  };

  const load = useCallback(async (f) => {
    setLoading(true);
    // 'all' (and non-type tabs like 'open'/'talent') load the unfiltered feed.
    const typeFilter = ACTIVITY_TYPE_FILTERS.includes(f) ? f : null;
    setItems(await getActivity(50, typeFilter));
    setLoading(false);
  }, []);

  // Open projects: have a lead (status 'active') and are still accepting collaborator
  // applications (applicationsOpen !== false). Queried live so closed ones drop off.
  const [openProjects, setOpenProjects] = useState([]);
  const [loadingOpen, setLoadingOpen] = useState(false);

  useEffect(() => {
    if ((filter !== 'open' && filter !== 'all') || myData?.isCompany) return;
    let active = true;
    (async () => {
      setLoadingOpen(true);
      try {
        const { collection: col, getDocs, query: q, where } = await import('firebase/firestore');
        // Avoid composite-index needs: filter by status only, then refine in JS.
        const snap = await getDocs(q(col(db, 'projects'), where('status', '==', 'active')));
        const list = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(p => p.applicationsOpen !== false);
        if (active) setOpenProjects(list);
      } catch (e) {
        console.error('load open projects failed', e);
        if (active) setOpenProjects([]);
      } finally {
        if (active) setLoadingOpen(false);
      }
    })();
    return () => { active = false; };
  }, [filter, myData]);

  // Top Talent (companies): members who recently earned badges or are highly rated
  // for teaching community Foundations. Each links to their profile.
  const [talent, setTalent] = useState([]);
  const [loadingTalent, setLoadingTalent] = useState(false);

  useEffect(() => {
    if ((filter !== 'talent' && filter !== 'all') || !myData?.isCompany) return;
    let active = true;
    (async () => {
      setLoadingTalent(true);
      try {
        const { collection: col, getDocs, query: q, where, limit: lim } = await import('firebase/firestore');

        // 1) Recent badge earners from the activity feed.
        const badgeSnap = await getDocs(q(col(db, 'activity'), where('type', '==', 'badge'), lim(50)));
        const badgeByUser = new Map();
        badgeSnap.docs.forEach(d => {
          const a = d.data();
          if (a.actorId && !badgeByUser.has(a.actorId)) {
            badgeByUser.set(a.actorId, { uid: a.actorId, name: a.actorName, badgeName: a.badgeName, reason: 'badge', createdAt: a.createdAt });
          }
        });

        // 2) Highly-rated community teachers — hidden from the UI for now.
        // Firestore query/logic left in place (commented) so this is easy to restore.
        const teachByUser = new Map();
        // const contribSnap = await getDocs(q(col(db, 'foundationsContributions'), where('status', '==', 'approved'), lim(100)));
        // contribSnap.docs.forEach(d => {
        //   const c = d.data();
        //   const avg = c.ratingCount ? c.ratingSum / c.ratingCount : 0;
        //   if (c.authorId && c.ratingCount > 0) {
        //     const prev = teachByUser.get(c.authorId);
        //     if (!prev || avg > prev.avg) {
        //       teachByUser.set(c.authorId, { uid: c.authorId, name: c.authorName, avg, ratingCount: c.ratingCount, reason: 'teaching' });
        //     }
        //   }
        // });

        // Merge unique users, resolve email + photo for profile links (in parallel).
        const uids = [...new Set([...badgeByUser.keys(), ...teachByUser.keys()])];
        const { doc: dref, getDoc } = await import('firebase/firestore');
        const cards = await Promise.all(uids.map(async (uid) => {
          let email = null, photoURL = null, displayName = null;
          try {
            const us = await getDoc(dref(db, 'users', uid));
            if (us.exists()) { const u = us.data(); email = u.email; photoURL = u.photoURL; displayName = u.displayName; }
          } catch (_) {}
          const b = badgeByUser.get(uid);
          const t = teachByUser.get(uid);
          return {
            uid, email,
            name: displayName || b?.name || t?.name || 'Member',
            photoURL,
            badgeName: b?.badgeName || null,
            teachingAvg: t?.avg || null,
            teachingCount: t?.ratingCount || null,
          };
        }));
        // Sort: teaching-rated first (by avg), then badge earners.
        cards.sort((a, b) => (b.teachingAvg || 0) - (a.teachingAvg || 0));
        if (active) setTalent(cards.slice(0, 30));
      } catch (e) {
        console.error('load talent failed', e);
        if (active) setTalent([]);
      } finally {
        if (active) setLoadingTalent(false);
      }
    })();
    return () => { active = false; };
  }, [filter, myData]);

  // Companies don't see contributor-proof activity (badges, ships, lead recruitment).
  // They still see everyone's project updates and general activity.
  const companyHiddenTypes = ['badge', 'ship', 'lead'];
  const visibleItems = myData?.isCompany
    ? items.filter(a => !companyHiddenTypes.includes(a.type))
    : items;

  useEffect(() => { load(filter); }, [filter, load]);

  // Resolve the poster's avatar + email (for the profile link) once per user.
  useEffect(() => {
    const ids = [...new Set(items.map(a => a.actorId).filter(Boolean))].filter(id => !posterInfo[id]);
    if (ids.length === 0) return;
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(ids.map(async (uid) => {
        try {
          const us = await getDoc(doc(db, 'users', uid));
          if (us.exists()) {
            const u = us.data();
            return [uid, { photoURL: u.photoURL || null, email: u.email || null, name: u.displayName || null }];
          }
        } catch (_) {}
        return [uid, { photoURL: null, email: null, name: null }];
      }));
      if (!cancelled) setPosterInfo(prev => {
        const next = { ...prev };
        entries.forEach(([k, v]) => { next[k] = v; });
        return next;
      });
    })();
    return () => { cancelled = true; };
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid))
      .then(s => { if (s.exists()) setMyData({ uid: currentUser.uid, ...s.data() }); })
      .catch(() => {});
  }, [currentUser]);

  const handlePostUpdate = async () => {
    if (!updateText.trim() || !updateProject.trim()) {
      toast.error('Add a project name and your update.');
      return;
    }
    setPosting(true);
    try {
      // Upload image if one was attached (same Vercel Blob flow as the workspace).
      let imageUrl = null;
      if (updateImage) {
        setUploadingImg(true);
        const result = await uploadImageToBlob(updateImage.file, 'proof-update');
        imageUrl = result?.url || result || null;
        setUploadingImg(false);
      }

      await logActivity({
        type: 'update',
        actorId: currentUser.uid,
        actorName: myData?.displayName || 'A member',
        projectTitle: updateProject.trim(),
        text: updateText.trim(),
        link: updateLink.trim() || null,
        imageUrl,
        mentions: updateMentions,
      });

      // Notification to the author so it shows under "My Posts".
      try {
        await addDoc(collection(db, 'notifications'), {
          userId: currentUser.uid,
          type: 'my_post',
          message: `You shared an update on "${updateProject.trim()}".`,
          isRead: false,
          createdAt: serverTimestamp(),
        });
      } catch (_) {}

      // Notification to each mentioned teammate so it shows under "Mentions".
      for (const m of updateMentions) {
        if (!m.uid || m.uid === currentUser.uid) continue;
        try {
          await addDoc(collection(db, 'notifications'), {
            userId: m.uid,
            type: 'mention',
            message: `${myData?.displayName || 'A member'} mentioned you in an update on "${updateProject.trim()}".`,
            mentionedByName: myData?.displayName || 'A member',
            mentionedByPhoto: myData?.photoURL || null,
            isRead: false,
            createdAt: serverTimestamp(),
          });
        } catch (_) {}
      }

      toast.success('Update shared.');
      setUpdateText(''); setUpdateProject(''); setUpdateLink('');
      setUpdateImage(null); setUpdateMentions([]); setShowCompose(false);
      load(filter);
    } catch (e) {
      console.error(e);
      toast.error('Could not share your update.');
      setUploadingImg(false);
    }
    setPosting(false);
  };

  const handleUpdateImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const v = validateImageFile(file);
    if (v && v.valid === false) { toast.error(v.error || 'Invalid image.'); return; }
    setUpdateImage({ file, preview: URL.createObjectURL(file) });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Proof Wall</h1>
      </div>

      {/* Composer (work-focused, not personal) */}
      {showCompose && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 space-y-3">
          <input
            value={updateProject}
            onChange={e => setUpdateProject(e.target.value)}
            placeholder={myData?.isCompany ? 'What is this update about?' : 'Which project is this about?'}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
          <MentionTextarea
            value={updateText}
            onChange={setUpdateText}
            onMentionSelect={(user) => {
              const uid = user.uid || user.id;
              const name = user.displayName || user.name || user.email;
              setUpdateMentions(prev => prev.some(m => m.uid === uid) ? prev : [...prev, { uid, name }]);
            }}
            placeholder={myData?.isCompany ? 'Share a company update. Type @ to mention someone.' : 'Share a real update on the work. Type @ to mention a team member.'}
            rows={3}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
          />

          {updateMentions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {updateMentions.map(m => (
                <span key={m.uid} className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                  @{m.name}
                  <button onClick={() => setUpdateMentions(prev => prev.filter(x => x.uid !== m.uid))} className="text-blue-400 hover:text-blue-700">×</button>
                </span>
              ))}
            </div>
          )}

          <input
            value={updateLink}
            onChange={e => setUpdateLink(e.target.value)}
            placeholder={myData?.isCompany ? 'Add a link (optional)' : 'Link your final result - live site, demo, or published work (optional)'}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />

          {updateImage ? (
            <div className="relative inline-block">
              <img src={updateImage.preview} alt="preview" className="max-h-40 rounded-lg border border-gray-200" />
              <button onClick={() => setUpdateImage(null)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 text-sm">×</button>
            </div>
          ) : (
            <label className="inline-flex items-center gap-2 text-sm text-blue-600 font-medium cursor-pointer">
              <input type="file" accept="image/*" onChange={handleUpdateImageSelect} className="hidden" />
              + Add an image
            </label>
          )}

          <div className="flex justify-end gap-2">
            <button onClick={() => { setShowCompose(false); setUpdateImage(null); setUpdateMentions([]); setUpdateLink(''); }} className="text-gray-500 text-sm font-semibold px-3 py-1.5">Cancel</button>
            <button onClick={handlePostUpdate} disabled={posting || uploadingImg} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg disabled:opacity-50">
              {uploadingImg ? 'Uploading…' : posting ? 'Sharing…' : 'Share update'}
            </button>
          </div>
        </div>
      )}

      {/* Filters + share. The chips live on ONE horizontally-scrollable line so
          they never wrap into a messy stack on phones (standard mobile pattern). */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-5">
        <div className="flex flex-nowrap gap-1.5 flex-1 overflow-x-auto pb-1 -mb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filtersFor(myData?.isCompany).map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full transition-all ${
                filter === f.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCompose(v => !v)}
          className="flex-shrink-0 flex items-center justify-center gap-1.5 w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3.5 py-2.5 sm:py-2 rounded-full transition-all shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          {myData?.isCompany ? 'Company update' : 'Project update'}
        </button>
      </div>

      {/* Wall */}
      {filter === 'talent' && myData?.isCompany ? (
        loadingTalent ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        ) : talent.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z" /></svg>
            </div>
            <p className="text-gray-900 font-semibold">No talent to show yet</p>
            <p className="text-gray-500 text-sm mt-1">Members who earn badges will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {talent.map(m => (
              <div key={m.uid} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3.5">
                {m.photoURL ? (
                  <img src={m.photoURL} alt={m.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">{(m.name || 'M').charAt(0).toUpperCase()}</div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{m.name}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {m.badgeName && <span className="text-xs font-medium px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">🏅 {m.badgeName}</span>}
                    {m.teachingAvg ? <span className="text-xs font-medium px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full">★ {m.teachingAvg.toFixed(1)} teaching{m.teachingCount ? ` (${m.teachingCount})` : ''}</span> : null}
                  </div>
                </div>
                {m.email && (
                  <button
                    onClick={() => navigate(`/profile/${m.email}`)}
                    className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                  >
                    View profile →
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      ) : filter === 'open' && !myData?.isCompany ? (
        loadingOpen ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        ) : openProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-gray-900 font-semibold">No open projects right now</p>
            <p className="text-gray-500 text-sm mt-1">When a project has a lead and is accepting collaborators, it shows up here to apply.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {openProjects.map(p => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900">{p.projectTitle || p.title || 'Untitled project'}</h3>
                    {p.track && <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{p.track}</span>}
                  </div>
                  <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">Accepting collaborators</span>
                </div>
                {(p.description || p.summary) && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{p.description || p.summary}</p>
                )}
                <button
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="mt-3 inline-flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                >
                  View &amp; apply to join →
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        <>
          {/* All Activity extras: open projects (individuals) / top talent (companies) */}
          {filter === 'all' && !myData?.isCompany && openProjects.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-blue-700 text-xs font-bold uppercase tracking-wide">Open projects</p>
                <button onClick={() => setFilter('open')} className="text-blue-600 text-xs font-semibold hover:underline">View all →</button>
              </div>
              <div className="flex flex-col gap-2">
                {openProjects.slice(0, 2).map(p => (
                  <button key={p.id} onClick={() => navigate(`/projects/${p.id}`)} className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2 text-left hover:border-blue-300 transition-all">
                    <span className="text-sm font-semibold text-gray-900 truncate">{p.projectTitle || p.title || 'Untitled project'}</span>
                    <span className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-200">Accepting collaborators</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {filter === 'all' && myData?.isCompany && talent.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-amber-700 text-xs font-bold uppercase tracking-wide">Top talent</p>
                <button onClick={() => setFilter('talent')} className="text-blue-600 text-xs font-semibold hover:underline">View all →</button>
              </div>
              <div className="flex flex-col gap-2">
                {talent.slice(0, 2).map(m => (
                  <div key={m.uid} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2">
                    {m.photoURL ? (
                      <img src={m.photoURL} alt={m.name} className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">{(m.name || 'M').charAt(0).toUpperCase()}</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                      {m.badgeName && <p className="text-[11px] text-amber-700 truncate">🏅 {m.badgeName}</p>}
                    </div>
                    {m.email && (
                      <button onClick={() => navigate(`/profile/${m.email}`)} className="flex-shrink-0 text-blue-600 text-xs font-semibold hover:underline">Profile →</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : visibleItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-gray-900 font-semibold">Nothing here yet</p>
          <p className="text-gray-500 text-sm mt-1">{myData?.isCompany ? 'Updates from across She Model Tech will show up here.' : 'Share a project update, and it shows up here as proof of your work.'}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {visibleItems.map(a => {
            const st = typeStyle[a.type] || typeStyle.update;
            const celebrated = uid && (a.celebratedBy || []).includes(uid);
            const count = a.celebrateCount || 0;
            const isMine = uid && a.actorId === uid && a.type === 'update';
            const isEditing = editingId === a.id;
            return (
              <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4">
                {/* Header: icon + headline, side by side */}
                <div className="flex items-center gap-3">
                  {a.actorId ? (() => {
                    const p = posterInfo[a.actorId] || {};
                    const initial = (a.actorName || 'M').trim().charAt(0).toUpperCase();
                    return (
                      <button
                        type="button"
                        onClick={() => p.email && navigate(`/profile/${p.email}`)}
                        className={`w-10 h-10 rounded-full flex-shrink-0 overflow-hidden ${p.email ? 'cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all' : 'cursor-default'}`}
                        aria-label={p.email ? `View ${a.actorName || 'member'}'s profile` : undefined}
                      >
                        {p.photoURL ? (
                          <img src={p.photoURL} alt={a.actorName || 'member'} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">{initial}</div>
                        )}
                      </button>
                    );
                  })() : (
                    <div className={`w-10 h-10 ${st.shape} ${st.bg} flex items-center justify-center flex-shrink-0`}>
                      <svg className={`w-5 h-5 ${st.fg}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={st.icon} /></svg>
                    </div>
                  )}
                  <div className="min-w-0 flex-1 text-sm sm:text-[15px] text-gray-900 leading-snug">{renderHeadline(a)}</div>
                </div>
                {/* Body: full card width, below the header */}
                <div className="mt-3">

                  {/* Inline edit mode (own updates only) */}
                  {isEditing ? (
                    <div className="mt-2 space-y-2">
                      <input
                        value={editProject}
                        onChange={e => setEditProject(e.target.value)}
                        placeholder="Project name"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      />
                      <textarea
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        rows={2}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(a)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-gray-500 text-xs font-semibold px-3 py-1.5">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    a.type === 'update' && (
                      <div className="mt-1.5">
                        {a.text && <div className="text-sm text-gray-600 leading-relaxed">{a.text}</div>}

                        {/* @mentions */}
                        {Array.isArray(a.mentions) && a.mentions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {a.mentions.map((m, i) => (
                              <span key={m.uid || i} className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">@{m.name}</span>
                            ))}
                          </div>
                        )}

                        {/* image - shown in full (letterboxed) at a glance; click to open full size */}
                        {a.imageUrl && (
                          <img src={a.imageUrl} alt="update" onClick={() => setLightbox(a.imageUrl)} className="w-full max-h-96 mt-3 rounded-lg border border-gray-200 bg-gray-50 object-contain cursor-zoom-in hover:opacity-95 transition-opacity" loading="lazy" />
                        )}

                        {/* link */}
                        {a.link && (
                          <a href={a.link} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 break-all">
                            {a.link}
                          </a>
                        )}
                      </div>
                    )
                  )}

                  {/* Needs-a-lead items are clickable: go to the project to apply. */}
                  {a.type === 'lead' && !myData?.isCompany && (
                    <button
                      onClick={() => navigate(a.projectId ? `/projects/${a.projectId}` : '/projects')}
                      className="inline-flex items-center gap-1 mt-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                    >
                      View &amp; apply to lead →
                    </button>
                  )}

                  <div className="text-xs text-gray-400 mt-1.5">
                    {a.type === 'update' ? 'Project update' : (ACTIVITY_TYPES[a.type]?.label || 'Activity')}
                    {a.meta && a.type !== 'milestone' ? <> · {a.meta}</> : null}
                    {a.createdAt ? <> · {fmtAgo(a.createdAt)}</> : null}
                  </div>

                  {/* Actions row: Love (all) + edit/delete (own updates) */}
                  {!isEditing && (
                    <div className="mt-2.5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCelebrate(a)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
                            celebrated ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          title={celebrated ? 'You loved this' : 'Love this'}
                        >
                          <span aria-hidden="true">{celebrated ? '❤️' : '🤍'}</span>
                          Love{count > 0 ? <span className="font-bold"> · {count}</span> : null}
                        </button>
                        {isMine && (
                          <>
                            <button onClick={() => startEdit(a)} className="text-xs font-semibold text-gray-500 hover:text-gray-800">Edit</button>
                            <button onClick={() => handleDelete(a)} className="text-xs font-semibold text-gray-500 hover:text-red-600">Delete</button>
                          </>
                        )}
                      </div>
                      {count > 0 && a.celebratedByNames && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex -space-x-2">
                            {Object.entries(a.celebratedByNames).slice(0, 5).map(([reactorUid, name]) => {
                              const photo = a.celebratedByPhotos?.[reactorUid];
                              return photo ? (
                                <img key={reactorUid} src={photo} alt={name}
                                  className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                              ) : (
                                <span key={reactorUid} title={name}
                                  className="w-6 h-6 rounded-full border-2 border-white bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                                  {(name || '?').charAt(0).toUpperCase()}
                                </span>
                              );
                            })}
                          </div>
                          <p className="text-xs text-gray-400">
                            Loved by {(() => {
                              const names = Object.values(a.celebratedByNames);
                              if (names.length <= 2) return names.join(' and ');
                              return `${names.slice(0, 2).join(', ')} and ${names.length - 2} other${names.length - 2 > 1 ? 's' : ''}`;
                            })()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
        </>
      )}

      {/* Image lightbox - tap an image to view it full size */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out">
          <img src={lightbox} alt="update" className="max-w-full max-h-full rounded-lg object-contain" onClick={e => e.stopPropagation()} />
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 rounded-full w-10 h-10 flex items-center justify-center" aria-label="Close">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProofWall;
