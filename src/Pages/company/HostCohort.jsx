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
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { createCompanyCohort,
  createCompanyProject, canHostCohort } from '../../utils/companyCohorts';
import { formatMoney } from '../../utils/paidProjects';
import { notifyMember } from '../../utils/staffAlerts';
import { checkDates, minEndDate, todayISO } from '../../utils/dateRules';
import { useFeatures } from '../../utils/features';

const blankRole = () => ({ title: '', count: 1, payAmount: '', skills: '' });

const HostCohort = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Optional prefill (?title=&description=&role=), e.g. assistant roles on a training contract.
  const qs = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const [title, setTitle] = useState(qs.get('title') || '');
  const [description, setDescription] = useState(qs.get('description') || '');
  const [startDate, setStartDate] = useState(qs.get('start') || '');
  const [endDate, setEndDate] = useState(qs.get('end') || '');
  const features = useFeatures();
  const [roles, setRoles] = useState([qs.get('role') ? { ...blankRole(), title: qs.get('role') } : blankRole()]);
  // What kind of paid work: one project, a cohort (several projects that start
  // and finish together), or freelance (one person).
  const groupFromLink = qs.get('group');
  const [kind, setKind] = useState(groupFromLink ? 'cohort' : 'project');
  const [groupId] = useState(groupFromLink || `g${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`);
  const [created, setCreated] = useState(null);
  // Optional lead: members apply for the Project Lead role and you approve them,
  // like any role. You stay in the workspace either way.
  const [hireLead, setHireLead] = useState(false);
  const [leadPay, setLeadPay] = useState('');

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
    // Joining an existing company cohort keeps that cohort's dates.
    if (!groupFromLink) {
      const dateErr = checkDates({ start: startDate, end: endDate, requireStart: false });
      if (dateErr) {
        toast.error(dateErr);
        return;
      }
    }
    setSaving(true);
    try {
      const id = await createCompanyProject({
        company: profile,
        title,
        description,
        startDate,
        endDate,
        roles: [
          ...(hireLead && kind !== 'freelance' ? [{ title: 'Project Lead', count: 1, payAmount: leadPay, skills: 'Leading the team, planning, and delivery' }] : []),
          ...(kind === 'freelance' ? roles.slice(0, 1) : roles),
        ].map((r) => ({
          title: r.title.trim(),
          count: kind === 'freelance' ? 1 : parseInt(r.count, 10) || 1,
          payAmount: Number(r.payAmount) || 0,
          skills: r.skills.trim(),
        })),
        kind,
        cohortGroupId: kind === 'cohort' ? groupId : null,
      });
      toast.success('Your project is live. Applications are open.');
      // Opened from a training contract: link it so the request shows it's done.
      if (qs.get('orgRequest')) {
        // Training workspace: link it to the request, and add the organization's
        // contact and the assigned trainers so the conversation happens here.
        try {
          const reqSnap = await getDoc(doc(db, 'org_requests', qs.get('orgRequest')));
          const req = reqSnap.exists() ? reqSnap.data() : {};
          const observers = [...new Set([req.requesterUid, ...(req.assignedMentorUids || [])].filter(Boolean))];
          await updateDoc(doc(db, 'projects', id), {
            trainingRequestId: qs.get('orgRequest'),
            observers,
            observerInfo: [
              ...(req.requesterUid ? [{ uid: req.requesterUid, name: req.contactName || req.orgName, label: `${req.orgName} (organization)` }] : []),
              ...(req.assignedMentors || []).map((m) => ({ uid: m.uid, name: m.name, label: 'Trainer' })),
            ],
          });
          await updateDoc(doc(db, 'org_requests', qs.get('orgRequest')), { assistantProjectId: id, workspaceProjectId: id });
          observers.forEach((uid) =>
            notifyMember(uid, {
              type: 'training_workspace',
              title: `Workspace ready: ${req.orgName || 'your training'}`,
              body: 'We’ve opened a project workspace for this training. Use its Discussion to talk with the She Model Tech team, trainers, and assistants.',
              link: `/projects/${id}/workspace`,
              ctaLabel: 'Open the workspace',
            })
          );
        } catch (_) {
          /* non-blocking */
        }
      }
      if (kind === 'cohort') setCreated(id);
      else navigate(`/projects/${id}`);
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
        <button
          onClick={() => navigate('/settings')}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-6 py-3 rounded-lg"
        >
          Complete company verification
        </button>
      </div>
    );
  }

  // Only She Model Tech staff post projects (free and paid). Companies don't
  // run projects; Partner and Champion companies can propose a challenge.
  if (!['admin', 'editor'].includes(profile?.role)) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900">Projects are run by She Model Tech</h1>
        <p className="text-gray-600 mt-2">
          She Model Tech designs and runs every project, free and paid, and pays members on paid projects. Companies
          on the Partner and Champion tiers can propose a real challenge for a future cohort.
        </p>
        <a href="/premium" className="inline-block mt-5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
          See company tiers
        </a>
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

      {created && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="font-semibold text-emerald-800">Project added to your cohort.</p>
          <p className="text-sm text-gray-700 mt-1">Add another project with the same dates, or view the one you just posted.</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <a href={`/projects/new-paid?group=${groupId}&start=${startDate}&end=${endDate}`} className="text-sm font-semibold bg-pink-600 text-white px-4 py-2 rounded-lg">Add another project to this cohort</a>
            <button onClick={() => navigate(`/projects/${created}`)} className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg">View the project</button>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6" role="tablist" aria-label="Post a project">
        <span role="tab" aria-selected="true" className="text-sm font-semibold px-4 py-2 rounded-full bg-gray-900 text-white">Post a paid project</span>

      </div>

      <fieldset className="mb-6">
        <legend className="block text-sm font-bold text-gray-900 mb-2">What are you posting?</legend>
        <div className="grid sm:grid-cols-3 gap-2">
          {[
            ['project', 'Paid project', 'A team builds one project.'],
            ['cohort', 'Paid cohort', 'Several projects that start and finish together.'],
            ['freelance', 'Freelance', 'Hire exactly one person, no team.'],
          ].map(([k, l, d]) => (
            <button key={k} type="button" aria-pressed={kind === k} disabled={!!groupFromLink && k !== 'cohort'}
              onClick={() => { setKind(k); if (k === 'freelance') setRoles((rs) => [{ ...rs[0], count: 1 }]); }}
              className={`text-left rounded-xl border p-3 ${kind === k ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white'} disabled:opacity-40`}>
              <span className="block text-sm font-semibold text-gray-900">{l}</span>
              <span className="block text-xs text-gray-600">{d}</span>
            </button>
          ))}
        </div>
        {kind === 'cohort' && (
          <p className="text-xs text-gray-600 mt-2">
            Post each project in the cohort one at a time with the same dates. After posting, choose <strong>Add another project to this cohort</strong>.
          </p>
        )}
      </fieldset>

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
            min={todayISO()}
            disabled={!!groupFromLink}
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
            min={minEndDate(startDate)}
            disabled={!!groupFromLink}
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
          <div className="flex flex-wrap gap-2 mb-2">
            <input
              value={r.title}
              onChange={(e) => setRole(i, 'title', e.target.value)}
              placeholder="Role, e.g. Frontend Developer"
              className="flex-1 min-w-[10rem] px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
            />
            <input
              type="number"
              min="1"
              disabled={kind === 'freelance'}
              value={kind === 'freelance' ? 1 : r.count}
              onChange={(e) => setRole(i, 'count', e.target.value)}
              className="w-16 shrink-0 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="number"
              min="1"
              value={r.payAmount}
              onChange={(e) => setRole(i, 'payAmount', e.target.value)}
              placeholder="Pay per person (USD)"
              className="w-full sm:w-48 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
            />
            <input
              value={r.skills}
              onChange={(e) => setRole(i, 'skills', e.target.value)}
              placeholder="Skills (optional)"
              className="flex-1 min-w-[10rem] px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-pink-500"
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
      {kind !== 'freelance' && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
          <label className="flex items-start gap-2 text-sm text-gray-800">
            <input type="checkbox" className="mt-1" checked={hireLead} onChange={(e) => setHireLead(e.target.checked)} />
            <span>
              <strong>Hire a project lead</strong>
              <span className="block text-xs text-gray-500">Members apply to lead; you approve. The lead runs the team, and you stay in the workspace.</span>
            </span>
          </label>
          {hireLead && (
            <label className="block mt-3 text-xs font-semibold text-gray-700">Lead’s pay (USD)
              <input type="number" min="1" value={leadPay} onChange={(e) => setLeadPay(e.target.value)} className="block mt-1 w-40 px-3 py-2 rounded-lg border border-gray-300 text-sm" />
            </label>
          )}
        </div>
      )}
      {kind !== 'freelance' ? (
        <button
          type="button"
          onClick={() => setRoles((rs) => [...rs, blankRole()])}
          className="text-pink-600 text-sm font-semibold hover:underline mb-8"
        >
          + Add another role
        </button>
      ) : (
        <p className="text-xs text-gray-600 mb-8">Freelance projects hire exactly one person for one role.</p>
      )}

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
