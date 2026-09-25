<!-- order: 12 -->
# From Fundamentals to Product: Build "TrackIt" While Learning Every Core Skill

## How this tutorial works

Most tutorials teach one topic at a time, disconnected from any real system. That is not how engineering works in practice - you learn algorithms while deciding how to sort a feed, you learn security while wiring up login, you learn system design while figuring out why your app fell over under load.

So instead of nine separate lessons, you are going to build **one real product** - TrackIt, a habit and task tracker with an AI-assisted "quick add" feature - and each foundational topic will show up exactly where it shows up in a real engineering job: as the answer to a specific problem you hit while building.

By the end, you will have:
- A working backend API
- A relational database with a real schema
- Authentication and basic security hardening
- A simple AI feature (natural-language task parsing)
- Tests and a CI pipeline
- A containerized, cloud-deployable app
- A one-page product spec you wrote yourself

Each module is short, has runnable code, and ends with a "why this matters at the architecture level" note so you're not just copying snippets.

---

## Module 0: The Product Spec (Communication & Product Sense)

Before writing code, every real engineer writes a spec. This is the skill that is becoming *more* valuable as AI writes more of the code - someone still has to decide what to build and why.

### Practical exercise
Write a one-page spec using this template. Do this for TrackIt right now, in your own words, before reading further:

```
Problem: What pain point are we solving, for whom?
Users: Who specifically uses this?
Core flow: The 3-5 steps a user takes to get value
Non-goals: What we are explicitly NOT building (v1)
Success metric: One number that tells us it's working
```

**TrackIt's spec, for reference:**
- Problem: People abandon task apps because logging tasks feels like admin work
- Users: Individuals managing personal projects
- Core flow: sign up → type a task in plain English → AI structures it → see it on a list → mark done
- Non-goals: no team collaboration, no mobile app, no recurring tasks (v1)
- Success metric: time from "open app" to "task logged" under 10 seconds

**Why this matters:** In interviews and in real product work, engineers who can write a clear spec get trusted with ambiguous problems. Engineers who can't, only get handed pre-specified tickets. This is the difference between junior and senior scope.

### Checkpoint
You have a one-page spec for TrackIt, in your own words, with all five parts filled in: problem, users, core flow, non-goals, and one success metric.

### Quiz
1. What five parts does the spec template ask for?
2. Why write non-goals down explicitly?
3. What makes a good success metric?
4. Why is spec writing becoming *more* valuable as AI writes more code?
5. What is TrackIt's core flow in one line?

*Answers: 1) Problem, users, core flow, non-goals, and a success metric. 2) So everyone agrees on what v1 will not include, which stops scope creep and wasted work. 3) One measurable number that tells you whether the product is working, such as time from opening the app to logging a task. 4) Someone still has to decide what to build and why; code is only useful when it solves the right problem. 5) Sign up, type a task in plain English, AI structures it, see it on a list, mark it done.*

---

## Module 1: Programming Language Proficiency (Backend Core)

We'll use Python with FastAPI - readable, and the same shape as most production backends (Node/Express, Go, etc. - the concepts transfer).

### Practical exercise: scaffold the API

```bash
mkdir trackit && cd trackit
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy pydantic python-jose passlib bcrypt
```

```python
# main.py
from fastapi import FastAPI

app = FastAPI(title="TrackIt API")

@app.get("/health")
def health_check():
    return {"status": "ok"}
```

```bash
uvicorn main:app --reload
```

Visit `http://localhost:8000/health`. You now have a running service.

**Why this matters:** Language proficiency isn't syntax memorization - it's knowing the idioms (type hints, dependency injection, async) that let your code integrate cleanly with the rest of the ecosystem, which is what AI coding assistants and reviewers both expect to see.

### Checkpoint
Your FastAPI app runs locally, and `http://localhost:8000/health` returns `{"status": "ok"}`.

### Quiz
1. What does `python -m venv venv` create, and why use one?
2. What does the `@app.get("/health")` line do?
3. What command starts the server, and what does `--reload` add?
4. Why does a service need a health-check endpoint?
5. The tutorial says language proficiency isn't syntax memorisation. What is it instead?

*Answers: 1) A virtual environment: an isolated set of Python packages for this project, so its libraries don't clash with other projects. 2) It registers the function below it to handle GET requests to the `/health` path. 3) `uvicorn main:app --reload`; `--reload` restarts the server automatically when you save a code change. 4) So people and monitoring tools can check the service is up without touching real data. 5) Knowing the idioms, such as type hints, dependency injection, and async, that make your code fit cleanly into the wider ecosystem.*

---

## Module 2: Data Structures & Algorithms (Applied, Not Abstract)

You will use a hash map, a queue, and sorting logic - all inside real product code, not a whiteboard problem.

### Practical exercise: task prioritization

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
        # Sort by due date first, then priority
        return (self.due_date, self.priority) < (other.due_date, other.priority)

class TaskQueue:
    """A min-heap so the most urgent task is always O(log n) to retrieve."""
    def __init__(self):
        self._heap: list[Task] = []

    def add(self, task: Task):
        heapq.heappush(self._heap, task)

    def next_up(self) -> Task:
        return self._heap[0]

    def complete_next(self) -> Task:
        return heapq.heappop(self._heap)
```

**Why this matters:** A naive implementation would sort the full task list every time you want "what's next" - O(n log n) on every call. The heap keeps insert at O(log n) and peek at O(1). This is exactly the kind of decision an AI assistant will not make for you unless you specify it, and exactly what a code reviewer checks for.

### Checkpoint
`TaskQueue` returns the most urgent task: the earliest due date first, then the highest priority when due dates tie.

### Quiz
1. What data structure does `TaskQueue` use?
2. How fast is it to add a task, and to see the next one up?
3. What does `__lt__` control in the `Task` class?
4. Why not just sort the whole list every time?
5. In `priority`, does 1 mean highest or lowest?

*Answers: 1) A min-heap, through Python's `heapq` module. 2) Adding is O(log n); looking at the next task is O(1). 3) How two tasks compare, which is what the heap uses to order them: due date first, then priority. 4) Sorting on every request costs O(n log n) each time; the heap keeps the list in order as you go. 5) 1 is the highest priority.*

---

## Module 3: Databases (Schema Design + SQL)

### Practical exercise: model the data

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

Two design decisions worth noticing:
- `email` is indexed and unique - because you will query by it on every login
- `owner_id` is indexed - because you will filter every task list query by user

### Practical exercise: raw SQL you should be able to write by hand

```sql
-- Tasks due this week for one user, most urgent first
SELECT title, due_date, priority
FROM tasks
WHERE owner_id = :user_id
  AND due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
  AND done = false
ORDER BY due_date ASC, priority ASC;
```

**Why this matters:** An ORM will generate SQL for you, but if you cannot read what it generated and spot a missing index or an N+1 query, you cannot debug a slow production endpoint. This is one of the highest-leverage skills for the "senior engineers who review AI output" shift happening across the industry right now.

### Checkpoint
You have `User` and `Task` models linked by `owner_id`, and you can write the "due this week" SQL query by hand.

### Quiz
1. Why is `email` both unique and indexed?
2. What does the `owner_id` foreign key represent?
3. Why index `owner_id`?
4. What is an N+1 query problem?
5. Why should you be able to read the SQL an ORM generates?

*Answers: 1) Unique so two accounts can't share an email; indexed because every login looks users up by email. 2) Which user owns each task. 3) Every task-list query filters by the owner, and the index keeps those lookups fast as the table grows. 4) Running one query to fetch a list, then one extra query per item, when a single joined query would do. 5) So you can spot slow or wrong queries, such as a missing index or an N+1 problem, when the app slows down.*

---

## Module 4: System Design & Architecture

### Practical exercise: draw your own architecture before scaling

At TrackIt's current size, the architecture is intentionally simple:

```
[Browser] --> [FastAPI app] --> [PostgreSQL]
                    |
                    --> [AI parsing service (external API call)]
```

Now answer these design questions in writing - this is the actual skill system design interviews test:

1. **What breaks first if traffic 10x's?** The database connection pool, most likely - you'd add connection pooling (PgBouncer) before touching anything else.
2. **What's the single point of failure?** One app server. Fix: run 2+ instances behind a load balancer, keep the app stateless (no in-memory sessions) so any instance can handle any request.
3. **What data needs to be consistent vs. what can be eventually consistent?** Task writes must be consistent (a user must never lose a task). A "tasks completed this week" analytics count could be eventually consistent, computed async.

**Why this matters:** Interviewers and staff engineers are not testing whether you know the "correct" architecture - there isn't one. They're testing whether you can reason about trade-offs out loud. Practice narrating decisions like the three above for every system you build, even toy ones.

### Checkpoint
You've drawn TrackIt's architecture and written answers to the three scaling questions in your own words.

### Quiz
1. What is likely to break first if traffic grows tenfold?
2. What is TrackIt's single point of failure, and how do you remove it?
3. Why must the app be stateless to run more than one copy?
4. Which data must be strongly consistent in TrackIt?
5. What are system design interviews actually testing?

*Answers: 1) The database connection pool, so you'd add pooling such as PgBouncer first. 2) The single app server; run two or more instances behind a load balancer. 3) So any instance can handle any request, without depending on data held in one server's memory. 4) Task writes, because a user must never lose a task. 5) Whether you can reason about trade-offs for a specific situation, not whether you know one correct architecture.*

---

## Module 5: Security (Authentication, Done Properly)

### Practical exercise: password hashing and JWT auth

```python
# auth.py
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "replace-with-env-variable-in-production"
ALGORITHM = "HS256"

def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(user_id: int, expires_minutes: int = 30) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.utcnow() + timedelta(minutes=expires_minutes),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
```

Three non-negotiable rules this code enforces:
- Never store plain passwords - only bcrypt hashes
- Never put the secret key in source control - load it from an environment variable
- Tokens expire - a stolen token should not work forever

### Practical exercise: the checklist you run on every endpoint

```
- Does this endpoint require auth? Is that enforced, not assumed?
- Does this query filter by owner_id, or could a user see someone else's data?
- Is user input validated (Pydantic models) before it touches the database?
- Are errors generic to the client ("invalid credentials") not specific ("wrong password")?
```

**Why this matters:** Security is not a separate role anymore - DevSecOps means every engineer owns this. Reviewing AI-generated code for exactly these four things is now a daily task, not a specialist's job.

### Checkpoint
Passwords are stored only as bcrypt hashes, tokens expire, and you've run the four-question security checklist on each endpoint.

### Quiz
1. Why store a bcrypt hash instead of the password?
2. Where should the JWT secret key live?
3. Why should access tokens expire?
4. Why must every task query filter by `owner_id`?
5. Why return "invalid credentials" rather than "wrong password"?

*Answers: 1) If the database leaks, the hashes can't easily be turned back into passwords. 2) In an environment variable or secrets manager, never in source control. 3) So a stolen token stops working after a short time. 4) Otherwise one user could read or change another user's tasks. 5) A specific message tells an attacker which part was right, such as that the email exists.*

---

## Module 6: AI/ML Literacy (Building an AI Feature, Not Just Using One)

TrackIt's "quick add" feature turns "finish the report by friday, high priority" into structured data.

### Practical exercise: a real AI-integration endpoint

```python
# ai_parse.py
import json
from fastapi import APIRouter
from pydantic import BaseModel
from datetime import date

router = APIRouter()

class QuickAddRequest(BaseModel):
    text: str

class ParsedTask(BaseModel):
    title: str
    due_date: date | None
    priority: int  # 1-5

SYSTEM_PROMPT = """
Extract a task from the user's text. Respond ONLY with JSON matching:
{"title": string, "due_date": "YYYY-MM-DD" or null, "priority": integer 1-5}
No preamble, no markdown formatting.
"""

@router.post("/quick-add", response_model=ParsedTask)
def quick_add(req: QuickAddRequest):
    # Call your LLM provider here with SYSTEM_PROMPT + req.text
    # raw_response = call_llm(SYSTEM_PROMPT, req.text)
    # parsed = json.loads(raw_response)
    # return ParsedTask(**parsed)
    raise NotImplementedError("Wire this to your LLM provider of choice")
```

The engineering judgment here, not the API call, is the actual skill:
- **Never trust the model's output structure blindly** - validate it against the Pydantic schema, and handle the case where parsing fails
- **Keep the prompt out of the client** - a user should never be able to see or override your system prompt
- **Log failures** - when the model returns malformed JSON, you need to know how often that happens in production

**Why this matters:** Most AI work in product teams is not training a model from scratch - it's structuring reliable systems around a model that is fundamentally probabilistic. That reliability layer is the engineering.

### Checkpoint
The quick-add endpoint validates the model's reply against the `ParsedTask` schema, and you know what should happen when parsing fails.

### Quiz
1. What does the quick-add feature do?
2. Why validate the model's output against a schema?
3. Why keep the system prompt on the server?
4. Why log parsing failures?
5. What should the endpoint do when the model returns malformed JSON?

*Answers: 1) It turns a plain-English sentence into a structured task: title, due date, and priority. 2) A language model's output isn't guaranteed to follow the format, so the code must check it before trusting it. 3) So users can't see it or override it. 4) To learn how often the model breaks the format in real use, so you can fix the prompt or add safeguards. 5) Handle it cleanly: return a helpful error, or ask the user to enter the task manually, rather than crashing or saving bad data.*

---

## Module 7: Software Engineering Practices (Git, Testing, Review)

### Practical exercise: a real test for your priority queue

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

```bash
pip install pytest
pytest test_priority.py -v
```

### Practical exercise: a git workflow that matches real teams

```bash
git init
git checkout -b feature/quick-add-endpoint
# ... make changes ...
git add ai_parse.py test_priority.py
git commit -m "Add AI quick-add endpoint with schema validation"
git push origin feature/quick-add-endpoint
# Open a pull request, request review, do not merge your own PR without review
```

**Why this matters:** Tests are what let you trust AI-generated code changes without re-reading every line by hand. A codebase with no tests forces every review to be manual and slow - exactly the bottleneck teams are trying to remove.

### Checkpoint
Both priority-queue tests pass with `pytest`, and your change lives on its own feature branch.

### Quiz
1. What do the two tests check?
2. Why do tests matter more as AI writes more code?
3. What does `git checkout -b feature/quick-add-endpoint` do?
4. Why work on a feature branch instead of main?
5. What rule does the workflow give about merging your own pull request?

*Answers: 1) That the earliest due date comes first, and that priority breaks ties between tasks due the same day. 2) They let you trust a change without re-reading every line by hand. 3) Creates a new branch with that name and switches to it. 4) So unfinished work stays separate until it's reviewed and ready to merge. 5) Don't merge it yourself without review: open the pull request, request a review, and merge only after someone else has looked at it.*

---

## Module 8: Cloud & Infrastructure (Ship It)

### Practical exercise: containerize the app

```dockerfile
# Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t trackit-api .
docker run -p 8000:8000 trackit-api
```

### Practical exercise: a minimal CI pipeline (GitHub Actions)

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

Now every pull request automatically runs your tests before a human even looks at it.

**Why this matters:** Docker means "works on my machine" stops being an excuse - the container is identical everywhere. CI means broken code never reaches your teammates. Together, these two things are what let a team move fast without breaking things, which is the entire point of DevOps as a discipline.

### Checkpoint
TrackIt builds and runs in Docker, and a GitHub Actions workflow runs your tests on every pull request.

### Quiz
1. What problem does a Docker container solve?
2. What does the `CMD` line in the Dockerfile do?
3. What triggers the CI workflow?
4. What does the CI job do, step by step?
5. How do containers and CI together support DevOps?

*Answers: 1) "It works on my machine": the container runs the same way everywhere. 2) Sets the command that starts the app, here Uvicorn serving `main:app` on port 8000. 3) Every pull request. 4) Checks out the code, sets up Python 3.12, installs the requirements, and runs pytest. 5) Containers make every environment identical, and CI stops broken code before it reaches teammates, so the team can ship often and safely.*

---

## Putting it together: what you actually built

| Module | Skill | Where it lives in TrackIt |
|---|---|---|
| 0 | Product sense | The spec that shaped every decision after it |
| 1 | Language proficiency | FastAPI backend |
| 2 | Data structures & algorithms | Heap-based priority queue |
| 3 | Databases | SQLAlchemy models + raw SQL |
| 4 | System design | Architecture diagram + scaling answers |
| 5 | Security | Password hashing, JWT, ownership checks |
| 6 | AI/ML literacy | Quick-add endpoint with schema-validated LLM output |
| 7 | Engineering practices | Tests + git workflow |
| 8 | Cloud & infrastructure | Dockerfile + CI pipeline |

## Where to go next

- Deploy the container to a real cloud provider (Render, Railway, or AWS ECS are the lowest-friction starting points)
- Add a second, related feature end-to-end yourself (recurring tasks) using the same modules as a checklist
- Take this exact structure and swap TrackIt for whatever product idea you actually want to build - the modules are the reusable part, not the app
