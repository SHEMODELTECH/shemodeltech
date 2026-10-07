/* scripts/generateCourses.js
 *
 * Scans src/Pages/courses/<Track>/*.md and emits src/utils/foundationsCoursesData.js,
 * the data module the Foundations page reads from. This is what makes courses "pulled
 * from the folder": drop a new .md into a track folder and it shows up on next build.
 *
 * Runs automatically before `npm start` and `npm run build` (see package.json prestart
 * / prebuild). You can also run it by hand: `node scripts/generateCourses.js`.
 *
 * Per-file metadata is derived from the markdown itself:
 *   title    -> the first "# " heading
 *   summary  -> the first normal paragraph after the title
 *   projects -> count of "## " sections
 * Optional ordering: put an HTML comment "<!-- order: 2 -->" near the top of a file to
 * control where it appears in its track. Files without an order sort after ordered ones,
 * alphabetically.
 */

const fs = require('fs');
const path = require('path');
const { referencesFor } = require('./courseReferences');
const { courseRequirements } = require('../lib/courseRequirements');

const COURSES_DIR = path.join(__dirname, '..', 'src', 'Pages', 'courses');
const OUT_FILE = path.join(__dirname, '..', 'src', 'utils', 'foundationsCoursesData.js');

// The first "# " heading outside code blocks (a "# comment" in code isn't a title).
const firstHeading = (md) => {
  let inFence = false;
  for (const line of md.split('\n')) {
    if (/^\s*```/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = line.match(/^#\s+(.+?)\s*$/);
    if (m) return m[1].trim();
  }
  return null;
};

const firstParagraph = (md) => {
  const lines = md.split('\n');
  let seenTitle = false;
  let skipping = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!seenTitle) {
      if (line.startsWith('# ')) seenTitle = true;
      continue;
    }
    if (!line) continue;
    // The setup section describes the tools, not the course: skip it.
    if (/^##\s+Before you start/i.test(line)) { skipping = true; continue; }
    if (skipping) { if (/^##\s+/.test(line)) skipping = false; else continue; }
    // Skip headings, rules, list markers, code fences, blockquotes.
    if (/^(#|---|\*\*\*|```|>|[-*+]\s|\d+\.\s)/.test(line)) continue;
    // Setup notes and document boilerplate don't describe the course.
    if (/^\*\*(Tools needed|Prerequisites|Time)/i.test(line)) continue;
    if (/^(This (document|is a bonus|course turns|course is a series)|Follow the projects in order|Every step follows|(\*\*)?A note on)/i.test(line)) continue;
    // A one-line generic purpose ("Plan, build, and deliver...") is shared by a
    // whole track, so it doesn't tell courses apart; use the next paragraph.
    if (/^\*\*Purpose[^*]*:\*\*/i.test(line) && line.replace(/^\*\*Purpose[^*]*:\*\*\s*/i, '')
      .replace(/^\*\*Who this is for:\*\*\s*(\w)/i, (m, c) => 'For ' + c.toLowerCase())
      .replace(/^\*\*Goal:\*\*\s*/i, '').length < 60) continue;
    // Strip simple markdown so the card summary reads cleanly.
    const clean = line
      .replace(/^\*\*Purpose[^*]*:\*\*\s*/i, '')
      .replace(/^\*\*Who this is for:\*\*\s*(\w)/i, (m, c) => 'For ' + c.toLowerCase())
      .replace(/^\*\*Goal:\*\*\s*/i, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '').trim();
    return clean.length > 240 ? clean.slice(0, 237).trimEnd() + '...' : clean;
  }
  return '';
};

// Shift every heading up one level (## -> #, ### -> ##, ...), outside code fences.
// Only the first "##" becomes the title; later "##" headings (such as a
// "Completion Checklist") stay as sections.
const promoteHeadings = (md) => {
  let inFence = false;
  let titleDone = false;
  return md
    .split('\n')
    .map((line) => {
      if (/^\s*```/.test(line)) inFence = !inFence;
      if (inFence) return line;
      if (/^##\s/.test(line)) {
        if (!titleDone) {
          titleDone = true;
          return line.slice(1);
        }
        return line;
      }
      if (/^#{3,6}\s/.test(line)) return line.slice(1);
      return line;
    })
    .join('\n');
};

// "Module 1: QA Fundamentals" -> "QA Fundamentals"; "Module: APIs" -> "APIs".
// Also drops track-code suffixes: "Agile (TechPO: Product & ...)" -> "Agile",
// and "TechLeads (Business & Leadership)" -> "Business & Leadership".
const cleanCourseTitle = (t) => {
  if (!t) return t;
  let x = t.replace(/^Module(\s+\d+)?\s*:\s*/i, '').trim();
  const whole = x.match(/^Tech\w+\s*\(([^)]+)\)$/);
  if (whole) return whole[1].trim();
  x = x.replace(/\s*\((Low-Code \/ No-Code )?Tech\w+[^)]*\)\s*$/, '').trim();
  x = x.replace(/:\s*A Practical Beginner's Course\s*$/i, '').replace(/:\s*Hands-?On Project Tutorials\s*$/i, '').trim();
  // "TechQA: A Practical Beginner's Course" leaves just the track code.
  if (/^Tech\w+$/.test(x)) return 'Start here: course overview';
  return x;
};

// Level shown on the course card, read from the authored title.
const courseLevel = (t) =>
  /advanced/i.test(t) ? 'Advanced' : /beginner/i.test(t) ? 'Beginner' : /hands-?on/i.test(t) ? 'Project-based' : '';

const prettySlug = (slug) =>
  slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// Rough time to complete: reading at ~200 words a minute, plus ~30 minutes for
// each section with hands-on work (a lab, numbered steps, or an exercise).
// When a course states its own times ("**Time: about 2 hours**", one per "## "
// section, or one for the whole course), the card shows their sum instead.
const TIME_RE = /\*\*Time(?: estimate)?:?\*?\*?:?\s*(?:about\s*)?(\d+(?:\.\d+)?)(?:\s*(?:-|to|–)\s*(\d+(?:\.\d+)?))?\s*(hours?|hrs?|minutes?|mins?)?/i;
const timeOf = (line) => {
  const m = line && line.match(TIME_RE);
  if (!m) return null;
  const a = parseFloat(m[1]);
  const b = m[2] ? parseFloat(m[2]) : a;
  return ((a + b) / 2) * (/^min/i.test(m[3] || 'hours') ? 1 : 60);
};
const authoredMinutes = (md) => {
  let inFence = false;
  const lines = md.split('\n').filter((l) => {
    if (/^\s*```/.test(l)) { inFence = !inFence; return false; }
    return !inFence;
  });
  const isTime = (l) => /\*\*Time(?: estimate)?:?/i.test(l) && timeOf(l) != null;
  let total = 0;
  let found = 0;
  lines.join('\n').split(/^##\s+/m).slice(1).forEach((s) => {
    const line = s.split('\n').find(isTime);
    if (!line || /total/i.test(line)) return;
    total += timeOf(line);
    found += 1;
  });
  if (!found) {
    const first = lines.find(isTime);
    if (!first) return null;
    total = timeOf(first);
  }
  return Math.max(10, Math.round(total / 15) * 15);
};

const estimateMinutes = (md) => {
  const authored = authoredMinutes(md);
  if (authored) return authored;
  const words = md.split(/\s+/).filter(Boolean).length;
  const sections = md.split(/^##\s+/m).slice(1);
  const practical = sections.filter((s) => /(\bLab\b|\*\*Step \d|Practical exercise|Hands-on)/i.test(s)).length;
  const raw = words / 200 + practical * 30;
  return Math.max(10, Math.round(raw / 15) * 15);
};


// ---- Interactive courses ----
// A self-contained .html course in a track folder (its own navigation, labs,
// and quizzes) is published as-is to public/interactive/<slug>.html and listed
// in the catalog. Metadata comes from its COURSE / PARTS / MODULES constants;
// order and level come from comments in its <head>:
//   <!-- order: 13 -->  <!-- level: Beginner -->
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'interactive');

const readInteractive = (fullPath, file, track) => {
  const html = fs.readFileSync(fullPath, 'utf8');
  const slug = file.replace(/\.html$/i, '');
  let meta = null;
  try {
    const a = html.indexOf('const COURSE=');
    const m = html.indexOf('const MODULES=');
    // MODULES is an array literal; take it up to its closing "];" at depth 0.
    let i = html.indexOf('[', m), depth = 0, inStr = null, esc = false;
    for (; i < html.length; i++) {
      const ch = html[i];
      if (inStr) {
        if (esc) esc = false;
        else if (ch === '\\') esc = true;
        else if (ch === inStr) inStr = null;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') inStr = ch;
      else if (ch === '[') depth++;
      else if (ch === ']' && --depth === 0) break;
    }
    const src = html.slice(a, i + 1) + ';return {COURSE,PARTS,MODULES};';
    // eslint-disable-next-line no-new-func
    meta = new Function(src)();
  } catch (e) {
    console.warn(`[generateCourses] ${file}: could not read course data (${e.message}); using the page title.`);
  }
  const titleTag = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || prettySlug(slug);
  const modules = meta ? meta.MODULES.map((x) => ({ title: x.title, part: x.part, mins: x.mins || 0 })) : [];
  const levelM = html.match(/<!--\s*level:\s*([^>]+?)\s*-->/i);
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.copyFileSync(fullPath, path.join(PUBLIC_DIR, `${slug}.html`));
  return {
    slug,
    kind: 'interactive',
    src: `/interactive/${slug}.html`,
    title: meta ? meta.COURSE.title : titleTag.replace(/\s+[—-].*$/, ''),
    level: levelM ? levelM[1] : '',
    summary: meta ? `${meta.COURSE.headline}. ${meta.COURSE.intro}` : '',
    projects: modules.length,
    minutes: modules.reduce((n, x) => n + x.mins, 0),
    parts: meta ? meta.PARTS : [],
    modules: modules.map(({ title, part }) => ({ title, part })),
    order: readOrder(html),
    references: referencesFor(track, html.replace(/<style[\s\S]*?<\/style>/gi, ' ')),
    markdown: '',
  };
};

const readOrder = (md) => {
  const m = md.match(/<!--\s*order:\s*(\d+)\s*-->/i);
  return m ? parseInt(m[1], 10) : null;
};

const countProjects = (md) => {
  const m = md.match(/^##\s+/gm);
  return m ? m.length : 0;
};

const build = () => {
  const result = {};
  if (!fs.existsSync(COURSES_DIR)) {
    fs.writeFileSync(OUT_FILE, moduleText({}));
    console.log('[generateCourses] no courses dir; wrote empty data module.');
    return;
  }
  const tracks = fs.readdirSync(COURSES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  tracks.forEach((track) => {
    const dir = path.join(COURSES_DIR, track);
    const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.md'));
    const htmlFiles = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.html'));
    const interactive = htmlFiles.map((file) => readInteractive(path.join(dir, file), file, track)).filter(Boolean);
    const courses = files.map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const slug = file.replace(/\.md$/i, '');
      // Some courses are written as a single "## Module ..." document with
      // "### Topic" sections and no "# " title. Promote their headings one
      // level so every course reads the same: one title, then the sections
      // that fill the reader's contents list.
      const md = firstHeading(raw) ? raw : promoteHeadings(raw);
      return {
        slug,
        title: cleanCourseTitle(firstHeading(md)) || prettySlug(slug),
        // A <!-- level: X --> comment wins; otherwise read it from the title;
        // courses that say neither are introductory, so they count as Beginner.
        level: ((md.match(/<!--\s*level:\s*([^>]+?)\s*-->/i) || [])[1]) || courseLevel(firstHeading(md) || '') || 'Beginner',
        summary: firstParagraph(md),
        projects: countProjects(md),
        minutes: estimateMinutes(md),
        order: readOrder(md),
        references: referencesFor(track, md),
        // <!-- certificate: none --> marks an orientation page: it can be completed but gives no certificate.
        ...(/<!--\s*certificate:\s*none\s*-->/i.test(md) ? { noCertificate: true } : {}),
        ...((md.match(/<!--\s*runnable:\s*(python|html)\s*-->/i) || [])[1] ? { runnable: md.match(/<!--\s*runnable:\s*(python|html)\s*-->/i)[1].toLowerCase() } : {}),
        markdown: md,
      };
    });
    courses.push(...interactive);
    courses.sort((a, b) => {
      const ao = a.order == null ? Infinity : a.order;
      const bo = b.order == null ? Infinity : b.order;
      if (ao !== bo) return ao - bo;
      return a.title.localeCompare(b.title);
    });
    // Drop the internal `order` field from the shipped data; it has done its job.
    if (courses.length) result[track] = courses.map(({ order, ...c }) => c);
  });

  fs.writeFileSync(OUT_FILE, moduleText(result));
  // A tiny summary for pages (like the front page) that only need counts, so
  // they don't pull every course's full text into their download.
  const learnerCourses = Object.entries(result)
    .filter(([t]) => !['company', 'start'].includes(t))
    .reduce((n, [, list]) => n + list.length, 0);
  fs.writeFileSync(
    path.join(__dirname, '..', 'src', 'utils', 'foundationsCoursesMeta.js'),
    `// Generated by scripts/generateCourses.js - do not edit by hand.\n` +
      `export const COURSE_COUNT = ${learnerCourses};\n` +
      `export const TRACK_COUNT = ${Object.keys(result).filter((t) => !['company', 'start'].includes(t)).length};\n`
  );
  // What each built-in course needs for a certificate, for the server
  // (lib/courseManifest.json is read by api/notifications/[type].js).
  const TRACK_LABELS = {
    TechDev: 'Coding Developer', TechArchs: 'Low/No-Code Developer', TechQA: 'Quality Tester',
    TechGuard: 'Network & Cybersecurity', TechPO: 'Product / Project Owner', TechLeads: 'Non-Technical Roles',
    company: 'Understanding Badges', start: 'Start here',
  };
  const manifest = {};
  Object.entries(result).forEach(([track, list]) => list.forEach((c) => {
    const req = c.kind === 'interactive' ? { modules: 0, quizParts: 0 } : courseRequirements(c.markdown);
    manifest[`${track}/${c.slug}`] = {
      title: c.title, level: c.level || '', minutes: c.minutes || 0, trackLabel: TRACK_LABELS[track] || track,
      kind: c.kind || 'markdown', modules: req.modules, quizParts: req.quizParts,
      ...(c.noCertificate ? { noCertificate: true } : {}),
    };
  }));
  fs.writeFileSync(path.join(__dirname, '..', 'lib', 'courseManifest.json'), JSON.stringify(manifest, null, 1) + '\n');
  const total = Object.values(result).reduce((n, arr) => n + arr.length, 0);
  console.log(`[generateCourses] wrote ${total} course(s) across ${Object.keys(result).length} track(s).`);
};

const moduleText = (obj) =>
  '// AUTO-GENERATED by scripts/generateCourses.js. Do not edit by hand.\n' +
  '// Edit the .md files under src/Pages/courses/<Track>/ instead, then rebuild.\n\n' +
  'export const COURSES_BY_TRACK = ' + JSON.stringify(obj, null, 2) + ';\n';

build();
