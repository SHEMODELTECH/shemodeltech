// src/components/TeamStrength.jsx
// Paid projects award no badges, but show the team's strength: each approved
// member's chosen track and current level, e.g. "TechDev: Associate, Novice".
import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { badgesInTrack, levelForCount, trackByKey, suggestTrack } from '../config/badgeTracks';

const TeamStrength = ({ projectId }) => {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    if (!projectId) return;
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, 'project_applications'), where('projectId', '==', projectId), where('status', '==', 'approved')));
        const people = await Promise.all(snap.docs.map(async (d) => {
          const a = d.data();
          const key = a.badgeTrack || suggestTrack(a.role);
          const u = a.applicantUid ? await getDoc(doc(db, 'users', a.applicantUid)).catch(() => null) : null;
          const lvl = levelForCount(badgesInTrack(u?.data?.() || {}, key));
          return { key, lvl: lvl || 'No badge yet' };
        }));
        const byTrack = {};
        people.forEach((p) => { (byTrack[p.key] = byTrack[p.key] || []).push(p.lvl); });
        setRows(Object.entries(byTrack));
      } catch (_) {
        setRows([]);
      }
    })();
  }, [projectId]);
  if (!rows || rows.length === 0) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      <p className="text-sm font-bold text-gray-900">Team strength</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {rows.map(([key, lvls]) => (
          <li key={key} className="text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1 text-gray-800">
            <strong>{trackByKey(key)?.name || key}</strong>: {lvls.join(', ')}
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-gray-500 mt-2">Each member’s chosen track and current level. No badges are awarded on paid projects.</p>
    </div>
  );
};

export default TeamStrength;
