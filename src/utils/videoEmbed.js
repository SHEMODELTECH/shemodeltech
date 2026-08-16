// src/utils/videoEmbed.js
// Turn a YouTube or Vimeo URL into an embeddable player URL, so community videos
// play INSIDE Foundations. We host nothing - the video streams from the provider's
// CDN, so there is no cost or speed impact to our site. Non-video links return null.

// Pull a YouTube video id from the common URL shapes.
const youTubeId = (url) => {
  const patterns = [
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) { const m = url.match(p); if (m) return m[1]; }
  return null;
};

// Pull a Vimeo video id.
const vimeoId = (url) => {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
};

// Returns { provider, embedUrl } if the URL is an embeddable video, else null.
export const getVideoEmbed = (url) => {
  if (!url || typeof url !== 'string') return null;
  const yt = youTubeId(url);
  if (yt) return { provider: 'YouTube', embedUrl: `https://www.youtube.com/embed/${yt}` };
  const vm = vimeoId(url);
  if (vm) return { provider: 'Vimeo', embedUrl: `https://player.vimeo.com/video/${vm}` };
  return null;
};

// Quick boolean helper.
export const isVideoUrl = (url) => !!getVideoEmbed(url);
