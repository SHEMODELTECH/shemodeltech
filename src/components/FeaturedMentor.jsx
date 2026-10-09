// src/components/FeaturedMentor.jsx
// "Featured mentor" in the Proof Wall sidebar: one mentor with a published
// course at a time, changing once a day. Everyone sees the same mentor on the
// same day (the day number picks her from the list), so nothing is stored.
// "See her courses" opens Learning already searched for her name.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { listPublished, toCatalogCourse } from '../utils/learningPublished';
import { getPublicCourseStats, statsFor } from '../utils/courseStats';

const DAY_MS = 24 * 60 * 60 * 1000;

const FeaturedMentor = () => {
  const [mentor, setMentor] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [list, stats] = await Promise.all([listPublished(), getPublicCourseStats().catch(() => ({}))]);
        const byAuthor = {};
        list.map(toCatalogCourse).forEach((c) => {
          if (!c.authorName) return;
          const key = c.authorUid || c.authorName;
          const a = byAuthor[key] || (byAuthor[key] = { key, uid: c.authorUid, name: c.authorName, photo: null, courses: 0, ratingSum: 0, ratingCount: 0 });
          a.courses += 1;
          if (!a.photo && c.authorPhotoURL) a.photo = c.authorPhotoURL;
          const st = statsFor(stats, c.track, c.slug);
          if (st?.ratingCount) {
            a.ratingSum += st.ratingAvg * st.ratingCount;
            a.ratingCount += st.ratingCount;
          }
        });
        // A fixed order, so the daily rotation goes through everyone in turn.
        const authors = Object.values(byAuthor).sort((x, y) => x.key.localeCompare(y.key));
        if (!authors.length) return;
        const pick = authors[Math.floor(Date.now() / DAY_MS) % authors.length];
        // Older courses were published before photos were saved on them.
        if (!pick.photo && pick.uid) {
          try {
            const u = await getDoc(doc(db, 'users', pick.uid));
            if (u.exists() && u.data().photoURL) pick.photo = u.data().photoURL;
          } catch (_) {
            /* no photo: the initial shows instead */
          }
        }
        if (alive) setMentor(pick);
      } catch (_) {
        /* nothing to feature */
      }
    })();
    return () => { alive = false; };
  }, []);

  if (!mentor) return null;
  const avg = mentor.ratingCount ? mentor.ratingSum / mentor.ratingCount : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-pink-700 mb-3">Featured mentor</p>
      <div className="flex items-center gap-3">
        {mentor.photo ? (
          <img src={mentor.photo} alt="" className="w-14 h-14 rounded-full object-cover border border-pink-100" />
        ) : (
          <span className="w-14 h-14 rounded-full bg-pink-600 text-white text-xl font-bold flex items-center justify-center" aria-hidden="true">
            {mentor.name[0]}
          </span>
        )}
        <div className="min-w-0">
          <p className="font-bold text-gray-900 truncate">{mentor.name}</p>
          <p className="text-sm text-gray-600">
            {mentor.courses} course{mentor.courses === 1 ? '' : 's'}
            {mentor.ratingCount ? (
              <>
                {' · '}<span className="text-pink-600" aria-hidden="true">★</span> {avg.toFixed(1)}
                <span className="sr-only">{` rated ${avg.toFixed(1)} out of 5`}</span>
              </>
            ) : null}
          </p>
        </div>
      </div>
      <Link
        to={`/learning?q=${encodeURIComponent(mentor.name)}`}
        className="mt-4 block text-center text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg"
      >
        See her courses
      </Link>
    </div>
  );
};

export default FeaturedMentor;
