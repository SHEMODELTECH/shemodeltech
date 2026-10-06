// src/components/admin/EventsAdmin.jsx
// Admin → Events: create and publish online events, announce them to members,
// see who registered (and demo day presenters), tell people about changes or a
// cancellation, and send the recording afterwards.
import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase/config';
import { notifyMember } from '../../utils/staffAlerts';
import {
  CATEGORY_LABEL, EVENT_CATEGORIES, deleteEvent, formatWhen, getJoinUrl, isPast, listAllEvents,
  listRegistrations, saveEvent, setPresenter,
} from '../../utils/events';

const EMPTY = { title: '', category: 'workshop', when: '', durationMins: 60, hosts: '', description: '', capacity: '', joinUrl: '', published: false };
const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';
const label = 'block text-sm font-semibold text-gray-800 mb-1';

// datetime-local value (viewer's time) <-> ISO (UTC)
const toLocalInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const userInfo = async (uid) => {
  const s = await getDoc(doc(db, 'users', uid)).catch(() => null);
  const d = s && s.exists() ? s.data() : {};
  return { name: d.displayName || d.email || 'Member', email: d.email || '', emailsOff: d.emailPreferences?.reminders === false };
};

// Tell a list of uids something, one at a time, with a progress count.
const tellAll = async (uids, n, setProgress) => {
  let done = 0;
  for (const uid of uids) {
    // eslint-disable-next-line no-await-in-loop
    await notifyMember(uid, n);
    done += 1;
    setProgress(`${done} of ${uids.length} sent…`);
  }
  setProgress('');
  return done;
};

const EventsAdmin = () => {
  const [events, setEvents] = useState(null);
  const [f, setF] = useState(EMPTY);
  const [editing, setEditing] = useState(null); // event id or 'new'
  const [original, setOriginal] = useState(null);
  const [tellChange, setTellChange] = useState(true);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [openRegs, setOpenRegs] = useState(null); // { event, rows }
  const [recording, setRecording] = useState('');

  const load = () => listAllEvents().then(setEvents).catch(() => setEvents([]));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const startNew = () => { setEditing('new'); setOriginal(null); setF(EMPTY); setOpenRegs(null); };
  const startEdit = async (e) => {
    setEditing(e.id);
    setOriginal(e);
    setOpenRegs(null);
    const joinUrl = await getJoinUrl(e.id);
    setF({
      title: e.title || '', category: e.category || 'workshop', when: toLocalInput(e.startAt), durationMins: e.durationMins || 60,
      hosts: e.hosts || '', description: e.description || '', capacity: e.capacity || '', joinUrl, published: !!e.published,
    });
  };

  const registeredUids = async (eventId, statuses = ['registered', 'waitlist']) =>
    (await listRegistrations(eventId)).filter((r) => statuses.includes(r.status)).map((r) => r.uid);

  const save = async (announce = false) => {
    if (f.title.trim().length < 3) return toast.error('Add a title.');
    if (!f.when) return toast.error('Choose the date and time.');
    if (f.description.trim().split(/\s+/).filter(Boolean).length < 5) return toast.error('Add a short description (at least 5 words).');
    if (f.joinUrl && !/^https?:\/\//i.test(f.joinUrl.trim())) return toast.error('The joining link should start with https://');
    setBusy(true);
    try {
      const data = {
        title: f.title.trim(),
        category: f.category,
        startAt: new Date(f.when).toISOString(),
        durationMins: Number(f.durationMins) || 60,
        hosts: f.hosts.trim(),
        description: f.description.trim(),
        capacity: Number(f.capacity) > 0 ? Number(f.capacity) : null,
        published: announce ? true : !!f.published,
      };
      const id = await saveEvent(editing === 'new' ? null : editing, data, f.joinUrl.trim());
      const ev = { id, ...data };

      // A published event whose time changed: tell everyone registered.
      if (original && original.published && tellChange && original.startAt !== data.startAt) {
        const uids = await registeredUids(id);
        const n = await tellAll(uids, {
          type: 'event_changed', title: `Time change: ${data.title}`,
          body: `The event has moved to ${formatWhen(ev)}. Your place is kept.`,
          link: `/events?e=${id}`, ctaLabel: 'See the event',
        }, setProgress);
        if (n) toast.info(`Told ${n} registered ${n === 1 ? 'person' : 'people'} about the new time.`);
      }

      if (announce && !(original && original.announcedAt)) {
        const users = (await getDocs(collection(db, 'users'))).docs
          .map((d) => ({ uid: d.id, ...d.data() }))
          .filter((u) => !u.isCompany && u.onboardingComplete);
        let done = 0;
        for (const u of users) {
          // eslint-disable-next-line no-await-in-loop
          await notifyMember(u.uid, {
            type: 'event_announced',
            title: `New event: ${data.title}`,
            body: `${CATEGORY_LABEL[data.category] || 'Event'} · ${formatWhen(ev)} · Online. ${data.description.slice(0, 160)}${data.description.length > 160 ? '…' : ''}`,
            link: `/events?e=${id}`,
            ctaLabel: 'Register',
            sendEmail: u.emailPreferences?.reminders !== false,
            emailTo: u.email,
          });
          done += 1;
          setProgress(`Announcing: ${done} of ${users.length}…`);
        }
        setProgress('');
        await updateDoc(doc(db, 'events', id), { announcedAt: new Date().toISOString() });
        toast.success(`Published and announced to ${done} members.`);
      } else {
        toast.success('Event saved.');
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error(`Could not save the event: ${e.message}`);
    }
    setBusy(false);
  };

  const cancelEvent = async (e) => {
    if (!window.confirm(`Cancel "${e.title}"? Everyone registered will be told.`)) return;
    setBusy(true);
    try {
      await updateDoc(doc(db, 'events', e.id), { status: 'cancelled' });
      const n = await tellAll(await registeredUids(e.id), {
        type: 'event_cancelled', title: `Cancelled: ${e.title}`,
        body: `We’re sorry, ${e.title} (${formatWhen(e)}) has been cancelled. Keep an eye on Events for what’s next.`,
        link: '/events', ctaLabel: 'See upcoming events',
      }, setProgress);
      toast.success(`Event cancelled. ${n} ${n === 1 ? 'person was' : 'people were'} told.`);
      load();
    } catch (err) {
      toast.error('Could not cancel the event.');
    }
    setBusy(false);
  };

  const remove = async (e) => {
    if (!window.confirm(`Delete "${e.title}" completely? This can’t be undone.`)) return;
    await deleteEvent(e.id).catch(() => toast.error('Could not delete.'));
    load();
  };

  const showRegs = async (e) => {
    setEditing(null);
    setRecording(e.recordingUrl || '');
    const rows = await listRegistrations(e.id);
    const withInfo = await Promise.all(rows.map(async (r) => ({ ...r, ...(await userInfo(r.uid)) })));
    withInfo.sort((a, b) => (a.status === b.status ? 0 : a.status === 'registered' ? -1 : 1));
    setOpenRegs({ event: e, rows: withInfo });
  };

  const confirmPresenter = async (r) => {
    const e = openRegs.event;
    await setPresenter(e.id, r.uid, { presenterConfirmed: !r.presenterConfirmed }).catch(() => toast.error('Could not update.'));
    if (!r.presenterConfirmed) {
      await notifyMember(r.uid, {
        type: 'demo_presenter_confirmed', title: `You’re presenting at ${e.title}`,
        body: `Your slot to present “${r.projectTitle}” is confirmed for ${formatWhen(e)}. We’ll share the running order before the event.`,
        link: `/events?e=${e.id}`, ctaLabel: 'See the event',
      });
    }
    showRegs(e);
  };

  const sendRecording = async () => {
    const e = openRegs.event;
    if (!/^https?:\/\//i.test(recording.trim())) return toast.error('Add the recording link (starting with https://).');
    setBusy(true);
    await updateDoc(doc(db, 'events', e.id), { recordingUrl: recording.trim() });
    const n = await tellAll(openRegs.rows.filter((r) => r.status === 'registered').map((r) => r.uid), {
      type: 'event_recording', title: `Recording: ${e.title}`,
      body: 'Thank you for registering. The recording is ready to watch.',
      link: recording.trim(), ctaLabel: 'Watch the recording',
    }, setProgress);
    toast.success(`Recording saved and sent to ${n} ${n === 1 ? 'person' : 'people'}.`);
    setBusy(false);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Events</h2>
          <p className="text-sm text-gray-600">Online workshops, talks, podcasts, live demos, demo days, and team shout-outs.</p>
        </div>
        <button onClick={startNew} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">New event</button>
      </div>

      {progress && <p className="text-sm font-semibold text-gray-900">{progress}</p>}

      {editing && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 grid sm:grid-cols-2 gap-4">
          <label className={`${label} sm:col-span-2`}>Title *<input className={input} value={f.title} onChange={set('title')} /></label>
          <label className={label}>Type *
            <select className={input} value={f.category} onChange={set('category')}>
              {EVENT_CATEGORIES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </label>
          <label className={label}>Date and time (your time zone) *<input type="datetime-local" className={input} value={f.when} onChange={set('when')} /></label>
          <label className={label}>Length in minutes<input type="number" min="15" step="15" className={input} value={f.durationMins} onChange={set('durationMins')} /></label>
          <label className={label}>Places <span className="font-normal text-gray-500">(empty = no limit)</span><input type="number" min="1" className={input} value={f.capacity} onChange={set('capacity')} /></label>
          <label className={`${label} sm:col-span-2`}>Host and speakers <span className="font-normal text-gray-500">(optional)</span><input className={input} value={f.hosts} onChange={set('hosts')} placeholder="For example: Ada Lovelace and Grace Hopper" /></label>
          <label className={`${label} sm:col-span-2`}>Description *<textarea rows={4} className={input} value={f.description} onChange={set('description')} /></label>
          <label className={`${label} sm:col-span-2`}>Joining link <span className="font-normal text-gray-500">(Zoom, Google Meet…; only people with a place see it)</span><input className={input} value={f.joinUrl} onChange={set('joinUrl')} placeholder="https://" /></label>
          {original?.published && original.startAt && (
            <label className="sm:col-span-2 flex items-center gap-2 text-sm text-gray-800">
              <input type="checkbox" checked={tellChange} onChange={(e) => setTellChange(e.target.checked)} /> If the time changes, tell everyone registered
            </label>
          )}
          <div className="sm:col-span-2 flex flex-wrap gap-2">
            {!(original?.announcedAt) && (
              <button disabled={busy} onClick={() => save(true)} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50">Publish and announce to members</button>
            )}
            <button disabled={busy} onClick={() => save(false)} className="border border-gray-300 text-gray-800 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              {original?.published ? 'Save changes' : 'Save as draft'}
            </button>
            <button onClick={() => setEditing(null)} className="text-sm font-semibold text-gray-500 px-2">Close</button>
          </div>
        </div>
      )}

      {openRegs && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-gray-900">Registered for {openRegs.event.title}</h3>
            <button onClick={() => setOpenRegs(null)} className="text-sm font-semibold text-gray-500">Close</button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {openRegs.rows.filter((r) => r.status === 'registered').length} with a place · {openRegs.rows.filter((r) => r.status === 'waitlist').length} on the waitlist
          </p>
          {openRegs.rows.length === 0 ? (
            <p className="text-sm text-gray-500 mt-3">No one has registered yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-gray-100">
              {openRegs.rows.map((r) => (
                <li key={r.id} className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="min-w-0">
                    <span className="font-semibold text-gray-900">{r.name}</span> <span className="text-gray-500">{r.email}</span>
                    {r.status === 'waitlist' && <span className="ml-2 text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">Waitlist</span>}
                    {r.present && <span className="ml-2 text-xs font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full">Wants to present: {r.projectTitle}</span>}
                  </span>
                  {r.present && (
                    <button onClick={() => confirmPresenter(r)} className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                      {r.presenterConfirmed ? '✓ Presenter confirmed (undo)' : 'Confirm presenter'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {isPast(openRegs.event) && (
            <div className="mt-4 flex flex-wrap gap-2 items-end">
              <label className={`${label} flex-1 min-w-[240px]`}>Recording link<input className={input} value={recording} onChange={(e) => setRecording(e.target.value)} placeholder="https://" /></label>
              <button disabled={busy} onClick={sendRecording} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50">Save and send to attendees</button>
            </div>
          )}
        </div>
      )}

      {events === null ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-gray-500">No events yet. Create your first one.</p>
      ) : (
        <ul className="divide-y divide-gray-200 border-y border-gray-200">
          {events.map((e) => (
            <li key={e.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900">{e.title}</p>
                <p className="text-xs text-gray-600">
                  {CATEGORY_LABEL[e.category] || 'Event'} · {formatWhen(e)} ·{' '}
                  {e.status === 'cancelled' ? 'Cancelled' : !e.published ? 'Draft' : isPast(e) ? 'Past' : e.announcedAt ? 'Published and announced' : 'Published'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => showRegs(e)} className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">Registrations</button>
                {e.status !== 'cancelled' && <button onClick={() => startEdit(e)} className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">Edit</button>}
                {e.published && e.status !== 'cancelled' && !isPast(e) && (
                  <button disabled={busy} onClick={() => cancelEvent(e)} className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">Cancel event</button>
                )}
                <button onClick={() => remove(e)} className="text-xs font-semibold text-red-600 px-2">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventsAdmin;
