<!-- order: 4 -->
# No-Code Web App Builder (Bubble): Hands-On Project Tutorials

This course turns each project into a step-by-step, hands-on build. You learn each idea at the moment you need it, while building the thing, and every project hands its result to the next one, ending in a working web app you can show anyone. Follow the projects in order.

**Plan check:** Every required step in this course works on Bubble's free plan. On the free plan your app runs in its development version, which you can preview and share at a `bubbleapps.io/version-test` address. Deploying to the Live version (and connecting a custom domain) needs a paid plan, so the Live deployment step in Project 6 is optional. The free plan also has usage limits (such as workload and data limits) at the time of writing (2026); a course-sized app stays well within them, but check Bubble's current pricing page.

---

## Project 1 (Module 1): Set Up Your First Bubble App and Page

**Goal:** Get a real Bubble app running with a page you designed, so every later project has a home.

**Time:** about 1.5 hours

**Step 1: Create your Bubble account and app.**
Go to bubble.io, sign up for a free account, and click Create an app. Give it a clear name like `task-tracker`. Everything in this course lives inside this one app, and from day one you can preview it in your browser at its development (version-test) URL.

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

**Step 7: Preview your app.**
Click Preview in the top right. Your page opens in a new tab at an address like `task-tracker.bubbleapps.io/version-test`. This development version works on the free plan and you can share the link with others. Building and previewing in a tight loop lets you catch layout problems while they are still small.

**Step 8: Document your app structure.**
In a notes doc, write your app name, its preview URL, and the pages you plan to build, and keep it updated as you go. A simple one-page map keeps a growing project from turning into a maze of unnamed pages.

### Project Structure
```text
task-tracker (Bubble app)
│
├── index (page)  ->  Text + Button in a Column container
└── app_notes.md  ->  app name, preview URL, planned pages
```

### What You Learned
- ✅ Creating a Bubble app and understanding the editor tabs
- ✅ What pages, elements, and containers are
- ✅ Building inside a responsive layout instead of fixed positions
- ✅ Previewing an app at its development URL
- ✅ Keeping a simple map of your app's structure

### Portfolio Project
**Bubble App Foundation**: Set up a no-code web app with a responsive, container-based home page and a documented page structure.
**Skills:** Bubble, Responsive Layout, No-Code App Design, UI Structure.

**Deliverable:** A Bubble app you can preview at its URL, with a designed home page and a written structure map.

### Quiz

1. What does each of the Design, Workflow, and Data tabs control?
2. Why place elements inside containers with a row or column layout?
3. On the free plan, where can you open and share your app?

*Answers: 1) Design controls how a page looks, Workflow controls what it does, and Data controls what it stores. 2) Containers make the layout responsive, so elements rearrange to fit any screen instead of breaking at fixed positions. 3) At its development version URL, the bubbleapps.io address ending in version-test.*

---

## Project 2 (Module 2): Design a Real Data Structure

**Goal:** Define the data your app stores, the single most important decision in any app.

**Time:** about 1.5 hours

**Step 1: Open the Data tab.**
In the editor, click the Data tab. This is where you define what your app remembers, separate from how any screen looks.

**Step 2: Understand data types.**
A data type is a kind of thing your app stores, such as a Task or a User. It is the template for every record of that kind. Naming your data types well is really naming the nouns of your app.

**Step 3: Create a Task data type.**
Under Data types, click New type and name it `Task`. This one type will power the whole task tracker.

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

### Project Structure
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

### Quiz

1. What is the difference between a data type and a record (Thing)?
2. Why is `due_date` a date field rather than a text field?
3. Which field type fits `is_done`, and why?
4. Why add sample records by hand before building screens?

*Answers: 1) A data type is the template for a kind of thing, like Task; a record is one actual entry of that type, like a specific task. 2) A date field can be sorted and filtered by date correctly, which text cannot. 3) Yes/no, because a task is either done or not. 4) So you can build and test screens against real-looking data without waiting for users.*

---

## Project 3 (Module 3): Display Data on the Page

**Goal:** Show your stored records on screen in a list that updates itself.

**Time:** about 1.5 hours

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

### Project Structure
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

### Quiz

1. What do a repeating group's Type of content and Data source each decide?
2. Why do you only design the first cell?
3. What does "current cell's Task" refer to?
4. How do you prove the list is data-driven rather than hardcoded?

*Answers: 1) Type of content sets what kind of record each row is; Data source sets which records are pulled. 2) The repeating group applies that one design to every record automatically. 3) The specific Task record shown in that row. 4) Add a new record in the Data tab, refresh the preview, and see it appear without changing the page.*

---

## Project 4 (Module 4): Let Users Create and Change Data

**Goal:** Add the input form and actions that let users create, complete, and delete records.

**Time:** about 2 hours

**Step 1: Understand workflows.**
A workflow is a sequence of actions that runs when something happens, such as a button click. Every interactive feature in your app is a workflow: an event followed by one or more actions.

**Step 2: Build an input form.**
Add an Input for the task title, a Date/Time Picker for the due date, a Dropdown for priority (static choices: Low, Medium, High), and a Button labelled `Add task`. Match each input to a field you defined in Project 2.

**Step 3: Create a "Create a new Task" workflow.**
Click the Add task button, choose Start/Edit workflow, then add the action Create a new thing, type `Task`. This action turns what the user typed into a real record in your database.

**Step 4: Map inputs to fields.**
In the Create action, set `title` to the Input's value, `due_date` to the date picker's value, `priority` to the Dropdown's value, and `is_done` to no. A missed mapping is why an app saves a blank task.

**Step 5: Add validation.**
Validation means checking input before you save it. On the Add task button, add a condition: when the title Input's value is empty, "This element isn't clickable". This stops users from creating broken records.

**Step 6: Add a complete action.**
In the repeating group cell, add a Checkbox, then create a workflow: when its value changes, Make changes to the current cell's Task and set `is_done` to the checkbox's value. Make changes to a thing is how users edit existing records.

**Step 7: Add a delete action with a confirmation popup.**
Bubble has no built-in "are you sure?" step, so you build one. Add a Popup element named `Confirm delete` with the text "Delete this task?" and two buttons, Confirm and Cancel. Add a small Delete icon to the cell with a workflow that, on click, uses Display data in a group/popup to send the current cell's Task to the popup (set the popup's Type of content to `Task` first), then Show the popup. In the Confirm button's workflow, Delete thing: the popup's Task, then Hide the popup. In the Cancel button's workflow, just Hide the popup. The delete only runs after the user confirms, because delete is irreversible.

**Step 8: Reset inputs after creating.**
Add a final action to the Add task workflow: Reset relevant inputs. Clearing the form after saving stops users from accidentally submitting duplicates.

### Project Structure
```text
Workflows
│
├── When "Add task" clicked (not clickable when title is empty)
│     -> Create a new Task (map title, due_date, priority, is_done=no)
│     -> Reset relevant inputs
├── When cell checkbox changes -> Make changes to Task (is_done)
├── When cell delete icon clicked -> Display Task in popup -> Show "Confirm delete"
├── When Confirm clicked -> Delete popup's Task -> Hide popup
└── When Cancel clicked -> Hide popup
```

### What You Learned
- ✅ What workflows, events, and actions are
- ✅ Creating records from user input and mapping inputs to fields
- ✅ Validating input before saving
- ✅ Editing records with Make changes to a thing
- ✅ Deleting records safely with a confirmation popup

### Portfolio Project
**Interactive CRUD App**: Added create, complete, and delete features driven by user input, with validation and safe deletes.
**Skills:** Bubble Workflows, CRUD, Form Validation, No-Code Logic.

**Deliverable:** A working app where users can create, complete, and delete records themselves.

### Quiz

1. What two parts make up every workflow?
2. Why might an app save a blank task even though the user typed a title?
3. Which action edits an existing record, such as marking a task done?
4. How do you make deleting a task require confirmation in Bubble?

*Answers: 1) An event (something that happens, like a click) followed by one or more actions. 2) The Input's value was not mapped to the title field in the Create a new thing action. 3) Make changes to a thing. 4) Show a Popup with Confirm and Cancel buttons, and put the Delete thing action only in the Confirm button's workflow.*

---

## Project 5 (Module 5): Add User Accounts and Private Data

**Goal:** Let people sign up, log in, and see only their own data.

**Time:** about 2 hours

**Step 1: Understand the User type.**
Bubble gives every app a built-in User data type for accounts, and you can add your own fields to it, like `name`. Because accounts are so common, you do not have to build login from scratch.

**Step 2: Build sign-up and log-in forms.**
Add inputs for email and password (set the password input's content format to Password) and two buttons, Sign up and Log in. These two flows are the front door of almost every app.

**Step 3: Create the sign-up workflow.**
On Sign up, add the action Sign the user up, using the email and password inputs. This both creates the account and logs the person in.

**Step 4: Create the log-in workflow.**
On Log in, add the action Log the user in with the email and password inputs, so returning users have a way back in. Also add a Log out button with the action Log the user out.

**Step 5: Understand Current User.**
Current User is whoever is logged in right now. You can attach data to them and reference them in workflows, which is how an app personalises itself for each person.

**Step 6: Link tasks to their owner.**
Add a `creator` field of type User to the Task type, and in the Create a new Task action, set `creator` to Current User. Without an owner field you cannot later filter tasks by who created them.

**Step 7: Filter the list to the current user.**
Change the repeating group's data source to Search for Tasks with the constraint creator = Current User. This single change is what makes each person see only their own tasks.

**Step 8: Add privacy rules.**
Privacy rules control which records a user is even allowed to load, enforced by the database rather than just hidden on screen. In the Data tab, under Privacy, add a rule on Task: when This Task's creator is Current User, allow finding it in searches and viewing all fields. Then, in the "Everyone else" row, uncheck those same permissions (they are on by default). This is what actually protects one user's data from another.

### Project Structure
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
- ✅ Building sign-up, log-in, and log-out workflows
- ✅ What Current User is and how to reference it
- ✅ Linking records to their owner
- ✅ Enforcing real privacy with database privacy rules

### Portfolio Project
**Multi-User App with Private Data**: Added accounts and per-user data isolation enforced by privacy rules, not just screen logic.
**Skills:** Authentication, User Accounts, Data Privacy, Bubble, No-Code Development.

**Deliverable:** An app where users sign up, log in, and can only see and change their own records.

### Quiz

1. What does the Sign the user up action do besides creating the account?
2. Why does the Task type need a `creator` field?
3. Why is filtering the repeating group by creator not enough on its own to protect data?
4. What does a privacy rule on Task do?

*Answers: 1) It also logs the new user in. 2) So each task records who made it, which lets you filter and protect tasks by owner. 3) It only changes what one list shows; the data could still be loaded another way unless the database blocks it. 4) It makes the database only let a user find and view Tasks whose creator is that user.*

---

## Project 6 (Module 6): Polish, Test, and Publish

**Goal:** Take your app from "works on my screen" to a shareable, tested product.

**Time:** about 2.5 hours

**Step 1: Test responsiveness.**
Use Bubble's responsive viewer to view your app at phone, tablet, and desktop widths. Most of your users will be on phones, so an app that only looks right on desktop will feel broken to them.

**Step 2: Fix layout issues per breakpoint.**
Adjust container widths, min-widths, and hidden elements so each width looks intentional. This is where an app goes from amateur to professional in the first few seconds.

**Step 3: Add loading and empty states.**
Show a friendly message when the task list is empty, such as "No tasks yet, add your first one". An empty screen looks like a bug; an empty state tells the user what to do next. One way: add a Text with that message and a condition so it is visible only when the repeating group's list of Tasks count is 0.

**Step 4: Test every workflow deliberately.**
Sign up as a new user, create tasks, complete them, delete one, log out, and log back in, confirming your data persists and stays private. Clicking through as a real user, in order, catches gaps you miss when testing pieces in isolation.

**Step 5: Understand versions and deployment.**
Bubble has a development version where you build (the version-test URL) and a Live version for real users, and deploying pushes your work from development to Live. Keeping them separate means you can build safely without breaking what people are already using. On the free plan you work and share in the development version; deploying to Live needs a paid plan.

**Step 6: Share your app (Live deploy optional).**
Free path: copy your version-test URL, open it in a private browser window, and run through the app once more as a new user to confirm it works for someone who isn't logged into the editor.

*Optional (needs a paid plan):* click Deploy current version to Live, then visit your live URL (without `/version-test`) and run through the app again to confirm it behaves the same as in development.

**Step 7: Write a short product README.**
Create a doc covering what the app does, who it is for, how to use it, and the app's URL. This is what a reviewer reads before they even click.

**Step 8: Share it and gather one round of feedback.**
Send the link to two people, ask them to complete one task in the app, and note what confused them. Real users find issues you cannot see because you built it.

### Project Structure
```text
Shareable app
│
├── Responsive across phone / tablet / desktop
├── Empty + loading states
├── Shared via version-test URL (Live deployment optional, paid plan)
├── product_readme.md
└── feedback_notes.md
```

### What You Learned
- ✅ Responsive testing and fixing layouts per width
- ✅ Designing empty and loading states
- ✅ Testing full user journeys in order
- ✅ The difference between development and live versions
- ✅ Sharing, documenting, and gathering feedback

### Portfolio Project
**Tested, Shareable Web App**: Polished an app for all screen sizes, tested full user journeys, shared it with real users, and documented it for a real audience.
**Skills:** Responsive Design, QA Testing, Deployment Concepts, Technical Writing, No-Code Development.

**Deliverable:** A responsive, shareable app (on its version-test URL, or Live on a paid plan) with documentation and a round of user feedback.

### Quiz

1. Why does an empty list need an empty state?
2. Why test the whole user journey in order, not just each feature separately?
3. What is the difference between Bubble's development and Live versions?
4. On the free plan, how do you share your app with testers?

*Answers: 1) An empty screen looks like a bug, while an empty state tells the user what to do next. 2) Running through as a real user catches gaps between features, like data not persisting after log out and log in. 3) Development is where you build and test; Live is the version real users see, and deploying copies development to Live. 4) Send them the development version URL, the bubbleapps.io address ending in version-test.*
