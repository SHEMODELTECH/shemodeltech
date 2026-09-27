// src/components/admin/OrgRequestsTab.jsx
// Admin > Organizations: training contract and licensing requests, trainer
// approvals, and mentor assignments.
import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase/config';
import { notifyMember } from '../../utils/staffAlerts';
import { ORG_TYPES, REQUEST_TYPES, STATUS_LABELS, TRAINER_CRITERIA, listOrgRequests, statusesFor, updateOrgRequest } from '../../utils/organizations';

const OrgRequestsTab = ({ isAdmin }) => {
  const [reqs, setReqs] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [pendingTrainers, setPendingTrainers] = useState([]);
  const [filter, setFilter] = useState('open');

  const load = async () => {
    listOrgRequests().then(setReqs).catch(() => setReqs([]));
    const [t, p] = await Promise.all([
      getDocs(query(collection(db, 'users'), where('isTrainer', '==', true))).catch(() => null),
      getDocs(query(collection(db, 'users'), where('trainerRequested', '==', true))).catch(() => null),
    ]);
    setTrainers(t ? t.docs.map((d) => ({ uid: d.id, ...d.data() })) : []);
    setPendingTrainers(p ? p.docs.map((d) => ({ uid: d.id, ...d.data() })).filter((u) => !u.isTrainer) : []);
  };
  useEffect(() => {
    load();
  }, []);

  const patch = async (r, data, msg) => {
    try {
      await updateOrgRequest(r.id, data);
      setReqs((xs) => xs.map((x) => (x.id === r.id ? { ...x, ...data } : x)));
      if (msg) toast.success(msg);
    } catch (e) {
      toast.error('Could not update it.');
    }
  };

  const assign = (r, uid) => {
    const t = trainers.find((x) => x.uid === uid);
    if (!t || (r.assignedMentorUids || []).includes(uid)) return;
    patch(r, { assignedMentorUids: [...(r.assignedMentorUids || []), uid], assignedMentors: [...(r.assignedMentors || []), { uid, name: t.displayName || t.email }] }, 'Mentor assigned.');
    notifyMember(uid, { type: 'training_assignment', title: 'You’ve been assigned to a training contract', body: `${r.orgName}: ${r.topics.slice(0, 120)}`, link: '/teacher' });
  };
  const unassign = (r, uid) =>
    patch(r, { assignedMentorUids: (r.assignedMentorUids || []).filter((x) => x !== uid), assignedMentors: (r.assignedMentors || []).filter((x) => x.uid !== uid) });

  const decideTrainer = async (u, approve) => {
    try {
      await updateDoc(doc(db, 'users', u.uid), approve ? { isTrainer: true, trainerRequested: false } : { trainerRequested: false });
      notifyMember(u.uid, {
        type: 'trainer_decision',
        title: approve ? 'You’re now a She Model Tech trainer' : 'Update on your trainer request',
        body: approve ? 'You can now be assigned to training contracts. Your assignments appear in the Mentor Hub.' : 'Thank you for offering. We’re not adding trainers right now, but you can ask again later.',
        link: '/teacher',
      });
      toast.success(approve ? 'Trainer approved.' : 'Request declined.');
      load();
    } catch (e) {
      toast.error('Only admins can approve trainers.');
    }
  };

  const shown = (reqs || []).filter((r) => (filter === 'open' ? !['completed', 'ended', 'declined'].includes(r.status) : true));
  return (
    <div className="space-y-8">
      {isAdmin && (
        <div>
          <h3 className="text-gray-900 font-bold mb-1">Trainer requests</h3>
          <p className="text-xs text-gray-500 mb-2">{TRAINER_CRITERIA}</p>
          {pendingTrainers.length === 0 ? (
            <p className="text-gray-400 text-sm">No trainer requests waiting.</p>
          ) : (
            pendingTrainers.map((u) => (
              <div key={u.uid} className="flex flex-wrap items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg p-3 mb-2">
                <p className="text-sm text-gray-900">
                  {u.displayName || u.email} <span className="text-gray-500">· {u.mentorApprovedCourses || 0} published course(s)</span>
                </p>
                <div className="flex gap-2">
                  <button onClick={() => decideTrainer(u, true)} className="text-xs font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-lg">Approve</button>
                  <button onClick={() => decideTrainer(u, false)} className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">Decline</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h3 className="text-gray-900 font-bold">Organization requests</h3>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="text-sm border border-gray-300 rounded-lg px-2 py-1">
            <option value="open">Open</option>
            <option value="all">All</option>
          </select>
        </div>
        {reqs === null ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : shown.length === 0 ? (
          <p className="text-gray-400 text-sm">No requests yet. They come from the public For Organizations page.</p>
        ) : (
          <div className="space-y-3">
            {shown.map((r) => (
              <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">
                      {r.orgName} <span className="text-gray-500 font-normal">· {ORG_TYPES[r.orgType] || r.orgType}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {REQUEST_TYPES[r.type]} · {r.learners || '?'} learners · {r.format === 'in_person' ? 'In person' : r.format === 'hybrid' ? 'Online and in person' : 'Online'}
                      {r.timeline ? ` · ${r.timeline}` : ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      {r.contactName} · <a className="underline" href={`mailto:${r.contactEmail}`}>{r.contactEmail}</a>
                      {r.contactPhone ? ` · ${r.contactPhone}` : ''}
                    </p>
                  </div>
                  <select value={r.status} onChange={(e) => patch(r, { status: e.target.value }, 'Status updated.')}
                    className="text-sm border border-gray-300 rounded-lg px-2 py-1" aria-label="Status">
                    {statusesFor(r.type).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
                <p className="text-sm text-gray-800 mt-2"><strong>Topics:</strong> {r.topics}</p>
                {r.courses && <p className="text-sm text-gray-800"><strong>Courses:</strong> {r.courses}</p>}
                {r.message && <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{r.message}</p>}
                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Assigned mentors (trainers)</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(r.assignedMentors || []).map((m) => (
                        <span key={m.uid} className="text-xs bg-indigo-50 text-indigo-800 rounded-full px-2 py-0.5">
                          {m.name} <button onClick={() => unassign(r, m.uid)} aria-label={`Remove ${m.name}`}>×</button>
                        </span>
                      ))}
                    </div>
                    <select value="" onChange={(e) => assign(r, e.target.value)} className="mt-1.5 text-sm border border-gray-300 rounded-lg px-2 py-1">
                      <option value="">Assign a trainer...</option>
                      {trainers.map((t) => <option key={t.uid} value={t.uid}>{t.displayName || t.email}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700" htmlFor={`val-${r.id}`}>Contract value (USD, invoiced outside the platform)</label>
                    <input id={`val-${r.id}`} type="number" min="0" defaultValue={r.contractValue ?? ''}
                      onBlur={(e) => e.target.value !== String(r.contractValue ?? '') && patch(r, { contractValue: e.target.value === '' ? null : Number(e.target.value) }, 'Value saved.')}
                      className="mt-1 w-full text-sm border border-gray-300 rounded-lg px-2 py-1" />
                  </div>
                </div>
                <label className="block text-xs font-semibold text-gray-700 mt-3" htmlFor={`note-${r.id}`}>Internal notes</label>
                <textarea id={`note-${r.id}`} rows={2} defaultValue={r.adminNotes || ''}
                  onBlur={(e) => e.target.value !== (r.adminNotes || '') && patch(r, { adminNotes: e.target.value }, 'Notes saved.')}
                  className="mt-1 w-full text-sm border border-gray-300 rounded-lg px-2 py-1" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgRequestsTab;
