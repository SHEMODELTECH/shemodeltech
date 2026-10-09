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
   "art": "bolt",
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
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Trigger, action, Zap",
   "nodes": [
    {
     "id": "sheet",
     "label": "Google Sheets",
     "x": 12,
     "y": 50,
     "sub": "trigger: new row",
     "art": "table"
    },
    {
     "id": "zap",
     "label": "Zap",
     "x": 50,
     "y": 50,
     "sub": "trigger + action",
     "art": "bolt"
    },
    {
     "id": "gmail",
     "label": "Gmail",
     "x": 88,
     "y": 50,
     "sub": "action: send email",
     "art": "mail"
    }
   ],
   "edges": [
    {
     "from": "sheet",
     "to": "zap"
    },
    {
     "from": "zap",
     "to": "gmail"
    }
   ],
   "beats": [
    {
     "say": "Every automation begins with a trigger: the event that starts it, like a new row added to a spreadsheet.",
     "show": 1,
     "on": "sheet"
    },
    {
     "say": "An action is the work it does when the trigger fires, like sending an email.",
     "show": 3,
     "on": "gmail"
    },
    {
     "say": "A Zap is one automated workflow in Zapier: a trigger plus one or more actions.",
     "show": 3,
     "on": "zap"
    },
    {
     "say": "So when a new row appears, the trigger fires.",
     "show": 3,
     "on": "sheet",
     "send": {
      "from": "sheet",
      "to": "zap",
      "label": "new row"
     }
    },
    {
     "say": "And the Zap runs the action: send an email.",
     "show": 3,
     "on": "gmail",
     "send": {
      "from": "zap",
      "to": "gmail",
      "label": "Send Email"
     }
    },
    {
     "say": "On Zapier's free plan, a Zap may be limited to one action. That's all this project needs.",
     "show": 3,
     "on": [
      "sheet",
      "zap",
      "gmail"
     ]
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Build · Steps 4 to 6",
   "title": "Set up the Zap, one choice at a time",
   "values": [
    "Sheet: name, email",
    "Trigger app: Sheets",
    "New Spreadsheet Row",
    "Pick sheet + tab",
    "Action: Gmail",
    "Send Email to you"
   ],
   "beats": [
    {
     "say": "First, a Google Sheet with the headers name and email in row one, and one sample row.",
     "hl": 0
    },
    {
     "say": "In Zapier, create a Zap, and choose Google Sheets as the trigger app.",
     "ok": [
      0
     ],
     "hl": 1
    },
    {
     "say": "The event is New Spreadsheet Row.",
     "ok": [
      0,
      1
     ],
     "hl": 2
    },
    {
     "say": "Connect your Google account, then pick your sheet and worksheet.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3
    },
    {
     "say": "Now the action step: the Gmail app.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "hl": 4
    },
    {
     "say": "Its event is Send Email, with a recipient, subject and body. While testing, send it to your own address.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "hl": 5
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Build · Step 7",
   "title": "Mapping fills in each row's details",
   "columns": [
    "row",
    "name",
    "email"
   ],
   "rows": [
    [
     "2",
     "Ada Lovelace",
     "ada@example.com"
    ],
    [
     "3",
     "Grace Hopper",
     "grace@example.com"
    ]
   ],
   "beats": [
    {
     "say": "Here's the sheet, with two rows of sign-ups, for example."
    },
    {
     "say": "In the email body, you don't type a name. You insert the name and email fields from the trigger.",
     "sql": "Body: New sign-up: {name} ({email})",
     "col": 1
    },
    {
     "say": "When row two triggers the Zap, those fields fill in with Ada's details.",
     "hl": 0,
     "dim": true,
     "sql": "New sign-up: Ada Lovelace (ada@example.com)"
    },
    {
     "say": "When row three arrives, the same Zap sends Grace's details instead.",
     "hl": 1,
     "dim": true,
     "sql": "New sign-up: Grace Hopper (grace@example.com)"
    },
    {
     "say": "That's mapping: one template, and each run carries that row's specific data.",
     "hl": [
      0,
      1
     ],
     "sql": "Body: New sign-up: {name} ({email})"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Build · Step 8",
   "title": "Polling: Zapier asks on a timer",
   "nodes": [
    {
     "id": "sheet",
     "label": "Google Sheets",
     "x": 12,
     "y": 50,
     "sub": "you add a row",
     "art": "table"
    },
    {
     "id": "zap",
     "label": "Zapier",
     "x": 50,
     "y": 50,
     "sub": "checks on a timer",
     "art": "stopwatch"
    },
    {
     "id": "gmail",
     "label": "Gmail",
     "x": 88,
     "y": 50,
     "sub": "your inbox",
     "art": "mail"
    }
   ],
   "edges": [
    {
     "from": "sheet",
     "to": "zap"
    },
    {
     "from": "zap",
     "to": "gmail"
    }
   ],
   "beats": [
    {
     "say": "Use the built-in test first, and check the test email arrives. Then publish the Zap.",
     "on": "zap"
    },
    {
     "say": "Now add a real row. Nothing happens yet, because the sheet doesn't tell Zapier.",
     "on": "sheet"
    },
    {
     "say": "Google Sheets is a polling trigger. Zapier asks for new rows on a timer, and on the free plan that timer is slow.",
     "on": "zap",
     "send": {
      "from": "zap",
      "to": "sheet",
      "label": "any new rows?"
     }
    },
    {
     "say": "On the next check, it finds your row.",
     "on": "sheet",
     "send": {
      "from": "sheet",
      "to": "zap",
      "label": "1 new row"
     }
    },
    {
     "say": "Only then does the email go out. So wait, and if nothing arrives, check the Zap's history.",
     "on": "gmail",
     "send": {
      "from": "zap",
      "to": "gmail",
      "label": "Send Email"
     }
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
   "art": "funnel",
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
   "kind": "table",
   "kicker": "Concept",
   "title": "Same ideas, Make's words",
   "columns": [
    "Zapier",
    "Make",
    "Means"
   ],
   "rows": [
    [
     "Zap",
     "Scenario",
     "One automation"
    ],
    [
     "Step",
     "Module",
     "One step in it"
    ],
    [
     "Filter",
     "Filter on a link",
     "Continue only if..."
    ],
    [
     "Paths",
     "Router",
     "Split into branches"
    ]
   ],
   "beats": [
    {
     "say": "Make uses different words for the same ideas.",
     "col": 1
    },
    {
     "say": "An automation is a scenario. A scenario is to Make what a Zap is to Zapier.",
     "hl": 0
    },
    {
     "say": "Each step in it is a module.",
     "hl": 1
    },
    {
     "say": "A filter lets data continue only when a condition is met. In Make, it sits on the link between two modules.",
     "hl": 2
    },
    {
     "say": "And a router splits a scenario into branches, each with its own filter. Zapier calls this Paths.",
     "hl": 3
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Build · Steps 2 and 6",
   "title": "Which rows pass which filter?",
   "columns": [
    "title",
    "status",
    "priority",
    "date"
   ],
   "rows": [
    [
     "Fix login bug",
     "new",
     "high",
     "2026-10-07"
    ],
    [
     "Update FAQ",
     "new",
     "low",
     "2026-10-08"
    ],
    [
     "Old report",
     "done",
     "high",
     "2026-10-01"
    ],
    [
     "Team lunch",
     "new",
     "medium",
     "2026-10-09"
    ]
   ],
   "beats": [
    {
     "say": "Here's the Requests sheet, with title, status, priority and date, and four example rows."
    },
    {
     "say": "Branch A's filter needs status new, and priority high.",
     "sql": "Branch A: status = new AND priority = high",
     "col": 2
    },
    {
     "say": "Only Fix login bug passes. That one becomes an urgent Slack message.",
     "hl": 0,
     "dim": true,
     "sql": "Branch A: status = new AND priority = high"
    },
    {
     "say": "Branch B's filter needs status new, and priority low. Only Update FAQ passes, and gets logged.",
     "hl": 1,
     "dim": true,
     "sql": "Branch B: status = new AND priority = low"
    },
    {
     "say": "Old report is high priority, but its status is done. AND means both must be true, so it stops.",
     "hl": 2,
     "dim": true,
     "col": 1,
     "sql": "status = done → fails both filters"
    },
    {
     "say": "And Team lunch is new, but medium matches neither filter, so it stops too.",
     "hl": 3,
     "dim": true,
     "col": 2,
     "sql": "priority = medium → fails both filters"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Build · Steps 3 to 6",
   "title": "The router sends each bundle its own way",
   "nodes": [
    {
     "id": "trig",
     "label": "Watch New Rows",
     "x": 10,
     "y": 50,
     "sub": "Requests sheet",
     "art": "table"
    },
    {
     "id": "router",
     "label": "Router",
     "x": 40,
     "y": 50,
     "sub": "two filtered branches",
     "art": "fork"
    },
    {
     "id": "slack",
     "label": "Slack message",
     "x": 86,
     "y": 18,
     "sub": "Branch A · urgent",
     "art": "chat"
    },
    {
     "id": "log",
     "label": "Add a Row",
     "x": 86,
     "y": 82,
     "sub": "Branch B · Log tab",
     "art": "table"
    },
    {
     "id": "stop",
     "label": "Stopped",
     "x": 70,
     "y": 50,
     "sub": "fails the filters",
     "art": "cross"
    }
   ],
   "edges": [
    {
     "from": "trig",
     "to": "router"
    },
    {
     "from": "router",
     "to": "slack"
    },
    {
     "from": "router",
     "to": "log"
    },
    {
     "from": "router",
     "to": "stop"
    }
   ],
   "beats": [
    {
     "say": "The trigger is Google Sheets, Watch New Rows, on the Requests sheet. Then a router.",
     "show": 2,
     "on": [
      "trig",
      "router"
     ]
    },
    {
     "say": "The first row comes in as a bundle: Fix login bug.",
     "show": 4,
     "on": "trig",
     "send": {
      "from": "trig",
      "to": "router",
      "label": "Fix login bug"
     }
    },
    {
     "say": "It passes Branch A's filter, so Slack posts an urgent message to your channel.",
     "show": 4,
     "on": "slack",
     "send": {
      "from": "router",
      "to": "slack",
      "label": "new · high"
     }
    },
    {
     "say": "Next, Update FAQ.",
     "show": 4,
     "on": "trig",
     "send": {
      "from": "trig",
      "to": "router",
      "label": "Update FAQ"
     }
    },
    {
     "say": "It passes Branch B's filter, so it's written to the Log tab, with its title and date.",
     "show": 4,
     "on": "log",
     "send": {
      "from": "router",
      "to": "log",
      "label": "new · low"
     }
    },
    {
     "say": "Rows whose status isn't new, like Old report, pass neither filter. Nothing runs for them.",
     "show": 5,
     "on": "stop",
     "send": {
      "from": "router",
      "to": "stop",
      "label": "status: done"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Build · Step 7",
   "title": "Reshape a date before Slack sees it",
   "file": "Slack message · mapping",
   "code": "formatDate(\n  parseDate(date; \"YYYY-MM-DD\");\n  \"D MMMM YYYY\"\n)",
   "beats": [
    {
     "say": "Data rarely arrives in the exact shape the next app needs. Instead of mapping date directly, use functions."
    },
    {
     "say": "From the trigger, date is the text twenty twenty six, ten, oh seven.",
     "line": 2,
     "vars": {
      "date": "\"2026-10-07\""
     }
    },
    {
     "say": "Parse date reads that text using the pattern year, month, day, and turns it into a real date.",
     "line": 2,
     "vars": {
      "date": "\"2026-10-07\"",
      "parsed": "7 Oct 2026 (a date)"
     }
    },
    {
     "say": "Format date writes it back out: D is the day, M M M M is the full month name, and Y Y Y Y the year.",
     "line": 3,
     "vars": {
      "date": "\"2026-10-07\"",
      "parsed": "7 Oct 2026 (a date)"
     }
    },
    {
     "say": "So the Slack message reads: seven October twenty twenty six.",
     "line": [
      1,
      4
     ],
     "out": "7 October 2026"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Build · Step 8",
   "title": "Test each branch on purpose",
   "columns": [
    "Test row",
    "Branch A",
    "Branch B"
   ],
   "rows": [
    [
     "new · high",
     "Slack message ✓",
     "stopped"
    ],
    [
     "new · low",
     "stopped",
     "Log row ✓"
    ]
   ],
   "beats": [
    {
     "say": "Add one high priority row and one low priority row, both with status new, then click Run once."
    },
    {
     "say": "The high row should post to Slack, and stop at Branch B.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "The low row should stop at Branch A, and land in the Log tab.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "Click the small bubble above each module to see exactly what data passed through.",
     "col": 1
    },
    {
     "say": "Then write, in plain language, what each filter and branch does. Logic you understood while building is easy to forget.",
     "hl": [
      0,
      1
     ]
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
   "kind": "diagram",
   "kicker": "Build · Steps 4 to 6",
   "title": "One bundle travels down the chain",
   "nodes": [
    {
     "id": "form",
     "label": "Google Form",
     "x": 10,
     "y": 30,
     "sub": "Name, Email",
     "art": "form"
    },
    {
     "id": "resp",
     "label": "Responses sheet",
     "x": 36,
     "y": 70,
     "sub": "Watch New Rows",
     "art": "table"
    },
    {
     "id": "contacts",
     "label": "Contacts sheet",
     "x": 64,
     "y": 30,
     "sub": "Add a Row",
     "art": "database"
    },
    {
     "id": "gmail",
     "label": "Gmail",
     "x": 90,
     "y": 70,
     "sub": "Send an Email",
     "art": "mail"
    }
   ],
   "edges": [
    {
     "from": "form",
     "to": "resp"
    },
    {
     "from": "resp",
     "to": "contacts"
    },
    {
     "from": "contacts",
     "to": "gmail"
    }
   ],
   "beats": [
    {
     "say": "Create a Google Form with Name and Email. On its Responses tab, click Link to Sheets.",
     "show": 2,
     "on": [
      "form",
      "resp"
     ]
    },
    {
     "say": "Now Ada Lovelace submits the form, and her answers land in the responses sheet.",
     "show": 2,
     "on": "resp",
     "send": {
      "from": "form",
      "to": "resp",
      "label": "Ada's response"
     }
    },
    {
     "say": "Module one, Watch New Rows, picks up that row as a bundle.",
     "show": 2,
     "on": "resp"
    },
    {
     "say": "Module two, Add a Row, copies Name and Email into a clean Contacts sheet.",
     "show": 3,
     "on": "contacts",
     "send": {
      "from": "resp",
      "to": "contacts",
      "label": "Name, Email"
     }
    },
    {
     "say": "Module three, Gmail, sends Ada a confirmation, with her name mapped in.",
     "show": 4,
     "on": "gmail",
     "send": {
      "from": "contacts",
      "to": "gmail",
      "label": "Hi Ada"
     }
    },
    {
     "say": "Chaining three or more steps is where automation starts replacing whole manual processes.",
     "show": 4,
     "on": [
      "resp",
      "contacts",
      "gmail"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Build · Step 5",
   "title": "The mapping panel shows every earlier output",
   "columns": [
    "Module",
    "Field",
    "Mapped from"
   ],
   "rows": [
    [
     "2 · Add a Row",
     "Name",
     "Name (module 1)"
    ],
    [
     "2 · Add a Row",
     "Email",
     "Email (module 1)"
    ],
    [
     "3 · Send an Email",
     "To",
     "Email (module 1)"
    ],
    [
     "3 · Send an Email",
     "Content",
     "Hi {Name} (module 1)"
    ]
   ],
   "beats": [
    {
     "say": "Each module passes its output to the next through mapped fields."
    },
    {
     "say": "When you click into a field in Add a Row, the mapping panel shows what module one output. Pick Name and Email.",
     "hl": [
      0,
      1
     ],
     "col": 2
    },
    {
     "say": "In the email, the panel shows the outputs of every earlier module, so you can still reach module one's fields.",
     "hl": [
      2,
      3
     ],
     "col": 2
    },
    {
     "say": "Map the email address, and the person's name into the confirmation message.",
     "hl": 3,
     "dim": true
    },
    {
     "say": "Seeing data move down the chain like this makes complex logic easier to reason about.",
     "col": 0
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Concept · Bundles and credits",
   "title": "Three responses, three runs of the chain",
   "values": [
    "Watch: 3 rows",
    "Ada · Add",
    "Ada · Email",
    "Grace · Add",
    "Grace · Email",
    "Katherine · Add",
    "Katherine · Email"
   ],
   "beats": [
    {
     "say": "Say three people submit the form before the next run, for example Ada, Grace and Katherine."
    },
    {
     "say": "The trigger checks once, and outputs three bundles.",
     "hl": 0,
     "note": "1 check → 3 bundles"
    },
    {
     "say": "Each later module runs once for every bundle. First, Ada's bundle goes down the chain.",
     "ok": [
      0
     ],
     "hl": [
      1,
      2
     ],
     "note": "bundle 1"
    },
    {
     "say": "Then Grace's.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": [
      3,
      4
     ],
     "note": "bundle 2"
    },
    {
     "say": "Then Katherine's. Three bundles, three runs through the chain.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "hl": [
      5,
      6
     ],
     "note": "bundle 3"
    },
    {
     "say": "Make counts usage in credits, called operations before twenty twenty five: roughly one per module run. Here, about seven.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
     ],
     "note": "≈ 1 + 3 + 3 = 7 credits"
    },
    {
     "say": "So fewer, smarter modules use less of your free monthly allowance.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
     ],
     "note": "every extra module × every bundle"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Build · Steps 7 and 8",
   "title": "When a step fails, the error route takes over",
   "nodes": [
    {
     "id": "resp",
     "label": "Watch New Rows",
     "x": 10,
     "y": 45,
     "sub": "module 1",
     "art": "table"
    },
    {
     "id": "add",
     "label": "Add a Row",
     "x": 38,
     "y": 45,
     "sub": "Contacts · module 2",
     "art": "database"
    },
    {
     "id": "gmail",
     "label": "Send an Email",
     "x": 86,
     "y": 18,
     "sub": "module 3",
     "art": "mail"
    },
    {
     "id": "errs",
     "label": "Errors sheet",
     "x": 58,
     "y": 85,
     "sub": "Add a Row",
     "art": "warning"
    },
    {
     "id": "ignore",
     "label": "Ignore",
     "x": 88,
     "y": 70,
     "sub": "end this route",
     "art": "shield"
    }
   ],
   "edges": [
    {
     "from": "resp",
     "to": "add"
    },
    {
     "from": "add",
     "to": "gmail"
    },
    {
     "from": "add",
     "to": "errs"
    },
    {
     "from": "errs",
     "to": "ignore"
    }
   ],
   "beats": [
    {
     "say": "Real automations hit failures, when an app is down or data is missing. Error handling decides what happens then.",
     "show": 3
    },
    {
     "say": "Right-click the Add a Row module, and choose Add error handler. A new route appears.",
     "show": 4,
     "on": "add"
    },
    {
     "say": "On a good run, the bundle goes straight on to the email.",
     "show": 5,
     "on": "gmail",
     "send": {
      "from": "add",
      "to": "gmail",
      "label": "row added"
     }
    },
    {
     "say": "But say Add a Row fails. The bundle takes the error route instead.",
     "show": 5,
     "on": "add",
     "send": {
      "from": "resp",
      "to": "add",
      "label": "Grace's bundle"
     }
    },
    {
     "say": "The handler writes the error message and the time to an Errors sheet.",
     "show": 5,
     "on": "errs",
     "send": {
      "from": "add",
      "to": "errs",
      "label": "error + time"
     }
    },
    {
     "say": "Then the Ignore directive ends that route quietly, so the scenario doesn't stop. Pick Resume if you want the chain to continue.",
     "show": 5,
     "on": "ignore",
     "send": {
      "from": "errs",
      "to": "ignore",
      "label": "ignore"
     }
    },
    {
     "say": "To test, submit the form, click Run once, and check every module's output bubble.",
     "show": 5,
     "on": [
      "resp",
      "add",
      "gmail"
     ]
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
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Polling asks. A webhook is told.",
   "nodes": [
    {
     "id": "sheet",
     "label": "Google Sheets",
     "x": 12,
     "y": 25,
     "sub": "has new data",
     "art": "table"
    },
    {
     "id": "poll",
     "label": "Polling trigger",
     "x": 52,
     "y": 25,
     "sub": "checks on a timer",
     "art": "stopwatch"
    },
    {
     "id": "app",
     "label": "Another app",
     "x": 12,
     "y": 75,
     "sub": "something happens",
     "art": "globe"
    },
    {
     "id": "hook",
     "label": "Custom webhook",
     "x": 52,
     "y": 75,
     "sub": "a unique URL in Make",
     "art": "plug"
    }
   ],
   "edges": [
    {
     "from": "poll",
     "to": "sheet"
    },
    {
     "from": "app",
     "to": "hook"
    }
   ],
   "beats": [
    {
     "say": "You've met polling: the automation asks for new data on a schedule.",
     "show": 2,
     "on": "poll",
     "send": {
      "from": "poll",
      "to": "sheet",
      "label": "anything new?"
     }
    },
    {
     "say": "If the answer is not yet, it waits until the next check.",
     "show": 2,
     "on": "sheet",
     "send": {
      "from": "sheet",
      "to": "poll",
      "label": "not yet"
     }
    },
    {
     "say": "A webhook flips that around. It's a U R L that an app calls the instant something happens.",
     "show": 4,
     "on": "app",
     "send": {
      "from": "app",
      "to": "hook",
      "label": "data, right now"
     }
    },
    {
     "say": "So the scenario runs immediately, with no waiting.",
     "show": 4,
     "on": "hook"
    },
    {
     "say": "In Make, add Webhooks, Custom webhook, and copy the unique U R L. Anyone who has it can send data in, so treat it like a password.",
     "show": 4,
     "on": "hook"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Build · Step 4",
   "title": "Send test data to the webhook",
   "file": "terminal",
   "code": "curl -X POST \"https://hook.eu1.make.com/…\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"name\": \"Ada Lovelace\",\n       \"email\": \"ada@example.com\",\n       \"plan\": \"pro\"}'",
   "beats": [
    {
     "say": "With the webhook waiting, send a sample request. Postman works, or curl in a terminal."
    },
    {
     "say": "This is a POST request to your webhook U R L. Replace the address with your own.",
     "line": 1
    },
    {
     "say": "This header says the body is J S O N.",
     "line": 2
    },
    {
     "say": "J S O N is made of key and value pairs. The name key holds Ada Lovelace,",
     "line": 3,
     "vars": {
      "name": "\"Ada Lovelace\""
     }
    },
    {
     "say": "email holds ada at example dot com,",
     "line": 4,
     "vars": {
      "name": "\"Ada Lovelace\"",
      "email": "\"ada@example.com\""
     }
    },
    {
     "say": "and plan holds pro.",
     "line": 5,
     "vars": {
      "name": "\"Ada Lovelace\"",
      "email": "\"ada@example.com\"",
      "plan": "\"pro\""
     }
    },
    {
     "say": "Make should show Successfully determined. It now knows the shape of the incoming data.",
     "line": [
      1,
      5
     ],
     "out": "Make: Successfully determined"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Build · Steps 5 and 6",
   "title": "Map each JSON key into a column",
   "columns": [
    "JSON key",
    "Value",
    "Sheet column"
   ],
   "rows": [
    [
     "name",
     "Ada Lovelace",
     "name"
    ],
    [
     "email",
     "ada@example.com",
     "email"
    ],
    [
     "plan",
     "pro",
     "plan"
    ]
   ],
   "beats": [
    {
     "say": "Being able to read J S O N is what lets you find and map the fields you need."
    },
    {
     "say": "Add Google Sheets, Add a Row, after the webhook. The webhook's keys now appear in the mapping panel.",
     "col": 0
    },
    {
     "say": "Map name into the name column.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "Email into email.",
     "hl": 1,
     "col": 2
    },
    {
     "say": "And plan into plan.",
     "hl": 2,
     "col": 2
    },
    {
     "say": "Send the request again with Run once active, and Ada's row appears in the sheet.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 1
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Build · Steps 7 and 8",
   "title": "Send data out with an HTTP request",
   "file": "HTTP · Make a request",
   "code": "POST https://jsonplaceholder.typicode.com/posts\n\n{\"title\": \"New sign-up\",\n \"body\": \"{{name}} chose {{plan}}\",\n \"userId\": 1}",
   "beats": [
    {
     "say": "Receiving is half the job. An H T T P module lets you call another app's A P I directly, sending data out."
    },
    {
     "say": "Add H T T P, Make a request. Method POST, to JSON Placeholder, a free fake A P I for practice.",
     "line": 1
    },
    {
     "say": "The body type is raw J S O N, with a title, a body, and a user I D.",
     "line": [
      3,
      5
     ]
    },
    {
     "say": "Replace name and plan by clicking the matching webhook fields in the mapping panel.",
     "line": 4,
     "vars": {
      "name": "\"Ada Lovelace\"",
      "plan": "\"pro\""
     }
    },
    {
     "say": "So for Ada, the body says: Ada Lovelace chose pro.",
     "line": 4,
     "vars": {
      "name": "\"Ada Lovelace\"",
      "plan": "\"pro\"",
      "body": "\"Ada Lovelace chose pro\""
     }
    },
    {
     "say": "Turn on Parse response, and send the webhook request again.",
     "line": [
      1,
      5
     ]
    },
    {
     "say": "The reply is status two oh one, with an I D, usually one oh one. But it doesn't really save anything.",
     "line": [
      1,
      5
     ],
     "out": [
      "201 Created",
      "{\"title\": \"New sign-up\", ..., \"id\": 101}"
     ]
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Project structure",
   "title": "Data in, data out",
   "nodes": [
    {
     "id": "cli",
     "label": "Postman or curl",
     "x": 10,
     "y": 25,
     "sub": "test request",
     "art": "terminal"
    },
    {
     "id": "hook",
     "label": "Custom webhook",
     "x": 32,
     "y": 72,
     "sub": "receives JSON",
     "art": "plug"
    },
    {
     "id": "sheet",
     "label": "Add a Row",
     "x": 54,
     "y": 25,
     "sub": "Google Sheets",
     "art": "table"
    },
    {
     "id": "http",
     "label": "HTTP request",
     "x": 74,
     "y": 72,
     "sub": "Make a request",
     "art": "api"
    },
    {
     "id": "jp",
     "label": "JSONPlaceholder",
     "x": 92,
     "y": 25,
     "sub": "fake API",
     "art": "globe"
    }
   ],
   "edges": [
    {
     "from": "cli",
     "to": "hook"
    },
    {
     "from": "hook",
     "to": "sheet"
    },
    {
     "from": "sheet",
     "to": "http"
    },
    {
     "from": "http",
     "to": "jp"
    }
   ],
   "beats": [
    {
     "say": "Here's the whole scenario, end to end.",
     "show": 5
    },
    {
     "say": "A request arrives at the webhook.",
     "show": 5,
     "on": "hook",
     "send": {
      "from": "cli",
      "to": "hook",
      "label": "JSON: Ada, pro"
     }
    },
    {
     "say": "Add a Row stores the mapped fields in your sheet.",
     "show": 5,
     "on": "sheet",
     "send": {
      "from": "hook",
      "to": "sheet",
      "label": "mapped fields"
     }
    },
    {
     "say": "Then the H T T P module pushes data out to an A P I with no connector.",
     "show": 5,
     "on": "http",
     "send": {
      "from": "http",
      "to": "jp",
      "label": "POST /posts"
     }
    },
    {
     "say": "And the A P I answers. Your automation now both receives and sends.",
     "show": 5,
     "on": "http",
     "send": {
      "from": "jp",
      "to": "http",
      "label": "201 · id 101"
     }
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
   "kind": "array",
   "kicker": "Build · Steps 1 and 2",
   "title": "Map it on paper first: new-lead handling",
   "values": [
    "Trigger: new lead",
    "Decide: priority",
    "Act: record + notify",
    "Approve: Status",
    "Follow up",
    "Log the run"
   ],
   "beats": [
    {
     "say": "Pick one real process: new lead handling, order fulfilment, content publishing, or onboarding. Here, new leads."
    },
    {
     "say": "Before building, write each step on paper. It starts with a trigger: a new lead arrives.",
     "hl": 0,
     "note": "trigger"
    },
    {
     "say": "Then the decisions: which route does this lead take?",
     "ok": [
      0
     ],
     "hl": 1,
     "note": "decisions"
    },
    {
     "say": "Then the actions: create records and send notifications.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "note": "actions"
    },
    {
     "say": "A person approves or rejects it, and follow-up actions run.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": [
      3,
      4
     ],
     "note": "human in the loop"
    },
    {
     "say": "And every run is logged. A clear plan like this keeps a complex automation coherent.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "hl": 5,
     "note": "trigger → decisions → actions"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Build · Steps 3 to 5 and 7",
   "title": "Scenario A: intake, logic, actions",
   "nodes": [
    {
     "id": "intake",
     "label": "Intake",
     "x": 10,
     "y": 50,
     "sub": "form, webhook or record",
     "art": "form"
    },
    {
     "id": "main",
     "label": "Main sheet",
     "x": 32,
     "y": 18,
     "sub": "Status = Pending",
     "art": "table"
    },
    {
     "id": "router",
     "label": "Router + filters",
     "x": 52,
     "y": 72,
     "sub": "as in Project 2",
     "art": "fork"
    },
    {
     "id": "act",
     "label": "Core actions",
     "x": 74,
     "y": 22,
     "sub": "records, notifications",
     "art": "gear"
    },
    {
     "id": "log",
     "label": "Log sheet",
     "x": 92,
     "y": 72,
     "sub": "time, item, outcome",
     "art": "doc"
    }
   ],
   "edges": [
    {
     "from": "intake",
     "to": "main"
    },
    {
     "from": "main",
     "to": "router"
    },
    {
     "from": "router",
     "to": "act"
    },
    {
     "from": "act",
     "to": "log"
    }
   ],
   "beats": [
    {
     "say": "Build the trigger: a linked Google Form sheet, a custom webhook, or a new record.",
     "show": 1,
     "on": "intake"
    },
    {
     "say": "Capture each lead cleanly in a main sheet, with Status starting as Pending, and an empty Processed column.",
     "show": 2,
     "on": "main",
     "send": {
      "from": "intake",
      "to": "main",
      "label": "new lead"
     }
    },
    {
     "say": "If data enters wrong, every later step inherits the problem.",
     "show": 2,
     "on": "main"
    },
    {
     "say": "Next, a router with filters routes each lead based on its details.",
     "show": 3,
     "on": "router",
     "send": {
      "from": "main",
      "to": "router",
      "label": "lead bundle"
     }
    },
    {
     "say": "The core actions do the real work: create records, send notifications, update systems.",
     "show": 4,
     "on": "act",
     "send": {
      "from": "router",
      "to": "act",
      "label": "matched route"
     }
    },
    {
     "say": "Finally, log each run, with the time, item and outcome. Add error handlers on modules that call outside apps.",
     "show": 5,
     "on": "log",
     "send": {
      "from": "act",
      "to": "log",
      "label": "time, item, ok"
     }
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Build · Step 6",
   "title": "A human in the loop, with a sheet",
   "nodes": [
    {
     "id": "a",
     "label": "Scenario A",
     "x": 12,
     "y": 30,
     "sub": "asks the approver",
     "art": "gear"
    },
    {
     "id": "approver",
     "label": "Approver",
     "x": 50,
     "y": 15,
     "sub": "Slack or email",
     "art": "persona"
    },
    {
     "id": "sheet",
     "label": "Main sheet",
     "x": 50,
     "y": 80,
     "sub": "Status column",
     "art": "table"
    },
    {
     "id": "b",
     "label": "Scenario B",
     "x": 88,
     "y": 30,
     "sub": "every 15 minutes",
     "art": "calendar"
    }
   ],
   "edges": [
    {
     "from": "a",
     "to": "approver"
    },
    {
     "from": "approver",
     "to": "sheet"
    },
    {
     "from": "a",
     "to": "sheet"
    },
    {
     "from": "b",
     "to": "sheet"
    }
   ],
   "beats": [
    {
     "say": "Make has no built-in approval button, so a sheet becomes the approval point.",
     "show": 3,
     "on": "sheet"
    },
    {
     "say": "Scenario A messages the approver, with a link to the sheet.",
     "show": 3,
     "on": "approver",
     "send": {
      "from": "a",
      "to": "approver",
      "label": "please review"
     }
    },
    {
     "say": "They change the lead's Status to Approved, or Rejected.",
     "show": 3,
     "on": "sheet",
     "send": {
      "from": "approver",
      "to": "sheet",
      "label": "Approved"
     }
    },
    {
     "say": "Scenario B runs on a schedule, for example every fifteen minutes, and searches the sheet.",
     "show": 4,
     "on": "b",
     "send": {
      "from": "b",
      "to": "sheet",
      "label": "Search Rows"
     }
    },
    {
     "say": "It runs the follow-up actions for what it finds, then updates the row, setting Processed to yes.",
     "show": 4,
     "on": "sheet",
     "send": {
      "from": "b",
      "to": "sheet",
      "label": "Processed = yes"
     }
    },
    {
     "say": "That's two active scenarios, so switch off older ones.",
     "show": 4,
     "on": [
      "a",
      "b"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Build · Step 6",
   "title": "What Scenario B's search finds",
   "columns": [
    "lead",
    "priority",
    "Status",
    "Processed"
   ],
   "rows": [
    [
     "Ada",
     "high",
     "Pending",
     ""
    ],
    [
     "Grace",
     "low",
     "Approved",
     ""
    ],
    [
     "Katherine",
     "high",
     "Rejected",
     ""
    ],
    [
     "Mary",
     "low",
     "Approved",
     "yes"
    ]
   ],
   "beats": [
    {
     "say": "Here's the main sheet when Scenario B wakes up, for example."
    },
    {
     "say": "It searches for rows whose Status is Approved or Rejected, and whose Processed cell is empty.",
     "sql": "Search Rows: Status = Approved or Rejected\nAND Processed is empty",
     "col": 2
    },
    {
     "say": "Ada is still Pending, waiting for the approver. Skip.",
     "hl": 0,
     "dim": true,
     "col": 2
    },
    {
     "say": "Grace and Katherine have decisions, and haven't been handled. They're the matches.",
     "hl": [
      1,
      2
     ],
     "dim": true,
     "col": 3
    },
    {
     "say": "Mary was approved too, but Processed already says yes, from an earlier run. So she isn't handled twice.",
     "hl": 3,
     "dim": true,
     "col": 3
    },
    {
     "say": "After the follow-up, Update a Row sets Processed to yes for Grace and Katherine.",
     "hl": [
      1,
      2
     ],
     "sql": "Update a Row: Processed = yes"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Build · Step 8",
   "title": "Test real cases, including edge cases",
   "columns": [
    "Case",
    "Input",
    "Check"
   ],
   "rows": [
    [
     "Normal lead",
     "high, has email",
     "Routed, approver asked"
    ],
    [
     "Missing email",
     "email is blank",
     "Caught, not a crash"
    ],
    [
     "Unknown priority",
     "matches no filter",
     "Not silently lost"
    ],
    [
     "Rejected item",
     "Status = Rejected",
     "Follow-up, Processed"
    ]
   ],
   "beats": [
    {
     "say": "End to end testing is the only way to trust a process before it handles live work."
    },
    {
     "say": "Start with a normal lead, and follow it all the way through.",
     "hl": 0
    },
    {
     "say": "Then the edge cases. A missing email.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "An unknown priority, which no filter expects.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "And an item that gets rejected.",
     "hl": 3,
     "dim": true
    },
    {
     "say": "For each one, the Log sheet should show what happened.",
     "hl": [
      0,
      1,
      2,
      3
     ],
     "col": 2
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
   "art": "eye",
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
   "kind": "table",
   "kicker": "Build · Steps 1 and 2",
   "title": "Run history tells you what happened",
   "columns": [
    "Run",
    "Status",
    "Detail"
   ],
   "rows": [
    [
     "09:00",
     "Success",
     "3 bundles"
    ],
    [
     "09:15",
     "Success",
     "No new rows"
    ],
    [
     "09:30",
     "Error",
     "Add a Row failed"
    ],
    [
     "09:45",
     "Success",
     "1 bundle"
    ]
   ],
   "beats": [
    {
     "say": "Monitoring means watching whether your automations run successfully. Open the History tab in Make, or the Zap history in Zapier."
    },
    {
     "say": "Each line is one run, for example every fifteen minutes.",
     "col": 0
    },
    {
     "say": "Most runs succeed.",
     "hl": [
      0,
      1,
      3
     ],
     "dim": true,
     "col": 1
    },
    {
     "say": "But one failed. Open it, and you see the data each step received, and which step broke.",
     "hl": 2,
     "dim": true,
     "col": 2
    },
    {
     "say": "That's your main tool for diagnosing issues.",
     "hl": 2,
     "col": 2
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Build · Step 3",
   "title": "Failure alerts reach you",
   "nodes": [
    {
     "id": "scen",
     "label": "Make scenario",
     "x": 12,
     "y": 50,
     "sub": "a module fails",
     "art": "gear"
    },
    {
     "id": "notify",
     "label": "Notifications",
     "x": 50,
     "y": 18,
     "sub": "email on error",
     "art": "bell"
    },
    {
     "id": "handler",
     "label": "Error handler",
     "x": 50,
     "y": 82,
     "sub": "route in Make",
     "art": "shield"
    },
    {
     "id": "you",
     "label": "You",
     "x": 88,
     "y": 50,
     "sub": "Slack or email",
     "art": "persona"
    }
   ],
   "edges": [
    {
     "from": "scen",
     "to": "notify"
    },
    {
     "from": "notify",
     "to": "you"
    },
    {
     "from": "scen",
     "to": "handler"
    },
    {
     "from": "handler",
     "to": "you"
    }
   ],
   "beats": [
    {
     "say": "When a run errors, you want to know without checking by hand.",
     "show": 1,
     "on": "scen"
    },
    {
     "say": "Check your notification settings, so both tools email you when a run errors. Both do by default at the time of writing.",
     "show": 4,
     "on": "notify",
     "send": {
      "from": "scen",
      "to": "notify",
      "label": "run errored"
     }
    },
    {
     "say": "That email reaches you.",
     "show": 4,
     "on": "you",
     "send": {
      "from": "notify",
      "to": "you",
      "label": "error email"
     }
    },
    {
     "say": "For faster alerts, add an error handler route in Make.",
     "show": 4,
     "on": "handler",
     "send": {
      "from": "scen",
      "to": "handler",
      "label": "error details"
     }
    },
    {
     "say": "It sends a Slack message or email with the error details, straight away.",
     "show": 4,
     "on": "you",
     "send": {
      "from": "handler",
      "to": "you",
      "label": "Slack alert"
     }
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Build · Steps 4 and 5",
   "title": "Filter early, and save credits",
   "values": [
    "new",
    "done",
    "done",
    "new",
    "done",
    "done",
    "done",
    "done",
    "done",
    "done"
   ],
   "beats": [
    {
     "say": "A quota caps monthly usage. Zapier counts tasks, Make counts credits. Free plans have small quotas."
    },
    {
     "say": "Say ten rows come in, and only two have status new, for example. Three modules follow.",
     "hl": [
      0,
      3
     ],
     "note": "10 bundles, 2 qualify"
    },
    {
     "say": "If the filter sits at the end, all ten bundles run through all three modules first.",
     "hl": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
     ],
     "note": "filter last: 10 × 3 = 30 module runs"
    },
    {
     "say": "Put the filter early, and the other eight stop before the expensive steps.",
     "ok": [
      0,
      3
     ],
     "gone": [
      1,
      2,
      4,
      5,
      6,
      7,
      8,
      9
     ],
     "note": "filter first: 2 × 3 = 6 module runs"
    },
    {
     "say": "Same result, a fifth of the usage. Removing unnecessary modules helps the same way.",
     "ok": [
      0,
      3
     ],
     "gone": [
      1,
      2,
      4,
      5,
      6,
      7,
      8,
      9
     ],
     "note": "30 → 6"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Build · Steps 4 and 5",
   "title": "Rate limits, quotas and polling",
   "columns": [
    "Limit",
    "Caps",
    "Design tip"
   ],
   "rows": [
    [
     "Rate limit",
     "Calls per period",
     "Don't call too fast"
    ],
    [
     "Quota",
     "Monthly tasks, credits",
     "Check plan numbers"
    ],
    [
     "Poll every 15 min",
     "96 checks a day",
     "Only if you need it"
    ],
    [
     "Poll every hour",
     "24 checks a day",
     "Often enough"
    ]
   ],
   "beats": [
    {
     "say": "A rate limit caps how many times you can call an app in a period.",
     "hl": 0
    },
    {
     "say": "A quota caps your monthly usage. Check the current numbers on each plan page, and design within them.",
     "hl": 1
    },
    {
     "say": "Polling counts too. Checking every fifteen minutes is ninety six checks a day.",
     "hl": 2,
     "col": 1
    },
    {
     "say": "Every hour is twenty four. So schedule polling no more often than you need.",
     "hl": 3,
     "col": 1
    },
    {
     "say": "Efficient automations use fewer tasks or credits, and run faster. That matters when a client pays for usage.",
     "col": 2
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Build · Steps 6 to 8",
   "title": "What a handoff document covers",
   "columns": [
    "Section",
    "Answers"
   ],
   "rows": [
    [
     "Process",
     "What it does, and why"
    ],
    [
     "Each Zap or scenario",
     "How it's built"
    ],
    [
     "Triggers",
     "When it runs"
    ],
    [
     "Logic",
     "Filters and routers"
    ],
    [
     "Connected accounts",
     "Whose logins it uses"
    ],
    [
     "Troubleshooting",
     "Fixing common issues"
    ]
   ],
   "beats": [
    {
     "say": "Without documentation, an automation is a black box only you can maintain."
    },
    {
     "say": "A handoff document starts with the process, then each Zap or scenario.",
     "hl": [
      0,
      1
     ]
    },
    {
     "say": "Then the triggers, and the logic.",
     "hl": [
      2,
      3
     ]
    },
    {
     "say": "Which accounts are connected.",
     "hl": 4
    },
    {
     "say": "And a troubleshooting section, for common issues.",
     "hl": 5
    },
    {
     "say": "This document is often the actual deliverable a client keeps.",
     "hl": [
      0,
      1,
      2,
      3,
      4,
      5
     ]
    },
    {
     "say": "Then record or write a short walkthrough for the owner. It transfers understanding, not just files.",
     "col": 1
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
