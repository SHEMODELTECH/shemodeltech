// src/components/CompanyDetailsForm.jsx
// Settings > Company details: what She Model Tech needs to verify a company.
// Saving while verification is pending tells admins the details changed.
import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../firebase/config';
import { alertStaff } from '../utils/staffAlerts';

const FIELDS = [
  ['companyName', 'Company name', 'text', true],
  ['companyWebsite', 'Website', 'url', false],
  ['companyEmail', 'Business email', 'email', true],
  ['companyPhone', 'Phone number', 'tel', false],
  ['companyLocation', 'Location', 'text', false],
  ['registrationNumber', 'Business registration number or EIN', 'text', false],
];

const CompanyDetailsForm = ({ uid, profile, onSaved }) => {
  const cp = profile?.companyProfile || {};
  const [form, setForm] = useState(() => ({
    companyName: cp.companyName || '',
    companyWebsite: cp.companyWebsite || '',
    companyEmail: cp.companyEmail || '',
    companyPhone: cp.companyPhone || '',
    companyLocation: cp.companyLocation || '',
    registrationNumber: cp.registrationNumber || '',
    companyDescription: cp.companyDescription || '',
  }));
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    if (!form.companyName.trim() || !form.companyEmail.trim()) return toast.error('Add your company name and business email.');
    setSaving(true);
    try {
      const updates = {};
      Object.entries(form).forEach(([k, v]) => {
        updates[`companyProfile.${k}`] = String(v || '').trim() || null;
      });
      if (!profile?.isVerified) {
        updates['companyProfile.verificationStatus'] = 'details_updated';
        updates['companyProfile.detailsUpdatedAt'] = new Date().toISOString();
      }
      await updateDoc(doc(db, 'users', uid), updates);
      if (!profile?.isVerified) {
        alertStaff({
          type: 'company_details_updated',
          title: 'Company updated its verification details',
          body: `${form.companyName.trim()} updated its details and is waiting for verification.`,
          link: '/admin',
          roles: ['admin'],
        });
      }
      toast.success(profile?.isVerified ? 'Company details saved.' : 'Saved. Our team has been notified to review your details.');
      onSaved && onSaved();
    } catch (err) {
      console.error(err);
      toast.error('Could not save your company details.');
    }
    setSaving(false);
  };

  const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';
  return (
    <form onSubmit={save} className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-gray-900">Company details</h2>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${profile?.isVerified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
          {profile?.isVerified ? 'VERIFIED' : 'NOT VERIFIED YET'}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-1">
        We use these details to verify your company. Verified companies can post paid projects.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        {FIELDS.map(([k, label, type, req]) => (
          <div key={k}>
            <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor={`cd-${k}`}>
              {label}
              {req ? '' : <span className="font-normal text-gray-500"> (optional)</span>}
            </label>
            <input id={`cd-${k}`} type={type} className={input} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="cd-desc">About your company <span className="font-normal text-gray-500">(optional)</span></label>
          <textarea id="cd-desc" rows={3} className={input} value={form.companyDescription}
            onChange={(e) => setForm({ ...form, companyDescription: e.target.value })} />
        </div>
      </div>
      <button type="submit" disabled={saving} className="mt-4 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">
        {saving ? 'Saving...' : 'Save company details'}
      </button>
    </form>
  );
};

export default CompanyDetailsForm;
