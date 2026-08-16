/* scripts/cleanupTechDev.js
 * One-off cleanup of the existing TechDev course markdown to match the newer,
 * plainer style: no "Learn:" or "Why:" labels, no "Why This Project Matters"
 * blocks, and no em-dashes. Code blocks are left untouched.
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'src', 'Pages', 'courses', 'TechDev');

const capFirst = (s) => s.replace(/^(\s*)([a-z])/, (_m, ws, ch) => ws + ch.toUpperCase());

const cleanup = (text) => {
  // Fix the shared intro sentence (removes the old "why it matters" promise + its em-dash).
  text = text.replace(
    /Instead of learning a term and then doing a project, you learn each term \*at the moment you need it\* — while building the thing\. Every step explains what you.re doing, what the term means, how to actually do it, and why it matters\./,
    'You learn each idea at the moment you need it, while building the thing.'
  );

  const lines = text.split('\n');
  const out = [];
  let inFence = false;
  let skipping = false; // inside a "Why This Project Matters" block

  for (const raw of lines) {
    let line = raw;

    // Track fenced code blocks; never transform inside them.
    if (/^\s*```/.test(line)) { inFence = !inFence; out.push(line); continue; }
    if (inFence) { out.push(line); continue; }

    // Remove "### Why This Project Matters" heading + its paragraph.
    if (!skipping && /^###\s+Why This Project Matters/i.test(line)) { skipping = true; continue; }
    if (skipping) {
      if (/^(\*\*Step|#{1,6}\s|---)/.test(line)) { skipping = false; /* process boundary line below */ }
      else { continue; }
    }

    // Drop per-step "*Why:*" lines entirely.
    if (/^\s*\*Why:\*/.test(line)) { continue; }

    // Strip the "Learn:" label, keep the definition, capitalize if it now starts with a letter.
    if (/^\s*Learn:\s*/.test(line)) {
      line = capFirst(line.replace(/^(\s*)Learn:\s*/, '$1'));
    }

    // Retitle step headers and goals that use "Learn ..." into natural, action-style titles.
    if (/^\*\*Step \d+:\s/.test(line) || /^\*\*Goal:\*\*\s/.test(line)) {
      const anchor = /^(\*\*Step \d+:\s|\*\*Goal:\*\*\s)/;
      line = line.replace(new RegExp(anchor.source + 'Learn how to (.)'), (_m, p, c) => p + c.toUpperCase());
      line = line.replace(new RegExp(anchor.source + 'Learn to (.)'), (_m, p, c) => p + c.toUpperCase());
      line = line.replace(new RegExp(anchor.source + 'Learn about '), '$1Understand ');
      line = line.replace(new RegExp(anchor.source + 'Learn '), '$1Understand ');
    }

    // Em-dash handling. Bold-label dashes and headings/steps become colons; the rest become commas.
    line = line.replace(/\*\* — /g, '**: ');
    if (/^#/.test(line) || /^\*\*Step/.test(line)) {
      line = line.replace(/ — /g, ': ');
    } else {
      line = line.replace(/ — /g, ', ');
    }

    out.push(line);
  }

  // Collapse any runs of blank lines left behind into a single blank line.
  return out.join('\n').replace(/\n{3,}/g, '\n\n');
};

const files = fs.readdirSync(DIR).filter((f) => f.toLowerCase().endsWith('.md'));
files.forEach((f) => {
  const p = path.join(DIR, f);
  fs.writeFileSync(p, cleanup(fs.readFileSync(p, 'utf8')));
});
console.log(`[cleanupTechDev] cleaned ${files.length} file(s).`);
