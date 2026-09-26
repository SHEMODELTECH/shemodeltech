// src/components/NoteDialog.jsx
// A proper dialog for writing a note (for example, why a course or an
// application was declined), instead of the browser's one-line prompt box.

import React, { useEffect, useRef, useState } from 'react';

const NoteDialog = ({
  open,
  title,
  description,
  placeholder = '',
  confirmLabel = 'Send',
  cancelLabel = 'Cancel',
  required = false,
  busy = false,
  tone = 'danger',
  onConfirm,
  onCancel,
}) => {
  const [text, setText] = useState('');
  const areaRef = useRef(null);
  const lastFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    setText('');
    lastFocus.current = document.activeElement;
    const t = setTimeout(() => areaRef.current?.focus(), 30);
    const onKey = (e) => {
      if (e.key === 'Escape' && !busy) onCancel();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      lastFocus.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const disabled = busy || (required && !text.trim());

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation">
      <div className="absolute inset-0 bg-gray-900/50" onClick={() => !busy && onCancel()} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-dialog-title"
        aria-describedby={description ? 'note-dialog-desc' : undefined}
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl p-5 sm:p-6"
      >
        <h2 id="note-dialog-title" className="text-lg font-bold text-gray-900">{title}</h2>
        {description && (
          <p id="note-dialog-desc" className="text-sm text-gray-600 mt-1">{description}</p>
        )}
        <textarea
          ref={areaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          placeholder={placeholder}
          aria-label={title}
          className="mt-4 w-full rounded-xl border border-gray-300 p-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
          <p className="text-xs text-gray-500">{words} word{words === 1 ? '' : 's'}{required ? '' : ' · optional'}</p>
          <div className="flex gap-2">
            <button type="button" onClick={onCancel} disabled={busy}
              className="text-sm font-semibold text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-60">
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => onConfirm(text.trim())}
              disabled={disabled}
              className={`text-sm font-semibold text-white px-4 py-2 rounded-lg disabled:opacity-50 ${
                tone === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-pink-600 hover:bg-pink-700'
              }`}
            >
              {busy ? 'Sending...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Turn a Firebase error into something useful to read.
export const friendlyError = (e, fallback = 'Something went wrong. Please try again.') => {
  const code = e?.code || '';
  if (code === 'permission-denied')
    return 'Permission denied by the database. If this keeps happening, the database rules may need to be deployed again.';
  if (code === 'unavailable') return 'You seem to be offline. Check your connection and try again.';
  return e?.message ? `${fallback} (${e.message})` : fallback;
};

export default NoteDialog;
