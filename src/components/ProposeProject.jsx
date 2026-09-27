// src/components/ProposeProject.jsx
// "Propose your own project": a member suggests a project she'd like to lead.
// Staff review it; on approval it becomes an open project with her lead application.
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import LimitHint, { countWords } from './LimitHint';
import { PROPOSAL_LIMITS as L, TRACKS, listMyProposals, proposeProject } from '../utils/projectProposals';

const EMPTY = { title: '', description: '', track: 'TechDev', rolesNeeded: '', whyLead: '' };

const ProposeProject = ({ startOpen = false }) => {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(startOpen);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [mine, setMine] = useState([]);
  useEffect(() => {
    if (currentUser) listMyProposals(currentUser.uid).then(setMine).catch(() => {});
  }, [currentUser]);

  const submit = async (e) => {
    e.preventDefault();
    if (countWords(form.title) < L.titleMinWords) return toast.error(`The title needs at least ${L.titleMinWords} words (you have ${countWords(form.title)}).`);
    if (countWords(form.description) < L.descMinWords) return toast.error(`The description needs at least ${L.descMinWords} words (you have ${countWords(form.description)}).`);
    if (countWords(form.whyLead) < L.whyMinWords) return toast.error(`"Why you want to lead it" needs at least ${L.whyMinWords} words (you have ${countWords(form.whyLead)}).`);
    setBusy(true);
    try {
      await proposeProject(currentUser, form);
      setMine(await listMyProposals(currentUser.uid));
      setForm(EMPTY);
      setOpen(false);
      toast.success('Thank you. Our team will review your project idea and get back to you.');
    } catch (err) {
      toast.error('Could not send your proposal. Please try again.');
    }
    setBusy(false);
  };

  const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';
  const label = 'block text-sm font-semibold text-gray-800 mb-1';
  const hint = 'font-normal text-gray-500';
  const statusTag = { new: ['Under review', 'bg-amber-50 text-amber-800'], approved: ['Approved', 'bg-emerald-50 text-emerald-700'], declined: ['Not taken forward', 'bg-gray-100 text-gray-600'] };

  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-5 text-left">
      <p className="font-bold text-gray-900 text-lg">Have your own project idea? Propose it</p>
      <p className="text-sm text-gray-600 mt-1">
        Suggest a project you’d like to lead. Our team reviews every idea. If it’s approved, you become its lead, and it
        joins the next She Model Tech cohort that hasn’t started yet, with the same start date and deadline.
      </p>
      {!open ? (
        <button onClick={() => setOpen(true)} className="mt-4 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
          Propose a project
        </button>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <label className={label} htmlFor="pp-title">Project title <span className={hint}>(at least {L.titleMinWords} words, up to {L.titleMaxChars} characters)</span></label>
            <input id="pp-title" className={input} maxLength={L.titleMaxChars} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <LimitHint text={form.title} minWords={L.titleMinWords} maxChars={L.titleMaxChars} />
          </div>
          <div>
            <label className={label} htmlFor="pp-track">Main track</label>
            <select id="pp-track" className={input} value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value })}>
              {Object.entries(TRACKS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="pp-desc">What the project is and who it helps <span className={hint}>(at least {L.descMinWords} words, up to {L.descMaxChars} characters)</span></label>
            <textarea id="pp-desc" rows={6} className={input} maxLength={L.descMaxChars} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <LimitHint text={form.description} minWords={L.descMinWords} maxChars={L.descMaxChars} />
          </div>
          <div>
            <label className={label} htmlFor="pp-roles">Team roles you’ll need <span className={hint}>(optional, one per line, up to {L.rolesMaxChars} characters)</span></label>
            <textarea id="pp-roles" rows={3} className={input} maxLength={L.rolesMaxChars} value={form.rolesNeeded} placeholder={'Frontend Developer\nQuality Tester\nProduct Owner'}
              onChange={(e) => setForm({ ...form, rolesNeeded: e.target.value })} />
          </div>
          <div>
            <label className={label} htmlFor="pp-why">Why you want to lead it <span className={hint}>(at least {L.whyMinWords} words, up to {L.whyMaxChars} characters)</span></label>
            <textarea id="pp-why" rows={4} className={input} maxLength={L.whyMaxChars} value={form.whyLead} onChange={(e) => setForm({ ...form, whyLead: e.target.value })} />
            <LimitHint text={form.whyLead} minWords={L.whyMinWords} maxChars={L.whyMaxChars} />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={busy} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">
              {busy ? 'Sending...' : 'Send my proposal'}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-sm font-semibold text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100">Cancel</button>
          </div>
        </form>
      )}
      {mine.length > 0 && (
        <ul className="mt-5 space-y-2">
          {mine.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <span className="font-semibold text-gray-900">{p.title}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${(statusTag[p.status] || statusTag.new)[1]}`}>{(statusTag[p.status] || statusTag.new)[0]}</span>
              {p.status === 'declined' && p.note && <span className="w-full text-xs text-gray-600">Note: {p.note}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProposeProject;
