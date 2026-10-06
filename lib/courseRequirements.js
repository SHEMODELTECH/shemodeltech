// lib/courseRequirements.js
// What a learner must finish before a course certificate is issued, worked out
// from the course text the same way the course reader splits it:
//   - modules: one per "## " section (or 1 if there are none). Each needs a
//     summary of at least 30 words (the "overview" part needs none).
//   - quizParts: modules (or the overview) containing a quiz. Each must be
//     passed with 70% or more.
// Used by scripts/generateCourses.js (to write lib/courseManifest.json for the
// built-in courses) and by the certificate endpoint (for edited and mentor courses).
const { marked } = require('marked');

const stripTags = (html) => String(html || '').replace(/<[^>]+>/g, '').trim();

const isQuizAt = (tokens, i) => {
  const t = tokens[i];
  if (!t || t.type !== 'heading' || t.depth < 2 || t.depth > 5) return false;
  if (!/^quiz\b/i.test(String(t.text || '').trim())) return false;
  let j = i + 1;
  while (tokens[j] && tokens[j].type === 'space') j += 1;
  const list = tokens[j];
  if (!list || list.type !== 'list' || !list.ordered) return false;
  j += 1;
  while (tokens[j] && tokens[j].type === 'space') j += 1;
  const ans = tokens[j];
  return !!ans && /^\s*Answers?:/i.test(stripTags(marked.parser([ans])));
};

const courseRequirements = (markdown) => {
  const tokens = marked.lexer(String(markdown || ''));
  const h2 = [];
  tokens.forEach((t, i) => { if (t.type === 'heading' && t.depth === 2) h2.push(i); });
  if (!h2.length) {
    const quiz = tokens.some((_, i) => isQuizAt(tokens, i));
    return { modules: 1, quizParts: quiz ? 1 : 0 };
  }
  // Intro before the first "## ": its own "Overview" part only when long.
  const introTokens = tokens.slice(0, h2[0]).filter((t) => !(t.type === 'heading' && t.depth === 1));
  const introLong = stripTags(marked.parser(introTokens.length ? introTokens : [])).length > 500;
  const partHasQuiz = h2.map((start, k) => {
    const end = k + 1 < h2.length ? h2[k + 1] : tokens.length;
    for (let i = start; i < end; i += 1) if (isQuizAt(tokens, i)) return true;
    return false;
  });
  let introQuiz = false;
  for (let i = 0; i < h2[0]; i += 1) if (isQuizAt(tokens, i)) introQuiz = true;
  let quizParts = partHasQuiz.filter(Boolean).length;
  if (introQuiz) {
    if (introLong) quizParts += 1; // the overview part has a quiz
    else if (!partHasQuiz[0]) quizParts += 1; // merged into the first module
  }
  return { modules: h2.length, quizParts };
};

// Short readable code printed on a certificate (same as the website's).
const certificateCode = (id) => {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < id.length; i += 1) {
    h1 = Math.imul(h1 ^ id.charCodeAt(i), 16777619) >>> 0;
    h2 = Math.imul(h2 ^ id.charCodeAt(id.length - 1 - i), 2246822519) >>> 0;
  }
  const code = (h1.toString(36) + h2.toString(36)).toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(8, '0').slice(0, 8);
  return `SMT-${code.slice(0, 4)}-${code.slice(4, 8)}`;
};

const certificateId = (uid, track, slug) => `${uid}_${track}_${slug}`.replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 400);

module.exports = { courseRequirements, certificateCode, certificateId };
