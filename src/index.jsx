// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Make sure Tailwind CSS is imported here
import './utils/toastSanitizer'; // Scrub vendor branding from all toasts app-wide
import App from './App';

// Keep the browser's "install app" offer (Android and laptops) so the
// dashboard can show an Install button whenever the member is ready.
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__smtInstallPrompt = e;
  window.dispatchEvent(new Event('smt-installable'));
});
window.addEventListener('appinstalled', () => {
  window.__smtInstallPrompt = null;
  window.dispatchEvent(new Event('smt-installed'));
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
