// src/components/EmojiPicker.jsx
// A 😊 button beside a text box: opens a small panel and inserts the chosen
// emoji where the cursor is. Phone keyboards have their own emoji key; this
// mainly helps on computers.
//   <EmojiPicker targetRef={textareaRef} value={text} onChange={setText} />
import React, { useEffect, useRef, useState } from 'react';

export const EMOJIS = ['😀', '😂', '😊', '😍', '🤔', '😅', '🙏', '👏', '🙌', '💪', '👍', '👎', '❤️', '🔥', '🎉', '✨', '💡', '✅', '❓', '🚀', '💻', '📚', '🧠', '🌟'];

const EmojiPicker = ({ targetRef, value = '', onChange, up = true, className = '' }) => {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  // Close when clicking elsewhere or pressing Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const insert = (e) => {
    const el = targetRef?.current;
    const text = value || '';
    const start = el && typeof el.selectionStart === 'number' ? el.selectionStart : text.length;
    const end = el && typeof el.selectionEnd === 'number' ? el.selectionEnd : text.length;
    onChange(text.slice(0, start) + e + text.slice(end));
    setOpen(false);
    setTimeout(() => {
      if (el) {
        el.focus();
        el.selectionStart = el.selectionEnd = start + e.length;
      }
    }, 0);
  };

  return (
    <span ref={boxRef} className={`relative inline-block ${className}`}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Add an emoji" aria-expanded={open}
        className="text-lg leading-none px-2 py-1 rounded-lg hover:bg-gray-100">😊</button>
      {open && (
        <span className={`absolute z-30 ${up ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 grid grid-cols-8 gap-0.5 bg-white border border-gray-200 rounded-xl shadow-lg p-2 w-64`}>
          {EMOJIS.map((e) => (
            <button key={e} type="button" onClick={() => insert(e)} className="text-lg p-1 rounded hover:bg-gray-100" aria-label={`Insert ${e}`}>
              {e}
            </button>
          ))}
        </span>
      )}
    </span>
  );
};

export default EmojiPicker;
