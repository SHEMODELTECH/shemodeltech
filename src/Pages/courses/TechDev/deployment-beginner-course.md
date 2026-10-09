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
   "kind": "diagram",
   "kicker": "The classic problem",
   "title": "\"It works on my machine\"",
   "nodes": [
    {
     "id": "laptop",
     "label": "Your laptop",
     "x": 14,
     "y": 50,
     "sub": "everything set up",
     "art": "laptop"
    },
    {
     "id": "server",
     "label": "A server",
     "x": 50,
     "y": 50,
     "sub": "a different setup",
     "art": "server"
    },
    {
     "id": "users",
     "label": "Real users",
     "x": 86,
     "y": 50,
     "sub": "the public",
     "art": "people"
    }
   ],
   "edges": [
    {
     "from": "laptop",
     "to": "server"
    },
    {
     "from": "server",
     "to": "users"
    }
   ],
   "beats": [
    {
     "say": "On your laptop, the app runs perfectly.",
     "show": 1,
     "on": "laptop"
    },
    {
     "say": "So you copy the code to a server.",
     "show": 2,
     "on": "server",
     "send": {
      "from": "laptop",
      "to": "server",
      "label": "copy the code"
     }
    },
    {
     "say": "But the server isn't your laptop. Something about its environment is different.",
     "show": 2,
     "on": "server"
    },
    {
     "say": "So real users get an error instead of your app.",
     "show": 3,
     "on": "users",
     "send": {
      "from": "server",
      "to": "users",
      "label": "error"
     }
    },
    {
     "say": "Same code, different environment. That's the classic failure: it works on my machine.",
     "on": [
      "laptop",
      "server"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Why it happens",
   "title": "What can differ between machines",
   "columns": [
    "What differs",
    "Your laptop",
    "The server"
   ],
   "rows": [
    [
     "Version",
     "Python 3.12",
     "an older Python"
    ],
    [
     "Packages",
     "all installed",
     "one missing"
    ],
    [
     "Configuration",
     "settings in place",
     "never copied over"
    ]
   ],
   "beats": [
    {
     "say": "Here are the usual suspects, side by side.",
     "col": 0
    },
    {
     "say": "A version difference: the server runs an older Python than you do.",
     "hl": 0
    },
    {
     "say": "A missing package that you installed long ago, and forgot about.",
     "hl": 1
    },
    {
     "say": "Or missing configuration: a setting that only ever lived on your laptop.",
     "hl": 2
    },
    {
     "say": "None of these are in your code, which is why reading the code won't find them.",
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
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Four layers that solve it",
   "nodes": [
    {
     "id": "dev",
     "label": "Your change",
     "x": 12,
     "y": 25,
     "sub": "new code",
     "art": "code"
    },
    {
     "id": "ci",
     "label": "CI",
     "x": 42,
     "y": 25,
     "sub": "tests every change",
     "art": "test"
    },
    {
     "id": "cd",
     "label": "CD",
     "x": 72,
     "y": 25,
     "sub": "ships what passes",
     "art": "pipeline"
    },
    {
     "id": "docker",
     "label": "Docker image",
     "x": 88,
     "y": 62,
     "sub": "same environment",
     "art": "container"
    },
    {
     "id": "cloud",
     "label": "Cloud",
     "x": 58,
     "y": 82,
     "sub": "where it runs",
     "art": "cloud"
    },
    {
     "id": "users",
     "label": "Users",
     "x": 22,
     "y": 82,
     "sub": "the public",
     "art": "people"
    }
   ],
   "edges": [
    {
     "from": "dev",
     "to": "ci"
    },
    {
     "from": "ci",
     "to": "cd"
    },
    {
     "from": "cd",
     "to": "docker"
    },
    {
     "from": "docker",
     "to": "cloud"
    },
    {
     "from": "cloud",
     "to": "users"
    }
   ],
   "beats": [
    {
     "say": "Four things solve this, layered together. Let's follow one change through them.",
     "show": 1,
     "on": "dev"
    },
    {
     "say": "C I, continuous integration, tests that change automatically.",
     "show": 2,
     "on": "ci",
     "send": {
      "from": "dev",
      "to": "ci",
      "label": "push"
     }
    },
    {
     "say": "It passes, so C D, continuous deployment, ships it automatically.",
     "show": 3,
     "on": "cd",
     "send": {
      "from": "ci",
      "to": "cd",
      "label": "tests passed"
     }
    },
    {
     "say": "What ships is a Docker image: your app packaged with its exact environment.",
     "show": 4,
     "on": "docker",
     "send": {
      "from": "cd",
      "to": "docker",
      "label": "docker build"
     }
    },
    {
     "say": "The cloud runs that same image, so your laptop and the server finally match.",
     "show": 5,
     "on": "cloud",
     "send": {
      "from": "docker",
      "to": "cloud",
      "label": "same image"
     }
    },
    {
     "say": "And real users reach it at a public address.",
     "show": 6,
     "on": "users",
     "send": {
      "from": "cloud",
      "to": "users",
      "label": "public URL"
     }
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Concept",
   "title": "Every change takes the same path",
   "values": [
    "push",
    "CI tests",
    "CD ships",
    "live"
   ],
   "beats": [
    {
     "say": "Deployment isn't a one time task. Watch one change travel."
    },
    {
     "say": "It's pushed.",
     "hl": 0,
     "ptr": {
      "change": 0
     },
     "note": "change 1"
    },
    {
     "say": "C I tests it, and the tests pass.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "change": 1
     },
     "note": "change 1"
    },
    {
     "say": "C D ships it, and it goes live.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3,
     "ptr": {
      "change": 3
     },
     "note": "change 1 is live"
    },
    {
     "say": "Then the next change starts again, right at the beginning.",
     "hl": 0,
     "ptr": {
      "change": 0
     },
     "note": "change 2: same path, every time"
    },
    {
     "say": "Without automation, a person repeats these steps by hand for every change. More people means more changes, and more chances for a mistake.",
     "hl": [
      0,
      1,
      2,
      3
     ],
     "note": "automation runs the same way every time"
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
     "say": "Write down one time something worked locally, but broke in production. You don't need to solve it.",
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
     "say": "What's the difference between C I and C D?",
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
   "kind": "table",
   "kicker": "Concept",
   "title": "Image and container",
   "columns": [
    "",
    "Image",
    "Container"
   ],
   "rows": [
    [
     "What it is",
     "The packaged blueprint",
     "A running instance"
    ],
    [
     "Made with",
     "docker build",
     "docker run"
    ],
    [
     "How many",
     "One: trackit-api",
     "As many as you start"
    ]
   ],
   "beats": [
    {
     "say": "Two words to keep straight.",
     "col": 0
    },
    {
     "say": "An image is the packaged blueprint. A container is a running instance of it.",
     "hl": 0
    },
    {
     "say": "You make an image with docker build, and start a container with docker run.",
     "hl": 1
    },
    {
     "say": "From one image, you can start as many containers as you like.",
     "hl": 2,
     "col": 2
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 2",
   "title": "Read the Dockerfile like a recipe",
   "file": "Dockerfile",
   "code": "FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nEXPOSE 8000\nCMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]",
   "beats": [
    {
     "say": "A Dockerfile is the recipe for your image. Docker follows it from the top.",
     "line": 1,
     "vars": {
      "base": "python:3.12-slim"
     }
    },
    {
     "say": "Start from a small image that already has Python three point twelve.",
     "line": 1
    },
    {
     "say": "Work in a folder called slash app inside the image.",
     "line": 2,
     "vars": {
      "workdir": "/app"
     }
    },
    {
     "say": "Copy in just requirements dot t x t, on its own.",
     "line": 3,
     "vars": {
      "/app": "requirements.txt"
     }
    },
    {
     "say": "Install what it lists: fastapi and uvicorn.",
     "line": 4,
     "vars": {
      "installed": "fastapi, uvicorn"
     }
    },
    {
     "say": "Now copy everything else, including main dot p y.",
     "line": 5,
     "vars": {
      "/app": "requirements.txt, main.py, Dockerfile"
     }
    },
    {
     "say": "Expose eight thousand notes the port the app listens on.",
     "line": 6,
     "vars": {
      "port": 8000
     }
    },
    {
     "say": "And C M D is the command a container runs when it starts: uvicorn, serving main dot app on port eight thousand.",
     "line": 7,
     "vars": {
      "starts with": "uvicorn main:app"
     }
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Step 2",
   "title": "Keep clutter out with .dockerignore",
   "values": [
    "main.py",
    "requirements.txt",
    "Dockerfile",
    "venv/",
    "__pycache__/"
   ],
   "beats": [
    {
     "say": "Copy dot dot copies everything in your folder into the image.",
     "hl": [
      0,
      1,
      2,
      3,
      4
     ]
    },
    {
     "say": "If you made a virtual environment here, your venv folder comes along, and so does pycache.",
     "hl": [
      3,
      4
     ],
     "note": "not needed: the image installs its own packages"
    },
    {
     "say": "So create a file called dot dockerignore, listing venv and pycache.",
     "hl": [
      3,
      4
     ],
     "note": ".dockerignore → venv/  __pycache__/"
    },
    {
     "say": "Now Docker leaves them out, and only your app goes in.",
     "ok": [
      0,
      1,
      2
     ],
     "gone": [
      3,
      4
     ],
     "note": "COPY . . skips what .dockerignore lists"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Why the order matters",
   "title": "Docker caches each step",
   "values": [
    "FROM python",
    "WORKDIR /app",
    "COPY requirements",
    "RUN pip install",
    "COPY . .",
    "EXPOSE 8000",
    "CMD uvicorn"
   ],
   "beats": [
    {
     "say": "Docker builds the image one step at a time, and remembers each result. That's the cache."
    },
    {
     "say": "On the first build, every step runs, including the slow one: installing packages.",
     "ok": [
      0,
      1,
      2,
      4,
      5,
      6
     ],
     "hl": 3,
     "note": "first build: every step runs"
    },
    {
     "say": "Now you edit main dot p y, and build again.",
     "note": "main.py changed"
    },
    {
     "say": "The first four steps haven't changed, so Docker reuses them. Nothing is reinstalled.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "note": "cached"
    },
    {
     "say": "Copy dot dot sees a changed file, so it runs again, with every step after it.",
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
     "note": "rebuilt from the change onward"
    },
    {
     "say": "That's why requirements are copied and installed first. Copy all your code first, and every tiny edit would reinstall everything.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "hl": 3,
     "note": "pip install reruns only when requirements.txt changes"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 3 and 4",
   "title": "One image, two containers",
   "nodes": [
    {
     "id": "img",
     "label": "trackit-api",
     "x": 14,
     "y": 50,
     "sub": "the image",
     "art": "package"
    },
    {
     "id": "c1",
     "label": "Container",
     "x": 52,
     "y": 22,
     "sub": "-p 8000:8000",
     "art": "container"
    },
    {
     "id": "br",
     "label": "Browser",
     "x": 88,
     "y": 50,
     "sub": "localhost",
     "art": "browser"
    },
    {
     "id": "c2",
     "label": "Container",
     "x": 52,
     "y": 78,
     "sub": "-p 9000:8000",
     "art": "container"
    }
   ],
   "edges": [
    {
     "from": "img",
     "to": "c1"
    },
    {
     "from": "img",
     "to": "c2"
    },
    {
     "from": "br",
     "to": "c1"
    },
    {
     "from": "br",
     "to": "c2"
    }
   ],
   "beats": [
    {
     "say": "Docker build dash t trackit A P I makes one image with that name.",
     "show": 1,
     "on": "img"
    },
    {
     "say": "Docker run starts a container. Dash p connects port eight thousand on your machine to port eight thousand inside it.",
     "show": 2,
     "on": "c1",
     "send": {
      "from": "img",
      "to": "c1",
      "label": "docker run -p 8000:8000"
     }
    },
    {
     "say": "Visit localhost, port eight thousand, slash health.",
     "show": 3,
     "on": "br",
     "send": {
      "from": "br",
      "to": "c1",
      "label": "GET localhost:8000/health"
     }
    },
    {
     "say": "Back comes status ok.",
     "on": "br",
     "send": {
      "from": "c1",
      "to": "br",
      "label": "{\"status\":\"ok\"}"
     }
    },
    {
     "say": "Stop it with control C, then run the same image again, this time on port nine thousand.",
     "show": 4,
     "on": "c2",
     "send": {
      "from": "img",
      "to": "c2",
      "label": "docker run -p 9000:8000"
     }
    },
    {
     "say": "Outside it's port nine thousand. Inside, the app still listens on eight thousand.",
     "on": "c2",
     "send": {
      "from": "br",
      "to": "c2",
      "label": "GET localhost:9000/health"
     }
    },
    {
     "say": "Same image, same answer. That's the promise of containers.",
     "on": [
      "br",
      "c2"
     ],
     "send": {
      "from": "c2",
      "to": "br",
      "label": "{\"status\":\"ok\"}"
     }
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
     "say": "Next, in Module 2, C I and C D.",
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
     "say": "C I and C D are what let a team ship many times a day with confidence, instead of dreading every release."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "CI checks. CD ships what passes.",
   "nodes": [
    {
     "id": "dev",
     "label": "You",
     "x": 12,
     "y": 30,
     "sub": "push or pull request",
     "art": "laptop"
    },
    {
     "id": "ci",
     "label": "CI",
     "x": 46,
     "y": 30,
     "sub": "tests, linting, build",
     "art": "test"
    },
    {
     "id": "cd",
     "label": "CD",
     "x": 82,
     "y": 30,
     "sub": "build image, deploy",
     "art": "pipeline"
    },
    {
     "id": "prod",
     "label": "Production",
     "x": 82,
     "y": 80,
     "sub": "real users",
     "art": "server"
    }
   ],
   "edges": [
    {
     "from": "dev",
     "to": "ci"
    },
    {
     "from": "ci",
     "to": "cd"
    },
    {
     "from": "cd",
     "to": "prod"
    }
   ],
   "beats": [
    {
     "say": "Here's the whole loop: you, C I, C D, and production.",
     "show": 4
    },
    {
     "say": "You push a change. C I, continuous integration, runs the checks: tests, linting, a build.",
     "on": "ci",
     "send": {
      "from": "dev",
      "to": "ci",
      "label": "change A"
     }
    },
    {
     "say": "Every check passes, so C D, continuous deployment, takes over.",
     "on": "cd",
     "send": {
      "from": "ci",
      "to": "cd",
      "label": "✓ passed"
     }
    },
    {
     "say": "It ships the change to production automatically. Nobody copies files by hand.",
     "on": "prod",
     "send": {
      "from": "cd",
      "to": "prod",
      "label": "deploy"
     }
    },
    {
     "say": "Now a second change, with a bug in it.",
     "on": "ci",
     "send": {
      "from": "dev",
      "to": "ci",
      "label": "change B"
     }
    },
    {
     "say": "A test fails. The change is blocked, and you find out right away, from C I instead of from a user.",
     "on": "dev",
     "send": {
      "from": "ci",
      "to": "dev",
      "label": "✗ test failed"
     }
    },
    {
     "say": "Production never saw it. C D only ships what passes.",
     "on": "prod"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 1",
   "title": "Watch the test run",
   "file": "test_main.py",
   "code": "from fastapi.testclient import TestClient\nfrom main import app\n\nclient = TestClient(app)\n\ndef test_health_check():\n    response = client.get(\"/health\")\n    assert response.status_code == 200\n    assert response.json() == {\"status\": \"ok\"}",
   "beats": [
    {
     "say": "The test imports a test client, and your app from main dot p y.",
     "line": [
      1,
      2
     ]
    },
    {
     "say": "The client can call your app directly, with no server running.",
     "line": 4,
     "vars": {
      "client": "TestClient(app)"
     }
    },
    {
     "say": "Pytest finds every function whose name starts with test, and runs it.",
     "line": 6
    },
    {
     "say": "It asks for slash health, just as a browser would.",
     "line": 7,
     "vars": {
      "response.status_code": 200,
      "response.json()": "{\"status\": \"ok\"}"
     }
    },
    {
     "say": "Is the status code two hundred? Yes, so this check passes.",
     "line": 8
    },
    {
     "say": "Is the body exactly status ok? Yes again.",
     "line": 9,
     "out": "test_main.py::test_health_check PASSED [100%]"
    },
    {
     "say": "Pytest reports one passed. This is the exact test C I will run for you, on every change.",
     "line": 9,
     "out": "1 passed"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "What happens to each change",
   "columns": [
    "Change",
    "Tests",
    "Merge?",
    "Deployed?"
   ],
   "rows": [
    [
     "Add a new endpoint",
     "pass",
     "yes",
     "yes"
    ],
    [
     "Typo breaks /health",
     "fail",
     "blocked",
     "no"
    ],
    [
     "Fix the typo",
     "pass",
     "yes",
     "yes"
    ]
   ],
   "beats": [
    {
     "say": "Three changes, one rule.",
     "sql": "Rule: only a change that passes every check moves on"
    },
    {
     "say": "A new endpoint: the tests pass, it's merged, and C D deploys it.",
     "hl": 0
    },
    {
     "say": "A typo breaks slash health. The test fails, so the change is blocked.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "It's never merged, and never deployed.",
     "hl": 1,
     "col": 3
    },
    {
     "say": "Fix the typo, and it passes and ships like normal.",
     "hl": 2
    },
    {
     "say": "So C D doesn't mean every push goes live. It means every push that passes.",
     "hl": [
      0,
      2
     ],
     "dim": true,
     "col": 3
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Step 2",
   "title": "Plan the pipeline before you build it",
   "values": [
    "Push or open PR",
    "CI installs + tests",
    "Pass → merge",
    "CD builds + deploys"
   ],
   "beats": [
    {
     "say": "Before building a pipeline, plan it. Four steps."
    },
    {
     "say": "Someone pushes code or opens a pull request.",
     "hl": 0,
     "ptr": {
      "now": 0
     }
    },
    {
     "say": "C I installs the dependencies and runs the tests, automatically.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "now": 1
     }
    },
    {
     "say": "If the tests pass, the change can be merged.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "now": 2
     }
    },
    {
     "say": "Once merged, C D builds the Docker image and deploys it.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3,
     "ptr": {
      "now": 3
     }
    },
    {
     "say": "If a test fails at step two, everything after it stops.",
     "ok": [
      0
     ],
     "hl": 1,
     "gone": [
      2,
      3
     ],
     "ptr": {
      "now": 1
     },
     "note": "tests fail → no merge, no deploy"
    },
    {
     "say": "Module 3 builds exactly this pipeline, with GitHub Actions.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "note": "next: GitHub Actions"
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
     "say": "Does C D mean every push goes live with zero checks?",
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
   "kind": "array",
   "kicker": "Lab · Step 1",
   "title": "Only real code goes to GitHub",
   "values": [
    "main.py",
    "requirements.txt",
    "Dockerfile",
    "test_main.py",
    "__pycache__/",
    ".pytest_cache/",
    "venv/"
   ],
   "beats": [
    {
     "say": "Here's your project folder after Modules 1 and 2."
    },
    {
     "say": "Some of it is generated: pycache, the pytest cache, and your venv.",
     "hl": [
      4,
      5,
      6
     ],
     "note": "made by Python, pytest, and you"
    },
    {
     "say": "A dot gitignore file lists those three, so Git skips them.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "gone": [
      4,
      5,
      6
     ],
     "note": ".gitignore → __pycache__/  .pytest_cache/  venv/"
    },
    {
     "say": "Then git add, commit, and push to a new repository called trackit A P I. Only your real code goes up.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "gone": [
      4,
      5,
      6
     ],
     "note": "git push -u origin main"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 2",
   "title": "Follow the workflow on a fresh machine",
   "file": ".github/workflows/ci.yml (trimmed)",
   "code": "on:\n  pull_request:\n    branches: [main]\n  push:\n    branches: [main]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v5\n      - uses: actions/setup-python@v6\n        with: { python-version: \"3.12\" }\n      - run: pip install -r requirements.txt pytest httpx\n      - run: pytest test_main.py -v",
   "beats": [
    {
     "say": "The on block says when to run: a pull request into main, or a push to main.",
     "line": [
      1,
      5
     ],
     "vars": {
      "event": "pull_request → main"
     }
    },
    {
     "say": "The test job runs on ubuntu latest: a fresh virtual machine that GitHub provides.",
     "line": [
      7,
      8
     ],
     "vars": {
      "machine": "fresh Ubuntu",
      "files": "none"
     }
    },
    {
     "say": "It starts completely empty, so the first step checks out your code.",
     "line": 10,
     "vars": {
      "files": "your repository"
     }
    },
    {
     "say": "Next, set up Python three point twelve.",
     "line": [
      11,
      12
     ],
     "vars": {
      "python": "3.12"
     }
    },
    {
     "say": "Install your requirements, plus pytest and h t t p x.",
     "line": 13,
     "vars": {
      "installed": "fastapi, uvicorn, pytest, httpx"
     }
    },
    {
     "say": "Finally, run the tests.",
     "line": 14,
     "out": "test_main.py::test_health_check PASSED [100%]"
    },
    {
     "say": "Every step succeeded, so the job passes.",
     "line": 14,
     "out": "1 passed"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 2",
   "title": "Does the workflow run?",
   "columns": [
    "What you do",
    "Matches",
    "Runs?"
   ],
   "rows": [
    [
     "Open a PR into main",
     "pull_request",
     "yes"
    ],
    [
     "Push again to that PR's branch",
     "pull_request",
     "yes"
    ],
    [
     "Merge, or push to main",
     "push",
     "yes"
    ],
    [
     "Push add-ci, no PR open",
     "nothing",
     "no"
    ]
   ],
   "beats": [
    {
     "say": "Let's test the on block against four things you might do.",
     "sql": "on:\n  pull_request: { branches: [main] }\n  push: { branches: [main] }"
    },
    {
     "say": "Open a pull request into main. That matches, so it runs.",
     "hl": 0
    },
    {
     "say": "Push another commit to that pull request's branch. It runs again, for the update.",
     "hl": 1
    },
    {
     "say": "Merge, or push straight to main. That matches push, so it runs.",
     "hl": 2,
     "col": 1
    },
    {
     "say": "Push your branch with no pull request open. Nothing matches, so nothing runs.",
     "hl": 3,
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 3 and 4",
   "title": "Watch it pass, fail, and pass",
   "nodes": [
    {
     "id": "you",
     "label": "You",
     "x": 12,
     "y": 50,
     "sub": "branch add-ci",
     "art": "laptop"
    },
    {
     "id": "pr",
     "label": "Pull request",
     "x": 50,
     "y": 25,
     "sub": "add-ci → main",
     "art": "git"
    },
    {
     "id": "gha",
     "label": "GitHub Actions",
     "x": 88,
     "y": 50,
     "sub": "ubuntu-latest",
     "art": "server"
    }
   ],
   "edges": [
    {
     "from": "you",
     "to": "pr"
    },
    {
     "from": "pr",
     "to": "gha"
    }
   ],
   "beats": [
    {
     "say": "You work on a branch called add C I, and push it.",
     "show": 3,
     "on": "you",
     "send": {
      "from": "you",
      "to": "pr",
      "label": "git push origin add-ci"
     }
    },
    {
     "say": "Open a pull request. That event starts the workflow.",
     "on": "gha",
     "send": {
      "from": "pr",
      "to": "gha",
      "label": "pull_request"
     }
    },
    {
     "say": "The tests pass, and the pull request shows a green check, right on the page.",
     "on": "pr",
     "send": {
      "from": "gha",
      "to": "pr",
      "label": "✓ passed"
     }
    },
    {
     "say": "Now break it on purpose. Change the test's expected value to something wrong, and push.",
     "on": "you",
     "send": {
      "from": "you",
      "to": "pr",
      "label": "wrong expected value"
     }
    },
    {
     "say": "The workflow runs again.",
     "on": "gha",
     "send": {
      "from": "pr",
      "to": "gha",
      "label": "pull_request"
     }
    },
    {
     "say": "The test fails, and the check turns red. You wouldn't merge this with confidence.",
     "on": "pr",
     "send": {
      "from": "gha",
      "to": "pr",
      "label": "✗ failed"
     }
    },
    {
     "say": "Fix the expected value, and push again.",
     "on": "you",
     "send": {
      "from": "you",
      "to": "pr",
      "label": "fix pushed"
     }
    },
    {
     "say": "Green again. That's the feedback loop C I gives you.",
     "on": "pr",
     "send": {
      "from": "gha",
      "to": "pr",
      "label": "✓ passed"
     }
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
   "kind": "table",
   "kicker": "Concept",
   "title": "Who handles what",
   "columns": [
    "Who handles…",
    "PaaS (Render, Railway, Fly.io)",
    "Raw cloud infrastructure"
   ],
   "rows": [
    [
     "Servers",
     "the provider",
     "you"
    ],
    [
     "Networking",
     "the provider",
     "you"
    ],
    [
     "Scaling",
     "the provider",
     "you"
    ],
    [
     "Your app",
     "you",
     "you"
    ]
   ],
   "beats": [
    {
     "say": "Two ways to run in the cloud. The question is: who handles what?",
     "col": 0
    },
    {
     "say": "With a platform as a service, the provider runs the servers.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "It handles the networking, and the scaling too.",
     "hl": [
      1,
      2
     ],
     "col": 1
    },
    {
     "say": "So the only thing left for you is your app.",
     "hl": 3,
     "col": 1
    },
    {
     "say": "Raw cloud infrastructure gives you more control, but every row becomes your job. That's why beginners start with a platform.",
     "hl": [
      0,
      1,
      2,
      3
     ],
     "col": 2
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 1 and 2",
   "title": "Deploy, then prove it's live",
   "nodes": [
    {
     "id": "gh",
     "label": "GitHub repo",
     "x": 12,
     "y": 30,
     "sub": "trackit-api + Dockerfile",
     "art": "git"
    },
    {
     "id": "render",
     "label": "Render",
     "x": 50,
     "y": 30,
     "sub": "New Web Service",
     "art": "cloud"
    },
    {
     "id": "live",
     "label": "Live service",
     "x": 88,
     "y": 30,
     "sub": "trackit-api.onrender.com",
     "art": "container"
    },
    {
     "id": "you",
     "label": "You, anywhere",
     "x": 88,
     "y": 80,
     "sub": "curl",
     "art": "terminal"
    }
   ],
   "edges": [
    {
     "from": "gh",
     "to": "render"
    },
    {
     "from": "render",
     "to": "live"
    },
    {
     "from": "you",
     "to": "live"
    }
   ],
   "beats": [
    {
     "say": "Your code, including the Dockerfile from Module 1, is on GitHub.",
     "show": 1,
     "on": "gh"
    },
    {
     "say": "In Render, create a new web service and connect that repository.",
     "show": 2,
     "on": "render",
     "send": {
      "from": "gh",
      "to": "render",
      "label": "connect repository"
     }
    },
    {
     "say": "Render detects your Dockerfile automatically, and builds the same image you built locally.",
     "on": "render"
    },
    {
     "say": "Then it deploys it, and gives you a public address.",
     "show": 3,
     "on": "live",
     "send": {
      "from": "render",
      "to": "live",
      "label": "deploy"
     }
    },
    {
     "say": "Don't just trust the dashboard. Curl the public address, slash health.",
     "show": 4,
     "on": "you",
     "send": {
      "from": "you",
      "to": "live",
      "label": "curl …onrender.com/health"
     }
    },
    {
     "say": "The same status ok you saw locally, now reachable from anywhere in the world.",
     "on": "you",
     "send": {
      "from": "live",
      "to": "you",
      "label": "{\"status\":\"ok\"}"
     }
    },
    {
     "say": "On the free plan, it sleeps after about fifteen minutes without traffic, so the first request after a pause can take up to a minute. That's normal.",
     "on": "live"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 3",
   "title": "Which changes go live?",
   "columns": [
    "What happens",
    "Tests",
    "Render default",
    "Wait for CI"
   ],
   "rows": [
    [
     "Pull request opened",
     "pass",
     "no deploy",
     "no deploy"
    ],
    [
     "PR merged into main",
     "pass",
     "deploys",
     "deploys"
    ],
    [
     "Push to main, test broken",
     "fail",
     "deploys!",
     "no deploy"
    ]
   ],
   "beats": [
    {
     "say": "By default, Render redeploys on every push to main, even if your tests fail.",
     "col": 2
    },
    {
     "say": "An open pull request doesn't change main, so nothing deploys either way.",
     "hl": 0
    },
    {
     "say": "A merge that passes the tests deploys in both setups. Good.",
     "hl": 1
    },
    {
     "say": "But a push with a broken test: the default deploys it anyway. Broken code reaches users.",
     "hl": 2,
     "col": 2
    },
    {
     "say": "Wait for C I instead, and that broken push is blocked.",
     "hl": 2,
     "dim": true,
     "col": 3
    },
    {
     "say": "Two ways to set that up. Option A, the simplest: set auto deploy to wait until C I checks pass. Option B: turn it off, and let your workflow trigger the deploy.",
     "sql": "Option A: Auto-Deploy → After CI Checks Pass\nOption B: Auto-Deploy Off + a deploy job in ci.yml"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 3 · Option B",
   "title": "When does the deploy job run?",
   "file": ".github/workflows/ci.yml (added)",
   "code": "  deploy:\n    needs: test\n    if: github.event_name == 'push' && github.ref == 'refs/heads/main'\n    runs-on: ubuntu-latest\n    steps:\n      - name: Trigger Render deploy\n        run: curl -fsS -X POST \"$RENDER_DEPLOY_HOOK_URL\"\n        env:\n          RENDER_DEPLOY_HOOK_URL: ${{ secrets.RENDER_DEPLOY_HOOK_URL }}",
   "beats": [
    {
     "say": "Option B adds a deploy job to your workflow, at the same level as test.",
     "line": 1
    },
    {
     "say": "Case one: a pull request is opened, and the test job passes. Needs test is satisfied.",
     "line": 2,
     "vars": {
      "event_name": "pull_request",
      "test job": "passed",
      "deploy job": "—"
     }
    },
    {
     "say": "But the event isn't a push, so the if line is false. Nothing deploys yet.",
     "line": 3,
     "vars": {
      "deploy job": "skipped"
     }
    },
    {
     "say": "Case two: the pull request is merged, which is a push to main. Tests pass, and the if line is true.",
     "line": [
      2,
      3
     ],
     "vars": {
      "event_name": "push",
      "ref": "refs/heads/main",
      "test job": "passed",
      "deploy job": "running"
     }
    },
    {
     "say": "The job posts to Render's deploy hook. Its address comes from a GitHub secret, never from your code.",
     "line": [
      7,
      9
     ],
     "vars": {
      "deploy job": "deploying"
     }
    },
    {
     "say": "Case three: a push to main where the tests fail. Needs test isn't met, so deploy never runs.",
     "line": 2,
     "vars": {
      "event_name": "push",
      "ref": "refs/heads/main",
      "test job": "failed",
      "deploy job": "skipped"
     }
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 3",
   "title": "Ship a change through a pull request",
   "nodes": [
    {
     "id": "br",
     "label": "bump-version",
     "x": 10,
     "y": 25,
     "sub": "adds \"version\": \"1.1\"",
     "art": "git"
    },
    {
     "id": "pr",
     "label": "Pull request",
     "x": 42,
     "y": 25,
     "sub": "CI check",
     "art": "checklist"
    },
    {
     "id": "main",
     "label": "main",
     "x": 74,
     "y": 25,
     "sub": "CI runs again",
     "art": "merge"
    },
    {
     "id": "render",
     "label": "Render",
     "x": 88,
     "y": 72,
     "sub": "deploys",
     "art": "cloud"
    },
    {
     "id": "live",
     "label": "Live URL",
     "x": 46,
     "y": 78,
     "sub": "/health",
     "art": "globe"
    }
   ],
   "edges": [
    {
     "from": "br",
     "to": "pr"
    },
    {
     "from": "pr",
     "to": "main"
    },
    {
     "from": "main",
     "to": "render"
    },
    {
     "from": "render",
     "to": "live"
    }
   ],
   "beats": [
    {
     "say": "On a new branch, slash health now returns version one point one. Update the test to match, or C I will, correctly, fail.",
     "show": 1,
     "on": "br"
    },
    {
     "say": "Push the branch, and open a pull request.",
     "show": 2,
     "on": "pr",
     "send": {
      "from": "br",
      "to": "pr",
      "label": "git push origin bump-version"
     }
    },
    {
     "say": "Wait for the C I check to pass.",
     "on": "pr"
    },
    {
     "say": "Click merge. That updates main, and C I runs again on main.",
     "show": 3,
     "on": "main",
     "send": {
      "from": "pr",
      "to": "main",
      "label": "Merge"
     }
    },
    {
     "say": "Only after it passes does Render deploy the new version.",
     "show": 4,
     "on": "render",
     "send": {
      "from": "main",
      "to": "render",
      "label": "✓ CI passed"
     }
    },
    {
     "say": "A minute or two later, the live address shows version one point one. You never touched the server.",
     "show": 5,
     "on": "live",
     "send": {
      "from": "render",
      "to": "live",
      "label": "{\"status\":\"ok\",\"version\":\"1.1\"}"
     }
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
     "say": "What's the risk of auto deploying without C I tests first?",
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
     "say": "and merging a pull request updates it, only after C I passes.",
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
