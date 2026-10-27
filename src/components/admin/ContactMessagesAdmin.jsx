// src/components/admin/ContactMessagesAdmin.jsx
// Admin → Contact messages: messages from Contact us (shemodeltech.com/contact).
// Each one is New until someone on the team replies; then mark it Replied or
// Closed, and keep a private note for the team.
// The team inbox also gets every request by email (api/public-request).
// Delete is only for spam or test entries, or when someone asks for their
// details to be removed.
import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';

const STATUS = {
  new: ['New', 'bg-pink-50 text-pink-700'],
  replied: ['Replied', 'bg-gray-900 text-white'],
  closed: ['Closed', 'bg-gray-100 text-gray-700'],
};
const TOPIC = { general: 'General question', letter: 'Letter request', certificate: 'Certificate check', account: 'Sign-in or account help', privacy: 'Privacy or my data', partner: 'Conference partnership', judge: 'Conference judge application', other: 'Something else' };

// conferenceOnly (editors): only conference partnership and judge applications.
const ContactMessagesAdmin = ({ conferenceOnly = false }) => {
  const { currentUser } = useAuth();
  const [rows, setRows] = useState(null);
  const [filter, setFilter] = useState('open');
  const [notes, setNotes] = useState({});
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    const q = conferenceOnly
      ? query(collection(db, 'contact_messages'), where('topic', 'in', ['partner', 'judge']))
      : query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'));
    getDocs(q)
      .then((s) => setRows(s.docs.map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))))
      .catch(() => setRows([]));
  }, [conferenceOnly]);

  const save = async (r, patch, done) => {
    setBusy(r.id);
    try {
      const data = { ...patch, updatedBy: currentUser?.email || null, updatedAt: serverTimestamp() };
      await updateDoc(doc(db, 'contact_messages', r.id), data);
      setRows((xs) => xs.map((x) => (x.id === r.id ? { ...x, ...data } : x)));
      if (done) toast.success(done);
    } catch (e) {
      toast.error('Could not save that.');
    }
    setBusy(null);
  };

  const remove = async (r) => {
    if (!window.confirm(`Delete the message from ${r.name || 'this person'} for good?\n\nUse this only for spam or test entries, or when the person asked for their details to be removed. It can't be undone.`)) return;
    setBusy(r.id);
    try {
      await deleteDoc(doc(db, 'contact_messages', r.id));
      setRows((xs) => xs.filter((x) => x.id !== r.id));
      toast.success('Message deleted.');
    } catch (e) {
      toast.error('Could not delete it.');
    }
    setBusy(null);
  };

  if (rows === null) return <p className="py-6 text-center text-gray-400 text-sm">Loading messages…</p>;
  const isOpen = (r) => r.status === 'new';
  const shown = rows.filter((r) => (filter === 'all' ? true : filter === 'open' ? isOpen(r) : r.status === filter));
  const count = (k) => rows.filter((r) => (k === 'open' ? isOpen(r) : r.status === k)).length;

  return (
    <section className="mb-10" aria-labelledby="contact-h">
      <h2 id="contact-h" className="text-lg font-bold text-gray-900">Contact messages</h2>
      <p className="text-sm text-gray-600 mt-1 mb-4">
        {conferenceOnly ? 'Conference partnership and judge applications from Contact us.' : 'From Contact us (shemodeltech.com/contact). Each one is also emailed to the team inbox.'}
      </p>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {[['open', `New (${count('open')})`], ['replied', `Replied (${count('replied')})`], ['closed', `Closed (${count('closed')})`], ['all', `All (${rows.length})`]].map(([k, l]) => (
          <button key={k} type="button" onClick={() => setFilter(k)} aria-pressed={filter === k}
            className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${filter === k ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-gray-700 border-gray-300'}`}>{l}</button>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="text-sm text-gray-500 py-6 text-center border border-dashed border-gray-300 rounded-xl">
          {rows.length === 0 ? 'No messages yet. They arrive from Contact us (shemodeltech.com/contact).' : 'Nothing here.'}
        </p>
      )}

      <div className="space-y-3">
        {shown.map((r) => {
          const [label, cls] = STATUS[r.status] || STATUS.new;
          const when = r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '';
          const subject = encodeURIComponent(`Re: ${TOPIC[r.topic] || 'Your message'} - She Model Tech`);
          return (
            <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-gray-900">{r.name}</p>
                  <p className="text-sm text-gray-600">{TOPIC[r.topic] || 'General question'}{r.reference ? ` · ${r.reference}` : ''}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cls}`}>{label}{when ? ` · ${when}` : ''}</span>
              </div>
              <p className="mt-2 text-sm"><span className="text-gray-500">Email: </span><a href={`mailto:${r.email}?subject=${subject}`} className="text-pink-700 hover:underline break-all">{r.email}</a></p>
              <p className="mt-3 text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{r.message}</p>

              <label className="block mt-3 text-xs text-gray-700">Team note <span className="text-gray-500">(private, only admins see it)</span>
                <textarea rows={2} maxLength={1000} value={notes[r.id] ?? (r.teamNote || '')}
                  onChange={(e) => setNotes((m) => ({ ...m, [r.id]: e.target.value }))}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </label>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <a href={`mailto:${r.email}?subject=${subject}`} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Reply by email</a>
                {notes[r.id] !== undefined && notes[r.id] !== (r.teamNote || '') && (
                  <button type="button" disabled={busy === r.id} onClick={() => save(r, { teamNote: notes[r.id].trim() || null }, 'Note saved.')}
                    className="text-sm font-semibold border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg disabled:opacity-50">Save note</button>
                )}
                <label className="ml-auto text-sm text-gray-700 flex items-center gap-2">Status
                  <select value={r.status || 'new'} disabled={busy === r.id}
                    onChange={(e) => save(r, { status: e.target.value }, `Marked ${STATUS[e.target.value][0].toLowerCase()}.`)}
                    className="border border-gray-300 rounded-lg px-2 py-1.5 bg-white text-sm">
                    {Object.entries(STATUS).map(([k, [l]]) => <option key={k} value={k}>{l}</option>)}
                  </select>
                </label>
              </div>
              {r.updatedBy && <p className="mt-2 text-xs text-gray-500">Last updated by {r.updatedBy}</p>}
              {!conferenceOnly && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                <button type="button" disabled={busy === r.id} onClick={() => remove(r)}
                  title="For spam or test entries, or when someone asks for their details to be removed"
                  className="text-xs font-semibold text-gray-500 hover:text-red-600 disabled:opacity-50">Delete request</button>
              </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ContactMessagesAdmin;
