// src/components/Navbar.jsx
// The one public/top navigation bar for She Model Tech. Every page that is
// not inside the logged-in sidebar layout (AppShell) should render THIS
// component instead of building its own <nav>, so the brand, spacing and
// button style stay identical everywhere.
//
// Menu items still depend on auth state (logged-out vs logged-in), exactly
// as before. Pages that need an extra call-to-action for logged-out visitors
// (e.g. the landing page's "Get Started") pass it via the `cta` prop; it is
// rendered in the same slot and style on every page and hidden once a user
// is signed in.
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useInAppShell } from './AppShell';
import TopBarIcons from './TopBarIcons';

const Navbar = ({ cta = null }) => {
  const inAppShell = useInAppShell();
  const { currentUser } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Inside the sidebar layout this bar is hidden and AppLayout already listens
  // for unread counts, so don't open a second copy of the same listeners.
  useEffect(() => {
    if (!currentUser || inAppShell) return;
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', currentUser.uid),
      limit(300) // bounded; the badge shows "9+" at most
    );
    const unsub = onSnapshot(q, (snap) => {
      let total = 0;
      snap.docs.forEach(d => {
        const unreadBy = d.data().unreadBy || {};
        total += unreadBy[currentUser.uid] || 0;
      });
      setUnreadMessages(total);
    }, () => {});
    return () => unsub();
  }, [currentUser, inAppShell]);

  useEffect(() => {
    if (!currentUser || inAppShell) return;
    // Only a count is shown ("9+" at most), so 100 unread is plenty.
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid),
      where('isRead', '==', false),
      limit(100)
    );
    const unsub = onSnapshot(q, (snap) => {
      setUnreadNotifications(snap.size);
    }, (err) => {
      console.error('Error listening to notifications:', err);
    });
    return () => unsub();
  }, [currentUser, inAppShell]);

  // When inside AppShell (sidebar layout), don't render the top navbar.
  // This must come AFTER every hook above, so hooks run in the same order
  // on every render.
  if (inAppShell) return null;

  const navItems = currentUser
    ? [
        { path: '/projects', label: 'Projects' },
        { path: '/learning', label: 'Learning' },
        { path: '/dashboard', label: 'Dashboard' },
      ]
    : [
        // No Home item: the logo goes home.
        { path: '/about', label: 'About' },
        { path: '/projects', label: 'Projects' },
        { path: '/conference', label: 'Conference' },
        { path: '/learning', label: 'Learning' },
      ];

  const isActive = (path) => path === '/' ? location.pathname === '/' : (location.pathname === path || location.pathname.startsWith(path + '/'));

  // Links: soft pills, pink when you're on that page.
  const getNavButtonClass = (path) => `px-3 xl:px-4 py-2 rounded-full text-sm xl:text-[15px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 ${
    isActive(path) ? 'text-pink-700 bg-pink-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
  }`;

  const getMobileNavButtonClass = (path) => `flex items-center w-full px-4 py-3 rounded-xl text-base font-semibold transition-colors min-h-[48px] ${
    isActive(path) ? 'text-pink-700 bg-pink-50' : 'text-gray-800 hover:bg-gray-100'
  }`;

  // Every page shows the same button for visitors, so the menu never moves.
  const rightButton = cta || (!currentUser ? (
    <Link to="/login" className="bg-pink-600 hover:bg-pink-700 text-white text-sm xl:text-base font-semibold px-4 py-2 rounded-full whitespace-nowrap shadow-sm transition-colors">
      Get Started
    </Link>
  ) : null);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-200">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 max-w-7xl">
          <div className="flex items-center justify-between gap-2 lg:grid lg:grid-cols-[1fr_auto_1fr] h-16 sm:h-20">

            <Link to="/" aria-label="She Model Tech home" className="flex-shrink-0 flex items-center lg:justify-self-start">
              <img src="/Images/she-model-tech-logo.png" alt="She Model Tech" className="h-10 sm:h-14 w-auto" />
            </Link>

            <div className="hidden lg:flex items-center justify-center gap-1 xl:gap-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} aria-current={isActive(item.path) ? 'page' : undefined} className={getNavButtonClass(item.path)}>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-stretch self-stretch justify-end gap-1 sm:gap-2 lg:justify-self-end min-w-0">
              {!currentUser && <div className="hidden lg:flex items-center">{rightButton}</div>}
              {/* Signed in: Proof Wall, Messaging, Notifications, Me, on every page and screen size. */}
              <TopBarIcons unreadMessages={unreadMessages} unreadNotifications={unreadNotifications} />
              <div className="lg:hidden flex items-center gap-2">
                {!currentUser && rightButton}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={mobileMenuOpen}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Phones and tablets: the page links (the icons stay in the bar). */}
        <div className={`lg:hidden border-t border-gray-100 bg-white transition-all duration-200 ease-in-out overflow-hidden ${mobileMenuOpen ? 'max-h-screen opacity-100 shadow-lg' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          <div className="container mx-auto px-3 xs:px-4 sm:px-6 max-w-7xl py-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} aria-current={isActive(item.path) ? 'page' : undefined} className={getMobileNavButtonClass(item.path)}>
                {item.label}
              </Link>
            ))}
            {currentUser && (
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Link to="/logout" onClick={() => setMobileMenuOpen(false)} className="flex items-center w-full px-4 py-3 rounded-xl text-base font-semibold text-gray-600 hover:bg-gray-100 min-h-[48px]">
                  Log out
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="h-16 sm:h-20" />
    </>
  );
};

export default Navbar;
