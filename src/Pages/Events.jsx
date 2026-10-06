// src/Pages/Events.jsx
// She Model Tech events (all online): upcoming events to register for, and
// past events with recordings. Visitors can browse; registering needs an account.
// The joining link appears only for people with a place.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { signInAndReturn } from './learning/LearningLayout';
import { alertStaff, notifyMember } from '../utils/staffAlerts';
import ShareButtons, { shareUrl } from '../components/ShareButtons';
import {
  CATEGORY_LABEL, EVENT_CATEGORIES, cancelRegistration, downloadIcs, formatWhen, getJoinUrl, getRecordingUrl,
  getEvent, getMyRegistration, googleCalendarUrl, isListed, isPast, listPublishedEvents, myRegistrations, register,
} from '../utils/events';

// Three cards across on large screens (two on tablets, one on phones). With more
// than fit, the row scrolls sideways with arrows and swipe.
const EventRow = ({ items, render }) => {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  const update = () => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  };
  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [items.length]);
  const move = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth, behavior: 'smooth' });
  const scrolls = !(edges.start && edges.end);
  return (
    <div className="relative mt-4">
      <div
        ref={ref}
        onScroll={update}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((e) => (
          <div key={e.id} className="snap-start flex-none w-[85%] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]">
            {render(e)}
          </div>
        ))}
      </div>
      {scrolls && (
        <div className="mt-3 flex items-center justify-end gap-2">
          <button onClick={() => move(-1)} disabled={edges.start} aria-label="Previous events" className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-800 hover:border-gray-500 disabled:opacity-30">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => move(1)} disabled={edges.end} aria-label="More events" className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-800 hover:border-gray-500 disabled:opacity-30">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </div>
  );
};

// Short text for sharing an event.
const shareText = (e) => `Join me at "${e.title}", a free online ${(CATEGORY_LABEL[e.category] || 'event').toLowerCase()} with She Model Tech on ${new Date(e.startAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}.`;

// What you can do with one event: register, join, calendar, present, recording.
const EventActions = ({ e, reg, currentUser, onChange, onRegistered }) => {
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

  // Recordings are for members: load the link only for signed-in people.
  const hasRecording = !!(e.hasRecording || e.recordingUrl);
  const [recUrl, setRecUrl] = useState('');
  useEffect(() => {
    if (past && hasRecording && currentUser) getRecordingUrl(e).then(setRecUrl).catch(() => {});
  }, [past, hasRecording, currentUser, e]);

  const loadProjects = async () => {
    setDemoOpen(true);
    if (myProjects) return;
    const s = await getDocs(query(collection(db, 'projects'), where('members', 'array-contains', currentUser.uid))).catch(() => null);
    setMyProjects((s?.docs || []).map((d) => ({ id: d.id, title: d.data().projectTitle || d.data().title || 'My project' })));
  };

  const doRegister = async (present = false) => {
    if (!currentUser) return signInAndReturn(navigate, `/events/${e.id}`);
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
            link: `/events/${e.id}`,
            ctaLabel: 'See the event',
          }
        : {
            type: 'event_waitlist',
            title: `You’re on the waitlist: ${e.title}`,
            body: `${when}. The event is full right now. If a place opens up, you’ll move up automatically and we’ll let you know.`,
            link: `/events/${e.id}`,
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
      if (status === 'registered' && onRegistered) onRegistered();
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
    <div>
      {past ? (
        hasRecording ? (
          currentUser ? (
            recUrl ? (
              <a href={recUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">Watch the recording</a>
            ) : null
          ) : (
            <button onClick={() => signInAndReturn(navigate, `/events/${e.id}`)} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
              Sign in to watch the recording
            </button>
          )
        ) : null
      ) : cancelled ? null : (
        <div>
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
    </div>
  );
};

// A preview in the grid: the same size for every event. The whole card opens it.
const EventPreview = ({ e, reg }) => {
  const past = isPast(e);
  const cancelled = e.status === 'cancelled';
  const status = cancelled
    ? 'Cancelled'
    : past
    ? (e.hasRecording || e.recordingUrl ? 'Recording available' : 'Past event')
    : reg?.status === 'registered'
    ? '✓ You’re registered'
    : reg?.status === 'waitlist'
    ? 'You’re on the waitlist'
    : '';
  return (
    <Link to={`/events/${e.id}`} className="group h-full flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-pink-300 hover:shadow-sm transition">
      {e.imageUrl ? (
        <img src={e.imageUrl} alt="" loading="lazy" className="w-full h-40 object-cover bg-gray-50" />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center" aria-hidden="true">
          <span className="text-pink-700 font-bold">{CATEGORY_LABEL[e.category] || 'Event'}</span>
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-1 rounded-full bg-pink-50 text-pink-700">{CATEGORY_LABEL[e.category] || 'Event'}</span>
          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">Online</span>
        </div>
        <h3 className="mt-3 text-lg font-bold text-gray-900 leading-snug line-clamp-2">{e.title}</h3>
        <p className="mt-1 text-sm font-semibold text-gray-700">{formatWhen(e)}</p>
        {e.description && <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-2">{e.description}</p>}
        <div className="mt-auto pt-4 flex items-center justify-between gap-3 text-sm">
          <span className={`font-semibold ${cancelled ? 'text-red-700' : 'text-gray-900'}`}>{status}</span>
          <span className="font-semibold text-pink-700 group-hover:underline whitespace-nowrap">View event →</span>
        </div>
      </div>
    </Link>
  );
};

// One event, in full: details, actions, and sharing.
export const EventDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [e, setE] = useState(undefined);
  const [reg, setReg] = useState(null);
  const [justRegistered, setJustRegistered] = useState(false);

  const load = () => {
    getEvent(id).then((x) => setE(x && (x.published || false) ? x : null)).catch(() => setE(null));
    if (currentUser) getMyRegistration(id, currentUser.uid).then(setReg).catch(() => setReg(null));
    else setReg(null);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [id, currentUser]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8">
        <Link to="/events" className="text-sm font-semibold text-pink-700 hover:underline">← All events</Link>
        {e === undefined ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600" /></div>
        ) : e === null ? (
          <div className="py-16">
            <h1 className="text-2xl font-bold text-gray-900">This event isn’t available</h1>
            <p className="text-gray-600 mt-2">It may have been removed. See what’s coming up on the Events page.</p>
          </div>
        ) : (
          <article className="mt-4">
            {e.imageUrl && (
              <a href={e.imageUrl} target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden border border-gray-200 bg-gray-50" aria-label="Open the flyer full size">
                <img src={e.imageUrl} alt={`${e.title} flyer`} className="w-full max-h-[520px] object-contain" />
              </a>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="px-2.5 py-1 rounded-full bg-pink-50 text-pink-700">{CATEGORY_LABEL[e.category] || 'Event'}</span>
              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">Online</span>
              {e.status === 'cancelled' && <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700">Cancelled</span>}
              {isPast(e) && e.status !== 'cancelled' && <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">Past event</span>}
            </div>
            <h1 className="mt-3 text-3xl font-bold text-gray-900 leading-tight">{e.title}</h1>
            <p className="mt-2 font-semibold text-gray-800">{formatWhen(e)}{e.durationMins ? ` · ${e.durationMins} min` : ''}</p>
            {e.hosts && <p className="mt-1 text-gray-600">With {e.hosts}</p>}
            {e.description && <p className="mt-5 text-gray-700 leading-relaxed whitespace-pre-line">{e.description}</p>}

            <div className="mt-6">
              <EventActions e={e} reg={reg} currentUser={currentUser} onChange={load} onRegistered={() => setJustRegistered(true)} />
            </div>

            {justRegistered ? (
              <section className="mt-8 rounded-2xl bg-pink-50 border border-pink-200 p-5" aria-label="Invite a friend">
                <p className="font-bold text-gray-900">You’re in! Invite a friend</p>
                <p className="text-sm text-gray-600 mt-0.5 mb-3">Events are better together. Share it with someone who’d enjoy it.</p>
                <ShareButtons url={shareUrl('e', e.id)} text={`I’m attending "${e.title}" with She Model Tech. Join me!`} title={e.title} />
              </section>
            ) : (
              e.status !== 'cancelled' && (
                <section className="mt-8 border-t border-gray-200 pt-6" aria-label="Share this event">
                  <p className="font-semibold text-gray-900 mb-3">Share this event</p>
                  <ShareButtons url={shareUrl('e', e.id)} text={shareText(e)} title={e.title} />
                </section>
              )
            )}
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
};

const Events = () => {
  const { currentUser } = useAuth();
  const [params] = useSearchParams();
  const focus = params.get('e');
  const [events, setEvents] = useState(null);
  const [regs, setRegs] = useState({});
  const [cat, setCat] = useState('all');
  const navigate = useNavigate();
  // Older links (/events?e=…) open the event's own page.
  useEffect(() => {
    if (focus) navigate(`/events/${focus}`, { replace: true });
  }, [focus, navigate]);

  const load = () => {
    listPublishedEvents().then(setEvents).catch(() => setEvents([]));
    if (currentUser) myRegistrations(currentUser.uid).then(setRegs).catch(() => setRegs({}));
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [currentUser]);


  const { upcoming, past } = useMemo(() => {
    const list = (events || []).filter((e) => isListed(e) && (cat === 'all' || e.category === cat));
    return {
      upcoming: list.filter((e) => !isPast(e)),
      past: list.filter((e) => isPast(e)).reverse(),
    };
  }, [events, cat]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
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
              <EventRow
                items={upcoming}
                render={(e) => <EventPreview e={e} reg={regs[e.id]} />}
              />
            )}

            {past.length > 0 && (
              <>
                <h2 className="mt-12 text-xl font-bold text-gray-900">Past events</h2>
                <EventRow
                  items={past}
                  render={(e) => <EventPreview e={e} reg={regs[e.id]} />}
                />
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
