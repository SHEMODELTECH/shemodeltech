// src/Pages/company/Sponsor.jsx
//
// Where a company sponsors a team.
//
// Two things are stated plainly, because getting them wrong later is
// expensive: exactly what the money buys, and exactly what it doesn't. A
// sponsor who expects to direct the work is really buying client services,
// and it's far better to find that out on this page than in week six.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { SPONSORSHIP_TIERS, formatPrice } from '../../config/payments';
import { MEMBERSHIP_ENFORCED, PAYMENT_LINKS } from '../../config/membership';
import {
 SPONSOR_ENTITLEMENTS, SPONSOR_LIMITS, OVERHEAD_RATE, computeStipends,
} from '../../utils/sponsorships';
import { BRAND } from '../../config/brand';

const Sponsor = () => {
 const { currentUser } = useAuth();
 const navigate = useNavigate();
 const [profile, setProfile] = useState(null);
 const [selected, setSelected] = useState(SPONSORSHIP_TIERS[0].id);
 const [busy, setBusy] = useState(false);

 useEffect(() => {
 if (!currentUser) return;
 getDoc(doc(db, 'users', currentUser.uid))
 .then(s => setProfile(s.exists() ? s.data() : null))
 .catch(() => {});
 }, [currentUser]);

 const tier = SPONSORSHIP_TIERS.find(t => t.id === selected);
 // Show the split honestly, a sponsor should know what reaches the women
 // and what covers running the programme.
 const split = computeStipends(tier.amount, tier.id === 'sponsor_team' ? 5
 : tier.id === 'sponsor_two_teams' ? 10 : 30);

 const sponsor = async () => {
 if (!currentUser) { navigate('/login?next=/sponsor'); return; }
 if (!profile?.isCompany) {
 toast.error('Sponsorship is for company accounts.');
 return;
 }

 // A pasted payment link takes priority, that's the manual route.
 if (PAYMENT_LINKS.sponsorship) {
 window.location.href = PAYMENT_LINKS.sponsorship;
 return;
 }

 setBusy(true);
 try {
 const idToken = await auth.currentUser.getIdToken();
 const res = await fetch('/api/payments/create-checkout', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 idToken, kind: 'sponsorship', amount: tier.amount, label: tier.name,
 }),
 });
 const data = await res.json();
 if (data.url) window.location.href = data.url;
 else toast.error(data.error || 'Could not start checkout.');
 } catch (e) {
 toast.error('Could not start checkout.');
 }
 setBusy(false);
 };

 return (
 <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
 <h1 className="text-3xl font-bold text-gray-900 mb-3">Sponsor a team</h1>
 <p className="text-gray-600 mb-8 leading-relaxed">
 Your sponsorship pays training stipends to a team of women building a real
 product over eight weeks. They finish with verified badges, a certificate,
 and something they can show an employer.
 </p>

 {/* Tiers */}
 <div className="space-y-2 mb-6">
 {SPONSORSHIP_TIERS.map(t => (
 <button key={t.id} type="button" onClick={() => setSelected(t.id)}
 className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
 selected === t.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white hover:border-gray-300'
 }`}>
 <div className="flex items-start justify-between gap-3">
 <div>
 <p className="font-bold text-gray-900 text-sm">{t.name}</p>
 <p className="text-gray-500 text-xs mt-0.5">{t.blurb}</p>
 </div>
 <span className="font-bold text-gray-900 shrink-0">{formatPrice(t.amount)}</span>
 </div>
 </button>
 ))}
 </div>

 {/* Where the money goes */}
 <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
 <p className="text-gray-900 text-xs font-bold mb-2">Where your money goes</p>
 <p className="text-gray-600 text-xs leading-relaxed">
 <strong>{formatPrice(split.stipendPool)}</strong> goes directly to the women
 as training stipends, about {formatPrice(split.perMember)} each.
 The remaining {Math.round(OVERHEAD_RATE * 100)}% covers running the
 programme: mentoring, review, hosting and support.
 </p>
 </div>

 {/* What you get */}
 <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
 <p className="text-gray-900 text-sm font-bold mb-2">What sponsorship includes</p>
 <ul className="text-gray-600 text-sm space-y-1.5">
 {SPONSOR_ENTITLEMENTS.map((e, i) => <li key={i}>{e}</li>)}
 </ul>
 </div>

 {/* What it isn't, said up front on purpose */}
 <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
 <p className="text-gray-900 text-sm font-bold mb-2">What it isn&rsquo;t</p>
 <ul className="text-gray-500 text-sm space-y-1.5 mb-3">
 {SPONSOR_LIMITS.map((l, i) => <li key={i}>{l}</li>)}
 </ul>
 <p className="text-gray-500 text-xs leading-relaxed">
 The team owns its brief, its decisions and its code, that&rsquo;s what
 makes the training real, and it&rsquo;s what your name is attached to. If you
 need work built to your specification, host your own paid project instead:
 you&rsquo;d own that outright.
 </p>
 </div>

 {!MEMBERSHIP_ENFORCED ? (
 <div className="bg-pink-50 border border-pink-200 rounded-xl p-5 text-center">
 <p className="text-gray-900 text-sm font-bold mb-1">Sponsorship opens soon</p>
 <p className="text-gray-600 text-xs mb-3 leading-relaxed">
 We&rsquo;re running our first cohorts now. If you&rsquo;d like to sponsor a
 team, get in touch and we&rsquo;ll walk you through it directly.
 </p>
 <a href={`mailto:${BRAND.supportEmail}?subject=Sponsoring%20a%20She%20Model%20Tech%20team`}
 className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-6 py-3 rounded-lg">
 Talk to us about sponsoring
 </a>
 </div>
 ) : (
 <button type="button" onClick={sponsor} disabled={busy}
 className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-200 text-white font-semibold text-sm py-3.5 rounded-lg transition-all">
 {busy ? 'Starting…' : `Sponsor, ${formatPrice(tier.amount)}`}
 </button>
 )}

 <p className="text-center text-gray-400 text-xs mt-6">
 Questions? <a href={`mailto:${BRAND.supportEmail}`} className="text-pink-600 font-semibold">
 {BRAND.supportEmail}
 </a>
 </p>
 </div>
 );
};

export default Sponsor;
