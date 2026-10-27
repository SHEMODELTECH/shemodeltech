// src/Pages/Conference.jsx
// She Model Tech Conference (shemodeltech.com/conference): a public page with
// the programme, speakers, the pitch competition, partner organizations, and
// registration. What it shows (date, venue, registration link, speakers,
// partners) is set by staff in Admin → Conference (utils/conference.js).
// Until registration opens, members can tap "Notify me".
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { signInAndReturn } from './learning/LearningLayout';
import {
  PARTNER_PACKAGES, PROGRAM, getConferencePage, getJoinLink, isNotified, isRegistered, notifyMe, register, stopNotify, unregister,
} from '../utils/conference';

const ICONS = {
  talks: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
  panel: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  workshops: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  leadership: 'M13 10V3L4 14h7v7l9-11h-7z',
  pitch: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  ministration: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  networking: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
};
const Icon = ({ k, className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={ICONS[k]} /></svg>
);

const TBA = 'To be announced';

// Register (when open), or "coming soon" with Notify me. Registration is on
// this page: registered people see their place and, if online, the link.
const RegisterCta = ({ conf, dark = false }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [notified, setNotified] = useState(null);
  const [registered, setRegistered] = useState(null);
  const [joinLink, setJoinLink] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!currentUser) return;
    isNotified(currentUser.uid).then(setNotified);
    isRegistered(currentUser.uid).then((r) => { setRegistered(r); if (r) getJoinLink().then(setJoinLink); });
  }, [currentUser]);
  const sub = dark ? 'text-gray-300' : 'text-gray-600';

  if (conf.registrationOpen) {
    const doRegister = async () => {
      if (!currentUser) { signInAndReturn(navigate, '/conference'); return; }
      setBusy(true);
      try {
        await register(currentUser.uid, currentUser.displayName);
        setRegistered(true);
        getJoinLink().then(setJoinLink);
        toast.success('You’re registered! See you at She Model Tech Conference.');
      } catch (_) { toast.error('Could not register. Please confirm your email address, then try again.'); }
      setBusy(false);
    };
    const cancel = async () => {
      if (!window.confirm('Cancel your registration?')) return;
      try { await unregister(currentUser.uid); setRegistered(false); setJoinLink(''); toast.success('Your registration is cancelled.'); } catch (_) { toast.error('Could not cancel. Please try again.'); }
    };
    if (registered) {
      return (
        <div className="flex flex-col items-center gap-3">
          <span className={`text-sm font-bold px-4 py-2 rounded-full ${dark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>✓ You’re registered</span>
          {joinLink && /^https:\/\//i.test(joinLink) && (
            <a href={joinLink} target="_blank" rel="noopener noreferrer" className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg">Join the conference</a>
          )}
          <p className={`text-sm ${sub}`}>{joinLink ? 'Keep this page handy on the day.' : 'We’ll share the details before the day.'}</p>
          <button type="button" onClick={cancel} className={`text-xs ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>Cancel my registration</button>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center gap-3">
        <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${dark ? 'bg-white/10 text-pink-300' : 'bg-pink-50 text-pink-700'}`}>Registration is open</span>
        <button type="button" disabled={busy || registered === null && !!currentUser} onClick={doRegister}
          className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white font-semibold text-base px-8 py-4 rounded-lg disabled:opacity-60">
          {currentUser ? 'Register now, free' : 'Create a free account to register'}
        </button>
      </div>
    );
  }
  const toggle = async () => {
    if (!currentUser) { signInAndReturn(navigate, '/conference'); return; }
    try {
      if (notified) { await stopNotify(currentUser.uid); setNotified(false); toast.success('You won’t get the registration notice.'); }
      else { await notifyMe(currentUser.uid); setNotified(true); toast.success('Done! We’ll let you know when registration opens.'); }
    } catch (_) { toast.error('Could not save. Please try again.'); }
  };
  return (
    <div className="flex flex-col items-center gap-3">
      <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${dark ? 'bg-white/10 text-pink-300' : 'bg-pink-50 text-pink-700'}`}>Registration coming soon</span>
      <button type="button" onClick={toggle} aria-pressed={!!notified}
        className={`w-full sm:w-auto font-semibold text-base px-8 py-4 rounded-lg ${notified ? (dark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white') : 'bg-pink-600 hover:bg-pink-700 text-white'}`}>
        {notified ? '✓ We’ll notify you' : currentUser ? 'Notify me when registration opens' : 'Create a free account to get notified'}
      </button>
      {notified && <button type="button" onClick={toggle} className={`text-xs ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>Stop notifying me</button>}
    </div>
  );
};

const Conference = () => {
  const [conf, setConf] = useState(null);
  useEffect(() => { getConferencePage().then(setConf); }, []);
  // Links like /conference#partner: scroll there once the page has loaded.
  useEffect(() => {
    if (!conf || !window.location.hash) return;
    const el = document.getElementById(window.location.hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }, [conf]);
  const c = conf || {};
  const speakers = (c.speakers || []).filter((s) => s && s.name);
  const partners = (c.partners || []).filter((p) => p && p.name);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gray-950 text-white">
          <div aria-hidden="true" className="absolute -right-40 -top-40 w-[34rem] h-[34rem] rounded-full border-[56px] border-pink-600/25" />
          <div aria-hidden="true" className="absolute -left-24 bottom-[-10rem] w-80 h-80 rounded-full bg-pink-600/20 blur-3xl" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 sm:pb-20 text-center">
            <p className="text-pink-400 text-sm font-semibold uppercase tracking-[0.2em]">She Model Tech Conference</p>
            <h1 className="mt-4 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
              Learn. Build. <span className="text-pink-500">Lead.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              A yearly conference for women building careers in tech. Come to learn, connect, and leave ready for your next step.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
              <span className="bg-white/10 border border-white/10 rounded-full px-4 py-2"><span className="text-gray-400">Date:</span> <b>{c.dateText || TBA}</b></span>
              <span className="bg-white/10 border border-white/10 rounded-full px-4 py-2"><span className="text-gray-400">Venue:</span> <b>{c.venue || TBA}</b></span>
              <span className="bg-pink-600/90 rounded-full px-4 py-2 font-semibold">Free for members</span>
            </div>
            <div className="mt-10">{conf ? <RegisterCta conf={c} dark /> : <div className="h-14" />}</div>
          </div>
        </section>

        {/* Programme */}
        <section className="py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-pink-600 text-sm font-semibold uppercase tracking-widest mb-3">The programme</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">One day, many ways to grow</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PROGRAM.map(([k, title, desc]) => (
                <div key={k} className={`rounded-2xl border p-6 flex flex-col ${k === 'networking' ? 'sm:col-span-2 lg:col-span-3' : ''} ${k === 'pitch' ? 'border-pink-200 bg-pink-50/60' : 'border-gray-200 bg-white'}`}>
                  <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${k === 'pitch' ? 'bg-pink-600 text-white' : 'bg-gray-900 text-white'}`}><Icon k={k} /></span>
                  <h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{desc}</p>
                  {k === 'pitch' && <Link to="/founders" className="mt-auto pt-4 text-sm font-semibold text-pink-700 hover:underline">How to pitch →</Link>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Speakers */}
        <section className="py-16 sm:py-24 bg-gray-50 border-y border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-pink-600 text-sm font-semibold uppercase tracking-widest mb-3">Speakers</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">Voices you’ll hear</h2>
            </div>
            {speakers.length ? (
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-10">
                {speakers.map((s, i) => (
                  <div key={`${s.name}-${i}`} className="text-center w-[calc(50%-12px)] sm:w-52">
                    <span className="block w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full p-1 bg-pink-600">
                      {s.photoUrl ? <img src={s.photoUrl} alt={s.name} loading="lazy" className="w-full h-full rounded-full object-cover bg-white" />
                        : <span className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-bold text-pink-600">{s.name[0]}</span>}
                    </span>
                    {s.role && <span className="inline-block mt-3 text-[11px] font-bold uppercase tracking-wide bg-gray-900 text-white px-2.5 py-1 rounded-full">{s.role}</span>}
                    <p className="mt-2 font-bold text-gray-900">{s.name}</p>
                    {s.title && <p className="text-sm text-gray-600">{s.title}</p>}
                    {s.topic && <p className="mt-1 text-sm font-semibold text-pink-700">{s.topic}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center max-w-xl mx-auto">
                <p className="text-lg text-gray-700">Speakers to be announced.</p>
                <p className="text-sm text-gray-500 mt-2">Would you like to speak, lead a workshop, or join a panel? <Link to="/contact" className="font-semibold text-pink-700 hover:underline">Tell us</Link>.</p>
              </div>
            )}
          </div>
        </section>

        {/* Pitch competition */}
        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-pink-600 text-white p-8 sm:p-12 grid md:grid-cols-3 gap-8 items-center relative overflow-hidden">
              <div aria-hidden="true" className="absolute -right-20 -bottom-24 w-72 h-72 rounded-full border-[40px] border-white/15" />
              <div className="relative md:col-span-2">
                <p className="text-sm font-semibold uppercase tracking-widest text-pink-100">Pitch competition</p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-tight">Have an idea? Pitch it for prize money.</h2>
                <p className="mt-4 text-pink-50 leading-relaxed">Members with at least one badge can apply to pitch. Accepted founders build their team on She Model Tech and pitch on stage. Selected founders may also be invited to pitch at our partner organizations’ events.</p>
              </div>
              <div className="relative md:text-right">
                <Link to="/founders" className="inline-block bg-white text-pink-700 hover:bg-pink-50 font-semibold px-6 py-3 rounded-lg">Apply to pitch</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Partner organizations */}
        <section className="py-16 sm:py-20 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-pink-600 text-sm font-semibold uppercase tracking-widest mb-3">Partner organizations</p>
            {partners.length ? (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
                {partners.map((p, i) => {
                  const inner = p.logoUrl ? <img src={p.logoUrl} alt={p.name} className="h-12 sm:h-14 w-auto max-w-[180px] object-contain" /> : <span className="text-lg font-bold text-gray-700">{p.name}</span>;
                  return /^https:\/\//i.test(p.url || '')
                    ? <a key={`${p.name}-${i}`} href={p.url} target="_blank" rel="noopener noreferrer" title={p.name}>{inner}</a>
                    : <span key={`${p.name}-${i}`} title={p.name}>{inner}</span>;
                })}
              </div>
            ) : (
              <p className="text-lg text-gray-700">Partner organizations to be announced.</p>
            )}
          </div>
        </section>

        {/* Partner with us: conference packages, and judges */}
        <section id="partner" className="py-16 sm:py-24 bg-gray-950 text-white scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-pink-400 text-sm font-semibold uppercase tracking-widest mb-3">Partner with us</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">Help our community grow</h2>
              <p className="mt-4 text-gray-300 max-w-2xl mx-auto">Conference packages for organizations, companies, investors, and incubators. Companies on a She Model Tech tier get first choice of slots.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {PARTNER_PACKAGES.map(([t, d]) => (
                <div key={t} className="rounded-2xl bg-white/5 border border-white/10 p-6">
                  <h3 className="text-lg font-bold">{t}</h3>
                  <p className="mt-2 text-sm text-gray-300 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/contact?topic=partner" className="w-full sm:w-auto text-center bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg">Talk to us about partnering</Link>
            </div>
            <div className="mt-12 rounded-2xl border border-pink-400/40 p-6 sm:p-8 grid md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold">Be a judge</h3>
                <p className="mt-2 text-sm text-gray-300 leading-relaxed">Judges score the pitch competition on clear criteria. Anyone with relevant experience can apply, and She Model Tech chooses the panel. Partners may nominate a judge, and no judge scores a founder they’re connected to.</p>
              </div>
              <div className="md:text-right">
                <Link to="/contact?topic=judge" className="inline-block bg-white text-gray-900 hover:bg-pink-50 font-semibold px-5 py-3 rounded-lg">Apply to be a judge</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Questions */}
        <section className="py-16 sm:py-20 bg-gray-50 border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-8">Questions</h2>
            <div className="space-y-3">
              {[
                ['Who can attend?', 'The conference is free for She Model Tech members. Joining is free too: create an account, and you can register once registration opens.'],
                ['When and where is it?', `${c.dateText ? `Date: ${c.dateText}.` : 'The date will be announced here soon.'} ${c.venue ? `Venue: ${c.venue}.` : 'The venue will be announced too.'}`],
                ['How do I register?', 'Registration opens once the date is confirmed. Tap “Notify me” and we’ll let you know. Then register right here on this page; it’s free for members.'],
                ['Can I be a judge or a partner?', 'Yes. Anyone with relevant experience can apply to be a judge, and organizations can choose a partner package. See “Partner with us” above.'],
                ['Do I have to pitch?', 'No. The pitch competition is for accepted founders. Everyone else can enjoy the talks, workshops, and networking, and cheer the founders on.'],
              ].map(([q, a]) => (
                <details key={q} className="group bg-white border border-gray-200 rounded-xl p-5">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold text-gray-900">
                    {q}<span className="text-pink-600 text-xl leading-none group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="bg-gray-950 text-white py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Be in the room.</h2>
            <p className="mt-4 text-gray-300 text-lg">Learn from people building in tech, meet your community, and take your next step.</p>
            <div className="mt-8">{conf ? <RegisterCta conf={c} dark /> : null}</div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Conference;
