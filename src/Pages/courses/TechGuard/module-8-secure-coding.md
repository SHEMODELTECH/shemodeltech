<!-- order: 8 -->
## Module 8: Secure Coding

**Time: about 5 hours** (roughly 2 hours for the OWASP Top 10, 3 hours for secure APIs).

**By the end of this module, you'll be able to:**
- Name the OWASP Top 10:2025 categories and explain the new Software Supply Chain Failures item
- Fix an injection flaw with a parameterised query and a broken-access-control flaw with a server-side check
- Scan dependencies, verify registry signatures, and generate an SBOM with `npm`
- Run a small API with authentication, object-level authorization, input validation, and rate limiting, and test each gate with `curl`

**Tools needed for this module:** a code editor and a language runtime you're comfortable with (Node.js or Python are convenient for the examples), a terminal, and `curl` from Module 1 for testing endpoints. Optionally, a deliberately-vulnerable practice app like **OWASP Juice Shop** run locally, and a dependency scanner such as `npm audit`. As always, only test applications you own or that are built for training.

### Topic 8.1: OWASP Top 10

Time: about 2 hours

#### Concept

The **OWASP Top 10** is the industry-standard awareness list of the most critical security risks facing web applications, published by the **Open Worldwide Application Security Project** and updated every few years. The current edition is the **OWASP Top 10:2025**, released in November 2025 (full details at owasp.org/Top10/2025). It isn't a complete checklist of everything, it's the short list of what most commonly and seriously goes wrong, and it gives developers and testers a shared vocabulary and a starting point for building and reviewing secure software. The list is worth knowing by category, and worth understanding defensively: for each risk, the goal is to know how to prevent it, not how to exploit it.

The 2025 list, in rank order:

| Rank | Risk |
|---|---|
| A01 | Broken Access Control |
| A02 | Security Misconfiguration |
| A03 | Software Supply Chain Failures |
| A04 | Cryptographic Failures |
| A05 | Injection |
| A06 | Insecure Design |
| A07 | Authentication Failures |
| A08 | Software or Data Integrity Failures |
| A09 | Security Logging and Alerting Failures |
| A10 | Mishandling of Exceptional Conditions |

The five you'll meet most often in code review:

- **A01 Broken Access Control** (still number one in 2025) is when users can act outside their intended permissions, the defence is server-side authorization checks on every request and deny-by-default
- **A02 Security Misconfiguration** covers insecure defaults, unnecessary features left on, and verbose error messages that leak internals, the defence is hardening and minimising the configuration
- **A03 Software Supply Chain Failures** (new in 2025, it widens the older "Vulnerable and Outdated Components" item) covers everything your software is built from and with: libraries, build tools, CI/CD pipelines, and the places you download them from. A compromised or vulnerable package becomes your vulnerability. The defences are: keep a **Software Bill of Materials (SBOM)**, a list of every component and version you ship; **pin dependency versions** with a lockfile and **verify** them (checksums, registry signatures) instead of pulling whatever is newest; use **signed builds** so you can prove an artifact came from your pipeline unchanged; and keep scanning and patching components
- **A04 Cryptographic Failures** cover weak or missing protection of sensitive data, the defence ties back to Module 4: strong algorithms, proper key handling, encryption in transit and at rest
- **A05 Injection** (such as SQL injection) happens when untrusted input is interpreted as a command or query, the defence is parameterised queries and strict input validation, never building queries by string concatenation

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'20px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#7f1d1d', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 50, 'rankSpacing': 62, 'padding': 16}}}%%
flowchart LR
    IN["<b>Untrusted input</b><br/><br/>From users or<br/>other systems"]
    VAL["<b>Validate</b><br/><br/>Check &<br/>sanitise"]
    PAR["<b>Parameterise</b><br/><br/>Never concat<br/>into queries"]
    AUTHZ["<b>Authorize</b><br/><br/>Server-side,<br/>deny by default"]
    SAFE["<b>Safe operation</b><br/><br/>Risk<br/>reduced"]

    IN ==> VAL ==> PAR ==> AUTHZ ==> SAFE

    style IN fill:#c1121f,color:#fff,stroke:#7f1d1d,stroke-width:4px
    style VAL fill:#fde2e2,color:#1a202c,stroke:#c1121f,stroke-width:4px
    style PAR fill:#fde2e2,color:#1a202c,stroke:#c1121f,stroke-width:4px
    style AUTHZ fill:#fde2e2,color:#1a202c,stroke:#c1121f,stroke-width:4px
    style SAFE fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- A recurring theme across the Top 10 is **never trust input and always check authorization server-side**, the client can be manipulated, so every security decision has to be enforced on the server where the attacker can't reach it
- The Top 10 is an **awareness baseline, not a finish line**, clearing it is the minimum, not proof an app is secure, real security also needs secure design, testing, and defence in depth

#### Where you'd actually use this

Building web applications, reviewing code and pull requests for security issues, guiding a security assessment, and training developers. The Top 10 is the common reference point for "what should we make sure we didn't get wrong?" in nearly every web project.

#### Lab

> A code-review-and-fix exercise. No attacking required, the point is to recognise and repair the flaws.

1. **Study this vulnerable pattern** (building a query by concatenation, an injection risk):
```javascript
// Vulnerable: user input concatenated straight into the query
const q = "SELECT * FROM users WHERE name = '" + userInput + "'";
```
2. **Rewrite it safely** using a parameterised query, so input can never be treated as SQL:
```javascript
// Safe: input is passed as a parameter, not part of the query text
const q = "SELECT * FROM users WHERE name = ?";
db.query(q, [userInput]);
```
3. **Study this broken-access-control pattern** (trusting the client to say who it is):
```javascript
// Vulnerable: trusts a client-supplied role
if (request.body.role === "admin") { deleteUser(); }
```
4. **Rewrite it safely** with a server-side authorization check that doesn't trust client input:
```javascript
// Safe: authorization decided server-side from the authenticated session
if (session.user.isAdmin) { deleteUser(); }
```
5. **Check your software supply chain** in a Node.js project you own (one with a `package-lock.json`; npm 10 or newer). Scan for components with known flaws, verify the registry signatures of what you installed, and generate an SBOM:
```bash
npm audit
npm audit signatures
npm sbom --sbom-format cyclonedx > sbom.json
```
Open `sbom.json` and find one of your direct dependencies and its exact version. The lockfile pins those versions; the SBOM records them.

#### Checkpoint
You can recognise and fix an injection flaw (parameterisation) and a broken-access-control flaw (server-side authorization), you've scanned and verified your dependencies and produced an SBOM, and you can explain the recurring principle that input is never trusted and authorization is always enforced server-side.

#### Quiz
1. What is the OWASP Top 10, who publishes it, and which edition is current?
2. What causes injection, and what is the main defence against it?
3. What is broken access control, and how do you defend against it?
4. What does A03 Software Supply Chain Failures cover, and name two defences against it.
5. Why is the OWASP Top 10 described as a baseline rather than a complete guarantee of security?

*Answers: 1) An industry-standard awareness list of the most critical web application security risks, published by the Open Worldwide Application Security Project (OWASP); the current edition is the OWASP Top 10:2025, released in November 2025. 2) Injection happens when untrusted input is interpreted as part of a command or query; the main defence is parameterised queries plus strict input validation, never concatenating input into queries. 3) Broken access control (A01, still number one) is when users can act outside their intended permissions; you defend against it with server-side authorization checks on every request and a deny-by-default posture. 4) Risks in everything your software is built from and with, such as vulnerable or compromised libraries, build tools, and pipelines; defences include keeping an SBOM, pinning and verifying dependencies, signed builds, and scanning and patching components (any two). 5) Because it covers only the most common and critical risks, not everything; clearing it is the minimum bar, and real security also requires secure design, testing, and defence in depth.*

---

### Topic 8.2: Secure APIs

Time: about 3 hours

#### Concept

**APIs** are the interfaces that let applications and services talk to each other, and because they expose functionality and data directly, they're one of the biggest attack surfaces in modern software (OWASP maintains a separate API Security Top 10 for exactly this reason). A secure API treats every request as untrusted and puts it through a series of gates: prove who you are (**authentication**), prove you're allowed to do this specific thing (**authorization**), validate the input, limit the rate, and always travel over encrypted transport. The single most common API flaw is failing to check that the caller is authorized for the *specific object* they're requesting.

- **Authentication** verifies the caller, using established mechanisms like **OAuth 2.0** tokens or API keys, never a home-grown scheme, and never trusting the client to assert its own identity
- **Authorization on every request** must check both function-level and **object-level** permissions, broken object-level authorization (asking for record 124 when you're only entitled to 123) is the top API risk
- **Input validation** checks and sanitises all incoming data server-side, since APIs receive input from clients you don't control
- **Rate limiting** caps how many requests a caller can make, blunting brute-force, credential-stuffing, and abuse
- **Transport security** means always using HTTPS/TLS (Modules 1 and 4), so tokens and data are never sent in the clear

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'19px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#134e4a', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 42, 'rankSpacing': 52, 'padding': 14}}}%%
flowchart LR
    REQ["<b>Request</b><br/><br/>Over HTTPS<br/>(TLS)"]
    AUTHN["<b>Authenticate</b><br/><br/>Valid token?"]
    AUTHZ["<b>Authorize</b><br/><br/>Allowed for<br/>this object?"]
    VAL["<b>Validate</b><br/><br/>Input checked,<br/>rate limited"]
    OK["<b>Handler</b><br/><br/>Runs only if<br/>all gates pass"]

    REQ ==> AUTHN ==> AUTHZ ==> VAL ==> OK

    style REQ fill:#0f766e,color:#fff,stroke:#134e4a,stroke-width:4px
    style AUTHN fill:#F5F5F5,color:#1a202c,stroke:#0f766e,stroke-width:4px
    style AUTHZ fill:#F5F5F5,color:#1a202c,stroke:#0f766e,stroke-width:4px
    style VAL fill:#F5F5F5,color:#1a202c,stroke:#0f766e,stroke-width:4px
    style OK fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- The gates are ordered and every request passes through all of them, a request that authenticates successfully still has to prove it's authorized for the specific object it asked for, which is exactly the check that's most often missed
- Secure APIs also fail safely: return generic errors that don't leak internal details, and log requests for monitoring (Module 7), so an attack on the API is both hard to succeed at and easy to detect

#### Where you'd actually use this

Designing and reviewing any API that backs a web or mobile app, a public developer API, or service-to-service communication in a system. As applications increasingly become collections of APIs, securing them well is one of the most important secure-coding skills.

#### Lab

> You'll run a tiny API on your own computer and test every gate with `curl`. Nothing leaves your machine. Needs Python 3.12+.

1. **Picture the insecure version first**: an endpoint `/api/records/<id>` that returns any record to anyone. List what's missing: authentication, object-level authorization, input validation, rate limiting, and TLS.
2. **Install Flask** in a terminal:
```bash
pip install flask
```
(If pip refuses with an "externally-managed-environment" error, which is common on recent Linux and Homebrew Python, first create and activate a virtual environment: `python3 -m venv .venv` then `source .venv/bin/activate`, or `.venv\Scripts\activate` on Windows, and run the install again.)
3. **Save this as `api.py`**. It's the same endpoint with the gates added; each gate is commented. The two demo users get random tokens every time the server starts, so no credential is written in the code.
```python
# api.py: a tiny records API with every security gate, for local practice only
import re
import secrets
import time
from collections import defaultdict, deque

from flask import Flask, jsonify, request

app = Flask(__name__)

# Two demo users. Their tokens are random and new every time the server starts,
# so no credential is ever written in the code.
TOKENS = {
    secrets.token_urlsafe(16): "alice",
    secrets.token_urlsafe(16): "bob",
}

RECORDS = {
    123: {"id": 123, "owner": "alice", "note": "Alice's private note"},
    124: {"id": 124, "owner": "bob", "note": "Bob's private note"},
}

RATE_LIMIT = 5    # requests allowed...
RATE_WINDOW = 10  # ...per this many seconds, per caller
recent_requests = defaultdict(deque)


def is_rate_limited(caller):
    now = time.monotonic()
    times = recent_requests[caller]
    while times and now - times[0] > RATE_WINDOW:
        times.popleft()
    if len(times) >= RATE_LIMIT:
        return True
    times.append(now)
    return False


def current_user():
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return None
    return TOKENS.get(header.removeprefix("Bearer "))


@app.get("/api/records/<record_id>")
def get_record(record_id):
    # Gate 1: rate limit each caller (by IP address)
    if is_rate_limited(request.remote_addr):
        return jsonify(error="Too many requests"), 429

    # Gate 2: authentication (who are you?)
    user = current_user()
    if user is None:
        return jsonify(error="Authentication required"), 401

    # Gate 3: input validation (IDs are digits only)
    if not re.fullmatch(r"\d{1,9}", record_id):
        return jsonify(error="Invalid record ID"), 400

    record = RECORDS.get(int(record_id))
    if record is None:
        return jsonify(error="Not found"), 404

    # Gate 4: object-level authorization (is THIS record yours?)
    if record["owner"] != user:
        return jsonify(error="Forbidden"), 403

    return jsonify(record), 200


if __name__ == "__main__":
    for token, name in TOKENS.items():
        print(f"Token for {name}: {token}")
    # Local practice only: plain HTTP on your own machine.
    # In production this must sit behind HTTPS (TLS).
    app.run(host="127.0.0.1", port=8000)
```
4. **Start it** with `python api.py`. It prints a token for alice and one for bob; leave this terminal running and open a second one. (On Windows PowerShell, type `curl.exe` instead of `curl` in the next steps.)
5. **Test authentication**: call the endpoint with no token. You should get `401`.
```bash
curl -i http://127.0.0.1:8000/api/records/123
```
6. **Test object-level authorization**: paste alice's token in place of `ALICE_TOKEN`. Record 123 is hers, so you get `200` and the note; record 124 is bob's, so you get `403`. This is the check that's most often missing in real APIs.
```bash
curl -i -H "Authorization: Bearer ALICE_TOKEN" http://127.0.0.1:8000/api/records/123
curl -i -H "Authorization: Bearer ALICE_TOKEN" http://127.0.0.1:8000/api/records/124
```
   **A note on 403 vs 404:** this lab returns `404` for a record that doesn't exist but `403` for someone else's record, so each gate shows its own status code. The trade-off is that a caller can tell the two apart and learn which record IDs exist. Many real APIs (including the one you build in She Model Tech's APIs course) return `404` in both cases, which hides whether the record exists at all.
7. **Test input validation**: request `/api/records/abc` with alice's token and confirm you get `400`.
8. **Test the rate limit**: wait 10 seconds, then run the step 5 command six times quickly. The first five calls still return `401` (they have no token, but they count toward the limit); the sixth returns `429 Too Many Requests`.
9. **Note the missing gate**: this server uses plain HTTP because it only listens on your own computer. Write one sentence on why a real deployment must serve it over HTTPS (hint: what would an eavesdropper see in the `Authorization` header?).

#### Checkpoint
You can identify the security gates a request should pass (transport, authentication, object-level authorization, validation, rate limiting), you've run an endpoint that has them and watched each one return its status code (401, 403, 400, 429), and you can explain why broken object-level authorization is the top API risk.

#### Quiz
1. Why are APIs considered such a large attack surface?
2. What is the difference between authentication and authorization for an API request?
3. What is broken object-level authorization, and why is it so common?
4. What does rate limiting protect against?
5. Name two things beyond authentication that a secure API request should pass through.

*Answers: 1) Because APIs expose application functionality and data directly to callers, so flaws in them give attackers direct access; they receive input from clients the provider doesn't control. 2) Authentication verifies who the caller is (a valid token), while authorization decides whether that authenticated caller is allowed to perform this specific action on this specific object. 3) It's when an API authenticates a user but fails to check they're entitled to the specific object requested (for example returning record 124 to a user only entitled to 123); it's common because developers often check identity but forget the per-object permission check. 4) Brute-force attempts, credential stuffing, and general abuse, by capping how many requests a caller can make. 5) For example: object-level and function-level authorization, input validation, rate limiting, and transport security (HTTPS/TLS), any two.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "code",
   "kicker": "Module 8 · Secure coding",
   "title": "Never trust input",
   "beats": [
    {
     "say": "Welcome to Module 8, secure coding."
    },
    {
     "say": "You'll learn the OWASP Top 10, fix two classic flaws, check your software supply chain, and run a small A P I with every security gate in place."
    },
    {
     "say": "As always, only test applications you own, or that are built for training."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Topic 8.1 · OWASP Top 10:2025",
   "title": "The five you'll meet most in code review",
   "columns": [
    "Rank",
    "Risk",
    "Defence"
   ],
   "rows": [
    [
     "A01",
     "Broken Access Control",
     "Server-side checks"
    ],
    [
     "A02",
     "Security Misconfig.",
     "Harden, minimise"
    ],
    [
     "A03 · new",
     "Supply Chain Failures",
     "SBOM, pin, verify"
    ],
    [
     "A04",
     "Cryptographic Failures",
     "Strong crypto, keys"
    ],
    [
     "A05",
     "Injection",
     "Parameterised queries"
    ]
   ],
   "beats": [
    {
     "say": "The OWASP Top 10 lists the most critical web application risks. The current edition is twenty twenty five.",
     "sql": "OWASP Top 10:2025 · A01 to A10 · top five shown"
    },
    {
     "say": "Broken access control is still number one: users acting outside their permissions.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Security misconfiguration: insecure defaults, and errors that leak internals.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "Software supply chain failures is new: a compromised package becomes your vulnerability.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "Then cryptographic failures, and injection.",
     "hl": [
      3,
      4
     ],
     "dim": true
    },
    {
     "say": "For each, the goal is prevention. And the list is a baseline, not a finish line.",
     "col": 2
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 1 and 2",
   "title": "Fix the injection",
   "file": "users.js",
   "code": "// Vulnerable: input concatenated into the query\nconst q = \"SELECT * FROM users WHERE name = '\"\n  + userInput + \"'\";\n\n// Safe: input is passed as a parameter\nconst q = \"SELECT * FROM users WHERE name = ?\";\ndb.query(q, [userInput]);",
   "beats": [
    {
     "say": "The lab is review and fix, no attacking. Here, user input is glued straight into the S Q L text.",
     "line": [
      2,
      3
     ]
    },
    {
     "say": "With the name Ada, that builds a normal query.",
     "line": [
      2,
      3
     ],
     "vars": {
      "userInput": "\"Ada\"",
      "q": "SELECT * FROM users WHERE name = 'Ada'"
     }
    },
    {
     "say": "Now the surname O'Brien. Its apostrophe closes the quoted name early.",
     "line": [
      2,
      3
     ],
     "vars": {
      "userInput": "\"O'Brien\"",
      "q": "SELECT * FROM users WHERE name = 'O'Brien'"
     }
    },
    {
     "say": "So Brien is read as part of the query, not as data. Here it's only a syntax error, but input has crossed into code. That's injection.",
     "line": [
      2,
      3
     ],
     "out": "query error: input became part of the SQL"
    },
    {
     "say": "The fix: fixed query text, with a question mark placeholder.",
     "line": 6,
     "vars": {
      "userInput": "\"O'Brien\"",
      "q": "SELECT * FROM users WHERE name = ?"
     }
    },
    {
     "say": "The input travels separately, as a parameter, so it can never be treated as S Q L.",
     "line": 7,
     "vars": {
      "userInput": "\"O'Brien\"",
      "q": "SELECT * FROM users WHERE name = ?",
      "params": "[\"O'Brien\"]"
     },
     "out": "rows where name is O'Brien"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 3 and 4",
   "title": "Fix the access check",
   "file": "admin.js",
   "code": "// Vulnerable: trusts a client-supplied role\nif (request.body.role === \"admin\") { deleteUser(); }\n\n// Safe: decided server-side from the session\nif (session.user.isAdmin) { deleteUser(); }",
   "beats": [
    {
     "say": "Next, broken access control. Bob is a regular user, but this check trusts a role his request sends.",
     "line": 2,
     "vars": {
      "session.user": "bob",
      "request.body.role": "\"admin\""
     }
    },
    {
     "say": "The client can be manipulated, so delete user runs for Bob.",
     "line": 2,
     "vars": {
      "session.user": "bob",
      "request.body.role": "\"admin\""
     },
     "out": "deleteUser() ran  ✗"
    },
    {
     "say": "The fix asks the server's own session instead.",
     "line": 5,
     "vars": {
      "session.user": "bob",
      "session.user.isAdmin": "false"
     }
    },
    {
     "say": "Bob isn't an admin, so nothing happens. Never trust input, and enforce authorization on the server.",
     "line": 5,
     "vars": {
      "session.user": "bob",
      "session.user.isAdmin": "false"
     },
     "out": "deleteUser() skipped  ✓"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 5",
   "title": "Check your software supply chain",
   "nodes": [
    {
     "id": "reg",
     "label": "npm registry",
     "x": 14,
     "y": 25,
     "sub": "packages, signatures",
     "art": "cloud"
    },
    {
     "id": "lock",
     "label": "package-lock.json",
     "x": 14,
     "y": 75,
     "sub": "pinned versions",
     "art": "doc"
    },
    {
     "id": "proj",
     "label": "Your project",
     "x": 50,
     "y": 50,
     "sub": "a Node app you own",
     "art": "package"
    },
    {
     "id": "sbom",
     "label": "sbom.json",
     "x": 86,
     "y": 50,
     "sub": "CycloneDX SBOM",
     "art": "checklist"
    }
   ],
   "edges": [
    {
     "from": "reg",
     "to": "proj"
    },
    {
     "from": "lock",
     "to": "proj"
    },
    {
     "from": "proj",
     "to": "sbom"
    }
   ],
   "beats": [
    {
     "say": "Your lockfile pins every dependency to an exact version, not whatever is newest.",
     "show": 3,
     "on": "lock",
     "send": {
      "from": "lock",
      "to": "proj",
      "label": "exact versions"
     }
    },
    {
     "say": "N P M audit checks those versions for known flaws.",
     "show": 3,
     "on": "reg",
     "send": {
      "from": "proj",
      "to": "reg",
      "label": "npm audit"
     }
    },
    {
     "say": "Audit signatures verifies the registry's signatures on what you installed.",
     "show": 3,
     "on": "proj",
     "send": {
      "from": "reg",
      "to": "proj",
      "label": "signatures OK"
     }
    },
    {
     "say": "And N P M S bom writes a Software Bill of Materials: every component and version you ship.",
     "show": 4,
     "on": "sbom",
     "send": {
      "from": "proj",
      "to": "sbom",
      "label": "cyclonedx"
     }
    },
    {
     "say": "The lockfile pins versions. The S bom records them.",
     "show": 4,
     "on": [
      "lock",
      "sbom"
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Topic 8.2 · Secure APIs",
   "title": "Trace each curl test through the gates",
   "file": "api.py",
   "code": "def get_record(record_id):\n    if is_rate_limited(request.remote_addr):\n        return jsonify(error=...), 429\n    user = current_user()\n    if user is None:\n        return jsonify(error=...), 401\n    if not re.fullmatch(r\"\\d{1,9}\", record_id):\n        return jsonify(error=...), 400\n    record = RECORDS.get(int(record_id))\n    if record is None:\n        return jsonify(error=...), 404\n    if record[\"owner\"] != user:\n        return jsonify(error=...), 403\n    return jsonify(record), 200",
   "beats": [
    {
     "say": "A P I s expose data directly, so every request is untrusted. In the lab, this Flask A P I runs on your computer. Record one two three is Alice's, one two four is Bob's.",
     "line": 1
    },
    {
     "say": "Test one: no token. Gate one, the rate limit, passes. Gate two finds no user: four oh one.",
     "line": [
      2,
      4,
      5,
      6
     ],
     "vars": {
      "record_id": "\"123\"",
      "calls in 10 s": 1,
      "user": "None"
     },
     "out": "401 {\"error\": \"Authentication required\"}"
    },
    {
     "say": "Test two: Alice's token, record one two three. Valid digits, the record exists, and she owns it: two hundred.",
     "line": [
      7,
      9,
      12,
      14
     ],
     "vars": {
      "record_id": "\"123\"",
      "calls in 10 s": 2,
      "user": "\"alice\"",
      "owner": "\"alice\""
     },
     "out": "200 {\"id\": 123, \"note\": \"Alice's private note\", ...}"
    },
    {
     "say": "Test three: Alice asks for one two four. She's authenticated, but it's Bob's: four oh three.",
     "line": [
      12,
      13
     ],
     "vars": {
      "record_id": "\"124\"",
      "calls in 10 s": 3,
      "user": "\"alice\"",
      "owner": "\"bob\""
     },
     "out": "403 {\"error\": \"Forbidden\"}"
    },
    {
     "say": "That object-level check is the one most often missing. Broken object-level authorization is the top A P I risk.",
     "line": 12
    },
    {
     "say": "Test four: an I D of A B C isn't digits: four hundred.",
     "line": [
      7,
      8
     ],
     "vars": {
      "record_id": "\"abc\"",
      "calls in 10 s": 4,
      "user": "\"alice\""
     },
     "out": "400 {\"error\": \"Invalid record ID\"}"
    },
    {
     "say": "Then, after ten seconds, six quick calls. The first five get four oh one.",
     "line": [
      2,
      6
     ],
     "vars": {
      "record_id": "\"123\"",
      "calls in 10 s": 5,
      "user": "None"
     },
     "out": "401 · 401 · 401 · 401 · 401"
    },
    {
     "say": "The sixth hits the limit at gate one: four twenty nine.",
     "line": [
      2,
      3
     ],
     "vars": {
      "record_id": "\"123\"",
      "calls in 10 s": 5
     },
     "out": "429 {\"error\": \"Too many requests\"}"
    },
    {
     "say": "One gate is missing on purpose: this is plain H T T P on your own machine. Write why a real deployment needs H T T P S. What would an eavesdropper see in the Authorization header?",
     "line": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What is broken object-level authorization?",
   "options": [
    "An API with no login at all",
    "An API that checks who you are, but not whether you're entitled to the specific object you asked for",
    "A token that has expired"
   ],
   "answer": 1,
   "good": "That's right. The caller is authenticated, but the A P I never checks they're entitled to that specific record, like returning record one two four to someone only entitled to one two three.",
   "bad": "Not quite. The caller is authenticated, but the A P I never checks they're entitled to that specific record, like returning record one two four to someone only entitled to one two three.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What is broken object-level authorization?",
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
     "Injection fixed",
     ""
    ],
    [
     "Access control fixed",
     ""
    ],
    [
     "You can name the Top 10:2025",
     ""
    ],
    [
     "Dependencies scanned, SBOM generated",
     ""
    ],
    [
     "Local API with every gate",
     ""
    ],
    [
     "401, 403, 400 and 429 seen",
     ""
    ],
    [
     "Never trust input",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 8.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you've fixed an injection flaw with a parameterised query,",
     "show": 1
    },
    {
     "say": "you've fixed broken access control with a server-side check,",
     "show": 2
    },
    {
     "say": "you can name the OWASP Top 10 twenty twenty five, and explain supply chain failures,",
     "show": 3
    },
    {
     "say": "you've scanned dependencies, verified signatures and generated an S bom,",
     "show": 4
    },
    {
     "say": "you've run a local A P I with every gate explained,",
     "show": 5
    },
    {
     "say": "you've seen unauthenticated, unauthorized, invalid and too-frequent requests each rejected,",
     "show": 6
    },
    {
     "say": "and you can explain the principle: never trust input, and enforce authorization server-side, per object.",
     "show": 7
    },
    {
     "say": "Next, in Module 9, DevOps security.",
     "show": 7
    }
   ]
  }
 ]
}
```

---

## Module 8 Completion Checklist
- [ ] Recognised and fixed an injection flaw using a parameterised query
- [ ] Recognised and fixed a broken-access-control flaw using a server-side authorization check
- [ ] Can name the OWASP Top 10:2025 categories and explain the new Software Supply Chain Failures item
- [ ] Ran a dependency scan, verified registry signatures, and generated an SBOM
- [ ] Ran a local API with transport, authentication, object-level authorization, validation, and rate limiting gates explained
- [ ] Tested that unauthenticated, unauthorized, invalid, and too-frequent requests are each rejected
- [ ] Can explain the recurring principle: never trust input, and always enforce authorization server-side and per object
