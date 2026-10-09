<!-- order: 2 -->
<!-- runnable: python -->
# Python Programming Fundamentals: A Practical Beginner's Course

## Course Overview

**By the end of this course, you'll be able to:**
- Store data in variables of the right type and convert between types (such as text to number)
- Write programs that make decisions with `if`/`elif`/`else` and repeat work with `for` and `while` loops
- Write reusable functions with parameters, default values, and return values
- Handle errors with `try`/`except`/`finally` so bad input doesn't crash your program
- Split code into your own modules, install packages with pip, and model real things with classes
- Save data to text and JSON files and read it back

**Who this is for:** Complete beginners to programming, or anyone who has copied code before but wants to actually understand what it's doing.

**How the course works:** Nine modules. Every topic follows the same pattern:
- **Concept** - what it is, in plain language
- **Where you'd actually use this** - a real product scenario
- **Lab** - hands-on, runnable code, ending with a short "Your turn" exercise you write yourself
- **Checkpoint**
- **Quiz** - five questions with answers

**Tools needed:** Python 3.12+ installed, and a code editor (VS Code or similar).

---

## Module 0: Variables & Data Types

**Time: about 1 hour**

### Concept

A **variable** is a name that points to a value stored in memory. Python figures out the **data type** automatically based on what you assign:

| Type | Example | Meaning |
|---|---|---|
| `int` | `age = 25` | Whole numbers |
| `float` | `price = 19.99` | Decimal numbers |
| `str` | `name = "Alice"` | Text |
| `bool` | `is_active = True` | True or False |
| `list` | `tasks = ["a", "b"]` | An ordered, changeable collection |
| `dict` | `user = {"name": "Alice"}` | Key-value pairs |
| `None` | `result = None` | Explicitly "no value" |

### Where you'd actually use this

Every single program uses variables, storing a user's name after login, a product's price, whether a checkbox is checked. Getting the right data type matters: treating a price as text instead of a number means you can't do math with it correctly.

### Lab

```python
# Variables and their types
username = "opeyemi"
login_count = 12
account_balance = 245.50
is_premium_member = True
recent_searches = ["python", "docker", "databases"]

print(type(username))          # <class 'str'>
print(type(login_count))       # <class 'int'>
print(type(account_balance))   # <class 'float'>
print(type(is_premium_member)) # <class 'bool'>
print(type(recent_searches))   # <class 'list'>

# A common bug: treating numbers as text
price_as_text = "19.99"
# print(price_as_text + 5)     # this would crash - can't add a string and a number
price_as_number = float(price_as_text)
print(price_as_number + 5)     # 24.99 - works, because it's now a float
```

```lab
{
 "type": "sort",
 "title": "What type is each value?",
 "prompt": "Pick the Python type each value would have.",
 "buckets": [
  "str",
  "int",
  "float",
  "bool",
  "list"
 ],
 "items": [
  {
   "text": "\"opeyemi\"",
   "code": true,
   "bucket": "str",
   "why": "Anything in quotes is a string."
  },
  {
   "text": "12",
   "code": true,
   "bucket": "int",
   "why": "A whole number with no decimal point is an int."
  },
  {
   "text": "245.50",
   "code": true,
   "bucket": "float",
   "why": "A decimal point makes it a float."
  },
  {
   "text": "True",
   "code": true,
   "bucket": "bool",
   "why": "True and False are the two bool values."
  },
  {
   "text": "[\"python\", \"docker\"]",
   "code": true,
   "bucket": "list",
   "why": "Square brackets make a list."
  },
  {
   "text": "\"19.99\"",
   "code": true,
   "bucket": "str",
   "why": "It looks like a number, but the quotes make it text. That's why \"19.99\" + 5 fails."
  },
  {
   "text": "12.0",
   "code": true,
   "bucket": "float",
   "why": "Even a whole number is a float once it has a decimal point."
  }
 ]
}
```

**Your turn:** Add a variable `cart_count` holding the text `"3"`. Convert it to an `int`, add 1, and print the result and its type.

### Checkpoint
You ran the code above, saw each type printed correctly, and understand why `price_as_text + 5` would fail.

### Quiz
1. What determines a variable's data type in Python?
2. What's the difference between `int` and `float`?
3. Why would `"19.99" + 5` cause an error?
4. What does `None` represent that `0` or `""` don't?
5. Name a real value in an app that should be a `bool`.

*Answers: 1) The value assigned to it. 2) `int` is a whole number; `float` allows decimal points. 3) You can't directly combine text and a number with `+`, they're different types. 4) The explicit absence of a value, as opposed to a zero or empty value that still exists. 5) A user's "is logged in" or "is premium member" status (any valid example).*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "boxes",
   "kicker": "Module 0 · Variables and data types",
   "title": "Name your data",
   "beats": [
    {
     "say": "Welcome to Python Programming Fundamentals."
    },
    {
     "say": "Every program you'll ever write stores information. Let's start with how."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "A variable is a name that points to a value",
   "nodes": [
    {
     "id": "u",
     "label": "username",
     "x": 18,
     "y": 22,
     "sub": "a name"
    },
    {
     "id": "uv",
     "label": "\"opeyemi\"",
     "x": 78,
     "y": 22,
     "sub": "str",
     "art": "pencil"
    },
    {
     "id": "l",
     "label": "login_count",
     "x": 18,
     "y": 50,
     "sub": "a name"
    },
    {
     "id": "lv",
     "label": "12",
     "x": 78,
     "y": 50,
     "sub": "int",
     "art": "calc"
    },
    {
     "id": "a",
     "label": "account_balance",
     "x": 18,
     "y": 78,
     "sub": "a name"
    },
    {
     "id": "av",
     "label": "245.5",
     "x": 78,
     "y": 78,
     "sub": "float",
     "art": "coin"
    }
   ],
   "edges": [
    {
     "from": "u",
     "to": "uv"
    },
    {
     "from": "l",
     "to": "lv"
    },
    {
     "from": "a",
     "to": "av"
    }
   ],
   "beats": [
    {
     "say": "A variable is a name that points to a value stored in memory.",
     "show": 2
    },
    {
     "say": "Write username equals opeyemi, and the name username now points at that text.",
     "show": 2,
     "on": [
      "u",
      "uv"
     ],
     "send": {
      "from": "u",
      "to": "uv",
      "label": "username = \"opeyemi\""
     }
    },
    {
     "say": "Login count points at the whole number twelve.",
     "show": 4,
     "on": [
      "l",
      "lv"
     ],
     "send": {
      "from": "l",
      "to": "lv",
      "label": "login_count = 12"
     }
    },
    {
     "say": "And account balance points at two hundred forty five point five.",
     "show": 6,
     "on": [
      "a",
      "av"
     ],
     "send": {
      "from": "a",
      "to": "av",
      "label": "account_balance = 245.50"
     }
    },
    {
     "say": "You never wrote a type. Python read each value and decided: text, whole number, decimal.",
     "show": 6,
     "on": [
      "uv",
      "lv",
      "av"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "The types you'll use most",
   "columns": [
    "Type",
    "Example",
    "Meaning"
   ],
   "rows": [
    [
     "int",
     "age = 25",
     "Whole numbers"
    ],
    [
     "float",
     "price = 19.99",
     "Decimal numbers"
    ],
    [
     "str",
     "name = \"Alice\"",
     "Text"
    ],
    [
     "bool",
     "is_active = True",
     "True or False"
    ],
    [
     "list",
     "tasks = [\"a\", \"b\"]",
     "Ordered, changeable"
    ],
    [
     "dict",
     "user = {\"name\": \"Alice\"}",
     "Key-value pairs"
    ],
    [
     "None",
     "result = None",
     "Explicitly \"no value\""
    ]
   ],
   "beats": [
    {
     "say": "Here are the seven types you'll meet most, each with an example.",
     "col": 0
    },
    {
     "say": "An int is a whole number, like twenty five.",
     "hl": 0
    },
    {
     "say": "A float has a decimal point, like nineteen ninety nine.",
     "hl": 1
    },
    {
     "say": "A string, s t r, is text, and it always sits inside quotes.",
     "hl": 2
    },
    {
     "say": "A bool is one of exactly two values: True or False.",
     "hl": 3
    },
    {
     "say": "A list keeps items in order in square brackets. A dict pairs keys with values in curly brackets.",
     "hl": [
      4,
      5
     ]
    },
    {
     "say": "And None means, on purpose, no value at all.",
     "hl": 6,
     "dim": true
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab",
   "title": "Ask Python what type each value is",
   "file": "types.py",
   "code": "username = \"opeyemi\"\nlogin_count = 12\naccount_balance = 245.50\nis_premium_member = True\nrecent_searches = [\"python\", \"docker\", \"databases\"]\n\nprint(type(username))\nprint(type(login_count))\nprint(type(account_balance))\nprint(type(is_premium_member))\nprint(type(recent_searches))",
   "beats": [
    {
     "say": "Line one stores the text opeyemi under the name username.",
     "line": 1,
     "vars": {
      "username": "\"opeyemi\""
     }
    },
    {
     "say": "Line two stores twelve. Line three stores two hundred forty five point five.",
     "line": [
      2,
      3
     ],
     "vars": {
      "login_count": 12,
      "account_balance": 245.5
     }
    },
    {
     "say": "Line four stores True, and line five stores a list of three searches.",
     "line": [
      4,
      5
     ],
     "vars": {
      "is_premium_member": true,
      "recent_searches": "[\"python\", \"docker\", \"databases\"]"
     }
    },
    {
     "say": "Now we ask. Type of username: class s t r, a string.",
     "line": 7,
     "out": "<class 'str'>"
    },
    {
     "say": "Twelve has no decimal point, so it's an int.",
     "line": 8,
     "out": "<class 'int'>"
    },
    {
     "say": "Two hundred forty five point five has one, so it's a float.",
     "line": 9,
     "out": "<class 'float'>"
    },
    {
     "say": "True is a bool.",
     "line": 10,
     "out": "<class 'bool'>"
    },
    {
     "say": "And the square brackets made a list.",
     "line": 11,
     "out": "<class 'list'>"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "A common bug",
   "title": "A number stored as text",
   "file": "price.py",
   "code": "price_as_text = \"19.99\"\n# print(price_as_text + 5)   # this would crash\nprice_as_number = float(price_as_text)\nprint(price_as_number + 5)",
   "beats": [
    {
     "say": "A price arrives as text: nineteen ninety nine, inside quotes.",
     "line": 1,
     "vars": {
      "price_as_text": "\"19.99\""
     }
    },
    {
     "say": "If line two ran, Python would stop with a type error. You can't add text and a number.",
     "line": 2
    },
    {
     "say": "So convert it first. Float turns the text into the decimal number nineteen ninety nine.",
     "line": 3,
     "vars": {
      "price_as_number": 19.99
     }
    },
    {
     "say": "Now the math works: twenty four ninety nine.",
     "line": 4,
     "out": "24.99"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Zero, empty, and None are not the same",
   "columns": [
    "Value",
    "Type",
    "What it says"
   ],
   "rows": [
    [
     "0",
     "int",
     "A number exists, and it's zero"
    ],
    [
     "\"\"",
     "str",
     "Text exists, but it's empty"
    ],
    [
     "None",
     "NoneType",
     "There is no value at all"
    ]
   ],
   "beats": [
    {
     "say": "One last idea. These three look like nothing, but they mean different things."
    },
    {
     "say": "Zero is a real number. A balance of zero still exists.",
     "hl": 0
    },
    {
     "say": "Two quotes with nothing inside is real text that happens to be empty.",
     "hl": 1
    },
    {
     "say": "None says there is no value at all, like a result that hasn't been worked out yet.",
     "hl": 2,
     "dim": true
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why would \"19.99\" + 5 cause an error?",
   "options": [
    "19.99 is too big a number",
    "The quotes make it text, and you can't add text and a number with +",
    "Python can't handle decimals"
   ],
   "answer": 1,
   "good": "That's right. The quotes make it a string, and you can't add a string and a number with plus.",
   "bad": "Not quite. The quotes make it a string, and you can't add a string and a number with plus.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why would nineteen ninety nine, in quotes, plus five cause an error?",
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
     "You ran the code and saw each type",
     ""
    ],
    [
     "You can explain why \"19.99\" + 5 fails",
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
     "say": "you've run the code and seen each type printed,",
     "show": 1
    },
    {
     "say": "and you can explain why price as text plus five fails.",
     "show": 2
    },
    {
     "say": "Next, in Module 1, you put values to work with operators.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 1: Operators

**Time: about 1 hour**

### Concept

**Operators** perform actions on values. The main categories:

| Type | Examples | Purpose |
|---|---|---|
| Arithmetic | `+ - * / // % **` | Math |
| Comparison | `== != > < >= <=` | Compare two values, returns `bool` |
| Logical | `and or not` | Combine true/false conditions |
| Assignment | `= += -= *=` | Assign or update a variable |

### Where you'd actually use this

Calculating a total cart price (arithmetic), checking if a user is old enough to sign up (comparison), and deciding if someone can access a feature only if they're logged in *and* have a premium account (logical).

### Lab

```python
# Arithmetic
cart_total = 45.00 + 12.50
discount = cart_total * 0.10   # 10% off
final_price = cart_total - discount
print(final_price)             # 51.75

# Comparison
user_age = 16
can_signup = user_age >= 18
print(can_signup)              # False

# Logical: combining conditions
is_logged_in = True
is_premium = False
can_access_feature = is_logged_in and is_premium
print(can_access_feature)      # False, both must be True

# Assignment shorthand
login_count = 0
login_count += 1   # same as: login_count = login_count + 1
print(login_count) # 1
```

**Your turn:** Write one line that sets `can_checkout` to `True` only if `cart_total` is over 0 *and* the user is logged in *or* is a guest (`is_guest = True`). Print it, then change the values and check it again.

### Checkpoint
You can predict the output of each print statement above before running it.

### Quiz
1. What does `//` do, differently from `/`?
2. What does `==` check, compared to `=`?
3. What does `and` require, compared to `or`?
4. What does `discount = cart_total * 0.10` calculate?
5. What is `login_count += 1` shorthand for?

*Answers: 1) `//` performs integer (floor) division, dropping any remainder; `/` gives a full decimal result. 2) `==` checks if two values are equal (returns `bool`); `=` assigns a value to a variable. 3) `and` requires both conditions to be true; `or` requires only one. 4) 10% of the cart total. 5) `login_count = login_count + 1`.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "calc",
   "kicker": "Module 1 · Operators",
   "title": "Make values do things",
   "beats": [
    {
     "say": "Welcome to Module 1."
    },
    {
     "say": "Operators perform actions on values: math, comparisons, and decisions."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Four kinds of operators",
   "columns": [
    "Type",
    "Examples",
    "Purpose"
   ],
   "rows": [
    [
     "Arithmetic",
     "+ - * / // % **",
     "Math"
    ],
    [
     "Comparison",
     "== != > < >= <=",
     "Compare, gives a bool"
    ],
    [
     "Logical",
     "and or not",
     "Combine True/False"
    ],
    [
     "Assignment",
     "= += -= *=",
     "Set or update a variable"
    ]
   ],
   "beats": [
    {
     "say": "There are four main kinds of operator.",
     "col": 0
    },
    {
     "say": "Arithmetic does math: add, subtract, multiply, divide, and more.",
     "hl": 0
    },
    {
     "say": "Comparison compares two values, and always gives back True or False.",
     "hl": 1
    },
    {
     "say": "Logical operators, and, or, and not, combine True or False answers.",
     "hl": 2
    },
    {
     "say": "And assignment sets or updates a variable.",
     "hl": 3
    },
    {
     "say": "Let's watch each one run, using a shopping cart.",
     "col": 2
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Arithmetic",
   "title": "Work out a cart total",
   "file": "cart.py",
   "code": "cart_total = 45.00 + 12.50\ndiscount = cart_total * 0.10   # 10% off\nfinal_price = cart_total - discount\nprint(final_price)",
   "beats": [
    {
     "say": "Forty five plus twelve fifty. Cart total is fifty seven point five.",
     "line": 1,
     "vars": {
      "cart_total": 57.5
     }
    },
    {
     "say": "Multiply by zero point one to get ten percent. The discount is five seventy five.",
     "line": 2,
     "vars": {
      "discount": 5.75
     }
    },
    {
     "say": "Subtract the discount from the total.",
     "line": 3,
     "vars": {
      "final_price": 51.75
     }
    },
    {
     "say": "And print it: fifty one seventy five.",
     "line": 4,
     "out": "51.75"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Comparison and logic",
   "title": "Answer yes-or-no questions",
   "file": "access.py",
   "code": "user_age = 16\ncan_signup = user_age >= 18\nprint(can_signup)\n\nis_logged_in = True\nis_premium = False\ncan_access_feature = is_logged_in and is_premium\nprint(can_access_feature)",
   "beats": [
    {
     "say": "The user is sixteen.",
     "line": 1,
     "vars": {
      "user_age": 16
     }
    },
    {
     "say": "Is sixteen greater than or equal to eighteen? No. So can sign up holds False.",
     "line": 2,
     "vars": {
      "can_signup": false
     }
    },
    {
     "say": "Print shows False.",
     "line": 3,
     "out": "False"
    },
    {
     "say": "Now two facts: logged in is True, premium is False.",
     "line": [
      5,
      6
     ],
     "vars": {
      "is_logged_in": true,
      "is_premium": false
     }
    },
    {
     "say": "And needs both sides to be True. One side is False, so the answer is False.",
     "line": 7,
     "vars": {
      "can_access_feature": false
     }
    },
    {
     "say": "Print shows False again.",
     "line": 8,
     "out": "False"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "and needs both. or needs one.",
   "columns": [
    "is_logged_in",
    "is_premium",
    "and",
    "or"
   ],
   "rows": [
    [
     "True",
     "True",
     "True",
     "True"
    ],
    [
     "True",
     "False",
     "False",
     "True"
    ],
    [
     "False",
     "True",
     "False",
     "True"
    ],
    [
     "False",
     "False",
     "False",
     "False"
    ]
   ],
   "beats": [
    {
     "say": "Here's every combination of the two facts."
    },
    {
     "say": "And is only True in one row: when both sides are True.",
     "col": 2,
     "hl": 0
    },
    {
     "say": "Or is True whenever at least one side is True. Three rows.",
     "col": 3,
     "hl": [
      0,
      1,
      2
     ]
    },
    {
     "say": "Our user is logged in but not premium. And gives False, but or would have given True.",
     "hl": 1,
     "dim": true
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Assignment shorthand",
   "title": "+= adds and saves",
   "file": "logins.py",
   "code": "login_count = 0\nlogin_count += 1   # same as: login_count = login_count + 1\nprint(login_count)",
   "beats": [
    {
     "say": "Login count starts at zero.",
     "line": 1,
     "vars": {
      "login_count": 0
     }
    },
    {
     "say": "Plus equals one reads the current value, adds one, and saves it back. Now it's one.",
     "line": 2,
     "vars": {
      "login_count": 1
     }
    },
    {
     "say": "Print shows one.",
     "line": 3,
     "out": "1"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What's the difference between == and =?",
   "options": [
    "They mean the same thing",
    "== checks if two values are equal; = assigns a value to a variable",
    "== is for numbers and = is for text"
   ],
   "answer": 1,
   "good": "That's right. Double equals checks whether two values are equal. A single equals assigns a value.",
   "bad": "Not quite. Double equals checks whether two values are equal. A single equals assigns a value.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What's the difference between double equals and a single equals?",
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
     "You can predict every output before running it",
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
     "say": "you can predict the output of each print statement before running it.",
     "show": 1
    },
    {
     "say": "Next, in Module 2, your programs start making decisions.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 2: Control Flow

**Time: about 1 hour**

### Concept

**Control flow** lets your program make decisions and run different code depending on conditions, using `if`, `elif` (else if), and `else`.

### Where you'd actually use this

Showing a different message based on account status, applying a discount only if a cart total is above a threshold, blocking access to a page unless a user is authenticated. Nearly every feature involves some decision-making.

### Lab

```python
def get_shipping_cost(cart_total, is_premium_member):
    if is_premium_member:
        return 0  # free shipping for premium members
    elif cart_total >= 50:
        return 0  # free shipping over $50
    elif cart_total >= 20:
        return 5.00
    else:
        return 9.99

print(get_shipping_cost(cart_total=60, is_premium_member=False))   # 0
print(get_shipping_cost(cart_total=30, is_premium_member=False))   # 5.0
print(get_shipping_cost(cart_total=10, is_premium_member=True))    # 0
print(get_shipping_cost(cart_total=10, is_premium_member=False))   # 9.99
```

**Your turn:** Write `get_grade(score)` that returns `"A"` for 90 and above, `"B"` for 80 to 89, `"C"` for 70 to 79, and `"Needs work"` otherwise. Test it with 95, 80, 72, and 40.

### Checkpoint
You can trace through `get_shipping_cost` by hand for a new set of inputs and predict the correct output before running it.

### Quiz
1. What does `elif` let you avoid, compared to writing several separate `if` statements?
2. In the example, why does `is_premium_member` get checked first?
3. What happens if none of the `if`/`elif` conditions are true?
4. Could you reorder the conditions and still get identical behavior? Why or why not?
5. What would `get_shipping_cost(cart_total=50, is_premium_member=False)` return, and why?

*Answers: 1) Once one condition matches, the rest are skipped, avoiding unnecessary checks and clearer intent than multiple independent `if` statements. 2) Because it should override the cart-total-based rules entirely, checking order matters when conditions overlap. 3) The `else` block runs, as a fallback. 4) Not always safely, since conditions are checked in order and the first match wins, reordering could change which branch executes for the same input. 5) `0`, because `cart_total >= 50` is true.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "fork",
   "kicker": "Module 2 · Control flow",
   "title": "Make decisions in code",
   "beats": [
    {
     "say": "Welcome to Module 2."
    },
    {
     "say": "Control flow lets your program choose what to do, using if, elif, and else."
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Trace it",
   "title": "Python checks from the top",
   "file": "shipping.py",
   "code": "def get_shipping_cost(cart_total, is_premium_member):\n    if is_premium_member:\n        return 0\n    elif cart_total >= 50:\n        return 0\n    elif cart_total >= 20:\n        return 5.00\n    else:\n        return 9.99\n\nprint(get_shipping_cost(cart_total=60, is_premium_member=False))\nprint(get_shipping_cost(cart_total=30, is_premium_member=False))\nprint(get_shipping_cost(cart_total=10, is_premium_member=True))\nprint(get_shipping_cost(cart_total=10, is_premium_member=False))",
   "beats": [
    {
     "say": "Here are the shipping rules: premium, then fifty or more, then twenty or more, else the rest.",
     "line": [
      1,
      9
     ]
    },
    {
     "say": "First call: a sixty dollar cart, not premium.",
     "line": 11,
     "vars": {
      "cart_total": 60,
      "is_premium_member": false
     }
    },
    {
     "say": "Premium? False, so skip that branch.",
     "line": 2
    },
    {
     "say": "Elif, else if, sixty is at least fifty? True.",
     "line": 4
    },
    {
     "say": "So it returns zero, and every rule below is skipped.",
     "line": 5,
     "out": "0"
    },
    {
     "say": "Second call: a thirty dollar cart, not premium.",
     "line": 12,
     "vars": {
      "cart_total": 30,
      "is_premium_member": false
     }
    },
    {
     "say": "Premium? False. Thirty at least fifty? False.",
     "line": [
      2,
      4
     ]
    },
    {
     "say": "Thirty at least twenty? True. Shipping is five dollars.",
     "line": [
      6,
      7
     ],
     "out": "5.0"
    },
    {
     "say": "Third call: ten dollars, but premium. The very first check is True. Free.",
     "line": [
      13,
      2,
      3
     ],
     "vars": {
      "cart_total": 10,
      "is_premium_member": true
     },
     "out": "0"
    },
    {
     "say": "Last call: ten dollars, not premium. Every check fails, so else catches it: nine ninety nine.",
     "line": [
      14,
      8,
      9
     ],
     "vars": {
      "cart_total": 10,
      "is_premium_member": false
     },
     "out": "9.99"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Trace it",
   "title": "Which rule wins for each call",
   "columns": [
    "cart_total",
    "premium",
    "first match",
    "returns"
   ],
   "rows": [
    [
     "60",
     "False",
     "≥ 50",
     "0"
    ],
    [
     "30",
     "False",
     "≥ 20",
     "5.0"
    ],
    [
     "10",
     "True",
     "premium",
     "0"
    ],
    [
     "10",
     "False",
     "else",
     "9.99"
    ],
    [
     "50",
     "False",
     "≥ 50",
     "0"
    ]
   ],
   "beats": [
    {
     "say": "Here are the four calls side by side."
    },
    {
     "say": "Notice the ten dollar cart gets two different answers. The premium flag changes everything.",
     "hl": [
      2,
      3
     ],
     "col": 1
    },
    {
     "say": "Now a new one: exactly fifty dollars, not premium.",
     "hl": 4,
     "dim": true
    },
    {
     "say": "Greater than or equal includes fifty itself, so the second rule matches. Free shipping.",
     "hl": 4,
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Why order matters",
   "title": "The first match wins",
   "values": [
    "premium?",
    "≥ 50?",
    "≥ 20?",
    "else"
   ],
   "beats": [
    {
     "say": "Think of the rules as a line of checks, tried from left to right."
    },
    {
     "say": "A ten dollar premium cart: the first check is True, so it stops right there.",
     "hl": 0,
     "ptr": {
      "check": 0
     },
     "note": "premium? True → return 0"
    },
    {
     "say": "The other three never run at all.",
     "hl": 0,
     "gone": [
      1,
      2,
      3
     ],
     "note": "rest skipped"
    },
    {
     "say": "Now swap the middle two rules, and try a sixty dollar cart that isn't premium.",
     "vals": [
      "premium?",
      "≥ 20?",
      "≥ 50?",
      "else"
     ]
    },
    {
     "say": "Premium? No.",
     "gone": [
      0
     ],
     "ptr": {
      "check": 0
     }
    },
    {
     "say": "Twenty or more? Yes, so it charges five dollars, and never reaches the free shipping rule.",
     "gone": [
      0
     ],
     "hl": 1,
     "ptr": {
      "check": 1
     },
     "note": "60 ≥ 20 → $5, but it should be free"
    },
    {
     "say": "Same rules, different order, wrong answer. That's why the order of elif checks matters.",
     "gone": [
      0,
      2,
      3
     ],
     "hl": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why is is_premium_member checked first?",
   "options": [
    "Python requires booleans to come first",
    "It should override the cart-total rules, and the first match wins",
    "It runs faster that way"
   ],
   "answer": 1,
   "good": "That's right. Premium should override every cart rule, and since the first matching rule wins, it has to come first.",
   "bad": "Not quite. Premium should override every cart rule, and since the first matching rule wins, it has to come first.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why is is premium member checked first?",
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
     "You can trace get_shipping_cost by hand",
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
     "say": "you can trace get shipping cost by hand for new inputs and predict the result.",
     "show": 1
    },
    {
     "say": "Next, in Module 3, you make code repeat itself with loops.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 3: Loops

**Time: about 1 hour**

### Concept

**Loops** repeat a block of code. A `for` loop repeats a known number of times (or once per item in a collection). A `while` loop repeats as long as a condition stays true.

### Where you'd actually use this

Processing every item in a shopping cart to calculate a total, retrying a failed network request a few times, sending a notification to every user in a list.

### Lab

```python
# for loop: process every item in a list
cart = [
    {"name": "Book", "price": 12.99},
    {"name": "Pen", "price": 1.50},
    {"name": "Notebook", "price": 4.00},
]

total = 0
for item in cart:
    total += item["price"]
print(f"Total: {total}")   # Total: 18.490000000000002

# Computers store most decimals as close approximations, so tiny errors appear.
# For money, round to 2 decimal places before showing the result:
print(f"Total: {round(total, 2)}")   # Total: 18.49

# for loop with index, when you need position too
for index, item in enumerate(cart):
    print(f"{index + 1}. {item['name']}")

# while loop: retry logic
attempts = 0
max_attempts = 3
success = False

while attempts < max_attempts and not success:
    attempts += 1
    print(f"Attempt {attempts}")
    success = attempts == 3   # pretend it finally succeeds on the 3rd try

print("Success!" if success else "Failed after all attempts")
```

**Your turn:** Using the same `cart`, write a loop that counts how many items cost more than 3.00 and prints the count (it should be 2).

### Checkpoint
You can explain why the `while` loop stops after exactly 3 attempts, tracing through both conditions.

### Quiz
1. When would you reach for a `for` loop instead of a `while` loop?
2. What does `enumerate()` give you that a plain `for item in cart` doesn't?
3. What would happen if `attempts` were never incremented inside the `while` loop (and the success check stayed `success = attempts == 3`)?
4. What does `total += item["price"]` accomplish across the whole loop?
5. Why does the `while` loop check both `attempts < max_attempts` and `not success`?

*Answers: 1) When you know you're iterating over a fixed collection or a known range, rather than an open-ended condition. 2) The index (position) of each item alongside the item itself. 3) An infinite loop: `attempts` would stay 0, so `attempts < max_attempts` would always be true and `success` would never become true. 4) It accumulates the running sum of all item prices (which you then round with `round(total, 2)` for display, since float addition can leave tiny errors). 5) So it stops either when it runs out of attempts or as soon as it succeeds, whichever comes first.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "loop",
   "kicker": "Module 3 · Loops",
   "title": "Repeat work without copying code",
   "beats": [
    {
     "say": "Welcome to Module 3."
    },
    {
     "say": "Loops repeat a block of code, so you never copy and paste the same lines."
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · for",
   "title": "Add up a shopping cart",
   "file": "cart.py",
   "code": "cart = [\n    {\"name\": \"Book\", \"price\": 12.99},\n    {\"name\": \"Pen\", \"price\": 1.50},\n    {\"name\": \"Notebook\", \"price\": 4.00},\n]\n\ntotal = 0\nfor item in cart:\n    total += item[\"price\"]\nprint(f\"Total: {total}\")\nprint(f\"Total: {round(total, 2)}\")",
   "beats": [
    {
     "say": "A for loop runs once for each item in a collection. Here, a cart of three items.",
     "line": [
      1,
      5
     ]
    },
    {
     "say": "The total starts at zero.",
     "line": 7,
     "vars": {
      "total": 0
     }
    },
    {
     "say": "First pass: the item is the book. Add twelve ninety nine.",
     "line": [
      8,
      9
     ],
     "vars": {
      "item[\"price\"]": 12.99,
      "total": 12.99
     }
    },
    {
     "say": "Second pass: the pen. Add one fifty. Fourteen forty nine.",
     "line": [
      8,
      9
     ],
     "vars": {
      "item[\"price\"]": 1.5,
      "total": 14.49
     }
    },
    {
     "say": "Third pass: the notebook. Add four.",
     "line": [
      8,
      9
     ],
     "vars": {
      "item[\"price\"]": 4.0,
      "total": 18.490000000000002
     }
    },
    {
     "say": "No items left, so the loop ends. But look at the total: a long tail of digits.",
     "line": 10,
     "out": "Total: 18.490000000000002"
    },
    {
     "say": "Computers store most decimals as close approximations. For money, round to two places.",
     "line": 11,
     "out": "Total: 18.49"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · enumerate",
   "title": "enumerate gives you the position too",
   "values": [
    "Book",
    "Pen",
    "Notebook"
   ],
   "beats": [
    {
     "say": "Sometimes you need each item's position as well. That's what enumerate gives you."
    },
    {
     "say": "First pass: index zero, the book. We add one so it prints as number one.",
     "hl": 0,
     "ptr": {
      "index": 0
     },
     "note": "prints 1. Book"
    },
    {
     "say": "Next: index one, the pen.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "index": 1
     },
     "note": "prints 2. Pen"
    },
    {
     "say": "Then index two, the notebook.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "index": 2
     },
     "note": "prints 3. Notebook"
    },
    {
     "say": "Python counts positions from zero. That's why the code prints index plus one.",
     "ok": [
      0,
      1,
      2
     ],
     "note": "print(f\"{index + 1}. {item['name']}\")"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · while",
   "title": "Retry until it works",
   "file": "retry.py",
   "code": "attempts = 0\nmax_attempts = 3\nsuccess = False\n\nwhile attempts < max_attempts and not success:\n    attempts += 1\n    print(f\"Attempt {attempts}\")\n    success = attempts == 3   # pretend the 3rd try works\n\nprint(\"Success!\" if success else \"Failed after all attempts\")",
   "beats": [
    {
     "say": "A while loop repeats as long as its condition stays True. We start with zero attempts and no success.",
     "line": [
      1,
      3
     ],
     "vars": {
      "attempts": 0,
      "max_attempts": 3,
      "success": false
     }
    },
    {
     "say": "Check: zero is less than three, and we haven't succeeded. Go in.",
     "line": 5
    },
    {
     "say": "Attempts becomes one. Print attempt one. Does one equal three? No, still no success.",
     "line": [
      6,
      8
     ],
     "vars": {
      "attempts": 1,
      "success": false
     },
     "out": "Attempt 1"
    },
    {
     "say": "Check again: one is less than three, still no success. Second pass.",
     "line": [
      5,
      8
     ],
     "vars": {
      "attempts": 2,
      "success": false
     },
     "out": "Attempt 2"
    },
    {
     "say": "Third pass. Attempts is three, and three equals three, so success is True.",
     "line": [
      5,
      8
     ],
     "vars": {
      "attempts": 3,
      "success": true
     },
     "out": "Attempt 3"
    },
    {
     "say": "Check once more. Three is not less than three, and we've succeeded. Both say stop.",
     "line": 5
    },
    {
     "say": "The loop ends, and we print success.",
     "line": 10,
     "out": "Success!"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Trace it",
   "title": "Why it stops after exactly 3 attempts",
   "columns": [
    "check",
    "attempts",
    "attempts < 3",
    "not success",
    "go in?"
   ],
   "rows": [
    [
     "1st",
     "0",
     "True",
     "True",
     "yes"
    ],
    [
     "2nd",
     "1",
     "True",
     "True",
     "yes"
    ],
    [
     "3rd",
     "2",
     "True",
     "True",
     "yes"
    ],
    [
     "4th",
     "3",
     "False",
     "False",
     "stop"
    ]
   ],
   "beats": [
    {
     "say": "Here's every time the while condition was checked."
    },
    {
     "say": "The first three checks: both halves True, so the loop runs.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 4
    },
    {
     "say": "On the fourth check, attempts has reached three, so attempts less than three is False.",
     "hl": 3,
     "col": 2
    },
    {
     "say": "And success is now True, so not success is False too. And needs both, so the loop stops.",
     "hl": 3,
     "dim": true,
     "col": 3
    },
    {
     "say": "Forget attempts plus equals one, and attempts stays zero forever. That's an infinite loop.",
     "hl": 0,
     "dim": true,
     "col": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does enumerate() give you that a plain for loop doesn't?",
   "options": [
    "A sorted copy of the list",
    "The position of each item, alongside the item",
    "Only the last item"
   ],
   "answer": 1,
   "good": "That's right. Enumerate gives you each item's position as well as the item itself.",
   "bad": "Not quite. Enumerate gives you each item's position as well as the item itself.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does enumerate give you that a plain for loop doesn't?",
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
     "You can explain why the while loop stops after 3 attempts",
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
     "say": "you can explain why the while loop stops after exactly three attempts.",
     "show": 1
    },
    {
     "say": "Next, in Module 4, you write your own functions.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 4: Functions

**Time: about 2 hours**

### Concept

A **function** is a named, reusable block of code that can accept inputs (**parameters**) and return an output. Functions let you write logic once and use it everywhere, instead of copying and pasting the same code repeatedly.

### Where you'd actually use this

Any repeated calculation or action, calculating a discount, validating an email format, formatting a date, sending a welcome email, should live in a function so it's written once and reused consistently.

### Lab

```python
def calculate_discount(price, discount_percent=10):
    """Apply a percentage discount to a price. Defaults to 10% if not specified."""
    discount_amount = price * (discount_percent / 100)
    return price - discount_amount

print(calculate_discount(100))          # 90.0, uses the default 10%
print(calculate_discount(100, 25))      # 75.0, overrides the default

def validate_email(email):
    has_at_symbol = "@" in email
    has_dot = "." in email
    return has_at_symbol and has_dot

print(validate_email("alice@example.com"))  # True
print(validate_email("not-an-email"))        # False

# Functions calling other functions - a common real pattern
def process_order(price, discount_percent, customer_email):
    if not validate_email(customer_email):
        return "Invalid email, cannot process order"
    final_price = calculate_discount(price, discount_percent)
    return f"Order confirmed: ${final_price} charged to {customer_email}"

print(process_order(100, 15, "alice@example.com"))
```

**Your turn:** Write `format_price(amount)` that returns text like `"$12.50"` (hint: `f"${amount:.2f}"`). Use it inside `process_order` so the confirmation always shows two decimal places.

### Checkpoint
You can explain what a default parameter is and identify where `process_order` reuses the other two functions.

### Quiz
1. What's the benefit of putting repeated logic in a function instead of copying it everywhere?
2. What does `discount_percent=10` mean in the function definition?
3. What does a function return if you don't write a `return` statement?
4. Why does `process_order` call `validate_email` instead of rewriting that logic itself?
5. What would happen if you called `calculate_discount("100")` with a string instead of a number?

*Answers: 1) A single place to fix bugs or make changes, instead of updating every copy individually. 2) A default value used if the caller doesn't provide one. 3) `None`. 4) To reuse existing, already-tested logic rather than duplicating it, the core benefit of functions. 5) It raises `TypeError: can't multiply sequence by non-int of type 'float'`, because `"100" * 0.1` tries to repeat a string a fractional number of times.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "package",
   "kicker": "Module 4 · Functions",
   "title": "Write it once, use it everywhere",
   "beats": [
    {
     "say": "Welcome to Module 4."
    },
    {
     "say": "A function is a named, reusable block of code."
    },
    {
     "say": "It takes inputs called parameters, and can return an output."
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Default values",
   "title": "A default fills in what you leave out",
   "file": "discount.py",
   "code": "def calculate_discount(price, discount_percent=10):\n    discount_amount = price * (discount_percent / 100)\n    return price - discount_amount\n\nprint(calculate_discount(100))\nprint(calculate_discount(100, 25))",
   "beats": [
    {
     "say": "Def defines the function once. Nothing runs yet.",
     "line": 1
    },
    {
     "say": "First call: we pass only the price, one hundred.",
     "line": 5
    },
    {
     "say": "Discount percent wasn't given, so it uses its default: ten.",
     "line": 1,
     "vars": {
      "price": 100,
      "discount_percent": 10
     }
    },
    {
     "say": "Ten percent of a hundred is ten.",
     "line": 2,
     "vars": {
      "discount_amount": 10.0
     }
    },
    {
     "say": "Return a hundred minus ten. Print shows ninety point zero.",
     "line": 3,
     "out": "90.0"
    },
    {
     "say": "Second call passes twenty five, which replaces the default.",
     "line": [
      5,
      6
     ],
     "vars": {
      "price": 100,
      "discount_percent": 25,
      "discount_amount": "—"
     }
    },
    {
     "say": "The discount is twenty five, and it returns seventy five.",
     "line": [
      2,
      3
     ],
     "vars": {
      "discount_amount": 25.0
     },
     "out": "75.0"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Return values",
   "title": "A function that answers yes or no",
   "file": "email.py",
   "code": "def validate_email(email):\n    has_at_symbol = \"@\" in email\n    has_dot = \".\" in email\n    return has_at_symbol and has_dot\n\nprint(validate_email(\"alice@example.com\"))\nprint(validate_email(\"not-an-email\"))",
   "beats": [
    {
     "say": "We call validate email with alice at example dot com.",
     "line": [
      6,
      1
     ],
     "vars": {
      "email": "\"alice@example.com\""
     }
    },
    {
     "say": "Is there an at sign in it? Yes.",
     "line": 2,
     "vars": {
      "has_at_symbol": true
     }
    },
    {
     "say": "Is there a dot? Yes.",
     "line": 3,
     "vars": {
      "has_dot": true
     }
    },
    {
     "say": "Both True, so it returns True.",
     "line": 4,
     "out": "True"
    },
    {
     "say": "Now the text not dash an dash email.",
     "line": [
      7,
      1
     ],
     "vars": {
      "email": "\"not-an-email\"",
      "has_at_symbol": "—",
      "has_dot": "—"
     }
    },
    {
     "say": "No at sign, and no dot either.",
     "line": [
      2,
      3
     ],
     "vars": {
      "has_at_symbol": false,
      "has_dot": false
     }
    },
    {
     "say": "So it returns False.",
     "line": 4,
     "out": "False"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Reuse",
   "title": "process_order calls the other two",
   "nodes": [
    {
     "id": "call",
     "label": "Your code",
     "x": 12,
     "y": 50,
     "sub": "process_order(...)",
     "art": "code"
    },
    {
     "id": "po",
     "label": "process_order",
     "x": 48,
     "y": 50,
     "sub": "100, 15%, alice@…",
     "art": "package"
    },
    {
     "id": "ve",
     "label": "validate_email",
     "x": 86,
     "y": 22,
     "sub": "checks the email",
     "art": "form"
    },
    {
     "id": "cd",
     "label": "calculate_discount",
     "x": 86,
     "y": 78,
     "sub": "works out the price",
     "art": "calc"
    }
   ],
   "edges": [
    {
     "from": "call",
     "to": "po"
    },
    {
     "from": "po",
     "to": "ve"
    },
    {
     "from": "po",
     "to": "cd"
    }
   ],
   "beats": [
    {
     "say": "Real code builds big jobs out of small functions.",
     "show": 4
    },
    {
     "say": "We ask process order for a one hundred dollar order, fifteen percent off, for Alice.",
     "on": "po",
     "send": {
      "from": "call",
      "to": "po",
      "label": "100, 15, alice@example.com"
     }
    },
    {
     "say": "First it hands the email to validate email.",
     "on": "ve",
     "send": {
      "from": "po",
      "to": "ve",
      "label": "alice@example.com"
     }
    },
    {
     "say": "Back comes True, so the order can go ahead. A False would have stopped it right here.",
     "on": "po",
     "send": {
      "from": "ve",
      "to": "po",
      "label": "True"
     }
    },
    {
     "say": "Next it asks calculate discount for the price.",
     "on": "cd",
     "send": {
      "from": "po",
      "to": "cd",
      "label": "100, 15"
     }
    },
    {
     "say": "Fifteen percent off a hundred: eighty five point zero.",
     "on": "po",
     "send": {
      "from": "cd",
      "to": "po",
      "label": "85.0"
     }
    },
    {
     "say": "Process order builds the confirmation and returns it. No logic was written twice.",
     "on": "call",
     "send": {
      "from": "po",
      "to": "call",
      "label": "Order confirmed: $85.0 …"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Reuse",
   "title": "The same call, line by line",
   "file": "orders.py",
   "code": "def process_order(price, discount_percent, customer_email):\n    if not validate_email(customer_email):\n        return \"Invalid email, cannot process order\"\n    final_price = calculate_discount(price, discount_percent)\n    return f\"Order confirmed: ${final_price} charged to {customer_email}\"\n\nprint(process_order(100, 15, \"alice@example.com\"))",
   "beats": [
    {
     "say": "Here's the code behind that picture.",
     "line": 7,
     "vars": {
      "price": 100,
      "discount_percent": 15,
      "customer_email": "\"alice@example.com\""
     }
    },
    {
     "say": "Validate email gives True, so not True is False, and we skip the error message.",
     "line": 2
    },
    {
     "say": "Calculate discount returns eighty five point zero.",
     "line": 4,
     "vars": {
      "final_price": 85.0
     }
    },
    {
     "say": "The f string drops the price and email into the message, and print shows it.",
     "line": 5,
     "out": "Order confirmed: $85.0 charged to alice@example.com"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does a function return if it has no return statement?",
   "options": [
    "0",
    "None",
    "An error"
   ],
   "answer": 1,
   "good": "That's right. Without a return statement, a function returns None.",
   "bad": "Not quite. Without a return statement, a function returns None.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does a function return if it has no return statement?",
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
     "You can explain default parameters",
     ""
    ],
    [
     "You can see where process_order reuses other functions",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 4.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you can explain what a default parameter is,",
     "show": 1
    },
    {
     "say": "and point to where process order reuses the other two functions.",
     "show": 2
    },
    {
     "say": "Next, in Module 5, you handle errors gracefully.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 5: Error Handling

**Time: about 2 hours**

### Concept

**Errors** (exceptions) happen when something goes wrong while a program runs, a file doesn't exist, a network request fails, invalid data comes in. `try`/`except` lets you catch these errors and handle them gracefully instead of crashing the whole program.

### Where you'd actually use this

Reading a file that might not exist, calling an external API that might be down, parsing user input that might be malformed, anywhere your program interacts with something outside its own control, which is most real programs.

### Lab

```python
def get_price_per_item(total_price, quantity):
    try:
        return total_price / quantity
    except ZeroDivisionError:
        print("Quantity cannot be zero")
        return None

print(get_price_per_item(100, 4))   # 25.0
print(get_price_per_item(100, 0))   # prints the message, returns None

# Catching a specific error type from bad input
def parse_age(age_text):
    try:
        return int(age_text)
    except ValueError:
        print(f"'{age_text}' is not a valid age")
        return None

print(parse_age("25"))       # 25
print(parse_age("twenty"))   # prints the message, returns None

# try/except/finally: cleanup that always runs
def process_payment(amount):
    try:
        if amount <= 0:
            raise ValueError("Amount must be positive")
        print(f"Processing ${amount}")
    except ValueError as e:
        print(f"Payment failed: {e}")
    finally:
        print("Payment attempt logged")   # runs whether it succeeded or failed

process_payment(50)
process_payment(-10)
```

```lab
{
 "type": "sort",
 "title": "Which error would Python raise?",
 "prompt": "Match each line to the exception it causes. Then try some in the code cell above to check.",
 "buckets": [
  "ValueError",
  "TypeError",
  "KeyError",
  "IndexError",
  "ZeroDivisionError"
 ],
 "items": [
  {
   "text": "int(\"abc\")",
   "code": true,
   "bucket": "ValueError",
   "why": "The type is right (a string), but the value can't become a number."
  },
  {
   "text": "\"total: \" + 5",
   "code": true,
   "bucket": "TypeError",
   "why": "You can't add a string and a number."
  },
  {
   "text": "{\"name\": \"Ada\"}[\"email\"]",
   "code": true,
   "bucket": "KeyError",
   "why": "The dictionary has no \"email\" key."
  },
  {
   "text": "[10, 20, 30][5]",
   "code": true,
   "bucket": "IndexError",
   "why": "The list only has positions 0 to 2."
  },
  {
   "text": "100 / 0",
   "code": true,
   "bucket": "ZeroDivisionError",
   "why": "Dividing by zero is undefined."
  }
 ]
}
```

**Your turn:** Write `safe_get_email(user)` that returns `user["email"]`, but catches a `KeyError` and returns `"no email on file"` instead. Test it with `{"email": "a@b.com"}` and with `{}`.

### Checkpoint
You can explain the difference between what happens with and without a matching `except` block for the error that occurs.

### Quiz
1. What does `try`/`except` prevent from happening when an error occurs?
2. Why catch `ZeroDivisionError` specifically instead of catching every possible error the same way?
3. What does `finally` guarantee?
4. What does `raise ValueError("...")` do?
5. What would happen if `parse_age` had no `try`/`except` at all and received `"twenty"`?

*Answers: 1) The whole program crashing and stopping immediately. 2) Different errors often need different handling, catching everything the same way can hide bugs you actually needed to notice. 3) That block of code runs regardless of whether an error occurred or not. 4) Manually triggers an error with a custom message, useful for enforcing your own rules. 5) The program would crash with an unhandled `ValueError`, since `int("twenty")` isn't a valid conversion.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "warning",
   "kicker": "Module 5 · Error handling",
   "title": "Don't let one error crash everything",
   "beats": [
    {
     "say": "Welcome to Module 5."
    },
    {
     "say": "Things go wrong in real programs. A file is missing, a network call fails, someone types the wrong thing."
    },
    {
     "say": "Try and except let you catch these errors and carry on, instead of crashing."
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab",
   "title": "Catch a specific error",
   "file": "price_per_item.py",
   "code": "def get_price_per_item(total_price, quantity):\n    try:\n        return total_price / quantity\n    except ZeroDivisionError:\n        print(\"Quantity cannot be zero\")\n        return None\n\nprint(get_price_per_item(100, 4))\nprint(get_price_per_item(100, 0))",
   "beats": [
    {
     "say": "First call: one hundred split across four items.",
     "line": 8,
     "vars": {
      "total_price": 100,
      "quantity": 4
     }
    },
    {
     "say": "Inside try, the division works. Twenty five point zero comes back, and except is skipped.",
     "line": [
      2,
      3
     ],
     "out": "25.0"
    },
    {
     "say": "Second call: the quantity is zero.",
     "line": 9,
     "vars": {
      "total_price": 100,
      "quantity": 0
     }
    },
    {
     "say": "Dividing by zero raises a zero division error, and Python stops that line immediately.",
     "line": 3
    },
    {
     "say": "It jumps to the matching except block, which prints a friendly message.",
     "line": [
      4,
      5
     ],
     "out": "Quantity cannot be zero"
    },
    {
     "say": "Then it returns None, so print shows None. The program keeps running.",
     "line": 6,
     "out": "None"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "With and without a matching except",
   "nodes": [
    {
     "id": "err",
     "label": "int(\"twenty\")",
     "x": 12,
     "y": 50,
     "sub": "raises ValueError",
     "art": "bug"
    },
    {
     "id": "chk",
     "label": "Matching except?",
     "x": 46,
     "y": 50,
     "sub": "except ValueError:",
     "art": "search"
    },
    {
     "id": "ok",
     "label": "Handled",
     "x": 86,
     "y": 22,
     "sub": "message, return None",
     "art": "shield"
    },
    {
     "id": "crash",
     "label": "Program crashes",
     "x": 86,
     "y": 78,
     "sub": "stops completely",
     "art": "cross"
    }
   ],
   "edges": [
    {
     "from": "err",
     "to": "chk"
    },
    {
     "from": "chk",
     "to": "ok"
    },
    {
     "from": "chk",
     "to": "crash"
    }
   ],
   "beats": [
    {
     "say": "When an error happens, Python looks for an except block that matches it.",
     "show": 4
    },
    {
     "say": "In parse age, int of the word twenty can't become a number, so it raises a value error.",
     "on": "err",
     "send": {
      "from": "err",
      "to": "chk",
      "label": "ValueError"
     }
    },
    {
     "say": "Parse age has except value error, a match. It prints a message and returns None.",
     "on": "ok",
     "send": {
      "from": "chk",
      "to": "ok",
      "label": "match"
     }
    },
    {
     "say": "Without a matching except, the error isn't caught, and the whole program crashes.",
     "on": "crash",
     "send": {
      "from": "chk",
      "to": "crash",
      "label": "no match"
     }
    },
    {
     "say": "That's why you catch the specific error you expect, and let surprises show up so you can fix them.",
     "on": [
      "ok",
      "crash"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Know your errors",
   "title": "Which error does each line raise?",
   "columns": [
    "Line",
    "Error",
    "Why"
   ],
   "rows": [
    [
     "int(\"abc\")",
     "ValueError",
     "Right type, impossible value"
    ],
    [
     "\"total: \" + 5",
     "TypeError",
     "Text plus a number"
    ],
    [
     "{\"name\": \"Ada\"}[\"email\"]",
     "KeyError",
     "No such key"
    ],
    [
     "[10, 20, 30][5]",
     "IndexError",
     "Only positions 0 to 2"
    ],
    [
     "100 / 0",
     "ZeroDivisionError",
     "Can't divide by zero"
    ]
   ],
   "beats": [
    {
     "say": "Knowing the common errors by name tells you what to catch.",
     "col": 1
    },
    {
     "say": "A value error: the right type, but a value that can't work, like turning abc into a number.",
     "hl": 0
    },
    {
     "say": "A type error: mixing types that don't go together, like text plus a number.",
     "hl": 1
    },
    {
     "say": "A key error: asking a dictionary for a key it doesn't have.",
     "hl": 2
    },
    {
     "say": "An index error: asking for position five in a list with only three items.",
     "hl": 3
    },
    {
     "say": "And a zero division error: dividing by zero.",
     "hl": 4,
     "dim": true
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · raise and finally",
   "title": "finally always runs",
   "file": "payment.py",
   "code": "def process_payment(amount):\n    try:\n        if amount <= 0:\n            raise ValueError(\"Amount must be positive\")\n        print(f\"Processing ${amount}\")\n    except ValueError as e:\n        print(f\"Payment failed: {e}\")\n    finally:\n        print(\"Payment attempt logged\")\n\nprocess_payment(50)\nprocess_payment(-10)",
   "beats": [
    {
     "say": "First, a payment of fifty.",
     "line": 11,
     "vars": {
      "amount": 50
     }
    },
    {
     "say": "Is fifty zero or less? No, so we don't raise anything.",
     "line": 3
    },
    {
     "say": "It prints processing fifty dollars.",
     "line": 5,
     "out": "Processing $50"
    },
    {
     "say": "No error, so except is skipped. But finally still runs.",
     "line": [
      8,
      9
     ],
     "out": "Payment attempt logged"
    },
    {
     "say": "Now a payment of minus ten.",
     "line": 12,
     "vars": {
      "amount": -10
     }
    },
    {
     "say": "Minus ten is zero or less, so we raise our own value error, with a message.",
     "line": [
      3,
      4
     ]
    },
    {
     "say": "Except catches it and stores it as e.",
     "line": 6,
     "vars": {
      "e": "Amount must be positive"
     }
    },
    {
     "say": "It prints payment failed, with the message.",
     "line": 7,
     "out": "Payment failed: Amount must be positive"
    },
    {
     "say": "And finally runs again. Success or failure, the attempt is always logged.",
     "line": [
      8,
      9
     ],
     "out": "Payment attempt logged"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why catch ZeroDivisionError specifically, not every error the same way?",
   "options": [
    "Python only allows one kind of except",
    "Different errors need different handling, and catching everything can hide real bugs",
    "It makes the code shorter"
   ],
   "answer": 1,
   "good": "That's right. Different errors need different handling, and catching everything the same way can hide bugs you needed to notice.",
   "bad": "Not quite. Different errors need different handling, and catching everything the same way can hide bugs you needed to notice.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why catch a zero division error specifically, instead of every error the same way?",
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
     "You can explain what a matching except block changes",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 5.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you can explain what happens with, and without, a matching except block.",
     "show": 1
    },
    {
     "say": "Next, in Module 6, you organise your code into modules.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 6: Modules & Packages

**Time: about 1 hour**

### Concept

A **module** is a single Python file containing reusable code. A **package** is a folder of related modules. Python's standard library ships with many built-in modules; **pip** lets you install third-party packages others have published.

### Where you'd actually use this

Organizing a growing codebase so related code lives together (e.g., all database logic in one module, all email logic in another), and using existing packages (like `requests` for HTTP calls) instead of reinventing solved problems yourself.

### Lab

**1. Using a built-in module:**
```python
import math
import random
from datetime import date

print(math.sqrt(16))              # 4.0
print(random.choice(["a", "b", "c"]))  # a random pick
print(date.today())                # today's date
```

**2. Installing and using a third-party package:**
```bash
pip install requests
```
```python
import requests

response = requests.get("https://api.github.com")
print(response.status_code)   # 200
```

**3. Creating your own module.** Create a file `pricing.py`:
```python
# pricing.py
def calculate_discount(price, discount_percent=10):
    return price - (price * (discount_percent / 100))

def calculate_tax(price, tax_rate=0.08):
    return price * (1 + tax_rate)
```
Then use it from another file in the same folder:
```python
# main.py
from pricing import calculate_discount, calculate_tax

price = calculate_discount(100, 20)
final = calculate_tax(price)
print(final)
```

**Your turn:** Add a function `format_receipt(price)` to `pricing.py` that returns text like `"Total: $86.40"`, then import it in `main.py` and print `format_receipt(final)`.

### Checkpoint
You created your own two-file project, where `main.py` successfully imports and uses functions from `pricing.py`.

### Quiz
1. What's the difference between a module and a package?
2. What does `pip` let you do that the standard library alone doesn't?
3. Why organize related functions into their own module instead of one giant file?
4. What does `from pricing import calculate_discount` do, specifically?
5. Would `main.py` work if `pricing.py` weren't in the same folder (without further configuration)?

*Answers: 1) A module is a single file; a package is a folder of related modules. 2) Install third-party code other people have published, extending what's available beyond the built-in standard library. 3) Easier to find, maintain, and reuse code as a project grows, rather than scrolling through one massive file. 4) Makes that one function available by its own name in `main.py`, so you can call `calculate_discount(...)` without writing `pricing.` in front. 5) No, not without adjusting the import path, Python needs to know where to find the module.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "boxes",
   "kicker": "Module 6 · Modules and packages",
   "title": "Organise and reuse code",
   "beats": [
    {
     "say": "Welcome to Module 6."
    },
    {
     "say": "As programs grow, one giant file becomes hard to manage. Modules fix that."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Where reusable code comes from",
   "columns": [
    "Word",
    "What it is",
    "Example"
   ],
   "rows": [
    [
     "Module",
     "One Python file",
     "pricing.py"
    ],
    [
     "Package",
     "A folder of related modules",
     "requests"
    ],
    [
     "Standard library",
     "Modules built into Python",
     "math, random, datetime"
    ],
    [
     "pip",
     "Installs packages others published",
     "pip install requests"
    ]
   ],
   "beats": [
    {
     "say": "A few words first.",
     "col": 0
    },
    {
     "say": "A module is a single Python file of reusable code, like pricing dot p y.",
     "hl": 0
    },
    {
     "say": "A package is a folder of related modules, like requests.",
     "hl": 1
    },
    {
     "say": "Python ships with a standard library of modules, ready to import.",
     "hl": 2
    },
    {
     "say": "And pip installs packages other people have published, so you don't reinvent solved problems.",
     "hl": 3
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Built-in modules",
   "title": "Python comes with tools",
   "file": "builtins.py",
   "code": "import math\nimport random\nfrom datetime import date\n\nprint(math.sqrt(16))\nprint(random.choice([\"a\", \"b\", \"c\"]))\nprint(date.today())",
   "beats": [
    {
     "say": "Import loads a module, so you can use what's inside it.",
     "line": [
      1,
      2
     ]
    },
    {
     "say": "From date time import date brings in just one thing: date.",
     "line": 3
    },
    {
     "say": "Math dot square root of sixteen is four point zero.",
     "line": 5,
     "out": "4.0"
    },
    {
     "say": "Random dot choice picks one item at random. This time, b. Yours may differ.",
     "line": 6,
     "out": "b"
    },
    {
     "say": "And date dot today prints today's date, year, month, day.",
     "line": 7,
     "out": "2026-10-08"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Third-party packages",
   "title": "pip install, then import",
   "nodes": [
    {
     "id": "you",
     "label": "Terminal",
     "x": 12,
     "y": 25,
     "sub": "pip install requests",
     "art": "terminal"
    },
    {
     "id": "pypi",
     "label": "Package index",
     "x": 50,
     "y": 25,
     "sub": "published packages",
     "art": "package"
    },
    {
     "id": "app",
     "label": "Your program",
     "x": 50,
     "y": 75,
     "sub": "import requests",
     "art": "code"
    },
    {
     "id": "gh",
     "label": "api.github.com",
     "x": 88,
     "y": 75,
     "sub": "a web A P I",
     "art": "globe"
    }
   ],
   "edges": [
    {
     "from": "you",
     "to": "pypi"
    },
    {
     "from": "pypi",
     "to": "app"
    },
    {
     "from": "app",
     "to": "gh"
    }
   ],
   "beats": [
    {
     "say": "For anything not built in, use pip.",
     "show": 4
    },
    {
     "say": "In the terminal, pip install requests asks the package index for it.",
     "on": "you",
     "send": {
      "from": "you",
      "to": "pypi",
      "label": "pip install requests"
     }
    },
    {
     "say": "The package downloads into your Python, ready to import.",
     "on": "app",
     "send": {
      "from": "pypi",
      "to": "app",
      "label": "requests"
     }
    },
    {
     "say": "Now requests dot get asks GitHub's A P I for a response.",
     "on": "gh",
     "send": {
      "from": "app",
      "to": "gh",
      "label": "GET https://api.github.com"
     }
    },
    {
     "say": "Status code two hundred comes back, which means success.",
     "on": "app",
     "send": {
      "from": "gh",
      "to": "app",
      "label": "200"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Your own module",
   "title": "main.py imports from pricing.py",
   "file": "pricing.py + main.py",
   "code": "# pricing.py\ndef calculate_discount(price, discount_percent=10):\n    return price - (price * (discount_percent / 100))\n\ndef calculate_tax(price, tax_rate=0.08):\n    return price * (1 + tax_rate)\n\n# main.py\nfrom pricing import calculate_discount, calculate_tax\n\nprice = calculate_discount(100, 20)\nfinal = calculate_tax(price)\nprint(final)",
   "beats": [
    {
     "say": "Two files in the same folder. Pricing dot p y holds two functions.",
     "line": [
      1,
      6
     ]
    },
    {
     "say": "Main dot p y imports both by name. Python finds pricing dot p y right next to it.",
     "line": 9
    },
    {
     "say": "Calculate discount of one hundred, twenty percent off, runs the code in pricing. Eighty.",
     "line": [
      11,
      3
     ],
     "vars": {
      "price": 80.0
     }
    },
    {
     "say": "Calculate tax adds the default eight percent. Eighty times one point zero eight.",
     "line": [
      12,
      6
     ],
     "vars": {
      "final": 86.4
     }
    },
    {
     "say": "Print shows eighty six point four. Main never had to contain the pricing code.",
     "line": 13,
     "out": "86.4"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What's the difference between a module and a package?",
   "options": [
    "A module is a folder; a package is a file",
    "A module is one file; a package is a folder of related modules",
    "There is no difference"
   ],
   "answer": 1,
   "good": "That's right. A module is a single file, and a package is a folder of related modules.",
   "bad": "Not quite. A module is a single file, and a package is a folder of related modules.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What's the difference between a module and a package?",
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
     "main.py imports and uses pricing.py",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 6.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you've built a two-file project where main dot p y imports from pricing dot p y.",
     "show": 1
    },
    {
     "say": "Next, in Module 7, you model real things with classes.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 7: Object-Oriented Programming

**Time: about 2 hours**

### Concept

**Object-Oriented Programming (OOP)** organizes code around **objects**, bundles of data (**attributes**) and behavior (**methods**) defined by a **class**, which acts as a blueprint. Two core ideas: **encapsulation** (bundling data and the logic that operates on it together) and **inheritance** (a class can build on another class, reusing and extending its behavior).

### Where you'd actually use this

Modeling real entities in your product, a `User`, a `Task`, an `Order`, each with their own data and behavior. Instead of passing loose dictionaries around and hoping every part of your code treats them consistently, a class defines exactly what a `Task` is and what it can do.

### Lab

```python
class Task:
    def __init__(self, title, priority=3):
        self.title = title
        self.priority = priority
        self.done = False

    def mark_complete(self):
        self.done = True

    def __str__(self):
        status = "done" if self.done else "pending"
        return f"[{status}] {self.title} (priority {self.priority})"

task1 = Task("Write course notes", priority=1)
task2 = Task("Review PR")

task1.mark_complete()

print(task1)   # [done] Write course notes (priority 1)
print(task2)   # [pending] Review PR (priority 3)

# Inheritance: a more specific kind of Task
class RecurringTask(Task):
    def __init__(self, title, priority=3, repeat_every_days=7):
        super().__init__(title, priority)   # reuse Task's setup logic
        self.repeat_every_days = repeat_every_days

    def mark_complete(self):
        super().mark_complete()
        print(f"Will reappear in {self.repeat_every_days} days")

weekly_task = RecurringTask("Water the plants", repeat_every_days=7)
weekly_task.mark_complete()
```

**Your turn:** Add a method `change_priority(self, new_priority)` to `Task` that only accepts values from 1 to 5 and raises `ValueError` otherwise. Call it with 2, then with 9 inside a `try`/`except`.

### Checkpoint
You can explain what `self` refers to, and why `RecurringTask` doesn't need to redefine `__init__` from scratch.

### Quiz
1. What's the difference between a class and an object?
2. What does `self` represent inside a method?
3. What does `super().__init__(...)` do in `RecurringTask`?
4. Why does `RecurringTask` override `mark_complete` instead of leaving it unchanged?
5. What would `print(task1)` show without the `__str__` method defined?

*Answers: 1) A class is the blueprint/definition; an object is a specific instance created from that blueprint. 2) The specific object the method is being called on. 3) Calls the parent class's `__init__`, reusing its setup logic instead of duplicating it. 4) To add extra behavior specific to recurring tasks, while still reusing the base behavior via `super()`. 5) A default, unhelpful representation like `<__main__.Task object at 0x...>` instead of the readable custom string.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "blueprint",
   "kicker": "Module 7 · Object-oriented programming",
   "title": "Model real things with classes",
   "beats": [
    {
     "say": "Welcome to Module 7."
    },
    {
     "say": "Object-oriented programming organises code around objects: bundles of data and behaviour."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "One class, many objects",
   "nodes": [
    {
     "id": "cls",
     "label": "Task",
     "x": 18,
     "y": 50,
     "sub": "the class: a blueprint",
     "art": "blueprint"
    },
    {
     "id": "t1",
     "label": "task1",
     "x": 78,
     "y": 22,
     "sub": "\"Write course notes\" · 1",
     "art": "checklist"
    },
    {
     "id": "t2",
     "label": "task2",
     "x": 78,
     "y": 78,
     "sub": "\"Review PR\" · 3",
     "art": "checklist"
    }
   ],
   "edges": [
    {
     "from": "cls",
     "to": "t1"
    },
    {
     "from": "cls",
     "to": "t2"
    }
   ],
   "beats": [
    {
     "say": "A class is a blueprint. Task describes what every task has, and what it can do.",
     "show": 1,
     "on": "cls"
    },
    {
     "say": "Calling Task builds one object from it: task one, with priority one.",
     "show": 2,
     "on": "t1",
     "send": {
      "from": "cls",
      "to": "t1",
      "label": "Task(\"Write course notes\", priority=1)"
     }
    },
    {
     "say": "Call it again, and you get a second, separate object: task two.",
     "show": 3,
     "on": "t2",
     "send": {
      "from": "cls",
      "to": "t2",
      "label": "Task(\"Review PR\")"
     }
    },
    {
     "say": "Each object keeps its own data, called attributes, and shares the class's methods.",
     "on": [
      "t1",
      "t2"
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab",
   "title": "Watch self fill in an object",
   "file": "tasks.py",
   "code": "class Task:\n    def __init__(self, title, priority=3):\n        self.title = title\n        self.priority = priority\n        self.done = False\n\n    def mark_complete(self):\n        self.done = True\n\ntask1 = Task(\"Write course notes\", priority=1)\ntask2 = Task(\"Review PR\")\n\ntask1.mark_complete()",
   "beats": [
    {
     "say": "Creating task one calls init. Self is the brand new object being built.",
     "line": [
      10,
      2
     ],
     "vars": {
      "self": "task1"
     }
    },
    {
     "say": "Init stores the title and priority on self, and done starts as False.",
     "line": [
      3,
      5
     ],
     "vars": {
      "task1.title": "\"Write course notes\"",
      "task1.priority": 1,
      "task1.done": false
     }
    },
    {
     "say": "Task two gives no priority, so the default three is used. This time, self is task two.",
     "line": [
      11,
      5
     ],
     "vars": {
      "self": "task2",
      "task2.title": "\"Review PR\"",
      "task2.priority": 3,
      "task2.done": false
     }
    },
    {
     "say": "Now task one dot mark complete. Inside the method, self is task one.",
     "line": [
      13,
      7
     ],
     "vars": {
      "self": "task1"
     }
    },
    {
     "say": "So only task one's done becomes True. Task two is untouched.",
     "line": 8,
     "vars": {
      "task1.done": true
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · __str__",
   "title": "Each object prints its own data",
   "columns": [
    "object",
    "title",
    "priority",
    "done",
    "print shows"
   ],
   "rows": [
    [
     "task1",
     "Write course notes",
     "1",
     "True",
     "[done] Write course notes (priority 1)"
    ],
    [
     "task2",
     "Review PR",
     "3",
     "False",
     "[pending] Review PR (priority 3)"
    ]
   ],
   "beats": [
    {
     "say": "Here are the two objects after mark complete, side by side."
    },
    {
     "say": "The str method decides how a task looks when you print it.",
     "sql": "status = \"done\" if self.done else \"pending\"\nreturn f\"[{status}] {self.title} (priority {self.priority})\""
    },
    {
     "say": "Task one's done is True, so its status reads done.",
     "hl": 0,
     "col": 3
    },
    {
     "say": "Task two's done is False, so it reads pending.",
     "hl": 1,
     "col": 3
    },
    {
     "say": "Same method, different self, different output. Without str, you'd see something like Task object at an address.",
     "hl": [
      0,
      1
     ],
     "col": 4
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Inheritance",
   "title": "Build on Task instead of starting over",
   "file": "recurring.py",
   "code": "class RecurringTask(Task):\n    def __init__(self, title, priority=3, repeat_every_days=7):\n        super().__init__(title, priority)\n        self.repeat_every_days = repeat_every_days\n\n    def mark_complete(self):\n        super().mark_complete()\n        print(f\"Will reappear in {self.repeat_every_days} days\")\n\nweekly_task = RecurringTask(\"Water the plants\", repeat_every_days=7)\nweekly_task.mark_complete()",
   "beats": [
    {
     "say": "Recurring task, in brackets Task, means it inherits everything Task has.",
     "line": 1
    },
    {
     "say": "We create a weekly task to water the plants.",
     "line": [
      10,
      2
     ],
     "vars": {
      "title": "\"Water the plants\"",
      "priority": 3,
      "repeat_every_days": 7
     }
    },
    {
     "say": "Super dot init runs Task's own setup: title, priority, and done set to False.",
     "line": 3,
     "vars": {
      "self.title": "\"Water the plants\"",
      "self.priority": 3,
      "self.done": false
     }
    },
    {
     "say": "Then it adds the one thing that's new: repeat every seven days.",
     "line": 4,
     "vars": {
      "self.repeat_every_days": 7
     }
    },
    {
     "say": "Now mark complete. Recurring task has its own version.",
     "line": [
      11,
      6
     ]
    },
    {
     "say": "It first calls Task's original, so done becomes True.",
     "line": 7,
     "vars": {
      "self.done": true
     }
    },
    {
     "say": "Then it adds its extra step.",
     "line": 8,
     "out": "Will reappear in 7 days"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does self represent inside a method?",
   "options": [
    "The class itself",
    "The specific object the method is called on",
    "The first parameter you pass in"
   ],
   "answer": 1,
   "good": "That's right. Self is the specific object the method is being called on.",
   "bad": "Not quite. Self is the specific object the method is being called on.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does self represent inside a method?",
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
     "You can explain self",
     ""
    ],
    [
     "You can explain why RecurringTask reuses __init__",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 7.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you can explain what self refers to,",
     "show": 1
    },
    {
     "say": "and why recurring task doesn't rewrite init from scratch.",
     "show": 2
    },
    {
     "say": "Next, in the last module, you save data to files.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 8: File Handling

**Time: about 1 hour**

### Concept

**File handling** lets a program read from and write to files on disk, so data can persist beyond a single run. Python's `open()` function, used with `with`, handles opening and automatically closing files safely, even if an error occurs partway through.

### Where you'd actually use this

Saving logs, reading a configuration file, processing a CSV of data, exporting a report a user can download. Any time data needs to survive after your program stops running (before you've learned databases, or alongside them for specific use cases like logs or exports).

### Lab

```python
# Writing to a file
tasks = ["Write course notes", "Review PR", "Design logo"]

with open("tasks.txt", "w") as f:
    for task in tasks:
        f.write(task + "\n")

# Reading it back
with open("tasks.txt", "r") as f:
    for line in f:
        print(line.strip())   # .strip() removes the trailing newline

# Appending instead of overwriting
with open("tasks.txt", "a") as f:
    f.write("Deploy to production\n")

# Working with structured data (JSON)
import json

user_data = {"name": "Alice", "tasks_completed": 12, "premium": True}

with open("user.json", "w") as f:
    json.dump(user_data, f)

with open("user.json", "r") as f:
    loaded_data = json.load(f)
    print(loaded_data["name"])   # Alice
```

**Your turn:** Load `user.json`, add 1 to `tasks_completed`, and save it back. Run your script twice and check that the number went up each time.

### Checkpoint
You created a text file and a JSON file, then successfully read both back and printed their contents.

### Quiz
1. What does the `with` statement guarantee, compared to calling `open()` directly?
2. What's the difference between `"w"` mode and `"a"` mode?
3. Why call `.strip()` when printing each line read from a file?
4. What does `json.dump()` do, compared to `f.write()` with a plain string?
5. What would happen if you opened a file in `"w"` mode that already had content in it?

*Answers: 1) The file is automatically closed properly, even if an error happens partway through, reducing the risk of corrupted or locked files. 2) `"w"` overwrites the file's existing contents; `"a"` adds new content to the end without erasing what's there. 3) Each line read from a file includes a trailing newline character, `.strip()` removes it for cleaner output. 4) It automatically converts a Python object (like a dictionary) into properly formatted JSON text, rather than you manually formatting it as a string. 5) The existing contents would be erased and replaced with the new content.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "file",
   "kicker": "Module 8 · File handling",
   "title": "Make data last",
   "beats": [
    {
     "say": "Welcome to the last module."
    },
    {
     "say": "Until now, everything disappears when your program stops. Files fix that."
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Write and read",
   "title": "Save a list, then read it back",
   "file": "tasks_file.py",
   "code": "tasks = [\"Write course notes\", \"Review PR\", \"Design logo\"]\n\nwith open(\"tasks.txt\", \"w\") as f:\n    for task in tasks:\n        f.write(task + \"\\n\")\n\nwith open(\"tasks.txt\", \"r\") as f:\n    for line in f:\n        print(line.strip())",
   "beats": [
    {
     "say": "Three tasks in a list.",
     "line": 1
    },
    {
     "say": "Open tasks dot t x t in w, write mode. With will close it for us, even if something fails.",
     "line": 3,
     "vars": {
      "tasks.txt": "empty"
     }
    },
    {
     "say": "Each pass writes one task, plus a backslash n, the line break.",
     "line": [
      4,
      5
     ],
     "vars": {
      "task": "\"Write course notes\"",
      "tasks.txt": "1 line"
     }
    },
    {
     "say": "Review P R, then design logo. Three lines saved.",
     "line": [
      4,
      5
     ],
     "vars": {
      "task": "\"Design logo\"",
      "tasks.txt": "3 lines"
     }
    },
    {
     "say": "The with block ends, and the file is closed safely.",
     "line": 7
    },
    {
     "say": "Now read mode. Each line comes back with its line break still on the end.",
     "line": 8,
     "vars": {
      "line": "\"Write course notes\\n\""
     }
    },
    {
     "say": "Strip removes it, and print shows the clean text.",
     "line": 9,
     "out": "Write course notes"
    },
    {
     "say": "The loop does the same for the other two lines.",
     "line": [
      8,
      9
     ],
     "vars": {
      "line": "\"Design logo\\n\""
     },
     "out": [
      "Review PR",
      "Design logo"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Careful",
   "title": "The mode decides what happens to old content",
   "columns": [
    "Mode",
    "Means",
    "Existing content"
   ],
   "rows": [
    [
     "\"r\"",
     "Read",
     "Kept, only read"
    ],
    [
     "\"w\"",
     "Write",
     "Erased first"
    ],
    [
     "\"a\"",
     "Append",
     "Kept, new text added at the end"
    ]
   ],
   "beats": [
    {
     "say": "The second argument to open is the mode.",
     "col": 0
    },
    {
     "say": "R, read, only reads. Nothing changes.",
     "hl": 0
    },
    {
     "say": "W, write, erases everything already in the file and starts fresh.",
     "hl": 1,
     "col": 2
    },
    {
     "say": "A, append, keeps what's there and adds to the end.",
     "hl": 2,
     "col": 2
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Append",
   "title": "a adds, w would erase",
   "values": [
    "Write course notes",
    "Review PR",
    "Design logo"
   ],
   "beats": [
    {
     "say": "Here are the three lines in tasks dot t x t."
    },
    {
     "say": "Open it in append mode and write deploy to production.",
     "vals": [
      "Write course notes",
      "Review PR",
      "Design logo",
      "Deploy to production"
     ],
     "hl": 3,
     "note": "open(\"tasks.txt\", \"a\")"
    },
    {
     "say": "The new line goes on the end, and the first three stay.",
     "vals": [
      "Write course notes",
      "Review PR",
      "Design logo",
      "Deploy to production"
     ],
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3
    },
    {
     "say": "If we'd used w instead, the file would be wiped first, leaving only the new line.",
     "vals": [
      "Deploy to production"
     ],
     "hl": 0,
     "note": "open(\"tasks.txt\", \"w\") → old lines gone"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · JSON",
   "title": "Save a dictionary, load it back",
   "nodes": [
    {
     "id": "dict",
     "label": "user_data",
     "x": 12,
     "y": 30,
     "sub": "Python dict",
     "art": "code"
    },
    {
     "id": "file",
     "label": "user.json",
     "x": 50,
     "y": 30,
     "sub": "JSON text on disk",
     "art": "file"
    },
    {
     "id": "loaded",
     "label": "loaded_data",
     "x": 88,
     "y": 30,
     "sub": "a dict again",
     "art": "code"
    },
    {
     "id": "out",
     "label": "Alice",
     "x": 88,
     "y": 78,
     "sub": "loaded_data[\"name\"]",
     "art": "terminal"
    }
   ],
   "edges": [
    {
     "from": "dict",
     "to": "file"
    },
    {
     "from": "file",
     "to": "loaded"
    },
    {
     "from": "loaded",
     "to": "out"
    }
   ],
   "beats": [
    {
     "say": "For structured data, like a user's details, use JSON.",
     "show": 1,
     "on": "dict"
    },
    {
     "say": "Json dot dump turns the dictionary into JSON text and writes it to user dot json.",
     "show": 2,
     "on": "file",
     "send": {
      "from": "dict",
      "to": "file",
      "label": "json.dump → {\"name\": \"Alice\", …}"
     }
    },
    {
     "say": "Your program can stop now. The file stays on disk.",
     "show": 2,
     "on": "file"
    },
    {
     "say": "Next time, json dot load reads the text back into a dictionary.",
     "show": 3,
     "on": "loaded",
     "send": {
      "from": "file",
      "to": "loaded",
      "label": "json.load"
     }
    },
    {
     "say": "So loaded data, name, prints Alice.",
     "show": 4,
     "on": "out",
     "send": {
      "from": "loaded",
      "to": "out",
      "label": "[\"name\"]"
     }
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What happens if you open a file that already has content in \"w\" mode?",
   "options": [
    "The new content is added to the end",
    "The existing content is erased and replaced",
    "Python refuses to open it"
   ],
   "answer": 1,
   "good": "That's right. Write mode erases what was there and replaces it.",
   "bad": "Not quite. Write mode erases what was there and replaces it.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What happens if you open a file that already has content in w mode?",
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
     "You created a text file and a JSON file",
     ""
    ],
    [
     "You read both back",
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
     "say": "you've created a text file and a JSON file,",
     "show": 1
    },
    {
     "say": "and read both back successfully.",
     "show": 2
    },
    {
     "say": "You've finished Python Programming Fundamentals. Well done.",
     "show": 2
    }
   ]
  }
 ]
}
```
