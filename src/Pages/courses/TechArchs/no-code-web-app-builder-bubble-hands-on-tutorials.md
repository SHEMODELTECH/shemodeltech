<!-- order: 1 -->
# No-Code Web App Builder (Bubble): Hands-On Project Tutorials

This course turns each project into a step-by-step, hands-on build. You learn each idea at the moment you need it, while building the thing, and every project hands its result to the next one, ending in a working web app you can show anyone. Follow the projects in order.

---

## Project 1 (Module 1): Set Up Your First Bubble App and Page

**Goal:** Get a real Bubble app running with a page you designed, so every later project has a home.

**Step 1: Create your Bubble account and app.**
Go to bubble.io, sign up, and click Create an app. Give it a clear name like `task-tracker`. Everything in this course lives inside this one app, and it gives you a live URL from day one.

**Step 2: Get to know the editor.**
The Bubble editor is where you build. It has a visual canvas in the middle, an elements panel on the left, and tabs across the top: Design controls how a page looks, Workflow controls what it does, and Data controls what it stores. Knowing which tab does what will save you a lot of time.

**Step 3: Understand pages.**
A page is one screen of your app, reached by its own URL. Your app starts with an `index` page, which is the home screen. Naming and organising your pages early keeps a growing app easy to follow.

**Step 4: Place your first elements.**
From the left panel, drag a Text element and a Button onto the canvas, then double-click the Text and change it to `My Task Tracker`. Elements are the visible building blocks of every screen.

**Step 5: Build inside a responsive layout.**
A responsive layout rearranges elements to fit any screen size, from phone to desktop. In Bubble you get this by placing elements inside containers set to a row or column layout, rather than pinning them to fixed positions.

**Step 6: Group elements into a container.**
Select your Text and Button, right-click, and choose Group elements in a Container, then set the container to Column layout. Containers are how you control spacing and keep a layout from breaking on smaller screens.

**Step 7: Preview your app live.**
Click Preview in the top right. Your page opens in a new tab at a real bubbleapps.io URL. Building and previewing in a tight loop lets you catch layout problems while they are still small.

**Step 8: Document your app structure.**
In a notes doc, write your app name, its URL, and the pages you plan to build, and keep it updated as you go. A simple one-page map keeps a growing project from turning into a maze of unnamed pages.

### Final Project Structure
```text
task-tracker (Bubble app)
│
├── index (page)  ->  Text + Button in a Column container
└── app_notes.md  ->  app name, URL, planned pages
```

### What You Learned
- ✅ Creating a Bubble app and understanding the editor tabs
- ✅ What pages, elements, and containers are
- ✅ Building inside a responsive layout instead of fixed positions
- ✅ Previewing an app on a live URL
- ✅ Keeping a simple map of your app's structure

### Portfolio Project
**Bubble App Foundation**: Set up a live no-code web app with a responsive, container-based home page and a documented page structure.
**Skills:** Bubble, Responsive Layout, No-Code App Design, UI Structure.

**Deliverable:** A live Bubble app with a designed home page and a written structure map.

---

## Project 2 (Module 2): Design a Real Data Structure

**Goal:** Define the data your app stores, the single most important decision in any app.

**Step 1: Open the Data tab.**
In the editor, click the Data tab. This is where you define what your app remembers, separate from how any screen looks.

**Step 2: Understand data types.**
A data type is a kind of thing your app stores, such as a Task or a User. It is the template for every record of that kind. Naming your data types well is really naming the nouns of your app.

**Step 3: Create a Task data type.**
Under Data types, click New type and name it `Task`. This one type will power the whole task tracker, and the capstone later.

**Step 4: Understand fields.**
A field is one piece of information on a data type, like a Task's title or due date, and each field has its own type: text, number, date, or yes/no. Choosing the right field type is what lets you sort, filter, and validate later.

**Step 5: Add fields to Task.**
Give `Task` these fields: `title` (text), `is_done` (yes/no), `due_date` (date), and `priority` (text). Together they cover displaying, completing, scheduling, and sorting tasks.

**Step 6: Understand records.**
A record, called a Thing in Bubble, is one actual entry of a data type, like the specific task "Email the client". Types are templates; records are the real data users create and change.

**Step 7: Add a few records by hand.**
In the Data tab under App data, click New entry and add three sample tasks with different priorities and due dates. Real sample data lets you build and test screens without waiting for users.

**Step 8: Document your data model.**
In your notes, list each data type and its fields with their types. This is the reference you will check constantly while building features.

### Final Project Structure
```text
Data model
│
├── Task (data type)
│   ├── title       : text
│   ├── is_done     : yes/no
│   ├── due_date    : date
│   └── priority    : text
│
└── data_model.md  ->  types + fields documented
    + 3 sample Task records created in App data
```

### What You Learned
- ✅ What data types, fields, and records are
- ✅ Choosing correct field types (date, yes/no, text)
- ✅ Designing a data model before building screens
- ✅ Creating sample records to build and test against
- ✅ Documenting a data model for yourself and others

### Portfolio Project
**App Data Model**: Designed and documented a real data structure with correctly typed fields, plus sample records to build against.
**Skills:** Data Modeling, Bubble Database, App Architecture, No-Code Development.

**Deliverable:** A documented data model with a Task type, correctly typed fields, and sample records.

---

## Project 3 (Module 3): Display Data on the Page

**Goal:** Show your stored records on screen in a list that updates itself.

**Step 1: Understand repeating groups.**
A repeating group is an element that shows one row per record, automatically, however many records there are. It is how every list in a no-code app is built.

**Step 2: Add a repeating group to your page.**
On the index page, drag a Repeating Group onto the canvas. Set its Type of content to `Task` and its Data source to `Search for Tasks`. Type of content tells the group what kind of record each row is, and the data source tells it which records to pull.

**Step 3: Understand data sources.**
A data source is the query that decides which records appear, such as all Tasks, or only Tasks that are not done. Much of an app's behaviour is really just choosing the right data source for each list.

**Step 4: Design one row (the cell).**
Inside the first cell of the repeating group, add a Text element and set its text dynamically to the current cell's Task's `title`. You design one cell and the repeating group applies it to every record.

**Step 5: Show more fields.**
Add another Text for `due_date` and a Text for `priority`, each bound to the current cell's Task. A useful list shows enough for the user to act on.

**Step 6: Sort the list.**
On the data source, add "sorted by due_date, ascending". Sorting turns a pile of records into a list a person can actually use.

**Step 7: Preview and confirm live data.**
Preview the app; your three sample tasks should appear in due-date order. Add a record in the Data tab and refresh, and it appears automatically, which proves the list is data-driven rather than hardcoded.

**Step 8: Document the display logic.**
Note which page shows which data type, the data source used, and the sort order. When a list later shows the wrong items, this note is the first place to look.

### Final Project Structure
```text
index (page)
│
└── Repeating Group (Type: Task, Source: Search for Tasks sorted by due_date)
    └── Cell
        ├── Text -> current cell's Task's title
        ├── Text -> current cell's Task's due_date
        └── Text -> current cell's Task's priority
```

### What You Learned
- ✅ What repeating groups and data sources are
- ✅ Binding screen elements to record fields (current cell)
- ✅ Displaying multiple fields per row
- ✅ Sorting a list by a field
- ✅ Confirming a list is data-driven, not hardcoded

### Portfolio Project
**Data-Driven List Screen**: Built a self-updating list that displays real records with multiple fields and a meaningful sort order.
**Skills:** Repeating Groups, Data Binding, Bubble, No-Code UI.

**Deliverable:** A page that displays live, sorted records from your data type in a repeating group.

---

## Project 4 (Module 4): Let Users Create and Change Data

**Goal:** Add the input form and actions that let users create, complete, and delete records.

**Step 1: Understand workflows.**
A workflow is a sequence of actions that runs when something happens, such as a button click. Every interactive feature in your app is a workflow: an event followed by one or more actions.

**Step 2: Build an input form.**
Add an Input for the task title, a DatePicker for the due date, a Dropdown for priority, and a Button labelled `Add task`. Match each input to a field you defined in Project 2.

**Step 3: Create a "Create a new Task" workflow.**
Click the Add task button, choose Start/Edit workflow, then add the action Create a new thing, type `Task`. This action turns what the user typed into a real record in your database.

**Step 4: Map inputs to fields.**
In the Create action, set `title` to the Input's value, `due_date` to the DatePicker's value, `priority` to the Dropdown's value, and `is_done` to no. A missed mapping is why an app saves a blank task.

**Step 5: Add validation.**
Validation means checking input before you save it. Add a condition on the button so it is only clickable when the title input is not empty, which stops users from creating broken records.

**Step 6: Add a complete action.**
In the repeating group cell, add a Checkbox, then create a workflow: when its value changes, Make changes to the current cell's Task and set `is_done` to the checkbox's value. Make changes to a thing is how users edit existing records.

**Step 7: Add a delete action.**
Add a small Delete icon to the cell with a workflow that, on click, deletes the current cell's Task. Add a confirmation condition first, since delete is irreversible.

**Step 8: Reset inputs after creating.**
Add a final action to the Add task workflow: Reset the inputs. Clearing the form after saving stops users from accidentally submitting duplicates.

### Final Project Structure
```text
Workflows
│
├── When "Add task" clicked (only when title is not empty)
│     -> Create a new Task (map title, due_date, priority, is_done=no)
│     -> Reset inputs
├── When cell checkbox changes -> Make changes to Task (is_done)
└── When cell delete clicked (confirm) -> Delete Task
```

### What You Learned
- ✅ What workflows, events, and actions are
- ✅ Creating records from user input and mapping inputs to fields
- ✅ Validating input before saving
- ✅ Editing records with Make changes to a thing
- ✅ Deleting records safely with confirmation

### Portfolio Project
**Interactive CRUD App**: Added create, complete, and delete features driven by user input, with validation and safe deletes.
**Skills:** Bubble Workflows, CRUD, Form Validation, No-Code Logic.

**Deliverable:** A working app where users can create, complete, and delete records themselves.

---

## Project 5 (Module 5): Add User Accounts and Private Data

**Goal:** Let people sign up, log in, and see only their own data.

**Step 1: Understand the User type.**
Bubble gives every app a built-in User data type for accounts, and you can add your own fields to it, like `name`. Because accounts are so common, you do not have to build login from scratch.

**Step 2: Build sign-up and log-in forms.**
Add inputs for email and password and two buttons, Sign up and Log in. These two flows are the front door of almost every app.

**Step 3: Create the sign-up workflow.**
On Sign up, add the action Sign the user up, using the email and password inputs. This both creates the account and logs the person in.

**Step 4: Create the log-in workflow.**
On Log in, add the action Log the user in with the email and password inputs, so returning users have a way back in.

**Step 5: Understand Current User.**
Current User is whoever is logged in right now. You can attach data to them and reference them in workflows, which is how an app personalises itself for each person.

**Step 6: Link tasks to their owner.**
Add a `creator` field of type User to the Task type, and in the Create a new Task action, set `creator` to Current User. Without an owner field you cannot later filter tasks by who created them.

**Step 7: Filter the list to the current user.**
Change the repeating group's data source to Search for Tasks where creator = Current User. This single change is what makes each person see only their own tasks.

**Step 8: Add privacy rules.**
Privacy rules control which records a user is even allowed to load, enforced by the database rather than just hidden on screen. Add a rule so a Task is only visible when its creator is the Current User, which is what actually protects one user's data from another.

### Final Project Structure
```text
Accounts + privacy
│
├── User (built-in) + field: name
├── Task.creator : User  (set to Current User on create)
├── Repeating group source: Search for Tasks where creator = Current User
└── Privacy rule: Task visible only when creator is Current User
```

### What You Learned
- ✅ Using Bubble's built-in User type
- ✅ Building sign-up and log-in workflows
- ✅ What Current User is and how to reference it
- ✅ Linking records to their owner
- ✅ Enforcing real privacy with database privacy rules

### Portfolio Project
**Multi-User App with Private Data**: Added accounts and per-user data isolation enforced by privacy rules, not just screen logic.
**Skills:** Authentication, User Accounts, Data Privacy, Bubble, No-Code Development.

**Deliverable:** An app where users sign up, log in, and can only see and change their own records.

---

## Project 6 (Module 6): Polish, Test, and Publish

**Goal:** Take your app from "works on my screen" to a shareable, tested, published product.

**Step 1: Test responsiveness.**
Use Bubble's responsive preview to view your app at phone, tablet, and desktop widths. Most of your users will be on phones, so an app that only looks right on desktop will feel broken to them.

**Step 2: Fix layout issues per breakpoint.**
Adjust container widths, min-widths, and hidden elements so each width looks intentional. This is where an app goes from amateur to professional in the first few seconds.

**Step 3: Add loading and empty states.**
Show a friendly message when the task list is empty, such as "No tasks yet, add your first one". An empty screen looks like a bug; an empty state tells the user what to do next.

**Step 4: Test every workflow deliberately.**
Sign up as a new user, create tasks, complete them, delete one, log out, and log back in, confirming your data persists and stays private. Clicking through as a real user, in order, catches gaps you miss when testing pieces in isolation.

**Step 5: Understand versions and deployment.**
Bubble has a development version where you build and a live version your users see, and deploying pushes your work from development to live. Keeping them separate means you can build safely without breaking what people are already using.

**Step 6: Deploy to live.**
Click Deploy current version to Live, then visit your live URL and run through the app once more to confirm it behaves the same as in development.

**Step 7: Write a short product README.**
Create a doc covering what the app does, who it is for, how to use it, and the live URL. This is what a reviewer or employer reads before they even click.

**Step 8: Share it and gather one round of feedback.**
Send the live link to two people, ask them to complete one task in the app, and note what confused them. Real users find issues you cannot see because you built it.

### Final Project Structure
```text
Published app
│
├── Responsive across phone / tablet / desktop
├── Empty + loading states
├── Live deployment (separate from development)
├── product_readme.md
└── feedback_notes.md
```

### What You Learned
- ✅ Responsive testing and fixing layouts per width
- ✅ Designing empty and loading states
- ✅ Testing full user journeys in order
- ✅ The difference between development and live versions
- ✅ Deploying, documenting, and gathering feedback

### Portfolio Project
**Published, Tested Web App**: Polished an app for all screen sizes, tested full user journeys, deployed it live, and documented it for a real audience.
**Skills:** Responsive Design, QA Testing, Deployment, Technical Writing, No-Code Development.

**Deliverable:** A live, published, responsive app with documentation and a round of user feedback.

---

## Final Capstone: Build and Ship a Complete No-Code Web App

**Goal:** Combine every project above into one original, published app. This is an integration exercise, not a new tool to learn.

**Step 1: Choose your own app idea.**
Pick something small and real, such as a habit tracker, a simple booking tool, a reading list, or a community directory. An original idea is far more compelling to an employer than a repeat of the tutorial.

**Step 2: Design the data model.**
Using your Project 2 skills, list your data types and fields before building anything, and add sample records. Every screen you build will be a view onto this model.

**Step 3: Build the display screens.**
Using your Project 3 skills, create the repeating groups and detail views that show your data, sorted sensibly.

**Step 4: Add interactivity.**
Using your Project 4 skills, build the create, edit, and delete workflows your app needs, with validation. This is the point your app becomes usable rather than just viewable.

**Step 5: Add accounts and privacy.**
Using your Project 5 skills, add sign-up and log-in, link records to their owner, and set privacy rules so the app is safe to share.

**Step 6: Polish, test, and deploy.**
Using your Project 6 skills, make it responsive, add empty states, test full journeys, and deploy to live.

**Step 7: Write the capstone document.**
Combine your app idea, data model, a list of features, the live URL, and two screenshots. This is what you hand a reviewer or employer to prove the app is real and yours.

### Final Project Structure
```text
capstone_app (Bubble)
│
├── Data model (your types + fields)
├── Display screens (repeating groups, detail views)
├── Workflows (create / edit / delete + validation)
├── Accounts + privacy rules
├── Live deployment
└── capstone_summary.md  ->  idea, model, features, URL, screenshots
```

### What You Learned
- ✅ Turning an original idea into a designed data model
- ✅ Building display, interactivity, accounts, and privacy end to end
- ✅ Deploying a complete app to a live URL
- ✅ Documenting an app for a real audience
- ✅ Shipping a finished, original no-code product

### Portfolio Project
**Complete No-Code Web App (Capstone)**: Designed, built, secured, and published an original multi-user web app with a real data model, full CRUD, accounts, privacy rules, and a live deployment.
**Skills:** Bubble, Data Modeling, Workflows, Authentication, Privacy, Responsive Design, Deployment, No-Code Development.

**Deliverable:** A live, original, multi-user no-code web app, plus a written summary connecting it back to every project that built it.
