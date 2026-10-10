// src/Pages/admin/LeadApplicationReview.jsx
//
// Applications, in one place, for admins and editors: everyone who applied to
// LEAD a project and everyone who applied to COLLABORATE on one, shown
// together under each project (Projects → Manage → Manage projects →
// Applications). For any applicant, staff can open her profile and suggest
// she leads or collaborates on this project or another (SuggestBox).
// Collaborators are approved or declined by the project's lead, from the
// project dashboard.
//
// The view is organised BY PROJECT rather than by applicant, because that is
// the decision you're actually making: "four people want to lead Project A and
// nobody wants Project D" is what tells you where to put your attention.
//
// Interviews happen on Google Meet, this screen records the schedule, the
// notes, and the decision. It does not host video.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { usePermissions } from '../../utils/permissions';
import { leadInterviewInvite } from '../../utils/calendarInvite';
import { approveProposal, declineProposal, listOpenCohorts, listProposals, TRACKS } from '../../utils/projectProposals';
import NoteDialog from '../../components/NoteDialog';
import { createCohort } from '../../utils/cohorts';
import { checkDates, minEndDate, todayISO } from '../../utils/dateRules';
import {
  getApplicationsForCohort,
  groupByProject,
  scheduleInterview,
  saveReviewerNotes,
  assignAsLead,
  rejectAsLeadInviteAsContributor,
  rejectApplication,
  suggestAnotherProjectToLead,
  suggestToApplicant,
  getFallbackCandidates,
  LEAD_APP_STATUS,
} from '../../utils/leadApplications';

const STATUS_STYLE = {
  [LEAD_APP_STATUS.SUBMITTED]: 'bg-gray-100 text-gray-700',
  [LEAD_APP_STATUS.INTERVIEW_SCHEDULED]: 'bg-pink-100 text-pink-700',
  [LEAD_APP_STATUS.ASSIGNED]: 'bg-pink-600 text-white',
  [LEAD_APP_STATUS.OFFERED_ROLE]: 'bg-gray-100 text-gray-800',
  [LEAD_APP_STATUS.REJECTED]: 'bg-red-100 text-red-600',
};

const STATUS_LABEL = {
  [LEAD_APP_STATUS.SUBMITTED]: 'Applied',
  [LEAD_APP_STATUS.INTERVIEW_SCHEDULED]: 'Interview set',
  [LEAD_APP_STATUS.ASSIGNED]: 'Assigned',
  [LEAD_APP_STATUS.OFFERED_ROLE]: 'Offered a role',
  [LEAD_APP_STATUS.REJECTED]: 'Not selected',
};

// `bare`: shown inside Manage projects (no page heading or padding).
const LeadApplicationReview = ({ bare = false }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { isReviewer, loading: permsLoading } = usePermissions(currentUser?.uid);

  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  // Collaborator applications waiting for a decision, by project id.
  const [collabByProject, setCollabByProject] = useState({});
  // Every active She Model Tech project (for suggesting another project).
  const [allProjects, setAllProjects] = useState([]);
  // Mentors and team members are considered first when applicants are equally
  // qualified, so their applications are tagged. uid -> { mentor, team }
  const [tags, setTags] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  // Members' project proposals waiting for a decision.
  const [proposals, setProposals] = useState([]);
  const [declining, setDeclining] = useState(null);
  const [pBusy, setPBusy] = useState(false);
  const [openCohorts, setOpenCohorts] = useState([]);
  const [cohortFor, setCohortFor] = useState({});
  const [newDates, setNewDates] = useState({}); // proposal id -> { start, time, end }
  const [busy, setBusy] = useState(null);

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
      // Rolling: every active project still needing a lead, and every lead
      // application still waiting for a decision (any pool, including older ones).
      // Every active She Model Tech project (including ones that already have a
      // lead, so their other applicants stay visible and can be offered a team
      // role), and every lead application except withdrawn ones.
      const [projSnap, appSnap, collabSnap] = await Promise.all([
        getDocs(query(collection(db, 'projects'), where('isActive', '==', true))),
        getDocs(collection(db, 'lead_applications')),
        getDocs(query(collection(db, 'project_applications'), where('status', '==', 'submitted'))).catch(() => null),
      ]);
      const collab = {};
      (collabSnap ? collabSnap.docs : []).forEach((d) => {
        const a = { id: d.id, ...d.data() };
        if (!a.projectId) return;
        (collab[a.projectId] = collab[a.projectId] || []).push(a);
      });
      Object.values(collab).forEach((list) => list.sort((x, y) => (x.createdAt?.seconds || 0) - (y.createdAt?.seconds || 0)));
      setCollabByProject(collab);
      const apps = appSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((a) => a.status !== LEAD_APP_STATUS.WITHDRAWN)
        .sort((x, y) => (x.createdAt?.seconds || 0) - (y.createdAt?.seconds || 0));
      const wanted = new Set([...apps.flatMap((a) => a.rankedProjectIds || []), ...Object.keys(collab)]);
      const active = projSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((p) => !p.isCompanyPost && p.status !== 'completed');
      setAllProjects(active);
      setProjects(active.filter((p) => !p.leadConfirmed || wanted.has(p.id)));
      setApplications(apps);
      // Tag mentors (a published course) and team members (an approved team application).
      (async () => {
        const team = new Set();
        try {
          const t = await getDocs(query(collection(db, 'team_applications'), where('status', '==', 'approved')));
          t.docs.forEach((d) => d.data().email && team.add(String(d.data().email).trim().toLowerCase()));
        } catch (_) { /* optional */ }
        // Applicants' profiles, 30 at a time in parallel (one read per
        // applicant, one after another, was slow with many applications).
        const uids = [...new Set([...apps, ...Object.values(collab).flat()].map((a) => a.applicantUid).filter(Boolean))];
        const profiles = {};
        const chunks = [];
        for (let i = 0; i < uids.length; i += 30) chunks.push(uids.slice(i, i + 30));
        await Promise.all(chunks.map((ids) =>
          getDocs(query(collection(db, 'users'), where(documentId(), 'in', ids)))
            .then((snap) => snap.docs.forEach((d) => { profiles[d.id] = d.data(); }))
            .catch(() => {})));
        const out = {};
        for (const a of [...apps, ...Object.values(collab).flat()]) {
          if (!a.applicantUid || out[a.applicantUid]) continue;
          const d = profiles[a.applicantUid] || {};
          out[a.applicantUid] = {
            mentor: (d.mentorApprovedCourses || 0) > 0,
            team: team.has(String(a.applicantEmail || d.email || '').trim().toLowerCase()),
          };
        }
        setTags(out);
      })();
      listProposals().then((l) => setProposals(l.filter((x) => x.status === 'new'))).catch(() => setProposals([]));
      listOpenCohorts().then(setOpenCohorts).catch(() => setOpenCohorts([]));
    } catch (e) {
      console.error(e);
      toast.error('Could not load applications.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isReviewer) load();
  }, [isReviewer, load]);

  const act = async (key, fn, successMsg) => {
    setBusy(key);
    try {
      await fn();
      if (successMsg) toast.success(successMsg);
      await load();
    } catch (e) {
      toast.error(e.message || 'That didn\u2019t work.');
    }
    setBusy(null);
  };

  if (permsLoading || loading) {
    return <div className="min-h-screen grid place-items-center text-gray-500">Loading…</div>;
  }
  if (!isReviewer) return null;

  // Show every applicant (including decided ones) under each project they ranked.
  const grouped = groupByProject(applications, projects, { includeDecided: true })
    .filter((g) => !g.project.leadConfirmed || g.applicants.length > 0 || (collabByProject[g.project.id] || []).length > 0)
    .sort((a, b) => Number(a.project.leadConfirmed || false) - Number(b.project.leadConfirmed || false));
  const waiting = applications.filter((a) => ['submitted', 'interview_scheduled'].includes(a.status));
  const collabWaiting = Object.values(collabByProject).reduce((n, l) => n + l.length, 0);
  const unled = projects.filter((p) => !p.leadConfirmed);
  const assignedCount = applications.filter((a) => a.status === LEAD_APP_STATUS.ASSIGNED).length;

  return (
    <div className={bare ? '' : 'max-w-5xl mx-auto px-4 py-8 sm:py-12'}>
      {!bare && (
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Applications</h1>
      )}
      <p className="text-gray-500 text-sm mb-6">
        {waiting.length} to lead &middot; {collabWaiting} to collaborate &middot;{' '}
        {unled.length} project{unled.length === 1 ? '' : 's'} need{unled.length === 1 ? 's' : ''} a lead
      </p>


      {proposals.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Project proposals from members ({proposals.length})</h2>
          <div className="space-y-3">
            {proposals.map((p) => (
              <div key={p.id} className="bg-white border border-pink-200 rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900">{p.title}</p>
                    <p className="text-xs text-gray-500">{TRACKS[p.track] || p.track} · proposed by {p.name} ({p.email})</p>
                  </div>
                    <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={cohortFor[p.id] || (openCohorts[0] ? openCohorts[0].id : 'new')}
                      onChange={(e) => setCohortFor((m) => ({ ...m, [p.id]: e.target.value }))}
                      className="text-xs border border-gray-300 rounded-lg px-2 py-1.5"
                      aria-label="Cohort for this project"
                    >
                      {openCohorts.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}: {c.startDate} to {c.endDate}</option>
                      ))}
                      <option value="new">New cohort with dates I choose…</option>
                    </select>
                    <button
                      disabled={pBusy}
                      onClick={async () => {
                        setPBusy(true);
                        try {
                          const choice = cohortFor[p.id] || (openCohorts[0] ? openCohorts[0].id : 'new');
                          let cohort = openCohorts.find((c) => c.id === choice);
                          if (choice === 'new') {
                            const d = newDates[p.id] || {};
                            const dateErr = checkDates({ start: d.start, end: d.end, startTime: d.time || '09:00' });
                            if (dateErr) {
                              toast.error(dateErr);
                              setPBusy(false);
                              return;
                            }
                            const c = await createCohort({
                              startDate: d.start,
                              startTime: d.time || '09:00',
                              endDate: d.end,
                              projectCount: 1,
                              isPaid: false,
                              createdBy: currentUser.email,
                              creator: { uid: currentUser.uid, name: currentUser.displayName || currentUser.email },
                            });
                            cohort = {
                              id: c.id,
                              name: `Cohort ${c.number}`,
                              status: 'draft',
                              startDate: d.start,
                              endDate: d.end,
                              startAt: new Date(`${d.start}T${d.time || '09:00'}`).toISOString(),
                              number: c.number,
                              creator: { uid: currentUser.uid, name: currentUser.displayName || currentUser.email },
                            };
                          }
                          await approveProposal(p, currentUser, cohort);
                          toast.success(`Approved. ${p.name} is the lead, and the project is in ${cohort.name}.`);
                          load();
                        } catch (e) {
                          toast.error('Could not approve it.');
                        }
                        setPBusy(false);
                      }}
                      className="text-xs font-semibold bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
                    >
                      Approve and make her lead
                    </button>
                    <button onClick={() => setDeclining(p)} className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">Decline</button>
                  </div>
                  {(cohortFor[p.id] || (openCohorts[0] ? openCohorts[0].id : 'new')) === 'new' && (
                    <div className="w-full flex flex-wrap items-end gap-2 mt-2 rounded-lg bg-gray-50 border border-gray-200 p-3">
                      <label className="text-xs text-gray-700">Starts
                        <input type="date" value={(newDates[p.id] || {}).start || ''} min={todayISO()} onChange={(e) => setNewDates((m) => ({ ...m, [p.id]: { ...(m[p.id] || {}), start: e.target.value } }))}
                          className="block mt-1 px-2 py-1.5 rounded-lg border border-gray-300 text-sm" />
                      </label>
                      <label className="text-xs text-gray-700">Start time
                        <input type="time" value={(newDates[p.id] || {}).time || '09:00'} onChange={(e) => setNewDates((m) => ({ ...m, [p.id]: { ...(m[p.id] || {}), time: e.target.value } }))}
                          className="block mt-1 px-2 py-1.5 rounded-lg border border-gray-300 text-sm" />
                      </label>
                      <label className="text-xs text-gray-700">Ends (deadline)
                        <input type="date" value={(newDates[p.id] || {}).end || ''} min={minEndDate((newDates[p.id] || {}).start)} onChange={(e) => setNewDates((m) => ({ ...m, [p.id]: { ...(m[p.id] || {}), end: e.target.value } }))}
                          className="block mt-1 px-2 py-1.5 rounded-lg border border-gray-300 text-sm" />
                      </label>
                      <p className="text-[11px] text-gray-500 w-full">A new free cohort is created with these dates, and this project goes into it. Publish it in Projects → Create a cohort when you’re ready.</p>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-800 mt-2 whitespace-pre-wrap">{p.description}</p>
                {p.rolesNeeded && <p className="text-sm text-gray-700 mt-2"><strong>Roles:</strong> {p.rolesNeeded.split(/\n/).filter(Boolean).join(', ')}</p>}
                <p className="text-sm text-gray-700 mt-2"><strong>Why she wants to lead it:</strong> {p.whyLead}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <NoteDialog
        open={!!declining}
        title="Decline this project idea"
        description={declining ? `Let ${declining.name} know why (optional). She can propose another idea.` : ''}
        confirmLabel="Decline"
        busy={pBusy}
        onCancel={() => setDeclining(null)}
        onConfirm={async (note) => {
          setPBusy(true);
          await declineProposal(declining, currentUser, note).catch(() => toast.error('Could not decline it.'));
          setProposals((xs) => xs.filter((x) => x.id !== declining.id));
          setDeclining(null);
          setPBusy(false);
        }}
      />

      <div className="space-y-4">
        {grouped.map(({ project, applicants }) => {
          const fallbacks = project.leadConfirmed
            ? []
            : getFallbackCandidates(applications, project.id);
          return (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <div className="p-4 sm:p-5 border-b border-gray-100">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <h2 className="font-bold text-gray-900">
                      {project.projectTitle || project.title}
                    </h2>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {[project.industryTrack, `${applicants.length} to lead`, `${(collabByProject[project.id] || []).length} to collaborate`].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  {project.leadConfirmed ? (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-pink-100 text-pink-700 uppercase">
                      Led by {project.submitterName}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 uppercase">
                      Needs a lead
                    </span>
                  )}
                </div>
              </div>

              {applicants.length === 0 && !project.leadConfirmed && (
                <div className="p-4 sm:p-5">
                  <p className="text-gray-500 text-sm mb-2">Nobody has applied to lead this yet.</p>
                  {fallbacks.length > 0 && (
                    <p className="text-gray-600 text-xs">
                      {fallbacks.length} applicant{fallbacks.length === 1 ? '' : 's'} ranked this as
                      a second or third choice, they appear under their first-choice project.
                    </p>
                  )}
                </div>
              )}

              {applicants.map((app) => {
                const open = expanded === `${project.id}_${app.id}`;
                const decided = [
                  LEAD_APP_STATUS.ASSIGNED,
                  LEAD_APP_STATUS.OFFERED_ROLE,
                  LEAD_APP_STATUS.REJECTED,
                ].includes(app.status);
                return (
                  <div key={app.id} className="border-b border-gray-100 last:border-0">
                    <div className="flex items-stretch">
                    <button
                      type="button"
                      onClick={() => setExpanded(open ? null : `${project.id}_${app.id}`)}
                      className="flex-1 min-w-0 text-left p-4 sm:p-5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className={`shrink-0 w-6 h-6 rounded-full grid place-items-center text-[10px] font-bold ${
                            app.rank === 1 ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {app.rank}
                        </span>
                        <span className="font-semibold text-gray-900 text-sm">
                          {app.applicantName}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-600 text-white">Lead</span>
                        {tags[app.applicantUid]?.mentor && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-100" title="Considered first when equally qualified">Mentor</span>
                        )}
                        {tags[app.applicantUid]?.team && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-900 text-white" title="Considered first when equally qualified">Team</span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${STATUS_STYLE[app.status] || ''}`}
                        >
                          {STATUS_LABEL[app.status] || app.status}
                        </span>
                        {app.availabilityHours && (
                          <span className="text-gray-400 text-xs">
                            {app.availabilityHours}h/week
                          </span>
                        )}
                      </div>
                    </button>
                    {/* Her profile, in a new tab so the review stays open. */}
                    {(app.applicantUid || app.applicantEmail) && (
                      <a
                        href={`/profile/${encodeURIComponent(app.applicantUid || app.applicantEmail)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 self-center mr-4 sm:mr-5 text-xs font-semibold text-pink-700 border border-pink-200 hover:bg-pink-50 px-3 py-1.5 rounded-lg"
                      >
                        View profile
                      </a>
                    )}
                    </div>

                    {open && (
                      <ApplicantPanel
                        app={app}
                        project={project}
                        projects={projects}
                        allProjects={allProjects}
                        decided={decided}
                        busy={busy}
                        reviewer={currentUser}
                        onAct={act}
                      />
                    )}
                  </div>
                );
              })}

              {/* Collaborator applications for this project (decided by its lead). */}
              {(collabByProject[project.id] || []).map((app) => {
                const open = expanded === `${project.id}_c_${app.id}`;
                return (
                  <div key={app.id} className="border-b border-gray-100 last:border-0">
                    <div className="flex items-stretch">
                      <button
                        type="button"
                        onClick={() => setExpanded(open ? null : `${project.id}_c_${app.id}`)}
                        className="flex-1 min-w-0 text-left p-4 sm:p-5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-gray-900 text-sm">{app.applicantName}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-900 text-white">Collaborator</span>
                          {app.role && <span className="text-gray-500 text-xs">{app.role}</span>}
                          {tags[app.applicantUid]?.mentor && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-100">Mentor</span>
                          )}
                          {(app.staffSuggestions || []).length > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700">Suggested</span>
                          )}
                        </div>
                      </button>
                      {(app.applicantUid || app.applicantEmail) && (
                        <a
                          href={`/profile/${encodeURIComponent(app.applicantUid || app.applicantEmail)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 self-center mr-4 sm:mr-5 text-xs font-semibold text-pink-700 border border-pink-200 hover:bg-pink-50 px-3 py-1.5 rounded-lg"
                        >
                          View profile
                        </a>
                      )}
                    </div>
                    {open && (
                      <div className="px-4 sm:px-5 pb-5 bg-gray-50/60 space-y-3">
                        <div className="text-sm text-gray-700 space-y-1">
                          {app.skills && <p><span className="text-gray-500">Skills:</span> {app.skills}</p>}
                          {app.applicantBadgeLevel && <p><span className="text-gray-500">Badge level:</span> {app.applicantBadgeLevel}</p>}
                          {app.message && <p className="whitespace-pre-wrap">{app.message}</p>}
                          {app.portfolioUrl && <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-pink-700 text-xs font-semibold hover:underline">Portfolio</a>}
                        </div>
                        <p className="text-xs text-gray-600">
                          {project.leadConfirmed
                            ? <>The lead approves or declines collaborators. <a href={`/projects/owner-dashboard#project-${project.id}`} className="text-pink-700 font-semibold hover:underline">Open the project dashboard</a></>
                            : 'This project has no lead yet; collaborators are decided once a lead is chosen.'}
                        </p>
                        <SuggestBox
                          source="collaborator"
                          app={app}
                          applied="collaborate"
                          project={project}
                          allProjects={allProjects}
                          busy={busy}
                          reviewer={currentUser}
                          onAct={act}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// Suggest a different way to take part: lead or collaborate, on this project
// or another. She's notified and emailed; her application stays as it is.

const SuggestBox = ({ source, app, applied, project, allProjects, busy, reviewer, onAct }) => {
  const [kind, setKind] = useState(applied === 'lead' ? 'collaborate' : 'lead');
  const [picked, setProjectId] = useState(project.id);
  const [role, setRole] = useState('');
  const [note, setNote] = useState('');
  const needsLead = (p) => !p.leadConfirmed;
  // Leading: only projects still needing a lead (plus this one). Collaborating: any.
  const options = allProjects.filter((p) => kind === 'collaborate' || needsLead(p) || p.id === project.id);
  const projectId = options.some((p) => p.id === picked) ? picked : project.id;
  const target = allProjects.find((p) => p.id === projectId) || project;
  const same = projectId === project.id && kind === applied;
  const key = `${app.id}_suggest`;
  const past = app.staffSuggestions || [];
  const send = () => onAct(
    key,
    () => (source === 'lead' && kind === 'lead' && projectId !== project.id
      ? suggestAnotherProjectToLead({ appId: app.id, applicant: app, projectId, projectTitle: target.projectTitle || target.title, message: note, reviewer })
      : suggestToApplicant({ source, appId: app.id, applicant: app, kind, projectId, projectTitle: target.projectTitle || target.title, role, message: note, reviewer })),
    `Suggestion sent to ${app.applicantName || 'the applicant'}.`
  );
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      <p className="text-xs font-bold text-gray-900 mb-2">Suggest something else</p>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-gray-600">Suggest she</span>
        <select value={kind} onChange={(e) => setKind(e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1.5 bg-white text-sm" aria-label="Lead or collaborate">
          <option value="lead">leads</option>
          <option value="collaborate">collaborates on</option>
        </select>
        <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1.5 bg-white text-sm max-w-full sm:max-w-xs" aria-label="Project">
          {options.map((p) => (
            <option key={p.id} value={p.id}>
              {p.id === project.id ? 'this project' : (p.projectTitle || p.title)}{kind === 'lead' && p.leadConfirmed && p.id === project.id ? ' (has a lead)' : ''}
            </option>
          ))}
        </select>
        {kind === 'collaborate' && (
          <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role (optional)" className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm w-44" aria-label="Role" />
        )}
      </div>
      <textarea
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional personal note"
        className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
      />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={same || busy === key}
          onClick={send}
          className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {busy === key ? 'Sending…' : 'Send suggestion'}
        </button>
        {same && <span className="text-xs text-gray-500">That's what she applied for.</span>}
        {kind === 'lead' && target.leadConfirmed && !same && <span className="text-xs text-gray-500">This project already has a lead.</span>}
      </div>
      {past.length > 0 && (
        <ul className="mt-3 pt-2 border-t border-gray-100 space-y-1">
          {past.map((x, i) => (
            <li key={i} className="text-xs text-gray-600">
              Suggested {x.kind === 'lead' ? 'leading' : 'collaborating on'} "{x.projectTitle}"{x.role ? ` as ${x.role}` : ''}
              {x.by ? ` · ${x.by}` : ''}{x.at ? ` · ${new Date(x.at).toLocaleDateString()}` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------

const ApplicantPanel = ({ app, project, projects, allProjects = projects, decided, busy, reviewer, onAct }) => {
  const [notes, setNotes] = useState(app.reviewerNotes || '');
  const [meetLink, setMeetLink] = useState(app.meetLink || '');
  const [when, setWhen] = useState(app.interviewScheduledAt || '');
  const [suggestProject, setSuggestProject] = useState('');
  const [otherLead, setOtherLead] = useState('');
  const [suggestRole, setSuggestRole] = useState('');
  const [message, setMessage] = useState('');

  const k = (suffix) => `${app.id}_${suffix}`;

  return (
    <div className="px-4 sm:px-5 pb-5 bg-gray-50/60">
      <p className="text-gray-700 text-sm whitespace-pre-wrap mb-3">{app.pitch}</p>
      {app.experience && (
        <>
          <p className="text-gray-900 text-xs font-bold mb-1">Experience</p>
          <p className="text-gray-600 text-sm whitespace-pre-wrap mb-3">{app.experience}</p>
        </>
      )}
      <p className="text-gray-400 text-xs mb-5">
        Ranked {app.rankedProjectIds?.length || 0} project
        {app.rankedProjectIds?.length === 1 ? '' : 's'} &middot; applied as choice #{app.rank}
      </p>

      {!decided && (
        <>
          {/* Interview */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-gray-900 text-xs font-bold mb-2">Interview (Google Meet)</p>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="datetime-local"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
              />
              <input
                type="url"
                value={meetLink}
                placeholder="https://meet.google.com/…"
                onChange={(e) => setMeetLink(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
              />
            </div>
            <p className="text-gray-400 text-[11px] mb-3">
              Pick a time, open Google Calendar (she&rsquo;s added as a guest automatically), click
              &ldquo;Add Google Meet&rdquo;, save, then paste the Meet link back here so it reaches
              her notification too.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={
                  when
                    ? leadInterviewInvite({
                        applicant: app,
                        projectTitle: project.projectTitle || project.title,
                        when,
                      })
                    : undefined
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!when) {
                    e.preventDefault();
                  }
                }}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                  when
                    ? 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Open in Google Calendar
              </a>
              <button
                type="button"
                disabled={busy === k('sched') || !when}
                onClick={() =>
                  onAct(
                    k('sched'),
                    () =>
                      scheduleInterview({ appId: app.id, scheduledAt: when, meetLink, reviewer }),
                    'Interview scheduled and she\u2019s been notified.'
                  )
                }
                className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Save &amp; notify
              </button>
            </div>
          </div>

          {/* Notes */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Private interview notes, never shown to the applicant."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500 resize-y mb-2"
          />
          <button
            type="button"
            disabled={busy === k('notes')}
            onClick={() =>
              onAct(k('notes'), () => saveReviewerNotes(app.id, notes, reviewer), 'Notes saved.')
            }
            className="text-gray-600 text-xs font-semibold underline mb-5"
          >
            Save notes
          </button>

          {/* Decisions: every applicant stays here until she has a decision. */}
          <p className="text-xs font-bold text-gray-900 mb-2">Decide for {app.applicantName}</p>
          {project.leadConfirmed && (
            <p className="text-xs text-gray-600 mb-2">
              This project already has a lead. Choose another option below: lead a different project, suggest one for
              her to consider, join a team as a collaborator, or close the application.
            </p>
          )}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              disabled={busy === k('assign') || project.leadConfirmed}
              onClick={() =>
                onAct(
                  k('assign'),
                  () =>
                    assignAsLead({
                      appId: app.id,
                      projectId: project.id,
                      applicant: app,
                      reviewer,
                    }),
                  `${app.applicantName} is now leading this project.`
                )
              }
              className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              {project.leadConfirmed ? 'Project already has a lead' : 'Accept as lead of this project'}
            </button>
          </div>

          {/* Lead a different project */}
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
            <p className="text-gray-900 text-xs font-bold mb-1">Lead a different project</p>
            <p className="text-gray-600 text-[11px] mb-2">Assign her straight away, or suggest a project she can consider (her application stays open).</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={otherLead}
                onChange={(e) => setOtherLead(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
                aria-label="Another project that needs a lead"
              >
                <option value="">Choose a project that needs a lead…</option>
                {projects.filter((p) => !p.leadConfirmed && p.id !== project.id).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectTitle || p.title}{p.isCohort ? ' (cohort)' : ''}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!otherLead || busy === k('assign-other')}
                onClick={() =>
                  onAct(
                    k('assign-other'),
                    () => assignAsLead({ appId: app.id, projectId: otherLead, applicant: app, reviewer }),
                    `${app.applicantName} is now leading that project.`
                  )
                }
                className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold px-3 py-2 rounded-lg"
              >
                Assign as lead
              </button>
              <button
                type="button"
                disabled={!otherLead || busy === k('suggest-other')}
                onClick={() => {
                  const target = projects.find((p) => p.id === otherLead);
                  onAct(
                    k('suggest-other'),
                    () => suggestAnotherProjectToLead({ appId: app.id, applicant: app, projectId: otherLead, projectTitle: target?.projectTitle || 'this project', message, reviewer }),
                    'Suggested. Her application stays open and now shows under that project too.'
                  );
                }}
                className="bg-white border border-pink-300 text-pink-800 disabled:opacity-40 text-xs font-semibold px-3 py-2 rounded-lg"
              >
                Suggest she applies
              </button>
            </div>
          </div>

          {/* Not lead, but wanted on a team */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <p className="text-gray-900 text-xs font-bold mb-1">
              Be a collaborator: invite her onto a team
            </p>
            <p className="text-gray-600 text-[11px] mb-3 leading-relaxed">
              Someone confident enough to apply to lead is exactly who you want building. Use this
              instead of a plain rejection.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <select
                value={suggestProject}
                onChange={(e) => setSuggestProject(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500 bg-white"
              >
                <option value="">Suggest a project…</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectTitle || p.title}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={suggestRole}
                placeholder="Role, e.g. Frontend Developer"
                onChange={(e) => setSuggestRole(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
              />
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              placeholder="Optional personal note, this one is worth writing."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500 resize-y mb-2"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy === k('offer')}
                onClick={() =>
                  onAct(
                    k('offer'),
                    () =>
                      rejectAsLeadInviteAsContributor({
                        appId: app.id,
                        applicant: app,
                        suggestedProjectId: suggestProject || null,
                        suggestedRole: suggestRole || null,
                        message,
                        reviewer,
                      }),
                    'Invited her onto a team.'
                  )
                }
                className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Offer a collaborator role
              </button>
              <button
                type="button"
                disabled={busy === k('reject')}
                onClick={() => {
                  if (!window.confirm('Reject outright, with no role offered?')) return;
                  onAct(
                    k('reject'),
                    () =>
                      rejectApplication({
                        appId: app.id,
                        applicant: app,
                        reason: message,
                        reviewer,
                      }),
                    'Application closed.'
                  );
                }}
                className="text-gray-500 hover:text-red-600 text-xs font-semibold px-2 py-2"
              >
                Reject
              </button>
            </div>
          </div>
        </>
      )}

      {decided && (
        <p className="text-gray-500 text-xs">
          Decided by {app.decidedBy || 'a reviewer'}
          {app.suggestedRole ? `, offered ${app.suggestedRole}` : ''}.
        </p>
      )}

      <div className="mt-4">
        <SuggestBox
          source="lead"
          app={app}
          applied="lead"
          project={project}
          allProjects={allProjects}
          busy={busy}
          reviewer={reviewer}
          onAct={onAct}
        />
      </div>
    </div>
  );
};

export default LeadApplicationReview;
