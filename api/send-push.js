// api/send-push.js
// Sends a Firebase Cloud Messaging (FCM) web push to one or more members.
// The sending itself (tokens, each member's push setting, app-icon number,
// removing dead tokens) lives in lib/push.js, shared with the timed jobs.
//
// POST body: { recipientUids: ["uid1", ...] OR recipientUid: "uid", title, body, link, level }
//   level: 'important' (default) or 'social' (mentions and replies)
// Auth: a shared secret in the `x-push-secret` header (PUSH_API_SECRET env var),
// OR a Firebase ID token in `authorization: Bearer <token>` (verified server-side).

const admin = require('../lib/firebaseAdmin');
const { guardPush } = require('../lib/sendGuard');
const { pushToUids } = require('../lib/push');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-push-secret');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ---- Auth: either a shared secret OR a valid Firebase ID token ----
  let authorized = false;
  let caller = null; // the signed-in sender (null when the server secret is used)
  const secret = req.headers['x-push-secret'];
  if (secret && process.env.PUSH_API_SECRET && secret === process.env.PUSH_API_SECRET) {
    authorized = true;
  } else {
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (idToken) {
      try {
        caller = await admin.auth().verifyIdToken(idToken);
        authorized = true;
      } catch (e) {
        // fall through to 401
      }
    }
  }
  if (!authorized) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { recipientUid, recipientUids, title, body: message, link, level } = body;
    let uids = Array.isArray(recipientUids) ? recipientUids : recipientUid ? [recipientUid] : [];
    if (!uids.length) return res.status(400).json({ error: 'No recipients' });
    if (!title || !message) return res.status(400).json({ error: 'title and body required' });

    // Staff can notify anyone; members up to 50 people at a time, companies only
    // people they're talking to, with a daily cap.
    let safeLink = link || '/';
    if (caller) {
      const g = await guardPush(caller, uids, link);
      if (!g.ok) return res.status(g.status || 403).json({ error: g.error });
      uids = g.uids;
      safeLink = g.link;
    }

    const r = await pushToUids(uids.slice(0, 1000), {
      title: String(title).slice(0, 120),
      body: String(message).slice(0, 300),
      link: safeLink,
      level: level === 'social' ? 'social' : 'important',
    });
    return res.status(200).json(r);
  } catch (e) {
    console.error('send-push error:', e);
    return res.status(500).json({ error: e.message });
  }
};
