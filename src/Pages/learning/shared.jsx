// src/Pages/learning/shared.jsx
// Shared pieces of She Model Tech Learning: track look (medal art and ribbon
// colours), the course reader (one part at a time with a parts sidebar), the
// page styles, and the hook that loads and saves a member's learning progress.
//
// Progress lives on the user doc:
//   learningEnrolled.<track>.<slug>   = ISO date enrolled
//   learningLastPart.<track>.<slug>   = last part opened (1-based)
//   foundationsCourses.<track>.<slug> = true once completed
//   foundationsComplete.<track>       = true once a whole track is completed

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { coursesForTrack, trackMeta } from '../../utils/foundationsCourses';
import { renderCourse } from '../../utils/renderCourseMarkdown';
import { LABS_CSS, enhancePython, mountLabs } from './labs';
import TechDevImg from '../../Images/TechDev.png';
import TechArchsImg from '../../Images/TechArchs.png';
import TechQAImg from '../../Images/TechQA.png';
import TechGuardImg from '../../Images/TechGuard.png';
import TechPOImg from '../../Images/TechMO.png';
import TechLeadsImg from '../../Images/TechLeads.png';

export const TRACK_LOOK = {
  TechDev: { img: TechDevImg, accent: '#DC2626', tint: '#FEF2F2', short: 'Coding Developer' },
  TechArchs: { img: TechArchsImg, accent: '#4F46E5', tint: '#EEF2FF', short: 'Low/No-Code' },
  TechQA: { img: TechQAImg, accent: '#15803D', tint: '#F0FDF4', short: 'Quality Tester' },
  TechGuard: { img: TechGuardImg, accent: '#1F2937', tint: '#F3F4F6', short: 'Cybersecurity' },
  TechPO: { img: TechPOImg, accent: '#7E22CE', tint: '#FAF5FF', short: 'Product Owner' },
  TechLeads: { img: TechLeadsImg, accent: '#A16207', tint: '#FEFCE8', short: 'Non-Technical' },
  company: { img: null, accent: '#DB2777', tint: '#FDF2F8', short: 'For companies' },
};
export const TRACK_ORDER = ['TechDev', 'TechArchs', 'TechQA', 'TechGuard', 'TechPO', 'TechLeads'];
export const look = (t) => TRACK_LOOK[t] || TRACK_LOOK.company;

// "AI Data Engineer: Hands-On Project Tutorials" -> "AI Data Engineer"
export const cleanTitle = (title = '') =>
  title.replace(/:?\s*Hands-?On Project Tutorials\s*$/i, '').trim() || title;

// "About 45 min", "About 3.5 hours"
export const formatTime = (min) => {
  if (!min) return '';
  if (min < 60) return `About ${min} min`;
  const h = Math.round((min / 60) * 2) / 2;
  return `About ${h} hour${h === 1 ? '' : 's'}`;
};

export const CheckIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

// Part titles for a course (cached): used for syllabi and progress.
const partsCache = new Map();
export const coursePartTitles = (course) => {
  if (course.kind === 'interactive') return (course.modules || []).map((m) => m.title);
  if (!partsCache.has(course.slug)) {
    const r = renderCourse(course.markdown);
    partsCache.set(course.slug, splitParts(r.html, r.toc).map((p) => p.title));
  }
  return partsCache.get(course.slug);
};


// ---- Interactive layer for every written course ----
// Runs on each part after it renders, turning the course's standard blocks into
// things learners can do, the same way in all courses:
//   "Quiz" + "Answers: 1) ... 2) ..."  -> question cards: write, reveal, self-mark
//   "- [ ] item" checklists            -> real checkboxes with a running count
//   "Checkpoint" paragraph             -> a highlighted goal box
//   code blocks                        -> a Copy button
// Answers and ticks are kept in this browser (localStorage), like the
// interactive courses.
const store = {
  get(k) {
    try {
      return localStorage.getItem(k);
    } catch (_) {
      return null;
    }
  },
  set(k, v) {
    try {
      if (v == null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    } catch (_) {
      /* storage unavailable: the page still works, it just won't remember */
    }
  },
};

const h = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};

// "Answers: 1) A. 2) B." -> ["A.", "B."], matching numbers in order so a
// "(1)" or "2)" inside an answer doesn't split it.
const splitAnswers = (text, n) => {
  const body = text.replace(/^\s*Answers?:\s*/i, '');
  const starts = [];
  let from = 0;
  for (let k = 1; k <= n; k++) {
    const re = new RegExp(`(^|\\s)${k}\\)\\s`, 'g');
    re.lastIndex = from;
    const m = re.exec(body);
    if (!m) return null;
    const at = m.index + m[1].length;
    starts.push({ at, text: at + String(k).length + 2 });
    from = at + 1;
  }
  return starts.map((st, i) => body.slice(st.text, i + 1 < starts.length ? starts[i + 1].at : body.length).trim());
};

const headingNamed = (container, re) =>
  Array.from(container.querySelectorAll('h2, h3, h4, h5')).filter((x) => re.test(x.textContent.trim()));

const enhanceQuizzes = (container, key) => {
  headingNamed(container, /^quiz\b/i).forEach((head, qi) => {
    const list = head.nextElementSibling;
    if (!list || list.tagName !== 'OL') return;
    const ansEl = list.nextElementSibling;
    if (!ansEl || !/^\s*Answers?:/i.test(ansEl.textContent)) return;
    const questions = Array.from(list.children);
    const answers = splitAnswers(ansEl.textContent, questions.length);
    if (!answers) return;

    const box = h('div', 'qz');
    const top = h('div', 'qz-top');
    top.appendChild(h('p', 'qz-title', 'Check yourself'));
    const score = h('p', 'qz-score');
    top.appendChild(score);
    box.appendChild(top);
    box.appendChild(h('p', 'qz-help', 'Answer in your own words first, then reveal the model answer and mark how you did.'));

    const marks = questions.map((_, i) => store.get(`${key}:q${qi}:${i}`));
    const renderScore = () => {
      const got = marks.filter((m) => m === 'y').length;
      const done = marks.filter(Boolean).length;
      score.textContent = done ? `${got} of ${questions.length} correct` : `${questions.length} questions`;
      box.classList.toggle('qz-complete', done === questions.length);
    };

    questions.forEach((li, i) => {
      const k = `${key}:q${qi}:${i}`;
      const card = h('div', 'qz-q');
      card.appendChild(h('p', 'qz-n', `Question ${i + 1}`));
      const q = h('div', 'qz-text');
      q.innerHTML = li.innerHTML;
      card.appendChild(q);

      const ta = h('textarea', 'qz-input');
      ta.rows = 2;
      ta.placeholder = 'Your answer';
      ta.setAttribute('aria-label', `Your answer to question ${i + 1}`);
      ta.value = store.get(`${k}:t`) || '';
      ta.addEventListener('input', () => store.set(`${k}:t`, ta.value || null));
      card.appendChild(ta);

      const reveal = h('button', 'qz-reveal', 'Show answer');
      reveal.type = 'button';
      const ans = h('div', 'qz-ans');
      ans.hidden = true;
      ans.appendChild(h('p', 'qz-ans-label', 'Model answer'));
      ans.appendChild(h('p', 'qz-ans-text', answers[i]));
      const self = h('div', 'qz-self');
      self.appendChild(h('span', null, 'How did you do?'));
      const yes = h('button', 'qz-mark', 'Got it');
      const no = h('button', 'qz-mark', 'Not yet');
      yes.type = 'button';
      no.type = 'button';
      const paint = () => {
        yes.classList.toggle('is-yes', marks[i] === 'y');
        no.classList.toggle('is-no', marks[i] === 'n');
        yes.setAttribute('aria-pressed', String(marks[i] === 'y'));
        no.setAttribute('aria-pressed', String(marks[i] === 'n'));
        card.classList.toggle('is-yes', marks[i] === 'y');
        card.classList.toggle('is-no', marks[i] === 'n');
      };
      const setMark = (v) => {
        marks[i] = marks[i] === v ? null : v;
        store.set(k, marks[i]);
        paint();
        renderScore();
      };
      yes.addEventListener('click', () => setMark('y'));
      no.addEventListener('click', () => setMark('n'));
      self.appendChild(yes);
      self.appendChild(no);
      ans.appendChild(self);
      const show = (open) => {
        ans.hidden = !open;
        reveal.textContent = open ? 'Hide answer' : 'Show answer';
        reveal.setAttribute('aria-expanded', String(open));
      };
      reveal.addEventListener('click', () => show(ans.hidden));
      if (marks[i]) show(true);
      paint();
      card.appendChild(reveal);
      card.appendChild(ans);
      box.appendChild(card);
    });

    renderScore();
    list.replaceWith(box);
    ansEl.remove();
  });
};

const enhanceChecklists = (container, key) => {
  const lists = new Set();
  container.querySelectorAll('li > input[type="checkbox"]').forEach((cb) => lists.add(cb.closest('ul, ol')));
  Array.from(lists).forEach((list, li) => {
    const boxes = Array.from(list.querySelectorAll(':scope > li > input[type="checkbox"]'));
    if (!boxes.length) return;
    const count = h('p', 'ck-count');
    list.parentNode.insertBefore(count, list);
    list.classList.add('ck-list');
    const update = () => {
      const n = boxes.filter((b) => b.checked).length;
      count.textContent = `${n} of ${boxes.length} done`;
      count.classList.toggle('is-done', n === boxes.length);
    };
    boxes.forEach((cb, i) => {
      const k = `${key}:c${li}:${i}`;
      cb.disabled = false;
      cb.checked = store.get(k) === '1';
      const label = cb.parentElement;
      label.classList.add('ck-item');
      cb.setAttribute('aria-label', label.textContent.trim().slice(0, 120));
      cb.addEventListener('change', () => {
        store.set(k, cb.checked ? '1' : null);
        label.classList.toggle('is-checked', cb.checked);
        update();
      });
      label.classList.toggle('is-checked', cb.checked);
    });
    update();
  });
};

const enhanceCheckpoints = (container) => {
  headingNamed(container, /^checkpoint\b/i).forEach((head) => {
    const p = head.nextElementSibling;
    if (!p || p.tagName !== 'P') return;
    const box = h('div', 'cp-box');
    box.appendChild(h('p', 'cp-label', 'Checkpoint'));
    const body = h('div');
    body.innerHTML = p.innerHTML;
    box.appendChild(body);
    p.replaceWith(box);
    head.remove();
  });
};

const enhanceCode = (container) => {
  container.querySelectorAll('pre').forEach((pre) => {
    if (pre.parentElement && pre.parentElement.classList.contains('code-wrap')) return;
    const wrap = h('div', 'code-wrap');
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);
    const btn = h('button', 'code-copy', 'Copy');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Copy code');
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText);
        btn.textContent = 'Copied';
      } catch (_) {
        btn.textContent = 'Press Ctrl+C';
      }
      setTimeout(() => (btn.textContent = 'Copy'), 1600);
    });
    wrap.appendChild(btn);
  });
};

export const enhanceCourseContent = (container, key, opts = {}) => {
  if (!container) return;
  enhanceQuizzes(container, key);
  enhanceChecklists(container, key);
  enhanceCheckpoints(container);
  enhanceCode(container);
  if (opts.runPython) enhancePython(container);
  mountLabs(container);
};

// ---- Interactive course player ----
// Self-contained HTML courses bring their own navigation, labs, and quizzes, so
// they run full-width in a frame under a slim bar with the course controls.
export const InteractivePlayer = ({ course, isDone, onBack, onComplete, next, onOpen }) => (
  <div className="flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
    <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2.5 border-b border-gray-200 bg-white">
      <button onClick={onBack} className="fd-back">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Course overview
      </button>
      <p className="hidden md:block text-sm font-semibold text-gray-900 truncate">{course.title}</p>
      <div className="flex items-center gap-2">
        {isDone ? (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
            <CheckIcon className="w-4 h-4" /> Completed
          </span>
        ) : (
          <button onClick={onComplete} className="fd-btn !py-2 !px-3 text-sm">
            <CheckIcon className="w-4 h-4" /> Mark as complete
          </button>
        )}
        {isDone && next && (
          <button onClick={() => onOpen(next.slug)} className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-2 py-2">
            Next course
          </button>
        )}
      </div>
    </div>
    <iframe title={course.title} src={course.src} className="flex-1 w-full border-0 bg-white" />
  </div>
);

// ---- Member progress: enrolment, last part, completion ----
export const useLearning = () => {
  const { currentUser } = useAuth();
  const [state, setState] = useState({ loading: true, profile: null, enrolled: {}, lastPart: {}, done: {} });

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!currentUser) {
        if (alive) setState({ loading: false, profile: null, enrolled: {}, lastPart: {}, done: {} });
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        const d = snap.exists() ? snap.data() : {};
        if (alive)
          setState({
            loading: false,
            profile: d,
            enrolled: d.learningEnrolled || {},
            lastPart: d.learningLastPart || {},
            done: d.foundationsCourses || {},
          });
      } catch (e) {
        console.error('Learning: profile load failed', e);
        if (alive) setState((s) => ({ ...s, loading: false }));
      }
    })();
    return () => {
      alive = false;
    };
  }, [currentUser]);

  const write = useCallback(
    (data) => (currentUser ? setDoc(doc(db, 'users', currentUser.uid), data, { merge: true }) : Promise.resolve()),
    [currentUser]
  );

  const isEnrolled = (track, slug) => !!(state.enrolled[track] || {})[slug];
  const isDone = (track, slug) => !!(state.done[track] || {})[slug];
  const lastPartOf = (track, slug) => (state.lastPart[track] || {})[slug] || 1;

  const enroll = async (track, slug) => {
    const at = new Date().toISOString();
    setState((s) => ({ ...s, enrolled: { ...s.enrolled, [track]: { ...(s.enrolled[track] || {}), [slug]: at } } }));
    try {
      await write({ learningEnrolled: { [track]: { [slug]: at } } });
    } catch (e) {
      console.error(e);
      toast.error('Could not enrol you. Check your connection and try again.');
    }
  };

  const saveLastPart = (track, slug, part) => {
    setState((s) => ({ ...s, lastPart: { ...s.lastPart, [track]: { ...(s.lastPart[track] || {}), [slug]: part } } }));
    write({ learningLastPart: { [track]: { [slug]: part } } }).catch(() => {});
  };

  const markComplete = async (track, slug) => {
    const trackDone = { ...(state.done[track] || {}), [slug]: true };
    const all = coursesForTrack(track).every((c) => trackDone[c.slug]);
    setState((s) => ({ ...s, done: { ...s.done, [track]: trackDone } }));
    try {
      await write({
        foundationsCourses: { [track]: { [slug]: true } },
        ...(all ? { foundationsComplete: { [track]: true } } : {}),
      });
      toast.success(all && track !== 'company' ? `You finished every ${trackMeta(track).label} course.` : 'Course marked complete.');
    } catch (e) {
      console.error(e);
      toast.error('Could not save your progress. Check your connection and try again.');
    }
  };

  return { ...state, signedIn: !!currentUser, isEnrolled, isDone, lastPartOf, enroll, saveLastPart, markComplete };
};

// ============================ Course reader ============================
// A course is shown one part at a time, with the list of parts in a sidebar
// (a collapsible list on phones). Parts come from the course's "##" headings;
// anything before the first heading becomes the "Overview" part.

const stripTrailingRules = (html) => html.replace(/(\s*<hr\s*\/?>\s*)+$/i, '').replace(/^(\s*<hr\s*\/?>\s*)+/i, '');

export const splitParts = (html, toc) => {
  const marks = [];
  const re = /<h2 id="([^"]+)">/g;
  let m;
  while ((m = re.exec(html))) marks.push({ at: m.index, id: m[1] });
  if (!marks.length) return [{ id: 'all', title: 'Overview', html }];
  const parts = [];
  const intro = stripTrailingRules(html.slice(0, marks[0].at));
  const introText = intro.replace(/<h1[^>]*>.*?<\/h1>/is, '').replace(/<[^>]+>/g, '').trim();
  let carry = '';
  if (introText.length > 500) parts.push({ id: 'overview', title: 'Overview', html: intro });
  else carry = intro; // a short intro: show it at the top of the first part instead
  marks.forEach((mk, i) => {
    const end = i + 1 < marks.length ? marks[i + 1].at : html.length;
    const t = toc.find((x) => x.id === mk.id);
    parts.push({
      id: mk.id,
      title: t ? t.text : `Part ${i + 1}`,
      html: (i === 0 ? carry : '') + stripTrailingRules(html.slice(mk.at, end)),
    });
  });
  return parts;
};

export const CourseReader = ({ course, index, total, trackLabel, backLabel, isDone, next, part, onPart, onBack, onOpen, onComplete }) => {
  const rendered = useMemo(() => renderCourse(course.markdown), [course]);
  const parts = useMemo(() => splitParts(rendered.html, rendered.toc), [rendered]);
  const current = Math.min(Math.max(part, 0), parts.length - 1);
  const isLast = current === parts.length - 1;
  const proseRef = useRef(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [listOpen, setListOpen] = useState(false);

  // New part: start at the top.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setListOpen(false);
  }, [current]);

  // Progress bar: parts finished plus how far through this part you've read.
  useEffect(() => {
    const onScroll = () => {
      const el = proseRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const span = el.offsetHeight - window.innerHeight * 0.6;
      setScrollPct(span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 1);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [current]);
  const progress = (current + scrollPct) / parts.length;

  // Turn ```mermaid blocks into diagrams. Loaded only when a part has one.
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
          const id = `mmd-${course.slug}-${current}-${i}-${Math.random().toString(36).slice(2, 8)}`;
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
  }, [current, course.slug, parts]);

  // Quizzes, checklists, checkpoints, and copy buttons for this part.
  useEffect(() => {
    enhanceCourseContent(proseRef.current, `smt-learn:${course.slug}:${parts[current] ? parts[current].id : current}`, {
      runPython: course.runnable === 'python',
    });
  }, [current, course.slug, parts]);

  const PartList = () => (
    <ol className="space-y-0.5">
      {parts.map((p, i) => (
        <li key={p.id}>
          <button
            onClick={() => onPart(i)}
            className={`fd-part ${i === current ? 'is-active' : ''} ${i < current ? 'is-past' : ''}`}
            aria-current={i === current ? 'page' : undefined}
          >
            <span className="fd-part-num" aria-hidden="true">
              {i < current ? <CheckIcon className="w-3 h-3" /> : i + 1}
            </span>
            <span className="min-w-0">{p.title}</span>
          </button>
        </li>
      ))}
    </ol>
  );

  return (
    <div>
      <div className="fd-readbar" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <button onClick={onBack} className="fd-back">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {backLabel || trackLabel}
          </button>
          <span className="text-xs text-gray-500">
            Course {index + 1} of {total}
            {course.minutes > 0 && <span className="ml-3">{formatTime(course.minutes)}</span>}
            {isDone && <span className="fd-tag fd-tag-done ml-2 align-middle">Done</span>}
          </span>
        </div>

        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-8 lg:gap-10 items-start">
          {/* Parts: sidebar on desktop */}
          <aside className="hidden lg:block fd-side" aria-label="Course parts">
            <p className="text-sm font-bold text-gray-900 px-2 leading-snug">{course.title}</p>
            <p className="text-xs text-gray-500 px-2 mt-1 mb-3">
              Part {current + 1} of {parts.length}
            </p>
            <PartList />
          </aside>

          <div className="min-w-0">
            {/* Parts: collapsible list on phones and tablets */}
            <div className="lg:hidden border border-gray-200 rounded-xl bg-white mb-6">
              <button
                onClick={() => setListOpen((o) => !o)}
                aria-expanded={listOpen}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <span className="min-w-0">
                  <span className="block text-xs text-gray-500">Part {current + 1} of {parts.length}</span>
                  <span className="block text-sm font-semibold text-gray-900 truncate">{parts[current].title}</span>
                </span>
                <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${listOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {listOpen && (
                <div className="border-t border-gray-100 px-2 py-2 max-h-80 overflow-y-auto">
                  <PartList />
                </div>
              )}
            </div>

            <article>
              <div
                ref={proseRef}
                key={parts[current].id}
                className="course-prose"
                dangerouslySetInnerHTML={{ __html: parts[current].html }}
              />

              {/* Part navigation */}
              <nav className="fd-pager" aria-label="Part navigation">
                {current > 0 ? (
                  <button onClick={() => onPart(current - 1)} className="fd-pg">
                    <span className="text-xs text-gray-500">Previous</span>
                    <span className="block font-semibold text-gray-900 mt-0.5 truncate">{parts[current - 1].title}</span>
                  </button>
                ) : (
                  <span />
                )}
                {!isLast && (
                  <button onClick={() => onPart(current + 1)} className="fd-pg fd-pg-next">
                    <span className="text-xs text-gray-500">Next</span>
                    <span className="block font-semibold text-gray-900 mt-0.5 truncate">{parts[current + 1].title}</span>
                  </button>
                )}
              </nav>

              {/* Finish line, on the last part */}
              {isLast && (
                <>
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
                      <span className="block font-semibold text-gray-900 mt-0.5">{next.title}</span>
                    </button>
                  ) : (
                    <button onClick={onBack} className="fd-next">
                      <span className="text-xs text-gray-500">That was the last course in this track</span>
                      <span className="block font-semibold text-gray-900 mt-0.5">Back to {trackLabel}</span>
                    </button>
                  )}
                </>
              )}
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

// Page styles. Accent colours come from the active track's medal ribbon via
// the --acc / --tint custom properties set on .fd-root.
export const FD_CSS = LABS_CSS + `
.fd-root { --acc:#DB2777; --tint:#FDF2F8; }
.fd-display { font-family:'Archivo Black', system-ui, sans-serif; letter-spacing:-.01em; line-height:1.1; }

.fd-rail { display:flex; gap:.6rem; overflow-x:auto; scrollbar-width:none; padding-bottom:.25rem; }
.fd-rail::-webkit-scrollbar { display:none; }
.fd-chip { display:flex; align-items:center; gap:.65rem; padding:.55rem .9rem .55rem .6rem; border-radius:.9rem;
  background:#fff; border:1.5px solid #E5E7EB; flex-shrink:0; transition:border-color .15s, background .15s; }
.fd-chip:hover { border-color:#D1D5DB; }
.fd-chip.is-active { border-color:var(--c); background:var(--t); }
.fd-chip:focus-visible, .fd-card:focus-visible, .fd-btn:focus-visible, .fd-next:focus-visible,
.fd-back:focus-visible, .fd-link:focus-visible { outline:2px solid var(--acc); outline-offset:2px; }

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
.fd-side { position:sticky; top:6rem; max-height:calc(100vh - 7.5rem); overflow-y:auto; padding-right:.25rem; }
.fd-part { display:flex; align-items:flex-start; gap:.6rem; width:100%; text-align:left; font-size:.84rem; line-height:1.35;
  color:#4B5563; padding:.5rem .6rem; border-radius:.6rem; }
.fd-part:hover { background:#F9FAFB; color:#111827; }
.fd-part.is-active { background:var(--tint); color:#111827; font-weight:600; }
.fd-part:focus-visible { outline:2px solid var(--acc); outline-offset:1px; }
.fd-part-num { width:20px; height:20px; flex-shrink:0; border-radius:999px; display:flex; align-items:center; justify-content:center;
  font-size:.68rem; font-weight:700; background:#F3F4F6; color:#6B7280; margin-top:1px; }
.fd-part.is-active .fd-part-num { background:var(--acc); color:#fff; }
.fd-part.is-past .fd-part-num { background:var(--tint); color:var(--acc); }
.fd-pager { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; margin-top:2.5rem; }
.fd-pg { display:block; min-width:0; text-align:left; padding:.9rem 1.1rem; border-radius:1rem; border:1px solid #E5E7EB; background:#fff; transition:border-color .15s; }
.fd-pg:hover { border-color:var(--acc); }
.fd-pg:focus-visible { outline:2px solid var(--acc); outline-offset:2px; }
.fd-pg-next { grid-column:2; text-align:right; }
@media (max-width:480px) { .fd-pager { grid-template-columns:1fr; } .fd-pg-next { grid-column:1; } }
.fd-finish { margin-top:2.5rem; padding:1.15rem 1.25rem; border-radius:1rem; background:var(--tint);
  display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem; }
.fd-next { display:block; width:100%; text-align:left; margin-top:1rem; padding:1rem 1.25rem; border-radius:1rem;
  border:1px solid #E5E7EB; background:#fff; transition:border-color .15s; }
.fd-next:hover { border-color:var(--acc); }

@media (prefers-reduced-motion: reduce) {
  .fd-readbar, .fd-chip, .fd-card, .fd-btn, .fd-next { transition:none; }
}


/* Interactive layer: quizzes, checklists, checkpoints, code copy */
.course-prose .qz { margin:1.5rem 0; border:1px solid #E5E7EB; border-radius:1rem; padding:1rem; background:#FAFAFA; }
.course-prose .qz-top { display:flex; justify-content:space-between; align-items:baseline; gap:1rem; }
.course-prose .qz-title { margin:0; font-weight:800; color:#111827; font-size:1.05rem; }
.course-prose .qz-score { margin:0; font-size:.85rem; font-weight:700; color:var(--acc); }
.course-prose .qz-help { margin:.25rem 0 .9rem; font-size:.88rem; color:#6B7280; }
.course-prose .qz-q { background:#fff; border:1px solid #E5E7EB; border-left:4px solid #E5E7EB; border-radius:.75rem; padding:.9rem 1rem; margin-top:.75rem; }
.course-prose .qz-q.is-yes { border-left-color:#059669; }
.course-prose .qz-q.is-no { border-left-color:#D97706; }
.course-prose .qz-n { margin:0 0 .2rem; font-size:.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:.04em; }
.course-prose .qz-text { font-weight:600; color:#111827; }
.course-prose .qz-text p { margin:0; }
.course-prose .qz-input { display:block; width:100%; margin-top:.6rem; border:1px solid #D1D5DB; border-radius:.6rem; padding:.55rem .7rem;
  font:inherit; font-size:.95rem; line-height:1.5; resize:vertical; background:#fff; color:#111827; }
.course-prose .qz-input:focus { outline:2px solid var(--acc); outline-offset:1px; border-color:transparent; }
.course-prose .qz-reveal { margin-top:.6rem; font-size:.85rem; font-weight:700; color:var(--acc); background:var(--tint); padding:.4rem .8rem; border-radius:.5rem; }
.course-prose .qz-reveal:focus-visible, .course-prose .qz-mark:focus-visible, .course-prose .code-copy:focus-visible { outline:2px solid var(--acc); outline-offset:2px; }
.course-prose .qz-ans { margin-top:.7rem; border-top:1px dashed #E5E7EB; padding-top:.6rem; }
.course-prose .qz-ans-label { margin:0; font-size:.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:.04em; }
.course-prose .qz-ans-text { margin:.2rem 0 .6rem; color:#1F2937; }
.course-prose .qz-self { display:flex; flex-wrap:wrap; align-items:center; gap:.5rem; font-size:.85rem; color:#4B5563; }
.course-prose .qz-mark { font-size:.82rem; font-weight:700; padding:.35rem .75rem; border-radius:999px; border:1px solid #D1D5DB; background:#fff; color:#374151; }
.course-prose .qz-mark.is-yes { background:#ECFDF5; border-color:#059669; color:#047857; }
.course-prose .qz-mark.is-no { background:#FFFBEB; border-color:#D97706; color:#B45309; }
.course-prose .ck-count { margin:.5rem 0 .25rem; font-size:.85rem; font-weight:700; color:var(--acc); }
.course-prose .ck-count.is-done { color:#047857; }
.course-prose .ck-list { list-style:none; padding-left:0; }
.course-prose .ck-list > li.ck-item { margin-left:0; padding:.35rem .5rem; border-radius:.5rem; }
.course-prose .ck-list > li.ck-item:hover { background:#F9FAFB; }
.course-prose .ck-list > li.is-checked { color:#6B7280; text-decoration:line-through; text-decoration-color:#9CA3AF; }
.course-prose .ck-list input[type="checkbox"] { width:1.05rem; height:1.05rem; vertical-align:-2px; cursor:pointer; }
.course-prose .cp-box { margin:1.25rem 0; background:var(--tint); border-left:4px solid var(--acc); border-radius:0 .75rem .75rem 0; padding:.8rem 1rem; }
.course-prose .cp-label { margin:0 0 .2rem; font-size:.75rem; font-weight:800; color:var(--acc); text-transform:uppercase; letter-spacing:.05em; }
.course-prose .cp-box p { margin:0; }
.course-prose .code-wrap { position:relative; }
.course-prose .code-wrap pre { padding-top:2.2rem; }
.course-prose .code-copy { position:absolute; top:.5rem; right:.5rem; font-size:.75rem; font-weight:700; color:#E9E7F5; background:rgba(255,255,255,.1);
  border:1px solid rgba(255,255,255,.2); padding:.25rem .6rem; border-radius:.4rem; }
.course-prose .code-copy:hover { background:rgba(255,255,255,.18); }

/* Course text */
.course-prose { max-width:72ch; color:#374151; font-size:16px; line-height:1.75; }
.course-prose h1 { font-family:'Archivo Black', system-ui, sans-serif; font-size:1.9rem; font-weight:400; color:#111827;
  line-height:1.15; margin:0 0 .75rem; letter-spacing:-.01em; }
.course-prose h1 + p { color:#4B5563; font-size:1.05rem; }
.course-prose > h2:first-child { margin-top:0; padding-top:0; border-top:0; }
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

