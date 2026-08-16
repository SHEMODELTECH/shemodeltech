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

const AuthAction = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const mode = params.get('mode');
  const oobCode = params.get('oobCode');

  const [status, setStatus] = useState('working'); // working | done | error

  useEffect(() => {
    // Verification / email-recovery are applied here directly.
    if (mode === 'verifyEmail' || mode === 'recoverEmail') {
      if (!oobCode) { setStatus('error'); return; }
      applyActionCode(auth, oobCode)
        .then(() => setStatus('done'))
        .catch(() => setStatus('error'));
    }
  }, [mode, oobCode]);

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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto my-8"></div>
                <p className="text-gray-500 text-sm">Confirming, one moment…</p>
              </>
            )}
            {status === 'done' && (
              <>
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-gray-900 font-semibold mb-1">{mode === 'recoverEmail' ? 'Email change reversed' : 'Email verified'}</p>
                <p className="text-gray-500 text-sm mb-6">Your account is all set - you can sign in now.</p>
                <button onClick={() => navigate('/login')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-all">Sign in now</button>
              </>
            )}
            {status === 'error' && (
              <>
                <p className="text-gray-900 font-semibold mb-1">This link has expired</p>
                <p className="text-gray-500 text-sm mb-6">It may already have been used. Please sign in, or request a new email.</p>
                <button onClick={() => navigate('/login')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-all">Go to sign in</button>
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
