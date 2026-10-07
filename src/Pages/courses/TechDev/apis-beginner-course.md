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

---

## Module 6: GraphQL - Asking for Exactly What You Need

**Time: about 2 hours**

### Concept

**GraphQL** exposes a single endpoint. Instead of the server deciding what each URL returns, the client sends a **query** naming exactly the fields it wants, including nested data. This avoids **over-fetching** (getting more data than you need) and **under-fetching** (needing several requests for one screen). REST, to show a task with its owner's email, might need two calls:
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
