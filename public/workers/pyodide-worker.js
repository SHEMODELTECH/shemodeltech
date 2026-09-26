/* public/workers/pyodide-worker.js
 * Runs learners' Python off the main thread, so an endless loop or heavy
 * computation can never freeze the page. The page stops a run that takes too
 * long by terminating this worker and starting a fresh one.
 */
/* global loadPyodide, importScripts */
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
let ready = null;

const boot = () => {
  if (!ready) {
    ready = (async () => {
      importScripts(`${PYODIDE_URL}pyodide.js`);
      const py = await loadPyodide({ indexURL: PYODIDE_URL });
      // No keyboard in a worker: input() returns an empty string.
      py.setStdin({ stdin: () => '' });
      return py;
    })();
  }
  return ready;
};

self.onmessage = async (e) => {
  const { id, code, fileName } = e.data || {};
  let out = '';
  try {
    const py = await boot();
    py.setStdout({ batched: (s) => (out += `${s}\n`) });
    py.setStderr({ batched: (s) => (out += `${s}\n`) });
    if (fileName) {
      py.FS.writeFile(fileName, code);
      await py.runPythonAsync('import importlib; importlib.invalidate_caches()');
    }
    await py.runPythonAsync(code);
    self.postMessage({ id, ok: true, out });
  } catch (err) {
    const msg = String((err && err.message) || err);
    // Python itself failed to download: allow a clean retry next time.
    if (/importScripts|failed to load|NetworkError|loadPyodide/i.test(msg)) ready = null;
    self.postMessage({ id, ok: false, out, error: msg, loadFailed: ready === null });
  }
};
