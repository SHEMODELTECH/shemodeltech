// src/components/admin/FoundersAdmin.jsx
// Admin → Founders: pitches from members who want to pitch at She Model Tech
// Conference. Accept (listed on the Founders page, Founder label on their
// profile) or decline (a reason is required). The member gets a notification
// and an email either way.
import React, { useEffect, useState } from 'react';
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { notifyMember, sendEmailNow } from '../../utils/staffAlerts';
import { BADGE_TRACKS } from '../../config/badgeTracks';
import { CONFERENCE_FIELDS, CONFERENCE_NOTE, getConference, publishCard, removeCard, saveConference, setPitchSlot, slotLabel, stageLabel } from '../../utils/founders';
import { closeReport } from '../../utils/founderGroups';

const STATUS = { pending: ['To review', 'bg-pink-50 text-pink-700'], accepted: ['Accepted', 'bg-pink-600 text-white'], declined: ['Declined', 'bg-gray-100 text-gray-700'] };
const MIN_DECLINE_WORDS = 10;
const words = (t) => String(t || '').trim().split(/\s+/).filter(Boolean).length;
const trackLabel = (name) => BADGE_TRACKS.find((t) => t.name === name)?.label || name;

// ISO time ⇄ the value a datetime-local box needs (in this computer's time zone).
const toLocalInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// One founder's pitch slot: set or change it, and she's notified (bell, phone, email).
const SlotEditor = ({ p, onSaved }) => {
  const [when, setWhen] = useState(toLocalInput(p.pitchSlot));
  const [note, setNote] = useState(p.slotNote || '');
  const [busy, setBusy] = useState(false);
  const save = async () => {
    const iso = when ? new Date(when).toISOString() : null;
    setBusy(true);
    try {
      await setPitchSlot(p.uid, iso, note);
      onSaved({ pitchSlot: iso, slotNote: note.trim() || null });
      if (iso) {
        notifyMember(p.uid, {
          type: 'founder_slot', title: p.pitchSlot ? 'Your pitch time has changed' : 'Your pitch time is set',
          body: `Your pitch for ${p.ideaName} at She Model Tech Conference: ${slotLabel(iso)}.${note.trim() ? ` ${note.trim()}` : ''} Please confirm on the Founders page.`,
          link: '/founders', ctaLabel: 'See your pitch',
        });
      }
      toast.success(iso ? `Slot saved. ${p.name} was notified.` : 'Slot cleared.');
    } catch (_) { toast.error('Could not save the slot.'); }
    setBusy(false);
  };
  return (
    <div className="mt-3 rounded-lg bg-gray-50 p-3">
      <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Pitch slot (your time zone)</p>
      <div className="mt-2 flex flex-wrap items-end gap-2">
        <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white" aria-label="Pitch date and time" />
        <input value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} placeholder="Optional note, e.g. Room B, arrive 15 minutes early" className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white" />
        <button type="button" disabled={busy} onClick={save} className="text-sm font-semibold bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-lg disabled:opacity-50">Save and notify</button>
      </div>
    </div>
  );
};

// Conference details every accepted founder sees in "Your pitch".
const ConferenceForm = ({ founders, by }) => {
  const [f, setF] = useState(null);
  const [tell, setTell] = useState(true);
  const [busy, setBusy] = useState(false);
  useEffect(() => { getConference().then((c) => setF(Object.fromEntries(CONFERENCE_FIELDS.map(([k]) => [k, c[k] || ''])))); }, []);
  if (!f) return <p className="py-10 text-center text-gray-400 text-sm">Loading…</p>;
  const save = async () => {
    if (f.joinLink && !/^https:\/\//i.test(f.joinLink.trim())) return toast.error('The joining link should start with https://');
    setBusy(true);
    try {
      await saveConference(Object.fromEntries(Object.entries(f).map(([k, v]) => [k, String(v).trim()])), by);
      if (tell) {
        founders.forEach((p) => notifyMember(p.uid, {
          type: 'founder_conference', title: 'She Model Tech Conference: details updated',
          body: 'The details for your pitch were updated: date, venue, format, and deadlines. Open Founders to see them.',
          link: '/founders', ctaLabel: 'See your pitch',
        }));
      }
      toast.success(tell ? `Saved. ${founders.length} founder${founders.length === 1 ? ' was' : 's were'} notified.` : 'Saved.');
    } catch (_) { toast.error('Could not save.'); }
    setBusy(false);
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-3 max-w-3xl">
      <p className="text-sm text-gray-600">Accepted founders see these details in the “Your pitch” box on the Founders page. Leave a field empty to hide it.</p>
      {CONFERENCE_FIELDS.map(([k, label, hint]) => (
        <label key={k} className="block text-sm font-semibold text-gray-800">{label}
          {['format', 'notes', 'slidesDue'].includes(k) ? (
            <textarea rows={2} maxLength={800} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} placeholder={hint} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-normal" />
          ) : (
            <input maxLength={300} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} placeholder={hint} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-normal" />
          )}
        </label>
      ))}
      <label className="flex items-center gap-2 text-sm text-gray-800">
        <input type="checkbox" checked={tell} onChange={(e) => setTell(e.target.checked)} className="accent-pink-600" />
        Tell all {founders.length} accepted founder{founders.length === 1 ? '' : 's'} (bell, phone, and email)
      </label>
      <button type="button" disabled={busy} onClick={save} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">{busy ? 'Saving…' : 'Save conference details'}</button>
    </div>
  );
};

const ATTEND = { yes: ['Coming', 'bg-pink-600 text-white'], no: ['Can’t make it', 'bg-gray-900 text-white'] };

const FoundersAdmin = () => {
  const { currentUser } = useAuth();
  const [rows, setRows] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [notes, setNotes] = useState({});
  const [busy, setBusy] = useState(null);
  // Founder team groups a member reported (staff can read only these).
  const [reported, setReported] = useState([]);
  useEffect(() => {
    getDocs(query(collection(db, 'founder_groups'), where('reported', '==', true)))
      .then((s) => setReported(s.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch(() => setReported([]));
  }, []);

  useEffect(() => {
    getDocs(collection(db, 'founder_pitches'))
      .then((s) => setRows(s.docs.map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.updatedAt?.seconds || b.createdAt?.seconds || 0) - (a.updatedAt?.seconds || a.createdAt?.seconds || 0))))
      .catch(() => setRows([]));
  }, []);

  // Founders accepted before public cards existed: give each one a card, so
  // they stay on the Founders page now that full pitches are private.
  useEffect(() => {
    if (!rows) return;
    const accepted = rows.filter((p) => p.status === 'accepted');
    if (!accepted.length) return;
    getDocs(collection(db, 'founder_cards')).then((s) => {
      const have = new Set(s.docs.map((d) => d.id));
      accepted.filter((p) => !have.has(p.uid || p.id)).forEach((p) => publishCard({ ...p, uid: p.uid || p.id }).catch(() => {}));
    }).catch(() => {});
  }, [rows === null]); // eslint-disable-line react-hooks/exhaustive-deps

  const decide = async (p, status) => {
    const note = (notes[p.id] || '').trim();
    if (status === 'declined' && words(note) < MIN_DECLINE_WORDS) {
      toast.error(`Add a reason of at least ${MIN_DECLINE_WORDS} words before declining (you've written ${words(note)}). The member will see it.`);
      return;
    }
    setBusy(p.id);
    try {
      const data = { status, decisionNote: note || null, decidedBy: currentUser.email, decidedAt: serverTimestamp() };
      await updateDoc(doc(db, 'founder_pitches', p.id), data);
      // The public card on the Founders page: shown when accepted, removed otherwise.
      if (status === 'accepted') await publishCard({ ...p, uid: p.uid || p.id });
      else await removeCard(p.uid || p.id).catch(() => {});
      setRows((xs) => xs.map((x) => (x.id === p.id ? { ...x, ...data, decidedAt: { seconds: Date.now() / 1000 } } : x)));
      const first = (p.name || '').split(' ')[0] || 'there';
      const msg = status === 'accepted'
        ? { title: 'You’re a She Model Tech founder!', body: `Hi ${first}, your pitch for ${p.ideaName} was accepted. ${CONFERENCE_NOTE} Your idea is now on the Founders page, so members can find you, and you can message members on the Talent Board to build your team. Your teammates need at least one badge.${note ? ` Note from She Model Tech: ${note}` : ''}`, link: '/founders', ctaLabel: 'Open Founders' }
        : { title: 'Your She Model Tech pitch', body: `Hi ${first}, thank you for pitching ${p.ideaName}. We can’t accept it this time. ${note} You can improve it and apply again from the Founders page.`, link: '/founders', ctaLabel: 'Open Founders' };
      try {
        await addDoc(collection(db, 'notifications'), {
          userId: p.uid, recipientId: p.uid, type: 'founder', title: msg.title, body: msg.body,
          message: `${msg.title} - ${msg.body}`, link: '/founders', isRead: false, read: false, createdAt: serverTimestamp(),
        });
      } catch (_) { /* the email still goes */ }
      let emailed = false;
      try {
        const u = await getDoc(doc(db, 'users', p.uid));
        const to = u.exists() ? u.data().email : null;
        if (to) emailed = (await sendEmailNow(to, msg)).ok;
      } catch (_) { /* told below */ }
      toast.success(`${status === 'accepted' ? 'Accepted' : 'Declined'}. ${emailed ? `${p.name} was notified and emailed.` : `${p.name} was notified; the email could not be sent.`}`);
    } catch (e) {
      toast.error('Could not save the decision.');
    }
    setBusy(null);
  };

  const reportedView = (
    <div className="space-y-3">
      {reported.length === 0 && <p className="text-sm text-gray-500 py-8 text-center">No reported team groups. When a member reports a founder’s group, it shows here and in Reports, and you can open it.</p>}
      {reported.map((g) => (
        <div key={g.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-bold text-gray-900">{g.name}</p>
            <p className="text-sm text-gray-600">Founder: {(g.memberNames || {})[g.founderUid] || '-'} · {(g.members || []).length} people{g.status === 'archived' ? ' · archived' : ''}</p>
          </div>
          <div className="flex gap-2">
            <Link to={`/founders/group/${g.id}`} className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-lg">Open group</Link>
            <button type="button" onClick={() => closeReport(g.id).then(() => { setReported((xs) => xs.filter((x) => x.id !== g.id)); toast.success('Report closed. The group is private again.'); }).catch(() => toast.error('Could not close it.'))} className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">Close report</button>
          </div>
        </div>
      ))}
    </div>
  );

  if (rows === null) return <p className="py-10 text-center text-gray-400 text-sm">Loading…</p>;
  const shown = rows.filter((p) => filter === 'all' || p.status === filter);
  const count = (s) => rows.filter((p) => p.status === s).length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {[['pending', `To review (${count('pending')})`], ['accepted', `Accepted (${count('accepted')})`], ['declined', `Declined (${count('declined')})`], ['all', `All (${rows.length})`], ['reported', `Reported groups (${reported.length})`], ['conference', 'Conference details']].map(([k, l]) => (
          <button key={k} type="button" onClick={() => setFilter(k)} className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${filter === k ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-gray-700 border-gray-300'}`}>{l}</button>
        ))}
      </div>

      {filter === 'accepted' && count('accepted') > 0 && (
        <p className="text-sm text-gray-600 mb-3">Coming: {rows.filter((p) => p.status === 'accepted' && p.attendance === 'yes').length} · Can’t make it: {rows.filter((p) => p.status === 'accepted' && p.attendance === 'no').length} · No answer yet: {rows.filter((p) => p.status === 'accepted' && !p.attendance).length}</p>
      )}
      {filter === 'conference' ? <ConferenceForm founders={rows.filter((p) => p.status === 'accepted')} by={currentUser?.email} /> : filter === 'reported' ? reportedView : (<>
      {shown.length === 0 && <p className="text-sm text-gray-500 py-8 text-center">No pitches here yet. Members with a badge apply from the Founders page.</p>}

      <div className="space-y-3">
        {shown.map((p) => {
          const [label, cls] = STATUS[p.status] || STATUS.pending;
          const when = (p.updatedAt || p.createdAt)?.toDate ? (p.updatedAt || p.createdAt).toDate().toLocaleDateString() : '';
          return (
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-gray-900">{p.ideaName}</p>
                  {p.tagline && <p className="text-sm text-gray-700">{p.tagline} <span className="text-xs text-gray-400">(public tagline)</span></p>}
                  <p className="text-sm text-gray-600">by <Link to={`/profile/${encodeURIComponent(p.uid)}`} className="font-semibold text-pink-700 hover:underline">{p.name}</Link> · {stageLabel(p.stage)}</p>
                </div>
                <span className="flex flex-wrap gap-1.5">
                  {p.status === 'accepted' && <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${(ATTEND[p.attendance] || ['No answer yet', 'bg-gray-100 text-gray-600'])[1]}`}>{(ATTEND[p.attendance] || ['No answer yet'])[0]}</span>}
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cls}`}>{label}{when ? ` · ${when}` : ''}</span>
                </span>
              </div>
              <dl className="mt-3 space-y-2 text-sm text-gray-800">
                <div><dt className="inline font-semibold">Problem: </dt><dd className="inline">{p.problem}</dd></div>
                <div><dt className="inline font-semibold">For: </dt><dd className="inline">{p.audience}</dd></div>
                <div><dt className="inline font-semibold">Solution: </dt><dd className="inline">{p.solution}</dd></div>
                <div><dt className="inline font-semibold">Tracks needed: </dt><dd className="inline">{(p.tracksNeeded || []).map(trackLabel).join(', ') || '-'}</dd></div>
                {p.rolesNeeded && <div><dt className="inline font-semibold">Roles: </dt><dd className="inline">{p.rolesNeeded}</dd></div>}
                <div><dt className="inline font-semibold">Why them: </dt><dd className="inline">{p.why}</dd></div>
              </dl>
              {p.status === 'pending' || (p.status === 'accepted' && notes[`open_${p.id}`]) ? (
                <div className="mt-3">
                  <label className="block text-xs text-gray-700">Your note <span className="text-gray-500">({p.status === 'pending' ? 'optional to accept; ' : ''}at least {MIN_DECLINE_WORDS} words to {p.status === 'pending' ? 'decline' : 'remove'} · {words(notes[p.id])} so far). The member sees it.</span>
                    <textarea rows={2} maxLength={600} value={notes[p.id] || ''} onChange={(e) => setNotes((m) => ({ ...m, [p.id]: e.target.value }))} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {p.status === 'pending' && <button type="button" disabled={busy === p.id} onClick={() => decide(p, 'accepted')} className="text-sm font-semibold bg-pink-700 hover:bg-pink-800 text-white px-4 py-2 rounded-lg disabled:opacity-50">Accept</button>}
                    <button type="button" disabled={busy === p.id} onClick={() => decide(p, 'declined')} className="text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg disabled:opacity-50">{p.status === 'pending' ? 'Decline' : 'Remove from Founders'}</button>
                  </div>
                </div>
              ) : p.status === 'accepted' ? (
                <>
                <SlotEditor p={p} onSaved={(d) => setRows((xs) => xs.map((x) => (x.id === p.id ? { ...x, ...d } : x)))} />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-gray-600">{p.decisionNote ? `Note sent: “${p.decisionNote}” · ` : ''}Accepted by {p.decidedBy}</p>
                  <button type="button" onClick={() => setNotes((m) => ({ ...m, [`open_${p.id}`]: true }))} className="text-xs font-semibold text-gray-500 hover:text-red-600">Remove from Founders…</button>
                </div>
                </>
              ) : p.decisionNote ? (
                <p className="mt-3 text-xs text-gray-600">Note sent: “{p.decisionNote}” · by {p.decidedBy}</p>
              ) : p.decidedBy ? (
                <p className="mt-3 text-xs text-gray-600">Decided by {p.decidedBy}</p>
              ) : null}
            </div>
          );
        })}
      </div>
      </>)}
    </div>
  );
};

export default FoundersAdmin;
