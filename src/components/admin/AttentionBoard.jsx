// src/components/admin/AttentionBoard.jsx
// Admin > Overview: everything waiting on the team, in one place. Each card
// shows a count and opens the right screen. Cards with nothing waiting are quiet.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getCountFromServer, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';

const count = async (q) => {
  try {
    return (await getCountFromServer(q)).data().count;
  } catch (_) {
    return 0;
  }
};

const AttentionBoard = ({ isAdmin, onTab }) => {
  const [c, setC] = useState(null);
  useEffect(() => {
    (async () => {
      const [
        reviews, leadApps, proposals, orgNew, partnersNew, letters, deletions, mentorApps, extension, companies, capstone, sponsors, payments, jobDeletes,
      ] = await Promise.all([
        count(query(collection(db, 'projects'), where('reviewStatus', '==', 'submitted'))),
        count(query(collection(db, 'lead_applications'), where('status', 'in', ['submitted', 'interview_scheduled']))),
        count(query(collection(db, 'project_proposals'), where('status', '==', 'new'))),
        count(query(collection(db, 'org_requests'), where('status', '==', 'new'))),
        count(query(collection(db, 'summitPartners'), where('status', '==', 'new'))),
        count(query(collection(db, 'mentor_letter_requests'), where('status', '==', 'pending'))),
        isAdmin ? count(query(collection(db, 'deletionRequests'), where('status', '==', 'pending'))) : 0,
        isAdmin ? count(query(collection(db, 'teacher_applications'), where('status', '==', 'pending'))) : 0,
        count(query(collection(db, 'projects'), where('extensionRequest.status', '==', 'pending'))),
        (async () => {
          // Company accounts not yet verified (no badge yet).
          try {
            const s = await getDocs(query(collection(db, 'users'), where('isCompany', '==', true)));
            return s.docs.filter((d) => !d.data().isVerified).length;
          } catch (_) {
            return 0;
          }
        })(),
        (async () => {
          // Mentor courses waiting for approval.
          try {
            const s = await getDocs(collection(db, 'teacher_courses'));
            return s.docs.filter((d) => d.data().review?.status === 'pending' || d.data().removalRequest?.status === 'pending').length;
          } catch (_) {
            return 0;
          }
        })(),
        isAdmin ? count(query(collection(db, 'sponsor_requests'), where('status', '==', 'new'))) : 0,
        count(query(collection(db, 'projects'), where('status', '==', 'awaiting_payment_confirmation'))),
        count(query(collection(db, 'jobs'), where('status', '==', 'removal_requested'))),
      ]);
      setC({ reviews, leadApps, proposals, orgNew, partnersNew, letters, deletions, mentorApps, extension, capstone, companies, sponsors, payments, jobDeletes });
    })();
  }, [isAdmin]);

  if (!c) return <p className="text-gray-400 text-sm mb-6">Checking what needs attention…</p>;
  const cards = [
    ['Projects to review', c.reviews, 'Submitted by leads for She Model Tech review', { to: '/admin/projects' }],
    ['Lead applications', c.leadApps + c.proposals, `${c.leadApps} waiting · ${c.proposals} project proposal${c.proposals === 1 ? '' : 's'}`, { to: '/admin/lead-applications' }],
    ['Payments in progress', c.payments, 'Paid projects waiting on payments or confirmations', { to: '/disputes' }],
    ['Extra time requests', c.extension, 'Leads asking for more time', { to: '/admin/projects' }],
    ['Mentor courses', c.capstone, 'Courses to approve, or deletion requests', { tab: 'teachers' }],
    ['Mentor letters', c.letters, 'Recommendation and volunteer letters', { tab: 'teachers' }],
    ...(isAdmin ? [['Mentor applications', c.mentorApps, 'People applying to mentor', { tab: 'teachers' }]] : []),
    ...(isAdmin ? [['Companies to verify', c.companies, 'New company accounts waiting for verification', { tab: 'users', view: 'unverified' }]] : []),
    ...(isAdmin ? [['Sponsorship requests', c.sponsors, 'Companies asking to sponsor a cohort', { to: '/admin/cohorts' }]] : []),
    ['Job post deletion requests', c.jobDeletes, 'Companies asking to delete a job post (unpublished meanwhile)', { to: '/jobs' }],
    ['Organization requests', c.orgNew, 'New training or licensing requests', { tab: 'organizations' }],
    ['Summit partners', c.partnersNew, 'New booth, workshop, or sponsor requests', { tab: 'summit' }],
    ...(isAdmin ? [['Deletion requests', c.deletions, 'Leads asking to delete a project', { tab: 'deletions' }]] : []),
  ];
  const total = cards.reduce((n, x) => n + (x[1] || 0), 0);

  return (
    <div className="mb-8">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">Needs your attention</h2>
        <span className={`text-sm font-semibold ${total ? 'text-pink-700' : 'text-emerald-700'}`}>{total ? `${total} waiting` : 'All clear'}</span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map(([label, n, sub, go]) => {
          const inner = (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <span className={`min-w-[2rem] text-center text-sm font-bold px-2 py-0.5 rounded-full ${n ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{n}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{sub}</p>
            </>
          );
          const cls = `block text-left rounded-xl border p-4 transition ${n ? 'border-pink-200 bg-white hover:border-pink-400' : 'border-gray-100 bg-gray-50 opacity-70'}`;
          return go.to ? (
            <Link key={label} to={go.to} className={cls}>{inner}</Link>
          ) : (
            <button key={label} type="button" onClick={() => onTab(go.tab, go.view)} className={cls}>{inner}</button>
          );
        })}
      </div>
    </div>
  );
};

export default AttentionBoard;
