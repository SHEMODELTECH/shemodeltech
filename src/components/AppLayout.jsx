// src/components/AppLayout.jsx - Left sidebar layout for logged-in pages
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const AppLayout = ({ children }) => {
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
    getDoc(doc(db, 'users', currentUser.uid)).then(snap => {
      if (snap.exists()) {
        const data = snap.data();
        setUserRole(data.role || 'member');
        setIsCompany(!!data.isCompany);
      }
    }).catch(() => {});
  }, [currentUser]);

  // Unread messages
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'conversations'), where('participants', 'array-contains', currentUser.uid));
    const unsub = onSnapshot(q, (snap) => {
      let total = 0;
      snap.docs.forEach(d => { total += (d.data().unreadBy || {})[currentUser.uid] || 0; });
      setUnreadMessages(total);
    });
    return () => unsub();
  }, [currentUser]);

  // All unread notifications
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'notifications'), where('userId', '==', currentUser.uid), where('isRead', '==', false));
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

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Group project-related sections under one "Projects" menu to reduce clutter.
  // Both individuals and companies get this menu. The account-type limits live in
  // the pages themselves, not the nav: companies can browse/view every project
  // (All Projects, Project Vault) and see the paid projects they've posted (My
  // Projects), but they can't apply to or lead a project and can only create
  // 'paid' projects - enforced in ProjectDetail and ProjectSubmission.
  const projectChildren = [
    { path: '/projects', label: 'All Projects' },
    { path: '/projects/owner-dashboard', label: 'My Projects' },
    { path: '/project-vault', label: 'Project Vault' },
    { path: '/disputes', label: 'Payment Dispute' },
  ];

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    ...(!isCompany ? [{ path: '/foundations', label: 'Foundations', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.247m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.247' }] : []),
    ...(isCompany ? [{ path: '/foundations', label: 'Foundation', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }] : []),
    // Projects + Workspace: available to individuals AND companies. Companies can
    // browse and view projects and see the paid ones they've posted; they can't
    // apply/lead and can only post 'paid' projects (limits live in the pages).
    { label: 'Projects', isGroup: true, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', children: projectChildren },
    { path: '/my-workspaces', label: 'Workspace', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { path: '/proof-wall', label: 'Proof Wall', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { path: '/talent-board', label: 'Talent Board', icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z' },
    { path: '/support', label: 'Support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
    { path: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    ...(userRole === 'admin' ? [
      { path: '/admin', label: 'Admin', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
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
        { path: '/foundations', label: 'Foundation', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        { path: '/talent-board', label: 'Talents', icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z' },
        { path: '/my-workspaces', label: 'Workspace', icon: WORKSPACE_ICON },
        { path: '/messages', label: 'Messages', icon: MESSAGES_ICON, badge: unreadMessages },
      ]
    : [
        { path: '/dashboard', label: 'Home', icon: HOME_ICON },
        { path: '/foundations', label: 'Foundations', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.247m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.247' },
        { path: '/projects', label: 'Projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { path: '/my-workspaces', label: 'Workspace', icon: WORKSPACE_ICON },
        { path: '/messages', label: 'Messages', icon: MESSAGES_ICON, badge: unreadMessages },
      ];

  const isActive = (path) => {
    if (path === '/proof-wall') return location.pathname === '/proof-wall';
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path === '/projects') {
      // "All Projects" covers the listing and project detail pages, but NOT its
      // sibling sub-menu pages (My Projects) - otherwise both highlight at once.
      const p = location.pathname;
      return p === '/projects' || (p.startsWith('/projects/') && !p.startsWith('/projects/owner-dashboard') && !p.startsWith('/projects/my-projects'));
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Keep the Projects group open whenever the user is on one of its pages.
  const projectPaths = ['/projects', '/my-workspaces', '/project-vault', '/disputes'];
  useEffect(() => {
    if (projectPaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))) {
      setProjectsOpen(true);
    }
  }, [location.pathname]);

  const hideSidebar = location.pathname === '/community' || location.pathname.startsWith('/community/');

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      {!hideSidebar && (
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 h-16 sm:h-[72px] border-b border-gray-200">
          <img src="/Images/512X512.png" alt="She Model Tech" className="w-8 h-8" />
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto p-1 text-gray-400 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            // Expandable group (e.g. Projects with sub-items)
            if (item.isGroup) {
              const anyChildActive = item.children.some(c => isActive(c.path));
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setProjectsOpen(o => !o)}
                    className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      anyChildActive ? 'text-pink-700 bg-pink-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} /></svg>
                    <span className="flex-1 text-left">{item.label}</span>
                    <svg className={`w-4 h-4 transition-transform ${projectsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-200 ${projectsOpen ? 'max-h-60 mt-1' : 'max-h-0'}`}>
                    <div className="ml-5 pl-3 border-l-2 border-gray-100 space-y-1.5 py-0.5">
                      {item.children.map(child => (
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
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
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
            <Link to={`/profile/${currentUser.email}`} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
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
        <header className="sticky top-0 z-30 h-16 sm:h-[72px] flex items-center gap-2 sm:gap-4 px-2 sm:px-4 border-b border-gray-200 bg-white lg:px-6">
          <div className="flex items-center gap-2 flex-shrink-0">
            {!hideSidebar && (
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 min-h-[60px] min-w-[44px] flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            )}
            {location.pathname === '/proof-wall' && (
            <a href="/proof-wall" className="hidden lg:flex items-center gap-1 ml-4">
              <img src="/Images/512X512.png" alt="She Model Tech" className="h-9 w-9" />
            </a>
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

          <div className="flex items-center justify-center gap-3 sm:gap-4 lg:gap-6 flex-shrink-0 pr-1 lg:pr-2">
            {/* Messaging - desktop only; on mobile it lives in the bottom bar. */}
            <Link to="/messages" className={`relative hidden lg:flex flex-col items-center justify-center gap-1 px-2 lg:px-3 py-2.5 min-h-[60px] rounded-lg hover:bg-gray-100 transition-colors ${location.pathname === '/messages' ? 'text-pink-600' : 'text-gray-500'}`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="hidden lg:block text-[11px] font-semibold leading-none">Messaging</span>
              {unreadMessages > 0 && (
                <span className="absolute top-1.5 right-[20%] bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </Link>
            {/* Notifications */}
            <Link to="/notifications" className={`relative flex flex-col items-center justify-center gap-1 px-2 lg:px-3 py-2.5 min-h-[60px] rounded-lg hover:bg-gray-100 transition-colors ${location.pathname === '/notifications' ? 'text-pink-600' : 'text-gray-500'}`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="hidden lg:block text-[11px] font-semibold leading-none">Notifications</span>
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-[20%] bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </Link>
            {/* Me */}
            {currentUser && (
              <Link to={`/profile/${currentUser.email}`} className={`flex flex-col items-center justify-center gap-1 px-2 lg:px-3 py-2.5 min-h-[60px] rounded-lg hover:bg-gray-100 transition-colors ${location.pathname.startsWith('/profile') ? 'text-pink-600' : 'text-gray-500'}`}>
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center text-white text-[10px] font-bold">
                    {currentUser.displayName?.[0] || 'U'}
                  </div>
                )}
                <span className="hidden lg:block text-[11px] font-semibold leading-none">Me</span>
              </Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 pt-4 pb-24 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8 lg:pb-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation - phones/handheld only. Big, evenly spaced,
          thumb-friendly tabs. Hidden on desktop (sidebar takes over) and while
          the drawer is open. Respects the iOS home-indicator safe area. */}
      {!hideSidebar && (
        <nav className={`lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 ${sidebarOpen ? 'hidden' : 'flex'} items-stretch justify-around pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_8px_rgba(0,0,0,0.04)]`}>
          {mobileTabs.map((tab) => {
            const active = tab.path ? isActive(tab.path) : false;
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
