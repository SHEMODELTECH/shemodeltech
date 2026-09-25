// src/utils/renderCourseMarkdown.js
// Turns a course's markdown into safe HTML for display, and pulls out a table of
// contents from its "## " project headings so the reader can jump between projects.
// Uses marked (already in the tree) for parsing and DOMPurify for sanitising.

import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

const slugify = (s) =>
  (s || '')
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Render once, returning { html, toc }. toc is [{ id, text }] for each ## heading.
export const renderCourse = (markdown) => {
  if (!markdown) return { html: '', toc: [] };

  const toc = [];
  const seen = {};
  const renderer = new marked.Renderer();

  const escapeHtml = (s) => (s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Route ```mermaid fenced blocks to a container the reader turns into a real
  // flowchart. All other code blocks render normally.
  renderer.code = (code, lang) => {
    if ((lang || '').toLowerCase() === 'mermaid') {
      return `<div class="course-mermaid" data-mermaid="1">${escapeHtml(code)}</div>`;
    }
    const cls = lang ? ` class="language-${lang}"` : '';
    return `<pre><code${cls}>${escapeHtml(code)}</code></pre>`;
  };

  // "What You Learned" recap items are authored as "- ✅ ...". Tag those list
  // items so they render as a clean checklist (the check is the marker) instead
  // of showing a disc bullet next to the check.
  renderer.listitem = (text) => {
    if (/^\s*✅/.test(text)) {
      return `<li class="wyl-item">${text}</li>\n`;
    }
    return `<li>${text}</li>\n`;
  };

  renderer.heading = (text, level, raw) => {
    let id = slugify(raw);
    if (!id) id = `section-${toc.length + 1}`;
    // Guard against duplicate ids so anchor links always land in the right place.
    if (seen[id] != null) { seen[id] += 1; id = `${id}-${seen[id]}`; } else { seen[id] = 0; }
    if (level === 2) toc.push({ id, text: raw });
    return `<h${level} id="${id}">${text}</h${level}>`;
  };

  const html = marked.parse(markdown, {
    renderer,
    headerIds: false,
    mangle: false,
    breaks: false,
    gfm: true,
  });

  const clean = DOMPurify.sanitize(html, { ADD_ATTR: ['id', 'target', 'rel'] });
  return { html: clean, toc };
};
