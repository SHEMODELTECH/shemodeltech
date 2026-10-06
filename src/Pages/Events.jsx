// src/Pages/Events.jsx
// She Model Tech events (all online): upcoming events to register for, and
// past events with recordings. Visitors can browse; registering needs an account.
// The joining link appears only for people with a place.
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { signInAndReturn } from './learning/LearningLayout';
import { alertStaff, notifyMember } from '../utils/staffAlerts';
import {
  CATEGORY_LABEL, EVENT_CATEGORIES, cancelRegistration, downloadIcs, formatWhen, getJoinUrl,
  googleCalendarUrl, isPast, listPublishedEvents, myRegistrations, register,
} from '../utils/events';

const EventCard = ({ e, reg, currentUser, onChange, highlight }) => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [joinUrl, setJoinUrl] = useState('');
  const [demoOpen, setDemoOpen] = useState(false);
  const [myProjects, setMyProjects] = useState(null);
  const [pick, setPick] = useState('');
  const past = isPast(e);
  const cancelled = e.status === 'cancelled';
  const placed = reg?.status === 'registered';

  useEffect(() => {
    if (placed && !past && !cancelled) getJoinUrl(e.id).then(setJoinUrl).catch(() => {});
  }, [placed, past, cancelled, e.id]);

  const loadProjects = async () => {
    setDemoOpen(true);
    if (myProjects) return;
    const s = await getDocs(query(collection(db, 'projects'), where('members', 'array-contains', currentUser.uid))).catch(() => null);
    setMyProjects((s?.docs || []).map((d) => ({ id: d.id, title: d.data().projectTitle || d.data().title || 'My project' })));
  };

  const doRegister = async (present = false) => {
    if (!currentUser) return signInAndReturn(navigate, `/events?e=${e.id}`);
    if (present && !pick) return toast.error('Choose the project you’d like to present.');
    setBusy(true);
    try {
      const project = (myProjects || []).find((p) => p.id === pick);
      const status = await register(e, currentUser.uid, present ? { present: true, projectId: project.id, projectTitle: project.title } : {});
      const when = formatWhen(e);
      await notifyMember(currentUser.uid, status === 'registered'
        ? {
            type: 'event_registered',
            title: `You’re registered: ${e.title}`,
            body: `${when}. It’s online: we’ll email you the joining link 1 day and 30 minutes before. You can also add it to your calendar from the Events page.`,
            link: `/events?e=${e.id}`,
            ctaLabel: 'See the event',
          }
        : {
            type: 'event_waitlist',
            title: `You’re on the waitlist: ${e.title}`,
            body: `${when}. The event is full right now. If a place opens up, you’ll move up automatically and we’ll let you know.`,
            link: `/events?e=${e.id}`,
            ctaLabel: 'See the event',
          });
      if (present) {
        alertStaff({
          type: 'demo_presenter',
          title: `Demo day presenter: ${project.title}`,
          body: `${currentUser.displayName || currentUser.email} would like to present "${project.title}" at ${e.title}.`,
          link: '/admin?tab=events',
          sendEmail: false,
        });
      }
      toast.success(status === 'registered' ? 'You’re registered. Check your email.' : 'The event is full, so you’re on the waitlist.');
      setDemoOpen(false);
      onChange();
    } catch (err) {
      toast.error('Could not register you. Please try again.');
    }
    setBusy(false);
  };

  const doCancel = async () => {
    setBusy(true);
    try {
      await cancelRegistration(e.id, currentUser.uid);
      toast.success('Your registration is cancelled.');
      onChange();
    } catch (_) {
      toast.error('Could not cancel. Please try again.');
    }
    setBusy(false);
  };

  return (
    <article id={`e-${e.id}`} className={`rounded-2xl border p-5 sm:p-6 bg-white scroll-mt-28 ${highlight ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200'}`}>
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
        <span className="px-2.5 py-1 rounded-full bg-pink-50 text-pink-700">{CATEGORY_LABEL[e.category] || 'Event'}</span>
        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">Online</span>
        {cancelled && <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700">Cancelled</span>}
      </div>
      <h3 className="mt-3 text-xl font-bold text-gray-900">{e.title}</h3>
      <p className="mt-1 text-sm font-semibold text-gray-700">{formatWhen(e)}{e.durationMins ? ` · ${e.durationMins} min` : ''}</p>
      {e.hosts && <p className="mt-1 text-sm text-gray-600">With {e.hosts}</p>}
      {e.description && <p className="mt-3 text-gray-600 leading-relaxed whitespace-pre-line">{e.description}</p>}

      {past ? (
        e.recordingUrl ? (
          <a href={e.recordingUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-sm font-semibold text-pink-700 hover:underline">Watch the recording →</a>
        ) : null
      ) : cancelled ? null : (
        <div className="mt-5">
          {placed ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-900">✓ You’re registered{reg.present ? ` and asked to present “${reg.projectTitle}”` : ''}.</p>
              <div className="flex flex-wrap gap-2">
                {joinUrl && (
                  <a href={joinUrl} target="_blank" rel="noopener noreferrer" className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">Join link</a>
                )}
                <a href={googleCalendarUrl(e, joinUrl)} target="_blank" rel="noopener noreferrer" className="border border-gray-300 text-gray-800 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50">Add to Google Calendar</a>
                <button onClick={() => downloadIcs(e, joinUrl)} className="border border-gray-300 text-gray-800 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50">Download calendar file</button>
                <button onClick={doCancel} disabled={busy} className="text-sm font-semibold text-gray-500 hover:text-gray-900 px-2">Cancel my place</button>
              </div>
            </div>
          ) : reg?.status === 'waitlist' ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold text-gray-900">You’re on the waitlist. We’ll let you know if a place opens.</p>
              <button onClick={doCancel} disabled={busy} className="text-sm font-semibold text-gray-500 hover:text-gray-900">Leave the waitlist</button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => doRegister(false)} disabled={busy} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50">
                  {currentUser ? 'Register' : 'Sign in to register'}
                </button>
                {currentUser && e.category === 'demoday' && !demoOpen && (
                  <button onClick={loadProjects} className="border border-pink-300 text-pink-700 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-pink-50">I’d like to present</button>
                )}
              </div>
              {demoOpen && (
                <div className="rounded-xl bg-pink-50 border border-pink-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">Which project would you like to present?</p>
                  <p className="text-xs text-gray-600 mt-0.5">Presenting is optional. She Model Tech will confirm your slot.</p>
                  {myProjects === null ? (
                    <p className="text-sm text-gray-500 mt-2">Loading your projects…</p>
                  ) : myProjects.length === 0 ? (
                    <p className="text-sm text-gray-700 mt-2">You’re not on a project yet. You can still register to watch.</p>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <select value={pick} onChange={(x) => setPick(x.target.value)} className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm" aria-label="Project">
                        <option value="">Choose a project</option>
                        {myProjects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                      </select>
                      <button onClick={() => doRegister(true)} disabled={busy} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50">Register and ask to present</button>
                    </div>
                  )}
                </div>
              )}
              {Number(e.capacity) > 0 && <p className="text-xs text-gray-500">Limited to {e.capacity} places. When it’s full, you can join the waitlist.</p>}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

const Events = () => {
  const { currentUser } = useAuth();
  const [params] = useSearchParams();
  const focus = params.get('e');
  const [events, setEvents] = useState(null);
  const [regs, setRegs] = useState({});
  const [cat, setCat] = useState('all');

  const load = () => {
    listPublishedEvents().then(setEvents).catch(() => setEvents([]));
    if (currentUser) myRegistrations(currentUser.uid).then(setRegs).catch(() => setRegs({}));
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [currentUser]);

  useEffect(() => {
    if (focus && events) setTimeout(() => document.getElementById(`e-${focus}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, [focus, events]);

  const { upcoming, past } = useMemo(() => {
    const list = (events || []).filter((e) => cat === 'all' || e.category === cat);
    return {
      upcoming: list.filter((e) => !isPast(e)),
      past: list.filter((e) => isPast(e)).reverse(),
    };
  }, [events, cat]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        <p className="text-sm font-semibold text-pink-700">Events</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">Learn, share, and celebrate together</h1>
        <p className="text-gray-600 text-lg mt-3 max-w-2xl">
          Free online workshops, tech talks, podcasts, live demos, and demo days where teams show what they built.
        </p>

        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by type">
          {[['all', 'All events'], ...EVENT_CATEGORIES].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setCat(k)}
              aria-pressed={cat === k}
              className={`text-sm font-semibold px-3.5 py-1.5 rounded-full border ${cat === k ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-gray-500'}`}
            >
              {l}
            </button>
          ))}
        </div>

        {events === null ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600" /></div>
        ) : (
          <>
            <h2 className="mt-10 text-xl font-bold text-gray-900">Upcoming</h2>
            {upcoming.length === 0 ? (
              <p className="mt-3 text-gray-600">No upcoming events right now. New events are announced by email and in your notifications.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {upcoming.map((e) => (
                  <EventCard key={e.id} e={e} reg={regs[e.id]} currentUser={currentUser} onChange={load} highlight={focus === e.id} />
                ))}
              </div>
            )}

            {past.length > 0 && (
              <>
                <h2 className="mt-12 text-xl font-bold text-gray-900">Past events</h2>
                <div className="mt-4 space-y-4">
                  {past.map((e) => (
                    <EventCard key={e.id} e={e} reg={regs[e.id]} currentUser={currentUser} onChange={load} highlight={focus === e.id} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Events;
