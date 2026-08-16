// src/Pages/company/Partner.jsx
//
// The page a company lands on. Two products, sold SEPARATELY, no bundle.
// Either can be bought without the other, and the page says so, because
// blurring them is what makes sponsorship start to look like buying access
// to people.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { PLANS, SPONSORSHIP_TIERS, formatPrice } from '../../config/payments';
import { FREE_FEATURES } from '../../config/companyAccess';
import { BRAND } from '../../config/brand';
import {
  ComingSoonRibbon,
  ComingSoonButton,
  Price,
  ComingSoonNotice,
} from '../../components/ComingSoon';

const Partner = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid))
      .then((s) => setProfile(s.exists() ? s.data() : null))
      .catch(() => {});
  }, [currentUser]);

  const checkout = async (payload, key) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!profile?.isCompany) {
      toast.error('Talent Access is for company accounts.');
      return;
    }
    setBusy(key);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, ...payload }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.error(data.error || 'Could not start checkout.');
    } catch (e) {
      toast.error('Could not start checkout.');
    }
    setBusy(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
        Hire women who have already shipped
      </h1>
      <p className="text-gray-600 mb-12 max-w-2xl leading-relaxed">
        Every graduate has built a real product on a real team. Not a course certificate, a verified
        badge backed by commit history you can inspect, with a named role and a finished project
        behind it.
      </p>

      <ComingSoonNotice />

      {/* Free tier */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
        <p className="text-gray-900 font-bold text-sm mb-2">Free for any company</p>
        <ul className="text-gray-600 text-sm space-y-1">
          {FREE_FEATURES.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
        <p className="text-gray-400 text-xs mt-3">
          No card needed. Verification is free too, submit your registration details and members can
          see who they&rsquo;re dealing with.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-12">
        {/* Talent Access */}
        <div className="relative bg-white border-2 border-pink-500 rounded-2xl p-6">
          <ComingSoonRibbon />
          <p className="text-pink-600 font-bold text-xs uppercase tracking-wide mb-2">Recurring</p>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Talent Access</h2>
          <Price
            amount={PLANS.TALENT_ACCESS_MONTHLY.amount}
            interval="month"
            note={`or ${formatPrice(PLANS.TALENT_ACCESS_ANNUAL.amount, 'year')}, two months free`}
            className="mb-5"
          />
          <ul className="text-gray-600 text-sm space-y-2 mb-6">
            {PLANS.TALENT_ACCESS_MONTHLY.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <ComingSoonButton
            onClick={() =>
              checkout(
                { kind: 'subscription', priceId: PLANS.TALENT_ACCESS_MONTHLY.priceId },
                'sub'
              )
            }
            disabled={busy === 'sub'}
            className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-200 text-white font-semibold text-sm py-3 rounded-lg transition-all"
          >
            {busy === 'sub' ? 'Starting…' : 'Get Talent Access'}
          </ComingSoonButton>
        </div>

        {/* Sponsorship */}
        <div className="relative bg-white border border-gray-200 rounded-2xl p-6">
          <ComingSoonRibbon />
          <p className="text-purple-600 font-bold text-xs uppercase tracking-wide mb-2">One-off</p>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Sponsor a team</h2>
          <Price
            amount={SPONSORSHIP_TIERS[0].amount}
            note="Funds stipends for ~5 women"
            className="mb-5"
          />
          <ul className="text-gray-600 text-sm space-y-2 mb-4">
            <li>Your name and logo on the team you fund</li>
            <li>Read-only progress updates</li>
            <li>An impact report when the cohort completes</li>
            <li>A two-week first look at the graduates you funded</li>
            <li>An invitation to demo day</li>
          </ul>
          <p className="text-gray-400 text-[11px] mb-5 leading-relaxed">
            Sponsors watch, acknowledge and recruit. The team owns its own brief, decisions and
            code, that&rsquo;s what makes the training real.
          </p>
          <button
            onClick={() => navigate('/sponsor')}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold text-sm py-3 rounded-lg transition-all"
          >
            Sponsor a cohort
          </button>
        </div>
      </div>

      <p className="text-gray-500 text-sm text-center">
        Questions?{' '}
        <a
          href={`mailto:${BRAND.supportEmail}`}
          className="text-pink-600 font-semibold hover:underline"
        >
          {BRAND.supportEmail}
        </a>
      </p>
    </div>
  );
};

export default Partner;
