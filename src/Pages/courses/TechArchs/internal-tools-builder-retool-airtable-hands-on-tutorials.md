<!-- order: 11 -->
# Internal Tools Builder (Retool and Airtable): Hands-On Project Tutorials

This course turns each project into a step-by-step, hands-on build. You learn each idea at the moment you need it, while building the thing, and every project hands its result to the next one, ending in a real internal tool a team could use to run part of their work. Follow the projects in order.

**By the end of this course, you'll be able to:**
- Design a relational Airtable base with linked tables, typed fields, and filtered views
- Add formulas, rollups, lookups, and an email automation in Airtable
- Connect Retool to Airtable with a scoped Personal Access Token and build a master-detail app
- Build create, update, and confirmed delete actions with success and error feedback
- Explain the difference between hiding controls and enforcing permissions, and add a change log
- Release a tool to test users with documentation and an onboarding walkthrough

**Plan check:** The core of this course works on Airtable's free plan and Retool's free plan. On the free plans at the time of writing (2026), Airtable limits records per base and automation runs per month, and Retool limits the number of users you can invite; check each company's current pricing page, because limits change. These parts need a paid Retool plan and are concept-only or optional on free: restricting query permissions by role (Project 5, Step 5) and separate staging and production environments (Project 6, Step 4). The free path shows you how to build role-aware views with the current user's email instead.

---

## Project 1 (Module 1): Build a Database in Airtable

**Goal:** Create a structured, relational database that will power the tools you build later.

**Time:** about 1.5 hours

**Step 1: Create your Airtable account and a base.**
Go to airtable.com, sign up for a free account, and create a new base named `operations`. A base is a single database for a project, and this one gives every later tool a real place to read and write data.

**Step 2: Understand tables.**
A table holds one kind of record, like Customers or Orders, and a base can have several tables. Splitting data into clear tables is the foundation of a database that stays organised as it grows.

**Step 3: Create your first table and fields.**
Create a `Customers` table with fields for name (single line text), email (email), status (single select), and created (date). Correct field types let Airtable check and filter your data automatically later.

**Step 4: Understand linked records.**
A linked record connects a row in one table to a row in another, like an Order linked to a Customer. Links are what make a database relational, so you never copy the same customer details into every order.

**Step 5: Create a linked Orders table.**
Create an `Orders` table with these fields:
- `order_number` (single line text, the first column)
- `amount` (currency)
- `status` (single select with the options `open`, `shipped`, `cancelled`)
- `order_date` (date)
- `notes` (long text)
- `customer` (link to another record, linked to `Customers`)

Orders that reference customers is the classic pattern behind almost every internal tool, and `order_date` is what later steps use to find recent and overdue orders.

**Step 6: Understand views.**
A view is a saved way of looking at a table (filtered, sorted, or grouped) without changing the data. Views let one table serve many needs without duplicating anything.

**Step 7: Create useful views.**
In `Orders`, create three grid views: "Open orders" filtered to status is `open`; "This month" filtered so `order_date` is within the current month (use the date filter's "is within" options); and "By customer" grouped by `customer`. Well-chosen views are often half the value of an internal tool.

**Step 8: Add sample data.**
Add several customers and about ten orders with realistic, varied values: different statuses, amounts, and order dates (include a few open orders dated more than two weeks ago). This lets you build and test tools against something that behaves like real data.

### Project Structure
```text
operations (Airtable base)
│
├── Customers (name, email, status, created)
├── Orders (order_number, amount, status, order_date, notes, customer -> Customers)
└── Views: Open orders, This month, By customer
```

### What You Learned
- ✅ What bases, tables, and fields are
- ✅ Choosing correct field types
- ✅ Linking records for a relational database
- ✅ Creating filtered and grouped views
- ✅ Building a realistic sample dataset

### Portfolio Project
**Relational Airtable Database**: Designed a clean, relational database with linked tables, correct field types, and useful views.
**Skills:** Airtable, Data Modeling, Relational Databases, Views.

**Deliverable:** A relational Airtable base with linked tables and purpose-built views.

### Quiz

1. Why link Orders to Customers instead of typing the customer's details into each order?
2. Does creating a filtered view delete or change any records?
3. Why is `status` a single select field rather than free text?
4. Which Orders field does the "This month" view depend on?

*Answers: 1) Linking keeps each customer's details in one place, so they are never duplicated or out of sync. 2) No, a view only changes how the table is displayed, not the data. 3) A fixed list of options prevents typos and makes filtering by status reliable. 4) The order_date date field.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "database",
   "kicker": "Project 1 · Airtable database",
   "title": "A database for your tools",
   "beats": [
    {
     "say": "Welcome to Internal Tools Builder, with Retool and Airtable."
    },
    {
     "say": "Each project hands its result to the next, ending in a real internal tool a team could use."
    },
    {
     "say": "First, you'll build the relational database that will power everything you build later."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Steps 1 and 2",
   "title": "One base, one table per kind of record",
   "nodes": [
    {
     "id": "base",
     "label": "operations",
     "x": 14,
     "y": 50,
     "sub": "your Airtable base",
     "art": "database"
    },
    {
     "id": "cust",
     "label": "Customers",
     "x": 55,
     "y": 22,
     "sub": "one row per customer",
     "art": "idcard"
    },
    {
     "id": "ord",
     "label": "Orders",
     "x": 55,
     "y": 78,
     "sub": "one row per order",
     "art": "table"
    },
    {
     "id": "tools",
     "label": "Your tools",
     "x": 88,
     "y": 50,
     "sub": "read and write here",
     "art": "laptop"
    }
   ],
   "edges": [
    {
     "from": "base",
     "to": "cust"
    },
    {
     "from": "base",
     "to": "ord"
    },
    {
     "from": "cust",
     "to": "tools"
    },
    {
     "from": "ord",
     "to": "tools"
    }
   ],
   "beats": [
    {
     "say": "Sign up at airtable dot com, and create a base named operations. A base is a single database for a project.",
     "show": 1,
     "on": "base"
    },
    {
     "say": "Inside it, a table holds one kind of record. First, Customers.",
     "show": 2,
     "on": "cust"
    },
    {
     "say": "Then Orders. A base can hold several tables, each one tidy and separate.",
     "show": 3,
     "on": "ord"
    },
    {
     "say": "Every tool you build later reads and writes these tables.",
     "show": 4,
     "on": "tools",
     "send": {
      "from": "ord",
      "to": "tools",
      "label": "orders data"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 3",
   "title": "Every field gets the right type",
   "columns": [
    "Field",
    "Type",
    "Lets Airtable..."
   ],
   "rows": [
    [
     "name",
     "Single line text",
     "store a short name"
    ],
    [
     "email",
     "Email",
     "check the format"
    ],
    [
     "status",
     "Single select",
     "allow fixed options"
    ],
    [
     "created",
     "Date",
     "filter by date"
    ]
   ],
   "beats": [
    {
     "say": "Create a Customers table with four fields."
    },
    {
     "say": "Name is single line text.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "Email uses the email type, so Airtable checks the format.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "Status is a single select, a fixed list of options.",
     "hl": 2,
     "col": 1
    },
    {
     "say": "And created is a date. Correct types let Airtable check and filter your data later.",
     "hl": 3,
     "col": 2
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Steps 4 and 5",
   "title": "Orders link to one customer record",
   "nodes": [
    {
     "id": "o1",
     "label": "ORD-1001",
     "x": 14,
     "y": 18,
     "sub": "$120 · open",
     "art": "doc"
    },
    {
     "id": "o4",
     "label": "ORD-1004",
     "x": 14,
     "y": 50,
     "sub": "$80 · cancelled",
     "art": "doc"
    },
    {
     "id": "o6",
     "label": "ORD-1006",
     "x": 14,
     "y": 82,
     "sub": "$210 · shipped",
     "art": "doc"
    },
    {
     "id": "ada",
     "label": "Ada Okafor",
     "x": 74,
     "y": 50,
     "sub": "Customers record",
     "art": "idcard"
    }
   ],
   "edges": [
    {
     "from": "o1",
     "to": "ada"
    },
    {
     "from": "o4",
     "to": "ada"
    },
    {
     "from": "o6",
     "to": "ada"
    }
   ],
   "beats": [
    {
     "say": "Create an Orders table: order number first, then amount, status, order date, notes, and customer.",
     "show": 3
    },
    {
     "say": "Customer is a link to another record. Order ten oh one points at Ada's row in Customers.",
     "show": 4,
     "on": [
      "o1",
      "ada"
     ],
     "send": {
      "from": "o1",
      "to": "ada",
      "label": "customer link"
     }
    },
    {
     "say": "So do order ten oh four, and order ten oh six.",
     "show": 4,
     "on": [
      "o4",
      "o6",
      "ada"
     ],
     "send": {
      "from": "o6",
      "to": "ada",
      "label": "customer link"
     }
    },
    {
     "say": "Ada's details live in one place. Change her email once, and every order sees it.",
     "show": 4,
     "on": "ada"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Steps 6 to 8",
   "title": "Views: one table, many needs",
   "columns": [
    "order",
    "status",
    "order_date",
    "customer"
   ],
   "rows": [
    [
     "ORD-1001",
     "open",
     "Sep 20",
     "Ada"
    ],
    [
     "ORD-1002",
     "shipped",
     "Sep 25",
     "Ben"
    ],
    [
     "ORD-1003",
     "open",
     "Oct 9",
     "Chloe"
    ],
    [
     "ORD-1004",
     "cancelled",
     "Oct 2",
     "Ada"
    ],
    [
     "ORD-1005",
     "open",
     "Sep 26",
     "Ben"
    ],
    [
     "ORD-1006",
     "shipped",
     "Oct 7",
     "Ada"
    ],
    [
     "ORD-1007",
     "open",
     "Oct 11",
     "Chloe"
    ]
   ],
   "beats": [
    {
     "say": "Here's sample data: varied statuses and dates, including a few old open orders. Say today is October twelfth."
    },
    {
     "say": "The Open orders view filters to status is open. Four rows.",
     "sql": "View: Open orders\nstatus is open",
     "hl": [
      0,
      2,
      4,
      6
     ],
     "dim": true,
     "col": 1
    },
    {
     "say": "This month keeps orders whose date is within the current month. Also four rows, but different ones.",
     "sql": "View: This month\norder_date is within this month",
     "hl": [
      2,
      3,
      5,
      6
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "By customer groups the rows, so all of Ada's orders sit together.",
     "sql": "View: By customer\ngroup by customer",
     "hl": [
      0,
      3,
      5
     ],
     "dim": true,
     "col": 3
    },
    {
     "say": "Three views, and not a single record was changed or copied.",
     "sql": "Views change how you look,\nnot the data"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why link Orders to Customers instead of typing customer details into each order?",
   "options": [
    "Linking keeps each customer's details in one place, so they're never duplicated or out of sync",
    "Airtable doesn't allow text fields in Orders",
    "Linked fields load faster in views"
   ],
   "answer": 0,
   "good": "That's right. Linking keeps each customer's details in one place, so they're never duplicated or out of sync.",
   "bad": "Not quite. Linking keeps each customer's details in one place, so they're never duplicated or out of sync.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why link Orders to Customers instead of typing customer details into each order?",
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
     "A relational base with linked tables and views",
     ""
    ],
    [
     "Realistic sample data",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 1.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a relational Airtable base with linked tables, correct field types, and purpose-built views,",
     "show": 1
    },
    {
     "say": "filled with a realistic sample dataset.",
     "show": 2
    },
    {
     "say": "Next, in Module 2, formulas, rollups and automations.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 2 (Module 2): Automate and Compute Inside Airtable

**Goal:** Make your database do work for you with formulas, rollups, and automations.

**Time:** about 2 hours

**Step 1: Understand formula fields.**
A formula field calculates its value from other fields, like combining first and last name, or flagging overdue orders. Formulas remove manual calculation and keep derived values always correct.

**Step 2: Add a formula field.**
In `Orders`, add a formula field `is_overdue` with this formula:

```text
AND({status} = "open", DATETIME_DIFF(TODAY(), {order_date}, 'days') > 14)
```

It shows 1 for open orders placed more than 14 days ago and 0 otherwise. Computed flags like this power the filters and alerts your tools rely on.

**Step 3: Understand rollups.**
A rollup summarises linked records, such as totalling all orders for a customer. Rollups turn relationships into insight without any manual tallying.

**Step 4: Add a rollup to Customers.**
In `Customers`, add a rollup field `total_spent` that uses the linked Orders, the `amount` field, and the summary function `SUM(values)`. A per-customer total is exactly the kind of at-a-glance metric a tool should surface.

> **Note:** this rollup sums *every* linked order, including cancelled ones, which is why Ada shows $410 (her cancelled $80 order is counted). If you want spend to exclude cancelled orders, open the rollup's settings, turn on the option to only include linked records that meet certain conditions, and add the condition `status` is not `cancelled`; Ada would then show $330.

**Step 5: Understand Airtable automations.**
An automation runs actions when something happens in the base, like sending an email when a status changes. It handles routine reactions so team members do not have to remember to. The free plan limits automation runs per month (check the current plan page), which is plenty for testing.

**Step 6: Build a status-change automation.**
First, in `Orders`, add a lookup field `customer_email` that looks up `email` through the `customer` link. Then open Automations and create one: trigger "When a record matches conditions" (table Orders, status is `shipped`), action "Send email" with the To address set to the trigger record's `customer_email`, and a short subject and message that include the order number. Use your own email on a test customer, test it, and turn it on. Automatic customer updates are a high-value feature that is otherwise easy to forget.

**Step 7: Understand data integrity.**
Data integrity means keeping data accurate and consistent, using validation and constrained choices. Tools built on inconsistent data produce wrong answers.

**Step 8: Add integrity safeguards.**
Use single-select options (as you did for `status`) to prevent typos. Note that Airtable cannot make a field "required" in the grid itself; required fields are set in a form view (create a Form view on Orders and mark `order_number`, `amount`, and `customer` as required), and in Project 4 you will also mark the matching inputs as required in Retool. Constraining input at entry is far cheaper than cleaning bad data later.

### Project Structure
```text
Automated base
│
├── Orders.is_overdue (formula on status + order_date)
├── Orders.customer_email (lookup)
├── Customers.total_spent (rollup)
├── Automation: status = shipped -> email customer
└── Integrity: single-select statuses + required fields in the Orders form view
```

### What You Learned
- ✅ Calculating values with formula fields
- ✅ Summarising linked data with rollups
- ✅ Building automations inside Airtable
- ✅ Protecting data integrity with constraints
- ✅ Turning a database into a reactive system

### Portfolio Project
**Smart, Automated Database**: Added formulas, rollups, automations, and integrity safeguards that make a database compute and react on its own.
**Skills:** Airtable Formulas, Rollups, Automations, Data Integrity.

**Deliverable:** An Airtable base that computes metrics, reacts to changes, and protects its own data quality.

### Quiz

1. What does the `is_overdue` formula check?
2. What is the difference between a lookup and a rollup?
3. Why did you add the `customer_email` lookup before building the email automation?
4. Where can you make a field required in Airtable?

*Answers: 1) That the order's status is open and its order_date is more than 14 days before today. 2) A lookup pulls a field's values from linked records; a rollup summarises them, for example with a sum. 3) The email address lives in Customers, so the automation needs it on the Order record to use as the To address. 4) In a form view's field settings, not in the grid itself.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "gear",
   "kicker": "Project 2 · Automate and compute",
   "title": "Make the database do work",
   "beats": [
    {
     "say": "Welcome to Project 2."
    },
    {
     "say": "You'll make your base calculate values, summarise linked data, and react to changes on its own."
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Steps 1 and 2",
   "title": "Trace the is_overdue formula",
   "file": "Orders.is_overdue",
   "code": "AND(\n  {status} = \"open\",\n  DATETIME_DIFF(\n    TODAY(), {order_date}, 'days'\n  ) > 14\n)",
   "beats": [
    {
     "say": "A formula field calculates its value from other fields. Here's is overdue, traced for order ten oh one.",
     "line": 1,
     "vars": {
      "order": "ORD-1001"
     }
    },
    {
     "say": "First condition: is the status open? Yes, so this part is true.",
     "line": 2,
     "vars": {
      "status": "open",
      "is open": true
     }
    },
    {
     "say": "Next, the days between the order date, September twentieth, and today, October twelfth: twenty two.",
     "line": [
      3,
      4
     ],
     "vars": {
      "days": 22
     }
    },
    {
     "say": "Is twenty two more than fourteen? Yes.",
     "line": 5,
     "vars": {
      "> 14": true
     }
    },
    {
     "say": "Both parts are true, so AND gives one. This order is overdue.",
     "line": [
      1,
      6
     ],
     "out": "ORD-1001 → 1"
    },
    {
     "say": "Order ten oh two is seventeen days old, but shipped. The first part is false, so it gets zero.",
     "line": 2,
     "vars": {
      "order": "ORD-1002",
      "status": "shipped",
      "is open": false,
      "days": 17,
      "> 14": true
     },
     "out": "ORD-1002 → 0"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 2",
   "title": "The flag on every order",
   "columns": [
    "order",
    "status",
    "days old",
    "is_overdue"
   ],
   "rows": [
    [
     "ORD-1001",
     "open",
     "22",
     "1"
    ],
    [
     "ORD-1002",
     "shipped",
     "17",
     "0"
    ],
    [
     "ORD-1003",
     "open",
     "3",
     "0"
    ],
    [
     "ORD-1004",
     "cancelled",
     "10",
     "0"
    ],
    [
     "ORD-1005",
     "open",
     "16",
     "1"
    ],
    [
     "ORD-1006",
     "shipped",
     "5",
     "0"
    ],
    [
     "ORD-1007",
     "open",
     "1",
     "0"
    ]
   ],
   "beats": [
    {
     "say": "Airtable runs the same formula on every row, and keeps it up to date by itself."
    },
    {
     "say": "Open orders older than fourteen days get a one. Just two of them.",
     "sql": "open AND more than 14 days old",
     "hl": [
      0,
      4
     ],
     "dim": true,
     "col": 3
    },
    {
     "say": "Order ten oh three is open, but only three days old, so it stays at zero.",
     "hl": 2,
     "col": 2
    },
    {
     "say": "Flags like this power the filters and alerts your tools rely on.",
     "hl": [
      0,
      4
     ],
     "col": 3
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Steps 3 and 4",
   "title": "A rollup totals each customer's orders",
   "columns": [
    "customer",
    "linked orders",
    "amount",
    "total_spent"
   ],
   "rows": [
    [
     "Ada",
     "1001, 1004, 1006",
     "120 + 80 + 210",
     "$410"
    ],
    [
     "Ben",
     "1002, 1005",
     "45 + 60",
     "$105"
    ],
    [
     "Chloe",
     "1003, 1007",
     "300 + 95",
     "$395"
    ]
   ],
   "beats": [
    {
     "say": "A rollup summarises linked records. In Customers, add one called total spent."
    },
    {
     "say": "It follows the link to each customer's orders.",
     "col": 1,
     "sql": "Rollup: total_spent\nlinked field: Orders"
    },
    {
     "say": "It reads the amount field from each of those orders.",
     "col": 2,
     "sql": "Rollup: total_spent\nfield: amount"
    },
    {
     "say": "And applies SUM of values. Ada's three orders add up to four hundred and ten.",
     "hl": 0,
     "col": 3,
     "sql": "Rollup: total_spent\nSUM(values)"
    },
    {
     "say": "Ben gets one hundred and five, and Chloe three hundred and ninety five. No manual tallying.",
     "hl": [
      1,
      2
     ],
     "col": 3
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Steps 5 and 6",
   "title": "Email the customer when an order ships",
   "nodes": [
    {
     "id": "cust",
     "label": "Chloe",
     "x": 14,
     "y": 22,
     "sub": "Customers · email",
     "art": "idcard"
    },
    {
     "id": "ord",
     "label": "ORD-1003",
     "x": 14,
     "y": 78,
     "sub": "status → shipped",
     "art": "doc"
    },
    {
     "id": "auto",
     "label": "Automation",
     "x": 50,
     "y": 78,
     "sub": "status is shipped",
     "art": "bolt"
    },
    {
     "id": "mail",
     "label": "Send email",
     "x": 86,
     "y": 78,
     "sub": "To: customer_email",
     "art": "mail"
    },
    {
     "id": "inbox",
     "label": "Chloe's inbox",
     "x": 86,
     "y": 22,
     "sub": "subject has order no.",
     "art": "bell"
    }
   ],
   "edges": [
    {
     "from": "cust",
     "to": "ord"
    },
    {
     "from": "ord",
     "to": "auto"
    },
    {
     "from": "auto",
     "to": "mail"
    },
    {
     "from": "mail",
     "to": "inbox"
    }
   ],
   "beats": [
    {
     "say": "The email address lives in Customers, not Orders.",
     "show": 2,
     "on": "cust"
    },
    {
     "say": "So first add a lookup field, customer email, that pulls it through the customer link onto each order.",
     "show": 2,
     "on": "ord",
     "send": {
      "from": "cust",
      "to": "ord",
      "label": "email lookup"
     }
    },
    {
     "say": "Now create an automation: when a record matches conditions, in Orders, status is shipped.",
     "show": 3,
     "on": "auto"
    },
    {
     "say": "Someone marks order ten oh three as shipped. It matches, and the automation fires.",
     "show": 3,
     "on": [
      "ord",
      "auto"
     ],
     "send": {
      "from": "ord",
      "to": "auto",
      "label": "matches"
     }
    },
    {
     "say": "Its action is Send email, with the To address set to the record's customer email.",
     "show": 4,
     "on": "mail",
     "send": {
      "from": "auto",
      "to": "mail",
      "label": "ORD-1003"
     }
    },
    {
     "say": "The customer hears their order shipped, and nobody had to remember to tell them.",
     "show": 5,
     "on": "inbox",
     "send": {
      "from": "mail",
      "to": "inbox",
      "label": "Order shipped"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Steps 7 and 8",
   "title": "Constrain data at the moment it's entered",
   "columns": [
    "Someone enters",
    "Free text",
    "Constrained"
   ],
   "rows": [
    [
     "shipped",
     "saved",
     "saved"
    ],
    [
     "Shipped (capital)",
     "saved, filters miss it",
     "not an option"
    ],
    [
     "shiped (typo)",
     "saved, filters miss it",
     "not an option"
    ],
    [
     "no amount",
     "saved",
     "form says required"
    ]
   ],
   "beats": [
    {
     "say": "Data integrity means keeping data accurate and consistent."
    },
    {
     "say": "The right value is fine either way.",
     "hl": 0
    },
    {
     "say": "But with free text, a capital letter or a typo slips in, and the status filter quietly misses it.",
     "hl": [
      1,
      2
     ],
     "col": 1
    },
    {
     "say": "A single select only offers the real options, so the typo can't happen.",
     "hl": [
      1,
      2
     ],
     "col": 2
    },
    {
     "say": "Required fields live in a form view, not the grid. Mark order number, amount and customer as required there.",
     "sql": "Form view on Orders:\norder_number, amount, customer required",
     "hl": 3,
     "col": 2
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why add the customer_email lookup before building the email automation?",
   "options": [
    "Lookups are required before any automation can run",
    "Rollups can't hold email addresses",
    "The email lives in Customers, so the automation needs it on the Order record as the To address"
   ],
   "answer": 2,
   "good": "That's right. The email address lives in Customers, so the automation needs it on the Order record to use as the To address.",
   "bad": "Not quite. The email address lives in Customers, so the automation needs it on the Order record to use as the To address.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why add the customer email lookup before building the email automation?",
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
     "Formulas and rollups compute metrics",
     ""
    ],
    [
     "An automation reacts to changes",
     ""
    ],
    [
     "Integrity safeguards in place",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 2.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "your Airtable base computes metrics with formulas and rollups,",
     "show": 1
    },
    {
     "say": "reacts to changes with an email automation,",
     "show": 2
    },
    {
     "say": "and protects its own data quality.",
     "show": 3
    },
    {
     "say": "Next, in Module 3, your first Retool app.",
     "show": 3
    }
   ]
  }
 ]
}
```

---

## Project 3 (Module 3): Build Your First Retool App

**Goal:** Build a custom interface in Retool that reads from and writes to your Airtable data.

**Time:** about 2 hours

**Step 1: Create a free Retool account.**
Go to retool.com and sign up for the free plan. Retool builds internal apps by dragging components onto a canvas and connecting them to your data. Create a new app named `operations-tool`.

**Step 2: Understand resources.**
A resource is a saved connection to a data source, like your Airtable base or a database. Every Retool app reads and writes through resources, and the resource holds the credentials so they never appear in your app.

**Step 3: Connect Airtable as a resource.**
Airtable retired its old API keys in February 2024, so you connect with a Personal Access Token (PAT) instead. In Airtable, open the Builder hub (airtable.com/create/tokens) and create a token with the scopes `data.records:read`, `data.records:write`, and `schema.bases:read`, and under Access add only your `operations` base. Copy the token once and keep it private: never paste it into a query, a component, or a shared doc. In Retool, go to Resources, create an Airtable resource, and paste the token into its token/API key field. Without this link, you are only designing an empty shell.

**Step 4: Understand queries.**
A query fetches or changes data through a resource, such as getting all open orders. Most of building a tool is writing the right queries.

**Step 5: Build a query and a table.**
In your app, create a query named `getOrders` using the Airtable resource, action "List records", with your base and table `Orders`, and run it. Drag a Table component onto the canvas and set its data to `{{ getOrders.data.records.map(r => ({ id: r.id, ...r.fields })) }}`, which turns each Airtable record into one row with its id plus its fields. A live table of real orders is the backbone of most internal tools.

**Step 6: Understand components.**
A component is a UI element like a table, button, form, or text, arranged on the canvas. Knowing the main ones lets you build almost any tool layout.

**Step 7: Add a detail panel.**
Add a Container beside the table with Text components that show the selected order's number, amount, status, order date, and notes. A master-detail layout (a list plus the selected item's details) is the most common internal-tool pattern.

**Step 8: Bind data with references.**
Binding connects a component to data using a reference in double curly braces. Set the Text components to values like `{{ table1.selectedRow.order_number }}` and `{{ table1.selectedRow.amount }}` (use your table's actual name if it is not `table1`). This is the core Retool skill, and it is how every component shows the right, live data.

### Project Structure
```text
Retool app: operations-tool
│
├── Resource: Airtable (Personal Access Token, operations base only)
├── Query: getOrders (List records, Orders)
├── Table (bound to getOrders)
└── Detail panel ({{ table1.selectedRow.<field> }} values)
```

### What You Learned
- ✅ What resources, queries, and components are
- ✅ Connecting Retool to Airtable securely with a scoped token
- ✅ Displaying live data in a table
- ✅ Building a master-detail layout
- ✅ Binding components to data with references

### Portfolio Project
**Live Internal Dashboard**: Built a Retool app connected to real data with a table and a master-detail view.
**Skills:** Retool, Data Binding, Internal Tools, Master-Detail UI.

**Deliverable:** A Retool app that displays live records with a working detail panel.

### Quiz

1. Why does Retool connect to Airtable with a Personal Access Token rather than an API key?
2. Why limit the token's scopes and give it access to only the `operations` base?
3. What is the difference between a resource and a query?
4. What does `{{ table1.selectedRow.amount }}` show?

*Answers: 1) Airtable retired API keys in February 2024; Personal Access Tokens are the supported way to connect. 2) If the token leaks, it can only do the few things you allowed on that one base, limiting the damage. 3) A resource is the saved connection to a data source; a query uses that connection to fetch or change specific data. 4) The amount field of whichever row is currently selected in the table.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "dashboard",
   "kicker": "Project 3 · First Retool app",
   "title": "A custom interface on your data",
   "beats": [
    {
     "say": "Welcome to Project 3."
    },
    {
     "say": "Retool builds internal apps by dragging components onto a canvas and connecting them to your data."
    },
    {
     "say": "Sign up for the free plan, and create an app named operations tool."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Steps 2 to 4",
   "title": "App, resource, data: where the token lives",
   "nodes": [
    {
     "id": "app",
     "label": "operations-tool",
     "x": 14,
     "y": 55,
     "sub": "query: getOrders",
     "art": "browser"
    },
    {
     "id": "res",
     "label": "Airtable resource",
     "x": 50,
     "y": 55,
     "sub": "holds the token",
     "art": "plug"
    },
    {
     "id": "pat",
     "label": "Access token",
     "x": 50,
     "y": 15,
     "sub": "made in Builder hub",
     "art": "key"
    },
    {
     "id": "air",
     "label": "operations base",
     "x": 86,
     "y": 55,
     "sub": "Orders table",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "app",
     "to": "res"
    },
    {
     "from": "pat",
     "to": "res"
    },
    {
     "from": "res",
     "to": "air"
    }
   ],
   "beats": [
    {
     "say": "Airtable retired its old A P I keys in February twenty twenty four. You connect with a Personal Access Token.",
     "show": 3,
     "on": "pat"
    },
    {
     "say": "You paste the token into a Retool resource, a saved connection. It never goes into a query or a component.",
     "show": 3,
     "on": "res",
     "send": {
      "from": "pat",
      "to": "res",
      "label": "token"
     }
    },
    {
     "say": "A query uses that resource. Get orders asks for List records on Orders.",
     "show": 4,
     "on": "app",
     "send": {
      "from": "app",
      "to": "res",
      "label": "List records"
     }
    },
    {
     "say": "The resource adds the token and calls Airtable.",
     "show": 4,
     "on": "res",
     "send": {
      "from": "res",
      "to": "air",
      "label": "Orders"
     }
    },
    {
     "say": "The records come back to your app, and the app never saw the token.",
     "show": 4,
     "on": "app",
     "send": {
      "from": "res",
      "to": "app",
      "label": "7 records"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 3",
   "title": "Give the token only what it needs",
   "columns": [
    "Token setting",
    "Allows",
    "Why"
   ],
   "rows": [
    [
     "data.records:read",
     "read rows",
     "show orders"
    ],
    [
     "data.records:write",
     "create, edit, delete",
     "Project 4 forms"
    ],
    [
     "schema.bases:read",
     "see tables and fields",
     "pick Orders in Retool"
    ],
    [
     "Access: operations",
     "this one base only",
     "nothing else exposed"
    ]
   ],
   "beats": [
    {
     "say": "In the Builder hub, create the token with just three scopes."
    },
    {
     "say": "Records read, to fetch rows.",
     "hl": 0
    },
    {
     "say": "Records write, which your forms will need in Project 4.",
     "hl": 1
    },
    {
     "say": "And schema bases read, so Retool can list your tables and fields.",
     "hl": 2
    },
    {
     "say": "Under Access, add only the operations base. If it ever leaks, the damage stops here.",
     "hl": 3,
     "col": 2
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Step 5",
   "title": "Turn Airtable records into table rows",
   "file": "table1 · Data",
   "code": "{{ getOrders.data.records.map(r => ({\n     id: r.id,\n     ...r.fields\n})) }}",
   "beats": [
    {
     "say": "Get orders returns records. Each one has an I D, and its values tucked inside fields.",
     "line": 1,
     "vars": {
      "records": "7"
     }
    },
    {
     "say": "Map takes the first record, r.",
     "line": 1,
     "vars": {
      "r.id": "rec1001",
      "r.fields": "{order_number, amount, ...}"
     }
    },
    {
     "say": "It keeps the record I D as the row's id.",
     "line": 2,
     "vars": {
      "id": "rec1001"
     }
    },
    {
     "say": "And spreads every field out beside it, so each field becomes its own column.",
     "line": 3,
     "out": "{ id: rec1001, order_number: ORD-1001, ... }"
    },
    {
     "say": "It does the same for all seven records. The Table component now shows seven live rows.",
     "line": [
      1,
      4
     ],
     "vars": {
      "rows": "7"
     },
     "out": "… 7 rows"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Steps 6 to 8",
   "title": "Click a row, and the detail panel follows",
   "columns": [
    "id",
    "order_number",
    "amount",
    "status"
   ],
   "rows": [
    [
     "rec1001",
     "ORD-1001",
     "120",
     "open"
    ],
    [
     "rec1002",
     "ORD-1002",
     "45",
     "shipped"
    ],
    [
     "rec1003",
     "ORD-1003",
     "300",
     "open"
    ],
    [
     "rec1004",
     "ORD-1004",
     "80",
     "cancelled"
    ]
   ],
   "beats": [
    {
     "say": "Beside the table, add a Container with Text components. This is the master detail layout."
    },
    {
     "say": "Click order ten oh three. It becomes table one's selected row.",
     "hl": 2,
     "sql": "table1.selectedRow"
    },
    {
     "say": "A Text bound to selected row dot order number shows O R D ten oh three.",
     "hl": 2,
     "col": 1,
     "sql": "{{ table1.selectedRow.order_number }}\n→ ORD-1003"
    },
    {
     "say": "Another, bound to selected row dot amount, shows three hundred.",
     "hl": 2,
     "col": 2,
     "sql": "{{ table1.selectedRow.amount }}\n→ 300"
    },
    {
     "say": "Click order ten oh one instead, and every bound Text updates by itself: one hundred and twenty.",
     "hl": 0,
     "col": 2,
     "sql": "{{ table1.selectedRow.amount }}\n→ 120"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why limit the token's scopes and give it access to only the operations base?",
   "options": [
    "Retool rejects tokens with more scopes",
    "If it leaks, it can only do the few things you allowed on that one base",
    "Scoped tokens make queries run faster"
   ],
   "answer": 1,
   "good": "That's right. If the token leaks, it can only do the few things you allowed, on that one base, which limits the damage.",
   "bad": "Not quite. If the token leaks, it can only do the few things you allowed, on that one base, which limits the damage.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why limit the token's scopes and give it access to only the operations base?",
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
     "Connected with a scoped token",
     ""
    ],
    [
     "Live table with a detail panel",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 3.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "your Retool app is connected securely to Airtable with a scoped token,",
     "show": 1
    },
    {
     "say": "and displays live records with a working detail panel.",
     "show": 2
    },
    {
     "say": "Next, in Module 4, actions that write data.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 4 (Module 4): Add Actions That Write Data

**Goal:** Let users create, edit, and update records from your Retool app, safely.

**Time:** about 2.5 hours

**Step 1: Understand mutating queries.**
A mutating query changes data (create, update, delete), unlike a read query that only fetches. Mutating queries need more care because they change real records.

**Step 2: Build a form to edit a record.**
Add a Form with inputs for status (a Select with the options `open`, `shipped`, `cancelled`), amount (a Number input), and notes (a Text area). Set each input's default value from the selected row, for example `{{ table1.selectedRow.status }}`. In each important input's settings, turn on Required under validation, so the form cannot be submitted with it empty. An edit form is the most common write feature, letting users correct records in place.

**Step 3: Create an update query.**
Create a query `updateOrder` with action "Update record" on `Orders`, the record ID set to `{{ table1.selectedRow.id }}`, and the fields set from the form inputs (status, amount, notes). This turns user input into a real change in your Airtable data.

**Step 4: Trigger queries on events.**
Queries can run on events, like a button click or a form submit. Add an event handler to the form's Submit event (or a Save button's Click event) that runs `updateOrder`. This is how a tool responds to users.

**Step 5: Handle success and failure.**
On `updateOrder`, add a success event handler that shows a notification ("Order saved") and triggers `getOrders` to refresh the table, and a failure handler that shows an error notification. Clear feedback tells users their change worked and keeps the tool showing current data.

**Step 6: Build a create-record form.**
Add a second form and a query `createOrder` with action "Create record" on `Orders`, including order number, amount, status, order date, and the linked customer, so a team can run the whole workflow rather than only editing existing data. Refresh `getOrders` on success. For the customer, create a query `getCustomers` ("List records" on `Customers`) and a Select whose option values are `{{ getCustomers.data.records.map(r => r.id) }}` and labels are `{{ getCustomers.data.records.map(r => r.fields.name) }}`. Airtable expects a linked-record field as a list of record IDs, so set the `customer` field in `createOrder` to `{{ [customerSelect.value] }}` (use your Select's actual name).

**Step 7: Understand confirmation on destructive actions.**
A confirmation step asks the user to confirm before an irreversible action like delete. Deletes and bulk changes are dangerous, and confirmation prevents costly mistakes.

**Step 8: Add a guarded delete.**
Create a query `deleteOrder` with action "Delete record" and the record ID `{{ table1.selectedRow.id }}`. In the query's settings, turn on the option to show a confirmation modal before running, with a message like "Delete this order? This cannot be undone." Add a Delete button that runs `deleteOrder`, and refresh `getOrders` on success. Guarding destructive actions protects real business data from a single misclick.

### Project Structure
```text
Write actions
│
├── Edit form (required inputs) -> updateOrder (Update record)
├── Create form -> createOrder (Create record)
├── Success/failure notifications + getOrders refresh
└── Delete button -> confirmation modal -> deleteOrder (Delete record)
```

### What You Learned
- ✅ The difference between read and mutating queries
- ✅ Building edit and create forms bound to data, with required inputs
- ✅ Triggering queries on events like button clicks
- ✅ Handling success and failure with feedback
- ✅ Guarding destructive actions with confirmation

### Portfolio Project
**Full CRUD Internal Tool**: Added safe create, edit, and delete actions so a team can run its workflow inside the tool.
**Skills:** Retool, CRUD, Event Handling, Safe Actions.

**Deliverable:** A Retool app where users can create, edit, and safely delete real records.

### Quiz

1. What makes a query "mutating"?
2. Why does the update query need `{{ table1.selectedRow.id }}`?
3. Why run `getOrders` after a successful save?
4. How do you make Retool ask for confirmation before deleting?

*Answers: 1) It changes data by creating, updating, or deleting records, instead of only reading. 2) The record ID tells Airtable exactly which record to change. 3) So the table shows the current data, including the change just made. 4) Turn on the query's confirmation-modal setting so it asks before running the delete.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "pencil",
   "kicker": "Project 4 · Write actions",
   "title": "Create, edit and delete, safely",
   "beats": [
    {
     "say": "Welcome to Project 4."
    },
    {
     "say": "A mutating query changes data: it creates, updates or deletes. Because it changes real records, it needs more care than a read."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 1",
   "title": "Read queries versus mutating queries",
   "columns": [
    "Query",
    "Action",
    "Changes data?"
   ],
   "rows": [
    [
     "getOrders",
     "List records",
     "no"
    ],
    [
     "getCustomers",
     "List records",
     "no"
    ],
    [
     "updateOrder",
     "Update record",
     "yes"
    ],
    [
     "createOrder",
     "Create record",
     "yes"
    ],
    [
     "deleteOrder",
     "Delete record",
     "yes"
    ]
   ],
   "beats": [
    {
     "say": "By the end of this project, your app has five queries."
    },
    {
     "say": "Two only read. Running them twice changes nothing.",
     "hl": [
      0,
      1
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "Three are mutating. They change real records in Airtable, so each one gets a safeguard.",
     "hl": [
      2,
      3,
      4
     ],
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Steps 2 to 5",
   "title": "Edit a record, then tell the user",
   "nodes": [
    {
     "id": "tbl",
     "label": "table1",
     "x": 12,
     "y": 25,
     "sub": "selected: ORD-1003",
     "art": "table"
    },
    {
     "id": "form",
     "label": "Edit form",
     "x": 45,
     "y": 25,
     "sub": "required inputs",
     "art": "form"
    },
    {
     "id": "upd",
     "label": "updateOrder",
     "x": 82,
     "y": 25,
     "sub": "Update record",
     "art": "gear"
    },
    {
     "id": "air",
     "label": "Airtable Orders",
     "x": 82,
     "y": 78,
     "sub": "the real record",
     "art": "database"
    },
    {
     "id": "note",
     "label": "Notification",
     "x": 45,
     "y": 78,
     "sub": "Order saved",
     "art": "bell"
    },
    {
     "id": "get",
     "label": "getOrders",
     "x": 12,
     "y": 78,
     "sub": "refresh",
     "art": "loop"
    }
   ],
   "edges": [
    {
     "from": "tbl",
     "to": "form"
    },
    {
     "from": "form",
     "to": "upd"
    },
    {
     "from": "upd",
     "to": "air"
    },
    {
     "from": "upd",
     "to": "note"
    },
    {
     "from": "upd",
     "to": "get"
    },
    {
     "from": "get",
     "to": "tbl"
    }
   ],
   "beats": [
    {
     "say": "Each form input takes its default from the selected row, so the form opens with status open.",
     "show": 2,
     "on": "form",
     "send": {
      "from": "tbl",
      "to": "form",
      "label": "status: open"
     }
    },
    {
     "say": "The user changes status to shipped and submits. The Submit event runs update order.",
     "show": 3,
     "on": "upd",
     "send": {
      "from": "form",
      "to": "upd",
      "label": "Submit"
     }
    },
    {
     "say": "It sends the selected row's I D, so Airtable knows exactly which record, plus the new fields.",
     "show": 4,
     "on": "air",
     "send": {
      "from": "upd",
      "to": "air",
      "label": "id + fields"
     }
    },
    {
     "say": "On success, a notification says Order saved.",
     "show": 5,
     "on": "note",
     "send": {
      "from": "upd",
      "to": "note",
      "label": "success"
     }
    },
    {
     "say": "And get orders runs again, so the table shows the change.",
     "show": 6,
     "on": [
      "get",
      "tbl"
     ],
     "send": {
      "from": "get",
      "to": "tbl",
      "label": "fresh rows"
     }
    },
    {
     "say": "If it fails, the failure handler shows an error notification instead.",
     "show": 6,
     "on": "note"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Step 6",
   "title": "Create an order with a linked customer",
   "file": "createOrder",
   "code": "// customerSelect options\nvalues: {{ getCustomers.data.records\n  .map(r => r.id) }}\nlabels: {{ getCustomers.data.records\n  .map(r => r.fields.name) }}\n\n// createOrder · customer field\ncustomer: {{ [customerSelect.value] }}",
   "beats": [
    {
     "say": "To pick a customer, get customers lists the Customers table.",
     "line": 2,
     "vars": {
      "records": "3"
     }
    },
    {
     "say": "The Select's values are the record I Ds.",
     "line": [
      2,
      3
     ],
     "vars": {
      "values": "[\"recAda\", \"recBen\", \"recChloe\"]"
     }
    },
    {
     "say": "Its labels are the names, so people see Ada, Ben and Chloe, not I Ds.",
     "line": [
      4,
      5
     ],
     "vars": {
      "labels": "[\"Ada\", \"Ben\", \"Chloe\"]"
     }
    },
    {
     "say": "The user picks Ben. The Select's value is Ben's record I D.",
     "line": 8,
     "vars": {
      "customerSelect.value": "recBen"
     }
    },
    {
     "say": "Airtable expects a linked field as a list of I Ds, so the value goes inside square brackets.",
     "line": 8,
     "vars": {
      "customer": "[\"recBen\"]"
     }
    },
    {
     "say": "Create order runs, and on success get orders refreshes the table.",
     "line": 8,
     "out": "Created ORD-1008 → linked to Ben"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Steps 7 and 8",
   "title": "A guarded delete",
   "values": [
    "Click Delete",
    "Confirm modal",
    "deleteOrder",
    "Refresh table"
   ],
   "beats": [
    {
     "say": "Delete can't be undone, so it gets a confirmation step."
    },
    {
     "say": "Someone clicks Delete on the selected order.",
     "hl": 0,
     "ptr": {
      "now": 0
     }
    },
    {
     "say": "The query's confirmation setting shows a modal first: Delete this order? This cannot be undone.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "now": 1
     },
     "note": "Delete this order? This cannot be undone."
    },
    {
     "say": "If it was a misclick, they cancel, and nothing runs.",
     "ok": [
      0,
      1
     ],
     "gone": [
      2,
      3
     ],
     "note": "Cancel → no change"
    },
    {
     "say": "If they confirm, delete order runs, using the selected row's I D.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "now": 2
     },
     "note": "Confirm → Delete record"
    },
    {
     "say": "On success, get orders refreshes, and the order is gone from the table.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "ptr": {
      "now": 3
     }
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why does the update query need table1.selectedRow.id?",
   "options": [
    "The record I D tells Airtable exactly which record to change",
    "It refreshes the table after saving",
    "It checks the user is an admin"
   ],
   "answer": 0,
   "good": "That's right. The record I D tells Airtable exactly which record to change.",
   "bad": "Not quite. The record I D tells Airtable exactly which record to change.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why does the update query need the selected row's I D?",
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
     "Create and edit with feedback",
     ""
    ],
    [
     "Confirmed delete",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 4.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "users can create and edit real records, with required inputs and clear feedback,",
     "show": 1
    },
    {
     "say": "and safely delete them behind a confirmation.",
     "show": 2
    },
    {
     "say": "Next, in Module 5, access control and roles.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 5 (Module 5): Add Access Control and Roles

**Goal:** Control who can see and do what, so the tool is safer to share across a team.

**Time:** about 2 hours

**Step 1: Understand roles and permissions.**
A role is a group of users, like admin or viewer, and permissions decide what each role can do. Roles let you set access once per group instead of per person.

**Step 2: Understand user identity in Retool.**
Retool knows who is using the app through `current_user`, for example `{{ current_user.email }}`. You can reference it anywhere in the app, which is how one app can behave differently for admins and everyone else.

**Step 3: Hide admin controls from non-admins.**
Free path: in the Code panel, create a Variable named `adminEmails` and set its initial value to a list of admin emails.

Template: replace the email with your own.
```text
["you@example.com"]
```

Then set the Delete button's Hidden property to `{{ !adminEmails.value.includes(current_user.email) }}`. Do the same for any sensitive fields. Hiding dangerous controls from most users prevents accidents and keeps their view simple.

**Step 4: Understand hiding versus enforcing.**
Hiding a control in the UI is not the same as blocking the action at the data layer. A truly safe tool restricts what each role can do at the source, not just what they can see. The hiding you did in Step 3 is a convenience, not a security control.

**Step 5: Restrict queries by role (concept only on free).**
In Retool, controlling which permission groups can use resources or run queries needs a paid plan, so on the free plan treat this step as concept-only. Understand the idea: an admin-only permission group would be allowed to use the resource that can delete, while other users get a resource connected with a read-only Airtable token (`data.records:read` only). Enforcing limits where the data is accessed is what actually protects data. On free, you can add a second safeguard by setting `deleteOrder`'s "Disable query" option to `{{ !adminEmails.value.includes(current_user.email) }}`, but remember this still runs in the browser and is not true enforcement.

**Step 6: Build a role-aware view.**
Show a manager summary to admins (for example, Statistic components with total open orders and overdue count) and a simpler task list to everyone else, in the same app, using the same `adminEmails` check in each container's Hidden property. One app that adapts to each role is cheaper to maintain than separate tools.

**Step 7: Understand audit trails.**
An audit trail records who changed what and when. When something goes wrong in a shared tool, it is how you find out what happened and by whom.

**Step 8: Add basic logging of changes.**
In Airtable, create a `Change log` table with fields `action` (single line text), `order_number` (single line text), `user_email` (email), and `logged_at` (created time). In Retool, create a query `logChange` with action "Create record" on that table, setting `user_email` to `{{ current_user.email }}` and `order_number` to `{{ logOrderNumber.value }}`. Capture the order number *before* the write runs: add a variable (called temporary state in older Retool versions) named `logOrderNumber`, and give the Delete button and the edit form's submit a first event handler that sets `logOrderNumber` to `{{ table1.selectedRow.order_number }}`, followed by the handler that runs the query. Then run `logChange` from the success handlers of `updateOrder` (action "update") and `deleteOrder` (action "delete"). Don't read `table1.selectedRow` inside those success handlers: once `getOrders` refreshes (especially after a delete), the selected row can point at a different order, and the log would record the wrong number. A simple change log gives you accountability and makes the tool more trustworthy for a team.

### Project Structure
```text
Access control
│
├── adminEmails variable + current_user.email check
├── Admin-only controls (delete, sensitive fields) hidden
├── Role-restricted queries (concept only on free; paid Retool plan)
├── Role-aware views (admin summary vs member list)
└── Change log table (who / what / when) written by logChange
```

### What You Learned
- ✅ What roles and permissions are
- ✅ Referencing the current user in an app
- ✅ The difference between hiding and enforcing access
- ✅ How query permissions by role work, and why they need a paid plan
- ✅ Adding audit logging for accountability

### Portfolio Project
**Role-Aware Team Tool**: Added role-aware views, admin-only controls, and audit logging, and documented how permissions would be enforced on a paid plan.
**Skills:** Access Control, Roles and Permissions, Retool, Auditing.

**Deliverable:** An internal tool with role-aware views, hidden admin controls, and a change log.

### Quiz

1. How does the free path decide whether the current user is an admin?
2. Why is hiding the Delete button not real security?
3. What would truly enforce that only admins can delete?
4. What three things does an audit trail record?

*Answers: 1) It checks whether current_user.email is in the adminEmails list. 2) It only changes what is shown in the browser; the action could still be run another way unless it is blocked where the data is accessed. 3) Restricting the delete at the data layer, such as permission groups on resources or queries (a paid Retool feature) or a read-only token for non-admins. 4) Who made a change, what changed, and when.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "lock",
   "kicker": "Project 5 · Access control",
   "title": "Who can see and do what",
   "beats": [
    {
     "say": "Welcome to Project 5."
    },
    {
     "say": "A role is a group of users, like admin or viewer, and permissions decide what each role can do."
    },
    {
     "say": "Retool knows who's using the app through current user, for example, current user dot email."
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Steps 2 and 3",
   "title": "Hide the Delete button from non-admins",
   "file": "Hidden property",
   "code": "// Variable: adminEmails\n[\"you@example.com\"]\n\n// Delete button · Hidden\n{{ !adminEmails.value\n     .includes(current_user.email) }}",
   "beats": [
    {
     "say": "In the Code panel, a variable called admin emails holds the list of admins.",
     "line": [
      1,
      2
     ],
     "vars": {
      "adminEmails.value": "[\"you@example.com\"]"
     }
    },
    {
     "say": "The Delete button's Hidden property checks the current user against that list.",
     "line": [
      4,
      6
     ]
    },
    {
     "say": "You open the app. Current user email is you at example dot com.",
     "line": 6,
     "vars": {
      "current_user.email": "you@example.com"
     }
    },
    {
     "say": "The list includes you, so includes is true. The not sign flips it, so Hidden is false.",
     "line": [
      5,
      6
     ],
     "vars": {
      "includes": true,
      "Hidden": false
     },
     "out": "you@example.com → Delete shown"
    },
    {
     "say": "Now Sam opens it. Sam isn't in the list, so includes is false, and Hidden is true.",
     "line": [
      5,
      6
     ],
     "vars": {
      "current_user.email": "sam@example.com",
      "includes": false,
      "Hidden": true
     },
     "out": "sam@example.com → Delete hidden"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Steps 4 and 5",
   "title": "Hiding is not enforcing",
   "nodes": [
    {
     "id": "sam",
     "label": "Sam",
     "x": 12,
     "y": 50,
     "sub": "not an admin",
     "art": "persona"
    },
    {
     "id": "ui",
     "label": "Hidden button",
     "x": 45,
     "y": 18,
     "sub": "browser only",
     "art": "eye"
    },
    {
     "id": "q",
     "label": "deleteOrder",
     "x": 45,
     "y": 82,
     "sub": "still in the app",
     "art": "gear"
    },
    {
     "id": "res",
     "label": "Resource",
     "x": 72,
     "y": 82,
     "sub": "read-only token",
     "art": "key"
    },
    {
     "id": "air",
     "label": "Airtable",
     "x": 88,
     "y": 30,
     "sub": "Orders",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "sam",
     "to": "ui"
    },
    {
     "from": "sam",
     "to": "q"
    },
    {
     "from": "q",
     "to": "res"
    },
    {
     "from": "res",
     "to": "air"
    }
   ],
   "beats": [
    {
     "say": "Sam can't see the Delete button. That's a convenience, not a lock.",
     "show": 2,
     "on": "ui"
    },
    {
     "say": "Hiding only changes the browser. The delete query still exists, and could be run another way.",
     "show": 3,
     "on": "q",
     "send": {
      "from": "sam",
      "to": "q",
      "label": "run delete"
     }
    },
    {
     "say": "Real enforcement happens where the data is reached. On a paid plan, non-admins use a resource with a read-only token.",
     "show": 4,
     "on": "res",
     "send": {
      "from": "q",
      "to": "res",
      "label": "delete"
     }
    },
    {
     "say": "Airtable gets a delete with a token that can only read, and refuses it.",
     "show": 5,
     "on": "air",
     "send": {
      "from": "res",
      "to": "air",
      "label": "delete"
     }
    },
    {
     "say": "Nothing is deleted. On free, a Disable query check helps, but it still runs in the browser.",
     "show": 5,
     "on": "res",
     "send": {
      "from": "air",
      "to": "res",
      "label": "not allowed"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 6",
   "title": "One app, two views",
   "columns": [
    "Container",
    "Hidden when",
    "Admin",
    "Member"
   ],
   "rows": [
    [
     "Manager summary",
     "not an admin",
     "shown",
     "hidden"
    ],
    [
     "Task list",
     "an admin",
     "hidden",
     "shown"
    ],
    [
     "Delete button",
     "not an admin",
     "shown",
     "hidden"
    ]
   ],
   "beats": [
    {
     "say": "Each container's Hidden property uses the same admin emails check."
    },
    {
     "say": "Admins get a manager summary, with Statistic components: four open orders, two overdue.",
     "sql": "Statistics: open orders 4 · overdue 2",
     "hl": [
      0,
      2
     ],
     "col": 2
    },
    {
     "say": "Everyone else gets a simpler task list instead.",
     "hl": 1,
     "col": 3
    },
    {
     "say": "One app that adapts to each role is cheaper to maintain than two tools.",
     "col": 1
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Steps 7 and 8",
   "title": "A change log: who, what, and when",
   "columns": [
    "action",
    "order_number",
    "user_email",
    "logged_at"
   ],
   "rows": [
    [
     "update",
     "ORD-1003",
     "you@example.com",
     "Oct 12, 09:14"
    ],
    [
     "update",
     "ORD-1001",
     "sam@example.com",
     "Oct 12, 09:31"
    ],
    [
     "delete",
     "ORD-1004",
     "you@example.com",
     "Oct 12, 09:40"
    ]
   ],
   "beats": [
    {
     "say": "In Airtable, add a Change log table. Then a Retool query, log change, creates a record in it.",
     "sql": "logChange: Create record\nuser_email = {{ current_user.email }}"
    },
    {
     "say": "Update order succeeds, so its success handler runs log change with the action update.",
     "hl": 0,
     "col": 0
    },
    {
     "say": "Sam edits an order, and the log records Sam's email from current user.",
     "hl": 1,
     "col": 2
    },
    {
     "say": "You delete an order. The delete success handler logs action delete.",
     "hl": 2,
     "col": 0
    },
    {
     "say": "Logged at is a created time field, so Airtable stamps the when by itself.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 3
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why is hiding the Delete button not real security?",
   "options": [
    "Admins can't see hidden buttons either",
    "Hidden buttons still appear on mobile",
    "It only changes what's shown in the browser; the action must be blocked where the data is accessed"
   ],
   "answer": 2,
   "good": "That's right. Hiding only changes what's shown in the browser. The action could still be run another way unless it's blocked where the data is accessed.",
   "bad": "Not quite. Hiding only changes what's shown in the browser. The action could still be run another way unless it's blocked where the data is accessed.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why is hiding the Delete button not real security?",
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
     "Role-aware views and hidden admin controls",
     ""
    ],
    [
     "A working change log",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 5.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "your tool has role-aware views and hidden admin controls,",
     "show": 1
    },
    {
     "say": "and a change log recording who changed what, and when.",
     "show": 2
    },
    {
     "say": "Next, in Module 6, polish, deploy and onboard the team.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 6 (Module 6): Polish, Deploy, and Onboard the Team

**Goal:** Turn a working tool into a polished, shared product the team actually adopts.

**Time:** about 2.5 hours

**Step 1: Understand layout and usability.**
Good layout groups related controls, guides the eye, and reduces the clicks needed to finish a task. A cluttered tool slows people down and gets abandoned.

**Step 2: Organise the interface.**
Group the app into clear sections or tabs, such as Orders, Customers, and Reports. Sectioning matches how people think about their work and keeps a growing tool navigable.

**Step 3: Add helpful states.**
Add empty states, loading indicators, and clear labels throughout. These small touches remove confusion and make the tool feel finished.

**Step 4: Understand environments (concept only on free).**
Many teams keep a staging environment for testing and a production one for real use. Separating them means you can improve the tool without risking the data the team depends on. Retool's multiple environments need a paid plan, so on free treat this as concept-only. A free-plan habit that gives you part of the benefit: make a copy of your Airtable base as `operations-test` and try risky changes against it first.

**Step 5: Release and share the app.**
Release (publish) your app so users see a stable version, then invite your test users from Retool's settings. The free plan limits how many users you can invite (check the current plan page), so a small team or a few classmates is ideal. Make sure the admin emails in `adminEmails` match the people who should see admin controls.

**Step 6: Write user documentation.**
Create a short guide covering what the tool does, how to do each common task, and who to ask for help. Documentation lowers the barrier to adoption and cuts support questions.

**Step 7: Run an onboarding walkthrough.**
Walk your test users through the tool with a real task each person will do. People adopt a tool far faster once they have done a real task in it with guidance.

**Step 8: Gather feedback and iterate once.**
Collect first reactions and make one round of improvements. The first week of real use reveals the highest-value fixes.

### Project Structure
```text
Deployed tool
│
├── Clear layout (sections / tabs)
├── Empty, loading, and labelled states
├── Staging vs production (concept only on free; test base copy instead)
├── Released and shared with a few users
├── user_guide.md
└── Onboarding walkthrough + one iteration
```

### What You Learned
- ✅ Designing clear, usable layouts
- ✅ Adding empty, loading, and labelled states
- ✅ What staging and production environments are for
- ✅ Releasing and sharing a tool with the right people
- ✅ Documenting, onboarding, and iterating for adoption

### Portfolio Project
**Deployed Internal Tool**: Polished, released, documented, and onboarded test users onto a tool they can use for real tasks.
**Skills:** UX, Deployment, Technical Writing, Onboarding, Retool.

**Deliverable:** A polished, shared internal tool with user documentation and a completed onboarding.

### Quiz

1. Why group an internal tool into sections or tabs?
2. What is the purpose of separate staging and production environments?
3. On the free plan, what simple habit gives you some of that protection?
4. Why onboard people with a real task instead of a feature tour?

*Answers: 1) It matches how people think about their work and keeps a growing tool easy to navigate. 2) You can test changes safely without risking the real data the team depends on. 3) Test risky changes against a copy of the Airtable base before touching the real one. 4) People adopt a tool much faster once they have completed a real task in it with guidance.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "rocket",
   "kicker": "Project 6 · Polish and deploy",
   "title": "From working tool to adopted tool",
   "beats": [
    {
     "say": "Welcome to the last project."
    },
    {
     "say": "You'll turn a working tool into a polished, shared product the team actually adopts."
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Steps 1 and 2",
   "title": "Group the app the way people think",
   "values": [
    "Orders",
    "Customers",
    "Reports"
   ],
   "beats": [
    {
     "say": "A cluttered tool slows people down. So group the app into tabs."
    },
    {
     "say": "Orders holds the table, the detail panel, and the edit and create forms.",
     "hl": 0,
     "note": "Orders: table · detail · forms"
    },
    {
     "say": "Customers holds each customer and their total spent.",
     "ok": [
      0
     ],
     "hl": 1,
     "note": "Customers: list · total_spent"
    },
    {
     "say": "Reports holds summaries, like open and overdue counts.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "note": "Reports: open 4 · overdue 2"
    },
    {
     "say": "Each task now lives in one obvious place, even as the tool grows.",
     "ok": [
      0,
      1,
      2
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 3",
   "title": "Helpful states make it feel finished",
   "columns": [
    "Moment",
    "Without",
    "With"
   ],
   "rows": [
    [
     "getOrders running",
     "blank table",
     "loading indicator"
    ],
    [
     "No open orders",
     "empty grid",
     "No open orders yet"
    ],
    [
     "Amount input",
     "amount",
     "Amount (USD)"
    ]
   ],
   "beats": [
    {
     "say": "Small touches remove confusion."
    },
    {
     "say": "While get orders runs, show a loading indicator, not a blank table.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "When a list is empty, say so in plain words.",
     "hl": 1,
     "col": 2
    },
    {
     "say": "And give every input a clear label.",
     "hl": 2,
     "col": 2
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Step 4",
   "title": "Try risky changes on a copy first",
   "nodes": [
    {
     "id": "you",
     "label": "You",
     "x": 12,
     "y": 50,
     "sub": "the builder",
     "art": "laptop"
    },
    {
     "id": "test",
     "label": "operations-test",
     "x": 50,
     "y": 20,
     "sub": "a copy of the base",
     "art": "flask"
    },
    {
     "id": "prod",
     "label": "operations",
     "x": 50,
     "y": 80,
     "sub": "the real data",
     "art": "database"
    },
    {
     "id": "team",
     "label": "The team",
     "x": 88,
     "y": 80,
     "sub": "uses it every day",
     "art": "people"
    }
   ],
   "edges": [
    {
     "from": "you",
     "to": "test"
    },
    {
     "from": "you",
     "to": "prod"
    },
    {
     "from": "team",
     "to": "prod"
    }
   ],
   "beats": [
    {
     "say": "Teams often keep staging for testing and production for real use. In Retool that needs a paid plan.",
     "show": 1,
     "on": "you"
    },
    {
     "say": "The free habit: copy your base as operations test.",
     "show": 2,
     "on": "test"
    },
    {
     "say": "Try the risky change there first.",
     "show": 2,
     "on": "test",
     "send": {
      "from": "you",
      "to": "test",
      "label": "risky change"
     }
    },
    {
     "say": "Meanwhile, the team keeps working on the real base, untouched.",
     "show": 4,
     "on": [
      "team",
      "prod"
     ],
     "send": {
      "from": "team",
      "to": "prod",
      "label": "daily work"
     }
    },
    {
     "say": "Only once it works do you apply it to the real one.",
     "show": 4,
     "on": "prod",
     "send": {
      "from": "you",
      "to": "prod",
      "label": "proven change"
     }
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Steps 5 to 8",
   "title": "From release to adoption",
   "values": [
    "Release",
    "Check adminEmails",
    "Invite users",
    "User guide",
    "Walkthrough",
    "Iterate once"
   ],
   "beats": [
    {
     "say": "Release the app, so users see a stable version.",
     "hl": 0,
     "ptr": {
      "step": 0
     }
    },
    {
     "say": "Make sure admin emails lists exactly the people who should see admin controls.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "step": 1
     }
    },
    {
     "say": "Invite a few test users. The free plan limits how many.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "step": 2
     }
    },
    {
     "say": "Write a short guide: what the tool does, how to do each task, who to ask.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3,
     "ptr": {
      "step": 3
     }
    },
    {
     "say": "Walk each person through a real task they'll actually do.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "hl": 4,
     "ptr": {
      "step": 4
     }
    },
    {
     "say": "Then gather feedback, and make one round of improvements.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "hl": 5,
     "ptr": {
      "step": 5
     }
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why onboard people with a real task instead of a feature tour?",
   "options": [
    "Feature tours aren't allowed on the free plan",
    "People adopt a tool much faster once they've completed a real task in it with guidance",
    "Real tasks test the staging environment"
   ],
   "answer": 1,
   "good": "That's right. People adopt a tool much faster once they've done a real task in it, with guidance.",
   "bad": "Not quite. People adopt a tool much faster once they've done a real task in it, with guidance.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why onboard people with a real task instead of a feature tour?",
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
     "A polished, released tool",
     ""
    ],
    [
     "User guide and onboarding done",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's the final project.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a polished internal tool, released and shared with test users,",
     "show": 1
    },
    {
     "say": "with user documentation and a completed onboarding.",
     "show": 2
    },
    {
     "say": "You've finished Internal Tools Builder. Well done.",
     "show": 2
    }
   ]
  }
 ]
}
```
