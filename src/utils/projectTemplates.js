// src/utils/projectTemplates.js
// A free, built-in library of software/AI starter projects - no API, no cost.
// Each template matches the shape returned by generateProject() so the admin
// "Generate" flow can publish either an AI-generated project OR a template.
//
// Rules followed by every template (same as the AI prompt):
//  - Any-tech or AI-based, buildable as SOFTWARE or a SIMULATION only.
//  - No physical prototypes/hardware. Hardware ideas are framed as software/simulation.
//  - Roles are contributor roles only (NO Project Lead - leadership is separate).
//  - experienceLevel is one of: any-level | beginner | intermediate | advanced.

const R = (role, skills, count, experienceLevel, description = '') => ({
  role, skills, count, experienceLevel, description, detailsLink: '',
});

export const PROJECT_TEMPLATES = [
  {
    projectTitle: 'Community Skill-Swap Web App',
    industryTrack: 'education',
    projectDescription: 'A web app where people offer a skill they can teach and request one they want to learn, then get matched into pairs or small groups. Includes profiles, a matching feed, and in-app scheduling. Software only.',
    projectGoals: 'Ship a working match-and-schedule flow that connects at least two complementary users end to end.',
    proposedRoles: [
      R('Developer', 'React, Firebase, REST APIs', 2, 'any-level', 'Build the matching feed, profiles, and scheduling UI.'),
      R('Designer', 'UI/UX, Figma, responsive design', 1, 'beginner', 'Design the onboarding and match screens.'),
      R('QA Tester', 'Test cases, bug reporting', 1, 'any-level', 'Verify the match-and-schedule flow across devices.'),
    ],
  },
  {
    projectTitle: 'AI Study-Notes Summarizer',
    industryTrack: 'education',
    projectDescription: 'A tool that takes long lecture notes or articles and produces concise summaries, flashcards, and quiz questions using an AI text model. Web-based; no hardware.',
    projectGoals: 'Turn a pasted document into a summary plus 5 auto-generated flashcards reliably.',
    proposedRoles: [
      R('Developer', 'JavaScript, LLM/API integration', 2, 'intermediate', 'Wire the summarization and flashcard generation.'),
      R('Data Analyst', 'Prompt design, evaluation', 1, 'any-level', 'Tune prompts and measure summary quality.'),
      R('Designer', 'Clean reading UI', 1, 'beginner', 'Design the notes-in, cards-out experience.'),
    ],
  },
  {
    projectTitle: 'Personal Finance Budget Tracker',
    industryTrack: 'finance',
    projectDescription: 'A budgeting web app where users log income and expenses, set category budgets, and see monthly trends in charts. Pure software with local or cloud data.',
    projectGoals: 'Let a user add transactions and see an accurate monthly breakdown by category.',
    proposedRoles: [
      R('Developer', 'React, charts, state management', 2, 'any-level', 'Build transaction entry and the dashboard charts.'),
      R('Designer', 'Data visualization, UI', 1, 'beginner', 'Design clear charts and the budget setup flow.'),
      R('QA Tester', 'Edge cases, validation', 1, 'beginner', 'Test calculations and input validation.'),
    ],
  },
  {
    projectTitle: 'AI Resume & Cover Letter Assistant',
    industryTrack: 'technology',
    projectDescription: 'A web tool that reviews a pasted resume against a job description and suggests improvements, plus drafts a tailored cover letter with an AI model. Software only.',
    projectGoals: 'Produce specific, actionable resume feedback and a draft cover letter from two text inputs.',
    proposedRoles: [
      R('Developer', 'Frontend, API integration', 2, 'intermediate', 'Build the input flow and AI integration.'),
      R('Data Analyst', 'Prompt engineering', 1, 'any-level', 'Design prompts for useful, honest feedback.'),
      R('Designer', 'Form and results UI', 1, 'beginner', 'Design the review and output screens.'),
    ],
  },
  {
    projectTitle: 'Telemedicine Appointment Simulator',
    industryTrack: 'healthcare',
    projectDescription: 'A simulated telehealth booking and virtual-waiting-room app: patients pick a provider, book a slot, and join a mock video room. A software simulation - no real medical devices or data.',
    projectGoals: 'Complete a simulated booking from provider selection to a mock consult room.',
    proposedRoles: [
      R('Developer', 'React, scheduling logic', 2, 'intermediate', 'Build booking and the simulated waiting room.'),
      R('Designer', 'Accessible healthcare UI', 1, 'any-level', 'Design clear, accessible booking screens.'),
      R('QA Tester', 'Flow and accessibility testing', 1, 'beginner', 'Test the booking flow and accessibility.'),
    ],
  },
  {
    projectTitle: 'Smart Habit-Tracker with Streaks',
    industryTrack: 'technology',
    projectDescription: 'A habit-tracking app with daily check-ins, streaks, reminders, and progress charts. Optional AI nudges that suggest the best time to do a habit. Software only.',
    projectGoals: 'Track a habit daily, maintain a streak, and visualize a week of progress.',
    proposedRoles: [
      R('Developer', 'Mobile-first web, notifications', 2, 'any-level', 'Build check-ins, streaks, and charts.'),
      R('Designer', 'Motivational UI', 1, 'beginner', 'Design the streak and progress visuals.'),
    ],
  },
  {
    projectTitle: 'E-commerce Product Recommendation Engine',
    industryTrack: 'ecommerce',
    projectDescription: 'A recommendation module that suggests related products based on browsing and cart behavior, with a small demo storefront to showcase it. Software only.',
    projectGoals: 'Show relevant "you may also like" suggestions driven by user behavior in a demo store.',
    proposedRoles: [
      R('Developer', 'JavaScript, recommendation logic', 2, 'intermediate', 'Build the demo store and recommendation module.'),
      R('Data Analyst', 'Behavioral data, basic ML', 1, 'intermediate', 'Design the recommendation approach.'),
      R('QA Tester', 'Scenario testing', 1, 'beginner', 'Validate recommendations across scenarios.'),
    ],
  },
  {
    projectTitle: 'AI Customer-Support Chatbot',
    industryTrack: 'technology',
    projectDescription: 'A website chatbot that answers FAQs from a knowledge base and hands off to a human when unsure, using an AI text model. Web widget; software only.',
    projectGoals: 'Answer common questions from a small knowledge base and escalate gracefully.',
    proposedRoles: [
      R('Developer', 'Chat UI, API integration', 2, 'intermediate', 'Build the widget and AI integration.'),
      R('Data Analyst', 'Knowledge base, prompts', 1, 'any-level', 'Curate the knowledge base and test answers.'),
      R('Designer', 'Conversational UI', 1, 'beginner', 'Design the chat widget.'),
    ],
  },
  {
    projectTitle: 'Open-Source Event Management Platform',
    industryTrack: 'nonprofit',
    projectDescription: 'A platform for community organizers to create events, sell or issue free tickets, and check in attendees with a QR scan (camera-based, no special hardware). Software only.',
    projectGoals: 'Create an event, register attendees, and check them in with a QR scan.',
    proposedRoles: [
      R('Developer', 'Full-stack, QR scanning', 2, 'intermediate', 'Build event creation, tickets, and check-in.'),
      R('Designer', 'Event and ticket UI', 1, 'beginner', 'Design event pages and tickets.'),
      R('QA Tester', 'End-to-end testing', 1, 'any-level', 'Test the full event lifecycle.'),
    ],
  },
  {
    projectTitle: 'Cybersecurity Phishing-Awareness Trainer',
    industryTrack: 'cybersecurity',
    projectDescription: 'An interactive training app that shows simulated phishing emails and teaches users to spot red flags, tracking their score over time. A safe simulation - no real attacks.',
    projectGoals: 'Run a user through simulated phishing examples and report what they missed.',
    proposedRoles: [
      R('Developer', 'Frontend, scoring logic', 2, 'any-level', 'Build the simulation and scoring.'),
      R('Security Specialist', 'Phishing patterns, content', 1, 'intermediate', 'Design realistic, educational examples.'),
      R('Designer', 'Learning UI', 1, 'beginner', 'Design the training and results screens.'),
    ],
  },
  {
    projectTitle: 'AI Image Caption & Alt-Text Generator',
    industryTrack: 'technology',
    projectDescription: 'A tool that generates descriptive captions and accessibility alt-text for uploaded images using an AI vision model, to help creators make content accessible. Software only.',
    projectGoals: 'Generate accurate, useful alt-text for an uploaded image.',
    proposedRoles: [
      R('Developer', 'Image upload, vision API', 2, 'intermediate', 'Build upload and caption generation.'),
      R('Data Analyst', 'Quality evaluation', 1, 'any-level', 'Assess and improve caption accuracy.'),
      R('Designer', 'Accessible UI', 1, 'beginner', 'Design an accessible interface.'),
    ],
  },
  {
    projectTitle: 'Local Farmers-Market Marketplace',
    industryTrack: 'agriculture',
    projectDescription: 'A marketplace connecting local growers with buyers: vendor listings, search by produce, and order requests with pickup scheduling. Software only.',
    projectGoals: 'Let a buyer find a local vendor and place a pickup order request.',
    proposedRoles: [
      R('Developer', 'Marketplace, search', 2, 'any-level', 'Build listings, search, and ordering.'),
      R('Designer', 'Marketplace UI', 1, 'beginner', 'Design vendor and product pages.'),
      R('QA Tester', 'Order flow testing', 1, 'beginner', 'Test search and ordering.'),
    ],
  },
  {
    projectTitle: 'Mental-Wellness Mood Journal',
    industryTrack: 'healthcare',
    projectDescription: 'A private journaling app where users log daily mood, add notes, and see gentle trends over time, with optional AI-written reflective prompts. Software only; not a medical device.',
    projectGoals: 'Log moods over a week and surface a simple, supportive trend view.',
    proposedRoles: [
      R('Developer', 'React, privacy-first storage', 2, 'any-level', 'Build journaling and trend views.'),
      R('Designer', 'Calm, supportive UI', 1, 'beginner', 'Design a warm, private experience.'),
    ],
  },
  {
    projectTitle: 'Smart-City Traffic Flow Simulation',
    industryTrack: 'transportation',
    projectDescription: 'A browser-based simulation of traffic at an intersection where users adjust signal timing and watch the effect on congestion. A pure software simulation - no sensors or hardware.',
    projectGoals: 'Simulate an intersection and show how signal timing changes congestion.',
    proposedRoles: [
      R('Developer', 'Canvas/animation, simulation logic', 2, 'intermediate', 'Build the simulation engine and controls.'),
      R('Data Analyst', 'Traffic modeling', 1, 'intermediate', 'Design the congestion model.'),
      R('Designer', 'Controls and visualization', 1, 'beginner', 'Design the simulation UI.'),
    ],
  },
  {
    projectTitle: 'Real Estate Listings Aggregator',
    industryTrack: 'realestate',
    projectDescription: 'A web app that aggregates property listings into one searchable interface with filters, map view, and saved searches. Uses sample or public data. Software only.',
    projectGoals: 'Search listings by filters and save a search to revisit.',
    proposedRoles: [
      R('Developer', 'Search, maps integration', 2, 'intermediate', 'Build search, filters, and map view.'),
      R('Designer', 'Listings UI', 1, 'beginner', 'Design search results and detail pages.'),
      R('QA Tester', 'Filter testing', 1, 'beginner', 'Validate filters and saved searches.'),
    ],
  },
  {
    projectTitle: 'AI Code-Review Helper',
    industryTrack: 'technology',
    projectDescription: 'A tool where developers paste a code snippet and get AI feedback on bugs, style, and improvements, with explanations. Web-based; software only.',
    projectGoals: 'Return useful, specific review comments on a pasted snippet.',
    proposedRoles: [
      R('Developer', 'Frontend, AI integration', 2, 'intermediate', 'Build the paste-and-review flow.'),
      R('Data Analyst', 'Prompt design, evaluation', 1, 'any-level', 'Tune prompts for accurate reviews.'),
    ],
  },
  {
    projectTitle: 'Volunteer Matching Platform',
    industryTrack: 'nonprofit',
    projectDescription: 'A platform matching volunteers with nonprofit opportunities by skills, availability, and location, with application tracking. Software only.',
    projectGoals: 'Match a volunteer to a relevant opportunity and track the application.',
    proposedRoles: [
      R('Developer', 'Matching, full-stack', 2, 'any-level', 'Build matching and application tracking.'),
      R('Designer', 'Onboarding UI', 1, 'beginner', 'Design volunteer and org flows.'),
      R('QA Tester', 'Matching tests', 1, 'beginner', 'Test matching and applications.'),
    ],
  },
  {
    projectTitle: 'Inventory Management Dashboard',
    industryTrack: 'manufacturing',
    projectDescription: 'A dashboard for small businesses to track stock levels, set low-stock alerts, and view turnover reports. Pure software with sample or cloud data.',
    projectGoals: 'Track stock, trigger a low-stock alert, and show a turnover report.',
    proposedRoles: [
      R('Developer', 'Dashboards, data tables', 2, 'any-level', 'Build inventory tracking and reports.'),
      R('Data Analyst', 'Reporting, metrics', 1, 'beginner', 'Design turnover reports.'),
      R('Designer', 'Dashboard UI', 1, 'beginner', 'Design the dashboard.'),
    ],
  },
  {
    projectTitle: 'AI Language-Learning Conversation Partner',
    industryTrack: 'education',
    projectDescription: 'A chat app where learners practice a new language with an AI partner that adapts to their level and corrects mistakes gently. Software only.',
    projectGoals: 'Hold a short adaptive conversation and give helpful corrections.',
    proposedRoles: [
      R('Developer', 'Chat UI, AI integration', 2, 'intermediate', 'Build the conversation experience.'),
      R('Data Analyst', 'Prompt and level design', 1, 'any-level', 'Design level-appropriate prompts.'),
      R('Designer', 'Learning UI', 1, 'beginner', 'Design the chat and feedback UI.'),
    ],
  },
  {
    projectTitle: 'Carbon Footprint Calculator',
    industryTrack: 'energy',
    projectDescription: 'A web app where users answer questions about travel, diet, and energy use to estimate their carbon footprint, with tips to reduce it. Software only.',
    projectGoals: 'Estimate a footprint from user answers and suggest reductions.',
    proposedRoles: [
      R('Developer', 'Forms, calculation logic', 2, 'any-level', 'Build the questionnaire and results.'),
      R('Data Analyst', 'Emissions modeling', 1, 'beginner', 'Design the calculation model.'),
      R('Designer', 'Results visualization', 1, 'beginner', 'Design results and tips.'),
    ],
  },
  {
    projectTitle: 'Freelancer Invoice & Time Tracker',
    industryTrack: 'finance',
    projectDescription: 'A tool for freelancers to track billable hours per client and generate professional invoices as PDFs. Software only.',
    projectGoals: 'Track time for a client and export a clean invoice.',
    proposedRoles: [
      R('Developer', 'Time tracking, PDF export', 2, 'any-level', 'Build tracking and invoice generation.'),
      R('Designer', 'Invoice templates, UI', 1, 'beginner', 'Design invoices and the tracker UI.'),
      R('QA Tester', 'Calculation testing', 1, 'beginner', 'Verify totals and exports.'),
    ],
  },
  {
    projectTitle: 'AI Meeting-Notes Summarizer',
    industryTrack: 'technology',
    projectDescription: 'A tool that takes a meeting transcript and produces a summary, action items, and decisions using an AI model. Software only.',
    projectGoals: 'Turn a transcript into a summary with clear action items.',
    proposedRoles: [
      R('Developer', 'Frontend, AI integration', 2, 'intermediate', 'Build transcript-in, summary-out.'),
      R('Data Analyst', 'Prompt design', 1, 'any-level', 'Tune prompts for accurate action items.'),
    ],
  },
  {
    projectTitle: 'Accessibility Audit Browser Tool',
    industryTrack: 'technology',
    projectDescription: 'A tool that scans a web page and reports accessibility issues (contrast, alt-text, headings) with fixes. Software only.',
    projectGoals: 'Scan a page and produce a prioritized accessibility report.',
    proposedRoles: [
      R('Developer', 'DOM analysis, reporting', 2, 'intermediate', 'Build the scanner and report.'),
      R('QA Tester', 'Accessibility standards', 1, 'any-level', 'Validate against WCAG basics.'),
      R('Designer', 'Report UI', 1, 'beginner', 'Design the audit report.'),
    ],
  },
  {
    projectTitle: 'Recipe Planner with Grocery Lists',
    industryTrack: 'food',
    projectDescription: 'A meal-planning app where users pick recipes for the week and get an auto-generated, de-duplicated grocery list. Software only.',
    projectGoals: 'Plan a week of meals and generate a combined grocery list.',
    proposedRoles: [
      R('Developer', 'Planning, list logic', 2, 'any-level', 'Build planning and list generation.'),
      R('Designer', 'Planner UI', 1, 'beginner', 'Design the weekly planner.'),
    ],
  },
  {
    projectTitle: 'Job Application Tracker (Kanban)',
    industryTrack: 'technology',
    projectDescription: 'A Kanban board for job seekers to track applications across stages (applied, interview, offer), with notes and reminders. Software only.',
    projectGoals: 'Move an application across stages and set a reminder.',
    proposedRoles: [
      R('Developer', 'Drag-and-drop, state', 2, 'any-level', 'Build the board and reminders.'),
      R('Designer', 'Kanban UI', 1, 'beginner', 'Design the board and cards.'),
      R('QA Tester', 'Board testing', 1, 'beginner', 'Test stage moves and reminders.'),
    ],
  },
  {
    projectTitle: 'Fitness Workout Planner & Logger',
    industryTrack: 'healthcare',
    projectDescription: 'An app to build workout routines, log sessions, and track progress over time with charts. Software only; not a medical device.',
    projectGoals: 'Create a routine, log a session, and view progress.',
    proposedRoles: [
      R('Developer', 'Logging, charts', 2, 'any-level', 'Build routines, logging, and charts.'),
      R('Designer', 'Fitness UI', 1, 'beginner', 'Design the planner and logs.'),
    ],
  },
  {
    projectTitle: 'Digital Twin: Warehouse Robot Simulation',
    industryTrack: 'manufacturing',
    projectDescription: 'A browser simulation of robots moving items through a warehouse, where users tweak routes and see efficiency. A software digital twin - no physical robots.',
    projectGoals: 'Simulate item-picking routes and report efficiency changes.',
    proposedRoles: [
      R('Developer', 'Simulation, animation', 2, 'intermediate', 'Build the warehouse simulation.'),
      R('Data Analyst', 'Routing/optimization', 1, 'intermediate', 'Design the routing logic.'),
      R('Designer', 'Simulation UI', 1, 'beginner', 'Design controls and visuals.'),
    ],
  },
  {
    projectTitle: 'Peer Code-Mentorship Matching',
    industryTrack: 'education',
    projectDescription: 'A platform matching junior developers with mentors by tech stack and goals, with session scheduling and feedback. Software only.',
    projectGoals: 'Match a mentee to a mentor and schedule a first session.',
    proposedRoles: [
      R('Developer', 'Matching, scheduling', 2, 'any-level', 'Build matching and scheduling.'),
      R('Mentor', 'Program design', 1, 'any-level', 'Shape the mentorship flow and norms.'),
      R('Designer', 'Onboarding UI', 1, 'beginner', 'Design mentor/mentee flows.'),
    ],
  },
  {
    projectTitle: 'AI Sentiment Dashboard for Reviews',
    industryTrack: 'marketing',
    projectDescription: 'A dashboard that ingests product reviews and shows sentiment trends and common themes using AI text analysis. Software only.',
    projectGoals: 'Analyze a batch of reviews and visualize sentiment and themes.',
    proposedRoles: [
      R('Developer', 'Dashboards, AI integration', 2, 'intermediate', 'Build ingestion and the dashboard.'),
      R('Data Analyst', 'NLP, evaluation', 1, 'intermediate', 'Design the sentiment analysis.'),
      R('Designer', 'Data viz UI', 1, 'beginner', 'Design the dashboard.'),
    ],
  },
  {
    projectTitle: 'AI Recipe Generator from Ingredients',
    industryTrack: 'food',
    projectDescription: 'A web app where users enter ingredients they have and an AI suggests recipes, with steps and substitutions. Software only.',
    projectGoals: 'Turn a list of ingredients into at least 3 viable recipes with steps.',
    proposedRoles: [
      R('Developer', 'React, LLM API', 2, 'intermediate', 'Build ingredient-in, recipe-out flow.'),
      R('Designer', 'UI/UX', 1, 'beginner', 'Design the input and recipe card screens.'),
    ],
  },
  {
    projectTitle: 'Local Volunteer Opportunity Finder',
    industryTrack: 'non-profit',
    projectDescription: 'A platform matching volunteers to nearby nonprofit opportunities by cause, skills, and availability. Software only.',
    projectGoals: 'Match a volunteer to at least one relevant opportunity end to end.',
    proposedRoles: [
      R('Developer', 'React, Firebase, geolocation', 2, 'any-level', 'Build the matching feed and filters.'),
      R('Designer', 'UI/UX', 1, 'beginner', 'Design onboarding and listings.'),
      R('QA Tester', 'Test cases', 1, 'beginner', 'Verify matching and filters.'),
    ],
  },
  {
    projectTitle: 'Habit Accountability Buddy App',
    industryTrack: 'health',
    projectDescription: 'An app that pairs users with an accountability partner and tracks shared streaks and check-ins. Software only.',
    projectGoals: 'Pair two users and track a shared streak for a week.',
    proposedRoles: [
      R('Developer', 'React Native or web, realtime DB', 2, 'intermediate', 'Build pairing and streak tracking.'),
      R('Designer', 'Mobile UI', 1, 'beginner', 'Design check-in screens.'),
    ],
  },
  {
    projectTitle: 'AI-Powered Flashcard Maker',
    industryTrack: 'education',
    projectDescription: 'A tool that converts notes or PDFs into spaced-repetition flashcards using AI. Software only.',
    projectGoals: 'Generate a deck of spaced-repetition cards from a document.',
    proposedRoles: [
      R('Developer', 'JavaScript, LLM API', 2, 'intermediate', 'Build document parsing and card generation.'),
      R('Data Analyst', 'Prompt design', 1, 'any-level', 'Tune card quality.'),
    ],
  },
  {
    projectTitle: 'Carbon Footprint Calculator',
    industryTrack: 'environment',
    projectDescription: 'A web calculator where users answer lifestyle questions and see their estimated carbon footprint with tips to reduce it. Software only.',
    projectGoals: 'Produce an accurate footprint estimate with 3 actionable tips.',
    proposedRoles: [
      R('Developer', 'React, data viz', 2, 'any-level', 'Build the questionnaire and results.'),
      R('Data Analyst', 'Emissions data', 1, 'any-level', 'Source and model the calculations.'),
    ],
  },
  {
    projectTitle: 'Freelancer Invoice & Time Tracker',
    industryTrack: 'finance',
    projectDescription: 'A tool for freelancers to track billable hours and generate professional invoices as PDFs. Software only.',
    projectGoals: 'Track time on a project and export a clean PDF invoice.',
    proposedRoles: [
      R('Developer', 'Time tracking, PDF export', 2, 'any-level', 'Build tracking and invoicing.'),
      R('Designer', 'UI/UX', 1, 'beginner', 'Design the dashboard and invoice template.'),
    ],
  },
  {
    projectTitle: 'Mental Health Mood Journal',
    industryTrack: 'health',
    projectDescription: 'A private journaling app with mood tracking, trends over time, and gentle prompts. Software only.',
    projectGoals: 'Let a user log moods and see a weekly trend chart.',
    proposedRoles: [
      R('Developer', 'React, charts', 2, 'any-level', 'Build journaling and mood charts.'),
      R('Designer', 'Calm, accessible UI', 1, 'beginner', 'Design the journaling experience.'),
    ],
  },
  {
    projectTitle: 'AI Job Interview Practice Coach',
    industryTrack: 'technology',
    projectDescription: 'A simulator that asks role-specific interview questions and gives AI feedback on answers. Software only.',
    projectGoals: 'Run a mock interview with feedback on at least 5 answers.',
    proposedRoles: [
      R('Developer', 'LLM integration, web', 2, 'intermediate', 'Build the Q&A and feedback loop.'),
      R('Data Analyst', 'Prompt + rubric design', 1, 'any-level', 'Design feedback rubrics.'),
    ],
  },
  {
    projectTitle: 'Neighborhood Tool-Sharing Platform',
    industryTrack: 'non-profit',
    projectDescription: 'A platform where neighbors list tools to lend and request to borrow, with a reservation calendar. Software only.',
    projectGoals: 'Let a user list a tool and another reserve it.',
    proposedRoles: [
      R('Developer', 'React, Firebase', 2, 'any-level', 'Build listings and reservations.'),
      R('Designer', 'UI/UX', 1, 'beginner', 'Design listing and calendar.'),
      R('QA Tester', 'Test cases', 1, 'beginner', 'Verify reservation flow.'),
    ],
  },
  {
    projectTitle: 'AI Language Learning Chat Partner',
    industryTrack: 'education',
    projectDescription: 'A chat app where learners practice a language with an AI partner that corrects and explains. Software only.',
    projectGoals: 'Hold a short conversation with corrections in a target language.',
    proposedRoles: [
      R('Developer', 'LLM integration', 2, 'intermediate', 'Build the chat and correction display.'),
      R('Designer', 'Conversational UI', 1, 'beginner', 'Design the chat experience.'),
    ],
  },
  {
    projectTitle: 'Small Business Inventory Manager',
    industryTrack: 'retail',
    projectDescription: 'A simple inventory system for small shops to track stock, low-stock alerts, and reorder lists. Software only.',
    projectGoals: 'Track stock levels and trigger a low-stock alert.',
    proposedRoles: [
      R('Developer', 'React, database', 2, 'any-level', 'Build inventory CRUD and alerts.'),
      R('QA Tester', 'Validation testing', 1, 'beginner', 'Test stock calculations.'),
    ],
  },
  {
    projectTitle: 'Crowdsourced Local Events Map',
    industryTrack: 'media',
    projectDescription: 'A map-based app where users post and discover local events, filterable by category and date. Software only.',
    projectGoals: 'Post an event and see it appear on the map for others.',
    proposedRoles: [
      R('Developer', 'React, maps API', 2, 'intermediate', 'Build the map and event posting.'),
      R('Designer', 'Map UI', 1, 'beginner', 'Design event cards and filters.'),
    ],
  },
  {
    projectTitle: 'AI Content Idea Generator',
    industryTrack: 'media',
    projectDescription: 'A tool that generates content ideas, titles, and outlines for a given topic and platform. Software only.',
    projectGoals: 'Generate 10 content ideas with outlines for a topic.',
    proposedRoles: [
      R('Developer', 'LLM API, web', 2, 'intermediate', 'Build idea generation.'),
      R('Data Analyst', 'Prompt design', 1, 'any-level', 'Tune idea quality.'),
    ],
  },
  {
    projectTitle: 'Pet Care Reminder & Tracker',
    industryTrack: 'health',
    projectDescription: 'An app to track pet feeding, walks, vet visits, and medication with reminders. Software only.',
    projectGoals: 'Set a recurring reminder and log a completed task.',
    proposedRoles: [
      R('Developer', 'React, notifications', 2, 'any-level', 'Build tracking and reminders.'),
      R('Designer', 'Friendly UI', 1, 'beginner', 'Design pet profiles and logs.'),
    ],
  },
  {
    projectTitle: 'Study Group Scheduler',
    industryTrack: 'education',
    projectDescription: 'A tool that finds overlapping free times for a group and schedules study sessions. Software only.',
    projectGoals: 'Find a common slot for 3+ people and book it.',
    proposedRoles: [
      R('Developer', 'Calendar logic, web', 2, 'intermediate', 'Build availability matching.'),
      R('QA Tester', 'Edge cases', 1, 'beginner', 'Test scheduling conflicts.'),
    ],
  },
  {
    projectTitle: 'AI Email Draft Assistant',
    industryTrack: 'technology',
    projectDescription: 'A tool that drafts and refines emails from a short prompt, with tone options. Software only.',
    projectGoals: 'Generate a polished email from a one-line prompt with tone control.',
    proposedRoles: [
      R('Developer', 'LLM integration', 2, 'intermediate', 'Build draft generation and tone.'),
      R('Designer', 'Compose UI', 1, 'beginner', 'Design the writing interface.'),
    ],
  },
  {
    projectTitle: 'Community Garden Plot Manager',
    industryTrack: 'environment',
    projectDescription: 'A platform to manage community garden plots, assignments, and planting schedules. Software only.',
    projectGoals: 'Assign a plot and track a planting schedule.',
    proposedRoles: [
      R('Developer', 'React, database', 2, 'any-level', 'Build plot assignment and schedules.'),
      R('Designer', 'UI/UX', 1, 'beginner', 'Design the plot map and calendar.'),
    ],
  },
  {
    projectTitle: 'Expense Splitting App for Groups',
    industryTrack: 'finance',
    projectDescription: 'An app to split shared expenses among friends and settle balances. Software only.',
    projectGoals: 'Split an expense among a group and show who owes whom.',
    proposedRoles: [
      R('Developer', 'React, calculations', 2, 'any-level', 'Build splitting and balance logic.'),
      R('QA Tester', 'Calculation testing', 1, 'beginner', 'Verify settlements.'),
    ],
  },
  {
    projectTitle: 'AI Product Review Analyzer',
    industryTrack: 'retail',
    projectDescription: 'A dashboard that ingests product reviews and shows sentiment trends and common themes using AI. Software only.',
    projectGoals: 'Analyze a batch of reviews and visualize sentiment and themes.',
    proposedRoles: [
      R('Developer', 'Data viz, AI integration', 2, 'intermediate', 'Build ingestion and the dashboard.'),
      R('Data Analyst', 'NLP, sentiment', 1, 'intermediate', 'Model sentiment and themes.'),
    ],
  },
  {
    projectTitle: 'Fitness Workout Plan Builder',
    industryTrack: 'health',
    projectDescription: 'An app where users build custom workout plans and track progress over time. Software only.',
    projectGoals: 'Build a weekly plan and log completed workouts.',
    proposedRoles: [
      R('Developer', 'React, charts', 2, 'any-level', 'Build plan builder and tracking.'),
      R('Designer', 'Fitness UI', 1, 'beginner', 'Design plan and progress views.'),
    ],
  },
  {
    projectTitle: 'Open-Source Documentation Portal',
    industryTrack: 'technology',
    projectDescription: 'A clean docs site generator for open-source projects with search and versioning. Software only.',
    projectGoals: 'Generate a searchable docs site from markdown files.',
    proposedRoles: [
      R('Developer', 'Static site, search', 2, 'intermediate', 'Build generation and search.'),
      R('Designer', 'Docs UI', 1, 'beginner', 'Design navigation and layout.'),
    ],
  },
  {
    projectTitle: 'AI Storybook Generator for Kids',
    industryTrack: 'education',
    projectDescription: 'A tool that turns a child\'s prompt into an illustrated short story using AI text (and placeholder art). Software only.',
    projectGoals: 'Generate a short multi-page story from a prompt.',
    proposedRoles: [
      R('Developer', 'LLM integration', 2, 'intermediate', 'Build story generation and paging.'),
      R('Designer', 'Playful UI', 1, 'beginner', 'Design the storybook layout.'),
    ],
  },
  {
    projectTitle: 'Restaurant Table Reservation System',
    industryTrack: 'food',
    projectDescription: 'A reservation system for restaurants with availability, booking, and confirmation. Software only.',
    projectGoals: 'Let a diner book an available table and get confirmation.',
    proposedRoles: [
      R('Developer', 'React, database', 2, 'any-level', 'Build availability and booking.'),
      R('QA Tester', 'Booking edge cases', 1, 'beginner', 'Test double-booking prevention.'),
    ],
  },
  {
    projectTitle: 'Personal Knowledge Base Wiki',
    industryTrack: 'technology',
    projectDescription: 'A personal note-linking app where notes connect into a knowledge graph. Software only.',
    projectGoals: 'Create linked notes and visualize their connections.',
    proposedRoles: [
      R('Developer', 'React, graph viz', 2, 'intermediate', 'Build notes and graph view.'),
      R('Designer', 'Information UI', 1, 'beginner', 'Design the editing experience.'),
    ],
  },
  {
    projectTitle: 'AI Social Media Caption Writer',
    industryTrack: 'media',
    projectDescription: 'A tool that writes platform-tailored captions and hashtags from an image description. Software only.',
    projectGoals: 'Generate 5 captions with hashtags for a described post.',
    proposedRoles: [
      R('Developer', 'LLM API', 2, 'intermediate', 'Build caption generation.'),
      R('Data Analyst', 'Prompt design', 1, 'any-level', 'Tune caption tone.'),
    ],
  },
  {
    projectTitle: 'Donation Tracking for Nonprofits',
    industryTrack: 'non-profit',
    projectDescription: 'A dashboard for nonprofits to log donations, track donors, and visualize fundraising progress. Software only.',
    projectGoals: 'Log a donation and update a fundraising progress bar.',
    proposedRoles: [
      R('Developer', 'React, charts', 2, 'any-level', 'Build donation logging and dashboard.'),
      R('QA Tester', 'Data validation', 1, 'beginner', 'Test totals and reporting.'),
    ],
  },
  {
    projectTitle: 'Code Snippet Manager',
    industryTrack: 'technology',
    projectDescription: 'A searchable library where developers save, tag, and reuse code snippets. Software only.',
    projectGoals: 'Save a tagged snippet and find it by search.',
    proposedRoles: [
      R('Developer', 'React, search', 2, 'any-level', 'Build snippet CRUD and search.'),
      R('Designer', 'Developer UI', 1, 'beginner', 'Design the snippet browser.'),
    ],
  },
  {
    projectTitle: 'AI Travel Itinerary Planner',
    industryTrack: 'travel',
    projectDescription: 'A tool that builds a day-by-day travel itinerary from preferences and trip length using AI. Software only.',
    projectGoals: 'Generate a 3-day itinerary tailored to stated interests.',
    proposedRoles: [
      R('Developer', 'LLM integration, maps', 2, 'intermediate', 'Build itinerary generation.'),
      R('Designer', 'Travel UI', 1, 'beginner', 'Design the itinerary view.'),
    ],
  },
  {
    projectTitle: 'Classroom Quiz & Polling Tool',
    industryTrack: 'education',
    projectDescription: 'A live quiz and polling tool teachers run in class with instant results. Software only.',
    projectGoals: 'Run a live poll and show real-time results.',
    proposedRoles: [
      R('Developer', 'Realtime DB, web', 2, 'intermediate', 'Build live polling and results.'),
      R('QA Tester', 'Concurrency testing', 1, 'beginner', 'Test many simultaneous responses.'),
    ],
  },
  {
    projectTitle: 'Subscription Tracker & Reminder',
    industryTrack: 'finance',
    projectDescription: 'An app to track recurring subscriptions, costs, and renewal reminders. Software only.',
    projectGoals: 'Track subscriptions and remind before a renewal.',
    proposedRoles: [
      R('Developer', 'React, notifications', 2, 'any-level', 'Build tracking and reminders.'),
      R('Designer', 'UI/UX', 1, 'beginner', 'Design the dashboard.'),
    ],
  },
  {
    projectTitle: 'AI Resume Keyword Optimizer',
    industryTrack: 'technology',
    projectDescription: 'A tool that compares a resume to a job description and suggests keyword improvements. Software only.',
    projectGoals: 'Show match gaps between a resume and a job post.',
    proposedRoles: [
      R('Developer', 'NLP, web', 2, 'intermediate', 'Build matching and suggestions.'),
      R('Data Analyst', 'Keyword modeling', 1, 'any-level', 'Model match scoring.'),
    ],
  },
  {
    projectTitle: 'Local Farmers Market Directory',
    industryTrack: 'food',
    projectDescription: 'A directory of local farmers markets with vendors, hours, and seasonal produce. Software only.',
    projectGoals: 'List a market with vendors and let users browse by produce.',
    proposedRoles: [
      R('Developer', 'React, database', 2, 'any-level', 'Build directory and filters.'),
      R('Designer', 'UI/UX', 1, 'beginner', 'Design market and vendor pages.'),
    ],
  },
  {
    projectTitle: 'Team Standup Bot Dashboard',
    industryTrack: 'technology',
    projectDescription: 'A dashboard that collects async standup updates and summarizes them for the team. Software only.',
    projectGoals: 'Collect updates from members and show a daily summary.',
    proposedRoles: [
      R('Developer', 'Web, integrations', 2, 'intermediate', 'Build update collection and summary.'),
      R('Data Analyst', 'Summary logic', 1, 'any-level', 'Design the summary view.'),
    ],
  },
  {
    projectTitle: 'AI Plant Disease Identifier (Simulated)',
    industryTrack: 'environment',
    projectDescription: 'A simulated app where users describe plant symptoms and get AI-based care suggestions. Software only; no real diagnosis.',
    projectGoals: 'Map described symptoms to plausible care suggestions.',
    proposedRoles: [
      R('Developer', 'LLM integration', 2, 'intermediate', 'Build symptom-to-suggestion flow.'),
      R('Designer', 'UI/UX', 1, 'beginner', 'Design the input and results.'),
    ],
  },
  {
    projectTitle: 'Book Club Discussion Platform',
    industryTrack: 'media',
    projectDescription: 'A platform for book clubs to schedule reads, post discussion threads, and track progress. Software only.',
    projectGoals: 'Create a club, set a book, and host a discussion thread.',
    proposedRoles: [
      R('Developer', 'React, Firebase', 2, 'any-level', 'Build clubs and threads.'),
      R('Designer', 'Reading UI', 1, 'beginner', 'Design discussion and progress.'),
    ],
  },
  {
    projectTitle: 'Personal Goal OKR Tracker',
    industryTrack: 'technology',
    projectDescription: 'An app to set personal objectives and key results, then track progress quarterly. Software only.',
    projectGoals: 'Set an objective with key results and track progress.',
    proposedRoles: [
      R('Developer', 'React, charts', 2, 'any-level', 'Build OKR tracking.'),
      R('Designer', 'UI/UX', 1, 'beginner', 'Design the OKR dashboard.'),
    ],
  },
  {
    projectTitle: 'AI Customer Feedback Categorizer',
    industryTrack: 'retail',
    projectDescription: 'A tool that auto-categorizes incoming customer feedback into themes for support teams. Software only.',
    projectGoals: 'Auto-sort a batch of feedback into clear categories.',
    proposedRoles: [
      R('Developer', 'NLP, web', 2, 'intermediate', 'Build categorization.'),
      R('Data Analyst', 'Theme modeling', 1, 'intermediate', 'Define and tune categories.'),
    ],
  },
  {
    projectTitle: 'Remote Team Watercooler App',
    industryTrack: 'technology',
    projectDescription: 'A lightweight app for remote teams to share daily prompts and casual updates. Software only.',
    projectGoals: 'Post a daily prompt and let the team respond.',
    proposedRoles: [
      R('Developer', 'Realtime web', 2, 'any-level', 'Build prompts and responses.'),
      R('Designer', 'Social UI', 1, 'beginner', 'Design the feed.'),
    ],
  },
  {
    projectTitle: 'Scholarship Matching Platform',
    industryTrack: 'education',
    projectDescription: 'A platform that matches students to scholarships by profile and eligibility. Software only.',
    projectGoals: 'Match a student profile to relevant scholarships.',
    proposedRoles: [
      R('Developer', 'React, matching logic', 2, 'intermediate', 'Build matching and filters.'),
      R('QA Tester', 'Eligibility testing', 1, 'beginner', 'Verify match accuracy.'),
    ],
  },
  {
    projectTitle: 'AI Workout Form Feedback (Simulated)',
    industryTrack: 'health',
    projectDescription: 'A simulated coach where users describe an exercise and get AI form tips. Software only; no video analysis.',
    projectGoals: 'Give relevant form tips for a described exercise.',
    proposedRoles: [
      R('Developer', 'LLM integration', 2, 'intermediate', 'Build the tip engine.'),
      R('Designer', 'UI/UX', 1, 'beginner', 'Design input and tips.'),
    ],
  },
  {
    projectTitle: 'Community Petition Platform',
    industryTrack: 'non-profit',
    projectDescription: 'A platform to create, sign, and share petitions with signature goals and updates. Software only.',
    projectGoals: 'Create a petition and collect signatures toward a goal.',
    proposedRoles: [
      R('Developer', 'React, Firebase', 2, 'any-level', 'Build petitions and signing.'),
      R('Designer', 'UI/UX', 1, 'beginner', 'Design petition pages.'),
    ],
  },
  {
    projectTitle: 'AI Meeting Scheduler Assistant',
    industryTrack: 'technology',
    projectDescription: 'A tool that finds meeting times across time zones and drafts invites. Software only.',
    projectGoals: 'Find a cross-timezone slot and draft an invite.',
    proposedRoles: [
      R('Developer', 'Calendar logic, web', 2, 'intermediate', 'Build timezone matching.'),
      R('Data Analyst', 'Scheduling logic', 1, 'any-level', 'Refine the matching.'),
    ],
  },
  {
    projectTitle: 'Recipe Nutrition Analyzer',
    industryTrack: 'food',
    projectDescription: 'A tool that estimates the nutrition of a recipe from its ingredients. Software only.',
    projectGoals: 'Estimate calories and macros for a given recipe.',
    proposedRoles: [
      R('Developer', 'React, data lookup', 2, 'any-level', 'Build the analyzer.'),
      R('Data Analyst', 'Nutrition data', 1, 'any-level', 'Source nutrition data.'),
    ],
  },
  {
    projectTitle: 'Open Data City Dashboard',
    industryTrack: 'environment',
    projectDescription: 'A dashboard visualizing public city data like transit, air quality, or budgets. Software only.',
    projectGoals: 'Visualize one public dataset with interactive charts.',
    proposedRoles: [
      R('Developer', 'Data viz, web', 2, 'intermediate', 'Build the dashboard.'),
      R('Data Analyst', 'Data sourcing', 1, 'any-level', 'Clean and prep the data.'),
    ],
  },
  {
    projectTitle: 'AI Debugging Helper for Beginners',
    industryTrack: 'technology',
    projectDescription: 'A tool where beginners paste an error and get a plain-language explanation and fixes. Software only.',
    projectGoals: 'Explain a pasted error and suggest a fix in plain language.',
    proposedRoles: [
      R('Developer', 'LLM integration', 2, 'intermediate', 'Build error explanation.'),
      R('Data Analyst', 'Prompt design', 1, 'any-level', 'Tune explanations.'),
    ],
  },
  {
    projectTitle: 'Virtual Study Room with Timers',
    industryTrack: 'education',
    projectDescription: 'A focus app with shared Pomodoro timers and a quiet co-working feel. Software only.',
    projectGoals: 'Run a shared focus session with a synced timer.',
    proposedRoles: [
      R('Developer', 'Realtime web', 2, 'intermediate', 'Build synced timers.'),
      R('Designer', 'Calm UI', 1, 'beginner', 'Design the focus room.'),
    ],
  },
  {
    projectTitle: 'Secondhand Marketplace for Students',
    industryTrack: 'retail',
    projectDescription: 'A campus marketplace for students to buy and sell used items safely. Software only.',
    projectGoals: 'List an item and let another student message to buy.',
    proposedRoles: [
      R('Developer', 'React, Firebase', 2, 'any-level', 'Build listings and messaging.'),
      R('QA Tester', 'Flow testing', 1, 'beginner', 'Test the buy/sell flow.'),
    ],
  },
  {
    projectTitle: 'AI Grant Proposal Drafter',
    industryTrack: 'non-profit',
    projectDescription: 'A tool that helps nonprofits draft grant proposal sections from a project brief. Software only.',
    projectGoals: 'Draft key proposal sections from a short brief.',
    proposedRoles: [
      R('Developer', 'LLM integration', 2, 'intermediate', 'Build section drafting.'),
      R('Data Analyst', 'Prompt design', 1, 'any-level', 'Tune proposal quality.'),
    ],
  },
  {
    projectTitle: 'Personal Reading Tracker & Stats',
    industryTrack: 'media',
    projectDescription: 'An app to log books read, set goals, and view reading stats over time. Software only.',
    projectGoals: 'Log books and show yearly reading stats.',
    proposedRoles: [
      R('Developer', 'React, charts', 2, 'any-level', 'Build logging and stats.'),
      R('Designer', 'UI/UX', 1, 'beginner', 'Design the reading dashboard.'),
    ],
  },
  {
    projectTitle: 'Symptom-Based Self-Care Guide (Simulated)',
    industryTrack: 'health',
    projectDescription: 'A simulated tool offering general self-care info from described symptoms. Software only; not medical advice.',
    projectGoals: 'Map symptoms to general self-care info with disclaimers.',
    proposedRoles: [
      R('Developer', 'LLM integration', 2, 'intermediate', 'Build the guide.'),
      R('Designer', 'Trustworthy UI', 1, 'beginner', 'Design clear, safe results.'),
    ],
  },
  {
    projectTitle: 'Crowd-Sourced Recipe Sharing Site',
    industryTrack: 'food',
    projectDescription: 'A site where users share recipes, rate them, and save favorites. Software only.',
    projectGoals: 'Post a recipe and let others rate and save it.',
    proposedRoles: [
      R('Developer', 'React, Firebase', 2, 'any-level', 'Build recipe CRUD and ratings.'),
      R('Designer', 'Food UI', 1, 'beginner', 'Design recipe pages.'),
    ],
  },
  {
    projectTitle: 'Ai-Assisted Lesson Plan Builder',
    industryTrack: 'education',
    projectDescription: 'A tool that helps teachers build lesson plans aligned to objectives using AI. Software only.',
    projectGoals: 'Generate a lesson plan from a topic and grade level.',
    proposedRoles: [
      R('Developer', 'LLM integration', 2, 'intermediate', 'Build plan generation.'),
      R('Data Analyst', 'Prompt design', 1, 'any-level', 'Align to objectives.'),
    ],
  },
  {
    projectTitle: 'Local Service Provider Directory',
    industryTrack: 'retail',
    projectDescription: 'A directory connecting users to local service providers with reviews and booking requests. Software only.',
    projectGoals: 'List a provider and let a user request a booking.',
    proposedRoles: [
      R('Developer', 'React, database', 2, 'any-level', 'Build directory and requests.'),
      R('QA Tester', 'Flow testing', 1, 'beginner', 'Test booking requests.'),
    ],
  },
  {
    projectTitle: 'AI Note-to-Slide Generator',
    industryTrack: 'technology',
    projectDescription: 'A tool that turns bullet notes into a simple slide deck outline. Software only.',
    projectGoals: 'Turn notes into a structured slide outline.',
    proposedRoles: [
      R('Developer', 'LLM integration', 2, 'intermediate', 'Build the generator.'),
      R('Designer', 'Slide UI', 1, 'beginner', 'Design the deck preview.'),
    ],
  },
  {
    projectTitle: 'Volunteer Hours Tracking System',
    industryTrack: 'non-profit',
    projectDescription: 'A system for organizations to log and verify volunteer hours with reports. Software only.',
    projectGoals: 'Log volunteer hours and generate a summary report.',
    proposedRoles: [
      R('Developer', 'React, database', 2, 'any-level', 'Build logging and reports.'),
      R('QA Tester', 'Report testing', 1, 'beginner', 'Verify totals.'),
    ],
  },
  {
    projectTitle: 'Personal Finance Goal Visualizer',
    industryTrack: 'finance',
    projectDescription: 'An app that visualizes savings goals and projects timelines to reach them. Software only.',
    projectGoals: 'Set a savings goal and project a timeline chart.',
    proposedRoles: [
      R('Developer', 'React, charts', 2, 'any-level', 'Build goal projection.'),
      R('Designer', 'Data viz UI', 1, 'beginner', 'Design the visualizer.'),
    ],
  },
  {
    projectTitle: 'AI Trivia Game Generator',
    industryTrack: 'media',
    projectDescription: 'A tool that generates themed trivia quizzes with an AI question writer. Software only.',
    projectGoals: 'Generate a themed quiz and let users play it.',
    proposedRoles: [
      R('Developer', 'LLM integration, web', 2, 'intermediate', 'Build generation and gameplay.'),
      R('Designer', 'Game UI', 1, 'beginner', 'Design the quiz experience.'),
    ],
  },
  {
    projectTitle: 'Sustainable Product Comparison Tool',
    industryTrack: 'environment',
    projectDescription: 'A tool comparing products on sustainability metrics to help users choose greener options. Software only.',
    projectGoals: 'Compare two products on key sustainability metrics.',
    proposedRoles: [
      R('Developer', 'React, data', 2, 'any-level', 'Build comparison.'),
      R('Data Analyst', 'Sustainability data', 1, 'any-level', 'Source and model metrics.'),
    ],
  },
  {
    projectTitle: 'Mentor-Mentee Matching Platform',
    industryTrack: 'education',
    projectDescription: 'A platform matching mentees to mentors by goals, field, and availability. Software only.',
    projectGoals: 'Match a mentee to a suitable mentor and start a thread.',
    proposedRoles: [
      R('Developer', 'React, matching', 2, 'intermediate', 'Build matching and messaging.'),
      R('Designer', 'UI/UX', 1, 'beginner', 'Design profiles and matches.'),
    ],
  },
  {
    projectTitle: 'AI Customer Support Knowledge Bot',
    industryTrack: 'technology',
    projectDescription: 'A bot that answers support questions from a company\'s knowledge base using AI. Software only.',
    projectGoals: 'Answer a question accurately from a small knowledge base.',
    proposedRoles: [
      R('Developer', 'LLM, retrieval', 2, 'intermediate', 'Build retrieval and answering.'),
      R('Data Analyst', 'Knowledge base prep', 1, 'any-level', 'Structure the knowledge base.'),
    ],
  },
  {
    projectTitle: 'Group Trip Expense & Planning App',
    industryTrack: 'travel',
    projectDescription: 'An app to plan group trips with shared itineraries and split expenses. Software only.',
    projectGoals: 'Plan a shared itinerary and split trip expenses.',
    proposedRoles: [
      R('Developer', 'React, calculations', 2, 'intermediate', 'Build planning and splitting.'),
      R('QA Tester', 'Calculation testing', 1, 'beginner', 'Verify expense splits.'),
    ],
  },
  {
    projectTitle: 'Daily Affirmation & Mood App',
    industryTrack: 'health',
    projectDescription: 'An app delivering daily affirmations and tracking mood responses. Software only.',
    projectGoals: 'Deliver a daily affirmation and log a mood.',
    proposedRoles: [
      R('Developer', 'React, notifications', 2, 'any-level', 'Build delivery and logging.'),
      R('Designer', 'Calm UI', 1, 'beginner', 'Design the daily experience.'),
    ],
  },
  {
    projectTitle: 'Open-Source Issue Triage Dashboard',
    industryTrack: 'technology',
    projectDescription: 'A dashboard that organizes and prioritizes open-source repo issues. Software only.',
    projectGoals: 'Pull issues and sort them by priority labels.',
    proposedRoles: [
      R('Developer', 'API integration, web', 2, 'intermediate', 'Build issue ingestion and sorting.'),
      R('Designer', 'Dashboard UI', 1, 'beginner', 'Design the triage board.'),
    ],
  },
  {
    projectTitle: 'AI Cover Letter Personalizer',
    industryTrack: 'technology',
    projectDescription: 'A tool that tailors a cover letter to a specific job posting using AI. Software only.',
    projectGoals: 'Personalize a cover letter to a pasted job posting.',
    proposedRoles: [
      R('Developer', 'LLM integration', 2, 'intermediate', 'Build personalization.'),
      R('Data Analyst', 'Prompt design', 1, 'any-level', 'Tune tailoring quality.'),
    ],
  },
  {
    projectTitle: 'Community Lost & Found Board',
    industryTrack: 'non-profit',
    projectDescription: 'A local board to post lost and found items with photos and locations. Software only.',
    projectGoals: 'Post a found item and let an owner claim it.',
    proposedRoles: [
      R('Developer', 'React, Firebase', 2, 'any-level', 'Build posting and claiming.'),
      R('Designer', 'UI/UX', 1, 'beginner', 'Design item cards.'),
    ],
  },
  {
    projectTitle: 'Habit Streak Leaderboard',
    industryTrack: 'health',
    projectDescription: 'A social app where friends compete on habit streaks with a leaderboard. Software only.',
    projectGoals: 'Track habits and rank friends on a leaderboard.',
    proposedRoles: [
      R('Developer', 'Realtime DB, web', 2, 'intermediate', 'Build streaks and leaderboard.'),
      R('Designer', 'Gamified UI', 1, 'beginner', 'Design the leaderboard.'),
    ],
  },
  {
    projectTitle: 'AI Blog Outline & SEO Helper',
    industryTrack: 'media',
    projectDescription: 'A tool that generates blog outlines with SEO keyword suggestions. Software only.',
    projectGoals: 'Generate an outline with keyword suggestions for a topic.',
    proposedRoles: [
      R('Developer', 'LLM integration', 2, 'intermediate', 'Build outline and SEO.'),
      R('Data Analyst', 'SEO/keyword logic', 1, 'any-level', 'Tune keyword relevance.'),
    ],
  },
  {
    projectTitle: 'Inventory Forecasting Dashboard',
    industryTrack: 'retail',
    projectDescription: 'A dashboard that forecasts inventory needs from past sales trends. Software only.',
    projectGoals: 'Forecast reorder needs from historical sales data.',
    proposedRoles: [
      R('Developer', 'Data viz, web', 2, 'intermediate', 'Build forecasting dashboard.'),
      R('Data Analyst', 'Forecasting models', 1, 'intermediate', 'Build the forecast logic.'),
    ],
  },
  {
    projectTitle: 'Peer Code Review Practice Platform',
    industryTrack: 'technology',
    projectDescription: 'A platform where learners practice reviewing each other\'s code with guided rubrics. Software only.',
    projectGoals: 'Submit code and receive a structured peer review.',
    proposedRoles: [
      R('Developer', 'React, Firebase', 2, 'intermediate', 'Build submission and review.'),
      R('Designer', 'Review UI', 1, 'beginner', 'Design the review flow.'),
    ],
  },
  {
    projectTitle: 'AI Meal Plan Generator',
    industryTrack: 'food',
    projectDescription: 'A tool that builds weekly meal plans from dietary preferences and goals. Software only.',
    projectGoals: 'Generate a 7-day meal plan matching stated preferences.',
    proposedRoles: [
      R('Developer', 'LLM integration', 2, 'intermediate', 'Build plan generation.'),
      R('Data Analyst', 'Nutrition logic', 1, 'any-level', 'Validate plans.'),
    ],
  },
  {
    projectTitle: 'Civic Issue Reporting Map',
    industryTrack: 'environment',
    projectDescription: 'A map where citizens report local issues (potholes, litter) and track status. Software only.',
    projectGoals: 'Report an issue on the map and track its status.',
    proposedRoles: [
      R('Developer', 'React, maps', 2, 'intermediate', 'Build reporting and status.'),
      R('QA Tester', 'Flow testing', 1, 'beginner', 'Test the report lifecycle.'),
    ],
  },
  {
    projectTitle: 'Personal Portfolio Site Builder',
    industryTrack: 'technology',
    projectDescription: 'A no-code tool to build a personal portfolio site from a form. Software only.',
    projectGoals: 'Generate a live portfolio site from entered details.',
    proposedRoles: [
      R('Developer', 'React, templating', 2, 'intermediate', 'Build the generator.'),
      R('Designer', 'Portfolio templates', 1, 'beginner', 'Design template themes.'),
    ],
  },
  {
    projectTitle: 'AI Study Plan Generator',
    industryTrack: 'education',
    projectDescription: 'A tool that builds a study plan from exam date, topics, and available time. Software only.',
    projectGoals: 'Generate a paced study plan from a goal and deadline.',
    proposedRoles: [
      R('Developer', 'LLM integration', 2, 'intermediate', 'Build plan generation.'),
      R('Designer', 'UI/UX', 1, 'beginner', 'Design the plan view.'),
    ],
  },
];

// Return a random template in the same shape as generateProject().
export const getRandomTemplate = () => {
  const t = PROJECT_TEMPLATES[Math.floor(Math.random() * PROJECT_TEMPLATES.length)];
  // Deep-ish copy so the caller can edit roles without mutating the library.
  return {
    projectTitle: t.projectTitle,
    projectDescription: t.projectDescription,
    projectGoals: t.projectGoals,
    industryTrack: t.industryTrack,
    proposedRoles: t.proposedRoles.map(r => ({ ...r })),
  };
};

export const TEMPLATE_COUNT = PROJECT_TEMPLATES.length;
