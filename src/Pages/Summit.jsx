// src/Pages/Summit.jsx
// Public Summit page: details, agenda, speakers, workshops, free registration
// (members one click; others create a free account first), partner options with
// an inquiry form, and sponsors (logos and names only).
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import SocialLinks from '../components/SocialLinks';
import LimitHint, { countWords } from '../components/LimitHint';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { alertStaff } from '../utils/staffAlerts';
import {
  PARTNER_OPTIONS,
  SUMMIT_LIMITS,
  createPartnerRequest,
  getCurrentSummit,
  getMyRegistration,
  registerForSummit,
} from '../utils/summit';

const lines = (t) => String(t || '').split('\n').map((l) => l.trim()).filter(Boolean);
const fmtDate = (d) => (d ? new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '');

const Summit = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [summit, setSummit] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [reg, setReg] = useState(null);
  const [share, setShare] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pForm, setPForm] = useState({ companyName: '', contactName: '', contactEmail: '', option: 'booth', message: '' });
  const [pSent, setPSent] = useState(false);

  useEffect(() => {
    getCurrentSummit().then(setSummit).catch(() => setSummit(null));
  }, []);
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid)).then((s) => {
      const p = s.data() || {};
      setProfile(p);
      if (p.isCompany) setPForm((f) => ({ ...f, companyName: p.companyProfile?.companyName || p.displayName || '', contactEmail: currentUser.email || '' }));
    }).catch(() => {});
  }, [currentUser]);
  useEffect(() => {
    if (currentUser && summit?.id) getMyRegistration(summit.id, currentUser.uid).then(setReg).catch(() => {});
  }, [currentUser, summit]);

  const register = async () => {
    if (!currentUser) {
      try {
        sessionStorage.setItem('smt_return_to', '/summit');
      } catch (_) {
        /* ignore */
      }
      return navigate('/login');
    }
    setBusy(true);
    try {
      await registerForSummit(summit, currentUser, profile, share);
      setReg({ checkedIn: false, shareProfile: share });
      toast.success('You’re registered. See you at the Summit!');
    } catch (e) {
      toast.error('Could not register you. Please try again.');
    }
    setBusy(false);
  };

  const sendPartner = async (e) => {
    e.preventDefault();
    if (!pForm.companyName.trim()) return toast.error('Add your company name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pForm.contactEmail.trim())) return toast.error('Add a valid contact email.');
    if (countWords(pForm.message) < SUMMIT_LIMITS.messageMinWords)
      return toast.error(`Tell us a little about what you have in mind: at least ${SUMMIT_LIMITS.messageMinWords} words (you have ${countWords(pForm.message)}).`);
    setBusy(true);
    try {
      await createPartnerRequest(summit.id, pForm, currentUser && profile?.isCompany ? currentUser.uid : null);
      if (currentUser) {
        alertStaff({ type: 'summit_partner', title: 'New Summit partner request', body: `${pForm.companyName}: ${PARTNER_OPTIONS[pForm.option]}.`, link: '/admin', roles: ['admin', 'editor'] });
      }
      setPSent(true);
    } catch (e2) {
      toast.error('Could not send your request. Please try again.');
    }
    setBusy(false);
  };

  const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';
  const label = 'block text-sm font-semibold text-gray-800 mb-1';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {summit === undefined ? (
          <p className="text-gray-500">Loading...</p>
        ) : !summit ? (
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-900">The She Model Tech Summit</h1>
            <p className="text-gray-600 mt-3">Details for our next Summit are coming soon. Create a free account to hear first.</p>
            {!currentUser && <Link to="/login?mode=signup" className="inline-block mt-5 bg-pink-600 text-white font-semibold px-5 py-3 rounded-lg">Create a free account</Link>}
          </div>
        ) : (
          <>
            <section className="rounded-3xl bg-gradient-to-br from-pink-50 via-white to-indigo-50 border border-pink-100 p-6 sm:p-10">
              <p className="text-pink-600 text-sm font-semibold uppercase tracking-widest">She Model Tech Summit</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">{summit.title}</h1>
              {summit.tagline && <p className="text-lg text-gray-700 mt-2">{summit.tagline}</p>}
              <p className="text-gray-700 mt-4">
                <strong>{fmtDate(summit.startDate)}</strong>
                {summit.endDate && summit.endDate !== summit.startDate ? ` to ${fmtDate(summit.endDate)}` : ''}
                {summit.venue ? ` · ${summit.venue}` : ''}
              </p>
              <div className="mt-6">
                {reg ? (
                  <p className="font-semibold text-emerald-800">✓ You’re registered{reg.checkedIn ? ' and checked in' : ''}.</p>
                ) : profile?.isCompany ? (
                  <a href="#partner" className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg">Partner with the Summit</a>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <button onClick={register} disabled={busy} className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-60">
                      {currentUser ? 'Register free' : 'Create a free account to register'}
                    </button>
                    {currentUser && (
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} />
                        Let recruiting companies at the Summit see my Talent Board profile
                      </label>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">Free for every member.</p>
              </div>
            </section>

            {summit.description && <p className="text-gray-700 mt-8 whitespace-pre-wrap leading-relaxed">{summit.description}</p>}

            <div className="grid md:grid-cols-3 gap-5 mt-8">
              {[['Agenda', summit.agenda], ['Speakers', summit.speakers], ['Workshops', summit.workshops]].map(([t, v]) =>
                lines(v).length ? (
                  <section key={t} className="rounded-2xl border border-gray-200 p-5">
                    <h2 className="font-bold text-gray-900">{t}</h2>
                    <ul className="mt-3 space-y-2 text-sm text-gray-700">
                      {lines(v).map((l, i) => <li key={i}>{l}</li>)}
                    </ul>
                  </section>
                ) : null
              )}
            </div>

            {(summit.sponsors || []).length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold text-gray-900">Thank you to our sponsors</h2>
                <div className="flex flex-wrap items-center gap-6 mt-4">
                  {summit.sponsors.map((s) => (
                    <a key={s.name} href={s.url || undefined} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                      {s.logoUrl ? <img src={s.logoUrl} alt={s.name} className="h-12 w-auto object-contain" /> : null}
                      <span className="text-sm font-semibold text-gray-700">{s.name}</span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            <section id="partner" className="mt-12 rounded-2xl border border-gray-200 p-6 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900">Partner with the Summit</h2>
              <p className="text-sm text-gray-600 mt-1">
                Meet women building real tech careers. Sponsored workshops are labeled as sponsored, and sponsorships are
                acknowledged with your logo and name.
              </p>
              <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
                {Object.values(PARTNER_OPTIONS).map((o) => <li key={o} className="rounded-lg bg-gray-50 px-3 py-2">{o}</li>)}
              </ul>
              {summit.partnerOptions && <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">{summit.partnerOptions}</p>}
              {pSent ? (
                <p className="mt-5 font-semibold text-emerald-800">Thank you. We’ll be in touch at {pForm.contactEmail}.</p>
              ) : (
                <form onSubmit={sendPartner} className="mt-5 grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={label} htmlFor="p-co">Company</label>
                    <input id="p-co" className={input} maxLength={150} value={pForm.companyName} onChange={(e) => setPForm({ ...pForm, companyName: e.target.value })} />
                  </div>
                  <div>
                    <label className={label} htmlFor="p-opt">Option</label>
                    <select id="p-opt" className={input} value={pForm.option} onChange={(e) => setPForm({ ...pForm, option: e.target.value })}>
                      {Object.entries(PARTNER_OPTIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={label} htmlFor="p-name">Contact name</label>
                    <input id="p-name" className={input} value={pForm.contactName} onChange={(e) => setPForm({ ...pForm, contactName: e.target.value })} />
                  </div>
                  <div>
                    <label className={label} htmlFor="p-email">Contact email</label>
                    <input id="p-email" type="email" className={input} value={pForm.contactEmail} onChange={(e) => setPForm({ ...pForm, contactEmail: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={label} htmlFor="p-msg">
                      Message <span className="font-normal text-gray-500">(at least {SUMMIT_LIMITS.messageMinWords} words, up to {SUMMIT_LIMITS.messageMaxChars} characters)</span>
                    </label>
                    <textarea id="p-msg" rows={3} className={input} maxLength={SUMMIT_LIMITS.messageMaxChars} value={pForm.message} onChange={(e) => setPForm({ ...pForm, message: e.target.value })} />
                    <LimitHint text={pForm.message} minWords={SUMMIT_LIMITS.messageMinWords} maxChars={SUMMIT_LIMITS.messageMaxChars} />
                  </div>
                  <div className="sm:col-span-2">
                    <button type="submit" disabled={busy} className="bg-gray-900 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">Send partner request</button>
                  </div>
                </form>
              )}
            </section>
          </>
        )}
      </main>
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>SHE MODEL TECH Inc., a registered 501(c)(3) nonprofit.</p>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
};

export default Summit;
