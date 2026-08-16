// src/Pages/admin/LeadApplicationReview.jsx
//
// The reviewer queue for lead applications. Admin OR editor.
//
// The view is organised BY PROJECT rather than by applicant, because that is
// the decision you're actually making: "four people want to lead Project A and
// nobody wants Project D" is what tells you where to put your attention.
//
// Interviews happen on Google Meet — this screen records the schedule, the
// notes, and the decision. It does not host video.

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { usePermissions } from '../../utils/permissions';
import { getFormingCohort, getCohort } from '../../utils/cohorts';
import { leadInterviewInvite } from '../../utils/calendarInvite';
import {
  getApplicationsForCohort, groupByProject, scheduleInterview,
  saveReviewerNotes, assignAsLead, rejectAsLeadInviteAsContributor,
  rejectApplication, getFallbackCandidates, LEAD_APP_STATUS,
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

  const [cohort, setCohort] = useState(null);
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return; }
    if (!permsLoading && !isReviewer) navigate('/');
  }, [currentUser, permsLoading, isReviewer, navigate]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let c = await getFormingCohort();
      if (!c) c = await getCohort('__none__').catch(() => null);
      setCohort(c);
      if (!c) { setLoading(false); return; }

      // Two queries total, regardless of how many applicants there are.
      const [projSnap, apps] = await Promise.all([
        getDocs(query(collection(db, 'projects'), where('cohortId', '==', c.id))),
        getApplicationsForCohort(c.id),
      ]);
      setProjects(projSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setApplications(apps);
    } catch (e) {
      console.error(e);
      toast.error('Could not load applications.');
    }
    setLoading(false);
  }, []);

  useEffect(() => { if (isReviewer) load(); }, [isReviewer, load]);

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

  if (!cohort) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No cohort is being staffed</h1>
        <p className="text-gray-600">
          Create a cohort and reveal its projects to start taking lead applications.
        </p>
      </div>
    );
  }

  const grouped = groupByProject(applications, projects);
  const unled = projects.filter(p => !p.leadConfirmed);
  const assignedCount = applications.filter(a => a.status === LEAD_APP_STATUS.ASSIGNED).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
        Lead applications &mdash; {cohort.name}
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        {applications.length} application{applications.length === 1 ? '' : 's'} &middot;{' '}
        {assignedCount} of {projects.length} projects have a lead &middot;{' '}
        applications close {cohort.leadApplyCloseDate}
      </p>

      {/* Projects nobody wants - the thing most likely to be missed */}
      {unled.some(p => !grouped.find(g => g.project.id === p.id)?.applicants.length) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <p className="text-amber-900 text-sm font-semibold mb-1">
            Some projects have no applicants
          </p>
          <p className="text-amber-800 text-xs">
            Consider promoting them in the weekly email, or dropping them from this
            cohort &mdash; a project with no lead can&rsquo;t run, and fewer full teams
            beat more empty ones.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {grouped.map(({ project, applicants }) => {
          const fallbacks = project.leadConfirmed
            ? []
            : getFallbackCandidates(applications, project.id);
          return (
            <div key={project.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <h2 className="font-bold text-gray-900">
                      {project.projectTitle || project.title}
                    </h2>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {project.industryTrack} &middot;{' '}
                      {applicants.length} applicant{applicants.length === 1 ? '' : 's'}
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
                      {fallbacks.length} applicant{fallbacks.length === 1 ? '' : 's'} ranked
                      this as a second or third choice &mdash; they appear under their
                      first-choice project.
                    </p>
                  )}
                </div>
              )}

              {applicants.map(app => {
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
                        <span className={`shrink-0 w-6 h-6 rounded-full grid place-items-center text-[10px] font-bold ${
                          app.rank === 1 ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {app.rank}
                        </span>
                        <span className="font-semibold text-gray-900 text-sm">
                          {app.applicantName}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${STATUS_STYLE[app.status] || ''}`}>
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
                type="datetime-local" value={when}
                onChange={e => setWhen(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
              />
              <input
                type="url" value={meetLink} placeholder="https://meet.google.com/…"
                onChange={e => setMeetLink(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
              />
            </div>
            <p className="text-gray-400 text-[11px] mb-3">
              Pick a time, open Google Calendar (she&rsquo;s added as a guest
              automatically), click &ldquo;Add Google Meet&rdquo;, save &mdash; then
              paste the Meet link back here so it reaches her notification too.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={when ? leadInterviewInvite({
                  applicant: app,
                  projectTitle: project.projectTitle || project.title,
                  when,
                }) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { if (!when) { e.preventDefault(); } }}
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
                onClick={() => onAct(k('sched'),
                  () => scheduleInterview({ appId: app.id, scheduledAt: when, meetLink, reviewer }),
                  'Interview scheduled and she\u2019s been notified.')}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Save &amp; notify
              </button>
            </div>
          </div>

          {/* Notes */}
          <textarea
            value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            placeholder="Private interview notes — never shown to the applicant."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500 resize-y mb-2"
          />
          <button
            type="button"
            disabled={busy === k('notes')}
            onClick={() => onAct(k('notes'),
              () => saveReviewerNotes(app.id, notes, reviewer), 'Notes saved.')}
            className="text-gray-600 text-xs font-semibold underline mb-5"
          >
            Save notes
          </button>

          {/* Decisions */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              disabled={busy === k('assign') || project.leadConfirmed}
              onClick={() => onAct(k('assign'),
                () => assignAsLead({ appId: app.id, projectId: project.id, applicant: app, reviewer }),
                `${app.applicantName} is now leading this project.`)}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              {project.leadConfirmed ? 'Project already has a lead' : 'Assign as lead'}
            </button>
          </div>

          {/* Not lead, but wanted on a team */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-gray-900 text-xs font-bold mb-1">
              Not leading &mdash; but invite her onto a team
            </p>
            <p className="text-gray-600 text-[11px] mb-3 leading-relaxed">
              Someone confident enough to apply to lead is exactly who you want
              building. Use this instead of a plain rejection.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <select
                value={suggestProject} onChange={e => setSuggestProject(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500 bg-white"
              >
                <option value="">Suggest a project…</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.projectTitle || p.title}</option>
                ))}
              </select>
              <input
                type="text" value={suggestRole} placeholder="Role, e.g. Frontend Developer"
                onChange={e => setSuggestRole(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
              />
            </div>
            <textarea
              value={message} onChange={e => setMessage(e.target.value)} rows={2}
              placeholder="Optional personal note — this one is worth writing."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500 resize-y mb-2"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy === k('offer')}
                onClick={() => onAct(k('offer'),
                  () => rejectAsLeadInviteAsContributor({
                    appId: app.id, applicant: app,
                    suggestedProjectId: suggestProject || null,
                    suggestedRole: suggestRole || null,
                    message, reviewer,
                  }),
                  'Invited her onto a team.')}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Offer a contributor role
              </button>
              <button
                type="button"
                disabled={busy === k('reject')}
                onClick={() => {
                  if (!window.confirm('Reject outright, with no role offered?')) return;
                  onAct(k('reject'),
                    () => rejectApplication({ appId: app.id, applicant: app, reason: message, reviewer }),
                    'Application closed.');
                }}
                className="text-gray-500 hover:text-red-600 text-xs font-semibold px-2 py-2"
              >
                Reject outright
              </button>
            </div>
          </div>
        </>
      )}

      {decided && (
        <p className="text-gray-500 text-xs">
          Decided by {app.decidedBy || 'a reviewer'}
          {app.suggestedRole ? ` — offered ${app.suggestedRole}` : ''}.
        </p>
      )}
    </div>
  );
};

export default LeadApplicationReview;
