// src/Pages/admin/GenerateProject.jsx - Admin: auto-generate software/AI projects
// Generated projects start in the `lead_recruitment` state: only "Apply to lead"
// is open. Once a lead is confirmed they refine the content and open the rest of
// the roles for the team.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import { getRandomTemplate } from '../../utils/projectTemplates';

const GenerateProject = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    if (!currentUser) { navigate('/login', { replace: true }); return; }
    getDoc(doc(db, 'users', currentUser.uid))
      .then(snap => {
        const role = snap.exists() ? snap.data().role : null;
        if (role !== 'admin') {
          toast.error('Admins only');
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
      // Free, instant: use the built-in template library
      const result = getRandomTemplate();
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
        industryTrack: draft.industryTrack,
        timeline: 'flexible',
        // Roles the generator proposed - become editable by the confirmed lead
        proposedRoles: draft.proposedRoles,
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
        submitterName: 'She Model Tech (Auto-generated)',
        isCompanyPost: false,
        viewCount: 0,
        applicationCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Generate Project</h1>
      <p className="text-gray-500 text-sm mb-6">Auto-generate a software or AI project (no physical prototypes). It publishes in lead recruitment - anyone can apply to lead, and the confirmed lead refines it and opens the team.</p>

      <button onClick={handleGenerate} disabled={generating}
        className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-all disabled:opacity-50">
        {generating ? 'Generating…' : draft ? 'Regenerate' : 'Generate a Project'}
      </button>

      {draft && (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Title</p>
            <p className="text-gray-900 font-bold text-lg">{draft.projectTitle}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Industry</p>
            <p className="text-gray-900 text-sm capitalize">{draft.industryTrack}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Description</p>
            <p className="text-gray-700 text-sm leading-relaxed">{draft.projectDescription}</p>
          </div>
          {draft.projectGoals && (
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Goals</p>
              <p className="text-gray-700 text-sm leading-relaxed">{draft.projectGoals}</p>
            </div>
          )}
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-2">Proposed Roles (the lead can change these)</p>
            <div className="space-y-2">
              {draft.proposedRoles.map((r, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <div>
                    <p className="text-gray-900 text-sm font-medium">{r.role} <span className="text-gray-400 capitalize">· {r.experienceLevel}</span></p>
                    <p className="text-gray-400 text-xs">Skills: {r.skills}</p>
                  </div>
                  <span className="text-gray-400 text-xs font-bold">{r.count} {r.count === 1 ? 'person' : 'people'}</span>
                </div>
              ))}
            </div>
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
