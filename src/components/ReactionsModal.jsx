// src/components/ReactionsModal.jsx
// Who reacted, in a pop-up (like the image viewer): tabs by emoji and a list
// you can scroll. Closes with the ×, Escape, or a tap outside.
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ReactionsModal = ({ reactions = {}, names = {}, photos = {}, onClose }) => {
  const [tab, setTab] = useState('all');
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const entries = Object.entries(reactions);
  const counts = {};
  entries.forEach(([, e]) => { counts[e] = (counts[e] || 0) + 1; });
  const shown = tab === 'all' ? entries : entries.filter(([, e]) => e === tab);

  // Rendered at the top of the page (not inside the post), so it always sits
  // above the feed, the header, and the sidebar.
  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Reactions" onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h2 className="text-lg font-bold text-gray-900">Reactions</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-xl">×</button>
        </div>
        <div className="flex gap-1 px-4 border-b border-gray-200 overflow-x-auto whitespace-nowrap" role="tablist">
          {[['all', `All ${entries.length}`], ...Object.entries(counts).map(([e, n]) => [e, `${e} ${n}`])].map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
              className={`shrink-0 px-3 py-2 text-sm font-semibold border-b-2 -mb-px ${tab === k ? 'border-pink-600 text-pink-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto px-4 py-2">
          {shown.map(([u, e]) => {
            const name = names[u] || 'A member';
            const photo = photos[u];
            return (
              <div key={u} className="flex items-center gap-3 py-2">
                <span className="relative shrink-0">
                  {photo ? <img src={photo} alt="" className="w-11 h-11 rounded-full object-cover" /> : <span className="w-11 h-11 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center">{name.charAt(0).toUpperCase()}</span>}
                  <span className="absolute -bottom-1 -right-1 text-base">{e}</span>
                </span>
                <span className="text-sm font-semibold text-gray-900 truncate">{name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReactionsModal;
