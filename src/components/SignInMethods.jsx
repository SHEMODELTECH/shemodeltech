// src/components/SignInMethods.jsx
// Settings > Account: how you sign in. Members who joined with Google can add a
// password (so they can also sign in with email), and anyone with a password
// can change it. It's the same account either way.
import React, { useState } from 'react';
import { EmailAuthProvider, linkWithCredential, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { auth } from '../firebase/config';

// Same rule as sign-up.
const validatePasswordStrength = (pw) => {
  if (!pw || pw.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[a-zA-Z]/.test(pw)) return 'Password must include at least one letter.';
  if (!/[0-9]/.test(pw)) return 'Password must include at least one number.';
  if (!/[^a-zA-Z0-9]/.test(pw)) return 'Password must include at least one symbol (e.g. ! @ # $ %).';
  return '';
};

const SignInMethods = () => {
  const user = auth.currentUser;
  const providers = (user?.providerData || []).map((p) => p.providerId);
  const hasGoogle = providers.includes('google.com');
  const hasPassword = providers.includes('password');
  const [current, setCurrent] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  if (!user) return null;

  const save = async (e) => {
    e.preventDefault();
    const err = validatePasswordStrength(pw);
    if (err) return toast.error(err);
    setBusy(true);
    try {
      if (hasPassword) {
        await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, current));
        await updatePassword(user, pw);
        toast.success('Password changed.');
      } else {
        await linkWithCredential(user, EmailAuthProvider.credential(user.email, pw));
        toast.success('Password added. You can now also sign in with your email and password.');
      }
      setDone(true);
      setPw('');
      setCurrent('');
    } catch (e2) {
      const code = e2?.code || '';
      toast.error(
        code === 'auth/wrong-password' || code === 'auth/invalid-credential'
          ? 'Your current password isn’t right.'
          : code === 'auth/requires-recent-login'
          ? 'For security, sign out and sign in again, then try once more.'
          : 'Could not save the password. Please try again.'
      );
    }
    setBusy(false);
  };

  const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-gray-900 font-bold text-base mb-1">Sign-in methods</h3>
      <p className="text-gray-500 text-sm mb-4">One account, however you sign in: {user.email}</p>
      <ul className="text-sm text-gray-700 space-y-1 mb-4">
        <li>{hasGoogle ? '✓' : '·'} Sign in with Google {hasGoogle ? '(on)' : '(not linked)'}</li>
        <li>{hasPassword || done ? '✓' : '·'} Email and password {hasPassword || done ? '(on)' : '(not set)'}</li>
      </ul>
      <form onSubmit={save} className="space-y-3 max-w-md">
        {hasPassword && (
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="pw-current">Current password</label>
            <input id="pw-current" type="password" autoComplete="current-password" className={input} value={current} onChange={(e) => setCurrent(e.target.value)} />
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="pw-new">
            {hasPassword ? 'New password' : 'Add a password'}{' '}
            <span className="font-normal text-gray-500">(at least 8 characters, with a letter, a number, and a symbol)</span>
          </label>
          <input id="pw-new" type="password" autoComplete="new-password" className={input} value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>
        <button type="submit" disabled={busy || !pw || (hasPassword && !current)} className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-5 py-2 rounded-lg disabled:opacity-50">
          {busy ? 'Saving...' : hasPassword ? 'Change password' : 'Add password'}
        </button>
      </form>
    </div>
  );
};

export default SignInMethods;
