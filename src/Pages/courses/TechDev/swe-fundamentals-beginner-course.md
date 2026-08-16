# Build Your First Product: A Beginner's Course in Software Engineering Fundamentals

## Course Overview

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
You should see something like `Python 3.12.x`. If you see an error, revisit the install step above.

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

### Checkpoint
A `SPEC.md` file exists in your project folder and you can explain the product in three sentences without notes.

### Quiz
1. Why write a spec before writing code?
2. What's the difference between a "non-goal" and something you forgot to think about?
3. Why does a spec need exactly one success metric instead of five?
4. Who is TrackIt's spec saying the product is NOT for?
5. What happens to a team that skips this step?

*Answers: 1) It forces clarity on what you're actually solving and prevents wasted work. 2) A non-goal is a deliberate, stated exclusion; forgetting something is an oversight. 3) One metric forces focus; five metrics let you claim success no matter what happens. 4) Teams, not individuals. 5) They tend to build unfocused features and struggle to know if the product is working.*

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

**3. Try it:**
```python
from datetime import date, timedelta

q = TaskQueue()
q.add(Task(id=1, title="Later task", due_date=date.today() + timedelta(days=5), priority=1))
q.add(Task(id=2, title="Urgent task", due_date=date.today(), priority=3))

print(q.next_up().title)  # "Urgent task"
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

### Checkpoint
You can explain what a table, row, column, and foreign key are, and you have `models.py` defining two linked tables.

### Quiz
1. What's the difference between a table and a database?
2. What does `ForeignKey("users.id")` do?
3. Why is `email` marked `unique=True`?
4. What does `index=True` do, in plain terms?
5. Translate this SQL into a sentence: `SELECT * FROM tasks WHERE done = true;`

*Answers: 1) A database can contain many tables; a table is one organized set of rows/columns within it. 2) Links a Task to the User who owns it. 3) So two users can't register with the same email. 4) Makes searches on that column faster, at the cost of slightly slower writes. 5) "Get every column for every task that has been marked done."*

---

## Module 5: System Design - Thinking Like an Architect
**Time estimate: 2-3 hours (mostly thinking and writing, not coding)**

### Concepts

**System design** is deciding how the separate parts of your app - the browser the user sees, the server that runs your code, the database that stores data, and any outside services it calls - connect and divide the work, and predicting where that arrangement will strain as more people use it. You don't need to be an expert yet; the skill to practice is asking a few pointed questions of any design: *what breaks first when traffic spikes, where is the single point of failure, and which data must be instantly correct versus can lag a little?* Those are exactly the questions you'll answer for TrackIt below.

### Lab

**1. Draw TrackIt's current architecture** (pen and paper is fine):
```
[Browser] --> [FastAPI app] --> [PostgreSQL database]
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
5. Why do interviewers ask system design questions instead of just algorithm questions?

*Answers: 1) A single component whose failure takes down the whole system. 2) It determines which parts need strict consistency and which can be optimized differently (e.g., cached, computed later). 3) The database, since it's usually the first bottleneck. 4) No - first find the actual bottleneck; adding servers doesn't help if the database itself is the limit. 5) Because most real engineering work is about reasoning through trade-offs, not solving isolated puzzles.*

---

## Module 6: Security - Protecting User Data
**Time estimate: 3-4 hours**

### Concepts

**Authentication** confirms who a user is (login). **Authorization** confirms what they're allowed to do (e.g., only see their own tasks). A **hash** is a one-way transformation of a password so even you, the developer, never see or store the actual password.

### Lab

**1. Install dependencies:**
```bash
pip install passlib bcrypt python-jose
```

**2. Hash and verify passwords:**
```python
# auth.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
```

**3. Try it:**
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

---

## Module 7: AI Features - Building With, Not Just Using, AI
**Time estimate: 3-4 hours**

### Concepts

Large language models (LLMs) are good at turning messy natural language into structured data - exactly what TrackIt's "quick add" needs. The engineering skill isn't calling the API; it's making sure you don't blindly trust what comes back.

### Lab

**1. Define what a "parsed task" must look like:**
```python
# ai_parse.py
from pydantic import BaseModel
from datetime import date

class ParsedTask(BaseModel):
    title: str
    due_date: date | None
    priority: int  # 1-5
```

**2. Write the instruction you'd send to the model:**
```python
SYSTEM_PROMPT = """
Extract a task from the user's text. Respond ONLY with JSON matching:
{"title": string, "due_date": "YYYY-MM-DD" or null, "priority": integer 1-5}
No preamble, no markdown formatting.
"""
```

**3. Handle the response safely** (pseudocode, since it depends on which AI provider you use):
```python
import json

def parse_quick_add(user_text: str) -> ParsedTask:
    raw_response = call_llm(SYSTEM_PROMPT, user_text)  # your provider's API call
    try:
        data = json.loads(raw_response)
        return ParsedTask(**data)
    except (json.JSONDecodeError, ValueError):
        raise ValueError("Could not parse task from AI response - ask the user to retry")
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

**4. Practice a real git workflow:**
```bash
git checkout -b feature/task-queue
git add priority.py test_priority.py
git commit -m "Add priority queue with tests"
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

**2. Create a requirements file listing what you've installed so far:**
```bash
pip freeze > requirements.txt
```

**3. Build and run your container:**
```bash
docker build -t trackit-api .
docker run -p 8000:8000 trackit-api
```
Visit `http://localhost:8000/health` again - it should work exactly as it did outside Docker.

**4. Add automatic testing on every change:**
```yaml
# .github/workflows/ci.yml
name: CI
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest
```
Push this file and open a pull request - you'll see GitHub automatically run your tests.

### Checkpoint
Your app runs inside a Docker container, and a pull request on GitHub automatically triggers your test suite.

### Quiz
1. What problem does Docker solve that installing dependencies locally doesn't?
2. What does `requirements.txt` list?
3. What triggers the CI workflow you wrote?
4. Why is automatic testing on every PR more reliable than remembering to test manually?
5. What's the real-world consequence of skipping containerization for a team of five engineers?

*Answers: 1) Environment inconsistency - "works on my machine" bugs caused by different installed versions or missing dependencies. 2) Every Python package your project depends on, and its version. 3) Opening a pull request. 4) Humans forget or skip steps under deadline pressure; automation runs every time without fail. 5) Each engineer's machine could behave slightly differently, causing bugs that only show up for some people and are hard to reproduce.*

---

## Final Capstone: Ship Your Own Feature

You now have every module of TrackIt built. For your capstone, add **one new feature end-to-end**, touching every layer you learned:

1. Write a one-paragraph spec for it
2. Add any new database fields it needs
3. Build the endpoint(s)
4. Add authentication/ownership checks if it touches user data
5. Write at least two tests
6. Open a pull request with a clear description
7. Confirm CI passes

**Suggested feature to build:** recurring tasks (a task that automatically reappears every N days once marked done).

### Course completion checklist
- [ ] `SPEC.md` written
- [ ] API running locally with at least 3 endpoints
- [ ] Priority queue implemented and tested
- [ ] Database models for users and tasks
- [ ] Written answers to the three system design questions
- [ ] Password hashing implemented and verified
- [ ] AI quick-add schema and validation logic written
- [ ] Test suite passing with `pytest`
- [ ] Dockerfile builds and runs successfully
- [ ] CI workflow passes on a pull request
- [ ] One capstone feature shipped end-to-end

Completing all ten items means you've practiced, in a real product context, every fundamental this course set out to teach - not as isolated facts, but as decisions you made while building something real.
