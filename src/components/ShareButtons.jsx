// src/components/ShareButtons.jsx
// Share a public She Model Tech page (an event or a project).
// - Phones (and browsers that support it): "Share" opens the device's own share
//   menu, which includes WhatsApp, Instagram, LinkedIn, Messages, and so on.
// - Everywhere: LinkedIn, WhatsApp, X, Facebook, Email, and Copy link.
// The link is a /s/... address, so LinkedIn and WhatsApp show a preview card with
// the event's or project's own title, description, and image.
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ICONS = {
  linkedin: 'M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.2 8h4.6v14H.2V8zm7.5 0h4.4v1.9h.06c.61-1.16 2.11-2.38 4.35-2.38 4.65 0 5.5 3.06 5.5 7.04V22h-4.6v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.53 1.72-2.53 3.49V22H7.7V8z',
  whatsapp: 'M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.03c-.24.68-1.42 1.3-1.96 1.35-.5.05-.97.23-3.27-.68-2.77-1.09-4.53-3.93-4.67-4.11-.13-.18-1.11-1.48-1.11-2.83 0-1.35.71-2.01.96-2.29.25-.27.55-.34.73-.34.18 0 .37 0 .53.01.17.01.4-.06.62.48.24.56.8 1.94.87 2.08.07.14.12.3.02.48-.09.18-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.29-.12.56.16.27.71 1.17 1.52 1.9 1.05.93 1.93 1.22 2.2 1.36.27.14.43.12.59-.07.16-.18.68-.8.86-1.07.18-.27.36-.23.61-.14.25.09 1.59.75 1.86.89.27.14.45.2.52.32.07.11.07.65-.17 1.33z',
  x: 'M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z',
  facebook: 'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.9 3.78-3.9 1.09 0 2.24.19 2.24.19v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34v7c4.78-.75 8.43-4.9 8.43-9.9z',
};

const Icon = ({ name }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={ICONS[name]} /></svg>
);

const ShareButtons = ({ url, text, title = 'She Model Tech', compact = false }) => {
  const [copied, setCopied] = useState(false);
  const message = `${text} ${url}`;
  const canNative = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const native = async () => {
    try {
      await navigator.share({ title, text, url });
    } catch (_) {
      /* closed the share menu */
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied. Paste it anywhere, including Instagram.');
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {
      window.prompt('Copy this link:', url);
    }
  };

  const links = [
    ['linkedin', 'LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`],
    ['whatsapp', 'WhatsApp', `https://wa.me/?text=${encodeURIComponent(message)}`],
    ['x', 'X', `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`],
    ['facebook', 'Facebook', `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`],
  ];
  const pill = 'inline-flex items-center gap-1.5 text-sm font-semibold border border-gray-300 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-50';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canNative && (
        <button type="button" onClick={native} className="inline-flex items-center gap-1.5 text-sm font-semibold bg-gray-900 hover:bg-black text-white px-3.5 py-2 rounded-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v14" /></svg>
          Share
        </button>
      )}
      {links.map(([k, l, href]) => (
        <a key={k} href={href} target="_blank" rel="noopener noreferrer" className={pill} aria-label={`Share on ${l}`}>
          <Icon name={k} />
          {!compact && <span>{l}</span>}
        </a>
      ))}
      <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message)}`} className={pill} aria-label="Share by email">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        {!compact && <span>Email</span>}
      </a>
      <button type="button" onClick={copy} className={pill}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1 1M14 10a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1-1" /></svg>
        <span>{copied ? 'Copied' : 'Copy link'}</span>
      </button>
    </div>
  );
};

// A small "Share" button that opens the options in a dialog (for cards).
export const ShareDialogButton = ({ url, text, title, label = 'Share', className = '' }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className={className || 'inline-flex items-center gap-1 text-sm font-semibold text-gray-700 border border-gray-300 bg-white px-3 py-1.5 rounded-lg hover:bg-gray-50'}
        aria-label={`Share ${title}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v14" /></svg>
        {label}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { e.stopPropagation(); setOpen(false); }}
          role="presentation"
        >
          <div role="dialog" aria-modal="true" aria-label={`Share ${title}`} className="w-full max-w-md bg-white rounded-2xl p-5 text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-pink-700">Share</p>
                <p className="font-bold text-gray-900 truncate">{title}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-sm font-semibold text-gray-500 hover:text-gray-900">Close</button>
            </div>
            <div className="mt-4"><ShareButtons url={url} text={text} title={title} /></div>
          </div>
        </div>
      )}
    </>
  );
};

export const shareUrl = (kind, id) => `${typeof window !== 'undefined' ? window.location.origin : 'https://shemodeltech.com'}/s/${kind}/${id}`;

export default ShareButtons;
