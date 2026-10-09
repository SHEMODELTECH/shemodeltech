// src/components/CollapseToggle.jsx
// The "Hide / Show" control for dashboard cards (same look as Getting
// started), and a hook that remembers the choice on this device. Cards start
// open; a hidden card folds to a one-line summary instead of disappearing.
import React, { useState } from 'react';

const storageKey = (key, uid) => `smt-dash-collapsed:${key}:${uid || 'anon'}`;

export const useCollapsed = (key, uid) => {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(storageKey(key, uid)) === '1';
    } catch (_) {
      return false;
    }
  });
  const toggle = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        if (next) localStorage.setItem(storageKey(key, uid), '1');
        else localStorage.removeItem(storageKey(key, uid));
      } catch (_) {
        /* storage unavailable: it just won't be remembered */
      }
      return next;
    });
  };
  return [collapsed, toggle];
};

const CollapseToggle = ({ collapsed, onToggle, controls }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-expanded={!collapsed}
    aria-controls={controls}
    className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900"
  >
    {collapsed ? 'Show' : 'Hide'}
    <svg className={`w-4 h-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
);

export default CollapseToggle;
