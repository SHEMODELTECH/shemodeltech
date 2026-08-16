# Testing for Builders: A Practical Beginner's Course

## Course Overview

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

---

## Module 1: Unit Testing - Checking One Piece at a Time

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

4. **Add a function with an edge case, and test it:**
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

---

## Module 2: Integration Testing - Checking Pieces Together

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
npm install --save-dev supertest express
```

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

---

## Module 3: End-to-End Testing - Checking the Whole System

### Concept

An **end-to-end (E2E) test** drives a real browser (or app) through an actual user flow, clicking buttons, filling forms, checking what appears on screen, exactly as a real person would. It's the slowest and most realistic layer of the pyramid, catching problems that only appear when frontend, backend, and everything in between are running together for real.

### Syntax at a Glance

```javascript
// example.spec.js
const { test, expect } = require("@playwright/test");

test("user can add a task and see it in the list", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.fill("#task-input", "Write end-to-end tests");
  await page.click("#add-task-button");

  await expect(page.locator("li")).toContainText("Write end-to-end tests");
});
```
- `test("description", async ({ page }) => { ... })` defines a test with access to a real, automated browser `page`
- `page.goto(url)` navigates to a real running page, just like typing a URL into a browser
- `page.fill(selector, text)` and `page.click(selector)` simulate real typing and clicking, using the same CSS selectors you'd use in CSS itself
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
npx serve . -p 3000
```

2. **Install Playwright** in a separate test project:
```bash
mkdir e2e-tests
cd e2e-tests
npm init -y
npm install --save-dev @playwright/test
npx playwright install
```

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
  await page.click("#add-task-button");
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

---

## Capstone: Testing at Every Layer

Take one small feature, adding a task to a list, and test it at all three layers covered in this course:

1. **Unit test** the core logic in isolation (Module 1), a function that validates or transforms a task before it's saved
2. **Integration test** the API route that uses that logic (Module 2), confirming routing, middleware, and the function all work correctly together
3. **End-to-end test** the real user flow (Module 3), typing into an actual page and confirming the task appears on screen
4. Deliberately break something at each layer, one at a time, a wrong calculation, a missing middleware, a broken button, and confirm the correct layer of test catches it.

### Course completion checklist
- [ ] Explained the testing pyramid and why most tests should be unit tests
- [ ] Wrote unit tests covering a normal case, an edge case, and an error case
- [ ] Wrote integration tests confirming an API's routing and middleware work correctly together
- [ ] Wrote an end-to-end test that drives a real browser through an actual user flow
- [ ] Watched a test fail for the right reason, at each of the three layers
- [ ] Tested the same small feature at all three layers, unit, integration, and end-to-end

Every piece of this course exists to answer one question, repeatedly and reliably: **when I change this code, will I find out immediately if something broke, or will a user find out first?**
