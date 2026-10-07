// src/components/admin/LeadWaitlist.jsx
// Lead applications page: who joined the lead waitlist (emailed when a cohort
// is published, then removed from the list).
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase/config';
import { inviteToLead } from '../../utils/projectInterest';

const LeadWaitlist = () => {
  const [list, setList] = useState(null);
  const [open, setOpen] = useState(false);
  const [invited, setInvited] = useState({});
  useEffect(() => {
    getDocs(query(collection(db, 'waitlist'), where('interest', '==', 'lead')))
      .then((s) => setList(s.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch(() => setList([]));
  }, []);
  if (list === null) return null;
  return (
    <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Lead waitlist ({list.length})</h2>
          <p className="text-xs text-gray-500">Members who want to lead. They're emailed when you publish a cohort, then removed from this list.</p>
        </div>
        {list.length > 0 && (
          <button type="button" onClick={() => setOpen((o) => !o)} className="text-sm font-semibold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">
            {open ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {open && (
        <ul className="mt-3 divide-y divide-gray-100">
          {list.map((w) => {
            const at = w.createdAt?.toDate ? w.createdAt.toDate().toLocaleDateString() : '';
            return (
              <li key={w.id} className="py-2 flex flex-wrap justify-between gap-2 text-sm">
                <span className="text-gray-900">{w.name || w.displayName || 'A member'}</span>
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-500 text-xs">{w.email || ''}{at ? ` · joined ${at}` : ''}</span>
                  {w.userId && (
                    <button
                      type="button"
                      disabled={invited[w.id]}
                      onClick={async () => {
                        try { await inviteToLead(w.userId); setInvited((m) => ({ ...m, [w.id]: true })); toast.success('Invitation sent.'); }
                        catch (e) { toast.error('Could not send the invitation.'); }
                      }}
                      className="text-xs font-semibold bg-pink-600 text-white px-3 py-1 rounded-lg disabled:bg-pink-800"
                    >
                      {invited[w.id] ? '✓ Invited' : 'Invite to lead'}
                    </button>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LeadWaitlist;
