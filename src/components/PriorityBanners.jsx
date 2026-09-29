// src/components/PriorityBanners.jsx
// Premium extras shown around the app:
//   <PrioritySupport />   Support page: a direct line to the team for Premium members.
//   <PromotedStrip />     Dashboard: featured jobs and projects (in-app promotion).
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { hasPrioritySupport } from '../config/premium';
import { getStaff } from '../utils/staffAlerts';
import PremiumBadge from './PremiumBadge';
import { companyTier } from '../config/tiers';
import { useFeatures } from '../utils/features';

export const PrioritySupport = () => {
  const { currentUser } = useAuth();
  const features = useFeatures();
  const navigate = useNavigate();
  const [premium, setPremium] = useState(false);
  const [teamUid, setTeamUid] = useState(null);
  useEffect(() => {
    if (!currentUser) return;
    // Mentors always; Champion companies once Company tiers is on.
    getDoc(doc(db, 'users', currentUser.uid)).then((s) => { const d = s.data() || {}; setPremium(d.isCompany ? features.companyTiers && hasPrioritySupport(d) : hasPrioritySupport(d)); }).catch(() => {});
    getStaff(['admin']).then((s) => s[0] && setTeamUid(s[0].uid)).catch(() => {});
  }, [currentUser, features.companyTiers]);
  if (!premium) return null;
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="font-semibold text-gray-900">Priority support</p>
        <p className="text-sm text-gray-700 mt-1">Message the She Model Tech team directly. Your requests are handled first.</p>
      </div>
      {teamUid && (
        <button
          onClick={() => navigate(`/messages?to=${teamUid}&text=${encodeURIComponent('[Priority support] Hi team, I need help with: ')}`)}
          className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Message the team
        </button>
      )}
    </div>
  );
};

export const PromotedStrip = () => {
  const [items, setItems] = useState(null);
  useEffect(() => {
    Promise.all([
      getDocs(query(collection(db, 'jobs'), where('featured', '==', true), limit(10))).catch(() => null),
      getDocs(query(collection(db, 'projects'), where('featured', '==', true), limit(10))).catch(() => null),
      // Champion companies' jobs (in-app promotion).
      getDocs(query(collection(db, 'jobs'), where('promoted', '==', true), limit(10))).catch(() => null),
    ]).then(async ([j, p, pr]) => {
      const now = new Date().toISOString();
      const open = (x) => x.status === 'open' && (!x.expiresAt || x.expiresAt > now);
      const featuredJobs = j ? j.docs.map((d) => ({ id: d.id, ...d.data() })).filter(open) : [];
      // Only keep promoted jobs whose company is still a Champion.
      let promotedJobs = pr ? pr.docs.map((d) => ({ id: d.id, ...d.data() })).filter(open) : [];
      const tiers = await Promise.all(promotedJobs.map((x) => getDoc(doc(db, 'users', x.companyUid)).then((u) => companyTier(u.data())).catch(() => null)));
      promotedJobs = promotedJobs.filter((_, i) => tiers[i] === 'champion');
      const seen = new Set();
      const jobs = [...promotedJobs, ...featuredJobs]
        .filter((x) => (seen.has(x.id) ? false : seen.add(x.id)))
        .map((x) => ({ kind: 'Job', title: x.title, sub: x.companyName, href: `/jobs/${x.id}` }));
      const projects = p
        ? p.docs.map((d) => ({ id: d.id, ...d.data() })).filter((x) => x.status !== 'completed')
            .map((x) => ({ kind: x.isPaid ? 'Paid project' : 'Project', title: x.projectTitle, sub: x.projectField || x.industryTrack || '', href: `/projects/${x.id}` }))
        : [];
      setItems([...jobs, ...projects].slice(0, 4));
    });
  }, []);
  if (!items || items.length === 0) return null;
  return (
    <div className="bg-white border border-pink-200 rounded-xl p-5 mb-6">
      <p className="text-xs font-bold uppercase tracking-wider text-pink-700 flex items-center gap-2">
        <PremiumBadge kind="featured" /> Promoted opportunities
      </p>
      <div className="grid sm:grid-cols-2 gap-3 mt-3">
        {items.map((it) => (
          <Link key={it.href} to={it.href} className="block border border-gray-200 rounded-lg p-3 hover:border-pink-300">
            <p className="text-[11px] font-semibold text-gray-500">{it.kind}</p>
            <p className="font-semibold text-gray-900 truncate">{it.title}</p>
            {it.sub && <p className="text-xs text-gray-500 truncate">{it.sub}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
};
