<!-- order: 6 -->
# Backend Development for Builders: A Practical Beginner's Course

## Course Overview

**By the end of this course, you'll be able to:**
- Explain the request and response cycle, HTTP methods, and status codes
- Set up a FastAPI project with a clear folder structure and run it with Uvicorn
- Build create, read, update, and delete (CRUD) endpoints with request validation using Pydantic
- Return the right status code for every outcome and handle errors without leaking details
- Store data in SQLite with SQLAlchemy, so it survives a restart
- Configure the app with environment variables and log what it does
- Write automated tests with pytest and FastAPI's TestClient
- Rebuild part of the same API in Node.js with Express, and choose a sensible framework for a project

**Who this is for:** Beginners who know basic Python (variables, functions, dictionaries, classes) and want to understand what happens on the server: receiving requests, storing data, and serving an API that a frontend, or anyone else, can call.

**How the course works:** Eight modules. You build **one small app properly**, a task and notes API, adding one layer per module. Each module follows the same pattern:
- **Concept** - what it is, in plain language
- **Where you'd actually use this** - a real product scenario
- **Lab** - hands-on, runnable code, often ending with a short "Your turn" exercise
- **Checkpoint**
- **Quiz** - questions with answers

**Tools needed:** [Python 3.12+](https://www.python.org/downloads), a terminal, a code editor such as [VS Code](https://code.visualstudio.com), [curl](https://curl.se) (built into macOS, Linux, and Windows 10+), and [Node.js](https://nodejs.org) 20+ for Module 7. On Windows, use **Git Bash** (installed with [Git](https://git-scm.com/downloads)), because PowerShell handles the `curl` quotes differently; there you activate a virtual environment with `source venv/Scripts/activate`.

**What comes next:** **APIs for Builders** picks up the exact app you finish here and adds API design, GraphQL, and authentication.

---

## Module 0: What a Backend Actually Does

**Time: about 1 hour**

### Concept

A **backend** is the part of an application that runs on a server rather than in the user's browser. It receives **requests** (a browser asking for a page, an app asking for data), does something with them (reading or writing a database, checking permissions, running logic), and sends back a **response**. An **API (Application Programming Interface)** is the set of URLs and rules a backend exposes so other programs can talk to it.

```
Client sends a request  ->  Server receives it  ->  Server does work
(a browser, an app)          (routes it to code)     (reads/writes data)
                                                              |
Client receives a response  <-  Server sends a response  <---
```

Every HTTP request has a **method** that says what the client wants to do, and every response has a **status code** that says how it went:

| Method | Meaning | Status code | Meaning |
|---|---|---|---|
| `GET` | Read something | `200` | OK |
| `POST` | Create something | `201` | Created |
| `PATCH` | Change part of something | `204` | Done, nothing to send back |
| `PUT` | Replace something | `404` | Not found |
| `DELETE` | Remove something | `422` | The data sent was invalid |

The data itself usually travels as **JSON**, text that looks like a Python dictionary: `{"id": 1, "title": "Ship it", "done": false}`.

### Where you'd actually use this

Anything that stores data beyond one browser session (accounts, orders, posts others can see) needs a backend. The frontend displays things; the backend makes them real and shared.

### Lab

Open your browser's developer tools (right-click, "Inspect"), go to the "Network" tab, and reload any website. Click a request that returns data (often labeled `Fetch` or `XHR`) and find its **method**, **URL**, **status code**, and **response**. That's a real backend doing exactly what this module described.

### Checkpoint
You can explain, in plain language, what a request and a response are, name the method and status code of a real request you found, and say why a browser alone can't store data that other users can see.

### Quiz
1. What is a backend, in one sentence?
2. What is an API?
3. What is the difference between a request and a response?
4. Which HTTP method and status code would you expect when a new task is successfully created?
5. Why can't a browser alone store data that other users can see?

*Answers: 1) The part of an application that runs on a server, handling data and logic that a browser alone can't. 2) The set of URLs and rules a backend exposes, letting other programs send it requests and get back structured responses. 3) A request is what the client sends to ask for something or submit data; a response is what the server sends back as a result. 4) `POST`, answered with `201 Created`. 5) Data stored only in a browser lives on that one device, so other users can't reach it without a shared server storing it centrally.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "server",
   "kicker": "Module 0 · What a backend does",
   "title": "The part you don't see",
   "beats": [
    {
     "say": "Welcome to Backend Development for Builders."
    },
    {
     "say": "In this course you build one small task A P I properly, a layer at a time."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "A request goes in, a response comes back",
   "nodes": [
    {
     "id": "client",
     "label": "Client",
     "x": 12,
     "y": 50,
     "sub": "browser or app",
     "art": "browser"
    },
    {
     "id": "server",
     "label": "Server",
     "x": 50,
     "y": 50,
     "sub": "routes it to your code",
     "art": "server"
    },
    {
     "id": "db",
     "label": "Database",
     "x": 88,
     "y": 50,
     "sub": "stored tasks",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "client",
     "to": "server"
    },
    {
     "from": "server",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "A backend is the part of an app that runs on a server, not in the user's browser.",
     "show": 2,
     "on": "server"
    },
    {
     "say": "A client, like a browser or a phone app, sends a request: get slash tasks.",
     "show": 2,
     "on": "client",
     "send": {
      "from": "client",
      "to": "server",
      "label": "GET /tasks"
     }
    },
    {
     "say": "The server routes it to your code, and the code reads the data it needs.",
     "show": 3,
     "on": "db",
     "send": {
      "from": "server",
      "to": "db",
      "label": "read tasks"
     }
    },
    {
     "say": "The data comes back to the server.",
     "on": "server",
     "send": {
      "from": "db",
      "to": "server",
      "label": "1 task"
     }
    },
    {
     "say": "And the server sends a response: status two hundred, with the task as JSON.",
     "on": "client",
     "send": {
      "from": "server",
      "to": "client",
      "label": "200 · [{\"id\": 1, \"title\": \"Ship it\", …}]"
     }
    },
    {
     "say": "The addresses and rules a server offers, like slash tasks, are its A P I.",
     "on": [
      "server"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "The method says what. The status says how it went.",
   "columns": [
    "Request",
    "Method",
    "Status",
    "Meaning"
   ],
   "rows": [
    [
     "Read the task list",
     "GET",
     "200",
     "OK"
    ],
    [
     "Create a new task",
     "POST",
     "201",
     "Created"
    ],
    [
     "Mark a task done",
     "PATCH",
     "200",
     "OK"
    ],
    [
     "Replace a whole task",
     "PUT",
     "200",
     "OK"
    ],
    [
     "Delete a task",
     "DELETE",
     "204",
     "Done, nothing to send back"
    ],
    [
     "Read a task that isn't there",
     "GET",
     "404",
     "Not found"
    ],
    [
     "Create a task with no title",
     "POST",
     "422",
     "The data sent was invalid"
    ]
   ],
   "beats": [
    {
     "say": "Every request has a method, saying what the client wants. Every response has a status code, saying how it went.",
     "col": 1
    },
    {
     "say": "Get reads. Reading the task list comes back two hundred, OK.",
     "hl": 0
    },
    {
     "say": "Post creates. A new task comes back two oh one, created.",
     "hl": 1
    },
    {
     "say": "Patch changes part of something, like marking a task done. Put replaces the whole thing.",
     "hl": [
      2,
      3
     ]
    },
    {
     "say": "Delete removes it, and answers two oh four: done, with nothing to send back.",
     "hl": 4
    },
    {
     "say": "Things go wrong too. Ask for a task that isn't there, and you get four oh four, not found.",
     "hl": 5,
     "col": 2
    },
    {
     "say": "Send data that breaks the rules, like a task with no title, and you get four twenty two.",
     "hl": 6,
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Why shared data needs a backend",
   "nodes": [
    {
     "id": "you",
     "label": "Your browser",
     "x": 12,
     "y": 25,
     "sub": "you add a task",
     "art": "laptop"
    },
    {
     "id": "friend",
     "label": "Friend's phone",
     "x": 12,
     "y": 78,
     "sub": "wants to see it",
     "art": "phone"
    },
    {
     "id": "server",
     "label": "Server",
     "x": 50,
     "y": 50,
     "sub": "the backend",
     "art": "server"
    },
    {
     "id": "db",
     "label": "Database",
     "x": 88,
     "y": 50,
     "sub": "one shared copy",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "you",
     "to": "server"
    },
    {
     "from": "friend",
     "to": "server"
    },
    {
     "from": "server",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "Picture two people sharing one task list.",
     "show": 2,
     "on": [
      "you",
      "friend"
     ]
    },
    {
     "say": "If your browser kept the task to itself, it would live only on your device. Your friend could never see it.",
     "show": 2,
     "on": "you"
    },
    {
     "say": "With a backend, your browser posts the task to the server.",
     "show": 3,
     "on": "server",
     "send": {
      "from": "you",
      "to": "server",
      "label": "POST /tasks"
     }
    },
    {
     "say": "The server saves it in a database, in one central place.",
     "show": 4,
     "on": "db",
     "send": {
      "from": "server",
      "to": "db",
      "label": "save task"
     }
    },
    {
     "say": "Now your friend's phone asks for the list.",
     "on": "friend",
     "send": {
      "from": "friend",
      "to": "server",
      "label": "GET /tasks"
     }
    },
    {
     "say": "The server reads it from the database.",
     "on": "server",
     "send": {
      "from": "db",
      "to": "server",
      "label": "Ship it"
     }
    },
    {
     "say": "And sends it back. Same data, on another device.",
     "on": "friend",
     "send": {
      "from": "server",
      "to": "friend",
      "label": "200 · Ship it"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab",
   "title": "What you'll see in the Network tab",
   "columns": [
    "Name",
    "Method",
    "Status",
    "Type"
   ],
   "rows": [
    [
     "/",
     "GET",
     "200",
     "document"
    ],
    [
     "styles.css",
     "GET",
     "200",
     "stylesheet"
    ],
    [
     "logo.png",
     "GET",
     "200",
     "png"
    ],
    [
     "tasks",
     "GET",
     "200",
     "fetch"
    ],
    [
     "tasks",
     "POST",
     "201",
     "fetch"
    ]
   ],
   "beats": [
    {
     "say": "Now find a real one. Right click, choose Inspect, open the Network tab, and reload any site."
    },
    {
     "say": "Every line is one request. Many just load the page itself: the page, its styles, its pictures.",
     "hl": [
      0,
      1,
      2
     ]
    },
    {
     "say": "The ones that return data are usually labelled fetch, or X H R.",
     "hl": [
      3,
      4
     ],
     "dim": true,
     "col": 3
    },
    {
     "say": "Click one, and read its method and its status code. Your site's list will look different.",
     "hl": 3,
     "dim": true,
     "col": 2
    },
    {
     "say": "Its response tab shows the JSON the backend sent back.",
     "hl": 3,
     "dim": true,
     "sql": "[{\"id\": 1, \"title\": \"Ship it\", \"done\": false}]"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Which method and status code fit a new task being created?",
   "options": [
    "GET and 200",
    "POST and 201 Created",
    "DELETE and 204"
   ],
   "answer": 1,
   "good": "That's right. Creating is a post, answered with two oh one, created.",
   "bad": "Not quite. Creating is a post, answered with two oh one, created.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Which method and status code fit a new task being created?",
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
     "You can explain request and response",
     ""
    ],
    [
     "You found a real request's method and status",
     ""
    ],
    [
     "You can say why a backend is needed for shared data",
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
     "say": "you can explain a request and a response,",
     "show": 1
    },
    {
     "say": "name the method and status of a real request,",
     "show": 2
    },
    {
     "say": "and say why a browser alone can't store data others can see.",
     "show": 3
    },
    {
     "say": "Next, in Module 1, your first Fast A P I project.",
     "show": 3
    }
   ]
  }
 ]
}
```

---

## Module 1: Your First FastAPI Project

**Time: about 1.5 hours**

### Concept

**FastAPI** is a modern Python web framework. You write ordinary Python functions, mark which URL and method each one handles, and FastAPI does the rest: reading requests, checking data, turning your return values into JSON, and generating interactive documentation from your code. **Uvicorn** is the server program that actually listens for requests and passes them to your app.

A small, clear folder structure from day one saves pain later. By the end of this course your project will look like this:

```
tasks-api/
  app/
    __init__.py      # marks app/ as a package (can be empty)
    main.py          # creates the app and defines the routes
    schemas.py       # the shape of data coming in and going out (Module 2)
    database.py      # the database connection (Module 4)
    models.py        # the database tables (Module 4)
    config.py        # settings read from environment variables (Module 5)
  tests/
    conftest.py      # shared test setup (Module 6)
    test_tasks.py    # the tests (Module 6)
  requirements.txt   # the packages this project needs
```

### Where you'd actually use this

Every real backend starts here. Keeping data shapes, database code, and settings in separate files means you can change each one without reading the whole app.

### Lab

1. **Create the project and a virtual environment** (an isolated folder of packages just for this project):
```bash
mkdir tasks-api
cd tasks-api
python3 -m venv venv
source venv/bin/activate
pip install "fastapi[standard]" sqlalchemy pytest
pip freeze > requirements.txt
mkdir app tests
touch app/__init__.py
```
`fastapi[standard]` includes Uvicorn and the extras FastAPI's test client needs.

2. **Create `app/main.py`:**
```python
from fastapi import FastAPI

app = FastAPI(title="Tasks API")


@app.get("/health")
def health():
    return {"status": "ok"}
```
`@app.get("/health")` is a **decorator**: it tells FastAPI "when a `GET` request arrives for `/health`, run the function below". The dictionary you return is sent back as JSON.

3. **Run it** from the `tasks-api` folder (not from inside `app/`):
```bash
uvicorn app.main:app --reload
```
`app.main:app` means "the variable `app` in `app/main.py`"; `--reload` restarts the server when you save. In a second terminal:
```bash
curl http://localhost:8000/health
```
You should see `{"status":"ok"}`.

4. **Open the free documentation** at `http://localhost:8000/docs`, generated from your code. Click `/health`, "Try it out", then "Execute".

**Your turn:** Add a `GET /about` endpoint that returns `{"name": "Tasks API", "version": "0.1"}`. Save, and check it appears at `/docs` without restarting anything.

### Checkpoint
Your server runs with `uvicorn app.main:app --reload`, `/health` answers with JSON, and you've used the `/docs` page to call an endpoint.

### Quiz
1. What does Uvicorn do, and what does FastAPI do?
2. What does `app.main:app` tell Uvicorn?
3. Why create a virtual environment for each project?
4. What does `--reload` do, and should you use it in production?
5. What does `@app.get("/health")` do?

*Answers: 1) Uvicorn is the server that listens for HTTP requests; FastAPI is the framework that routes each request to your Python function and builds the response. 2) Load the module `app/main.py` and use the object named `app` inside it. 3) So each project has its own packages and versions, without clashing with other projects or the system Python. 4) It restarts the server when files change; it's for development only, not production. 5) It registers the function below it to handle `GET` requests to `/health`.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "package",
   "kicker": "Module 1 · Your first FastAPI project",
   "title": "Set it up properly from day one",
   "beats": [
    {
     "say": "Welcome to Module 1."
    },
    {
     "say": "Today you create the project, write your first endpoint, and run it."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Uvicorn listens. FastAPI routes.",
   "nodes": [
    {
     "id": "curl",
     "label": "Terminal",
     "x": 10,
     "y": 50,
     "sub": "curl",
     "art": "terminal"
    },
    {
     "id": "uv",
     "label": "Uvicorn",
     "x": 37,
     "y": 50,
     "sub": "listens on port 8000",
     "art": "server"
    },
    {
     "id": "fa",
     "label": "FastAPI",
     "x": 63,
     "y": 50,
     "sub": "finds the right function",
     "art": "router"
    },
    {
     "id": "fn",
     "label": "health()",
     "x": 90,
     "y": 50,
     "sub": "your code",
     "art": "code"
    }
   ],
   "edges": [
    {
     "from": "curl",
     "to": "uv"
    },
    {
     "from": "uv",
     "to": "fa"
    },
    {
     "from": "fa",
     "to": "fn"
    }
   ],
   "beats": [
    {
     "say": "Two tools work together. Uvicorn is the server that listens. Fast A P I routes each request to your function.",
     "show": 4
    },
    {
     "say": "Curl sends get slash health to port eight thousand.",
     "on": "uv",
     "send": {
      "from": "curl",
      "to": "uv",
      "label": "GET /health"
     }
    },
    {
     "say": "Uvicorn receives it, and passes it to your Fast A P I app.",
     "on": "fa",
     "send": {
      "from": "uv",
      "to": "fa",
      "label": "GET /health"
     }
    },
    {
     "say": "Fast A P I finds the function registered for get slash health, and runs it.",
     "on": "fn",
     "send": {
      "from": "fa",
      "to": "fn",
      "label": "health()"
     }
    },
    {
     "say": "The function returns a plain Python dictionary.",
     "on": "fa",
     "send": {
      "from": "fn",
      "to": "fa",
      "label": "{\"status\": \"ok\"}"
     }
    },
    {
     "say": "Fast A P I turns it into JSON for Uvicorn.",
     "on": "uv",
     "send": {
      "from": "fa",
      "to": "uv",
      "label": "JSON"
     }
    },
    {
     "say": "And Uvicorn sends it back. Curl prints it.",
     "on": "curl",
     "send": {
      "from": "uv",
      "to": "curl",
      "label": "{\"status\":\"ok\"}"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "One file, one job",
   "columns": [
    "File",
    "Holds",
    "Arrives in"
   ],
   "rows": [
    [
     "app/main.py",
     "The app and its routes",
     "Module 1"
    ],
    [
     "app/schemas.py",
     "Shape of data in and out",
     "Module 2"
    ],
    [
     "app/database.py",
     "The database connection",
     "Module 4"
    ],
    [
     "app/models.py",
     "The database tables",
     "Module 4"
    ],
    [
     "app/config.py",
     "Settings from environment variables",
     "Module 5"
    ],
    [
     "tests/test_tasks.py",
     "The tests",
     "Module 6"
    ],
    [
     "requirements.txt",
     "Packages the project needs",
     "Module 1"
    ]
   ],
   "beats": [
    {
     "say": "By the end of the course, your project will look like this. Each file has one job.",
     "col": 0
    },
    {
     "say": "Today you make two of them: main dot p y, and requirements dot t x t.",
     "hl": [
      0,
      6
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "Schemas arrive in Module 2.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "Database and models in Module 4.",
     "hl": [
      2,
      3
     ],
     "dim": true
    },
    {
     "say": "Config in Module 5, and tests in Module 6.",
     "hl": [
      4,
      5
     ],
     "dim": true
    },
    {
     "say": "Because each job has its own file, you can change one without reading the whole app.",
     "col": 1
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Step 1",
   "title": "Six commands to a clean project",
   "values": [
    "mkdir tasks-api",
    "python3 -m venv venv",
    "source venv/bin/activate",
    "pip install \"fastapi[standard]\" …",
    "pip freeze > requirements.txt",
    "mkdir app tests"
   ],
   "beats": [
    {
     "say": "Setting up takes six commands, run in order."
    },
    {
     "say": "Make the project folder, tasks dash A P I, and move into it.",
     "hl": 0,
     "ptr": {
      "step": 0
     },
     "note": "then: cd tasks-api"
    },
    {
     "say": "Create a virtual environment: an isolated folder of packages, just for this project.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "step": 1
     }
    },
    {
     "say": "Activate it, so everything you install goes into it, not into the system Python.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "step": 2
     },
     "note": "Git Bash on Windows: source venv/Scripts/activate"
    },
    {
     "say": "Install Fast A P I with its standard extras, which include Uvicorn, plus S Q L Alchemy and py test.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3,
     "ptr": {
      "step": 3
     },
     "note": "\"fastapi[standard]\" sqlalchemy pytest"
    },
    {
     "say": "Freeze writes the exact versions into requirements dot t x t.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "hl": 4,
     "ptr": {
      "step": 4
     }
    },
    {
     "say": "Then make the app and tests folders, and an empty init file inside app.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "hl": 5,
     "ptr": {
      "step": 5
     },
     "note": "touch app/__init__.py"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 2 and 3",
   "title": "Your first endpoint, running",
   "file": "app/main.py",
   "code": "from fastapi import FastAPI\n\napp = FastAPI(title=\"Tasks API\")\n\n\n@app.get(\"/health\")\ndef health():\n    return {\"status\": \"ok\"}\n\n\n@app.get(\"/about\")\ndef about():\n    return {\"name\": \"Tasks API\", \"version\": \"0.1\"}",
   "beats": [
    {
     "say": "Line one imports Fast A P I.",
     "line": 1
    },
    {
     "say": "Line three creates the app. This is the object Uvicorn will look for.",
     "line": 3,
     "vars": {
      "app": "FastAPI(title=\"Tasks API\")"
     }
    },
    {
     "say": "The decorator registers the function below it: when a get request arrives for slash health, run health.",
     "line": [
      6,
      7
     ]
    },
    {
     "say": "Nothing has run yet. Start the server with uvicorn, app dot main colon app, dash dash reload.",
     "out": "Uvicorn running on http://127.0.0.1:8000"
    },
    {
     "say": "Now curl slash health. Fast A P I runs health, and line eight returns a dictionary.",
     "line": [
      7,
      8
     ]
    },
    {
     "say": "It arrives as JSON.",
     "line": 8,
     "out": "{\"status\":\"ok\"}"
    },
    {
     "say": "Your turn: add get slash about the same way, and save. Reload restarts the server for you.",
     "line": [
      11,
      13
     ]
    },
    {
     "say": "Curl slash about, and you get the name and version. Both endpoints also appear at slash docs, ready to try.",
     "line": 13,
     "out": "{\"name\":\"Tasks API\",\"version\":\"0.1\"}"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Step 3",
   "title": "What app.main:app means",
   "values": [
    "app",
    ".",
    "main",
    ":",
    "app"
   ],
   "beats": [
    {
     "say": "Look closely at what you gave Uvicorn: app dot main colon app.",
     "note": "uvicorn app.main:app --reload"
    },
    {
     "say": "Before the colon is a module path. First, the folder called app.",
     "hl": 0,
     "note": "app/"
    },
    {
     "say": "Then the file main dot p y inside it.",
     "ok": [
      0
     ],
     "hl": [
      1,
      2
     ],
     "note": "app/main.py"
    },
    {
     "say": "After the colon: the variable named app inside that file.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": [
      3,
      4
     ],
     "note": "app = FastAPI(title=\"Tasks API\")"
    },
    {
     "say": "That's why you run it from the tasks dash A P I folder, where the app folder can be found.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "note": "run from tasks-api/, not from inside app/"
    },
    {
     "say": "And dash dash reload restarts the server when you save. It's for development only, never production.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "note": "--reload: development only"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Should you use --reload in production?",
   "options": [
    "Yes, always",
    "No, it's for development only",
    "Only on weekends"
   ],
   "answer": 1,
   "good": "That's right. Reload restarts the server when files change. It's for development only.",
   "bad": "Not quite. Reload restarts the server when files change. It's for development only.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Should you use dash dash reload in production?",
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
     "Your server runs and /health answers",
     ""
    ],
    [
     "You called an endpoint from /docs",
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
     "say": "your server runs, and slash health answers with JSON,",
     "show": 1
    },
    {
     "say": "and you've called an endpoint from the docs page.",
     "show": 2
    },
    {
     "say": "Next, in Module 2, routes, methods and validation.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 2: Routes, HTTP Methods, and Validation

**Time: about 2 hours**

### Concept

A **route** connects a method and a path to a function. Paths can contain **path parameters** (`/tasks/{task_id}`) for "which one", and the URL can carry **query parameters** (`/tasks?done=true`) for options like filtering. FastAPI reads both from your function's parameters and their **type hints**: `task_id: int` means "this must be a whole number".

For request bodies, a **Pydantic model** lists the fields, their types, and rules such as minimum length. If a request doesn't match, FastAPI rejects it with a `422` and a clear message before your code runs. Use separate models for what comes **in** and what goes **out**, so clients can't set fields like `id` themselves.

### Where you'd actually use this

Every endpoint that accepts data: a sign-up form, a comment, a settings change. Validating at the edge means the rest of your code can trust its data, and clients get a useful error instead of a crash.

### Lab

1. **Describe the data.** Create `app/schemas.py`:
```python
from pydantic import BaseModel, ConfigDict, Field


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    notes: str | None = Field(default=None, max_length=1000)


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    notes: str | None = Field(default=None, max_length=1000)
    done: bool | None = None


class TaskOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # lets Module 4 return database rows directly

    id: int
    title: str
    notes: str | None
    done: bool
```

2. **Write the five routes.** Replace `app/main.py` with this. For now, tasks live in a dictionary in memory, so they disappear when the server restarts (Module 4 fixes that):
```python
from fastapi import FastAPI, HTTPException, status

from app.schemas import TaskCreate, TaskOut, TaskUpdate

app = FastAPI(title="Tasks API")

tasks: dict[int, TaskOut] = {}
next_id = 1


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/tasks", response_model=list[TaskOut])
def list_tasks(done: bool | None = None):
    results = list(tasks.values())
    if done is not None:
        results = [t for t in results if t.done == done]
    return results


@app.get("/tasks/{task_id}", response_model=TaskOut)
def get_task(task_id: int):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks[task_id]


@app.post("/tasks", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(data: TaskCreate):
    global next_id
    task = TaskOut(id=next_id, title=data.title, notes=data.notes, done=False)
    tasks[next_id] = task
    next_id += 1
    return task


@app.patch("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, data: TaskUpdate):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    changes = data.model_dump(exclude_none=True)  # only the fields the client sent
    tasks[task_id] = tasks[task_id].model_copy(update=changes)
    return tasks[task_id]


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    del tasks[task_id]
```
- `data: TaskCreate` makes FastAPI read the JSON body and validate it
- `done: bool | None = None` isn't in the path, so it's an optional query parameter
- `response_model=TaskOut` filters and documents what the endpoint returns

3. **Exercise every route:**
```bash
curl -X POST http://localhost:8000/tasks -H "Content-Type: application/json" -d '{"title": "Learn FastAPI"}'
curl -X POST http://localhost:8000/tasks -H "Content-Type: application/json" -d '{"title": "Write tests", "notes": "use pytest"}'
curl -X PATCH http://localhost:8000/tasks/1 -H "Content-Type: application/json" -d '{"done": true}'
curl "http://localhost:8000/tasks?done=true"
curl -X DELETE http://localhost:8000/tasks/2
curl http://localhost:8000/tasks
```

4. **Break it on purpose:**
```bash
curl -X POST http://localhost:8000/tasks -H "Content-Type: application/json" -d '{"title": ""}'
curl -X POST http://localhost:8000/tasks -H "Content-Type: application/json" -d '{"notes": "no title"}'
curl http://localhost:8000/tasks/abc
```
Each returns `422` with a `detail` list naming the field and the problem. You wrote no checking code for any of them.

**Your turn:** Add a `priority` field (1 to 5, default 3) to `TaskCreate` and `TaskOut` with `Field(default=3, ge=1, le=5)`, send a priority of 9, and read the error. Remove it before Module 4 (or add it to the database model there too).

### Checkpoint
You created, read, filtered, updated, and deleted tasks with curl, and triggered three different validation errors without writing any validation code.

### Quiz
1. What is the difference between a path parameter and a query parameter?
2. Why use separate `TaskCreate` and `TaskOut` models instead of one?
3. What happens when a request body doesn't match the Pydantic model?
4. Why does `update_task` use `model_dump(exclude_none=True)`?
5. Which HTTP method fits "mark task 3 as done", and why not `POST`?

*Answers: 1) A path parameter identifies which resource (`/tasks/3`); a query parameter adds options such as filtering (`?done=true`). 2) Clients shouldn't send fields the server controls, like `id`, and the output can include fields the input doesn't. 3) FastAPI responds with `422` and a message describing each problem, and your function never runs. 4) So only the fields the client actually sent are changed; everything else keeps its current value. 5) `PATCH`, because it changes part of an existing task; `POST` is for creating a new one.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "form",
   "kicker": "Module 2 · Routes and validation",
   "title": "Accept data you can trust",
   "beats": [
    {
     "say": "Welcome to Module 2."
    },
    {
     "say": "Today you build all five task routes, and let Fast A P I check every request for you."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "A route = a method + a path + a function",
   "columns": [
    "Method",
    "Path",
    "Function",
    "Success"
   ],
   "rows": [
    [
     "GET",
     "/health",
     "health",
     "200"
    ],
    [
     "GET",
     "/tasks",
     "list_tasks",
     "200"
    ],
    [
     "GET",
     "/tasks/{task_id}",
     "get_task",
     "200"
    ],
    [
     "POST",
     "/tasks",
     "create_task",
     "201"
    ],
    [
     "PATCH",
     "/tasks/{task_id}",
     "update_task",
     "200"
    ],
    [
     "DELETE",
     "/tasks/{task_id}",
     "delete_task",
     "204"
    ]
   ],
   "beats": [
    {
     "say": "A route connects a method and a path to a function. Here's every route in main dot p y.",
     "col": 1
    },
    {
     "say": "Get slash tasks lists every task.",
     "hl": 1
    },
    {
     "say": "Put a task I D in the path, and you get just that one. A path parameter says which one.",
     "hl": 2,
     "col": 1
    },
    {
     "say": "The list can also take a query parameter, after a question mark, for options like filtering.",
     "hl": 1,
     "sql": "GET /tasks?done=true"
    },
    {
     "say": "Post creates a task, and answers two oh one.",
     "hl": 3,
     "col": 3
    },
    {
     "say": "Patch changes part of a task. Delete removes one, and answers two oh four.",
     "hl": [
      4,
      5
     ],
     "col": 3
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Pydantic checks the body before your code runs",
   "nodes": [
    {
     "id": "client",
     "label": "Client",
     "x": 12,
     "y": 50,
     "sub": "curl",
     "art": "terminal"
    },
    {
     "id": "check",
     "label": "TaskCreate",
     "x": 50,
     "y": 80,
     "sub": "title: 1 to 200 chars",
     "art": "shield"
    },
    {
     "id": "route",
     "label": "create_task",
     "x": 88,
     "y": 50,
     "sub": "your code",
     "art": "code"
    }
   ],
   "edges": [
    {
     "from": "client",
     "to": "check"
    },
    {
     "from": "check",
     "to": "route"
    },
    {
     "from": "route",
     "to": "client"
    }
   ],
   "beats": [
    {
     "say": "Before your code runs, Fast A P I checks the body against a Pydantic model.",
     "show": 3,
     "on": "check"
    },
    {
     "say": "A good request: the title, learn Fast A P I.",
     "on": "check",
     "send": {
      "from": "client",
      "to": "check",
      "label": "{\"title\": \"Learn FastAPI\"}"
     }
    },
    {
     "say": "It matches the rules, so the data passes through to your function.",
     "on": "route",
     "send": {
      "from": "check",
      "to": "route",
      "label": "data: TaskCreate"
     }
    },
    {
     "say": "Your code stores it, and answers two oh one, created.",
     "on": "client",
     "send": {
      "from": "route",
      "to": "client",
      "label": "201 · {\"id\": 1, …}"
     }
    },
    {
     "say": "Now a bad one: an empty title.",
     "on": "check",
     "send": {
      "from": "client",
      "to": "check",
      "label": "{\"title\": \"\"}"
     }
    },
    {
     "say": "It's shorter than the minimum, so Fast A P I answers four twenty two itself. Your function never runs.",
     "on": "client",
     "send": {
      "from": "check",
      "to": "client",
      "label": "422 · detail"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Create",
   "title": "Where a new task comes from",
   "file": "app/main.py",
   "code": "tasks: dict[int, TaskOut] = {}\nnext_id = 1\n\n@app.post(\"/tasks\", response_model=TaskOut, status_code=status.HTTP_201_CREATED)\ndef create_task(data: TaskCreate):\n    global next_id\n    task = TaskOut(id=next_id, title=data.title, notes=data.notes, done=False)\n    tasks[next_id] = task\n    next_id += 1\n    return task",
   "beats": [
    {
     "say": "For now, tasks live in a dictionary in memory, and the next I D starts at one.",
     "line": [
      1,
      2
     ],
     "vars": {
      "tasks": "{}",
      "next_id": 1
     }
    },
    {
     "say": "First curl: post the title, learn Fast A P I. Pydantic has already checked it.",
     "line": [
      4,
      5
     ],
     "vars": {
      "data": "TaskCreate(title=\"Learn FastAPI\", notes=None)"
     }
    },
    {
     "say": "The server builds the task. The I D comes from next I D, not from the client, and done starts False.",
     "line": 7,
     "vars": {
      "task": "TaskOut(id=1, title=\"Learn FastAPI\", notes=None, done=False)"
     }
    },
    {
     "say": "Store it under key one, and move next I D on to two.",
     "line": [
      8,
      9
     ],
     "vars": {
      "tasks": "{1: task}",
      "next_id": 2
     }
    },
    {
     "say": "Return it. Fast A P I sends it as JSON, with status two oh one.",
     "line": 10,
     "out": "{\"id\":1,\"title\":\"Learn FastAPI\",\"notes\":null,\"done\":false}"
    },
    {
     "say": "Second curl: write tests, with the notes, use py test. It gets I D two.",
     "line": [
      7,
      10
     ],
     "vars": {
      "data": "TaskCreate(title=\"Write tests\", notes=\"use pytest\")",
      "task": "TaskOut(id=2, title=\"Write tests\", notes=\"use pytest\", done=False)",
      "tasks": "{1: …, 2: …}",
      "next_id": 3
     },
     "out": "{\"id\":2,\"title\":\"Write tests\",\"notes\":\"use pytest\",\"done\":false}"
    },
    {
     "say": "That's why there are separate models in and out. Task create has no I D field, so a client can't pick one.",
     "line": 5
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Update",
   "title": "PATCH changes only what you sent",
   "columns": [
    "field",
    "task 1 now",
    "TaskUpdate",
    "changes",
    "after"
   ],
   "rows": [
    [
     "title",
     "\"Learn FastAPI\"",
     "None",
     "—",
     "\"Learn FastAPI\""
    ],
    [
     "notes",
     "None",
     "None",
     "—",
     "None"
    ],
    [
     "done",
     "False",
     "True",
     "True",
     "True"
    ]
   ],
   "beats": [
    {
     "say": "Third curl: patch task one, with done set to true.",
     "sql": "PATCH /tasks/1   {\"done\": true}",
     "col": 1
    },
    {
     "say": "Pydantic fills every field the client didn't send with None.",
     "col": 2
    },
    {
     "say": "Model dump, with exclude none, drops those. So changes holds only done.",
     "col": 3,
     "hl": 2,
     "sql": "changes = data.model_dump(exclude_none=True)   # {\"done\": True}"
    },
    {
     "say": "Model copy applies just that change. Title and notes keep their values.",
     "col": 4,
     "hl": [
      0,
      1
     ]
    },
    {
     "say": "Only done changed.",
     "col": 4,
     "hl": 2,
     "dim": true
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Filter and delete",
   "title": "Query, delete, list",
   "values": [
    "#1 Learn FastAPI · done",
    "#2 Write tests"
   ],
   "beats": [
    {
     "say": "Now there are two tasks, and only the first one is done."
    },
    {
     "say": "Get slash tasks, done equals true. The list keeps only tasks whose done matches.",
     "hl": 0,
     "gone": [
      1
     ],
     "note": "GET /tasks?done=true → [#1]"
    },
    {
     "say": "Delete slash tasks slash two. It answers two oh four, with no body.",
     "ok": [
      0
     ],
     "gone": [
      1
     ],
     "note": "DELETE /tasks/2 → 204"
    },
    {
     "say": "List them all, and only task one is left.",
     "vals": [
      "#1 Learn FastAPI · done"
     ],
     "ok": [
      0
     ],
     "note": "GET /tasks → [#1]"
    },
    {
     "say": "Restart the server, and even that one is gone. It only lived in memory. Module 4 fixes that.",
     "vals": [
      "#1 Learn FastAPI · done"
     ],
     "gone": [
      0
     ],
     "note": "after a restart: []"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Break it",
   "title": "Three errors you didn't write",
   "columns": [
    "Request",
    "Problem",
    "Status"
   ],
   "rows": [
    [
     "POST {\"title\": \"\"}",
     "title shorter than 1 character",
     "422"
    ],
    [
     "POST {\"notes\": \"no title\"}",
     "title is missing",
     "422"
    ],
    [
     "GET /tasks/abc",
     "task_id isn't an int",
     "422"
    ],
    [
     "POST {\"title\": \"x\", \"priority\": 9}",
     "priority above 5 (your turn)",
     "422"
    ]
   ],
   "beats": [
    {
     "say": "Now break it on purpose.",
     "col": 0
    },
    {
     "say": "An empty title fails the minimum length of one.",
     "hl": 0
    },
    {
     "say": "No title at all: it's required, so it's missing.",
     "hl": 1
    },
    {
     "say": "And a b c can't be a task I D, because the type hint says int.",
     "hl": 2
    },
    {
     "say": "Each answers four twenty two, with a detail list naming the field and the problem.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 2
    },
    {
     "say": "Your turn: add a priority field from one to five, send nine, and read the error.",
     "hl": 3,
     "dim": true
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Which method fits \"mark task 3 as done\"?",
   "options": [
    "POST",
    "PATCH, because it changes part of an existing task",
    "DELETE"
   ],
   "answer": 1,
   "good": "That's right. Patch changes part of an existing task. Post is for creating a new one.",
   "bad": "Not quite. Patch changes part of an existing task. Post is for creating a new one.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Which method fits mark task three as done?",
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
     "Full CRUD with curl",
     ""
    ],
    [
     "Three validation errors, no checking code",
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
     "say": "you've created, read, filtered, updated and deleted tasks with curl,",
     "show": 1
    },
    {
     "say": "and triggered three validation errors without writing any validation code.",
     "show": 2
    },
    {
     "say": "Next, in Module 3, honest status codes and safe errors.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 3: Status Codes and Error Handling

**Time: about 1.5 hours**

### Concept

A status code is the first thing a client checks, so it has to be honest:

| Range | Meaning | Common ones |
|---|---|---|
| 2xx | It worked | `200` OK, `201` Created, `204` No Content |
| 4xx | The client made a mistake | `400` Bad Request, `401` Not logged in, `403` Not allowed, `404` Not Found, `409` Conflict, `422` Invalid data |
| 5xx | The server failed | `500` Internal Server Error, `503` Unavailable |

**Expected** problems (a missing task, a duplicate email) are raised as `HTTPException` with the right 4xx code and a helpful message. **Unexpected** problems (a bug, a crashed database) become a plain `500` with a generic message, while the details go to your logs. Never send stack traces to clients: they confuse users and help attackers.

### Where you'd actually use this

A mobile app deciding whether to show "That task was deleted" (404), "Please fix the title" (422), or "Something went wrong, try again" (500), without parsing your message text.

### Lab

1. **Remove the repeated 404 checks with one helper.** In `app/main.py`, add this function above the routes:
```python
def get_task_or_404(task_id: int) -> TaskOut:
    if task_id not in tasks:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=f"Task {task_id} not found")
    return tasks[task_id]
```
Use it in `get_task` (`return get_task_or_404(task_id)`), and as the first line of `update_task` and `delete_task` in place of their `if` blocks. Raising an exception stops the function, so the rest only runs when the task exists.

2. **Catch anything unexpected.** Add these imports at the top of `app/main.py`:
```python
from fastapi import Request
from fastapi.responses import JSONResponse
```
and this handler below `app = FastAPI(...)`:
```python
@app.exception_handler(Exception)
async def unexpected_error(request: Request, exc: Exception):
    print(f"Unexpected error on {request.method} {request.url.path}: {exc!r}")  # Module 5 replaces print with logging
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})
```

3. **Test both kinds of error.** Add a temporary route that has a bug:
```python
@app.get("/boom")
def boom():
    return 1 / 0
```
```bash
curl -i http://localhost:8000/boom
curl -i http://localhost:8000/tasks/999
curl -i -X DELETE http://localhost:8000/tasks
```
`-i` shows the status line: `500` with a generic message (the real `ZeroDivisionError` appears only in your server terminal), `404`, and `405 Method Not Allowed`, which FastAPI returns because `/tasks` has no `DELETE` route. Delete `/boom` when you're done.

### Checkpoint
Your routes share one `get_task_or_404` helper, and you've seen a `404`, a `405`, and a safe `500` that hides the internal error from the client.

### Quiz
1. What is the difference between a 4xx and a 5xx status code?
2. Why shouldn't a `500` response include the stack trace?
3. What happens to the rest of a route function when `HTTPException` is raised?
4. A client sends a task title of 500 characters. Which status code should it get?
5. When would `409 Conflict` be the right answer?

*Answers: 1) 4xx means the client sent something wrong; 5xx means the server failed while handling a valid request. 2) It exposes internal details that help attackers and mean nothing to users; the details belong in server logs. 3) It stops immediately and FastAPI sends the error response instead. 4) `422`, because the data fails validation (FastAPI does this automatically from `max_length`). 5) When the request clashes with the current state, such as registering an email that already exists.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "warning",
   "kicker": "Module 3 · Status codes and errors",
   "title": "Be honest about what happened",
   "beats": [
    {
     "say": "Welcome to Module 3."
    },
    {
     "say": "A status code is the first thing a client checks, so it has to be honest."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "The first digit says who's responsible",
   "columns": [
    "Situation",
    "Status",
    "Range"
   ],
   "rows": [
    [
     "A task was created",
     "201 Created",
     "2xx"
    ],
    [
     "GET /tasks/999",
     "404 Not Found",
     "4xx"
    ],
    [
     "A 500-character title",
     "422 Invalid data",
     "4xx"
    ],
    [
     "DELETE /tasks",
     "405 Method Not Allowed",
     "4xx"
    ],
    [
     "Email already registered",
     "409 Conflict",
     "4xx"
    ],
    [
     "Not logged in",
     "401",
     "4xx"
    ],
    [
     "A bug divides by zero",
     "500 Internal Server Error",
     "5xx"
    ]
   ],
   "beats": [
    {
     "say": "The first digit of a status code tells you who's responsible.",
     "sql": "2xx it worked · 4xx the client made a mistake · 5xx the server failed",
     "col": 2
    },
    {
     "say": "Two hundreds mean it worked, like a task being created.",
     "hl": 0
    },
    {
     "say": "Four hundreds mean the client made a mistake: a missing task, invalid data, or a method that path doesn't have.",
     "hl": [
      1,
      2,
      3
     ]
    },
    {
     "say": "Four oh nine, conflict, means the request clashes with what exists, like an email that's already registered. Four oh one means not logged in.",
     "hl": [
      4,
      5
     ]
    },
    {
     "say": "Five hundreds mean the server failed, on a request that was fine.",
     "hl": 6,
     "dim": true
    },
    {
     "say": "A mobile app can pick the right message from the code alone, without reading your text.",
     "col": 1
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 1",
   "title": "One helper for every not found",
   "file": "app/main.py",
   "code": "def get_task_or_404(task_id: int) -> TaskOut:\n    if task_id not in tasks:\n        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=f\"Task {task_id} not found\")\n    return tasks[task_id]\n\n@app.get(\"/tasks/{task_id}\", response_model=TaskOut)\ndef get_task(task_id: int):\n    return get_task_or_404(task_id)\n\n@app.delete(\"/tasks/{task_id}\", status_code=status.HTTP_204_NO_CONTENT)\ndef delete_task(task_id: int):\n    get_task_or_404(task_id)\n    del tasks[task_id]",
   "beats": [
    {
     "say": "Three routes repeated the same not found check. Now one helper does it.",
     "line": [
      1,
      4
     ],
     "vars": {
      "tasks": "{1: Learn FastAPI}"
     }
    },
    {
     "say": "A client asks for task nine nine nine.",
     "line": [
      6,
      7
     ],
     "vars": {
      "task_id": 999
     }
    },
    {
     "say": "Get task calls the helper. Nine nine nine isn't in tasks.",
     "line": [
      8,
      2
     ]
    },
    {
     "say": "So the helper raises a four oh four. Raising stops everything, in the helper and in the route.",
     "line": 3,
     "out": "404 {\"detail\":\"Task 999 not found\"}"
    },
    {
     "say": "Now delete task one.",
     "line": [
      10,
      11
     ],
     "vars": {
      "task_id": 1
     }
    },
    {
     "say": "The helper finds it and returns, so the route carries on.",
     "line": [
      12,
      4
     ]
    },
    {
     "say": "Del removes it, and the response is two oh four, with no body.",
     "line": 13,
     "vars": {
      "tasks": "{}"
     },
     "out": "204 (no body)"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 2",
   "title": "Unexpected errors: log the details, send a plain 500",
   "nodes": [
    {
     "id": "client",
     "label": "Client",
     "x": 12,
     "y": 50,
     "sub": "curl -i /boom",
     "art": "terminal"
    },
    {
     "id": "route",
     "label": "/boom",
     "x": 50,
     "y": 20,
     "sub": "return 1 / 0",
     "art": "bug"
    },
    {
     "id": "handler",
     "label": "unexpected_error",
     "x": 50,
     "y": 80,
     "sub": "catches everything else",
     "art": "shield"
    },
    {
     "id": "logs",
     "label": "Server terminal",
     "x": 88,
     "y": 80,
     "sub": "only you see this",
     "art": "eye"
    }
   ],
   "edges": [
    {
     "from": "client",
     "to": "route"
    },
    {
     "from": "route",
     "to": "handler"
    },
    {
     "from": "handler",
     "to": "client"
    },
    {
     "from": "handler",
     "to": "logs"
    }
   ],
   "beats": [
    {
     "say": "Expected problems get a four hundred code. But what about a bug you didn't expect?",
     "show": 4
    },
    {
     "say": "Add a temporary route, slash boom, that divides by zero, and call it.",
     "on": "route",
     "send": {
      "from": "client",
      "to": "route",
      "label": "GET /boom"
     }
    },
    {
     "say": "One divided by zero raises a zero division error. Nothing in the route catches it.",
     "on": "handler",
     "send": {
      "from": "route",
      "to": "handler",
      "label": "ZeroDivisionError"
     }
    },
    {
     "say": "Your exception handler catches anything unexpected, and prints the real error in your server terminal.",
     "on": "logs",
     "send": {
      "from": "handler",
      "to": "logs",
      "label": "GET /boom: ZeroDivisionError('division by zero')"
     }
    },
    {
     "say": "The client gets only a plain five hundred: internal server error.",
     "on": "client",
     "send": {
      "from": "handler",
      "to": "client",
      "label": "500 · {\"detail\": \"Internal server error\"}"
     }
    },
    {
     "say": "Never send stack traces to clients. They confuse users, and they help attackers.",
     "on": [
      "client",
      "logs"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 3",
   "title": "Three requests, three honest answers",
   "columns": [
    "Request",
    "Status line",
    "Body"
   ],
   "rows": [
    [
     "GET /boom",
     "500 Internal Server Error",
     "{\"detail\":\"Internal server error\"}"
    ],
    [
     "GET /tasks/999",
     "404 Not Found",
     "{\"detail\":\"Task 999 not found\"}"
    ],
    [
     "DELETE /tasks",
     "405 Method Not Allowed",
     "{\"detail\":\"Method Not Allowed\"}"
    ]
   ],
   "beats": [
    {
     "say": "Run all three with curl dash i, which shows the status line.",
     "sql": "curl -i …",
     "col": 1
    },
    {
     "say": "Slash boom: five hundred, with a generic message. The details stayed in your terminal.",
     "hl": 0
    },
    {
     "say": "Task nine nine nine: four oh four, from your helper.",
     "hl": 1
    },
    {
     "say": "Delete slash tasks: four oh five. You never wrote that. Fast A P I sends it because slash tasks has no delete route.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "Then remove slash boom. It was only there to test."
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "A client sends a 500-character task title. Which status code?",
   "options": [
    "500",
    "422, because the data fails validation",
    "404"
   ],
   "answer": 1,
   "good": "That's right. Four twenty two, because the data fails validation. Fast A P I does this automatically.",
   "bad": "Not quite. Four twenty two, because the data fails validation. Fast A P I does this automatically.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "A client sends a five hundred character task title. Which status code?",
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
     "One get_task_or_404 helper",
     ""
    ],
    [
     "You've seen a 404, a 405 and a safe 500",
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
     "say": "your routes share one get task or four oh four helper,",
     "show": 1
    },
    {
     "say": "and you've seen a four oh four, a four oh five, and a safe five hundred.",
     "show": 2
    },
    {
     "say": "Next, in Module 4, data that survives a restart.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 4: Storing Data in SQLite with SQLAlchemy

**Time: about 2.5 hours**

### Concept

So far, restarting the server wipes every task. **SQLite** is a complete database stored in a single file and built into Python, with nothing to install, which makes it ideal for learning and small apps. **SQLAlchemy** is the most widely used Python database library. Its **ORM (Object-Relational Mapper)** lets you describe a table as a Python class and work with rows as objects. In the modern SQLAlchemy 2.x style:
- A **model** class describes a table; each `Mapped[...]` attribute is a column
- A **session** is a short conversation with the database: add, change, or delete objects, then `commit()` to save
- `select(Task)` builds a query; `db.scalars(query)` runs it and returns objects
- A FastAPI **dependency** (`Depends`) gives each request its own session and closes it afterwards

### Where you'd actually use this

Every app that remembers anything: users, orders, messages. The same pattern (models, a session per request, commit to save) works with PostgreSQL or MySQL in production.

### Lab

1. **Create `app/database.py`:**
```python
from typing import Annotated

from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

DATABASE_URL = "sqlite:///./tasks.db"

# check_same_thread=False lets FastAPI's worker threads share the SQLite connection
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    with SessionLocal() as db:
        yield db


# Type to put on a route parameter: "give me a database session"
SessionDep = Annotated[Session, Depends(get_db)]
```
`get_db` opens a session, hands (`yield`s) it to the route, and closes it after the request, even if an error happened.

2. **Create `app/models.py`:**
```python
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    notes: Mapped[str | None] = mapped_column(String(1000))
    done: Mapped[bool] = mapped_column(default=False)
```
`str | None` makes the column optional; plain `str` makes it required. The `id` is filled in by the database.

3. **Switch the routes to the database.** Replace `app/main.py` with:
```python
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import Base, SessionDep, engine
from app.models import Task
from app.schemas import TaskCreate, TaskOut, TaskUpdate


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)  # create tables that don't exist yet
    yield


app = FastAPI(title="Tasks API", lifespan=lifespan)


@app.exception_handler(Exception)
async def unexpected_error(request: Request, exc: Exception):
    print(f"Unexpected error on {request.method} {request.url.path}: {exc!r}")
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


def get_task_or_404(db: Session, task_id: int) -> Task:
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=f"Task {task_id} not found")
    return task


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/tasks", response_model=list[TaskOut])
def list_tasks(db: SessionDep, done: bool | None = None):
    query = select(Task).order_by(Task.id)
    if done is not None:
        query = query.where(Task.done == done)
    return db.scalars(query).all()


@app.get("/tasks/{task_id}", response_model=TaskOut)
def get_task(task_id: int, db: SessionDep):
    return get_task_or_404(db, task_id)


@app.post("/tasks", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(data: TaskCreate, db: SessionDep):
    task = Task(**data.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)  # reload so task.id is filled in
    return task


@app.patch("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, data: TaskUpdate, db: SessionDep):
    task = get_task_or_404(db, task_id)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: SessionDep):
    task = get_task_or_404(db, task_id)
    db.delete(task)
    db.commit()
```
The routes return SQLAlchemy `Task` objects; `response_model=TaskOut` (with `from_attributes=True` from Module 2) converts them to JSON.

4. **Prove the data survives.** Create two tasks with the Module 2 curl commands, restart the server (`Ctrl+C`, then run it again), and list the tasks. They're still there, in the new `tasks.db` file.

**Your turn:** Add a `GET /tasks/count` route that returns `{"total": <number of tasks>}`. Hint: `from sqlalchemy import func`, then `db.scalar(select(func.count()).select_from(Task))`. Define it *above* `/tasks/{task_id}`, or FastAPI will try to read `count` as a task id and answer `422`.

### Checkpoint
Your tasks live in `tasks.db` and survive a server restart, and every route gets its database session through `SessionDep`.

### Quiz
1. What does an ORM let you do?
2. What does `db.commit()` do, and what happens to your changes if you never call it?
3. Why is `get_db` written with `yield` instead of `return`?
4. Why call `db.refresh(task)` after committing a new task?
5. What would you change to move this app from SQLite to PostgreSQL?

*Answers: 1) Work with database tables as Python classes and rows as objects, instead of writing raw SQL for every query. 2) It saves the session's changes to the database permanently; without it, the changes are thrown away when the session closes. 3) So the session is handed to the route and then closed after the request finishes, even if an error occurred. 4) To reload the row from the database so values the database created, like the new `id`, are filled in. 5) Mainly the connection URL (and installing a PostgreSQL driver); the `check_same_thread` option is SQLite-only and would be removed.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "database",
   "kicker": "Module 4 · SQLite and SQLAlchemy",
   "title": "Data that survives a restart",
   "beats": [
    {
     "say": "Welcome to Module 4."
    },
    {
     "say": "So far, restarting the server wipes every task. Time for a database."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "One request, one session",
   "nodes": [
    {
     "id": "client",
     "label": "Client",
     "x": 12,
     "y": 30,
     "sub": "POST /tasks",
     "art": "terminal"
    },
    {
     "id": "route",
     "label": "create_task",
     "x": 50,
     "y": 30,
     "sub": "your route",
     "art": "code"
    },
    {
     "id": "db",
     "label": "tasks.db",
     "x": 88,
     "y": 30,
     "sub": "a SQLite file",
     "art": "database"
    },
    {
     "id": "getdb",
     "label": "get_db",
     "x": 50,
     "y": 80,
     "sub": "opens a session",
     "art": "plug"
    }
   ],
   "edges": [
    {
     "from": "client",
     "to": "route"
    },
    {
     "from": "route",
     "to": "db"
    },
    {
     "from": "getdb",
     "to": "route"
    }
   ],
   "beats": [
    {
     "say": "S Q Lite is a whole database in one file. S Q L Alchemy lets you work with it through Python objects.",
     "show": 3,
     "on": "db"
    },
    {
     "say": "A request arrives to create a task.",
     "on": "route",
     "send": {
      "from": "client",
      "to": "route",
      "label": "{\"title\": \"Learn FastAPI\"}"
     }
    },
    {
     "say": "Before the route runs, get d b opens a session, a short conversation with the database, and yields it.",
     "show": 4,
     "on": "getdb",
     "send": {
      "from": "getdb",
      "to": "route",
      "label": "db: Session"
     }
    },
    {
     "say": "Any route with a parameter of type session dep gets its own session this way.",
     "on": "getdb"
    },
    {
     "say": "The route adds the task and commits. Now it's saved in tasks dot d b.",
     "on": "db",
     "send": {
      "from": "route",
      "to": "db",
      "label": "INSERT · commit"
     }
    },
    {
     "say": "Refresh reloads the row, so the new I D, one, is filled in.",
     "on": "route",
     "send": {
      "from": "db",
      "to": "route",
      "label": "id = 1"
     }
    },
    {
     "say": "The route answers two oh one. Then get d b closes the session, even if there was an error.",
     "on": [
      "client",
      "getdb"
     ],
     "send": {
      "from": "route",
      "to": "client",
      "label": "201 · {\"id\": 1, …}"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "A model class is a table",
   "columns": [
    "id",
    "title",
    "notes",
    "done"
   ],
   "rows": [
    [
     "1",
     "Learn FastAPI",
     "NULL",
     "1"
    ],
    [
     "2",
     "Write tests",
     "use pytest",
     "0"
    ]
   ],
   "beats": [
    {
     "say": "The model class describes a table. Each mapped attribute becomes a column.",
     "sql": "class Task(Base):\n    __tablename__ = \"tasks\"",
     "col": 0
    },
    {
     "say": "The I D is the primary key. The database fills it in.",
     "col": 0
    },
    {
     "say": "Title is required, up to two hundred characters. Notes can be empty, which is stored as null.",
     "col": 2,
     "hl": 0
    },
    {
     "say": "Done defaults to False. S Q Lite stores True and False as one and zero.",
     "col": 3
    },
    {
     "say": "Say task one has been marked done. To list done tasks, select builds a query.",
     "sql": "query = select(Task).order_by(Task.id)\nquery = query.where(Task.done == done)   # done=True",
     "col": 3
    },
    {
     "say": "D b dot scalars runs it, and back come Task objects: just task one.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Now restart the server and list again. Both rows are still there, in tasks dot d b.",
     "hl": [
      0,
      1
     ],
     "sql": "GET /tasks   (after a restart)"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 3",
   "title": "Saving a new task",
   "file": "app/main.py",
   "code": "@app.post(\"/tasks\", response_model=TaskOut, status_code=status.HTTP_201_CREATED)\ndef create_task(data: TaskCreate, db: SessionDep):\n    task = Task(**data.model_dump())\n    db.add(task)\n    db.commit()\n    db.refresh(task)  # reload so task.id is filled in\n    return task",
   "beats": [
    {
     "say": "Post a task. Fast A P I hands the route the checked data, and a session from get d b.",
     "line": [
      1,
      2
     ],
     "vars": {
      "data": "TaskCreate(title=\"Learn FastAPI\", notes=None)",
      "db": "Session"
     }
    },
    {
     "say": "Model dump turns the data into a dictionary, and star star unpacks it into a new Task object.",
     "line": 3,
     "vars": {
      "task.title": "\"Learn FastAPI\"",
      "task.id": "None",
      "tasks.db": "no new row"
     }
    },
    {
     "say": "Add puts it in the session. Nothing is saved yet.",
     "line": 4
    },
    {
     "say": "Commit writes it to the database, permanently.",
     "line": 5,
     "vars": {
      "tasks.db": "row 1 saved"
     }
    },
    {
     "say": "Refresh reloads the row, so values the database created, like the I D, are filled in.",
     "line": 6,
     "vars": {
      "task.id": 1,
      "task.done": false
     }
    },
    {
     "say": "Return the Task object. Response model, with from attributes, turns it into JSON.",
     "line": 7,
     "out": "{\"id\":1,\"title\":\"Learn FastAPI\",\"notes\":null,\"done\":false}"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Concept",
   "title": "Commit, or it never happened",
   "values": [
    "open session",
    "db.add(task)",
    "db.commit()",
    "db.refresh(task)",
    "close session"
   ],
   "beats": [
    {
     "say": "Every request gets one short session. Here's its life."
    },
    {
     "say": "Get d b opens it.",
     "hl": 0,
     "ptr": {
      "step": 0
     },
     "note": "with SessionLocal() as db: yield db"
    },
    {
     "say": "The route adds the task.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "step": 1
     }
    },
    {
     "say": "Commit saves it.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "step": 2
     },
     "note": "now it's in tasks.db"
    },
    {
     "say": "Refresh reloads it.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3,
     "ptr": {
      "step": 3
     }
    },
    {
     "say": "And after the response, the with block closes the session.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "hl": 4,
     "ptr": {
      "step": 4
     }
    },
    {
     "say": "Now picture a route that adds or changes data, but never calls commit.",
     "vals": [
      "open session",
      "db.add(task)",
      "close session"
     ],
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "step": 1
     },
     "note": "no commit"
    },
    {
     "say": "When the session closes, the change is thrown away. It never reaches tasks dot d b.",
     "vals": [
      "open session",
      "db.add(task)",
      "close session"
     ],
     "ok": [
      0
     ],
     "gone": [
      1
     ],
     "hl": 2,
     "ptr": {
      "step": 2
     },
     "note": "change discarded"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What happens to your changes if you never call db.commit()?",
   "options": [
    "They save automatically",
    "They're thrown away when the session closes",
    "They save on the next request"
   ],
   "answer": 1,
   "good": "That's right. Without commit, the changes are thrown away when the session closes.",
   "bad": "Not quite. Without commit, the changes are thrown away when the session closes.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What happens to your changes if you never call d b dot commit?",
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
     "Tasks survive a restart in tasks.db",
     ""
    ],
    [
     "Every route uses SessionDep",
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
     "say": "your tasks live in tasks dot d b and survive a restart,",
     "show": 1
    },
    {
     "say": "and every route gets its session through session dep.",
     "show": 2
    },
    {
     "say": "Next, in Module 5, configuration and logging.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 5: Configuration and Logging

**Time: about 1.5 hours**

### Concept

**Configuration** is anything that changes between where the app runs: the database location, log level, secret keys. Hard-coding them means editing code to deploy and risks committing secrets to Git. Instead, read **environment variables**, values set outside the code, with safe defaults for local development.

**Logging** records what your app does while it runs. Unlike `print`, Python's `logging` module adds timestamps and levels (`DEBUG`, `INFO`, `WARNING`, `ERROR`) that you can filter with a setting. In production, logs are often the only way to find out what went wrong.

### Where you'd actually use this

Running the same code on your laptop with a local SQLite file, and on a server with a production database and quieter logs, just by setting different environment variables. When a user reports "my task vanished at 3pm", logs are how you find out what happened.

### Lab

1. **Create `app/config.py`**, the one place that reads settings:
```python
import os

APP_NAME = os.getenv("APP_NAME", "Tasks API")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tasks.db")
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
```

2. **Use it in `app/database.py`.** Delete the line `DATABASE_URL = "sqlite:///./tasks.db"` and add this import instead:
```python
from app.config import DATABASE_URL
```

3. **Add logging to `app/main.py`.** Add these imports at the top:
```python
import logging
import time

from app.config import APP_NAME, LOG_LEVEL
```
Below the imports, set logging up once:
```python
logging.basicConfig(level=LOG_LEVEL, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("tasks_api")
```
Change `app = FastAPI(title="Tasks API", lifespan=lifespan)` to `app = FastAPI(title=APP_NAME, lifespan=lifespan)`. Then add a **middleware**, code that runs around every request, below that line:
```python
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    ms = (time.perf_counter() - start) * 1000
    logger.info("%s %s -> %s (%.1f ms)", request.method, request.url.path, response.status_code, ms)
    return response
```
Finally, in `unexpected_error`, replace the `print(...)` line with:
```python
    logger.exception("Unexpected error on %s %s", request.method, request.url.path)
```
`logger.exception` logs the full stack trace, in your logs only. Also add `logger.info("Created task %s", task.id)` just before `return task` in `create_task`, and `logger.info("Deleted task %s", task_id)` at the end of `delete_task`.

4. **Run with different settings:**
```bash
DATABASE_URL="sqlite:///./dev.db" LOG_LEVEL=DEBUG uvicorn app.main:app --reload
```
Create a task with curl. The terminal shows lines like `INFO tasks_api: POST /tasks -> 201 (4.2 ms)`, and a new `dev.db` file appears. Restart normally and you're back on `tasks.db`.

5. **Keep settings in a `.env` file.** Create `.env` in the project folder:
```
DATABASE_URL=sqlite:///./tasks.db
LOG_LEVEL=INFO
```
and start the server with `uvicorn app.main:app --reload --env-file .env`. Create a `.gitignore` file listing `.env`, `venv/`, and `*.db` (one per line) so settings, packages, and data never reach Git.

### Checkpoint
Your app reads its database location and log level from environment variables, logs every request with its status and timing, and logs unexpected errors with a full stack trace that clients never see.

### Quiz
1. Why read the database URL from an environment variable instead of writing it in the code?
2. What does `os.getenv("LOG_LEVEL", "INFO")` return if `LOG_LEVEL` isn't set?
3. What can `logging` do that `print` can't?
4. What is middleware, in one sentence?
5. Why should `.env` be listed in `.gitignore`?

*Answers: 1) So the same code runs in different places with different settings, and secrets never live in the code or in Git. 2) The default, `"INFO"`. 3) Add timestamps and levels, and filter how much detail is shown with a setting, without changing code. 4) Code that runs before and after every request, such as timing and logging it. 5) It often contains secrets and machine-specific settings that must not be committed or shared.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "gear",
   "kicker": "Module 5 · Configuration and logging",
   "title": "Same code, different places",
   "beats": [
    {
     "say": "Welcome to Module 5."
    },
    {
     "say": "Today your app reads its settings from outside the code, and writes down what it does."
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 1",
   "title": "Settings come from the environment",
   "file": "app/config.py",
   "code": "import os\n\nAPP_NAME = os.getenv(\"APP_NAME\", \"Tasks API\")\nDATABASE_URL = os.getenv(\"DATABASE_URL\", \"sqlite:///./tasks.db\")\nLOG_LEVEL = os.getenv(\"LOG_LEVEL\", \"INFO\").upper()",
   "beats": [
    {
     "say": "Configuration is anything that changes between where the app runs. Config dot p y is the one place that reads it.",
     "line": [
      1,
      5
     ]
    },
    {
     "say": "First run: plain uvicorn, nothing set. Get env finds no app name, so it uses the default, Tasks A P I.",
     "line": 3,
     "vars": {
      "APP_NAME": "\"Tasks API\""
     }
    },
    {
     "say": "No database U R L either, so it's the local tasks dot d b.",
     "line": 4,
     "vars": {
      "DATABASE_URL": "\"sqlite:///./tasks.db\""
     }
    },
    {
     "say": "And the log level falls back to INFO.",
     "line": 5,
     "vars": {
      "LOG_LEVEL": "\"INFO\""
     }
    },
    {
     "say": "Second run: set two environment variables in front of the command.",
     "out": "$ DATABASE_URL=\"sqlite:///./dev.db\" LOG_LEVEL=DEBUG uvicorn app.main:app --reload"
    },
    {
     "say": "Now get env finds them. The database becomes dev dot d b, and a new file appears.",
     "line": 4,
     "vars": {
      "DATABASE_URL": "\"sqlite:///./dev.db\""
     }
    },
    {
     "say": "The log level becomes DEBUG. Upper keeps it in capitals, even if someone types lowercase.",
     "line": 5,
     "vars": {
      "LOG_LEVEL": "\"DEBUG\""
     }
    },
    {
     "say": "Same code, different settings. You never edited a line.",
     "line": 3
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Logging levels filter the detail",
   "columns": [
    "Level",
    "Used for",
    "LOG_LEVEL=INFO",
    "LOG_LEVEL=DEBUG"
   ],
   "rows": [
    [
     "DEBUG",
     "Fine detail while developing",
     "hidden",
     "shown"
    ],
    [
     "INFO",
     "Normal events: requests, new tasks",
     "shown",
     "shown"
    ],
    [
     "WARNING",
     "Something odd, still working",
     "shown",
     "shown"
    ],
    [
     "ERROR",
     "Failures, with logger.exception's stack trace",
     "shown",
     "shown"
    ]
   ],
   "beats": [
    {
     "say": "Unlike print, logging gives every line a timestamp and a level.",
     "col": 0
    },
    {
     "say": "Debug is the most detailed. Info records normal events, like a request or a new task.",
     "hl": [
      0,
      1
     ]
    },
    {
     "say": "Warning flags something odd. Error means something failed.",
     "hl": [
      2,
      3
     ]
    },
    {
     "say": "Your exception handler now calls logger dot exception, which writes the full stack trace, in your logs only.",
     "hl": 3,
     "dim": true,
     "sql": "logger.exception(\"Unexpected error on %s %s\", request.method, request.url.path)"
    },
    {
     "say": "Set the level to INFO, and debug lines are hidden. Info and above are shown.",
     "col": 2,
     "hl": [
      1,
      2,
      3
     ],
     "dim": true
    },
    {
     "say": "Switch to DEBUG, and you see everything. No code change, just a setting.",
     "col": 3,
     "hl": [
      0,
      1,
      2,
      3
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 3",
   "title": "Middleware times every request",
   "file": "app/main.py",
   "code": "@app.middleware(\"http\")\nasync def log_requests(request: Request, call_next):\n    start = time.perf_counter()\n    response = await call_next(request)\n    ms = (time.perf_counter() - start) * 1000\n    logger.info(\"%s %s -> %s (%.1f ms)\", request.method, request.url.path, response.status_code, ms)\n    return response",
   "beats": [
    {
     "say": "Middleware is code that runs around every request. This one logs each request, with its timing.",
     "line": [
      1,
      2
     ]
    },
    {
     "say": "A post to slash tasks arrives. The middleware notes the start time.",
     "line": 3,
     "vars": {
      "request": "POST /tasks"
     }
    },
    {
     "say": "Call next hands the request on to the route. Create task runs, and logs its own line.",
     "line": 4,
     "out": "INFO tasks_api: Created task 1"
    },
    {
     "say": "The response comes back to the middleware, with status two oh one.",
     "line": 4,
     "vars": {
      "response.status_code": 201
     }
    },
    {
     "say": "It works out how many milliseconds passed.",
     "line": 5,
     "vars": {
      "ms": 4.2
     }
    },
    {
     "say": "And logs the method, path, status and time.",
     "line": 6,
     "out": "INFO tasks_api: POST /tasks -> 201 (4.2 ms)"
    },
    {
     "say": "Then it returns the response, unchanged. In the real log, each line also starts with a timestamp.",
     "line": 7
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 5",
   "title": "Keep settings in .env, and out of Git",
   "nodes": [
    {
     "id": "env",
     "label": ".env",
     "x": 12,
     "y": 30,
     "sub": "DATABASE_URL, LOG_LEVEL",
     "art": "file"
    },
    {
     "id": "uv",
     "label": "Uvicorn",
     "x": 50,
     "y": 30,
     "sub": "--env-file .env",
     "art": "terminal"
    },
    {
     "id": "app",
     "label": "config.py",
     "x": 88,
     "y": 30,
     "sub": "os.getenv(...)",
     "art": "gear"
    },
    {
     "id": "git",
     "label": "Git",
     "x": 12,
     "y": 80,
     "sub": ".gitignore: .env, venv/, *.db",
     "art": "git"
    }
   ],
   "edges": [
    {
     "from": "env",
     "to": "uv"
    },
    {
     "from": "uv",
     "to": "app"
    },
    {
     "from": "env",
     "to": "git"
    }
   ],
   "beats": [
    {
     "say": "Typing variables every time gets old. Put them in a dot env file instead.",
     "show": 1,
     "on": "env"
    },
    {
     "say": "Start Uvicorn with dash dash env file, dot env. It loads them as environment variables.",
     "show": 2,
     "on": "uv",
     "send": {
      "from": "env",
      "to": "uv",
      "label": "DATABASE_URL, LOG_LEVEL"
     }
    },
    {
     "say": "Config dot p y reads them exactly as before.",
     "show": 3,
     "on": "app",
     "send": {
      "from": "uv",
      "to": "app",
      "label": "os.getenv"
     }
    },
    {
     "say": "But dot env often holds secrets, so it must never reach Git.",
     "show": 4,
     "on": "git"
    },
    {
     "say": "List dot env in dot git ignore, along with venv and your database files. Git never sees them.",
     "show": 4,
     "on": [
      "env",
      "git"
     ]
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why should .env be listed in .gitignore?",
   "options": [
    "It makes Git faster",
    "It often holds secrets that must never be committed",
    "Git can't read .env files"
   ],
   "answer": 1,
   "good": "That's right. It often contains secrets and machine-specific settings that must not be committed or shared.",
   "bad": "Not quite. It often contains secrets and machine-specific settings that must not be committed or shared.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why should dot env be listed in dot git ignore?",
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
     "Settings come from environment variables",
     ""
    ],
    [
     "Every request is logged with status and timing",
     ""
    ],
    [
     "Unexpected errors are logged, never shown",
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
     "say": "your app reads its database and log level from environment variables,",
     "show": 1
    },
    {
     "say": "logs every request with status and timing,",
     "show": 2
    },
    {
     "say": "and logs unexpected errors that clients never see.",
     "show": 3
    },
    {
     "say": "Next, in Module 6, automated tests.",
     "show": 3
    }
   ]
  }
 ]
}
```

---

## Module 6: Automated Tests with pytest

**Time: about 2 hours**

### Concept

**Automated tests** are small functions that call your API and check the answers, so you can confirm in seconds that everything still works. **pytest** runs every function whose name starts with `test_`; a plain `assert` checks each result. FastAPI's **TestClient** sends requests straight to your app in memory, with no server running.

Tests must never touch your real data, so you **override a dependency**: swap `get_db` for one that uses a throwaway in-memory database. A **fixture** is a pytest function that prepares something a test needs (here, a ready client) and cleans up afterwards.

### Where you'd actually use this

Before every deploy and on every pull request. Tests catch the "one-line change" that quietly broke deleting tasks.

### Lab

1. **Create `tests/conftest.py`.** pytest loads this file automatically and shares its fixtures with every test file:
```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app


@pytest.fixture
def client():
    # A fresh in-memory database for every test, so tests never touch tasks.db
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestSession = sessionmaker(bind=engine)

    def override_get_db():
        with TestSession() as db:
            yield db

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()
```
`StaticPool` keeps one connection open, so the in-memory database lives for the whole test.

2. **Create `tests/test_tasks.py`:**
```python
def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_and_get_task(client):
    response = client.post("/tasks", json={"title": "Write tests"})
    assert response.status_code == 201
    task = response.json()
    assert task["title"] == "Write tests"
    assert task["done"] is False

    response = client.get(f"/tasks/{task['id']}")
    assert response.status_code == 200
    assert response.json() == task


def test_empty_title_is_rejected(client):
    response = client.post("/tasks", json={"title": ""})
    assert response.status_code == 422


def test_missing_task_returns_404(client):
    response = client.get("/tasks/999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Task 999 not found"}


def test_update_filter_and_delete(client):
    task_id = client.post("/tasks", json={"title": "Ship it"}).json()["id"]
    client.post("/tasks", json={"title": "Still to do"})

    response = client.patch(f"/tasks/{task_id}", json={"done": True})
    assert response.json()["done"] is True

    done_tasks = client.get("/tasks", params={"done": True}).json()
    assert [t["id"] for t in done_tasks] == [task_id]

    assert client.delete(f"/tasks/{task_id}").status_code == 204
    assert client.get(f"/tasks/{task_id}").status_code == 404
```
Each test gets `client` just by naming it as a parameter.

3. **Run the tests** from the `tasks-api` folder:
```bash
python -m pytest -v
```
You should see `5 passed`. `python -m` makes pytest use your virtual environment and find the `app` package. A deprecation warning mentioning `httpx2` is harmless; `pip install httpx2` silences it.

4. **Watch a test catch a bug.** Change `status.HTTP_201_CREATED` to `status.HTTP_200_OK` in `app/main.py` and rerun: `test_create_and_get_task` fails and shows which assertion broke. Change it back.

**Your turn:** Write `test_patch_only_changes_sent_fields`: create a task with `notes`, `PATCH` only `{"done": true}`, and assert the title and notes didn't change. Then write a test that `DELETE /tasks/999` returns `404`.

### Checkpoint
`python -m pytest` runs your test suite against a throwaway database and passes, and you've watched a test fail when you broke the code.

### Quiz
1. What does FastAPI's TestClient let you do?
2. Why do the tests override `get_db` instead of using `tasks.db`?
3. What is a pytest fixture?
4. How does pytest decide which functions are tests?
5. Why does `test_create_and_get_task` check the status code as well as the JSON body?

*Answers: 1) Send requests to your app in memory and inspect the responses, without starting a server. 2) So tests start from a clean, known state every time and never change or depend on your real data. 3) A function that prepares something tests need, such as a client with a fresh database, and cleans up afterwards. 4) It runs functions whose names start with `test_` in files named `test_*.py`. 5) The status code is part of the API's contract; clients rely on `201` to know something was created.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "test",
   "kicker": "Module 6 · Automated tests",
   "title": "Know it still works, in seconds",
   "beats": [
    {
     "say": "Welcome to Module 6."
    },
    {
     "say": "Tests are small functions that call your A P I and check the answers."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Tests use a throwaway database",
   "nodes": [
    {
     "id": "test",
     "label": "test_tasks.py",
     "x": 10,
     "y": 50,
     "sub": "run by pytest",
     "art": "test"
    },
    {
     "id": "tc",
     "label": "TestClient",
     "x": 36,
     "y": 50,
     "sub": "no server needed",
     "art": "plug"
    },
    {
     "id": "app",
     "label": "Your app",
     "x": 62,
     "y": 50,
     "sub": "routes + get_db",
     "art": "code"
    },
    {
     "id": "real",
     "label": "tasks.db",
     "x": 90,
     "y": 80,
     "sub": "your real data",
     "art": "database"
    },
    {
     "id": "mem",
     "label": "In-memory DB",
     "x": 90,
     "y": 20,
     "sub": "\"sqlite://\"",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "test",
     "to": "tc"
    },
    {
     "from": "tc",
     "to": "app"
    },
    {
     "from": "app",
     "to": "real"
    },
    {
     "from": "app",
     "to": "mem"
    }
   ],
   "beats": [
    {
     "say": "Py test runs every function whose name starts with test.",
     "show": 1,
     "on": "test"
    },
    {
     "say": "Each test calls your A P I through a test client.",
     "show": 2,
     "on": "tc",
     "send": {
      "from": "test",
      "to": "tc",
      "label": "client.post(\"/tasks\")"
     }
    },
    {
     "say": "The test client sends the request straight to your app, in memory. No server is running.",
     "show": 3,
     "on": "app",
     "send": {
      "from": "tc",
      "to": "app",
      "label": "POST /tasks"
     }
    },
    {
     "say": "Normally, get d b would give the route a session on tasks dot d b. Tests must never touch that.",
     "show": 4,
     "on": "real"
    },
    {
     "say": "So the fixture overrides get d b, swapping in a fresh database that lives only in memory.",
     "show": 5,
     "on": "mem"
    },
    {
     "say": "Now every request lands in the throwaway database.",
     "on": "mem",
     "send": {
      "from": "app",
      "to": "mem",
      "label": "INSERT task"
     }
    },
    {
     "say": "When the test ends, it's gone, and the next test starts clean.",
     "on": [
      "mem",
      "test"
     ]
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Step 1",
   "title": "The client fixture, step by step",
   "values": [
    "in-memory engine",
    "create tables",
    "override get_db",
    "yield TestClient",
    "test runs",
    "clear overrides"
   ],
   "beats": [
    {
     "say": "A fixture prepares what a test needs, then cleans up afterwards."
    },
    {
     "say": "First, an engine on S Q Lite colon slash slash, with nothing after it. That's a database in memory.",
     "hl": 0,
     "ptr": {
      "step": 0
     },
     "note": "create_engine(\"sqlite://\", poolclass=StaticPool)"
    },
    {
     "say": "Static pool keeps one connection open, so that database lives for the whole test.",
     "hl": 0,
     "ptr": {
      "step": 0
     },
     "note": "StaticPool: one shared connection"
    },
    {
     "say": "Create the tables in it.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "step": 1
     },
     "note": "Base.metadata.create_all(bind=engine)"
    },
    {
     "say": "Point get d b at the test sessions instead.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "step": 2
     },
     "note": "app.dependency_overrides[get_db] = override_get_db"
    },
    {
     "say": "Yield the client. The test runs right here, using it.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": [
      3,
      4
     ],
     "ptr": {
      "step": 4
     }
    },
    {
     "say": "Afterwards, clear the overrides, and the app is back to normal.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "hl": 5,
     "ptr": {
      "step": 5
     },
     "note": "app.dependency_overrides.clear()"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 2",
   "title": "One test, line by line",
   "file": "tests/test_tasks.py",
   "code": "def test_create_and_get_task(client):\n    response = client.post(\"/tasks\", json={\"title\": \"Write tests\"})\n    assert response.status_code == 201\n    task = response.json()\n    assert task[\"title\"] == \"Write tests\"\n    assert task[\"done\"] is False\n\n    response = client.get(f\"/tasks/{task['id']}\")\n    assert response.status_code == 200\n    assert response.json() == task",
   "beats": [
    {
     "say": "Naming client as a parameter is all it takes. Py test runs the fixture and passes it in.",
     "line": 1,
     "vars": {
      "client": "TestClient"
     }
    },
    {
     "say": "Post a task. The database is fresh, so it gets I D one.",
     "line": 2,
     "vars": {
      "response.status_code": 201
     }
    },
    {
     "say": "Assert checks the status is two oh one. It is, so the test carries on.",
     "line": 3
    },
    {
     "say": "Read the JSON body, then check the title, and that done is False.",
     "line": [
      4,
      6
     ],
     "vars": {
      "task": "{\"id\": 1, \"title\": \"Write tests\", \"notes\": None, \"done\": False}"
     }
    },
    {
     "say": "Now get that task back by its I D.",
     "line": 8,
     "vars": {
      "response.status_code": 200
     }
    },
    {
     "say": "Two hundred, and the body matches exactly.",
     "line": [
      9,
      10
     ]
    },
    {
     "say": "Every assert passed, so the test passes.",
     "out": "tests/test_tasks.py::test_create_and_get_task PASSED"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 3 and 4",
   "title": "Watch a test catch a bug",
   "columns": [
    "Test",
    "Checks",
    "Before",
    "After the bug"
   ],
   "rows": [
    [
     "test_health",
     "200 and status ok",
     "PASSED",
     "PASSED"
    ],
    [
     "test_create_and_get_task",
     "201, then the same task back",
     "PASSED",
     "FAILED"
    ],
    [
     "test_empty_title_is_rejected",
     "422 for an empty title",
     "PASSED",
     "PASSED"
    ],
    [
     "test_missing_task_returns_404",
     "404 and its message",
     "PASSED",
     "PASSED"
    ],
    [
     "test_update_filter_and_delete",
     "PATCH, filter, 204, then 404",
     "PASSED",
     "PASSED"
    ]
   ],
   "beats": [
    {
     "say": "Run python dash m py test, dash v. Five tests, about a second.",
     "sql": "python -m pytest -v",
     "col": 1
    },
    {
     "say": "All five pass.",
     "col": 2,
     "hl": [
      0,
      1,
      2,
      3,
      4
     ]
    },
    {
     "say": "Now break something on purpose: change two oh one created to two hundred OK.",
     "sql": "status_code=status.HTTP_200_OK   # was HTTP_201_CREATED"
    },
    {
     "say": "Run again. Create and get task fails, because it checks for two oh one.",
     "col": 3,
     "hl": 1,
     "dim": true
    },
    {
     "say": "Py test shows exactly which assert broke. The other four still pass, because none of them checks that code.",
     "col": 3,
     "hl": [
      0,
      2,
      3,
      4
     ],
     "sql": "1 failed, 4 passed"
    },
    {
     "say": "Change it back. A test just caught a bug before your users did."
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why do the tests override get_db?",
   "options": [
    "It makes tests run on the internet",
    "So tests start clean and never touch your real data",
    "Because SQLite doesn't work in tests"
   ],
   "answer": 1,
   "good": "That's right. So every test starts from a clean state and never changes your real data.",
   "bad": "Not quite. So every test starts from a clean state and never changes your real data.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why do the tests override get d b?",
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
     "Tests pass on a throwaway database",
     ""
    ],
    [
     "You saw a test catch a bug",
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
     "say": "your tests pass against a throwaway database,",
     "show": 1
    },
    {
     "say": "and you've watched one fail when you broke the code.",
     "show": 2
    },
    {
     "say": "Next, in the last module, the same A P I in Node.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 7: The Same API in Node.js and Express, and Choosing a Framework

**Time: about 2 hours**

### Concept

**Node.js** runs JavaScript outside the browser, so the language of the frontend can also run a server. **Express** is the most widely used Node.js framework: you register a handler for each method and path, much like FastAPI's decorators. Rebuilding the same endpoints shows which ideas are universal (routes, methods, status codes, JSON) and which are framework conveniences: Express has no built-in validation, for example, so you check input yourself or add a library such as Zod.

### Where you'd actually use this

Teams that want one language across frontend and backend, real-time features such as chat, and the many existing Node.js codebases you may join.

### Lab

1. **Set up a Node project** in a new folder, outside `tasks-api`:
```bash
mkdir tasks-express
cd tasks-express
npm init -y
npm install express
```

2. **Create `app.js`** with three of the same endpoints (in memory, to keep the focus on the framework):
```javascript
const express = require("express");

const app = express();
app.use(express.json()); // parse JSON request bodies into req.body

const PORT = Number(process.env.PORT) || 3000;
const tasks = new Map(); // id -> task, in memory only
let nextId = 1;

app.get("/tasks", (req, res) => {
  let results = [...tasks.values()];
  if (req.query.done !== undefined) {
    const done = req.query.done === "true";
    results = results.filter((t) => t.done === done);
  }
  res.json(results);
});

app.get("/tasks/:id", (req, res) => {
  const task = tasks.get(Number(req.params.id));
  if (!task) {
    return res.status(404).json({ detail: `Task ${req.params.id} not found` });
  }
  res.json(task);
});

app.post("/tasks", (req, res) => {
  const { title, notes = null } = req.body ?? {};
  // No Pydantic here: we check the input by hand
  if (typeof title !== "string" || title.length < 1 || title.length > 200) {
    return res.status(422).json({ detail: "title must be a string of 1 to 200 characters" });
  }
  const task = { id: nextId++, title, notes, done: false };
  tasks.set(task.id, task);
  res.status(201).json(task);
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
```
- `:id` is a route parameter, read from `req.params.id` (always a string, hence `Number(...)`)
- `req.query` holds query parameters, also as strings
- `res.status(code).json(data)` sets the status and sends JSON; `process.env` reads environment variables

3. **Run and test it.** `node --watch` restarts on save, like `--reload`:
```bash
node --watch app.js
```
```bash
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title": "Ship it"}'
curl http://localhost:3000/tasks/1
curl -i http://localhost:3000/tasks/9
curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title": 123}'
curl "http://localhost:3000/tasks?done=false"
```
Same requests, same status codes, same JSON as your FastAPI app, but type conversion, validation, and docs are now your job.

### Choosing a framework

All four are mature and widely used in production. Pick by your team's language and how much structure you want built in:

| Framework | Language | Choose it when | Trade-off |
|---|---|---|---|
| **FastAPI** | Python | You're building a JSON API and want validation and docs from type hints, especially next to data or AI code | Fewer built-ins for full websites (admin, templates) |
| **Flask** | Python | You want a tiny, flexible core for a small app or prototype | You pick and assemble validation, database, and docs yourself |
| **Django** | Python | You're building a larger, database-heavy site that benefits from a built-in ORM, admin panel, and user accounts | More to learn up front, and more opinions about structure |
| **Express** | JavaScript | Your team wants one language front and back, or you're joining a Node.js codebase | Very minimal: validation, structure, and docs are up to you |

Everything you practiced here (routes, validation, status codes, a database layer, configuration, logging, tests) carries over to all of them.

### Checkpoint
You rebuilt three endpoints in Express, got the same responses as your FastAPI app, and can name a sensible reason to choose each of FastAPI, Flask, Django, and Express.

### Quiz
1. What does Node.js let JavaScript do that it can't do in a browser alone?
2. What does `express.json()` do?
3. Why does the Express version check `title` by hand?
4. Why does `/tasks/:id` use `Number(req.params.id)`?
5. A team is building a large content site with user accounts and staff who need to edit data through an admin panel, all in Python. Which framework fits best, and why?

*Answers: 1) Run outside the browser on a server, handling network requests, files, and databases directly. 2) It parses JSON request bodies so they're available as a JavaScript object in `req.body`. 3) Express has no built-in validation like Pydantic, so without a check (or a library such as Zod) bad data would be stored. 4) Route parameters always arrive as strings, but the Map's keys are numbers. 5) Django, because it includes an ORM, user accounts, and an automatic admin panel out of the box.*

**Next:** APIs for Builders adds proper API design, GraphQL, and authentication to the app you built here.

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "server",
   "kicker": "Module 7 · Node.js and Express",
   "title": "Same ideas, another framework",
   "beats": [
    {
     "say": "Welcome to the last module."
    },
    {
     "say": "You rebuild part of your A P I in JavaScript, to see which ideas are universal."
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 2",
   "title": "Creating a task in Express",
   "file": "app.js",
   "code": "app.use(express.json()); // parse JSON request bodies into req.body\nconst tasks = new Map(); // id -> task, in memory only\nlet nextId = 1;\n\napp.post(\"/tasks\", (req, res) => {\n  const { title, notes = null } = req.body ?? {};\n  // No Pydantic here: we check the input by hand\n  if (typeof title !== \"string\" || title.length < 1 || title.length > 200) {\n    return res.status(422).json({ detail: \"title must be a string of 1 to 200 characters\" });\n  }\n  const task = { id: nextId++, title, notes, done: false };\n  tasks.set(task.id, task);\n  res.status(201).json(task);\n});",
   "beats": [
    {
     "say": "Express registers a handler for each method and path, much like Fast A P I's decorators.",
     "line": 5
    },
    {
     "say": "First, express dot json parses JSON bodies into req dot body.",
     "line": 1,
     "vars": {
      "nextId": 1
     }
    },
    {
     "say": "Post the title, ship it. Title is pulled out, and notes defaults to null.",
     "line": 6,
     "vars": {
      "title": "\"Ship it\"",
      "notes": "null"
     }
    },
    {
     "say": "There's no Pydantic, so we check by hand. It's a string of seven characters, so it passes.",
     "line": 8
    },
    {
     "say": "Build the task. Next I D plus plus uses one, then moves on to two.",
     "line": 11,
     "vars": {
      "task.id": 1,
      "nextId": 2
     }
    },
    {
     "say": "Store it in the map, and send two oh one with the task as JSON.",
     "line": [
      12,
      13
     ],
     "out": "201 {\"id\":1,\"title\":\"Ship it\",\"notes\":null,\"done\":false}"
    },
    {
     "say": "Now post a title of one two three. A number, not text.",
     "line": 6,
     "vars": {
      "title": 123,
      "notes": "null",
      "task.id": "—"
     }
    },
    {
     "say": "Its type isn't string, so we return four twenty two, with our own message.",
     "line": [
      8,
      9
     ],
     "out": "422 {\"detail\":\"title must be a string of 1 to 200 characters\"}"
    },
    {
     "say": "Next I D is still two. Without that check, the number would have been stored.",
     "line": 3,
     "vars": {
      "nextId": 2
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 2",
   "title": "Everything in the URL arrives as a string",
   "columns": [
    "Request",
    "req.params.id",
    "Number(…)",
    "tasks.get",
    "Response"
   ],
   "rows": [
    [
     "GET /tasks/1",
     "\"1\"",
     "1",
     "the task",
     "200"
    ],
    [
     "GET /tasks/9",
     "\"9\"",
     "9",
     "undefined",
     "404 Task 9 not found"
    ],
    [
     "without Number()",
     "\"1\"",
     "—",
     "undefined",
     "404, wrongly"
    ]
   ],
   "beats": [
    {
     "say": "Getting one task shows another difference. Route parameters arrive as strings.",
     "col": 1
    },
    {
     "say": "The map's keys are numbers, so Number turns the string one into the number one, and the task is found.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "Task nine isn't there. Tasks dot get gives undefined, and we send the four oh four ourselves.",
     "hl": 1,
     "col": 4
    },
    {
     "say": "Forget Number, and the string one never matches the number one. Task one would look missing.",
     "hl": 2,
     "dim": true,
     "col": 3
    },
    {
     "say": "Query parameters are strings too. That's why done is compared with the text, true.",
     "sql": "const done = req.query.done === \"true\";"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Compare",
   "title": "Same ideas, different spelling",
   "columns": [
    "Idea",
    "FastAPI",
    "Express"
   ],
   "rows": [
    [
     "Route",
     "@app.get(\"/tasks/{task_id}\")",
     "app.get(\"/tasks/:id\", …)"
    ],
    [
     "Path parameter",
     "task_id: int, converted for you",
     "Number(req.params.id)"
    ],
    [
     "JSON body",
     "data: TaskCreate",
     "req.body, via express.json()"
    ],
    [
     "Validation",
     "Automatic 422 from Pydantic",
     "By hand, or a library like Zod"
    ],
    [
     "Status code",
     "status_code=201",
     "res.status(201)"
    ],
    [
     "Docs",
     "Free at /docs",
     "None built in"
    ],
    [
     "Restart on save",
     "--reload",
     "node --watch"
    ]
   ],
   "beats": [
    {
     "say": "Side by side, the ideas are the same. Only the spelling changes.",
     "col": 0
    },
    {
     "say": "Routes, parameters, JSON bodies and status codes are universal.",
     "hl": [
      0,
      1,
      2,
      4
     ]
    },
    {
     "say": "But type conversion, validation and docs were Fast A P I conveniences. In Express, they're your job.",
     "hl": [
      1,
      3,
      5
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "Even the dev loop matches: node dash dash watch restarts on save, like dash dash reload.",
     "hl": 6,
     "dim": true
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Choosing a framework",
   "title": "Pick by language, and how much is built in",
   "columns": [
    "Framework",
    "Language",
    "Choose it when",
    "Trade-off"
   ],
   "rows": [
    [
     "FastAPI",
     "Python",
     "JSON APIs, validation and docs from type hints",
     "Fewer built-ins for full websites"
    ],
    [
     "Flask",
     "Python",
     "A tiny, flexible core for small apps",
     "You assemble the pieces yourself"
    ],
    [
     "Django",
     "Python",
     "Larger database-heavy sites: ORM, admin, accounts",
     "More to learn up front"
    ],
    [
     "Express",
     "JavaScript",
     "One language front and back, or a Node codebase",
     "Validation, structure, docs are up to you"
    ]
   ],
   "beats": [
    {
     "say": "All four are mature. Pick by your team's language, and how much you want built in.",
     "col": 1
    },
    {
     "say": "Fast A P I suits JSON A P Is, especially next to data or A I code.",
     "hl": 0
    },
    {
     "say": "Flask is a tiny core you build up yourself.",
     "hl": 1
    },
    {
     "say": "Django brings an O R M, an admin panel and user accounts.",
     "hl": 2
    },
    {
     "say": "Express suits teams who want one language, front and back.",
     "hl": 3
    },
    {
     "say": "So, a big Python content site where staff edit data in an admin panel? Django.",
     "hl": 2,
     "dim": true,
     "col": 2
    },
    {
     "say": "Whichever you choose, everything you practised here carries over."
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why does the Express version check title by hand?",
   "options": [
    "Express validates too slowly",
    "Express has no built-in validation like Pydantic",
    "JavaScript can't read JSON"
   ],
   "answer": 1,
   "good": "That's right. Express has no built-in validation like Pydantic, so you check it yourself or use a library like Zod.",
   "bad": "Not quite. Express has no built-in validation like Pydantic, so you check it yourself or use a library like Zod.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why does the Express version check title by hand?",
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
     "Three endpoints rebuilt in Express",
     ""
    ],
    [
     "You can explain when to pick each framework",
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
     "say": "you've rebuilt three endpoints in Express with the same responses,",
     "show": 1
    },
    {
     "say": "and can name a good reason to choose each framework.",
     "show": 2
    },
    {
     "say": "You've finished Backend Development for Builders. Next, A P Is for Builders picks up the app you just built.",
     "show": 2
    }
   ]
  }
 ]
}
```
