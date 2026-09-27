// src/components/LimitHint.jsx
// She Model Tech design principle: every limited text field shows its limits
// up front and a live count that turns green once the minimum is met.
import React from 'react';

export const countWords = (t) => String(t || '').trim().split(/\s+/).filter(Boolean).length;

/**
 * <LimitHint text={value} minWords={3} maxChars={150} />
 * Shows e.g. "Minimum 3 words · 1 so far · 12/150 characters".
 */
const LimitHint = ({ text, minWords = 0, minChars = 0, maxChars = 0, id, className = '' }) => {
  const words = countWords(text);
  const chars = String(text || '').trim().length;
  const metMin = words >= minWords && chars >= minChars;
  const nearMax = maxChars && chars > maxChars * 0.9;
  return (
    <p id={id} aria-live="polite" className={`text-xs mt-1 ${metMin ? 'text-emerald-700' : 'text-gray-500'} ${className}`}>
      {minWords > 0 &&
        (metMin
          ? `${words} word${words === 1 ? '' : 's'}. Minimum reached.`
          : `Minimum ${minWords} word${minWords === 1 ? '' : 's'}. You have ${words} so far.`)}
      {minChars > 0 &&
        (chars >= minChars
          ? `${minWords > 0 ? ' · ' : ''}${chars} characters. Minimum reached.`
          : `${minWords > 0 ? ' · ' : ''}Minimum ${minChars} characters. You have ${chars} so far.`)}
      {maxChars > 0 && (
        <span className={nearMax ? 'text-amber-700' : 'text-gray-500'}>
          {minWords > 0 || minChars > 0 ? ' · ' : ''}
          {chars}/{maxChars} characters
        </span>
      )}
    </p>
  );
};

export default LimitHint;
