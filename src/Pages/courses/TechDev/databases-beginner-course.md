<!-- order: 7 -->
# Databases for Builders: A Practical Beginner's Course

## Course Overview

**By the end of this course, you'll be able to:**
- Compare relational, document, realtime, and in-memory databases and say what each is best at
- Read and write core SQL: create a table, insert, select with a filter and a join, update, and delete
- Create and query tables in PostgreSQL and MySQL, and connect to Postgres from Python
- Store and query documents with different shapes in MongoDB
- Build a live Firestore listener, and use Redis for caching and rate limiting
- Justify which database fits a given product feature

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

**Time: about 1 hour**

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

Write, in your own words, a one-paragraph answer for TrackIt (a simple task-tracking app we'll use as the running example in this course) or any product idea of yours: which of the four types above would you reach for first, and why? There's no code yet, this module is about building the decision-making habit before touching syntax.

### Checkpoint
You can name all four database types above and give one reason to choose each.

### Quiz
1. Why might a product use more than one type of database at once?
2. What's the main trade-off relational databases are known for?
3. What is a document database better suited for than a relational one?
4. What is Redis primarily optimized for?
5. Is choosing a database type a one-time decision you never revisit?

*Answers: 1) Each type is optimized for a different kind of workload, and one tool rarely fits every need. 2) Strong consistency and relationships between data, at the cost of rigid, predefined structure. 3) Data whose shape changes often or varies between records. 4) Speed - extremely fast reads and writes, held in memory. 5) No - as a product's needs change (scale, structure, speed requirements), the right database choice can change too.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "database",
   "kicker": "Module 0 · Why so many databases",
   "title": "There's no single best database",
   "beats": [
    {
     "say": "Welcome to Databases for Builders."
    },
    {
     "say": "A database keeps data after your program stops, and lets many users read and write it safely at the same time."
    },
    {
     "say": "But there isn't one best database. Each kind makes different trade-offs."
    }
   ]
  },
  {
   "kind": "list",
   "art": "boxes",
   "kicker": "Concept",
   "title": "Four kinds",
   "items": [
    [
     "Relational",
     "PostgreSQL, MySQL: structure and consistency"
    ],
    [
     "Document",
     "MongoDB: flexible shapes"
    ],
    [
     "Realtime",
     "Firebase: live updates"
    ],
    [
     "In-memory",
     "Redis: extreme speed"
    ]
   ],
   "beats": [
    {
     "say": "Here are the four kinds in this course.",
     "show": 0
    },
    {
     "say": "Relational, like PostgreSQL and MySQL. Best for structured data with relationships, and strong consistency.",
     "show": 1
    },
    {
     "say": "Document, like MongoDB. Best for flexible data whose shape changes.",
     "show": 2
    },
    {
     "say": "Realtime, like Firebase. Best for live updates, with very little backend code.",
     "show": 3
    },
    {
     "say": "And in-memory, like Redis. Best for extreme speed: caching, sessions and counters.",
     "show": 4
    }
   ]
  },
  {
   "kind": "flow",
   "art": "architecture",
   "kicker": "Where you'd use this",
   "title": "Real products use several",
   "steps": [
    "PostgreSQL: users, orders",
    "Redis: sessions, cache",
    "Firebase: chat"
   ],
   "beats": [
    {
     "say": "Most real products use more than one at once.",
     "show": 0
    },
    {
     "say": "PostgreSQL for users and orders, which need consistency.",
     "show": 1
    },
    {
     "say": "Redis for sessions and caching, which need speed.",
     "show": 2
    },
    {
     "say": "And maybe Firebase for a chat feature, which needs live updates.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quote",
   "art": "pencil",
   "kicker": "Lab",
   "title": "Build the habit first",
   "quote": "Which database would you choose first for TrackIt, and why?",
   "beats": [
    {
     "say": "Your lab has no code yet.",
     "show": 0
    },
    {
     "say": "For TrackIt, or your own idea, write one paragraph: which of the four would you reach for first, and why?",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What is a document database better suited for?",
   "options": [
    "Strict financial records",
    "Data whose shape changes often or varies between records",
    "Caching for speed"
   ],
   "answer": 1,
   "good": "That's right. Document databases suit data whose shape varies or keeps changing.",
   "bad": "Not quite. Document databases suit data whose shape varies or keeps changing.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What is a document database better suited for?",
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
     "You can name all four, and when to use each",
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
     "say": "you can name all four kinds, and one reason to choose each.",
     "show": 1
    },
    {
     "say": "Next, in Module 1, SQL.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 1: SQL Fundamentals

**Time: about 2 hours**

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

(The `JOIN` example assumes a second table, `tasks`, whose `owner_id` column holds the `id` of the user who owns each task.)

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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "table",
   "kicker": "Module 1 · SQL fundamentals",
   "title": "The language of relational databases",
   "beats": [
    {
     "say": "Welcome to Module 1."
    },
    {
     "say": "SQL is how you talk to relational databases. PostgreSQL, MySQL and others all use it."
    },
    {
     "say": "It's the most transferable database skill there is."
    }
   ]
  },
  {
   "kind": "list",
   "art": "blocks",
   "kicker": "Concept",
   "title": "CRUD",
   "items": [
    [
     "Create",
     "CREATE TABLE · INSERT"
    ],
    [
     "Read",
     "SELECT"
    ],
    [
     "Update",
     "UPDATE"
    ],
    [
     "Delete",
     "DELETE"
    ]
   ],
   "beats": [
    {
     "say": "The four core operations spell CRUD.",
     "show": 0
    },
    {
     "say": "Create,",
     "show": 1
    },
    {
     "say": "Read,",
     "show": 2
    },
    {
     "say": "Update,",
     "show": 3
    },
    {
     "say": "and Delete.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab",
   "title": "Create and read",
   "file": "SQL",
   "code": "CREATE TABLE users (\n    id SERIAL PRIMARY KEY,\n    email VARCHAR(255) UNIQUE NOT NULL\n);\n\nINSERT INTO users (email) VALUES ('alice@example.com');\n\nSELECT id, email FROM users WHERE email = 'alice@example.com';",
   "beats": [
    {
     "say": "Create table defines a users table. Every user gets an automatic I D, and an email that must be unique.",
     "show": 0
    },
    {
     "say": "Insert adds a row.",
     "show": 1
    },
    {
     "say": "Select reads it back: get the I D and email of the user whose email is alice at example dot com.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "merge",
   "kicker": "Lab",
   "title": "Join two tables",
   "file": "SQL",
   "code": "SELECT tasks.title, users.email\nFROM tasks\nJOIN users ON tasks.owner_id = users.id\nWHERE users.email = 'alice@example.com';",
   "beats": [
    {
     "say": "A join combines related data from two tables.",
     "show": 0
    },
    {
     "say": "This reads as: get each task's title and its owner's email, for tasks owned by Alice.",
     "show": 1
    },
    {
     "say": "The tasks table's owner I D matches the users table's I D.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quote",
   "art": "warning",
   "kicker": "Careful",
   "title": "Always use WHERE",
   "quote": "DELETE FROM users;  ← deletes every row. Always add WHERE.",
   "beats": [
    {
     "say": "One warning.",
     "show": 0
    },
    {
     "say": "Delete from users, without a where clause, deletes every single row in the table.",
     "show": 1
    },
    {
     "say": "The same goes for update.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quote",
   "art": "book",
   "kicker": "Lab",
   "title": "Read SQL fluently",
   "quote": "Translate every query into a plain English sentence.",
   "beats": [
    {
     "say": "Your lab: translate each query into a plain English sentence.",
     "show": 0
    },
    {
     "say": "That's the real skill. Reading SQL fluently, not memorising syntax.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What happens if you insert the same email twice with UNIQUE?",
   "options": [
    "It saves two copies",
    "It fails, because email must be unique",
    "It replaces the first one"
   ],
   "answer": 1,
   "good": "That's right. It fails with a uniqueness error, because email must be unique.",
   "bad": "Not quite. It fails with a uniqueness error, because email must be unique.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What happens if you insert the same email twice with UNIQUE?",
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
     "You can explain every query without the comments",
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
     "say": "you can read each query and explain it without looking at the comments.",
     "show": 1
    },
    {
     "say": "Next, in Module 2, a real PostgreSQL database.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 2: PostgreSQL - A Real Relational Database

**Time: about 2 hours**

### Concept

**PostgreSQL** ("Postgres") is a free, production-grade relational database used by companies at every scale. It fully supports SQL plus extra features like advanced indexing, JSON columns, and strong data-integrity guarantees.

### Where you'd actually use this

Anywhere you need reliable, structured data with relationships: user accounts, orders, financial records, and task management, like TrackIt's tasks. It's the default safe choice for most new backend projects.

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

You'll also see newer Postgres code write the `id` column as `id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY`. That's the SQL-standard way to get the same auto-numbering as `SERIAL`; both work.

**3. Connect from Python.** Install psycopg, the Postgres driver for Python (version 3), first:
```bash
pip install "psycopg[binary]"
```
Keep your database password out of your code: set it as an environment variable named `PGPASSWORD` (for example `export PGPASSWORD="your-postgres-password"` in the terminal you'll run Python from), then run:
```python
import os
import psycopg

conn = psycopg.connect(
    dbname="trackit",
    user="postgres",
    password=os.environ["PGPASSWORD"],
    host="localhost",
)
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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "database",
   "kicker": "Module 2 · PostgreSQL",
   "title": "A real relational database",
   "beats": [
    {
     "say": "Welcome to Module 2."
    },
    {
     "say": "PostgreSQL, or Postgres, is a free, production-grade database used at every scale. It's the safe default for most new projects."
    }
   ]
  },
  {
   "kind": "code",
   "art": "terminal",
   "kicker": "Lab · Steps 1 and 2",
   "title": "Create a table in psql",
   "file": "psql",
   "code": "CREATE DATABASE trackit;\n\\c trackit\n\nCREATE TABLE tasks (\n    id SERIAL PRIMARY KEY,\n    title VARCHAR(255) NOT NULL,\n    done BOOLEAN DEFAULT FALSE,\n    due_date DATE\n);",
   "beats": [
    {
     "say": "Install Postgres, or use a free hosted one like Supabase or Neon.",
     "show": 0
    },
    {
     "say": "In psql, its command-line tool, create the trackit database, and connect with backslash c.",
     "show": 1
    },
    {
     "say": "Then create a tasks table. Title is required. Done defaults to false.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "table",
   "kicker": "Lab · Step 2",
   "title": "Add and query tasks",
   "file": "psql",
   "code": "INSERT INTO tasks (title, due_date) VALUES ('Write course notes', '2026-07-10');\nINSERT INTO tasks (title, due_date) VALUES ('Review PR', '2026-07-05');\n\nSELECT * FROM tasks WHERE done = FALSE ORDER BY due_date ASC;",
   "beats": [
    {
     "say": "Insert two tasks with due dates.",
     "show": 0
    },
    {
     "say": "Then select every unfinished task, soonest due date first.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab · Step 3",
   "title": "Connect from Python",
   "file": "Python",
   "code": "import os\nimport psycopg\n\nconn = psycopg.connect(dbname=\"trackit\", user=\"postgres\",\n                       password=os.environ[\"PGPASSWORD\"], host=\"localhost\")\ncur = conn.cursor()\ncur.execute(\"SELECT title, due_date FROM tasks WHERE done = FALSE ORDER BY due_date ASC;\")\nfor row in cur.fetchall():\n    print(row)",
   "beats": [
    {
     "say": "Your app needs to talk to the database in code, so connect from Python with psycopg.",
     "show": 0
    },
    {
     "say": "Keep the password out of your code. Read it from an environment variable called P G password.",
     "show": 1
    },
    {
     "say": "Then run the same query and print each row.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What happens if you insert a task with no title?",
   "options": [
    "It saves with an empty title",
    "It fails, because title is NOT NULL",
    "Postgres makes up a title"
   ],
   "answer": 1,
   "good": "That's right. It fails, because title is marked not null.",
   "bad": "Not quite. It fails, because title is marked not null.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What happens if you insert a task with no title?",
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
     "A running Postgres database with a real table",
     ""
    ],
    [
     "Queried from psql and from Python",
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
     "say": "you have a running Postgres database with a real table,",
     "show": 1
    },
    {
     "say": "and you've queried it from psql and from Python.",
     "show": 2
    },
    {
     "say": "Next, in Module 3, MySQL.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 3: MySQL - Postgres's Widely-Used Cousin

**Time: about 1.5 hours**

### Concept

**MySQL** is another free, production-grade relational database, and the most widely deployed one historically (WordPress, many PHP apps, and countless startups run on it). It uses the same core SQL you already learned, with small syntax differences from Postgres.

### Where you'd actually use this

You'll often encounter MySQL rather than choose it fresh - many existing systems, CMS platforms (WordPress), and legacy codebases run on it. Knowing it lets you work confidently on existing MySQL-backed projects, not just greenfield ones.

### Lab

**1. Get a MySQL server running locally.** Pick one option:
- **Install it:** download MySQL Community Server from [dev.mysql.com/downloads](https://dev.mysql.com/downloads/mysql/) (on macOS you can also run `brew install mysql`, then `brew services start mysql`). Then open the MySQL command-line client:
```bash
mysql -u root -p
```
- **Or use Docker** (if you have [Docker](https://www.docker.com) installed). This starts MySQL 8.4 (the long-term support release) in a container, then opens its command-line client. Replace `choose-a-password` with a password of your own, and type it again when asked:
```bash
docker run --name trackit-mysql -e MYSQL_ROOT_PASSWORD=choose-a-password -p 3306:3306 -d mysql:8.4
docker exec -it trackit-mysql mysql -u root -p
```
If the second command says it can't connect, wait 20 to 30 seconds for MySQL to finish starting, then run it again.

Hosted MySQL services also exist, but free tiers change often (PlanetScale, once a popular free option, ended its free plan in 2024), so check current free tiers before relying on one. A local server is all you need for this lab.

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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "database",
   "kicker": "Module 3 · MySQL",
   "title": "Postgres's widely used cousin",
   "beats": [
    {
     "say": "Welcome to Module 3."
    },
    {
     "say": "MySQL is another free relational database, and historically the most widely deployed. WordPress and countless apps run on it."
    },
    {
     "say": "You'll often meet it on existing projects, rather than choose it fresh."
    }
   ]
  },
  {
   "kind": "list",
   "art": "terminal",
   "kicker": "Lab · Step 1",
   "title": "Get MySQL running",
   "items": [
    [
     "Install it",
     "MySQL Community Server, or brew on macOS"
    ],
    [
     "Or use Docker",
     "docker run … mysql:8.4"
    ]
   ],
   "beats": [
    {
     "say": "Two ways to get it running.",
     "show": 0
    },
    {
     "say": "Install MySQL Community Server, or on a Mac, use brew.",
     "show": 1
    },
    {
     "say": "Or run it in Docker. If it can't connect at first, wait twenty to thirty seconds while it starts.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "table",
   "kicker": "Lab · Step 2",
   "title": "The same table, in MySQL",
   "file": "MySQL",
   "code": "CREATE DATABASE trackit;\nUSE trackit;\n\nCREATE TABLE tasks (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    title VARCHAR(255) NOT NULL,\n    done BOOLEAN DEFAULT FALSE,\n    due_date DATE\n);",
   "beats": [
    {
     "say": "Here's the same tasks table, in MySQL.",
     "show": 0
    },
    {
     "say": "Use trackit switches database, and the I D uses auto increment.",
     "show": 1
    },
    {
     "say": "Everything else, the insert and the select, is the same SQL you already know.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "venn",
   "kicker": "Lab · Step 3",
   "title": "Spot the differences",
   "items": [
    [
     "\\c trackit  vs  USE trackit;",
     "Switching database"
    ],
    [
     "SERIAL  vs  AUTO_INCREMENT",
     "Auto-numbered IDs"
    ]
   ],
   "beats": [
    {
     "say": "Spot the differences.",
     "show": 0
    },
    {
     "say": "Postgres switches database with backslash c. MySQL uses use.",
     "show": 1
    },
    {
     "say": "Postgres auto-numbers with serial. MySQL uses auto increment.",
     "show": 2
    },
    {
     "say": "The core queries are nearly identical, so your SQL skills transfer.",
     "show": 2
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Does SQL experience transfer between MySQL and Postgres?",
   "options": [
    "No, they're completely different",
    "Yes, in large part; only small adjustments are needed",
    "Only for experts"
   ],
   "answer": 1,
   "good": "That's right. The fundamentals transfer directly, with only minor adjustments.",
   "bad": "Not quite. The fundamentals transfer directly, with only minor adjustments.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Does SQL experience transfer between MySQL and Postgres?",
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
     "You can list two Postgres vs MySQL differences",
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
     "say": "you can list at least two syntax differences between Postgres and MySQL.",
     "show": 1
    },
    {
     "say": "Next, in Module 4, MongoDB and documents.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 4: MongoDB - Thinking in Documents, Not Tables

**Time: about 2 hours**

### Concept

**MongoDB** is a document database - instead of rows and columns, it stores data as JSON-like documents, and records in the same collection don't need identical fields. There are no joins by default; related data is often nested directly inside a document instead of split across tables.

### Where you'd actually use this

Data whose shape varies or evolves often - product catalogs where different product types have different attributes, user-generated content, logging/event data, or early-stage products where the schema isn't fully settled yet.

### Lab

**1. Install MongoDB** (or use a free hosted cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)). You'll also need **mongosh**, the MongoDB Shell, from [mongodb.com/try/download/shell](https://www.mongodb.com/try/download/shell). (Older tutorials use a command called `mongo`; that legacy shell was removed in MongoDB 6, so use `mongosh`.)

**2. Insert and query documents.** Open the shell by running `mongosh` in your terminal (it connects to your local MongoDB by default), or use the shell built into MongoDB Compass, then type:
```javascript
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

**4. Connect from Python.** Install the driver first:
```bash
pip install pymongo
```
```python
from datetime import datetime

from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["trackit"]

db.tasks.insert_one({"title": "Review PR", "done": False, "due_date": datetime(2026, 7, 5)})

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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "doc",
   "kicker": "Module 4 · MongoDB",
   "title": "Think in documents, not tables",
   "beats": [
    {
     "say": "Welcome to Module 4."
    },
    {
     "say": "MongoDB stores JSON-like documents instead of rows and columns. A table is called a collection."
    },
    {
     "say": "Documents in the same collection don't need the same fields."
    }
   ]
  },
  {
   "kind": "list",
   "art": "blocks",
   "kicker": "Where you'd use this",
   "title": "When flexible data helps",
   "items": [
    [
     "Product catalogues",
     ""
    ],
    [
     "User content and logs",
     ""
    ],
    [
     "Early-stage products",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That flexibility helps when data varies, or keeps changing.",
     "show": 0
    },
    {
     "say": "Product catalogues, where each product type has different attributes,",
     "show": 1
    },
    {
     "say": "user-generated content and event logs,",
     "show": 2
    },
    {
     "say": "and early products, where the shape isn't settled yet.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "file",
   "kicker": "Lab · Step 2",
   "title": "Two different documents",
   "file": "mongosh",
   "code": "db.tasks.insertOne({\n  title: \"Write course notes\",\n  done: false,\n  tags: [\"writing\", \"course\"]\n})\n\ndb.tasks.insertOne({\n  title: \"Design logo\",\n  done: false,\n  design_tool: \"Figma\"\n})",
   "beats": [
    {
     "say": "In mongosh, insert two tasks.",
     "show": 0
    },
    {
     "say": "One has tags. The other has a design tool field instead.",
     "show": 1
    },
    {
     "say": "In a relational database, that would need a schema change. Here, it's completely normal.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "search",
   "kicker": "Lab · Steps 2 and 4",
   "title": "Query them back",
   "file": "mongosh / Python",
   "code": "db.tasks.find({ done: false }).sort({ due_date: 1 })\n\n# Python\nfor task in db.tasks.find({\"done\": False}).sort(\"due_date\", 1):\n    print(task)",
   "beats": [
    {
     "say": "Find every unfinished task, sorted by due date.",
     "show": 0
    },
    {
     "say": "From Python, pymongo does the same: insert one, then find and sort.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quote",
   "art": "scales",
   "kicker": "The trade-off",
   "title": "Freedom needs discipline",
   "quote": "No enforced structure means it's on you to keep data consistent.",
   "beats": [
    {
     "say": "The trade-off.",
     "show": 0
    },
    {
     "say": "Nothing forces documents to match, so it's easy to end up with inconsistent data over time if you're not careful.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What's MongoDB's word for what SQL calls a table?",
   "options": [
    "A document",
    "A collection",
    "A cluster"
   ],
   "answer": 1,
   "good": "That's right. In MongoDB, a table is called a collection.",
   "bad": "Not quite. In MongoDB, a table is called a collection.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What's MongoDB's word for what SQL calls a table?",
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
     "Two documents with different fields, one collection",
     ""
    ],
    [
     "You queried them both back",
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
     "say": "you've inserted two documents with different fields into one collection,",
     "show": 1
    },
    {
     "say": "and queried them both back.",
     "show": 2
    },
    {
     "say": "Next, in Module 5, Firebase and live data.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 5: Firebase - Realtime Data With Minimal Backend

**Time: about 2 hours**

### Concept

**Firebase** (specifically **Firestore**, its modern database) is a hosted, document-style database built for apps that need live updates pushed to users instantly, often with little to no custom backend code. It also bundles authentication, file storage, and hosting.

### Where you'd actually use this

A live chat feature, a collaborative to-do list where changes appear instantly for everyone viewing it, a live scoreboard, or a small app/MVP where you want to skip building a custom backend entirely and let the client talk directly to the database (with security rules controlling access).

### Lab

**1. Create a free Firebase project at [firebase.google.com](https://firebase.google.com).** In the console:
- Open **Firestore Database**, click **Create database**, and choose **Start in test mode**. (Production mode blocks all reads and writes until you write security rules, so the code below would fail with a permission error. Test mode rules expire after 30 days; you must write real rules before anyone else uses the app.)
- Open **Project settings**, and under **Your apps** click the web icon (`</>`) to register a web app. Copy the `firebaseConfig` object it shows you.

**2. Make a small web project** to run the code in:
```bash
npm create vite@latest firebase-demo -- --template vanilla
cd firebase-demo
npm install
npm install firebase
```

**3. Write and read data.** Replace everything in `src/main.js` with the code below, paste in your own config values, then run `npm run dev`, open the page, and open the browser's developer console (right click, Inspect, Console) to see the output. The Firebase web config is not a secret password: it only identifies your project, and your security rules decide who can read and write.
```javascript
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, where } from "firebase/firestore";

// Template: replace firebaseConfig with the config object shown in your
// Firebase console (Project settings > Your apps > SDK setup and configuration)
const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME",
  projectId: "REPLACE_ME",
  appId: "REPLACE_ME",
};

const app = initializeApp(firebaseConfig);
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

**4. The key idea to notice:** `onSnapshot` doesn't just fetch data once, it keeps listening. Try it: keep the console open, then add a document to the `tasks` collection by hand in the Firebase console (with `done` set to `false`). Your page logs the new list instantly, without you writing any polling or websocket code yourself.

### Checkpoint
You saw a task you added in the Firebase console appear in your page's console instantly, and you can explain what makes `onSnapshot` different from a normal database query.

### Quiz
1. What does Firestore give you that a typical SQL query doesn't, out of the box?
2. What kind of feature is Firebase especially well-suited for?
3. What else does Firebase bundle besides the database?
4. What's a risk of letting the client talk directly to the database, and what controls access in that case?
5. Would Firebase be a good fit for a financial ledger requiring strict consistency guarantees? Why or why not?

*Answers: 1) Realtime updates pushed automatically when data changes, without manual polling. 2) Live, collaborative, or instantly-updating features - chat, live boards, shared lists. 3) Authentication, file storage, and app hosting. 4) Users could access or modify data they shouldn't; Firebase security rules define exactly what each user is allowed to read/write. 5) Generally not the first choice - a relational database gives you multi-table transactions, enforced schemas and constraints (like foreign keys and `NOT NULL`), and SQL for audits and reports, which suit financial data better.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "cloud",
   "kicker": "Module 5 · Firebase",
   "title": "Realtime data, minimal backend",
   "beats": [
    {
     "say": "Welcome to Module 5."
    },
    {
     "say": "Firestore, Firebase's database, pushes live updates to users instantly, often with little or no backend code."
    },
    {
     "say": "Firebase also bundles authentication, file storage and hosting."
    }
   ]
  },
  {
   "kind": "list",
   "art": "chat",
   "kicker": "Where you'd use this",
   "title": "Features that need to feel live",
   "items": [
    [
     "Chat",
     ""
    ],
    [
     "Shared, live lists",
     ""
    ],
    [
     "Live scoreboards",
     ""
    ]
   ],
   "beats": [
    {
     "say": "It shines for features that need to feel live.",
     "show": 0
    },
    {
     "say": "A chat,",
     "show": 1
    },
    {
     "say": "a shared to-do list where changes appear for everyone,",
     "show": 2
    },
    {
     "say": "or a live scoreboard.",
     "show": 3
    }
   ]
  },
  {
   "kind": "flow",
   "art": "gear",
   "kicker": "Lab · Steps 1 and 2",
   "title": "Set up a project",
   "steps": [
    "New Firebase project",
    "Firestore, test mode",
    "Register web app, copy config",
    "npm create vite"
   ],
   "beats": [
    {
     "say": "Create a free Firebase project.",
     "show": 1
    },
    {
     "say": "Create a Firestore database in test mode. Test mode rules expire after thirty days, so you must write real rules before anyone else uses it.",
     "show": 2
    },
    {
     "say": "Register a web app, and copy its config.",
     "show": 3
    },
    {
     "say": "Then make a small Vite project and install Firebase.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab · Step 3",
   "title": "Add a task, then listen",
   "file": "src/main.js",
   "code": "await addDoc(collection(db, \"tasks\"), {\n  title: \"Write course notes\",\n  done: false,\n});\n\nconst q = query(collection(db, \"tasks\"), where(\"done\", \"==\", false));\nonSnapshot(q, (snapshot) => {\n  snapshot.forEach((doc) => console.log(doc.id, doc.data()));\n});",
   "beats": [
    {
     "say": "Add doc saves a task.",
     "show": 0
    },
    {
     "say": "On snapshot is the key idea. It doesn't fetch once. It keeps listening, and re-runs whenever the data changes.",
     "show": 1
    }
   ]
  },
  {
   "kind": "big",
   "art": "bolt",
   "kicker": "Lab · Step 4",
   "title": "Watch it update live",
   "big": "Instant",
   "sub": "new tasks appear without a refresh",
   "beats": [
    {
     "say": "Now try it. Keep the browser console open.",
     "show": 0
    },
    {
     "say": "Add a task by hand in the Firebase console.",
     "show": 1
    },
    {
     "say": "Your page logs the new list instantly. No polling, no extra code.",
     "show": 2
    }
   ]
  },
  {
   "kind": "quote",
   "art": "lock",
   "kicker": "Careful",
   "title": "Security rules control access",
   "quote": "The web config identifies your project. Security rules protect your data.",
   "beats": [
    {
     "say": "When the browser talks directly to the database, security rules decide who can read and write.",
     "show": 0
    },
    {
     "say": "The config isn't a secret. Your rules are what protect the data.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Is Firebase a good first choice for a strict financial ledger?",
   "options": [
    "Yes, it's the best choice",
    "Generally not; a relational database with transactions and constraints suits it better",
    "Only with test mode"
   ],
   "answer": 1,
   "good": "That's right. A relational database gives you transactions, enforced structure and SQL for audits, which suit financial data better.",
   "bad": "Not quite. A relational database gives you transactions, enforced structure and SQL for audits, which suit financial data better.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Is Firebase a good first choice for a strict financial ledger?",
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
     "A new task appeared instantly",
     ""
    ],
    [
     "You can explain onSnapshot",
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
     "say": "you saw a task added in the console appear instantly in your page,",
     "show": 1
    },
    {
     "say": "and you can explain what makes on snapshot different.",
     "show": 2
    },
    {
     "say": "Next, in Module 6, Redis.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 6: Redis - Extreme Speed for the Right Job

**Time: about 1.5 hours**

### Concept

**Redis** is an in-memory key-value store - data lives in RAM instead of on disk, making it extremely fast, but typically used for data that's okay to lose or that's a copy of data stored durably elsewhere. It's not usually your primary database; it's a specialized tool alongside one.

### Where you'd actually use this

Caching (storing the result of an expensive database query so you don't recompute it every time), session storage (keeping a logged-in user's session data readily accessible), rate limiting (counting how many requests a user has made in the last minute), and real-time leaderboards.

### Lab

**1. Install Redis** (or use a free hosted instance like [Upstash](https://upstash.com)). Redis doesn't run natively on Windows; there, the easiest option is Docker: `docker run --name trackit-redis -p 6379:6379 -d redis:8`, then use `docker exec -it trackit-redis redis-cli` wherever this module says `redis-cli`.

**2. Basic key-value operations:**
Start the Redis command-line client:
```bash
redis-cli
```
Then type these commands one at a time:
```
SET user:1:name "Alice"
GET user:1:name
EXPIRE user:1:name 3600
TTL user:1:name
```
`EXPIRE` tells Redis to delete the key automatically after 3600 seconds (1 hour). `TTL` shows how many seconds are left. (Type each command exactly as shown: `redis-cli` doesn't understand `#` comments, so don't paste notes onto the same line.)

**3. Caching an expensive database query, from Python.** Install the Redis client library, then save this as `cache_demo.py`:
```bash
pip install redis
```
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

    r.set(cache_key, json.dumps(result), ex=60)   # cache for 60 seconds
    return result
```

**4. Rate limiting a user's requests.** Add this to the same file (it reuses the `r` connection from step 3), then try it out by adding the lines at the bottom:
```python
def is_rate_limited(user_id: str, limit: int = 5) -> bool:
    key = f"rate_limit:{user_id}"
    count = r.incr(key)          # increments, starting at 1 if the key doesn't exist
    if count == 1:
        r.expire(key, 60)        # only set expiry on the first request in this window
    return count > limit

print(get_trending_tasks())   # first call: computes and caches the result
print(get_trending_tasks())   # second call: served from Redis

for attempt in range(1, 8):
    print(attempt, "limited" if is_rate_limited("alice") else "allowed")
```
Run `python3 cache_demo.py`. Attempts 1 to 5 are allowed and attempts 6 and 7 are limited; wait a minute and they're allowed again.

### Checkpoint
You can explain why Redis is fast (in-memory) and why it's usually paired with, not a replacement for, a primary database.

### Quiz
1. What makes Redis faster than a typical disk-based database?
2. Why is Redis usually not your main/primary database?
3. What does `EXPIRE` (or the `ex=` option on `set`) let you do that's useful for caching?
4. In the rate-limiting example, what does `r.incr(key)` do the first time it's called for a new key?
5. Name two real product features that rely on something like Redis.

*Answers: 1) Data lives in RAM instead of on disk, and RAM access is dramatically faster. 2) Data in memory is more fragile (lost on restart unless configured otherwise) and RAM is more limited/expensive than disk, so it's used for fast-access or disposable data, not the durable source of truth. 3) Automatically remove a key after a set time, so cached data doesn't go stale forever. 4) It creates the key starting at 1, since it didn't exist before. 5) Caching, session storage, rate limiting, real-time leaderboards (any two).*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "bolt",
   "kicker": "Module 6 · Redis",
   "title": "Extreme speed, for the right job",
   "beats": [
    {
     "say": "Welcome to Module 6."
    },
    {
     "say": "Redis keeps data in memory instead of on disk, which makes it extremely fast."
    },
    {
     "say": "It's usually not your main database. It's a specialised tool alongside one."
    }
   ]
  },
  {
   "kind": "list",
   "art": "checklist",
   "kicker": "Where you'd use this",
   "title": "Four classic jobs",
   "items": [
    [
     "Caching",
     ""
    ],
    [
     "Sessions",
     ""
    ],
    [
     "Rate limiting",
     ""
    ],
    [
     "Leaderboards",
     ""
    ]
   ],
   "beats": [
    {
     "say": "Four classic jobs.",
     "show": 0
    },
    {
     "say": "Caching, so an expensive query isn't recomputed every time.",
     "show": 1
    },
    {
     "say": "Sessions, for logged-in users.",
     "show": 2
    },
    {
     "say": "Rate limiting, counting how many requests someone made in the last minute.",
     "show": 3
    },
    {
     "say": "And real-time leaderboards.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "stopwatch",
   "kicker": "Lab · Step 2",
   "title": "Keys that expire",
   "file": "redis-cli",
   "code": "SET user:1:name \"Alice\"\nGET user:1:name\nEXPIRE user:1:name 3600\nTTL user:1:name",
   "beats": [
    {
     "say": "In redis-cli, set a key, then get it.",
     "show": 0
    },
    {
     "say": "Expire tells Redis to delete it automatically after an hour, and T T L shows the seconds left.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "database",
   "kicker": "Lab · Step 3",
   "title": "Cache an expensive query",
   "steps": [
    "Check the cache",
    "Hit: return instantly",
    "Miss: compute, cache 60s"
   ],
   "beats": [
    {
     "say": "From Python, cache an expensive result.",
     "show": 0
    },
    {
     "say": "Check Redis first.",
     "show": 1
    },
    {
     "say": "If it's there, return it instantly and skip the database.",
     "show": 2
    },
    {
     "say": "If not, compute it, and store it for sixty seconds.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "gauge",
   "kicker": "Lab · Step 4",
   "title": "Rate limiting",
   "file": "cache_demo.py",
   "code": "def is_rate_limited(user_id, limit=5):\n    key = f\"rate_limit:{user_id}\"\n    count = r.incr(key)\n    if count == 1:\n        r.expire(key, 60)\n    return count > limit",
   "beats": [
    {
     "say": "Rate limiting is a counter with an expiry.",
     "show": 0
    },
    {
     "say": "Incr adds one to the user's counter, starting at one if it's new. On the first request, give it a sixty second expiry.",
     "show": 1
    },
    {
     "say": "More than five requests in that minute? Limited. Attempts six and seven are blocked, until the minute passes.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why is Redis usually not your main database?",
   "options": [
    "It's too slow",
    "Data in memory is more fragile and RAM is limited, so it holds fast or disposable data",
    "It can't store text"
   ],
   "answer": 1,
   "good": "That's right. Memory is more fragile and more limited than disk, so Redis holds fast-access or disposable data, not the source of truth.",
   "bad": "Not quite. Memory is more fragile and more limited than disk, so Redis holds fast-access or disposable data, not the source of truth.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why is Redis usually not your main database?",
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
     "You can explain why Redis is fast",
     ""
    ],
    [
     "You can explain why it pairs with a main database",
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
     "say": "you can explain why Redis is fast,",
     "show": 1
    },
    {
     "say": "and why it sits alongside a main database, not instead of one.",
     "show": 2
    },
    {
     "say": "Next, in the last module, choosing the right database.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 7: Choosing the Right Database for the Job

**Time: about 1 hour**

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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "fork",
   "kicker": "Module 7 · Choosing the right database",
   "title": "Ask the right questions",
   "beats": [
    {
     "say": "Welcome to the last module."
    },
    {
     "say": "Real products combine these tools on purpose. The skill is asking the right questions before you choose."
    }
   ]
  },
  {
   "kind": "list",
   "art": "compass",
   "kicker": "Questions to ask",
   "title": "For any new feature",
   "items": [
    [
     "Clear structure and relationships?",
     "PostgreSQL / MySQL"
    ],
    [
     "Shape varies or changes?",
     "MongoDB"
    ],
    [
     "Live updates?",
     "Firebase"
    ],
    [
     "Temporary or cached?",
     "Redis"
    ]
   ],
   "beats": [
    {
     "say": "For any new feature, ask:",
     "show": 0
    },
    {
     "say": "Does the data have clear structure and relationships? Relational.",
     "show": 1
    },
    {
     "say": "Does its shape vary a lot, or change often? Document.",
     "show": 2
    },
    {
     "say": "Do users need live updates instantly? Firebase.",
     "show": 3
    },
    {
     "say": "Is it temporary, or a cache of something stored elsewhere? Redis.",
     "show": 4
    },
    {
     "say": "And how much does strict consistency matter, compared with raw speed?",
     "show": 4
    }
   ]
  },
  {
   "kind": "list",
   "art": "pencil",
   "kicker": "Lab",
   "title": "Decide for TrackIt",
   "items": [
    [
     "Accounts and tasks",
     "PostgreSQL"
    ],
    [
     "Who's online",
     "Firebase"
    ],
    [
     "Weekly summary cache",
     "Redis"
    ],
    [
     "Custom templates",
     "MongoDB"
    ]
   ],
   "beats": [
    {
     "say": "Now decide for four TrackIt features. Pause and make your choices before the answers.",
     "show": 0
    },
    {
     "say": "User accounts and their tasks: PostgreSQL. Structured, relational, needs consistency.",
     "show": 1
    },
    {
     "say": "A live who's online indicator: Firebase. It needs realtime updates.",
     "show": 2
    },
    {
     "say": "Caching a weekly summary: Redis. Temporary, and fine to recompute.",
     "show": 3
    },
    {
     "say": "Custom task templates with wildly different fields: MongoDB. Flexible shapes.",
     "show": 4
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Unsure which to choose? What's a sensible default for most product data?",
   "options": [
    "Redis",
    "A relational database like PostgreSQL",
    "Whatever is newest"
   ],
   "answer": 1,
   "good": "That's right. A relational database like PostgreSQL, because most product data benefits from structure and consistency.",
   "bad": "Not quite. A relational database like PostgreSQL, because most product data benefits from structure and consistency.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Unsure which to choose? What's a sensible default for most product data?",
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
     "Your own reasoning for all four scenarios",
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
     "say": "you've made your own choice, with a reason, for all four scenarios.",
     "show": 1
    },
    {
     "say": "You've finished Databases for Builders. Well done.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Course Completion Checklist
- [ ] Explained all four database types and when to reach for each
- [ ] Read and written core SQL: CREATE, INSERT, SELECT, JOIN, UPDATE, DELETE
- [ ] Created a real table in PostgreSQL and queried it from Python
- [ ] Created the same table in MySQL (local install or Docker) and identified syntax differences from Postgres
- [ ] Inserted documents with different fields into the same MongoDB collection
- [ ] Built a realtime Firestore listener in Firebase
- [ ] Implemented caching and rate limiting with Redis
- [ ] Justified a database choice for four different product scenarios

Every database in this course exists to answer the same underlying question as the data structures course: **what do I need to be true about this data (speed, structure, consistency, realtime-ness), and what am I willing to trade for it?**
