// src/components/AppLayout.jsx - Left sidebar layout for logged-in pages
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot, doc, getDocs, limit, updateDoc } from 'firebase/firestore';
import { getUserDocCached } from '../utils/firestoreHelpers';
import { db } from '../firebase/config';
import { useFeatures } from '../utils/features';
import { isBlockedForCompany } from '../utils/companyPaths';
import AgeCheck from './AgeCheck';
import EmailConfirmBanner from './EmailConfirmBanner';
import TopBarIcons from './TopBarIcons';
import { ADMIN_SECTIONS } from '../config/adminSections';

const AppLayout = ({ children, flush = false }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadNetwork, setUnreadNetwork] = useState(0);
  const [unreadAccount, setUnreadAccount] = useState(0);
  const [userRole, setUserRole] = useState('member');
  const [isCompany, setIsCompany] = useState(false);
  const [hasBadge, setHasBadge] = useState(false);
  const isStaffUser = userRole === 'admin' || userRole === 'editor';
  // Companies don't run projects or take courses: send them home from those pages.
  useEffect(() => {
    if (isCompany && !isStaffUser && isBlockedForCompany(location.pathname)) navigate('/dashboard', { replace: true });
  }, [isCompany, isStaffUser, location.pathname, navigate]);
  const features = useFeatures();
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Top-bar search: send the typed term to the global Search page. Works on
  // every screen size (the bar is responsive), so this is the single entry
  // point for search across mobile and desktop.
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  // Fetch user role
  useEffect(() => {
    if (!currentUser) return;
    getUserDocCached(currentUser.uid).then(data => {
      if (data) {
        setUserRole(data.role || 'member');
        setIsCompany(!!data.isCompany);
        // Proposing a project unlocks after a member earns her first badge.
        const fromProfile = (Array.isArray(data.badges) && data.badges.length > 0)
          || (data.totalBadges || 0) > 0
          || Object.values(data.badgeCounts || {}).some((n) => Number(n) > 0);
        if (fromProfile) setHasBadge(true);
        else {
          getDocs(query(collection(db, 'member_badges'), where('memberUid', '==', currentUser.uid), limit(1)))
            .then((b) => setHasBadge(!b.empty))
            .catch(() => {});
        }
      }
    }).catch(() => {});
  }, [currentUser]);

  // Unread messages
  useEffect(() => {
    if (!currentUser) return;
    // Capped so a member with a huge inbox doesn't keep thousands of conversations
    // live; 300 covers normal use and the badge shows "9+" at most.
    const q = query(collection(db, 'conversations'), where('participants', 'array-contains', currentUser.uid), limit(300));
    const unsub = onSnapshot(q, (snap) => {
      let total = 0;
      snap.docs.forEach(d => { total += (d.data().unreadBy || {})[currentUser.uid] || 0; });
      setUnreadMessages(total);
    }, () => {});
    return () => unsub();
  }, [currentUser]);

  // All unread notifications
  useEffect(() => {
    if (!currentUser) return;
    // The badges show "9+" at most, so 100 unread is plenty to count.
    const q = query(collection(db, 'notifications'), where('userId', '==', currentUser.uid), where('isRead', '==', false), limit(100));
    const unsub = onSnapshot(q, (snap) => {
      setUnreadNotifications(snap.size);
      // Count network (follow) notifications
      let network = 0, account = 0;
      snap.docs.forEach(d => {
        const type = d.data().type || '';
        if (type === 'follow' || type === 'new_follower' || type.includes('follow')) network++;
        if (type === 'project_completed' || type === 'payment_confirmed' || type === 'payment_confirmation' || type === 'application_approved') account++;
      });
      setUnreadNetwork(network);
      setUnreadAccount(account);
    }, () => {});
    return () => unsub();
  }, [currentUser]);

  // Remember when she was last here (once a day), for "we miss you" emails.
  useEffect(() => {
    if (!currentUser) return;
    const key = `smt_seen_${currentUser.uid}`;
    const today = new Date().toISOString().slice(0, 10);
    try { if (localStorage.getItem(key) === today) return; } catch (_) { /* private mode */ }
    updateDoc(doc(db, 'users', currentUser.uid), { lastSeenAt: new Date().toISOString() })
      .then(() => { try { localStorage.setItem(key, today); } catch (_) { /* ignore */ } })
      .catch(() => {});
  }, [currentUser]);

  // Red number on the installed app's icon (phone and laptop): unread
  // notifications + unread messages. Cleared when everything is read.
  useEffect(() => {
    const n = (unreadNotifications || 0) + (unreadMessages || 0);
    try {
      if (navigator.setAppBadge) {
        if (n > 0) navigator.setAppBadge(n); else navigator.clearAppBadge();
      }
    } catch (_) { /* not supported on this device */ }
  }, [unreadNotifications, unreadMessages]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Projects is a single menu link; its sections (All projects, My projects,
  // Project Vault, Payment disputes, staff tools) are tabs on the project pages
  // (components/ProjectTabs.jsx).

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    // Projects + Workspace: available to individuals AND companies. Companies can
    // browse and view projects and see the paid ones they've posted; they can't
    // apply/lead and can only post 'paid' projects (limits live in the pages).
    // Projects is one link: its sections are tabs on the project pages (ProjectTabs).
    { path: '/projects', label: 'Projects', section: 'projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    // Workspaces and Payment disputes now live under Projects → My projects.
    // Learning (courses). Companies don't take courses, so it's hidden for them (staff still see it).
    { path: '/learning', label: 'Learning', hidden: isCompany && !isStaffUser, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.247m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.247' },
    { path: '/jobs', label: 'Jobs', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    // Events are hidden (Conference replaces them); the code stays for later.
    // She Model Tech Conference page (everyone, companies too).
    { path: '/conference', label: 'Conference', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },
    // Founders: members pitch ideas for She Model Tech Conference and build teams (not for companies).
    { path: '/founders', label: 'Founders', hidden: isCompany && !isStaffUser, icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    { path: '/__retired_organizations', hidden: true, label: 'Work with us', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { path: '/talent-board', label: 'Talent Board', icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z' },
    { path: '/support', label: 'Support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
...(isCompany || userRole === 'admin' || userRole === 'editor' ? [
    { path: '/premium', label: 'Company tiers', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    ] : []),
    { path: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    ...(userRole === 'admin' || userRole === 'editor' ? [
      {
        label: userRole === 'editor' ? 'Editor' : 'Admin',
        isGroup: true,
        group: 'admin',
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
        // Sections under small headings (People, Content, Business, System);
        // a heading only shows when this person can see something under it.
        children: (() => {
          const mine = ADMIN_SECTIONS.filter(([, , who, , moved]) => !moved && (who === 'all' || who === 'reviewer' || userRole === 'admin'));
          const out = [];
          let last = null;
          mine.forEach(([key, label, , group]) => {
            if (group && group !== last) out.push({ heading: group, path: `heading-${group}` });
            last = group;
            out.push({ path: key === 'overview' ? '/admin' : `/admin?tab=${key}`, label });
          });
          return out;
        })(),
      },
    ] : []),
  ];

  // Primary tabs for the mobile bottom navigation bar (phones/handheld only).
  // Capped at five for easy thumb reach.
  const HOME_ICON = 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6';
  const WORKSPACE_ICON = 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z';
  const MESSAGES_ICON = 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z';
  // Messaging lives in the mobile bottom bar (it's hidden from the mobile top
  // bar); on desktop it stays in the top bar instead.
  const mobileTabs = isCompany
    ? [
        { path: '/dashboard', label: 'Home', icon: HOME_ICON },
        { path: '/talent-board', label: 'Talents', icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z' },
        { path: '/jobs', label: 'Jobs', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { path: '/messages', label: 'Messages', icon: MESSAGES_ICON, badge: unreadMessages },
      ]
    : [
        { path: '/dashboard', label: 'Home', icon: HOME_ICON },
        { path: '/projects', label: 'Projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { path: '/my-workspaces', label: 'Workspace', icon: WORKSPACE_ICON },
        { path: '/messages', label: 'Messages', icon: MESSAGES_ICON, badge: unreadMessages },
      ];

  // Every project page (listing, a project, My projects, Vault, disputes, the
  // staff project tools) lights up Projects in the menu.
  const inProjects = (() => {
    const p = location.pathname;
    return p === '/projects' || p.startsWith('/projects/') || p.startsWith('/paid-projects')
      || ['/project-vault', '/disputes', '/my-workspaces', '/admin/cohorts', '/admin/lead-applications', '/admin/projects']
        .some((x) => p === x || p.startsWith(`${x}/`));
  })();

  const isActive = (path) => {
    if (path.startsWith('/admin?tab=') || path === '/admin') {
      const current = location.pathname === '/admin' ? (new URLSearchParams(location.search).get('tab') || 'overview') : null;
      return current === (path === '/admin' ? 'overview' : path.split('tab=')[1]);
    }
    if (path === '/proof-wall') return location.pathname === '/proof-wall';
    if (path === '/dashboard') return location.pathname === '/dashboard';
    // The staff project tools under /admin/... belong to the Projects menu.
    if (path === '/admin') return location.pathname === '/admin';
    if (path === '/projects') {
      // "All Projects" covers the listing and project detail pages, but NOT its
      // sibling sub-menu pages (My Projects) - otherwise both highlight at once.
      const p = location.pathname;
      return p === '/projects' || (p.startsWith('/projects/') && !p.startsWith('/projects/owner-dashboard') && !p.startsWith('/projects/my-projects') && !p.startsWith('/projects/propose') && !p.startsWith('/projects/new-paid') && !p.startsWith('/projects/sponsor-cohort'));
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Keep the Projects group open whenever the user is on one of its pages.
  const projectPaths = ['/projects', '/my-workspaces', '/project-vault', '/disputes', '/admin/cohorts', '/admin/lead-applications', '/admin/reviews', '/admin/projects'];
  const [adminOpen, setAdminOpen] = useState(false);
  useEffect(() => {
    if (projectPaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))) {
      setProjectsOpen(true);
    }
    if (location.pathname === '/admin') setAdminOpen(true);
  }, [location.pathname]);

  const hideSidebar = location.pathname === '/community' || location.pathname.startsWith('/community/');

  return (
    <div className="min-h-screen flex bg-white">
      <AgeCheck />
      {/* Sidebar */}
      {!hideSidebar && (
      <aside className={`print:hidden fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 h-16 sm:h-[72px] border-b border-gray-200">
          {/* Same full She Model Tech wordmark as the public Navbar */}
          <Link to="/dashboard" className="flex-shrink-0">
            <img src="/Images/she-model-tech-logo.png" alt="She Model Tech" className="h-11 sm:h-12 w-auto" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto p-1 text-gray-400 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-3 lg:space-y-4 overflow-y-auto">
          {navItems.filter((item) => {
            if (item.hidden) return false;
            if (isStaffUser) return true;
            // Companies: no projects or workspaces.
            if (isCompany) return !(item.label === 'Projects' || item.path === '/my-workspaces');
            // Members: no Work with us or Talent Board in their menu.
            return !(item.path === '/organizations' || item.path === '/talent-board');
          }).map((item) => {
            // Expandable group (e.g. Projects with sub-items)
            if (item.isGroup) {
              const anyChildActive = item.children.some(c => !c.heading && isActive(c.path));
              const isOpen = item.group === 'admin' ? adminOpen : projectsOpen;
              const toggle = item.group === 'admin' ? setAdminOpen : setProjectsOpen;
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggle(o => !o)}
                    className={`group w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                      anyChildActive ? 'text-pink-700 bg-pink-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} /></svg>
                    <span className="flex-1 text-left">{item.label}</span>
                    <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-[200rem] mt-2' : 'max-h-0'}`}>
                    <div className="ml-5 pl-3 border-l-2 border-gray-100 space-y-2 py-1">
                      {item.children.map(child => child.heading ? (
                        <p key={child.path} className="px-3 pt-3 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 first:pt-1">
                          {child.heading}
                        </p>
                      ) : child.locked ? (
                        <div
                          key={child.path}
                          role="note"
                          aria-disabled="true"
                          title="Unlocks after you complete at least one project as a lead or collaborator and earn your first badge."
                          className="block px-3 py-2 rounded-lg text-sm text-gray-400 cursor-not-allowed"
                        >
                          <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            {child.label}
                          </span>
                          <span className="block text-[11px] leading-snug mt-0.5">Unlocks after you complete a project (as a lead or collaborator) and earn your first badge.</span>
                        </div>
                      ) : (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                            isActive(child.path) ? 'bg-pink-600 text-white font-semibold shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 font-medium'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            // Normal single link
            const active = item.section === 'projects' ? inProjects : isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  active ? 'bg-pink-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.icon && (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} /></svg>
                )}
                <span className="flex-1">{item.label}</span>
                {item.badge > 0 && (
                  <span className={`text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold ${active ? 'bg-white/25 text-white' : 'bg-red-500 text-white'}`}>
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-gray-200 p-3 space-y-2">
          {currentUser && (
            <Link to={`/profile/${currentUser.uid}`} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white text-sm font-bold">
                  {currentUser.displayName?.[0] || 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-gray-900 text-sm font-medium truncate">{currentUser.displayName || 'User'}</p>
                <p className="text-gray-500 text-xs truncate">{currentUser.email}</p>
              </div>
            </Link>
          )}
          <Link to="/logout" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-100 transition-colors">
            Logout
          </Link>
        </div>
      </aside>
      )}

      {/* Overlay */}
      {sidebarOpen && !hideSidebar && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar - sticky, responsive */}
        <header className="print:hidden sticky top-0 z-30 h-16 sm:h-[72px] flex items-center gap-2 sm:gap-4 px-2 sm:px-4 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 lg:px-6">
          <div className="flex items-center gap-2 flex-shrink-0">
            {!hideSidebar && (
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 min-h-[60px] min-w-[44px] flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            )}

          </div>

          {/* Global search bar - LinkedIn-style pill with a bold magnifier on
              the left. This is the only search entry point (it was removed from
              the sidebar and the mobile bottom bar). Responsive: capped at max-w-xl
              on desktop (the spacer below pushes the icons flush right) and it
              shrinks gracefully to fill the available width on phones. */}
          <form onSubmit={handleSearchSubmit} role="search" className="w-full min-w-0 max-w-xl">
            <div className="relative">
              <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="I'm looking for…"
                aria-label="Search"
                className="w-full h-10 sm:h-11 pl-11 pr-4 text-sm rounded-full bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none transition-colors"
              />
            </div>
          </form>

          {/* Desktop-only spacer: pushes the icon group to the far right so the
              account/notification icons anchor to the top-right corner instead of
              floating in the middle. On mobile there's no spare width, so it's off. */}
          <div className="hidden lg:block flex-1" />

          {/* Proof Wall, Messaging, Notifications, Me: the same on every page.
              On phones Messaging lives in the bottom bar instead. */}
          <TopBarIcons unreadMessages={unreadMessages} unreadNotifications={unreadNotifications} messagesOnMobile={false} className="flex-shrink-0 pr-1 lg:pr-0" />
        </header>

        {/* Page content */}
        <main className={flush ? 'flex-1 min-w-0 pb-24 lg:pb-0' : 'flex-1 min-w-0 px-4 pt-4 pb-24 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8 lg:pb-8'}>
          {/* New email/password accounts: confirm the email to post, message and apply. */}
          <EmailConfirmBanner className={flush ? 'mx-4 mt-4 sm:mx-6 lg:mx-8' : ''} />
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation - phones/handheld only. Big, evenly spaced,
          thumb-friendly tabs. Hidden on desktop (sidebar takes over) and while
          the drawer is open. Respects the iOS home-indicator safe area. */}
      {!hideSidebar && (
        <nav className={`print:hidden lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 ${sidebarOpen ? 'hidden' : 'flex'} items-stretch justify-around pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_8px_rgba(0,0,0,0.04)]`}>
          {mobileTabs.map((tab) => {
            const active = tab.path === '/projects' ? inProjects : tab.path ? isActive(tab.path) : false;
            const cls = `relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[60px] active:bg-gray-50 transition-colors ${active ? 'text-pink-600' : 'text-gray-500'}`;
            return (
              <Link key={tab.path} to={tab.path} className={cls}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.2 : 1.9} d={tab.icon} />
                </svg>
                <span className="text-[11px] font-semibold leading-none">{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="absolute top-1.5 right-[20%] bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default AppLayout;
