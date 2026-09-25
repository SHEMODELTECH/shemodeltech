// src/Pages/Foundations.jsx
//
// Foundations: free, hands-on courses for every She Model Tech track.
//
// The idea the page is built around: learning here is the first leg of a path
// that ends in a badge. Each track is drawn as a trail of its courses, in the
// order they're meant to be taken, and the trail ends at that track's medal
// (the same artwork members earn). Courses teach the skill; a team project is
// how you prove it and earn the badge, which then unlocks paid projects.
//
// Each track borrows its accent colour from its medal ribbon, so TechDev reads
// red, TechQA green, and so on, and the page changes character as you switch.
//
// Courses are markdown files under src/Pages/courses/<Track>/, bundled at build
// time by scripts/generateCourses.js. To add a course, drop in a .md file.
//
// Progress is stored on the user doc: foundationsCourses.<track>.<slug> = true,
// and foundationsComplete.<track> = true once a whole track is finished.
//
// URL state (?track=TechDev&course=slug) so the back button and shared links work.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { coursesForTrack, trackMeta, tracksWithCourses } from '../utils/foundationsCourses';
import { renderCourse } from '../utils/renderCourseMarkdown';
import TechDevImg from '../Images/TechDev.png';
import TechArchsImg from '../Images/TechArchs.png';
import TechQAImg from '../Images/TechQA.png';
import TechGuardImg from '../Images/TechGuard.png';
import TechPOImg from '../Images/TechMO.png';
import TechLeadsImg from '../Images/TechLeads.png';

// Track look: medal art, ribbon colour, and a short name for the rail.
const TRACK_LOOK = {
  TechDev: { img: TechDevImg, accent: '#DC2626', tint: '#FEF2F2', short: 'Coding Developer' },
  TechArchs: { img: TechArchsImg, accent: '#4F46E5', tint: '#EEF2FF', short: 'Low/No-Code' },
  TechQA: { img: TechQAImg, accent: '#15803D', tint: '#F0FDF4', short: 'Quality Tester' },
  TechGuard: { img: TechGuardImg, accent: '#1F2937', tint: '#F3F4F6', short: 'Cybersecurity' },
  TechPO: { img: TechPOImg, accent: '#7E22CE', tint: '#FAF5FF', short: 'Product Owner' },
  TechLeads: { img: TechLeadsImg, accent: '#A16207', tint: '#FEFCE8', short: 'Non-Technical' },
  company: { img: null, accent: '#DB2777', tint: '#FDF2F8', short: 'For companies' },
};
const TRACK_ORDER = ['TechDev', 'TechArchs', 'TechQA', 'TechGuard', 'TechPO', 'TechLeads'];
const look = (t) => TRACK_LOOK[t] || TRACK_LOOK.company;

// "AI Data Engineer: Hands-On Project Tutorials" -> "AI Data Engineer"
const cleanTitle = (title = '') =>
  title.replace(/:?\s*Hands-?On Project Tutorials\s*$/i, '').trim() || title;

// "About 45 min", "About 3.5 hours"
const formatTime = (min) => {
  if (!min) return '';
  if (min < 60) return `About ${min} min`;
  const h = Math.round((min / 60) * 2) / 2;
  return `About ${h} hour${h === 1 ? '' : 's'}`;
};

const CheckIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const Foundations = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState([]);
  const [progress, setProgress] = useState({}); // { track: { slug: true } }
  const [isCompany, setIsCompany] = useState(false);
  const railRef = useRef(null);

  // ---- Load the member's progress and decide which tracks to show ----
  useEffect(() => {
    let alive = true;
    (async () => {
      let data = {};
      try {
        if (currentUser) {
          const snap = await getDoc(doc(db, 'users', currentUser.uid));
          data = snap.exists() ? snap.data() : {};
        }
      } catch (e) {
        console.error('Foundations: profile load failed', e);
      }
      if (!alive) return;

      const available = tracksWithCourses();
      let list;
      if (data.isCompany) {
        list = available.includes('company') ? ['company'] : [];
      } else {
        // The member's own track first, then the rest in the usual order.
        // Every track is open to everyone: exploring another role is encouraged.
        list = TRACK_ORDER.filter((t) => available.includes(t));
        const own = data.primarySkillTrack;
        if (own && list.includes(own)) list = [own, ...list.filter((t) => t !== own)];
        if (data.role === 'admin' || data.role === 'editor') {
          if (available.includes('company')) list = [...list, 'company'];
        }
      }
      setIsCompany(!!data.isCompany);
      setTracks(list);
      setProgress(data.foundationsCourses || {});
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [currentUser]);

  const track = tracks.includes(params.get('track')) ? params.get('track') : tracks[0] || null;
  const courses = useMemo(() => coursesForTrack(track), [track]);
  const activeSlug = params.get('course');
  const activeIndex = courses.findIndex((c) => c.slug === activeSlug);
  const activeCourse = activeIndex >= 0 ? courses[activeIndex] : null;
  const done = (progress[track] || {});
  const doneCount = courses.filter((c) => done[c.slug]).length;
  const nextUp = courses.find((c) => !done[c.slug]) || null;

  // Keep the selected track's medal visible in the rail on small screens.
  useEffect(() => {
    const el = railRef.current?.querySelector('[aria-current="true"]');
    if (el) el.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [track, activeSlug]);

  const go = (next) => {
    const p = {};
    if (next.track) p.track = next.track;
    if (next.course) p.course = next.course;
    setParams(p);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const markComplete = async (slug) => {
    if (!currentUser || !track) return;
    const trackDone = { ...done, [slug]: true };
    const all = courses.every((c) => trackDone[c.slug]);
    setProgress((p) => ({ ...p, [track]: trackDone }));
    try {
      await setDoc(
        doc(db, 'users', currentUser.uid),
        {
          foundationsCourses: { [track]: { [slug]: true } },
          ...(all ? { foundationsComplete: { [track]: true } } : {}),
        },
        { merge: true }
      );
      if (all && track !== 'company') {
        toast.success(`You finished every ${trackMeta(track).label} course.`);
      } else {
        toast.success('Course marked complete.');
      }
    } catch (e) {
      console.error(e);
      setProgress((p) => ({ ...p, [track]: done }));
      toast.error('Could not save your progress. Check your connection and try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
      </div>
    );
  }

  if (!track) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Foundations</h1>
        <p className="text-gray-500">Courses are being added. Check back soon.</p>
      </div>
    );
  }

  const L = look(track);
  const meta = trackMeta(track);

  return (
    <div className="fd-root" style={{ '--acc': L.accent, '--tint': L.tint }}>
      <style>{FD_CSS}</style>
      {activeCourse ? (
        <CourseReader
          key={activeCourse.slug}
          course={activeCourse}
          index={activeIndex}
          total={courses.length}
          trackLabel={meta.label}
          isDone={!!done[activeCourse.slug]}
          next={courses[activeIndex + 1] || null}
          onBack={() => go({ track })}
          onOpen={(slug) => go({ track, course: slug })}
          onComplete={() => markComplete(activeCourse.slug)}
        />
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {/* Heading */}
          <header className="mb-7 max-w-2xl">
            <h1 className="fd-display text-3xl sm:text-4xl text-gray-900 mb-2">Foundations</h1>
            <p className="text-gray-600 text-base leading-relaxed">
              {isCompany
                ? 'A short guide to reading member profiles, so you can hire from proof.'
                : 'Free, hands-on courses for every track. Learn the skills here, then prove them on a team project to earn your badge.'}
            </p>
          </header>

          {/* Track rail: the medals you can earn */}
          {tracks.length > 1 && (
            <nav ref={railRef} aria-label="Tracks" className="fd-rail -mx-4 px-4 sm:mx-0 sm:px-0 mb-8">
              {tracks.map((t) => {
                const tl = look(t);
                const total = coursesForTrack(t).length;
                const n = coursesForTrack(t).filter((c) => (progress[t] || {})[c.slug]).length;
                const active = t === track;
                return (
                  <button
                    key={t}
                    onClick={() => go({ track: t })}
                    aria-current={active ? 'true' : undefined}
                    className={`fd-chip ${active ? 'is-active' : ''}`}
                    style={{ '--c': tl.accent, '--t': tl.tint }}
                  >
                    {tl.img ? (
                      <img src={tl.img} alt="" className="w-8 h-9 object-contain flex-shrink-0" />
                    ) : (
                      <span className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: tl.accent }} />
                    )}
                    <span className="text-left min-w-0">
                      <span className="block text-sm font-semibold text-gray-900 whitespace-nowrap">{tl.short}</span>
                      <span className="block text-xs text-gray-500 whitespace-nowrap">
                        {n > 0 ? `${n} of ${total} done` : `${total} course${total === 1 ? '' : 's'}`}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
          )}

          <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start">
            {/* The path */}
            <section aria-labelledby="track-title">
              <div className="mb-6">
                <h2 id="track-title" className="text-xl sm:text-2xl font-bold text-gray-900">
                  {meta.label}
                </h2>
                <p className="text-gray-600 text-sm mt-1 max-w-xl">{meta.intro}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[180px] max-w-xs">
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${courses.length ? (doneCount / courses.length) * 100 : 0}%`, background: L.accent }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">
                      {doneCount} of {courses.length} complete
                    </p>
                  </div>
                  {nextUp && (
                    <button onClick={() => go({ track, course: nextUp.slug })} className="fd-btn">
                      {doneCount === 0 ? 'Start the first course' : 'Continue where you left off'}
                    </button>
                  )}
                </div>
              </div>

              <ol className="fd-path">
                {courses.map((c, i) => {
                  const isDone = !!done[c.slug];
                  const isNext = nextUp && nextUp.slug === c.slug;
                  return (
                    <li key={c.slug} className={`fd-step ${isDone ? 'is-done' : ''} ${isNext ? 'is-next' : ''}`}>
                      <span className="fd-node" aria-hidden="true">
                        {isDone ? <CheckIcon /> : i + 1}
                      </span>
                      <button onClick={() => go({ track, course: c.slug })} className="fd-card">
                        <span className="flex items-start justify-between gap-3">
                          <span className="font-semibold text-gray-900 text-[15px] leading-snug">{cleanTitle(c.title)}</span>
                          {isDone ? (
                            <span className="fd-tag fd-tag-done">Done</span>
                          ) : isNext ? (
                            <span className="fd-tag fd-tag-next">Up next</span>
                          ) : null}
                        </span>
                        {c.summary && (
                          <span className="text-sm text-gray-600 mt-1 line-clamp-2">{c.summary}</span>
                        )}
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                          {c.level && <span className="fd-level">{c.level}</span>}
                          {c.projects > 1 && <span>{c.projects} parts</span>}
                          {c.minutes > 0 && <span>{formatTime(c.minutes)}</span>}
                        </span>
                      </button>
                    </li>
                  );
                })}

                {/* The trail ends at the medal: courses teach, a project proves. */}
                {track !== 'company' && (
                  <li className="fd-step fd-goal">
                    <span className="fd-node fd-node-goal" aria-hidden="true">
                      {L.img && <img src={L.img} alt="" className="w-9 h-10 object-contain" />}
                    </span>
                    <div className="fd-goal-card">
                      <p className="font-semibold text-gray-900 text-[15px]">Earn your {track} badge</p>
                      <p className="text-sm text-gray-600 mt-1 max-w-md">
                        Courses build the skill. Badges come from doing the work: join a team project,
                        deliver your part, and have it reviewed.
                      </p>
                      <button onClick={() => navigate('/projects')} className="fd-link mt-3">
                        Find a project to join
                      </button>
                    </div>
                  </li>
                )}
              </ol>
            </section>

            {/* How it fits together */}
            {track !== 'company' && (
              <aside className="space-y-4">
                <div className="fd-panel">
                  <p className="text-sm font-bold text-gray-900 mb-4">How Foundations fits in</p>
                  <ol className="space-y-4">
                    {[
                      ['Learn', 'Work through the courses at your own pace. They are free and always open.'],
                      ['Build with a team', 'Join a She Model Tech project in your track and deliver a real piece of work.'],
                      ['Earn the badge', 'Your work is reviewed and the badge goes on your profile.'],
                      ['Get paid work', 'One badge unlocks paid projects from verified companies.'],
                    ].map(([t, d], i) => (
                      <li key={t} className="flex gap-3">
                        <span className="fd-mini" aria-hidden="true">{i + 1}</span>
                        <span>
                          <span className="block text-sm font-semibold text-gray-900">{t}</span>
                          <span className="block text-xs text-gray-600 leading-relaxed mt-0.5">{d}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
                <p className="text-xs text-gray-500 px-1 leading-relaxed">
                  Every track is open to you, not just your own. Exploring another role is a good way
                  to find where you fit.
                </p>
              </aside>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================ Course reader ============================
const CourseReader = ({ course, index, total, trackLabel, isDone, next, onBack, onOpen, onComplete }) => {
  const rendered = useMemo(() => renderCourse(course.markdown), [course]);
  const proseRef = useRef(null);
  const [readPct, setReadPct] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [floatOpen, setFloatOpen] = useState(false);

  // Reading progress bar along the top of the page.
  useEffect(() => {
    const onScroll = () => {
      const el = proseRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const span = el.offsetHeight - window.innerHeight * 0.6;
      const pct = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 1;
      setReadPct(pct);
      // Highlight the section being read in the contents list.
      let current = null;
      rendered.toc.forEach((h) => {
        const node = document.getElementById(h.id);
        if (node && node.getBoundingClientRect().top < 140) current = h.id;
      });
      setActiveId(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [rendered]);

  // Turn ```mermaid blocks into diagrams. Loaded only when a course has one.
  useEffect(() => {
    const container = proseRef.current;
    if (!container) return undefined;
    const nodes = Array.from(container.querySelectorAll('.course-mermaid[data-mermaid]'));
    if (!nodes.length) return undefined;
    let cancelled = false;
    import('mermaid')
      .then(({ default: mermaid }) => {
        if (cancelled) return;
        mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'strict', fontFamily: 'inherit' });
        nodes.forEach((node, i) => {
          const src = node.textContent || '';
          node.removeAttribute('data-mermaid');
          const id = `mmd-${course.slug}-${i}-${Math.random().toString(36).slice(2, 8)}`;
          mermaid
            .render(id, src)
            .then(({ svg }) => {
              if (!cancelled) node.innerHTML = svg;
            })
            .catch(() => {
              if (!cancelled) node.textContent = src;
            });
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [rendered.html, course.slug]);

  useEffect(() => {
    if (!floatOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setFloatOpen(false);
    const onDown = (e) => {
      if (!e.target.closest('.fd-float')) setFloatOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [floatOpen]);

  const jump = (id) => {
    setTocOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const Contents = ({ onPick }) => (
    <ol className="space-y-0.5">
      {rendered.toc.map((h) => (
        <li key={h.id}>
          <button
            onClick={() => {
              if (onPick) onPick();
              jump(h.id);
            }}
            className={`fd-toc ${activeId === h.id ? 'is-active' : ''}`}
            aria-current={activeId === h.id ? 'location' : undefined}
          >
            {h.text}
          </button>
        </li>
      ))}
    </ol>
  );

  return (
    <div>
      <div className="fd-readbar" style={{ transform: `scaleX(${readPct})` }} aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <button onClick={onBack} className="fd-back">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {trackLabel}
          </button>
          <span className="text-xs text-gray-500">
            Course {index + 1} of {total}
            {course.minutes > 0 && <span className="ml-3">{formatTime(course.minutes)}</span>}
            {isDone && <span className="fd-tag fd-tag-done ml-2 align-middle">Done</span>}
          </span>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Contents. Kept in normal flow (plus a floating button below):
              the app's page wrappers stop position:sticky from working. */}
          {rendered.toc.length > 1 && (
            <div className="border border-gray-200 rounded-xl bg-white mb-8">
              <button
                onClick={() => setTocOpen((o) => !o)}
                aria-expanded={tocOpen}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-900"
              >
                In this course: {rendered.toc.length} parts
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${tocOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {tocOpen && (
                <div className="border-t border-gray-100 px-2 py-2 max-h-80 overflow-y-auto">
                  <Contents />
                </div>
              )}
            </div>
          )}

          <article>
            <div ref={proseRef} className="course-prose" dangerouslySetInnerHTML={{ __html: rendered.html }} />

            {/* Finish line */}
            <div className="fd-finish">
              {!isDone ? (
                <>
                  <div>
                    <p className="font-semibold text-gray-900">Finished this course?</p>
                    <p className="text-sm text-gray-600 mt-0.5">Mark it complete to track your progress in {trackLabel}.</p>
                  </div>
                  <button onClick={onComplete} className="fd-btn">
                    <CheckIcon className="w-4 h-4" />
                    Mark as complete
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="fd-node fd-node-static" aria-hidden="true">
                    <CheckIcon />
                  </span>
                  <p className="font-semibold text-gray-900">You completed this course.</p>
                </div>
              )}
            </div>

            {next ? (
              <button onClick={() => onOpen(next.slug)} className="fd-next">
                <span className="text-xs text-gray-500">Next course</span>
                <span className="block font-semibold text-gray-900 mt-0.5">{cleanTitle(next.title)}</span>
              </button>
            ) : (
              <button onClick={onBack} className="fd-next">
                <span className="text-xs text-gray-500">That was the last course in this track</span>
                <span className="block font-semibold text-gray-900 mt-0.5">Back to {trackLabel}</span>
              </button>
            )}
          </article>
        </div>
      </div>

      {/* Floating contents: always reachable while reading a long course. */}
      {rendered.toc.length > 1 && readPct > 0.02 && (
        <div className="fd-float">
          {floatOpen && (
            <div className="fd-pop" role="dialog" aria-label="Course contents">
              <Contents onPick={() => setFloatOpen(false)} />
            </div>
          )}
          <button onClick={() => setFloatOpen((o) => !o)} aria-expanded={floatOpen} className="fd-fab">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
            </svg>
            <span className="truncate max-w-[14rem]">
              {rendered.toc.find((h) => h.id === activeId)?.text || 'Contents'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

// Page styles. Accent colours come from the active track's medal ribbon via
// the --acc / --tint custom properties set on .fd-root.
const FD_CSS = `
.fd-root { --acc:#DB2777; --tint:#FDF2F8; }
.fd-display { font-family:'Archivo Black', system-ui, sans-serif; letter-spacing:-.01em; line-height:1.1; }

.fd-rail { display:flex; gap:.6rem; overflow-x:auto; scrollbar-width:none; padding-bottom:.25rem; }
.fd-rail::-webkit-scrollbar { display:none; }
.fd-chip { display:flex; align-items:center; gap:.65rem; padding:.55rem .9rem .55rem .6rem; border-radius:.9rem;
  background:#fff; border:1.5px solid #E5E7EB; flex-shrink:0; transition:border-color .15s, background .15s; }
.fd-chip:hover { border-color:#D1D5DB; }
.fd-chip.is-active { border-color:var(--c); background:var(--t); }
.fd-chip:focus-visible, .fd-card:focus-visible, .fd-btn:focus-visible, .fd-next:focus-visible,
.fd-back:focus-visible, .fd-link:focus-visible, .fd-toc:focus-visible { outline:2px solid var(--acc); outline-offset:2px; }

.fd-btn { display:inline-flex; align-items:center; gap:.45rem; background:var(--acc); color:#fff; font-weight:600;
  font-size:.875rem; padding:.6rem 1.1rem; border-radius:.7rem; transition:filter .15s; }
.fd-btn:hover { filter:brightness(1.08); }
.fd-link { color:var(--acc); font-weight:600; font-size:.875rem; }
.fd-link:hover { text-decoration:underline; }
.fd-back { display:inline-flex; align-items:center; gap:.35rem; font-size:.875rem; font-weight:600; color:#4B5563; }
.fd-back:hover { color:var(--acc); }

/* The path: a line down the left, one node per course. */
.fd-path { position:relative; list-style:none; margin:0; padding:0; }
.fd-step { position:relative; display:flex; gap:1rem; padding-bottom:.85rem; }
.fd-step::before { content:''; position:absolute; left:17px; top:36px; bottom:-2px; width:2px; background:#E5E7EB; }
.fd-step.is-done::before { background:var(--acc); opacity:.45; }
.fd-step:last-child::before { display:none; }
.fd-node { width:36px; height:36px; flex-shrink:0; border-radius:999px; display:flex; align-items:center; justify-content:center;
  font-size:.8rem; font-weight:700; color:#6B7280; background:#fff; border:2px solid #E5E7EB; position:relative; z-index:1; }
.fd-step.is-done .fd-node, .fd-node-static { background:var(--acc); border-color:var(--acc); color:#fff; }
.fd-step.is-next .fd-node { border-color:var(--acc); color:var(--acc); box-shadow:0 0 0 4px var(--tint); }
.fd-node-goal { width:36px; height:44px; border:0; background:transparent; }
.fd-card { flex:1; min-width:0; text-align:left; background:#fff; border:1px solid #E5E7EB; border-radius:.9rem;
  padding:.85rem 1rem; transition:border-color .15s; }
.fd-card:hover { border-color:var(--acc); }
.fd-step.is-next .fd-card { border-color:var(--acc); }
.fd-goal-card { flex:1; background:var(--tint); border-radius:.9rem; padding:1rem 1.1rem; }
.fd-tag { font-size:.7rem; font-weight:700; padding:.15rem .5rem; border-radius:999px; flex-shrink:0; white-space:nowrap; }
.fd-tag-done { background:#ECFDF5; color:#047857; }
.fd-tag-next { background:var(--tint); color:var(--acc); }
.fd-level { font-weight:600; color:#374151; }

.fd-panel { background:#fff; border:1px solid #E5E7EB; border-radius:1rem; padding:1.15rem; }
.fd-mini { width:22px; height:22px; flex-shrink:0; border-radius:999px; background:var(--tint); color:var(--acc);
  font-size:.72rem; font-weight:700; display:flex; align-items:center; justify-content:center; margin-top:1px; }

/* Reader */
.fd-readbar { position:fixed; top:0; left:0; right:0; height:3px; background:var(--acc); transform-origin:0 50%;
  z-index:60; transition:transform .1s linear; }
.fd-toc { display:block; width:100%; text-align:left; font-size:.82rem; line-height:1.35; color:#4B5563;
  padding:.4rem .6rem; border-radius:.5rem; border-left:2px solid transparent; }
.fd-toc:hover { background:#F9FAFB; color:#111827; }
.fd-toc.is-active { color:var(--acc); border-left-color:var(--acc); background:var(--tint); font-weight:600; }
.fd-float { position:fixed; right:1rem; bottom:5.5rem; z-index:45; display:flex; flex-direction:column; align-items:flex-end; gap:.5rem; }
@media (min-width:1024px) { .fd-float { right:2rem; bottom:2rem; } }
.fd-fab { display:inline-flex; align-items:center; gap:.5rem; background:#fff; color:#111827; font-size:.8rem; font-weight:600;
  padding:.55rem .9rem; border-radius:999px; border:1px solid #E5E7EB; box-shadow:0 6px 20px rgba(17,24,39,.12); }
.fd-fab:hover { border-color:var(--acc); }
.fd-fab:focus-visible { outline:2px solid var(--acc); outline-offset:2px; }
.fd-pop { width:min(20rem, calc(100vw - 2rem)); max-height:60vh; overflow-y:auto; background:#fff; border:1px solid #E5E7EB;
  border-radius:1rem; padding:.5rem; box-shadow:0 12px 32px rgba(17,24,39,.16); }
.fd-finish { margin-top:2.5rem; padding:1.15rem 1.25rem; border-radius:1rem; background:var(--tint);
  display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem; }
.fd-next { display:block; width:100%; text-align:left; margin-top:1rem; padding:1rem 1.25rem; border-radius:1rem;
  border:1px solid #E5E7EB; background:#fff; transition:border-color .15s; }
.fd-next:hover { border-color:var(--acc); }

@media (prefers-reduced-motion: reduce) {
  .fd-readbar, .fd-chip, .fd-card, .fd-btn, .fd-next { transition:none; }
}

/* Course text */
.course-prose { max-width:72ch; color:#374151; font-size:16px; line-height:1.75; }
.course-prose h1 { font-family:'Archivo Black', system-ui, sans-serif; font-size:1.9rem; font-weight:400; color:#111827;
  line-height:1.15; margin:0 0 .75rem; letter-spacing:-.01em; }
.course-prose h1 + p { color:#4B5563; font-size:1.05rem; }
.course-prose h2 { font-size:1.35rem; font-weight:800; color:#111827; margin:2.6rem 0 .75rem; padding-top:1.4rem;
  border-top:1px solid #F3F4F6; scroll-margin-top:6rem; }
.course-prose h3 { font-size:1.05rem; font-weight:700; color:#1F2937; margin:1.6rem 0 .5rem; }
.course-prose h4 { font-size:.95rem; font-weight:700; color:#1F2937; margin:1.2rem 0 .4rem; }
.course-prose p { margin:.75rem 0; }
.course-prose ul, .course-prose ol { margin:.6rem 0 1rem; padding-left:1.4rem; }
.course-prose li { margin:.3rem 0; }
.course-prose ul { list-style:disc; }
.course-prose ol { list-style:decimal; }
.course-prose li::marker { color:var(--acc); }
.course-prose li.wyl-item { list-style:none; margin-left:-1.4rem; }
.course-prose li:has(> input[type="checkbox"]) { list-style:none; margin-left:-1.4rem; }
.course-prose li > input[type="checkbox"] { margin-right:.5rem; accent-color:var(--acc); }
.course-prose strong { color:#111827; font-weight:700; }
.course-prose a { color:var(--acc); text-decoration:underline; text-underline-offset:2px; }
.course-prose hr { border:0; border-top:1px solid #E5E7EB; margin:2rem 0; }
.course-prose blockquote { border-left:3px solid var(--acc); background:var(--tint); padding:.6rem 1rem;
  color:#374151; margin:1.1rem 0; border-radius:0 .6rem .6rem 0; }
.course-prose blockquote p { margin:.25rem 0; }
.course-prose code { background:#F3F4F6; color:#111827; padding:.12rem .38rem; border-radius:.35rem; font-size:.86em;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; }
.course-prose pre { background:#1E1B2E; color:#E9E7F5; border-radius:.8rem; padding:1rem 1.15rem; overflow-x:auto;
  margin:1.1rem 0; line-height:1.6; }
.course-prose pre code { background:transparent; color:inherit; padding:0; font-size:.83rem; }
.course-prose table { width:100%; border-collapse:collapse; margin:1.1rem 0; font-size:.9rem; display:block; overflow-x:auto; }
.course-prose th, .course-prose td { border:1px solid #E5E7EB; padding:.5rem .7rem; text-align:left; }
.course-prose th { background:#F9FAFB; font-weight:700; color:#111827; }
.course-prose img { max-width:100%; height:auto; border-radius:.6rem; }
.course-prose .course-mermaid { margin:1.25rem 0; padding:1rem; background:#FAFAFA; border:1px solid #F0F0F0;
  border-radius:.9rem; overflow-x:auto; text-align:center; }
.course-prose .course-mermaid svg { max-width:100%; height:auto; }
/* Mermaid sizes boxes for tight text; keep the prose line-height out of its labels. */
.course-prose .course-mermaid svg foreignObject,
.course-prose .course-mermaid svg foreignObject > div,
.course-prose .course-mermaid svg .nodeLabel,
.course-prose .course-mermaid svg .edgeLabel,
.course-prose .course-mermaid svg .label { line-height:1.25 !important; }
.course-prose .course-mermaid svg .nodeLabel p,
.course-prose .course-mermaid svg .edgeLabel p { margin:0 !important; line-height:1.25 !important; }
`;

export default Foundations;
