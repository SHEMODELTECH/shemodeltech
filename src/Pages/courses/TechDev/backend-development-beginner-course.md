# Backend Development for Builders: A Practical Beginner's Course

## Course Overview

**Who this is for:** Beginners who can build a frontend page and now want to understand what happens on the server, storing data, handling requests, and serving an API that a frontend (or anyone else) can call.

**How the course works:** Six modules. Every topic follows the same pattern:
- **Concept** - what it is, in plain language
- **Syntax at a Glance** - the core patterns you'll actually type
- **Where you'd actually use this** - a real product scenario
- **Lab** - hands-on, runnable examples
- **Checkpoint**
- **Quiz** - five questions with answers

**Tools needed:** [Node.js](https://nodejs.org) installed, [Python 3](https://www.python.org/downloads) installed, a terminal, and a text editor (such as [VS Code](https://code.visualstudio.com)). A tool like [curl](https://curl.se) or [Postman](https://www.postman.com) to send test requests.

---

## Module 0: What a Backend Actually Does

### Concept

A **backend** is the part of an application that runs on a server rather than in the user's browser. It receives **requests** (a browser asking for a page, an app asking for data), does something with them, reading or writing a database, checking permissions, running logic, and sends back a **response**. An **API (Application Programming Interface)** is the set of URLs and rules a backend exposes so other programs can talk to it.

The core request cycle looks the same no matter which language or framework:
```
Client sends a request  ->  Server receives it  ->  Server does work
(a browser, an app)          (routes it to code)     (reads/writes data)
                                                              |
Client receives a response  <-  Server sends a response  <---
```

### Where you'd actually use this

Anything that needs to store data beyond a single browser session, user accounts, saved orders, posts other people can see, needs a backend. The frontend displays things; the backend is what makes them real and shared.

### Lab

Open your browser's developer tools (right click, "Inspect"), go to the "Network" tab, then visit any website and reload the page. Watch the list of requests appear. Click on one and look at its **method** (GET, POST, and so on), its **URL**, and its **response**. You're watching a real backend, live, doing exactly what this module described.

### Checkpoint
You can explain, in plain language, what a request and a response are, and why a browser alone cannot permanently store shared data.

### Quiz
1. What is a backend, in one sentence?
2. What is an API?
3. What is the difference between a request and a response?
4. Why can't a browser alone store data that other users can see?
5. Does every frontend interaction require a backend request?

*Answers: 1) The part of an application that runs on a server, handling data and logic that a browser alone can't. 2) The set of URLs and rules a backend exposes, letting other programs send it requests and get back structured responses. 3) A request is what the client sends to ask for something or submit data; a response is what the server sends back as a result. 4) Data stored only in a browser lives on that one device, other users have no way to reach or see it without a shared server storing it centrally. 5) No, some interactions (like a purely visual animation) are handled entirely on the frontend, with no server involved.*

---

## Module 1: Node.js - JavaScript on the Server

### Concept

**Node.js** is a runtime that lets JavaScript run outside the browser, on a server. This means the same language used for frontend interactivity can also read files, talk to databases, and handle network requests directly, without needing a browser at all.

### Syntax at a Glance

```javascript
// server.js
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from Node.js");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```
- `require("module")` imports a built-in or installed module (Node's version of `import`, in its classic syntax)
- `http.createServer(callback)` creates a server; the callback runs once for every incoming request, receiving `req` (the request) and `res` (the response)
- `res.writeHead(statusCode, headers)` sets the response status and headers before sending the body
- `server.listen(port, callback)` starts the server listening for requests on that port

### Where you'd actually use this

Any time you want to handle HTTP requests directly with JavaScript, real time features (chat, live updates), custom protocols, or simply keeping frontend and backend in the same language across a whole project.

### Lab

1. **Create a project and the server file above:**
```bash
mkdir my-backend
cd my-backend
```
Save the code from **Syntax at a Glance** as `server.js`.

2. **Run it:**
```bash
node server.js
```
Visit `http://localhost:3000` in your browser, or run:
```bash
curl http://localhost:3000
```
You should see `Hello from Node.js`.

3. **Respond differently based on the URL:**
```javascript
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Welcome to the homepage");
  } else if (req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("This is the about page");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});
```
Restart the server (`Ctrl+C`, then `node server.js` again), then visit `/`, `/about`, and `/random-page`, notice each gets a different, correct response.

### Checkpoint
You have a running Node.js server that returns different responses, including a 404, based on the request's URL.

### Quiz
1. What does Node.js let JavaScript do that it can't do in a browser alone?
2. What does `http.createServer` need to be given in order to work?
3. What do `req` and `res` represent?
4. What does a status code like `404` communicate?
5. Why does the server need to be restarted after editing `server.js`?

*Answers: 1) Run outside the browser, on a server, so it can handle network requests, read files, and connect to databases directly. 2) A callback function that runs for every incoming request and decides how to respond. 3) `req` is the incoming request (what the client sent); `res` is the response object used to send data back. 4) That the requested resource wasn't found, a standard way of communicating outcome without relying on the response body's wording alone. 5) Node runs the file as written when it starts, changes to the code aren't picked up automatically, the process has to be restarted to load them.*

---

## Module 2: Express - A Framework for Node.js

### Concept

Handling routing manually with `if` statements, as in Module 1, gets unwieldy fast. **Express** is a framework built on top of Node.js that provides a clean way to define routes, handle different HTTP methods, and process request data, without writing that plumbing by hand.

### Syntax at a Glance

```javascript
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the homepage");
});

app.get("/users/:id", (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});

app.post("/users", (req, res) => {
  res.status(201).json({ received: req.body });
});

app.listen(3000, () => console.log("Listening on port 3000"));
```
- `app.get(path, handler)`, `app.post(path, handler)`, and similarly `.put`, `.delete`, define what runs for a given method and path
- `:id` in a path is a **route parameter**, captured in `req.params.id`
- `express.json()` middleware parses incoming JSON request bodies into `req.body`
- `res.send(...)` sends a plain response; `res.json(...)` sends JSON; `res.status(code)` sets the status before sending

### Where you'd actually use this

Any real Node.js API. Express (or a framework like it) is the standard way most Node.js backends are actually built, handling routing, request parsing, and middleware in a consistent, well documented way.

### Lab

1. **Install Express:**
```bash
npm init -y
npm install express
```

2. **Create `app.js`** with a small in-memory task list:
```javascript
const express = require("express");
const app = express();
app.use(express.json());

let tasks = [
  { id: 1, title: "Learn Express" },
  { id: 2, title: "Build an API" }
];

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

app.post("/tasks", (req, res) => {
  const newTask = { id: tasks.length + 1, title: req.body.title };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.listen(3000, () => console.log("Listening on port 3000"));
```

3. **Run it and test each route:**
```bash
node app.js
```
```bash
curl http://localhost:3000/tasks
curl http://localhost:3000/tasks/1
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Ship it"}'
curl http://localhost:3000/tasks
```
Notice the final `GET /tasks` now includes the task you just created with `POST`.

### Checkpoint
You have a running Express API with GET and POST routes, tested with real requests through curl.

### Quiz
1. What problem does Express solve compared to Module 1's plain Node.js server?
2. What does `:id` in a route path represent?
3. What does `express.json()` middleware do?
4. What HTTP method is conventionally used to create a new resource?
5. Why does `/tasks/:id` check `if (!task)` before responding?

*Answers: 1) It replaces manual `if` statement routing with a clean, consistent way to define routes, HTTP methods, and request handling. 2) A route parameter, a dynamic segment of the URL captured and made available through `req.params`. 3) It parses an incoming JSON request body so it can be read as a regular JavaScript object through `req.body`. 4) `POST`. 5) So it can return a proper `404` response with a clear error when the requested id doesn't exist, instead of crashing or returning nothing.*

---

## Module 3: Python Flask - A Minimal Python Framework

### Concept

**Flask** is a lightweight Python web framework. Like Express, it handles routing and requests, but with a deliberately minimal core, you add only the pieces you need, making it a common starting point for learning backend concepts in Python.

### Syntax at a Glance

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "Welcome to the homepage"

@app.route("/users/<int:user_id>")
def get_user(user_id):
    return f"User ID: {user_id}"

@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    return jsonify({"received": data}), 201

if __name__ == "__main__":
    app.run(debug=True, port=3000)
```
- `@app.route(path)` is a **decorator** that connects a URL path to the function defined directly below it
- `<int:user_id>` in a path captures a URL segment as a typed parameter, passed as an argument to the function
- `methods=["POST"]` restricts a route to a specific HTTP method (routes default to `GET`)
- `request.get_json()` reads the incoming JSON body; `jsonify(...)` builds a JSON response, and `, 201` sets the status code

### Where you'd actually use this

Small to medium APIs, prototypes, and projects where Python's ecosystem, data science libraries, machine learning tools, scripting, is already in use, and the backend needs to fit naturally alongside that.

### Lab

1. **Set up a project and install Flask:**
```bash
mkdir my-flask-app
cd my-flask-app
python3 -m venv venv
source venv/bin/activate
pip install flask
```

2. **Create `app.py`** with the same task list idea as Module 2:
```python
from flask import Flask, request, jsonify

app = Flask(__name__)

tasks = [
    {"id": 1, "title": "Learn Flask"},
    {"id": 2, "title": "Build an API"}
]

@app.route("/tasks")
def get_tasks():
    return jsonify(tasks)

@app.route("/tasks/<int:task_id>")
def get_task(task_id):
    task = next((t for t in tasks if t["id"] == task_id), None)
    if task is None:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task)

@app.route("/tasks", methods=["POST"])
def create_task():
    data = request.get_json()
    new_task = {"id": len(tasks) + 1, "title": data["title"]}
    tasks.append(new_task)
    return jsonify(new_task), 201

if __name__ == "__main__":
    app.run(debug=True, port=3000)
```

3. **Run it and test each route:**
```bash
python app.py
```
```bash
curl http://localhost:3000/tasks
curl http://localhost:3000/tasks/1
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Ship it"}'
curl http://localhost:3000/tasks
```
Same behavior as the Express version in Module 2, different language, same underlying pattern.

### Checkpoint
You have a running Flask API with GET and POST routes, producing the same results as the Express version, tested with real requests.

### Quiz
1. What does the `@app.route(...)` decorator do?
2. How does Flask capture a dynamic part of a URL, like an id?
3. What does `methods=["POST"]` restrict?
4. What does `debug=True` do when running the app?
5. Comparing Module 2 and Module 3, what stayed the same, and what changed?

*Answers: 1) It connects a specific URL path to the Python function defined directly beneath it, so that function runs when the path is requested. 2) With a typed placeholder in the route path, like `<int:task_id>`, passed automatically as an argument to the handling function. 3) It limits that route to handle only `POST` requests, rather than the default `GET`. 4) It enables automatic reloading on code changes and more detailed error pages, useful during development, not intended for production. 5) The underlying concepts, routes, methods, request bodies, status codes, stayed the same; only the language and specific syntax changed.*

---

## Module 4: Django - A Full Batteries-Included Framework

### Concept

**Django** is a full featured Python web framework that includes far more out of the box than Flask: a built-in database layer called an **ORM (Object-Relational Mapper)**, an admin interface generated automatically from your data, user authentication, and a defined project structure. It trades some of Flask's minimalism for a large set of built-in, well tested tools.

### Syntax at a Glance

```python
# models.py, defines a database table as a Python class
from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200)
    done = models.BooleanField(default=False)
```
```python
# views.py, handles a request and returns a response
from django.http import JsonResponse
from .models import Task

def task_list(request):
    tasks = Task.objects.all()
    data = [{"id": t.id, "title": t.title} for t in tasks]
    return JsonResponse(data, safe=False)
```
```python
# urls.py, maps a URL path to a view function
from django.urls import path
from . import views

urlpatterns = [
    path("tasks/", views.task_list),
]
```
- A **model** is a Python class representing a database table; each field (`CharField`, `BooleanField`, and so on) becomes a column
- `Task.objects.all()` is the ORM in action, it runs a database query without writing raw SQL
- Django separates routing (`urls.py`), logic (`views.py`), and data (`models.py`) into distinct files, rather than combining them in one place

### Where you'd actually use this

Larger applications that need a real database from day one, user accounts, and an admin panel to manage data, without assembling those pieces yourself from separate libraries.

### Lab

1. **Set up a project:**
```bash
python3 -m venv venv
source venv/bin/activate
pip install django
django-admin startproject mysite
cd mysite
python manage.py startapp tasks
```

2. **Define a model.** In `tasks/models.py`:
```python
from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200)

    def __str__(self):
        return self.title
```
Add `"tasks"` to `INSTALLED_APPS` in `mysite/settings.py`, then create and apply the database migration:
```bash
python manage.py makemigrations tasks
python manage.py migrate
```

3. **Register the model with the admin site.** In `tasks/admin.py`:
```python
from django.contrib import admin
from .models import Task

admin.site.register(Task)
```
Create an admin user, then run the server:
```bash
python manage.py createsuperuser
python manage.py runserver 3000
```
Visit `http://localhost:3000/admin`, log in, and add a few tasks directly through the automatically generated admin interface, no custom code required for this part.

4. **Expose the tasks as an API.** In `tasks/views.py`:
```python
from django.http import JsonResponse
from .models import Task

def task_list(request):
    tasks = Task.objects.all()
    data = [{"id": t.id, "title": t.title} for t in tasks]
    return JsonResponse(data, safe=False)
```
In `mysite/urls.py`:
```python
from django.urls import path
from tasks.views import task_list

urlpatterns = [
    path("tasks/", task_list),
]
```
Visit `http://localhost:3000/tasks/`, the tasks you added through the admin panel appear as JSON.

### Checkpoint
You created a Django model, added data through the automatically generated admin interface, and exposed that same data through a working API route.

### Quiz
1. What is a "model" in Django?
2. What does the ORM let you avoid writing directly?
3. What did the admin interface let you do without writing custom code?
4. What is the purpose of `python manage.py migrate`?
5. What is the main tradeoff Django makes compared to Flask?

*Answers: 1) A Python class representing a database table, where each field defined on the class becomes a column. 2) Raw SQL queries, the ORM translates Python code like `Task.objects.all()` into the appropriate database query. 3) Add, edit, and view data directly through a generated web interface, based entirely on the defined model. 4) It applies pending database changes (like a newly defined model) to the actual database, creating or updating tables to match. 5) Django includes far more built-in structure and tooling out of the box, trading some of Flask's minimalism and flexibility for a larger, more opinionated, ready to use set of features.*

---

## Module 5: FastAPI - Modern Python with Types

### Concept

**FastAPI** is a Python framework focused on speed of both execution and development. It uses Python **type hints** to validate incoming data automatically, and generates interactive API documentation for free, directly from your code, with no separate documentation to maintain.

### Syntax at a Glance

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Task(BaseModel):
    title: str
    done: bool = False

@app.get("/tasks")
def get_tasks():
    return [{"id": 1, "title": "Learn FastAPI"}]

@app.post("/tasks")
def create_task(task: Task):
    return {"id": 2, "title": task.title, "done": task.done}
```
- A class inheriting from `BaseModel` (from the `pydantic` library) defines the expected shape of incoming data, its fields and their types
- Declaring a parameter's type, like `task: Task`, tells FastAPI to read, validate, and parse the request body automatically into that shape
- `@app.get(...)` and `@app.post(...)` work the same way as Flask's route decorators
- If incoming data doesn't match the declared types, FastAPI automatically responds with a clear validation error, no manual checking required

### Where you'd actually use this

APIs where request validation, clear error messages, and up to date documentation matter, particularly when other developers or teams will consume the API and need to understand its shape quickly.

### Lab

1. **Set up a project:**
```bash
mkdir my-fastapi-app
cd my-fastapi-app
python3 -m venv venv
source venv/bin/activate
pip install fastapi "uvicorn[standard]"
```

2. **Create `main.py`** with the same task list idea as the previous modules:
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class Task(BaseModel):
    title: str

tasks = [
    {"id": 1, "title": "Learn FastAPI"},
    {"id": 2, "title": "Build an API"}
]

@app.get("/tasks")
def get_tasks():
    return tasks

@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    for task in tasks:
        if task["id"] == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.post("/tasks", status_code=201)
def create_task(task: Task):
    new_task = {"id": len(tasks) + 1, "title": task.title}
    tasks.append(new_task)
    return new_task
```

3. **Run it:**
```bash
uvicorn main:app --reload --port 3000
```

4. **Test it, and explore the free documentation.** Visit `http://localhost:3000/docs`, FastAPI generated a full interactive API explorer directly from your code, where you can try each route in the browser. Also test from the terminal:
```bash
curl http://localhost:3000/tasks
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Ship it"}'
```

5. **Trigger a validation error on purpose:**
```bash
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title": 123}'
```
FastAPI rejects it automatically, `123` is a number, not the `str` the `Task` model requires, and responds with a clear error explaining exactly what was wrong, without any manual validation code written for this case.

### Checkpoint
You have a running FastAPI app, viewed its automatically generated documentation at `/docs`, and triggered a real, automatic validation error.

### Quiz
1. What does inheriting from `BaseModel` let you define?
2. What happens automatically if incoming request data doesn't match a declared type?
3. What does FastAPI generate for you automatically, with no extra work, at `/docs`?
4. What does `task_id: int` in a route function's parameters accomplish?
5. What is FastAPI's main selling point, compared to Flask's more manual approach?

*Answers: 1) The expected shape of incoming data, its field names and their types. 2) FastAPI automatically responds with a clear validation error describing what was wrong, without any manual checking code. 3) Interactive, browsable API documentation, generated directly from the code's routes and type declarations. 4) It tells FastAPI to parse that URL segment as an integer automatically, and to validate that it actually is one. 5) Automatic request validation and free, always up to date documentation, both driven directly by Python type hints, reducing manual, repetitive validation and documentation work.*

---

## Capstone: The Same API, Five Ways

Build the same small task API (list tasks, get one task, create a task) in each backend covered in this course:

1. In Node.js (Module 1), using the built-in `http` module and manual routing
2. In Express (Module 2), using clean route definitions and middleware
3. In Flask (Module 3), using decorators and a minimal setup
4. In Django (Module 4), using a real model, the ORM, and the automatic admin interface
5. In FastAPI (Module 5), using typed models and automatic validation
6. Test all five with the same `curl` commands, and compare the responses. Notice the underlying request and response cycle from Module 0 is identical in every one, only the language, syntax, and amount of built-in structure differ.

### Course completion checklist
- [ ] Explained the request and response cycle, and what an API is
- [ ] Built a raw Node.js server that routes based on URL
- [ ] Built an Express API with GET and POST routes
- [ ] Built a Flask API producing the same behavior as the Express version
- [ ] Built a Django model, used the automatic admin interface, and exposed the data through an API route
- [ ] Built a FastAPI app with automatic request validation and explored its generated documentation
- [ ] Tested all five backends with the same requests and compared the results

Every piece of this course exists to answer one question, repeatedly and reliably: **given the same data and the same request, can I build a backend that handles it correctly, no matter which language or framework a project happens to use?**
