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
  ['Real experience', 'Do meaningful work for a registered 501(c)(3) nonprofit, and add it to your CV and LinkedIn.'],
  ['A reference letter', 'After six months of active work, ask for a letter describing what you did and achieved.'],
  ['Flexible hours', 'About 2 to 3 hours a week, around your studies or job. Roles last six months, and you can renew.'],
  ['Grow your skills', 'Work with a supportive team, and get free access to every She Model Tech course and project.'],
  ['Your network', 'Meet women in tech, mentors, and partner companies, including at She Model Tech Summit.'],
  ['Make an impact', 'Help women everywhere learn, build, and lead in technology.'],
];
