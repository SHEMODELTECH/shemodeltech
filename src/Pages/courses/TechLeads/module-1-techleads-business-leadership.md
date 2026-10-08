<!-- order: 1 -->
## Module 1: TechLeads (Business & Leadership)

Time: about 6 hours

**By the end of this module, you'll be able to:**
- Write the same status update for a team and for stakeholders, answering what happened, what's at risk, and what's needed
- Give feedback using the Situation-Behavior-Impact (SBI) framework, followed by an open coaching question
- Draft a growth plan with measurable progress signals and a scheduled follow-up
- Build a delegation matrix and plan a Sprint against real team capacity
- Run a retrospective that produces one concrete change, and check it shows up in the next plan

**Purpose of this module:** Lead technology teams without necessarily writing code. This module is about the human and organizational side of engineering leadership, communication, coaching, and team management, rather than technical execution.

**Tools needed for this module:** No software installation required. A notes app or doc tool for templates (1:1 notes, feedback drafts, delegation matrix) is helpful but any notebook works. If your team already uses a project tool (Jira, Linear, Asana, etc.), you can use it for the Team Management lab, but it isn't required to start.

**If you don't manage anyone yet:** that's fine. For every lab that mentions "your team" or "a report," use your She Model Tech project team (or this short case: You've been asked to lead a three-person volunteer team building a sign-up page for a community coding workshop, due in six weeks. Amara, the designer, is reliable but quiet in meetings; Jordan, a developer, works fast but often skips testing, and last week a bug reached users; Priya, a content writer, is new and unsure what's expected of her. Your sponsor wants a weekly update and has just asked whether the page can also take payments.) You can reuse the same case in Module 3's change-management lab.

### Topic 1.1: Communication

#### Concept

Leading a technology team means constantly translating, turning technical detail into something a non-technical stakeholder can act on, and turning business priorities into something an engineer can build against. Unlike an individual contributor, whose primary audience is other engineers, a tech lead's communication has to work for multiple audiences at once: the team, their manager, product, and sometimes customers or executives, each of whom needs a different level of detail and a different framing of the same underlying facts.

- **Stakeholder translation** is converting technical detail (architecture tradeoffs, bug root causes, timeline risk) into language and framing a non-technical audience can act on
- **Status reporting** is a regular, concise summary of progress, blockers, and risk, written so someone who wasn't in the room still understands where things stand
- **Active listening** is fully attending to what someone says before responding, confirming understanding rather than assuming it, especially important when a report or stakeholder raises a concern
- **Upward communication** is surfacing risk, bad news, or resource needs to your own manager early and clearly, rather than letting them discover it later

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#1d4ed8', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    TEAM["<b>Team Work</b><br/><br/>Progress, blockers,<br/>technical detail"]
    LEAD["<b>Tech Lead</b><br/><br/>Translates &<br/>frames context"]
    UP["<b>Manager /<br/>Execs</b><br/><br/>Status, risk,<br/>resourcing asks"]
    OUT["<b>Product /<br/>Stakeholders</b><br/><br/>Tradeoffs,<br/>timelines"]

    TEAM ==> LEAD
    LEAD ==> UP
    LEAD ==> OUT
    UP -.feedback.-> LEAD
    OUT -.feedback.-> LEAD
    LEAD -.context.-> TEAM

    style TEAM fill:#e2e8f0,color:#1a202c,stroke:#1d4ed8,stroke-width:4px
    style LEAD fill:#1d4ed8,color:#fff,stroke:#1e3a8a,stroke-width:4px
    style UP fill:#dbeafe,color:#1a202c,stroke:#1d4ed8,stroke-width:4px
    style OUT fill:#dbeafe,color:#1a202c,stroke:#1d4ed8,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Good status reporting answers three questions every time, regardless of format: what happened, what's at risk, and what's needed, so the reader never has to ask a follow-up just to understand the basics
- The same information often needs two versions: a detailed one for the team, and a compressed one for stakeholders who only need the headline and the ask

**Worked example: a stakeholder status update** (from the case above). Notice that the ask comes first and all three questions are answered:

> **Sign-up page, week 3: at risk (amber)**
>
> **Decision needed by Friday:** launch on the planned date without payments, or add payments and launch about two weeks later.
>
> **What happened:** the design is finished and the form works; a bug that sent duplicate confirmation emails was found and fixed this week.
>
> **What's at risk:** adding payments needs about two extra weeks of building and testing.
>
> **Our recommendation:** launch on time and add payments in a second release.
>
> **Next update:** Monday.

#### Where you'd actually use this

Writing a weekly status update that a busy VP can read in thirty seconds and still understand the real risk, explaining to product why a "simple" feature request actually needs three weeks, or flagging to your manager early that a deadline is at risk instead of surprising them the week it slips.

#### Lab

1. **Pick a real (or recent) technical situation** on your team, a delay, an incident, an architecture decision, anything with some complexity behind it.
2. **Write two versions of a status update about it** (use the worked example above as a model):
   - A **team version**: detailed, technical, assumes shared context.
   - A **stakeholder version**: 3-5 sentences, no jargon, leads with impact and what's needed from the reader.
3. **Check your stakeholder version against the three-question test**: does it answer what happened, what's at risk, and what's needed, without the reader having to ask?
4. **Practice active listening in a real conversation this week**: in your next 1:1 or stakeholder call, consciously pause before responding and reflect back what you heard in one sentence before giving your own view.
5. **Identify one piece of bad news or risk** you've been sitting on, and draft the message you'd send upward to surface it now rather than later.

#### Checkpoint
You have two written versions of the same update aimed at two different audiences, you've practiced reflecting back what you heard in a real conversation, and you've drafted (and ideally sent) one piece of upward communication you'd been putting off.

#### Quiz
1. Why does a tech lead's communication need to work for multiple audiences differently, compared to an individual contributor's?
2. What is "stakeholder translation"?
3. What three questions should a good status update answer?
4. What is "upward communication," and why does surfacing bad news early matter?
5. What does "active listening" require beyond simply hearing what someone said?

*Answers: 1) A tech lead reports to and coordinates with the team, their manager, product, and sometimes execs or customers, each needing a different level of detail and framing of the same facts, unlike an IC whose main audience is other engineers. 2) Converting technical detail like architecture tradeoffs or timeline risk into language and framing a non-technical audience can act on. 3) What happened, what's at risk, and what's needed. 4) Proactively telling your own manager about risk, bad news, or resource needs early, rather than letting them find out later; it matters because it preserves trust and gives more time to react. 5) Confirming understanding, such as reflecting back what was said, rather than just hearing the words and immediately responding with your own view.*

---

### Topic 1.2: Coaching

#### Concept

Coaching is different from managing a task list: it's about growing the people on your team over time, not just getting today's work done. A tech lead who only assigns and checks work is managing output; a tech lead who also gives specific, actionable feedback and helps someone build a growth plan is developing people, which is what keeps a team strong beyond any single project.

- **1:1s** are regular, recurring individual meetings focused on the report's growth, blockers, and concerns, not just a status check on their tickets
- **The SBI framework (Situation-Behavior-Impact)** is a feedback structure: describe the specific situation, the observed behavior, and its impact, which keeps feedback concrete instead of vague or personal
- **Growth plans** are a documented, agreed set of skills or experiences a report is working toward, revisited periodically rather than set once and forgotten
- **Coaching vs. mentoring** is a useful distinction: coaching draws answers out of the person through questions, while mentoring shares your own experience or answer directly; a good tech lead uses both, but leans on coaching to build the other person's own judgment

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#9d174d', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    OBS["<b>Observe</b><br/><br/>Work, behavior,<br/>1:1 conversation"]
    FB["<b>SBI Feedback</b><br/><br/>Situation, Behavior,<br/>Impact"]
    PLAN["<b>Growth Plan</b><br/><br/>Agreed skills<br/>or experiences"]
    FU["<b>Follow-up</b><br/><br/>Next 1:1,<br/>check progress"]

    OBS ==> FB ==> PLAN ==> FU
    FU -.repeat.-> OBS

    style OBS fill:#fce7f3,color:#1a202c,stroke:#9d174d,stroke-width:4px
    style FB fill:#9d174d,color:#fff,stroke:#831843,stroke-width:4px
    style PLAN fill:#fbcfe8,color:#1a202c,stroke:#9d174d,stroke-width:4px
    style FU fill:#fce7f3,color:#1a202c,stroke:#9d174d,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Coaching is a repeating cycle, not a one-time event: the follow-up step is what separates a growth plan that actually happens from one that's written once and forgotten

**Worked example: SBI feedback** (from the case above):

> "In Thursday's release (**Situation**), you merged the sign-up form change without running the test checklist (**Behavior**). A bug sent duplicate emails to about 40 people, and the team spent Friday morning fixing it instead of finishing the design review (**Impact**)."

Then follow with an open coaching question rather than a fix: "What would help you run the checklist when you're under time pressure?" Notice there's no label like "careless," only what happened and what it caused.

- Feedback lands better close to the moment it happens; SBI works whether it's given the same day or saved for a scheduled 1:1, but waiting too long makes the "situation" harder for both people to recall accurately

#### Where you'd actually use this

Giving a report specific, non-personal feedback after a rough code review discussion instead of a vague "communicate better" comment, running a 1:1 that surfaces a report's actual career goals instead of only their current ticket status, or asking a coaching question that helps someone solve their own problem instead of just handing them the answer.

#### Lab

1. **Pick a real situation** where someone's behavior (yours, a report's, a peer's) had a noticeable impact, positive or negative.
2. **Write it up using SBI:** one or two sentences each for the Situation, the Behavior, and the Impact. Keep it factual and specific, avoid labels like "unprofessional" or "great attitude."
3. **Run (or role-play) a 1:1** using that SBI feedback: deliver it, then ask an open coaching question ("What do you think led to that?" or "What would you try differently next time?") instead of immediately prescribing a fix.
4. **Draft a one-page growth plan** for a real report, a She Model Tech teammate, or someone from the case above (for example Priya or Jordan): 2-3 specific skills or experiences, how you'll know progress is happening, and when you'll next check in.
5. **Schedule the follow-up** on a real calendar, even if it's a placeholder, so the growth plan doesn't quietly expire.

#### Checkpoint
You have one SBI feedback write-up, one growth plan with a concrete follow-up date, and you've practiced asking an open coaching question instead of giving a direct answer.

#### Quiz
1. What is the main difference between managing a task list and coaching someone?
2. What does the SBI framework stand for, and why does it keep feedback concrete?
3. What is a growth plan, and why does it need to be revisited rather than set once?
4. What's the difference between coaching and mentoring?
5. Why does feedback tend to land better closer to the moment it happens?

*Answers: 1) Managing a task list focuses on getting today's work done; coaching focuses on growing the person over time, which is what keeps a team strong beyond any single project. 2) Situation-Behavior-Impact; describing the specific situation, the observed behavior, and its impact keeps the feedback factual instead of vague or personal. 3) A documented, agreed set of skills or experiences a report is working toward; it needs revisiting because without a follow-up it's easy for the plan to be written once and forgotten. 4) Coaching draws answers out of the person through questions, while mentoring shares your own experience or answer directly. 5) The details of the situation and behavior are easier for both people to recall accurately, making the feedback more concrete and credible.*

---

### Topic 1.3: Team Management

#### Concept

Managing a team day-to-day is about making sure work is planned, distributed, and reviewed in a way that keeps both the output and the people healthy. Unlike coaching, which is about individual growth, team management operates at the group level, how work gets planned, who owns what, and how the team learns from what just happened, so the same mistakes don't repeat and the same people don't get consistently overloaded.

- **Delegation** is assigning ownership of a piece of work to someone else, along with enough context and authority that they can actually own it, not just execute steps you dictate
- **Sprint / iteration planning** is the recurring process of deciding what the team will work on next, sized and sequenced against priority and capacity
- **Retrospectives ("retros")** are a recurring, structured team conversation about what worked, what didn't, and what to change, focused on the process rather than blaming individuals
- **Team health** covers signals like workload balance, morale, and turnover risk, things a tech lead has to watch for proactively since they rarely show up as a ticket in the backlog

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#262626', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    PLAN["<b>Sprint Planning</b><br/><br/>Priority vs.<br/>capacity"]
    DEL["<b>Delegation</b><br/><br/>Ownership +<br/>context"]
    EXEC["<b>Execution</b><br/><br/>Work gets<br/>done"]
    RETRO["<b>Retro</b><br/><br/>What worked,<br/>what didn't"]

    PLAN ==> DEL ==> EXEC ==> RETRO
    RETRO -.feeds back into.-> PLAN

    style PLAN fill:#e2e8f0,color:#1a202c,stroke:#262626,stroke-width:4px
    style DEL fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    style EXEC fill:#F5F5F5,color:#1a202c,stroke:#262626,stroke-width:4px
    style RETRO fill:#262626,color:#fff,stroke:#262626,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- A retro is only useful if it changes the next planning cycle; a team that identifies the same issue retro after retro without any resulting change in how work is planned isn't actually retro-ing, it's just venting
- Delegation and micromanagement are easy to confuse from the outside; the real test is whether the person has enough context and authority to make their own decisions on the work, not just a list of steps to follow

#### Where you'd actually use this

Deciding what a team commits to next sprint given real capacity instead of wishful thinking, handing off a project to a senior engineer with enough context that they can make their own calls instead of checking in on every decision, or running a retro after a rough release that produces one or two concrete process changes instead of a list of complaints nobody acts on.

#### Lab

1. **Build a simple delegation matrix** for your current team, your She Model Tech project team, or the case team above: list 3-5 pieces of ongoing work, who owns each one, and one sentence on what context or authority they need to actually own it (not just execute it).
2. **Run a lightweight sprint/iteration planning exercise:** list your team's top 5-8 candidate tasks, rough-size each one, and sequence them against your team's real capacity for the period, cutting anything that doesn't fit rather than overcommitting.
3. **Run (or role-play) a retro** on a recent piece of work: gather 3 "what worked," 3 "what didn't," and narrow it down to exactly one concrete change you'll actually make next cycle.
4. **Check your retro output against the planning exercise**: does the one concrete change actually show up in how you planned the next round of work?
5. **Do a quick team-health gut check:** for each person on your team (or each person in the case above), note one signal of workload or morale you'd want to watch, even if nothing is currently wrong.

#### Checkpoint
You have a delegation matrix with real ownership and context notes, a sprint plan sized against real capacity, and one retro that produced exactly one concrete change which shows up in that plan.

#### Quiz
1. What is delegation, and how is it different from just assigning steps to follow?
2. What is sprint or iteration planning?
3. What makes a retrospective effective, according to this module?
4. Why is "team health" something a tech lead has to watch for proactively rather than wait to be told about?
5. What's the real test for whether delegation has actually happened versus micromanagement?

*Answers: 1) Assigning ownership of a piece of work to someone else; it's different from just assigning steps because it comes with enough context and authority for the person to actually own the work and make their own decisions on it. 2) The recurring process of deciding what the team will work on next, sized and sequenced against priority and real capacity. 3) It produces at least one concrete process change that actually shows up in the next planning cycle, rather than surfacing the same complaints repeatedly with no resulting change. 4) Signals like workload balance, morale, and turnover risk rarely show up as a ticket in the backlog, so a tech lead has to actively watch for them rather than waiting for them to be reported. 5) Whether the person has enough context and authority to make their own decisions on the work, not just a list of steps to follow.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "people",
   "kicker": "Module 1 · Business and leadership",
   "title": "Lead the team, not the code",
   "beats": [
    {
     "say": "Welcome to Module 1 of the TechLeads track."
    },
    {
     "say": "This module is about the human side of leading a technology team: communication, coaching, and team management, rather than writing code."
    },
    {
     "say": "If you don't manage anyone yet, use your She Model Tech project team, or the course's case: a three-person volunteer team building a sign-up page."
    }
   ]
  },
  {
   "kind": "list",
   "art": "megaphone",
   "kicker": "Topic 1.1 · Communication",
   "title": "One set of facts, many audiences",
   "items": [
    [
     "Stakeholder translation",
     "Technical detail → something to act on"
    ],
    [
     "Status reporting",
     "Progress, blockers, risk"
    ],
    [
     "Active listening",
     "Confirm before you respond"
    ],
    [
     "Upward communication",
     "Raise risk early"
    ]
   ],
   "beats": [
    {
     "say": "A tech lead's words have to work for the team, their manager, product, and sometimes customers or executives.",
     "show": 0
    },
    {
     "say": "Stakeholder translation turns technical detail into something a non-technical person can act on.",
     "show": 1
    },
    {
     "say": "Status reporting is a regular, concise summary of progress, blockers and risk.",
     "show": 2
    },
    {
     "say": "Active listening means confirming you understood before you respond.",
     "show": 3
    },
    {
     "say": "And upward communication means surfacing risk or bad news to your own manager early, not letting them discover it later.",
     "show": 4
    }
   ]
  },
  {
   "kind": "list",
   "art": "doc",
   "kicker": "Worked example",
   "title": "A stakeholder status update",
   "items": [
    [
     "Decision needed by Friday",
     "On time without payments, or two weeks later with them"
    ],
    [
     "What happened",
     "Design done, form works, bug fixed"
    ],
    [
     "What's at risk",
     "Payments need ~2 extra weeks"
    ],
    [
     "Recommendation",
     "Launch on time, payments in release two"
    ]
   ],
   "beats": [
    {
     "say": "Every good status update answers three questions: what happened, what's at risk, and what's needed.",
     "show": 0
    },
    {
     "say": "Here's the sign-up page update. It opens with the ask: a decision needed by Friday.",
     "show": 1
    },
    {
     "say": "What happened: the design is finished, the form works, and a duplicate email bug was fixed.",
     "show": 2
    },
    {
     "say": "What's at risk: adding payments needs about two extra weeks.",
     "show": 3
    },
    {
     "say": "And the recommendation: launch on time, and add payments in a second release.",
     "show": 4
    },
    {
     "say": "In the lab, write a detailed team version and a short stakeholder version of the same update.",
     "show": 4
    }
   ]
  },
  {
   "kind": "quote",
   "art": "chat",
   "kicker": "Topic 1.2 · Coaching",
   "title": "Feedback with S B I",
   "quote": "Situation → Behavior → Impact. Then ask: \"What would help you run the checklist under time pressure?\"",
   "beats": [
    {
     "say": "Coaching is about growing people over time, not just getting today's work done.",
     "show": 0
    },
    {
     "say": "The S B I framework keeps feedback concrete: situation, behaviour, impact.",
     "show": 1
    },
    {
     "say": "In Thursday's release, you merged the form change without running the test checklist. A bug sent duplicate emails to about forty people.",
     "show": 1
    },
    {
     "say": "Notice there's no label like careless. Then follow with an open question: what would help you run the checklist under time pressure?",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "loop",
   "kicker": "Concept",
   "title": "The coaching cycle",
   "steps": [
    "Observe",
    "S B I feedback",
    "Growth plan",
    "Follow-up"
   ],
   "beats": [
    {
     "say": "Coaching is a repeating cycle.",
     "show": 0
    },
    {
     "say": "Observe the work and the conversation.",
     "show": 1
    },
    {
     "say": "Give S B I feedback.",
     "show": 2
    },
    {
     "say": "Agree a growth plan: two or three skills, and how you'll know progress is happening.",
     "show": 3
    },
    {
     "say": "Then follow up. That step is what stops a growth plan being written once and forgotten.",
     "show": 4
    },
    {
     "say": "Coaching draws answers out through questions; mentoring shares your own answer. Lean on coaching to build their judgement.",
     "show": 4
    }
   ]
  },
  {
   "kind": "list",
   "art": "kanban",
   "kicker": "Topic 1.3 · Team management",
   "title": "Planning, ownership and learning",
   "items": [
    [
     "Delegation",
     "Ownership + context + authority"
    ],
    [
     "Sprint planning",
     "Priority vs. real capacity"
    ],
    [
     "Retrospectives",
     "Process, not blame"
    ],
    [
     "Team health",
     "Workload, morale, turnover risk"
    ]
   ],
   "beats": [
    {
     "say": "Team management works at the group level.",
     "show": 0
    },
    {
     "say": "Delegation hands over ownership, with enough context and authority to really own it.",
     "show": 1
    },
    {
     "say": "Sprint planning decides what's next, sized against priority and real capacity.",
     "show": 2
    },
    {
     "say": "Retros ask what worked, what didn't, and what to change, without blaming individuals.",
     "show": 3
    },
    {
     "say": "And team health, like workload and morale, has to be watched for, because it rarely shows up as a ticket.",
     "show": 4
    }
   ]
  },
  {
   "kind": "quote",
   "art": "sticky",
   "kicker": "Watch out",
   "title": "Venting is not a retro",
   "quote": "A retro is only useful if it changes the next planning cycle.",
   "beats": [
    {
     "say": "A retro only matters if it changes the next plan.",
     "show": 0
    },
    {
     "say": "A team that names the same issue retro after retro, with no change in how work is planned, is just venting.",
     "show": 1
    },
    {
     "say": "And the real test of delegation versus micromanagement: can the person make their own decisions, or do they only have steps to follow?",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "table",
   "kicker": "Lab",
   "title": "Run the team cycle",
   "steps": [
    "Delegation matrix",
    "Sprint plan vs. capacity",
    "Retro → one change",
    "Change shows up in the plan"
   ],
   "beats": [
    {
     "say": "In the lab, build a delegation matrix: three to five pieces of work, an owner, and the context each owner needs.",
     "show": 1
    },
    {
     "say": "Plan a sprint: five to eight tasks, rough-sized, cutting anything that doesn't fit.",
     "show": 2
    },
    {
     "say": "Run a retro that narrows to exactly one concrete change.",
     "show": 3
    },
    {
     "say": "Then check that change actually shows up in your plan.",
     "show": 4
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What's the real test of delegation versus micromanagement?",
   "options": [
    "Whether the person has enough context and authority to make their own decisions",
    "Whether you check in on the work every day",
    "Whether the task finishes on time"
   ],
   "answer": 0,
   "good": "That's right. Delegation means the person has enough context and authority to make their own decisions, not just a list of steps to follow.",
   "bad": "Not quite. Delegation means the person has enough context and authority to make their own decisions, not just a list of steps to follow.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What's the real test of delegation versus micromanagement?",
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
     "Two versions of one update, three-question test",
     ""
    ],
    [
     "Active listening + one upward message",
     ""
    ],
    [
     "S B I feedback + a coaching question",
     ""
    ],
    [
     "A growth plan with a follow-up date",
     ""
    ],
    [
     "Delegation matrix + sprint plan",
     ""
    ],
    [
     "One retro change in the next plan",
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
     "say": "you've written a team and a stakeholder version of one update, and checked it against the three-question test,",
     "show": 1
    },
    {
     "say": "you've practised active listening and drafted one piece of upward communication,",
     "show": 2
    },
    {
     "say": "you've given S B I feedback with an open coaching question,",
     "show": 3
    },
    {
     "say": "you've drafted a growth plan with a scheduled follow-up,",
     "show": 4
    },
    {
     "say": "you've built a delegation matrix and a sprint plan against real capacity,",
     "show": 5
    },
    {
     "say": "and your retro produced one concrete change that shows up in the next plan.",
     "show": 6
    },
    {
     "say": "Next, in Module 2, strategy, business analysis and stakeholder management.",
     "show": 6
    }
   ]
  }
 ]
}
```

---

## Module 1 Completion Checklist
- [ ] Written a team-facing and a stakeholder-facing version of the same status update, and checked it against the three-question test
- [ ] Practiced active listening in a real conversation and drafted one piece of upward communication
- [ ] Written a piece of feedback using the SBI framework and delivered it with an open coaching question
- [ ] Drafted a one-page growth plan with a scheduled follow-up
- [ ] Built a delegation matrix with real ownership and context for each item
- [ ] Run a sprint/iteration plan sized against real capacity
- [ ] Run a retro that produced exactly one concrete change, and confirmed it shows up in the next plan
