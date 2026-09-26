// src/Pages/learning/labs.js
// Hands-on labs inside written courses.
//
// 1. Lab blocks. A course author writes a fenced block with the language "lab"
//    and a JSON config; the reader turns it into an activity:
//
//      ```lab
//      { "type": "order", "title": "Put the SDLC in order",
//        "items": ["Requirements", "Design", "Development"] }
//      ```
//      ```lab
//      { "type": "sort", "title": "What type is each value?",
//        "buckets": ["str", "int"],
//        "items": [{ "text": "\"12\"", "bucket": "str", "why": "Quotes make it text." }] }
//      ```
//
//    "order": put items in the right sequence (items listed in the correct order).
//    "sort":  put each item in the right group, with an explanation per item.
//
// 2. Runnable Python. Courses marked <!-- runnable: python --> turn every
//    ```python block into an editable cell with a Run button, using Pyodide
//    (Python compiled for the browser), loaded only when someone presses Run.
//    A block whose first line is "# name.py" is also saved as that file, so a
//    later block can import it. Blocks that need the internet (requests) or a
//    package Pyodide doesn't ship say so instead of offering Run.

const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const btn = (cls, text) => {
  const b = el('button', cls, text);
  b.type = 'button';
  return b;
};

// Shuffle that never returns the original order (when there are 2+ items).
const shuffled = (arr) => {
  if (arr.length < 2) return arr.slice();
  let out;
  do {
    out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
  } while (out.every((x, i) => x === arr[i]));
  return out;
};

// ---------- Order lab ----------
const orderLab = (cfg) => {
  const root = el('div', 'lab');
  root.appendChild(el('p', 'lab-kicker', 'Try it'));
  root.appendChild(el('p', 'lab-title', cfg.title || 'Put these in order'));
  if (cfg.prompt) root.appendChild(el('p', 'lab-prompt', cfg.prompt));
  const list = el('ol', 'lab-order');
  const msg = el('p', 'lab-msg');
  msg.setAttribute('role', 'status');
  let current = shuffled(cfg.items);

  const draw = (checked) => {
    list.innerHTML = '';
    current.forEach((text, i) => {
      const li = el('li', 'lab-order-item');
      if (checked) li.classList.add(text === cfg.items[i] ? 'is-right' : 'is-wrong');
      li.appendChild(el('span', 'lab-order-n', String(i + 1)));
      li.appendChild(el('span', 'lab-order-text', text));
      const up = btn('lab-move', '\u2191');
      const down = btn('lab-move', '\u2193');
      up.setAttribute('aria-label', `Move "${text}" up`);
      down.setAttribute('aria-label', `Move "${text}" down`);
      up.disabled = i === 0;
      down.disabled = i === current.length - 1;
      const move = (d) => {
        const j = i + d;
        [current[i], current[j]] = [current[j], current[i]];
        msg.textContent = '';
        draw(false);
        list.querySelectorAll('.lab-move')[j * 2 + (d < 0 ? 0 : 1)]?.focus();
      };
      up.addEventListener('click', () => move(-1));
      down.addEventListener('click', () => move(1));
      li.appendChild(up);
      li.appendChild(down);
      list.appendChild(li);
    });
  };

  const actions = el('div', 'lab-actions');
  const check = btn('lab-btn lab-primary', 'Check my order');
  const reset = btn('lab-btn', 'Shuffle again');
  const show = btn('lab-btn', 'Show the answer');
  check.addEventListener('click', () => {
    draw(true);
    const right = current.filter((t, i) => t === cfg.items[i]).length;
    msg.textContent =
      right === current.length
        ? cfg.success || 'All in the right order. Well done.'
        : `${right} of ${current.length} are in the right place. Move the red ones and check again.`;
    msg.className = `lab-msg ${right === current.length ? 'is-right' : 'is-wrong'}`;
  });
  reset.addEventListener('click', () => {
    current = shuffled(cfg.items);
    msg.textContent = '';
    draw(false);
  });
  show.addEventListener('click', () => {
    current = cfg.items.slice();
    draw(true);
    msg.textContent = cfg.explain || 'This is the correct order.';
    msg.className = 'lab-msg';
  });
  actions.append(check, reset, show);
  root.append(list, actions, msg);
  draw(false);
  return root;
};

// ---------- Sort lab ----------
const sortLab = (cfg) => {
  const root = el('div', 'lab');
  root.appendChild(el('p', 'lab-kicker', 'Try it'));
  root.appendChild(el('p', 'lab-title', cfg.title || 'Sort each item'));
  if (cfg.prompt) root.appendChild(el('p', 'lab-prompt', cfg.prompt));
  const items = shuffled(cfg.items);
  const picks = items.map(() => null);
  const rows = el('div', 'lab-sort');
  const msg = el('p', 'lab-msg');
  msg.setAttribute('role', 'status');

  items.forEach((it, i) => {
    const row = el('div', 'lab-sort-row');
    const text = el('p', 'lab-sort-text');
    if (it.code) {
      const c = el('code', null, it.text);
      text.appendChild(c);
    } else text.textContent = it.text;
    row.appendChild(text);
    const group = el('div', 'lab-sort-opts');
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', `Choose a group for: ${it.text}`);
    const why = el('p', 'lab-sort-why');
    why.hidden = true;
    cfg.buckets.forEach((b) => {
      const o = btn('lab-opt', b);
      o.setAttribute('aria-pressed', 'false');
      o.addEventListener('click', () => {
        picks[i] = b;
        group.querySelectorAll('.lab-opt').forEach((x) => {
          x.classList.toggle('is-picked', x === o);
          x.setAttribute('aria-pressed', String(x === o));
          x.classList.remove('is-right', 'is-wrong');
        });
        row.classList.remove('is-right', 'is-wrong');
        why.hidden = true;
        msg.textContent = '';
      });
      group.appendChild(o);
    });
    row.append(group, why);
    rows.appendChild(row);
    it._row = row;
    it._why = why;
    it._group = group;
  });

  const actions = el('div', 'lab-actions');
  const check = btn('lab-btn lab-primary', 'Check my answers');
  check.addEventListener('click', () => {
    let right = 0;
    let answered = 0;
    items.forEach((it, i) => {
      if (!picks[i]) return;
      answered += 1;
      const ok = picks[i] === it.bucket;
      if (ok) right += 1;
      it._row.classList.toggle('is-right', ok);
      it._row.classList.toggle('is-wrong', !ok);
      it._group.querySelectorAll('.lab-opt').forEach((x) => {
        if (x.textContent === picks[i]) x.classList.add(ok ? 'is-right' : 'is-wrong');
      });
      it._why.hidden = false;
      it._why.textContent = ok ? it.why || 'Correct.' : `Not quite: this one is "${it.bucket}". ${it.why || ''}`.trim();
    });
    if (answered < items.length) {
      msg.textContent = `You've answered ${answered} of ${items.length}. ${right} correct so far; finish the rest and check again.`;
      msg.className = 'lab-msg';
    } else {
      msg.textContent =
        right === items.length ? cfg.success || `All ${items.length} correct. Well done.` : `${right} of ${items.length} correct. Read the notes on the ones marked red.`;
      msg.className = `lab-msg ${right === items.length ? 'is-right' : 'is-wrong'}`;
    }
  });
  actions.appendChild(check);
  root.append(rows, actions, msg);
  return root;
};


// ---------- Hash lab (SHA-256, in the browser) ----------
const sha256 = async (text) => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
};
const hashLab = (cfg) => {
  const root = el('div', 'lab');
  root.appendChild(el('p', 'lab-kicker', 'Try it'));
  root.appendChild(el('p', 'lab-title', cfg.title || 'See hashing happen'));
  root.appendChild(el('p', 'lab-prompt', cfg.prompt || 'Change one character in either box and watch the SHA-256 hash change completely.'));
  const inputs = (cfg.inputs || ['hello', 'hellp']).map((v, i) => {
    const wrap = el('div', 'lab-hash');
    const lab = el('label', 'lab-field-label', `Input ${i + 1}`);
    const inp = el('input', 'lab-input');
    inp.value = v;
    inp.id = `hash-${Math.random().toString(36).slice(2, 8)}`;
    lab.htmlFor = inp.id;
    const out = el('code', 'lab-hash-out');
    wrap.append(lab, inp, el('p', 'lab-field-label', 'SHA-256 hash'), out);
    root.appendChild(wrap);
    return { inp, out };
  });
  const msg = el('p', 'lab-msg');
  msg.setAttribute('role', 'status');
  root.appendChild(msg);
  const update = async () => {
    if (!window.crypto || !crypto.subtle) {
      msg.textContent = 'Your browser blocks hashing on this page. Try a current version of Chrome, Edge, Safari, or Firefox.';
      return;
    }
    const hs = await Promise.all(inputs.map(({ inp }) => sha256(inp.value)));
    inputs.forEach(({ out }, i) => (out.textContent = hs[i]));
    if (hs.length === 2) {
      const diff = hs[0].split('').filter((c, i) => c !== hs[1][i]).length;
      msg.textContent =
        inputs[0].inp.value === inputs[1].inp.value
          ? 'Same input, same hash, every time. That is how a system checks a password without storing it.'
          : `The inputs differ, and ${diff} of the 64 hash characters changed. You can't work backwards from a hash to the input.`;
    }
  };
  inputs.forEach(({ inp }) => inp.addEventListener('input', update));
  update();
  return root;
};

// ---------- Password strength lab ----------
const COMMON = ['password', '123456', '12345678', 'qwerty', 'letmein', 'admin', 'welcome', 'iloveyou', 'monkey', 'dragon', 'football', 'abc123', 'passw0rd', 'sunshine', 'princess'];
const fmtTime = (sec) => {
  if (sec < 1) return 'instantly';
  const units = [['year', 31536000], ['day', 86400], ['hour', 3600], ['minute', 60], ['second', 1]];
  if (sec > 31536000 * 1e6) return 'more than a million years';
  for (const [n, s] of units) if (sec >= s) { const v = Math.round(sec / s); return `about ${v.toLocaleString()} ${n}${v === 1 ? '' : 's'}`; }
  return 'instantly';
};
const passwordLab = (cfg) => {
  const root = el('div', 'lab');
  root.appendChild(el('p', 'lab-kicker', 'Try it'));
  root.appendChild(el('p', 'lab-title', cfg.title || 'How long would it take to crack?'));
  root.appendChild(el('p', 'lab-prompt', 'Type a made-up password (never a real one) and see how its length and variety change the estimate. Nothing you type leaves this page.'));
  const inp = el('input', 'lab-input');
  inp.type = 'text';
  inp.value = cfg.start || 'sunshine1';
  inp.setAttribute('aria-label', 'Made-up password to test');
  inp.autocomplete = 'off';
  const meter = el('div', 'lab-meter');
  const bar = el('div', 'lab-meter-bar');
  meter.appendChild(bar);
  const verdict = el('p', 'lab-msg');
  verdict.setAttribute('role', 'status');
  const facts = el('ul', 'lab-facts');
  root.append(inp, meter, verdict, facts);
  const update = () => {
    const p = inp.value;
    let pool = 0;
    const kinds = [];
    if (/[a-z]/.test(p)) { pool += 26; kinds.push('lowercase'); }
    if (/[A-Z]/.test(p)) { pool += 26; kinds.push('uppercase'); }
    if (/[0-9]/.test(p)) { pool += 10; kinds.push('numbers'); }
    if (/[^a-zA-Z0-9]/.test(p)) { pool += 33; kinds.push('symbols'); }
    let bits = p.length && pool ? p.length * Math.log2(pool) : 0;
    const lower = p.toLowerCase();
    const flags = [];
    if (COMMON.some((c) => lower.includes(c))) { bits = Math.min(bits, 12); flags.push('contains a very common password, which attackers try first'); }
    if (/^(.)\1+$/.test(p)) { bits = Math.min(bits, 6); flags.push('is one character repeated'); }
    if (/(0123|1234|2345|3456|4567|5678|6789|abcd|qwer)/i.test(p)) { bits -= 10; flags.push('contains a common sequence'); }
    if (/(19|20)\d\d/.test(p)) { bits -= 6; flags.push('contains what looks like a year'); }
    bits = Math.max(0, bits);
    const seconds = Math.pow(2, bits) / 2 / 1e10;
    const levels = [[28, 'Very weak', '#DC2626'], [36, 'Weak', '#EA580C'], [60, 'Fair', '#CA8A04'], [80, 'Strong', '#16A34A'], [Infinity, 'Very strong', '#047857']];
    const [, label, color] = levels.find(([max]) => bits < max);
    bar.style.width = `${Math.min(100, (bits / 100) * 100)}%`;
    bar.style.background = color;
    const when = seconds < 1 ? 'cracked instantly' : `cracked in ${fmtTime(seconds)}`;
    verdict.textContent = p ? `${label}: ${when} by an attacker guessing 10 billion passwords a second.` : 'Type something to test.';
    facts.innerHTML = '';
    if (p) {
      [`${p.length} characters, using ${kinds.join(', ') || 'no letters or numbers'}`, ...flags.map((f) => `It ${f}`)].forEach((t) => facts.appendChild(el('li', null, t)));
      facts.appendChild(el('li', null, 'Length matters most: adding four random words usually beats swapping letters for symbols. MFA protects you even if a password leaks.'));
    }
  };
  inp.addEventListener('input', update);
  update();
  return root;
};

// ---------- RICE prioritisation lab ----------
const riceLab = (cfg) => {
  const root = el('div', 'lab');
  root.appendChild(el('p', 'lab-kicker', 'Try it'));
  root.appendChild(el('p', 'lab-title', cfg.title || 'Prioritise with RICE'));
  root.appendChild(el('p', 'lab-prompt', cfg.prompt || 'Adjust the numbers and watch the ranking change. RICE score = Reach × Impact × Confidence ÷ Effort.'));
  const rows = cfg.items.map((it) => ({ ...it }));
  const table = el('div', 'lab-rice');
  const result = el('ol', 'lab-rice-rank');
  result.setAttribute('aria-live', 'polite');
  const fields = [
    ['reach', 'Reach (people / quarter)', 1, 100000, 10],
    ['impact', 'Impact (0.25 to 3)', 0.25, 3, 0.25],
    ['confidence', 'Confidence (%)', 10, 100, 10],
    ['effort', 'Effort (person-weeks)', 0.5, 52, 0.5],
  ];
  const score = (r) => (r.reach * r.impact * (r.confidence / 100)) / Math.max(r.effort, 0.1);
  const rank = () => {
    result.innerHTML = '';
    rows
      .map((r) => ({ r, s: score(r) }))
      .sort((a, b) => b.s - a.s)
      .forEach(({ r, s }) => {
        const li = el('li', 'lab-rice-item');
        li.append(el('span', 'lab-rice-name', r.name), el('span', 'lab-rice-score', Math.round(s).toLocaleString()));
        result.appendChild(li);
      });
  };
  rows.forEach((r, ri) => {
    const card = el('fieldset', 'lab-rice-card');
    card.appendChild(el('legend', 'lab-rice-name', r.name));
    fields.forEach(([k, label, min, max, step]) => {
      const id = `rice-${ri}-${k}-${Math.random().toString(36).slice(2, 6)}`;
      const l = el('label', 'lab-field-label', label);
      l.htmlFor = id;
      const inp = el('input', 'lab-input lab-input-sm');
      Object.assign(inp, { type: 'number', min, max, step, value: r[k], id });
      inp.addEventListener('input', () => {
        const v = parseFloat(inp.value);
        if (!Number.isNaN(v)) { r[k] = v; rank(); }
      });
      const f = el('div', 'lab-rice-field');
      f.append(l, inp);
      card.appendChild(f);
    });
    table.appendChild(card);
  });
  root.append(table, el('p', 'lab-field-label', 'Ranking (highest score first)'), result);
  if (cfg.note) root.appendChild(el('p', 'lab-sort-why', cfg.note));
  rank();
  return root;
};

const LABS = { order: orderLab, sort: sortLab, hash: hashLab, password: passwordLab, rice: riceLab };

export const mountLabs = (container) => {
  container.querySelectorAll('.course-lab[data-lab]').forEach((slot) => {
    let cfg;
    try {
      cfg = JSON.parse(slot.getAttribute('data-lab'));
    } catch (e) {
      slot.textContent = 'This activity could not load.';
      return;
    }
    const make = LABS[cfg.type];
    if (!make) return;
    slot.removeAttribute('data-lab');
    slot.appendChild(make(cfg));
  });
};

// ---------- Runnable Python (Pyodide) ----------
const PYODIDE_VERSION = '0.26.4';
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
let pyodidePromise = null;

const loadPython = () => {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = new Promise((resolve, reject) => {
    const start = () =>
      window
        .loadPyodide({ indexURL: PYODIDE_URL })
        .then(resolve)
        .catch(reject);
    if (window.loadPyodide) return start();
    const s = document.createElement('script');
    s.src = `${PYODIDE_URL}pyodide.js`;
    s.async = true;
    s.onload = start;
    s.onerror = () => reject(new Error('Could not load Python. Check your internet connection.'));
    document.head.appendChild(s);
  }).catch((e) => {
    pyodidePromise = null;
    throw e;
  });
  return pyodidePromise;
};

const NEEDS_COMPUTER = /^\s*(import|from)\s+(requests|fastapi|flask|uvicorn|sqlalchemy|psycopg2|anthropic|openai|dotenv)\b/m;

export const enhancePython = (container) => {
  container.querySelectorAll('pre > code.language-python').forEach((code) => {
    const pre = code.parentElement;
    const wrap = pre.closest('.code-wrap') || pre;
    if (wrap.dataset && wrap.dataset.py) return;
    const source = code.textContent.replace(/\n$/, '');

    if (NEEDS_COMPUTER.test(source)) {
      const note = el('p', 'py-note', 'This example uses the internet or a package that needs your own computer, so run it there.');
      wrap.parentNode.insertBefore(note, wrap.nextSibling);
      if (wrap.dataset) wrap.dataset.py = '1';
      return;
    }

    const cell = el('div', 'py-cell');
    const bar = el('div', 'py-bar');
    bar.appendChild(el('span', 'py-label', 'Python'));
    const run = btn('py-run', 'Run');
    const reset = btn('py-reset', 'Reset');
    bar.append(run, reset);
    const ta = el('textarea', 'py-editor');
    ta.value = source;
    ta.spellcheck = false;
    ta.setAttribute('aria-label', 'Python code you can edit and run. Tab indents; press Escape, then Tab, to leave. Ctrl or Cmd plus Enter runs it.');
    const fit = () => {
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight + 2}px`;
    };
    ta.addEventListener('input', fit);
    // Tab indents; press Esc first to move focus out with Tab as usual.
    let escaped = false;
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        escaped = true;
        return;
      }
      if (e.key === 'Tab' && !e.shiftKey && !escaped) {
        e.preventDefault();
        const { selectionStart: a, selectionEnd: b } = ta;
        ta.value = `${ta.value.slice(0, a)}    ${ta.value.slice(b)}`;
        ta.selectionStart = ta.selectionEnd = a + 4;
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        run.click();
      }
      if (e.key !== 'Tab') escaped = false;
    });
    const out = el('pre', 'py-out');
    out.hidden = true;
    out.setAttribute('aria-live', 'polite');

    reset.addEventListener('click', () => {
      ta.value = source;
      fit();
      out.hidden = true;
    });

    run.addEventListener('click', async () => {
      out.hidden = false;
      out.classList.remove('is-error');
      out.textContent = pyodidePromise ? 'Running...' : 'Starting Python in your browser (first run takes a few seconds)...';
      run.disabled = true;
      try {
        const py = await loadPython();
        let text = '';
        py.setStdout({ batched: (s) => (text += `${s}\n`) });
        py.setStderr({ batched: (s) => (text += `${s}\n`) });
        py.setStdin({ stdin: () => window.prompt('Your program is asking for input:') ?? '' });
        const src = ta.value;
        const file = src.match(/^#\s*([\w-]+\.py)\s*$/m);
        if (file && src.trimStart().startsWith('#')) {
          py.FS.writeFile(file[1], src);
          await py.runPythonAsync('import importlib; importlib.invalidate_caches()');
        }
        await py.runPythonAsync(src);
        out.textContent = text.trim() || '(Ran with no output.)';
      } catch (err) {
        const lines = String(err && err.message ? err.message : err).trim().split('\n');
        // Show the useful end of a Python traceback, not the Pyodide internals.
        const i = lines.findIndex((l) => l.includes('File "<exec>"'));
        out.textContent = (i >= 0 ? lines.slice(i) : lines.slice(-4)).join('\n');
        out.classList.add('is-error');
      } finally {
        run.disabled = false;
      }
    });

    cell.append(bar, ta, out);
    wrap.replaceWith(cell);
    fit();
    requestAnimationFrame(fit);
  });
};


// ---------- Live HTML preview ----------
// Courses marked <!-- runnable: html --> turn ```html blocks into an editor
// with a live preview beside it (a sandboxed frame, so nothing can touch the page).
export const enhanceHtml = (container) => {
  container.querySelectorAll('pre > code.language-html').forEach((code) => {
    const pre = code.parentElement;
    const wrap = pre.closest('.code-wrap') || pre;
    const source = code.textContent.replace(/\n$/, '');
    const cell = el('div', 'html-cell');
    const bar = el('div', 'py-bar');
    bar.appendChild(el('span', 'py-label', 'HTML: edit the code, the preview updates as you type'));
    const reset = btn('py-reset', 'Reset');
    bar.appendChild(reset);
    const grid = el('div', 'html-grid');
    const ta = el('textarea', 'py-editor');
    ta.value = source;
    ta.spellcheck = false;
    ta.setAttribute('aria-label', 'HTML you can edit; the preview updates as you type');
    const frame = el('iframe', 'html-preview');
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.title = 'Live preview';
    let t;
    const render = () => {
      frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;margin:12px;color:#111}</style></head><body>${ta.value}</body></html>`;
    };
    const fit = () => {
      ta.style.height = 'auto';
      ta.style.height = `${Math.max(ta.scrollHeight + 2, 140)}px`;
    };
    ta.addEventListener('input', () => {
      fit();
      clearTimeout(t);
      t = setTimeout(render, 250);
    });
    reset.addEventListener('click', () => {
      ta.value = source;
      fit();
      render();
    });
    grid.append(ta, frame);
    cell.append(bar, grid);
    wrap.replaceWith(cell);
    fit();
    render();
  });
};

export const LABS_CSS = `
.course-prose .lab { margin:1.5rem 0; border:2px solid var(--acc); border-radius:1rem; padding:1rem 1.1rem; background:#fff; }
.course-prose .lab-kicker { margin:0; font-size:.72rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; color:var(--acc); }
.course-prose .lab-title { margin:.15rem 0 .2rem; font-weight:800; color:#111827; font-size:1.05rem; }
.course-prose .lab-prompt { margin:0 0 .8rem; color:#4B5563; font-size:.95rem; }
.course-prose .lab-order { list-style:none; padding:0; margin:.5rem 0 0; display:grid; gap:.45rem; }
.course-prose .lab-order-item { display:flex; align-items:center; gap:.6rem; border:1px solid #E5E7EB; border-radius:.65rem; padding:.5rem .6rem; margin:0; background:#FAFAFA; }
.course-prose .lab-order-item.is-right { border-color:#059669; background:#ECFDF5; }
.course-prose .lab-order-item.is-wrong { border-color:#DC2626; background:#FEF2F2; }
.course-prose .lab-order-n { width:1.6rem; height:1.6rem; flex-shrink:0; border-radius:999px; background:var(--tint); color:var(--acc); font-size:.78rem; font-weight:800; display:flex; align-items:center; justify-content:center; }
.course-prose .lab-order-text { flex:1; font-weight:600; color:#111827; font-size:.95rem; }
.course-prose .lab-move { width:2rem; height:2rem; border-radius:.5rem; border:1px solid #D1D5DB; background:#fff; font-weight:700; color:#374151; }
.course-prose .lab-move:disabled { opacity:.35; }
.course-prose .lab-actions { display:flex; flex-wrap:wrap; gap:.5rem; margin-top:.9rem; }
.course-prose .lab-btn { font-size:.85rem; font-weight:700; padding:.5rem .9rem; border-radius:.6rem; border:1px solid #D1D5DB; background:#fff; color:#374151; }
.course-prose .lab-primary { background:var(--acc); border-color:var(--acc); color:#fff; }
.course-prose .lab-msg { margin:.7rem 0 0; font-weight:600; font-size:.92rem; color:#374151; }
.course-prose .lab-msg.is-right { color:#047857; }
.course-prose .lab-msg.is-wrong { color:#B91C1C; }
.course-prose .lab-sort { display:grid; gap:.6rem; }
.course-prose .lab-sort-row { border:1px solid #E5E7EB; border-left:4px solid #E5E7EB; border-radius:.65rem; padding:.6rem .75rem; background:#FAFAFA; }
.course-prose .lab-sort-row.is-right { border-left-color:#059669; }
.course-prose .lab-sort-row.is-wrong { border-left-color:#DC2626; }
.course-prose .lab-sort-text { margin:0 0 .45rem; font-weight:600; color:#111827; font-size:.95rem; }
.course-prose .lab-sort-opts { display:flex; flex-wrap:wrap; gap:.4rem; }
.course-prose .lab-opt { font-size:.82rem; font-weight:600; padding:.35rem .7rem; border-radius:999px; border:1px solid #D1D5DB; background:#fff; color:#374151; }
.course-prose .lab-opt.is-picked { border-color:var(--acc); background:var(--tint); color:var(--acc); }
.course-prose .lab-opt.is-right { border-color:#059669; background:#ECFDF5; color:#047857; }
.course-prose .lab-opt.is-wrong { border-color:#DC2626; background:#FEF2F2; color:#B91C1C; }
.course-prose .lab-sort-why { margin:.45rem 0 0; font-size:.88rem; color:#4B5563; }
.course-prose .lab button:focus-visible { outline:2px solid var(--acc); outline-offset:2px; }
.course-prose .py-cell { margin:1.1rem 0; border-radius:.8rem; overflow:hidden; background:#1E1B2E; }
.course-prose .py-bar { display:flex; align-items:center; gap:.5rem; padding:.45rem .6rem; background:#2A2640; }
.course-prose .py-label { flex:1; font-size:.75rem; font-weight:700; color:#B8B3D6; letter-spacing:.04em; }
.course-prose .py-run { font-size:.8rem; font-weight:800; color:#fff; background:var(--acc); padding:.3rem .9rem; border-radius:.45rem; }
.course-prose .py-run:disabled { opacity:.6; }
.course-prose .py-reset { font-size:.8rem; font-weight:700; color:#E9E7F5; background:transparent; border:1px solid rgba(255,255,255,.25); padding:.28rem .7rem; border-radius:.45rem; }
.course-prose .py-run:focus-visible, .course-prose .py-reset:focus-visible { outline:2px solid #fff; outline-offset:2px; }
.course-prose .py-editor { display:block; width:100%; border:0; margin:0; padding:.9rem 1.1rem; background:#1E1B2E; color:#E9E7F5; resize:vertical; overflow:hidden;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:.83rem; line-height:1.6; tab-size:4; white-space:pre; overflow-x:auto; }
.course-prose .py-editor:focus { outline:2px solid var(--acc); outline-offset:-2px; }
.course-prose .py-out { margin:0; border-radius:0; background:#0F0D1A; color:#D1FAE5; padding:.75rem 1.1rem; font-size:.82rem; border-top:1px solid #2A2640; white-space:pre-wrap; }
.course-prose .py-out.is-error { color:#FECACA; }
.course-prose .html-cell { margin:1.1rem 0; border-radius:.8rem; overflow:hidden; background:#1E1B2E; }
.course-prose .html-grid { display:grid; grid-template-columns:1fr; }
@media (min-width:900px) { .course-prose .html-grid { grid-template-columns:1fr 1fr; } }
.course-prose .html-preview { width:100%; min-height:180px; height:100%; border:0; background:#fff; }
.course-prose .lab-field-label { display:block; margin:.6rem 0 .2rem; font-size:.75rem; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:.04em; }
.course-prose .lab-input { width:100%; border:1px solid #D1D5DB; border-radius:.6rem; padding:.55rem .7rem; font:inherit; font-size:.95rem; color:#111827; background:#fff; }
.course-prose .lab-input:focus { outline:2px solid var(--acc); outline-offset:1px; border-color:transparent; }
.course-prose .lab-input-sm { padding:.4rem .5rem; font-size:.9rem; }
.course-prose .lab-hash { margin-top:.4rem; }
.course-prose .lab-hash-out { display:block; word-break:break-all; background:#F3F4F6; padding:.5rem .6rem; border-radius:.5rem; font-size:.78rem; }
.course-prose .lab-meter { height:.6rem; border-radius:999px; background:#F3F4F6; margin-top:.7rem; overflow:hidden; }
.course-prose .lab-meter-bar { height:100%; width:0; border-radius:999px; transition:width .2s; }
.course-prose .lab-facts { margin:.4rem 0 0; font-size:.9rem; color:#4B5563; }
.course-prose .lab-rice { display:grid; gap:.7rem; grid-template-columns:1fr; }
@media (min-width:700px) { .course-prose .lab-rice { grid-template-columns:repeat(2, minmax(0,1fr)); } }
.course-prose .lab-rice-card { border:1px solid #E5E7EB; border-radius:.75rem; padding:.3rem .8rem .8rem; margin:0; background:#FAFAFA; }
.course-prose .lab-rice-card legend { padding:0 .3rem; }
.course-prose .lab-rice-name { font-weight:700; color:#111827; font-size:.92rem; }
.course-prose .lab-rice-field { display:grid; grid-template-columns:1fr 6.5rem; align-items:center; gap:.5rem; }
.course-prose .lab-rice-field .lab-field-label { margin:.45rem 0 0; text-transform:none; letter-spacing:0; font-size:.82rem; }
.course-prose .lab-rice-rank { margin:.3rem 0 0; padding-left:1.4rem; }
.course-prose .lab-rice-item { display:flex; justify-content:space-between; gap:1rem; padding:.3rem 0; border-bottom:1px dashed #E5E7EB; }
.course-prose .lab-rice-score { font-weight:800; color:var(--acc); }
@media (prefers-reduced-motion: reduce) { .course-prose .lab-meter-bar { transition:none; } }
.course-prose .py-note { margin:-.6rem 0 1rem; font-size:.82rem; color:#6B7280; }
`;
