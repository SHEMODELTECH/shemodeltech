<!-- order: 4 -->
## Module: Agile (TechPO: Product & Project Management)

Time: about 6 hours

**By the end of this module, you'll be able to:**
- Name the Scrum accountabilities, events, and artifacts from the 2020 Scrum Guide and explain what each is for
- Run a mock Sprint: build a Product and Sprint Backlog, write a Sprint Goal, and hold a review and retrospective
- Set up a Kanban board with WIP limits and calculate a rough cycle time
- Estimate backlog items in story points and select a Sprint's worth of work against a velocity
- Write a Definition of Done and explain the problem it prevents
- Compare Scrum's fixed Sprints with Kanban's continuous flow and say when each fits better

**Purpose:** Run product work in short, predictable cycles using Scrum, Kanban, and Sprint Planning.

**Tools needed for this module:** A web browser and a free account with a board tool such as [Trello](https://trello.com) or [Jira](https://www.atlassian.com/software/jira) (Jira's free tier is closer to what real Scrum/Kanban teams use, but Trello works fine for the exercises in this module). No coding environment or installs are required.

### Topic 1: Scrum

#### Concept

**Scrum** is a lightweight Agile framework built around fixed-length iterations called **Sprints**. It defines three **accountabilities**, five **events**, and three **artifacts** that give a team a predictable rhythm for planning, building, and inspecting work. This module follows the official [2020 Scrum Guide](https://scrumguides.org/scrum-guide.html), so you'll see its current terms (older material may say "roles," "ceremonies," "Development Team," or "Daily Standup").

- A **Sprint** is a fixed time period (one month or less, commonly one or two weeks) with a single **Sprint Goal**. Sprints don't change length mid-stream; consistency is part of the point
- The three **accountabilities** are the **Product Owner** (maximizes the value of the product and orders the Product Backlog), the **Scrum Master** (helps the team use Scrum well and removes blockers), and the **Developers** (the people who build each Increment)
- There are **five events**: the **Sprint** itself, which contains the other four: **Sprint Planning** (decide why, what, and how for this Sprint), the **Daily Scrum** (a 15-minute daily check on progress toward the Sprint Goal), the **Sprint Review** (inspect the outcome with stakeholders and adapt), and the **Sprint Retrospective** (improve how the team works)
- There are **three artifacts**, each with a **commitment**:
  - **Product Backlog** (the ordered list of everything that could be built), committed to the **Product Goal** (the long-term objective for the product)
  - **Sprint Backlog** (the Sprint Goal, the items chosen for this Sprint, and a plan to deliver them), committed to the **Sprint Goal**
  - **Increment** (a usable, finished piece of work that adds to everything built before), committed to the **Definition of Done**

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#1e40af', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    PB["<b>Product Backlog</b><br/><br/>Full prioritized<br/>list of work"]
    SP["<b>Sprint Planning</b><br/><br/>Pull work into<br/>Sprint Backlog"]
    S["<b>Sprint</b><br/><br/>Fixed time period,<br/>with Daily Scrums"]
    R["<b>Review &<br/>Retrospective</b><br/><br/>Inspect the Increment,<br/>improve the process"]

    PB ==> SP ==> S ==> R
    R -.-> PB

    style PB fill:#e2e8f0,color:#1a202c,stroke:#1e40af,stroke-width:4px
    style SP fill:#1e40af,color:#fff,stroke:#1e3a8a,stroke-width:4px
    style S fill:#dbeafe,color:#1a202c,stroke:#1e40af,stroke-width:4px
    style R fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- The team commits to the **Sprint Goal**, not to a fixed list of tasks. During the Sprint, scope may be clarified and renegotiated with the Product Owner as more is learned, as long as no changes are made that would endanger the Sprint Goal. This stability is what lets a team actually finish something valuable; constantly adding unrelated work mid-sprint undermines the whole framework
- The **Sprint Review** is a working session, not just a demo. The Scrum Team and stakeholders inspect what was done, discuss progress toward the Product Goal, and agree on what to do next, which often updates the Product Backlog
- The Scrum Master accountability is often misunderstood as a manager, its actual job is closer to a facilitator, removing obstacles and protecting the team's process, not assigning tasks or directing the work itself

#### Where you'd actually use this

Software teams building a product incrementally, where stakeholders want regular, predictable checkpoints to see progress and adjust priorities, especially when work can be broken into pieces small enough to complete within a one- or two-week window.

#### Lab

1. **Create a free account** on Trello or Jira and set up three lists/columns, "Product Backlog," "Sprint Backlog," and "Done."
2. **Write 8 to 10 small backlog items** for a hypothetical product (reuse the plant-care app idea from earlier modules, or pick your own), and place them all in the Product Backlog column.
3. **Run a mock Sprint Planning session**: pick 3 to 4 items you could realistically finish in one week, and move only those into the Sprint Backlog column.
   Write a one-sentence **Sprint Goal** at the top of the Sprint Backlog that explains why these items matter together.
4. **Simulate three Daily Scrums** by writing one sentence each day (for three days) about progress toward the Sprint Goal, what you'll do next, and any blocker, even if the "work" is just planning.
5. **Hold a mock Sprint Review and Retrospective**: write two sentences on what was finished, how it moves the product toward its Product Goal, and what you'd change in the Product Backlog as a result; then write one thing you'd change about how the team works next Sprint.

```lab
{
 "type": "sort",
 "title": "Accountability, event, or artifact?",
 "prompt": "Sort each Scrum term into the right group.",
 "buckets": [
  "Accountability",
  "Event",
  "Artifact"
 ],
 "items": [
  {
   "text": "Product Owner",
   "bucket": "Accountability",
   "why": "Maximizes product value and orders the Product Backlog."
  },
  {
   "text": "Scrum Master",
   "bucket": "Accountability",
   "why": "Helps the team use Scrum well and removes blockers."
  },
  {
   "text": "Daily Scrum",
   "bucket": "Event",
   "why": "A 15-minute daily check on progress toward the Sprint Goal."
  },
  {
   "text": "Sprint Review",
   "bucket": "Event",
   "why": "A working session with stakeholders to inspect the Increment and progress toward the Product Goal."
  },
  {
   "text": "Product Backlog",
   "bucket": "Artifact",
   "why": "The ordered list of everything that could be built; its commitment is the Product Goal."
  },
  {
   "text": "Sprint Backlog",
   "bucket": "Artifact",
   "why": "The Sprint Goal, the items chosen for this Sprint, and the plan to deliver them."
  },
  {
   "text": "Sprint Planning",
   "bucket": "Event",
   "why": "Deciding why, what, and how the team will work this Sprint."
  },
  {
   "text": "Increment",
   "bucket": "Artifact",
   "why": "A usable piece of finished work; its commitment is the Definition of Done."
  }
 ]
}
```

#### Checkpoint
You have a Product Backlog, a Sprint Backlog with a Sprint Goal pulled from it during a mock planning session, three days of simulated Daily Scrum notes, and a mock review and retrospective summary.

#### Quiz
1. What are the three accountabilities in Scrum, and what does each one do?
2. What is the difference between the Product Backlog and the Sprint Backlog?
3. Name the five Scrum events.
4. What does the team commit to during a Sprint, and can the scope change?
5. What is a common misconception about the Scrum Master accountability?

*Answers: 1) The Product Owner maximizes product value and orders the Product Backlog, the Scrum Master helps the team use Scrum well and removes blockers, and the Developers build each Increment. 2) The Product Backlog is the ordered list of everything that could be built (committed to the Product Goal); the Sprint Backlog is the Sprint Goal, the items chosen for this Sprint, and the plan to deliver them. 3) The Sprint itself, plus the four events inside it: Sprint Planning, the Daily Scrum, the Sprint Review, and the Sprint Retrospective. 4) The team commits to the Sprint Goal, not a fixed list; scope can be clarified and renegotiated with the Product Owner as long as the Sprint Goal isn't endangered. 5) That it is a management position, when it is actually closer to a facilitator, focused on removing obstacles and protecting the process rather than assigning tasks or directing the work.*

---

### Topic 2: Kanban

#### Concept

**Kanban** is a more flexible Agile approach built around visualizing work as it flows through stages on a board, with an emphasis on limiting how much is in progress at once, rather than working in fixed-length sprints like Scrum. Where Scrum plans in batches, Kanban is a continuous flow, new work can be pulled in as soon as capacity frees up, not just at the start of a new sprint.

- A **Kanban board** visualizes work as cards moving through columns representing stages (commonly "To Do," "In Progress," "Done")
- **WIP limits** (Work In Progress limits) cap how many cards are allowed in a given column at once, forcing the team to finish existing work before starting new work, rather than starting everything at once and finishing nothing
- **Pull-based flow** means new work is pulled into a column only when there's room under its WIP limit, rather than being pushed in by a manager's schedule
- **Cycle time** measures how long a card takes to move from start to finish, a key Kanban metric for understanding whether flow is actually improving over time

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#7e22ce', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    TD["<b>To Do</b><br/><br/>Waiting to<br/>be pulled"]
    IP["<b>In Progress</b><br/><br/>WIP limit<br/>enforced here"]
    R["<b>Review</b><br/><br/>Also WIP-<br/>limited"]
    D["<b>Done</b><br/><br/>Cycle time<br/>measured to here"]

    TD ==> IP ==> R ==> D

    style TD fill:#e2e8f0,color:#1a202c,stroke:#7e22ce,stroke-width:4px
    style IP fill:#7e22ce,color:#fff,stroke:#581c87,stroke-width:4px
    style R fill:#f3e8ff,color:#1a202c,stroke:#7e22ce,stroke-width:4px
    style D fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- WIP limits feel counterintuitive to beginners, it seems like starting more work should mean finishing more work, but without a limit, everything ends up half-finished, and nothing actually ships, this is Kanban's central insight
- Unlike Scrum, Kanban has no required accountabilities or fixed events, which makes it more adaptable for ongoing support or maintenance work where the flow of incoming tasks is unpredictable, but also means it provides less built-in structure for teams that need one

#### Where you'd actually use this

Ongoing support or maintenance work, bug triage, or any team whose incoming work is unpredictable and doesn't fit neatly into fixed sprint-length batches, where visualizing flow and limiting work-in-progress matters more than planning in advance.

#### Lab

1. **Create a Kanban board** with four columns: "To Do," "In Progress," "Review," "Done."
2. **Set a WIP limit** of 2 on both "In Progress" and "Review." In Jira, you can set column limits in the board settings. Trello doesn't have built-in WIP limits; either add a WIP-limit Power-Up or simply write "(max 2)" in the list name and enforce it yourself.
3. **Add 6 to 8 small tasks** to "To Do" (reuse tasks from Topic 1's backlog, or invent new ones), and pull only up to the WIP limit into "In Progress."
4. **Simulate moving cards through the board** over a few rounds, moving a card to "Review" only when a slot opens up, and to "Done" only after review, respecting the WIP limits the entire time even if it means leaving cards waiting in "To Do."
5. **Note the "start" and "finish" time** (even just a rough timestamp) for two or three cards as they move across the board, and calculate a rough cycle time for each.

#### Checkpoint
You have a Kanban board with enforced WIP limits, cards that moved through it while respecting those limits, and a rough cycle time calculated for at least two cards.

#### Quiz
1. What is a WIP limit, and what problem is it meant to solve?
2. What is the key structural difference between Kanban and Scrum in terms of timing?
3. What does "pull-based flow" mean?
4. What is "cycle time," and why is it a useful metric?
5. Why might Kanban suit ongoing support work better than Scrum?

*Answers: 1) A cap on how many cards are allowed in a column at once, it solves the problem of a team starting too much work at once and finishing very little of it. 2) Kanban is a continuous flow with no fixed-length iterations, Scrum plans and commits to work in fixed-length sprints. 3) New work is pulled into a column only when there's room under its WIP limit, rather than being pushed in on a fixed schedule. 4) How long a card takes to move from start to finish, it's useful because it shows whether a team's flow is actually improving or getting worse over time. 5) Because incoming support work is unpredictable and doesn't fit neatly into fixed sprint-length batches, Kanban's continuous flow adapts to that better than Scrum's batch planning.*

---

### Topic 3: Sprint Planning

#### Concept

**Sprint Planning** is the Scrum event where a team decides exactly what work will be pulled into the upcoming sprint, turning a long, loosely prioritized backlog into a small, concrete, and realistic commitment. Done well, it balances ambition (getting real value delivered) against honesty about how much a team can actually finish.

- **Note:** story points and velocity are common add-on practices many Scrum teams use, but they are **not** part of the Scrum Guide. Scrum only requires that the team forecasts what it can do; how it estimates is up to the team.
- **Story points** are a relative unit of effort or complexity (not time) used to estimate backlog items, commonly using a scale like 1, 2, 3, 5, 8, 13, so a "5" is meant to be roughly five times harder than a "1," not five hours of work
- **Velocity** is how many story points a team has historically completed per sprint, used to estimate how much new work is realistic to commit to
- A **Sprint Goal** is a single, short sentence describing the overall purpose of the Sprint, giving the team's individual tasks a shared "why" beyond just a checklist. It is the team's commitment for the Sprint
- **Definition of Done** (the commitment for the Increment) is the team's agreed checklist for when a piece of work is actually finished (tested, reviewed, deployed), not just "looks complete," this prevents ambiguity about whether something is truly ready

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#262626', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    G["<b>Sprint Goal</b><br/><br/>The 'why' for<br/>this sprint"]
    V["<b>Velocity</b><br/><br/>Historical points<br/>completed per sprint"]
    SP["<b>Story Points</b><br/><br/>Relative effort<br/>estimate per item"]
    DoD["<b>Definition of<br/>Done</b><br/><br/>Agreed checklist<br/>for 'finished'"]

    G ==> SP
    V ==> SP
    SP ==> DoD

    style G fill:#262626,color:#fff,stroke:#262626,stroke-width:4px
    style V fill:#F5F5F5,color:#1a202c,stroke:#262626,stroke-width:4px
    style SP fill:#F5F5F5,color:#1a202c,stroke:#262626,stroke-width:4px
    style DoD fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Story points being relative (not time-based) is a common point of confusion for beginners, the goal is comparing items to each other, not predicting exact hours, that's precisely why velocity (points completed historically) becomes a useful planning tool over time
- Skipping a clear Definition of Done is a common cause of disputes mid-sprint, disagreements about "is this actually finished" almost always trace back to that checklist never being agreed on up front

#### Where you'd actually use this

Any Scrum team preparing to start a new sprint, deciding what's realistic to commit to based on past velocity, and making sure everyone shares the same understanding of the sprint's purpose and what "done" actually means for the work being pulled in.

#### Lab

1. **Reuse the backlog** from Topic 1's Product Backlog.
2. **Assign story points** to each backlog item using a 1, 2, 3, 5, 8 scale, based on relative complexity compared to the other items, not estimated hours.
3. **Assume a velocity** of 10 points per sprint (a made-up but realistic number for a small team), and select only enough items from the backlog to add up to roughly that total.
4. **Write a one-sentence sprint goal** that ties the selected items together around a shared purpose (for example, "Get new users through onboarding without confusion").
5. **Write a short Definition of Done** (3 to 5 checklist items, like "tested," "reviewed by another team member," "deployed to staging") that would apply to every item in this sprint.

#### Checkpoint
You have a sprint's worth of backlog items estimated in story points, selected to roughly match an assumed velocity, tied together with a sprint goal, and paired with a written Definition of Done.

#### Quiz
1. What do story points measure, and what do they deliberately not measure?
2. What is "velocity," and how is it used in planning?
3. What is a sprint goal, and why does it matter beyond just a list of tasks?
4. What is a "Definition of Done," and what problem does it prevent?
5. Why might a team's assumed velocity change over time?

*Answers: 1) They measure relative effort or complexity, they deliberately don't measure estimated time or hours. 2) How many story points a team has historically completed per sprint, it's used to estimate how much new work is realistic to commit to in an upcoming sprint. 3) A single, short sentence describing the sprint's overall purpose, it matters because it gives the team's individual tasks a shared "why" beyond just a checklist of unrelated items. 4) The team's agreed checklist for when work is actually finished, it prevents disputes and ambiguity about whether something is truly ready versus just looking complete. 5) Because velocity is based on historical performance, it can shift as the team's size, skill, or the nature of the work itself changes over time.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "loop",
   "kicker": "Module · Agile",
   "title": "Short, predictable cycles",
   "beats": [
    {
     "say": "Welcome to the Agile module."
    },
    {
     "say": "You'll run product work in short, predictable cycles, using Scrum, Kanban and Sprint Planning."
    },
    {
     "say": "All you need is a browser and a free board tool, like Trello or Jira."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Topic 1 · Scrum",
   "title": "Who does what in Scrum",
   "nodes": [
    {
     "id": "po",
     "label": "Product Owner",
     "sub": "maximises value",
     "x": 12,
     "y": 28,
     "art": "persona"
    },
    {
     "id": "pb",
     "label": "Product Backlog",
     "sub": "→ Product Goal",
     "x": 40,
     "y": 28,
     "art": "kanban"
    },
    {
     "id": "sb",
     "label": "Sprint Backlog",
     "sub": "→ Sprint Goal",
     "x": 70,
     "y": 28,
     "art": "checklist"
    },
    {
     "id": "dev",
     "label": "Developers",
     "sub": "build the work",
     "x": 70,
     "y": 76,
     "art": "people"
    },
    {
     "id": "inc",
     "label": "Increment",
     "sub": "→ Definition of Done",
     "x": 90,
     "y": 52,
     "art": "blocks"
    },
    {
     "id": "sm",
     "label": "Scrum Master",
     "sub": "facilitator",
     "x": 34,
     "y": 76,
     "art": "shield"
    }
   ],
   "edges": [
    {
     "from": "po",
     "to": "pb"
    },
    {
     "from": "pb",
     "to": "sb"
    },
    {
     "from": "sb",
     "to": "dev"
    },
    {
     "from": "dev",
     "to": "inc"
    },
    {
     "from": "sm",
     "to": "dev"
    }
   ],
   "beats": [
    {
     "say": "Scrum is a lightweight Agile framework. Meet its three accountabilities, and its three artifacts.",
     "show": 0
    },
    {
     "say": "First, the Product Owner, who maximises the value of the product.",
     "show": 1,
     "on": "po"
    },
    {
     "say": "They order the Product Backlog, everything that could be built. Its commitment is the Product Goal.",
     "show": 2,
     "on": "pb",
     "send": {
      "from": "po",
      "to": "pb",
      "label": "orders by value"
     }
    },
    {
     "say": "Each Sprint, the top items move into the Sprint Backlog, committed to a Sprint Goal.",
     "show": 3,
     "on": "sb",
     "send": {
      "from": "pb",
      "to": "sb",
      "label": "top items"
     }
    },
    {
     "say": "The Developers take that plan and build the work.",
     "show": 4,
     "on": "dev",
     "send": {
      "from": "sb",
      "to": "dev",
      "label": "the plan"
     }
    },
    {
     "say": "They produce an Increment: usable, finished work, committed to the Definition of Done.",
     "show": 5,
     "on": "inc",
     "send": {
      "from": "dev",
      "to": "inc",
      "label": "finished work"
     }
    },
    {
     "say": "And the Scrum Master removes blockers. A facilitator, not a manager who assigns tasks.",
     "show": 6,
     "on": "sm",
     "send": {
      "from": "sm",
      "to": "dev",
      "label": "blocker removed"
     }
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Topic 1 · Scrum",
   "title": "One Sprint, event by event",
   "nodes": [
    {
     "id": "pb",
     "label": "Product Backlog",
     "sub": "ordered list",
     "x": 12,
     "y": 50,
     "art": "kanban"
    },
    {
     "id": "plan",
     "label": "Sprint Planning",
     "sub": "why · what · how",
     "x": 34,
     "y": 18,
     "art": "calendar"
    },
    {
     "id": "daily",
     "label": "Daily Scrum",
     "sub": "15 min, every day",
     "x": 66,
     "y": 18,
     "art": "stopwatch"
    },
    {
     "id": "review",
     "label": "Sprint Review",
     "sub": "with stakeholders",
     "x": 88,
     "y": 50,
     "art": "presentation"
    },
    {
     "id": "retro",
     "label": "Retrospective",
     "sub": "improve how we work",
     "x": 50,
     "y": 82,
     "art": "sticky"
    }
   ],
   "edges": [
    {
     "from": "pb",
     "to": "plan"
    },
    {
     "from": "plan",
     "to": "daily"
    },
    {
     "from": "daily",
     "to": "review"
    },
    {
     "from": "review",
     "to": "retro"
    },
    {
     "from": "retro",
     "to": "pb"
    }
   ],
   "beats": [
    {
     "say": "Scrum has five events. The Sprint is the container: a fixed period, commonly one or two weeks.",
     "show": 5
    },
    {
     "say": "It opens with Sprint Planning: why, what and how, pulled from the backlog.",
     "on": "plan",
     "send": {
      "from": "pb",
      "to": "plan",
      "label": "top items"
     }
    },
    {
     "say": "Every day, a fifteen minute Daily Scrum checks progress toward the Sprint Goal.",
     "on": "daily",
     "send": {
      "from": "plan",
      "to": "daily",
      "label": "Sprint Backlog + Goal"
     }
    },
    {
     "say": "At the end, the Sprint Review: a working session where stakeholders inspect the Increment.",
     "on": "review",
     "send": {
      "from": "daily",
      "to": "review",
      "label": "Increment"
     }
    },
    {
     "say": "Then the Retrospective, to improve how the team works.",
     "on": "retro",
     "send": {
      "from": "review",
      "to": "retro",
      "label": "what we learned"
     }
    },
    {
     "say": "What they learn updates the backlog, and the next Sprint starts. Same length every time.",
     "on": "pb",
     "send": {
      "from": "retro",
      "to": "pb",
      "label": "next Sprint"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Topic 1 · Scrum",
   "title": "From Product Backlog to Sprint",
   "columns": [
    "#",
    "Backlog item",
    "Value"
   ],
   "rows": [
    [
     "1",
     "Sign up with email",
     "High"
    ],
    [
     "2",
     "Add a plant",
     "High"
    ],
    [
     "3",
     "Watering reminders",
     "High"
    ],
    [
     "4",
     "Plant care tips",
     "Medium"
    ],
    [
     "5",
     "Identify a plant by photo",
     "Medium"
    ],
    [
     "6",
     "Share a plant photo",
     "Low"
    ],
    [
     "7",
     "Dark mode",
     "Low"
    ]
   ],
   "beats": [
    {
     "say": "Here's a Product Backlog for the plant care app: seven small items."
    },
    {
     "say": "The Product Owner has ordered it by value, most valuable at the top.",
     "sql": "Ordered by value, highest first",
     "col": 2
    },
    {
     "say": "In Sprint Planning, the team pulls only what it can finish in a week: the top three.",
     "sql": "Sprint Backlog ← items 1, 2, 3",
     "hl": [
      0,
      1,
      2
     ],
     "dim": true
    },
    {
     "say": "One sentence says why they matter together. That's the Sprint Goal.",
     "sql": "Sprint Goal: A new user can add their first plant\nand get reminded to water it.",
     "hl": [
      0,
      1,
      2
     ],
     "dim": true
    },
    {
     "say": "Mid Sprint, someone asks for dark mode. It's unrelated to the goal, so it waits.",
     "sql": "Mid-Sprint request: Dark mode → stays in the Product Backlog",
     "hl": 6
    },
    {
     "say": "Scope can be renegotiated with the Product Owner, but never in a way that endangers the goal.",
     "hl": [
      0,
      1,
      2
     ],
     "dim": true
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Topic 2 · Kanban",
   "title": "A Kanban board, day by day",
   "columns": [
    "Day",
    "To Do",
    "In Progress (max 2)",
    "Review (max 2)",
    "Done"
   ],
   "rows": [
    [
     "Start",
     "A B C D E F",
     "—",
     "—",
     "—"
    ],
    [
     "Day 1",
     "C D E F",
     "A B",
     "—",
     "—"
    ],
    [
     "Day 2",
     "D E F",
     "B C",
     "A",
     "—"
    ],
    [
     "Day 3",
     "E F",
     "C D",
     "A B",
     "—"
    ],
    [
     "Day 4",
     "F",
     "D E",
     "B C",
     "A"
    ],
    [
     "Day 5",
     "—",
     "E F",
     "C D",
     "A B"
    ]
   ],
   "beats": [
    {
     "say": "Kanban has no Sprints: work flows continuously. Each row is the same board, one day later.",
     "hl": 0
    },
    {
     "say": "Six cards, A to F, wait in To Do. In Progress and Review each have a work in progress limit, a W I P limit, of two.",
     "hl": 0,
     "col": 2,
     "sql": "WIP limit: In Progress 2 · Review 2"
    },
    {
     "say": "Day one. The team pulls A and B. The limit is hit, so C waits.",
     "hl": 1,
     "dim": true,
     "col": 2,
     "sql": "In Progress 2/2 → limit hit, C waits"
    },
    {
     "say": "Day two. A moves to Review, freeing a slot, so C is pulled in. Pulled when there's room, not pushed.",
     "hl": 2,
     "dim": true,
     "sql": "A → Review · slot free → pull C"
    },
    {
     "say": "Day three. B joins A in Review, and D is pulled. Now both limited columns are full.",
     "hl": 3,
     "dim": true,
     "col": 3,
     "sql": "In Progress 2/2 · Review 2/2"
    },
    {
     "say": "So nobody starts E. The team helps review instead: stop starting, start finishing.",
     "hl": 3,
     "dim": true,
     "sql": "Board full → finish before starting"
    },
    {
     "say": "Day four. A is done. That frees Review for C, and In Progress for E.",
     "hl": 4,
     "dim": true,
     "col": 4,
     "sql": "A → Done · C → Review · pull E"
    },
    {
     "say": "Day five. B is done, D moves to Review, and the last card, F, is pulled in.",
     "hl": 5,
     "dim": true,
     "col": 4,
     "sql": "B → Done · D → Review · pull F"
    },
    {
     "say": "Cycle time is start to finish. A started on day one, and finished on day four: three days.",
     "hl": [
      1,
      4
     ],
     "dim": true,
     "sql": "Cycle time A = Day 4 − Day 1 = 3 days"
    },
    {
     "say": "B finished on day five: four days. Track this over time to see if flow improves.",
     "hl": [
      1,
      5
     ],
     "dim": true,
     "sql": "Cycle time B = Day 5 − Day 1 = 4 days"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Topic 2 · Kanban",
   "title": "Start less, finish more",
   "values": [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F"
   ],
   "beats": [
    {
     "say": "Why limit work? Each of six cards needs two days of work, and the team does two days of work each day.",
     "note": "Each card: 2 days of work · Team: 2 days of work per day"
    },
    {
     "say": "With no limit, the team starts all six. After three days, every card is half done.",
     "vals": [
      "50%",
      "50%",
      "50%",
      "50%",
      "50%",
      "50%"
     ],
     "hl": [
      0,
      1,
      2,
      3,
      4,
      5
     ],
     "note": "No limit · after 3 days → 0 cards shipped"
    },
    {
     "say": "Six days of work, and nothing has shipped.",
     "gone": [
      0,
      1,
      2,
      3,
      4,
      5
     ],
     "note": "No limit · after 3 days → 0 cards shipped"
    },
    {
     "say": "With a limit of two, A and B finish in two days. On day three, C and D are half done.",
     "vals": [
      "✓",
      "✓",
      "50%",
      "50%",
      "0%",
      "0%"
     ],
     "gone": [],
     "ok": [
      0,
      1
     ],
     "hl": [
      2,
      3
     ],
     "note": "WIP limit 2 · after 3 days → 2 cards shipped"
    },
    {
     "say": "Same effort, but two cards shipped. That's Kanban's central insight.",
     "ok": [
      0,
      1
     ],
     "note": "Same effort · limit 2 ships 2 · no limit ships 0"
    }
   ]
  },
  {
   "kind": "chart",
   "kicker": "Topic 3 · Sprint Planning",
   "title": "Velocity: what the team really finishes",
   "xlabel": "Sprint 1 → 4",
   "ylabel": "story points done",
   "points": [
    [
     15,
     40
    ],
    [
     35,
     55
    ],
    [
     55,
     45
    ],
    [
     75,
     60
    ]
   ],
   "beats": [
    {
     "say": "Back to Scrum planning. Story points are relative effort, not hours. A five is roughly five times harder than a one."
    },
    {
     "say": "The team's last four Sprints finished eight, eleven, nine and twelve points.",
     "groups": [
      1,
      1,
      1,
      1
     ]
    },
    {
     "say": "Forty points over four Sprints: a velocity of about ten.",
     "groups": [
      1,
      1,
      1,
      1
     ],
     "line": [
      0,
      50
     ]
    },
    {
     "say": "So next Sprint, the team forecasts about ten points. A forecast, not a promise.",
     "marks": [
      [
       95,
       50
      ]
     ]
    },
    {
     "say": "Points and velocity are common add-ons, not part of the Scrum Guide, and velocity shifts as the team changes.",
     "marks": [
      [
       95,
       50
      ]
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Topic 3 · Sprint Planning",
   "title": "Fill the Sprint up to velocity",
   "columns": [
    "#",
    "Backlog item",
    "Points",
    "Running total"
   ],
   "rows": [
    [
     "1",
     "Sign up with email",
     "3",
     "3"
    ],
    [
     "2",
     "Add a plant",
     "2",
     "5"
    ],
    [
     "3",
     "Watering reminders",
     "5",
     "10"
    ],
    [
     "4",
     "Plant care tips",
     "3",
     "13"
    ],
    [
     "5",
     "Identify a plant by photo",
     "8",
     "21"
    ]
   ],
   "beats": [
    {
     "say": "Here's the same backlog, pointed on a one, two, three, five, eight scale.",
     "col": 2
    },
    {
     "say": "Points compare items. Identify by photo is an eight, much harder than sign up, a three.",
     "hl": [
      0,
      4
     ],
     "col": 2
    },
    {
     "say": "Velocity is ten, so the team adds items from the top until it reaches about ten.",
     "sql": "Velocity ≈ 10 points",
     "col": 3
    },
    {
     "say": "Sign up, three. Add a plant, two. Watering reminders, five. That's exactly ten.",
     "sql": "3 + 2 + 5 = 10  ✓ matches velocity",
     "hl": [
      0,
      1,
      2
     ],
     "dim": true,
     "col": 3
    },
    {
     "say": "Care tips would make thirteen. Too much, so it stays in the backlog.",
     "sql": "10 + 3 = 13  ✗ over velocity",
     "hl": 3,
     "col": 3
    },
    {
     "say": "The same three items, under the same Sprint Goal.",
     "sql": "Sprint Goal: A new user can add their first plant\nand get reminded to water it.",
     "hl": [
      0,
      1,
      2
     ],
     "dim": true
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Topic 3 · Sprint Planning",
   "title": "Is it really done?",
   "columns": [
    "Item",
    "Tested",
    "Reviewed",
    "On staging",
    "Done?"
   ],
   "rows": [
    [
     "Sign up with email",
     "✓",
     "✓",
     "✓",
     "Done"
    ],
    [
     "Add a plant",
     "✓",
     "✓",
     "✗",
     "Not yet"
    ],
    [
     "Watering reminders",
     "✓",
     "✗",
     "✗",
     "Not yet"
    ]
   ],
   "beats": [
    {
     "say": "Mid Sprint, someone asks: what's done? Without a checklist, everyone answers differently."
    },
    {
     "say": "So the team agrees a Definition of Done up front: tested, reviewed by a teammate, deployed to staging.",
     "sql": "Definition of Done:\ntested · reviewed by a teammate · deployed to staging",
     "col": 4
    },
    {
     "say": "Sign up passes all three. Done, and part of the Increment.",
     "hl": 0,
     "dim": true,
     "col": 4
    },
    {
     "say": "Add a plant looks complete, but isn't on staging. Not done.",
     "hl": 1,
     "dim": true,
     "col": 3
    },
    {
     "say": "Watering reminders hasn't been reviewed. Not done either.",
     "hl": 2,
     "dim": true,
     "col": 2
    },
    {
     "say": "No argument: the checklist decides. That's the dispute it prevents."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Scrum or Kanban?",
   "title": "Fixed Sprints or continuous flow",
   "columns": [
    "",
    "Scrum",
    "Kanban"
   ],
   "rows": [
    [
     "Timing",
     "Fixed-length Sprints",
     "Continuous flow"
    ],
    [
     "New work enters",
     "At Sprint Planning",
     "When a WIP slot frees up"
    ],
    [
     "Structure",
     "3 accountabilities, 5 events",
     "None required"
    ],
    [
     "Fits best",
     "Product built in increments",
     "Unpredictable support work"
    ]
   ],
   "beats": [
    {
     "say": "So which one? Side by side."
    },
    {
     "say": "Scrum plans in fixed Sprints. Kanban is a continuous flow.",
     "hl": 0
    },
    {
     "say": "Scrum takes new work at Sprint Planning. Kanban pulls it when there's room.",
     "hl": 1
    },
    {
     "say": "Scrum has built-in structure. Kanban requires none: more adaptable, less to lean on.",
     "hl": 2
    },
    {
     "say": "So Scrum fits products built in steady increments. Kanban fits unpredictable work, like support and bug triage.",
     "hl": 3
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why might Kanban suit ongoing support work better than Scrum?",
   "options": [
    "Support work arrives unpredictably, and continuous flow adapts to that",
    "Kanban requires a Scrum Master",
    "Support work always fits into two-week batches"
   ],
   "answer": 0,
   "good": "That's right. Incoming support work is unpredictable and doesn't fit neatly into fixed sprint batches, so Kanban's continuous flow adapts better.",
   "bad": "Not quite. Incoming support work is unpredictable and doesn't fit neatly into fixed sprint batches, so Kanban's continuous flow adapts better.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why might Kanban suit ongoing support work better than Scrum?",
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
     "Mock Sprint run end to end",
     ""
    ],
    [
     "Kanban board with WIP limits and cycle times",
     ""
    ],
    [
     "Sprint planned with goal and Definition of Done",
     ""
    ],
    [
     "Scrum vs Kanban explained",
     ""
    ],
    [
     "Why WIP limits and DoD matter",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's the Agile module.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you've built a Product and Sprint Backlog, three Daily Scrums, and a review and retrospective,",
     "show": 1
    },
    {
     "say": "you've built a Kanban board with W I P limits, and timed at least two cards,",
     "show": 2
    },
    {
     "say": "you've pointed a backlog, matched it to a velocity, and written a Sprint Goal and Definition of Done,",
     "show": 3
    },
    {
     "say": "you can explain fixed Sprints versus continuous flow,",
     "show": 4
    },
    {
     "say": "and you can explain the problem W I P limits and a Definition of Done each prevent.",
     "show": 5
    },
    {
     "say": "You've finished Agile. Well done.",
     "show": 5
    }
   ]
  }
 ]
}
```

---

## Module Completion Checklist
- [ ] Built a Product and Sprint Backlog, simulated three days of Daily Scrums, and written a mock review and retrospective summary
- [ ] Built a Kanban board with enforced WIP limits and calculated a rough cycle time for at least two cards
- [ ] Estimated a backlog in story points, selected work to match an assumed velocity, and written a sprint goal and Definition of Done
- [ ] Can explain the key structural difference between Scrum's fixed sprints and Kanban's continuous flow
- [ ] Can explain why WIP limits and a clear Definition of Done each prevent a specific, common team problem

**Next:** Project Management
