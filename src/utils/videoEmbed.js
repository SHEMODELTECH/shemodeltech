// src/utils/videoEmbed.js
// Turn a video link into something that plays inside the page. We host
// nothing: the video streams from the provider, so there is no storage cost.
//
// Supported: YouTube (videos, Shorts, live, playlists, start times), Vimeo,
// Instagram (posts, Reels, IGTV), TikTok, Loom, Google Drive, Dailymotion,
// Facebook videos, Wistia, and direct video files (.mp4, .webm, .ogg, .mov,
// .m4v). Anything else returns null; callers show it as a plain link.
//
// Embed URLs are rebuilt from the IDs we extract, never passed through, so a
// pasted link can't inject an arbitrary page into the frame.

const clean = (url) => (url || '').trim();

// "1m30s", "90", "1:30" -> seconds
const toSeconds = (t) => {
  if (!t) return 0;
  if (/^\d+$/.test(t)) return parseInt(t, 10);
  if (/^\d+:\d+(:\d+)?$/.test(t)) return t.split(':').reduce((a, v) => a * 60 + parseInt(v, 10), 0);
  const m = t.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
  return m ? (parseInt(m[1] || 0, 10) * 3600) + (parseInt(m[2] || 0, 10) * 60) + parseInt(m[3] || 0, 10) : 0;
};

const youTube = (url) => {
  const list = url.match(/[?&]list=([A-Za-z0-9_-]+)/);
  const id =
    (url.match(/youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)([A-Za-z0-9_-]{11})/) ||
      url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/) ||
      [])[1];
  const start = toSeconds((url.match(/[?&#](?:t|start)=([0-9hms:]+)/) || [])[1]);
  if (id) {
    const q = [start ? `start=${start}` : '', list ? `list=${list[1]}` : ''].filter(Boolean).join('&');
    return { provider: 'YouTube', embedUrl: `https://www.youtube-nocookie.com/embed/${id}${q ? `?${q}` : ''}`, aspect: /\/shorts\//.test(url) ? '9/16' : '16/9' };
  }
  if (list && /youtube\.com\/playlist/.test(url)) {
    return { provider: 'YouTube', embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${list[1]}`, aspect: '16/9' };
  }
  return null;
};

const PROVIDERS = [
  youTube,
  (url) => {
    const m = url.match(/vimeo\.com\/(?:video\/|channels\/[\w-]+\/|groups\/[\w-]+\/videos\/)?(\d+)(?:\/([a-f0-9]+))?/);
    return m ? { provider: 'Vimeo', embedUrl: `https://player.vimeo.com/video/${m[1]}${m[2] ? `?h=${m[2]}` : ''}`, aspect: '16/9' } : null;
  },
  (url) => {
    const m = url.match(/instagram\.com\/(?:[\w.]+\/)?(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
    if (!m) return null;
    const kind = m[1] === 'reels' ? 'reel' : m[1];
    return { provider: 'Instagram', embedUrl: `https://www.instagram.com/${kind}/${m[2]}/embed`, aspect: '4/5', tall: true };
  },
  (url) => {
    const m = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
    return m ? { provider: 'TikTok', embedUrl: `https://www.tiktok.com/embed/v2/${m[1]}`, aspect: '9/16', tall: true } : null;
  },
  (url) => {
    const m = url.match(/loom\.com\/(?:share|embed)\/([a-f0-9]{16,})/);
    return m ? { provider: 'Loom', embedUrl: `https://www.loom.com/embed/${m[1]}`, aspect: '16/9' } : null;
  },
  (url) => {
    const m = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([A-Za-z0-9_-]{10,})/);
    return m ? { provider: 'Google Drive', embedUrl: `https://drive.google.com/file/d/${m[1]}/preview`, aspect: '16/9' } : null;
  },
  (url) => {
    const m = url.match(/(?:dailymotion\.com\/video|dai\.ly)\/([A-Za-z0-9]+)/);
    return m ? { provider: 'Dailymotion', embedUrl: `https://www.dailymotion.com/embed/video/${m[1]}`, aspect: '16/9' } : null;
  },
  (url) => {
    if (!/facebook\.com\/.+\/videos\/\d+|facebook\.com\/watch\/?\?v=\d+|fb\.watch\//.test(url)) return null;
    return { provider: 'Facebook', embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`, aspect: '16/9' };
  },
  (url) => {
    const m = url.match(/(?:wistia\.com|wi\.st)\/(?:medias|embed\/iframe)\/([a-z0-9]+)/);
    return m ? { provider: 'Wistia', embedUrl: `https://fast.wistia.net/embed/iframe/${m[1]}`, aspect: '16/9' } : null;
  },
  (url) =>
    /^https:\/\/[^\s]+\.(mp4|webm|ogg|ogv|mov|m4v)(\?[^\s]*)?$/i.test(url)
      ? { provider: 'Video file', fileUrl: url, aspect: '16/9' }
      : null,
];

// Returns { provider, embedUrl | fileUrl, aspect, tall? } or null.
export const getVideoEmbed = (url) => {
  const u = clean(url);
  if (!/^https?:\/\//i.test(u)) return null;
  for (const p of PROVIDERS) {
    const r = p(u);
    if (r) return r;
  }
  return null;
};

export const isVideoUrl = (url) => !!getVideoEmbed(url);

// Build a player element for a URL (used by course pages). Unknown links
// become a clear "Open video" link instead of failing silently.
export const makeVideoElement = (url, title = '') => {
  const v = getVideoEmbed(url);
  const wrap = document.createElement('figure');
  wrap.className = 'vid';
  if (!v) {
    const a = document.createElement('a');
    a.href = clean(url);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'vid-link';
    a.textContent = title ? `Watch: ${title}` : 'Open the video';
    wrap.appendChild(a);
    return wrap;
  }
  const frame = document.createElement('div');
  frame.className = `vid-frame${v.tall ? ' vid-tall' : ''}`;
  frame.style.aspectRatio = v.aspect;
  if (v.fileUrl) {
    const video = document.createElement('video');
    video.src = v.fileUrl;
    video.controls = true;
    video.preload = 'metadata';
    video.setAttribute('playsinline', '');
    if (title) video.setAttribute('aria-label', title);
    frame.appendChild(video);
  } else {
    const iframe = document.createElement('iframe');
    iframe.src = v.embedUrl;
    iframe.title = title || `${v.provider} video`;
    iframe.loading = 'lazy';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.appendChild(iframe);
  }
  wrap.appendChild(frame);
  const cap = document.createElement('figcaption');
  cap.className = 'vid-cap';
  cap.textContent = title ? `${title} · ${v.provider}` : v.provider;
  const link = document.createElement('a');
  link.href = clean(url);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Open original';
  cap.append(' · ', link);
  wrap.appendChild(cap);
  return wrap;
};

export const VIDEO_CSS = `
.course-prose .vid { margin:1.4rem 0; }
.course-prose .vid-frame { position:relative; width:100%; background:#0F0D1A; border-radius:.8rem; overflow:hidden; }
.course-prose .vid-frame.vid-tall { max-width:420px; margin:0 auto; }
.course-prose .vid-frame iframe, .course-prose .vid-frame video { position:absolute; inset:0; width:100%; height:100%; border:0; }
.course-prose .vid-cap { margin-top:.4rem; font-size:.8rem; color:#6B7280; text-align:center; }
.course-prose .vid-cap a { color:var(--acc); }
.course-prose .vid-link { display:inline-block; font-weight:700; color:var(--acc); padding:.6rem 1rem; border:1px solid var(--acc); border-radius:.6rem; text-decoration:none; }
`;
