<!-- order: 1 -->
# Understanding Badges: A Guide for Companies

Time: about 15 minutes

This short guide explains how members prove their skills on She Model Tech, so you can read a profile and hire with confidence through the Talent Board and job posts. She Model Tech runs on one idea: proof over pedigree. People here earn their standing by doing real project work, not by listing credentials, and once you know how to read that proof, a profile tells you far more than a resume does. Work through the sections in order.

---

## Section 1: Why Proof Over Pedigree

**Goal:** Understand what problem badges solve, so the rest of this guide makes sense.

A resume tells you what someone says they can do. A badge tells you what they have already done, on a real project, reviewed by She Model Tech. That is the difference She Model Tech is built around.

Every badge on the platform was earned by contributing to a real project in a specific role. The member did the work, delivered something, and had that contribution reviewed, so nothing on a profile is self-awarded. When you see a badge, you are reading a record of completed, reviewed work, which removes most of the guesswork that makes early-career hiring risky.

Here is how that review works. When the team's work is done, the project lead submits it, with its GitHub repository, to She Model Tech. She Model Tech approves it, asks for changes, or rejects it. Only after She Model Tech approves the project can the lead award badges, and a rejected project awards none. Each member picks the badge track the project counts toward when applying; the lead can change it, with a reason the member sees.

### Ratings

Once the project is approved, the lead rates each member's contribution: **poor**, **fair**, **good**, or **excellent**. A poor rating means no badge for that project. Fair, good, and excellent earn the badge, and the rating is shown on the badge on the member's profile, so every badge you see also tells you how well that person contributed.

A badge is not a certificate from a course, and it is not a test score. Someone can watch a hundred tutorials and still have zero badges, because badges only come from shipping work with a team. A member with three badges has finished three real projects, which is a stronger signal than any number of finished courses.

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "trophy",
   "kicker": "Section 1 · Proof over pedigree",
   "title": "What badges solve",
   "beats": [
    {
     "say": "Welcome to Understanding Badges, a guide for companies."
    },
    {
     "say": "She Model Tech runs on one idea: proof over pedigree."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "The difference",
   "title": "Resume versus badge",
   "columns": [
    "Question",
    "Resume",
    "Badge"
   ],
   "rows": [
    [
     "Who writes it?",
     "The candidate",
     "Earned, not written"
    ],
    [
     "Based on",
     "Claims",
     "Real project work"
    ],
    [
     "Checked?",
     "Unverified",
     "Lead + She Model Tech"
    ],
    [
     "Tells you",
     "What they say",
     "What they did"
    ]
   ],
   "beats": [
    {
     "say": "A resume tells you what someone says they can do.",
     "col": 1
    },
    {
     "say": "A badge tells you what they've already done, on a real project.",
     "col": 2
    },
    {
     "say": "The big difference is the check. The work was reviewed before the badge appeared.",
     "hl": 2,
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "How it works",
   "title": "How real work becomes a badge",
   "nodes": [
    {
     "id": "pick",
     "label": "Member applies",
     "x": 10,
     "y": 30,
     "sub": "picks one track",
     "art": "idcard"
    },
    {
     "id": "team",
     "label": "Team builds",
     "x": 32,
     "y": 72,
     "sub": "6-week cohort project",
     "art": "people"
    },
    {
     "id": "review",
     "label": "Project review",
     "x": 55,
     "y": 30,
     "sub": "by She Model Tech",
     "art": "search"
    },
    {
     "id": "rate",
     "label": "Lead rates work",
     "x": 75,
     "y": 72,
     "sub": "for each member",
     "art": "star"
    },
    {
     "id": "badge",
     "label": "Badge",
     "x": 92,
     "y": 30,
     "sub": "on her profile",
     "art": "trophy"
    }
   ],
   "edges": [
    {
     "from": "pick",
     "to": "team"
    },
    {
     "from": "team",
     "to": "review"
    },
    {
     "from": "review",
     "to": "rate"
    },
    {
     "from": "rate",
     "to": "badge"
    }
   ],
   "beats": [
    {
     "say": "A member applies to a She Model Tech cohort project, and picks the badge track it counts toward.",
     "show": 1,
     "on": "pick"
    },
    {
     "say": "She joins a team with a lead, and they build for six weeks.",
     "show": 2,
     "on": "team",
     "send": {
      "from": "pick",
      "to": "team",
      "label": "TechDev track"
     }
    },
    {
     "say": "When the work is done, the lead submits it, with its GitHub repository, to She Model Tech.",
     "show": 3,
     "on": "review",
     "send": {
      "from": "team",
      "to": "review",
      "label": "GitHub repo"
     }
    },
    {
     "say": "She Model Tech approves it, asks for changes, or rejects it. No approval, no badges.",
     "show": 3,
     "on": "review"
    },
    {
     "say": "Once it's approved, the lead rates each member's contribution, and confirms her track.",
     "show": 4,
     "on": "rate",
     "send": {
      "from": "review",
      "to": "rate",
      "label": "approved"
     }
    },
    {
     "say": "The badge lands on her profile, with that rating. Nothing is self-awarded.",
     "show": 5,
     "on": "badge",
     "send": {
      "from": "rate",
      "to": "badge",
      "label": "badge · Good"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Ratings",
   "title": "Every badge carries a rating",
   "columns": [
    "Lead's rating",
    "Badge?",
    "Shown on badge"
   ],
   "rows": [
    [
     "Excellent",
     "Yes",
     "Excellent"
    ],
    [
     "Good",
     "Yes",
     "Good"
    ],
    [
     "Fair",
     "Yes",
     "Fair"
    ],
    [
     "Poor",
     "No badge",
     "—"
    ]
   ],
   "beats": [
    {
     "say": "The lead rates each member's contribution on four steps.",
     "col": 0
    },
    {
     "say": "Excellent, good or fair: the badge is awarded, and the rating shows on it.",
     "hl": [
      0,
      1,
      2
     ],
     "dim": true,
     "col": 2,
     "sql": "Badge awarded only if the rating is not Poor"
    },
    {
     "say": "Poor: no badge for that project at all.",
     "hl": 3,
     "dim": true
    },
    {
     "say": "So every badge you see also tells you how well that person contributed.",
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
   "kind": "array",
   "kicker": "What a badge isn't",
   "title": "Learning earns zero badges",
   "values": [
    "Tutorial",
    "Course",
    "Tutorial",
    "Project 1",
    "Course",
    "Project 2",
    "Tutorial",
    "Project 3"
   ],
   "beats": [
    {
     "say": "Here's one member's year: tutorials, courses, and projects."
    },
    {
     "say": "Tutorials and courses teach, but they don't earn badges. A badge isn't a certificate or a test score.",
     "gone": [
      0,
      1,
      2,
      4,
      6
     ],
     "note": "Learning: 0 badges"
    },
    {
     "say": "Only finished, reviewed team projects count.",
     "gone": [
      0,
      1,
      2,
      4,
      6
     ],
     "ok": [
      3,
      5,
      7
     ],
     "note": "3 projects → 3 badges"
    },
    {
     "say": "Three badges means three real projects, a stronger signal than any number of courses.",
     "gone": [
      0,
      1,
      2,
      4,
      6
     ],
     "ok": [
      3,
      5,
      7
     ],
     "note": "Proof over pedigree"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does a badge on She Model Tech represent?",
   "options": [
    "A course the member finished",
    "Completed, reviewed work on a real project",
    "A test score"
   ],
   "answer": 1,
   "good": "That's right. Every badge was earned by contributing to a real project in a specific role, and that work was reviewed.",
   "bad": "Not quite. Every badge was earned by contributing to a real project in a specific role, and that work was reviewed.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does a badge on She Model Tech represent?",
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
     "Proof over pedigree, understood",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Section 1.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you can explain why proven work beats stated credentials.",
     "show": 1
    },
    {
     "say": "Next, in Section 2, the six tracks.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Section 2: The Six Tracks

**Goal:** Learn the six skill areas, so you can match a member to the work you need done.

Every badge belongs to one of six tracks. Each track is a family of related tech roles, and the track tells you the kind of work a member has proven they can do:

- **TechDev** (Coding Developer): writes and ships software across frontend, backend, mobile, and full-stack.
- **TechArchs** (Low/No-Code Developer): builds working products on no-code and low-code platforms, and automates workflows.
- **TechQA** (Quality Tester): ensures software quality through testing, reviews, and quality control.
- **TechGuard** (Network and Cybersecurity): protects systems and networks, and runs cloud administration and DevOps.
- **TechPO** (Product / Project Owner): owns product vision, requirements, and the backlog, and steers projects to completion. The lead of every free project earns a TechPO badge (never on paid projects, and never for company accounts).
- **TechLeads** (Non-Technical Roles): fills delivery and non-coding roles such as project management, technical writing, and research.

A member can hold badges in more than one track. Someone with TechDev and TechLeads badges has proven both hands-on building and delivery skills, which is the kind of range a small team often needs.

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "puzzle",
   "kicker": "Section 2 · The six tracks",
   "title": "Match a member to the work",
   "beats": [
    {
     "say": "Welcome to Section 2."
    },
    {
     "say": "Every badge belongs to one of six tracks. The track tells you the kind of work a member has proven they can do."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "The six tracks",
   "title": "Six families of tech roles",
   "columns": [
    "Track",
    "Role family",
    "Proven work"
   ],
   "rows": [
    [
     "TechDev",
     "Coding developer",
     "Writes, ships software"
    ],
    [
     "TechArchs",
     "Low/no-code developer",
     "No-code builds, flows"
    ],
    [
     "TechQA",
     "Quality tester",
     "Testing, reviews, QC"
    ],
    [
     "TechGuard",
     "Network + security",
     "Network, cloud, DevOps"
    ],
    [
     "TechPO",
     "Product/project owner",
     "Vision, backlog"
    ],
    [
     "TechLeads",
     "Non-technical roles",
     "PM, writing, research"
    ]
   ],
   "beats": [
    {
     "say": "Tech Dev: coding developers, who write and ship software across frontend, backend, mobile, and full-stack.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Tech Archs: low and no-code developers, who build products and automate workflows.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "Tech Q A: quality testers, through testing, reviews, and quality control.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "Tech Guard: network and cybersecurity, plus cloud administration and Dev Ops.",
     "hl": 3,
     "dim": true
    },
    {
     "say": "Tech P O: product or project owners, who own the vision, requirements and backlog.",
     "hl": 4,
     "dim": true
    },
    {
     "say": "And Tech Leads: non-technical roles, like project management, technical writing, and research.",
     "hl": 5,
     "dim": true
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "On a project",
   "title": "One project, several tracks",
   "nodes": [
    {
     "id": "proj",
     "label": "Cohort project",
     "x": 50,
     "y": 50,
     "sub": "reviewed + approved",
     "art": "rocket"
    },
    {
     "id": "lead",
     "label": "Lead",
     "x": 15,
     "y": 20,
     "sub": "earns TechPO",
     "art": "flag"
    },
    {
     "id": "dev",
     "label": "Developer",
     "x": 85,
     "y": 20,
     "sub": "picked TechDev",
     "art": "code"
    },
    {
     "id": "qa",
     "label": "Tester",
     "x": 15,
     "y": 80,
     "sub": "picked TechQA",
     "art": "test"
    },
    {
     "id": "writer",
     "label": "Tech writer",
     "x": 85,
     "y": 80,
     "sub": "picked TechLeads",
     "art": "pencil"
    }
   ],
   "edges": [
    {
     "from": "proj",
     "to": "lead"
    },
    {
     "from": "proj",
     "to": "dev"
    },
    {
     "from": "proj",
     "to": "qa"
    },
    {
     "from": "proj",
     "to": "writer"
    }
   ],
   "beats": [
    {
     "say": "One cohort project usually covers several tracks.",
     "show": 1,
     "on": "proj"
    },
    {
     "say": "Each member picks one track for the project when applying.",
     "show": 5,
     "on": [
      "dev",
      "qa",
      "writer"
     ]
    },
    {
     "say": "When the project is approved, the developer earns a Tech Dev badge.",
     "show": 5,
     "on": "dev",
     "send": {
      "from": "proj",
      "to": "dev",
      "label": "TechDev badge"
     }
    },
    {
     "say": "The tester, Tech Q A.",
     "show": 5,
     "on": "qa",
     "send": {
      "from": "proj",
      "to": "qa",
      "label": "TechQA badge"
     }
    },
    {
     "say": "The technical writer, Tech Leads.",
     "show": 5,
     "on": "writer",
     "send": {
      "from": "proj",
      "to": "writer",
      "label": "TechLeads badge"
     }
    },
    {
     "say": "And the lead of every free project earns a Tech P O badge automatically.",
     "show": 5,
     "on": "lead",
     "send": {
      "from": "proj",
      "to": "lead",
      "label": "TechPO badge"
     }
    },
    {
     "say": "If someone's work fit a different track, the lead can change it, with a reason the member sees.",
     "show": 5,
     "on": "writer"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Range",
   "title": "Badges in more than one track",
   "values": [
    "TechDev",
    "TechLeads",
    "TechDev",
    "TechDev",
    "TechLeads"
   ],
   "beats": [
    {
     "say": "Here are one member's five badges, in the order she earned them."
    },
    {
     "say": "Three are Tech Dev: proven hands-on building.",
     "hl": [
      0,
      2,
      3
     ],
     "note": "TechDev: 3 badges"
    },
    {
     "say": "Two are Tech Leads: proven delivery.",
     "hl": [
      1,
      4
     ],
     "note": "TechLeads: 2 badges"
    },
    {
     "say": "Building and delivery, both proven. That's the range a small team often needs.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "note": "Two tracks, both proven"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Which track does every project lead earn a badge in?",
   "options": [
    "TechPO",
    "TechLeads",
    "TechDev"
   ],
   "answer": 0,
   "good": "That's right. Every project lead earns a Tech P O badge, for Product or Project Owner.",
   "bad": "Not quite. Every project lead earns a Tech P O badge, for Product or Project Owner.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Which track does every project lead earn a badge in?",
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
     "You know the six tracks",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Section 2.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you know the six tracks and the work each one represents.",
     "show": 1
    },
    {
     "say": "Next, in Section 3, reading badge levels.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Section 3: Reading Badge Levels

**Goal:** Learn what the level on a badge means, so you can gauge depth, not just presence.

Badges within a track add up to a level, and that level reflects how much proven work a member has in that track, not how long they have been a member. As a member completes more projects in a track, their level in that track rises: **Novice** (1–2 badges), **Associate** (3–6), **Advanced** (7–11), and **Expert** (12 or more). A higher level means more delivered and reviewed work in that specific area.

A member can be advanced in one track and a beginner in another, and that is normal and useful information. Level tells you depth: for a small, well-scoped task, an eager lower-level member who interviews well can be ideal, while for something you cannot afford to get wrong, you should weight the level in the exact track the work falls under.

Always pair the level with the track. An advanced TechQA member is a strong tester, but that says nothing about their coding depth, so match the level to the track that fits your need. This is the most common misread: a high level is only high for the track it sits in.

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "growth",
   "kicker": "Section 3 · Reading badge levels",
   "title": "Depth, not just presence",
   "beats": [
    {
     "say": "Welcome to Section 3."
    },
    {
     "say": "Badges within a track add up to a level. It reflects proven work in that track, not how long someone has been a member."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Levels",
   "title": "Four levels, counted per track",
   "columns": [
    "Level",
    "Badges in one track"
   ],
   "rows": [
    [
     "Novice",
     "1 to 2"
    ],
    [
     "Associate",
     "3 to 6"
    ],
    [
     "Advanced",
     "7 to 11"
    ],
    [
     "Expert",
     "12 or more"
    ]
   ],
   "beats": [
    {
     "say": "A level is just a count of badges in one track.",
     "sql": "Level = number of badges in that one track"
    },
    {
     "say": "Novice, one to two badges.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Associate, three to six.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "Advanced, seven to eleven.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "Expert, twelve or more.",
     "hl": 3,
     "dim": true
    },
    {
     "say": "Time on the platform doesn't count. Only delivered, reviewed work in that track.",
     "col": 1
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Worked example",
   "title": "Advanced in one track, Novice in another",
   "values": [
    "TechQA",
    "TechQA",
    "TechQA",
    "TechDev",
    "TechQA",
    "TechQA",
    "TechQA",
    "TechQA"
   ],
   "beats": [
    {
     "say": "Here are one member's eight badges, oldest first."
    },
    {
     "say": "Her first two are Tech Q A. That makes her a Novice tester.",
     "hl": [
      0,
      1
     ],
     "note": "TechQA: 2 → Novice"
    },
    {
     "say": "A third Tech Q A badge moves her up to Associate.",
     "hl": [
      0,
      1,
      2
     ],
     "note": "TechQA: 3 → Associate"
    },
    {
     "say": "Then one Tech Dev badge. It's counted separately: Novice in Tech Dev.",
     "hl": 3,
     "note": "TechDev: 1 → Novice"
    },
    {
     "say": "Four more Tech Q A badges make seven. She's Advanced in Tech Q A.",
     "hl": [
      0,
      1,
      2,
      4,
      5,
      6,
      7
     ],
     "note": "TechQA: 7 → Advanced"
    },
    {
     "say": "So for a coding role, read her Tech Dev level: Novice, not Advanced.",
     "hl": 3,
     "gone": [
      0,
      1,
      2,
      4,
      5,
      6,
      7
     ],
     "note": "Coding depth: TechDev Novice"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Using level",
   "title": "Match level to the stakes",
   "columns": [
    "Your need",
    "Read this track",
    "What to weigh"
   ],
   "rows": [
    [
     "Small, scoped task",
     "Matching track",
     "Interview; any level"
    ],
    [
     "Can't-fail project",
     "Exact track",
     "Higher level"
    ],
    [
     "Coding role",
     "TechDev",
     "TechDev level only"
    ],
    [
     "Testing role",
     "TechQA",
     "TechQA level only"
    ]
   ],
   "beats": [
    {
     "say": "For a small, well-scoped task, an eager lower-level member who interviews well can be ideal.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "For something you can't afford to get wrong, weight the level in the exact track the work falls under.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "And always pair level with track. A high level is only high for the track it sits in.",
     "hl": [
      2,
      3
     ],
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "An advanced TechQA member applies for a coding role. What does their level tell you about coding depth?",
   "options": [
    "They're an advanced coder too",
    "They're at least an associate coder",
    "Nothing, the level only applies to TechQA"
   ],
   "answer": 2,
   "good": "That's right. A high level is only high for the track it sits in, so match the level to the track that fits your need.",
   "bad": "Not quite. A high level is only high for the track it sits in, so match the level to the track that fits your need.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "An advanced TechQA member applies for a coding role. What does their level tell you about coding depth?",
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
     "Levels read as depth per track",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Section 3.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you can read a level as depth within one track.",
     "show": 1
    },
    {
     "say": "Next, in Section 4, how hiring works.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Section 4: How Hiring Works

**Goal:** Learn how to turn a strong profile into a hire.

Members earn badges on **cohort projects** run by She Model Tech: 6-week team projects with a lead, where She Model Tech reviews the finished work. Companies don't run projects on the platform; you hire through **job posts**.

- **Browse the Talent Board** to find members: filter by track, or search by name or specialisation, then open their profiles to see each badge, its level, its contribution rating, and the project behind it.
- **Message members** you're interested in. Free company accounts can start 5 new conversations a month; company tiers include unlimited messaging.
- **Post a job** (full-time, part-time, contract, or internship) with your own application link or email and the dates applications are open. Job posting is included in company tiers and needs a verified company account. Verification is free.

Members apply through your link or email, so your own hiring process stays the same. Read their badges to judge fit, then interview as you normally would.

You may also see **paid projects** on member profiles. These are run and paid for by She Model Tech for members 18 and older. They don't award badges, but they show the member has delivered paid team work.

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "search",
   "kicker": "Section 4 · How hiring works",
   "title": "From profile to hire",
   "beats": [
    {
     "say": "Welcome to Section 4."
    },
    {
     "say": "Members earn badges on cohort projects run by She Model Tech: six-week team projects with a lead, where She Model Tech reviews the finished work."
    },
    {
     "say": "Companies don't run projects on the platform. You hire through job posts."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Hiring",
   "title": "From cohort project to your hire",
   "nodes": [
    {
     "id": "smt",
     "label": "She Model Tech",
     "x": 10,
     "y": 30,
     "sub": "runs cohort projects",
     "art": "rocket"
    },
    {
     "id": "board",
     "label": "Talent Board",
     "x": 35,
     "y": 75,
     "sub": "filter by track",
     "art": "search"
    },
    {
     "id": "you",
     "label": "Your company",
     "x": 60,
     "y": 30,
     "sub": "verified account",
     "art": "idcard"
    },
    {
     "id": "member",
     "label": "Member",
     "x": 88,
     "y": 25,
     "sub": "badges on profile",
     "art": "persona"
    },
    {
     "id": "job",
     "label": "Job post",
     "x": 85,
     "y": 80,
     "sub": "your link or email",
     "art": "megaphone"
    }
   ],
   "edges": [
    {
     "from": "smt",
     "to": "board"
    },
    {
     "from": "board",
     "to": "you"
    },
    {
     "from": "you",
     "to": "member"
    },
    {
     "from": "you",
     "to": "job"
    },
    {
     "from": "job",
     "to": "member"
    }
   ],
   "beats": [
    {
     "say": "Reviewed badges from cohort projects appear on members' profiles, and on the Talent Board.",
     "show": 2,
     "on": "board",
     "send": {
      "from": "smt",
      "to": "board",
      "label": "badges"
     }
    },
    {
     "say": "You filter the Talent Board by track, then open profiles to see each badge, its level, and the project behind it.",
     "show": 3,
     "on": "you",
     "send": {
      "from": "board",
      "to": "you",
      "label": "profiles"
     }
    },
    {
     "say": "Message the members you're interested in.",
     "show": 4,
     "on": "member",
     "send": {
      "from": "you",
      "to": "member",
      "label": "message"
     }
    },
    {
     "say": "Or post a job: full-time, part-time, contract, or internship, with the dates applications are open.",
     "show": 5,
     "on": "job",
     "send": {
      "from": "you",
      "to": "job",
      "label": "job post"
     }
    },
    {
     "say": "Members apply through your own link or email, so your hiring process stays the same.",
     "show": 5,
     "on": "member",
     "send": {
      "from": "member",
      "to": "job",
      "label": "applies"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Accounts",
   "title": "Free account or company tier",
   "columns": [
    "Feature",
    "Free company",
    "Company tier"
   ],
   "rows": [
    [
     "Browse Talent Board",
     "Yes",
     "Yes"
    ],
    [
     "New conversations",
     "5 a month",
     "Unlimited"
    ],
    [
     "Post a job",
     "No",
     "Yes, once verified"
    ],
    [
     "Verification",
     "Free",
     "Free"
    ]
   ],
   "beats": [
    {
     "say": "Any company account can browse the Talent Board.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "A free account can start five new conversations a month. Company tiers include unlimited messaging.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "Job posting is included in company tiers, and needs a verified company account.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "And verification itself is free.",
     "hl": 3,
     "dim": true
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "On profiles",
   "title": "Cohort projects and paid projects",
   "columns": [
    "",
    "Cohort project",
    "Paid project"
   ],
   "rows": [
    [
     "Run by",
     "She Model Tech",
     "She Model Tech"
    ],
    [
     "Awards a badge?",
     "Yes, after review",
     "No, never"
    ],
    [
     "Members paid?",
     "No",
     "Yes"
    ],
    [
     "Who can join",
     "Any member",
     "18 and older"
    ],
    [
     "Shows you",
     "Reviewed skill",
     "Paid team work"
    ]
   ],
   "beats": [
    {
     "say": "Badges come from cohort projects, after She Model Tech reviews the work.",
     "col": 1
    },
    {
     "say": "You may also see paid projects on profiles. She Model Tech runs and pays for those too.",
     "col": 2
    },
    {
     "say": "Paid projects never award badges.",
     "hl": 1,
     "dim": true,
     "col": 2
    },
    {
     "say": "They're open to members eighteen and older.",
     "hl": 3,
     "dim": true,
     "col": 2
    },
    {
     "say": "What they show you is that the member has delivered paid team work.",
     "hl": 4,
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "How do companies hire members on She Model Tech?",
   "options": [
    "By running their own projects on the platform",
    "Through job posts, plus the Talent Board and messages",
    "By awarding badges"
   ],
   "answer": 1,
   "good": "That's right. Companies don't run projects on the platform. You browse the Talent Board, message members, and hire through job posts.",
   "bad": "Not quite. Companies don't run projects on the platform. You browse the Talent Board, message members, and hire through job posts.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "How do companies hire members on She Model Tech?",
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
     "Talent Board, messages, job posts",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Section 4.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you know how to use the Talent Board, messages and job posts.",
     "show": 1
    },
    {
     "say": "Next, in Section 5, putting it together to hire with confidence.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Section 5: Putting It Together to Hire With Confidence

**Goal:** Combine everything above into a simple way to read any profile.

You now have every piece, and here is a reliable order for reading a profile:

1. Look at which tracks the member holds badges in. This tells you the kind of work they can do.
2. Look at the level in the track you care about. This tells you how much proven depth they have there.
3. Look at the number of badges. This tells you how consistently they deliver real, shipped work.

Each badge also shows the lead's contribution rating, which adds one more piece of evidence.

In under a minute you can move from a name to a grounded, evidence-based read on whether someone fits your role. When a profile fits, message the member or point them to your job post.

### What You Learned
- ✅ Why proven work beats stated credentials on She Model Tech
- ✅ The six tracks and the work each one represents
- ✅ How badge levels show depth within a track, and what contribution ratings add
- ✅ How to hire: the Talent Board, messages, and job posts
- ✅ A fast, reliable order for reading any member profile

**Deliverable:** The ability to read any She Model Tech profile and judge fit from evidence, so you can hire with confidence.

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "idcard",
   "kicker": "Section 5 · Putting it together",
   "title": "Hire with confidence",
   "beats": [
    {
     "say": "Welcome to the last section."
    },
    {
     "say": "You now have every piece. Here's a reliable order for reading any profile."
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Reading a profile",
   "title": "A reliable order",
   "values": [
    "Tracks",
    "Level in your track",
    "Badge count",
    "Act"
   ],
   "beats": [
    {
     "say": "First, the tracks: the kind of work they can do.",
     "hl": 0,
     "ptr": {
      "step": 0
     },
     "note": "What kind of work?"
    },
    {
     "say": "Second, the level in the track you care about: how much proven depth they have there.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "step": 1
     },
     "note": "How deep, in your track?"
    },
    {
     "say": "Third, the number of badges: how consistently they deliver real, shipped work.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "step": 2
     },
     "note": "How consistent?"
    },
    {
     "say": "Then act on what you've read.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3,
     "ptr": {
      "step": 3
     },
     "note": "Message or job post"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Worked example",
   "title": "Reading one profile for a developer role",
   "columns": [
    "Track",
    "Badges",
    "Level"
   ],
   "rows": [
    [
     "TechDev",
     "4",
     "Associate"
    ],
    [
     "TechLeads",
     "2",
     "Novice"
    ],
    [
     "TechQA",
     "1",
     "Novice"
    ]
   ],
   "beats": [
    {
     "say": "Say you're hiring a developer, and you open this profile.",
     "sql": "Hiring: developer"
    },
    {
     "say": "Step one, tracks: she's proven development, delivery, and testing work.",
     "col": 0
    },
    {
     "say": "Step two, your track: four Tech Dev badges, so she's an Associate there.",
     "hl": 0,
     "dim": true,
     "col": 2
    },
    {
     "say": "Step three, the count: seven badges in all, so she delivers consistently.",
     "col": 1,
     "sql": "4 + 2 + 1 = 7 badges"
    },
    {
     "say": "Each badge also shows the lead's contribution rating, which adds one more piece of evidence.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 1
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Result",
   "title": "From a name to a next step",
   "nodes": [
    {
     "id": "profile",
     "label": "Profile",
     "x": 12,
     "y": 50,
     "sub": "a name",
     "art": "idcard"
    },
    {
     "id": "read",
     "label": "Your read",
     "x": 48,
     "y": 50,
     "sub": "tracks, level, count",
     "art": "search"
    },
    {
     "id": "msg",
     "label": "Message her",
     "x": 86,
     "y": 20,
     "sub": "start a conversation",
     "art": "chat"
    },
    {
     "id": "job",
     "label": "Your job post",
     "x": 86,
     "y": 80,
     "sub": "apply on your site",
     "art": "megaphone"
    }
   ],
   "edges": [
    {
     "from": "profile",
     "to": "read"
    },
    {
     "from": "read",
     "to": "msg"
    },
    {
     "from": "read",
     "to": "job"
    }
   ],
   "beats": [
    {
     "say": "In under a minute, you move from a name to a grounded, evidence-based read on fit.",
     "show": 2,
     "on": "read",
     "send": {
      "from": "profile",
      "to": "read",
      "label": "under 1 minute"
     }
    },
    {
     "say": "When a profile fits, message the member,",
     "show": 3,
     "on": "msg",
     "send": {
      "from": "read",
      "to": "msg",
      "label": "hello"
     }
    },
    {
     "say": "or point them to your job post.",
     "show": 4,
     "on": "job",
     "send": {
      "from": "read",
      "to": "job",
      "label": "apply link"
     }
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "In the reading order, what does the number of badges tell you?",
   "options": [
    "The member's level in every track",
    "How long they've been a member",
    "How consistently they deliver real, shipped work"
   ],
   "answer": 2,
   "good": "That's right. The number of badges tells you how consistently the member delivers real, shipped work.",
   "bad": "Not quite. The number of badges tells you how consistently the member delivers real, shipped work.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "In the reading order, what does the number of badges tell you?",
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
     "You can read any profile",
     ""
    ],
    [
     "You can judge fit from evidence",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's the final section.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you can read any She Model Tech profile,",
     "show": 1
    },
    {
     "say": "and judge fit from evidence, to hire with confidence.",
     "show": 2
    },
    {
     "say": "You've finished Understanding Badges. Well done.",
     "show": 2
    }
   ]
  }
 ]
}
```
