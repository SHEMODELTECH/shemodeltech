// src/Pages/teacher/TeachApply.jsx
// "Teach on She Model Tech" (/teach): anyone can read about teaching; signed-in
// members can apply. An admin reviews applications in Admin > Teachers.

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import LearningLayout, { signInAndReturn } from '../learning/LearningLayout';
import { TEACH_TRACKS, applyToTeach, getMyTeacherApplication } from '../../utils/teachers';

// Minimum lengths for the written answers, counted in words.
const MIN_WORDS = { experience: 20, motivation: 10 };
const wordCount = (t) => (t || '').trim().split(/\s+/).filter(Boolean).length;

// Live "12 of 20 words" hint shown under a text box.
const WordHint = ({ id, text, min }) => {
  const n = wordCount(text);
  const ok = n >= min;
  return (
    <p id={id} className={`text-xs mt-1 ${ok ? 'text-green-700' : 'text-gray-500'}`} aria-live="polite">
      {ok ? `${n} words. Minimum reached.` : `Minimum ${min} words. You have ${n} so far.`}
    </p>
  );
};

const TeachApply = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState({ loading: true, profile: null, app: null });
  const [form, setForm] = useState({ name: '', tracks: [], experience: '', motivation: '', links: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setState({ loading: false, profile: null, app: null });
      return;
    }
    Promise.all([getDoc(doc(db, 'users', currentUser.uid)), getMyTeacherApplication(currentUser.uid)])
      .then(([u, app]) => {
        const profile = u.exists() ? u.data() : {};
        setState({ loading: false, profile, app });
        setForm((f) => ({ ...f, name: profile.displayName || currentUser.displayName || '' }));
      })
      .catch(() => setState({ loading: false, profile: null, app: null }));
  }, [currentUser]);

  const isStaff = ['admin', 'editor'].includes(state.profile?.role);
  const isTeacher = !!state.profile?.isTeacher || isStaff;
  const app = state.app;
  const canApply = currentUser && !isTeacher && (!app || app.status === 'declined');

  const toggleTrack = (id) =>
    setForm((f) => ({ ...f, tracks: f.tracks.includes(id) ? f.tracks.filter((t) => t !== id) : [...f.tracks, id] }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Add your name.');
    if (!form.tracks.length) return toast.error('Choose at least one track you could mentor in.');
    if (wordCount(form.experience) < MIN_WORDS.experience)
      return toast.error(`Your experience needs at least ${MIN_WORDS.experience} words (you have ${wordCount(form.experience)}).`);
    if (wordCount(form.motivation) < MIN_WORDS.motivation)
      return toast.error(`"Why do you want to mentor?" needs at least ${MIN_WORDS.motivation} words (you have ${wordCount(form.motivation)}).`);
    setSending(true);
    try {
      await applyToTeach(currentUser, form);
      setState((s) => ({ ...s, app: { status: 'pending' } }));
      toast.success('Application sent. We will let you know by notification.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      toast.error('Could not send your application. Please try again.');
    }
    setSending(false);
  };

  const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';
  const label = 'block text-sm font-semibold text-gray-800 mb-1';

  return (
    <LearningLayout>
      <section className="lr-hero" style={{ background: 'linear-gradient(180deg,#FDF2F7 0%,#fff 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <p className="text-sm font-semibold text-pink-700 mb-3">Become a mentor at She Model Tech</p>
          <h1 className="fd-display text-4xl sm:text-5xl text-gray-900 max-w-3xl">Share what you know. Help others build real skills.</h1>
          <p className="text-gray-600 text-lg mt-4 max-w-2xl">
            Mentors create lessons, video courses, and guides for our tracks, and help others grow. Approved mentors get
            access to the Mentor Hub, our space for building and presenting courses.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 items-start">
        <div>
          {state.loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
            </div>
          ) : !currentUser ? (
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">Apply to become a mentor</h2>
              <p className="text-gray-600 mt-2">Sign in or create a free account to apply.</p>
              <button onClick={() => signInAndReturn(navigate, location.pathname)}
                className="mt-4 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
                Sign in to apply
              </button>
            </div>
          ) : state.profile?.isCompany ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="text-xl font-bold text-gray-900">Mentoring is for individual members</h2>
              <p className="text-gray-700 mt-2">
                Company accounts can't apply to mentor. If someone at your organisation would like to mentor, they can
                apply from their own personal account.
              </p>
            </div>
          ) : isTeacher ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
              <h2 className="text-xl font-bold text-gray-900">You're a mentor</h2>
              <p className="text-gray-700 mt-2">You can create and present courses in the Mentor Hub.</p>
              <Link to="/teacher" className="inline-block mt-4 bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
                Open the Mentor Hub
              </Link>
            </div>
          ) : app && app.status === 'pending' ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="text-xl font-bold text-gray-900">Your application is being reviewed</h2>
              <p className="text-gray-700 mt-2">An admin will review it and you'll get a notification with the decision.</p>
            </div>
          ) : (
            <>
              {app?.status === 'declined' && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-6 text-sm text-gray-700">
                  Your last application wasn't approved{app.note ? `: ${app.note}` : '.'} You're welcome to apply again.
                </div>
              )}
              {canApply && (
                <form onSubmit={submit} className="rounded-2xl border border-gray-200 p-5 sm:p-6 space-y-5">
                  <h2 className="text-xl font-bold text-gray-900">Apply to become a mentor</h2>
                  <div>
                    <label className={label} htmlFor="ta-name">Your name</label>
                    <input id="ta-name" className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <fieldset>
                    <legend className={label}>Which tracks could you mentor in?</legend>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {TEACH_TRACKS.map(([id, l]) => (
                        <button type="button" key={id} onClick={() => toggleTrack(id)} aria-pressed={form.tracks.includes(id)}
                          className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${form.tracks.includes(id) ? 'bg-pink-600 border-pink-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <div>
                    <label className={label} htmlFor="ta-exp">Your experience <span className="font-normal text-gray-500">(at least {MIN_WORDS.experience} words)</span></label>
                    <textarea id="ta-exp" rows={4} className={input} value={form.experience}
                      placeholder="Your background in these areas, and any teaching, mentoring, or training you've done."
                      aria-describedby="ta-exp-hint"
                      onChange={(e) => setForm({ ...form, experience: e.target.value })} />
                    <WordHint id="ta-exp-hint" text={form.experience} min={MIN_WORDS.experience} />
                  </div>
                  <div>
                    <label className={label} htmlFor="ta-why">Why do you want to mentor? <span className="font-normal text-gray-500">(at least {MIN_WORDS.motivation} words)</span></label>
                    <textarea id="ta-why" rows={3} className={input} value={form.motivation}
                      aria-describedby="ta-why-hint"
                      onChange={(e) => setForm({ ...form, motivation: e.target.value })} />
                    <WordHint id="ta-why-hint" text={form.motivation} min={MIN_WORDS.motivation} />
                  </div>
                  <div>
                    <label className={label} htmlFor="ta-links">Links (optional)</label>
                    <input id="ta-links" className={input} value={form.links}
                      placeholder="LinkedIn, portfolio, a talk or video you've given"
                      onChange={(e) => setForm({ ...form, links: e.target.value })} />
                  </div>
                  <button type="submit" disabled={sending}
                    className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">
                    {sending ? 'Sending...' : 'Send application'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        <aside className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
          <p className="font-bold text-gray-900 mb-3">How it works</p>
          <ol className="space-y-3 text-sm text-gray-700 list-decimal pl-5">
            <li>Apply here. An admin reviews every application.</li>
            <li>Once approved, create courses in the Mentor Hub: written, video, or interactive.</li>
            <li>Submit a course for learners. After an admin approves it, it goes live in Learning.</li>
            <li>Earn your Mentor label and a certificate for every published course.</li>
          </ol>
          <a href="#faq" className="inline-block mt-4 text-sm font-semibold text-pink-700 hover:underline">
            Questions? See the FAQ
          </a>
        </aside>
      </div>

      {/* FAQ: benefits and how mentoring works */}
      <section id="faq" className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 scroll-mt-24 text-left" aria-labelledby="faq-h">
        <div className="max-w-3xl">
        <h2 id="faq-h" className="text-2xl font-bold text-gray-900">Frequently asked questions</h2>
        <div className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
          {MENTOR_FAQ.map(([q, a], i) => (
            <details key={q} className="group py-4" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-gray-900">
                {q}
                <svg className="w-5 h-5 flex-shrink-0 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-3 text-sm text-gray-700 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
        </div>
      </section>
    </LearningLayout>
  );
};

const MENTOR_BENEFITS = [
  ['Certificate of Recognition', 'for every course you publish, ready to download and add to LinkedIn'],
  ['Mentor label', 'on your profile and beside your name on your courses, once your first course is published'],
  ['Letters on request', 'a volunteer service letter any time. After you’ve published at least one course, you can also ask for a recommendation letter, written at She Model Tech’s discretion'],
  ['Featured on the Talent Board', 'mentors are shown with learner ratings from their courses'],
  ['Public recognition', 'your name on your courses, and new courses featured in "From our mentors" in Learning'],
  ['A teaching portfolio', 'learner ratings, comments, enrollments, and completions that show the impact of your teaching'],
  ['Grow and connect', 'teaching and leadership experience, and a network of learners and mentors'],
  ['Lead paid cohorts', 'apply to lead paid cohorts. When applicants are equally qualified, mentors are considered first'],
  ['Speaking opportunities', 'want to lead a workshop or talk at one of our online events? Message She Model Tech from the Mentor Hub, and we’ll let you know if it fits'],
  ['Tools and support', 'the Mentor Hub for written, video, and interactive courses, full-screen Present mode, and a direct line to She Model Tech'],
];

const MENTOR_FAQ = [
  [
    'What are the benefits of being a mentor?',
    <>
      <ul className="list-disc pl-5 space-y-1.5">
        {MENTOR_BENEFITS.map(([t, d]) => (
          <li key={t}>
            <strong>{t}:</strong> {d}.
          </li>
        ))}
      </ul>
      <p className="mt-3">Mentors are still members: you can join or lead any project, free or paid.</p>
    </>,
  ],
  [
    'What does a mentor do?',
    'Mentors create lessons, written guides, video courses, and interactive courses for our tracks in the Mentor Hub, present them in live sessions with full-screen Present mode, answer learners\' questions, and publish courses for learners in She Model Tech Learning.',
  ],
  [
    'Who can become a mentor?',
    'Members with experience in one of our tracks (Coding Developer, Low/No-Code, Quality Tester, Cybersecurity, Product Owner, or Non-Technical roles) who want to help others learn. Mentors apply from a personal account; company accounts can\'t apply.',
  ],
  [
    'How are applications reviewed?',
    'She Model Tech reviews every application. You\'ll get a notification and an email with the decision. If it isn\'t approved, you\'ll see any note from the team and can apply again.',
  ],
  [
    'How do I publish a course for learners?',
    'Create your course in the Mentor Hub and choose "Learners". It goes to an admin for approval; while it waits, you can keep editing it or withdraw it. Once approved, it goes live in Learning with your name on it. If it isn\'t approved, you\'ll see the admin\'s note and can edit and resubmit.',
  ],
  [
    'How do certificates and the Mentor label work?',
    'You get the Mentor label when your first course is published, and a Certificate of Recognition for every course that\'s published. Download certificates from your profile or the Mentor Hub, share their verification link, or add them to LinkedIn.',
  ],
  [
    'Can I get a recommendation or volunteer service letter?',
    'Yes. You can ask for a volunteer service letter any time, and for a recommendation letter once you\'ve published at least one course. Letters are written at She Model Tech\'s discretion. In the Mentor Hub, choose "Request a letter", say what it\'s for, and give us your draft (paste it, attach it, or email it). Our team reviews and edits it, and you can download the finished letter from the Mentor Hub.',
  ],
  [
    'How much time does mentoring take?',
    'You set the pace. Create courses when it suits you, and answer learners\' questions as they come in through messages.',
  ],
];

export default TeachApply;
