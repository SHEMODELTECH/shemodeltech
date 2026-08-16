# AI Governance and Responsible AI Engineer — Advanced Module: EU AI Act Compliance

This is a bonus, advanced module extending the **AI Governance and Responsible AI Engineer Foundations Course**. It covers the specific regulatory framework reshaping this field in 2026: the **EU AI Act** (Regulation (EU) 2024/1689) — the world's first comprehensive, binding AI regulation, with extraterritorial reach to any organization whose AI system or output touches people in the EU, regardless of where the company is headquartered. Complete the original 8 projects first — this module turns your Project 1 risk overview, Project 4 bias evaluation, and Project 6 model card into artifacts mapped directly to real legal obligations.

**A note on currency:** the Act's high-risk deadlines were pushed back by the "Digital Omnibus" political agreement reached May 7, 2026 (formal adoption expected mid-2026) — Annex III (use-based) high-risk systems now have until **December 2, 2027**, and Annex I (product-embedded) systems until **August 2, 2028**. Prohibited practices and GPAI obligations are already in force. Always verify current deadlines against the official EU AI Act text before treating any date here as final — regulatory timelines can shift again.

Every step follows the same format as the rest of the course: what you're doing, what the term means, how to do it, and why it matters. **This module is educational, not legal advice — consult qualified counsel for actual compliance decisions.**

---

## Project 8 (Bonus Module 1): Classify an AI System's EU AI Act Risk Tier

**Goal:** Learn to determine which of the Act's four risk tiers an AI system falls into — the single most consequential classification decision in EU AI Act compliance, since it determines every obligation that follows.

### Why This Project Matters

Misclassifying a system's risk tier is one of the most common and costly compliance mistakes organizations make — either overspending on unnecessary compliance work, or worse, missing obligations that carry fines up to €35 million or 7% of global annual turnover. This project builds the classification skill directly.

**Step 1 — Set up a project folder.**
```bash
mkdir eu_ai_act_classification_project
cd eu_ai_act_classification_project
```
Copy in `risk_overview.md` from Project 1.
*Why:* Your existing risk overview is a natural starting point — EU AI Act classification builds on the same "what could go wrong" thinking, applied to a specific legal framework.

**Step 2 — Learn the four risk tiers.**
```bash
nano risk_tiers.md
```
Learn: **unacceptable risk** (banned outright — e.g., social scoring, manipulative AI exploiting vulnerabilities); **high risk** (heavily regulated — AI used in areas like employment, credit scoring, law enforcement, education, and critical infrastructure); **limited risk** (transparency obligations only — e.g., chatbots must disclose they're AI); **minimal risk** (largely unregulated — e.g., spam filters, AI-enabled video games).
*Why:* Every subsequent obligation in this module depends entirely on which tier applies — get this wrong and everything built on top of it is misdirected effort.

**Step 3 — Check for prohibited practices first.**
Learn: **Article 5** bans specific practices outright, including government-run social scoring, AI exploiting vulnerabilities of children or people with disabilities to cause harm, real-time remote biometric identification in public spaces by law enforcement (with narrow exceptions), and untargeted scraping of facial images to build recognition databases.
```bash
nano prohibited_practice_check.md
```
Using your Project 1 example system, confirm it doesn't fall into any prohibited category.
*Why:* This check comes first because unacceptable-risk systems can't be brought into compliance at all — they simply can't be deployed, so there's no point classifying further if this applies.

**Step 4 — Check Annex III high-risk categories.**
Learn: **Annex III** lists specific high-risk use cases — including biometrics, critical infrastructure, education and vocational training, employment and worker management, access to essential services, law enforcement, migration/border control, and administration of justice.
```bash
nano annex_iii_check.md
```
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
```bash
nano role_determination.md
```
For your example system, determine which role(s) apply.
*Why:* Every obligation in Projects 9–11 differs depending on whether you're building the system or just using someone else's — this determination shapes everything that follows.

**Step 8 — Write the classification memo.**
```bash
nano classification_memo.md
```
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

---

## Project 9 (Bonus Module 2): Map Obligations to Your System's Classification

**Goal:** Translate a risk tier and role determination (Project 8) into a concrete list of what you actually have to do — the step that turns classification into an actionable compliance plan.

### Why This Project Matters

Knowing a system is "high-risk" doesn't tell you what to build. The Act's high-risk obligations (concentrated in Articles 9–15) are specific and numerous — this project builds the skill of turning a legal article into an engineering and documentation checklist.

**Step 1 — Set up a project folder.**
```bash
mkdir obligation_mapping_project
cd obligation_mapping_project
```
Copy in `classification_memo.md` from Project 8.
*Why:* This project's entire purpose is translating that classification into action — keep it close at hand.

**Step 2 — Learn the core high-risk provider obligations.**
```bash
nano provider_obligations.md
```
Learn: providers of high-risk systems must implement a **risk management system** (continuous, throughout the system's lifecycle), ensure **data governance** (training/validation/testing data must be relevant, representative, and as error-free as possible), produce **technical documentation**, build in **record-keeping** (automatic logging of relevant events), design for **human oversight**, achieve required **accuracy, robustness, and cybersecurity**, and establish a **quality management system**.
*Why:* This is the actual checklist Articles 9–15 require — each one maps to a specific project later in this module or the original course.

**Step 3 — Learn the core high-risk deployer obligations.**
Learn: under **Article 26**, deployers must use the system according to the provider's instructions, ensure human oversight during use, monitor the system's operation, keep logs the provider requires, and conduct a fundamental-rights impact assessment where required.
*Why:* Deployer duties are lighter than provider duties, but they're not nothing — an organization that only *uses* a high-risk AI system still has real, enforceable responsibilities.

**Step 4 — Cross-reference each obligation with existing course work.**
```bash
nano obligation_crosswalk.md
```
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
```bash
nano obligation_map.md
```
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

---

## Project 10 (Bonus Module 3): Build a Technical Documentation Package for a High-Risk System

**Goal:** Produce the actual documentation artifact Article 11 requires — extending your Project 6 model card into something that would satisfy a real regulatory review.

### Why This Project Matters

Your Project 6 model card was written for internal transparency. The EU AI Act's technical documentation requirement is more specific and more formal — this project builds the difference, so you understand what "good enough internally" and "compliant with a specific legal requirement" actually look like side by side.

**Step 1 — Set up a project folder.**
```bash
mkdir technical_documentation_project
cd technical_documentation_project
```
Copy in `model_card.md` from Project 6 and `fairness_audit_report.md` from Project 3.
*Why:* This project extends, rather than replaces, your existing documentation — reuse what's already validated.

**Step 2 — Learn what Article 11 technical documentation must include.**
```bash
nano required_sections.md
```
Learn the required sections: general system description and intended purpose, design specifications (architecture, algorithms, key design choices), data requirements and provenance, human oversight measures, performance metrics and known limitations, risk management measures, and change management/version history.
*Why:* This is a more prescriptive, legally specific structure than a typical internal model card — knowing the required sections is what lets you check for completeness systematically.

**Step 3 — Write the intended purpose section.**
```bash
nano technical_documentation.md
```
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
```bash
nano version_history.md
```
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

---

## Project 11 (Bonus Module 4): Implement Human Oversight and Conformity Assessment Readiness

**Goal:** Build the actual mechanisms — not just documentation about them — that let a human meaningfully oversee and intervene in a high-risk AI system, and prepare for conformity assessment.

### Why This Project Matters

Project 10 *described* human oversight. This project *builds* it — because "we have human oversight" needs to be a real, testable capability, not just a sentence in a document, especially given that regulators specifically look for evidence of operational controls, not just paperwork.

**Step 1 — Set up a project folder.**
```bash
mkdir human_oversight_project
cd human_oversight_project
```
Copy in `log_outputs.py` from Project 2 and `dashboard.py` from Project 7.
*Why:* Human oversight builds directly on your existing logging and monitoring infrastructure — this isn't a new system, it's an extension.

**Step 2 — Learn the categories of human oversight the Act expects.**
```bash
nano oversight_requirements.md
```
Learn: effective oversight typically includes the ability to **fully understand** system outputs, **monitor operation** for anomalies, **intervene or interrupt** the system's operation, and **override or disregard** its output when appropriate.
*Why:* These four categories are specific, checkable capabilities — "human oversight exists" as a vague claim doesn't map to any of them individually, which is exactly the gap this project closes.

**Step 3 — Implement an override mechanism.**
```bash
nano oversight_controls.py
```
```python
def get_model_recommendation(candidate_data):
    recommendation = call_model(candidate_data)
    return {"recommendation": recommendation, "overridden": False, "override_reason": None}

def human_override(decision, new_outcome, reason):
    decision["recommendation"] = new_outcome
    decision["overridden"] = True
    decision["override_reason"] = reason
    log_override(decision)
    return decision
```
*Why:* This is a concrete, working override capability — a human reviewer can change the system's output, and that change is explicitly tracked, not silently absorbed.

**Step 4 — Implement a stop/interrupt mechanism.**
```python
system_active = True

def emergency_stop(reason):
    global system_active
    system_active = False
    log_stop_event(reason)

def check_before_running():
    if not system_active:
        raise SystemHaltedError("System has been manually stopped for review.")
```
*Why:* The ability to halt the system entirely, not just override individual decisions, is a distinct and necessary oversight capability — especially if a systemic problem is discovered, not just an individual bad output.

**Step 5 — Extend Project 2's logging for oversight-specific events.**
```python
def log_override(decision):
    log_call(prompt="[OVERRIDE]", response=str(decision), log_file="oversight_log.jsonl")

def log_stop_event(reason):
    log_call(prompt="[EMERGENCY_STOP]", response=reason, log_file="oversight_log.jsonl")
```
*Why:* This directly satisfies Article 12's record-keeping requirement — automatically capturing oversight-relevant events, not just requiring someone to remember to document them separately.

**Step 6 — Extend Project 7's dashboard with an oversight view.**
```python
@app.route("/oversight")
def oversight_view():
    with open("oversight_log.jsonl") as f:
        events = [json.loads(line) for line in f]
    override_count = sum(1 for e in events if "OVERRIDE" in e["prompt"])
    return render_template("oversight.html", override_count=override_count, events=events)
```
*Why:* A high or rising override rate is itself a meaningful signal — it might indicate the underlying model is degrading in ways that need investigation, which is exactly the kind of monitoring Article 26 expects from deployers.

**Step 7 — Test the full oversight loop.**
Run a decision through the system, have a human override it with a documented reason, confirm it's logged, then trigger an emergency stop and confirm the system correctly refuses to process further decisions until reactivated.
*Why:* Testing this end-to-end is what proves oversight is a real, working capability — not just code that looks right but has never actually been exercised.

**Step 8 — Write a conformity assessment readiness checklist.**
```bash
nano conformity_readiness_checklist.md
```
Combine artifacts from Projects 8–11: classification memo complete, obligation map complete, technical documentation complete, human oversight mechanisms built and tested, data governance audit complete, bias evaluation complete.
*Why:* This checklist is what an organization would actually walk through before either self-assessing conformity or engaging a third-party assessor — the final, practical output of this entire advanced module.

### Final Project Structure
```text
human_oversight_project/
│
├── oversight_requirements.md
├── oversight_controls.py
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

---

## Advanced Module Summary

These four bonus projects extend your Final Capstone audit with the specific regulatory framework now driving real AI governance hiring and work in the EU and for any organization touching EU users:

| Project | Core Skill | Extends |
|---|---|---|
| 8. Risk Classification | EU AI Act tier and role determination | Project 1 (risk overview) |
| 9. Obligation Mapping | Translating law into engineering checklists | Projects 1, 3, 4, 6 |
| 10. Technical Documentation | Article 11-compliant documentation | Project 6 (model card) |
| 11. Human Oversight | Working oversight mechanisms + readiness | Projects 2 & 7 (logging, monitoring) |

**Reminder:** deadlines and requirements referenced here reflect the regulatory landscape as of mid-2026, including the pending Digital Omnibus deferral. Always verify current obligations against the official Act text and qualified legal counsel before treating any compliance work as complete.

### Updated Portfolio Project
**EU AI Act Compliance Program (Advanced)** — Built a complete EU AI Act compliance workflow for a high-risk AI system: risk classification, obligation mapping, Article 11 technical documentation, and tested human oversight mechanisms, culminating in a conformity assessment readiness checklist.
**Skills:** EU AI Act, Regulatory Compliance, AI Governance, Human-in-the-Loop Systems, Technical Documentation.
