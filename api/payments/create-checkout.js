// api/payments/create-checkout.js
//
// Creates a Stripe Checkout session for money coming IN:
//   - mode 'subscription' -> Talent Access
//   - mode 'payment'      -> a one-off cohort sponsorship
//
// This endpoint never pays anyone OUT. Company-to-member payment happens
// directly between them; see src/config/payments.js for why that separation
// matters legally.
//
// Required env:
//   STRIPE_SECRET_KEY
//   SITE_URL

const admin = require('../../lib/firebaseAdmin');

const SITE = process.env.SITE_URL || 'https://shemodeltech.com';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(503).json({ error: 'Payments are not configured yet.' });
  }

  // eslint-disable-next-line global-require
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  try {
    const { idToken, kind, priceId, amount, label, cohortId, projectId } = req.body || {};

    // Verify the caller. Never trust a uid sent from the browser.
    if (!idToken) return res.status(401).json({ error: 'Not signed in.' });
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const userSnap = await admin.firestore().collection('users').doc(uid).get();
    if (!userSnap.exists) return res.status(403).json({ error: 'No profile found.' });
    const user = userSnap.data();

    if (!user.isCompany) {
      // Members never pay for anything on this platform.
      return res.status(403).json({ error: 'Only company accounts make payments.' });
    }

    const common = {
      customer_email: user.email,
      client_reference_id: uid,
      metadata: { uid, kind, cohortId: cohortId || '', projectId: projectId || '' },
      allow_promotion_codes: true,
    };

    let session;

    if (kind === 'subscription') {
      if (!priceId) return res.status(400).json({ error: 'Missing price.' });
      session = await stripe.checkout.sessions.create({
        ...common,
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${SITE}/partner/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE}/partner`,
      });
    } else if (kind === 'sponsorship') {
      const cents = Math.round(Number(amount) * 100);
      if (!cents || cents < 100) {
        return res.status(400).json({ error: 'Invalid sponsorship amount.' });
      }
      session = await stripe.checkout.sessions.create({
        ...common,
        mode: 'payment',
        line_items: [{
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: cents,
            product_data: {
              name: label || 'Cohort sponsorship',
              description: 'Funds training stipends for women on a She Model Tech cohort.',
            },
          },
        }],
        success_url: `${SITE}/sponsor/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE}/sponsor`,
      });
    } else {
      return res.status(400).json({ error: 'Unknown payment kind.' });
    }

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('create-checkout failed:', err);
    return res.status(500).json({ error: 'Could not start checkout.' });
  }
};
