// src/components/PayoutDetails.jsx
// Settings → Account: how a member is paid on She Model Tech paid projects.
// She Model Tech pays by PayPal, so members add the email on their PayPal
// account (in their own name). Wise stays available as an alternative.
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';

const PayoutDetails = () => {
  const { currentUser } = useAuth();
  const [f, setF] = useState(null);
  const [isCompany, setIsCompany] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid)).then((s) => {
      const d = s.data() || {};
      setIsCompany(!!d.isCompany);
      setF({ method: d.payout?.method || 'PayPal', email: d.payout?.email || '', country: d.payout?.country || d.country || '' });
    }).catch(() => {});
  }, [currentUser]);
  if (!f || isCompany) return null;

  const save = async () => {
    if (f.method !== 'Bank transfer' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return toast.error(`Enter the email on your ${f.method} account.`);
    if (!f.country.trim()) return toast.error('Enter the country where you’ll be paid.');
    setBusy(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        payout: { method: f.method, email: f.method === 'Bank transfer' ? null : f.email.trim().toLowerCase(), country: f.country.trim(), updatedAt: new Date().toISOString() },
      });
      toast.success('Payout details saved.');
    } catch (e) {
      toast.error('Could not save. Please try again.');
    }
    setBusy(false);
  };

  const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm';
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-gray-900 font-bold text-base mb-1">Payout details</h3>
      <p className="text-gray-500 text-sm mb-4">
        She Model Tech pays members on paid projects by <strong>PayPal</strong>. Add the email on your PayPal account,
        in your own name. Don’t have one? Create a free account at paypal.com first.
      </p>
      <div className="grid sm:grid-cols-3 gap-3">
        <label className="text-xs font-semibold text-gray-700">Paid by
          <select className={input} value={f.method} onChange={(e) => setF({ ...f, method: e.target.value })}>
            <option value="PayPal">PayPal (recommended)</option>
            <option value="Wise">Wise</option>
          </select>
        </label>
        <label className="text-xs font-semibold text-gray-700 sm:col-span-2">Email on your {f.method} account
          <input className={input} type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        </label>
        <label className="text-xs font-semibold text-gray-700">Country
          <input className={input} maxLength={60} value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} />
        </label>
      </div>
      <button onClick={save} disabled={busy} className="mt-3 text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">
        {busy ? 'Saving…' : 'Save payout details'}
      </button>
    </div>
  );
};

export default PayoutDetails;
