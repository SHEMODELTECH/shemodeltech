// src/config/claudeApiConfig.js

const CLAUDE_API_CONFIG = {
  models: {
    default: 'claude-haiku-4-5-20251001',
    faster: 'claude-haiku-4-5-20251001',
    premium: 'claude-haiku-4-5-20251001'
  },
  maxTokens: {
    formSuggestions: 1024,
    careerAnalysis: 4096
  }
};

// Prompts for different Claude API requests
const CLAUDE_PROMPTS = {
  formSuggestions: 
    "I'm filling out a tech career assessment form for someone transitioning into tech. " +
    "Based on a typical career changer profile, suggest realistic answers for a form with these fields: " +
    "Education Level, Field of Study, Years of Experience, Current/Previous Role, " +
    "Job Responsibilities, Notable Projects or Achievements, Software or Technologies Used, Internships or Relevant Experience, " +
    "Publications or Research, " +
    "What they like doing best, Biggest motivation for tech career, " +
    "What they're passionate about, Primary reason for transition, Transferable skills from previous career, " +
    "Previous tech exposure, Anticipated challenges in transition, Tech areas they're curious about, " +
    "Comfort with learning new tools, Preferred work method, Current tech experience level, " +
    "Tools and platforms used, Certifications and courses, Tech career paths interest, " +
    "Industry preference, Whether to leverage domain expertise, Target salary range, " +
    "Weekly time commitment, Transition timeline, Whether continuing current role, " +
    "Guidance needed, and 12-month goal.",
  
  careerAnalysis: (formData) => `
You are a senior career transition advisor specializing in helping professionals move into technology careers. Analyze this career assessment and provide deeply personalized, actionable guidance.

PROFILE SUMMARY:
${formData.fullName} - ${formData.currentRole} with ${formData.yearsExperience} experience
Education: ${formData.educationLevel} in ${formData.studyField}
Tech Interest: ${formData.techInterests}
Career Goals: ${formData.careerPathsInterest?.join(', ') || 'Various tech roles'}
Timeline: ${formData.transitionTimeline} | Time Available: ${formData.timeCommitment}
Target Salary: ${formData.targetSalary} | Work Preference: ${formData.workPreference}

EXPERIENCE & BACKGROUND:
Responsibilities: ${formData.jobResponsibilities}
Projects: ${formData.jobProjects}
Technologies Used: ${formData.jobTechnologies}
Additional Experience: ${formData.internships || 'None'}
Publications: ${formData.publications || 'None'}

TRANSITION CONTEXT:
Motivation: ${formData.techMotivation}
Passion: ${formData.techPassion}
Reason for Transition: ${formData.transitionReason}
Transferable Skills: ${formData.transferableSkills}
Challenges Anticipated: ${formData.anticipatedChallenges}

CURRENT TECH STATUS:
Experience Level: ${formData.experienceLevel}
Tools Used: ${formData.toolsUsed?.join(', ') || 'None'}
Certifications: ${formData.certificationsDetail || 'None'}
Learning Comfort: ${formData.learningComfort}

GOALS & PREFERENCES:
Industries: ${formData.industryPreference?.join(', ') || 'Open'}
Leverage Domain Expertise: ${formData.leverageDomainExpertise}
Current Status: ${formData.continueCurrent}
Guidance Needed: ${formData.guidanceNeeded}
12-Month Goal: ${formData.futureGoal}

PROVIDE COMPREHENSIVE ANALYSIS:

1. CAREER RECOMMENDATIONS (5 options, ranked by fit)
For each role:
- Title and match percentage (explain the %)
- Why it fits their specific background (${formData.studyField}, ${formData.currentRole})
- Key advantages from their experience
- Realistic timeline given ${formData.timeCommitment}

2. STRENGTHS ANALYSIS
How their ${formData.studyField} background translates to tech
Transferable skills: ${formData.transferableSkills}
Technical aptitude from: ${formData.jobTechnologies}

3. SKILLS TO DEVELOP
Based on current level (${formData.experienceLevel}) and target roles
Address their challenge: ${formData.anticipatedChallenges}

4. LEARNING ROADMAP
Customized for ${formData.timeCommitment} weekly, ${formData.transitionTimeline} total
Considering: ${formData.continueCurrent}
Goal: ${formData.futureGoal}

5. TRANSITION STRATEGY
From ${formData.currentRole} to tech
Network leveraging from ${formData.studyField}
Path to ${formData.targetSalary}

6. MARKET CONTEXT
Note: General insights based on January 2025 knowledge. Users should verify current data via LinkedIn Salary, Glassdoor, Payscale, Levels.fyi, and Bureau of Labor Statistics.
- Demand for ${formData.careerPathsInterest?.[0] || 'target roles'}
- Salary expectations
- ${formData.workPreference} opportunities
- Industry trends for ${formData.industryPreference?.[0] || 'various sectors'}

7. PERSONAL BRANDING
Position ${formData.studyField} + tech as unique advantage
Reframe: ${formData.jobResponsibilities?.substring(0, 100)}...
Portfolio strategy

8. NEXT STEPS
Immediate actions this week/month
Support their goal: ${formData.futureGoal}

CRITICAL REQUIREMENTS:
- Reference their SPECIFIC details throughout (${formData.fullName}, ${formData.studyField}, ${formData.currentRole})
- Connect their actual projects/achievements to tech opportunities
- Address their stated challenge: ${formData.anticipatedChallenges}
- Make realistic for ${formData.timeCommitment} and ${formData.transitionTimeline}
- Provide depth and insight, not generic advice
- Speak directly to their situation

Analyze comprehensively and provide actionable, personalized guidance.
`
};

export { CLAUDE_API_CONFIG, CLAUDE_PROMPTS };
