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
   "kind": "quote",
   "art": "pencil",
   "kicker": "Concept",
   "title": "A variable is a name for a value",
   "quote": "username = \"opeyemi\"",
   "beats": [
    {
     "say": "A variable is a name that points to a value stored in memory.",
     "show": 0
    },
    {
     "say": "Write username equals opeyemi, and Python remembers that value under the name username.",
     "show": 1
    },
    {
     "say": "You don't declare a type. Python works it out from the value you assign.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "blocks",
   "kicker": "Concept",
   "title": "The types you'll use most",
   "items": [
    [
     "int",
     "Whole numbers: 25"
    ],
    [
     "float",
     "Decimals: 19.99"
    ],
    [
     "str",
     "Text: \"Alice\""
    ],
    [
     "bool",
     "True or False"
    ],
    [
     "list",
     "[\"a\", \"b\"]"
    ],
    [
     "dict",
     "{\"name\": \"Alice\"}"
    ],
    [
     "None",
     "Explicitly no value"
    ]
   ],
   "beats": [
    {
     "say": "Here are the types you'll use most.",
     "show": 0
    },
    {
     "say": "An int is a whole number, like twenty five.",
     "show": 1
    },
    {
     "say": "A float has a decimal point, like nineteen ninety nine.",
     "show": 2
    },
    {
     "say": "A string, s t r, is text, always in quotes.",
     "show": 3
    },
    {
     "say": "A bool is True or False.",
     "show": 4
    },
    {
     "say": "A list is an ordered collection in square brackets, and a dict holds key and value pairs in curly brackets.",
     "show": 6
    },
    {
     "say": "And None means, on purpose, no value at all.",
     "show": 7
    }
   ]
  },
  {
   "kind": "code",
   "art": "search",
   "kicker": "Lab",
   "title": "Ask Python what type it is",
   "file": "Python",
   "code": "username = \"opeyemi\"\nlogin_count = 12\naccount_balance = 245.50\nis_premium_member = True\nrecent_searches = [\"python\", \"docker\"]\n\nprint(type(login_count))   # <class 'int'>",
   "beats": [
    {
     "say": "In the lab, you create a few variables for a user.",
     "show": 0
    },
    {
     "say": "Then type of each one tells you what Python decided.",
     "show": 1
    },
    {
     "say": "String for the username, int for the login count, float for the balance, bool for premium, and list for recent searches.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "bug",
   "kicker": "A common bug",
   "title": "Numbers stored as text",
   "file": "Python",
   "code": "price_as_text = \"19.99\"\n# price_as_text + 5   -> crashes: text + number\nprice_as_number = float(price_as_text)\nprint(price_as_number + 5)   # 24.99",
   "beats": [
    {
     "say": "Here's a bug you'll meet in real apps.",
     "show": 0
    },
    {
     "say": "A price arrives as the text nineteen ninety nine, in quotes.",
     "show": 1
    },
    {
     "say": "Adding five to it crashes, because you can't add text and a number.",
     "show": 1
    },
    {
     "say": "Convert it with float first, and the math works: twenty four ninety nine.",
     "show": 1
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
     "say": "Why would \"19.99\" + 5 cause an error?",
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
   "kind": "list",
   "art": "boxes",
   "kicker": "Concept",
   "title": "Four kinds of operators",
   "items": [
    [
     "Arithmetic",
     "+  -  *  /  //  %  **"
    ],
    [
     "Comparison",
     "==  !=  >  <  >=  <="
    ],
    [
     "Logical",
     "and  or  not"
    ],
    [
     "Assignment",
     "=  +=  -=  *="
    ]
   ],
   "beats": [
    {
     "say": "There are four main kinds.",
     "show": 0
    },
    {
     "say": "Arithmetic does math: plus, minus, times, divide, and more.",
     "show": 1
    },
    {
     "say": "Comparison compares two values and always gives back True or False.",
     "show": 2
    },
    {
     "say": "Logical operators, and, or, and not, combine true or false conditions.",
     "show": 3
    },
    {
     "say": "And assignment sets or updates a variable, like plus equals.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "coin",
   "kicker": "Lab · Arithmetic",
   "title": "Work out a cart total",
   "file": "Python",
   "code": "cart_total = 45.00 + 12.50\ndiscount = cart_total * 0.10   # 10% off\nfinal_price = cart_total - discount\nprint(final_price)             # 51.75",
   "beats": [
    {
     "say": "A shopping cart. Forty five plus twelve fifty.",
     "show": 0
    },
    {
     "say": "Take ten percent off by multiplying by zero point one,",
     "show": 1
    },
    {
     "say": "then subtract the discount. The final price is fifty one seventy five.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "scales",
   "kicker": "Lab · Comparison and logic",
   "title": "Answer yes-or-no questions",
   "file": "Python",
   "code": "user_age = 16\ncan_signup = user_age >= 18          # False\n\nis_logged_in = True\nis_premium = False\ncan_access = is_logged_in and is_premium   # False",
   "beats": [
    {
     "say": "Comparison. Is a sixteen year old at least eighteen? False.",
     "show": 0
    },
    {
     "say": "Logic. Can someone use a premium feature? Only if they're logged in and premium.",
     "show": 1
    },
    {
     "say": "And needs both to be true. They're not premium, so the answer is False.",
     "show": 1
    }
   ]
  },
  {
   "kind": "big",
   "art": "growth",
   "kicker": "Lab · Assignment shorthand",
   "title": "+= adds and saves",
   "big": "login_count += 1",
   "sub": "same as login_count = login_count + 1",
   "beats": [
    {
     "say": "Finally, a handy shortcut.",
     "show": 0
    },
    {
     "say": "Login count plus equals one means the same as login count equals login count plus one.",
     "show": 1
    },
    {
     "say": "Start at zero, add one, and you get one.",
     "show": 2
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
     "say": "What's the difference between == and =?",
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
   "kind": "list",
   "art": "bulb",
   "kicker": "Where you'd use this",
   "title": "Nearly every feature decides something",
   "items": [
    [
     "Different messages by account status",
     ""
    ],
    [
     "Discounts above a threshold",
     ""
    ],
    [
     "Pages only for logged-in users",
     ""
    ]
   ],
   "beats": [
    {
     "say": "Nearly every feature involves a decision.",
     "show": 0
    },
    {
     "say": "Show a different message depending on account status,",
     "show": 1
    },
    {
     "say": "give a discount only above a certain cart total,",
     "show": 2
    },
    {
     "say": "or block a page unless the user is logged in.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab",
   "title": "Shipping cost rules",
   "file": "Python",
   "code": "def get_shipping_cost(cart_total, is_premium_member):\n    if is_premium_member:\n        return 0\n    elif cart_total >= 50:\n        return 0\n    elif cart_total >= 20:\n        return 5.00\n    else:\n        return 9.99",
   "beats": [
    {
     "say": "Here's a shipping cost function.",
     "show": 0
    },
    {
     "say": "If you're a premium member, shipping is free.",
     "show": 1
    },
    {
     "say": "Elif, short for else if, the cart is fifty or more, it's also free.",
     "show": 1
    },
    {
     "say": "Elif it's twenty or more, five dollars. Else, nine ninety nine.",
     "show": 1
    },
    {
     "say": "Python checks from the top, and the first rule that matches wins.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "path",
   "kicker": "Trace it",
   "title": "A $30 cart, not premium",
   "steps": [
    "Premium? No",
    "≥ 50? No",
    "≥ 20? Yes",
    "$5.00"
   ],
   "beats": [
    {
     "say": "Let's trace a thirty dollar cart for someone who isn't premium.",
     "show": 0
    },
    {
     "say": "Premium? No.",
     "show": 1
    },
    {
     "say": "Fifty or more? No.",
     "show": 2
    },
    {
     "say": "Twenty or more? Yes.",
     "show": 3
    },
    {
     "say": "So shipping is five dollars, and the rest is skipped.",
     "show": 4
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
     "say": "Why is is_premium_member checked first?",
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
   "kind": "list",
   "art": "array",
   "kicker": "Concept",
   "title": "Two kinds of loop",
   "items": [
    [
     "for",
     "Once per item in a collection"
    ],
    [
     "while",
     "As long as a condition is true"
    ]
   ],
   "beats": [
    {
     "say": "There are two kinds.",
     "show": 0
    },
    {
     "say": "A for loop runs once for each item in a collection, or a known number of times.",
     "show": 1
    },
    {
     "say": "A while loop keeps going as long as a condition stays true.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "calc",
   "kicker": "Lab · for",
   "title": "Add up a shopping cart",
   "file": "Python",
   "code": "total = 0\nfor item in cart:\n    total += item[\"price\"]\n\nprint(round(total, 2))   # 18.49",
   "beats": [
    {
     "say": "A cart with a book, a pen, and a notebook.",
     "show": 0
    },
    {
     "say": "For each item in the cart, add its price to the total.",
     "show": 1
    },
    {
     "say": "You might see eighteen point four nine, followed by a long tail of digits.",
     "show": 1
    },
    {
     "say": "Computers store most decimals as close approximations. For money, round to two places.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "stopwatch",
   "kicker": "Lab · while",
   "title": "Retry until it works",
   "file": "Python",
   "code": "attempts = 0\nsuccess = False\nwhile attempts < 3 and not success:\n    attempts += 1\n    success = attempts == 3   # pretend the 3rd try works",
   "beats": [
    {
     "say": "Now a while loop, used for retrying.",
     "show": 0
    },
    {
     "say": "It keeps trying while there are attempts left, and it hasn't succeeded yet.",
     "show": 1
    },
    {
     "say": "Each pass adds one attempt. In this example, it succeeds on the third try and stops.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quote",
   "art": "warning",
   "kicker": "Watch out",
   "title": "The infinite loop",
   "quote": "If the condition never changes, a while loop never stops.",
   "beats": [
    {
     "say": "One warning.",
     "show": 0
    },
    {
     "say": "If nothing inside a while loop ever changes the condition, it runs forever.",
     "show": 1
    },
    {
     "say": "Forget attempts plus equals one, and attempts stays zero, so the loop never ends.",
     "show": 1
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
     "say": "What does enumerate() give you that a plain for loop doesn't?",
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
   "kind": "list",
   "art": "target",
   "kicker": "Why functions",
   "title": "One place to fix things",
   "items": [
    [
     "Calculate a discount",
     ""
    ],
    [
     "Validate an email",
     ""
    ],
    [
     "Send a welcome email",
     ""
    ]
   ],
   "beats": [
    {
     "say": "Any repeated job belongs in a function,",
     "show": 0
    },
    {
     "say": "like calculating a discount,",
     "show": 1
    },
    {
     "say": "checking an email address,",
     "show": 2
    },
    {
     "say": "or sending a welcome email.",
     "show": 3
    },
    {
     "say": "Then when something needs fixing, you fix it in one place, not in every copy.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab",
   "title": "Default values",
   "file": "Python",
   "code": "def calculate_discount(price, discount_percent=10):\n    discount_amount = price * (discount_percent / 100)\n    return price - discount_amount\n\nprint(calculate_discount(100))       # 90.0\nprint(calculate_discount(100, 25))   # 75.0",
   "beats": [
    {
     "say": "Here's calculate discount.",
     "show": 0
    },
    {
     "say": "Discount percent equals ten is a default. If you don't pass a discount, it uses ten percent.",
     "show": 1
    },
    {
     "say": "Calculate discount of a hundred gives ninety. Pass twenty five, and you get seventy five.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "chain",
   "kicker": "Lab",
   "title": "Functions that use functions",
   "steps": [
    "process_order",
    "validate_email",
    "calculate_discount",
    "Order confirmed"
   ],
   "beats": [
    {
     "say": "Real code combines small functions.",
     "show": 0
    },
    {
     "say": "Process order first calls validate email.",
     "show": 1
    },
    {
     "say": "If the email is valid, it calls calculate discount,",
     "show": 2
    },
    {
     "say": "and returns a confirmation message.",
     "show": 3
    },
    {
     "say": "Each piece is written and tested once, then reused.",
     "show": 3
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
   "kind": "code",
   "art": "shield",
   "kicker": "Lab",
   "title": "Catch a specific error",
   "file": "Python",
   "code": "def get_price_per_item(total_price, quantity):\n    try:\n        return total_price / quantity\n    except ZeroDivisionError:\n        print(\"Quantity cannot be zero\")\n        return None",
   "beats": [
    {
     "say": "Here's a function that divides a total price by a quantity.",
     "show": 0
    },
    {
     "say": "If the quantity is zero, Python raises a zero division error.",
     "show": 1
    },
    {
     "say": "The except block catches it, prints a friendly message, and returns None, instead of crashing.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "cross",
   "kicker": "Know your errors",
   "title": "Common errors and what causes them",
   "items": [
    [
     "ValueError",
     "int(\"abc\")"
    ],
    [
     "TypeError",
     "\"total: \" + 5"
    ],
    [
     "KeyError",
     "user[\"email\"] with no email"
    ],
    [
     "IndexError",
     "[10, 20, 30][5]"
    ],
    [
     "ZeroDivisionError",
     "100 / 0"
    ]
   ],
   "beats": [
    {
     "say": "It helps to know the common errors by name.",
     "show": 0
    },
    {
     "say": "A value error. The right type, but a value that can't work, like turning the word abc into a number.",
     "show": 1
    },
    {
     "say": "A type error. Mixing types that don't go together, like text plus a number.",
     "show": 2
    },
    {
     "say": "A key error. Asking a dictionary for a key it doesn't have.",
     "show": 3
    },
    {
     "say": "An index error. Asking a list for a position that doesn't exist.",
     "show": 4
    },
    {
     "say": "And a zero division error. Dividing by zero.",
     "show": 5
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab",
   "title": "finally always runs",
   "file": "Python",
   "code": "def process_payment(amount):\n    try:\n        if amount <= 0:\n            raise ValueError(\"Amount must be positive\")\n        print(f\"Processing ${amount}\")\n    except ValueError as e:\n        print(f\"Payment failed: {e}\")\n    finally:\n        print(\"Payment attempt logged\")",
   "beats": [
    {
     "say": "You can also raise your own errors, to enforce your rules.",
     "show": 0
    },
    {
     "say": "Process payment raises a value error if the amount isn't positive.",
     "show": 1
    },
    {
     "say": "And the finally block runs every time, success or failure. Perfect for logging or cleaning up.",
     "show": 1
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
     "say": "Why catch ZeroDivisionError specifically, not every error the same way?",
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
   "kind": "list",
   "art": "tree",
   "kicker": "Concept",
   "title": "Three words to know",
   "items": [
    [
     "Module",
     "One Python file"
    ],
    [
     "Package",
     "A folder of related modules"
    ],
    [
     "pip",
     "Installs packages others published"
    ]
   ],
   "beats": [
    {
     "say": "Three words.",
     "show": 0
    },
    {
     "say": "A module is a single Python file of reusable code.",
     "show": 1
    },
    {
     "say": "A package is a folder of related modules.",
     "show": 2
    },
    {
     "say": "And pip installs packages other people have published, so you don't reinvent solved problems.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "blocks",
   "kicker": "Lab · Built-in modules",
   "title": "Python comes with tools",
   "file": "Python",
   "code": "import math\nimport random\nfrom datetime import date\n\nprint(math.sqrt(16))                  # 4.0\nprint(random.choice([\"a\", \"b\", \"c\"]))\nprint(date.today())",
   "beats": [
    {
     "say": "Python ships with many modules built in.",
     "show": 0
    },
    {
     "say": "Math gives you square root. Random picks a random item. Date tells you today's date.",
     "show": 1
    },
    {
     "say": "You just import them and use them.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "package",
   "kicker": "Lab · Third-party packages",
   "title": "Install with pip",
   "file": "Terminal + Python",
   "code": "pip install requests\n\nimport requests\nresponse = requests.get(\"https://api.github.com\")\nprint(response.status_code)   # 200",
   "beats": [
    {
     "say": "For anything else, use pip.",
     "show": 0
    },
    {
     "say": "Pip install requests adds a popular package for talking to websites.",
     "show": 1
    },
    {
     "say": "Then three lines fetch GitHub's API and print two hundred, which means success.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "file",
   "kicker": "Lab · Your own module",
   "title": "Split your code into files",
   "steps": [
    "pricing.py",
    "from pricing import calculate_discount",
    "main.py uses it"
   ],
   "beats": [
    {
     "say": "Now make your own module.",
     "show": 0
    },
    {
     "say": "Put your pricing functions in a file called pricing dot p y.",
     "show": 1
    },
    {
     "say": "In main dot p y, write from pricing import calculate discount.",
     "show": 2
    },
    {
     "say": "Now main can use it, as long as both files are in the same folder.",
     "show": 3
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
   "kind": "list",
   "art": "boxes",
   "kicker": "Concept",
   "title": "The vocabulary",
   "items": [
    [
     "Class",
     "The blueprint"
    ],
    [
     "Object",
     "One thing made from it"
    ],
    [
     "Attributes and methods",
     "Its data, and what it can do"
    ],
    [
     "Encapsulation",
     "Data and logic together"
    ],
    [
     "Inheritance",
     "Build on another class"
    ]
   ],
   "beats": [
    {
     "say": "A class is a blueprint.",
     "show": 1
    },
    {
     "say": "An object is one thing made from that blueprint.",
     "show": 2
    },
    {
     "say": "Attributes are an object's data, and methods are what it can do.",
     "show": 3
    },
    {
     "say": "Encapsulation means keeping the data and the logic that uses it together.",
     "show": 4
    },
    {
     "say": "And inheritance means one class can build on another, reusing and extending it.",
     "show": 5
    }
   ]
  },
  {
   "kind": "code",
   "art": "checklist",
   "kicker": "Lab",
   "title": "A Task class",
   "file": "Python",
   "code": "class Task:\n    def __init__(self, title, priority=3):\n        self.title = title\n        self.priority = priority\n        self.done = False\n\n    def mark_complete(self):\n        self.done = True",
   "beats": [
    {
     "say": "Here's a task class.",
     "show": 0
    },
    {
     "say": "Init runs when you create a task. It stores the title and priority, and starts with done set to false.",
     "show": 1
    },
    {
     "say": "Self means this particular task.",
     "show": 1
    },
    {
     "say": "Mark complete sets done to true, and the str method controls how a task looks when you print it.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "tree",
   "kicker": "Lab · Inheritance",
   "title": "A more specific kind of task",
   "file": "Python",
   "code": "class RecurringTask(Task):\n    def __init__(self, title, priority=3, repeat_every_days=7):\n        super().__init__(title, priority)\n        self.repeat_every_days = repeat_every_days",
   "beats": [
    {
     "say": "Now inheritance. A recurring task is a task that comes back.",
     "show": 0
    },
    {
     "say": "It inherits everything from task. Super dot init reuses task's setup instead of rewriting it.",
     "show": 1
    },
    {
     "say": "It also changes mark complete to say when the task will reappear, while still using the original.",
     "show": 1
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
   "kind": "code",
   "art": "pencil",
   "kicker": "Lab · Write and read",
   "title": "Open files safely with with",
   "file": "Python",
   "code": "with open(\"tasks.txt\", \"w\") as f:\n    for task in tasks:\n        f.write(task + \"\\n\")\n\nwith open(\"tasks.txt\", \"r\") as f:\n    for line in f:\n        print(line.strip())",
   "beats": [
    {
     "say": "Use open together with with.",
     "show": 0
    },
    {
     "say": "With closes the file properly, even if something goes wrong halfway through.",
     "show": 1
    },
    {
     "say": "Write mode, w, writes each task on its own line. Read mode, r, reads them back.",
     "show": 1
    },
    {
     "say": "Strip removes the line break at the end of each line.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "warning",
   "kicker": "Careful",
   "title": "w erases, a adds",
   "items": [
    [
     "\"w\"",
     "Overwrite: erases existing content"
    ],
    [
     "\"a\"",
     "Append: adds to the end"
    ],
    [
     "\"r\"",
     "Read only"
    ]
   ],
   "beats": [
    {
     "say": "Be careful with modes.",
     "show": 0
    },
    {
     "say": "W, write, erases everything already in the file and starts fresh.",
     "show": 1
    },
    {
     "say": "A, append, adds to the end and keeps what's there.",
     "show": 2
    },
    {
     "say": "And r, read, only reads.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "doc",
   "kicker": "Lab · JSON",
   "title": "Save structured data",
   "file": "Python",
   "code": "import json\n\nuser_data = {\"name\": \"Alice\", \"tasks_completed\": 12}\nwith open(\"user.json\", \"w\") as f:\n    json.dump(user_data, f)\n\nwith open(\"user.json\", \"r\") as f:\n    print(json.load(f)[\"name\"])   # Alice",
   "beats": [
    {
     "say": "For structured data, use JSON.",
     "show": 0
    },
    {
     "say": "Json dump turns a Python dictionary into JSON text and saves it.",
     "show": 1
    },
    {
     "say": "Json load reads it back into a dictionary, so you can use it again. Here, it prints Alice.",
     "show": 1
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
     "say": "What happens if you open a file that already has content in \"w\" mode?",
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
