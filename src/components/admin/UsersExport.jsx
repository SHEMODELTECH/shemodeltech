// src/components/admin/UsersExport.jsx
// Admin → Users: filter people by age, account type, and track, then download
// the people shown as a CSV with the columns you choose (for sending
// information to everyone or to one group). Admins only.
import React, { useState } from 'react';
import { BADGE_TRACKS } from '../../config/badgeTracks';

export const AGE_FILTERS = [
  ['all', 'All ages'],
  ['18plus', '18 and over'],
  ['13-17', '13 to 17'],
  ['under13', 'Under 13'],
  ['none', 'Age not set'],
];
export const TYPE_FILTERS = [
  ['all', 'All accounts'],
  ['member', 'Members'],
  ['mentor', 'Mentors'],
  ['company', 'Companies'],
  ['staff', 'Staff'],
];
export const TRACK_FILTERS = [
  ['all', 'All tracks'],
  ...BADGE_TRACKS.map((t) => [t.name, t.label]),
  ['none', 'No track chosen'],
];

const isStaff = (u) => ['admin', 'editor'].includes(u.role);
const trackLabel = (v) => BADGE_TRACKS.find((t) => t.name === v)?.label || '';
const accountType = (u) => (isStaff(u) ? 'Staff' : u.isCompany ? 'Company' : u.isTeacher ? 'Mentor' : 'Member');
const ageLabel = (u) => ({ '18plus': '18 and over', '13-17': '13 to 17', under13: 'Under 13' }[u.ageGroup] || '');

export const matchesUserFilters = (u, { age, type, track }) => {
  if (age !== 'all' && (age === 'none' ? !!u.ageGroup : u.ageGroup !== age)) return false;
  if (type === 'member' && (isStaff(u) || u.isCompany || u.isTeacher)) return false;
  if (type === 'mentor' && !u.isTeacher) return false;
  if (type === 'company' && !u.isCompany) return false;
  if (type === 'staff' && !isStaff(u)) return false;
  if (track !== 'all') {
    const t = BADGE_TRACKS.some((x) => x.name === u.primarySkillTrack) ? u.primarySkillTrack : 'none';
    if (t !== track) return false;
  }
  return true;
};

const joined = (ts) => {
  try {
    const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
    return d && !Number.isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : '';
  } catch (_) { return ''; }
};

const COLUMNS = [
  ['name', 'Name', (u) => u.companyProfile?.companyName || u.displayName || ''],
  ['email', 'Email', (u) => u.email || ''],
  ['type', 'Account type', accountType],
  ['age', 'Age group', ageLabel],
  ['track', 'Track', (u) => trackLabel(u.primarySkillTrack)],
  ['country', 'Country', (u) => u.country || ''],
  ['joined', 'Date joined', (u) => joined(u.createdAt)],
];
const DEFAULT_COLS = ['name', 'email'];
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

export const UserFilters = ({ value, onChange }) => {
  const sel = 'text-xs font-semibold bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-800 focus:border-pink-500 focus:outline-none';
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.value });
  return (
    <div className="flex flex-wrap gap-2">
      <select aria-label="Age" value={value.age} onChange={set('age')} className={sel}>
        {AGE_FILTERS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      <select aria-label="Account type" value={value.type} onChange={set('type')} className={sel}>
        {TYPE_FILTERS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      <select aria-label="Track" value={value.track} onChange={set('track')} className={sel}>
        {TRACK_FILTERS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
};

export const UsersCsvButton = ({ users }) => {
  const [open, setOpen] = useState(false);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const toggle = (k) => setCols((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]));
  const download = () => {
    const picked = COLUMNS.filter(([k]) => cols.includes(k));
    const lines = [picked.map(([, l]) => csvCell(l)).join(',')];
    users.forEach((u) => lines.push(picked.map(([, , get]) => csvCell(get(u))).join(',')));
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `she-model-tech-users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    setOpen(false);
  };
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} disabled={!users.length} aria-expanded={open}
        className="text-xs font-semibold bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-50">
        Download CSV ({users.length})
      </button>
      {open && (
        <div className="absolute left-0 sm:left-auto sm:right-0 z-20 mt-1 w-64 rounded-xl border border-gray-200 bg-white shadow-lg p-3">
          <p className="text-xs font-semibold text-gray-900 mb-2">Columns to include</p>
          <div className="space-y-1.5">
            {COLUMNS.map(([k, l]) => (
              <label key={k} className="flex items-center gap-2 text-sm text-gray-800">
                <input type="checkbox" checked={cols.includes(k)} onChange={() => toggle(k)} className="accent-pink-600" />
                {l}
              </label>
            ))}
          </div>
          <button type="button" onClick={download} disabled={!cols.length}
            className="mt-3 w-full text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded-lg disabled:opacity-50">
            Download {users.length} {users.length === 1 ? 'person' : 'people'}
          </button>
          <p className="mt-2 text-[11px] text-gray-500">Matches the filters and search above. Keep this file private.</p>
        </div>
      )}
    </div>
  );
};
