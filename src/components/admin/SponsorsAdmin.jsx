// src/components/admin/SponsorsAdmin.jsx
// Admin → Overview → Sponsors: add the companies that funded a cohort.
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { uploadImageToBlob } from '../../utils/blobStorage';
import { activeSponsors, addSponsor, listSponsors, removeSponsor } from '../../utils/sponsors';

const SponsorsAdmin = () => {
  const [list, setList] = useState(null);
  const [f, setF] = useState({ name: '', url: '', until: '' });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const load = () => listSponsors().then(setList).catch(() => setList([]));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!f.name.trim()) return toast.error('Add the company name.');
    if (!file) return toast.error('Add the company logo.');
    if (f.url && !/^https?:\/\//i.test(f.url.trim())) return toast.error('The website must start with https://');
    setBusy(true);
    try {
      const up = await uploadImageToBlob(file, 'sponsors');
      await addSponsor({ ...f, logoUrl: up.url });
      setF({ name: '', url: '', until: '' });
      setFile(null);
      toast.success('Sponsor added. Their logo now shows in Thank you to our sponsors.');
      load();
    } catch (e) {
      toast.error(e.message || 'Could not add the sponsor.');
    }
    setBusy(false);
  };

  const active = list ? activeSponsors(list) : [];
  const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm';
  return (
    <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-5">
      <h2 className="text-lg font-bold text-gray-900">Sponsors</h2>
      <p className="text-sm text-gray-500 mb-4">Companies that funded a cohort. Their logo shows in “Thank you to our sponsors” until the date you set.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="text-xs font-semibold text-gray-700">Company name
          <input className={input} maxLength={80} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        </label>
        <label className="text-xs font-semibold text-gray-700">Website <span className="font-normal text-gray-500">(optional)</span>
          <input className={input} placeholder="https://" value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} />
        </label>
        <label className="text-xs font-semibold text-gray-700">Logo <span className="font-normal text-gray-500">(PNG, JPG, or WebP, up to 10 MB)</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" className="block mt-1 text-sm" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
        <label className="text-xs font-semibold text-gray-700">Show until <span className="font-normal text-gray-500">(optional)</span>
          <input type="date" className={input} min={new Date().toISOString().slice(0, 10)} value={f.until} onChange={(e) => setF({ ...f, until: e.target.value })} />
        </label>
      </div>
      <button onClick={add} disabled={busy} className="mt-3 text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">{busy ? 'Adding…' : 'Add sponsor'}</button>

      {list && list.length > 0 && (
        <ul className="mt-5 space-y-2">
          {list.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 border border-gray-100 rounded-lg p-3">
              <span className="flex items-center gap-3 min-w-0">
                <img src={s.logoUrl} alt="" className="h-8 w-auto max-w-[90px] object-contain" />
                <span className="text-sm text-gray-900">{s.name}</span>
                {!active.some((a) => a.id === s.id) && <span className="text-[11px] font-semibold text-gray-500">(ended)</span>}
              </span>
              <button onClick={async () => { if (!window.confirm(`Remove ${s.name}?`)) return; await removeSponsor(s.id); load(); }} className="text-xs font-semibold text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SponsorsAdmin;
