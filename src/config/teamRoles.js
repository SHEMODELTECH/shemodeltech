// src/config/teamRoles.js
// Volunteer team roles at She Model Tech (Team page and Admin → Team).
export const TEAM_ROLES = [
  { id: 'community', title: 'Community Manager', desc: 'Welcome new members, keep conversations kind and active, and help people find their next step.' },
  { id: 'communication', title: 'Communication Strategist', desc: 'Shape how She Model Tech speaks: announcements, emails, and the story we tell.' },
  { id: 'social', title: 'Social Media Manager', desc: 'Plan and post on Instagram and LinkedIn, and celebrate our members’ wins.' },
  { id: 'brand', title: 'Brand Strategist', desc: 'Keep our look and voice consistent: logo pink, black, and white, everywhere.' },
  { id: 'partnership', title: 'Partnership Manager', desc: 'Build relationships with companies, schools, and communities that share our mission.' },
  { id: 'sponsorship', title: 'Sponsorship Manager', desc: 'Find and look after sponsors who fund cohorts, laptops, and the Summit.' },
  { id: 'program', title: 'Program Manager', desc: 'Run cohorts: choose leads, follow teams, and review finished projects.' },
  { id: 'designer', title: 'Designer', desc: 'Design flyers, posts, and pages that make people want to join.' },
  { id: 'content', title: 'Content Strategist', desc: 'Plan what we publish and when, from learning tips to member stories.' },
];
export const roleTitle = (id) => TEAM_ROLES.find((r) => r.id === id)?.title || id;

export const TEAM_BENEFITS = [
  ['A recommendation letter', 'After six months of active work, ask for a letter of recommendation for a job, school, or program you’re applying to.'],
  ['A volunteer service letter', 'Any time, ask for a letter confirming your role and hours with a registered 501(c)(3) nonprofit.'],
  ['Get experience', 'See how a nonprofit really runs, from partnerships and fundraising to events and community.'],
  ['Make an impact', 'Help women grow in tech and shape our programs. Team members who go above and beyond are recognized for their commitment.'],
  ['Lead paid cohorts', 'Apply to lead paid cohorts. When applicants are equally qualified, team members are considered first.'],
  ['Flexible hours', 'About 2 to 3 hours a week, around your studies or job. Roles last six months, and you can renew.'],
];
