# Databases for Builders: A Practical Beginner's Course

## Course Overview

**Who this is for:** Beginners who can write basic code (any language) and want to understand databases not as abstract theory, but as tools you choose deliberately based on what your product actually needs.

**How the course works:** Eight modules. Every topic follows the same pattern:
- **Concept** - what it is, in plain language
- **Where you'd actually use this** - a real product scenario, not a toy example
- **Lab** - hands-on setup and practice
- **Checkpoint**
- **Quiz** - five questions with answers

**Tools needed:** A terminal, and free accounts/installs for the tools covered in each module (installation steps are included where needed).

---

## Module 0: Why Databases, and Why So Many Kinds

### Concept

A **database** stores data so it survives after your program stops running, and so multiple users or processes can read and write it safely at the same time. There isn't one "best" database - each type makes different trade-offs:

| Type | Example | Best at |
|---|---|---|
| Relational (SQL) | PostgreSQL, MySQL | Structured data with relationships, strong consistency |
| Document (NoSQL) | MongoDB | Flexible, evolving data shapes |
| Realtime/BaaS | Firebase | Apps needing live updates with minimal backend code |
| In-memory key-value | Redis | Extreme speed for caching, sessions, counters |

### Where you'd actually use this

Most real products use more than one database at once. A typical setup: PostgreSQL for orders and users (needs strong consistency and relationships), Redis for session storage and caching (needs speed), and maybe Firebase for a chat feature (needs realtime updates). Choosing the wrong one for the job is one of the most common early architecture mistakes.

### Lab

Write, in your own words, a one-paragraph answer for TrackIt (or any product idea of yours): which of the four types above would you reach for first, and why? There's no code yet, this module is about building the decision-making habit before touching syntax.

### Checkpoint
You can name all four database types above and give one reason to choose each.

### Quiz
1. Why might a product use more than one type of database at once?
2. What's the main trade-off relational databases are known for?
3. What is a document database better suited for than a relational one?
4. What is Redis primarily optimized for?
5. Is choosing a database type a one-time decision you never revisit?

*Answers: 1) Each type is optimized for a different kind of workload, and one tool rarely fits every need. 2) Strong consistency and relationships between data, at the cost of rigid, predefined structure. 3) Data whose shape changes often or varies between records. 4) Speed - extremely fast reads and writes, held in memory. 5) No - as a product's needs change (scale, structure, speed requirements), the right database choice can change too.*

---

## Module 1: SQL Fundamentals

### Concept

**SQL** (Structured Query Language) is how you talk to relational databases. It's not tied to one product - PostgreSQL, MySQL, and others all use it, with minor differences. The four core operations spell **CRUD**: Create, Read, Update, Delete.

### Where you'd actually use this

Any time your product has structured data with clear relationships - users, orders, products, tasks - SQL is how you'll create, retrieve, filter, and update that data. This is the most transferable database skill there is; nearly every backend job expects it.

### Lab

You don't need a real database installed yet to learn the syntax - focus on reading and writing these correctly.

```sql
-- CREATE: define a table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- CREATE (insert data)
INSERT INTO users (email) VALUES ('alice@example.com');

-- READ: get data back
SELECT id, email FROM users WHERE email = 'alice@example.com';

-- READ with a JOIN: combine data across two related tables
SELECT tasks.title, users.email
FROM tasks
JOIN users ON tasks.owner_id = users.id
WHERE users.email = 'alice@example.com';

-- UPDATE: change existing data
UPDATE users SET email = 'alice.new@example.com' WHERE id = 1;

-- DELETE: remove data
DELETE FROM users WHERE id = 1;
```

Translate each query above into a plain-English sentence, on paper or in a notes file, before moving on. This is the actual skill - reading SQL fluently, not memorizing syntax.

### Checkpoint
You can read each query above and explain what it does without looking at the comments.

### Quiz
1. What does CRUD stand for?
2. What does a `JOIN` let you do that a single-table query can't?
3. What happens if you run the `INSERT` example twice with the same email, given the `UNIQUE` constraint?
4. What's the risk of running `DELETE FROM users;` without a `WHERE` clause?
5. Why does `id SERIAL PRIMARY KEY` matter for a table?

*Answers: 1) Create, Read, Update, Delete - the four basic data operations. 2) Combine related data stored across multiple tables into one result. 3) It would fail with a uniqueness constraint violation, since `email` must be unique. 4) It deletes every single row in the table, not just one. 5) It gives every row a unique, auto-incrementing identifier, which is essential for referencing specific rows reliably.*

---

## Module 2: PostgreSQL - A Real Relational Database

### Concept

**PostgreSQL** ("Postgres") is a free, production-grade relational database used by companies at every scale. It fully supports SQL plus extra features like advanced indexing, JSON columns, and strong data-integrity guarantees.

### Where you'd actually use this

Anywhere you need reliable, structured data with relationships: user accounts, orders, financial records, task management (TrackIt's actual database, if you followed the earlier course, was Postgres-shaped). It's the default safe choice for most new backend projects.

### Lab

**1. Install PostgreSQL** (or use a free hosted instance like [Supabase](https://supabase.com) or [Neon](https://neon.tech) to skip local setup).

**2. Create and query a real table using `psql` (Postgres's command-line tool):**
```bash
psql -U postgres
```
```sql
CREATE DATABASE trackit;
\c trackit

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    done BOOLEAN DEFAULT FALSE,
    due_date DATE
);

INSERT INTO tasks (title, due_date) VALUES ('Write course notes', '2026-07-10');
INSERT INTO tasks (title, due_date) VALUES ('Review PR', '2026-07-05');

SELECT * FROM tasks WHERE done = FALSE ORDER BY due_date ASC;
```

**3. Connect from Python:**
```python
import psycopg2

conn = psycopg2.connect(dbname="trackit", user="postgres", password="yourpassword")
cur = conn.cursor()
cur.execute("SELECT title, due_date FROM tasks WHERE done = FALSE ORDER BY due_date ASC;")
for row in cur.fetchall():
    print(row)
conn.close()
```

### Checkpoint
You have a running Postgres database with a real table, and you queried it both from `psql` and from Python.

### Quiz
1. What does `\c trackit` do in `psql`?
2. Why use `SERIAL` for the `id` column instead of typing IDs manually?
3. What does `DEFAULT FALSE` do for the `done` column?
4. Why connect from Python instead of only using `psql`?
5. What would happen if you tried to insert a task with no `title`?

*Answers: 1) Connects to (switches into) the `trackit` database. 2) It auto-generates a unique, incrementing ID for every new row, avoiding manual tracking and collisions. 3) New tasks are marked not-done unless specified otherwise. 4) Your actual application code needs to read/write data programmatically, not through manual terminal commands. 5) It would fail, since `title` is marked `NOT NULL`.*

---

## Module 3: MySQL - Postgres's Widely-Used Cousin

### Concept

**MySQL** is another free, production-grade relational database, and the most widely deployed one historically (WordPress, many PHP apps, and countless startups run on it). It uses the same core SQL you already learned, with small syntax differences from Postgres.

### Where you'd actually use this

You'll often encounter MySQL rather than choose it fresh - many existing systems, CMS platforms (WordPress), and legacy codebases run on it. Knowing it lets you work confidently on existing MySQL-backed projects, not just greenfield ones.

### Lab

**1. Install MySQL** (or use a free hosted instance like [PlanetScale](https://planetscale.com)).

**2. The same task table, in MySQL syntax - notice the small differences from Postgres:**
```sql
CREATE DATABASE trackit;
USE trackit;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    done BOOLEAN DEFAULT FALSE,
    due_date DATE
);

INSERT INTO tasks (title, due_date) VALUES ('Write course notes', '2026-07-10');

SELECT * FROM tasks WHERE done = FALSE ORDER BY due_date ASC;
```

**3. Spot the differences from Postgres:**
```
Postgres: \c trackit           MySQL: USE trackit;
Postgres: SERIAL                MySQL: AUTO_INCREMENT
```

### Checkpoint
You can list at least two syntax differences between Postgres and MySQL for the same table definition.

### Quiz
1. What's the MySQL equivalent of Postgres's `SERIAL`?
2. Why might you encounter MySQL on a project even if you'd choose Postgres for a new one?
3. Is the core `SELECT ... WHERE ... ORDER BY` syntax different between MySQL and Postgres?
4. What command switches your active database in MySQL?
5. If a job posting says "3 years of SQL experience," does that skill transfer between MySQL and Postgres?

*Answers: 1) `AUTO_INCREMENT`. 2) Existing/legacy systems, CMS platforms like WordPress, or team/company standards already in place. 3) No - the core query syntax is nearly identical; differences show up mostly in setup, functions, and advanced features. 4) `USE database_name;`. 5) Yes, in large part - the fundamentals transfer directly, with only minor adjustments needed.*

---

## Module 4: MongoDB - Thinking in Documents, Not Tables

### Concept

**MongoDB** is a document database - instead of rows and columns, it stores data as JSON-like documents, and records in the same collection don't need identical fields. There are no joins by default; related data is often nested directly inside a document instead of split across tables.

### Where you'd actually use this

Data whose shape varies or evolves often - product catalogs where different product types have different attributes, user-generated content, logging/event data, or early-stage products where the schema isn't fully settled yet.

### Lab

**1. Install MongoDB** (or use a free hosted cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)).

**2. Insert and query documents:**
```javascript
// Using the mongo shell or MongoDB Compass
use trackit

db.tasks.insertOne({
  title: "Write course notes",
  done: false,
  due_date: new Date("2026-07-10"),
  tags: ["writing", "course"]
})

db.tasks.insertOne({
  title: "Design logo",
  done: false,
  due_date: new Date("2026-07-08"),
  design_tool: "Figma"   // this field doesn't exist on the other document, and that's fine
})

db.tasks.find({ done: false }).sort({ due_date: 1 })
```

**3. Notice the key difference:** the two task documents have different fields (`tags` vs. `design_tool`), which would require a schema change or a nullable column in a relational database, but is just normal here.

**4. Connect from Python:**
```python
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["trackit"]

db.tasks.insert_one({"title": "Review PR", "done": False, "due_date": "2026-07-05"})

for task in db.tasks.find({"done": False}).sort("due_date", 1):
    print(task)
```

### Checkpoint
You inserted two documents with different fields into the same collection without errors, and queried them both back.

### Quiz
1. What does MongoDB store instead of rows and columns?
2. Why can two documents in the same collection have different fields?
3. What's the trade-off of not having enforced structure across documents?
4. When would a flexible schema be more useful than a strict one?
5. What's the MongoDB term for what SQL calls a "table"?

*Answers: 1) JSON-like documents. 2) There's no enforced schema requiring every document to match the same structure. 3) It's easy to end up with inconsistent data over time if you're not careful, since nothing forces uniformity. 4) When your data's shape varies between records or is still evolving early in a product's life. 5) A collection.*

---

## Module 5: Firebase - Realtime Data With Minimal Backend

### Concept

**Firebase** (specifically **Firestore**, its modern database) is a hosted, document-style database built for apps that need live updates pushed to users instantly, often with little to no custom backend code. It also bundles authentication, file storage, and hosting.

### Where you'd actually use this

A live chat feature, a collaborative to-do list where changes appear instantly for everyone viewing it, a live scoreboard, or a small app/MVP where you want to skip building a custom backend entirely and let the client talk directly to the database (with security rules controlling access).

### Lab

**1. Create a free Firebase project at [firebase.google.com](https://firebase.google.com) and enable Firestore.**

**2. Write and read data (JavaScript, e.g. in a web app):**
```javascript
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, where } from "firebase/firestore";

const app = initializeApp({ /* your Firebase config */ });
const db = getFirestore(app);

// Add a task
await addDoc(collection(db, "tasks"), {
  title: "Write course notes",
  done: false,
  dueDate: "2026-07-10",
});

// Listen for LIVE updates - this callback re-runs automatically whenever data changes
const tasksQuery = query(collection(db, "tasks"), where("done", "==", false));
onSnapshot(tasksQuery, (snapshot) => {
  snapshot.forEach((doc) => {
    console.log(doc.id, doc.data());
  });
});
```

**3. The key idea to notice:** `onSnapshot` doesn't just fetch data once, it keeps listening. If another user adds a task from a different device, your app updates instantly without you writing any polling or websocket code yourself.

### Checkpoint
You can explain what makes `onSnapshot` different from a normal database query, and why that matters for realtime features.

### Quiz
1. What does Firestore give you that a typical SQL query doesn't, out of the box?
2. What kind of feature is Firebase especially well-suited for?
3. What else does Firebase bundle besides the database?
4. What's a risk of letting the client talk directly to the database, and what controls access in that case?
5. Would Firebase be a good fit for a financial ledger requiring strict consistency guarantees? Why or why not?

*Answers: 1) Realtime updates pushed automatically when data changes, without manual polling. 2) Live, collaborative, or instantly-updating features - chat, live boards, shared lists. 3) Authentication, file storage, and app hosting. 4) Users could access or modify data they shouldn't; Firebase security rules define exactly what each user is allowed to read/write. 5) Generally not the first choice - a traditional relational database offers stronger consistency guarantees better suited to financial data integrity.*

---

## Module 6: Redis - Extreme Speed for the Right Job

### Concept

**Redis** is an in-memory key-value store - data lives in RAM instead of on disk, making it extremely fast, but typically used for data that's okay to lose or that's a copy of data stored durably elsewhere. It's not usually your primary database; it's a specialized tool alongside one.

### Where you'd actually use this

Caching (storing the result of an expensive database query so you don't recompute it every time), session storage (keeping a logged-in user's session data readily accessible), rate limiting (counting how many requests a user has made in the last minute), and real-time leaderboards.

### Lab

**1. Install Redis** (or use a free hosted instance like [Upstash](https://upstash.com)).

**2. Basic key-value operations:**
```bash
redis-cli
SET user:1:name "Alice"
GET user:1:name
EXPIRE user:1:name 3600   # this key disappears automatically after 1 hour
```

**3. Caching an expensive database query, from Python:**
```python
import redis
import json

r = redis.Redis(host="localhost", port=6379, decode_responses=True)

def get_trending_tasks():
    cache_key = "trending_tasks"
    cached = r.get(cache_key)
    if cached:
        return json.loads(cached)   # instant, skips the database entirely

    # Pretend this is an expensive database query
    result = ["Write course notes", "Design logo", "Review PR"]

    r.setex(cache_key, 60, json.dumps(result))   # cache for 60 seconds
    return result
```

**4. Rate limiting a user's requests:**
```python
def is_rate_limited(user_id: str, limit: int = 5) -> bool:
    key = f"rate_limit:{user_id}"
    count = r.incr(key)          # increments, starting at 1 if the key doesn't exist
    if count == 1:
        r.expire(key, 60)        # only set expiry on the first request in this window
    return count > limit
```

### Checkpoint
You can explain why Redis is fast (in-memory) and why it's usually paired with, not a replacement for, a primary database.

### Quiz
1. What makes Redis faster than a typical disk-based database?
2. Why is Redis usually not your main/primary database?
3. What does `EXPIRE` (or `setex`) let you do that's useful for caching?
4. In the rate-limiting example, what does `r.incr(key)` do the first time it's called for a new key?
5. Name two real product features that rely on something like Redis.

*Answers: 1) Data lives in RAM instead of on disk, and RAM access is dramatically faster. 2) Data in memory is more fragile (lost on restart unless configured otherwise) and RAM is more limited/expensive than disk, so it's used for fast-access or disposable data, not the durable source of truth. 3) Automatically remove a key after a set time, so cached data doesn't go stale forever. 4) It creates the key starting at 1, since it didn't exist before. 5) Caching, session storage, rate limiting, real-time leaderboards (any two).*

---

## Module 7: Choosing the Right Database for the Job

### Concept

Real products combine several of these tools deliberately, not by accident. The skill isn't memorizing every feature of every database, it's asking the right questions before choosing.

### Questions to ask for any new feature
```
- Does this data have clear structure and relationships? -> Relational (Postgres/MySQL)
- Does this data's shape vary a lot or change often? -> Document (MongoDB)
- Does this feature need live updates pushed to users instantly? -> Firebase
- Is this data temporary, or a cache of something stored elsewhere? -> Redis
- How important is strict consistency vs. raw speed for this specific feature?
```

### Lab

For each TrackIt feature below, decide which database from this course fits best, and write one sentence justifying your choice:
1. Storing user accounts and their tasks
2. Showing a live "who's currently online" indicator
3. Caching the result of an expensive "weekly summary" calculation
4. Storing user-uploaded custom task templates, where each template can have wildly different fields

**Suggested answers** (compare against your own reasoning, not just the label):
1. PostgreSQL - structured, relational, needs consistency
2. Firebase - needs realtime updates pushed to all connected clients
3. Redis - temporary, derived data, fine to expire and recompute
4. MongoDB - flexible, varying shape per template

### Checkpoint
You produced your own reasoning for all four scenarios above before checking the suggested answers.

### Quiz
1. Why is "which database is best?" the wrong question to ask?
2. What's the first question worth asking before picking a database for a new feature?
3. Could a single product reasonably use all four types covered in this course? Why?
4. What's the risk of defaulting to the same database for every feature out of habit?
5. If you're unsure which to choose, what's a reasonable default for most structured product data?

*Answers: 1) Because the right answer depends entirely on the specific data and access pattern, not a universal ranking. 2) Whether the data has clear structure and relationships, or varies/evolves in shape. 3) Yes - many real products do, each tool handling the part of the system it's best suited for. 4) You may end up fighting the tool for features it wasn't designed for (e.g., forcing realtime updates out of a database with no native support for it). 5) A relational database like PostgreSQL, since most product data benefits from structure and consistency by default.*

---

## Course Completion Checklist
- [ ] Explained all four database types and when to reach for each
- [ ] Read and written core SQL: CREATE, INSERT, SELECT, JOIN, UPDATE, DELETE
- [ ] Created a real table in PostgreSQL and queried it from Python
- [ ] Created the same table in MySQL and identified syntax differences from Postgres
- [ ] Inserted documents with different fields into the same MongoDB collection
- [ ] Built a realtime Firestore listener in Firebase
- [ ] Implemented caching and rate limiting with Redis
- [ ] Justified a database choice for four different product scenarios

Every database in this course exists to answer the same underlying question as the data structures course: **what do I need to be true about this data (speed, structure, consistency, realtime-ness), and what am I willing to trade for it?**
