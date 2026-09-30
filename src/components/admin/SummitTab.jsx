// src/components/admin/SummitTab.jsx
// Admin > Summit: create and edit the summit, sponsors, registrations and
// check-in, and partner requests (New > Approved > Invoiced > Paid > Confirmed).
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { uploadImageToBlob } from '../../utils/blobStorage';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { minEndDate, minStartDate } from '../../utils/dateRules';
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
  emailInterested,
} from '../../utils/summit';
import { notifyMember } from '../../utils/staffAlerts';

const EMPTY = { title: '', theme: '', tagline: '', startDate: '', endDate: '', venue: '', description: '', partnerOptions: '', sessions: [], speakerList: [], faqs: [], exhibitors: [], announced: false, published: false, sponsors: [] };
const newId = () => Math.random().toString(36).slice(2, 10);
const FAQ_STARTERS = [
  ['Who is the Summit for?', 'Women in tech and those starting out: students, career changers, and professionals.'],
  ['How much does it cost?', 'The Summit is free for She Model Tech members.'],
  ['Is the venue accessible?', 'Yes. Tell us about any access needs when you register and we’ll make arrangements.'],
  ['How do I get there?', 'Travel and parking details will be shared before the event.'],
];

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
      const wasPublished = !!(summits || []).find((x) => x.id === editing)?.published;
      const savedId = await saveSummit(editing === 'new' ? null : editing, data);
      setEditing(savedId);
      toast.success(form.published ? 'Saved. Registration is open on the Summit page.' : form.announced ? 'Saved. It shows as coming soon, with Notify me.' : 'Saved as a draft.');
      if (form.published && !wasPublished) {
        const n = await emailInterested({ ...data, id: savedId }, notifyMember).catch(() => 0);
        if (n) toast.info(`${n} ${n === 1 ? 'person' : 'people'} who asked to be notified were emailed.`);
      }
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
              <p className="font-semibold text-gray-900">{s.title} {s.published ? <span className="text-xs text-emerald-700">· Registration open</span> : s.announced ? <span className="text-xs text-amber-700">· Coming soon</span> : <span className="text-xs text-gray-500">· Draft</span>}</p>
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
        <div className="sm:col-span-2"><label className={label} htmlFor="s-theme">Theme (the big headline, e.g. "Human in the Loop")</label><input id="s-theme" className={input} value={form.theme || ''} onChange={(e) => setForm({ ...form, theme: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className={label} htmlFor="s-tag">Tagline</label><input id="s-tag" className={input} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
        <div><label className={label} htmlFor="s-start">Start date</label><input id="s-start" type="date" min={minStartDate(editing !== 'new' ? (summits || []).find((x) => x.id === editing)?.startDate : null)} className={input} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
        <div><label className={label} htmlFor="s-end">End date</label><input id="s-end" type="date" min={minEndDate(form.startDate)} className={input} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className={label} htmlFor="s-venue">Venue (leave empty to show "Location to be announced")</label><input id="s-venue" className={input} value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className={label} htmlFor="s-desc">Description</label><textarea id="s-desc" rows={3} className={input} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className={label} htmlFor="s-po">Notes for companies (shown above the request form)</label><textarea id="s-po" rows={2} className={input} value={form.partnerOptions} onChange={(e) => setForm({ ...form, partnerOptions: e.target.value })} /></div>

        {/* Agenda */}
        <div className="sm:col-span-2 border-t border-gray-100 pt-3">
          <p className="text-sm font-bold text-gray-900">Agenda</p>
          {(form.sessions || []).map((x, i) => {
            const set = (k, v) => setForm((f) => ({ ...f, sessions: f.sessions.map((y, j) => (j === i ? { ...y, [k]: v } : y)) }));
            return (
              <div key={x.id} className="grid grid-cols-2 sm:grid-cols-6 gap-2 mt-2 bg-gray-50 rounded-lg p-2">
                <select className={input} value={x.type} onChange={(e) => set('type', e.target.value)} aria-label="Type">
                  {['keynote', 'panel', 'workshop', 'break'].map((t) => <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>)}
                </select>
                <input className={`${input} sm:col-span-2`} placeholder="Title" value={x.title} onChange={(e) => set('title', e.target.value)} />
                <input className={input} type="time" aria-label="Starts" value={x.start || ''} onChange={(e) => set('start', e.target.value)} />
                <input className={input} type="time" aria-label="Ends" value={x.end || ''} onChange={(e) => set('end', e.target.value)} />
                <input className={input} placeholder="Room" value={x.room || ''} onChange={(e) => set('room', e.target.value)} />
                <div className="col-span-2 sm:col-span-4 flex flex-wrap gap-2 items-center text-xs">
                  {(form.speakerList || []).map((sp) => (
                    <label key={sp.id} className="flex items-center gap-1">
                      <input type="checkbox" checked={(x.speakerIds || []).includes(sp.id)} onChange={(e) => set('speakerIds', e.target.checked ? [...(x.speakerIds || []), sp.id] : (x.speakerIds || []).filter((y) => y !== sp.id))} />
                      {sp.name}
                    </label>
                  ))}
                  {(form.speakerList || []).length === 0 && <span className="text-gray-500">Add speakers below to assign them.</span>}
                </div>
                {x.type === 'workshop' ? (
                  <input className={input} type="number" min="1" placeholder="Seats" value={x.seats || ''} onChange={(e) => set('seats', e.target.value)} aria-label="Seats" />
                ) : <span />}
                <button onClick={() => setForm((f) => ({ ...f, sessions: f.sessions.filter((_, j) => j !== i) }))} className="text-xs font-semibold text-red-700">Remove</button>
              </div>
            );
          })}
          <button onClick={() => setForm((f) => ({ ...f, sessions: [...(f.sessions || []), { id: newId(), type: 'keynote', title: '', start: '', end: '', room: '', speakerIds: [] }] }))} className="mt-2 text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg">Add session</button>
        </div>

        {/* Speakers */}
        <div className="sm:col-span-2 border-t border-gray-100 pt-3">
          <p className="text-sm font-bold text-gray-900">Speakers <span className="font-normal text-gray-500">(shown once you add one)</span></p>
          {(form.speakerList || []).map((sp, i) => {
            const set = (k, v) => setForm((f) => ({ ...f, speakerList: f.speakerList.map((y, j) => (j === i ? { ...y, [k]: v } : y)) }));
            return (
              <div key={sp.id} className="grid sm:grid-cols-4 gap-2 mt-2 bg-gray-50 rounded-lg p-2">
                <input className={input} placeholder="Name" value={sp.name} onChange={(e) => set('name', e.target.value)} />
                <input className={input} placeholder="Role" value={sp.role || ''} onChange={(e) => set('role', e.target.value)} />
                <input className={input} placeholder="Company" value={sp.company || ''} onChange={(e) => set('company', e.target.value)} />
                <label className="text-xs text-gray-700">Photo {sp.photoUrl ? '(added)' : ''}
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="block text-xs mt-1" onChange={async (e) => {
                    const f = e.target.files?.[0]; if (!f) return;
                    try { const up = await uploadImageToBlob(f, 'summit'); set('photoUrl', up.url); toast.info('Photo added. Save the summit to publish it.'); } catch (err) { toast.error('Could not upload the photo.'); }
                  }} />
                </label>
                <textarea className={`${input} sm:col-span-3`} rows={2} maxLength={400} placeholder="Short bio (optional)" value={sp.bio || ''} onChange={(e) => set('bio', e.target.value)} />
                <button onClick={() => setForm((f) => ({ ...f, speakerList: f.speakerList.filter((_, j) => j !== i), sessions: (f.sessions || []).map((x) => ({ ...x, speakerIds: (x.speakerIds || []).filter((y) => y !== sp.id) })) }))} className="text-xs font-semibold text-red-700">Remove</button>
              </div>
            );
          })}
          <button onClick={() => setForm((f) => ({ ...f, speakerList: [...(f.speakerList || []), { id: newId(), name: '', role: '', company: '', bio: '', photoUrl: null }] }))} className="mt-2 text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg">Add speaker</button>
        </div>

        {/* FAQs */}
        <div className="sm:col-span-2 border-t border-gray-100 pt-3">
          <p className="text-sm font-bold text-gray-900">FAQs</p>
          {(form.faqs || []).map((f, i) => (
            <div key={i} className="grid gap-2 mt-2 bg-gray-50 rounded-lg p-2">
              <input className={input} placeholder="Question" value={f.q} onChange={(e) => setForm((ff) => ({ ...ff, faqs: ff.faqs.map((y, j) => (j === i ? { ...y, q: e.target.value } : y)) }))} />
              <textarea className={input} rows={2} placeholder="Answer" value={f.a} onChange={(e) => setForm((ff) => ({ ...ff, faqs: ff.faqs.map((y, j) => (j === i ? { ...y, a: e.target.value } : y)) }))} />
              <button onClick={() => setForm((ff) => ({ ...ff, faqs: ff.faqs.filter((_, j) => j !== i) }))} className="text-xs font-semibold text-red-700 justify-self-start">Remove</button>
            </div>
          ))}
          <div className="flex flex-wrap gap-2 mt-2">
            <button onClick={() => setForm((f) => ({ ...f, faqs: [...(f.faqs || []), { q: '', a: '' }] }))} className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg">Add question</button>
            {(form.faqs || []).length === 0 && (
              <button onClick={() => setForm((f) => ({ ...f, faqs: FAQ_STARTERS.map(([q, a]) => ({ q, a })) }))} className="text-xs font-semibold border border-pink-200 text-pink-700 px-3 py-1.5 rounded-lg">Start with suggested questions</button>
            )}
          </div>
        </div>
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
        <div className="sm:col-span-2 border-t border-gray-100 pt-3 space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input type="checkbox" checked={!!form.announced} onChange={(e) => setForm({ ...form, announced: e.target.checked })} /> Show on the Summit page as coming soon (visitors can click <strong>Notify me</strong>)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input type="checkbox" checked={!!form.published} onChange={(e) => setForm({ ...form, published: e.target.checked, announced: e.target.checked || form.announced })} /> Open registration (everyone who clicked Notify me is emailed)
          </label>
        </div>
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
                    <p className="text-sm font-semibold text-gray-900">{p.companyName} <span className="font-normal text-gray-500">· {PARTNER_OPTIONS[p.option] || p.option}</span></p>
                    <select value={p.status} onChange={async (e) => {
                        const st = e.target.value;
                        await setPartnerStatus(p.id, st);
                        setPartners((xs) => xs.map((x) => (x.id === p.id ? { ...x, status: st } : x)));
                        // Approved requests appear under "Exhibitors and partners" on the Summit page.
                        const shown = ['approved', 'invoiced', 'paid', 'confirmed'].includes(st);
                        const rest = (form.exhibitors || []).filter((x) => x.id !== p.id);
                        const exhibitors = shown ? [...rest, { id: p.id, name: p.companyName, option: p.option }] : rest;
                        setForm((f) => ({ ...f, exhibitors }));
                        await updateDoc(doc(db, 'summits', editing), { exhibitors }).catch(() => {});
                        // Recruiting-table partners (paid or confirmed) can see attendees who opted in.
                        if (p.option === 'booth' && p.companyUid) {
                          const on = ['paid', 'confirmed'].includes(st);
                          await updateDoc(doc(db, 'summits', editing), { recruiterUids: on ? arrayUnion(p.companyUid) : arrayRemove(p.companyUid) }).catch(() => {});
                        }
                      }}
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1" aria-label="Status">
                      {PARTNER_STATUSES.map((s) => <option key={s} value={s}>{PARTNER_STATUS_LABELS[s]}</option>)}
                    </select>
                  </div>
                  <p className="text-xs text-gray-500">{p.contactName} · <a className="underline" href={`mailto:${p.contactEmail}`}>{p.contactEmail}</a>
                    {(form.exhibitors || []).some((x) => x.id === p.id) && (
                      <> · <button className="underline" onClick={async () => { const exhibitors = (form.exhibitors || []).filter((x) => x.id !== p.id); setForm((f) => ({ ...f, exhibitors })); await updateDoc(doc(db, 'summits', editing), { exhibitors }).catch(() => {}); }}>Hide from the Summit page</button></>
                    )}
                  </p>
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
