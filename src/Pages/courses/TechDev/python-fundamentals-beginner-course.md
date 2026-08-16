# Python Programming Fundamentals: A Practical Beginner's Course

## Course Overview

**Who this is for:** Complete beginners to programming, or anyone who has copied code before but wants to actually understand what it's doing.

**How the course works:** Nine modules. Every topic follows the same pattern:
- **Concept** - what it is, in plain language
- **Where you'd actually use this** - a real product scenario
- **Lab** - hands-on, runnable code
- **Checkpoint**
- **Quiz** - five questions with answers

**Tools needed:** Python 3.10+ installed, and a code editor (VS Code or similar).

---

## Module 0: Variables & Data Types

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

### Checkpoint
You ran the code above, saw each type printed correctly, and understand why `price_as_text + 5` would fail.

### Quiz
1. What determines a variable's data type in Python?
2. What's the difference between `int` and `float`?
3. Why would `"19.99" + 5` cause an error?
4. What does `None` represent that `0` or `""` don't?
5. Name a real value in an app that should be a `bool`.

*Answers: 1) The value assigned to it. 2) `int` is a whole number; `float` allows decimal points. 3) You can't directly combine text and a number with `+`, they're different types. 4) The explicit absence of a value, as opposed to a zero or empty value that still exists. 5) A user's "is logged in" or "is premium member" status (any valid example).*

---

## Module 1: Operators

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

### Checkpoint
You can predict the output of each print statement above before running it.

### Quiz
1. What does `//` do, differently from `/`?
2. What does `==` check, compared to `=`?
3. What does `and` require, compared to `or`?
4. What does `discount = cart_total * 0.10` calculate?
5. What is `login_count += 1` shorthand for?

*Answers: 1) `//` performs integer (floor) division, dropping any remainder; `/` gives a full decimal result. 2) `==` checks if two values are equal (returns `bool`); `=` assigns a value to a variable. 3) `and` requires both conditions to be true; `or` requires only one. 4) 10% of the cart total. 5) `login_count = login_count + 1`.*

---

## Module 2: Control Flow

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
print(get_shipping_cost(cart_total=30, is_premium_member=False))   # 5.00
print(get_shipping_cost(cart_total=10, is_premium_member=True))    # 0
print(get_shipping_cost(cart_total=10, is_premium_member=False))   # 9.99
```

### Checkpoint
You can trace through `get_shipping_cost` by hand for a new set of inputs and predict the correct output before running it.

### Quiz
1. What does `elif` let you avoid, compared to writing several separate `if` statements?
2. In the example, why does `is_premium_member` get checked first?
3. What happens if none of the `if`/`elif` conditions are true?
4. Could you reorder the conditions and still get identical behavior? Why or why not?
5. What would `get_shipping_cost(cart_total=50, is_premium_member=False)` return, and why?

*Answers: 1) Once one condition matches, the rest are skipped, avoiding unnecessary checks and clearer intent than multiple independent `if` statements. 2) Because it should override the cart-total-based rules entirely, checking order matters when conditions overlap. 3) The `else` block runs, as a fallback. 4) Not always safely, since conditions are checked in order and the first match wins, reordering could change which branch executes for the same input. 5) `0`, because `cart_total >= 50` is true.*

---

## Module 3: Loops

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
print(f"Total: {total}")   # 18.49

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

### Checkpoint
You can explain why the `while` loop stops after exactly 3 attempts, tracing through both conditions.

### Quiz
1. When would you reach for a `for` loop instead of a `while` loop?
2. What does `enumerate()` give you that a plain `for item in cart` doesn't?
3. What would happen if `max_attempts` were never incremented inside the `while` loop?
4. What does `total += item["price"]` accomplish across the whole loop?
5. Why does the `while` loop check both `attempts < max_attempts` and `not success`?

*Answers: 1) When you know you're iterating over a fixed collection or a known range, rather than an open-ended condition. 2) The index (position) of each item alongside the item itself. 3) An infinite loop, it would never stop since the condition would always stay true. 4) It accumulates the running sum of all item prices. 5) So it stops either when it runs out of attempts or as soon as it succeeds, whichever comes first.*

---

## Module 4: Functions

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

### Checkpoint
You can explain what a default parameter is and identify where `process_order` reuses the other two functions.

### Quiz
1. What's the benefit of putting repeated logic in a function instead of copying it everywhere?
2. What does `discount_percent=10` mean in the function definition?
3. What does a function return if you don't write a `return` statement?
4. Why does `process_order` call `validate_email` instead of rewriting that logic itself?
5. What would happen if you called `calculate_discount("100")` with a string instead of a number?

*Answers: 1) A single place to fix bugs or make changes, instead of updating every copy individually. 2) A default value used if the caller doesn't provide one. 3) `None`. 4) To reuse existing, already-tested logic rather than duplicating it, the core benefit of functions. 5) It would likely cause an error or unexpected behavior, since `"100" * (10 / 100)` doesn't behave like multiplying a number.*

---

## Module 5: Error Handling

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

### Checkpoint
You can explain the difference between what happens with and without a matching `except` block for the error that occurs.

### Quiz
1. What does `try`/`except` prevent from happening when an error occurs?
2. Why catch `ZeroDivisionError` specifically instead of catching every possible error the same way?
3. What does `finally` guarantee?
4. What does `raise ValueError("...")` do?
5. What would happen if `parse_age` had no `try`/`except` at all and received `"twenty"`?

*Answers: 1) The whole program crashing and stopping immediately. 2) Different errors often need different handling, catching everything the same way can hide bugs you actually needed to notice. 3) That block of code runs regardless of whether an error occurred or not. 4) Manually triggers an error with a custom message, useful for enforcing your own rules. 5) The program would crash with an unhandled `ValueError`, since `int("twenty")` isn't a valid conversion.*

---

## Module 6: Modules & Packages

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

### Checkpoint
You created your own two-file project, where `main.py` successfully imports and uses functions from `pricing.py`.

### Quiz
1. What's the difference between a module and a package?
2. What does `pip` let you do that the standard library alone doesn't?
3. Why organize related functions into their own module instead of one giant file?
4. What does `from pricing import calculate_discount` do, specifically?
5. Would `main.py` work if `pricing.py` weren't in the same folder (without further configuration)?

*Answers: 1) A module is a single file; a package is a folder of related modules. 2) Install third-party code other people have published, extending what's available beyond the built-in standard library. 3) Easier to find, maintain, and reuse code as a project grows, rather than scrolling through one massive file. 4) Imports only that specific function from the `pricing` module, rather than everything in it. 5) No, not without adjusting the import path, Python needs to know where to find the module.*

---

## Module 7: Object-Oriented Programming

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

### Checkpoint
You can explain what `self` refers to, and why `RecurringTask` doesn't need to redefine `__init__` from scratch.

### Quiz
1. What's the difference between a class and an object?
2. What does `self` represent inside a method?
3. What does `super().__init__(...)` do in `RecurringTask`?
4. Why does `RecurringTask` override `mark_complete` instead of leaving it unchanged?
5. What would `print(task1)` show without the `__str__` method defined?

*Answers: 1) A class is the blueprint/definition; an object is a specific instance created from that blueprint. 2) The specific object the method is being called on. 3) Calls the parent class's `__init__`, reusing its setup logic instead of duplicating it. 4) To add extra behavior specific to recurring tasks, while still reusing the base behavior via `super()`. 5) A default, unhelpful representation like `<__main__.Task object at 0x...>` instead of the readable custom string.*

---

## Module 8: File Handling

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

### Checkpoint
You created a text file and a JSON file, then successfully read both back and printed their contents.

### Quiz
1. What does the `with` statement guarantee, compared to calling `open()` directly?
2. What's the difference between `"w"` mode and `"a"` mode?
3. Why call `.strip()` when printing each line read from a file?
4. What does `json.dump()` do, compared to `f.write()` with a plain string?
5. What would happen if you opened a file in `"w"` mode that already had content in it?

*Answers: 1) The file is automatically closed properly, even if an error happens partway through, reducing the risk of corrupted or locked files. 2) `"w"` overwrites the file's existing contents; `"a"` adds new content to the end without erasing what's there. 3) Each line read from a file includes a trailing newline character, `.strip()` removes it for cleaner output. 4) It automatically converts a Python object (like a dictionary) into properly formatted JSON text, rather than you manually formatting it as a string. 5) The existing contents would be erased and replaced with the new content.*

---

## Capstone: A Small Program Using Every Concept

Build a command-line task tracker that touches all nine modules:

```python
import json
import os

TASKS_FILE = "tasks_data.json"

class Task:
    def __init__(self, title, priority=3):
        self.title = title
        self.priority = priority
        self.done = False

    def to_dict(self):
        return {"title": self.title, "priority": self.priority, "done": self.done}

def load_tasks():
    if not os.path.exists(TASKS_FILE):
        return []
    try:
        with open(TASKS_FILE, "r") as f:
            data = json.load(f)
            return [Task(t["title"], t["priority"]) for t in data]
    except json.JSONDecodeError:
        print("Task file was corrupted, starting fresh")
        return []

def save_tasks(tasks):
    with open(TASKS_FILE, "w") as f:
        json.dump([t.to_dict() for t in tasks], f)

def add_task(tasks, title, priority=3):
    if not title.strip():
        print("Task title cannot be empty")
        return
    tasks.append(Task(title, priority))
    print(f"Added: {title}")

def list_tasks(tasks):
    sorted_tasks = sorted(tasks, key=lambda t: t.priority)
    for i, task in enumerate(sorted_tasks):
        status = "done" if task.done else "pending"
        print(f"{i + 1}. [{status}] {task.title} (priority {task.priority})")

tasks = load_tasks()
add_task(tasks, "Write course notes", priority=1)
add_task(tasks, "Review PR", priority=2)
list_tasks(tasks)
save_tasks(tasks)
```

Every module shows up here: variables and types (task data), operators (priority comparisons), control flow (validation checks), loops (listing tasks), functions (each action), error handling (corrupted file recovery), modules (`json`, `os`), OOP (the `Task` class), and file handling (loading and saving).

### Course completion checklist
- [ ] Used at least five different data types correctly
- [ ] Combined comparison and logical operators in one condition
- [ ] Wrote a multi-branch `if`/`elif`/`else`
- [ ] Used both a `for` loop and a `while` loop in real logic
- [ ] Wrote a function with a default parameter
- [ ] Handled at least two different exception types
- [ ] Created your own module and imported it elsewhere
- [ ] Defined a class and a subclass using inheritance
- [ ] Read and wrote both a plain text file and a JSON file
- [ ] Built the capstone task tracker end-to-end

These nine topics are the vocabulary every other course in this series assumes you already have. Everything from here, databases, APIs, deployment, AI features, is built on top of these fundamentals.
