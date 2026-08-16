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

const industryTracks = [
  'healthcare', 'finance', 'education', 'ecommerce', 'entertainment', 'government',
  'technology', 'cybersecurity', 'transportation', 'realestate', 'energy',
  'agriculture', 'manufacturing', 'legal', 'nonprofit', 'travel', 'sports',
  'food', 'fashion', 'construction', 'marketing',
];
const roleTemplates = ROLE_TEMPLATES;
const experienceLevels = EXPERIENCE_LEVELS;

const inputClass = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:border-blue-500 focus:outline-none transition-all";
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

        // Only the confirmed lead / owner can set up / edit the project
        if (data.submitterId !== currentUser.uid) {
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

        setForm({
          projectTitle: data.projectTitle || '',
          projectDescription: data.projectDescription || '',
          projectGoals: data.projectGoals || '',
          industryTrack: data.industryTrack || 'technology',
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          submissionUrl: data.resources?.submissionUrl || '',
          projectLink: data.projectLink || '',
        });
        // Pre-fill roles: use live teamRoles if published, else the generator's proposal.
        // Live teamRoles are "existing" (locked for paid); a fresh proposal is not.
        const liveRoles = alreadyActive && Array.isArray(data.teamRoles) && data.teamRoles.length;
        const sourceRoles = liveRoles
          ? data.teamRoles
          : (Array.isArray(data.proposedRoles) ? data.proposedRoles : []);
        setRoles(sourceRoles.length
          ? sourceRoles.map(r => toEditableRole(r, !!liveRoles))
          : [emptyRole()]);
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
      payAmount: isPaid ? (parseFloat(r.payAmount) || 0) : 0,
    }))
    .filter(r => r.role && r.count > 0);

  // Validate that every NEW paid role has a pay-per-person amount.
  const newPaidRoleMissingPay = () => isPaid && roles.some(r => {
    if (isLocked(r)) return false;               // existing roles keep their amount
    if (!resolveRoleName(r)) return false;        // blank rows are dropped, not flagged
    return !(parseFloat(r.payAmount) > 0);
  });

  const handleOpen = async () => {
    if (!form.projectTitle.trim()) { toast.error('Title is required'); return; }
    if (!form.projectDescription.trim()) { toast.error('Description is required'); return; }
    if (!form.startDate) { toast.error('Start date is required'); return; }
    if (!form.endDate) { toast.error('End date is required'); return; }
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
      const maxTeamSize = teamRoles.reduce((s, r) => s + r.count, 0);

      await updateDoc(doc(db, 'projects', projectId), {
        projectTitle: form.projectTitle.trim(),
        projectDescription: form.projectDescription.trim(),
        projectGoals: form.projectGoals.trim() || null,
        industryTrack: form.industryTrack,
        startDate: form.startDate,
        endDate: form.endDate,
        projectLink: form.projectLink.trim(),
        resources: { ...(form.submissionUrl ? { submissionUrl: form.submissionUrl.trim() } : {}) },
        teamRoles,
        maxTeamSize,
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
        projectTitle: form.projectTitle.trim(),
        projectDescription: form.projectDescription.trim(),
        projectGoals: form.projectGoals.trim() || null,
        industryTrack: form.industryTrack,
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

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  if (!authorized) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{isEditing ? 'Edit your project' : 'Set up your project'}</h1>
      <p className="text-gray-500 text-sm mb-6">{isEditing ? "You're the lead. Update the project details, goals, dates, links, and roles below. Changes apply immediately." : "You're the lead. Review this project carefully and modify it so you fully understand what you're leading. Refine the idea, set the start and end dates, add the submission and full-description links, decide what roles your team needs (add at least one role), then open it for others to apply. You manage the project, and team members fill the building roles below."}</p>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-5">
        <div>
          <label className={labelClass}>Project Title *</label>
          <input type="text" value={form.projectTitle} onChange={e => setForm(p => ({ ...p, projectTitle: e.target.value }))} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Description *</label>
          <textarea rows={4} value={form.projectDescription} onChange={e => setForm(p => ({ ...p, projectDescription: e.target.value }))} className={inputClass} />
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
            <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>End date <span className="text-red-500">*</span></label>
            <input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} className={inputClass} />
          </div>
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
          <button onClick={addRole} className="text-blue-600 text-sm font-semibold">+ Add role</button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-gray-700 text-xs"><strong>No solo projects:</strong> a project needs a team of at least {MIN_TEAM_SIZE}. You count as one, so your roles must add up to at least {MIN_MEMBERS} {MIN_MEMBERS === 1 ? 'person' : 'people'} besides you.</p>
        </div>

        {isPaid ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-gray-700 text-xs"><strong>Paid project:</strong> roles you've already posted are locked, including their pay - talent may have applied under those exact terms. You can still <strong>add new roles</strong> below, each with its own pay-per-person amount.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-xs -mt-2">Intermediate and Advanced roles can only be filled by members who've earned the matching badge level in that track. Use Beginner or Any Level for roles open to newcomers.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
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
                {isPaid && (
                  <input type="number" min="1" step="0.01" value={r.payAmount} onChange={e => updateRole(i, 'payAmount', e.target.value)} className={inputClass} placeholder="Pay / person ($)" />
                )}
              </div>
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
        <button onClick={handleOpen} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-all disabled:opacity-50">
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
