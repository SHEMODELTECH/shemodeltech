// lib/push.js
// Phone and browser push (Firebase Cloud Messaging), used by api/send-push.js
// and by the server's timed jobs (event and project reminders).
//
// Each member chooses in Settings → Notifications:
//   pushPreference: 'all' (default) | 'important' | 'off'
// Every push has a level:
//   'important' - events, deadlines, applications, decisions, messages
//   'social'    - mentions and replies
// 'important' members only get important pushes; 'off' gets none.

const admin = require('./firebaseAdmin');

const wants = (pref, level) => {
  if (pref === 'off') return false;
  if (pref === 'important') return level !== 'social';
  return true;
};

// Unread notifications + unread messages, for the number on the app icon.
async function unreadCountFor(db, uid) {
  let n = 0;
  try {
    const c = await db.collection('notifications').where('userId', '==', uid).where('isRead', '==', false).count().get();
    n += c.data().count || 0;
  } catch (_) { /* optional */ }
  try {
    const convs = await db.collection('conversations').where('participants', 'array-contains', uid).get();
    convs.forEach((d) => { n += Number((d.data().unreadBy || {})[uid] || 0); });
  } catch (_) { /* optional */ }
  return n;
}

/**
 * Push to members. Never throws.
 * @param {string[]} uids
 * @param {{ title: string, body: string, link?: string, level?: 'important'|'social' }} msg
 * @returns {{ sent: number, failed: number, skipped: number }}
 */
async function pushToUids(uids, { title, body, link = '/', level = 'important' }) {
  const out = { sent: 0, failed: 0, skipped: 0 };
  if (!uids || !uids.length || !title || !body) return out;
  const db = admin.firestore();
  const messaging = admin.messaging();
  const unique = [...new Set(uids.filter(Boolean))];
  // A few members at a time: one at a time could run past the serverless time
  // limit for a large list (each member needs a few reads and a send).
  const one = async (uid) => {
    try {
      const snap = await db.collection('users').doc(uid).get();
      if (!snap.exists) { out.skipped += 1; return; }
      const u = snap.data();
      const tokens = (u.fcmTokens || []).filter(Boolean);
      if (!tokens.length || !wants(u.pushPreference || 'all', level)) { out.skipped += 1; return; }
      const badge = await unreadCountFor(db, uid);
      const r = await messaging.sendEachForMulticast({
        tokens,
        notification: { title, body },
        webpush: {
          notification: { title, body, icon: '/Images/512X512.png', badge: '/Images/512X512.png' },
          fcmOptions: { link: link || '/' },
        },
        data: { link: link || '/', badge: String(badge) },
      });
      out.sent += r.successCount;
      out.failed += r.failureCount;
      // Remove phones that are no longer registered.
      const bad = [];
      r.responses.forEach((x, i) => {
        const code = (x.error && x.error.code) || '';
        if (!x.success && (code.includes('registration-token-not-registered') || code.includes('invalid-registration-token') || code.includes('invalid-argument'))) {
          bad.push(tokens[i]);
        }
      });
      if (bad.length) {
        await db.collection('users').doc(uid).update({ fcmTokens: admin.firestore.FieldValue.arrayRemove(...bad) }).catch(() => {});
      }
    } catch (e) {
      console.error('push failed for', uid, e.message);
      out.failed += 1;
    }
  };
  for (let i = 0; i < unique.length; i += 10) {
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(unique.slice(i, i + 10).map(one));
  }
  return out;
}

module.exports = { pushToUids };
