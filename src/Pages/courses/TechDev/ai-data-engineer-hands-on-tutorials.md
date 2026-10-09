<!-- order: 19 -->
# AI Data Engineer: Hands-On Project Tutorials

This course is a series of hands-on projects. You learn each idea at the moment you need it, while building the thing.

**By the end of this course, you'll be able to:**
- Map the five stages of a data pipeline for an AI use case
- Clean a messy dataset with pandas and check the result with assertions
- Design a versioned SQL schema and build a batch ETL pipeline that loads into it
- Prepare labeled, stratified train/validation/test splits and check them for data leakage
- Build and query a vector store from a set of documents
- Add schema checks, value checks, and a simple drift check that stop bad data before it is loaded

Follow the projects in order. Each one hands off a skill or artifact to the next.


## Before you start: set up your notebook

**Time: about 15 minutes**

This course runs in **Google Colab**, a free Jupyter notebook in your browser and the standard workspace for AI and data work. There's nothing to install.

1. Go to [colab.research.google.com](https://colab.research.google.com) and sign in with a Google account.
2. Give each project its own notebook: choose **File → New notebook**, then click the title at the top to rename it after the project.
3. Notebooks have two kinds of cells. **Code cells** run Python: type or paste code, then press **Shift + Enter**. **Text cells** hold your notes and written answers: choose **Insert → Text cell**.
4. Install libraries in a code cell with `%pip install ...`. The `%` form installs them into the notebook you're using.
5. Put each code block from a project in its own code cell, in order, and run them top to bottom. When a later step changes earlier code, edit that cell and run it again.
6. To use a file you downloaded, such as a CSV, drag it into the **Files** panel (the folder icon on the left). Files your code creates appear there too. Colab clears them when the session ends, so download anything you want to keep, or connect Google Drive from the same panel.

Prefer to work on your own computer? The same notebooks run in JupyterLab or in VS Code with the Jupyter extension.

---

## Project 1 (Module 1): Map a Data Pipeline for an AI Use Case

**Time: about 1.5 hours**

**Goal:** Before writing any code, learn to see data movement as a pipeline of stages, so every later project has a place to plug into.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `data_pipeline_map_project`.

**Step 2: Define the AI use case.**
Add a **text cell** headed `use_case` and write your notes in it.
Write one sentence: what AI application will consume this data, and what does it need to work? Example: "A customer support chatbot needs cleaned, labeled support tickets to fine-tune on."

**Step 3: Identify the data source.**
A **data source** is where raw data originates, a database, an API, uploaded files, or a stream of events.

**Step 4: List the five pipeline stages.**
- **Ingestion**: pulling raw data from the source.
- **Cleaning**: fixing or removing bad data.
- **Storage**: where cleaned data lives.
- **Transformation**: turning raw data into a form a model can use (labels, embeddings).
- **Serving**: how the AI application actually accesses the final data.

**Step 5: Sketch data volume and frequency.**
Estimate: how much data, and how often does new data arrive (once, daily, continuously)?

**Step 6: Note data quality risks.**
List: what could be wrong with this data? (duplicates, missing fields, inconsistent formats, mislabeled examples)

**Step 7: The pipeline.**
Data flows through five stages, left to right:

```mermaid
flowchart LR
    I["Ingestion"] --> C["Cleaning"] --> S["Storage"] --> T["Transformation"] --> SV["Serving"]
```

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
data_pipeline_map_project/
│
├── use_case.md
├── pipeline_diagram.png
```

### What You Learned
- ✅ Defining an AI use case's data requirements
- ✅ Identifying data sources
- ✅ The five stages of a data pipeline
- ✅ Estimating data volume and frequency
- ✅ Anticipating data quality risks
- ✅ Turning a use case into a pipeline diagram

### Portfolio Project
**AI Data Pipeline Architecture Map**: Translated an AI application's data requirements into a five-stage pipeline diagram covering ingestion, cleaning, storage, transformation, and serving.
**Skills:** Data Architecture, Systems Thinking, Technical Documentation, AI Data Engineering.

**Deliverable:** A one-page data pipeline map for your example AI use case, covering source, stages, volume, and quality risks.

### Quiz

1. What are the five pipeline stages, in order?
2. What is the difference between the Cleaning stage and the Transformation stage?
3. Why estimate data volume and arrival frequency before building anything?
4. Give two data quality risks you might list for a support-ticket dataset.

*Answers: 1) Ingestion, Cleaning, Storage, Transformation, Serving. 2) Cleaning fixes or removes bad data; Transformation turns clean data into a form a model can use, such as labels or embeddings. 3) They decide how the pipeline must be built, for example a one-time script versus a daily or continuous job. 4) Any two of: duplicate tickets, missing fields, inconsistent formats, or mislabeled examples.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "path",
   "kicker": "Project 1 · Map a pipeline",
   "title": "See data as a pipeline",
   "beats": [
    {
     "say": "Welcome to A I Data Engineer: Hands-On Project Tutorials."
    },
    {
     "say": "Before writing any code, you'll learn to see data movement as a pipeline of stages, so every later project has a place to plug into."
    }
   ]
  },
  {
   "kind": "quote",
   "art": "target",
   "kicker": "Steps 2 and 3",
   "title": "Start with the use case",
   "quote": "A customer support chatbot needs cleaned, labeled support tickets to fine-tune on.",
   "beats": [
    {
     "say": "In a text cell headed use case, write one sentence.",
     "show": 0
    },
    {
     "say": "What A I application will consume this data, and what does it need to work?",
     "show": 1
    },
    {
     "say": "Then name the data source: where raw data originates. A database, an A P I, uploaded files, or a stream of events.",
     "show": 1
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Steps 4 and 7",
   "title": "Follow one support ticket through five stages",
   "nodes": [
    {
     "id": "src",
     "label": "Ticket system",
     "x": 12,
     "y": 25,
     "sub": "the data source",
     "art": "database"
    },
    {
     "id": "ing",
     "label": "Ingestion",
     "x": 50,
     "y": 25,
     "sub": "pull raw data",
     "art": "plug"
    },
    {
     "id": "cle",
     "label": "Cleaning",
     "x": 88,
     "y": 25,
     "sub": "fix or remove bad data",
     "art": "shield"
    },
    {
     "id": "sto",
     "label": "Storage",
     "x": 88,
     "y": 75,
     "sub": "where clean data lives",
     "art": "table"
    },
    {
     "id": "tra",
     "label": "Transformation",
     "x": 50,
     "y": 75,
     "sub": "labels, embeddings",
     "art": "gear"
    },
    {
     "id": "ser",
     "label": "Serving",
     "x": 12,
     "y": 75,
     "sub": "the chatbot reads it",
     "art": "robot"
    }
   ],
   "edges": [
    {
     "from": "src",
     "to": "ing"
    },
    {
     "from": "ing",
     "to": "cle"
    },
    {
     "from": "cle",
     "to": "sto"
    },
    {
     "from": "sto",
     "to": "tra"
    },
    {
     "from": "tra",
     "to": "ser"
    }
   ],
   "beats": [
    {
     "say": "Here's the chatbot's data, starting at its source: the support ticket system.",
     "show": 1,
     "on": "src"
    },
    {
     "say": "Ingestion pulls the raw tickets out of the source.",
     "show": 2,
     "on": "ing",
     "send": {
      "from": "src",
      "to": "ing",
      "label": "raw tickets"
     }
    },
    {
     "say": "Cleaning fixes or removes bad data, like duplicates and empty tickets.",
     "show": 3,
     "on": "cle",
     "send": {
      "from": "ing",
      "to": "cle",
      "label": "raw tickets"
     }
    },
    {
     "say": "Storage is where the cleaned tickets live.",
     "show": 4,
     "on": "sto",
     "send": {
      "from": "cle",
      "to": "sto",
      "label": "clean tickets"
     }
    },
    {
     "say": "Transformation turns them into a form a model can use, such as labels or embeddings.",
     "show": 5,
     "on": "tra",
     "send": {
      "from": "sto",
      "to": "tra",
      "label": "clean rows"
     }
    },
    {
     "say": "And Serving is how the chatbot actually gets the final data.",
     "show": 6,
     "on": "ser",
     "send": {
      "from": "tra",
      "to": "ser",
      "label": "labeled data"
     }
    },
    {
     "say": "Five stages, always in this order. Every later project builds one of them.",
     "show": 6,
     "on": [
      "ing",
      "cle",
      "sto",
      "tra",
      "ser"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 5",
   "title": "How often data arrives decides what you build",
   "columns": [
    "New data arrives",
    "So you build"
   ],
   "rows": [
    [
     "Once",
     "A one-time script"
    ],
    [
     "Daily",
     "A daily batch job"
    ],
    [
     "Continuously",
     "A continuous job"
    ]
   ],
   "beats": [
    {
     "say": "Next, sketch the volume: roughly how much data is there?"
    },
    {
     "say": "Then the frequency: how often does new data arrive?",
     "col": 0
    },
    {
     "say": "If it arrives once, a one-time script is enough.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "If new tickets land every day, you need a job that runs daily. You'll build one in Project 4.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "And a stream that never stops needs a continuous job.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "That's why you estimate both before you build anything.",
     "col": 1
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 6",
   "title": "What could be wrong with support tickets?",
   "columns": [
    "Risk",
    "Example",
    "Fixed in"
   ],
   "rows": [
    [
     "Duplicates",
     "T001 saved twice",
     "Cleaning"
    ],
    [
     "Missing fields",
     "A ticket with no text",
     "Cleaning"
    ],
    [
     "Inconsistent formats",
     "Billing vs BILLING",
     "Cleaning"
    ],
    [
     "Mislabeled examples",
     "A bug filed as billing",
     "Labeling, Project 5"
    ]
   ],
   "beats": [
    {
     "say": "Last, note the quality risks. Here are four, each with an example."
    },
    {
     "say": "Duplicates: the same ticket saved twice.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Missing fields: a ticket with no text at all.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "Inconsistent formats: the same category written in different cases.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "You'll meet all three in Project 2's practice file, and fix them in the Cleaning stage.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 2
    },
    {
     "say": "Mislabeled examples are trickier. Clear labeling rules in Project 5 guard against them.",
     "hl": 3,
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What's the difference between the Cleaning stage and the Transformation stage?",
   "options": [
    "Cleaning fixes or removes bad data; Transformation turns it into a form a model can use",
    "Cleaning happens after storage; Transformation happens before it",
    "They're two names for the same stage"
   ],
   "answer": 0,
   "good": "That's right. Cleaning fixes or removes bad data. Transformation turns clean data into something a model can use, such as labels or embeddings.",
   "bad": "Not quite. Cleaning fixes or removes bad data. Transformation turns clean data into something a model can use, such as labels or embeddings.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What's the difference between the Cleaning stage and the Transformation stage?",
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
     "A one-page pipeline map",
     ""
    ],
    [
     "Source, stages, volume and risks",
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
     "say": "you have a one-page pipeline map for your A I use case,",
     "show": 1
    },
    {
     "say": "covering source, stages, volume, and quality risks.",
     "show": 2
    },
    {
     "say": "Next, in Module 2, a data cleaning script.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 2 (Module 2): Build a Data Cleaning Script

**Time: about 2.5 hours**

**Goal:** Get hands-on with real, messy data, the unavoidable first technical task in almost every AI data role.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `data_cleaning_project`.
```python
%pip install pandas
```

**Step 2: Get a messy dataset.**
This cell builds a practice file, `raw_data.csv`, of 60 made-up customer support tickets with the problems real data has: missing values, inconsistent casing, stray spaces, a bad date, and duplicate rows. Later projects use this same file.
```python
import random
import pandas as pd

random.seed(0)  # same "random" data every time you run it
templates = {
    "billing": ["I was charged twice this month", "My invoice shows the wrong amount",
                "How do I get a refund?", "My card payment failed", "Why did my subscription price go up?"],
    "bug": ["The app crashes when I upload a photo", "The login button does nothing",
            "Search results never load", "The page freezes on checkout", "Notifications show the wrong date"],
}
messy_spellings = {"billing": ["billing", "Billing", " BILLING "], "bug": ["bug", "Bug ", "BUG"]}

rows = []
for i in range(1, 61):
    category = random.choice(["billing", "bug"])
    rows.append({
        "ticket_id": f"T{i:03d}",
        "text": f"  {random.choice(templates[category])} (ref {i})  ",
        "customer_email": f"User{i % 15}@Example.com ",
        "created_at": f"2026-09-{(i % 28) + 1:02d}",
        "category": random.choice(messy_spellings[category]),
    })
raw = pd.DataFrame(rows)

# Add realistic problems
raw.loc[[3, 17, 29], "text"] = None              # missing text (a field we can't work without)
raw.loc[[5, 22], "category"] = None              # missing category (a placeholder is fine)
raw.loc[8, "created_at"] = "not a date"          # a value that can't be parsed
raw.loc[12, "category"] = "feature request"      # a category later projects don't expect
raw = pd.concat([raw, raw.iloc[[0, 1, 2]]], ignore_index=True)  # 3 duplicate rows

raw.to_csv("raw_data.csv", index=False)
print(raw.shape)
```
Prefer real data? Use any CSV with similar problems and replace the column names in the steps below with your own.

**Step 3: Load and inspect the data.**
Add a **code cell**, paste in the code below, and run it with **Shift + Enter**.
```python
import pandas as pd
df = pd.read_csv("raw_data.csv")
print(df.shape)
print(df.isnull().sum())
print(df.duplicated().sum())
```
`.isnull().sum()` counts missing values per column; `.duplicated().sum()` counts exact duplicate rows.

**Step 4: Handle missing values.**
```python
df = df.dropna(subset=["text"])
df["category"] = df["category"].fillna("unknown")
```
**dropping** removes rows with missing data in columns you can't work without; **filling** replaces gaps in columns where a placeholder is acceptable.

**Step 5: Remove duplicates.**
```python
df = df.drop_duplicates()
```
Duplicate rows silently bias any model or statistic trained on this data toward whatever's overrepresented.

**Step 6: Standardize formats.**
```python
df["text"] = df["text"].str.strip()
df["customer_email"] = df["customer_email"].str.lower().str.strip()
df["category"] = df["category"].str.lower().str.strip()
df["created_at"] = pd.to_datetime(df["created_at"], errors="coerce")
print(df["category"].value_counts())
```
**standardizing** means forcing values into one consistent format (lowercase text, a single date format) so "Billing", "billing", and " BILLING " aren't treated as three different values. `errors="coerce"` turns dates that can't be read, like `"not a date"`, into `NaT` (pandas' "missing date") instead of crashing.

**Step 7: Validate the cleaned result.**
```python
assert df.isnull().sum()["text"] == 0
assert df.duplicated().sum() == 0
print("Cleaning validated.")
```
An **assertion** halts the script if a condition isn't met, a cheap, automatic sanity check.

**Step 8: Save the cleaned dataset.**
```python
df.to_csv("cleaned_data.csv", index=False)
```
Download `raw_data.csv` and `cleaned_data.csv` from the **Files** panel (right-click → **Download**). Projects 4, 5, and 7 use them.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
data_cleaning_project/
│
├── raw_data.csv
├── clean_data.py
├── cleaned_data.csv
```

### What You Learned
- ✅ Diagnosing missing values and duplicates
- ✅ Deciding when to drop vs. fill missing data
- ✅ Removing duplicate rows
- ✅ Standardizing inconsistent formats
- ✅ Validating cleaning results with assertions
- ✅ Saving a cleaned dataset for downstream use

### Portfolio Project
**Data Cleaning Pipeline Script**: Built a reusable Python script that diagnoses, cleans, standardizes, and validates a messy real-world dataset, producing a verified clean output file.
**Skills:** Python, Pandas, Data Cleaning, Data Quality, AI Data Engineering.

**Deliverable:** A data cleaning script and a validated, cleaned CSV file.

### Quiz

1. When should you drop rows with missing values, and when should you fill them instead?
2. Why do duplicate rows matter for AI training data?
3. Why lowercase and strip values like "Billing" and " BILLING "?
4. What does `errors="coerce"` do in `pd.to_datetime`?
5. What does an `assert` do in a cleaning script?

*Answers: 1) Drop rows when a column you can't work without is missing (like the ticket text); fill when a placeholder such as "unknown" is acceptable (like the category). 2) They make some examples count more than once, which biases any model or statistic toward them. 3) So the same value written different ways is treated as one value instead of several. 4) It turns values that can't be read as dates into `NaT` (a missing date) instead of stopping with an error. 5) It stops the script with an error if a condition isn't true, an automatic check that cleaning worked.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "mess",
   "kicker": "Project 2 · Clean the data",
   "title": "Real, messy data",
   "beats": [
    {
     "say": "Welcome to Project 2."
    },
    {
     "say": "Cleaning messy data is the unavoidable first technical task in almost every A I data role."
    },
    {
     "say": "You'll build a practice file of sixty made-up support tickets with missing values, inconsistent casing, stray spaces, a bad date, and duplicate rows."
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Step 3",
   "title": "Load and inspect raw_data.csv",
   "file": "data_cleaning_project",
   "code": "import pandas as pd\ndf = pd.read_csv(\"raw_data.csv\")\nprint(df.shape)\nprint(df.isnull().sum())\nprint(df.duplicated().sum())",
   "beats": [
    {
     "say": "First, load the practice file with pandas.",
     "line": [
      1,
      2
     ]
    },
    {
     "say": "Its shape is sixty three rows and five columns: sixty tickets, plus three duplicate rows.",
     "line": 3,
     "vars": {
      "df": "63 rows × 5 columns"
     },
     "out": "(63, 5)"
    },
    {
     "say": "Is null, sum, counts the gaps in each column. Three tickets have no text, and two have no category.",
     "line": 4,
     "out": [
      "ticket_id         0",
      "text              3",
      "customer_email    0",
      "created_at        0",
      "category          2"
     ]
    },
    {
     "say": "Notice created at shows zero. Not a date is still a string, so it doesn't count as missing yet.",
     "line": 4
    },
    {
     "say": "Duplicated, sum, counts exact duplicate rows: three.",
     "line": 5,
     "out": "3"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Steps 4 and 5",
   "title": "Drop, fill, then deduplicate",
   "columns": [
    "ticket_id",
    "text",
    "category"
   ],
   "rows": [
    [
     "T001",
     "The page freezes…",
     "bug"
    ],
    [
     "T004",
     "(missing)",
     "bug"
    ],
    [
     "T006",
     "Why did my subscri…",
     "(missing)"
    ],
    [
     "T018",
     "(missing)",
     "billing"
    ],
    [
     "T023",
     "Notifications show…",
     "(missing)"
    ],
    [
     "T030",
     "(missing)",
     "\" BILLING \""
    ],
    [
     "T001",
     "The page freezes…",
     "bug"
    ]
   ],
   "beats": [
    {
     "say": "Here are seven of the raw rows, including every row with a gap."
    },
    {
     "say": "The text is the one field you can't work without. Three rows are missing it.",
     "col": 1,
     "sql": "df = df.dropna(subset=[\"text\"])",
     "hl": [
      1,
      3,
      5
     ],
     "dim": true
    },
    {
     "say": "So they're dropped. Sixty three rows become sixty.",
     "sql": "df = df.dropna(subset=[\"text\"])   # 63 → 60",
     "hl": [
      1,
      3,
      5
     ],
     "dim": true
    },
    {
     "say": "Two rows are missing a category. A placeholder is fine there, so they're filled with unknown.",
     "col": 2,
     "sql": "df[\"category\"] = df[\"category\"].fillna(\"unknown\")",
     "hl": [
      2,
      4
     ],
     "dim": true
    },
    {
     "say": "Ticket T 0 0 1 appears twice, exactly the same.",
     "sql": "df = df.drop_duplicates()",
     "hl": [
      0,
      6
     ],
     "dim": true
    },
    {
     "say": "Drop duplicates removes the extra copies of T 0 0 1, T 0 0 2 and T 0 0 3. Sixty becomes fifty seven.",
     "sql": "df = df.drop_duplicates()   # 60 → 57",
     "hl": 6,
     "dim": true
    },
    {
     "say": "Left in, duplicates would quietly bias a model toward whatever's repeated.",
     "hl": 6,
     "dim": true
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Step 6",
   "title": "Six spellings become one",
   "values": [
    "\"bug\"",
    "\"Bug \"",
    "\"BUG\"",
    "\"billing\"",
    "\"Billing\"",
    "\" BILLING \""
   ],
   "beats": [
    {
     "say": "The category column spells the same two values six different ways."
    },
    {
     "say": "To pandas, these are six different categories.",
     "hl": [
      0,
      1,
      2,
      3,
      4,
      5
     ]
    },
    {
     "say": "First, lowercase everything.",
     "vals": [
      "\"bug\"",
      "\"bug \"",
      "\"bug\"",
      "\"billing\"",
      "\"billing\"",
      "\" billing \""
     ],
     "hl": [
      1,
      2,
      4,
      5
     ],
     "note": "df[\"category\"].str.lower()"
    },
    {
     "say": "Then strip the stray spaces from both ends.",
     "vals": [
      "\"bug\"",
      "\"bug\"",
      "\"bug\"",
      "\"billing\"",
      "\"billing\"",
      "\"billing\""
     ],
     "hl": [
      1,
      5
     ],
     "note": ".str.strip()"
    },
    {
     "say": "Now there are only two values. Value counts shows bug twenty seven, billing twenty seven, unknown two, and feature request one.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5
     ],
     "note": "bug 27 · billing 27 · unknown 2 · feature request 1"
    },
    {
     "say": "The text and emails get the same treatment. And errors equals coerce turns the bad date into N a T, a missing date, instead of crashing.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5
     ],
     "note": "\"not a date\" → NaT  (errors=\"coerce\")"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Steps 7 and 8",
   "title": "Prove it, then save it",
   "file": "data_cleaning_project",
   "code": "assert df.isnull().sum()[\"text\"] == 0\nassert df.duplicated().sum() == 0\nprint(\"Cleaning validated.\")\n\ndf.to_csv(\"cleaned_data.csv\", index=False)",
   "beats": [
    {
     "say": "An assertion stops the script if its condition isn't true. A cheap, automatic check.",
     "line": 1
    },
    {
     "say": "Missing text: zero. The first check passes.",
     "line": 1,
     "vars": {
      "missing text": 0,
      "rows": 57
     }
    },
    {
     "say": "Duplicate rows: zero. The second check passes too.",
     "line": 2,
     "vars": {
      "missing text": 0,
      "duplicates": 0,
      "rows": 57
     }
    },
    {
     "say": "So the cell prints: cleaning validated.",
     "line": 3,
     "out": "Cleaning validated."
    },
    {
     "say": "One gap is still there: the bad date is now N a T. These checks don't look at dates. Project 7 will catch it.",
     "line": [
      1,
      2
     ],
     "vars": {
      "missing text": 0,
      "duplicates": 0,
      "rows": 57,
      "missing created_at": 1
     }
    },
    {
     "say": "Save the fifty seven clean rows to cleaned data dot C S V, and download both files. Projects 4, 5 and 7 use them.",
     "line": 5
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "When should you fill a missing value instead of dropping the row?",
   "options": [
    "Whenever the column has text in it",
    "Never, always drop rows with gaps",
    "When a placeholder such as unknown is acceptable, like the category"
   ],
   "answer": 2,
   "good": "That's right. Drop rows when a column you can't work without is missing, like the ticket text. Fill when a placeholder is acceptable, like the category.",
   "bad": "Not quite. Drop rows when a column you can't work without is missing, like the ticket text. Fill when a placeholder is acceptable, like the category.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "When should you fill a missing value instead of dropping the row?",
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
     "A data cleaning script",
     ""
    ],
    [
     "A validated, cleaned CSV",
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
     "say": "you have a data cleaning script,",
     "show": 1
    },
    {
     "say": "and a validated, cleaned C S V file.",
     "show": 2
    },
    {
     "say": "Next, in Module 3, a schema for a training dataset store.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 3 (Module 3): Design a Schema for a Training Dataset Store

**Time: about 2 hours**

**Goal:** Decide how cleaned data should be structured and stored, the step between "I have clean data" and "a model can reliably use this data."

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `schema_design_project`.

**Step 2: Identify your entities.**
An **entity** is a distinct "thing" your data describes, e.g., for a support-ticket dataset: `tickets` and `customers`. A ticket's label is a single value per ticket, so in this project it is stored as a `label` field on `tickets` rather than as its own entity.

**Step 3: Define fields for each entity.**
Add a **text cell** headed `schema` and write your notes in it.
For each entity, list its fields and types: `ticket_id (string), text (string), created_at (datetime), label (string)`.

**Step 4: Define relationships between entities.**
A **foreign key** is a field in one table that references the identifier of another (e.g., `tickets.customer_id` points to `customers.id`).

**Step 5: Add versioning fields.**
Add `dataset_version` and `created_at` fields to your core table.
**dataset versioning** means every row (or dataset snapshot) can be traced to exactly when and how it was produced.

**Step 6: Write the schema as SQL.**
```sql
CREATE TABLE customers (
    id TEXT PRIMARY KEY,
    name TEXT
);

CREATE TABLE tickets (
    ticket_id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP,
    label TEXT,
    customer_id TEXT REFERENCES customers(id),
    dataset_version TEXT
);
```
`PRIMARY KEY` uniquely identifies each row; `NOT NULL` enforces that a field can't be left empty; `REFERENCES` makes `customer_id` a foreign key pointing at `customers.id`.

Now run the schema to prove it works. Python's built-in `sqlite3` module creates a small database file, so there's nothing to install. Add a **code cell**, paste in the code below, and run it:
```python
import sqlite3

schema = """
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT
);
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP,
    label TEXT,
    customer_id TEXT REFERENCES customers(id),
    dataset_version TEXT
);
"""
conn = sqlite3.connect("schema_test.db")
conn.execute("PRAGMA foreign_keys = ON")   # SQLite only enforces REFERENCES when this is on
conn.executescript(schema)
conn.execute("INSERT OR REPLACE INTO customers VALUES ('C1', 'Ada')")
conn.execute("INSERT OR REPLACE INTO tickets VALUES "
             "('T001', 'I was charged twice', '2026-09-01', 'billing_issue', 'C1', 'v1')")
conn.commit()

try:
    conn.execute("INSERT INTO tickets (ticket_id, text) VALUES ('T002', NULL)")
except sqlite3.IntegrityError as error:
    print("Rejected as expected:", error)

print(conn.execute("SELECT * FROM tickets").fetchall())
conn.close()
```
The empty-text row is rejected with `NOT NULL constraint failed: tickets.text`, which shows the schema itself guards data quality, not just your cleaning code. SQLite ignores `REFERENCES` unless you switch on `PRAGMA foreign_keys` for each connection, which is why the code does that right after connecting; with it on, a ticket whose `customer_id` isn't in `customers` is rejected with `FOREIGN KEY constraint failed`.

**Step 7: The schema.**
Your tables and their foreign-key relationship look like this:

```mermaid
erDiagram
    CUSTOMERS ||--o{ TICKETS : has
    CUSTOMERS {
        string id PK
        string name
    }
    TICKETS {
        string ticket_id PK
        string text
        datetime created_at
        string label
        string customer_id FK
        string dataset_version
    }
```

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
schema_design_project/
│
├── schema.md
├── schema.sql
├── schema_diagram.png
```

### What You Learned
- ✅ Identifying entities in a dataset
- ✅ Defining fields and types
- ✅ Modeling relationships with foreign keys
- ✅ Adding dataset versioning for traceability
- ✅ Writing schema as executable SQL
- ✅ Diagramming a data model

### Portfolio Project
**Training Dataset Schema Design**: Designed a versioned, relational schema for a training dataset store, including entity relationships and executable SQL table definitions.
**Skills:** Database Design, SQL, Data Modeling, AI Data Engineering.

**Deliverable:** A schema document, SQL table definitions, and a diagram for your training dataset store.

### Quiz

1. What is an entity in a schema?
2. What does a foreign key such as `tickets.customer_id` do?
3. What do `PRIMARY KEY` and `NOT NULL` enforce?
4. Why add a `dataset_version` field to a training data table?

*Answers: 1) A distinct thing the data describes, such as tickets or customers, which usually becomes its own table. 2) It stores the id of a row in another table, linking each ticket to the customer it belongs to. 3) `PRIMARY KEY` makes each row's identifier unique; `NOT NULL` stops a field from being left empty. 4) So every row can be traced to when and how it was produced, which lets you reproduce or compare training runs.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "database",
   "kicker": "Project 3 · Design a schema",
   "title": "Structure before storage",
   "beats": [
    {
     "say": "Welcome to Project 3."
    },
    {
     "say": "Now decide how cleaned data should be structured and stored. It's the step between I have clean data, and a model can reliably use this data."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Steps 2, 4 and 5",
   "title": "Entities become linked tables",
   "nodes": [
    {
     "id": "cus",
     "label": "customers",
     "x": 14,
     "y": 50,
     "sub": "id · name",
     "art": "idcard"
    },
    {
     "id": "tik",
     "label": "tickets",
     "x": 52,
     "y": 50,
     "sub": "one row per ticket",
     "art": "table"
    },
    {
     "id": "run",
     "label": "Training run",
     "x": 88,
     "y": 50,
     "sub": "reads one version",
     "art": "neural"
    }
   ],
   "edges": [
    {
     "from": "cus",
     "to": "tik"
    },
    {
     "from": "tik",
     "to": "run"
    }
   ],
   "beats": [
    {
     "say": "An entity is a distinct thing your data describes. For support tickets: customers, and tickets.",
     "show": 2,
     "on": [
      "cus",
      "tik"
     ]
    },
    {
     "say": "Each entity becomes its own table, with its own fields.",
     "show": 2,
     "on": "tik"
    },
    {
     "say": "Labels could be a third entity. In this schema, label is simply a field on tickets.",
     "show": 2,
     "on": "tik"
    },
    {
     "say": "A foreign key links them. Ticket T 0 0 1 stores a customer I D: C one.",
     "show": 2,
     "on": "tik",
     "send": {
      "from": "tik",
      "to": "cus",
      "label": "customer_id C1"
     }
    },
    {
     "say": "That points at a row in customers: C one is Ada.",
     "show": 2,
     "on": "cus",
     "send": {
      "from": "cus",
      "to": "tik",
      "label": "C1 = Ada"
     }
    },
    {
     "say": "Versioning fields go on the core table, so a training run can say exactly which rows it used.",
     "show": 3,
     "on": "run",
     "send": {
      "from": "tik",
      "to": "run",
      "label": "version v1"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Steps 3, 5 and 6",
   "title": "The tickets table, field by field",
   "columns": [
    "Field",
    "Type",
    "Rule"
   ],
   "rows": [
    [
     "ticket_id",
     "TEXT",
     "PRIMARY KEY"
    ],
    [
     "text",
     "TEXT",
     "NOT NULL"
    ],
    [
     "created_at",
     "TIMESTAMP",
     "Versioning: when"
    ],
    [
     "label",
     "TEXT",
     ""
    ],
    [
     "customer_id",
     "TEXT",
     "REFERENCES customers"
    ],
    [
     "dataset_version",
     "TEXT",
     "Versioning: which"
    ]
   ],
   "beats": [
    {
     "say": "Here's the core table as S Q L: every field, with its type.",
     "sql": "CREATE TABLE tickets ( ... );",
     "col": 1
    },
    {
     "say": "Primary key makes ticket I D unique. No two rows can share one.",
     "hl": 0,
     "dim": true,
     "col": 2
    },
    {
     "say": "Not null means the text can never be left empty.",
     "hl": 1,
     "dim": true,
     "col": 2
    },
    {
     "say": "References makes customer I D a foreign key, pointing at customers dot I D.",
     "hl": 4,
     "dim": true,
     "col": 2
    },
    {
     "say": "Created at and dataset version trace every row to when and how it was produced.",
     "hl": [
      2,
      5
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "And label will hold the labels you make in Project 5.",
     "hl": 3,
     "dim": true
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Step 6 · Run it",
   "title": "The schema guards quality too",
   "file": "schema_design_project",
   "code": "conn = sqlite3.connect(\"schema_test.db\")\nconn.execute(\"PRAGMA foreign_keys = ON\")\nconn.executescript(schema)\nconn.execute(\"INSERT OR REPLACE INTO customers \"\n             \"VALUES ('C1', 'Ada')\")\nconn.execute(\"INSERT OR REPLACE INTO tickets VALUES\"\n    \" ('T001', 'I was charged twice', \"\n    \"'2026-09-01', 'billing_issue', 'C1', 'v1')\")\ntry:\n    conn.execute(\"INSERT INTO tickets (ticket_id, \"\n        \"text) VALUES ('T002', NULL)\")\nexcept sqlite3.IntegrityError as error:\n    print(\"Rejected as expected:\", error)\nprint(conn.execute(\n    \"SELECT * FROM tickets\").fetchall())",
   "beats": [
    {
     "say": "Run it with Python's built-in S Q Lite module. Nothing to install.",
     "line": [
      1,
      3
     ]
    },
    {
     "say": "Line two matters: S Q Lite only enforces foreign keys when you switch them on.",
     "line": 2
    },
    {
     "say": "Insert Ada as customer C one.",
     "line": [
      4,
      5
     ],
     "vars": {
      "customers": "1 row"
     }
    },
    {
     "say": "Then a valid ticket that points at her, version v one.",
     "line": [
      6,
      7,
      8
     ],
     "vars": {
      "customers": "1 row",
      "tickets": "1 row"
     }
    },
    {
     "say": "Now try a ticket whose text is null, inside a try block.",
     "line": [
      9,
      10,
      11
     ]
    },
    {
     "say": "When a rule is broken, S Q Lite raises an integrity error, and the except line catches it.",
     "line": 12
    },
    {
     "say": "The database refuses it: not null constraint failed.",
     "line": [
      12,
      13
     ],
     "out": "Rejected as expected: NOT NULL constraint failed: tickets.text"
    },
    {
     "say": "Only the valid ticket is stored. The schema itself guards data quality, not just your cleaning code.",
     "line": [
      14,
      15
     ],
     "vars": {
      "customers": "1 row",
      "tickets": "1 row"
     },
     "out": "[('T001', 'I was charged twice', '2026-09-01', 'billing_issue', 'C1', 'v1')]"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why add a dataset version field to a training data table?",
   "options": [
    "So every row can be traced to when and how it was produced",
    "So the database runs queries faster",
    "Because S Q L requires it on every table"
   ],
   "answer": 0,
   "good": "That's right. Versioning lets you trace every row to when and how it was produced, so you can reproduce or compare training runs.",
   "bad": "Not quite. Versioning lets you trace every row to when and how it was produced, so you can reproduce or compare training runs.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why add a dataset version field to a training data table?",
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
     "A schema document",
     ""
    ],
    [
     "SQL table definitions",
     ""
    ],
    [
     "A schema diagram",
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
     "say": "you have a schema document,",
     "show": 1
    },
    {
     "say": "S Q L table definitions,",
     "show": 2
    },
    {
     "say": "and a diagram for your training dataset store.",
     "show": 3
    },
    {
     "say": "Next, in Module 4, a batch E T L pipeline.",
     "show": 3
    }
   ]
  }
 ]
}
```

---

## Project 4 (Module 4): Build a Batch ETL Pipeline

**Time: about 3 hours**

**Goal:** Automate the move from raw data to stored data, connecting Project 2's cleaning and Project 3's schema into a repeatable process.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `etl_pipeline_project`.
```python
%pip install pandas sqlalchemy
```
Upload `raw_data.csv` from Project 2 to the **Files** panel.

**Step 2: Understand ETL.**
**ETL** stands for **Extract** (pull raw data from a source), **Transform** (clean and reshape it), **Load** (write it into storage). **ELT** does the same steps in a different order, transforming after loading.

**Step 3: Write the Extract step.**
Add a **code cell**, paste in the code below, and run it with **Shift + Enter**.
```python
import pandas as pd

def extract(path):
    return pd.read_csv(path)
```

**Step 4: Write the Transform step.**
```python
def transform(df):
    df = df.dropna(subset=["text"]).drop_duplicates().copy()
    df["text"] = df["text"].str.strip()
    df["customer_email"] = df["customer_email"].str.lower().str.strip()
    df["category"] = df["category"].fillna("unknown").str.lower().str.strip()
    df["created_at"] = pd.to_datetime(df["created_at"], errors="coerce")
    return df
```
These are the same cleaning rules as Project 2, now packed into one function the pipeline can run on every new file. `.copy()` gives you a separate table to edit, which avoids a pandas warning.

**Step 5: Write the Load step.**
```python
from sqlalchemy import create_engine

def load(df, table_name, engine):
    df.to_sql(table_name, engine, if_exists="append", index=False)
```
`if_exists="append"` adds new rows without erasing existing ones, critical for a pipeline that runs repeatedly on new data.

**Step 6: Wire the three stages together.**
```python
def run_pipeline(path, table_name, engine):
    df = extract(path)
    df = transform(df)
    load(df, table_name, engine)
    print(f"Loaded {len(df)} rows into {table_name}")

engine = create_engine("sqlite:///data_store.db")
run_pipeline("raw_data.csv", "tickets", engine)
print(pd.read_sql("SELECT COUNT(*) AS row_count FROM tickets", engine))
```
SQLite stores the whole database in one file, `data_store.db`, so there's no server to set up.

**Step 7: Test with a second batch of data.**
This cell makes a small file representing "tomorrow's data" and runs the pipeline on it:
```python
new_batch = pd.DataFrame([
    {"ticket_id": "T101", "text": "I can't update my billing address", "customer_email": "Ada@Example.com",
     "created_at": "2026-10-01", "category": "Billing"},
    {"ticket_id": "T102", "text": "The export button downloads an empty file", "customer_email": "sam@example.com ",
     "created_at": "2026-10-01", "category": "bug"},
    {"ticket_id": "T103", "text": "Please cancel the extra charge on my account", "customer_email": "lee@example.com",
     "created_at": "2026-10-02", "category": " BILLING"},
])
new_batch.to_csv("new_data.csv", index=False)

run_pipeline("new_data.csv", "tickets", engine)
print(pd.read_sql("SELECT COUNT(*) AS row_count FROM tickets", engine))
```
The row count grows by 3. Notice what would happen if you ran `raw_data.csv` a second time: append mode would add every row again as duplicates. Real pipelines guard against this, for example by tracking which files were already loaded.

**Step 8: Add basic logging.**
Replace your `run_pipeline` cell with this version, which writes a line to `pipeline.log` every run:
```python
import logging

logging.basicConfig(filename="pipeline.log", level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s", force=True)

def run_pipeline(path, table_name, engine):
    df = extract(path)
    df = transform(df)
    load(df, table_name, engine)
    logging.info(f"Pipeline run completed: {len(df)} rows from {path} loaded into {table_name}.")
    print(f"Loaded {len(df)} rows into {table_name}")
```
Run it on a file once more (for example `new_data.csv`), then open `pipeline.log` from the **Files** panel. A log is a lasting record of every run, so you can see what happened even after the notebook output is gone. `force=True` replaces any logging setup Colab already has.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
etl_pipeline_project/
│
├── etl.py
├── raw_data.csv
├── data_store.db
├── pipeline.log
```

### What You Learned
- ✅ The Extract, Transform, Load pattern
- ✅ Isolating pipeline stages into reusable functions
- ✅ Writing to a database with SQLAlchemy
- ✅ Appending vs. replacing data safely
- ✅ Testing pipeline repeatability across multiple runs
- ✅ Adding basic pipeline logging

### Portfolio Project
**Batch ETL Pipeline**: Built a reusable Extract-Transform-Load pipeline that ingests raw CSV data, applies cleaning logic, and loads it into a structured database, tested across multiple repeated runs.
**Skills:** Python, SQL, ETL/ELT, SQLAlchemy, Data Pipelines, AI Data Engineering.

**Deliverable:** A working ETL pipeline script that repeatably processes new data into a structured store.

### Quiz

1. What do the three letters in ETL stand for, and what does each stage do?
2. How is ELT different from ETL?
3. What does `if_exists="append"` do, and what is its risk if you load the same file twice?
4. Why split the pipeline into separate `extract`, `transform`, and `load` functions?
5. Why write a log file instead of only printing messages?

*Answers: 1) Extract pulls raw data from a source, Transform cleans and reshapes it, and Load writes it into storage. 2) ELT loads the raw data first and transforms it afterward, inside the storage system. 3) It adds new rows without erasing existing ones; loading the same file twice adds every row again as duplicates. 4) Each stage can be tested, reused, and changed on its own, and the same steps run the same way on every new file. 5) A log keeps a lasting record of each run that you can check later, even after the notebook output is gone.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "loop",
   "kicker": "Project 4 · Batch E T L",
   "title": "Automate raw to stored",
   "beats": [
    {
     "say": "Welcome to Project 4."
    },
    {
     "say": "You'll connect Project 2's cleaning and Project 3's schema into one repeatable process."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Step 2",
   "title": "ETL, and ELT",
   "nodes": [
    {
     "id": "src",
     "label": "raw_data.csv",
     "x": 12,
     "y": 50,
     "sub": "the source",
     "art": "file"
    },
    {
     "id": "tr",
     "label": "Transform",
     "x": 50,
     "y": 20,
     "sub": "clean and reshape",
     "art": "gear"
    },
    {
     "id": "db",
     "label": "data_store.db",
     "x": 88,
     "y": 50,
     "sub": "storage",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "src",
     "to": "tr"
    },
    {
     "from": "tr",
     "to": "db"
    },
    {
     "from": "src",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "E T L stands for three stages: Extract, Transform, Load.",
     "show": 3
    },
    {
     "say": "Extract pulls the raw data from its source: sixty three rows.",
     "on": "src",
     "send": {
      "from": "src",
      "to": "tr",
      "label": "extract 63 rows"
     }
    },
    {
     "say": "Transform cleans and reshapes them, with Project 2's rules. Fifty seven rows are left.",
     "on": "tr"
    },
    {
     "say": "Load writes them into storage.",
     "on": "db",
     "send": {
      "from": "tr",
      "to": "db",
      "label": "load 57 rows"
     }
    },
    {
     "say": "E L T does the same steps in a different order. It loads the raw data first,",
     "on": "db",
     "send": {
      "from": "src",
      "to": "db",
      "label": "load 63 raw"
     }
    },
    {
     "say": "then transforms it afterwards, inside the storage system.",
     "on": [
      "db",
      "tr"
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Steps 3 to 6",
   "title": "Trace one pipeline run",
   "file": "etl_pipeline_project",
   "code": "def load(df, table_name, engine):\n    df.to_sql(table_name, engine,\n              if_exists=\"append\", index=False)\n\ndef run_pipeline(path, table_name, engine):\n    df = extract(path)\n    df = transform(df)\n    load(df, table_name, engine)\n    print(f\"Loaded {len(df)} rows into \"\n          f\"{table_name}\")\n\nengine = create_engine(\"sqlite:///data_store.db\")\nrun_pipeline(\"raw_data.csv\", \"tickets\", engine)",
   "beats": [
    {
     "say": "Each stage is its own function. Extract just reads the C S V, and transform holds Project 2's cleaning rules."
    },
    {
     "say": "Connect to a S Q Lite file called data store dot D B. No server to set up.",
     "line": 12,
     "vars": {
      "engine": "sqlite:///data_store.db"
     }
    },
    {
     "say": "Run the pipeline on raw data dot C S V, into a table called tickets.",
     "line": 13,
     "vars": {
      "path": "\"raw_data.csv\"",
      "table_name": "\"tickets\""
     }
    },
    {
     "say": "Extract reads sixty three rows.",
     "line": 6,
     "vars": {
      "path": "\"raw_data.csv\"",
      "table_name": "\"tickets\"",
      "len(df)": 63
     }
    },
    {
     "say": "Transform drops, fills, deduplicates and standardizes. Fifty seven rows.",
     "line": 7,
     "vars": {
      "path": "\"raw_data.csv\"",
      "table_name": "\"tickets\"",
      "len(df)": 57
     }
    },
    {
     "say": "Load writes them with if exists equals append, which adds rows without erasing existing ones.",
     "line": [
      8,
      1,
      2,
      3
     ],
     "vars": {
      "len(df)": 57,
      "tickets table": "57 rows"
     }
    },
    {
     "say": "Then it reports what it did.",
     "line": [
      9,
      10
     ],
     "out": "Loaded 57 rows into tickets"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 7",
   "title": "Tomorrow's data, cleaned the same way",
   "columns": [
    "ticket_id",
    "customer_email",
    "category"
   ],
   "rows": [
    [
     "T101",
     "Ada@Example.com",
     "Billing"
    ],
    [
     "T102",
     "\"sam@example.com \"",
     "bug"
    ],
    [
     "T103",
     "lee@example.com",
     "\" BILLING\""
    ]
   ],
   "beats": [
    {
     "say": "Now a small file of tomorrow's data: three new tickets in new data dot C S V."
    },
    {
     "say": "It has the same kinds of mess. Capital letters and a trailing space in the emails.",
     "hl": [
      0,
      1
     ],
     "col": 1
    },
    {
     "say": "And two spellings of billing.",
     "hl": [
      0,
      2
     ],
     "col": 2
    },
    {
     "say": "Run the same pipeline. Transform fixes them: lowercase emails, and billing, bug, billing.",
     "sql": "run_pipeline(\"new_data.csv\", \"tickets\", engine)",
     "col": 2
    },
    {
     "say": "Three rows are appended, and the row count grows from fifty seven to sixty.",
     "sql": "run_pipeline(\"new_data.csv\", \"tickets\", engine)\n→ Loaded 3 rows into tickets · row_count 60"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Step 7 · Careful",
   "title": "Append twice, and you duplicate",
   "nodes": [
    {
     "id": "raw",
     "label": "raw_data.csv",
     "x": 12,
     "y": 22,
     "sub": "Project 2's file",
     "art": "file"
    },
    {
     "id": "new",
     "label": "new_data.csv",
     "x": 12,
     "y": 78,
     "sub": "tomorrow's batch",
     "art": "file"
    },
    {
     "id": "run",
     "label": "run_pipeline",
     "x": 50,
     "y": 50,
     "sub": "append mode",
     "art": "pipeline"
    },
    {
     "id": "db",
     "label": "tickets table",
     "x": 88,
     "y": 50,
     "sub": "data_store.db",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "raw",
     "to": "run"
    },
    {
     "from": "new",
     "to": "run"
    },
    {
     "from": "run",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "Here's what the tickets table has seen so far.",
     "show": 4
    },
    {
     "say": "The first run loaded fifty seven rows.",
     "on": "raw",
     "send": {
      "from": "raw",
      "to": "run",
      "label": "raw_data.csv"
     }
    },
    {
     "say": "Count: fifty seven.",
     "on": "db",
     "send": {
      "from": "run",
      "to": "db",
      "label": "append 57"
     }
    },
    {
     "say": "The new batch added three.",
     "on": "new",
     "send": {
      "from": "new",
      "to": "run",
      "label": "new_data.csv"
     }
    },
    {
     "say": "Count: sixty.",
     "on": "db",
     "send": {
      "from": "run",
      "to": "db",
      "label": "append 3"
     }
    },
    {
     "say": "But run raw data dot C S V a second time,",
     "on": "raw",
     "send": {
      "from": "raw",
      "to": "run",
      "label": "raw_data again"
     }
    },
    {
     "say": "and append mode adds all fifty seven again, as duplicates. Count: one hundred and seventeen.",
     "on": "db",
     "send": {
      "from": "run",
      "to": "db",
      "label": "append 57 again"
     }
    },
    {
     "say": "Real pipelines guard against this, for example by tracking which files were already loaded.",
     "on": "run"
    }
   ]
  },
  {
   "kind": "code",
   "art": "doc",
   "kicker": "Step 8",
   "title": "Keep a log",
   "file": "etl_pipeline_project",
   "code": "import logging\n\nlogging.basicConfig(filename=\"pipeline.log\", level=logging.INFO,\n                    format=\"%(asctime)s %(levelname)s %(message)s\", force=True)\n\n# inside run_pipeline, after load(...):\nlogging.info(f\"Pipeline run completed: {len(df)} rows from {path} loaded into {table_name}.\")",
   "beats": [
    {
     "say": "Finally, add logging.",
     "show": 0
    },
    {
     "say": "Every run writes a line to pipeline dot log.",
     "show": 1
    },
    {
     "say": "A log is a lasting record of every run, so you can see what happened even after the notebook output is gone.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What's the risk of if exists equals append when you load the same file twice?",
   "options": [
    "The table is erased and rebuilt",
    "Every row is added again as duplicates",
    "The pipeline refuses to run"
   ],
   "answer": 1,
   "good": "That's right. Append adds new rows without erasing existing ones, so loading the same file twice adds every row again as duplicates.",
   "bad": "Not quite. Append adds new rows without erasing existing ones, so loading the same file twice adds every row again as duplicates.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What's the risk of if exists equals append when you load the same file twice?",
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
     "A working ETL pipeline",
     ""
    ],
    [
     "New data loads repeatably",
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
     "say": "you have a working E T L pipeline,",
     "show": 1
    },
    {
     "say": "that repeatably processes new data into a structured store.",
     "show": 2
    },
    {
     "say": "Next, in Module 5, a labeled dataset for training.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 5 (Module 5): Prepare a Labeled Dataset for Training

**Time: about 2.5 hours**

**Goal:** Take cleaned, stored data (Project 4's output) and turn it into something a model can actually be trained on.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `labeled_dataset_project`.
```python
%pip install pandas scikit-learn
```
Upload `cleaned_data.csv` from Project 2 to the **Files** panel.

**Step 2: Load your cleaned data.**
```python
import pandas as pd
df = pd.read_csv("cleaned_data.csv")
print(df.shape)
print(df["category"].value_counts())
```
This holds the same cleaned tickets your Project 4 pipeline loads into its database. (To read from the database instead, upload `data_store.db` and use `pd.read_sql("SELECT * FROM tickets", create_engine("sqlite:///data_store.db"))` after `from sqlalchemy import create_engine`.)

**Step 3: Define labeling criteria.**
Add a **text cell** headed `labeling_guide` and write your notes in it.
Write clear rules for what each label means, with 2–3 examples per label.

**Step 4: Apply labels.**
For a small dataset, label manually using your guide; for a larger one, use an existing labeled column or a simple rule-based heuristic as a starting point.
```python
df["label"] = df["category"].map({"billing": "billing_issue", "bug": "technical_issue"})

# Categories missing from the map (like "unknown" or "feature request") become NaN (empty).
unlabeled = df["label"].isna().sum()
print(f"Dropping {unlabeled} rows with no label")
df = df.dropna(subset=["label"])
```
`.map()` returns NaN for any value not in the dictionary. Those rows must be removed (or labeled by hand) before splitting, because the split in Step 6 can't handle missing labels.

**Step 5: Check label distribution.**
```python
print(df["label"].value_counts())
```
**class imbalance** here means some labels have far fewer examples than others. Each label also needs enough examples (at least about 10) for the stratified split in Step 6 to work; with too few, scikit-learn stops with an error saying a class has too few members.

**Step 6: Split into train, validation, and test sets.**
```python
from sklearn.model_selection import train_test_split
train, temp = train_test_split(df, test_size=0.3, random_state=42, stratify=df["label"])
val, test = train_test_split(temp, test_size=0.5, random_state=42, stratify=temp["label"])
print(len(train), len(val), len(test))
```
This gives about 70% train, 15% validation, and 15% test.
`stratify` ensures each split has roughly the same label distribution as the full dataset. A **validation set** is used during model development; a **test set** is held back until final evaluation only.

**Step 7: Check for data leakage.**
**data leakage** happens when information from the test set (or future data) accidentally influences training, e.g., duplicate rows across splits, or a feature that encodes the label indirectly.
```python
id_overlap = set(train["ticket_id"]) & set(test["ticket_id"])
text_overlap = set(train["text"]) & set(test["text"])
assert len(id_overlap) == 0, "Leakage: the same ticket_id is in train and test!"
assert len(text_overlap) == 0, "Leakage: the same ticket text is in train and test!"
print("No leakage found between train and test.")
```
Checking the text as well as the id catches the same ticket saved twice under different ids.

**Step 8: Save the final labeled splits.**
```python
train.to_csv("train.csv", index=False)
val.to_csv("val.csv", index=False)
test.to_csv("test.csv", index=False)
```

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
labeled_dataset_project/
│
├── labeling_guide.md
├── prepare_labels.py
├── train.csv
├── val.csv
├── test.csv
```

### What You Learned
- ✅ Writing clear labeling criteria
- ✅ Applying labels consistently
- ✅ Detecting class imbalance in labeled data
- ✅ Splitting data into train/validation/test with stratification
- ✅ Detecting and preventing data leakage
- ✅ Producing model-ready labeled datasets

### Portfolio Project
**Labeled Training Dataset Preparation**: Defined labeling criteria, applied labels to a cleaned dataset, checked for class imbalance and data leakage, and produced stratified train/validation/test splits.
**Skills:** Data Labeling, Scikit-learn, Data Quality, ML Data Preparation, AI Data Engineering.

**Deliverable:** A labeling guide plus stratified, leakage-checked train/validation/test CSV files.

### Quiz

1. What happens to a category that isn't in the dictionary you pass to `.map()`, and how do you handle it?
2. What does `stratify` do when splitting data?
3. What is the difference between a validation set and a test set?
4. What is data leakage? Give one example.

*Answers: 1) It becomes NaN (no label); drop those rows with `dropna(subset=["label"])` or label them by hand before splitting. 2) It keeps the label proportions in each split roughly the same as in the full dataset. 3) The validation set is used while developing the model; the test set is held back and used only for the final evaluation. 4) It is when information from the test set or the future influences training, for example the same ticket appearing in both train and test.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "test",
   "kicker": "Project 5 · Labeled dataset",
   "title": "Ready to train on",
   "beats": [
    {
     "say": "Welcome to Project 5."
    },
    {
     "say": "You'll take cleaned, stored data and turn it into something a model can actually be trained on."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Steps 2 to 5",
   "title": "Map categories to labels",
   "columns": [
    "category",
    "rows",
    "label"
   ],
   "rows": [
    [
     "bug",
     "27",
     "technical_issue"
    ],
    [
     "billing",
     "27",
     "billing_issue"
    ],
    [
     "unknown",
     "2",
     "NaN"
    ],
    [
     "feature request",
     "1",
     "NaN"
    ]
   ],
   "beats": [
    {
     "say": "Load cleaned data dot C S V: fifty seven tickets, in four categories.",
     "col": 1
    },
    {
     "say": "First, write a labeling guide: clear rules for each label, with two or three examples each."
    },
    {
     "say": "Then a simple rule maps bug to technical issue, and billing to billing issue.",
     "sql": "df[\"label\"] = df[\"category\"].map(\n  {\"billing\": \"billing_issue\", \"bug\": \"technical_issue\"})",
     "col": 2
    },
    {
     "say": "Unknown and feature request aren't in the map, so their label comes back empty: N a N.",
     "hl": [
      2,
      3
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "The split can't handle missing labels, so those three rows are dropped. Fifty four remain.",
     "sql": "df = df.dropna(subset=[\"label\"])\n→ Dropping 3 rows with no label",
     "hl": [
      0,
      1
     ],
     "dim": true
    },
    {
     "say": "Now check the distribution: twenty seven of each. No class imbalance, and well over the ten or so each label needs.",
     "sql": "df[\"label\"].value_counts()",
     "hl": [
      0,
      1
     ],
     "dim": true,
     "col": 1
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Step 6",
   "title": "Split 54 rows three ways",
   "nodes": [
    {
     "id": "all",
     "label": "54 labeled rows",
     "x": 12,
     "y": 50,
     "sub": "after dropping 3",
     "art": "table"
    },
    {
     "id": "train",
     "label": "train",
     "x": 50,
     "y": 20,
     "sub": "about 70%",
     "art": "neural"
    },
    {
     "id": "temp",
     "label": "temp",
     "x": 50,
     "y": 80,
     "sub": "the other 30%",
     "art": "boxes"
    },
    {
     "id": "val",
     "label": "validation",
     "x": 88,
     "y": 55,
     "sub": "used while developing",
     "art": "test"
    },
    {
     "id": "test",
     "label": "test",
     "x": 88,
     "y": 85,
     "sub": "held back to the end",
     "art": "lock"
    }
   ],
   "edges": [
    {
     "from": "all",
     "to": "train"
    },
    {
     "from": "all",
     "to": "temp"
    },
    {
     "from": "temp",
     "to": "val"
    },
    {
     "from": "temp",
     "to": "test"
    }
   ],
   "beats": [
    {
     "say": "Start with the fifty four labeled tickets.",
     "show": 1,
     "on": "all"
    },
    {
     "say": "The first split keeps seventy percent for training: thirty seven rows.",
     "show": 3,
     "on": "train",
     "send": {
      "from": "all",
      "to": "train",
      "label": "37 rows"
     }
    },
    {
     "say": "The other thirty percent, seventeen rows, go into a temporary set.",
     "show": 3,
     "on": "temp",
     "send": {
      "from": "all",
      "to": "temp",
      "label": "17 rows"
     }
    },
    {
     "say": "The second split cuts that in half: eight rows for validation,",
     "show": 5,
     "on": "val",
     "send": {
      "from": "temp",
      "to": "val",
      "label": "8 rows"
     }
    },
    {
     "say": "and nine for test.",
     "show": 5,
     "on": "test",
     "send": {
      "from": "temp",
      "to": "test",
      "label": "9 rows"
     }
    },
    {
     "say": "Validation is used while you develop the model. Test is held back until the final evaluation.",
     "show": 5,
     "on": [
      "val",
      "test"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 6 · stratify",
   "title": "Every split keeps the same label mix",
   "columns": [
    "Split",
    "Rows",
    "billing_issue",
    "technical_issue"
   ],
   "rows": [
    [
     "train",
     "37",
     "18",
     "19"
    ],
    [
     "val",
     "8",
     "4",
     "4"
    ],
    [
     "test",
     "9",
     "5",
     "4"
    ],
    [
     "all",
     "54",
     "27",
     "27"
    ]
   ],
   "beats": [
    {
     "say": "Both splits pass stratify, set to the label column.",
     "sql": "train_test_split(df, test_size=0.3,\n    random_state=42, stratify=df[\"label\"])"
    },
    {
     "say": "The full dataset is exactly half billing, half technical.",
     "hl": 3,
     "dim": true
    },
    {
     "say": "Training gets eighteen and nineteen: still about half and half.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Validation gets four and four. Test gets five and four.",
     "hl": [
      1,
      2
     ],
     "dim": true
    },
    {
     "say": "Without stratify, a small split could end up mostly one label by chance, and its scores would mislead you.",
     "hl": [
      1,
      2
     ],
     "dim": true,
     "col": 1
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Step 7",
   "title": "Check the test set for leakage",
   "values": [
    "T035",
    "T015",
    "T022",
    "T034",
    "T045",
    "T029",
    "T044",
    "T025",
    "T021"
   ],
   "beats": [
    {
     "say": "Data leakage is when information from the test set, or the future, accidentally influences training."
    },
    {
     "say": "Here are the nine test tickets. Is any of their I Ds also in train?",
     "hl": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
     ],
     "note": "id_overlap = train ids ∩ test ids"
    },
    {
     "say": "None are. The overlap is empty.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
     ],
     "note": "id_overlap = set()  ✓"
    },
    {
     "say": "Now the same check on the ticket text. Also empty.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
     ],
     "note": "text_overlap = set()  ✓"
    },
    {
     "say": "The text check matters: the same ticket saved twice under different I Ds would slip past the I D check.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
     ],
     "note": "same text, new id → only the text check catches it"
    },
    {
     "say": "Both assertions pass. Save train, val and test as three C S V files.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
     ],
     "note": "No leakage found between train and test."
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does stratify do when splitting data?",
   "options": [
    "It shuffles the rows into random order",
    "It removes duplicate rows from each split",
    "It keeps the label proportions in each split close to the full dataset"
   ],
   "answer": 2,
   "good": "That's right. Stratify keeps the label proportions in each split roughly the same as in the full dataset.",
   "bad": "Not quite. Stratify keeps the label proportions in each split roughly the same as in the full dataset.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does stratify do when splitting data?",
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
     "A labeling guide",
     ""
    ],
    [
     "Stratified, leakage-checked splits",
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
     "say": "you have a labeling guide,",
     "show": 1
    },
    {
     "say": "plus stratified, leakage-checked train, validation and test files.",
     "show": 2
    },
    {
     "say": "Next, in Module 6, a vector store from a document set.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 6 (Module 6): Build a Vector Store from a Document Set

**Time: about 3 hours**

**Goal:** Extend your data engineering skills to unstructured text and the retrieval systems behind modern AI applications like RAG chatbots.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `vector_store_project`.
```python
%pip install sentence-transformers chromadb
```

**Step 2: Gather a document set.**
Collect 10–20 text documents (articles, FAQs, or paragraphs) and save each as a `.txt` file. In the **Files** panel, create a folder named `documents` (right-click → **New folder**) and upload the files into it.

**Step 3: Chunk the documents.**
Add a **code cell**, paste in the code below, and run it with **Shift + Enter**.
```python
def chunk_text(text, chunk_size=200, overlap=50):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunks.append(" ".join(words[i:i + chunk_size]))
        if i + chunk_size >= len(words):  # this chunk reached the end of the text
            break
    return chunks
```
**chunking** splits long documents into smaller pieces; **overlap** repeats a few words between chunks so context isn't lost at the boundary. With these settings, each new chunk starts 150 words after the previous one.

Now load every file in the folder and chunk it, keeping track of which file each chunk came from:
```python
import os

chunks = []         # the text of every chunk, from every document
chunk_sources = []  # the file name each chunk came from
for filename in sorted(os.listdir("documents")):
    if not filename.endswith(".txt"):
        continue
    with open(os.path.join("documents", filename), encoding="utf-8") as f:
        text = f.read()
    for chunk in chunk_text(text):
        chunks.append(chunk)
        chunk_sources.append(filename)

print(f"{len(chunks)} chunks from {len(set(chunk_sources))} documents")
print(chunks[0][:200])
```

**Step 4: Generate embeddings.**
```python
from sentence_transformers import SentenceTransformer
model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model.encode(chunks)
```
An **embedding** is a list of numbers representing a chunk's meaning, texts with similar meaning end up with mathematically similar embeddings.

**Step 5: Store embeddings in a vector database.**
```python
import chromadb
client = chromadb.Client()
collection = client.get_or_create_collection("documents")

collection.add(
    documents=chunks,
    embeddings=embeddings.tolist(),
    ids=[f"chunk_{i}" for i in range(len(chunks))],
    metadatas=[{"source": name} for name in chunk_sources],
)
print(collection.count(), "chunks stored")
```
A **vector database** stores embeddings and is optimized to quickly find the closest matches to a new query embedding. The `source` metadata records which file each chunk came from. `get_or_create_collection` lets you rerun the cell without an "already exists" error; if you change your documents, restart the runtime first so old chunks don't stay in the collection.

**Step 6: Query the vector store.**
```python
query = "How do I reset my password?"  # change this to fit your documents
query_embedding = model.encode([query])
results = collection.query(query_embeddings=query_embedding.tolist(), n_results=3)
for document, metadata, distance in zip(results["documents"][0], results["metadatas"][0], results["distances"][0]):
    print(f"{metadata['source']} (distance {distance:.3f}): {document[:150]}")
```
A smaller **distance** means a closer match in meaning.

**Step 7: Evaluate retrieval quality.**
Try 5 different queries and manually judge whether the top results are actually relevant.

**Step 8: Document your chunking and embedding choices.**
Add a **text cell** headed `vector_store_notes` and write your notes in it.
Record chunk size, overlap, embedding model used, and your retrieval evaluation results.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
vector_store_project/
│
├── documents/
├── build_vector_store.py
├── vector_store_notes.md
```

### What You Learned
- ✅ Chunking long text into retrievable pieces
- ✅ Generating embeddings for semantic meaning
- ✅ Storing and querying a vector database
- ✅ Retrieving results by meaning, not just keywords
- ✅ Evaluating retrieval quality manually
- ✅ Documenting chunking and embedding decisions

### Portfolio Project
**Document Vector Store for Semantic Search**: Built a chunking and embedding pipeline over a real document set, stored it in a vector database, and evaluated retrieval quality across multiple queries.
**Skills:** Embeddings, Vector Databases, RAG Foundations, Python, AI Data Engineering.

**Deliverable:** A working vector store built from a real document set, with a retrieval evaluation.

### Quiz

1. Why split documents into chunks before embedding them?
2. What does the overlap between chunks prevent?
3. What is an embedding?
4. Why must the query be embedded with the same model as the chunks?
5. Why store the source file name as metadata with each chunk?

*Answers: 1) Smaller pieces can be matched to a question more precisely, and embedding models only read a limited amount of text at once. 2) It keeps an idea that falls on a chunk boundary from being cut in half and losing its context. 3) A list of numbers that represents a text's meaning, so texts with similar meaning get similar numbers. 4) Embeddings from different models live in different number spaces and can't be compared meaningfully. 5) So each search result can point back to the document it came from, for checking or citing.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "search",
   "kicker": "Project 6 · Vector store",
   "title": "Search by meaning",
   "beats": [
    {
     "say": "Welcome to Project 6."
    },
    {
     "say": "Now you'll work with unstructured text, and the retrieval systems behind modern A I applications like R A G chatbots."
    },
    {
     "say": "Start by gathering ten to twenty text documents into a folder called documents."
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Step 3",
   "title": "Chunk a 500-word document",
   "values": [
    "0–49",
    "50–99",
    "100–149",
    "150–199",
    "200–249",
    "250–299",
    "300–349",
    "350–399",
    "400–449",
    "450–499"
   ],
   "beats": [
    {
     "say": "Picture one document of five hundred words, shown here in blocks of fifty.",
     "note": "chunk_size=200, overlap=50"
    },
    {
     "say": "The first chunk takes two hundred words, starting at word zero.",
     "hl": [
      0,
      1,
      2,
      3
     ],
     "ptr": {
      "i": 0
     },
     "note": "chunk 1: words 0–199"
    },
    {
     "say": "The next chunk starts one hundred and fifty words later: two hundred minus the overlap of fifty.",
     "hl": [
      3,
      4,
      5,
      6
     ],
     "ok": [
      0,
      1,
      2
     ],
     "ptr": {
      "i": 3
     },
     "note": "chunk 2: words 150–349"
    },
    {
     "say": "Words one fifty to one ninety nine are in both chunks. That overlap keeps an idea on the boundary from being cut in half.",
     "hl": 3,
     "ok": [
      0,
      1,
      2
     ],
     "ptr": {
      "i": 3
     },
     "note": "overlap: words 150–199"
    },
    {
     "say": "The third chunk starts at word three hundred, and reaches the end of the text, so the loop stops.",
     "hl": [
      6,
      7,
      8,
      9
     ],
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5
     ],
     "ptr": {
      "i": 6
     },
     "note": "300 + 200 ≥ 500 → break"
    },
    {
     "say": "Three chunks. The loading loop also records which file each chunk came from.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9
     ],
     "note": "3 chunks · chunk_sources = file names"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Steps 4 to 6",
   "title": "Embed, store, and ask",
   "nodes": [
    {
     "id": "doc",
     "label": "Chunks",
     "x": 12,
     "y": 25,
     "sub": "from documents/",
     "art": "file"
    },
    {
     "id": "mod",
     "label": "Embedding model",
     "x": 50,
     "y": 50,
     "sub": "all-MiniLM-L6-v2",
     "art": "neural"
    },
    {
     "id": "col",
     "label": "Chroma",
     "x": 88,
     "y": 25,
     "sub": "collection: documents",
     "art": "database"
    },
    {
     "id": "q",
     "label": "Your question",
     "x": 12,
     "y": 78,
     "sub": "same model",
     "art": "chat"
    }
   ],
   "edges": [
    {
     "from": "doc",
     "to": "mod"
    },
    {
     "from": "mod",
     "to": "col"
    },
    {
     "from": "q",
     "to": "mod"
    },
    {
     "from": "col",
     "to": "q"
    }
   ],
   "beats": [
    {
     "say": "Every chunk goes through a sentence transformers model.",
     "show": 2,
     "on": "mod",
     "send": {
      "from": "doc",
      "to": "mod",
      "label": "chunk text"
     }
    },
    {
     "say": "Out comes an embedding: a list of numbers that represents the chunk's meaning.",
     "show": 2,
     "on": "mod"
    },
    {
     "say": "Chroma stores each embedding with its text, an I D like chunk zero, and its source file.",
     "show": 3,
     "on": "col",
     "send": {
      "from": "mod",
      "to": "col",
      "label": "embedding"
     }
    },
    {
     "say": "To search, embed the question with the same model.",
     "show": 4,
     "on": "q",
     "send": {
      "from": "q",
      "to": "mod",
      "label": "reset password?"
     }
    },
    {
     "say": "Chroma finds the three stored embeddings closest to it.",
     "show": 4,
     "on": "col",
     "send": {
      "from": "mod",
      "to": "col",
      "label": "query vector"
     }
    },
    {
     "say": "Each result comes back with its source file and a distance.",
     "show": 4,
     "on": "q",
     "send": {
      "from": "col",
      "to": "q",
      "label": "top 3 + sources"
     }
    }
   ]
  },
  {
   "kind": "chart",
   "kicker": "Step 6",
   "title": "Smaller distance, closer meaning",
   "points": [
    [
     15,
     20
    ],
    [
     25,
     35
    ],
    [
     30,
     15
    ],
    [
     45,
     50
    ],
    [
     20,
     70
    ],
    [
     85,
     20
    ],
    [
     55,
     30
    ],
    [
     66,
     72
    ],
    [
     74,
     66
    ],
    [
     72,
     78
    ]
   ],
   "xlabel": "meaning (simplified)",
   "ylabel": "meaning (simplified)",
   "beats": [
    {
     "say": "Here's a sketch of the vector store, flattened to two dimensions. Each dot is one chunk."
    },
    {
     "say": "Chunks about similar things sit close together, like these three about passwords.",
     "groups": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      2,
      2
     ]
    },
    {
     "say": "The question, how do I reset my password, is embedded with the same model, and lands here.",
     "marks": [
      [
       71,
       72
      ]
     ],
     "groups": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      2,
      2
     ]
    },
    {
     "say": "The three nearest chunks are the results. Their distance to the question is small.",
     "marks": [
      [
       71,
       72
      ]
     ],
     "groups": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1
     ]
    },
    {
     "say": "Everything else is far away, so it isn't returned.",
     "marks": [
      [
       71,
       72
      ]
     ],
     "groups": [
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      1,
      1,
      1
     ]
    },
    {
     "say": "A different model would place the question in a different number space, so these distances would mean nothing.",
     "marks": [
      [
       71,
       72
      ],
      [
       20,
       85
      ]
     ],
     "groups": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
     ]
    }
   ]
  },
  {
   "kind": "list",
   "art": "doc",
   "kicker": "Steps 7 and 8",
   "title": "Judge it, write it down",
   "items": [
    [
     "Evaluate",
     "5 queries, judged by hand"
    ],
    [
     "Document",
     "Chunk size, overlap, model, results"
    ]
   ],
   "beats": [
    {
     "say": "Try five different queries, and judge by hand whether the top results are actually relevant.",
     "show": 1
    },
    {
     "say": "Then record your choices in a text cell: chunk size, overlap, the embedding model, and how retrieval went.",
     "show": 2
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why must the query be embedded with the same model as the chunks?",
   "options": [
    "Embeddings from different models live in different number spaces and can't be compared",
    "Chroma only accepts one model per notebook",
    "A different model would be too slow"
   ],
   "answer": 0,
   "good": "That's right. Embeddings from different models live in different number spaces, so they can't be compared meaningfully.",
   "bad": "Not quite. Embeddings from different models live in different number spaces, so they can't be compared meaningfully.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why must the query be embedded with the same model as the chunks?",
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
     "A working vector store",
     ""
    ],
    [
     "A retrieval evaluation",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 6.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a working vector store built from a real document set,",
     "show": 1
    },
    {
     "say": "with a retrieval evaluation.",
     "show": 2
    },
    {
     "say": "Next, in Module 7, data validation and monitoring.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 7 (Module 7): Build a Data Validation and Monitoring Check

**Time: about 2.5 hours**

**Goal:** Add quality control on top of your pipeline, so bad data gets caught automatically instead of silently poisoning downstream models.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `data_validation_project`.
```python
%pip install pandas sqlalchemy
```
Upload `raw_data.csv` and `cleaned_data.csv` from Project 2 and `new_data.csv` from Project 4 to the **Files** panel. Then paste and run your Project 4 cells that define `extract`, `transform`, and `load` (Steps 3–5).

**Step 2: Define validation rules from what you already know.**
Add a **text cell** headed `validation_rules` and write your notes in it.
Using your Project 3 schema and Project 2's cleaning checks, list rules: required fields, expected types, acceptable value ranges.

**Step 3: Implement schema validation.**
Add a **code cell**, paste in the code below, and run it with **Shift + Enter**.
```python
import pandas as pd

REQUIRED_COLUMNS = ["ticket_id", "text", "customer_email", "created_at", "category"]

def validate_schema(df, required_columns):
    missing = set(required_columns) - set(df.columns)
    assert not missing, f"Missing columns: {missing}"
```
This runs on the raw file, before any cleaning, so a file with the wrong shape is rejected right away.

**Step 4: Implement value range checks.**
```python
ALLOWED_CATEGORIES = {"billing", "bug", "unknown"}

def validate_ranges(df):
    problems = []
    bad_dates = df["created_at"].isnull().sum()
    if bad_dates:
        problems.append(f"{bad_dates} rows have a missing or invalid created_at")
    if (df["text"].str.len() == 0).any():
        problems.append("Some tickets have empty text")
    unexpected = set(df["category"]) - ALLOWED_CATEGORIES
    if unexpected:
        problems.append(f"Unexpected category values: {unexpected}")
    assert not problems, "; ".join(problems)
```
This runs on the cleaned data, after `transform`. It collects every problem first, so one run tells you everything that's wrong instead of stopping at the first issue.

**Step 5: Understand data drift.**
**data drift** is when the statistical properties of incoming data change over time (e.g., average text length doubles, or a new label category starts appearing) even though the schema still technically validates.

**Step 6: Implement a simple drift check.**
```python
def check_drift(df, baseline_mean, baseline_std, column, threshold=3):
    current_mean = df[column].mean()
    z_score = abs(current_mean - baseline_mean) / baseline_std
    if z_score > threshold:
        print(f"WARNING: Possible drift detected in {column} (z-score {z_score:.1f})")
    else:
        print(f"No drift detected in {column} (z-score {z_score:.1f})")

# Baseline: ticket text length in data you already trust
baseline = pd.read_csv("cleaned_data.csv")
baseline_lengths = baseline["text"].str.len()

# Today's batch
new_df = transform(extract("new_data.csv"))
new_df["text_length"] = new_df["text"].str.len()
check_drift(new_df, baseline_lengths.mean(), baseline_lengths.std(), "text_length")
```
This compares today's average against a saved baseline, a large deviation (measured in standard deviations) flags a possible shift. It's a simple rule of thumb, not a full statistical test, but it catches big changes cheaply.

**Step 7: Wire validation into your Project 4 pipeline.**
```python
from sqlalchemy import create_engine

def run_pipeline_with_validation(path, table_name, engine):
    df = extract(path)
    validate_schema(df, REQUIRED_COLUMNS)
    df = transform(df)
    validate_ranges(df)
    load(df, table_name, engine)
    print(f"Validated and loaded {len(df)} rows from {path}")

engine = create_engine("sqlite:///data_store.db")
run_pipeline_with_validation("new_data.csv", "tickets", engine)
```
Validation runs *before* `load`, so bad data never reaches the database.

**Step 8: Test it against intentionally broken data.**
First make a deliberately bad CSV with a missing column and an invalid category, and confirm the pipeline stops with a clear error:
```python
broken = pd.read_csv("new_data.csv").drop(columns=["created_at"])
broken.loc[0, "category"] = "spam"
broken.to_csv("broken_test_data.csv", index=False)

try:
    run_pipeline_with_validation("broken_test_data.csv", "tickets", engine)
except AssertionError as error:
    print("Pipeline stopped:", error)
```
You should see `Pipeline stopped: Missing columns: {'created_at'}`. Now try the original messy `raw_data.csv`:
```python
try:
    run_pipeline_with_validation("raw_data.csv", "tickets", engine)
except AssertionError as error:
    print("Pipeline stopped:", error)
```
It stops too, naming the invalid date and the unexpected `feature request` category from Project 2. Decide what the right fix is (update `ALLOWED_CATEGORIES`, or drop or relabel those rows in `transform`) and write your decision in the `validation_rules` cell.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
data_validation_project/
│
├── validation_rules.md
├── validate.py
├── broken_test_data.csv
```

### What You Learned
- ✅ Turning implicit assumptions into explicit validation rules
- ✅ Schema validation (required columns, types)
- ✅ Value range and category validation
- ✅ Understanding data drift vs. schema violations
- ✅ Implementing a simple statistical drift check
- ✅ Wiring validation into a real pipeline and testing it against bad data

### Portfolio Project
**Data Pipeline Validation & Monitoring**: Built and tested schema validation, value range checks, and a statistical drift detector, integrated directly into a working ETL pipeline.
**Skills:** Data Quality Engineering, Data Validation, Statistical Monitoring, Python, AI Data Engineering.

**Deliverable:** A validation module wired into your pipeline, tested against intentionally broken data.

### Quiz

1. Why validate the schema before transforming the data, and the value ranges after?
2. What is data drift, and how is it different from a schema violation?
3. How does the simple drift check decide whether to warn?
4. Why does validation run before the load step?

*Answers: 1) The schema check confirms the raw file has the columns the transform needs; the range checks test the cleaned values the database will actually receive. 2) Drift is a change in the data's statistics over time, such as average text length doubling, while the columns and types still pass; a schema violation is a missing column or wrong structure. 3) It measures how many baseline standard deviations today's average is from the baseline average, and warns when that z-score is above the threshold of 3. 4) So bad data is stopped before it ever reaches the database and the models trained from it.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "shield",
   "kicker": "Project 7 · Validate and monitor",
   "title": "Stop bad data at the door",
   "beats": [
    {
     "say": "Welcome to the last project."
    },
    {
     "say": "You'll add quality control on top of your pipeline, so bad data gets caught automatically instead of silently poisoning downstream models."
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Step 3",
   "title": "Schema check: are all the columns there?",
   "values": [
    "ticket_id",
    "text",
    "customer_email",
    "created_at",
    "category"
   ],
   "beats": [
    {
     "say": "Start by writing validation rules from your Project 3 schema and Project 2 cleaning checks."
    },
    {
     "say": "The schema check lists the five columns every raw file must have.",
     "hl": [
      0,
      1,
      2,
      3,
      4
     ],
     "note": "REQUIRED_COLUMNS"
    },
    {
     "say": "New data dot C S V has all five, so it passes.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "note": "new_data.csv → missing = set()  ✓"
    },
    {
     "say": "Now a deliberately broken file, made by dropping the created at column.",
     "ok": [
      0,
      1,
      2,
      4
     ],
     "gone": 3,
     "note": "broken_test_data.csv"
    },
    {
     "say": "The missing set isn't empty, so the assert stops it.",
     "ok": [
      0,
      1,
      2,
      4
     ],
     "gone": 3,
     "note": "Missing columns: {'created_at'}"
    },
    {
     "say": "It runs on the raw file, before any cleaning, so a file with the wrong shape is rejected right away.",
     "gone": 3,
     "note": "before transform"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 4",
   "title": "Value checks on raw_data.csv, after transform",
   "columns": [
    "ticket_id",
    "created_at",
    "category"
   ],
   "rows": [
    [
     "T001",
     "2026-09-02",
     "bug"
    ],
    [
     "T006",
     "2026-09-07",
     "unknown"
    ],
    [
     "T009",
     "NaT",
     "billing"
    ],
    [
     "T013",
     "2026-09-14",
     "feature request"
    ],
    [
     "T023",
     "2026-09-24",
     "unknown"
    ]
   ],
   "beats": [
    {
     "say": "The value checks run on the cleaned data. Here are five of the fifty seven rows from Project 2's raw file."
    },
    {
     "say": "Check one: missing or invalid dates. Not a date became N a T, so one row is counted.",
     "sql": "bad_dates = df[\"created_at\"].isnull().sum()   # 1",
     "hl": 2,
     "dim": true,
     "col": 1
    },
    {
     "say": "Check two: empty text. Every ticket has text, so nothing is added.",
     "sql": "(df[\"text\"].str.len() == 0).any()   # False"
    },
    {
     "say": "Check three: categories outside billing, bug and unknown. Feature request is unexpected.",
     "sql": "set(df[\"category\"]) - ALLOWED_CATEGORIES\n# {'feature request'}",
     "hl": 3,
     "dim": true,
     "col": 2
    },
    {
     "say": "Unknown is on the allowed list, so the rows Project 2 filled in pass.",
     "hl": [
      1,
      4
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "The function collects every problem first, then one assert reports them all together.",
     "sql": "1 rows have a missing or invalid created_at;\nUnexpected category values: {'feature request'}",
     "hl": [
      2,
      3
     ],
     "dim": true
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Steps 5 and 6",
   "title": "A simple drift check",
   "file": "data_validation_project",
   "code": "def check_drift(df, baseline_mean, baseline_std,\n                column, threshold=3):\n    current_mean = df[column].mean()\n    z_score = (abs(current_mean - baseline_mean)\n               / baseline_std)\n    if z_score > threshold:\n        print(f\"WARNING: Possible drift detected \"\n            f\"in {column} (z-score {z_score:.1f})\")\n    else:\n        print(f\"No drift detected in {column} \"\n            f\"(z-score {z_score:.1f})\")\n\ncheck_drift(new_df, baseline_lengths.mean(),\n            baseline_lengths.std(), \"text_length\")",
   "beats": [
    {
     "say": "Data drift is when the statistics of incoming data change over time, even though the schema still validates."
    },
    {
     "say": "The baseline is ticket text length in the cleaned data you trust: thirty eight point seven characters on average, with a standard deviation of five point six.",
     "line": [
      13,
      14
     ],
     "vars": {
      "baseline_mean": 38.7,
      "baseline_std": 5.6
     }
    },
    {
     "say": "Today's batch has three tickets, thirty three, forty one and forty four characters long. Their mean is thirty nine point three.",
     "line": 3,
     "vars": {
      "baseline_mean": 38.7,
      "baseline_std": 5.6,
      "current_mean": 39.3
     }
    },
    {
     "say": "The z score says how many standard deviations apart the two averages are: about zero point one.",
     "line": [
      4,
      5
     ],
     "vars": {
      "baseline_mean": 38.7,
      "baseline_std": 5.6,
      "current_mean": 39.3,
      "z_score": 0.1
     }
    },
    {
     "say": "That's well under the threshold of three, so no drift.",
     "line": [
      9,
      10,
      11
     ],
     "out": "No drift detected in text_length (z-score 0.1)"
    },
    {
     "say": "But if the average text length doubled, to about seventy seven, the z score would be about six point nine, and it would warn.",
     "line": [
      6,
      7,
      8
     ],
     "vars": {
      "baseline_mean": 38.7,
      "baseline_std": 5.6,
      "current_mean": 77.4,
      "z_score": 6.9
     },
     "out": "WARNING: Possible drift detected in text_length (z-score 6.9)"
    },
    {
     "say": "It's a rule of thumb, not a full statistical test, but it catches big changes cheaply.",
     "line": 6
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Steps 7 and 8",
   "title": "Validate before you load",
   "nodes": [
    {
     "id": "file",
     "label": "Raw file",
     "x": 12,
     "y": 25,
     "sub": "extract",
     "art": "file"
    },
    {
     "id": "sch",
     "label": "Schema check",
     "x": 50,
     "y": 25,
     "sub": "required columns",
     "art": "checklist"
    },
    {
     "id": "tr",
     "label": "Transform",
     "x": 88,
     "y": 25,
     "sub": "Project 4 rules",
     "art": "gear"
    },
    {
     "id": "val",
     "label": "Value checks",
     "x": 88,
     "y": 75,
     "sub": "dates, text, categories",
     "art": "shield"
    },
    {
     "id": "load",
     "label": "Load",
     "x": 50,
     "y": 75,
     "sub": "append",
     "art": "pipeline"
    },
    {
     "id": "db",
     "label": "tickets table",
     "x": 12,
     "y": 75,
     "sub": "data_store.db",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "file",
     "to": "sch"
    },
    {
     "from": "sch",
     "to": "tr"
    },
    {
     "from": "tr",
     "to": "val"
    },
    {
     "from": "val",
     "to": "load"
    },
    {
     "from": "load",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "Here's your Project 4 pipeline, with both checks wired in before load.",
     "show": 6
    },
    {
     "say": "New data dot C S V goes in. All five columns are there.",
     "on": "sch",
     "send": {
      "from": "file",
      "to": "sch",
      "label": "new_data.csv"
     }
    },
    {
     "say": "So it moves on to transform.",
     "on": "tr",
     "send": {
      "from": "sch",
      "to": "tr",
      "label": "5 columns ✓"
     }
    },
    {
     "say": "The cleaned rows pass every value check.",
     "on": "val",
     "send": {
      "from": "tr",
      "to": "val",
      "label": "3 clean rows"
     }
    },
    {
     "say": "Only then are they loaded. Validated and loaded three rows.",
     "on": "db",
     "send": {
      "from": "load",
      "to": "db",
      "label": "3 rows"
     }
    },
    {
     "say": "The broken test file stops at the first gate: missing columns, created at.",
     "on": "sch",
     "send": {
      "from": "file",
      "to": "sch",
      "label": "broken file"
     }
    },
    {
     "say": "Raw data dot C S V passes the schema check, but stops at the value checks, naming the bad date and feature request.",
     "on": "val",
     "send": {
      "from": "tr",
      "to": "val",
      "label": "57 rows"
     }
    },
    {
     "say": "Neither bad file reaches the database. Decide the fix, and write it in your validation rules.",
     "on": "db"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why does validation run before the load step?",
   "options": [
    "Because loading is the slowest step",
    "So bad data is stopped before it reaches the database and the models trained from it",
    "Because S Q L can't store invalid dates"
   ],
   "answer": 1,
   "good": "That's right. Validating before load stops bad data before it ever reaches the database and the models trained from it.",
   "bad": "Not quite. Validating before load stops bad data before it ever reaches the database and the models trained from it.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why does validation run before the load step?",
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
     "Validation wired into the pipeline",
     ""
    ],
    [
     "Tested against broken data",
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
     "say": "you have a validation module wired into your pipeline,",
     "show": 1
    },
    {
     "say": "tested against intentionally broken data.",
     "show": 2
    },
    {
     "say": "You've finished A I Data Engineer. Well done.",
     "show": 2
    }
   ]
  }
 ]
}
```
