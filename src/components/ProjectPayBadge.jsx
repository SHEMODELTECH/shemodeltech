// src/components/ProjectPayBadge.jsx - Paid (amber) / Free (green) pill for projects.
import React from 'react';

const ProjectPayBadge = ({ isPaid, size = 'sm' }) => {
  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5',
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };
  return isPaid ? (
    <span className={`inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200 font-bold rounded-full ${sizeClasses[size] || sizeClasses.sm}`}>
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
      PAID
    </span>
  ) : (
    <span className={`inline-flex items-center bg-green-100 text-green-800 border border-green-200 font-bold rounded-full ${sizeClasses[size] || sizeClasses.sm}`}>
      FREE
    </span>
  );
};

export default ProjectPayBadge;
