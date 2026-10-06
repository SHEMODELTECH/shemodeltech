// src/utils/events.js
// She Model Tech events: workshops, tech talks, podcasts, live demos, demo days,
// and team shout-outs. All events are online.
//
//   events/{id}: title, category, description, hosts, startAt (ISO, UTC),
//     durationMins, capacity (number or null), published, status
//     ('scheduled' | 'cancelled'), hasRecording, showOnPage (past and cancelled
//     events only appear when this is on), announcedAt, createdAt
//   events/{id}/members/info: recordingUrl (any signed-in member can read it)
//   events/{id}/private/info: joinUrl (only staff and registered people can read it)
//   eventRegistrations/{eventId}_{uid}: eventId, uid, status ('registered' |
//     'waitlist'), present, projectId, projectTitle (demo days), createdAt,
//     reminded1d, reminded30 (set by the server). No names or emails here;
//     staff look those up from users/{uid}.
//
// Reminders (1 day and 30 minutes before) and moving people up from the
// waitlist run on the server: api/cron/project-reminders.js?task=events.

import {
  addDoc, collection, deleteDoc, deleteField, doc, getCountFromServer, getDoc, getDocs, query,
  serverTimestamp, setDoc, updateDoc, where,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const EVENT_CATEGORIES = [
  ['workshop', 'Workshop'],
  ['talk', 'Tech talk'],
  ['podcast', 'Podcast'],
  ['demo', 'Live demo'],
  ['demoday', 'Demo day'],
  ['shoutout', 'Team shout-out'],
];
export const CATEGORY_LABEL = Object.fromEntries(EVENT_CATEGORIES);

const SITE = typeof window !== 'undefined' ? window.location.origin : 'https://shemodeltech.com';
const toMs = (iso) => (iso ? new Date(iso).getTime() : 0);
export const eventEnd = (e) => toMs(e.startAt) + (Number(e.durationMins) || 60) * 60000;
export const isPast = (e) => eventEnd(e) < Date.now();

// "Tue, Oct 14 · 6:00 PM EDT" in the viewer's own time zone.
export const formatWhen = (e) => {
  if (!e?.startAt) return 'Date to be announced';
  const d = new Date(e.startAt);
  const date = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
  return `${date} · ${time}`;
};

// ---- Reading ----
export const listPublishedEvents = async () => {
  const s = await getDocs(query(collection(db, 'events'), where('published', '==', true)));
  return s.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => toMs(a.startAt) - toMs(b.startAt));
};
export const listAllEvents = async () => {
  const s = await getDocs(collection(db, 'events'));
  return s.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => toMs(b.startAt) - toMs(a.startAt));
};
export const getEvent = async (id) => {
  const s = await getDoc(doc(db, 'events', id));
  return s.exists() ? { id: s.id, ...s.data() } : null;
};
// Recording link: members only.
export const getRecordingUrl = async (event) => {
  const s = await getDoc(doc(db, 'events', event.id, 'members', 'info')).catch(() => null);
  return (s && s.exists() && s.data().recordingUrl) || event.recordingUrl || '';
};
export const saveRecording = async (eventId, url) => {
  await setDoc(doc(db, 'events', eventId, 'members', 'info'), { recordingUrl: url || '' }, { merge: true });
  await updateDoc(doc(db, 'events', eventId), { hasRecording: !!url, recordingUrl: deleteField() });
};
export const setShowOnPage = (eventId, on) => updateDoc(doc(db, 'events', eventId), { showOnPage: !!on });
// Upcoming, not cancelled: always listed. Past or cancelled: only when switched on.
export const isListed = (e) => (isPast(e) || e.status === 'cancelled' ? e.showOnPage === true : true);

export const getJoinUrl = async (eventId) => {
  const s = await getDoc(doc(db, 'events', eventId, 'private', 'info')).catch(() => null);
  return s && s.exists() ? s.data().joinUrl || '' : '';
};

// ---- Staff ----
export const saveEvent = async (id, data, joinUrl) => {
  let eventId = id;
  if (id) {
    await updateDoc(doc(db, 'events', id), { ...data, updatedAt: serverTimestamp() });
  } else {
    const ref = await addDoc(collection(db, 'events'), { ...data, status: 'scheduled', createdAt: serverTimestamp() });
    eventId = ref.id;
  }
  await setDoc(doc(db, 'events', eventId, 'private', 'info'), { joinUrl: joinUrl || '' }, { merge: true });
  return eventId;
};
export const deleteEvent = (id) => deleteDoc(doc(db, 'events', id));

// ---- Registrations ----
const regId = (eventId, uid) => `${eventId}_${uid}`;
export const getMyRegistration = async (eventId, uid) => {
  const s = await getDoc(doc(db, 'eventRegistrations', regId(eventId, uid))).catch(() => null);
  return s && s.exists() ? s.data() : null;
};
export const myRegistrations = async (uid) => {
  const s = await getDocs(query(collection(db, 'eventRegistrations'), where('uid', '==', uid)));
  return Object.fromEntries(s.docs.map((d) => [d.data().eventId, d.data()]));
};
export const registeredCount = async (eventId) => {
  const c = await getCountFromServer(
    query(collection(db, 'eventRegistrations'), where('eventId', '==', eventId), where('status', '==', 'registered'))
  ).catch(() => null);
  return c ? c.data().count : 0;
};
export const listRegistrations = async (eventId) => {
  const s = await getDocs(query(collection(db, 'eventRegistrations'), where('eventId', '==', eventId)));
  return s.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Register: a place if there's room, otherwise the waitlist. Returns the status.
export const register = async (event, uid, demo = {}) => {
  let status = 'registered';
  if (Number(event.capacity) > 0) {
    const n = await registeredCount(event.id);
    if (n >= Number(event.capacity)) status = 'waitlist';
  }
  await setDoc(doc(db, 'eventRegistrations', regId(event.id, uid)), {
    eventId: event.id,
    uid,
    status,
    present: !!demo.present,
    projectId: demo.projectId || null,
    projectTitle: demo.projectTitle || null,
    createdAt: serverTimestamp(),
  });
  return status;
};
export const cancelRegistration = (eventId, uid) => deleteDoc(doc(db, 'eventRegistrations', regId(eventId, uid)));
export const setPresenter = (eventId, uid, fields) =>
  updateDoc(doc(db, 'eventRegistrations', regId(eventId, uid)), fields);

// ---- Calendar ----
const icsDate = (ms) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsText = (t) => String(t || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
// An .ics file with a 30-minute alert, so her own calendar reminds her too.
export const downloadIcs = (event, joinUrl) => {
  const start = toMs(event.startAt);
  const url = `${SITE}/events?e=${event.id}`;
  const body = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//She Model Tech//Events//EN', 'BEGIN:VEVENT',
    `UID:${event.id}@shemodeltech.com`, `DTSTAMP:${icsDate(Date.now())}`,
    `DTSTART:${icsDate(start)}`, `DTEND:${icsDate(eventEnd(event))}`,
    `SUMMARY:${icsText(event.title)}`,
    `DESCRIPTION:${icsText(`${event.description || ''}\n\nJoin: ${joinUrl || url}`)}`,
    `LOCATION:${icsText(joinUrl || 'Online')}`, `URL:${url}`,
    'BEGIN:VALARM', 'TRIGGER:-PT30M', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(event.title)} starts in 30 minutes`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
  a.download = `${(event.title || 'event').replace(/[^\w]+/g, '-').toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
};
export const googleCalendarUrl = (event, joinUrl) => {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title || 'She Model Tech event',
    dates: `${icsDate(toMs(event.startAt))}/${icsDate(eventEnd(event))}`,
    details: `${event.description || ''}\n\nJoin: ${joinUrl || `${SITE}/events?e=${event.id}`}`,
    location: joinUrl || 'Online',
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
};
