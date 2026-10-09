<!-- order: 6 -->
## Module 6: Communication and Delivery

Time: about 6 hours

**By the end of this module, you'll be able to:**
- Write an outcome-based meeting purpose and a timed agenda, and close a meeting with owned, dated actions
- Break a project into tasks and milestones with owners and dependencies
- Build a RAID log and tell risks, assumptions, issues, and dependencies apart
- Write a status update that answers what happened, what's at risk, and what's needed
- Build and rehearse a five-slide presentation that leads with the ask and follows situation, complication, resolution

**Purpose of this module:** Keep projects moving and people aligned: run useful meetings, track work and risks, and present clearly to any audience. These are the everyday skills of project coordinators, delivery managers, and anyone who helps a tech team ship.

**Tools needed for this module:** A document tool, a spreadsheet, and presentation software (Google Slides, PowerPoint, or Keynote). A free project board such as [Trello](https://trello.com) is useful but optional.

### Topic 6.1: Running Effective Meetings

#### Concept

Meetings are one of the most expensive things a team does: an hour with eight people costs a full working day. Effective meetings have a clear purpose, the right people, and a visible outcome. A facilitator's job is to get the group to that outcome, not to do most of the talking.

- Every meeting should have a **purpose** stated as an outcome, such as "decide on the launch date" rather than "discuss the launch"
- An **agenda** lists topics with time limits and is shared in advance, so people arrive prepared
- A **facilitator** keeps time, makes sure every voice is heard, and steers back to the purpose
- **Parking lot** items are important but off-topic points, noted to handle later so the meeting stays on track
- Every meeting should end with decisions and **action items**, each with an owner and a due date

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#1d4ed8', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    PURP["<b>Purpose</b><br/><br/>The outcome<br/>needed"]
    AGENDA["<b>Agenda</b><br/><br/>Shared in<br/>advance"]
    FAC["<b>Facilitate</b><br/><br/>Time, voices,<br/>focus"]
    ACT["<b>Actions</b><br/><br/>Owner and<br/>due date"]

    PURP ==> AGENDA ==> FAC ==> ACT

    style PURP fill:#1d4ed8,color:#fff,stroke:#1e3a8a,stroke-width:4px
    style AGENDA fill:#dbeafe,color:#1a202c,stroke:#1d4ed8,stroke-width:4px
    style FAC fill:#e2e8f0,color:#1a202c,stroke:#1d4ed8,stroke-width:4px
    style ACT fill:#F5F5F5,color:#1a202c,stroke:#262626,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- If a meeting's purpose could be met by a written update, cancel it and send the update
- Ending five minutes early to confirm actions is worth more than five more minutes of discussion

#### Where you'd actually use this

A weekly status meeting has grown to an hour with twelve people. Replacing it with a written update plus a 15-minute call for blockers only gives the team back hours each week, and blockers get solved faster.

#### Lab

1. **Pick a meeting you attend regularly** and write its purpose as an outcome.
2. **Write an agenda** for its next session with timed topics, and share it at least a day ahead.
3. **Facilitate the meeting**, or observe it closely: keep time, invite quieter people in, and use a parking lot for off-topic points.
4. **Close with actions:** confirm each decision and action item, with an owner and a due date, before the meeting ends.
5. **Send a short follow-up** within a day listing decisions and actions, and ask two attendees what would make the meeting more useful.

#### Checkpoint
You've written an outcome-based purpose and a timed agenda, facilitated or observed a real meeting, and sent a follow-up with owned, dated actions.

#### Quiz
1. Rewrite "discuss the launch" as an outcome-based purpose.
2. Why share an agenda in advance?
3. What does a facilitator do?
4. What is a parking lot?
5. What should every meeting end with?

*Answers: 1) For example, "Decide on the launch date." 2) So people arrive prepared and the meeting can reach its outcome. 3) Keeps time, makes sure every voice is heard, and steers the group back to the purpose. 4) A list of important but off-topic points, noted to handle later. 5) Confirmed decisions and action items, each with an owner and a due date.*

---

### Topic 6.2: Tracking Delivery and Risk

#### Concept

Delivery is the work of getting a project from plan to done: knowing what's happening, spotting problems early, and making sure the right people know. Most failed projects don't fail suddenly; they fail through small delays and ignored risks that nobody tracked.

- A **work breakdown** splits a project into tasks small enough to estimate and assign
- A **dependency** is a task that can't start or finish until another one does; dependencies are where delays spread
- A **milestone** marks a significant point, such as "beta ready", used to check progress against the plan
- A **RAID log** tracks Risks, Assumptions, Issues, and Dependencies in one place, each with an owner
- A **risk** is something that might go wrong; an **issue** is something that already has; each risk needs a likelihood, an impact, and a plan

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#1d4ed8', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    PLAN["<b>Plan</b><br/><br/>Tasks and<br/>milestones"]
    TRACK["<b>Track</b><br/><br/>Progress on<br/>a board"]
    RAID["<b>RAID log</b><br/><br/>Risks, issues,<br/>dependencies"]
    REPORT["<b>Report</b><br/><br/>Status and<br/>asks"]

    PLAN ==> TRACK ==> RAID ==> REPORT

    style PLAN fill:#1d4ed8,color:#fff,stroke:#1e3a8a,stroke-width:4px
    style TRACK fill:#dbeafe,color:#1a202c,stroke:#1d4ed8,stroke-width:4px
    style RAID fill:#e2e8f0,color:#1a202c,stroke:#1d4ed8,stroke-width:4px
    style REPORT fill:#F5F5F5,color:#1a202c,stroke:#262626,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Review the RAID log weekly; a risk log nobody reads is just a list
- Raise a risk as soon as it's likely, not when it becomes an issue; early warnings leave more options

#### Where you'd actually use this

A launch depends on a partner delivering an integration. Logged as a dependency with a named owner and weekly check-in, a two-week slip is spotted a month ahead, and the team re-plans instead of missing the launch date.

#### Lab

1. **Choose a real or realistic project** with a clear goal and deadline.
2. **Break it into tasks and milestones**, and put them on a board or in a spreadsheet with an owner for each task.
3. **Mark at least three dependencies** between tasks.
4. **Create a RAID log** with at least two entries in each category, each with an owner; rate each risk's likelihood and impact and write a response.
5. **Write a one-paragraph status update** from your tracking that answers what happened, what's at risk, and what's needed.

```lab
{
 "type": "sort",
 "title": "Build a RAID log",
 "prompt": "Sort each note from a project meeting into the RAID log.",
 "buckets": [
  "Risk",
  "Assumption",
  "Issue",
  "Dependency"
 ],
 "items": [
  {
   "text": "The payment partner might not finish their API before our launch.",
   "bucket": "Risk",
   "why": "Something that might go wrong."
  },
  {
   "text": "We expect about 500 users in the first month.",
   "bucket": "Assumption",
   "why": "Something believed true but not yet confirmed."
  },
  {
   "text": "The test server has been down since Tuesday.",
   "bucket": "Issue",
   "why": "It has already happened."
  },
  {
   "text": "Design must finish the checkout screens before development can start.",
   "bucket": "Dependency",
   "why": "One task can't start until another finishes."
  }
 ]
}
```

#### Checkpoint
You have a task plan with milestones, owners, and dependencies, a RAID log with owners and risk ratings, and a status update drawn from it.

#### Quiz
1. What is a dependency, and why does it matter?
2. What does RAID stand for?
3. What is the difference between a risk and an issue?
4. What three things should every logged risk have?
5. Why raise a risk early?

*Answers: 1) A task that can't start or finish until another does; delays spread through dependencies. 2) Risks, Assumptions, Issues, and Dependencies. 3) A risk might happen; an issue already has. 4) A likelihood, an impact, and a plan (plus an owner). 5) Early warnings leave more options to prevent or reduce the problem.*

---

### Topic 6.3: Presenting to Stakeholders

#### Concept

Sooner or later every project needs to be explained to people who weren't part of it: leaders deciding on funding, customers seeing a demo, or teams who'll be affected. A strong presentation is built around the audience's question and the one thing you need from them.

- **Audience analysis** asks who will be there, what they already know, what they care about, and what decision they can make
- The **key message** is the one sentence you want the audience to remember; everything else supports it
- **Lead with the ask:** open with the decision or action you need, so busy listeners know why they're there (the same rule as putting the ask near the top of a decision document in Module 4)
- After the ask, structures such as **situation, complication, resolution** give the supporting case a clear, logical flow
- **One idea per slide**, with a headline that states the point, keeps slides readable
- A **demo** shows real work; rehearse it and keep a backup (screenshots or a recording) in case something fails

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#1d4ed8', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    AUD["<b>Audience</b><br/><br/>What they know<br/>and need"]
    MSG["<b>Key message</b><br/><br/>One sentence<br/>to remember"]
    ASK["<b>The ask, up front</b><br/><br/>Decision or<br/>action needed"]
    STRUCT["<b>Supporting case</b><br/><br/>Situation,<br/>complication, resolution"]

    AUD ==> MSG ==> ASK ==> STRUCT

    style AUD fill:#1d4ed8,color:#fff,stroke:#1e3a8a,stroke-width:4px
    style MSG fill:#dbeafe,color:#1a202c,stroke:#1d4ed8,stroke-width:4px
    style STRUCT fill:#e2e8f0,color:#1a202c,stroke:#1d4ed8,stroke-width:4px
    style ASK fill:#F5F5F5,color:#1a202c,stroke:#262626,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Write slide headlines as full statements ("Checkout errors fell 40%"), not topics ("Checkout update")
- Rehearse aloud at least once, timed; most presentations run longer than planned
- You can repeat the ask on your last slide, but never save it for the end only

#### Where you'd actually use this

A team needs budget to fix a slow checkout. Instead of twenty slides of technical detail, a five-slide presentation opens with the ask (approve the fix), then shows the lost sales, the fix, and its cost. Leaders approve it in the meeting.

#### Lab

1. **Choose a real update or proposal** you could present: a project result, a recommendation, or your Module 5 research readout.
2. **Write an audience analysis** covering who, what they know, what they care about, and what they can decide.
3. **Write your key message** in one sentence, and your ask in one sentence.
4. **Build a five-slide presentation**: slide 1 states your ask, then situation, complication, and resolution, with one idea per slide and statement headlines.
5. **Rehearse it aloud, timed,** for a friend or colleague, and ask them to repeat your key message back. Revise until they can.

```lab
{
 "type": "order",
 "title": "Order a stakeholder presentation",
 "prompt": "Arrange these slides: the ask first, then situation, complication, and resolution.",
 "items": [
  "Decision needed today: approve the checkout fix",
  "Checkout handles 2,000 orders a day",
  "Slow pages now lose us about 8% of carts",
  "Fix: cache product data and shrink images",
  "Cost: two engineers for three weeks"
 ],
 "explain": "Lead with the ask so leaders know what they're deciding, then situation, complication, and the resolution with its cost."
}
```

#### Checkpoint
You have an audience analysis, a five-slide presentation with statement headlines and a clear ask, and a rehearsal where a listener could repeat your key message.

#### Quiz
1. What does audience analysis cover?
2. What is a key message?
3. Where should the ask go in a stakeholder presentation, and what structure supports it?
4. Why write slide headlines as full statements?
5. What should you prepare in case a demo fails?

*Answers: 1) Who will be there, what they already know, what they care about, and what they can decide. 2) The one sentence you want the audience to remember. 3) State the ask up front; then support it with situation (where things stand), complication (the problem or change), and resolution (what you propose). 4) The audience gets the point even if they only read the headlines. 5) A backup such as screenshots or a recording.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "rocket",
   "kicker": "Module 6 · Communication and delivery",
   "title": "Keep projects moving",
   "beats": [
    {
     "say": "Welcome to Module 6, the last module in the TechLeads track."
    },
    {
     "say": "It covers the everyday skills of anyone who helps a tech team ship: running useful meetings, tracking work and risk, and presenting clearly."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Topic 6.1 · Meetings",
   "title": "A purpose, then a timed agenda",
   "columns": [
    "#",
    "Topic",
    "Time"
   ],
   "rows": [
    [
     "1",
     "Recap where we are",
     "5 min"
    ],
    [
     "2",
     "Compare date options",
     "15 min"
    ],
    [
     "3",
     "Decide the date",
     "5 min"
    ],
    [
     "4",
     "Confirm actions",
     "5 min"
    ]
   ],
   "beats": [
    {
     "say": "An hour with eight people costs a full working day. Discuss the launch is a topic, with nothing to finish.",
     "sql": "Purpose: Discuss the launch  ✗"
    },
    {
     "say": "Rewrite it as an outcome: decide on the launch date.",
     "sql": "Purpose: Decide on the launch date  ✓"
    },
    {
     "say": "Each agenda topic gets a time limit, and the agenda goes out at least a day ahead.",
     "hl": [
      0,
      1,
      2,
      3
     ],
     "col": 2
    },
    {
     "say": "The last five minutes confirm actions. And if a written update would do, cancel the meeting.",
     "hl": 3,
     "dim": true
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "From purpose to owned actions",
   "nodes": [
    {
     "id": "purp",
     "label": "Purpose",
     "x": 10,
     "y": 30,
     "sub": "the outcome needed",
     "art": "target"
    },
    {
     "id": "agenda",
     "label": "Agenda",
     "x": 36,
     "y": 72,
     "sub": "shared in advance",
     "art": "calendar"
    },
    {
     "id": "fac",
     "label": "Facilitator",
     "x": 62,
     "y": 30,
     "sub": "time, voices, focus",
     "art": "people"
    },
    {
     "id": "park",
     "label": "Parking lot",
     "x": 62,
     "y": 85,
     "sub": "off-topic, for later",
     "art": "sticky"
    },
    {
     "id": "act",
     "label": "Action items",
     "x": 90,
     "y": 70,
     "sub": "owner + due date",
     "art": "checklist"
    }
   ],
   "edges": [
    {
     "from": "purp",
     "to": "agenda"
    },
    {
     "from": "agenda",
     "to": "fac"
    },
    {
     "from": "fac",
     "to": "park"
    },
    {
     "from": "fac",
     "to": "act"
    }
   ],
   "beats": [
    {
     "say": "It starts with the purpose: the outcome the meeting must reach.",
     "show": 1,
     "on": "purp"
    },
    {
     "say": "The purpose shapes the agenda, which goes out early so people arrive prepared.",
     "show": 2,
     "on": "agenda",
     "send": {
      "from": "purp",
      "to": "agenda",
      "label": "decide the date"
     }
    },
    {
     "say": "The facilitator keeps time, invites quieter people in, and steers back to the purpose.",
     "show": 3,
     "on": "fac",
     "send": {
      "from": "agenda",
      "to": "fac",
      "label": "timed topics"
     }
    },
    {
     "say": "Someone raises an important but off-topic point. It goes to the parking lot, to handle later.",
     "show": 4,
     "on": "park",
     "send": {
      "from": "fac",
      "to": "park",
      "label": "off-topic point"
     }
    },
    {
     "say": "The meeting ends with decisions and action items, each with an owner and a due date.",
     "show": 5,
     "on": "act",
     "send": {
      "from": "fac",
      "to": "act",
      "label": "owner + date"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Topic 6.2 · Tracking delivery",
   "title": "Tasks, owners and dependencies",
   "columns": [
    "Task",
    "Owner",
    "Waits on"
   ],
   "rows": [
    [
     "Design checkout UI",
     "Design",
     "—"
    ],
    [
     "Build checkout",
     "Dev team",
     "Design checkout UI"
    ],
    [
     "Payment partner API",
     "Partner",
     "—"
    ],
    [
     "Integrate payments",
     "Dev team",
     "Partner API"
    ],
    [
     "Milestone: beta ready",
     "Delivery lead",
     "Tasks 1 to 4"
    ]
   ],
   "beats": [
    {
     "say": "Here's a checkout launch, broken into tasks small enough to estimate and assign.",
     "col": 0
    },
    {
     "say": "Each task has one owner.",
     "col": 1
    },
    {
     "say": "Some tasks wait on others. Building checkout can't start until design finishes the screens.",
     "hl": [
      0,
      1
     ],
     "dim": true,
     "col": 2,
     "sql": "Dependency: can't start or finish until another task does"
    },
    {
     "say": "And integrating payments waits on the partner's A P I.",
     "hl": [
      2,
      3
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "Beta ready is a milestone, a point to check progress against the plan.",
     "hl": 4,
     "dim": true
    },
    {
     "say": "If the partner slips two weeks, the delay spreads: to integration, and then to beta.",
     "hl": [
      2,
      3,
      4
     ],
     "dim": true,
     "sql": "Partner API +2 weeks → integration → beta ready"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "One RAID log, four kinds of entry",
   "columns": [
    "Type",
    "Entry",
    "Owner",
    "Rating"
   ],
   "rows": [
    [
     "Risk",
     "Partner API may slip",
     "Delivery lead",
     "Likely · High"
    ],
    [
     "Assumption",
     "~500 users in month 1",
     "Product",
     "—"
    ],
    [
     "Issue",
     "Test server down (Tue)",
     "Dev lead",
     "—"
    ],
    [
     "Dependency",
     "Design before dev",
     "Design",
     "—"
    ]
   ],
   "beats": [
    {
     "say": "A raid log keeps four kinds of entry in one place, each with an owner.",
     "col": 0
    },
    {
     "say": "A risk might go wrong: the payment partner might not finish their A P I before launch.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Every risk gets a likelihood, an impact, and a plan.",
     "hl": 0,
     "dim": true,
     "col": 3,
     "sql": "Plan: weekly check-in with the partner"
    },
    {
     "say": "An assumption is believed but not confirmed: about five hundred users in the first month.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "An issue has already happened: the test server has been down since Tuesday.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "A dependency: design must finish the checkout screens before development can start.",
     "hl": 3,
     "dim": true
    },
    {
     "say": "A risk might happen; an issue already has. Raise risks early.",
     "hl": [
      0,
      2
     ],
     "dim": true
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Where you'd use this",
   "title": "A slip spotted a month ahead",
   "nodes": [
    {
     "id": "plan",
     "label": "Plan",
     "x": 12,
     "y": 30,
     "sub": "tasks + milestones",
     "art": "roadmap"
    },
    {
     "id": "track",
     "label": "Track",
     "x": 37,
     "y": 72,
     "sub": "progress on a board",
     "art": "kanban"
    },
    {
     "id": "raid",
     "label": "RAID log",
     "x": 63,
     "y": 30,
     "sub": "reviewed weekly",
     "art": "warning"
    },
    {
     "id": "report",
     "label": "Status update",
     "x": 88,
     "y": 72,
     "sub": "happened, risk, need",
     "art": "presentation"
    }
   ],
   "edges": [
    {
     "from": "plan",
     "to": "track"
    },
    {
     "from": "track",
     "to": "raid"
    },
    {
     "from": "raid",
     "to": "report"
    },
    {
     "from": "raid",
     "to": "plan"
    }
   ],
   "beats": [
    {
     "say": "A launch depends on a partner's integration, logged as a dependency with a named owner.",
     "show": 4,
     "on": "plan",
     "send": {
      "from": "plan",
      "to": "track",
      "label": "dependency"
     }
    },
    {
     "say": "Every week, the owner checks in with the partner.",
     "show": 4,
     "on": "track",
     "send": {
      "from": "track",
      "to": "raid",
      "label": "weekly check-in"
     }
    },
    {
     "say": "One check-in shows a two-week slip, a month before launch. It goes in the log now, as a risk.",
     "show": 4,
     "on": "raid",
     "send": {
      "from": "track",
      "to": "raid",
      "label": "2-week slip"
     }
    },
    {
     "say": "The status update says what happened, what's at risk, and what's needed.",
     "show": 4,
     "on": "report",
     "send": {
      "from": "raid",
      "to": "report",
      "label": "status update"
     }
    },
    {
     "say": "Because the warning came early, the team re-plans instead of missing the launch date.",
     "show": 4,
     "on": "plan",
     "send": {
      "from": "raid",
      "to": "plan",
      "label": "re-plan"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Topic 6.3 · Presenting",
   "title": "Audience analysis for the checkout fix",
   "columns": [
    "Question",
    "Checkout example"
   ],
   "rows": [
    [
     "Who's there?",
     "Leaders"
    ],
    [
     "What they know",
     "Not the tech detail"
    ],
    [
     "What they care about",
     "Lost sales"
    ],
    [
     "What they can decide",
     "Approve the fix"
    ],
    [
     "Key message",
     "Slow pages lose carts"
    ]
   ],
   "beats": [
    {
     "say": "To get budget for a checkout fix, start with the audience: leaders.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "What they know: they don't need twenty slides of technical detail.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "What they care about: lost sales.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "What they can decide: approve the fix. That becomes your ask.",
     "hl": 3,
     "dim": true
    },
    {
     "say": "And the key message is the one sentence you want them to remember.",
     "hl": 4,
     "dim": true
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab",
   "title": "Five slides: lead with the ask",
   "values": [
    "2,000 orders/day",
    "8% of carts lost",
    "Cache + shrink",
    "2 eng, 3 weeks",
    "Ask: approve fix"
   ],
   "beats": [
    {
     "say": "A common mistake: evidence first, with the ask saved for the last slide.",
     "hl": 4,
     "note": "Ask buried at the end"
    },
    {
     "say": "Move the ask to slide one: decision needed today, approve the checkout fix.",
     "vals": [
      "Ask: approve fix",
      "2,000 orders/day",
      "8% of carts lost",
      "Cache + shrink",
      "2 eng, 3 weeks"
     ],
     "hl": 0,
     "note": "Slide 1: the ask"
    },
    {
     "say": "Situation: checkout handles two thousand orders a day.",
     "vals": [
      "Ask: approve fix",
      "2,000 orders/day",
      "8% of carts lost",
      "Cache + shrink",
      "2 eng, 3 weeks"
     ],
     "ok": [
      0
     ],
     "hl": 1
    },
    {
     "say": "Complication: slow pages now lose about eight percent of carts.",
     "vals": [
      "Ask: approve fix",
      "2,000 orders/day",
      "8% of carts lost",
      "Cache + shrink",
      "2 eng, 3 weeks"
     ],
     "ok": [
      0,
      1
     ],
     "hl": 2
    },
    {
     "say": "Resolution: cache product data and shrink images.",
     "vals": [
      "Ask: approve fix",
      "2,000 orders/day",
      "8% of carts lost",
      "Cache + shrink",
      "2 eng, 3 weeks"
     ],
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3
    },
    {
     "say": "At a cost of two engineers for three weeks.",
     "vals": [
      "Ask: approve fix",
      "2,000 orders/day",
      "8% of carts lost",
      "Cache + shrink",
      "2 eng, 3 weeks"
     ],
     "ok": [
      0,
      1,
      2,
      3
     ],
     "hl": 4
    },
    {
     "say": "One idea per slide, with headlines that state the point.",
     "vals": [
      "Ask: approve fix",
      "2,000 orders/day",
      "8% of carts lost",
      "Cache + shrink",
      "2 eng, 3 weeks"
     ],
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "note": "Headlines are statements, not topics"
    },
    {
     "say": "Rehearse it aloud, timed, and keep a backup for any demo.",
     "vals": [
      "Ask: approve fix",
      "2,000 orders/day",
      "8% of carts lost",
      "Cache + shrink",
      "2 eng, 3 weeks"
     ],
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "note": "Rehearse · keep a demo backup"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Where should the ask go in a stakeholder presentation?",
   "options": [
    "On the last slide, after the evidence",
    "After the technical detail",
    "Up front, then situation, complication and resolution"
   ],
   "answer": 2,
   "good": "That's right. State the ask up front so busy listeners know why they're there, then support it with situation, complication and resolution.",
   "bad": "Not quite. State the ask up front so busy listeners know why they're there, then support it with situation, complication and resolution.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Where should the ask go in a stakeholder presentation?",
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
     "Outcome purpose + timed agenda",
     ""
    ],
    [
     "Follow-up with owned, dated actions",
     ""
    ],
    [
     "Task plan with dependencies",
     ""
    ],
    [
     "RAID log + status update",
     ""
    ],
    [
     "Rehearsed five-slide presentation",
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
     "say": "you've written an outcome-based purpose and a timed agenda, and run or observed the meeting,",
     "show": 1
    },
    {
     "say": "you've sent a follow-up with owned, dated actions,",
     "show": 2
    },
    {
     "say": "you've built a task plan with milestones, owners and dependencies,",
     "show": 3
    },
    {
     "say": "you've created a raid log with rated risks, and a status update from it,",
     "show": 4
    },
    {
     "say": "and you've built and rehearsed a five-slide presentation with a clear ask.",
     "show": 5
    },
    {
     "say": "You've finished Communication and Delivery, and the TechLeads track. Well done.",
     "show": 5
    }
   ]
  }
 ]
}
```

---

## Module 6 Completion Checklist
- [ ] Written an outcome-based purpose and timed agenda, and run or observed the meeting
- [ ] Sent a follow-up with owned, dated action items
- [ ] Built a task plan with milestones, owners, and dependencies
- [ ] Created a RAID log with rated risks and written a status update from it
- [ ] Built and rehearsed a five-slide presentation with a clear key message and ask
