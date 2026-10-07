// src/components/admin/ReportsAdmin.jsx
// Admin → Moderation: posts, comments and replies members have reported.
// For each one: open it, remove it, or dismiss the report.
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { closeReport, listReports, reasonLabel } from '../../utils/reports';

const AREA = { proofwall: 'Proof Wall', team_forum: 'Project team forum', course_forum: 'Course forum' };
const fmt = (t) => {
  const d = t?.toDate ? t.toDate() : null;
  return d ? d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';
};

const ReportsAdmin = ({ me }) => {
  const [status, setStatus] = useState('open');
  const [rows, setRows] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    setRows(null);
    try { setRows(await listReports(status)); } catch (e) { setRows([]); toast.error('Could not load reports.'); }
  }, [status]);
  useEffect(() => { load(); }, [load]);

  const finish = async (r, outcome) => {
    setBusy(r.id);
    try {
      if (outcome === 'removed') {
        if (!window.confirm(`Remove this ${r.kind} for everyone? This can't be undone.`)) { setBusy(null); return; }
        try {
          if (r.path) await deleteDoc(doc(db, r.path));
        } catch (e) {
          toast.error('Could not remove it from here. Open it and delete it on the page, then mark the report as handled.');
          setBusy(null);
          return;
        }
      }
      await closeReport(r.id, outcome, me || {});
      setRows((xs) => xs.filter((x) => x.id !== r.id));
      toast.success(outcome === 'removed' ? 'Removed and closed.' : 'Report dismissed.');
    } catch (e) {
      toast.error('Could not update the report.');
    }
    setBusy(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-gray-500 text-sm">Posts, comments and replies members reported. Removing deletes it for everyone.</p>
        <div className="flex gap-1 text-sm">
          {['open', 'closed'].map((s) => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg font-semibold ${status === s ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {s === 'open' ? 'Waiting' : 'Handled'}
            </button>
          ))}
        </div>
      </div>
      {rows === null ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-gray-400 text-sm">{status === 'open' ? 'No reports waiting. 🎉' : 'Nothing handled yet.'}</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-pink-700">{AREA[r.area] || r.area}</span> · {r.kind} · {fmt(r.createdAt)}
              </p>
              <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap break-words">“{r.excerpt || '(no text)'}”</p>
              <p className="text-xs text-gray-600 mt-1">
                By {r.authorName || 'a member'} · Reported by {r.reporterName || 'a member'} for <span className="font-semibold">{reasonLabel(r.reason)}</span>
              </p>
              {r.details && <p className="text-xs text-gray-600 mt-1 italic">“{r.details}”</p>}
              {status === 'closed' && (
                <p className="text-xs text-gray-500 mt-1">{r.outcome === 'removed' ? 'Removed' : 'Dismissed'} by {r.closedByName || 'staff'} · {fmt(r.closedAt)}</p>
              )}
              {status === 'open' && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {r.link && (
                    /^https?:/i.test(r.link)
                      ? <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-pink-700 hover:underline">Open it</a>
                      : <Link to={r.link} target="_blank" className="text-xs font-semibold text-pink-700 hover:underline">Open it</Link>
                  )}
                  <button disabled={busy === r.id} onClick={() => finish(r, 'removed')} className="text-xs font-semibold text-red-600 border border-red-200 rounded-lg px-3 py-1 hover:bg-red-50 disabled:opacity-50">Remove it</button>
                  <button disabled={busy === r.id} onClick={() => finish(r, 'dismissed')} className="text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50 disabled:opacity-50">Dismiss</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReportsAdmin;
