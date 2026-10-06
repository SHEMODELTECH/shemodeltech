// src/utils/projectTemplates.js
// She Model Tech's built-in project library: current AI and tech projects, free
// to use (no AI cost). Admins publish from it on Generate Project and when
// creating a cohort.
//
// Every project has:
//  - a theme (current AI and tech topics), an industry, a problem statement,
//    a description, an expected outcome, and 6 weekly actions (cohorts run 6 weeks)
//  - roles tied to the six badge tracks, each with skills, a deliverable, and a
//    level. The level is a GUIDE, not a lock: anyone can apply to any role.
//      TechDev   (development)        TechArchs (design: low/no-code)
//      TechQA    (quality-assurance)  TechGuard (security)
//      TechLeads (leadership: non-technical)
//      TechPO    (mentorship): the lead, plus a co-owner seat on teams of 7+
//  - Most projects have a role in every track. Smaller ones cover fewer, and
//    cohorts are balanced so all six tracks are covered across the cohort.
//  - Software or simulation only. No physical prototypes or hardware.

export const PROJECT_WEEKS = 6;
export const BIG_TEAM_SIZE = 7; // teams this size or bigger (lead included) get a co-owner seat

export const THEMES = [
  'AI agents and automation',
  'AI that answers from your own documents',
  'Testing and evaluating AI',
  'Responsible and safe AI',
  'Voice, image, and video AI',
  'AI for accessibility',
  'Cybersecurity and privacy',
  'Data and analytics with AI',
  'Climate and sustainability tech',
  'Small and on-device AI',
];

// The guide shown on each role. Never a lock.
export const levelGuide = (level) =>
  ['intermediate', 'advanced'].includes(String(level || '').toLowerCase())
    ? 'Stretch role, best with some experience'
    : 'Good for beginners';
export const isStretch = (level) => ['intermediate', 'advanced'].includes(String(level || '').toLowerCase());

const role = (track) => (name, skills, deliverable, level = 'beginner', count = 1) => ({
  role: name,
  track,
  skills,
  count,
  experienceLevel: level,
  deliverable,
  description: deliverable,
  detailsLink: '',
});
const dev = role('development');
const arch = role('design');
const qa = role('quality-assurance');
const guard = role('security');
const leads = role('leadership');

// The co-owner seat added to big teams (earns TechPO, like the lead).
export const coOwnerRole = () => ({
  role: 'Product Co-owner',
  track: 'mentorship',
  skills: 'Planning, communication, keeping a team on track',
  count: 1,
  experienceLevel: 'intermediate',
  deliverable: 'Runs the weekly check-ins with the lead, keeps the task board current, and plans the final demo.',
  description: 'Runs the weekly check-ins with the lead, keeps the task board current, and plans the final demo.',
  detailsLink: '',
  coOwner: true,
});

const RAW = [
  // ---------------- AI agents and automation ----------------
  {
    title: 'Job Application Assistant Agent',
    theme: 'AI agents and automation',
    industry: 'technology',
    problem: 'Job seekers juggle dozens of postings, deadlines, and tailored applications in scattered notes, and miss deadlines or send generic applications.',
    description: 'A web app with an AI agent that saves job postings, pulls out the key requirements, suggests how to tailor a resume to each one, and reminds the user of deadlines. The user approves every suggestion; the agent never applies on its own.',
    outcome: 'A working tracker where a user pastes a posting and gets its requirements, tailoring tips, and a deadline reminder.',
    weeks: [
      'Interview 3 to 5 job seekers and list the steps they repeat for every application.',
      'Design the tracker screens and write the agent instructions for reading a posting.',
      'Build saving postings and pulling out requirements with an AI model.',
      'Add tailoring suggestions and deadline reminders; review how resume data is stored.',
      'Test the agent on 20 real postings and fix wrong or vague suggestions.',
      'Polish, write a short user guide, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'JavaScript or Python, LLM APIs, function calling', 'The agent that reads a posting and returns requirements and tailoring tips.', 'intermediate'),
      arch('No-code Builder', 'Airtable or Softr, Zapier or Make', 'The tracker board and the reminder automation.'),
      qa('AI Quality Tester', 'Test cases, comparing AI output to a source', 'A test sheet of 20 postings with a pass or fail for each suggestion.'),
      guard('Security & Privacy Reviewer', 'Data privacy basics, access rules', 'A short review of how resumes and personal details are stored and who can see them.'),
      leads('User Researcher', 'Interviews, note-taking, writing', 'Interview notes and the user guide.'),
    ],
  },
  {
    title: 'Small Business Inbox Agent',
    theme: 'AI agents and automation',
    industry: 'ecommerce',
    problem: 'Small online shops lose sales because owners cannot answer every customer email quickly, and the same questions come in again and again.',
    description: 'An AI agent that sorts incoming customer emails (order status, returns, product questions), drafts a reply from the shop policies, and waits for the owner to approve before anything is sent.',
    outcome: 'A demo inbox where sample emails are sorted correctly and each gets a draft reply the owner can approve or edit.',
    weeks: [
      'Collect 50 sample customer emails and the shop policies they depend on.',
      'Design the inbox view and define the email categories.',
      'Build sorting and draft replies with an AI model using the policies.',
      'Add the approve-and-edit step; check that no customer data leaks into prompts unnecessarily.',
      'Test with the 50 emails, measure how many drafts need no edits, and fix the weak spots.',
      'Polish, document the setup, and record the demo.',
    ],
    roles: [
      dev('Developer', 'Node.js or Python, email or webhook basics, LLM APIs', 'The sorting and draft-reply service.', 'intermediate'),
      arch('No-code Builder', 'Glide or Softr, Make or Zapier', 'The owner inbox view with approve and edit buttons.'),
      qa('QA Tester', 'Test cases, spreadsheets', 'Results for all 50 sample emails and a list of fixes.'),
      guard('Security & Privacy Reviewer', 'Personal data handling, API keys', 'A checklist showing customer data is kept to the minimum and keys are stored safely.'),
      leads('Researcher & Writer', 'Research, plain writing', 'The sample emails, the policy summary, and the setup guide.'),
    ],
  },
  {
    title: 'Volunteer Scheduling Agent',
    theme: 'AI agents and automation',
    industry: 'nonprofit',
    problem: 'Community organizations spend hours each week matching volunteers to shifts by text and spreadsheet, and shifts still go unfilled.',
    description: 'A scheduling tool where volunteers share availability and an AI agent proposes a fair shift plan, flags gaps, and drafts reminder messages for the coordinator to send.',
    outcome: 'A coordinator can load a week of shifts and volunteers and get a proposed schedule with gaps highlighted.',
    weeks: [
      'Talk to a volunteer coordinator and map how shifts are filled today.',
      'Design the availability form and the schedule view.',
      'Build the scheduling logic and the AI explanation of each proposal.',
      'Add gap alerts and reminder drafts; review who can see volunteer contact details.',
      'Test with a realistic sample of 40 volunteers and 30 shifts; fix unfair or broken plans.',
      'Polish, write the coordinator guide, and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript or Python, scheduling logic, LLM APIs', 'The schedule builder and gap alerts.', 'intermediate'),
      arch('No-code Builder', 'Google Forms or Tally, Airtable', 'The availability form and the coordinator view.'),
      qa('QA Tester', 'Test scenarios, edge cases', 'Test results for the sample week, including edge cases like last-minute drop-outs.'),
      guard('Security & Privacy Reviewer', 'Access control, privacy basics', 'Access rules for volunteer contact details.'),
      leads('User Researcher', 'Interviews, writing', 'The coordinator interview summary and guide.'),
    ],
  },
  {
    title: 'Meeting Notes to Action Items Agent',
    theme: 'AI agents and automation',
    industry: 'technology',
    problem: 'Teams leave meetings without clear owners or deadlines, so decisions get lost and work is repeated.',
    description: 'A tool that takes a meeting transcript, pulls out decisions and action items with owners and dates, and sends them to a shared task board after a person confirms them.',
    outcome: 'Paste a transcript and get a confirmed list of action items on a task board.',
    weeks: [
      'Gather 10 sample transcripts and agree what counts as a decision or an action item.',
      'Design the review screen and the task board.',
      'Build extraction of decisions and action items with an AI model.',
      'Add the confirm step and sending items to the board; check transcript storage and deletion.',
      'Test on all transcripts, count missed and invented items, and fix prompts.',
      'Polish, write a how-to, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'Python or JavaScript, LLM APIs, JSON output', 'The extraction service with structured output.'),
      arch('No-code Builder', 'Notion or Trello, Zapier or Make', 'The task board and the automation that fills it.'),
      qa('AI Quality Tester', 'Comparing AI output to a source', 'A count of missed and invented items for each transcript, before and after fixes.', 'intermediate'),
      guard('Security & Privacy Reviewer', 'Data retention, privacy basics', 'A rule for how long transcripts are kept and how they are deleted.'),
      leads('Researcher & Writer', 'Writing, organizing information', 'The sample transcripts and the how-to guide.'),
    ],
  },
  {
    title: 'Grant Finder for Community Groups',
    theme: 'AI agents and automation',
    industry: 'nonprofit',
    size: 'small',
    problem: 'Small community groups miss funding because finding and reading grant listings takes time they do not have.',
    description: 'A tool that reads public grant listings, matches them to a group profile (mission, location, size), and explains in plain words why each grant may fit and what it asks for.',
    outcome: 'A group fills in its profile and gets a ranked list of matching grants with plain-language summaries.',
    weeks: [
      'Collect 30 public grant listings and 3 sample group profiles.',
      'Design the profile form and the results page.',
      'Build the matching and plain-language summaries with an AI model.',
      'Add deadlines and "what you need to apply" checklists.',
      'Test matches with the sample groups and fix poor matches.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('Developer', 'Python or JavaScript, LLM APIs', 'The matching and summary service.', 'intermediate'),
      arch('No-code Builder', 'Softr or Glide, Airtable', 'The profile form and results page.'),
      leads('Researcher & Writer', 'Research, plain writing', 'The grant listings collection and the guide.'),
    ],
  },

  // ---------------- AI that answers from your own documents ----------------
  {
    title: 'Campus Policy Q&A Assistant',
    theme: 'AI that answers from your own documents',
    industry: 'education',
    problem: 'Students struggle to find answers in long handbooks and policy pages, and staff answer the same questions every term.',
    description: 'A chat assistant that answers student questions only from the official handbook and policy pages (retrieval-augmented generation), shows the source for every answer, and says "I do not know" when the documents do not cover it.',
    outcome: 'An assistant that answers 30 common questions correctly with a source link for each.',
    weeks: [
      'Collect the public handbook pages and list 30 real student questions.',
      'Split the documents into searchable chunks and design the chat screen.',
      'Build search over the documents and answers that cite their source.',
      'Add the "I do not know" rule; check that only public documents are loaded.',
      'Test all 30 questions plus 10 tricky ones; fix wrong or unsourced answers.',
      'Polish, write the update guide for new documents, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'Python, embeddings, vector search, LLM APIs', 'The retrieval and answer pipeline with sources.', 'intermediate'),
      arch('No-code Builder', 'Webflow or Softr, embed widgets', 'The chat page students use.'),
      qa('AI Quality Tester', 'Test questions, checking answers against sources', 'A scored test set of 40 questions.'),
      guard('Security & Privacy Reviewer', 'Data handling, prompt injection basics', 'A check that private documents cannot be loaded and that the assistant resists simple prompt tricks.'),
      leads('Researcher & Writer', 'Research, writing questions', 'The 30 student questions and the update guide.'),
    ],
  },
  {
    title: 'Tenant Rights Helper',
    theme: 'AI that answers from your own documents',
    industry: 'legal',
    problem: 'Renters often do not know their basic rights, and public guides are long and hard to search.',
    description: 'An assistant that answers renter questions from public housing guides, cites the exact section, and clearly says it is general information, not legal advice, with links to local help.',
    outcome: 'A helper that answers common renter questions with a cited source and a clear disclaimer.',
    weeks: [
      'Collect public tenant guides for one city or state and list 25 common questions.',
      'Prepare the documents for search and design the question page.',
      'Build cited answers from the guides.',
      'Add the disclaimer and "find local help" links; review how questions are logged.',
      'Test the 25 questions and edge cases; fix answers that overstate the law.',
      'Polish, write a plain-language summary page, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'Python, embeddings, LLM APIs', 'The cited answer pipeline.'),
      arch('No-code Builder', 'Softr or Webflow', 'The question page and the help-links page.'),
      qa('AI Quality Tester', 'Checking answers against sources', 'Test results for the 25 questions and edge cases.'),
      guard('Security & Privacy Reviewer', 'Logging and privacy basics', 'A rule that questions are not stored with names or addresses.'),
      leads('Researcher & Writer', 'Legal research basics, plain writing', 'The guide collection, the question list, and the summary page.', 'intermediate'),
    ],
  },
  {
    title: 'Clinic FAQ Assistant',
    theme: 'AI that answers from your own documents',
    industry: 'healthcare',
    problem: 'Clinic front desks spend much of the day answering the same questions about hours, insurance, and visit preparation.',
    description: 'An assistant that answers only from a clinic public information pages (hours, services, insurance, how to prepare for a visit). It never gives medical advice and points to the phone line for anything else. Uses a fictional clinic.',
    outcome: 'An assistant that answers front-desk questions from the clinic pages and refuses medical questions politely.',
    weeks: [
      'Write the fictional clinic information pages and list 30 front-desk questions.',
      'Prepare the pages for search and design the chat widget.',
      'Build answers from the pages with sources.',
      'Add refusal of medical questions; check no health details are stored.',
      'Test common and tricky questions; fix any answer that sounds like medical advice.',
      'Polish, write the handover notes, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'Python or JavaScript, retrieval, LLM APIs', 'The answer pipeline with refusals.'),
      arch('No-code Builder', 'Webflow or Framer', 'The clinic site and chat widget.'),
      qa('AI Quality Tester', 'Test cases, safety checks', 'A test log showing correct answers and correct refusals.', 'intermediate'),
      guard('Security & Privacy Reviewer', 'Health data privacy basics', 'A review confirming no health details are kept.'),
      leads('Researcher & Writer', 'Writing, research', 'The fictional clinic pages and handover notes.'),
    ],
  },
  {
    title: 'Open-Source Docs Chat',
    theme: 'AI that answers from your own documents',
    industry: 'technology',
    problem: 'New contributors to open-source projects get stuck searching long documentation and often ask questions that are already answered.',
    description: 'A chat tool that answers questions about one open-source project from its public docs and README files, linking to the exact page.',
    outcome: 'A docs chat for one real open-source project that answers 30 beginner questions with links.',
    weeks: [
      'Pick an open-source project and list 30 beginner questions from its issues and forums.',
      'Load and split the docs, and design the chat page.',
      'Build search and linked answers.',
      'Add a "suggest a docs fix" button for unanswered questions; review API key handling.',
      'Test the 30 questions and fix gaps.',
      'Polish, write the setup guide, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'Python, embeddings, vector databases', 'The docs loader and answer service.', 'intermediate'),
      arch('No-code Builder', 'Framer or Webflow', 'The chat page.'),
      qa('QA Tester', 'Test cases, bug reports', 'Test results for the 30 questions.'),
      guard('Security & Privacy Reviewer', 'API keys, rate limits', 'A check of key storage and abuse limits.'),
      leads('Technical Writer', 'Technical writing', 'The question list and the setup guide.'),
    ],
  },
  {
    title: 'City Services Answer Bot',
    theme: 'AI that answers from your own documents',
    industry: 'government',
    problem: 'Residents struggle to find how to report a pothole, renew a permit, or reach the right office on large city websites.',
    description: 'An assistant that answers from public city service pages, gives the steps and the official link, and works in plain language.',
    outcome: 'A bot that answers 30 common resident questions with steps and official links.',
    weeks: [
      'Collect public service pages for one city and list 30 resident questions.',
      'Prepare the pages and design the question screen.',
      'Build step-by-step answers with official links.',
      'Add a plain-language mode; check the bot never asks for personal details.',
      'Test all questions and fix outdated or wrong steps.',
      'Polish, write the summary report, and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript or Python, retrieval, LLM APIs', 'The answer service.'),
      arch('No-code Builder', 'Softr or Glide', 'The resident-facing question screen.'),
      qa('QA Tester', 'Test cases', 'Test results for all 30 questions.'),
      guard('Security & Privacy Reviewer', 'Privacy basics, prompt injection', 'A check that the bot does not collect personal details and resists prompt tricks.', 'intermediate'),
      leads('Researcher & Writer', 'Research, plain writing', 'The question list and the summary report.'),
    ],
  },

  // ---------------- Testing and evaluating AI ----------------
  {
    title: 'Chatbot Answer Quality Scorecard',
    theme: 'Testing and evaluating AI',
    industry: 'technology',
    problem: 'Teams launch chatbots without a clear way to measure whether answers are correct, safe, and helpful, so problems are found by customers.',
    description: 'A reusable scorecard tool: upload a set of test questions and expected answers, run them against a chatbot, and get scores for correctness, safety, and tone, with failed answers listed.',
    outcome: 'A working scorecard run on one sample chatbot, with a report of scores and failed answers.',
    weeks: [
      'Research how AI teams test chatbots and pick 4 scoring areas.',
      'Write 50 test questions with expected answers and design the report.',
      'Build the runner that sends questions and collects answers.',
      'Build scoring with rules plus an AI judge; review how test data is stored.',
      'Check the AI judge against human scores on 20 answers and fix disagreements.',
      'Polish the report, write the guide, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'Python, LLM APIs, evaluation basics', 'The runner and scoring engine.', 'advanced'),
      arch('No-code Builder', 'Looker Studio or Airtable interfaces', 'The score report dashboard.'),
      qa('AI Quality Tester', 'Writing test cases, scoring', 'The 50 test questions and the human scores used to check the AI judge.'),
      guard('Security & Privacy Reviewer', 'Safety testing basics', 'Safety test questions (harmful requests, prompt tricks) and their results.'),
      leads('Researcher & Writer', 'Research, writing', 'A short summary of how AI teams test chatbots, and the guide.'),
    ],
  },
  {
    title: 'Summary Fact-Checker',
    theme: 'Testing and evaluating AI',
    industry: 'entertainment',
    problem: 'AI summaries of articles sometimes add facts that are not in the original, and readers cannot tell.',
    description: 'A tool that compares an AI summary with its source article, highlights each sentence as supported or not supported, and shows the matching source text.',
    outcome: 'Paste an article and a summary and see every unsupported sentence highlighted.',
    weeks: [
      'Collect 20 articles with AI summaries and mark unsupported sentences by hand.',
      'Design the side-by-side view.',
      'Build sentence matching between summary and source.',
      'Add an AI check for unsupported claims and show the matching source text.',
      'Compare the tool with the hand-marked set and improve it.',
      'Polish, write findings, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'Python, NLP basics, LLM APIs', 'The matching and checking engine.', 'intermediate'),
      arch('No-code Builder', 'Bubble or Retool', 'The side-by-side review screen.'),
      qa('AI Quality Tester', 'Careful reading, scoring', 'The hand-marked test set and accuracy results.'),
      guard('Security & Privacy Reviewer', 'Copyright and data use basics', 'A note on which articles can be used and how they are stored.'),
      leads('Researcher & Writer', 'Writing, research', 'The findings write-up.'),
    ],
  },
  {
    title: 'Bias Checker for Job Descriptions',
    theme: 'Testing and evaluating AI',
    industry: 'marketing',
    problem: 'Job descriptions, including AI-written ones, often use wording that discourages women and other groups from applying.',
    description: 'A tool that scans a job description, flags wording linked to biased hiring language, explains why, and suggests neutral alternatives.',
    outcome: 'A checker that flags and rewrites biased wording in sample job descriptions.',
    weeks: [
      'Research published lists of biased job-ad wording and collect 30 sample job descriptions.',
      'Design the checker page and the explanation cards.',
      'Build the word and phrase checks.',
      'Add AI-suggested rewrites with explanations; review how uploaded text is handled.',
      'Test on the 30 samples and fix false alarms.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript or Python, text processing, LLM APIs', 'The checker and rewrite service.'),
      arch('No-code Builder', 'Webflow or Softr', 'The checker page.'),
      qa('QA Tester', 'Test cases, spreadsheets', 'Test results with false alarms and misses listed.'),
      guard('Security & Privacy Reviewer', 'Data handling basics', 'A rule that uploaded text is not kept.'),
      leads('Researcher & Writer', 'Research, writing', 'The wording research summary and guide.', 'intermediate'),
    ],
  },
  {
    title: 'Prompt Regression Test Suite',
    theme: 'Testing and evaluating AI',
    industry: 'technology',
    size: 'small',
    problem: 'When teams change a prompt or switch AI models, features that used to work break quietly.',
    description: 'A small test suite that re-runs saved prompts against a model after every change and flags answers that got worse.',
    outcome: 'A suite that runs automatically and reports which prompts changed for the worse.',
    weeks: [
      'Pick a sample AI feature and save 30 prompts with good answers.',
      'Design the pass or fail rules and the report.',
      'Build the runner and comparison.',
      'Run it automatically on every code change.',
      'Test it by deliberately breaking prompts and confirm it catches them.',
      'Polish, document, and record the demo.',
    ],
    roles: [
      dev('Developer', 'Python or JavaScript, GitHub Actions', 'The runner and automatic checks.', 'intermediate'),
      qa('AI Quality Tester', 'Test design', 'The 30 saved prompts, pass rules, and the break test results.'),
      guard('Security & Privacy Reviewer', 'Secrets in CI', 'A check that API keys are stored safely in the pipeline.'),
    ],
  },
  {
    title: 'Translation Quality Checker for Health Leaflets',
    theme: 'Testing and evaluating AI',
    industry: 'healthcare',
    problem: 'Machine-translated health leaflets can change the meaning of instructions, and small clinics cannot afford to check every language.',
    description: 'A tool that translates a leaflet back into English, compares meaning with the original, and flags sentences that may have changed. A human reviewer always makes the final call. Uses public sample leaflets.',
    outcome: 'A checker that flags risky sentences in translated sample leaflets for human review.',
    weeks: [
      'Collect public leaflets in English with translations in 2 or 3 languages.',
      'Design the review screen.',
      'Build back-translation and meaning comparison.',
      'Add risk flags and reviewer notes; review data handling.',
      'Test with bilingual reviewers and fix missed problems.',
      'Polish, write findings, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'Python, translation APIs, LLM APIs', 'The comparison and flagging engine.', 'intermediate'),
      arch('No-code Builder', 'Retool or Bubble', 'The reviewer screen.'),
      qa('AI Quality Tester', 'Bilingual reading helps', 'Reviewer test results for each language.'),
      guard('Security & Privacy Reviewer', 'Data handling basics', 'A data handling note for uploaded leaflets.'),
      leads('Researcher & Writer', 'Research, writing', 'The leaflet collection and findings.'),
    ],
  },

  // ---------------- Responsible and safe AI ----------------
  {
    title: 'AI Use Policy Builder for Schools',
    theme: 'Responsible and safe AI',
    industry: 'education',
    problem: 'Many schools and training programs have no clear policy on how students and staff may use AI tools.',
    description: 'A guided tool that asks a school about its needs and values and drafts a clear AI use policy, with examples of allowed and not-allowed uses, ready for staff to edit.',
    outcome: 'A tool that produces an editable draft policy from a short questionnaire.',
    weeks: [
      'Research published school AI policies and pick the key sections.',
      'Write the questionnaire and design the flow.',
      'Build the draft generator with an AI model and section templates.',
      'Add editing and export; review what data the school enters.',
      'Test with 3 sample schools and fix unclear sections.',
      'Polish, write a short guide, and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript, LLM APIs, document export', 'The policy generator and export.'),
      arch('No-code Builder', 'Typeform or Tally, Notion', 'The questionnaire flow.'),
      qa('QA Tester', 'Test scenarios', 'Results for the 3 sample schools.'),
      guard('Security & Privacy Reviewer', 'Privacy basics', 'A review of what school data is collected and kept.'),
      leads('Policy Researcher & Writer', 'Research, policy writing', 'The research summary and the section templates.', 'intermediate'),
    ],
  },
  {
    title: 'Spot the AI Image Game',
    theme: 'Responsible and safe AI',
    industry: 'education',
    problem: 'People share AI-generated images as real, and most do not know the signs to look for.',
    description: 'A short web game that shows real and AI-generated images, asks players to guess, and teaches the clues after each round. Uses licensed or self-made images only.',
    outcome: 'A playable game with at least 30 images and a lesson after each answer.',
    weeks: [
      'Research the visual clues of AI images and collect or create 30 images with permission.',
      'Design the game rounds and lesson cards.',
      'Build the game and scoring.',
      'Add the lessons and a share-your-score page; review image licenses.',
      'Test with 10 players and fix confusing rounds.',
      'Polish, write the teacher guide, and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript or React', 'The game and scoring.', 'intermediate'),
      arch('No-code Builder', 'Figma, Framer', 'The game screens and lesson cards.'),
      qa('QA Tester', 'Play testing', 'Play test notes from 10 players.'),
      guard('Security & Privacy Reviewer', 'Licensing and consent basics', 'A record of where every image came from and its permission.'),
      leads('Researcher & Writer', 'Research, writing', 'The clue research and the teacher guide.'),
    ],
  },
  {
    title: 'Model Card Generator',
    theme: 'Responsible and safe AI',
    industry: 'technology',
    size: 'small',
    problem: 'Small teams ship AI models without documenting what they are for, their limits, and how they were tested.',
    description: 'A form-based tool that walks a team through the questions of a model card and produces a clean, shareable page.',
    outcome: 'A tool that produces a complete model card page from a guided form.',
    weeks: [
      'Research model card formats and list the required sections.',
      'Write the guided questions.',
      'Build the form and page output.',
      'Add examples and help text for each section.',
      'Test with 3 sample models and fix unclear questions.',
      'Polish, document, and record the demo.',
    ],
    roles: [
      arch('No-code Builder', 'Tally or Typeform, Notion or Softr', 'The guided form and the model card page.'),
      qa('QA Tester', 'Test scenarios', 'Results for the 3 sample models.'),
      leads('Technical Writer', 'Technical writing, research', 'The questions, help text, and examples.', 'intermediate'),
    ],
  },
  {
    title: 'AI Content Label Checker',
    theme: 'Responsible and safe AI',
    industry: 'marketing',
    problem: 'Brands and creators are expected to label AI-generated ads and posts, but it is easy to forget or label them unclearly.',
    description: 'A tool that reviews a batch of marketing posts, asks whether AI was used, checks for a clear label, and suggests label wording that fits each platform.',
    outcome: 'A checker that reviews a batch of posts and lists missing or unclear AI labels.',
    weeks: [
      'Research platform rules for AI content labels and collect 40 sample posts.',
      'Design the batch review screen.',
      'Build the label checks.',
      'Add suggested label wording per platform; review data handling for uploaded posts.',
      'Test on the samples and fix wrong flags.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript or Python, LLM APIs', 'The label checks and suggestions.'),
      arch('No-code Builder', 'Airtable, Softr', 'The batch review screen.'),
      qa('QA Tester', 'Test cases', 'Test results for the 40 posts.'),
      guard('Security & Privacy Reviewer', 'Data handling basics', 'A rule for how uploaded posts are stored and deleted.'),
      leads('Researcher & Writer', 'Research, writing', 'The platform rules summary and the guide.', 'intermediate'),
    ],
  },
  {
    title: 'Homework Helper with Guardrails',
    theme: 'Responsible and safe AI',
    industry: 'education',
    problem: 'Students use AI to get answers instead of learning, and teachers worry about unsafe or off-topic replies.',
    description: 'A study helper that guides students with hints and questions instead of giving full answers, stays on school topics, and refuses unsafe requests.',
    outcome: 'A helper that gives hints, not answers, and passes a set of safety tests.',
    weeks: [
      'Interview 2 or 3 teachers about what a helpful study assistant should and should not do.',
      'Write the guardrail rules and design the chat screen.',
      'Build the hint-first assistant.',
      'Add topic limits and refusals; test with prompt tricks.',
      'Run 50 test conversations and fix rule breaks.',
      'Polish, write the teacher guide, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'JavaScript or Python, LLM APIs, system prompts', 'The assistant with guardrails.', 'intermediate'),
      arch('No-code Builder', 'Framer or Softr', 'The student chat page.'),
      qa('AI Quality Tester', 'Test conversations', 'The 50 test conversations and their results.'),
      guard('Security & Privacy Reviewer', 'Prompt injection, safety testing', 'Prompt trick tests and fixes.', 'intermediate'),
      leads('User Researcher', 'Interviews, writing', 'Teacher interview notes and the teacher guide.'),
    ],
  },

  // ---------------- Voice, image, and video AI ----------------
  {
    title: 'Receipt Scanner Expense Tracker',
    theme: 'Voice, image, and video AI',
    industry: 'finance',
    problem: 'Freelancers lose receipts and spend hours typing expenses at tax time.',
    description: 'A web app where users snap a receipt photo; an AI vision model reads the store, date, and total, suggests a category, and adds it to a monthly report.',
    outcome: 'Upload a receipt photo and see it correctly added to a monthly expense report.',
    weeks: [
      'Collect 40 sample receipt photos (your own or public samples) and list expense categories.',
      'Design the upload and report screens.',
      'Build reading receipts with an AI vision model.',
      'Add categories and the monthly report; review how photos and totals are stored.',
      'Test on the 40 receipts, measure accuracy, and fix common errors.',
      'Polish, write a user guide, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'JavaScript or Python, vision APIs', 'The receipt reader and report.', 'intermediate'),
      arch('No-code Builder', 'Glide or Softr, Google Sheets', 'The upload screen and the report view.'),
      qa('QA Tester', 'Test cases, accuracy counting', 'Accuracy results for the 40 receipts.'),
      guard('Security & Privacy Reviewer', 'Financial data privacy', 'A review of photo and data storage, with a delete option.'),
      leads('Researcher & Writer', 'Research, writing', 'The category list and user guide.'),
    ],
  },
  {
    title: 'Plant Health Photo Checker',
    theme: 'Voice, image, and video AI',
    industry: 'agriculture',
    problem: 'Small farmers and gardeners notice sick plants too late because expert advice is far away or costly.',
    description: 'An app that looks at a leaf photo, suggests possible common problems using a public plant image dataset, explains the confidence, and recommends asking an expert when unsure.',
    outcome: 'A checker that gives a likely problem and confidence for sample leaf photos.',
    weeks: [
      'Pick a public plant leaf dataset and the 5 to 8 problems to cover.',
      'Design the photo upload and result screens.',
      'Train or use an existing image model on the dataset.',
      'Add confidence and "ask an expert" guidance; review photo storage.',
      'Test on held-back photos and fix weak classes.',
      'Polish, write care tips for each result, and record the demo.',
    ],
    roles: [
      dev('Machine Learning Developer', 'Python, image classification, PyTorch or TensorFlow', 'The trained or tuned image model.', 'advanced'),
      arch('No-code Builder', 'Glide or FlutterFlow', 'The photo upload app.'),
      qa('QA Tester', 'Test sets, accuracy counting', 'Test results on held-back photos.'),
      guard('Security & Privacy Reviewer', 'Data handling', 'A note on photo storage and location data.'),
      leads('Researcher & Writer', 'Research, plain writing', 'Care tips for each result.'),
    ],
  },
  {
    title: 'Podcast Summary and Clip Finder',
    theme: 'Voice, image, and video AI',
    industry: 'entertainment',
    problem: 'Podcasters spend hours finding the best moments for social clips and writing episode notes.',
    description: 'A tool that transcribes an episode, writes show notes with timestamps, and suggests the best short clips with reasons.',
    outcome: 'Upload an episode and get a transcript, show notes, and 5 clip suggestions with timestamps.',
    weeks: [
      'Collect 5 podcast episodes you have permission to use and list what podcasters need.',
      'Design the upload and results pages.',
      'Build transcription and show notes.',
      'Add clip suggestions with timestamps; review audio storage and permission.',
      'Test with the episodes and fix poor clip picks.',
      'Polish, write a guide, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'Python, speech-to-text APIs, LLM APIs', 'Transcription, show notes, and clip suggestions.', 'intermediate'),
      arch('No-code Builder', 'Bubble or Softr', 'The upload and results pages.'),
      qa('QA Tester', 'Listening tests', 'Notes on transcript accuracy and clip quality.'),
      guard('Security & Privacy Reviewer', 'Permissions and storage', 'A check of audio permissions and storage limits.'),
      leads('Content Writer', 'Writing, social media', 'Sample show notes and the guide.'),
    ],
  },
  {
    title: 'Fridge Photo Meal Planner',
    theme: 'Voice, image, and video AI',
    industry: 'food',
    size: 'small',
    problem: 'Households throw away food because they do not know what to cook with what they already have.',
    description: 'A web app that reads a photo of fridge or pantry items, lists the ingredients, and suggests simple meals that use them first.',
    outcome: 'A photo turns into an ingredient list and 3 meal ideas.',
    weeks: [
      'Collect 20 fridge and pantry photos.',
      'Design the upload and meal idea screens.',
      'Build ingredient detection with an AI vision model.',
      'Add meal suggestions that use the most ingredients.',
      'Test on the photos and fix missed items.',
      'Polish and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'JavaScript, vision APIs, LLM APIs', 'Ingredient detection and meal ideas.', 'intermediate'),
      arch('No-code Builder', 'Glide or FlutterFlow', 'The app screens.'),
      qa('QA Tester', 'Test cases', 'Results for the 20 photos.'),
    ],
  },
  {
    title: 'Lecture Video Chapter Maker',
    theme: 'Voice, image, and video AI',
    industry: 'education',
    problem: 'Long recorded lectures are hard to revise from because students cannot find the part they need.',
    description: 'A tool that transcribes a lecture video, splits it into titled chapters with timestamps, and writes a short summary and practice questions for each chapter.',
    outcome: 'A lecture video gets chapters, summaries, and practice questions automatically.',
    weeks: [
      'Collect 5 openly licensed lecture videos.',
      'Design the chapter view.',
      'Build transcription and chapter splitting.',
      'Add summaries and practice questions; review storage and licensing.',
      'Test with students and fix confusing chapters.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'Python, speech-to-text, LLM APIs', 'The chapter, summary, and question pipeline.', 'intermediate'),
      arch('No-code Builder', 'Webflow or Softr', 'The chapter viewing page.'),
      qa('QA Tester', 'User testing', 'Student test notes and fixes.'),
      guard('Security & Privacy Reviewer', 'Licensing basics', 'A license check for every video used.'),
      leads('Researcher & Writer', 'Writing, education', 'The guide and a sample study plan.'),
    ],
  },

  // ---------------- AI for accessibility ----------------
  {
    title: 'Alt-Text Assistant for Websites',
    theme: 'AI for accessibility',
    industry: 'technology',
    problem: 'Many website images have no alt text, so people using screen readers miss the content.',
    description: 'A tool that scans a web page, finds images without alt text, drafts a description with an AI vision model, and lets the site owner approve or edit it.',
    outcome: 'Scan a sample site and get approved alt text for every image.',
    weeks: [
      'Learn alt-text best practice and pick 3 sample sites.',
      'Design the scan results and approval screen.',
      'Build the page scanner and image finder.',
      'Add AI-drafted descriptions and the approve step; review what is stored.',
      'Test with a screen reader user if possible and fix poor descriptions.',
      'Polish, write a guide, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'JavaScript, web scraping, vision APIs', 'The scanner and description drafts.', 'intermediate'),
      arch('No-code Builder', 'Retool or Bubble', 'The approval screen.'),
      qa('Accessibility Tester', 'Screen readers, WCAG basics', 'Screen reader test notes.'),
      guard('Security & Privacy Reviewer', 'Safe scraping, rate limits', 'Rules for scanning sites safely and politely.'),
      leads('Researcher & Writer', 'Accessibility research, writing', 'The best-practice summary and guide.'),
    ],
  },
  {
    title: 'Plain-Language Form Rewriter',
    theme: 'AI for accessibility',
    industry: 'government',
    problem: 'Government and benefit forms use complex language that many people cannot understand, which leads to errors and missed support.',
    description: 'A tool that rewrites form instructions into plain language at a chosen reading level, keeps the meaning, and highlights anything a human should double-check.',
    outcome: 'Sample forms rewritten in plain language with meaning checks passed.',
    weeks: [
      'Collect 10 public forms and learn plain-language guidelines.',
      'Design the before-and-after view.',
      'Build the rewriter with reading-level control.',
      'Add meaning checks and highlights; review data handling.',
      'Test with readers and fix changed meanings.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript or Python, LLM APIs', 'The rewriter with reading-level control.'),
      arch('No-code Builder', 'Softr or Webflow', 'The before-and-after page.'),
      qa('AI Quality Tester', 'Careful reading, meaning checks', 'Meaning check results for all 10 forms.', 'intermediate'),
      guard('Security & Privacy Reviewer', 'Privacy basics', 'A rule that no filled-in personal details are processed.'),
      leads('Plain-Language Writer', 'Plain writing', 'The guidelines summary and human-reviewed examples.'),
    ],
  },
  {
    title: 'Website Accessibility Checker with Fix Suggestions',
    theme: 'AI for accessibility',
    industry: 'technology',
    problem: 'Small organizations do not know whether their websites work for disabled visitors, and reports from checkers are hard to act on.',
    description: 'A tool that runs automated accessibility checks on a page and turns the results into a prioritized, plain-language fix list with code examples.',
    outcome: 'Scan a page and get a prioritized fix list a beginner can act on.',
    weeks: [
      'Learn the main WCAG rules and pick 5 sample sites.',
      'Design the report.',
      'Build the scan using an open-source accessibility engine.',
      'Add AI-written explanations and fix examples.',
      'Test fixes on a sample page and confirm the issues are resolved.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript, axe-core or similar, LLM APIs', 'The scanner and fix explanations.', 'intermediate'),
      arch('No-code Builder', 'Webflow or Framer', 'The report page.'),
      qa('Accessibility Tester', 'Keyboard and screen reader testing', 'Before and after test results.'),
      guard('Security & Privacy Reviewer', 'Safe scanning', 'Rules for scanning sites safely.'),
      leads('Technical Writer', 'Writing', 'The WCAG summary and guide.'),
    ],
  },
  {
    title: 'Voice-First Bus Arrival Assistant',
    theme: 'AI for accessibility',
    industry: 'transportation',
    problem: 'Riders with low vision find bus apps hard to use, especially at the stop.',
    description: 'A voice assistant on the web that answers "When is the next bus?" using a public transit data feed, with large, high-contrast screens as a backup.',
    outcome: 'Ask by voice and hear the next arrival for a chosen stop, using real public data.',
    weeks: [
      'Pick a city with an open transit data feed and talk to 2 riders about their needs.',
      'Design the voice flow and the high-contrast screens.',
      'Build the transit data lookup.',
      'Add speech input and output; review location data handling.',
      'Test with riders and fix confusing replies.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript, Web Speech API, GTFS data', 'The voice assistant and data lookup.', 'intermediate'),
      arch('No-code Builder', 'Figma, Framer', 'The high-contrast screens.'),
      qa('Accessibility Tester', 'User testing', 'Rider test notes and fixes.'),
      guard('Security & Privacy Reviewer', 'Location privacy', 'A rule that location is used only on the device and not stored.'),
      leads('User Researcher', 'Interviews, writing', 'Rider interview notes and the guide.'),
    ],
  },
  {
    title: 'Captions for Community Events',
    theme: 'AI for accessibility',
    industry: 'nonprofit',
    size: 'small',
    problem: 'Community groups post event videos without captions, so deaf and hard-of-hearing members miss out.',
    description: 'A simple tool that creates captions for event videos, lets a volunteer correct them, and exports caption files for common video sites.',
    outcome: 'Upload a video, correct the captions, and download a caption file.',
    weeks: [
      'Collect 3 event videos with permission.',
      'Design the caption editor.',
      'Build automatic captions.',
      'Add the editor and caption file export.',
      'Test with viewers and fix timing issues.',
      'Polish and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript or Python, speech-to-text APIs', 'Caption creation and export.', 'intermediate'),
      qa('Accessibility Tester', 'Caption checking', 'Accuracy and timing test results.'),
      leads('Researcher & Writer', 'Writing', 'A captioning guide for volunteers.'),
    ],
  },

  // ---------------- Cybersecurity and privacy ----------------
  {
    title: 'Phishing Email Trainer',
    theme: 'Cybersecurity and privacy',
    industry: 'cybersecurity',
    problem: 'Most account break-ins start with a phishing email, and short training sessions are rarely practiced.',
    description: 'A training game that shows realistic sample emails (all fictional), asks the player to spot phishing, and explains the warning signs after each answer.',
    outcome: 'A game with 30 sample emails, scoring, and an explanation for each.',
    weeks: [
      'Research common phishing signs and write 30 fictional sample emails.',
      'Design the game flow.',
      'Build the game and scoring.',
      'Add explanations and a progress summary; review that no real brands or links are used.',
      'Test with 10 players and fix unclear examples.',
      'Polish, write the trainer guide, and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript or React', 'The game and scoring.'),
      arch('No-code Builder', 'Figma, Framer', 'The game screens.'),
      qa('QA Tester', 'Play testing', 'Play test notes.'),
      guard('Security Specialist', 'Phishing knowledge', 'The 30 fictional emails reviewed for realism and safety.', 'intermediate'),
      leads('Researcher & Writer', 'Research, writing', 'The warning signs research and the trainer guide.'),
    ],
  },
  {
    title: 'Account Safety Checkup',
    theme: 'Cybersecurity and privacy',
    industry: 'cybersecurity',
    problem: 'People reuse passwords and skip two-step login because they do not know where they are at risk.',
    description: 'A guided checkup that walks a user through account safety steps and checks whether a password appears in known breaches using a privacy-safe method that never sends the password itself.',
    outcome: 'A checkup that gives a personal safety score and a short to-do list.',
    weeks: [
      'Research common account risks and the privacy-safe breach check method.',
      'Design the checkup steps.',
      'Build the checkup and scoring.',
      'Add the breach check using partial hashes; have the method reviewed.',
      'Test with 10 users and fix confusing steps.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript, hashing basics, public APIs', 'The checkup and breach check.', 'intermediate'),
      arch('No-code Builder', 'Typeform or Tally', 'The guided steps.'),
      qa('QA Tester', 'User testing', 'User test notes.'),
      guard('Security Specialist', 'Hashing, threat basics', 'A review proving the password never leaves the browser.', 'intermediate'),
      leads('Researcher & Writer', 'Writing', 'The risk research and guide.'),
    ],
  },
  {
    title: 'Prompt Injection Playground',
    theme: 'Cybersecurity and privacy',
    industry: 'cybersecurity',
    problem: 'Teams adding AI to their apps do not know how attackers can trick a model into ignoring its instructions.',
    description: 'A safe practice site with a sample AI assistant and levels of defenses. Players try to make it reveal a fake secret; each level teaches a defense.',
    outcome: 'A playground with 5 levels, each with a working defense and a lesson.',
    weeks: [
      'Research prompt injection types and defenses.',
      'Design 5 levels from easy to hard.',
      'Build the sample assistant and level system.',
      'Add the defenses and lessons; make sure the site holds no real secrets.',
      'Test each level with players and patch unintended shortcuts.',
      'Polish, write the lesson pages, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'JavaScript or Python, LLM APIs', 'The assistant and level system.', 'intermediate'),
      arch('No-code Builder', 'Framer or Webflow', 'The level pages.'),
      qa('QA Tester', 'Play testing', 'Test notes for each level.'),
      guard('Security Specialist', 'AI security basics', 'The defenses for each level.', 'advanced'),
      leads('Technical Writer', 'Writing', 'The lesson pages.'),
    ],
  },
  {
    title: 'Privacy Policy Explainer',
    theme: 'Cybersecurity and privacy',
    industry: 'legal',
    problem: 'Almost nobody reads privacy policies, so people agree to data sharing they do not understand.',
    description: 'A tool that reads a privacy policy and explains in plain language what data is collected, who it is shared with, and how to opt out, with quotes from the policy.',
    outcome: 'Paste a policy and get a plain-language summary with quotes as evidence.',
    weeks: [
      'Collect 15 public privacy policies and agree on the summary sections.',
      'Design the summary card.',
      'Build the summary with quotes as evidence.',
      'Add opt-out steps and a risk note.',
      'Test against hand-made summaries and fix missed points.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'Python or JavaScript, LLM APIs', 'The summary service.'),
      arch('No-code Builder', 'Softr or Framer', 'The summary card page.'),
      qa('AI Quality Tester', 'Comparing summaries to sources', 'Comparison results for the 15 policies.'),
      guard('Security & Privacy Reviewer', 'Privacy law basics', 'A review of the summary sections against privacy law basics.', 'intermediate'),
      leads('Researcher & Writer', 'Plain writing', 'The hand-made summaries.'),
    ],
  },
  {
    title: 'Scam Text Message Checker',
    theme: 'Cybersecurity and privacy',
    industry: 'finance',
    size: 'small',
    problem: 'Older adults are often targeted by scam texts about deliveries, banks, and prizes.',
    description: 'A simple tool where someone pastes a text message and gets a clear "likely scam" or "looks normal" result with the reasons, in large, easy-to-read type.',
    outcome: 'A checker that correctly labels a set of sample scam and normal texts.',
    weeks: [
      'Collect 60 example scam and normal texts from public sources.',
      'Design the large-type check page.',
      'Build the checker with rules and an AI model.',
      'Add the reasons and "what to do next" advice.',
      'Test on the examples and fix wrong labels.',
      'Polish and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript or Python, LLM APIs', 'The checker.'),
      guard('Security Specialist', 'Scam patterns', 'The labeled examples and the scam rules.', 'intermediate'),
      leads('Researcher & Writer', 'Plain writing', 'The "what to do next" advice.'),
    ],
  },

  // ---------------- Data and analytics with AI ----------------
  {
    title: 'Food Bank Demand Dashboard',
    theme: 'Data and analytics with AI',
    industry: 'nonprofit',
    problem: 'Food banks struggle to plan stock because demand changes with seasons, holidays, and local events.',
    description: 'A dashboard that shows past visits and stock (sample data), forecasts next month demand, and explains the forecast in plain words.',
    outcome: 'A dashboard with a monthly forecast and a plain-language explanation.',
    weeks: [
      'Build a realistic sample dataset of visits and stock and talk to a food bank volunteer.',
      'Design the dashboard.',
      'Build the forecast.',
      'Add plain-language explanations; review how visitor data is kept anonymous.',
      'Test the forecast on past months and improve it.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('Data Developer', 'Python, pandas, forecasting basics', 'The forecast model.', 'intermediate'),
      arch('No-code Builder', 'Looker Studio or Power BI', 'The dashboard.'),
      qa('QA Tester', 'Data checks', 'A check of the forecast against past months.'),
      guard('Security & Privacy Reviewer', 'Anonymous data basics', 'A rule that no visitor can be identified from the data.'),
      leads('User Researcher', 'Interviews, writing', 'Volunteer interview notes and the guide.'),
    ],
  },
  {
    title: 'Ask Your Sales Data Assistant',
    theme: 'Data and analytics with AI',
    industry: 'ecommerce',
    problem: 'Small shop owners have sales data but no time or skills to analyze it.',
    description: 'An assistant where an owner uploads a sales spreadsheet and asks questions in plain English, like "Which product sold best last month?", and gets an answer with a chart.',
    outcome: 'Upload sample sales data and get correct answers and charts for 20 common questions.',
    weeks: [
      'Build a sample sales dataset and list 20 owner questions.',
      'Design the question and chart screen.',
      'Build question-to-query with an AI model.',
      'Add charts and answer checks; review how uploaded files are stored.',
      'Test the 20 questions and fix wrong answers.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'Python, pandas or SQL, LLM APIs', 'The question-to-answer engine.', 'advanced'),
      arch('No-code Builder', 'Streamlit or Retool', 'The question and chart screen.'),
      qa('QA Tester', 'Data checks', 'Results for the 20 questions.'),
      guard('Security & Privacy Reviewer', 'Data handling', 'A file storage and deletion rule.'),
      leads('Researcher & Writer', 'Writing', 'The owner questions and guide.'),
    ],
  },
  {
    title: 'Neighborhood Housing Price Explorer',
    theme: 'Data and analytics with AI',
    industry: 'realestate',
    problem: 'First-time renters and buyers find it hard to compare neighborhoods on price and changes over time.',
    description: 'A map-based explorer using public housing data that compares neighborhoods and writes a short plain-language summary of each.',
    outcome: 'An explorer that compares any two neighborhoods with charts and a summary.',
    weeks: [
      'Find a public housing price dataset for one city.',
      'Design the map and comparison view.',
      'Build data cleaning and the map.',
      'Add comparisons and AI-written summaries.',
      'Test summaries against the data and fix errors.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('Data Developer', 'Python, maps, data cleaning', 'The cleaned data and the map.', 'intermediate'),
      arch('No-code Builder', 'Looker Studio or Tableau Public', 'The comparison dashboard.'),
      qa('QA Tester', 'Data checks', 'A check of summaries against the data.'),
      guard('Security & Privacy Reviewer', 'Data licensing', 'A license and data use review.'),
      leads('Researcher & Writer', 'Research, writing', 'Neighborhood research notes and guide.'),
    ],
  },
  {
    title: 'Athlete Training Load Tracker',
    theme: 'Data and analytics with AI',
    industry: 'sports',
    problem: 'Amateur athletes overtrain or undertrain because they do not track workload over time.',
    description: 'A tracker where athletes log workouts and effort, see weekly load trends, and get a plain-language weekly summary. It never gives medical advice.',
    outcome: 'A tracker with weekly load charts and a summary for sample athletes.',
    weeks: [
      'Interview 3 athletes or coaches about what they track.',
      'Design the log and trend screens.',
      'Build workout logging and load calculation.',
      'Add trends and weekly summaries; review data privacy.',
      'Test with sample data and fix confusing charts.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript or Python, charts', 'Logging, load calculation, and summaries.'),
      arch('No-code Builder', 'Glide or Adalo', 'The athlete app screens.'),
      qa('QA Tester', 'Test cases', 'Test results with sample athletes.'),
      guard('Security & Privacy Reviewer', 'Privacy basics', 'A privacy review of workout data.'),
      leads('User Researcher', 'Interviews, writing', 'Interview notes and the guide.', 'intermediate'),
    ],
  },
  {
    title: 'Event Turnout Predictor',
    theme: 'Data and analytics with AI',
    industry: 'marketing',
    size: 'small',
    problem: 'Event organizers order too much or too little food and space because they cannot predict turnout.',
    description: 'A simple tool that uses past event data (sign-ups, day, weather, promotion) to predict turnout and explains the main reasons.',
    outcome: 'A predictor that estimates turnout for sample events with the reasons.',
    weeks: [
      'Build a sample dataset of past events.',
      'Design the input form and result.',
      'Build the prediction.',
      'Add plain-language reasons.',
      'Test on past events and improve.',
      'Polish and record the demo.',
    ],
    roles: [
      dev('Data Developer', 'Python, simple machine learning', 'The prediction and reasons.', 'intermediate'),
      arch('No-code Builder', 'Streamlit or Glide', 'The form and result page.'),
      leads('Researcher & Writer', 'Research, writing', 'The sample dataset notes and guide.'),
    ],
  },

  // ---------------- Climate and sustainability tech ----------------
  {
    title: 'Home Energy Bill Analyzer',
    theme: 'Climate and sustainability tech',
    industry: 'energy',
    problem: 'Households do not know why their energy bills are high or which changes would save the most.',
    description: 'A tool where users enter or upload monthly bills, see usage trends, and get ranked, realistic saving tips with estimated savings.',
    outcome: 'A tool that shows trends and ranked saving tips for sample households.',
    weeks: [
      'Research common energy saving actions and their typical savings.',
      'Design the bill entry and results screens.',
      'Build bill reading and trends.',
      'Add ranked tips with estimates; review bill data storage.',
      'Test with 5 sample households and fix unrealistic tips.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript or Python, charts, LLM APIs', 'Bill reading, trends, and tips.'),
      arch('No-code Builder', 'Glide or Softr', 'The entry and results screens.'),
      qa('QA Tester', 'Test cases', 'Results for 5 sample households.'),
      guard('Security & Privacy Reviewer', 'Data handling', 'A bill data storage review.'),
      leads('Researcher & Writer', 'Research, writing', 'The saving actions research and guide.', 'intermediate'),
    ],
  },
  {
    title: 'Commute Carbon Calculator',
    theme: 'Climate and sustainability tech',
    industry: 'transportation',
    problem: 'Commuters and employers do not know the climate impact of daily travel or which changes matter most.',
    description: 'A calculator that estimates commute emissions from distance and transport mode using public emission factors, and compares options like transit, carpooling, and remote days.',
    outcome: 'A calculator that compares commute options with clear numbers and sources.',
    weeks: [
      'Collect public emission factors and list common commute options.',
      'Design the calculator.',
      'Build the calculations.',
      'Add comparisons and a team summary for employers.',
      'Test numbers against the sources and fix errors.',
      'Polish, write the method page, and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript', 'The calculator and comparisons.', 'intermediate'),
      arch('No-code Builder', 'Webflow or Framer', 'The calculator page.'),
      qa('QA Tester', 'Number checking', 'A check of results against the sources.'),
      guard('Security & Privacy Reviewer', 'Location privacy', 'A rule that home addresses are never stored.'),
      leads('Researcher & Writer', 'Research, writing', 'The emission factor sources and method page.'),
    ],
  },
  {
    title: 'Clothing Resale Price Helper',
    theme: 'Climate and sustainability tech',
    industry: 'fashion',
    size: 'small',
    problem: 'People keep clothes they could resell because pricing and listing take too long.',
    description: 'A tool that reads a clothing photo, suggests a title, description, and price range from sample resale data, and creates a listing draft.',
    outcome: 'A photo becomes a ready-to-post listing draft with a price range.',
    weeks: [
      'Collect sample resale listings for common items.',
      'Design the photo-to-listing flow.',
      'Build item recognition with an AI vision model.',
      'Add price ranges and listing drafts.',
      'Test with 20 items and fix poor drafts.',
      'Polish and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'JavaScript, vision APIs', 'Item recognition and listing drafts.', 'intermediate'),
      arch('No-code Builder', 'Glide or Softr', 'The photo-to-listing flow.'),
      qa('QA Tester', 'Test cases', 'Results for the 20 items.'),
    ],
  },
  {
    title: 'Restaurant Food Waste Tracker',
    theme: 'Climate and sustainability tech',
    industry: 'food',
    problem: 'Restaurants throw away food and money because they do not track what is wasted and why.',
    description: 'A tracker where kitchen staff log waste in seconds, and a weekly report shows patterns and AI-suggested changes to prep and ordering.',
    outcome: 'A fast logging screen and a weekly waste report with suggestions.',
    weeks: [
      'Talk to a kitchen worker and list the main waste types.',
      'Design the fast logging screen.',
      'Build logging and the weekly report.',
      'Add suggestions; review who can see the data.',
      'Test with a sample week and fix slow steps.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript or Python, LLM APIs', 'Logging and weekly suggestions.'),
      arch('No-code Builder', 'Glide or AppSheet', 'The fast logging app.'),
      qa('QA Tester', 'Speed and usability testing', 'Test results with timing for each log.'),
      guard('Security & Privacy Reviewer', 'Access control', 'Access rules for staff and managers.'),
      leads('User Researcher', 'Interviews, writing', 'Kitchen interview notes and guide.', 'intermediate'),
    ],
  },
  {
    title: 'Building Material Reuse Marketplace',
    theme: 'Climate and sustainability tech',
    industry: 'construction',
    problem: 'Usable building materials from renovations go to landfill because there is no easy way to pass them on.',
    description: 'A marketplace where builders list leftover materials with photos, and an AI helper writes the listing and suggests categories and fair prices.',
    outcome: 'A marketplace prototype with AI-assisted listings and search.',
    weeks: [
      'Research what materials are reused most and how they are described.',
      'Design the listing and search screens.',
      'Build listings and search.',
      'Add AI listing help; review user verification and safety.',
      'Test with 20 sample listings and fix issues.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('Developer', 'React, Firebase or Supabase', 'Listings and search.', 'intermediate'),
      arch('No-code Builder', 'Sharetribe or Softr', 'The marketplace pages.'),
      qa('QA Tester', 'Test cases', 'Results for 20 listings.'),
      guard('Security & Privacy Reviewer', 'Trust and safety basics', 'User verification and reporting rules.'),
      leads('Researcher & Writer', 'Research, writing', 'Materials research and guide.'),
    ],
  },

  // ---------------- Small and on-device AI ----------------
  {
    title: 'Offline Study Buddy',
    theme: 'Small and on-device AI',
    industry: 'education',
    problem: 'Students with poor internet cannot use online AI study tools.',
    description: 'A study helper that runs a small AI model fully in the browser, quizzes students on their own notes, and works offline after the first load.',
    outcome: 'A study helper that quizzes from pasted notes with the internet turned off.',
    weeks: [
      'Research small models that run in the browser and pick one.',
      'Design the notes and quiz screens.',
      'Build the in-browser model setup.',
      'Add quizzes from notes and offline mode.',
      'Test on low-end devices and fix slow steps.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'JavaScript, WebGPU or WebLLM', 'The in-browser model and quiz generator.', 'advanced'),
      arch('No-code Builder', 'Figma, Framer', 'The notes and quiz screens.'),
      qa('QA Tester', 'Device testing', 'Speed tests on low-end devices.'),
      guard('Security & Privacy Reviewer', 'Privacy basics', 'A check that notes never leave the device.'),
      leads('Researcher & Writer', 'Research, writing', 'The model comparison and guide.'),
    ],
  },
  {
    title: 'Private Notes Search',
    theme: 'Small and on-device AI',
    industry: 'technology',
    problem: 'People want to search their notes by meaning, not exact words, without uploading private notes to a server.',
    description: 'A notes app with meaning-based search that runs a small embedding model in the browser, so notes stay on the device.',
    outcome: 'A notes app that finds notes by meaning with no data sent to a server.',
    weeks: [
      'Research in-browser embedding models.',
      'Design the notes and search screens.',
      'Build note storage on the device.',
      'Add meaning-based search; confirm nothing is sent to a server.',
      'Test search quality and fix poor results.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'JavaScript, embeddings, IndexedDB', 'Storage and meaning-based search.', 'intermediate'),
      arch('No-code Builder', 'Figma, Framer', 'The app screens.'),
      qa('QA Tester', 'Search quality testing', 'Search test results.'),
      guard('Security & Privacy Reviewer', 'Network inspection basics', 'Proof that no notes leave the device.'),
      leads('Technical Writer', 'Writing', 'The guide.'),
    ],
  },
  {
    title: 'Offline Travel Phrase Helper',
    theme: 'Small and on-device AI',
    industry: 'travel',
    size: 'small',
    problem: 'Travelers without data plans cannot use online translators when they need them most.',
    description: 'A phrase helper that works offline, with common travel phrases, a small on-device translator for short sentences, and audio playback.',
    outcome: 'A helper that translates short travel sentences with no internet.',
    weeks: [
      'List 100 common travel phrases for 2 languages.',
      'Design the phrase screens.',
      'Build offline storage and phrase lists.',
      'Add a small on-device translator.',
      'Test offline on phones and fix errors.',
      'Polish and record the demo.',
    ],
    roles: [
      dev('Developer', 'JavaScript, PWA, small translation models', 'Offline storage and translation.', 'intermediate'),
      qa('QA Tester', 'Phone testing, bilingual helps', 'Offline test results.'),
      leads('Researcher & Writer', 'Language research', 'The phrase lists.'),
    ],
  },
  {
    title: 'Factory Maintenance Log Assistant',
    theme: 'Small and on-device AI',
    industry: 'manufacturing',
    problem: 'Maintenance notes are written in a hurry, so patterns that predict breakdowns are missed.',
    description: 'A tool that reads sample maintenance logs (simulated), groups similar problems with a small model, and flags machines with rising issues. Software and simulated data only.',
    outcome: 'A dashboard that groups log entries and flags at-risk machines in the simulated data.',
    weeks: [
      'Create a realistic simulated log dataset for 10 machines.',
      'Design the dashboard.',
      'Build problem grouping with a small model.',
      'Add rising-issue flags; review access to the logs.',
      'Test flags against the simulation and improve.',
      'Polish, write the guide, and record the demo.',
    ],
    roles: [
      dev('Data Developer', 'Python, text clustering', 'Grouping and flags.', 'intermediate'),
      arch('No-code Builder', 'Retool or Power BI', 'The dashboard.'),
      qa('QA Tester', 'Data checks', 'A check of flags against the simulation.'),
      guard('Security & Privacy Reviewer', 'Access control', 'Access rules for the logs.'),
      leads('Researcher & Writer', 'Research, writing', 'The simulated dataset description and guide.'),
    ],
  },
  {
    title: 'Private Journal with On-Device Summaries',
    theme: 'Small and on-device AI',
    industry: 'technology',
    size: 'small',
    problem: 'People want to reflect on their week but do not want private journal entries sent to an AI company.',
    description: 'A journal app that writes weekly summaries with a small model running in the browser, so entries stay on the device.',
    outcome: 'A journal that summarizes a week of entries with no data leaving the device.',
    weeks: [
      'Pick a small in-browser model.',
      'Design the journal and summary screens.',
      'Build entry storage on the device.',
      'Add weekly summaries.',
      'Confirm nothing leaves the device and test summary quality.',
      'Polish and record the demo.',
    ],
    roles: [
      dev('AI Developer', 'JavaScript, WebLLM', 'Storage and summaries.', 'intermediate'),
      arch('No-code Builder', 'Figma, Framer', 'The app screens.'),
      guard('Security & Privacy Reviewer', 'Network inspection basics', 'Proof that entries never leave the device.'),
    ],
  },
];

const toTemplate = (p) => ({
  projectTitle: p.title,
  theme: p.theme,
  industryTrack: p.industry,
  problemStatement: p.problem,
  projectDescription: p.description,
  projectGoals: p.outcome,
  weeklyPlan: p.weeks,
  size: p.size || 'full',
  proposedRoles: p.roles.map((r) => ({ ...r, fromBrief: true })),
});

export const PROJECT_TEMPLATES = RAW.map(toTemplate);
export const TEMPLATE_COUNT = PROJECT_TEMPLATES.length;

const NON_LEAD_TRACKS = ['development', 'design', 'quality-assurance', 'security', 'leadership'];

// Fit a brief's roles to a team size (people including the lead).
// - Every role gets one seat first (in `order`), then extra seats go round-robin.
// - Teams of BIG_TEAM_SIZE+ get a Product Co-owner seat (TechPO).
// - Without a size, the brief's own counts are used (plus a co-owner if big).
// Each kept role remembers its minimum count, so a lead can't reduce it.
export const fitBriefRoles = (briefRoles, teamSize = null, order = null) => {
  const roles = (briefRoles || []).filter((r) => !r.coOwner).map((r) => ({ ...r }));
  if (order) roles.sort((a, b) => order.indexOf(a.track) - order.indexOf(b.track));
  let out;
  const size = Number(teamSize) || 0;
  if (!size) {
    out = roles.map((r) => ({ ...r, count: Number(r.count) || 1 }));
    const people = 1 + out.reduce((n, r) => n + r.count, 0);
    if (people >= BIG_TEAM_SIZE) out.push(coOwnerRole());
  } else {
    let seats = Math.max(1, size - 1);
    const withCo = size >= BIG_TEAM_SIZE;
    if (withCo) seats -= 1;
    out = roles.map((r) => ({ ...r, count: 0 }));
    for (let i = 0; i < seats && out.length; i += 1) out[i % out.length].count += 1;
    out = out.filter((r) => r.count > 0);
    if (withCo) out.push(coOwnerRole());
  }
  return out.map((r) => ({ ...r, fromBrief: true, minCount: r.count }));
};

// The tracks a set of roles covers (TechPO is always covered by the lead).
export const tracksCovered = (roles) => {
  const s = new Set(['mentorship']);
  (roles || []).forEach((r) => r.track && s.add(r.track));
  return s;
};

// Pick `count` templates for a cohort and fit their roles so that, together,
// the cohort covers all six tracks. Skips titles already used.
export const pickCohortSet = (count, { teamSize = null, exclude = [], theme = null } = {}) => {
  const used = new Set(exclude.map((t) => String(t || '').trim().toLowerCase()));
  let pool = PROJECT_TEMPLATES.filter((t) => !used.has(t.projectTitle.toLowerCase()));
  if (theme) {
    const themed = pool.filter((t) => t.theme === theme);
    if (themed.length) pool = [...shuffle(themed), ...shuffle(pool.filter((t) => t.theme !== theme))];
    else pool = shuffle(pool);
  } else {
    // Spread across themes: round-robin over shuffled themes.
    const byTheme = {};
    shuffle(pool).forEach((t) => { (byTheme[t.theme] = byTheme[t.theme] || []).push(t); });
    const queues = shuffle(Object.keys(byTheme)).map((k) => byTheme[k]);
    pool = [];
    let left = true;
    while (left) {
      left = false;
      queues.forEach((q) => { if (q.length) { pool.push(q.shift()); left = true; } });
    }
  }
  const want = Math.max(1, count);
  // Smaller projects suit small teams (4 people or fewer); bigger teams get full ones first.
  const size0 = Number(teamSize) || 0;
  if (size0 >= 5) pool = [...pool.filter((t) => t.size !== 'small'), ...pool.filter((t) => t.size === 'small')];
  // Every title already used: allow repeats rather than come up short.
  if (pool.length < want) pool = [...pool, ...shuffle(PROJECT_TEMPLATES.filter((t) => !pool.includes(t)))];
  const picked = pool.slice(0, want);
  // Make sure the briefs, together, include every track; swap a small project
  // for a full one if a track is missing entirely.
  const briefTracks = () => new Set(picked.flatMap((t) => t.proposedRoles.map((r) => r.track)));
  if (NON_LEAD_TRACKS.some((tr) => !briefTracks().has(tr))) {
    const idx = picked.findIndex((t) => t.size === 'small');
    const full = pool.slice(want).find((t) => t.size !== 'small') || PROJECT_TEMPLATES.find((t) => t.size !== 'small' && !picked.includes(t));
    if (idx !== -1 && full) picked[idx] = full;
  }

  // Fit roles so the cohort covers as many tracks as it can (all six whenever
  // there are enough seats). First try rotating which tracks come first on each
  // project; if a track is still missing, try other orders and keep the best.
  const fitWith = (orders) => picked.map((t, i) => ({
    ...t,
    proposedRoles: fitBriefRoles(t.proposedRoles, teamSize, orders[i]),
    briefRoles: t.proposedRoles,
  }));
  const coverage = (set) => new Set(set.flatMap((p) => p.proposedRoles.map((r) => r.track))).size;
  const rotation = picked.map((_, i) => NON_LEAD_TRACKS.slice(i % 5).concat(NON_LEAD_TRACKS.slice(0, i % 5)));
  let fitted = fitWith(rotation);
  const best = new Set(picked.flatMap((t) => t.proposedRoles.map((r) => r.track))).size + (Number(teamSize) >= BIG_TEAM_SIZE ? 1 : 0);
  for (let tries = 0; tries < 60 && coverage(fitted) < best; tries += 1) {
    const next = fitWith(picked.map(() => shuffle(NON_LEAD_TRACKS)));
    if (coverage(next) > coverage(fitted)) fitted = next;
  }
  return fitted;
};

// One project for Generate Project (skips titles already on the board).
export const pickTemplate = ({ exclude = [], theme = null, teamSize = null } = {}) => {
  const [t] = pickCohortSet(1, { exclude, theme, teamSize });
  return t;
};

// Kept for older callers.
export const getRandomTemplate = () => pickTemplate();

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
