<!-- order: 10 -->
# Deployment for Builders: A Practical Beginner's Course

## Course Overview

**By the end of this course, you'll be able to:**
- Explain the "works on my machine" problem and how Docker, CI, CD, and cloud hosting each help solve it
- Write a Dockerfile, build an image, and run your app in a container
- Write an automated test and run it on every pull request with a GitHub Actions workflow
- Deploy a Docker-based app to a cloud platform and confirm it's live at a public URL
- Connect deployment to CI so only changes that pass tests go live

**Who this is for:** Beginners who have working code on their own machine and want to understand how it actually gets in front of real users, reliably and repeatedly.

**How the course works:** Five modules. Every topic follows the same pattern:
- **Concept** - what it is, in plain language
- **Where you'd actually use this** - a real product scenario
- **Lab** - hands-on, runnable examples
- **Checkpoint**
- **Quiz** - five questions with answers

**Tools needed:** A terminal, a free [GitHub](https://github.com) account, [Docker](https://www.docker.com/products/docker-desktop) installed, and a free account on a cloud platform (examples use [Render](https://render.com), but the concepts transfer to any provider).

---

## Module 0: Why Deployment Is Its Own Skill

**Time: about 1 hour**

### Concept

Writing code that works on your laptop is only part of the job. **Deployment** is the process of getting that code running reliably somewhere else, a server the public can reach, in a way that keeps working as your code and team grow. The classic failure mode is "it works on my machine", where code behaves differently once it leaves your laptop because of version differences, missing configuration, or environment quirks.

Four things solve this, layered on top of each other:
- **Docker** packages your app so it runs identically everywhere
- **CI (Continuous Integration)** automatically tests every code change
- **CD (Continuous Deployment)** automatically ships code that passes those tests
- **Cloud deployment** is where the packaged, tested code actually runs for real users

### Where you'd actually use this

Every product that real users touch needs this. Without it, deploying means manually copying files to a server and hoping nothing breaks, a process that gets riskier and slower as a team grows.

### Lab

Write down, from memory, one time (in any project you've worked on or heard about) where something "worked locally but broke in production." You don't need to solve it, this module is about recognizing the problem this course solves.

### Checkpoint
You can name the four layers above in order and explain what each one solves.

### Quiz
1. What does "it works on my machine" usually mean is happening?
2. What's the difference between what Docker solves and what CI solves?
3. What's the difference between CI and CD?
4. Why does deployment get riskier as a team grows, without automation?
5. Is deployment a one-time task or an ongoing process?

*Answers: 1) The code behaves differently outside the original machine, due to environment differences like package versions or missing configuration. 2) Docker solves environment consistency (same setup everywhere); CI solves catching bugs automatically before they reach users. 3) CI tests every change automatically; CD automatically ships changes that pass those tests. 4) More people making changes increases the chance of manual mistakes or conflicting environments without a consistent, automated process. 5) Ongoing - every new code change needs to go through this process again.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "rocket",
   "kicker": "Module 0 · Why deployment is its own skill",
   "title": "From your laptop to the world",
   "beats": [
    {
     "say": "Welcome to Deployment for Builders."
    },
    {
     "say": "Deployment is getting your code running reliably somewhere the public can reach, and keeping it working as your code and team grow."
    }
   ]
  },
  {
   "kind": "quote",
   "art": "laptop",
   "kicker": "The classic problem",
   "title": "\"It works on my machine\"",
   "quote": "\"It works on my machine.\"",
   "beats": [
    {
     "say": "The classic failure is: it works on my machine.",
     "show": 0
    },
    {
     "say": "Code behaves differently once it leaves your laptop, because of different versions, missing settings, or other quirks.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "layers",
   "kicker": "Concept",
   "title": "Four layers that solve it",
   "items": [
    [
     "Docker",
     "Same environment everywhere"
    ],
    [
     "CI",
     "Tests every change"
    ],
    [
     "CD",
     "Ships what passes"
    ],
    [
     "Cloud",
     "Where users reach it"
    ]
   ],
   "beats": [
    {
     "say": "Four things solve it, layered on top of each other.",
     "show": 0
    },
    {
     "say": "Docker packages your app so it runs the same everywhere.",
     "show": 1
    },
    {
     "say": "C I, continuous integration, tests every change automatically.",
     "show": 2
    },
    {
     "say": "C D, continuous deployment, ships the changes that pass.",
     "show": 3
    },
    {
     "say": "And cloud deployment is where it all runs, for real users.",
     "show": 4
    }
   ]
  },
  {
   "kind": "quote",
   "art": "pencil",
   "kicker": "Lab",
   "title": "Recognise the problem",
   "quote": "When did something work locally but break in production?",
   "beats": [
    {
     "say": "Your lab is a reflection.",
     "show": 0
    },
    {
     "say": "Write down one time something worked locally, but broke in production.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What's the difference between CI and CD?",
   "options": [
    "They're the same thing",
    "CI tests every change; CD ships the changes that pass",
    "CI is for Python, CD is for JavaScript"
   ],
   "answer": 1,
   "good": "That's right. C I automatically tests every change, and C D automatically ships the changes that pass.",
   "bad": "Not quite. C I automatically tests every change, and C D automatically ships the changes that pass.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What's the difference between CI and CD?",
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
     "You can name the four layers and what each solves",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 0.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you can name the four layers in order, and what each solves.",
     "show": 1
    },
    {
     "say": "Next, in Module 1, Docker.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 1: Docker - Same Environment, Everywhere

**Time: about 2 hours**

### Concept

A **container** packages your application together with everything it needs to run (dependencies, system libraries, configuration) into one portable unit. **Docker** is the tool that builds and runs containers. An **image** is the packaged blueprint; a **container** is a running instance of that image.

### Where you'd actually use this

Any time you want "works on my machine" to become "works everywhere", your laptop, a teammate's laptop, a test server, and production, all running the exact same environment.

### Lab

**1. A simple app to containerize:**
```python
# main.py
from fastapi import FastAPI
app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}
```
```
# requirements.txt
fastapi
uvicorn
```

**2. Write a Dockerfile:**
```dockerfile
# Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

`COPY . .` copies everything in the folder into the image. If you made a virtual environment here, create a file named `.dockerignore` containing the lines `venv/` and `__pycache__/` so those stay out of the image.

**3. Build and run it:**
```bash
docker build -t trackit-api .
docker run -p 8000:8000 trackit-api
```
Visit `http://localhost:8000/health`. It works exactly the same as running it directly, but now it's fully packaged.

**4. Prove portability - stop the container (press Ctrl+C in its terminal), then run it again on a completely fresh port:**
```bash
docker run -p 9000:8000 trackit-api
```
Same image, same behavior, different port. This is the core promise of containers: identical behavior, wherever they run.

### Checkpoint
You built a Docker image and ran two separate containers from it successfully.

### Quiz
1. What's the difference between a Docker image and a Docker container?
2. What does `WORKDIR /app` do in a Dockerfile?
3. Why install `requirements.txt` before copying the rest of the code (`COPY . .`)?
4. What does `-p 8000:8000` do in `docker run`?
5. If a teammate runs your exact same image, should they need to install Python or any dependencies first?

*Answers: 1) An image is the packaged blueprint; a container is a running instance of that image. 2) Sets the working directory inside the container where subsequent commands run. 3) Docker caches layers, so if only your app code changes (not dependencies), rebuilding skips reinstalling everything, making builds faster. 4) Maps port 8000 on your machine to port 8000 inside the container, so you can access it. 5) No - the image already contains everything needed to run, that's the entire point.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "container",
   "kicker": "Module 1 · Docker",
   "title": "The same environment, everywhere",
   "beats": [
    {
     "say": "Welcome to Module 1."
    },
    {
     "say": "A container packages your app with everything it needs to run: dependencies, system libraries and settings."
    }
   ]
  },
  {
   "kind": "list",
   "art": "blueprint",
   "kicker": "Concept",
   "title": "Image and container",
   "items": [
    [
     "Image",
     "The packaged blueprint"
    ],
    [
     "Container",
     "A running copy of it"
    ]
   ],
   "beats": [
    {
     "say": "Two words to keep straight.",
     "show": 0
    },
    {
     "say": "An image is the packaged blueprint.",
     "show": 1
    },
    {
     "say": "A container is a running copy of that image.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "file",
   "kicker": "Lab · Step 2",
   "title": "Write a Dockerfile",
   "file": "Dockerfile",
   "code": "FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nEXPOSE 8000\nCMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]",
   "beats": [
    {
     "say": "A Dockerfile is the recipe.",
     "show": 0
    },
    {
     "say": "Start from Python three point twelve, and set the working folder.",
     "show": 1
    },
    {
     "say": "Copy requirements dot t x t and install them first. Docker caches that step, so later builds are fast when only your code changes.",
     "show": 1
    },
    {
     "say": "Then copy your code, and start uvicorn.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "terminal",
   "kicker": "Lab · Steps 3 and 4",
   "title": "Build it, run it, run it again",
   "steps": [
    "docker build -t trackit-api .",
    "docker run -p 8000:8000",
    "docker run -p 9000:8000"
   ],
   "beats": [
    {
     "say": "Docker build makes the image.",
     "show": 1
    },
    {
     "say": "Docker run starts a container. Dash p eight thousand colon eight thousand connects your machine's port to the container's.",
     "show": 2
    },
    {
     "say": "Stop it, and run it again on port nine thousand. Same image, same behaviour. That's the promise of containers.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "If a teammate runs your image, do they need to install Python first?",
   "options": [
    "Yes, always",
    "No, the image already contains everything it needs",
    "Only on Windows"
   ],
   "answer": 1,
   "good": "That's right. The image already contains everything needed to run. That's the whole point.",
   "bad": "Not quite. The image already contains everything needed to run. That's the whole point.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "If a teammate runs your image, do they need to install Python first?",
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
     "You built an image and ran two containers",
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
     "say": "you've built a Docker image and run two containers from it.",
     "show": 1
    },
    {
     "say": "Next, in Module 2, CI and CD.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 2: CI/CD - Automating Trust

**Time: about 1.5 hours**

### Concept

**Continuous Integration (CI)** automatically runs checks, tests, linting, builds, every time code changes, so problems are caught immediately instead of discovered later. **Continuous Deployment (CD)** takes it further: code that passes those checks gets automatically shipped to production, without someone manually copying files.

Together, CI/CD is what lets a team ship changes multiple times a day with confidence instead of dreading every release.

### Where you'd actually use this

Any team with more than one person, or any solo project you care about not breaking. Without CI, "did I break anything?" is a question you answer by hoping. With CI, it's answered automatically, every time, before code reaches anyone else.

### Lab

**1. Write a test for the app from Module 1:**
```python
# test_main.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```
Install the app's dependencies plus the test tools (`httpx` is what `TestClient` uses under the hood), then run the test:
```bash
pip install -r requirements.txt pytest httpx
pytest test_main.py -v
```

**2. Think through the CI/CD pipeline you want, before building it:**
```
1. Someone pushes code or opens a pull request
2. CI automatically installs dependencies and runs tests
3. If tests pass, the change can be merged
4. Once merged, CD automatically builds the Docker image and deploys it
```
Module 3 builds exactly this pipeline using GitHub Actions.

### Checkpoint
Your test passes locally, and you can describe, step by step, what should happen automatically from "push code" to "live in production."

### Quiz
1. What's the difference between CI and CD in one sentence each?
2. Why run tests automatically instead of trusting developers to run them manually before pushing?
3. What should happen if a test fails during CI?
4. Does CD mean every single code push goes live immediately, with zero checks?
5. Why does CI/CD matter more as a team grows, rather than less?

*Answers: 1) CI automatically checks code (tests, builds) on every change; CD automatically ships code that passes those checks. 2) Manual steps get skipped under deadline pressure or simply forgotten; automation runs the same way every time. 3) The change should be blocked from merging or deploying until it's fixed. 4) No - it means passing all automated checks first; failing changes don't get deployed. 5) More people means more changes and more chances for a manual mistake to slip through; automation scales in a way manual review doesn't.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "pipeline",
   "kicker": "Module 2 · CI/CD",
   "title": "Automate trust",
   "beats": [
    {
     "say": "Welcome to Module 2."
    },
    {
     "say": "CI and CD are what let a team ship many times a day with confidence, instead of dreading every release."
    }
   ]
  },
  {
   "kind": "list",
   "art": "loop",
   "kicker": "Concept",
   "title": "Two halves",
   "items": [
    [
     "Continuous integration",
     "Check every change automatically"
    ],
    [
     "Continuous deployment",
     "Ship what passes, automatically"
    ]
   ],
   "beats": [
    {
     "say": "Continuous integration runs checks, like tests and builds, every time code changes. Problems are caught right away.",
     "show": 1
    },
    {
     "say": "Continuous deployment ships the code that passes, automatically. Nobody copies files by hand.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "test",
   "kicker": "Lab · Step 1",
   "title": "A test to automate",
   "file": "test_main.py",
   "code": "client = TestClient(app)\n\ndef test_health_check():\n    response = client.get(\"/health\")\n    assert response.status_code == 200\n    assert response.json() == {\"status\": \"ok\"}",
   "beats": [
    {
     "say": "First, a test for your app.",
     "show": 0
    },
    {
     "say": "It calls slash health and checks for two hundred, and status: ok.",
     "show": 1
    },
    {
     "say": "Run it with pytest. This is what CI will run for you.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "chain",
   "kicker": "Lab · Step 2",
   "title": "Plan the pipeline",
   "steps": [
    "Push or open a PR",
    "CI runs tests",
    "Pass → merge",
    "CD deploys"
   ],
   "beats": [
    {
     "say": "Then plan the pipeline before building it.",
     "show": 0
    },
    {
     "say": "Someone pushes code or opens a pull request.",
     "show": 1
    },
    {
     "say": "CI installs everything and runs the tests.",
     "show": 2
    },
    {
     "say": "If they pass, the change can be merged.",
     "show": 3
    },
    {
     "say": "Once merged, CD builds and deploys it.",
     "show": 4
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Does CD mean every push goes live with zero checks?",
   "options": [
    "Yes, instantly",
    "No, only changes that pass the automated checks",
    "Only on Fridays"
   ],
   "answer": 1,
   "good": "That's right. Only changes that pass all the automated checks are deployed.",
   "bad": "Not quite. Only changes that pass all the automated checks are deployed.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Does CD mean every push goes live with zero checks?",
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
     "Your test passes locally",
     ""
    ],
    [
     "You can describe push to production, step by step",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 2.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "your test passes locally,",
     "show": 1
    },
    {
     "say": "and you can describe every step from push to live.",
     "show": 2
    },
    {
     "say": "Next, in Module 3, you build the pipeline with GitHub Actions.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 3: GitHub Actions - Building the Pipeline

**Time: about 2 hours**

### Concept

**GitHub Actions** is GitHub's built-in automation tool, letting you define workflows, YAML files describing what should run and when, directly alongside your code. A workflow is triggered by an event (like a pull request or a push) and runs a series of steps on a fresh virtual machine.

### Where you'd actually use this

Turning the CI/CD pipeline you sketched in Module 2 into something that actually runs, automatically, every time you or a teammate pushes code, with zero manual effort after it's set up.

### Lab

**1. Push your Module 1 and 2 code to a GitHub repository.** First create a file named `.gitignore` containing these lines, so Git skips generated files:
```
__pycache__/
.pytest_cache/
venv/
```
Then create an empty repository named `trackit-api` on GitHub (no README) and run:
```bash
git init
git add .
git commit -m "Initial app with tests"
git branch -M main
git remote add origin https://github.com/yourusername/trackit-api.git
git push -u origin main
```

**2. Create a workflow file.** Make the folders first with `mkdir -p .github/workflows` (in Windows PowerShell: `mkdir .github\workflows`), then create this file:
```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Check out code
        uses: actions/checkout@v5

      - name: Set up Python
        uses: actions/setup-python@v6
        with:
          python-version: "3.12"

      - name: Install dependencies
        run: pip install -r requirements.txt pytest httpx

      - name: Run tests
        run: pytest test_main.py -v
```

**3. Push this file, then open a pull request** (even against your own `main`, by working on a branch):
```bash
git checkout -b add-ci
git add .github/workflows/ci.yml
git commit -m "Add CI workflow"
git push origin add-ci
```
Open a pull request on GitHub. Watch the "Actions" tab, your tests now run automatically, and the PR shows a pass/fail check directly on the page.

**4. Break it on purpose.** Change the test's expected value to something wrong, push again, and watch the workflow fail. Then fix it and watch it pass. This is the feedback loop CI gives you.

### Checkpoint
You have a real pull request on GitHub showing an automated check that passed (or correctly failed and then passed after a fix).

### Quiz
1. What triggers the workflow in this example?
2. What does `runs-on: ubuntu-latest` mean?
3. Why check out the code as the first step of the workflow?
4. What would you see on a pull request if this workflow's tests failed?
5. Why deliberately break a test once, as part of learning this?

*Answers: 1) Opening a pull request against `main`, or pushing directly to `main`. 2) The workflow runs on a fresh Ubuntu virtual machine provided by GitHub. 3) The workflow starts on a blank machine with no files, it needs your repository's code copied in before it can do anything. 4) A red "failed" status directly on the pull request, blocking confidence in merging until it's fixed. 5) To see the failure feedback loop firsthand, so you trust and recognize what CI catching a real problem looks like.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "gear",
   "kicker": "Module 3 · GitHub Actions",
   "title": "Build the pipeline",
   "beats": [
    {
     "say": "Welcome to Module 3."
    },
    {
     "say": "GitHub Actions runs workflows, written in YAML files next to your code. An event, like a pull request, starts a series of steps on a fresh machine."
    }
   ]
  },
  {
   "kind": "code",
   "art": "git",
   "kicker": "Lab · Step 1",
   "title": "Put the code on GitHub",
   "file": "Terminal",
   "code": "git init\ngit add .\ngit commit -m \"Initial app with tests\"\ngit branch -M main\ngit remote add origin https://github.com/yourusername/trackit-api.git\ngit push -u origin main",
   "beats": [
    {
     "say": "First, push your code to a new GitHub repository.",
     "show": 0
    },
    {
     "say": "Add a dot gitignore first, so generated files like pycache and your venv stay out.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab · Step 2",
   "title": "The workflow file",
   "file": ".github/workflows/ci.yml",
   "code": "on:\n  pull_request:\n    branches: [main]\n  push:\n    branches: [main]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v5\n      - uses: actions/setup-python@v6\n        with:\n          python-version: \"3.12\"\n      - run: pip install -r requirements.txt pytest httpx\n      - run: pytest test_main.py -v",
   "beats": [
    {
     "say": "Now the workflow.",
     "show": 0
    },
    {
     "say": "It runs on pull requests and pushes to main, on a fresh Ubuntu machine.",
     "show": 1
    },
    {
     "say": "The steps check out your code first, because the machine starts empty. Then set up Python, install, and run the tests.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "checklist",
   "kicker": "Lab · Steps 3 and 4",
   "title": "Watch it work, and fail",
   "steps": [
    "Open a pull request",
    "Tests run automatically",
    "Break it: red",
    "Fix it: green"
   ],
   "beats": [
    {
     "say": "Push the workflow on a branch, and open a pull request.",
     "show": 1
    },
    {
     "say": "Your tests run automatically, and the pull request shows a pass or fail check.",
     "show": 2
    },
    {
     "say": "Then break the test on purpose. The check turns red.",
     "show": 3
    },
    {
     "say": "Fix it, and it turns green. That's the feedback loop.",
     "show": 4
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why is checking out the code the first step?",
   "options": [
    "To make it run faster",
    "The machine starts empty, so it needs your code first",
    "GitHub requires it for billing"
   ],
   "answer": 1,
   "good": "That's right. The workflow starts on a blank machine, so your code has to be copied in first.",
   "bad": "Not quite. The workflow starts on a blank machine, so your code has to be copied in first.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why is checking out the code the first step?",
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
     "A real pull request with an automated check",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 3.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a real pull request showing an automated check that passed.",
     "show": 1
    },
    {
     "say": "Next, in the last module, you go live.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 4: Cloud Deployment - Going Live

**Time: about 2.5 hours**

### Concept

**Cloud deployment** means running your containerized, tested app on infrastructure managed by a cloud provider (AWS, Google Cloud, Azure, or simpler platforms like Render, Railway, or Fly.io) instead of your own laptop. Beginners generally start with a **Platform-as-a-Service (PaaS)**, which handles servers, networking, and scaling for you, before eventually needing more control from raw cloud infrastructure.

### Where you'd actually use this

The moment your app needs to be reachable by anyone other than you, on your own machine, on your own network.

### Lab

**1. Deploy your Docker-based app to a PaaS (using Render as the example, but Railway or Fly.io follow a similar pattern):**
- Push your code (including the `Dockerfile` from Module 1) to GitHub, if you haven't already
- Create a free account at [render.com](https://render.com)
- Click "New Web Service", connect your GitHub repository
- Render detects your `Dockerfile` automatically and builds + deploys it
- Once deployed, you get a public URL like `https://trackit-api.onrender.com`
- On the free plan, the service goes to sleep after about 15 minutes without traffic, so the first request after a pause can take up to a minute. That's normal, not a bug.

**2. Confirm it's really live:**
```bash
curl https://trackit-api.onrender.com/health
```
You should get the same `{"status": "ok"}` response you saw locally, now reachable from anywhere in the world.

**3. Complete the loop: connect deployment to your CI pipeline.** By default, Render redeploys on every push to `main`, even if your tests fail. You want the opposite: deploy only code that has passed CI. Choose one of these two setups:

- **Option A (simplest): let Render wait for CI.** In your Render service, open **Settings**, find **Auto-Deploy**, and choose the option to deploy only after checks pass (on Render it's labeled "After CI Checks Pass"; if your dashboard shows a different label, pick the one that waits for checks). Render then waits for your GitHub Actions workflow to succeed on `main` before deploying.
- **Option B: trigger the deploy from your workflow.** In Render, set **Auto-Deploy** to **Off** and copy the service's **Deploy Hook** URL (under Settings). In GitHub, go to your repository's **Settings > Secrets and variables > Actions** and add it as a secret named `RENDER_DEPLOY_HOOK_URL` (treat it like a password, never paste it into your code). Then add this job to the bottom of `.github/workflows/ci.yml`, indented at the same level as `test:`:
```yaml
  deploy:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render deploy
        run: curl -fsS -X POST "$RENDER_DEPLOY_HOOK_URL"
        env:
          RENDER_DEPLOY_HOOK_URL: ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
```
`needs: test` means this job runs only if the `test` job passed, and the `if:` line means it runs only for pushes to `main` (including merged pull requests), not for pull requests that are still open.

Either way, ship changes through a pull request rather than pushing straight to `main`. Make a small change on a new branch:
```python
@app.get("/health")
def health():
    return {"status": "ok", "version": "1.1"}
```
Because this changes what `/health` returns, update the expected value in `test_main.py` to `{"status": "ok", "version": "1.1"}` too, or CI will (correctly) fail. Then:
```bash
git checkout main
git pull
git checkout -b bump-version
git add main.py test_main.py
git commit -m "Bump health check version"
git push origin bump-version
```
Open a pull request on GitHub, wait for the CI check to pass, then click **Merge**. The merge updates `main`, CI runs again on `main`, and only after it passes does the new version deploy. Wait a minute or two, then check the live URL again: your change is there, without you touching the server directly.

### Checkpoint
You have a real, public URL serving your app, and merging a pull request into `main` automatically updates it live, but only after CI passes.

### Quiz
1. What does a PaaS handle for you that raw cloud infrastructure wouldn't?
2. Why does deploying the same Dockerfile you built locally make cloud deployment more predictable?
3. What confirms your app is "really" deployed, beyond seeing a success message in a dashboard?
4. What does connecting deployment to your CI pipeline eliminate from your workflow?
5. What's the risk of auto-deploying straight to production without CI tests running first?

*Answers: 1) Servers, networking, and scaling infrastructure, letting you focus on your app instead of managing machines. 2) The exact same packaged environment that worked locally is what runs in the cloud, removing a major source of "works here, not there" bugs. 3) Actually reaching the public URL yourself and getting a real response, e.g., via `curl` or a browser. 4) The manual step of logging in and triggering a deploy yourself; every merge to `main` that passes CI deploys automatically. 5) Untested or broken code could go live immediately, reaching real users before anyone catches the problem.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "cloud",
   "kicker": "Module 4 · Cloud deployment",
   "title": "Go live",
   "beats": [
    {
     "say": "Welcome to the last module."
    },
    {
     "say": "Cloud deployment runs your app on a provider's infrastructure, instead of your laptop."
    },
    {
     "say": "Beginners usually start with a platform as a service, which handles servers, networking and scaling for you."
    }
   ]
  },
  {
   "kind": "flow",
   "art": "rocket",
   "kicker": "Lab · Step 1",
   "title": "Deploy to Render",
   "steps": [
    "Push to GitHub",
    "New Web Service",
    "Render builds the Dockerfile",
    "Public URL"
   ],
   "beats": [
    {
     "say": "Here's the flow, using Render. Railway and Fly dot io work much the same.",
     "show": 0
    },
    {
     "say": "Push your code, including the Dockerfile, to GitHub.",
     "show": 1
    },
    {
     "say": "In Render, create a new web service and connect your repository.",
     "show": 2
    },
    {
     "say": "Render finds your Dockerfile, builds it, and deploys it.",
     "show": 3
    },
    {
     "say": "You get a public address.",
     "show": 4
    },
    {
     "say": "On the free plan, it sleeps after about fifteen minutes without visitors, so the first request after a pause can take up to a minute. That's normal.",
     "show": 4
    }
   ]
  },
  {
   "kind": "big",
   "art": "globe",
   "kicker": "Lab · Step 2",
   "title": "Prove it's really live",
   "big": "{\"status\": \"ok\"}",
   "sub": "from your public URL",
   "beats": [
    {
     "say": "Don't just trust the dashboard.",
     "show": 0
    },
    {
     "say": "Curl your public address, slash health.",
     "show": 1
    },
    {
     "say": "You get status: ok, now reachable from anywhere in the world.",
     "show": 2
    }
   ]
  },
  {
   "kind": "list",
   "art": "shield",
   "kicker": "Lab · Step 3",
   "title": "Only deploy what passes",
   "items": [
    [
     "Option A",
     "Auto-deploy after CI checks pass"
    ],
    [
     "Option B",
     "Workflow triggers the deploy hook after tests"
    ]
   ],
   "beats": [
    {
     "say": "By default, Render redeploys on every push, even if tests fail. You want the opposite.",
     "show": 0
    },
    {
     "say": "Option A, the simplest: set auto-deploy to wait until CI checks pass.",
     "show": 1
    },
    {
     "say": "Option B: turn auto-deploy off, and have your workflow call Render's deploy hook, kept as a GitHub secret, only after the tests pass on main.",
     "show": 2
    }
   ]
  },
  {
   "kind": "flow",
   "art": "merge",
   "kicker": "Lab · Step 3",
   "title": "Ship through a pull request",
   "steps": [
    "New branch + test update",
    "Pull request: CI passes",
    "Merge",
    "Live automatically"
   ],
   "beats": [
    {
     "say": "Now ship a change the right way.",
     "show": 0
    },
    {
     "say": "On a new branch, change slash health to include a version, and update the test to match.",
     "show": 1
    },
    {
     "say": "Open a pull request, and wait for CI to pass.",
     "show": 2
    },
    {
     "say": "Merge it.",
     "show": 3
    },
    {
     "say": "CI runs again on main, and only then does the new version go live. You never touched the server.",
     "show": 4
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What's the risk of auto-deploying without CI tests first?",
   "options": [
    "Deploys become slower",
    "Broken code could reach real users before anyone notices",
    "GitHub stops working"
   ],
   "answer": 1,
   "good": "That's right. Untested or broken code could go live straight away, reaching users before anyone catches it.",
   "bad": "Not quite. Untested or broken code could go live straight away, reaching users before anyone catches it.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What's the risk of auto-deploying without CI tests first?",
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
     "A public URL serves your app",
     ""
    ],
    [
     "Merges deploy only after CI passes",
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
     "say": "you have a public address serving your app,",
     "show": 1
    },
    {
     "say": "and merging a pull request updates it, only after CI passes.",
     "show": 2
    },
    {
     "say": "You've finished Deployment for Builders. Well done.",
     "show": 2
    }
   ]
  }
 ]
}
```
