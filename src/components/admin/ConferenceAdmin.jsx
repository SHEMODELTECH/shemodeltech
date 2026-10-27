// src/components/admin/ConferenceAdmin.jsx
// Admin → Conference: what shemodeltech.com/conference shows. Date and venue,
// registration (link the conference event from Events and switch it on),
// speakers (photo, name, title, role, topic), and partner organizations
// (logo, name, website). Also shows how many members asked to be notified.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { uploadImageToBlob, validateImageFile } from '../../utils/blobStorage';
import { shrinkImage } from '../EventImages';
import { SPEAKER_ROLES, eventIdFrom, getConferencePage, notifyList, saveConferencePage } from '../../utils/conference';

const input = 'mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-normal bg-white focus:border-pink-500 focus:outline-none';
const label = 'block text-sm font-semibold text-gray-800';

const ImagePick = ({ url, onChange, round }) => {
  const [busy, setBusy] = useState(false);
  const pick = async (file) => {
    if (!file) return;
    const bad = validateImageFile(file);
    if (bad) { toast.error(bad); return; }
    setBusy(true);
    try { onChange((await uploadImageToBlob(await shrinkImage(file), 'conference')).url); } catch (_) { toast.error('Could not upload the image.'); }
    setBusy(false);
  };
  return (
    <div className="flex items-center gap-3">
      {url ? <img src={url} alt="" className={`w-14 h-14 object-cover border border-gray-200 ${round ? 'rounded-full' : 'rounded-lg object-contain bg-white'}`} /> : <span className={`w-14 h-14 bg-gray-100 ${round ? 'rounded-full' : 'rounded-lg'}`} />}
      <label className={`text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg ${busy ? 'opacity-50' : 'cursor-pointer hover:bg-gray-50'}`}>
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} />
        {busy ? 'Uploading…' : url ? 'Change' : 'Add image'}
      </label>
      {url && <button type="button" onClick={() => onChange('')} className="text-xs text-gray-500 hover:text-red-600">Remove</button>}
    </div>
  );
};

const move = (list, i, d) => {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const x = [...list];
  [x[i], x[j]] = [x[j], x[i]];
  return x;
};

const ConferenceAdmin = () => {
  const { currentUser } = useAuth();
  const [f, setF] = useState(null);
  const [notifyCount, setNotifyCount] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getConferencePage().then((c) => setF({
      dateText: c.dateText || '', venue: c.venue || '', eventLink: c.eventId ? `/events/${c.eventId}` : '',
      registrationOpen: !!c.registrationOpen, speakers: c.speakers || [], partners: c.partners || [],
    }));
    notifyList().then((l) => setNotifyCount(l.length)).catch(() => setNotifyCount(null));
  }, []);
  if (!f) return <p className="py-10 text-center text-gray-400 text-sm">Loading…</p>;

  const setSpeaker = (i, k, v) => setF((x) => ({ ...x, speakers: x.speakers.map((s, j) => (j === i ? { ...s, [k]: v } : s)) }));
  const setPartner = (i, k, v) => setF((x) => ({ ...x, partners: x.partners.map((p, j) => (j === i ? { ...p, [k]: v } : p)) }));

  const save = async () => {
    const eventId = eventIdFrom(f.eventLink);
    if (f.eventLink.trim() && !eventId) return toast.error('Paste the conference event’s address from Events, e.g. shemodeltech.com/events/abc123.');
    if (f.registrationOpen && !eventId) return toast.error('Link the conference event before opening registration.');
    if (f.partners.some((p) => p.url && !/^https:\/\//i.test(p.url.trim()))) return toast.error('Partner websites should start with https://');
    setBusy(true);
    try {
      await saveConferencePage({
        dateText: f.dateText.trim(), venue: f.venue.trim(), eventId: eventId || null, registrationOpen: !!f.registrationOpen && !!eventId,
        speakers: f.speakers.filter((s) => (s.name || '').trim()).map((s) => ({ name: s.name.trim(), title: (s.title || '').trim(), role: s.role || '', topic: (s.topic || '').trim(), photoUrl: s.photoUrl || '' })),
        partners: f.partners.filter((p) => (p.name || '').trim()).map((p) => ({ name: p.name.trim(), logoUrl: p.logoUrl || '', url: (p.url || '').trim() })),
      }, currentUser?.email);
      toast.success('Conference page saved.');
    } catch (_) { toast.error('Could not save.'); }
    setBusy(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-600">Everything on <Link to="/conference" className="font-semibold text-pink-700 hover:underline">shemodeltech.com/conference</Link>. Empty fields show “To be announced”.</p>
        <Link to="/conference" target="_blank" className="text-sm font-semibold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">View page ↗</Link>
      </div>

      <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-3">
        <h3 className="font-bold text-gray-900">Date and venue</h3>
        <label className={label}>Date and time<input className={input} maxLength={160} value={f.dateText} onChange={(e) => setF({ ...f, dateText: e.target.value })} placeholder="For example: Saturday, March 20, 2027, 10:00 AM to 4:00 PM EDT" /></label>
        <label className={label}>Venue<input className={input} maxLength={200} value={f.venue} onChange={(e) => setF({ ...f, venue: e.target.value })} placeholder="The address, or “Online”" /></label>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-3">
        <h3 className="font-bold text-gray-900">Registration</h3>
        <p className="text-sm text-gray-600">1. Create the conference as an event in <Link to="/events/manage" className="font-semibold text-pink-700 hover:underline">Events → Manage</Link> (category Conference). 2. Paste its address here. 3. Switch registration on. The page’s Register button then opens that event.</p>
        <label className={label}>Conference event address<input className={input} value={f.eventLink} onChange={(e) => setF({ ...f, eventLink: e.target.value })} placeholder="shemodeltech.com/events/…" /></label>
        <label className="flex items-center gap-2 text-sm text-gray-800">
          <input type="checkbox" checked={f.registrationOpen} onChange={(e) => setF({ ...f, registrationOpen: e.target.checked })} className="accent-pink-600" />
          Registration is open (shows “Register now”)
        </label>
        <p className="text-sm text-gray-700 bg-pink-50/60 border border-pink-100 rounded-lg px-3 py-2">
          <b>{notifyCount ?? '…'}</b> {notifyCount === 1 ? 'member has' : 'members have'} asked to be notified. When registration opens, use <Link to="/admin?tab=announcements" className="font-semibold text-pink-700 hover:underline">Send an announcement</Link> with the audience “Conference: notify me list”.
        </p>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Speakers</h3>
          <button type="button" onClick={() => setF((x) => ({ ...x, speakers: [...x.speakers, { name: '', title: '', role: 'Tech talk', topic: '', photoUrl: '' }] }))} className="text-sm font-semibold text-pink-700">+ Add speaker</button>
        </div>
        {f.speakers.length === 0 && <p className="text-sm text-gray-500">No speakers yet. The page shows “Speakers to be announced”.</p>}
        {f.speakers.map((s, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <ImagePick url={s.photoUrl} round onChange={(u) => setSpeaker(i, 'photoUrl', u)} />
            <div className="grid sm:grid-cols-2 gap-2">
              <label className={label}>Name<input className={input} maxLength={80} value={s.name} onChange={(e) => setSpeaker(i, 'name', e.target.value)} /></label>
              <label className={label}>Role
                <select className={input} value={s.role} onChange={(e) => setSpeaker(i, 'role', e.target.value)}>{SPEAKER_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}</select>
              </label>
              <label className={label}>Title and organization<input className={input} maxLength={100} value={s.title} onChange={(e) => setSpeaker(i, 'title', e.target.value)} placeholder="e.g. Technical Lead, Infosys" /></label>
              <label className={label}>Topic (optional)<input className={input} maxLength={120} value={s.topic} onChange={(e) => setSpeaker(i, 'topic', e.target.value)} /></label>
            </div>
            <div className="flex gap-3 text-xs">
              <button type="button" onClick={() => setF((x) => ({ ...x, speakers: move(x.speakers, i, -1) }))} className="text-gray-600 hover:text-gray-900">↑ Up</button>
              <button type="button" onClick={() => setF((x) => ({ ...x, speakers: move(x.speakers, i, 1) }))} className="text-gray-600 hover:text-gray-900">↓ Down</button>
              <button type="button" onClick={() => setF((x) => ({ ...x, speakers: x.speakers.filter((_, j) => j !== i) }))} className="ml-auto text-gray-500 hover:text-red-600">Remove</button>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Partner organizations</h3>
          <button type="button" onClick={() => setF((x) => ({ ...x, partners: [...x.partners, { name: '', logoUrl: '', url: '' }] }))} className="text-sm font-semibold text-pink-700">+ Add partner</button>
        </div>
        {f.partners.length === 0 && <p className="text-sm text-gray-500">No partners yet. The page shows “Partner organizations to be announced”.</p>}
        {f.partners.map((p, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <ImagePick url={p.logoUrl} onChange={(u) => setPartner(i, 'logoUrl', u)} />
            <div className="grid sm:grid-cols-2 gap-2">
              <label className={label}>Name<input className={input} maxLength={80} value={p.name} onChange={(e) => setPartner(i, 'name', e.target.value)} /></label>
              <label className={label}>Website (optional)<input className={input} value={p.url} onChange={(e) => setPartner(i, 'url', e.target.value)} placeholder="https://" /></label>
            </div>
            <button type="button" onClick={() => setF((x) => ({ ...x, partners: x.partners.filter((_, j) => j !== i) }))} className="text-xs text-gray-500 hover:text-red-600">Remove</button>
          </div>
        ))}
      </section>

      <button type="button" disabled={busy} onClick={save} className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-lg disabled:opacity-50">{busy ? 'Saving…' : 'Save the conference page'}</button>
    </div>
  );
};

export default ConferenceAdmin;
