// src/Pages/Founders.jsx
// Founders (shemodeltech.com/founders): members with at least one badge apply
// to pitch their idea at She Model Tech Conference. Accepted founders are
// listed here with the roles they need; members tap "I'm interested" to
// message them, and founders find teammates on the Talent Board.
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { BADGE_TRACKS } from '../config/badgeTracks';
import { hasLink, NO_LINKS_MSG } from '../utils/noLinks';
import { alertStaff } from '../utils/staffAlerts';
import {
  CONFERENCE_NOTE, PARTNER_OPT_IN, FOUNDER_STAGES, MAX_TRACKS, PITCH_LIMITS, founderBlocker, getMyPitch,
  listFounders, stageLabel, submitPitch, updateTeamNeeds, withdrawPitch,
  CONFERENCE_FIELDS, getConference, setAcceptingTeam, setAttendance, setPartnerOptIn, slotLabel,
} from '../utils/founders';
import { acceptInvite, createGroup, declineInvite, groupsOf, invitesFor } from '../utils/founderGroups';
import { doc, getDoc } from 'firebase/firestore';

const trackLabel = (name) => BADGE_TRACKS.find((t) => t.name === name)?.label || name;
const EMPTY = { partnerOptIn: false, ideaName: '', tagline: '', problem: '', audience: '', solution: '', stage: 'idea', tracksNeeded: [], rolesNeeded: '', why: '' };
const input = 'mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-normal text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200';
const labelCls = 'block text-sm font-semibold text-gray-800';

// A text field that shows its limits up front and a live count.
const Counted = ({ label, hint, k, f, set, rows }) => {
  const [min, max] = PITCH_LIMITS[k];
  const n = f[k].trim().length;
  const ok = n >= min;
  return (
    <label className={labelCls}>
      {label}{min > 0 ? ' *' : ''}
      <span className="block text-xs font-normal text-gray-500">{hint} {min > 0 ? `At least ${min} characters, up to ${max}.` : `Optional, up to ${max} characters.`}</span>
      {rows ? (
        <textarea rows={rows} value={f[k]} onChange={set(k)} maxLength={max} className={input} />
      ) : (
        <input value={f[k]} onChange={set(k)} maxLength={max} className={input} />
      )}
      <span className={`block text-xs font-normal mt-1 ${ok && min > 0 ? 'text-pink-700' : 'text-gray-500'}`}>{n} / {max}{min > 0 && ok ? ' ✓' : ''}</span>
    </label>
  );
};

const TrackChips = ({ value, onChange }) => (
  <div className="mt-2 flex flex-wrap gap-2">
    {BADGE_TRACKS.map((t) => {
      const on = value.includes(t.name);
      return (
        <button key={t.name} type="button" aria-pressed={on}
          onClick={() => onChange(on ? value.filter((x) => x !== t.name) : [...value, t.name].slice(0, MAX_TRACKS))}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${on ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-gray-700 border-gray-300 hover:border-pink-400'}`}>
          {t.label}
        </button>
      );
    })}
  </div>
);

const PitchForm = ({ initial, onCancel, onSubmit, busy }) => {
  const [f, setF] = useState({ ...EMPTY, ...(initial || {}) });
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    for (const [k, [min]] of Object.entries(PITCH_LIMITS)) {
      if (f[k].trim().length < min) return toast.error('Fill in each field with at least the number of characters shown.');
    }
    if (!f.tracksNeeded.length) return toast.error('Choose at least one track your team needs.');
    if (['ideaName', 'problem', 'audience', 'solution', 'rolesNeeded', 'why'].some((k) => hasLink(f[k]))) return toast.error(NO_LINKS_MSG);
    return onSubmit(f);
  };
  return (
    <form onSubmit={submit} className="mt-4 bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-4" noValidate>
      <p className="text-sm text-gray-700 bg-pink-50/60 border border-pink-100 rounded-lg px-3 py-2">Members see only your idea’s name, tagline, stage, and the roles you need. The rest of your pitch is private to you and She Model Tech. Don’t put anything secret in the name or tagline.</p>
      <Counted label="Name of your idea" hint="A short name people will remember." k="ideaName" f={f} set={set} />
      <Counted label="Tagline" hint="One line members will see, e.g. “Appointment reminders for small clinics”." k="tagline" f={f} set={set} />
      <Counted label="The problem" hint="What problem are you solving, and why does it matter?" k="problem" f={f} set={set} rows={3} />
      <Counted label="Who it’s for" hint="The people who have this problem." k="audience" f={f} set={set} rows={2} />
      <Counted label="Your solution" hint="What you want to build, and how it solves the problem." k="solution" f={f} set={set} rows={4} />
      <fieldset>
        <legend className={labelCls}>How far along is it? *</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {FOUNDER_STAGES.map(([k, l]) => (
            <button key={k} type="button" aria-pressed={f.stage === k} onClick={() => setF((x) => ({ ...x, stage: k }))}
              className={`text-sm font-semibold px-3 py-1.5 rounded-lg border ${f.stage === k ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300'}`}>{l}</button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className={labelCls}>Tracks your team needs * <span className="font-normal text-gray-500">(choose 1 to {MAX_TRACKS})</span></legend>
        <TrackChips value={f.tracksNeeded} onChange={(v) => setF((x) => ({ ...x, tracksNeeded: v }))} />
      </fieldset>
      <Counted label="Roles you’re looking for" hint="For example: a frontend developer, a tester, a designer." k="rolesNeeded" f={f} set={set} rows={2} />
      <Counted label="Why you?" hint="Why you’re the right person to build this." k="why" f={f} set={set} rows={3} />
      <label className="flex items-start gap-2 text-sm text-gray-800">
        <input type="checkbox" checked={!!f.partnerOptIn} onChange={(e) => setF((x) => ({ ...x, partnerOptIn: e.target.checked }))} className="mt-0.5 accent-pink-600" />
        <span>{PARTNER_OPT_IN} <span className="text-gray-500">(Optional. You can change this later.)</span></span>
      </label>
      <p className="text-xs text-gray-500">No web links, please. Your pitch is reviewed by She Model Tech before it’s listed.</p>
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50">
          {busy ? 'Sending…' : 'Send my pitch for review'}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="text-sm font-semibold border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>}
      </div>
    </form>
  );
};

const TeamNeedsForm = ({ pitch, onSaved }) => {
  const [tracks, setTracks] = useState(pitch.tracksNeeded || []);
  const [roles, setRoles] = useState(pitch.rolesNeeded || '');
  const [tagline, setTagline] = useState(pitch.tagline || '');
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (!tracks.length) return toast.error('Choose at least one track your team needs.');
    if (tagline.trim().length < PITCH_LIMITS.tagline[0]) return toast.error(`Add a tagline of at least ${PITCH_LIMITS.tagline[0]} characters.`);
    if (hasLink(roles) || hasLink(tagline)) return toast.error(NO_LINKS_MSG);
    setBusy(true);
    try {
      await updateTeamNeeds(pitch.uid, { tracksNeeded: tracks, rolesNeeded: roles, tagline });
      toast.success('Your card is updated.');
      onSaved({ tracksNeeded: tracks, rolesNeeded: roles.trim(), tagline: tagline.trim() });
    } catch (_) { toast.error('Could not save. Please try again.'); }
    setBusy(false);
  };
  return (
    <div className="mt-3 space-y-3">
      <label className={labelCls}>Tagline
        <span className="block text-xs font-normal text-gray-500">The one line members see. At least {PITCH_LIMITS.tagline[0]} characters, up to {PITCH_LIMITS.tagline[1]}. Nothing secret.</span>
        <input value={tagline} onChange={(e) => setTagline(e.target.value)} maxLength={PITCH_LIMITS.tagline[1]} className={input} />
        <span className="block text-xs font-normal text-gray-500 mt-1">{tagline.trim().length} / {PITCH_LIMITS.tagline[1]}</span>
      </label>
      <div>
        <p className={labelCls}>Tracks your team needs</p>
        <TrackChips value={tracks} onChange={setTracks} />
      </div>
      <label className={labelCls}>Roles you’re looking for
        <span className="block text-xs font-normal text-gray-500">Optional, up to {PITCH_LIMITS.rolesNeeded[1]} characters.</span>
        <textarea rows={2} value={roles} onChange={(e) => setRoles(e.target.value)} maxLength={PITCH_LIMITS.rolesNeeded[1]} className={input} />
        <span className="block text-xs font-normal text-gray-500 mt-1">{roles.trim().length} / {PITCH_LIMITS.rolesNeeded[1]}</span>
      </label>
      <button type="button" onClick={save} disabled={busy} className="text-sm font-semibold bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50">{busy ? 'Saving…' : 'Save my card'}</button>
    </div>
  );
};

// Accepted founders: the conference details, her pitch slot, and "I'll be there".
const YourPitch = ({ pitch, onAttendance }) => {
  const [conf, setConf] = useState(null);
  useEffect(() => { getConference().then(setConf); }, []);
  const filled = conf ? CONFERENCE_FIELDS.filter(([k]) => conf[k]) : [];
  const togglePartner = async (on) => {
    try { await setPartnerOptIn(pitch.uid, on); onAttendance(pitch.attendance, on); toast.success(on ? 'We may put you forward to partner events.' : 'We won’t put you forward to partner events.'); } catch (_) { toast.error('Could not save. Please try again.'); }
  };
  const answer = async (a) => {
    try { await setAttendance(pitch.uid, a); onAttendance(a); toast.success(a === 'yes' ? 'Thanks! We’ve noted that you’ll be there.' : 'Thanks for letting us know.'); } catch (_) { toast.error('Could not save. Please try again.'); }
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-pink-700">Your pitch</p>
      <p className="font-bold text-gray-900 mt-1">She Model Tech Conference</p>
      {pitch.pitchSlot ? (
        <p className="mt-2 text-sm text-gray-900 bg-pink-50 border border-pink-100 rounded-lg px-3 py-2">
          <b>Your slot:</b> {slotLabel(pitch.pitchSlot)}{pitch.slotNote ? <span className="block text-gray-700 mt-0.5">{pitch.slotNote}</span> : null}
        </p>
      ) : (
        <p className="mt-2 text-sm text-gray-600">Your pitch time will appear here once it’s set. We’ll notify you.</p>
      )}
      {conf === null ? null : filled.length ? (
        <dl className="mt-3 space-y-1.5 text-sm">
          {filled.map(([k, label]) => (
            <div key={k}>
              <dt className="inline font-semibold text-gray-900">{label}: </dt>
              <dd className="inline text-gray-700 whitespace-pre-wrap">
                {k === 'joinLink' && /^https:\/\//i.test(conf[k]) ? <a href={conf[k]} target="_blank" rel="noopener noreferrer" className="text-pink-700 underline break-all">{conf[k]}</a> : conf[k]}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-2 text-sm text-gray-600">Date, venue, and pitch format: to be announced.</p>
      )}
      <label className="mt-4 flex items-start gap-2 text-sm text-gray-800">
        <input type="checkbox" checked={!!pitch.partnerOptIn} onChange={(e) => togglePartner(e.target.checked)} className="mt-0.5 accent-pink-600" />
        <span>{PARTNER_OPT_IN} <span className="text-gray-500">Selected founders may be invited; it isn’t guaranteed.</span></span>
      </label>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-800">Will you be there?</span>
        <button type="button" aria-pressed={pitch.attendance === 'yes'} onClick={() => answer('yes')}
          className={`text-sm font-semibold px-4 py-1.5 rounded-lg border ${pitch.attendance === 'yes' ? 'bg-pink-600 text-white border-pink-600' : 'bg-white border-gray-300 hover:bg-gray-50'}`}>I’ll be there</button>
        <button type="button" aria-pressed={pitch.attendance === 'no'} onClick={() => answer('no')}
          className={`text-sm font-semibold px-4 py-1.5 rounded-lg border ${pitch.attendance === 'no' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-300 hover:bg-gray-50'}`}>I can’t make it</button>
      </div>
    </div>
  );
};

const Founders = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(undefined);
  const [mine, setMine] = useState(undefined);
  const [founders, setFounders] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editingNeeds, setEditingNeeds] = useState(false);
  const [busy, setBusy] = useState(false);
  const [track, setTrack] = useState('');
  const [groups, setGroups] = useState([]);
  const [invites, setInvites] = useState([]);
  const loadGroups = () => {
    if (!currentUser) return;
    groupsOf(currentUser.uid).then(setGroups).catch(() => {});
    invitesFor(currentUser.uid).then(setInvites).catch(() => {});
  };

  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid)).then((s) => setProfile(s.exists() ? s.data() : null)).catch(() => setProfile(null));
    getMyPitch(currentUser.uid).then(setMine);
    listFounders().then(setFounders).catch(() => setFounders([]));
    loadGroups();
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const myName = profile?.displayName || currentUser?.displayName || 'Member';
  const myGroup = groups.find((g) => g.founderUid === currentUser?.uid);
  const respond = async (g, join) => {
    try {
      if (join) { await acceptInvite(g.id, currentUser.uid, myName); toast.success(`You joined ${g.name}.`); navigate(`/founders/group/${g.id}`); }
      else { await declineInvite(g.id, currentUser.uid); toast.success('Invite declined.'); loadGroups(); }
    } catch (_) { toast.error('Could not do that. The invite may have been cancelled.'); loadGroups(); }
  };
  const startGroup = async () => {
    try { await createGroup(currentUser.uid, myName, mine.ideaName); navigate(`/founders/group/${currentUser.uid}`); } catch (_) { toast.error('Could not create the group. Please try again.'); }
  };
  const toggleAccepting = async () => {
    const next = mine.acceptingTeam === false;
    try {
      await setAcceptingTeam(currentUser.uid, next);
      setMine((m) => ({ ...m, acceptingTeam: next }));
      setFounders((xs) => (xs || []).map((x) => (x.uid === currentUser.uid ? { ...x, acceptingTeam: next } : x)));
      toast.success(next ? 'You’re accepting teammates.' : 'Your team is closed to new teammates.');
    } catch (_) { toast.error('Could not change it. Please try again.'); }
  };

  const blocker = profile === undefined ? undefined : founderBlocker(profile);
  // Joining a founder's team also needs at least one badge.
  const hasBadge = !!(profile?.badges || []).length;
  const shown = useMemo(() => (founders || [])
    .filter((p) => !track || (p.tracksNeeded || []).includes(track))
    .sort((a, b) => (b.acceptedAt?.seconds || 0) - (a.acceptedAt?.seconds || 0)), [founders, track]);

  const send = async (form) => {
    setBusy(true);
    try {
      await submitPitch(currentUser.uid, profile?.displayName || currentUser.displayName, form, mine);
      // Tell admins and editors: bell, phone, and email (best effort).
      const who = profile?.displayName || currentUser.displayName || 'A member';
      alertStaff({
        type: 'founder_pitch',
        title: mine ? `Founder pitch sent again: ${form.ideaName.trim()}` : `New founder pitch: ${form.ideaName.trim()}`,
        body: `${who} ${mine ? 'updated and resent' : 'sent'} a pitch for She Model Tech Conference. ${form.problem.trim().slice(0, 160)}`,
        link: '/admin?tab=founders',
        roles: ['admin', 'editor'],
        ctaLabel: 'Review the pitch',
      });
      setMine(await getMyPitch(currentUser.uid));
      setEditing(false);
      toast.success('Your pitch is in. We’ll let you know once it’s reviewed.');
    } catch (_) {
      toast.error('Could not send your pitch. Please check each field and try again.');
    }
    setBusy(false);
  };
  const withdraw = async () => {
    if (!window.confirm('Withdraw your pitch? You can apply again later.')) return;
    try { await withdrawPitch(currentUser.uid); setMine(null); setFounders((xs) => (xs || []).filter((x) => x.uid !== currentUser.uid)); toast.success('Pitch withdrawn.'); } catch (_) { toast.error('Could not withdraw it. Please try again.'); }
  };

  // Her own status box.
  const myBox = (() => {
    if (blocker === undefined || mine === undefined) return null;
    if (blocker === 'company') return null;
    if (blocker === 'badge') {
      return (
        <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-5">
          <p className="font-bold text-gray-900">Earn your first badge to pitch or join a founder’s team</p>
          <p className="text-sm text-gray-700 mt-1">Founders and their teams have finished at least one She Model Tech project. Join a project, finish it, and earn a badge, then come back to pitch your idea or join a founder.</p>
          <Link to="/projects" className="inline-block mt-3 text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Find a project</Link>
        </div>
      );
    }
    if (blocker) return null;
    if (!mine || editing) {
      return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="font-bold text-gray-900">{mine ? 'Edit your pitch' : 'Have an idea? Apply to pitch'}</p>
          <p className="text-sm text-gray-600 mt-1">{CONFERENCE_NOTE}</p>
          {!editing && !mine ? (
            <button type="button" onClick={() => setEditing(true)} className="mt-3 text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Apply to pitch</button>
          ) : (
            <PitchForm initial={mine} busy={busy} onSubmit={send} onCancel={() => setEditing(false)} />
          )}
        </div>
      );
    }
    if (mine.status === 'pending') {
      return (
        <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-5">
          <p className="font-bold text-gray-900">Your pitch is with She Model Tech for review</p>
          <p className="text-sm text-gray-700 mt-1"><b>{mine.ideaName}</b> · {stageLabel(mine.stage)}. We’ll notify you once it’s reviewed.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => setEditing(true)} className="text-sm font-semibold border border-gray-300 bg-white px-4 py-2 rounded-lg hover:bg-gray-50">Edit pitch</button>
            <button type="button" onClick={withdraw} className="text-sm font-semibold text-gray-600 hover:text-red-600 px-2">Withdraw</button>
          </div>
        </div>
      );
    }
    if (mine.status === 'declined') {
      return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="font-bold text-gray-900">Your pitch wasn’t accepted this time</p>
          {mine.decisionNote && <p className="text-sm text-gray-700 mt-1">Note from She Model Tech: “{mine.decisionNote}”</p>}
          <p className="text-sm text-gray-600 mt-1">You can improve it and send it again.</p>
          <button type="button" onClick={() => setEditing(true)} className="mt-3 text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Edit and apply again</button>
        </div>
      );
    }
    return (
      <div className="rounded-2xl border border-pink-200 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-pink-700">You’re a founder</p>
        <p className="font-bold text-gray-900 mt-1">{mine.ideaName}</p>
        <p className="text-sm text-gray-700 mt-1">{CONFERENCE_NOTE}</p>
        <p className="text-sm text-gray-700 mt-1">Your teammates need at least one badge. You’ll see each member’s badges on the Talent Board and their profile.</p>
        <p className="text-sm text-gray-700 mt-1">Members see only your card: the idea’s name, tagline, stage, and the roles you need. Share the details with people you trust, in messages or your team group.</p>
        {!mine.tagline && <p className="text-sm font-semibold text-pink-700 mt-1">Add a tagline so members know what you’re building: tap “Edit my card”.</p>}
        {mine.decisionNote && <p className="text-sm text-gray-600 mt-1">Note from She Model Tech: “{mine.decisionNote}”</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/talent-board" className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Find teammates on the Talent Board</Link>
          <button type="button" onClick={() => setEditingNeeds((v) => !v)} className="text-sm font-semibold border border-gray-300 bg-white px-4 py-2 rounded-lg hover:bg-gray-50">{editingNeeds ? 'Close' : 'Edit my card'}</button>
          <button type="button" onClick={withdraw} className="text-sm font-semibold text-gray-500 hover:text-red-600 px-2">Remove my pitch</button>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">Team group</p>
            <p className="text-sm text-gray-600">{myGroup ? `${(myGroup.members || []).length} of 20 people${myGroup.status === 'archived' ? ' · archived' : ''}` : 'After messaging someone, invite them to a group chat for your whole team.'}</p>
          </div>
          {myGroup ? (
            <Link to={`/founders/group/${myGroup.id}`} className="text-sm font-semibold bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg">Open team group</Link>
          ) : (
            <button type="button" onClick={startGroup} className="text-sm font-semibold bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg">Create team group</button>
          )}
        </div>
        <label className="mt-4 flex items-center gap-3 text-sm text-gray-800 cursor-pointer">
          <button type="button" role="switch" aria-checked={mine.acceptingTeam !== false} onClick={toggleAccepting}
            className={`relative w-11 h-6 rounded-full transition-colors ${mine.acceptingTeam !== false ? 'bg-pink-600' : 'bg-gray-300'}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${mine.acceptingTeam !== false ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
          <span><b>Accepting teammates</b> · {mine.acceptingTeam !== false ? 'members can tap “I’m interested”' : 'your card shows “Team closed”'}</span>
        </label>
        {editingNeeds && <TeamNeedsForm pitch={mine} onSaved={(d) => { setMine((m) => ({ ...m, ...d })); setFounders((xs) => (xs || []).map((x) => (x.uid === mine.uid ? { ...x, ...d } : x))); setEditingNeeds(false); }} />}
      </div>
    );
  })();

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Founders</h1>
      <p className="text-gray-500 text-sm mb-6 max-w-3xl">Find an idea you love and help build it; all you need is one badge to join.</p>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {[['1', 'Earn a badge', 'Finish a She Model Tech project and earn at least one badge.'],
          ['2', 'Apply to pitch', 'Tell us your idea. She Model Tech reviews every pitch.'],
          ['3', 'Pitch and build', 'Pitch for prize money at our conference, with a chance to pitch at partner events too.']].map(([n, t, d]) => (
          <div key={n} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-bold text-gray-900"><span className="text-pink-600 mr-1.5">{n}</span>{t}</p>
            <p className="text-sm text-gray-600 mt-1">{d}</p>
          </div>
        ))}
      </div>

      {invites.length > 0 && (
        <div className="mb-4 max-w-3xl space-y-2">
          {invites.map((g) => (
            <div key={g.id} className="rounded-2xl border border-pink-200 bg-pink-50/60 p-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-900"><b>{(g.memberNames || {})[g.founderUid] || 'A founder'}</b> invited you to join <b>{g.name}</b>.</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => respond(g, true)} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">Join</button>
                <button type="button" onClick={() => respond(g, false)} className="text-sm font-semibold border border-gray-300 bg-white px-4 py-2 rounded-lg hover:bg-gray-50">Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {groups.filter((g) => g.founderUid !== currentUser?.uid).length > 0 && (
        <div className="mb-4 max-w-3xl rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-sm font-semibold text-gray-900">Your teams</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {groups.filter((g) => g.founderUid !== currentUser?.uid).map((g) => (
              <Link key={g.id} to={`/founders/group/${g.id}`} className="text-sm font-semibold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">{g.name}{g.status === 'archived' ? ' (archived)' : ''}</Link>
            ))}
          </div>
        </div>
      )}
      {mine?.status === 'accepted' && !blocker && (
        <div className="mb-4 max-w-3xl"><YourPitch pitch={mine} onAttendance={(a, partner) => setMine((m) => ({ ...m, attendance: a, ...(partner === undefined ? {} : { partnerOptIn: partner }) }))} /></div>
      )}
      {myBox && <div className="mb-8 max-w-3xl">{myBox}</div>}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-bold text-gray-900">Founders building now</h2>
        <select value={track} onChange={(e) => setTrack(e.target.value)} aria-label="Track needed" className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white">
          <option value="">All tracks needed</option>
          {BADGE_TRACKS.map((t) => <option key={t.name} value={t.name}>{t.label}</option>)}
        </select>
      </div>

      {founders === null ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" /></div>
      ) : shown.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-gray-300 rounded-2xl">
          <p className="text-gray-900 font-semibold">{founders.length ? 'No founders need that track right now.' : 'No founders yet'}</p>
          <p className="text-gray-600 text-sm mt-1">{founders.length ? 'Try another track.' : 'Accepted founders will appear here with the roles they need.'}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {shown.map((p) => (
            <article key={p.uid} id={p.uid} className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900">{p.ideaName}</h3>
                  <p className="text-sm text-gray-600">by <Link to={`/profile/${encodeURIComponent(p.uid)}`} className="font-semibold text-gray-900 hover:text-pink-700 hover:underline">{p.name}</Link></p>
                </div>
                <span className="flex-shrink-0 text-xs font-semibold bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full">{stageLabel(p.stage)}</span>
              </div>
              {p.tagline && <p className="text-base text-gray-800 mt-3">{p.tagline}</p>}
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Looking for</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {(p.tracksNeeded || []).map((t) => <span key={t} className="text-xs font-semibold bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full">{trackLabel(t)}</span>)}
                </div>
                {p.rolesNeeded && <p className="text-sm text-gray-700 mt-2">{p.rolesNeeded}</p>}
              </div>
              <div className="mt-auto pt-4 flex flex-wrap gap-2">
                {p.uid !== currentUser?.uid && p.acceptingTeam === false ? (
                  <span className="text-sm font-semibold bg-gray-100 text-gray-500 px-4 py-2 rounded-lg">Team closed</span>
                ) : p.uid !== currentUser?.uid && profile !== undefined && !profile?.isCompany && (hasBadge ? (
                  <button type="button" onClick={() => navigate(`/messages?to=${p.uid}`)} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">I’m interested</button>
                ) : (
                  <Link to="/projects" title="Joining a founder’s team needs at least one badge" className="text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg">Earn a badge to join</Link>
                ))}
                <Link to={`/profile/${encodeURIComponent(p.uid)}`} className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">View profile</Link>
              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  );
};

export default Founders;
