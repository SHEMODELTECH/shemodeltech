// scripts/build.js
// Production build with a build ID, so open copies of the app (especially the
// one installed on phones) can tell when a newer version has been deployed.
// The ID is baked into the app (REACT_APP_BUILD_ID) and written to
// build/version.json; the app compares the two from time to time.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const id = (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 12) || `b${Date.now().toString(36)}`;
const res = spawnSync('react-scripts', ['build'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, DISABLE_ESLINT_PLUGIN: 'true', REACT_APP_BUILD_ID: id },
});
if (res.status !== 0) process.exit(res.status || 1);
fs.writeFileSync(path.join(__dirname, '..', 'build', 'version.json'), JSON.stringify({ id }) + '\n');
console.log(`[build] version ${id}`);
