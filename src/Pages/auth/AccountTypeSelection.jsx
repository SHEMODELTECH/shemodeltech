// src/Pages/auth/AccountTypeSelection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Navbar from '../../components/Navbar';

const AccountTypeSelection = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }

    const checkStatus = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', currentUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          // Once onboarding is complete, account type is locked - send them on.
          if (data.onboardingComplete) {
            navigate('/dashboard', { replace: true });
            return;
          }
          // If they already picked a type but haven't finished onboarding, pre-select
          // it but still let them change it here (they may have chosen by mistake).
          if (data.accountType) {
            setSelected(data.accountType);
          }
        }
      } catch (e) {
        console.error('Error checking account type:', e);
      }
      setChecking(false);
    };

    checkStatus();
  }, [currentUser, navigate]);

  const handleContinue = async () => {
    if (!selected || !currentUser) return;
    setSaving(true);

    try {
      const isCompany = selected === 'company';
      await updateDoc(doc(db, 'users', currentUser.uid), {
        accountType: selected,
        isCompany: isCompany,
      });
      navigate('/onboarding', { replace: true });
    } catch (error) {
      console.error('Error saving account type:', error);
      setSaving(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col relative bg-white">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-3 sm:px-4 relative z-10 py-8">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-pink-600 uppercase tracking-widest text-xs font-semibold mb-3">Getting Started</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              How will you use{' '}
              <span className="text-pink-600">She Model Tech</span>?
            </h1>
            <p className="text-gray-500 text-sm sm:text-base px-4">
              Choose your account type. This helps us personalize your experience.
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setSelected('individual')}
              className={`relative p-5 sm:p-6 rounded-2xl border-2 text-left transition-all duration-300 active:scale-[0.97] ${
                selected === 'individual'
                  ? 'border-pink-500 bg-pink-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {selected === 'individual' && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
              <div className={`text-base sm:text-lg font-bold mb-1.5 ${selected === 'individual' ? 'text-gray-900' : 'text-gray-700'}`}>
                Individual
              </div>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                I am a tech professional looking for projects, career tools, badges, and community.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelected('company')}
              className={`relative p-5 sm:p-6 rounded-2xl border-2 text-left transition-all duration-300 active:scale-[0.97] ${
                selected === 'company'
                  ? 'border-pink-500 bg-pink-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {selected === 'company' && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
              <div className={`text-base sm:text-lg font-bold mb-1.5 ${selected === 'company' ? 'text-gray-900' : 'text-gray-700'}`}>
                Company / Organisation
              </div>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                I am posting projects, hiring, or representing an organization that supports tech professionals.
              </p>
            </button>
          </div>

          {/* Continue */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={!selected || saving}
              className="w-full sm:w-auto px-10 py-3.5 min-h-[48px] bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg text-sm sm:text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Saving...
                </span>
              ) : (
                'Continue'
              )}
            </button>
          </div>

          <p className="text-gray-400 text-xs text-center mt-6">
            You can change this later from your profile settings.
          </p>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>
    </div>
  );
};

export default AccountTypeSelection;
