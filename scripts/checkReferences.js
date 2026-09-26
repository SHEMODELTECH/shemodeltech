/**
 * scripts/checkReferences.js
 * Checks that every course reference link still works.
 * Run from the project folder:  node scripts/checkReferences.js
 * (Needs Node 18 or newer, which has fetch built in.)
 */
const { allReferenceUrls } = require('./courseReferences');

(async () => {
  const urls = allReferenceUrls();
  let bad = 0;
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'GET', redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (link check)' } });
      if (res.status >= 400) {
        bad += 1;
        console.log(`BROKEN ${res.status}  ${url}`);
      }
    } catch (e) {
      bad += 1;
      console.log(`FAILED        ${url}  (${e.message})`);
    }
  }
  console.log(`\nChecked ${urls.length} links: ${urls.length - bad} OK, ${bad} to review.`);
  console.log('Some sites block automated checks (403); open those in a browser before removing them.');
})();
