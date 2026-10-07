<!-- order: 11 -->
# Internal Tools Builder (Retool and Airtable): Hands-On Project Tutorials

This course turns each project into a step-by-step, hands-on build. You learn each idea at the moment you need it, while building the thing, and every project hands its result to the next one, ending in a real internal tool a team could use to run part of their work. Follow the projects in order.

**Plan check:** The core of this course works on Airtable's free plan and Retool's free plan. On the free plans at the time of writing (2026), Airtable limits records per base and automation runs per month, and Retool limits the number of users you can invite; check each company's current pricing page, because limits change. These parts need a paid Retool plan and are concept-only or optional on free: restricting query permissions by role (Project 5, Step 5) and separate staging and production environments (Project 6, Step 4). The free path shows you how to build role-aware views with the current user's email instead.

---

## Project 1 (Module 1): Build a Database in Airtable

**Goal:** Create a structured, relational database that will power the tools you build later.

**Time:** about 1.5 hours

**Step 1: Create your Airtable account and a base.**
Go to airtable.com, sign up for a free account, and create a new base named `operations`. A base is a single database for a project, and this one gives every later tool a real place to read and write data.

**Step 2: Understand tables.**
A table holds one kind of record, like Customers or Orders, and a base can have several tables. Splitting data into clear tables is the foundation of a database that stays organised as it grows.

**Step 3: Create your first table and fields.**
Create a `Customers` table with fields for name (single line text), email (email), status (single select), and created (date). Correct field types let Airtable check and filter your data automatically later.

**Step 4: Understand linked records.**
A linked record connects a row in one table to a row in another, like an Order linked to a Customer. Links are what make a database relational, so you never copy the same customer details into every order.

**Step 5: Create a linked Orders table.**
Create an `Orders` table with these fields:
- `order_number` (single line text, the first column)
- `amount` (currency)
- `status` (single select with the options `open`, `shipped`, `cancelled`)
- `order_date` (date)
- `notes` (long text)
- `customer` (link to another record, linked to `Customers`)

Orders that reference customers is the classic pattern behind almost every internal tool, and `order_date` is what later steps use to find recent and overdue orders.

**Step 6: Understand views.**
A view is a saved way of looking at a table (filtered, sorted, or grouped) without changing the data. Views let one table serve many needs without duplicating anything.

**Step 7: Create useful views.**
In `Orders`, create three grid views: "Open orders" filtered to status is `open`; "This month" filtered so `order_date` is within the current month (use the date filter's "is within" options); and "By customer" grouped by `customer`. Well-chosen views are often half the value of an internal tool.

**Step 8: Add sample data.**
Add several customers and about ten orders with realistic, varied values: different statuses, amounts, and order dates (include a few open orders dated more than two weeks ago). This lets you build and test tools against something that behaves like real data.

### Project Structure
```text
operations (Airtable base)
│
├── Customers (name, email, status, created)
├── Orders (order_number, amount, status, order_date, notes, customer -> Customers)
└── Views: Open orders, This month, By customer
```

### What You Learned
- ✅ What bases, tables, and fields are
- ✅ Choosing correct field types
- ✅ Linking records for a relational database
- ✅ Creating filtered and grouped views
- ✅ Building a realistic sample dataset

### Portfolio Project
**Relational Airtable Database**: Designed a clean, relational database with linked tables, correct field types, and useful views.
**Skills:** Airtable, Data Modeling, Relational Databases, Views.

**Deliverable:** A relational Airtable base with linked tables and purpose-built views.

### Quiz

1. Why link Orders to Customers instead of typing the customer's details into each order?
2. Does creating a filtered view delete or change any records?
3. Why is `status` a single select field rather than free text?
4. Which Orders field does the "This month" view depend on?

*Answers: 1) Linking keeps each customer's details in one place, so they are never duplicated or out of sync. 2) No, a view only changes how the table is displayed, not the data. 3) A fixed list of options prevents typos and makes filtering by status reliable. 4) The order_date date field.*

---

## Project 2 (Module 2): Automate and Compute Inside Airtable

**Goal:** Make your database do work for you with formulas, rollups, and automations.

**Time:** about 2 hours

**Step 1: Understand formula fields.**
A formula field calculates its value from other fields, like combining first and last name, or flagging overdue orders. Formulas remove manual calculation and keep derived values always correct.

**Step 2: Add a formula field.**
In `Orders`, add a formula field `is_overdue` with this formula:

```text
AND({status} = "open", DATETIME_DIFF(TODAY(), {order_date}, 'days') > 14)
```

It shows 1 for open orders placed more than 14 days ago and 0 otherwise. Computed flags like this power the filters and alerts your tools rely on.

**Step 3: Understand rollups.**
A rollup summarises linked records, such as totalling all orders for a customer. Rollups turn relationships into insight without any manual tallying.

**Step 4: Add a rollup to Customers.**
In `Customers`, add a rollup field `total_spent` that uses the linked Orders, the `amount` field, and the summary function `SUM(values)`. A per-customer total is exactly the kind of at-a-glance metric a tool should surface.

**Step 5: Understand Airtable automations.**
An automation runs actions when something happens in the base, like sending an email when a status changes. It handles routine reactions so team members do not have to remember to. The free plan limits automation runs per month (check the current plan page), which is plenty for testing.

**Step 6: Build a status-change automation.**
First, in `Orders`, add a lookup field `customer_email` that looks up `email` through the `customer` link. Then open Automations and create one: trigger "When a record matches conditions" (table Orders, status is `shipped`), action "Send email" with the To address set to the trigger record's `customer_email`, and a short subject and message that include the order number. Use your own email on a test customer, test it, and turn it on. Automatic customer updates are a high-value feature that is otherwise easy to forget.

**Step 7: Understand data integrity.**
Data integrity means keeping data accurate and consistent, using validation and constrained choices. Tools built on inconsistent data produce wrong answers.

**Step 8: Add integrity safeguards.**
Use single-select options (as you did for `status`) to prevent typos. Note that Airtable cannot make a field "required" in the grid itself; required fields are set in a form view (create a Form view on Orders and mark `order_number`, `amount`, and `customer` as required), and in Project 4 you will also mark the matching inputs as required in Retool. Constraining input at entry is far cheaper than cleaning bad data later.

### Project Structure
```text
Automated base
│
├── Orders.is_overdue (formula on status + order_date)
├── Orders.customer_email (lookup)
├── Customers.total_spent (rollup)
├── Automation: status = shipped -> email customer
└── Integrity: single-select statuses + required fields in the Orders form view
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

### Quiz

1. What does the `is_overdue` formula check?
2. What is the difference between a lookup and a rollup?
3. Why did you add the `customer_email` lookup before building the email automation?
4. Where can you make a field required in Airtable?

*Answers: 1) That the order's status is open and its order_date is more than 14 days before today. 2) A lookup pulls a field's values from linked records; a rollup summarises them, for example with a sum. 3) The email address lives in Customers, so the automation needs it on the Order record to use as the To address. 4) In a form view's field settings, not in the grid itself.*

---

## Project 3 (Module 3): Build Your First Retool App

**Goal:** Build a custom interface in Retool that reads from and writes to your Airtable data.

**Time:** about 2 hours

**Step 1: Create a free Retool account.**
Go to retool.com and sign up for the free plan. Retool builds internal apps by dragging components onto a canvas and connecting them to your data. Create a new app named `operations-tool`.

**Step 2: Understand resources.**
A resource is a saved connection to a data source, like your Airtable base or a database. Every Retool app reads and writes through resources, and the resource holds the credentials so they never appear in your app.

**Step 3: Connect Airtable as a resource.**
Airtable retired its old API keys in February 2024, so you connect with a Personal Access Token (PAT) instead. In Airtable, open the Builder hub (airtable.com/create/tokens) and create a token with the scopes `data.records:read`, `data.records:write`, and `schema.bases:read`, and under Access add only your `operations` base. Copy the token once and keep it private: never paste it into a query, a component, or a shared doc. In Retool, go to Resources, create an Airtable resource, and paste the token into its token/API key field. Without this link, you are only designing an empty shell.

**Step 4: Understand queries.**
A query fetches or changes data through a resource, such as getting all open orders. Most of building a tool is writing the right queries.

**Step 5: Build a query and a table.**
In your app, create a query named `getOrders` using the Airtable resource, action "List records", with your base and table `Orders`, and run it. Drag a Table component onto the canvas and set its data to `{{ getOrders.data.records.map(r => ({ id: r.id, ...r.fields })) }}`, which turns each Airtable record into one row with its id plus its fields. A live table of real orders is the backbone of most internal tools.

**Step 6: Understand components.**
A component is a UI element like a table, button, form, or text, arranged on the canvas. Knowing the main ones lets you build almost any tool layout.

**Step 7: Add a detail panel.**
Add a Container beside the table with Text components that show the selected order's number, amount, status, order date, and notes. A master-detail layout (a list plus the selected item's details) is the most common internal-tool pattern.

**Step 8: Bind data with references.**
Binding connects a component to data using a reference in double curly braces. Set the Text components to values like `{{ table1.selectedRow.order_number }}` and `{{ table1.selectedRow.amount }}` (use your table's actual name if it is not `table1`). This is the core Retool skill, and it is how every component shows the right, live data.

### Project Structure
```text
Retool app: operations-tool
│
├── Resource: Airtable (Personal Access Token, operations base only)
├── Query: getOrders (List records, Orders)
├── Table (bound to getOrders)
└── Detail panel ({{ table1.selectedRow.<field> }} values)
```

### What You Learned
- ✅ What resources, queries, and components are
- ✅ Connecting Retool to Airtable securely with a scoped token
- ✅ Displaying live data in a table
- ✅ Building a master-detail layout
- ✅ Binding components to data with references

### Portfolio Project
**Live Internal Dashboard**: Built a Retool app connected to real data with a table and a master-detail view.
**Skills:** Retool, Data Binding, Internal Tools, Master-Detail UI.

**Deliverable:** A Retool app that displays live records with a working detail panel.

### Quiz

1. Why does Retool connect to Airtable with a Personal Access Token rather than an API key?
2. Why limit the token's scopes and give it access to only the `operations` base?
3. What is the difference between a resource and a query?
4. What does `{{ table1.selectedRow.amount }}` show?

*Answers: 1) Airtable retired API keys in February 2024; Personal Access Tokens are the supported way to connect. 2) If the token leaks, it can only do the few things you allowed on that one base, limiting the damage. 3) A resource is the saved connection to a data source; a query uses that connection to fetch or change specific data. 4) The amount field of whichever row is currently selected in the table.*

---

## Project 4 (Module 4): Add Actions That Write Data

**Goal:** Let users create, edit, and update records from your Retool app, safely.

**Time:** about 2.5 hours

**Step 1: Understand mutating queries.**
A mutating query changes data (create, update, delete), unlike a read query that only fetches. Mutating queries need more care because they change real records.

**Step 2: Build a form to edit a record.**
Add a Form with inputs for status (a Select with the options `open`, `shipped`, `cancelled`), amount (a Number input), and notes (a Text area). Set each input's default value from the selected row, for example `{{ table1.selectedRow.status }}`. In each important input's settings, turn on Required under validation, so the form cannot be submitted with it empty. An edit form is the most common write feature, letting users correct records in place.

**Step 3: Create an update query.**
Create a query `updateOrder` with action "Update record" on `Orders`, the record ID set to `{{ table1.selectedRow.id }}`, and the fields set from the form inputs (status, amount, notes). This turns user input into a real change in your Airtable data.

**Step 4: Trigger queries on events.**
Queries can run on events, like a button click or a form submit. Add an event handler to the form's Submit event (or a Save button's Click event) that runs `updateOrder`. This is how a tool responds to users.

**Step 5: Handle success and failure.**
On `updateOrder`, add a success event handler that shows a notification ("Order saved") and triggers `getOrders` to refresh the table, and a failure handler that shows an error notification. Clear feedback tells users their change worked and keeps the tool showing current data.

**Step 6: Build a create-record form.**
Add a second form and a query `createOrder` with action "Create record" on `Orders`, including order number, amount, status, order date, and the linked customer, so a team can run the whole workflow rather than only editing existing data. Refresh `getOrders` on success.

**Step 7: Understand confirmation on destructive actions.**
A confirmation step asks the user to confirm before an irreversible action like delete. Deletes and bulk changes are dangerous, and confirmation prevents costly mistakes.

**Step 8: Add a guarded delete.**
Create a query `deleteOrder` with action "Delete record" and the record ID `{{ table1.selectedRow.id }}`. In the query's settings, turn on the option to show a confirmation modal before running, with a message like "Delete this order? This cannot be undone." Add a Delete button that runs `deleteOrder`, and refresh `getOrders` on success. Guarding destructive actions protects real business data from a single misclick.

### Project Structure
```text
Write actions
│
├── Edit form (required inputs) -> updateOrder (Update record)
├── Create form -> createOrder (Create record)
├── Success/failure notifications + getOrders refresh
└── Delete button -> confirmation modal -> deleteOrder (Delete record)
```

### What You Learned
- ✅ The difference between read and mutating queries
- ✅ Building edit and create forms bound to data, with required inputs
- ✅ Triggering queries on events like button clicks
- ✅ Handling success and failure with feedback
- ✅ Guarding destructive actions with confirmation

### Portfolio Project
**Full CRUD Internal Tool**: Added safe create, edit, and delete actions so a team can run its workflow inside the tool.
**Skills:** Retool, CRUD, Event Handling, Safe Actions.

**Deliverable:** A Retool app where users can create, edit, and safely delete real records.

### Quiz

1. What makes a query "mutating"?
2. Why does the update query need `{{ table1.selectedRow.id }}`?
3. Why run `getOrders` after a successful save?
4. How do you make Retool ask for confirmation before deleting?

*Answers: 1) It changes data by creating, updating, or deleting records, instead of only reading. 2) The record ID tells Airtable exactly which record to change. 3) So the table shows the current data, including the change just made. 4) Turn on the query's confirmation-modal setting so it asks before running the delete.*

---

## Project 5 (Module 5): Add Access Control and Roles

**Goal:** Control who can see and do what, so the tool is safer to share across a team.

**Time:** about 2 hours

**Step 1: Understand roles and permissions.**
A role is a group of users, like admin or viewer, and permissions decide what each role can do. Roles let you set access once per group instead of per person.

**Step 2: Understand user identity in Retool.**
Retool knows who is using the app through `current_user`, for example `{{ current_user.email }}`. You can reference it anywhere in the app, which is how one app can behave differently for admins and everyone else.

**Step 3: Hide admin controls from non-admins.**
Free path: in the Code panel, create a Variable named `adminEmails` and set its initial value to a list of admin emails.

Template: replace the email with your own.
```text
["you@example.com"]
```

Then set the Delete button's Hidden property to `{{ !adminEmails.value.includes(current_user.email) }}`. Do the same for any sensitive fields. Hiding dangerous controls from most users prevents accidents and keeps their view simple.

**Step 4: Understand hiding versus enforcing.**
Hiding a control in the UI is not the same as blocking the action at the data layer. A truly safe tool restricts what each role can do at the source, not just what they can see. The hiding you did in Step 3 is a convenience, not a security control.

**Step 5: Restrict queries by role (concept only on free).**
In Retool, controlling which permission groups can use resources or run queries needs a paid plan, so on the free plan treat this step as concept-only. Understand the idea: an admin-only permission group would be allowed to use the resource that can delete, while other users get a resource connected with a read-only Airtable token (`data.records:read` only). Enforcing limits where the data is accessed is what actually protects data. On free, you can add a second safeguard by setting `deleteOrder`'s "Disable query" option to `{{ !adminEmails.value.includes(current_user.email) }}`, but remember this still runs in the browser and is not true enforcement.

**Step 6: Build a role-aware view.**
Show a manager summary to admins (for example, Statistic components with total open orders and overdue count) and a simpler task list to everyone else, in the same app, using the same `adminEmails` check in each container's Hidden property. One app that adapts to each role is cheaper to maintain than separate tools.

**Step 7: Understand audit trails.**
An audit trail records who changed what and when. When something goes wrong in a shared tool, it is how you find out what happened and by whom.

**Step 8: Add basic logging of changes.**
In Airtable, create a `Change log` table with fields `action` (single line text), `order_number` (single line text), `user_email` (email), and `logged_at` (created time). In Retool, create a query `logChange` with action "Create record" on that table, setting `user_email` to `{{ current_user.email }}` and the order number from the selected row. Run it from the success handlers of `updateOrder` (action "update") and `deleteOrder` (action "delete"). A simple change log gives you accountability and makes the tool more trustworthy for a team.

### Project Structure
```text
Access control
│
├── adminEmails variable + current_user.email check
├── Admin-only controls (delete, sensitive fields) hidden
├── Role-restricted queries (concept only on free; paid Retool plan)
├── Role-aware views (admin summary vs member list)
└── Change log table (who / what / when) written by logChange
```

### What You Learned
- ✅ What roles and permissions are
- ✅ Referencing the current user in an app
- ✅ The difference between hiding and enforcing access
- ✅ How query permissions by role work, and why they need a paid plan
- ✅ Adding audit logging for accountability

### Portfolio Project
**Role-Aware Team Tool**: Added role-aware views, admin-only controls, and audit logging, and documented how permissions would be enforced on a paid plan.
**Skills:** Access Control, Roles and Permissions, Retool, Auditing.

**Deliverable:** An internal tool with role-aware views, hidden admin controls, and a change log.

### Quiz

1. How does the free path decide whether the current user is an admin?
2. Why is hiding the Delete button not real security?
3. What would truly enforce that only admins can delete?
4. What three things does an audit trail record?

*Answers: 1) It checks whether current_user.email is in the adminEmails list. 2) It only changes what is shown in the browser; the action could still be run another way unless it is blocked where the data is accessed. 3) Restricting the delete at the data layer, such as permission groups on resources or queries (a paid Retool feature) or a read-only token for non-admins. 4) Who made a change, what changed, and when.*

---

## Project 6 (Module 6): Polish, Deploy, and Onboard the Team

**Goal:** Turn a working tool into a polished, shared product the team actually adopts.

**Time:** about 2.5 hours

**Step 1: Understand layout and usability.**
Good layout groups related controls, guides the eye, and reduces the clicks needed to finish a task. A cluttered tool slows people down and gets abandoned.

**Step 2: Organise the interface.**
Group the app into clear sections or tabs, such as Orders, Customers, and Reports. Sectioning matches how people think about their work and keeps a growing tool navigable.

**Step 3: Add helpful states.**
Add empty states, loading indicators, and clear labels throughout. These small touches remove confusion and make the tool feel finished.

**Step 4: Understand environments (concept only on free).**
Many teams keep a staging environment for testing and a production one for real use. Separating them means you can improve the tool without risking the data the team depends on. Retool's multiple environments need a paid plan, so on free treat this as concept-only. A free-plan habit that gives you part of the benefit: make a copy of your Airtable base as `operations-test` and try risky changes against it first.

**Step 5: Release and share the app.**
Release (publish) your app so users see a stable version, then invite your test users from Retool's settings. The free plan limits how many users you can invite (check the current plan page), so a small team or a few classmates is ideal. Make sure the admin emails in `adminEmails` match the people who should see admin controls.

**Step 6: Write user documentation.**
Create a short guide covering what the tool does, how to do each common task, and who to ask for help. Documentation lowers the barrier to adoption and cuts support questions.

**Step 7: Run an onboarding walkthrough.**
Walk your test users through the tool with a real task each person will do. People adopt a tool far faster once they have done a real task in it with guidance.

**Step 8: Gather feedback and iterate once.**
Collect first reactions and make one round of improvements. The first week of real use reveals the highest-value fixes.

### Project Structure
```text
Deployed tool
│
├── Clear layout (sections / tabs)
├── Empty, loading, and labelled states
├── Staging vs production (concept only on free; test base copy instead)
├── Released and shared with a few users
├── user_guide.md
└── Onboarding walkthrough + one iteration
```

### What You Learned
- ✅ Designing clear, usable layouts
- ✅ Adding empty, loading, and labelled states
- ✅ What staging and production environments are for
- ✅ Releasing and sharing a tool with the right people
- ✅ Documenting, onboarding, and iterating for adoption

### Portfolio Project
**Deployed Internal Tool**: Polished, released, documented, and onboarded test users onto a tool they can use for real tasks.
**Skills:** UX, Deployment, Technical Writing, Onboarding, Retool.

**Deliverable:** A polished, shared internal tool with user documentation and a completed onboarding.

### Quiz

1. Why group an internal tool into sections or tabs?
2. What is the purpose of separate staging and production environments?
3. On the free plan, what simple habit gives you some of that protection?
4. Why onboard people with a real task instead of a feature tour?

*Answers: 1) It matches how people think about their work and keeps a growing tool easy to navigate. 2) You can test changes safely without risking the real data the team depends on. 3) Test risky changes against a copy of the Airtable base before touching the real one. 4) People adopt a tool much faster once they have completed a real task in it with guidance.*
