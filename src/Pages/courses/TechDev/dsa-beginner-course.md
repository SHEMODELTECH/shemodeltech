<!-- order: 11 -->
<!-- runnable: python -->
# Data Structures & Algorithms for Builders: A Practical Beginner's Course

## Course Overview

**By the end of this course, you'll be able to:**
- Describe how an operation's cost grows using Big O, and measure the difference with a timing test
- Choose between lists, dictionaries, sets, stacks, queues, and heaps based on the operations your feature needs
- Build a linked list and a binary search tree, and explain their trade-offs against Python's built-ins
- Write recursive functions for nested data, and use BFS to find the shortest path in a graph
- Sort data by one or more fields, and implement binary search on sorted data
- Speed up repeated calculations with memoization

**Who this is for:** Beginners who can write basic Python (variables, functions, loops) and want to understand data structures and algorithms not as interview trivia, but as tools you reach for when building real software.

**How the course works:** Twelve modules. Every topic follows the same pattern:
- **Concept** - what it is, in plain language
- **Code** - a working implementation
- **Where you'd actually use this** - a real product scenario, not a puzzle
- **Lab** - working code to run, then a short "Your turn" exercise to write yourself
- **Checkpoint**
- **Quiz** - five questions with answers

**Tools needed:** Python 3.12+, a code editor, and a terminal. If you completed She Model Tech's "Build Your First Product" course (Software Engineering Fundamentals, where you built TrackIt), you already have everything set up.

---

## Module 0: Why This Matters - Big O and How to Think About Speed

**Time: about 1 hour**

### Concept

Every data structure is a trade-off. None is "best" - each is optimized for certain operations at the cost of others. **Big O notation** describes how an operation's cost grows as your data grows. It's not about exact speed - it's about growth pattern.

| Notation | Meaning | Example |
|---|---|---|
| O(1) | Constant - same speed no matter the size | Looking up a dictionary key |
| O(log n) | Grows slowly as data grows | Binary search |
| O(n) | Grows in direct proportion to data | Scanning a list once |
| O(n log n) | Slightly worse than linear | Efficient sorting |
| O(n²) | Grows fast - doubles data, quadruples time | Comparing every pair in a list |

### Where you'd actually use this

If your app has 100 users, an O(n²) operation might feel instant. At 100,000 users, the exact same code could take minutes instead of milliseconds. This is the single most common reason apps that "worked fine in testing" fall over in production.

### Lab

Time two approaches to the same problem - checking if a list has duplicates:

```python
import time

def has_duplicates_slow(items):
    # O(n^2): compares every pair
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j]:
                return True
    return False

def has_duplicates_fast(items):
    # O(n): uses a set for instant lookups
    seen = set()
    for item in items:
        if item in seen:
            return True
        seen.add(item)
    return False

data = list(range(5000)) + [4999]  # 5001 items, one duplicate

start = time.time()
has_duplicates_slow(data)
print("Slow:", time.time() - start)

start = time.time()
has_duplicates_fast(data)
print("Fast:", time.time() - start)
```
Run it and compare the two times. The gap will surprise you.

**Your turn:** Change `data` to `list(range(10000)) + [9999]` and run it again. The slow time should grow about 4 times (O(n²)), while the fast time only about doubles (O(n)).

### Checkpoint
You ran the timing comparison and can explain, in your own words, why the fast version wins.

### Quiz
1. What does Big O actually measure?
2. Is O(n) always slower than O(1) in absolute terms?
3. Why might an O(n²) function feel fine during development but fail in production?
4. What's the growth difference between O(n) and O(n²) as data doubles?
5. Why does `has_duplicates_fast` avoid the nested loop?

*Answers: 1) How an algorithm's cost grows as input size grows, not the exact runtime. 2) Not necessarily for small inputs - but as data grows, O(1) wins. 3) Test data is often small; the cost only becomes visible at real-world scale. 4) O(n) roughly doubles; O(n²) roughly quadruples. 5) It uses a set for instant membership checks instead of comparing every pair.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "growth",
   "kicker": "Module 0 · Big O",
   "title": "How to think about speed",
   "beats": [
    {
     "say": "Welcome to Data Structures and Algorithms for Builders."
    },
    {
     "say": "Every data structure is a trade-off. None is best. Each is fast at some things and slow at others."
    }
   ]
  },
  {
   "kind": "list",
   "art": "trend",
   "kicker": "Concept",
   "title": "Big O describes growth",
   "items": [
    [
     "O(1)",
     "Constant: dictionary lookup"
    ],
    [
     "O(log n)",
     "Slow growth: binary search"
    ],
    [
     "O(n)",
     "In step: scan a list"
    ],
    [
     "O(n log n)",
     "Efficient sorting"
    ],
    [
     "O(n²)",
     "Every pair: double data, 4× time"
    ]
   ],
   "beats": [
    {
     "say": "Big O describes how an operation's cost grows as your data grows. Not the exact speed, the pattern.",
     "show": 0
    },
    {
     "say": "O of one: the same speed at any size.",
     "show": 1
    },
    {
     "say": "O of log n: grows slowly.",
     "show": 2
    },
    {
     "say": "O of n: grows in step with the data.",
     "show": 3
    },
    {
     "say": "O of n log n: a little worse, like efficient sorting.",
     "show": 4
    },
    {
     "say": "And O of n squared: double the data, four times the time.",
     "show": 5
    }
   ]
  },
  {
   "kind": "quote",
   "art": "warning",
   "kicker": "Why it matters",
   "title": "Fine in testing, broken in production",
   "quote": "100 users: instant. 100,000 users: minutes.",
   "beats": [
    {
     "say": "With a hundred users, an n squared operation feels instant.",
     "show": 0
    },
    {
     "say": "With a hundred thousand, the same code can take minutes.",
     "show": 1
    },
    {
     "say": "It's the most common reason apps that worked in testing fall over in production.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "stopwatch",
   "kicker": "Lab",
   "title": "Time it yourself",
   "items": [
    [
     "Compare every pair",
     "O(n²)"
    ],
    [
     "Remember with a set",
     "O(n)"
    ]
   ],
   "beats": [
    {
     "say": "In the lab, you time two ways to find a duplicate.",
     "show": 0
    },
    {
     "say": "The slow way compares every pair. That's n squared.",
     "show": 1
    },
    {
     "say": "The fast way remembers what it's seen in a set. That's n.",
     "show": 2
    },
    {
     "say": "Double the data, and the slow one takes about four times longer. The fast one, about twice.",
     "show": 2
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "As data doubles, what happens to an O(n²) operation?",
   "options": [
    "It roughly doubles",
    "It roughly quadruples",
    "It stays the same"
   ],
   "answer": 1,
   "good": "That's right. O of n squared roughly quadruples when the data doubles.",
   "bad": "Not quite. O of n squared roughly quadruples when the data doubles.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "As data doubles, what happens to an O(n²) operation?",
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
     "You can explain why the set version wins",
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
     "say": "you've run the timing comparison and can explain why the fast version wins.",
     "show": 1
    },
    {
     "say": "Next, arrays and strings.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 1: Arrays & Strings - The Structures You Already Use

**Time: about 1 hour**

### Concept

An **array** (Python's `list`) stores items in order, each accessible instantly by position (index). Strings behave similarly - a sequence of characters.

Key operations and their costs:
- Access by index: O(1)
- Search for a value: O(n)
- Insert/remove at the end: O(1)
- Insert/remove at the start or middle: O(n) - everything after has to shift

### Where you'd actually use this

A product's activity feed, a shopping cart, a list of search results - anything ordered and iterated over sequentially is an array. Knowing that inserting at the *front* is expensive is why systems that need fast inserts at both ends use a different structure (see Module 5: deques).

### Lab

```python
# A shopping cart using array operations
cart = []

def add_item(cart, item):
    cart.append(item)          # O(1)

def remove_item(cart, item):
    if item in cart:           # O(n) search
        cart.remove(item)      # O(n) removal

add_item(cart, "Book")
add_item(cart, "Pen")
add_item(cart, "Notebook")
remove_item(cart, "Pen")
print(cart)  # ["Book", "Notebook"]
```

Now try a string problem - check if a string is a palindrome:
```python
def is_palindrome(s: str) -> bool:
    cleaned = s.lower().replace(" ", "")
    return cleaned == cleaned[::-1]

print(is_palindrome("racecar"))       # True
print(is_palindrome("hello world"))   # False
```

**Your turn:** Write `move_to_front(cart, item)` that removes `item` and inserts it at position 0 with `cart.insert(0, item)`. Next to each line, write its Big O cost as a comment.

### Checkpoint
You can explain why appending to a list is fast but inserting at position 0 is slow.

### Quiz
1. What is the cost of accessing `my_list[500]` directly?
2. Why is removing an item from the front of a list slower than removing from the end?
3. What real product feature is naturally an array?
4. What does `cleaned[::-1]` do?
5. Why check `item in cart` before calling `.remove()`?

*Answers: 1) O(1) - instant, regardless of list size. 2) Every remaining item has to shift over by one position. 3) An ordered feed, list, or history (many valid answers). 4) Reverses the string. 5) To avoid an error if the item isn't in the cart at all.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "array",
   "kicker": "Module 1 · Arrays and strings",
   "title": "The structures you already use",
   "beats": [
    {
     "say": "Welcome to Module 1."
    },
    {
     "say": "An array, Python's list, keeps items in order, each reachable instantly by position."
    }
   ]
  },
  {
   "kind": "list",
   "art": "gauge",
   "kicker": "Concept",
   "title": "What's fast, what's slow",
   "items": [
    [
     "By index",
     "O(1)"
    ],
    [
     "Search for a value",
     "O(n)"
    ],
    [
     "Add/remove at the end",
     "O(1)"
    ],
    [
     "At the start or middle",
     "O(n): items shift"
    ]
   ],
   "beats": [
    {
     "say": "Here are the costs.",
     "show": 0
    },
    {
     "say": "Getting an item by position: O of one.",
     "show": 1
    },
    {
     "say": "Searching for a value: O of n.",
     "show": 2
    },
    {
     "say": "Adding or removing at the end: O of one.",
     "show": 3
    },
    {
     "say": "At the start or middle: O of n, because everything after it has to shift.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab",
   "title": "A shopping cart, and a palindrome",
   "file": "Python",
   "code": "def add_item(cart, item):\n    cart.append(item)          # O(1)\n\ndef remove_item(cart, item):\n    if item in cart:           # O(n) search\n        cart.remove(item)      # O(n) removal\n\ndef is_palindrome(s):\n    cleaned = s.lower().replace(\" \", \"\")\n    return cleaned == cleaned[::-1]",
   "beats": [
    {
     "say": "Append adds to the cart instantly.",
     "show": 0
    },
    {
     "say": "Removing an item first searches for it, then shifts everything after it. Both are O of n.",
     "show": 1
    },
    {
     "say": "And a palindrome check: lower-case it, remove spaces, and compare with its reverse.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why is removing from the front of a list slow?",
   "options": [
    "Python checks it twice",
    "Every remaining item has to shift over",
    "The front is stored on disk"
   ],
   "answer": 1,
   "good": "That's right. Every remaining item has to shift over by one position.",
   "bad": "Not quite. Every remaining item has to shift over by one position.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why is removing from the front of a list slow?",
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
     "You can explain append vs insert at 0",
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
     "say": "you can explain why appending is fast but inserting at position zero is slow.",
     "show": 1
    },
    {
     "say": "Next, hash maps.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 2: Hash Maps - The Structure Behind Fast Lookups

**Time: about 1 hour**

### Concept

A **hash map** (Python's `dict`) stores key-value pairs and gives near-instant O(1) lookup, insert, and delete by key, regardless of size. It does this by converting each key into a number (a hash) that tells it exactly where to store the value.

### Where you'd actually use this

Any time you need to answer "does X exist?" or "what value is associated with X?" quickly - a user database keyed by email, a cache, counting word frequency, deduplicating data. This is arguably the single most-used data structure in real backend systems.

### Lab

```python
# Counting word frequency in a piece of text (a common real task: analytics, search)
def word_frequency(text: str) -> dict:
    counts = {}
    for word in text.lower().split():
        counts[word] = counts.get(word, 0) + 1
    return counts

text = "the cat sat on the mat the cat ran"
print(word_frequency(text))
# {'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1, 'ran': 1}
```

```python
# Looking up a user by email in O(1) instead of scanning a list in O(n)
users_by_email = {
    "alice@example.com": {"id": 1, "name": "Alice"},
    "bob@example.com": {"id": 2, "name": "Bob"},
}

def find_user(email: str):
    return users_by_email.get(email)  # O(1), not O(n)

print(find_user("bob@example.com"))
```

**Your turn:** Write `most_common_word(text)` that uses `word_frequency` and returns the word with the highest count (hint: `max(counts, key=counts.get)`). For the sample text it should return `"the"`.

### Checkpoint
You can explain why looking up a user in a dictionary is faster than looping through a list of users checking each email.

### Quiz
1. What does a hash map trade extra memory for?
2. Why is `users_by_email.get(email)` faster than looping through a list of user objects?
3. What happens if you use `counts[word] += 1` instead of `.get(word, 0)` on a new word?
4. Name two real product features that rely on hash maps.
5. Is dictionary order guaranteed in modern Python?

*Answers: 1) Speed - O(1) lookups at the cost of using more memory than a plain list. 2) The dictionary jumps directly to the value via the hashed key instead of checking every item one by one. 3) It would raise a `KeyError` because the key doesn't exist yet. 4) User lookup by email/username, caching, deduplication, counting/analytics (any two). 5) Yes. Since Python 3.7, the language guarantees that dictionaries keep keys in the order they were inserted.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "hash",
   "kicker": "Module 2 · Hash maps",
   "title": "The secret behind fast lookups",
   "beats": [
    {
     "say": "Welcome to Module 2."
    },
    {
     "say": "A hash map, Python's dict, stores key and value pairs, and finds any key almost instantly, whatever its size."
    },
    {
     "say": "It turns each key into a number, a hash, that says exactly where the value lives."
    }
   ]
  },
  {
   "kind": "list",
   "art": "key",
   "kicker": "Where you'd use this",
   "title": "Arguably the most-used structure",
   "items": [
    [
     "User by email",
     ""
    ],
    [
     "Caching",
     ""
    ],
    [
     "Counting",
     ""
    ],
    [
     "Deduplicating",
     ""
    ]
   ],
   "beats": [
    {
     "say": "It's arguably the most used structure in real backends.",
     "show": 0
    },
    {
     "say": "Looking up a user by email,",
     "show": 1
    },
    {
     "say": "caching,",
     "show": 2
    },
    {
     "say": "counting things, like word frequency,",
     "show": 3
    },
    {
     "say": "and removing duplicates.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "calc",
   "kicker": "Lab",
   "title": "Count words",
   "file": "Python",
   "code": "def word_frequency(text):\n    counts = {}\n    for word in text.lower().split():\n        counts[word] = counts.get(word, 0) + 1\n    return counts",
   "beats": [
    {
     "say": "To count words, loop through them.",
     "show": 0
    },
    {
     "say": "Counts dot get, word, zero, returns the current count, or zero if the word is new. Then add one.",
     "show": 1
    },
    {
     "say": "In the sample sentence, the appears three times.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "idcard",
   "kicker": "Lab",
   "title": "Find a user instantly",
   "file": "Python",
   "code": "users_by_email = {\n    \"alice@example.com\": {\"id\": 1, \"name\": \"Alice\"},\n    \"bob@example.com\": {\"id\": 2, \"name\": \"Bob\"},\n}\n\nusers_by_email.get(\"bob@example.com\")   # O(1)",
   "beats": [
    {
     "say": "And to find a user by email, look up the key.",
     "show": 0
    },
    {
     "say": "That's O of one. A list would have to check every user, one by one.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What happens with counts[word] += 1 on a word that isn't there yet?",
   "options": [
    "It starts at 1",
    "It raises a KeyError",
    "It's ignored"
   ],
   "answer": 1,
   "good": "That's right. It raises a key error, because the key doesn't exist yet. That's why get with a default helps.",
   "bad": "Not quite. It raises a key error, because the key doesn't exist yet. That's why get with a default helps.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What happens with counts[word] += 1 on a word that isn't there yet?",
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
     "You can explain dict lookup vs looping",
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
     "say": "you can explain why a dictionary lookup beats looping through a list.",
     "show": 1
    },
    {
     "say": "Next, sets.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 3: Sets - Fast Membership and Uniqueness

**Time: about 1 hour**

### Concept

A **set** stores unique, unordered values, with no duplicates allowed. Like a dictionary, it's built on hashing, so checking "is this value in the set?" is O(1), the same speed no matter how large the set gets. Sets also give you fast mathematical operations: union (combine), intersection (overlap), and difference (what's in one but not the other).

### Where you'd actually use this

Deduplicating a list of emails before sending a campaign, checking if a user has already performed an action ("has this user already voted?"), finding shared interests between two users (intersection), or filtering out already-processed IDs in a pipeline. Any time the question is "have I seen this before?" or "what do these two groups have in common?", a set is the right tool.

### Lab

```python
# Deduplicating email addresses before a send
raw_emails = ["a@x.com", "b@x.com", "a@x.com", "c@x.com", "b@x.com"]
unique_emails = set(raw_emails)
print(unique_emails)          # {'a@x.com', 'b@x.com', 'c@x.com'} (order may vary)
print(len(unique_emails))     # 3, duplicates removed automatically
```

```python
# Fast "have I seen this before?" checks
processed_order_ids = set()

def process_order(order_id):
    if order_id in processed_order_ids:   # O(1) check, not O(n)
        print(f"Order {order_id} already processed, skipping")
        return
    processed_order_ids.add(order_id)
    print(f"Processing order {order_id}")

process_order(101)
process_order(102)
process_order(101)   # skipped
```

```python
# Set operations: shared interests between two users
alice_interests = {"hiking", "coding", "reading", "chess"}
bob_interests = {"chess", "gaming", "coding", "cooking"}

shared = alice_interests & bob_interests          # intersection
only_alice = alice_interests - bob_interests      # difference
everyone = alice_interests | bob_interests         # union

print("Shared:", shared)          # {'chess', 'coding'} (sets print in any order)
print("Only Alice:", only_alice)  # {'hiking', 'reading'}
print("Everyone:", everyone)      # union of both sets
```

**Your turn:** Write `new_subscribers(old_list, new_list)` that returns the emails in `new_list` that weren't in `old_list`, using one set operation. Test it with two short lists.

### Checkpoint
You can explain why `order_id in processed_order_ids` stays fast even as the set grows to a million entries, and you've used at least one set operation (`&`, `-`, or `|`).

### Quiz
1. What's the main difference between a set and a list?
2. Why is checking membership in a set O(1) instead of O(n)?
3. What does `&` do when used between two sets?
4. Why would deduplicating a list with `set()` be faster than checking for duplicates manually with a loop?
5. Name a real feature where "has this user already done X?" logic would use a set.

*Answers: 1) A set stores only unique values with no guaranteed order; a list allows duplicates and preserves order. 2) It uses the same hashing approach as a dictionary, jumping directly to where a value would be rather than scanning everything. 3) Returns the intersection, the values present in both sets. 4) Because `set()` uses O(1) hashing internally instead of comparing every item against every other item. 5) Rate-limiting, "already voted" checks, deduplicating processed webhook or order IDs (any valid example).*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "funnel",
   "kicker": "Module 3 · Sets",
   "title": "Fast membership and uniqueness",
   "beats": [
    {
     "say": "Welcome to Module 3."
    },
    {
     "say": "A set stores unique values, with no duplicates and no order. Checking whether something is in it is O of one."
    }
   ]
  },
  {
   "kind": "list",
   "art": "search",
   "kicker": "Where you'd use this",
   "title": "Have I seen this before?",
   "items": [
    [
     "Deduplicate emails",
     ""
    ],
    [
     "Already voted?",
     ""
    ],
    [
     "Skip processed orders",
     ""
    ]
   ],
   "beats": [
    {
     "say": "Use a set whenever the question is, have I seen this before?",
     "show": 0
    },
    {
     "say": "Removing duplicate emails before a send,",
     "show": 1
    },
    {
     "say": "checking whether someone has already voted,",
     "show": 2
    },
    {
     "say": "or skipping orders you've already processed.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "checklist",
   "kicker": "Lab",
   "title": "Skip what's already done",
   "file": "Python",
   "code": "processed_order_ids = set()\n\ndef process_order(order_id):\n    if order_id in processed_order_ids:   # O(1)\n        print(f\"Order {order_id} already processed\")\n        return\n    processed_order_ids.add(order_id)",
   "beats": [
    {
     "say": "Here, processed order I Ds live in a set.",
     "show": 0
    },
    {
     "say": "If an order is already in it, skip it. Otherwise, add it and process it.",
     "show": 1
    },
    {
     "say": "That check stays fast, even with a million orders.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "venn",
   "kicker": "Lab",
   "title": "Set operations",
   "items": [
    [
     "a & b",
     "Intersection: in both"
    ],
    [
     "a - b",
     "Difference: only in a"
    ],
    [
     "a | b",
     "Union: in either"
    ]
   ],
   "beats": [
    {
     "say": "Sets also combine quickly.",
     "show": 0
    },
    {
     "say": "The ampersand gives the intersection: interests Alice and Bob share.",
     "show": 1
    },
    {
     "say": "Minus gives the difference: Alice's only.",
     "show": 2
    },
    {
     "say": "And the bar gives the union: everyone's.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does & do between two sets?",
   "options": [
    "Joins them into one",
    "Returns values in both",
    "Removes duplicates"
   ],
   "answer": 1,
   "good": "That's right. It returns the intersection: the values present in both sets.",
   "bad": "Not quite. It returns the intersection: the values present in both sets.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does & do between two sets?",
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
     "You can explain why set lookups stay fast",
     ""
    ],
    [
     "You used a set operation",
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
     "say": "you can explain why set membership stays fast at any size,",
     "show": 1
    },
    {
     "say": "and you've used at least one set operation.",
     "show": 2
    },
    {
     "say": "Next, linked lists.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 4: Linked Lists - When Order Matters More Than Instant Access

**Time: about 2 hours**

### Concept

A **linked list** stores items as a chain of nodes, each pointing to the next. Unlike arrays, you can't jump to item #500 instantly - you must walk the chain. But inserting or removing a node once you're there is O(1), since you're just changing pointers, not shifting memory.

### Where you'd actually use this

Undo/redo history, a music playlist where songs get reordered often, or the internal structure behind more complex tools (browser history is a real-world "doubly linked list" example - back and forward). In practice, you'll use built-in structures like `list` or `deque` far more often than building linked lists by hand - but understanding them explains *why* those built-ins behave the way they do.

### Lab

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def add_front(self, value):
        new_node = Node(value)
        new_node.next = self.head
        self.head = new_node        # O(1) - no shifting required

    def to_list(self):
        result = []
        current = self.head
        while current:
            result.append(current.value)
            current = current.next
        return result

playlist = LinkedList()
playlist.add_front("Song C")
playlist.add_front("Song B")
playlist.add_front("Song A")
print(playlist.to_list())  # ["Song A", "Song B", "Song C"]
```

**Your turn:** Add a `contains(self, value)` method to `LinkedList` that walks the chain and returns `True` or `False`. What is its Big O cost, and why?

### Checkpoint
You can explain why `add_front` is O(1) for a linked list but O(n) for a Python list.

### Quiz
1. What's the main trade-off of a linked list compared to an array?
2. Why is inserting at the front O(1) for a linked list?
3. What real feature resembles a linked list (chain of connected items)?
4. Can you access the 100th item of a linked list in O(1)? Why or why not?
5. What does `current = current.next` do in `to_list`?

*Answers: 1) You lose instant indexed access, but gain fast insert/delete at known positions. 2) You only update a couple of pointers, no shifting of other elements. 3) Undo/redo history, browser back/forward (either is valid). 4) No - you must walk from the head, node by node, which is O(n). 5) Moves to the next node in the chain, one step at a time.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "chain",
   "kicker": "Module 4 · Linked lists",
   "title": "When order matters more than instant access",
   "beats": [
    {
     "say": "Welcome to Module 4."
    },
    {
     "say": "A linked list stores items as a chain of nodes, each pointing to the next."
    }
   ]
  },
  {
   "kind": "list",
   "art": "scales",
   "kicker": "Concept",
   "title": "The trade-off",
   "items": [
    [
     "Reach an item",
     "O(n): walk the chain"
    ],
    [
     "Insert or remove there",
     "O(1): change pointers"
    ]
   ],
   "beats": [
    {
     "say": "The trade-off.",
     "show": 0
    },
    {
     "say": "You can't jump to item five hundred. You have to walk the chain, which is O of n.",
     "show": 1
    },
    {
     "say": "But once you're there, inserting or removing is O of one. You just change pointers, nothing shifts.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab",
   "title": "Add to the front",
   "file": "Python",
   "code": "class Node:\n    def __init__(self, value):\n        self.value = value\n        self.next = None\n\ndef add_front(self, value):\n    new_node = Node(value)\n    new_node.next = self.head\n    self.head = new_node        # O(1)",
   "beats": [
    {
     "say": "Add front makes a new node, points it at the current head, and makes it the new head.",
     "show": 0
    },
    {
     "say": "That's O of one. A Python list would have to shift everything along.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "browser",
   "kicker": "Where you'd use this",
   "title": "Chains in real products",
   "items": [
    [
     "Undo / redo",
     ""
    ],
    [
     "Playlists",
     ""
    ],
    [
     "Back and forward",
     ""
    ]
   ],
   "beats": [
    {
     "say": "Real examples look like chains.",
     "show": 0
    },
    {
     "say": "Undo and redo history.",
     "show": 1
    },
    {
     "say": "A playlist you reorder often.",
     "show": 2
    },
    {
     "say": "A browser's back and forward.",
     "show": 3
    },
    {
     "say": "In practice you'll mostly use built-ins, but this explains why they behave the way they do.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Can you reach the 100th item of a linked list in O(1)?",
   "options": [
    "Yes, by index",
    "No, you walk from the head, so it's O(n)",
    "Only if it's sorted"
   ],
   "answer": 1,
   "good": "That's right. You have to walk from the head, node by node, which is O of n.",
   "bad": "Not quite. You have to walk from the head, node by node, which is O of n.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Can you reach the 100th item of a linked list in O(1)?",
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
     "You can explain add_front: linked list vs list",
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
     "say": "you can explain why adding to the front is O of one for a linked list, but O of n for a list.",
     "show": 1
    },
    {
     "say": "Next, stacks and queues.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 5: Stacks & Queues - Order of Operations

**Time: about 1 hour**

### Concept

A **stack** is Last-In-First-Out (LIFO) - think a stack of plates, you take from the top. A **queue** is First-In-First-Out (FIFO) - think a checkout line, first person in line is served first.

Python's `list` works fine as a stack (`.append()` / `.pop()`). For a queue, use `collections.deque`, which gives O(1) operations at both ends - a plain list is O(n) for removing from the front.

### Where you'd actually use this

**Stack:** undo functionality, tracking nested function calls, checking balanced parentheses in code editors.
**Queue:** a print job queue, background task processing (e.g., "send email" jobs waiting to be processed in order), customer support ticket handling.

### Lab

```python
# Stack: undo functionality
class UndoStack:
    def __init__(self):
        self._actions = []

    def do(self, action):
        self._actions.append(action)   # O(1)

    def undo(self):
        if self._actions:
            return self._actions.pop()  # O(1) - removes and returns the last action
        return None

undo = UndoStack()
undo.do("typed 'hello'")
undo.do("typed ' world'")
print(undo.undo())  # "typed ' world'" - the most recent action, undone first
```

```python
from collections import deque

# Queue: background job processing (e.g., sending emails in order)
job_queue = deque()

def enqueue_job(job):
    job_queue.append(job)        # O(1) - add to the back

def process_next_job():
    if job_queue:
        return job_queue.popleft()  # O(1) - remove from the front
    return None

enqueue_job("send welcome email to Alice")
enqueue_job("send welcome email to Bob")
print(process_next_job())  # Alice's email is processed first - it was queued first
```

**Your turn:** Write `is_balanced(text)` that uses a list as a stack to check whether brackets `(` and `)` are balanced: push on `(`, pop on `)`, and return `False` if you try to pop from an empty stack. At the end, the text is balanced only if the stack is empty. `"(a(b)c)"` should give `True`; `"(()"` and `")("` should give `False`.

### Checkpoint
You can explain, without looking back, why undo uses a stack and background jobs use a queue.

### Quiz
1. What does LIFO stand for, and what real object works that way?
2. What does FIFO stand for, and what real object works that way?
3. Why use `deque` instead of a plain list for a queue?
4. In the undo example, why does `.pop()` (not `.pop(0)`) give the correct "most recent" action?
5. Name one real backend feature that's a queue.

*Answers: 1) Last-In-First-Out; a stack of plates. 2) First-In-First-Out; a checkout line. 3) `deque.popleft()` is O(1); a plain list's `.pop(0)` is O(n) because everything shifts. 4) `.pop()` removes the last item added, which is exactly the most recent action. 5) Background job/task processing, email sending queues, print queues (any valid example).*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "stack",
   "kicker": "Module 5 · Stacks and queues",
   "title": "Order of operations",
   "beats": [
    {
     "say": "Welcome to Module 5."
    }
   ]
  },
  {
   "kind": "list",
   "art": "venn",
   "kicker": "Concept",
   "title": "Last in, or first in?",
   "items": [
    [
     "Stack (LIFO)",
     "Plates: take from the top"
    ],
    [
     "Queue (FIFO)",
     "A line: first come, first served"
    ]
   ],
   "beats": [
    {
     "say": "A stack is last in, first out, like a stack of plates. You take from the top.",
     "show": 1
    },
    {
     "say": "A queue is first in, first out, like a checkout line.",
     "show": 2
    },
    {
     "say": "A Python list works well as a stack. For a queue, use deque, which is fast at both ends.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "pencil",
   "kicker": "Lab · Stack",
   "title": "Undo",
   "file": "Python",
   "code": "class UndoStack:\n    def __init__(self):\n        self._actions = []\n\n    def do(self, action):\n        self._actions.append(action)   # O(1)\n\n    def undo(self):\n        if self._actions:\n            return self._actions.pop()  # O(1), the most recent",
   "beats": [
    {
     "say": "Undo is a stack.",
     "show": 0
    },
    {
     "say": "Do appends an action. Undo pops the last one, so the most recent action is undone first.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "pipeline",
   "kicker": "Lab · Queue",
   "title": "Background jobs",
   "file": "Python",
   "code": "from collections import deque\n\njob_queue = deque()\njob_queue.append(\"send welcome email to Alice\")\njob_queue.append(\"send welcome email to Bob\")\n\njob_queue.popleft()   # Alice first: O(1)",
   "beats": [
    {
     "say": "Background jobs are a queue.",
     "show": 0
    },
    {
     "say": "Append adds a job at the back. Pop left takes the next from the front, so Alice's email, queued first, goes first.",
     "show": 1
    },
    {
     "say": "Both are O of one with deque. A plain list's pop zero is O of n.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why use deque instead of a list for a queue?",
   "options": [
    "deque uses less memory",
    "popleft is O(1), but a list's pop(0) is O(n)",
    "Lists can't hold strings"
   ],
   "answer": 1,
   "good": "That's right. Deque's pop left is O of one, while a list's pop zero shifts everything, which is O of n.",
   "bad": "Not quite. Deque's pop left is O of one, while a list's pop zero shifts everything, which is O of n.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why use deque instead of a list for a queue?",
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
     "You can explain stack vs queue uses",
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
     "say": "you can explain why undo uses a stack and background jobs use a queue.",
     "show": 1
    },
    {
     "say": "Next, recursion.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 6: Recursion - Functions That Call Themselves

**Time: about 2 hours**

### Concept

**Recursion** is when a function solves a problem by calling itself on a smaller version of the same problem, until it reaches a **base case** simple enough to answer directly. Every recursive function needs: (1) a base case that stops it, and (2) a step that moves toward that base case.

### Where you'd actually use this

Navigating nested data - a file system with folders inside folders, a comment thread with replies to replies, a category tree in an e-commerce site (Electronics > Phones > Accessories). These naturally nested structures are awkward to handle with plain loops but natural with recursion.

### Lab

```python
# Sum all numbers in a nested list structure - e.g., nested category totals
def deep_sum(data):
    total = 0
    for item in data:
        if isinstance(item, list):
            total += deep_sum(item)     # recursive call on the smaller piece
        else:
            total += item               # base case: a plain number
    return total

nested = [1, [2, 3, [4, 5]], 6, [7]]
print(deep_sum(nested))  # 28
```

```python
# Real example: counting all files inside a nested folder structure
def count_files(folder):
    count = 0
    for item in folder["items"]:
        if item["type"] == "file":
            count += 1                       # base case
        elif item["type"] == "folder":
            count += count_files(item)       # recursive step
    return count

file_system = {
    "items": [
        {"type": "file"},
        {"type": "folder", "items": [{"type": "file"}, {"type": "file"}]},
    ]
}
print(count_files(file_system))  # 3
```

**Your turn:** Write `count_comments(comment)` for a thread where each comment is a dictionary like `{"text": "Hi", "replies": [...]}`, and replies can have their own replies. Return the total number of comments, including the top one.

### Checkpoint
You can identify the base case and recursive step in both examples above without re-reading them.

### Quiz
1. What are the two required parts of any recursive function?
2. What happens if a recursive function has no base case?
3. Why is recursion a natural fit for nested folder structures?
4. In `deep_sum`, what triggers the recursive call versus the base case?
5. Could you solve `deep_sum` with loops alone? Why might recursion be cleaner here?

*Answers: 1) A base case that stops the recursion, and a step that moves toward it. 2) It calls itself forever (or until it crashes with a stack overflow / max recursion depth error). 3) Folders can contain folders arbitrarily deep, and recursion naturally mirrors that nested structure. 4) Encountering a nested list triggers recursion; encountering a plain number is the base case. 5) Yes, with a manual stack - but recursion mirrors the nested structure directly, making the code shorter and easier to reason about.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "loop",
   "kicker": "Module 6 · Recursion",
   "title": "Functions that call themselves",
   "beats": [
    {
     "say": "Welcome to Module 6."
    },
    {
     "say": "Recursion solves a problem by calling itself on a smaller version of the same problem."
    }
   ]
  },
  {
   "kind": "list",
   "art": "fork",
   "kicker": "Concept",
   "title": "Two parts, always",
   "items": [
    [
     "Base case",
     "Answer directly, and stop"
    ],
    [
     "Recursive step",
     "Move toward the base case"
    ]
   ],
   "beats": [
    {
     "say": "Every recursive function needs two parts.",
     "show": 0
    },
    {
     "say": "A base case simple enough to answer directly, which stops it.",
     "show": 1
    },
    {
     "say": "And a step that moves toward that base case.",
     "show": 2
    },
    {
     "say": "Without a base case, it calls itself until it crashes.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab",
   "title": "Add up nested lists",
   "file": "Python",
   "code": "def deep_sum(data):\n    total = 0\n    for item in data:\n        if isinstance(item, list):\n            total += deep_sum(item)   # recursive step\n        else:\n            total += item             # base case\n    return total\n\ndeep_sum([1, [2, 3, [4, 5]], 6, [7]])   # 28",
   "beats": [
    {
     "say": "Deep sum adds every number in nested lists.",
     "show": 0
    },
    {
     "say": "If an item is a list, call deep sum on it. That's the recursive step.",
     "show": 1
    },
    {
     "say": "If it's a number, add it. That's the base case. The answer is twenty eight.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "tree",
   "kicker": "Where you'd use this",
   "title": "Anything nested",
   "items": [
    [
     "Folders in folders",
     ""
    ],
    [
     "Replies to replies",
     ""
    ],
    [
     "Category trees",
     ""
    ]
   ],
   "beats": [
    {
     "say": "Recursion fits naturally nested things.",
     "show": 0
    },
    {
     "say": "Folders inside folders,",
     "show": 1
    },
    {
     "say": "replies to replies,",
     "show": 2
    },
    {
     "say": "and categories inside categories.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What happens if a recursive function has no base case?",
   "options": [
    "It returns zero",
    "It calls itself until it crashes",
    "Python adds one automatically"
   ],
   "answer": 1,
   "good": "That's right. It keeps calling itself until it hits the maximum recursion depth and crashes.",
   "bad": "Not quite. It keeps calling itself until it hits the maximum recursion depth and crashes.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What happens if a recursive function has no base case?",
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
     "You can find the base case and recursive step",
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
     "say": "you can spot the base case and the recursive step in both examples.",
     "show": 1
    },
    {
     "say": "Next, trees.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 7: Trees - Hierarchies in Code

**Time: about 2 hours**

### Concept

A **tree** is a structure where each node has a value and points to child nodes, with one root and no cycles. A **binary tree** limits each node to at most two children. A **binary search tree (BST)** keeps values ordered - left child smaller, right child larger - enabling fast search.

### Where you'd actually use this

Category/subcategory menus, org charts, file system navigation, autocomplete/search suggestions, and the underlying structure of database indexes (which is why database lookups can be so fast).

### Lab

```python
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, value):
        if self.root is None:
            self.root = TreeNode(value)
        else:
            self._insert_recursive(self.root, value)

    def _insert_recursive(self, node, value):
        if value < node.value:
            if node.left is None:
                node.left = TreeNode(value)
            else:
                self._insert_recursive(node.left, value)
        else:
            if node.right is None:
                node.right = TreeNode(value)
            else:
                self._insert_recursive(node.right, value)

    def contains(self, value) -> bool:
        return self._contains_recursive(self.root, value)

    def _contains_recursive(self, node, value) -> bool:
        if node is None:
            return False
        if node.value == value:
            return True
        if value < node.value:
            return self._contains_recursive(node.left, value)
        return self._contains_recursive(node.right, value)

# Product IDs indexed for fast lookup
catalog = BST()
for product_id in [50, 30, 70, 20, 40, 60, 80]:
    catalog.insert(product_id)

print(catalog.contains(60))  # True
print(catalog.contains(99))  # False
```

**Your turn:** Add a `min_value(self)` method to `BST` that returns the smallest value by following `left` from the root until there's no left child. For the catalog above it should return 20.

### Checkpoint
You can explain why searching a balanced BST is roughly O(log n) instead of O(n).

### Quiz
1. What makes a binary tree "binary"?
2. In a BST, where do smaller values go relative to a node?
3. Why is BST search close to O(log n) instead of O(n)?
4. Name a real menu or navigation structure that's naturally a tree.
5. What could make a BST perform closer to O(n) instead of O(log n)?

*Answers: 1) Each node has at most two children. 2) To the left. 3) Each comparison eliminates roughly half the remaining nodes, similar to binary search. 4) A category menu, org chart, or nested comment thread (any valid example). 5) If the tree becomes unbalanced (e.g., values inserted in sorted order), it degrades into a structure closer to a linked list.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "tree",
   "kicker": "Module 7 · Trees",
   "title": "Hierarchies in code",
   "beats": [
    {
     "say": "Welcome to Module 7."
    },
    {
     "say": "A tree has one root, and each node points to its children, with no loops."
    }
   ]
  },
  {
   "kind": "list",
   "art": "fork",
   "kicker": "Concept",
   "title": "Binary search trees",
   "items": [
    [
     "Binary tree",
     "At most two children"
    ],
    [
     "Binary search tree",
     "Smaller left, larger right"
    ],
    [
     "Search",
     "About O(log n) when balanced"
    ]
   ],
   "beats": [
    {
     "say": "A binary tree allows at most two children per node.",
     "show": 1
    },
    {
     "say": "A binary search tree keeps them ordered: smaller values go left, larger go right.",
     "show": 2
    },
    {
     "say": "So each comparison skips about half the tree. Searching a balanced one is roughly O of log n.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "search",
   "kicker": "Lab",
   "title": "Search a product catalogue",
   "file": "Python",
   "code": "def _contains_recursive(self, node, value):\n    if node is None:\n        return False\n    if node.value == value:\n        return True\n    if value < node.value:\n        return self._contains_recursive(node.left, value)\n    return self._contains_recursive(node.right, value)",
   "beats": [
    {
     "say": "Insert product I Ds: fifty, thirty, seventy, and so on.",
     "show": 0
    },
    {
     "say": "Contains compares with each node. Smaller? Go left. Larger? Go right. Hit an empty spot? It isn't there.",
     "show": 1
    },
    {
     "say": "Sixty is found. Ninety nine isn't.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quote",
   "art": "warning",
   "kicker": "Careful",
   "title": "Unbalanced trees get slow",
   "quote": "Sorted inserts → a lopsided tree → search slows to O(n).",
   "beats": [
    {
     "say": "One catch.",
     "show": 0
    },
    {
     "say": "Insert values already in sorted order, and the tree becomes one long branch. Search slows down to O of n, like a linked list.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "In a binary search tree, where do smaller values go?",
   "options": [
    "To the right",
    "To the left",
    "At the root"
   ],
   "answer": 1,
   "good": "That's right. Smaller values go to the left.",
   "bad": "Not quite. Smaller values go to the left.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "In a binary search tree, where do smaller values go?",
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
     "You can explain O(log n) tree search",
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
     "say": "you can explain why searching a balanced tree is about O of log n.",
     "show": 1
    },
    {
     "say": "Next, graphs.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 8: Graphs - Modeling Real Relationships

**Time: about 2 hours**

### Concept

A **graph** is nodes connected by edges, without the strict parent-child limits of a tree - any node can connect to any other. **BFS** (breadth-first search) explores level by level, good for finding the shortest path. **DFS** (depth-first search) explores as deep as possible before backtracking, good for exploring all possibilities.

### Where you'd actually use this

Social networks (who's connected to whom), recommendation systems ("people who bought X also bought Y"), road/route navigation, dependency graphs (which packages depend on which others - package managers like `pip` and `npm` walk this kind of graph to work out what to install).

### Lab

```python
from collections import deque

# A simple social graph: who follows whom
graph = {
    "Alice": ["Bob", "Carol"],
    "Bob": ["Dave"],
    "Carol": ["Dave"],
    "Dave": [],
}

def bfs_shortest_path(graph, start, target):
    visited = {start}
    queue = deque([[start]])   # queue of paths, not just nodes

    while queue:
        path = queue.popleft()
        node = path[-1]

        if node == target:
            return path

        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(path + [neighbor])

    return None  # no path found

print(bfs_shortest_path(graph, "Alice", "Dave"))
# ['Alice', 'Bob', 'Dave']  -- the shortest connection path
```

**Your turn:** Add `"Eve": ["Alice"]` to the graph and give Dave a follow back to Eve (`"Dave": ["Eve"]`). Then find the shortest path from Bob to Carol. Why doesn't the loop (Alice > Bob > Dave > Eve > Alice) make BFS run forever?

### Checkpoint
You can explain why BFS, not DFS, is the right choice when you specifically need the *shortest* path.

### Quiz
1. What's the key structural difference between a tree and a graph?
2. Why does BFS use a queue instead of a stack?
3. What does BFS guarantee that DFS does not?
4. Name a real feature powered by graph traversal.
5. In the social graph example, why might "Carol" not appear in the returned path even though she's connected to Dave?

*Answers: 1) A graph allows arbitrary connections between any nodes; a tree has a strict single-parent hierarchy with no cycles. 2) A queue processes nodes level by level (FIFO), which is what produces the shortest path first. 3) That the first path found to the target is the shortest one, in terms of number of connections. 4) "Shortest path" navigation, "degrees of connection" on social networks, dependency resolution (any valid example). 5) Both paths (through Bob or through Carol) have the same length. Bob comes before Carol in Alice's list, so BFS reaches Dave through Bob first, marks Dave as visited, and returns that first shortest path.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "graph",
   "kicker": "Module 8 · Graphs",
   "title": "Model real relationships",
   "beats": [
    {
     "say": "Welcome to Module 8."
    },
    {
     "say": "A graph is nodes connected by edges. Unlike a tree, any node can connect to any other."
    }
   ]
  },
  {
   "kind": "list",
   "art": "fork",
   "kicker": "Concept",
   "title": "Two ways to explore",
   "items": [
    [
     "BFS",
     "Level by level: shortest path"
    ],
    [
     "DFS",
     "Deep first: explore everything"
    ]
   ],
   "beats": [
    {
     "say": "Two ways to explore a graph.",
     "show": 0
    },
    {
     "say": "Breadth first search, B F S, goes level by level, using a queue. It finds the shortest path.",
     "show": 1
    },
    {
     "say": "Depth first search, D F S, goes as deep as it can before backtracking. Good for exploring every possibility.",
     "show": 2
    }
   ]
  },
  {
   "kind": "list",
   "art": "network",
   "kicker": "Where you'd use this",
   "title": "Graphs are everywhere",
   "items": [
    [
     "Social networks",
     ""
    ],
    [
     "Recommendations",
     ""
    ],
    [
     "Routes",
     ""
    ],
    [
     "Dependencies",
     ""
    ]
   ],
   "beats": [
    {
     "say": "Social networks: who's connected to whom.",
     "show": 1
    },
    {
     "say": "Recommendations: people who bought this also bought that.",
     "show": 2
    },
    {
     "say": "Route navigation.",
     "show": 3
    },
    {
     "say": "And package managers like pip and npm, working out what to install.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "path",
   "kicker": "Lab",
   "title": "Shortest path with BFS",
   "file": "Python",
   "code": "def bfs_shortest_path(graph, start, target):\n    visited = {start}\n    queue = deque([[start]])\n    while queue:\n        path = queue.popleft()\n        if path[-1] == target:\n            return path\n        for neighbor in graph.get(path[-1], []):\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(path + [neighbor])",
   "beats": [
    {
     "say": "The queue holds paths, not just nodes.",
     "show": 0
    },
    {
     "say": "Take the next path. If it reaches the target, done. Otherwise, add each unvisited neighbour as a longer path.",
     "show": 1
    },
    {
     "say": "The visited set stops it going round in circles. From Alice to Dave, the answer is Alice, Bob, Dave.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does BFS guarantee that DFS doesn't?",
   "options": [
    "It uses less memory",
    "The first path it finds is the shortest",
    "It visits nodes alphabetically"
   ],
   "answer": 1,
   "good": "That's right. B F S guarantees the first path it finds to the target is the shortest.",
   "bad": "Not quite. B F S guarantees the first path it finds to the target is the shortest.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does BFS guarantee that DFS doesn't?",
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
     "You can explain why BFS finds the shortest path",
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
     "say": "you can explain why B F S is the right choice for the shortest path.",
     "show": 1
    },
    {
     "say": "Next, sorting.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 9: Sorting - Order Matters, and So Does Cost

**Time: about 1 hour**

### Concept

Python's built-in `sorted()` uses an efficient O(n log n) algorithm - you'll use it constantly. But understanding *how* sorting works matters when you need custom ordering logic, and understanding the cost matters when deciding whether to sort at all versus using a structure that avoids full re-sorting. One such structure is a **heap** (Python's built-in `heapq` module): it always keeps the smallest item at the front, so you can add an item or take the smallest one out in O(log n) without re-sorting everything. (If you took the "Build Your First Product" course, this is the structure behind TrackIt's task queue.)

### Where you'd actually use this

Sorting search results by relevance, a leaderboard by score, a product list by price - and knowing when *not* to re-sort a huge list repeatedly, using a heap or maintaining sorted insertion instead.

### Lab

```python
products = [
    {"name": "Laptop", "price": 1200},
    {"name": "Mouse", "price": 25},
    {"name": "Monitor", "price": 300},
]

# Sort by price, ascending
by_price = sorted(products, key=lambda p: p["price"])
print([p["name"] for p in by_price])  # ['Mouse', 'Monitor', 'Laptop']

# Sort by price, descending
by_price_desc = sorted(products, key=lambda p: p["price"], reverse=True)
print([p["name"] for p in by_price_desc])  # ['Laptop', 'Monitor', 'Mouse']

# Sort by multiple fields: category first, then price
products_with_category = [
    {"name": "Laptop", "category": "Electronics", "price": 1200},
    {"name": "Desk", "category": "Furniture", "price": 300},
    {"name": "Mouse", "category": "Electronics", "price": 25},
]
sorted_products = sorted(products_with_category, key=lambda p: (p["category"], p["price"]))
print([p["name"] for p in sorted_products])  # ['Mouse', 'Laptop', 'Desk']

# A heap: get the most urgent task without re-sorting the whole list
import heapq

tasks = []  # (priority, name) - lower number = more urgent
heapq.heappush(tasks, (3, "Reply to email"))
heapq.heappush(tasks, (1, "Fix login bug"))
heapq.heappush(tasks, (2, "Review pull request"))
print(tasks[0])                # (1, 'Fix login bug') - the smallest is always at index 0
print(heapq.heappop(tasks))    # (1, 'Fix login bug') - removed in O(log n)
print(heapq.nsmallest(2, tasks))  # [(2, 'Review pull request'), (3, 'Reply to email')]
```

**Your turn:** Sort `products_with_category` by category A to Z, but within each category by price from highest to lowest (hint: use `-p["price"]` in the key tuple).

### Checkpoint
You can sort a list of dictionaries by one field, and by two fields with a tiebreaker.

### Quiz
1. What does `key=lambda p: p["price"]` tell `sorted()` to do?
2. Why sort by `(category, price)` as a tuple instead of two separate sort calls?
3. What's the time complexity of Python's built-in sort?
4. If you need "top 5 most urgent items" repeatedly, why might a heap beat re-sorting every time?
5. Does `sorted()` change the original list?

*Answers: 1) Use each item's price as the value to compare when ordering. 2) Sorting by a tuple sorts by the first value, then breaks ties with the second, in one pass. 3) O(n log n). 4) Because re-sorting the whole list every time repeats work; a heap keeps the most urgent item at the front, and each add or remove costs only O(log n). 5) No - `sorted()` returns a new list; `.sort()` would modify the original in place.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "bars",
   "kicker": "Module 9 · Sorting",
   "title": "Order matters, and so does cost",
   "beats": [
    {
     "say": "Welcome to Module 9."
    },
    {
     "say": "Python's sorted uses an efficient O of n log n algorithm. You'll use it constantly."
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab",
   "title": "Sort by a field",
   "file": "Python",
   "code": "by_price = sorted(products, key=lambda p: p[\"price\"])\n# Mouse, Monitor, Laptop\n\nby_price_desc = sorted(products, key=lambda p: p[\"price\"], reverse=True)\n# Laptop, Monitor, Mouse",
   "beats": [
    {
     "say": "Key tells sorted what to compare. Here, each product's price.",
     "show": 0
    },
    {
     "say": "Add reverse equals true for highest first.",
     "show": 1
    },
    {
     "say": "Sorted returns a new list. Your original isn't changed.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "table",
   "kicker": "Lab",
   "title": "Sort by two fields",
   "file": "Python",
   "code": "sorted(products, key=lambda p: (p[\"category\"], p[\"price\"]))\n# Mouse, Laptop (Electronics), then Desk (Furniture)",
   "beats": [
    {
     "say": "To sort by category, then price, use a tuple as the key.",
     "show": 0
    },
    {
     "say": "It sorts by the first value, and breaks ties with the second, in one pass.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "pyramid",
   "kicker": "Lab",
   "title": "When not to re-sort: a heap",
   "file": "Python",
   "code": "import heapq\ntasks = []\nheapq.heappush(tasks, (3, \"Reply to email\"))\nheapq.heappush(tasks, (1, \"Fix login bug\"))\nheapq.heappush(tasks, (2, \"Review pull request\"))\n\nheapq.heappop(tasks)   # (1, \"Fix login bug\")",
   "beats": [
    {
     "say": "If you keep needing the most urgent item, don't re-sort everything each time.",
     "show": 0
    },
    {
     "say": "A heap always keeps the smallest at the front. Adding or removing one is O of log n.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Does sorted() change the original list?",
   "options": [
    "Yes, always",
    "No, it returns a new list",
    "Only for numbers"
   ],
   "answer": 1,
   "good": "That's right. Sorted returns a new list. The sort method is the one that changes the original.",
   "bad": "Not quite. Sorted returns a new list. The sort method is the one that changes the original.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Does sorted() change the original list?",
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
     "You can sort by one field, and by two",
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
     "say": "you can sort by one field, and by two with a tiebreaker.",
     "show": 1
    },
    {
     "say": "Next, searching.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 10: Searching & Binary Search

**Time: about 1 hour**

### Concept

**Linear search** checks each item one by one - O(n). **Binary search** works only on *sorted* data, and repeatedly cuts the search space in half - O(log n). This is dramatically faster at scale, but requires the data to already be sorted.

### Where you'd actually use this

Autocomplete suggestions, looking up a value in a large sorted dataset (prices, dates, IDs), and it's the underlying idea behind how database indexes achieve fast lookups.

### Lab

```python
def linear_search(items, target):
    for i, item in enumerate(items):
        if item == target:
            return i
    return -1

def binary_search(sorted_items, target):
    low, high = 0, len(sorted_items) - 1
    while low <= high:
        mid = (low + high) // 2
        if sorted_items[mid] == target:
            return mid
        elif sorted_items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

sorted_ids = list(range(0, 1_000_000, 2))  # 500,000 sorted even numbers

print(binary_search(sorted_ids, 45000))   # finds it in ~20 comparisons
print(linear_search(sorted_ids, 45000))   # would take up to ~22,500 comparisons
```

**Your turn:** Add a counter to `binary_search` that counts how many times the loop runs, and print it for a few targets in `sorted_ids`. It should never go above about 20, even though the list has 500,000 items.

### Checkpoint
You can explain why binary search requires sorted data and what happens if you run it on unsorted data.

### Quiz
1. What's the one requirement binary search has that linear search doesn't?
2. Why is binary search O(log n) instead of O(n)?
3. What happens if you run binary search on unsorted data?
4. If your data changes constantly (frequent inserts), is keeping it sorted for binary search always worth it?
5. Name a real feature where fast lookup on sorted data matters.

*Answers: 1) The data must already be sorted. 2) Each step eliminates half the remaining search space. 3) It can give incorrect or missing results, since it relies on the sorted order to decide which half to search. 4) Not always - maintaining sorted order on every insert has its own cost, so the right choice depends on how often you search vs. insert. 5) Database index lookups, searching a sorted product catalog by ID (any valid example).*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "search",
   "kicker": "Module 10 · Searching",
   "title": "Binary search",
   "beats": [
    {
     "say": "Welcome to Module 10."
    }
   ]
  },
  {
   "kind": "list",
   "art": "array",
   "kicker": "Concept",
   "title": "Two ways to search",
   "items": [
    [
     "Linear search",
     "One by one: O(n)"
    ],
    [
     "Binary search",
     "Halve each step: O(log n). Needs sorted data."
    ]
   ],
   "beats": [
    {
     "say": "Linear search checks each item, one by one. O of n.",
     "show": 1
    },
    {
     "say": "Binary search only works on sorted data. It keeps cutting the search space in half. O of log n.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab",
   "title": "Halve it every step",
   "file": "Python",
   "code": "def binary_search(sorted_items, target):\n    low, high = 0, len(sorted_items) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if sorted_items[mid] == target:\n            return mid\n        elif sorted_items[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1",
   "beats": [
    {
     "say": "Look at the middle item.",
     "show": 0
    },
    {
     "say": "If it's the target, done. If it's too small, search the top half. Too big, the bottom half.",
     "show": 1
    },
    {
     "say": "Repeat until found, or nothing's left.",
     "show": 1
    }
   ]
  },
  {
   "kind": "big",
   "art": "stopwatch",
   "kicker": "Lab",
   "title": "Half a million items",
   "big": "~20 steps",
   "sub": "to search 500,000 sorted items",
   "beats": [
    {
     "say": "In a list of five hundred thousand sorted numbers,",
     "show": 0
    },
    {
     "say": "binary search finds any item in about twenty steps.",
     "show": 1
    },
    {
     "say": "Linear search could take tens of thousands.",
     "show": 2
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What happens if you binary search unsorted data?",
   "options": [
    "It still works, just slower",
    "It can give wrong or missing results",
    "Python sorts it first"
   ],
   "answer": 1,
   "good": "That's right. It relies on the sorted order to choose a half, so it can give wrong or missing results.",
   "bad": "Not quite. It relies on the sorted order to choose a half, so it can give wrong or missing results.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What happens if you binary search unsorted data?",
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
     "You can explain why binary search needs sorted data",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 10.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you can explain why binary search needs sorted data.",
     "show": 1
    },
    {
     "say": "Next, the last module: dynamic programming.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 11: Dynamic Programming - Avoiding Repeated Work

**Time: about 2 hours**

### Concept

**Dynamic programming (DP)** solves a problem by breaking it into overlapping subproblems and storing (**memoizing**) the results, so you never recompute the same thing twice. It's most useful when a naive recursive solution would repeat identical work many times.

### Where you'd actually use this

Pricing calculators with many discount rule combinations, computing "shortest/cheapest path" style features, and anywhere you catch yourself recalculating the same intermediate result repeatedly (this is also the core intuition behind caching in general - DP is caching applied to computation).

### Lab

```python
# Classic teaching example: Fibonacci, showing the cost of NOT caching
def fib_slow(n):
    if n <= 1:
        return n
    return fib_slow(n - 1) + fib_slow(n - 2)   # recalculates the same values repeatedly

def fib_fast(n, memo=None):
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_fast(n - 1, memo) + fib_fast(n - 2, memo)
    return memo[n]

import time
start = time.time()
fib_slow(30)
print("Without memoization:", time.time() - start)

start = time.time()
fib_fast(30)
print("With memoization:", time.time() - start)
```

```python
# A more realistic example: caching an expensive pricing calculation
price_cache = {}

def calculate_shipping_cost(weight_kg, distance_km):
    key = (weight_kg, distance_km)
    if key in price_cache:
        return price_cache[key]           # instant, already computed

    # Pretend this is an expensive calculation
    cost = (weight_kg * 2.5) + (distance_km * 0.1)
    price_cache[key] = cost
    return cost

print(calculate_shipping_cost(2, 100))   # 15.0, calculated
print(calculate_shipping_cost(2, 100))   # 15.0, returned from the cache
print(len(price_cache))                  # 1, only one result stored
```

**Your turn:** Python has memoization built in. Write `fib_cached` using `from functools import cache` and the `@cache` decorator above a plain recursive Fibonacci function, then time `fib_cached(30)` against `fib_slow(30)`.

### Checkpoint
You can explain, in plain language, why `fib_fast` avoids the repeated work that makes `fib_slow` so much slower.

### Quiz
1. What problem does memoization solve?
2. Why does `fib_slow` get dramatically slower as `n` grows?
3. What does `memo[n] = ...` accomplish in `fib_fast`?
4. How is `calculate_shipping_cost`'s caching similar to dynamic programming?
5. Is DP useful for every problem? Why or why not?

*Answers: 1) Repeated recomputation of the same subproblem. 2) It recalculates the same smaller values exponentially many times without remembering past results. 3) Stores the result so future calls with the same `n` return instantly instead of recomputing. 4) It stores already-computed results (keyed by input) to skip redundant work on repeat calls, the same core idea as memoization. 5) No - it only helps when a problem has overlapping subproblems; if every subproblem is unique, there's nothing to cache.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "puzzle",
   "kicker": "Module 11 · Dynamic programming",
   "title": "Never compute the same thing twice",
   "beats": [
    {
     "say": "Welcome to the last module."
    },
    {
     "say": "Dynamic programming breaks a problem into overlapping pieces, and stores each answer, so you never recompute it. That's called memoization."
    }
   ]
  },
  {
   "kind": "list",
   "art": "loop",
   "kicker": "The problem",
   "title": "Repeated work",
   "items": [
    [
     "fib_slow(30)",
     "Recomputes the same values many times"
    ],
    [
     "Result",
     "Dramatically slower as n grows"
    ]
   ],
   "beats": [
    {
     "say": "Here's the problem it solves.",
     "show": 0
    },
    {
     "say": "A plain recursive Fibonacci recalculates the same smaller values again and again.",
     "show": 1
    },
    {
     "say": "So it gets dramatically slower as n grows.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab",
   "title": "Remember the answers",
   "file": "Python",
   "code": "def fib_fast(n, memo=None):\n    if memo is None:\n        memo = {}\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fib_fast(n - 1, memo) + fib_fast(n - 2, memo)\n    return memo[n]",
   "beats": [
    {
     "say": "Fib fast keeps a memo, a dictionary of answers.",
     "show": 0
    },
    {
     "say": "If the answer for n is already there, return it instantly. Otherwise, compute it once, store it, and return it.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quote",
   "art": "calc",
   "kicker": "Where you'd use this",
   "title": "It's caching, for calculations",
   "quote": "Dynamic programming = caching, applied to calculations.",
   "beats": [
    {
     "say": "The same idea works anywhere you recalculate the same thing, like a shipping cost for the same weight and distance.",
     "show": 0
    },
    {
     "say": "Dynamic programming is really caching, applied to computation. Python even has it built in, with the cache decorator.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Is dynamic programming useful for every problem?",
   "options": [
    "Yes, always",
    "No, only when the same subproblems repeat",
    "Only for Fibonacci"
   ],
   "answer": 1,
   "good": "That's right. It only helps when subproblems overlap. If every piece is unique, there's nothing to cache.",
   "bad": "Not quite. It only helps when subproblems overlap. If every piece is unique, there's nothing to cache.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Is dynamic programming useful for every problem?",
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
     "You can explain why memoization is faster",
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
     "say": "you can explain why fib fast avoids the repeated work that slows fib slow.",
     "show": 1
    },
    {
     "say": "You've finished Data Structures and Algorithms for Builders. Well done.",
     "show": 1
    }
   ]
  }
 ]
}
```
