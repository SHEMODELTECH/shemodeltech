// src/Pages/learning/WatchPlayer.jsx
// "Watch" mode for a course module: a narrated, illustrated walkthrough that
// plays like a video. Each module that has one carries its script in a
// ```watch block (JSON) in the course file; modules without a script only
// have the Read view. The voice is the device's own (Web Speech API), so
// nothing is streamed or stored and it costs nothing to run.
//
// Script shape:
//   { "scenes": [ { "kind": "title|list|quote|flow|big|code|quiz", "art": "<name>",
//       "kicker": "...", "title": "...",
//       list:  "items": [["Label", "optional detail"]], "crossed": true (strike-through)
//       quote: "quote": "..."      flow: "steps": ["...", "..."]
//       big:   "big": "Under 10 s", "sub": "..."
//       code:  "file": "SPEC.md", "code": "..."
//       quiz:  "options": ["..."], "answer": 1, "good": "...", "bad": "..."
//       "beats": [ { "say": "One sentence of narration.", "show": 2 } ] } ] }
//   "show" = how many items (list rows, flow steps, quote/code, big number) are
//   visible from that sentence on.
import React, { useCallback, useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react';
import { WATCH_ART } from './watchArt';

export const parseWatchScript = (html) => {
  const m = /class="course-watch" data-watch="([^"]*)"/.exec(html || '');
  if (!m) return null;
  let raw = m[1];
  try { raw = decodeURIComponent(raw); } catch (_) { /* older entity-encoded form */ }
  raw = raw.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  try {
    const s = JSON.parse(raw);
    return Array.isArray(s.scenes) && s.scenes.length ? s : null;
  } catch (_) {
    return null;
  }
};

const synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
const VOICE_KEY = 'smt-watch-voice';

const PlayIcon = () => <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />;
const PauseIcon = () => <path d="M7 5h4v14H7zM13 5h4v14h-4z" />;

// ---- Explainer scenes: the idea itself, animated step by step with the narration ----
// Every beat (sentence) can change what's on screen, so learners SEE how it works:
//   diagram:  nodes + arrows; a beat can light up nodes ("on") and send a labelled
//             packet along an arrow ("send": {from, to, label}).
//   table:    real rows; a beat can show a query ("sql"), highlight rows ("hl"),
//             fade the rest ("dim") and highlight a column ("col").
//   walk:     code that runs line by line; a beat highlights lines ("line") and
//             adds console output ("out", kept for later beats); "vars" sets
//             live variable values, which stay until changed ("vars": null clears).
//   array:    boxes of values; a beat can change values ("vals"), highlight boxes
//             ("hl"), mark some done ("ok"), fade ruled-out ones ("gone") and place
//             pointers ("ptr": {name: index}).
//   chart:    points on axes; a beat can colour them by group ("groups"), draw a
//             line ("line": [slope, intercept]) and mark centres ("marks").
const upTo = (beats, bi, key) => {
  for (let i = bi; i >= 0; i -= 1) if (beats[i] && beats[i][key] !== undefined) return beats[i][key];
  return undefined;
};
const asSet = (v) => new Set(Array.isArray(v) ? v : v === undefined || v === null ? [] : [v]);

const useBox = (ref) => {
  const [box, setBox] = useState({ w: 800, h: 320 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const read = () => setBox({ w: el.clientWidth || 800, h: el.clientHeight || 320 });
    read();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return box;
};

// Shrinks its content to fit the stage (long code, big tables, small phones).
const Fit = ({ children }) => {
  const outer = useRef(null);
  const inner = useRef(null);
  const [k, setK] = useState(1);
  useLayoutEffect(() => {
    const o = outer.current; const i = inner.current;
    if (!o || !i) return undefined;
    const fit = () => {
      const h = i.scrollHeight; const w = i.scrollWidth;
      if (!h || !w || !o.clientHeight) return;
      setK(Math.max(0.4, Math.min(1, o.clientHeight / h, o.clientWidth / w)));
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(fit);
    ro.observe(o); ro.observe(i);
    return () => ro.disconnect();
  });
  return (
    <div ref={outer} className="wx-fit">
      <div ref={inner} className="wx-fit-in" style={{ transform: k < 1 ? `scale(${k})` : undefined }}>{children}</div>
    </div>
  );
};

const Diagram = ({ scene, bi }) => {
  const beats = scene.beats || [];
  const b = beats[bi] || {};
  const shown = b.show === undefined ? (scene.nodes || []).length : b.show;
  const on = asSet(b.on);
  const ref = useRef(null);
  const box = useBox(ref);
  // On tall screens (phones), lay the diagram out top-to-bottom instead.
  const portrait = box.h > box.w * 0.95;
  const k = Math.max(0.55, portrait ? Math.min(1, box.w / 300, box.h / 480) : Math.min(1, box.w / 700, box.h / 300));
  const pos = {};
  // (In portrait the columns are narrow, so pull nodes in from the edges.)
  (scene.nodes || []).forEach((n) => {
    pos[n.id] = portrait ? { ...n, x: 50 + (n.y - 50) * 0.84, y: 50 + (n.x - 50) * 0.9 } : { ...n };
  });
  // Keep every node fully inside the stage: if nodes sit too close to an edge,
  // spread them over the safe area instead (keeps their arrangement).
  const fitAxis = (key, half) => {
    const m = Math.min(45, (half / Math.max(key === 'y' ? box.h : box.w, 1)) * 100);
    const vals = Object.values(pos).map((n) => n[key]);
    const lo = Math.min(...vals); const hi = Math.max(...vals);
    if (lo >= m && hi <= 100 - m) return;
    Object.values(pos).forEach((n) => {
      n[key] = hi === lo ? 50 : m + ((n[key] - lo) / (hi - lo)) * (100 - 2 * m);
    });
  };
  if (Object.keys(pos).length) { fitAxis('y', 50 * k); fitAxis('x', 80 * k); }
  const send = b.send && pos[b.send.from] && pos[b.send.to] ? b.send : null;
  // Tight on space (several rows of nodes in a short stage): drop the icons.
  const rows = new Set(Object.values(pos).map((n) => Math.round(n.y / 8))).size;
  const cols = new Set(Object.values(pos).map((n) => Math.round(n.x / 8))).size;
  const compact = box.h / Math.max(rows, 1) < 110 || box.w / Math.max(cols, 1) < 130;
  // Shrink nodes so neighbours in the same row (or column) never collide.
  let room = k;
  const list = Object.values(pos);
  list.forEach((a, i) => list.slice(i + 1).forEach((c) => {
    const dx = (Math.abs(a.x - c.x) / 100) * box.w; const dy = (Math.abs(a.y - c.y) / 100) * box.h;
    if (dy < 70) room = Math.min(room, dx / 150);
    if (dx < 150) room = Math.min(room, dy / 74);
  }));
  const kk = Math.max(0.5, room);
  return (
    <div className="wx-diagram" ref={ref} style={{ '--k': kk }}>
      <svg className="wx-edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {(scene.edges || []).map((e, i) => {
          const a = pos[e.from]; const c = pos[e.to];
          if (!a || !c) return null;
          const idx = (id) => scene.nodes.findIndex((n) => n.id === id);
          const vis = idx(e.from) < shown && idx(e.to) < shown;
          const live = send && ((send.from === e.from && send.to === e.to) || (send.from === e.to && send.to === e.from));
          return <line key={i} x1={a.x} y1={a.y} x2={c.x} y2={c.y} className={`${vis ? '' : 'off'}${live ? ' live' : ''}`} vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      {(scene.nodes || []).map((n, i) => (
        <div key={n.id} className={`wx-node${i < shown ? '' : ' off'}${on.has(n.id) ? ' on' : ''}`} style={{ left: `${pos[n.id].x}%`, top: `${pos[n.id].y}%` }}>
          {!compact && n.art && WATCH_ART[n.art] && <span className="wp-art wx-node-art" dangerouslySetInnerHTML={{ __html: WATCH_ART[n.art] }} />}
          <b>{n.label}</b>{n.sub && <small>{n.sub}</small>}
        </div>
      ))}
      {send && (
        <span key={`${bi}-${send.from}-${send.to}`} className="wx-packet"
          style={{ '--x1': `${pos[send.from].x}%`, '--y1': `${pos[send.from].y}%`, '--x2': `${pos[send.to].x}%`, '--y2': `${pos[send.to].y}%` }}>
          {send.label}
        </span>
      )}
    </div>
  );
};

const TableScene = ({ scene, bi }) => {
  const beats = scene.beats || [];
  const b = beats[bi] || {};
  const hl = asSet(b.hl);
  const sql = upTo(beats, bi, 'sql');
  const col = b.col;
  return (
    <div className="wx-table">
      {sql && <code className="wx-sql" key={sql}>{sql}</code>}
      <table>
        <thead><tr>{(scene.columns || []).map((c, i) => <th key={i} className={col === i ? 'col' : ''}>{c}</th>)}</tr></thead>
        <tbody>
          {(scene.rows || []).map((r, ri) => (
            <tr key={ri} className={`${hl.has(ri) ? 'hl' : ''}${b.dim && !hl.has(ri) ? ' dim' : ''}`}>
              {r.map((v, ci) => <td key={ci} className={col === ci ? 'col' : ''}>{v}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Walk = ({ scene, bi }) => {
  const beats = scene.beats || [];
  const b = beats[bi] || {};
  const lines = String(scene.code || '').split('\n');
  const cur = asSet(b.line); // a line number, or a list of line numbers
  const out = [];
  for (let i = 0; i <= bi; i += 1) if (beats[i] && beats[i].out) out.push(...[].concat(beats[i].out));
  // Variables stay on screen once set (like in a real program); "vars": null clears them.
  let vars = {};
  for (let i = 0; i <= bi; i += 1) {
    const v = beats[i] && beats[i].vars;
    if (v === null) vars = {};
    else if (v) vars = { ...vars, ...v };
  }
  return (
    <div className="wx-walk">
      <pre className="wx-src">
        {scene.file && <span className="wp-file">{scene.file}</span>}
        {lines.map((l, i) => <div key={i} className={cur.has(i + 1) ? 'cur' : ''}><span className="ln">{i + 1}</span>{l || ' '}</div>)}
      </pre>
      {Object.keys(vars).length > 0 && (
        <div className="wx-vars">{Object.entries(vars).map(([k, v]) => <span key={`${k}${v}`}><i>{k}</i> = <b>{String(v)}</b></span>)}</div>
      )}
      {(out.length > 0 || scene.console) && (
        <pre className="wx-out" aria-label="Output">{out.map((o, i) => <div key={i} className={i >= out.length - [].concat(b.out || []).length ? 'new' : ''}>{o}</div>)}</pre>
      )}
    </div>
  );
};

const ArrayScene = ({ scene, bi }) => {
  const beats = scene.beats || [];
  const b = beats[bi] || {};
  const vals = upTo(beats, bi, 'vals') || scene.values || [];
  const hl = asSet(b.hl);
  const ok = asSet(upTo(beats, bi, 'ok'));
  const gone = asSet(upTo(beats, bi, 'gone'));
  const ptr = b.ptr || {};
  return (
    <div className="wx-array">
      <div className="wx-cells">
        {vals.map((v, i) => (
          <div key={i} className={`wx-cell${hl.has(i) ? ' hl' : ''}${ok.has(i) ? ' ok' : ''}${gone.has(i) ? ' gone' : ''}`}>
            <b>{v}</b><small>{i}</small>
            <span className="wx-ptr">{Object.keys(ptr).filter((k) => ptr[k] === i).join(' ')}</span>
          </div>
        ))}
      </div>
      {b.note && <p className="wx-note" key={b.note}>{b.note}</p>}
    </div>
  );
};

const ChartScene = ({ scene, bi }) => {
  const beats = scene.beats || [];
  const b = beats[bi] || {};
  const pts = scene.points || [];
  const groups = upTo(beats, bi, 'groups');
  const line = upTo(beats, bi, 'line');
  const marks = upTo(beats, bi, 'marks') || [];
  const X = (x) => 8 + x * 0.88; const Y = (y) => 92 - y * 0.84;
  return (
    <svg className="wx-chart" viewBox="0 0 100 100" aria-hidden="true">
      <path className="ax" d="M8 6V92H98" />
      {scene.xlabel && <text x="96" y="99" textAnchor="end">{scene.xlabel}</text>}
      {scene.ylabel && <text x="10" y="5">{scene.ylabel}</text>}
      {pts.map(([x, y], i) => <circle key={i} cx={X(x)} cy={Y(y)} r="2.2" className={`pt g${groups ? groups[i] : 0}`} />)}
      {line && <line key={line.join()} className="fit" x1={X(0)} y1={Y(line[1])} x2={X(100)} y2={Y(line[0] * 100 + line[1])} />}
      {marks.map(([x, y], i) => <path key={`${i}-${x}-${y}`} className={`mk g${i + 1}`} d={`M${X(x) - 3} ${Y(y)}h6M${X(x)} ${Y(y) - 3}v6`} />)}
    </svg>
  );
};
const VISUAL = { diagram: Diagram, table: TableScene, walk: Walk, array: ArrayScene, chart: ChartScene };

export const Scene = ({ scene, shown, onAnswer, answered, bi = 0 }) => {
  const off = (i) => (i > shown ? ' off' : '');
  let body = null;
  const Visual = VISUAL[scene.kind];
  if (Visual) {
    return (
      <div className="wp-scene vis" key={scene.title}>
        <div className="wp-vhead">
          {scene.kicker && <div className="wp-kicker">{scene.kicker}</div>}
          <h3 className="wp-title">{scene.title}</h3>
        </div>
        <div className="wp-vbody">{scene.kind === 'diagram' ? <Visual scene={scene} bi={bi} /> : <Fit><Visual scene={scene} bi={bi} /></Fit>}</div>
      </div>
    );
  }
  if (scene.kind === 'list') {
    body = (
      <ul className={`wp-items${scene.crossed ? ' x' : ''}`}>
        {(scene.items || []).map(([t, sub], i) => (
          <li key={i} className={off(i + 1).trim()}>
            <span className="wp-dot" aria-hidden="true">{scene.crossed ? '✕' : i + 1}</span>
            <span><b>{t}</b>{sub ? <small>{sub}</small> : null}</span>
          </li>
        ))}
      </ul>
    );
  } else if (scene.kind === 'quote') {
    body = <p className={`wp-quote${off(1)}`}>{scene.quote}</p>;
  } else if (scene.kind === 'flow') {
    body = (
      <div className="wp-flow">
        {(scene.steps || []).map((t, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className={`wp-arrow${off(i + 1)}`} aria-hidden="true">→</span>}
            <span className={`wp-chip${off(i + 1)}${shown === i + 1 ? ' now' : ''}`}>{t}</span>
          </React.Fragment>
        ))}
      </div>
    );
  } else if (scene.kind === 'big') {
    body = (
      <>
        {scene.sub && <div className={`wp-sub${off(1)}`}>{scene.sub}</div>}
        <div className={`wp-big${off(scene.sub ? 2 : 1)}`}>{scene.big}</div>
      </>
    );
  } else if (scene.kind === 'code') {
    body = (
      <pre className={`wp-code${off(1)}`}>
        {scene.file && <span className="wp-file">{scene.file}</span>}
        {scene.code}
      </pre>
    );
  } else if (scene.kind === 'quiz') {
    body = (
      <>
        <div className={`wp-opts${shown < 1 ? ' off' : ''}`}>
          {(scene.options || []).map((o, i) => {
            const cls = answered === null ? '' : i === scene.answer ? ' right' : i === answered ? ' wrong' : '';
            return (
              <button key={i} type="button" className={`wp-opt${cls}`} disabled={answered !== null || shown < 1} onClick={() => onAnswer(i)}>
                <span className="wp-l">{'ABCD'[i]}</span>
                <span>{o}</span>
              </button>
            );
          })}
        </div>
        <div className={`wp-fb ${answered === null ? '' : answered === scene.answer ? 'good' : 'bad'}`} aria-live="polite">
          {answered === null ? '' : answered === scene.answer ? 'Correct' : 'Not quite'}
        </div>
      </>
    );
  }
  return (
    <div className="wp-scene" key={scene.title}>
      <div className="wp-art" dangerouslySetInnerHTML={{ __html: WATCH_ART[scene.art] || WATCH_ART.bulb }} />
      <div className="wp-txt">
        {scene.kicker && <div className="wp-kicker">{scene.kicker}</div>}
        <h3 className="wp-title">{scene.title}</h3>
        {body}
      </div>
    </div>
  );
};

const WatchPlayer = ({ script, title, onFinished, nextText, finishLabel }) => {
  const scenes = useMemo(() => script.scenes || [], [script]);
  const [si, setSi] = useState(0);
  const [bi, setBi] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [answered, setAnswered] = useState(null);
  const [caption, setCaption] = useState('');
  const [cc, setCc] = useState(true);
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState([]);
  const [voiceName, setVoiceName] = useState(() => {
    try { return localStorage.getItem(VOICE_KEY) || ''; } catch (_) { return ''; }
  });

  // Live values for the speech callbacks.
  const live = useRef({});
  live.current = { si, bi, playing, answered, rate, voiceName, voices };
  const token = useRef(0);
  const timer = useRef(null);

  // English voices, the most natural-sounding first.
  useEffect(() => {
    if (!synth) return undefined;
    const load = () => {
      const all = synth.getVoices().filter((v) => /^en(-|_|$)/i.test(v.lang));
      const rank = (v) => (/natural|neural|premium|enhanced|google|samantha|daniel|serena|aria|jenny|ava/i.test(v.name) ? 0 : 1);
      setVoices(all.sort((a, b) => rank(a) - rank(b)).slice(0, 12));
    };
    load();
    synth.addEventListener?.('voiceschanged', load);
    return () => synth.removeEventListener?.('voiceschanged', load);
  }, []);

  const stop = useCallback(() => {
    token.current += 1;
    clearTimeout(timer.current);
    if (synth) synth.cancel();
  }, []);
  useEffect(() => stop, [stop]); // stop talking when the player closes

  const say = useCallback((text, done) => {
    const my = ++token.current;
    setCaption(text);
    const finish = () => { if (my === token.current) done(); };
    const { rate: r, voiceName: vn, voices: vs } = live.current;
    const words = String(text).split(/\s+/).length;
    if (synth) {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = r;
      const v = vs.find((x) => x.name === vn) || vs[0];
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-US';
      u.onend = finish;
      u.onerror = (e) => { if (e.error !== 'interrupted' && e.error !== 'canceled') finish(); };
      synth.speak(u);
      // If a device never reports the end of a sentence, move on anyway.
      timer.current = setTimeout(finish, (words / (2.6 * r)) * 1000 + 4000);
    } else {
      timer.current = setTimeout(finish, Math.max(1600, (words / (2.6 * r)) * 1000));
    }
  }, []);

  // Play the current sentence; when it ends, move to the next one.
  const run = useCallback(() => {
    const { si: s, bi: b, playing: p, answered: a } = live.current;
    if (!p) return;
    const scene = scenes[s];
    if (b >= scene.beats.length) {
      if (scene.kind === 'quiz' && a === null) { setPlaying(false); return; } // waits for an answer
      if (s < scenes.length - 1) {
        timer.current = setTimeout(() => {
          if (!live.current.playing) return;
          live.current.si = s + 1; live.current.bi = 0; live.current.answered = null;
          setSi(s + 1); setBi(0); setAnswered(null);
          run();
        }, 650);
      } else {
        setPlaying(false); setEnded(true);
      }
      return;
    }
    say(scene.beats[b].say, () => {
      live.current.bi = b + 1;
      setBi(b + 1);
      run();
    });
  }, [scenes, say]);

  const play = () => {
    setStarted(true); setEnded(false);
    if (live.current.playing) return;
    live.current.playing = true;
    setPlaying(true);
    run();
  };
  const pause = () => { live.current.playing = false; setPlaying(false); stop(); };
  const go = (i) => {
    stop();
    const n = Math.max(0, Math.min(scenes.length - 1, i));
    Object.assign(live.current, { si: n, bi: 0, answered: null, playing: true });
    setSi(n); setBi(0); setAnswered(null); setEnded(false); setStarted(true); setPlaying(true);
    run();
  };
  const answer = (i) => {
    if (live.current.answered !== null) return;
    const scene = scenes[live.current.si];
    stop();
    live.current.answered = i; live.current.bi = scene.beats.length; live.current.playing = true;
    setAnswered(i); setBi(scene.beats.length); setPlaying(true);
    say(i === scene.answer ? scene.good : scene.bad, () => run());
  };
  const changeRate = (r) => {
    setRate(r); live.current.rate = r;
    if (live.current.playing) { stop(); run(); }
  };
  const changeVoice = (name) => {
    setVoiceName(name); live.current.voiceName = name;
    try { localStorage.setItem(VOICE_KEY, name); } catch (_) { /* storage off */ }
    if (live.current.playing) { stop(); run(); }
  };

  const scene = scenes[si];
  const beat = scene.beats[Math.min(bi, scene.beats.length - 1)];
  // Before playing, show the whole first scene; while playing, follow the narration.
  const shown = !started ? 99 : bi >= scene.beats.length ? 99 : beat && beat.show !== undefined ? beat.show : 0;
  const shownCaption = started ? caption : (scene.beats[0] && scene.beats[0].say) || '';
  const pct = (i) => (i < si ? 100 : i > si ? 0 : Math.round((Math.min(bi, scene.beats.length) / scene.beats.length) * 100));

  return (
    <div className="wp" role="region" aria-label={`Watch: ${title}`}>
      <style>{WATCH_CSS}</style>
      <div className="wp-stage">
        <Scene scene={scene} bi={bi} shown={scene.kind === 'quiz' && !started ? 1 : shown} onAnswer={answer} answered={answered} />
        {cc && shownCaption && <div className="wp-cap" aria-live="polite"><span>{shownCaption}</span></div>}
        {!started && (
          <div className="wp-cover">
            <div className="wp-cover-in">
              <button type="button" className="wp-bigplay" onClick={play} aria-label="Play">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><PlayIcon /></svg>
              </button>
              <p className="wp-cover-t">{title}</p>
              <p className="wp-cover-s">Turn your sound on. Narrated scenes with captions{scenes.some((s) => s.kind === 'quiz') ? ', and a quick question near the end' : ''}.</p>
            </div>
          </div>
        )}
        {ended && (
          <div className="wp-cover">
            <div className="wp-cover-in">
              <p className="wp-cover-t">Done watching</p>
              <p className="wp-cover-s">{nextText || "Next: take this module's quiz and write your short summary."}</p>
              <div className="wp-row">
                <button type="button" className="wp-btn" onClick={() => go(0)}>Watch again</button>
                {onFinished && <button type="button" className="wp-btn primary" onClick={onFinished}>{finishLabel || 'Take the module quiz'}</button>}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="wp-bar">
        <div className="wp-segs">
          {scenes.map((s, i) => (
            <button key={i} type="button" className="wp-seg" onClick={() => go(i)} aria-label={`Scene ${i + 1}: ${s.title}`}>
              <i style={{ width: `${pct(i)}%` }} />
            </button>
          ))}
        </div>
        <div className="wp-ctls">
          <button type="button" className="wp-ctl" onClick={() => go(bi > 1 ? si : si - 1)} aria-label="Previous scene">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h2v14H6zM19 6.2v11.6a.8.8 0 0 1-1.24.67L9.6 12.67a.8.8 0 0 1 0-1.34l8.16-5.8A.8.8 0 0 1 19 6.2z" /></svg>
          </button>
          <button type="button" className="wp-ctl main" onClick={() => (playing ? pause() : play())} aria-label={playing ? 'Pause' : 'Play'}>
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{playing ? <PauseIcon /> : <PlayIcon />}</svg>
          </button>
          <button type="button" className="wp-ctl" onClick={() => go(si + 1)} aria-label="Next scene">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 5h2v14h-2zM5 6.2v11.6a.8.8 0 0 0 1.24.67l8.16-5.8a.8.8 0 0 0 0-1.34L6.24 5.53A.8.8 0 0 0 5 6.2z" /></svg>
          </button>
          <span className="wp-time">Scene {si + 1} of {scenes.length}</span>
          <span className="wp-spacer" />
          <button type="button" className="wp-pill" aria-pressed={cc} onClick={() => setCc((c) => !c)} title="Captions">CC</button>
          <select className="wp-sel" aria-label="Speed" value={rate} onChange={(e) => changeRate(Number(e.target.value))}>
            {[0.75, 1, 1.25, 1.5].map((r) => <option key={r} value={r}>{r}×</option>)}
          </select>
          {voices.length > 1 && (
            <select className="wp-sel" aria-label="Voice" value={voiceName || voices[0].name} onChange={(e) => changeVoice(e.target.value)}>
              {voices.map((v) => <option key={v.name} value={v.name}>{v.name.replace(/Microsoft |Google /, '')}</option>)}
            </select>
          )}
        </div>
        {!synth && <p className="wp-note">This browser has no reading voice, so this plays with captions only.</p>}
      </div>
    </div>
  );
};

export default WatchPlayer;

export const WATCH_CSS = `
.wp { --wp-accent:#D41470; --wp-soft:#FBE7F1; --wp-ink:#111827; --wp-muted:#6B7280; --wp-line:#E5E7EB; --wp-stage:#fff; --wp-tint:#FAF5F8;
  border:1px solid var(--wp-line); border-radius:18px; overflow:hidden; background:#fff; margin:0 0 20px; }
.wp-stage { position:relative; aspect-ratio:16/9; background:var(--wp-stage); overflow:hidden; }
@media (max-width:640px) { .wp-stage { aspect-ratio:3/4; } }
.wp-scene { position:absolute; inset:0; display:grid; grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr); align-items:center; gap:4%; padding:5% 6% 9%; }
@media (max-width:640px) { .wp-scene { grid-template-columns:1fr; grid-template-rows:auto minmax(0,1fr); align-items:start; padding:18px 16px 64px; gap:8px; } .wp-txt { align-content:start; min-height:0; } }
.wp-art { display:flex; align-items:center; justify-content:center; min-width:0; }
.wp-art svg { width:100%; max-width:280px; height:auto; }
@media (max-width:640px) { .wp-art svg { max-width:120px; max-height:90px; } }
.wp-txt { min-width:0; display:grid; gap:10px; align-content:center; }
.wp-kicker { font-size:12px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--wp-accent); }
.wp-title { font-weight:800; font-size:clamp(20px,3.2vw,32px); line-height:1.1; margin:0; letter-spacing:-.01em; color:var(--wp-ink); text-wrap:balance; }
.wp-items { list-style:none; margin:2px 0 0; padding:0; display:grid; gap:8px; }
.wp-items li { display:grid; grid-template-columns:26px 1fr; gap:10px; align-items:start; font-size:clamp(13px,1.6vw,16px); color:var(--wp-ink); transition:opacity .35s, transform .35s; }
.wp-items li b { font-weight:700; } .wp-items li small { display:block; color:var(--wp-muted); font-size:.9em; }
.wp-dot { width:26px; height:26px; border-radius:8px; background:var(--wp-soft); color:var(--wp-accent); font-weight:700; font-size:13px; display:flex; align-items:center; justify-content:center; }
.wp-items.x .wp-dot { background:transparent; color:var(--wp-muted); border:1.5px solid var(--wp-line); }
.wp-items.x li span:last-child b { text-decoration:line-through; text-decoration-color:var(--wp-accent); text-decoration-thickness:2px; }
.wp-quote { font-weight:700; font-size:clamp(17px,2.4vw,24px); line-height:1.3; border-left:4px solid var(--wp-accent); padding:4px 0 4px 14px; margin:0; color:var(--wp-ink); transition:opacity .35s; }
.wp-flow { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
.wp-chip { font-size:clamp(12px,1.5vw,14px); font-weight:600; background:var(--wp-tint); border:1px solid var(--wp-line); color:var(--wp-ink); padding:7px 11px; border-radius:10px; transition:opacity .35s, background .35s; }
.wp-chip.now { background:var(--wp-accent); border-color:var(--wp-accent); color:#fff; }
.wp-arrow { color:var(--wp-muted); font-weight:700; transition:opacity .35s; }
.wp-big { font-weight:800; font-size:clamp(44px,8vw,84px); line-height:1; color:var(--wp-accent); letter-spacing:-.02em; transition:opacity .35s; }
.wp-sub { color:var(--wp-muted); font-size:clamp(13px,1.6vw,16px); transition:opacity .35s; }
.wp-code { margin:0; background:#111827; color:#F9FAFB; font:400 clamp(10px,1.3vw,13px)/1.6 ui-monospace,SFMono-Regular,Menlo,monospace; padding:12px 14px; border-radius:12px; overflow:auto; max-height:100%; white-space:pre-wrap; word-break:break-word; transition:opacity .35s; }
@media (max-width:640px) { .wp-code { font-size:10px; line-height:1.5; padding:10px 12px; } .wp-title { font-size:19px; } }
.wp-file { display:block; color:#F472B6; font-weight:600; margin-bottom:6px; }
.wp .off { opacity:0; }
.wp-items li.off { transform:translateY(6px); }
.wp-opts { display:grid; gap:8px; transition:opacity .3s; }
.wp-opts.off { opacity:.35; }
.wp-opt { text-align:left; font:500 clamp(13px,1.5vw,15px)/1.35 inherit; color:var(--wp-ink); background:var(--wp-tint); border:1.5px solid var(--wp-line); border-radius:12px; padding:9px 13px; cursor:pointer; display:grid; grid-template-columns:20px 1fr; gap:10px; }
.wp-opt:hover:not(:disabled) { border-color:var(--wp-accent); }
.wp-opt:disabled { cursor:default; }
.wp-l { font-weight:700; color:var(--wp-accent); }
.wp-opt.right { border-color:#15803D; background:#F0FDF4; }
.wp-opt.wrong { border-color:#B91C1C; background:#FEF2F2; }
.wp-fb { font-size:14px; font-weight:700; min-height:1.3em; } .wp-fb.good { color:#15803D; } .wp-fb.bad { color:#B91C1C; }
.wp-cap { position:absolute; left:50%; bottom:12px; transform:translateX(-50%); width:min(92%,720px); text-align:center; pointer-events:none; z-index:2; }
.wp-cap span { background:rgba(17,24,39,.88); color:#fff; font-size:clamp(12px,1.5vw,15px); line-height:1.6; padding:3px 8px; border-radius:6px; box-decoration-break:clone; -webkit-box-decoration-break:clone; }
.wp-cover { position:absolute; inset:0; display:grid; place-items:center; text-align:center; padding:20px; background:rgba(255,255,255,.86); backdrop-filter:blur(3px); z-index:3; }
.wp-cover-in { display:grid; gap:10px; justify-items:center; max-width:420px; }
.wp-cover-t { font-weight:800; font-size:clamp(20px,3vw,28px); line-height:1.15; margin:0; color:var(--wp-ink); }
.wp-cover-s { margin:0; color:var(--wp-muted); font-size:14px; }
.wp-bigplay { width:72px; height:72px; border-radius:50%; border:0; background:var(--wp-accent); color:#fff; cursor:pointer; display:grid; place-items:center; box-shadow:0 10px 28px rgba(212,20,112,.35); }
.wp-bigplay svg { width:28px; height:28px; margin-left:4px; }
.wp-row { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }
.wp-btn { font-weight:600; font-size:14px; border-radius:999px; padding:9px 18px; cursor:pointer; border:1.5px solid var(--wp-line); background:#fff; color:var(--wp-ink); }
.wp-btn.primary { background:var(--wp-accent); border-color:var(--wp-accent); color:#fff; }
.wp-bar { display:grid; gap:10px; padding:12px 14px 14px; border-top:1px solid var(--wp-line); }
.wp-segs { display:flex; gap:4px; }
.wp-seg { flex:1; height:6px; border-radius:3px; background:var(--wp-line); border:0; padding:0; cursor:pointer; position:relative; overflow:hidden; }
.wp-seg i { position:absolute; inset:0; width:0; background:var(--wp-accent); transition:width .3s linear; }
.wp-ctls { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.wp-ctl { width:40px; height:40px; border-radius:10px; border:0; background:transparent; color:var(--wp-ink); cursor:pointer; display:grid; place-items:center; }
.wp-ctl:hover { background:var(--wp-tint); }
.wp-ctl.main { background:var(--wp-ink); color:#fff; border-radius:50%; }
.wp-ctl svg { width:20px; height:20px; }
.wp-time { font-size:13px; color:var(--wp-muted); font-variant-numeric:tabular-nums; }
.wp-spacer { flex:1; }
.wp-pill { font-weight:600; font-size:13px; border:1.5px solid var(--wp-line); background:#fff; color:var(--wp-ink); border-radius:999px; padding:6px 12px; cursor:pointer; }
.wp-pill[aria-pressed="true"] { border-color:var(--wp-ink); }
.wp-sel { font-size:13px; border:1.5px solid var(--wp-line); background:#fff; color:var(--wp-ink); border-radius:999px; padding:6px 10px; max-width:160px; }
.wp-note { margin:0; font-size:13px; color:var(--wp-muted); }
.wp button:focus-visible, .wp select:focus-visible { outline:3px solid var(--wp-accent); outline-offset:2px; }
.wp-art svg .pop { transform-box:fill-box; transform-origin:center; animation:wp-pop .6s cubic-bezier(.2,.9,.3,1.3) both; }
.wp-art svg .pop2 { transform-box:fill-box; transform-origin:center; animation:wp-pop .6s .25s cubic-bezier(.2,.9,.3,1.3) both; }
@keyframes wp-pop { from { transform:scale(.6); opacity:0; } to { transform:scale(1); opacity:1; } }
.wp-art .fa { fill:var(--wp-accent); } .wp-art .fs { fill:var(--wp-soft); } .wp-art .fk { fill:var(--wp-ink); } .wp-art .fp { fill:#fff; } .wp-art .fl { fill:var(--wp-line); }
.wp-art .sa { stroke:var(--wp-accent); fill:none; } .wp-art .sk { stroke:var(--wp-ink); fill:none; } .wp-art .sp { stroke:#fff; fill:none; }
.wp-art .fp.sk, .wp-art .fp.sa { fill:#fff; }
.wp-art .fa.sk, .wp-art .fa.sp { fill:var(--wp-accent); } .wp-art .fs.sk, .wp-art .fs.sa { fill:var(--wp-soft); }
.wp-art .fk.sa, .wp-art .fk.sp { fill:var(--wp-ink); } .wp-art .fl.sk, .wp-art .fl.sa { fill:var(--wp-line); }
/* Explainer scenes */
.wx-fit { width:100%; height:100%; display:flex; align-items:center; justify-content:center; overflow:visible; }
.wx-fit-in { width:100%; flex:none; transform-origin:center center; }
.wx-fit .wx-walk, .wx-fit .wx-table { max-height:none; } .wx-fit .wx-src { overflow:visible; }
.wx-fit .wx-chart { height:auto; width:100%; max-width:min(100%, 420px); margin:0 auto; display:block; }
.wp-scene.vis { display:flex; flex-direction:column; gap:8px; align-items:stretch; padding:3% 4% 8%; }
.wp-vhead { display:grid; gap:2px; } .wp-scene.vis .wp-title { font-size:clamp(15px,2.2vw,22px); }
.wp-vbody { flex:1; min-height:0; position:relative; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.wx-diagram { position:relative; width:100%; height:100%; }
.wx-edges { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
.wx-edges line { stroke:var(--wp-line); stroke-width:3; transition:stroke .3s, opacity .4s; }
.wx-edges line.live { stroke:var(--wp-accent); stroke-dasharray:6 5; animation:wx-dash 1s linear infinite; }
.wx-edges line.off { opacity:0; }
@keyframes wx-dash { to { stroke-dashoffset:-22; } }
.wx-node { position:absolute; transform:translate(-50%,-50%) scale(var(--k,1)); background:#fff; border:2px solid var(--wp-line); border-radius:14px; padding:6px 10px; text-align:center; min-width:76px; max-width:180px; transition:border-color .3s, box-shadow .3s, opacity .4s, transform .4s; display:grid; justify-items:center; gap:2px; }
.wx-node b { font-size:14px; line-height:1.2; color:var(--wp-ink); } .wx-node small { font-size:11.5px; line-height:1.25; color:var(--wp-muted); }
.wx-node.on { border-color:var(--wp-accent); box-shadow:0 0 0 4px var(--wp-soft); transform:translate(-50%,-50%) scale(calc(var(--k,1) * 1.06)); }
.wx-node.off { opacity:0; transform:translate(-50%,-40%) scale(var(--k,1)); }
.wp-art.wx-node-art svg { width:40px; max-width:none; height:auto; display:block; }
.wx-packet { position:absolute; transform:translate(-50%,-50%); background:var(--wp-accent); color:#fff; font-weight:700; font-size:clamp(10px,1.3vw,13px); padding:5px 10px; border-radius:14px; white-space:normal; max-width:34%; width:max-content; text-align:center; line-height:1.25; box-shadow:0 4px 12px rgba(212,20,112,.3); z-index:2; animation:wx-send 1.6s ease-in-out forwards; margin-top:-26px; }
@keyframes wx-send { 0% { left:clamp(18%, var(--x1), 82%); top:var(--y1); opacity:0; } 12% { opacity:1; } 100% { left:clamp(18%, var(--x2), 82%); top:var(--y2); opacity:1; } }
.wx-table { width:100%; display:grid; gap:8px; align-content:center; max-height:100%; }
.wx-sql { display:block; background:var(--wp-ink); color:#fff; border-radius:10px; padding:8px 12px; font-size:clamp(11px,1.4vw,14px); white-space:pre-wrap; animation:wx-in .4s ease both; }
.wx-table table { width:100%; border-collapse:separate; border-spacing:0; font-size:clamp(11px,1.4vw,14px); }
.wx-table th { text-align:left; color:var(--wp-muted); font-weight:700; padding:4px 10px; border-bottom:2px solid var(--wp-line); }
.wx-table td { padding:4px 10px; border-bottom:1px solid var(--wp-line); color:var(--wp-ink); transition:background .3s, opacity .3s; }
.wx-table tr.hl td { background:var(--wp-soft); font-weight:600; } .wx-table tr.hl td:first-child { box-shadow:inset 4px 0 0 var(--wp-accent); }
.wx-table tr.dim td { opacity:.3; }
.wx-table .col { color:var(--wp-accent); }
.wx-walk { width:100%; max-height:100%; display:flex; flex-direction:column; gap:6px; }
.wx-vars { flex:none; display:flex; flex-wrap:wrap; gap:6px; font-family:ui-monospace,Menlo,Consolas,monospace; font-size:clamp(10px,1.35vw,13px); }
.wx-vars span { background:var(--wp-soft); border-radius:8px; padding:4px 10px; animation:wx-in .35s ease both; } .wx-vars i { font-style:normal; color:var(--wp-muted); } .wx-vars b { color:var(--wp-accent); }
.wx-src { margin:0; flex:0 1 auto; min-height:0; background:#0f172a; color:#e2e8f0; border-radius:12px; padding:8px 0; font-size:clamp(10px,1.3vw,13.5px); line-height:1.45; overflow:hidden; font-family:ui-monospace,Menlo,Consolas,monospace; position:relative; }
.wx-src .wp-file { margin:0 12px 4px; display:inline-block; }
.wx-src div { padding:0 12px; white-space:pre-wrap; transition:background .25s; border-left:3px solid transparent; }
.wx-src div.cur { background:rgba(212,20,112,.28); border-left-color:var(--wp-accent); }
.wx-src .ln { display:inline-block; width:2.2em; color:#64748b; user-select:none; }
.wx-out { margin:0; flex:none; background:#fff; border:1.5px solid var(--wp-line); border-radius:10px; padding:6px 12px; min-height:2em; font-size:clamp(10px,1.35vw,13.5px); font-family:ui-monospace,Menlo,Consolas,monospace; color:var(--wp-ink); }
.wx-out div.new { animation:wx-in .4s ease both; color:var(--wp-accent); font-weight:700; }
@keyframes wx-in { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:none; } }
.wx-array { display:grid; gap:14px; justify-items:center; width:100%; }
.wx-cells { display:flex; gap:clamp(3px,1vw,10px); justify-content:center; width:100%; padding-top:20px; }
.wx-cell { flex:1 1 0; min-width:0; max-width:62px; aspect-ratio:1/1.1; border:2px solid var(--wp-line); border-radius:10px; display:grid; place-items:center; position:relative; background:#fff; transition:all .35s; }
.wx-cell b { font-size:clamp(13px,2vw,20px); color:var(--wp-ink); } .wx-cell small { position:absolute; bottom:-18px; font-size:11px; color:var(--wp-muted); }
.wx-cell.hl { border-color:var(--wp-accent); background:var(--wp-soft); transform:translateY(-6px); }
.wx-cell.ok { background:var(--wp-ink); border-color:var(--wp-ink); } .wx-cell.ok b { color:#fff; }
.wx-cell.gone { opacity:.28; border-style:dashed; }
.wx-ptr { position:absolute; top:-20px; font-size:11px; font-weight:800; color:var(--wp-accent); white-space:nowrap; }
.wx-note { margin:10px 0 0; font-weight:700; color:var(--wp-ink); font-size:clamp(12px,1.6vw,15px); animation:wx-in .4s ease both; text-align:center; }
.wx-chart { height:100%; width:auto; max-width:100%; aspect-ratio:1/1; overflow:visible; }
.wx-chart .ax { stroke:var(--wp-ink); stroke-width:.8; fill:none; } .wx-chart text { font-size:4.5px; fill:var(--wp-muted); font-weight:600; }
.wx-chart .pt { r:2.6px; fill:var(--wp-ink); transition:fill .4s; } .wx-chart .pt.g1 { fill:var(--wp-accent); } .wx-chart .pt.g2 { fill:#111827; } .wx-chart .pt.g3 { fill:#9CA3AF; }
.wx-chart .fit { stroke:var(--wp-accent); stroke-width:1; animation:wx-in .5s ease both; }
.wx-chart .mk { stroke-width:1.4; fill:none; animation:wx-in .4s ease both; } .wx-chart .mk.g1 { stroke:var(--wp-accent); } .wx-chart .mk.g2 { stroke:#111827; } .wx-chart .mk.g3 { stroke:#9CA3AF; }
@media (max-width:640px) { .wp-scene.vis { padding:16px 14px 64px; } }
@media (prefers-reduced-motion: reduce) { .wp *, .wp *::before, .wp *::after { animation:none !important; transition:none !important; } }
`;
