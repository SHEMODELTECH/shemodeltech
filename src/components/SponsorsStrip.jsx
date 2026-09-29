// src/components/SponsorsStrip.jsx
// "Thank you to our sponsors": logos of companies that funded a cohort.
// Hidden when there are no current sponsors.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { activeSponsors, listSponsors } from '../utils/sponsors';

const SponsorsStrip = ({ className = '' }) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    listSponsors().then((l) => setItems(activeSponsors(l))).catch(() => setItems([]));
  }, []);
  if (!items.length) return null;
  return (
    <section className={`rounded-2xl border border-pink-100 bg-white p-6 text-center ${className}`} aria-label="Our sponsors">
      <p className="text-sm font-bold uppercase tracking-widest text-pink-700">Thank you to our sponsors</p>
      <p className="text-sm text-gray-600 mt-1">These companies funded a She Model Tech cohort.</p>
      <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 list-none p-0">
        {items.map((s) => (
          <li key={s.id}>
            {s.url ? (
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:opacity-80">
                <img src={s.logoUrl} alt={s.name} className="h-12 w-auto max-w-[160px] object-contain" />
                <span className="text-xs text-gray-600">{s.name}</span>
              </a>
            ) : (
              <span className="flex flex-col items-center gap-2">
                <img src={s.logoUrl} alt={s.name} className="h-12 w-auto max-w-[160px] object-contain" />
                <span className="text-xs text-gray-600">{s.name}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
      <Link to="/support-our-mission" className="inline-block mt-5 text-sm font-semibold text-pink-700 hover:underline">Fund a cohort</Link>
    </section>
  );
};

export default SponsorsStrip;
