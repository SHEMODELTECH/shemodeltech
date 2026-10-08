// lib/backupJob.js
//
// Daily backup of the whole Firestore database (Vercel Cron, via /api/cron/project-reminders?task=backup; it lives there
// because the Hobby plan allows only 12 serverless functions), free on the
// Spark plan. Every document is read with the Admin SDK, saved as JSON,
// compressed and ENCRYPTED (AES-256-GCM, key in the BACKUP_KEY environment
// variable), then stored in Vercel Blob under backups/. Blob files have public
// links, which is why they're encrypted: without the key a file is useless.
// The newest KEEP backups are kept; older ones are deleted.
//
// Reads: a backup reads every document once. Spark allows 50,000 reads a day,
// so once the database passes WEEKLY_OVER documents the backup runs on
// Sundays only, and it stops early rather than go past MAX_READS.
//
// Restoring: see scripts/restoreBackup.js. The last result is saved in
// app_settings/backup_status, and a failure emails the team.
//
// Subcollections are found by name (collection-group queries). When a new
// subcollection name is added anywhere in the app, add it to SUBCOLLECTIONS.
const { put, list, del } = require('@vercel/blob');
const admin = require('./firebaseAdmin');
const { sendMail } = require('./mailer');
const { encodeValue, seal } = require('./backupCodec');

const SUBCOLLECTIONS = [
  'private', 'chunks', 'learners', 'members', 'threads', 'replies', 'ratings', 'reactions',
  'comments', 'messages', 'learning_progress', 'notifications',
];
const KEEP = 14;
const WEEKLY_OVER = 15000;
const MAX_READS = 30000;
const PREFIX = 'backups/';
const TEAM_EMAIL = process.env.SUPPORT_EMAIL || 'shemodeltech@gmail.com';

// Called after the caller has checked CRON_SECRET.
const runBackup = async (req, res) => {
  if (!process.env.BACKUP_KEY || !process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ error: 'BACKUP_KEY or BLOB_READ_WRITE_TOKEN is not set' });
  }

  const db = admin.firestore();
  const statusRef = db.doc('app_settings/backup_status');
  try {
    const last = (await statusRef.get()).data() || {};
    const force = req.query && req.query.force === '1';
    if (!force && (last.docs || 0) > WEEKLY_OVER && new Date().getUTCDay() !== 0) {
      return res.status(200).json({ skipped: 'large database: backups run on Sundays' });
    }

    const docs = {};
    let reads = 0;
    let truncated = false;
    const take = (snap) => {
      snap.forEach((d) => { docs[d.ref.path] = encodeValue(d.data()); });
      reads += snap.size;
      if (reads > MAX_READS) truncated = true;
    };
    const top = (await db.listCollections()).map((c) => c.id);
    for (const id of top) {
      if (truncated) break;
      take(await db.collection(id).get());
    }
    for (const id of SUBCOLLECTIONS) {
      if (truncated) break;
      const snap = await db.collectionGroup(id).get();
      // Top-level collections with the same name were already saved above.
      const nested = snap.docs.filter((d) => d.ref.path.split('/').length > 2);
      nested.forEach((d) => { docs[d.ref.path] = encodeValue(d.data()); });
      reads += snap.size;
      if (reads > MAX_READS) truncated = true;
    }

    const at = new Date().toISOString();
    const count = Object.keys(docs).length;
    const file = seal({ version: 1, project: process.env.FIREBASE_PROJECT_ID || 'she-model-tech', at, count, truncated, docs }, process.env.BACKUP_KEY);
    const blob = await put(`${PREFIX}firestore-${at.slice(0, 10)}.smtb`, file, {
      access: 'public', addRandomSuffix: true, contentType: 'application/octet-stream',
    });

    // Keep the newest KEEP backups.
    const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
    const old = blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(KEEP);
    if (old.length) await del(old.map((b) => b.url));

    await statusRef.set({ ok: !truncated, lastAt: at, docs: count, bytes: file.length, url: blob.url, truncated, error: null }, { merge: true });
    if (truncated) {
      await sendMail({
        to: TEAM_EMAIL,
        subject: 'She Model Tech backup was cut short',
        html: `<p>Last night's database backup stopped after ${reads} reads to stay inside the free daily limit, so it is incomplete (${count} documents saved).</p><p>The database has outgrown free backups: time to move to Firebase's Blaze plan and turn on its built-in backups.</p>`,
      }).catch(() => {});
    }
    return res.status(200).json({ ok: true, docs: count, bytes: file.length, truncated, deleted: old.length });
  } catch (e) {
    console.error('backup failed:', e);
    await statusRef.set({ ok: false, failedAt: new Date().toISOString(), error: String(e.message || e).slice(0, 500) }, { merge: true }).catch(() => {});
    await sendMail({
      to: TEAM_EMAIL,
      subject: 'She Model Tech backup failed',
      html: `<p>Last night's database backup failed:</p><pre>${String(e.message || e).replace(/</g, '&lt;').slice(0, 1000)}</pre><p>The previous backups are still stored. Check the Vercel logs for /api/cron/project-reminders (task=backup).</p>`,
    }).catch(() => {});
    return res.status(500).json({ error: 'backup failed' });
  }
};

module.exports = { runBackup };
