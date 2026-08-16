// api/payments/stripe-webhook.js
//
// Stripe tells us what actually happened. This is the ONLY place partner
// access is granted, never the browser, and never the success page. A user
// can navigate to a success URL without paying; only a verified webhook
// signature proves money moved.
//
// Handles:
// checkout.session.completed -> activate access / record sponsorship
// customer.subscription.updated -> extend or downgrade
// customer.subscription.deleted -> downgrade to free
// invoice.payment_failed -> flag, don't cut off immediately
//
// Required env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
//
// NOTE: this route needs the raw body for signature verification, so Vercel's
// automatic JSON body parsing is disabled below.

const admin = require('../../lib/firebaseAdmin');

module.exports.config = { api: { bodyParser: false } };

const readRawBody = (req) => new Promise((resolve, reject) => {
 const chunks = [];
 req.on('data', c => chunks.push(c));
 req.on('end', () => resolve(Buffer.concat(chunks)));
 req.on('error', reject);
});

const addInterval = (date, interval) => {
 const d = new Date(date);
 if (interval === 'year') d.setFullYear(d.getFullYear() + 1);
 else d.setMonth(d.getMonth() + 1);
 return d;
};

module.exports = async (req, res) => {
 if (req.method !== 'POST') return res.status(405).end();
 if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
 return res.status(503).json({ error: 'Payments not configured.' });
 }

 // eslint-disable-next-line global-require
 const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
 const db = admin.firestore();

 let event;
 try {
 const raw = await readRawBody(req);
 event = stripe.webhooks.constructEvent(
 raw, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET
 );
 } catch (err) {
 console.error('signature verification failed:', err.message);
 return res.status(400).send(`Webhook Error: ${err.message}`);
 }

 try {
 // Idempotency: Stripe retries, and we must not double-apply.
 const seenRef = db.collection('stripe_events').doc(event.id);
 if ((await seenRef.get()).exists) return res.status(200).json({ received: true });

 switch (event.type) {
 case 'checkout.session.completed': {
 const s = event.data.object;
 const uid = s.client_reference_id || s.metadata?.uid;
 if (!uid) break;

 if (s.mode === 'subscription') {
 const interval = s.metadata?.interval === 'year' ? 'year' : 'month';
 await db.collection('users').doc(uid).update({
 tier: 'partner',
 partnerSince: new Date().toISOString(),
 partnerUntil: addInterval(new Date(), interval).toISOString(),
 stripeCustomerId: s.customer || null,
 stripeSubscriptionId: s.subscription || null,
 });
 } else if (s.mode === 'payment') {
 // A sponsorship. Record it as FUNDED, money is confirmed received.
 const userSnap = await db.collection('users').doc(uid).get();
 const u = userSnap.exists ? userSnap.data() : {};
 await db.collection('sponsorships').add({
 companyId: uid,
 companyName: u.companyName || u.displayName || 'A sponsor',
 companyLogo: u.photoURL || null,
 companyWebsite: u.website || null,
 cohortId: s.metadata?.cohortId || null,
 projectId: s.metadata?.projectId || null,
 amount: (s.amount_total || 0) / 100,
 currency: 'USD',
 status: 'funded',
 firstLookDays: 14,
 stripeSessionId: s.id,
 fundedAt: new Date().toISOString(),
 createdAt: new Date().toISOString(),
 });
 await db.collection('admin_notifications').add({
 type: 'sponsorship_received',
 message: `${u.companyName || 'A company'} sponsored $${(s.amount_total || 0) / 100}. Allocate it to a team.`,
 isRead: false,
 createdAt: new Date().toISOString(),
 });
 }
 break;
 }

 case 'customer.subscription.updated': {
 const sub = event.data.object;
 const q = await db.collection('users')
 .where('stripeSubscriptionId', '==', sub.id).limit(1).get();
 if (q.empty) break;
 const active = ['active', 'trialing'].includes(sub.status);
 await q.docs[0].ref.update({
 tier: active ? 'partner' : 'free',
 partnerUntil: sub.current_period_end
 ? new Date(sub.current_period_end * 1000).toISOString()
 : null,
 subscriptionStatus: sub.status,
 });
 break;
 }

 case 'customer.subscription.deleted': {
 const sub = event.data.object;
 const q = await db.collection('users')
 .where('stripeSubscriptionId', '==', sub.id).limit(1).get();
 if (q.empty) break;
 // Downgrade to free. They keep the free tier, posting roles, the
 // Activity Wall, replies, they only lose the paid tooling.
 await q.docs[0].ref.update({
 tier: 'free',
 subscriptionStatus: 'cancelled',
 stripeSubscriptionId: null,
 });
 break;
 }

 case 'invoice.payment_failed': {
 const inv = event.data.object;
 const q = await db.collection('users')
 .where('stripeCustomerId', '==', inv.customer).limit(1).get();
 if (q.empty) break;
 // Flag, but do NOT cut access on a single failure, cards expire, and
 // abrupt cut-off mid-hiring is a bad experience for everyone.
 await q.docs[0].ref.update({ paymentFailedAt: new Date().toISOString() });
 break;
 }

 default:
 break;
 }

 await seenRef.set({ type: event.type, at: new Date().toISOString() });
 return res.status(200).json({ received: true });
 } catch (err) {
 console.error('webhook handler failed:', err);
 // 500 makes Stripe retry, which is what we want on a transient failure.
 return res.status(500).json({ error: 'handler failed' });
 }
};
