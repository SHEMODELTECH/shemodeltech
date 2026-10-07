// src/components/ReportButton.jsx
// A small "Report" link for a post, comment or reply. Opens a short form
// (reason + optional details) and sends it to staff (utils/reports.js).
//   <ReportButton target={{ area, kind, path, link, excerpt, authorUid, authorName }} me={{ uid, name }} />
// Hidden for the author's own content and when signed out.
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { REPORT_REASONS, reportContent } from '../utils/reports';

const ReportButton = ({ target, me, className = '' }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  if (!me?.uid || (target?.authorUid && target.authorUid === me.uid)) return null;
  if (sent) return <span className={`text-xs text-gray-400 ${className}`}>Reported</span>;

  const submit = async (e) => {
    e.preventDefault();
    if (!reason) { toast.error('Choose a reason.'); return; }
    setBusy(true);
    try {
      await reportContent(target, me, reason, details);
      setSent(true);
      setOpen(false);
      toast.success('Thanks. Our team will review it.');
    } catch (err) {
      toast.error('Could not send your report. Please try again.');
    }
    setBusy(false);
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`text-xs font-semibold text-gray-400 hover:text-red-600 ${className}`}>
        Report
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="report-title"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <form onSubmit={submit} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 text-left">
            <h2 id="report-title" className="text-lg font-bold text-gray-900">Report this {target?.kind || 'post'}</h2>
            <p className="text-sm text-gray-600 mt-1">Your report goes to our team only. The person won't know who reported it.</p>
            <fieldset className="mt-4 space-y-1.5">
              <legend className="text-sm font-semibold text-gray-800 mb-1">Why are you reporting it?</legend>
              {REPORT_REASONS.map(([k, l]) => (
                <label key={k} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="radio" name="report-reason" value={k} checked={reason === k} onChange={() => setReason(k)} />
                  {l}
                </label>
              ))}
            </fieldset>
            <label htmlFor="report-details" className="block text-sm font-semibold text-gray-800 mt-4 mb-1">
              Anything else? <span className="font-normal text-gray-500">(optional)</span>
            </label>
            <textarea id="report-details" rows={3} maxLength={500} value={details} onChange={(e) => setDetails(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setOpen(false)} className="text-sm font-semibold text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100">Cancel</button>
              <button type="submit" disabled={busy} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg disabled:opacity-60">
                {busy ? 'Sending…' : 'Send report'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ReportButton;
