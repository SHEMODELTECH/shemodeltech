// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 border-3 sm:border-4 md:border-[5px] border-blue-200 border-t-blue-500 rounded-full animate-spin mb-3 sm:mb-4 md:mb-5"></div>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 text-center px-4">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
