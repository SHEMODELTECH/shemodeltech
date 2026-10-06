// src/components/admin/FeedbackSummary.jsx
// Admin → Overview: what members say after their projects.
import React, { useEffect, useState } from 'react';
import { listFeedback } from '../../utils/feedback';

const FeedbackSummary = () => {
  const [rows, setRows] = useState(null);
  useEffect(() => { listFeedback().then(setRows).catch(() => setRows([])); }, []);
  if (rows === null) return null;
  const n = rows.length;
  const avg = n ? (rows.reduce((s, r) => s + (Number(r.rating) || 0), 0) / n).toFixed(1) : '–';
  const yes = n ? Math.round((rows.filter((r) => r.recommend === 'yes').length / n) * 100) : 0;
  const comments = rows.filter((r) => r.comment).slice(0, 8);
  return (
    <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
      <h2 className="text-lg font-bold text-gray-900">Member feedback</h2>
      {n === 0 ? (
        <p className="text-xs text-gray-500 mt-1">No feedback yet. Members are asked when a project is completed.</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-2xl font-bold text-gray-900">{avg}<span className="text-sm text-gray-500"> / 5</span></p><p className="text-xs text-gray-500">Average rating</p></div>
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-2xl font-bold text-gray-900">{yes}%</p><p className="text-xs text-gray-500">Would recommend</p></div>
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-2xl font-bold text-gray-900">{n}</p><p className="text-xs text-gray-500">Responses</p></div>
          </div>
          {comments.length > 0 && (
            <ul className="mt-4 space-y-2">
              {comments.map((r) => (
                <li key={r.id} className="text-sm border-l-4 border-pink-200 pl-3">
                  <p className="text-gray-800">“{r.comment}”</p>
                  <p className="text-xs text-gray-500 mt-0.5">{r.name || 'A member'} · {r.projectTitle} · {'★'.repeat(r.rating || 0)}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default FeedbackSummary;
