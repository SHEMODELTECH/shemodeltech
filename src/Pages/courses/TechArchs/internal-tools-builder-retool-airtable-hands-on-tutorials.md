<!-- order: 4 -->
# Internal Tools Builder (Retool and Airtable): Hands-On Project Tutorials

This course turns each project into a step-by-step, hands-on build. You learn each idea at the moment you need it, while building the thing, and every project hands its result to the next one, ending in a real internal tool a team could use to run part of their work. Follow the projects in order.

---

## Project 1 (Module 1): Build a Database in Airtable

**Goal:** Create a structured, relational database that will power the tools you build later.

**Step 1: Create your Airtable account and a base.**
Go to airtable.com, sign up, and create a new base named `operations`. A base is a single database for a project, and this one gives every later tool a real place to read and write data.

**Step 2: Understand tables.**
A table holds one kind of record, like Customers or Orders, and a base can have several tables. Splitting data into clear tables is the foundation of a database that stays organised as it grows.

**Step 3: Create your first table and fields.**
Create a `Customers` table with fields for name (text), email (email), status (single select), and created (date). Correct field types let Airtable validate and filter your data automatically later.

**Step 4: Understand linked records.**
A linked record connects a row in one table to a row in another, like an Order linked to a Customer. Links are what make a database relational, so you never copy the same customer details into every order.

**Step 5: Create a linked Orders table.**
Create an `Orders` table with fields for order number, amount (currency), status, and a link to `Customers`. Orders that reference customers is the classic pattern behind almost every internal tool.

**Step 6: Understand views.**
A view is a saved way of looking at a table (filtered, sorted, or grouped) without changing the data. Views let one table serve many needs without duplicating anything.

**Step 7: Create useful views.**
Create an "Open orders" view filtered by status, a "This month" view filtered by date, and one grouped by customer. Well-chosen views are often half the value of an internal tool.

**Step 8: Add sample data.**
Add several customers and orders with realistic, varied values, so you can build and test tools against something that behaves like production.

### Final Project Structure
```text
operations (Airtable base)
│
├── Customers (name, email, status, created)
├── Orders (order#, amount, status, link -> Customers)
└── Views: Open orders, This month, Grouped by customer
```

### What You Learned
- ✅ What bases, tables, and fields are
- ✅ Choosing correct field types for validation
- ✅ Linking records for a relational database
- ✅ Creating filtered and grouped views
- ✅ Building a realistic sample dataset

### Portfolio Project
**Relational Airtable Database**: Designed a clean, relational database with linked tables, correct field types, and useful views.
**Skills:** Airtable, Data Modeling, Relational Databases, Views.

**Deliverable:** A relational Airtable base with linked tables and purpose-built views.

---

## Project 2 (Module 2): Automate and Compute Inside Airtable

**Goal:** Make your database do work for you with formulas, rollups, and automations.

**Step 1: Understand formula fields.**
A formula field calculates its value from other fields, like combining first and last name, or flagging overdue orders. Formulas remove manual calculation and keep derived values always correct.

**Step 2: Add a formula field.**
In `Orders`, add a formula field `is_overdue` that is true when the status is open and the date is old. Computed flags like this power the filters and alerts your tools rely on.

**Step 3: Understand rollups.**
A rollup summarises linked records, such as totalling all orders for a customer. Rollups turn relationships into insight without any manual tallying.

**Step 4: Add a rollup to Customers.**
In `Customers`, add a rollup `total_spent` that sums the amount of all linked orders. A per-customer total is exactly the kind of at-a-glance metric a tool should surface.

**Step 5: Understand Airtable automations.**
An automation runs actions when something happens in the base, like sending an email when a status changes. It handles routine reactions so team members do not have to remember to.

**Step 6: Build a status-change automation.**
Create an automation so that when an order's status becomes `shipped`, the customer gets an email. Automatic customer updates are a high-value feature that is otherwise easy to forget.

**Step 7: Understand data integrity.**
Data integrity means keeping data accurate and consistent, using required fields and validation. Tools built on inconsistent data produce wrong answers.

**Step 8: Add integrity safeguards.**
Make key fields required and use single-select options to prevent typos in status values. Constraining input at entry is far cheaper than cleaning bad data later.

### Final Project Structure
```text
Automated base
│
├── Orders.is_overdue (formula)
├── Customers.total_spent (rollup)
├── Automation: status = shipped -> email customer
└── Integrity: required fields + single-select statuses
```

### What You Learned
- ✅ Calculating values with formula fields
- ✅ Summarising linked data with rollups
- ✅ Building automations inside Airtable
- ✅ Protecting data integrity with constraints
- ✅ Turning a database into a reactive system

### Portfolio Project
**Smart, Automated Database**: Added formulas, rollups, automations, and integrity safeguards that make a database compute and react on its own.
**Skills:** Airtable Formulas, Rollups, Automations, Data Integrity.

**Deliverable:** An Airtable base that computes metrics, reacts to changes, and protects its own data quality.

---

## Project 3 (Module 3): Build Your First Retool App

**Goal:** Build a custom interface in Retool that reads from and writes to your Airtable data.

**Step 1: Create a free Retool account.**
Go to retool.com and sign up. Retool builds internal apps by dragging components onto a canvas and is the leading internal-tools platform, so these skills map directly to real jobs.

**Step 2: Understand resources.**
A resource is a connection to a data source, like your Airtable base or a database. Every Retool app reads and writes through resources.

**Step 3: Connect Airtable as a resource.**
Add an Airtable resource using your API key and base, so Retool can reach your data. Without this link, you are only designing an empty shell.

**Step 4: Understand queries.**
A query fetches or changes data through a resource, such as getting all open orders. Most of building a tool is writing the right queries.

**Step 5: Build a query and a table.**
Create a query that reads `Orders`, then drag a Table component and bind it to that query. A live table of real orders is the backbone of most internal tools.

**Step 6: Understand components.**
A component is a UI element like a table, button, form, or text, arranged on the canvas. Knowing the main ones lets you build almost any tool layout.

**Step 7: Add a detail panel.**
Add text and image components that show details of the row selected in the table. A master-detail layout (a list plus the selected item's details) is the most common internal-tool pattern.

**Step 8: Bind data with references.**
Binding connects a component to data using a reference like `{{ table1.selectedRow }}`. This is the core Retool skill, and it is how every component shows the right, live data.

### Final Project Structure
```text
Retool app 1
│
├── Resource: Airtable (operations base)
├── Query: get Orders
├── Table (bound to query)
└── Detail panel ({{ table.selectedRow }} fields)
```

### What You Learned
- ✅ What resources, queries, and components are
- ✅ Connecting Retool to a real data source
- ✅ Displaying live data in a table
- ✅ Building a master-detail layout
- ✅ Binding components to data with references

### Portfolio Project
**Live Internal Dashboard**: Built a Retool app connected to real data with a table and a master-detail view.
**Skills:** Retool, Data Binding, Internal Tools, Master-Detail UI.

**Deliverable:** A Retool app that displays live records with a working detail panel.

---

## Project 4 (Module 4): Add Actions That Write Data

**Goal:** Let users create, edit, and update records from your Retool app, safely.

**Step 1: Understand mutating queries.**
A mutating query changes data (create, update, delete), unlike a read query that only fetches. Mutating queries need more care because they change real records.

**Step 2: Build a form to edit a record.**
Add a Form with inputs bound to the selected order's fields (status, amount, notes). An edit form is the most common write feature, letting users correct records in place.

**Step 3: Create an update query.**
Create a query that updates the selected order with the form's values, triggered by a Save button. This turns user input into a real change in your Airtable data.

**Step 4: Trigger queries on events.**
Queries can run on events, like a button click or a successful save. Wiring the Save button to the update query is how a tool responds to users.

**Step 5: Handle success and failure.**
Set the query to show a success message and refresh the table on success, and an error message on failure. Clear feedback tells users their change worked and keeps the tool showing current data.

**Step 6: Build a create-record form.**
Add a second form and query to create a brand new order, so a team can run the whole workflow rather than only editing existing data.

**Step 7: Understand confirmation on destructive actions.**
A confirmation step asks the user to confirm before an irreversible action like delete. Deletes and bulk changes are dangerous, and confirmation prevents costly mistakes.

**Step 8: Add a guarded delete.**
Add a delete button with a confirmation dialog before the delete query runs. Guarding destructive actions protects real business data from a single misclick.

### Final Project Structure
```text
Write actions
│
├── Edit form -> update query (Save button)
├── Create form -> insert query
├── Success/failure messages + table refresh
└── Delete button -> confirmation -> delete query
```

### What You Learned
- ✅ The difference between read and mutating queries
- ✅ Building edit and create forms bound to data
- ✅ Triggering queries on events like button clicks
- ✅ Handling success and failure with feedback
- ✅ Guarding destructive actions with confirmation

### Portfolio Project
**Full CRUD Internal Tool**: Added safe create, edit, and delete actions so a team can run its workflow inside the tool.
**Skills:** Retool, CRUD, Event Handling, Safe Actions.

**Deliverable:** A Retool app where users can create, edit, and safely delete real records.

---

## Project 5 (Module 5): Add Access Control and Roles

**Goal:** Control who can see and do what, so the tool is safe to share across a team.

**Step 1: Understand roles and permissions.**
A role is a group of users, like admin or viewer, and permissions decide what each role can do. Roles let you set access once per group instead of per person.

**Step 2: Understand user identity in Retool.**
Retool knows the current user and their role, which you can reference in the app. This is how one app can behave differently for admins and everyone else.

**Step 3: Hide admin controls from non-admins.**
Set the delete button and sensitive fields to be visible only when the current user is an admin. Hiding dangerous controls from most users prevents accidents and keeps their view simple.

**Step 4: Understand hiding versus enforcing.**
Hiding a control in the UI is not the same as blocking the action at the data layer. A truly safe tool restricts what each role can do at the source, not just what they can see.

**Step 5: Restrict queries by role.**
Configure permissions so only admins can run destructive or sensitive queries. Enforcing limits on the queries themselves is what actually protects data.

**Step 6: Build a role-aware view.**
Show a manager summary to admins and a simpler task list to regular users, in the same app. One app that adapts to each role is cheaper to maintain than separate tools.

**Step 7: Understand audit trails.**
An audit trail records who changed what and when. When something goes wrong in a shared tool, it is how you find out what happened and by whom.

**Step 8: Add basic logging of changes.**
Log key actions, such as who updated or deleted an order and when, to an Airtable log table. A simple change log gives you accountability and makes the tool trustworthy for a team.

### Final Project Structure
```text
Access control
│
├── Roles: admin, member
├── Admin-only controls (delete, sensitive fields) hidden + enforced
├── Role-restricted queries
├── Role-aware views (admin summary vs member tasks)
└── Change log table (who/what/when)
```

### What You Learned
- ✅ What roles and permissions are
- ✅ Referencing the current user and role
- ✅ The difference between hiding and enforcing access
- ✅ Restricting sensitive queries by role
- ✅ Adding audit logging for accountability

### Portfolio Project
**Role-Based Team Tool**: Added roles, enforced permissions, role-aware views, and audit logging so a tool is safe for a whole team.
**Skills:** Access Control, Roles and Permissions, Retool, Auditing.

**Deliverable:** An internal tool with real role-based access control and a change log.

---

## Project 6 (Module 6): Polish, Deploy, and Onboard the Team

**Goal:** Turn a working tool into a polished, deployed product the team actually adopts.

**Step 1: Understand layout and usability.**
Good layout groups related controls, guides the eye, and reduces the clicks needed to finish a task. A cluttered tool slows people down and gets abandoned.

**Step 2: Organise the interface.**
Group the app into clear sections or tabs, such as Orders, Customers, and Reports. Sectioning matches how people think about their work and keeps a growing tool navigable.

**Step 3: Add helpful states.**
Add empty states, loading indicators, and clear labels throughout. These small touches remove confusion and make the tool feel finished.

**Step 4: Understand environments.**
Many teams keep a staging environment for testing and a production one for real use. Separating them means you can improve the tool without risking the data the team depends on.

**Step 5: Deploy and share the app.**
Publish the app and share it with the intended users, respecting their roles. Sharing by role keeps access correct from day one.

**Step 6: Write user documentation.**
Create a short guide covering what the tool does, how to do each common task, and who to ask for help. Documentation lowers the barrier to adoption and cuts support questions.

**Step 7: Run an onboarding walkthrough.**
Walk the team through the tool with a real task each person will do. People adopt a tool far faster once they have done a real task in it with guidance.

**Step 8: Gather feedback and iterate once.**
Collect the team's first reactions and make one round of improvements. The first week of real use reveals the highest-value fixes.

### Final Project Structure
```text
Deployed tool
│
├── Clear layout (sections / tabs)
├── Empty, loading, and labelled states
├── Staging vs production
├── Deployed and shared by role
├── user_guide.md
└── Onboarding walkthrough + one iteration
```

### What You Learned
- ✅ Designing clear, usable layouts
- ✅ Adding empty, loading, and labelled states
- ✅ Using staging and production environments
- ✅ Deploying and sharing a tool by role
- ✅ Documenting, onboarding, and iterating for adoption

### Portfolio Project
**Deployed, Adopted Internal Tool**: Polished, deployed, documented, and onboarded a team onto a tool they can use daily.
**Skills:** UX, Deployment, Technical Writing, Onboarding, Retool.

**Deliverable:** A polished, deployed internal tool with user documentation and a completed onboarding.

---

## Final Capstone: Build a Complete Internal Tool for a Real Team Process

**Goal:** Combine every project into one internal tool that runs a real team process. This is an integration exercise, not new material.

**Step 1: Choose a real team process.**
Pick one: order management, applicant tracking, inventory, support ticket handling, or content approvals. A recognisable process makes your capstone instantly understandable to an employer.

**Step 2: Design the database.**
Using your Project 1 and 2 skills, model the tables, links, formulas, and automations the process needs. A clean, computed database is the foundation the whole tool stands on.

**Step 3: Build the core app.**
Using your Project 3 and 4 skills, build the Retool interface with live data, master-detail views, and full create, edit, and delete.

**Step 4: Add access control.**
Using your Project 5 skills, add roles, enforced permissions, role-aware views, and audit logging, so the tool is safe for a whole team.

**Step 5: Polish and deploy.**
Using your Project 6 skills, organise the layout, add helpful states, deploy, and document it.

**Step 6: Onboard and gather results.**
Onboard the intended users and note the time or errors the tool saves. Real adoption and a concrete result are the most convincing proof of your work.

**Step 7: Write the capstone summary.**
Summarise the process, the data model, the features, the roles, and the impact, with screenshots. This is what you hand an employer to prove the tool is real and yours.

### Final Project Structure
```text
capstone_tool
│
├── Airtable database (tables, links, formulas, automations)
├── Retool app (live data, master-detail, full CRUD)
├── Access control (roles, permissions, audit log)
├── Polished layout + deployed + documented
├── Onboarding + measured impact
└── capstone_summary.md (process, model, features, roles, impact)
```

### What You Learned
- ✅ Turning a real team process into a custom internal tool
- ✅ Combining a smart database with a full-featured app
- ✅ Securing a tool with roles, permissions, and auditing
- ✅ Deploying, documenting, and driving adoption
- ✅ Shipping a complete, impactful internal tool

### Portfolio Project
**Complete Internal Tool (Capstone)**: Designed the database, built the app, secured it with roles, deployed it, and onboarded a team onto a custom tool that runs a real process.
**Skills:** Airtable, Retool, Data Modeling, CRUD, Access Control, Auditing, Deployment, No-Code Development.

**Deliverable:** A complete, deployed, role-secured internal tool that runs a real team process, plus a summary of its impact.
