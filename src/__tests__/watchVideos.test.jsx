// Plays every Watch video to the end, the way a learner would: press Play,
// answer any in-video question, let every scene run, then press the button
// that leads to the module quiz. Runs on GitHub before each deploy
// (.github/workflows/checks.yml), or locally with:
//   CI=true npx react-scripts test --watchAll=false src/__tests__
import React from 'react';
import fs from 'fs';
import path from 'path';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { renderCourse } from '../utils/renderCourseMarkdown';
import WatchPlayer, { parseWatchScript } from '../Pages/learning/WatchPlayer';
import { WATCH_ART } from '../Pages/learning/watchArt';

global.IS_REACT_ACT_ENVIRONMENT = true;

// Explainer scenes draw their own picture, so only the other kinds need art.
const EXPLAINERS = ['diagram', 'table', 'walk', 'array', 'chart'];

const playToEnd = async (script) => {
  const el = document.createElement('div');
  document.body.appendChild(el);
  let finished = false;
  const root = createRoot(el);
  await act(async () => {
    root.render(<WatchPlayer script={script} title="t" onFinished={() => { finished = true; }} />);
  });
  const btn = (l) => [...el.querySelectorAll('button')].find((b) => b.getAttribute('aria-label') === l || b.textContent.trim() === l);
  const end = () => btn('Take the module quiz') || btn('Finish');
  await act(async () => { btn('Play').click(); });
  for (let i = 0; i < 400 && !end(); i += 1) {
    if (el.querySelector('.wp-opt:not(:disabled)')) {
      await act(async () => { el.querySelectorAll('.wp-opt')[1].click(); });
    }
    await act(async () => { jest.advanceTimersByTime(3000); });
  }
  expect(end()).toBeTruthy();
  await act(async () => { end().click(); });
  expect(finished).toBe(true);
  await act(async () => { root.unmount(); });
  el.remove();
};

const COURSES = 'src/Pages/courses';
const files = fs.readdirSync(COURSES)
  .flatMap((t) => fs.readdirSync(path.join(COURSES, t)).filter((f) => f.endsWith('.md')).map((f) => path.join(COURSES, t, f)))
  .filter((f) => fs.readFileSync(f, 'utf8').includes('```watch'));

beforeEach(() => { jest.useFakeTimers(); });
afterEach(() => { jest.useRealTimers(); });

test.each(files)('%s: every video plays to the end', async (file) => {
  const md = fs.readFileSync(file, 'utf8');
  const expected = (md.match(/```watch/g) || []).length;
  const scripts = renderCourse(md).html.split('<h2').map(parseWatchScript).filter(Boolean);
  expect(scripts.length).toBe(expected);
  for (const s of scripts) {
    s.scenes.forEach((sc) => {
      if (!EXPLAINERS.includes(sc.kind)) expect(WATCH_ART[sc.art]).toBeTruthy();
    });
    await playToEnd(s);
  }
});

// Videos for the interactive courses (and mentors' published copies of them).
const IW = 'src/Pages/learning/interactiveWatch';
const interactive = fs.readdirSync(IW).filter((f) => f.endsWith('.json')).flatMap((f) => {
  const data = JSON.parse(fs.readFileSync(path.join(IW, f), 'utf8'));
  if (Array.isArray(data)) return data.map((s, i) => [`${f} #${i}`, s]);
  return Object.entries(data).flatMap(([slug, mods]) => Object.entries(mods).map(([t, s]) => [`${f} ${slug} "${t}"`, s]));
});

test.each(interactive)('%s plays to the end', async (_, script) => {
  await playToEnd(script);
});
