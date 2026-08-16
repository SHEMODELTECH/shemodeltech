// src/Pages/auth/ResetPassword.jsx - Custom styled password reset landing page.
// Handles the Firebase reset link (oobCode) so users set a new password on a
// branded page with a live strength checklist, instead of Firebase's plain page.
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAuthErrorMessage } from '../../firebase/config';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Same strong-password rule as sign-up: 8+ chars, letter, number, symbol.
const validatePasswordStrength = (pw) => {
  if (!pw || pw.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[a-zA-Z]/.test(pw)) return 'Password must include at least one letter.';
  if (!/[0-9]/.test(pw)) return 'Password must include at least one number.';
  if (!/[^a-zA-Z0-9]/.test(pw)) return 'Password must include at least one symbol (e.g. ! @ # $ %).';
  return '';
};

const ResetPassword = () => {
  const { verifyResetCode, confirmReset } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const oobCode = params.get('oobCode');

  const [checking, setChecking] = useState(true);
  const [validCode, setValidCode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!oobCode) { setChecking(false); setValidCode(false); return; }
    verifyResetCode(oobCode)
      .then((mail) => { setEmail(mail); setValidCode(true); })
      .catch(() => setValidCode(false))
      .finally(() => setChecking(false));
  }, [oobCode, verifyResetCode]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    const pwError = validatePasswordStrength(password);
    if (pwError) { setError(pwError); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    try {
      setSubmitting(true);
      await confirmReset(oobCode, password);
      setDone(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Reset your password</h1>

          {checking ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : done ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-gray-900 font-semibold mb-1">Password updated</p>
              <p className="text-gray-500 text-sm mb-6">Your password has been changed successfully.</p>
              <button onClick={() => navigate('/login')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-all">Sign in now</button>
              <p className="text-gray-500 text-sm mt-4">You can now sign in with your new password. <button onClick={() => navigate('/login')} className="text-blue-600 font-semibold hover:underline">Sign in here</button></p>
            </div>
          ) : !validCode ? (
            <div className="text-center py-4">
              <p className="text-gray-600 text-sm mb-6">This reset link is invalid or has expired. Please request a new password reset email.</p>
              <button onClick={() => navigate('/login')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-all">Back to sign in</button>
            </div>
          ) : (
            <>
              {email && <p className="text-gray-500 text-sm text-center mb-5">for <span className="font-medium text-gray-700">{email}</span></p>}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                />
                <ul className="text-[11px] space-y-0.5 -mt-1">
                  {[
                    ['8+ characters', password.length >= 8],
                    ['A letter', /[a-zA-Z]/.test(password)],
                    ['A number', /[0-9]/.test(password)],
                    ['A symbol (! @ # $ ...)', /[^a-zA-Z0-9]/.test(password)],
                  ].map(([label, ok]) => (
                    <li key={label} className={ok ? 'text-green-600' : 'text-gray-400'}>
                      {ok ? '✓' : '○'} {label}
                    </li>
                  ))}
                </ul>
                <input
                  type="password" value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="submit" disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50 transition-all"
                >
                  {submitting ? 'Updating…' : 'Update password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
