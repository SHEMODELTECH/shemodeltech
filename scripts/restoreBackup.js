#!/usr/bin/env node
// scripts/restoreBackup.js
// Open a She Model Tech database backup (made nightly by api/cron/backup.js),
// look inside it, save it as readable JSON, or put documents back in Firestore.
//
//   Look inside (safe, changes nothing):
//     BACKUP_KEY=... node scripts/restoreBackup.js <backup URL or file>
//   Save as readable JSON:
//     BACKUP_KEY=... node scripts/restoreBackup.js <backup> --out backup.json
//   Put documents back (asks for --yes; only the collections you name):
//     BACKUP_KEY=... GOOGLE_APPLICATION_CREDENTIALS=service-account.json \
//       node scripts/restoreBackup.js <backup> --restore --only users,projects --yes
//
// Restoring writes each saved document back as it was in the backup. It does
// not delete documents created after the backup. Without --only, every
// collection is restored.
const fs = require('fs');
const { open, decodeValue } = require('../lib/backupCodec');

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const source = args.find((a, i) => !a.startsWith('--') && !['--out', '--only', '--key'].includes(args[i - 1]));

(async () => {
  const key = opt('--key') || process.env.BACKUP_KEY;
  if (!source || !key) {
    console.log('Usage: BACKUP_KEY=... node scripts/restoreBackup.js <backup URL or file> [--out file.json] [--restore --only a,b --yes]');
    process.exit(1);
  }
  const buf = /^https?:\/\//.test(source)
    ? Buffer.from(await (await fetch(source)).arrayBuffer())
    : fs.readFileSync(source);
  const backup = open(buf, key);
  const groups = {};
  Object.keys(backup.docs).forEach((p) => { const top = p.split('/')[0]; groups[top] = (groups[top] || 0) + 1; });
  console.log(`Backup of ${backup.project} taken ${backup.at}: ${backup.count} documents${backup.truncated ? ' (INCOMPLETE)' : ''}`);
  Object.keys(groups).sort().forEach((g) => console.log(`  ${g.padEnd(32)} ${groups[g]}`));

  if (opt('--out')) {
    fs.writeFileSync(opt('--out'), JSON.stringify(backup, null, 1));
    console.log(`Saved readable copy to ${opt('--out')} (it contains members' personal data: keep it private and delete it when done).`);
  }

  if (!flag('--restore')) return;
  const only = (opt('--only') || '').split(',').map((s) => s.trim()).filter(Boolean);
  const paths = Object.keys(backup.docs).filter((p) => !only.length || only.includes(p.split('/')[0]));
  console.log(`\nWill write ${paths.length} documents${only.length ? ` in: ${only.join(', ')}` : ' (ALL collections)'}.`);
  if (!flag('--yes')) { console.log('Dry run. Add --yes to write them.'); return; }

  const admin = require('firebase-admin');
  if (!admin.apps.length) admin.initializeApp({ projectId: backup.project });
  const db = admin.firestore();
  let n = 0;
  for (let i = 0; i < paths.length; i += 400) {
    const batch = db.batch();
    paths.slice(i, i + 400).forEach((p) => batch.set(db.doc(p), decodeValue(backup.docs[p], admin, db)));
    await batch.commit();
    n += Math.min(400, paths.length - i);
    console.log(`  restored ${n}/${paths.length}`);
  }
  console.log('Done.');
})().catch((e) => { console.error(e.message || e); process.exit(1); });
