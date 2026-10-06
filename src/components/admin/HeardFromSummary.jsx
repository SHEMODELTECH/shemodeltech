// src/components/admin/HeardFromSummary.jsx
// Admin → Users: how members found She Model Tech (from the sign-up question).
import React from 'react';

const HeardFromSummary = ({ users }) => {
  const members = (users || []).filter((u) => !u.isCompany);
  const counts = {};
  members.forEach((u) => { if (u.heardFrom) counts[u.heardFrom] = (counts[u.heardFrom] || 0) + 1; });
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const answered = rows.reduce((n, [, c]) => n + c, 0);
  return (
    <div className="mb-4 bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-sm font-bold text-gray-900">How members heard about She Model Tech</p>
      {answered === 0 ? (
        <p className="text-xs text-gray-500 mt-1">No answers yet. New members are asked when they sign up.</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {rows.map(([label, c]) => (
            <li key={label} className="text-sm">
              <div className="flex justify-between gap-2"><span className="text-gray-800">{label}</span><span className="text-gray-500">{c} · {Math.round((c / answered) * 100)}%</span></div>
              <div className="h-1.5 bg-gray-100 rounded-full mt-0.5"><div className="h-1.5 bg-pink-600 rounded-full" style={{ width: `${(c / answered) * 100}%` }} /></div>
            </li>
          ))}
          <li className="text-[11px] text-gray-500 pt-1">{answered} of {members.length} members answered (the question started with new sign-ups).</li>
        </ul>
      )}
    </div>
  );
};

export default HeardFromSummary;
