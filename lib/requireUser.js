// lib/requireUser.js
// Server-side check that a request comes from a signed-in She Model Tech member.
// The browser sends its Firebase ID token as "Authorization: Bearer <token>";
// we verify it with the Admin SDK. Used to stop strangers on the internet from
// using our paid services (Claude, file storage, email) through our endpoints.
const admin = require('./firebaseAdmin');

// Returns the decoded token ({ uid, email, ... }) or null.
async function getUser(req) {
  const header = req.headers.authorization || req.headers.Authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return null;
  try {
    return await admin.auth().verifyIdToken(token);
  } catch (_) {
    return null;
  }
}

// Replies 401 and returns null when there is no valid signed-in user.
async function requireUser(req, res) {
  const user = await getUser(req);
  if (!user) {
    res.status(401).json({ error: 'Sign in required' });
    return null;
  }
  return user;
}

// Simple per-key throttle stored in Firestore (serverless functions share no
// memory). Returns true if the action is allowed now, false if it's too soon.
async function throttle(key, seconds) {
  const db = admin.firestore();
  const ref = db.collection('_throttle').doc(key.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 300));
  const now = Date.now();
  try {
    const allowed = await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const last = snap.exists ? snap.data().at || 0 : 0;
      if (now - last < seconds * 1000) return false;
      tx.set(ref, { at: now });
      return true;
    });
    return allowed;
  } catch (_) {
    return true; // never block real users because the throttle itself failed
  }
}

module.exports = { getUser, requireUser, throttle };
