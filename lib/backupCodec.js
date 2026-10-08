// lib/backupCodec.js
// Turns Firestore data into plain JSON and back (timestamps, references,
// geo points and bytes are tagged so they restore as the right types), and
// seals a backup with AES-256-GCM so the stored file is unreadable without
// BACKUP_KEY. Shared by the backup job and scripts/restoreBackup.js.
const crypto = require('crypto');
const zlib = require('zlib');

const encodeValue = (v) => {
  if (v === null || v === undefined) return v ?? null;
  if (Array.isArray(v)) return v.map(encodeValue);
  if (typeof v === 'object') {
    const name = v.constructor && v.constructor.name;
    if (name === 'Timestamp' && typeof v.toMillis === 'function') return { __t: 'ts', s: v.seconds, n: v.nanoseconds };
    if (name === 'DocumentReference' && v.path) return { __t: 'ref', p: v.path };
    if (name === 'GeoPoint') return { __t: 'geo', la: v.latitude, lo: v.longitude };
    if (Buffer.isBuffer(v) || v instanceof Uint8Array) return { __t: 'bytes', b: Buffer.from(v).toString('base64') };
    const out = {};
    Object.keys(v).forEach((k) => { out[k] = encodeValue(v[k]); });
    return out;
  }
  return v;
};

const decodeValue = (v, admin, db) => {
  if (v === null || v === undefined) return v ?? null;
  if (Array.isArray(v)) return v.map((x) => decodeValue(x, admin, db));
  if (typeof v === 'object') {
    if (v.__t === 'ts') return new admin.firestore.Timestamp(v.s, v.n);
    if (v.__t === 'ref') return db.doc(v.p);
    if (v.__t === 'geo') return new admin.firestore.GeoPoint(v.la, v.lo);
    if (v.__t === 'bytes') return Buffer.from(v.b, 'base64');
    const out = {};
    Object.keys(v).forEach((k) => { out[k] = decodeValue(v[k], admin, db); });
    return out;
  }
  return v;
};

const keyFrom = (b64) => {
  const key = Buffer.from(String(b64 || ''), 'base64');
  if (key.length !== 32) throw new Error('BACKUP_KEY must be 32 random bytes, base64-encoded.');
  return key;
};

// File layout: "SMTB1" | 12-byte IV | 16-byte auth tag | encrypted gzip(JSON)
const seal = (obj, b64Key) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyFrom(b64Key), iv);
  const body = Buffer.concat([cipher.update(zlib.gzipSync(JSON.stringify(obj))), cipher.final()]);
  return Buffer.concat([Buffer.from('SMTB1'), iv, cipher.getAuthTag(), body]);
};

const open = (buf, b64Key) => {
  if (buf.slice(0, 5).toString() !== 'SMTB1') throw new Error('Not a She Model Tech backup file.');
  const iv = buf.slice(5, 17);
  const tag = buf.slice(17, 33);
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyFrom(b64Key), iv);
  decipher.setAuthTag(tag);
  let gz;
  try {
    gz = Buffer.concat([decipher.update(buf.slice(33)), decipher.final()]);
  } catch (_) {
    throw new Error('Could not open the backup: wrong BACKUP_KEY, or the file is damaged.');
  }
  return JSON.parse(zlib.gunzipSync(gz).toString('utf8'));
};

module.exports = { encodeValue, decodeValue, seal, open };
