// src/utils/skillOptions.js
//
// Selectable skills for signup. Groups are for upkeep only; members see flat chips.
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
    track: 'Data & AI',
    skills: [
      'Data science', 'Machine learning', 'Deep learning', 'Artificial intelligence (AI)',
      'Generative AI', 'Large language models (LLMs)', 'Prompt engineering', 'ChatGPT / LLM tools',
      'AI agents', 'RAG (retrieval-augmented generation)', 'Natural language processing (NLP)',
      'Computer vision', 'MLOps', 'Data engineering', 'Data pipelines / ETL', 'Data warehousing',
      'Data analysis', 'Data visualization', 'Statistics', 'Pandas', 'NumPy', 'scikit-learn',
      'TensorFlow', 'PyTorch', 'Hugging Face', 'Jupyter', 'R', 'Apache Spark', 'Airflow', 'dbt',
      'Snowflake', 'BigQuery', 'Power BI', 'Tableau', 'Excel / Sheets',
    ],
  },
  {
    track: 'Low-code & no-code',
    skills: [
      'Bubble', 'Webflow', 'Wix', 'WordPress', 'Shopify', 'Airtable',
      'Zapier', 'Make', 'Power Apps', 'Power Automate', 'Retool', 'Glide', 'Notion',
    ],
  },
  {
    track: 'Quality Assurance',
    skills: [
      'Manual testing', 'Test case writing', 'Bug reporting', 'Selenium',
      'Cypress', 'Playwright', 'Postman', 'API testing', 'Accessibility testing',
      'Performance testing', 'Regression testing', 'Test automation', 'JIRA',
    ],
  },
  {
    track: 'Cybersecurity',
    skills: [
      'Security fundamentals', 'Network security', 'Networking', 'Linux', 'Penetration testing',
      'Vulnerability assessment', 'OWASP Top 10', 'Incident response',
      'Risk assessment', 'Compliance (GDPR, SOC2)', 'Identity & access management',
      'Cloud security', 'Security auditing', 'DevOps',
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
      'Communication', 'Teamwork', 'Problem solving', 'Attention to detail', 'Leadership',
      'Technical writing', 'Documentation', 'Content writing', 'Copywriting',
      'Presenting', 'Team coordination', 'Mentoring',
      'Customer support', 'Marketing', 'Social media', 'Data entry',
      'Research', 'Translation', 'Event organising',
    ],
  },
];

/** Flat list (no repeats), for validation, search and "Show more skills". */
export const ALL_SKILLS = [...new Set(SKILL_GROUPS.flatMap((g) => g.skills))];

// The chips shown first, by the track she chose (badge track name). Members
// with no track yet, or "Not sure yet", get a general mix.
export const SUGGESTED_SKILLS = {
  TechDev: ['JavaScript', 'Python', 'HTML & CSS', 'React', 'Node.js', 'SQL', 'Git & GitHub', 'REST APIs', 'Data science', 'Machine learning', 'Problem solving', 'Teamwork'],
  TechQA: ['Manual testing', 'Test case writing', 'Bug reporting', 'API testing', 'Postman', 'Selenium', 'Test automation', 'Accessibility testing', 'JIRA', 'SQL', 'Attention to detail', 'Communication'],
  TechArchs: ['Bubble', 'Webflow', 'WordPress', 'Airtable', 'Zapier', 'Make', 'Power Apps', 'Glide', 'Prompt engineering', 'AI agents', 'Excel / Sheets', 'Problem solving'],
  TechGuard: ['Security fundamentals', 'Network security', 'Networking', 'Linux', 'Cloud security', 'Vulnerability assessment', 'Penetration testing', 'Incident response', 'OWASP Top 10', 'Risk assessment', 'Identity & access management', 'Attention to detail'],
  TechPO: ['Product management', 'Project management', 'Agile / Scrum', 'User stories', 'Requirements gathering', 'Roadmapping', 'Stakeholder management', 'Business analysis', 'JIRA / Asana / Trello', 'Data analysis', 'Communication', 'Leadership'],
  TechLeads: ['Communication', 'Teamwork', 'Technical writing', 'Content writing', 'Research', 'Team coordination', 'Presenting', 'Social media', 'Marketing', 'Customer support', 'Event organising', 'Excel / Sheets'],
};
export const GENERAL_SKILLS = ['Communication', 'Teamwork', 'Problem solving', 'Python', 'HTML & CSS', 'Data analysis', 'Artificial intelligence (AI)', 'Excel / Sheets', 'Manual testing', 'Canva', 'Research', 'Social media'];
export const suggestedFor = (track) => SUGGESTED_SKILLS[track] || GENERAL_SKILLS;

/** Case-insensitive search across every skill; also matches short forms like "ML" or "AI". */
const ALIASES = { ml: 'Machine learning', ai: 'Artificial intelligence (AI)', llm: 'Large language models (LLMs)', nlp: 'Natural language processing (NLP)', etl: 'Data pipelines / ETL', ux: 'UX design', ui: 'UI design', qa: 'Manual testing', pm: 'Project management' };
export const searchSkills = (query) => {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  const hits = ALL_SKILLS.filter((s) => s.toLowerCase().includes(q));
  if (ALIASES[q] && !hits.includes(ALIASES[q])) hits.unshift(ALIASES[q]);
  return hits.slice(0, 12);
};

export const MIN_SKILLS = 1;
