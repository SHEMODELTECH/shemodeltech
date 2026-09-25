// src/components/JoinedProjects.jsx
//
// "Projects I joined" on the My Projects page: everything an individual has
// APPLIED to, free or paid, in one list, whatever state the application is in.
//
// Three sources, because three kinds of application exist:
//   - project_applications          join a She Model Tech project (free or paid)
//   - company_cohort_applications   join a company-hosted paid project
//   - lead_applications             apply to LEAD a cohort project
// Projects she leads/created are listed separately (the "Projects I lead"
// tab), so an approved lead application is not repeated here.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const STATUS = {
  submitted: { label: 'Applied', cls: 'bg-orange-50 text-orange-700 border-orange-200' },
  pending: { label: 'Applied', cls: 'bg-orange-50 text-orange-700 border-orange-200' },
  interview: { label: 'Interview', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
  interview_scheduled: { label: 'Interview', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
  approved: { label: 'On the team', cls: 'bg-green-50 text-green-700 border-green-200' },
  offered_role: { label: 'Offered a role', cls: 'bg-green-50 text-green-700 border-green-200' },
  completed: { label: 'Completed', cls: 'bg-pink-50 text-pink-700 border-pink-200' },
  rejected: { label: 'Not selected', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  removed: { label: 'Removed', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  withdrawn: { label: 'Withdrawn', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const toMillis = (t) => (t?.toDate ? t.toDate().getTime() : t ? new Date(t).getTime() : 0);

const fetchDoc = async (col, id) => {
  try {
    const s = await getDoc(doc(db, col, id));
    return s.exists() ? s.data() : null;
  } catch (_) {
    return null;
  }
};

const JoinedProjects = ({ currentUser }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return undefined;
    let dead = false;
    (async () => {
      const out = [];

      // 1. SMT projects (free or paid). Older applications may lack
      // applicantUid, so query by email too and de-duplicate.
      const apps = new Map();
      for (const [field, value] of [
        ['applicantUid', currentUser.uid],
        ['applicantEmail', currentUser.email],
      ]) {
        try {
          const snap = await getDocs(
            query(collection(db, 'project_applications'), where(field, '==', value))
          );
          snap.docs.forEach((d) => apps.set(d.id, { id: d.id, ...d.data() }));
        } catch (_) {
          /* one of the two queries may be unindexed; the other still works */
        }
      }
      await Promise.all(
        [...apps.values()].map(async (a) => {
          if (!a.projectId) return;
          const p = await fetchDoc('projects', a.projectId);
          // Her own project is shown under "Projects I lead".
          if (p && p.submitterId === currentUser.uid) return;
          const done = p?.status === 'completed' && a.status === 'approved';
          out.push({
            key: `p-${a.id}`,
            title: p?.projectTitle || a.projectTitle || 'Project',
            role: a.role,
            isPaid: !!(p?.isPaid ?? a.isPaid),
            kind: 'Project',
            status: done ? 'completed' : a.status,
            link:
              a.status === 'approved'
                ? `/projects/${a.projectId}/workspace`
                : `/projects/${a.projectId}`,
            at: toMillis(a.createdAt),
          });
        })
      );

      // 2. Company-hosted paid projects.
      try {
        const snap = await getDocs(
          query(
            collection(db, 'company_cohort_applications'),
            where('applicantUid', '==', currentUser.uid)
          )
        );
        await Promise.all(
          snap.docs.map(async (d) => {
            const a = d.data();
            const c = a.cohortId ? await fetchDoc('company_cohorts', a.cohortId) : null;
            out.push({
              key: `c-${d.id}`,
              title: c?.title || 'Company project',
              role: a.roleTitle,
              isPaid: true,
              kind: c?.companyName ? `Company project · ${c.companyName}` : 'Company project',
              status: a.status,
              link: `/company-cohorts/${a.cohortId}`,
              at: toMillis(a.createdAt),
            });
          })
        );
      } catch (_) {
        /* ignore */
      }

      // 3. Applications to lead (still open, or offered another role).
      try {
        const snap = await getDocs(
          query(collection(db, 'lead_applications'), where('applicantUid', '==', currentUser.uid))
        );
        await Promise.all(
          snap.docs.map(async (d) => {
            const a = d.data();
            if (a.status === 'assigned') return; // she leads it: "Projects I lead"
            const ids = a.rankedProjectIds || [];
            const titles = (
              await Promise.all(ids.map((id) => fetchDoc('projects', id)))
            ).map((p, i) => p?.projectTitle || p?.title || `Choice ${i + 1}`);
            out.push({
              key: `l-${d.id}`,
              title: titles.length ? titles.join(', ') : 'Lead application',
              role: 'Lead',
              isPaid: false,
              kind: titles.length > 1 ? 'Applied to lead (ranked choices)' : 'Applied to lead',
              status: a.status,
              link: '/cohort/apply-to-lead',
              at: toMillis(a.createdAt),
            });
          })
        );
      } catch (_) {
        /* ignore */
      }

      out.sort((x, y) => y.at - x.at);
      if (!dead) {
        setRows(out);
        setLoading(false);
      }
    })();
    return () => {
      dead = true;
    };
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg font-semibold mb-2">You haven&rsquo;t joined a project yet</p>
        <p className="text-gray-500 text-sm mb-6">Projects you apply to, free or paid, will show here.</p>
        <Link
          to="/projects"
          className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-sm"
        >
          Browse projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((r) => {
        const st = STATUS[r.status] || { label: r.status || 'Applied', cls: 'bg-gray-100 text-gray-600 border-gray-200' };
        return (
          <Link
            key={r.key}
            to={r.link}
            className="block bg-white border border-gray-200 hover:border-pink-300 rounded-xl p-4 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-gray-900 font-semibold text-sm sm:text-base truncate">{r.title}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {r.kind}
                  {r.role ? ` · ${r.role}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                    r.isPaid
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-pink-50 text-pink-600 border-pink-100'
                  }`}
                >
                  {r.isPaid ? 'Paid' : 'Free'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${st.cls}`}>
                  {st.label}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default JoinedProjects;
