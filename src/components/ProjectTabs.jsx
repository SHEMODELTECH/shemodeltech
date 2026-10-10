// src/components/ProjectTabs.jsx
// The tab row at the top of the project pages (like the Events filters), in
// place of the old Projects dropdown in the sidebar:
//   All projects · My projects · Project Vault · Payment disputes · Manage
// Manage is staff-only: it opens the project tools, which have their own
// smaller row (Manage projects · Lead applications · Create a project).
// On phones Vault and Disputes use short labels, so every tab (including
// Manage for staff) fits without scrolling sideways.
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

// The staff project tools, shown as a second row under Manage.
const MANAGE = [
  { to: '/admin/projects', label: 'Manage projects' },
  { to: '/admin/cohorts', label: 'Create a project' },
];

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

  const staff = role === 'admin' || role === 'editor';
  // Companies don't get tabs, but staff always do, even on an account that is
  // also set up as a company.
  if (!currentUser || role === null || (isCompany && !staff)) return null;
  const inManage = staff && MANAGE.some((m) => pathname === m.to || pathname.startsWith(`${m.to}/`));

  const tabs = [
    { to: '/projects', label: 'All projects', active: pathname === '/projects' },
    ...(!staff ? [{ to: '/projects/owner-dashboard', label: 'My projects' }] : []),
    { to: '/project-vault', label: 'Project Vault', short: 'Vault' },
    // Only for members with paid work (and staff); also kept while she's on it.
    ...(staff || paid || pathname === '/disputes' ? [{ to: '/disputes', label: 'Payment disputes', short: 'Disputes' }] : []),
    ...(staff ? [{ to: '/admin/projects', label: 'Manage', active: inManage }] : []),
  ];

  return (
    <nav aria-label="Projects" className="-mt-1 mb-6">
      <div className="flex gap-4 sm:gap-7 overflow-x-auto border-b border-gray-200">
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
              {t.short ? (
                <>
                  <span className="sm:hidden">{t.short}</span>
                  <span className="hidden sm:inline">{t.label}</span>
                </>
              ) : t.label}
            </Link>
          );
        })}
      </div>
      {inManage && (
        <div className="flex gap-2 overflow-x-auto py-3">
          {MANAGE.map((m) => {
            const on = pathname === m.to || pathname.startsWith(`${m.to}/`);
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
        </div>
      )}
    </nav>
  );
};

export default ProjectTabs;
