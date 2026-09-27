// src/Pages/admin/LeadApplicationReview.jsx
//
// The reviewer queue for lead applications. Admin OR editor.
//
// The view is organised BY PROJECT rather than by applicant, because that is
// the decision you're actually making: "four people want to lead Project A and
// nobody wants Project D" is what tells you where to put your attention.
//
// Interviews happen on Google Meet, this screen records the schedule, the
// notes, and the decision. It does not host video.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { usePermissions } from '../../utils/permissions';
import { leadInterviewInvite } from '../../utils/calendarInvite';
import { approveProposal, declineProposal, listOpenCohorts, listProposals, TRACKS } from '../../utils/projectProposals';
import NoteDialog from '../../components/NoteDialog';
import {
  getApplicationsForCohort,
  groupByProject,
  scheduleInterview,
  saveReviewerNotes,
  assignAsLead,
  rejectAsLeadInviteAsContributor,
  rejectApplication,
  suggestAnotherProjectToLead,
  getFallbackCandidates,
  LEAD_APP_STATUS,
} from '../../utils/leadApplications';

const STATUS_STYLE = {
  [LEAD_APP_STATUS.SUBMITTED]: 'bg-gray-100 text-gray-700',
  [LEAD_APP_STATUS.INTERVIEW_SCHEDULED]: 'bg-purple-100 text-purple-700',
  [LEAD_APP_STATUS.ASSIGNED]: 'bg-green-100 text-green-700',
  [LEAD_APP_STATUS.OFFERED_ROLE]: 'bg-amber-100 text-amber-700',
  [LEAD_APP_STATUS.REJECTED]: 'bg-red-100 text-red-600',
};

const STATUS_LABEL = {
  [LEAD_APP_STATUS.SUBMITTED]: 'Applied',
  [LEAD_APP_STATUS.INTERVIEW_SCHEDULED]: 'Interview set',
  [LEAD_APP_STATUS.ASSIGNED]: 'Assigned',
  [LEAD_APP_STATUS.OFFERED_ROLE]: 'Offered a role',
  [LEAD_APP_STATUS.REJECTED]: 'Not selected',
};

const LeadApplicationReview = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { isReviewer, loading: permsLoading } = usePermissions(currentUser?.uid);

  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  // Members' project proposals waiting for a decision.
  const [proposals, setProposals] = useState([]);
  const [declining, setDeclining] = useState(null);
  const [pBusy, setPBusy] = useState(false);
  const [openCohorts, setOpenCohorts] = useState([]);
  const [cohortFor, setCohortFor] = useState({});
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
      const [projSnap, appSnap] = await Promise.all([
        getDocs(query(collection(db, 'projects'), where('isActive', '==', true))),
        getDocs(collection(db, 'lead_applications')),
      ]);
      const apps = appSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((a) => a.status !== LEAD_APP_STATUS.WITHDRAWN)
        .sort((x, y) => (x.createdAt?.seconds || 0) - (y.createdAt?.seconds || 0));
      const wanted = new Set(apps.flatMap((a) => a.rankedProjectIds || []));
      setProjects(
        projSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((p) => !p.isCompanyPost && (!p.leadConfirmed || wanted.has(p.id)))
      );
      setApplications(apps);
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
    .filter((g) => !g.project.leadConfirmed || g.applicants.length > 0)
    .sort((a, b) => Number(a.project.leadConfirmed || false) - Number(b.project.leadConfirmed || false));
  const waiting = applications.filter((a) => ['submitted', 'interview_scheduled'].includes(a.status));
  const unled = projects.filter((p) => !p.leadConfirmed);
  const assignedCount = applications.filter((a) => a.status === LEAD_APP_STATUS.ASSIGNED).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
        Lead applications
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        {waiting.length} application{waiting.length === 1 ? '' : 's'} waiting &middot;{' '}
        {unled.length} project{unled.length === 1 ? '' : 's'} need{unled.length === 1 ? 's' : ''} a lead &middot; applications are open all the time
      </p>

      {/* Projects nobody wants - the thing most likely to be missed */}
      {unled.some((p) => !grouped.find((g) => g.project.id === p.id)?.applicants.length) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <p className="text-amber-900 text-sm font-semibold mb-1">
            Some projects have no applicants
          </p>
          <p className="text-amber-800 text-xs">
            Consider promoting them in the weekly email, or closing them, a
            project with no lead can&rsquo;t run, and fewer full teams beat more empty ones.
          </p>
        </div>
      )}

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
                    {openCohorts.length === 0 ? (
                      <a href="/admin/cohorts" className="text-xs font-semibold text-pink-700 underline">No upcoming cohort: create one first</a>
                    ) : (
                      <select
                        value={cohortFor[p.id] || openCohorts[0].id}
                        onChange={(e) => setCohortFor((m) => ({ ...m, [p.id]: e.target.value }))}
                        className="text-xs border border-gray-300 rounded-lg px-2 py-1.5"
                        aria-label="Cohort for this project"
                      >
                        {openCohorts.map((c) => (
                          <option key={c.id} value={c.id}>{c.name} (starts {c.startDate})</option>
                        ))}
                      </select>
                    )}
                    <button
                      disabled={pBusy || openCohorts.length === 0}
                      onClick={async () => {
                        setPBusy(true);
                        try {
                          const cohort = openCohorts.find((c) => c.id === (cohortFor[p.id] || openCohorts[0].id));
                          await approveProposal(p, currentUser, cohort);
                          toast.success(`Approved. ${p.name} is the lead, and the project is in ${cohort.name}.`);
                          load();
                        } catch (e) {
                          toast.error('Could not approve it.');
                        }
                        setPBusy(false);
                      }}
                      className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
                    >
                      Approve and make her lead
                    </button>
                    <button onClick={() => setDeclining(p)} className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">Decline</button>
                  </div>
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
                      {project.industryTrack} &middot; {applicants.length} applicant
                      {applicants.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  {project.leadConfirmed ? (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700 uppercase">
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
                    <button
                      type="button"
                      onClick={() => setExpanded(open ? null : `${project.id}_${app.id}`)}
                      className="w-full text-left p-4 sm:p-5 hover:bg-gray-50 transition-colors"
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

                    {open && (
                      <ApplicantPanel
                        app={app}
                        project={project}
                        projects={projects}
                        decided={decided}
                        busy={busy}
                        reviewer={currentUser}
                        onAct={act}
                      />
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

const ApplicantPanel = ({ app, project, projects, decided, busy, reviewer, onAct }) => {
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
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold px-4 py-2 rounded-lg"
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
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              {project.leadConfirmed ? 'Project already has a lead' : 'Accept as lead of this project'}
            </button>
          </div>

          {/* Lead a different project */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
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
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold px-3 py-2 rounded-lg"
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
                className="bg-white border border-green-300 text-green-800 disabled:opacity-40 text-xs font-semibold px-3 py-2 rounded-lg"
              >
                Suggest she applies
              </button>
            </div>
          </div>

          {/* Not lead, but wanted on a team */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
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
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
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
    </div>
  );
};

export default LeadApplicationReview;
