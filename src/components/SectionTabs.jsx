// src/components/SectionTabs.jsx
// Shared pieces for the staff "Manage" areas on Learning and Events:
//   SectionTabs - the underlined tab row (same look as the Projects tabs)
//   ManagePills - the smaller row of sections under Manage
//   StaffGate   - shows its children to admins and editors only; everyone
//                 else goes to their dashboard quietly.
import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useStaffRole } from './MentorCourseStaffTools';

const isOn = (pathname, t) => t.active ?? (t.exact ? pathname === t.to : pathname === t.to || pathname.startsWith(`${t.to}/`));

export const SectionTabs = ({ label, tabs, className = 'mb-6' }) => {
  const { pathname } = useLocation();
  return (
    <nav aria-label={label} className={className}>
      <div className="flex gap-4 sm:gap-7 overflow-x-auto border-b border-gray-200">
        {tabs.map((t) => {
          const on = isOn(pathname, t);
          return (
            <Link
              key={t.to}
              to={t.to}
              aria-current={on ? 'page' : undefined}
              className={`whitespace-nowrap px-1 py-3 text-sm sm:text-base font-semibold border-b-2 transition-colors ${
                on ? 'text-pink-600 border-pink-600' : 'text-gray-600 border-transparent hover:text-pink-600'
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export const ManagePills = ({ label, items }) => {
  const { pathname } = useLocation();
  return (
    <nav aria-label={label} className="flex gap-2 overflow-x-auto pb-1 mb-6">
      {items.map((m) => {
        const on = isOn(pathname, m);
        return (
          <Link
            key={m.to}
            to={m.to}
            aria-current={on ? 'page' : undefined}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
              on ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {m.label}
          </Link>
        );
      })}
    </nav>
  );
};

export const StaffGate = ({ children }) => {
  const role = useStaffRole();
  if (role === null) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
      </div>
    );
  }
  if (role !== 'admin' && role !== 'editor') return <Navigate to="/dashboard" replace />;
  return children;
};
