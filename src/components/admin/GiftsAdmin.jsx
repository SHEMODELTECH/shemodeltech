// src/components/admin/GiftsAdmin.jsx
// Admin → Overview → Gifts: record a gift received by bank transfer or cheque,
// and email the donor their tax acknowledgment letter. Donors don't need an account.
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { listGifts, recordGift, resendLetter } from '../../utils/gifts';
import { todayISO } from '../../utils/dateRules';

const EMPTY = { donorName: '', donorEmail: '', organization: '', amount: '', receivedOn: '', method: 'Bank transfer', benefits: 'none', note: '' };

const GiftsAdmin = () => {
  const { currentUser } = useAuth();
  const [f, setF] = useState({ ...EMPTY, receivedOn: todayISO() });
  const [list, setList] = useState(null);
  const [busy, setBusy] = useState(false);
  const load = () => listGifts().then(setList).catch(() => setList([]));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!f.donorName.trim()) return toast.error('Add the donor’s name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.donorEmail.trim())) return toast.error('Add a valid email for the letter.');
    if (!(Number(f.amount) > 0)) return toast.error('Enter the amount received.');
    if (!f.receivedOn || f.receivedOn > todayISO()) return toast.error('The date received can’t be in the future.');
    setBusy(true);
    try {
      await recordGift(f, currentUser);
      toast.success('Gift recorded. The acknowledgment letter was emailed.');
      setF({ ...EMPTY, receivedOn: todayISO() });
      load();
    } catch (e) {
      toast.error(e.message || 'Could not record the gift.');
      load();
    }
    setBusy(false);
  };

  const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm';
  const total = (list || []).reduce((n, g) => n + (Number(g.amount) || 0), 0);
  return (
    <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 min-w-0">
      <h2 className="text-lg font-bold text-gray-900">Gifts</h2>
      <p className="text-sm text-gray-500 mb-4">
        Record gifts received outside the donation tool (bank transfer or cheque). The donor is emailed a tax
        acknowledgment letter with our EIN. They don’t need a She Model Tech account. Required for gifts of $250 or more.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="text-xs font-semibold text-gray-700">Donor name
          <input className={input} maxLength={120} value={f.donorName} onChange={(e) => setF({ ...f, donorName: e.target.value })} />
        </label>
        <label className="text-xs font-semibold text-gray-700">Email for the letter
          <input className={input} type="email" value={f.donorEmail} onChange={(e) => setF({ ...f, donorEmail: e.target.value })} />
        </label>
        <label className="text-xs font-semibold text-gray-700">Company <span className="font-normal text-gray-500">(if given by a company)</span>
          <input className={input} maxLength={120} value={f.organization} onChange={(e) => setF({ ...f, organization: e.target.value })} />
        </label>
        <label className="text-xs font-semibold text-gray-700">Amount (USD)
          <input className={input} type="number" min="1" step="0.01" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} />
        </label>
        <label className="text-xs font-semibold text-gray-700">Date received
          <input className={input} type="date" max={todayISO()} value={f.receivedOn} onChange={(e) => setF({ ...f, receivedOn: e.target.value })} />
        </label>
        <label className="text-xs font-semibold text-gray-700">Method
          <select className={input} value={f.method} onChange={(e) => setF({ ...f, method: e.target.value })}>
            {['Bank transfer', 'Cheque', 'Other'].map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold text-gray-700 sm:col-span-2 min-w-0">Did they receive anything in return?
          <select className={input} value={f.benefits} onChange={(e) => setF({ ...f, benefits: e.target.value })}>
            <option value="none">Nothing</option>
            <option value="recognition">Recognition only (name and logo on our sponsors section)</option>
          </select>
        </label>
        <label className="text-xs font-semibold text-gray-700 sm:col-span-2">Internal note <span className="font-normal text-gray-500">(optional, not in the letter)</span>
          <input className={input} maxLength={300} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
        </label>
      </div>
      <button onClick={save} disabled={busy} className="mt-3 text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">
        {busy ? 'Saving…' : 'Record gift and email the letter'}
      </button>

      {list && list.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-semibold text-gray-900 mb-2">Recent gifts · ${total.toLocaleString()} recorded</p>
          <ul className="space-y-2">
            {list.map((g) => (
              <li key={g.id} className="flex flex-wrap items-center justify-between gap-2 border border-gray-100 rounded-lg p-3 text-sm">
                <span className="min-w-0 break-words">
                  <strong>{g.donorName}</strong>{g.organization ? ` (${g.organization})` : ''} · ${Number(g.amount).toLocaleString()} · {g.receivedOn} · {g.method}
                  <span className={`ml-2 text-[11px] font-semibold ${g.acknowledgedAt ? 'text-emerald-700' : 'text-amber-700'}`}>{g.acknowledgedAt ? 'Letter sent' : 'Letter not sent'}</span>
                </span>
                <button
                  onClick={async () => { try { await resendLetter(g); toast.success('Letter emailed again.'); load(); } catch (e) { toast.error(e.message); } }}
                  className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                >
                  Resend letter
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GiftsAdmin;
