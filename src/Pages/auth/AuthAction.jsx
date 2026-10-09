// src/Pages/auth/AuthAction.jsx - Firebase email action dispatcher.
// Firebase uses ONE action URL for every email link (password reset, email
// verification, email-change recovery). This page reads the `mode` and sends
// each one to the right branded She Model Tech flow - so no email link ever dead-ends
// on Firebase's plain default page, and every one offers a way back to sign in.
import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../../firebase/config';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { refreshEmailVerified } from '../../utils/emailVerification';
import { useAuth } from '../../context/AuthContext';

const AuthAction = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const mode = params.get('mode');
  const oobCode = params.get('oobCode');

  const [status, setStatus] = useState('working'); // working | done | error
  const [signedIn, setSignedIn] = useState(false);
  const [resend, setResend] = useState(''); // '' | sending | sent | wait | failed
  const { resendVerification } = useAuth();

  useEffect(() => {
    // Verification / email-recovery are applied here directly.
    if (mode !== 'verifyEmail' && mode !== 'recoverEmail') return;
    if (!oobCode) { setStatus('error'); return; }
    let alive = true;
    (async () => {
      // Wait until a saved sign-in has been restored, so we know who's here.
      try { await auth.authStateReady?.(); } catch (_) {}
      if (alive) setSignedIn(!!auth.currentUser);
      try {
        await applyActionCode(auth, oobCode);
      } catch (_) {
        // A used or expired code. The email may still be confirmed: the link
        // was opened twice, or an email app's link scanner opened it first.
        // Check before saying anything went wrong.
        if (mode === 'verifyEmail' && auth.currentUser) {
          const ok = await refreshEmailVerified();
          if (alive) setStatus(ok ? 'done' : 'error');
          return;
        }
        if (alive) setStatus('error');
        return;
      }
      // Already signed in (same browser)? Pick up the confirmation now, so
      // posting, messaging and applying work without signing in again.
      if (mode === 'verifyEmail' && auth.currentUser) await refreshEmailVerified();
      if (alive) setStatus('done');
    })();
    return () => { alive = false; };
  }, [mode, oobCode]);

  const sendNewLink = async () => {
    setResend('sending');
    try {
      await resendVerification();
      setResend('sent');
    } catch (e) {
      setResend(e?.code === 'rate-limited' ? 'wait' : 'failed');
    }
  };

  // Password reset -> reuse the existing branded reset page (form + strength
  // checklist + "Sign in now" on success).
  if (mode === 'resetPassword' && oobCode) {
    return <Navigate to={`/reset-password?oobCode=${encodeURIComponent(oobCode)}`} replace />;
  }

  // Email verification / email-change recovery -> confirm, then offer sign in.
  if (mode === 'verifyEmail' || mode === 'recoverEmail') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 text-center">
            {status === 'working' && (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto my-8"></div>
                <p className="text-gray-500 text-sm">Confirming, one moment…</p>
              </>
            )}
            {status === 'done' && (
              <>
                <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-gray-900 font-semibold mb-1">{mode === 'recoverEmail' ? 'Email change reversed' : 'Email verified'}</p>
                {mode === 'verifyEmail' && signedIn ? (
                  <>
                    <p className="text-gray-500 text-sm mb-6">Your account is all set - you can post, message and apply now.</p>
                    <button onClick={() => navigate('/dashboard')} className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-bold text-sm transition-all">Continue</button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-sm mb-6">Your account is all set - you can sign in now.</p>
                    <button onClick={() => navigate('/login')} className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-bold text-sm transition-all">Sign in now</button>
                  </>
                )}
              </>
            )}
            {status === 'error' && (
              <>
                <p className="text-gray-900 font-semibold mb-1">This link has already been used or has expired</p>
                {mode === 'verifyEmail' && signedIn ? (
                  <>
                    <p className="text-gray-500 text-sm mb-6">Your email isn't confirmed yet. We can send you a fresh link; open the newest email we send.</p>
                    <button
                      onClick={sendNewLink}
                      disabled={resend === 'sending' || resend === 'sent'}
                      className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-all"
                    >
                      {resend === 'sending' ? 'Sending…' : resend === 'sent' ? 'Sent. Check your inbox' : 'Send me a new link'}
                    </button>
                    {resend === 'wait' && <p className="text-gray-500 text-xs mt-3" aria-live="polite">We just sent one. Please wait a minute, then try again.</p>}
                    {resend === 'failed' && <p className="text-gray-500 text-xs mt-3" aria-live="polite">That didn't send. Please try again in a moment.</p>}
                    <button onClick={() => navigate('/dashboard')} className="w-full mt-3 text-sm font-semibold text-gray-700 hover:text-gray-900 py-2">Back to She Model Tech</button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 text-sm mb-6">If you've already confirmed your email, you're all set: just sign in. If not, sign in and use “Resend email” at the top of the page.</p>
                    <button onClick={() => navigate('/login')} className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-bold text-sm transition-all">Go to sign in</button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Unknown or missing mode -> send them somewhere useful rather than a blank page.
  return <Navigate to="/login" replace />;
};

export default AuthAction;
