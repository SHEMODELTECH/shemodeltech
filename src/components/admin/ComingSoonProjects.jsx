// src/components/admin/ComingSoonProjects.jsx
// Manage projects: projects that aren't open for applications yet, with how
// many people applied to lead them and how many asked to hear when roles open.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { listInterest } from '../../utils/projectInterest';

const STAGE = {
  draft: 'Not published yet',
  lead_recruitment: 'Needs a lead',
  setup: 'Lead is setting up roles',
};
const stageOf = (p) => (p.isActive === false ? 'draft' : p.status === 'setup' ? 'setup' : 'lead_recruitment');

const ComingSoonProjects = ({ projects }) => {
  const soon = projects.filter((p) => p.isActive === false || ['lead_recruitment', 'setup'].includes(p.status));
  const [counts, setCounts] = useState({});
  const [open, setOpen] = useState(null);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    let alive = true;
    Promise.all(soon.map(async (p) => {
      const [leads, interest] = await Promise.all([
        getCountFromServer(query(collection(db, 'lead_applications'), where('rankedProjectIds', 'array-contains', p.id), where('status', '==', 'submitted'))).then((c) => c.data().count).catch(() => 0),
        getCountFromServer(query(collection(db, 'project_interest'), where('projectId', '==', p.id))).then((c) => c.data().count).catch(() => 0),
      ]);
      return [p.id, { leads, interest }];
    })).then((pairs) => { if (alive) setCounts(Object.fromEntries(pairs)); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soon.map((p) => p.id).join(',')]);

  if (!soon.length) return null;
  return (
    <div className="mb-6">
      <h3 className="text-gray-900 font-bold mb-1">Coming soon projects ({soon.length})</h3>
      <p className="text-xs text-gray-500 mb-2">Not open for team applications yet. Members can apply to lead, or ask to be notified when roles open.</p>
      <div className="space-y-2">
        {soon.map((p) => {
          const c = counts[p.id] || {};
          return (
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <Link to={`/projects/${p.id}`} className="font-semibold text-gray-900 hover:underline">{p.projectTitle || 'Untitled project'}</Link>
                  <p className="text-xs text-gray-500">{STAGE[stageOf(p)]}{p.cohortPaid ? ' · Paid' : ''}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Link to="/admin/lead-applications" className="font-semibold bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-200">
                    {c.leads ?? '…'} lead application{c.leads === 1 ? '' : 's'}
                  </Link>
                  <button
                    type="button"
                    disabled={!c.interest}
                    onClick={async () => {
                      if (open === p.id) { setOpen(null); return; }
                      setPeople(await listInterest(p.id).catch(() => []));
                      setOpen(p.id);
                    }}
                    className="font-semibold bg-pink-50 text-pink-700 px-3 py-1.5 rounded-lg hover:bg-pink-100 disabled:opacity-50"
                  >
                    {c.interest ?? '…'} waiting for roles
                  </button>
                </div>
              </div>
              {open === p.id && (
                <ul className="mt-3 border-t border-gray-100 pt-2 space-y-1">
                  {people.map((x) => (
                    <li key={x.id} className="text-sm">
                      <span className="text-gray-800">{x.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComingSoonProjects;
