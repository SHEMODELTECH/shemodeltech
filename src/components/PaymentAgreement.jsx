// src/components/PaymentAgreement.jsx
// Before a member applies to a She Model Tech PAID project: confirm she's 18 or
// older (date of birth is checked, not stored), accept the terms, and say how
// she'd like to be paid. No tax numbers are collected here.
import React, { useState } from 'react';

export const AGREEMENT_VERSION = '2026-09';
const ageOn = (dob) => {
  const b = new Date(`${dob}T12:00:00`);
  const t = new Date();
  let a = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a -= 1;
  return a;
};

const PaymentAgreement = ({ open, projectTitle, roleTitle, pay, defaults = {}, onCancel, onConfirm }) => {
  const [dob, setDob] = useState('');
  const [method, setMethod] = useState(defaults.method || 'PayPal');
  const [email, setEmail] = useState(defaults.email || '');
  const [country, setCountry] = useState(defaults.country || '');
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState('');
  if (!open) return null;

  const confirm = () => {
    if (!dob) return setErr('Enter your date of birth.');
    if (ageOn(dob) < 18) return setErr('Paid projects are for members 18 and older. Free projects are open to you.');
    if (method !== 'Bank transfer' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setErr(`Enter the email on your ${method} account.`);
    if (!country.trim()) return setErr('Enter the country where you’ll be paid.');
    if (!agree) return setErr('Please accept the terms to continue.');
    setErr('');
    onConfirm({ method, email: method === 'Bank transfer' ? null : email.trim().toLowerCase(), country: country.trim() });
  };

  const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="pa-h">
      <div className="w-full max-w-lg bg-white rounded-2xl p-5 max-h-[90vh] overflow-y-auto">
        <h2 id="pa-h" className="text-lg font-bold text-gray-900">Paid project agreement</h2>
        <p className="text-sm text-gray-600 mt-1">{projectTitle}{roleTitle ? ` · ${roleTitle}` : ''}{pay ? ` · $${Number(pay).toLocaleString()} per person` : ''}</p>

        <label className="block text-sm font-semibold text-gray-800 mt-4" htmlFor="pa-dob">Date of birth <span className="font-normal text-gray-500">(to confirm you’re 18 or older; we don’t store it)</span></label>
        <input id="pa-dob" type="date" className={input} max={new Date().toISOString().slice(0, 10)} value={dob} onChange={(e) => setDob(e.target.value)} />

        <label className="block text-sm font-semibold text-gray-800 mt-3" htmlFor="pa-m">How would you like to be paid? <span className="font-normal text-gray-500">(She Model Tech pays by PayPal)</span></label>
        <select id="pa-m" className={input} value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="PayPal">PayPal (recommended)</option>
          <option value="Wise">Wise</option>
          <option value="Bank transfer">Bank transfer</option>
        </select>
        {method !== 'Bank transfer' ? (
          <>
            <label className="block text-sm font-semibold text-gray-800 mt-3" htmlFor="pa-e">Email on your {method} account <span className="font-normal text-gray-500">(in your own name)</span></label>
            <input id="pa-e" type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} />
          </>
        ) : (
          <p className="text-xs text-gray-600 mt-2">She Model Tech will email you securely for your bank details when it’s time to pay. Never share bank details in messages.</p>
        )}
        <label className="block text-sm font-semibold text-gray-800 mt-3" htmlFor="pa-c">Country where you’ll be paid</label>
        <input id="pa-c" className={input} maxLength={60} value={country} onChange={(e) => setCountry(e.target.value)} />

        <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-700 space-y-1.5">
          <p><strong>The terms:</strong></p>
          <p>• This is paid project work for She Model Tech, done as an independent contractor, not employment.</p>
          <p>• You’re paid the amount shown for your role after the work is done and reviewed. Payment goes to an account in your own name.</p>
          <p>• She Model Tech will email you the right tax form: a W-9 if you’re in the United States, or a W-8BEN if you’re outside it.</p>
          <p>• You must be 18 or older to join paid projects.</p>
        </div>
        <label className="flex items-start gap-2 mt-3 text-sm text-gray-800">
          <input type="checkbox" className="mt-1" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>I’m 18 or older, and I accept these terms.</span>
        </label>

        {err && <p className="text-sm text-red-700 mt-3" role="alert">{err}</p>}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="text-sm font-semibold text-gray-600 px-4 py-2">Cancel</button>
          <button onClick={confirm} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Accept and apply</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentAgreement;
