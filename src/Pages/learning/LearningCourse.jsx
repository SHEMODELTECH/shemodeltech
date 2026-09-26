// src/Pages/learning/LearningCourse.jsx
// One course. Two routes share this page:
//   /learning/:track/:slug         the course page: overview, syllabus, enroll
//   /learning/:track/:slug/learn   the reader, one part at a time (?part=N)
// Anyone can view the course page; reading needs an account and enrollment
// (opening the reader while signed in enrolls automatically).

import React, { useEffect, useMemo } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import LearningLayout, { signInAndReturn } from './LearningLayout';
import { CheckIcon, CourseReader, InteractivePlayer, coursePartTitles, formatTime, look, useLearning } from './shared';
import { coursesForTrack } from '../../utils/foundationsCourses';
import { CourseCard, LR_CSS, trackName } from './LearningHome';

const LearningCourse = ({ reading = false }) => {
  const { track, slug } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const lr = useLearning();

  const courses = useMemo(() => coursesForTrack(track).map((c) => ({ ...c, track })), [track]);
  const index = courses.findIndex((c) => c.slug === slug);
  const course = index >= 0 ? courses[index] : null;
  const parts = useMemo(() => (course ? coursePartTitles(course) : []), [course]);

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

  if (!course) return <Navigate to="/learning" replace />;
  if (reading && !lr.loading && !lr.signedIn) return <Navigate to={`/learning/${track}/${slug}`} replace />;

  const L = look(track);
  const readerUrl = (p) => `/learning/${track}/${slug}/learn${p > 1 ? `?part=${p}` : ''}`;
  const start = () => {
    if (!lr.signedIn) return signInAndReturn(navigate, location.pathname);
    navigate(readerUrl(enrolled && !done ? lastPart : 1));
  };

  if (reading && course.kind === 'interactive') {
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
    : enrolled && course.kind === 'interactive'
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
              <span>{parts.length} {course.kind === 'interactive' ? 'interactive modules' : 'parts'}</span>
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
          {course.kind === 'interactive' && (
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
              const reached = enrolled && (done || (course.kind !== 'interactive' && i + 1 < lastPart));
              return (
                <li key={t + i}>
                  {partName && (
                    <p className="px-5 pt-4 pb-1 text-xs font-bold uppercase tracking-wide text-gray-500">{partName}</p>
                  )}
                  <button
                    onClick={() =>
                      lr.signedIn
                        ? navigate(course.kind === 'interactive' ? readerUrl(1) : readerUrl(i + 1))
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
