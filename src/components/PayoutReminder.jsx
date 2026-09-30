// src/components/PayoutReminder.jsx
// Dashboard: a member on a paid project without a payout email is reminded to
// add her PayPal email, so She Model Tech can pay her.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const PayoutReminder = ({ uid, profile }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!uid || !profile || profile.isCompany || profile.payout?.email) { setShow(false); return; }
    getDocs(query(collection(db, 'project_applications'), where('applicantUid', '==', uid), where('isPaid', '==', true), limit(10)))
      .then((snap) => setShow(snap.docs.some((d) => ['submitted', 'approved'].includes(d.data().status))))
      .catch(() => {});
  }, [uid, profile]);
  if (!show) return null;
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="m-0 text-sm text-gray-800">
        <strong>Add your PayPal email so we can pay you.</strong> She Model Tech pays members on paid projects by PayPal.
      </p>
      <Link to="/settings?tab=account" className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Add payout details</Link>
    </div>
  );
};

export default PayoutReminder;
