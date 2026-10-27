// src/components/EventImages.jsx
// Event pictures: up to 5 per event (flyer first).
//   EventImagesInput  - the form field: thumbnails, remove, and "Add image"
//                       (used by Events → Manage and Host an event).
//   EventImageCarousel - the event page: one picture at a time, arrows, dots,
//                        and swipe on phones. Tap to open it full size.
// Stored as event.images (a list); event.imageUrl keeps the first one, so
// event cards, share previews, and older events keep working.
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { uploadImageToBlob, validateImageFile } from '../utils/blobStorage';

export const MAX_EVENT_IMAGES = 5;

// The upload server takes files up to about 3 MB, so big photos and
// screenshots are resized (longest side 2000px) and saved as JPEG first.
const LIMIT = 2.5 * 1024 * 1024;
export const shrinkImage = (file) => new Promise((resolve) => {
  if (file.size <= LIMIT || file.type === 'image/gif') return resolve(file);
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    URL.revokeObjectURL(url);
    const scale = Math.min(1, 2000 / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * scale);
    c.height = Math.round(img.height * scale);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; // transparent PNGs get a white background
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    const tryQ = (q) => c.toBlob((b) => {
      if (!b) return resolve(file);
      if (b.size > LIMIT && q > 0.5) return tryQ(q - 0.15);
      resolve(new File([b], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg', q);
    tryQ(0.85);
  };
  img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
  img.src = url;
});

export const EventImagesInput = ({ images = [], onChange, onUploading }) => {
  const [uploading, setUploading] = useState(false);
  const add = async (files) => {
    const room = MAX_EVENT_IMAGES - images.length;
    const picked = Array.from(files || []).slice(0, room);
    if (!picked.length) return;
    for (const file of picked) {
      const bad = validateImageFile(file);
      if (bad) return toast.error(bad);
    }
    setUploading(true);
    if (onUploading) onUploading(true);
    const urls = [];
    for (const file of picked) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const small = await shrinkImage(file);
        // eslint-disable-next-line no-await-in-loop
        const up = await uploadImageToBlob(small, 'events');
        urls.push(up.url);
      } catch (err) {
        toast.error(`Could not upload ${file.name}. ${/large|413/i.test(err?.message || '') ? 'The image is too large.' : 'Please try again.'}`);
      }
    }
    onChange([...images, ...urls].slice(0, MAX_EVENT_IMAGES));
    setUploading(false);
    if (onUploading) onUploading(false);
  };
  const remove = (i) => onChange(images.filter((_, j) => j !== i));
  const first = (i) => onChange([images[i], ...images.filter((_, j) => j !== i)]);

  return (
    <div>
      {images.length > 0 && (
        <ul className="mt-1 flex flex-wrap gap-2">
          {images.map((u, i) => (
            <li key={u} className="relative">
              <img src={u} alt="" className="w-24 h-24 rounded-lg object-cover border border-gray-200" />
              {i === 0 && <span className="absolute left-1 top-1 text-[10px] font-bold bg-pink-600 text-white px-1.5 py-0.5 rounded">First</span>}
              <div className="mt-1 flex gap-2 text-xs">
                {i > 0 && <button type="button" onClick={() => first(i)} className="font-semibold text-gray-600 hover:text-gray-900">Make first</button>}
                <button type="button" onClick={() => remove(i)} className="font-semibold text-gray-600 hover:text-red-600">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {images.length < MAX_EVENT_IMAGES && (
        <label className={`mt-2 inline-flex items-center gap-1.5 text-sm font-semibold border border-gray-300 px-3 py-1.5 rounded-lg ${uploading ? 'opacity-50' : 'cursor-pointer hover:bg-gray-50'}`}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={uploading}
            className="sr-only"
            onChange={(e) => { const fl = e.target.files; add(fl); e.target.value = ''; }}
          />
          {uploading ? 'Uploading…' : images.length ? 'Add another image' : 'Add images'}
        </label>
      )}
      <p className="text-xs text-gray-500 mt-1">Up to {MAX_EVENT_IMAGES} images (JPG, PNG or WebP). The first one is the cover.</p>
    </div>
  );
};

export const EventImageCarousel = ({ images = [], title = '' }) => {
  const [i, setI] = useState(0);
  const touch = useRef(null);
  if (!images.length) return null;
  const n = images.length;
  const go = (d) => setI((x) => (x + d + n) % n);
  return (
    <div
      className="relative w-full max-w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-50"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} pictures`}
      onKeyDown={(e) => { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); }}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touch.current == null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <a href={images[i]} target="_blank" rel="noopener noreferrer" aria-label="Open the picture full size" className={`flex items-center justify-center ${n > 1 ? 'h-72 sm:h-[440px]' : ''}`}>
        <img src={images[i]} alt={`${title} picture ${i + 1} of ${n}`} className={`block max-w-full object-contain ${n > 1 ? 'max-h-full' : 'w-auto h-auto max-h-[520px]'}`} />
      </a>
      {n > 1 && (
        <>
          <button type="button" onClick={() => go(-1)} aria-label="Previous picture"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-800 hover:bg-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next picture"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-gray-800 hover:bg-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5">
            {images.map((u, j) => (
              <button key={u} type="button" onClick={() => setI(j)} aria-label={`Picture ${j + 1}`} aria-current={j === i}
                className={`w-2 h-2 rounded-full ${j === i ? 'bg-pink-600' : 'bg-white/90 border border-gray-300'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
