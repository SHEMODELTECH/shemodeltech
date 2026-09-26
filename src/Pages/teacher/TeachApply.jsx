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
    <p id={id} className={`text-xs mt-1 ${ok ? 'text-emerald-700' : 'text-gray-500'}`} aria-live="polite">
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
    if (!form.tracks.length) return toast.error('Choose at least one track you would teach.');
    if (wordCount(form.experience) < MIN_WORDS.experience)
      return toast.error(`Your experience needs at least ${MIN_WORDS.experience} words (you have ${wordCount(form.experience)}).`);
    if (wordCount(form.motivation) < MIN_WORDS.motivation)
      return toast.error(`"Why do you want to teach?" needs at least ${MIN_WORDS.motivation} words (you have ${wordCount(form.motivation)}).`);
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
      <section className="lr-hero" style={{ background: 'linear-gradient(180deg,#FDF2F8 0%,#fff 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <p className="text-sm font-semibold text-pink-700 mb-3">Teach on She Model Tech</p>
          <h1 className="fd-display text-4xl sm:text-5xl text-gray-900 max-w-3xl">Share what you know. Help others build real skills.</h1>
          <p className="text-gray-600 text-lg mt-4 max-w-2xl">
            Teachers create and run lessons, video courses, and teaching guides for our tracks. Approved teachers get
            access to Teacher, our space for building and presenting teaching materials.
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
              <h2 className="text-xl font-bold text-gray-900">Apply to teach</h2>
              <p className="text-gray-600 mt-2">Sign in or create a free account to apply.</p>
              <button onClick={() => signInAndReturn(navigate, location.pathname)}
                className="mt-4 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
                Sign in to apply
              </button>
            </div>
          ) : isTeacher ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <h2 className="text-xl font-bold text-gray-900">You're a teacher</h2>
              <p className="text-gray-700 mt-2">You can create and present teaching materials in Teacher.</p>
              <Link to="/teacher" className="inline-block mt-4 bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
                Open Teacher
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
                  <h2 className="text-xl font-bold text-gray-900">Apply to teach</h2>
                  <div>
                    <label className={label} htmlFor="ta-name">Your name</label>
                    <input id="ta-name" className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <fieldset>
                    <legend className={label}>Which tracks could you teach?</legend>
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
                    <label className={label} htmlFor="ta-why">Why do you want to teach? <span className="font-normal text-gray-500">(at least {MIN_WORDS.motivation} words)</span></label>
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
          <p className="font-bold text-gray-900 mb-3">What teachers do</p>
          <ul className="space-y-3 text-sm text-gray-700">
            <li>Create lessons, written guides, and video courses in Teacher.</li>
            <li>Present them full screen in class or live sessions.</li>
            <li>Propose courses for students; our editors review them before they go live in Learning.</li>
          </ul>
          <p className="text-xs text-gray-500 mt-4">Every application is reviewed by a She Model Tech admin.</p>
        </aside>
      </div>
    </LearningLayout>
  );
};

export default TeachApply;
