// src/Pages/projects/ProjectFeedback.jsx
// After a project is completed: three quick questions.
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { myFeedback, saveFeedback } from '../../utils/feedback';

const ProjectFeedback = () => {
  const { projectId } = useParams();
  const { currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ rating: 0, recommend: '', comment: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'projects', projectId)).then((s) => setProject(s.exists() ? { id: s.id, ...s.data() } : null)).catch(() => {});
    if (currentUser) myFeedback(projectId, currentUser.uid).then((x) => setDone(!!x)).catch(() => {});
  }, [projectId, currentUser]);

  const submit = async () => {
    if (!f.rating) return toast.error('Choose a rating from 1 to 5.');
    if (!f.recommend) return toast.error('Tell us if you’d recommend She Model Tech.');
    setBusy(true);
    try {
      await saveFeedback(projectId, currentUser, {
        rating: f.rating, recommend: f.recommend, comment: f.comment.trim().slice(0, 1000),
        projectTitle: project?.projectTitle || '', name: currentUser.displayName || '',
        role: project?.submitterId === currentUser.uid ? 'lead' : 'member',
      });
      setDone(true);
      toast.success('Thank you for your feedback!');
    } catch (e) {
      toast.error('Could not send your feedback.');
    }
    setBusy(false);
  };

  return (
    <div className="max-w-6xl mx-auto [&>*]:max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">How was your project?</h1>
      <p className="text-gray-500 text-sm mt-1">{project?.projectTitle || 'Your project'} · It takes less than a minute, and helps us improve She Model Tech.</p>
      {done ? (
        <div className="mt-6 bg-pink-50 border border-pink-200 rounded-xl p-5">
          <p className="font-semibold text-pink-900">Thank you! Your feedback is in.</p>
          <p className="text-sm text-pink-900 mt-1">See your badge and certificate in the <Link to="/project-vault" className="underline">Project Vault</Link>, or find your <Link to="/projects" className="underline">next project</Link>.</p>
        </div>
      ) : (
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-5 space-y-5">
          <fieldset>
            <legend className="text-sm font-semibold text-gray-900">1. How was your experience on this project?</legend>
            <div className="flex gap-2 mt-2" role="radiogroup">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={f.rating === n} aria-label={`${n} out of 5`} onClick={() => setF({ ...f, rating: n })}
                  className={`w-11 h-11 rounded-full text-xl ${n <= f.rating ? 'text-pink-600' : 'text-gray-300'} hover:scale-110 transition-transform`}>★</button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-semibold text-gray-900">2. Would you recommend She Model Tech to a friend?</legend>
            <div className="flex flex-wrap gap-2 mt-2">
              {[['yes', 'Yes'], ['maybe', 'Maybe'], ['no', 'No']].map(([v, l]) => (
                <button key={v} type="button" aria-pressed={f.recommend === v} onClick={() => setF({ ...f, recommend: v })}
                  className={`px-5 py-2 rounded-full text-sm font-semibold border ${f.recommend === v ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-gray-700 border-gray-300'}`}>{l}</button>
              ))}
            </div>
          </fieldset>
          <label className="block text-sm font-semibold text-gray-900">3. Anything you’d like to tell us? <span className="font-normal text-gray-500">(optional)</span>
            <textarea rows={4} maxLength={1000} value={f.comment} onChange={(e) => setF({ ...f, comment: e.target.value })}
              className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-normal" placeholder="What worked well? What could be better?" />
          </label>
          <button type="button" onClick={submit} disabled={busy} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg disabled:opacity-50">{busy ? 'Sending…' : 'Send feedback'}</button>
        </div>
      )}
    </div>
  );
};

export default ProjectFeedback;
