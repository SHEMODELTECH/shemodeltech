<!-- order: 5 -->
# Automation for Builders: A Practical Beginner's Course

## Course Overview

**By the end of this course, you'll be able to:**
- Describe any automation as a trigger, actions, and data mapping
- Build and turn on a two-step Zap that maps spreadsheet data into a message
- Build a Make scenario with a router and filters, and test each branch
- Explain how Power Automate flows use connectors, conditions, and run history
- Run n8n locally and build a webhook-triggered workflow with an IF node and a Code node
- Compare Zapier, Make, Power Automate, and n8n and pick one for a given task

**Who this is for:** Beginners who want to connect apps and automate repetitive work, sending a Slack message when a form is submitted, saving email attachments to a folder, syncing a spreadsheet to a CRM, without writing a traditional backend.

**How the course works:** Five modules. Every topic follows the same pattern:
- **Concept** - what it is, in plain language
- **Structure at a Glance** - the core building blocks you'll actually work with
- **Where you'd actually use this** - a real business scenario
- **Lab** - hands-on, buildable examples
- **Checkpoint**
- **Quiz** - five questions with answers

**Time:** about 7 hours in total

**Tools needed:** Free accounts on [Zapier](https://zapier.com) and [Make](https://www.make.com), plus [n8n](https://n8n.io) installed locally (free; n8n's cloud version is paid, with a free trial). [Power Automate](https://powerautomate.microsoft.com) cloud flows generally need a work or school Microsoft account (for example, your university or employer account); a personal outlook.com account usually can't create them. If you don't have one, follow Module 3 along and build the same logic in Make. You won't need all four at once, each module only needs its own tool.

**Free plan limits:** Free plans change often, so check the current plan page of each tool before you start. Zapier's free plan has been limited to simple Zaps (a trigger plus one action), without Filters, Paths, or Webhooks by Zapier, and its polling triggers check for new data only every several minutes. Make's free plan has included multi-step scenarios, routers, filters, and webhooks, within a monthly credit allowance (credits were called operations before 2025). That is why the Zapier lab uses two steps and the branching labs use Make.

---

## Module 0: What Automation Platforms Actually Do

**Time:** about 30 minutes

### Concept

An **automation platform** lets you connect different apps together so that an event in one app automatically causes an action in another, without writing custom backend code to watch for that event or call that app's API yourself. Every platform in this course is built from the same underlying idea, even though the interface and vocabulary differ:

- A **trigger** is the event that starts the automation (a new form response, a new email, a new row in a spreadsheet)
- One or more **actions** are the steps that run afterward (send a message, create a record, send an email)
- A **workflow** (called a Zap, a scenario, a flow, or a workflow depending on the tool) is the trigger plus its actions, chained together
- **Data mapping** is passing information from an earlier step (like the sender's name from a new email) into a later step (like a personalized message)

### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#1e4e8c', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 100, 'padding': 20}}}%%
flowchart LR
    T["<b>Trigger</b><br/><br/>New form response<br/><br/><i>provides: name, email</i>"]
    A1["<b>Action 1</b><br/><br/>Add row to sheet<br/><br/><i>uses data from trigger</i>"]
    A2["<b>Action 2</b><br/><br/>Send Slack message<br/><br/><i>uses data from both prior steps</i>"]

    T ==> A1 ==> A2

    style T fill:#2b6cb0,color:#fff,stroke:#1e4e8c,stroke-width:4px
    style A1 fill:#e2e8f0,color:#1a202c,stroke:#2b6cb0,stroke-width:4px
    style A2 fill:#e2e8f0,color:#1a202c,stroke:#2b6cb0,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
This same shape, trigger then one or more actions, with data flowing forward, appears in every tool this course covers.

### Where you'd actually use this

Any repetitive, manual task that follows a clear "when X happens, do Y" pattern, notifying a team when a customer submits a support request, logging new sign-ups into a spreadsheet, backing up form submissions to cloud storage.

### Lab

Pick a repetitive task you (or a team you know) do by hand regularly, checking an inbox for a certain kind of email, copying data between two tools, sending the same reminder message. Write it out as a single "when [trigger], then [action]" sentence. That sentence is the exact shape every automation you build in this course will take.

```lab
{
 "type": "sort",
 "title": "Trigger or action?",
 "prompt": "Every automation is a trigger followed by actions. Sort each step.",
 "buckets": [
  "Trigger",
  "Action"
 ],
 "items": [
  {
   "text": "A new form response arrives",
   "bucket": "Trigger",
   "why": "The event that starts the automation."
  },
  {
   "text": "Add a row to a spreadsheet",
   "bucket": "Action",
   "why": "A step that runs after the trigger."
  },
  {
   "text": "Send a Slack message",
   "bucket": "Action",
   "why": "A step that runs after the trigger."
  },
  {
   "text": "A new email arrives with an attachment",
   "bucket": "Trigger",
   "why": "An event that can start a workflow."
  },
  {
   "text": "Create a contact in the CRM",
   "bucket": "Action",
   "why": "A step that uses data from the trigger."
  }
 ]
}
```

```lab
{
 "type": "order",
 "title": "Build the workflow in order",
 "prompt": "Arrange this automation so data flows forward from the trigger.",
 "items": [
  "New sign-up form response (trigger)",
  "Add the person to the members sheet",
  "Create their contact in the CRM",
  "Send them a welcome email",
  "Post a note in the team Slack channel"
 ],
 "explain": "The trigger comes first, then each action can use data from the steps before it."
}
```

### Checkpoint
You can describe the trigger, action, and workflow structure, and you have one real "when X, then Y" automation idea written down.

### Quiz
1. What is a trigger?
2. What is an action?
3. What is a workflow, in the general sense used across these tools?
4. What does "data mapping" mean?
5. Do these platforms require writing custom backend code to connect two apps?

*Answers: 1) The event that starts an automation, such as a new form response or a new email. 2) A step that runs after the trigger, such as sending a message or creating a record. 3) The trigger plus its connected actions, chained together into one automated process. 4) Passing specific pieces of data from an earlier step into a later step, so the later step can use them. 5) No, that's the core purpose of these platforms, connecting apps through a visual interface instead of custom code.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "gear",
   "kicker": "Module 0 · What automation platforms do",
   "title": "When this happens, do that",
   "beats": [
    {
     "say": "Welcome to Automation for Builders."
    },
    {
     "say": "An automation platform connects your apps, so an event in one app automatically causes an action in another, without writing custom backend code."
    }
   ]
  },
  {
   "kind": "list",
   "art": "blocks",
   "kicker": "Concept",
   "title": "The four building blocks",
   "items": [
    [
     "Trigger",
     "The event that starts it"
    ],
    [
     "Actions",
     "Steps that run afterward"
    ],
    [
     "Workflow",
     "Zap · scenario · flow · workflow"
    ],
    [
     "Data mapping",
     "Earlier data → later step"
    ]
   ],
   "beats": [
    {
     "say": "Every platform in this course is built from the same idea.",
     "show": 0
    },
    {
     "say": "A trigger is the event that starts it, like a new form response.",
     "show": 1
    },
    {
     "say": "Actions are the steps that run afterward, like sending a message.",
     "show": 2
    },
    {
     "say": "A workflow is the trigger plus its actions, chained together. Each tool has its own name for it.",
     "show": 3
    },
    {
     "say": "And data mapping passes information from an earlier step into a later one, like the sender's name into a personal message.",
     "show": 4
    }
   ]
  },
  {
   "kind": "flow",
   "art": "pipeline",
   "kicker": "Structure at a glance",
   "title": "Data flows forward",
   "steps": [
    "Trigger: new form response",
    "Action: add row to sheet",
    "Action: send Slack message"
   ],
   "beats": [
    {
     "say": "Here's the shape you'll see in every tool.",
     "show": 0
    },
    {
     "say": "A new form response arrives, providing a name and an email.",
     "show": 1
    },
    {
     "say": "Action one adds a row to a sheet, using data from the trigger.",
     "show": 2
    },
    {
     "say": "Action two sends a Slack message, using data from both earlier steps.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quote",
   "art": "pencil",
   "kicker": "Lab",
   "title": "Write your own sentence",
   "quote": "When [trigger], then [action].",
   "beats": [
    {
     "say": "Your lab is one sentence.",
     "show": 0
    },
    {
     "say": "Pick a repetitive task you do by hand, like copying data between two tools, or sending the same reminder.",
     "show": 1
    },
    {
     "say": "Write it as: when this trigger happens, then do this action. That's the exact shape of every automation in this course.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does \"data mapping\" mean?",
   "options": [
    "Passing data from an earlier step into a later step",
    "Drawing a diagram of your apps",
    "Copying a spreadsheet into a database"
   ],
   "answer": 0,
   "good": "That's right. Data mapping passes specific pieces of data from an earlier step into a later step, so the later step can use them.",
   "bad": "Not quite. Data mapping passes specific pieces of data from an earlier step into a later step, so the later step can use them.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does \"data mapping\" mean?",
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
     "You can describe trigger, action and workflow",
     ""
    ],
    [
     "One \"when X, then Y\" idea written down",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 0.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you can describe triggers, actions and workflows,",
     "show": 1
    },
    {
     "say": "and you have one real when X, then Y idea written down.",
     "show": 2
    },
    {
     "say": "Next, in Module 1, your first Zap in Zapier.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 1: Zapier - Simple, Linear Automations

**Time:** about 1 hour

### Concept

**Zapier** is built around simplicity: one trigger, followed by a straight line of actions, called a **Zap**. It supports thousands of pre-built app connections, and is generally the easiest entry point for a first automation.

### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#c93a00', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 100, 'padding': 20}}}%%
flowchart LR
    T["<b>Trigger</b><br/><br/>Google Forms<br/>New Form Response"]
    A1["<b>Action</b><br/><br/>Google Sheets<br/>Create Spreadsheet Row"]
    A2["<b>Action</b><br/><br/>Slack<br/>Send Channel Message"]

    T ==> A1 ==> A2

    style T fill:#ff4a00,color:#fff,stroke:#c93a00,stroke-width:4px
    style A1 fill:#e2e8f0,color:#1a202c,stroke:#ff4a00,stroke-width:4px
    style A2 fill:#e2e8f0,color:#1a202c,stroke:#ff4a00,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Each step picks an **app** and an **event** within that app (the trigger event, or the action event)
- Fields in a later step can be filled with a **dynamic value** from an earlier step, inserted by clicking it from a list rather than typing it manually
- A **filter** step can stop the Zap from continuing unless a condition is met (for example, only continue if a field equals a specific value)
- Zapier's free plan may allow only one trigger and one action per Zap (check the current plan). The three-step Zap in the diagram above, and Filter steps, may need a paid plan or a trial, which is why this module's lab uses two steps

### Where you'd actually use this

Fast, simple automations where the app you need is popular and well supported, notifying a channel about a new form submission, adding new customers to an email list, saving email attachments to cloud storage.

### Lab

1. **Create a Zap:** In Zapier, click "Create Zap." Choose a trigger app you have access to (Google Sheets works well for testing: trigger = "New Spreadsheet Row").

2. **Connect your account and pick the specific sheet and worksheet** the trigger should watch. Zapier will pull in a sample row of existing data to use for testing.

3. **Add an action step.** Choose an app like Slack or Gmail, and an event ("Send Channel Message" or "Send Email"). Connect your account for that app too.

4. **Map data from the trigger into the action.** In the message field, instead of typing plain text, click into the field and insert the trigger's column values (for example, a `Name` column), so the message reads something like: `New entry from {{Name}}, email: {{Email}}`.

5. **Test the step,** using the sample row Zapier pulled earlier, and confirm the message actually arrives with the real data filled in.

6. **Turn the Zap on.** Add a new row to the sheet, and confirm the automation runs on its own, with no manual step required. Be patient: Google Sheets is a polling trigger, so Zapier checks for new rows on a timer, and on the free plan that timer is slow (check the current plan for the interval). If nothing arrives after that interval plus a few minutes, open the Zap's history to see what happened.

### Checkpoint
You have a working, turned-on Zap that reacts to a real new row in a spreadsheet and sends a message containing that row's actual data.

### Quiz
1. What is a Zap?
2. What does a "dynamic value" let you do in an action step, compared to typing plain text?
3. What is a filter step used for?
4. Why does Zapier ask for a sample row of data before you finish building a Zap?
5. What has to happen for an automation to actually start running on its own, after it's built, and how quickly does a Google Sheets Zap react on the free plan?

*Answers: 1) Zapier's term for a workflow, a trigger connected to one or more actions. 2) Insert real data from an earlier step directly into a later step's field, rather than hardcoding static text. 3) To stop the Zap from continuing past that point unless a specific condition is met. 4) So each step can be tested with realistic data while building, confirming the automation behaves correctly before turning it on for real events. 5) The Zap needs to be turned on (published); once on, a polling trigger like Google Sheets checks for new rows on a timer, which is slow on the free plan, so it is not instant.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "chain",
   "kicker": "Module 1 · Zapier",
   "title": "Simple, linear automations",
   "beats": [
    {
     "say": "Welcome to Module 1."
    },
    {
     "say": "Zapier is built around simplicity: one trigger, then a straight line of actions, called a Zap."
    },
    {
     "say": "With thousands of pre-built app connections, it's generally the easiest place to start."
    }
   ]
  },
  {
   "kind": "list",
   "art": "boxes",
   "kicker": "Structure at a glance",
   "title": "Inside a Zap",
   "items": [
    [
     "App + event",
     "Chosen for every step"
    ],
    [
     "Dynamic value",
     "Real data from an earlier step"
    ],
    [
     "Filter",
     "Continue only if a condition is met"
    ],
    [
     "Free plan",
     "Trigger + one action"
    ]
   ],
   "beats": [
    {
     "say": "A Zap has a few parts.",
     "show": 0
    },
    {
     "say": "Each step picks an app, and an event within that app.",
     "show": 1
    },
    {
     "say": "Fields in a later step can be filled with a dynamic value from an earlier step, clicked from a list instead of typed.",
     "show": 2
    },
    {
     "say": "A filter step stops the Zap unless a condition is met.",
     "show": 3
    },
    {
     "say": "The free plan may allow only one trigger and one action, so this lab uses two steps. Check the current plan.",
     "show": 4
    }
   ]
  },
  {
   "kind": "flow",
   "art": "table",
   "kicker": "Lab · Steps 1 to 3",
   "title": "Build the Zap",
   "steps": [
    "Create Zap: New Spreadsheet Row",
    "Pick sheet · sample row",
    "Action: Slack or Gmail"
   ],
   "beats": [
    {
     "say": "Click create Zap, and choose Google Sheets, new spreadsheet row, as the trigger.",
     "show": 1
    },
    {
     "say": "Connect your account, and pick the sheet and worksheet to watch. Zapier pulls in a sample row for testing.",
     "show": 2
    },
    {
     "say": "Then add an action, like Slack, send channel message, or Gmail, send email.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "merge",
   "kicker": "Lab · Step 4",
   "title": "Map the row into the message",
   "file": "Slack message",
   "code": "New entry from {{Name}}, email: {{Email}}",
   "beats": [
    {
     "say": "Now map the data.",
     "show": 0
    },
    {
     "say": "Instead of typing plain text, click into the message field and insert the trigger's column values, like name and email.",
     "show": 1
    },
    {
     "say": "Then test the step with the sample row, and confirm the message arrives with real data filled in.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quote",
   "art": "stopwatch",
   "kicker": "Lab · Step 6",
   "title": "Turn it on, and be patient",
   "quote": "Polling isn't instant. Check the Zap's history if nothing arrives.",
   "beats": [
    {
     "say": "Finally, turn the Zap on and add a new row to the sheet.",
     "show": 0
    },
    {
     "say": "Google Sheets is a polling trigger, so Zapier checks for new rows on a timer, and on the free plan that timer is slow.",
     "show": 1
    },
    {
     "say": "If nothing arrives after that interval plus a few minutes, open the Zap's history to see what happened.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why does Zapier ask for a sample row before you finish building a Zap?",
   "options": [
    "To charge you for the first run",
    "To back up your spreadsheet",
    "So each step can be tested with realistic data before turning it on"
   ],
   "answer": 2,
   "good": "That's right. The sample row lets you test each step with realistic data, confirming the Zap behaves correctly before real events arrive.",
   "bad": "Not quite. The sample row lets you test each step with realistic data, confirming the Zap behaves correctly before real events arrive.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why does Zapier ask for a sample row before you finish building a Zap?",
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
     "A turned-on Zap reacts to a new row",
     ""
    ],
    [
     "The message carries the row's real data",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 1.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a turned-on Zap that reacts to a real new spreadsheet row,",
     "show": 1
    },
    {
     "say": "and sends a message containing that row's actual data.",
     "show": 2
    },
    {
     "say": "Next, in Module 2, branching automations in Make.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 2: Make - Visual, Branching Automations

**Time:** about 1.5 hours

### Concept

**Make** (formerly Integromat) uses a **visual canvas** where modules are connected with lines you can see and rearrange, and supports branching, running different paths depending on a condition, more directly than Zapier's mostly linear structure. This makes it well suited to automations with more than one possible outcome. Routers and filters have been included in Make's free plan, so this lab should cost nothing (each module run uses credits from your monthly allowance; check the current plan).

### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#4a0089', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 100, 'padding': 20}}}%%
flowchart LR
    T["<b>Trigger</b><br/><br/>Watch New Rows"]
    R{"<b>Router</b>"}
    FA["Filter A<br/><br/>Status = Approved"]
    FB["Filter B<br/><br/>Status = Rejected"]
    AA["<b>Action</b><br/><br/>Send Approved email"]
    AB["<b>Action</b><br/><br/>Send Rejected email"]

    T ==> R
    R ==> FA ==> AA
    R ==> FB ==> AB

    style T fill:#6d00cc,color:#fff,stroke:#4a0089,stroke-width:4px
    style R fill:#f0e6ff,color:#1a202c,stroke:#6d00cc,stroke-width:4px
    style FA fill:#e2e8f0,color:#1a202c,stroke:#6d00cc,stroke-width:4px
    style FB fill:#e2e8f0,color:#1a202c,stroke:#6d00cc,stroke-width:4px
    style AA fill:#F5F5F5,color:#1a202c,stroke:#262626,stroke-width:4px
    style AB fill:#ffe3e3,color:#1a202c,stroke:#e03131,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- A **module** is Make's term for a single step, a trigger module or an action module
- A **scenario** is Make's term for a full workflow, the connected chain of modules
- A **router** splits the scenario into multiple branches, each with its own filter deciding which data continues down that path
- Data from any earlier module can be mapped into any later module, shown as clickable tags representing each available field

### Where you'd actually use this

Automations with real decision points, approving or rejecting a request differently depending on its value, routing a support ticket to a different team based on its category, where a single straight line of actions isn't enough.

### Lab

1. **Create a scenario:** In Make, click "Create a new scenario." Add a trigger module, Google Sheets' "Watch New Rows" works well for testing, and connect your account.

2. **Add a Router module** directly after the trigger. This creates two (or more) branches coming out of the same point.

3. **Add a filter to each branch.** On Branch A, set a filter like "Status equals Approved." On Branch B, set a filter like "Status equals Rejected." Each branch will only continue if its filter's condition is true for that specific run.

4. **Add an action module to each branch,** for example an email module, with a different message on each branch, mapping in real data (like a name or item) from the trigger module.

5. **Run the scenario once manually** using the "Run once" button, with a test row that matches Branch A's condition, and confirm only Branch A's action fires. Change the test data to match Branch B's condition and run again, confirming the other path fires instead.

6. **Turn on scheduling** (Make lets you choose how often the trigger checks for new data), and the scenario runs on its own from then on.

### Checkpoint
You have a working Make scenario with a router splitting into two branches, and you've confirmed, by testing both conditions, that each branch only fires for the data it's meant to handle.

### Quiz
1. What is a "module" in Make?
2. What is a "scenario"?
3. What does a router let you do that a purely linear workflow can't?
4. Why test a scenario with data matching each branch's condition separately?
5. What does turning on scheduling actually control?

*Answers: 1) A single step in a scenario, either a trigger or an action. 2) The full connected workflow, the chain of modules from trigger through to every action. 3) Split the workflow into multiple branches, so different data can trigger different actions based on a condition, rather than every run following the exact same single path. 4) To confirm each branch's filter is working correctly, that it fires only for the data it's meant to handle, and correctly ignores data meant for the other branch. 5) How often the trigger checks for new data and potentially starts a new run of the scenario.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "graph",
   "kicker": "Module 2 · Make",
   "title": "Visual, branching automations",
   "beats": [
    {
     "say": "Welcome to Module 2."
    },
    {
     "say": "Make, formerly Integromat, uses a visual canvas where you can see and rearrange the connections between steps."
    },
    {
     "say": "It supports branching, different paths for different conditions, more directly than Zapier."
    }
   ]
  },
  {
   "kind": "list",
   "art": "blocks",
   "kicker": "Structure at a glance",
   "title": "Make's vocabulary",
   "items": [
    [
     "Module",
     "One step"
    ],
    [
     "Scenario",
     "The full workflow"
    ],
    [
     "Router",
     "Splits into branches"
    ],
    [
     "Mapping",
     "Clickable field tags"
    ]
   ],
   "beats": [
    {
     "say": "Make has its own words.",
     "show": 0
    },
    {
     "say": "A module is a single step, a trigger or an action.",
     "show": 1
    },
    {
     "say": "A scenario is the full workflow, the connected chain of modules.",
     "show": 2
    },
    {
     "say": "A router splits the scenario into branches, each with its own filter.",
     "show": 3
    },
    {
     "say": "And data from any earlier module can be mapped in, shown as clickable tags.",
     "show": 4
    }
   ]
  },
  {
   "kind": "flow",
   "art": "fork",
   "kicker": "Lab · Steps 1 to 4",
   "title": "A router with two branches",
   "steps": [
    "Trigger: Watch New Rows",
    "Router",
    "Filters: Approved · Rejected",
    "An email on each branch"
   ],
   "beats": [
    {
     "say": "Create a new scenario, with Google Sheets, watch new rows, as the trigger.",
     "show": 1
    },
    {
     "say": "Add a router right after it, creating two branches.",
     "show": 2
    },
    {
     "say": "Filter branch A on status equals approved, and branch B on status equals rejected.",
     "show": 3
    },
    {
     "say": "Add an email action to each branch, with a different message, mapping in real data from the trigger.",
     "show": 4
    }
   ]
  },
  {
   "kind": "list",
   "art": "test",
   "kicker": "Lab · Steps 5 and 6",
   "title": "Test every branch",
   "items": [
    [
     "Run once: Approved",
     "✓ Only branch A fires"
    ],
    [
     "Run once: Rejected",
     "✓ Only branch B fires"
    ],
    [
     "Scheduling on",
     "Runs on its own"
    ]
   ],
   "beats": [
    {
     "say": "Click run once with a test row matching branch A, and confirm only branch A fires.",
     "show": 1
    },
    {
     "say": "Change the data to match branch B, and run again. Now only the other path fires.",
     "show": 2
    },
    {
     "say": "Then turn on scheduling, which sets how often the trigger checks for new data.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does a router let you do that a purely linear workflow can't?",
   "options": [
    "Run faster",
    "Split into branches, so different data triggers different actions",
    "Connect to more apps"
   ],
   "answer": 1,
   "good": "That's right. A router splits the workflow into branches, each with its own filter, so not every run follows the same single path.",
   "bad": "Not quite. A router splits the workflow into branches, each with its own filter, so not every run follows the same single path.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does a router let you do that a purely linear workflow can't?",
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
     "A router splits into two branches",
     ""
    ],
    [
     "Both branches tested",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 2.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a Make scenario with a router splitting into two branches,",
     "show": 1
    },
    {
     "say": "and you've tested both conditions, confirming each branch fires only for its own data.",
     "show": 2
    },
    {
     "say": "Next, in Module 3, Power Automate inside Microsoft three sixty five.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 3: Power Automate - Automation Inside Microsoft 365

**Time:** about 1.5 hours

**Account note:** Power Automate cloud flows, and the Teams action in this lab, generally need a work or school Microsoft account with a Microsoft 365 license (many universities and employers provide one). A personal Microsoft account usually can't create cloud flows. If you don't have a work or school account, read the module and follow along, then build the same idea in Make: a Gmail "Watch Emails" trigger, a router with a filter on "Subject contains Urgent", and two different actions.

### Concept

**Power Automate** is Microsoft's automation platform, deeply integrated with Microsoft 365 apps (Outlook, SharePoint, Teams, Excel) and Dynamics. It's commonly used inside organizations already using Microsoft's ecosystem, and includes both cloud based flows and **desktop flows** that can automate actions on a Windows desktop itself, not just cloud apps.

### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#004578', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 100, 'padding': 20}}}%%
flowchart LR
    T["<b>Trigger</b><br/><br/>When a new email<br/>arrives in Outlook"]
    C{"<b>Condition</b><br/><br/>Subject contains<br/>'Urgent'?"}
    Y["<b>Yes</b><br/><br/>Post message in Teams"]
    N["<b>No</b><br/><br/>Mark email as read"]

    T ==> C
    C ==>|Yes| Y
    C ==>|No| N

    style T fill:#0067b8,color:#fff,stroke:#004578,stroke-width:4px
    style C fill:#deecf9,color:#1a202c,stroke:#0067b8,stroke-width:4px
    style Y fill:#F5F5F5,color:#1a202c,stroke:#262626,stroke-width:4px
    style N fill:#ffe3e3,color:#1a202c,stroke:#e03131,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- A **flow** is Power Automate's term for a workflow
- **Connectors** are the supported apps and services a flow can trigger from or act on, similar to "apps" in Zapier or "modules" in Make
- A **condition** step branches based on true or false, similar to Make's router, but expressed as an if/else style block directly in the flow
- **Dynamic content** is Power Automate's term for inserting a value from an earlier step into a later step's field

### Where you'd actually use this

Automations tied closely to Microsoft 365, notifying a Teams channel when a SharePoint document is added, approving a request through Outlook and logging the result to Excel, or automating a repetitive desktop task like extracting data from a legacy application.

### Lab

1. **Create a flow:** Sign in to Power Automate with your work or school account, click "Create," then "Automated cloud flow." Choose a trigger, "When a new email arrives (V3)" (Office 365 Outlook) works well for testing, and connect your account.

2. **Add a condition step.** Set it to check something about the incoming email, for example, whether the subject contains a specific word like "Urgent."

3. **Add an action inside the "Yes" branch,** such as "Post message in a chat or channel" (Teams), and use dynamic content to insert the email's actual subject and sender into the message. If your account has no Teams access, use Outlook's "Send an email (V2)" to yourself instead.

4. **Add a different action inside the "No" branch,** such as marking the email as read, so both outcomes are handled explicitly, not just the urgent case.

5. **Save the flow, then test it** using the built-in test feature, either by triggering it manually with sample data or by sending yourself a real test email matching the condition.

6. **Check the run history.** Power Automate keeps a log of every run, including which branch fired and what data flowed through each step, useful for confirming the flow behaved correctly, or diagnosing it if it didn't.

### Checkpoint
You have a working flow with a condition branching into two different actions, and you've checked its run history to confirm which branch actually fired.

### Quiz
1. What is a "connector" in Power Automate?
2. What is a "desktop flow," and how is it different from a cloud flow?
3. What does a condition step do?
4. What is "dynamic content"?
5. What does the run history let you do after a flow has executed?

*Answers: 1) A supported app or service a flow can trigger from or take action on, Power Automate's equivalent of Zapier's "apps" or Make's "modules." 2) A flow that automates actions directly on a Windows desktop, such as clicking through a legacy application; a cloud flow instead triggers from and acts on cloud based apps and services. 3) It branches the flow into different paths (commonly "Yes" and "No") depending on whether a condition is true or false. 4) Power Automate's term for inserting a real value from an earlier step directly into a later step's field, rather than typing static text. 5) Review exactly what happened during a specific run, including which branch fired and what data passed through each step, useful for confirming correct behavior or troubleshooting.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "cloud",
   "kicker": "Module 3 · Power Automate",
   "title": "Automation inside Microsoft 365",
   "beats": [
    {
     "say": "Welcome to Module 3."
    },
    {
     "say": "Power Automate is Microsoft's automation platform, deeply integrated with Outlook, SharePoint, Teams, Excel and Dynamics."
    },
    {
     "say": "It has cloud flows, and desktop flows that automate actions on a Windows desktop itself."
    }
   ]
  },
  {
   "kind": "quote",
   "art": "idcard",
   "kicker": "Account note",
   "title": "You'll need a work or school account",
   "quote": "No work or school account? Follow along, then build it in Make.",
   "beats": [
    {
     "say": "A quick note before you start.",
     "show": 0
    },
    {
     "say": "Cloud flows generally need a work or school Microsoft account, like one from a university or employer. A personal account usually can't create them.",
     "show": 1
    },
    {
     "say": "If you don't have one, follow along, then build the same idea in Make: a Gmail trigger, a router filtering on urgent, and two actions.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "plug",
   "kicker": "Structure at a glance",
   "title": "Power Automate's vocabulary",
   "items": [
    [
     "Flow",
     "The workflow"
    ],
    [
     "Connectors",
     "Apps and services"
    ],
    [
     "Condition",
     "If / else: Yes or No"
    ],
    [
     "Dynamic content",
     "Values from earlier steps"
    ]
   ],
   "beats": [
    {
     "say": "Here's how the same ideas are named.",
     "show": 0
    },
    {
     "say": "A flow is the workflow.",
     "show": 1
    },
    {
     "say": "Connectors are the apps and services a flow can trigger from or act on.",
     "show": 2
    },
    {
     "say": "A condition branches on true or false, as an if else block.",
     "show": 3
    },
    {
     "say": "And dynamic content inserts a value from an earlier step.",
     "show": 4
    }
   ]
  },
  {
   "kind": "flow",
   "art": "fork",
   "kicker": "Lab · Steps 1 to 4",
   "title": "Urgent email, two outcomes",
   "steps": [
    "Trigger: new email arrives",
    "Condition: subject has \"Urgent\"",
    "Yes: post in Teams",
    "No: mark as read"
   ],
   "beats": [
    {
     "say": "Create an automated cloud flow, triggered when a new email arrives in Outlook.",
     "show": 1
    },
    {
     "say": "Add a condition: does the subject contain the word urgent?",
     "show": 2
    },
    {
     "say": "On yes, post a message in Teams with the email's subject and sender. Or send yourself an email if you don't have Teams.",
     "show": 3
    },
    {
     "say": "On no, mark the email as read, so both outcomes are handled.",
     "show": 4
    }
   ]
  },
  {
   "kind": "big",
   "art": "pulse",
   "kicker": "Lab · Steps 5 and 6",
   "title": "Test, then read the run history",
   "big": "Run history",
   "sub": "Which branch fired, and what data flowed through",
   "beats": [
    {
     "say": "Save and test the flow, with sample data or a real test email.",
     "show": 0
    },
    {
     "say": "Then check the run history. It logs every run, which branch fired, and what data passed through each step.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does a condition step do in Power Automate?",
   "options": [
    "Branches the flow into Yes and No paths, depending on whether a condition is true",
    "Checks your account license",
    "Repeats the flow until it succeeds"
   ],
   "answer": 0,
   "good": "That's right. A condition branches the flow into different paths, commonly Yes and No, depending on whether it's true or false.",
   "bad": "Not quite. A condition branches the flow into different paths, commonly Yes and No, depending on whether it's true or false.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does a condition step do in Power Automate?",
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
     "A condition branches into two actions",
     ""
    ],
    [
     "You've read the run history",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 3.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a flow with a condition branching into two different actions,",
     "show": 1
    },
    {
     "say": "and you've checked its run history to see which branch fired.",
     "show": 2
    },
    {
     "say": "Next, in Module 4, open source automation with n eight n.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 4: n8n - Open Source and Self-Hostable

**Time:** about 2 hours

### Concept

**n8n** is an open source automation platform. It uses the same trigger and action structure as the others, arranged on a visual canvas similar to Make, but can be **self-hosted**, run on your own server rather than a vendor's cloud, giving more control over data and cost, and it also allows dropping into actual JavaScript code within a workflow when a built-in step isn't enough.

### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#b7223f', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 100, 'padding': 20}}}%%
flowchart LR
    W["<b>Webhook</b><br/><br/>Trigger node"]
    IF{"<b>IF node</b><br/><br/>status = 'approved'?"}
    S1["Edit Fields (Set)<br/><br/>true branch"]
    S2["Edit Fields (Set)<br/><br/>false branch"]
    F["<b>Code node</b><br/><br/>custom JavaScript"]

    W ==> IF
    IF ==>|true| S1 ==> F
    IF ==>|false| S2

    style W fill:#ea4b71,color:#fff,stroke:#b7223f,stroke-width:4px
    style IF fill:#ffe0e6,color:#1a202c,stroke:#ea4b71,stroke-width:4px
    style S1 fill:#F5F5F5,color:#1a202c,stroke:#262626,stroke-width:4px
    style S2 fill:#ffe3e3,color:#1a202c,stroke:#e03131,stroke-width:4px
    style F fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- A **node** is n8n's term for a single step, trigger or action, matching "module" in Make and "action" in Zapier and Power Automate
- A **workflow** is the connected chain of nodes
- An **IF node** branches based on a condition, similar to Make's router or Power Automate's condition step
- A **Code node** (it replaced the older Function node) lets you write JavaScript or Python when a built-in node can't do exactly what's needed. Other tools have similar options, such as Code by Zapier and Power Automate's expressions, but in n8n code is a normal, everyday part of building

### Where you'd actually use this

Automations where cost matters at scale (self-hosting avoids per-task pricing), where data needs to stay on infrastructure you control, or where a workflow needs a small piece of custom logic that goes beyond what a purely visual step can express.

### Lab

1. **Set up n8n.** Run it locally for free (you need [Node.js](https://nodejs.org) installed, an LTS version), or sign up for n8n cloud's free trial:
```bash
npx n8n
```
Open the URL shown in the terminal (typically `http://localhost:5678`).

2. **Create a new workflow, and add a Webhook trigger node.** Leave its name as "Webhook", set **HTTP Method** to `POST`, and copy the **Test URL** n8n shows (it looks like `http://localhost:5678/webhook-test/<some-id>`).

3. **Click "Listen for test event"** in the Webhook node. n8n only accepts a request on the test URL while it is listening, so do this before every test.

4. **Send a test request to that URL** using curl, simulating an external system calling into your workflow (Template: replace the URL with your Test URL):
```bash
curl -X POST http://localhost:5678/webhook-test/your-webhook-id -H "Content-Type: application/json" -d '{"status":"approved","name":"Alex"}'
```
In the n8n editor, you'll see the webhook node capture this real data. Notice that the JSON you sent appears under `body`, so the status is at `body.status`.

5. **Add an IF node** after the webhook, checking whether `{{ $json.body.status }}` (drag it in from the input panel) is equal to `approved`.

6. **Add an Edit Fields (Set) node on the true branch,** adding a `message` field built from `{{ $json.body.name }}`, and a different Edit Fields (Set) node on the false branch with a different message.

7. **Add a Code node** after the true branch's Edit Fields node to see custom logic in action. Leave the mode as "Run Once for All Items", language JavaScript, and paste:
```javascript
const body = $('Webhook').first().json.body;
return $input.all().map(item => {
  item.json.greeting = `Hello, ${body.name}! Your status is ${body.status}.`;
  return item;
});
```
`$input.all()` gives every item coming into this node, and `$('Webhook')` reads the output of the node named "Webhook".

8. **Run the whole workflow:** click the test/execute workflow button at the bottom of the canvas (the label varies by version), which puts the webhook in listening mode again, then send the same curl request. Confirm the true branch runs and the Code node's output shows `greeting`. Then send `"status":"rejected"` and confirm the false branch runs instead.

### Checkpoint
You have a working n8n workflow triggered by a real webhook request, branching with an IF node, and including one Code node with custom JavaScript logic.

### Quiz
1. What is a "node" in n8n?
2. What does "self-hosted" mean, and what does it give you compared to a purely cloud based platform?
3. What does an IF node do?
4. What does a Code node let you do, and is n8n the only tool in this course that lets you add code?
5. What kind of trigger did the lab use to receive real data from outside n8n?

*Answers: 1) A single step in a workflow, either a trigger or an action, n8n's equivalent of a "module" in Make or an "action" in Zapier and Power Automate. 2) Running the platform on your own server rather than a vendor's cloud, giving more control over data location and cost, particularly at scale. 3) It branches the workflow into different paths depending on whether a condition is true or false. 4) Write JavaScript (or Python) directly inside a workflow step, for logic too specific for a built-in node; no, Zapier has Code by Zapier and Power Automate has expressions, but n8n makes code an everyday part of building. 5) A Webhook trigger, which generates a URL that an external system (or a manual curl request) can call to start the workflow with real data.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "server",
   "kicker": "Module 4 · n8n",
   "title": "Open source and self-hostable",
   "beats": [
    {
     "say": "Welcome to the last module."
    },
    {
     "say": "n eight n is an open source automation platform, with a visual canvas like Make."
    },
    {
     "say": "But you can self-host it, on your own server, and drop into real code when a built-in step isn't enough."
    }
   ]
  },
  {
   "kind": "list",
   "art": "graph",
   "kicker": "Structure at a glance",
   "title": "n8n's vocabulary",
   "items": [
    [
     "Node",
     "One step"
    ],
    [
     "Workflow",
     "Chain of nodes"
    ],
    [
     "IF node",
     "Branches true / false"
    ],
    [
     "Code node",
     "JavaScript or Python"
    ]
   ],
   "beats": [
    {
     "say": "n eight n has its own terms.",
     "show": 0
    },
    {
     "say": "A node is a single step, a trigger or an action.",
     "show": 1
    },
    {
     "say": "A workflow is the connected chain of nodes.",
     "show": 2
    },
    {
     "say": "An IF node branches on a condition.",
     "show": 3
    },
    {
     "say": "And a Code node lets you write JavaScript or Python. Other tools have similar options, but here code is an everyday part of building.",
     "show": 4
    },
    {
     "say": "Self-hosting avoids per-task pricing, and keeps data on infrastructure you control.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "plug",
   "kicker": "Lab · Steps 1 to 4",
   "title": "Start n8n, then call its webhook",
   "file": "terminal",
   "code": "npx n8n\n\ncurl -X POST http://localhost:5678/webhook-test/your-webhook-id \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"status\":\"approved\",\"name\":\"Alex\"}'",
   "beats": [
    {
     "say": "Run n eight n locally with npx, and open the address it shows, usually port five six seven eight.",
     "show": 0
    },
    {
     "say": "Add a Webhook trigger node, set the method to POST, and copy its test URL.",
     "show": 1
    },
    {
     "say": "Click listen for test event, then send a request with curl. n eight n only accepts it while listening.",
     "show": 1
    },
    {
     "say": "The J S O N you sent appears under body, so the status is at body dot status.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab · Steps 5 to 7",
   "title": "Branch, then add a Code node",
   "file": "Code node",
   "code": "const body = $('Webhook').first().json.body;\nreturn $input.all().map(item => {\n  item.json.greeting = `Hello, ${body.name}! Your status is ${body.status}.`;\n  return item;\n});",
   "beats": [
    {
     "say": "Next, add an IF node checking whether body dot status equals approved.",
     "show": 0
    },
    {
     "say": "Put an Edit Fields node on each branch, each with a different message built from the name.",
     "show": 0
    },
    {
     "say": "Then add a Code node after the true branch, in JavaScript.",
     "show": 1
    },
    {
     "say": "Dollar input dot all gives every item coming into the node.",
     "show": 1
    },
    {
     "say": "And dollar, Webhook, reads the output of the node named Webhook, to build a greeting.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "test",
   "kicker": "Lab · Step 8",
   "title": "Run the whole workflow",
   "items": [
    [
     "\"approved\"",
     "✓ True branch · greeting appears"
    ],
    [
     "\"rejected\"",
     "✓ False branch runs"
    ]
   ],
   "beats": [
    {
     "say": "Click the execute workflow button, which puts the webhook back in listening mode, and send the same request.",
     "show": 0
    },
    {
     "say": "Status approved: the true branch runs, and the Code node's output shows greeting.",
     "show": 1
    },
    {
     "say": "Status rejected: the false branch runs instead.",
     "show": 2
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What kind of trigger did the lab use to receive real data from outside n8n?",
   "options": [
    "A schedule trigger",
    "A Google Sheets trigger",
    "A Webhook trigger, a URL an outside system can call"
   ],
   "answer": 2,
   "good": "That's right. A Webhook trigger generates a URL that an external system, or a curl request, can call to start the workflow with real data.",
   "bad": "Not quite. A Webhook trigger generates a URL that an external system, or a curl request, can call to start the workflow with real data.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What kind of trigger did the lab use to receive real data from outside n8n?",
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
     "A real webhook triggers the workflow",
     ""
    ],
    [
     "An IF node branches it",
     ""
    ],
    [
     "A Code node runs custom JavaScript",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's the final module.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have an n eight n workflow triggered by a real webhook request,",
     "show": 1
    },
    {
     "say": "branching with an IF node,",
     "show": 2
    },
    {
     "say": "and including a Code node with custom JavaScript.",
     "show": 3
    },
    {
     "say": "You've finished Automation for Builders. Well done.",
     "show": 3
    }
   ]
  }
 ]
}
```
