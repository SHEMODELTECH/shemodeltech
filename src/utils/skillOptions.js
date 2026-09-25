// src/utils/skillOptions.js
//
// Selectable skills for signup, grouped by the six badge tracks.
//
// WHY A PICKER RATHER THAN A TEXT BOX
// Free text produced unsearchable, inconsistent data: "React", "react.js",
// "ReactJS" and "React Native" all mean different things to a filter but look
// the same to a person typing quickly. Companies search the Talent Board by
// skill, so inconsistent entry directly weakens the product members are here
// for. Selection also lowers the barrier: a woman who is new to tech often
// does not know what to type, but recognises what she has touched.
//
// The list is deliberately WIDE rather than deep, covering non-technical
// skills too. Someone whose strength is writing or coordination should not
// scroll past six lists of frameworks and conclude she has nothing to offer.
//
// "Other" free text remains, because no curated list is ever complete and
// telling someone their skill does not exist is a bad first experience.

export const SKILL_GROUPS = [
  {
    track: 'Development',
    skills: [
      'HTML & CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue',
      'Node.js', 'Python', 'Django', 'Java', 'C#', '.NET', 'PHP', 'Laravel',
      'Ruby on Rails', 'Go', 'React Native', 'Flutter', 'Swift', 'Kotlin',
      'REST APIs', 'GraphQL', 'SQL', 'MongoDB', 'Firebase', 'Supabase',
      'Git & GitHub', 'Docker', 'AWS', 'Azure', 'Google Cloud', 'CI/CD',
    ],
  },
  {
    track: 'Low-code & AI',
    skills: [
      'Bubble', 'Webflow', 'Wix', 'WordPress', 'Shopify', 'Airtable',
      'Zapier', 'Make', 'Power Apps', 'Retool', 'Glide',
      'Prompt engineering', 'ChatGPT / LLM tools', 'Machine learning',
      'Data analysis', 'Pandas', 'Power BI', 'Tableau', 'Excel / Sheets',
    ],
  },
  {
    track: 'Quality Assurance',
    skills: [
      'Manual testing', 'Test case writing', 'Bug reporting', 'Selenium',
      'Cypress', 'Playwright', 'Postman', 'API testing', 'Accessibility testing',
      'Performance testing', 'Regression testing', 'JIRA',
    ],
  },
  {
    track: 'Cybersecurity',
    skills: [
      'Security fundamentals', 'Network security', 'Penetration testing',
      'Vulnerability assessment', 'OWASP Top 10', 'Incident response',
      'Risk assessment', 'Compliance (GDPR, SOC2)', 'Identity & access management',
      'Cloud security', 'Security auditing',
    ],
  },
  {
    track: 'Product & Project',
    skills: [
      'Product management', 'Project management', 'Agile / Scrum', 'Kanban',
      'Requirements gathering', 'User stories', 'Roadmapping', 'Stakeholder management',
      'Business analysis', 'Process mapping', 'JIRA / Asana / Trello',
    ],
  },
  {
    track: 'Design & Research',
    skills: [
      'UI design', 'UX design', 'Figma', 'Adobe XD', 'Wireframing', 'Prototyping',
      'User research', 'Usability testing', 'Design systems', 'Accessibility (WCAG)',
      'Graphic design', 'Canva',
    ],
  },
  {
    track: 'Non-technical strengths',
    skills: [
      'Technical writing', 'Documentation', 'Content writing', 'Copywriting',
      'Communication', 'Presenting', 'Team coordination', 'Mentoring',
      'Customer support', 'Marketing', 'Social media', 'Data entry',
      'Research', 'Translation', 'Event organising',
    ],
  },
];

/** Flat list, for validation and search. */
export const ALL_SKILLS = SKILL_GROUPS.flatMap((g) => g.skills);

/** Case-insensitive substring search across every group. */
export const searchSkills = (query) => {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  return ALL_SKILLS.filter((s) => s.toLowerCase().includes(q)).slice(0, 12);
};

export const MIN_SKILLS = 1;
