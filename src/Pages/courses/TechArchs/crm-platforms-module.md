<!-- order: 10 -->
## Module: CRM Platforms (Low-Code / No-Code TechArchs)

**Time: about 6 hours** (roughly 2 hours per platform).

**By the end of this module, you'll be able to:**
- Set up HubSpot contacts, a company, a deal in a pipeline, tasks, and a dashboard
- Create a custom field in Salesforce and build a record-triggered flow that reacts to it
- Build a Zoho CRM workflow rule and a Blueprint that enforces an ordered process
- Explain the difference between a trigger-based workflow and an enforced process
- Compare HubSpot, Salesforce, and Zoho and name a good fit for each

**Purpose:** Build business solutions without extensive programming.

**Tools needed for this module:** A web browser and an email address to sign up for free tiers or trials — [HubSpot CRM](https://www.hubspot.com/products/crm) (free tier), a [Salesforce Trailhead Playground](https://trailhead.salesforce.com) (free sandbox org) or free trial, and [Zoho CRM](https://www.zoho.com/crm/) (free tier). No coding environment or installs are required, everything happens in the browser. You won't need all three set up at once, each topic only needs its own account.

### Topic 1: HubSpot

Time: about 2 hours

#### Concept

**HubSpot** started as marketing software and grew into a full CRM platform, which is why it's known for being approachable and tightly connecting marketing, sales, and service data in one place. Its low-code strength is the **visual workflow builder**, a drag-and-drop automation tool that lets non-developers set up multi-step processes (like lead follow-ups) without writing code.

- A **contact** is HubSpot's core record, a person, with three related record types you connect to it: **companies** (organizations), **deals** (possible sales), and **tickets** (support requests). Linking records is called an **association**
- A **property** is a field on a record (like email, lifecycle stage, or a custom field you define yourself)
- A **workflow** is an automation built from a trigger (like "form submitted") and a chain of actions (send email, update a property, notify a rep), all assembled visually. Full workflows need a paid plan (a Professional-level tier at the time of writing; check the current plan)
- A **pipeline** organizes deals or tickets into stages so progress is visible at a glance. HubSpot's default sales pipeline uses: Appointment Scheduled, Qualified to Buy, Presentation Scheduled, Decision Maker Bought-In, Contract Sent, Closed Won, and Closed Lost (you can rename or edit these)
- **Tasks** are to-dos (call, email, follow-up) with a due date and an owner, attached to a record, and **dashboards** group reports so a team can see deals and activity at a glance
- A **form** on your website creates or updates a **contact**, not a deal. On the free plan, deals are not created automatically; someone creates them by hand (or a paid workflow does it)

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#c2410c', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    C["<b>Contact</b><br/><br/>Person record<br/>with properties"]
    T["<b>Trigger</b><br/><br/>Form submitted /<br/>property changed"]
    W["<b>Workflow</b><br/><br/>Visual, drag-and-<br/>drop automation"]
    P["<b>Pipeline</b><br/><br/>Deal or ticket<br/>stages"]

    C ==> T ==> W ==> P

    style C fill:#c2410c,color:#fff,stroke:#7c2d12,stroke-width:4px
    style T fill:#EBEBEB,color:#1a202c,stroke:#c2410c,stroke-width:4px
    style W fill:#EBEBEB,color:#1a202c,stroke:#c2410c,stroke-width:4px
    style P fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- HubSpot's free tier is genuinely usable for small teams (contacts, companies, deals, tasks, forms, and basic dashboards), but workflow automation, custom reporting, and advanced permissions are gated behind paid tiers, a common low-code tradeoff between accessibility and depth
- Because marketing, sales, and service data live in the same contact record, a paid-tier workflow triggered by a marketing action (like a form fill) can update a sales pipeline without any integration work

#### Where you'd actually use this

Small to mid-sized teams that want marketing and sales in one system without hiring developers, especially ones that rely heavily on inbound leads (website forms, email signups) and want those leads automatically routed and nurtured.

#### Lab

1. **Create a free HubSpot account** at [hubspot.com](https://www.hubspot.com/products/crm) using a work or personal email.
2. **Create one company and three contacts.** Go to CRM > Companies and create a made-up company. Then go to CRM > Contacts and create three contacts with a first name, last name, email, and lifecycle stage. On each contact record, find the **Companies** card in the right sidebar, click **Add**, and associate the contact with your company.
3. **Create a deal in the default pipeline.** Go to CRM > Deals, create a deal, set yourself as **Deal owner**, and associate it with one of your contacts and the company. Switch to the board view and drag the deal from "Appointment Scheduled" to "Qualified to Buy" to "Presentation Scheduled" to see how stages track progress. Optional: to change the stage names, go to Settings > Objects > Deals > Pipelines and edit them.
4. **Create two tasks.** Open your deal, add a task called "Call customer" due today and one called "Send proposal" due tomorrow, both assigned to you. Check them under CRM > Tasks.
5. **Build a simple dashboard.** Go to Reporting > Dashboards, create a new dashboard, and add a few reports from the report library, such as deals by stage and tasks or activities. Exact report names change over time, and the free plan limits how many dashboards and reports you can have.
6. **Build a basic workflow (paid feature).** Workflows need a paid plan (check the current plan for which tier). If HubSpot offers you a free trial, you can start one (set a reminder to cancel it); otherwise, follow along by reading these steps. In Automation > Workflows, create a contact-based workflow, set the trigger to "lifecycle stage is set to Lead," and add one action: send an internal notification email to yourself. Enroll a test contact manually and confirm the notification fires.

#### Checkpoint
You have a company with associated contacts, a deal moving through HubSpot's default pipeline, tasks with owners and due dates, and a simple dashboard. You can explain what a workflow's trigger and actions are (and you built one if you had a trial), and why a form submission creates a contact but not a deal on the free plan.

#### Quiz
1. What is a "property" in HubSpot, and give one example?
2. What are the three related record types mentioned that a contact connects to?
3. What two parts make up a HubSpot workflow?
4. What is a pipeline used for?
5. Name one capability that's gated behind HubSpot's paid tiers.

*Answers: 1) A field on a record, such as email address, lifecycle stage, or a custom field you define yourself. 2) Companies, deals, and tickets. 3) A trigger (the event that starts it, like a form submission) and a chain of actions (like sending an email or updating a property). 4) Organizing deals or tickets into stages so progress is visible at a glance. 5) Workflow automation, custom reporting, or advanced permissions (any one of these is a valid answer).*

---

### Topic 2: Salesforce

Time: about 2 hours

#### Concept

**Salesforce** is the most established enterprise CRM platform, and its low-code layer is broader and more powerful than HubSpot's or Zoho's, which is also why it has a steeper learning curve. Its core low-code tools are **Flow Builder** (visual automation, replacing the older "Workflow Rules" and "Process Builder"), **Objects** (custom data structures you define without code), and **Page Layouts** (drag-and-drop screen design for how records appear to users).

- An **object** is Salesforce's term for a data table, **standard objects** (Contact, Account, Opportunity) come built in, **custom objects** are ones you create yourself
- A **field** is a column on an object, custom fields can be text, numbers, dates, dropdowns, or lookups to other objects
- **Flow Builder** lets you build automation visually: screen flows (guided forms for users), record-triggered flows (run automatically when a record changes), and scheduled flows
- An **Opportunity** is Salesforce's standard object for a potential sale, tracked through customizable **stages**, similar in purpose to a HubSpot deal

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#1d4ed8', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    O["<b>Object</b><br/><br/>Standard or<br/>custom data table"]
    F["<b>Field</b><br/><br/>Text, number,<br/>lookup, etc."]
    FL["<b>Flow Builder</b><br/><br/>Visual, record-<br/>triggered automation"]
    PL["<b>Page Layout</b><br/><br/>Drag-and-drop<br/>screen design"]

    O ==> F ==> FL
    O ==> PL

    style O fill:#1d4ed8,color:#fff,stroke:#1e3a8a,stroke-width:4px
    style F fill:#dbeafe,color:#1a202c,stroke:#1d4ed8,stroke-width:4px
    style FL fill:#dbeafe,color:#1a202c,stroke:#1d4ed8,stroke-width:4px
    style PL fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Because you can create entirely new objects (not just add fields to existing ones), Salesforce's low-code ceiling is much higher than HubSpot's or Zoho's, entire custom applications can be built without traditional code
- That same flexibility means Salesforce orgs can become complex quickly, larger teams often have a dedicated "Salesforce admin" role just to manage objects, flows, and permissions

#### Where you'd actually use this

Larger organizations with complex sales processes, multiple departments needing custom data structures, or companies that expect to eventually need deep customization or integration with other enterprise systems.

#### Lab

1. **Sign up for a free Trailhead Playground** through [trailhead.salesforce.com](https://trailhead.salesforce.com), a disposable sandbox org meant for learning.
2. **Explore the standard Opportunity object**, opening a sample record (or creating one) and reviewing its default fields and stage picklist.
3. **Create a custom field** on the Opportunity object (Setup > Object Manager > Opportunity > Fields), for example a checkbox called "Requires Manager Approval."
4. **Build a simple record-triggered flow** (in Setup, search "Flows" in Quick Find, then click New Flow and choose Record-Triggered Flow): choose the Opportunity object, trigger "A record is updated", entry condition "Requires Manager Approval" equals True, run "Only when a record is updated to meet the condition requirements", and optimize for "Actions and Related Records" (sending an email is not possible in the fast field-update mode). Then add one Action element, "Send Email", with your own address as the recipient and a short subject and body.
5. **Activate the flow, then test it** by ticking the checkbox on a sample Opportunity, saving, and confirming the email arrives.

#### Checkpoint
You have a custom field on a standard Salesforce object and a working record-triggered flow that reacts to a change on that field, and you can explain the difference between a standard and a custom object.

#### Quiz
1. What is the difference between a standard object and a custom object?
2. What is Flow Builder used for?
3. Name the three types of flows mentioned and what each is for.
4. What is a Page Layout used for?
5. Why do larger Salesforce orgs often have a dedicated admin role?

*Answers: 1) Standard objects (like Contact, Account, Opportunity) come built into Salesforce, custom objects are new data tables you create yourself. 2) Building automation visually, without code, including guided forms, record-triggered actions, and scheduled processes. 3) Screen flows (guided forms for users), record-triggered flows (run automatically when a record changes), and scheduled flows (run on a set schedule). 4) Drag-and-drop design of how a record's fields and related information appear to users on screen. 5) Because the platform's flexibility (custom objects, fields, flows, permissions) makes orgs complex quickly, requiring dedicated management as they grow.*

---

### Topic 3: Zoho CRM

Time: about 2 hours

#### Concept

**Zoho CRM** sits between HubSpot and Salesforce in complexity, it's part of a much larger suite of Zoho business apps (books, projects, forms, and more), and its low-code strength is how deeply and affordably it connects to those other apps. Its core automation tool is **Workflow Rules** paired with **Blueprint**, a visual tool for enforcing a specific multi-step process (like a required approval sequence) rather than just triggering side actions.

- A **module** is Zoho's term for a record type (Leads, Contacts, Deals, or a custom module you create)
- A **workflow rule** triggers actions (like field updates, emails, or tasks) based on a condition, similar in concept to HubSpot's workflows
- A **Blueprint** visually maps out a required process with stages a record must pass through in order, useful when a process (like an approval chain) must happen in a strict sequence, not just "if this, then that"
- **Zoho's app ecosystem** (Books for accounting, Forms for data capture, Desk for support) is designed to connect to CRM with minimal setup, since they're built by the same company

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#0f766e', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    M["<b>Module</b><br/><br/>Leads, Contacts,<br/>Deals, or custom"]
    WR["<b>Workflow Rule</b><br/><br/>Condition triggers<br/>an action"]
    BP["<b>Blueprint</b><br/><br/>Enforced, ordered<br/>process stages"]
    E["<b>Zoho Ecosystem</b><br/><br/>Books, Forms,<br/>Desk, etc."]

    M ==> WR
    M ==> BP
    BP ==> E

    style M fill:#0f766e,color:#fff,stroke:#134e4a,stroke-width:4px
    style WR fill:#F5F5F5,color:#1a202c,stroke:#0f766e,stroke-width:4px
    style BP fill:#F5F5F5,color:#1a202c,stroke:#0f766e,stroke-width:4px
    style E fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Blueprint's key difference from a simple workflow rule is enforcement, a record literally cannot skip a required stage, which matters for compliance-sensitive processes like loan approvals or refund sign-offs
- Zoho is generally the most budget-friendly of the three at comparable feature levels, a major reason smaller businesses and budget-conscious teams choose it over Salesforce

#### Where you'd actually use this

Small and mid-sized businesses that want CRM tightly bundled with other affordable business tools (accounting, support, forms) from a single vendor, or any team with a process that must be strictly enforced step-by-step, like a formal approval chain.

#### Lab

1. **Sign up for a free Zoho CRM account** at [zoho.com/crm](https://www.zoho.com/crm/). Workflow rules and Blueprint may not be included in the free edition (check the current plan page). If they aren't, start Zoho's free trial of a paid edition for steps 3 to 5, or follow along by reading them.
2. **Create a Lead record manually**, filling in name, company, and status, to see how a module's fields are structured.
3. **Create a workflow rule** (Setup > Automation > Workflow Rules): trigger it when a Lead's Lead Status is updated to "Pre-Qualified" (one of Zoho's default values; you can edit the list in the field's settings), with an action that sends a notification email.
4. **Build a simple Blueprint** (Setup > Process Management > Blueprint) on the Leads module, using the Lead Status field for its states, with three enforced stages (for example, "Not Contacted," "Contacted," "Pre-Qualified"), and set the transition into the last stage to require a mandatory field (such as a short note), so it must be filled before moving on.
5. **Walk a test Lead through the Blueprint**, attempting to skip a stage first to see it get blocked, then completing the required field and confirming it proceeds.

#### Checkpoint
You have a Zoho workflow rule that fires on a status change and a working Blueprint that enforces an ordered process, and you can explain the difference between the two.

#### Quiz
1. What is a "module" in Zoho CRM?
2. What is the key difference between a Workflow Rule and a Blueprint?
3. What kind of process is Blueprint especially suited for, and why?
4. Name two other apps in the Zoho ecosystem mentioned that connect to CRM.
5. What's a common reason smaller businesses choose Zoho over Salesforce?

*Answers: 1) Zoho's term for a record type, such as Leads, Contacts, Deals, or a custom module you create yourself. 2) A Workflow Rule triggers actions based on a condition (like HubSpot's workflows), while a Blueprint enforces a required, ordered sequence of stages that a record cannot skip. 3) Compliance-sensitive or strictly sequential processes, like approval chains or refund sign-offs, because Blueprint physically blocks skipping a required stage. 4) Books (accounting), Forms (data capture), and Desk (support) are all valid answers. 5) Zoho is generally the most budget-friendly option of the three at comparable feature levels.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "idcard",
   "kicker": "Module · CRM platforms",
   "title": "Three CRMs, one afternoon each",
   "beats": [
    {
     "say": "Welcome to C R M Platforms."
    },
    {
     "say": "You'll try three platforms in the browser, about two hours each: HubSpot, Salesforce and Zoho C R M."
    },
    {
     "say": "Each has its own low-code building blocks, and its own best fit."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Topic 1 · HubSpot",
   "title": "Everything hangs off the contact",
   "nodes": [
    {
     "id": "contact",
     "label": "Contact",
     "x": 50,
     "y": 50,
     "sub": "a person + properties",
     "art": "idcard"
    },
    {
     "id": "company",
     "label": "Company",
     "x": 15,
     "y": 22,
     "sub": "an organization",
     "art": "people"
    },
    {
     "id": "deal",
     "label": "Deal",
     "x": 85,
     "y": 22,
     "sub": "a possible sale",
     "art": "coin"
    },
    {
     "id": "ticket",
     "label": "Ticket",
     "x": 85,
     "y": 78,
     "sub": "a support request",
     "art": "chat"
    },
    {
     "id": "form",
     "label": "Website form",
     "x": 15,
     "y": 78,
     "sub": "inbound lead",
     "art": "form"
    }
   ],
   "edges": [
    {
     "from": "contact",
     "to": "company"
    },
    {
     "from": "contact",
     "to": "deal"
    },
    {
     "from": "contact",
     "to": "ticket"
    },
    {
     "from": "company",
     "to": "deal"
    },
    {
     "from": "form",
     "to": "contact"
    }
   ],
   "beats": [
    {
     "say": "HubSpot started as marketing software, and keeps marketing, sales and service data together.",
     "show": 1
    },
    {
     "say": "Its core record is the contact, a person. Each field, like email, is a property.",
     "on": "contact"
    },
    {
     "say": "It links to companies, deals and tickets. A link is called an association.",
     "show": 4,
     "on": [
      "company",
      "deal",
      "ticket"
     ]
    },
    {
     "say": "In the lab, you associate three contacts with a company.",
     "on": "company",
     "send": {
      "from": "contact",
      "to": "company",
      "label": "association"
     }
    },
    {
     "say": "A website form creates or updates a contact.",
     "show": 5,
     "on": "form",
     "send": {
      "from": "form",
      "to": "contact",
      "label": "new contact"
     }
    },
    {
     "say": "But not a deal. On the free plan, someone creates the deal by hand.",
     "on": "deal",
     "send": {
      "from": "contact",
      "to": "deal",
      "label": "deal, by hand"
     }
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Topic 1 · Lab",
   "title": "Drag a deal through the default pipeline",
   "values": [
    "Appointment",
    "Qualified",
    "Presentation",
    "Decision Maker",
    "Contract Sent",
    "Closed Won",
    "Closed Lost"
   ],
   "beats": [
    {
     "say": "A pipeline puts deals into stages. These are HubSpot's seven defaults."
    },
    {
     "say": "Your new deal starts in Appointment Scheduled.",
     "hl": 0,
     "ptr": {
      "deal": 0
     }
    },
    {
     "say": "On the board view, drag it to Qualified to Buy.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "deal": 1
     }
    },
    {
     "say": "Then to Presentation Scheduled. Progress is visible at a glance.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "deal": 2
     }
    },
    {
     "say": "Add two tasks: call customer, due today, and send proposal, due tomorrow.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "deal": 2
     },
     "note": "Tasks: Call customer · Send proposal"
    },
    {
     "say": "Every deal ends Closed Won or Closed Lost, and a dashboard report counts deals by stage.",
     "ok": [
      0,
      1
     ],
     "hl": [
      5,
      6
     ],
     "ptr": {
      "deal": 2
     },
     "note": "Dashboard: deals by stage"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Topic 1 · Workflows",
   "title": "A workflow is a trigger plus actions",
   "nodes": [
    {
     "id": "contact",
     "label": "Test contact",
     "x": 14,
     "y": 50,
     "sub": "enrolled manually",
     "art": "idcard"
    },
    {
     "id": "trigger",
     "label": "Trigger",
     "x": 50,
     "y": 50,
     "sub": "lifecycle = Lead",
     "art": "bolt"
    },
    {
     "id": "action",
     "label": "Action",
     "x": 86,
     "y": 50,
     "sub": "internal email to you",
     "art": "mail"
    }
   ],
   "edges": [
    {
     "from": "contact",
     "to": "trigger"
    },
    {
     "from": "trigger",
     "to": "action"
    }
   ],
   "beats": [
    {
     "say": "A workflow is a trigger plus actions. It needs a paid plan, so try a trial or read along.",
     "show": 3
    },
    {
     "say": "The trigger: lifecycle stage is set to Lead.",
     "on": "trigger"
    },
    {
     "say": "You enroll a test contact, and it meets the trigger.",
     "on": "contact",
     "send": {
      "from": "contact",
      "to": "trigger",
      "label": "stage: Lead"
     }
    },
    {
     "say": "So the action runs: an internal email to you.",
     "on": "action",
     "send": {
      "from": "trigger",
      "to": "action",
      "label": "notify"
     }
    },
    {
     "say": "Because marketing and sales share one record, no integration work is needed.",
     "on": [
      "contact",
      "trigger",
      "action"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Topic 2 · Salesforce",
   "title": "An object is a table; you can add your own fields",
   "columns": [
    "Opportunity field",
    "Type",
    "Origin"
   ],
   "rows": [
    [
     "Opportunity Name",
     "Text",
     "Standard"
    ],
    [
     "Account Name",
     "Lookup (Account)",
     "Standard"
    ],
    [
     "Close Date",
     "Date",
     "Standard"
    ],
    [
     "Stage",
     "Picklist",
     "Standard"
    ],
    [
     "Requires Mgr Approval",
     "Checkbox",
     "Custom"
    ]
   ],
   "beats": [
    {
     "say": "In Salesforce, an object is a table. Opportunity, a potential sale, is built in.",
     "sql": "Object: Opportunity (standard)"
    },
    {
     "say": "Its fields are columns. These are standard.",
     "sql": "Object: Opportunity (standard)",
     "hl": [
      0,
      1,
      2,
      3
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "A field can be a lookup to another object, like Account Name.",
     "sql": "Object: Opportunity (standard)",
     "hl": 1,
     "dim": true,
     "col": 1
    },
    {
     "say": "Stage is a picklist, much like a HubSpot pipeline.",
     "sql": "Object: Opportunity (standard)",
     "hl": 3,
     "dim": true,
     "col": 1
    },
    {
     "say": "In the lab, you add a custom checkbox: Requires Manager Approval.",
     "sql": "Setup > Object Manager >\nOpportunity > Fields",
     "hl": 4,
     "dim": true,
     "col": 2
    },
    {
     "say": "You can even create whole custom objects, which is why big orgs often need a Salesforce admin.",
     "sql": "Setup > Object Manager >\nOpportunity > Fields",
     "hl": 4
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Topic 2 · Lab",
   "title": "A record-triggered flow reacts to the checkbox",
   "nodes": [
    {
     "id": "you",
     "label": "You",
     "x": 12,
     "y": 30,
     "sub": "tick and save",
     "art": "cursor"
    },
    {
     "id": "opp",
     "label": "Opportunity",
     "x": 38,
     "y": 50,
     "sub": "a record is updated",
     "art": "database"
    },
    {
     "id": "flow",
     "label": "Flow",
     "x": 64,
     "y": 30,
     "sub": "entry condition",
     "art": "gear"
    },
    {
     "id": "mail",
     "label": "Send Email",
     "x": 90,
     "y": 50,
     "sub": "to your address",
     "art": "mail"
    }
   ],
   "edges": [
    {
     "from": "you",
     "to": "opp"
    },
    {
     "from": "opp",
     "to": "flow"
    },
    {
     "from": "flow",
     "to": "mail"
    }
   ],
   "beats": [
    {
     "say": "Flow Builder builds automation visually. This flow is record-triggered, on Opportunity.",
     "show": 4
    },
    {
     "say": "It runs when a record is updated and Requires Manager Approval is true.",
     "on": "flow"
    },
    {
     "say": "It's optimized for Actions and Related Records, because the fast mode can't send email.",
     "on": "flow"
    },
    {
     "say": "Activate it, then tick the box on an Opportunity and save.",
     "on": "you",
     "send": {
      "from": "you",
      "to": "opp",
      "label": "box = True"
     }
    },
    {
     "say": "The record now meets the condition.",
     "on": "flow",
     "send": {
      "from": "opp",
      "to": "flow",
      "label": "record updated"
     }
    },
    {
     "say": "So Send Email fires, and the email arrives.",
     "on": "mail",
     "send": {
      "from": "flow",
      "to": "mail",
      "label": "Send Email"
     }
    },
    {
     "say": "Save again with the box still ticked, and nothing fires: it runs only when the record changes to meet the condition.",
     "on": "opp"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Topic 3 · Zoho CRM",
   "title": "A Blueprint won't let a record skip a stage",
   "values": [
    "Not Contacted",
    "Contacted",
    "Pre-Qualified"
   ],
   "beats": [
    {
     "say": "In Zoho, a module is a record type, like Leads. This Blueprint uses Lead Status for three stages."
    },
    {
     "say": "Your test Lead starts at Not Contacted.",
     "hl": 0,
     "ptr": {
      "lead": 0
     }
    },
    {
     "say": "Try to jump to Pre-Qualified. It's blocked.",
     "hl": 0,
     "gone": [
      2
     ],
     "ptr": {
      "lead": 0
     },
     "note": "Skip blocked: Contacted comes first"
    },
    {
     "say": "So move it to Contacted first.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "lead": 1
     }
    },
    {
     "say": "Moving into Pre-Qualified needs a mandatory note.",
     "ok": [
      0
     ],
     "hl": [
      1,
      2
     ],
     "ptr": {
      "lead": 1
     },
     "note": "Required: a short note"
    },
    {
     "say": "With the note filled in, it moves on.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "lead": 2
     },
     "note": "Note added: moved on"
    },
    {
     "say": "A workflow rule only reacts to a change. It can't stop a skip. Blueprint enforces the order.",
     "ok": [
      0,
      1,
      2
     ],
     "ptr": {
      "lead": 2
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Compare",
   "title": "A good fit for each",
   "columns": [
    "Platform",
    "Low-code core",
    "Good fit"
   ],
   "rows": [
    [
     "HubSpot",
     "Workflows, pipelines",
     "Inbound leads"
    ],
    [
     "Salesforce",
     "Objects, Flow Builder",
     "Large, complex orgs"
    ],
    [
     "Zoho CRM",
     "Rules, Blueprint",
     "Budget, enforced steps"
    ]
   ],
   "beats": [
    {
     "say": "So which one fits?",
     "col": 1
    },
    {
     "say": "HubSpot is approachable, for small to mid-sized teams with inbound leads.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Salesforce has the highest ceiling, for large orgs with complex processes.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "Zoho is the most budget-friendly, bundled with apps like Books, Forms and Desk, and great for enforced processes.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "Whichever you pick, check which features need a paid tier.",
     "col": 2
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What's the key difference between a Zoho workflow rule and a Blueprint?",
   "options": [
    "A Blueprint only sends emails",
    "A workflow rule can't use conditions",
    "A Blueprint enforces ordered stages a record can't skip"
   ],
   "answer": 2,
   "good": "That's right. A workflow rule triggers actions on a condition, while a Blueprint enforces a required, ordered sequence of stages that a record cannot skip.",
   "bad": "Not quite. A workflow rule triggers actions on a condition, while a Blueprint enforces a required, ordered sequence of stages that a record cannot skip.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What's the key difference between a Zoho workflow rule and a Blueprint?",
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
     "HubSpot records, deal, tasks, dashboard",
     ""
    ],
    [
     "Salesforce field + record-triggered flow",
     ""
    ],
    [
     "Zoho workflow rule + Blueprint",
     ""
    ],
    [
     "You can explain each platform's building blocks",
     ""
    ],
    [
     "You can name a fit for each",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's the module.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have HubSpot contacts, a company, a deal in the pipeline, tasks and a dashboard,",
     "show": 1
    },
    {
     "say": "a Salesforce custom field with a working record-triggered flow,",
     "show": 2
    },
    {
     "say": "a Zoho workflow rule and a Blueprint that enforces an order,",
     "show": 3
    },
    {
     "say": "you can explain each platform's low-code building blocks,",
     "show": 4
    },
    {
     "say": "and name a reason to choose each one.",
     "show": 5
    },
    {
     "say": "You've finished C R M Platforms. Well done.",
     "show": 5
    }
   ]
  }
 ]
}
```

---

## Module Completion Checklist
- [ ] Created HubSpot contacts associated with a company, a deal in the default pipeline, tasks, and a simple dashboard, and built (or followed along with) a property-triggered workflow
- [ ] Created a custom field on a Salesforce standard object and a working record-triggered Flow
- [ ] Created a Zoho workflow rule and a Blueprint that enforces an ordered process
- [ ] Can explain the core low-code building blocks each platform uses (HubSpot's workflows, Salesforce's objects and Flow Builder, Zoho's modules and Blueprint)
- [ ] Can name one clear reason a team might choose each of the three CRM platforms over the other two
