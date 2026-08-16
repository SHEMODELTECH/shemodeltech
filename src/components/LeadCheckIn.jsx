// src/components/LeadCheckIn.jsx
//
// The lead's weekly "still on track" click, a dead-man's switch.
//
// This is the strongest signal that a lead is present, because it is
// unambiguous and costs almost nothing when she is. Silence is the signal;
// two missed check-ins flags the project for a reviewer. Nothing is
// automatic beyond the flag, a human always makes the call.
//
// Deliberately gentle in tone. Most people who go quiet are dealing with
// life, not abandoning their team, and the prompt should read as support
// rather than surveillance.

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { recordLeadCheckin, isCheckinDue } from '../utils/leadHealth';
import { daysUntil } from '../utils/cohorts';

const LeadCheckIn = ({ project, currentUser, onDone }) => {
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isLead = project?.submitterId === currentUser?.uid;
  if (!isLead) return null;
  if (!['active', 'setup', 'overdue'].includes(project?.status)) return null;
  if (!isCheckinDue(project)) return null;

  const daysLeft = daysUntil(project.endDate);
  const missed = project.missedCheckins || 0;

  const submit = async (onTrack) => {
    setSaving(true);
    try {
      await recordLeadCheckin(project.id, currentUser.uid, onTrack ? note : `NEEDS HELP: ${note}`);
      toast.success(onTrack ? 'Thanks, noted.' : 'Thanks for flagging. We\u2019ll reach out.');
      onDone?.();
    } catch (e) {
      toast.error('Could not save your check-in.');
    }
    setSaving(false);
  };

  return (
    <div className="bg-white border-2 border-pink-200 rounded-xl p-4 sm:p-5 mb-5">
      <p className="text-gray-900 font-bold text-sm mb-1">
        Quick check-in
        {missed > 0 && (
          <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 uppercase">
            {missed} missed
          </span>
        )}
      </p>
      <p className="text-gray-500 text-xs mb-3 leading-relaxed">
        How&rsquo;s the team doing?
        {daysLeft !== null &&
          daysLeft >= 0 &&
          ` ${daysLeft} day${daysLeft === 1 ? '' : 's'} to the deadline.`}{' '}
        One click is enough, it just tells us you&rsquo;re still here.
      </p>

      {expanded && (
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Anything you're stuck on? (optional)"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-pink-500 text-sm outline-none resize-y mb-3"
        />
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={() => submit(true)}
          className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-200 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
        >
          {saving ? 'Saving…' : 'We\u2019re on track'}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => {
            if (!expanded) {
              setExpanded(true);
              return;
            }
            submit(false);
          }}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg transition-all"
        >
          We need help
        </button>
      </div>
    </div>
  );
};

export default LeadCheckIn;
