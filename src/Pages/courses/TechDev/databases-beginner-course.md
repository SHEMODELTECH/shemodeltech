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
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Data that outlives your program",
   "nodes": [
    {
     "id": "prog",
     "label": "Your program",
     "x": 14,
     "y": 50,
     "sub": "data in memory",
     "art": "code"
    },
    {
     "id": "db",
     "label": "Database",
     "x": 54,
     "y": 50,
     "sub": "data on disk",
     "art": "database"
    },
    {
     "id": "other",
     "label": "Another user",
     "x": 88,
     "y": 22,
     "sub": "same data, same time",
     "art": "people"
    }
   ],
   "edges": [
    {
     "from": "prog",
     "to": "db"
    },
    {
     "from": "other",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "While your program runs, its data lives in memory.",
     "show": 2,
     "on": "prog"
    },
    {
     "say": "Saving a task writes it to the database, somewhere lasting.",
     "show": 2,
     "on": "db",
     "send": {
      "from": "prog",
      "to": "db",
      "label": "save: Write course notes"
     }
    },
    {
     "say": "Stop the program, and its memory is wiped. The task is still safe in the database.",
     "show": 2,
     "on": "db"
    },
    {
     "say": "Start it again, and read the task straight back.",
     "show": 2,
     "on": "prog",
     "send": {
      "from": "db",
      "to": "prog",
      "label": "read: Write course notes"
     }
    },
    {
     "say": "And another user, or another process, can read and write the same data safely, at the same time.",
     "show": 3,
     "on": [
      "other",
      "db"
     ],
     "send": {
      "from": "other",
      "to": "db",
      "label": "read + write"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Four kinds, four strengths",
   "columns": [
    "Type",
    "Example",
    "Best at"
   ],
   "rows": [
    [
     "Relational (SQL)",
     "PostgreSQL, MySQL",
     "Structure, relationships, consistency"
    ],
    [
     "Document (NoSQL)",
     "MongoDB",
     "Flexible, evolving shapes"
    ],
    [
     "Realtime / BaaS",
     "Firebase",
     "Live updates, little backend code"
    ],
    [
     "In-memory key-value",
     "Redis",
     "Extreme speed: cache, sessions, counters"
    ]
   ],
   "beats": [
    {
     "say": "Here are the four kinds in this course, and what each is best at.",
     "col": 2
    },
    {
     "say": "Relational, like PostgreSQL and MySQL. Structured data with relationships, and strong consistency.",
     "hl": 0
    },
    {
     "say": "Document, like MongoDB. Flexible data whose shape varies or keeps changing.",
     "hl": 1
    },
    {
     "say": "Realtime, like Firebase. Live updates, with very little backend code.",
     "hl": 2
    },
    {
     "say": "And in-memory, like Redis. Extreme speed, for caching, sessions and counters.",
     "hl": 3,
     "dim": true
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Where you'd use this",
   "title": "Real products use several at once",
   "nodes": [
    {
     "id": "app",
     "label": "Your product",
     "x": 14,
     "y": 50,
     "sub": "one app",
     "art": "laptop"
    },
    {
     "id": "pg",
     "label": "PostgreSQL",
     "x": 80,
     "y": 18,
     "sub": "users, orders",
     "art": "database"
    },
    {
     "id": "rd",
     "label": "Redis",
     "x": 80,
     "y": 50,
     "sub": "sessions, cache",
     "art": "bolt"
    },
    {
     "id": "fb",
     "label": "Firebase",
     "x": 80,
     "y": 82,
     "sub": "chat",
     "art": "cloud"
    }
   ],
   "edges": [
    {
     "from": "app",
     "to": "pg"
    },
    {
     "from": "app",
     "to": "rd"
    },
    {
     "from": "app",
     "to": "fb"
    }
   ],
   "beats": [
    {
     "say": "Most real products use more than one database at once.",
     "show": 1,
     "on": "app"
    },
    {
     "say": "PostgreSQL holds users and orders, which need consistency and relationships.",
     "show": 2,
     "on": "pg",
     "send": {
      "from": "app",
      "to": "pg",
      "label": "new order"
     }
    },
    {
     "say": "Redis holds sessions and cached results, which need speed.",
     "show": 3,
     "on": "rd",
     "send": {
      "from": "app",
      "to": "rd",
      "label": "session lookup"
     }
    },
    {
     "say": "And maybe Firebase runs a chat feature, pushing new messages live.",
     "show": 4,
     "on": "fb",
     "send": {
      "from": "fb",
      "to": "app",
      "label": "new message, live"
     }
    },
    {
     "say": "Picking the wrong one for a job is one of the most common early architecture mistakes.",
     "show": 4,
     "on": [
      "pg",
      "rd",
      "fb"
     ]
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
     "say": "For TrackIt, a simple task tracker we'll use all course, or your own idea, write one paragraph: which of the four would you reach for first, and why?",
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
   "kind": "table",
   "kicker": "Concept",
   "title": "Four operations spell CRUD",
   "columns": [
    "Letter",
    "Operation",
    "SQL"
   ],
   "rows": [
    [
     "C",
     "Create",
     "CREATE TABLE · INSERT"
    ],
    [
     "R",
     "Read",
     "SELECT"
    ],
    [
     "U",
     "Update",
     "UPDATE"
    ],
    [
     "D",
     "Delete",
     "DELETE"
    ]
   ],
   "beats": [
    {
     "say": "The four core operations spell CRUD.",
     "col": 0
    },
    {
     "say": "Create: make a table, then insert rows into it.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "Read: select rows back out.",
     "hl": 1,
     "col": 2
    },
    {
     "say": "Update: change rows that already exist.",
     "hl": 2,
     "col": 2
    },
    {
     "say": "And delete: remove rows. Let's watch each one on real rows.",
     "hl": 3,
     "col": 2
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Create and read",
   "title": "The users table",
   "columns": [
    "id",
    "email",
    "created_at"
   ],
   "rows": [
    [
     "1",
     "alice@example.com",
     "2026-07-01 09:00"
    ],
    [
     "2",
     "bob@example.com",
     "2026-07-01 09:05"
    ],
    [
     "3",
     "chidi@example.com",
     "2026-07-01 09:12"
    ]
   ],
   "beats": [
    {
     "say": "Create table defines users, with three columns. Here it is after three people signed up.",
     "sql": "CREATE TABLE users (\n    id SERIAL PRIMARY KEY,\n    email VARCHAR(255) UNIQUE NOT NULL,\n    created_at TIMESTAMP DEFAULT NOW()\n);"
    },
    {
     "say": "I D is serial, so the database numbers each new row itself: one, two, three. It's the primary key, so no two rows share one.",
     "col": 0
    },
    {
     "say": "Alice's insert gave only an email. Her I D and created at time filled themselves in.",
     "sql": "INSERT INTO users (email) VALUES ('alice@example.com');",
     "hl": 0,
     "col": 2
    },
    {
     "say": "Run that same insert again, and it fails. Email is unique, and row one already has it.",
     "sql": "INSERT INTO users (email) VALUES ('alice@example.com');\n-- ERROR: duplicate key value violates unique constraint",
     "hl": 0,
     "col": 1
    },
    {
     "say": "Now read. Select checks every row's email, and only row one matches.",
     "sql": "SELECT id, email FROM users WHERE email = 'alice@example.com';",
     "hl": 0,
     "dim": true,
     "col": 1
    },
    {
     "say": "We asked for just I D and email, so that's what comes back: one, alice at example dot com.",
     "hl": 0,
     "dim": true,
     "col": 0
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · JOIN",
   "title": "tasks point at users through owner_id",
   "nodes": [
    {
     "id": "t1",
     "label": "Write course notes",
     "x": 20,
     "y": 18,
     "sub": "owner_id 1",
     "art": "checklist"
    },
    {
     "id": "t2",
     "label": "Review PR",
     "x": 20,
     "y": 50,
     "sub": "owner_id 2",
     "art": "checklist"
    },
    {
     "id": "t3",
     "label": "Design logo",
     "x": 20,
     "y": 82,
     "sub": "owner_id 1",
     "art": "checklist"
    },
    {
     "id": "u1",
     "label": "alice@example.com",
     "x": 80,
     "y": 30,
     "sub": "users.id 1",
     "art": "persona"
    },
    {
     "id": "u2",
     "label": "bob@example.com",
     "x": 80,
     "y": 70,
     "sub": "users.id 2",
     "art": "persona"
    }
   ],
   "edges": [
    {
     "from": "t1",
     "to": "u1"
    },
    {
     "from": "t2",
     "to": "u2"
    },
    {
     "from": "t3",
     "to": "u1"
    }
   ],
   "beats": [
    {
     "say": "A second table, tasks. Each task stores an owner I D: the I D of the user who owns it.",
     "show": 3,
     "on": [
      "t1",
      "t2",
      "t3"
     ]
    },
    {
     "say": "And here are the users those numbers point to.",
     "show": 5,
     "on": [
      "u1",
      "u2"
     ]
    },
    {
     "say": "Write course notes has owner I D one, which matches Alice's I D.",
     "on": [
      "t1",
      "u1"
     ],
     "send": {
      "from": "t1",
      "to": "u1",
      "label": "owner_id 1 = id 1"
     }
    },
    {
     "say": "Review P R has owner I D two. That's Bob.",
     "on": [
      "t2",
      "u2"
     ],
     "send": {
      "from": "t2",
      "to": "u2",
      "label": "owner_id 2 = id 2"
     }
    },
    {
     "say": "Design logo has owner I D one again. Alice.",
     "on": [
      "t3",
      "u1"
     ],
     "send": {
      "from": "t3",
      "to": "u1",
      "label": "owner_id 1 = id 1"
     }
    },
    {
     "say": "That matching rule, owner I D equals users dot I D, is exactly what a join uses.",
     "on": [
      "t1",
      "t3",
      "u1"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · JOIN",
   "title": "JOIN glues matching rows together",
   "columns": [
    "tasks.title",
    "tasks.owner_id",
    "users.id",
    "users.email"
   ],
   "rows": [
    [
     "Write course notes",
     "1",
     "1",
     "alice@example.com"
    ],
    [
     "Review PR",
     "2",
     "2",
     "bob@example.com"
    ],
    [
     "Design logo",
     "1",
     "1",
     "alice@example.com"
    ]
   ],
   "beats": [
    {
     "say": "Join pairs each task with the user whose I D equals its owner I D, making one wide row.",
     "sql": "FROM tasks\nJOIN users ON tasks.owner_id = users.id",
     "col": 1
    },
    {
     "say": "See how the two middle columns always match. That's the on condition.",
     "col": 2
    },
    {
     "say": "Now the where clause keeps only rows whose email is Alice's. Two rows pass.",
     "sql": "SELECT tasks.title, users.email\nFROM tasks\nJOIN users ON tasks.owner_id = users.id\nWHERE users.email = 'alice@example.com';",
     "hl": [
      0,
      2
     ],
     "dim": true,
     "col": 3
    },
    {
     "say": "We selected task title and user email, so the answer is: Write course notes, and Design logo, each with Alice's email.",
     "hl": [
      0,
      2
     ],
     "dim": true,
     "col": 0
    },
    {
     "say": "One table alone couldn't tell you that. The title lives in tasks, and the email lives in users.",
     "hl": [
      0,
      2
     ]
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Update and delete",
   "title": "WHERE decides which rows change",
   "values": [
    "1 · alice@example.com",
    "2 · bob@example.com",
    "3 · chidi@example.com"
   ],
   "beats": [
    {
     "say": "Back to the three users."
    },
    {
     "say": "Update users, set a new email, where I D is one.",
     "ptr": {
      "id = 1": 0
     },
     "hl": 0,
     "note": "UPDATE users SET email = 'alice.new@example.com' WHERE id = 1;"
    },
    {
     "say": "Where narrows it to row one, so only Alice's email changes.",
     "vals": [
      "1 · alice.new@example.com",
      "2 · bob@example.com",
      "3 · chidi@example.com"
     ],
     "hl": 0,
     "ok": [
      0
     ]
    },
    {
     "say": "Delete from users where I D is one removes just that row.",
     "gone": [
      0
     ],
     "note": "DELETE FROM users WHERE id = 1;"
    },
    {
     "say": "But leave off the where, and every single row is deleted. Update without where changes every row too.",
     "gone": [
      0,
      1,
      2
     ],
     "note": "DELETE FROM users;  → every row gone"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab",
   "title": "Read SQL as plain English",
   "columns": [
    "SQL",
    "In plain English"
   ],
   "rows": [
    [
     "SELECT id, email FROM users WHERE email = 'alice@…'",
     "Get Alice's id and email"
    ],
    [
     "SELECT tasks.title, users.email … JOIN users …",
     "List Alice's task titles, with her email"
    ],
    [
     "UPDATE users SET email = … WHERE id = 1",
     "Change user 1's email"
    ],
    [
     "DELETE FROM users WHERE id = 1",
     "Remove user 1"
    ]
   ],
   "beats": [
    {
     "say": "Your lab: translate each query into one plain English sentence.",
     "col": 0
    },
    {
     "say": "Select I D and email, where email is Alice's, becomes: get Alice's I D and email.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "Do the rest on paper before you check. Reading SQL fluently is the real skill, not memorising syntax.",
     "hl": [
      1,
      2,
      3
     ],
     "col": 1
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
     "say": "What happens if you insert the same email twice, when email is unique?",
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
   "kind": "walk",
   "kicker": "Lab · Steps 1 and 2",
   "title": "Build TrackIt's table in psql",
   "file": "psql",
   "code": "CREATE DATABASE trackit;\n\\c trackit\n\nCREATE TABLE tasks (\n    id SERIAL PRIMARY KEY,\n    title VARCHAR(255) NOT NULL,\n    done BOOLEAN DEFAULT FALSE,\n    due_date DATE\n);\n\nINSERT INTO tasks (title, due_date) VALUES ('Write course notes', '2026-07-10');\nINSERT INTO tasks (title, due_date) VALUES ('Review PR', '2026-07-05');\n\nSELECT * FROM tasks WHERE done = FALSE ORDER BY due_date ASC;",
   "beats": [
    {
     "say": "Install Postgres, or use a free hosted one like Supabase or Neon. Then open psql, its command line tool.",
     "vars": {
      "connected to": "postgres",
      "tasks": "—"
     }
    },
    {
     "say": "Create database trackit makes a new, empty database.",
     "line": 1,
     "out": "CREATE DATABASE"
    },
    {
     "say": "Backslash c switches into it.",
     "line": 2,
     "vars": {
      "connected to": "trackit"
     },
     "out": "You are now connected to database \"trackit\" as user \"postgres\"."
    },
    {
     "say": "Create table makes tasks. Title is required, and done defaults to false.",
     "line": [
      4,
      9
     ],
     "vars": {
      "tasks": "0 rows"
     },
     "out": "CREATE TABLE"
    },
    {
     "say": "Insert the first task. Psql replies insert zero one: one row added.",
     "line": 11,
     "vars": {
      "tasks": "1 row"
     },
     "out": "INSERT 0 1"
    },
    {
     "say": "Insert a second, Review P R.",
     "line": 12,
     "vars": {
      "tasks": "2 rows"
     },
     "out": "INSERT 0 1"
    },
    {
     "say": "Select every unfinished task, soonest due date first. Review P R, due July fifth, comes out on top.",
     "line": 14,
     "out": [
      " id |       title        | done |  due_date",
      "----+--------------------+------+------------",
      "  2 | Review PR          | f    | 2026-07-05",
      "  1 | Write course notes | f    | 2026-07-10",
      "(2 rows)"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 2",
   "title": "What's really in the tasks table",
   "columns": [
    "id",
    "title",
    "done",
    "due_date"
   ],
   "rows": [
    [
     "1",
     "Write course notes",
     "false",
     "2026-07-10"
    ],
    [
     "2",
     "Review PR",
     "false",
     "2026-07-05"
    ]
   ],
   "beats": [
    {
     "say": "Here are the two rows, in the order they were inserted."
    },
    {
     "say": "We never typed an I D. Serial numbered them one and two.",
     "col": 0
    },
    {
     "say": "Newer code may write generated always as identity instead. Same auto numbering, the S Q L standard way.",
     "sql": "id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY",
     "col": 0
    },
    {
     "say": "We never typed done either. Default false filled it in on both rows.",
     "sql": "done BOOLEAN DEFAULT FALSE",
     "col": 2
    },
    {
     "say": "So where done equals false keeps both rows.",
     "sql": "SELECT * FROM tasks WHERE done = FALSE ORDER BY due_date ASC;",
     "hl": [
      0,
      1
     ],
     "col": 2
    },
    {
     "say": "Order by due date ascending puts the earliest date first. That's row two, July fifth.",
     "hl": 1,
     "dim": true,
     "col": 3
    },
    {
     "say": "And a task with no title? Postgres refuses it, because title is not null.",
     "sql": "INSERT INTO tasks (due_date) VALUES ('2026-07-12');\n-- ERROR: null value in column \"title\" violates not-null constraint",
     "col": 1
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 3",
   "title": "Your code talks to the database",
   "nodes": [
    {
     "id": "sh",
     "label": "Terminal",
     "x": 14,
     "y": 22,
     "sub": "export PGPASSWORD=…",
     "art": "terminal"
    },
    {
     "id": "py",
     "label": "Python script",
     "x": 50,
     "y": 72,
     "sub": "psycopg driver",
     "art": "code"
    },
    {
     "id": "pg",
     "label": "PostgreSQL",
     "x": 86,
     "y": 22,
     "sub": "trackit database",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "sh",
     "to": "py"
    },
    {
     "from": "py",
     "to": "pg"
    }
   ],
   "beats": [
    {
     "say": "Your app can't type into psql. It needs to talk to the database in code. Install psycopg, the Python driver, with pip.",
     "show": 3,
     "on": "py"
    },
    {
     "say": "Keep the password out of your code. Set it in the terminal as an environment variable called P G password.",
     "on": "sh",
     "send": {
      "from": "sh",
      "to": "py",
      "label": "PGPASSWORD"
     }
    },
    {
     "say": "The script connects to trackit on this machine, and sends the same query.",
     "on": "pg",
     "send": {
      "from": "py",
      "to": "pg",
      "label": "connect + SELECT"
     }
    },
    {
     "say": "Postgres sends back the two unfinished tasks.",
     "on": "py",
     "send": {
      "from": "pg",
      "to": "py",
      "label": "2 rows"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 3",
   "title": "Run the query from Python",
   "file": "Python",
   "code": "import os\nimport psycopg\n\nconn = psycopg.connect(\n    dbname=\"trackit\",\n    user=\"postgres\",\n    password=os.environ[\"PGPASSWORD\"],\n    host=\"localhost\",\n)\ncur = conn.cursor()\ncur.execute(\"SELECT title, due_date FROM tasks WHERE done = FALSE ORDER BY due_date ASC;\")\nfor row in cur.fetchall():\n    print(row)\nconn.close()",
   "beats": [
    {
     "say": "Import os, to read environment variables, and psycopg.",
     "line": [
      1,
      2
     ]
    },
    {
     "say": "Connect: database trackit, user postgres, the password read from P G password, on localhost.",
     "line": [
      4,
      9
     ],
     "vars": {
      "conn": "open → trackit"
     }
    },
    {
     "say": "A cursor is the object that runs queries for you.",
     "line": 10,
     "vars": {
      "cur": "cursor"
     }
    },
    {
     "say": "Execute sends the select: title and due date of unfinished tasks, soonest first.",
     "line": 11
    },
    {
     "say": "Fetch all returns the rows. The first is Review P R. Notice the date comes back as a real Python date.",
     "line": [
      12,
      13
     ],
     "vars": {
      "row": "('Review PR', date(2026, 7, 5))"
     },
     "out": "('Review PR', datetime.date(2026, 7, 5))"
    },
    {
     "say": "Then Write course notes, due July tenth.",
     "line": [
      12,
      13
     ],
     "vars": {
      "row": "('Write course notes', date(2026, 7, 10))"
     },
     "out": "('Write course notes', datetime.date(2026, 7, 10))"
    },
    {
     "say": "Close the connection when you're done.",
     "line": 14,
     "vars": {
      "conn": "closed"
     }
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
   "kind": "diagram",
   "kicker": "Lab · Step 1",
   "title": "Get a MySQL server running",
   "nodes": [
    {
     "id": "term",
     "label": "Your terminal",
     "x": 14,
     "y": 50,
     "sub": "mysql -u root -p",
     "art": "terminal"
    },
    {
     "id": "dock",
     "label": "Docker",
     "x": 50,
     "y": 18,
     "sub": "mysql:8.4 image",
     "art": "container"
    },
    {
     "id": "ctr",
     "label": "trackit-mysql",
     "x": 86,
     "y": 50,
     "sub": "MySQL 8.4 · port 3306",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "term",
     "to": "dock"
    },
    {
     "from": "dock",
     "to": "ctr"
    },
    {
     "from": "term",
     "to": "ctr"
    }
   ],
   "beats": [
    {
     "say": "Option one: install MySQL Community Server, or on a Mac, brew install mysql. Then mysql, dash u root, dash p, opens the client.",
     "show": 1,
     "on": "term"
    },
    {
     "say": "Option two: Docker.",
     "show": 3
    },
    {
     "say": "Docker run fetches MySQL eight point four, the long term support release.",
     "on": "dock",
     "send": {
      "from": "term",
      "to": "dock",
      "label": "docker run … mysql:8.4"
     }
    },
    {
     "say": "It starts a container called trackit mysql, with your root password, on port thirty three oh six.",
     "on": "ctr",
     "send": {
      "from": "dock",
      "to": "ctr",
      "label": "start · root password · 3306"
     }
    },
    {
     "say": "Docker exec opens the MySQL client inside that container.",
     "on": [
      "term",
      "ctr"
     ],
     "send": {
      "from": "term",
      "to": "ctr",
      "label": "docker exec … mysql -u root -p"
     }
    },
    {
     "say": "If it says it can't connect, MySQL is still starting. Wait twenty to thirty seconds, then try again.",
     "on": "ctr"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 2",
   "title": "The same table, in MySQL",
   "file": "mysql",
   "code": "CREATE DATABASE trackit;\nUSE trackit;\n\nCREATE TABLE tasks (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    title VARCHAR(255) NOT NULL,\n    done BOOLEAN DEFAULT FALSE,\n    due_date DATE\n);\n\nINSERT INTO tasks (title, due_date) VALUES ('Write course notes', '2026-07-10');\n\nSELECT * FROM tasks WHERE done = FALSE ORDER BY due_date ASC;",
   "beats": [
    {
     "say": "Here's the same tasks table, in MySQL.",
     "line": 1,
     "out": "Query OK, 1 row affected"
    },
    {
     "say": "Use trackit switches database. Postgres used backslash c.",
     "line": 2,
     "out": "Database changed"
    },
    {
     "say": "The I D uses auto increment, where Postgres used serial. Everything else matches.",
     "line": [
      4,
      9
     ],
     "out": "Query OK, 0 rows affected"
    },
    {
     "say": "The insert is identical.",
     "line": 11,
     "vars": {
      "tasks": "1 row"
     },
     "out": "Query OK, 1 row affected"
    },
    {
     "say": "So is the select. One small surprise: MySQL stores a boolean as a tiny number, so false shows as zero.",
     "line": 13,
     "out": [
      "| id | title              | done | due_date   |",
      "|  1 | Write course notes |    0 | 2026-07-10 |",
      "1 row in set"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 3",
   "title": "Spot the differences",
   "columns": [
    "Part",
    "PostgreSQL",
    "MySQL"
   ],
   "rows": [
    [
     "Switch database",
     "\\c trackit",
     "USE trackit;"
    ],
    [
     "Auto-numbered id",
     "SERIAL",
     "INT AUTO_INCREMENT"
    ],
    [
     "title column",
     "VARCHAR(255) NOT NULL",
     "VARCHAR(255) NOT NULL"
    ],
    [
     "done column",
     "BOOLEAN DEFAULT FALSE",
     "BOOLEAN DEFAULT FALSE"
    ],
    [
     "The query",
     "SELECT … WHERE … ORDER BY",
     "SELECT … WHERE … ORDER BY"
    ]
   ],
   "beats": [
    {
     "say": "Line the two versions up side by side.",
     "col": 0
    },
    {
     "say": "Difference one: switching database. Backslash c in Postgres, use in MySQL.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "Difference two: auto numbered I Ds. Serial in Postgres, auto increment in MySQL.",
     "hl": 1,
     "col": 2
    },
    {
     "say": "Everything else, the columns and the query, is the same.",
     "hl": [
      2,
      3,
      4
     ],
     "dim": true
    },
    {
     "say": "Differences show up mostly in setup, functions and advanced features, not in everyday queries.",
     "hl": [
      0,
      1
     ],
     "col": 0
    },
    {
     "say": "That's why S Q L experience transfers between them, with only small adjustments.",
     "hl": 4,
     "col": 1
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
     "say": "Does S Q L experience transfer between MySQL and Postgres?",
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
   "kind": "walk",
   "kicker": "Lab · Step 2",
   "title": "Two tasks, two different shapes",
   "file": "mongosh",
   "code": "use trackit\ndb.tasks.insertOne({\n  title: \"Write course notes\", done: false,\n  due_date: new Date(\"2026-07-10\"),\n  tags: [\"writing\", \"course\"]\n})\ndb.tasks.insertOne({\n  title: \"Design logo\", done: false,\n  due_date: new Date(\"2026-07-08\"),\n  design_tool: \"Figma\"\n})\ndb.tasks.find({ done: false }).sort({ due_date: 1 })",
   "beats": [
    {
     "say": "In mongosh, use trackit switches to the trackit database.",
     "line": 1,
     "out": "switched to db trackit"
    },
    {
     "say": "Insert a task with a title, done, a due date, and a list of tags.",
     "line": [
      2,
      6
     ],
     "vars": {
      "tasks": "1 document"
     },
     "out": "{ acknowledged: true, insertedId: ObjectId('…') }"
    },
    {
     "say": "Insert a second task. No tags this time, but a design tool field instead.",
     "line": [
      7,
      11
     ],
     "vars": {
      "tasks": "2 documents"
     },
     "out": "{ acknowledged: true, insertedId: ObjectId('…') }"
    },
    {
     "say": "No schema change, no error. Different fields in one collection is completely normal here.",
     "line": [
      5,
      10
     ]
    },
    {
     "say": "Find every unfinished task, with due date one, meaning ascending. Design logo, July eighth, comes first.",
     "line": 12,
     "out": [
      "{ _id: ObjectId('…'), title: 'Design logo', … }",
      "{ _id: ObjectId('…'), title: 'Write course notes', … }"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 3",
   "title": "If those two tasks were a SQL table",
   "columns": [
    "title",
    "done",
    "due_date",
    "tags",
    "design_tool"
   ],
   "rows": [
    [
     "Write course notes",
     "false",
     "2026-07-10",
     "writing, course",
     "NULL"
    ],
    [
     "Design logo",
     "false",
     "2026-07-08",
     "NULL",
     "Figma"
    ]
   ],
   "beats": [
    {
     "say": "Picture those two documents forced into one relational table."
    },
    {
     "say": "Every row needs every column. So the notes task gets an empty design tool.",
     "hl": 0,
     "col": 4
    },
    {
     "say": "And the logo task gets empty tags.",
     "hl": 1,
     "col": 3
    },
    {
     "say": "Each new kind of task means a schema change, or more nullable columns.",
     "col": 4
    },
    {
     "say": "In MongoDB, each document simply carries the fields it has. That's why it suits product catalogues, user content, logs, and early products.",
     "hl": [
      0,
      1
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 4",
   "title": "Insert and query from Python",
   "file": "Python",
   "code": "from datetime import datetime\n\nfrom pymongo import MongoClient\n\nclient = MongoClient(\"mongodb://localhost:27017\")\ndb = client[\"trackit\"]\n\ndb.tasks.insert_one({\"title\": \"Review PR\", \"done\": False, \"due_date\": datetime(2026, 7, 5)})\n\nfor task in db.tasks.find({\"done\": False}).sort(\"due_date\", 1):\n    print(task)",
   "beats": [
    {
     "say": "Install pymongo, then connect to MongoDB on this machine, port twenty seven oh one seven.",
     "line": [
      3,
      5
     ],
     "vars": {
      "client": "localhost:27017"
     }
    },
    {
     "say": "Pick the trackit database, the same one mongosh used.",
     "line": 6,
     "vars": {
      "db": "trackit"
     }
    },
    {
     "say": "Insert a third task, Review P R, due July fifth.",
     "line": 8,
     "vars": {
      "tasks": "3 documents"
     }
    },
    {
     "say": "Find unfinished tasks, sorted by due date, one meaning ascending. Review P R is earliest.",
     "line": [
      10,
      11
     ],
     "vars": {
      "task": "Review PR"
     },
     "out": "{'_id': ObjectId('…'), 'title': 'Review PR', …}"
    },
    {
     "say": "Then Design logo, then Write course notes. Each prints as a Python dictionary.",
     "line": [
      10,
      11
     ],
     "vars": {
      "task": "Write course notes"
     },
     "out": [
      "{'_id': ObjectId('…'), 'title': 'Design logo', …}",
      "{'_id': ObjectId('…'), 'title': 'Write course notes', …}"
     ]
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Step 4",
   "title": "One collection, sorted by due_date",
   "values": [
    "Write course notes · Jul 10",
    "Design logo · Jul 8",
    "Review PR · Jul 5"
   ],
   "beats": [
    {
     "say": "Here are the three task documents, in the order they were inserted."
    },
    {
     "say": "Find done false: all three are unfinished, so all three match.",
     "hl": [
      0,
      1,
      2
     ],
     "note": "find({ done: false })"
    },
    {
     "say": "Sort due date one puts the earliest first.",
     "vals": [
      "Review PR · Jul 5",
      "Design logo · Jul 8",
      "Write course notes · Jul 10"
     ],
     "ok": [
      0,
      1,
      2
     ],
     "note": "sort({ due_date: 1 }) → earliest first"
    },
    {
     "say": "Notice it sorts fine even though the documents have different fields.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": [
      1,
      2
     ],
     "note": "design_tool / tags don't matter here"
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
     "say": "What's MongoDB's word for what S Q L calls a table?",
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
     "say": "Create a Firestore database in test mode.",
     "show": 2
    },
    {
     "say": "Register a web app, and copy its config.",
     "show": 3
    },
    {
     "say": "Then make a small Vite project, and install Firebase.",
     "show": 4
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 1",
   "title": "Who can read and write?",
   "columns": [
    "Setting",
    "Who can read and write",
    "The catch"
   ],
   "rows": [
    [
     "Production mode",
     "Nobody, until you write rules",
     "Lab code fails: permission error"
    ],
    [
     "Test mode",
     "Anyone, for now",
     "Expires after 30 days"
    ],
    [
     "Real security rules",
     "Only who your rules allow",
     "You have to write them"
    ]
   ],
   "beats": [
    {
     "say": "When the browser talks straight to the database, security rules decide who gets in.",
     "col": 1
    },
    {
     "say": "Production mode blocks everything until you write rules, so the lab code would fail.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "Test mode lets anyone in, which is why we pick it for the lab. Its rules expire after thirty days.",
     "hl": 1,
     "col": 2
    },
    {
     "say": "Before anyone else uses your app, write real rules.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "And the web config isn't a secret. It only identifies your project. The rules protect your data.",
     "hl": 2,
     "dim": true,
     "col": 1
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 3",
   "title": "Add a task, then listen",
   "file": "src/main.js",
   "code": "const app = initializeApp(firebaseConfig);\nconst db = getFirestore(app);\nawait addDoc(collection(db, \"tasks\"), {\n  title: \"Write course notes\",\n  done: false,\n  dueDate: \"2026-07-10\",\n});\n\nconst tasksQuery = query(collection(db, \"tasks\"), where(\"done\", \"==\", false));\nonSnapshot(tasksQuery, (snapshot) => {\n  snapshot.forEach((doc) => {\n    console.log(doc.id, doc.data());\n  });\n});",
   "beats": [
    {
     "say": "Start the app with your config, and get the Firestore database.",
     "line": [
      1,
      2
     ]
    },
    {
     "say": "Add doc saves a task into the tasks collection. Firestore makes up its I D.",
     "line": [
      3,
      7
     ],
     "vars": {
      "tasks collection": "1 doc"
     }
    },
    {
     "say": "Build a query: tasks where done equals false.",
     "line": 9
    },
    {
     "say": "On snapshot attaches a listener to that query. It doesn't fetch once and stop. It keeps listening.",
     "line": 10
    },
    {
     "say": "Right away the callback runs, and logs each matching task. Just one so far.",
     "line": [
      11,
      12
     ],
     "out": "k2Jd9… {title: 'Write course notes', …}"
    },
    {
     "say": "Now add a task by hand in the Firebase console. The callback runs again by itself, and logs the new list of two.",
     "line": [
      10,
      12
     ],
     "vars": {
      "tasks collection": "2 docs"
     },
     "out": [
      "k2Jd9… {title: 'Write course notes', …}",
      "Pq7xA… {title: 'Review PR', …}"
     ]
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 4",
   "title": "Firestore pushes changes to you",
   "nodes": [
    {
     "id": "page",
     "label": "Your page",
     "x": 14,
     "y": 50,
     "sub": "browser console",
     "art": "browser"
    },
    {
     "id": "fs",
     "label": "Firestore",
     "x": 54,
     "y": 50,
     "sub": "tasks collection",
     "art": "cloud"
    },
    {
     "id": "con",
     "label": "Firebase console",
     "x": 88,
     "y": 20,
     "sub": "you, by hand",
     "art": "laptop"
    }
   ],
   "edges": [
    {
     "from": "page",
     "to": "fs"
    },
    {
     "from": "con",
     "to": "fs"
    }
   ],
   "beats": [
    {
     "say": "Here's what just happened, as a picture.",
     "show": 2
    },
    {
     "say": "The page saves a task.",
     "on": "fs",
     "send": {
      "from": "page",
      "to": "fs",
      "label": "addDoc: Write course notes"
     }
    },
    {
     "say": "Then it subscribes. Firestore remembers this page is listening for unfinished tasks.",
     "on": "fs",
     "send": {
      "from": "page",
      "to": "fs",
      "label": "onSnapshot: done == false"
     }
    },
    {
     "say": "It sends the current list straight away: one task.",
     "on": "page",
     "send": {
      "from": "fs",
      "to": "page",
      "label": "snapshot: 1 task"
     }
    },
    {
     "say": "Now you add Review P R in the console, with done set to false.",
     "show": 3,
     "on": "con",
     "send": {
      "from": "con",
      "to": "fs",
      "label": "add: Review PR, done: false"
     }
    },
    {
     "say": "Firestore pushes the new list to the page instantly. You wrote no polling and no websocket code.",
     "on": "page",
     "send": {
      "from": "fs",
      "to": "page",
      "label": "snapshot: 2 tasks"
     }
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
   "kind": "diagram",
   "kicker": "Where you'd use this",
   "title": "Redis sits beside your main database",
   "nodes": [
    {
     "id": "app",
     "label": "Your app",
     "x": 14,
     "y": 50,
     "sub": "TrackIt server",
     "art": "server"
    },
    {
     "id": "rd",
     "label": "Redis",
     "x": 82,
     "y": 22,
     "sub": "in memory · very fast",
     "art": "bolt"
    },
    {
     "id": "pg",
     "label": "PostgreSQL",
     "x": 82,
     "y": 78,
     "sub": "on disk · source of truth",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "app",
     "to": "rd"
    },
    {
     "from": "app",
     "to": "pg"
    }
   ],
   "beats": [
    {
     "say": "Redis usually sits beside your main database, not instead of it.",
     "show": 3
    },
    {
     "say": "Things you can't lose, like users and tasks, go to the main database, on disk.",
     "on": "pg",
     "send": {
      "from": "app",
      "to": "pg",
      "label": "save task"
     }
    },
    {
     "say": "Logged in users' sessions go to Redis, held in memory, so reads are extremely fast.",
     "on": "rd",
     "send": {
      "from": "app",
      "to": "rd",
      "label": "session: user 1"
     }
    },
    {
     "say": "So do counters, for rate limiting, and real-time leaderboards.",
     "on": "rd",
     "send": {
      "from": "app",
      "to": "rd",
      "label": "rate_limit:alice +1"
     }
    },
    {
     "say": "And cached copies of expensive results, so you don't recompute them every time.",
     "on": "rd",
     "send": {
      "from": "app",
      "to": "rd",
      "label": "cache: trending_tasks"
     }
    },
    {
     "say": "If Redis restarts and loses that, nothing important is gone. The truth is still on disk.",
     "on": [
      "rd",
      "pg"
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 2",
   "title": "Keys that expire",
   "file": "redis-cli",
   "code": "SET user:1:name \"Alice\"\nGET user:1:name\nEXPIRE user:1:name 3600\nTTL user:1:name",
   "beats": [
    {
     "say": "In redis cli, set stores the value Alice under the key user colon one colon name.",
     "line": 1,
     "vars": {
      "user:1:name": "\"Alice\"",
      "expires in": "never"
     },
     "out": "OK"
    },
    {
     "say": "Get reads it straight back.",
     "line": 2,
     "out": "\"Alice\""
    },
    {
     "say": "Expire gives the key a life of thirty six hundred seconds: one hour. The one means it worked.",
     "line": 3,
     "vars": {
      "expires in": "3600 s"
     },
     "out": "(integer) 1"
    },
    {
     "say": "T T L asks how many seconds are left. Right now, about thirty six hundred.",
     "line": 4,
     "out": "(integer) 3600"
    },
    {
     "say": "When that reaches zero, Redis deletes the key by itself.",
     "line": 4,
     "vars": {
      "user:1:name": "(deleted)",
      "expires in": "—"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 3",
   "title": "Cache an expensive result",
   "file": "cache_demo.py",
   "code": "def get_trending_tasks():\n    cache_key = \"trending_tasks\"\n    cached = r.get(cache_key)\n    if cached:\n        return json.loads(cached)   # instant, skips the database entirely\n\n    # Pretend this is an expensive database query\n    result = [\"Write course notes\", \"Design logo\", \"Review PR\"]\n    r.set(cache_key, json.dumps(result), ex=60)   # cache for 60 seconds\n    return result\n\nprint(get_trending_tasks())   # first call: computes and caches the result\nprint(get_trending_tasks())   # second call: served from Redis",
   "beats": [
    {
     "say": "First call. Ask Redis for trending tasks. Nothing's there yet, so cached is None.",
     "line": [
      12,
      3
     ],
     "vars": {
      "cached": "None",
      "Redis: trending_tasks": "(empty)"
     }
    },
    {
     "say": "None counts as false, so we skip the early return.",
     "line": 4
    },
    {
     "say": "Do the expensive work. Here we pretend, with a list of three tasks.",
     "line": 8,
     "vars": {
      "result": "[3 tasks]"
     }
    },
    {
     "say": "Save it in Redis as J S O N text, expiring in sixty seconds.",
     "line": 9,
     "vars": {
      "Redis: trending_tasks": "'[\"Write course notes\", …]' · 60 s"
     }
    },
    {
     "say": "Return it, and print.",
     "line": [
      10,
      12
     ],
     "out": "['Write course notes', 'Design logo', 'Review PR']"
    },
    {
     "say": "Second call. This time Redis has it, so cached holds the J S O N text.",
     "line": [
      13,
      3
     ],
     "vars": {
      "cached": "'[\"Write course notes\", …]'",
      "result": "—"
     }
    },
    {
     "say": "J S O N dot loads turns it back into a list, and we return straight away. The database is never touched.",
     "line": [
      4,
      5
     ],
     "out": "['Write course notes', 'Design logo', 'Review PR']"
    },
    {
     "say": "After sixty seconds the key expires, and the next call computes fresh data.",
     "line": 9,
     "vars": {
      "Redis: trending_tasks": "(expired)"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 4",
   "title": "Rate limiting, attempt by attempt",
   "columns": [
    "attempt",
    "count",
    "count == 1?",
    "count > 5?",
    "prints"
   ],
   "rows": [
    [
     "1",
     "1",
     "yes: expire 60s",
     "False",
     "1 allowed"
    ],
    [
     "2",
     "2",
     "no",
     "False",
     "2 allowed"
    ],
    [
     "3",
     "3",
     "no",
     "False",
     "3 allowed"
    ],
    [
     "4",
     "4",
     "no",
     "False",
     "4 allowed"
    ],
    [
     "5",
     "5",
     "no",
     "False",
     "5 allowed"
    ],
    [
     "6",
     "6",
     "no",
     "True",
     "6 limited"
    ],
    [
     "7",
     "7",
     "no",
     "True",
     "7 limited"
    ]
   ],
   "beats": [
    {
     "say": "Rate limiting is just a counter with an expiry. Here's alice making seven requests.",
     "sql": "count = r.incr(key)          # key = \"rate_limit:alice\"\nif count == 1:\n    r.expire(key, 60)\nreturn count > limit          # limit = 5"
    },
    {
     "say": "Attempt one. The key doesn't exist yet, so incr creates it, starting at one.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "Count is one, so this is the first request in the window. Start a sixty second timer.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "Attempts two to five just add one. None is more than five, so all five are allowed.",
     "hl": [
      0,
      1,
      2,
      3,
      4
     ],
     "col": 3
    },
    {
     "say": "Attempt six makes the count six. Six is more than five, so it's limited. Seven too.",
     "hl": [
      5,
      6
     ],
     "dim": true,
     "col": 4
    },
    {
     "say": "When the sixty seconds are up, the key expires, the count starts again at one, and alice is allowed again.",
     "hl": 0,
     "col": 2
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
   "kind": "table",
   "kicker": "Questions to ask",
   "title": "For any new feature",
   "columns": [
    "Ask",
    "Then reach for"
   ],
   "rows": [
    [
     "Clear structure and relationships?",
     "Relational: Postgres / MySQL"
    ],
    [
     "Shape varies or changes often?",
     "Document: MongoDB"
    ],
    [
     "Live updates pushed instantly?",
     "Firebase"
    ],
    [
     "Temporary, or a cache of data stored elsewhere?",
     "Redis"
    ],
    [
     "Strict consistency, or raw speed?",
     "Weigh it for this feature"
    ]
   ],
   "beats": [
    {
     "say": "Which database is best is the wrong question. The answer depends on the data, and how you use it.",
     "col": 0
    },
    {
     "say": "So for any new feature, ask these questions instead.",
     "col": 0
    },
    {
     "say": "Does the data have clear structure and relationships? Relational.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "Does its shape vary a lot, or change often? Document.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "Do users need live updates, pushed instantly? Firebase.",
     "hl": 2,
     "col": 1
    },
    {
     "say": "Is it temporary, or a cache of something stored elsewhere? Redis.",
     "hl": 3,
     "col": 1
    },
    {
     "say": "And for this specific feature, how much does strict consistency matter, compared with raw speed?",
     "hl": 4,
     "dim": true
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab",
   "title": "Decide for TrackIt",
   "columns": [
    "TrackIt feature",
    "Deciding question",
    "Pick"
   ],
   "rows": [
    [
     "User accounts and their tasks",
     "Structured, related, must stay consistent",
     "PostgreSQL"
    ],
    [
     "Who's online indicator",
     "Pushed live to every connected user",
     "Firebase"
    ],
    [
     "Weekly summary cache",
     "Temporary, fine to expire and recompute",
     "Redis"
    ],
    [
     "Custom task templates",
     "Fields vary wildly per template",
     "MongoDB"
    ]
   ],
   "beats": [
    {
     "say": "Four TrackIt features. Pause now, and write your own choice and reason for each.",
     "col": 0
    },
    {
     "say": "User accounts and their tasks: structured, related, needing consistency. PostgreSQL.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "A live who's online indicator needs updates pushed to everyone. Firebase.",
     "hl": 1,
     "col": 2
    },
    {
     "say": "A cached weekly summary is temporary, and fine to recompute. Redis.",
     "hl": 2,
     "col": 2
    },
    {
     "say": "Custom templates with wildly different fields: MongoDB.",
     "hl": 3,
     "col": 2
    },
    {
     "say": "Compare your reasoning, not just the labels.",
     "col": 1
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab",
   "title": "One product, four databases",
   "nodes": [
    {
     "id": "app",
     "label": "TrackIt",
     "x": 50,
     "y": 50,
     "sub": "one app",
     "art": "laptop"
    },
    {
     "id": "pg",
     "label": "PostgreSQL",
     "x": 14,
     "y": 18,
     "sub": "accounts, tasks",
     "art": "database"
    },
    {
     "id": "fb",
     "label": "Firebase",
     "x": 86,
     "y": 18,
     "sub": "who's online",
     "art": "cloud"
    },
    {
     "id": "rd",
     "label": "Redis",
     "x": 14,
     "y": 82,
     "sub": "weekly summary cache",
     "art": "bolt"
    },
    {
     "id": "mg",
     "label": "MongoDB",
     "x": 86,
     "y": 82,
     "sub": "custom templates",
     "art": "doc"
    }
   ],
   "edges": [
    {
     "from": "app",
     "to": "pg"
    },
    {
     "from": "app",
     "to": "fb"
    },
    {
     "from": "app",
     "to": "rd"
    },
    {
     "from": "app",
     "to": "mg"
    }
   ],
   "beats": [
    {
     "say": "Put those answers together, and TrackIt uses all four.",
     "show": 1,
     "on": "app"
    },
    {
     "say": "Accounts and tasks are saved in PostgreSQL.",
     "show": 2,
     "on": "pg",
     "send": {
      "from": "app",
      "to": "pg",
      "label": "new task"
     }
    },
    {
     "say": "Firebase pushes who's online to every open screen.",
     "show": 3,
     "on": "fb",
     "send": {
      "from": "fb",
      "to": "app",
      "label": "Alice is online"
     }
    },
    {
     "say": "Redis serves the weekly summary without recomputing it.",
     "show": 4,
     "on": "rd",
     "send": {
      "from": "rd",
      "to": "app",
      "label": "cached summary"
     }
    },
    {
     "say": "And MongoDB stores templates of any shape.",
     "show": 5,
     "on": "mg",
     "send": {
      "from": "app",
      "to": "mg",
      "label": "save template"
     }
    },
    {
     "say": "Each tool handles the part it's best at. Defaulting to one for everything means fighting it on the rest.",
     "on": [
      "pg",
      "fb",
      "rd",
      "mg"
     ]
    },
    {
     "say": "And as TrackIt grows, revisit these choices. The right database can change as your needs change.",
     "on": "app"
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
