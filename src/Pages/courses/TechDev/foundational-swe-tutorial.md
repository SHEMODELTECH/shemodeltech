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

**Why this matters:** AI/ML job postings have grown 74% year over year, but the skill being hired for is rarely "train a model from scratch" - it's structuring reliable systems around a model that is fundamentally probabilistic. That reliability layer is the engineering.

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
