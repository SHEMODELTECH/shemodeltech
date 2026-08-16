// api/auth/send-verification.js, Branded email-verification email.
// Generates the Firebase verification code with the Admin SDK, then emails a
// link to She Model Tech's OWN /auth/action page via Gmail SMTP - so verifying lands
// on the branded page (with a "Sign in now" button) instead of the default
// firebaseapp.com page that offers no way forward.
const { sendMail } = require('../../lib/mailer');
const admin = require('firebase-admin');

if (!admin.apps.length) {
 try {
 admin.initializeApp({
 credential: admin.credential.cert({
 type: 'service_account',
 project_id: process.env.FIREBASE_PROJECT_ID || 'she-model-tech',
 private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
 client_email: process.env.FIREBASE_CLIENT_EMAIL,
 }),
 projectId: process.env.FIREBASE_PROJECT_ID || 'she-model-tech',
 });
 } catch (err) {
 console.error('Firebase Admin init failed:', err.message);
 throw err;
 }
}

const SITE = process.env.SITE_URL || 'https://shemodeltech.com';

module.exports = async function handler(req, res) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
 res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 if (req.method === 'OPTIONS') return res.status(200).end();
 if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

 const email = String(req.body?.email || '').trim().toLowerCase();
 const name = String(req.body?.name || '').trim();
 if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
 return res.status(400).json({ error: 'Please enter a valid email address.' });
 }

 try {
 // Generate the verification link (carries the one-time oobCode). If the
 // account doesn't exist, respond success anyway (enumeration protection).
 let oobCode = '';
 try {
 const link = await admin.auth().generateEmailVerificationLink(email);
 oobCode = new URL(link).searchParams.get('oobCode') || '';
 } catch (err) {
 if (err.code === 'auth/user-not-found' || err.code === 'auth/email-not-found') {
 return res.status(200).json({ success: true });
 }
 throw err;
 }
 if (!oobCode) return res.status(200).json({ success: true });

 // Link to OUR branded action page - it applies the code and shows a
 // "Sign in now" button, so the flow never dead-ends.
 const verifyUrl = `${SITE}/auth/action?mode=verifyEmail&oobCode=${encodeURIComponent(oobCode)}`;

 const html = `
 <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:0 auto;padding:8px;color:#111827">
 <div style="text-align:center;padding:24px 0">
 <img src="${SITE}/Images/512X512.png" alt="She Model Tech" width="48" height="48" style="border-radius:10px" />
 </div>
 <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:32px 28px">
 <h1 style="font-size:20px;margin:0 0 12px">Welcome to She Model Tech${name ? `, ${name}` : ''}!</h1>
 <p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 20px">
 You're one click away. Confirm your email address to activate your account and start building.
 </p>
 <div style="text-align:center;margin:26px 0">
 <a href="${verifyUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:13px 28px;border-radius:12px">
 Verify my email
 </a>
 </div>
 <p style="font-size:13px;line-height:1.6;color:#6b7280;margin:0 0 6px">
 If the button doesn't work, copy and paste this link into your browser:
 </p>
 <p style="font-size:12px;line-height:1.5;word-break:break-all;margin:0 0 20px">
 <a href="${verifyUrl}" style="color:#2563eb">${verifyUrl}</a>
 </p>
 <p style="font-size:13px;line-height:1.6;color:#6b7280;margin:0">
 If you didn't create an She Model Tech account, you can safely ignore this email.
 </p>
 </div>
 <p style="text-align:center;font-size:12px;color:#9ca3af;margin:20px 0">
 She Model Tech &middot; <a href="${SITE}" style="color:#9ca3af">shemodeltech.com</a>
 </p>
 </div>`;

 await sendMail({
 to: email,
 subject: 'Verify your email to activate your She Model Tech account',
 html,
 });

 return res.status(200).json({ success: true });
 } catch (err) {
 console.error('send-verification error:', err.message);
 return res.status(500).json({ error: 'Could not send the verification email. Please try again.' });
 }
};
