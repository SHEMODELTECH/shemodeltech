// src/Pages/projects/ProjectSetup.jsx
// The project owner (confirmed lead) refines a project (title, description, goals,
// industry, dates, links, and team roles) and opens it for applications. Only the
// owner can access this. Opening flips status from 'setup' to 'active'.
//
// This is the single EDIT page for BOTH free and paid projects (the owner
// dashboard's "Edit Project" links here). It mirrors the creation form so nothing
// is lost when editing, with two money-driven rules for PAID projects:
//   - Existing (already-posted) roles and their amounts are LOCKED - they can't be
//     edited, because talent may have applied under those exact terms.
//   - The owner can still ADD new roles (each with its own pay-per-person amount).
// FREE projects have no money attached, so every role stays fully editable.

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import {
  ROLE_TEMPLATES, EXPERIENCE_LEVELS, MIN_TEAM_SIZE, MIN_MEMBERS,
  rolesMeetMinTeamSize, MIN_TEAM_SIZE_ROLES_ERROR,
} from '../../utils/projectRoles';
import { formatMoney, computeTotalBudget } from '../../utils/paidProjects';
import { checkDates, minEndDate, minStartDate } from '../../utils/dateRules';
import { BADGE_TRACKS } from '../../config/badgeTracks';
import { alertStaff } from '../../utils/staffAlerts';
import { roleSlotsOf } from '../../utils/projectSlots';

const industryTracks = [
  'healthcare', 'finance', 'education', 'ecommerce', 'entertainment', 'government',
  'technology', 'cybersecurity', 'transportation', 'realestate', 'energy',
  'agriculture', 'manufacturing', 'legal', 'nonprofit', 'travel', 'sports',
  'food', 'fashion', 'construction', 'marketing',
];
const roleTemplates = ROLE_TEMPLATES;
const experienceLevels = EXPERIENCE_LEVELS;

const inputClass = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-pink-500 focus:outline-none transition-all";
const labelClass = "block text-gray-700 font-semibold mb-2 text-sm";

// Turn a stored role into the editable shape the dropdown understands: known
// templates keep their value; anything else becomes a custom "Other" entry.
const toEditableRole = (r = {}, existing = false) => {
  const known = roleTemplates.includes(r.role);
  return {
    role: known ? r.role : '__other__',
    customRole: known ? '' : (r.role || ''),
    skills: r.skills || '',
    count: r.count || 1,
    experienceLevel: experienceLevels.includes(r.experienceLevel) ? r.experienceLevel : 'any-level',
    description: r.description || '',
    detailsLink: r.detailsLink || '',
    payAmount: r.payAmount != null && r.payAmount !== 0 ? String(r.payAmount) : '',
    existing,
  };
};


const emptyRole = () => ({
  role: '', customRole: '', skills: '', count: 1, experienceLevel: 'any-level',
  description: '', detailsLink: '', payAmount: '', existing: false,
});

const ProjectSetup = () => {
  const [cohortLock, setCohortLock] = useState(false);
  const [coreLock, setCoreLock] = useState(true);
  const datesLocked = cohortLock || coreLock;
  const [originalStart, setOriginalStart] = useState(null);
  const [paidLock, setPaidLock] = useState(false);
  const [isStaffEditor, setIsStaffEditor] = useState(false);
  const [roleTracks, setRoleTracks] = useState({}); // lead's badge tracks wanted per role (paid)
  const [fixedSize, setFixedSize] = useState(null); // number of people set by She Model Tech
  const [fixedPay, setFixedPay] = useState(null); // pay per person on paid cohorts
  const [sizeRequest, setSizeRequest] = useState(null); // lead's pending request for more people
  const [askMore, setAskMore] = useState({ open: false, extra: 1, reason: '' });
  const [leadDetails, setLeadDetails] = useState(''); // the lead's extra details (not the brief)
  const [projectStatus, setProjectStatus] = useState('');
  const { projectId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [form, setForm] = useState({ projectTitle: '', projectDescription: '', projectGoals: '', industryTrack: 'technology', startDate: '', endDate: '', submissionUrl: '', projectLink: '' });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (!currentUser) { navigate('/login', { replace: true }); return; }
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'projects', projectId));
        if (!snap.exists()) { toast.error('Project not found'); navigate('/projects', { replace: true }); return; }
        const data = snap.data();

        // The lead, or She Model Tech staff (admins and editors), can edit.
        const meSnap = await getDoc(doc(db, 'users', currentUser.uid)).catch(() => null);
        const staffEditor = ['admin', 'editor'].includes(meSnap?.data()?.role);
        setIsStaffEditor(staffEditor);
        if (data.submitterId !== currentUser.uid && !staffEditor) {
          toast.error('Only the project lead can edit this.');
          navigate(`/projects/${projectId}`, { replace: true });
          return;
        }
        // Rejected projects are terminal and cannot be edited.
        if (data.reviewStatus === 'rejected') {
          toast.error('This project was rejected and can no longer be edited.');
          navigate(`/projects/${projectId}`, { replace: true });
          return;
        }
        // Whether this project is already published (editing) vs first-time setup.
        const alreadyActive = data.status === 'active';
        setIsEditing(alreadyActive);
        setIsPaid(!!data.isPaid);
        // Cohort projects: She Model Tech fixes the dates; paid cohorts are fully fixed.
        setCohortLock(!!data.isCohort && !staffEditor); // staff can change cohort dates
        // Leads (members) can't change the title, description, or dates; staff can.
        getDoc(doc(db, 'users', currentUser.uid))
          .then((u) => setCoreLock(!['admin', 'editor'].includes(u.data()?.role) && !data.isCompanyPost))
          .catch(() => setCoreLock(true));
        setOriginalStart(data.startDate || null);
        // Paid cohorts use the normal form now (the lead creates roles); pay and
        // the number of people stay as She Model Tech set them.
        setPaidLock(false);
        setRoleTracks(data.roleTracks || {});
        setLeadDetails(data.leadDetails || '');
        setProjectStatus(data.status || '');

        setForm({
          projectTitle: data.projectTitle || '',
          projectDescription: data.projectDescription || '',
          projectGoals: data.projectGoals || '',
          industryTrack: data.industryTrack || 'technology',
          startDate: data.startDate || '',
          // (kept below so an already-started project can keep its start date)
          endDate: data.endDate || '',
          submissionUrl: data.resources?.submissionUrl || '',
          projectLink: data.projectLink || '',
        });
        // Pre-fill roles: use live teamRoles if published, else the generator's proposal.
        // Live teamRoles are "existing" (locked for paid); a fresh proposal is not.
        const liveRoles = alreadyActive && Array.isArray(data.teamRoles) && data.teamRoles.length;
        // She Model Tech doesn't set roles: the lead creates them. Only roles the
        // lead already saved are loaded (never generated suggestions).
        const sourceRoles = Array.isArray(data.teamRoles) ? data.teamRoles : [];
        setRoles(sourceRoles.length
          ? sourceRoles.map(r => toEditableRole(r, false))
          : [emptyRole()]);
        // She Model Tech sets how many people are on the project; the lead can't change it.
        const existingTotal = (Array.isArray(data.teamRoles) ? data.teamRoles : []).reduce((n, r) => n + (Number(r.count) || 0), 0);
        const slots = roleSlotsOf(data, existingTotal);
        // Seats for people besides the lead, set by She Model Tech (staff can change).
        setFixedSize(!staffEditor && slots > 0 ? slots : null);
        setFixedPay(data.cohortPaid ? Number(data.payPerPerson) || null : null);
        setSizeRequest(data.sizeRequest || null);
        setAuthorized(true);
      } catch (e) {
        console.error(e);
        toast.error('Could not load the project.');
        navigate('/projects', { replace: true });
      }
      setLoading(false);
    };
    load();
  }, [currentUser, projectId, navigate]);

  // A role is locked (read-only) only when the project is paid AND the role was
  // already posted. New rows the owner adds this session stay editable.
  const isLocked = (r) => isPaid && r.existing;

  const updateRole = (i, field, value) => setRoles(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  const addRole = () => { if (roles.length < 12) setRoles(prev => [...prev, emptyRole()]); };
  const removeRole = (i) => setRoles(prev => prev.filter((_, idx) => idx !== i));

  // Resolve the display/stored role name for a row (handles the custom "Other").
  const resolveRoleName = (r) => isLocked(r)
    ? (r.role || '')
    : (r.role === '__other__' ? (r.customRole || '').trim() : (r.role || '').trim());

  // Build the teamRoles array to persist, preserving pay for paid projects.
  const buildTeamRoles = () => roles
    .map(r => ({
      role: resolveRoleName(r),
      skills: (r.skills || '').trim(),
      count: parseInt(r.count, 10) || 1,
      experienceLevel: r.experienceLevel || 'any-level',
      description: (r.description || '').trim(),
      detailsLink: (r.detailsLink || '').trim(),
      payAmount: isPaid ? (fixedPay != null ? fixedPay : (parseFloat(r.payAmount) || 0)) : 0,
    }))
    .filter(r => r.role && r.count > 0);

  // Validate that every NEW paid role has a pay-per-person amount.
  const newPaidRoleMissingPay = () => isPaid && fixedPay == null && roles.some(r => {
    if (isLocked(r)) return false;               // existing roles keep their amount
    if (!resolveRoleName(r)) return false;        // blank rows are dropped, not flagged
    return !(parseFloat(r.payAmount) > 0);
  });

  const handleOpen = async () => {
    if (!form.projectTitle.trim()) { toast.error('Title is required'); return; }
    if (!form.projectDescription.trim()) { toast.error('Description is required'); return; }
    if (!form.startDate) { toast.error('Start date is required'); return; }
    if (!form.endDate) { toast.error('End date is required'); return; }
    if (!datesLocked) {
      const dateErr = checkDates({ start: form.startDate, end: form.endDate, originalStart: originalStart });
      if (dateErr) { toast.error(dateErr); return; }
    }
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
      toast.error('End date must be after the start date'); return;
    }
    if (!form.submissionUrl.trim()) { toast.error('A project submission link is required'); return; }
    if (!form.projectLink.trim()) { toast.error('A project link (full description doc) is required'); return; }

    const valid = buildTeamRoles();
    if (valid.length === 0) { toast.error('Add at least one team role'); return; }

    // No solo projects: the roles must offer enough seats for a real team
    // (the owner counts as one person, so the roles cover everyone else).
    if (!rolesMeetMinTeamSize(valid)) { toast.error(MIN_TEAM_SIZE_ROLES_ERROR); return; }

    // Skills are required for every editable role. Locked paid roles keep the
    // skills they were posted with, so they're skipped here.
    const missingSkills = roles.some(r => !isLocked(r) && resolveRoleName(r) && !(r.skills || '').trim());
    if (missingSkills) { toast.error('Add the required skills for each role.'); return; }

    if (isPaid) {
      if (newPaidRoleMissingPay()) { toast.error('Set a pay-per-person amount (greater than 0) for each new role.'); return; }
      // Any newly added paid role locks once saved. Confirm before saving.
      const addingNewRoles = roles.some(r => !isLocked(r) && resolveRoleName(r));
      if (addingNewRoles) {
        const ok = window.confirm(
          "Please double-check each new role, its pay-per-person amount, and the number of people.\n\nOnce you save, the new roles are LOCKED - you won't be able to edit them or their amounts afterwards (you can still add more roles later).\n\nIs everything correct?"
        );
        if (!ok) return;
      }
    } else {
      // Free projects must keep a newcomer-friendly role open.
      const hasOpenRole = valid.some(r => {
        const lvl = (r.experienceLevel || 'any-level').toLowerCase();
        return lvl === 'any-level' || lvl === 'beginner' || lvl === '';
      });
      if (!hasOpenRole) { toast.error('Add at least one Beginner or Any Level role so newcomers can join.'); return; }
    }

    setSaving(true);
    try {
      const teamRoles = valid;
      const roleTotal = teamRoles.reduce((s, r) => s + r.count, 0);
      // Roles fill the seats She Model Tech approved (people besides the lead).
      if (fixedSize && roleTotal > fixedSize) {
        toast.error(`Your roles add up to ${roleTotal}, but this project has ${fixedSize} ${fixedSize === 1 ? 'place' : 'places'} besides you. Ask She Model Tech for more people, or reduce a role.`);
        setSaving(false);
        return;
      }
      const roleSlots = fixedSize || roleTotal;
      const maxTeamSize = roleSlots + 1;

      await updateDoc(doc(db, 'projects', projectId), {
        ...(coreLock ? {} : { projectTitle: form.projectTitle.trim(), projectDescription: form.projectDescription.trim() }),
        leadDetails: leadDetails.trim(),
        roleTracks,
        projectGoals: form.projectGoals.trim() || null,
        industryTrack: form.industryTrack,
        ...(datesLocked ? {} : { startDate: form.startDate, endDate: form.endDate }),
        projectLink: form.projectLink.trim(),
        resources: { ...(form.submissionUrl ? { submissionUrl: form.submissionUrl.trim() } : {}) },
        teamRoles,
        ...(fixedSize ? {} : { maxTeamSize, roleSlots }),
        ...(isPaid ? { totalBudget: computeTotalBudget(teamRoles) } : {}),
        status: 'active',
        // Only stamp openedAt on first open; keep the original on later edits.
        ...(isEditing ? {} : { openedAt: serverTimestamp() }),
        updatedAt: serverTimestamp(),
      });
      toast.success(isEditing ? 'Project updated.' : 'Project is now open for applications!');
      navigate(`/projects/${projectId}`);
    } catch (e) {
      console.error(e);
      toast.error(isEditing ? 'Could not save changes.' : 'Could not open the project.');
    }
    setSaving(false);
  };

  const handleSaveExit = async () => {
    if (isPaid && newPaidRoleMissingPay()) { toast.error('Set a pay-per-person amount (greater than 0) for each new role.'); return; }
    setSaving(true);
    try {
      const teamRoles = buildTeamRoles();
      await updateDoc(doc(db, 'projects', projectId), {
        ...(coreLock ? {} : { projectTitle: form.projectTitle.trim(), projectDescription: form.projectDescription.trim() }),
        roleTracks,
        leadDetails: leadDetails.trim(),
        projectGoals: form.projectGoals.trim() || null,
        industryTrack: form.industryTrack,
        // Keep every detail the lead edited, not just the brief, so a saved
        // draft doesn't silently drop new dates or links.
        ...(!datesLocked && form.startDate ? { startDate: form.startDate } : {}),
        ...(!datesLocked && form.endDate ? { endDate: form.endDate } : {}),
        ...(form.projectLink.trim() ? { projectLink: form.projectLink.trim() } : {}),
        ...(form.submissionUrl.trim() ? { resources: { submissionUrl: form.submissionUrl.trim() } } : {}),
        proposedRoles: teamRoles, // keep draft in proposedRoles until opened
        updatedAt: serverTimestamp(),
      });
      toast.success('Progress saved. Open it when you\'re ready.');
      navigate(`/projects/${projectId}`);
    } catch (e) {
      console.error(e);
      toast.error('Could not save.');
    }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div></div>;

  // Paid cohort: everything is fixed by She Model Tech. The lead can only open
  // the project for applications.
  if (paidLock) {
    const openProject = async () => {
      setSaving(true);
      try {
        await updateDoc(doc(db, 'projects', projectId), { status: 'active', openedAt: serverTimestamp(), updatedAt: serverTimestamp() });
        toast.success('Project is now open for applications!');
        navigate(`/projects/${projectId}`);
      } catch (e) {
        toast.error('Could not open the project.');
      }
      setSaving(false);
    };
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">{form.projectTitle}</h1>
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-gray-800">
          <strong>Paid cohort project.</strong> She Model Tech has set the brief, roles, number of people, pay, and dates.
          You can choose the badge tracks you want for each role and add more details for your team.
          Need more time? Use <strong>Request extra time</strong> in your workspace.
        </div>
        <div className="mt-5 bg-white border border-gray-200 rounded-2xl p-5 space-y-3 text-sm text-gray-800">
          <p className="whitespace-pre-wrap">{form.projectDescription}</p>
          <p><strong>Dates:</strong> {form.startDate} to {form.endDate}</p>
          <div>
            <strong>Roles:</strong>
            <ul className="list-disc pl-5 mt-1">
              {roles.filter((r) => resolveRoleName(r)).map((r, i) => (
                <li key={i}>{resolveRoleName(r)} · {r.count || 1} {Number(r.count) === 1 ? 'person' : 'people'}{r.payAmount ? ` · $${r.payAmount} each` : ''}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-5 bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
          <div>
            <p className="text-sm font-bold text-gray-900">Badge tracks you want for each role</p>
            <p className="text-xs text-gray-500 mb-2">Applicants pick one of these. No badge is awarded on paid projects; it shows your team’s strength.</p>
            {roles.filter((r) => resolveRoleName(r)).map((r) => {
              const name = resolveRoleName(r);
              const current = roleTracks[name] || r.wantedTracks || [];
              return (
                <div key={name} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-1.5 text-xs border-t border-gray-100 first:border-t-0">
                  <span className="font-semibold text-gray-900 w-full sm:w-40 truncate">{name}</span>
                  {BADGE_TRACKS.map((t) => (
                    <label key={t.key} className="flex items-center gap-1">
                      <input type="checkbox" checked={current.includes(t.key)}
                        onChange={(e) => setRoleTracks((m) => ({ ...m, [name]: e.target.checked ? [...current, t.key] : current.filter((k) => k !== t.key) }))} />
                      {t.name}
                    </label>
                  ))}
                </div>
              );
            })}
          </div>
          <div>
            <label className="text-sm font-bold text-gray-900" htmlFor="lead-details">More about this project <span className="font-normal text-gray-500">(optional, from you as the lead)</span></label>
            <p className="text-xs text-gray-500 mb-1">Add plans, tools, milestones, or anything that helps applicants. The brief from She Model Tech stays as it is.</p>
            <textarea id="lead-details" rows={5} maxLength={4000} value={leadDetails} onChange={(e) => setLeadDetails(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <button
            onClick={async () => {
              setSaving(true);
              try {
                await updateDoc(doc(db, 'projects', projectId), { roleTracks, leadDetails: leadDetails.trim(), updatedAt: serverTimestamp() });
                toast.success('Saved.');
              } catch (e) { toast.error('Could not save.'); }
              setSaving(false);
            }}
            disabled={saving}
            className="bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60"
          >
            Save tracks and details
          </button>
        </div>
        <div className="mt-5 flex gap-2">
          {projectStatus !== 'active' && (
            <button onClick={openProject} disabled={saving} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">
              {saving ? 'Opening...' : 'Open for applications'}
            </button>
          )}
          <button onClick={() => navigate(`/projects/${projectId}`)} className="border border-gray-300 text-sm font-semibold px-5 py-2.5 rounded-lg">Back to project</button>
        </div>
      </div>
    );
  }
  if (!authorized) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{isEditing ? 'Edit your project' : 'Set up your project'}</h1>
      <p className="text-gray-500 text-sm mb-6">{isEditing ? "You're the lead. Update the project details, goals, dates, links, and roles below. Changes apply immediately." : "You're the lead. Review this project carefully and modify it so you fully understand what you're leading. Refine the idea, set the start and end dates, add the submission and full-description links, decide what roles your team needs (add at least one role), then open it for others to apply. You manage the project, and team members fill the building roles below."}</p>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-5">
        <div>
          <label className={labelClass}>Project Title *</label>
          <input type="text" value={form.projectTitle} disabled={coreLock} onChange={e => setForm(p => ({ ...p, projectTitle: e.target.value }))} className={inputClass + (coreLock ? ' opacity-60 cursor-not-allowed' : '')} />
        </div>
        <div>
          <label className={labelClass}>Description *</label>
          <textarea rows={4} value={form.projectDescription} disabled={coreLock} onChange={e => setForm(p => ({ ...p, projectDescription: e.target.value }))} className={inputClass + (coreLock ? ' opacity-60 cursor-not-allowed' : '')} />
          <label className="block text-sm font-semibold text-gray-800 mt-4 mb-1" htmlFor="lead-details-free">More about this project <span className="font-normal text-gray-500">(optional, from the lead)</span></label>
          <textarea id="lead-details-free" rows={4} maxLength={4000} value={leadDetails} onChange={(e) => setLeadDetails(e.target.value)} className={inputClass} placeholder="Plans, tools, milestones, or anything that helps your team." />
          {coreLock && <p className="text-xs text-gray-500 mt-1">The title, description, and dates are set by She Model Tech. Need a change? Message She Model Tech.</p>}
        </div>
        <div>
          <label className={labelClass}>Goals</label>
          <textarea rows={2} value={form.projectGoals} onChange={e => setForm(p => ({ ...p, projectGoals: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Industry</label>
          <select value={form.industryTrack} onChange={e => setForm(p => ({ ...p, industryTrack: e.target.value }))} className={inputClass + ' appearance-none'}>
            {industryTracks.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Start date <span className="text-red-500">*</span></label>
            <input type="date" value={form.startDate} min={datesLocked ? undefined : minStartDate(originalStart)} disabled={datesLocked} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className={inputClass + (datesLocked ? ' opacity-60 cursor-not-allowed' : '')} />
          </div>
          <div>
            <label className={labelClass}>End date <span className="text-red-500">*</span></label>
            <input type="date" value={form.endDate} min={datesLocked ? undefined : minEndDate(form.startDate)} disabled={datesLocked} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} className={inputClass + (datesLocked ? ' opacity-60 cursor-not-allowed' : '')} />
          </div>
          {cohortLock && (
            <p className="sm:col-span-2 text-xs text-gray-600">
              This is a cohort project: everyone starts and finishes together, so She Model Tech sets the dates. Need more
              time? Use <strong>Request extra time</strong> in your project workspace.
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Project submission link <span className="text-red-500">*</span></label>
          <input type="url" value={form.submissionUrl} onChange={e => setForm(p => ({ ...p, submissionUrl: e.target.value }))} className={inputClass} placeholder="https://github.com/... (a folder with all the work, team, and final solutions)" />
          <p className="text-gray-400 text-xs mt-1">A GitHub repo is recommended (free). This is the folder your team's work lives in and what gets reviewed.</p>
        </div>

        <div>
          <label className={labelClass}>Project link (full description) <span className="text-red-500">*</span></label>
          <input type="url" value={form.projectLink} onChange={e => setForm(p => ({ ...p, projectLink: e.target.value }))} className={inputClass} placeholder="https://docs.google.com/... (a doc, slides, etc. fully describing the project)" />
          <p className="text-gray-400 text-xs mt-1">A full description of the project: Google Doc, a .docx, a slide deck, etc. So everyone understands what is being built.</p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Team Roles</h2>
          {(!fixedSize || roles.reduce((n, r) => n + (resolveRoleName(r) ? (parseInt(r.count, 10) || 0) : 0), 0) < fixedSize) && (
            <button onClick={addRole} className="text-pink-600 text-sm font-semibold">+ Add role</button>
          )}
        </div>

        <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
          <p className="text-gray-700 text-xs"><strong>No solo projects:</strong> a project needs a team of at least {MIN_TEAM_SIZE}. You count as one, so your roles must add up to at least {MIN_MEMBERS} {MIN_MEMBERS === 1 ? 'person' : 'people'} besides you.</p>
        </div>

        {fixedSize && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-gray-800 text-xs">
              <strong>{fixedSize + 1} people on this project, including you</strong>, set by She Model Tech: {fixedSize} {fixedSize === 1 ? 'place' : 'places'} for your team.
              Roles so far: <strong>{roles.reduce((n, r) => n + (resolveRoleName(r) ? (parseInt(r.count, 10) || 0) : 0), 0)} of {fixedSize}</strong>.
              {fixedPay != null && <> Pay is ${fixedPay} per person for every role.</>}
            </p>
            {isPaid && (
              sizeRequest?.status === 'pending' ? (
                <p className="text-xs text-amber-800 mt-2">You asked for {sizeRequest.extra} more {Number(sizeRequest.extra) === 1 ? 'person' : 'people'}. She Model Tech will let you know.</p>
              ) : !askMore.open ? (
                <button type="button" onClick={() => setAskMore((a) => ({ ...a, open: true }))} className="mt-2 text-xs font-semibold text-pink-700 underline">
                  Need more people? Ask She Model Tech
                </button>
              ) : (
                <div className="mt-2 flex flex-wrap items-end gap-2">
                  <label className="text-xs text-gray-700">How many more
                    <input type="number" min="1" max="10" value={askMore.extra} onChange={(e) => setAskMore((a) => ({ ...a, extra: e.target.value }))} className="block w-20 mt-1 px-2 py-1.5 rounded-lg border border-gray-300 text-sm" />
                  </label>
                  <label className="text-xs text-gray-700 flex-1 min-w-[12rem]">Why
                    <input value={askMore.reason} maxLength={300} onChange={(e) => setAskMore((a) => ({ ...a, reason: e.target.value }))} placeholder="For example: we need a second tester for the release." className="block w-full mt-1 px-2 py-1.5 rounded-lg border border-gray-300 text-sm" />
                  </label>
                  <button
                    type="button"
                    onClick={async () => {
                      const extra = Math.max(1, Math.min(10, parseInt(askMore.extra, 10) || 1));
                      if (askMore.reason.trim().length < 10) { toast.error('Tell She Model Tech briefly why you need more people.'); return; }
                      const req = { extra, reason: askMore.reason.trim(), status: 'pending', at: new Date().toISOString(), by: currentUser.uid };
                      try {
                        await updateDoc(doc(db, 'projects', projectId), { sizeRequest: req, updatedAt: serverTimestamp() });
                        setSizeRequest(req);
                        setAskMore({ open: false, extra: 1, reason: '' });
                        alertStaff({ type: 'size_request', title: 'A lead asked for more people', body: `"${form.projectTitle}": ${extra} more. ${req.reason}`, link: '/admin/projects', roles: ['admin', 'editor'] });
                        toast.success('Request sent. She Model Tech will let you know.');
                      } catch (e) {
                        toast.error('Could not send the request.');
                      }
                    }}
                    className="text-xs font-semibold bg-pink-600 text-white px-3 py-2 rounded-lg"
                  >
                    Send request
                  </button>
                </div>
              )
            )}
          </div>
        )}

        {isPaid ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-gray-700 text-xs"><strong>Paid project:</strong> roles you've already posted are locked, including their pay - talent may have applied under those exact terms. You can still <strong>add new roles</strong> below, each with its own pay-per-person amount.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-xs -mt-2">Intermediate and Advanced roles can only be filled by members who've earned the matching badge level in that track. Use Beginner or Any Level for roles open to newcomers.</p>
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
              <p className="text-gray-700 text-xs"><strong>Note:</strong> add or remove roles to fit your project. Keep at least one Beginner or Any Level role so newcomers can join.</p>
            </div>
          </>
        )}

        {roles.map((r, i) => {
          const locked = isLocked(r);
          const roleName = resolveRoleName(r) || 'Role';
          if (locked) {
            // Locked (already-posted) paid role - read-only summary, no edits.
            return (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 opacity-90">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-xs font-semibold">Role {i + 1}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-2 py-0.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Locked
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="text-gray-900 font-semibold text-sm">{roleName}</span>
                  <span className="text-amber-700 font-bold text-sm">{formatMoney(Number(r.payAmount) || 0)} / person</span>
                  <span className="text-gray-500 text-xs">{parseInt(r.count, 10) || 1} {(parseInt(r.count, 10) || 1) === 1 ? 'person' : 'people'}</span>
                  <span className="text-gray-500 text-xs capitalize">{(r.experienceLevel || 'any-level') === 'any-level' ? 'Any Level' : r.experienceLevel}</span>
                </div>
                {r.skills && <p className="text-gray-500 text-xs mt-1">Skills: {r.skills}</p>}
                {r.description && <p className="text-gray-500 text-xs mt-1">{r.description}</p>}
              </div>
            );
          }
          // Editable role (all free-project roles, and new paid roles)
          return (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs font-semibold">Role {i + 1}{isPaid ? ' (new)' : ''}</span>
                {roles.length > 1 && <button onClick={() => removeRole(i)} className="text-red-500 text-xs font-semibold">Remove</button>}
              </div>
              <div className={`grid grid-cols-1 gap-3 ${isPaid ? 'sm:grid-cols-5' : 'sm:grid-cols-4'}`}>
                {r.role === '__other__' ? (
                  <div className="flex gap-1">
                    <input type="text" value={r.customRole || ''} onChange={e => updateRole(i, 'customRole', e.target.value)} className={inputClass} placeholder="Enter custom role" />
                    <button type="button" onClick={() => { updateRole(i, 'role', ''); updateRole(i, 'customRole', ''); }} className="text-gray-400 hover:text-gray-600 text-xs px-2 flex-shrink-0">✕</button>
                  </div>
                ) : (
                  <select value={r.role} onChange={e => updateRole(i, 'role', e.target.value)} className={inputClass + ' appearance-none'}>
                    <option value="">Select role</option>
                    {roleTemplates.map(o => <option key={o} value={o}>{o}</option>)}
                    <option value="__other__">Other (type your own)</option>
                  </select>
                )}
                <select value={r.experienceLevel} onChange={e => updateRole(i, 'experienceLevel', e.target.value)} className={inputClass + ' appearance-none capitalize'}>
                  {experienceLevels.map(l => <option key={l} value={l}>{l === 'any-level' ? 'Any Level' : l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                </select>
                <input type="number" min="1" max="10" value={r.count} onChange={e => updateRole(i, 'count', e.target.value)} className={inputClass} placeholder="Count" />
                <input type="text" value={r.skills} onChange={e => updateRole(i, 'skills', e.target.value)} className={inputClass} placeholder="Skills * (e.g., React, Node)" />
                {isPaid && fixedPay == null && (
                  <input type="number" min="1" step="0.01" value={r.payAmount} onChange={e => updateRole(i, 'payAmount', e.target.value)} className={inputClass} placeholder="Pay / person ($)" />
                )}
              </div>
              {isPaid && resolveRoleName(r) && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-700">
                  <span className="font-semibold">Badge tracks wanted:</span>
                  {BADGE_TRACKS.map((t) => {
                    const name = resolveRoleName(r);
                    const cur = roleTracks[name] || [];
                    return (
                      <label key={t.key} className="flex items-center gap-1">
                        <input type="checkbox" checked={cur.includes(t.key)}
                          onChange={(e) => setRoleTracks((m) => ({ ...m, [name]: e.target.checked ? [...cur, t.key] : cur.filter((k) => k !== t.key) }))} />
                        {t.name}
                      </label>
                    );
                  })}
                </div>
              )}
              <input type="text" value={r.description} onChange={e => updateRole(i, 'description', e.target.value)} className={inputClass} placeholder="What this role does (optional)" />
            </div>
          );
        })}

        {isPaid && roles.some(r => !isLocked(r) && resolveRoleName(r) && parseFloat(r.payAmount) > 0) && (
          <div className="flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Projected total budget</span>
            <span className="text-amber-700 text-xl font-black">{formatMoney(computeTotalBudget(buildTeamRoles()))}</span>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={handleOpen} disabled={saving} className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-all disabled:opacity-50">
          {saving ? (isEditing ? 'Saving…' : 'Opening…') : (isEditing ? 'Save changes' : 'Open for Applications')}
        </button>
        <button onClick={handleSaveExit} disabled={saving} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm px-5 py-3 rounded-lg transition-all">
          Save & Exit
        </button>
      </div>
    </div>
  );
};

export default ProjectSetup;
