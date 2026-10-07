<!-- order: 6 -->
# Workflow Automation Specialist (Zapier and Make): Hands-On Project Tutorials

This course turns each project into a step-by-step, hands-on build. You learn each idea at the moment you need it, while building the thing, and every project hands its result to the next one, ending in a multi-step automation that runs a real process by itself. Follow the projects in order.

**Free plans only.** Every lab here works on free plans. On the free plan at the time of writing (2026), Zapier allows only two-step Zaps (one trigger plus one action) and does not include Filters, Paths, multi-step Zaps, or Webhooks by Zapier. Make's free plan does include multi-step scenarios, routers, filters, webhooks, and HTTP requests, with a monthly allowance of credits (called operations before 2025) and a limit on how many scenarios can be active at once. So Project 1 uses Zapier for a two-step example, and the multi-step, branching, and webhook projects use Make. Plans change, so check the current pricing page of each tool before you start.

---

## Project 1 (Module 1): Build Your First Automation

**Time:** about 1 hour

**Goal:** Connect two apps so that an action in one automatically triggers an action in the other.

**Step 1: Create a free Zapier account.**
Go to zapier.com and sign up. Zapier connects apps without code and is one of the most widely used automation tools. The free plan is enough for this project because it needs only one trigger and one action.

**Step 2: Understand triggers.**
A trigger is the event that starts an automation, such as a new row being added to a spreadsheet. Every automation begins with one, and choosing the right trigger decides when your automation runs.

**Step 3: Understand Zaps.**
A Zap is one automated workflow: a trigger plus one or more actions. Thinking in Zaps (this happens, so do that) is the core idea behind all automation. On the free plan, a Zap can have one action.

**Step 4: Pick a trigger app and event.**
Create a Google Sheet with the headers `name`, `email` in row 1 and one sample row. In Zapier, create a Zap, choose Google Sheets as the trigger app, select "New Spreadsheet Row" as the event, connect your Google account, and pick your sheet and worksheet.

**Step 5: Understand actions.**
An action is what the automation does when the trigger fires, such as sending an email or posting a message. A trigger with no action does nothing; the action is the work you are saving a person from doing.

**Step 6: Add an action.**
Add an action step: Gmail, "Send Email", and set the recipient (your own address while testing), subject, and body.

**Step 7: Map data between steps.**
Mapping passes data from the trigger into the action. Click into the email body and insert the `name` and `email` fields from the trigger, for example: "New sign-up: {name} ({email})". This is what makes the automation carry the specific details of each row.

**Step 8: Test and turn on the Zap.**
Use the built-in test, check the email arrives, then publish (turn on) the Zap and add a real row. Google Sheets is a polling trigger: on the free plan Zapier checks for new rows about every 15 minutes, so the email will not arrive instantly. Wait, then check the Zap's history if nothing arrives.

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

*Answers: 1) A trigger is the event that starts the automation; an action is the work done after it fires. 2) So each run uses that row's specific details, like the person's name and email, instead of fixed text. 3) Google Sheets is a polling trigger, and on the free plan Zapier checks for new rows only about every 15 minutes. 4) It uses only one trigger and one action, which is what the free plan allows.*

---

## Project 2 (Module 2): Add Logic with Filters and Paths

**Time:** about 2 hours

**Goal:** Make an automation smart enough to decide, so it acts only when it should and differently in different cases.

**Why Make for this project:** In Zapier, Filters and Paths need a paid plan (or a trial). Make's free plan includes filters and routers (Make's version of Paths), so you build this project in Make. If you have a Zapier trial, you can rebuild it there afterwards to compare.

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

*Answers: 1) It lets data continue only when a condition is met, so the automation ignores items it should not act on. 2) A router splits a scenario into branches that run different modules; Zapier calls this Paths. 3) Zapier's free plan does not include Filters or Paths, while Make's free plan includes filters and routers. 4) A branch can work for one condition and silently fail for another, so each one needs its own test data.*

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

---

## Project 4 (Module 4): Automate with Webhooks and APIs

**Time:** about 2 hours

**Goal:** Connect to apps that do not have a ready-made integration, using webhooks and simple API calls.

**Why Make for this project:** Webhooks by Zapier is not available on Zapier's free plan. Make's Webhooks and HTTP modules are available on its free plan, so you build this in Make.

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

---

## Project 5 (Module 5): Automate a Real Business Process End to End

**Time:** about 3 to 4 hours

**Goal:** Combine your skills into one automation that runs a complete, realistic business process. Build it in Make, because it needs several steps, branching, and logging, which Zapier's free plan does not allow.

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
Free Zapier and Make plans have no built-in approval button, so use a sheet as the approval point. Scenario A sends the approver a Slack message or email with a link to the sheet, asking them to change `Status` to `Approved` or `Rejected`. Scenario B runs on a schedule (for example every 15 minutes): Google Sheets "Search Rows" finds rows where `Status` is `Approved` (or `Rejected`) and `Processed` is empty, runs the follow-up actions, then "Update a Row" sets `Processed` to `yes` so the row is not handled twice. You will need two active scenarios, so switch off older ones.

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
