// src/Pages/projects/SponsorCohort.jsx
// Companies: sponsor a cohort led by She Model Tech.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import LimitHint, { countWords } from '../../components/LimitHint';
import { SPONSOR_LIMITS as L, createSponsorRequest, listMySponsorRequests } from '../../utils/sponsorships2';

const EMPTY = { problemTitle: '', projects: 1, people: 4, budget: '', payPerPerson: '', focus: '', timeline: '', message: '' };
const STATUS = { new: ['Received · awaiting payment', 'bg-amber-50 text-amber-800'], paid: ['Payment received · setting up', 'bg-sky-50 text-sky-700'], scheduled: ['Cohort created', 'bg-emerald-50 text-emerald-700'], declined: ['Not scheduled', 'bg-gray-100 text-gray-600'] };

const SponsorCohort = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [mine, setMine] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid)).then((s) => setProfile({ uid: currentUser.uid, ...(s.data() || {}) })).catch(() => {});
    listMySponsorRequests(currentUser.uid).then(setMine).catch(() => {});
  }, [currentUser]);

  if (!profile) return <p className="text-gray-500 text-sm">Loading...</p>;
  if (!profile.isCompany) return <p className="text-gray-600">Sponsoring a cohort is for company accounts.</p>;

  const submit = async (e) => {
    e.preventDefault();
    if (countWords(form.problemTitle) < L.titleMinWords) return toast.error(`Give the problem a title of at least ${L.titleMinWords} words (you have ${countWords(form.problemTitle)}).`);
    if (countWords(form.focus) < L.focusMinWords) return toast.error(`The problem statement needs at least ${L.focusMinWords} words (you have ${countWords(form.focus)}).`);
    if (!(Number(form.budget) > 0)) return toast.error('Enter the total amount you plan to sponsor.');
    setBusy(true);
    try {
      await createSponsorRequest(profile, form);
      setMine(await listMySponsorRequests(currentUser.uid));
      setForm(EMPTY);
      toast.success('Thank you. Our team will be in touch to set up your cohort.');
    } catch (err) {
      toast.error('Could not send your request.');
    }
    setBusy(false);
  };

  const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';
  const label = 'block text-sm font-semibold text-gray-800 mb-1';
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sponsor a cohort</h1>
      <div className="flex gap-2 mt-3 mb-4" role="tablist" aria-label="Post a project">
        <a role="tab" aria-selected="false" href="/projects/new-paid" className="text-sm font-semibold px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">Post a paid project</a>
        <span role="tab" aria-selected="true" className="text-sm font-semibold px-4 py-2 rounded-full bg-gray-900 text-white">Sponsor a cohort</span>
      </div>
      <p className="text-gray-600 mt-2">
        Fund a cohort of real projects, led by She Model Tech. We run lead applications, leads build their teams, and
        She Model Tech pays the leads and collaborators from your sponsorship. Your company is added to every project
        workspace in the cohort, so you can follow the work and talk with the teams.
      </p>
      <ol className="mt-4 grid sm:grid-cols-4 gap-2 text-xs text-gray-700 list-none p-0">
        {['You send a request', 'You pay She Model Tech', 'We create your cohort', 'Your representative joins every workspace'].map((t, i) => (
          <li key={t} className="rounded-lg bg-pink-50 border border-pink-100 p-3"><span className="font-bold text-pink-700">{i + 1}.</span> {t}</li>
        ))}
      </ol>

      <form onSubmit={submit} className="mt-6 bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
        <div>
          <label className={label} htmlFor="sp-title">The problem you want solved <span className="font-normal text-gray-500">(at least {L.titleMinWords} words, up to {L.titleMaxChars} characters)</span></label>
          <input id="sp-title" className={input} maxLength={L.titleMaxChars} value={form.problemTitle} placeholder="For example: Appointment reminders for rural clinics"
            onChange={(e) => setForm({ ...form, problemTitle: e.target.value })} />
          <LimitHint text={form.problemTitle} minWords={L.titleMinWords} maxChars={L.titleMaxChars} />
        </div>
        <div>
          <label className={label} htmlFor="sp-focus">Problem statement <span className="font-normal text-gray-500">(at least {L.focusMinWords} words, up to {L.focusMaxChars} characters)</span></label>
          <textarea id="sp-focus" rows={5} maxLength={L.focusMaxChars} className={input} value={form.focus}
            placeholder="Who is affected, what the problem is today, and what a good solution would make possible."
            onChange={(e) => setForm({ ...form, focus: e.target.value })} />
          <LimitHint text={form.focus} minWords={L.focusMinWords} maxChars={L.focusMaxChars} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label} htmlFor="sp-n">Number of projects <span className="font-normal text-gray-500">(1 or more)</span></label>
            <input id="sp-n" type="number" min="1" max="30" className={input} value={form.projects} onChange={(e) => setForm({ ...form, projects: e.target.value })} />
          </div>
          <div>
            <label className={label} htmlFor="sp-people">Number of people to fund <span className="font-normal text-gray-500">(leads and collaborators, in total)</span></label>
            <input id="sp-people" type="number" min="1" className={input} value={form.people} onChange={(e) => setForm({ ...form, people: e.target.value })} />
          </div>
          <div>
            <label className={label} htmlFor="sp-budget">Total sponsorship (USD)</label>
            <input id="sp-budget" type="number" min="1" className={input} value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          </div>
          <div>
            <label className={label} htmlFor="sp-pay">Pay per person (USD) <span className="font-normal text-gray-500">(optional, we can advise)</span></label>
            <input id="sp-pay" type="number" min="0" className={input} value={form.payPerPerson} onChange={(e) => setForm({ ...form, payPerPerson: e.target.value })} />
          </div>
        </div>
        <div>
          <label className={label} htmlFor="sp-time">Preferred timing <span className="font-normal text-gray-500">(optional)</span></label>
          <input id="sp-time" className={input} value={form.timeline} placeholder="For example: starting in February" onChange={(e) => setForm({ ...form, timeline: e.target.value })} />
        </div>
        <div>
          <label className={label} htmlFor="sp-msg">Anything else? <span className="font-normal text-gray-500">(optional, up to {L.messageMaxChars} characters)</span></label>
          <textarea id="sp-msg" rows={3} maxLength={L.messageMaxChars} className={input} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <button type="submit" disabled={busy} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">
          {busy ? 'Sending...' : 'Send sponsorship request'}
        </button>
      </form>

      {mine.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Your sponsorship requests</h2>
          <ul className="space-y-2">
            {mine.map((r) => {
              const st = STATUS[r.status] || STATUS.new;
              return (
                <li key={r.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm text-gray-800">{r.problemTitle || r.focus.slice(0, 60)} · {r.projects} project{r.projects === 1 ? '' : 's'}{r.budget ? ` · $${r.budget}` : ''}{r.cohortName ? ` · ${r.cohortName}` : ''}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${st[1]}`}>{st[0]}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <p className="text-sm text-gray-500 mt-6">Prefer to hire directly? <Link to="/projects/new-paid" className="text-pink-700 font-semibold hover:underline">Post a paid project</Link> instead.</p>
    </div>
  );
};

export default SponsorCohort;
