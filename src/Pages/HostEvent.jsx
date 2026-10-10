// src/Pages/HostEvent.jsx
// Events → Host an event: adult members (not companies) propose an online
// event. It waits for staff review; once published it appears on Events and
// members can register. The host sees her events, their status, and who
// registered.
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { alertStaff } from '../utils/staffAlerts';
import { uploadImageToBlob, validateImageFile } from '../utils/blobStorage';
import { EventsTabs } from './Events';
import { hasLink, isMeetingLink, normalizeLink, MEETING_SERVICES } from '../utils/noLinks';
import {
  CATEGORY_LABEL, EVENT_CATEGORIES, formatWhen, getJoinUrl, isPast, listMyHostedEvents, listRegistrations, submitHostedEvent,
} from '../utils/events';

const EMPTY = { title: '', category: 'workshop', when: '', durationMins: 60, hosts: '', description: '', capacity: '', joinUrl: '', imageUrl: '', projectId: null, projectTitle: null };
const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-pink-500';
const label = 'block text-sm font-semibold text-gray-800';

const toLocalInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const statusOf = (e) => {
  if (e.status === 'cancelled') return ['Cancelled', 'bg-gray-100 text-gray-700'];
  if (e.published) return [isPast(e) ? 'Past' : 'Live on Events', 'bg-pink-50 text-pink-700'];
  if (e.reviewStatus === 'declined') return ['Not approved', 'bg-gray-100 text-gray-700'];
  return ['Waiting for review', 'bg-gray-100 text-gray-700'];
};

const HostEvent = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(undefined);
  const [mine, setMine] = useState(null);
  const [f, setF] = useState(EMPTY);
  const [editing, setEditing] = useState(null); // null | 'new' | event id
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [regs, setRegs] = useState(null); // { event, rows }

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid)).then((s) => setProfile(s.exists() ? s.data() : null)).catch(() => setProfile(null));
  }, [currentUser]);

  const canHost = profile && profile.ageGroup === '18plus' && !profile.isCompany;
  const load = () => listMyHostedEvents(currentUser.uid).then(setMine).catch(() => setMine([]));
  useEffect(() => {
    if (canHost) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canHost]);

  // Opened from a project workspace (?project=ID&type=demoday): a team event,
  // pre-filled and linked to the project. Only the project's own team can link it.
  const [params, setParams] = useSearchParams();
  const fromProject = params.get('project');
  useEffect(() => {
    if (!canHost || !fromProject) return;
    getDoc(doc(db, 'projects', fromProject)).then((snap) => {
      if (!snap.exists()) return;
      const p = snap.data();
      const onTeam = p.submitterId === currentUser.uid || (p.members || []).includes(currentUser.uid);
      if (!onTeam) return;
      const title = p.projectTitle || p.title || 'Our project';
      const type = params.get('type') === 'demoday' ? 'demoday' : 'workshop';
      setRegs(null);
      setEditing('new');
      setF({
        ...EMPTY,
        category: type,
        title: type === 'demoday' ? `${title} demo day` : '',
        hosts: `The ${title} team`,
        projectId: fromProject,
        projectTitle: title,
      });
      setParams({}, { replace: true });
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canHost, fromProject]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const myName = profile?.displayName || currentUser?.displayName || 'A member';

  const startNew = () => { setEditing('new'); setRegs(null); setF({ ...EMPTY, hosts: myName }); };
  const startEdit = async (e) => {
    setRegs(null);
    setEditing(e.id);
    const joinUrl = await getJoinUrl(e.id);
    setF({
      title: e.title || '', category: e.category || 'workshop', when: toLocalInput(e.startAt), durationMins: e.durationMins || 60,
      hosts: e.hosts || '', description: e.description || '', capacity: e.capacity || '', joinUrl, imageUrl: e.imageUrl || '',
      projectId: e.projectId || null, projectTitle: e.projectTitle || null,
    });
  };

  const submit = async () => {
    if (f.title.trim().length < 3) return toast.error('Add a title.');
    if (!f.when) return toast.error('Choose the date and time.');
    if (new Date(f.when).getTime() < Date.now() + 24 * 3600 * 1000) return toast.error('Choose a time at least a day from now, so there’s time to review and share it.');
    if (f.description.trim().split(/\s+/).filter(Boolean).length < 10) return toast.error('Add a short description (at least 10 words).');
    if (!isMeetingLink(f.joinUrl)) return toast.error(`Add the joining link from ${MEETING_SERVICES}.`);
    if ([f.title, f.hosts, f.description].some(hasLink)) return toast.error('Please remove web links from the title, hosts, and description. Only the joining link can be a link.');
    setBusy(true);
    try {
      const data = {
        title: f.title.trim().slice(0, 120),
        category: f.category,
        startAt: new Date(f.when).toISOString(),
        durationMins: Math.min(600, Math.max(15, Number(f.durationMins) || 60)),
        hosts: f.hosts.trim() || myName,
        description: f.description.trim().slice(0, 4000),
        capacity: Number(f.capacity) > 0 ? Number(f.capacity) : null,
        imageUrl: f.imageUrl || null,
        projectId: f.projectId || null,
        projectTitle: f.projectId ? f.projectTitle : null,
      };
      const isNew = editing === 'new';
      await submitHostedEvent(isNew ? null : editing, data, normalizeLink(f.joinUrl), { uid: currentUser.uid, name: myName });
      alertStaff({
        type: 'event_review',
        title: `${isNew ? 'New event to review' : 'Event updated, review again'}: ${data.title}`,
        body: `${myName} wants to host a ${CATEGORY_LABEL[data.category] || 'event'} on ${formatWhen(data)}.`,
        link: '/events/manage',
        roles: ['admin', 'editor'],
      });
      toast.success('Sent for review. We’ll let you know when it’s live.');
      setEditing(null);
      load();
    } catch (err) {
      toast.error('Could not send it. Please try again.');
    }
    setBusy(false);
  };

  const remove = async (e) => {
    if (!window.confirm(`Delete "${e.title}"?`)) return;
    try {
      await deleteDoc(doc(db, 'events', e.id));
      load();
    } catch (err) {
      toast.error('Could not delete it.');
    }
  };

  const showRegs = async (e) => {
    setEditing(null);
    try {
      const rows = await listRegistrations(e.id);
      const named = await Promise.all(rows.map(async (r) => {
        const s = await getDoc(doc(db, 'users', r.uid)).catch(() => null);
        return { ...r, name: (s && s.exists() && s.data().displayName) || 'Member' };
      }));
      setRegs({ event: e, rows: named.sort((a, b) => (a.status === b.status ? 0 : a.status === 'registered' ? -1 : 1)) });
    } catch (err) {
      toast.error('Could not load who registered.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 box-content pt-4 sm:pt-6 lg:pt-8 pb-12">
      <EventsTabs />
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Host an event</h1>
            <p className="text-gray-600 mt-1">Share what you know with a workshop, talk, or spotlight. Finished a project? Host a demo day for your team. We review every event before it goes live.</p>
          </div>
          {canHost && !editing && (
            <button onClick={startNew} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">New event</button>
          )}
        </div>

        {profile === undefined ? (
          <p className="mt-6 text-sm text-gray-500">Loading…</p>
        ) : !canHost ? (
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <p className="font-semibold text-gray-900">{profile?.isCompany ? 'Hosting is for individual members' : 'Hosting is for members 18 and over'}</p>
            <p className="text-sm text-gray-600 mt-1">You can still join any event on the Events page.</p>
            <Link to="/events" className="inline-block mt-3 text-sm font-semibold text-pink-700 hover:underline">See upcoming events</Link>
          </div>
        ) : (
          <>
            {editing && (
              <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 grid sm:grid-cols-2 gap-4">
                {f.projectId && (
                  <p className="sm:col-span-2 text-sm text-gray-700 rounded-lg bg-pink-50/60 border border-pink-100 px-3 py-2">
                    Team event for <span className="font-semibold">{f.projectTitle}</span>.{' '}
                    <button type="button" onClick={() => setF({ ...f, projectId: null, projectTitle: null })} className="font-semibold text-pink-700 hover:underline">Not a team event</button>
                  </p>
                )}
                <label className={`${label} sm:col-span-2`}>Title *<input className={`${input} mt-1`} value={f.title} onChange={set('title')} maxLength={120} placeholder="For example: Your first pull request" /></label>
                <label className={label}>Type *
                  <select className={`${input} mt-1`} value={f.category} onChange={set('category')}>
                    {EVENT_CATEGORIES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                  </select>
                </label>
                <label className={label}>Date and time (your time zone) *<input type="datetime-local" className={`${input} mt-1`} value={f.when} onChange={set('when')} /></label>
                <label className={label}>Length in minutes<input type="number" min="15" max="600" step="15" className={`${input} mt-1`} value={f.durationMins} onChange={set('durationMins')} /></label>
                <label className={label}>Places <span className="font-normal text-gray-500">(empty = no limit)</span><input type="number" min="1" className={`${input} mt-1`} value={f.capacity} onChange={set('capacity')} /></label>
                <label className={`${label} sm:col-span-2`}>Host and speakers<input className={`${input} mt-1`} value={f.hosts} onChange={set('hosts')} /></label>
                <label className={`${label} sm:col-span-2`}>Description *<textarea rows={4} className={`${input} mt-1`} value={f.description} onChange={set('description')} placeholder="What you’ll cover, who it’s for, and what people will leave with." /></label>
                <label className={`${label} sm:col-span-2`}>Joining link * <span className="font-normal text-gray-500">({MEETING_SERVICES}; only people with a place see it)</span><input className={`${input} mt-1`} value={f.joinUrl} onChange={set('joinUrl')} placeholder="https://" /></label>
                <div className="sm:col-span-2">
                  <span className={label}>Image or flyer <span className="font-normal text-gray-500">(optional)</span></span>
                  {f.imageUrl ? (
                    <div className="mt-1 flex items-start gap-3">
                      <img src={f.imageUrl} alt="" className="w-40 rounded-lg border border-gray-200" />
                      <button type="button" onClick={() => setF({ ...f, imageUrl: '' })} className="text-sm font-semibold text-gray-600 hover:text-gray-900">Remove</button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={uploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        if (!file) return;
                        const bad = validateImageFile(file);
                        if (bad) return toast.error(bad);
                        setUploading(true);
                        try {
                          const up = await uploadImageToBlob(file, 'events');
                          setF((x) => ({ ...x, imageUrl: up.url }));
                        } catch (err) {
                          toast.error('Could not upload the image. Please try again.');
                        }
                        setUploading(false);
                      }}
                      className="mt-1 block text-sm"
                    />
                  )}
                  {uploading && <p className="text-xs text-gray-500 mt-1">Uploading…</p>}
                </div>
                <div className="sm:col-span-2 flex flex-wrap gap-2">
                  <button disabled={busy || uploading} onClick={submit} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50">Send for review</button>
                  <button onClick={() => setEditing(null)} className="text-sm font-semibold text-gray-500 px-2">Cancel</button>
                </div>
              </div>
            )}

            {regs && (
              <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-bold text-gray-900">Registered for {regs.event.title}</h2>
                  <button onClick={() => setRegs(null)} className="text-sm font-semibold text-gray-500">Close</button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {regs.rows.filter((r) => r.status === 'registered').length} with a place · {regs.rows.filter((r) => r.status === 'waitlist').length} on the waitlist
                </p>
                {regs.rows.length === 0 ? (
                  <p className="text-sm text-gray-500 mt-3">No one has registered yet. Share your event to spread the word.</p>
                ) : (
                  <ul className="mt-3 divide-y divide-gray-100">
                    {regs.rows.map((r) => (
                      <li key={r.id} className="py-2 text-sm flex items-center gap-2">
                        <Link to={`/profile/${r.uid}`} className="font-semibold text-gray-900 hover:underline">{r.name}</Link>
                        {r.status === 'waitlist' && <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">Waitlist</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <h2 className="mt-8 text-lg font-bold text-gray-900">Your events</h2>
            {mine === null ? (
              <p className="mt-2 text-sm text-gray-500">Loading…</p>
            ) : mine.length === 0 ? (
              <p className="mt-2 text-sm text-gray-600">You haven’t hosted an event yet. Tap New event to plan your first.</p>
            ) : (
              <ul className="mt-2 divide-y divide-gray-200 border-y border-gray-200">
                {mine.map((e) => {
                  const [st, cls] = statusOf(e);
                  return (
                    <li key={e.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">{e.title}</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {CATEGORY_LABEL[e.category] || 'Event'} · {formatWhen(e)}{' '}
                          <span className={`ml-1 font-bold px-2 py-0.5 rounded-full ${cls}`}>{st}</span>
                        </p>
                        {e.reviewStatus === 'declined' && e.reviewNote && <p className="text-xs text-gray-600 mt-1">Note from the team: {e.reviewNote}</p>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {e.published ? (
                          <>
                            <Link to={`/events/${e.id}`} className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">View</Link>
                            <button onClick={() => showRegs(e)} className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">Who registered</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(e)} className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">Edit</button>
                            <button onClick={() => remove(e)} className="text-xs font-semibold text-red-600 px-2">Delete</button>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-3 text-xs text-gray-500">Need to change or cancel a live event? Message the She Model Tech team from Support.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default HostEvent;
