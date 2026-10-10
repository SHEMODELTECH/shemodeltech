// src/Pages/learning/LearningLayout.jsx
// The frame for She Model Tech Learning (/learning): its own header, separate
// from the member app's sidebar, so browsing courses feels like a learning
// platform. Anyone can browse; enrolling and progress need an account.

import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { FD_CSS } from './shared';
import Footer from '../../components/Footer';
import AppShell from '../../components/AppShell';

// Remember where to come back to after signing in (read by afterAuthPath).
export const signInAndReturn = (navigate, path) => {
  try {
    sessionStorage.setItem('smt_return_to', path);
  } catch (_) {
    /* private mode: they'll land on the dashboard instead */
  }
  navigate('/login');
};

const LearningLayout = ({ children, accent, bare = false }) => {
  const { currentUser } = useAuth();
  // Learning is for members: company accounts are sent to their dashboard.
  const navigateAway = useNavigate();
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid))
      .then((snap) => {
        const d = snap.data() || {};
        if (d.isCompany && !['admin', 'editor'].includes(d.role)) navigateAway('/dashboard', { replace: true });
      })
      .catch(() => {});
  }, [currentUser, navigateAway]);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  // Staff and approved teachers get a Teacher link in the Learning header.
  const [canTeach, setCanTeach] = useState(false);
  // Staff also get a Manage tab (courses, learners, mentors, course feedback).
  const [isStaff, setIsStaff] = useState(false);
  useEffect(() => {
    if (!currentUser) {
      setCanTeach(false);
      setIsStaff(false);
      return;
    }
    getDoc(doc(db, 'users', currentUser.uid))
      .then((snap) => {
        const d = snap.data() || {};
        const staff = d.role === 'admin' || d.role === 'editor';
        setIsStaff(staff);
        setCanTeach(staff || !!d.isTeacher);
      })
      .catch(() => setCanTeach(false));
  }, [currentUser]);

  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);

  // Same look and positions as the main She Model Tech menu (Navbar.jsx):
  // logo on the left, links centred, one button on the right.
  const linkCls = ({ isActive }) =>
    `px-2.5 lg:px-3 xl:px-4 py-2 text-sm xl:text-base font-semibold transition-colors border-b-2 ${
      isActive ? 'text-pink-600 border-pink-600' : 'text-gray-700 border-transparent hover:text-pink-600'
    }`;
  const mobileCls = ({ isActive }) =>
    `block w-full text-left px-4 py-3 text-base font-semibold transition-colors min-h-[44px] ${
      isActive ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'
    }`;

  // "Learning" (all courses) is lit on every Learning page except My learning.
  const onManage = location.pathname.startsWith('/learning/manage');
  const onLearning = location.pathname.startsWith('/learning') && !location.pathname.startsWith('/learning/my') && !onManage;
  const items = [
    { to: '/learning', label: 'Learning', active: onLearning },
    ...(currentUser ? [] : [{ to: '/projects', label: 'Projects' }]),
    { to: '/events', label: 'Events' },
    ...(currentUser ? [{ to: '/learning/my', label: 'My learning' }] : []),
    // Signed-in members also get the mentor link.
    ...(!currentUser ? [] : [canTeach ? { to: '/teacher', label: 'Mentor Hub' } : { to: '/teach', label: 'Become a mentor' }]),
  ];

  const rightButton = currentUser ? (
    <Link to="/projects" className="bg-pink-600 hover:bg-pink-700 text-white text-sm xl:text-base font-semibold px-4 py-2 rounded-lg whitespace-nowrap">
      Projects
    </Link>
  ) : (
    <button
      onClick={() => signInAndReturn(navigate, location.pathname + location.search)}
      className="bg-pink-600 hover:bg-pink-700 text-white text-sm xl:text-base font-semibold px-4 py-2 rounded-lg whitespace-nowrap"
    >
      Sign in
    </button>
  );

  // Signed-in members: Learning opens inside the same app frame (sidebar and
  // top bar) as every other member page, with a small tab row for the links
  // the public Learning header used to carry. Visitors keep the public header.
  if (currentUser) {
    const tabs = [
      { to: '/learning', label: 'All courses', active: onLearning },
      { to: '/learning/my', label: 'My learning' },
      canTeach ? { to: '/teacher', label: 'Mentor Hub' } : { to: '/teach', label: 'Become a mentor' },
      ...(isStaff ? [{ to: '/learning/manage', label: 'Manage', active: onManage }] : []),
    ];
    const tabCls = ({ isActive }) =>
      `whitespace-nowrap px-1 py-3 text-sm sm:text-base font-semibold border-b-2 transition-colors ${
        isActive ? 'text-pink-600 border-pink-600' : 'text-gray-600 border-transparent hover:text-pink-600'
      }`;
    return (
      <AppShell flush>
        <div className="fd-root bg-white" style={accent ? { '--acc': accent.accent, '--tint': accent.tint } : undefined}>
          <style>{FD_CSS}</style>
          {/* Course reading view (bare) has its own Back button: no tab row. */}
          {!bare && <nav aria-label="Learning" className="border-b border-gray-200 bg-white">
            <div className="container mx-auto px-3 xs:px-4 sm:px-6 max-w-7xl flex gap-3 sm:gap-7 overflow-x-auto">
              {tabs.map((it) => (
                <NavLink key={it.to} to={it.to} end={it.to === '/learning'} className={(a) => tabCls({ isActive: it.active ?? a.isActive })}>{it.label}</NavLink>
              ))}
            </div>
          </nav>}
          {children}
        </div>
      </AppShell>
    );
  }

  return (
    <div className="fd-root min-h-screen bg-white" style={accent ? { '--acc': accent.accent, '--tint': accent.tint } : undefined}>
      <style>{FD_CSS}</style>
      <header className="lr-header sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 max-w-7xl">
          <div className="flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] h-16 sm:h-20">
            {/* The logo goes to She Model Tech's home, as on every other page. */}
            <Link to={currentUser ? '/dashboard' : '/'} aria-label="She Model Tech home" className="flex-shrink-0 flex items-center gap-2 lg:justify-self-start">
              <img src="/Images/she-model-tech-logo.png" alt="She Model Tech" className="h-11 sm:h-14 w-auto" />
            </Link>

            <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-3" aria-label="Learning">
              {items.map((it) => (
                <NavLink key={it.to} to={it.to} end={it.to === '/learning'} className={(a) => linkCls({ isActive: it.active ?? a.isActive })}>{it.label}</NavLink>
              ))}
            </nav>

            <div className="hidden lg:flex items-center justify-self-end">{rightButton}</div>

            <button
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="container mx-auto px-3 xs:px-4 sm:px-6 max-w-7xl py-4 space-y-2">
              {items.map((it) => (
                <NavLink key={it.to} to={it.to} end={it.to === '/learning'} className={(a) => mobileCls({ isActive: it.active ?? a.isActive })}>{it.label}</NavLink>
              ))}
              <div className="px-4 pt-2">{rightButton}</div>
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      {!bare && <Footer />}
    </div>
  );
};

export default LearningLayout;
