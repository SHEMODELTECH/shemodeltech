// src/components/DeadlineBanner.jsx
//
// Shows the whole team where they stand: a countdown to the start (cohorts have
// a fixed start date and time), then to the deadline.
//  - Cohort projects: She Model Tech sets the dates; the lead can request extra
//    time, which staff approve.
//  - Other projects: the lead can change the dates in Edit project.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { alertStaff } from '../utils/staffAlerts';
import { daysUntil, GRACE_PERIOD_DAYS } from '../utils/cohorts';

const DeadlineBanner = ({ project }) => {
  const { currentUser } = useAuth();
  const isLead = !!currentUser && currentUser.uid === project?.submitterId;
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(7);
  const [reason, setReason] = useState('');
  const [sending, setSending] = useState(false);
  const [requested, setRequested] = useState(project?.extensionRequest?.status === 'pending');

  const requestTime = async () => {
    if (reason.trim().split(/\s+/).filter(Boolean).length < 5) return toast.error('Tell us why in at least 5 words.');
    setSending(true);
    try {
      await updateDoc(doc(db, 'projects', project.id), {
        extensionRequest: { status: 'pending', days: Number(days), reason: reason.trim(), by: currentUser.uid, at: new Date().toISOString() },
      });
      alertStaff({
        type: 'extension_requested',
        title: 'A lead asked for extra time',
        body: `"${project.projectTitle || 'A project'}": ${days} more days. ${reason.trim().slice(0, 140)}`,
        link: '/admin',
        roles: ['admin', 'editor'],
      });
      setRequested(true);
      setOpen(false);
      toast.success('Request sent. We’ll let you know.');
    } catch (e) {
      toast.error('Could not send the request.');
    }
    setSending(false);
  };

  // Before a cohort starts: count down to the fixed start date and time.
  if (project?.startAt && new Date(project.startAt) > new Date() && !['completed', 'cancelled'].includes(project.status)) {
    const ms = new Date(project.startAt) - new Date();
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000);
    const when = new Date(project.startAt).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    return (
      <div className="rounded-xl p-4 mb-5 border bg-indigo-50 border-indigo-200">
        <p className="font-bold text-sm text-indigo-900">
          {d > 0 ? `Starts in ${d} day${d === 1 ? '' : 's'}` : `Starts in ${h} hour${h === 1 ? '' : 's'}`}
        </p>
        <p className="text-gray-600 text-xs mt-0.5">Starts {when} · deadline {project.endDate}. Everyone in this cohort starts and finishes together.</p>
      </div>
    );
  }

  if (!project?.endDate) return null;
  if (['completed', 'awaiting_payment_confirmation', 'cancelled'].includes(project.status)) {
    return null;
  }

  const daysLeft = daysUntil(project.endDate);
  if (daysLeft === null) return null;

  const graceWindow = GRACE_PERIOD_DAYS + (project.extensionDays || 0);
  const graceUsed = -daysLeft;
  const inGrace = daysLeft < 0 && graceUsed <= graceWindow;
  const lapsed = project.status === 'lapsed' || graceUsed > graceWindow;

  // --- Lapsed -------------------------------------------------------
  if (lapsed) {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 mb-5">
        <p className="text-gray-900 font-bold text-sm mb-1">This project has lapsed</p>
        <p className="text-gray-600 text-xs leading-relaxed">
          The deadline and grace period have passed. Your work stays here and stays visible, nothing
          is deleted. You can still submit late, and a reviewer can still award badges for genuine
          contributions. Talk to us if you want to finish it.
        </p>
      </div>
    );
  }

  // --- Grace period -------------------------------------------------
  if (inGrace) {
    const left = graceWindow - graceUsed + 1;
    return (
      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-5">
        <p className="text-amber-900 font-bold text-sm mb-1">
          Grace period, {left} day{left === 1 ? '' : 's'} left
        </p>
        <p className="text-amber-800 text-xs leading-relaxed">
          The deadline has passed, but you still have time. Badges and certificates are awarded
          after review, so it&rsquo;s worth finishing.
        </p>
      </div>
    );
  }

  // --- Counting down ------------------------------------------------
  const urgent = daysLeft <= 7;
  return (
    <div
      className={`rounded-xl p-4 mb-5 border ${
        urgent ? 'bg-pink-50 border-pink-300' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className={`font-bold text-sm ${urgent ? 'text-pink-900' : 'text-gray-900'}`}>
            {daysLeft === 0
              ? 'Deadline is today'
              : `${daysLeft} day${daysLeft === 1 ? '' : 's'} to the deadline`}
          </p>
          <p className="text-gray-500 text-xs mt-0.5">
            Due {project.endDate}
            {project.extensionDays ? ` (extended by ${project.extensionDays} days)` : ''}
          </p>
        </div>
        {/* Leads can't change dates themselves (She Model Tech sets them), so every
            project uses a request that staff approve. Company posts keep their edit link. */}
        {isLead && project.isCompanyPost && (
          <Link to={`/projects/${project.id}/setup`} className="text-pink-700 text-xs font-semibold underline">
            Change the deadline
          </Link>
        )}
        {isLead && !project.isCompanyPost && (
          requested ? (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 uppercase">Extra time requested</span>
          ) : (
            <button type="button" onClick={() => setOpen(!open)} className="text-pink-700 text-xs font-semibold underline">Request extra time</button>
          )
        )}
      </div>
      {open && !requested && (
        <div className="mt-3 pt-3 border-t border-pink-200 space-y-2">
          <label className="block text-xs font-semibold text-gray-800" htmlFor="ext-days">How much extra time?</label>
          <select id="ext-days" value={days} onChange={(e) => setDays(e.target.value)} className="text-sm border border-gray-300 rounded-lg px-2 py-1">
            {[3, 7, 14, 21].map((n) => <option key={n} value={n}>{n} days</option>)}
          </select>
          <label className="block text-xs font-semibold text-gray-800" htmlFor="ext-reason">Why? <span className="font-normal text-gray-500">(at least 5 words, up to 500 characters)</span></label>
          <textarea id="ext-reason" rows={2} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
          <button type="button" onClick={requestTime} disabled={sending} className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-60">
            {sending ? 'Sending...' : 'Send request'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DeadlineBanner;
