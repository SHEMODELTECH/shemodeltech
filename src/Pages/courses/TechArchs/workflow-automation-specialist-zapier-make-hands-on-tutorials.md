<!-- order: 3 -->
# Workflow Automation Specialist (Zapier and Make): Hands-On Project Tutorials

This course turns each project into a step-by-step, hands-on build. You learn each idea at the moment you need it, while building the thing, and every project hands its result to the next one, ending in a multi-step automation that runs a real process by itself. Follow the projects in order.

---

## Project 1 (Module 1): Build Your First Automation

**Goal:** Connect two apps so that an action in one automatically triggers an action in the other.

**Step 1: Create a free Zapier account.**
Go to zapier.com and sign up. Zapier connects apps without code and is the most widely used automation tool, so skills here transfer straight to real work.

**Step 2: Understand triggers.**
A trigger is the event that starts an automation, such as a new row being added to a spreadsheet. Every automation begins with one, and choosing the right trigger decides when your automation runs.

**Step 3: Understand Zaps.**
A Zap is one automated workflow: a trigger plus one or more actions. Thinking in Zaps (this happens, so do that) is the core idea behind all automation.

**Step 4: Pick a trigger app and event.**
Create a Zap, choose Google Sheets as the trigger app, and select "New Spreadsheet Row" as the event. A spreadsheet is the easiest place to see automation work, because you can add rows yourself to test it.

**Step 5: Understand actions.**
An action is what the automation does when the trigger fires, such as sending an email or posting a message. A trigger with no action does nothing; the action is the work you are saving a person from doing.

**Step 6: Add an action.**
Add an action step: Gmail, "Send Email", and set the recipient, subject, and body. Sending a notification on a new row is one of the most common real automations.

**Step 7: Map data between steps.**
Mapping passes data from the trigger into the action, such as putting the new row's name into the email. It is what makes an automation carry the specific details through the workflow.

**Step 8: Test and turn on the Zap.**
Use the built-in test, then add a real row and confirm the email arrives, and turn the Zap on. Testing before turning it on stops a broken automation from running silently.

### Final Project Structure
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
- ✅ Turning a live automation on safely

### Portfolio Project
**First Working Automation**: Connected two apps into a tested, live automation that removes a manual step.
**Skills:** Zapier, Triggers and Actions, Data Mapping, No-Code Automation.

**Deliverable:** A live Zap that emails a notification whenever a new spreadsheet row is added.

---

## Project 2 (Module 2): Add Logic with Filters and Paths

**Goal:** Make an automation smart enough to decide, so it acts only when it should and differently in different cases.

**Step 1: Understand filters.**
A filter stops a Zap from continuing unless a condition is met, such as only if the amount is over 100. Without filters, an automation acts on everything, including cases it should ignore.

**Step 2: Add a filter to your Zap.**
Add a Filter step after the trigger: only continue if a field like `status` equals `new`. When the condition is not met, the Zap simply stops quietly.

**Step 3: Understand paths.**
A path splits a Zap into branches that each run different actions based on conditions. Paths turn one automation into a decision tree.

**Step 4: Build a two-branch path.**
Add Paths. In branch A, if `priority` is `high`, send an urgent Slack message; in branch B, if `priority` is `low`, add a row to a log sheet. One trigger now drives two different outcomes.

**Step 5: Understand formatters.**
A formatter transforms data between steps, such as turning text to uppercase or reformatting a date. Data rarely arrives in the exact shape the next app needs.

**Step 6: Add a formatter step.**
Add a Formatter to turn a date into a friendly format before it goes into a message. Clean output is what makes an automation feel professional rather than robotic.

**Step 7: Test each branch.**
Test each path branch separately using sample data that matches each condition. A path that works for one branch can silently fail on another.

**Step 8: Document the logic.**
Write out, in plain language, what each filter and branch does. Logic you understood while building is easy to forget later.

### Final Project Structure
```text
Zap 2
│
├── Trigger
├── Filter: continue only if status = new
├── Formatter: date -> friendly format
└── Paths
    ├── Branch A (priority = high) -> Slack urgent message
    └── Branch B (priority = low)  -> add row to log sheet
```

### What You Learned
- ✅ What filters, paths, and formatters are
- ✅ Making an automation act only when it should
- ✅ Routing one trigger to different outcomes
- ✅ Cleaning and reshaping data between steps
- ✅ Testing and documenting branching logic

### Portfolio Project
**Conditional Automation**: Built an automation with filters, branching paths, and data formatting that routes work based on real conditions.
**Skills:** Zapier Filters, Paths, Formatter, Automation Logic.

**Deliverable:** A branching automation that routes items differently based on their properties.

---

## Project 3 (Module 3): Build a Multi-Step Process in Make

**Goal:** Rebuild and extend an automation in Make (formerly Integromat), a more visual and powerful tool, to see automation at a larger scale.

**Step 1: Create a free Make account.**
Go to make.com and sign up. Make shows automations as a visual diagram of connected modules, which builds your intuition for how data flows.

**Step 2: Understand scenarios.**
A scenario is Make's name for an automation: a set of connected modules on a canvas. It is to Make what a Zap is to Zapier.

**Step 3: Understand modules.**
A module is one step in a scenario, such as watching for a new form response or creating a record. Dragging and connecting modules is the core of building in Make.

**Step 4: Build a form-to-database scenario.**
Add a trigger module (a form tool or webhook), then a module to create a row in a Google Sheet or Airtable. Capturing form submissions into a database is one of the most requested automations in real work.

**Step 5: Understand the data flow between modules.**
Each module passes its output to the next through mapped fields, shown as a connected line. Seeing the data move down the chain makes complex logic easier to reason about.

**Step 6: Add a third step.**
Add a module that posts a confirmation to Slack or sends an email after the record is created. Chaining three or more steps is where automation starts replacing whole manual processes.

**Step 7: Understand error handling.**
Error handling decides what happens when a step fails, so one failure does not silently break everything. Real automations hit failures when an app is down or data is missing.

**Step 8: Add an error handler and test.**
Add an error handler route to one module, for example to log the error, then run the scenario with test data. Building error handling from the start is what makes an automation dependable.

### Final Project Structure
```text
Make scenario
│
├── Module 1: form / webhook trigger
├── Module 2: create record (Sheet or Airtable)
├── Module 3: send confirmation (Slack or email)
└── Error handler on Module 2 -> log failure
```

### What You Learned
- ✅ What scenarios and modules are in Make
- ✅ Building visual, multi-step automations
- ✅ Mapping data flow across several steps
- ✅ Capturing form data into a database
- ✅ Adding error handling for reliability

### Portfolio Project
**Multi-Step Make Scenario**: Built a visual, three-step automation with error handling that turns form submissions into records and confirmations.
**Skills:** Make (Integromat), Multi-Step Automation, Error Handling, Data Flow.

**Deliverable:** A working Make scenario that captures form data, stores it, confirms it, and handles failures.

---

## Project 4 (Module 4): Automate with Webhooks and APIs

**Goal:** Connect to apps that do not have a ready-made integration, using webhooks and simple API calls.

**Step 1: Understand APIs.**
An API is a way for one app to talk to another over the internet using structured requests. Almost every modern app has one, which unlocks thousands of tools that have no drag-and-drop connector.

**Step 2: Understand webhooks.**
A webhook is a URL that an app calls to send data the instant something happens, rather than waiting to be asked. It is the fastest, most flexible kind of trigger.

**Step 3: Create a webhook trigger.**
In Make or Zapier, create a Webhook trigger and copy its unique URL. This URL is the doorway other apps use to reach your automation.

**Step 4: Send test data to the webhook.**
Use the app's settings, or a simple test tool, to send a sample request to your webhook URL. Seeing your automation receive live data proves the connection works and shows you the shape of the incoming data.

**Step 5: Understand JSON.**
JSON is the common text format APIs use to send data, made of key and value pairs. Being able to read it is what lets you find and map the fields you need.

**Step 6: Map the incoming JSON fields.**
Map fields from the received JSON into a follow-up action, such as creating a record. Reading incoming data and routing it onward is the heart of connecting custom apps.

**Step 7: Understand API requests.**
An API request module lets you call another app's API directly, sending data out, not just receiving it. This lets you push data into tools that have no connector.

**Step 8: Make an outbound API call and test.**
Add an API request module that posts data to a service's API endpoint, then test the full flow. A tested, two-way custom connection is what lets you take on almost any automation request.

### Final Project Structure
```text
Custom integration
│
├── Webhook trigger (unique URL) -> receives JSON
├── Parse and map JSON fields
├── Action: create record
└── Outbound API request -> push data to a no-connector app
```

### What You Learned
- ✅ What APIs, webhooks, and JSON are
- ✅ Receiving live data through a webhook
- ✅ Reading and mapping JSON fields
- ✅ Making outbound API calls to any service
- ✅ Building two-way custom integrations

### Portfolio Project
**Custom API Automation**: Connected apps with no ready-made integration using webhooks, JSON, and direct API calls.
**Skills:** Webhooks, APIs, JSON, Custom Integration, No-Code Automation.

**Deliverable:** An automation that both receives data via webhook and pushes data out via an API call.

---

## Project 5 (Module 5): Automate a Real Business Process End to End

**Goal:** Combine your skills into one automation that runs a complete, realistic business process.

**Step 1: Choose a real process.**
Pick one: new-lead handling, order fulfilment, content publishing, or onboarding. A recognisable business process makes your portfolio piece instantly understandable.

**Step 2: Map the process on paper first.**
Write each step of the process as a trigger, decisions, and actions before you build. A clear plan keeps a complex automation coherent.

**Step 3: Build the trigger and intake.**
Build the trigger (a form, an email, a new record) and capture the incoming data cleanly. If data enters wrong, every later step inherits the problem.

**Step 4: Add the decision logic.**
Add the filters and paths that route each item based on its details. This is where your Project 2 logic makes the process behave intelligently.

**Step 5: Add the core actions.**
Create records, send notifications, and update the systems the process touches. These actions are the actual work being automated.

**Step 6: Add a human-in-the-loop step.**
Add a step that pauses for human approval on important actions, such as a Slack approval. Knowing when to keep a person in the loop is a mark of a thoughtful automation specialist.

**Step 7: Add logging and error handling.**
Log each run to a sheet and handle failures gracefully. Logs let you prove the automation ran and diagnose issues.

**Step 8: Test the whole process with real cases.**
Run several realistic cases through the full automation, including edge cases. End-to-end testing is the only way to trust a process before it handles live work.

### Final Project Structure
```text
Business process automation
│
├── Intake (trigger + clean capture)
├── Decision logic (filters + paths)
├── Core actions (records, notifications, updates)
├── Human approval step
├── Logging + error handling
└── Tested with real and edge cases
```

### What You Learned
- ✅ Mapping a real business process before building
- ✅ Building reliable intake and decision logic
- ✅ Combining actions into an end-to-end process
- ✅ Adding human-in-the-loop approval where needed
- ✅ Logging, error handling, and realistic testing

### Portfolio Project
**End-to-End Process Automation**: Automated a complete, realistic business process with intake, logic, actions, approvals, logging, and error handling.
**Skills:** Process Automation, Zapier, Make, Human-in-the-Loop, Reliability.

**Deliverable:** One automation that runs a full business process from intake to completion, tested on real cases.

---

## Project 6 (Module 6): Monitor, Maintain, and Hand Off

**Goal:** Make your automations reliable over time and document them so others can trust and maintain them.

**Step 1: Understand monitoring.**
Monitoring is watching whether your automations run successfully, using the tool's history or task logs. An automation you never check can fail for weeks unnoticed.

**Step 2: Review run history.**
Open the task or run history in Zapier or Make and read through recent runs. Run history tells you exactly what happened on each execution, which is your main tool for diagnosing issues.

**Step 3: Add failure alerts.**
Set up an alert, by email or Slack, that fires when an automation errors. Being told the moment something breaks is what makes an automation trustworthy in production.

**Step 4: Understand rate limits and quotas.**
A rate limit caps how many times you can call an app in a period, and a quota caps your monthly task usage. Designing within these keeps automations running as volume grows.

**Step 5: Optimise for efficiency.**
Reduce unnecessary steps and combine actions to use fewer tasks per run. Efficient automations cost less and run faster, which matters when a client pays per task.

**Step 6: Understand handoff documentation.**
Handoff documentation explains what an automation does, how it is built, and how to fix common issues. Without it, an automation is a black box only you can maintain.

**Step 7: Write a handoff document.**
Create a doc covering the process, each Zap or scenario, the triggers, the logic, and a troubleshooting section. This document is often the actual deliverable a client keeps.

**Step 8: Do a walkthrough.**
Record or write a short walkthrough of the automation for the person who will own it. A walkthrough transfers understanding, not just files.

### Final Project Structure
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

---

## Final Capstone: Automate a Complete Operation for a Real or Realistic Client

**Goal:** Combine every project into one automation suite that runs a real operation. This is an integration exercise, not new material.

**Step 1: Choose a real operation.**
Pick a real or realistic client operation, such as a small shop's order flow, a creator's content pipeline, or a team's request intake. A real operation gives your capstone genuine stakes.

**Step 2: Map the whole operation.**
Using your Project 5 skills, diagram every trigger, decision, and action across the operation before building.

**Step 3: Build the core automations.**
Using your Project 1 to 3 skills, build the Zaps and scenarios that run each part, with triggers, filters, paths, and multi-step flows.

**Step 4: Add custom integrations where needed.**
Using your Project 4 skills, use webhooks and API calls to connect any tool without a ready-made connector. Real operations almost always include one.

**Step 5: Add reliability.**
Using your Project 6 skills, add monitoring, alerts, logging, and error handling across the suite.

**Step 6: Document and package the handoff.**
Write the full handoff document and a walkthrough of the whole suite, so the client can own it.

**Step 7: Write the capstone summary.**
Summarise the operation, the before-and-after time saved, the automations built, and the results. A clear before-and-after is the most convincing thing you can show.

### Final Project Structure
```text
capstone_operation
│
├── Operation map (all triggers, decisions, actions)
├── Core automations (Zaps + Make scenarios)
├── Custom integrations (webhooks + APIs)
├── Reliability (monitoring, alerts, logging, error handling)
├── handoff_document.md + walkthrough
└── capstone_summary.md (before/after, time saved, results)
```

### What You Learned
- ✅ Turning a real operation into an automation suite
- ✅ Combining triggers, logic, multi-step flows, and custom integrations
- ✅ Making a whole suite reliable and monitored
- ✅ Documenting and handing off a complete operation
- ✅ Shipping a persuasive, results-focused capstone

### Portfolio Project
**Complete Operation Automation (Capstone)**: Automated a full real-world operation with reliable, documented, custom-integrated workflows that replace hours of manual work.
**Skills:** Zapier, Make, Webhooks, APIs, Process Automation, Reliability, Technical Writing, No-Code Automation.

**Deliverable:** A complete, reliable, documented automation suite that runs a real operation, plus a before-and-after summary of the time it saves.
