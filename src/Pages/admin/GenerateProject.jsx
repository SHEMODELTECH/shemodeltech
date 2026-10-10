// src/Pages/admin/GenerateProject.jsx - Admin: publish a project from the library
// Projects come from She Model Tech's built-in library of current AI and tech
// projects (no AI cost). Each has a problem statement, a 6-week plan, and roles
// across the badge tracks. Titles already on the board are skipped.
// Generated projects start in `lead_recruitment`: only "Apply to lead" is open.
// The confirmed lead can add roles but can't remove or reduce the brief's roles.

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, getDocs, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import { pickTemplate, THEMES, TEMPLATE_COUNT, levelGuide, isStretch } from '../../utils/projectTemplates';
import { trackByKey, roleTrack } from '../../config/badgeTracks';
import { notifyLeadWaitlist } from '../../utils/projectProposals';

const GenerateProject = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(null);
  const [theme, setTheme] = useState('');
  // Titles already on the board, read once per page open (not on every click).
  const usedTitles = useRef(null);

  useEffect(() => {
    if (!currentUser) { navigate('/login', { replace: true }); return; }
    getDoc(doc(db, 'users', currentUser.uid))
      .then(snap => {
        const role = snap.exists() ? snap.data().role : null;
        if (role !== 'admin') {
          navigate('/projects', { replace: true });
          return;
        }
        setIsAdmin(true);
      })
      .catch(() => navigate('/projects', { replace: true }))
      .finally(() => setChecking(false));
  }, [currentUser, navigate]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Free, instant: the built-in library. Skip titles already on the board
      // (and the one on screen, so Regenerate shows something new).
      if (!usedTitles.current) {
        const snap = await getDocs(collection(db, 'projects')).catch(() => null);
        if (snap) usedTitles.current = snap.docs.map((d) => d.data().projectTitle || d.data().title);
      }
      const used = [...(usedTitles.current || [])];
      if (draft) used.push(draft.projectTitle);
      const result = pickTemplate({ exclude: used, theme: theme || null });
      setDraft(result);
      toast.success('Project loaded - review and publish.');
    } catch (e) {
      console.error(e);
      toast.error('Could not load a project. Try again.');
    }
    setGenerating(false);
  };

  const handlePublish = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const newRef = await addDoc(collection(db, 'projects'), {
        projectTitle: draft.projectTitle,
        projectDescription: draft.projectDescription,
        projectGoals: draft.projectGoals || null,
        problemStatement: draft.problemStatement || null,
        weeklyPlan: draft.weeklyPlan || [],
        theme: draft.theme || null,
        industryTrack: draft.industryTrack,
        timeline: 'flexible',
        // The brief's roles: the confirmed lead can add roles and edit details,
        // but can't remove these or reduce how many people they need.
        proposedRoles: draft.proposedRoles,
        briefRoles: draft.briefRoles || draft.proposedRoles,
        // No team roles are open yet; only the lead opening is available
        teamRoles: [],
        maxTeamSize: 0,
        // Lifecycle
        status: 'lead_recruitment',
        isActive: true,
        isGenerated: true,
        leadConfirmed: false,
        // No human owner yet - the confirmed lead becomes the owner
        submitterId: null,
        submitterEmail: null,
        submitterName: 'She Model Tech',
        isCompanyPost: false,
        viewCount: 0,
        applicationCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      // Anyone on the lead waitlist hears about the new project.
      notifyLeadWaitlist(draft.projectTitle);
      // Proof Wall: log a "needs a lead" event.
      try {
        const { logActivity: logProof } = await import('../../utils/activityFeed');
        await logProof({
          type: 'lead',
          actorName: 'She Model Tech',
          projectId: newRef.id,
          projectTitle: draft.projectTitle,
          meta: 'Open to anyone, apply to lead',
        });
      } catch (e) { console.log('Proof log skipped:', e.message); }
      toast.success('Project published in lead recruitment.');
      if (usedTitles.current) usedTitles.current.push(draft.projectTitle);
      setDraft(null);
      navigate('/projects');
    } catch (e) {
      console.error(e);
      toast.error('Could not publish project.');
    }
    setSaving(false);
  };

  if (checking) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div></div>;
  }
  if (!isAdmin) return null;

  return (
    <div className="max-w-6xl mx-auto [&>*]:max-w-3xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Generate Project</h1>
      <p className="text-gray-500 text-sm mb-6">Pick a project from the library of {TEMPLATE_COUNT} current AI and tech projects. Each has a problem statement, a 6-week plan, and roles across the badge tracks. Projects already on the board are skipped. It publishes in lead recruitment: anyone can apply to lead, and the confirmed lead adds any extra roles and opens the team.</p>

      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm font-semibold text-gray-700">
          Theme
          <select value={theme} onChange={(e) => setTheme(e.target.value)} className="block mt-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-normal bg-white">
            <option value="">Any theme</option>
            {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <button onClick={handleGenerate} disabled={generating}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-all disabled:opacity-50">
          {generating ? 'Generating…' : draft ? 'Regenerate' : 'Generate a Project'}
        </button>
      </div>

      {draft && (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Title</p>
            <p className="text-gray-900 font-bold text-lg">{draft.projectTitle}</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Theme</p>
              <p className="text-gray-900 text-sm">{draft.theme}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Industry</p>
              <p className="text-gray-900 text-sm capitalize">{draft.industryTrack}</p>
            </div>
          </div>
          {draft.problemStatement && (
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">The problem</p>
              <p className="text-gray-700 text-sm leading-relaxed">{draft.problemStatement}</p>
            </div>
          )}
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">What the team builds</p>
            <p className="text-gray-700 text-sm leading-relaxed">{draft.projectDescription}</p>
          </div>
          {draft.projectGoals && (
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Expected outcome</p>
              <p className="text-gray-700 text-sm leading-relaxed">{draft.projectGoals}</p>
            </div>
          )}
          {draft.weeklyPlan?.length > 0 && (
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">{draft.weeklyPlan.length}-week plan</p>
              <ol className="space-y-1">
                {draft.weeklyPlan.map((w, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-700"><span className="font-semibold text-gray-900 w-16 flex-shrink-0">Week {i + 1}</span><span>{w}</span></li>
                ))}
              </ol>
            </div>
          )}
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-2">Roles (the lead can add roles, but can't remove or reduce these)</p>
            <div className="space-y-2">
              {draft.proposedRoles.map((r, i) => (
                <div key={i} className="flex items-start justify-between gap-3 bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <div className="min-w-0">
                    <p className="text-gray-900 text-sm font-medium">{r.role} <span className="text-pink-700 text-xs font-semibold">· {trackByKey(roleTrack(r))?.name}</span></p>
                    <p className="text-gray-400 text-xs">Skills: {r.skills}</p>
                    {r.deliverable && <p className="text-gray-600 text-xs">Delivers: {r.deliverable}</p>}
                    <p className={`text-xs mt-0.5 font-semibold ${isStretch(r.experienceLevel) ? 'text-gray-900' : 'text-pink-700'}`}>{levelGuide(r.experienceLevel)}</p>
                  </div>
                  <span className="text-gray-400 text-xs font-bold flex-shrink-0">{r.count} {r.count === 1 ? 'person' : 'people'}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-2">TechPO: the lead (teams of 7 or more also get a Product Co-owner seat).</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handlePublish} disabled={saving}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-all disabled:opacity-50">
              {saving ? 'Publishing…' : 'Publish in Lead Recruitment'}
            </button>
            <button onClick={() => setDraft(null)} disabled={saving}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm px-5 py-2.5 rounded-lg transition-all">
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateProject;
