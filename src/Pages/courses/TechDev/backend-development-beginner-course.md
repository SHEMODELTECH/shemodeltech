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
   "art": "api",
   "kicker": "Module 0 · What a backend does",
   "title": "The part you don't see",
   "beats": [
    {
     "say": "Welcome to Backend Development for Builders."
    },
    {
     "say": "In this course you build one small task API properly, a layer at a time."
    }
   ]
  },
  {
   "kind": "flow",
   "art": "api",
   "kicker": "Concept",
   "title": "Request and response",
   "steps": [
    "Client sends a request",
    "Server routes it",
    "Code does the work",
    "Response comes back"
   ],
   "beats": [
    {
     "say": "A backend runs on a server, not in the user's browser.",
     "show": 0
    },
    {
     "say": "A client, like a browser or an app, sends a request.",
     "show": 1
    },
    {
     "say": "The server routes it to your code.",
     "show": 2
    },
    {
     "say": "Your code does the work, like reading or writing a database.",
     "show": 3
    },
    {
     "say": "And the server sends back a response.",
     "show": 4
    },
    {
     "say": "An API is the set of addresses and rules a backend offers, so other programs can talk to it.",
     "show": 4
    }
   ]
  },
  {
   "kind": "list",
   "art": "api",
   "kicker": "Concept",
   "title": "Methods say what you want",
   "items": [
    [
     "GET",
     "Read"
    ],
    [
     "POST",
     "Create"
    ],
    [
     "PATCH",
     "Change part"
    ],
    [
     "PUT",
     "Replace"
    ],
    [
     "DELETE",
     "Remove"
    ]
   ],
   "beats": [
    {
     "say": "Every request has a method, saying what the client wants.",
     "show": 0
    },
    {
     "say": "Get reads something.",
     "show": 1
    },
    {
     "say": "Post creates something.",
     "show": 2
    },
    {
     "say": "Patch changes part of something.",
     "show": 3
    },
    {
     "say": "Put replaces it.",
     "show": 4
    },
    {
     "say": "And delete removes it.",
     "show": 5
    }
   ]
  },
  {
   "kind": "list",
   "art": "proof",
   "kicker": "Concept",
   "title": "Status codes say how it went",
   "items": [
    [
     "200",
     "OK"
    ],
    [
     "201",
     "Created"
    ],
    [
     "204",
     "Done, nothing to return"
    ],
    [
     "404",
     "Not found"
    ],
    [
     "422",
     "Invalid data"
    ]
   ],
   "beats": [
    {
     "say": "And every response has a status code saying how it went.",
     "show": 0
    },
    {
     "say": "Two hundred, OK.",
     "show": 1
    },
    {
     "say": "Two oh one, created.",
     "show": 2
    },
    {
     "say": "Two oh four, done, with nothing to send back.",
     "show": 3
    },
    {
     "say": "Four oh four, not found.",
     "show": 4
    },
    {
     "say": "And four twenty two, the data sent was invalid.",
     "show": 5
    },
    {
     "say": "The data itself usually travels as JSON, which looks like a Python dictionary.",
     "show": 5
    }
   ]
  },
  {
   "kind": "flow",
   "art": "browser",
   "kicker": "Lab",
   "title": "Watch a real backend",
   "steps": [
    "Inspect → Network",
    "Reload a site",
    "Find method, URL, status, response"
   ],
   "beats": [
    {
     "say": "Now watch a real one.",
     "show": 0
    },
    {
     "say": "Open developer tools, and the Network tab.",
     "show": 1
    },
    {
     "say": "Reload any website.",
     "show": 2
    },
    {
     "say": "Click a request that returns data, and find its method, address, status code and response.",
     "show": 3
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
     "say": "Next, in Module 1, your first FastAPI project.",
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
   "art": "rocket",
   "kicker": "Module 1 · Your first FastAPI project",
   "title": "Set it up properly from day one",
   "beats": [
    {
     "say": "Welcome to Module 1."
    }
   ]
  },
  {
   "kind": "list",
   "art": "api",
   "kicker": "Concept",
   "title": "Two tools",
   "items": [
    [
     "FastAPI",
     "Routes requests to your functions"
    ],
    [
     "Uvicorn",
     "The server that listens"
    ]
   ],
   "beats": [
    {
     "say": "Two tools work together.",
     "show": 0
    },
    {
     "say": "FastAPI is a Python framework. You write normal functions, mark which address each one handles, and it does the rest: reading requests, checking data, and returning JSON.",
     "show": 1
    },
    {
     "say": "Uvicorn is the server program that listens for requests and passes them to your app.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "blocks",
   "kicker": "Concept",
   "title": "A clear folder structure",
   "file": "tasks-api/",
   "code": "app/\n  main.py       # the app and its routes\n  schemas.py    # data shapes (Module 2)\n  database.py   # connection (Module 4)\n  models.py     # tables (Module 4)\n  config.py     # settings (Module 5)\ntests/\n  test_tasks.py # tests (Module 6)",
   "beats": [
    {
     "say": "A clear folder structure saves pain later.",
     "show": 0
    },
    {
     "say": "Main dot p y holds the routes. Schemas describe your data. Database, models and config each get their own file.",
     "show": 1
    },
    {
     "say": "And tests live in their own folder.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab · Step 2",
   "title": "Your first endpoint",
   "file": "app/main.py",
   "code": "from fastapi import FastAPI\n\napp = FastAPI(title=\"Tasks API\")\n\n@app.get(\"/health\")\ndef health():\n    return {\"status\": \"ok\"}",
   "beats": [
    {
     "say": "In main dot p y, create the app.",
     "show": 0
    },
    {
     "say": "The decorator, app dot get slash health, means: when a get request arrives for slash health, run this function.",
     "show": 1
    },
    {
     "say": "The dictionary you return is sent back as JSON.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "terminal",
   "kicker": "Lab · Steps 3 and 4",
   "title": "Run it and use the free docs",
   "steps": [
    "uvicorn app.main:app --reload",
    "curl /health → {\"status\":\"ok\"}",
    "/docs: try it out"
   ],
   "beats": [
    {
     "say": "Run uvicorn app dot main colon app, dash dash reload, from the project folder.",
     "show": 1
    },
    {
     "say": "Curl slash health, and you get status: ok.",
     "show": 2
    },
    {
     "say": "Then open slash docs. FastAPI builds interactive documentation from your code, for free.",
     "show": 3
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
     "say": "Should you use --reload in production?",
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
     "say": "your server runs, slash health answers with JSON,",
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
   "art": "shield",
   "kicker": "Module 2 · Routes and validation",
   "title": "Accept data you can trust",
   "beats": [
    {
     "say": "Welcome to Module 2."
    },
    {
     "say": "Today you build all five task routes, and let FastAPI check every request for you."
    }
   ]
  },
  {
   "kind": "list",
   "art": "path",
   "kicker": "Concept",
   "title": "Path and query parameters",
   "items": [
    [
     "Path parameter",
     "/tasks/{task_id}: which one"
    ],
    [
     "Query parameter",
     "/tasks?done=true: options"
    ]
   ],
   "beats": [
    {
     "say": "A route connects a method and a path to a function.",
     "show": 0
    },
    {
     "say": "A path parameter says which one, like slash tasks slash three.",
     "show": 1
    },
    {
     "say": "A query parameter adds options, like question mark done equals true.",
     "show": 2
    },
    {
     "say": "Type hints, like task I D colon int, tell FastAPI it must be a whole number.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "shield",
   "kicker": "Lab · Step 1",
   "title": "Describe your data with Pydantic",
   "file": "app/schemas.py",
   "code": "class TaskCreate(BaseModel):\n    title: str = Field(min_length=1, max_length=200)\n    notes: str | None = Field(default=None, max_length=1000)\n\nclass TaskOut(BaseModel):\n    id: int\n    title: str\n    notes: str | None\n    done: bool",
   "beats": [
    {
     "say": "A Pydantic model lists the fields, their types and their rules.",
     "show": 0
    },
    {
     "say": "A title must be between one and two hundred characters.",
     "show": 1
    },
    {
     "say": "Use separate models for what comes in, and what goes out. That way clients can't set fields like I D themselves.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "api",
   "kicker": "Lab · Step 2",
   "title": "Five routes",
   "steps": [
    "GET /tasks",
    "GET /tasks/{id}",
    "POST /tasks",
    "PATCH /tasks/{id}",
    "DELETE /tasks/{id}"
   ],
   "beats": [
    {
     "say": "Then the five routes.",
     "show": 0
    },
    {
     "say": "List tasks, with an optional done filter.",
     "show": 1
    },
    {
     "say": "Get one task.",
     "show": 2
    },
    {
     "say": "Create one, answering two oh one.",
     "show": 3
    },
    {
     "say": "Patch one, changing only the fields that were sent.",
     "show": 4
    },
    {
     "say": "And delete one, answering two oh four.",
     "show": 5
    },
    {
     "say": "For now they live in memory, so they vanish on restart. Module 4 fixes that.",
     "show": 5
    }
   ]
  },
  {
   "kind": "list",
   "art": "warning",
   "kicker": "Lab · Step 4",
   "title": "Break it on purpose",
   "items": [
    [
     "{\"title\": \"\"}",
     "Too short"
    ],
    [
     "{\"notes\": \"no title\"}",
     "Title missing"
    ],
    [
     "/tasks/abc",
     "Not a number"
    ]
   ],
   "beats": [
    {
     "say": "Now break it on purpose.",
     "show": 0
    },
    {
     "say": "Send an empty title.",
     "show": 1
    },
    {
     "say": "Leave the title out.",
     "show": 2
    },
    {
     "say": "Ask for task A B C instead of a number.",
     "show": 3
    },
    {
     "say": "Each one returns four twenty two, naming the field and the problem. And you wrote no checking code at all.",
     "show": 3
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
     "say": "Which method fits \"mark task 3 as done\"?",
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
   "kind": "list",
   "art": "warning",
   "kicker": "Concept",
   "title": "Three families",
   "items": [
    [
     "2xx",
     "It worked: 200, 201, 204"
    ],
    [
     "4xx",
     "Client mistake: 400, 401, 403, 404, 409, 422"
    ],
    [
     "5xx",
     "Server failed: 500, 503"
    ]
   ],
   "beats": [
    {
     "say": "Three families.",
     "show": 0
    },
    {
     "say": "Two hundreds: it worked.",
     "show": 1
    },
    {
     "say": "Four hundreds: the client made a mistake. Like not found, not allowed, conflict, or invalid data.",
     "show": 2
    },
    {
     "say": "Five hundreds: the server failed.",
     "show": 3
    }
   ]
  },
  {
   "kind": "list",
   "art": "shield",
   "kicker": "Concept",
   "title": "Expected versus unexpected",
   "items": [
    [
     "Expected",
     "Right 4xx + helpful message"
    ],
    [
     "Unexpected",
     "Plain 500; details in logs only"
    ]
   ],
   "beats": [
    {
     "say": "Handle two kinds of problem differently.",
     "show": 0
    },
    {
     "say": "Expected problems, like a missing task, get the right four hundred code and a helpful message.",
     "show": 1
    },
    {
     "say": "Unexpected problems, like a bug, get a plain five hundred with a generic message. The details go to your logs only.",
     "show": 2
    },
    {
     "say": "Never send stack traces to clients. They confuse users, and help attackers.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab · Step 1",
   "title": "One helper for 404s",
   "file": "app/main.py",
   "code": "def get_task_or_404(task_id: int) -> TaskOut:\n    if task_id not in tasks:\n        raise HTTPException(404, detail=f\"Task {task_id} not found\")\n    return tasks[task_id]",
   "beats": [
    {
     "say": "In the lab, one helper replaces every repeated not found check.",
     "show": 0
    },
    {
     "say": "Raising an exception stops the function immediately, so the rest only runs if the task exists.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "warning",
   "kicker": "Lab · Steps 2 and 3",
   "title": "Test both kinds of error",
   "steps": [
    "/boom → 500 (safe)",
    "/tasks/999 → 404",
    "DELETE /tasks → 405"
   ],
   "beats": [
    {
     "say": "Then add a catch-all handler for anything unexpected, and a temporary route with a bug.",
     "show": 0
    },
    {
     "say": "The buggy route answers five hundred, with a generic message. The real error only shows in your terminal.",
     "show": 1
    },
    {
     "say": "A missing task gives four oh four.",
     "show": 2
    },
    {
     "say": "And deleting slash tasks, which has no delete route, gives four oh five, method not allowed.",
     "show": 3
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
   "good": "That's right. Four twenty two, because the data fails validation. FastAPI does this automatically.",
   "bad": "Not quite. Four twenty two, because the data fails validation. FastAPI does this automatically.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "A client sends a 500-character task title. Which status code?",
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
   "kind": "list",
   "art": "database",
   "kicker": "Concept",
   "title": "The pieces",
   "items": [
    [
     "SQLite",
     "A database in one file"
    ],
    [
     "ORM",
     "Tables as classes, rows as objects"
    ],
    [
     "Session + commit",
     "Change, then save"
    ],
    [
     "Depends",
     "One session per request"
    ]
   ],
   "beats": [
    {
     "say": "SQLite is a complete database in a single file, built into Python.",
     "show": 1
    },
    {
     "say": "SQLAlchemy's ORM lets you describe a table as a Python class, and work with rows as objects.",
     "show": 2
    },
    {
     "say": "A session is a short conversation with the database. Make changes, then commit to save them.",
     "show": 3
    },
    {
     "say": "And a FastAPI dependency gives each request its own session, and closes it afterwards.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "database",
   "kicker": "Lab · Step 1",
   "title": "A session per request",
   "file": "app/database.py",
   "code": "engine = create_engine(\"sqlite:///./tasks.db\", connect_args={\"check_same_thread\": False})\nSessionLocal = sessionmaker(bind=engine)\n\ndef get_db():\n    with SessionLocal() as db:\n        yield db\n\nSessionDep = Annotated[Session, Depends(get_db)]",
   "beats": [
    {
     "say": "Get D B opens a session and hands it to the route with yield.",
     "show": 0
    },
    {
     "say": "After the request finishes, it closes the session, even if an error happened.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "table",
   "kicker": "Lab · Step 2",
   "title": "A Task table",
   "file": "app/models.py",
   "code": "class Task(Base):\n    __tablename__ = \"tasks\"\n\n    id: Mapped[int] = mapped_column(primary_key=True)\n    title: Mapped[str] = mapped_column(String(200))\n    notes: Mapped[str | None] = mapped_column(String(1000))\n    done: Mapped[bool] = mapped_column(default=False)",
   "beats": [
    {
     "say": "The task model describes the table.",
     "show": 0
    },
    {
     "say": "Each mapped attribute is a column. Optional notes use string or none. The database fills in the I D.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "database",
   "kicker": "Lab · Step 3",
   "title": "Creating a task now",
   "steps": [
    "Task(**data)",
    "db.add",
    "db.commit",
    "db.refresh",
    "return task"
   ],
   "beats": [
    {
     "say": "Creating a task now goes through the database.",
     "show": 0
    },
    {
     "say": "Build a task from the request data.",
     "show": 1
    },
    {
     "say": "Add it to the session.",
     "show": 2
    },
    {
     "say": "Commit, to save it.",
     "show": 3
    },
    {
     "say": "Refresh, so the new I D is filled in.",
     "show": 4
    },
    {
     "say": "And return it.",
     "show": 5
    }
   ]
  },
  {
   "kind": "big",
   "art": "database",
   "kicker": "Lab · Step 4",
   "title": "Prove it survives",
   "big": "Still there",
   "sub": "after a restart",
   "beats": [
    {
     "say": "Now prove it. Create two tasks, then stop and restart the server.",
     "show": 0
    },
    {
     "say": "List the tasks.",
     "show": 1
    },
    {
     "say": "They're still there, saved in tasks dot d b.",
     "show": 2
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
     "say": "What happens to your changes if you never call db.commit()?",
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
   "art": "file",
   "kicker": "Module 5 · Configuration and logging",
   "title": "Same code, different places",
   "beats": [
    {
     "say": "Welcome to Module 5."
    }
   ]
  },
  {
   "kind": "list",
   "art": "lock",
   "kicker": "Concept",
   "title": "Configuration",
   "items": [
    [
     "Hard-coded",
     "Edit code to deploy; secrets in Git"
    ],
    [
     "Environment variables",
     "Set outside the code, safe defaults"
    ]
   ],
   "crossed": false,
   "beats": [
    {
     "say": "Configuration is anything that changes between where your app runs: the database location, the log level, secret keys.",
     "show": 0
    },
    {
     "say": "Hard-code them, and you have to edit code to deploy, and you risk committing secrets to Git.",
     "show": 1
    },
    {
     "say": "Instead, read environment variables, with safe defaults for your own computer.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "file",
   "kicker": "Lab · Step 1",
   "title": "One place for settings",
   "file": "app/config.py",
   "code": "import os\n\nAPP_NAME = os.getenv(\"APP_NAME\", \"Tasks API\")\nDATABASE_URL = os.getenv(\"DATABASE_URL\", \"sqlite:///./tasks.db\")\nLOG_LEVEL = os.getenv(\"LOG_LEVEL\", \"INFO\").upper()",
   "beats": [
    {
     "say": "Config dot p y is the one place that reads settings.",
     "show": 0
    },
    {
     "say": "Os dot getenv reads a variable, and falls back to a default if it isn't set.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "terminal",
   "kicker": "Lab · Step 3",
   "title": "Log every request",
   "file": "app/main.py",
   "code": "@app.middleware(\"http\")\nasync def log_requests(request, call_next):\n    start = time.perf_counter()\n    response = await call_next(request)\n    ms = (time.perf_counter() - start) * 1000\n    logger.info(\"%s %s -> %s (%.1f ms)\", request.method,\n                request.url.path, response.status_code, ms)\n    return response",
   "beats": [
    {
     "say": "Logging beats print. It adds timestamps and levels you can filter.",
     "show": 0
    },
    {
     "say": "A middleware runs around every request. It times it, and logs the method, path, status and milliseconds.",
     "show": 1
    },
    {
     "say": "Unexpected errors are logged with the full stack trace, in your logs only.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "lock",
   "kicker": "Lab · Steps 4 and 5",
   "title": "Run with different settings",
   "steps": [
    "DATABASE_URL=… LOG_LEVEL=DEBUG uvicorn …",
    "--env-file .env",
    ".gitignore: .env, venv/, *.db"
   ],
   "beats": [
    {
     "say": "Start the server with a different database and log level, and a new dev dot d b appears.",
     "show": 1
    },
    {
     "say": "Put your settings in a dot env file, and start with dash dash env file.",
     "show": 2
    },
    {
     "say": "And list dot env, venv and your database files in dot gitignore, so they never reach Git.",
     "show": 3
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
     "say": "Why should .env be listed in .gitignore?",
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
     "say": "Tests are small functions that call your API and check the answers."
    }
   ]
  },
  {
   "kind": "list",
   "art": "test",
   "kicker": "Concept",
   "title": "The tools",
   "items": [
    [
     "pytest + assert",
     "Runs test_ functions"
    ],
    [
     "TestClient",
     "Calls your app in memory"
    ],
    [
     "Fixture",
     "Prepares and cleans up"
    ],
    [
     "Override get_db",
     "A throwaway database"
    ]
   ],
   "beats": [
    {
     "say": "Pytest runs every function whose name starts with test, and assert checks each result.",
     "show": 1
    },
    {
     "say": "FastAPI's test client sends requests straight to your app in memory. No server needed.",
     "show": 2
    },
    {
     "say": "A fixture prepares what a test needs, then cleans up.",
     "show": 3
    },
    {
     "say": "And tests must never touch your real data. So you swap the database for a throwaway one.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "database",
   "kicker": "Lab · Step 1",
   "title": "A fresh database for every test",
   "file": "tests/conftest.py",
   "code": "@pytest.fixture\ndef client():\n    engine = create_engine(\"sqlite://\", poolclass=StaticPool,\n                           connect_args={\"check_same_thread\": False})\n    Base.metadata.create_all(bind=engine)\n    app.dependency_overrides[get_db] = override_get_db\n    yield TestClient(app)\n    app.dependency_overrides.clear()",
   "beats": [
    {
     "say": "Conftest dot p y creates a fresh in-memory database for every test.",
     "show": 0
    },
    {
     "say": "Dependency overrides swaps get D B for one that uses it. Your real tasks dot d b is never touched.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "test",
   "kicker": "Lab · Step 2",
   "title": "Your first tests",
   "file": "tests/test_tasks.py",
   "code": "def test_create_and_get_task(client):\n    response = client.post(\"/tasks\", json={\"title\": \"Write tests\"})\n    assert response.status_code == 201\n    task = response.json()\n\n    response = client.get(f\"/tasks/{task['id']}\")\n    assert response.json() == task",
   "beats": [
    {
     "say": "A test just names client as a parameter, and pytest hands it over.",
     "show": 0
    },
    {
     "say": "This one creates a task, checks it got two oh one, then reads it back and checks it matches.",
     "show": 1
    }
   ]
  },
  {
   "kind": "big",
   "art": "test",
   "kicker": "Lab · Steps 3 and 4",
   "title": "Run them, then break something",
   "big": "5 passed",
   "sub": "python -m pytest -v",
   "beats": [
    {
     "say": "Run python dash m pytest. You should see five passed.",
     "show": 0
    },
    {
     "say": "Then break the code on purpose. Change two oh one to two hundred.",
     "show": 1
    },
    {
     "say": "The test fails, and shows you exactly which check broke. Change it back.",
     "show": 2
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
     "say": "Why do the tests override get_db?",
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
     "say": "Next, in the last module, the same API in Node.js.",
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
   "art": "blocks",
   "kicker": "Module 7 · Node.js and Express",
   "title": "Same ideas, another framework",
   "beats": [
    {
     "say": "Welcome to the last module."
    },
    {
     "say": "You rebuild part of your API in JavaScript, to see which ideas are universal."
    }
   ]
  },
  {
   "kind": "list",
   "art": "code",
   "kicker": "Concept",
   "title": "Node.js and Express",
   "items": [
    [
     "Node.js",
     "JavaScript on the server"
    ],
    [
     "Express",
     "Handlers per method and path"
    ],
    [
     "No built-in validation",
     "Check input yourself, or use Zod"
    ]
   ],
   "beats": [
    {
     "say": "Node dot j s runs JavaScript outside the browser, so it can run a server.",
     "show": 1
    },
    {
     "say": "Express is the most widely used Node framework. You register a handler for each method and path.",
     "show": 2
    },
    {
     "say": "One big difference: Express has no built-in validation. You check input yourself, or add a library like Zod.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab · Step 2",
   "title": "A route in Express",
   "file": "app.js",
   "code": "app.post(\"/tasks\", (req, res) => {\n  const { title, notes = null } = req.body ?? {};\n  if (typeof title !== \"string\" || title.length < 1 || title.length > 200) {\n    return res.status(422).json({ detail: \"title must be 1 to 200 characters\" });\n  }\n  const task = { id: nextId++, title, notes, done: false };\n  res.status(201).json(task);\n});",
   "beats": [
    {
     "say": "Here's create task in Express.",
     "show": 0
    },
    {
     "say": "With no Pydantic, you check the title by hand, and answer four twenty two if it's wrong.",
     "show": 1
    },
    {
     "say": "Otherwise, store it, and answer two oh one with the task as JSON.",
     "show": 1
    }
   ]
  },
  {
   "kind": "big",
   "art": "api",
   "kicker": "Lab · Step 3",
   "title": "Same requests, same answers",
   "big": "Same 201 · 404 · 422",
   "sub": "as your FastAPI app",
   "beats": [
    {
     "say": "Run it with node, dash dash watch, and send the same curl requests.",
     "show": 0
    },
    {
     "say": "You get the same status codes and the same JSON as your FastAPI app.",
     "show": 1
    },
    {
     "say": "But type conversion, validation and docs are now your job.",
     "show": 2
    }
   ]
  },
  {
   "kind": "list",
   "art": "fork",
   "kicker": "Choosing a framework",
   "title": "Which one, when",
   "items": [
    [
     "FastAPI",
     "JSON APIs, validation and docs built in"
    ],
    [
     "Flask",
     "Tiny, flexible core"
    ],
    [
     "Django",
     "Big sites: ORM, accounts, admin"
    ],
    [
     "Express",
     "One language, front and back"
    ]
   ],
   "beats": [
    {
     "say": "So which framework should you choose?",
     "show": 0
    },
    {
     "say": "FastAPI, for JSON APIs with validation and docs from type hints, especially next to data or AI code.",
     "show": 1
    },
    {
     "say": "Flask, for a tiny, flexible core.",
     "show": 2
    },
    {
     "say": "Django, for a larger database-heavy site with built-in accounts and an admin panel.",
     "show": 3
    },
    {
     "say": "And Express, when your team wants one language for frontend and backend.",
     "show": 4
    },
    {
     "say": "Everything you practised here carries over to all of them.",
     "show": 4
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
     "say": "You've finished Backend Development for Builders. Next, APIs for Builders picks up the app you just built.",
     "show": 2
    }
   ]
  }
 ]
}
```
