// src/Pages/learning/watchArt.js
// Illustrations for Watch mode, in She Model Tech's colours. Colours come from
// classes styled in WatchPlayer (fa = pink fill, fs = soft pink, fk = ink,
// fp = white, fl = light grey; sa/sk/sp = pink/ink/white strokes), so every
// picture stays on brand. Scripts pick one by name: "art": "database".

const bg = '<circle class="fs pop" cx="120" cy="100" r="82"/>';

export const WATCH_ART = {
  bulb: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}
    <g class="pop2"><path class="fp sk" stroke-width="5" d="M120 38c-27 0-47 20-47 45 0 17 9 28 18 37 6 6 9 12 9 19v7h40v-7c0-7 3-13 9-19 9-9 18-20 18-37 0-25-20-45-47-45z"/>
    <rect class="fk" x="100" y="152" width="40" height="9" rx="4"/><rect class="fk" x="104" y="165" width="32" height="9" rx="4"/>
    <path class="sa" stroke-width="5" stroke-linecap="round" d="M108 112l12-22 12 22M112 104h16"/></g>
    <g class="sa pop2" stroke-width="5" stroke-linecap="round"><path d="M44 54l14 8M196 54l-14 8M34 100h16M206 100h-16M120 6v14"/></g></svg>`,
  target: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<circle class="fp pop" cx="112" cy="104" r="56"/><circle class="fa pop2" cx="112" cy="104" r="34"/><circle class="fp pop2" cx="112" cy="104" r="14"/>
    <g class="pop2"><path class="sk" stroke-width="6" stroke-linecap="round" d="M114 102L200 30"/><path class="fk" d="M200 30l-4 22 16-6 10-24-22 8z"/></g></svg>`,
  doc: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><rect class="fp sk" stroke-width="4" x="62" y="22" width="116" height="156" rx="10"/>
    <g class="sa" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M76 52l5 5 9-10M76 80l5 5 9-10M76 108l5 5 9-10M76 136l5 5 9-10"/></g>
    <g class="fl"><rect x="98" y="48" width="64" height="8" rx="4"/><rect x="98" y="76" width="52" height="8" rx="4"/><rect x="98" y="104" width="60" height="8" rx="4"/><rect x="98" y="132" width="46" height="8" rx="4"/></g></g></svg>`,
  mess: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2">
    <rect class="fp sk" stroke-width="4" x="44" y="40" width="74" height="52" rx="8" transform="rotate(-8 81 66)"/>
    <rect class="fa" x="124" y="34" width="70" height="50" rx="8" transform="rotate(7 159 59)"/>
    <rect class="fp sk" stroke-width="4" x="70" y="106" width="96" height="54" rx="8" transform="rotate(4 118 133)"/>
    <path class="sp" stroke-width="5" stroke-linecap="round" d="M146 52l26 18M172 52l-26 18"/></g></svg>`,
  people: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}
    <g class="fl pop"><circle cx="60" cy="88" r="16"/><path d="M32 150c0-18 12-32 28-32s28 14 28 32z"/><circle cx="180" cy="88" r="16"/><path d="M152 150c0-18 12-32 28-32s28 14 28 32z"/></g>
    <g class="pop2"><circle class="fa" cx="120" cy="74" r="22"/><path class="fa" d="M82 160c0-24 17-42 38-42s38 18 38 42z"/></g></svg>`,
  path: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}
    <path class="sk pop2" stroke-width="5" stroke-dasharray="2 12" stroke-linecap="round" d="M46 150C80 150 70 96 112 96s34-50 78-50"/>
    <g class="pop2"><circle class="fk" cx="46" cy="150" r="12"/><circle class="fa" cx="112" cy="96" r="12"/><rect class="fk" x="186" y="20" width="6" height="56" rx="3"/><path class="fa" d="M192 22h34l-9 12 9 12h-34z"/></g></svg>`,
  cross: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2">
    <rect class="fp sk" stroke-width="4" x="56" y="44" width="128" height="34" rx="8"/><rect class="fp sk" stroke-width="4" x="56" y="86" width="128" height="34" rx="8"/><rect class="fp sk" stroke-width="4" x="56" y="128" width="128" height="34" rx="8"/>
    <path class="sa" stroke-width="6" stroke-linecap="round" d="M50 61h140M50 103h140M50 145h140"/></g></svg>`,
  stopwatch: `<svg viewBox="0 0 240 200" aria-hidden="true"><circle class="fs pop" cx="120" cy="108" r="82"/><g class="pop2"><rect class="fk" x="108" y="14" width="24" height="14" rx="4"/><circle class="fp sk" stroke-width="7" cx="120" cy="110" r="66"/>
    <path class="fa" d="M120 110V52a58 58 0 0 1 50 29z"/><path class="sk" stroke-width="7" stroke-linecap="round" d="M120 110V70"/><circle class="fk" cx="120" cy="110" r="8"/></g></svg>`,
  laptop: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><rect class="fk" x="44" y="40" width="152" height="100" rx="10"/><rect class="fp" x="54" y="50" width="132" height="80" rx="4"/>
    <g class="fl"><rect x="64" y="62" width="60" height="7" rx="3"/><rect x="64" y="78" width="90" height="6" rx="3"/><rect x="64" y="92" width="70" height="6" rx="3"/><rect x="64" y="106" width="100" height="6" rx="3"/></g>
    <rect class="fa" x="64" y="62" width="34" height="7" rx="3"/><path class="fk" d="M28 146h184l-10 14H38z"/></g></svg>`,
  ask: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><path class="fa" d="M62 46h116a16 16 0 0 1 16 16v58a16 16 0 0 1-16 16h-58l-32 26v-26H62a16 16 0 0 1-16-16V62a16 16 0 0 1 16-16z"/>
    <path class="sp" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" d="M104 76c0-11 8-18 17-18s17 6 17 16c0 13-17 13-17 25"/><circle class="fp" cx="121" cy="116" r="6"/></g></svg>`,
  proof: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2" transform="translate(48 28) scale(6)"><path class="fp sa" stroke-width="1.6" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
    <path class="sa" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M9.5 12.2l1.8 1.8 3.4-3.6"/></g></svg>`,
  terminal: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><rect class="fk" x="40" y="42" width="160" height="116" rx="12"/><circle class="fa" cx="58" cy="58" r="5"/><circle class="fl" cx="74" cy="58" r="5"/><circle class="fl" cx="90" cy="58" r="5"/>
    <path class="sa" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" d="M62 92l18 14-18 14"/><rect class="fp" x="92" y="116" width="40" height="7" rx="3"/></g></svg>`,
  code: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><rect class="fp sk" stroke-width="5" x="48" y="40" width="144" height="120" rx="14"/>
    <path class="sa" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" d="M96 80l-22 20 22 20M144 80l22 20-22 20"/><path class="sk" stroke-width="7" stroke-linecap="round" d="M128 72l-16 56"/></g></svg>`,
  git: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><path class="sk" stroke-width="7" stroke-linecap="round" d="M80 46v108"/><path class="sa" stroke-width="7" stroke-linecap="round" d="M80 120c0-30 70-20 80-56"/>
    <circle class="fk" cx="80" cy="46" r="14"/><circle class="fk" cx="80" cy="154" r="14"/><circle class="fa" cx="160" cy="58" r="14"/><circle class="fp" cx="80" cy="46" r="6"/><circle class="fp" cx="80" cy="154" r="6"/><circle class="fp" cx="160" cy="58" r="6"/></g></svg>`,
  api: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><rect class="fp sk" stroke-width="5" x="30" y="66" width="62" height="68" rx="10"/><rect class="fk" x="148" y="56" width="62" height="88" rx="10"/>
    <g class="fl"><rect x="158" y="70" width="42" height="8" rx="4"/><rect x="158" y="86" width="42" height="8" rx="4"/><rect x="158" y="102" width="42" height="8" rx="4"/></g>
    <path class="sa" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" d="M98 86h40l-10-10M142 116h-40l10 10"/></g></svg>`,
  package: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><path class="fa" d="M120 36l66 32v66l-66 32-66-32V68z"/><path class="fp" d="M120 100l66-32-66-32-66 32z" opacity=".35"/>
    <path class="sp" stroke-width="5" stroke-linejoin="round" d="M54 68l66 32 66-32M120 100v66"/></g></svg>`,
  tree: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><path class="sk" stroke-width="5" d="M120 50L76 100M120 50l44 50M76 100l-24 48M76 100l24 48M164 100l24 48"/>
    <circle class="fa" cx="120" cy="50" r="20"/><circle class="fk" cx="76" cy="100" r="16"/><circle class="fk" cx="164" cy="100" r="16"/><circle class="fl" cx="52" cy="148" r="13"/><circle class="fl" cx="100" cy="148" r="13"/><circle class="fl" cx="188" cy="148" r="13"/>
    <text x="120" y="56" text-anchor="middle" font-size="18" font-weight="800" class="fp">1</text></g></svg>`,
  growth: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><path class="sk" stroke-width="5" stroke-linecap="round" d="M50 40v114h146"/>
    <path class="sa" stroke-width="6" stroke-linecap="round" d="M56 146C110 140 150 110 186 40"/><path class="sk" stroke-width="6" stroke-linecap="round" d="M56 120h130"/>
    <circle class="fa" cx="186" cy="40" r="7"/></g></svg>`,
  database: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><path class="fk" d="M64 52v96c0 13 25 24 56 24s56-11 56-24V52z"/><ellipse class="fa" cx="120" cy="52" rx="56" ry="20"/>
    <path class="sp" stroke-width="5" d="M64 88c0 13 25 24 56 24s56-11 56-24M64 120c0 13 25 24 56 24s56-11 56-24"/></g></svg>`,
  table: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><rect class="fp sk" stroke-width="5" x="40" y="46" width="160" height="110" rx="10"/><rect class="fa" x="42" y="48" width="156" height="26" rx="8"/>
    <path class="sk" stroke-width="3" d="M40 101h160M40 128h160M94 74v82M146 74v82"/></g></svg>`,
  architecture: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><rect class="fp sk" stroke-width="4" x="20" y="80" width="52" height="40" rx="8"/><rect class="fa" x="94" y="80" width="52" height="40" rx="8"/>
    <path class="fk" d="M168 82v36c0 6 12 10 26 10s26-4 26-10V82z"/><ellipse class="fa" cx="194" cy="82" rx="26" ry="9"/>
    <path class="sk" stroke-width="4" stroke-linecap="round" d="M74 100h16M148 100h16"/></g></svg>`,
  warning: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><path class="fa" d="M120 34l78 132H42z" stroke-linejoin="round"/><rect class="fp" x="114" y="78" width="12" height="46" rx="6"/><circle class="fp" cx="120" cy="142" r="8"/></g></svg>`,
  lock: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><path class="sk" stroke-width="12" d="M88 92V70a32 32 0 0 1 64 0v22"/><rect class="fa" x="70" y="88" width="100" height="80" rx="14"/>
    <circle class="fp" cx="120" cy="122" r="11"/><rect class="fp" x="115" y="126" width="10" height="22" rx="5"/></g></svg>`,
  hash: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><rect class="fp sk" stroke-width="4" x="22" y="78" width="72" height="44" rx="10"/><text x="58" y="106" text-anchor="middle" font-size="15" font-weight="700" class="fk">abc123</text>
    <path class="sa" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" d="M100 100h30l-10-10M130 100l-10 10"/>
    <rect class="fk" x="138" y="78" width="80" height="44" rx="10"/><text x="178" y="106" text-anchor="middle" font-size="13" font-weight="700" class="fa">$2b$x9#</text></g></svg>`,
  sparkle: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><path class="fa" d="M120 30c6 34 18 46 52 52-34 6-46 18-52 52-6-34-18-46-52-52 34-6 46-18 52-52z"/>
    <path class="fk" d="M178 120c3 16 9 22 25 25-16 3-22 9-25 25-3-16-9-22-25-25 16-3 22-9 25-25z"/><path class="fk" d="M62 126c2 10 6 14 16 16-10 2-14 6-16 16-2-10-6-14-16-16 10-2 14-6 16-16z"/></g></svg>`,
  shield: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><path class="fa" d="M120 28l62 22v44c0 40-27 66-62 80-35-14-62-40-62-80V50z"/>
    <path class="sp" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" d="M92 100l20 20 38-40"/></g></svg>`,
  test: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><rect class="fp sk" stroke-width="4" x="50" y="40" width="140" height="120" rx="12"/>
    <g class="sa" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M66 70l7 7 12-13M66 104l7 7 12-13M66 138l7 7 12-13"/></g>
    <g class="fl"><rect x="98" y="66" width="76" height="9" rx="4"/><rect x="98" y="100" width="60" height="9" rx="4"/><rect x="98" y="134" width="68" height="9" rx="4"/></g></g></svg>`,
  container: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><rect class="fk" x="36" y="62" width="168" height="84" rx="10"/>
    <g class="fa"><rect x="48" y="74" width="30" height="60" rx="4"/><rect x="86" y="74" width="30" height="60" rx="4"/><rect x="124" y="74" width="30" height="60" rx="4"/><rect x="162" y="74" width="30" height="60" rx="4"/></g>
    <path class="sk" stroke-width="5" stroke-linecap="round" d="M28 160h184"/></g></svg>`,
  loop: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><path class="sa" stroke-width="10" stroke-linecap="round" d="M70 100a50 50 0 0 1 90-30"/><path class="fa" d="M168 46l4 34-32-8z"/>
    <path class="sk" stroke-width="10" stroke-linecap="round" d="M170 100a50 50 0 0 1-90 30"/><path class="fk" d="M72 154l-4-34 32 8z"/></g></svg>`,
  rocket: `<svg viewBox="0 0 240 200" aria-hidden="true">${bg}<g class="pop2"><path class="fp sk" stroke-width="5" d="M120 26c26 18 36 48 30 90h-60c-6-42 4-72 30-90z"/><circle class="fa" cx="120" cy="74" r="12"/>
    <path class="fa" d="M90 100l-20 30h24zM150 100l20 30h-24z"/><path class="fa" d="M106 120h28l-14 40z"/></g></svg>`,
};
