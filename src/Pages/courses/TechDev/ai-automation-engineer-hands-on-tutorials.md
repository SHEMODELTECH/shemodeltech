<!-- order: 16 -->
# AI Automation Engineer: Hands-On Project Tutorials

This course is a series of hands-on projects. You learn each idea at the moment you need it, while building the thing.

Follow the projects in order. Each one hands off a skill or artifact to the next.


## Before you start: set up your notebook

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

---

## Project 2 (Module 2): Build a Scheduled Automation Script

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

---

## Project 3 (Module 3): Build a Multi-Step Automated Workflow

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

---

## Project 4 (Module 4): Add an AI Decision Step to an Existing Workflow

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
            send_notification(f"URGENT from {data['sender']}: {data['message']}")

        try:
            save_to_destination(data)
            processed += 1
        except Exception as e:
            print(f"FAILED at step 3 (save_to_destination) for item {item['id']}: {e}")
            failed += 1

    send_notification(f"Processed {processed} items, {failed} failed")

run_workflow()
```
With the Project 3 sample data, you should see one `URGENT` notification (the "dashboard down" message) before the summary.

**Step 7: Test with ambiguous cases.**
Add messages to `source` that are clearly urgent, clearly not, and genuinely ambiguous (e.g., "Could you look at this when you get a chance? The invoice seems wrong."). Give each a new `id`, run `run_workflow()` again, and review the AI's decisions.

**Step 8: Document the AI decision's role and limitations.**
Add a **text cell** headed `ai_decision_notes` and write your notes in it.
Note: what the AI decides, how confident you are in it, and what happens if it's wrong.

### Final Project Structure
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

---

## Project 5 (Module 5): Build a Simple Task-Automation Agent

**Goal:** Replace fixed logic with agent-style tool calling, letting the AI decide *which* action to take, not just answer one narrow question.

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

---

## Project 6 (Module 6): Add Monitoring and Error Handling

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

def call_with_retry(func, *args, retries=3, delay=2):
    for attempt in range(retries):
        try:
            return func(*args)
        except Exception as e:
            logging.warning(f"Attempt {attempt + 1} of {retries} failed: {e}")
            if attempt < retries - 1:
                time.sleep(delay)
    raise RuntimeError(f"All {retries} retries failed")
```
A **transient failure** is a temporary issue (network blip, rate limit) that often succeeds if retried, unlike a permanent failure (bad input) that won't.

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
Confirm it tells a clear, readable story of what happened: the warnings for each retry, the errors, and the ALERT line after the third failure.

### Final Project Structure
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
