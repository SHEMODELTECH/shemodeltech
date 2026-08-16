// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ dark = false }) => {
  return (
    <footer className={`border-t ${dark ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-white'} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/Images/she-model-tech-logo.png" alt="She Model Tech" className="h-11 sm:h-14 w-auto" />
          </div>
          <div className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm ${dark ? 'text-gray-500' : 'text-gray-500'}`}>
            <Link to="/about" className={`${dark ? 'hover:text-white' : 'hover:text-pink-600'} transition-colors font-medium`}>About</Link>
            <Link to="/terms" className={`${dark ? 'hover:text-white' : 'hover:text-pink-600'} transition-colors font-medium`}>Terms</Link>
            <Link to="/privacy" className={`${dark ? 'hover:text-white' : 'hover:text-pink-600'} transition-colors font-medium`}>Privacy</Link>
            <Link to="/support" className={`${dark ? 'hover:text-white' : 'hover:text-pink-600'} transition-colors font-medium`}>Support</Link>
          </div>
          <p className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>{new Date().getFullYear()} She Model Tech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
