// src/components/admin/ComingSoonProjects.jsx
// Manage projects: projects not open for applications yet. For each one:
// lead applications, people who started a lead application but didn't submit,
// and people waiting for roles. Staff can invite any of them to apply to lead.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase/config';
import { inviteToLead, listInterest, listLeadIntent } from '../../utils/projectInterest';

const STAGE = {
  draft: 'Not published yet',
  lead_recruitment: 'Needs a lead',
  setup: 'Lead is setting up roles',
};
const stageOf = (p) => (p.isActive === false ? 'draft' : p.status === 'setup' ? 'setup' : 'lead_recruitment');

const ComingSoonProjects = ({ projects }) => {
  const soon = projects.filter((p) => p.isActive === false || ['lead_recruitment', 'setup'].includes(p.status));
  const [counts, setCounts] = useState({});
  const [open, setOpen] = useState(null); // { id, kind: 'started' | 'waiting' }
  const [people, setPeople] = useState([]);
  const [invited, setInvited] = useState({}); // `${projectId}_${uid}` -> true

  useEffect(() => {
    let alive = true;
    const count = (q) => getCountFromServer(q).then((c) => c.data().count).catch(() => 0);
    Promise.all(soon.map(async (p) => {
      const [leads, started, waiting] = await Promise.all([
        count(query(collection(db, 'lead_applications'), where('rankedProjectIds', 'array-contains', p.id), where('status', '==', 'submitted'))),
        count(query(collection(db, 'lead_intent'), where('projectId', '==', p.id))),
        count(query(collection(db, 'project_interest'), where('projectId', '==', p.id))),
      ]);
      return [p.id, { leads, started, waiting }];
    })).then((pairs) => { if (alive) setCounts(Object.fromEntries(pairs)); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soon.map((p) => p.id).join(',')]);

  const show = async (p, kind) => {
    if (open?.id === p.id && open?.kind === kind) { setOpen(null); return; }
    setPeople(await (kind === 'started' ? listLeadIntent(p.id) : listInterest(p.id)).catch(() => []));
    setOpen({ id: p.id, kind });
  };
  const invite = async (p, person) => {
    try {
      await inviteToLead(person.uid, p);
      setInvited((m) => ({ ...m, [`${p.id}_${person.uid}`]: true }));
      toast.success(`Invitation sent to ${person.name}.`);
    } catch (e) {
      toast.error('Could not send the invitation.');
    }
  };

  if (!soon.length) return null;
  return (
    <div className="mb-6">
      <h3 className="text-gray-900 font-bold mb-1">Coming soon projects ({soon.length})</h3>
      <p className="text-xs text-gray-500 mb-2">
        Not open for team applications yet. Members can apply to lead, or join the team list to hear when roles open.
        Invite anyone below to apply to lead.
      </p>
      <div className="space-y-2">
        {soon.map((p) => {
          const c = counts[p.id] || {};
          const needsLead = stageOf(p) !== 'setup';
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
                  {needsLead && (
                    <button type="button" disabled={!c.started} onClick={() => show(p, 'started')}
                      className="font-semibold bg-gray-100 text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-50">
                      {c.started ?? '…'} started, not submitted
                    </button>
                  )}
                  <button type="button" disabled={!c.waiting} onClick={() => show(p, 'waiting')}
                    className="font-semibold bg-pink-50 text-pink-700 px-3 py-1.5 rounded-lg hover:bg-pink-100 disabled:opacity-50">
                    {c.waiting ?? '…'} waiting for roles
                  </button>
                </div>
              </div>
              {open?.id === p.id && (
                <div className="mt-3 border-t border-gray-100 pt-2">
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    {open.kind === 'started' ? 'Started a lead application but didn’t submit it' : 'Waiting for roles to open'}
                  </p>
                  <ul className="space-y-1.5">
                    {people.map((x) => {
                      const sent = invited[`${p.id}_${x.uid}`];
                      return (
                        <li key={x.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                          <span className="text-gray-800">{x.name}</span>
                          {needsLead && (
                            <button type="button" disabled={sent} onClick={() => invite(p, x)}
                              className="text-xs font-semibold bg-pink-600 text-white px-3 py-1 rounded-lg disabled:bg-pink-800">
                              {sent ? '✓ Invited' : open.kind === 'started' ? 'Remind to finish' : 'Invite to lead'}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComingSoonProjects;
