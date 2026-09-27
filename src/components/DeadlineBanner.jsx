// src/components/DeadlineBanner.jsx
//
// Shows the whole team where they stand against the deadline. The project's
// lead can change the dates in Edit project, so there's no extension request;
// the lead just sees a "Change the deadline" link.

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { daysUntil, GRACE_PERIOD_DAYS } from '../utils/cohorts';

const DeadlineBanner = ({ project }) => {
  const { currentUser } = useAuth();
  const isLead = !!currentUser && currentUser.uid === project?.submitterId;

  if (!project?.endDate) return null;
  if (['completed', 'awaiting_payment_confirmation', 'cancelled'].includes(project.status)) {
    return null;
  }

  const daysLeft = daysUntil(project.endDate);
  if (daysLeft === null) return null;

  const graceWindow = GRACE_PERIOD_DAYS + (project.extensionDays || 0);
  const graceUsed = -daysLeft;
  const inGrace = daysLeft < 0 && graceUsed <= graceWindow;
  const lapsed = project.status === 'lapsed' || graceUsed > graceWindow;

  // --- Lapsed -------------------------------------------------------
  if (lapsed) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 mb-5">
        <p className="text-gray-900 font-bold text-sm mb-1">This project has lapsed</p>
        <p className="text-gray-600 text-xs leading-relaxed">
          The deadline and grace period have passed. Your work stays here and stays visible, nothing
          is deleted. You can still submit late, and a reviewer can still award badges for genuine
          contributions. Talk to us if you want to finish it.
        </p>
      </div>
    );
  }

  // --- Grace period -------------------------------------------------
  if (inGrace) {
    const left = graceWindow - graceUsed + 1;
    return (
      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-5">
        <p className="text-amber-900 font-bold text-sm mb-1">
          Grace period, {left} day{left === 1 ? '' : 's'} left
        </p>
        <p className="text-amber-800 text-xs leading-relaxed">
          The deadline has passed, but you still have time. Badges and certificates are awarded
          after review, so it&rsquo;s worth finishing.
        </p>
      </div>
    );
  }

  // --- Counting down ------------------------------------------------
  const urgent = daysLeft <= 7;
  return (
    <div
      className={`rounded-xl p-4 mb-5 border ${
        urgent ? 'bg-pink-50 border-pink-300' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className={`font-bold text-sm ${urgent ? 'text-pink-900' : 'text-gray-900'}`}>
            {daysLeft === 0
              ? 'Deadline is today'
              : `${daysLeft} day${daysLeft === 1 ? '' : 's'} to the deadline`}
          </p>
          <p className="text-gray-500 text-xs mt-0.5">
            Due {project.endDate}
            {project.extensionDays ? ` (extended by ${project.extensionDays} days)` : ''}
          </p>
        </div>
        {isLead && (
          <Link to={`/projects/${project.id}/setup`} className="text-pink-700 text-xs font-semibold underline">
            Change the deadline
          </Link>
        )}
      </div>

    </div>
  );
};

export default DeadlineBanner;
