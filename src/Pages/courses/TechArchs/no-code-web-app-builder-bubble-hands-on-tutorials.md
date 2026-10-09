<!-- order: 4 -->
# No-Code Web App Builder (Bubble): Hands-On Project Tutorials

This course turns each project into a step-by-step, hands-on build. You learn each idea at the moment you need it, while building the thing, and every project hands its result to the next one, ending in a working web app you can show anyone. Follow the projects in order.

**By the end of this course, you'll be able to:**
- Build a responsive Bubble page using containers with row and column layouts
- Design a data type with correctly typed fields and add sample records
- Display records in a sorted repeating group bound to a data source
- Build workflows that create, update, and delete records, with validation and a confirmation popup
- Add sign-up and log-in, and protect each user's data with privacy rules
- Test, document, and share your app at its development URL

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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "layout",
   "kicker": "Project 1 · Your first Bubble app",
   "title": "Give your app a home",
   "beats": [
    {
     "say": "Welcome to No-Code Web App Builder, with Bubble."
    },
    {
     "say": "Across six projects you'll build one working task tracker app, and in this first one you get it running with a page you designed."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "The editor's three tabs",
   "nodes": [
    {
     "id": "ed",
     "label": "Bubble editor",
     "x": 16,
     "y": 50,
     "sub": "canvas + elements panel",
     "art": "laptop"
    },
    {
     "id": "design",
     "label": "Design tab",
     "x": 72,
     "y": 18,
     "sub": "how a page looks",
     "art": "palette"
    },
    {
     "id": "wf",
     "label": "Workflow tab",
     "x": 72,
     "y": 50,
     "sub": "what it does",
     "art": "gear"
    },
    {
     "id": "data",
     "label": "Data tab",
     "x": 72,
     "y": 82,
     "sub": "what it stores",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "ed",
     "to": "design"
    },
    {
     "from": "ed",
     "to": "wf"
    },
    {
     "from": "ed",
     "to": "data"
    }
   ],
   "beats": [
    {
     "say": "Sign up at bubble dot i o, click Create an app, and name it task tracker.",
     "show": 1,
     "on": "ed"
    },
    {
     "say": "The editor has a visual canvas in the middle, an elements panel on the left, and tabs across the top.",
     "show": 1,
     "on": "ed"
    },
    {
     "say": "Design controls how a page looks.",
     "show": 2,
     "on": "design"
    },
    {
     "say": "Workflow controls what it does.",
     "show": 3,
     "on": "wf"
    },
    {
     "say": "And Data controls what it stores. Knowing which tab does what saves you a lot of time.",
     "show": 4,
     "on": "data"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 3 to 6",
   "title": "A page holds a container, which holds elements",
   "nodes": [
    {
     "id": "page",
     "label": "index page",
     "x": 14,
     "y": 50,
     "sub": "the home screen",
     "art": "browser"
    },
    {
     "id": "box",
     "label": "Container",
     "x": 50,
     "y": 50,
     "sub": "Column layout",
     "art": "boxes"
    },
    {
     "id": "text",
     "label": "Text",
     "x": 86,
     "y": 25,
     "sub": "My Task Tracker"
    },
    {
     "id": "btn",
     "label": "Button",
     "x": 86,
     "y": 75,
     "sub": "below the text",
     "art": "cursor"
    }
   ],
   "edges": [
    {
     "from": "page",
     "to": "box"
    },
    {
     "from": "box",
     "to": "text"
    },
    {
     "from": "box",
     "to": "btn"
    }
   ],
   "beats": [
    {
     "say": "A page is one screen of your app, reached by its own U R L. Yours starts with index, the home screen.",
     "show": 1,
     "on": "page"
    },
    {
     "say": "From the left panel, drag in a Text, and change it to My Task Tracker.",
     "show": 3,
     "on": "text"
    },
    {
     "say": "Then drag in a Button. Elements like these are the visible building blocks of every screen.",
     "show": 4,
     "on": "btn"
    },
    {
     "say": "Select both, right click, and choose Group elements in a Container.",
     "show": 4,
     "on": "box"
    },
    {
     "say": "Set the container to Column layout, so the text and button stack neatly, one above the other.",
     "show": 4,
     "on": [
      "box",
      "text",
      "btn"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Why containers make a page responsive",
   "columns": [
    "Screen",
    "Pinned in place",
    "In a Column container"
   ],
   "rows": [
    [
     "Desktop",
     "Looks fine",
     "Looks fine"
    ],
    [
     "Tablet",
     "Can start to break",
     "Rearranges to fit"
    ],
    [
     "Phone",
     "Breaks or overflows",
     "Rearranges to fit"
    ]
   ],
   "beats": [
    {
     "say": "A responsive layout rearranges elements to fit any screen size, from phone to desktop."
    },
    {
     "say": "On a desktop, both approaches look fine.",
     "hl": 0
    },
    {
     "say": "But elements pinned to fixed positions don't move when the screen shrinks, so the layout breaks.",
     "hl": [
      1,
      2
     ],
     "col": 1
    },
    {
     "say": "Elements inside a row or column container rearrange themselves to fit.",
     "hl": [
      1,
      2
     ],
     "col": 2
    },
    {
     "say": "That's why, in Bubble, you build inside containers rather than pinning things in place.",
     "col": 2
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 7",
   "title": "Build, preview, fix, repeat",
   "nodes": [
    {
     "id": "ed",
     "label": "Editor",
     "x": 14,
     "y": 50,
     "sub": "you build here",
     "art": "laptop"
    },
    {
     "id": "prev",
     "label": "Preview",
     "x": 50,
     "y": 50,
     "sub": "version-test",
     "art": "eye"
    },
    {
     "id": "friend",
     "label": "Anyone",
     "x": 86,
     "y": 50,
     "sub": "with the link",
     "art": "people"
    }
   ],
   "edges": [
    {
     "from": "ed",
     "to": "prev"
    },
    {
     "from": "prev",
     "to": "friend"
    }
   ],
   "beats": [
    {
     "say": "Click Preview in the top right.",
     "show": 3,
     "on": "ed",
     "send": {
      "from": "ed",
      "to": "prev",
      "label": "Preview"
     }
    },
    {
     "say": "Your page opens at an address ending in version test. That development version works on the free plan.",
     "on": "prev"
    },
    {
     "say": "Spot a layout problem? Go back to the editor, fix it, and preview again.",
     "on": [
      "ed",
      "prev"
     ],
     "send": {
      "from": "prev",
      "to": "ed",
      "label": "fix layout"
     }
    },
    {
     "say": "Building in that tight loop catches problems while they're still small.",
     "on": "prev",
     "send": {
      "from": "ed",
      "to": "prev",
      "label": "Preview"
     }
    },
    {
     "say": "And you can share the version test link with anyone.",
     "on": "friend",
     "send": {
      "from": "prev",
      "to": "friend",
      "label": "version-test URL"
     }
    }
   ]
  },
  {
   "kind": "code",
   "art": "doc",
   "kicker": "Lab · Step 8",
   "title": "Map your app",
   "file": "Project structure",
   "code": "task-tracker (Bubble app)\n│\n├── index (page)  ->  Text + Button in a Column container\n└── app_notes.md  ->  app name, preview URL, planned pages",
   "beats": [
    {
     "say": "Finally, start a notes doc.",
     "show": 0
    },
    {
     "say": "Write the app name, its preview U R L, and the pages you plan to build. Keep it updated as you go.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why place elements inside containers with a row or column layout?",
   "options": [
    "It's the only way to add a button",
    "It makes the layout responsive, so elements rearrange to fit any screen",
    "It makes the page load faster"
   ],
   "answer": 1,
   "good": "That's right. Containers make the layout responsive, so elements rearrange to fit any screen instead of breaking at fixed positions.",
   "bad": "Not quite. Containers make the layout responsive, so elements rearrange to fit any screen instead of breaking at fixed positions.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why place elements inside containers with a row or column layout?",
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
     "App previews at its version-test URL",
     ""
    ],
    [
     "A designed home page in a container",
     ""
    ],
    [
     "A written structure map",
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
     "say": "you can preview your Bubble app at its development U R L,",
     "show": 1
    },
    {
     "say": "with a designed, container-based home page,",
     "show": 2
    },
    {
     "say": "and a written structure map.",
     "show": 3
    },
    {
     "say": "Next, in Module 2, you design a real data structure.",
     "show": 3
    }
   ]
  }
 ]
}
```

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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "database",
   "kicker": "Project 2 · Data structure",
   "title": "Decide what your app remembers",
   "beats": [
    {
     "say": "Welcome to Project 2."
    },
    {
     "say": "Defining the data your app stores is the single most important decision in any app. It lives in the Data tab, separate from how any screen looks."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "One data type, many records",
   "nodes": [
    {
     "id": "type",
     "label": "Task",
     "x": 16,
     "y": 50,
     "sub": "data type · template",
     "art": "blueprint"
    },
    {
     "id": "r1",
     "label": "Draft the report",
     "x": 76,
     "y": 18,
     "sub": "a record (Thing)",
     "art": "file"
    },
    {
     "id": "r2",
     "label": "Email the client",
     "x": 76,
     "y": 50,
     "sub": "a record (Thing)",
     "art": "file"
    },
    {
     "id": "r3",
     "label": "Book a room",
     "x": 76,
     "y": 82,
     "sub": "a record (Thing)",
     "art": "file"
    }
   ],
   "edges": [
    {
     "from": "type",
     "to": "r1"
    },
    {
     "from": "type",
     "to": "r2"
    },
    {
     "from": "type",
     "to": "r3"
    }
   ],
   "beats": [
    {
     "say": "A data type is a kind of thing your app stores, like a Task or a User.",
     "show": 1,
     "on": "type"
    },
    {
     "say": "Naming your data types is really naming the nouns of your app. In the Data tab, click New type, and name it Task.",
     "show": 1,
     "on": "type"
    },
    {
     "say": "A record, called a Thing in Bubble, is one actual entry of that type, like the task, Email the client.",
     "show": 3,
     "on": "r2"
    },
    {
     "say": "Every record follows the same template.",
     "show": 4,
     "on": [
      "r1",
      "r2",
      "r3"
     ]
    },
    {
     "say": "Types are templates. Records are the real data users create and change.",
     "show": 4,
     "on": "type"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 4 and 5",
   "title": "Four fields, each with the right type",
   "columns": [
    "Field",
    "Type",
    "Used for"
   ],
   "rows": [
    [
     "title",
     "text",
     "displaying"
    ],
    [
     "is_done",
     "yes/no",
     "completing"
    ],
    [
     "due_date",
     "date",
     "scheduling"
    ],
    [
     "priority",
     "text",
     "sorting by level"
    ]
   ],
   "beats": [
    {
     "say": "A field is one piece of information on a data type, and each field has its own type."
    },
    {
     "say": "Title is text, the words you display.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "Is done is a yes or no, because a task is either done or not.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "Due date is a date, so tasks can be scheduled.",
     "hl": 2,
     "col": 1
    },
    {
     "say": "And priority is text, holding Low, Medium or High.",
     "hl": 3,
     "col": 1
    },
    {
     "say": "Together they cover displaying, completing, scheduling and sorting tasks.",
     "col": 2
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Concept",
   "title": "Why due_date must be a date, not text",
   "values": [
    "1/15/2027",
    "10/20/2026",
    "9/30/2026"
   ],
   "beats": [
    {
     "say": "Here are three due dates, stored as text, and sorted."
    },
    {
     "say": "Text sorts character by character, so January twenty twenty seven comes first, just because it starts with a one.",
     "hl": 0,
     "note": "Text sort: wrong order"
    },
    {
     "say": "And September comes last, because nine sorts after one.",
     "hl": 2,
     "note": "Text sort: wrong order"
    },
    {
     "say": "Store them in a date field instead, and Bubble sorts them as real dates.",
     "vals": [
      "9/30/2026",
      "10/20/2026",
      "1/15/2027"
     ],
     "ok": [
      0,
      1,
      2
     ],
     "note": "Date sort: earliest first"
    },
    {
     "say": "Choosing the right field type is what lets you sort, filter and validate later.",
     "vals": [
      "9/30/2026",
      "10/20/2026",
      "1/15/2027"
     ],
     "ok": [
      0,
      1,
      2
     ],
     "note": "Date sort: earliest first"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 7 and 8",
   "title": "Three sample records in App data",
   "columns": [
    "title",
    "is_done",
    "due_date",
    "priority"
   ],
   "rows": [
    [
     "Draft the report",
     "no",
     "Oct 20, 2026",
     "Medium"
    ],
    [
     "Email the client",
     "no",
     "Oct 14, 2026",
     "High"
    ],
    [
     "Book a room",
     "no",
     "Oct 28, 2026",
     "Low"
    ]
   ],
   "beats": [
    {
     "say": "In the Data tab, under App data, click New entry."
    },
    {
     "say": "Add a first task, Draft the report.",
     "hl": 0
    },
    {
     "say": "Then Email the client, with a different priority and due date.",
     "hl": 1
    },
    {
     "say": "And Book a room. Three real-looking records.",
     "hl": 2
    },
    {
     "say": "Notice the type gives the columns, and each record is one row.",
     "col": 0
    },
    {
     "say": "Now you can build and test screens without waiting for users. List each type and its fields in your notes too.",
     "hl": [
      0,
      1,
      2
     ]
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Which field type fits is done?",
   "options": [
    "Yes or no, because a task is either done or not",
    "Text, so you can write done",
    "Number, counting how done it is"
   ],
   "answer": 0,
   "good": "That's right. Yes or no fits, because a task is either done or not.",
   "bad": "Not quite. Yes or no fits, because a task is either done or not.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Which field type fits is done?",
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
     "A documented Task data type",
     ""
    ],
    [
     "Correctly typed fields",
     ""
    ],
    [
     "Three sample records",
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
     "say": "you have a documented data model with a Task type,",
     "show": 1
    },
    {
     "say": "correctly typed fields,",
     "show": 2
    },
    {
     "say": "and sample records to build against.",
     "show": 3
    },
    {
     "say": "Next, in Module 3, you display that data on the page.",
     "show": 3
    }
   ]
  }
 ]
}
```

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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "array",
   "kicker": "Project 3 · Display data",
   "title": "A list that updates itself",
   "beats": [
    {
     "say": "Welcome to Project 3."
    },
    {
     "say": "Now you show your stored records on screen, in a list that updates itself."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 1 to 3",
   "title": "How a repeating group gets its rows",
   "nodes": [
    {
     "id": "db",
     "label": "Database",
     "x": 14,
     "y": 50,
     "sub": "Task records",
     "art": "database"
    },
    {
     "id": "src",
     "label": "Data source",
     "x": 50,
     "y": 50,
     "sub": "Search for Tasks",
     "art": "search"
    },
    {
     "id": "rg",
     "label": "Repeating Group",
     "x": 86,
     "y": 50,
     "sub": "Type of content: Task",
     "art": "array"
    }
   ],
   "edges": [
    {
     "from": "db",
     "to": "src"
    },
    {
     "from": "src",
     "to": "rg"
    }
   ],
   "beats": [
    {
     "say": "A repeating group shows one row per record, however many records there are. Drag one onto the index page.",
     "show": 3,
     "on": "rg"
    },
    {
     "say": "Set its Type of content to Task. That decides what kind of record each row is.",
     "on": "rg"
    },
    {
     "say": "Set its Data source to Search for Tasks. That's the query deciding which records to pull.",
     "on": "src",
     "send": {
      "from": "src",
      "to": "db",
      "label": "Search for Tasks"
     }
    },
    {
     "say": "The database hands back all three sample tasks.",
     "on": "db",
     "send": {
      "from": "db",
      "to": "src",
      "label": "3 Tasks"
     }
    },
    {
     "say": "And the group draws one row for each.",
     "on": "rg",
     "send": {
      "from": "src",
      "to": "rg",
      "label": "3 rows"
     }
    },
    {
     "say": "Much of an app's behaviour is really just choosing the right data source for each list.",
     "on": "src"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 4 and 5",
   "title": "Design one cell, get every row",
   "columns": [
    "title",
    "due_date",
    "priority"
   ],
   "rows": [
    [
     "Draft the report",
     "Oct 20, 2026",
     "Medium"
    ],
    [
     "Email the client",
     "Oct 14, 2026",
     "High"
    ],
    [
     "Book a room",
     "Oct 28, 2026",
     "Low"
    ]
   ],
   "beats": [
    {
     "say": "Inside the first cell, add a Text, and set it dynamically to the current cell's Task's title.",
     "sql": "Text → Current cell's Task's title",
     "hl": 0,
     "dim": true,
     "col": 0
    },
    {
     "say": "Current cell's Task means the specific Task shown in that row.",
     "hl": 0,
     "dim": true,
     "col": 0
    },
    {
     "say": "You only design that one cell. The group applies it to every record.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 0
    },
    {
     "say": "Add a Text for due date, bound the same way.",
     "sql": "Text → Current cell's Task's due_date",
     "hl": [
      0,
      1,
      2
     ],
     "col": 1
    },
    {
     "say": "And one for priority. Now each row shows enough to act on.",
     "sql": "Text → Current cell's Task's priority",
     "hl": [
      0,
      1,
      2
     ],
     "col": 2
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Steps 6 and 7",
   "title": "Sort by due_date, then prove it's live",
   "values": [
    "Report · Oct 20",
    "Email · Oct 14",
    "Room · Oct 28"
   ],
   "beats": [
    {
     "say": "Without a sort, the tasks come back in no useful order."
    },
    {
     "say": "On the data source, add sorted by due date, ascending.",
     "vals": [
      "Email · Oct 14",
      "Report · Oct 20",
      "Room · Oct 28"
     ],
     "note": "sorted by due_date, ascending"
    },
    {
     "say": "Preview the app. The earliest due task is now on top.",
     "vals": [
      "Email · Oct 14",
      "Report · Oct 20",
      "Room · Oct 28"
     ],
     "hl": 0,
     "note": "sorted by due_date, ascending"
    },
    {
     "say": "Now add a record in the Data tab, Call the bank, due October seventeenth, and refresh.",
     "vals": [
      "Email · Oct 14",
      "Bank · Oct 17",
      "Report · Oct 20",
      "Room · Oct 28"
     ],
     "hl": 1,
     "note": "new record, no page change"
    },
    {
     "say": "It slots into second place on its own. That proves the list is data-driven, not hardcoded.",
     "vals": [
      "Email · Oct 14",
      "Bank · Oct 17",
      "Report · Oct 20",
      "Room · Oct 28"
     ],
     "ok": [
      0,
      1,
      2,
      3
     ],
     "note": "4 rows, still sorted"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 8",
   "title": "Write down the display logic",
   "columns": [
    "Page",
    "Type",
    "Data source",
    "Sort"
   ],
   "rows": [
    [
     "index",
     "Task",
     "Search for Tasks",
     "due_date, ascending"
    ]
   ],
   "beats": [
    {
     "say": "Finally, note which page shows which data type."
    },
    {
     "say": "Write down the data source it uses.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "And its sort order.",
     "hl": 0,
     "col": 3
    },
    {
     "say": "When a list later shows the wrong items, this note is the first place to look.",
     "hl": 0
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why do you only design the first cell of a repeating group?",
   "options": [
    "Bubble only allows one cell",
    "Other cells are hidden on mobile",
    "The repeating group applies that one design to every record automatically"
   ],
   "answer": 2,
   "good": "That's right. You design one cell, and the repeating group applies that design to every record automatically.",
   "bad": "Not quite. You design one cell, and the repeating group applies that design to every record automatically.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why do you only design the first cell of a repeating group?",
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
     "Live, sorted records on the page",
     ""
    ],
    [
     "Several fields in each row",
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
     "say": "a page displays live, sorted records from your Task type,",
     "show": 1
    },
    {
     "say": "in a repeating group, with title, due date and priority in each row.",
     "show": 2
    },
    {
     "say": "Next, in Module 4, you let users create and change data.",
     "show": 2
    }
   ]
  }
 ]
}
```

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
In the repeating group cell, add a Checkbox and set its preset status (initial value) to the current cell's Task's `is_done`, so it shows the saved state. Then create a workflow: when its value changes, Make changes to the current cell's Task and set `is_done` to the checkbox's value. Make changes to a thing is how users edit existing records.

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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "cursor",
   "kicker": "Project 4 · Create and change data",
   "title": "Let users do things",
   "beats": [
    {
     "say": "Welcome to Project 4."
    },
    {
     "say": "Now you add the form and actions that let users create, complete and delete tasks."
    },
    {
     "say": "Every interactive feature is a workflow: an event, like a button click, followed by one or more actions."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 2 to 4",
   "title": "Map every input to a field",
   "columns": [
    "Form input",
    "Task field",
    "Saved value"
   ],
   "rows": [
    [
     "Input",
     "title",
     "Input's value"
    ],
    [
     "Date/Time Picker",
     "due_date",
     "picker's value"
    ],
    [
     "Dropdown",
     "priority",
     "Low, Medium or High"
    ],
    [
     "(none)",
     "is_done",
     "no"
    ]
   ],
   "beats": [
    {
     "say": "Build a form with an Input, a date and time picker, a dropdown for priority, and an Add task button."
    },
    {
     "say": "On the button, start a workflow with the action Create a new thing, type Task.",
     "sql": "Create a new thing: Task"
    },
    {
     "say": "Set title to the Input's value.",
     "hl": 0
    },
    {
     "say": "Due date to the picker's value.",
     "hl": 1
    },
    {
     "say": "Priority to the dropdown's value.",
     "hl": 2
    },
    {
     "say": "And is done to no, because a new task isn't finished.",
     "hl": 3
    },
    {
     "say": "Miss one of these, like the title, and the app saves a blank task even though the user typed one.",
     "hl": 0,
     "dim": true
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 5 and 8",
   "title": "The Add task workflow",
   "nodes": [
    {
     "id": "btn",
     "label": "Add task button",
     "x": 14,
     "y": 50,
     "sub": "event: clicked",
     "art": "cursor"
    },
    {
     "id": "create",
     "label": "Create a new Task",
     "x": 50,
     "y": 25,
     "sub": "action 1"
    },
    {
     "id": "db",
     "label": "Database",
     "x": 86,
     "y": 25,
     "sub": "Task records",
     "art": "database"
    },
    {
     "id": "reset",
     "label": "Reset inputs",
     "x": 50,
     "y": 78,
     "sub": "action 2",
     "art": "loop"
    }
   ],
   "edges": [
    {
     "from": "btn",
     "to": "create"
    },
    {
     "from": "create",
     "to": "db"
    },
    {
     "from": "btn",
     "to": "reset"
    }
   ],
   "beats": [
    {
     "say": "Here's the workflow: one event, then two actions.",
     "show": 4,
     "on": "btn"
    },
    {
     "say": "First, validation. When the title Input is empty, the button isn't clickable, so no broken record can be made.",
     "on": "btn"
    },
    {
     "say": "With a title typed, a click runs action one, Create a new Task.",
     "on": "create",
     "send": {
      "from": "btn",
      "to": "create",
      "label": "clicked"
     }
    },
    {
     "say": "That turns what the user typed into a real record in the database.",
     "on": "db",
     "send": {
      "from": "create",
      "to": "db",
      "label": "new Task"
     }
    },
    {
     "say": "Then action two, Reset relevant inputs, clears the form, so nobody submits a duplicate.",
     "on": "reset",
     "send": {
      "from": "btn",
      "to": "reset",
      "label": "then"
     }
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 6",
   "title": "Complete a task with Make changes",
   "nodes": [
    {
     "id": "cb",
     "label": "Checkbox",
     "x": 18,
     "y": 50,
     "sub": "in each cell",
     "art": "form"
    },
    {
     "id": "task",
     "label": "Cell's Task",
     "x": 54,
     "y": 50,
     "sub": "field: is_done"
    },
    {
     "id": "db",
     "label": "Database",
     "x": 88,
     "y": 50,
     "sub": "saved state",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "cb",
     "to": "task"
    },
    {
     "from": "task",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "In the repeating group cell, add a Checkbox.",
     "show": 1,
     "on": "cb"
    },
    {
     "say": "Set its preset status to the current cell's Task's is done, so it shows the saved state.",
     "show": 3,
     "on": "cb",
     "send": {
      "from": "task",
      "to": "cb",
      "label": "is_done = no"
     }
    },
    {
     "say": "The user ticks it. That's the event: its value changes.",
     "on": "cb"
    },
    {
     "say": "The workflow runs Make changes to the current cell's Task, setting is done to the checkbox's value.",
     "on": "task",
     "send": {
      "from": "cb",
      "to": "task",
      "label": "is_done = yes"
     }
    },
    {
     "say": "And the change is saved. Make changes to a thing is how users edit existing records.",
     "on": "db",
     "send": {
      "from": "task",
      "to": "db",
      "label": "saved"
     }
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Step 7",
   "title": "Delete only after the user confirms",
   "values": [
    "Delete icon clicked",
    "Display Task in popup",
    "Show popup",
    "Confirm clicked",
    "Delete thing",
    "Hide popup"
   ],
   "beats": [
    {
     "say": "Bubble has no built-in are you sure step, so you build one: a popup called Confirm delete, with Type of content Task."
    },
    {
     "say": "The user clicks the delete icon in a row.",
     "hl": 0,
     "ptr": {
      "step": 0
     }
    },
    {
     "say": "Display data sends the current cell's Task to the popup.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "step": 1
     }
    },
    {
     "say": "Then the popup is shown, asking, delete this task?",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "step": 2
     }
    },
    {
     "say": "If the user clicks Confirm, its workflow deletes the popup's Task, then hides the popup.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "hl": [
      4,
      5
     ],
     "ptr": {
      "step": 4
     },
     "note": "Confirm workflow"
    },
    {
     "say": "If they click Cancel instead, only Hide popup runs. The task is untouched.",
     "ok": [
      0,
      1,
      2
     ],
     "gone": [
      3,
      4
     ],
     "hl": 5,
     "ptr": {
      "step": 5
     },
     "note": "Cancel workflow"
    },
    {
     "say": "Delete is irreversible, so it only ever runs after a confirmation.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5
     ]
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why might an app save a blank task even though the user typed a title?",
   "options": [
    "The title field is the wrong colour",
    "The page wasn't previewed first",
    "The input's value wasn't mapped to the title field"
   ],
   "answer": 2,
   "good": "That's right. The input's value wasn't mapped to the title field in the Create a new thing action.",
   "bad": "Not quite. The input's value wasn't mapped to the title field in the Create a new thing action.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why might an app save a blank task even though the user typed a title?",
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
     "Users create tasks, with validation",
     ""
    ],
    [
     "Users mark tasks done",
     ""
    ],
    [
     "Delete asks for confirmation",
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
     "say": "users can create tasks themselves, with validation,",
     "show": 1
    },
    {
     "say": "mark them done,",
     "show": 2
    },
    {
     "say": "and delete them after a confirmation popup.",
     "show": 3
    },
    {
     "say": "Next, in Module 5, user accounts and private data.",
     "show": 3
    }
   ]
  }
 ]
}
```

---

## Project 5 (Module 5): Add User Accounts and Private Data

**Goal:** Let people sign up, log in, and see only their own data.

**Time:** about 2 hours

**Step 1: Understand the User type.**
Bubble gives every app a built-in User data type for accounts, and you can add your own fields to it, like `name`. Because accounts are so common, you do not have to build login from scratch. (Nothing in this project fills `name` yet; if you want it, add a Name input to the sign-up form and, in the Sign the user up action, click Change another field and set `name` to that input's value.)

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

> **Heads-up:** the three sample tasks you added by hand in Module 2 were created before this field existed, so their `creator` is empty. Once you filter by creator (Step 7) and add the privacy rule (Step 8), they disappear from every list. To keep them, either open each one in Data → App data and set its `creator` to your test user, or delete them and re-create them through your app while logged in.

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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "fingerprint",
   "kicker": "Project 5 · Accounts and privacy",
   "title": "Only your own tasks",
   "beats": [
    {
     "say": "Welcome to Project 5."
    },
    {
     "say": "Now people sign up, log in, and see only their own data."
    },
    {
     "say": "Bubble gives every app a built-in User type, so you don't build login from scratch."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 1 to 5",
   "title": "The front door: sign up, log in, log out",
   "nodes": [
    {
     "id": "form",
     "label": "Email + password",
     "x": 14,
     "y": 50,
     "sub": "password format",
     "art": "password"
    },
    {
     "id": "users",
     "label": "User type",
     "x": 50,
     "y": 50,
     "sub": "built-in · + name",
     "art": "idcard"
    },
    {
     "id": "cu",
     "label": "Current User",
     "x": 86,
     "y": 50,
     "sub": "who's logged in",
     "art": "persona"
    }
   ],
   "edges": [
    {
     "from": "form",
     "to": "users"
    },
    {
     "from": "users",
     "to": "cu"
    }
   ],
   "beats": [
    {
     "say": "Add email and password inputs, with the password's content format set to Password.",
     "show": 1,
     "on": "form"
    },
    {
     "say": "The Sign up button runs Sign the user up, which creates a new User.",
     "show": 2,
     "on": "users",
     "send": {
      "from": "form",
      "to": "users",
      "label": "Sign the user up"
     }
    },
    {
     "say": "And it also logs them in, so they become the Current User.",
     "show": 3,
     "on": "cu",
     "send": {
      "from": "users",
      "to": "cu",
      "label": "logged in"
     }
    },
    {
     "say": "Returning users press Log in, which runs Log the user in.",
     "on": "users",
     "send": {
      "from": "form",
      "to": "users",
      "label": "Log the user in"
     }
    },
    {
     "say": "Current User is whoever is logged in right now. That's how an app personalises itself.",
     "on": "cu",
     "send": {
      "from": "users",
      "to": "cu",
      "label": "logged in"
     }
    },
    {
     "say": "And a Log out button runs Log the user out.",
     "on": "form"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 6 and 7",
   "title": "Give every task an owner, then filter",
   "columns": [
    "title",
    "creator"
   ],
   "rows": [
    [
     "Email the client",
     "Amara"
    ],
    [
     "Draft the report",
     "Ben"
    ],
    [
     "Book a room",
     "Amara"
    ],
    [
     "Call the bank",
     "Ben"
    ]
   ],
   "beats": [
    {
     "say": "Add a creator field, of type User, to Task.",
     "col": 1
    },
    {
     "say": "In Create a new Task, set creator to Current User, so every task records who made it.",
     "sql": "Create a new Task\ncreator = Current User",
     "col": 1
    },
    {
     "say": "Here, two users, Amara and Ben, have each made two tasks.",
     "col": 1
    },
    {
     "say": "Now change the list's data source to search only for tasks whose creator is Current User.",
     "sql": "Search for Tasks\nconstraint: creator = Current User"
    },
    {
     "say": "With Amara logged in, her list shows just her two tasks.",
     "hl": [
      0,
      2
     ],
     "dim": true,
     "col": 1
    },
    {
     "say": "With Ben logged in, the very same list shows only his.",
     "hl": [
      1,
      3
     ],
     "dim": true,
     "col": 1
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Why the filter alone isn't protection",
   "nodes": [
    {
     "id": "amara",
     "label": "Amara's browser",
     "x": 16,
     "y": 50,
     "sub": "logged in as Amara",
     "art": "browser"
    },
    {
     "id": "db",
     "label": "Database",
     "x": 84,
     "y": 50,
     "sub": "4 Task records",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "amara",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "Amara's list asks only for her own tasks.",
     "show": 2,
     "on": "amara",
     "send": {
      "from": "amara",
      "to": "db",
      "label": "creator = me"
     }
    },
    {
     "say": "And gets two back. Looks private.",
     "on": "db",
     "send": {
      "from": "db",
      "to": "amara",
      "label": "2 tasks"
     }
    },
    {
     "say": "But the filter only changes what one list shows. Data can be loaded another way, without that filter.",
     "on": "amara",
     "send": {
      "from": "amara",
      "to": "db",
      "label": "all Tasks"
     }
    },
    {
     "say": "With no privacy rule, the database would hand back all four, including Ben's.",
     "on": "db",
     "send": {
      "from": "db",
      "to": "amara",
      "label": "4 tasks"
     }
    },
    {
     "say": "With a privacy rule on Task, the database itself refuses, and returns only Amara's two.",
     "on": "db",
     "send": {
      "from": "db",
      "to": "amara",
      "label": "2 tasks only"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 8",
   "title": "The privacy rule on Task",
   "columns": [
    "Who",
    "Find in searches",
    "View all fields"
   ],
   "rows": [
    [
     "Creator = Current User",
     "yes",
     "yes"
    ],
    [
     "Everyone else, default",
     "yes",
     "yes"
    ],
    [
     "Everyone else, fixed",
     "no",
     "no"
    ]
   ],
   "beats": [
    {
     "say": "Privacy rules control which records a user is even allowed to load, enforced by the database."
    },
    {
     "say": "In the Data tab, under Privacy, add a rule on Task: when this Task's creator is Current User.",
     "sql": "This Task's creator is Current User",
     "hl": 0,
     "dim": true,
     "col": 0
    },
    {
     "say": "Allow finding it in searches, and viewing all fields.",
     "hl": 0,
     "dim": true,
     "col": 1
    },
    {
     "say": "But watch the Everyone else row. Those permissions are on by default.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "So uncheck them. Now nobody else can find or view your tasks.",
     "hl": [
      0,
      2
     ],
     "dim": true
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why is filtering the list by creator not enough on its own to protect data?",
   "options": [
    "It only changes what one list shows; the database must block other access",
    "Filters don't work for logged-in users",
    "It hides tasks from their own creator"
   ],
   "answer": 0,
   "good": "That's right. Filtering only changes what one list shows. The data could still be loaded another way unless the database blocks it with a privacy rule.",
   "bad": "Not quite. Filtering only changes what one list shows. The data could still be loaded another way unless the database blocks it with a privacy rule.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why is filtering the list by creator not enough on its own to protect data?",
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
     "Users sign up and log in",
     ""
    ],
    [
     "Each user sees only their own tasks",
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
     "say": "users can sign up and log in,",
     "show": 1
    },
    {
     "say": "and can only see and change their own tasks, enforced by privacy rules.",
     "show": 2
    },
    {
     "say": "Next, in Module 6, you polish, test and publish.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 6 (Module 6): Polish, Test, and Publish

**Goal:** Take your app from "works on my screen" to a shareable, tested product.

**Time:** about 2.5 hours

**Step 1: Test responsiveness.**
Use Bubble's responsive viewer to view your app at phone, tablet, and desktop widths. Most of your users will be on phones, so an app that only looks right on desktop will feel broken to them.

**Step 2: Fix layout issues per breakpoint.**
Adjust container widths, min-widths, and hidden elements so each width looks intentional. This is where an app goes from amateur to professional in the first few seconds.

**Step 3: Add an empty state.**
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
├── Empty state for the task list
├── Shared via version-test URL (Live deployment optional, paid plan)
├── product_readme.md
└── feedback_notes.md
```

### What You Learned
- ✅ Responsive testing and fixing layouts per width
- ✅ Designing an empty state
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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "rocket",
   "kicker": "Project 6 · Polish, test, publish",
   "title": "From my screen to anyone's",
   "beats": [
    {
     "say": "Welcome to the last project."
    },
    {
     "say": "You take the app from works on my screen, to a shareable, tested product."
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Steps 1 and 2",
   "title": "Check every width in the responsive viewer",
   "values": [
    "Phone",
    "Tablet",
    "Desktop"
   ],
   "beats": [
    {
     "say": "Open Bubble's responsive viewer, and step through three widths."
    },
    {
     "say": "Start with phone. Most of your users will be on phones, so look here hardest.",
     "hl": 0,
     "ptr": {
      "width": 0
     },
     "note": "Fix widths, min-widths, hidden elements"
    },
    {
     "say": "Then tablet. Adjust container widths and min widths until it looks intentional.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "width": 1
     },
     "note": "Fix widths, min-widths, hidden elements"
    },
    {
     "say": "Then desktop. Hide or show elements where a width needs it.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "width": 2
     },
     "note": "Fix widths, min-widths, hidden elements"
    },
    {
     "say": "Every width looks intentional. That's where an app goes from amateur to professional.",
     "ok": [
      0,
      1,
      2
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 3",
   "title": "An empty state tells users what to do",
   "columns": [
    "Tasks in list",
    "Repeating group",
    "Empty-state text"
   ],
   "rows": [
    [
     "0",
     "empty",
     "visible"
    ],
    [
     "3",
     "3 rows",
     "hidden"
    ]
   ],
   "beats": [
    {
     "say": "An empty screen looks like a bug. An empty state tells the user what to do next."
    },
    {
     "say": "Add a Text saying, No tasks yet, add your first one.",
     "col": 2
    },
    {
     "say": "Give it a condition, so it's visible only when the repeating group's list of Tasks has a count of zero.",
     "sql": "Visible only when\nRepeating Group's List of Tasks:count is 0",
     "col": 0
    },
    {
     "say": "A brand new user has no tasks, so they see the friendly message.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Once they've added some, the message hides, and the list takes over.",
     "hl": 1,
     "dim": true
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Step 4",
   "title": "Test the whole journey, in order",
   "values": [
    "Sign up",
    "Create tasks",
    "Complete",
    "Delete one",
    "Log out",
    "Log back in",
    "Data persists?",
    "Still private?"
   ],
   "beats": [
    {
     "say": "Now click through as a real user, in order."
    },
    {
     "say": "Sign up as a brand new user, and create a few tasks.",
     "hl": [
      0,
      1
     ],
     "ptr": {
      "you": 1
     }
    },
    {
     "say": "Complete them, and delete one.",
     "ok": [
      0,
      1
     ],
     "hl": [
      2,
      3
     ],
     "ptr": {
      "you": 3
     }
    },
    {
     "say": "Log out, then log back in.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "hl": [
      4,
      5
     ],
     "ptr": {
      "you": 5
     }
    },
    {
     "say": "Are your tasks still there? And are they still private to you?",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5
     ],
     "hl": [
      6,
      7
     ],
     "ptr": {
      "you": 7
     }
    },
    {
     "say": "Running the journey in order catches gaps between features, which you miss testing pieces alone.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7
     ],
     "note": "Whole journey passes"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 5 and 6",
   "title": "Development versus Live",
   "nodes": [
    {
     "id": "ed",
     "label": "Editor",
     "x": 12,
     "y": 50,
     "sub": "you build here",
     "art": "laptop"
    },
    {
     "id": "dev",
     "label": "Development",
     "x": 46,
     "y": 50,
     "sub": "version-test · free",
     "art": "pencil"
    },
    {
     "id": "test",
     "label": "Testers",
     "x": 84,
     "y": 22,
     "sub": "private window",
     "art": "people"
    },
    {
     "id": "live",
     "label": "Live",
     "x": 84,
     "y": 78,
     "sub": "paid plan · optional",
     "art": "rocket"
    }
   ],
   "edges": [
    {
     "from": "ed",
     "to": "dev"
    },
    {
     "from": "dev",
     "to": "test"
    },
    {
     "from": "dev",
     "to": "live"
    }
   ],
   "beats": [
    {
     "say": "Bubble keeps two versions of your app.",
     "show": 2
    },
    {
     "say": "Everything you build goes into the development version, at the version test U R L.",
     "on": "dev",
     "send": {
      "from": "ed",
      "to": "dev",
      "label": "your changes"
     }
    },
    {
     "say": "On the free plan, that's what you share. Open the link in a private window and run through it as a new user.",
     "show": 3,
     "on": "test",
     "send": {
      "from": "dev",
      "to": "test",
      "label": "version-test URL"
     }
    },
    {
     "say": "Live is the version real users see. Deploying copies development to Live.",
     "show": 4,
     "on": "live",
     "send": {
      "from": "dev",
      "to": "live",
      "label": "Deploy to Live"
     }
    },
    {
     "say": "That step needs a paid plan, so it's optional. Keeping them separate lets you build without breaking what people use.",
     "on": [
      "dev",
      "live"
     ]
    }
   ]
  },
  {
   "kind": "flow",
   "art": "book",
   "kicker": "Lab · Steps 7 and 8",
   "title": "Document and get feedback",
   "steps": [
    "product_readme.md",
    "Two people, one task each",
    "feedback_notes.md"
   ],
   "beats": [
    {
     "say": "Write a short product README: what the app does, who it's for, how to use it, and its U R L.",
     "show": 1
    },
    {
     "say": "Send the link to two people, and ask them to complete one task.",
     "show": 2
    },
    {
     "say": "Note what confused them. Real users find issues you can't see because you built it.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "On the free plan, how do you share your app with testers?",
   "options": [
    "Deploy it to Live",
    "Send them the development URL ending in version-test",
    "Export it as a file"
   ],
   "answer": 1,
   "good": "That's right. On the free plan you share the development version, the bubbleapps dot i o address ending in version test.",
   "bad": "Not quite. On the free plan you share the development version, the bubbleapps dot i o address ending in version test.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "On the free plan, how do you share your app with testers?",
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
     "A responsive, shareable app",
     ""
    ],
    [
     "A product README",
     ""
    ],
    [
     "One round of user feedback",
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
     "say": "your app is responsive and shareable on its version test U R L, or Live on a paid plan,",
     "show": 1
    },
    {
     "say": "with a product README,",
     "show": 2
    },
    {
     "say": "and one round of user feedback.",
     "show": 3
    },
    {
     "say": "You've finished No-Code Web App Builder with Bubble. Well done.",
     "show": 3
    }
   ]
  }
 ]
}
```
