// src/components/admin/OrgRequestsTab.jsx
// Admin > Organizations: training contract and licensing requests, trainer
// approvals, and mentor assignments.
import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase/config';
import { notifyMember } from '../../utils/staffAlerts';
import { Link } from 'react-router-dom';
import { ORG_TYPES, REQUEST_TYPES, STATUS_LABELS, STATUS_MESSAGES, TRAINER_CRITERIA, createOrganization, getOrganization, listOrgRequests, shareEdition, statusesFor, updateOrgRequest, updateOrganization } from '../../utils/organizations';
import { coursesForTrack, tracksWithCourses } from '../../utils/foundationsCourses';
import { listPublished, toCatalogCourse } from '../../utils/learningPublished';
import { listTeacherCourses } from '../../utils/teacherCourses';
import { useAuth } from '../../context/AuthContext';

// Manage the organization created from a licensing request: invite link,
// licensed courses, instructor editions, and whether learners under 18 may join.
const OrgManager = ({ request, onCreated }) => {
  const { currentUser } = useAuth();
  const [org, setOrg] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [hub, setHub] = useState([]);
  useEffect(() => {
    if (request.organizationId) getOrganization(request.organizationId).then(setOrg).catch(() => {});
  }, [request.organizationId]);
  useEffect(() => {
    if (!org) return;
    const builtIn = tracksWithCourses().filter((t) => t !== 'company').flatMap((t) => coursesForTrack(t).map((c) => ({ track: t, slug: c.slug, title: c.title })));
    listPublished().then((l) => setCatalog([...builtIn, ...l.map(toCatalogCourse).map((c) => ({ track: c.track, slug: c.slug, title: c.title }))])).catch(() => setCatalog(builtIn));
    listTeacherCourses().then((l) => setHub(l.filter((c) => !c.published))).catch(() => {});
  }, [org]);

  const create = async () => {
    const emails = window.prompt('Email address(es) of the organization’s admins or instructors (they need She Model Tech accounts). Separate with commas.', request.contactEmail || '');
    if (!emails) return;
    const uids = [];
    for (const em of emails.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)) {
      const snap = await getDocs(query(collection(db, 'users'), where('email', '==', em))).catch(() => null);
      if (snap && !snap.empty) uids.push(snap.docs[0].id);
      else toast.error(`No account found for ${em}. Ask them to sign up first.`);
    }
    if (!uids.length) return;
    try {
      const id = await createOrganization(request, uids, currentUser);
      uids.forEach((uid) => notifyMember(uid, { type: 'org_created', title: `${request.orgName} is set up on She Model Tech`, body: 'Open your organization dashboard to invite your learners.', link: `/org/${id}` }));
      toast.success('Organization created.');
      onCreated(id);
    } catch (e) {
      toast.error('Could not create the organization.');
    }
  };

  if (!request.organizationId) {
    return <button onClick={create} className="text-xs font-semibold bg-indigo-600 text-white px-3 py-1.5 rounded-lg">Create organization and invite link</button>;
  }
  if (!org) return <p className="text-xs text-gray-500">Loading organization...</p>;
  const save = async (data) => {
    await updateOrganization(org.id, data);
    setOrg({ ...org, ...data });
  };
  const inviteUrl = `${window.location.origin}/join/${org.inviteCode}`;
  return (
    <div className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50/40 p-3 space-y-2 text-sm">
      <p className="font-semibold text-gray-900">
        Organization · <Link to={`/org/${org.id}`} className="text-indigo-700 hover:underline">Open dashboard</Link>
      </p>
      <p className="text-xs text-gray-600 break-all">Invite link: {inviteUrl}</p>
      <label className="flex items-center gap-2 text-xs text-gray-700">
        <input type="checkbox" checked={!!org.allowMinors} onChange={(e) => save({ allowMinors: e.target.checked })} />
        Allow learners aged 13 to 17 (the school confirms guardian consent)
      </label>
      <div>
        <p className="text-xs font-semibold text-gray-700">Licensed courses</p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {(org.courses || []).map((c) => (
            <span key={c.slug} className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5">
              {c.title} <button onClick={() => save({ courses: org.courses.filter((x) => x.slug !== c.slug) })} aria-label={`Remove ${c.title}`}>×</button>
            </span>
          ))}
        </div>
        <select value="" onChange={(e) => { const c = catalog.find((x) => x.slug === e.target.value); if (c && !(org.courses || []).some((x) => x.slug === c.slug)) save({ courses: [...(org.courses || []), c] }); }}
          className="mt-1 text-xs border border-gray-300 rounded-lg px-2 py-1 max-w-full">
          <option value="">Add a course...</option>
          {catalog.map((c) => <option key={c.track + c.slug} value={c.slug}>{c.title}</option>)}
        </select>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-700">Instructor editions (Mentor Hub, for mentors)</p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {hub.filter((c) => (org.editionIds || []).includes(c.id)).map((c) => (
            <span key={c.id} className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5">
              {c.title} <button onClick={async () => { await shareEdition(org, c.id, false); setOrg({ ...org, editionIds: org.editionIds.filter((x) => x !== c.id) }); }} aria-label={`Stop sharing ${c.title}`}>×</button>
            </span>
          ))}
        </div>
        <select value="" onChange={async (e) => { const id = e.target.value; if (!id || (org.editionIds || []).includes(id)) return; await shareEdition(org, id, true); setOrg({ ...org, editionIds: [...(org.editionIds || []), id] }); toast.success('Shared with the organization’s instructors.'); }}
          className="mt-1 text-xs border border-gray-300 rounded-lg px-2 py-1 max-w-full">
          <option value="">Share an instructor edition...</option>
          {hub.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
    </div>
  );
};

const OrgRequestsTab = ({ isAdmin }) => {
  const [reqs, setReqs] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [pendingTrainers, setPendingTrainers] = useState([]);
  const [filter, setFilter] = useState('open');

  const load = async () => {
    listOrgRequests()
      .then(async (list) => {
        // A training workspace that has completed (work done, payments confirmed)
        // closes its request automatically.
        const updated = await Promise.all(
          list.map(async (r) => {
            if (!r.workspaceProjectId || ['completed', 'ended', 'declined'].includes(r.status)) return r;
            try {
              const p = await getDoc(doc(db, 'projects', r.workspaceProjectId));
              if (p.exists() && p.data().status === 'completed') {
                await updateOrgRequest(r.id, { status: 'completed' });
                if (r.requesterUid) {
                  notifyMember(r.requesterUid, { type: 'org_request_update', title: 'Your training is complete', body: `${r.orgName}: thank you for working with She Model Tech.`, link: '/organizations#my-requests' });
                }
                return { ...r, status: 'completed' };
              }
            } catch (_) {
              /* ignore */
            }
            return r;
          })
        );
        setReqs(updated);
      })
      .catch(() => setReqs([]));
    const [t, p] = await Promise.all([
      getDocs(query(collection(db, 'users'), where('isTrainer', '==', true))).catch(() => null),
      getDocs(query(collection(db, 'users'), where('trainerRequested', '==', true))).catch(() => null),
    ]);
    setTrainers(t ? t.docs.map((d) => ({ uid: d.id, ...d.data() })) : []);
    setPendingTrainers(p ? p.docs.map((d) => ({ uid: d.id, ...d.data() })).filter((u) => !u.isTrainer) : []);
  };
  useEffect(() => {
    load();
  }, []);

  const patch = async (r, data, msg) => {
    try {
      await updateOrgRequest(r.id, data);
      setReqs((xs) => xs.map((x) => (x.id === r.id ? { ...x, ...data } : x)));
      if (msg) toast.success(msg);
    } catch (e) {
      toast.error('Could not update it.');
    }
  };

  const assign = (r, uid) => {
    const t = trainers.find((x) => x.uid === uid);
    if (!t || (r.assignedMentorUids || []).includes(uid)) return;
    patch(r, { assignedMentorUids: [...(r.assignedMentorUids || []), uid], assignedMentors: [...(r.assignedMentors || []), { uid, name: t.displayName || t.email }] }, 'Mentor assigned.');
    notifyMember(uid, { type: 'training_assignment', title: 'You’ve been assigned to a training contract', body: `${r.orgName}: ${r.topics.slice(0, 120)}`, link: '/teacher' });
  };
  const unassign = (r, uid) =>
    patch(r, { assignedMentorUids: (r.assignedMentorUids || []).filter((x) => x !== uid), assignedMentors: (r.assignedMentors || []).filter((x) => x.uid !== uid) });

  const decideTrainer = async (u, approve) => {
    try {
      await updateDoc(doc(db, 'users', u.uid), approve ? { isTrainer: true, trainerRequested: false } : { trainerRequested: false });
      notifyMember(u.uid, {
        type: 'trainer_decision',
        title: approve ? 'You’re now a She Model Tech trainer' : 'Update on your trainer request',
        body: approve ? 'You can now be assigned to training contracts. Your assignments appear in the Mentor Hub.' : 'Thank you for offering. We’re not adding trainers right now, but you can ask again later.',
        link: '/teacher',
      });
      toast.success(approve ? 'Trainer approved.' : 'Request declined.');
      load();
    } catch (e) {
      toast.error('Only admins can approve trainers.');
    }
  };

  const shown = (reqs || []).filter((r) => (filter === 'open' ? !['completed', 'ended', 'declined'].includes(r.status) : true));
  return (
    <div className="space-y-8">
      {isAdmin && (
        <div>
          <h3 className="text-gray-900 font-bold mb-1">Trainer requests</h3>
          <p className="text-xs text-gray-500 mb-2">{TRAINER_CRITERIA}</p>
          {pendingTrainers.length === 0 ? (
            <p className="text-gray-400 text-sm">No trainer requests waiting.</p>
          ) : (
            pendingTrainers.map((u) => (
              <div key={u.uid} className="flex flex-wrap items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg p-3 mb-2">
                <p className="text-sm text-gray-900">
                  {u.displayName || u.email} <span className="text-gray-500">· {u.mentorApprovedCourses || 0} published course(s)</span>
                </p>
                <div className="flex gap-2">
                  <button onClick={() => decideTrainer(u, true)} className="text-xs font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-lg">Approve</button>
                  <button onClick={() => decideTrainer(u, false)} className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">Decline</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h3 className="text-gray-900 font-bold">Organization requests</h3>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="text-sm border border-gray-300 rounded-lg px-2 py-1">
            <option value="open">Open</option>
            <option value="all">All</option>
          </select>
        </div>
        {reqs === null ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : shown.length === 0 ? (
          <p className="text-gray-400 text-sm">No requests yet. They come from the public For Organizations page.</p>
        ) : (
          <div className="space-y-3">
            {shown.map((r) => (
              <div key={r.id} className={`border rounded-xl p-4 ${['completed', 'ended', 'declined'].includes(r.status) ? 'bg-gray-50 border-gray-100 opacity-70' : 'bg-white border-gray-200'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">
                      {r.orgName} <span className="text-gray-500 font-normal">· {ORG_TYPES[r.orgType] || r.orgType}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {REQUEST_TYPES[r.type]} · {r.learners || '?'} learners · {r.format === 'in_person' ? 'In person' : r.format === 'hybrid' ? 'Online and in person' : 'Online'}
                      {r.timeline ? ` · ${r.timeline}` : ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      {r.contactName} · <a className="underline" href={`mailto:${r.contactEmail}`}>{r.contactEmail}</a>
                      {r.contactPhone ? ` · ${r.contactPhone}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                  {r.requesterUid && (
                    <Link
                      to={`/messages?to=${r.requesterUid}&text=${encodeURIComponent(`Hi ${r.contactName || ''}, thank you for your request for ${r.orgName}. `)}`}
                      className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                    >
                      Message {r.contactName || 'them'}
                    </Link>
                  )}
                  <select value={r.status} onChange={async (e) => {
                      const st = e.target.value;
                      await patch(r, { status: st }, r.requesterUid ? 'Status updated. The organization has been notified.' : 'Status updated.');
                      if (r.requesterUid && STATUS_MESSAGES[st]) {
                        notifyMember(r.requesterUid, {
                          type: 'org_request_update',
                          title: `Update on your request: ${STATUS_LABELS[st]}`,
                          body: `${r.orgName}: ${STATUS_MESSAGES[st]}`,
                          link: '/organizations#my-requests',
                          ctaLabel: 'See your request',
                        });
                      }
                    }}
                    className="text-sm border border-gray-300 rounded-lg px-2 py-1" aria-label="Status">
                    {statusesFor(r.type).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                  </div>
                </div>
                <p className="text-sm text-gray-800 mt-2"><strong>Topics:</strong> {r.topics}</p>
                {r.courses && <p className="text-sm text-gray-800"><strong>Courses:</strong> {r.courses}</p>}
                {r.message && <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{r.message}</p>}
                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Assigned mentors (trainers)</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(r.assignedMentors || []).map((m) => (
                        <span key={m.uid} className="text-xs bg-indigo-50 text-indigo-800 rounded-full px-2 py-0.5">
                          {m.name} <button onClick={() => unassign(r, m.uid)} aria-label={`Remove ${m.name}`}>×</button>
                        </span>
                      ))}
                    </div>
                    <select value="" onChange={(e) => assign(r, e.target.value)} className="mt-1.5 text-sm border border-gray-300 rounded-lg px-2 py-1">
                      <option value="">Assign a trainer...</option>
                      {trainers.map((t) => <option key={t.uid} value={t.uid}>{t.displayName || t.email}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700" htmlFor={`val-${r.id}`}>Contract value (USD, invoiced outside the platform)</label>
                    <input id={`val-${r.id}`} type="number" min="0" defaultValue={r.contractValue ?? ''}
                      onBlur={(e) => e.target.value !== String(r.contractValue ?? '') && patch(r, { contractValue: e.target.value === '' ? null : Number(e.target.value) }, 'Value saved.')}
                      className="mt-1 w-full text-sm border border-gray-300 rounded-lg px-2 py-1" />
                  </div>
                </div>
                <label className="block text-xs font-semibold text-gray-700 mt-3" htmlFor={`note-${r.id}`}>Internal notes</label>
                <textarea id={`note-${r.id}`} rows={2} defaultValue={r.adminNotes || ''}
                  onBlur={(e) => e.target.value !== (r.adminNotes || '') && patch(r, { adminNotes: e.target.value }, 'Notes saved.')}
                  className="mt-1 w-full text-sm border border-gray-300 rounded-lg px-2 py-1" />
                {r.type !== 'training' && ['approved', 'active'].includes(r.status) && (
                  <OrgManager request={r} onCreated={(id) => setReqs((xs) => xs.map((x) => (x.id === r.id ? { ...x, organizationId: id } : x)))} />
                )}
                {r.type !== 'licensing' && ['signed', 'in_progress'].includes(r.status) && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {r.assistantProjectId ? (
                      <>
                        <Link to={`/projects/${r.assistantProjectId}/workspace`} className="text-xs font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700">
                          Open training workspace
                        </Link>
                        <Link to={`/projects/owner-dashboard#project-${r.assistantProjectId}`} className="text-xs font-semibold border border-emerald-300 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-50">
                          Manage (applicants, mark done)
                        </Link>
                      </>
                    ) : (
                      <Link
                        to={`/projects/new-paid?orgRequest=${r.id}&title=${encodeURIComponent(`Training assistant: ${r.orgName}`)}&description=${encodeURIComponent(`Assist our trainers delivering ${r.topics.slice(0, 200)} for ${r.orgName}. Paid work experience.`)}&role=${encodeURIComponent('Training assistant')}`}
                        className="text-xs font-semibold border border-pink-300 text-pink-700 px-3 py-1.5 rounded-lg hover:bg-pink-50"
                      >
                        Create training workspace
                      </Link>
                    )}
                    {!r.assistantProjectId && (
                      <span className="text-[11px] text-gray-500">Adds the organization and assigned trainers to the workspace; set any paid assistant roles.</span>
                    )}
                    <label className="flex items-center gap-2 text-xs text-gray-700 ml-auto">
                      <input
                        type="checkbox"
                        checked={!!r.trainerPaid}
                        onChange={(e) => patch(r, { trainerPaid: e.target.checked, ...(e.target.checked ? { status: 'completed' } : {}) }, e.target.checked ? 'Marked delivered and trainer paid. Moved out of Open.' : 'Updated.')}
                      />
                      Training delivered and trainer paid (close this request)
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgRequestsTab;
