// src/utils/projectGenerator.js
// Generates an auto-project via the in-app Claude proxy. Projects are any-tech or
// AI-based and MUST be buildable as software or simulation only - never requiring a
// physical prototype. If an idea would normally need hardware, it is reframed as a
// software app or a simulation of that hardware/process.
//
// The generated project is seeded in the `lead_recruitment` state: only a Project
// Lead opening is available. After a lead is confirmed, they refine the content and
// the proposed roles, then open the rest of the team for applications.

const INDUSTRY_TRACKS = [
  'healthcare', 'finance', 'education', 'ecommerce', 'entertainment', 'government',
  'technology', 'cybersecurity', 'transportation', 'realestate', 'energy',
  'agriculture', 'manufacturing', 'legal', 'nonprofit', 'travel', 'sports',
  'food', 'fashion', 'construction', 'marketing',
];

const ROLE_TEMPLATES = ['Developer', 'Designer', 'QA Tester', 'Data Analyst', 'Security Specialist', 'Mentor'];
const ROLE_LEVELS = ['any-level', 'beginner', 'intermediate', 'advanced'];

const buildPrompt = () => `You are generating a collaborative team project for a tech talent platform where people build real-world experience by shipping software.

STRICT RULES:
- The project must be ANY-TECH or AI-BASED and buildable as SOFTWARE or a SIMULATION ONLY.
- It must NOT require any physical prototype, hardware, or lab equipment. If the concept would normally need hardware (robotics, IoT, devices, sensors), reframe it as a software application, a simulation, or a digital twin of that system.
- It should be realistic for a small remote team to build start-to-finish.
- Do NOT include a Project Lead role in the roles list - leadership is handled separately. List only the building/contributor roles.
- Roles must be chosen from these categories only: Developer, Designer, QA Tester, Data Analyst, Security Specialist, Mentor.
- Each role needs an experienceLevel of exactly one of: any-level, beginner, intermediate, advanced.

Return ONLY valid JSON (no markdown, no backticks, no preamble) in exactly this shape:
{
  "title": "short, specific project title",
  "industryTrack": "one of: ${INDUSTRY_TRACKS.join(', ')}",
  "description": "2-4 sentence description making clear it is software/simulation",
  "projectGoals": "1-2 sentence statement of what the team should achieve",
  "roles": [
    { "role": "one of ${ROLE_TEMPLATES.join('/')}", "skills": "comma-separated skills", "count": 1, "experienceLevel": "any-level|beginner|intermediate|advanced", "description": "what this role does" }
  ]
}
Include 2 to 4 roles. Keep it concise.`;

// Calls the proxy, parses + validates the JSON, and normalizes to our schema.
export const generateProject = async () => {
  const requestBody = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1200,
    messages: [{ role: 'user', content: buildPrompt() }],
  };

  const response = await fetch('/api/claude-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Generation failed: ${response.status} - ${errorText}`);
  }
  const data = await response.json();
  let text = data?.content?.[0]?.text || '';
  text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    // Last-ditch: extract the first {...} block
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Could not parse generated project JSON');
    parsed = JSON.parse(match[0]);
  }

  return normalizeGenerated(parsed);
};

const normalizeGenerated = (p) => {
  const industryTrack = INDUSTRY_TRACKS.includes(p.industryTrack) ? p.industryTrack : 'technology';
  const roles = Array.isArray(p.roles) ? p.roles : [];
  const proposedRoles = roles.slice(0, 6).map(r => {
    const role = ROLE_TEMPLATES.includes(r.role) ? r.role : 'Developer';
    const level = ROLE_LEVELS.includes(r.experienceLevel) ? r.experienceLevel : 'any-level';
    let count = parseInt(r.count, 10);
    if (!Number.isFinite(count) || count < 1) count = 1;
    if (count > 10) count = 10;
    return {
      role,
      skills: (r.skills || '').toString().trim() || 'General skills',
      count,
      experienceLevel: level,
      description: (r.description || '').toString().trim() || '',
      detailsLink: '',
    };
  });

  return {
    projectTitle: (p.title || 'Untitled Project').toString().trim().slice(0, 120),
    projectDescription: (p.description || '').toString().trim(),
    projectGoals: (p.projectGoals || '').toString().trim(),
    industryTrack,
    proposedRoles: proposedRoles.length ? proposedRoles : [
      { role: 'Developer', skills: 'General development', count: 1, experienceLevel: 'any-level', description: '', detailsLink: '' },
    ],
  };
};
