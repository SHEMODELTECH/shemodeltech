<!-- order: 6 -->
# Workflow Automation Specialist (Zapier and Make): Hands-On Project Tutorials

This course turns each project into a step-by-step, hands-on build. You learn each idea at the moment you need it, while building the thing, and every project hands its result to the next one, ending in a multi-step automation that runs a real process by itself. Follow the projects in order.

**By the end of this course, you'll be able to:**
- Build and test a two-step Zap that maps spreadsheet data into an email
- Build Make scenarios with routers, filters, and date formatting functions
- Chain several modules in Make and add an error handler that logs failures
- Receive data with a webhook and send data out with an HTTP request
- Automate a full business process with a sheet-based approval step and logging
- Monitor automations, design within quotas, and write a handoff document

**Free plans only.** Every lab here works on free plans. Zapier's free plan has been limited to simple two-step Zaps (one trigger plus one action), without Filters, Paths, or Webhooks by Zapier. Make's free plan has included multi-step scenarios, routers, filters, webhooks, and HTTP requests, with a monthly allowance of credits (called operations before 2025) and a limit on how many scenarios can be active at once. So Project 1 uses Zapier for a two-step example, and the multi-step, branching, and webhook projects use Make. Plans change, so check the current pricing page of each tool before you start.

---

## Project 1 (Module 1): Build Your First Automation

**Time:** about 1 hour

**Goal:** Connect two apps so that an action in one automatically triggers an action in the other.

**Step 1: Create a free Zapier account.**
Go to zapier.com and sign up. Zapier connects apps without code and is one of the most widely used automation tools. The free plan should be enough for this project because it needs only one trigger and one action (check the current plan).

**Step 2: Understand triggers.**
A trigger is the event that starts an automation, such as a new row being added to a spreadsheet. Every automation begins with one, and choosing the right trigger decides when your automation runs.

**Step 3: Understand Zaps.**
A Zap is one automated workflow: a trigger plus one or more actions. Thinking in Zaps (this happens, so do that) is the core idea behind all automation. On Zapier's free plan, a Zap may be limited to one action (check the current plan).

**Step 4: Pick a trigger app and event.**
Create a Google Sheet with the headers `name`, `email` in row 1 and one sample row. In Zapier, create a Zap, choose Google Sheets as the trigger app, select "New Spreadsheet Row" as the event, connect your Google account, and pick your sheet and worksheet.

**Step 5: Understand actions.**
An action is what the automation does when the trigger fires, such as sending an email or posting a message. A trigger with no action does nothing; the action is the work you are saving a person from doing.

**Step 6: Add an action.**
Add an action step: Gmail, "Send Email", and set the recipient (your own address while testing), subject, and body.

**Step 7: Map data between steps.**
Mapping passes data from the trigger into the action. Click into the email body and insert the `name` and `email` fields from the trigger, for example: "New sign-up: {name} ({email})". This is what makes the automation carry the specific details of each row.

**Step 8: Test and turn on the Zap.**
Use the built-in test, check the email arrives, then publish (turn on) the Zap and add a real row. Google Sheets is a polling trigger: Zapier checks for new rows on a timer, which is slow on the free plan (check the current plan for the interval), so the email will not arrive instantly. Wait, then check the Zap's history if nothing arrives.

### Project Structure
```text
Zap 1
│
├── Trigger: Google Sheets - New Spreadsheet Row
└── Action:  Gmail - Send Email
    └── mapped fields: name, email from the new row
```

### What You Learned
- ✅ What triggers, actions, and Zaps are
- ✅ Connecting two apps into one workflow
- ✅ Mapping data from a trigger into an action
- ✅ Testing an automation before enabling it
- ✅ Why polling triggers are not instant

### Portfolio Project
**First Working Automation**: Connected two apps into a tested, live automation that removes a manual step.
**Skills:** Zapier, Triggers and Actions, Data Mapping, No-Code Automation.

**Deliverable:** A live Zap that emails a notification whenever a new spreadsheet row is added.

### Quiz

1. What is the difference between a trigger and an action?
2. Why do you map fields from the trigger into the action?
3. You add a row and no email arrives after one minute. What is the most likely reason on the free Zapier plan?
4. Why does this project fit on Zapier's free plan?

*Answers: 1) A trigger is the event that starts the automation; an action is the work done after it fires. 2) So each run uses that row's specific details, like the person's name and email, instead of fixed text. 3) Google Sheets is a polling trigger, and on the free plan Zapier checks for new rows only every several minutes. 4) It uses only one trigger and one action, which fits within the free plan's limits.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "chain",
   "kicker": "Project 1 · Your first automation",
   "title": "This happens, so do that",
   "beats": [
    {
     "say": "Welcome to Workflow Automation with Zapier and Make."
    },
    {
     "say": "In this first project, you connect two apps, so an action in one automatically triggers an action in the other."
    },
    {
     "say": "Every lab works on free plans. Plans change, so check each tool's current pricing page before you start."
    }
   ]
  },
  {
   "kind": "list",
   "art": "bulb",
   "kicker": "Concept",
   "title": "Triggers, actions and Zaps",
   "items": [
    [
     "Trigger",
     "The event that starts it"
    ],
    [
     "Action",
     "The work done when it fires"
    ],
    [
     "Zap",
     "Trigger + action(s)"
    ]
   ],
   "beats": [
    {
     "say": "Three ideas sit behind every automation.",
     "show": 0
    },
    {
     "say": "A trigger is the event that starts it, like a new row added to a spreadsheet.",
     "show": 1
    },
    {
     "say": "An action is the work it does when the trigger fires, like sending an email.",
     "show": 2
    },
    {
     "say": "And a Zap is one automated workflow in Zapier: a trigger plus one or more actions.",
     "show": 3
    },
    {
     "say": "On Zapier's free plan, a Zap may be limited to one action. That's all this project needs.",
     "show": 3
    }
   ]
  },
  {
   "kind": "flow",
   "art": "table",
   "kicker": "Build · Steps 4 to 6",
   "title": "Sheet in, email out",
   "steps": [
    "Sheet: name, email",
    "Trigger: New Spreadsheet Row",
    "Action: Gmail · Send Email"
   ],
   "beats": [
    {
     "say": "Create a Google Sheet with the headers name and email, and one sample row.",
     "show": 1
    },
    {
     "say": "In Zapier, create a Zap. The trigger is Google Sheets, New Spreadsheet Row, on your sheet.",
     "show": 2
    },
    {
     "say": "Then add an action: Gmail, Send Email, to your own address while testing.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quote",
   "art": "merge",
   "kicker": "Build · Step 7",
   "title": "Map data between steps",
   "quote": "New sign-up: {name} ({email})",
   "beats": [
    {
     "say": "Mapping passes data from the trigger into the action.",
     "show": 0
    },
    {
     "say": "Insert the name and email fields from the trigger into the email body.",
     "show": 1
    },
    {
     "say": "That's what makes each email carry the details of that specific row.",
     "show": 1
    }
   ]
  },
  {
   "kind": "big",
   "art": "stopwatch",
   "kicker": "Build · Step 8",
   "title": "Test, publish, then wait",
   "big": "Polling",
   "sub": "Zapier checks for new rows on a timer, so it's not instant",
   "beats": [
    {
     "say": "Use the built-in test, and check the email arrives. Then publish the Zap and add a real row.",
     "show": 0
    },
    {
     "say": "Google Sheets is a polling trigger. Zapier checks for new rows on a timer, which is slow on the free plan.",
     "show": 1
    },
    {
     "say": "So the email won't arrive instantly. Wait, then check the Zap's history if nothing arrives.",
     "show": 2
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "You add a row and no email arrives after one minute. What's the most likely reason?",
   "options": [
    "Google Sheets is a polling trigger, checked only every several minutes on the free plan",
    "The Zap needs a second action",
    "Gmail blocks automated emails"
   ],
   "answer": 0,
   "good": "That's right. Google Sheets is a polling trigger, and on the free plan Zapier checks for new rows only every several minutes.",
   "bad": "Not quite. Google Sheets is a polling trigger, and on the free plan Zapier checks for new rows only every several minutes.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "You add a row and no email arrives after one minute. What's the most likely reason?",
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
     "A live Zap emails on each new row",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 1.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a live Zap that emails a notification whenever a new spreadsheet row is added.",
     "show": 1
    },
    {
     "say": "Next, in Module 2, logic with filters and paths.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Project 2 (Module 2): Add Logic with Filters and Paths

**Time:** about 2 hours

**Goal:** Make an automation smart enough to decide, so it acts only when it should and differently in different cases.

**Why Make for this project:** In Zapier, Filters and Paths may need a paid plan or a trial (check the current plan). Make's free plan has included filters and routers (Make's version of Paths), so you build this project in Make. If you have a Zapier trial, you can rebuild it there afterwards to compare.

**Step 1: Create a free Make account.**
Go to make.com and sign up. In Make, an automation is called a **scenario**, and each step in it is a **module**. A scenario is to Make what a Zap is to Zapier.

**Step 2: Prepare a test sheet.**
Create a Google Sheet called "Requests" with the headers `title`, `status`, `priority`, `date` in row 1. Add a second sheet tab called "Log" with the headers `title`, `date`.

**Step 3: Add the trigger.**
Create a new scenario, click the big plus, choose Google Sheets, "Watch New Rows", connect your Google account, and pick the "Requests" sheet. Say the table has headers, and choose to start from "All" rows the first time so you have test data.

**Step 4: Understand filters.**
A filter stops data from continuing past a point unless a condition is met, such as only if the amount is over 100. Without filters, an automation acts on everything, including cases it should ignore. In Make, a filter sits on the line (the link) between two modules.

**Step 5: Understand routers (paths).**
A router splits a scenario into branches that each run different modules. Each branch can have its own filter, so one trigger can lead to different outcomes. This is the same idea Zapier calls Paths.

**Step 6: Build a two-branch router with filters.**
Add a Router after the trigger. On the first branch, click the link, set up a filter "status equal to new AND priority equal to high", and add a Slack "Create a Message" module that posts an urgent message to a channel (a free Slack workspace is fine; you can use Gmail "Send an Email" instead). On the second branch, add a filter "status equal to new AND priority equal to low", and add a Google Sheets "Add a Row" module that writes `title` and `date` to the "Log" tab. Rows whose status is not `new` stop at the filters.

**Step 7: Format data between steps.**
Data rarely arrives in the exact shape the next app needs. In Make you format data with built-in functions inside the mapping panel. In the Slack message, instead of mapping `date` directly, type `formatDate(parseDate(date; "YYYY-MM-DD"); "D MMMM YYYY")` using the function picker (pick `date` from the trigger output). A date like `2026-10-07` becomes `7 October 2026`.

**Step 8: Test each branch and document the logic.**
Add one high-priority and one low-priority row with status `new`, then click "Run once". Click the small bubble above each module to see what data passed through. Then write, in plain language, what each filter and branch does. Logic you understood while building is easy to forget later.

### Project Structure
```text
Make scenario: Request router
│
├── Google Sheets - Watch New Rows ("Requests")
└── Router
    ├── Branch A (filter: status = new AND priority = high)
    │     └── Slack - Create a Message (date formatted with formatDate)
    └── Branch B (filter: status = new AND priority = low)
          └── Google Sheets - Add a Row ("Log")
```

### What You Learned
- ✅ What filters, routers (paths), and formatting functions are
- ✅ Making an automation act only when it should
- ✅ Routing one trigger to different outcomes
- ✅ Cleaning and reshaping data between steps
- ✅ Testing and documenting branching logic

### Portfolio Project
**Conditional Automation**: Built an automation with filters, branching routes, and data formatting that routes work based on real conditions.
**Skills:** Make Filters, Routers, Formatting Functions, Automation Logic.

**Deliverable:** A branching automation that routes items differently based on their properties.

### Quiz

1. What does a filter do in an automation?
2. What is a router in Make, and what is the Zapier equivalent?
3. Why is this project built in Make instead of Zapier?
4. Why should you test each branch separately?

*Answers: 1) It lets data continue only when a condition is met, so the automation ignores items it should not act on. 2) A router splits a scenario into branches that run different modules; Zapier calls this Paths. 3) Zapier's free plan has not included Filters or Paths, while Make's free plan has included filters and routers. 4) A branch can work for one condition and silently fail for another, so each one needs its own test data.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "fork",
   "kicker": "Project 2 · Filters and paths",
   "title": "Make it decide",
   "beats": [
    {
     "say": "Welcome to Project 2."
    },
    {
     "say": "Now your automation gets smart enough to decide: to act only when it should, and differently in different cases."
    },
    {
     "say": "Zapier's Filters and Paths may need a paid plan, so you build this one in Make, whose free plan has included filters and routers."
    }
   ]
  },
  {
   "kind": "list",
   "art": "blocks",
   "kicker": "Concept",
   "title": "Make's vocabulary",
   "items": [
    [
     "Scenario",
     "Make's version of a Zap"
    ],
    [
     "Module",
     "One step"
    ],
    [
     "Filter",
     "Sits on the link between modules"
    ],
    [
     "Router",
     "Branches · Zapier's Paths"
    ]
   ],
   "beats": [
    {
     "say": "In Make, an automation is called a scenario. A scenario is to Make what a Zap is to Zapier.",
     "show": 1
    },
    {
     "say": "Each step in it is a module.",
     "show": 2
    },
    {
     "say": "A filter lets data continue only when a condition is met. It sits on the link between two modules.",
     "show": 3
    },
    {
     "say": "And a router splits a scenario into branches, each with its own filter. Zapier calls this Paths.",
     "show": 4
    }
   ]
  },
  {
   "kind": "flow",
   "art": "fork",
   "kicker": "Build · Steps 2 to 6",
   "title": "A two-branch router",
   "steps": [
    "Requests + Log sheets",
    "Watch New Rows",
    "A: new + high → Slack",
    "B: new + low → Log row"
   ],
   "beats": [
    {
     "say": "Make a Requests sheet with title, status, priority and date, plus a Log tab.",
     "show": 1
    },
    {
     "say": "Trigger the scenario with Google Sheets, Watch New Rows.",
     "show": 2
    },
    {
     "say": "Add a router. Branch A filters status new and priority high, and posts an urgent Slack message.",
     "show": 3
    },
    {
     "say": "Branch B filters status new and priority low, and adds a row to the Log tab. Rows that aren't new stop at the filters.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "calc",
   "kicker": "Build · Step 7",
   "title": "Format data between steps",
   "file": "Slack message · mapping",
   "code": "formatDate(parseDate(date; \"YYYY-MM-DD\"); \"D MMMM YYYY\")\n\n2026-10-07  →  7 October 2026",
   "beats": [
    {
     "say": "Data rarely arrives in the exact shape the next app needs.",
     "show": 0
    },
    {
     "say": "In the Slack message, instead of mapping date directly, use Make's format date and parse date functions.",
     "show": 1
    },
    {
     "say": "A date like twenty twenty six, ten, oh seven becomes seven October twenty twenty six.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "test",
   "kicker": "Build · Step 8",
   "title": "Test each branch, then write it down",
   "items": [
    [
     "Run once",
     "One high, one low test row"
    ],
    [
     "Output bubbles",
     "See the data at each module"
    ],
    [
     "Document",
     "What each branch does"
    ]
   ],
   "beats": [
    {
     "say": "Add one high priority and one low priority row, both with status new, and click Run once.",
     "show": 1
    },
    {
     "say": "Click the small bubble above each module to see what data passed through.",
     "show": 2
    },
    {
     "say": "Then write, in plain language, what each filter and branch does. Logic you understood while building is easy to forget.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What is a router in Make?",
   "options": [
    "A module that formats dates",
    "A filter on the link between two modules",
    "A split into branches that run different modules, which Zapier calls Paths"
   ],
   "answer": 2,
   "good": "That's right. A router splits a scenario into branches that run different modules. Zapier calls this Paths.",
   "bad": "Not quite. A router splits a scenario into branches that run different modules. Zapier calls this Paths.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What is a router in Make?",
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
     "A branching automation routes items by their properties",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 2.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a branching automation that routes items differently based on their properties.",
     "show": 1
    },
    {
     "say": "Next, in Module 3, a multi-step process in Make.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Project 3 (Module 3): Build a Multi-Step Process in Make

**Time:** about 2 hours

**Goal:** Build a longer automation in Make (formerly Integromat), with several chained steps and error handling, to see automation at a larger scale.

**Step 1: Free up an active scenario slot.**
Make's free plan limits how many scenarios can be active (scheduled) at once. Open the Scenarios list and switch off the Project 2 scenario if you are not using it. You can switch it back on later.

**Step 2: Understand scenarios at a larger scale.**
A scenario can have many modules in a chain. Each module runs once for every bundle (item) the previous module outputs, so three new form responses become three runs through the chain.

**Step 3: Understand modules and credits.**
A module is one step, such as watching for a new form response or creating a record. Make counts usage in credits (called operations before 2025): roughly one per module run. Fewer, smarter modules use less of your free monthly allowance.

**Step 4: Build a form-to-database scenario.**
Create a Google Form with Name and Email questions, then open its Responses tab and click "Link to Sheets" so responses go into a Google Sheet. In a new Make scenario, add Google Sheets "Watch New Rows" on that responses sheet, then a second Google Sheets "Add a Row" module that copies Name and Email into a clean "Contacts" sheet (or use Airtable "Create a Record" if you have a free Airtable base).

**Step 5: Understand the data flow between modules.**
Each module passes its output to the next through mapped fields. When you click into a field, the mapping panel shows the outputs of every earlier module. Seeing the data move down the chain makes complex logic easier to reason about.

**Step 6: Add a third step.**
Add Gmail "Send an Email" (or Slack "Create a Message") after the record is created, mapping the person's name into a confirmation message. Chaining three or more steps is where automation starts replacing whole manual processes.

**Step 7: Understand error handling.**
Error handling decides what happens when a step fails, so one failure does not silently break everything. Real automations hit failures when an app is down or data is missing.

**Step 8: Add an error handler and test.**
Right-click the "Add a Row" module and choose "Add error handler". Add a Google Sheets "Add a Row" module on that route that writes the error message and time to an "Errors" sheet, then finish the route with the "Ignore" directive (or "Resume" if you want the chain to continue). Submit the form, then click "Run once" and check every module's output bubble.

### Project Structure
```text
Make scenario: Form intake
│
├── Module 1: Google Sheets - Watch New Rows (form responses)
├── Module 2: Google Sheets - Add a Row ("Contacts")
│     └── Error handler -> Add a Row ("Errors") -> Ignore
└── Module 3: Gmail - Send an Email (confirmation)
```

### What You Learned
- ✅ How scenarios, modules, and bundles work in Make
- ✅ Building visual, multi-step automations
- ✅ Mapping data flow across several steps
- ✅ Capturing form data into a database
- ✅ Adding error handling for reliability

### Portfolio Project
**Multi-Step Make Scenario**: Built a visual, three-step automation with error handling that turns form submissions into records and confirmations.
**Skills:** Make (Integromat), Multi-Step Automation, Error Handling, Data Flow.

**Deliverable:** A working Make scenario that captures form data, stores it, confirms it, and handles failures.

### Quiz

1. What must you do in Google Forms before responses appear in a Google Sheet?
2. What does Make count against your free monthly allowance?
3. What does an error handler route do?
4. If the trigger outputs three new rows, how many times does the rest of the chain run?

*Answers: 1) Open the form's Responses tab and click Link to Sheets. 2) Credits, which were called operations before 2025; roughly one is used for each module run. 3) It decides what happens when a module fails, for example logging the error and then ignoring or resuming, instead of the scenario silently breaking. 4) Three times, once for each bundle.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "chain",
   "kicker": "Project 3 · Multi-step in Make",
   "title": "Chain several steps",
   "beats": [
    {
     "say": "Welcome to Project 3."
    },
    {
     "say": "You'll build a longer automation in Make, with several chained steps and error handling."
    },
    {
     "say": "First, free up a slot: Make's free plan limits how many scenarios can be active at once, so switch off the Project 2 scenario if you're not using it."
    }
   ]
  },
  {
   "kind": "list",
   "art": "boxes",
   "kicker": "Concept",
   "title": "Bundles and credits",
   "items": [
    [
     "Bundle",
     "3 new rows → 3 runs of the chain"
    ],
    [
     "Credits",
     "≈ 1 per module run"
    ]
   ],
   "beats": [
    {
     "say": "Each module runs once for every bundle, or item, the previous module outputs.",
     "show": 1
    },
    {
     "say": "So three new form responses become three runs through the chain.",
     "show": 1
    },
    {
     "say": "Make counts usage in credits, called operations before twenty twenty five. Roughly one per module run.",
     "show": 2
    },
    {
     "say": "Fewer, smarter modules use less of your free monthly allowance.",
     "show": 2
    }
   ]
  },
  {
   "kind": "flow",
   "art": "database",
   "kicker": "Build · Steps 4 to 6",
   "title": "Form to contacts to email",
   "steps": [
    "Form → Link to Sheets",
    "Watch New Rows",
    "Add a Row: Contacts",
    "Gmail: confirmation"
   ],
   "beats": [
    {
     "say": "Create a Google Form with Name and Email. On its Responses tab, click Link to Sheets.",
     "show": 1
    },
    {
     "say": "In Make, watch new rows on that responses sheet.",
     "show": 2
    },
    {
     "say": "Add a row that copies Name and Email into a clean Contacts sheet.",
     "show": 3
    },
    {
     "say": "Then send a confirmation with Gmail, mapping the person's name. When you click into a field, the mapping panel shows every earlier module's output.",
     "show": 4
    }
   ]
  },
  {
   "kind": "flow",
   "art": "shield",
   "kicker": "Build · Steps 7 and 8",
   "title": "Add an error handler",
   "steps": [
    "Right-click → Add error handler",
    "Log to \"Errors\" sheet",
    "Ignore (or Resume)"
   ],
   "beats": [
    {
     "say": "Real automations hit failures, when an app is down or data is missing. Error handling decides what happens then.",
     "show": 0
    },
    {
     "say": "Right-click the Add a Row module, and choose Add error handler.",
     "show": 1
    },
    {
     "say": "On that route, add a row to an Errors sheet, with the error message and time.",
     "show": 2
    },
    {
     "say": "Finish with the Ignore directive, or Resume if you want the chain to continue. Then submit the form, Run once, and check every bubble.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "If the trigger outputs three new rows, how many times does the rest of the chain run?",
   "options": [
    "Once, for all three together",
    "Three times, once for each bundle",
    "It depends on the error handler"
   ],
   "answer": 1,
   "good": "That's right. Each module runs once for every bundle, so the chain runs three times.",
   "bad": "Not quite. Each module runs once for every bundle, so the chain runs three times.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "If the trigger outputs three new rows, how many times does the rest of the chain run?",
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
     "Form data captured, stored, confirmed, errors handled",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 3.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a working Make scenario that captures form data, stores it, confirms it, and handles failures.",
     "show": 1
    },
    {
     "say": "Next, in Module 4, webhooks and A P Is.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Project 4 (Module 4): Automate with Webhooks and APIs

**Time:** about 2 hours

**Goal:** Connect to apps that do not have a ready-made integration, using webhooks and simple API calls.

**Why Make for this project:** Webhooks by Zapier may need a paid Zapier plan, while Make's Webhooks and HTTP modules have been available on its free plan (check the current plans), so you build this in Make.

**Step 1: Understand APIs.**
An API is a way for one app to talk to another over the internet using structured requests. Almost every modern app has one, which unlocks thousands of tools that have no drag-and-drop connector.

**Step 2: Understand webhooks.**
A webhook is a URL that an app calls to send data the instant something happens, rather than waiting to be asked. Unlike a polling trigger, it runs immediately.

**Step 3: Create a webhook trigger.**
In a new Make scenario, add Webhooks, "Custom webhook", click "Add", name it, and save. Copy the unique URL Make shows. This URL is the doorway other apps use to reach your automation, so treat it like a password.

**Step 4: Send test data to the webhook.**
With the webhook module waiting ("Make is listening..." or after clicking "Run once"), send a sample request. Use [Postman](https://www.postman.com) (free): create a POST request to your webhook URL, choose Body, raw, JSON, and paste the JSON below. Or use curl in a terminal, replacing the URL with yours:

```bash
curl -X POST "https://hook.eu1.make.com/REPLACE_WITH_YOUR_WEBHOOK_ID" \
  -H "Content-Type: application/json" \
  -d '{"name": "Ada Lovelace", "email": "ada@example.com", "plan": "pro"}'
```

Make should show "Successfully determined". Your automation now knows the shape of the incoming data.

**Step 5: Understand JSON.**
JSON is the common text format APIs use to send data, made of key and value pairs, like `"plan": "pro"`. Being able to read it is what lets you find and map the fields you need.

**Step 6: Map the incoming JSON fields.**
Add Google Sheets "Add a Row" after the webhook and map `name`, `email`, and `plan` into columns. Send the request again (with "Run once" active) and check the new row.

**Step 7: Understand API requests.**
An HTTP request module lets you call another app's API directly, sending data out, not just receiving it. This lets you push data into tools that have no connector.

**Step 8: Make an outbound API call and test.**
Add HTTP, "Make a request" after the sheet module. Set URL to `https://jsonplaceholder.typicode.com/posts`, method POST, body type Raw, content type JSON, and request content:

```json
{"title": "New sign-up", "body": "{{name}} chose {{plan}}", "userId": 1}
```

Replace `{{name}}` and `{{plan}}` by clicking the matching webhook fields in the mapping panel. Turn on "Parse response". JSONPlaceholder is a free fake API for practice: it replies with status 201 and an `id` (usually 101) but does not really save anything. Send the webhook request again and check the HTTP module's output.

### Project Structure
```text
Make scenario: Custom integration
│
├── Webhooks - Custom webhook (unique URL) -> receives JSON
├── Google Sheets - Add a Row (mapped JSON fields)
└── HTTP - Make a request -> POST to jsonplaceholder.typicode.com/posts
```

### What You Learned
- ✅ What APIs, webhooks, and JSON are
- ✅ Receiving live data through a webhook
- ✅ Testing with Postman or curl
- ✅ Making outbound API calls with the HTTP module
- ✅ Building two-way custom integrations

### Portfolio Project
**Custom API Automation**: Connected apps with no ready-made integration using webhooks, JSON, and direct API calls.
**Skills:** Webhooks, APIs, JSON, HTTP Requests, Make.

**Deliverable:** An automation that both receives data via webhook and pushes data out via an API call.

### Quiz

1. How is a webhook trigger different from a polling trigger?
2. Name two free ways to send a test request to your webhook URL.
3. Why should you keep your webhook URL private?
4. What does the JSONPlaceholder endpoint do with the data you POST to it?

*Answers: 1) A webhook receives data the moment the other app sends it, while a polling trigger checks for new data on a schedule. 2) Postman, or curl in a terminal. 3) Anyone who has the URL can send data into your automation. 4) It returns a realistic response (status 201 with an id) but does not actually save anything, so it is safe for practice.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "api",
   "kicker": "Project 4 · Webhooks and APIs",
   "title": "Connect apps with no connector",
   "beats": [
    {
     "say": "Welcome to Project 4."
    },
    {
     "say": "An A P I lets one app talk to another over the internet using structured requests. Almost every modern app has one."
    },
    {
     "say": "You'll build in Make, whose Webhooks and H T T P modules have been on its free plan."
    }
   ]
  },
  {
   "kind": "list",
   "art": "loop",
   "kicker": "Concept",
   "title": "Webhook versus polling",
   "items": [
    [
     "Webhook ✓",
     "Runs immediately when data is sent"
    ],
    [
     "Polling",
     "Checks on a schedule"
    ],
    [
     "Webhook URL",
     "Treat it like a password"
    ]
   ],
   "beats": [
    {
     "say": "A webhook is a U R L that an app calls to send data the instant something happens.",
     "show": 1
    },
    {
     "say": "A polling trigger, like Google Sheets, checks for new data on a schedule instead.",
     "show": 2
    },
    {
     "say": "In Make, add Webhooks, Custom webhook, and copy the unique U R L it shows.",
     "show": 3
    },
    {
     "say": "Treat that U R L like a password. Anyone who has it can send data into your automation.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "terminal",
   "kicker": "Build · Step 4",
   "title": "Send test data",
   "file": "terminal",
   "code": "curl -X POST \"https://hook.eu1.make.com/REPLACE_WITH_YOUR_WEBHOOK_ID\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"name\": \"Ada Lovelace\", \"email\": \"ada@example.com\", \"plan\": \"pro\"}'",
   "beats": [
    {
     "say": "With the webhook listening, send a sample request.",
     "show": 0
    },
    {
     "say": "Use Postman, or curl in a terminal, posting J S O N to your own webhook U R L.",
     "show": 1
    },
    {
     "say": "J S O N is made of key and value pairs, like plan, pro.",
     "show": 1
    },
    {
     "say": "Make should show Successfully determined. It now knows the shape of the incoming data.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "rocket",
   "kicker": "Build · Steps 6 to 8",
   "title": "Store it, then send it out",
   "file": "HTTP · request content",
   "code": "POST https://jsonplaceholder.typicode.com/posts\n\n{\"title\": \"New sign-up\", \"body\": \"{{name}} chose {{plan}}\", \"userId\": 1}",
   "beats": [
    {
     "say": "Add Google Sheets, Add a Row, and map name, email and plan into columns.",
     "show": 0
    },
    {
     "say": "Then add H T T P, Make a request, posting to JSON Placeholder, a free fake A P I for practice.",
     "show": 1
    },
    {
     "say": "Map name and plan from the webhook fields, and turn on Parse response.",
     "show": 1
    },
    {
     "say": "It replies with status two oh one and an I D, but doesn't really save anything.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "How is a webhook trigger different from a polling trigger?",
   "options": [
    "A webhook receives data the moment it's sent; polling checks on a schedule",
    "A webhook only works in Zapier",
    "Polling is faster than a webhook"
   ],
   "answer": 0,
   "good": "That's right. A webhook receives data the moment the other app sends it, while a polling trigger checks for new data on a schedule.",
   "bad": "Not quite. A webhook receives data the moment the other app sends it, while a polling trigger checks for new data on a schedule.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "How is a webhook trigger different from a polling trigger?",
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
     "Receives data via webhook",
     ""
    ],
    [
     "Pushes data out via an API call",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 4.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have an automation that receives data via webhook,",
     "show": 1
    },
    {
     "say": "and pushes data out via an A P I call.",
     "show": 2
    },
    {
     "say": "Next, in Module 5, a real business process end to end.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 5 (Module 5): Automate a Real Business Process End to End

**Time:** about 3 to 4 hours

**Goal:** Combine your skills into one automation that runs a complete, realistic business process. Build it in Make, because it needs several steps, branching, and logging, which Zapier's free plan may not allow.

**Step 1: Choose a real process.**
Pick one: new-lead handling, order fulfilment, content publishing, or onboarding. A recognisable business process makes your portfolio piece instantly understandable.

**Step 2: Map the process on paper first.**
Write each step of the process as a trigger, decisions, and actions before you build. A clear plan keeps a complex automation coherent.

**Step 3: Build the trigger and intake.**
Build the trigger (a linked Google Form sheet, a custom webhook, or a new record) and capture the incoming data cleanly in a main sheet. Add a `Status` column (starting as `Pending`) and a `Processed` column. If data enters wrong, every later step inherits the problem.

**Step 4: Add the decision logic.**
Add a router with filters that route each item based on its details, as in Project 2.

**Step 5: Add the core actions.**
Create records, send notifications, and update the systems the process touches. These actions are the actual work being automated.

**Step 6: Add a human-in-the-loop step.**
Make has no built-in approval button (and Zapier's free plan may not allow multi-step Zaps), so use a sheet as the approval point. Scenario A sends the approver a Slack message or email with a link to the sheet, asking them to change `Status` to `Approved` or `Rejected`. Scenario B runs on a schedule (for example every 15 minutes): Google Sheets "Search Rows" finds rows where `Status` is `Approved` (or `Rejected`) and `Processed` is empty, runs the follow-up actions, then "Update a Row" sets `Processed` to `yes` so the row is not handled twice. You will need two active scenarios, so switch off older ones.

**Step 7: Add logging and error handling.**
Add a module that logs each run (time, item, outcome) to a "Log" sheet, and add error handlers on modules that call outside apps. Logs let you prove the automation ran and diagnose issues.

**Step 8: Test the whole process with real cases.**
Run several realistic cases through the full automation, including edge cases such as a missing email, an unknown priority, and an item that gets rejected. End-to-end testing is the only way to trust a process before it handles live work.

### Project Structure
```text
Business process automation (Make)
│
├── Scenario A
│   ├── Intake (trigger + clean capture, Status = Pending)
│   ├── Decision logic (router + filters)
│   ├── Core actions (records, notifications)
│   ├── Ask approver to set Status in the sheet
│   └── Logging + error handlers
└── Scenario B (scheduled)
    ├── Search Rows: Status = Approved/Rejected, Processed empty
    ├── Follow-up actions
    └── Update a Row: Processed = yes
```

### What You Learned
- ✅ Mapping a real business process before building
- ✅ Building reliable intake and decision logic
- ✅ Combining actions into an end-to-end process
- ✅ Adding a free human-in-the-loop approval with a sheet
- ✅ Logging, error handling, and realistic testing

### Portfolio Project
**End-to-End Process Automation**: Automated a complete, realistic business process with intake, logic, actions, approvals, logging, and error handling.
**Skills:** Process Automation, Make, Google Sheets, Human-in-the-Loop, Reliability.

**Deliverable:** A pair of scenarios that run a full business process from intake to completion, tested on real cases.

### Quiz

1. Why do you map the process on paper before building?
2. How does the approver approve or reject an item in this build?
3. Why does Scenario B set a `Processed` column after handling a row?
4. Why include edge cases like a missing email in your tests?

*Answers: 1) A clear plan of trigger, decisions, and actions keeps a complex automation coherent and shows gaps before you build. 2) They change the Status column in the Google Sheet to Approved or Rejected, and the scheduled second scenario picks that up. 3) So the same row is not processed again on the next scheduled run. 4) Real data is messy, and edge cases show where the automation breaks before it handles live work.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "architecture",
   "kicker": "Project 5 · End to end",
   "title": "Automate a real business process",
   "beats": [
    {
     "say": "Welcome to Project 5."
    },
    {
     "say": "Now you combine your skills into one automation that runs a complete, realistic business process."
    },
    {
     "say": "You'll build it in Make, because it needs several steps, branching and logging."
    }
   ]
  },
  {
   "kind": "flow",
   "art": "blueprint",
   "kicker": "Build · Steps 1 and 2",
   "title": "Choose it, then map it on paper",
   "steps": [
    "Pick a real process",
    "Trigger",
    "Decisions",
    "Actions"
   ],
   "beats": [
    {
     "say": "Pick one real process: new lead handling, order fulfilment, content publishing, or onboarding.",
     "show": 1
    },
    {
     "say": "Then write each step on paper first, as a trigger, decisions and actions.",
     "show": 4
    },
    {
     "say": "A clear plan keeps a complex automation coherent.",
     "show": 4
    }
   ]
  },
  {
   "kind": "list",
   "art": "layers",
   "kicker": "Build · Steps 3 to 5",
   "title": "Intake, logic, actions",
   "items": [
    [
     "Intake",
     "Clean capture · Status = Pending"
    ],
    [
     "Decision logic",
     "Router + filters"
    ],
    [
     "Core actions",
     "Records, notifications"
    ]
   ],
   "beats": [
    {
     "say": "Build the trigger, and capture incoming data cleanly in a main sheet, with a Status column starting as Pending, and a Processed column.",
     "show": 1
    },
    {
     "say": "If data enters wrong, every later step inherits the problem.",
     "show": 1
    },
    {
     "say": "Add a router with filters to route each item, as in Project 2.",
     "show": 2
    },
    {
     "say": "Then the core actions: create records, send notifications, update systems. That's the actual work being automated.",
     "show": 3
    }
   ]
  },
  {
   "kind": "flow",
   "art": "people",
   "kicker": "Build · Step 6",
   "title": "A human in the loop, with a sheet",
   "steps": [
    "A: ask approver",
    "Approver sets Status",
    "B: Search Rows (scheduled)",
    "Follow-up · Processed = yes"
   ],
   "beats": [
    {
     "say": "Make has no built-in approval button, so a sheet is the approval point.",
     "show": 0
    },
    {
     "say": "Scenario A messages the approver, asking them to set Status to Approved or Rejected.",
     "show": 1
    },
    {
     "say": "Scenario B runs on a schedule, and searches for rows with that status where Processed is empty.",
     "show": 2
    },
    {
     "say": "It runs the follow-up actions, then sets Processed to yes, so the row isn't handled twice.",
     "show": 3
    },
    {
     "say": "That's two active scenarios, so switch off older ones.",
     "show": 3
    }
   ]
  },
  {
   "kind": "list",
   "art": "test",
   "kicker": "Build · Steps 7 and 8",
   "title": "Log it, then test real cases",
   "items": [
    [
     "Log sheet",
     "Time, item, outcome"
    ],
    [
     "Error handlers",
     "On outside-app modules"
    ],
    [
     "Edge cases",
     "Missing email, unknown priority, rejected"
    ]
   ],
   "beats": [
    {
     "say": "Log each run, with the time, item and outcome, to a Log sheet.",
     "show": 1
    },
    {
     "say": "Add error handlers on modules that call outside apps.",
     "show": 2
    },
    {
     "say": "Then run realistic cases, including edge cases: a missing email, an unknown priority, and an item that gets rejected.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why does Scenario B set the Processed column after handling a row?",
   "options": [
    "To trigger Scenario A again",
    "To notify the approver",
    "So the same row isn't processed again on the next scheduled run"
   ],
   "answer": 2,
   "good": "That's right. Scenario B runs on a schedule, so marking a row as processed stops it being handled twice.",
   "bad": "Not quite. Scenario B runs on a schedule, so marking a row as processed stops it being handled twice.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why does Scenario B set the Processed column after handling a row?",
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
     "Two scenarios run the full process",
     ""
    ],
    [
     "Tested on real cases",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 5.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a pair of scenarios that run a full business process from intake to completion,",
     "show": 1
    },
    {
     "say": "tested on real cases.",
     "show": 2
    },
    {
     "say": "Next, in Module 6, monitoring, maintenance and handoff.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 6 (Module 6): Monitor, Maintain, and Hand Off

**Time:** about 2 hours

**Goal:** Make your automations reliable over time and document them so others can trust and maintain them.

**Step 1: Understand monitoring.**
Monitoring is watching whether your automations run successfully, using the tool's history or logs. An automation you never check can fail for weeks unnoticed.

**Step 2: Review run history.**
Open the History tab of your Make scenario and the Zap history in Zapier, and read through recent runs. Run history tells you exactly what happened on each execution, including the data each step received, which is your main tool for diagnosing issues.

**Step 3: Add failure alerts.**
Check your notification settings so both tools email you when a run errors (both do this by default at the time of writing). For faster alerts, add an error handler route in Make that sends a Slack message or email with the error details.

**Step 4: Understand rate limits and quotas.**
A rate limit caps how many times you can call an app in a period. A quota caps your monthly usage: Zapier counts tasks, and Make counts credits (called operations before 2025). Free plans have small quotas, so check the current numbers on each plan page and design within them.

**Step 5: Optimise for efficiency.**
Put filters early so unneeded items stop before expensive steps, remove unnecessary modules, and schedule polling scenarios no more often than needed. Efficient automations use fewer tasks or credits and run faster, which matters when a client pays for usage.

**Step 6: Understand handoff documentation.**
Handoff documentation explains what an automation does, how it is built, and how to fix common issues. Without it, an automation is a black box only you can maintain.

**Step 7: Write a handoff document.**
Create a doc covering the process, each Zap or scenario, the triggers, the logic, which accounts are connected, and a troubleshooting section. This document is often the actual deliverable a client keeps.

**Step 8: Do a walkthrough.**
Record or write a short walkthrough of the automation for the person who will own it. A walkthrough transfers understanding, not just files.

### Project Structure
```text
Reliability + handoff
│
├── Monitoring via run history
├── Failure alerts (email / Slack)
├── Designed within rate limits and quotas
├── Optimised step count
├── handoff_document.md (process, builds, troubleshooting)
└── Walkthrough for the owner
```

### What You Learned
- ✅ Monitoring automations and reading run history
- ✅ Setting up failure alerts
- ✅ Designing within rate limits and quotas
- ✅ Optimising automations for cost and speed
- ✅ Documenting and handing off automations

### Portfolio Project
**Reliable, Documented Automation Suite**: Made automations reliable with monitoring and alerts, then documented and handed them off professionally.
**Skills:** Monitoring, Alerting, Optimization, Technical Writing, Handoff.

**Deliverable:** A monitored, alert-enabled automation with a complete handoff document and walkthrough.

### Quiz

1. Where do you look first to diagnose why an automation failed?
2. What do Zapier and Make each count against your monthly quota?
3. Why place filters early in a scenario?
4. What should a handoff document include?

*Answers: 1) The run history (Make's History tab or Zapier's Zap history), which shows what happened and what data each step received. 2) Zapier counts tasks; Make counts credits, which were called operations before 2025. 3) Items that do not qualify stop before later steps, saving tasks or credits. 4) What the process does, each Zap or scenario with its triggers and logic, the connected accounts, and how to fix common issues.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "graph",
   "kicker": "Project 6 · Monitor and hand off",
   "title": "Keep it running, then pass it on",
   "beats": [
    {
     "say": "Welcome to the last project."
    },
    {
     "say": "You'll make your automations reliable over time, and document them so others can trust and maintain them."
    },
    {
     "say": "An automation you never check can fail for weeks unnoticed."
    }
   ]
  },
  {
   "kind": "list",
   "art": "search",
   "kicker": "Build · Steps 1 to 3",
   "title": "Monitoring and alerts",
   "items": [
    [
     "Run history",
     "What happened, step by step"
    ],
    [
     "Email on error",
     "Check notification settings"
    ],
    [
     "Error handler alert",
     "Slack or email"
    ]
   ],
   "beats": [
    {
     "say": "Open the History tab of your Make scenario, and the Zap history in Zapier.",
     "show": 1
    },
    {
     "say": "Run history shows what happened on each run, including the data each step received. It's your main tool for diagnosing issues.",
     "show": 1
    },
    {
     "say": "Check your notification settings, so both tools email you when a run errors.",
     "show": 2
    },
    {
     "say": "For faster alerts, add an error handler route in Make that sends a Slack message or email.",
     "show": 3
    }
   ]
  },
  {
   "kind": "list",
   "art": "bars",
   "kicker": "Build · Steps 4 and 5",
   "title": "Design within quotas",
   "items": [
    [
     "Rate limit",
     "Calls per period"
    ],
    [
     "Quota",
     "Zapier tasks · Make credits"
    ],
    [
     "Filters early",
     "Stop items before costly steps"
    ],
    [
     "Trim + schedule",
     "Fewer modules, less polling"
    ]
   ],
   "beats": [
    {
     "say": "A rate limit caps how many times you can call an app in a period.",
     "show": 1
    },
    {
     "say": "A quota caps monthly usage. Zapier counts tasks, and Make counts credits.",
     "show": 2
    },
    {
     "say": "To save them, put filters early, so unneeded items stop before expensive steps.",
     "show": 3
    },
    {
     "say": "Remove unnecessary modules, and schedule polling no more often than needed.",
     "show": 4
    }
   ]
  },
  {
   "kind": "flow",
   "art": "doc",
   "kicker": "Build · Steps 6 to 8",
   "title": "Hand it off",
   "steps": [
    "Handoff document",
    "Troubleshooting section",
    "Walkthrough for the owner"
   ],
   "beats": [
    {
     "say": "Without documentation, an automation is a black box only you can maintain.",
     "show": 0
    },
    {
     "say": "Write a handoff document: the process, each Zap or scenario, triggers, logic, connected accounts, and troubleshooting.",
     "show": 1
    },
    {
     "say": "It's often the actual deliverable a client keeps.",
     "show": 2
    },
    {
     "say": "Then record or write a short walkthrough for the owner. It transfers understanding, not just files.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why place filters early in a scenario?",
   "options": [
    "Filters only work at the start",
    "Items that don't qualify stop before later steps, saving tasks or credits",
    "It makes the run history easier to read"
   ],
   "answer": 1,
   "good": "That's right. Items that don't qualify stop before the later steps, which saves tasks or credits.",
   "bad": "Not quite. Items that don't qualify stop before the later steps, which saves tasks or credits.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why place filters early in a scenario?",
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
     "Monitored, with failure alerts",
     ""
    ],
    [
     "Handoff document and walkthrough",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's the final project.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a monitored, alert-enabled automation,",
     "show": 1
    },
    {
     "say": "with a complete handoff document and walkthrough.",
     "show": 2
    },
    {
     "say": "You've finished Workflow Automation with Zapier and Make. Well done.",
     "show": 2
    }
   ]
  }
 ]
}
```
