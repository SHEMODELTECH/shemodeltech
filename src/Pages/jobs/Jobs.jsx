// src/Pages/jobs/Jobs.jsx
// Jobs board (free to browse), job detail, and posting (Premium, verified companies).

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { isPremium, isVerifiedPartner } from '../../config/premium';
import PremiumBadge from '../../components/PremiumBadge';
import LimitHint, { countWords } from '../../components/LimitHint';
import { friendlyError } from '../../components/NoteDialog';
import { authFetch } from '../../utils/authFetch';
import {
  JOB_LIMITS,
  JOB_TRACKS,
  JOB_TYPES,
  createJob,
  deleteJob,
  getJob,
  listMyJobs,
  listOpenJobs,
  setJobFeatured,
  setJobStatus,
  updateJob,
} from '../../utils/jobs';

const useMyProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid))
      .then((s) => setProfile(s.exists() ? { uid: currentUser.uid, ...s.data() } : { uid: currentUser.uid }))
      .catch(() => setProfile({ uid: currentUser.uid }));
  }, [currentUser]);
  return profile;
};

const canPostJobs = (p) => !!p && (['admin', 'editor'].includes(p.role) || (p.isCompany && p.isVerified && isPremium(p)));

// ---------- AI-powered matches (Premium members) ----------
const scoreJob = (job, profile) => {
  const skills = (profile?.skills || []).map((s) => String(s).toLowerCase());
  const text = `${job.title} ${job.description}`.toLowerCase();
  let score = skills.filter((s) => s && text.includes(s)).length * 2;
  if (profile?.primarySkillTrack && (job.tracks || []).includes(profile.primarySkillTrack)) score += 5;
  Object.keys(profile?.badgeCounts || {}).forEach((t) => {
    if ((job.tracks || []).includes(t)) score += 3;
  });
  return score;
};

const aiMatches = async (profile, jobs) => {
  const key = `smt-job-matches:${profile.uid}:${jobs.length}`;
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) || 'null');
    if (cached) return cached;
  } catch (_) {
    /* ignore */
  }
  const pool = [...jobs].sort((a, b) => scoreJob(b, profile) - scoreJob(a, profile)).slice(0, 30);
  let ids = null;
  try {
    const res = await authFetch('/api/claude-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content:
              `A job seeker has these skills: ${(profile.skillsList || profile.skills || []).join(', ') || 'not listed'}; ` +
              `main track: ${profile.primarySkillTrack || 'not set'}; experience: ${profile.experienceLevel || 'not set'}. ` +
              `From these jobs, pick the 3 best fits. Reply with only a JSON array of ids, nothing else.\n` +
              JSON.stringify(pool.map((j) => ({ id: j.id, title: j.title, type: j.type, tracks: j.tracks, about: j.description.slice(0, 300) }))),
          },
        ],
      }),
    });
    const data = await res.json();
    const txt = (data.content || []).map((c) => c.text || '').join('');
    const parsed = JSON.parse(txt.replace(/```json|```/g, '').trim());
    if (Array.isArray(parsed)) ids = parsed.filter((id) => pool.some((j) => j.id === id)).slice(0, 3);
  } catch (_) {
    ids = null;
  }
  if (!ids || !ids.length) ids = pool.slice(0, 3).map((j) => j.id);
  try {
    sessionStorage.setItem(key, JSON.stringify(ids));
  } catch (_) {
    /* ignore */
  }
  return ids;
};

const JobCard = ({ j }) => (
  <Link to={`/jobs/${j.id}`} className={`block bg-white border rounded-xl p-4 hover:border-pink-300 ${j.featured ? 'border-pink-300' : 'border-gray-200'}`}>
    <div className="flex flex-wrap items-center gap-2">
      {j.featured && <PremiumBadge kind="featured" />}
      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{JOB_TYPES[j.type] || j.type}</span>
      {j.remote && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Remote</span>}
    </div>
    <p className="font-semibold text-gray-900 mt-2">{j.title}</p>
    <p className="text-sm text-gray-600">
      {j.companyName}
      {j.location ? ` · ${j.location}` : ''}
      {j.salary ? ` · ${j.salary}` : ''}
    </p>
  </Link>
);

// ---------- Board ----------
export const JobsBoard = () => {
  const profile = useMyProfile();
  const [jobs, setJobs] = useState(null);
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [track, setTrack] = useState('all');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    listOpenJobs().then(setJobs).catch(() => setJobs([]));
  }, []);

  const premiumMember = profile && !profile.isCompany && isPremium(profile);
  useEffect(() => {
    if (!premiumMember || !jobs?.length) return;
    aiMatches(profile, jobs).then(setMatches).catch(() => {});
  }, [premiumMember, jobs, profile]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (jobs || []).filter(
      (j) =>
        (type === 'all' || j.type === type) &&
        (track === 'all' || (j.tracks || []).includes(track)) &&
        (!remoteOnly || j.remote) &&
        (!needle || `${j.title} ${j.companyName} ${j.location} ${j.description}`.toLowerCase().includes(needle))
    );
  }, [jobs, q, type, track, remoteOnly]);

  const input = 'rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600 text-sm mt-1">Roles from companies hiring women in tech.</p>
        </div>
        {profile?.isCompany && (
          <div className="flex gap-2">
            <Link to="/jobs/mine" className="text-sm font-semibold border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50">My job posts</Link>
            <Link to="/jobs/new" className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded-lg">Post a job</Link>
          </div>
        )}
      </div>

      {/* AI-powered matches: Premium members */}
      {profile && !profile.isCompany && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-semibold text-gray-900 flex items-center gap-2">
            <PremiumBadge /> Your top job matches
          </p>
          {premiumMember ? (
            matches === null ? (
              <p className="text-sm text-gray-600 mt-1">Finding your best matches...</p>
            ) : (
              <div className="grid gap-2 mt-3">
                {matches.map((id) => (jobs || []).find((j) => j.id === id)).filter(Boolean).map((j) => <JobCard key={j.id} j={j} />)}
              </div>
            )
          ) : (
            <p className="text-sm text-gray-700 mt-1">
              Premium members get AI-powered job and project matches based on their skills and badges.{' '}
              <Link to="/premium" className="font-semibold text-pink-700 hover:underline">See Premium</Link>
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs" aria-label="Search jobs" className={`${input} flex-1 min-w-[12rem]`} />
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Job type" className={input}>
          <option value="all">All types</option>
          {Object.entries(JOB_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={track} onChange={(e) => setTrack(e.target.value)} aria-label="Track" className={input}>
          <option value="all">All tracks</option>
          {Object.entries(JOB_TRACKS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} /> Remote only
        </label>
      </div>

      {jobs === null ? (
        <p className="text-gray-500 text-sm">Loading jobs...</p>
      ) : shown.length === 0 ? (
        <p className="text-gray-500 text-sm border border-dashed border-gray-300 rounded-xl p-8 text-center">No open jobs match right now. Check back soon.</p>
      ) : (
        <div className="grid gap-3">{shown.map((j) => <JobCard key={j.id} j={j} />)}</div>
      )}
    </div>
  );
};

// ---------- Detail ----------
export const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const profile = useMyProfile();
  const [job, setJob] = useState(undefined);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    getJob(id)
      .then(async (j) => {
        setJob(j);
        if (j) {
          const s = await getDoc(doc(db, 'users', j.companyUid)).catch(() => null);
          setCompany(s && s.exists() ? s.data() : null);
        }
      })
      .catch(() => setJob(null));
  }, [id]);

  if (job === undefined) return <p className="text-gray-500 text-sm">Loading...</p>;
  if (!job) return <p className="text-gray-600">This job is no longer available. <Link to="/jobs" className="text-pink-700 font-semibold">See all jobs</Link></p>;

  const mine = profile && (profile.uid === job.companyUid || ['admin'].includes(profile.role));
  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/jobs" className="text-sm font-semibold text-gray-600 hover:text-gray-900">&larr; All jobs</Link>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-3">
        <div className="flex flex-wrap items-center gap-2">
          {job.featured && <PremiumBadge kind="featured" />}
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{JOB_TYPES[job.type] || job.type}</span>
          {job.remote && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Remote</span>}
          {job.status !== 'open' && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">Closed</span>}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-3">{job.title}</h1>
        <p className="text-gray-700 mt-1 flex flex-wrap items-center gap-2">
          {job.companyName}
          {company && isVerifiedPartner(company) && <PremiumBadge kind="partner" />}
          {company && company.isVerified && !isVerifiedPartner(company) && (
            <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">VERIFIED</span>
          )}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {[job.location, job.salary, (job.tracks || []).map((t) => JOB_TRACKS[t]).join(', ')].filter(Boolean).join(' · ')}
        </p>
        <div className="mt-5 text-gray-800 whitespace-pre-wrap leading-relaxed">{job.description}</div>
        <div className="flex flex-wrap gap-2 mt-6">
          {job.applyUrl && (
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg">Apply</a>
          )}
          {job.applyEmail && (
            <a href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`} className="border border-gray-300 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-50">Apply by email</a>
          )}
          {profile && profile.uid !== job.companyUid && (
            <button onClick={() => navigate(`/messages?to=${job.companyUid}&text=${encodeURIComponent(`Hi, I'm interested in the ${job.title} role.`)}`)}
              className="border border-gray-300 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-50">Message the company</button>
          )}
          {mine && <Link to={`/jobs/${job.id}/edit`} className="border border-gray-300 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-50">Edit</Link>}
        </div>
      </div>
    </div>
  );
};

// ---------- My job posts ----------
export const MyJobs = () => {
  const profile = useMyProfile();
  const [jobs, setJobs] = useState(null);
  useEffect(() => {
    if (profile) listMyJobs(profile.uid).then(setJobs).catch(() => setJobs([]));
  }, [profile]);
  const premium = profile && (isPremium(profile) || profile.role === 'admin');
  const act = async (fn, msg) => {
    try {
      await fn();
      setJobs(await listMyJobs(profile.uid));
      toast.success(msg);
    } catch (e) {
      toast.error(friendlyError(e, 'Could not update it.'));
    }
  };
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900">My job posts</h1>
        <Link to="/jobs/new" className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded-lg">Post a job</Link>
      </div>
      {jobs === null ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 text-sm">No job posts yet.</p>
      ) : (
        <ul className="space-y-2">
          {jobs.map((j) => (
            <li key={j.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <Link to={`/jobs/${j.id}`} className="font-semibold text-gray-900 hover:underline">{j.title}</Link>
                <p className="text-xs text-gray-500">{j.status === 'open' ? `Open until ${new Date(j.expiresAt).toLocaleDateString()}` : 'Closed'}{j.featured ? ' · Featured' : ''}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/jobs/${j.id}/edit`} className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg">Edit</Link>
                {premium && (
                  <button onClick={() => act(() => setJobFeatured(j.id, !j.featured), j.featured ? 'No longer featured.' : 'Featured at the top of Jobs.')}
                    className="text-xs font-semibold border border-pink-200 text-pink-700 px-3 py-1.5 rounded-lg">{j.featured ? 'Unfeature' : '★ Feature'}</button>
                )}
                <button onClick={() => act(() => setJobStatus(j.id, j.status === 'open' ? 'closed' : 'open'), j.status === 'open' ? 'Closed.' : 'Reopened.')}
                  className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg">{j.status === 'open' ? 'Close' : 'Reopen'}</button>
                <button onClick={() => window.confirm('Delete this job post?') && act(() => deleteJob(j.id), 'Deleted.')}
                  className="text-xs font-semibold text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ---------- Post / edit ----------
const EMPTY = { title: '', type: 'full-time', location: '', remote: false, description: '', applyUrl: '', applyEmail: '', tracks: [], salary: '' };

export const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const profile = useMyProfile();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    getJob(id).then((j) => j && setForm({ ...EMPTY, ...j, applyUrl: j.applyUrl || '', applyEmail: j.applyEmail || '', salary: j.salary || '' })).catch(() => {});
  }, [id]);

  if (!profile) return <p className="text-gray-500 text-sm">Loading...</p>;
  if (!canPostJobs(profile)) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-gray-900">Posting jobs is a Premium feature</h1>
        <p className="text-gray-700 mt-2">
          {!profile.isCompany
            ? 'Only company accounts can post jobs.'
            : !profile.isVerified
            ? 'First, get your company verified (it\u2019s free). Then Premium lets you post jobs.'
            : 'Premium lets verified companies post jobs, feature them, and promote them to members.'}
        </p>
        <Link to="/premium" className="inline-block mt-4 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg">See Premium</Link>
      </div>
    );
  }

  const L = JOB_LIMITS;
  const submit = async (e) => {
    e.preventDefault();
    if (countWords(form.title) < L.titleMinWords) return toast.error(`The job title needs at least ${L.titleMinWords} words (you have ${countWords(form.title)}).`);
    if (countWords(form.description) < L.descMinWords) return toast.error(`The description needs at least ${L.descMinWords} words (you have ${countWords(form.description)}).`);
    if (!form.applyUrl.trim() && !form.applyEmail.trim()) return toast.error('Add an application link or an email address.');
    if (form.applyUrl.trim() && !/^https?:\/\//i.test(form.applyUrl.trim())) return toast.error('The application link must start with https://');
    setBusy(true);
    try {
      if (id) {
        await updateJob(id, form);
        toast.success('Job updated.');
        navigate(`/jobs/${id}`);
      } else {
        const ref = await createJob(profile, form);
        toast.success(`Job posted. It stays open for ${L.daysOpen} days.`);
        navigate(`/jobs/${ref.id}`);
      }
    } catch (err) {
      toast.error(friendlyError(err, 'Could not save the job.'));
    }
    setBusy(false);
  };

  const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';
  const label = 'block text-sm font-semibold text-gray-800 mb-1';
  const hintCls = 'font-normal text-gray-500';
  return (
    <form onSubmit={submit} className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit job' : 'Post a job'}</h1>
      <div>
        <label className={label} htmlFor="job-title">Job title <span className={hintCls}>(at least {L.titleMinWords} words, up to {L.titleMaxChars} characters)</span></label>
        <input id="job-title" className={input} value={form.title} maxLength={L.titleMaxChars} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <LimitHint text={form.title} minWords={L.titleMinWords} maxChars={L.titleMaxChars} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="job-type">Type</label>
          <select id="job-type" className={input} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {Object.entries(JOB_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="job-loc">Location <span className={hintCls}>(up to {L.locationMaxChars} characters)</span></label>
          <input id="job-loc" className={input} value={form.location} maxLength={L.locationMaxChars} placeholder="City, country" onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-gray-700 mt-2">
            <input type="checkbox" checked={form.remote} onChange={(e) => setForm({ ...form, remote: e.target.checked })} /> Remote-friendly
          </label>
        </div>
      </div>
      <fieldset>
        <legend className={label}>Tracks <span className={hintCls}>(optional, choose any)</span></legend>
        <div className="flex flex-wrap gap-2">
          {Object.entries(JOB_TRACKS).map(([k, v]) => {
            const on = form.tracks.includes(k);
            return (
              <button key={k} type="button" aria-pressed={on}
                onClick={() => setForm({ ...form, tracks: on ? form.tracks.filter((x) => x !== k) : [...form.tracks, k] })}
                className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${on ? 'bg-pink-600 border-pink-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}>{v}</button>
            );
          })}
        </div>
      </fieldset>
      <div>
        <label className={label} htmlFor="job-desc">Description <span className={hintCls}>(at least {L.descMinWords} words, up to {L.descMaxChars} characters)</span></label>
        <textarea id="job-desc" rows={10} className={input} value={form.description} maxLength={L.descMaxChars}
          placeholder="The role, responsibilities, requirements, and what you offer."
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <LimitHint text={form.description} minWords={L.descMinWords} maxChars={L.descMaxChars} />
      </div>
      <div>
        <label className={label} htmlFor="job-salary">Salary or pay range <span className={hintCls}>(optional, up to {L.salaryMaxChars} characters)</span></label>
        <input id="job-salary" className={input} value={form.salary} maxLength={L.salaryMaxChars} placeholder="e.g. $70,000 to $85,000 a year" onChange={(e) => setForm({ ...form, salary: e.target.value })} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="job-url">Application link <span className={hintCls}>(this or an email)</span></label>
          <input id="job-url" type="url" className={input} value={form.applyUrl} placeholder="https://" onChange={(e) => setForm({ ...form, applyUrl: e.target.value })} />
        </div>
        <div>
          <label className={label} htmlFor="job-email">Application email <span className={hintCls}>(this or a link)</span></label>
          <input id="job-email" type="email" className={input} value={form.applyEmail} onChange={(e) => setForm({ ...form, applyEmail: e.target.value })} />
        </div>
      </div>
      <p className="text-xs text-gray-500">Jobs stay open for {L.daysOpen} days; you can close or reopen them in My job posts.</p>
      <button type="submit" disabled={busy} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">
        {busy ? 'Saving...' : id ? 'Save changes' : 'Post job'}
      </button>
    </form>
  );
};
