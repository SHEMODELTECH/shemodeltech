// src/components/EventsCard.jsx
// Dashboard card: an event coming up in the next 7 days that this member
// hasn't signed up for yet (registered or on the waitlist). Nothing to show
// otherwise; the Events page in the menu lists everything.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CATEGORY_LABEL, formatWhen, getMyRegistration, isPast, listPublishedEvents } from '../utils/events';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const startMs = (e) => {
  const v = e.startAt;
  if (!v) return 0;
  if (typeof v.toMillis === 'function') return v.toMillis();
  return new Date(v).getTime() || 0;
};

const EventsCard = () => {
  const { currentUser } = useAuth();
  const [next, setNext] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const now = Date.now();
        const soon = (await listPublishedEvents())
          .filter((e) => !isPast(e) && e.status !== 'cancelled' && startMs(e) - now <= WEEK_MS)
          .sort((a, b) => startMs(a) - startMs(b));
        for (const e of soon) {
          // Already signed up (registered or waitlisted)? Then she doesn't need the reminder.
          const reg = currentUser ? await getMyRegistration(e.id, currentUser.uid) : null;
          if (!reg) {
            if (alive) setNext(e);
            return;
          }
        }
        if (alive) setNext(null);
      } catch (_) {
        if (alive) setNext(null);
      }
    })();
    return () => { alive = false; };
  }, [currentUser]);

  if (!next) return null;
  return (
    <div className="mb-6 rounded-xl border border-pink-200 bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-pink-700">Coming up this week · {CATEGORY_LABEL[next.category] || 'Event'}</p>
        <p className="text-lg font-bold text-gray-900 mt-1">{next.title}</p>
        <p className="text-sm text-gray-700">{formatWhen(next)} · Online</p>
      </div>
      <Link to={`/events/${next.id}`} className="flex-shrink-0 text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-center">
        See the event
      </Link>
    </div>
  );
};

export default EventsCard;
