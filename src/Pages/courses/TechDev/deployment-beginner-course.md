# Deployment for Builders: A Practical Beginner's Course

## Course Overview

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

---

## Module 1: Docker - Same Environment, Everywhere

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

**3. Build and run it:**
```bash
docker build -t trackit-api .
docker run -p 8000:8000 trackit-api
```
Visit `http://localhost:8000/health`. It works exactly the same as running it directly, but now it's fully packaged.

**4. Prove portability - stop the container, then run it again on a completely fresh port:**
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

---

## Module 2: CI/CD - Automating Trust

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
```bash
pip install pytest httpx
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

---

## Module 3: GitHub Actions - Building the Pipeline

### Concept

**GitHub Actions** is GitHub's built-in automation tool, letting you define workflows, YAML files describing what should run and when, directly alongside your code. A workflow is triggered by an event (like a pull request or a push) and runs a series of steps on a fresh virtual machine.

### Where you'd actually use this

Turning the CI/CD pipeline you sketched in Module 2 into something that actually runs, automatically, every time you or a teammate pushes code, with zero manual effort after it's set up.

### Lab

**1. Push your Module 1 and 2 code to a GitHub repository:**
```bash
git init
git add .
git commit -m "Initial app with tests"
git branch -M main
git remote add origin https://github.com/yourusername/trackit-api.git
git push -u origin main
```

**2. Create a workflow file:**
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
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
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

---

## Module 4: Cloud Deployment - Going Live

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

**2. Confirm it's really live:**
```bash
curl https://trackit-api.onrender.com/health
```
You should get the same `{"status": "ok"}` response you saw locally, now reachable from anywhere in the world.

**3. Complete the loop: connect deployment to your CI pipeline.** Most PaaS platforms, including Render, can auto-deploy whenever you push to `main`. Enable that setting, then make a small change (like editing the health check message), push it, and watch it go live automatically, no manual deploy step at all.

```python
@app.get("/health")
def health():
    return {"status": "ok", "version": "1.1"}
```
```bash
git add main.py
git commit -m "Bump health check version"
git push origin main
```
Wait a minute, then check the live URL again, your change is there, without you touching the server directly.

### Checkpoint
You have a real, public URL serving your app, and a code push to `main` automatically updates it live.

### Quiz
1. What does a PaaS handle for you that raw cloud infrastructure wouldn't?
2. Why does deploying the same Dockerfile you built locally make cloud deployment more predictable?
3. What confirms your app is "really" deployed, beyond seeing a success message in a dashboard?
4. What does connecting deployment to your CI pipeline eliminate from your workflow?
5. What's the risk of auto-deploying straight to production without CI tests running first?

*Answers: 1) Servers, networking, and scaling infrastructure, letting you focus on your app instead of managing machines. 2) The exact same packaged environment that worked locally is what runs in the cloud, removing a major source of "works here, not there" bugs. 3) Actually reaching the public URL yourself and getting a real response, e.g., via `curl` or a browser. 4) The manual step of logging in and triggering a deploy yourself, it happens automatically on every merge. 5) Untested or broken code could go live immediately, reaching real users before anyone catches the problem.*

---

## Capstone: A Fully Automated Pipeline

Combine every module into one working pipeline:

1. Your app is containerized with Docker (Module 1)
2. Every pull request automatically runs tests via GitHub Actions (Module 3)
3. Merging to `main` automatically deploys to your cloud platform (Module 4)
4. Make one real change (any small feature or fix), and go through the entire flow: branch, code, push, pull request, watch CI pass, merge, watch it deploy automatically, verify it's live.

### Course completion checklist
- [ ] Built a Docker image and ran it as a container
- [ ] Explained the difference between CI and CD
- [ ] Wrote a working GitHub Actions workflow that runs tests automatically
- [ ] Watched a pull request fail CI, then pass after a fix
- [ ] Deployed a real app to a public URL on a cloud platform
- [ ] Connected a code push to an automatic live deployment
- [ ] Completed one full change end-to-end: code to pull request to CI to merge to live deployment

Every piece of this course exists to answer one question, repeatedly and automatically: **can I trust that this code will behave the same way for real users as it did on my machine?**
