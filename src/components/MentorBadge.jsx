// src/components/MentorBadge.jsx
// The Mentor badge: earned when an admin approves a mentor's course for
// learners. Levels grow with the number of approved courses.
import React from 'react';

// Shown for approved mentors (isMentor) and anyone with a published course.
const MentorBadge = ({ count = 0, isMentor = false, size = 'md', showCount = false }) => {
  if (!isMentor && count < 1) return null;
  const level = 'Mentor';
  const sm = size === 'sm';
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 ${
        sm ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5'
      }`}
      title={count ? `She Model Tech Mentor: ${count} published course${count === 1 ? '' : 's'} in Learning` : 'She Model Tech Mentor'}
    >
      <svg className={sm ? 'w-3 h-3' : 'w-3.5 h-3.5'} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
      {level}
      {showCount && count > 0 && <span className="font-normal text-indigo-600">· {count} course{count === 1 ? '' : 's'}</span>}
    </span>
  );
};

export default MentorBadge;
