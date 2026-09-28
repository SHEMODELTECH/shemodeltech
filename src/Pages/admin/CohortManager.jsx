// src/Pages/admin/CohortManager.jsx
//
// Where you actually run cohorts. Admin or editor.
//
// The flow this screen supports:
// 1. Create a cohort -> dates are computed from the 8-week schedule
// 2. Generate 6 projects (DRAFT, hidden) -> you read the briefs
// 3. Reveal -> projects go live, lead applications open
// 4. Advance phases -> lead review, team formation, building
// 5. Watch completion -> the number you show partners
//
// Generation is deliberately a BUTTON, not a scheduled job. Auto-publishing
// six unreviewed AI-written briefs into a live cohort means one weak brief
// wastes five women's eight weeks. The convenience isn't worth that.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, doc, writeBatch, arrayUnion, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { usePermissions } from '../../utils/permissions';
import {
  createCohort,
  setCohortStatus,
  getCohortProjects,
  getCohortStats,
  buildSchedule,
  COHORT_STATUS,
  DEFAULT_PROJECTS_PER_COHORT,
  daysUntil,
  updateCohort,
  deleteCohort,
  updateCohortProject,
  deleteCohortProject,
} from '../../utils/cohorts';
import { batchGenerateProjects } from '../../utils/batchGenerateProjects';
import { logActivity as logProof } from '../../utils/activityFeed';
import { approveProposal, listProposals } from '../../utils/projectProposals';
import { declineSponsorRequest, listSponsorRequests, markSponsorPaid, markSponsorScheduled } from '../../utils/sponsorships2';

const PHASES = [
  { id: COHORT_STATUS.DRAFT, label: 'Draft', hint: 'Projects generated, hidden from members' },
  {
    id: COHORT_STATUS.LEAD_RECRUITMENT,
    label: 'Lead applications',
    hint: 'Projects visible, women applying to lead',
  },
  {
    id: COHORT_STATUS.LEAD_REVIEW,
    label: 'Interviewing',
    hint: 'Applications closed, you are interviewing',
  },
  {
    id: COHORT_STATUS.TEAM_FORMATION,
    label: 'Team formation',
    hint: 'Leads assigned, contributors applying',
  },
  { id: COHORT_STATUS.BUILDING, label: 'Building', hint: 'Teams locked, 8 weeks running' },
  { id: COHORT_STATUS.GRACE, label: 'Grace period', hint: 'Past deadline, 7 days to finish' },
  { id: COHORT_STATUS.COMPLETE, label: 'Complete', hint: 'Badges and certificates issued' },
];

const CohortManager = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { isReviewer, loading: permsLoading } = usePermissions(currentUser?.uid);

  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [openCohort, setOpenCohort] = useState(null); // cohort id whose briefs are open
  const [editingProject, setEditingProject] = useState(null);
  const [draft, setDraft] = useState({ projectTitle: '', projectDescription: '' });
  const [editingCohort, setEditingCohort] = useState(null);
  const [cohortDraft, setCohortDraft] = useState({ name: '', startDate: '' });
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [payPerPerson, setPayPerPerson] = useState(''); // USD, paid cohorts
  // Company sponsorship requests (a sponsored cohort adds the company to every workspace).
  const [sponsorReqs, setSponsorReqs] = useState([]);
  const [sponsorReqId, setSponsorReqId] = useState('');
  useEffect(() => {
    listSponsorRequests().then((l) => setSponsorReqs(l.filter((x) => ['new', 'paid'].includes(x.status)))).catch(() => {});
  }, []);
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!permsLoading && !isReviewer) navigate('/');
  }, [currentUser, permsLoading, isReviewer, navigate]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'cohorts'), orderBy('number', 'desc')));
      const rows = await Promise.all(
        snap.docs.map(async (d) => {
          const cohort = { id: d.id, ...d.data() };
          const [projects, stats] = await Promise.all([
            getCohortProjects(d.id).catch(() => []),
            getCohortStats(d.id).catch(() => null),
          ]);
          return { cohort, projects, stats };
        })
      );
      setCohorts(rows);
    } catch (e) {
      console.error(e);
      toast.error('Could not load cohorts.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isReviewer) load();
  }, [isReviewer, load]);

  const create = async () => {
    if (!startDate) {
      toast.error('Pick a start date.');
      return;
    }
    if (!endDate || endDate <= startDate) {
      toast.error('Pick an end date after the start date.');
      return;
    }
    if (isPaid && !(Number(payPerPerson) > 0)) {
      toast.error('Set the pay per person for a paid cohort.');
      return;
    }
    if (Number(count) < 1) {
      toast.error('A cohort needs at least one project.');
      return;
    }
    setBusy('create');
    try {
      const c = await createCohort({
        startDate,
        startTime,
        endDate,
        projectCount: Number(count),
        isPaid,
        payPerPerson: Number(payPerPerson) || 0,
        sponsor: (() => {
          const req = sponsorReqs.find((x) => x.id === sponsorReqId);
          return req ? { uid: req.companyUid, name: req.companyName, requestId: req.id } : null;
        })(),
        createdBy: currentUser.email,
        creator: { uid: currentUser.uid, name: currentUser.displayName || currentUser.email },
      });
      const req = sponsorReqs.find((x) => x.id === sponsorReqId);
      if (req) {
        await markSponsorScheduled(req, { id: c.id, name: `Cohort ${c.number}`, startDate }).catch(() => {});
        setSponsorReqs((xs) => xs.filter((x) => x.id !== req.id));
        setSponsorReqId('');
      }
      toast.success(`Cohort ${c.number} created. Generate its projects next.`);
      setShowNew(false);
      setStartDate('');
      await load();
    } catch (e) {
      toast.error(e.message || 'Could not create the cohort.');
    }
    setBusy(null);
  };

  // Member proposals waiting for a decision: add them to a cohort from its card.
  const [proposals, setProposals] = useState([]);
  const loadProposals = () => listProposals().then((l) => setProposals(l.filter((x) => x.status === 'new'))).catch(() => setProposals([]));
  useEffect(() => {
    loadProposals();
  }, []);
  const addProposal = async (p, cohort) => {
    if (cohort.isPaid) return toast.error('Member proposals join free cohorts.');
    setBusy(cohort.id);
    try {
      await approveProposal(p, currentUser, cohort);
      toast.success(`"${p.title}" added to ${cohort.name}. ${p.name} is its lead.`);
      await loadProposals();
      await load();
    } catch (e) {
      toast.error(e.message || 'Could not add it.');
    }
    setBusy(null);
  };

  // How many projects to generate for each cohort (you choose; at least 1).
  const [genCount, setGenCount] = useState({});
  const generate = async (cohort, n = null, existing = 0) => {
    const howMany = Math.max(1, Number(n ?? genCount[cohort.id] ?? cohort.projectCount ?? 1) || 1);
    setBusy(cohort.id);
    try {
      const res = await batchGenerateProjects(howMany, {
        cohortId: cohort.id,
        cohortNumber: cohort.number,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        startAt: cohort.startAt || null,
        isPaid: !!cohort.isPaid,
        payPerPerson: cohort.payPerPerson || 0,
        sponsor: cohort.sponsor || null,
        creator: cohort.creator || { uid: currentUser.uid, name: currentUser.displayName || currentUser.email },
        draft: true, // hidden until you have read the briefs
      });
      await updateCohort(cohort.id, { projectCount: existing + (res.created || 0) }).catch(() => {});
      toast.success(`${res.created} draft project${res.created === 1 ? '' : 's'} created. Read the briefs, then reveal.`);
      await load();
    } catch (e) {
      toast.error('Generation failed.');
    }
    setBusy(null);
  };

  /** Reveal makes every draft project visible and opens lead applications. */
  const reveal = async (cohort, projects) => {
    const drafts = projects.filter((p) => p.isActive === false);
    if (!drafts.length) {
      toast.error('Nothing to reveal, generate projects first.');
      return;
    }
    if (!window.confirm(`Make ${drafts.length} projects visible and open lead applications?`))
      return;

    setBusy(cohort.id);
    try {
      // One batch, not N writes, this is the moment members start hitting
      // the page, so it should land atomically.
      const batch = writeBatch(db);
      drafts.forEach((p) => {
        // Paid cohorts: roles and pay are fixed by She Model Tech at reveal
        // (the lead can't change them), so publish the proposed roles now.
        if (cohort.isPaid) {
          const roles = (p.proposedRoles || []).map((r) => ({ ...r, count: Number(r.count) || 1, payAmount: String(cohort.payPerPerson || 0) }));
          batch.update(doc(db, 'projects', p.id), {
            isActive: true,
            teamRoles: roles,
            maxTeamSize: roles.reduce((n, r) => n + (Number(r.count) || 1), 0),
            totalBudget: roles.reduce((n, r) => n + (Number(r.count) || 1) * (Number(cohort.payPerPerson) || 0), 0),
          });
        } else {
          batch.update(doc(db, 'projects', p.id), { isActive: true });
        }
      });
      await batch.commit();
      await setCohortStatus(cohort.id, COHORT_STATUS.LEAD_RECRUITMENT);

      // Announce each project on the Proof Wall. Generation deliberately
      // skips this for drafts (nothing should be advertised while hidden),
      // so reveal is the moment it has to happen, otherwise the "Needs a
      // lead" feed stays empty even though the projects are live.
      for (const p of drafts) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await logProof({
            type: 'lead',
            actorName: 'She Model Tech',
            projectId: p.id,
            projectTitle: p.projectTitle || p.title,
            meta: 'Open to anyone, apply to lead',
          });
        } catch (_) {
          /* non-blocking: a missing feed post must not fail the reveal */
        }
      }

      toast.success('Cohort revealed. Lead applications are open.');
      await load();
    } catch (e) {
      toast.error('Could not reveal the cohort.');
    }
    setBusy(null);
  };

  const saveProject = async (project) => {
    setBusy(project.id);
    try {
      await updateCohortProject(project.id, draft);
      toast.success('Brief updated.');
      setEditingProject(null);
      await load();
    } catch (e) {
      toast.error(e.message || 'Could not save the brief.');
    }
    setBusy(null);
  };

  const removeProject = async (project) => {
    if (
      !window.confirm(`Delete "${project.projectTitle || project.title}"? This cannot be undone.`)
    )
      return;
    setBusy(project.id);
    try {
      await deleteCohortProject(project);
      toast.success('Project deleted.');
      await load();
    } catch (e) {
      toast.error(e.message);
    }
    setBusy(null);
  };

  const saveCohort = async (cohort) => {
    if (cohortDraft.endDate && cohortDraft.startDate && cohortDraft.endDate <= cohortDraft.startDate) {
      toast.error('The end date must be after the start date.');
      return;
    }
    setBusy(cohort.id);
    try {
      await updateCohort(cohort.id, cohortDraft);
      toast.success('Cohort updated. Project deadlines moved to match.');
      setEditingCohort(null);
      await load();
    } catch (e) {
      toast.error(e.message || 'Could not update the cohort.');
    }
    setBusy(null);
  };

  const removeCohort = async (cohort) => {
    if (!window.confirm(`Delete ${cohort.name} and all its projects? This cannot be undone.`))
      return;
    setBusy(cohort.id);
    try {
      const res = await deleteCohort(cohort.id);
      toast.success(`Deleted ${cohort.name} and ${res.deletedProjects} projects.`);
      await load();
    } catch (e) {
      toast.error(e.message);
    }
    setBusy(null);
  };

  const advance = async (cohort, status) => {
    setBusy(cohort.id);
    try {
      await setCohortStatus(cohort.id, status);
      toast.success('Phase updated.');
      await load();
    } catch (e) {
      toast.error('Could not update the phase.');
    }
    setBusy(null);
  };

  if (permsLoading || loading) {
    return <div className="min-h-screen grid place-items-center text-gray-500">Loading…</div>;
  }
  if (!isReviewer) return null;

  const preview = startDate ? buildSchedule(startDate) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cohorts</h1>
          <p className="text-gray-500 text-sm">Groups of projects that start and finish together. Free or paid, one project or more.</p>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg"
        >
          {showNew ? 'Cancel' : 'New cohort'}
        </button>
      </div>

      {sponsorReqs.length > 0 && (
        <div className="mb-8 bg-white border border-pink-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-900 mb-3">Sponsorship requests</h2>
          <ul className="space-y-3">
            {sponsorReqs.map((x) => (
              <li key={x.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{x.companyName}: {x.problemTitle || 'Sponsored cohort'}</p>
                    <p className="text-xs text-gray-500">{x.projects} project{x.projects === 1 ? '' : 's'} · {x.people || '?'} people · ${x.budget || 0}{x.payPerPerson ? ` · $${x.payPerPerson}/person` : ''}{x.timeline ? ` · ${x.timeline}` : ''}</p>
                  </div>
                  {x.status === 'new' ? (
                    <div className="flex gap-2">
                      <button onClick={async () => { await markSponsorPaid(x, currentUser); setSponsorReqs((xs) => xs.map((y) => (y.id === x.id ? { ...y, status: 'paid' } : y))); toast.success('Payment confirmed. Create the cohort and choose this sponsor.'); }}
                        className="text-xs font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-lg">Payment received</button>
                      <button onClick={async () => { const note = window.prompt('Optional note for the company:') || ''; await declineSponsorRequest(x, note); setSponsorReqs((xs) => xs.filter((y) => y.id !== x.id)); }}
                        className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">Decline</button>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded-full">Paid · ready for a cohort</span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{x.focus}</p>
                {x.message && <p className="text-xs text-gray-500 mt-1">{x.message}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Create */}
      {showNew && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1" htmlFor="c-start">Starts on</label>
              <input id="c-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1" htmlFor="c-time">Start time (your time zone)</label>
              <input id="c-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1" htmlFor="c-end">Ends on (deadline)</label>
              <input id="c-end" type="date" value={endDate} min={startDate || undefined} onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1" htmlFor="c-count">Number of projects <span className="font-normal text-gray-500">(1 or more)</span></label>
              <input id="c-count" type="number" min="1" max="30" value={count} onChange={(e) => setCount(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500" />
            </div>
          </div>
          <fieldset className="mb-3">
            <legend className="block text-xs font-bold text-gray-900 mb-1">Type</legend>
            <div className="flex gap-2">
              {[[false, 'Free cohort'], [true, 'Paid cohort (paid by She Model Tech)']].map(([v, l]) => (
                <button key={l} type="button" aria-pressed={isPaid === v} onClick={() => setIsPaid(v)}
                  className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${isPaid === v ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300 text-gray-700'}`}>{l}</button>
              ))}
            </div>
          </fieldset>
          {isPaid && (
            <div className="mb-3">
              <label className="block text-xs font-bold text-gray-900 mb-1" htmlFor="c-pay">Pay per person (USD) <span className="font-normal text-gray-500">(paid by She Model Tech on completion)</span></label>
              <input id="c-pay" type="number" min="1" value={payPerPerson} onChange={(e) => setPayPerPerson(e.target.value)} placeholder="e.g. 300"
                className="w-40 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500" />
            </div>
          )}
          <div className="mb-3">
            <label className="block text-xs font-bold text-gray-900 mb-1" htmlFor="c-sponsor">Sponsor <span className="font-normal text-gray-500">(optional: a company funding this cohort)</span></label>
            <select id="c-sponsor" value={sponsorReqId} onChange={(e) => { setSponsorReqId(e.target.value); if (e.target.value) setIsPaid(true); }}
              className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-300 text-sm">
              <option value="">No sponsor</option>
              {sponsorReqs.filter((x) => x.status === 'paid').map((x) => (
                <option key={x.id} value={x.id}>{x.companyName} · {x.projects} project{x.projects === 1 ? '' : 's'}{x.payPerPerson ? ` · $${x.payPerPerson}/person` : ''}</option>
              ))}
            </select>
            {sponsorReqs.filter((x) => x.status === 'paid').length === 0 && <p className="text-[11px] text-gray-500 mt-1">Only sponsorships you’ve confirmed as paid appear here. Confirm payment in Sponsorship requests above.</p>}
            {sponsorReqId && <p className="text-[11px] text-gray-600 mt-1">The sponsor is added to every project workspace. She Model Tech pays the leads and collaborators.</p>}
          </div>
          <p className="text-gray-500 text-xs mb-3 leading-relaxed">
            Everyone in the cohort starts at the same time and finishes on the same deadline. Leads can’t change these
            dates; they can request extra time, which you approve. On a paid cohort, leads can’t change anything in the
            project (content, roles, skills, or people needed). Lead applications stay open on each project until a
            lead is assigned.
          </p>
          <button
            onClick={create}
            disabled={busy === 'create' || !startDate}
            className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 text-white font-semibold text-sm px-5 py-2.5 rounded-lg"
          >
            {busy === 'create' ? 'Creating…' : 'Create cohort'}
          </button>
        </div>
      )}

      {cohorts.length === 0 && (
        <p className="text-gray-500 text-sm">No cohorts yet. Create one to get started.</p>
      )}

      {/* Cohorts */}
      <div className="space-y-4">
        {cohorts.map(({ cohort, projects, stats }) => {
          const drafts = projects.filter((p) => p.isActive === false).length;
          const led = projects.filter((p) => p.leadConfirmed).length;
          const daysLeft = daysUntil(cohort.endDate);

          return (
            <div key={cohort.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div>
                  <h2 className="font-bold text-gray-900">{cohort.name}</h2>
                  <p className="text-gray-500 text-xs">
                    {cohort.startDate}{cohort.startAt ? ` ${new Date(cohort.startAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : ''} → {cohort.endDate}
                    {cohort.isPaid ? ` · Paid ($${cohort.payPerPerson || 0} per person)` : ' · Free'}
                    {cohort.sponsor?.name ? ` · Sponsored by ${cohort.sponsor.name}` : ''}
                    {daysLeft !== null &&
                      cohort.status === COHORT_STATUS.BUILDING &&
                      ` · ${daysLeft} days left`}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 uppercase">
                  {PHASES.find((p) => p.id === cohort.status)?.label || cohort.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-gray-100 mb-3">
                <Stat label="Projects" value={projects.length} />
                <Stat label="With a lead" value={`${led}/${projects.length}`} />
                <Stat label="Members" value={stats?.memberCount ?? ' - '} />
                <Stat
                  label="Completed"
                  value={stats ? `${stats.completed} (${stats.completionRate}%)` : ' - '}
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-2 py-1">
                  <label htmlFor={`gen-${cohort.id}`} className="text-xs font-semibold text-gray-700">
                    {projects.length === 0 ? 'Projects to create' : 'Add projects'} <span className="font-normal text-gray-500">(1 or more)</span>
                  </label>
                  <input
                    id={`gen-${cohort.id}`}
                    type="number"
                    min="1"
                    max="30"
                    value={genCount[cohort.id] ?? (projects.length === 0 ? cohort.projectCount || 1 : 1)}
                    onChange={(e) => setGenCount((g) => ({ ...g, [cohort.id]: e.target.value }))}
                    className="w-16 px-2 py-1 rounded-md border border-gray-300 text-sm"
                  />
                  <button
                    onClick={() => generate(cohort, genCount[cohort.id] ?? (projects.length === 0 ? cohort.projectCount || 1 : 1), projects.length)}
                    disabled={busy === cohort.id || Number(genCount[cohort.id] ?? 1) < 1}
                    className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 text-white text-xs font-semibold px-3 py-1.5 rounded-md"
                  >
                    {busy === cohort.id ? 'Generating…' : 'Generate'}
                  </button>
                </span>
                {drafts > 0 && (
                  <button
                    onClick={() => reveal(cohort, projects)}
                    disabled={busy === cohort.id}
                    className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-200 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                  >
                    Reveal {drafts} project{drafts === 1 ? '' : 's'}
                  </button>
                )}
                <Link
                  to="/admin/lead-applications"
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 text-xs font-semibold px-4 py-2 rounded-lg"
                >
                  Lead applications
                </Link>
                {projects.length > 0 && (
                  <button
                    onClick={() => setOpenCohort(openCohort === cohort.id ? null : cohort.id)}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 text-xs font-semibold px-4 py-2 rounded-lg"
                  >
                    {openCohort === cohort.id ? 'Hide' : 'Review'} {projects.length} brief
                    {projects.length === 1 ? '' : 's'}
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditingCohort(cohort.id);
                    setCohortDraft({ name: cohort.name, startDate: cohort.startDate, endDate: cohort.endDate, startTime: cohort.startAt ? new Date(cohort.startAt).toTimeString().slice(0, 5) : '09:00', isPaid: !!cohort.isPaid, payPerPerson: cohort.payPerPerson || '' });
                  }}
                  className="text-gray-500 hover:text-gray-800 text-xs font-semibold px-2 py-2"
                >
                  Edit cohort
                </button>
                <button
                  onClick={async () => {
                    try {
                      const me = { uid: currentUser.uid, name: currentUser.displayName || currentUser.email, label: 'She Model Tech' };
                      await Promise.all(projects.map((p) => updateDoc(doc(db, 'projects', p.id), {
                        observers: arrayUnion(me.uid),
                        observerInfo: arrayUnion(me),
                      })));
                      toast.success('You’ve been added to every project workspace in this cohort.');
                    } catch (e) {
                      toast.error('Could not add you.');
                    }
                  }}
                  className="text-gray-500 hover:text-gray-900 text-xs font-semibold px-2"
                >
                  Add me to all workspaces
                </button>
                <button
                  onClick={() => removeCohort(cohort)}
                  disabled={busy === cohort.id}
                  className="text-gray-400 hover:text-red-600 text-xs font-semibold px-2 py-2"
                >
                  Delete
                </button>
              </div>

              {/* Edit cohort dates. Moving the start date recomputes the whole
                  schedule AND pushes the new deadline onto every project, so
                  reminders and grace never fire on stale dates. */}
              {!cohort.isPaid && !['building', 'grace', 'complete'].includes(cohort.status) && proposals.length > 0 && (
                <div className="mb-3 rounded-lg border border-pink-200 bg-pink-50/50 p-3">
                  <p className="text-xs font-bold text-gray-900 mb-2">Member proposals you can add ({proposals.length})</p>
                  <ul className="space-y-2">
                    {proposals.map((p) => (
                      <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                        <span className="text-sm">
                          <span className="font-semibold text-gray-900">{p.title}</span>
                          <span className="text-gray-500"> · proposed by {p.name}</span>
                        </span>
                        <button
                          onClick={() => addProposal(p, cohort)}
                          disabled={busy === cohort.id}
                          className="text-xs font-semibold bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
                        >
                          Add to this cohort (she leads)
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-gray-500 mt-2">Added proposals count on top of the projects you generate, and take this cohort’s dates.</p>
                </div>
              )}

              {editingCohort === cohort.id && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <input
                      value={cohortDraft.name}
                      onChange={(e) => setCohortDraft((d) => ({ ...d, name: e.target.value }))}
                      className="flex-1 min-w-[10rem] px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
                    />
                    <label className="text-xs text-gray-600">Starts
                      <input type="date" value={cohortDraft.startDate}
                        onChange={(e) => setCohortDraft((d) => ({ ...d, startDate: e.target.value }))}
                        className="block px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500" />
                    </label>
                    <label className="text-xs text-gray-600">Start time
                      <input type="time" value={cohortDraft.startTime || '09:00'}
                        onChange={(e) => setCohortDraft((d) => ({ ...d, startTime: e.target.value }))}
                        className="block px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500" />
                    </label>
                    <label className="text-xs text-gray-600">Ends (deadline)
                      <input type="date" value={cohortDraft.endDate || ''} min={cohortDraft.startDate}
                        onChange={(e) => setCohortDraft((d) => ({ ...d, endDate: e.target.value }))}
                        className="block px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500" />
                    </label>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-gray-700">Type</span>
                    {[[false, 'Free'], [true, 'Paid by She Model Tech']].map(([v, l]) => (
                      <button key={l} type="button" aria-pressed={!!cohortDraft.isPaid === v} onClick={() => setCohortDraft((d) => ({ ...d, isPaid: v }))}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${!!cohortDraft.isPaid === v ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300 text-gray-700'}`}>{l}</button>
                    ))}
                    {cohortDraft.isPaid && (
                      <label className="text-xs text-gray-600 flex items-center gap-1.5">Pay per person (USD)
                        <input type="number" min="1" value={cohortDraft.payPerPerson || ''} onChange={(e) => setCohortDraft((d) => ({ ...d, payPerPerson: e.target.value }))}
                          className="w-24 px-2 py-1.5 rounded-lg border border-gray-300 text-sm" />
                      </label>
                    )}
                  </div>
                  <p className="text-gray-500 text-[11px] mb-2">
                    Free or paid can be changed until members join a project. Changing these dates moves every project in this cohort. Extra time you’ve approved for a project is
                    kept on top of the new deadline.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveCohort(cohort)}
                      disabled={busy === cohort.id}
                      className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCohort(null)}
                      className="text-gray-500 text-xs px-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Brief review: edit a weak brief before it goes live. */}
              {openCohort === cohort.id && (
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 mb-3">
                  {projects.map((pr) => (
                    <div key={pr.id} className="p-3">
                      {editingProject === pr.id ? (
                        <>
                          <input
                            value={draft.projectTitle}
                            onChange={(e) =>
                              setDraft((d) => ({ ...d, projectTitle: e.target.value }))
                            }
                            className="w-full px-3 py-2 mb-2 rounded-lg border border-gray-300 text-sm font-semibold outline-none focus:border-pink-500"
                          />
                          <textarea
                            value={draft.projectDescription}
                            onChange={(e) =>
                              setDraft((d) => ({ ...d, projectDescription: e.target.value }))
                            }
                            rows={5}
                            className="w-full px-3 py-2 mb-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500 resize-y"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveProject(pr)}
                              disabled={busy === pr.id}
                              className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                            >
                              Save brief
                            </button>
                            <button
                              onClick={() => setEditingProject(null)}
                              className="text-gray-500 text-xs px-2"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 text-sm">
                                {pr.projectTitle || pr.title}
                              </p>
                              <p className="text-gray-400 text-[11px]">
                                {pr.industryTrack}
                                {pr.isActive === false ? ' · hidden' : ' · live'}
                                {pr.leadConfirmed ? ` · led by ${pr.submitterName}` : ''}
                                {pr.members?.length ? ` · ${pr.members.length} members` : ''}
                              </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingProject(pr.id);
                                  setDraft({
                                    projectTitle: pr.projectTitle || pr.title || '',
                                    projectDescription:
                                      pr.projectDescription || pr.description || '',
                                  });
                                }}
                                className="text-pink-600 hover:underline text-xs font-semibold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeProject(pr)}
                                disabled={busy === pr.id}
                                className="text-gray-400 hover:text-red-600 text-xs font-semibold"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-600 text-xs mt-1.5 line-clamp-3">
                            {pr.projectDescription || pr.description}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {drafts > 0 && (
                <p className="text-amber-700 text-xs mb-3">
                  {drafts} project{drafts === 1 ? ' is' : 's are'} still hidden. Read the briefs
                  before revealing, a weak brief costs a team eight weeks.
                </p>
              )}

              {/* Phase control */}
              <details>
                <summary className="text-gray-500 text-xs cursor-pointer hover:text-gray-700">
                  Change phase
                </summary>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {PHASES.map((ph) => (
                    <button
                      key={ph.id}
                      onClick={() => advance(cohort, ph.id)}
                      disabled={busy === cohort.id || cohort.status === ph.id}
                      title={ph.hint}
                      className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                        cohort.status === ph.id
                          ? 'bg-purple-100 border-purple-300 text-purple-700'
                          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {ph.label}
                    </button>
                  ))}
                </div>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <p className="text-gray-400 text-[10px] uppercase tracking-wide font-bold">{label}</p>
    <p className="text-gray-900 text-sm font-semibold">{value}</p>
  </div>
);

export default CohortManager;
