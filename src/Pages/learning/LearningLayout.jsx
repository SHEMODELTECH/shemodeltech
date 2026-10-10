// src/Pages/learning/LearningLayout.jsx
// The frame for She Model Tech Learning (/learning). Members get the app frame
// with a Learning tab row; visitors get the same top menu and footer as every
// other public page. Anyone can browse; enrolling and progress need an account.

import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { FD_CSS } from './shared';
import Footer from '../../components/Footer';
import AppShell from '../../components/AppShell';
import Navbar from '../../components/Navbar';

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

  // "Learning" (all courses) is lit on every Learning page except My learning.
  const onManage = location.pathname.startsWith('/learning/manage');
  const onLearning = location.pathname.startsWith('/learning') && !location.pathname.startsWith('/learning/my') && !onManage;
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 box-content flex gap-4 sm:gap-7 overflow-x-auto">
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
      {/* Visitors: the same top menu as the rest of the public site; Get Started
          brings her back to this page after she signs up or signs in. */}
      <Navbar
        cta={(
          <button
            onClick={() => signInAndReturn(navigate, location.pathname + location.search)}
            className="bg-pink-600 hover:bg-pink-700 text-white text-sm xl:text-base font-semibold px-4 py-2 rounded-full whitespace-nowrap shadow-sm transition-colors"
          >
            Get Started
          </button>
        )}
      />

      <main>{children}</main>

      {!bare && <Footer />}
    </div>
  );
};

export default LearningLayout;
