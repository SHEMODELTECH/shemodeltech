// src/utils/projectLabels.js
// Short, readable labels for project and member details, used by the Proof
// Wall's summaries (Needs a lead, Open projects, Top Talent).

const INDUSTRY = {
  healthcare: 'Healthcare', finance: 'Finance / Fintech', education: 'Education', ecommerce: 'E-commerce',
  entertainment: 'Entertainment / Media', government: 'Government', technology: 'Technology / SaaS',
  cybersecurity: 'Cybersecurity', transportation: 'Transportation / Logistics', realestate: 'Real Estate',
  energy: 'Energy', agriculture: 'Agriculture', manufacturing: 'Manufacturing', legal: 'Legal Tech',
  nonprofit: 'Social Impact', travel: 'Travel / Hospitality', sports: 'Sports / Fitness', food: 'Food / Beverage',
  fashion: 'Fashion / Retail', construction: 'Construction', marketing: 'Marketing',
};
export const industryLabel = (v) => (v ? INDUSTRY[v] || v : '');

const TIMELINE = {
  '1-week': '1 week', '2-weeks': '2 weeks', '1-month': '1 month', '2-3-months': '2–3 months',
  '3-6-months': '3–6 months', '6-months-plus': '6+ months', flexible: 'Flexible timeline',
};
export const formatTimeline = (t) => (t ? TIMELINE[t] || t : '');

export const levelLabel = (l) => {
  if (!l) return '';
  if (l === 'any-level') return 'Any level';
  return String(l).charAt(0).toUpperCase() + String(l).slice(1);
};

// The roles a project is looking for (the lead's roles, else the suggested ones).
export const roleNames = (p) => {
  const list = (Array.isArray(p?.teamRoles) && p.teamRoles.length ? p.teamRoles : p?.proposedRoles) || [];
  return [...new Set(list.map((r) => (r && (r.role || r.name || r.title)) || '').filter(Boolean))];
};

const TRACKS = {
  TechDev: 'Development', TechQA: 'Quality Assurance', TechPO: 'Product / Project Owner', TechMO: 'Product / Project Owner',
  TechArchs: 'Low/No-Code', TechLeads: 'Non-Technical', TechGuard: 'Cybersecurity',
};
export const skillTrackLabel = (t) => (t ? TRACKS[t] || t : '');
