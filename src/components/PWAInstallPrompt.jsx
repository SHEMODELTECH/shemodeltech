// src/components/PWAInstallPrompt.jsx
import React, { useState, useEffect } from 'react';
import { usePWA } from '../hooks/usePWA';

const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled, installing, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the prompt
    const hasBeenDismissed = localStorage.getItem('pwa-install-dismissed');
    if (!hasBeenDismissed && isInstallable && !isInstalled) {
      // Show prompt after a delay
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt || isInstalled || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-3 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-up">
      <div className="bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95 border border-orange-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-2xl">
        <div className="flex items-start gap-2.5 sm:gap-3">
          {/* App Icon */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-lg sm:text-xl">📱</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm sm:text-base mb-1">
              Install She Model Tech
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              Get quick access to projects, jobs, and your home feed from your home screen.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2">
              <button
                onClick={handleInstall}
                disabled={installing}
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:from-orange-600 hover:to-blue-600 active:from-orange-700 active:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
                aria-label="Install application"
              >
                {installing ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                    <span>Installing...</span>
                  </>
                ) : (
                  <>
                    <span className="mr-1.5">⚡</span>
                    <span>Install</span>
                  </>
                )}
              </button>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-white active:text-gray-600 px-3 py-2 text-xs sm:text-sm font-medium transition-colors rounded-lg hover:bg-white/5 active:bg-white/10"
                aria-label="Dismiss install prompt"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
