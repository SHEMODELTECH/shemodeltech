// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Make sure Tailwind CSS is imported here
import './utils/toastSanitizer'; // Scrub vendor branding from all toasts app-wide
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
