// src/Pages/learning/ManageCourses.jsx
// Staff (admins and editors): edit a built-in course, restore removed courses,
// and add new ones (through the Mentor Hub, which staff can publish directly).
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { originalCourse, trackMeta } from '../../utils/foundationsCourses';
import { getOverride, getOverrideContent, hiddenCourses, resetCourse, saveCourseEdit, setCourseHidden } from '../../utils/courseOverrides';
import { useStaffRole } from '../../components/MentorCourseStaffTools';
import { useCourseOverridesVersion } from '../../components/BuiltInCourseStaffTools';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export const ManageCourses = () => {
  const role = useStaffRole();
  const { currentUser } = useAuth();
  useCourseOverridesVersion();
  if (role === null) return <p className="p-8 text-gray-500 text-sm">Loading...</p>;
  if (!['admin', 'editor'].includes(role)) return <p className="p-8 text-gray-600">This page is for She Model Tech staff.</p>;
  const hidden = hiddenCourses();
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Manage courses</h1>
      <p className="text-gray-600 mt-1">Edit any She Model Tech course from its card in Learning. Removed courses are listed here so you can bring them back.</p>
      <div className="mt-5 rounded-xl border border-pink-200 bg-pink-50/50 p-4 flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-sm text-gray-800"><strong>Add a new course:</strong> create it in the Mentor Hub, then publish it to Learning.</p>
        <Link to="/teacher" className="text-sm font-semibold bg-pink-600 text-white px-4 py-2 rounded-lg">Open the Mentor Hub</Link>
      </div>
      <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">Removed courses ({hidden.length})</h2>
      {hidden.length === 0 ? (
        <p className="text-sm text-gray-500">No courses have been removed.</p>
      ) : (
        <ul className="space-y-2">
          {hidden.map((o) => (
            <li key={`${o.track}-${o.slug}`} className="bg-white border border-gray-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm text-gray-800">{o.hiddenTitle || originalCourse(o.track, o.slug)?.title || o.slug} <span className="text-gray-500">· {trackMeta(o.track).label}</span></span>
              <button
                onClick={async () => {
                  await setCourseHidden(o.track, o.slug, false, currentUser);
                  toast.success('Restored to Learning.');
                }}
                className="text-xs font-semibold border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                Restore
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const EditCourse = () => {
  const { track, slug } = useParams();
  const navigate = useNavigate();
  const role = useStaffRole();
  const { currentUser } = useAuth();
  const original = originalCourse(track, slug);
  const [f, setF] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!original) return;
    const o = getOverride(track, slug) || {};
    getOverrideContent(track, slug)
      .catch(() => null)
      .then((text) => setF({
        title: o.title || original.title,
        summary: o.summary || original.summary || '',
        level: o.level || original.level || 'Beginner',
        minutes: o.minutes || original.minutes || 0,
        markdown: text != null ? text : original.markdown || '',
      }));
  }, [track, slug, original]);

  if (role === null) return <p className="p-8 text-gray-500 text-sm">Loading...</p>;
  if (!['admin', 'editor'].includes(role)) return <p className="p-8 text-gray-600">This page is for She Model Tech staff.</p>;
  if (!original) return <p className="p-8 text-gray-600">Course not found.</p>;
  if (!f) return <p className="p-8 text-gray-500 text-sm">Loading course...</p>;
  const isHtml = !!original.html || original.kind === 'interactive';

  const save = async () => {
    if (f.title.trim().split(/\s+/).length < 2) return toast.error('Give the course a title of at least 2 words.');
    setBusy(true);
    try {
      await saveCourseEdit(track, slug, { ...f, originalMarkdown: original.markdown || '' }, currentUser);
      toast.success('Saved. Learners see the changes now.');
      navigate(`/learning/${track}/${slug}`);
    } catch (e) {
      toast.error('Could not save. Check your connection and try again.');
    }
    setBusy(false);
  };
  const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to={`/learning/${track}/${slug}`} className="text-sm text-gray-500 hover:underline">← Back to the course</Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit course</h1>
      <p className="text-sm text-gray-600">{trackMeta(track).label}. Changes apply for every learner straight away; the original is kept so you can reset it.</p>
      <div className="mt-5 space-y-4 bg-white border border-gray-200 rounded-2xl p-5">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="ec-title">Title <span className="font-normal text-gray-500">(up to 120 characters)</span></label>
          <input id="ec-title" maxLength={120} className={input} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="ec-sum">Summary <span className="font-normal text-gray-500">(up to 400 characters)</span></label>
          <textarea id="ec-sum" rows={2} maxLength={400} className={input} value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="ec-level">Level</label>
            <select id="ec-level" className={input} value={f.level} onChange={(e) => setF({ ...f, level: e.target.value })}>
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="ec-min">Time to complete (minutes)</label>
            <input id="ec-min" type="number" min="1" className={input} value={f.minutes} onChange={(e) => setF({ ...f, minutes: e.target.value })} />
          </div>
        </div>
        {isHtml ? (
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">This is an interactive course, so only its details can be edited here.</p>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="ec-md">
              Course content <span className="font-normal text-gray-500">(Markdown: start each module with “## ”, and each lesson with “### ”)</span>
            </label>
            <textarea id="ec-md" rows={24} className={`${input} font-mono text-xs leading-relaxed`} value={f.markdown} onChange={(e) => setF({ ...f, markdown: e.target.value })} />
            <p className="text-xs text-gray-500 mt-1">{(f.markdown.match(/^##\s+/gm) || []).length} modules · {f.markdown.length.toLocaleString()} characters</p>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button onClick={save} disabled={busy} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50">{busy ? 'Saving…' : 'Save changes'}</button>
          <button
            onClick={async () => {
              if (!window.confirm('Undo every edit to this course and bring back the original?')) return;
              await resetCourse(track, slug);
              toast.success('Reset to the original.');
              navigate(`/learning/${track}/${slug}`);
            }}
            className="text-sm font-semibold border border-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-50"
          >
            Reset to original
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
