// src/components/Footer.jsx
// The one site footer, used on every public page so it stays consistent:
// logo · Team · Support Us · Terms · Privacy · social links.
import React from 'react';
import { Link } from 'react-router-dom';
import SocialLinks from './SocialLinks';

export const FOOTER_LINKS = [
  ['/team', 'Team'],
  ['/support-our-mission', 'Support Us'],
  ['/terms', 'Terms'],
  ['/privacy', 'Privacy'],
];

const Footer = ({ dark = false }) => (
  <footer className={`border-t ${dark ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-white'} py-8`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
      <Link to="/" aria-label="She Model Tech home">
        <img src="/Images/she-model-tech-logo.png" alt="She Model Tech" className="h-11 sm:h-14 w-auto" />
      </Link>
      <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
        {FOOTER_LINKS.map(([to, label]) => (
          <Link key={to} to={to} className={`${dark ? 'hover:text-white' : 'hover:text-pink-600'} transition-colors font-medium`}>{label}</Link>
        ))}
      </nav>
      <div className="flex flex-col items-center sm:items-end gap-2">
        <SocialLinks />
        <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'} text-center sm:text-right`}>
          © {new Date().getFullYear()} SHE MODEL TECH Inc., a 501(c)(3) nonprofit.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
