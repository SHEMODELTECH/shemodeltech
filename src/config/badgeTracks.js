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

// What each track is about, in one line, and the careers that fit it. Shown
// as tap-to-open panels on How badges work and at sign-up, so members can see
// where they belong (src/components/TrackGuide.jsx). Keyed by track name.
export const TRACK_GUIDE = {
  TechDev: {
    about: 'You write code to build websites, apps, data tools and AI.',
    careers: [
      'Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'Web Developer', 'Mobile App Developer (iOS, Android)',
      'Software Engineer', 'API Developer', 'Game Developer', 'Data Engineer', 'Data Scientist', 'Data Analyst (with code)',
      'Machine Learning Engineer', 'AI Engineer', 'Embedded Systems Developer', 'AR/VR Developer', 'Blockchain Developer',
    ],
  },
  TechArchs: {
    about: 'You build working products with visual tools, using little or no code.',
    careers: [
      'No-Code Developer', 'Low-Code Developer', 'Website Builder (Webflow, Wix, Squarespace, WordPress)', 'App Builder (Bubble, Glide, FlutterFlow)',
      'Automation Specialist (Zapier, Make)', 'Power Platform Developer (Power Apps, Power Automate)', 'Salesforce Administrator',
      'CRM Administrator (HubSpot)', 'Systems Builder (Airtable, Notion)', 'E-commerce Store Builder (Shopify)', 'Chatbot Builder',
      'Business Process Automation', 'Solutions Architect',
    ],
  },
  TechQA: {
    about: 'You make sure products work: you test, find bugs and check quality.',
    careers: [
      'QA Tester', 'Manual Tester', 'QA Engineer', 'Test Automation Engineer', 'Software Development Engineer in Test (SDET)',
      'API Tester', 'Mobile App Tester', 'Performance Tester', 'Accessibility Tester', 'Usability Tester', 'Game Tester',
      'User Acceptance Testing (UAT) Lead', 'Localization Tester', 'Quality Analyst', 'Data Quality Analyst',
    ],
  },
  TechGuard: {
    about: 'You keep systems, networks, data and people safe and running.',
    careers: [
      'Cybersecurity Analyst', 'Security Operations (SOC) Analyst', 'Penetration Tester / Ethical Hacker', 'Incident Responder',
      'Digital Forensics Analyst', 'Network Engineer', 'Network Administrator', 'Systems Administrator', 'IT Support Specialist',
      'Cloud Engineer', 'Cloud Security Engineer', 'DevOps Engineer', 'Site Reliability Engineer',
      'Identity and Access Management (IAM) Specialist', 'Governance, Risk and Compliance (GRC) Analyst', 'Privacy Analyst',
    ],
  },
  TechPO: {
    about: 'You lead: you own the plan, the priorities and the team’s direction. Project leads earn this badge.',
    careers: [
      'Product Owner', 'Product Manager', 'Technical Product Manager', 'Project Manager', 'Program Manager', 'Scrum Master',
      'Agile Coach', 'Delivery Manager', 'Business Analyst', 'Product Analyst', 'Team Lead', 'Startup Founder',
    ],
  },
  TechLeads: {
    about: 'You make tech work for people, with no coding needed: design, research, writing, marketing and coordination.',
    careers: [
      'UX/UI Designer', 'Product Designer', 'Graphic Designer', 'UX Researcher', 'Content Writer', 'Technical Writer', 'Copywriter',
      'Content Strategist', 'Social Media Manager', 'Digital Marketer', 'SEO Specialist', 'Community Manager',
      'Data Analyst (spreadsheets, dashboards)', 'Customer Success', 'Business Development', 'Sales', 'Operations Coordinator',
      'Recruiter', 'Trainer / Educator', 'AI Ethics and Policy',
    ],
  },
};

// The track that best matches a role title (the suggestion shown first).
export const suggestTrack = (role) => {
  const r = String(role || '').toLowerCase();
  if (r.includes('non-technical') || r.includes('nontechnical')) return 'leadership';
  if (r.includes('mentor')) return 'mentorship';
  if (r.includes('qa') || r.includes('test')) return 'quality-assurance';
  if (r.includes('lead') || r.includes('owner') || r.includes('product')) return 'mentorship';
  if (r.includes('project') || r.includes('scrum') || r.includes('writer') || r.includes('research') || r.includes('content') || r.includes('marketing')) return 'leadership';
  if (r.includes('security') || r.includes('privacy') || r.includes('guard') || r.includes('network') || r.includes('devops') || r.includes('cloud')) return 'security';
  if (r.includes('no-code') || r.includes('low-code') || r.includes('nocode') || r.includes('webflow') || r.includes('bubble') || r.includes('design')) return 'design';
  return 'development';
};

// A role's track: the one set on the role (library projects), else the best match for its name.
export const roleTrack = (r) => (r && BADGE_TRACKS.some((t) => t.key === r.track) ? r.track : suggestTrack(r?.role));

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
