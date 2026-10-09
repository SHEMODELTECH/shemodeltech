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
   "kind": "table",
   "kicker": "Concept",
   "title": "The testing pyramid, layer by layer",
   "columns": [
    "Layer",
    "How many",
    "Speed",
    "Checks",
    "Module"
   ],
   "rows": [
    [
     "End-to-end",
     "Few",
     "Slow",
     "The whole system, in a browser",
     "3"
    ],
    [
     "Integration",
     "Some",
     "Medium",
     "Pieces working together",
     "2"
    ],
    [
     "Unit",
     "Many",
     "Fast",
     "One small piece at a time",
     "1"
    ]
   ],
   "beats": [
    {
     "say": "Tests are usually described as a pyramid with three layers. Read it from the bottom up.",
     "col": 0
    },
    {
     "say": "At the bottom, unit tests. Many of them, fast, each checking one small piece.",
     "hl": 2
    },
    {
     "say": "In the middle, integration tests. Some of them, checking that pieces work together.",
     "hl": 1
    },
    {
     "say": "At the top, end-to-end tests. Just a few, slow, but they drive the whole system like a real person.",
     "hl": 0
    },
    {
     "say": "Each layer gets its own module in this course: one, two, and three.",
     "col": 4
    }
   ]
  },
  {
   "kind": "chart",
   "kicker": "Concept",
   "title": "Why most tests live at the bottom",
   "points": [
    [
     8,
     92
    ],
    [
     12,
     86
    ],
    [
     15,
     94
    ],
    [
     18,
     88
    ],
    [
     22,
     90
    ],
    [
     10,
     82
    ],
    [
     25,
     84
    ],
    [
     20,
     80
    ],
    [
     45,
     60
    ],
    [
     52,
     54
    ],
    [
     48,
     50
    ],
    [
     56,
     58
    ],
    [
     84,
     18
    ],
    [
     90,
     12
    ]
   ],
   "xlabel": "how realistic",
   "ylabel": "how fast",
   "beats": [
    {
     "say": "Here, each dot is one test in a healthy project, placed by how realistic it is and how fast it runs."
    },
    {
     "say": "This big cluster in the top left is the unit tests. Very fast, but each one sees only a small piece.",
     "groups": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      3,
      3,
      3,
      3,
      3
     ]
    },
    {
     "say": "In the middle sit a few integration tests. Slower, but more realistic.",
     "groups": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      3,
      3
     ]
    },
    {
     "say": "And bottom right, just two end-to-end tests. The slowest, and the most realistic.",
     "groups": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      2,
      2
     ]
    },
    {
     "say": "The trend is clear: the more realistic a test, the slower and costlier it is.",
     "line": [
      -0.95,
      100
     ]
    },
    {
     "say": "So you write many cheap tests at the bottom, and save the slow ones for what matters most."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Where you'd use this",
   "title": "The hidden question: did this break something?",
   "nodes": [
    {
     "id": "chg",
     "label": "You change code",
     "x": 12,
     "y": 40,
     "sub": "a small edit",
     "art": "pencil"
    },
    {
     "id": "tests",
     "label": "Test suite",
     "x": 50,
     "y": 40,
     "sub": "runs in seconds",
     "art": "test"
    },
    {
     "id": "pass",
     "label": "All pass",
     "x": 88,
     "y": 18,
     "sub": "ship it",
     "art": "proof"
    },
    {
     "id": "fail",
     "label": "One fails",
     "x": 88,
     "y": 62,
     "sub": "fix it first",
     "art": "bug"
    },
    {
     "id": "users",
     "label": "Your users",
     "x": 50,
     "y": 85,
     "sub": "find it the hard way",
     "art": "people"
    }
   ],
   "edges": [
    {
     "from": "chg",
     "to": "users"
    },
    {
     "from": "chg",
     "to": "tests"
    },
    {
     "from": "tests",
     "to": "pass"
    },
    {
     "from": "tests",
     "to": "fail"
    }
   ],
   "beats": [
    {
     "say": "Every change to a codebase carries a hidden question: did this break something else?",
     "show": 1,
     "on": "chg"
    },
    {
     "say": "Without tests, the change goes straight out, and your users are the ones who find the bug.",
     "show": 5,
     "on": "users",
     "send": {
      "from": "chg",
      "to": "users",
      "label": "cart total is wrong!"
     }
    },
    {
     "say": "With tests, every change first runs through the test suite, automatically.",
     "on": "tests",
     "send": {
      "from": "chg",
      "to": "tests",
      "label": "npm test"
     }
    },
    {
     "say": "If everything passes, you ship with confidence.",
     "on": "pass",
     "send": {
      "from": "tests",
      "to": "pass",
      "label": "all passed"
     }
    },
    {
     "say": "If one fails, you know in seconds, and you fix it before anyone else sees it.",
     "on": "fail",
     "send": {
      "from": "tests",
      "to": "fail",
      "label": "1 failed"
     }
    },
    {
     "say": "Tests can't promise nothing will ever break. But they catch what they check, every single time.",
     "on": [
      "pass",
      "fail"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab",
   "title": "Plain-English rules become test cases",
   "columns": [
    "Rule that should always be true",
    "Input",
    "Expected"
   ],
   "rows": [
    [
     "An empty cart totals zero",
     "[]",
     "0"
    ],
    [
     "The total is never negative",
     "any cart",
     "0 or more"
    ],
    [
     "2 × $10 plus 1 × $5 totals $25",
     "two items",
     "25"
    ]
   ],
   "beats": [
    {
     "say": "Your lab has no code yet. Picture a function that totals a shopping cart."
    },
    {
     "say": "Write down three things that should always be true about it. First: an empty cart totals zero.",
     "hl": 0
    },
    {
     "say": "Second: the total is never negative, whatever is in the cart.",
     "hl": 1
    },
    {
     "say": "Third, a normal case: two items at ten dollars plus one at five should total twenty five.",
     "hl": 2
    },
    {
     "say": "Each rule names an input and the result you expect.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 2
    },
    {
     "say": "That's a test case. In Module 1, the first one becomes real code.",
     "hl": 0,
     "dim": true,
     "sql": "test(\"returns zero for an empty cart\", () => {\n  expect(calculateTotal([])).toBe(0);\n});"
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
   "kind": "walk",
   "kicker": "Syntax at a glance",
   "title": "Arrange, Act, Assert",
   "file": "cart.js + cart.test.js",
   "code": "// cart.js\nfunction calculateTotal(items) {\n  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);\n}\n\n// cart.test.js\ntest(\"calculates the total for multiple items\", () => {\n  const items = [\n    { price: 10, quantity: 2 },\n    { price: 5, quantity: 1 }\n  ];\n  expect(calculateTotal(items)).toBe(25);\n});",
   "beats": [
    {
     "say": "Here's the function we want to check, and a Jest test for it.",
     "line": [
      2,
      4
     ]
    },
    {
     "say": "The test's description reads like a sentence about the expected behaviour.",
     "line": 7
    },
    {
     "say": "Arrange: set up the input. Two items: ten dollars times two, and five dollars times one.",
     "line": [
      8,
      11
     ],
     "vars": {
      "items": "2 items"
     }
    },
    {
     "say": "Act: call calculate total with those items.",
     "line": [
      12,
      3
     ],
     "vars": {
      "sum": 0
     }
    },
    {
     "say": "Reduce starts the sum at zero. The first item adds ten times two. Twenty.",
     "line": 3,
     "vars": {
      "item": "{ price: 10, quantity: 2 }",
      "sum": 20
     }
    },
    {
     "say": "The second item adds five times one. Twenty five.",
     "line": 3,
     "vars": {
      "item": "{ price: 5, quantity: 1 }",
      "sum": 25
     }
    },
    {
     "say": "Assert: expect the result to be twenty five. It is, so the test passes.",
     "line": 12,
     "out": "✓ calculates the total for multiple items"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Matchers",
   "title": "expect wraps the result, the matcher judges it",
   "columns": [
    "Assertion",
    "Result",
    "Why"
   ],
   "rows": [
    [
     "expect(25).toBe(25)",
     "pass",
     "Exactly equal"
    ],
    [
     "expect(20).toBe(999)",
     "fail",
     "20 is not 999"
    ],
    [
     "expect({ id: 1 }).toBe({ id: 1 })",
     "fail",
     "Two different objects"
    ],
    [
     "expect({ id: 1 }).toEqual({ id: 1 })",
     "pass",
     "Same contents"
    ],
    [
     "expect(() => applyDiscount(100, 150)).toThrow()",
     "pass",
     "The call throws an error"
    ]
   ],
   "beats": [
    {
     "say": "Expect wraps the actual result. The matcher after it says what the result should be.",
     "col": 0
    },
    {
     "say": "To be checks for an exact value. Twenty five is twenty five, so it passes.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "Twenty is not nine hundred ninety nine, so this one fails.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "Careful with objects. To be fails here, because these are two separate objects.",
     "hl": 2,
     "col": 2
    },
    {
     "say": "To equal compares what's inside instead, so the same contents pass.",
     "hl": 3,
     "col": 2
    },
    {
     "say": "And to throw passes when the call throws an error. You'll use that in a moment.",
     "hl": 4,
     "dim": true
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 1 to 3",
   "title": "Fail on purpose, and read the output",
   "file": "cart.test.js",
   "code": "test(\"this test is intentionally wrong\", () => {\n  expect(calculateTotal([{ price: 10, quantity: 2 }])).toBe(999);\n});",
   "beats": [
    {
     "say": "Set up the project, install Jest, and run N P M test. Your first two tests pass.",
     "out": [
      "✓ calculates the total for multiple items",
      "✓ returns zero for an empty cart"
     ]
    },
    {
     "say": "Now add a test that's wrong on purpose.",
     "line": 1
    },
    {
     "say": "One item, ten dollars times two, is twenty. But the test expects nine hundred ninety nine.",
     "line": 2,
     "vars": {
      "received": 20,
      "expected": 999
     }
    },
    {
     "say": "Jest marks exactly which test failed.",
     "line": 2,
     "out": "✕ this test is intentionally wrong"
    },
    {
     "say": "It shows what it expected, and what it actually got.",
     "line": 2,
     "out": [
      "Expected: 999",
      "Received: 20"
     ]
    },
    {
     "say": "And a summary: one failed, two passed. Now you'll recognise a real failure. Remove this test.",
     "out": "Tests: 1 failed, 2 passed, 3 total"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 4",
   "title": "Test the error case too",
   "file": "cart.js + cart.test.js",
   "code": "function applyDiscount(total, percent) {\n  if (percent < 0 || percent > 100) {\n    throw new Error(\"Invalid discount percent\");\n  }\n  return total - (total * percent) / 100;\n}\n\ntest(\"applies a discount correctly\", () => {\n  expect(applyDiscount(100, 10)).toBe(90);\n});\n\ntest(\"throws for an invalid discount percent\", () => {\n  expect(() => applyDiscount(100, 150)).toThrow(\"Invalid discount percent\");\n});",
   "beats": [
    {
     "say": "Apply discount takes off a percentage, but refuses a percent below zero or above a hundred.",
     "line": [
      1,
      6
     ]
    },
    {
     "say": "The normal case: ten percent off one hundred.",
     "line": [
      9,
      1
     ],
     "vars": {
      "total": 100,
      "percent": 10
     }
    },
    {
     "say": "Is ten below zero, or above a hundred? No, so no error.",
     "line": 2
    },
    {
     "say": "One hundred, minus one hundred times ten over a hundred. Ninety.",
     "line": 5,
     "out": "✓ applies a discount correctly"
    },
    {
     "say": "The error case: one hundred and fifty percent.",
     "line": 13,
     "vars": {
      "total": 100,
      "percent": 150
     }
    },
    {
     "say": "A hundred and fifty is above a hundred, so the function throws.",
     "line": [
      2,
      3
     ]
    },
    {
     "say": "Because the call is wrapped in an arrow function, expect runs it and catches the error.",
     "line": 13
    },
    {
     "say": "The message matches, so this test passes too. Without the wrapper, the error would escape and fail the test.",
     "line": 13,
     "out": "✓ throws for an invalid discount percent"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Checkpoint",
   "title": "Your suite covers three kinds of case",
   "columns": [
    "Test",
    "Kind of case",
    "Result"
   ],
   "rows": [
    [
     "calculates the total for multiple items",
     "Normal",
     "✓"
    ],
    [
     "returns zero for an empty cart",
     "Edge",
     "✓"
    ],
    [
     "applies a discount correctly",
     "Normal",
     "✓"
    ],
    [
     "throws for an invalid discount percent",
     "Error",
     "✓"
    ]
   ],
   "beats": [
    {
     "say": "Here's your whole unit test suite.",
     "col": 0
    },
    {
     "say": "Two normal cases: the everyday inputs.",
     "hl": [
      0,
      2
     ],
     "col": 1
    },
    {
     "say": "One edge case: an empty cart, right at the boundary.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "And one error case: a bad input that must be refused.",
     "hl": 3,
     "col": 1
    },
    {
     "say": "Run N P M test, and all four pass, in well under a second.",
     "hl": [
      0,
      1,
      2,
      3
     ],
     "col": 2,
     "sql": "Tests: 4 passed, 4 total"
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

4. **Break something on purpose, at the integration level.** Temporarily remove the `app.use(express.json())` line, then rerun the tests. The GET test still passes, but both POST tests fail: without that middleware `req.body` is `undefined`, so reading `req.body.title` throws a `TypeError` and Express answers with a 500 server error. Jest reports `Expected: 201, Received: 500` (and `Expected: 400, Received: 500` for the validation test). That's something a unit test of an isolated function would never have caught, since it only shows up when the pieces run together. Restore the line once you've seen the failure.

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
     "say": "An integration test checks that several real pieces work together, like an A P I route with its routing and middleware."
    },
    {
     "say": "It trades a little speed for more realistic confidence."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "One request, through every real piece",
   "nodes": [
    {
     "id": "test",
     "label": "app.test.js",
     "x": 12,
     "y": 30,
     "sub": "Supertest",
     "art": "test"
    },
    {
     "id": "mw",
     "label": "express.json()",
     "x": 38,
     "y": 70,
     "sub": "middleware",
     "art": "gear"
    },
    {
     "id": "route",
     "label": "POST /tasks",
     "x": 64,
     "y": 30,
     "sub": "route handler",
     "art": "router"
    },
    {
     "id": "data",
     "label": "tasks",
     "x": 88,
     "y": 70,
     "sub": "in-memory list",
     "art": "array"
    }
   ],
   "edges": [
    {
     "from": "test",
     "to": "mw"
    },
    {
     "from": "mw",
     "to": "route"
    },
    {
     "from": "route",
     "to": "data"
    }
   ],
   "beats": [
    {
     "say": "Four real pieces: the test, the J S O N middleware, the route, and the tasks list.",
     "show": 4
    },
    {
     "say": "Supertest sends a real H T T P request straight into the app. No server, no port.",
     "on": "test",
     "send": {
      "from": "test",
      "to": "mw",
      "label": "POST /tasks {\"title\":\"Write tests\"}"
     }
    },
    {
     "say": "The middleware reads the J S O N body, and hands the route a ready-made request body.",
     "on": "mw",
     "send": {
      "from": "mw",
      "to": "route",
      "label": "req.body = { title: \"Write tests\" }"
     }
    },
    {
     "say": "The route checks there's a title, and saves a new task as number two.",
     "on": "route",
     "send": {
      "from": "route",
      "to": "data",
      "label": "push { id: 2, … }"
     }
    },
    {
     "say": "The answer travels back: status two oh one, created, with the new task.",
     "on": "mw",
     "send": {
      "from": "route",
      "to": "mw",
      "label": "201 · { id: 2, title: … }"
     }
    },
    {
     "say": "And the test receives exactly what a real client would get.",
     "on": "test",
     "send": {
      "from": "mw",
      "to": "test",
      "label": "201"
     }
    },
    {
     "say": "A unit test would check one piece alone. This test checks the whole chain.",
     "on": [
      "test",
      "mw",
      "route",
      "data"
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 1 to 3",
   "title": "Trace all three requests",
   "file": "app.js",
   "code": "app.use(express.json());\n\nlet tasks = [{ id: 1, title: \"Learn testing\" }];\n\napp.get(\"/tasks\", (req, res) => res.json(tasks));\n\napp.post(\"/tasks\", (req, res) => {\n  if (!req.body.title) return res.status(400).json({ error: \"Title required\" });\n  const newTask = { id: tasks.length + 1, title: req.body.title };\n  tasks.push(newTask);\n  res.status(201).json(newTask);\n});",
   "beats": [
    {
     "say": "The app starts with one task in its list.",
     "line": 3,
     "vars": {
      "tasks.length": 1
     }
    },
    {
     "say": "Test one sends a get request to slash tasks. The route replies with the whole list, and status two hundred.",
     "line": 5,
     "out": "GET /tasks → 200 · 1 task"
    },
    {
     "say": "The test expects two hundred, and more than zero tasks. Both true. Pass.",
     "line": 5
    },
    {
     "say": "Test two posts a task with the title write tests.",
     "line": 7,
     "vars": {
      "req.body": "{ title: \"Write tests\" }"
     }
    },
    {
     "say": "There is a title, so it carries on, and builds task number two.",
     "line": [
      8,
      9
     ],
     "vars": {
      "newTask.id": 2
     }
    },
    {
     "say": "It's pushed onto the list, and sent back with status two oh one.",
     "line": [
      10,
      11
     ],
     "vars": {
      "tasks.length": 2
     },
     "out": "POST /tasks → 201 · { id: 2, title: \"Write tests\" }"
    },
    {
     "say": "Test three posts an empty body. No title.",
     "line": 7,
     "vars": {
      "req.body": "{}",
      "newTask.id": "—"
     }
    },
    {
     "say": "So the route stops early with four hundred, and the error title required.",
     "line": 8,
     "out": "POST /tasks → 400 · { error: \"Title required\" }"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 4",
   "title": "Remove one line, and watch what breaks",
   "columns": [
    "Test",
    "With express.json()",
    "Without it"
   ],
   "rows": [
    [
     "GET /tasks returns the task list",
     "200 ✓",
     "200 ✓"
    ],
    [
     "POST /tasks creates a new task",
     "201 ✓",
     "500 ✕"
    ],
    [
     "POST /tasks without a title returns 400",
     "400 ✓",
     "500 ✕"
    ]
   ],
   "beats": [
    {
     "say": "With the middleware in place, all three tests pass.",
     "col": 1
    },
    {
     "say": "Now delete the line app dot use, express dot json, and rerun.",
     "col": 2
    },
    {
     "say": "The get test still passes. It never reads a request body.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "But both post tests fail. Without the middleware, the request body is undefined.",
     "hl": [
      1,
      2
     ],
     "col": 2,
     "sql": "TypeError: Cannot read properties of undefined (reading 'title')"
    },
    {
     "say": "Reading title from undefined crashes the route, so Express answers five hundred, a server error.",
     "hl": [
      1,
      2
     ],
     "dim": true,
     "col": 2,
     "sql": "Expected: 201\nReceived: 500"
    },
    {
     "say": "Every function is fine on its own. The bug is in the wiring, which only shows when the pieces run together. Put the line back.",
     "hl": [
      1,
      2
     ],
     "dim": true
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Read the failure",
   "title": "Logic bug or wiring bug?",
   "columns": [
    "Failing test says",
    "Points to",
    "Caught by"
   ],
   "rows": [
    [
     "Expected: 90, Received: 99",
     "Logic: wrong calculation",
     "Unit test"
    ],
    [
     "Expected: 201, Received: 500",
     "Wiring: missing middleware",
     "Integration test"
    ]
   ],
   "beats": [
    {
     "say": "When a test fails, its output tells you where to look."
    },
    {
     "say": "Say apply discount returned ninety nine instead of ninety. The maths inside one function is wrong. That's a logic bug.",
     "hl": 0
    },
    {
     "say": "A unit test catches that, quickly and on its own.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "But a server error from a route whose logic is fine means a piece is missing between them. That's a wiring bug.",
     "hl": 1
    },
    {
     "say": "Only an integration test, running the pieces together, can catch that one.",
     "hl": 1,
     "col": 2
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
   "kind": "diagram",
   "kicker": "Lab · Steps 1 to 3",
   "title": "Two terminals, one real browser",
   "nodes": [
    {
     "id": "srv",
     "label": "npx serve . -l 3000",
     "x": 86,
     "y": 30,
     "sub": "terminal 1 · serves index.html",
     "art": "server"
    },
    {
     "id": "spec",
     "label": "example.spec.js",
     "x": 14,
     "y": 30,
     "sub": "terminal 2 · npx playwright test",
     "art": "test"
    },
    {
     "id": "browser",
     "label": "Chromium",
     "x": 50,
     "y": 72,
     "sub": "driven by Playwright",
     "art": "browser"
    }
   ],
   "edges": [
    {
     "from": "spec",
     "to": "browser"
    },
    {
     "from": "browser",
     "to": "srv"
    }
   ],
   "beats": [
    {
     "say": "In the first terminal, serve the tiny task list page on port three thousand. Leave it running.",
     "show": 1,
     "on": "srv"
    },
    {
     "say": "In a second terminal, install Playwright and its Chromium browser, then run N P X playwright test.",
     "show": 3,
     "on": "spec"
    },
    {
     "say": "Playwright opens a real, automated browser, and tells it to go to the page.",
     "on": "browser",
     "send": {
      "from": "spec",
      "to": "browser",
      "label": "page.goto(\"http://localhost:3000\")"
     }
    },
    {
     "say": "The browser asks the server for the page, just as if you'd typed the address.",
     "on": "srv",
     "send": {
      "from": "browser",
      "to": "srv",
      "label": "GET /"
     }
    },
    {
     "say": "The server sends back index dot H T M L, and the browser renders it.",
     "on": "browser",
     "send": {
      "from": "srv",
      "to": "browser",
      "label": "index.html"
     }
    },
    {
     "say": "Normally you won't see any of this. Add dash dash headed to watch the window type and click on its own.",
     "on": "browser"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Syntax at a glance",
   "title": "The test, one action at a time",
   "values": [
    "goto",
    "fill",
    "click",
    "expect"
   ],
   "beats": [
    {
     "say": "The Playwright test is four actions, each one awaited, in order."
    },
    {
     "say": "Go to the page. The task list starts empty.",
     "hl": 0,
     "ptr": {
      "step": 0
     },
     "note": "page.goto(\"http://localhost:3000\") · 0 tasks"
    },
    {
     "say": "Find the input by its I D, and type the new task into it, like a person would.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "step": 1
     },
     "note": "#task-input ← \"Write end-to-end tests\""
    },
    {
     "say": "Click the add button. Playwright waits until the button is ready before clicking.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "step": 2
     },
     "note": "#add-task-button clicked"
    },
    {
     "say": "Then check the rendered page: a list item must contain the new task's text.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3,
     "ptr": {
      "step": 3
     },
     "note": "li contains \"Write end-to-end tests\""
    },
    {
     "say": "It does, so the test passes. In bigger projects, find elements by role and name instead of I D.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "note": "page.getByRole(\"button\", { name: \"Add\" })"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 5",
   "title": "What the click actually runs",
   "file": "index.html",
   "code": "document.querySelector(\"#add-task-button\").addEventListener(\"click\", () => {\n  const input = document.querySelector(\"#task-input\");\n  if (!input.value) return;\n  const li = document.createElement(\"li\");\n  li.textContent = input.value;\n  document.querySelector(\"#task-list\").appendChild(li);\n  input.value = \"\";\n});",
   "beats": [
    {
     "say": "This is the page's own script. Playwright's click sets it running, just like a real click.",
     "line": 1,
     "vars": {
      "list items": 0
     }
    },
    {
     "say": "In the first test, the input holds write end-to-end tests.",
     "line": 2,
     "vars": {
      "input.value": "\"Write end-to-end tests\""
     }
    },
    {
     "say": "It isn't empty, so the script carries on.",
     "line": 3
    },
    {
     "say": "It makes a new list item, and puts the text inside it.",
     "line": [
      4,
      5
     ],
     "vars": {
      "li.textContent": "\"Write end-to-end tests\""
     }
    },
    {
     "say": "The item joins the list on screen, and the input is cleared.",
     "line": [
      6,
      7
     ],
     "vars": {
      "list items": 1,
      "input.value": "\"\""
     },
     "out": "✓ user can add a task and see it in the list"
    },
    {
     "say": "The second test gets a fresh page, so the list starts empty again. This time it clicks add with nothing typed.",
     "line": 1,
     "vars": {
      "list items": 0,
      "input.value": "\"\"",
      "li.textContent": "—"
     }
    },
    {
     "say": "The input is empty, so the script returns straight away. Nothing is added.",
     "line": 3
    },
    {
     "say": "The test expects the list to have zero items. It does, so it passes.",
     "line": 3,
     "out": "✓ clicking add with an empty input adds nothing"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Big picture",
   "title": "Which layer catches which problem?",
   "columns": [
    "Problem",
    "Cheapest test that catches it"
   ],
   "rows": [
    [
     "A cart total is calculated wrongly",
     "Unit (Module 1)"
    ],
    [
     "The JSON middleware is missing",
     "Integration (Module 2)"
    ],
    [
     "Clicking Add doesn't show the new task",
     "End-to-end (Module 3)"
    ],
    [
     "Frontend and backend don't actually connect",
     "End-to-end (Module 3)"
    ]
   ],
   "beats": [
    {
     "say": "Let's put the whole pyramid to work. For each problem, pick the cheapest test that catches it."
    },
    {
     "say": "A wrong calculation lives inside one function. A fast unit test is enough.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "A missing middleware only shows when pieces run together. That's an integration test.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "Whether the new task actually appears on screen can only be checked in a real browser.",
     "hl": 2,
     "col": 1
    },
    {
     "say": "And a frontend and backend that each work alone, but never connect, only shows up end to end.",
     "hl": 3,
     "col": 1
    },
    {
     "say": "That's why end-to-end tests are few, and saved for the flows that must never break.",
     "hl": [
      2,
      3
     ],
     "dim": true
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
