// src/components/EventsCard.jsx
// Dashboard card: the next upcoming event, with a link to Events.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_LABEL, formatWhen, isPast, listPublishedEvents } from '../utils/events';

const EventsCard = () => {
  const [next, setNext] = useState(null);
  useEffect(() => {
    listPublishedEvents()
      .then((list) => setNext(list.find((e) => !isPast(e) && e.status !== 'cancelled') || null))
      .catch(() => setNext(null));
  }, []);
  if (!next) return null;
  return (
    <div className="mb-6 rounded-xl border border-pink-200 bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-pink-700">Next event · {CATEGORY_LABEL[next.category] || 'Event'}</p>
        <p className="text-lg font-bold text-gray-900 mt-1">{next.title}</p>
        <p className="text-sm text-gray-700">{formatWhen(next)} · Online</p>
      </div>
      <Link to={`/events?e=${next.id}`} className="flex-shrink-0 text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-center">
        See the event
      </Link>
    </div>
  );
};

export default EventsCard;
