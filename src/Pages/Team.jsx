// src/Pages/Team.jsx
// Team page: the founder, why join, the roles we need, and the team application.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { db } from '../firebase/config';
import { TEAM_BENEFITS, TEAM_ROLES } from '../config/teamRoles';

// The founder's photo from her website; her initials if it can't load.
const FounderPhoto = () => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-pink-100 text-pink-800 text-3xl font-bold flex items-center justify-center shrink-0" aria-hidden="true">YA</div>;
  }
  return (
    <img src="https://www.opeyemitaiwoadeniran.com/images/yemi-portrait.webp" alt="Opeyemi (Yemi) Adeniran, founder of She Model Tech"
      onError={() => setFailed(true)} className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shrink-0 border-4 border-pink-50" />
  );
};

const EMPTY = { name: '', email: '', phone: '', linkedinOrPortfolio: '', socialPlatform: 'Instagram', socialHandle: '', role: '', otherRoles: [], why: '', hours: '' };
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isUrl = (v) => /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v.trim());
const words = (t) => String(t || '').trim().split(/\s+/).filter(Boolean).length;
const MIN_WHY = 20;

const Team = () => {
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const toggleOther = (id) => setF((x) => {
    if (x.otherRoles.includes(id)) return { ...x, otherRoles: x.otherRoles.filter((r) => r !== id) };
    if (x.otherRoles.length >= 2) { toast.info('You can choose up to 2 other roles.'); return x; }
    return { ...x, otherRoles: [...x.otherRoles, id] };
  });

  const submit = async (e) => {
    e.preventDefault();
    if (f.name.trim().length < 2) return toast.error('Enter your full name.');
    if (!isEmail(f.email)) return toast.error('Enter a valid email address.');
    if (f.phone.replace(/\D/g, '').length < 7) return toast.error('Enter your phone number, with your country code.');
    if (!isUrl(f.linkedinOrPortfolio)) return toast.error('Add your LinkedIn profile or a link to your portfolio.');
    if (f.socialHandle.trim().length < 2) return toast.error(`Add your ${f.socialPlatform} handle.`);
    if (!f.role) return toast.error('Choose the role you’re applying for.');
    if (words(f.why) < MIN_WHY) return toast.error(`Tell us why you’d like to join, in at least ${MIN_WHY} words (you’ve written ${words(f.why)}).`);
    setBusy(true);
    try {
      const ref = await addDoc(collection(db, 'team_applications'), {
        name: f.name.trim().slice(0, 120),
        email: f.email.trim().toLowerCase().slice(0, 200),
        phone: f.phone.trim().slice(0, 40),
        linkedinOrPortfolio: f.linkedinOrPortfolio.trim().slice(0, 300),
        socialPlatform: f.socialPlatform,
        socialHandle: f.socialHandle.trim().slice(0, 100),
        role: f.role,
        otherRoles: f.otherRoles.filter((r) => r !== f.role).slice(0, 2),
        hours: f.hours.trim().slice(0, 60),
        why: f.why.trim().slice(0, 3000),
        status: 'new',
        createdAt: serverTimestamp(),
      });
      // Tell She Model Tech and send the applicant a confirmation (best-effort).
      fetch('/api/public-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'team', id: ref.id }) }).catch(() => {});
      setDone(true);
      window.scrollTo({ top: document.getElementById('apply')?.offsetTop - 90 || 0, behavior: 'smooth' });
    } catch (err) {
      toast.error('Could not send your application. Please try again.');
    }
    setBusy(false);
  };

  const input = 'mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-normal bg-white focus:border-pink-600 focus:outline-none';
  const label = 'block text-sm font-semibold text-gray-900';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16">
        <p className="text-xs font-bold tracking-widest text-pink-600 uppercase">Our team</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">The people behind She Model Tech</h1>
        <p className="text-gray-600 mt-3 max-w-2xl">We’re a volunteer-powered nonprofit helping women learn, build, and lead in technology. Join us and help shape what comes next.</p>

        {/* Founder */}
        <section className="mt-10" aria-labelledby="founder-h">
          <h2 id="founder-h" className="text-2xl font-bold text-gray-900 mb-5">Founder</h2>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:items-center">
            <FounderPhoto />
            <div className="min-w-0">
              <p className="text-xl font-bold text-gray-900">Opeyemi (Yemi) Adeniran</p>
              <p className="text-pink-700 font-semibold text-sm mt-0.5">Founder, She Model Tech</p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Yemi is a PhD researcher in AI and the founder of Morgan TechFest. She built She Model Tech to help women
                learn, build, and lead in technology, so they don’t just enter the field but help shape its future.
              </p>
              <a href="https://www.opeyemitaiwoadeniran.com/" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-sm font-semibold text-pink-700 hover:underline">Visit her website</a>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mt-14" aria-labelledby="benefits-h">
          <h2 id="benefits-h" className="text-2xl font-bold text-gray-900 mb-5">Why join the team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEAM_BENEFITS.map(([t, d]) => (
              <div key={t} className="rounded-xl border border-gray-200 p-5">
                <p className="font-bold text-gray-900">{t}</p>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Roles */}
        <section className="mt-14" aria-labelledby="roles-h">
          <h2 id="roles-h" className="text-2xl font-bold text-gray-900 mb-1">Roles we need</h2>
          <p className="text-gray-600 text-sm mb-5">All roles are volunteer and remote.</p>
          <ul className="divide-y divide-gray-200 border-y border-gray-200">
            {TEAM_ROLES.map((r) => (
              <li key={r.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{r.title}</p>
                  <p className="text-sm text-gray-600">{r.desc}</p>
                </div>
                <a href="#apply" onClick={() => setF((x) => ({ ...x, role: r.id }))} className="shrink-0 text-sm font-semibold text-pink-700 hover:underline">Apply</a>
              </li>
            ))}
          </ul>
        </section>

        {/* Application */}
        <section id="apply" className="mt-14 scroll-mt-28" aria-labelledby="apply-h">
          <h2 id="apply-h" className="text-2xl font-bold text-gray-900 mb-1">Apply to join the team</h2>
          <p className="text-gray-600 text-sm mb-6">It takes about 5 minutes. We reply to every application by email.</p>
          {done ? (
            <div className="rounded-2xl bg-pink-50 border border-pink-200 p-6">
              <p className="font-bold text-gray-900 text-lg">Thank you, your application is in!</p>
              <p className="text-gray-700 mt-1">We’ve sent a confirmation to {f.email}. We’ll review it and reply within a few working days.</p>
              <Link to="/" className="inline-block mt-4 text-sm font-semibold text-pink-700 hover:underline">Back to She Model Tech</Link>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="rounded-2xl border border-gray-200 p-5 sm:p-8 grid sm:grid-cols-2 gap-5">
              <label className={label}>Full name *<input className={input} value={f.name} onChange={set('name')} autoComplete="name" /></label>
              <label className={label}>Email *<input className={input} type="email" value={f.email} onChange={set('email')} autoComplete="email" /></label>
              <label className={label}>Phone number * <span className="font-normal text-gray-500">(with country code)</span><input className={input} type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" placeholder="+1 410 555 0123" /></label>
              <label className={label}>LinkedIn profile or portfolio link *<input className={input} value={f.linkedinOrPortfolio} onChange={set('linkedinOrPortfolio')} placeholder="linkedin.com/in/yourname" /></label>
              <div className="sm:col-span-2">
                <span className={label}>Social media handle * <span className="font-normal text-gray-500">(Instagram, X, or LinkedIn)</span></span>
                <div className="mt-1 flex gap-2">
                  <select className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white" value={f.socialPlatform} onChange={set('socialPlatform')} aria-label="Platform">
                    {['Instagram', 'X', 'LinkedIn'].map((p) => <option key={p}>{p}</option>)}
                  </select>
                  <input className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2.5 text-sm" value={f.socialHandle} onChange={set('socialHandle')} placeholder="@yourhandle" aria-label="Handle" />
                </div>
              </div>
              <label className={`${label} sm:col-span-2`}>Role you’re applying for *
                <select className={input} value={f.role} onChange={set('role')}>
                  <option value="">Choose a role</option>
                  {TEAM_ROLES.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
                </select>
              </label>
              <fieldset className="sm:col-span-2">
                <legend className={label}>Other roles that interest you <span className="font-normal text-gray-500">(optional, up to 2, in case your first choice is filled)</span></legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {TEAM_ROLES.filter((r) => r.id !== f.role).map((r) => {
                    const on = f.otherRoles.includes(r.id);
                    return (
                      <button key={r.id} type="button" aria-pressed={on} onClick={() => toggleOther(r.id)}
                        className={`text-sm px-3 py-1.5 rounded-full border ${on ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-gray-700 border-gray-300 hover:border-pink-600'}`}>
                        {r.title}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <label className={label}>Hours you can give each week <span className="font-normal text-gray-500">(optional)</span><input className={input} value={f.hours} onChange={set('hours')} placeholder="For example: 3 hours" /></label>
              <div />
              <label className={`${label} sm:col-span-2`}>Why would you like to join? * <span className="font-normal text-gray-500">(at least {MIN_WHY} words · {words(f.why)} so far)</span>
                <textarea className={input} rows={5} maxLength={3000} value={f.why} onChange={set('why')} placeholder="Tell us about your experience and what you’d bring to the role." />
              </label>
              <div className="sm:col-span-2">
                <button type="submit" disabled={busy} className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50">{busy ? 'Sending…' : 'Send application'}</button>
                <p className="text-xs text-gray-500 mt-2">We use your details only to review your application and contact you about it.</p>
              </div>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Team;
