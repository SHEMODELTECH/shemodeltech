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
import { collection, getDocs, query, orderBy, doc, writeBatch } from 'firebase/firestore';
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
  const [count, setCount] = useState(DEFAULT_PROJECTS_PER_COHORT);

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
    setBusy('create');
    try {
      const c = await createCohort({
        startDate,
        projectCount: Number(count),
        createdBy: currentUser.email,
      });
      toast.success(`Cohort ${c.number} created. Generate its projects next.`);
      setShowNew(false);
      setStartDate('');
      await load();
    } catch (e) {
      toast.error(e.message || 'Could not create the cohort.');
    }
    setBusy(null);
  };

  const generate = async (cohort) => {
    setBusy(cohort.id);
    try {
      const res = await batchGenerateProjects(cohort.projectCount || DEFAULT_PROJECTS_PER_COHORT, {
        cohortId: cohort.id,
        cohortNumber: cohort.number,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        draft: true, // hidden until you have read the briefs
      });
      toast.success(`${res.created} draft projects created. Read the briefs, then reveal.`);
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
      drafts.forEach((p) => batch.update(doc(db, 'projects', p.id), { isActive: true }));
      await batch.commit();
      await setCohortStatus(cohort.id, COHORT_STATUS.LEAD_RECRUITMENT);
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
          <p className="text-gray-500 text-sm">8-week cycles, back to back.</p>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg"
        >
          {showNew ? 'Cancel' : 'New cohort'}
        </button>
      </div>

      {/* Create */}
      {showNew && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
          <div className="flex flex-wrap gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1">Build starts</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1">Projects</label>
              <input
                type="number"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="w-20 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
              />
            </div>
          </div>
          <p className="text-gray-500 text-xs mb-3 leading-relaxed">
            Six is the default on purpose, roughly 5 women per team, about 30 people. Publishing
            more projects than a cohort can staff leaves half-empty teams that all stall, which is
            worse than fewer full ones.
          </p>
          {preview && (
            <div className="bg-gray-50 rounded-lg p-3 mb-3 text-xs text-gray-600 space-y-0.5">
              <p>
                Reveal &amp; lead applications open: <strong>{preview.revealDate}</strong>
              </p>
              <p>
                Applications close: <strong>{preview.leadApplyCloseDate}</strong>
              </p>
              <p>
                Leads assigned by: <strong>{preview.leadsAssignedByDate}</strong>
              </p>
              <p>
                Contributors apply: <strong>{preview.teamOpenDate}</strong>
              </p>
              <p>
                Teams locked: <strong>{preview.teamLockDate}</strong>
              </p>
              <p>
                Deadline: <strong>{preview.endDate}</strong> · grace ends {preview.graceEndDate}
              </p>
            </div>
          )}
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
                    {cohort.startDate} → {cohort.endDate}
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
                {projects.length === 0 && (
                  <button
                    onClick={() => generate(cohort)}
                    disabled={busy === cohort.id}
                    className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                  >
                    {busy === cohort.id
                      ? 'Generating…'
                      : `Generate ${cohort.projectCount || 6} projects`}
                  </button>
                )}
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
                    setCohortDraft({ name: cohort.name, startDate: cohort.startDate });
                  }}
                  className="text-gray-500 hover:text-gray-800 text-xs font-semibold px-2 py-2"
                >
                  Edit dates
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
              {editingCohort === cohort.id && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <input
                      value={cohortDraft.name}
                      onChange={(e) => setCohortDraft((d) => ({ ...d, name: e.target.value }))}
                      className="flex-1 min-w-[10rem] px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
                    />
                    <input
                      type="date"
                      value={cohortDraft.startDate}
                      onChange={(e) => setCohortDraft((d) => ({ ...d, startDate: e.target.value }))}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
                    />
                  </div>
                  <p className="text-gray-500 text-[11px] mb-2">
                    Changing the start date moves every deadline in this cohort, including on
                    projects already generated.
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
