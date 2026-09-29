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
import NoteDialog, { friendlyError } from '../../components/NoteDialog';
import { authFetch } from '../../utils/authFetch';
import { checkDates, minEndDate, minStartDate } from '../../utils/dateRules';
import { useFeatures } from '../../utils/features';
import { hasPerk } from '../../config/tiers';
import {
  JOB_LIMITS,
  JOB_TYPES,
  createJob,
  deleteJob,
  requestJobDeletion,
  approveJobDeletion,
  restoreJob,
  listJobDeletionRequests,
  jobWindow,
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

// Posting: staff always; companies need verification plus a tier (tiers on),
// or the "Job posting (before tiers)" switch (tiers off).
const canPostJobs = (p, features) => !!p && (['admin', 'editor'].includes(p.role)
  || (p.isCompany && p.isVerified && (features?.companyTiers ? hasPerk(p, 'postJobs', true) : !!features?.jobPosting)));

// ---------- AI-powered matches (Premium members) ----------
const scoreJob = (job, profile) => {
  const skills = (profile?.skills || []).map((s) => String(s).toLowerCase());
  const text = `${job.title} ${job.description}`.toLowerCase();
  let score = skills.filter((s) => s && text.includes(s)).length * 2;
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
              JSON.stringify(pool.map((j) => ({ id: j.id, title: j.title, type: j.type, about: j.description.slice(0, 300) }))),
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
    {(() => {
      const w = jobWindow(j);
      if (w.state === 'upcoming') return <p className="text-xs text-sky-700 mt-1">Applications open {w.opens}</p>;
      return w.closes ? <p className="text-xs text-gray-500 mt-1">Apply by {w.closes}</p> : null;
    })()}
  </Link>
);

// ---------- Board ----------
export const JobsBoard = () => {
  const profile = useMyProfile();
  const features = useFeatures();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(null);
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    listOpenJobs().then(setJobs).catch(() => setJobs([]));
  }, []);

  // Staff: deletion requests from companies (their posts are unpublished meanwhile).
  const isStaff = ['admin', 'editor'].includes(profile?.role);
  const [deletionReqs, setDeletionReqs] = useState([]);
  useEffect(() => {
    if (isStaff) listJobDeletionRequests().then(setDeletionReqs).catch(() => {});
  }, [isStaff]);
  const decide = async (j, remove) => {
    try {
      await (remove ? approveJobDeletion(j) : restoreJob(j));
      setDeletionReqs((xs) => xs.filter((x) => x.id !== j.id));
      if (!remove) listOpenJobs().then(setJobs).catch(() => {});
      toast.success(remove ? 'Deleted. The company has been told.' : 'Kept and republished. The company has been told.');
    } catch (e) {
      toast.error(friendlyError(e, 'Could not update it.'));
    }
  };

  // AI-powered job matches: free for every member.
  const premiumMember = profile && !profile.isCompany;
  useEffect(() => {
    if (!premiumMember || !jobs?.length) return;
    aiMatches(profile, jobs).then(setMatches).catch(() => {});
  }, [premiumMember, jobs, profile]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (jobs || []).filter(
      (j) =>
        (type === 'all' || j.type === type) &&
        (!remoteOnly || j.remote) &&
        (!needle || `${j.title} ${j.companyName} ${j.location} ${j.description}`.toLowerCase().includes(needle))
    );
  }, [jobs, q, type, remoteOnly]);

  const input = 'rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';
  return (
    <div className="max-w-4xl mx-auto">
      {isStaff && deletionReqs.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-semibold text-gray-900 mb-2">Deletion requests ({deletionReqs.length})</p>
          <p className="text-xs text-gray-600 mb-3">These posts are unpublished while you decide.</p>
          <ul className="space-y-2">
            {deletionReqs.map((j) => (
              <li key={j.id} className="bg-white border border-gray-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <Link to={`/jobs/${j.id}`} className="font-semibold text-gray-900 hover:underline">{j.title}</Link>
                  <p className="text-xs text-gray-500">{j.companyName}{j.removalRequest?.reason ? ` · “${j.removalRequest.reason}”` : ''}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => decide(j, true)} className="text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg">Delete</button>
                  <button onClick={() => decide(j, false)} className="text-xs font-semibold border border-gray-300 bg-white px-3 py-1.5 rounded-lg">Keep and republish</button>
                  <button onClick={() => navigate(`/messages?to=${j.companyUid}&text=${encodeURIComponent(`Hi, about your request to delete "${j.title}": `)}`)} className="text-xs font-semibold border border-gray-300 bg-white px-3 py-1.5 rounded-lg">Message them</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600 text-sm mt-1">Full-time, part-time, contract, and internship roles from companies hiring on She Model Tech.</p>
        </div>
        {(profile?.isCompany || isStaff) && (
          <div className="flex gap-2">
            <Link to="/jobs/mine" className="text-sm font-semibold border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50">My job posts</Link>
            <Link to="/jobs/new" className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded-lg">Post a job</Link>
          </div>
        )}
      </div>

      {/* AI-powered job matches: free for every member */}
      {premiumMember && jobs && jobs.length > 0 && (
        <div className="mb-5 rounded-xl border border-pink-200 bg-pink-50/40 p-4">
          <p className="font-semibold text-gray-900">Your top job matches</p>
          <p className="text-xs text-gray-600">Picked by AI from your skills and badges.</p>
          {matches === null ? (
            <p className="text-sm text-gray-600 mt-2">Finding your best matches...</p>
          ) : (
            <div className="grid gap-2 mt-3">
              {matches.map((id) => jobs.find((j) => j.id === id)).filter(Boolean).map((j) => <JobCard key={j.id} j={j} />)}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs" aria-label="Search jobs" className={`${input} flex-1 min-w-[12rem]`} />
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Job type" className={input}>
          <option value="all">All types</option>
          {Object.entries(JOB_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} /> Remote only
        </label>
      </div>

      {jobs === null ? (
        <p className="text-gray-500 text-sm">Loading jobs...</p>
      ) : shown.length === 0 ? (
        <p className="text-gray-500 text-sm border border-dashed border-gray-300 rounded-xl p-8 text-center">
          {(features.jobPosting || features.companyTiers) ? 'No open jobs match right now. Check back soon.' : 'Job listings from hiring companies are coming soon. For now, build your proof on She Model Tech projects.'}
        </p>
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

  const isStaff = ['admin', 'editor'].includes(profile?.role);
  const mine = profile && (profile.uid === job.companyUid || isStaff);
  const win = jobWindow(job);
  const underReview = job.status === 'removal_requested';
  const canApply = job.status === 'open' && win.state === 'open';
  const fmt = (d) => (d ? new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '');
  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/jobs" className="text-sm font-semibold text-gray-600 hover:text-gray-900">&larr; All jobs</Link>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-3">
        <div className="flex flex-wrap items-center gap-2">
          {job.featured && <PremiumBadge kind="featured" />}
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{JOB_TYPES[job.type] || job.type}</span>
          {job.remote && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Remote</span>}
          {underReview ? (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Under review · not accepting applications</span>
          ) : (job.status !== 'open' || win.state === 'closed') ? (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">Closed</span>
          ) : win.state === 'upcoming' ? (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">Opens {fmt(win.opens)}</span>
          ) : null}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-3">{job.title}</h1>
        <p className="text-gray-700 mt-1 flex flex-wrap items-center gap-2">
          {job.companyName}
          {company && isVerifiedPartner(company) && <PremiumBadge kind="partner" />}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {[job.location, job.salary].filter(Boolean).join(' · ')}
        </p>
        {(win.opens || win.closes) && (
          <p className="text-sm text-gray-700 mt-3 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
            <strong>Applications:</strong> {win.opens ? `open ${fmt(win.opens)}` : 'open now'}{win.closes ? `, deadline ${fmt(win.closes)}` : ''}
          </p>
        )}
        <div className="mt-5 text-gray-800 whitespace-pre-wrap leading-relaxed">{job.description}</div>
        <div className="flex flex-wrap gap-2 mt-6">
          {profile?.isMinor && <p className="text-sm text-gray-600">Jobs are for members aged 18 and over.</p>}
          {!canApply && !profile?.isMinor && (
            <p className="text-sm text-gray-600">{underReview ? 'This post is under review, so applications are paused.' : win.state === 'upcoming' ? `Applications open ${fmt(win.opens)}.` : 'Applications for this job are closed.'}</p>
          )}
          {canApply && job.applyUrl && !profile?.isMinor && (
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg">Apply</a>
          )}
          {canApply && job.applyEmail && !profile?.isMinor && (
            <a href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`} className="border border-gray-300 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-50">Apply by email</a>
          )}
          {profile && profile.uid !== job.companyUid && !profile.isMinor && (
            <button onClick={() => navigate(`/messages?to=${job.companyUid}&text=${encodeURIComponent(`Hi, I'm interested in the ${job.title} role.`)}`)}
              className="border border-gray-300 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-50">Message the company</button>
          )}
          {mine && <Link to={`/jobs/${job.id}/edit`} className="border border-gray-300 text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-gray-50">Edit</Link>}
          {isStaff && (
            <button
              onClick={async () => {
                if (!window.confirm(`Delete "${job.title}"? This can’t be undone.`)) return;
                try {
                  await (underReview ? approveJobDeletion(job) : deleteJob(job.id));
                  toast.success('Job post deleted.');
                  navigate('/jobs');
                } catch (e) {
                  toast.error(friendlyError(e, 'Could not delete it.'));
                }
              }}
              className="text-sm font-semibold text-red-700 px-4 py-2.5 rounded-lg hover:bg-red-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------- My job posts ----------
export const MyJobs = () => {
  const features = useFeatures();
  const [deleteFor, setDeleteFor] = useState(null);
  const profile = useMyProfile();
  const [jobs, setJobs] = useState(null);
  useEffect(() => {
    if (profile) listMyJobs(profile.uid).then(setJobs).catch(() => setJobs([]));
  }, [profile]);
  // Featured jobs: Partner and above (or staff).
  const premium = profile && hasPerk(profile, 'featuredJobs', !!features.companyTiers);
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
        <NoteDialog
          open={!!deleteFor}
          title="Request deletion"
          description={deleteFor ? `"${deleteFor.title}" is unpublished straight away, so nobody can apply, while She Model Tech reviews your request. Tell us why.` : ''}
          placeholder="For example: the role has been filled, or it was posted by mistake."
          required
          confirmLabel="Send request"
          onCancel={() => setDeleteFor(null)}
          onConfirm={async (reason) => {
            const j = deleteFor;
            setDeleteFor(null);
            await act(() => requestJobDeletion(j, { uid: profile.uid }, reason), 'Request sent. The post is unpublished while we review it.');
          }}
        />
        {<Link to="/jobs/new" className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded-lg">Post a job</Link>}
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
                <p className="text-xs text-gray-500">
                  {j.status === 'removal_requested'
                    ? 'Deletion requested · unpublished while we review it'
                    : j.status !== 'open' || jobWindow(j).state === 'closed'
                    ? 'Closed'
                    : jobWindow(j).state === 'upcoming'
                    ? `Opens ${jobWindow(j).opens}${jobWindow(j).closes ? `, deadline ${jobWindow(j).closes}` : ''}`
                    : `Open${jobWindow(j).closes ? `, deadline ${jobWindow(j).closes}` : ''}`}
                  {j.featured ? ' · Featured' : ''}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/jobs/${j.id}/edit`} className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg">Edit</Link>
                {premium && (
                  <button onClick={() => act(() => setJobFeatured(j.id, !j.featured), j.featured ? 'No longer featured.' : 'Featured at the top of Jobs.')}
                    className="text-xs font-semibold border border-pink-200 text-pink-700 px-3 py-1.5 rounded-lg">{j.featured ? 'Unfeature' : '★ Feature'}</button>
                )}
                {j.status !== 'removal_requested' && (
                  <>
                    <button onClick={() => act(() => setJobStatus(j.id, j.status === 'open' ? 'closed' : 'open'), j.status === 'open' ? 'Closed.' : 'Reopened.')}
                      className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg">{j.status === 'open' ? 'Close' : 'Reopen'}</button>
                    <button onClick={() => setDeleteFor(j)}
                      className="text-xs font-semibold text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50">Request deletion</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ---------- Post / edit ----------
const plusDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const EMPTY = { title: '', type: 'full-time', location: '', remote: false, description: '', applyUrl: '', applyEmail: '', salary: '', opensOn: '', closesOn: '' };

export const JobForm = () => {
  const features = useFeatures();
  const [originalOpens, setOriginalOpens] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const profile = useMyProfile();
  const [form, setForm] = useState({ ...EMPTY, opensOn: new Date().toISOString().slice(0, 10), closesOn: plusDays(30) });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    getJob(id).then((j) => { if (!j) return; setOriginalOpens(j.opensOn || null); setForm({ ...EMPTY, ...j, applyUrl: j.applyUrl || '', applyEmail: j.applyEmail || '', salary: j.salary || '', opensOn: j.opensOn || '', closesOn: j.closesOn || (j.expiresAt ? j.expiresAt.slice(0, 10) : '') }); }).catch(() => {});
  }, [id]);

  if (!profile) return <p className="text-gray-500 text-sm">Loading...</p>;
  // Companies always see the form; until they can post, it's shown but locked.
  const locked = !canPostJobs(profile, features) && !(id && profile.isCompany);
  const lockedMessage = !profile.isCompany
    ? 'Only company accounts can post jobs.'
    : !features.companyTiers
    ? 'Job posting opens soon, as part of our company tiers.'
    : !profile.isVerified
    ? 'First, get your company verified (it’s free). Then any tier lets you post jobs.'
    : 'Job posting is included in every tier: Supporter, Partner, and Champion.';

  const L = JOB_LIMITS;
  const submit = async (e) => {
    e.preventDefault();
    if (countWords(form.title) < L.titleMinWords) return toast.error(`The job title needs at least ${L.titleMinWords} words (you have ${countWords(form.title)}).`);
    if (countWords(form.description) < L.descMinWords) return toast.error(`The description needs at least ${L.descMinWords} words (you have ${countWords(form.description)}).`);
    if (!form.applyUrl.trim() && !form.applyEmail.trim()) return toast.error('Add an application link or an email address.');
    const dateErr = checkDates({ start: form.opensOn, end: form.closesOn, originalStart: originalOpens });
    if (dateErr) return toast.error(dateErr.replace('start date', 'application start date').replace('end date', 'application deadline'));
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
    <form onSubmit={(e) => (locked ? e.preventDefault() : submit(e))} className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit job' : 'Post a job'}</h1>
      {locked && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex flex-wrap items-center justify-between gap-3">
          <p className="m-0 text-sm text-gray-800"><strong>Coming soon.</strong> {lockedMessage}</p>
          {profile.isCompany && <Link to="/premium" className="text-sm font-semibold bg-pink-600 text-white px-4 py-2 rounded-lg">See the tiers</Link>}
        </div>
      )}
      <fieldset disabled={locked} className={locked ? 'opacity-50 pointer-events-none select-none space-y-4' : 'space-y-4'} aria-disabled={locked}>
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
      <div>
        <label className={label} htmlFor="job-desc">Description <span className={hintCls}>(at least {L.descMinWords} words, up to {L.descMaxChars} characters)</span></label>
        <textarea id="job-desc" rows={10} className={input} value={form.description} maxLength={L.descMaxChars}
          placeholder="The role, responsibilities, requirements, and what you offer."
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <LimitHint text={form.description} minWords={L.descMinWords} maxChars={L.descMaxChars} />
      </div>
      <div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={label} htmlFor="job-opens">Applications open</label>
            <input id="job-opens" type="date" className={input} value={form.opensOn} min={minStartDate(originalOpens)} onChange={(e) => setForm({ ...form, opensOn: e.target.value })} />
          </div>
          <div>
            <label className={label} htmlFor="job-closes">Application deadline</label>
            <input id="job-closes" type="date" className={input} value={form.closesOn} min={minEndDate(form.opensOn)} onChange={(e) => setForm({ ...form, closesOn: e.target.value })} />
          </div>
        </div>
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
      </fieldset>
    </form>
  );
};
