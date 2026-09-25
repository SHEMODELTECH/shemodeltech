// src/Pages/auth/Logout.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const Logout = () => {
  const { currentUser, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  const externalHomeUrl = '/';

  useEffect(() => {
    if (isLoggedOut && !error && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      window.location.href = externalHomeUrl;
    }
  }, [isLoggedOut, error, countdown]);

  useEffect(() => {
    if (currentUser && !isLoggedOut) {
      handleLogout();
    } else if (!currentUser) {
      setIsLoggedOut(true);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setError('');
      await logout();
      setIsLoggingOut(false);
      setIsLoggedOut(true);
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Failed to log out. Please try again.');
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">

          {/* Error state */}
          {error ? (
            <>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
              <p className="text-gray-500 text-sm mb-6">{error}</p>
              <button
                onClick={handleLogout}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Try again
              </button>
            </>
          ) : isLoggingOut ? (
            <>
              <div className="w-12 h-12 mx-auto mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Signing you out…</h1>
              <p className="text-gray-500 text-sm">One moment.</p>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">See you soon</h1>
              <p className="text-gray-500 text-sm mb-6">You've been signed out of She Model Tech.</p>

              {/* Redirect note */}
              {countdown > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-5">
                  <p className="text-sm text-gray-500">
                    Redirecting to home in <span className="font-bold text-gray-900">{countdown}</span> second{countdown !== 1 ? 's' : ''}…
                  </p>
                  <div className="mt-2 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-pink-600 h-full rounded-full transition-all duration-1000" style={{ width: `${((3 - countdown) / 3) * 100}%` }}></div>
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                <Link
                  to="/"
                  className="block w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Go to home
                </Link>
                <Link
                  to="/login"
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
                >
                  Sign in again
                </Link>
              </div>

              <p className="text-xs text-gray-400 mt-5">Your session has been securely ended.</p>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Logout;
