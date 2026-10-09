// src/components/EmailConfirmBanner.jsx
// A small notice for members who signed up with email + password and haven't
// confirmed their email yet. Until they do, the database won't let them post,
// message or apply (firestore.rules, isVerified). Not shown to Google sign-ins
// (already confirmed), staff, or members who joined before the rule started.
//
// While it's showing, it quietly checks whether the email has been confirmed
// (when the app comes back to the screen, and once a minute), and refreshes the
// sign-in so the new status counts straight away.
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getUserDocCached } from '../utils/firestoreHelpers';
import {
  CONFIRM_EMAIL_MESSAGE,
  isConfirmEmailError,
  needsEmailConfirmation,
  refreshEmailVerified,
  setKnownNeedsConfirmation,
} from '../utils/emailVerification';

const CHECK_EVERY_MS = 60 * 1000;

const EmailConfirmBanner = () => {
  const { currentUser, resendVerification } = useAuth();
  const [profile, setProfile] = useState(null);
  const [confirmed, setConfirmed] = useState(!!currentUser?.emailVerified);
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [note, setNote] = useState('');

  // Her own profile (shared cache with the sidebar layout, so no extra read).
  useEffect(() => {
    if (!currentUser || currentUser.emailVerified) return undefined;
    let alive = true;
    getUserDocCached(currentUser.uid)
      .then((d) => { if (alive) setProfile(d); })
      .catch(() => {});
    return () => { alive = false; };
  }, [currentUser]);

  const needs = !confirmed && needsEmailConfirmation(currentUser, profile);

  useEffect(() => {
    if (profile || confirmed) setKnownNeedsConfirmation(needs);
  }, [needs, profile, confirmed]);

  // Confirmed elsewhere (link page, another tab via focus, etc.).
  useEffect(() => {
    const onVerified = () => setConfirmed(true);
    window.addEventListener('smt:email-verified', onVerified);
    return () => window.removeEventListener('smt:email-verified', onVerified);
  }, []);

  // While unconfirmed: check again on focus and once a minute; stop once confirmed.
  useEffect(() => {
    if (!needs) return undefined;
    let stop = false;
    const check = async () => {
      if (stop || document.visibilityState !== 'visible') return;
      if (await refreshEmailVerified()) setConfirmed(true);
    };
    const onShow = () => { if (document.visibilityState === 'visible') check(); };
    const timer = setInterval(check, CHECK_EVERY_MS);
    window.addEventListener('focus', onShow);
    document.addEventListener('visibilitychange', onShow);
    // A refused post/message/application that nobody caught: say why.
    const onRejection = (e) => {
      if (isConfirmEmailError(e?.reason)) toast.error(CONFIRM_EMAIL_MESSAGE, { toastId: 'confirm-email' });
    };
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      stop = true;
      clearInterval(timer);
      window.removeEventListener('focus', onShow);
      document.removeEventListener('visibilitychange', onShow);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, [needs]);

  if (!needs) return null;

  const resend = async () => {
    setSending(true);
    setNote('');
    try {
      await resendVerification();
      setNote(`Sent. Check your inbox (and spam folder) for an email from She Model Tech.`);
    } catch (e) {
      setNote(e?.code === 'rate-limited' || e?.code === 'auth/too-many-requests'
        ? 'We just sent one. Please wait a minute before asking for another.'
        : 'We couldn’t send the email just now. Please try again in a moment.');
    } finally {
      setSending(false);
    }
  };

  const confirmNow = async () => {
    setChecking(true);
    setNote('');
    try {
      if (await refreshEmailVerified()) {
        setConfirmed(true);
        toast.success('Thanks, your email is confirmed.');
      } else {
        setNote('We can’t see the confirmation yet. Open the link in the email, then tap this again.');
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <div role="status" className="mb-4 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 sm:flex sm:items-center sm:gap-4">
      <div className="flex-1 min-w-0">
        <p className="m-0 text-sm font-semibold text-gray-900">Confirm your email to post, message and apply.</p>
        <p className="m-0 mt-0.5 text-sm text-gray-700 break-words">
          We sent a link to <span className="font-medium text-gray-900">{currentUser.email}</span>.
        </p>
        {note && <p className="m-0 mt-1 text-xs text-gray-700" aria-live="polite">{note}</p>}
      </div>
      <div className="mt-3 sm:mt-0 flex flex-wrap gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={resend}
          disabled={sending}
          className="text-sm font-semibold border border-gray-300 bg-white text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 disabled:opacity-60"
        >
          {sending ? 'Sending…' : 'Resend email'}
        </button>
        <button
          type="button"
          onClick={confirmNow}
          disabled={checking}
          className="text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-60"
        >
          {checking ? 'Checking…' : 'I’ve confirmed it'}
        </button>
      </div>
    </div>
  );
};

export default EmailConfirmBanner;
