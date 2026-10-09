<!-- certificate: none -->
<!-- order: 1 -->
# Start Here: How the Quality Tester Track Works

Quality assurance (QA) is the work of making sure software does what it should, for the people who use it, before they find the problems themselves. This track takes you from what testing is for, through writing test cases and reporting bugs by hand, to automated, API, performance, mobile, security, and pipeline testing. Read this page first; it takes about ten minutes.

---

## What you'll learn, in order

The modules build on each other, so take them in this order:

1. **QA Fundamentals.** How software gets built (the SDLC), how testing is planned alongside it (the STLC), and the principles that decide what to test. No tools needed.
2. **Manual Testing.** Writing clear test cases, reporting bugs a developer can act on, and exploratory testing. All you need is a web browser and two free practice sites.
3. **Automation Testing.** Turning repeatable checks into code with Selenium and Playwright, and how to write tests that stay reliable.
4. **API Testing.** Testing the services behind an app with Postman and Swagger, and running test suites from the terminal with Newman (or the Postman CLI).
5. **Performance Testing.** Measuring how software behaves under load with Apache JMeter.
6. **Mobile Testing.** Testing Android apps with Android Studio, and iOS apps with Xcode on a Mac.
7. **Security Testing.** Finding common weaknesses with ZAP (now ZAP by Checkmarx), against a practice app built for the purpose.
8. **CI/CD Testing.** Running your tests automatically on every change with GitHub Actions.
9. **Testing AI Agents.** Checking that AI agents complete tasks, call the right tools, and resist prompt injection, with an automated evaluation suite.

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "test",
   "kicker": "Start here · The Quality Tester track",
   "title": "Find the problems before users do",
   "beats": [
    {
     "say": "Welcome to the Quality Tester track."
    },
    {
     "say": "Quality assurance, or Q A, is the work of making sure software does what it should, for the people who use it, before they find the problems themselves."
    },
    {
     "say": "Here's how the track works. It takes about ten minutes."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "What QA is for",
   "title": "Who finds the problem first?",
   "nodes": [
    {
     "id": "dev",
     "label": "Developers",
     "x": 15,
     "y": 30,
     "sub": "build features",
     "art": "code"
    },
    {
     "id": "app",
     "label": "The software",
     "x": 50,
     "y": 30,
     "sub": "a new build",
     "art": "laptop"
    },
    {
     "id": "users",
     "label": "Users",
     "x": 85,
     "y": 30,
     "sub": "the people it's for",
     "art": "people"
    },
    {
     "id": "qa",
     "label": "Tester",
     "x": 50,
     "y": 80,
     "sub": "that's you",
     "art": "search"
    }
   ],
   "edges": [
    {
     "from": "dev",
     "to": "app"
    },
    {
     "from": "app",
     "to": "users"
    },
    {
     "from": "app",
     "to": "qa"
    },
    {
     "from": "qa",
     "to": "dev"
    }
   ],
   "beats": [
    {
     "say": "Developers build a new feature into the software.",
     "show": 2,
     "on": "app",
     "send": {
      "from": "dev",
      "to": "app",
      "label": "new feature"
     }
    },
    {
     "say": "If it goes straight out, the users are the ones who find the problems.",
     "show": 3,
     "on": "users",
     "send": {
      "from": "app",
      "to": "users",
      "label": "users hit a bug"
     }
    },
    {
     "say": "Q A puts a tester in between. You check the build first.",
     "show": 4,
     "on": "qa",
     "send": {
      "from": "app",
      "to": "qa",
      "label": "build to test"
     }
    },
    {
     "say": "When something is wrong, you send the developers a bug report they can act on.",
     "on": "dev",
     "send": {
      "from": "qa",
      "to": "dev",
      "label": "bug report"
     }
    },
    {
     "say": "They fix it, and the software reaches users doing what it should.",
     "on": "users",
     "send": {
      "from": "app",
      "to": "users",
      "label": "it works"
     }
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "The track",
   "title": "Nine modules, each building on the last",
   "values": [
    "Fundamentals",
    "Manual",
    "Automation",
    "API",
    "Performance",
    "Mobile",
    "Security",
    "CI/CD",
    "AI agents"
   ],
   "beats": [
    {
     "say": "The track has nine modules. They build on each other, so take them in order."
    },
    {
     "say": "Modules one and two are done by hand: Q A fundamentals, then manual test cases, bug reports and exploratory testing.",
     "hl": [
      0,
      1
     ],
     "ptr": {
      "start": 0
     },
     "note": "1–2 · by hand"
    },
    {
     "say": "Modules three and four turn checks into code: automated browser tests, then A P I tests.",
     "ok": [
      0,
      1
     ],
     "hl": [
      2,
      3
     ],
     "ptr": {
      "next": 2
     },
     "note": "3–4 · tests as code"
    },
    {
     "say": "Modules five to seven test how software behaves beyond the happy path: under load, on phones, and against attacks.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "hl": [
      4,
      5,
      6
     ],
     "ptr": {
      "next": 4
     },
     "note": "5–7 · load, devices, attacks"
    },
    {
     "say": "And modules eight and nine run your tests on every change, and test A I agents.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
     ],
     "hl": [
      7,
      8
     ],
     "ptr": {
      "end": 8
     },
     "note": "8–9 · pipelines, AI agents"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "The track",
   "title": "Which tools, and when",
   "columns": [
    "#",
    "Module",
    "Tools"
   ],
   "rows": [
    [
     "1–2",
     "Fundamentals, Manual",
     "Just a browser"
    ],
    [
     "3",
     "Automation",
     "Selenium, Playwright"
    ],
    [
     "4",
     "API",
     "Postman/Swagger/Newman"
    ],
    [
     "5",
     "Performance",
     "Apache JMeter"
    ],
    [
     "6",
     "Mobile",
     "Android Studio, Xcode"
    ],
    [
     "7",
     "Security",
     "ZAP by Checkmarx"
    ],
    [
     "8–9",
     "CI/CD, AI agents",
     "Actions; eval suite"
    ]
   ],
   "beats": [
    {
     "say": "Each module needs only a few tools. Here they are, stage by stage.",
     "col": 2
    },
    {
     "say": "For modules one and two, all you need is a web browser and two free practice sites.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Automation uses Selenium and Playwright.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "A P I testing uses Postman and Swagger, with Newman to run suites from the terminal.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "Performance testing uses Apache J Meter. Mobile uses Android Studio, and Xcode on a Mac.",
     "hl": [
      3,
      4
     ],
     "dim": true
    },
    {
     "say": "Security uses ZAP. Then GitHub Actions runs your tests on every change, and module nine uses an automated evaluation suite.",
     "hl": [
      5,
      6
     ],
     "dim": true
    },
    {
     "say": "Every tool is free or has a free tier, and you only install a module's tools when you reach it.",
     "sql": "Install a module's tools when you reach it"
    }
   ]
  },
  {
   "kind": "list",
   "art": "blocks",
   "kicker": "How each module works",
   "title": "The same pattern every time",
   "items": [
    [
     "Concept",
     "Plain language"
    ],
    [
     "Structure at a glance",
     "Building blocks"
    ],
    [
     "Where you'd use this",
     "Real scenario"
    ],
    [
     "Lab",
     "Hands-on"
    ],
    [
     "Checkpoint",
     "Before moving on"
    ],
    [
     "Quiz",
     "Five questions"
    ]
   ],
   "beats": [
    {
     "say": "Every topic follows the same pattern, so you always know what comes next.",
     "show": 0
    },
    {
     "say": "Concept, then structure at a glance, then where you'd actually use it.",
     "show": 3
    },
    {
     "say": "Then a hands-on lab, a checkpoint, and a five question quiz.",
     "show": 6
    }
   ]
  },
  {
   "kind": "quote",
   "art": "shield",
   "kicker": "One rule for the whole track",
   "title": "Only test what you may test",
   "quote": "Only test software you own or have written permission to test.",
   "beats": [
    {
     "say": "One rule applies to the whole track.",
     "show": 0
    },
    {
     "say": "Only test software you own, or have written permission to test.",
     "show": 1
    },
    {
     "say": "The performance and security labs use a deliberately vulnerable practice app, running only on your own computer. Never point those tools at a real site or app.",
     "show": 1
    },
    {
     "say": "When you've worked through the modules, join a project on She Model Tech as a tester. That work earns your Quality Tester badge.",
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
     "What QA is for, and how the modules build",
     ""
    ],
    [
     "The pattern every topic follows",
     ""
    ],
    [
     "Which tools you'll need, and when",
     ""
    ],
    [
     "The permission rule",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's the overview.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you know what Q A is for, and how the nine modules build on each other,",
     "show": 1
    },
    {
     "say": "you know the pattern every topic follows,",
     "show": 2
    },
    {
     "say": "you know which tools you'll need, and when,",
     "show": 3
    },
    {
     "say": "and you know the permission rule for every test you run.",
     "show": 4
    },
    {
     "say": "Next, Module 1: Q A Fundamentals.",
     "show": 4
    }
   ]
  }
 ]
}
```

---

## How each module works

Every topic follows the same pattern, so you always know what comes next:

- **Concept:** what it is, in plain language.
- **Structure at a glance:** the building blocks you'll work with, often as a diagram.
- **Where you'd actually use this:** a real workplace scenario.
- **Lab:** a hands-on exercise you complete yourself.
- **Checkpoint:** what you should be able to do before moving on.
- **Quiz:** five questions, with answers.

Each module lists the tools it needs at the top. Every tool in this track is free or has a free tier that covers the labs, and you only install a module's tools when you reach it. Module 6's iOS topic needs a Mac; if you don't have one, the Android topic covers the same skills.

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "path",
   "kicker": "Start here · How each module works",
   "title": "The same pattern, every topic",
   "beats": [
    {
     "say": "Every topic in this track follows the same pattern, so you always know what comes next."
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "The pattern",
   "title": "Six steps per topic",
   "values": [
    "Concept",
    "Structure",
    "Use it",
    "Lab",
    "Checkpoint",
    "Quiz"
   ],
   "beats": [
    {
     "say": "Here are the six steps of every topic, in order."
    },
    {
     "say": "First, the concept: what it is, in plain language.",
     "hl": 0,
     "ptr": {
      "you": 0
     }
    },
    {
     "say": "Then the structure at a glance: the building blocks, often as a diagram.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "you": 1
     }
    },
    {
     "say": "Next, where you'd actually use this: a real workplace scenario.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "you": 2
     }
    },
    {
     "say": "Then a lab: a hands-on exercise you complete yourself.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3,
     "ptr": {
      "you": 3
     }
    },
    {
     "say": "A checkpoint: what you should be able to do before moving on.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "hl": 4,
     "ptr": {
      "you": 4
     }
    },
    {
     "say": "And finally a quiz: five questions, with answers.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "hl": 5,
     "ptr": {
      "you": 5
     },
     "note": "Then on to the next topic"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "The pattern in action",
   "title": "One real topic: the SDLC",
   "columns": [
    "Step",
    "In Topic 1.1 (SDLC)"
   ],
   "rows": [
    [
     "Concept",
     "Six phases of software"
    ],
    [
     "Structure",
     "Diagram of the phases"
    ],
    [
     "Use it",
     "Where a project stands"
    ],
    [
     "Lab",
     "Walk one requirement"
    ],
    [
     "Checkpoint",
     "Name all six in order"
    ],
    [
     "Quiz",
     "Five questions"
    ]
   ],
   "beats": [
    {
     "say": "Here's the pattern filled in, using the very first topic of Module 1.",
     "col": 1
    },
    {
     "say": "The concept: the six phases software moves through, from idea to retirement.",
     "hl": 0
    },
    {
     "say": "The structure: a diagram of those phases, one handing off to the next.",
     "hl": 1
    },
    {
     "say": "Where you'd use it: working out where a project stands when you join it.",
     "hl": 2
    },
    {
     "say": "The lab: walk one requirement through all six phases.",
     "hl": 3
    },
    {
     "say": "Then the checkpoint, and the quiz, check you've got it before you move on.",
     "hl": [
      4,
      5
     ],
     "dim": true
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Tools",
   "title": "Install as you go",
   "nodes": [
    {
     "id": "m6",
     "label": "Module 6",
     "x": 12,
     "y": 50,
     "sub": "mobile testing",
     "art": "phone"
    },
    {
     "id": "mac",
     "label": "Have a Mac?",
     "x": 50,
     "y": 50,
     "sub": "iOS needs one",
     "art": "laptop"
    },
    {
     "id": "ios",
     "label": "iOS · Xcode",
     "x": 86,
     "y": 22,
     "sub": "on a Mac",
     "art": "phone"
    },
    {
     "id": "and",
     "label": "Android Studio",
     "x": 86,
     "y": 78,
     "sub": "covers the same skills",
     "art": "phone"
    }
   ],
   "edges": [
    {
     "from": "m6",
     "to": "mac"
    },
    {
     "from": "mac",
     "to": "ios"
    },
    {
     "from": "mac",
     "to": "and"
    }
   ],
   "beats": [
    {
     "say": "Each module lists the tools it needs at the top. They're free, or have a free tier that covers the labs.",
     "show": 1,
     "on": "m6"
    },
    {
     "say": "You install them only when you reach that module. Take Module 6, mobile testing.",
     "show": 2,
     "on": "mac",
     "send": {
      "from": "m6",
      "to": "mac",
      "label": "pick a topic"
     }
    },
    {
     "say": "Its i O S topic uses Xcode, which needs a Mac.",
     "show": 3,
     "on": "ios",
     "send": {
      "from": "mac",
      "to": "ios",
      "label": "yes"
     }
    },
    {
     "say": "No Mac? The Android topic, with Android Studio, covers the same skills.",
     "show": 4,
     "on": "and",
     "send": {
      "from": "mac",
      "to": "and",
      "label": "no Mac"
     }
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
     "You know the pattern every topic follows",
     ""
    ],
    [
     "And which tools you'll need, and when",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's this part.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you know the pattern every topic follows,",
     "show": 1
    },
    {
     "say": "and which tools you'll need, and when.",
     "show": 2
    },
    {
     "say": "Next, the one rule for the whole track.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## One rule for the whole track

Only test software you own or have written permission to test. The performance and security labs use a deliberately vulnerable practice app running only on your own computer; never point those tools at a real site or app.

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "shield",
   "kicker": "Start here · One rule",
   "title": "One rule for the whole track",
   "beats": [
    {
     "say": "There's one rule that applies to every test you run in this track."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "The rule",
   "title": "Point the tools only at the practice app",
   "nodes": [
    {
     "id": "tools",
     "label": "Your test tools",
     "x": 14,
     "y": 50,
     "sub": "JMeter, ZAP",
     "art": "gear"
    },
    {
     "id": "lab",
     "label": "Practice app",
     "x": 74,
     "y": 24,
     "sub": "on your own computer",
     "art": "laptop"
    },
    {
     "id": "real",
     "label": "Real site or app",
     "x": 74,
     "y": 78,
     "sub": "never a target",
     "art": "globe"
    }
   ],
   "edges": [
    {
     "from": "tools",
     "to": "lab"
    },
    {
     "from": "tools",
     "to": "real"
    }
   ],
   "beats": [
    {
     "say": "In the performance and security labs, you'll use powerful tools like J Meter and ZAP.",
     "show": 1,
     "on": "tools"
    },
    {
     "say": "They point at a deliberately vulnerable practice app, running only on your own computer.",
     "show": 2,
     "on": "lab",
     "send": {
      "from": "tools",
      "to": "lab",
      "label": "load test"
     }
    },
    {
     "say": "Hammer it, scan it, attack it. That's what it's built for.",
     "on": "lab",
     "send": {
      "from": "tools",
      "to": "lab",
      "label": "security scan"
     }
    },
    {
     "say": "But never point those tools at a real site or app. That's off limits.",
     "show": 3,
     "on": "real"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "The rule",
   "title": "Can I test it?",
   "columns": [
    "Target",
    "OK?",
    "Why"
   ],
   "rows": [
    [
     "An app you own",
     "Yes",
     "It's yours"
    ],
    [
     "Client app, signed OK",
     "Yes",
     "Written permission"
    ],
    [
     "Practice app, your PC",
     "Yes",
     "Built for this"
    ],
    [
     "A real website",
     "No",
     "No permission"
    ],
    [
     "Friend said go ahead",
     "Not yet",
     "Get it in writing"
    ]
   ],
   "beats": [
    {
     "say": "Only test software you own, or have written permission to test. Let's apply it.",
     "sql": "Own it, or written permission?"
    },
    {
     "say": "Software you own: yes.",
     "hl": 0
    },
    {
     "say": "Someone else's app, where you have their permission in writing: yes.",
     "hl": 1
    },
    {
     "say": "The practice app on your own computer: yes, it's built for this.",
     "hl": 2
    },
    {
     "say": "A real website you don't own: no.",
     "hl": 3,
     "col": 1
    },
    {
     "say": "And a spoken okay isn't written permission. Get it in writing first.",
     "hl": 4,
     "col": 2
    }
   ]
  },
  {
   "kind": "quote",
   "art": "lock",
   "kicker": "The rule",
   "title": "Only test what you're allowed to",
   "quote": "Only test software you own or have written permission to test.",
   "beats": [
    {
     "say": "Only test software you own, or have written permission to test.",
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
     "You know the permission rule",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's this part.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you know the permission rule that applies to every test you run.",
     "show": 1
    },
    {
     "say": "Next, what comes after the track.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## After the track

Courses build the skill; a badge proves it. When you've worked through the modules, join a project on She Model Tech as a tester. Your test cases, bug reports, and automated checks become the work that earns your Quality Tester badge.

### What You Learned
- ✅ What QA is for, and how the nine modules build on each other
- ✅ The pattern every topic follows
- ✅ Which tools you'll need, and when
- ✅ The permission rule that applies to every test you run

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "proof",
   "kicker": "Start here · After the track",
   "title": "From skill to proof",
   "beats": [
    {
     "say": "Courses build the skill. A badge proves it."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "What's next",
   "title": "Earn your Quality Tester badge",
   "nodes": [
    {
     "id": "mods",
     "label": "The modules",
     "x": 12,
     "y": 50,
     "sub": "build the skill",
     "art": "book"
    },
    {
     "id": "proj",
     "label": "A real project",
     "x": 50,
     "y": 50,
     "sub": "on She Model Tech",
     "art": "people"
    },
    {
     "id": "badge",
     "label": "Your badge",
     "x": 88,
     "y": 50,
     "sub": "Quality Tester",
     "art": "trophy"
    }
   ],
   "edges": [
    {
     "from": "mods",
     "to": "proj"
    },
    {
     "from": "proj",
     "to": "badge"
    }
   ],
   "beats": [
    {
     "say": "First, work through the modules.",
     "show": 1,
     "on": "mods"
    },
    {
     "say": "Then join a project on She Model Tech as a tester.",
     "show": 2,
     "on": "proj",
     "send": {
      "from": "mods",
      "to": "proj",
      "label": "you join"
     }
    },
    {
     "say": "Your test cases count toward the badge.",
     "show": 3,
     "on": "badge",
     "send": {
      "from": "proj",
      "to": "badge",
      "label": "test cases"
     }
    },
    {
     "say": "So do your bug reports.",
     "on": "badge",
     "send": {
      "from": "proj",
      "to": "badge",
      "label": "bug reports"
     }
    },
    {
     "say": "And your automated checks. Together, that work earns your Quality Tester badge.",
     "on": "badge",
     "send": {
      "from": "proj",
      "to": "badge",
      "label": "automated checks"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "What's next",
   "title": "Where each piece of proof comes from",
   "columns": [
    "Your work",
    "You learn it in"
   ],
   "rows": [
    [
     "Test cases",
     "Modules 1 and 2"
    ],
    [
     "Bug reports",
     "Module 2"
    ],
    [
     "Automated checks",
     "Modules 3, 4 and 8"
    ]
   ],
   "beats": [
    {
     "say": "Each piece of that work comes from a module you'll take.",
     "col": 1
    },
    {
     "say": "You start planning test cases in Module 1, and write them in Module 2.",
     "hl": 0
    },
    {
     "say": "Bug reports a developer can act on are Module 2.",
     "hl": 1
    },
    {
     "say": "And automated checks come from Modules 3 and 4, running on every change in Module 8.",
     "hl": 2
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
     "How the nine modules build on each other",
     ""
    ],
    [
     "The pattern and the tools",
     ""
    ],
    [
     "The permission rule",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's the track overview.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you know what Q A is for, and how the nine modules build on each other,",
     "show": 1
    },
    {
     "say": "the pattern every topic follows, and the tools you'll need,",
     "show": 2
    },
    {
     "say": "and the permission rule for every test you run.",
     "show": 3
    },
    {
     "say": "Next, Module 1: Q A Fundamentals.",
     "show": 3
    }
   ]
  }
 ]
}
```
