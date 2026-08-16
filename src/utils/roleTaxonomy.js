// src/utils/roleTaxonomy.js
// The single source of truth for She Model Tech's 6 badge-tracks, the tech roles within
// each, and the keywords (skills, fields, interests) that map a person to a track.
// Used by both the "find your first project" matching and the "discover your track" guide.
//
// Track definitions (authoritative):
//  TechDev   - Coding Developers (write software)
//  TechArchs - Low/No-Code Developers (build with low/no-code platforms)
//  TechQA    - Quality Testers
//  TechGuard - Network & Cybersecurity, incl. Cloud Administration & DevOps
//  TechPO    - Product/Project Owners (own product vision, requirements, backlog)
//  TechLeads - Non-Technical Roles (delivery, management, and other non-coding roles)
//
// NOTE: the TechPO badge keeps the image file /Images/TechMO.png and the legacy
// id 'techmo' so existing data and badge art keep working; only the display name changed.

export const TRACKS = [
  {
    id: 'techdev',
    badge: 'TechDev',
    label: 'Coding Developer',
    summary: 'Write and ship software across frontend, backend, mobile, and full-stack.',
    roles: ['Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'Mobile Developer', 'ML / AI Engineer', 'ML / AI Researcher', 'Data Scientist', 'Data Engineer'],
    keywords: ['developer', 'development', 'coding', 'code', 'programming', 'programmer', 'software engineer', 'frontend', 'front-end', 'backend', 'back-end', 'full-stack', 'fullstack', 'react', 'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'node', 'mobile', 'android', 'ios', 'flutter', 'swift', 'kotlin', 'machine learning', 'ml', 'ai engineer', 'ml engineer', 'ml researcher', 'ai researcher', 'machine learning researcher', 'research engineer', 'deep learning', 'deep learning researcher', 'data scientist', 'data engineering', 'api', 'web development'],
  },
  {
    id: 'techarchs',
    badge: 'TechArchs',
    label: 'Low/No-Code Developer',
    summary: 'Build working products on low-code and no-code platforms and automate workflows.',
    roles: ['No-Code Builder', 'Low-Code Developer', 'Automation Specialist', 'Workflow Automator', 'App Builder'],
    keywords: ['no-code', 'nocode', 'low-code', 'lowcode', 'no code', 'low code', 'webflow', 'bubble', 'zapier', 'airtable', 'make.com', 'glide', 'adalo', 'softr', 'notion', 'automation', 'workflow', 'app builder', 'wix', 'wordpress', 'shopify', 'integromat', 'powerapps', 'retool'],
  },
  {
    id: 'techqa',
    badge: 'TechQA',
    label: 'Quality Tester',
    summary: 'Ensure software quality through systematic testing, reviews, and quality control.',
    roles: ['QA Tester', 'Test Automation Engineer', 'QA Analyst', 'Manual Tester', 'Performance Tester'],
    keywords: ['qa', 'quality', 'testing', 'tester', 'test automation', 'selenium', 'cypress', 'playwright', 'manual testing', 'bug', 'quality control', 'quality assurance', 'test cases', 'regression', 'qa analyst', 'test plan'],
  },
  {
    id: 'techguard',
    badge: 'TechGuard',
    label: 'Network & Cybersecurity',
    summary: 'Protect systems and networks, and run cloud administration and DevOps.',
    roles: ['Security Analyst', 'Network Engineer', 'Penetration Tester', 'Cloud Administrator', 'DevOps Engineer', 'Site Reliability Engineer'],
    keywords: ['security', 'cybersecurity', 'cyber', 'network', 'networking', 'devops', 'cloud', 'cloud administration', 'cloud admin', 'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'sre', 'reliability', 'penetration', 'pentest', 'firewall', 'encryption', 'compliance', 'infrastructure', 'ci/cd', 'system administration', 'sysadmin'],
  },
  {
    id: 'techmo', // legacy id kept; displayed as TechPO
    badge: 'TechPO',
    label: 'Product / Project Owner',
    summary: 'Own the product vision, requirements, and backlog, and steer projects to completion.',
    roles: ['Product Owner', 'Product Manager', 'Project Owner', 'Business Analyst', 'Data Analyst', 'Requirements Analyst'],
    keywords: ['product owner', 'product manager', 'product management', 'project owner', 'backlog', 'requirements', 'business analyst', 'data analyst', 'data analysis', 'analytics', 'reporting', 'product', 'roadmap', 'user stories', 'stakeholder', 'product strategy', 'feature definition', 'prioritization'],
  },
  {
    id: 'techleads',
    badge: 'TechLeads',
    label: 'Non-Technical Roles',
    summary: 'Lead delivery and fill non-coding roles: management, writing, research, and coordination.',
    roles: ['Project Manager', 'Scrum Master', 'Team Coordinator', 'Technical Writer', 'User / Market Researcher', 'Content / Marketing'],
    keywords: ['project manager', 'project management', 'scrum', 'scrum master', 'agile', 'coordination', 'coordinator', 'delivery', 'planning', 'leadership', 'lead', 'mentor', 'mentoring', 'manager', 'technical writer', 'writing', 'documentation', 'user research', 'market research', 'ux research', 'user researcher', 'content', 'marketing', 'communications', 'non-technical', 'non technical', 'operations', 'business'],
  },
];

const norm = (s) => (s || '').toString().trim().toLowerCase();

// Given free text (skills, field, interests, background), score each track and
// return them ranked best-first. Always returns all 6 so callers can show options.
export const suggestTracks = (text) => {
  const hay = norm(Array.isArray(text) ? text.join(' ') : text);
  const scored = TRACKS.map(track => {
    let score = 0;
    track.keywords.forEach(kw => { if (hay.includes(kw)) score += 1; });
    return { ...track, _score: score };
  });
  scored.sort((a, b) => b._score - a._score);
  return scored;
};

// Map an arbitrary role title (from a project) to its track id, best-effort.
export const trackForRole = (roleTitle) => {
  const r = norm(roleTitle);
  for (const track of TRACKS) {
    if (track.roles.some(role => norm(role) === r)) return track.id;
    if (track.keywords.some(kw => r.includes(kw))) return track.id;
  }
  return null;
};
