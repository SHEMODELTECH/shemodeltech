// src/components/PaidApplicants.jsx
// Review applicants for a paid project: the hosting company does this, and
// She Model Tech staff do it for paid projects She Model Tech posted.
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../firebase/config';
import { decideApplication } from '../utils/companyCohorts';

const STATUS = {
  submitted: ['Applied', 'bg-gray-100 text-gray-700'],
  interview: ['Interview set', 'bg-sky-50 text-sky-700'],
  approved: ['On the team', 'bg-emerald-50 text-emerald-700'],
  rejected: ['Not selected', 'bg-gray-100 text-gray-500'],
  withdrawn: ['Withdrawn', 'bg-gray-100 text-gray-500'],
};

const PaidApplicants = ({ cohort }) => {
  const navigate = useNavigate();
  const [apps, setApps] = useState(null);
  const [open, setOpen] = useState(null);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);

  const load = () =>
    getDocs(query(collection(db, 'company_cohort_applications'), where('cohortId', '==', cohort.id)))
      .then((s) => setApps(s.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0))))
      .catch(() => setApps([]));
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cohort.id]);

  const rolePay = (title) => (cohort.roles || []).find((r) => r.title === title)?.payAmount || '';
  const decide = async (a, decision) => {
    const f = form[a.id] || {};
    setBusy(true);
    try {
      await decideApplication({
        applicationId: a.id,
        decision,
        payAmount: f.pay ?? rolePay(a.roleTitle),
        roleTitle: a.roleTitle,
        message: (f.message || '').trim() || null,
        interviewAt: f.when || null,
        meetLink: (f.link || '').trim() || null,
      });
      toast.success(decision === 'approved' ? 'Approved. She’s on the team.' : decision === 'interview' ? 'Interview request sent.' : 'Decision sent.');
      setOpen(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Could not save the decision.');
    }
    setBusy(false);
  };

  if (apps === null) return <p className="text-gray-500 text-sm">Loading applicants...</p>;
  const set = (id, k, v) => setForm((m) => ({ ...m, [id]: { ...(m[id] || {}), [k]: v } }));
  const input = 'w-full px-3 py-2 rounded-lg border border-gray-300 text-sm';

  return (
    <div className="mb-8">
      <h2 className="text-gray-900 font-bold mb-3">Applicants ({apps.length})</h2>
      {apps.length === 0 ? (
        <p className="text-gray-500 text-sm">No applications yet.</p>
      ) : (
        <ul className="space-y-2">
          {apps.map((a) => {
            const st = STATUS[a.status] || STATUS.submitted;
            const f = form[a.id] || {};
            const decided = ['approved', 'rejected', 'withdrawn'].includes(a.status);
            return (
              <li key={a.id} className="border border-gray-200 rounded-xl bg-white">
                <button type="button" onClick={() => setOpen(open === a.id ? null : a.id)} className="w-full text-left p-4 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    <span className="font-semibold text-gray-900">{a.applicantName || a.applicantEmail}</span>
                    <span className="block text-xs text-gray-500">{a.roleTitle}</span>
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${st[1]}`}>{st[0]}</span>
                </button>
                {open === a.id && (
                  <div className="px-4 pb-4 border-t border-gray-100 space-y-3">
                    {a.coverNote && <p className="text-sm text-gray-800 whitespace-pre-wrap mt-3">{a.coverNote}</p>}
                    {a.interviewAt && <p className="text-xs text-gray-600">Interview: {a.interviewAt}{a.meetLink ? ` · ${a.meetLink}` : ''}</p>}
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => navigate(`/profile/${encodeURIComponent(a.applicantEmail || a.applicantUid)}`)} className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg">View profile</button>
                      {a.applicantUid && (
                        <button onClick={() => navigate(`/messages?to=${a.applicantUid}`)} className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg">Message her</button>
                      )}
                    </div>
                    {!decided && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor={`msg-${a.id}`}>Message to her <span className="font-normal text-gray-500">(optional, up to 500 characters)</span></label>
                          <textarea id={`msg-${a.id}`} rows={2} maxLength={500} className={input} value={f.message || ''} onChange={(e) => set(a.id, 'message', e.target.value)} />
                        </div>
                        <div className="grid sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor={`pay-${a.id}`}>Pay (USD)</label>
                            <input id={`pay-${a.id}`} type="number" min="1" className={input} value={f.pay ?? rolePay(a.roleTitle)} onChange={(e) => set(a.id, 'pay', e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor={`when-${a.id}`}>Interview time <span className="font-normal text-gray-500">(optional)</span></label>
                            <input id={`when-${a.id}`} type="datetime-local" className={input} value={f.when || ''} onChange={(e) => set(a.id, 'when', e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor={`link-${a.id}`}>Meeting link <span className="font-normal text-gray-500">(optional)</span></label>
                            <input id={`link-${a.id}`} className={input} placeholder="https://" value={f.link || ''} onChange={(e) => set(a.id, 'link', e.target.value)} />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button disabled={busy} onClick={() => decide(a, 'approved')} className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg disabled:opacity-50">Approve</button>
                          <button disabled={busy} onClick={() => decide(a, 'interview')} className="text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-lg disabled:opacity-50">Invite to interview</button>
                          <button disabled={busy} onClick={() => decide(a, 'rejected')} className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-2 rounded-lg disabled:opacity-50">Not selected</button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PaidApplicants;
