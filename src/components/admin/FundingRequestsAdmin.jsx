// src/components/admin/FundingRequestsAdmin.jsx
// Admin → Sponsors: messages from "Contact us to fund a cohort" on Support our
// mission. Each request is New until someone on the team replies; then mark it
// In touch, Funded, or Closed, and keep a private note for the team.
// The team inbox also gets every request by email (api/public-request).
// Delete is only for spam or test entries, or when someone asks for their
// details to be removed.
import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';

const STATUS = {
  new: ['New', 'bg-pink-50 text-pink-700'],
  in_touch: ['In touch', 'bg-gray-900 text-white'],
  funded: ['Funded', 'bg-pink-600 text-white'],
  closed: ['Closed', 'bg-gray-100 text-gray-700'],
};
const GIVER = { company: 'Company', foundation: 'Foundation or trust', individual: 'Individual', other: 'Other' };
const FOR = { cohort: 'A whole cohort', team: 'One team', laptops: 'Laptops and internet', unsure: 'Not sure yet' };
const AMOUNT = { under1k: 'Under $1,000', '1k-5k': '$1,000 to $5,000', '5k-20k': '$5,000 to $20,000', over20k: 'Over $20,000', unsure: 'Not sure yet' };

const FundingRequestsAdmin = () => {
  const { currentUser } = useAuth();
  const [rows, setRows] = useState(null);
  const [filter, setFilter] = useState('open');
  const [notes, setNotes] = useState({});
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    getDocs(query(collection(db, 'funding_requests'), orderBy('createdAt', 'desc')))
      .then((s) => setRows(s.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch(() => setRows([]));
  }, []);

  const save = async (r, patch, done) => {
    setBusy(r.id);
    try {
      const data = { ...patch, updatedBy: currentUser?.email || null, updatedAt: serverTimestamp() };
      await updateDoc(doc(db, 'funding_requests', r.id), data);
      setRows((xs) => xs.map((x) => (x.id === r.id ? { ...x, ...data } : x)));
      if (done) toast.success(done);
    } catch (e) {
      toast.error('Could not save that.');
    }
    setBusy(null);
  };

  const remove = async (r) => {
    if (!window.confirm(`Delete the request from ${r.name || 'this person'} for good?\n\nUse this only for spam or test entries, or when the person asked for their details to be removed. It can't be undone.`)) return;
    setBusy(r.id);
    try {
      await deleteDoc(doc(db, 'funding_requests', r.id));
      setRows((xs) => xs.filter((x) => x.id !== r.id));
      toast.success('Request deleted.');
    } catch (e) {
      toast.error('Could not delete it.');
    }
    setBusy(null);
  };

  if (rows === null) return <p className="py-6 text-center text-gray-400 text-sm">Loading funding requests…</p>;
  const isOpen = (r) => r.status === 'new' || r.status === 'in_touch';
  const shown = rows.filter((r) => (filter === 'all' ? true : filter === 'open' ? isOpen(r) : r.status === filter));
  const count = (k) => rows.filter((r) => (k === 'open' ? isOpen(r) : r.status === k)).length;

  return (
    <section className="mb-10" aria-labelledby="funding-h">
      <h2 id="funding-h" className="text-lg font-bold text-gray-900">Funding requests</h2>
      <p className="text-sm text-gray-600 mt-1 mb-4">
        From “Contact us to fund a cohort” on Support our mission. Each one is also emailed to the team inbox.
      </p>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {[['open', `Open (${count('open')})`], ['funded', `Funded (${count('funded')})`], ['closed', `Closed (${count('closed')})`], ['all', `All (${rows.length})`]].map(([k, l]) => (
          <button key={k} type="button" onClick={() => setFilter(k)} aria-pressed={filter === k}
            className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${filter === k ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-gray-700 border-gray-300'}`}>{l}</button>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="text-sm text-gray-500 py-6 text-center border border-dashed border-gray-300 rounded-xl">
          {rows.length === 0 ? 'No funding requests yet. They arrive from Support our mission (shemodeltech.com/support-our-mission).' : 'Nothing here.'}
        </p>
      )}

      <div className="space-y-3">
        {shown.map((r) => {
          const [label, cls] = STATUS[r.status] || STATUS.new;
          const when = r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '';
          const subject = encodeURIComponent('Funding a cohort at She Model Tech');
          return (
            <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-gray-900">{r.organization || r.name}</p>
                  <p className="text-sm text-gray-600">{r.organization ? `${r.name} · ` : ''}{GIVER[r.giverType] || 'Other'}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cls}`}>{label}{when ? ` · ${when}` : ''}</span>
              </div>
              <dl className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                <div><dt className="inline text-gray-500">Would like to fund: </dt><dd className="inline text-gray-900">{FOR[r.fundingFor] || '—'}</dd></div>
                <div><dt className="inline text-gray-500">Amount in mind: </dt><dd className="inline text-gray-900">{AMOUNT[r.amount] || '—'}</dd></div>
                <div className="min-w-0"><dt className="inline text-gray-500">Email: </dt><dd className="inline"><a href={`mailto:${r.email}?subject=${subject}`} className="text-pink-700 hover:underline break-all">{r.email}</a></dd></div>
                {r.phone && <div><dt className="inline text-gray-500">Phone: </dt><dd className="inline"><a href={`tel:${String(r.phone).replace(/[^\d+]/g, '')}`} className="text-gray-900 hover:underline">{r.phone}</a></dd></div>}
              </dl>
              <p className="mt-3 text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{r.message}</p>

              <label className="block mt-3 text-xs text-gray-700">Team note <span className="text-gray-500">(private, only admins see it)</span>
                <textarea rows={2} maxLength={1000} value={notes[r.id] ?? (r.teamNote || '')}
                  onChange={(e) => setNotes((m) => ({ ...m, [r.id]: e.target.value }))}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </label>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <a href={`mailto:${r.email}?subject=${subject}`} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Reply by email</a>
                {notes[r.id] !== undefined && notes[r.id] !== (r.teamNote || '') && (
                  <button type="button" disabled={busy === r.id} onClick={() => save(r, { teamNote: notes[r.id].trim() || null }, 'Note saved.')}
                    className="text-sm font-semibold border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg disabled:opacity-50">Save note</button>
                )}
                <label className="ml-auto text-sm text-gray-700 flex items-center gap-2">Status
                  <select value={r.status || 'new'} disabled={busy === r.id}
                    onChange={(e) => save(r, { status: e.target.value }, `Marked ${STATUS[e.target.value][0].toLowerCase()}.`)}
                    className="border border-gray-300 rounded-lg px-2 py-1.5 bg-white text-sm">
                    {Object.entries(STATUS).map(([k, [l]]) => <option key={k} value={k}>{l}</option>)}
                  </select>
                </label>
              </div>
              {r.updatedBy && <p className="mt-2 text-xs text-gray-500">Last updated by {r.updatedBy}</p>}
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                <button type="button" disabled={busy === r.id} onClick={() => remove(r)}
                  title="For spam or test entries, or when someone asks for their details to be removed"
                  className="text-xs font-semibold text-gray-500 hover:text-red-600 disabled:opacity-50">Delete request</button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FundingRequestsAdmin;
