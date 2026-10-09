// scripts/checks/content.mjs
// Fast content checks, run before every build (Vercel and GitHub). Exits with
// an error, which stops the deploy, if any course would break for learners:
//   1. Every quiz renders: an ordered list of questions followed by an
//      "Answers:" line with one answer per question.
//   2. The certificate requirements in lib/courseManifest.json match what the
//      course reader shows (the number of modules that need a summary).
//   3. Every Watch video script (```watch block) is valid JSON with scenes
//      and beats of a known kind.
// Run it yourself with: node scripts/checks/content.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const req = createRequire(path.join(ROOT, 'package.json'));
const { marked } = req('marked');
const { COURSE_CONTENT } = await import(path.join(ROOT, 'src/utils/courseContent/index.js'));
const { COURSES_BY_TRACK } = await import(path.join(ROOT, 'src/utils/foundationsCoursesData.js'));
const { renderCourse } = await import(path.join(ROOT, 'src/utils/renderCourseMarkdown.js'));

const problems = [];
const fail = (msg) => problems.push(msg);

for (const [t, cs] of Object.entries(COURSES_BY_TRACK)) for (const c of cs) {
  const load = COURSE_CONTENT[`${t}/${c.slug}`];
  if (c.hasMarkdown && !load) fail(`${t}/${c.slug}: course text is missing`);
  if (load) c.markdown = (await load()).default;
}

// ---- 1. Quizzes ----
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
let quizzes = 0;
for (const [t, list] of Object.entries(COURSES_BY_TRACK)) for (const c of list) {
  const tokens = marked.lexer(c.markdown || '');
  tokens.forEach((tk, i) => {
    if (tk.type !== 'heading' || !/^quiz\b/i.test(tk.text.trim())) return;
    let j = i + 1;
    while (tokens[j] && tokens[j].type === 'space') j++;
    const qs = tokens[j];
    j++;
    while (tokens[j] && tokens[j].type === 'space') j++;
    const ans = tokens[j];
    const where = `${t}/${c.slug} "${tk.text}"`;
    if (!qs || qs.type !== 'list' || !qs.ordered || !ans) return fail(`${where}: quiz questions aren't a numbered list followed by answers`);
    const txt = (ans.text || ans.raw).replace(/^[*_]+|[*_]+$/g, '').trim();
    if (!/^Answers?:/i.test(txt)) return fail(`${where}: no "Answers:" line after the questions`);
    quizzes++;
    const parts = splitAnswers(txt, qs.items.length);
    if (!parts || parts.some((p) => p.length < 3)) fail(`${where}: ${qs.items.length} questions but the answers don't split into ${qs.items.length} parts`);
  });
}

// ---- 2. Certificate requirements vs the reader ----
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/courseManifest.json'), 'utf8'));
const shared = fs.readFileSync(path.join(ROOT, 'src/Pages/learning/shared.jsx'), 'utf8');
const NO_SUMMARY = new RegExp(shared.match(/const NO_SUMMARY = \/(.+)\/i;/)[1], 'i');
const splitParts = (html, toc) => {
  const marks = [];
  const re = /<h2 id="([^"]+)">/g;
  let m;
  while ((m = re.exec(html))) marks.push({ at: m.index, id: m[1] });
  if (!marks.length) return [{ id: 'all', title: 'Overview', html }];
  const parts = [];
  const intro = html.slice(0, marks[0].at);
  const introText = intro.replace(/<h1[^>]*>.*?<\/h1>/is, '').replace(/<[^>]+>/g, '').trim();
  if (introText.length > 500) parts.push({ id: 'overview', title: 'Overview', html: intro });
  marks.forEach((mk, i) => {
    const tt = toc.find((x) => x.id === mk.id);
    parts.push({ id: mk.id, title: tt ? tt.text : '', html: html.slice(mk.at, i + 1 < marks.length ? marks[i + 1].at : html.length) });
  });
  return parts;
};
let courses = 0;
for (const [t, cs] of Object.entries(COURSES_BY_TRACK)) for (const c of cs) {
  if (!c.markdown) continue;
  courses++;
  const key = `${t}/${c.slug}`;
  if (!manifest[key]) { fail(`${key}: not in lib/courseManifest.json (run: npm run generate:courses)`); continue; }
  const r = renderCourse(c.markdown);
  const parts = splitParts(r.html, r.toc);
  const need = parts.filter((p) => p.id !== 'overview' && !NO_SUMMARY.test(p.title)).length;
  const exp = manifest[key].modules;
  if (need !== exp && !(parts[0].id === 'all' && exp === 1)) fail(`${key}: reader shows ${need} modules needing a summary, certificate rules expect ${exp}`);
}

// ---- 3. Watch video scripts ----
const KINDS = new Set(['title', 'list', 'quote', 'flow', 'big', 'code', 'quiz', 'diagram', 'table', 'walk', 'array', 'chart']);
const checkScript = (where, s) => {
  if (!s || !Array.isArray(s.scenes) || !s.scenes.length) return fail(`${where}: video has no scenes`);
  s.scenes.forEach((sc, i) => {
    if (!KINDS.has(sc.kind)) fail(`${where}: scene ${i + 1} has unknown kind "${sc.kind}"`);
    if (!Array.isArray(sc.beats) || !sc.beats.length || sc.beats.some((b) => !b || typeof b.say !== 'string' || !b.say.trim())) fail(`${where}: scene ${i + 1} has a beat with nothing to say`);
  });
};
let videos = 0;
for (const [t, cs] of Object.entries(COURSES_BY_TRACK)) for (const c of cs) {
  const re = /```watch\n([\s\S]*?)\n```/g;
  let m;
  let n = 0;
  while ((m = re.exec(c.markdown || ''))) {
    videos++;
    n++;
    try { checkScript(`${t}/${c.slug} video ${n}`, JSON.parse(m[1])); } catch (e) { fail(`${t}/${c.slug}: a Watch video isn't valid JSON (${e.message})`); }
  }
}
const IW = path.join(ROOT, 'src/Pages/learning/interactiveWatch');
for (const f of fs.readdirSync(IW).filter((x) => x.endsWith('.json'))) {
  let data;
  try { data = JSON.parse(fs.readFileSync(path.join(IW, f), 'utf8')); } catch (e) { fail(`interactiveWatch/${f}: not valid JSON (${e.message})`); continue; }
  if (Array.isArray(data)) data.forEach((s, i) => { videos++; checkScript(`interactiveWatch/${f} #${i}`, s); });
  else Object.entries(data).forEach(([slug, mods]) => Object.entries(mods).forEach(([title, s]) => { videos++; checkScript(`interactiveWatch/${f} ${slug} "${title}"`, s); }));
}

console.log(`Content checks: ${courses} courses, ${quizzes} quizzes, ${videos} videos.`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s) found:\n- ${problems.join('\n- ')}\n`);
  process.exit(1);
}
console.log('All content checks passed.');
