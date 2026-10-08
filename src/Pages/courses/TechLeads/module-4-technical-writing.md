<!-- order: 4 -->
## Module 4: Technical Writing

Time: about 6 hours

**By the end of this module, you'll be able to:**
- Choose the right page type (tutorial, how-to, reference, explanation) for a reader's goal
- Write a how-to guide and a GitHub README, and revise them after watching someone follow them
- Write a decision document with fairly described options and a clear ask, plus a matching decision record
- Take meeting notes that capture only decisions and owned, dated action items
- Edit a page in passes (structure, then sentences) using plain language, active voice, and front-loading

**Purpose of this module:** Write documentation, decisions, and updates that people can actually use. Technical writers, project coordinators, and tech leads spend much of their week writing, and clear writing is often the fastest way a non-coder makes a technical team faster.

**Tools needed for this module:** A document tool (Google Docs, Notion, or any word processor) and a free [GitHub](https://github.com) account for the README lab. No coding required.

### Topic 4.1: Writing Documentation

#### Concept

Documentation is how a team's knowledge outlives any one person. Good documentation starts from the reader's task, not the writer's knowledge: someone arrives with a goal (install this, fix that, understand why), and the page exists to get them there. Different goals need different kinds of page, and mixing them is the most common reason documentation feels hard to use.

- A **tutorial** teaches a beginner by walking them through a complete, working example from start to finish
- A **how-to guide** gives the steps to complete one specific task, for a reader who already knows the basics
- A **reference** page lists facts to look up, such as settings, commands, or fields, organised for scanning rather than reading
- An **explanation** covers the why: background, design choices, and trade-offs
- A **README** is the front door of a project: what it is, who it's for, how to start, and where to get help

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#1d4ed8', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    READER["<b>Reader's goal</b><br/><br/>Learn, do,<br/>look up, understand"]
    TYPE["<b>Page type</b><br/><br/>Tutorial, how-to,<br/>reference, explanation"]
    DRAFT["<b>Draft</b><br/><br/>Task-first,<br/>tested steps"]
    TEST["<b>Test</b><br/><br/>Someone new<br/>follows it"]

    READER ==> TYPE ==> DRAFT ==> TEST

    style READER fill:#1d4ed8,color:#fff,stroke:#1e3a8a,stroke-width:4px
    style TYPE fill:#dbeafe,color:#1a202c,stroke:#1d4ed8,stroke-width:4px
    style DRAFT fill:#e2e8f0,color:#1a202c,stroke:#1d4ed8,stroke-width:4px
    style TEST fill:#F5F5F5,color:#1a202c,stroke:#262626,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Before writing, name the reader and their goal in one sentence; if you can't, the page will wander
- Every set of steps should be tested by following it exactly, ideally by someone who didn't write it

#### Where you'd actually use this

A new team member spends two days getting a project running because setup lives in old chat messages. You write a README with a tested how-to for setup, and the next person is running it within an hour.

#### Lab

1. **Pick a real tool or process** you know well, such as submitting expenses, setting up an app, or running a meeting template.
2. **Write one sentence** naming the reader and the goal: "A new team member who needs to…"
3. **Write a how-to guide** for it: a short title that states the task, one line on prerequisites, then numbered steps, each starting with a verb.
4. **Create a GitHub repository** (on github.com, choose **New repository** and tick **Add a README file**), then edit `README.md` in the browser with the pencil icon and write four sections, each under a `## ` heading: what this is, who it's for, how to get started, and where to get help. Commit the change and check how it renders on the repository page.
5. **Have someone follow your how-to** without your help, and note every place they paused, asked a question, or went wrong. Revise those steps.

```lab
{
 "type": "sort",
 "title": "Which kind of page does the reader need?",
 "prompt": "Match each reader's goal to the page type that serves it.",
 "buckets": [
  "Tutorial",
  "How-to guide",
  "Reference",
  "Explanation"
 ],
 "items": [
  {
   "text": "\"I'm new. Walk me through building my first report from start to finish.\"",
   "bucket": "Tutorial",
   "why": "A beginner learning through a complete example."
  },
  {
   "text": "\"I know the tool. How do I reset a user's password?\"",
   "bucket": "How-to guide",
   "why": "One specific task for someone who knows the basics."
  },
  {
   "text": "\"What does the timeout setting accept?\"",
   "bucket": "Reference",
   "why": "A fact to look up."
  },
  {
   "text": "\"Why did we choose this vendor over the others?\"",
   "bucket": "Explanation",
   "why": "Background and reasons."
  }
 ]
}
```

#### Checkpoint
You have a tested how-to guide revised from a real reader's attempt, and a README with all four sections.

#### Quiz
1. What are the four kinds of documentation page, and what goal does each serve?
2. What should a README cover?
3. Why should documentation start from the reader's task?
4. What is the best way to check a set of steps?
5. Why does mixing page types make documentation harder to use?

*Answers: 1) Tutorials teach a beginner through a complete example; how-to guides complete one task; reference pages hold facts to look up; explanations cover the why. 2) What the project is, who it's for, how to get started, and where to get help. 3) Readers arrive with a goal, and the page exists to get them there, not to record everything the writer knows. 4) Have someone who didn't write them follow the steps exactly and note where they struggle. 5) A reader looking for one quick task has to dig through background, and a learner gets a list of facts instead of guidance.*

---

### Topic 4.2: Writing for Decisions

#### Concept

Teams make expensive decisions: which tool to buy, how to design a feature, whether to delay a launch. Written decision documents make those choices clearer, fairer, and easier to revisit, because everyone reviews the same options and reasons instead of whoever spoke last in a meeting.

- A **decision document** (also called a proposal or design doc) states the problem, the options, the criteria used to compare them, a recommendation, and the trade-offs
- A **decision record** is a short, dated note of what was decided, by whom, and why, kept so future readers don't reopen settled questions
- **Meeting notes** that matter capture decisions and action items (who does what, by when), not a transcript
- Writing **options fairly**, including the ones you don't recommend, builds trust and exposes weak reasoning
- A clear **ask** tells readers exactly what you need from them and by when: approval, feedback, or awareness

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#1d4ed8', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    PROB["<b>Problem</b><br/><br/>Why decide<br/>now"]
    OPT["<b>Options</b><br/><br/>Two or three,<br/>written fairly"]
    REC["<b>Recommendation</b><br/><br/>With trade-offs<br/>stated"]
    REC2["<b>Decision record</b><br/><br/>What, who,<br/>why, when"]

    PROB ==> OPT ==> REC ==> REC2

    style PROB fill:#1d4ed8,color:#fff,stroke:#1e3a8a,stroke-width:4px
    style OPT fill:#dbeafe,color:#1a202c,stroke:#1d4ed8,stroke-width:4px
    style REC fill:#e2e8f0,color:#1a202c,stroke:#1d4ed8,stroke-width:4px
    style REC2 fill:#F5F5F5,color:#1a202c,stroke:#262626,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Put the recommendation and the ask near the top; busy readers may read only the first paragraph
- A decision without a written record tends to be re-argued within months

#### Where you'd actually use this

Your team keeps debating which project-tracking tool to adopt. A two-page decision document compares three tools against agreed criteria, gets approval in one review, and its decision record answers the question when a new manager asks six months later.

#### Lab

1. **Choose a real decision** your team, club, or organisation faces, or recently faced.
2. **Write a one-page decision document** with five headings: problem, options (at least two), criteria, recommendation, and the ask.
3. **Describe each option fairly**, including one real advantage of every option you don't recommend.
4. **Write the decision record** as if the decision was made: date, decision, decision-maker, and the main reasons, in under 150 words.
5. **Take notes at a real meeting** that record only decisions and action items, each action with an owner and a date.

#### Checkpoint
You have a decision document with fairly described options and a clear ask, a matching decision record, and one set of decision-focused meeting notes.

#### Quiz
1. What sections should a decision document include?
2. What is a decision record, and why keep one?
3. What should meeting notes capture?
4. Why describe options you don't recommend fairly?
5. Where should the recommendation and the ask go, and why?

*Answers: 1) The problem, the options, the criteria, a recommendation with trade-offs, and the ask. 2) A short, dated note of what was decided, by whom, and why; it stops settled questions being reopened. 3) Decisions and action items, each with an owner and a date. 4) It builds trust and exposes weak reasoning, and readers can check you've considered alternatives. 5) Near the top, because many readers only read the opening.*

---

### Topic 4.3: Editing for Clarity

#### Concept

First drafts are for getting ideas down; editing is where writing becomes useful. Clear technical writing uses plain words, short sentences, and a structure the reader can scan. Editing is a skill in its own right, and teams value people who can turn a confusing page into a clear one.

- **Plain language** uses the simplest word that is still accurate, and explains a technical term the first time it appears
- **Active voice** names who does what ("the system sends an email") instead of hiding it ("an email is sent")
- **Front-loading** puts the main point first in every section, paragraph, and sentence
- **Scannable structure** uses descriptive headings, short paragraphs, and numbered lists for steps
- A **style guide** records a team's choices (spelling, capitalisation, tone) so documents read consistently

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#1d4ed8', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    DRAFT["<b>Draft</b><br/><br/>Ideas down,<br/>unpolished"]
    STRUCT["<b>Structure</b><br/><br/>Headings and<br/>order first"]
    SENT["<b>Sentences</b><br/><br/>Plain words,<br/>active voice"]
    CHECK["<b>Check</b><br/><br/>Read aloud,<br/>test with a reader"]

    DRAFT ==> STRUCT ==> SENT ==> CHECK

    style DRAFT fill:#1d4ed8,color:#fff,stroke:#1e3a8a,stroke-width:4px
    style STRUCT fill:#dbeafe,color:#1a202c,stroke:#1d4ed8,stroke-width:4px
    style SENT fill:#e2e8f0,color:#1a202c,stroke:#1d4ed8,stroke-width:4px
    style CHECK fill:#F5F5F5,color:#1a202c,stroke:#262626,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Edit in passes: structure first, then paragraphs, then sentences; fixing commas on a page that needs reorganising wastes time
- Reading a draft aloud is one of the fastest ways to find sentences that are too long or unclear

#### Where you'd actually use this

An incident report is accurate but a wall of text, and managers miss the key risk. Rewritten with the impact in the first line, clear headings, and short paragraphs, it's read and acted on the same day.

#### Lab

1. **Find a real page** that's hard to read: product documentation, a policy, or an old document of your own.
2. **Edit the structure first:** write the page's main point in one sentence, put it at the top, and add descriptive headings.
3. **Edit the sentences:** replace jargon with plain words, turn passive sentences into active ones, and split any sentence over 25 words.
4. **Read the result aloud** and fix anything you stumble over.
5. **Write a five-rule style guide** for your team, based on the problems you fixed.

#### Checkpoint
You have a before-and-after version of a real page, edited in passes, and a five-rule style guide drawn from what you fixed.

#### Quiz
1. What is plain language?
2. Rewrite "The report was reviewed" in active voice.
3. What does front-loading mean?
4. Why edit in passes, starting with structure?
5. What is a style guide for?

*Answers: 1) Using the simplest accurate words, and explaining technical terms when they first appear. 2) For example, "The manager reviewed the report": the sentence names who did it. 3) Putting the main point first in each section, paragraph, and sentence. 4) Structure problems affect the whole page, so fixing sentences first can waste effort on text that later moves or disappears. 5) Recording a team's writing choices so every document reads consistently.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "pencil",
   "kicker": "Module 4 · Technical writing",
   "title": "Writing people can use",
   "beats": [
    {
     "say": "Welcome to Module 4."
    },
    {
     "say": "Tech leads and coordinators spend much of their week writing, and clear writing is often the fastest way a non-coder makes a technical team faster."
    }
   ]
  },
  {
   "kind": "list",
   "art": "book",
   "kicker": "Topic 4.1 · Documentation",
   "title": "Start from the reader's goal",
   "items": [
    [
     "Tutorial",
     "Learn through a full example"
    ],
    [
     "How-to guide",
     "Do one specific task"
    ],
    [
     "Reference",
     "Look up a fact"
    ],
    [
     "Explanation",
     "Understand the why"
    ]
   ],
   "beats": [
    {
     "say": "Good documentation starts from the reader's task, not the writer's knowledge. Different goals need different pages.",
     "show": 0
    },
    {
     "say": "A tutorial walks a beginner through a complete, working example.",
     "show": 1
    },
    {
     "say": "A how-to guide gives the steps for one task, for someone who knows the basics.",
     "show": 2
    },
    {
     "say": "A reference page lists facts to look up, organised for scanning.",
     "show": 3
    },
    {
     "say": "And an explanation covers the why: background, design choices and trade-offs.",
     "show": 4
    },
    {
     "say": "Mixing them is the most common reason documentation feels hard to use.",
     "show": 4
    }
   ]
  },
  {
   "kind": "flow",
   "art": "test",
   "kicker": "Concept",
   "title": "Write it, then test it",
   "steps": [
    "Name the reader's goal",
    "Pick the page type",
    "Draft task-first",
    "Someone new follows it"
   ],
   "beats": [
    {
     "say": "Before writing, name the reader and their goal in one sentence.",
     "show": 1
    },
    {
     "say": "Choose the page type that serves that goal.",
     "show": 2
    },
    {
     "say": "Draft it task first. For a how-to: a title stating the task, one line of prerequisites, and numbered steps that each start with a verb.",
     "show": 3
    },
    {
     "say": "Then have someone who didn't write it follow it exactly, and revise every step where they paused or went wrong.",
     "show": 4
    }
   ]
  },
  {
   "kind": "list",
   "art": "git",
   "kicker": "Lab · Step 4",
   "title": "Your README on GitHub",
   "items": [
    [
     "What this is",
     ""
    ],
    [
     "Who it's for",
     ""
    ],
    [
     "How to get started",
     ""
    ],
    [
     "Where to get help",
     ""
    ]
   ],
   "beats": [
    {
     "say": "A read me is a project's front door.",
     "show": 0
    },
    {
     "say": "On GitHub, create a new repository and tick Add a README file. Edit read me dot m d in the browser with the pencil icon.",
     "show": 0
    },
    {
     "say": "Write four sections, each under its own heading: what this is.",
     "show": 1
    },
    {
     "say": "Who it's for.",
     "show": 2
    },
    {
     "say": "How to get started.",
     "show": 3
    },
    {
     "say": "And where to get help. Commit, and check how it renders.",
     "show": 4
    }
   ]
  },
  {
   "kind": "list",
   "art": "fork",
   "kicker": "Topic 4.2 · Writing for decisions",
   "title": "The decision document",
   "items": [
    [
     "Problem",
     "Why decide now"
    ],
    [
     "Options",
     "Two or more, written fairly"
    ],
    [
     "Criteria",
     "How you'll compare"
    ],
    [
     "Recommendation",
     "With trade-offs"
    ],
    [
     "The ask",
     "What you need, by when"
    ]
   ],
   "beats": [
    {
     "say": "Written decision documents mean everyone reviews the same options, instead of following whoever spoke last.",
     "show": 0
    },
    {
     "say": "State the problem.",
     "show": 1
    },
    {
     "say": "The options, at least two, each described fairly, including a real advantage of the ones you don't recommend.",
     "show": 2
    },
    {
     "say": "The criteria you'll compare them on.",
     "show": 3
    },
    {
     "say": "Your recommendation, with its trade-offs.",
     "show": 4
    },
    {
     "say": "And the ask: approval, feedback, or awareness, and by when. Put the recommendation and the ask near the top.",
     "show": 5
    }
   ]
  },
  {
   "kind": "list",
   "art": "file",
   "kicker": "Concept",
   "title": "Records and notes",
   "items": [
    [
     "Decision record",
     "What, who, why, when · under 150 words"
    ],
    [
     "Meeting notes",
     "Decisions + actions with owner and date"
    ]
   ],
   "beats": [
    {
     "say": "Then keep a record.",
     "show": 0
    },
    {
     "say": "A decision record is a short, dated note: what was decided, by whom, and why. Without one, decisions tend to be re-argued within months.",
     "show": 1
    },
    {
     "say": "And useful meeting notes aren't a transcript. They capture decisions and action items, each with an owner and a date.",
     "show": 2
    }
   ]
  },
  {
   "kind": "list",
   "art": "search",
   "kicker": "Topic 4.3 · Editing for clarity",
   "title": "Where writing becomes useful",
   "items": [
    [
     "Plain language",
     "Simplest accurate word"
    ],
    [
     "Active voice",
     "Who does what"
    ],
    [
     "Front-loading",
     "Main point first"
    ],
    [
     "Scannable structure",
     "Headings, short paragraphs, lists"
    ],
    [
     "Style guide",
     "Consistent team choices"
    ]
   ],
   "beats": [
    {
     "say": "First drafts get ideas down. Editing makes them useful.",
     "show": 0
    },
    {
     "say": "Plain language: the simplest accurate word, with technical terms explained the first time.",
     "show": 1
    },
    {
     "say": "Active voice: name who does what.",
     "show": 2
    },
    {
     "say": "Front-loading: the main point first, in every section, paragraph and sentence.",
     "show": 3
    },
    {
     "say": "Scannable structure: descriptive headings, short paragraphs, numbered steps.",
     "show": 4
    },
    {
     "say": "And a style guide records your team's choices, so documents read consistently.",
     "show": 5
    }
   ]
  },
  {
   "kind": "quote",
   "art": "doc",
   "kicker": "Concept",
   "title": "Edit in passes",
   "quote": "\"The report was reviewed\" → \"The manager reviewed the report.\"",
   "beats": [
    {
     "say": "Here's active voice in action.",
     "show": 0
    },
    {
     "say": "The report was reviewed becomes: the manager reviewed the report. Now it names who did it.",
     "show": 1
    },
    {
     "say": "Edit in passes: structure first, then sentences. Fixing commas on a page that needs reorganising wastes time.",
     "show": 1
    },
    {
     "say": "Then read it aloud, and split any sentence over twenty five words.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why edit in passes, starting with structure?",
   "options": [
    "Headings matter more than sentences",
    "Fixing sentences first can waste effort on text that later moves or disappears",
    "A style guide requires it"
   ],
   "answer": 1,
   "good": "That's right. Structure problems affect the whole page, so polishing sentences first can waste effort on text that later moves or disappears.",
   "bad": "Not quite. Structure problems affect the whole page, so polishing sentences first can waste effort on text that later moves or disappears.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why edit in passes, starting with structure?",
     "show": 0
    },
    {
     "say": "Tap your answer.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "proof",
   "kicker": "Checkpoint",
   "title": "You're done when",
   "items": [
    [
     "A tested, revised how-to guide",
     ""
    ],
    [
     "A README with four sections",
     ""
    ],
    [
     "A decision document with a clear ask",
     ""
    ],
    [
     "A decision record + meeting notes",
     ""
    ],
    [
     "A page edited in passes + style guide",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 4.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you've written a how-to guide and revised it after watching someone follow it,",
     "show": 1
    },
    {
     "say": "you've written a read me with all four sections,",
     "show": 2
    },
    {
     "say": "you've written a decision document with fair options and a clear ask,",
     "show": 3
    },
    {
     "say": "you've written a decision record and decision-focused meeting notes,",
     "show": 4
    },
    {
     "say": "and you've edited a real page in passes and written a five-rule style guide.",
     "show": 5
    },
    {
     "say": "Next, in Module 5, research for tech teams.",
     "show": 5
    }
   ]
  }
 ]
}
```

---

## Module 4 Completion Checklist
- [ ] Written a how-to guide and revised it after watching someone follow it
- [ ] Written a README with all four sections
- [ ] Written a decision document with fairly described options and a clear ask
- [ ] Written a decision record and decision-focused meeting notes
- [ ] Edited a real page in passes and written a five-rule style guide
