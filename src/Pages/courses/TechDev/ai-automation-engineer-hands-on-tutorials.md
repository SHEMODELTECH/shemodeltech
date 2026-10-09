<!-- order: 18 -->
# AI Automation Engineer: Hands-On Project Tutorials

This course is a series of hands-on projects. You learn each idea at the moment you need it, while building the thing.

**By the end of this course, you'll be able to:**
- Map a real workflow and judge which parts are worth automating
- Build a Python script that runs on a schedule with cron or Task Scheduler and logs its own errors
- Chain steps into a multi-step workflow with per-step error handling
- Add a narrow AI decision step with a safe fallback when the API call fails
- Build a tool-calling agent with an allow-list of tools and human approval for risky actions
- Add logging, health checks, retries, and failure alerts, and test them by breaking things on purpose

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

**Your Claude API key.** Projects that call Claude need an API key from [console.anthropic.com](https://console.anthropic.com). API use is paid and billed by how much text you send and receive. The requests in this course are small, but set a low monthly spending limit in the console before you begin. Keep the key out of your code: in Colab, click the **key icon** in the left sidebar, add a secret named `ANTHROPIC_API_KEY`, and turn on notebook access. Then run this cell at the top of every notebook that calls Claude:

```python
import os
from google.colab import userdata
os.environ["ANTHROPIC_API_KEY"] = userdata.get("ANTHROPIC_API_KEY")
```

**A few projects run on your computer.** Projects that build a web app, a job queue, or a scheduled task keep running in the background, and a notebook can't host that. Those projects say so at the top and use a code editor and your terminal instead: VS Code, plus Terminal on a Mac or PowerShell on Windows.

---

## Project 1 (Module 1): Map an Automation Opportunity in a Workflow

**Time: about 1.5 hours**

**Goal:** Identify what's actually worth automating, before writing a single line of automation code.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `automation_opportunity_project`.

**Step 2: Pick a real, repetitive workflow.**
Example: "Every morning, someone manually checks a shared inbox, copies new leads into a spreadsheet, and emails a summary to the sales team."

**Step 3: Map the workflow step by step.**
Add a **text cell** headed `workflow_map` and write your notes in it.
Write out every single step currently performed, including the small ones people usually skip mentioning (e.g., "checks for duplicates by eye").

**Step 4: Score the workflow on automation fit.**
Good automation candidates are **repetitive** (done often), **rule-based or pattern-based** (not requiring deep human judgment every time), and **time-costly** (worth the effort to automate).

**Step 5: Identify the manual triggers and outputs.**
Note: what starts this workflow (a new email, a scheduled time, a form submission), and what does it produce at the end?

**Step 6: Estimate time saved.**
Estimate how long the manual process takes and how often it happens (e.g., "15 minutes, 5 days a week = ~65 hours/year").

**Step 7: Note edge cases.**
List situations where the manual process currently requires judgment or handles something unusual (e.g., "if the email looks spammy, they don't add it").

**Step 8: Write the opportunity summary.**
Add a **text cell** headed `opportunity_summary` and write your notes in it.
Structure: Workflow description → Automation fit score → Trigger/output → Time savings estimate → Known edge cases.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
automation_opportunity_project/
│
├── workflow_map.md
├── opportunity_summary.md
```

### What You Learned
- ✅ Evaluating workflows for automation fit
- ✅ Mapping a workflow step by step, including small manual steps
- ✅ Identifying triggers and outputs
- ✅ Estimating time saved by automating
- ✅ Identifying edge cases that require special handling
- ✅ Writing an automation opportunity summary

### Portfolio Project
**Automation Opportunity Assessment**: Mapped a real repetitive workflow step by step, scored it for automation fit, and produced a time-savings estimate with documented edge cases.
**Skills:** Process Analysis, Business Case Development, Technical Writing, AI Automation Engineering.

**Deliverable:** A workflow map and opportunity summary identifying a concrete automation target with estimated time savings.

### Quiz

1. What three qualities make a workflow a good candidate for automation?
2. Why write down even the small steps people usually skip mentioning?
3. What is a workflow's trigger? Give an example.
4. Why list edge cases before you build anything?

*Answers: 1) It is repetitive, rule-based or pattern-based, and time-costly. 2) Small hidden steps, like checking for duplicates by eye, are real work the automation must also do, or it will produce wrong results. 3) The event that starts the workflow, such as a new email arriving, a scheduled time, or a form submission. 4) Edge cases are where people use judgment; knowing them up front tells you where the automation needs special handling or a human check.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "search",
   "kicker": "Project 1 · Find the opportunity",
   "title": "Map before you automate",
   "beats": [
    {
     "say": "Welcome to A I Automation Engineer: Hands-On Project Tutorials."
    },
    {
     "say": "In this first project, you'll work out what's actually worth automating, before writing a single line of automation code."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Steps 2 and 3",
   "title": "Map every step, even the small ones",
   "nodes": [
    {
     "id": "trig",
     "label": "Every morning",
     "x": 12,
     "y": 28,
     "sub": "the trigger",
     "art": "calendar"
    },
    {
     "id": "inbox",
     "label": "Shared inbox",
     "x": 32,
     "y": 72,
     "sub": "check for new leads",
     "art": "mail"
    },
    {
     "id": "dup",
     "label": "Duplicate check",
     "x": 52,
     "y": 28,
     "sub": "done by eye",
     "art": "search"
    },
    {
     "id": "sheet",
     "label": "Spreadsheet",
     "x": 72,
     "y": 72,
     "sub": "copy each new lead",
     "art": "table"
    },
    {
     "id": "sales",
     "label": "Sales team",
     "x": 90,
     "y": 28,
     "sub": "gets a summary",
     "art": "people"
    }
   ],
   "edges": [
    {
     "from": "trig",
     "to": "inbox"
    },
    {
     "from": "inbox",
     "to": "dup"
    },
    {
     "from": "dup",
     "to": "sheet"
    },
    {
     "from": "sheet",
     "to": "sales"
    }
   ],
   "beats": [
    {
     "say": "Here's the example workflow, one step at a time. It starts every morning.",
     "show": 1,
     "on": "trig"
    },
    {
     "say": "Someone checks a shared inbox for new leads.",
     "show": 2,
     "on": "inbox",
     "send": {
      "from": "trig",
      "to": "inbox",
      "label": "start"
     }
    },
    {
     "say": "Here's the small step people forget to mention: they check for duplicates, by eye.",
     "show": 3,
     "on": "dup",
     "send": {
      "from": "inbox",
      "to": "dup",
      "label": "new leads"
     }
    },
    {
     "say": "Then they copy each new lead into a spreadsheet.",
     "show": 4,
     "on": "sheet",
     "send": {
      "from": "dup",
      "to": "sheet",
      "label": "new leads only"
     }
    },
    {
     "say": "And they email a summary to the sales team.",
     "show": 5,
     "on": "sales",
     "send": {
      "from": "sheet",
      "to": "sales",
      "label": "summary email"
     }
    },
    {
     "say": "Write all of it in a text cell called workflow map. A hidden step like the duplicate check is real work your automation must do too.",
     "show": 5,
     "on": "dup"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 4",
   "title": "Score it on automation fit",
   "columns": [
    "Quality",
    "Ask yourself",
    "Leads workflow"
   ],
   "rows": [
    [
     "Repetitive",
     "Is it done often?",
     "Every morning"
    ],
    [
     "Rule- or pattern-based",
     "No deep judgment?",
     "Mostly copying fields"
    ],
    [
     "Time-costly",
     "Worth the effort?",
     "15 minutes a day"
    ]
   ],
   "beats": [
    {
     "say": "Good automation candidates share three qualities. Let's score the leads workflow.",
     "col": 0
    },
    {
     "say": "Repetitive: is it done often? Yes, every single morning.",
     "hl": 0
    },
    {
     "say": "Rule-based or pattern-based: does it need deep judgment every time? Mostly not. It's copying fields.",
     "hl": 1
    },
    {
     "say": "Time-costly: is it worth the effort? Fifteen minutes a day adds up, as you'll see next.",
     "hl": 2
    },
    {
     "say": "Three yeses make a strong candidate.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 2
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Steps 5 and 6",
   "title": "Trigger, output, and time saved",
   "columns": [
    "Quantity",
    "Value"
   ],
   "rows": [
    [
     "Minutes per run",
     "15"
    ],
    [
     "Runs per week",
     "5"
    ],
    [
     "Minutes per week",
     "75"
    ],
    [
     "Weeks per year",
     "52"
    ],
    [
     "Minutes per year",
     "3,900"
    ],
    [
     "Hours per year",
     "about 65"
    ]
   ],
   "beats": [
    {
     "say": "First note the trigger, a scheduled time every morning, and the output, a summary email to sales.",
     "sql": "trigger: every morning  →  output: summary email"
    },
    {
     "say": "Now the time. The manual run takes fifteen minutes.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "It happens five days a week.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "That's seventy five minutes a week.",
     "hl": 2,
     "col": 1
    },
    {
     "say": "Over fifty two weeks, that's three thousand nine hundred minutes.",
     "hl": [
      3,
      4
     ],
     "col": 1
    },
    {
     "say": "Divide by sixty: about sixty five hours a year. That number makes the case for automating.",
     "sql": "15 min × 5 days × 52 weeks = 3,900 min ≈ 65 hours/year",
     "hl": 5,
     "dim": true,
     "col": 1
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Steps 7 and 8",
   "title": "Edge cases, then the summary",
   "values": [
    "Description",
    "Fit score",
    "Trigger → output",
    "Time saved",
    "Edge cases"
   ],
   "beats": [
    {
     "say": "Step seven: list the edge cases, where someone uses judgment. For example, if the email looks spammy, they don't add it.",
     "note": "edge case: spammy email → not added"
    },
    {
     "say": "Then write the opportunity summary, in five parts. First, the workflow description.",
     "hl": 0,
     "ptr": {
      "now": 0
     },
     "note": "Inbox → spreadsheet → summary to sales"
    },
    {
     "say": "Second, its automation fit score.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "now": 1
     },
     "note": "Repetitive, rule-based, time-costly"
    },
    {
     "say": "Third, the trigger and the output.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "now": 2
     },
     "note": "Every morning → summary email"
    },
    {
     "say": "Fourth, the time savings estimate.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3,
     "ptr": {
      "now": 3
     },
     "note": "About 65 hours a year"
    },
    {
     "say": "And fifth, the known edge cases, so the build knows where it needs special handling or a human check.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "hl": 4,
     "ptr": {
      "now": 4
     },
     "note": "Spammy emails, duplicates"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why list edge cases before you build anything?",
   "options": [
    "Edge cases are where people use judgment, so they show where the automation needs special handling or a human check",
    "So you can delete them from the workflow",
    "Because cron needs them to schedule the script"
   ],
   "answer": 0,
   "good": "That's right. Edge cases are where people use judgment. Knowing them up front tells you where the automation needs special handling or a human check.",
   "bad": "Not quite. Edge cases are where people use judgment. Knowing them up front tells you where the automation needs special handling or a human check.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why list edge cases before you build anything?",
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
     "Workflow mapped and scored",
     ""
    ],
    [
     "Opportunity summary written",
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
     "say": "you've mapped a real workflow step by step and scored it for automation fit,",
     "show": 1
    },
    {
     "say": "and written an opportunity summary with a time-savings estimate and known edge cases.",
     "show": 2
    },
    {
     "say": "Next, in Module 2, a script that runs on a schedule.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 2 (Module 2): Build a Scheduled Automation Script

**Time: about 2.5 hours**

**Goal:** Build the smallest possible working automation, a script that runs on its own, on a schedule, without you triggering it manually.

> **This project runs on your computer, not in a notebook.** It builds something that keeps running in the background (a web app, a job queue, or a scheduled task), which a notebook can't host. Make a project folder on your computer, open it in VS Code, and save each code block as the file named in its step. Run the commands in your terminal. Everything you built in the notebooks carries over.

On Windows, type `py` wherever this project says `python3`.

**Step 1: Create the project folder.**
These commands work in Terminal (Mac/Linux) and PowerShell (Windows).
```bash
mkdir scheduled_automation_project
cd scheduled_automation_project
```
Open the folder in VS Code (**File → Open Folder**).

**Step 2: Write the smallest useful script.**
In VS Code, create a file named `check_task.py` in the project folder and paste in:
```python
import datetime
from pathlib import Path

# Full path to log.txt, next to this script, no matter which folder the script is started from
LOG_FILE = Path(__file__).resolve().parent / "log.txt"

def log(message):
    with open(LOG_FILE, "a") as f:
        f.write(f"{datetime.datetime.now()} {message}\n")

def main():
    log("Ran")

if __name__ == "__main__":
    main()
```
Schedulers start your script from a different folder (cron uses your home folder), so a plain `"log.txt"` would land in the wrong place. Building the path from the script's own location (`__file__`) fixes that.

**Step 3: Test it manually first.**
```bash
python3 check_task.py
cat log.txt
```
You should see one line like `2026-10-07 09:15:02.123456 Ran`.

**Step 4: Add real logic based on your Project 1 workflow.**
Replace `main()` with something that actually checks or does something relevant. Here's an example that checks an `inbox` folder for new files:
```python
INBOX = Path(__file__).resolve().parent / "inbox"

def main():
    INBOX.mkdir(exist_ok=True)
    files = sorted(p.name for p in INBOX.iterdir() if p.is_file())
    log(f"Found {len(files)} file(s) in inbox: {files}")
```
Paste this in place of the old `main()` function (keep the imports, `LOG_FILE`, `log`, and the `if __name__ == "__main__":` lines). Drop a test file into the new `inbox` folder and run the script again to check it.

**Step 5: Add error handling.**
Wrap the logic so a failure is logged instead of lost. Here is the complete `check_task.py` after this step:
```python
import datetime
from pathlib import Path

LOG_FILE = Path(__file__).resolve().parent / "log.txt"
INBOX = Path(__file__).resolve().parent / "inbox"

def log(message):
    with open(LOG_FILE, "a") as f:
        f.write(f"{datetime.datetime.now()} {message}\n")

def main():
    INBOX.mkdir(exist_ok=True)
    files = sorted(p.name for p in INBOX.iterdir() if p.is_file())
    log(f"Found {len(files)} file(s) in inbox: {files}")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log(f"ERROR: {e}")
```
Wrapping logic in a **try/except** block means the script logs a failure instead of crashing silently. Nobody is watching a scheduled script, so the log is the only way you'll find out something went wrong.

**Step 6: Schedule the script.**

*On Mac, Linux, or WSL (cron):*
First get the two full paths you need:
```bash
which python3
pwd
```
Then open your schedule (cron table). `EDITOR=nano` opens it in the simple nano editor:
```bash
EDITOR=nano crontab -e
```
Add one line, using your two paths from above (this example assumes `which python3` printed `/usr/bin/python3` and `pwd` printed `/Users/you/scheduled_automation_project`):
```bash
0 8 * * * /usr/bin/python3 /Users/you/scheduled_automation_project/check_task.py
```
Save with **Ctrl + O**, **Enter**, then exit with **Ctrl + X**. This **cron** syntax runs the script every day at 8:00 AM. The five fields are minute, hour, day of month, month, and day of week. On a Mac, if the job never runs, give `cron` Full Disk Access in **System Settings → Privacy & Security**, or keep the project outside Desktop and Documents.

*On Windows (Task Scheduler):* cron and nano don't exist on Windows.
1. Find your Python's full path: run `py -c "import sys; print(sys.executable)"` in PowerShell and copy the result.
2. Open **Task Scheduler** from the Start menu and choose **Create Basic Task**.
3. Name it `check_task`, choose **Daily**, and set the time to 8:00 AM.
4. Choose **Start a program**. In **Program/script**, paste the Python path. In **Add arguments**, put the full path to `check_task.py` in quotes, e.g. `"C:\Users\you\scheduled_automation_project\check_task.py"`.
5. Click **Finish**.

**Step 7: Verify it ran without you.**
Check `log.txt` the next day to confirm it executed on schedule. To test faster with cron, temporarily use `*/5 * * * *` (every 5 minutes), wait, check the log, then change it back. In Task Scheduler, right-click the task and choose **Run**, then check the log.

**Step 8: Document how to modify the schedule.**
In VS Code, create `README.md` in the project folder. Note the schedule you used (the cron line or the Task Scheduler settings), what each part means, and how someone else could change the timing.

### Final Project Structure
```text
scheduled_automation_project/
│
├── check_task.py
├── inbox/
├── log.txt
├── README.md
```

### What You Learned
- ✅ Writing a minimal, testable automation script
- ✅ Testing manually before scheduling
- ✅ Adding error handling that logs failures
- ✅ Scheduling a script with cron or Task Scheduler
- ✅ Verifying scheduled execution without manual triggering
- ✅ Documenting an automation for future maintainers

### Portfolio Project
**Scheduled Automation Script**: Built and scheduled a Python automation script with error handling and logging, verified to run reliably without manual intervention.
**Skills:** Python, Cron Scheduling, Error Handling, Automation Engineering.

**Deliverable:** A scheduled script, verified to run automatically, with logging and error handling.

### Quiz

1. Why does the script build the log file's path from `__file__` instead of just using `"log.txt"`?
2. Why test the script by hand before scheduling it?
3. What does the cron line `0 8 * * *` mean?
4. Why is the try/except block especially important in a scheduled script?
5. What do Windows users use instead of cron?

*Answers: 1) Schedulers start the script from another folder, such as your home folder, so a plain file name would put the log in the wrong place. 2) If it fails by hand, it will fail on schedule too, and it is much easier to fix while you are watching. 3) Run at minute 0 of hour 8, every day of every month: daily at 8:00 AM. 4) Nobody is watching when it runs, so logging the error is the only way you will learn something broke. 5) Task Scheduler.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "gear",
   "kicker": "Project 2 · Scheduled automation",
   "title": "A script that runs without you",
   "beats": [
    {
     "say": "Welcome to Project 2."
    },
    {
     "say": "You'll build the smallest possible working automation: a script that runs on its own, on a schedule."
    },
    {
     "say": "This one runs on your computer, in VS Code and your terminal, not in a notebook."
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Steps 2 and 3",
   "title": "The smallest useful script",
   "file": "check_task.py",
   "code": "import datetime\nfrom pathlib import Path\nLOG_FILE = (Path(__file__).resolve().parent\n            / \"log.txt\")\n\ndef log(message):\n    with open(LOG_FILE, \"a\") as f:\n        f.write(f\"{datetime.datetime.now()} \"\n                f\"{message}\\n\")\n\ndef main():\n    log(\"Ran\")\nif __name__ == \"__main__\":\n    main()",
   "beats": [
    {
     "say": "Here's check underscore task dot py. Say cron starts it, from your home folder.",
     "vars": {
      "working folder": "\"/Users/you\""
     }
    },
    {
     "say": "Double underscore file is the script's own path. Its parent folder plus log dot txt gives the full path.",
     "line": [
      3,
      4
     ],
     "vars": {
      "LOG_FILE": "\"/Users/you/scheduled_automation_project/log.txt\""
     }
    },
    {
     "say": "A plain log dot txt would have landed in your home folder instead, the wrong place.",
     "line": [
      3,
      4
     ],
     "vars": {
      "plain \"log.txt\"": "\"/Users/you/log.txt\""
     }
    },
    {
     "say": "The script runs main, which calls log with the word Ran.",
     "line": [
      13,
      14,
      11,
      12
     ],
     "vars": {
      "message": "\"Ran\""
     }
    },
    {
     "say": "Log opens the file in append mode, and writes the date and time, then the message.",
     "line": [
      6,
      7,
      8,
      9
     ],
     "out": "2026-10-07 09:15:02.123456 Ran"
    },
    {
     "say": "Test it by hand first, with python3 check underscore task dot py. If it fails now, it will fail on schedule too.",
     "line": [
      13,
      14
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Steps 4 and 5",
   "title": "Real work, and a failure that gets logged",
   "file": "check_task.py",
   "code": "def main():\n    INBOX.mkdir(exist_ok=True)\n    files = sorted(p.name for p in INBOX.iterdir()\n                   if p.is_file())\n    log(f\"Found {len(files)} file(s) in inbox: \"\n        f\"{files}\")\n\nif __name__ == \"__main__\":\n    try:\n        main()\n    except Exception as e:\n        log(f\"ERROR: {e}\")",
   "beats": [
    {
     "say": "Now main does real work: it looks in an inbox folder. Say you dropped in one test file.",
     "line": 1,
     "vars": {
      "inbox": "[test.txt]"
     }
    },
    {
     "say": "Make the folder if it's missing, then list the names of the files in it, sorted.",
     "line": [
      2,
      3,
      4
     ],
     "vars": {
      "files": "['test.txt']"
     }
    },
    {
     "say": "Log how many there are, and their names.",
     "line": [
      5,
      6
     ],
     "out": "2026-10-08 08:00:01.204518 Found 1 file(s) in inbox: ['test.txt']"
    },
    {
     "say": "Now say a run fails. For example, the inbox can't be read.",
     "line": [
      9,
      10
     ],
     "vars": null
    },
    {
     "say": "Main raises an error, but the except catches it, and writes it to the log instead of crashing silently.",
     "line": [
      11,
      12
     ],
     "vars": {
      "e": "PermissionError(13, 'Permission denied')"
     },
     "out": "2026-10-09 08:00:01.087214 ERROR: [Errno 13] Permission denied: '.../inbox'"
    },
    {
     "say": "Nobody is watching a scheduled script, so the log is the only way you'll find out something went wrong.",
     "line": [
      9,
      12
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 6",
   "title": "Read the cron line field by field",
   "columns": [
    "Field",
    "Daily run",
    "Quick test"
   ],
   "rows": [
    [
     "minute",
     "0",
     "*/5"
    ],
    [
     "hour",
     "8",
     "*"
    ],
    [
     "day of month",
     "*",
     "*"
    ],
    [
     "month",
     "*",
     "*"
    ],
    [
     "day of week",
     "*",
     "*"
    ]
   ],
   "beats": [
    {
     "say": "On Mac, Linux or W S L, you add one line to your cron table, with the full paths to Python and your script.",
     "sql": "0 8 * * * /usr/bin/python3 /Users/you/scheduled_automation_project/check_task.py",
     "col": 1
    },
    {
     "say": "Five fields come first. Minute: zero.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "Hour: eight. So, eight A M.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "A star means every. Every day of the month, every month, every day of the week.",
     "hl": [
      2,
      3,
      4
     ],
     "col": 1
    },
    {
     "say": "Put together: run every day at eight A M.",
     "hl": [
      0,
      1,
      2,
      3,
      4
     ],
     "col": 1
    },
    {
     "say": "To test faster, use star slash five in the minute field, and stars everywhere else: every five minutes. Then change it back.",
     "sql": "*/5 * * * *  (every 5 minutes, for testing)",
     "hl": 0,
     "col": 2
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Steps 6 to 8",
   "title": "It runs without you",
   "nodes": [
    {
     "id": "sched",
     "label": "Scheduler",
     "x": 14,
     "y": 30,
     "sub": "cron or Task Scheduler",
     "art": "calendar"
    },
    {
     "id": "script",
     "label": "check_task.py",
     "x": 50,
     "y": 30,
     "sub": "full path to Python",
     "art": "code"
    },
    {
     "id": "log",
     "label": "log.txt",
     "x": 86,
     "y": 30,
     "sub": "one line per run",
     "art": "file"
    },
    {
     "id": "you",
     "label": "You",
     "x": 86,
     "y": 80,
     "sub": "the next day",
     "art": "persona"
    }
   ],
   "edges": [
    {
     "from": "sched",
     "to": "script"
    },
    {
     "from": "script",
     "to": "log"
    },
    {
     "from": "log",
     "to": "you"
    }
   ],
   "beats": [
    {
     "say": "At eight A M, the scheduler starts your script. On Windows, Task Scheduler does this job: a basic task, daily at eight A M.",
     "show": 2,
     "on": "sched",
     "send": {
      "from": "sched",
      "to": "script",
      "label": "8:00 AM"
     }
    },
    {
     "say": "The script appends its line to log dot txt.",
     "show": 3,
     "on": "script",
     "send": {
      "from": "script",
      "to": "log",
      "label": "Found 1 file(s)"
     }
    },
    {
     "say": "Next day, you open the log to confirm it ran without you. In Task Scheduler you can also right-click the task and choose Run.",
     "show": 4,
     "on": "you",
     "send": {
      "from": "log",
      "to": "you",
      "label": "new line, 8:00"
     }
    },
    {
     "say": "Finally, write a README that records the schedule, what each part means, and how someone else could change the timing.",
     "show": 4,
     "on": "sched"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why build the log file's path from double underscore file, instead of just using log dot txt?",
   "options": [
    "It makes the file smaller",
    "Schedulers start the script from another folder, so a plain file name would put the log in the wrong place",
    "Cron can't write text files"
   ],
   "answer": 1,
   "good": "That's right. Schedulers start the script from another folder, such as your home folder, so a plain file name would put the log in the wrong place.",
   "bad": "Not quite. Schedulers start the script from another folder, such as your home folder, so a plain file name would put the log in the wrong place.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why build the log file's path from double underscore file, instead of just using log dot txt?",
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
     "Scheduled and verified",
     ""
    ],
    [
     "Logging and error handling in place",
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
     "say": "you have a scheduled script, verified to run automatically,",
     "show": 1
    },
    {
     "say": "with logging and error handling.",
     "show": 2
    },
    {
     "say": "Next, in Module 3, a multi-step workflow.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 3 (Module 3): Build a Multi-Step Automated Workflow

**Time: about 3 hours**

**Goal:** Chain multiple steps and integrations together, moving from a single script to a real workflow.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `multistep_workflow_project`.

**Step 2: Break your Project 1 workflow into discrete steps.**
Add a **text cell** headed `workflow_steps` and write your notes in it.
List each step as its own numbered item (e.g., "1. Check inbox for new emails, 2. Extract lead info, 3. Add to spreadsheet, 4. Send summary email").

**Step 3: Understand what a webhook is.**
A **webhook** is a way for one system to notify another automatically when something happens, by sending an HTTP request to a specified URL, instead of the receiving system having to constantly check. This project checks a source on demand instead; in a live system, a webhook could be what starts `run_workflow()`.

**Step 4: Write each step as a function.**
This example automates the "new leads" workflow from Project 1, using a list of sample messages in place of a real inbox. Add a **code cell**, paste in the code below, and run it with **Shift + Enter**.
```python
import csv
from pathlib import Path

LEADS_FILE = Path("leads.csv")

# Sample input standing in for a real inbox.
# Template: later, replace this list with data from your own Project 1 source.
source = [
    {"id": 1, "sender": "ana@example.com", "subject": "Pricing", "message": "Can you send pricing for 10 seats?"},
    {"id": 2, "sender": "raj@example.com", "subject": "Demo", "message": "I'd like a demo next week."},
    {"id": 3, "sender": "li@example.com", "subject": "Site down!", "message": "Our dashboard has been down for an hour. Please help now."},
    {"id": 4, "sender": "sam@example.com", "subject": "Thanks", "message": "Thanks for the quick reply yesterday."},
    {"id": 5, "sender": "", "subject": "(no subject)", "message": "WIN A FREE PRIZE!!!"},  # edge case: no sender
]

def check_for_new_items(source):
    """Step 1: return items not already saved in leads.csv."""
    saved_ids = set()
    if LEADS_FILE.exists():
        with open(LEADS_FILE, newline="") as f:
            saved_ids = {int(row["id"]) for row in csv.DictReader(f)}
    new_items = [item for item in source if item["id"] not in saved_ids]
    return new_items

def extract_data(item):
    """Step 2: pull out the fields we need, and reject bad items."""
    if not item.get("sender"):
        raise ValueError(f"item {item['id']} has no sender")
    extracted = {
        "id": item["id"],
        "sender": item["sender"].strip().lower(),
        "subject": item["subject"].strip(),
        "message": item["message"].strip(),
    }
    return extracted

def save_to_destination(data):
    """Step 3: append one row to leads.csv (our stand-in for a spreadsheet)."""
    is_new_file = not LEADS_FILE.exists()
    with open(LEADS_FILE, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "sender", "subject", "message"])
        if is_new_file:
            writer.writeheader()
        writer.writerow(data)

def send_notification(summary):
    """Step 4: tell someone. Template: replace print with an email or chat message later."""
    print(f"NOTIFY: {summary}")
```

**Step 5: Chain the steps together.**
```python
def run_workflow():
    items = check_for_new_items(source)
    for item in items:
        data = extract_data(item)
        save_to_destination(data)
    send_notification(f"Processed {len(items)} items")
```
This first version has no error handling: one bad item stops the whole run. Don't run it yet; the next step fixes that.

**Step 6: Add error handling per step.**
Replace the `run_workflow()` cell with this version. Each step gets its own try/except, so one bad item is logged and skipped while the rest continue.
```python
def run_workflow():
    try:
        items = check_for_new_items(source)
    except Exception as e:
        print(f"FAILED at step 1 (check_for_new_items): {e}")
        return

    processed, failed = 0, 0
    for item in items:
        try:
            data = extract_data(item)
        except Exception as e:
            print(f"FAILED at step 2 (extract_data) for item {item.get('id')}: {e}")
            failed += 1
            continue
        try:
            save_to_destination(data)
            processed += 1
        except Exception as e:
            print(f"FAILED at step 3 (save_to_destination) for item {item['id']}: {e}")
            failed += 1

    try:
        send_notification(f"Processed {processed} items, {failed} failed")
    except Exception as e:
        print(f"FAILED at step 4 (send_notification): {e}")
```

**Step 7: Test with realistic multi-item input.**
The sample `source` has 5 items, including one edge case (no sender). Run the workflow:
```python
run_workflow()
print(LEADS_FILE.read_text())
```
Expected output:
```text
FAILED at step 2 (extract_data) for item 5: item 5 has no sender
NOTIFY: Processed 4 items, 1 failed
id,sender,subject,message
1,ana@example.com,Pricing,Can you send pricing for 10 seats?
...
```
Run `run_workflow()` a second time: it should report `Processed 0 items, 1 failed`, because the first 4 are already saved and item 5 still has no sender. To start fresh, run `LEADS_FILE.unlink(missing_ok=True)`. Then add an edge case from your own Project 1 list to `source` and test again.

**Step 8: Document the workflow.**
Add a **text cell** headed `README` and write your notes in it.
Diagram or describe the step sequence, referencing your Project 1 workflow map.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
multistep_workflow_project/
│
├── workflow_steps.md
├── workflow.py
├── leads.csv
├── README.md
```

### What You Learned
- ✅ Breaking a workflow into discrete, testable steps
- ✅ What webhooks are and why they matter for automation
- ✅ Writing each step as an isolated function
- ✅ Chaining steps into a sequential workflow
- ✅ Adding per-step error handling
- ✅ Testing with realistic multi-item and edge-case input

### Portfolio Project
**Multi-Step Automated Workflow**: Built a chained, multi-step automation with isolated, testable functions and per-step error handling, tested against realistic and edge-case inputs.
**Skills:** Python, Workflow Design, Error Handling, Systems Integration, AI Automation Engineering.

**Deliverable:** A working multi-step workflow script, tested against realistic input including edge cases.

### Quiz

1. What is a webhook?
2. Why write each workflow step as its own function?
3. In the first `run_workflow()`, what happens when item 5 has no sender? What changes with per-step error handling?
4. Why does running the workflow a second time process 0 new items?

*Answers: 1) A way for one system to notify another automatically by sending an HTTP request to a URL when something happens, so the receiver doesn't have to keep checking. 2) Each step can be tested, fixed, and replaced on its own, and errors point to exactly one step. 3) The first version crashes and stops the whole run; with per-step handling, the failure is logged with the step name and the other items are still processed. 4) `check_for_new_items` skips any item whose id is already saved in leads.csv, which prevents duplicates.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "chain",
   "kicker": "Project 3 · Multi-step workflow",
   "title": "From one script to a workflow",
   "beats": [
    {
     "say": "Welcome to Project 3."
    },
    {
     "say": "You'll chain several steps together, moving from a single script to a real workflow, using the new leads example from Project 1."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Step 3",
   "title": "Checking versus a webhook",
   "nodes": [
    {
     "id": "src",
     "label": "Lead source",
     "x": 14,
     "y": 50,
     "sub": "inbox or web form",
     "art": "mail"
    },
    {
     "id": "wf",
     "label": "Your workflow",
     "x": 86,
     "y": 50,
     "sub": "run_workflow()",
     "art": "gear"
    }
   ],
   "edges": [
    {
     "from": "src",
     "to": "wf"
    }
   ],
   "beats": [
    {
     "say": "Two systems: a source of leads, and your workflow.",
     "show": 2
    },
    {
     "say": "Without a webhook, your workflow has to keep checking: anything new?",
     "on": "wf",
     "send": {
      "from": "wf",
      "to": "src",
      "label": "anything new?"
     }
    },
    {
     "say": "Most of the time, the answer is no.",
     "on": "src",
     "send": {
      "from": "src",
      "to": "wf",
      "label": "nothing yet"
     }
    },
    {
     "say": "With a webhook, the source sends an H T T P request to a U R L you give it, the moment something happens.",
     "on": "src",
     "send": {
      "from": "src",
      "to": "wf",
      "label": "POST: new lead"
     }
    },
    {
     "say": "So the receiver never has to keep asking. This project checks on demand, but in a live system, a webhook could start run workflow.",
     "on": "wf"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Step 4",
   "title": "Each step is its own function",
   "nodes": [
    {
     "id": "check",
     "label": "Check for new",
     "x": 12,
     "y": 28,
     "sub": "skip saved ids",
     "art": "search"
    },
    {
     "id": "extract",
     "label": "Extract data",
     "x": 37,
     "y": 72,
     "sub": "reject no sender",
     "art": "funnel"
    },
    {
     "id": "save",
     "label": "Save",
     "x": 63,
     "y": 28,
     "sub": "append to leads.csv",
     "art": "table"
    },
    {
     "id": "notify",
     "label": "Notify",
     "x": 88,
     "y": 72,
     "sub": "print, for now",
     "art": "bell"
    }
   ],
   "edges": [
    {
     "from": "check",
     "to": "extract"
    },
    {
     "from": "extract",
     "to": "save"
    },
    {
     "from": "save",
     "to": "notify"
    }
   ],
   "beats": [
    {
     "say": "Break the workflow into four steps, and write each one as its own function.",
     "show": 4
    },
    {
     "say": "Check for new items returns only items whose i d isn't already saved in leads dot C S V.",
     "on": "check",
     "send": {
      "from": "check",
      "to": "extract",
      "label": "new items"
     }
    },
    {
     "say": "Extract data cleans up the fields, and raises an error if an item has no sender.",
     "on": "extract",
     "send": {
      "from": "extract",
      "to": "save",
      "label": "clean fields"
     }
    },
    {
     "say": "Save to destination appends one row to leads dot C S V, our stand-in for a spreadsheet.",
     "on": "save",
     "send": {
      "from": "save",
      "to": "notify",
      "label": "row saved"
     }
    },
    {
     "say": "And send notification just prints for now. Later, it could be an email or a chat message.",
     "on": "notify"
    },
    {
     "say": "Separate functions mean each step can be tested and fixed on its own, and an error points to exactly one step.",
     "on": [
      "check",
      "extract",
      "save",
      "notify"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 4",
   "title": "The sample input, with one edge case",
   "columns": [
    "id",
    "sender",
    "subject",
    "message"
   ],
   "rows": [
    [
     "1",
     "ana@example.com",
     "Pricing",
     "Pricing for 10 seats?"
    ],
    [
     "2",
     "raj@example.com",
     "Demo",
     "A demo next week"
    ],
    [
     "3",
     "li@example.com",
     "Site down!",
     "Dashboard down…"
    ],
    [
     "4",
     "sam@example.com",
     "Thanks",
     "Thanks for the reply"
    ],
    [
     "5",
     "(empty)",
     "(no subject)",
     "WIN A FREE PRIZE!!!"
    ]
   ],
   "beats": [
    {
     "say": "Instead of a real inbox, the source is a list of five sample messages."
    },
    {
     "say": "Four are normal leads and messages, each with a sender.",
     "hl": [
      0,
      1,
      2,
      3
     ],
     "col": 1
    },
    {
     "say": "Item five is the edge case: spam, with no sender at all.",
     "hl": 4,
     "dim": true,
     "col": 1
    },
    {
     "say": "On the first run, leads dot C S V doesn't exist yet, so check for new items returns all five.",
     "sql": "saved_ids = {}  →  new items: 1, 2, 3, 4, 5",
     "hl": [
      0,
      1,
      2,
      3,
      4
     ],
     "col": 0
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Steps 6 and 7",
   "title": "Per-step error handling, item by item",
   "file": "run_workflow",
   "code": "processed, failed = 0, 0\nfor item in items:\n    try:\n        data = extract_data(item)\n    except Exception as e:\n        print(f\"FAILED at step 2 (extract_data) \"\n              f\"for item {item.get('id')}: {e}\")\n        failed += 1\n        continue\n    try:\n        save_to_destination(data)\n        processed += 1\n    except Exception as e:\n        ...  # print FAILED at step 3; failed += 1",
   "beats": [
    {
     "say": "Here's the loop with its own try and except for each step. Both counters start at zero.",
     "line": 1,
     "vars": {
      "items": "[1, 2, 3, 4, 5]",
      "processed": 0,
      "failed": 0
     }
    },
    {
     "say": "Item one: extract data works.",
     "line": [
      2,
      3,
      4
     ],
     "vars": {
      "item": 1,
      "data": "{id: 1, sender: ana@…}"
     }
    },
    {
     "say": "It's saved to leads dot C S V, and processed goes to one.",
     "line": [
      10,
      11,
      12
     ],
     "vars": {
      "processed": 1
     }
    },
    {
     "say": "Items two, three and four go the same way. Processed is four.",
     "line": [
      10,
      11,
      12
     ],
     "vars": {
      "item": 4,
      "data": "{id: 4, sender: sam@…}",
      "processed": 4
     }
    },
    {
     "say": "Item five has no sender, so extract data raises a value error.",
     "line": [
      3,
      4,
      5
     ],
     "vars": {
      "item": 5,
      "e": "ValueError('item 5 has no sender')"
     }
    },
    {
     "say": "The except prints which step failed, and for which item.",
     "line": [
      6,
      7
     ],
     "out": "FAILED at step 2 (extract_data) for item 5: item 5 has no sender"
    },
    {
     "say": "Failed goes to one, and continue skips to the next item, so nothing else is lost.",
     "line": [
      8,
      9
     ],
     "vars": {
      "failed": 1
     }
    },
    {
     "say": "After the loop, send notification reports the totals.",
     "line": 1,
     "out": "NOTIFY: Processed 4 items, 1 failed"
    },
    {
     "say": "Without these try blocks, item five's error would have stopped the whole run, and no summary would be sent.",
     "line": [
      3,
      5
     ]
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Step 7",
   "title": "Run it again: no duplicates",
   "values": [
    "id 1",
    "id 2",
    "id 3",
    "id 4",
    "id 5"
   ],
   "beats": [
    {
     "say": "Now run the workflow a second time, with the same five items."
    },
    {
     "say": "Items one to four are already saved in leads dot C S V, so check for new items skips them.",
     "gone": [
      0,
      1,
      2,
      3
     ],
     "note": "saved_ids = {1, 2, 3, 4}"
    },
    {
     "say": "Only item five is new, and it still has no sender, so it fails again at step two.",
     "gone": [
      0,
      1,
      2,
      3
     ],
     "hl": 4,
     "ptr": {
      "item": 4
     },
     "note": "FAILED at step 2 for item 5"
    },
    {
     "say": "The summary says: processed zero items, one failed. No duplicates were added.",
     "gone": [
      0,
      1,
      2,
      3
     ],
     "hl": 4,
     "note": "NOTIFY: Processed 0 items, 1 failed"
    },
    {
     "say": "To start fresh, delete leads dot C S V. Then add an edge case from your own Project 1 list, and test again.",
     "note": "LEADS_FILE.unlink(missing_ok=True)"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why does running the workflow a second time process zero new items?",
   "options": [
    "The source list is emptied after the first run",
    "send_notification blocks repeat runs",
    "check_for_new_items skips any item whose id is already saved in leads.csv"
   ],
   "answer": 2,
   "good": "That's right. Check for new items skips any item whose id is already saved in leads dot C S V, which prevents duplicates.",
   "bad": "Not quite. Check for new items skips any item whose id is already saved in leads dot C S V, which prevents duplicates.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why does running the workflow a second time process zero new items?",
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
     "A working multi-step workflow",
     ""
    ],
    [
     "Tested with edge cases",
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
     "say": "you have a working multi-step workflow script,",
     "show": 1
    },
    {
     "say": "tested against realistic input, including edge cases.",
     "show": 2
    },
    {
     "say": "Next, in Module 4, an A I decision step.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 4 (Module 4): Add an AI Decision Step to an Existing Workflow

**Time: about 2.5 hours**

**Goal:** Add an LLM-driven decision into your Project 3 workflow, the point where automation stops being purely rule-based.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `ai_decision_step_project`.
Run the API key cell from **Before you start**. Then copy the code cells from Project 3, Steps 4 and 6 (the sample `source`, the four step functions, and `run_workflow()`) into this notebook and run them.

**Step 2: Identify where a rule-based check falls short.**
Revisit your Project 1 edge cases: which ones require judgment a simple rule can't capture (e.g., "does this message sound urgent")?

**Step 3: Design the AI decision as a single, narrow question.**
Write the exact question you want the AI to answer for this one step (e.g., "Is this customer message urgent? Answer only 'yes' or 'no'.").

**Step 4: Implement the AI decision step.**
Add a **code cell**, paste in the code below, and run it with **Shift + Enter**.
```python
import os
import requests

def is_urgent(message_text):
    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": os.environ["ANTHROPIC_API_KEY"],
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": "claude-sonnet-5-5",
            "max_tokens": 5,
            "messages": [
                {"role": "user", "content": f"Is this message urgent? Answer only yes or no.\n\n{message_text}"}
            ],
        },
        timeout=30,
    )
    response.raise_for_status()  # turn HTTP errors (bad key, rate limit) into exceptions
    answer = response.json()["content"][0]["text"].strip().lower()
    return answer.startswith("yes")

print(is_urgent("Our dashboard has been down for an hour. Please help now."))
print(is_urgent("Thanks for the quick reply yesterday."))
```
You should see `True` then `False`. Keeping `max_tokens` small forces a short, structured answer that's easy to parse programmatically. `startswith("yes")` also accepts answers like "Yes." with a period.

**Step 5: Add a fallback for AI failures.**
```python
def safe_is_urgent(message_text):
    try:
        return is_urgent(message_text)
    except Exception as e:
        print(f"AI decision failed ({e}); treating message as not urgent")
        return False  # safe default
```
A **fallback** is a safe default behavior used when a step can't be completed normally. Here a network error or bad key won't crash the workflow. Think about which default is safer for your own workflow: sometimes "urgent" is the safer guess.

**Step 6: Wire the decision into your Project 3 workflow.**
Replace your `run_workflow()` cell with this version, which adds the AI decision between extracting and saving:
```python
def run_workflow():
    try:
        items = check_for_new_items(source)
    except Exception as e:
        print(f"FAILED at step 1 (check_for_new_items): {e}")
        return

    processed, failed = 0, 0
    for item in items:
        try:
            data = extract_data(item)
        except Exception as e:
            print(f"FAILED at step 2 (extract_data) for item {item.get('id')}: {e}")
            failed += 1
            continue

        if safe_is_urgent(data["message"]):  # the new AI decision step
            try:
                send_notification(f"URGENT from {data['sender']}: {data['message']}")
            except Exception as e:
                print(f"FAILED to send urgent notification for item {item['id']}: {e}")

        try:
            save_to_destination(data)
            processed += 1
        except Exception as e:
            print(f"FAILED at step 3 (save_to_destination) for item {item['id']}: {e}")
            failed += 1

    try:
        send_notification(f"Processed {processed} items, {failed} failed")
    except Exception as e:
        print(f"FAILED at step 4 (send_notification): {e}")

run_workflow()
```
With the Project 3 sample data, you should see one `URGENT` notification (the "dashboard down" message) before the summary.

**Step 7: Test with ambiguous cases.**
Add messages to `source` that are clearly urgent, clearly not, and genuinely ambiguous (e.g., "Could you look at this when you get a chance? The invoice seems wrong."). Give each a new `id`, run `run_workflow()` again, and review the AI's decisions.

**Step 8: Document the AI decision's role and limitations.**
Add a **text cell** headed `ai_decision_notes` and write your notes in it.
Note: what the AI decides, how confident you are in it, and what happens if it's wrong.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
ai_decision_step_project/
│
├── workflow.py
├── ai_decision.py
├── ai_decision_notes.md
```

### What You Learned
- ✅ Identifying where rule-based logic falls short
- ✅ Designing narrow, single-purpose AI prompts
- ✅ Implementing an LLM-based decision step
- ✅ Producing structured, parseable AI output
- ✅ Adding a safe fallback for AI call failures
- ✅ Testing and documenting AI decision behavior

### Portfolio Project
**AI-Augmented Workflow Decision Step**: Added a narrowly-scoped LLM decision step into an existing rule-based workflow, with structured output parsing and a safe fallback for failures.
**Skills:** LLM APIs, Prompt Engineering, Python, Workflow Design, AI Automation Engineering.

**Deliverable:** A workflow with an integrated AI decision step, tested against ambiguous cases and documented with its limitations.

### Quiz

1. Why ask the AI one narrow yes/no question instead of an open-ended one?
2. What does `response.raise_for_status()` do?
3. What is a fallback, and what does `safe_is_urgent` fall back to?
4. Why test with genuinely ambiguous messages, not just clear ones?

*Answers: 1) A narrow question gives a short, predictable answer that code can parse reliably. 2) It raises an exception when the API returns an error status, such as a bad key or rate limit, instead of continuing with a bad response. 3) A safe default used when a step fails; it returns False (not urgent) so the workflow keeps running. 4) Ambiguous cases are where the AI is most likely to be wrong, so they show you its real limits.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "fork",
   "kicker": "Project 4 · AI decision step",
   "title": "Where rules fall short",
   "beats": [
    {
     "say": "Welcome to Project 4."
    },
    {
     "say": "You'll add an L L M driven decision into your Project 3 workflow. This is the point where automation stops being purely rule-based."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Steps 2 and 3",
   "title": "A simple rule misses the urgent one",
   "columns": [
    "id",
    "message",
    "Has \"urgent\"?"
   ],
   "rows": [
    [
     "1",
     "Pricing for 10 seats?",
     "no"
    ],
    [
     "2",
     "A demo next week",
     "no"
    ],
    [
     "3",
     "Dashboard down an hour",
     "no"
    ],
    [
     "4",
     "Thanks for the reply",
     "no"
    ]
   ],
   "beats": [
    {
     "say": "Here are the four valid messages from Project 3. Which ones are urgent?"
    },
    {
     "say": "Try a simple rule: flag a message if it contains the word urgent.",
     "sql": "rule: \"urgent\" in message",
     "col": 2
    },
    {
     "say": "Not one message matches, so the rule flags nothing.",
     "col": 2,
     "hl": [
      0,
      1,
      2,
      3
     ]
    },
    {
     "say": "But message three, our dashboard has been down for an hour, please help now, is clearly urgent. Spotting that takes judgment.",
     "hl": 2,
     "dim": true,
     "col": 1
    },
    {
     "say": "So ask an A I one narrow question, with an answer code can parse.",
     "sql": "Is this message urgent? Answer only yes or no.",
     "hl": 2,
     "dim": true
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Step 4",
   "title": "Ask Claude one narrow question",
   "file": "is_urgent",
   "code": "def is_urgent(message_text):\n    response = requests.post(\n        \"https://api.anthropic.com/v1/messages\",\n        headers={...}, json={\n            \"model\": \"claude-sonnet-5-5\",\n            \"max_tokens\": 5,\n            \"messages\": [{\"role\": \"user\", \"content\":\n              f\"Is this message urgent? Answer only\"\n              f\" yes or no.\\n\\n{message_text}\"}],\n        }, timeout=30)\n    response.raise_for_status()\n    answer = (response.json()[\"content\"][0][\"text\"]\n              .strip().lower())\n    return answer.startswith(\"yes\")",
   "beats": [
    {
     "say": "Is urgent sends the message to the Claude A P I. Start with the dashboard message.",
     "line": 1,
     "vars": {
      "message_text": "\"Our dashboard has been down for an hour. Please help now.\""
     }
    },
    {
     "say": "The prompt is the narrow question, with the message underneath.",
     "line": [
      7,
      8,
      9
     ]
    },
    {
     "say": "Max tokens is just five, which forces a short, structured answer.",
     "line": 6
    },
    {
     "say": "The reply comes back with status two hundred, so raise for status does nothing.",
     "line": 11,
     "vars": {
      "response.status_code": 200
     }
    },
    {
     "say": "Pull out the text, for example capital Yes, then strip spaces and make it lower case.",
     "line": [
      12,
      13
     ],
     "vars": {
      "answer": "\"yes\""
     }
    },
    {
     "say": "It starts with yes, so is urgent returns True. Starts with also accepts Yes with a period.",
     "line": 14,
     "out": "True"
    },
    {
     "say": "Now the thank-you message. Say the answer is No. It doesn't start with yes, so False.",
     "line": [
      12,
      13,
      14
     ],
     "vars": {
      "message_text": "\"Thanks for the quick reply yesterday.\"",
      "response.status_code": 200,
      "answer": "\"no\""
     },
     "out": "False"
    },
    {
     "say": "Now say the key is wrong.",
     "line": 1,
     "vars": null
    },
    {
     "say": "The A P I answers four oh one, and raise for status turns that error status into an exception. Rate limits work the same way.",
     "line": 11,
     "vars": {
      "response.status_code": 401
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Step 5",
   "title": "A safe fallback when the A I call fails",
   "file": "safe_is_urgent",
   "code": "def safe_is_urgent(message_text):\n    try:\n        return is_urgent(message_text)\n    except Exception as e:\n        print(f\"AI decision failed ({e}); \"\n              \"treating message as not urgent\")\n        return False  # safe default",
   "beats": [
    {
     "say": "A fallback is a safe default used when a step can't be completed normally.",
     "line": 1
    },
    {
     "say": "Safe is urgent simply tries the real call.",
     "line": [
      2,
      3
     ],
     "vars": {
      "message_text": "\"Our dashboard has been down for an hour. Please help now.\""
     }
    },
    {
     "say": "Say the key is wrong. Is urgent raises an H T T P error with status four oh one.",
     "line": [
      3,
      4
     ],
     "vars": {
      "e": "HTTPError(\"401 Client Error: Unauthorized for url: https://api.anthropic.com/v1/messages\")"
     }
    },
    {
     "say": "Instead of crashing, it prints what went wrong.",
     "line": [
      5,
      6
     ],
     "out": "AI decision failed (401 Client Error: Unauthorized for url: https://api.anthropic.com/v1/messages); treating message as not urgent"
    },
    {
     "say": "And returns False, not urgent, so the workflow keeps going.",
     "line": 7
    },
    {
     "say": "Think about which default is safer for your own workflow. Sometimes urgent is the safer guess.",
     "line": 7
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Step 6",
   "title": "The decision, wired into the workflow",
   "nodes": [
    {
     "id": "extract",
     "label": "Extract data",
     "x": 12,
     "y": 50,
     "sub": "step 2",
     "art": "funnel"
    },
    {
     "id": "ai",
     "label": "Urgent?",
     "x": 42,
     "y": 50,
     "sub": "the AI decision",
     "art": "robot"
    },
    {
     "id": "notify",
     "label": "Notify",
     "x": 86,
     "y": 18,
     "sub": "URGENT from …",
     "art": "bell"
    },
    {
     "id": "save",
     "label": "Save",
     "x": 86,
     "y": 82,
     "sub": "leads.csv",
     "art": "table"
    }
   ],
   "edges": [
    {
     "from": "extract",
     "to": "ai"
    },
    {
     "from": "ai",
     "to": "notify"
    },
    {
     "from": "ai",
     "to": "save"
    },
    {
     "from": "save",
     "to": "notify"
    }
   ],
   "beats": [
    {
     "say": "The A I decision sits between extracting and saving.",
     "show": 4,
     "on": "ai"
    },
    {
     "say": "Item one, the pricing question, goes to the decision.",
     "on": "ai",
     "send": {
      "from": "extract",
      "to": "ai",
      "label": "item 1"
     }
    },
    {
     "say": "Not urgent, so it's simply saved. Items two and four go the same way.",
     "on": "save",
     "send": {
      "from": "ai",
      "to": "save",
      "label": "not urgent"
     }
    },
    {
     "say": "Item three, the dashboard message, comes through.",
     "on": "ai",
     "send": {
      "from": "extract",
      "to": "ai",
      "label": "item 3"
     }
    },
    {
     "say": "Urgent! An urgent notification goes out, with the sender and the message.",
     "on": "notify",
     "send": {
      "from": "ai",
      "to": "notify",
      "label": "URGENT: li@…"
     }
    },
    {
     "say": "Then it's saved like the others.",
     "on": "save",
     "send": {
      "from": "ai",
      "to": "save",
      "label": "item 3"
     }
    },
    {
     "say": "Item five still fails at extract, so it never reaches the A I. The summary says: processed four items, one failed.",
     "on": "notify",
     "send": {
      "from": "save",
      "to": "notify",
      "label": "summary: 4 saved"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Steps 7 and 8",
   "title": "Test the hard cases, and write down the limits",
   "columns": [
    "Message",
    "Kind",
    "Expect"
   ],
   "rows": [
    [
     "Dashboard down an hour",
     "clearly urgent",
     "yes"
    ],
    [
     "Thanks for the reply",
     "clearly not",
     "no"
    ],
    [
     "Invoice seems wrong…",
     "ambiguous",
     "?"
    ]
   ],
   "beats": [
    {
     "say": "Now add test messages to the source, each with a new i d."
    },
    {
     "say": "One that's clearly urgent.",
     "hl": 0
    },
    {
     "say": "One that's clearly not.",
     "hl": 1
    },
    {
     "say": "And one that's genuinely ambiguous: could you look at this when you get a chance? The invoice seems wrong.",
     "hl": 2,
     "dim": true,
     "col": 2
    },
    {
     "say": "Ambiguous cases are where the A I is most likely to be wrong, so they show you its real limits.",
     "hl": 2,
     "dim": true,
     "col": 1
    },
    {
     "say": "Then, in a text cell called A I decision notes, write what the A I decides, how confident you are, and what happens if it's wrong.",
     "sql": "ai_decision_notes: what it decides · how confident · what if it's wrong"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why ask the A I one narrow yes or no question, instead of an open-ended one?",
   "options": [
    "Open-ended questions cost nothing",
    "A narrow question gives a short, predictable answer that code can parse reliably",
    "The A P I only accepts yes or no questions"
   ],
   "answer": 1,
   "good": "That's right. A narrow question gives a short, predictable answer that code can parse reliably.",
   "bad": "Not quite. A narrow question gives a short, predictable answer that code can parse reliably.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why ask the A I one narrow yes or no question, instead of an open-ended one?",
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
     "AI decision step integrated",
     ""
    ],
    [
     "Tested and limits documented",
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
     "say": "your workflow has an integrated A I decision step,",
     "show": 1
    },
    {
     "say": "tested against ambiguous cases and documented with its limitations.",
     "show": 2
    },
    {
     "say": "Next, in Module 5, a task-automation agent.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 5 (Module 5): Build a Simple Task-Automation Agent

**Time: about 3.5 hours**

**Goal:** Replace fixed logic with agent-style tool calling, letting the AI decide *which* action to take, not just answer one narrow question.

If agents are new to you, the Agentic AI Fundamentals course earlier in this track explains the agent loop, tools, and guardrails in more depth and is a good foundation for this project.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `task_agent_project`. Run the API key cell from **Before you start**.

**Step 2: Understand what tool calling is.**
**Tool calling** lets an LLM ask to run a specific function you've defined, with arguments it chooses based on the input, instead of just returning text. The model never runs anything itself: it sends back a request, your code decides whether to run it, and you send the result back.

**Step 3: Define 2–3 simple tools.**
Add a **code cell**, paste in the code below, and run it with **Shift + Enter**. These are simulated: they print instead of really sending email, so you can test safely.
```python
def send_email(to, subject, body):
    print(f"(simulated) Sending email to {to}: {subject}")
    return f"Email sent to {to}."

def create_task(title, priority):
    print(f"Creating task: {title} (priority: {priority})")
    return f"Task '{title}' created."

def log_note(text):
    print(f"Logging note: {text}")
    return "Note logged."

# The ONLY functions the agent may run. Anything else the model asks for is refused.
ALLOWED_TOOLS = {
    "send_email": send_email,
    "create_task": create_task,
    "log_note": log_note,
}

# Tools with side effects that need a human's OK before they run
NEEDS_CONFIRMATION = {"send_email"}
```
An explicit allow-list matters: the model can only trigger the functions you put in `ALLOWED_TOOLS`, never any other function in your notebook.

**Step 4: Describe the tools to the model.**
Each tool needs a `name`, a `description`, and an `input_schema`: a **JSON Schema** describing the arguments, their types, and which are required.
```python
tool_definitions = [
    {
        "name": "send_email",
        "description": "Send an email to someone. Use only when a reply to a person is clearly needed.",
        "input_schema": {
            "type": "object",
            "properties": {
                "to": {"type": "string", "description": "Recipient email address"},
                "subject": {"type": "string", "description": "Email subject line"},
                "body": {"type": "string", "description": "Email body text"},
            },
            "required": ["to", "subject", "body"],
        },
    },
    {
        "name": "create_task",
        "description": "Create a to-do task for the team to follow up on.",
        "input_schema": {
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "Short task title"},
                "priority": {"type": "string", "enum": ["low", "medium", "high"]},
            },
            "required": ["title", "priority"],
        },
    },
    {
        "name": "log_note",
        "description": "Log a note for later reference when no action is needed.",
        "input_schema": {
            "type": "object",
            "properties": {
                "text": {"type": "string", "description": "The note to record"},
            },
            "required": ["text"],
        },
    },
]
```
The model uses each tool's **description** to decide which one fits a given situation. Accurate, specific descriptions directly affect how well it chooses.

**Step 5: Send a request with tool definitions and let the model choose.**
This function sends one request and returns the parsed response.
```python
import os
import requests

SYSTEM_PROMPT = (
    "You are an operations assistant for a small online shop. "
    "Use the tools to handle each situation. Keep emails short and polite."
)

def call_claude(messages):
    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": os.environ["ANTHROPIC_API_KEY"],
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": "claude-sonnet-5-5",
            "max_tokens": 1024,
            "system": SYSTEM_PROMPT,
            "tools": tool_definitions,
            "messages": messages,
        },
        timeout=60,
    )
    response.raise_for_status()
    return response.json()
```
When the model wants a tool, the response has `"stop_reason": "tool_use"` and its `content` list includes one or more blocks of type `tool_use`, each with an `id`, the tool `name`, and its `input` arguments.

**Step 6: Parse and execute the chosen tool call, with a human check before risky actions.**
This is the full **agent loop**: ask the model, run the tools it picks (only allowed ones, and only after your OK for risky ones), send the results back, and repeat until it's done.
```python
def run_tool(name, args):
    """Run one tool call safely. Returns (result_text, is_error)."""
    if name not in ALLOWED_TOOLS:
        return f"Unknown tool '{name}'. Not run.", True

    # Human-in-the-loop: ask BEFORE any action with side effects
    if name in NEEDS_CONFIRMATION:
        print(f"\nThe agent wants to run {name} with:")
        for key, value in args.items():
            print(f"  {key}: {value}")
        confirm = input("Allow this? (y/n): ")
        if confirm.strip().lower() != "y":
            return "A human declined this action. It was not done.", True

    try:
        return str(ALLOWED_TOOLS[name](**args)), False
    except Exception as e:
        return f"Tool failed: {e}", True

def run_agent(user_request, max_turns=5):
    messages = [{"role": "user", "content": user_request}]
    for _ in range(max_turns):
        reply = call_claude(messages)
        # Keep the model's full reply (text and tool_use blocks) in the history
        messages.append({"role": "assistant", "content": reply["content"]})

        if reply["stop_reason"] != "tool_use":
            final_text = "".join(b["text"] for b in reply["content"] if b["type"] == "text")
            print("\nAgent:", final_text)
            return final_text

        tool_results = []
        for block in reply["content"]:
            if block["type"] == "tool_use":
                result, is_error = run_tool(block["name"], block["input"])
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block["id"],
                    "content": result,
                    "is_error": is_error,
                })
        # Tool results go back to the model in a user message
        messages.append({"role": "user", "content": tool_results})

    print("\nStopped: reached the turn limit.")

run_agent("A customer (jo@example.com) emailed asking for a refund on order #4521.")
```
Every `tool_use` block must get a matching `tool_result` with the same `tool_use_id`, even when the action was declined; that's how the model learns what happened. `max_turns` stops a confused agent from looping forever.

**Step 7: Test with varied inputs.**
Run `run_agent(...)` against 5 different situations that should trigger different tools (or no tool at all), for example:
- "Remind the team to restock blue mugs; we're almost out."
- "FYI: the courier changes its pickup time to 3pm from Monday."
- "What's 2 + 2?" (no tool needed)

Note which tool the model picked each time and whether it was the right one.

**Step 8: Test the human-in-the-loop check for risky actions.**
**Human-in-the-loop** means a person confirms an action before it's actually executed, for higher-risk steps. Run a request that leads to an email and answer `n` at the prompt. Check that no "(simulated) Sending email" line printed and that the agent's final reply admits the email wasn't sent. Then decide which other tools in your own workflow should be in `NEEDS_CONFIRMATION`.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
task_agent_project/
│
├── tools.py
├── agent.py
├── test_scenarios.md
```

### What You Learned
- ✅ What tool calling is and how it differs from plain text generation
- ✅ Defining tools with clear descriptions and JSON Schema inputs
- ✅ Letting an LLM choose which tool to invoke
- ✅ Running a full tool-use loop and returning tool results
- ✅ Restricting the agent to an explicit allow-list of tools
- ✅ Adding human-in-the-loop confirmation before risky actions

### Portfolio Project
**Task-Automation Agent**: Built an LLM-based agent that chooses and executes actions from a defined toolset based on situational input, with human-in-the-loop confirmation for high-risk actions.
**Skills:** Agentic AI, Tool Calling, LLM APIs, Python, AI Automation Engineering.

**Deliverable:** A working tool-calling agent, tested across varied scenarios, with human confirmation for risky actions.

### Quiz

1. Does the model run your tool functions itself? Explain what actually happens.
2. What three fields does each tool definition need?
3. Why look tools up in an `ALLOWED_TOOLS` dictionary instead of running any function name the model sends?
4. When must the human confirmation happen, and why?
5. After running a tool, how do you send the result back to the model?

*Answers: 1) No. The model returns a `tool_use` block naming the tool and its input; your code decides whether to run it and sends back the result. 2) `name`, `description`, and `input_schema` (a JSON Schema for the arguments). 3) So the model can only trigger the functions you chose, never any other function in your code. 4) Before the action runs, because once an email is sent it can't be taken back. 5) In a user message containing a `tool_result` block whose `tool_use_id` matches the `tool_use` block's `id`.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "robot",
   "kicker": "Project 5 · Task-automation agent",
   "title": "Let the AI choose the action",
   "beats": [
    {
     "say": "Welcome to Project 5."
    },
    {
     "say": "Instead of answering one narrow question, the A I now decides which action to take, using tool calling."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Steps 2 and 5",
   "title": "How tool calling works",
   "nodes": [
    {
     "id": "user",
     "label": "Request",
     "x": 10,
     "y": 50,
     "sub": "jo@example.com refund",
     "art": "mail"
    },
    {
     "id": "loop",
     "label": "run_agent",
     "x": 46,
     "y": 50,
     "sub": "your code",
     "art": "code"
    },
    {
     "id": "claude",
     "label": "Claude",
     "x": 86,
     "y": 18,
     "sub": "picks a tool",
     "art": "robot"
    },
    {
     "id": "tools",
     "label": "Your tools",
     "x": 86,
     "y": 82,
     "sub": "only ALLOWED_TOOLS",
     "art": "gear"
    }
   ],
   "edges": [
    {
     "from": "user",
     "to": "loop"
    },
    {
     "from": "loop",
     "to": "claude"
    },
    {
     "from": "loop",
     "to": "tools"
    }
   ],
   "beats": [
    {
     "say": "A request comes in: a customer, jo at example dot com, emailed asking for a refund on order forty five twenty one.",
     "on": "user",
     "send": {
      "from": "user",
      "to": "loop",
      "label": "refund #4521"
     }
    },
    {
     "say": "Run agent sends it to Claude, along with the tool definitions.",
     "on": "loop",
     "send": {
      "from": "loop",
      "to": "claude",
      "label": "messages + tools"
     }
    },
    {
     "say": "Claude doesn't run anything. It replies with stop reason tool use, naming a tool and its arguments. For example, create task.",
     "on": "claude",
     "send": {
      "from": "claude",
      "to": "loop",
      "label": "tool_use"
     }
    },
    {
     "say": "Your code decides whether to run it, and does.",
     "on": "tools",
     "send": {
      "from": "loop",
      "to": "tools",
      "label": "create_task"
     }
    },
    {
     "say": "The result goes back to Claude, in a tool result.",
     "on": "claude",
     "send": {
      "from": "loop",
      "to": "claude",
      "label": "tool_result"
     }
    },
    {
     "say": "When Claude is done, it replies with plain text, and the loop ends.",
     "on": "loop",
     "send": {
      "from": "claude",
      "to": "loop",
      "label": "final text"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Steps 3 and 4",
   "title": "Three tools, an allow-list, and one that needs a human",
   "columns": [
    "Tool",
    "Description says",
    "Inputs",
    "Confirm?"
   ],
   "rows": [
    [
     "send_email",
     "Only if reply needed",
     "to, subject, body",
     "yes"
    ],
    [
     "create_task",
     "To-do for the team",
     "title, priority",
     "no"
    ],
    [
     "log_note",
     "When no action needed",
     "text",
     "no"
    ]
   ],
   "beats": [
    {
     "say": "Three simulated tools. They print instead of really acting, so you can test safely.",
     "col": 0
    },
    {
     "say": "They go in a dictionary called allowed tools. The model can only trigger these, never any other function in your notebook.",
     "sql": "ALLOWED_TOOLS = {send_email, create_task, log_note}",
     "hl": [
      0,
      1,
      2
     ],
     "col": 0
    },
    {
     "say": "Each tool gets a description. The model uses these words to choose, so make them specific.",
     "col": 1
    },
    {
     "say": "And an input schema, in J S O N Schema: the arguments, their types, and which are required. Priority must be low, medium or high.",
     "col": 2,
     "hl": 1,
     "dim": true
    },
    {
     "say": "Send email has side effects that can't be undone, so it needs a human's okay first.",
     "sql": "NEEDS_CONFIRMATION = {\"send_email\"}",
     "hl": 0,
     "dim": true,
     "col": 3
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Step 6",
   "title": "run_tool: the safety gate",
   "file": "run_tool",
   "code": "def run_tool(name, args):\n    if name not in ALLOWED_TOOLS:\n        return (f\"Unknown tool '{name}'. \"\n                \"Not run.\"), True\n    if name in NEEDS_CONFIRMATION:  # prints args\n        confirm = input(\"Allow this? (y/n): \")\n        if confirm.strip().lower() != \"y\":\n            return (\"A human declined this action. \"\n                    \"It was not done.\"), True\n    try:\n        return (str(ALLOWED_TOOLS[name](**args)),\n                False)\n    except Exception as e:\n        return f\"Tool failed: {e}\", True",
   "beats": [
    {
     "say": "Every tool request passes through run tool. For example, Claude asks for create task, priority high.",
     "line": 1,
     "vars": {
      "name": "\"create_task\"",
      "args": "{title: \"Process refund for order #4521\", priority: \"high\"}"
     }
    },
    {
     "say": "It's on the allow-list, and it doesn't need confirmation.",
     "line": [
      2,
      5
     ]
    },
    {
     "say": "So it runs, and the result goes back marked as not an error.",
     "line": [
      11,
      12
     ],
     "out": [
      "Creating task: Process refund for order #4521 (priority: high)",
      "(\"Task 'Process refund for order #4521' created.\", False)"
     ]
    },
    {
     "say": "Now Claude asks to email jo. That one needs confirmation.",
     "line": 5,
     "vars": {
      "name": "\"send_email\"",
      "args": "{to: \"jo@example.com\", subject: …, body: …}"
     }
    },
    {
     "say": "It shows the arguments and asks: allow this? You type n.",
     "line": [
      5,
      6
     ],
     "vars": {
      "confirm": "\"n\""
     },
     "out": "Allow this? (y/n): n"
    },
    {
     "say": "So the email is never sent. The result says a human declined it.",
     "line": [
      7,
      8,
      9
     ],
     "out": "(\"A human declined this action. It was not done.\", True)"
    },
    {
     "say": "Last, say the model asks for a tool you never gave it.",
     "line": 1,
     "vars": null
    },
    {
     "say": "It isn't on the allow-list, so it's refused before anything runs.",
     "line": [
      2,
      3,
      4
     ],
     "vars": {
      "name": "\"delete_order\"",
      "args": "{…}"
     },
     "out": "(\"Unknown tool 'delete_order'. Not run.\", True)"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Step 6",
   "title": "The messages list, turn by turn",
   "values": [
    "user: refund request"
   ],
   "beats": [
    {
     "say": "Run agent keeps a messages list. It starts with the user's request.",
     "hl": 0,
     "ptr": {
      "turn": 0
     }
    },
    {
     "say": "Claude's whole reply is added. Say it asks for two tools at once: create task and send email.",
     "vals": [
      "user: refund request",
      "assistant: 2 × tool_use"
     ],
     "hl": 1,
     "note": "stop_reason: tool_use"
    },
    {
     "say": "Both results go back in one user message. Each has a tool use i d matching its request, even the declined email.",
     "vals": [
      "user: refund request",
      "assistant: 2 × tool_use",
      "user: 2 × tool_result"
     ],
     "hl": 2,
     "note": "tool_use_id = the tool_use block's id"
    },
    {
     "say": "Claude reads them, and replies with text: the task is created, but the email wasn't sent.",
     "vals": [
      "user: refund request",
      "assistant: 2 × tool_use",
      "user: 2 × tool_result",
      "assistant: final text"
     ],
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3,
     "note": "stop_reason isn't tool_use → return the text"
    },
    {
     "say": "If Claude kept asking for tools, max turns of five would stop the loop instead.",
     "vals": [
      "user: refund request",
      "assistant: 2 × tool_use",
      "user: 2 × tool_result",
      "assistant: final text"
     ],
     "note": "Stopped: reached the turn limit."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Steps 7 and 8",
   "title": "Test it across different situations",
   "columns": [
    "Situation",
    "A good pick"
   ],
   "rows": [
    [
     "Refund for jo, #4521",
     "task, maybe email"
    ],
    [
     "Restock blue mugs",
     "create_task"
    ],
    [
     "Courier pickup 3pm",
     "log_note"
    ],
    [
     "What's 2 + 2?",
     "no tool at all"
    ],
    [
     "Email prompt: answer n",
     "no email sent"
    ]
   ],
   "beats": [
    {
     "say": "Run the agent on five different situations, and note which tool it picked each time."
    },
    {
     "say": "Remind the team to restock blue mugs? A task fits.",
     "hl": 1
    },
    {
     "say": "The courier changes its pickup time to three P M? Nothing to do, so a note.",
     "hl": 2
    },
    {
     "say": "What's two plus two? No tool is needed at all.",
     "hl": 3
    },
    {
     "say": "Then test the human check. Answer n at the email prompt.",
     "hl": 4,
     "dim": true
    },
    {
     "say": "Check that no simulated sending email line printed, and that the agent's reply admits the email wasn't sent.",
     "hl": 4,
     "dim": true,
     "col": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "When must the human confirmation happen, and why?",
   "options": [
    "Before the action runs, because once an email is sent it can't be taken back",
    "After the action runs, so the human can review it",
    "Only when the model asks for it"
   ],
   "answer": 0,
   "good": "That's right. Confirm before the action runs, because once an email is sent it can't be taken back.",
   "bad": "Not quite. Confirm before the action runs, because once an email is sent it can't be taken back.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "When must the human confirmation happen, and why?",
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
     "A tool-calling agent, tested",
     ""
    ],
    [
     "Human confirmation for risky actions",
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
     "say": "you have a working tool-calling agent, tested across varied scenarios,",
     "show": 1
    },
    {
     "say": "with human confirmation for risky actions.",
     "show": 2
    },
    {
     "say": "Next, in Module 6, monitoring and error handling.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 6 (Module 6): Add Monitoring and Error Handling

**Time: about 3 hours**

**Goal:** Make your Project 5 agent (and earlier workflows) production-safe, reliable enough to trust running unattended.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `monitoring_project`.
Run the API key cell from **Before you start**. Then copy in and run your code cells from Project 4 (the workflow with `is_urgent`) and Project 5 (the agent).

**Step 2: Add structured logging.**
Add a **code cell**, paste in the code below, and run it with **Shift + Enter**.
```python
import logging
logging.basicConfig(filename="automation.log", level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s", force=True)

logging.info("Workflow started")
```
**Structured logging** records what happened, when, and at what severity level (INFO, WARNING, ERROR), instead of scattered print statements. `force=True` makes sure this setup takes effect even if the notebook already configured logging.

**Step 3: Log every key decision point.**
Add a log line every time your Project 4 AI decision or Project 5 agent chooses an action. These are lines to insert into your existing code, not a cell on their own:
- In `run_workflow()`, replace `if safe_is_urgent(data["message"]):` with:
```python
        urgent = safe_is_urgent(data["message"])
        logging.info(f"AI decided: urgent={urgent} for item {data['id']}")
        if urgent:
```
- In `run_tool()`, add this as the first line of the function body:
```python
    logging.info(f"Agent selected tool: {name} with input {args}")
```
Re-run both edited cells.

**Step 4: Add health check monitoring.**
```python
import os
import requests

def health_check():
    """Return True if the Claude API is reachable and the key works."""
    try:
        response = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": os.environ["ANTHROPIC_API_KEY"],
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-sonnet-5-5",
                "max_tokens": 1,
                "messages": [{"role": "user", "content": "ping"}],
            },
            timeout=10,
        )
        return response.status_code == 200
    except Exception as e:
        logging.error(f"Health check failed: {e}")
        return False

print("Healthy:", health_check())
```
A **health check** is a lightweight test that confirms a dependency (API, database) is reachable before running the real workflow. This one uses `max_tokens: 1` so it costs almost nothing.

**Step 5: Add retry logic for transient failures.**
```python
import time
import requests

def call_with_retry(func, *args, retries=3, delay=2):
    for attempt in range(retries):
        try:
            return func(*args)
        except requests.HTTPError as e:
            code = e.response.status_code
            if code < 500 and code != 429:
                raise  # permanent error, such as a bad key (401): retrying won't help
            logging.warning(f"Attempt {attempt + 1} of {retries} failed: {e}")
        except requests.RequestException as e:  # network problems and timeouts
            logging.warning(f"Attempt {attempt + 1} of {retries} failed: {e}")
        if attempt < retries - 1:
            time.sleep(delay)
    raise RuntimeError(f"All {retries} retries failed")
```
A **transient failure** is a temporary issue (network blip, rate limit) that often succeeds if retried, unlike a permanent failure (bad input, a wrong API key) that won't. So this function retries only network errors, timeouts, rate limits (status 429), and server errors (status 500 and up). Any other error is raised straight away instead of wasting retries.

**Step 6: Add alerting for repeated failures.**
```python
consecutive_failures = 0

def record_failure():
    global consecutive_failures
    consecutive_failures += 1
    if consecutive_failures >= 3:
        logging.error(f"ALERT: {consecutive_failures} consecutive failures, needs attention")

def record_success():
    global consecutive_failures
    consecutive_failures = 0

def monitored_is_urgent(message_text):
    """is_urgent with retries, failure tracking, and a safe default."""
    try:
        result = call_with_retry(is_urgent, message_text)
        record_success()
        return result
    except Exception as e:
        logging.error(f"AI decision failed after retries: {e}")
        record_failure()
        return False  # same safe default as Project 4

if health_check():
    print(monitored_is_urgent("Our dashboard has been down for an hour."))
else:
    logging.error("Skipping run: health check failed")
```
`record_success()` resets the counter, so the alert fires only for failures in a row. In a real system, the alert would also send you a message; here it writes an ERROR line you can search for. To use this in your workflow, change `safe_is_urgent` to `monitored_is_urgent` inside `run_workflow()`.

**Step 7: Test failure scenarios deliberately.**
Temporarily break something and confirm your logs, retries, and alerts all behave as expected. For example, set a wrong key and call the monitored function three times:
```python
os.environ["ANTHROPIC_API_KEY"] = "wrong-key"
for _ in range(3):
    monitored_is_urgent("test message")
```
Then re-run the API key cell from **Before you start** to restore your real key.

**Step 8: Review the log file after a full test run.**
```python
!cat automation.log
```
Confirm it tells a clear, readable story of what happened: an ERROR line for each failed call and the ALERT line after the third failure. A wrong key is a permanent error (status 401), so you won't see retry warnings here; those appear for network problems or rate limits.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
monitoring_project/
│
├── monitored_automation.py
├── automation.log
├── failure_test_notes.md
```

### What You Learned
- ✅ Structured logging vs. print statements
- ✅ Logging key decision points for later reconstruction
- ✅ Health checks for external dependencies
- ✅ Retry logic for transient failures
- ✅ Alerting after repeated failures
- ✅ Testing error handling deliberately with induced failures

### Portfolio Project
**Automation Monitoring & Error Handling**: Added structured logging, health checks, retry logic, and failure alerting to an existing AI-driven automation, validated through deliberate failure testing.
**Skills:** Observability, Error Handling, Reliability Engineering, Python, AI Automation Engineering.

**Deliverable:** A monitored, retry-capable automation with tested error handling and a readable log trail.

### Quiz

1. What does structured logging give you that print statements don't?
2. What is a health check, and when do you run it?
3. Which kind of failure is worth retrying: a network blip or bad input? Why?
4. Why does `record_success()` reset the failure counter?
5. Why break things on purpose during testing?

*Answers: 1) Each entry has a timestamp and a severity level and is saved to a file, so you can reconstruct what happened later. 2) A lightweight test that a dependency like an API is reachable and working; you run it before the real workflow. 3) A network blip, because it is temporary and often succeeds on a retry; bad input will fail every time. 4) So the alert fires only for failures in a row, which signal a real problem, not for occasional isolated ones. 5) To prove your logging, retries, and alerts actually work before a real failure happens while nobody is watching.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "pulse",
   "kicker": "Project 6 · Monitoring and error handling",
   "title": "Safe to run unattended",
   "beats": [
    {
     "say": "Welcome to the last project."
    },
    {
     "say": "You'll make your agent and earlier workflows production-safe: reliable enough to trust running while nobody is watching."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Steps 2 and 3",
   "title": "Structured logging tells the story",
   "columns": [
    "time",
    "level",
    "message"
   ],
   "rows": [
    [
     "09:00:01,102",
     "INFO",
     "Workflow started"
    ],
    [
     "09:00:02,418",
     "INFO",
     "urgent=False, item 1"
    ],
    [
     "09:00:03,977",
     "INFO",
     "urgent=True, item 3"
    ],
    [
     "09:00:09,530",
     "INFO",
     "tool: create_task"
    ],
    [
     "09:00:12,061",
     "ERROR",
     "Health check failed"
    ]
   ],
   "beats": [
    {
     "say": "Structured logging writes every event to automation dot log, in the same format.",
     "sql": "format=\"%(asctime)s %(levelname)s %(message)s\""
    },
    {
     "say": "Each line starts with the date and time. Here we show just the time.",
     "col": 0
    },
    {
     "say": "Then a severity level: info, warning, or error.",
     "col": 1
    },
    {
     "say": "Then the message. Unlike a print statement, it's saved to a file, so you can reconstruct what happened later.",
     "col": 2
    },
    {
     "say": "Log every key decision. For example: what the A I decided for each item.",
     "sql": "logging.info(f\"AI decided: urgent={urgent} for item {data['id']}\")",
     "hl": [
      1,
      2
     ],
     "dim": true
    },
    {
     "say": "And which tool the agent selected, with its input.",
     "sql": "logging.info(f\"Agent selected tool: {name} with input {args}\")",
     "hl": 3,
     "dim": true
    },
    {
     "say": "Problems stand out by level, so you can search for them.",
     "hl": 4,
     "dim": true,
     "col": 1
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Step 4",
   "title": "Health check first, then the real run",
   "nodes": [
    {
     "id": "hc",
     "label": "health_check()",
     "x": 14,
     "y": 50,
     "sub": "max_tokens: 1",
     "art": "pulse"
    },
    {
     "id": "api",
     "label": "Claude API",
     "x": 50,
     "y": 16,
     "sub": "the dependency",
     "art": "cloud"
    },
    {
     "id": "wf",
     "label": "Real workflow",
     "x": 86,
     "y": 50,
     "sub": "the urgency check",
     "art": "gear"
    },
    {
     "id": "log",
     "label": "automation.log",
     "x": 50,
     "y": 84,
     "sub": "ERROR lines",
     "art": "doc"
    }
   ],
   "edges": [
    {
     "from": "hc",
     "to": "api"
    },
    {
     "from": "hc",
     "to": "wf"
    },
    {
     "from": "hc",
     "to": "log"
    }
   ],
   "beats": [
    {
     "say": "A health check is a lightweight test that a dependency is reachable, before the real workflow runs.",
     "show": 4,
     "on": "hc"
    },
    {
     "say": "It sends Claude a tiny request, ping, and asks for just one token, so it costs almost nothing.",
     "on": "api",
     "send": {
      "from": "hc",
      "to": "api",
      "label": "ping · 1 token"
     }
    },
    {
     "say": "Status two hundred means healthy.",
     "on": "hc",
     "send": {
      "from": "api",
      "to": "hc",
      "label": "200"
     }
    },
    {
     "say": "So the real workflow is allowed to run.",
     "on": "wf",
     "send": {
      "from": "hc",
      "to": "wf",
      "label": "go"
     }
    },
    {
     "say": "If the A P I is down or the key is wrong, health check returns False instead.",
     "on": "hc",
     "send": {
      "from": "api",
      "to": "hc",
      "label": "401"
     }
    },
    {
     "say": "The run is skipped, and an error line in the log says why.",
     "on": "log",
     "send": {
      "from": "hc",
      "to": "log",
      "label": "Skipping run"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Step 5",
   "title": "Retry only what's worth retrying",
   "file": "call_with_retry",
   "code": "def call_with_retry(func, *args, retries=3, delay=2):\n    for attempt in range(retries):\n        try:\n            return func(*args)\n        except requests.HTTPError as e:\n            code = e.response.status_code\n            if code < 500 and code != 429:\n                raise  # permanent error\n            logging.warning(...)  # Attempt n of 3\n        except requests.RequestException as e:\n            logging.warning(...)  # network, timeout\n        if attempt < retries - 1:\n            time.sleep(delay)\n    raise RuntimeError(f\"All {retries} retries failed\")",
   "beats": [
    {
     "say": "Call with retry wraps is urgent, with up to three attempts.",
     "line": 1,
     "vars": {
      "func": "is_urgent",
      "retries": 3,
      "delay": 2
     }
    },
    {
     "say": "Attempt one: say the A P I answers four twenty nine, too many requests.",
     "line": [
      2,
      4,
      5
     ],
     "vars": {
      "attempt": 0,
      "code": 429
     }
    },
    {
     "say": "Four twenty nine is a rate limit, which is temporary. So no raise: log a warning.",
     "line": [
      6,
      7,
      9
     ],
     "out": "WARNING Attempt 1 of 3 failed: 429 Client Error: Too Many Requests …"
    },
    {
     "say": "Wait two seconds, and go around again.",
     "line": [
      12,
      13
     ]
    },
    {
     "say": "Attempt two succeeds, and the answer, True, is returned.",
     "line": [
      2,
      4
     ],
     "vars": {
      "attempt": 1
     },
     "out": "→ returns True"
    },
    {
     "say": "Now a fresh call, with a wrong key.",
     "line": 1,
     "vars": null
    },
    {
     "say": "Status four oh one. That's below five hundred, and not four twenty nine.",
     "line": [
      5,
      6,
      7
     ],
     "vars": {
      "attempt": 0,
      "code": 401
     }
    },
    {
     "say": "A permanent error, so it's raised straight away. Retrying won't help.",
     "line": 8,
     "out": "→ raises 401 Client Error: Unauthorized"
    },
    {
     "say": "Last, say the network is down. Each attempt logs a warning, then waits and tries again.",
     "line": [
      10,
      11,
      12,
      13
     ],
     "vars": null
    },
    {
     "say": "After the third attempt there's no more waiting. The loop runs out, and it gives up.",
     "line": [
      12,
      14
     ],
     "vars": {
      "attempt": 2
     },
     "out": "→ RuntimeError: All 3 retries failed"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Step 6",
   "title": "Alert only on failures in a row",
   "values": [
    "ok",
    "fail",
    "fail",
    "ok",
    "fail",
    "fail",
    "fail"
   ],
   "beats": [
    {
     "say": "Here are seven calls to monitored is urgent, some succeeding, some failing. The counter starts at zero.",
     "note": "consecutive_failures = 0"
    },
    {
     "say": "Call one succeeds. Record success keeps the counter at zero.",
     "ok": [
      0
     ],
     "ptr": {
      "call": 0
     },
     "note": "consecutive_failures = 0"
    },
    {
     "say": "Calls two and three fail. The counter climbs to two. No alert yet.",
     "ok": [
      0
     ],
     "hl": [
      1,
      2
     ],
     "ptr": {
      "call": 2
     },
     "note": "consecutive_failures = 2"
    },
    {
     "say": "Call four succeeds, and record success resets the counter to zero.",
     "ok": [
      0,
      3
     ],
     "gone": [
      1,
      2
     ],
     "ptr": {
      "call": 3
     },
     "note": "consecutive_failures = 0"
    },
    {
     "say": "Calls five, six and seven fail in a row.",
     "ok": [
      0,
      3
     ],
     "gone": [
      1,
      2
     ],
     "hl": [
      4,
      5,
      6
     ],
     "ptr": {
      "call": 6
     },
     "note": "consecutive_failures = 3"
    },
    {
     "say": "Three in a row: record failure logs an alert. Each failed call still returns the safe default, not urgent.",
     "ok": [
      0,
      3
     ],
     "gone": [
      1,
      2
     ],
     "hl": [
      4,
      5,
      6
     ],
     "ptr": {
      "call": 6
     },
     "note": "ERROR ALERT: 3 consecutive failures, needs attention"
    },
    {
     "say": "Because of the reset, two scattered failures never trigger it. Only a real run of trouble does.",
     "ok": [
      0,
      3
     ],
     "hl": [
      1,
      2
     ],
     "note": "isolated failures: no alert"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Steps 7 and 8",
   "title": "Break it on purpose, then read the log",
   "columns": [
    "call",
    "level",
    "message"
   ],
   "rows": [
    [
     "1",
     "ERROR",
     "AI decision failed…"
    ],
    [
     "2",
     "ERROR",
     "AI decision failed…"
    ],
    [
     "3",
     "ERROR",
     "AI decision failed…"
    ],
    [
     "3",
     "ERROR",
     "ALERT: 3 consecutive…"
    ]
   ],
   "beats": [
    {
     "say": "Now test deliberately. Set a wrong key, and call the monitored function three times.",
     "sql": "os.environ[\"ANTHROPIC_API_KEY\"] = \"wrong-key\""
    },
    {
     "say": "Each call fails with a four oh one, and logs an error line.",
     "hl": [
      0,
      1,
      2
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "After the third, the alert line appears.",
     "hl": 3,
     "dim": true,
     "col": 2
    },
    {
     "say": "Notice there are no warning lines. A wrong key is a permanent error, so nothing was retried.",
     "col": 1
    },
    {
     "say": "Read it with cat automation dot log, and check it tells a clear story. Then restore your real key.",
     "sql": "!cat automation.log",
     "hl": [
      0,
      1,
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
   "title": "Which kind of failure is worth retrying?",
   "options": [
    "Bad input, because it might work next time",
    "A wrong A P I key",
    "A network blip, because it's temporary and often succeeds on a retry"
   ],
   "answer": 2,
   "good": "That's right. A network blip is temporary and often succeeds on a retry. Bad input will fail every time.",
   "bad": "Not quite. A network blip is temporary and often succeeds on a retry. Bad input will fail every time.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Which kind of failure is worth retrying?",
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
     "Monitored and retry-capable",
     ""
    ],
    [
     "Tested errors, readable logs",
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
     "say": "you have a monitored, retry-capable automation,",
     "show": 1
    },
    {
     "say": "with tested error handling and a readable log trail.",
     "show": 2
    },
    {
     "say": "You've finished A I Automation Engineer. Well done.",
     "show": 2
    }
   ]
  }
 ]
}
```
