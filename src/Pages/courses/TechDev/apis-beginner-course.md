<!-- order: 8 -->
# APIs for Builders: A Practical Beginner's Course

## Course Overview

**By the end of this course, you'll be able to:**
- Design a clean REST API: resource naming, versioning, pagination, filtering, and sorting
- Return one consistent error format and publish accurate OpenAPI documentation at `/docs`
- Call third-party APIs safely, with timeouts, retries, backoff, and respect for rate limits
- Explain authentication versus authorization and sessions versus tokens, and store passwords safely with hashing
- Issue and verify JWTs with PyJWT and protect endpoints so each user sees only their own data
- Add a GraphQL endpoint with Strawberry and explain when it beats REST
- Describe each step of "Sign in with Google" (OAuth 2.0 and OpenID Connect), including `state` and PKCE

**Who this is for:** Builders who can make a basic CRUD API and want one other people can rely on: well designed, documented, connected to other services, and secure.

**How the course works:** Eight modules, all growing the same FastAPI task API. It starts from the finished project of **Backend Development for Builders**; if you skipped that course, Module 0 has starter code to paste. Every module follows the same pattern:
- **Concept** - what it is, in plain language
- **Where you'd actually use this** - a real product scenario
- **Lab** - hands-on, runnable code
- **Checkpoint**
- **Quiz** - questions with answers

**Tools needed:** Python 3.12+, a terminal, a code editor, and `curl` (or [Postman](https://www.postman.com)). On Windows, use Git Bash for the commands, as in the Backend course.

---

## Module 0: Why APIs Exist, and Your Starting Point

**Time: about 1 hour**

### Concept

An **API** (Application Programming Interface) is a defined way for two pieces of software to talk to each other. Your phone's weather app doesn't calculate the weather: it asks a weather company's API and displays the answer. Almost every app is a frontend talking to a backend through an API, and that backend often calls other APIs in turn.

Once people depend on your API, its URLs, data shapes, and errors become a **contract**; changing them carelessly breaks their apps. This course makes that contract clear (REST design, docs), extends it (GraphQL), and protects it (authentication).

### Where you'd actually use this

Your mobile app talking to your own backend, your backend talking to a payment provider, one company's software talking to another's: it's all APIs.

### Lab

1. **Watch a live API.** In your browser's developer tools ("Inspect", then "Network"), load any website and click a `Fetch` or `XHR` request to see what it sent and received.

2. **Get the starting app.** If you finished the Backend course, open that `tasks-api` project, activate its virtual environment, and skip to step 3. Otherwise:
```bash
mkdir tasks-api && cd tasks-api
python3 -m venv venv
source venv/bin/activate
pip install "fastapi[standard]" sqlalchemy pytest
mkdir -p app tests && touch app/__init__.py
```
Then create these files.

`app/config.py`:
```python
import os

APP_NAME = os.getenv("APP_NAME", "Tasks API")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tasks.db")
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
```
`app/database.py`:
```python
from typing import Annotated

from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import DATABASE_URL

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    with SessionLocal() as db:
        yield db


SessionDep = Annotated[Session, Depends(get_db)]
```
`app/models.py`:
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
`app/schemas.py`:
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
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    notes: str | None
    done: bool
```
`app/main.py` (the task routes arrive in Module 1, and the Backend course's logging is left out to keep this short):
```python
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import APP_NAME, LOG_LEVEL
from app.database import Base, engine

logging.basicConfig(level=LOG_LEVEL)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title=APP_NAME, lifespan=lifespan)


@app.get("/health")
def health():
    return {"status": "ok"}
```
`tests/conftest.py`:
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
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(bind=engine)
    TestSession = sessionmaker(bind=engine)

    def override_get_db():
        with TestSession() as db:
            yield db

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()
```

3. **Run it** with `uvicorn app.main:app --reload` and check `curl http://localhost:8000/health` returns `{"status":"ok"}`.

### Checkpoint
You inspected a real API request, and your task API runs locally.

### Quiz
1. What is an API, in one sentence?
2. Why doesn't a weather app calculate the weather itself?
3. What does it mean that an API is a "contract"?
4. Is an API always between two different companies' software?

*Answers: 1) A defined way for two pieces of software to communicate. 2) It asks a specialized weather service's API instead of building its own forecasting. 3) Clients depend on its URLs, data shapes, and errors staying as documented, so careless changes break their apps. 4) No, it's just as often your own frontend talking to your own backend.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "api",
   "kicker": "Module 0 · Why APIs exist",
   "title": "Software talking to software",
   "beats": [
    {
     "say": "Welcome to APIs for Builders."
    },
    {
     "say": "In this course you grow one task A P I into something other people can rely on."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "An API is how one program asks another",
   "nodes": [
    {
     "id": "wapp",
     "label": "Weather app",
     "x": 12,
     "y": 28,
     "sub": "on your phone",
     "art": "phone"
    },
    {
     "id": "wapi",
     "label": "Weather API",
     "x": 46,
     "y": 28,
     "sub": "a weather company",
     "art": "cloud"
    },
    {
     "id": "fe",
     "label": "Your frontend",
     "x": 12,
     "y": 74,
     "sub": "app or website",
     "art": "browser"
    },
    {
     "id": "be",
     "label": "Your backend",
     "x": 50,
     "y": 74,
     "sub": "your API",
     "art": "server"
    },
    {
     "id": "pay",
     "label": "Payment provider",
     "x": 88,
     "y": 74,
     "sub": "another API",
     "art": "coin"
    }
   ],
   "edges": [
    {
     "from": "wapp",
     "to": "wapi"
    },
    {
     "from": "fe",
     "to": "be"
    },
    {
     "from": "be",
     "to": "pay"
    }
   ],
   "beats": [
    {
     "say": "An A P I is a defined way for two pieces of software to talk to each other.",
     "show": 2
    },
    {
     "say": "Your weather app doesn't calculate the weather. It sends a request to a weather company's A P I.",
     "show": 2,
     "on": "wapp",
     "send": {
      "from": "wapp",
      "to": "wapi",
      "label": "GET forecast"
     }
    },
    {
     "say": "The A P I sends back the answer, and the app just displays it.",
     "show": 2,
     "on": "wapi",
     "send": {
      "from": "wapi",
      "to": "wapp",
      "label": "200 · JSON forecast"
     }
    },
    {
     "say": "Your own apps work the same way: a frontend asks your backend, through your A P I.",
     "show": 4,
     "on": [
      "fe",
      "be"
     ],
     "send": {
      "from": "fe",
      "to": "be",
      "label": "request"
     }
    },
    {
     "say": "And that backend often calls other A P I s in turn, like a payment provider.",
     "show": 5,
     "on": [
      "be",
      "pay"
     ],
     "send": {
      "from": "be",
      "to": "pay",
      "label": "request"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Once people depend on it, it's a contract",
   "columns": [
    "Part",
    "Example",
    "Change it carelessly and..."
   ],
   "rows": [
    [
     "URLs",
     "GET /health",
     "their requests hit nothing"
    ],
    [
     "Data shapes",
     "{\"status\": \"ok\"}",
     "their code reads a missing field"
    ],
    [
     "Errors",
     "404 + a message",
     "their error handling misfires"
    ]
   ],
   "beats": [
    {
     "say": "Once other people's apps depend on your A P I, it becomes a contract with three parts."
    },
    {
     "say": "Its addresses. If a U R L moves, their requests go nowhere.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "The shape of its data. Rename a field, and their code reads something that isn't there.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "And its errors. Change those, and their error handling stops working.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "This course makes that contract clear, extends it, and protects it.",
     "col": 0
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 1",
   "title": "Every request in the Network tab has the same parts",
   "columns": [
    "Part",
    "What you'll see"
   ],
   "rows": [
    [
     "Method",
     "GET"
    ],
    [
     "URL",
     "http://localhost:8000/health"
    ],
    [
     "Status",
     "200 OK"
    ],
    [
     "Response header",
     "content-type: application/json"
    ],
    [
     "Response body",
     "{\"status\":\"ok\"}"
    ]
   ],
   "beats": [
    {
     "say": "Open your browser's developer tools, go to the Network tab, load any site, and click a fetch request."
    },
    {
     "say": "Every request has a method, the verb. Here, GET, which means read.",
     "hl": 0
    },
    {
     "say": "A U R L, the address it went to.",
     "hl": 1
    },
    {
     "say": "A status code. Two hundred means it worked.",
     "hl": 2
    },
    {
     "say": "And a response, here labelled as J S O N, with the data in its body.",
     "hl": [
      3,
      4
     ]
    },
    {
     "say": "This is the very request you'll make to your own app in a minute.",
     "hl": [
      1,
      4
     ],
     "dim": true
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 2 and 3",
   "title": "Your starting app answers its first request",
   "nodes": [
    {
     "id": "term",
     "label": "Terminal",
     "x": 14,
     "y": 50,
     "sub": "curl",
     "art": "terminal"
    },
    {
     "id": "api",
     "label": "Tasks API",
     "x": 50,
     "y": 50,
     "sub": "uvicorn app.main:app",
     "art": "server"
    },
    {
     "id": "db",
     "label": "tasks.db",
     "x": 86,
     "y": 50,
     "sub": "SQLite",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "term",
     "to": "api"
    },
    {
     "from": "api",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "Here's the starting app: a FastAPI server and an S Q Lite database file.",
     "show": 3
    },
    {
     "say": "When uvicorn starts it, the lifespan function creates any missing tables.",
     "on": "api",
     "send": {
      "from": "api",
      "to": "db",
      "label": "create_all → tasks table"
     }
    },
    {
     "say": "Now curl asks for slash health.",
     "on": "term",
     "send": {
      "from": "term",
      "to": "api",
      "label": "GET /health"
     }
    },
    {
     "say": "This route doesn't need the database. It answers straight away: status two hundred, status ok.",
     "on": "api",
     "send": {
      "from": "api",
      "to": "term",
      "label": "200 · {\"status\":\"ok\"}"
     }
    },
    {
     "say": "If you see that, your A P I is running, and the task routes arrive in Module 1.",
     "on": [
      "term",
      "api"
     ]
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Is an API always between two different companies' software?",
   "options": [
    "Yes, always",
    "No, it's just as often your own frontend talking to your own backend",
    "Only on mobile apps"
   ],
   "answer": 1,
   "good": "That's right. It's just as often your own frontend talking to your own backend.",
   "bad": "Not quite. It's just as often your own frontend talking to your own backend.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Is an A P I always between two different companies' software?",
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
     "You inspected a real API request",
     ""
    ],
    [
     "Your task API runs locally",
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
     "say": "you've inspected a real A P I request,",
     "show": 1
    },
    {
     "say": "and your task A P I runs on your computer.",
     "show": 2
    },
    {
     "say": "Next, in Module 1, you design it well.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 1: REST Design Done Well

**Time: about 2.5 hours**

### Concept

**REST** organizes an API around **resources** (`tasks`, `users`), each with its own URL, and uses HTTP methods as the verbs. Good REST design is mostly consistency:

- **Plural nouns, not verbs:** `GET /tasks`, `PATCH /tasks/5`. Not `/getTasks` or `/tasks/5/complete`; marking a task done is `PATCH /tasks/5` with `{"done": true}`.
- **Query parameters for options:** filtering (`?done=false`), searching (`?q=milk`), sorting (`?sort=-title`, `-` meaning descending).
- **Paginate lists.** Never return everything: a table that grows to 100,000 rows will time out. Return a page plus what's needed to get the next: `{"items": [...], "total": 42, "limit": 20, "offset": 0}`. (Huge or fast-changing lists use *cursor* pagination, passing a "start after this item" marker.)
- **Version the API** in the path (`/v1/tasks`). For a breaking change, such as renaming a field, ship `/v2` and keep `/v1` running until clients move.

### Where you'd actually use this

Stripe, GitHub, and most public APIs follow these conventions, which is why you can guess how a new one works.

### Lab

1. **Add a page schema.** At the bottom of `app/schemas.py`:
```python
class TaskPage(BaseModel):
    items: list[TaskOut]
    total: int
    limit: int
    offset: int
```

2. **Move the task routes into their own router.** Create the folder `app/routers/` with an empty `__init__.py`, then `app/routers/tasks.py`:
```python
from typing import Annotated, Literal

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import SessionDep
from app.models import Task
from app.schemas import TaskCreate, TaskOut, TaskPage, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])


def get_task_or_404(db: Session, task_id: int) -> Task:
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=f"Task {task_id} not found")
    return task


@router.get("", response_model=TaskPage, summary="List tasks with paging, filtering, and sorting")
def list_tasks(
    db: SessionDep,
    done: bool | None = None,
    q: Annotated[str | None, Query(max_length=100, description="Text to find in titles")] = None,
    sort: Literal["id", "-id", "title", "-title"] = "id",
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
):
    query = select(Task)
    if done is not None:
        query = query.where(Task.done == done)
    if q:
        query = query.where(Task.title.ilike(f"%{q}%"))

    total = db.scalar(select(func.count()).select_from(query.subquery()))

    column = getattr(Task, sort.removeprefix("-"))
    query = query.order_by(column.desc() if sort.startswith("-") else column)
    items = db.scalars(query.limit(limit).offset(offset)).all()
    return {"items": items, "total": total, "limit": limit, "offset": offset}


@router.get("/{task_id}", response_model=TaskOut)
def get_task(task_id: int, db: SessionDep):
    return get_task_or_404(db, task_id)


@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(data: TaskCreate, db: SessionDep):
    task = Task(**data.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.patch("/{task_id}", response_model=TaskOut)
def update_task(task_id: int, data: TaskUpdate, db: SessionDep):
    task = get_task_or_404(db, task_id)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: SessionDep):
    db.delete(get_task_or_404(db, task_id))
    db.commit()
```
- `Literal[...]` allows only four `sort` values; `Query(ge=1, le=100)` caps the page size
- `total` counts all matches before paging, so clients can show "page 1 of 3"
- `ilike` is a case-insensitive "contains" search

3. **Mount the router under `/v1`.** In `app/main.py`, add `from app.routers import tasks` to the imports. If you came from the Backend course, delete the old task routes and the `get_task_or_404` helper there. Then add below `app = FastAPI(...)`:
```python
app.include_router(tasks.router, prefix="/v1")
```

4. **Try it:**
```bash
for t in "Buy milk" "Write report" "Buy stamps"; do
  curl -s -X POST http://localhost:8000/v1/tasks -H "Content-Type: application/json" -d "{\"title\": \"$t\"}"; echo
done
curl "http://localhost:8000/v1/tasks?limit=2"
curl "http://localhost:8000/v1/tasks?limit=2&offset=2"
curl "http://localhost:8000/v1/tasks?q=buy&sort=-title"
```

5. **Test it.** Delete `tests/test_tasks.py` if you have it from the Backend course: it tests the old unversioned URLs, exactly the breakage versioning protects real clients from. Create `tests/test_api.py`:
```python
def test_paging_filtering_and_sorting(client):
    for title in ["Buy milk", "Write report", "Buy stamps"]:
        client.post("/v1/tasks", json={"title": title})

    page = client.get("/v1/tasks", params={"limit": 2}).json()
    assert page["total"] == 3
    assert len(page["items"]) == 2

    found = client.get("/v1/tasks", params={"q": "buy", "sort": "-title"}).json()
    assert [t["title"] for t in found["items"]] == ["Buy stamps", "Buy milk"]

    assert client.get("/v1/tasks", params={"limit": 500}).status_code == 422
```
Run `python -m pytest`.

### Checkpoint
`/v1/tasks` returns pages with a `total` and supports filtering, search, and sorting, with a passing test.

### Quiz
1. Why is `POST /tasks/5/complete` weaker REST design than `PATCH /tasks/5`?
2. Why should a list endpoint never return every row?
3. What does a client need in a paged response to build "next page" buttons?
4. When should you release `/v2` of an API?

*Answers: 1) It puts a verb in the URL; REST uses the resource URL plus a method, and changing `done` is a partial update, so `PATCH`. 2) Lists grow without limit, so responses would become slow and huge. 3) The items plus `total`, `limit`, and `offset` (or a cursor). 4) When you must make a breaking change, such as renaming or removing a field; additions can stay in `/v1`.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "blueprint",
   "kicker": "Module 1 · REST design",
   "title": "Design an API people can guess",
   "beats": [
    {
     "say": "Welcome to Module 1."
    },
    {
     "say": "REST organises an A P I around resources, like tasks and users, each with its own address."
    },
    {
     "say": "Good REST design is mostly about being consistent."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Nouns in the URL, verbs in the method",
   "columns": [
    "Method",
    "Path",
    "Does",
    "Status"
   ],
   "rows": [
    [
     "GET",
     "/v1/tasks",
     "List tasks (a page)",
     "200"
    ],
    [
     "POST",
     "/v1/tasks",
     "Create a task",
     "201"
    ],
    [
     "GET",
     "/v1/tasks/5",
     "Read task 5",
     "200"
    ],
    [
     "PATCH",
     "/v1/tasks/5",
     "Change some fields, e.g. {\"done\": true}",
     "200"
    ],
    [
     "DELETE",
     "/v1/tasks/5",
     "Remove task 5",
     "204"
    ],
    [
     "POST",
     "/tasks/5/complete",
     "✗ a verb in the URL",
     "-"
    ]
   ],
   "beats": [
    {
     "say": "In REST, the U R L names a thing, using a plural noun. The H T T P method is the verb.",
     "col": 1
    },
    {
     "say": "GET slash v one slash tasks lists them. POST to the same address creates one, and answers two oh one, created.",
     "hl": [
      0,
      1
     ]
    },
    {
     "say": "Add an i d to the path, and you're talking about one task: read it, change it, or delete it.",
     "hl": [
      2,
      3,
      4
     ],
     "col": 0
    },
    {
     "say": "To mark task five done, you don't invent a new address. You PATCH it, with done true in the body.",
     "hl": 3,
     "dim": true
    },
    {
     "say": "Slash tasks slash five slash complete puts a verb in the U R L. That's the habit to avoid.",
     "hl": 5,
     "dim": true
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 4",
   "title": "Create three tasks",
   "nodes": [
    {
     "id": "cli",
     "label": "curl",
     "x": 12,
     "y": 50,
     "sub": "your terminal",
     "art": "terminal"
    },
    {
     "id": "api",
     "label": "POST /v1/tasks",
     "x": 50,
     "y": 50,
     "sub": "create_task",
     "art": "server"
    },
    {
     "id": "db",
     "label": "tasks table",
     "x": 88,
     "y": 50,
     "sub": "SQLite",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "cli",
     "to": "api"
    },
    {
     "from": "api",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "The lab starts by creating three tasks. Here's the first.",
     "on": "cli",
     "send": {
      "from": "cli",
      "to": "api",
      "label": "{\"title\": \"Buy milk\"}"
     }
    },
    {
     "say": "The server checks the body against Task Create, then inserts a row.",
     "on": "api",
     "send": {
      "from": "api",
      "to": "db",
      "label": "INSERT · Buy milk"
     }
    },
    {
     "say": "The database gives the new row an i d: one.",
     "on": "db",
     "send": {
      "from": "db",
      "to": "api",
      "label": "id = 1"
     }
    },
    {
     "say": "And the server answers two oh one, with the whole task as J S O N.",
     "on": "cli",
     "send": {
      "from": "api",
      "to": "cli",
      "label": "201 · {\"id\": 1, \"title\": \"Buy milk\", \"notes\": null, \"done\": false}"
     }
    },
    {
     "say": "The loop does the same for Write report, i d two, and Buy stamps, i d three.",
     "on": "db",
     "send": {
      "from": "cli",
      "to": "api",
      "label": "Write report → 2 · Buy stamps → 3"
     }
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Concept · Pagination",
   "title": "limit and offset hand out one page at a time",
   "values": [
    "1 · Buy milk",
    "2 · Write report",
    "3 · Buy stamps"
   ],
   "beats": [
    {
     "say": "Never return every row. A table that grows to a hundred thousand rows would time out."
    },
    {
     "say": "Ask for limit two. You get the first two tasks.",
     "hl": [
      0,
      1
     ],
     "ptr": {
      "offset": 0
     },
     "note": "GET /v1/tasks?limit=2 → {\"items\": [1, 2], \"total\": 3, \"limit\": 2, \"offset\": 0}"
    },
    {
     "say": "The total says three, so the client knows there's another page.",
     "hl": [
      0,
      1
     ],
     "ptr": {
      "offset": 0
     },
     "note": "offset 0 + limit 2 < total 3 → show a Next button"
    },
    {
     "say": "Ask again with offset two, which means skip two. You get the last task.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "offset": 2
     },
     "note": "GET /v1/tasks?limit=2&offset=2 → {\"items\": [3], \"total\": 3, ...}"
    },
    {
     "say": "Two plus two passes the total of three, so that was the last page.",
     "ok": [
      0,
      1,
      2
     ],
     "note": "offset 2 + limit 2 ≥ total 3 → no more pages"
    },
    {
     "say": "And limit five hundred is refused with four twenty two, because the limit is capped at one hundred.",
     "ok": [
      0,
      1,
      2
     ],
     "note": "GET /v1/tasks?limit=500 → 422"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 2",
   "title": "Trace a search: ?q=buy&sort=-title",
   "file": "app/routers/tasks.py",
   "code": "query = select(Task)\nif done is not None:\n    query = query.where(Task.done == done)\nif q:\n    query = query.where(Task.title.ilike(f\"%{q}%\"))\n\ntotal = db.scalar(select(func.count()).select_from(query.subquery()))\n\ncolumn = getattr(Task, sort.removeprefix(\"-\"))\nquery = query.order_by(column.desc() if sort.startswith(\"-\") else column)\nitems = db.scalars(query.limit(limit).offset(offset)).all()\nreturn {\"items\": items, \"total\": total, \"limit\": limit, \"offset\": offset}",
   "beats": [
    {
     "say": "Now the request GET slash v one slash tasks, with q equals buy and sort equals minus title.",
     "vars": {
      "done": "None",
      "q": "\"buy\"",
      "sort": "\"-title\"",
      "limit": 20,
      "offset": 0
     }
    },
    {
     "say": "Start with every task.",
     "line": 1,
     "vars": {
      "done": "None",
      "q": "\"buy\"",
      "sort": "\"-title\"",
      "limit": 20,
      "offset": 0
     }
    },
    {
     "say": "Done is None, so there's no done filter.",
     "line": 2
    },
    {
     "say": "Q is buy, so keep titles that contain buy, ignoring case.",
     "line": [
      4,
      5
     ]
    },
    {
     "say": "Count the matches before paging: Buy milk and Buy stamps. Total is two.",
     "line": 7,
     "vars": {
      "q": "\"buy\"",
      "sort": "\"-title\"",
      "limit": 20,
      "offset": 0,
      "total": 2
     }
    },
    {
     "say": "Strip the minus sign to get the column: title.",
     "line": 9,
     "vars": {
      "q": "\"buy\"",
      "sort": "\"-title\"",
      "total": 2,
      "column": "Task.title"
     }
    },
    {
     "say": "The minus meant descending, so sort Z to A.",
     "line": 10,
     "vars": {
      "q": "\"buy\"",
      "sort": "\"-title\"",
      "total": 2,
      "column": "Task.title desc"
     }
    },
    {
     "say": "Take one page of up to twenty: Buy stamps, then Buy milk.",
     "line": 11,
     "vars": {
      "total": 2,
      "items": "[\"Buy stamps\", \"Buy milk\"]"
     }
    },
    {
     "say": "And send it back as a page, with the total, limit and offset.",
     "line": 12,
     "out": "{\"items\": [{\"id\": 3, \"title\": \"Buy stamps\", ...}, {\"id\": 1, \"title\": \"Buy milk\", ...}], \"total\": 2, \"limit\": 20, \"offset\": 0}"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept · Versioning",
   "title": "Breaking change? Ship /v2, keep /v1",
   "nodes": [
    {
     "id": "old",
     "label": "Older app",
     "x": 12,
     "y": 26,
     "sub": "built on v1",
     "art": "phone"
    },
    {
     "id": "new",
     "label": "Updated app",
     "x": 12,
     "y": 74,
     "sub": "moved to v2",
     "art": "browser"
    },
    {
     "id": "v1",
     "label": "/v1/tasks",
     "x": 56,
     "y": 26,
     "sub": "unchanged",
     "art": "server"
    },
    {
     "id": "v2",
     "label": "/v2/tasks",
     "x": 56,
     "y": 74,
     "sub": "a field renamed",
     "art": "server"
    }
   ],
   "edges": [
    {
     "from": "old",
     "to": "v1"
    },
    {
     "from": "new",
     "to": "v2"
    }
   ],
   "beats": [
    {
     "say": "Your router is mounted under slash v one. That number protects your clients.",
     "show": 3,
     "on": "v1"
    },
    {
     "say": "An older app keeps calling slash v one, and keeps getting the shape it was built for.",
     "show": 3,
     "on": "old",
     "send": {
      "from": "old",
      "to": "v1",
      "label": "GET /v1/tasks"
     }
    },
    {
     "say": "Say you must rename a field. That's a breaking change, so it goes in slash v two.",
     "show": 4,
     "on": "v2"
    },
    {
     "say": "Updated apps move to slash v two when they're ready.",
     "show": 4,
     "on": "new",
     "send": {
      "from": "new",
      "to": "v2",
      "label": "GET /v2/tasks"
     }
    },
    {
     "say": "Keep slash v one running until everyone has moved. Adding a field isn't breaking, so it can stay in v one.",
     "show": 4,
     "on": [
      "v1",
      "old"
     ],
     "send": {
      "from": "v1",
      "to": "old",
      "label": "200 · same shape as before"
     }
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why should a list endpoint never return every row?",
   "options": [
    "It's against the law",
    "Lists grow without limit, so responses become slow and huge",
    "Browsers can only show 20 items"
   ],
   "answer": 1,
   "good": "That's right. Lists grow without limit, so responses would become slow and huge.",
   "bad": "Not quite. Lists grow without limit, so responses would become slow and huge.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why should a list endpoint never return every row?",
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
     "/v1/tasks returns pages with a total",
     ""
    ],
    [
     "Filtering, search and sorting, with a passing test",
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
     "say": "slash v one slash tasks returns pages with a total,",
     "show": 1
    },
    {
     "say": "and supports filtering, search and sorting, with a passing test.",
     "show": 2
    },
    {
     "say": "Next, in Module 2, you make errors consistent and document everything.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 2: Consistent Errors and OpenAPI Docs

**Time: about 1.5 hours**

### Concept

Right now a `404` returns `{"detail": "Task 5 not found"}` but a `422` returns `{"detail": [ ...a list... ]}`, so clients must special-case each. A good API uses **one error format everywhere**, with a stable `code` for programs and a `message` for humans:

```json
{"error": {"code": "not_found", "message": "Task 5 not found", "fields": null}}
```

FastAPI also publishes an **OpenAPI** description of your API at `/openapi.json`. It powers the docs at `/docs` and `/redoc`, and other tools use it to generate client libraries, mock servers, and tests. The more you describe (summaries, tags, error responses), the more useful it is.

### Where you'd actually use this

A frontend developer writes one error handler that shows `message` and highlights each item in `fields`. A partner team opens `/docs` and starts building without a meeting.

### Lab

1. **Create `app/errors.py`:**
```python
import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("tasks_api")

ERROR_CODES = {
    400: "bad_request",
    401: "unauthorized",
    403: "forbidden",
    404: "not_found",
    405: "method_not_allowed",
    409: "conflict",
    422: "validation_error",
    429: "rate_limited",
}


class ErrorDetail(BaseModel):
    code: str
    message: str
    fields: list[dict] | None = None


class ErrorResponse(BaseModel):
    error: ErrorDetail


def error_json(status_code: int, message: str, fields=None, headers=None) -> JSONResponse:
    code = ERROR_CODES.get(status_code, "server_error" if status_code >= 500 else "error")
    body = ErrorResponse(error=ErrorDetail(code=code, message=message, fields=fields))
    return JSONResponse(status_code=status_code, content=body.model_dump(), headers=headers)


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(StarletteHTTPException)
    async def http_error(request: Request, exc: StarletteHTTPException):
        return error_json(exc.status_code, str(exc.detail), headers=exc.headers)

    @app.exception_handler(RequestValidationError)
    async def validation_error(request: Request, exc: RequestValidationError):
        fields = [
            {"field": ".".join(str(part) for part in err["loc"]), "problem": err["msg"]}
            for err in exc.errors()
        ]
        return error_json(422, "The request data is invalid", fields=fields)

    @app.exception_handler(Exception)
    async def unexpected_error(request: Request, exc: Exception):
        logger.exception("Unexpected error on %s %s", request.method, request.url.path)
        return error_json(500, "Something went wrong on our side")
```
Handling Starlette's `HTTPException` (which FastAPI's extends) also covers the `404` and `405` for unknown URLs and methods.

2. **Wire it into `app/main.py`.** If you have the Backend course's `unexpected_error` handler, delete it (the new file replaces it). Add the import `from app.errors import ErrorResponse, register_error_handlers`, then replace the `app = FastAPI(...)` and `include_router` lines with:
```python
app = FastAPI(
    title=APP_NAME,
    version="1.0.0",
    description="A small task API built in the Backend and APIs for Builders courses.",
    lifespan=lifespan,
)
register_error_handlers(app)
app.include_router(
    tasks.router,
    prefix="/v1",
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
)
```
`responses=` documents what these endpoints return when things go wrong.

3. **Check the errors:**
```bash
curl http://localhost:8000/v1/tasks/999
curl -X POST http://localhost:8000/v1/tasks -H "Content-Type: application/json" -d '{"title": ""}'
curl "http://localhost:8000/v1/tasks?limit=0"
curl -X DELETE http://localhost:8000/v1/tasks
```
All four now share the `{"error": {"code": ..., "message": ..., "fields": ...}}` shape, with `fields` listing each invalid input.

4. **Explore the docs** at `http://localhost:8000/docs`: endpoints are grouped by tag, the list endpoint shows your summary and parameter descriptions, and each endpoint lists its `404` and `422` responses. `/openapi.json` is the raw contract tools consume.

5. **Add a test** to `tests/test_api.py`:
```python
def test_errors_share_one_shape(client):
    missing = client.get("/v1/tasks/999").json()
    assert missing["error"]["code"] == "not_found"

    invalid = client.post("/v1/tasks", json={"title": ""}).json()
    assert invalid["error"]["code"] == "validation_error"
    assert invalid["error"]["fields"][0]["field"] == "body.title"
```

### Checkpoint
Every error, including unknown URLs and validation failures, uses the same shape, and `/docs` documents it.

### Quiz
1. Why is one consistent error format better for clients?
2. Why include both a `code` and a `message`?
3. What is `/openapi.json`, and what can tools do with it?
4. Why handle Starlette's `HTTPException` rather than only FastAPI's?

*Answers: 1) Clients handle every error with one piece of code instead of special-casing each endpoint. 2) Programs branch on the stable `code`; people read the `message`, which you can reword without breaking clients. 3) The machine-readable OpenAPI description of the API, used to render docs and generate client libraries, mock servers, and tests. 4) FastAPI raises Starlette's version for unknown routes and wrong methods, so this also covers those `404` and `405` responses.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "warning",
   "kicker": "Module 2 · Errors and docs",
   "title": "One error shape, clear docs",
   "beats": [
    {
     "say": "Welcome to Module 2."
    },
    {
     "say": "Right now, different errors come back in different shapes, so every client has to special-case each one."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Two errors, two shapes. Then one.",
   "columns": [
    "Request",
    "Status",
    "Body"
   ],
   "rows": [
    [
     "GET /v1/tasks/999",
     "404",
     "{\"detail\": \"Task 999 not found\"}"
    ],
    [
     "POST /v1/tasks {\"title\": \"\"}",
     "422",
     "{\"detail\": [ ...a list... ]}"
    ],
    [
     "Any error, after this module",
     "4xx / 5xx",
     "{\"error\": {\"code\", \"message\", \"fields\"}}"
    ]
   ],
   "beats": [
    {
     "say": "Here's the problem. A missing task comes back with detail as a sentence.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "But invalid input comes back with detail as a list. Clients have to handle each one differently.",
     "hl": 1,
     "col": 2
    },
    {
     "say": "The fix is one shape everywhere: an error object with a code, a message, and fields.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "The code is stable, for programs to check. The message is for people, and you can reword it any time.",
     "hl": 2,
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 1",
   "title": "error_json builds every error",
   "file": "app/errors.py",
   "code": "ERROR_CODES = {\n    401: \"unauthorized\",\n    404: \"not_found\",\n    405: \"method_not_allowed\",\n    422: \"validation_error\",\n    # ...plus 400, 403, 409 and 429\n}\n\ndef error_json(status_code, message, fields=None, headers=None):\n    code = ERROR_CODES.get(status_code, \"server_error\" if status_code >= 500 else \"error\")\n    body = ErrorResponse(error=ErrorDetail(code=code, message=message, fields=fields))\n    return JSONResponse(status_code=status_code, content=body.model_dump(), headers=headers)",
   "beats": [
    {
     "say": "Every handler calls one function, error J S O N. Let's send it a four oh four.",
     "line": 9,
     "vars": {
      "status_code": 404,
      "message": "\"Task 999 not found\"",
      "fields": "None"
     }
    },
    {
     "say": "It looks up four oh four in the table of codes, and finds not found.",
     "line": [
      3,
      10
     ],
     "vars": {
      "status_code": 404,
      "message": "\"Task 999 not found\"",
      "code": "\"not_found\""
     }
    },
    {
     "say": "It wraps the code, message and fields in the error shape.",
     "line": 11
    },
    {
     "say": "And returns it with the same status, four oh four.",
     "line": 12,
     "out": "404 {\"error\": {\"code\": \"not_found\", \"message\": \"Task 999 not found\", \"fields\": null}}"
    },
    {
     "say": "Now a crash nobody planned for: status five hundred.",
     "line": 9,
     "vars": {
      "status_code": 500,
      "message": "\"Something went wrong on our side\"",
      "fields": "None"
     }
    },
    {
     "say": "Five hundred isn't in the table, and it's five hundred or more, so the code becomes server error.",
     "line": 10,
     "vars": {
      "status_code": 500,
      "message": "\"Something went wrong on our side\"",
      "code": "\"server_error\""
     }
    },
    {
     "say": "Same shape again. The client never has to guess.",
     "line": [
      11,
      12
     ],
     "out": "500 {\"error\": {\"code\": \"server_error\", \"message\": \"Something went wrong on our side\", \"fields\": null}}"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 3",
   "title": "Four bad requests, one shape back",
   "nodes": [
    {
     "id": "cli",
     "label": "curl",
     "x": 10,
     "y": 50,
     "sub": "client",
     "art": "terminal"
    },
    {
     "id": "app",
     "label": "Tasks API",
     "x": 42,
     "y": 50,
     "sub": "/v1 router",
     "art": "server"
    },
    {
     "id": "http",
     "label": "http_error",
     "x": 82,
     "y": 22,
     "sub": "404, 405 ...",
     "art": "warning"
    },
    {
     "id": "val",
     "label": "validation_error",
     "x": 82,
     "y": 78,
     "sub": "422",
     "art": "form"
    }
   ],
   "edges": [
    {
     "from": "cli",
     "to": "app"
    },
    {
     "from": "app",
     "to": "http"
    },
    {
     "from": "app",
     "to": "val"
    }
   ],
   "beats": [
    {
     "say": "Two handlers catch errors before they reach the client.",
     "on": [
      "http",
      "val"
     ]
    },
    {
     "say": "First, GET slash v one slash tasks slash nine nine nine.",
     "on": "cli",
     "send": {
      "from": "cli",
      "to": "app",
      "label": "GET /v1/tasks/999"
     }
    },
    {
     "say": "There's no task nine nine nine, so the route raises a four oh four, and the H T T P error handler catches it.",
     "on": "http",
     "send": {
      "from": "app",
      "to": "http",
      "label": "404 · Task 999 not found"
     }
    },
    {
     "say": "Back comes code not found.",
     "on": "cli",
     "send": {
      "from": "app",
      "to": "cli",
      "label": "404 · {\"error\": {\"code\": \"not_found\", ...}}"
     }
    },
    {
     "say": "Second, POST a task with an empty title.",
     "on": "cli",
     "send": {
      "from": "cli",
      "to": "app",
      "label": "POST /v1/tasks {\"title\": \"\"}"
     }
    },
    {
     "say": "FastAPI rejects it before your code runs, and the validation handler lists the bad field.",
     "on": "val",
     "send": {
      "from": "app",
      "to": "val",
      "label": "body.title too short"
     }
    },
    {
     "say": "Back comes four twenty two, validation error, with fields filled in.",
     "on": "cli",
     "send": {
      "from": "app",
      "to": "cli",
      "label": "422 · {\"error\": {\"code\": \"validation_error\", \"fields\": [...]}}"
     }
    },
    {
     "say": "Limit zero goes the same way. And DELETE on the whole list, a method that route doesn't allow, comes back four oh five, in the same shape.",
     "on": [
      "http",
      "val"
     ],
     "send": {
      "from": "app",
      "to": "cli",
      "label": "422 validation_error · 405 method_not_allowed"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 3",
   "title": "What each one returned",
   "columns": [
    "Request",
    "Status",
    "code",
    "fields"
   ],
   "rows": [
    [
     "GET /v1/tasks/999",
     "404",
     "not_found",
     "null"
    ],
    [
     "POST /v1/tasks {\"title\": \"\"}",
     "422",
     "validation_error",
     "body.title: String should have at least 1 character"
    ],
    [
     "GET /v1/tasks?limit=0",
     "422",
     "validation_error",
     "query.limit: Input should be greater than or equal to 1"
    ],
    [
     "DELETE /v1/tasks",
     "405",
     "method_not_allowed",
     "null"
    ]
   ],
   "beats": [
    {
     "say": "Side by side, every response has the same three keys."
    },
    {
     "say": "A program can branch on the code column alone.",
     "col": 2
    },
    {
     "say": "Fields tells a form exactly which input to highlight. Body dot title for the empty title.",
     "hl": 1,
     "col": 3
    },
    {
     "say": "And query dot limit for the limit of zero.",
     "hl": 2,
     "col": 3
    },
    {
     "say": "Errors that aren't about one input simply have no fields.",
     "hl": [
      0,
      3
     ],
     "dim": true,
     "col": 3
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 4",
   "title": "One description, many uses: OpenAPI",
   "nodes": [
    {
     "id": "app",
     "label": "Your FastAPI app",
     "x": 12,
     "y": 50,
     "sub": "routes, schemas, summaries",
     "art": "code"
    },
    {
     "id": "spec",
     "label": "/openapi.json",
     "x": 46,
     "y": 50,
     "sub": "the contract",
     "art": "doc"
    },
    {
     "id": "docs",
     "label": "/docs",
     "x": 84,
     "y": 18,
     "sub": "interactive docs",
     "art": "browser"
    },
    {
     "id": "redoc",
     "label": "/redoc",
     "x": 84,
     "y": 50,
     "sub": "readable docs",
     "art": "book"
    },
    {
     "id": "tools",
     "label": "Tools",
     "x": 84,
     "y": 82,
     "sub": "clients, mocks, tests",
     "art": "gear"
    }
   ],
   "edges": [
    {
     "from": "app",
     "to": "spec"
    },
    {
     "from": "spec",
     "to": "docs"
    },
    {
     "from": "spec",
     "to": "redoc"
    },
    {
     "from": "spec",
     "to": "tools"
    }
   ],
   "beats": [
    {
     "say": "FastAPI reads your routes and schemas, and writes a machine-readable description of your A P I.",
     "show": 2,
     "send": {
      "from": "app",
      "to": "spec",
      "label": "tags · summaries · 404 and 422 responses"
     }
    },
    {
     "say": "That's slash open A P I dot J S O N. It's the raw contract.",
     "show": 2,
     "on": "spec"
    },
    {
     "say": "Slash docs turns it into interactive pages, grouped by tag, listing each endpoint's errors.",
     "show": 3,
     "on": "docs",
     "send": {
      "from": "spec",
      "to": "docs",
      "label": "render"
     }
    },
    {
     "say": "Slash redoc renders the same file as readable reference docs.",
     "show": 4,
     "on": "redoc",
     "send": {
      "from": "spec",
      "to": "redoc",
      "label": "render"
     }
    },
    {
     "say": "And other tools use it to generate client libraries, mock servers, and tests.",
     "show": 5,
     "on": "tools",
     "send": {
      "from": "spec",
      "to": "tools",
      "label": "generate"
     }
    },
    {
     "say": "The more you describe, the more useful all of these become.",
     "show": 5,
     "on": [
      "app",
      "spec"
     ]
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why include both a code and a message?",
   "options": [
    "To make errors longer",
    "Programs branch on the stable code; people read the message",
    "One is for errors, one for warnings"
   ],
   "answer": 1,
   "good": "That's right. Programs rely on the stable code, and people read the message, which you can reword freely.",
   "bad": "Not quite. Programs rely on the stable code, and people read the message, which you can reword freely.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why include both a code and a message?",
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
     "Every error uses the same shape",
     ""
    ],
    [
     "/docs documents it",
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
     "say": "every error, even unknown addresses, uses the same shape,",
     "show": 1
    },
    {
     "say": "and slash docs documents it.",
     "show": 2
    },
    {
     "say": "Next, in Module 3, you call other people's A P I s safely.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 3: Calling Third-Party APIs Safely

**Time: about 2 hours**

### Concept

Sooner or later your backend calls someone else's API: payments, email, maps, an AI model. Plan for failure:

- **Timeouts.** Without one, a slow service can hang your request forever.
- **Retries, carefully.** Retry only failures that might succeed next time (timeouts, network errors, `429`, `5xx`), never `400` or `404`. Only retry requests that are safe to repeat, like `GET`; retrying a payment `POST` could charge twice.
- **Backoff.** Wait longer after each failure (0.5s, 1s, 2s) plus some randomness ("jitter"), so clients don't all retry at the same instant.
- **Rate limits.** Most APIs cap requests per minute and answer `429 Too Many Requests` when you exceed it, often with a `Retry-After` header (seconds to wait). Many send headers like `X-RateLimit-Remaining`. Respect them and cache results you reuse.
- **Keys** come from environment variables, never from code.

**httpx** is a modern Python HTTP client with built-in timeouts and a mock transport for testing offline.

### Where you'd actually use this

A checkout calling a payment provider, a dashboard pulling from GitHub, an app calling an AI model. Each must survive the other service being slow, down, or busy.

### Lab

1. **Create `app/external.py`** (httpx comes with `fastapi[standard]`; otherwise `pip install httpx`):
```python
import logging
import random
import time

import httpx

logger = logging.getLogger("tasks_api.external")

RETRY_STATUSES = {429, 500, 502, 503, 504}


def make_client() -> httpx.Client:
    return httpx.Client(
        timeout=httpx.Timeout(5.0, connect=2.0),  # never wait forever
        headers={"User-Agent": "tasks-api/1.0"},
    )


def wait_time(attempt: int, response: httpx.Response | None) -> float:
    # If the server says how long to wait (Retry-After: 2), respect it
    if response is not None and response.headers.get("Retry-After", "").isdigit():
        return min(int(response.headers["Retry-After"]), 30)
    # Otherwise back off exponentially (0.5s, 1s, 2s...) plus a little randomness
    return min(0.5 * 2 ** (attempt - 1), 8) + random.uniform(0, 0.25)


def get_json(client: httpx.Client, url: str, params: dict | None = None, max_attempts: int = 4):
    """GET a URL and return its JSON, retrying timeouts, 429s, and 5xx errors."""
    for attempt in range(1, max_attempts + 1):
        response = None
        try:
            response = client.get(url, params=params)
            if response.status_code not in RETRY_STATUSES:
                response.raise_for_status()  # other 4xx errors: our mistake, don't retry
                return response.json()
            problem = f"HTTP {response.status_code}"
        except (httpx.TimeoutException, httpx.NetworkError) as exc:
            problem = type(exc).__name__

        if attempt == max_attempts:
            raise RuntimeError(f"Gave up on {url} after {attempt} attempts ({problem})")
        delay = wait_time(attempt, response)
        logger.warning("%s from %s, retrying in %.1fs", problem, url, delay)
        time.sleep(delay)
```

2. **Test it against a fake server.** `httpx.MockTransport` decides what the "server" answers, no network needed. Save as `try_retries.py` in the project folder and run `python try_retries.py`:
```python
import logging

import httpx

from app.external import get_json

logging.basicConfig(level=logging.INFO)

# A fake server: fails once, asks us to slow down once, then succeeds
replies = [
    httpx.Response(503),
    httpx.Response(429, headers={"Retry-After": "1"}),
    httpx.Response(200, json={"quote": "Make it work, then make it good."}),
]


def fake_server(request: httpx.Request) -> httpx.Response:
    print("Fake server got:", request.method, request.url)
    return replies.pop(0)


client = httpx.Client(transport=httpx.MockTransport(fake_server))
print(get_json(client, "https://api.example.com/quote"))

# A 404 is not retried: it fails straight away
client = httpx.Client(transport=httpx.MockTransport(lambda request: httpx.Response(404)))
try:
    get_json(client, "https://api.example.com/missing")
except httpx.HTTPStatusError as exc:
    print("No retry for:", exc.response.status_code)
```
You'll see three requests for the quote (the second retry waiting the 1 second the server asked for), and a single attempt for the `404`.

3. **Call a real API** (needs internet). GitHub's public API allows about 60 requests an hour without a key:
```python
from app.external import get_json, make_client

with make_client() as client:
    repo = get_json(client, "https://api.github.com/repos/fastapi/fastapi")
    print(repo["full_name"], "has", repo["stargazers_count"], "stars")

    response = client.get("https://api.github.com/rate_limit")
    print("Requests left this hour:", response.headers.get("X-RateLimit-Remaining"))
```

### Checkpoint
You can show, with the fake server, that your client retries a `503` and a `429` (honoring `Retry-After`) and refuses to retry a `404`.

### Quiz
1. Why must every outbound request have a timeout?
2. Why retry a `503` but not a `404`?
3. Why is retrying a `POST` that charges a card dangerous?
4. What does a `Retry-After` header tell you?
5. What does adding random "jitter" to backoff prevent?

*Answers: 1) Otherwise a slow or stuck service can hang your request, and your users' requests, indefinitely. 2) A `503` is temporary and may recover; a `404` will fail the same way every time. 3) If the first attempt succeeded but the response was lost, a retry could charge the customer twice. 4) How long the server wants you to wait before trying again, usually in seconds. 5) Many clients retrying at the same moments and overloading the recovering service again.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "plug",
   "kicker": "Module 3 · Calling third-party APIs",
   "title": "Plan for other services failing",
   "beats": [
    {
     "say": "Welcome to Module 3."
    },
    {
     "say": "Sooner or later your backend calls someone else's A P I: payments, email, maps, an A I model."
    },
    {
     "say": "Those services are sometimes slow, down, or busy. Your app has to survive that."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Retry it, or not?",
   "columns": [
    "What happened",
    "Retry?",
    "Why"
   ],
   "rows": [
    [
     "Timeout or network error",
     "Yes",
     "Might work next time"
    ],
    [
     "429 Too Many Requests",
     "Yes, after Retry-After",
     "You were too fast"
    ],
    [
     "500, 502, 503, 504",
     "Yes",
     "Their problem, often temporary"
    ],
    [
     "400 Bad Request",
     "No",
     "Our mistake: same every time"
    ],
    [
     "404 Not Found",
     "No",
     "It still won't be there"
    ],
    [
     "A payment POST",
     "No",
     "Could charge twice"
    ]
   ],
   "beats": [
    {
     "say": "Every outbound call needs a timeout, so a slow service can't hang your request forever."
    },
    {
     "say": "Then decide what to retry. Timeouts and network errors might succeed next time.",
     "hl": 0
    },
    {
     "say": "Four twenty nine means slow down. Wait as long as the Retry After header says, then try again.",
     "hl": 1
    },
    {
     "say": "Five hundred errors are the other side's problem, and often clear up.",
     "hl": 2
    },
    {
     "say": "But a four hundred or four oh four will fail exactly the same way every time. Don't retry.",
     "hl": [
      3,
      4
     ],
     "dim": true
    },
    {
     "say": "And only retry requests that are safe to repeat, like GET.",
     "hl": 5,
     "dim": true
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Careful",
   "title": "Why a payment POST is never retried blindly",
   "nodes": [
    {
     "id": "api",
     "label": "Your API",
     "x": 14,
     "y": 50,
     "sub": "checkout",
     "art": "server"
    },
    {
     "id": "pay",
     "label": "Payment provider",
     "x": 84,
     "y": 50,
     "sub": "charges the card",
     "art": "coin"
    }
   ],
   "edges": [
    {
     "from": "api",
     "to": "pay"
    }
   ],
   "beats": [
    {
     "say": "Your checkout asks a payment provider to charge a card.",
     "on": "api",
     "send": {
      "from": "api",
      "to": "pay",
      "label": "POST charge"
     }
    },
    {
     "say": "The provider charges it successfully.",
     "on": "pay"
    },
    {
     "say": "But the reply is lost on the way back, and your request times out.",
     "on": "api",
     "send": {
      "from": "pay",
      "to": "api",
      "label": "200 charged … lost"
     }
    },
    {
     "say": "If your code blindly retries,",
     "on": "api",
     "send": {
      "from": "api",
      "to": "pay",
      "label": "POST charge (again)"
     }
    },
    {
     "say": "the customer is charged twice. That's why get J S O N only ever retries GET requests.",
     "on": "pay"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Concept · Backoff",
   "title": "Wait longer after each failure",
   "values": [
    "0.5s",
    "1s",
    "2s",
    "4s",
    "8s"
   ],
   "beats": [
    {
     "say": "When you do retry, don't hammer the service. Wait longer each time."
    },
    {
     "say": "After the first failure, wait half a second.",
     "hl": 0,
     "ptr": {
      "attempt 1": 0
     },
     "note": "0.5 × 2^(attempt − 1)"
    },
    {
     "say": "After the second, one second. After the third, two.",
     "ok": [
      0
     ],
     "hl": [
      1,
      2
     ],
     "ptr": {
      "2": 1,
      "3": 2
     }
    },
    {
     "say": "The wait keeps doubling, but wait time caps it at eight seconds.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": [
      3,
      4
     ],
     "note": "min(..., 8)"
    },
    {
     "say": "Each wait also gets up to a quarter second of randomness, called jitter, so clients don't all retry at the same instant.",
     "ok": [
      0,
      1,
      2
     ],
     "note": "+ random.uniform(0, 0.25)"
    },
    {
     "say": "With the default of four attempts, there are at most three waits.",
     "ok": [
      0,
      1,
      2
     ],
     "gone": [
      3,
      4
     ],
     "note": "max_attempts = 4 → 3 waits at most"
    },
    {
     "say": "And if the server sends a Retry After header, that number wins instead, up to thirty seconds.",
     "ok": [
      0,
      1,
      2
     ],
     "gone": [
      3,
      4
     ],
     "note": "Retry-After: 2 → wait 2s"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 2",
   "title": "get_json against a fake server: 503, 429, then 200",
   "file": "app/external.py",
   "code": "for attempt in range(1, max_attempts + 1):\n    response = None\n    try:\n        response = client.get(url, params=params)\n        if response.status_code not in RETRY_STATUSES:\n            response.raise_for_status()  # other 4xx: our mistake\n            return response.json()\n        problem = f\"HTTP {response.status_code}\"\n    except (httpx.TimeoutException, httpx.NetworkError) as exc:\n        problem = type(exc).__name__\n    if attempt == max_attempts:\n        raise RuntimeError(f\"Gave up on {url} after {attempt} attempts ({problem})\")\n    delay = wait_time(attempt, response)\n    time.sleep(delay)",
   "beats": [
    {
     "say": "The fake server will fail once, ask us to slow down once, then succeed.",
     "vars": {
      "url": "\"https://api.example.com/quote\"",
      "max_attempts": 4
     }
    },
    {
     "say": "Attempt one. The request goes out.",
     "line": [
      1,
      4
     ],
     "vars": {
      "attempt": 1
     },
     "out": "Fake server got: GET https://api.example.com/quote"
    },
    {
     "say": "Five oh three is a retry status, so note the problem.",
     "line": [
      5,
      8
     ],
     "vars": {
      "attempt": 1,
      "status": 503,
      "problem": "\"HTTP 503\""
     }
    },
    {
     "say": "It isn't the last attempt. With no Retry After header, wait about half a second.",
     "line": [
      11,
      13,
      14
     ],
     "vars": {
      "attempt": 1,
      "problem": "\"HTTP 503\"",
      "delay": "0.5 + jitter"
     }
    },
    {
     "say": "Attempt two. This time, four twenty nine, with Retry After one.",
     "line": [
      1,
      4,
      5,
      8
     ],
     "vars": {
      "attempt": 2,
      "status": 429,
      "problem": "\"HTTP 429\""
     },
     "out": "Fake server got: GET https://api.example.com/quote"
    },
    {
     "say": "The server told us how long to wait, so we wait exactly one second.",
     "line": [
      13,
      14
     ],
     "vars": {
      "attempt": 2,
      "problem": "\"HTTP 429\"",
      "delay": 1
     }
    },
    {
     "say": "Attempt three. Two hundred is not a retry status.",
     "line": [
      1,
      4,
      5
     ],
     "vars": {
      "attempt": 3,
      "status": 200
     },
     "out": "Fake server got: GET https://api.example.com/quote"
    },
    {
     "say": "Raise for status finds nothing wrong, so we return the J S O N.",
     "line": [
      6,
      7
     ],
     "out": "{'quote': 'Make it work, then make it good.'}"
    },
    {
     "say": "Now a server that answers four oh four. It isn't a retry status, so raise for status throws on the first attempt.",
     "line": [
      4,
      5,
      6
     ],
     "vars": {
      "url": "\"https://api.example.com/missing\"",
      "attempt": 1,
      "status": 404
     },
     "out": [
      "Fake server got: GET https://api.example.com/missing",
      "No retry for: 404"
     ]
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 3",
   "title": "A real API tells you your rate limit",
   "nodes": [
    {
     "id": "app",
     "label": "Your script",
     "x": 14,
     "y": 50,
     "sub": "make_client()",
     "art": "laptop"
    },
    {
     "id": "gh",
     "label": "GitHub API",
     "x": 84,
     "y": 50,
     "sub": "about 60 / hour without a key",
     "art": "globe"
    }
   ],
   "edges": [
    {
     "from": "app",
     "to": "gh"
    }
   ],
   "beats": [
    {
     "say": "Now a real A P I. GitHub allows about sixty requests an hour without a key.",
     "on": "gh"
    },
    {
     "say": "Get J S O N asks for the FastAPI repository.",
     "on": "app",
     "send": {
      "from": "app",
      "to": "gh",
      "label": "GET /repos/fastapi/fastapi"
     }
    },
    {
     "say": "It comes back with its full name and its star count.",
     "on": "app",
     "send": {
      "from": "gh",
      "to": "app",
      "label": "200 · {\"full_name\": \"fastapi/fastapi\", \"stargazers_count\": …}"
     }
    },
    {
     "say": "Then ask the rate limit endpoint.",
     "on": "app",
     "send": {
      "from": "app",
      "to": "gh",
      "label": "GET /rate_limit"
     }
    },
    {
     "say": "The X rate limit remaining header says how many requests you have left this hour.",
     "on": "app",
     "send": {
      "from": "gh",
      "to": "app",
      "label": "X-RateLimit-Remaining: 59"
     }
    },
    {
     "say": "Respect it, cache results you reuse, and keep any keys in environment variables, never in code.",
     "on": [
      "app",
      "gh"
     ]
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why retry a 503 but not a 404?",
   "options": [
    "503 is a smaller number",
    "A 503 is temporary and may recover; a 404 fails the same way every time",
    "404s are retried by the browser"
   ],
   "answer": 1,
   "good": "That's right. A five oh three is temporary and may recover. A four oh four will fail the same way every time.",
   "bad": "Not quite. A five oh three is temporary and may recover. A four oh four will fail the same way every time.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why retry a five oh three, but not a four oh four?",
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
     "Retries a 503 and a 429 (honouring Retry-After)",
     ""
    ],
    [
     "Refuses to retry a 404",
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
     "say": "you can show, with the fake server, that your client retries a five oh three and a four twenty nine,",
     "show": 1
    },
    {
     "say": "and refuses to retry a four oh four.",
     "show": 2
    },
    {
     "say": "Next, in Module 4, you add user accounts safely.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 4: Authentication Fundamentals and Password Hashing

**Time: about 1.5 hours**

### Concept

**Authentication** answers "who is this?" **Authorization** answers "what are they allowed to do?" A logged-in user (authenticated) still mustn't read someone else's tasks (not authorized). `401` means "we don't know who you are"; `403` means "we know, but you can't do this".

Two common ways to keep someone logged in:

| | Sessions | Tokens (such as JWT, Module 5) |
|---|---|---|
| What the client holds | A random session ID, usually in a cookie | A signed token, usually sent in an `Authorization: Bearer` header |
| What the server stores | A session record for every logged-in user | Nothing per user: it checks the signature |
| Logging out | Delete the session record; takes effect at once | The token stays valid until it expires, so keep lifetimes short |
| Good fit | Traditional websites on one domain | APIs, mobile apps, several servers |

Either way, **never store passwords**. Store a **hash**, the output of a one-way function, so a stolen database doesn't reveal them. Use a password-hashing algorithm such as **Argon2**: it's deliberately slow and adds a random **salt** to each hash, so attackers can't test billions of guesses quickly or spot users with the same password. **pwdlib** is a maintained Python library that uses Argon2 by default.

### Where you'd actually use this

Every product with accounts. Database leaks happen even at large companies; hashing keeps a leak from exposing every password.

### Lab

1. **Install pwdlib and try it:**
```bash
pip install "pwdlib[argon2]"
```
```python
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()
stored = password_hash.hash("correct horse battery staple")
print(stored)                                                      # $argon2id$v=19$m=65536,t=3,p=4$...
print(password_hash.verify("correct horse battery staple", stored))  # True
print(password_hash.verify("wrong guess", stored))                 # False
print(password_hash.hash("correct horse battery staple") == stored)  # False: a new random salt each time
```

2. **Add a `User` model.** In `app/models.py`, add above `Task`:
```python
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(320), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
```

3. **Add user schemas** to `app/schemas.py`. `UserOut` has no password field, so a hash can't leak into a response (`Token` is used in Module 5):
```python
class UserCreate(BaseModel):
    email: str = Field(max_length=320, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str = Field(min_length=8, max_length=128)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
```

4. **Create `app/security.py`** with one line for now:
```python
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()  # Argon2, a slow-on-purpose hash
```

5. **Create a registration endpoint** in `app/routers/auth.py`:
```python
from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.database import SessionDep
from app.models import User
from app.schemas import UserCreate, UserOut
from app.security import password_hash

router = APIRouter(tags=["auth"])


@router.post("/users", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, db: SessionDep):
    email = data.email.lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status.HTTP_409_CONFLICT, detail="That email is already registered")
    user = User(email=email, password_hash=password_hash.hash(data.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
```
In `app/main.py`, change the import to `from app.routers import auth, tasks` and add `app.include_router(auth.router, prefix="/v1")` next to the tasks router.

6. **Register twice, then look at the database:**
```bash
curl -X POST http://localhost:8000/v1/users -H "Content-Type: application/json" -d '{"email": "ada@example.com", "password": "correct-horse-battery"}'
curl -X POST http://localhost:8000/v1/users -H "Content-Type: application/json" -d '{"email": "ada@example.com", "password": "correct-horse-battery"}'
python -c "import sqlite3; print(sqlite3.connect('tasks.db').execute('select * from users').fetchall())"
```
The first returns `201`, the second `409`, and the database holds an Argon2 hash, not the password.

### Checkpoint
You can explain authentication versus authorization and sessions versus tokens, and your API stores Argon2-hashed passwords.

### Quiz
1. What question does authentication answer? What question does authorization answer?
2. What's a downside of session-based login when you run several servers?
3. Why store a password hash instead of the password?
4. Why is a deliberately slow hash like Argon2 better than a fast one like plain SHA-256 for passwords?
5. Hashing the same password twice gives different results. How can `verify` still work?

*Answers: 1) Authentication: who are you. Authorization: what are you allowed to do. 2) Every server needs the same shared session store, adding infrastructure and a lookup on every request. 3) If the database leaks, attackers get hashes they can't reverse instead of working passwords. 4) Slowness limits how many guesses per second an attacker can test against stolen hashes. 5) The salt and settings are stored inside the hash string, so `verify` re-hashes the attempt with the same salt and compares.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "lock",
   "kicker": "Module 4 · Authentication basics",
   "title": "Accounts, done safely",
   "beats": [
    {
     "say": "Welcome to Module 4."
    },
    {
     "say": "Today your A P I gets user accounts, with passwords stored the right way."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Who are you? What may you do?",
   "columns": [
    "",
    "Question",
    "When it fails"
   ],
   "rows": [
    [
     "Authentication",
     "Who is this?",
     "401: we don't know who you are"
    ],
    [
     "Authorization",
     "What are they allowed to do?",
     "403: we know you, but you can't do this"
    ]
   ],
   "beats": [
    {
     "say": "Two words that sound alike, and mean different things."
    },
    {
     "say": "Authentication asks: who is this? If the A P I can't tell, it answers four oh one.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Authorization asks: what are they allowed to do? Logged in, but not allowed, is four oh three.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "A logged-in user is authenticated, but still mustn't read someone else's tasks.",
     "col": 1
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Two ways to stay logged in",
   "columns": [
    "",
    "Sessions",
    "Tokens (JWT)"
   ],
   "rows": [
    [
     "Client holds",
     "A random session ID, in a cookie",
     "A signed token, in Authorization: Bearer"
    ],
    [
     "Server stores",
     "A record per logged-in user",
     "Nothing per user: checks the signature"
    ],
    [
     "Logging out",
     "Delete the record: instant",
     "Valid until it expires: keep it short"
    ],
    [
     "Good fit",
     "Websites on one domain",
     "APIs, mobile apps, several servers"
    ]
   ],
   "beats": [
    {
     "say": "After login, the client needs a way to prove it's still you. There are two common ways."
    },
    {
     "say": "With sessions, the client holds a random i d, and the server keeps a record for every logged-in user.",
     "hl": [
      0,
      1
     ],
     "col": 1
    },
    {
     "say": "With tokens, the client holds a signed token, and the server stores nothing. It just checks the signature.",
     "hl": [
      0,
      1
     ],
     "col": 2
    },
    {
     "say": "The trade-off: deleting a session logs you out at once, but a token works until it expires.",
     "hl": 2
    },
    {
     "say": "So sessions suit a website on one domain, and tokens suit A P I s, mobile apps, and many servers.",
     "hl": 3
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 1",
   "title": "Hash, verify, and see the salt",
   "file": "try_pwdlib.py",
   "code": "from pwdlib import PasswordHash\n\npassword_hash = PasswordHash.recommended()\nstored = password_hash.hash(\"correct horse battery staple\")\nprint(stored)\nprint(password_hash.verify(\"correct horse battery staple\", stored))\nprint(password_hash.verify(\"wrong guess\", stored))\nprint(password_hash.hash(\"correct horse battery staple\") == stored)",
   "beats": [
    {
     "say": "Never store passwords. Store a hash: the output of a one-way function. pwdlib uses Argon two by default.",
     "line": [
      1,
      3
     ]
    },
    {
     "say": "Hash the password. Out comes a long string that starts with argon two i d.",
     "line": [
      4,
      5
     ],
     "vars": {
      "stored": "$argon2id$v=19$m=65536,t=3,p=4$..."
     },
     "out": "$argon2id$v=19$m=65536,t=3,p=4$..."
    },
    {
     "say": "Verify with the right password: True.",
     "line": 6,
     "out": "True"
    },
    {
     "say": "Verify with a wrong guess: False.",
     "line": 7,
     "out": "False"
    },
    {
     "say": "Now hash the same password again. It doesn't match the first hash.",
     "line": 8,
     "out": "False"
    },
    {
     "say": "That's the random salt. Each hash is different, so attackers can't spot two users with the same password.",
     "line": 8
    },
    {
     "say": "Verify still works, because the salt and settings are stored inside the hash string itself.",
     "line": [
      5,
      6
     ]
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 5 and 6",
   "title": "Register a user, twice",
   "nodes": [
    {
     "id": "cli",
     "label": "curl",
     "x": 12,
     "y": 50,
     "sub": "client",
     "art": "terminal"
    },
    {
     "id": "api",
     "label": "POST /v1/users",
     "x": 50,
     "y": 50,
     "sub": "register",
     "art": "server"
    },
    {
     "id": "db",
     "label": "users table",
     "x": 88,
     "y": 50,
     "sub": "SQLite",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "cli",
     "to": "api"
    },
    {
     "from": "api",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "Ada registers with an email and a password.",
     "on": "cli",
     "send": {
      "from": "cli",
      "to": "api",
      "label": "{\"email\": \"ada@example.com\", \"password\": \"correct-horse-battery\"}"
     }
    },
    {
     "say": "First, the server checks whether that email is already taken.",
     "on": "api",
     "send": {
      "from": "api",
      "to": "db",
      "label": "SELECT … WHERE email = 'ada@example.com'"
     }
    },
    {
     "say": "It isn't.",
     "on": "db",
     "send": {
      "from": "db",
      "to": "api",
      "label": "no row"
     }
    },
    {
     "say": "So it hashes the password, and stores only the hash.",
     "on": "api",
     "send": {
      "from": "api",
      "to": "db",
      "label": "INSERT ada@example.com, $argon2id$..."
     }
    },
    {
     "say": "The reply is two oh one, with the i d and email. User Out has no password field, so the hash can't leak.",
     "on": "cli",
     "send": {
      "from": "api",
      "to": "cli",
      "label": "201 · {\"id\": 1, \"email\": \"ada@example.com\"}"
     }
    },
    {
     "say": "Run the same request again, and the email check finds Ada's row.",
     "on": "db",
     "send": {
      "from": "db",
      "to": "api",
      "label": "row found"
     }
    },
    {
     "say": "So the answer is four oh nine, conflict, in our usual error shape.",
     "on": "cli",
     "send": {
      "from": "api",
      "to": "cli",
      "label": "409 · {\"error\": {\"code\": \"conflict\", \"message\": \"That email is already registered\"}}"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 6",
   "title": "What's actually in the database",
   "columns": [
    "id",
    "email",
    "password_hash"
   ],
   "rows": [
    [
     "1",
     "ada@example.com",
     "$argon2id$v=19$m=65536,t=3,p=4$..."
    ]
   ],
   "beats": [
    {
     "say": "Now look inside the users table."
    },
    {
     "say": "There's Ada's email.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "And where you might expect her password, there's only the Argon two hash.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "If this database ever leaks, attackers get hashes they can't reverse, not working passwords.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "And because Argon two is slow on purpose, they can't test billions of guesses quickly.",
     "col": 2
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why is a slow hash like Argon2 better than a fast one for passwords?",
   "options": [
    "It saves database space",
    "Slowness limits how many guesses an attacker can test per second",
    "Fast hashes can't be verified"
   ],
   "answer": 1,
   "good": "That's right. Slowness limits how many guesses per second an attacker can try against stolen hashes.",
   "bad": "Not quite. Slowness limits how many guesses per second an attacker can try against stolen hashes.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why is a slow hash like Argon two better than a fast one for passwords?",
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
     "You can explain authN vs authZ, sessions vs tokens",
     ""
    ],
    [
     "Your API stores Argon2-hashed passwords",
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
     "say": "you can explain authentication versus authorization, and sessions versus tokens,",
     "show": 1
    },
    {
     "say": "and your A P I stores Argon two hashed passwords.",
     "show": 2
    },
    {
     "say": "Next, in Module 5, users log in and get a token.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 5: JWT Login and Protected Endpoints

**Time: about 2 hours**

### Concept

A **JWT** (JSON Web Token) is a compact, signed piece of text carrying **claims** about a user, such as their ID (`sub`) and expiry time (`exp`). It has three dot-separated parts: header, payload, and signature. Because it's signed with a key only your server knows, the server can trust the payload without storing or looking anything up.

The client logs in once with email and password, gets a JWT, and sends it on every later request as `Authorization: Bearer <token>`. Two rules: the payload is **encoded, not encrypted**, so anyone holding the token can read it (no secrets in it); and keep lifetimes short, because a stolen token works until it expires.

### Where you'd actually use this

APIs that run on several servers without a shared session store, mobile apps, and single-page web apps that call your API directly.

### Lab

1. **Install PyJWT and set a secret key.** PyJWT is imported as `jwt`:
```bash
pip install pyjwt
python3 -c "import secrets; print(secrets.token_hex(32))"
```
Add the value to your `.env` file as `JWT_SECRET_KEY=<the printed value>` (create `.env` if needed; `.gitignore` must list it). From now on, start the server with `uvicorn app.main:app --reload --env-file .env`.

2. **Add the settings** to the bottom of `app/config.py`:
```python
# Required: the app refuses to start without it, so you can't forget it
JWT_SECRET_KEY = os.environ["JWT_SECRET_KEY"]
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = int(os.getenv("ACCESS_TOKEN_MINUTES", "30"))
```

3. **Replace `app/security.py`:**
```python
from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash

from app.config import ACCESS_TOKEN_MINUTES, JWT_ALGORITHM, JWT_SECRET_KEY
from app.database import SessionDep
from app.models import User

password_hash = PasswordHash.recommended()  # Argon2, a slow-on-purpose hash
bearer_scheme = HTTPBearer(auto_error=False)


def create_access_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES),
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def get_current_user(
    db: SessionDep,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> User:
    unauthorized = HTTPException(
        status.HTTP_401_UNAUTHORIZED,
        detail="Missing, invalid, or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None:
        raise unauthorized
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except jwt.InvalidTokenError:  # bad signature, malformed, or expired
        raise unauthorized
    user = db.get(User, int(payload["sub"]))
    if user is None:
        raise unauthorized
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
```
`algorithms=[...]` stops an attacker choosing a weaker algorithm for you. Any route with a `CurrentUser` parameter now requires a valid token.

4. **Add login and "who am I" endpoints** to `app/routers/auth.py`. Update its imports:
```python
from app.schemas import Token, UserCreate, UserOut
from app.security import CurrentUser, create_access_token, password_hash
```
and add at the bottom:
```python
@router.post("/auth/token", response_model=Token)
def log_in(data: UserCreate, db: SessionDep):
    user = db.scalar(select(User).where(User.email == data.email.lower()))
    if user is None or not password_hash.verify(data.password, user.password_hash):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail="Wrong email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return Token(access_token=create_access_token(user.id))


@router.get("/users/me", response_model=UserOut)
def read_me(user: CurrentUser):
    return user
```
The error doesn't say which of the two was wrong, so attackers can't use it to discover registered emails.

5. **Give every task an owner (authorization).** In `app/models.py`, change the first import to `from sqlalchemy import ForeignKey, String` and add this column to `Task`:
```python
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
```
Then update `app/routers/tasks.py`. Change the models import to `from app.models import Task, User`, add `from app.security import CurrentUser`, and replace `get_task_or_404` with:
```python
def get_task_or_404(db: Session, task_id: int, user: User) -> Task:
    task = db.get(Task, task_id)
    # Someone else's task gets the same 404 as a missing one, so ids don't leak
    if task is None or task.owner_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=f"Task {task_id} not found")
    return task
```
Then make four edits in the same file:
- Add a `user: CurrentUser` parameter to all five routes (for example `def get_task(task_id: int, db: SessionDep, user: CurrentUser):`; in `list_tasks`, right after `db: SessionDep,`)
- Change every `get_task_or_404(db, task_id)` call to `get_task_or_404(db, task_id, user)`
- In `list_tasks`, start with `query = select(Task).where(Task.owner_id == user.id)`
- In `create_task`, use `task = Task(**data.model_dump(), owner_id=user.id)`

`create_all` only creates missing tables; it doesn't add columns. Stop the server, delete `tasks.db`, and restart. (Real projects use a migration tool such as Alembic to change tables without losing data.)

6. **Try the whole flow:**
```bash
curl -X POST http://localhost:8000/v1/users -H "Content-Type: application/json" -d '{"email": "ada@example.com", "password": "correct-horse-battery"}'
TOKEN=$(curl -s -X POST http://localhost:8000/v1/auth/token -H "Content-Type: application/json" -d '{"email": "ada@example.com", "password": "correct-horse-battery"}' | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")
curl -i http://localhost:8000/v1/tasks
curl -X POST http://localhost:8000/v1/tasks -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"title": "My private task"}'
curl http://localhost:8000/v1/users/me -H "Authorization: Bearer $TOKEN"
```
Without a token you get `401`. In `/docs`, the "Authorize" button lets you paste a token. Paste your test token into [jwt.io](https://jwt.io) (never a real one): the payload is readable, because the signature prevents tampering, not reading.

7. **Update the tests.** Add to the top of `tests/conftest.py`, before the other imports, so the app can start:
```python
import os

os.environ.setdefault("JWT_SECRET_KEY", "test-only-secret-that-is-at-least-32-bytes-long")
```
and add a logged-in client fixture at the bottom:
```python
@pytest.fixture
def auth_client(client):
    """A client that is already logged in as a test user."""
    user = {"email": "ada@example.com", "password": "correct-horse-battery"}
    client.post("/v1/users", json=user)
    token = client.post("/v1/auth/token", json=user).json()["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"
    return client
```
In `tests/test_api.py`, replace every `client` with `auth_client` (find-and-replace works), since tasks now need a login. Then create `tests/test_auth.py`:
```python
def test_tasks_need_a_token(client):
    response = client.get("/v1/tasks")
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "unauthorized"


def test_users_only_see_their_own_tasks(auth_client):
    task_id = auth_client.post("/v1/tasks", json={"title": "Private"}).json()["id"]

    bob = {"email": "bob@example.com", "password": "another-password"}
    auth_client.post("/v1/users", json=bob)
    token = auth_client.post("/v1/auth/token", json=bob).json()["access_token"]
    as_bob = {"Authorization": f"Bearer {token}"}  # overrides the default header for one request

    assert auth_client.get(f"/v1/tasks/{task_id}", headers=as_bob).status_code == 404
    assert auth_client.get("/v1/tasks", headers=as_bob).json()["total"] == 0
```
Run `python -m pytest`; everything should pass.

**Your turn:** Add a test that logging in with a wrong password returns `401`, and that `/v1/users/me` returns the logged-in user's email.

### Checkpoint
Users log in for a JWT, every task endpoint requires it, and a test proves one user can't see another's tasks.

### Quiz
1. What are the three parts of a JWT?
2. Is a JWT's payload encrypted or just encoded, and what follows from that?
3. Why does a JWT avoid the shared session store from Module 4?
4. Why does another user's task return `404` instead of `403`?
5. What happens when a request arrives with a token whose `exp` time has passed?

*Answers: 1) Header, payload, and signature. 2) Just encoded, so anyone can read it; never put secrets in it. 3) Any server with the secret key can verify the signature on its own, without a lookup. 4) A `403` would confirm the task exists; `404` reveals nothing about other users' data. 5) `jwt.decode` raises `ExpiredSignatureError` (a kind of `InvalidTokenError`), so the API answers `401`.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "key",
   "kicker": "Module 5 · JWT login",
   "title": "Log in once, prove it every time",
   "beats": [
    {
     "say": "Welcome to Module 5."
    },
    {
     "say": "Users log in once, get a token, and send it with every request."
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Concept",
   "title": "A JWT is three parts, joined by dots",
   "values": [
    "header",
    "payload",
    "signature"
   ],
   "beats": [
    {
     "say": "A J W T, a J S O N web token, is three pieces of text joined by dots."
    },
    {
     "say": "The header says how it was signed.",
     "hl": 0,
     "note": "{\"alg\": \"HS256\", \"typ\": \"JWT\"}"
    },
    {
     "say": "The payload carries claims: sub, the user's i d, and exp, when it expires.",
     "hl": 1,
     "note": "{\"sub\": \"1\", \"exp\": now + 30 minutes}"
    },
    {
     "say": "The signature is made with a secret key only your server knows.",
     "hl": 2,
     "note": "signed with JWT_SECRET_KEY"
    },
    {
     "say": "Change one letter of the payload, and the signature no longer matches. So the server can trust it without storing anything.",
     "hl": [
      1,
      2
     ],
     "note": "tampered payload → signature check fails → 401"
    },
    {
     "say": "But the payload is only encoded, not encrypted. Anyone holding the token can read it, so never put secrets in it.",
     "hl": 1,
     "note": "encoded ≠ encrypted"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 4 and 6",
   "title": "Log in, then send the token every time",
   "nodes": [
    {
     "id": "cli",
     "label": "Client",
     "x": 12,
     "y": 50,
     "sub": "curl or an app",
     "art": "laptop"
    },
    {
     "id": "api",
     "label": "Tasks API",
     "x": 50,
     "y": 50,
     "sub": "/v1/auth/token",
     "art": "server"
    },
    {
     "id": "db",
     "label": "users table",
     "x": 88,
     "y": 50,
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "cli",
     "to": "api"
    },
    {
     "from": "api",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "Ada logs in with her email and password.",
     "on": "cli",
     "send": {
      "from": "cli",
      "to": "api",
      "label": "POST /v1/auth/token {\"email\": \"ada@example.com\", \"password\": …}"
     }
    },
    {
     "say": "The server finds her row by email.",
     "on": "db",
     "send": {
      "from": "api",
      "to": "db",
      "label": "SELECT … WHERE email = 'ada@example.com'"
     }
    },
    {
     "say": "Verify checks the password against the stored hash. It matches.",
     "on": "api",
     "send": {
      "from": "db",
      "to": "api",
      "label": "id 1 · $argon2id$..."
     }
    },
    {
     "say": "So the server signs a token for user one, valid for thirty minutes.",
     "on": "cli",
     "send": {
      "from": "api",
      "to": "cli",
      "label": "200 · {\"access_token\": \"eyJhbGciOiJIUzI1NiIs…\", \"token_type\": \"bearer\"}"
     }
    },
    {
     "say": "From now on, every request carries it in the Authorization header.",
     "on": "cli",
     "send": {
      "from": "cli",
      "to": "api",
      "label": "GET /v1/users/me · Authorization: Bearer eyJ…"
     }
    },
    {
     "say": "The server checks the signature, reads sub, one, and fetches that user.",
     "on": "api",
     "send": {
      "from": "api",
      "to": "db",
      "label": "get User 1"
     }
    },
    {
     "say": "And answers with who you are.",
     "on": "cli",
     "send": {
      "from": "api",
      "to": "cli",
      "label": "200 · {\"id\": 1, \"email\": \"ada@example.com\"}"
     }
    },
    {
     "say": "A wrong email or password gets one message for both, so attackers can't use it to find registered emails.",
     "on": "api",
     "send": {
      "from": "api",
      "to": "cli",
      "label": "401 · \"Wrong email or password\""
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 3",
   "title": "get_current_user guards every task route",
   "file": "app/security.py",
   "code": "if credentials is None:\n    raise unauthorized\ntry:\n    payload = jwt.decode(credentials.credentials, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])\nexcept jwt.InvalidTokenError:  # bad signature, malformed, or expired\n    raise unauthorized\nuser = db.get(User, int(payload[\"sub\"]))\nif user is None:\n    raise unauthorized\nreturn user",
   "beats": [
    {
     "say": "Every task route now depends on get current user. Let's send it three requests."
    },
    {
     "say": "First, GET slash v one slash tasks, with no Authorization header. Credentials is None.",
     "line": 1,
     "vars": {
      "credentials": "None"
     }
    },
    {
     "say": "So it raises unauthorized, and the client gets four oh one.",
     "line": 2,
     "out": "401 {\"error\": {\"code\": \"unauthorized\", \"message\": \"Missing, invalid, or expired token\", \"fields\": null}}"
    },
    {
     "say": "Second, a token whose expiry time has passed.",
     "line": [
      3,
      4
     ],
     "vars": {
      "credentials": "Bearer eyJ… (expired)"
     }
    },
    {
     "say": "Decode raises an expired signature error, a kind of invalid token error. Four oh one again.",
     "line": [
      5,
      6
     ],
     "out": "401 {\"error\": {\"code\": \"unauthorized\", \"message\": \"Missing, invalid, or expired token\", \"fields\": null}}"
    },
    {
     "say": "Third, Ada's fresh token. The signature checks out, and the payload says sub, one.",
     "line": 4,
     "vars": {
      "credentials": "Bearer eyJ…",
      "payload": "{\"sub\": \"1\", \"exp\": …}"
     }
    },
    {
     "say": "Look up user one. She exists.",
     "line": [
      7,
      8
     ],
     "vars": {
      "payload": "{\"sub\": \"1\", \"exp\": …}",
      "user": "User(id=1, email='ada@example.com')"
     }
    },
    {
     "say": "So the route runs, with Ada as the current user.",
     "line": 10,
     "out": "200 → the route runs as Ada"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 5",
   "title": "Bob asks for Ada's task",
   "nodes": [
    {
     "id": "bob",
     "label": "Bob",
     "x": 12,
     "y": 50,
     "sub": "his own token",
     "art": "persona"
    },
    {
     "id": "api",
     "label": "Tasks API",
     "x": 50,
     "y": 50,
     "sub": "get_task_or_404",
     "art": "server"
    },
    {
     "id": "db",
     "label": "tasks table",
     "x": 88,
     "y": 50,
     "sub": "task 1 · owner_id 1",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "bob",
     "to": "api"
    },
    {
     "from": "api",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "Ada created task one, called Private. Its owner i d is one. Bob is user two.",
     "on": "db"
    },
    {
     "say": "Bob asks for task one, with his own valid token.",
     "on": "bob",
     "send": {
      "from": "bob",
      "to": "api",
      "label": "GET /v1/tasks/1 · Bearer (Bob)"
     }
    },
    {
     "say": "The server loads task one.",
     "on": "api",
     "send": {
      "from": "api",
      "to": "db",
      "label": "get Task 1"
     }
    },
    {
     "say": "The task exists, but its owner is one, not two.",
     "on": "api",
     "send": {
      "from": "db",
      "to": "api",
      "label": "owner_id = 1"
     }
    },
    {
     "say": "So Bob gets exactly the same four oh four as a task that doesn't exist.",
     "on": "bob",
     "send": {
      "from": "api",
      "to": "bob",
      "label": "404 · {\"error\": {\"code\": \"not_found\", \"message\": \"Task 1 not found\"}}"
     }
    },
    {
     "say": "And when Bob lists tasks, the query only keeps rows where owner i d is two.",
     "on": "api",
     "send": {
      "from": "api",
      "to": "db",
      "label": "WHERE owner_id = 2"
     }
    },
    {
     "say": "There are none, so his total is zero.",
     "on": "bob",
     "send": {
      "from": "api",
      "to": "bob",
      "label": "200 · {\"items\": [], \"total\": 0, ...}"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 7",
   "title": "Why 404, not 403",
   "columns": [
    "Request",
    "As Ada",
    "As Bob"
   ],
   "rows": [
    [
     "GET /v1/tasks/1",
     "200 · Private",
     "404 · not_found"
    ],
    [
     "GET /v1/tasks/999",
     "404 · not_found",
     "404 · not_found"
    ],
    [
     "GET /v1/tasks",
     "total: 1",
     "total: 0"
    ],
    [
     "Any of these, no token",
     "401",
     "401"
    ]
   ],
   "beats": [
    {
     "say": "Here's what the test proves, side by side."
    },
    {
     "say": "Ada can read her task. Bob gets four oh four.",
     "hl": 0
    },
    {
     "say": "And for Bob, task one looks exactly like task nine nine nine, which doesn't exist at all.",
     "hl": [
      0,
      1
     ],
     "col": 2
    },
    {
     "say": "A four oh three would confirm the task exists. A four oh four reveals nothing about other people's data.",
     "hl": [
      0,
      1
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "Lists only show your own tasks, and with no token at all, everything is four oh one.",
     "hl": [
      2,
      3
     ]
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Is a JWT's payload encrypted?",
   "options": [
    "Yes, nobody can read it",
    "No, it's only encoded, so never put secrets in it",
    "Only the user ID is encrypted"
   ],
   "answer": 1,
   "good": "That's right. It's only encoded, so anyone can read it. Never put secrets in it.",
   "bad": "Not quite. It's only encoded, so anyone can read it. Never put secrets in it.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Is a J W T's payload encrypted?",
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
     "Login returns a JWT; task endpoints require it",
     ""
    ],
    [
     "A test proves users only see their own tasks",
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
     "say": "users log in for a J W T and every task endpoint requires it,",
     "show": 1
    },
    {
     "say": "and a test proves one user can't see another's tasks.",
     "show": 2
    },
    {
     "say": "Next, in Module 6, you try GraphQL.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 6: GraphQL - Asking for Exactly What You Need

**Time: about 2 hours**

### Concept

**GraphQL** exposes a single endpoint. Instead of the server deciding what each URL returns, the client sends a **query** naming exactly the fields it wants, including nested data. This avoids **over-fetching** (getting more data than you need) and **under-fetching** (needing several requests for one screen). REST, to show a task with its owner's email, might need two calls (the second is a typical `GET /users/{id}` endpoint, hypothetical here, since our API only exposes `/v1/users/me`):
```
GET /v1/tasks/5    -> { "id": 5, "title": "...", "owner_id": 3, ... }
GET /v1/users/3    -> { "id": 3, "email": "ada@example.com" }
```
GraphQL gets exactly this in one request:
```graphql
query {
  task(id: 5) {
    title
    owner {
      email
    }
  }
}
```
A GraphQL API has a typed **schema**. **Queries** read and **mutations** change data. Each field is filled by a **resolver** function that runs only if the query asks for that field. Errors usually come back with status `200` and an `errors` list, so clients check the body. Instead of `/v1`-style versions, the schema evolves by adding fields and deprecating old ones.

### Where you'd actually use this

Apps with nested data and several frontends that each want different slices; GitHub and Shopify offer GraphQL APIs for this reason. For a simple app with one client, REST is usually simpler.

### Lab

1. **Install Strawberry**, a GraphQL library that uses type hints like FastAPI (the quotes stop zsh misreading the brackets):
```bash
pip install "strawberry-graphql[fastapi]"
```

2. **Create `app/graphql_api.py`.** It reuses your database session and your JWT check:
```python
from typing import Annotated

import strawberry
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy import select
from strawberry.fastapi import GraphQLRouter
from strawberry.types import Info

from app import models
from app.database import SessionDep
from app.security import bearer_scheme, get_current_user


@strawberry.type
class Owner:
    id: int
    email: str


@strawberry.type
class Task:
    id: int
    title: str
    notes: str | None
    done: bool
    owner_id: strawberry.Private[int]  # used by our code, hidden from the schema

    @strawberry.field
    def owner(self, info: Info) -> Owner:
        # Only runs when a query actually asks for owner { ... }
        user = info.context["db"].get(models.User, self.owner_id)
        return Owner(id=user.id, email=user.email)


def logged_in_user(info: Info) -> models.User:
    user = info.context["user"]
    if user is None:
        raise PermissionError("Log in first: send an Authorization: Bearer <token> header")
    return user


def to_graphql(task: models.Task) -> Task:
    return Task(id=task.id, title=task.title, notes=task.notes, done=task.done, owner_id=task.owner_id)


@strawberry.type
class Query:
    @strawberry.field
    def tasks(self, info: Info, done: bool | None = None) -> list[Task]:
        user = logged_in_user(info)
        query = select(models.Task).where(models.Task.owner_id == user.id).order_by(models.Task.id)
        if done is not None:
            query = query.where(models.Task.done == done)
        return [to_graphql(t) for t in info.context["db"].scalars(query)]

    @strawberry.field
    def task(self, info: Info, id: int) -> Task | None:
        task = info.context["db"].get(models.Task, id)
        if task is None or task.owner_id != logged_in_user(info).id:
            return None
        return to_graphql(task)


@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_task(self, info: Info, title: str, notes: str | None = None) -> Task:
        if not 1 <= len(title) <= 200:
            raise ValueError("title must be 1 to 200 characters")
        db = info.context["db"]
        task = models.Task(title=title, notes=notes, owner_id=logged_in_user(info).id)
        db.add(task)
        db.commit()
        db.refresh(task)
        return to_graphql(task)


async def get_context(
    db: SessionDep,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> dict:
    # No token: user is None, so the GraphiQL page still loads and resolvers say "log in first".
    # A bad token: get_current_user raises a 401, just like the REST endpoints.
    user = get_current_user(db, credentials) if credentials else None
    return {"db": db, "user": user}


schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_router = GraphQLRouter(schema, context_getter=get_context)
```
Strawberry exposes `create_task` as `createTask`, following GraphQL naming style.

3. **Mount it.** In `app/main.py`, add `from app.graphql_api import graphql_router` and, below `register_error_handlers(app)`:
```python
app.include_router(graphql_router, prefix="/graphql", include_in_schema=False)
```
GraphQL documents itself, so it's left out of the REST docs.

4. **Explore it** at `http://localhost:8000/graphql`, the GraphiQL explorer. In its headers panel add `{"Authorization": "Bearer <your token>"}` (a token from Module 5), then run:
```graphql
mutation {
  createTask(title: "Try GraphQL") { id title }
}
```
```graphql
query {
  tasks(done: false) {
    title
    owner { email }
  }
}
```
Remove `owner { email }` and run it again: the owner resolver doesn't run at all.

5. **Add a test** to `tests/test_api.py`:
```python
def test_graphql_tasks_with_owner(auth_client):
    created = auth_client.post(
        "/graphql",
        json={"query": 'mutation { createTask(title: "Try GraphQL") { id title done } }'},
    ).json()
    assert created["data"]["createTask"]["title"] == "Try GraphQL"

    query = "query { tasks(done: false) { title owner { email } } }"
    data = auth_client.post("/graphql", json={"query": query}).json()["data"]
    assert data == {"tasks": [{"title": "Try GraphQL", "owner": {"email": "ada@example.com"}}]}
```

### Checkpoint
You fetched tasks with their owner's email in one GraphQL request, created a task with a mutation, and can say how many REST calls that would take.

### Quiz
1. What problem does over-fetching describe?
2. What problem does under-fetching describe?
3. How many endpoints does a typical GraphQL API expose, and who decides which fields come back?
4. What is a resolver, and when does the `owner` resolver run?
5. Would GraphQL help a simple app with one screen and one data shape? Why or why not?

*Answers: 1) Getting more data than the client needs. 2) Needing several requests to assemble one screen's data. 3) Typically one; the client decides through its query. 4) A function that produces one field's value; `owner`'s runs only when a query asks for `owner`. 5) Not much: GraphQL shines when different clients need different shapes of data.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "graph",
   "kicker": "Module 6 · GraphQL",
   "title": "Ask for exactly what you need",
   "beats": [
    {
     "say": "Welcome to Module 6."
    },
    {
     "say": "GraphQL has one endpoint. The client sends a query naming exactly the fields it wants."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "One screen: a task and its owner's email",
   "nodes": [
    {
     "id": "app",
     "label": "Your screen",
     "x": 12,
     "y": 50,
     "sub": "needs title + email",
     "art": "phone"
    },
    {
     "id": "rest",
     "label": "REST",
     "x": 70,
     "y": 22,
     "sub": "/v1/tasks, /v1/users",
     "art": "server"
    },
    {
     "id": "gql",
     "label": "GraphQL",
     "x": 70,
     "y": 78,
     "sub": "POST /graphql",
     "art": "graph"
    }
   ],
   "edges": [
    {
     "from": "app",
     "to": "rest"
    },
    {
     "from": "app",
     "to": "gql"
    }
   ],
   "beats": [
    {
     "say": "A screen wants to show task five, and its owner's email.",
     "show": 1,
     "on": "app"
    },
    {
     "say": "With REST, first ask for the task.",
     "show": 2,
     "on": "rest",
     "send": {
      "from": "app",
      "to": "rest",
      "label": "GET /v1/tasks/5"
     }
    },
    {
     "say": "It returns every task field, and only an owner i d.",
     "show": 2,
     "on": "app",
     "send": {
      "from": "rest",
      "to": "app",
      "label": "{\"id\": 5, \"title\": \"...\", \"owner_id\": 3, ...}"
     }
    },
    {
     "say": "So you need a second request for the user.",
     "show": 2,
     "on": "rest",
     "send": {
      "from": "app",
      "to": "rest",
      "label": "GET /v1/users/3"
     }
    },
    {
     "say": "Two round trips for one screen.",
     "show": 2,
     "on": "app",
     "send": {
      "from": "rest",
      "to": "app",
      "label": "{\"id\": 3, \"email\": \"ada@example.com\"}"
     }
    },
    {
     "say": "With GraphQL, one request names exactly the fields you want, nested.",
     "show": 3,
     "on": "gql",
     "send": {
      "from": "app",
      "to": "gql",
      "label": "task(id: 5) { title owner { email } }"
     }
    },
    {
     "say": "And one response comes back, in the same shape you asked for.",
     "show": 3,
     "on": "app",
     "send": {
      "from": "gql",
      "to": "app",
      "label": "{\"data\": {\"task\": {\"title\": \"...\", \"owner\": {\"email\": \"ada@example.com\"}}}}"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Over-fetching and under-fetching",
   "columns": [
    "Field",
    "GET /v1/tasks/5 sends",
    "The screen needs"
   ],
   "rows": [
    [
     "id",
     "✓",
     ""
    ],
    [
     "title",
     "✓",
     "✓"
    ],
    [
     "notes",
     "✓",
     ""
    ],
    [
     "done",
     "✓",
     ""
    ],
    [
     "owner_id",
     "✓",
     ""
    ],
    [
     "owner email",
     "✗ needs a 2nd call",
     "✓"
    ]
   ],
   "beats": [
    {
     "say": "Compare what REST sent with what the screen actually needed."
    },
    {
     "say": "Over-fetching: i d, notes, done and owner i d all came back, and the screen uses none of them.",
     "hl": [
      0,
      2,
      3,
      4
     ],
     "dim": true,
     "col": 1
    },
    {
     "say": "Under-fetching: the one thing it did need, the email, wasn't there, so it took a second request.",
     "hl": 5,
     "dim": true,
     "col": 2
    },
    {
     "say": "A GraphQL query asks for just title and owner email. Nothing more, nothing less.",
     "hl": [
      1,
      5
     ],
     "dim": true,
     "sql": "task(id: 5) { title owner { email } }"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 4",
   "title": "Resolvers run only for the fields you ask for",
   "nodes": [
    {
     "id": "cli",
     "label": "GraphiQL",
     "x": 10,
     "y": 50,
     "sub": "Bearer token",
     "art": "browser"
    },
    {
     "id": "tasks",
     "label": "Query.tasks",
     "x": 42,
     "y": 25,
     "sub": "resolver",
     "art": "code"
    },
    {
     "id": "owner",
     "label": "Task.owner",
     "x": 42,
     "y": 75,
     "sub": "resolver",
     "art": "code"
    },
    {
     "id": "db",
     "label": "Database",
     "x": 86,
     "y": 50,
     "sub": "tasks, users",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "cli",
     "to": "tasks"
    },
    {
     "from": "tasks",
     "to": "db"
    },
    {
     "from": "cli",
     "to": "owner"
    },
    {
     "from": "owner",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "Ada sends this query to slash graph Q L, with her token.",
     "on": "cli",
     "send": {
      "from": "cli",
      "to": "tasks",
      "label": "tasks(done: false) { title owner { email } }"
     }
    },
    {
     "say": "The tasks resolver loads only her unfinished tasks.",
     "on": "tasks",
     "send": {
      "from": "tasks",
      "to": "db",
      "label": "WHERE owner_id = 1 AND done = false"
     }
    },
    {
     "say": "The query asked for owner, so the owner resolver runs for each task.",
     "on": "owner",
     "send": {
      "from": "owner",
      "to": "db",
      "label": "get User 1"
     }
    },
    {
     "say": "The answer is shaped exactly like the question.",
     "on": "cli",
     "send": {
      "from": "owner",
      "to": "cli",
      "label": "{\"data\": {\"tasks\": [{\"title\": \"Try GraphQL\", \"owner\": {\"email\": \"ada@example.com\"}}]}}"
     }
    },
    {
     "say": "Now remove owner from the query and run it again.",
     "on": "cli",
     "send": {
      "from": "cli",
      "to": "tasks",
      "label": "tasks(done: false) { title }"
     }
    },
    {
     "say": "The owner resolver doesn't run at all. No user lookup happens.",
     "on": [
      "tasks",
      "db"
     ],
     "send": {
      "from": "tasks",
      "to": "cli",
      "label": "{\"data\": {\"tasks\": [{\"title\": \"Try GraphQL\"}]}}"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 2",
   "title": "A mutation creates a task",
   "file": "app/graphql_api.py",
   "code": "@strawberry.mutation\ndef create_task(self, info: Info, title: str, notes: str | None = None) -> Task:\n    if not 1 <= len(title) <= 200:\n        raise ValueError(\"title must be 1 to 200 characters\")\n    db = info.context[\"db\"]\n    task = models.Task(title=title, notes=notes, owner_id=logged_in_user(info).id)\n    db.add(task)\n    db.commit()\n    db.refresh(task)\n    return to_graphql(task)",
   "beats": [
    {
     "say": "Queries read data. Mutations change it. Strawberry exposes this function as create task, in camel case.",
     "line": [
      1,
      2
     ]
    },
    {
     "say": "Ada sends: create task, with title Try GraphQL.",
     "line": 2,
     "vars": {
      "title": "\"Try GraphQL\"",
      "notes": "None"
     }
    },
    {
     "say": "The title is eleven characters, between one and two hundred, so it passes.",
     "line": 3,
     "vars": {
      "title": "\"Try GraphQL\"",
      "len(title)": 11
     }
    },
    {
     "say": "Build a task owned by the logged-in user, Ada, user one.",
     "line": [
      5,
      6
     ],
     "vars": {
      "title": "\"Try GraphQL\"",
      "owner_id": 1
     }
    },
    {
     "say": "Save it, and refresh to get its new i d.",
     "line": [
      7,
      9
     ],
     "vars": {
      "title": "\"Try GraphQL\"",
      "owner_id": 1,
      "task.id": 1
     }
    },
    {
     "say": "Return it, and the client gets back only the fields it asked for.",
     "line": 10,
     "out": "200 {\"data\": {\"createTask\": {\"id\": 1, \"title\": \"Try GraphQL\", \"done\": false}}}"
    },
    {
     "say": "Now an empty title. Length zero fails the check, and it raises a value error.",
     "line": [
      3,
      4
     ],
     "vars": {
      "title": "\"\"",
      "len(title)": 0
     }
    },
    {
     "say": "Notice the status is still two hundred. GraphQL errors arrive in an errors list, so clients check the body.",
     "line": 4,
     "out": "200 {\"data\": null, \"errors\": [{\"message\": \"title must be 1 to 200 characters\", ...}]}"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "When to use it",
   "title": "REST or GraphQL?",
   "columns": [
    "",
    "REST",
    "GraphQL"
   ],
   "rows": [
    [
     "Endpoints",
     "Many URLs",
     "One: /graphql"
    ],
    [
     "Who picks the fields",
     "The server",
     "The client's query"
    ],
    [
     "Errors",
     "Status codes",
     "Usually 200 + an errors list"
    ],
    [
     "Changes",
     "/v1, /v2",
     "Add fields, deprecate old ones"
    ],
    [
     "Best for",
     "Simple app, one client",
     "Nested data, many different clients"
    ]
   ],
   "beats": [
    {
     "say": "So which should you use? Here's how they differ."
    },
    {
     "say": "REST has many addresses, and the server decides what each returns. GraphQL has one, and the client decides.",
     "hl": [
      0,
      1
     ]
    },
    {
     "say": "Errors and versions work differently too.",
     "hl": [
      2,
      3
     ]
    },
    {
     "say": "GraphQL shines with nested data and several frontends that each want different slices, which is why GitHub and Shopify offer it.",
     "hl": 4,
     "col": 2
    },
    {
     "say": "For a simple app with one client, REST is usually simpler.",
     "hl": 4,
     "col": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "When does the owner resolver run?",
   "options": [
    "On every request",
    "Only when the query asks for owner",
    "Once when the server starts"
   ],
   "answer": 1,
   "good": "That's right. A resolver only runs when the query asks for that field.",
   "bad": "Not quite. A resolver only runs when the query asks for that field.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "When does the owner resolver run?",
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
     "Tasks with owner emails in one request",
     ""
    ],
    [
     "You created a task with a mutation",
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
     "say": "you've fetched tasks with their owner's email in one GraphQL request,",
     "show": 1
    },
    {
     "say": "created a task with a mutation, and can say how many REST calls that would take.",
     "show": 2
    },
    {
     "say": "Next, in the last module, you add Sign in with Google.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 7: OAuth 2.0 and OpenID Connect: "Sign in with Google"

**Time: about 1.5 hours**

### Concept

**OAuth 2.0** lets a user grant one application limited access to their data on another service, without sharing their password with it. **OpenID Connect (OIDC)** adds a signed **ID token** saying *who* the user is. Together they power "Sign in with Google". The *authorization code flow*:

1. Your app redirects the user to Google's login page
2. The user logs in and approves your app's requested access (the **scopes**, such as `openid email profile`)
3. Google redirects back to your app with an **authorization code**
4. Your server exchanges that code for tokens: an **access token** (for calling Google's APIs) and an **ID token** (who the user is)
5. Your app logs the user in to *your* app, for example by finding or creating a `User` and issuing your own JWT from Module 5

Two safety details:
- **`state`**: a random value created in step 1 and checked in step 3, so an attacker can't slip their own code into your callback.
- **PKCE** (Proof Key for Code Exchange): in step 1 your app makes a one-time secret (the *verifier*) and sends only its SHA-256 hash (the *challenge*); in step 4 it sends the verifier. Google checks they match, so a stolen code is useless alone. PKCE is recommended for every client and essential for mobile and single-page apps, which can't keep a client secret.

In production, use a maintained library such as **Authlib**, which also verifies the ID token's signature. The code below shows the core steps.

### Where you'd actually use this

Any "Sign in with Google/GitHub/Apple" button, and any app acting on a user's behalf elsewhere, like reading their calendar, with revocable permission.

### Lab

1. **Trace the flow.** Click "Sign in with Google" on any website and watch the URL bar: a redirect to `accounts.google.com` with `client_id`, `redirect_uri`, `scope`, `state`, and often `code_challenge`, then a redirect back with `code` and `state`. That's steps 1 to 3.

2. **Build step 1: the login URL with `state` and PKCE.** This runs offline. Save it as `pkce_demo.py` and run `python pkce_demo.py`:
```python
import base64
import hashlib
import os
import secrets
from urllib.parse import urlencode

AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth"
REDIRECT_URI = "http://localhost:8000/auth/google/callback"


def make_pkce_pair() -> tuple[str, str]:
    verifier = secrets.token_urlsafe(64)  # the one-time secret your app keeps
    digest = hashlib.sha256(verifier.encode()).digest()
    challenge = base64.urlsafe_b64encode(digest).rstrip(b"=").decode()  # what Google sees first
    return verifier, challenge


state = secrets.token_urlsafe(32)
verifier, challenge = make_pkce_pair()

login_url = AUTHORIZE_URL + "?" + urlencode({
    "client_id": os.environ.get("GOOGLE_CLIENT_ID", "your-client-id"),
    "redirect_uri": REDIRECT_URI,
    "response_type": "code",
    "scope": "openid email profile",
    "state": state,
    "code_challenge": challenge,
    "code_challenge_method": "S256",
})

print("Save in the user's session -> state:", state)
print("Save in the user's session -> verifier:", verifier)
print("Send the user to:\n" + login_url)
```
Your app keeps `state` and `verifier` (for example in a short-lived signed cookie) until the user returns.

3. **Steps 4 and 5.** This needs an app registered in the Google Cloud console, which gives you a client ID and secret; set them as the environment variables `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Your callback route first checks the returned `state` matches the saved one, then calls:
```python
import os

import httpx

TOKEN_URL = "https://oauth2.googleapis.com/token"
USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"
REDIRECT_URI = "http://localhost:8000/auth/google/callback"


def exchange_code(code: str, verifier: str) -> dict:
    response = httpx.post(TOKEN_URL, timeout=10, data={
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": os.environ["GOOGLE_CLIENT_ID"],
        "client_secret": os.environ["GOOGLE_CLIENT_SECRET"],
        "code_verifier": verifier,  # proves we started this login
    })
    response.raise_for_status()
    return response.json()  # contains access_token and id_token


def get_profile(access_token: str) -> dict:
    response = httpx.get(
        USERINFO_URL,
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=10,
    )
    response.raise_for_status()
    return response.json()  # {"sub": "...", "email": "...", "name": "...", ...}
```
Step 5 is code you already know: find the `User` by Google's stable `sub` ID or email, create one if needed, and return `create_access_token(user.id)`, so the rest of your API works unchanged.

### Checkpoint
You watched a real "Sign in with Google" redirect, generated a login URL with `state` and PKCE, and can explain all five steps.

### Quiz
1. What problem does OAuth solve that "just ask the user for their Google password" would create?
2. What does your app receive from Google before it gets any tokens?
3. What does OpenID Connect add on top of OAuth 2.0?
4. What attack does PKCE stop, and how?
5. What is the `state` parameter checked for?

*Answers: 1) Your app would hold the user's real password, a major risk if it's compromised, with no way to limit or revoke access. 2) An authorization code, which your server exchanges for tokens. 3) A standard way to learn who the user is, through a signed ID token and a userinfo endpoint. 4) Use of a stolen authorization code: exchanging it requires the verifier only the original app holds, which Google checks against the earlier challenge. 5) That the callback belongs to a login this app started, blocking an attacker from injecting their own code.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "key",
   "kicker": "Module 7 · OAuth 2.0 and OpenID Connect",
   "title": "How \"Sign in with Google\" works",
   "beats": [
    {
     "say": "Welcome to the last module."
    },
    {
     "say": "OAuth lets a user give your app limited access to their data on another service, without ever sharing their password with you."
    },
    {
     "say": "OpenID Connect adds a signed I D token that says who the user is. Together, they power Sign in with Google."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "The authorization code flow, in five steps",
   "nodes": [
    {
     "id": "user",
     "label": "Browser",
     "x": 12,
     "y": 50,
     "sub": "the user",
     "art": "persona"
    },
    {
     "id": "app",
     "label": "Your app",
     "x": 50,
     "y": 20,
     "sub": "localhost:8000",
     "art": "server"
    },
    {
     "id": "login",
     "label": "Google login",
     "x": 50,
     "y": 82,
     "sub": "accounts.google.com",
     "art": "fingerprint"
    },
    {
     "id": "token",
     "label": "Google token",
     "x": 88,
     "y": 20,
     "sub": "oauth2.googleapis.com",
     "art": "key"
    },
    {
     "id": "info",
     "label": "Google userinfo",
     "x": 88,
     "y": 82,
     "sub": "openidconnect…",
     "art": "idcard"
    }
   ],
   "edges": [
    {
     "from": "user",
     "to": "app"
    },
    {
     "from": "user",
     "to": "login"
    },
    {
     "from": "app",
     "to": "token"
    },
    {
     "from": "app",
     "to": "info"
    }
   ],
   "beats": [
    {
     "say": "Step one. The user clicks Sign in with Google, and your app redirects them to Google's login page.",
     "show": 3,
     "on": "app",
     "send": {
      "from": "app",
      "to": "user",
      "label": "redirect → accounts.google.com/o/oauth2/v2/auth?…"
     }
    },
    {
     "say": "The address carries your client i d, the scopes you want, a state value, and a code challenge.",
     "show": 3,
     "on": "login",
     "send": {
      "from": "user",
      "to": "login",
      "label": "client_id · scope=openid email profile · state · code_challenge"
     }
    },
    {
     "say": "Step two. The user logs in to Google, and approves the access your app asked for. Your app never sees their password.",
     "show": 3,
     "on": "login"
    },
    {
     "say": "Step three. Google sends them back to your callback, with an authorization code and the same state.",
     "show": 3,
     "on": "user",
     "send": {
      "from": "login",
      "to": "user",
      "label": "redirect → /auth/google/callback?code=…&state=…"
     }
    },
    {
     "say": "The browser follows it to your app. Your app checks the state matches the one it saved.",
     "show": 3,
     "on": "app",
     "send": {
      "from": "user",
      "to": "app",
      "label": "GET /auth/google/callback?code=…&state=…"
     }
    },
    {
     "say": "Step four. Your server swaps the code for tokens, sending the P K C E verifier as proof.",
     "show": 4,
     "on": "token",
     "send": {
      "from": "app",
      "to": "token",
      "label": "POST /token · code + code_verifier"
     }
    },
    {
     "say": "Back come an access token, for calling Google's A P I s, and an I D token, saying who the user is.",
     "show": 4,
     "on": "app",
     "send": {
      "from": "token",
      "to": "app",
      "label": "access_token · id_token"
     }
    },
    {
     "say": "With the access token, your app can ask for the user's profile.",
     "show": 5,
     "on": "info",
     "send": {
      "from": "app",
      "to": "info",
      "label": "GET /v1/userinfo · Bearer access_token"
     }
    },
    {
     "say": "Google returns their stable sub i d, email, and name.",
     "show": 5,
     "on": "app",
     "send": {
      "from": "info",
      "to": "app",
      "label": "{\"sub\": \"…\", \"email\": \"…\", \"name\": \"…\"}"
     }
    },
    {
     "say": "Step five. Find or create that user, and log them in with your own J W T from Module 5.",
     "show": 5,
     "on": "user",
     "send": {
      "from": "app",
      "to": "user",
      "label": "your own JWT: create_access_token(user.id)"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 2",
   "title": "What's in the login URL",
   "columns": [
    "Parameter",
    "Value"
   ],
   "rows": [
    [
     "client_id",
     "your-client-id"
    ],
    [
     "redirect_uri",
     "http://localhost:8000/auth/google/callback"
    ],
    [
     "response_type",
     "code"
    ],
    [
     "scope",
     "openid email profile"
    ],
    [
     "state",
     "32 random bytes, URL-safe"
    ],
    [
     "code_challenge",
     "SHA-256 of the verifier"
    ],
    [
     "code_challenge_method",
     "S256"
    ]
   ],
   "beats": [
    {
     "say": "Here's every piece of the login address your app builds.",
     "sql": "https://accounts.google.com/o/oauth2/v2/auth?..."
    },
    {
     "say": "Client i d says which app is asking. Redirect U R I says where Google should send the user back.",
     "hl": [
      0,
      1
     ]
    },
    {
     "say": "Response type code asks for an authorization code, not tokens, in the browser.",
     "hl": 2
    },
    {
     "say": "Scope lists the access you want. Open I D, email and profile is enough to know who they are.",
     "hl": 3
    },
    {
     "say": "State is a random value your app saves and checks when the user returns.",
     "hl": 4,
     "dim": true
    },
    {
     "say": "And the code challenge is a hash of a secret your app keeps. S two five six names the hashing method.",
     "hl": [
      5,
      6
     ],
     "dim": true
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 2",
   "title": "Make state and a PKCE pair",
   "file": "pkce_demo.py",
   "code": "def make_pkce_pair() -> tuple[str, str]:\n    verifier = secrets.token_urlsafe(64)  # the one-time secret your app keeps\n    digest = hashlib.sha256(verifier.encode()).digest()\n    challenge = base64.urlsafe_b64encode(digest).rstrip(b\"=\").decode()  # what Google sees first\n    return verifier, challenge\n\nstate = secrets.token_urlsafe(32)\nverifier, challenge = make_pkce_pair()\n\nlogin_url = AUTHORIZE_URL + \"?\" + urlencode({...})\nprint(\"Save in the user's session -> state:\", state)\nprint(\"Save in the user's session -> verifier:\", verifier)\nprint(\"Send the user to:\\n\" + login_url)",
   "beats": [
    {
     "say": "This part runs offline. First, make the P K C E pair.",
     "line": [
      1,
      8
     ]
    },
    {
     "say": "The verifier is sixty four random bytes, written as eighty six U R L safe characters. Your app keeps it secret.",
     "line": 2,
     "vars": {
      "verifier": "86 random characters"
     }
    },
    {
     "say": "Hash it with S H A two five six.",
     "line": 3,
     "vars": {
      "verifier": "86 random characters",
      "digest": "32 bytes"
     }
    },
    {
     "say": "Then encode that hash as U R L safe text, and drop the padding. That's the challenge, forty three characters.",
     "line": 4,
     "vars": {
      "verifier": "86 random characters",
      "challenge": "43 characters"
     }
    },
    {
     "say": "Separately, state is another random value, also forty three characters.",
     "line": 7,
     "vars": {
      "state": "43 random characters",
      "verifier": "86 random characters",
      "challenge": "43 characters"
     }
    },
    {
     "say": "Only the challenge goes into the login U R L. Google can't work the verifier out from it.",
     "line": 10
    },
    {
     "say": "Your app saves state and the verifier, for example in a short-lived signed cookie, until the user comes back.",
     "line": [
      11,
      12
     ],
     "out": [
      "Save in the user's session -> state: …",
      "Save in the user's session -> verifier: …"
     ]
    },
    {
     "say": "And sends the user to the login U R L. Your values will be different every run.",
     "line": 13,
     "out": [
      "Send the user to:",
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=your-client-id&…"
     ]
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Two safety details",
   "title": "What state and PKCE stop",
   "nodes": [
    {
     "id": "bad",
     "label": "Attacker",
     "x": 14,
     "y": 50,
     "art": "bug"
    },
    {
     "id": "app",
     "label": "Your app",
     "x": 54,
     "y": 22,
     "sub": "/auth/google/callback",
     "art": "server"
    },
    {
     "id": "token",
     "label": "Google token",
     "x": 54,
     "y": 80,
     "sub": "checks the verifier",
     "art": "key"
    }
   ],
   "edges": [
    {
     "from": "bad",
     "to": "app"
    },
    {
     "from": "bad",
     "to": "token"
    },
    {
     "from": "app",
     "to": "token"
    }
   ],
   "beats": [
    {
     "say": "Two attacks, two defences."
    },
    {
     "say": "First, an attacker steals an authorization code and tries to swap it for tokens.",
     "on": "bad",
     "send": {
      "from": "bad",
      "to": "token",
      "label": "POST /token · stolen code, no verifier"
     }
    },
    {
     "say": "Google checks the verifier against the challenge from step one. The attacker doesn't have it, so the code is useless.",
     "on": "token",
     "send": {
      "from": "token",
      "to": "bad",
      "label": "400 · rejected"
     }
    },
    {
     "say": "Second, an attacker tries to slip their own code into your callback.",
     "on": "bad",
     "send": {
      "from": "bad",
      "to": "app",
      "label": "/auth/google/callback?code=theirs&state=wrong"
     }
    },
    {
     "say": "The state doesn't match the one your app saved for this login, so your app refuses it.",
     "on": "app"
    },
    {
     "say": "P K C E is recommended for every client, and essential for mobile and single page apps, which can't keep a client secret.",
     "on": [
      "app",
      "token"
     ]
    },
    {
     "say": "In production, use a maintained library such as Authlib, which also verifies the I D token's signature.",
     "on": "app"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What attack does PKCE stop?",
   "options": [
    "Guessing passwords",
    "Using a stolen authorization code",
    "Reading the ID token"
   ],
   "answer": 1,
   "good": "That's right. P K C E makes a stolen authorization code useless, because swapping it needs the secret only your app holds.",
   "bad": "Not quite. P K C E makes a stolen authorization code useless, because swapping it needs the secret only your app holds.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What attack does P K C E stop?",
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
     "You watched a real Sign in with Google redirect",
     ""
    ],
    [
     "You built a login link with state and PKCE",
     ""
    ],
    [
     "You can explain all five steps",
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
     "say": "you've watched a real Sign in with Google redirect,",
     "show": 1
    },
    {
     "say": "built a login link with state and P K C E,",
     "show": 2
    },
    {
     "say": "and can explain all five steps.",
     "show": 3
    },
    {
     "say": "You've finished APIs for Builders. Well done.",
     "show": 3
    }
   ]
  }
 ]
}
```
