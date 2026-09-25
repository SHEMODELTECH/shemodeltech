// src/components/FormSection.jsx
import React from 'react';

const FormSection = ({ title, children }) => {
  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg shadow-md mb-3 sm:mb-4 md:mb-6">
      <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 pb-2 border-b border-gray-200">
        {title}
      </h2>
      <div className="space-y-3 sm:space-y-4">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
