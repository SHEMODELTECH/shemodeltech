// src/Pages/Premium.jsx
// Company tiers: Supporter, Partner, Champion (they replace the old Premium).
// While "Tier payments" is off, companies "Ask about" a tier and an admin sets
// it in Admin → Users. Members' features stay free, always.
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { TIERS, TIER_LABEL, TIER_PAYMENT_LINKS, companyTier, perksFor } from '../config/tiers';
import { getStaff } from '../utils/staffAlerts';
import { useFeatures } from '../utils/features';

const BLURB = {
  supporter: 'Hire from our talent and show your support.',
  partner: 'Everything in Supporter, plus the Summit stage, featured jobs, and challenges.',
  champion: 'Everything in Partner, plus a speaking slot, promotion, and priority support.',
};

const Premium = () => {
  const features = useFeatures();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [teamUid, setTeamUid] = useState(null);
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid)).then((s) => setProfile(s.data() || {})).catch(() => {});
    getStaff(['admin']).then((s) => s[0] && setTeamUid(s[0].uid)).catch(() => {});
  }, [currentUser]);

  const mine = companyTier(profile);
  const ask = (t) => {
    const text = `Hi, I'd like to know more about the ${TIER_LABEL[t]} tier for our company.`;
    if (teamUid) navigate(`/messages?to=${teamUid}&text=${encodeURIComponent(text)}`);
    else navigate('/support');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <p className="text-sm font-semibold text-pink-700">For companies</p>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">Company tiers</h1>
      <p className="text-gray-600 mt-2 max-w-2xl">
        She Model Tech runs every project and pays members on paid projects. Companies support the mission and work with
        our talent through three tiers.
      </p>
      {!features.companyTiers && (
        <p className="mt-3 text-sm text-gray-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-2xl">
          Company tiers open soon. Until then, companies have free access to the Talent Board.
        </p>
      )}
      {mine && (
        <p className="mt-3 text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 max-w-2xl">
          Your company is on the {TIER_LABEL[mine]} tier.
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {TIERS.map((t) => {
          const current = mine === t;
          const link = TIER_PAYMENT_LINKS[t];
          return (
            <div key={t} className={`rounded-2xl border p-5 flex flex-col ${t === 'champion' ? 'border-pink-400 bg-pink-50/40' : 'border-gray-200 bg-white'}`}>
              <p className="text-lg font-bold text-gray-900">{TIER_LABEL[t]}</p>
              <p className="text-sm text-gray-600 mt-1">{BLURB[t]}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-800 flex-1">
                {perksFor(t).map((perk) => (
                  <li key={perk} className="flex gap-2"><span className="text-pink-600" aria-hidden="true">✓</span><span>{perk}</span></li>
                ))}
              </ul>
              {current ? (
                <p className="mt-5 text-sm font-semibold text-emerald-700">Your current tier</p>
              ) : features.premiumPayments && link ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className="mt-5 text-center bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
                  Choose {TIER_LABEL[t]}
                </a>
              ) : (
                <button type="button" onClick={() => ask(t)} disabled={!currentUser} className="mt-5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg disabled:opacity-50">
                  Ask about {TIER_LABEL[t]}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Summit panels and speaking slots are sponsored sessions, approved by She Model Tech. Free companies can browse the
        Talent Board and start up to 5 new conversations a month.
      </p>

      <div className="mt-8 bg-white border border-pink-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-900">Where the money goes</h2>
        <p className="text-sm text-gray-700 mt-2">
          SHE MODEL TECH Inc. is a registered 501(c)(3) nonprofit. Every dollar from company tiers goes back into our
          mission to empower women in tech. It funds:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc pl-5">
          <li><strong>Paid opportunities for our members:</strong> paid projects, so women earn while they learn, and fair pay for members who lead projects, create courses, and mentor.</li>
          <li><strong>Education:</strong> certifications for members, awarded on clear and fair criteria, plus support for women going to school and university.</li>
          <li><strong>Access:</strong> laptops and internet access for women who need them.</li>
          <li><strong>Community:</strong> summits and events that connect women in tech.</li>
          <li><strong>Running the platform:</strong> hosting, security, tools, and the team that keeps She Model Tech free for every member.</li>
        </ul>
        <p className="text-sm text-gray-700 mt-3">
          Courses, projects, badges, certificates, messaging, and AI-powered matches stay free for every member, always.
        </p>
      </div>
      <p className="text-sm text-gray-500 mt-6">
        Questions? <Link to="/support" className="text-pink-700 font-semibold hover:underline">Contact support</Link>.
      </p>
    </div>
  );
};

export default Premium;
