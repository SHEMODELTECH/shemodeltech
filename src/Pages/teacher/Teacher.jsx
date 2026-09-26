// src/Pages/teacher/Teacher.jsx
//
// The Teacher area (/teacher): teaching notes and instructor editions of
// courses, for admins and editors only. Nothing here appears in Learning.
//
//   /teacher            list, search, and filters
//   /teacher/new        upload an HTML course or write notes (?type=html|notes)
//   /teacher/:id        view a course
//   /teacher/:id/edit   edit details, replace the file, or edit the content
//
// Access is enforced twice: this page checks the member's role, and Firestore
// rules refuse every read and write from anyone who isn't an admin or editor.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { renderCourse } from '../../utils/renderCourseMarkdown';
import {
  MAX_BYTES,
  byteSize,
  deleteTeacherCourse,
  getTeacherContent,
  getTeacherCourse,
  listTeacherCourses,
  saveTeacherCourse,
  titleFromHtml,
} from '../../utils/teacherCourses';
import { FD_CSS, enhanceCourseContent } from '../learning/shared';

const TRACKS = [
  ['', 'General'],
  ['TechDev', 'Coding Developer'],
  ['TechArchs', 'Low/No-Code'],
  ['TechQA', 'Quality Tester'],
  ['TechGuard', 'Cybersecurity'],
  ['TechPO', 'Product Owner'],
  ['TechLeads', 'Non-Technical'],
];
const trackLabel = (t) => (TRACKS.find(([id]) => id === t) || TRACKS[0])[1];
const fmtSize = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const fmtDate = (ts) => (ts?.toDate ? ts.toDate().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '');

// ---------- Role gate ----------
const useStaffRole = () => {
  const { currentUser } = useAuth();
  const [role, setRole] = useState(null);
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid))
      .then((s) => setRole(s.data()?.role || 'member'))
      .catch(() => setRole('member'));
  }, [currentUser]);
  return role;
};

const Gate = ({ children }) => {
  const role = useStaffRole();
  if (role === null) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
      </div>
    );
  }
  if (role !== 'admin' && role !== 'editor') {
    return (
      <div className="max-w-lg mx-auto text-center py-24 px-4">
        <h1 className="text-xl font-bold text-gray-900">This page is for She Model Tech staff</h1>
        <p className="text-gray-600 mt-2">Teaching materials are available to admins and editors only.</p>
        <Link to="/learning" className="inline-block mt-5 text-pink-700 font-semibold hover:underline">
          Go to Learning
        </Link>
      </div>
    );
  }
  return children(role);
};

const StatusTag = ({ status }) => (
  <span
    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
      status === 'ready' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
    }`}
  >
    {status === 'ready' ? 'Ready to teach' : 'Draft'}
  </span>
);

// ================= List =================
const TeacherList = ({ role }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState(null);
  const [q, setQ] = useState('');
  const [track, setTrack] = useState('all');

  useEffect(() => {
    listTeacherCourses()
      .then(setItems)
      .catch((e) => {
        console.error(e);
        toast.error('Could not load teaching materials.');
        setItems([]);
      });
  }, []);

  const shown = (items || []).filter(
    (c) =>
      (track === 'all' || (c.track || '') === track) &&
      (!q.trim() || `${c.title} ${c.description}`.toLowerCase().includes(q.trim().toLowerCase()))
  );

  const remove = async (c) => {
    if (!window.confirm(`Delete "${c.title}"? This can't be undone.`)) return;
    try {
      await deleteTeacherCourse(c);
      setItems((xs) => xs.filter((x) => x.id !== c.id));
      toast.success('Deleted.');
    } catch (e) {
      console.error(e);
      toast.error('Could not delete it.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Teacher</h1>
          <p className="text-gray-600 mt-1 max-w-2xl">
            Teaching notes and instructor editions of courses. Only admins and editors can see this page, and
            nothing here appears in Learning.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => navigate('/teacher/new?type=html')}
            className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
          >
            Upload HTML course
          </button>
          <button
            onClick={() => navigate('/teacher/new?type=notes')}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-semibold px-4 py-2.5 rounded-lg"
          >
            Write notes
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search teaching materials"
          aria-label="Search teaching materials"
          className="flex-1 h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <select
          value={track}
          onChange={(e) => setTrack(e.target.value)}
          aria-label="Track"
          className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="all">All tracks</option>
          {TRACKS.map(([id, label]) => (
            <option key={id || 'general'} value={id}>{label}</option>
          ))}
        </select>
      </div>

      {items === null ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
        </div>
      ) : shown.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-300 rounded-2xl">
          <p className="font-semibold text-gray-900">
            {items.length ? 'Nothing matches that search' : 'No teaching materials yet'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {items.length ? 'Try another word or track.' : 'Upload an instructor edition as an HTML file, or write notes here.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  {c.kind === 'html' ? 'Interactive HTML' : 'Written notes'}
                </span>
                <StatusTag status={c.status} />
              </div>
              <Link to={`/teacher/${c.id}`} className="font-semibold text-gray-900 hover:underline leading-snug">
                {c.title || 'Untitled'}
              </Link>
              {c.description && <p className="text-sm text-gray-600 mt-1 line-clamp-3">{c.description}</p>}
              <p className="text-xs text-gray-500 mt-3">
                {trackLabel(c.track)}
                {c.sizeBytes ? ` · ${fmtSize(c.sizeBytes)}` : ''}
                {c.updatedAt ? ` · Updated ${fmtDate(c.updatedAt)}` : ''}
                {c.updatedBy?.name ? ` by ${c.updatedBy.name}` : ''}
              </p>
              <div className="mt-auto pt-4 flex gap-2">
                <button onClick={() => navigate(`/teacher/${c.id}`)} className="text-sm font-semibold bg-gray-900 text-white px-3 py-1.5 rounded-lg">
                  Open
                </button>
                <button onClick={() => navigate(`/teacher/${c.id}/edit`)} className="text-sm font-semibold border border-gray-300 text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                  Edit
                </button>
                {role === 'admin' && (
                  <button onClick={() => remove(c)} className="ml-auto text-sm font-semibold text-red-700 px-2 py-1.5 rounded-lg hover:bg-red-50">
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ================= Editor (create + edit) =================
const TeacherEditor = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const fileRef = useRef(null);
  const [loaded, setLoaded] = useState(!id);
  const [existing, setExisting] = useState(null);
  const [meta, setMeta] = useState({
    title: '',
    description: '',
    kind: params.get('type') === 'notes' ? 'markdown' : 'html',
    track: '',
    status: 'draft',
    fileName: '',
  });
  const [content, setContent] = useState('');
  const [contentChanged, setContentChanged] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const c = await getTeacherCourse(id);
      if (!c) {
        toast.error('That course no longer exists.');
        navigate('/teacher');
        return;
      }
      setExisting(c);
      setMeta({
        title: c.title || '',
        description: c.description || '',
        kind: c.kind,
        track: c.track || '',
        status: c.status || 'draft',
        fileName: c.fileName || '',
      });
      setContent(await getTeacherContent(id, c.chunkCount));
      setLoaded(true);
    })().catch((e) => {
      console.error(e);
      toast.error('Could not load this course.');
    });
  }, [id, navigate]);

  const pickFile = (file) => {
    if (!file) return;
    if (!/\.html?$/i.test(file.name)) {
      toast.error('Choose an .html file.');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('That file is larger than 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      setContent(text);
      setContentChanged(true);
      setMeta((m) => ({ ...m, fileName: file.name, title: m.title || titleFromHtml(text, file.name) }));
    };
    reader.readAsText(file);
  };

  const save = async () => {
    if (!meta.title.trim()) return toast.error('Add a title.');
    if (!content.trim()) return toast.error(meta.kind === 'html' ? 'Choose an HTML file to upload.' : 'Write some notes first.');
    setSaving(true);
    try {
      const newId = await saveTeacherCourse(
        {
          id,
          meta,
          content: !id || contentChanged ? content : undefined,
          previousChunkCount: existing?.chunkCount || 0,
        },
        currentUser
      );
      toast.success(id ? 'Saved.' : 'Added to Teacher.');
      navigate(`/teacher/${newId}`);
    } catch (e) {
      console.error(e);
      toast.error(e.message?.includes('5 MB') ? e.message : 'Could not save. Check your connection and try again.');
    }
    setSaving(false);
  };

  const rendered = useMemo(() => (meta.kind === 'markdown' && preview ? renderCourse(content).html : ''), [meta.kind, preview, content]);

  if (!loaded) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
      </div>
    );
  }

  const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';
  const label = 'block text-sm font-semibold text-gray-800 mb-1';

  return (
    <div className="max-w-4xl mx-auto">
      <Link to={id ? `/teacher/${id}` : '/teacher'} className="text-sm font-semibold text-gray-600 hover:text-gray-900">
        {id ? 'Back to the course' : 'Back to Teacher'}
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-3 mb-6">
        {id ? 'Edit teaching material' : meta.kind === 'html' ? 'Upload an HTML course' : 'Write teaching notes'}
      </h1>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-5">
        <div>
          <label className={label} htmlFor="t-title">Title</label>
          <input id="t-title" className={input} value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} />
        </div>
        <div>
          <label className={label} htmlFor="t-desc">Description</label>
          <textarea id="t-desc" rows={2} className={input} value={meta.description}
            placeholder="What this is and how to use it when teaching"
            onChange={(e) => setMeta({ ...meta, description: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label} htmlFor="t-track">Track</label>
            <select id="t-track" className={input} value={meta.track} onChange={(e) => setMeta({ ...meta, track: e.target.value })}>
              {TRACKS.map(([tid, l]) => (
                <option key={tid || 'general'} value={tid}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="t-status">Status</label>
            <select id="t-status" className={input} value={meta.status} onChange={(e) => setMeta({ ...meta, status: e.target.value })}>
              <option value="draft">Draft</option>
              <option value="ready">Ready to teach</option>
            </select>
          </div>
        </div>

        {meta.kind === 'html' ? (
          <div>
            <p className={label}>HTML file</p>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                pickFile(e.dataTransfer.files[0]);
              }}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center"
            >
              <p className="text-sm text-gray-700">
                {meta.fileName ? (
                  <>
                    <strong>{meta.fileName}</strong> ({fmtSize(byteSize(content))})
                    {contentChanged && id ? ' will replace the current version when you save.' : ''}
                  </>
                ) : (
                  'Drag a self-contained .html course here, or choose a file.'
                )}
              </p>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="mt-3 text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
                {meta.fileName ? 'Choose a different file' : 'Choose file'}
              </button>
              <input ref={fileRef} type="file" accept=".html,.htm,text/html" className="hidden"
                onChange={(e) => pickFile(e.target.files[0])} />
              <p className="text-xs text-gray-500 mt-3">Up to 5 MB. It opens in a secure frame, so its scripts can't reach the rest of the site.</p>
            </div>
            {content && (
              <div className="mt-3">
                <button type="button" onClick={() => setShowSource((v) => !v)} className="text-sm font-semibold text-pink-700 hover:underline">
                  {showSource ? 'Hide the HTML source' : 'Edit the HTML source'}
                </button>
                {showSource && (
                  <textarea
                    aria-label="HTML source"
                    className="mt-2 w-full h-96 rounded-lg border border-gray-300 p-3 font-mono text-xs"
                    value={content}
                    spellCheck={false}
                    onChange={(e) => {
                      setContent(e.target.value);
                      setContentChanged(true);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={label} htmlFor="t-notes">Notes (Markdown)</label>
              <button type="button" onClick={() => setPreview((v) => !v)} className="text-sm font-semibold text-pink-700 hover:underline">
                {preview ? 'Back to writing' : 'Preview'}
              </button>
            </div>
            {preview ? (
              <div className="fd-root border border-gray-200 rounded-lg p-4 max-h-[32rem] overflow-y-auto">
                <style>{FD_CSS}</style>
                <div className="course-prose" dangerouslySetInnerHTML={{ __html: rendered }} />
              </div>
            ) : (
              <textarea
                id="t-notes"
                className="w-full h-96 rounded-lg border border-gray-300 p-3 font-mono text-sm"
                placeholder={'# Session 1: Introduction\n\n## Learning goals\n- ...\n\n## Talking points\n...'}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setContentChanged(true);
                }}
              />
            )}
            <p className="text-xs text-gray-500 mt-1">
              Headings with ## become sections. Supports lists, tables, code, ```mermaid diagrams, and ```lab activities.
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button onClick={save} disabled={saving}
            className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">
            {saving ? 'Saving...' : id ? 'Save changes' : 'Save'}
          </button>
          <button onClick={() => navigate(id ? `/teacher/${id}` : '/teacher')}
            className="text-sm font-semibold text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= Viewer =================
const TeacherViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [content, setContent] = useState(null);

  useEffect(() => {
    (async () => {
      const c = await getTeacherCourse(id);
      if (!c) {
        toast.error('That course no longer exists.');
        navigate('/teacher');
        return;
      }
      setCourse(c);
      setContent(await getTeacherContent(id, c.chunkCount));
    })().catch((e) => {
      console.error(e);
      toast.error('Could not open this course.');
    });
  }, [id, navigate]);

  const html = useMemo(() => (course?.kind === 'markdown' && content != null ? renderCourse(content).html : ''), [course, content]);
  const proseRef = useRef(null);

  // Written notes get the same interactive extras as Learning courses:
  // quizzes, checklists, labs, copy buttons, and diagrams.
  useEffect(() => {
    const el = proseRef.current;
    if (!el || !html) return undefined;
    enhanceCourseContent(el, `smt-teacher:${id}`);
    const nodes = Array.from(el.querySelectorAll('.course-mermaid[data-mermaid]'));
    let cancelled = false;
    if (nodes.length) {
      import('mermaid').then(({ default: mermaid }) => {
        if (cancelled) return;
        mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'strict', fontFamily: 'inherit' });
        nodes.forEach((node, i) => {
          const src = node.textContent || '';
          node.removeAttribute('data-mermaid');
          mermaid.render(`tmmd-${i}-${Date.now()}`, src).then(({ svg }) => { if (!cancelled) node.innerHTML = svg; }).catch(() => {});
        });
      }).catch(() => {});
    }
    return () => { cancelled = true; };
  }, [html, id]);

  const download = () => {
    const blob = new Blob([content || ''], { type: course.kind === 'html' ? 'text/html' : 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = course.fileName || `${(course.title || 'teaching-notes').replace(/[^\w-]+/g, '-')}.${course.kind === 'html' ? 'html' : 'md'}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  if (!course || content == null) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
      </div>
    );
  }

  return (
    <div className={course.kind === 'html' ? '' : 'max-w-4xl mx-auto'}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="min-w-0">
          <Link to="/teacher" className="text-sm font-semibold text-gray-600 hover:text-gray-900">Teacher</Link>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{course.title}</h1>
            <StatusTag status={course.status} />
          </div>
          {course.description && <p className="text-sm text-gray-600 mt-1 max-w-3xl">{course.description}</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={download} className="text-sm font-semibold border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50">Download</button>
          <button onClick={() => navigate(`/teacher/${id}/edit`)} className="text-sm font-semibold bg-gray-900 text-white px-3 py-2 rounded-lg">Edit</button>
        </div>
      </div>

      {course.kind === 'html' ? (
        // Sandboxed: scripts run, but the course can't reach the app, its login,
        // or its data. (Its own progress saving is off inside the frame.)
        <iframe
          title={course.title}
          srcDoc={content}
          sandbox="allow-scripts allow-popups"
          className="w-full rounded-xl border border-gray-200 bg-white"
          style={{ height: 'calc(100vh - 13rem)', minHeight: 520 }}
        />
      ) : (
        <div className="fd-root bg-white border border-gray-200 rounded-2xl p-5 sm:p-8">
          <style>{FD_CSS}</style>
          <div ref={proseRef} className="course-prose" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )}
    </div>
  );
};

export const TeacherHome = () => <Gate>{(role) => <TeacherList role={role} />}</Gate>;
export const TeacherEdit = () => <Gate>{() => <TeacherEditor />}</Gate>;
export const TeacherView = () => <Gate>{() => <TeacherViewer />}</Gate>;
export default TeacherHome;
