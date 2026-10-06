// src/Pages/projects/PublicProjects.jsx
// The project board for visitors who aren't signed in: the same projects
// members see, read-only. Opening a project asks them to sign in (or create a
// free account) and then takes them straight to it, like enrolling in a course.
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProjectPayBadge from '../../components/ProjectPayBadge';
import { getPayRangeLabel } from '../../utils/paidProjects';
import { signInAndReturn } from '../learning/LearningLayout';
import { getIndustryLabel, formatTimeline } from './ProjectsListing';
import { ShareDialogButton, shareUrl } from '../../components/ShareButtons';

const statusLabel = (p) =>
  p.status === 'lead_recruitment' ? 'Needs a Lead' : p.status === 'setup' ? 'Being set up' : p.applicationsOpen === false ? 'Closed' : 'Open to Join';

const PublicProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(null);
  const [q, setQ] = useState('');
  const [pay, setPay] = useState('all');
  const [params] = useSearchParams();
  const focus = params.get('p'); // a shared project link

  useEffect(() => {
    fetch('/api/public-request')
      .then((r) => (r.ok ? r.json() : { projects: [] }))
      .then((d) => setProjects(d.projects || []))
      .catch(() => setProjects([]));
  }, []);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (projects || []).filter(
      (p) =>
        (!s || p.projectTitle.toLowerCase().includes(s) || p.projectDescription.toLowerCase().includes(s)) &&
        (pay === 'all' || (pay === 'paid' ? p.isPaid : !p.isPaid))
    );
  }, [projects, q, pay]);

  const open = (p) => signInAndReturn(navigate, `/projects/${p.id}`);

  // A shared link: bring that project into view and highlight it.
  useEffect(() => {
    if (focus && projects) setTimeout(() => document.getElementById(`p-${focus}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
  }, [focus, projects]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
        <p className="text-sm font-semibold text-pink-700">Projects</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">Build real products with a team</h1>
        <p className="text-gray-600 text-lg mt-3 max-w-2xl">
          Join a project in your track, work with a lead and a team, and earn a verified badge when the work is reviewed.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects"
            aria-label="Search projects"
            className="flex-1 h-11 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <select
            value={pay}
            onChange={(e) => setPay(e.target.value)}
            aria-label="Free or paid"
            className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">Free and paid</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {projects === null ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600" />
          </div>
        ) : shown.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 font-semibold">No projects to show right now.</p>
            <p className="text-gray-500 text-sm mt-1">New projects open regularly. Sign in to hear when they do.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {shown.map((p) => (
              <div
                key={p.id}
                id={`p-${p.id}`}
                role="button"
                tabIndex={0}
                onClick={() => open(p)}
                onKeyDown={(ev) => { if (ev.key === 'Enter') open(p); }}
                className={`cursor-pointer text-left bg-white rounded-xl p-4 sm:p-5 border hover:border-pink-400 hover:shadow-sm transition-all ${focus === p.id ? 'border-pink-500 ring-2 ring-pink-200' : 'border-pink-200'}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="text-gray-900 font-bold text-sm sm:text-base line-clamp-2">{p.projectTitle}</h2>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <ProjectPayBadge isPaid={p.isPaid} size="xs" />
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.applicationsOpen === false && p.status === 'active' ? 'bg-gray-200 text-gray-700' : 'bg-pink-100 text-gray-900'}`}>
                      {statusLabel(p)}
                    </span>
                  </div>
                </div>
                {p.isPaid && getPayRangeLabel(p.teamRoles) && (
                  <p className="text-gray-900 text-xs font-black mb-2">{getPayRangeLabel(p.teamRoles)} · paid on completion</p>
                )}
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{p.projectDescription}</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {p.industryTrack && <span className="px-2 py-0.5 bg-gray-100 rounded-md text-gray-900 text-[10px] font-medium">{getIndustryLabel(p.industryTrack)}</span>}
                  {p.timeline && <span className="px-2 py-0.5 bg-gray-100 rounded-md text-gray-900 text-[10px] font-medium">{formatTimeline(p.timeline)}</span>}
                  {p.teamRoles.length > 0 && <span className="px-2 py-0.5 bg-gray-100 rounded-md text-gray-900 text-[10px] font-medium">{p.teamRoles.length} role{p.teamRoles.length === 1 ? '' : 's'}</span>}
                  <span className="ml-auto flex items-center gap-2">
                    <ShareDialogButton
                      url={shareUrl('p', p.id)}
                      text={`Join a team building "${p.projectTitle}" on She Model Tech.`}
                      title={p.projectTitle}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 bg-white text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-50"
                    />
                    <span className="px-3 py-1.5 bg-pink-600 text-white rounded-lg text-sm font-semibold">Sign in to join</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PublicProjects;
