// src/components/admin/EventsAdmin.jsx
// Admin → Events: create and publish online events, announce them to members,
// see who registered (and demo day presenters), tell people about changes or a
// cancellation, and send the recording afterwards.
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase/config';
import { notifyMember, notifyMembers } from '../../utils/staffAlerts';
import { logActivity as logProof } from '../../utils/activityFeed';
import { readUsersForSending } from '../../utils/readUsersPaged';
import { EventImagesInput } from '../EventImages';
import {
  CATEGORY_LABEL, EVENT_CATEGORIES, eventImages, deleteEvent, formatWhen, getJoinUrl, getRecordingUrl, isPast, listAllEvents,
  listRegistrations, saveEvent, saveRecording, setPresenter, setShowOnPage,
} from '../../utils/events';

const EMPTY = { title: '', category: 'workshop', when: '', durationMins: 60, hosts: '', description: '', capacity: '', joinUrl: '', learnMoreUrl: '', imageUrl: '', images: [], published: false };
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

// Tell a list of uids something, a few at a time, with a progress count.
const tellAll = async (uids, n, setProgress) => {
  const done = await notifyMembers(uids.map((uid) => ({ uid, sendEmail: n.sendEmail !== false })), n,
    (d, total) => setProgress(`${d} of ${total} sent…`));
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
  const [uploading, setUploading] = useState(false);
  const [openRegs, setOpenRegs] = useState(null); // { event, rows }
  const [recording, setRecording] = useState('');

  // Member events waiting for review come first.
  const waiting = (e) => !!e.hostUid && !e.published && e.reviewStatus !== 'declined';
  const load = () => listAllEvents().then((xs) => setEvents([...xs.filter(waiting), ...xs.filter((x) => !waiting(x))])).catch(() => setEvents([]));
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
      hosts: e.hosts || '', description: e.description || '', capacity: e.capacity || '', joinUrl, learnMoreUrl: e.learnMoreUrl || '', imageUrl: e.imageUrl || '', images: eventImages(e), published: !!e.published,
    });
  };

  const registeredUids = async (eventId, statuses = ['registered', 'waitlist']) =>
    (await listRegistrations(eventId)).filter((r) => statuses.includes(r.status)).map((r) => r.uid);

  const save = async (announce = false) => {
    if (f.title.trim().length < 3) return toast.error('Add a title.');
    if (!f.when) return toast.error('Choose the date and time.');
    if (f.description.trim().split(/\s+/).filter(Boolean).length < 5) return toast.error('Add a short description (at least 5 words).');
    if (f.joinUrl && !/^https?:\/\//i.test(f.joinUrl.trim())) return toast.error('The joining link should start with https://');
    if (f.learnMoreUrl && !/^https:\/\/[^\s]+\.[^\s]+/i.test(f.learnMoreUrl.trim())) return toast.error('The “Learn more” link should be a full web address starting with https://');
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
        images: f.images.slice(0, 5),
        imageUrl: f.images[0] || null,
        // Optional page about the program (“Learn more” on the event). Only on
        // She Model Tech's own events: member-hosted events stay link-free.
        ...(!original?.hostUid && (f.learnMoreUrl.trim() || original?.learnMoreUrl) ? { learnMoreUrl: f.learnMoreUrl.trim() || null } : {}),
        published: announce ? true : !!f.published,
        ...(original?.hostUid && (announce || f.published) ? { reviewStatus: 'approved' } : {}),
      };
      const id = await saveEvent(editing === 'new' ? null : editing, data, f.joinUrl.trim());
      const ev = { id, ...data };

      // A member's event just approved: tell the host.
      if (original?.hostUid && data.published && !original.published) {
        notifyMember(original.hostUid, {
          type: 'event_approved', title: `Your event is live: ${data.title}`,
          body: `${formatWhen(ev)}. Members can now register. Share it to spread the word.`,
          link: `/events/${id}`, ctaLabel: 'See your event',
        });
        // A team event: celebrate it on the Proof Wall.
        if (original.projectId) {
          logProof({
            type: 'milestone',
            actorId: original.hostUid,
            actorName: `The ${original.projectTitle || 'project'} team`,
            projectId: original.projectId,
            projectTitle: original.projectTitle || null,
            meta: `is hosting ${data.category === 'demoday' ? 'a demo day' : `a ${(CATEGORY_LABEL[data.category] || 'event').toLowerCase()}`}: ${data.title}`,
          });
        }
      }

      // A published event whose time changed: tell everyone registered.
      if (original && original.published && tellChange && original.startAt !== data.startAt) {
        const uids = await registeredUids(id);
        const n = await tellAll(uids, {
          type: 'event_changed', title: `Time change: ${data.title}`,
          body: `The event has moved to ${formatWhen(ev)}. Your place is kept.`,
          link: `/events/${id}`, ctaLabel: 'See the event',
        }, setProgress);
        if (n) toast.info(`Told ${n} registered ${n === 1 ? 'person' : 'people'} about the new time.`);
      }

      if (announce && !(original && original.announcedAt)) {
        const users = (await readUsersForSending((n) => setProgress(`Reading members: ${n}…`)))
          .filter((u) => !u.isCompany && u.onboardingComplete);
        // A few at a time, with phone notifications sent in groups.
        const done = await notifyMembers(
          users.map((u) => ({ uid: u.uid, sendEmail: u.emailPreferences?.reminders !== false, emailTo: u.email })),
          {
            type: 'event_announced',
            title: `New event: ${data.title}`,
            body: `${CATEGORY_LABEL[data.category] || 'Event'} · ${formatWhen(ev)} · Online. ${data.description.slice(0, 160)}${data.description.length > 160 ? '…' : ''}`,
            link: `/events/${id}`,
            ctaLabel: 'Register',
          },
          (d, total) => setProgress(`Announcing: ${d} of ${total}…`)
        );
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

  // A member's event that isn't right for Events: send it back with a note.
  const decline = async (e) => {
    const note = window.prompt(`Why isn't "${e.title}" approved? The host will see this note and can edit and resend it.`, '');
    if (note === null) return;
    try {
      await updateDoc(doc(db, 'events', e.id), { reviewStatus: 'declined', reviewNote: note.trim().slice(0, 500) });
      notifyMember(e.hostUid, {
        type: 'event_declined', title: `Your event wasn't approved: ${e.title}`,
        body: note.trim() ? `Note from the team: ${note.trim()}` : 'You can edit it and send it for review again.',
        link: '/events/host', ctaLabel: 'See your events',
      });
      toast.success('Sent back to the host.');
      load();
    } catch (err) {
      toast.error('Could not update it.');
    }
  };

  const remove = async (e) => {
    if (!window.confirm(`Delete "${e.title}" completely? This can’t be undone.`)) return;
    await deleteEvent(e.id).catch(() => toast.error('Could not delete.'));
    load();
  };

  const showRegs = async (e) => {
    setEditing(null);
    try {
      setRecording((await getRecordingUrl(e)) || '');
      const rows = await listRegistrations(e.id);
      const withInfo = await Promise.all(rows.map(async (r) => ({ ...r, ...(await userInfo(r.uid)) })));
      withInfo.sort((a, b) => (a.status === b.status ? 0 : a.status === 'registered' ? -1 : 1));
      setOpenRegs({ event: e, rows: withInfo });
    } catch (err) {
      toast.error('Could not load the registrations.');
    }
  };

  const confirmPresenter = async (r) => {
    const e = openRegs.event;
    await setPresenter(e.id, r.uid, { presenterConfirmed: !r.presenterConfirmed }).catch(() => toast.error('Could not update.'));
    if (!r.presenterConfirmed) {
      await notifyMember(r.uid, {
        type: 'demo_presenter_confirmed', title: `You’re presenting at ${e.title}`,
        body: `Your slot to present “${r.projectTitle}” is confirmed for ${formatWhen(e)}. We’ll share the running order before the event.`,
        link: `/events/${e.id}`, ctaLabel: 'See the event',
      });
    }
    showRegs(e);
  };

  // Save (or remove) the recording link without emailing anyone.
  const storeRecording = async () => {
    const e = openRegs.event;
    const url = recording.trim();
    if (url && !/^https?:\/\//i.test(url)) return toast.error('The recording link should start with https://');
    setBusy(true);
    try {
      await saveRecording(e.id, url);
      toast.success(url ? 'Recording saved. Members can watch it from the event once it’s shown on the Events page.' : 'Recording removed.');
      load();
    } catch (err) {
      toast.error('Could not save the recording.');
    }
    setBusy(false);
  };

  // Email everyone who had a place: the link goes to the event (members only).
  const sendRecording = async () => {
    const e = openRegs.event;
    if (!/^https?:\/\//i.test(recording.trim())) return toast.error('Add the recording link (starting with https://).');
    setBusy(true);
    await saveRecording(e.id, recording.trim());
    const n = await tellAll(openRegs.rows.filter((r) => r.status === 'registered').map((r) => r.uid), {
      type: 'event_recording', title: `Recording: ${e.title}`,
      body: 'Thank you for registering. The recording is ready to watch on the Events page.',
      link: `/events/${e.id}`, ctaLabel: 'Watch the recording',
    }, setProgress);
    toast.success(`Recording saved and sent to ${n} ${n === 1 ? 'person' : 'people'}.`);
    setBusy(false);
    load();
  };

  const toggleShow = async (e) => {
    await setShowOnPage(e.id, !e.showOnPage).catch(() => toast.error('Could not update.'));
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Events</h2>
          <p className="text-sm text-gray-600">Online workshops, talks, conferences, demo days, and spotlights.</p>
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
          <div className="sm:col-span-2">
            <span className={label}>Images <span className="font-normal text-gray-500">(optional)</span></span>
            <EventImagesInput images={f.images} onChange={(images) => setF((x) => ({ ...x, images }))} onUploading={setUploading} />
          </div>
          <label className={`${label} sm:col-span-2`}>Description *<textarea rows={4} className={input} value={f.description} onChange={set('description')} /></label>
          {!original?.hostUid && <label className={`${label} sm:col-span-2`}>“Learn more” link <span className="font-normal text-gray-500">(optional: a page about the program, shown to everyone on the event page)</span><input className={input} value={f.learnMoreUrl} onChange={set('learnMoreUrl')} placeholder="https://" /></label>}
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
              <label className={`${label} flex-1 min-w-[240px]`}>Recording link <span className="font-normal text-gray-500">(optional)</span><input className={input} value={recording} onChange={(e) => setRecording(e.target.value)} placeholder="https://" /></label>
              <button disabled={busy} onClick={storeRecording} className="border border-gray-300 text-gray-800 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50">Save only</button>
              <button disabled={busy} onClick={sendRecording} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50">Save and email attendees</button>
              <p className="w-full text-xs text-gray-500">Optional. Only signed-in members can open the recording; visitors are asked to sign in or join first.</p>
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
                  {e.status === 'cancelled' ? 'Cancelled' : !e.published ? (e.hostUid ? (e.reviewStatus === 'declined' ? 'Not approved' : 'Waiting for review') : 'Draft') : isPast(e) ? 'Past' : e.announcedAt ? 'Published and announced' : 'Published'}
                  {e.hostUid ? (e.projectId ? ` · Team event: ${e.projectTitle || 'project'}` : ` · Hosted by ${e.hostName || 'a member'}`) : ''}
                  {e.hasRecording ? ' · Has recording' : ''}
                  {e.published && (isPast(e) || e.status === 'cancelled') ? (e.showOnPage ? ' · Shown on Events page' : ' · Hidden from Events page') : ''}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => showRegs(e)} className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">Registrations</button>
                {e.hostUid && !e.published && e.reviewStatus !== 'declined' && (
                  <>
                    <button onClick={() => startEdit(e)} className="text-xs font-semibold bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg">Review and publish</button>
                    <button onClick={() => decline(e)} className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">Decline</button>
                  </>
                )}
                {e.status !== 'cancelled' && !(e.hostUid && !e.published && e.reviewStatus !== 'declined') && <button onClick={() => startEdit(e)} className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">Edit</button>}
                {e.published && e.status !== 'cancelled' && !isPast(e) && (
                  <button disabled={busy} onClick={() => cancelEvent(e)} className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">Cancel event</button>
                )}
                {e.published && (isPast(e) || e.status === 'cancelled') && (
                  <button onClick={() => toggleShow(e)} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${e.showOnPage ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-300 hover:bg-gray-50'}`}>
                    {e.showOnPage ? 'Hide from Events page' : 'Show on Events page'}
                  </button>
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
