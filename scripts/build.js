// scripts/build.js
// Production build, then three extras in build/:
//  1. version.json: a build ID (also baked into the app as REACT_APP_BUILD_ID),
//     so open copies of the app, like the one installed on phones, can tell
//     when a newer version has been deployed (src/components/AppUpdateNotice).
//  2. sitemap.xml: every public page and every course, for search engines.
//  3. Pre-filled copies of index.html for those pages (e.g.
//     build/learning/TechDev/python-fundamentals-beginner-course/index.html)
//     with the page's own title and description, so search engines and link
//     previews (WhatsApp, LinkedIn, X...) see them without running the app.
//     Each copy is the full app, so people get exactly the same page.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const id = (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 12) || `b${Date.now().toString(36)}`;

const res = spawnSync('react-scripts', ['build'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, DISABLE_ESLINT_PLUGIN: 'true', REACT_APP_BUILD_ID: id },
});
if (res.status !== 0) process.exit(res.status || 1);
fs.writeFileSync(path.join(BUILD, 'version.json'), JSON.stringify({ id }) + '\n');

// ---- Pages for search engines ----
const SEO = require(path.join(ROOT, 'src', 'config', 'seoPages.json'));
const manifest = require(path.join(ROOT, 'lib', 'courseManifest.json'));
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const pages = Object.entries(SEO.pages).map(([p, m]) => ({ path: p, ...m }));
Object.entries(manifest).forEach(([key, c]) => {
  pages.push({ path: `/learning/${key}`, title: `${c.title} | She Model Tech Learning`, description: c.summary || SEO.default.description });
});

const template = fs.readFileSync(path.join(BUILD, 'index.html'), 'utf8');
const fill = (p) => {
  const url = SEO.site + (p.path === '/' ? '' : p.path);
  const t = esc(p.title);
  const d = esc(String(p.description).replace(/\s+/g, ' ').trim());
  const meta = (attr, key, value) => [new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`, 'i'), `<meta ${attr}="${key}" content="${value}">`];
  let html = template.replace(/<title>[^<]*<\/title>/i, `<title>${t}</title>`);
  [meta('name', 'description', d), meta('property', 'og:title', t), meta('property', 'og:description', d),
    meta('property', 'og:url', url), meta('name', 'twitter:title', t), meta('name', 'twitter:description', d)]
    .forEach(([re, tag]) => { html = re.test(html) ? html.replace(re, tag) : html.replace('</head>', `${tag}</head>`); });
  // index.html is also the fallback for every other page, so it gets no
  // canonical link (the app sets one per page once it loads).
  return p.path === '/' ? html : html.replace('</head>', `<link rel="canonical" href="${url}"></head>`);
};

let written = 0;
pages.forEach((p) => {
  const html = fill(p);
  if (p.path === '/') { fs.writeFileSync(path.join(BUILD, 'index.html'), html); return; }
  const dir = path.join(BUILD, ...p.path.split('/').filter(Boolean));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  written += 1;
});

const today = new Date().toISOString().slice(0, 10);
const urls = pages.map((p) => `  <url><loc>${SEO.site}${p.path === '/' ? '/' : p.path}</loc><lastmod>${today}</lastmod></url>`);
fs.writeFileSync(path.join(BUILD, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
console.log(`[build] version ${id}; sitemap with ${pages.length} pages; ${written} pre-filled pages`);
