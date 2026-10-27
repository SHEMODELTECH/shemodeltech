// src/Pages/LandingPage.jsx
import BrandLockup from '../components/BrandLockup';
import Navbar from '../components/Navbar';
import { BRAND } from '../config/brand';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COURSE_COUNT } from '../utils/foundationsCoursesMeta';

import TechMO from '../Images/TechMO.png';
import TechQA from '../Images/TechQA.png';
import TechDev from '../Images/TechDev.png';
import TechLeads from '../Images/TechLeads.png';
import TechArchs from '../Images/TechArchs.png';
import TechGuard from '../Images/TechGuard.png';
import SocialLinks from '../components/SocialLinks';
import SponsorsStrip from '../components/SponsorsStrip';
import Footer from '../components/Footer';

const LandingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    if (currentUser) navigate('/community');
  }, [currentUser, navigate]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSignIn = () => {
    // Send people to the login page, which offers BOTH Google and email/password,
    // instead of triggering Google directly.
    navigate('/login');
  };

  const isVisible = (id) => visibleSections.has(id);


  const badges = [
    {
      name: 'TechPO',
      img: TechMO,
      label: 'Product / Project Owner',
      desc: 'Own the product vision, requirements, and backlog, and steer projects to completion.',
    },
    {
      name: 'TechQA',
      img: TechQA,
      label: 'Quality Assurance',
      desc: 'Ensure code quality through systematic testing, reviews, and quality control practices.',
    },
    {
      name: 'TechDev',
      img: TechDev,
      label: 'Development',
      desc: 'Build and ship software across frontend, backend, mobile, and full-stack disciplines.',
    },
    {
      name: 'TechLeads',
      img: TechLeads,
      label: 'Non-Technical Roles',
      desc: 'Lead delivery and fill non-coding roles like management, writing, and research.',
    },
    {
      name: 'TechArchs',
      img: TechArchs,
      label: 'Low/No-Code Developer',
      desc: 'Build working products on low-code and no-code platforms.',
    },
    {
      name: 'TechGuard',
      img: TechGuard,
      label: 'Cybersecurity',
      desc: 'Protect systems, enforce security protocols, and build resilient infrastructure defenses.',
    },
  ];


  // Learning highlights for the front page.

  const steps = [
    {
      num: '01',
      title: 'Learn',
      desc: 'Sign in with Google or email, choose your track, and build the basics with free, hands-on courses.',
    },
    {
      num: '02',
      title: 'Build',
      desc: 'Join or lead a team project in a She Model Tech cohort, and ship a real product from start to finish.',
    },
    {
      num: '03',
      title: 'Prove',
      desc: 'Earn verified badges and a portfolio from real work, clear proof of what you can do.',
    },
    {
      num: '04',
      title: 'Grow',
      desc: 'Show companies your verified work on the Talent Board and explore jobs, or pitch your own idea as a founder.',
    },
  ];

  return (
    <div
      className="min-h-screen bg-white text-gray-900 overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
 @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,300&display=swap');

 .fade-up {
 opacity: 0;
 transform: translateY(32px);
 transition: opacity 0.7s ease, transform 0.7s ease;
 }
 .fade-up.visible {
 opacity: 1;
 transform: translateY(0);
 }
 .fade-up.delay-1 { transition-delay: 0.1s; }
 .fade-up.delay-2 { transition-delay: 0.2s; }
 .fade-up.delay-3 { transition-delay: 0.3s; }
 .fade-up.delay-4 { transition-delay: 0.4s; }
 .fade-up.delay-5 { transition-delay: 0.5s; }
 .fade-up.delay-6 { transition-delay: 0.6s; }
 .fade-up.delay-7 { transition-delay: 0.7s; }
 `}</style>

      {/* NAVBAR - shared site-wide component so the menu matches every page */}
      <Navbar
        cta={
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="bg-pink-600 hover:bg-pink-700 text-white text-xs lg:text-sm xl:text-base font-semibold px-3.5 lg:px-4 py-2 rounded-lg border border-pink-600 transition-all disabled:opacity-60 whitespace-nowrap"
          >
            {isLoading ? 'Signing in...' : 'Get Started'}
          </button>
        }
      />

      {/* HERO */}
      <section className="relative pt-16 sm:pt-20 pb-20 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50/60 via-white to-white" />

        {/* Decorative brand shapes.
            These are BLEED graphics: the artwork runs into its own image
            edges (the arc is cut on both left and right, the wave on right
            and bottom) because they were drawn to sit half off the page.
            Floating them in open space exposes those flat cut edges, which
            reads as a clipped or broken image.
            So the arc and wave are anchored to the viewport edges
            (left-0 / right-0), letting the cut run off-screen as designed.
            Do NOT give these an inset without trimming the source art first.
            The sparkle is a complete shape, so it can float freely.
            Hidden below sm: no room without colliding with the wordmark. */}
        <div
          className="absolute inset-0 pointer-events-none select-none hidden sm:block"
          aria-hidden="true"
        >
          <img
            src={BRAND.shapes.arcGreen}
            alt=""
            className="absolute left-0 top-[18%] w-8 lg:w-12"
          />
          <img
            src={BRAND.shapes.sparkle}
            alt=""
            className="absolute right-[12%] top-[14%] w-8 lg:w-11"
          />
          <img
            src={BRAND.shapes.wavePink}
            alt=""
            className="absolute right-0 top-[46%] w-32 lg:w-44"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div
            id="hero-title"
            data-animate
            className={`fade-up delay-1 mb-8 mt-2 flex justify-center ${isVisible('hero-title') ? 'visible' : ''}`}
          >
            <BrandLockup align="center" className="max-w-3xl w-full" />
          </div>

          <p
            id="hero-desc"
            data-animate
            className={`fade-up delay-2 text-gray-600 text-lg max-w-3xl mx-auto mb-10 font-normal leading-relaxed ${isVisible('hero-desc') ? 'visible' : ''}`}
          >
            She Model Tech helps you build a tech career through real team projects. Learn for free,
            prove your skills with verified badges, and get ready for your next step, whether that’s
            a tech role or a company of your own.
          </p>

          <div
            id="hero-cta"
            data-animate
            className={`fade-up delay-3 flex flex-col sm:flex-row items-center justify-center gap-4 ${isVisible('hero-cta') ? 'visible' : ''}`}
          >
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white font-semibold text-base px-8 py-4 rounded-lg transition-all disabled:opacity-60"
            >
              {isLoading ? 'Signing in...' : 'Join Free'}
            </button>
            <Link
              to="/learning"
              className="w-full sm:w-auto border border-gray-300 hover:border-gray-400 text-gray-700 font-medium text-base px-8 py-4 rounded-lg transition-all hover:bg-gray-50 text-center"
            >
              Explore free courses
            </Link>
          </div>
        </div>
      </section>

      {/* TECH BADGES */}
      <section className="py-20 sm:py-28 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div
            id="badges-head"
            data-animate
            className={`fade-up text-center mb-14 ${isVisible('badges-head') ? 'visible' : ''}`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-800 text-gray-900 mb-4">
              Earn Verified Credentials
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
              Each badge represents a verified skill track with four progression levels, Novice,
              Associate, Advanced, and Expert, earned by completing real-world projects.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {badges.map((b, i) => (
              <div
                key={i}
                id={`badge-${i}`}
                data-animate
                className={`fade-up delay-${i + 1} bg-white border border-gray-200 rounded-2xl p-5 text-center hover:border-pink-300 hover:shadow-sm transition-all ${isVisible(`badge-${i}`) ? 'visible' : ''}`}
              >
                <img src={b.img} alt={b.name} className="w-16 h-16 mx-auto mb-3" />
                <h3 className="text-sm font-700 text-gray-900 mb-1">{b.label}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-28 max-w-5xl mx-auto px-4 sm:px-6">
        <div
          id="how-head"
          data-animate
          className={`fade-up text-center mb-14 ${isVisible('how-head') ? 'visible' : ''}`}
        >
          <p className="text-pink-600 text-sm font-semibold uppercase tracking-widest mb-3">
            Simple Process
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-800 text-gray-900 mb-4">
            One path, from learning to your next step
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div
              key={i}
              id={`step-${i}`}
              data-animate
              className={`fade-up delay-${i + 1} relative ${isVisible(`step-${i}`) ? 'visible' : ''}`}
            >
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-10 left-full w-full h-px bg-gray-200 z-0"
                  style={{ width: 'calc(100% - 2rem)' }}
                />
              )}
              <div className="border border-gray-200 rounded-2xl p-7 h-full relative z-10 bg-white">
                <div className="text-4xl sm:text-5xl font-800 text-gray-100 mb-4">{s.num}</div>
                <h3 className="text-lg font-700 text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LEARNING */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-pink-50/60 to-white border-y border-pink-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div
            id="learn-head"
            data-animate
            className={`fade-up grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 items-end mb-12 ${isVisible('learn-head') ? 'visible' : ''}`}
          >
            <div>
              <p className="text-pink-600 text-sm font-semibold uppercase tracking-widest mb-3">She Model Tech Learning</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Learn it here. Prove it on a real project.
              </h2>
              <p className="text-gray-600 text-lg mt-5 leading-relaxed max-w-xl">
                Free, hands-on courses for every track, from your first program to AI engineering, product, security,
                and leadership. Built and taught by our team and our mentors.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                [`${COURSE_COUNT}+`, 'free courses'],
                ['6', 'tech tracks'],
                ['100%', 'free, with certificates'],
              ].map(([n, l]) => (
                <div key={l} className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
                  <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{n}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              ['Hands-on labs', 'Run Python in the page, edit live HTML, and practise with interactive activities.'],
              ['Video and interactive courses', 'Learn from videos, interactive demos, and step-by-step projects.'],
              ['Certificates', 'Earn a verifiable certificate of completion for every course you finish.'],
              ['Courses from mentors', 'Mentors create courses for our tracks, reviewed and approved by our team.'],
            ].map(([t, d]) => (
              <div key={t} className="bg-white border border-gray-200 rounded-2xl p-5">
                <h3 className="font-bold text-gray-900">{t}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-12">
            <Link to="/learning" className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white font-semibold px-8 py-4 rounded-lg text-center">
              Browse all courses
            </Link>
            <Link to="/teach" className="w-full sm:w-auto border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-8 py-4 rounded-lg text-center">
              Become a mentor
            </Link>
          </div>
        </div>
      </section>

      {/* ONE PATH, YOUR CHOICE: a tech role or a company of your own */}
      <section className="py-20 sm:py-28 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-pink-600 text-sm font-semibold uppercase tracking-widest mb-3">Your next step</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-800 text-gray-900 mb-4">One path, your choice</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">Both start the same way: real work, done in a team.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-7">
              <h3 className="text-xl font-bold text-gray-900">Pursue a tech role</h3>
              <p className="text-gray-600 mt-3 leading-relaxed">Your badges and project history show on the Talent Board, where companies can see what you’ve built.</p>
              <Link to="/talent-board" className="inline-block mt-5 text-sm font-semibold text-pink-700 hover:underline">See the Talent Board →</Link>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-7">
              <h3 className="text-xl font-bold text-gray-900">Build your own</h3>
              <p className="text-gray-600 mt-3 leading-relaxed">Have an idea? Pitch it at She Model Tech Conference for prize money, and build your team from members with verified skills. Selected founders may also pitch at our partner organizations’ events.</p>
              <Link to="/founders" className="inline-block mt-5 text-sm font-semibold text-pink-700 hover:underline">Learn about Founders →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOR COMPANIES */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div
          id="companies-head"
          data-animate
          className={`fade-up text-center mb-12 ${isVisible('companies-head') ? 'visible' : ''}`}
        >
          <p className="text-pink-600 text-sm font-semibold uppercase tracking-widest mb-3">
            For Companies
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-800 text-gray-900 mb-4">
            Hire proven talent
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
            She Model Tech is a community of women building real products in teams. Every badge comes
            from work that was actually shipped and reviewed, so you can hire on proof, not promises.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div
            id="company-0"
            data-animate
            className={`fade-up delay-1 border border-gray-200 rounded-2xl p-7 hover:border-pink-300 hover:shadow-sm transition-all ${isVisible('company-0') ? 'visible' : ''}`}
          >
            <h3 className="text-xl font-700 text-gray-900 mb-2">Find verified talent</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Browse the Talent Board, review verified badges and real project history, and reach out
              to the people whose work fits what you’re building.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL: a member's own words, and the work behind them */}
      <section className="py-16 border-y border-gray-200 bg-white">
        <div
          id="quote"
          data-animate
          className={`fade-up max-w-5xl mx-auto px-4 sm:px-6 ${isVisible('quote') ? 'visible' : ''}`}
        >
          <figure className="rounded-2xl bg-pink-50 p-6 sm:p-10">
            <span className="block text-6xl leading-none font-black text-pink-600" aria-hidden="true">&ldquo;</span>
            <blockquote className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 leading-snug max-w-3xl">
              This project was a milestone for me, as it was my{' '}
              <span className="text-pink-600">first time working alone</span> under an organization.
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold" aria-hidden="true">
                KA
              </span>
              <span>
                <span className="block text-gray-900 font-bold">Khadijat Ajayi</span>
                <span className="block text-gray-600 text-sm">Product Designer</span>
              </span>
            </figcaption>
          </figure>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-6 md:gap-10 items-center">
            <img
              src="/Images/testimonials/bank-buddy.jpg"
              alt="Bank Buddy app screens designed by Khadijat Ajayi"
              loading="lazy"
              className="w-full rounded-2xl shadow-sm"
            />
            <div>
              <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">The project</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">AI-Powered Banking Assistant</h3>
              <p className="mt-3 text-gray-600 text-lg leading-relaxed">
                She led the design end to end, from user research to hi-fi screens, for a team building a real AI
                banking assistant.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {['User research', 'User flows', 'Wireframes', 'Hi-fi screens', 'Chatbot UI'].map((t) => (
                  <li key={t} className="px-3 py-1.5 rounded-full bg-pink-50 text-pink-700 text-sm font-semibold">{t}</li>
                ))}
              </ul>
              <a
                href="https://opeyemitaiwo.github.io/AI-Powered-Banking-Assistant-Intelligent-Customer-Service-Agent/web/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-5 text-sm font-semibold text-pink-700 hover:underline"
              >
                See the project →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32">
        <div
          id="cta"
          data-animate
          className={`fade-up max-w-2xl mx-auto px-4 sm:px-6 text-center ${isVisible('cta') ? 'visible' : ''}`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-800 text-gray-900 leading-tight mb-6">
            Your career starts here.
          </h2>
          <p className="text-gray-500 text-lg mb-10 leading-relaxed">
            Build real experience, earn verified badges, and get ready for your next step: a tech
            role, or a company of your own.
          </p>
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-lg px-10 py-4 rounded-lg transition-all disabled:opacity-60 w-full sm:w-auto"
          >
            {isLoading ? 'Signing in...' : 'Join She Model Tech'}
          </button>
          <p className="mt-4 text-gray-400 text-sm">Sign in with Google or email. Takes seconds.</p>
        </div>
      </section>

      {/* FOOTER */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12"><SponsorsStrip /></div>

      <Footer />
    </div>
  );
};

export default LandingPage;
