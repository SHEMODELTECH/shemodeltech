// src/components/OfflineIndicator.jsx
import React from 'react';
import { usePWA } from '../hooks/usePWA';

const OfflineIndicator = () => {
  const { isOnline } = usePWA();
  
  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 text-center transition-transform duration-300 ${
        isOnline ? '-translate-y-full' : 'translate-y-0'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-center space-x-2 max-w-7xl mx-auto">
        <svg 
          className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 animate-pulse" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" 
          />
        </svg>
        <span className="font-semibold text-xs sm:text-sm md:text-base leading-tight">
          <span className="hidden xs:inline">You're offline - </span>
          <span className="xs:hidden">Offline - </span>
          Some features may be limited
        </span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
