<!-- order: 28 -->
# AI Governance and Responsible AI Engineer — Advanced Module: EU AI Act Compliance

This is a bonus, advanced module extending the **AI Governance and Responsible AI Engineer Foundations Course**. It covers the specific regulatory framework reshaping this field in 2026: the **EU AI Act** (Regulation (EU) 2024/1689) — the world's first comprehensive, binding AI regulation, with extraterritorial reach to any organization whose AI system or output touches people in the EU, regardless of where the company is headquartered. Complete the 7 projects of the main course first — this module turns your Project 1 risk overview, Project 4 bias evaluation, and Project 6 model card into artifacts mapped directly to real legal obligations.

**A note on currency:** the EU has amended the AI Act. The **AI Omnibus**, an amending regulation proposed by the European Commission in November 2025, was published in the Official Journal on 24 July 2026 and entered into force on 27 July 2026. It postponed the application dates for high-risk obligations, so the amended timelines now apply rather than the Act's original 2026 dates. Prohibited practices and general-purpose AI (GPAI) obligations were already in force before the amendment. For exact dates, check the official consolidated text of Regulation (EU) 2024/1689 on [EUR-Lex](https://eur-lex.europa.eu), since timelines can change again.

Every step follows the same format as the rest of the course: what you're doing, what the term means, how to do it, and why it matters. **This course is educational, not legal advice.** Consult qualified legal counsel for actual compliance decisions.


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

## Project 8 (Bonus Module 1): Classify an AI System's EU AI Act Risk Tier

**Time: about 2 hours**

**Goal:** Learn to determine which of the Act's four risk tiers an AI system falls into — the single most consequential classification decision in EU AI Act compliance, since it determines every obligation that follows.

### Why This Project Matters

Misclassifying a system's risk tier is one of the most common and costly compliance mistakes organizations make — either overspending on unnecessary compliance work, or worse, missing obligations and risking fines. The Act sets maximum fines in tiers, each "whichever is higher" of a fixed amount or a share of worldwide annual turnover (smaller companies get lower caps):

- **Prohibited practices (Article 5):** up to €35 million or 7% of worldwide annual turnover.
- **Most other obligations, including high-risk requirements:** up to €15 million or 3%.
- **Supplying incorrect, incomplete, or misleading information to authorities:** up to €7.5 million or 1%.

This project builds the classification skill directly.

**Step 1 — Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `eu_ai_act_classification_project`.
Copy in `risk_overview.md` from Project 1.
*Why:* Your existing risk overview is a natural starting point — EU AI Act classification builds on the same "what could go wrong" thinking, applied to a specific legal framework.

**Step 2 — Learn the four risk tiers.**
Add a **text cell** headed `risk_tiers` and write your notes in it.
Learn: **unacceptable risk** (banned outright — e.g., social scoring, manipulative AI exploiting vulnerabilities); **high risk** (heavily regulated — AI used in areas like employment, credit scoring, law enforcement, education, and critical infrastructure); **limited risk** (transparency obligations only — e.g., chatbots must disclose they're AI); **minimal risk** (largely unregulated — e.g., spam filters, AI-enabled video games).
*Why:* Every subsequent obligation in this module depends entirely on which tier applies — get this wrong and everything built on top of it is misdirected effort.

**Step 3 — Check for prohibited practices first.**
Learn: **Article 5** bans specific practices outright, including social scoring by public or private actors (not just governments), emotion recognition in workplaces and education settings (except for medical or safety reasons), AI exploiting vulnerabilities of children or people with disabilities to cause harm, real-time remote biometric identification in public spaces by law enforcement (with narrow exceptions), and untargeted scraping of facial images to build recognition databases.
Add a **text cell** headed `prohibited_practice_check` and write your notes in it.
Using your Project 1 example system, confirm it doesn't fall into any prohibited category.
*Why:* This check comes first because unacceptable-risk systems can't be brought into compliance at all — they simply can't be deployed, so there's no point classifying further if this applies.

**Step 4 — Check Annex III high-risk categories.**
Learn: **Annex III** lists specific high-risk use cases — including biometrics, critical infrastructure, education and vocational training, employment and worker management, access to essential services, law enforcement, migration/border control, and administration of justice.
Add a **text cell** headed `annex_iii_check` and write your notes in it.
For your example system (e.g., a resume-screening tool from the original course), check it against each Annex III category.
*Why:* Employment and worker management is explicitly named in Annex III — a resume screener almost certainly qualifies as high-risk, which is exactly why this system was chosen as a running example throughout the original course.

**Step 5 — Understand the self-assessment exception.**
Learn: a provider whose system falls under an Annex III use case but believes it isn't actually high-risk (e.g., because it performs only a narrow procedural task or merely refines a human's prior work) must **document that assessment** before deployment, rather than simply asserting it informally.
*Why:* This exception exists, but it isn't a loophole to skip documentation — it requires its own written justification, which is itself a compliance artifact you need to produce and retain.

**Step 6 — Check for limited-risk transparency triggers.**
Learn: **limited risk** systems — chatbots, deepfake generators, emotion-recognition or biometric-categorization systems not otherwise prohibited — must disclose to users that they're interacting with AI, even if they don't qualify as high-risk.
*Why:* Many systems that aren't high-risk still carry this lighter-weight but still legally required transparency obligation — it's a separate check, not just "high-risk or nothing."

**Step 7 — Determine your provider vs. deployer role.**
Learn: a **provider** develops an AI system and places it on the market; a **deployer** uses an AI system under its own authority. The same organization can be both, for different systems — and providers carry the bulk of high-risk obligations, while deployers have narrower but still real duties (Article 26).
Add a **text cell** headed `role_determination` and write your notes in it.
For your example system, determine which role(s) apply.
*Why:* Every obligation in Projects 9–11 differs depending on whether you're building the system or just using someone else's — this determination shapes everything that follows.

**Step 8 — Write the classification memo.**
Add a **text cell** headed `classification_memo` and write your notes in it.
Structure: System description → Prohibited practice check (cleared) → Annex III analysis → Risk tier determination → Provider/deployer role → Reasoning.
*Why:* This memo is the foundational document every other artifact in this module (and in a real compliance program) references — it needs to stand on its own as a defensible, written determination.

### Final Project Structure
```text
eu_ai_act_classification_project/
│
├── risk_tiers.md
├── prohibited_practice_check.md
├── annex_iii_check.md
├── role_determination.md
├── classification_memo.md
```

### What You Learned
- ✅ The four EU AI Act risk tiers
- ✅ Checking for Article 5 prohibited practices first
- ✅ Annex III high-risk category analysis
- ✅ The self-assessment documentation exception
- ✅ Limited-risk transparency triggers
- ✅ Determining provider vs. deployer role
- ✅ Writing a defensible risk classification memo

### Portfolio Project
**EU AI Act Risk Classification** — Conducted a structured EU AI Act risk tier classification for an AI system, including prohibited-practice screening, Annex III analysis, and provider/deployer role determination, documented in a defensible memo.
**Skills:** AI Regulatory Compliance, EU AI Act, Risk Classification, Legal/Technical Translation, AI Governance.

**Deliverable:** A classification memo determining risk tier, applicable obligations track, and provider/deployer role for an AI system.

### Quiz

1. Why do you check for prohibited practices before anything else?
2. Is social scoring banned only when governments do it?
3. Why is a resume-screening tool likely high-risk?
4. What must a provider do if it believes its Annex III system is not actually high-risk?
5. What is the difference between a provider and a deployer?

*Answers: 1) A prohibited system can't be brought into compliance at all; it simply can't be deployed, so further classification is pointless. 2) No. The Act bans social scoring by public and private actors alike. 3) Employment and worker management is explicitly listed as a high-risk use case in Annex III. 4) Write down and keep a documented assessment explaining why, before deployment; it can't just assert it informally. 5) A provider develops a system and places it on the market; a deployer uses a system under its own authority. Providers carry most high-risk obligations.*

---

## Project 9 (Bonus Module 2): Map Obligations to Your System's Classification

**Time: about 2 hours**

**Goal:** Translate a risk tier and role determination (Project 8) into a concrete list of what you actually have to do — the step that turns classification into an actionable compliance plan.

### Why This Project Matters

Knowing a system is "high-risk" doesn't tell you what to build. The Act's high-risk obligations (concentrated in Articles 9–15) are specific and numerous — this project builds the skill of turning a legal article into an engineering and documentation checklist.

**Step 1 — Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `obligation_mapping_project`.
Copy in `classification_memo.md` from Project 8.
*Why:* This project's entire purpose is translating that classification into action — keep it close at hand.

**Step 2 — Learn the core high-risk provider obligations.**
Add a **text cell** headed `provider_obligations` and write your notes in it.
Learn: providers of high-risk systems must implement a **risk management system** (continuous, throughout the system's lifecycle), ensure **data governance** (training/validation/testing data must be relevant, representative, and as error-free as possible), produce **technical documentation**, build in **record-keeping** (automatic logging of relevant events), design for **human oversight**, achieve required **accuracy, robustness, and cybersecurity**, and establish a **quality management system**.
*Why:* This is the actual checklist Articles 9–15 require — each one maps to a specific project later in this module or the original course.

**Step 3 — Learn the core high-risk deployer obligations.**
Learn: under **Article 26**, deployers must use the system according to the provider's instructions, ensure human oversight during use, monitor the system's operation, keep logs the provider requires, and conduct a fundamental-rights impact assessment where required.
*Why:* Deployer duties are lighter than provider duties, but they're not nothing — an organization that only *uses* a high-risk AI system still has real, enforceable responsibilities.

**Step 4 — Cross-reference each obligation with existing course work.**
Add a **text cell** headed `obligation_crosswalk` and write your notes in it.
Build a table mapping each obligation to work you've already done:

| Obligation | Mapped to |
|---|---|
| Risk management system | Project 1 risk overview |
| Data governance | Project 3 dataset fairness audit |
| Technical documentation | Project 6 model card (extended in Project 10 below) |
| Human oversight design | Project 11 below |
| Record-keeping | Project 2 output logging, Project 7 monitoring dashboard |
| Bias/accuracy evaluation | Project 4 bias evaluation |

*Why:* This crosswalk proves something important: most of the *substance* of EU AI Act compliance is work you already know how to do — the regulation mostly asks you to formalize and document practices good responsible-AI engineers already follow.

**Step 5 — Identify gaps.**
For any obligation without a clear mapped artifact, note it explicitly.
*Why:* Honest gap identification is more valuable than a crosswalk that pretends everything is already covered — this is where your remaining compliance work actually needs to go.

**Step 6 — Learn about conformity assessment.**
Learn: a **conformity assessment** is the formal process (self-assessment for most Annex III systems, or third-party assessment for certain categories) that verifies a high-risk system meets all its obligations before being placed on the market.
*Why:* This is the actual "checkpoint" moment — everything in Steps 2–5 exists to be verifiable at conformity assessment time.

**Step 7 — Learn about CE marking and EU database registration.**
Learn: high-risk systems that pass conformity assessment receive **CE marking** (a formal declaration of compliance with EU requirements) and must be registered in the **EU high-risk AI systems database** before deployment.
*Why:* These are the final, formal steps that make a system's compliance status externally visible and verifiable — not just an internal document, but a public record.

**Step 8 — Write the obligation map.**
Add a **text cell** headed `obligation_map` and write your notes in it.
Structure: Classification recap (from Project 8) → Applicable obligations → Crosswalk to existing artifacts → Identified gaps → Path to conformity assessment.
*Why:* This document is your actual project plan for becoming compliant — it's what Projects 10 and 11 execute against.

### Final Project Structure
```text
obligation_mapping_project/
│
├── provider_obligations.md
├── obligation_crosswalk.md
├── obligation_map.md
```

### What You Learned
- ✅ Core high-risk provider obligations (Articles 9–15)
- ✅ Core high-risk deployer obligations (Article 26)
- ✅ Cross-referencing legal obligations to engineering artifacts
- ✅ Identifying genuine compliance gaps
- ✅ What a conformity assessment verifies
- ✅ CE marking and EU database registration

### Portfolio Project
**EU AI Act Obligation Mapping** — Translated a high-risk AI system classification into a concrete obligation checklist, cross-referenced against existing governance artifacts, with identified gaps and a path to conformity assessment.
**Skills:** Regulatory Compliance, AI Governance, Technical Documentation, EU AI Act.

**Deliverable:** An obligation map connecting legal requirements to concrete engineering and documentation artifacts, with identified gaps.

### Quiz

1. Name three obligations providers of high-risk systems must meet.
2. Do deployers of a high-risk system have obligations too?
3. What does the obligation crosswalk show?
4. What is a conformity assessment?

*Answers: 1) Any three of: risk management system, data governance, technical documentation, record-keeping, human oversight, accuracy/robustness/cybersecurity, and a quality management system. 2) Yes. Under Article 26 they must follow the provider's instructions, ensure human oversight, monitor operation, keep required logs, and do a fundamental-rights impact assessment where required. 3) Which existing course artifacts already cover each legal obligation, and where gaps remain. 4) The formal process, usually a self-assessment for Annex III systems, that verifies a high-risk system meets its obligations before it goes on the market.*

---

## Project 10 (Bonus Module 3): Build a Technical Documentation Package for a High-Risk System

**Time: about 2 hours**

**Goal:** Produce the actual documentation artifact Article 11 requires — extending your Project 6 model card into something that would satisfy a real regulatory review.

### Why This Project Matters

Your Project 6 model card was written for internal transparency. The EU AI Act's technical documentation requirement is more specific and more formal — this project builds the difference, so you understand what "good enough internally" and "compliant with a specific legal requirement" actually look like side by side.

**Step 1 — Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `technical_documentation_project`.
Copy in `model_card.md` from Project 6 and `fairness_audit_report.md` from Project 3.
*Why:* This project extends, rather than replaces, your existing documentation — reuse what's already validated.

**Step 2 — Learn what Article 11 technical documentation must include.**
Add a **text cell** headed `required_sections` and write your notes in it.
Learn the required sections: general system description and intended purpose, design specifications (architecture, algorithms, key design choices), data requirements and provenance, human oversight measures, performance metrics and known limitations, risk management measures, and change management/version history.
*Why:* This is a more prescriptive, legally specific structure than a typical internal model card — knowing the required sections is what lets you check for completeness systematically.

**Step 3 — Write the intended purpose section.**
Add a **text cell** headed `technical_documentation` and write your notes in it.
Expand your Project 1 use case description into a formal intended-purpose statement, including explicit statements of what the system is *not* intended for.
*Why:* Under the Act, using a system outside its documented intended purpose shifts responsibility in ways that matter — this section needs to be precise, not just descriptive.

**Step 4 — Document design specifications.**
Describe the system's architecture and key algorithmic choices, referencing your Project 4 bias evaluation's findings about model behavior.
*Why:* Regulators (and internal reviewers) need enough detail to understand *how* the system reaches its outputs, not just *that* it produces them.

**Step 5 — Document data governance, referencing Project 3.**
Incorporate your Project 3 dataset fairness audit directly — representation, known imbalances, and mitigation steps taken.
*Why:* Article 10's data governance requirements (relevant, representative, and error-free data) are exactly what your Project 3 audit was designed to evaluate — this is a direct reuse, not new work.

**Step 6 — Document human oversight measures.**
Describe specifically how a human can intervene, override, or stop the system — not just that "human oversight exists."
*Why:* Vague oversight claims ("a person reviews outputs") don't satisfy this requirement — the Act expects concrete mechanisms, which Project 11 will build directly.

**Step 7 — Document performance metrics and limitations honestly.**
Incorporate your Project 4 bias evaluation and Project 6 model card's limitations section, with specific numbers where available.
*Why:* Regulatory documentation that omits known weaknesses isn't just poor practice — it undermines the legal validity of the documentation itself if discovered later.

**Step 8 — Add version history and change management.**
Add a **text cell** headed `version_history` and write your notes in it.
Note the current version, what changed from any prior version, and your process for updating this documentation as the system evolves.
*Why:* The Act treats technical documentation as a living artifact tied to a specific system version — undocumented changes to a "compliant" system can invalidate that compliance.

### Final Project Structure
```text
technical_documentation_project/
│
├── required_sections.md
├── technical_documentation.md
├── version_history.md
```

### What You Learned
- ✅ Article 11's required technical documentation sections
- ✅ Writing a precise, legally-specific intended purpose statement
- ✅ Documenting design specifications for regulatory review
- ✅ Reusing dataset audits to satisfy data governance requirements
- ✅ Documenting concrete (not vague) human oversight measures
- ✅ Maintaining version history for a living compliance artifact

### Portfolio Project
**EU AI Act Technical Documentation Package** — Produced Article 11-compliant technical documentation for a high-risk AI system, incorporating existing bias evaluation and data governance findings, with version-controlled change management.
**Skills:** Regulatory Documentation, AI Governance, EU AI Act, Technical Writing.

**Deliverable:** A complete technical documentation package covering all required Article 11 sections.

### Quiz

1. How does Article 11 technical documentation differ from an internal model card?
2. Why must the intended purpose section say what the system is not meant for?
3. Why is "a person reviews outputs" not enough for the human oversight section?
4. Why keep a version history for the documentation?

*Answers: 1) It follows a more formal, legally specified set of required sections, so completeness can be checked against the law. 2) Using a system outside its documented purpose shifts responsibility, so the boundaries have to be precise. 3) The Act expects concrete mechanisms describing how a human can intervene, override, or stop the system. 4) The documentation is tied to a specific system version; undocumented changes can undermine the system's compliance.*

---

## Project 11 (Bonus Module 4): Implement Human Oversight and Conformity Assessment Readiness

**Time: about 3.5 hours**

**Goal:** Build the actual mechanisms — not just documentation about them — that let a human meaningfully oversee and intervene in a high-risk AI system, and prepare for conformity assessment.

### Why This Project Matters

Project 10 *described* human oversight. This project *builds* it — because "we have human oversight" needs to be a real, testable capability, not just a sentence in a document, especially given that regulators specifically look for evidence of operational controls, not just paperwork.

> **This project runs on your computer, not in a notebook.** It builds a small web app (an oversight dashboard), which a notebook can't host. Make a project folder on your computer, open it in VS Code, and save each code block as the file named in its step. Run the commands in your terminal. You need Python 3.12 or newer.

**Step 1 — Create the project folder.**
```bash
mkdir human_oversight_project
cd human_oversight_project
mkdir templates
pip install flask requests
```
Set your API key as an environment variable in the same terminal (never paste it into code). On Mac or Linux run `export ANTHROPIC_API_KEY="your-key-here"`. On Windows PowerShell run `$env:ANTHROPIC_API_KEY="your-key-here"`.
*Why:* Human oversight builds directly on the logging (Project 2) and monitoring (Project 7) ideas from the main course. This project rewrites those pieces into one self-contained folder so every name the code uses is defined here.

**Step 2 — Learn the categories of human oversight the Act expects.**
Create a file named `oversight_requirements.md` and write your notes in it.
Learn: effective oversight typically includes the ability to **fully understand** system outputs, **monitor operation** for anomalies, **intervene or interrupt** the system's operation, and **override or disregard** its output when appropriate.
*Why:* These four categories are specific, checkable capabilities — "human oversight exists" as a vague claim doesn't map to any of them individually, which is exactly the gap this project closes.

**Step 3 — Build the foundations: logging and the model call.**
Create `oversight_controls.py` with the code below. `log_event` writes every oversight-relevant event to `oversight_log.jsonl`, the same JSONL approach as Project 2. `call_model` sends the system's standing instructions as the top-level `system` field. `SystemHaltedError` is the error the system raises after an emergency stop.
```python
import datetime
import json
import os

import requests

LOG_FILE = "oversight_log.jsonl"

SYSTEM_PROMPT = (
    "You help a recruiter screen job applications for a software engineer role. "
    "Recommend ADVANCE or REJECT, followed by one sentence of job-related reasoning. "
    "Never use age, gender, race, disability, or other protected characteristics."
)


class SystemHaltedError(Exception):
    """Raised when someone tries to use the system after an emergency stop."""


def log_event(event_type, details, log_file=LOG_FILE):
    entry = {
        "timestamp": str(datetime.datetime.now()),
        "event_type": event_type,
        "details": details,
    }
    with open(log_file, "a") as f:
        f.write(json.dumps(entry) + "\n")


def call_model(prompt):
    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": os.environ["ANTHROPIC_API_KEY"],
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": "claude-sonnet-5-5",
            "max_tokens": 200,
            "system": SYSTEM_PROMPT,
            "messages": [{"role": "user", "content": prompt}],
        },
    )
    response.raise_for_status()
    return response.json()["content"][0]["text"]

```
*Why:* Automatic logging supports Article 12's record-keeping requirement: oversight events are captured as they happen, instead of relying on someone to remember to write them down. Logging alone doesn't make a system compliant, but it is the evidence everything else depends on.

**Step 4 — Implement an override mechanism.**
Add this code to the end of `oversight_controls.py`.
```python
def get_model_recommendation(candidate_data, model_fn=call_model):
    check_before_running()  # refuses to run after an emergency stop (Step 5)
    recommendation = model_fn(candidate_data)
    decision = {
        "candidate_data": candidate_data,
        "recommendation": recommendation,
        "overridden": False,
        "override_reason": None,
    }
    log_event("RECOMMENDATION", decision)
    return decision


def human_override(decision, new_outcome, reason, reviewer):
    decision["original_recommendation"] = decision["recommendation"]
    decision["recommendation"] = new_outcome
    decision["overridden"] = True
    decision["override_reason"] = reason
    decision["reviewer"] = reviewer
    log_event("OVERRIDE", decision)
    return decision
```
`model_fn` lets you swap in a stand-in model for testing (Step 7). In normal use it calls Claude.
*Why:* This is a concrete, working override capability — a human reviewer can change the system's output, the original recommendation is kept, and the change is tracked with a reason and a reviewer name, not silently absorbed.

**Step 5 — Implement a stop/interrupt mechanism.**
Add this code to the end of `oversight_controls.py` as well.
```python
system_active = True


def emergency_stop(reason, reviewer):
    global system_active
    system_active = False
    log_event("EMERGENCY_STOP", {"reason": reason, "reviewer": reviewer})


def reactivate(reason, reviewer):
    global system_active
    system_active = True
    log_event("REACTIVATED", {"reason": reason, "reviewer": reviewer})


def check_before_running():
    if not system_active:
        raise SystemHaltedError("System has been manually stopped for review.")
```
This simple version keeps the on/off switch in memory, so it only applies while one Python process is running. A real system would store it somewhere shared, such as a database, so every part of the system sees the stop.
*Why:* The ability to halt the system entirely, not just override individual decisions, is a distinct and necessary oversight capability — especially if a systemic problem is discovered, not just an individual bad output. Reactivation is logged too, so there's a record of who restarted the system and why.

**Step 6 — Build an oversight view.**
Save this as `app.py`. It is a Flask app like your Project 7 dashboard, with its own `app` object and an `/oversight` page.
```python
import json
import os

from flask import Flask, render_template

app = Flask(__name__)
LOG_FILE = "oversight_log.jsonl"


def read_events():
    if not os.path.exists(LOG_FILE):
        return []
    with open(LOG_FILE) as f:
        return [json.loads(line) for line in f if line.strip()]


@app.route("/oversight")
def oversight_view():
    events = read_events()
    recommendations = sum(1 for e in events if e["event_type"] == "RECOMMENDATION")
    overrides = sum(1 for e in events if e["event_type"] == "OVERRIDE")
    override_rate = overrides / recommendations if recommendations else 0
    return render_template(
        "oversight.html",
        recommendations=recommendations,
        override_count=overrides,
        override_rate=f"{override_rate:.0%}",
        events=list(reversed(events)),  # newest first
    )


if __name__ == "__main__":
    app.run(debug=True)
```
Save this as `templates/oversight.html`:
```html
<h1>Human Oversight</h1>
<p>Recommendations made: {{ recommendations }}</p>
<p>Human overrides: {{ override_count }} ({{ override_rate }})</p>
<h2>Event log (newest first)</h2>
<ul>
  {% for e in events %}
    <li><strong>{{ e.event_type }}</strong> at {{ e.timestamp }}: {{ e.details }}</li>
  {% endfor %}
</ul>
```
*Why:* A high or rising override rate is itself a meaningful signal — it might indicate the underlying model is degrading in ways that need investigation, which is exactly the kind of monitoring Article 26 expects from deployers.

**Step 7 — Test the full oversight loop.**
Save this as `test_oversight.py`. It uses a stand-in model, so it makes no API calls and costs nothing.
```python
import oversight_controls as oc


def fake_model(prompt):
    # Stand-in for the real model so this test costs nothing and gives the same answer every time.
    return "REJECT. Fewer years of experience than the role asks for."


# 1. The system makes a recommendation.
decision = oc.get_model_recommendation(
    "Candidate: 4 years Python, led two backend projects.", model_fn=fake_model
)
print("Model said:", decision["recommendation"])

# 2. A human overrides it with a documented reason.
decision = oc.human_override(
    decision, "ADVANCE", "Led two backend projects, which meets the bar.", reviewer="Reviewer A"
)
print("After override:", decision["recommendation"])

# 3. Emergency stop: the system must refuse new work.
oc.emergency_stop("Override rate spiked; investigating.", reviewer="Reviewer A")
try:
    oc.get_model_recommendation("Another candidate", model_fn=fake_model)
    print("FAIL: system ran while stopped")
except oc.SystemHaltedError as err:
    print("PASS: system refused to run:", err)

# 4. Reactivate and confirm it works again.
oc.reactivate("Investigation complete.", reviewer="Reviewer A")
oc.get_model_recommendation("Another candidate", model_fn=fake_model)
print("PASS: system runs again after reactivation")
```
Run it, then start the dashboard:
```bash
python test_oversight.py
python app.py
```
Open http://127.0.0.1:5000/oversight in your browser and confirm the recommendation, override, stop, and reactivation events all appear. Press **Ctrl + C** in the terminal to stop the app. To try a real recommendation from Claude, call `get_model_recommendation("...candidate summary...")` without `model_fn`.
*Why:* Testing this end-to-end is what proves oversight is a real, working capability — not just code that looks right but has never actually been exercised.

**Step 8 — Write a conformity assessment readiness checklist.**
Create a file named `conformity_readiness_checklist.md` and write your notes in it.
Combine artifacts from Projects 8–11: classification memo complete, obligation map complete, technical documentation complete, human oversight mechanisms built and tested, data governance audit complete, bias evaluation complete.
*Why:* This checklist is what an organization would actually walk through before either self-assessing conformity or engaging a third-party assessor — the final, practical output of this entire advanced module.

### Final Project Structure
```text
human_oversight_project/
│
├── oversight_requirements.md
├── oversight_controls.py
├── app.py
├── test_oversight.py
├── oversight_log.jsonl
├── templates/oversight.html
├── conformity_readiness_checklist.md
```

### What You Learned
- ✅ The four categories of effective human oversight
- ✅ Implementing a working override mechanism with logging
- ✅ Implementing an emergency stop/interrupt mechanism
- ✅ Extending existing logging for oversight-specific record-keeping
- ✅ Building an oversight monitoring view
- ✅ Testing the full oversight loop end-to-end
- ✅ Assembling a conformity assessment readiness checklist

### Portfolio Project
**EU AI Act Human Oversight Implementation** — Built and tested working human oversight mechanisms (override and emergency stop) with dedicated audit logging and monitoring, culminating in a conformity assessment readiness checklist.
**Skills:** AI Governance, EU AI Act, Human-in-the-Loop Systems, Python, Regulatory Compliance.

**Deliverable:** Tested override and stop mechanisms with oversight-specific logging, plus a complete conformity assessment readiness checklist.

### Quiz

1. Why does this project run on your computer instead of in Colab?
2. What is the difference between an override and an emergency stop?
3. Why does human_override keep the original recommendation and a reviewer name?
4. Does automatic event logging by itself make a system compliant with Article 12?
5. Why does test_oversight.py use a stand-in model?

*Answers: 1) It builds a Flask web app (the oversight dashboard), which needs to keep running and can't be hosted in a notebook. 2) An override changes one decision; an emergency stop halts the whole system until a human reactivates it. 3) So the record shows what the model said, what the human changed, who changed it, and why. 4) No. It supports the record-keeping requirement by providing evidence, but compliance depends on the whole system and process. 5) It tests the oversight logic without API calls, so it is free and gives the same result every run.*

---

## Advanced Module Summary

These four bonus projects extend the responsible-AI audit work from the main course with the specific regulatory framework now driving real AI governance work in the EU and for any organization touching EU users:

| Project | Core Skill | Extends |
|---|---|---|
| 8. Risk Classification | EU AI Act tier and role determination | Project 1 (risk overview) |
| 9. Obligation Mapping | Translating law into engineering checklists | Projects 1, 3, 4, 6 |
| 10. Technical Documentation | Article 11-compliant documentation | Project 6 (model card) |
| 11. Human Oversight | Working oversight mechanisms + readiness | Projects 2 & 7 (logging, monitoring) |

**Reminder:** this module reflects the AI Act as amended by the AI Omnibus, which entered into force on 27 July 2026. Always check current obligations and dates against the official consolidated text on [EUR-Lex](https://eur-lex.europa.eu) and with qualified legal counsel before treating any compliance work as complete. This course is educational, not legal advice.

### Updated Portfolio Project
**EU AI Act Compliance Program (Advanced)** — Built a complete EU AI Act compliance workflow for a high-risk AI system: risk classification, obligation mapping, Article 11 technical documentation, and tested human oversight mechanisms, culminating in a conformity assessment readiness checklist.
**Skills:** EU AI Act, Regulatory Compliance, AI Governance, Human-in-the-Loop Systems, Technical Documentation.
