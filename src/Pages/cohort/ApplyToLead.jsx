// src/Pages/cohort/ApplyToLead.jsx
//
// Where a member applies to lead a cohort project, ranking up to 3 choices.
//
// Ranking exists because there are ~6 projects and usually many more
// applicants. Without it, everyone who doesn't win their one project gets
// nothing — and the person confident enough to apply to lead is exactly who
// you want on a team. Ranking turns "rejected" into "offered her second choice".

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  applyToLead, getMyApplication, withdrawApplication,
  MAX_RANKED_CHOICES, LEAD_APP_STATUS,
} from '../../utils/leadApplications';
import { getFormingCohort } from '../../utils/cohorts';

const ApplyToLead = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const preselect = params.get('project');

  const [cohort, setCohort] = useState(null);
  const [projects, setProjects] = useState([]);
  const [ranked, setRanked] = useState(preselect ? [preselect] : []);
  const [pitch, setPitch] = useState('');
  const [experience, setExperience] = useState('');
  const [hours, setHours] = useState('');
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return; }
    let cancelled = false;

    (async () => {
      try {
        const c = await getFormingCohort();
        if (cancelled) return;
        setCohort(c);
        if (!c) { setLoading(false); return; }

        // One query for the whole cohort's projects — no per-project reads.
        const snap = await getDocs(query(
          collection(db, 'projects'),
          where('cohortId', '==', c.id),
          where('leadConfirmed', '==', false),
        ));
        if (cancelled) return;
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));

        const mine = await getMyApplication(c.id, currentUser.uid);
        if (!cancelled) setExisting(mine);
      } catch (e) {
        console.error(e);
        if (!cancelled) toast.error('Could not load the current cohort.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [currentUser, navigate]);

  const toggle = (id) => {
    setRanked(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id);
      if (prev.length >= MAX_RANKED_CHOICES) {
        toast.info(`You can rank up to ${MAX_RANKED_CHOICES} projects.`);
        return prev;
      }
      return [...prev, id];
    });
  };

  const rankOf = (id) => {
    const i = ranked.indexOf(id);
    return i === -1 ? null : i + 1;
  };

  const canSubmit = useMemo(
    () => ranked.length > 0 && pitch.trim().length >= 40 && !saving,
    [ranked, pitch, saving]
  );

  const submit = async () => {
    setSaving(true);
    try {
      await applyToLead({
        cohortId: cohort.id,
        applicant: {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        rankedProjectIds: ranked,
        pitch,
        experience,
        availabilityHours: hours ? Number(hours) : null,
      });
      toast.success('Application submitted. We\u2019ll be in touch to arrange a short chat.');
      navigate('/cohort');
    } catch (e) {
      toast.error(e.message || 'Could not submit your application.');
    }
    setSaving(false);
  };

  const withdraw = async () => {
    if (!window.confirm('Withdraw your lead application for this cohort?')) return;
    try {
      await withdrawApplication(existing.id);
      setExisting(null);
      toast.success('Application withdrawn.');
    } catch (e) {
      toast.error('Could not withdraw. Please try again.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading…</div>;
  }

  if (!cohort) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No cohort is open right now</h1>
        <p className="text-gray-600 mb-6">
          Lead applications open about two weeks into each cycle. Join the waitlist
          and we&rsquo;ll email you the moment the next set of projects goes live.
        </p>
        <Link to="/cohort" className="text-pink-600 font-semibold hover:underline">
          See the current cohort
        </Link>
      </div>
    );
  }

  if (existing && existing.status !== LEAD_APP_STATUS.WITHDRAWN) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Your application is in for {cohort.name}
        </h1>
        <p className="text-gray-600 mb-6">
          {existing.status === LEAD_APP_STATUS.INTERVIEW_SCHEDULED
            ? 'Your interview is scheduled — check your email for the link.'
            : 'We review applications and arrange a short chat before assigning leads. You\u2019ll hear from us by email.'}
        </p>
        <button onClick={withdraw} className="text-gray-500 text-sm underline hover:text-gray-700">
          Withdraw my application
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        Apply to lead &mdash; {cohort.name}
      </h1>
      <p className="text-gray-600 text-sm mb-8 leading-relaxed">
        Leading is a skill-building path in itself &mdash; you don&rsquo;t need badges
        or prior experience to apply. We&rsquo;ll have a short chat before assigning
        leads, because a team is depending on whoever takes this on.
      </p>

      {/* Ranked choices */}
      <h2 className="text-gray-900 font-bold mb-1">
        Rank your choices <span className="text-pink-600">*</span>
      </h2>
      <p className="text-gray-500 text-xs mb-4">
        Pick up to {MAX_RANKED_CHOICES}, in order. If someone else leads your first
        choice, we&rsquo;ll look at your second and third rather than turning you away.
      </p>

      <div className="space-y-2 mb-8">
        {projects.length === 0 && (
          <p className="text-gray-500 text-sm">No projects are open for leads right now.</p>
        )}
        {projects.map(p => {
          const rank = rankOf(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                rank ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`shrink-0 w-7 h-7 rounded-full grid place-items-center text-xs font-bold ${
                  rank ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {rank || '—'}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">
                    {p.projectTitle || p.title}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">
                    {p.projectDescription || p.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pitch */}
      <label className="block text-gray-900 font-bold mb-1">
        Why do you want to lead? <span className="text-pink-600">*</span>
      </label>
      <p className="text-gray-500 text-xs mb-2">
        A couple of sentences is plenty. What draws you to these projects, and how
        you&rsquo;d keep a team moving.
      </p>
      <textarea
        value={pitch}
        onChange={e => setPitch(e.target.value)}
        rows={5}
        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-pink-500 text-sm outline-none resize-y mb-1"
      />
      <p className={`text-xs mb-6 ${pitch.trim().length >= 40 ? 'text-gray-400' : 'text-gray-500'}`}>
        {pitch.trim().length}/40 characters minimum
      </p>

      <label className="block text-gray-900 font-bold mb-1">
        Relevant experience <span className="text-gray-400 font-normal text-sm">(optional)</span>
      </label>
      <textarea
        value={experience}
        onChange={e => setExperience(e.target.value)}
        rows={3}
        placeholder="Anything you've built, studied, organised, or led — it doesn't have to be technical."
        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-pink-500 text-sm outline-none resize-y mb-6"
      />

      <label className="block text-gray-900 font-bold mb-1">
        Hours per week you can give <span className="text-gray-400 font-normal text-sm">(optional)</span>
      </label>
      <input
        type="number" min="1" max="40" value={hours}
        onChange={e => setHours(e.target.value)}
        placeholder="e.g. 6"
        className="w-32 px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-pink-500 text-sm outline-none mb-8"
      />

      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit}
        className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm px-8 py-3 rounded-lg transition-all"
      >
        {saving ? 'Submitting…' : 'Submit application'}
      </button>
    </div>
  );
};

export default ApplyToLead;
