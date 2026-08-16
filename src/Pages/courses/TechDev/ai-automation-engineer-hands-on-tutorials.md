# AI Automation Engineer: Hands-On Project Tutorials

This document turns every project in the **AI Automation Engineer Foundations Course** into a step-by-step, hands-on tutorial. You learn each idea at the moment you need it, while building the thing.

Follow the projects in order. Each one hands off a skill or artifact to the next, ending in the Final Capstone.

---

## Project 1 (Module 1): Map an Automation Opportunity in a Workflow

**Goal:** Identify what's actually worth automating, before writing a single line of automation code.

**Step 1: Set up a project folder.**
```bash
mkdir automation_opportunity_project
cd automation_opportunity_project
```

**Step 2: Pick a real, repetitive workflow.**
Example: "Every morning, someone manually checks a shared inbox, copies new leads into a spreadsheet, and emails a summary to the sales team."

**Step 3: Map the workflow step by step.**
```bash
nano workflow_map.md
```
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
```bash
nano opportunity_summary.md
```
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

---

## Project 2 (Module 2): Build a Scheduled Automation Script

**Goal:** Build the smallest possible working automation, a script that runs on its own, on a schedule, without you triggering it manually.

**Step 1: Set up a project folder.**
```bash
mkdir scheduled_automation_project
cd scheduled_automation_project
```

**Step 2: Write the smallest useful script.**
```bash
nano check_task.py
```
```python
import datetime

with open("log.txt", "a") as f:
    f.write(f"Ran at {datetime.datetime.now()}\n")
```

**Step 3: Test it manually first.**
```bash
python3 check_task.py
cat log.txt
```

**Step 4: Add real logic based on your Project 1 workflow.**
Replace the placeholder logic with something that actually checks or does something relevant (e.g., checking a file for new entries).

**Step 5: Add error handling.**
```python
try:
    # your automation logic
    pass
except Exception as e:
    with open("log.txt", "a") as f:
        f.write(f"ERROR at {datetime.datetime.now()}: {e}\n")
```
Wrapping logic in a **try/except** block means the script logs a failure instead of crashing silently.

**Step 6: Schedule the script.**
```bash
crontab -e
```
Add:
```bash
0 8 * * * /usr/bin/python3 /path/scheduled_automation_project/check_task.py
```
This cron syntax runs the script every day at 8:00 AM.

**Step 7: Verify it ran without you.**
Check `log.txt` the next day (or set a shorter test interval, e.g., every 5 minutes) to confirm it executed on schedule.

**Step 8: Document how to modify the schedule.**
```bash
nano README.md
```
Note the cron syntax used and how someone else could change the timing.

### Final Project Structure
```text
scheduled_automation_project/
│
├── check_task.py
├── log.txt
├── README.md
```

### What You Learned
- ✅ Writing a minimal, testable automation script
- ✅ Testing manually before scheduling
- ✅ Adding error handling that logs failures
- ✅ Scheduling a script with cron
- ✅ Verifying scheduled execution without manual triggering
- ✅ Documenting an automation for future maintainers

### Portfolio Project
**Scheduled Automation Script**: Built and scheduled a Python automation script with error handling and logging, verified to run reliably without manual intervention.
**Skills:** Python, Cron Scheduling, Error Handling, Automation Engineering.

**Deliverable:** A scheduled script, verified to run automatically, with logging and error handling.

---

## Project 3 (Module 3): Build a Multi-Step Automated Workflow

**Goal:** Chain multiple steps and integrations together, moving from a single script to a real workflow.

**Step 1: Set up a project folder.**
```bash
mkdir multistep_workflow_project
cd multistep_workflow_project
```

**Step 2: Break your Project 1 workflow into discrete steps.**
```bash
nano workflow_steps.md
```
List each step as its own numbered item (e.g., "1. Check inbox for new emails, 2. Extract lead info, 3. Add to spreadsheet, 4. Send summary email").

**Step 3: Understand what a webhook is.**
A **webhook** is a way for one system to notify another automatically when something happens, by sending an HTTP request to a specified URL, instead of the receiving system having to constantly check.

**Step 4: Write each step as a function.**
```bash
nano workflow.py
```
```python
def check_for_new_items(source):
    ...
    return new_items

def extract_data(item):
    ...
    return extracted

def save_to_destination(data):
    ...

def send_notification(summary):
    ...
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

**Step 6: Add error handling per step.**
Wrap each function call in `run_workflow()` with try/except, logging which step failed if something breaks.

**Step 7: Test with realistic multi-item input.**
Run the workflow against a batch of at least 5 test items, including at least one that should trigger an edge case from Project 1.

**Step 8: Document the workflow.**
```bash
nano README.md
```
Diagram or describe the step sequence, referencing your Project 1 workflow map.

### Final Project Structure
```text
multistep_workflow_project/
│
├── workflow_steps.md
├── workflow.py
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

---

## Project 4 (Module 4): Add an AI Decision Step to an Existing Workflow

**Goal:** Add an LLM-driven decision into your Project 3 workflow, the point where automation stops being purely rule-based.

**Step 1: Set up a project folder.**
```bash
mkdir ai_decision_step_project
cd ai_decision_step_project
```
Copy in `workflow.py` from Project 3.

**Step 2: Identify where a rule-based check falls short.**
Revisit your Project 1 edge cases: which ones require judgment a simple rule can't capture (e.g., "does this message sound urgent")?

**Step 3: Design the AI decision as a single, narrow question.**
Write the exact question you want the AI to answer for this one step (e.g., "Is this customer message urgent? Answer only 'yes' or 'no'.").

**Step 4: Implement the AI decision step.**
```bash
nano ai_decision.py
```
```python
import requests

def is_urgent(message_text):
    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={"x-api-key": "YOUR_KEY", "content-type": "application/json"},
        json={
            "model": "claude-sonnet-4-6",
            "max_tokens": 5,
            "messages": [{"role": "user", "content": f"Is this message urgent? Answer only yes or no.\n\n{message_text}"}]
        }
    )
    answer = response.json()["content"][0]["text"].strip().lower()
    return answer == "yes"
```
Keeping `max_tokens` small forces a short, structured answer that's easy to parse programmatically.

**Step 5: Wire the decision into your Project 3 workflow.**
```python
def run_workflow():
    items = check_for_new_items(source)
    for item in items:
        data = extract_data(item)
        if is_urgent(data["message"]):
            send_notification(f"URGENT: {data['message']}")
        save_to_destination(data)
```

**Step 6: Add a fallback for AI failures.**
```python
try:
    urgent = is_urgent(data["message"])
except Exception:
    urgent = False  # safe default
```
A **fallback** is a safe default behavior used when a step can't be completed normally.

**Step 7: Test with ambiguous cases.**
Run the workflow against messages that are clearly urgent, clearly not, and genuinely ambiguous, and review the AI's decisions.

**Step 8: Document the AI decision's role and limitations.**
```bash
nano ai_decision_notes.md
```
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

---

## Project 5 (Module 5): Build a Simple Task-Automation Agent

**Goal:** Replace fixed logic with agent-style tool calling, letting the AI decide *which* action to take, not just answer one narrow question.

**Step 1: Set up a project folder.**
```bash
mkdir task_agent_project
cd task_agent_project
```

**Step 2: Understand what tool calling is.**
**tool calling** lets an LLM choose to invoke a specific function you've defined, with arguments it decides based on the input, instead of just returning text.

**Step 3: Define 2–3 simple tools.**
```bash
nano tools.py
```
```python
def send_email(to, subject, body):
    print(f"Sending email to {to}: {subject}")

def create_task(title, priority):
    print(f"Creating task: {title} (priority: {priority})")

def log_note(text):
    print(f"Logging note: {text}")
```

**Step 4: Describe the tools to the model.**
```python
tool_definitions = [
    {"name": "send_email", "description": "Send an email to someone.", "parameters": {"to": "string", "subject": "string", "body": "string"}},
    {"name": "create_task", "description": "Create a to-do task.", "parameters": {"title": "string", "priority": "string"}},
    {"name": "log_note", "description": "Log a note for later reference.", "parameters": {"text": "string"}},
]
```
The model uses each tool's **description** to decide which one fits a given situation, accurate, specific descriptions directly affect how well it chooses.

**Step 5: Send a request with tool definitions and let the model choose.**
```python
response = requests.post(
    "https://api.anthropic.com/v1/messages",
    headers={"x-api-key": "YOUR_KEY", "content-type": "application/json"},
    json={
        "model": "claude-sonnet-4-6",
        "max_tokens": 300,
        "tools": tool_definitions,
        "messages": [{"role": "user", "content": "A customer emailed asking for a refund on order #4521."}]
    }
)
```

**Step 6: Parse and execute the chosen tool call.**
```python
for block in response.json()["content"]:
    if block["type"] == "tool_use":
        tool_name = block["name"]
        tool_args = block["input"]
        globals()[tool_name](**tool_args)
```

**Step 7: Test with varied inputs.**
Run the agent against 5 different situations that should trigger different tools (or no tool at all).

**Step 8: Add a human-in-the-loop check for risky actions.**
```python
if tool_name == "send_email":
    confirm = input(f"Confirm sending email to {tool_args['to']}? (y/n): ")
    if confirm.lower() == "y":
        send_email(**tool_args)
```
**human-in-the-loop** means a person confirms an action before it's actually executed, for higher-risk steps.

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
- ✅ Defining tools with clear, model-readable descriptions
- ✅ Letting an LLM choose which tool to invoke
- ✅ Parsing and executing a model's tool call
- ✅ Testing an agent across varied scenarios
- ✅ Adding human-in-the-loop confirmation for risky actions

### Portfolio Project
**Task-Automation Agent**: Built an LLM-based agent that chooses and executes actions from a defined toolset based on situational input, with human-in-the-loop confirmation for high-risk actions.
**Skills:** Agentic AI, Tool Calling, LLM APIs, Python, AI Automation Engineering.

**Deliverable:** A working tool-calling agent, tested across varied scenarios, with human confirmation for risky actions.

---

## Project 6 (Module 6): Add Monitoring and Error Handling

**Goal:** Make your Project 5 agent (and earlier workflows) production-safe, reliable enough to trust running unattended.

**Step 1: Set up a project folder.**
```bash
mkdir monitoring_project
cd monitoring_project
```
Copy in `agent.py` and `workflow.py` from earlier projects.

**Step 2: Add structured logging.**
```bash
nano monitored_automation.py
```
```python
import logging
logging.basicConfig(filename="automation.log", level=logging.INFO,
                     format="%(asctime)s %(levelname)s %(message)s")

logging.info("Workflow started")
```
**structured logging** records what happened, when, and at what severity level (INFO, WARNING, ERROR), instead of scattered print statements.

**Step 3: Log every key decision point.**
Add a log line every time your Project 4 AI decision or Project 5 agent chooses an action.
```python
logging.info(f"AI decided: urgent={is_urgent_result}")
logging.info(f"Agent selected tool: {tool_name}")
```

**Step 4: Add health check monitoring.**
```python
def health_check():
    try:
        # ping the AI API or database with a minimal request
        return True
    except Exception:
        return False
```
A **health check** is a lightweight test that confirms a dependency (API, database) is reachable before running the real workflow.

**Step 5: Add retry logic for transient failures.**
```python
import time

def call_with_retry(func, *args, retries=3, delay=2):
    for attempt in range(retries):
        try:
            return func(*args)
        except Exception as e:
            logging.warning(f"Attempt {attempt+1} failed: {e}")
            time.sleep(delay)
    raise Exception("All retries failed")
```
A **transient failure** is a temporary issue (network blip, rate limit) that often succeeds if retried, unlike a permanent failure (bad input) that won't.

**Step 6: Add alerting for repeated failures.**
```python
failure_count = 0

def record_failure():
    global failure_count
    failure_count += 1
    if failure_count >= 3:
        logging.error("ALERT: 3+ consecutive failures, needs attention")
```

**Step 7: Test failure scenarios deliberately.**
Temporarily break something (wrong API key, unreachable file path) and confirm your logs, retries, and alerts all behave as expected.

**Step 8: Review the log file after a full test run.**
```bash
cat automation.log
```
Confirm it tells a clear, readable story of what happened.

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

---

## Final Capstone: Build an End-to-End Automated Workflow

**Goal:** Combine every project above into one complete, reliable automation, this is an integration exercise, not a new build.

**Step 1: Set up your capstone project folder.**
```bash
mkdir capstone_project
cd capstone_project
```
Copy in the final versions of your code from Projects 2–6.

**Step 2: Start from your Project 1 opportunity map.**
Confirm the workflow you're automating in the capstone matches (or reasonably extends) your originally identified opportunity.

**Step 3: Build the multi-step workflow (Project 3).**
Chain the discrete steps from your workflow map into working functions.

**Step 4: Add the AI decision step (Project 4).**
Wire in the narrow, well-scoped AI judgment for whichever step needs it.

**Step 5: Add agentic tool selection where appropriate (Project 5).**
If your workflow benefits from the AI choosing between multiple possible actions, integrate your Project 5 agent pattern.

**Step 6: Add monitoring and error handling (Project 6).**
Wire in structured logging, retries, health checks, and failure alerting across the whole workflow.

**Step 7: Schedule the complete workflow (Project 2 skills).**
```bash
crontab -e
```
Add a cron entry running the full, integrated workflow on the schedule appropriate to your Project 1 use case.

**Step 8: Run an end-to-end test and review the logs.**
Trigger a full run (or wait for the schedule) and confirm the workflow completes, the AI steps behave as expected, and the log file tells a clear story.

**Step 9: Write the final automation document.**
```bash
nano capstone_summary.md
```
Combine your Project 1 opportunity summary, time savings estimate, architecture of the final workflow, and a log excerpt showing a successful run.

### Final Project Structure
```text
capstone_project/
│
├── opportunity_summary.md
├── workflow.py
├── ai_decision.py
├── agent.py
├── monitored_automation.py
├── automation.log
├── capstone_summary.md
```

### What You Learned
- ✅ Connecting opportunity assessment, workflow design, AI decisions, and monitoring into one system
- ✅ Scheduling a fully integrated, AI-augmented workflow
- ✅ Verifying end-to-end behavior through a real test run
- ✅ Reading and validating a complete log trail
- ✅ Documenting an automation for a real audience

### Portfolio Project
**End-to-End AI-Augmented Automation (Capstone)**: Built a complete automated workflow: identified from a real opportunity assessment, chaining multiple steps, incorporating an AI decision/agent step, and running reliably on a schedule with full monitoring and error handling.
**Skills:** Python, LLM APIs, Tool Calling, Workflow Automation, Reliability Engineering, AI Automation Engineering.

**Deliverable:** A live, scheduled, monitored, AI-augmented automation, plus a written summary connecting it back to every project that built it.
