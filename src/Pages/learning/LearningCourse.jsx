// src/Pages/learning/LearningCourse.jsx
// One course. Two routes share this page:
//   /learning/:track/:slug         the course page: overview, syllabus, enroll
//   /learning/:track/:slug/learn   the reader, one part at a time (?part=N)
// Anyone can view the course page; reading needs an account and enrollment
// (opening the reader while signed in enrolls automatically).

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import LearningLayout, { signInAndReturn } from './LearningLayout';
import { CheckIcon, CourseReader, certificateErrorToast, CourseReferences, InteractivePlayer, ModuleSummary, coursePartTitles, formatTime, look, useLearning } from './shared';
import { coursesForTrack, loadCourseMarkdown } from '../../utils/foundationsCourses';
import { setPageMeta } from '../../utils/pageMeta';
import { PUBLISHED_PREFIX, getPublished, getPublishedContent, listPublished, toCatalogCourse } from '../../utils/learningPublished';
import { CourseCard, LR_CSS, trackName } from './LearningHome';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import MentorBadge from '../../components/MentorBadge';
import CourseFeedback from './CourseFeedback';
import CourseForum from './CourseForum';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { courseKey } from '../../utils/mentorStats';
import { courseStats } from '../../utils/mentorStats';
import { PUBLIC_MIN, getPublicCourseStats, recordCourseView, short, statsFor } from '../../utils/courseStats';
import MentorCourseStaffTools from '../../components/MentorCourseStaffTools';
import { getOverrideContent } from '../../utils/courseOverrides';
import BuiltInCourseStaffTools, { useCourseOverridesVersion } from '../../components/BuiltInCourseStaffTools';

const LearningCourse = ({ reading = false }) => {
  const { track, slug } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const lr = useLearning();
  const { currentUser } = useAuth();
  const [refsOpen, setRefsOpen] = useState(false);
  const [authorCount, setAuthorCount] = useState(1);
  const [author, setAuthor] = useState(null); // the mentor's public profile details
  const [stats, setStats] = useState(null); // completions and ratings for this course

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

  const overridesVersion = useCourseOverridesVersion(); // staff edits to built-in courses
  const courses = useMemo(
    () => [...coursesForTrack(track).map((c) => ({ ...c, track })), ...(published || [])],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [track, published, overridesVersion]
  );

  const index = courses.findIndex((c) => c.slug === slug);
  const baseCourse = index >= 0 ? courses[index] : null;
  // Built-in course whose text staff edited: load the edited text.
  const [editedText, setEditedText] = useState(null);
  const needsEdited = !isPublished && baseCourse?.overrideHasContent;
  const [editedDone, setEditedDone] = useState(false); // finished trying to load the edited text
  useEffect(() => {
    setEditedText(null);
    setEditedDone(false);
    if (!needsEdited) return undefined;
    let alive = true;
    getOverrideContent(track, slug)
      .then((t) => alive && setEditedText(t))
      .catch(() => alive && setEditedText(null))
      .finally(() => alive && setEditedDone(true));
    return () => {
      alive = false;
    };
  }, [needsEdited, track, slug, overridesVersion]);

  // A built-in written course's text is downloaded on demand (its own small
  // chunk), not with the course list. Staff edits (above) win over it.
  const needsBuiltIn = !isPublished && !!baseCourse?.hasMarkdown;
  const [builtIn, setBuiltIn] = useState({ key: null, text: null, error: false });
  const builtInKey = `${track}/${slug}`;
  const [builtInTry, setBuiltInTry] = useState(0);
  useEffect(() => {
    if (!needsBuiltIn) return undefined;
    let alive = true;
    setBuiltIn({ key: builtInKey, text: null, error: false });
    loadCourseMarkdown(track, slug)
      .then((text) => alive && setBuiltIn({ key: builtInKey, text, error: false }))
      .catch(() => alive && setBuiltIn({ key: builtInKey, text: null, error: true }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsBuiltIn, builtInKey, builtInTry]);
  const builtInText = builtIn.key === builtInKey ? builtIn.text : null;
  const builtInError = needsBuiltIn && builtIn.key === builtInKey && builtIn.error;

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

  // The mentor's badge level (approved course count), when we can read it.
  const authorUid = isPublished && published ? (published.find((p) => p.slug === slug) || {}).authorUid : null;
  useEffect(() => {
    if (!authorUid || !lr.signedIn) return;
    getDoc(doc(db, 'users', authorUid))
      .then((s) => {
        setAuthorCount(Math.max(1, s.data()?.mentorApprovedCourses || 1));
        setAuthor(s.exists() ? s.data() : null);
      })
      .catch(() => {});
  }, [authorUid, lr.signedIn]);

  // Enrolled, completed and rating: shown under the title once the course has
  // PUBLIC_MIN learners (and in the mentor box on mentor courses).
  useEffect(() => {
    setStats(null);
    courseStats(track, slug).then(setStats).catch(() => {});
  }, [track, slug]);

  // Numbers for the "Next in this track" cards.
  const [publicStats, setPublicStats] = useState({});
  useEffect(() => { getPublicCourseStats().then(setPublicStats); }, []);

  // A view of this course (staff see views in Admin → Course feedback).
  useEffect(() => {
    if (track && slug) recordCourseView(track, slug);
  }, [track, slug]);

  const course = useMemo(() => {
    if (baseCourse && !isPublished) {
      if (editedText != null) return { ...baseCourse, markdown: editedText };
      return builtInText != null ? { ...baseCourse, markdown: builtInText } : baseCourse;
    }
    if (!baseCourse || !isPublished) return baseCourse;
    if (pubContent == null) return baseCourse;
    return baseCourse.kind === 'published-html'
      ? { ...baseCourse, html: pubContent }
      : { ...baseCourse, markdown: pubContent };
  }, [baseCourse, isPublished, pubContent, editedText, builtInText]);
  const parts = useMemo(() => (course ? coursePartTitles(course) : []), [course]);
  // Tab title, search result and link preview for this course.
  const metaTitle = course ? course.title : '';
  const metaSummary = course
    ? (track === 'start' ? 'A 15-minute guide to She Model Tech: find your way around, set up your profile, learn with free courses, join real projects, earn badges and get seen.'
      : track === 'company' ? 'A short guide for companies: what She Model Tech badges prove, how to read badge levels, and how to hire with confidence.'
        : course.seo || course.summary || '')
    : '';
  useEffect(() => {
    if (metaTitle) setPageMeta({ title: `${metaTitle} | She Model Tech Learning`, description: metaSummary, path: `/learning/${track}/${slug}` });
  }, [metaTitle, metaSummary, track, slug]);
  // Only enrolled learners (and mentors and staff) can rate, comment, and post in
  // the forum. Enrolment is read from the learner's account, and the database
  // rules check the same thing, so this can't be bypassed in the browser.
  const isStaffOrMentor = !!lr.profile && (['admin', 'editor'].includes(lr.profile.role) || !!lr.profile.isTeacher);
  const canParticipate = lr.signedIn && (lr.isEnrolled(track, slug) || isStaffOrMentor);
  const joinCourse = () => {
    if (!lr.signedIn) return signInAndReturn(navigate, location.pathname);
    lr.enroll(track, slug).then(() => toast.success('Enrolled. You can now join the discussion.')).catch(() => {});
  };

  // Make sure an enrolled learner's enrolment record exists (older enrolments
  // were made before these records), so the forum and ratings accept them.
  const enrolledHere = lr.signedIn && lr.isEnrolled(track, slug);
  useEffect(() => {
    if (!enrolledHere || !currentUser) return;
    const ref = doc(db, 'course_enrollments', courseKey(track, slug), 'learners', currentUser.uid);
    getDoc(ref)
      .then((snap) => {
        if (!snap.exists()) setDoc(ref, { uid: currentUser.uid, at: new Date().toISOString() }).catch(() => {});
      })
      .catch(() => {});
  }, [enrolledHere, currentUser, track, slug]);

  // Module summaries, saved with this learner's progress for the course.
  const progressRef = currentUser ? doc(db, 'users', currentUser.uid, 'learning_progress', slug.replace(/[/]/g, '_')) : null;
  const [summaries, setSummaries] = useState({});
  useEffect(() => {
    if (!currentUser) return;
    getDoc(doc(db, 'users', currentUser.uid, 'learning_progress', slug.replace(/[/]/g, '_')))
      .then((snap) => setSummaries((snap.exists() && snap.data().summaries) || {}))
      .catch(() => {});
  }, [currentUser, slug]);
  const saveSummary = async (partId, text) => {
    const entry = { text: text.trim(), at: new Date().toISOString() };
    await setDoc(progressRef, { summaries: { [partId]: entry } }, { merge: true });
    setSummaries((m) => ({ ...m, [partId]: entry }));
  };

  // Forum participation: once at least one other learner has posted in the
  // course forum, the learner replies to someone else's post before finishing.
  // If she's the first or only one there, it's skipped.
  const [forumReq, setForumReq] = useState({ required: false, done: true });
  const reloadForum = useCallback(async () => {
    if (!currentUser) return;
    try {
      const snap = await getDocs(query(collection(db, 'course_forum', courseKey(track, slug), 'threads'), limit(100)));
      const threads = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const others = threads.filter((t) => t.uid !== currentUser.uid);
      if (others.length === 0) {
        setForumReq({ required: false, done: true });
        return;
      }
      let replied = false;
      // Check threads 10 at a time (in parallel), stopping at the first reply
      // found: much faster than one request after another, same reads at most.
      const toCheck = others.slice(0, 50);
      for (let i = 0; i < toCheck.length && !replied; i += 10) {
        // eslint-disable-next-line no-await-in-loop
        const rs = await Promise.all(
          toCheck.slice(i, i + 10).map((t) =>
            getDocs(query(collection(db, 'course_forum', courseKey(track, slug), 'threads', t.id, 'replies'), where('uid', '==', currentUser.uid), limit(1)))
          )
        );
        replied = rs.some((r) => !r.empty);
      }
      setForumReq({ required: true, done: replied });
    } catch (_) {
      setForumReq({ required: false, done: true });
    }
  }, [currentUser, track, slug]);
  useEffect(() => {
    reloadForum();
  }, [reloadForum]);
  const [summaryGate, setSummaryGate] = useState(false); // interactive courses: summary before completing
  const waiting =
    (isPublished && (published === null || (baseCourse && pubContent == null))) ||
    // Built-in course: wait for its text (or the staff-edited text) unless loading failed.
    (needsBuiltIn && editedText == null && !builtInError && (builtInText == null || (needsEdited && !editedDone)));

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
  if (builtInError && editedText == null) {
    return (
      <LearningLayout>
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <p className="text-gray-700 mb-4">We couldn't load this course. Check your connection and try again.</p>
          <button
            onClick={() => setBuiltInTry((n) => n + 1)}
            className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg"
          >
            Try again
          </button>
        </div>
      </LearningLayout>
    );
  }
  if (!course) return <Navigate to="/learning" replace />;
  if (reading && !lr.loading && !lr.signedIn) return <Navigate to={`/learning/${track}/${slug}`} replace />;

  // The Start Here course is an orientation: no summaries, no forum reply,
  // and no certificate (certificates are for skill courses).
  // (Orientation pages marked <!-- certificate: none --> give no certificate either.)
  const noCert = track === 'start' || !!course.noCertificate;

  // Open (issuing if needed) this learner's certificate for the course.
  const openCertificate = async () => {
    try {
      const id = await lr.ensureCertificate({ ...course, track });
      if (id) navigate(`/learning/certificate/${id}`);
    } catch (e) {
      console.error(e);
      certificateErrorToast(e);
    }
  };

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
          onComplete={() => {
            if (!summaries.course) return setSummaryGate(true);
            if (forumReq.required && !forumReq.done) {
              toast.info('Before you finish: reply to another learner in the course forum.');
              return navigate(`/learning/${track}/${slug}#forum`);
            }
            return lr.markComplete(track, slug, noCert ? null : course);
          }}
          onCertificate={noCert ? null : openCertificate}
        />
        {summaryGate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-xl bg-white rounded-2xl p-5">
              <ModuleSummary
                title={course.title}
                saved={null}
                onSave={async (text) => {
                  await saveSummary('course', text);
                  setSummaryGate(false);
                  if (forumReq.required && !forumReq.done) {
                    toast.info('One more step: reply to another learner in the course forum.');
                    navigate(`/learning/${track}/${slug}#forum`);
                  } else {
                    lr.markComplete(track, slug, noCert ? null : course);
                  }
                }}
              />
              <button onClick={() => setSummaryGate(false)} className="mt-3 text-sm font-semibold text-gray-600">Not now</button>
            </div>
          </div>
        )}
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
          onComplete={() => lr.markComplete(track, slug, noCert ? null : course)}
          onCertificate={noCert ? null : openCertificate}
          quizDone={lr.quizDoneFor(track, slug)}
          onQuizDone={(partId) => lr.saveQuizDone(track, slug, partId)}
          summaries={summaries}
          onSummary={currentUser && !noCert ? saveSummary : null}
          forum={{ ...(noCert ? { required: false, done: true } : forumReq), url: `/learning/${track}/${slug}#forum` }}
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 items-start">
          <div>
            <nav className="text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
              <Link to="/learning" className="hover:underline">Learning</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span>{trackName(track)}</span>
            </nav>
            <h1 className="fd-display text-3xl sm:text-4xl text-gray-900 leading-tight">{course.title}</h1>
            {isPublished && <MentorCourseStaffTools course={course} onRemoved={() => navigate('/learning')} />}
            {!isPublished && <BuiltInCourseStaffTools course={course} track={track} onRemoved={() => navigate('/learning')} />}
            {course.authorName && (
              <p className="flex flex-wrap items-center gap-2 mt-3 text-sm text-gray-700">
                By{' '}
                {author?.email ? (
                  <Link to={`/profile/${encodeURIComponent(author.email)}`} className="font-semibold hover:underline">
                    {course.authorName}
                  </Link>
                ) : (
                  <span className="font-semibold">{course.authorName}</span>
                )}
                <MentorBadge count={authorCount} size="sm" />
                {course.authorUid && lr.signedIn && course.authorUid !== currentUser?.uid && (
                  <button
                    onClick={() =>
                      navigate(
                        `/messages?to=${course.authorUid}&text=${encodeURIComponent(
                          `Hi ${course.authorName.split(' ')[0]}, I have a question about your course "${course.title}": `
                        )}`
                      )
                    }
                    className="text-xs font-semibold text-pink-700 hover:underline"
                  >
                    Ask a question
                  </button>
                )}
              </p>
            )}
            {course.summary && <p className="text-gray-700 text-lg mt-4 max-w-2xl">{course.summary}</p>}
            {stats && stats.enrollments >= PUBLIC_MIN && (
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-4 text-sm text-gray-700">
                {stats.ratingCount > 0 && (
                  <span className="font-semibold text-gray-900" aria-label={`Rated ${(stats.ratingSum / stats.ratingCount).toFixed(1)} out of 5 by ${stats.ratingCount} learners`}>
                    <span className="text-pink-600" aria-hidden="true">★</span> {(stats.ratingSum / stats.ratingCount).toFixed(1)}
                    <span className="font-normal text-gray-500"> ({short(stats.ratingCount)} rating{stats.ratingCount === 1 ? '' : 's'})</span>
                  </span>
                )}
                <span><strong className="font-semibold text-gray-900">{short(stats.enrollments)}</strong> learners enrolled</span>
                <span><strong className="font-semibold text-gray-900">{short(stats.completions)}</strong> completed</span>
              </p>
            )}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-sm text-gray-700">
              {course.level && <span><strong className="font-semibold">Level:</strong> {course.level}</span>}
              {course.minutes > 0 && <span>{formatTime(course.minutes)}</span>}
              <span>{course.kind === 'published-html' ? 'Interactive course' : `${parts.length} ${course.kind === 'interactive' ? 'interactive modules' : 'parts'}`}</span>
              <span>Course {index + 1} of {courses.length} in {L.short}</span>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button onClick={start} className="fd-btn text-base px-6 py-3">{ctaLabel}</button>
              {done && (
                <>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-pink-700">
                    <CheckIcon className="w-4 h-4" /> You completed this course
                  </span>
                  {!noCert && (
                    <button onClick={openCertificate} className="text-sm font-semibold border border-gray-300 bg-white px-4 py-2.5 rounded-lg hover:bg-gray-50">
                      View certificate
                    </button>
                  )}
                </>
              )}
              {!lr.signedIn && <span className="text-sm text-gray-600">Free. Your progress is saved to your account.</span>}
            </div>
          </div>

          {/* Badge card */}
          {!['company', 'start'].includes(track) && (
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
                deliver your part, and have it reviewed.
              </p>
              <Link to="/projects" className="fd-link inline-block mt-3">Find a project to join</Link>
            </aside>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10">
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
        
          {/* Ratings, reactions, comments: on every course (mentor courses tell the mentor) */}
          <CourseFeedback track={track} slug={slug} courseTitle={course.title} authorUid={isPublished ? course.authorUid || '' : ''} authorName={isPublished ? course.authorName || '' : ''} displayName={lr.profile?.displayName || ''} canParticipate={canParticipate} onEnroll={joinCourse} />


          {/* Discussion forum for every course */}
          <CourseForum
            track={track}
            slug={slug}
            courseTitle={course.title}
            authorUid={isPublished ? course.authorUid || null : null}
            canParticipate={canParticipate}
            onEnroll={joinCourse}
            displayName={lr.profile?.displayName || ''}
            onReplied={reloadForum}
            learningId={isPublished ? course.publishedId || null : null}
          />
        </section>

        <div>
        {/* About the mentor: who wrote this course */}
        {isPublished && course.authorName && (
          <section className="pt-10" aria-labelledby="mentor-h">
            <h2 id="mentor-h" className="text-xl font-bold text-gray-900 mb-4">About the mentor</h2>
            <div className="rounded-2xl border border-pink-200 bg-white p-5">
              <div className="flex items-center gap-3">
                {author?.photoURL ? (
                  <img src={author.photoURL} alt="" className="w-14 h-14 rounded-full object-cover border border-gray-100" />
                ) : (
                  <span className="w-14 h-14 rounded-full bg-pink-600 text-white font-bold text-lg flex items-center justify-center" aria-hidden="true">
                    {(course.authorName || 'M')[0]}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{course.authorName}</p>
                  <MentorBadge count={authorCount} isMentor size="sm" />
                </div>
              </div>
              {author?.specialization && <p className="text-sm text-gray-600 mt-3">{author.specialization}</p>}
              <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                <div className="rounded-lg bg-gray-50 py-2">
                  <p className="font-bold text-gray-900">{authorCount}</p>
                  <p className="text-[11px] text-gray-500">course{authorCount === 1 ? '' : 's'}</p>
                </div>
                <div className="rounded-lg bg-gray-50 py-2">
                  <p className="font-bold text-gray-900">{stats ? stats.enrollments : '–'}</p>
                  <p className="text-[11px] text-gray-500">enrolled in this</p>
                </div>
                <div className="rounded-lg bg-gray-50 py-2">
                  <p className="font-bold text-gray-900">{stats ? stats.completions : '–'}</p>
                  <p className="text-[11px] text-gray-500">completed this</p>
                </div>
                <div className="rounded-lg bg-gray-50 py-2">
                  <p className="font-bold text-gray-900">
                    {stats?.ratingCount ? `★ ${(stats.ratingSum / stats.ratingCount).toFixed(1)}` : '–'}
                  </p>
                  <p className="text-[11px] text-gray-500">rating</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {author?.email && (
                  <Link to={`/profile/${encodeURIComponent(author.email)}`}
                    className="text-sm font-semibold border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50">
                    View profile
                  </Link>
                )}
                {course.authorUid !== currentUser?.uid && (
                  <button
                    onClick={() =>
                      lr.signedIn
                        ? navigate(`/messages?to=${course.authorUid}&text=${encodeURIComponent(`Hi ${course.authorName.split(' ')[0]}, I have a question about your course "${course.title}": `)}`)
                        : signInAndReturn(navigate, location.pathname)
                    }
                    className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded-lg"
                  >
                    Ask a question
                  </button>
                )}
              </div>
              {!lr.signedIn && <p className="text-xs text-gray-500 mt-3">Sign in to see the mentor's profile.</p>}
            </div>
          </section>
        )}

        {/* More in this track */}
        {more.length > 0 && (
          <section className="pt-10" aria-labelledby="more-h">
            <h2 id="more-h" className="text-xl font-bold text-gray-900 mb-4">Next in {L.short}</h2>
            <div className="grid gap-4">
              {more.map((c) => (
                <CourseCard
                  key={c.slug}
                  course={{ ...c, stats: statsFor(publicStats, c.track || track, c.slug) }}
                  status={lr.isDone(track, c.slug) ? 'done' : lr.isEnrolled(track, c.slug) ? 'enrolled' : null}
                  progress={0}
                />
              ))}
            </div>
          </section>
        )}
        </div>
      </div>

      <style>{LR_CSS + `.lr-reached { background:var(--tint) !important; color:var(--acc) !important; }`}</style>
    </LearningLayout>
  );
};

export default LearningCourse;
