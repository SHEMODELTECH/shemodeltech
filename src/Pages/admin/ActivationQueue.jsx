// src/Pages/admin/ActivationQueue.jsx
//
// Where you confirm a payment landed and switch a company's access on.
//
// This is the manual half of ACTIVATION_MODE = 'manual'. A company submits a
// payment reference from the redirect page; you check it against your payment
// platform's dashboard; you click Activate. Access is granted HERE and only
// here, never by landing on a URL.
//
// You can also grant access directly to any company without a claim, which is
// what you'll use for partners you invoice, sponsors you comp, or anyone you
// simply want to give access to.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { usePermissions } from '../../utils/permissions';
import { ACTIVATION_STATUS, MEMBERSHIP_ENFORCED } from '../../config/membership';

const addMonths = (n) => {
  const d = new Date();
  d.setMonth(d.getMonth() + n);
  return d.toISOString();
};

const ActivationQueue = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { isReviewer, loading: permsLoading } = usePermissions(currentUser?.uid);

  const [claims, setClaims] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!permsLoading && !isReviewer) navigate('/');
  }, [currentUser, permsLoading, isReviewer, navigate]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [claimSnap, coSnap] = await Promise.all([
        getDocs(
          query(
            collection(db, 'activation_claims'),
            where('status', '==', ACTIVATION_STATUS.CLAIMED)
          )
        ),
        getDocs(query(collection(db, 'users'), where('isCompany', '==', true))),
      ]);
      setClaims(claimSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setCompanies(coSnap.docs.map((d) => ({ uid: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
      toast.error('Could not load the queue.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isReviewer) load();
  }, [isReviewer, load]);

  const activate = async (companyId, months, claimId) => {
    setBusy(companyId);
    try {
      await updateDoc(doc(db, 'users', companyId), {
        tier: 'partner',
        partnerSince: new Date().toISOString(),
        partnerUntil: addMonths(months),
        activatedBy: currentUser.email,
      });
      if (claimId) {
        await updateDoc(doc(db, 'activation_claims', claimId), {
          status: ACTIVATION_STATUS.ACTIVATED,
          activatedBy: currentUser.email,
          activatedAt: serverTimestamp(),
        });
      }
      await addDoc(collection(db, 'notifications'), {
        userId: companyId,
        recipientId: companyId,
        type: 'access_activated',
        title: 'Your Talent Access is live',
        body: 'Everything is unlocked, search the Talent Board, view verified evidence, and message members.',
        link: '/talent-board',
        isRead: false,
        read: false,
        createdAt: serverTimestamp(),
      });
      toast.success('Access activated.');
      await load();
    } catch (e) {
      toast.error('Could not activate.');
    }
    setBusy(null);
  };

  const reject = async (claimId) => {
    if (!window.confirm('Reject this claim? Use this when no matching payment was found.')) return;
    try {
      await updateDoc(doc(db, 'activation_claims', claimId), {
        status: ACTIVATION_STATUS.REJECTED,
        rejectedBy: currentUser.email,
        rejectedAt: serverTimestamp(),
      });
      toast.success('Claim rejected.');
      await load();
    } catch (e) {
      toast.error('Could not reject.');
    }
  };

  const revoke = async (companyId) => {
    if (!window.confirm('Remove Talent Access from this company?')) return;
    setBusy(companyId);
    try {
      await updateDoc(doc(db, 'users', companyId), {
        tier: 'free',
        partnerUntil: null,
      });
      toast.success('Access removed.');
      await load();
    } catch (e) {
      toast.error('Could not remove access.');
    }
    setBusy(null);
  };

  if (permsLoading || loading) {
    return <div className="min-h-screen grid place-items-center text-gray-500">Loading…</div>;
  }
  if (!isReviewer) return null;

  const partners = companies.filter((c) => c.tier === 'partner');

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Access &amp; activation</h1>
      <p className="text-gray-500 text-sm mb-6">
        Confirm payments and switch company access on. Access is granted here and nowhere else,
        never by landing on a redirect URL.
      </p>

      {!MEMBERSHIP_ENFORCED && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <p className="text-amber-900 text-sm font-bold mb-1">Membership is dormant</p>
          <p className="text-amber-800 text-xs leading-relaxed">
            Every company currently has full access for free. Nothing here is enforced yet. Set{' '}
            <code className="font-mono">MEMBERSHIP_ENFORCED = true</code> in{' '}
            <code className="font-mono">src/config/membership.js</code> when you&rsquo;re ready to
            charge, activations you grant now will already be in place.
          </p>
        </div>
      )}

      {/* Claims */}
      <h2 className="font-bold text-gray-900 mb-3">
        Payment claims {claims.length > 0 && `(${claims.length})`}
      </h2>
      {claims.length === 0 && <p className="text-gray-500 text-sm mb-8">No claims waiting.</p>}
      <div className="space-y-3 mb-10">
        {claims.map((c) => (
          <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-bold text-gray-900 text-sm">{c.companyName}</p>
            <p className="text-gray-500 text-xs mb-1">{c.companyEmail}</p>
            <p className="text-gray-600 text-xs mb-3">
              Reference: <span className="font-mono">{c.reference}</span>
              {' · '}
              {c.plan}
              {c.amount ? ` · $${c.amount}` : ''}
            </p>
            <p className="text-gray-400 text-[11px] mb-3">
              Check this reference in your payment dashboard before activating.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => activate(c.companyId, c.plan === 'annual' ? 12 : 1, c.id)}
                disabled={busy === c.companyId}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-200 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Payment confirmed, activate
              </button>
              <button
                onClick={() => reject(c.id)}
                className="text-gray-500 hover:text-red-600 text-xs font-semibold px-2 py-2"
              >
                No payment found
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Grant directly */}
      <h2 className="font-bold text-gray-900 mb-1">Grant access directly</h2>
      <p className="text-gray-500 text-xs mb-3">
        For companies you invoice, comp, or simply want to give access to.
      </p>
      <div className="space-y-2 mb-10">
        {companies
          .filter((c) => c.tier !== 'partner')
          .map((c) => (
            <div
              key={c.uid}
              className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg p-3 flex-wrap"
            >
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm">
                  {c.companyName || c.displayName || c.email}
                </p>
                <p className="text-gray-400 text-xs">{c.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => activate(c.uid, 1, null)}
                  disabled={busy === c.uid}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  1 month
                </button>
                <button
                  onClick={() => activate(c.uid, 12, null)}
                  disabled={busy === c.uid}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
                >
                  12 months
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Active partners */}
      <h2 className="font-bold text-gray-900 mb-3">
        Active partners {partners.length > 0 && `(${partners.length})`}
      </h2>
      {partners.length === 0 && <p className="text-gray-500 text-sm">None yet.</p>}
      <div className="space-y-2">
        {partners.map((c) => (
          <div
            key={c.uid}
            className="flex items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-lg p-3 flex-wrap"
          >
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm">
                {c.companyName || c.displayName || c.email}
              </p>
              <p className="text-gray-500 text-xs">
                Until {c.partnerUntil ? new Date(c.partnerUntil).toLocaleDateString() : ' - '}
              </p>
            </div>
            <button
              onClick={() => revoke(c.uid)}
              disabled={busy === c.uid}
              className="text-gray-500 hover:text-red-600 text-xs font-semibold px-2 py-1.5"
            >
              Remove access
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivationQueue;
