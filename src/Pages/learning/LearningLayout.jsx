// src/Pages/learning/LearningLayout.jsx
// The frame for She Model Tech Learning (/learning): its own header, separate
// from the member app's sidebar, so browsing courses feels like a learning
// platform. Anyone can browse; enrolling and progress need an account.

import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FD_CSS } from './shared';

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
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);

  const linkCls = ({ isActive }) =>
    `text-sm font-semibold px-3 py-2 rounded-lg transition-colors ${
      isActive ? 'text-pink-700 bg-pink-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
    }`;

  return (
    <div className="fd-root min-h-screen bg-white" style={accent ? { '--acc': accent.accent, '--tint': accent.tint } : undefined}>
      <style>{FD_CSS}</style>
      <header className="lr-header sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link to="/learning" className="flex items-center gap-2.5 flex-shrink-0" aria-label="She Model Tech Learning home">
            <img src="/Images/she-model-tech-logo.png" alt="" className="h-10 w-auto" />
            <span className="h-7 w-px bg-gray-200" aria-hidden="true" />
            <span className="fd-display text-lg text-gray-900">Learning</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-4" aria-label="Learning">
            <NavLink to="/learning" end className={linkCls}>
              Browse
            </NavLink>
            {currentUser && (
              <NavLink to="/learning/my" className={linkCls}>
                My learning
              </NavLink>
            )}
          </nav>

          <div className="ml-auto hidden md:flex items-center gap-2">
            <Link
              to={currentUser ? '/dashboard' : '/'}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-3 py-2"
            >
              {currentUser ? 'Back to She Model Tech' : 'About She Model Tech'}
            </Link>
            {!currentUser && (
              <button
                onClick={() => signInAndReturn(navigate, location.pathname + location.search)}
                className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
              >
                Sign in
              </button>
            )}
          </div>

          <button
            className="md:hidden ml-auto p-2 rounded-lg text-gray-700 hover:bg-gray-100"
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

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-1 bg-white">
            <NavLink to="/learning" end className={linkCls}>
              Browse
            </NavLink>
            {currentUser && (
              <NavLink to="/learning/my" className={linkCls}>
                My learning
              </NavLink>
            )}
            <Link to={currentUser ? '/dashboard' : '/'} className="text-sm font-semibold text-gray-700 px-3 py-2">
              {currentUser ? 'Back to She Model Tech' : 'About She Model Tech'}
            </Link>
            {!currentUser && (
              <button
                onClick={() => signInAndReturn(navigate, location.pathname + location.search)}
                className="mt-1 bg-pink-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
              >
                Sign in
              </button>
            )}
          </div>
        )}
      </header>

      <main>{children}</main>

      {!bare && <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-sm text-gray-500">
          <p>She Model Tech Learning. Free courses for every track.</p>
          <div className="flex gap-5">
            <Link to="/projects" className="hover:text-gray-900">Projects</Link>
            <Link to="/about" className="hover:text-gray-900">About</Link>
            <Link to="/support" className="hover:text-gray-900">Support</Link>
          </div>
        </div>
      </footer>}
    </div>
  );
};

export default LearningLayout;
