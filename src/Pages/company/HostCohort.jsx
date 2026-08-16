// src/Pages/company/HostCohort.jsx
//
// Where a subscribing company sets up its own project: brief, roles, pay,
// timeline. The company owns all of it, we're the venue, not the contractor.
//
// Two gates before the form appears: the company must be VERIFIED (free,
// document-based, it's how a member can trace who she's working for) and
// hold an active Talent Access plan (the subscription is our leverage if a
// company doesn't pay its members).

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { createCompanyCohort, canHostCohort } from '../../utils/companyCohorts';
import { formatMoney } from '../../utils/paidProjects';
import { ComingSoonRibbon } from '../../components/ComingSoon';
import { usePaidFeaturesVisible } from '../../utils/permissions';

const blankRole = () => ({ title: '', count: 1, payAmount: '', skills: '' });

const HostCohort = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { visible: paidLive } = usePaidFeaturesVisible(currentUser?.uid);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [roles, setRoles] = useState([blankRole()]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    getDoc(doc(db, 'users', currentUser.uid))
      .then((snap) => setProfile(snap.exists() ? { uid: currentUser.uid, ...snap.data() } : null))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [currentUser, navigate]);

  const gate = profile ? canHostCohort(profile) : { allowed: false, reason: '' };

  const totalBudget = roles.reduce(
    (sum, r) => sum + (Number(r.payAmount) || 0) * (parseInt(r.count, 10) || 1),
    0
  );

  const setRole = (i, key, value) =>
    setRoles((rs) => rs.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));

  const submit = async () => {
    setSaving(true);
    try {
      const id = await createCompanyCohort({
        company: profile,
        title,
        description,
        startDate,
        endDate,
        roles: roles.map((r) => ({
          title: r.title.trim(),
          count: parseInt(r.count, 10) || 1,
          payAmount: Number(r.payAmount) || 0,
          skills: r.skills.trim(),
        })),
      });
      toast.success('Your project is live. Applications are open.');
      navigate(`/company-cohorts/${id}`);
    } catch (e) {
      toast.error(e.message || 'Could not create the project.');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-gray-500">Loading…</div>;
  }

  if (!gate.allowed) {
    return (
      <div className="relative max-w-xl mx-auto px-4 py-16">
        <ComingSoonRibbon />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Host your own project</h1>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">{gate.reason}</p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <p className="text-gray-900 text-sm font-bold mb-2">What hosting gives you</p>
          <ul className="text-gray-600 text-sm space-y-1.5">
            <li>Write your own brief and set your own timeline</li>
            <li>Hire every role, including the project lead</li>
            <li>Review applicants and interview whoever you like</li>
            <li>You own the work outright</li>
          </ul>
        </div>
        {paidLive ? (
          <button
            onClick={() => navigate('/partner')}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-6 py-3 rounded-lg"
          >
            See Talent Access
          </button>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="bg-gray-200 text-gray-500 font-semibold text-sm px-6 py-3 rounded-lg cursor-not-allowed"
          >
            Coming soon
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Host a project</h1>
      <p className="text-gray-600 text-sm mb-8 leading-relaxed">
        You own this one, the brief, the team, the timeline, and the work. Every applicant has
        already earned a verified badge building something real with us. Note that company projects
        don&rsquo;t award badges, since we don&rsquo;t review the work; members receive a paid
        work-experience record instead.
      </p>

      <label className="block text-sm font-bold text-gray-900 mb-1.5">Project title *</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Internal analytics dashboard"
        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-pink-500 text-sm outline-none mb-5"
      />

      <label className="block text-sm font-bold text-gray-900 mb-1.5">What needs building? *</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
        placeholder="Scope, stack, what done looks like."
        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-pink-500 text-sm outline-none resize-y mb-5"
      />

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">Start</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">
            Target completion *
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-bold text-gray-900">Roles &amp; pay *</label>
        <span className="text-gray-500 text-xs">Total budget: {formatMoney(totalBudget)}</span>
      </div>
      <p className="text-gray-500 text-xs mb-3">
        Every role must be paid. Pay is shown to applicants before they apply.
      </p>

      {roles.map((r, i) => (
        <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-2">
          <div className="flex gap-2 mb-2">
            <input
              value={r.title}
              onChange={(e) => setRole(i, 'title', e.target.value)}
              placeholder="Role, e.g. Frontend Developer"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
            />
            <input
              type="number"
              min="1"
              value={r.count}
              onChange={(e) => setRole(i, 'count', e.target.value)}
              className="w-16 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={r.payAmount}
              onChange={(e) => setRole(i, 'payAmount', e.target.value)}
              placeholder="Pay per person (USD)"
              className="w-48 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
            />
            <input
              value={r.skills}
              onChange={(e) => setRole(i, 'skills', e.target.value)}
              placeholder="Skills (optional)"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
            />
            {roles.length > 1 && (
              <button
                type="button"
                onClick={() => setRoles((rs) => rs.filter((_, idx) => idx !== i))}
                className="text-gray-400 hover:text-red-600 text-xs px-2"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRoles((rs) => [...rs, blankRole()])}
        className="text-pink-600 text-sm font-semibold hover:underline mb-8"
      >
        + Add another role
      </button>

      <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-6">
        <p className="text-gray-900 text-xs font-bold mb-1">How payment works</p>
        <p className="text-gray-600 text-xs leading-relaxed">
          You pay members directly, She Model Tech never holds the funds. When you mark the project
          complete, each member confirms she was paid. Unresolved non-payment is reviewed by our
          team and can end hosting access and your plan.
        </p>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={saving || !title.trim() || !endDate || !roles.some((r) => r.title.trim())}
        className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm px-8 py-3 rounded-lg transition-all"
      >
        {saving ? 'Creating…' : 'Publish and open applications'}
      </button>
    </div>
  );
};

export default HostCohort;
