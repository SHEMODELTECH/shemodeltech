// src/components/PWAUpdateBanner.jsx
import React, { useState } from 'react';
import { usePWA } from '../hooks/usePWA';

const PWAUpdateBanner = () => {
  const { updateAvailable, updateApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!updateAvailable || dismissed) {
    return null;
  }

  const handleUpdate = () => {
    updateApp();
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-4 py-2.5 sm:py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Left section with icon and text */}
        <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <span className="text-lg sm:text-xl flex-shrink-0 mt-0.5 sm:mt-0">🔄</span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-xs sm:text-sm md:text-base truncate">
              New version available!
            </p>
            <p className="text-[10px] sm:text-xs md:text-sm opacity-90 hidden xs:block sm:truncate">
              Update to get the latest features and improvements.
            </p>
            {/* Shorter message for very small screens */}
            <p className="text-[10px] opacity-90 xs:hidden truncate">
              Update for new features.
            </p>
          </div>
        </div>

        {/* Right section with buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={handleUpdate}
            className="bg-white/20 hover:bg-white/30 active:bg-white/40 text-white px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap"
            aria-label="Update application now"
          >
            <span className="hidden sm:inline">Update Now</span>
            <span className="sm:hidden">Update</span>
          </button>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white active:text-white/90 px-1 sm:px-2 py-1 sm:py-2 text-lg sm:text-xl transition-colors"
            aria-label="Dismiss update notification"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdateBanner;
