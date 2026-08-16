// api/send-push.js
// Sends a Firebase Cloud Messaging (FCM) web push to one or more users.
// Looks up each recipient's stored fcmTokens (on their user doc) and sends.
// Prunes tokens that FCM reports as invalid/unregistered.
//
// POST body: { recipientUids: ["uid1", ...] OR recipientUid: "uid", title, body, link }
// Auth: pass a shared secret in the `x-push-secret` header (PUSH_API_SECRET env var),
// OR a Firebase ID token in `authorization: Bearer <token>` (verified server-side).

const admin = require('firebase-admin');

// ---- Initialize Firebase Admin once ----
if (!admin.apps.length) {
  try {
    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } catch (e) {
    console.error('Firebase Admin init failed:', e.message);
  }
}

const db = admin.firestore();
const messaging = admin.messaging();

// Collect FCM tokens for a list of uids from their user docs.
async function getTokensForUids(uids) {
  const tokenMap = {}; // token -> uid (so we can prune the right user's token on failure)
  await Promise.all(
    uids.map(async (uid) => {
      try {
        const snap = await db.collection('users').doc(uid).get();
        if (!snap.exists) return;
        const tokens = snap.data().fcmTokens || [];
        tokens.forEach((t) => { if (t) tokenMap[t] = uid; });
      } catch (e) {
        console.error('token lookup failed for', uid, e.message);
      }
    })
  );
  return tokenMap;
}

// Remove dead tokens from a user's doc.
async function pruneTokens(uid, badTokens) {
  if (!badTokens.length) return;
  try {
    await db.collection('users').doc(uid).update({
      fcmTokens: admin.firestore.FieldValue.arrayRemove(...badTokens),
    });
  } catch (e) {
    console.error('prune failed for', uid, e.message);
  }
}

module.exports = async (req, res) => {
  // CORS (same-origin in practice, but be permissive for the app domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-push-secret');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ---- Auth: either a shared secret OR a valid Firebase ID token ----
  let authorized = false;
  const secret = req.headers['x-push-secret'];
  if (secret && process.env.PUSH_API_SECRET && secret === process.env.PUSH_API_SECRET) {
    authorized = true;
  } else {
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (idToken) {
      try {
        await admin.auth().verifyIdToken(idToken);
        authorized = true;
      } catch (e) {
        // fall through to 401
      }
    }
  }
  if (!authorized) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { recipientUid, recipientUids, title, body: message, link } = body;
    const uids = (recipientUids && Array.isArray(recipientUids))
      ? recipientUids
      : (recipientUid ? [recipientUid] : []);

    if (!uids.length) return res.status(400).json({ error: 'No recipients' });
    if (!title || !message) return res.status(400).json({ error: 'title and body required' });

    const tokenMap = await getTokensForUids(uids);
    const tokens = Object.keys(tokenMap);
    if (!tokens.length) return res.status(200).json({ sent: 0, reason: 'no tokens' });

    // Send to all tokens.
    const messagePayload = {
      notification: { title, body: message },
      webpush: {
        notification: {
          title,
          body: message,
          icon: '/Images/512X512.png',
          badge: '/Images/512X512.png',
        },
        fcmOptions: { link: link || '/' },
      },
      data: { link: link || '/' },
    };

    const result = await messaging.sendEachForMulticast({
      tokens,
      ...messagePayload,
    });

    // Prune invalid tokens.
    const badByUid = {};
    result.responses.forEach((r, i) => {
      if (!r.success) {
        const code = r.error?.code || '';
        if (code.includes('registration-token-not-registered') || code.includes('invalid-registration-token') || code.includes('invalid-argument')) {
          const token = tokens[i];
          const uid = tokenMap[token];
          (badByUid[uid] = badByUid[uid] || []).push(token);
        }
      }
    });
    await Promise.all(Object.entries(badByUid).map(([uid, toks]) => pruneTokens(uid, toks)));

    return res.status(200).json({ sent: result.successCount, failed: result.failureCount });
  } catch (e) {
    console.error('send-push error:', e);
    return res.status(500).json({ error: e.message });
  }
};
