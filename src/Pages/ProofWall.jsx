// src/Pages/ProofWall.jsx
// The Proof Wall - a feed of verified achievements (not social posts).
// Reads system-generated events + limited work updates from the `activity` collection.
// Members can share a work-focused project update; everything else is auto-generated proof.

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { sendPush } from '../utils/pushNotifications';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getActivity,
  logActivity,
  ACTIVITY_TYPES,
  toggleCelebrate,
  editUpdate,
  deleteActivityItem,
  withoutDeletedProjects,
} from '../utils/activityFeed';
import { doc, getDoc, getDocs, addDoc, collection, serverTimestamp, query, where, documentId, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';
import { uploadImageToBlob, validateImageFile } from '../utils/blobStorage';
import { MentionTextarea } from '../components/MentionTextarea';
import UpdateActions from '../components/UpdateActions';
import FeaturedMentor from '../components/FeaturedMentor';
import EmojiPicker from '../components/EmojiPicker';
import ReportButton from '../components/ReportButton';
import WallActions, { WallStats, useWallView } from '../components/WallActions';
import { loadStats, recordClick, statKey } from '../utils/wallStats';
import { isConfirmEmailError, writeErrorMessage } from '../utils/emailVerification';
import { formatTimeline, industryLabel, levelLabel, roleNames, skillTrackLabel } from '../utils/projectLabels';

const fmtAgo = (ts) => {
  try {
    const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
    if (!d) return '';
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString();
  } catch {
    return '';
  }
};

// Icon + color treatment per activity type (badge-forward "trophy wall" feel).
const typeStyle = {
  badge: {
    bg: 'bg-pink-100',
    fg: 'text-pink-600',
    shape: 'rounded-xl',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  ship: {
    bg: 'bg-gray-100',
    fg: 'text-gray-900',
    shape: 'rounded-xl',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  lead: {
    bg: 'bg-pink-100',
    fg: 'text-pink-600',
    shape: 'rounded-xl',
    icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 2H21l-3 6 3 6h-8.5l-1-2H5a2 2 0 00-2 2zm9-13.5V9',
  },
  milestone: {
    bg: 'bg-pink-100',
    fg: 'text-pink-600',
    shape: 'rounded-xl',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  },
  update: {
    bg: 'bg-gray-100',
    fg: 'text-gray-600',
    shape: 'rounded-full',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
};

// Render the headline sentence for each event type.
// Headlines are clickable: the person opens her profile, the project opens its
// page, and a badge explains how badges work.
const linkCls = 'font-semibold text-gray-900 hover:text-pink-700 hover:underline';
const renderHeadline = (a, go = {}) => {
  const name = go.profile ? (
    <button type="button" onClick={() => go.profile(a)} className={linkCls}>{a.actorName || 'A member'}</button>
  ) : <span className="font-semibold">{a.actorName || 'A member'}</span>;
  const proj = a.projectTitle ? (
    a.projectId && go.project ? (
      <button type="button" onClick={() => go.project(a)} className={linkCls}>{a.projectTitle}</button>
    ) : <span className="font-semibold">{a.projectTitle}</span>
  ) : null;
  switch (a.type) {
    case 'badge':
      return (
        <>
          {name} earned the{' '}
          {go.badges ? (
            <button type="button" onClick={() => go.badges(a)} className={linkCls}>{a.badgeName}</button>
          ) : <span className="font-semibold">{a.badgeName}</span>}{' '}
          badge
        </>
      );
    case 'ship':
      return (
        <>
          {name} shipped {proj}
        </>
      );
    case 'lead':
      return a.actorId ? (
        <>
          {name} stepped up to lead {proj}
        </>
      ) : (
        <>{proj} is looking for a lead</>
      );
    case 'milestone':
      return (
        <>
          {name} {a.meta ? a.meta.replace(/^Completed /, 'completed ') : 'reached a milestone'}
        </>
      );
    case 'update':
      return (
        <>
          {name} posted an update on {proj}
        </>
      );
    default:
      return <>{name}</>;
  }
};

// The same headline as plain text (for reposts and sharing).
const headlineText = (a) => {
  const who = a.actorName || 'A member';
  const proj = a.projectTitle || 'a project';
  switch (a.type) {
    case 'badge': return `${who} earned the ${a.badgeName || ''} badge`.replace(/\s+/g, ' ');
    case 'ship': return `${who} shipped ${proj}`;
    case 'lead': return a.actorId ? `${who} stepped up to lead ${proj}` : `${proj} is looking for a lead`;
    case 'milestone': return `${who} ${a.meta ? a.meta.replace(/^Completed /, 'completed ') : 'reached a milestone'}`;
    default: return `${who} on She Model Tech`;
  }
};

const FILTERS = [
  { id: 'all', label: 'All Activity' },
  { id: 'ship', label: 'Completed' },
  { id: 'badge', label: 'Badges' },
  { id: 'update', label: 'Updates' },
  { id: 'lead', label: 'Needs a lead' },
  { id: 'open', label: 'Open projects' },
];

// Companies see everything members see, plus a Top Talent tab.
const filtersFor = (isCompany) => (isCompany ? [...FILTERS, { id: 'talent', label: 'Top Talent' }] : FILTERS);

// Filter ids that map directly to an activity `type` in the feed. Everything else
// ('all', 'open', 'talent') loads the unfiltered feed and/or its own data source.
const ACTIVITY_TYPE_FILTERS = ['update', 'lead', 'badge', 'ship', 'milestone'];

// Fetch user docs in batches of 30 (one query per chunk instead of one read per user).
const fetchUsersByIds = async (ids) => {
  const unique = [...new Set(ids.filter((id) => typeof id === 'string' && id))];
  const byId = {};
  for (let i = 0; i < unique.length; i += 30) {
    try {
      const snap = await getDocs(query(collection(db, 'users'), where(documentId(), 'in', unique.slice(i, i + 30))));
      snap.docs.forEach((d) => { byId[d.id] = d.data(); });
    } catch (_) {}
  }
  return byId;
};

// A card that counts a view once it's at least half on screen.
const ViewBox = ({ statKey: k, me, ownerUid, onView, ready, children, ...rest }) => {
  const ref = useWallView(k, me, ownerUid, onView, ready);
  return <div ref={ref} {...rest}>{children}</div>;
};

// A short summary of a project: what it is, and what it needs.
const projectBriefText = (p) => String(p?.problemStatement || p?.projectDescription || p?.description || p?.summary || '').trim();
const ProjectBrief = ({ p, showLead = false }) => {
  if (!p) return null;
  const text = projectBriefText(p);
  const roles = roleNames(p);
  const facts = [industryLabel(p.industryTrack), formatTimeline(p.timeline), levelLabel(p.experienceLevel)].filter(Boolean);
  return (
    <div className="mt-2">
      {text && <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{text}</p>}
      {(facts.length > 0 || p.isPaid) && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {p.isPaid && <span className="text-[11px] font-semibold px-2 py-0.5 bg-gray-900 text-white rounded-full">Paid</span>}
          {facts.map((f) => (
            <span key={f} className="text-[11px] font-medium px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">{f}</span>
          ))}
        </div>
      )}
      {roles.length > 0 && (
        <p className="text-xs text-gray-600 mt-2">
          <span className="font-semibold text-gray-900">Roles: </span>
          {roles.slice(0, 4).join(', ')}{roles.length > 4 ? ` and ${roles.length - 4} more` : ''}
        </p>
      )}
      {showLead && p.submitterName && (
        <p className="text-xs text-gray-600 mt-1"><span className="font-semibold text-gray-900">Led by </span>{p.submitterName}</p>
      )}
    </div>
  );
};

const ProofWall = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  // Line the feed up under the top search bar so it starts where the search
  // bar starts (laptop widths; phones use the full width).
  const wallRef = useRef(null);
  const feedRef = useRef(null);
  const [wallShift, setWallShift] = useState(null);
  const [wallMax, setWallMax] = useState(null);
  useEffect(() => {
    const align = () => {
      const search = document.querySelector('form[role="search"]');
      const wall = wallRef.current;
      const feed = feedRef.current;
      if (!search || !wall || !feed || window.innerWidth < 1024) { setWallShift(null); setWallMax(null); return; }
      // Measure the page's content area (inside its padding), which is what the margin moves within.
      const box = wall.parentElement.getBoundingClientRect();
      const cs = getComputedStyle(wall.parentElement);
      const padL = parseFloat(cs.paddingLeft) || 0;
      const padR = parseFloat(cs.paddingRight) || 0;
      const parent = { left: box.left + padL, width: box.width - padL - padR };
      const s = search.getBoundingClientRect();
      const wallRect = wall.getBoundingClientRect();
      const feedRect = feed.getBoundingClientRect();
      const feedOffset = feedRect.left - wallRect.left; // where the feed sits inside the wall
      const desiredFeedLeft = s.left; // the feed starts where the search bar starts
      // The feed is as wide as the search bar, so it ends where the search bar ends
      // (on wide screens the side column and its gap sit beside it).
      const side = feed.nextElementSibling; // the side column (wide screens only)
      const sideW = window.innerWidth >= 1280 && side ? side.getBoundingClientRect().width + (parseFloat(getComputedStyle(wall).columnGap) || 0) : 0;
      const target = Math.min(parent.width, s.width + sideW);
      setWallMax(target);
      const maxShift = Math.max(0, parent.width - target);
      setWallShift(Math.min(maxShift, Math.max(0, desiredFeedLeft - feedOffset - parent.left)));
    };
    align();
    window.addEventListener('resize', align);
    const t = setTimeout(align, 300); // after fonts and the sidebar settle
    return () => { window.removeEventListener('resize', align); clearTimeout(t); };
  }, []);
  // Opened from a shared link (?post=ID): scroll to that update once it loads.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('post');
    if (!id || !items.length) return;
    const el = document.getElementById(`post-${id}`);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.classList.add('ring-2', 'ring-pink-400'); }
  }, [items]);
  const [posterInfo, setPosterInfo] = useState({}); // actorId -> { photoURL, email, name }
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null); // full-size image URL when an image is tapped
  const [filter, setFilter] = useState('all');
  const [myData, setMyData] = useState(null);
  const isAdminRef = useRef(false);
  isAdminRef.current = myData?.role === 'admin';

  // Share-update composer
  const [showCompose, setShowCompose] = useState(false);
  // LinkedIn-style "start a post": the quick buttons open the composer and jump
  // straight to the image picker or the link field.
  const imageInputRef = useRef(null);
  const linkInputRef = useRef(null);
  const openCompose = (focus) => {
    setShowCompose(true);
    setTimeout(() => {
      if (focus === 'photo') imageInputRef.current?.click();
      if (focus === 'link') linkInputRef.current?.focus();
    }, 50);
  };
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
  // Emoji buttons: the composer's MentionTextarea keeps its own ref, so find its textarea.
  const composeWrapRef = useRef(null);
  const composeTextareaRef = { get current() { return composeWrapRef.current?.querySelector('textarea') || null; } };
  const editTextareaRef = useRef(null);

  const uid = currentUser?.uid;
  const me = useMemo(
    () => (uid ? { uid, name: myData?.displayName || currentUser?.displayName || 'A member', photoURL: myData?.photoURL || currentUser?.photoURL || null } : null),
    [uid, myData?.displayName, myData?.photoURL, currentUser?.displayName, currentUser?.photoURL]
  );

  // Views, clicks and reactions for every card (wall_stats).
  const [stats, setStats] = useState({});
  const [statsReady, setStatsReady] = useState(() => new Set()); // cards whose numbers have loaded
  const setStat = useCallback((key, next) => setStats((s) => ({ ...s, [key]: next })), []);
  const addOne = useCallback((key, field) => setStats((s) => ({ ...s, [key]: { ...(s[key] || {}), [field]: ((s[key] || {})[field] || 0) + 1 } })), []);
  // Count a click on a card, then go where it points.
  const clickThen = (key, ownerUid, fn) => () => {
    if (me && recordClick(key, me, ownerUid)) addOne(key, 'clicks');
    if (fn) fn();
  };

  // Optimistic celebrate toggle
  const handleCelebrate = async (a) => {
    if (!uid) return;
    const celebrated = (a.celebratedBy || []).includes(uid);
    const myName = myData?.displayName || currentUser?.displayName || 'You';
    const myPhoto = myData?.photoURL || currentUser?.photoURL || '';
    setItems((prev) =>
      prev.map((x) => {
        if (x.id !== a.id) return x;
        const names = { ...(x.celebratedByNames || {}) };
        const photos = { ...(x.celebratedByPhotos || {}) };
        if (celebrated) {
          delete names[uid];
          delete photos[uid];
        } else {
          names[uid] = myName;
          photos[uid] = myPhoto;
        }
        return {
          ...x,
          celebratedBy: celebrated
            ? (x.celebratedBy || []).filter((u) => u !== uid)
            : [...(x.celebratedBy || []), uid],
          celebrateCount: Math.max(0, (x.celebrateCount || 0) + (celebrated ? -1 : 1)),
          celebratedByNames: names,
          celebratedByPhotos: photos,
        };
      })
    );
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
    if (!editText.trim()) {
      toast.error("Update can't be empty.");
      return;
    }
    try {
      await editUpdate(a.id, editText.trim(), editProject.trim());
      setItems((prev) =>
        prev.map((x) =>
          x.id === a.id ? { ...x, text: editText.trim(), projectTitle: editProject.trim() } : x
        )
      );
      setEditingId(null);
      toast.success('Update edited.');
    } catch (e) {
      console.error(e);
      toast.error('Could not save edit.');
    }
  };

  const handleDelete = async (a) => {
    if (!window.confirm(a.type === 'update' ? 'Delete this update? This cannot be undone.' : 'Remove this from the Proof Wall? This cannot be undone.')) return;
    try {
      await deleteActivityItem(a.id);
      setItems((prev) => prev.filter((x) => x.id !== a.id));
      toast.success(a.type === 'update' ? 'Update deleted.' : 'Removed from the Proof Wall.');
    } catch (e) {
      console.error(e);
      toast.error('Could not delete.');
    }
  };

  const load = useCallback(async (f) => {
    setLoading(true);
    try {
      // 'all' (and non-type tabs like 'open'/'talent') load the unfiltered feed.
      const typeFilter = ACTIVITY_TYPE_FILTERS.includes(f) ? f : null;
      // Hide entries for projects that were deleted (admins also clear them out).
      let rows = await withoutDeletedProjects(await getActivity(50, typeFilter), { cleanUp: isAdminRef.current });
      // "Needs a lead" is only the calls for a lead, not "X stepped up to lead".
      if (f === 'lead') rows = rows.filter((r) => !r.actorId);
      setItems(rows);
    } catch (e) {
      console.error('load proof wall failed', e);
      toast.error('Could not load the Proof Wall. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Open projects: have a lead (status 'active') and are still accepting collaborator
  // applications (applicationsOpen !== false). Queried live so closed ones drop off.
  const [openProjects, setOpenProjects] = useState([]);
  const [loadingOpen, setLoadingOpen] = useState(false);

  useEffect(() => {
    if (filter !== 'open' && filter !== 'all') return;
    let active = true;
    (async () => {
      setLoadingOpen(true);
      try {
        const { collection: col, getDocs, query: q, where, limit: lim } = await import('firebase/firestore');
        // Avoid composite-index needs: filter by status only, then refine in JS.
        // Capped so the feed never downloads an unbounded project list. The
        // "all" feed only shows two open projects, so it fetches just a few.
        const snap = await getDocs(q(col(db, 'projects'), where('status', '==', 'active'), lim(filter === 'all' ? 6 : 200)));
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((p) => p.applicationsOpen !== false);
        if (active) setOpenProjects(list);
      } catch (e) {
        console.error('load open projects failed', e);
        if (active) setOpenProjects([]);
      } finally {
        if (active) setLoadingOpen(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [filter]);

  // Top Talent (companies): members who recently earned badges or are highly rated
  // Each links to their profile.
  const [talent, setTalent] = useState([]);
  const [loadingTalent, setLoadingTalent] = useState(false);

  useEffect(() => {
    if ((filter !== 'talent' && filter !== 'all') || !myData?.isCompany) return;
    let active = true;
    (async () => {
      setLoadingTalent(true);
      try {
        const { collection: col, getDocs, query: q, limit: lim } = await import('firebase/firestore');

        // Recent badges, newest first, one card per member: the badge, and the
        // project it was earned on. Members under 18 are never listed.
        let badgeSnap;
        try {
          badgeSnap = await getDocs(q(col(db, 'member_badges'), orderBy('awardedAt', 'desc'), lim(120)));
        } catch (_) {
          badgeSnap = await getDocs(q(col(db, 'member_badges'), lim(120)));
        }
        const badgeRows = badgeSnap.docs.map((d) => d.data())
          .sort((x, y) => (y.awardedAt?.seconds || 0) - (x.awardedAt?.seconds || 0));
        const byUser = new Map();
        badgeRows.forEach((b) => {
          if (!b.memberUid) return;
          const cur = byUser.get(b.memberUid);
          if (!cur) byUser.set(b.memberUid, { latest: b, count: 1 });
          else cur.count += 1;
        });
        const uids = [...byUser.keys()];
        const usersById = await fetchUsersByIds(uids);
        const cards = uids
          .map((id) => {
            const u = usersById[id];
            if (!u || u.isMinor || u.isCompany) return null;
            const { latest } = byUser.get(id);
            return {
              uid: id,
              email: u.email || null,
              name: u.displayName || latest.memberName || 'Member',
              photoURL: u.photoURL || null,
              specialization: u.specialization || '',
              track: skillTrackLabel(u.primarySkillTrack),
              level: levelLabel(u.experienceLevel),
              badgeCount: Array.isArray(u.badges) ? u.badges.length : byUser.get(id).count,
              badgeName: [latest.badgeName, latest.badgeLevel].filter(Boolean).join(' · '),
              badgeProjectId: latest.projectId || null,
              badgeProjectTitle: latest.projectTitle || '',
              badgeAt: latest.awardedAt || null,
            };
          })
          .filter(Boolean);
        if (active) setTalent(cards.slice(0, 30));
      } catch (e) {
        console.error('load talent failed', e);
        if (active) setTalent([]);
      } finally {
        if (active) setLoadingTalent(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [filter, myData]);

  // Companies see the proof (badges earned, projects shipped, updates) that
  // helps them find talent; they don't see calls for leads, which are for members.
  // She Model Tech staff (admins and editors) always see everything.
  const isStaffViewer = ['admin', 'editor'].includes(myData?.role);
  const companyHiddenTypes = []; // companies see everything members see
  const visibleItems = myData?.isCompany && !isStaffViewer
    ? items.filter((a) => !companyHiddenTypes.includes(a.type))
    : items;

  // "Needs a lead" posts show a short summary of the project, so people know
  // what they'd lead before they click.
  const [leadProjects, setLeadProjects] = useState({});
  const leadIdsKey = [...new Set(items.filter((a) => a.type === 'lead' && a.projectId).map((a) => a.projectId))].sort().join(',');
  useEffect(() => {
    const ids = leadIdsKey ? leadIdsKey.split(',') : [];
    if (!ids.length) return undefined;
    let alive = true;
    (async () => {
      const found = {};
      for (let i = 0; i < ids.length; i += 30) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const snap = await getDocs(query(collection(db, 'projects'), where(documentId(), 'in', ids.slice(i, i + 30))));
          snap.docs.forEach((d) => { found[d.id] = { id: d.id, ...d.data() }; });
        } catch (_) { /* no summary for these */ }
      }
      if (alive) setLeadProjects((prev) => ({ ...prev, ...found }));
    })();
    return () => { alive = false; };
  }, [leadIdsKey]);

  // Views, clicks and reactions for the cards on screen.
  const statKeysKey = [
    ...items.map((a) => statKey('a', a.id)),
    ...(filter === 'all' ? openProjects.slice(0, 2) : openProjects).map((p) => statKey('p', p.id)),
    ...talent.map((m) => statKey('t', m.uid)),
  ].filter(Boolean).sort().join(',');
  useEffect(() => {
    const keys = statKeysKey ? statKeysKey.split(',') : [];
    if (!uid || !keys.length) return undefined;
    let alive = true;
    loadStats(keys).then((found) => {
      if (!alive) return;
      setStats((prev) => ({ ...prev, ...found }));
      setStatsReady((prev) => { const next = new Set(prev); keys.forEach((x) => next.add(x)); return next; });
    });
    return () => { alive = false; };
  }, [statKeysKey, uid]);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  // Resolve the poster's avatar + email (for the profile link) once per user.
  useEffect(() => {
    const ids = [...new Set(items.map((a) => a.actorId).filter(Boolean))].filter(
      (id) => !posterInfo[id]
    );
    if (ids.length === 0) return;
    let cancelled = false;
    (async () => {
      const usersById = await fetchUsersByIds(ids);
      const entries = ids.map((uid) => {
        const u = usersById[uid];
        return u
          ? [uid, { photoURL: u.photoURL || null, email: u.email || null, name: u.displayName || null }]
          : [uid, { photoURL: null, email: null, name: null }];
      });
      if (!cancelled)
        setPosterInfo((prev) => {
          const next = { ...prev };
          entries.forEach(([k, v]) => {
            next[k] = v;
          });
          return next;
        });
    })();
    return () => {
      cancelled = true;
    };
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid))
      .then((s) => {
        if (s.exists()) setMyData({ uid: currentUser.uid, ...s.data() });
      })
      .catch(() => {});
  }, [currentUser?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  // Release the composer's image preview URL when it's replaced or the page unmounts.
  useEffect(() => {
    const url = updateImage?.preview;
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [updateImage]);

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

      // Keep only people whose "@First Last" is still in the text.
      const kept = updateMentions.filter((m) => updateText.includes(`@${m.name}`));
      const newPostId = await logActivity({
        type: 'update',
        actorId: currentUser.uid,
        actorName: myData?.displayName || 'A member',
        projectTitle: updateProject.trim(),
        text: updateText.trim(),
        link: updateLink.trim() || null,
        imageUrl,
        mentions: kept,
      }, { throwErrors: true });

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
      for (const m of kept) {
        if (!m.uid || m.uid === currentUser.uid) continue;
        try {
          await addDoc(collection(db, 'notifications'), {
            userId: m.uid,
            type: 'mention',
            link: newPostId ? `/proof-wall?post=${newPostId}` : '/proof-wall',
            message: `${myData?.displayName || 'A member'} mentioned you in an update on "${updateProject.trim()}".`,
            mentionedByName: myData?.displayName || 'A member',
            mentionedByPhoto: myData?.photoURL || null,
            isRead: false,
            createdAt: serverTimestamp(),
          });
        } catch (_) {}
      }
      const tagged = kept.filter((m) => m.uid && m.uid !== currentUser.uid).map((m) => m.uid);
      if (tagged.length) {
        sendPush({
          recipientUids: tagged,
          title: 'You were mentioned',
          body: `${myData?.displayName || 'A member'} mentioned you in an update on "${updateProject.trim()}".`,
          link: newPostId ? `/proof-wall?post=${newPostId}` : '/proof-wall',
          level: 'social',
        });
      }

      toast.success('Update shared.');
      setUpdateText('');
      setUpdateProject('');
      setUpdateLink('');
      setUpdateImage(null);
      setUpdateMentions([]);
      setShowCompose(false);
      // Land on All Activity so the author sees her post in the feed, instead
      // of staying on a tab (e.g. Top Talent) where it will never appear.
      if (filter !== 'all') setFilter('all');
      else load('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
      // Show the real reason. A generic message here cost real debugging time
      // when the actual cause (image storage not configured) was known.
      toast.error(isConfirmEmailError(e)
        ? writeErrorMessage(e)
        : e?.message ? `Could not share your update: ${e.message}` : 'Could not share your update.');
      setUploadingImg(false);
    }
    setPosting(false);
  };

  const handleUpdateImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const v = validateImageFile(file);
    if (v && v.valid === false) {
      toast.error(v.error || 'Invalid image.');
      return;
    }
    setUpdateImage({ file, preview: URL.createObjectURL(file) });
  };

  return (
    // Feed plus a side panel on wide screens (like LinkedIn), so the page sits
    // balanced in the space instead of a narrow column floating off-centre.
    <div ref={wallRef} style={wallShift != null ? { marginLeft: wallShift, marginRight: 0, maxWidth: wallMax || undefined } : undefined} className="w-full max-w-[600px] xl:max-w-[880px] mx-auto xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-6 xl:items-start">
    {/* LinkedIn-like width: a narrower feed with the side panel close beside it,
        and open space on both sides on wide screens. */}
    <div ref={feedRef} className="w-full max-w-[600px] mx-auto lg:max-w-none">
      {/* Header: title + a filter dropdown (like a social feed's "Sort by") */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Proof Wall</h1>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <span className="hidden sm:inline">Show</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter the Proof Wall"
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            {filtersFor(myData?.isCompany).map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Start a post (shown by default, like LinkedIn) */}
      {!showCompose && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 shadow-sm">
          <div className="flex items-center gap-3">
            {myData?.photoURL || currentUser?.photoURL ? (
              <img src={myData?.photoURL || currentUser?.photoURL} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
            ) : (
              <span className="w-12 h-12 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center flex-shrink-0" aria-hidden="true">
                {(myData?.displayName || currentUser?.email || '?')[0].toUpperCase()}
              </span>
            )}
            <button
              onClick={() => openCompose()}
              className="flex-1 text-left rounded-full border border-gray-300 hover:bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-600"
            >
              {myData?.isCompany ? 'Share a company update' : 'Share a project update'}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1 mt-3">
            {[
              ['photo', 'Photo', 'text-pink-600', 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'],
              ['link', 'Link', 'text-gray-900', 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'],
              ['write', myData?.isCompany ? 'Update' : 'Progress', 'text-pink-500', 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'],
            ].map(([k, label, color, d]) => (
              <button
                key={k}
                onClick={() => openCompose(k)}
                className="flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 text-sm font-semibold text-gray-700"
              >
                <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                </svg>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Composer (work-focused, not personal) */}
      {showCompose && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-3">
            {myData?.photoURL || currentUser?.photoURL ? (
              <img src={myData?.photoURL || currentUser?.photoURL} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <span className="w-10 h-10 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center" aria-hidden="true">
                {(myData?.displayName || currentUser?.email || '?')[0].toUpperCase()}
              </span>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">{myData?.displayName || currentUser?.displayName || 'You'}</p>
              <p className="text-xs text-gray-500">Posting to the Proof Wall</p>
            </div>
          </div>
          <input
            value={updateProject}
            onChange={(e) => setUpdateProject(e.target.value)}
            placeholder={
              myData?.isCompany ? 'What is this update about?' : 'Which project is this about?'
            }
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none"
          />
          <div ref={composeWrapRef}>
          <MentionTextarea
            plainNames
            value={updateText}
            onChange={setUpdateText}
            onMentionSelect={(user) => {
              const uid = user.uid || user.id;
              const name = ((user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : (user.displayName || user.name || user.email)).trim();
              setUpdateMentions((prev) =>
                prev.some((m) => m.uid === uid) ? prev : [...prev, { uid, name }]
              );
            }}
            placeholder={
              myData?.isCompany
                ? 'Share a company update. Type @ to mention someone.'
                : 'Share a real update on the work. Type @ to mention a team member.'
            }
            rows={3}
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none resize-none"
          />
          </div>
          <EmojiPicker targetRef={composeTextareaRef} value={updateText} onChange={setUpdateText} up={false} />

          {updateMentions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {updateMentions.map((m) => (
                <span
                  key={m.uid}
                  className="text-xs font-medium px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full flex items-center gap-1"
                >
                  @{m.name}
                  <button
                    onClick={() => setUpdateMentions((prev) => prev.filter((x) => x.uid !== m.uid))}
                    className="text-pink-400 hover:text-pink-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <input
            ref={linkInputRef}
            value={updateLink}
            onChange={(e) => setUpdateLink(e.target.value)}
            placeholder={
              myData?.isCompany
                ? 'Add a link (optional)'
                : 'Link your final result - live site, demo, or published work (optional)'
            }
            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none"
          />

          {updateImage ? (
            <div className="relative inline-block">
              <img
                src={updateImage.preview}
                alt="preview"
                className="max-h-40 rounded-lg border border-gray-200"
              />
              <button
                onClick={() => setUpdateImage(null)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 text-sm"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="inline-flex items-center gap-2 text-sm text-pink-600 font-medium cursor-pointer">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleUpdateImageSelect}
                className="hidden"
              />
              + Add an image
            </label>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowCompose(false);
                setUpdateImage(null);
                setUpdateMentions([]);
                setUpdateLink('');
              }}
              className="text-gray-500 text-sm font-semibold px-3 py-1.5"
            >
              Cancel
            </button>
            <button
              onClick={handlePostUpdate}
              disabled={posting || uploadingImg}
              className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg disabled:opacity-50"
            >
              {uploadingImg ? 'Uploading…' : posting ? 'Sharing…' : 'Share update'}
            </button>
          </div>
        </div>
      )}

      {/* Wall */}
      {filter === 'talent' && myData?.isCompany ? (
        loadingTalent ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          </div>
        ) : talent.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-7 h-7 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z"
                />
              </svg>
            </div>
            <p className="text-gray-900 font-semibold">No talent to show yet</p>
            <p className="text-gray-500 text-sm mt-1">Members who earn badges will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {talent.map((m) => {
              const k = statKey('t', m.uid);
              const profile = m.uid ? `/profile/${m.uid}` : null;
              const facts = [m.track, m.level].filter(Boolean);
              return (
                <ViewBox key={m.uid} statKey={k} me={me} ownerUid={m.uid} onView={() => addOne(k, 'views')} ready={statsReady.has(k)}
                  className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start gap-3.5">
                    {m.photoURL ? (
                      <img src={m.photoURL} alt={m.name} loading="lazy"
                        className="w-12 h-12 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold flex-shrink-0">
                        {(m.name || 'M').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-gray-900 truncate">
                        {profile ? <button type="button" onClick={clickThen(k, m.uid, () => navigate(profile))} className="hover:text-pink-700 hover:underline">{m.name}</button> : m.name}
                      </h3>
                      {m.specialization && <p className="text-xs text-gray-600 truncate">{m.specialization}</p>}
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {m.badgeName && (
                          <span className="text-xs font-medium px-2 py-0.5 bg-pink-50 text-pink-700 rounded-full">🏅 {m.badgeName}</span>
                        )}
                        {facts.map((f) => (
                          <span key={f} className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">{f}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2.5">
                    {m.badgeProjectTitle ? (
                      <>
                        Earned on{' '}
                        {m.badgeProjectId ? (
                          <button type="button" onClick={clickThen(k, m.uid, () => navigate(`/projects/${m.badgeProjectId}`))} className="font-semibold text-gray-900 hover:text-pink-700 hover:underline">{m.badgeProjectTitle}</button>
                        ) : <span className="font-semibold text-gray-900">{m.badgeProjectTitle}</span>}
                        {m.badgeAt ? ` · ${fmtAgo(m.badgeAt)}` : ''}
                      </>
                    ) : 'Badge earned on a She Model Tech project'}
                    {m.badgeCount > 1 ? ` · ${m.badgeCount} badges in total` : ''}
                  </p>
                  {profile && (
                    <button onClick={clickThen(k, m.uid, () => navigate(profile))}
                      className="mt-3 inline-flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all">
                      View profile →
                    </button>
                  )}
                  <WallStats stats={stats[k]} className="mt-3" />
                  {me && (
                    <WallActions
                      card={{ key: k, kind: 'talent', headline: `${m.name}${m.badgeName ? ` · ${m.badgeName}` : ''}`, text: [m.specialization, m.badgeProjectTitle && `Earned on ${m.badgeProjectTitle}`].filter(Boolean).join(' · '), link: profile || '/proof-wall', ownerUid: m.uid, what: 'your Top Talent card', actorId: m.uid, actorName: m.name }}
                      stats={stats[k]}
                      onStats={(next) => setStat(k, next)}
                      me={me}
                    />
                  )}
                </ViewBox>
              );
            })}
          </div>
        )
      ) : filter === 'open' ? (
        loadingOpen ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          </div>
        ) : openProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-7 h-7 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-900 font-semibold">No open projects right now</p>
            <p className="text-gray-500 text-sm mt-1">
              When a project has a lead and is accepting collaborators, it shows up here to apply.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {openProjects.map((p) => {
              const k = statKey('p', p.id);
              const title = p.projectTitle || p.title || 'Untitled project';
              const go = clickThen(k, p.submitterId, () => navigate(`/projects/${p.id}`));
              return (
                <ViewBox key={p.id} statKey={k} me={me} ownerUid={p.submitterId} onView={() => addOne(k, 'views')} ready={statsReady.has(k)}
                  className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="min-w-0 text-sm font-bold text-gray-900">
                      <button type="button" onClick={go} className="text-left hover:text-pink-700 hover:underline">{title}</button>
                    </h3>
                    <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 bg-pink-50 text-pink-700 rounded-full border border-pink-200">
                      Accepting collaborators
                    </span>
                  </div>
                  <ProjectBrief p={p} showLead />
                  <button onClick={go}
                    className="mt-3 inline-flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all">
                    View &amp; apply to join →
                  </button>
                  <WallStats stats={stats[k]} className="mt-3" />
                  {me && (
                    <WallActions
                      card={{ key: k, kind: 'project', headline: `${title} is looking for collaborators`, text: projectBriefText(p).slice(0, 300), link: `/projects/${p.id}`, ownerUid: p.submitterId, what: `your project ${title}`, projectTitle: title }}
                      stats={stats[k]}
                      onStats={(next) => setStat(k, next)}
                      me={me}
                    />
                  )}
                </ViewBox>
              );
            })}
          </div>
        )
      ) : (
        <>
          {/* All Activity extras: open projects (individuals) / top talent (companies) */}
          {filter === 'all' && openProjects.length > 0 && (
            <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 mb-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-pink-700 text-xs font-bold uppercase tracking-wide">
                  Open projects
                </p>
                <button
                  onClick={() => setFilter('open')}
                  className="text-pink-600 text-xs font-semibold hover:underline"
                >
                  View all →
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {openProjects.slice(0, 2).map((p) => (
                  <button
                    key={p.id}
                    onClick={clickThen(statKey('p', p.id), p.submitterId, () => navigate(`/projects/${p.id}`))}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-left hover:border-pink-300 transition-all"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {p.projectTitle || p.title || 'Untitled project'}
                      </span>
                      <span className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 bg-pink-50 text-pink-700 rounded-full border border-pink-200">
                        Accepting collaborators
                      </span>
                    </span>
                    {projectBriefText(p) && <span className="block text-xs text-gray-600 mt-0.5 line-clamp-1">{projectBriefText(p)}</span>}
                    {roleNames(p).length > 0 && <span className="block text-[11px] text-gray-500 mt-0.5 truncate">Roles: {roleNames(p).slice(0, 3).join(', ')}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
          {filter === 'all' && myData?.isCompany && talent.length > 0 && (
            <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 mb-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-pink-700 text-xs font-bold uppercase tracking-wide">
                  Top talent
                </p>
                <button
                  onClick={() => setFilter('talent')}
                  className="text-pink-600 text-xs font-semibold hover:underline"
                >
                  View all →
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {talent.slice(0, 2).map((m) => (
                  <div
                    key={m.uid}
                    className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2"
                  >
                    {m.photoURL ? (
                      <img
                        src={m.photoURL}
                        alt={m.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {(m.name || 'M').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                      {m.badgeName && (
                        <p className="text-[11px] text-pink-700 truncate">🏅 {m.badgeName}{m.badgeProjectTitle ? <span className="text-gray-500"> · on {m.badgeProjectTitle}</span> : null}</p>
                      )}
                    </div>
                    {m.email && (
                      <button
                        onClick={clickThen(statKey('t', m.uid), m.uid, () => navigate(`/profile/${m.uid}`))}
                        className="flex-shrink-0 text-pink-600 text-xs font-semibold hover:underline"
                      >
                        Profile →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-7 h-7 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-900 font-semibold">Nothing here yet</p>
              <p className="text-gray-500 text-sm mt-1">
                {filter === 'ship'
                  ? 'Finished projects show up here.'
                  : filter === 'badge'
                    ? 'Badges show up here as members earn them.'
                    : filter === 'lead'
                      ? 'Projects looking for a lead show up here.'
                      : 'New badges, finished projects, and updates show up here.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {visibleItems.map((a) => {
                const st = typeStyle[a.type] || typeStyle.update;
                const celebrated = uid && (a.celebratedBy || []).includes(uid);
                const count = a.celebrateCount || 0;
                const isMine = uid && a.actorId === uid && a.type === 'update';
                const isEditing = editingId === a.id;
                const k = statKey('a', a.id);
                const owner = a.actorId || null;
                const lp = a.type === 'lead' && a.projectId ? leadProjects[a.projectId] : null;
                const ck = (fn) => clickThen(k, owner, fn);
                return (
                  <ViewBox key={a.id} id={`post-${a.id}`} statKey={k} me={me} ownerUid={owner} onView={() => addOne(k, 'views')} ready={statsReady.has(k)}
                    className="bg-white border border-gray-200 rounded-xl p-4 overflow-hidden scroll-mt-20">
                    {/* Header: icon + headline, side by side */}
                    <div className="flex items-center gap-3">
                      {a.actorId ? (
                        (() => {
                          const p = posterInfo[a.actorId] || {};
                          const initial = (a.actorName || 'M').trim().charAt(0).toUpperCase();
                          return (
                            <button
                              type="button"
                              onClick={() => a.actorId && ck(() => navigate(`/profile/${a.actorId}`))()}
                              className={`w-10 h-10 rounded-full flex-shrink-0 overflow-hidden ${a.actorId ? 'cursor-pointer hover:ring-2 hover:ring-pink-200 transition-all' : 'cursor-default'}`}
                              aria-label={
                                p.email ? `View ${a.actorName || 'member'}'s profile` : undefined
                              }
                            >
                              {p.photoURL ? (
                                <img
                                  src={p.photoURL}
                                  alt={a.actorName || 'member'}
                                  loading="lazy"
                                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center text-sm font-bold">
                                  {initial}
                                </div>
                              )}
                            </button>
                          );
                        })()
                      ) : (
                        <div
                          className={`w-10 h-10 ${st.shape} ${st.bg} flex items-center justify-center flex-shrink-0`}
                        >
                          <svg
                            className={`w-5 h-5 ${st.fg}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={st.icon}
                            />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0 flex-1 text-sm sm:text-[15px] text-gray-900 leading-snug">
                        {renderHeadline(a, {
                          profile: a.actorId ? ck(() => navigate(`/profile/${a.actorId}`)) : undefined,
                          project: a.projectId ? ck(() => navigate(`/projects/${a.projectId}`)) : undefined,
                          badges: ck(() => navigate('/badges')),
                        })}
                      </div>
                    </div>
                    {/* Body: full card width, below the header */}
                    <div className="mt-3">
                      {/* Inline edit mode (own updates only) */}
                      {isEditing ? (
                        <div className="mt-2 space-y-2">
                          <input
                            value={editProject}
                            onChange={(e) => setEditProject(e.target.value)}
                            placeholder="Project name"
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none"
                          />
                          <textarea
                            ref={editTextareaRef}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={2}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:outline-none resize-none"
                          />
                          <div className="flex items-center gap-2">
                            <EmojiPicker targetRef={editTextareaRef} value={editText} onChange={setEditText} up={false} />
                            <button
                              onClick={() => saveEdit(a)}
                              className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-500 text-xs font-semibold px-3 py-1.5"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        a.type === 'update' && (
                          <div className="mt-1.5">
                            {a.text && (
                              <div className="text-sm text-gray-600 leading-relaxed">{a.text}</div>
                            )}

                            {/* @mentions */}
                            {Array.isArray(a.mentions) && a.mentions.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {a.mentions.map((m, i) => (
                                  <span
                                    key={m.uid || i}
                                    className="text-xs font-medium px-2 py-0.5 bg-pink-50 text-pink-600 rounded-full"
                                  >
                                    @{m.name}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* image - shown in full (letterboxed) at a glance; click to open full size */}
                            {a.imageUrl && (
                              <img
                                src={a.imageUrl}
                                alt="update"
                                onClick={ck(() => setLightbox(a.imageUrl))}
                                className="block -mx-4 mt-3 w-[calc(100%+2rem)] max-w-none h-auto max-h-[75vh] object-cover bg-gray-100 cursor-zoom-in hover:opacity-95 transition-opacity"
                                loading="lazy"
                              />
                            )}

                            {/* A repost shows the original update inside it. */}
                            {a.repostOf && (
                              <div className="mt-3 border border-gray-200 rounded-xl overflow-hidden">
                                <div className="p-3">
                                  <p className="text-xs font-semibold text-gray-900">{a.repostOf.actorName}</p>
                                  {a.repostOf.text && <p className="text-sm text-gray-600 mt-1 leading-relaxed">{a.repostOf.text}</p>}
                                  {a.repostOf.link && (
                                    String(a.repostOf.link).startsWith('/') ? (
                                      <button type="button" onClick={ck(() => navigate(a.repostOf.link))} className="mt-1.5 text-xs font-semibold text-pink-700 hover:underline">
                                        {a.repostOf.kind === 'talent' ? 'View profile →' : a.repostOf.kind === 'project' || a.repostOf.kind === 'lead' ? 'View project →' : 'Open →'}
                                      </button>
                                    ) : (
                                      <a href={a.repostOf.link} target="_blank" rel="noopener noreferrer" onClick={ck()} className="block mt-1.5 text-xs font-medium text-pink-600 hover:text-pink-700 break-all">{a.repostOf.link}</a>
                                    )
                                  )}
                                </div>
                                {a.repostOf.imageUrl && (
                                  <img src={a.repostOf.imageUrl} alt="update" onClick={ck(() => setLightbox(a.repostOf.imageUrl))} className="block w-full h-auto max-h-[60vh] object-cover bg-gray-100 cursor-zoom-in" loading="lazy" />
                                )}
                              </div>
                            )}

                            {/* link */}
                            {a.link && (
                              <a
                                href={a.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={ck()}
                                className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-pink-600 hover:text-pink-700 break-all"
                              >
                                {a.link}
                              </a>
                            )}
                          </div>
                        )
                      )}

                      {/* Needs a lead: what the project is and what it needs. */}
                      {a.type === 'lead' && lp && <ProjectBrief p={lp} showLead={!!a.actorId} />}

                      {/* Learn more: the project (or the member's profile for badges). */}
                      {a.type !== 'lead' && a.type !== 'update' && (a.projectId || (a.actorId && posterInfo[a.actorId]?.email)) && (
                        <button
                          onClick={ck(() => ((a.type === 'badge' || !a.projectId)
                            ? navigate(`/profile/${a.actorId}`)
                            : navigate(`/projects/${a.projectId}`)))}
                          className="inline-flex items-center gap-1 mt-2 text-pink-700 hover:text-pink-800 text-xs font-semibold"
                        >
                          {a.type === 'badge' || !a.projectId ? 'View profile →' : 'View project →'}
                        </button>
                      )}
                      {a.type === 'lead' && myData?.isCompany && (
                        <button
                          onClick={ck(() => navigate(a.projectId ? `/projects/${a.projectId}` : '/proof-wall'))}
                          className="inline-flex items-center gap-1 mt-2 text-pink-700 hover:text-pink-800 text-xs font-semibold"
                        >
                          View project →
                        </button>
                      )}
                      {a.type === 'lead' && a.actorId && !myData?.isCompany && (
                        <button
                          onClick={ck(() => navigate(a.projectId ? `/projects/${a.projectId}` : '/projects'))}
                          className="inline-flex items-center gap-1 mt-2 text-pink-700 hover:text-pink-800 text-xs font-semibold"
                        >
                          View project →
                        </button>
                      )}
                      {/* Needs-a-lead items are clickable: go to the project to apply. */}
                      {a.type === 'lead' && !a.actorId && !myData?.isCompany && (
                        <button
                          onClick={ck(() => navigate(a.projectId ? `/projects/${a.projectId}` : '/projects'))}
                          className="inline-flex items-center gap-1 mt-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                        >
                          View &amp; apply to lead →
                        </button>
                      )}

                      <div className="text-xs text-gray-400 mt-1.5">
                        {a.type === 'update'
                          ? 'Project update'
                          : a.type === 'lead' && a.actorId ? 'New lead' : ACTIVITY_TYPES[a.type]?.label || 'Activity'}
                        {a.meta && a.type !== 'milestone' ? <> · {a.meta}</> : null}
                        {a.createdAt ? <> · {fmtAgo(a.createdAt)}</> : null}
                      </div>

                      {!isEditing && <WallStats stats={stats[k]} className="mt-2" />}

                      {/* Everything except updates: React, Repost, Send (no comments). */}
                      {!isEditing && a.type !== 'update' && me && (
                        <WallActions
                          card={{
                            key: k,
                            kind: a.type,
                            headline: headlineText(a),
                            text: a.type === 'lead' && lp ? projectBriefText(lp).slice(0, 300) : (a.meta || ''),
                            link: a.type === 'lead' && a.projectId ? `/projects/${a.projectId}` : `/proof-wall?post=${a.id}`,
                            ownerUid: owner,
                            what: { badge: 'your badge', ship: 'your shipped project', milestone: 'your milestone', lead: 'your post' }[a.type] || 'your post',
                            actorId: owner,
                            actorName: a.actorName,
                            projectTitle: a.projectTitle,
                          }}
                          stats={stats[k]}
                          onStats={(next) => setStat(k, next)}
                          me={me}
                          onReposted={() => load(filter)}
                        />
                      )}

                      {/* Updates only: React, Comment, Repost, Send (plus Edit/Delete on your own). */}
                      {!isEditing && a.type === 'update' && (
                        <div className="mt-2.5">
                          {isMine ? (
                            <div className="flex items-center gap-3 mb-1">
                              <button onClick={() => startEdit(a)} className="text-xs font-semibold text-gray-500 hover:text-gray-800">Edit</button>
                              <button onClick={() => handleDelete(a)} className="text-xs font-semibold text-gray-500 hover:text-red-600">Delete</button>
                            </div>
                          ) : uid && (
                            <div className="flex items-center justify-end gap-3 mb-1">
                              <ReportButton
                                me={{ uid, name: myData?.displayName || currentUser?.displayName || 'A member' }}
                                target={{
                                  area: 'proofwall',
                                  kind: 'post',
                                  path: `activity/${a.id}`,
                                  link: `/proof-wall?post=${a.id}`,
                                  excerpt: a.text || a.repostOf?.text || '',
                                  authorUid: a.actorId || null,
                                  authorName: a.actorName || '',
                                }}
                              />
                            </div>
                          )}
                          {uid && (
                            <UpdateActions
                              a={a}
                              me={{ uid, name: myData?.displayName || currentUser?.displayName || 'A member', photoURL: myData?.photoURL || currentUser?.photoURL || null, isAdmin: myData?.role === 'admin' }}
                              onChange={(next, reposted) => {
                                setItems((xs) => xs.map((x) => (x.id === next.id ? next : x)));
                                if (reposted) load(filter);
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </ViewBox>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Image lightbox - tap an image to view it full size */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={lightbox}
            alt="update"
            className="max-w-full max-h-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 rounded-full w-10 h-10 flex items-center justify-center"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>

    {/* Side panel (wide screens) */}
    <aside className="hidden xl:block sticky top-24 space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="font-bold text-gray-900">About the Proof Wall</p>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          Real updates from real work. Share progress on your projects, celebrate your team, and show what you can
          build.
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="font-bold text-gray-900 mb-3">Keep building</p>
        <div className="space-y-2">
          <a href="/projects" className="block text-sm font-semibold text-pink-700 hover:underline">Find a project to join</a>
          <a href="/learning" className="block text-sm font-semibold text-pink-700 hover:underline">Take a free course</a>
          <a href="/talent-board" className="block text-sm font-semibold text-pink-700 hover:underline">See the Talent Board</a>
        </div>
      </div>
      <FeaturedMentor />
    </aside>
    </div>
  );
};

export default ProofWall;
