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
   "kind": "list",
   "art": "roadmap",
   "kicker": "The track",
   "title": "Modules 1 to 5",
   "items": [
    [
     "1 · QA Fundamentals",
     "SDLC, STLC, testing principles"
    ],
    [
     "2 · Manual Testing",
     "Test cases, bug reports, exploratory"
    ],
    [
     "3 · Automation Testing",
     "Selenium and Playwright"
    ],
    [
     "4 · API Testing",
     "Postman, Swagger, Newman"
    ],
    [
     "5 · Performance Testing",
     "Apache JMeter"
    ]
   ],
   "beats": [
    {
     "say": "The modules build on each other, so take them in order.",
     "show": 0
    },
    {
     "say": "Module 1, Q A Fundamentals: how software gets built, how testing is planned alongside it, and the principles that decide what to test.",
     "show": 1
    },
    {
     "say": "Module 2, Manual Testing: clear test cases, useful bug reports, and exploratory testing. All you need is a web browser.",
     "show": 2
    },
    {
     "say": "Module 3, Automation Testing: turning repeatable checks into code with Selenium and Playwright.",
     "show": 3
    },
    {
     "say": "Module 4, A P I Testing: testing the services behind an app with Postman and Swagger, and running suites from the terminal with Newman.",
     "show": 4
    },
    {
     "say": "Module 5, Performance Testing: measuring how software behaves under load with Apache J Meter.",
     "show": 5
    }
   ]
  },
  {
   "kind": "list",
   "art": "path",
   "kicker": "The track",
   "title": "Modules 6 to 9",
   "items": [
    [
     "6 · Mobile Testing",
     "Android Studio, Xcode"
    ],
    [
     "7 · Security Testing",
     "ZAP by Checkmarx"
    ],
    [
     "8 · CI/CD Testing",
     "GitHub Actions"
    ],
    [
     "9 · Testing AI Agents",
     "Automated evaluation suite"
    ]
   ],
   "beats": [
    {
     "say": "Module 6, Mobile Testing: Android apps with Android Studio, and i O S apps with Xcode on a Mac. No Mac? The Android topic covers the same skills.",
     "show": 1
    },
    {
     "say": "Module 7, Security Testing: finding common weaknesses with ZAP, against a practice app built for the purpose.",
     "show": 2
    },
    {
     "say": "Module 8, C I C D Testing: running your tests automatically on every change with GitHub Actions.",
     "show": 3
    },
    {
     "say": "And Module 9, Testing A I Agents: checking agents complete tasks, call the right tools, and resist prompt injection.",
     "show": 4
    },
    {
     "say": "Every tool is free or has a free tier, and you only install a module's tools when you reach it.",
     "show": 4
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
     "say": "Concept: what it is, in plain language.",
     "show": 1
    },
    {
     "say": "Structure at a glance: the building blocks, often as a diagram.",
     "show": 2
    },
    {
     "say": "Where you'd actually use this: a real workplace scenario.",
     "show": 3
    },
    {
     "say": "Lab: a hands-on exercise you complete yourself.",
     "show": 4
    },
    {
     "say": "Checkpoint: what you should be able to do before moving on.",
     "show": 5
    },
    {
     "say": "And a quiz: five questions, with answers.",
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
   "art": "loop",
   "kicker": "Start here · How each module works",
   "title": "The same pattern, every topic",
   "beats": [
    {
     "say": "Every topic in this track follows the same pattern, so you always know what comes next."
    }
   ]
  },
  {
   "kind": "list",
   "art": "chain",
   "kicker": "The pattern",
   "title": "Six steps per topic",
   "items": [
    [
     "Concept",
     "Plain language"
    ],
    [
     "Structure at a glance",
     "Often a diagram"
    ],
    [
     "Where you'd use this",
     "A real scenario"
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
     "say": "First, the concept: what it is, in plain language.",
     "show": 1
    },
    {
     "say": "Then the structure at a glance: the building blocks, often as a diagram.",
     "show": 2
    },
    {
     "say": "Where you'd actually use this: a real workplace scenario.",
     "show": 3
    },
    {
     "say": "A lab: a hands-on exercise you complete yourself.",
     "show": 4
    },
    {
     "say": "A checkpoint: what you should be able to do before moving on.",
     "show": 5
    },
    {
     "say": "And a quiz: five questions, with answers.",
     "show": 6
    }
   ]
  },
  {
   "kind": "list",
   "art": "package",
   "kicker": "Tools",
   "title": "Only what you need, when you need it",
   "items": [
    [
     "Free tools",
     "Or free tiers that cover the labs"
    ],
    [
     "Install as you go",
     "Only when you reach the module"
    ]
   ],
   "beats": [
    {
     "say": "Each module lists the tools it needs at the top.",
     "show": 0
    },
    {
     "say": "Every tool is free, or has a free tier that covers the labs, and you only install a module's tools when you reach it.",
     "show": 1
    },
    {
     "say": "Module six's i O S topic needs a Mac. If you don't have one, the Android topic covers the same skills.",
     "show": 2
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
   "kind": "quote",
   "art": "scales",
   "kicker": "The rule",
   "title": "Only test what you're allowed to",
   "quote": "Only test software you own or have written permission to test.",
   "beats": [
    {
     "say": "Only test software you own, or have written permission to test.",
     "show": 1
    },
    {
     "say": "The performance and security labs use a deliberately vulnerable practice app, running only on your own computer.",
     "show": 1
    },
    {
     "say": "Never point those tools at a real site or app.",
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
   "art": "trophy",
   "kicker": "Start here · After the track",
   "title": "From skill to proof",
   "beats": [
    {
     "say": "Courses build the skill. A badge proves it."
    }
   ]
  },
  {
   "kind": "flow",
   "art": "people",
   "kicker": "What's next",
   "title": "Earn your Quality Tester badge",
   "steps": [
    "Work through the modules",
    "Join a project as a tester",
    "Earn your Quality Tester badge"
   ],
   "beats": [
    {
     "say": "Work through the modules.",
     "show": 1
    },
    {
     "say": "Then join a project on She Model Tech as a tester.",
     "show": 2
    },
    {
     "say": "Your test cases, bug reports and automated checks become the work that earns your Quality Tester badge.",
     "show": 3
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
