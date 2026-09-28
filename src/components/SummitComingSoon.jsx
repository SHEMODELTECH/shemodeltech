// src/components/SummitComingSoon.jsx
// She Model Tech Summit 2027: "Human in the Loop". A live, podcast-style day.
// Shown on /summit until a summit with full details is published in Admin.
// Location and registration are still to be announced.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SUMMIT = {
  year: 2027,
  theme: 'Human in the Loop',
  subtitle: 'Women Shaping Tech in the Age of AI',
  date: '2027-03-20', // Saturday, Women's History Month
  dateLabel: 'March 20, 2027',
  dayLabel: 'Saturday · Women’s History Month',
  email: 'shemodeltech@gmail.com',
};

const EPISODES = [
  ['Will AI take my job?', 'How AI is reshaping entry-level roles, which skills still matter, and how to build a career that grows with the tools.'],
  ['Can we trust what we see?', 'Deepfakes, misinformation, and AI that gets things wrong. What it takes to build technology people can rely on.'],
  ['Who’s building the future?', 'Why the people behind AI should reflect the people it affects, and how women are getting into the rooms where it’s decided.'],
  ['Building without permission', 'Founders, creators, and self-taught builders on starting before you feel ready.'],
];

// Countdown to the summit (midnight local time on the day).
const useCountdown = (iso) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(t);
  }, []);
  const ms = Math.max(0, new Date(`${iso}T00:00:00`).getTime() - now);
  const days = Math.floor(ms / 86400000);
  return { days, weeks: Math.floor(days / 7), months: Math.floor(days / 30.44) };
};

// "Add to calendar": an all-day event file that works with Google, Apple, and Outlook.
const downloadIcs = () => {
  const d = SUMMIT.date.replace(/-/g, '');
  const next = new Date(`${SUMMIT.date}T12:00:00`);
  next.setDate(next.getDate() + 1);
  const d2 = next.toISOString().slice(0, 10).replace(/-/g, '');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//She Model Tech//Summit//EN',
    'BEGIN:VEVENT',
    `UID:smt-summit-${SUMMIT.year}@shemodeltech.com`,
    `DTSTART;VALUE=DATE:${d}`,
    `DTEND;VALUE=DATE:${d2}`,
    `SUMMARY:She Model Tech Summit ${SUMMIT.year}: ${SUMMIT.theme}`,
    'DESCRIPTION:A live\\, podcast-style day of honest conversations with women building\\, researching\\, and leading in tech. Details: https://shemodeltech.com/summit',
    'URL:https://shemodeltech.com/summit',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `she-model-tech-summit-${SUMMIT.year}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const Mic = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const SummitComingSoon = ({ signedIn }) => {
  const { days, weeks, months } = useCountdown(SUMMIT.date);

  return (
    <div className="bg-[#EBEBEC] text-gray-700">
      <style>{`
        @keyframes smtPulse { 0% { box-shadow: 0 0 0 0 rgba(232,49,122,.7);} 70% { box-shadow: 0 0 0 10px rgba(232,49,122,0);} 100% { box-shadow: 0 0 0 0 rgba(232,49,122,0);} }
        @keyframes smtWave { 0%,100% { transform: scaleY(.35);} 50% { transform: scaleY(1);} }
        @media (prefers-reduced-motion: reduce) { .smt-anim { animation: none !important; } }
      `}</style>

      {/* ===== Hero: the on-air studio ===== */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background:
            'radial-gradient(900px 420px at 85% 10%, rgba(232,49,122,0.55), transparent 60%), radial-gradient(700px 400px at 5% 100%, rgba(200,23,93,0.75), transparent 70%), #4F0826',
        }}
      >
        <div className="max-w-[1080px] mx-auto px-6 pt-16 pb-14 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/25 bg-white/5 text-sm font-semibold">
              <span className="smt-anim w-2.5 h-2.5 rounded-full bg-[#FFB3CF]" style={{ animation: 'smtPulse 2s infinite' }} aria-hidden="true" />
              Live podcast summit
            </span>
            <p className="mt-6 mb-1.5 text-lg font-semibold text-[#FFB3CF]">She Model Tech Summit {SUMMIT.year}</p>
            <h1 className="m-0 font-black leading-[0.95] tracking-[-0.045em]" style={{ fontSize: 'clamp(46px, 7.4vw, 88px)' }}>
              Human in
              <span className="block text-[#FFB3CF]">the Loop</span>
            </h1>
            <p className="mt-5 font-semibold leading-snug max-w-[28ch]" style={{ fontSize: 'clamp(19px, 2.2vw, 23px)' }}>{SUMMIT.subtitle}</p>
            <p className="mt-4 text-[17px] text-[#F7D6E3] max-w-[50ch]">
              No panels, no podiums. A day of honest, unscripted conversations with women building, researching, and
              leading in tech. Free for every She Model Tech member.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <button onClick={downloadIcs} className="inline-flex items-center gap-2.5 font-bold text-base px-6 py-3.5 rounded-xl bg-white text-[#C8175D] hover:bg-[#F4E4EA]">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Add to calendar
              </button>
              <a href="#episodes" className="inline-flex items-center gap-2.5 font-bold text-base px-6 py-3.5 rounded-xl border border-white/35 text-white hover:bg-white/10 hover:no-underline">
                <Mic className="w-[18px] h-[18px]" /> See the episodes
              </a>
            </div>
          </div>

          {/* Ticket */}
          <div className="bg-white text-gray-900 rounded-[18px] overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)] lg:rotate-2">
            <div className="bg-[#C8175D] text-white px-6 py-5">
              <p className="text-[13px] font-semibold opacity-85 m-0">Save the date</p>
              <p className="text-[34px] font-black tracking-[-0.03em] leading-tight mt-1 mb-0">{SUMMIT.dateLabel}</p>
              <p className="text-base font-semibold mt-1 mb-0">{SUMMIT.dayLabel}</p>
            </div>
            <div className="mx-4 border-t-2 border-dashed border-gray-300" />
            <div className="px-6 py-5">
              <div className="grid grid-cols-3 gap-2 text-center" aria-label="Countdown">
                {[[days, 'days'], [weeks, 'weeks'], [months, 'months']].map(([n, l]) => (
                  <div key={l} className="rounded-xl bg-[#F4E4EA] py-3">
                    <p className="text-2xl font-black text-[#C8175D] m-0">{n}</p>
                    <p className="text-xs font-semibold text-gray-600 m-0">{l}</p>
                  </div>
                ))}
              </div>
              <dl className="mt-5 space-y-2.5 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-gray-500">Format</dt><dd className="font-semibold m-0">Live, podcast-style episodes</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-gray-500">Location</dt><dd className="font-semibold m-0">To be announced</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-gray-500">Registration</dt><dd className="font-semibold m-0">Opens soon</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-gray-500">Price</dt><dd className="font-semibold m-0 text-emerald-700">Free for members</dd></div>
              </dl>
            </div>
          </div>
        </div>

        {/* Sound wave */}
        <div className="max-w-[1080px] mx-auto px-6 pb-8 opacity-60" aria-hidden="true">
         <div className="flex items-end justify-between h-12">
          {Array.from({ length: 64 }).map((_, i) => (
            <span
              key={i}
              className="smt-anim w-1 bg-[#FFB3CF] rounded-full origin-bottom"
              style={{ height: `${30 + ((i * 37) % 70)}%`, animation: `smtWave ${1.2 + (i % 5) * 0.2}s ease-in-out ${(i % 7) * 0.1}s infinite` }}
            />
          ))}
         </div>
        </div>
      </section>

      {/* ===== Why this theme ===== */}
      <section className="max-w-[1080px] mx-auto px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C8175D]">Why this theme</p>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-2 max-w-[22ch]">AI is moving faster than trust.</h2>
        <p className="mt-4 text-lg max-w-[62ch]">
          “Human in the loop” means keeping people in control of automated systems. We think it also means making sure
          women are in the rooms where AI gets built and decided.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div className="rounded-2xl bg-[#F5F5F6] border border-[#D6D6DA] p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#33379E]">The problem</p>
            <h3 className="text-xl font-bold text-gray-900 mt-2">Tech is changing who gets a seat</h3>
            <p className="mt-2">Entry-level roles are shifting, deepfakes blur what’s real, and the people building AI still don’t reflect the people it affects.</p>
          </div>
          <div className="rounded-2xl bg-[#F4E4EA] border border-[#EDB9CB] p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C8175D]">The conversation</p>
            <h3 className="text-xl font-bold text-gray-900 mt-2">We’re talking about it, out loud</h3>
            <p className="mt-2">Real stories from women in the field: what worries them, what gives them hope, and what you can do next.</p>
          </div>
        </div>
      </section>

      {/* ===== Episodes ===== */}
      <section id="episodes" className="scroll-mt-24" style={{ background: 'linear-gradient(180deg, #1B1E5E, #121440)' }}>
        <div className="max-w-[1080px] mx-auto px-6 py-16 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FFB3CF]">The lineup</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">Four episodes. One honest day.</h2>
          <p className="mt-3 text-[#E3E6F3] max-w-[60ch]">Each session is a live episode with a host, a few guests, and time for your questions.</p>
          <ol className="grid md:grid-cols-2 gap-4 mt-8 list-none p-0">
            {EPISODES.map(([title, desc], i) => (
              <li key={title} className="rounded-2xl bg-white/[0.06] border border-white/15 p-6 hover:border-[#FFB3CF]/60 transition">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-full bg-[#E8317A] flex items-center justify-center text-white" aria-hidden="true">
                    <Mic />
                  </span>
                  <p className="text-sm font-bold text-[#FFB3CF] m-0">Episode {i + 1}</p>
                </div>
                <h3 className="text-xl font-bold mt-4">{title}</h3>
                <p className="mt-2 text-[#E3E6F3]">{desc}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[#AEB7E6]">Guests coming soon</p>
              </li>
            ))}
          </ol>
          <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm text-[#E3E6F3]">
            <p className="m-0"><strong className="text-white">Live call-ins in every episode.</strong> Ask the guests your questions from the audience.</p>
            <p className="m-0"><strong className="text-white">Every episode is recorded</strong> and released afterward, so the conversation keeps going.</p>
          </div>
        </div>
      </section>

      {/* ===== Workshops ===== */}
      <section className="max-w-[1080px] mx-auto px-6 py-16">
        <div className="rounded-3xl bg-white border border-[#D6D6DA] p-8 sm:p-10 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C8175D]">Between episodes</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-2">Hands-on workshop sessions</h2>
            <p className="mt-3 max-w-[60ch]">Put the conversation into practice. Join guided workshops across our tech tracks and build something alongside a facilitator.</p>
            <p className="mt-2 text-sm text-gray-500">Workshop topics and facilitators will be announced soon.</p>
          </div>
          <Link to="/learning" className="inline-flex items-center justify-center font-bold px-6 py-3.5 rounded-xl bg-[#C8175D] text-white hover:bg-[#E8317A] hover:no-underline">
            Start learning now
          </Link>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="max-w-[1080px] mx-auto px-6 pb-16">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">How the day works</h2>
        <p className="mt-2 text-gray-600">The location and registration details will be announced here and on your dashboard.</p>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {[
            ['Tune in', 'Join the live episodes and workshops. Joining details come with registration.'],
            ['Call in', 'Send your questions during each episode. The best ones go to the guests live.'],
            ['Catch the replay', 'Every episode is recorded and released afterward, so you can listen again or share it.'],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl bg-[#F5F5F6] border border-[#D6D6DA] p-6">
              <p className="font-bold text-gray-900">{t}</p>
              <p className="mt-1.5 text-sm">{d}</p>
            </div>
          ))}
        </div>
        {!signedIn && (
          <div className="mt-8 rounded-2xl bg-[#F4E4EA] border border-[#EDB9CB] p-6 flex flex-wrap items-center justify-between gap-4">
            <p className="m-0 font-semibold text-gray-900">Create a free account to hear first when registration opens.</p>
            <Link to="/login" className="font-bold px-5 py-3 rounded-xl bg-[#C8175D] text-white hover:bg-[#E8317A] hover:no-underline">Create a free account</Link>
          </div>
        )}
      </section>

      {/* ===== Be part of the show ===== */}
      <section className="text-white" style={{ background: 'radial-gradient(700px 300px at 90% 0%, rgba(232,49,122,0.5), transparent 60%), #4F0826' }}>
        <div className="max-w-[1080px] mx-auto px-6 py-14 grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Be part of the show.</h2>
            <p className="mt-3 text-[#F7D6E3] max-w-[50ch]">Sponsor the summit, lead a workshop, or join an episode as a guest. We’d love to hear from you.</p>
            <a
              href={`mailto:${SUMMIT.email}?subject=${encodeURIComponent(`She Model Tech Summit ${SUMMIT.year}`)}`}
              className="inline-flex mt-6 font-bold px-6 py-3.5 rounded-xl bg-white text-[#C8175D] hover:bg-[#F4E4EA] hover:no-underline"
            >
              Email the team
            </a>
          </div>
          <ul className="grid gap-3 list-none p-0 m-0">
            {['Sponsorship packages', 'Workshop facilitators', 'Episode guests'].map((x) => (
              <li key={x} className="rounded-xl border border-white/20 bg-white/5 px-5 py-4 font-semibold">{x}</li>
            ))}
          </ul>
        </div>
        <p className="max-w-[1080px] mx-auto px-6 pb-10 m-0 text-sm text-[#F7D6E3]">
          Questions? Reach us at <a href={`mailto:${SUMMIT.email}`} className="text-white underline">{SUMMIT.email}</a>.
        </p>
      </section>
    </div>
  );
};

export default SummitComingSoon;
