// src/components/admin/TeamApplicationsAdmin.jsx
// Admin → Team: applications to join the She Model Tech team. Approve or
// decline (a reason is required to decline); the applicant is emailed.
import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { sendEmailNow } from '../../utils/staffAlerts';
import { TEAM_ROLES, roleTitle } from '../../config/teamRoles';

const STATUS = { new: ['New', 'bg-pink-50 text-pink-700'], approved: ['Approved', 'bg-green-50 text-green-800'], declined: ['Declined', 'bg-gray-100 text-gray-700'] };
const MIN_DECLINE_WORDS = 10;
const words = (t) => String(t || '').trim().split(/\s+/).filter(Boolean).length;
const href = (v) => (/^https?:\/\//i.test(v) ? v : `https://${v}`);
const socialUrl = (platform, handle) => {
  const h = String(handle || '').trim().replace(/^@/, '');
  if (/^https?:\/\//i.test(h) || h.includes('.com/')) return href(h);
  if (platform === 'Instagram') return `https://instagram.com/${h}`;
  if (platform === 'X') return `https://x.com/${h}`;
  return `https://www.linkedin.com/in/${h}`;
};

const TeamApplicationsAdmin = () => {
  const { currentUser } = useAuth();
  const [rows, setRows] = useState(null);
  const [filter, setFilter] = useState('new');
  const [roleFilter, setRoleFilter] = useState('');
  const [notes, setNotes] = useState({});
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    getDocs(query(collection(db, 'team_applications'), orderBy('createdAt', 'desc')))
      .then((s) => setRows(s.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch(() => setRows([]));
  }, []);

  const decide = async (a, status) => {
    const note = (notes[a.id] || '').trim();
    if (status === 'declined' && words(note) < MIN_DECLINE_WORDS) {
      toast.error(`Add a reason of at least ${MIN_DECLINE_WORDS} words before declining (you've written ${words(note)}). The applicant will see it.`);
      return;
    }
    setBusy(a.id);
    try {
      const data = { status, decisionNote: note || null, decidedBy: currentUser.email, decidedAt: serverTimestamp() };
      await updateDoc(doc(db, 'team_applications', a.id), data);
      setRows((xs) => xs.map((x) => (x.id === a.id ? { ...x, ...data } : x)));
      const first = (a.name || '').split(' ')[0] || 'there';
      const r = await sendEmailNow(a.email, status === 'approved'
        ? { title: 'Welcome to She Model Tech team!', body: `Hi ${first}, thank you for applying to be our ${roleTitle(a.role)}. We’d love to have you on She Model Tech team, and we’ll be in touch shortly with next steps.${note ? ` Note from She Model Tech: ${note}` : ''}`, link: '/team', ctaLabel: 'Visit our team page' }
        : { title: 'Your She Model Tech team application', body: `Hi ${first}, thank you for applying to be our ${roleTitle(a.role)}. We’re not able to offer you a place on She Model Tech team right now. ${note} We’d love for you to stay involved as a member.`, link: '/projects', ctaLabel: 'Explore projects' });
      toast.success(`${status === 'approved' ? 'Approved' : 'Declined'}.${r.ok ? ` ${a.name} was emailed.` : ' The email could not be sent; please contact them directly.'}`);
    } catch (e) {
      toast.error('Could not save the decision.');
    }
    setBusy(null);
  };

  if (rows === null) return <p className="py-10 text-center text-gray-400 text-sm">Loading…</p>;
  const shown = rows.filter((a) => (filter === 'all' || a.status === filter) && (!roleFilter || a.role === roleFilter || (a.otherRoles || []).includes(roleFilter)));
  const count = (s) => rows.filter((a) => a.status === s).length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {[['new', `New (${count('new')})`], ['approved', `Approved (${count('approved')})`], ['declined', `Declined (${count('declined')})`], ['all', `All (${rows.length})`]].map(([k, l]) => (
          <button key={k} type="button" onClick={() => setFilter(k)} className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${filter === k ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-gray-700 border-gray-300'}`}>{l}</button>
        ))}
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="ml-auto text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white" aria-label="Filter by role">
          <option value="">All roles</option>
          {TEAM_ROLES.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
        </select>
      </div>

      {shown.length === 0 && <p className="text-sm text-gray-500 py-8 text-center">No applications here yet. People apply from the Team page (shemodeltech.com/team).</p>}

      <div className="space-y-3">
        {shown.map((a) => {
          const [label, cls] = STATUS[a.status] || STATUS.new;
          const when = a.createdAt?.toDate ? a.createdAt.toDate().toLocaleDateString() : '';
          return (
            <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-gray-900">{a.name}</p>
                  <p className="text-sm text-pink-700 font-semibold">{roleTitle(a.role)}</p>
                  {(a.otherRoles || []).length > 0 && <p className="text-xs text-gray-500 mt-0.5">Also interested in: {a.otherRoles.map(roleTitle).join(', ')}</p>}
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cls}`}>{label}{when ? ` · ${when}` : ''}</span>
              </div>
              <dl className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
                <div className="min-w-0"><dt className="inline text-gray-500">Email: </dt><dd className="inline"><a href={`mailto:${a.email}`} className="text-gray-900 hover:underline break-all">{a.email}</a></dd></div>
                <div className="min-w-0"><dt className="inline text-gray-500">Phone: </dt><dd className="inline"><a href={`tel:${(a.phone || '').replace(/[^\d+]/g, '')}`} className="text-gray-900 hover:underline">{a.phone}</a></dd></div>
                <div className="min-w-0"><dt className="inline text-gray-500">LinkedIn or portfolio: </dt><dd className="inline"><a href={href(a.linkedinOrPortfolio)} target="_blank" rel="noopener noreferrer" className="text-pink-700 hover:underline break-all">{a.linkedinOrPortfolio}</a></dd></div>
                <div className="min-w-0"><dt className="inline text-gray-500">{a.socialPlatform}: </dt><dd className="inline"><a href={socialUrl(a.socialPlatform, a.socialHandle)} target="_blank" rel="noopener noreferrer" className="text-pink-700 hover:underline break-all">{a.socialHandle}</a></dd></div>
                {a.hours && <div><dt className="inline text-gray-500">Hours a week: </dt><dd className="inline text-gray-900">{a.hours}</dd></div>}
              </dl>
              <p className="mt-3 text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{a.why}</p>
              {a.status === 'new' ? (
                <div className="mt-3">
                  <label className="block text-xs text-gray-700">Your note <span className="text-gray-500">(optional to approve; at least {MIN_DECLINE_WORDS} words to decline · {words(notes[a.id])} so far). The applicant sees it.</span>
                    <textarea rows={2} maxLength={600} value={notes[a.id] || ''} onChange={(e) => setNotes((m) => ({ ...m, [a.id]: e.target.value }))} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button type="button" disabled={busy === a.id} onClick={() => decide(a, 'approved')} className="text-sm font-semibold bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg disabled:opacity-50">Approve</button>
                    <button type="button" disabled={busy === a.id} onClick={() => decide(a, 'declined')} className="text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg disabled:opacity-50">Decline</button>
                  </div>
                </div>
              ) : a.decisionNote ? (
                <p className="mt-3 text-xs text-gray-600">Note sent: “{a.decisionNote}” · by {a.decidedBy}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamApplicationsAdmin;
