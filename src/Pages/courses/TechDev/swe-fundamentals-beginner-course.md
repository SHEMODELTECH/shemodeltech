<!-- order: 1 -->
# Build Your First Product: A Beginner's Course in Software Engineering Fundamentals

## Course Overview

**By the end of this course, you'll be able to:**
- Write a one-page spec that defines the problem, users, core flow, non-goals, and one success metric
- Build and run a small FastAPI backend with endpoints that save data to a database through an ORM
- Choose a data structure (such as a heap) by reasoning about Big O, and explain the trade-off
- Hash passwords safely and check each endpoint for authentication, authorization, and input validation
- Call an LLM from server code and validate its output against a schema before trusting it
- Test your code with pytest, work on branches with pull requests, and ship with Docker and GitHub Actions CI

**Who this is for:** Someone who is new to software engineering - you may have written a few lines of code before, or none at all. No prior experience with backends, databases, or AI tools is assumed.

**What you'll build:** TrackIt, a real task-tracking app with an AI-powered "quick add" feature, built one module at a time.

**How the course works:** Ten modules. Each module has:
- **Concepts** - explained in plain language before any code
- **Lab** - step-by-step hands-on work
- **Checkpoint** - what you should have working by the end
- **Quiz** - five questions to check understanding
- **Time estimate** - for a beginner going carefully, not rushing

**Tools you'll need (install before Module 0):**
- A computer (Mac, Windows, or Linux all work)
- [Python 3.12+](https://www.python.org/downloads/) installed
- [VS Code](https://code.visualstudio.com/) or any code editor
- A terminal (Terminal on Mac, PowerShell/WSL on Windows)
- A free [GitHub](https://github.com) account

Don't worry about understanding all of these terms yet - Module 0 explains each one.

---

## Module 0: Setup and Programming Basics
**Time estimate: 3-4 hours**

### Concepts

Before building anything, you need three things in place: a way to write code, a way to run code, and a way to save your work so you don't lose it.

- **The terminal** is a text-based way to talk to your computer - instead of clicking icons, you type commands. It looks intimidating but you only need a handful of commands to start.
- **Python** is the programming language we'll use. A programming language is just a precise way of giving instructions to a computer.
- **A variable** stores a piece of information with a name, e.g. `age = 25`.
- **A function** is a reusable block of instructions you can call by name, so you don't retype the same logic everywhere.
- **Git** tracks changes to your code over time, like "track changes" in a document, but built for code and for working with other people.

### Lab

**1. Confirm Python is installed:**
```bash
python --version
```
You should see something like `Python 3.12.x`. On Mac or Linux, if `python` isn't found, try `python3 --version` and use `python3` wherever this course says `python`. If you still see an error, revisit the install step above.

**2. Open your terminal and try basic navigation:**
```bash
pwd          # prints where you currently are
ls           # lists files in the current folder (dir on Windows)
mkdir trackit
cd trackit
```

**3. Write your first Python file.** Create a file called `hello.py`:
```python
# hello.py
def greet(name):
    return f"Hello, {name}! Welcome to TrackIt."

message = greet("Engineer")
print(message)
```
Run it:
```bash
python hello.py
```
You should see `Hello, Engineer! Welcome to TrackIt.` printed.

**4. Set up Git:**
```bash
git init
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git add hello.py
git commit -m "First commit: hello world"
```

### Checkpoint
You can open a terminal, navigate folders, run a Python file, and have made your first git commit.

### Quiz
1. What does a terminal let you do that clicking icons doesn't?
2. What is the difference between a variable and a function?
3. What command shows you which folder you're currently in?
4. Why would you use git instead of just saving files with different names like `hello_v2.py`?
5. What does `python hello.py` actually do?

*Answers: 1) Give precise text commands directly to the computer. 2) A variable stores a value; a function stores reusable instructions. 3) `pwd`. 4) Git tracks every change with history and messages, and lets you undo or collaborate safely. 5) It tells Python to read and execute the instructions in that file.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "laptop",
   "kicker": "Module 0 · Setup and basics",
   "title": "Get ready to build",
   "beats": [
    {
     "say": "Welcome to Build Your First Product."
    },
    {
     "say": "Over ten modules you'll build TrackIt, a real task app with an AI quick add feature."
    },
    {
     "say": "Before building anything, you need three things: a way to write code, a way to run it, and a way to save your work."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Five words you'll use every day",
   "title": "The basics",
   "columns": [
    "Word",
    "What it is",
    "Example"
   ],
   "rows": [
    [
     "Terminal",
     "Type commands instead of clicking",
     "pwd"
    ],
    [
     "Python",
     "The language we'll use",
     "python hello.py"
    ],
    [
     "Variable",
     "A named piece of information",
     "age = 25"
    ],
    [
     "Function",
     "Reusable instructions you call by name",
     "greet(\"Engineer\")"
    ],
    [
     "Git",
     "Tracks every change to your code",
     "git commit"
    ]
   ],
   "beats": [
    {
     "say": "Here are five ideas you'll use in every module, each with a tiny example.",
     "col": 0
    },
    {
     "say": "The terminal. Instead of clicking icons, you type commands to your computer.",
     "hl": 0
    },
    {
     "say": "Python. The programming language we'll use, a precise way of giving instructions.",
     "hl": 1
    },
    {
     "say": "A variable stores a piece of information with a name, like age equals twenty five.",
     "hl": 2
    },
    {
     "say": "A function is a block of instructions you call by name, so you never retype the same logic.",
     "hl": 3
    },
    {
     "say": "And Git tracks every change to your code, like track changes in a document, built for code and teams.",
     "hl": 4,
     "dim": true
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 1 and 2",
   "title": "Check Python, then move around",
   "file": "Terminal",
   "code": "python --version\npwd\nmkdir trackit\ncd trackit\npwd\nls",
   "beats": [
    {
     "say": "Open your terminal and type python, dash dash version.",
     "line": 1
    },
    {
     "say": "You should see something like Python three point twelve. On a Mac, try python three if this fails.",
     "line": 1,
     "out": "Python 3.12.4"
    },
    {
     "say": "P W D prints the folder you're standing in. Yours will show your own name.",
     "line": 2,
     "vars": {
      "folder": "/Users/you"
     },
     "out": "/Users/you"
    },
    {
     "say": "M K D I R trackit makes a new, empty folder called trackit. It prints nothing.",
     "line": 3
    },
    {
     "say": "C D trackit moves you into it.",
     "line": 4,
     "vars": {
      "folder": "/Users/you/trackit"
     }
    },
    {
     "say": "Ask P W D again, and the path now ends in trackit.",
     "line": 5,
     "out": "/Users/you/trackit"
    },
    {
     "say": "L S lists the files here. The folder is brand new, so it prints nothing yet. On Windows, use dir.",
     "line": 6
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 3",
   "title": "Your first Python file, running",
   "file": "hello.py",
   "code": "def greet(name):\n    return f\"Hello, {name}! Welcome to TrackIt.\"\n\nmessage = greet(\"Engineer\")\nprint(message)",
   "beats": [
    {
     "say": "You run this with python hello dot p y. Python reads it from the top.",
     "line": 1
    },
    {
     "say": "Def only defines the function greet. Nothing inside it runs yet.",
     "line": [
      1,
      2
     ]
    },
    {
     "say": "Line four calls greet, and hands it the word Engineer.",
     "line": 4
    },
    {
     "say": "Inside greet, the variable name now holds Engineer.",
     "line": 1,
     "vars": {
      "name": "\"Engineer\""
     }
    },
    {
     "say": "The f string drops the name into the sentence and returns it.",
     "line": 2
    },
    {
     "say": "That sentence is stored in the variable message.",
     "line": 4,
     "vars": {
      "message": "\"Hello, Engineer! Welcome to TrackIt.\""
     }
    },
    {
     "say": "And print shows it in the terminal.",
     "line": 5,
     "out": "Hello, Engineer! Welcome to TrackIt."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 4",
   "title": "Save your work with Git",
   "nodes": [
    {
     "id": "dir",
     "label": "trackit folder",
     "x": 12,
     "y": 50,
     "sub": "hello.py",
     "art": "file"
    },
    {
     "id": "stage",
     "label": "Picked to save",
     "x": 50,
     "y": 50,
     "sub": "git add",
     "art": "checklist"
    },
    {
     "id": "hist",
     "label": "History",
     "x": 88,
     "y": 50,
     "sub": "every commit, forever",
     "art": "git"
    }
   ],
   "edges": [
    {
     "from": "dir",
     "to": "stage"
    },
    {
     "from": "stage",
     "to": "hist"
    }
   ],
   "beats": [
    {
     "say": "Last step. Git init starts tracking your trackit folder, and two config lines tell Git your name and email.",
     "show": 1,
     "on": "dir"
    },
    {
     "say": "Git add hello dot p y picks the file you want to save.",
     "show": 2,
     "on": "stage",
     "send": {
      "from": "dir",
      "to": "stage",
      "label": "git add hello.py"
     }
    },
    {
     "say": "Git commit saves a snapshot of it into the history, with a message describing the change.",
     "show": 3,
     "on": "hist",
     "send": {
      "from": "stage",
      "to": "hist",
      "label": "commit: \"First commit: hello world\""
     }
    },
    {
     "say": "Each commit is a labelled point you can return to. No more hello v two, or hello final final.",
     "show": 3,
     "on": "hist"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why use Git instead of saving files like hello_v2.py?",
   "options": [
    "Git makes your code run faster",
    "Git keeps every change with history and messages, so you can undo and collaborate",
    "Git stores your files online automatically"
   ],
   "answer": 1,
   "good": "That's right. Git tracks every change with history and messages, and lets you undo or work with others safely.",
   "bad": "Not quite. Git tracks every change with history and messages, and lets you undo or work with others safely.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why use Git instead of saving copies like hello underscore v two dot p y?",
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
     "Open a terminal",
     ""
    ],
    [
     "Move between folders",
     ""
    ],
    [
     "Run a Python file",
     ""
    ],
    [
     "Make your first Git commit",
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
     "say": "Open a terminal,",
     "show": 1
    },
    {
     "say": "move between folders,",
     "show": 2
    },
    {
     "say": "run a Python file,",
     "show": 3
    },
    {
     "say": "and you've made your first Git commit.",
     "show": 4
    },
    {
     "say": "Next, in Module 1, you decide what TrackIt should do.",
     "show": 4
    }
   ]
  }
 ]
}
```

---

## Module 1: Product Sense - Deciding What to Build
**Time estimate: 1-2 hours**

### Concepts

Before any code, real engineers ask: what problem are we solving, and for whom? Skipping this step is why many side projects never get finished - there's no clear target to build toward.

A **spec** is a short document that answers:
- **Problem** - what pain point exists?
- **Users** - who exactly has this problem?
- **Core flow** - the handful of steps a user takes to get value
- **Non-goals** - what you're deliberately NOT building yet
- **Success metric** - one number that tells you it's working

### Lab

Write TrackIt's spec yourself, in a file called `SPEC.md`, using this template:

```
Problem: People abandon task apps because logging tasks feels like admin work
Users: Individuals managing personal projects
Core flow: sign up -> type a task in plain English -> AI structures it -> see it on a list -> mark done
Non-goals: no team collaboration, no mobile app, no recurring tasks (v1)
Success metric: time from "open app" to "task logged" under 10 seconds
```

Now rewrite one section in your own words, imagining you're explaining TrackIt to a friend who has never seen it.

```lab
{
 "type": "sort",
 "title": "Which part of the spec is this?",
 "prompt": "Each line comes from TrackIt's spec. Put it under the right heading.",
 "buckets": [
  "Problem",
  "Users",
  "Core flow",
  "Non-goals",
  "Success metric"
 ],
 "items": [
  {
   "text": "People lose track of small tasks spread across notes, chats, and apps.",
   "bucket": "Problem",
   "why": "It names the pain point."
  },
  {
   "text": "Busy students and early-career professionals.",
   "bucket": "Users",
   "why": "It says exactly who has the problem."
  },
  {
   "text": "Type a task in plain English, see it structured on a list, mark it done.",
   "bucket": "Core flow",
   "why": "The handful of steps a user takes to get value."
  },
  {
   "text": "No team sharing or calendar sync in version 1.",
   "bucket": "Non-goals",
   "why": "It's deliberately left out for now."
  },
  {
   "text": "Time from opening the app to logging a task.",
   "bucket": "Success metric",
   "why": "One number that tells you it's working."
  }
 ]
}
```

### Checkpoint
A `SPEC.md` file exists in your project folder and you can explain the product in three sentences without notes.

### Quiz
1. Why write a spec before writing code?
2. What's the difference between a "non-goal" and something you forgot to think about?
3. Why does a spec need exactly one success metric instead of five?
4. Who is TrackIt's spec saying the product is NOT for?
5. What happens to a team that skips this step?

*Answers: 1) It forces clarity on what you're actually solving and prevents wasted work. 2) A non-goal is a deliberate, stated exclusion; forgetting something is an oversight. 3) One metric forces focus; five metrics let you claim success no matter what happens. 4) Teams, not individuals. 5) They tend to build unfocused features and struggle to know if the product is working.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "compass",
   "kicker": "Module 1 · Product Sense",
   "title": "Deciding what to build",
   "beats": [
    {
     "say": "Welcome to Module 1."
    },
    {
     "say": "Before we write more code, we'll answer the question real engineers always ask first."
    },
    {
     "say": "What are we building, and who is it for?"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "The tool",
   "title": "A spec answers five questions",
   "columns": [
    "Section",
    "It asks",
    "TrackIt's answer"
   ],
   "rows": [
    [
     "Problem",
     "What pain point exists?",
     "Logging tasks feels like admin work"
    ],
    [
     "Users",
     "Who exactly has it?",
     "Individuals managing personal projects"
    ],
    [
     "Core flow",
     "Steps to get value",
     "Type it, AI structures it, mark done"
    ],
    [
     "Non-goals",
     "What we won't build yet",
     "Teams, mobile app, recurring tasks"
    ],
    [
     "Success metric",
     "One number that says it works",
     "Task logged in under 10 seconds"
    ]
   ],
   "beats": [
    {
     "say": "Skipping this step is why many side projects never finish. There's no clear target.",
     "col": 0
    },
    {
     "say": "A spec is a short document that answers five questions. Here they are, with TrackIt's answers.",
     "col": 1
    },
    {
     "say": "The problem: people abandon task apps, because logging tasks feels like admin work.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "The users: individuals managing personal projects.",
     "hl": 1,
     "col": 2
    },
    {
     "say": "The core flow: the handful of steps a user takes to get value.",
     "hl": 2,
     "col": 2
    },
    {
     "say": "Non-goals: what you're deliberately not building yet.",
     "hl": 3,
     "col": 2
    },
    {
     "say": "And one success metric: a task logged in under ten seconds.",
     "hl": 4,
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Example: TrackIt · Core flow",
   "title": "The shortest path to value",
   "nodes": [
    {
     "id": "signup",
     "label": "Sign up",
     "x": 10,
     "y": 30,
     "art": "idcard"
    },
    {
     "id": "type",
     "label": "Type a task",
     "x": 40,
     "y": 30,
     "sub": "plain English",
     "art": "pencil"
    },
    {
     "id": "ai",
     "label": "AI structures it",
     "x": 72,
     "y": 30,
     "sub": "title, date, priority",
     "art": "sparkle"
    },
    {
     "id": "list",
     "label": "See it on a list",
     "x": 72,
     "y": 78,
     "art": "checklist"
    },
    {
     "id": "done",
     "label": "Mark done",
     "x": 30,
     "y": 78,
     "art": "proof"
    }
   ],
   "edges": [
    {
     "from": "signup",
     "to": "type"
    },
    {
     "from": "type",
     "to": "ai"
    },
    {
     "from": "ai",
     "to": "list"
    },
    {
     "from": "list",
     "to": "done"
    }
   ],
   "beats": [
    {
     "say": "The core flow is the shortest path from opening the app to getting value. First, sign up.",
     "show": 1,
     "on": "signup"
    },
    {
     "say": "Then type a task in plain English.",
     "show": 2,
     "on": "type",
     "send": {
      "from": "signup",
      "to": "type",
      "label": "new user"
     }
    },
    {
     "say": "The AI turns that sentence into a structured task.",
     "show": 3,
     "on": "ai",
     "send": {
      "from": "type",
      "to": "ai",
      "label": "\"Finish the report by Friday\""
     }
    },
    {
     "say": "It appears on your list.",
     "show": 4,
     "on": "list",
     "send": {
      "from": "ai",
      "to": "list",
      "label": "title · due date · priority"
     }
    },
    {
     "say": "And you mark it done. Five steps. If your flow needs twenty, it's too big for version one.",
     "show": 5,
     "on": "done",
     "send": {
      "from": "list",
      "to": "done",
      "label": "✓"
     }
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Example: TrackIt · Non-goals",
   "title": "Saying no, on purpose",
   "values": [
    "Sign up",
    "AI quick add",
    "Task list",
    "Mark done",
    "Team collaboration",
    "Mobile app",
    "Recurring tasks"
   ],
   "beats": [
    {
     "say": "Here are seven features someone might want in TrackIt."
    },
    {
     "say": "The first four are the core flow. They're in version one.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "note": "version 1"
    },
    {
     "say": "Team collaboration, a mobile app, and recurring tasks are written down as non-goals.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "gone": [
      4,
      5,
      6
     ],
     "note": "non-goals (v1)"
    },
    {
     "say": "A non-goal is a deliberate, stated choice. Something you simply forgot is an oversight.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "gone": [
      4,
      5,
      6
     ],
     "hl": [
      4,
      5,
      6
     ]
    },
    {
     "say": "It also says who TrackIt is not for yet: teams.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "gone": [
      5,
      6
     ],
     "hl": 4,
     "note": "for individuals, not teams"
    }
   ]
  },
  {
   "kind": "big",
   "art": "stopwatch",
   "kicker": "Example: TrackIt · Success metric",
   "title": "One number",
   "big": "Under 10 s",
   "sub": "from opening the app to logging a task",
   "beats": [
    {
     "say": "Finally, one success metric.",
     "show": 0
    },
    {
     "say": "For TrackIt, it's the time from opening the app to logging a task.",
     "show": 1
    },
    {
     "say": "The goal is under ten seconds.",
     "show": 2
    },
    {
     "say": "Why only one number? With five, you can always claim success. With one, you have to focus.",
     "show": 2
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Your turn · Lab",
   "title": "Which part of the spec is this?",
   "columns": [
    "Line from a spec",
    "Section"
   ],
   "rows": [
    [
     "People lose track of small tasks spread across notes, chats, and apps.",
     "Problem"
    ],
    [
     "Busy students and early-career professionals.",
     "Users"
    ],
    [
     "Type a task in plain English, see it structured on a list, mark it done.",
     "Core flow"
    ],
    [
     "No team sharing or calendar sync in version 1.",
     "Non-goals"
    ],
    [
     "Time from opening the app to logging a task.",
     "Success metric"
    ]
   ],
   "beats": [
    {
     "say": "Now practise. Each line comes from a spec. Which section does it belong in?",
     "col": 0
    },
    {
     "say": "Losing track of tasks across notes and chats names a pain point. That's the problem.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "Busy students and early-career professionals says exactly who. Users.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "Type, see it structured, mark it done. Those are the steps to value: the core flow.",
     "hl": 2,
     "col": 1
    },
    {
     "say": "No team sharing in version one is left out on purpose. A non-goal.",
     "hl": 3,
     "col": 1
    },
    {
     "say": "And time to log a task is the one number. Then write SPEC dot M D in your own words.",
     "hl": 4,
     "dim": true,
     "col": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why exactly one success metric instead of five?",
   "options": [
    "More metrics take longer to measure",
    "One forces focus; five let you claim success whatever happens",
    "Investors only read one number"
   ],
   "answer": 1,
   "good": "That's right. One metric forces focus. With five, you could claim success whatever happens.",
   "bad": "Not quite. One metric forces focus. With five, you could claim success whatever happens.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why exactly one success metric instead of five?",
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
     "SPEC.md is in your project folder",
     ""
    ],
    [
     "You can explain TrackIt in three sentences, without notes",
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
     "say": "SPEC dot M D is in your project folder,",
     "show": 1
    },
    {
     "say": "and you can explain TrackIt in three sentences, without notes.",
     "show": 2
    },
    {
     "say": "Next, in Module 2, you build your first A P I.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 2: Your First API (Programming Fundamentals in Practice)
**Time estimate: 3-5 hours**

### Concepts

An **API** (Application Programming Interface) is how one piece of software talks to another - in our case, how a web browser or app will talk to your backend code. A **web framework** (we'll use FastAPI) handles the repetitive plumbing of receiving requests and sending responses, so you focus on logic.

An **endpoint** is a specific URL your API responds to, like `/health` or `/tasks`.

### Lab

**1. Set up your project environment:**
```bash
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install fastapi uvicorn
```

A **virtual environment** (`venv`) keeps this project's installed packages separate from other projects, so they don't conflict.

**2. Write your first endpoint:**
```python
# main.py
from fastapi import FastAPI

app = FastAPI(title="TrackIt API")

@app.get("/health")
def health_check():
    return {"status": "ok"}
```

**3. Run it:**
```bash
uvicorn main:app --reload
```
Open `http://localhost:8000/health` in your browser. You should see `{"status": "ok"}`.

**4. Add a second endpoint that takes input:**
```python
@app.get("/greet/{name}")
def greet(name: str):
    return {"message": f"Hello, {name}!"}
```
Visit `http://localhost:8000/greet/YourName` and see it respond dynamically.

### Checkpoint
Your API runs locally and responds to two different endpoints, one of which takes input from the URL.

### Quiz
1. What is an API, in your own words?
2. Why use a virtual environment instead of installing packages globally?
3. What does `@app.get("/health")` tell FastAPI to do?
4. What's the difference between `/health` and `/greet/{name}`?
5. What command starts your server?

*Answers: 1) A way for software to communicate with other software over defined rules. 2) To keep each project's dependencies isolated and avoid version conflicts. 3) Respond to GET requests at the `/health` URL by running the function below it. 4) `/health` takes no input; `/greet/{name}` accepts a variable value in the URL. 5) `uvicorn main:app --reload`.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "api",
   "kicker": "Module 2 · Your first API",
   "title": "Make your code answer requests",
   "beats": [
    {
     "say": "Welcome to Module 2."
    },
    {
     "say": "Today TrackIt gets a backend that answers requests from a browser."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concepts",
   "title": "How a request reaches your code",
   "nodes": [
    {
     "id": "browser",
     "label": "Browser",
     "x": 12,
     "y": 50,
     "sub": "localhost:8000",
     "art": "browser"
    },
    {
     "id": "fw",
     "label": "FastAPI app",
     "x": 50,
     "y": 50,
     "sub": "the web framework",
     "art": "server"
    },
    {
     "id": "fn",
     "label": "health_check()",
     "x": 88,
     "y": 50,
     "sub": "your function",
     "art": "code"
    }
   ],
   "edges": [
    {
     "from": "browser",
     "to": "fw"
    },
    {
     "from": "fw",
     "to": "fn"
    }
   ],
   "beats": [
    {
     "say": "An A P I is how one piece of software talks to another. Here, a browser talks to your backend.",
     "show": 3
    },
    {
     "say": "The browser asks for one address on your server, an endpoint, slash health.",
     "on": "browser",
     "send": {
      "from": "browser",
      "to": "fw",
      "label": "GET /health"
     }
    },
    {
     "say": "FastAPI, the web framework, handles the plumbing. It finds the function for that endpoint and runs it.",
     "on": "fw",
     "send": {
      "from": "fw",
      "to": "fn",
      "label": "/health"
     }
    },
    {
     "say": "Your function returns a small dictionary.",
     "on": "fn",
     "send": {
      "from": "fn",
      "to": "fw",
      "label": "{\"status\": \"ok\"}"
     }
    },
    {
     "say": "And FastAPI turns it into a J S O N response for the browser. You only wrote the logic.",
     "on": "browser",
     "send": {
      "from": "fw",
      "to": "browser",
      "label": "200 · {\"status\":\"ok\"}"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 1",
   "title": "A clean space for this project",
   "file": "Terminal",
   "code": "python -m venv venv\nsource venv/bin/activate   # Windows: venv\\Scripts\\activate\npip install fastapi uvicorn",
   "beats": [
    {
     "say": "First, make a virtual environment, a private folder of packages just for this project.",
     "line": 1,
     "vars": {
      "venv/": "created, empty"
     }
    },
    {
     "say": "Activate it. From now on, pip installs into this project only.",
     "line": 2,
     "vars": {
      "active": "venv"
     },
     "out": "(venv) $"
    },
    {
     "say": "Install FastAPI, and uvicorn, the server that runs it.",
     "line": 3,
     "vars": {
      "venv/": "fastapi, uvicorn"
     }
    },
    {
     "say": "Another project can use different versions without any conflict.",
     "line": 3
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 2 to 4",
   "title": "Two endpoints, two requests",
   "file": "main.py",
   "code": "from fastapi import FastAPI\n\napp = FastAPI(title=\"TrackIt API\")\n\n@app.get(\"/health\")\ndef health_check():\n    return {\"status\": \"ok\"}\n\n@app.get(\"/greet/{name}\")\ndef greet(name: str):\n    return {\"message\": f\"Hello, {name}!\"}",
   "beats": [
    {
     "say": "Here's main dot p y. Line three creates the app, called TrackIt A P I.",
     "line": [
      1,
      3
     ]
    },
    {
     "say": "At sign app dot get slash health tells FastAPI: answer requests to slash health with the function below.",
     "line": [
      5,
      6
     ]
    },
    {
     "say": "Start it with uvicorn main colon app, dash dash reload. Reload restarts it whenever you save.",
     "line": 3,
     "out": "Uvicorn running on http://127.0.0.1:8000"
    },
    {
     "say": "Visit localhost, port eight thousand, slash health. Health check runs, and returns status ok.",
     "line": [
      6,
      7
     ],
     "out": "GET /health → {\"status\":\"ok\"}"
    },
    {
     "say": "The second endpoint has curly brackets around name. That part of the address is a variable.",
     "line": 9
    },
    {
     "say": "Visit slash greet slash Ada, and name becomes Ada.",
     "line": [
      9,
      10
     ],
     "vars": {
      "name": "\"Ada\""
     }
    },
    {
     "say": "The f string builds the message. Hello, Ada!",
     "line": 11,
     "out": "GET /greet/Ada → {\"message\":\"Hello, Ada!\"}"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Trace it",
   "title": "Which function answers each address?",
   "columns": [
    "You visit",
    "Matches",
    "name",
    "Response"
   ],
   "rows": [
    [
     "/health",
     "health_check",
     "—",
     "{\"status\":\"ok\"}"
    ],
    [
     "/greet/Ada",
     "greet",
     "Ada",
     "{\"message\":\"Hello, Ada!\"}"
    ],
    [
     "/greet/YourName",
     "greet",
     "YourName",
     "{\"message\":\"Hello, YourName!\"}"
    ],
    [
     "/tasks",
     "nothing yet",
     "—",
     "404 {\"detail\":\"Not Found\"}"
    ]
   ],
   "beats": [
    {
     "say": "FastAPI compares each address you visit with the endpoints you wrote.",
     "col": 0
    },
    {
     "say": "Slash health has no input. It always gives the same answer.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "Anything after slash greet slash is captured as name, and comes back in the message.",
     "hl": [
      1,
      2
     ],
     "col": 2
    },
    {
     "say": "Slash tasks doesn't match any endpoint yet, so FastAPI answers four oh four, not found.",
     "hl": 3,
     "dim": true,
     "col": 3
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does @app.get(\"/health\") tell FastAPI to do?",
   "options": [
    "Download the health page from the internet",
    "Answer requests to /health by running the function below it",
    "Check whether your computer is healthy"
   ],
   "answer": 1,
   "good": "That's right. It tells FastAPI to answer requests at slash health by running the function underneath.",
   "bad": "Not quite. It tells FastAPI to answer requests at slash health by running the function underneath.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does at sign app dot get, slash health, tell FastAPI to do?",
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
     "Your API runs locally",
     ""
    ],
    [
     "It answers two endpoints, one taking input from the URL",
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
     "say": "your A P I runs on your computer,",
     "show": 1
    },
    {
     "say": "and answers two endpoints, one of which takes input from the address.",
     "show": 2
    },
    {
     "say": "Next, in Module 3, you make TrackIt fast.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 3: Data Structures & Algorithms - Making It Fast
**Time estimate: 4-5 hours**

### Concepts

A **data structure** is a way of organizing information so certain operations are fast. Using the wrong one makes your app slow as it grows - even if it feels fine with 10 items, it might crawl with 10,000.

A **heap** is a data structure that always keeps the "smallest" (or "most urgent") item easy to grab, without needing to sort the entire list every time.

**Big O notation** is a way of describing how an operation's speed changes as data grows. `O(1)` means constant speed regardless of size; `O(n log n)` means it slows down as data grows, but not drastically.

### Lab

**1. The naive approach (what NOT to scale):**
```python
def next_task_naive(tasks):
    sorted_tasks = sorted(tasks, key=lambda t: (t.due_date, t.priority))
    return sorted_tasks[0]
```
This re-sorts the *entire* list every single time you want just one item - wasteful as the list grows.

**2. The better approach, using a heap:**
```python
# priority.py
from dataclasses import dataclass
from datetime import date
import heapq

@dataclass
class Task:
    id: int
    title: str
    due_date: date
    priority: int  # 1 = highest

    def __lt__(self, other):
        return (self.due_date, self.priority) < (other.due_date, other.priority)

class TaskQueue:
    def __init__(self):
        self._heap: list[Task] = []

    def add(self, task: Task):
        heapq.heappush(self._heap, task)

    def next_up(self) -> Task:
        return self._heap[0]

    def complete_next(self) -> Task:
        return heapq.heappop(self._heap)
```

**3. Try it.** Create `try_priority.py` in the same folder and run `python try_priority.py`:
```python
from datetime import date, timedelta

from priority import Task, TaskQueue

q = TaskQueue()
q.add(Task(id=1, title="Later task", due_date=date.today() + timedelta(days=5), priority=1))
q.add(Task(id=2, title="Urgent task", due_date=date.today(), priority=3))

print(q.next_up().title)  # "Urgent task"
```

```lab
{
 "type": "sort",
 "title": "How fast is each operation?",
 "prompt": "Choose the Big O for each operation as the data grows.",
 "buckets": [
  "O(1)",
  "O(log n)",
  "O(n)",
  "O(n log n)"
 ],
 "items": [
  {
   "text": "Look up a user by ID in a dictionary",
   "bucket": "O(1)",
   "why": "Dictionary lookups take about the same time however big the dictionary is."
  },
  {
   "text": "Check whether a value is in an unsorted list",
   "bucket": "O(n)",
   "why": "In the worst case you look at every item."
  },
  {
   "text": "Binary search in a sorted list",
   "bucket": "O(log n)",
   "why": "Each step halves what's left to search."
  },
  {
   "text": "Sort a list of tasks by due date",
   "bucket": "O(n log n)",
   "why": "Good general-purpose sorting grows as n log n."
  },
  {
   "text": "Add a task to a heap",
   "bucket": "O(log n)",
   "why": "The new item moves up the heap's height, which grows as log n."
  },
  {
   "text": "Peek at the most urgent task in a heap",
   "bucket": "O(1)",
   "why": "It always sits at the top."
  }
 ]
}
```

### Checkpoint
You can explain why the heap version scales better than re-sorting, and you have `priority.py` working with a passing manual test.

### Quiz
1. Why is re-sorting the whole list every time considered wasteful?
2. What does a heap guarantee you fast access to?
3. What does `O(1)` mean compared to `O(n log n)`?
4. In `Task`, why do we define `__lt__`?
5. What would happen to `next_task_naive` as the task list grows to 100,000 items?

*Answers: 1) It repeats work - you only need the top item, not a fully ordered list. 2) The smallest/most urgent item, without scanning everything. 3) O(1) stays roughly the same speed regardless of data size; O(n log n) gets slower as data grows. 4) So Python knows how to compare two Task objects when sorting or heap-ordering them. 5) It would get noticeably slower on every single call, since it re-sorts everything each time.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "gauge",
   "kicker": "Module 3 · Data structures and algorithms",
   "title": "Making it fast",
   "beats": [
    {
     "say": "Welcome to Module 3."
    },
    {
     "say": "An app that feels fine with ten tasks can crawl with ten thousand."
    },
    {
     "say": "This module is about choosing the right tool so that doesn't happen."
    }
   ]
  },
  {
   "kind": "chart",
   "kicker": "Big O in plain words",
   "title": "Re-sorting every time vs. peeking at a heap",
   "xlabel": "number of tasks",
   "ylabel": "work per call (illustrative)",
   "points": [
    [
     10,
     5.5
    ],
    [
     25,
     19.2
    ],
    [
     40,
     35.2
    ],
    [
     55,
     52.5
    ],
    [
     70,
     70.9
    ],
    [
     85,
     90
    ],
    [
     10,
     4
    ],
    [
     25,
     4
    ],
    [
     40,
     4
    ],
    [
     55,
     4
    ],
    [
     70,
     4
    ],
    [
     85,
     4
    ]
   ],
   "beats": [
    {
     "say": "Big O describes how an operation's work changes as your data grows. Each dot is one call."
    },
    {
     "say": "These dots are the naive way: sort the whole list, every call. That's O of n log n.",
     "groups": [
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0
     ]
    },
    {
     "say": "Notice it keeps climbing. More tasks, more work, every single time you ask what's next.",
     "groups": [
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0
     ],
     "marks": [
      [
       85,
       90
      ]
     ]
    },
    {
     "say": "These are a heap's peek at the most urgent task. O of one: flat, whatever the size.",
     "groups": [
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      2,
      2
     ]
    },
    {
     "say": "With ten tasks you'd never notice the gap. With ten thousand, you would.",
     "groups": [
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      2,
      2
     ],
     "marks": [
      [
       10,
       5.5
      ],
      [
       10,
       4
      ]
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Big O",
   "title": "How fast is each operation?",
   "columns": [
    "Operation",
    "Big O",
    "Why"
   ],
   "rows": [
    [
     "Look up a user by ID in a dict",
     "O(1)",
     "Same time, any size"
    ],
    [
     "Find a value in an unsorted list",
     "O(n)",
     "Might check every item"
    ],
    [
     "Binary search a sorted list",
     "O(log n)",
     "Halves what's left each step"
    ],
    [
     "Sort tasks by due date",
     "O(n log n)",
     "Good general sorting"
    ],
    [
     "Add a task to a heap",
     "O(log n)",
     "Climbs the heap's height"
    ],
    [
     "Peek at the heap's top task",
     "O(1)",
     "It's always at the top"
    ]
   ],
   "beats": [
    {
     "say": "Here are six operations you'll meet, from fastest to slower.",
     "col": 1
    },
    {
     "say": "O of one means constant. A dictionary lookup takes about the same time, however big it gets.",
     "hl": [
      0,
      5
     ]
    },
    {
     "say": "O of log n grows very slowly, because each step halves the work.",
     "hl": [
      2,
      4
     ]
    },
    {
     "say": "O of n means checking every item in the worst case.",
     "hl": 1
    },
    {
     "say": "And O of n log n is sorting. Fine once, wasteful if you repeat it on every call.",
     "hl": 3,
     "dim": true
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Step 2",
   "title": "A heap keeps the most urgent item on top",
   "values": [
    2,
    5,
    3,
    9,
    7
   ],
   "beats": [
    {
     "say": "Here's a heap, shown as a list. Think of each number as days until a task is due.",
     "note": "each parent ≤ its children"
    },
    {
     "say": "The rule: every item is smaller than the items below it. So the smallest is always at index zero.",
     "hl": 0,
     "ptr": {
      "top": 0
     },
     "note": "top = 2"
    },
    {
     "say": "Heap push adds a task due in one day. It goes on the end first.",
     "vals": [
      2,
      5,
      3,
      9,
      7,
      1
     ],
     "hl": 5,
     "ptr": {
      "new": 5
     },
     "note": "heappush(heap, 1)"
    },
    {
     "say": "Its parent is the three at index two. One is smaller, so they swap.",
     "vals": [
      2,
      5,
      1,
      9,
      7,
      3
     ],
     "hl": 2,
     "ptr": {
      "new": 2
     },
     "note": "1 < 3 → swap"
    },
    {
     "say": "Its new parent is the two at the top. One is smaller again, so swap once more.",
     "vals": [
      1,
      5,
      2,
      9,
      7,
      3
     ],
     "hl": 0,
     "ptr": {
      "new": 0
     },
     "note": "1 < 2 → swap"
    },
    {
     "say": "Two swaps, not a full sort. The urgent task is on top, so next up just reads index zero.",
     "vals": [
      1,
      5,
      2,
      9,
      7,
      3
     ],
     "ok": [
      0
     ],
     "ptr": {
      "top": 0
     },
     "note": "[1, 5, 2, 9, 7, 3]"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 3",
   "title": "Try it: which task is next?",
   "file": "try_priority.py",
   "code": "q = TaskQueue()\nq.add(Task(id=1, title=\"Later task\",\n           due_date=date.today() + timedelta(days=5), priority=1))\nq.add(Task(id=2, title=\"Urgent task\",\n           due_date=date.today(), priority=3))\n\nprint(q.next_up().title)\n\n# inside Task:\ndef __lt__(self, other):\n    return (self.due_date, self.priority) < (other.due_date, other.priority)",
   "beats": [
    {
     "say": "Make an empty task queue.",
     "line": 1,
     "vars": {
      "q._heap": "[]"
     }
    },
    {
     "say": "Add a later task: due in five days, top priority one.",
     "line": [
      2,
      3
     ],
     "vars": {
      "q._heap": "[Later task]"
     }
    },
    {
     "say": "Add an urgent task: due today, priority three. Heap push puts it on the end, then compares.",
     "line": [
      4,
      5
     ],
     "vars": {
      "q._heap": "[Later, Urgent]"
     }
    },
    {
     "say": "To compare two tasks, Python calls the less than method you defined.",
     "line": [
      10,
      11
     ]
    },
    {
     "say": "It compares due dates first. Today comes before five days from now, so urgent is less. They swap.",
     "line": 11,
     "vars": {
      "q._heap": "[Urgent, Later]"
     }
    },
    {
     "say": "Priority would only matter if the due dates tied.",
     "line": 11
    },
    {
     "say": "Next up reads the top of the heap.",
     "line": 7,
     "out": "Urgent task"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Why the heap wins",
   "title": "Every call, side by side",
   "columns": [
    "You want…",
    "Naive list",
    "Heap"
   ],
   "rows": [
    [
     "What's next?",
     "Sort all n: O(n log n)",
     "Read the top: O(1)"
    ],
    [
     "Add a task",
     "Append: O(1)",
     "Push: O(log n)"
    ],
    [
     "Finish the next task",
     "Sort all n again",
     "Pop: O(log n)"
    ]
   ],
   "beats": [
    {
     "say": "Let's put the two approaches side by side.",
     "col": 0
    },
    {
     "say": "Next task naive sorts the entire list just to read one item.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "The heap already has it on top.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "Adding costs the heap a little, a few swaps, as you saw.",
     "hl": 1,
     "col": 2
    },
    {
     "say": "But you only ever needed the top item, so re-sorting everything repeats work on every call.",
     "hl": [
      0,
      2
     ],
     "dim": true,
     "col": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why is re-sorting the whole list every time wasteful?",
   "options": [
    "Sorting changes the order of your tasks",
    "You only need the top item, so sorting everything repeats work",
    "Python can't sort dates"
   ],
   "answer": 1,
   "good": "That's right. You only need the top item, not a fully ordered list, so re-sorting repeats work every time.",
   "bad": "Not quite. You only need the top item, not a fully ordered list, so re-sorting repeats work every time.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why is re-sorting the whole list every time wasteful?",
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
     "You can explain why a heap beats re-sorting",
     ""
    ],
    [
     "priority.py works and your manual test passes",
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
     "say": "you can explain why the heap scales better than re-sorting,",
     "show": 1
    },
    {
     "say": "and priority dot p y works, with a passing manual test.",
     "show": 2
    },
    {
     "say": "Next, in Module 4, TrackIt starts remembering things.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 4: Databases - Storing Data for Real
**Time estimate: 4-6 hours**

### Concepts

So far, tasks disappear when you stop your program. A **database** stores data permanently. A **relational database** (like PostgreSQL) organizes data into tables with rows and columns, and lets you link tables together.

An **ORM** (Object-Relational Mapper) lets you work with database tables using regular code objects instead of writing raw SQL for everything - though you should still be able to read the SQL it generates.

### Lab

**1. Install dependencies:**
```bash
pip install sqlalchemy
```

**2. Define your tables:**
```python
# models.py
from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    tasks = relationship("Task", back_populates="owner")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    due_date = Column(Date, nullable=True)
    priority = Column(Integer, default=3)
    done = Column(Boolean, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"), index=True)
    owner = relationship("User", back_populates="tasks")
```

**3. Learn to read the equivalent raw SQL** (you don't need to run this yet - just be able to read it):
```sql
SELECT title, due_date, priority
FROM tasks
WHERE owner_id = 1
  AND done = false
ORDER BY due_date ASC, priority ASC;
```
This says: "Get the title, due date, and priority of every unfinished task belonging to user 1, ordered by soonest due date."

**4. Create the database and its tables.** `models.py` only *describes* the tables; nothing exists on disk yet. Create `database.py`. We use SQLite here, a relational database stored in a single file, so there is nothing extra to install. Later you can swap the URL for a PostgreSQL one without changing your models.
```python
# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

engine = create_engine("sqlite:///trackit.db")
SessionLocal = sessionmaker(bind=engine)

def init_db():
    # Creates any tables that don't exist yet. Safe to run every time the app starts.
    Base.metadata.create_all(engine)
```

Then create the tables when the API starts, by adding these lines to `main.py` right after `app = FastAPI(...)`:
```python
from database import init_db

init_db()
```

**5. Save and read back real data.** Create `try_db.py` and run it with `python try_db.py`:
```python
# try_db.py
from database import SessionLocal, init_db
from models import User, Task

init_db()
with SessionLocal() as session:
    user = User(email="ada@example.com", hashed_password="not-a-real-hash-yet")
    user.tasks.append(Task(title="Write the spec", priority=1))
    session.add(user)
    session.commit()

    for task in session.query(Task).filter(Task.owner_id == user.id, Task.done == False):
        print(task.title, task.priority)   # Write the spec 1
```
A file called `trackit.db` now exists in your project folder. Run the script a second time and you'll get an error, because `email` is `unique=True` and that email is already saved. That's the database protecting your data. Delete `trackit.db` if you want to start fresh.

### Checkpoint
You can explain what a table, row, column, and foreign key are, you have `models.py` defining two linked tables, and running `try_db.py` created `trackit.db` with a saved task.

### Quiz
1. What's the difference between a table and a database?
2. What does `ForeignKey("users.id")` do?
3. Why is `email` marked `unique=True`?
4. What does `index=True` do, in plain terms?
5. Translate this SQL into a sentence: `SELECT * FROM tasks WHERE done = true;`

*Answers: 1) A database can contain many tables; a table is one organized set of rows/columns within it. 2) Links a Task to the User who owns it. 3) So two users can't register with the same email. 4) Makes searches on that column faster, at the cost of slightly slower writes. 5) "Get every column for every task that has been marked done."*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "database",
   "kicker": "Module 4 · Databases",
   "title": "Storing data for real",
   "beats": [
    {
     "say": "Welcome to Module 4."
    },
    {
     "say": "So far, your tasks disappear when the program stops."
    },
    {
     "say": "Today, TrackIt gets a database, so data stays."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concepts",
   "title": "A table: rows, columns, and a link",
   "columns": [
    "id",
    "title",
    "due_date",
    "priority",
    "done",
    "owner_id"
   ],
   "rows": [
    [
     "1",
     "Write the spec",
     "—",
     "1",
     "false",
     "1"
    ],
    [
     "2",
     "Draw the architecture",
     "2026-10-14",
     "2",
     "false",
     "1"
    ],
    [
     "3",
     "Set up Git",
     "2026-10-12",
     "3",
     "true",
     "1"
    ],
    [
     "4",
     "Plan a trip",
     "2026-10-13",
     "3",
     "false",
     "2"
    ],
    [
     "5",
     "Read a chapter",
     "2026-10-12",
     "4",
     "false",
     "1"
    ]
   ],
   "beats": [
    {
     "say": "A relational database stores data in tables. Here's an example tasks table."
    },
    {
     "say": "Each row is one task.",
     "hl": 1
    },
    {
     "say": "Each column is one piece of information every task has, like its priority.",
     "col": 3
    },
    {
     "say": "Owner I D is a foreign key. It holds the I D of a row in the users table, the task's owner.",
     "col": 5
    },
    {
     "say": "So tasks one, two, three and five belong to user one. Task four belongs to user two.",
     "hl": [
      0,
      1,
      2,
      4
     ],
     "col": 5
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concepts · ORM",
   "title": "Python classes become tables",
   "nodes": [
    {
     "id": "models",
     "label": "models.py",
     "x": 12,
     "y": 30,
     "sub": "class User, class Task",
     "art": "blueprint"
    },
    {
     "id": "orm",
     "label": "SQLAlchemy",
     "x": 50,
     "y": 30,
     "sub": "the ORM",
     "art": "gear"
    },
    {
     "id": "db",
     "label": "trackit.db",
     "x": 88,
     "y": 30,
     "sub": "SQLite file",
     "art": "database"
    },
    {
     "id": "users",
     "label": "users",
     "x": 70,
     "y": 80,
     "sub": "id · email · hashed_password",
     "art": "table"
    },
    {
     "id": "tasks",
     "label": "tasks",
     "x": 30,
     "y": 80,
     "sub": "… · owner_id",
     "art": "table"
    }
   ],
   "edges": [
    {
     "from": "models",
     "to": "orm"
    },
    {
     "from": "orm",
     "to": "db"
    },
    {
     "from": "db",
     "to": "users"
    },
    {
     "from": "db",
     "to": "tasks"
    },
    {
     "from": "tasks",
     "to": "users"
    }
   ],
   "beats": [
    {
     "say": "An O R M lets you describe tables as ordinary Python classes. That's models dot p y.",
     "show": 1,
     "on": "models"
    },
    {
     "say": "SQLAlchemy, the O R M, reads those classes.",
     "show": 2,
     "on": "orm",
     "send": {
      "from": "models",
      "to": "orm",
      "label": "User, Task"
     }
    },
    {
     "say": "When init D B runs, it writes the S Q L to create them in trackit dot d b, a single file.",
     "show": 3,
     "on": "db",
     "send": {
      "from": "orm",
      "to": "db",
      "label": "CREATE TABLE …"
     }
    },
    {
     "say": "Now there's a users table, with an email marked unique,",
     "show": 4,
     "on": "users",
     "send": {
      "from": "db",
      "to": "users",
      "label": "users"
     }
    },
    {
     "say": "and a tasks table.",
     "show": 5,
     "on": "tasks",
     "send": {
      "from": "db",
      "to": "tasks",
      "label": "tasks"
     }
    },
    {
     "say": "Foreign key users dot id links each task to the user who owns it.",
     "show": 5,
     "on": [
      "tasks",
      "users"
     ],
     "send": {
      "from": "tasks",
      "to": "users",
      "label": "ForeignKey(\"users.id\")"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 3",
   "title": "Read the SQL the ORM writes for you",
   "columns": [
    "id",
    "title",
    "due_date",
    "priority",
    "done",
    "owner_id"
   ],
   "rows": [
    [
     "1",
     "Write the spec",
     "—",
     "1",
     "false",
     "1"
    ],
    [
     "2",
     "Draw the architecture",
     "2026-10-14",
     "2",
     "false",
     "1"
    ],
    [
     "3",
     "Set up Git",
     "2026-10-12",
     "3",
     "true",
     "1"
    ],
    [
     "4",
     "Plan a trip",
     "2026-10-13",
     "3",
     "false",
     "2"
    ],
    [
     "5",
     "Read a chapter",
     "2026-10-12",
     "4",
     "false",
     "1"
    ]
   ],
   "beats": [
    {
     "say": "You don't run this yet, but you should be able to read it. Get the title, due date and priority,",
     "sql": "SELECT title, due_date, priority\nFROM tasks"
    },
    {
     "say": "of every task where the owner is user one.",
     "sql": "SELECT title, due_date, priority\nFROM tasks\nWHERE owner_id = 1",
     "hl": [
      0,
      1,
      2,
      4
     ],
     "dim": true,
     "col": 5
    },
    {
     "say": "And done is false. Set up Git is finished, so it drops out.",
     "sql": "SELECT title, due_date, priority\nFROM tasks\nWHERE owner_id = 1\n  AND done = false",
     "hl": [
      0,
      1,
      4
     ],
     "dim": true,
     "col": 4
    },
    {
     "say": "Order by soonest due date. Read a chapter, due the twelfth, comes before draw the architecture, due the fourteenth.",
     "sql": "SELECT title, due_date, priority\nFROM tasks\nWHERE owner_id = 1\n  AND done = false\nORDER BY due_date ASC, priority ASC;",
     "hl": [
      4,
      1
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "Write the spec has no due date at all. In SQLite, empty values sort first, so it lands at the very top.",
     "hl": 0,
     "dim": true,
     "col": 2
    },
    {
     "say": "One more. Select star from tasks where done is true means: every column of every finished task.",
     "sql": "SELECT * FROM tasks WHERE done = true;",
     "hl": 2,
     "dim": true,
     "col": 4
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 4 and 5",
   "title": "Save real data, then read it back",
   "file": "try_db.py",
   "code": "init_db()\nwith SessionLocal() as session:\n    user = User(email=\"ada@example.com\",\n                hashed_password=\"not-a-real-hash-yet\")\n    user.tasks.append(Task(title=\"Write the spec\", priority=1))\n    session.add(user)\n    session.commit()\n\n    for task in session.query(Task).filter(\n            Task.owner_id == user.id, Task.done == False):\n        print(task.title, task.priority)",
   "beats": [
    {
     "say": "Init D B creates any tables that don't exist yet. Now trackit dot d b is on disk.",
     "line": 1,
     "vars": {
      "trackit.db": "users: 0 · tasks: 0"
     }
    },
    {
     "say": "Open a session, a conversation with the database, and build a user called Ada.",
     "line": [
      2,
      4
     ],
     "vars": {
      "user.email": "\"ada@example.com\"",
      "user.id": "None"
     }
    },
    {
     "say": "Attach one task to her: write the spec, priority one.",
     "line": 5,
     "vars": {
      "user.tasks": "[Task(\"Write the spec\")]"
     }
    },
    {
     "say": "Add and commit. Only now is anything written. Ada gets I D one, and her task's owner I D is one too.",
     "line": [
      6,
      7
     ],
     "vars": {
      "user.id": 1,
      "trackit.db": "users: 1 · tasks: 1"
     }
    },
    {
     "say": "Query tasks where the owner is Ada, and done is false.",
     "line": [
      9,
      10
     ]
    },
    {
     "say": "One row matches. Print its title and priority.",
     "line": 11,
     "out": "Write the spec 1"
    },
    {
     "say": "Run the script a second time, and saving fails. Email is unique, and Ada's email is already saved.",
     "line": 7,
     "out": "IntegrityError: UNIQUE constraint failed: users.email"
    },
    {
     "say": "That's the database protecting your data. Delete trackit dot d b to start fresh.",
     "line": 7
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does ForeignKey(\"users.id\") do?",
   "options": [
    "Encrypts the user's ID",
    "Links each task to the user who owns it",
    "Makes the users table load faster"
   ],
   "answer": 1,
   "good": "That's right. It links each task to the user who owns it.",
   "bad": "Not quite. It links each task to the user who owns it.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does foreign key, users dot id, do?",
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
     "You can explain table, row, column and foreign key",
     ""
    ],
    [
     "models.py defines two linked tables",
     ""
    ],
    [
     "trackit.db exists with a saved task",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 4.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you can explain a table, a row, a column and a foreign key,",
     "show": 1
    },
    {
     "say": "models dot p y defines two linked tables,",
     "show": 2
    },
    {
     "say": "and running try D B created trackit dot d b with a saved task.",
     "show": 3
    },
    {
     "say": "Next, in Module 5, you think like an architect.",
     "show": 3
    }
   ]
  }
 ]
}
```

---

## Module 5: System Design - Thinking Like an Architect
**Time estimate: 2-3 hours (mostly thinking and writing, not coding)**

### Concepts

**System design** is deciding how the separate parts of your app - the browser the user sees, the server that runs your code, the database that stores data, and any outside services it calls - connect and divide the work, and predicting where that arrangement will strain as more people use it. You don't need to be an expert yet; the skill to practice is asking a few pointed questions of any design: *what breaks first when traffic spikes, where is the single point of failure, and which data must be instantly correct versus can lag a little?* Those are exactly the questions you'll answer for TrackIt below.

### Lab

**1. Draw TrackIt's current architecture** (pen and paper is fine):
```
[Browser] --> [FastAPI app] --> [Database (SQLite now, PostgreSQL later)]
```

**2. Answer these three questions in writing, for TrackIt:**
- What's the first thing that would break if 1,000 people used this at once?
- What's the single point of failure right now?
- Which pieces of data must always be accurate, and which could be slightly delayed without harming users?

**3. Sample reasoning** (compare against your own):
- The database connection could become a bottleneck first - many requests hitting one database at once.
- There's currently one app server - if it goes down, everything goes down.
- A task being saved must be accurate immediately. A "tasks completed this month" count could lag by a few seconds without anyone noticing.

### Checkpoint
You have a written answer to all three questions above, in your own words, even if it's a rough draft.

### Quiz
1. What is a "single point of failure"?
2. Why does it matter whether data needs to be immediately accurate vs. eventually accurate?
3. If your app got 100x slower under load, what would you check first?
4. Is "add more servers" always the right first fix? Why or why not?
5. TrackIt's "tasks completed this month" count is slow to calculate. Based on your answer to question 2, what could you do with it?

*Answers: 1) A single component whose failure takes down the whole system. 2) It determines which parts need strict consistency and which can be optimized differently (e.g., cached, computed later). 3) The database, since it's usually the first bottleneck. 4) No - first find the actual bottleneck; adding servers doesn't help if the database itself is the limit. 5) Because it can lag a little without harming users, you could cache it or recalculate it every few minutes instead of on every request.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "architecture",
   "kicker": "Module 5 · System design",
   "title": "Thinking like an architect",
   "beats": [
    {
     "say": "Welcome to Module 5. This one is mostly thinking and writing, not coding."
    },
    {
     "say": "System design is deciding how the parts of your app connect and share the work,"
    },
    {
     "say": "and predicting where that will strain as more people use it."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 1",
   "title": "TrackIt today, and what breaks first",
   "nodes": [
    {
     "id": "browser",
     "label": "Browser",
     "x": 12,
     "y": 50,
     "sub": "what the user sees",
     "art": "browser"
    },
    {
     "id": "app",
     "label": "FastAPI app",
     "x": 50,
     "y": 50,
     "sub": "one server",
     "art": "server"
    },
    {
     "id": "db",
     "label": "Database",
     "x": 88,
     "y": 50,
     "sub": "SQLite now, PostgreSQL later",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "browser",
     "to": "app"
    },
    {
     "from": "app",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "Draw TrackIt's architecture first. Pen and paper is fine. The browser,",
     "show": 1,
     "on": "browser"
    },
    {
     "say": "talks to your FastAPI app,",
     "show": 2,
     "on": "app",
     "send": {
      "from": "browser",
      "to": "app",
      "label": "GET /tasks"
     }
    },
    {
     "say": "which talks to the database.",
     "show": 3,
     "on": "db",
     "send": {
      "from": "app",
      "to": "db",
      "label": "SELECT …"
     }
    },
    {
     "say": "Question one. A thousand people use it at once. What breaks first?",
     "show": 3,
     "on": "app",
     "send": {
      "from": "browser",
      "to": "app",
      "label": "× 1,000 requests"
     }
    },
    {
     "say": "Likely the database. Every one of those requests ends up hitting one database at the same time.",
     "show": 3,
     "on": "db",
     "send": {
      "from": "app",
      "to": "db",
      "label": "× 1,000 queries"
     }
    },
    {
     "say": "Question two. Where's the single point of failure? There's one app server. If it goes down, everything goes down.",
     "show": 3,
     "on": "app"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Think it through",
   "title": "Would more servers help?",
   "nodes": [
    {
     "id": "users",
     "label": "1,000 users",
     "x": 12,
     "y": 50,
     "art": "people"
    },
    {
     "id": "a",
     "label": "App server A",
     "x": 50,
     "y": 22,
     "art": "server"
    },
    {
     "id": "b",
     "label": "App server B",
     "x": 50,
     "y": 78,
     "art": "server"
    },
    {
     "id": "db",
     "label": "Database",
     "x": 88,
     "y": 50,
     "sub": "still just one",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "users",
     "to": "a"
    },
    {
     "from": "users",
     "to": "b"
    },
    {
     "from": "a",
     "to": "db"
    },
    {
     "from": "b",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "A common first idea: add more servers.",
     "show": 3,
     "on": [
      "a",
      "b"
     ]
    },
    {
     "say": "Half the traffic goes to server A,",
     "show": 3,
     "on": "a",
     "send": {
      "from": "users",
      "to": "a",
      "label": "500 requests"
     }
    },
    {
     "say": "and half to server B. The app servers are no longer a single point of failure.",
     "show": 3,
     "on": "b",
     "send": {
      "from": "users",
      "to": "b",
      "label": "500 requests"
     }
    },
    {
     "say": "But both still send every query to the same database.",
     "show": 4,
     "on": "db",
     "send": {
      "from": "a",
      "to": "db",
      "label": "500 queries"
     }
    },
    {
     "say": "So if the database was the bottleneck, it's exactly as busy as before.",
     "show": 4,
     "on": "db",
     "send": {
      "from": "b",
      "to": "db",
      "label": "500 queries"
     }
    },
    {
     "say": "That's why you find the real bottleneck before you add anything.",
     "show": 4,
     "on": "db"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 2",
   "title": "Question three: must it be instantly correct?",
   "columns": [
    "Data",
    "Instantly correct?",
    "So you can…"
   ],
   "rows": [
    [
     "A task the user just saved",
     "Yes",
     "Write it to the database right away"
    ],
    [
     "\"Tasks completed this month\"",
     "Can lag a little",
     "Cache it, recalculate every few minutes"
    ]
   ],
   "beats": [
    {
     "say": "The third question: which data must always be accurate, and which could be slightly delayed?",
     "col": 0
    },
    {
     "say": "A task being saved must be accurate immediately. If it vanishes, the user notices.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "A count of tasks completed this month could lag a few seconds, and no one would notice.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "And it's slow to calculate. So you can cache it, or recalculate it every few minutes, instead of on every request.",
     "hl": 1,
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Sample answers",
   "title": "Compare with your own",
   "columns": [
    "Question",
    "Sample reasoning"
   ],
   "rows": [
    [
     "What breaks first at 1,000 users?",
     "The database connection: many requests, one database"
    ],
    [
     "Single point of failure?",
     "One app server. It goes down, everything goes down"
    ],
    [
     "Instantly accurate vs. can lag?",
     "Saved tasks: instant. Monthly count: can lag"
    ]
   ],
   "beats": [
    {
     "say": "Now write your own answers. Then compare them with these samples.",
     "col": 0
    },
    {
     "say": "What breaks first? The database, with many requests hitting it at once.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "The single point of failure: the one app server.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "And accuracy: saved tasks must be instant, the monthly count can lag. A rough draft is fine.",
     "hl": 2,
     "col": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Is \"add more servers\" always the right first fix?",
   "options": [
    "Yes, more servers always means more speed",
    "No. Find the real bottleneck first; more servers won't help if the database is the limit",
    "Only on weekends"
   ],
   "answer": 1,
   "good": "That's right. First find the real bottleneck. Adding servers doesn't help if the database itself is the limit.",
   "bad": "Not quite. First find the real bottleneck. Adding servers doesn't help if the database itself is the limit.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Is adding more servers always the right first fix?",
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
     "Written answers to all three questions, in your own words",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 5.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you've written an answer to all three questions, in your own words, even if it's a rough draft.",
     "show": 1
    },
    {
     "say": "Next, in Module 6, you protect your users' data.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 6: Security - Protecting User Data
**Time estimate: 3-4 hours**

### Concepts

**Authentication** confirms who a user is (login). **Authorization** confirms what they're allowed to do (e.g., only see their own tasks). A **hash** is a one-way transformation of a password so even you, the developer, never see or store the actual password.

### Lab

**1. Install dependencies:**
```bash
pip install bcrypt
```

**2. Hash and verify passwords:**
```python
# auth.py
import bcrypt

def hash_password(plain: str) -> str:
    # gensalt() adds random data, so the same password gives a different hash each time
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
```
bcrypt works on bytes, which is why we `.encode()` the text first. It only accepts passwords up to 72 bytes, so set a sensible maximum password length in your signup form.

**3. Try it** (add this to the bottom of `auth.py` and run `python auth.py`):
```python
hashed = hash_password("mypassword123")
print(hashed)                              # unreadable hash, not the real password
print(verify_password("mypassword123", hashed))   # True
print(verify_password("wrongpassword", hashed))    # False
```

**4. The four questions to ask on every endpoint you build from now on:**
```
- Does this require the user to be logged in?
- Does this only return data that belongs to the logged-in user?
- Is user input validated before touching the database?
- Do error messages avoid leaking details (e.g., say "invalid credentials," not "wrong password")?
```

### Checkpoint
You can hash a password, verify it correctly, and explain why plain-text passwords are never acceptable.

### Quiz
1. Why can't the developer "look up" a user's real password later?
2. What's the difference between authentication and authorization?
3. Why say "invalid credentials" instead of "wrong password" on a failed login?
4. What would go wrong if `/tasks` returned every user's tasks instead of just the logged-in user's?
5. Why hash passwords instead of encrypting them (reversibly)?

*Answers: 1) Hashing is one-way - there's no way to reverse it back to the original password. 2) Authentication is "who are you"; authorization is "what are you allowed to do." 3) It avoids telling an attacker which part (username or password) was wrong. 4) A massive privacy/security breach - anyone could see anyone else's data. 5) Even if the database is ever stolen, hashed passwords can't be directly reversed into the originals.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "lock",
   "kicker": "Module 6 · Security",
   "title": "Protecting user data",
   "beats": [
    {
     "say": "Welcome to Module 6."
    },
    {
     "say": "People will trust TrackIt with their accounts. This module is about deserving that trust."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concepts",
   "title": "Three words to know",
   "columns": [
    "Word",
    "Question it answers",
    "TrackIt example"
   ],
   "rows": [
    [
     "Authentication",
     "Who are you?",
     "Logging in as ada@example.com"
    ],
    [
     "Authorization",
     "What are you allowed to do?",
     "Ada sees only Ada's tasks"
    ],
    [
     "Hash",
     "How do we store a password safely?",
     "Store a one-way scramble, never the password"
    ]
   ],
   "beats": [
    {
     "say": "Three words come up in every security conversation.",
     "col": 0
    },
    {
     "say": "Authentication confirms who a user is. That's logging in.",
     "hl": 0
    },
    {
     "say": "Authorization confirms what they're allowed to do, like seeing only their own tasks.",
     "hl": 1
    },
    {
     "say": "And a hash is a one-way transformation of a password, so even you, the developer, never see the real one.",
     "hl": 2,
     "dim": true
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concepts",
   "title": "What gets stored, and how login checks it",
   "nodes": [
    {
     "id": "user",
     "label": "Sign up",
     "x": 12,
     "y": 30,
     "sub": "\"mypassword123\"",
     "art": "password"
    },
    {
     "id": "hash",
     "label": "hash_password",
     "x": 50,
     "y": 30,
     "sub": "bcrypt + random salt",
     "art": "hash"
    },
    {
     "id": "db",
     "label": "users table",
     "x": 88,
     "y": 30,
     "sub": "hashed_password",
     "art": "database"
    },
    {
     "id": "login",
     "label": "Log in",
     "x": 12,
     "y": 80,
     "sub": "types a password",
     "art": "idcard"
    },
    {
     "id": "verify",
     "label": "verify_password",
     "x": 50,
     "y": 80,
     "sub": "True or False",
     "art": "shield"
    }
   ],
   "edges": [
    {
     "from": "user",
     "to": "hash"
    },
    {
     "from": "hash",
     "to": "db"
    },
    {
     "from": "login",
     "to": "verify"
    },
    {
     "from": "db",
     "to": "verify"
    }
   ],
   "beats": [
    {
     "say": "At sign up, the user's password goes straight into hash password.",
     "show": 2,
     "on": "hash",
     "send": {
      "from": "user",
      "to": "hash",
      "label": "\"mypassword123\""
     }
    },
    {
     "say": "Bcrypt mixes in random data, called a salt, and scrambles it one way. Only that hash is stored.",
     "show": 3,
     "on": "db",
     "send": {
      "from": "hash",
      "to": "db",
      "label": "$2b$12$…"
     }
    },
    {
     "say": "At login, the typed password goes to verify password.",
     "show": 5,
     "on": "verify",
     "send": {
      "from": "login",
      "to": "verify",
      "label": "typed password"
     }
    },
    {
     "say": "It fetches the stored hash and checks whether the typed password produces a match.",
     "show": 5,
     "on": "verify",
     "send": {
      "from": "db",
      "to": "verify",
      "label": "stored hash"
     }
    },
    {
     "say": "The real password is never stored, so even a stolen database can't simply be read back.",
     "show": 5,
     "on": [
      "db",
      "verify"
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 2 and 3",
   "title": "Hash, then check",
   "file": "auth.py",
   "code": "import bcrypt\n\ndef hash_password(plain: str) -> str:\n    return bcrypt.hashpw(plain.encode(\"utf-8\"), bcrypt.gensalt()).decode(\"utf-8\")\n\ndef verify_password(plain: str, hashed: str) -> bool:\n    return bcrypt.checkpw(plain.encode(\"utf-8\"), hashed.encode(\"utf-8\"))\n\nhashed = hash_password(\"mypassword123\")\nprint(hashed)\nprint(verify_password(\"mypassword123\", hashed))\nprint(verify_password(\"wrongpassword\", hashed))",
   "beats": [
    {
     "say": "Bcrypt works on bytes, so each function encodes the text first.",
     "line": [
      4,
      7
     ]
    },
    {
     "say": "Hash my password one two three.",
     "line": 9,
     "vars": {
      "plain": "\"mypassword123\""
     }
    },
    {
     "say": "Gen salt adds random data, then bcrypt scrambles it into a sixty character hash.",
     "line": 4,
     "vars": {
      "hashed": "\"$2b$12$tQTXyOB4.gQo…\""
     }
    },
    {
     "say": "Print shows an unreadable hash, not the password. Run it again and you'll get a different one.",
     "line": 10,
     "out": "$2b$12$tQTXyOB4.gQoPAnnYJn/T.t4woKElXOFNydCJew5G9gu7GeEz49uC"
    },
    {
     "say": "Check the right password against the hash. True.",
     "line": [
      11,
      7
     ],
     "out": "True"
    },
    {
     "say": "Check the wrong password. False.",
     "line": [
      12,
      7
     ],
     "out": "False"
    },
    {
     "say": "Bcrypt only accepts passwords up to seventy two bytes, so set a sensible maximum length at sign up.",
     "line": 7
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Why hash?",
   "title": "Three ways to store a password",
   "columns": [
    "Stored as",
    "Can it be turned back?",
    "If the database is stolen"
   ],
   "rows": [
    [
     "Plain text",
     "Already readable",
     "Every password exposed"
    ],
    [
     "Encrypted",
     "Yes, with the key",
     "Exposed if the key leaks too"
    ],
    [
     "Hashed (bcrypt)",
     "No, one-way",
     "Can't be directly reversed"
    ]
   ],
   "beats": [
    {
     "say": "Here are three ways you could store a password.",
     "col": 0
    },
    {
     "say": "Plain text is never acceptable. Anyone who sees the database sees every password.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "Encryption can be reversed with a key. If the key leaks, so do the passwords.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "A hash can't be reversed. That's why you, the developer, can't look up a user's real password either.",
     "hl": 2,
     "dim": true,
     "col": 1
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 4",
   "title": "Ask these on every endpoint",
   "columns": [
    "Question",
    "For GET /tasks"
   ],
   "rows": [
    [
     "Requires login?",
     "Yes. No login, no tasks"
    ],
    [
     "Only the user's own data?",
     "Filter by the logged-in owner_id"
    ],
    [
     "Input validated first?",
     "Check it before it touches the database"
    ],
    [
     "Errors leak nothing?",
     "\"Invalid credentials\", not \"wrong password\""
    ]
   ],
   "beats": [
    {
     "say": "From now on, ask four questions about every endpoint you build. Let's try them on get slash tasks.",
     "col": 0
    },
    {
     "say": "Does it require the user to be logged in? Yes.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "Does it return only the logged-in user's tasks? If it returned everyone's, anyone could read anyone's data.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "Is the user's input validated before it touches the database?",
     "hl": 2,
     "col": 1
    },
    {
     "say": "And do error messages avoid leaking details? Say invalid credentials, never wrong password.",
     "hl": 3,
     "dim": true,
     "col": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why say \"invalid credentials\" instead of \"wrong password\"?",
   "options": [
    "It sounds more professional",
    "It doesn't tell an attacker which part was wrong",
    "It's shorter to type"
   ],
   "answer": 1,
   "good": "That's right. It avoids telling an attacker whether the username or the password was the wrong part.",
   "bad": "Not quite. It avoids telling an attacker whether the username or the password was the wrong part.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why say invalid credentials, instead of wrong password?",
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
     "You can hash and verify a password",
     ""
    ],
    [
     "You can explain why plain-text passwords are never OK",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 6.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you can hash a password and verify it correctly,",
     "show": 1
    },
    {
     "say": "and explain why plain-text passwords are never acceptable.",
     "show": 2
    },
    {
     "say": "Next, in Module 7, you build with AI.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 7: AI Features - Building With, Not Just Using, AI
**Time estimate: 3-4 hours**

### Concepts

Large language models (LLMs) are good at turning messy natural language into structured data - exactly what TrackIt's "quick add" needs. The engineering skill isn't calling the API; it's making sure you don't blindly trust what comes back.

### Lab

**1. Define what a "parsed task" must look like:**
```python
# ai_parse.py
from pydantic import BaseModel, Field
from datetime import date

class ParsedTask(BaseModel):
    title: str
    due_date: date | None
    priority: int = Field(ge=1, le=5)  # must be 1 to 5
```

**2. Write the instruction you'd send to the model:**
```python
SYSTEM_PROMPT = """
Extract a task from the user's text. Respond ONLY with JSON matching:
{"title": string, "due_date": "YYYY-MM-DD" or null, "priority": integer 1-5}
No preamble, no markdown formatting.
"""
```

This prompt lives in your server code, never in the browser. Anything sent from the browser can be read and changed by the user, so they could rewrite your instructions.

**3. Call the model and handle the response safely.** This example uses Anthropic's Claude API; other providers work the same way. Run `pip install requests`, and set your API key as an environment variable named `ANTHROPIC_API_KEY` (never paste the key into your code). Add this to `ai_parse.py`:
```python
import json
import os

import requests

def call_llm(system_prompt: str, user_text: str) -> str:
    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": os.environ["ANTHROPIC_API_KEY"],
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": "claude-sonnet-5-5",
            "max_tokens": 300,
            "system": system_prompt,
            "messages": [{"role": "user", "content": user_text}],
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["content"][0]["text"]

def parse_quick_add(user_text: str) -> ParsedTask:
    # The model doesn't know today's date, so tell it; otherwise "by Friday" can't become a real date
    message = f"Today's date is {date.today().isoformat()}.\n\nTask: {user_text}"
    raw_response = call_llm(SYSTEM_PROMPT, message)
    try:
        data = json.loads(raw_response)
        return ParsedTask(**data)
    except (json.JSONDecodeError, ValueError):
        # pydantic's ValidationError is a kind of ValueError, so bad fields land here too
        raise ValueError("Could not parse task from AI response - ask the user to retry")

if __name__ == "__main__":
    print(parse_quick_add("Finish the budget report by Friday, it's urgent"))
```

The key lesson: never assume the AI's output is valid. Always validate it against a schema, and always have a fallback plan for when it isn't.

### Checkpoint
You understand why `ParsedTask` and the try/except block exist, even before wiring up a real API key.

### Quiz
1. Why not just trust whatever text the AI model returns?
2. What does the `ParsedTask` schema protect you from?
3. What should happen if the AI's response can't be parsed as valid JSON?
4. Why keep the system prompt on the server instead of sending it from the browser?
5. What's the difference between "using AI" and "engineering with AI," based on this lesson?

*Answers: 1) Models can produce malformed or unexpected output; blind trust risks bugs or bad data reaching your database. 2) Getting fields in the wrong type or format, or missing fields entirely. 3) Catch the error and ask the user to retry, rather than crashing or saving bad data. 4) A user could see or manipulate it, changing how the AI behaves in ways you didn't intend. 5) Using AI is calling an API; engineering with AI means building reliability and validation around a fundamentally probabilistic tool.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "sparkle",
   "kicker": "Module 7 · AI features",
   "title": "Building with AI, not just using it",
   "beats": [
    {
     "say": "Welcome to Module 7."
    },
    {
     "say": "Today you build TrackIt's quick add, where you type a task in plain English and AI structures it."
    },
    {
     "say": "The skill here isn't calling the AI. It's making sure you don't blindly trust what comes back."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "The design",
   "title": "Where each piece lives",
   "nodes": [
    {
     "id": "browser",
     "label": "Browser",
     "x": 10,
     "y": 50,
     "sub": "user's text only",
     "art": "browser"
    },
    {
     "id": "server",
     "label": "Your server",
     "x": 40,
     "y": 50,
     "sub": "prompt + API key",
     "art": "server"
    },
    {
     "id": "llm",
     "label": "Claude API",
     "x": 78,
     "y": 20,
     "sub": "the model",
     "art": "neural"
    },
    {
     "id": "check",
     "label": "ParsedTask",
     "x": 78,
     "y": 80,
     "sub": "the schema check",
     "art": "shield"
    }
   ],
   "edges": [
    {
     "from": "browser",
     "to": "server"
    },
    {
     "from": "server",
     "to": "llm"
    },
    {
     "from": "server",
     "to": "check"
    }
   ],
   "beats": [
    {
     "say": "The user types, finish the budget report by Friday, it's urgent. Only that text leaves the browser.",
     "show": 2,
     "on": "browser",
     "send": {
      "from": "browser",
      "to": "server",
      "label": "\"Finish the budget report by Friday…\""
     }
    },
    {
     "say": "The system prompt and your A P I key stay on the server. Anything in the browser, a user could read and rewrite.",
     "show": 2,
     "on": "server"
    },
    {
     "say": "The server adds today's date, so by Friday can become a real date, and calls the model.",
     "show": 3,
     "on": "llm",
     "send": {
      "from": "server",
      "to": "llm",
      "label": "system prompt + date + text"
     }
    },
    {
     "say": "The model sends back text that should be J S O N. Should be. Not guaranteed.",
     "show": 3,
     "on": "server",
     "send": {
      "from": "llm",
      "to": "server",
      "label": "raw text"
     }
    },
    {
     "say": "So before anything is saved, the answer is checked against the parsed task schema.",
     "show": 4,
     "on": "check",
     "send": {
      "from": "server",
      "to": "check",
      "label": "json.loads → ParsedTask"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 1 to 3",
   "title": "A good answer, traced",
   "file": "ai_parse.py",
   "code": "class ParsedTask(BaseModel):\n    title: str\n    due_date: date | None\n    priority: int = Field(ge=1, le=5)  # must be 1 to 5\n\ndef parse_quick_add(user_text: str) -> ParsedTask:\n    message = f\"Today's date is {date.today().isoformat()}.\\n\\nTask: {user_text}\"\n    raw_response = call_llm(SYSTEM_PROMPT, message)\n    try:\n        data = json.loads(raw_response)\n        return ParsedTask(**data)\n    except (json.JSONDecodeError, ValueError):\n        raise ValueError(\"Could not parse task from AI response - ask the user to retry\")",
   "beats": [
    {
     "say": "First, decide what a good answer looks like: a title, a due date or nothing, and a priority from one to five.",
     "line": [
      1,
      4
     ]
    },
    {
     "say": "Say today is Monday, the twelfth of October twenty twenty six. The date goes into the message.",
     "line": 7,
     "vars": {
      "user_text": "\"Finish the budget report by Friday, it's urgent\"",
      "today": "2026-10-12"
     }
    },
    {
     "say": "Call the model with the system prompt and that message.",
     "line": 8,
     "vars": {
      "raw_response": "'{\"title\": \"Finish the budget report\", \"due_date\": \"2026-10-16\", \"priority\": 1}'"
     }
    },
    {
     "say": "Json dot loads turns the text into a Python dictionary. It's valid J S O N.",
     "line": [
      9,
      10
     ],
     "vars": {
      "data": "dict with 3 keys"
     }
    },
    {
     "say": "Parsed task checks every field. A real title, a real date, and one is between one and five.",
     "line": [
      11,
      4
     ]
    },
    {
     "say": "All good, so it returns a parsed task you can trust.",
     "line": 11,
     "out": "title='Finish the budget report' due_date=datetime.date(2026, 10, 16) priority=1"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Never trust, always validate",
   "title": "What the model might send back",
   "columns": [
    "Model's answer",
    "What fails",
    "Result"
   ],
   "rows": [
    [
     "{\"title\": \"Finish the budget report\", \"due_date\": \"2026-10-16\", \"priority\": 1}",
     "nothing",
     "ParsedTask ✓"
    ],
    [
     "Here is your task: {\"title\": …}",
     "json.loads",
     "retry"
    ],
    [
     "{… \"due_date\": null, \"priority\": 9}",
     "priority ≤ 5",
     "retry"
    ],
    [
     "{… \"due_date\": \"Friday\", \"priority\": 1}",
     "not a date",
     "retry"
    ],
    [
     "{\"due_date\": \"2026-10-16\", \"priority\": 1}",
     "title missing",
     "retry"
    ]
   ],
   "beats": [
    {
     "say": "Models are probabilistic. Here are five answers you could get back.",
     "col": 0
    },
    {
     "say": "The good one passes both checks.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "Here, the model added a chatty sentence before the J S O N. Json dot loads fails with a decode error.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "This one is valid J S O N, but priority nine breaks the one to five rule.",
     "hl": 2,
     "col": 1
    },
    {
     "say": "The word Friday isn't a real date, and this one forgot the title entirely.",
     "hl": [
      3,
      4
     ],
     "col": 1
    },
    {
     "say": "Every failure lands in the except block, which raises one clear error: ask the user to retry. No crash, no bad data saved.",
     "hl": [
      1,
      2,
      3,
      4
     ],
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "The key lesson",
   "title": "A bad answer, traced",
   "file": "ai_parse.py",
   "code": "class ParsedTask(BaseModel):\n    title: str\n    due_date: date | None\n    priority: int = Field(ge=1, le=5)  # must be 1 to 5\n\ndef parse_quick_add(user_text: str) -> ParsedTask:\n    message = f\"Today's date is {date.today().isoformat()}.\\n\\nTask: {user_text}\"\n    raw_response = call_llm(SYSTEM_PROMPT, message)\n    try:\n        data = json.loads(raw_response)\n        return ParsedTask(**data)\n    except (json.JSONDecodeError, ValueError):\n        raise ValueError(\"Could not parse task from AI response - ask the user to retry\")",
   "beats": [
    {
     "say": "Same function, but this time the model answers with priority nine.",
     "line": 8,
     "vars": {
      "raw_response": "'{\"title\": \"Finish the budget report\", \"due_date\": null, \"priority\": 9}'"
     }
    },
    {
     "say": "It's valid J S O N, so json dot loads succeeds.",
     "line": 10,
     "vars": {
      "data": "dict with 3 keys"
     }
    },
    {
     "say": "But parsed task sees priority nine, and the rule says at most five. It raises a validation error.",
     "line": [
      11,
      4
     ]
    },
    {
     "say": "Pydantic's validation error is a kind of value error, so the except block catches it.",
     "line": 12
    },
    {
     "say": "We raise one clear error instead, and the app asks the user to try again.",
     "line": 13,
     "out": "ValueError: Could not parse task from AI response - ask the user to retry"
    },
    {
     "say": "Never assume the AI's output is valid. Check it against a schema, and always have a fallback.",
     "line": [
      9,
      13
     ]
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What should happen if the AI's answer isn't valid JSON?",
   "options": [
    "Save it anyway and fix it later",
    "Catch the error and ask the user to retry",
    "Show the raw answer to the user"
   ],
   "answer": 1,
   "good": "That's right. Catch the error and ask the user to retry, instead of crashing or saving bad data.",
   "bad": "Not quite. Catch the error and ask the user to retry, instead of crashing or saving bad data.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What should happen if the AI's answer isn't valid J S O N?",
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
     "You can explain why ParsedTask exists",
     ""
    ],
    [
     "You can explain the try/except fallback",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 7.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you understand why the parsed task schema exists,",
     "show": 1
    },
    {
     "say": "and why the try and except block is there, even before wiring up a real A P I key.",
     "show": 2
    },
    {
     "say": "Next, in Module 8, you work like a team.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 8: Testing & Git Workflow - Working Like a Team
**Time estimate: 3-4 hours**

### Concepts

A **test** is code that checks whether your other code behaves correctly, automatically, so you don't have to manually re-check everything by hand every time you make a change.

A **pull request (PR)** is a proposed change to a codebase, submitted for review before being merged in - the standard way teams collaborate safely.

### Lab

**1. Install pytest:**
```bash
pip install pytest
```

**2. Write your first tests:**
```python
# test_priority.py
from datetime import date, timedelta
from priority import Task, TaskQueue

def test_next_up_returns_earliest_due_date():
    q = TaskQueue()
    q.add(Task(id=1, title="Later task", due_date=date.today() + timedelta(days=5), priority=1))
    q.add(Task(id=2, title="Urgent task", due_date=date.today(), priority=3))
    assert q.next_up().title == "Urgent task"

def test_same_due_date_breaks_tie_by_priority():
    today = date.today()
    q = TaskQueue()
    q.add(Task(id=1, title="Low priority", due_date=today, priority=5))
    q.add(Task(id=2, title="High priority", due_date=today, priority=1))
    assert q.next_up().title == "High priority"
```

**3. Run them:**
```bash
pytest test_priority.py -v
```

**4. Connect your project to GitHub.** Your repository only exists on your computer so far (you ran `git init` in Module 0), so there is nowhere to push yet. On [github.com](https://github.com), click **New repository**, name it `trackit`, and leave it empty (no README, .gitignore, or license). Copy the URL GitHub shows you, then run:
```bash
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/trackit.git
git push -u origin main
```
When pushing over HTTPS, GitHub asks you to sign in. It does not accept your account password here: sign in through the browser window that Git Credential Manager opens, or install the [GitHub CLI](https://cli.github.com) and run `gh auth login` once, or paste a personal access token when asked for a password.

**5. Practice a real git workflow:**
```bash
git checkout -b feature/task-queue
git add SPEC.md main.py priority.py try_priority.py models.py database.py try_db.py auth.py ai_parse.py test_priority.py
git commit -m "Add TrackIt app, priority queue, and tests"
git push origin feature/task-queue
```
On GitHub, open a pull request for this branch, even if you're working solo - this builds the habit.

### Checkpoint
Your tests pass locally, and you've created a branch and pull request on GitHub.

### Quiz
1. Why write a test instead of just checking the output manually each time?
2. What does `assert` do in a test?
3. What's a branch, and why not just edit `main` directly?
4. What is a pull request for?
5. What would happen to a team's codebase over time without any tests?

*Answers: 1) Manual checking doesn't scale and is easy to skip; automated tests run consistently every time. 2) It checks that a condition is true, and fails the test loudly if it isn't. 3) A branch is an isolated copy of the code to work on safely; editing `main` directly risks breaking the working version for everyone. 4) It lets someone review a change before it becomes part of the shared codebase. 5) Bugs would accumulate silently, and every change would become riskier and slower to make.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "test",
   "kicker": "Module 8 · Testing and Git workflow",
   "title": "Working like a team",
   "beats": [
    {
     "say": "Welcome to Module 8."
    },
    {
     "say": "Today you write tests, and learn how real teams change code safely."
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 2 and 3",
   "title": "Run your first tests",
   "file": "test_priority.py",
   "code": "def test_next_up_returns_earliest_due_date():\n    q = TaskQueue()\n    q.add(Task(id=1, title=\"Later task\", due_date=date.today() + timedelta(days=5), priority=1))\n    q.add(Task(id=2, title=\"Urgent task\", due_date=date.today(), priority=3))\n    assert q.next_up().title == \"Urgent task\"\n\ndef test_same_due_date_breaks_tie_by_priority():\n    today = date.today()\n    q = TaskQueue()\n    q.add(Task(id=1, title=\"Low priority\", due_date=today, priority=5))\n    q.add(Task(id=2, title=\"High priority\", due_date=today, priority=1))\n    assert q.next_up().title == \"High priority\"",
   "beats": [
    {
     "say": "A test is code that checks your other code, automatically. Pytest runs every function whose name starts with test.",
     "line": [
      1,
      7
     ]
    },
    {
     "say": "Test one: a later task due in five days, and an urgent task due today.",
     "line": [
      2,
      4
     ],
     "vars": {
      "next_up": "\"Urgent task\""
     }
    },
    {
     "say": "Assert checks a condition is true. Urgent task equals urgent task, so it passes quietly.",
     "line": 5,
     "out": "test_next_up_returns_earliest_due_date PASSED"
    },
    {
     "say": "Test two: both due today, priorities five and one.",
     "line": [
      8,
      11
     ],
     "vars": {
      "next_up": "\"High priority\""
     }
    },
    {
     "say": "The dates tie, so priority decides. High priority wins, and the assert passes.",
     "line": 12,
     "out": "test_same_due_date_breaks_tie_by_priority PASSED"
    },
    {
     "say": "Run pytest test priority dot p y, dash v, and you see both pass.",
     "line": 12,
     "out": "2 passed"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Why tests matter",
   "title": "A test catches a bug you didn't see",
   "columns": [
    "Test",
    "Expected",
    "Got",
    "Result"
   ],
   "rows": [
    [
     "earliest_due_date",
     "Urgent task",
     "Urgent task",
     "PASSED"
    ],
    [
     "breaks_tie_by_priority",
     "High priority",
     "High priority",
     "PASSED"
    ]
   ],
   "beats": [
    {
     "say": "Both tests pass with the code as written.",
     "col": 3
    },
    {
     "say": "Now imagine a teammate swaps the order inside the less than method, to compare priority first, then date.",
     "sql": "return (self.priority, self.due_date) < (other.priority, other.due_date)"
    },
    {
     "say": "Test one runs again. The later task has priority one, so now it wins.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "Pytest fails loudly: assert later task equals urgent task.",
     "hl": 0,
     "col": 3,
     "sql": "FAILED test_next_up_returns_earliest_due_date\nAssertionError: assert 'Later task' == 'Urgent task'"
    },
    {
     "say": "Test two still passes, because its dates tie anyway. That's why one test is rarely enough.",
     "hl": 1,
     "col": 3
    },
    {
     "say": "Without the test, this bug would ship silently. With it, you knew in seconds.",
     "hl": 0,
     "dim": true,
     "col": 3
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 4 and 5",
   "title": "Branch, push, pull request, merge",
   "nodes": [
    {
     "id": "main",
     "label": "main",
     "x": 12,
     "y": 25,
     "sub": "the working version",
     "art": "git"
    },
    {
     "id": "branch",
     "label": "feature/task-queue",
     "x": 12,
     "y": 78,
     "sub": "your safe copy",
     "art": "merge"
    },
    {
     "id": "gh",
     "label": "GitHub",
     "x": 50,
     "y": 78,
     "sub": "origin",
     "art": "cloud"
    },
    {
     "id": "pr",
     "label": "Pull request",
     "x": 88,
     "y": 78,
     "sub": "review the change",
     "art": "eye"
    },
    {
     "id": "merged",
     "label": "main on GitHub",
     "x": 88,
     "y": 25,
     "sub": "updated",
     "art": "proof"
    }
   ],
   "edges": [
    {
     "from": "main",
     "to": "branch"
    },
    {
     "from": "branch",
     "to": "gh"
    },
    {
     "from": "gh",
     "to": "pr"
    },
    {
     "from": "pr",
     "to": "merged"
    }
   ],
   "beats": [
    {
     "say": "First, connect your project to a new, empty GitHub repository, and push main.",
     "show": 1,
     "on": "main"
    },
    {
     "say": "Git checkout dash b makes a branch: an isolated copy. Main stays safe for everyone.",
     "show": 2,
     "on": "branch",
     "send": {
      "from": "main",
      "to": "branch",
      "label": "git checkout -b feature/task-queue"
     }
    },
    {
     "say": "You add your files and commit on the branch, then push it to GitHub.",
     "show": 3,
     "on": "gh",
     "send": {
      "from": "branch",
      "to": "gh",
      "label": "git push origin feature/task-queue"
     }
    },
    {
     "say": "On GitHub, you open a pull request: a proposed change, for someone to review.",
     "show": 4,
     "on": "pr",
     "send": {
      "from": "gh",
      "to": "pr",
      "label": "open PR"
     }
    },
    {
     "say": "Once it's approved, it merges into main. Do this even when you work alone. It builds the habit.",
     "show": 5,
     "on": "merged",
     "send": {
      "from": "pr",
      "to": "merged",
      "label": "merge"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 5",
   "title": "The same workflow, in the terminal",
   "file": "Terminal",
   "code": "git checkout -b feature/task-queue\ngit add SPEC.md main.py priority.py try_priority.py models.py \\\n    database.py try_db.py auth.py ai_parse.py test_priority.py\ngit commit -m \"Add TrackIt app, priority queue, and tests\"\ngit push origin feature/task-queue",
   "beats": [
    {
     "say": "Make the branch and switch to it.",
     "line": 1,
     "vars": {
      "branch": "feature/task-queue"
     },
     "out": "Switched to a new branch 'feature/task-queue'"
    },
    {
     "say": "Pick every file you've written so far.",
     "line": [
      2,
      3
     ],
     "vars": {
      "picked": "10 files"
     }
    },
    {
     "say": "Commit them with a message that says what changed.",
     "line": 4
    },
    {
     "say": "Push the branch to GitHub. Pushing over H T T P S, GitHub asks you to sign in through the browser, not with your password.",
     "line": 5
    },
    {
     "say": "Then open the pull request on GitHub.",
     "line": 5,
     "vars": {
      "on GitHub": "feature/task-queue → PR"
     }
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why work on a branch instead of editing main directly?",
   "options": [
    "Branches make code run faster",
    "A branch is a safe copy, so you don't break the working version for everyone",
    "GitHub doesn't allow edits to main"
   ],
   "answer": 1,
   "good": "That's right. A branch is an isolated copy, so you don't risk breaking the working version everyone relies on.",
   "bad": "Not quite. A branch is an isolated copy, so you don't risk breaking the working version everyone relies on.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why work on a branch instead of editing main directly?",
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
     "Your tests pass locally",
     ""
    ],
    [
     "You've made a branch and a pull request on GitHub",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 8.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "your tests pass on your computer,",
     "show": 1
    },
    {
     "say": "and you've made a branch and a pull request on GitHub.",
     "show": 2
    },
    {
     "say": "Next, in the last module, you ship TrackIt.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 9: Deployment & CI - Shipping to Real Users
**Time estimate: 3-5 hours**

### Concepts

**Containerization** (Docker) packages your app with everything it needs to run, so it behaves identically on your laptop, a teammate's laptop, and a real server - no more "it works on my machine."

**CI (Continuous Integration)** automatically runs your tests every time you propose a change, catching problems before a human even looks at the code.

### Lab

**1. Write a Dockerfile:**
```dockerfile
# Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**2. Tell Docker what to leave out.** `COPY . .` copies everything in your folder, including your `venv` (which only works on your own computer) and your local `trackit.db`. Create a file named `.dockerignore`:
```
venv/
__pycache__/
trackit.db
.git/
```

**3. Create a requirements file listing what you've installed so far:**
```bash
pip freeze > requirements.txt
```

**4. Build and run your container:**
```bash
docker build -t trackit-api .
docker run -p 8000:8000 trackit-api
```
Visit `http://localhost:8000/health` again - it should work exactly as it did outside Docker.

**5. Add automatic testing on every change.** Create the folders first with `mkdir -p .github/workflows` (in Windows PowerShell: `mkdir .github\workflows`), then create this file:
```yaml
# .github/workflows/ci.yml
name: CI
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-python@v6
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest
```
**6. Commit everything on a branch, push, and open a pull request.** First merge your Module 8 pull request on GitHub, so your app files and the files your tests need (`priority.py` and `test_priority.py`) are on `main`. Then run:
```bash
git checkout main
git pull
git checkout -b feature/docker-ci
git add Dockerfile .dockerignore requirements.txt .github/workflows/ci.yml
git commit -m "Add Dockerfile and CI workflow"
git push -u origin feature/docker-ci
```
Open a pull request on GitHub for `feature/docker-ci` - you'll see GitHub automatically run your tests.

### Checkpoint
Your app runs inside a Docker container, and a pull request on GitHub automatically triggers your test suite.

### Quiz
1. What problem does Docker solve that installing dependencies locally doesn't?
2. What does `requirements.txt` list?
3. What triggers the CI workflow you wrote?
4. Why is automatic testing on every PR more reliable than remembering to test manually?
5. What's the real-world consequence of skipping containerization for a team of five engineers?

*Answers: 1) Environment inconsistency - "works on my machine" bugs caused by different installed versions or missing dependencies. 2) Every Python package your project depends on, and its version. 3) Opening a pull request. 4) Humans forget or skip steps under deadline pressure; automation runs every time without fail. 5) Each engineer's machine could behave slightly differently, causing bugs that only show up for some people and are hard to reproduce.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "rocket",
   "kicker": "Module 9 · Deployment and CI",
   "title": "Shipping to real users",
   "beats": [
    {
     "say": "Welcome to the last module."
    },
    {
     "say": "Today you package TrackIt so it runs the same everywhere, and set up tests that run on their own."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concepts",
   "title": "Build once, run the same everywhere",
   "nodes": [
    {
     "id": "df",
     "label": "Dockerfile",
     "x": 12,
     "y": 50,
     "sub": "the recipe",
     "art": "file"
    },
    {
     "id": "img",
     "label": "trackit-api",
     "x": 45,
     "y": 50,
     "sub": "the image",
     "art": "container"
    },
    {
     "id": "you",
     "label": "Your laptop",
     "x": 85,
     "y": 15,
     "art": "laptop"
    },
    {
     "id": "mate",
     "label": "Teammate's laptop",
     "x": 85,
     "y": 50,
     "art": "laptop"
    },
    {
     "id": "server",
     "label": "Real server",
     "x": 85,
     "y": 85,
     "art": "server"
    }
   ],
   "edges": [
    {
     "from": "df",
     "to": "img"
    },
    {
     "from": "img",
     "to": "you"
    },
    {
     "from": "img",
     "to": "mate"
    },
    {
     "from": "img",
     "to": "server"
    }
   ],
   "beats": [
    {
     "say": "Without containers, every machine has its own Python and its own packages. That's how you get, it works on my machine.",
     "show": 1,
     "on": "df"
    },
    {
     "say": "Docker build follows the Dockerfile and packages your app with everything it needs, into one image.",
     "show": 2,
     "on": "img",
     "send": {
      "from": "df",
      "to": "img",
      "label": "docker build -t trackit-api ."
     }
    },
    {
     "say": "Run that image on your laptop,",
     "show": 3,
     "on": "you",
     "send": {
      "from": "img",
      "to": "you",
      "label": "docker run"
     }
    },
    {
     "say": "on a teammate's laptop,",
     "show": 4,
     "on": "mate",
     "send": {
      "from": "img",
      "to": "mate",
      "label": "docker run"
     }
    },
    {
     "say": "or on a real server, and it behaves the same, because it's the same package.",
     "show": 5,
     "on": "server",
     "send": {
      "from": "img",
      "to": "server",
      "label": "docker run"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 1 and 3",
   "title": "Read the Dockerfile, line by line",
   "file": "Dockerfile",
   "code": "FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nCMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]",
   "beats": [
    {
     "say": "Start from a small official image that already has Python three point twelve.",
     "line": 1,
     "vars": {
      "image has": "Python 3.12"
     }
    },
    {
     "say": "Work inside a folder called slash app.",
     "line": 2,
     "vars": {
      "folder": "/app"
     }
    },
    {
     "say": "Copy in requirements dot t x t, made by pip freeze. It lists every package and its version.",
     "line": 3,
     "vars": {
      "image has": "Python 3.12, requirements.txt"
     }
    },
    {
     "say": "Install them all inside the image.",
     "line": 4,
     "vars": {
      "image has": "Python 3.12, fastapi, sqlalchemy, bcrypt, pytest…"
     }
    },
    {
     "say": "Copy in the rest of your code.",
     "line": 5,
     "vars": {
      "image has": "… + your code"
     }
    },
    {
     "say": "And this command starts uvicorn on port eight thousand when the container runs.",
     "line": 6,
     "out": "Uvicorn running on http://0.0.0.0:8000"
    },
    {
     "say": "Docker run, dash p eight thousand colon eight thousand, connects that port to your machine. Slash health works just as before.",
     "line": 6,
     "out": "GET /health → {\"status\":\"ok\"}"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Step 2",
   "title": "What COPY . . takes, and what .dockerignore leaves out",
   "values": [
    "main.py",
    "priority.py",
    "models.py",
    "database.py",
    "requirements.txt",
    "venv/",
    "__pycache__/",
    "trackit.db",
    ".git/"
   ],
   "beats": [
    {
     "say": "Copy dot dot copies everything in your project folder."
    },
    {
     "say": "Your code and requirements file belong in the image.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "note": "copied"
    },
    {
     "say": "But venv only works on your own computer.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "hl": 5
    },
    {
     "say": "So list it in dot docker ignore, along with cached files, your local trackit dot d b, and dot git.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "gone": [
      5,
      6,
      7,
      8
     ],
     "note": ".dockerignore"
    },
    {
     "say": "The image gets only what it needs, and none of your personal data.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "gone": [
      5,
      6,
      7,
      8
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 5",
   "title": "Tests that run themselves",
   "file": ".github/workflows/ci.yml",
   "code": "name: CI\non: [pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v5\n      - uses: actions/setup-python@v6\n        with:\n          python-version: \"3.12\"\n      - run: pip install -r requirements.txt\n      - run: pytest",
   "beats": [
    {
     "say": "This file lives in dot github slash workflows. GitHub reads it automatically.",
     "line": 1
    },
    {
     "say": "On pull request: it runs every time someone opens or updates a pull request.",
     "line": 2,
     "vars": {
      "trigger": "pull request opened"
     }
    },
    {
     "say": "GitHub starts a fresh Linux machine for the test job.",
     "line": [
      4,
      5
     ],
     "vars": {
      "machine": "ubuntu-latest"
     }
    },
    {
     "say": "It checks out your code, and sets up Python three point twelve.",
     "line": [
      7,
      10
     ],
     "vars": {
      "python": "3.12"
     }
    },
    {
     "say": "It installs your requirements.",
     "line": 11
    },
    {
     "say": "And runs pytest. Your two tests run with no one having to remember.",
     "line": 12,
     "out": "2 passed"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 6",
   "title": "Ship it",
   "nodes": [
    {
     "id": "you",
     "label": "feature/docker-ci",
     "x": 12,
     "y": 50,
     "sub": "your branch",
     "art": "git"
    },
    {
     "id": "pr",
     "label": "Pull request",
     "x": 45,
     "y": 50,
     "sub": "on GitHub",
     "art": "merge"
    },
    {
     "id": "ci",
     "label": "CI",
     "x": 80,
     "y": 20,
     "sub": "runs pytest",
     "art": "pipeline"
    },
    {
     "id": "main",
     "label": "main",
     "x": 80,
     "y": 80,
     "sub": "merged",
     "art": "rocket"
    }
   ],
   "edges": [
    {
     "from": "you",
     "to": "pr"
    },
    {
     "from": "pr",
     "to": "ci"
    },
    {
     "from": "pr",
     "to": "main"
    }
   ],
   "beats": [
    {
     "say": "First merge your Module 8 pull request, so your app and tests are on main. Then pull, and make a new branch.",
     "show": 1,
     "on": "you"
    },
    {
     "say": "Commit the Dockerfile, dot docker ignore, requirements, and the C I file. Push, and open a pull request.",
     "show": 2,
     "on": "pr",
     "send": {
      "from": "you",
      "to": "pr",
      "label": "git push -u origin feature/docker-ci"
     }
    },
    {
     "say": "Opening the pull request triggers C I.",
     "show": 3,
     "on": "ci",
     "send": {
      "from": "pr",
      "to": "ci",
      "label": "on: pull_request"
     }
    },
    {
     "say": "The tests come back green, right on the pull request, before a human even looks.",
     "show": 3,
     "on": "pr",
     "send": {
      "from": "ci",
      "to": "pr",
      "label": "✓ 2 passed"
     }
    },
    {
     "say": "Now it's safe to merge. That's how real teams ship.",
     "show": 4,
     "on": "main",
     "send": {
      "from": "pr",
      "to": "main",
      "label": "merge"
     }
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What triggers the CI workflow you wrote?",
   "options": [
    "Saving a file on your computer",
    "Opening a pull request",
    "Running python main.py"
   ],
   "answer": 1,
   "good": "That's right. The workflow runs on every pull request.",
   "bad": "Not quite. The workflow runs on every pull request.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What triggers the C I workflow you wrote?",
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
     "Your app runs in a Docker container",
     ""
    ],
    [
     "A pull request runs your tests automatically",
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
     "say": "your app runs inside a Docker container,",
     "show": 1
    },
    {
     "say": "and a pull request on GitHub runs your tests automatically.",
     "show": 2
    },
    {
     "say": "You've built and shipped a real product. Well done.",
     "show": 2
    }
   ]
  }
 ]
}
```
