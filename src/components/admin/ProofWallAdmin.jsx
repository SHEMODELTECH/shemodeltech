// src/components/admin/ProofWallAdmin.jsx
// Admin → Proof Wall: remove an entry on purpose (a mistaken badge post, a test
// entry). Entries for deleted projects are removed automatically, so this is
// only for exceptions. Removing asks for confirmation and can't be undone.
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ACTIVITY_TYPES, deleteActivityItem, getActivity, withoutDeletedProjects } from '../../utils/activityFeed';

const fmtDate = (ts) => {
  const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
  return d ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';
};

const describe = (a) => {
  if (a.type === 'badge') return `${a.badgeName || 'A badge'}${a.projectTitle ? ` · ${a.projectTitle}` : ''}`;
  if (a.type === 'update') return a.text ? `${a.text.slice(0, 140)}${a.text.length > 140 ? '…' : ''}` : a.projectTitle || '';
  return a.projectTitle || a.meta || '';
};

const ProofWallAdmin = () => {
  const [rows, setRows] = useState(null);
  const [type, setType] = useState('');
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    setRows(null);
    try {
      const list = await getActivity(100, type || null);
      setRows(await withoutDeletedProjects(list, { cleanUp: true }));
    } catch (e) {
      console.error(e);
      setRows([]); // never stuck on "Loading…"
    }
  }, [type]);
  useEffect(() => {
    load();
  }, [load]);

  const remove = async (a) => {
    if (!window.confirm(`Remove this ${ACTIVITY_TYPES[a.type]?.label.toLowerCase() || 'entry'} from the Proof Wall?\n\n${a.actorName || ''} ${describe(a)}\n\nThis can't be undone.`)) return;
    setBusy(a.id);
    try {
      await deleteActivityItem(a.id);
      setRows((xs) => xs.filter((x) => x.id !== a.id));
      toast.success('Removed from the Proof Wall.');
    } catch (e) {
      toast.error('Could not remove it.');
    }
    setBusy(null);
  };

  return (
    <div className="space-y-3">
      <p className="text-gray-500 text-sm">
        The latest 100 Proof Wall entries. When a project is deleted, its entries are removed automatically, so use this only for exceptions, like a mistaken post.
      </p>
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        Show
        <select value={type} onChange={(e) => setType(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-normal bg-white">
          <option value="">Everything</option>
          {Object.entries(ACTIVITY_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </label>
      {rows === null ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-gray-400 text-sm">Nothing on the Proof Wall.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((a) => (
            <li key={a.id} className="flex items-start justify-between gap-3 bg-white border border-gray-200 rounded-lg p-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-pink-700">{ACTIVITY_TYPES[a.type]?.label || a.type}</span>
                  {a.isDummy ? ' · sample' : ''} · {fmtDate(a.createdAt)}
                </p>
                <p className="text-sm text-gray-900 font-semibold mt-0.5">{a.actorName || 'A member'}</p>
                <p className="text-sm text-gray-700 break-words">{describe(a)}</p>
              </div>
              <button
                onClick={() => remove(a)}
                disabled={busy === a.id}
                className="shrink-0 text-xs font-semibold text-gray-500 hover:text-red-600 border border-gray-200 rounded-lg px-3 py-1.5 disabled:opacity-50"
              >
                {busy === a.id ? 'Removing…' : 'Remove'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProofWallAdmin;
