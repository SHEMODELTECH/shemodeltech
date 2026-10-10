// src/components/TeamEvents.jsx
// Project workspace: team events.
//   HostEventLink - small "Host an event" link by the workspace title, always
//                   there for team members 18+ (a workshop, talk, or demo day).
//   DemoDayStrip  - one slim line in the project's last week (or once it's
//                   done): "Show what you built: host a demo day". Hideable.
// Both open Events → Host an event with the project linked. Under-18
// teammates are asked to let their lead host (hosting is for 18+).
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserDocCached } from '../utils/firestoreHelpers';
import { daysUntil } from '../utils/cohorts';

const useCanHost = (uid) => {
  const [profile, setProfile] = useState(undefined);
  useEffect(() => {
    let alive = true;
    getUserDocCached(uid).then((p) => alive && setProfile(p || null)).catch(() => alive && setProfile(null));
    return () => { alive = false; };
  }, [uid]);
  if (profile === undefined) return undefined;
  return !!profile && profile.ageGroup === '18plus' && !profile.isCompany;
};

const hostUrl = (projectId, type) => `/events/host?project=${projectId}${type ? `&type=${type}` : ''}`;

export const HostEventLink = ({ projectId, uid }) => {
  const can = useCanHost(uid);
  if (!can) return null;
  return (
    <Link to={hostUrl(projectId)} className="inline-flex items-center gap-1.5 text-sm font-semibold border border-gray-300 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-50">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      Host an event
    </Link>
  );
};

export const DemoDayStrip = ({ project, projectId, uid }) => {
  const can = useCanHost(uid);
  const key = `smt-demoday-hidden:${projectId}`;
  const [hidden, setHidden] = useState(() => {
    try { return localStorage.getItem(key) === '1'; } catch (_) { return false; }
  });
  const left = project?.endDate ? daysUntil(project.endDate) : null;
  const due = project?.status === 'completed' || (left !== null && left <= 7);
  if (!due || hidden || can === undefined) return null;
  const hide = () => {
    setHidden(true);
    try { localStorage.setItem(key, '1'); } catch (_) { /* fine for this visit */ }
  };
  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg border border-pink-100 bg-pink-50/60 px-3 py-2 text-sm">
      <p className="flex-1 min-w-0 text-gray-800">
        {can ? 'Show what you built: host a demo day for your team.' : 'Show what you built: ask your project lead to host a demo day.'}
      </p>
      {can && (
        <Link to={hostUrl(projectId, 'demoday')} className="flex-shrink-0 text-xs font-semibold bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg">
          Host a demo day
        </Link>
      )}
      <button type="button" onClick={hide} aria-label="Hide" className="flex-shrink-0 text-gray-400 hover:text-gray-700">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};
