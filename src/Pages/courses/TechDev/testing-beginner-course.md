<!-- order: 9 -->
# Testing for Builders: A Practical Beginner's Course

## Course Overview

**By the end of this course, you'll be able to:**
- Explain the testing pyramid and decide which kind of test a check belongs in
- Write unit tests in Jest using Arrange, Act, Assert, including tests for edge cases and expected errors
- Write integration tests that send real HTTP requests into an Express API with Supertest
- Write end-to-end tests in Playwright that drive a real browser through a user flow
- Read a failing test's output and tell whether it points to a logic bug or a wiring problem

**Who this is for:** Beginners who can write working code and now want a reliable way to prove it keeps working, catching bugs before users do, and catching them again every time something changes.

**How the course works:** Four modules. Every topic follows the same pattern:
- **Concept** - what it is, in plain language
- **Syntax at a Glance** - the core patterns you'll actually type
- **Where you'd actually use this** - a real product scenario
- **Lab** - hands-on, runnable examples
- **Checkpoint**
- **Quiz** - five questions with answers

**Tools needed:** [Node.js](https://nodejs.org) installed, a terminal, and a text editor (such as [VS Code](https://code.visualstudio.com)). Examples use [Jest](https://jestjs.io) for unit and integration tests, and [Playwright](https://playwright.dev) for end-to-end tests, but the underlying ideas transfer to any testing tool.

---

## Module 0: Why Tests Exist

**Time: about 1 hour**

### Concept

A **test** is code that checks whether other code behaves the way it's supposed to, automatically, instead of a person manually clicking around to check by hand. Tests exist on a spectrum, usually described as a **testing pyramid**:
```
        /\
       /E2E\        few, slow, realistic (Module 3)
      /------\
     /Integr. \     some, medium speed, check pieces together (Module 2)
    /----------\
   /   Unit     \   many, fast, check one small piece at a time (Module 1)
  /--------------\
```
Lower layers are faster and cheaper to run, so most tests should live there. Higher layers are slower and more realistic, so fewer of them are needed, but the confidence they give is harder to fake.

### Where you'd actually use this

Any codebase more than a few days old. Without tests, every change carries a hidden question, "did this break something else?", answered only by manually checking, or by users finding out first. Tests turn that question into something you can answer in seconds, automatically, every time.

### Lab

Think of a small function or feature you've written before (or imagine one, like a function that calculates a shopping cart's total). Write down, in plain English, three things that should always be true about it, for example "the total should never be negative" or "an empty cart should total zero." Those three sentences are, in essence, your first three test cases, before any code is written.

### Checkpoint
You can explain the testing pyramid and why most tests should be unit tests rather than end-to-end tests.

### Quiz
1. What is a test, in plain terms?
2. What are the three layers of the testing pyramid, from bottom to top?
3. Why should most tests be unit tests rather than end-to-end tests?
4. What question do tests answer automatically that would otherwise require manual checking?
5. Does having tests mean a codebase can never break?

*Answers: 1) Code that automatically checks whether other code behaves as expected, replacing manual, by hand verification. 2) Unit tests, integration tests, then end-to-end tests. 3) Unit tests are fast and cheap to run, letting you check many small pieces frequently; end-to-end tests are slower and more expensive, so fewer of them cover the full system realistically. 4) "Did this change break something else?" 5) No, tests reduce the chance of undetected bugs and catch regressions, but they can't guarantee perfection, especially for cases no test was written for.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "test",
   "kicker": "Module 0 · Why tests exist",
   "title": "Prove it still works",
   "beats": [
    {
     "say": "Welcome to Testing for Builders."
    },
    {
     "say": "A test is code that checks your other code behaves the way it should, automatically, instead of someone clicking around by hand."
    }
   ]
  },
  {
   "kind": "list",
   "art": "pyramid",
   "kicker": "Concept",
   "title": "The testing pyramid",
   "items": [
    [
     "Unit",
     "Many · fast · one piece"
    ],
    [
     "Integration",
     "Some · pieces together"
    ],
    [
     "End-to-end",
     "Few · slow · whole system"
    ]
   ],
   "beats": [
    {
     "say": "Tests are usually described as a pyramid.",
     "show": 0
    },
    {
     "say": "At the bottom, unit tests. Many of them, fast, each checking one small piece.",
     "show": 1
    },
    {
     "say": "In the middle, integration tests. Some of them, checking pieces work together.",
     "show": 2
    },
    {
     "say": "At the top, end-to-end tests. A few of them, slow but realistic, driving the whole system.",
     "show": 3
    },
    {
     "say": "Lower layers are faster and cheaper, so most tests should live there.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quote",
   "art": "ask",
   "kicker": "Where you'd use this",
   "title": "The hidden question",
   "quote": "Did this change break something else?",
   "beats": [
    {
     "say": "Without tests, every change carries a hidden question.",
     "show": 0
    },
    {
     "say": "Did this break something else?",
     "show": 1
    },
    {
     "say": "Tests answer it in seconds, every time, instead of users finding out first.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "pencil",
   "kicker": "Lab",
   "title": "Your first test cases, in plain English",
   "items": [
    [
     "The total is never negative",
     ""
    ],
    [
     "An empty cart totals zero",
     ""
    ]
   ],
   "beats": [
    {
     "say": "Your lab has no code yet.",
     "show": 0
    },
    {
     "say": "Think of a function, like one that totals a shopping cart, and write three things that should always be true.",
     "show": 0
    },
    {
     "say": "For example: the total is never negative.",
     "show": 1
    },
    {
     "say": "An empty cart totals zero.",
     "show": 2
    },
    {
     "say": "Those sentences are your first test cases.",
     "show": 2
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why should most tests be unit tests, not end-to-end tests?",
   "options": [
    "Unit tests are more realistic",
    "Unit tests are fast and cheap, so you can run many often",
    "End-to-end tests can't fail"
   ],
   "answer": 1,
   "good": "That's right. Unit tests are fast and cheap, so you can check many small pieces often. End-to-end tests are slower and more expensive.",
   "bad": "Not quite. Unit tests are fast and cheap, so you can check many small pieces often. End-to-end tests are slower and more expensive.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why should most tests be unit tests, not end-to-end tests?",
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
     "You can explain the testing pyramid",
     ""
    ],
    [
     "And why most tests are unit tests",
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
     "say": "you can explain the testing pyramid,",
     "show": 1
    },
    {
     "say": "and why most tests should be unit tests.",
     "show": 2
    },
    {
     "say": "Next, in Module 1, unit tests with Jest.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 1: Unit Testing - Checking One Piece at a Time

**Time: about 2 hours**

### Concept

A **unit test** checks a single, small piece of code, typically one function, in isolation from everything else. A good unit test is fast, doesn't depend on a database, network, or file system, and clearly states what it expects. Unit tests usually follow an **Arrange, Act, Assert** pattern: set up the input, run the code, then check the result.

### Syntax at a Glance

```javascript
// cart.js
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

module.exports = { calculateTotal };
```
```javascript
// cart.test.js
const { calculateTotal } = require("./cart");

test("calculates the total for multiple items", () => {
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 1 }
  ];
  expect(calculateTotal(items)).toBe(25);
});

test("returns zero for an empty cart", () => {
  expect(calculateTotal([])).toBe(0);
});
```
- `test("description", callback)` (or `it(...)`, an alias) defines a single test, the description should read like a sentence explaining the expected behavior
- `expect(value)` wraps the actual result, followed by a **matcher** describing what it should be: `.toBe(x)` for exact equality, `.toEqual(x)` for deep object equality, `.toThrow()` for an expected error
- Arrange: build the `items` array. Act: call `calculateTotal(items)`. Assert: `expect(...).toBe(...)`

### Where you'd actually use this

Any function with real logic, calculating a price, validating an input, formatting a date. Unit tests catch a broken calculation the moment it's introduced, not weeks later when a user reports a wrong total.

### Lab

1. **Set up a project:**
```bash
mkdir testing-basics
cd testing-basics
npm init -y
npm install --save-dev jest
```
In `package.json`, set the test script:
```json
"scripts": {
  "test": "jest"
}
```

2. **Create `cart.js` and `cart.test.js`** using the code from **Syntax at a Glance**, then run:
```bash
npm test
```
Both tests should pass.

3. **Add a test that should fail, on purpose,** to see what a real failure looks like:
```javascript
test("this test is intentionally wrong", () => {
  expect(calculateTotal([{ price: 10, quantity: 2 }])).toBe(999);
});
```
Run `npm test` again. Jest reports exactly which test failed, what it expected, and what it actually got. Remove this test once you've seen the failure output.

4. **Add a function with an edge case, and test it.** In `cart.js`, add `applyDiscount` below `calculateTotal` and replace the `module.exports` line:
```javascript
// cart.js
function applyDiscount(total, percent) {
  if (percent < 0 || percent > 100) {
    throw new Error("Invalid discount percent");
  }
  return total - (total * percent) / 100;
}

module.exports = { calculateTotal, applyDiscount };
```
In `cart.test.js`, replace the `require` line at the top with this one, and add the two new tests below your existing ones:
```javascript
// cart.test.js
const { calculateTotal, applyDiscount } = require("./cart");

test("applies a discount correctly", () => {
  expect(applyDiscount(100, 10)).toBe(90);
});

test("throws for an invalid discount percent", () => {
  expect(() => applyDiscount(100, 150)).toThrow("Invalid discount percent");
});
```
Run `npm test` again, all tests, including the one checking that an error is thrown correctly, should pass.

### Checkpoint
You have a set of passing unit tests covering a normal case, an edge case (empty cart), and an error case (invalid discount), and you've seen what a failing test's output looks like.

### Quiz
1. What does "Arrange, Act, Assert" mean?
2. What does `expect(value).toBe(x)` check?
3. Why should a unit test avoid depending on a real database or network call?
4. What does `.toThrow()` check for?
5. Why is it useful to deliberately write a failing test at least once while learning?

*Answers: 1) A pattern for structuring a test, setting up the input, running the code being tested, then checking the result. 2) That the actual value produced exactly equals the expected value. 3) External dependencies make tests slower, less reliable (they can fail for unrelated reasons like a network issue), and harder to run in isolation. 4) That calling a given function throws an error, optionally checking the error's message. 5) It shows what a real failure looks like in the test output, so a genuine failure is recognized and understood immediately when it happens for real.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "test",
   "kicker": "Module 1 · Unit testing",
   "title": "Check one piece at a time",
   "beats": [
    {
     "say": "Welcome to Module 1."
    },
    {
     "say": "A unit test checks one small piece of code, usually one function, on its own. No database, no network, no files."
    }
   ]
  },
  {
   "kind": "flow",
   "art": "test",
   "kicker": "Concept",
   "title": "Arrange, Act, Assert",
   "steps": [
    "Arrange: set up input",
    "Act: run the code",
    "Assert: check the result"
   ],
   "beats": [
    {
     "say": "Unit tests follow a simple pattern.",
     "show": 0
    },
    {
     "say": "Arrange: set up the input.",
     "show": 1
    },
    {
     "say": "Act: run the code.",
     "show": 2
    },
    {
     "say": "Assert: check the result.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Syntax at a glance",
   "title": "Your first Jest test",
   "file": "cart.test.js",
   "code": "test(\"calculates the total for multiple items\", () => {\n  const items = [\n    { price: 10, quantity: 2 },\n    { price: 5, quantity: 1 }\n  ];\n  expect(calculateTotal(items)).toBe(25);\n});\n\ntest(\"returns zero for an empty cart\", () => {\n  expect(calculateTotal([])).toBe(0);\n});",
   "beats": [
    {
     "say": "Here's a test in Jest.",
     "show": 0
    },
    {
     "say": "The description reads like a sentence about the expected behaviour.",
     "show": 1
    },
    {
     "say": "Arrange the items, act by calling calculate total, and assert with expect, to be twenty five.",
     "show": 1
    },
    {
     "say": "A second test checks the edge case: an empty cart totals zero.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "test",
   "kicker": "Matchers",
   "title": "Ways to check a result",
   "items": [
    [
     ".toBe(x)",
     "Exact value"
    ],
    [
     ".toEqual(x)",
     "Same object contents"
    ],
    [
     ".toThrow()",
     "Expected error"
    ]
   ],
   "beats": [
    {
     "say": "Expect wraps the result, then a matcher says what it should be.",
     "show": 0
    },
    {
     "say": "To be, for an exact value.",
     "show": 1
    },
    {
     "say": "To equal, for objects with the same contents.",
     "show": 2
    },
    {
     "say": "And to throw, when an error is expected.",
     "show": 3
    }
   ]
  },
  {
   "kind": "flow",
   "art": "warning",
   "kicker": "Lab · Steps 1 to 3",
   "title": "Run it, then fail on purpose",
   "steps": [
    "npm test: 2 passed",
    "Add a wrong test",
    "Read the failure, then remove it"
   ],
   "beats": [
    {
     "say": "Set up a project, install Jest, and run npm test. Both tests pass.",
     "show": 1
    },
    {
     "say": "Then add a test that's wrong on purpose, expecting nine hundred and ninety nine.",
     "show": 2
    },
    {
     "say": "Jest shows exactly which test failed, what it expected, and what it got. Then remove it.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "shield",
   "kicker": "Lab · Step 4",
   "title": "Test the error case too",
   "file": "cart.test.js",
   "code": "test(\"applies a discount correctly\", () => {\n  expect(applyDiscount(100, 10)).toBe(90);\n});\n\ntest(\"throws for an invalid discount percent\", () => {\n  expect(() => applyDiscount(100, 150)).toThrow(\"Invalid discount percent\");\n});",
   "beats": [
    {
     "say": "Next, apply discount, which throws an error for a percent below zero or above a hundred.",
     "show": 0
    },
    {
     "say": "Test the normal case: ten percent off a hundred is ninety.",
     "show": 1
    },
    {
     "say": "And the error case: wrap the call in a function, and expect it to throw.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why should a unit test avoid a real database or network?",
   "options": [
    "They're too expensive",
    "They make tests slower and able to fail for unrelated reasons",
    "Jest can't connect to them"
   ],
   "answer": 1,
   "good": "That's right. External dependencies make tests slower and less reliable, failing for reasons unrelated to your code.",
   "bad": "Not quite. External dependencies make tests slower and less reliable, failing for reasons unrelated to your code.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why should a unit test avoid a real database or network?",
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
     "Normal, edge and error cases pass",
     ""
    ],
    [
     "You've read a real failure",
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
     "say": "you have passing tests for a normal case, an edge case and an error case,",
     "show": 1
    },
    {
     "say": "and you've seen what a failing test looks like.",
     "show": 2
    },
    {
     "say": "Next, in Module 2, integration tests.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 2: Integration Testing - Checking Pieces Together

**Time: about 2 hours**

### Concept

An **integration test** checks that multiple pieces work correctly together, an API route talking to real routing and middleware, a function talking to a real (often temporary or test) database. Where a unit test isolates one function, an integration test intentionally includes more of the real system, trading some speed for more realistic confidence.

### Syntax at a Glance

```javascript
// app.js
const express = require("express");
const app = express();
app.use(express.json());

let tasks = [{ id: 1, title: "Learn testing" }];

app.get("/tasks", (req, res) => res.json(tasks));

app.post("/tasks", (req, res) => {
  if (!req.body.title) return res.status(400).json({ error: "Title required" });
  const newTask = { id: tasks.length + 1, title: req.body.title };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

module.exports = app;
```
```javascript
// app.test.js
const request = require("supertest");
const app = require("./app");

test("GET /tasks returns the task list", async () => {
  const response = await request(app).get("/tasks");
  expect(response.status).toBe(200);
  expect(response.body.length).toBeGreaterThan(0);
});

test("POST /tasks creates a new task", async () => {
  const response = await request(app).post("/tasks").send({ title: "Write tests" });
  expect(response.status).toBe(201);
  expect(response.body.title).toBe("Write tests");
});
```
- `request(app)` (from the `supertest` library) sends a real HTTP request into the app, without needing an actual running server or port
- `.get(path)`, `.post(path)`, `.send(data)` build the request, mirroring how a real client would call the API
- The test is `async`, and uses `await`, since sending a request and getting a response takes time, even in a test
- `response.status` and `response.body` let you assert on exactly what a real client would receive

### Where you'd actually use this

Any API endpoint, confirming that routing, middleware (like JSON parsing or authentication), and your logic all work correctly as a chain, not just each piece separately.

### Lab

1. **Install Supertest** in the same project from Module 1:
```bash
npm install express
npm install --save-dev supertest
```
Express is a normal dependency (your app needs it to run); Supertest is a dev dependency (only your tests need it).

2. **Create `app.js` and `app.test.js`** using the code from **Syntax at a Glance**, then run:
```bash
npm test
```
Both tests should pass, hitting real Express routing and middleware, without a manually started server.

3. **Add a test for the validation logic,** confirming the pieces work together correctly for a bad request too:
```javascript
test("POST /tasks without a title returns 400", async () => {
  const response = await request(app).post("/tasks").send({});
  expect(response.status).toBe(400);
  expect(response.body.error).toBe("Title required");
});
```
Run `npm test` again, all three tests should pass.

4. **Break something on purpose, at the integration level.** Temporarily remove the `app.use(express.json())` line, then rerun the tests. The POST tests fail, `req.body` is `undefined` without that middleware, something a unit test of an isolated function would never have caught, since it only shows up when the pieces run together. Restore the line once you've seen the failure.

### Checkpoint
You have passing integration tests confirming your API's routing, middleware, and logic work correctly together, and you've seen a test fail specifically because of a missing piece of integration (the JSON middleware), not a logic bug.

### Quiz
1. What is the main difference between a unit test and an integration test?
2. What does `request(app)` let a test do, without a real server running on a port?
3. Why is the integration test function declared `async`?
4. In the lab, what kind of bug did removing the JSON middleware reveal, and why wouldn't a pure unit test of `applyDiscount`-style functions have caught it?
5. What's the tradeoff of writing more integration tests instead of unit tests?

*Answers: 1) A unit test isolates and checks one small piece of code alone; an integration test checks that multiple real pieces, like routing and middleware, work correctly together. 2) Send real, full HTTP requests directly into the app and inspect the actual response, simulating a real client. 3) Because sending a request and awaiting its response takes time, matching how real HTTP requests behave, even inside a test. 4) A missing piece of middleware, meaning the pieces weren't wired together correctly; a unit test of an isolated function never touches routing or middleware, so it couldn't have caught a wiring problem between them. 5) Integration tests are slower and slightly more complex to set up than unit tests, so relying on them exclusively would make the whole test suite slower to run.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "merge",
   "kicker": "Module 2 · Integration testing",
   "title": "Check pieces together",
   "beats": [
    {
     "say": "Welcome to Module 2."
    },
    {
     "say": "An integration test checks that several real pieces work together, like an API route with its routing and middleware."
    },
    {
     "say": "It trades a little speed for more realistic confidence."
    }
   ]
  },
  {
   "kind": "code",
   "art": "api",
   "kicker": "Syntax at a glance",
   "title": "Real HTTP requests, no server",
   "file": "app.test.js",
   "code": "test(\"POST /tasks creates a new task\", async () => {\n  const response = await request(app)\n    .post(\"/tasks\")\n    .send({ title: \"Write tests\" });\n  expect(response.status).toBe(201);\n  expect(response.body.title).toBe(\"Write tests\");\n});",
   "beats": [
    {
     "say": "Supertest sends real HTTP requests into your Express app, without starting a server.",
     "show": 0
    },
    {
     "say": "The test is async, because a request takes time.",
     "show": 1
    },
    {
     "say": "Then check the status and the body, exactly what a real client would get.",
     "show": 1
    }
   ]
  },
  {
   "kind": "big",
   "art": "test",
   "kicker": "Lab · Steps 1 to 3",
   "title": "Three passing tests",
   "big": "3 passed",
   "sub": "GET, POST, and POST without a title → 400",
   "beats": [
    {
     "say": "Install Express, and Supertest as a dev dependency.",
     "show": 0
    },
    {
     "say": "Test listing tasks, creating one, and a bad request with no title, which returns four hundred.",
     "show": 1
    },
    {
     "say": "All three pass, through real routing and middleware.",
     "show": 2
    }
   ]
  },
  {
   "kind": "quote",
   "art": "warning",
   "kicker": "Lab · Step 4",
   "title": "Break the wiring on purpose",
   "quote": "Remove express.json() → POST tests fail. A wiring bug, not a logic bug.",
   "beats": [
    {
     "say": "Now remove the line app dot use, express dot json, and rerun.",
     "show": 0
    },
    {
     "say": "The post tests fail. Without that middleware, the request body is undefined.",
     "show": 1
    },
    {
     "say": "A unit test of one function could never catch this. It only shows when the pieces run together. Put the line back.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What's the trade-off of writing more integration tests than unit tests?",
   "options": [
    "They catch fewer bugs",
    "They're slower and more complex, so the suite gets slower",
    "They can't test APIs"
   ],
   "answer": 1,
   "good": "That's right. Integration tests are slower and more complex to set up, so relying on them alone makes the suite slow.",
   "bad": "Not quite. Integration tests are slower and more complex to set up, so relying on them alone makes the suite slow.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What's the trade-off of writing more integration tests than unit tests?",
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
     "Integration tests pass",
     ""
    ],
    [
     "You've seen a wiring failure",
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
     "say": "you have passing integration tests for routing, middleware and logic together,",
     "show": 1
    },
    {
     "say": "and you've seen a test fail because of a missing piece of wiring.",
     "show": 2
    },
    {
     "say": "Next, in the last module, end-to-end tests in a real browser.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 3: End-to-End Testing - Checking the Whole System

**Time: about 3 hours**

### Concept

An **end-to-end (E2E) test** drives a real browser (or app) through an actual user flow, clicking buttons, filling forms, checking what appears on screen, exactly as a real person would. It's the slowest and most realistic layer of the pyramid, catching problems that only appear when frontend, backend, and everything in between are running together for real.

### Syntax at a Glance

```javascript
// example.spec.js
const { test, expect } = require("@playwright/test");

test("user can add a task and see it in the list", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.locator("#task-input").fill("Write end-to-end tests");
  await page.locator("#add-task-button").click();

  await expect(page.locator("li")).toContainText("Write end-to-end tests");
});
```
- `test("description", async ({ page }) => { ... })` defines a test with access to a real, automated browser `page`
- `page.goto(url)` navigates to a real running page, just like typing a URL into a browser
- `page.locator(selector)` finds an element using the same CSS selectors you'd use in CSS itself; `.fill(text)` and `.click()` simulate real typing and clicking, waiting automatically until the element is ready
- In larger projects, Playwright recommends finding elements the way a user would, for example `page.getByRole("button", { name: "Add" })`, so tests keep working when IDs or classes change
- `expect(page.locator(selector)).toContainText(text)` waits for and checks what's actually visible on the rendered page, not just a returned value

### Where you'd actually use this

Critical user flows that absolutely must work end to end, signing up, checking out, submitting a form, where confirming each piece separately isn't enough, only running the real thing, start to finish, gives full confidence.

### Lab

1. **Create a tiny real page to test against.** In a new folder, create `index.html`:
```html
<!DOCTYPE html>
<html>
<head><title>Task List</title></head>
<body>
  <input id="task-input" type="text" placeholder="New task">
  <button id="add-task-button">Add</button>
  <ul id="task-list"></ul>

  <script>
    document.querySelector("#add-task-button").addEventListener("click", () => {
      const input = document.querySelector("#task-input");
      if (!input.value) return;
      const li = document.createElement("li");
      li.textContent = input.value;
      document.querySelector("#task-list").appendChild(li);
      input.value = "";
    });
  </script>
</body>
</html>
```
Serve it locally:
```bash
npx serve . -l 3000
```
This command keeps running and keeps the terminal busy, because it is serving your page. Leave it running, and open a second terminal window for the next steps. (Stop the server later with Ctrl+C.)

2. **Install Playwright** in a separate test project, using the second terminal:
```bash
mkdir e2e-tests
cd e2e-tests
npm init -y
npm install --save-dev @playwright/test
npx playwright install chromium
```
The last command downloads the Chromium browser Playwright drives (`npx playwright install` with no name downloads every supported browser, which is much bigger).

3. **Create `example.spec.js`** using the code from **Syntax at a Glance**, then run:
```bash
npx playwright test
```
Playwright opens a real, automated browser, types into the input, clicks the button, and confirms the new task actually appears on the page, then reports pass or fail.

4. **Run it with the browser visible,** to watch it happen:
```bash
npx playwright test --headed
```
Watch the browser window open, type, and click entirely on its own.

5. **Add a second test for a case that shouldn't work:**
```javascript
test("clicking add with an empty input adds nothing", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator("#add-task-button").click();
  await expect(page.locator("li")).toHaveCount(0);
});
```
Run `npx playwright test` again, confirming both the success path and the empty input case behave correctly, in a real browser.

### Checkpoint
You have a passing Playwright test that opens a real browser, performs a real user flow, and confirms the correct result appeared on the actual rendered page, plus a second test confirming incorrect input is handled properly.

### Quiz
1. What makes an end-to-end test different from an integration test?
2. What does `page.goto(url)` do?
3. Why does an E2E test check what's visible on the page, rather than just a function's return value?
4. Why are there usually far fewer E2E tests than unit tests in a real project?
5. What kind of problem can an E2E test catch that unit and integration tests, run separately, might miss?

*Answers: 1) An E2E test drives a real browser through an actual user flow, involving the frontend, backend, and everything between them together; an integration test checks fewer pieces, typically without a real browser or full user interaction. 2) It navigates a real, automated browser to the given URL, exactly like a person typing it in and pressing enter. 3) Because the actual goal is confirming what a real user would see and experience, not just what a function internally returns. 4) E2E tests are slower to run and more expensive to maintain, since they depend on a real browser and a fully running system, so they're reserved for the most critical user flows. 5) A problem that only appears when the full system runs together, like a frontend and backend that each work fine alone but don't actually connect or communicate correctly in practice.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "browser",
   "kicker": "Module 3 · End-to-end testing",
   "title": "Test it like a real person",
   "beats": [
    {
     "say": "Welcome to the last module."
    },
    {
     "say": "An end-to-end test drives a real browser through a real user flow: clicking, typing, and checking what appears on screen."
    },
    {
     "say": "It's the slowest layer, and the most realistic."
    }
   ]
  },
  {
   "kind": "code",
   "art": "cursor",
   "kicker": "Syntax at a glance",
   "title": "A Playwright test",
   "file": "example.spec.js",
   "code": "test(\"user can add a task and see it in the list\", async ({ page }) => {\n  await page.goto(\"http://localhost:3000\");\n  await page.locator(\"#task-input\").fill(\"Write end-to-end tests\");\n  await page.locator(\"#add-task-button\").click();\n  await expect(page.locator(\"li\")).toContainText(\"Write end-to-end tests\");\n});",
   "beats": [
    {
     "say": "Here's a test in Playwright.",
     "show": 0
    },
    {
     "say": "Go to the page. Fill in the task box. Click add.",
     "show": 1
    },
    {
     "say": "Then check the list actually contains the new task, on the rendered page.",
     "show": 1
    },
    {
     "say": "Playwright waits for each element automatically. In bigger projects, find elements the way a user would, like by role and name.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "terminal",
   "kicker": "Lab · Steps 1 to 3",
   "title": "Set it up",
   "steps": [
    "npx serve . -l 3000",
    "Install @playwright/test + chromium",
    "npx playwright test"
   ],
   "beats": [
    {
     "say": "Create a tiny task list page, and serve it on port three thousand. Leave that running.",
     "show": 1
    },
    {
     "say": "In a second terminal, install Playwright and its Chromium browser.",
     "show": 2
    },
    {
     "say": "Run npx playwright test. It opens a browser, types, clicks, and checks the result.",
     "show": 3
    }
   ]
  },
  {
   "kind": "big",
   "art": "browser",
   "kicker": "Lab · Step 4",
   "title": "Watch it happen",
   "big": "--headed",
   "sub": "see the browser drive itself",
   "beats": [
    {
     "say": "Add dash dash headed to watch.",
     "show": 0
    },
    {
     "say": "A browser window opens, types and clicks entirely on its own.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "shield",
   "kicker": "Lab · Step 5",
   "title": "Test what shouldn't work",
   "file": "example.spec.js",
   "code": "test(\"clicking add with an empty input adds nothing\", async ({ page }) => {\n  await page.goto(\"http://localhost:3000\");\n  await page.locator(\"#add-task-button\").click();\n  await expect(page.locator(\"li\")).toHaveCount(0);\n});",
   "beats": [
    {
     "say": "Finally, test a case that shouldn't work.",
     "show": 0
    },
    {
     "say": "Click add with an empty box, and expect the list to have zero items.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why are there usually far fewer end-to-end tests than unit tests?",
   "options": [
    "They're less useful",
    "They're slower and costlier to maintain, so they're kept for critical flows",
    "Browsers limit how many you can run"
   ],
   "answer": 1,
   "good": "That's right. End-to-end tests are slower and costlier to maintain, so they're kept for the most critical user flows.",
   "bad": "Not quite. End-to-end tests are slower and costlier to maintain, so they're kept for the most critical user flows.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why are there usually far fewer end-to-end tests than unit tests?",
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
     "A real browser test of a user flow passes",
     ""
    ],
    [
     "Empty input is tested too",
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
     "say": "you have a passing Playwright test of a real user flow in a real browser,",
     "show": 1
    },
    {
     "say": "and a second test proving empty input is handled.",
     "show": 2
    },
    {
     "say": "You've finished Testing for Builders. Well done.",
     "show": 2
    }
   ]
  }
 ]
}
```
