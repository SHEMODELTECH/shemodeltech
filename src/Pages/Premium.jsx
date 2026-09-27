// src/Pages/Premium.jsx
// What Premium includes, who has it, and how to get it. Payments are off for
// now: people contact the team, and an admin grants Premium.
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { PREMIUM_FEATURES, PREMIUM_PAYMENTS_ON, PREMIUM_PAYMENT_LINK, isMentorProfile, isPremium } from '../config/premium';
import PremiumBadge from '../components/PremiumBadge';
import { getStaff } from '../utils/staffAlerts';

const Section = ({ title, items, note }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6">
    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    {note && <p className="text-sm text-gray-600 mt-1">{note}</p>}
    <ul className="mt-4 space-y-3">
      {items.map(([t, d]) => (
        <li key={t} className="flex gap-3">
          <span className="text-amber-500 mt-0.5" aria-hidden="true">★</span>
          <span>
            <span className="font-semibold text-gray-900">{t}</span>
            <span className="block text-sm text-gray-600">{d}</span>
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const Premium = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [teamUid, setTeamUid] = useState(null);
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid)).then((s) => setProfile(s.data() || {})).catch(() => {});
    getStaff(['admin']).then((s) => s[0] && setTeamUid(s[0].uid)).catch(() => {});
  }, [currentUser]);

  const premium = isPremium(profile);
  const ask = () => {
    const text = `Hi, I'd like to get She Model Tech Premium${profile?.isCompany ? ' for our company' : ''}. Could you tell me more?`;
    if (teamUid) navigate(`/messages?to=${teamUid}&text=${encodeURIComponent(text)}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-pink-50 p-6 mb-6">
        <PremiumBadge size="md" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">She Model Tech Premium</h1>
        <p className="text-gray-700 mt-2 max-w-2xl">
          Premium is for companies: more visibility and hiring tools. Every member keeps every career tool free,
          including courses, projects, the Talent Board, AI-powered matches, messaging, certificates, and badges.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {premium ? (
            <p className="font-semibold text-emerald-800">
              You have Premium{profile?.premium?.until ? ` until ${new Date(profile.premium.until).toLocaleDateString()}` : ''}.
            </p>
          ) : profile && !profile.isCompany ? (
            <p className="text-sm text-gray-700">Premium is for company accounts. As a member, every career tool is already free for you.</p>
          ) : PREMIUM_PAYMENTS_ON && PREMIUM_PAYMENT_LINK ? (
            <a href={PREMIUM_PAYMENT_LINK} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">Get Premium</a>
          ) : (
            <>
              <button onClick={ask} disabled={!teamUid} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50">
                Ask about Premium
              </button>
              <span className="text-sm text-gray-600">Online payment is coming soon. For now, message our team to get Premium.</span>
            </>
          )}
        </div>
        {isMentorProfile(profile) && (
          <p className="text-sm text-indigo-800 mt-3">As a mentor, your courses, profile, and Talent Board listing are featured, and you have priority support, all free.</p>
        )}
      </div>

      <div className="grid gap-5">
        <Section title="Premium for companies" items={PREMIUM_FEATURES.companies} note="Company verification stays free. Premium adds the Verified Partner badge." />
        <Section title="Free for every mentor" items={PREMIUM_FEATURES.mentors} note="Our thanks for the extra work mentors give. Nothing to pay." />
      </div>

      {/* Where Premium goes: shown to signed-in visitors on this page only */}
      <div className="mt-5 bg-white border border-pink-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-900">Where Premium goes</h2>
        <p className="text-sm text-gray-700 mt-2">
          SHE MODEL TECH Inc. is a registered 501(c)(3) nonprofit. Premium is for companies, and every dollar from it goes
          back into our mission to empower women in tech. It funds:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc pl-5">
          <li><strong>Paid opportunities for our members:</strong> paid projects, so women earn while they learn, and fair pay for members who lead projects, create courses, and mentor.</li>
          <li><strong>Education:</strong> certifications for members, awarded on clear and fair criteria such as badges earned, projects completed, and financial need, plus support for women going to school and university.</li>
          <li><strong>Access:</strong> laptops and internet access for women who need them.</li>
          <li><strong>Community:</strong> summits and events that connect women in tech.</li>
          <li><strong>Running the platform:</strong> hosting, security, tools, and the team that keeps She Model Tech free for every member.</li>
        </ul>
        <p className="text-sm text-gray-700 mt-3">
          Courses, projects, the Talent Board, AI-powered matches, messaging, certificates, and badges stay free for every member, always.
        </p>
      </div>

      <p className="text-sm text-gray-500 mt-6">
        See everything that's free in <Link to="/settings" className="text-pink-700 font-semibold hover:underline">Settings, What's included</Link>.
      </p>
    </div>
  );
};

export default Premium;
