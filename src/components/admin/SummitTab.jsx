// src/components/admin/SummitTab.jsx
// Admin > Summit: create and edit the summit, sponsors, registrations and
// check-in, and partner requests (New > Approved > Invoiced > Paid > Confirmed).
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { uploadImageToBlob } from '../../utils/blobStorage';
import {
  PARTNER_OPTIONS,
  PARTNER_STATUSES,
  PARTNER_STATUS_LABELS,
  listPartnerRequests,
  listRegistrations,
  listSummits,
  saveSummit,
  setCheckedIn,
  setPartnerStatus,
} from '../../utils/summit';

const EMPTY = { title: '', tagline: '', startDate: '', endDate: '', venue: '', description: '', agenda: '', speakers: '', workshops: '', partnerOptions: '', published: false, sponsors: [] };

const SummitTab = () => {
  const [summits, setSummits] = useState(null);
  const [editing, setEditing] = useState(null); // summit id or 'new'
  const [form, setForm] = useState(EMPTY);
  const [regs, setRegs] = useState([]);
  const [partners, setPartners] = useState([]);
  const [sponsor, setSponsor] = useState({ name: '', url: '', file: null });
  const [busy, setBusy] = useState(false);

  const load = () => listSummits().then(setSummits).catch(() => setSummits([]));
  useEffect(() => {
    load();
  }, []);

  const open = async (s) => {
    setEditing(s ? s.id : 'new');
    setForm(s ? { ...EMPTY, ...s } : EMPTY);
    if (s) {
      listRegistrations(s.id).then(setRegs).catch(() => setRegs([]));
      listPartnerRequests(s.id).then(setPartners).catch(() => setPartners([]));
    } else {
      setRegs([]);
      setPartners([]);
    }
  };

  const save = async () => {
    if (!form.title.trim() || !form.startDate) return toast.error('Add a title and a start date.');
    setBusy(true);
    try {
      const { id, createdAt, updatedAt, ...data } = form;
      const newId = await saveSummit(editing === 'new' ? null : editing, data);
      setEditing(newId);
      toast.success(form.published ? 'Saved. It’s live on the Summit page.' : 'Saved as a draft.');
      load();
    } catch (e) {
      toast.error('Could not save the summit.');
    }
    setBusy(false);
  };

  const addSponsor = async () => {
    if (!sponsor.name.trim()) return toast.error('Add the sponsor’s name.');
    if (sponsor.file && sponsor.file.size > 1024 * 1024) return toast.error('Logos must be 1 MB or smaller.');
    setBusy(true);
    try {
      let logoUrl = null;
      if (sponsor.file) logoUrl = (await uploadImageToBlob(sponsor.file, 'summit')).url;
      setForm((f) => ({ ...f, sponsors: [...(f.sponsors || []), { name: sponsor.name.trim(), url: sponsor.url.trim() || null, logoUrl }] }));
      setSponsor({ name: '', url: '', file: null });
      toast.info('Sponsor added. Save the summit to publish it.');
    } catch (e) {
      toast.error('Could not upload the logo.');
    }
    setBusy(false);
  };

  const input = 'w-full text-sm border border-gray-300 rounded-lg px-3 py-2';
  const label = 'block text-xs font-semibold text-gray-700 mb-1';

  if (!editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900 font-bold">Summits</h3>
          <button onClick={() => open(null)} className="text-sm font-semibold bg-pink-600 text-white px-3 py-1.5 rounded-lg">New summit</button>
        </div>
        {summits === null ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : summits.length === 0 ? (
          <p className="text-gray-400 text-sm">No summits yet.</p>
        ) : (
          summits.map((s) => (
            <button key={s.id} onClick={() => open(s)} className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 mb-2 hover:border-pink-300">
              <p className="font-semibold text-gray-900">{s.title} {s.published ? <span className="text-xs text-emerald-700">· Live</span> : <span className="text-xs text-gray-500">· Draft</span>}</p>
              <p className="text-xs text-gray-500">{s.startDate}{s.venue ? ` · ${s.venue}` : ''}</p>
            </button>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => setEditing(null)} className="text-sm font-semibold text-gray-600">&larr; All summits</button>
      <div className="bg-white border border-gray-200 rounded-xl p-4 grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2"><label className={label} htmlFor="s-title">Title</label><input id="s-title" className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className={label} htmlFor="s-tag">Tagline</label><input id="s-tag" className={input} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
        <div><label className={label} htmlFor="s-start">Start date</label><input id="s-start" type="date" className={input} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
        <div><label className={label} htmlFor="s-end">End date</label><input id="s-end" type="date" className={input} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className={label} htmlFor="s-venue">Venue (or "Online")</label><input id="s-venue" className={input} value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className={label} htmlFor="s-desc">Description</label><textarea id="s-desc" rows={3} className={input} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        {[['agenda', 'Agenda (one item per line, e.g. "9:00 Welcome")'], ['speakers', 'Speakers (one per line)'], ['workshops', 'Workshops (one per line; mark sponsored ones "Sponsored")'], ['partnerOptions', 'Partner options and pricing notes (shown on the page)']].map(([k, l]) => (
          <div key={k} className="sm:col-span-2"><label className={label} htmlFor={`s-${k}`}>{l}</label><textarea id={`s-${k}`} rows={4} className={input} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
        ))}
        <div className="sm:col-span-2">
          <p className={label}>Sponsors (logo and name only)</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {(form.sponsors || []).map((sp, i) => (
              <span key={i} className="text-xs bg-gray-100 rounded-full px-2 py-1">
                {sp.name} <button onClick={() => setForm({ ...form, sponsors: form.sponsors.filter((_, j) => j !== i) })} aria-label={`Remove ${sp.name}`}>×</button>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <input placeholder="Sponsor name" className="text-sm border border-gray-300 rounded-lg px-2 py-1" value={sponsor.name} onChange={(e) => setSponsor({ ...sponsor, name: e.target.value })} />
            <input placeholder="Website (optional)" className="text-sm border border-gray-300 rounded-lg px-2 py-1" value={sponsor.url} onChange={(e) => setSponsor({ ...sponsor, url: e.target.value })} />
            <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={(e) => setSponsor({ ...sponsor, file: e.target.files[0] || null })} className="text-xs" aria-label="Logo (up to 1 MB)" />
            <button onClick={addSponsor} disabled={busy} className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg">Add sponsor</button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Logo up to 1 MB.</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-800 sm:col-span-2">
          <input type="checkbox" checked={!!form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Show on the public Summit page
        </label>
        <div className="sm:col-span-2"><button onClick={save} disabled={busy} className="text-sm font-semibold bg-pink-600 text-white px-4 py-2 rounded-lg">Save summit</button></div>
      </div>

      {editing !== 'new' && (
        <>
          <div>
            <h3 className="text-gray-900 font-bold mb-2">Registrations ({regs.length}) · Checked in: {regs.filter((r) => r.checkedIn).length}</h3>
            {regs.length === 0 ? (
              <p className="text-gray-400 text-sm">No registrations yet.</p>
            ) : (
              regs.map((r) => (
                <div key={r.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2.5 mb-1.5 text-sm">
                  <span>{r.name} <span className="text-gray-500">· {r.email}{r.shareProfile ? ' · shares profile' : ''}</span></span>
                  <button onClick={async () => { await setCheckedIn(r, !r.checkedIn); setRegs((xs) => xs.map((x) => (x.id === r.id ? { ...x, checkedIn: !r.checkedIn } : x))); }}
                    className={`text-xs font-semibold px-3 py-1 rounded-lg ${r.checkedIn ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    {r.checkedIn ? 'Checked in' : 'Check in'}
                  </button>
                </div>
              ))
            )}
          </div>
          <div>
            <h3 className="text-gray-900 font-bold mb-2">Partner requests</h3>
            {partners.length === 0 ? (
              <p className="text-gray-400 text-sm">No partner requests yet.</p>
            ) : (
              partners.map((p) => (
                <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-3 mb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900">{p.companyName} <span className="font-normal text-gray-500">· {PARTNER_OPTIONS[p.option]}</span></p>
                    <select value={p.status} onChange={async (e) => { await setPartnerStatus(p.id, e.target.value); setPartners((xs) => xs.map((x) => (x.id === p.id ? { ...x, status: e.target.value } : x))); }}
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1" aria-label="Status">
                      {PARTNER_STATUSES.map((s) => <option key={s} value={s}>{PARTNER_STATUS_LABELS[s]}</option>)}
                    </select>
                  </div>
                  <p className="text-xs text-gray-500">{p.contactName} · <a className="underline" href={`mailto:${p.contactEmail}`}>{p.contactEmail}</a></p>
                  {p.message && <p className="text-sm text-gray-700 mt-1">{p.message}</p>}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SummitTab;
