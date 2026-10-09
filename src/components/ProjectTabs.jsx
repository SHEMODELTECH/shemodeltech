// src/components/ProjectTabs.jsx
// The tab row at the top of the project pages (like the Events filters), in
// place of the old Projects dropdown in the sidebar:
//   All projects · My projects · Project Vault · Payment disputes
// plus, for staff: Create a project · Lead applications · Manage projects.
// Payment disputes only shows for members who've had paid work (approved on a
// paid project, or leading one); staff always see it. Companies don't run
// projects, so they get no tabs.
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { getUserDocCached } from '../utils/firestoreHelpers';

// Has this member had paid work? Two small reads, remembered for the visit.
const hasPaidWork = async (uid) => {
  const key = `smt-paid-work:${uid}`;
  try {
    const hit = sessionStorage.getItem(key);
    if (hit === '1' || hit === '0') return hit === '1';
  } catch (_) {
    /* storage unavailable: just check */
  }
  let yes = false;
  try {
    const apps = await getDocs(query(collection(db, 'project_applications'), where('applicantUid', '==', uid), where('status', '==', 'approved')));
    yes = apps.docs.some((d) => d.data().isPaid);
    if (!yes) {
      const led = await getDocs(query(collection(db, 'projects'), where('submitterId', '==', uid), limit(20)));
      yes = led.docs.some((d) => d.data().isPaid);
    }
  } catch (_) {
    yes = false;
  }
  try { sessionStorage.setItem(key, yes ? '1' : '0'); } catch (_) { /* ignore */ }
  return yes;
};

const ProjectTabs = () => {
  const { currentUser } = useAuth();
  const { pathname } = useLocation();
  const [role, setRole] = useState(null); // null while loading
  const [isCompany, setIsCompany] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!currentUser) return undefined;
    getUserDocCached(currentUser.uid)
      .then(async (d) => {
        if (!alive) return;
        const r = d?.role || 'member';
        setRole(r);
        setIsCompany(!!d?.isCompany);
        const staff = r === 'admin' || r === 'editor';
        if (!staff && !d?.isCompany) {
          const yes = await hasPaidWork(currentUser.uid);
          if (alive) setPaid(yes);
        }
      })
      .catch(() => alive && setRole('member'));
    return () => { alive = false; };
  }, [currentUser]);

  if (!currentUser || role === null || isCompany) return null;
  const staff = role === 'admin' || role === 'editor';

  const tabs = [
    { to: '/projects', label: 'All projects', active: pathname === '/projects' },
    ...(!staff ? [{ to: '/projects/owner-dashboard', label: 'My projects' }] : []),
    { to: '/project-vault', label: 'Project Vault' },
    // Only for members with paid work (and staff); also kept while she's on it.
    ...(staff || paid || pathname === '/disputes' ? [{ to: '/disputes', label: 'Payment disputes' }] : []),
    ...(staff
      ? [
          { to: '/admin/cohorts', label: 'Create a project' },
          { to: '/admin/lead-applications', label: 'Lead applications' },
          { to: '/admin/projects', label: 'Manage projects' },
        ]
      : []),
  ];

  return (
    <nav aria-label="Projects" className="-mt-1 mb-6 border-b border-gray-200">
      <div className="flex gap-5 sm:gap-7 overflow-x-auto">
        {tabs.map((t) => {
          const active = t.active ?? (pathname === t.to || pathname.startsWith(`${t.to}/`));
          return (
            <Link
              key={t.to}
              to={t.to}
              aria-current={active ? 'page' : undefined}
              className={`whitespace-nowrap px-1 py-3 text-sm sm:text-base font-semibold border-b-2 transition-colors ${
                active ? 'text-pink-600 border-pink-600' : 'text-gray-600 border-transparent hover:text-pink-600'
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

export default ProjectTabs;
