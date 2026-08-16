# APIs for Builders: A Practical Beginner's Course

## Course Overview

**Who this is for:** Beginners who can write basic code and want to understand how applications actually talk to each other, and how to protect that communication properly.

**How the course works:** Six modules. Every topic follows the same pattern:
- **Concept** - what it is, in plain language
- **Where you'd actually use this** - a real product scenario
- **Lab** - hands-on, runnable examples
- **Checkpoint**
- **Quiz** - five questions with answers

**Tools needed:** Python 3.10+, a terminal, and a tool for testing API requests like `curl` or [Postman](https://www.postman.com).

---

## Module 0: Why APIs Exist

### Concept

An **API** (Application Programming Interface) is a defined way for two pieces of software to talk to each other. Your phone's weather app doesn't calculate the weather itself, it asks a weather company's API for data and displays the answer. Almost every app you use is a frontend (what you see) talking to a backend (where data lives) through an API.

The two we'll focus on are **REST**, the most common style, and **GraphQL**, a more flexible alternative. Both need **authentication** to know who's asking, which is where OAuth and JWT come in.

### Where you'd actually use this

Any time your app needs to fetch, create, update, or delete data that lives somewhere other than the user's own device, you're using an API. Your mobile app talking to your own backend, your backend talking to a payment provider, one company's software talking to another's, it's all APIs.

### Lab

Open your browser's developer tools (right-click, "Inspect", then the "Network" tab), visit any website, and watch the requests fly by as the page loads. Find one that returns data (often labeled `XHR` or `Fetch`) and look at what it sent and received. You're looking at a live API in action.

### Checkpoint
You found at least one real API request in your browser's network tab and can describe what data it sent or received.

### Quiz
1. What is an API, in one sentence?
2. Why doesn't a weather app calculate weather itself?
3. What are the two API styles this course covers?
4. What do you need in addition to an API style, to know *who* is making a request?
5. Is an API always between two different companies' software?

*Answers: 1) A defined way for two pieces of software to communicate. 2) It asks a specialized weather service's API for that data instead of building its own forecasting system. 3) REST and GraphQL. 4) Authentication. 5) No - it's just as often your own frontend talking to your own backend.*

---

## Module 1: REST - The Standard Approach

### Concept

**REST** (Representational State Transfer) organizes an API around **resources** (things like `users` or `tasks`), each with its own URL, and uses standard HTTP methods to act on them:

| Method | Purpose | Example |
|---|---|---|
| GET | Read data | `GET /tasks` |
| POST | Create data | `POST /tasks` |
| PUT/PATCH | Update data | `PATCH /tasks/5` |
| DELETE | Remove data | `DELETE /tasks/5` |

Responses use **status codes** to signal what happened: `200` (success), `201` (created), `400` (bad request), `401` (not authenticated), `404` (not found), `500` (server error).

### Where you'd actually use this

REST is the default choice for most APIs, both public (Stripe, GitHub, Twitter/X all expose REST APIs) and internal (your own frontend talking to your own backend). If you're building a straightforward CRUD-style app, REST is almost always the right starting point.

### Lab

**1. Build a small REST API:**
```python
# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

tasks = {1: {"id": 1, "title": "Write course notes", "done": False}}
next_id = 2

class TaskIn(BaseModel):
    title: str

@app.get("/tasks")
def list_tasks():
    return list(tasks.values())

@app.post("/tasks", status_code=201)
def create_task(task: TaskIn):
    global next_id
    new_task = {"id": next_id, "title": task.title, "done": False}
    tasks[next_id] = new_task
    next_id += 1
    return new_task

@app.patch("/tasks/{task_id}")
def complete_task(task_id: int):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    tasks[task_id]["done"] = True
    return tasks[task_id]

@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    del tasks[task_id]
```

**2. Run it and test each endpoint:**
```bash
uvicorn main:app --reload
```
```bash
curl http://localhost:8000/tasks
curl -X POST http://localhost:8000/tasks -H "Content-Type: application/json" -d '{"title": "Review PR"}'
curl -X PATCH http://localhost:8000/tasks/1
curl -X DELETE http://localhost:8000/tasks/2
```

### Checkpoint
You ran all four REST operations against your own running API and can explain what status code each one returned.

### Quiz
1. What does REST organize an API around?
2. What HTTP method would you use to update part of an existing task?
3. What does a `404` status code mean?
4. What does a `401` status code mean, and how is it different from `403`?
5. Why does `create_task` return status `201` instead of the default `200`?

*Answers: 1) Resources, each identified by its own URL. 2) `PATCH` (or `PUT` for a full replacement). 3) The requested resource doesn't exist. 4) `401` means not authenticated (you don't know who this is); `403` means authenticated but not authorized (we know who you are, but you can't do this). 5) `201` specifically communicates "a new resource was successfully created," which is more precise than a generic success code.*

---

## Module 2: GraphQL - Asking for Exactly What You Need

### Concept

**GraphQL** exposes a single endpoint, and instead of the server deciding what data each URL returns, the client sends a **query** describing exactly the fields it wants. This avoids two common REST problems: **over-fetching** (getting more data than you need) and **under-fetching** (needing to call multiple endpoints to assemble one screen's worth of data).

### Where you'd actually use this

Apps with complex, nested data needs and multiple different frontends (web, mobile) that each want different slices of the same data. GitHub and Shopify both expose GraphQL APIs precisely because different clients need very different combinations of fields from the same underlying data.

### Lab

**1. Compare the same request in both styles.**

REST, to get a task with its owner's name, might require two calls:
```
GET /tasks/5          -> { "id": 5, "title": "...", "owner_id": 3 }
GET /users/3          -> { "id": 3, "name": "Alice" }
```

GraphQL gets exactly this in one request:
```graphql
query {
  task(id: 5) {
    title
    owner {
      name
    }
  }
}
```

**2. A minimal GraphQL server in Python (using `strawberry`):**
```bash
pip install strawberry-graphql[fastapi]
```
```python
# graphql_app.py
import strawberry
from strawberry.fastapi import GraphQLRouter
from fastapi import FastAPI

@strawberry.type
class Owner:
    name: str

@strawberry.type
class Task:
    id: int
    title: str
    owner: Owner

@strawberry.type
class Query:
    @strawberry.field
    def task(self, id: int) -> Task:
        return Task(id=id, title="Write course notes", owner=Owner(name="Alice"))

schema = strawberry.Schema(query=Query)
graphql_app = GraphQLRouter(schema)

app = FastAPI()
app.include_router(graphql_app, prefix="/graphql")
```
```bash
uvicorn graphql_app:app --reload
```
Visit `http://localhost:8000/graphql` to open GraphQL's built-in explorer and run the query from step 1.

### Checkpoint
You ran a GraphQL query that fetched nested data (a task and its owner's name) in a single request, and can explain how many REST calls the same data would have taken.

### Quiz
1. What problem does over-fetching describe?
2. What problem does under-fetching describe?
3. How many endpoints does a typical GraphQL API expose?
4. Who decides exactly which fields come back in a GraphQL response, the client or the server?
5. Would GraphQL help a simple app with only one screen and one data shape? Why or why not?

*Answers: 1) Getting more data in a response than the client actually needs. 2) Needing multiple requests to assemble the data one screen actually needs. 3) Typically just one. 4) The client, through the query it sends. 5) Not much - GraphQL's main benefit shows up when different clients need different data shapes; a single simple screen doesn't have that problem to solve.*

---

## Module 3: Authentication Fundamentals

### Concept

**Authentication** answers "who is this?" **Authorization** answers "what are they allowed to do?" These are different problems and get confused constantly. There are two common ways to keep someone "logged in" across requests:

- **Session-based**: the server stores session data and gives the client a session ID (usually in a cookie) to reference it on each request.
- **Token-based**: the server gives the client a self-contained token (often a JWT, covered in Module 5) that proves identity without the server needing to store anything.

### Where you'd actually use this

Every product with user accounts needs this. The choice between sessions and tokens shapes how your API scales, how mobile apps integrate, and how third-party services can authenticate with you.

### Lab

**1. A minimal session-style login (conceptual, using an in-memory store):**
```python
import uuid

sessions = {}  # session_id -> user_id

def login(user_id: int) -> str:
    session_id = str(uuid.uuid4())
    sessions[session_id] = user_id
    return session_id   # this gets sent to the client as a cookie

def get_current_user(session_id: str):
    return sessions.get(session_id)
```

**2. Notice the trade-off:** every request now requires a lookup in `sessions`, and if you run multiple servers, they all need access to the same session store. This is exactly the problem token-based auth (Module 5) avoids.

### Checkpoint
You can explain, without notes, the difference between authentication and authorization, and between session-based and token-based login.

### Quiz
1. What question does authentication answer? What question does authorization answer?
2. What does a session-based login store, and where?
3. What's a downside of session-based auth when you have multiple servers?
4. Could a user be authenticated but not authorized to do something?
5. Why is confusing authentication with authorization a common source of security bugs?

*Answers: 1) Authentication: who are you. Authorization: what are you allowed to do. 2) The server stores session data (like which user it belongs to), referenced by a session ID often stored in the client's cookie. 3) Every server needs access to the same shared session store, adding complexity. 4) Yes - e.g., a logged-in regular user trying to access an admin-only page. 5) Because checking "is this user logged in?" is not the same as checking "is this specific user allowed to do this specific thing?", and skipping the second check is a common vulnerability.*

---

## Module 4: OAuth - Letting Users Log In With Another Service

### Concept

**OAuth** is a standard that lets a user grant one application limited access to their data on another service, without ever sharing their password with the first application. This is what powers "Sign in with Google" or "Sign in with GitHub." The core flow:

1. Your app redirects the user to Google's login page
2. The user logs in and approves your app's requested access
3. Google redirects back to your app with an authorization code
4. Your app exchanges that code for an access token
5. Your app uses that token to fetch the user's basic profile info from Google

### Where you'd actually use this

Any "Sign in with Google/GitHub/Apple" button. It's also how your app can act on a user's behalf with a third-party service, like posting to their social media or reading their calendar, with their explicit, revocable permission.

### Lab

**1. Trace the flow yourself:** go to a website with a "Sign in with Google" button, click it, and watch the URL bar carefully. You'll see it redirect to `accounts.google.com` with parameters, then redirect back to the original site with a `code` parameter in the URL. That's step 3 of the flow above, happening in front of you.

**2. A simplified version of step 4 (exchanging the code for a token):**
```python
import requests

def exchange_code_for_token(code: str):
    response = requests.post("https://oauth2.googleapis.com/token", data={
        "code": code,
        "client_id": "YOUR_CLIENT_ID",
        "client_secret": "YOUR_CLIENT_SECRET",
        "redirect_uri": "https://yourapp.com/callback",
        "grant_type": "authorization_code",
    })
    return response.json()["access_token"]
```

**3. Using the resulting access token to get the user's profile:**
```python
def get_google_profile(access_token: str):
    response = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    return response.json()  # { "email": "...", "name": "...", ... }
```

### Checkpoint
You watched a real "Sign in with Google" flow in your browser's URL bar and identified the redirect and the authorization code.

### Quiz
1. What problem does OAuth solve that "just ask the user for their Google password" would create?
2. What does your app receive from Google before it gets an access token?
3. What is the access token used for, once your app has it?
4. Can a user revoke an app's OAuth access later, without changing their password?
5. Is OAuth primarily about authentication or about authorization to access data?

*Answers: 1) It would mean your app has to be trusted with the user's actual password, a major security risk if your app is ever compromised. 2) An authorization code, which then gets exchanged for the access token. 3) To make authenticated requests to the provider's API on the user's behalf, like fetching their profile. 4) Yes - most providers let users review and revoke connected apps from their account settings. 5) Fundamentally authorization (granting limited access to data), though it's very commonly used as a form of authentication too ("Sign in with Google").*

---

## Module 5: JWT - A Token You Can Verify Without a Database Lookup

### Concept

A **JWT** (JSON Web Token) is a compact, signed piece of text that encodes claims about a user (like their ID) in a way the server can verify without storing anything. It has three parts separated by dots: header, payload, and signature. Because it's signed, the server can trust the payload wasn't tampered with, as long as it checks the signature.

### Where you'd actually use this

APIs that need to scale across multiple servers without a shared session store, mobile apps (which don't handle cookies as naturally as browsers do), and any system where you want authentication to work without a database round-trip on every single request.

### Lab

**1. Create and verify a JWT:**
```python
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "replace-with-env-variable-in-production"
ALGORITHM = "HS256"

def create_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.utcnow() + timedelta(minutes=30),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> int:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return int(payload["sub"])

token = create_token(user_id=42)
print(token)                  # a long string like xxxxx.yyyyy.zzzzz
print(verify_token(token))    # 42, if the token is valid and unexpired
```

**2. Paste your generated token into [jwt.io](https://jwt.io) to see the decoded header and payload. Notice that the payload is readable, not encrypted, anyone can see it. The signature is what prevents tampering, not secrecy.**

**3. Using it to protect an endpoint:**
```python
from fastapi import FastAPI, HTTPException, Header

app = FastAPI()

@app.get("/me")
def get_my_profile(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    try:
        user_id = verify_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return {"user_id": user_id}
```

### Checkpoint
You generated a real JWT, decoded it on jwt.io to see its contents, and used it to protect an endpoint.

### Quiz
1. What are the three parts of a JWT?
2. Is the payload of a JWT encrypted or just encoded?
3. What does the signature protect against?
4. Why does a JWT avoid the "shared session store across servers" problem from Module 3?
5. What happens if you try to `verify_token` a token after its `exp` time has passed?

*Answers: 1) Header, payload, and signature. 2) Just encoded (readable by anyone), not encrypted - never put secrets in the payload. 3) Tampering - if anyone changes the payload without the secret key, the signature won't match and verification will fail. 4) Any server holding the same secret key can verify the token independently, with no need to check a shared store. 5) It raises an error, since the token is expired and should be rejected.*

---

## Capstone: A Fully Authenticated REST API

Combine everything from this course into one working feature:

1. Take your REST API from Module 1
2. Add a `/login` endpoint that returns a JWT (Module 5)
3. Protect your existing `/tasks` endpoints so they require a valid token
4. Update `create_task` and `list_tasks` so tasks are scoped to the logged-in user (authorization, not just authentication, from Module 3)

```python
from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel

app = FastAPI()
tasks_by_user = {}  # user_id -> list of tasks

def get_current_user_id(authorization: str = Header(...)) -> int:
    token = authorization.replace("Bearer ", "")
    try:
        return verify_token(token)   # from Module 5
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

class TaskIn(BaseModel):
    title: str

@app.post("/login")
def login(user_id: int):
    return {"access_token": create_token(user_id)}

@app.get("/tasks")
def list_tasks(user_id: int = Depends(get_current_user_id)):
    return tasks_by_user.get(user_id, [])

@app.post("/tasks", status_code=201)
def create_task(task: TaskIn, user_id: int = Depends(get_current_user_id)):
    tasks_by_user.setdefault(user_id, []).append({"title": task.title, "done": False})
    return tasks_by_user[user_id][-1]
```

### Course completion checklist
- [ ] Built and tested a REST API with GET, POST, PATCH, and DELETE
- [ ] Explained the difference between over-fetching and under-fetching
- [ ] Ran a nested GraphQL query in a live explorer
- [ ] Explained the difference between authentication and authorization
- [ ] Traced a real OAuth "Sign in with Google" redirect flow
- [ ] Generated, decoded, and verified a real JWT
- [ ] Built a REST API where every endpoint requires a valid token and returns only that user's data

Every concept in this course answers the same two questions every API eventually has to answer: **how does data get requested and returned, and how do we know who's asking?**
