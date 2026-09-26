// src/Pages/learning/LearningCourse.jsx
// One course. Two routes share this page:
//   /learning/:track/:slug         the course page: overview, syllabus, enroll
//   /learning/:track/:slug/learn   the reader, one part at a time (?part=N)
// Anyone can view the course page; reading needs an account and enrollment
// (opening the reader while signed in enrolls automatically).

import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import LearningLayout, { signInAndReturn } from './LearningLayout';
import { CheckIcon, CourseReader, CourseReferences, InteractivePlayer, coursePartTitles, formatTime, look, useLearning } from './shared';
import { coursesForTrack } from '../../utils/foundationsCourses';
import { PUBLISHED_PREFIX, getPublished, getPublishedContent, listPublished, toCatalogCourse } from '../../utils/learningPublished';
import { CourseCard, LR_CSS, trackName } from './LearningHome';

const LearningCourse = ({ reading = false }) => {
  const { track, slug } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const lr = useLearning();
  const [refsOpen, setRefsOpen] = useState(false);

  // Courses published from Teacher live in the database: load this track's list,
  // and the full text of the one being viewed.
  const isPublished = slug.startsWith(PUBLISHED_PREFIX);
  const [published, setPublished] = useState(null);
  const [pubContent, setPubContent] = useState(null);
  useEffect(() => {
    let alive = true;
    listPublished()
      .then((list) => alive && setPublished(list.filter((p) => p.track === track).map(toCatalogCourse)))
      .catch(() => alive && setPublished([]));
    return () => {
      alive = false;
    };
  }, [track]);

  const courses = useMemo(
    () => [...coursesForTrack(track).map((c) => ({ ...c, track })), ...(published || [])],
    [track, published]
  );
  const index = courses.findIndex((c) => c.slug === slug);
  const baseCourse = index >= 0 ? courses[index] : null;

  const pubMeta = isPublished && published ? published.find((p) => p.slug === slug) : null;
  useEffect(() => {
    if (!pubMeta) return undefined;
    let alive = true;
    getPublished(pubMeta.publishedId)
      .then((full) => (full ? getPublishedContent(full.id, full.chunkCount) : ''))
      .then((text) => alive && setPubContent(text || ''))
      .catch(() => alive && setPubContent(''));
    return () => {
      alive = false;
    };
  }, [pubMeta]);

  const course = useMemo(() => {
    if (!baseCourse || !isPublished) return baseCourse;
    if (pubContent == null) return baseCourse;
    return baseCourse.kind === 'published-html'
      ? { ...baseCourse, html: pubContent }
      : { ...baseCourse, markdown: pubContent };
  }, [baseCourse, isPublished, pubContent]);
  const parts = useMemo(() => (course ? coursePartTitles(course) : []), [course]);
  const waiting = isPublished && (published === null || (baseCourse && pubContent == null));

  const enrolled = course && lr.isEnrolled(track, slug);
  const done = course && lr.isDone(track, slug);
  const lastPart = course ? lr.lastPartOf(track, slug) : 1;
  const part = Math.max(1, parseInt(params.get('part'), 10) || 1);

  // Opening the reader while signed in counts as enrolling.
  useEffect(() => {
    if (reading && course && lr.signedIn && !lr.loading && !enrolled) lr.enroll(track, slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reading, course, lr.signedIn, lr.loading, enrolled]);

  // Remember the last part opened, for "Continue" and progress bars.
  useEffect(() => {
    if (reading && course && lr.signedIn && !lr.loading && part !== lastPart) lr.saveLastPart(track, slug, part);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reading, part, lr.signedIn, lr.loading]);

  if (waiting) {
    return (
      <LearningLayout>
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
        </div>
      </LearningLayout>
    );
  }
  if (!course) return <Navigate to="/learning" replace />;
  if (reading && !lr.loading && !lr.signedIn) return <Navigate to={`/learning/${track}/${slug}`} replace />;

  const L = look(track);
  const readerUrl = (p) => `/learning/${track}/${slug}/learn${p > 1 ? `?part=${p}` : ''}`;
  const start = () => {
    if (!lr.signedIn) return signInAndReturn(navigate, location.pathname);
    navigate(readerUrl(enrolled && !done ? lastPart : 1));
  };

  if (reading && (course.kind === 'interactive' || course.kind === 'published-html')) {
    return (
      <LearningLayout accent={L} bare>
        <InteractivePlayer
          course={course}
          isDone={!!done}
          next={courses[index + 1] || null}
          onBack={() => navigate(`/learning/${track}/${slug}`)}
          onOpen={(s) => navigate(`/learning/${track}/${s}`)}
          onComplete={() => lr.markComplete(track, slug)}
        />
      </LearningLayout>
    );
  }

  if (reading) {
    return (
      <LearningLayout accent={L}>
        <CourseReader
          key={course.slug}
          course={course}
          index={index}
          total={courses.length}
          trackLabel={trackName(track)}
          backLabel="Course overview"
          isDone={!!done}
          next={courses[index + 1] || null}
          part={part - 1}
          onPart={(i) => setParams(i > 0 ? { part: String(i + 1) } : {})}
          onBack={() => navigate(`/learning/${track}/${slug}`)}
          onOpen={(s) => navigate(`/learning/${track}/${s}`)}
          onComplete={() => lr.markComplete(track, slug)}
        />
      </LearningLayout>
    );
  }

  const ctaLabel = !lr.signedIn
    ? 'Sign in to enroll'
    : done
    ? 'Review the course'
    : enrolled && (course.kind === 'interactive' || course.kind === 'published-html')
    ? 'Continue the course'
    : enrolled
    ? lastPart > 1
      ? `Continue: part ${lastPart}`
      : 'Start the course'
    : 'Enroll for free';

  const more = courses.slice(index + 1, index + 4);

  return (
    <LearningLayout accent={L}>
      <section style={{ background: L.tint }} className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 items-start">
          <div>
            <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
              <Link to="/learning" className="hover:underline">Learning</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span>{trackName(track)}</span>
            </nav>
            <h1 className="fd-display text-3xl sm:text-4xl text-gray-900 leading-tight">{course.title}</h1>
            {course.summary && <p className="text-gray-700 text-lg mt-4 max-w-2xl">{course.summary}</p>}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-sm text-gray-700">
              {course.level && <span><strong className="font-semibold">Level:</strong> {course.level}</span>}
              {course.minutes > 0 && <span>{formatTime(course.minutes)}</span>}
              <span>{course.kind === 'published-html' ? 'Interactive course' : `${parts.length} ${course.kind === 'interactive' ? 'interactive modules' : 'parts'}`}</span>
              <span>Course {index + 1} of {courses.length} in {L.short}</span>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button onClick={start} className="fd-btn text-base px-6 py-3">{ctaLabel}</button>
              {done && (
                <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                  <CheckIcon className="w-4 h-4" /> You completed this course
                </span>
              )}
              {!lr.signedIn && <span className="text-sm text-gray-600">Free. Your progress is saved to your account.</span>}
            </div>
          </div>

          {/* Badge card */}
          {track !== 'company' && (
            <aside className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                {L.img && <img src={L.img} alt="" className="w-12 h-14 object-contain" />}
                <div>
                  <p className="text-xs text-gray-500">Part of the</p>
                  <p className="font-semibold text-gray-900">{trackName(track)} track</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                Courses build the skill. The {track} badge comes from doing the work: join a team project,
                deliver your part, and have it reviewed. One badge unlocks paid projects.
              </p>
              <Link to="/projects" className="fd-link inline-block mt-3">Find a project to join</Link>
            </aside>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10">
        {/* Syllabus */}
        <section className="pt-10" aria-labelledby="syl-h">
          <h2 id="syl-h" className="text-xl font-bold text-gray-900 mb-4">What&rsquo;s in this course</h2>
          {(course.kind === 'interactive' || course.kind === 'published-html') && (
            <p className="text-sm text-gray-600 mb-4 max-w-2xl">
              An interactive course: every module has worked examples, a hands-on lab you can play with
              right in the page, and a short quiz. It remembers where you got to on this device.
            </p>
          )}
          <ol className="border border-gray-200 rounded-2xl divide-y divide-gray-100 bg-white">
            {parts.map((t, i) => {
              const partName =
                course.kind === 'interactive' && course.modules[i] &&
                (i === 0 || course.modules[i].part !== course.modules[i - 1].part)
                  ? course.parts[course.modules[i].part]
                  : null;
              const reached = enrolled && (done || (course.kind !== 'interactive' && course.kind !== 'published-html' && i + 1 < lastPart));
              return (
                <li key={t + i}>
                  {partName && (
                    <p className="px-5 pt-4 pb-1 text-xs font-bold uppercase tracking-wide text-gray-500">{partName}</p>
                  )}
                  <button
                    onClick={() =>
                      lr.signedIn
                        ? navigate(course.kind === 'interactive' || course.kind === 'published-html' ? readerUrl(1) : readerUrl(i + 1))
                        : signInAndReturn(navigate, location.pathname)
                    }
                    className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50"
                  >
                    <span className={`fd-part-num ${reached ? 'lr-reached' : ''}`} aria-hidden="true">
                      {reached ? <CheckIcon className="w-3 h-3" /> : i + 1}
                    </span>
                    <span className="text-sm text-gray-900 font-medium">{t}</span>
                  </button>
                </li>
              );
            })}
            {/* Sources: the last row. Members open it in place; visitors are asked to sign in. */}
            {course.references && course.references.length > 0 && (
              <li>
                <button
                  onClick={() => (lr.signedIn ? setRefsOpen((o) => !o) : signInAndReturn(navigate, location.pathname))}
                  aria-expanded={lr.signedIn ? refsOpen : undefined}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50"
                >
                  <span className="fd-part-num" aria-hidden="true">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.247m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.247" />
                    </svg>
                  </span>
                  <span className="flex-1 text-sm text-gray-900 font-medium">
                    Sources and further reading
                    <span className="text-gray-500 font-normal"> ({course.references.length})</span>
                  </span>
                  {lr.signedIn ? (
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${refsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <span className="text-xs font-semibold text-gray-500">Sign in to view</span>
                  )}
                </button>
                {lr.signedIn && refsOpen && (
                  <div className="px-5 pb-5">
                    <CourseReferences refs={course.references} inline />
                  </div>
                )}
              </li>
            )}
          </ol>
        </section>

        {/* More in this track */}
        {more.length > 0 && (
          <section className="pt-10" aria-labelledby="more-h">
            <h2 id="more-h" className="text-xl font-bold text-gray-900 mb-4">Next in {L.short}</h2>
            <div className="grid gap-4">
              {more.map((c) => (
                <CourseCard
                  key={c.slug}
                  course={c}
                  status={lr.isDone(track, c.slug) ? 'done' : lr.isEnrolled(track, c.slug) ? 'enrolled' : null}
                  progress={0}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{LR_CSS + `.lr-reached { background:var(--tint) !important; color:var(--acc) !important; }`}</style>
    </LearningLayout>
  );
};

export default LearningCourse;
