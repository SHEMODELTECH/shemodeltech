<!-- order: 9 -->
## Module 9: DevOps Security

**Time: about 6.5 hours** (about 30 minutes to install the tools, then roughly 2 hours per topic).

**By the end of this module, you'll be able to:**
- Catch a committed secret with Gitleaks, and use a GitHub Actions secret with least-privilege `permissions:`
- Install security tools from official sources, verify their checksums, and explain what the March 2026 Trivy compromise teaches about the supply chain
- Compare base images with Trivy and build a container image that runs as a non-root user
- Scan Terraform code with Checkov, fix misconfigurations, and write infrastructure security rules

**Tools needed for this module:** a free [GitHub](https://github.com) account, [Docker Desktop](https://www.docker.com/products/docker-desktop/), and a terminal. You'll install three free, open source scanners along the way: [Gitleaks](https://github.com/gitleaks/gitleaks) (secrets), [Trivy](https://trivy.dev) (container images), and [Checkov](https://www.checkov.io) (infrastructure code). Security tools are themselves part of your supply chain (Topic 9.2 shows a real case), so install them only from their official sources and check what you downloaded.

**Install Gitleaks** (version 8.19 or newer):
- **Mac:** `brew install gitleaks`
- **Windows:** `scoop install gitleaks`, or download `gitleaks_<version>_windows_x64.zip` from the [Gitleaks releases page](https://github.com/gitleaks/gitleaks/releases), unzip it, and put `gitleaks.exe` in a folder on your PATH
- **Linux:** download `gitleaks_<version>_linux_x64.tar.gz` and the matching `gitleaks_<version>_checksums.txt` from the releases page, then verify and install:
  ```bash
  sha256sum --check --ignore-missing gitleaks_*_checksums.txt
  tar -xzf gitleaks_*_linux_x64.tar.gz gitleaks
  sudo mv gitleaks /usr/local/bin/
  ```

**Install Trivy** (use the latest release published after the March 2026 fix; never v0.69.4):
- **Mac:** `brew install trivy`
- **Windows:** download `trivy_<version>_windows-64bit.zip` and `trivy_<version>_checksums.txt` from the [official Trivy releases](https://github.com/aquasecurity/trivy/releases), verify the zip in PowerShell with `Get-FileHash .\trivy_<version>_windows-64bit.zip -Algorithm SHA256` and compare it with the line for that file in the checksums file, then unzip and put `trivy.exe` on your PATH
- **Linux:** use the official apt or rpm repository from the [Trivy installation docs](https://trivy.dev), or download the `.tar.gz` and `trivy_<version>_checksums.txt` from the releases page and run `sha256sum --check --ignore-missing trivy_*_checksums.txt` before extracting

After installing, run `gitleaks version` and `trivy --version` and check the numbers match the latest releases on the official pages.

**Install Checkov** with [pipx](https://pipx.pypa.io), which keeps it in its own isolated environment: install pipx (`brew install pipx` on Mac, `sudo apt install pipx` on Debian/Ubuntu, or `python -m pip install --user pipx` on Windows), run `pipx ensurepath`, open a new terminal, then:
```bash
pipx install checkov
```

### Topic 9.1: Securing the Pipeline

Time: about 2 hours

#### Concept

**DevOps** joins building software and running it into one continuous flow: code is committed, tested, packaged, and deployed automatically by a **CI/CD pipeline**. That pipeline holds the keys to production, so it's a prime target. **DevSecOps** means building security checks into the pipeline itself, so problems are caught on every change instead of in a yearly audit.

- A **secret** is any credential that grants access: API keys, passwords, tokens, and cloud keys; a secret committed to a repository should be treated as leaked, even if it's deleted later, because it stays in the history
- **Pipeline secrets** (such as GitHub Actions **encrypted secrets**) keep credentials out of code; workflows read them at run time as `${{ secrets.NAME }}`
- **Least privilege** applies to pipelines too: a workflow should get only the permissions it needs, set with the `permissions:` key
- **Secret scanning** checks code and history for credentials before they spread; **Gitleaks** is a common open source scanner
- **Dependency scanning** (such as GitHub's **Dependabot**) flags libraries with known vulnerabilities and proposes updates

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'20px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#1e3a5f', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 50, 'rankSpacing': 62, 'padding': 16}}}%%
flowchart LR
    C["<b>Commit</b><br/><br/>Code pushed"]
    S["<b>Security checks</b><br/><br/>Secrets and<br/>dependency scans"]
    T["<b>Tests</b><br/><br/>Must pass<br/>to continue"]
    D["<b>Deploy</b><br/><br/>Using pipeline<br/>secrets only"]

    C ==> S ==> T ==> D

    style C fill:#1e3a5f,color:#fff,stroke:#0f1f33,stroke-width:4px
    style S fill:#dbeafe,color:#1a202c,stroke:#1e3a5f,stroke-width:4px
    style T fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    style D fill:#F5F5F5,color:#1a202c,stroke:#262626,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- "Shift left" means moving checks earlier, into the pipeline and even onto the developer's machine, where problems are cheapest to fix
- If a secret leaks, removing it from the code is not enough: **revoke and replace it** first, then clean up

#### Where you'd actually use this

A developer pastes a cloud access key into a config file to test something quickly and pushes it. A secret scan in the pipeline fails the build within a minute; the team revokes the key and moves it into pipeline secrets before anyone outside can find it.

#### Lab

1. **Create a new private GitHub repository** and clone it to your computer.
2. **Add a fake secret on purpose:** create `config.py` with these two lines and commit it:
   ```python
   # Practice only: this is NOT a real key
   API_KEY = "9fK2xQ7LmP4vR8tZ1wB6nY3cH5jD"
   ```
   The value is made up but random-looking on purpose: Gitleaks ignores obvious placeholders containing words like `fake`, `test`, or `example`, just as it would in real code.
3. **Scan the repository and its history** with Gitleaks, then read what it reports:
   ```bash
   gitleaks git -v .
   ```
   `gitleaks git` scans every commit in the repository's history, which is how it finds secrets you've already "deleted". To scan a plain folder that isn't a Git repository, use `gitleaks dir -v .` instead. (Older guides use `gitleaks detect --source .`; that command is deprecated since Gitleaks 8.19.)
4. **Store a value properly:** in the repository's **Settings → Secrets and variables → Actions**, add a secret named `DEMO_TOKEN` with any made-up value, then add a workflow at `.github/workflows/check.yml` that uses it without printing it:
   ```yaml
   name: Check
   on: [push]
   permissions:
     contents: read
   jobs:
     check:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v5
         - name: Confirm the secret is available
           env:
             DEMO_TOKEN: ${{ secrets.DEMO_TOKEN }}
           run: test -n "$DEMO_TOKEN" && echo "Secret is set"
   ```
   For practice, `@v5` is fine. In real pipelines, pin each action to its full commit SHA instead of a tag; Topic 9.2 shows why.
5. **Turn on Dependabot alerts** in the repository's security settings, and write two sentences on what you'd do if the fake key in step 2 had been real.

#### Checkpoint
You've watched Gitleaks catch a committed secret, used a pipeline secret in a workflow with read-only permissions, and can explain why a leaked secret must be revoked, not just deleted.

#### Quiz
1. What is DevSecOps?
2. Why is deleting a committed secret from the code not enough?
3. How does a GitHub Actions workflow read a secret without it being in the code?
4. What does the `permissions:` key do in a workflow?
5. What does "shift left" mean?

*Answers: 1) Building security checks into the DevOps pipeline so they run automatically on every change. 2) It remains in the repository history and may already have been copied, so it must be revoked and replaced. 3) Through encrypted repository secrets, referenced as `${{ secrets.NAME }}` at run time. 4) Limits what the workflow's token is allowed to do, applying least privilege. 5) Moving checks earlier in the process, where problems are cheaper and faster to fix.*

---

### Topic 9.2: Container Security

Time: about 2 hours

#### Concept

Most modern software ships in **containers**: a package holding the app plus everything it needs to run. Containers are built from **images**, and every image starts from a **base image** that brings its own operating system packages, each of which can carry known vulnerabilities. Securing containers means choosing small, trusted base images, scanning images before they ship, and not running them with more power than they need.

- An **image** is a read-only template, described by a **Dockerfile**; a **container** is a running copy of an image
- A **minimal base image** (such as a `-slim` variant) contains fewer packages, which means fewer vulnerabilities and a smaller attack surface
- An **image scanner** such as **Trivy** lists known vulnerabilities (CVEs) in an image's packages, graded by severity
- Containers should run as a **non-root user**, so a compromised app can't take over the whole container
- **Pinning versions** (for example `python:3.12-slim` rather than `python:latest`) makes builds repeatable and changes deliberate

**A real supply-chain lesson: the Trivy compromise (March 2026).** Attackers used stolen release credentials to publish a malicious Trivy v0.69.4 and to repoint almost all version tags of the official `trivy-action` (and `setup-trivy`) GitHub Actions to malicious code (CVE-2026-33634). Pipelines that pulled "the latest" or used a tag like `@v0.x` ran the attacker's code, with access to every secret those pipelines held. The defences are the ones from this module and Module 8:
- Install tools only from the official site or repository, and **verify the checksum** of what you download. A checksum only proves the file matches the published one, so it only helps if the checksum comes from a source the attacker didn't control: a malicious release published with stolen credentials can ship its own matching checksums. That's why you also pin to known-good versions (below) and verify signatures or provenance where the project offers them
- **Pin** what your pipeline runs: exact tool versions, and GitHub Actions pinned to a full commit SHA rather than a tag that can be moved
- If a compromised version ever ran in your pipeline, treat **every secret it could reach as leaked**: revoke and replace them all
- A security tool is still software in your supply chain; trusting its name is not the same as verifying it

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'20px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#1e3a5f', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 50, 'rankSpacing': 62, 'padding': 16}}}%%
flowchart LR
    BASE["<b>Base image</b><br/><br/>Minimal and<br/>trusted"]
    BUILD["<b>Build</b><br/><br/>Dockerfile adds<br/>the app"]
    SCAN["<b>Scan</b><br/><br/>Trivy lists<br/>known CVEs"]
    RUN["<b>Run</b><br/><br/>Non-root, least<br/>privilege"]

    BASE ==> BUILD ==> SCAN ==> RUN

    style BASE fill:#1e3a5f,color:#fff,stroke:#0f1f33,stroke-width:4px
    style BUILD fill:#dbeafe,color:#1a202c,stroke:#1e3a5f,stroke-width:4px
    style SCAN fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    style RUN fill:#F5F5F5,color:#1a202c,stroke:#262626,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Scanning belongs in the pipeline, set to fail the build on critical findings, so vulnerable images never reach production
- Many findings are fixed simply by moving to a newer, smaller base image and rebuilding

#### Where you'd actually use this

A security review asks how many known vulnerabilities your production image carries. A Trivy scan shows most come from a full-size base image; switching to a slim variant cuts the list sharply, and the pipeline now blocks any image with critical findings.

#### Lab

1. **Check your Trivy install:** run `trivy --version` and confirm it matches the latest release published after the March 2026 fix on the [official releases page](https://github.com/aquasecurity/trivy/releases) (and is not v0.69.4). If you downloaded it by hand, confirm you verified its checksum.
2. **Scan a full-size and a slim base image,** and compare how many vulnerabilities each reports by severity:
   ```bash
   trivy image python:3.12
   trivy image python:3.12-slim
   ```
3. **Write a small Dockerfile** that starts from `python:3.12-slim` and adds a non-root user. In a new folder, create a one-line `app.py` containing `print("Hello from a non-root container")`, then save this next to it as `Dockerfile`:
   ```dockerfile
   FROM python:3.12-slim
   RUN useradd --create-home appuser
   WORKDIR /home/appuser
   COPY app.py .
   USER appuser
   CMD ["python", "app.py"]
   ```
4. **Build it and scan your own image:**
   ```bash
   docker build -t demo-app .
   trivy image demo-app
   ```
5. **Confirm it runs as non-root:** `docker run --rm demo-app whoami` should print `appuser`.
6. **Write a short finding:** the difference between the two base images, the highest-severity issue in your image, and what you'd change.

#### Checkpoint
You've checked that your Trivy install is a current, verified release, compared a full and a slim base image with it, built an image that runs as a non-root user, and scanned it yourself.

#### Quiz
1. What did the March 2026 Trivy compromise teach about installing and running security tools?
2. Why prefer a minimal base image?
3. What does Trivy report?
4. Why run containers as a non-root user?
5. Why pin image versions instead of using `latest`?

*Answers: 1) Security tools are part of your supply chain too: install them only from official sources, verify checksums, pin exact versions and pin GitHub Actions to commit SHAs rather than movable tags, and rotate every secret a compromised version could have reached. 2) Fewer packages mean fewer vulnerabilities and a smaller attack surface. 3) Known vulnerabilities (CVEs) in the image's packages, graded by severity. 4) So if the app is compromised, the attacker has limited power inside the container. 5) Builds become repeatable, and upgrades happen deliberately rather than by surprise.*

---

### Topic 9.3: Infrastructure as Code Security

Time: about 2 hours

#### Concept

**Infrastructure as Code (IaC)** describes servers, networks, and storage in text files, using tools such as **Terraform** or its open source fork **OpenTofu**, so infrastructure is created the same way every time and reviewed like any other code. That also means a misconfiguration, such as a storage bucket open to the internet, can be written, reviewed, and caught before anything is created.

- **Misconfiguration** is the most common cause of cloud breaches: public storage, open network ports, missing encryption, or overly broad permissions
- An **IaC scanner** such as **Checkov** reads configuration files and flags risky settings before they're deployed
- **Policy as code** turns security rules ("no public buckets", "encryption on by default") into automated checks that run in the pipeline
- **Drift** is when the live environment no longer matches the code because someone changed it by hand; IaC makes drift visible and fixable
- **State files** record what IaC tools have created and can contain sensitive values, so they must be stored securely, never committed to a public repository

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'20px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#1e3a5f', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 50, 'rankSpacing': 62, 'padding': 16}}}%%
flowchart LR
    CODE["<b>IaC files</b><br/><br/>Terraform or<br/>OpenTofu"]
    SCAN["<b>Scan</b><br/><br/>Checkov flags<br/>misconfigurations"]
    REV["<b>Review</b><br/><br/>Pull request<br/>approval"]
    APPLY["<b>Apply</b><br/><br/>Pipeline creates<br/>infrastructure"]

    CODE ==> SCAN ==> REV ==> APPLY

    style CODE fill:#1e3a5f,color:#fff,stroke:#0f1f33,stroke-width:4px
    style SCAN fill:#dbeafe,color:#1a202c,stroke:#1e3a5f,stroke-width:4px
    style REV fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    style APPLY fill:#F5F5F5,color:#1a202c,stroke:#262626,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Scanning IaC catches a public bucket in a pull request, minutes after it's written, instead of after data has leaked
- The same review habits you use for application code (small changes, a second reviewer, automated checks) apply to infrastructure

#### Where you'd actually use this

An engineer adds a storage bucket for log files and forgets to block public access. Checkov fails the pull request with a clear message, the setting is fixed in the review, and the bucket is never exposed.

#### Lab

You only write and scan files here; nothing is created in a real cloud account, so no cloud account or cost is needed.

1. **Create a folder** called `iac-lab` with a file `main.tf` describing a storage bucket with no security settings:
   ```hcl
   resource "aws_s3_bucket" "logs" {
     bucket = "my-demo-logs-bucket"
   }
   ```
2. **Scan it with Checkov** and read the failed checks:
   ```bash
   checkov -d iac-lab
   ```
3. **Fix two findings:** add a public access block with all four settings `true` (fixes `CKV2_AWS_6`) and turn on versioning (fixes `CKV_AWS_21`) by appending this to `main.tf`:
   ```hcl
   resource "aws_s3_bucket_public_access_block" "logs" {
     bucket                  = aws_s3_bucket.logs.id
     block_public_acls       = true
     block_public_policy     = true
     ignore_public_acls      = true
     restrict_public_buckets = true
   }

   resource "aws_s3_bucket_versioning" "logs" {
     bucket = aws_s3_bucket.logs.id
     versioning_configuration {
       status = "Enabled"
     }
   }
   ```
   Re-run the scan and confirm those two checks now pass. Some checks will still fail (for example cross-region replication or KMS encryption); real teams decide which checks apply to them and skip the rest deliberately, with a written reason.
4. **Add a `.gitignore`** in the folder that excludes `*.tfstate` and `*.tfstate.*`, and write one sentence on why.
5. **Write a short policy** of three rules your team's infrastructure must always follow, and note which Checkov checks enforce each one.

#### Checkpoint
You've scanned an insecure IaC file, fixed at least two misconfigurations until their checks pass, and written three infrastructure security rules with the checks that enforce them.

#### Quiz
1. What is Infrastructure as Code?
2. What is the most common cause of cloud breaches?
3. What does Checkov do?
4. What is drift?
5. Why must state files be kept out of public repositories?

*Answers: 1) Describing infrastructure such as servers, networks, and storage in text files, so it's created consistently and reviewed like code. 2) Misconfiguration, such as public storage, open ports, missing encryption, or overly broad permissions. 3) Scans IaC files and flags risky settings before they're deployed. 4) When the live environment no longer matches the code because of manual changes. 5) They record what's been created and can contain sensitive values.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "pipeline",
   "kicker": "Module 9 · DevOps security",
   "title": "Secure the pipeline",
   "beats": [
    {
     "say": "Welcome to Module 9, DevOps security."
    },
    {
     "say": "A C I C D pipeline tests and deploys code automatically. It holds the keys to production, so it's a prime target."
    },
    {
     "say": "DevSecOps means building security checks into the pipeline itself, so problems are caught on every change."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Topic 9.1 · Securing the pipeline",
   "title": "A secret scan stops a leaked key",
   "nodes": [
    {
     "id": "commit",
     "label": "Commit",
     "x": 12,
     "y": 30,
     "sub": "code pushed",
     "art": "git"
    },
    {
     "id": "scan",
     "label": "Security checks",
     "x": 38,
     "y": 70,
     "sub": "Gitleaks, Dependabot",
     "art": "search"
    },
    {
     "id": "tests",
     "label": "Tests",
     "x": 62,
     "y": 30,
     "sub": "must pass",
     "art": "test"
    },
    {
     "id": "deploy",
     "label": "Deploy",
     "x": 88,
     "y": 70,
     "sub": "pipeline secrets only",
     "art": "rocket"
    }
   ],
   "edges": [
    {
     "from": "commit",
     "to": "scan"
    },
    {
     "from": "scan",
     "to": "tests"
    },
    {
     "from": "tests",
     "to": "deploy"
    }
   ],
   "beats": [
    {
     "say": "A secure pipeline: commit, security checks, tests, deploy.",
     "show": 4
    },
    {
     "say": "A developer pastes a cloud key into a config file, and pushes it.",
     "show": 4,
     "on": "commit",
     "send": {
      "from": "commit",
      "to": "scan",
      "label": "push + key"
     }
    },
    {
     "say": "The secret scan fails the build within a minute.",
     "show": 4,
     "on": "scan",
     "send": {
      "from": "scan",
      "to": "commit",
      "label": "build failed"
     }
    },
    {
     "say": "Deleting the line isn't enough. The team revokes and replaces the key, then moves it into pipeline secrets.",
     "show": 4,
     "on": "commit"
    },
    {
     "say": "The clean commit passes, and goes on to the tests.",
     "show": 4,
     "on": "scan",
     "send": {
      "from": "scan",
      "to": "tests",
      "label": "checks passed"
     }
    },
    {
     "say": "Deploy uses pipeline secrets only, never the code.",
     "show": 4,
     "on": "deploy",
     "send": {
      "from": "tests",
      "to": "deploy",
      "label": "tests passed"
     }
    },
    {
     "say": "Catching problems this early is called shift left. It's where fixes are cheapest.",
     "show": 4,
     "on": [
      "commit",
      "scan"
     ]
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Steps 2 and 3",
   "title": "A deleted secret still lives in the history",
   "values": [
    "Initial commit",
    "Add config.py",
    "Remove API_KEY",
    "Update README"
   ],
   "beats": [
    {
     "say": "A repository's history: four commits, oldest first."
    },
    {
     "say": "Commit two adds a key in config dot py.",
     "hl": 1,
     "note": "API_KEY added"
    },
    {
     "say": "Commit three deletes it.",
     "hl": 2,
     "note": "Key gone from the code"
    },
    {
     "say": "But gitleaks git scans every commit in the history.",
     "ptr": {
      "scan": 0
     }
    },
    {
     "say": "At commit two, it finds the key.",
     "hl": 1,
     "ptr": {
      "scan": 1
     },
     "note": "Secret found in history"
    },
    {
     "say": "So a committed secret counts as leaked, even after it's deleted.",
     "hl": 1,
     "gone": [
      0,
      2,
      3
     ],
     "note": "Revoke and replace it"
    },
    {
     "say": "For a plain folder that isn't a Git repository, use gitleaks dir.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "note": "gitleaks dir = plain folder"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 4",
   "title": "Use a pipeline secret without printing it",
   "file": ".github/workflows/check.yml",
   "code": "on: [push]\npermissions:\n  contents: read\njobs:\n  check:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v5\n      - name: Confirm the secret is available\n        env:\n          DEMO_TOKEN: ${{ secrets.DEMO_TOKEN }}\n        run: >-\n          test -n \"$DEMO_TOKEN\"\n          && echo \"Secret is set\"",
   "beats": [
    {
     "say": "The lab workflow runs on every push.",
     "line": 1
    },
    {
     "say": "Its token can only read the repository contents. That's least privilege.",
     "line": [
      2,
      3
     ],
     "vars": {
      "token": "contents: read"
     }
    },
    {
     "say": "It checks out the code. In real pipelines, pin each action to its full commit S H A, not a tag.",
     "line": 8
    },
    {
     "say": "The secret isn't in the code. It's read at run time from the repository's encrypted secrets.",
     "line": [
      10,
      11
     ],
     "vars": {
      "DEMO_TOKEN": "***"
     }
    },
    {
     "say": "The test checks it's set, without printing it.",
     "line": [
      12,
      13,
      14
     ],
     "out": "Secret is set"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Topic 9.2 · A real supply-chain lesson",
   "title": "The Trivy compromise, March 2026",
   "nodes": [
    {
     "id": "creds",
     "label": "Stolen creds",
     "x": 12,
     "y": 30,
     "sub": "release credentials",
     "art": "key"
    },
    {
     "id": "release",
     "label": "Trivy releases",
     "x": 38,
     "y": 70,
     "sub": "v0.69.4 + action tags",
     "art": "package"
    },
    {
     "id": "pipe",
     "label": "Your pipeline",
     "x": 62,
     "y": 30,
     "sub": "latest or a tag",
     "art": "pipeline"
    },
    {
     "id": "secrets",
     "label": "Pipeline secrets",
     "x": 88,
     "y": 70,
     "sub": "every one it held",
     "art": "lock"
    }
   ],
   "edges": [
    {
     "from": "creds",
     "to": "release"
    },
    {
     "from": "release",
     "to": "pipe"
    },
    {
     "from": "pipe",
     "to": "secrets"
    }
   ],
   "beats": [
    {
     "say": "In March twenty twenty six, a real attack hit Trivy itself.",
     "show": 4
    },
    {
     "say": "Attackers used stolen release credentials to publish a malicious version.",
     "show": 4,
     "on": "creds",
     "send": {
      "from": "creds",
      "to": "release",
      "label": "bad v0.69.4"
     }
    },
    {
     "say": "They also moved almost all tags of the official Trivy GitHub Actions to malicious code.",
     "show": 4,
     "on": "release",
     "send": {
      "from": "creds",
      "to": "release",
      "label": "moved tags"
     }
    },
    {
     "say": "Pipelines that pulled the latest, or used a tag, ran that code.",
     "show": 4,
     "on": "pipe",
     "send": {
      "from": "release",
      "to": "pipe",
      "label": "attacker code"
     }
    },
    {
     "say": "That code could reach every secret they held.",
     "show": 4,
     "on": [
      "pipe",
      "secrets"
     ],
     "send": {
      "from": "secrets",
      "to": "pipe",
      "label": "all secrets"
     }
    },
    {
     "say": "Defences: install from official sources, verify the checksum, pin exact versions.",
     "show": 4,
     "on": "release"
    },
    {
     "say": "Pin actions to a full commit S H A. A tag can move; a commit can't.",
     "show": 4,
     "on": "pipe"
    },
    {
     "say": "If a compromised version ran, revoke and replace every secret it could reach.",
     "show": 4,
     "on": "secrets"
    },
    {
     "say": "A security tool is still part of your supply chain. Trusting its name isn't verifying it.",
     "show": 4,
     "on": [
      "creds",
      "release",
      "pipe",
      "secrets"
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 2 to 5",
   "title": "Build a slim image that runs as non-root",
   "file": "Dockerfile",
   "code": "FROM python:3.12-slim\nRUN useradd --create-home appuser\nWORKDIR /home/appuser\nCOPY app.py .\nUSER appuser\nCMD [\"python\", \"app.py\"]",
   "beats": [
    {
     "say": "Scan python three twelve and its slim variant with Trivy. Fewer packages means fewer known vulnerabilities."
    },
    {
     "say": "So start from the slim image, pinned to a version, not latest. By default it runs as root.",
     "line": 1,
     "vars": {
      "base": "python:3.12-slim",
      "user": "root"
     }
    },
    {
     "say": "Create a normal user, app user.",
     "line": 2
    },
    {
     "say": "Work in its home folder, and copy in app dot py.",
     "line": [
      3,
      4
     ],
     "vars": {
      "workdir": "/home/appuser"
     }
    },
    {
     "say": "Switch to app user. Now nothing runs as root.",
     "line": 5,
     "vars": {
      "user": "appuser"
     }
    },
    {
     "say": "Build it, scan it, and who am I prints app user. A compromised app now has limited power.",
     "line": 6,
     "out": "appuser"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Topic 9.3 · Infrastructure as code",
   "title": "Catch the open bucket before it exists",
   "nodes": [
    {
     "id": "code",
     "label": "main.tf",
     "x": 12,
     "y": 25,
     "sub": "Terraform or OpenTofu",
     "art": "blueprint"
    },
    {
     "id": "scan",
     "label": "Checkov",
     "x": 45,
     "y": 25,
     "sub": "policy as code",
     "art": "search"
    },
    {
     "id": "review",
     "label": "Review",
     "x": 80,
     "y": 25,
     "sub": "pull request",
     "art": "people"
    },
    {
     "id": "apply",
     "label": "Apply",
     "x": 80,
     "y": 75,
     "sub": "pipeline creates it",
     "art": "pipeline"
    },
    {
     "id": "live",
     "label": "Live cloud",
     "x": 40,
     "y": 75,
     "sub": "the real bucket",
     "art": "cloud"
    }
   ],
   "edges": [
    {
     "from": "code",
     "to": "scan"
    },
    {
     "from": "scan",
     "to": "review"
    },
    {
     "from": "review",
     "to": "apply"
    },
    {
     "from": "apply",
     "to": "live"
    },
    {
     "from": "live",
     "to": "code"
    }
   ],
   "beats": [
    {
     "say": "Infrastructure as code describes servers and storage in text files, like this Terraform file.",
     "show": 1,
     "on": "code"
    },
    {
     "say": "An engineer adds a log bucket, and forgets to block public access.",
     "show": 2,
     "on": "code",
     "send": {
      "from": "code",
      "to": "scan",
      "label": "logs bucket"
     }
    },
    {
     "say": "Checkov fails the pull request. Nothing exists yet.",
     "show": 2,
     "on": "scan",
     "send": {
      "from": "scan",
      "to": "code",
      "label": "FAILED checks"
     }
    },
    {
     "say": "It's fixed, the checks pass, and a second person reviews it.",
     "show": 3,
     "on": "review",
     "send": {
      "from": "scan",
      "to": "review",
      "label": "checks passed"
     }
    },
    {
     "say": "Then the pipeline creates the bucket, never exposed.",
     "show": 5,
     "on": [
      "apply",
      "live"
     ],
     "send": {
      "from": "apply",
      "to": "live",
      "label": "create bucket"
     }
    },
    {
     "say": "A state file records what was created. It can hold sensitive values, so keep it out of Git.",
     "show": 5,
     "on": "apply"
    },
    {
     "say": "A hand edit to the live bucket makes it differ from the code. That's drift.",
     "show": 5,
     "on": [
      "live",
      "code"
     ],
     "send": {
      "from": "live",
      "to": "code",
      "label": "doesn't match"
     }
    },
    {
     "say": "Policy as code turns rules like no public buckets into automatic checks.",
     "show": 5,
     "on": "scan"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 2 and 3",
   "title": "Fix two Checkov findings",
   "columns": [
    "Check",
    "Wants",
    "Before",
    "After fix"
   ],
   "rows": [
    [
     "CKV2_AWS_6",
     "Public access block",
     "FAILED",
     "PASSED"
    ],
    [
     "CKV_AWS_21",
     "Versioning on",
     "FAILED",
     "PASSED"
    ],
    [
     "Replication",
     "Cross-region copy",
     "FAILED",
     "FAILED"
    ],
    [
     "Encryption",
     "KMS key",
     "FAILED",
     "FAILED"
    ]
   ],
   "beats": [
    {
     "say": "A bare bucket fails several checks. Here are four.",
     "sql": "checkov -d iac-lab",
     "col": 2
    },
    {
     "say": "One wants a public access block.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "One wants versioning.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "Add a public access block with all four settings true, enable versioning, and scan again. Both now pass.",
     "sql": "+ public access block, all four true\n+ versioning: Enabled",
     "hl": [
      0,
      1
     ],
     "col": 3
    },
    {
     "say": "Replication and K M S encryption still fail.",
     "hl": [
      2,
      3
     ],
     "dim": true,
     "col": 3
    },
    {
     "say": "Teams deliberately skip checks that don't apply, with a written reason.",
     "hl": [
      2,
      3
     ]
    },
    {
     "say": "Last, write three rules, and the checks that enforce each.",
     "col": 0
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why is deleting a committed secret from the code not enough?",
   "options": [
    "Gitleaks will keep flagging the file",
    "It slows down every pipeline run",
    "It stays in the repository history and may already be copied, so it must be revoked and replaced"
   ],
   "answer": 2,
   "good": "That's right. The secret remains in the history and may already have been copied, so revoke and replace it first, then clean up.",
   "bad": "Not quite. The secret remains in the history and may already have been copied, so revoke and replace it first, then clean up.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why is deleting a committed secret from the code not enough?",
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
     "Gitleaks caught a secret",
     ""
    ],
    [
     "Pipeline secret, read-only",
     ""
    ],
    [
     "Dependabot alerts on",
     ""
    ],
    [
     "Checksum verified",
     ""
    ],
    [
     "You can explain the Trivy lesson",
     ""
    ],
    [
     "Full vs slim compared",
     ""
    ],
    [
     "Non-root image built and scanned",
     ""
    ],
    [
     "Two Checkov findings fixed",
     ""
    ],
    [
     "Three rules written",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 9.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "Gitleaks caught your fake secret,",
     "show": 1
    },
    {
     "say": "a pipeline secret runs read-only,",
     "show": 2
    },
    {
     "say": "Dependabot alerts are on,",
     "show": 3
    },
    {
     "say": "you've verified a checksum,",
     "show": 4
    },
    {
     "say": "you can explain the Trivy lesson,",
     "show": 5
    },
    {
     "say": "you've compared full and slim images,",
     "show": 6
    },
    {
     "say": "you've built a non-root image,",
     "show": 7
    },
    {
     "say": "you've fixed two Checkov findings,",
     "show": 8
    },
    {
     "say": "and you've written three rules.",
     "show": 9
    },
    {
     "say": "Next, in Module 10, A I agent security.",
     "show": 9
    }
   ]
  }
 ]
}
```

---

## Module 9 Completion Checklist
- [ ] Caught a deliberately committed fake secret with Gitleaks
- [ ] Used a pipeline secret in a GitHub Actions workflow with read-only permissions
- [ ] Turned on Dependabot alerts for a repository
- [ ] Installed the scanners from official sources and verified a download's checksum
- [ ] Can explain what the March 2026 Trivy compromise teaches about the software supply chain
- [ ] Compared a full and a slim base image with Trivy
- [ ] Built and scanned an image that runs as a non-root user
- [ ] Scanned an insecure IaC file with Checkov and fixed two findings
- [ ] Written three infrastructure security rules and the checks that enforce them
