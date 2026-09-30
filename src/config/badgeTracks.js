// src/config/badgeTracks.js
// The six badge tracks. A member picks ONE track per project; free projects
// award a badge in that track (confirmed by the lead), and the level is counted
// within the track (Novice, Associate, Advanced, Expert). Project leads always
// earn TechPO. Paid projects award no badge but show the team's strength.
// `key` is the stored badge category (kept for existing data).
export const BADGE_TRACKS = [
  { key: 'development', name: 'TechDev', label: 'Development', desc: 'Frontend, backend, data, and AI', img: '/Images/TechDev.png' },
  { key: 'quality-assurance', name: 'TechQA', label: 'Quality assurance', desc: 'Testing and finding bugs', img: '/Images/TechQA.png' },
  { key: 'design', name: 'TechArchs', label: 'Low/No-code', desc: 'Building with low-code and no-code tools', img: '/Images/TechArchs.png' },
  { key: 'security', name: 'TechGuard', label: 'Cybersecurity', desc: 'Security and networks', img: '/Images/TechGuard.png' },
  { key: 'mentorship', name: 'TechPO', label: 'Product / Project Owner', desc: 'Product and project ownership', img: '/Images/TechMO.png' },
  { key: 'leadership', name: 'TechLeads', label: 'Non-technical', desc: 'Writing, research, content, and coordination', img: '/Images/TechLeads.png' },
];
export const trackByKey = (k) => BADGE_TRACKS.find((t) => t.key === k) || null;

// The track that best matches a role title (the suggestion shown first).
export const suggestTrack = (role) => {
  const r = String(role || '').toLowerCase();
  if (r.includes('qa') || r.includes('test')) return 'quality-assurance';
  if (r.includes('lead') || r.includes('owner') || r.includes('product')) return 'mentorship';
  if (r.includes('project') || r.includes('scrum') || r.includes('writer') || r.includes('research') || r.includes('content') || r.includes('marketing')) return 'leadership';
  if (r.includes('security') || r.includes('network') || r.includes('devops') || r.includes('cloud')) return 'security';
  if (r.includes('no-code') || r.includes('low-code') || r.includes('nocode') || r.includes('webflow') || r.includes('bubble') || r.includes('design')) return 'design';
  return 'development';
};

const ALIASES = {
  development: ['development', 'techdev', 'developer'],
  'quality-assurance': ['quality-assurance', 'techqa', 'quality', 'qa'],
  security: ['security', 'techguard', 'cybersecurity', 'network'],
  leadership: ['leadership', 'techleads', 'leader', 'non-technical'],
  design: ['design', 'techarchs', 'architecture', 'low-code', 'no-code'],
  mentorship: ['mentorship', 'techpo', 'techmo', 'product', 'project-owner'],
};
// How many badges a member holds in a track, and the level that gives.
export const badgesInTrack = (profile, key) => {
  const names = ALIASES[key] || [key];
  return (profile?.badges || []).filter((b) => {
    const f = [b.category, b.id, b.badgeCategory].map((x) => String(x || '').toLowerCase());
    return f.some((x) => names.includes(x));
  }).length;
};
export const levelForCount = (n) => (n >= 12 ? 'Expert' : n >= 7 ? 'Advanced' : n >= 3 ? 'Associate' : n >= 1 ? 'Novice' : null);
export const trackStanding = (profile, key) => {
  const n = badgesInTrack(profile, key);
  const lvl = levelForCount(n);
  return lvl ? `${lvl} (${n} badge${n === 1 ? '' : 's'})` : 'No badge yet';
};
