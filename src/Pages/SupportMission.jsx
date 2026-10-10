// src/Pages/SupportMission.jsx
// "Support our mission": fund a cohort. A gift to She Model Tech, a 501(c)(3).
// Companies that fund a cohort are thanked with their logo; sponsors don't
// choose projects or members. "Contact us to fund a cohort" opens a short form;
// requests go to Admin → Sponsors (and the team inbox), like team applications.
import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useFeatures } from '../utils/features';
import SponsorsStrip from '../components/SponsorsStrip';
import Navbar from '../components/Navbar';
import { DEDUCTIBLE_LINE, ORG_LEGAL_NAME, ORG_EIN } from '../config/nonprofit';
import Footer from '../components/Footer';

const DONATION_LINK = process.env.REACT_APP_DONATION_LINK || null;

const GIVER_TYPES = [['company', 'A company'], ['foundation', 'A foundation or trust'], ['individual', 'Myself, as an individual'], ['other', 'Other']];
const FUNDING_FOR = [['cohort', 'A whole cohort'], ['team', 'One team'], ['laptops', 'Laptops and internet for members'], ['unsure', 'Not sure yet']];
const AMOUNTS = [['unsure', 'Not sure yet'], ['under1k', 'Under $1,000'], ['1k-5k', '$1,000 to $5,000'], ['5k-20k', '$5,000 to $20,000'], ['over20k', 'Over $20,000']];
const isEmail = (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(v || '').trim());

const FundForm = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [f, setF] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    organization: '',
    phone: '',
    giverType: 'company',
    fundingFor: 'cohort',
    amount: 'unsure',
    message: '',
    website: '', // left empty by people; bots fill it in
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const needsOrg = f.giverType === 'company' || f.giverType === 'foundation';

  const submit = async (e) => {
    e.preventDefault();
    if (f.website) { setDone(true); return; } // spam bot: pretend it worked
    if (f.name.trim().length < 2) return toast.error('Enter your full name.');
    if (!isEmail(f.email)) return toast.error('Enter a valid email address.');
    if (needsOrg && f.organization.trim().length < 2) return toast.error(`Enter the name of your ${f.giverType === 'company' ? 'company' : 'foundation'}.`);
    if (f.message.trim().length < 10) return toast.error('Tell us a little about what you have in mind.');
    setBusy(true);
    try {
      const ref = await addDoc(collection(db, 'funding_requests'), {
        name: f.name.trim().slice(0, 120),
        email: f.email.trim().toLowerCase().slice(0, 200),
        organization: f.organization.trim().slice(0, 150),
        phone: f.phone.trim().slice(0, 40),
        giverType: f.giverType,
        fundingFor: f.fundingFor,
        amount: f.amount,
        message: f.message.trim().slice(0, 3000),
        status: 'new',
        createdAt: serverTimestamp(),
      });
      // Tell She Model Tech and send a thank-you confirmation (best-effort).
      fetch('/api/public-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'funding', id: ref.id }) }).catch(() => {});
      setDone(true);
    } catch (err) {
      toast.error('Could not send your message. Please try again.');
    }
    setBusy(false);
  };

  const input = 'mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200';
  const label = 'block text-sm font-semibold text-gray-800';

  if (done) {
    return (
      <div className="mt-6 bg-white border border-pink-200 rounded-2xl p-6" role="status">
        <h2 className="text-lg font-bold text-gray-900">Thank you</h2>
        <p className="text-sm text-gray-700 mt-2">
          We received your message and will reply within a few working days. A copy is on its way to your email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 bg-white border border-pink-200 rounded-2xl p-5 sm:p-6 space-y-4" aria-labelledby="fund-form-h" noValidate>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="fund-form-h" className="text-lg font-bold text-gray-900">Fund a cohort</h2>
          <p className="text-sm text-gray-600 mt-1">Tell us a little about yourself and we’ll be in touch within a few working days.</p>
        </div>
        <button type="button" onClick={onClose} className="text-sm font-semibold text-gray-500 hover:text-gray-800">Close</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className={label}>Your name *
          <input value={f.name} onChange={set('name')} maxLength={120} autoComplete="name" className={input} />
        </label>
        <label className={label}>Email *
          <input type="email" value={f.email} onChange={set('email')} maxLength={200} autoComplete="email" className={input} />
        </label>
        <label className={label}>Giving as
          <select value={f.giverType} onChange={set('giverType')} className={input}>
            {GIVER_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label className={label}>{f.giverType === 'foundation' ? 'Foundation' : 'Company or organization'}{needsOrg ? ' *' : ' (optional)'}
          <input value={f.organization} onChange={set('organization')} maxLength={150} autoComplete="organization" className={input} />
        </label>
        <label className={label}>What would you like to fund?
          <select value={f.fundingFor} onChange={set('fundingFor')} className={input}>
            {FUNDING_FOR.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label className={label}>Amount in mind
          <select value={f.amount} onChange={set('amount')} className={input}>
            {AMOUNTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label className={`${label} sm:col-span-2`}>Phone (optional)
          <input type="tel" value={f.phone} onChange={set('phone')} maxLength={40} autoComplete="tel" className={input} />
        </label>
      </div>
      <label className={label}>Message *
        <textarea rows={4} value={f.message} onChange={set('message')} maxLength={3000} className={input}
          placeholder="For example: we'd like to fund a team in our city, or support members with laptops." />
      </label>
      {/* Hidden from people; spam bots fill it in. */}
      <label className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">Website
        <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} />
      </label>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button type="submit" disabled={busy} className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-xl disabled:opacity-60">
          {busy ? 'Sending…' : 'Send'}
        </button>
        <p className="text-xs text-gray-500">We only use your details to reply to you about funding.</p>
      </div>
    </form>
  );
};

const SupportMission = () => {
  const features = useFeatures();
  const canGiveOnline = features.donations && DONATION_LINK;
  const [formOpen, setFormOpen] = useState(false);
  const openForm = () => {
    setFormOpen(true);
    setTimeout(() => { try { document.getElementById('fund-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (_) { /* ignore */ } }, 50);
  };
  return (
    <div className="bg-[#FDF2F7] min-h-screen">
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 pt-14 pb-10">
        <p className="text-sm font-bold uppercase tracking-widest text-pink-700">Support our mission</p>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 tracking-tight">Fund a cohort</h1>
        <p className="text-lg text-gray-700 mt-4 max-w-2xl">
          She Model Tech empowers women in tech through real-world projects. A cohort is a group of teams that build real
          products together, guided by leads and mentors, and earn verified badges. Funding a cohort makes it possible.
        </p>
        <div className="flex flex-wrap gap-3 mt-7">
          {canGiveOnline ? (
            <a href={DONATION_LINK} target="_blank" rel="noopener noreferrer" className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-xl">
              Fund a cohort
            </a>
          ) : (
            <button type="button" onClick={openForm} aria-expanded={formOpen} aria-controls="fund-form" className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-xl">
              Contact us to fund a cohort
            </button>
          )}
        </div>
        <div id="fund-form" className="scroll-mt-24">
          {formOpen && !canGiveOnline && <FundForm onClose={() => setFormOpen(false)} />}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-10 grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-pink-100 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900">What your gift funds</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc pl-5">
            <li>Pay members on paid projects, so women earn while they learn</li>
            <li>Laptops and internet access for women who need them</li>
            <li>Certifications, awarded on clear and fair criteria</li>
            <li>Events, and the platform itself</li>
          </ul>
        </div>
        <div className="bg-white border border-pink-100 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900">How we thank sponsors</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc pl-5">
            <li>Companies that fund a cohort are thanked with their logo and name in <strong>Thank you to our sponsors</strong> on She Model Tech.</li>
            <li>You’ll receive a receipt for your records. {DEDUCTIBLE_LINE}</li>
            <li>Sponsors support our programs; She Model Tech designs and runs every cohort and chooses the teams.</li>
          </ul>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <SponsorsStrip />
        <p className="text-sm text-gray-600 mt-6 text-center">
          {ORG_LEGAL_NAME} is a 501(c)(3) nonprofit (EIN {ORG_EIN}).
        </p>
      </section>
      <Footer />
    </div>
  );
};

export default SupportMission;
