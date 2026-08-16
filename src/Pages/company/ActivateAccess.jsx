// src/Pages/company/ActivateAccess.jsx
//
// The landing page for your payment platform's redirect URL.
//
//     https://shemodeltech.com/partner/activate
//
// IMPORTANT: arriving here does NOT grant access.
//
// A redirect URL is just a web address. Anyone who sees it once can share it,
// bookmark it, or guess it — and if landing on it granted premium, your paid
// tier would be public within a week of your first sale. Payment platforms
// redirect on *completion of the flow*, not on *confirmed settlement*, and
// most let a user reach the redirect without money actually moving.
//
// So this page records a CLAIM — who they are, what they paid, and the
// reference from the payment platform — and notifies an admin. You check the
// payment arrived, then activate with one click. At a handful of sales that's
// seconds of work and it cannot be gamed.
//
// When volume justifies automation, switch ACTIVATION_MODE to
// 'stripe_webhook' — that path is already built and verifies payment
// cryptographically with no manual step.

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  doc, getDoc, addDoc, collection, serverTimestamp, query, where, getDocs,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { ACTIVATION_STATUS, MEMBERSHIP_ENFORCED } from '../../config/membership';
import { BRAND } from '../../config/brand';

const ActivateAccess = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [existing, setExisting] = useState(null);
  const [saving, setSaving] = useState(false);

  // Most payment platforms append a reference on redirect. Catch the common
  // parameter names so the admin has something to match against.
  const autoRef =
    params.get('reference') || params.get('trxref') || params.get('session_id')
    || params.get('transaction_id') || params.get('tx_ref') || '';

  const [reference, setReference] = useState(autoRef);
  const [plan, setPlan] = useState('monthly');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!currentUser) { navigate('/login?next=/partner/activate'); return; }
    let dead = false;

    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        if (dead) return;
        setProfile(snap.exists() ? snap.data() : null);

        const claims = await getDocs(query(
          collection(db, 'activation_claims'),
          where('companyId', '==', currentUser.uid),
        ));
        if (dead) return;
        const live = claims.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .find(c => c.status !== ACTIVATION_STATUS.REJECTED);
        if (live) setExisting(live);
      } catch (e) {
        console.error(e);
      } finally {
        if (!dead) setLoading(false);
      }
    })();

    return () => { dead = true; };
  }, [currentUser, navigate]);

  const submitClaim = async () => {
    if (!reference.trim()) {
      toast.error('Please enter the payment reference from your receipt.');
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, 'activation_claims'), {
        companyId: currentUser.uid,
        companyName: profile?.companyName || profile?.displayName || currentUser.email,
        companyEmail: currentUser.email,
        reference: reference.trim(),
        plan,
        amount: amount ? Number(amount) : null,
        status: ACTIVATION_STATUS.CLAIMED,
        createdAt: serverTimestamp(),
      });
      await addDoc(collection(db, 'admin_notifications'), {
        type: 'activation_claim',
        message: `${profile?.companyName || currentUser.email} submitted payment reference ${reference.trim()} for the ${plan} plan.`,
        severity: 'high',
        isRead: false,
        createdAt: serverTimestamp(),
      });
      toast.success('Thanks — we\u2019ll confirm and activate shortly.');
      setExisting({ status: ACTIVATION_STATUS.CLAIMED, reference: reference.trim(), plan });
    } catch (e) {
      toast.error('Could not submit. Please email us instead.');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-gray-500">Loading…</div>;
  }

  // Dormant: nobody should be paying yet.
  if (!MEMBERSHIP_ENFORCED) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Everything is free right now</h1>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Your company already has full access &mdash; there&rsquo;s nothing to pay
          for yet. We&rsquo;re building our first cohorts of verified graduates,
          and paid plans start once the talent pool is worth paying for.
        </p>
        <p className="text-gray-500 text-xs mb-6">
          If you were charged in error, email{' '}
          <a href={`mailto:${BRAND.supportEmail}`} className="text-pink-600 font-semibold">
            {BRAND.supportEmail}
          </a> and we&rsquo;ll refund you.
        </p>
        <Link to="/talent-board"
          className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-6 py-3 rounded-lg">
          Browse the Talent Board
        </Link>
      </div>
    );
  }

  if (existing) {
    const activated = existing.status === ACTIVATION_STATUS.ACTIVATED;
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {activated ? 'Your access is active' : 'Payment received — confirming now'}
        </h1>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {activated
            ? 'Talent Access is live on your account. Everything is unlocked.'
            : 'We\u2019re matching your reference against our records. This is usually quick, and we\u2019ll email you the moment it\u2019s done. You don\u2019t need to do anything else.'}
        </p>
        <p className="text-gray-400 text-xs mb-6">Reference: {existing.reference}</p>
        <Link to={activated ? '/talent-board' : '/dashboard'}
          className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-6 py-3 rounded-lg">
          {activated ? 'Browse the Talent Board' : 'Back to dashboard'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-14">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirm your payment</h1>
      <p className="text-gray-600 text-sm mb-8 leading-relaxed">
        Thanks for subscribing. Enter the reference from your receipt and
        we&rsquo;ll activate your access. We confirm every payment by hand, so
        this takes a little longer than instant &mdash; but it means nobody can
        get in without paying.
      </p>

      <label className="block text-sm font-bold text-gray-900 mb-1.5">
        Payment reference *
      </label>
      <input
        value={reference}
        onChange={e => setReference(e.target.value)}
        placeholder="From your payment receipt"
        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-pink-500 text-sm outline-none mb-1"
      />
      {autoRef && (
        <p className="text-green-700 text-xs mb-4">Picked up automatically from your payment.</p>
      )}
      {!autoRef && <div className="mb-4" />}

      <label className="block text-sm font-bold text-gray-900 mb-1.5">Plan</label>
      <select
        value={plan}
        onChange={e => setPlan(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-pink-500 text-sm outline-none bg-white mb-4"
      >
        <option value="monthly">Talent Access — monthly</option>
        <option value="annual">Talent Access — annual</option>
      </select>

      <label className="block text-sm font-bold text-gray-900 mb-1.5">
        Amount paid <span className="text-gray-400 font-normal">(optional)</span>
      </label>
      <input
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="USD"
        className="w-40 px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-pink-500 text-sm outline-none mb-8"
      />

      <button
        type="button"
        onClick={submitClaim}
        disabled={saving || !reference.trim()}
        className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm px-8 py-3 rounded-lg transition-all"
      >
        {saving ? 'Submitting…' : 'Submit for activation'}
      </button>

      <p className="text-gray-400 text-xs mt-6">
        Problems? Email <a href={`mailto:${BRAND.supportEmail}`} className="text-pink-600">
          {BRAND.supportEmail}
        </a> with your reference.
      </p>
    </div>
  );
};

export default ActivateAccess;
