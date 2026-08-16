// src/components/BrandLockup.jsx
// The "Achieve / Ascend / Advance" brand lockup: heavy grotesque type,
// outlined words with one solid pink word, and the decorative brand shapes
// arranged around it. Words come from BRAND.taglineWords so the lockup and
// the logo can never drift apart.
//
// Uses -webkit-text-stroke for the outlined words, with a paint-order fallback
// so the stroke sits outside the glyph rather than eating into it.

import React from 'react';
import { BRAND } from '../config/brand';

const C = BRAND.colors;

/**
 * @param {'left'|'center'} align
 * @param {boolean} showShapes  render shapes INSIDE the lockup box. Off by
 *   default: shapes scoped to this box clip at its edges. Full-bleed layouts
 *   should render them on the section instead (see LandingPage hero).
 * @param {string}  className   extra classes on the wrapper
 */
const BrandLockup = ({ align = 'center', showShapes = false, className = '' }) => {
  const isCenter = align === 'center';

  // Shared type treatment: heavy, tight, uppercase-height grotesque.
  const wordBase = {
    display: 'block',
    fontWeight: 900,
    letterSpacing: '-0.03em',
    lineHeight: 0.92,
    fontFamily: '"Archivo Black","Helvetica Neue",Helvetica,Arial,system-ui,sans-serif',
  };

  // Outlined (hollow) words - transparent fill, dark hairline outline.
  const outlined = {
    ...wordBase,
    color: 'transparent',
    WebkitTextStroke: `1.5px ${C.ink}`,
    paintOrder: 'stroke fill',
  };

  // Solid word - pink fill with the same dark outline.
  const solid = {
    ...wordBase,
    color: C.pink,
    WebkitTextStroke: `1.5px ${C.ink}`,
    paintOrder: 'stroke fill',
  };

  // The words are OUTLINED - their fill is transparent - so anything behind
  // them shows straight THROUGH the letterforms. z-index cannot fix that;
  // shapes must be positioned clear of the text entirely. In the hero they
  // live on the section for exactly this reason.
  return (
    <div className={`relative ${isCenter ? 'text-center' : 'text-left'} ${className}`}>
      {showShapes && (
        <>
          {/* Green arc - clear of the left edge of the words */}
          <img
            src={BRAND.shapes.arcGreen}
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute top-2 left-0 w-8 sm:w-14 opacity-95"
          />
          {/* Sparkle - above and right, never over a letter */}
          <img
            src={BRAND.shapes.sparkle}
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute top-0 right-0 w-7 sm:w-12"
          />
          {/* Pink wave - sits BELOW the last word, not behind it */}
          <img
            src={BRAND.shapes.wavePink}
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute bottom-0 right-0 w-24 sm:w-40 opacity-95"
          />
        </>
      )}

      <h1
        className="relative z-20 text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
        aria-label={BRAND.taglineWords.join(' ')}
      >
        {BRAND.taglineWords.map((word, i) => (
          <span key={word} style={i === 1 ? solid : outlined} aria-hidden="true">
            {word}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default BrandLockup;
