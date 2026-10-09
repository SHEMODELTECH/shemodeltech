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
   "kind": "table",
   "kicker": "Concept",
   "title": "Big O describes growth, not exact speed",
   "columns": [
    "Notation",
    "Meaning",
    "Example"
   ],
   "rows": [
    [
     "O(1)",
     "Same speed at any size",
     "Dictionary key lookup"
    ],
    [
     "O(log n)",
     "Grows slowly",
     "Binary search"
    ],
    [
     "O(n)",
     "Grows in step with the data",
     "Scanning a list once"
    ],
    [
     "O(n log n)",
     "A little worse than linear",
     "Efficient sorting"
    ],
    [
     "O(n²)",
     "Double the data, 4× the time",
     "Comparing every pair"
    ]
   ],
   "beats": [
    {
     "say": "Big O describes how an operation's cost grows as your data grows. Not the exact speed, the pattern.",
     "col": 0
    },
    {
     "say": "O of one is constant: looking up a dictionary key takes the same time at any size.",
     "hl": 0
    },
    {
     "say": "O of log n grows slowly, like binary search.",
     "hl": 1
    },
    {
     "say": "O of n grows in step with the data, like scanning a list once.",
     "hl": 2
    },
    {
     "say": "O of n log n is a little worse. That's efficient sorting.",
     "hl": 3
    },
    {
     "say": "And O of n squared compares every pair. Double the data, and the time goes up four times.",
     "hl": 4,
     "dim": true
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · The slow way",
   "title": "has_duplicates_slow compares every pair",
   "values": [
    0,
    1,
    2,
    3,
    3
   ],
   "beats": [
    {
     "say": "Here's a tiny version of the lab data: zero to three, plus a repeated three.",
     "note": "data = list(range(4)) + [3]"
    },
    {
     "say": "The slow version takes item zero and compares it with every item after it. Four comparisons, no match.",
     "hl": [
      1,
      2,
      3,
      4
     ],
     "ptr": {
      "i": 0
     },
     "note": "i = 0 → 4 comparisons"
    },
    {
     "say": "Then item one, against everything after it. Three more, still nothing.",
     "ok": [
      0
     ],
     "hl": [
      2,
      3,
      4
     ],
     "ptr": {
      "i": 1
     },
     "note": "i = 1 → 3 more (7 so far)"
    },
    {
     "say": "Item two: two more comparisons.",
     "ok": [
      0,
      1
     ],
     "hl": [
      3,
      4
     ],
     "ptr": {
      "i": 2
     },
     "note": "i = 2 → 2 more (9 so far)"
    },
    {
     "say": "Item three against item four: three equals three. Found, on the tenth comparison.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": [
      3,
      4
     ],
     "ptr": {
      "i": 3,
      "j": 4
     },
     "note": "items[3] == items[4] → True"
    },
    {
     "say": "Every item has to meet every other item. That's why it's n squared.",
     "ok": [
      0,
      1,
      2
     ],
     "note": "5 items → 10 comparisons"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · The fast way",
   "title": "has_duplicates_fast remembers what it's seen",
   "file": "duplicates.py",
   "code": "def has_duplicates_fast(items):\n    # O(n): uses a set for instant lookups\n    seen = set()\n    for item in items:\n        if item in seen:\n            return True\n        seen.add(item)\n    return False\n\ndata = list(range(4)) + [3]\nprint(has_duplicates_fast(data))",
   "beats": [
    {
     "say": "Same tiny data: zero, one, two, three, three.",
     "line": 10,
     "vars": {
      "data": "[0, 1, 2, 3, 3]"
     }
    },
    {
     "say": "The fast version starts with an empty set called seen.",
     "line": 3,
     "vars": {
      "data": "[0, 1, 2, 3, 3]",
      "seen": "set()"
     }
    },
    {
     "say": "Zero: is it in seen? No. Add it.",
     "line": [
      4,
      5,
      7
     ],
     "vars": {
      "item": 0,
      "seen": "{0}"
     }
    },
    {
     "say": "One, two, and three: each one is new, so each gets added.",
     "line": [
      4,
      5,
      7
     ],
     "vars": {
      "item": 3,
      "seen": "{0, 1, 2, 3}"
     }
    },
    {
     "say": "Then the last three. Is it in seen? Yes, instantly. Return True.",
     "line": [
      5,
      6
     ],
     "vars": {
      "item": 3,
      "seen": "{0, 1, 2, 3}"
     },
     "out": "True"
    },
    {
     "say": "Five items, five quick checks. One pass through the list. That's O of n.",
     "line": 4
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Why it matters",
   "title": "Fine in testing, broken in production",
   "columns": [
    "Items",
    "Slow: comparisons",
    "Fast: checks"
   ],
   "rows": [
    [
     "5",
     "10",
     "5"
    ],
    [
     "101",
     "5,050",
     "101"
    ],
    [
     "5,001",
     "12,502,500",
     "5,001"
    ],
    [
     "10,001",
     "50,005,000",
     "10,001"
    ],
    [
     "100,001",
     "5,000,050,000",
     "100,001"
    ]
   ],
   "beats": [
    {
     "say": "Here's the work each version does on the lab's data, at different sizes."
    },
    {
     "say": "At five items, ten comparisons against five. Nobody would notice.",
     "hl": 0
    },
    {
     "say": "The lab runs five thousand and one items: twelve and a half million comparisons, against five thousand and one checks.",
     "hl": 2,
     "col": 1
    },
    {
     "say": "Your turn doubles it to ten thousand and one. The slow count goes up four times. The fast count only doubles.",
     "hl": [
      2,
      3
     ],
     "dim": true,
     "col": 1
    },
    {
     "say": "At a hundred thousand users, the slow way needs five billion comparisons. That's how code that worked in testing falls over in production.",
     "hl": 4,
     "dim": true,
     "col": 1
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
     "say": "As data doubles, what happens to an O of n squared operation?",
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
   "kind": "array",
   "kicker": "Concept",
   "title": "What's fast, what's slow",
   "values": [
    "Book",
    "Pen"
   ],
   "beats": [
    {
     "say": "A list keeps items in numbered slots, starting at zero. Here's a cart with two items."
    },
    {
     "say": "Append puts Notebook in a new slot at the end. Nothing else moves, so it's O of one.",
     "vals": [
      "Book",
      "Pen",
      "Notebook"
     ],
     "hl": 2,
     "note": "cart.append(\"Notebook\") → O(1)"
    },
    {
     "say": "Asking for cart two jumps straight to slot two. One step, at any size.",
     "vals": [
      "Book",
      "Pen",
      "Notebook"
     ],
     "hl": 2,
     "ptr": {
      "cart[2]": 2
     },
     "note": "access by index → O(1)"
    },
    {
     "say": "Searching for a value is different. Python checks slot after slot until it finds it.",
     "vals": [
      "Book",
      "Pen",
      "Notebook"
     ],
     "gone": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "check": 2
     },
     "note": "\"Notebook\" in cart → 3 checks, O(n)"
    },
    {
     "say": "Now move Notebook to the front, like the your turn exercise. First, remove takes it out of the end.",
     "vals": [
      "Book",
      "Pen"
     ],
     "gone": [],
     "note": "cart.remove(\"Notebook\")"
    },
    {
     "say": "Then insert at position zero. Every other item has to shift one slot right. That's O of n.",
     "vals": [
      "Notebook",
      "Book",
      "Pen"
     ],
     "hl": [
      1,
      2
     ],
     "note": "cart.insert(0, ...) → 2 items shifted, O(n)"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab",
   "title": "A shopping cart",
   "file": "cart.py",
   "code": "cart = []\n\ndef add_item(cart, item):\n    cart.append(item)          # O(1)\n\ndef remove_item(cart, item):\n    if item in cart:           # O(n) search\n        cart.remove(item)      # O(n) removal\n\nadd_item(cart, \"Book\")\nadd_item(cart, \"Pen\")\nadd_item(cart, \"Notebook\")\nremove_item(cart, \"Pen\")\nprint(cart)  # [\"Book\", \"Notebook\"]",
   "beats": [
    {
     "say": "The cart starts as an empty list.",
     "line": 1,
     "vars": {
      "cart": "[]"
     }
    },
    {
     "say": "Add item appends Book to the end.",
     "line": [
      10,
      4
     ],
     "vars": {
      "cart": "['Book']"
     }
    },
    {
     "say": "Then Pen, then Notebook. Each one lands at the end, instantly.",
     "line": [
      11,
      12,
      4
     ],
     "vars": {
      "cart": "['Book', 'Pen', 'Notebook']"
     }
    },
    {
     "say": "Remove item checks that Pen is in the cart first, so remove can't fail.",
     "line": [
      13,
      7
     ]
    },
    {
     "say": "Then it removes Pen.",
     "line": 8,
     "vars": {
      "cart": "['Book', 'Notebook']"
     }
    },
    {
     "say": "Print shows Book and Notebook.",
     "line": 14,
     "out": "['Book', 'Notebook']"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Trace it",
   "title": "What remove actually does",
   "values": [
    "Book",
    "Pen",
    "Notebook"
   ],
   "beats": [
    {
     "say": "Let's zoom in on removing Pen."
    },
    {
     "say": "Pen in cart checks from the front. Book? No.",
     "hl": 0,
     "ptr": {
      "check": 0
     }
    },
    {
     "say": "Pen? Yes. So it's safe to remove.",
     "gone": [
      0
     ],
     "hl": 1,
     "ptr": {
      "check": 1
     },
     "note": "\"Pen\" in cart → True"
    },
    {
     "say": "Remove takes Pen out of slot one.",
     "vals": [
      "Book",
      "—",
      "Notebook"
     ],
     "gone": [
      1
     ],
     "note": "cart.remove(\"Pen\")"
    },
    {
     "say": "And Notebook shifts left to fill the gap. With a thousand items after Pen, that's a thousand moves.",
     "vals": [
      "Book",
      "Notebook"
     ],
     "gone": [],
     "hl": 1,
     "note": "items after it shift → O(n)"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Strings",
   "title": "Is it a palindrome?",
   "values": [
    "r",
    "a",
    "c",
    "e",
    "c",
    "a",
    "r"
   ],
   "beats": [
    {
     "say": "Strings work like lists of characters. Is palindrome first lower-cases the text and removes spaces. Racecar is already clean.",
     "note": "cleaned = \"racecar\""
    },
    {
     "say": "The slice with two colons and minus one makes a reversed copy. Racecar backwards is still racecar.",
     "hl": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
     ],
     "note": "cleaned[::-1] → \"racecar\""
    },
    {
     "say": "Every letter matches its reverse, so it returns True.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
     ],
     "note": "True"
    },
    {
     "say": "Now hello world. Lower-case it, remove the space: ten letters.",
     "vals": [
      "h",
      "e",
      "l",
      "l",
      "o",
      "w",
      "o",
      "r",
      "l",
      "d"
     ],
     "ok": [],
     "note": "cleaned = \"helloworld\""
    },
    {
     "say": "Reversed, it starts with d.",
     "vals": [
      "d",
      "l",
      "r",
      "o",
      "w",
      "o",
      "l",
      "l",
      "e",
      "h"
     ],
     "note": "cleaned[::-1] → \"dlrowolleh\""
    },
    {
     "say": "The very first letters already differ, h and d, so the answer is False.",
     "hl": 0,
     "note": "\"h\" ≠ \"d\" → False"
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
   "kind": "array",
   "kicker": "Concept",
   "title": "The hash tells Python where to look",
   "values": [
    "—",
    "—",
    "—",
    "—",
    "—",
    "—"
   ],
   "beats": [
    {
     "say": "Under the hood, a dictionary keeps a row of numbered slots."
    },
    {
     "say": "To store Alice, Python hashes her email into a number, and that number picks a slot. Say slot four.",
     "vals": [
      "—",
      "—",
      "—",
      "—",
      "alice → Alice",
      "—"
     ],
     "hl": 4,
     "note": "hash(\"alice@example.com\") → slot 4 (for this picture)"
    },
    {
     "say": "Bob's email hashes to a different number. Say slot one.",
     "vals": [
      "—",
      "bob → Bob",
      "—",
      "—",
      "alice → Alice",
      "—"
     ],
     "hl": 1,
     "note": "hash(\"bob@example.com\") → slot 1"
    },
    {
     "say": "To find Bob, Python hashes the same email again, gets slot one, and jumps straight there.",
     "hl": 1,
     "ptr": {
      "get": 1
     },
     "note": "one jump, no scanning"
    },
    {
     "say": "Two users or two million, it's the same single jump. That's O of one. A list would check every user in turn.",
     "hl": 1,
     "note": "dict: O(1)   ·   list of users: O(n)"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab",
   "title": "Count words with a dictionary",
   "file": "word_count.py",
   "code": "def word_frequency(text: str) -> dict:\n    counts = {}\n    for word in text.lower().split():\n        counts[word] = counts.get(word, 0) + 1\n    return counts\n\ntext = \"the cat sat on the mat the cat ran\"\nprint(word_frequency(text))",
   "beats": [
    {
     "say": "Here's a sentence with nine words.",
     "line": 7
    },
    {
     "say": "Counts starts as an empty dictionary.",
     "line": [
      8,
      2
     ],
     "vars": {
      "counts": "{}"
     }
    },
    {
     "say": "First word, the. Counts dot get returns zero, because the is new. Zero plus one is one.",
     "line": [
      3,
      4
     ],
     "vars": {
      "word": "the",
      "counts": "{'the': 1}"
     }
    },
    {
     "say": "Cat, sat, and on are new too. Each one gets a count of one.",
     "line": [
      3,
      4
     ],
     "vars": {
      "word": "on",
      "counts": "{'the': 1, 'cat': 1, 'sat': 1, 'on': 1}"
     }
    },
    {
     "say": "Now the again. This time get finds one, so it becomes two.",
     "line": [
      3,
      4
     ],
     "vars": {
      "word": "the",
      "counts": "{'the': 2, 'cat': 1, 'sat': 1, 'on': 1}"
     }
    },
    {
     "say": "Mat is new. Then the again: three.",
     "line": [
      3,
      4
     ],
     "vars": {
      "word": "the",
      "counts": "{'the': 3, 'cat': 1, 'sat': 1, 'on': 1, 'mat': 1}"
     }
    },
    {
     "say": "Cat goes up to two, and ran is new.",
     "line": [
      3,
      4
     ],
     "vars": {
      "word": "ran",
      "counts": "{'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1, 'ran': 1}"
     }
    },
    {
     "say": "Return the counts, and print them.",
     "line": [
      5,
      8
     ],
     "out": "{'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1, 'ran': 1}"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Your turn",
   "title": "Which word is most common?",
   "columns": [
    "word",
    "count"
   ],
   "rows": [
    [
     "the",
     "3"
    ],
    [
     "cat",
     "2"
    ],
    [
     "sat",
     "1"
    ],
    [
     "on",
     "1"
    ],
    [
     "mat",
     "1"
    ],
    [
     "ran",
     "1"
    ]
   ],
   "beats": [
    {
     "say": "Here are those counts as a table, in the order the words were first seen."
    },
    {
     "say": "Max, with key equals counts dot get, compares the words by their counts.",
     "sql": "max(counts, key=counts.get)",
     "col": 1
    },
    {
     "say": "The highest count is three, so most common word returns the.",
     "hl": 0,
     "dim": true,
     "col": 1
    },
    {
     "say": "And each count was found by key, with no scanning. That's why counting is a classic hash map job.",
     "hl": 0,
     "col": 0
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab",
   "title": "Find a user instantly",
   "file": "users.py",
   "code": "users_by_email = {\n    \"alice@example.com\": {\"id\": 1, \"name\": \"Alice\"},\n    \"bob@example.com\": {\"id\": 2, \"name\": \"Bob\"},\n}\n\ndef find_user(email: str):\n    return users_by_email.get(email)  # O(1), not O(n)\n\nprint(find_user(\"bob@example.com\"))",
   "beats": [
    {
     "say": "The users are stored by email. The email is the key.",
     "line": [
      1,
      4
     ]
    },
    {
     "say": "We ask for bob at example dot com.",
     "line": 9,
     "vars": {
      "email": "\"bob@example.com\""
     }
    },
    {
     "say": "Get hashes the key and jumps straight to Bob's record. No loop at all.",
     "line": 7
    },
    {
     "say": "Print shows Bob's id and name.",
     "line": 9,
     "out": "{'id': 2, 'name': 'Bob'}"
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
     "say": "What happens with counts of word, plus equals one, on a word that isn't there yet?",
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
   "kind": "table",
   "kicker": "Concept",
   "title": "A list and a set, side by side",
   "columns": [
    "",
    "list",
    "set"
   ],
   "rows": [
    [
     "Duplicates allowed?",
     "Yes",
     "No"
    ],
    [
     "Keeps order?",
     "Yes",
     "No"
    ],
    [
     "\"x in ...\" cost",
     "O(n)",
     "O(1)"
    ],
    [
     "Built on",
     "Slots in order",
     "Hashing, like a dict"
    ]
   ],
   "beats": [
    {
     "say": "A set looks a bit like a list, but it makes different promises."
    },
    {
     "say": "A list happily keeps duplicates. A set never does.",
     "hl": 0
    },
    {
     "say": "A list remembers order. A set doesn't, so it may print in any order.",
     "hl": 1
    },
    {
     "say": "Checking membership: a list scans every item, but a set jumps straight there.",
     "hl": 2,
     "col": 2
    },
    {
     "say": "Because, like a dictionary, a set is built on hashing.",
     "hl": 3,
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab",
   "title": "Deduplicate emails before a send",
   "values": [
    "a@x.com",
    "b@x.com",
    "a@x.com",
    "c@x.com",
    "b@x.com"
   ],
   "beats": [
    {
     "say": "Here are five raw email addresses, with some repeats."
    },
    {
     "say": "Set of raw emails takes them one at a time. a at x dot com is new, so it goes in.",
     "ok": [
      0
     ],
     "ptr": {
      "next": 0
     },
     "note": "{a}"
    },
    {
     "say": "b at x dot com is new too.",
     "ok": [
      0,
      1
     ],
     "ptr": {
      "next": 1
     },
     "note": "{a, b}"
    },
    {
     "say": "Then a again. It's already there, so nothing changes.",
     "ok": [
      0,
      1
     ],
     "gone": [
      2
     ],
     "ptr": {
      "next": 2
     },
     "note": "a already in the set → skipped"
    },
    {
     "say": "c is new.",
     "ok": [
      0,
      1,
      3
     ],
     "gone": [
      2
     ],
     "ptr": {
      "next": 3
     },
     "note": "{a, b, c}"
    },
    {
     "say": "And b is a repeat.",
     "ok": [
      0,
      1,
      3
     ],
     "gone": [
      2,
      4
     ],
     "ptr": {
      "next": 4
     },
     "note": "b already in the set → skipped"
    },
    {
     "say": "Length of the set is three. The duplicates are gone, automatically.",
     "ok": [
      0,
      1,
      3
     ],
     "gone": [
      2,
      4
     ],
     "note": "len(unique_emails) → 3"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab",
   "title": "Skip what's already done",
   "file": "orders.py",
   "code": "processed_order_ids = set()\n\ndef process_order(order_id):\n    if order_id in processed_order_ids:   # O(1) check, not O(n)\n        print(f\"Order {order_id} already processed, skipping\")\n        return\n    processed_order_ids.add(order_id)\n    print(f\"Processing order {order_id}\")\n\nprocess_order(101)\nprocess_order(102)\nprocess_order(101)   # skipped",
   "beats": [
    {
     "say": "We start with an empty set of processed order IDs.",
     "line": 1,
     "vars": {
      "processed_order_ids": "set()"
     }
    },
    {
     "say": "Order one oh one. Is it in the set? No.",
     "line": [
      10,
      4
     ],
     "vars": {
      "order_id": 101,
      "processed_order_ids": "set()"
     }
    },
    {
     "say": "So add it, and process it.",
     "line": [
      7,
      8
     ],
     "vars": {
      "order_id": 101,
      "processed_order_ids": "{101}"
     },
     "out": "Processing order 101"
    },
    {
     "say": "Order one oh two is new as well.",
     "line": [
      11,
      4,
      7,
      8
     ],
     "vars": {
      "order_id": 102,
      "processed_order_ids": "{101, 102}"
     },
     "out": "Processing order 102"
    },
    {
     "say": "Now one oh one arrives again. The set says yes, instantly.",
     "line": [
      12,
      4
     ],
     "vars": {
      "order_id": 101,
      "processed_order_ids": "{101, 102}"
     }
    },
    {
     "say": "So it prints a skip message and returns. The order is never processed twice.",
     "line": [
      5,
      6
     ],
     "out": "Order 101 already processed, skipping"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab",
   "title": "Set operations: what do Alice and Bob share?",
   "columns": [
    "interest",
    "Alice",
    "Bob"
   ],
   "rows": [
    [
     "hiking",
     "✓",
     ""
    ],
    [
     "coding",
     "✓",
     "✓"
    ],
    [
     "reading",
     "✓",
     ""
    ],
    [
     "chess",
     "✓",
     "✓"
    ],
    [
     "gaming",
     "",
     "✓"
    ],
    [
     "cooking",
     "",
     "✓"
    ]
   ],
   "beats": [
    {
     "say": "Alice has four interests, and Bob has four. Here they are in one table."
    },
    {
     "say": "The ampersand gives the intersection: what's in both. Coding and chess.",
     "sql": "shared = alice_interests & bob_interests",
     "hl": [
      1,
      3
     ],
     "dim": true
    },
    {
     "say": "The minus sign gives the difference: Alice's, minus Bob's. Hiking and reading.",
     "sql": "only_alice = alice_interests - bob_interests",
     "hl": [
      0,
      2
     ],
     "dim": true,
     "col": 1
    },
    {
     "say": "And the bar gives the union: everything from both, once each. Six interests.",
     "sql": "everyone = alice_interests | bob_interests",
     "hl": [
      0,
      1,
      2,
      3,
      4,
      5
     ]
    },
    {
     "say": "Your turn uses the same trick: new list minus old list gives just the new subscribers.",
     "sql": "new_list_set - old_list_set"
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
     "say": "What does the ampersand do between two sets?",
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
   "kind": "diagram",
   "kicker": "Lab",
   "title": "Build a playlist with add_front",
   "nodes": [
    {
     "id": "head",
     "label": "head",
     "x": 10,
     "y": 50,
     "sub": "where the list starts"
    },
    {
     "id": "c",
     "label": "Song C",
     "x": 88,
     "y": 50,
     "sub": "next: None"
    },
    {
     "id": "b",
     "label": "Song B",
     "x": 66,
     "y": 50,
     "sub": "next → Song C"
    },
    {
     "id": "a",
     "label": "Song A",
     "x": 40,
     "y": 50,
     "sub": "next → Song B"
    }
   ],
   "edges": [
    {
     "from": "head",
     "to": "a"
    },
    {
     "from": "a",
     "to": "b"
    },
    {
     "from": "b",
     "to": "c"
    }
   ],
   "beats": [
    {
     "say": "A new linked list has a head, and nothing else. Head is None.",
     "show": 1,
     "on": "head"
    },
    {
     "say": "Add front, Song C. A new node is made, and head now points at it.",
     "show": 2,
     "on": [
      "head",
      "c"
     ]
    },
    {
     "say": "Add front, Song B. The new node's next points at the old head, Song C.",
     "show": 3,
     "on": "b",
     "send": {
      "from": "b",
      "to": "c",
      "label": "new_node.next = self.head"
     }
    },
    {
     "say": "Then head moves to Song B. Song C never moved at all.",
     "show": 3,
     "on": [
      "head",
      "b"
     ]
    },
    {
     "say": "Add front, Song A. Its next points at Song B.",
     "show": 4,
     "on": "a",
     "send": {
      "from": "a",
      "to": "b",
      "label": "new_node.next = self.head"
     }
    },
    {
     "say": "And head points at Song A. Two pointer changes, no shifting. That's O of one.",
     "show": 4,
     "on": [
      "head",
      "a"
     ],
     "send": {
      "from": "head",
      "to": "a",
      "label": "self.head = new_node"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Trace it",
   "title": "to_list walks the chain",
   "file": "playlist.py",
   "code": "class LinkedList:\n    def add_front(self, value):\n        new_node = Node(value)\n        new_node.next = self.head\n        self.head = new_node        # O(1) - no shifting required\n\n    def to_list(self):\n        result = []\n        current = self.head\n        while current:\n            result.append(current.value)\n            current = current.next\n        return result\nprint(playlist.to_list())",
   "beats": [
    {
     "say": "After the three add front calls, head points at Song A.",
     "line": [
      2,
      5
     ]
    },
    {
     "say": "To list starts with an empty result, and current at the head.",
     "line": [
      8,
      9
     ],
     "vars": {
      "current": "Song A",
      "result": "[]"
     }
    },
    {
     "say": "Current is a node, so the loop runs. Add Song A, then follow next to Song B.",
     "line": [
      10,
      11,
      12
     ],
     "vars": {
      "current": "Song B",
      "result": "['Song A']"
     }
    },
    {
     "say": "Add Song B, and follow next to Song C.",
     "line": [
      10,
      11,
      12
     ],
     "vars": {
      "current": "Song C",
      "result": "['Song A', 'Song B']"
     }
    },
    {
     "say": "Add Song C. Its next is None, so current becomes None.",
     "line": [
      10,
      11,
      12
     ],
     "vars": {
      "current": "None",
      "result": "['Song A', 'Song B', 'Song C']"
     }
    },
    {
     "say": "None ends the while loop, and we print the songs in order.",
     "line": [
      10,
      13,
      14
     ],
     "out": "['Song A', 'Song B', 'Song C']"
    },
    {
     "say": "Notice there was no way to jump to Song C. We had to walk there, one node at a time.",
     "line": 12
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Compare",
   "title": "The same add_front, on a Python list",
   "values": [
    "Song B",
    "Song C"
   ],
   "beats": [
    {
     "say": "Now do the same thing with a plain Python list."
    },
    {
     "say": "Inserting Song A at position zero means Song B and Song C both shift one slot right.",
     "vals": [
      "Song A",
      "Song B",
      "Song C"
     ],
     "hl": [
      1,
      2
     ],
     "note": "insert(0, \"Song A\") → 2 items shifted"
    },
    {
     "say": "With ten thousand songs, that's ten thousand moves. That's O of n.",
     "vals": [
      "Song A",
      "Song B",
      "Song C"
     ],
     "hl": [
      1,
      2
     ],
     "note": "list: O(n)   ·   linked list: O(1)"
    },
    {
     "say": "But on the list, asking for slot two is one instant step.",
     "vals": [
      "Song A",
      "Song B",
      "Song C"
     ],
     "ptr": {
      "[2]": 2
     },
     "hl": 2,
     "note": "list[2] → O(1)"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "The trade-off",
   "columns": [
    "Operation",
    "Python list",
    "Linked list"
   ],
   "rows": [
    [
     "Get item #500",
     "O(1), jump to it",
     "O(n), walk from head"
    ],
    [
     "Add to the front",
     "O(n), everything shifts",
     "O(1), change pointers"
    ],
    [
     "Search for a value",
     "O(n)",
     "O(n)"
    ]
   ],
   "beats": [
    {
     "say": "So here's the trade-off.",
     "col": 0
    },
    {
     "say": "A linked list gives up instant access by position. To reach item five hundred, you walk.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "In return, adding at the front, or at a spot you've already reached, is just a pointer change.",
     "hl": 1,
     "col": 2
    },
    {
     "say": "Searching is O of n for both. Your turn's contains method walks the chain, so it's O of n too.",
     "hl": 2
    },
    {
     "say": "Undo history and browser back and forward work this way. Day to day, you'll mostly use list or deque.",
     "hl": [
      0,
      1,
      2
     ]
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
     "say": "Can you reach the hundredth item of a linked list in O of one?",
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
    },
    {
     "say": "Stacks and queues are both lists with a rule about which end you take from."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Last in, or first in?",
   "columns": [
    "",
    "Stack",
    "Queue"
   ],
   "rows": [
    [
     "Rule",
     "Last in, first out",
     "First in, first out"
    ],
    [
     "Like",
     "A stack of plates",
     "A checkout line"
    ],
    [
     "Add",
     ".append()",
     ".append()"
    ],
    [
     "Take",
     ".pop() from the end",
     ".popleft() from the front"
    ],
    [
     "Python",
     "list",
     "collections.deque"
    ],
    [
     "Used for",
     "Undo, balanced brackets",
     "Background jobs, tickets"
    ]
   ],
   "beats": [
    {
     "say": "A stack is last in, first out. Like a stack of plates, you take from the top.",
     "hl": [
      0,
      1
     ],
     "col": 1
    },
    {
     "say": "A queue is first in, first out. Like a checkout line, the first person is served first.",
     "hl": [
      0,
      1
     ],
     "col": 2
    },
    {
     "say": "Both add with append. A stack takes from the end with pop. A queue takes from the front with pop left.",
     "hl": [
      2,
      3
     ]
    },
    {
     "say": "A list works fine as a stack. For a queue, use deque.",
     "hl": 4
    },
    {
     "say": "Stacks power undo. Queues power background jobs.",
     "hl": 5,
     "dim": true
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Stack",
   "title": "Undo takes the most recent action",
   "values": [
    "typed 'hello'"
   ],
   "beats": [
    {
     "say": "Do pushes an action onto the stack. The end of the list is the top.",
     "hl": 0,
     "ptr": {
      "top": 0
     },
     "note": "do(\"typed 'hello'\")"
    },
    {
     "say": "Do again: typed world goes on top.",
     "vals": [
      "typed 'hello'",
      "typed ' world'"
     ],
     "hl": 1,
     "ptr": {
      "top": 1
     },
     "note": "do(\"typed ' world'\")"
    },
    {
     "say": "Undo pops from the top, so the most recent action comes off first.",
     "vals": [
      "typed 'hello'"
     ],
     "ptr": {
      "top": 0
     },
     "note": "undo() → \"typed ' world'\""
    },
    {
     "say": "Both do and undo touch only the end, so both are O of one.",
     "hl": 0,
     "note": "append / pop → O(1)"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Queue",
   "title": "Jobs run in the order they arrived",
   "values": [
    "email Alice"
   ],
   "beats": [
    {
     "say": "Enqueue job adds Alice's welcome email to the back of the queue.",
     "hl": 0,
     "ptr": {
      "front": 0
     },
     "note": "enqueue_job(\"send welcome email to Alice\")"
    },
    {
     "say": "Then Bob's email joins behind it.",
     "vals": [
      "email Alice",
      "email Bob"
     ],
     "hl": 1,
     "ptr": {
      "front": 0
     },
     "note": "enqueue_job(\"send welcome email to Bob\")"
    },
    {
     "say": "Process next job takes from the front. Alice was first in, so she's first out.",
     "vals": [
      "email Bob"
     ],
     "ptr": {
      "front": 0
     },
     "note": "popleft() → \"send welcome email to Alice\""
    },
    {
     "say": "Deque does that in O of one. A plain list's pop zero would shift every remaining job left: O of n.",
     "hl": 0,
     "note": "deque.popleft(): O(1)   ·   list.pop(0): O(n)"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Your turn",
   "title": "Balanced brackets with a stack",
   "values": [
    "(",
    "a",
    "(",
    "b",
    ")",
    "c",
    ")"
   ],
   "beats": [
    {
     "say": "Is balanced checks brackets with a stack. Push on an open bracket, pop on a close.",
     "note": "is_balanced(\"(a(b)c)\")"
    },
    {
     "say": "Open bracket: push. The stack holds one.",
     "hl": 0,
     "ptr": {
      "i": 0
     },
     "note": "stack: ["
    },
    {
     "say": "a is not a bracket, so skip it. Then another open bracket: push. Two on the stack.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "i": 2
     },
     "note": "stack: [ ["
    },
    {
     "say": "Skip b. The close bracket pops one off.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "hl": 4,
     "ptr": {
      "i": 4
     },
     "note": "stack: ["
    },
    {
     "say": "Skip c. The last close bracket pops the final one.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5
     ],
     "hl": 6,
     "ptr": {
      "i": 6
     },
     "note": "stack: empty"
    },
    {
     "say": "The stack ends empty, so the text is balanced. True.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
     ],
     "note": "→ True"
    },
    {
     "say": "Now open, open, close. One open bracket is left over, so it's False.",
     "vals": [
      "(",
      "(",
      ")"
     ],
     "ok": [],
     "hl": 0,
     "note": "stack left: [   → False"
    },
    {
     "say": "And close, open fails straight away. You can't pop from an empty stack.",
     "vals": [
      ")",
      "("
     ],
     "hl": 0,
     "ptr": {
      "i": 0
     },
     "note": "pop on empty → False"
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
   "kind": "table",
   "kicker": "Concept",
   "title": "Two parts, always",
   "columns": [
    "Function",
    "Base case (stop)",
    "Recursive step"
   ],
   "rows": [
    [
     "deep_sum",
     "item is a plain number: add it",
     "item is a list: deep_sum(item)"
    ],
    [
     "count_files",
     "type is \"file\": count 1",
     "type is \"folder\": count_files(item)"
    ]
   ],
   "beats": [
    {
     "say": "Every recursive function needs two parts."
    },
    {
     "say": "A base case, simple enough to answer directly, which stops the calls.",
     "col": 1
    },
    {
     "say": "And a recursive step, which calls itself on a smaller piece.",
     "col": 2
    },
    {
     "say": "In deep sum, a plain number is the base case, and a nested list triggers the recursive call.",
     "hl": 0
    },
    {
     "say": "In count files, a file is the base case, and a folder triggers the call.",
     "hl": 1
    },
    {
     "say": "Without a base case, it calls itself until Python stops it with a recursion error.",
     "col": 1
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Trace it",
   "title": "deep_sum, at the top level",
   "values": [
    "1",
    "[2, 3, [4, 5]]",
    "6",
    "[7]"
   ],
   "beats": [
    {
     "say": "Here's the nested list from the lab. At the top level it has four items.",
     "note": "nested = [1, [2, 3, [4, 5]], 6, [7]]"
    },
    {
     "say": "One is a plain number. Base case: add it. Total is one.",
     "hl": 0,
     "ptr": {
      "item": 0
     },
     "note": "total = 1"
    },
    {
     "say": "The next item is a list, so deep sum calls itself on it. That inner call returns fourteen.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "item": 1
     },
     "note": "deep_sum([2, 3, [4, 5]]) → 14, total = 15"
    },
    {
     "say": "Six is a plain number. Total is twenty one.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "item": 2
     },
     "note": "total = 21"
    },
    {
     "say": "Seven is wrapped in a list, so one more call. It returns seven.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3,
     "ptr": {
      "item": 3
     },
     "note": "deep_sum([7]) → 7, total = 28"
    },
    {
     "say": "The loop ends and deep sum returns twenty eight.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "note": "print(deep_sum(nested)) → 28"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Trace it",
   "title": "Each call hands back a smaller answer",
   "nodes": [
    {
     "id": "top",
     "label": "deep_sum(nested)",
     "x": 14,
     "y": 50,
     "sub": "total → 28",
     "art": "loop"
    },
    {
     "id": "mid",
     "label": "deep_sum([2, 3, [4, 5]])",
     "x": 50,
     "y": 24,
     "sub": "2 + 3 + …"
    },
    {
     "id": "in",
     "label": "deep_sum([4, 5])",
     "x": 86,
     "y": 24,
     "sub": "4 + 5"
    },
    {
     "id": "seven",
     "label": "deep_sum([7])",
     "x": 50,
     "y": 78,
     "sub": "7"
    }
   ],
   "edges": [
    {
     "from": "top",
     "to": "mid"
    },
    {
     "from": "mid",
     "to": "in"
    },
    {
     "from": "top",
     "to": "seven"
    }
   ],
   "beats": [
    {
     "say": "Where did fourteen come from? Let's follow the calls.",
     "show": 1,
     "on": "top"
    },
    {
     "say": "The top call meets the list two, three, four five, and calls deep sum on it.",
     "show": 2,
     "on": "mid",
     "send": {
      "from": "top",
      "to": "mid",
      "label": "[2, 3, [4, 5]]"
     }
    },
    {
     "say": "That call adds two and three, then meets the list four, five, and calls again.",
     "show": 3,
     "on": "in",
     "send": {
      "from": "mid",
      "to": "in",
      "label": "[4, 5]"
     }
    },
    {
     "say": "Four and five are plain numbers, so no more calls. It returns nine.",
     "show": 3,
     "on": "mid",
     "send": {
      "from": "in",
      "to": "mid",
      "label": "9"
     }
    },
    {
     "say": "Two plus three plus nine is fourteen, handed back to the top.",
     "show": 3,
     "on": "top",
     "send": {
      "from": "mid",
      "to": "top",
      "label": "14"
     }
    },
    {
     "say": "Later, the list with seven gets its own call, and returns seven.",
     "show": 4,
     "on": "top",
     "send": {
      "from": "seven",
      "to": "top",
      "label": "7"
     }
    },
    {
     "say": "One, plus fourteen, plus six, plus seven: twenty eight.",
     "show": 4,
     "on": [
      "top",
      "mid",
      "in",
      "seven"
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab",
   "title": "Count files in nested folders",
   "file": "files.py",
   "code": "def count_files(folder):\n    count = 0\n    for item in folder[\"items\"]:\n        if item[\"type\"] == \"file\":\n            count += 1                       # base case\n        elif item[\"type\"] == \"folder\":\n            count += count_files(item)       # recursive step\n    return count\n\nfile_system = {\"items\": [\n    {\"type\": \"file\"},\n    {\"type\": \"folder\", \"items\": [{\"type\": \"file\"}, {\"type\": \"file\"}]},\n]}\nprint(count_files(file_system))",
   "beats": [
    {
     "say": "The file system holds one file, and one folder with two files inside.",
     "line": [
      10,
      13
     ]
    },
    {
     "say": "The outer call starts its count at zero.",
     "line": [
      14,
      2
     ],
     "vars": {
      "call": "outer",
      "count": 0
     }
    },
    {
     "say": "The first item is a file. Base case: count is one.",
     "line": [
      3,
      4,
      5
     ],
     "vars": {
      "call": "outer",
      "count": 1
     }
    },
    {
     "say": "The second item is a folder, so count files calls itself on that folder.",
     "line": [
      6,
      7
     ],
     "vars": {
      "call": "inner",
      "count": 0
     }
    },
    {
     "say": "Inside, two files. The inner count reaches two, and returns it.",
     "line": [
      3,
      4,
      5,
      8
     ],
     "vars": {
      "call": "inner",
      "count": 2
     }
    },
    {
     "say": "Back in the outer call, one plus two is three.",
     "line": 7,
     "vars": {
      "call": "outer",
      "count": 3
     }
    },
    {
     "say": "Return and print: three files.",
     "line": [
      8,
      14
     ],
     "out": "3"
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
   "kind": "diagram",
   "kicker": "Lab",
   "title": "Insert product IDs into a binary search tree",
   "nodes": [
    {
     "id": "n50",
     "label": "50",
     "x": 50,
     "y": 15,
     "sub": "root"
    },
    {
     "id": "n30",
     "label": "30",
     "x": 28,
     "y": 48
    },
    {
     "id": "n70",
     "label": "70",
     "x": 72,
     "y": 48
    },
    {
     "id": "n20",
     "label": "20",
     "x": 14,
     "y": 82
    },
    {
     "id": "n40",
     "label": "40",
     "x": 40,
     "y": 82
    },
    {
     "id": "n60",
     "label": "60",
     "x": 60,
     "y": 82
    },
    {
     "id": "n80",
     "label": "80",
     "x": 86,
     "y": 82
    }
   ],
   "edges": [
    {
     "from": "n50",
     "to": "n30"
    },
    {
     "from": "n50",
     "to": "n70"
    },
    {
     "from": "n30",
     "to": "n20"
    },
    {
     "from": "n30",
     "to": "n40"
    },
    {
     "from": "n70",
     "to": "n60"
    },
    {
     "from": "n70",
     "to": "n80"
    }
   ],
   "beats": [
    {
     "say": "In a binary search tree, each node has at most two children: smaller on the left, larger on the right.",
     "show": 0
    },
    {
     "say": "We insert fifty first. The tree is empty, so fifty becomes the root.",
     "show": 1,
     "on": "n50"
    },
    {
     "say": "Thirty is smaller than fifty, so it goes left.",
     "show": 2,
     "on": "n30",
     "send": {
      "from": "n50",
      "to": "n30",
      "label": "30 < 50 → left"
     }
    },
    {
     "say": "Seventy is larger, so it goes right.",
     "show": 3,
     "on": "n70",
     "send": {
      "from": "n50",
      "to": "n70",
      "label": "70 > 50 → right"
     }
    },
    {
     "say": "Twenty: smaller than fifty, go left. Smaller than thirty, go left again.",
     "show": 4,
     "on": [
      "n30",
      "n20"
     ],
     "send": {
      "from": "n30",
      "to": "n20",
      "label": "20 < 30 → left"
     }
    },
    {
     "say": "Forty: left of fifty, but larger than thirty, so it goes right of thirty.",
     "show": 5,
     "on": [
      "n30",
      "n40"
     ],
     "send": {
      "from": "n30",
      "to": "n40",
      "label": "40 > 30 → right"
     }
    },
    {
     "say": "Sixty and eighty go right of fifty, then left and right of seventy.",
     "show": 7,
     "on": [
      "n60",
      "n80"
     ]
    },
    {
     "say": "Seven IDs, three levels. Every left side is smaller, every right side is larger.",
     "show": 7
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Trace it",
   "title": "Search follows one path down",
   "nodes": [
    {
     "id": "n50",
     "label": "50",
     "x": 50,
     "y": 15,
     "sub": "root"
    },
    {
     "id": "n30",
     "label": "30",
     "x": 28,
     "y": 48
    },
    {
     "id": "n70",
     "label": "70",
     "x": 72,
     "y": 48
    },
    {
     "id": "n20",
     "label": "20",
     "x": 14,
     "y": 82
    },
    {
     "id": "n40",
     "label": "40",
     "x": 40,
     "y": 82
    },
    {
     "id": "n60",
     "label": "60",
     "x": 60,
     "y": 82
    },
    {
     "id": "n80",
     "label": "80",
     "x": 86,
     "y": 82
    }
   ],
   "edges": [
    {
     "from": "n50",
     "to": "n30"
    },
    {
     "from": "n50",
     "to": "n70"
    },
    {
     "from": "n30",
     "to": "n20"
    },
    {
     "from": "n30",
     "to": "n40"
    },
    {
     "from": "n70",
     "to": "n60"
    },
    {
     "from": "n70",
     "to": "n80"
    }
   ],
   "beats": [
    {
     "say": "Contains sixty. Start at the root: sixty is larger than fifty, so go right.",
     "on": "n50",
     "send": {
      "from": "n50",
      "to": "n70",
      "label": "60 > 50 → right"
     }
    },
    {
     "say": "Sixty is smaller than seventy, so go left.",
     "on": "n70",
     "send": {
      "from": "n70",
      "to": "n60",
      "label": "60 < 70 → left"
     }
    },
    {
     "say": "Sixty equals sixty. True, after just three checks. The whole left side was never looked at.",
     "on": "n60"
    },
    {
     "say": "Contains ninety nine. Larger than fifty, go right. Larger than seventy, go right.",
     "on": [
      "n50",
      "n70"
     ],
     "send": {
      "from": "n70",
      "to": "n80",
      "label": "99 > 70 → right"
     }
    },
    {
     "say": "Larger than eighty, but eighty has no right child. We hit None, so it returns False.",
     "on": "n80"
    },
    {
     "say": "Your turn's min value just keeps going left from the root: fifty, thirty, twenty.",
     "on": [
      "n50",
      "n30",
      "n20"
     ],
     "send": {
      "from": "n30",
      "to": "n20",
      "label": "min_value() → 20"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Why it's fast",
   "title": "Each check cuts the tree roughly in half",
   "columns": [
    "Values in a balanced tree",
    "Most checks to find one"
   ],
   "rows": [
    [
     "7",
     "3"
    ],
    [
     "15",
     "4"
    ],
    [
     "1,000",
     "10"
    ],
    [
     "1,000,000",
     "20"
    ]
   ],
   "beats": [
    {
     "say": "Every check throws away about half of what's left, just like binary search."
    },
    {
     "say": "Our catalogue has seven values, so any search takes at most three checks.",
     "hl": 0
    },
    {
     "say": "Double it to fifteen, and that's only one more level.",
     "hl": 1
    },
    {
     "say": "A million values, about twenty checks. That's O of log n.",
     "hl": 3,
     "dim": true,
     "col": 1
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Watch out",
   "title": "Sorted inserts make a lopsided tree",
   "nodes": [
    {
     "id": "s20",
     "label": "20",
     "x": 12,
     "y": 15,
     "sub": "root"
    },
    {
     "id": "s30",
     "label": "30",
     "x": 31,
     "y": 33
    },
    {
     "id": "s40",
     "label": "40",
     "x": 50,
     "y": 50
    },
    {
     "id": "s50",
     "label": "50",
     "x": 69,
     "y": 67
    },
    {
     "id": "s60",
     "label": "60",
     "x": 88,
     "y": 85
    }
   ],
   "edges": [
    {
     "from": "s20",
     "to": "s30"
    },
    {
     "from": "s30",
     "to": "s40"
    },
    {
     "from": "s40",
     "to": "s50"
    },
    {
     "from": "s50",
     "to": "s60"
    }
   ],
   "beats": [
    {
     "say": "But insert values already in sorted order, twenty, thirty, forty, fifty, sixty, and see what happens.",
     "show": 1,
     "on": "s20"
    },
    {
     "say": "Each new value is larger than everything before it, so it always goes right.",
     "show": 3,
     "on": "s40",
     "send": {
      "from": "s30",
      "to": "s40",
      "label": "40 > 30 → right"
     }
    },
    {
     "say": "The tree becomes one long chain.",
     "show": 5,
     "on": "s60"
    },
    {
     "say": "Now searching for sixty takes five checks, one per node. It's behaved like a linked list: O of n.",
     "show": 5,
     "on": [
      "s20",
      "s30",
      "s40",
      "s50",
      "s60"
     ]
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
   "kind": "diagram",
   "kicker": "Lab",
   "title": "B F S explores level by level",
   "nodes": [
    {
     "id": "alice",
     "label": "Alice",
     "x": 12,
     "y": 50,
     "sub": "start",
     "art": "persona"
    },
    {
     "id": "bob",
     "label": "Bob",
     "x": 48,
     "y": 18,
     "sub": "follows Dave",
     "art": "persona"
    },
    {
     "id": "carol",
     "label": "Carol",
     "x": 48,
     "y": 82,
     "sub": "follows Dave",
     "art": "persona"
    },
    {
     "id": "dave",
     "label": "Dave",
     "x": 86,
     "y": 50,
     "sub": "target",
     "art": "persona"
    }
   ],
   "edges": [
    {
     "from": "alice",
     "to": "bob"
    },
    {
     "from": "alice",
     "to": "carol"
    },
    {
     "from": "bob",
     "to": "dave"
    },
    {
     "from": "carol",
     "to": "dave"
    }
   ],
   "beats": [
    {
     "say": "A small social graph. Alice follows Bob and Carol, and they both follow Dave.",
     "show": 4
    },
    {
     "say": "We want the shortest path from Alice to Dave. Breadth first search starts at Alice.",
     "show": 4,
     "on": "alice"
    },
    {
     "say": "Level one: everyone Alice follows. Bob first.",
     "show": 4,
     "on": "bob",
     "send": {
      "from": "alice",
      "to": "bob",
      "label": "[Alice, Bob]"
     }
    },
    {
     "say": "Then Carol. Both paths join the back of the queue.",
     "show": 4,
     "on": "carol",
     "send": {
      "from": "alice",
      "to": "carol",
      "label": "[Alice, Carol]"
     }
    },
    {
     "say": "Level two: Bob's turn. He follows Dave, who hasn't been visited yet, so Dave is marked visited.",
     "show": 4,
     "on": "dave",
     "send": {
      "from": "bob",
      "to": "dave",
      "label": "[Alice, Bob, Dave]"
     }
    },
    {
     "say": "Carol also follows Dave, but Dave is already visited, so that path is skipped.",
     "show": 4,
     "on": "carol"
    },
    {
     "say": "The path ending at Dave reaches the front of the queue. Found: Alice, Bob, Dave.",
     "show": 4,
     "on": [
      "alice",
      "bob",
      "dave"
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Trace it",
   "title": "The queue holds paths, not just people",
   "file": "bfs.py",
   "code": "def bfs_shortest_path(graph, start, target):\n    visited = {start}\n    queue = deque([[start]])   # queue of paths, not just nodes\n    while queue:\n        path = queue.popleft()\n        node = path[-1]\n        if node == target:\n            return path\n        for neighbor in graph.get(node, []):\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(path + [neighbor])\n    return None  # no path found\nprint(bfs_shortest_path(graph, \"Alice\", \"Dave\"))",
   "beats": [
    {
     "say": "Start: Alice is visited, and the queue holds one path, just Alice.",
     "line": [
      2,
      3
     ],
     "vars": {
      "visited": "{Alice}",
      "queue": "[[Alice]]"
     }
    },
    {
     "say": "Pop left takes that path. The last node is Alice, not Dave.",
     "line": [
      5,
      6,
      7
     ],
     "vars": {
      "visited": "{Alice}",
      "queue": "[]",
      "path": "[Alice]",
      "node": "Alice"
     }
    },
    {
     "say": "Bob and Carol are new, so both are visited and their paths join the queue.",
     "line": [
      9,
      10,
      11,
      12
     ],
     "vars": {
      "visited": "{Alice, Bob, Carol}",
      "queue": "[[Alice, Bob], [Alice, Carol]]",
      "path": "[Alice]",
      "node": "Alice"
     }
    },
    {
     "say": "Next path: Alice, Bob. Bob follows Dave, who is new, so that path joins the back.",
     "line": [
      5,
      6,
      9,
      10,
      11,
      12
     ],
     "vars": {
      "visited": "{Alice, Bob, Carol, Dave}",
      "queue": "[[Alice, Carol], [Alice, Bob, Dave]]",
      "path": "[Alice, Bob]",
      "node": "Bob"
     }
    },
    {
     "say": "Next: Alice, Carol. Carol follows Dave, but Dave is already visited. Nothing is added.",
     "line": [
      5,
      6,
      9,
      10
     ],
     "vars": {
      "visited": "{Alice, Bob, Carol, Dave}",
      "queue": "[[Alice, Bob, Dave]]",
      "path": "[Alice, Carol]",
      "node": "Carol"
     }
    },
    {
     "say": "Last path: Alice, Bob, Dave. The node is Dave, the target. Return the path.",
     "line": [
      5,
      6,
      7,
      8
     ],
     "vars": {
      "visited": "{Alice, Bob, Carol, Dave}",
      "queue": "[]",
      "path": "[Alice, Bob, Dave]",
      "node": "Dave"
     },
     "out": "['Alice', 'Bob', 'Dave']"
    },
    {
     "say": "Because the queue is first in, first out, shorter paths always come out before longer ones.",
     "line": 3
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Your turn",
   "title": "Why a loop doesn't trap B F S",
   "nodes": [
    {
     "id": "alice",
     "label": "Alice",
     "x": 12,
     "y": 50,
     "sub": "→ Bob, Carol",
     "art": "persona"
    },
    {
     "id": "bob",
     "label": "Bob",
     "x": 48,
     "y": 18,
     "sub": "start",
     "art": "persona"
    },
    {
     "id": "carol",
     "label": "Carol",
     "x": 48,
     "y": 82,
     "sub": "target",
     "art": "persona"
    },
    {
     "id": "dave",
     "label": "Dave",
     "x": 86,
     "y": 50,
     "sub": "→ Eve",
     "art": "persona"
    },
    {
     "id": "eve",
     "label": "Eve",
     "x": 70,
     "y": 82,
     "sub": "→ Alice",
     "art": "persona"
    }
   ],
   "edges": [
    {
     "from": "alice",
     "to": "bob"
    },
    {
     "from": "alice",
     "to": "carol"
    },
    {
     "from": "bob",
     "to": "dave"
    },
    {
     "from": "dave",
     "to": "eve"
    },
    {
     "from": "eve",
     "to": "alice"
    }
   ],
   "beats": [
    {
     "say": "In your turn, Dave follows Eve, and Eve follows Alice. Now there's a loop.",
     "show": 5,
     "on": [
      "alice",
      "bob",
      "dave",
      "eve"
     ]
    },
    {
     "say": "Find Bob to Carol. From Bob, the only way out is Dave.",
     "show": 5,
     "on": "dave",
     "send": {
      "from": "bob",
      "to": "dave",
      "label": "[Bob, Dave]"
     }
    },
    {
     "say": "Dave leads to Eve.",
     "show": 5,
     "on": "eve",
     "send": {
      "from": "dave",
      "to": "eve",
      "label": "[Bob, Dave, Eve]"
     }
    },
    {
     "say": "Eve leads to Alice.",
     "show": 5,
     "on": "alice",
     "send": {
      "from": "eve",
      "to": "alice",
      "label": "[Bob, Dave, Eve, Alice]"
     }
    },
    {
     "say": "Alice follows Bob, but Bob is already visited, so B F S doesn't go round again.",
     "show": 5,
     "on": "bob"
    },
    {
     "say": "Alice also follows Carol. Found: Bob, Dave, Eve, Alice, Carol. The visited set is what stops the loop.",
     "show": 5,
     "on": "carol",
     "send": {
      "from": "alice",
      "to": "carol",
      "label": "→ Carol"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "B F S or D F S?",
   "columns": [
    "",
    "BFS (breadth-first)",
    "DFS (depth-first)"
   ],
   "rows": [
    [
     "Explores",
     "Level by level",
     "As deep as possible, then backtracks"
    ],
    [
     "Uses",
     "A queue (FIFO)",
     "A stack, or recursion"
    ],
    [
     "Guarantees",
     "First path found is shortest",
     "No shortest-path promise"
    ],
    [
     "Good for",
     "Shortest path, degrees of connection",
     "Exploring all possibilities"
    ]
   ],
   "beats": [
    {
     "say": "There are two classic ways to explore a graph.",
     "col": 0
    },
    {
     "say": "B F S explores level by level. D F S dives as deep as it can, then backs up.",
     "hl": 0
    },
    {
     "say": "B F S uses a queue. That first in, first out order is what makes it go level by level.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "So the first path B F S finds is the shortest. D F S makes no such promise.",
     "hl": 2,
     "col": 1
    },
    {
     "say": "Shortest route, degrees of connection: use B F S. Exploring every possibility: D F S is fine.",
     "hl": 3
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
     "say": "What does B F S guarantee that D F S doesn't?",
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
   "kind": "array",
   "kicker": "Lab",
   "title": "Sort products by price",
   "values": [
    "Laptop · 1200",
    "Mouse · 25",
    "Monitor · 300"
   ],
   "beats": [
    {
     "say": "Three products, in the order they were added."
    },
    {
     "say": "The key, a lambda, tells sorted what to compare: each product's price.",
     "hl": [
      0,
      1,
      2
     ],
     "note": "key=lambda p: p[\"price\"] → 1200, 25, 300"
    },
    {
     "say": "Smallest price first: Mouse, Monitor, Laptop.",
     "vals": [
      "Mouse · 25",
      "Monitor · 300",
      "Laptop · 1200"
     ],
     "ok": [
      0,
      1,
      2
     ],
     "note": "by_price → ['Mouse', 'Monitor', 'Laptop']"
    },
    {
     "say": "Add reverse equals True, and you get the most expensive first.",
     "vals": [
      "Laptop · 1200",
      "Monitor · 300",
      "Mouse · 25"
     ],
     "ok": [
      0,
      1,
      2
     ],
     "note": "by_price_desc → ['Laptop', 'Monitor', 'Mouse']"
    },
    {
     "say": "And products itself? Unchanged. Sorted always returns a new list.",
     "vals": [
      "Laptop · 1200",
      "Mouse · 25",
      "Monitor · 300"
     ],
     "ok": [],
     "note": "products is still in its original order"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab",
   "title": "Sort by two fields with a tuple",
   "columns": [
    "name",
    "category",
    "price",
    "key tuple"
   ],
   "rows": [
    [
     "Laptop",
     "Electronics",
     "1200",
     "(\"Electronics\", 1200)"
    ],
    [
     "Desk",
     "Furniture",
     "300",
     "(\"Furniture\", 300)"
    ],
    [
     "Mouse",
     "Electronics",
     "25",
     "(\"Electronics\", 25)"
    ]
   ],
   "beats": [
    {
     "say": "Now sort by category first, then by price.",
     "sql": "sorted(products_with_category,\n       key=lambda p: (p[\"category\"], p[\"price\"]))"
    },
    {
     "say": "The key turns each product into a tuple: category, then price.",
     "col": 3
    },
    {
     "say": "Tuples compare their first value first. Electronics comes before Furniture, so Laptop and Mouse go ahead of Desk.",
     "hl": [
      0,
      2
     ],
     "col": 1
    },
    {
     "say": "Laptop and Mouse tie on category, so the price breaks the tie. Twenty five beats twelve hundred.",
     "hl": [
      0,
      2
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "Result: Mouse, Laptop, Desk, in one pass.",
     "sql": "→ ['Mouse', 'Laptop', 'Desk']"
    },
    {
     "say": "For your turn, use minus price, and the highest price comes first in each category: Laptop, Mouse, Desk.",
     "sql": "key=lambda p: (p[\"category\"], -p[\"price\"])\n→ ['Laptop', 'Mouse', 'Desk']",
     "col": 2
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Heap",
   "title": "A heap keeps the most urgent task in front",
   "values": [
    "(3, Reply to email)"
   ],
   "beats": [
    {
     "say": "A heap holds tasks as priority and name. A lower number means more urgent. First, reply to email, priority three.",
     "hl": 0,
     "note": "heappush(tasks, (3, \"Reply to email\"))"
    },
    {
     "say": "Push fix login bug, priority one. It lands at the end.",
     "vals": [
      "(3, Reply to email)",
      "(1, Fix login bug)"
     ],
     "hl": 1,
     "note": "heappush(tasks, (1, \"Fix login bug\"))"
    },
    {
     "say": "One is smaller than its parent, three, so they swap. The smallest is now at the front.",
     "vals": [
      "(1, Fix login bug)",
      "(3, Reply to email)"
     ],
     "hl": [
      0,
      1
     ],
     "note": "sift up: 1 < 3 → swap"
    },
    {
     "say": "Push review pull request, priority two. Its parent is one, which is smaller, so it stays.",
     "vals": [
      "(1, Fix login bug)",
      "(3, Reply to email)",
      "(2, Review pull request)"
     ],
     "hl": 2,
     "note": "heappush(tasks, (2, \"Review pull request\"))"
    },
    {
     "say": "Notice the list isn't fully sorted. Three sits before two. A heap only promises the smallest is at index zero.",
     "ptr": {
      "tasks[0]": 0
     },
     "hl": 0,
     "note": "tasks[0] → (1, 'Fix login bug')"
    },
    {
     "say": "Heap pop removes fix login bug. The last task moves to the front, and two is still smaller than three.",
     "vals": [
      "(2, Review pull request)",
      "(3, Reply to email)"
     ],
     "hl": 0,
     "note": "heappop(tasks) → (1, 'Fix login bug'), O(log n)"
    },
    {
     "say": "And n smallest two gives the next two most urgent tasks.",
     "vals": [
      "(2, Review pull request)",
      "(3, Reply to email)"
     ],
     "ok": [
      0,
      1
     ],
     "note": "nsmallest(2, tasks) → [(2, …), (3, …)]"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Sort once, or keep a heap?",
   "columns": [
    "You need",
    "Reach for",
    "Cost"
   ],
   "rows": [
    [
     "A list in order, once",
     "sorted()",
     "O(n log n)"
    ],
    [
     "The most urgent item, again and again",
     "heapq",
     "O(log n) per add or remove"
    ],
    [
     "To re-sort after every new item",
     "Usually a mistake",
     "O(n log n) every time"
    ]
   ],
   "beats": [
    {
     "say": "So when do you sort, and when do you use a heap?",
     "col": 0
    },
    {
     "say": "If you need the whole list in order, once, sorted is perfect.",
     "hl": 0
    },
    {
     "say": "If you keep needing the most urgent item while new ones arrive, a heap costs only log n each time.",
     "hl": 1,
     "col": 2
    },
    {
     "say": "Re-sorting a huge list after every change repeats the same work over and over.",
     "hl": 2,
     "dim": true
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
     "say": "Does sorted change the original list?",
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
    },
    {
     "say": "There are two ways to find something: check every item, or, if the data is sorted, keep cutting it in half."
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Linear search",
   "title": "Check every item, one by one",
   "values": [
    0,
    2,
    4,
    6,
    8,
    10,
    12,
    14,
    16,
    18
   ],
   "beats": [
    {
     "say": "The lab uses half a million sorted even numbers. Here's the same idea with ten: zero to eighteen. We want fourteen.",
     "note": "sorted_ids = list(range(0, 20, 2))"
    },
    {
     "say": "Linear search starts at index zero. Zero isn't fourteen.",
     "hl": 0,
     "ptr": {
      "i": 0
     },
     "note": "0 ≠ 14"
    },
    {
     "say": "It keeps going, one item at a time: two, four, six, eight, ten, twelve.",
     "gone": [
      0,
      1,
      2,
      3,
      4,
      5
     ],
     "hl": 6,
     "ptr": {
      "i": 6
     },
     "note": "7 checks so far"
    },
    {
     "say": "Fourteen, at index seven, on the eighth check.",
     "gone": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
     ],
     "hl": 7,
     "ptr": {
      "i": 7
     },
     "note": "return 7 → 8 checks"
    },
    {
     "say": "In the real list, forty five thousand sits at index twenty two thousand five hundred. That's twenty two thousand five hundred and one checks.",
     "gone": [],
     "note": "linear_search(sorted_ids, 45000) → 22,501 checks"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Binary search",
   "title": "Halve the search every step",
   "values": [
    0,
    2,
    4,
    6,
    8,
    10,
    12,
    14,
    16,
    18
   ],
   "beats": [
    {
     "say": "Binary search, same list, same target: fourteen. Low starts at zero, high at nine.",
     "ptr": {
      "low": 0,
      "high": 9
     }
    },
    {
     "say": "The middle is index four, holding eight.",
     "hl": 4,
     "ptr": {
      "low": 0,
      "mid": 4,
      "high": 9
     },
     "note": "mid = (0 + 9) // 2 = 4"
    },
    {
     "say": "Eight is less than fourteen, so fourteen must be to the right. Everything up to eight is ruled out.",
     "gone": [
      0,
      1,
      2,
      3,
      4
     ],
     "ptr": {
      "low": 5,
      "high": 9
     },
     "note": "8 < 14 → low = 5"
    },
    {
     "say": "New middle: index seven, holding fourteen. Found, in two checks.",
     "hl": 7,
     "ptr": {
      "low": 5,
      "mid": 7,
      "high": 9
     },
     "note": "mid = (5 + 9) // 2 = 7 → return 7"
    },
    {
     "say": "On the real list of half a million, finding forty five thousand takes seventeen checks.",
     "gone": [
      0,
      1,
      2,
      3,
      4
     ],
     "ok": [
      7
     ],
     "note": "binary_search(sorted_ids, 45000) → 17 checks"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Trace it",
   "title": "What happens when the target isn't there",
   "file": "search.py",
   "code": "def binary_search(sorted_items, target):\n    low, high = 0, len(sorted_items) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if sorted_items[mid] == target:\n            return mid\n        elif sorted_items[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nprint(binary_search(list(range(0, 20, 2)), 15))",
   "beats": [
    {
     "say": "Same ten numbers, but now we search for fifteen, which isn't there.",
     "line": [
      13,
      2
     ],
     "vars": {
      "target": 15,
      "low": 0,
      "high": 9
     }
    },
    {
     "say": "Middle is index four: eight. Eight is less than fifteen, so low moves to five.",
     "line": [
      3,
      4,
      7,
      8
     ],
     "vars": {
      "target": 15,
      "low": 5,
      "high": 9,
      "mid": 4
     }
    },
    {
     "say": "Middle is index seven: fourteen. Still less than fifteen, so low moves to eight.",
     "line": [
      3,
      4,
      7,
      8
     ],
     "vars": {
      "target": 15,
      "low": 8,
      "high": 9,
      "mid": 7
     }
    },
    {
     "say": "Middle is index eight: sixteen. That's more than fifteen, so high moves down to seven.",
     "line": [
      3,
      4,
      9,
      10
     ],
     "vars": {
      "target": 15,
      "low": 8,
      "high": 7,
      "mid": 8
     }
    },
    {
     "say": "Now low, eight, is bigger than high, seven. There's nothing left to search, so the loop ends.",
     "line": 3
    },
    {
     "say": "It returns minus one: not found, after only three checks.",
     "line": 11,
     "out": "-1"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Why it matters",
   "title": "Half a million items, about twenty checks",
   "columns": [
    "Sorted items",
    "Linear: worst case",
    "Binary: worst case"
   ],
   "rows": [
    [
     "10",
     "10",
     "4"
    ],
    [
     "1,000",
     "1,000",
     "10"
    ],
    [
     "500,000",
     "500,000",
     "19"
    ]
   ],
   "beats": [
    {
     "say": "Here's the most checks each search can need."
    },
    {
     "say": "With ten items, it hardly matters: ten checks, or four.",
     "hl": 0
    },
    {
     "say": "With a thousand, it's a thousand checks against ten.",
     "hl": 1
    },
    {
     "say": "With the lab's half a million, linear search may need half a million checks. Binary search never needs more than nineteen.",
     "hl": 2,
     "dim": true,
     "col": 2
    },
    {
     "say": "Each step halves what's left. That's O of log n.",
     "col": 2
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Watch out",
   "title": "Binary search on unsorted data",
   "values": [
    9,
    4,
    7,
    1,
    3
   ],
   "beats": [
    {
     "say": "Now try binary search on a list that isn't sorted. We look for nine, which is right at index zero."
    },
    {
     "say": "The middle is seven. Seven is less than nine, so it throws away the left half, including nine.",
     "hl": 2,
     "gone": [
      0,
      1,
      2
     ],
     "ptr": {
      "mid": 2
     },
     "note": "7 < 9 → low = 3"
    },
    {
     "say": "Then one, then three. Both smaller, so it keeps going right.",
     "gone": [
      0,
      1,
      2,
      3,
      4
     ],
     "ptr": {
      "mid": 4
     },
     "note": "1 < 9, 3 < 9"
    },
    {
     "say": "It runs out and returns minus one. Wrong: nine was there all along. Binary search needs sorted data.",
     "gone": [
      1,
      2,
      3,
      4
     ],
     "hl": 0,
     "note": "returns -1, but 9 is at index 0"
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
   "kind": "diagram",
   "kicker": "Concept",
   "title": "fib_slow repeats the same work",
   "nodes": [
    {
     "id": "f5",
     "label": "fib_slow(5)",
     "x": 50,
     "y": 14
    },
    {
     "id": "f4",
     "label": "fib_slow(4)",
     "x": 26,
     "y": 48
    },
    {
     "id": "f3r",
     "label": "fib_slow(3)",
     "x": 76,
     "y": 48,
     "sub": "computed again!"
    },
    {
     "id": "f3l",
     "label": "fib_slow(3)",
     "x": 12,
     "y": 84
    },
    {
     "id": "f2",
     "label": "fib_slow(2)",
     "x": 40,
     "y": 84
    }
   ],
   "edges": [
    {
     "from": "f5",
     "to": "f4"
    },
    {
     "from": "f5",
     "to": "f3r"
    },
    {
     "from": "f4",
     "to": "f3l"
    },
    {
     "from": "f4",
     "to": "f2"
    }
   ],
   "beats": [
    {
     "say": "Fib slow of five adds fib of four and fib of three.",
     "show": 3,
     "on": "f5"
    },
    {
     "say": "Fib of four, in turn, needs fib of three and fib of two.",
     "show": 5,
     "on": "f4"
    },
    {
     "say": "Look: fib of three appears twice. Each copy does the whole calculation from scratch.",
     "show": 5,
     "on": [
      "f3l",
      "f3r"
     ]
    },
    {
     "say": "Lower down, it gets worse. Fib of two is worked out three times, and fib of one five times.",
     "show": 5,
     "on": "f2"
    },
    {
     "say": "Nothing is remembered, so the same answers are recalculated again and again.",
     "show": 5
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Trace it",
   "title": "Count the calls",
   "columns": [
    "Call",
    "Times computed in fib_slow(5)"
   ],
   "rows": [
    [
     "fib(5)",
     "1"
    ],
    [
     "fib(4)",
     "1"
    ],
    [
     "fib(3)",
     "2"
    ],
    [
     "fib(2)",
     "3"
    ],
    [
     "fib(1)",
     "5"
    ],
    [
     "fib(0)",
     "3"
    ]
   ],
   "beats": [
    {
     "say": "Here's how many times each value gets computed for fib slow of five.",
     "col": 1
    },
    {
     "say": "Fib of three twice, fib of two three times, fib of one five times.",
     "hl": [
      2,
      3,
      4
     ],
     "col": 1
    },
    {
     "say": "Fifteen calls in total, just for five.",
     "sql": "fib_slow(5) → 15 calls"
    },
    {
     "say": "For thirty, it's two million, six hundred ninety two thousand, five hundred thirty seven calls.",
     "sql": "fib_slow(30) → 2,692,537 calls"
    },
    {
     "say": "With memoization, fib fast of thirty needs fifty nine.",
     "sql": "fib_slow(30) → 2,692,537 calls\nfib_fast(30) → 59 calls"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab",
   "title": "fib_fast remembers every answer",
   "file": "fib.py",
   "code": "def fib_fast(n, memo=None):\n    if memo is None:\n        memo = {}\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fib_fast(n - 1, memo) + fib_fast(n - 2, memo)\n    return memo[n]\n\nprint(fib_fast(5))",
   "beats": [
    {
     "say": "Call fib fast of five. The memo starts as an empty dictionary.",
     "line": [
      11,
      2,
      3
     ],
     "vars": {
      "n": 5,
      "memo": "{}"
     }
    },
    {
     "say": "Line eight asks for fib of four, which asks for three, which asks for two.",
     "line": 8,
     "vars": {
      "n": 2,
      "memo": "{}"
     }
    },
    {
     "say": "Fib of one and fib of zero are base cases: one and zero. So memo two is one.",
     "line": [
      6,
      7,
      8
     ],
     "vars": {
      "n": 2,
      "memo": "{2: 1}"
     }
    },
    {
     "say": "Back in fib of three: one plus one. Memo three is two.",
     "line": 8,
     "vars": {
      "n": 3,
      "memo": "{2: 1, 3: 2}"
     }
    },
    {
     "say": "Fib of four needs fib of two. It's already in the memo, so it comes back instantly.",
     "line": [
      4,
      5
     ],
     "vars": {
      "n": 4,
      "memo": "{2: 1, 3: 2}"
     }
    },
    {
     "say": "Memo four is three.",
     "line": 8,
     "vars": {
      "n": 4,
      "memo": "{2: 1, 3: 2, 4: 3}"
     }
    },
    {
     "say": "Fib of five needs fib of three: another instant memo hit. Three plus two is five.",
     "line": [
      4,
      5,
      8,
      9
     ],
     "vars": {
      "n": 5,
      "memo": "{2: 1, 3: 2, 4: 3, 5: 5}"
     },
     "out": "5"
    },
    {
     "say": "Every value was computed once. That's the whole trick.",
     "line": 8
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab",
   "title": "The same idea, for prices",
   "file": "shipping.py",
   "code": "price_cache = {}\n\ndef calculate_shipping_cost(weight_kg, distance_km):\n    key = (weight_kg, distance_km)\n    if key in price_cache:\n        return price_cache[key]           # instant, already computed\n    cost = (weight_kg * 2.5) + (distance_km * 0.1)\n    price_cache[key] = cost\n    return cost\n\nprint(calculate_shipping_cost(2, 100))\nprint(calculate_shipping_cost(2, 100))\nprint(len(price_cache))",
   "beats": [
    {
     "say": "The cache starts empty.",
     "line": 1,
     "vars": {
      "price_cache": "{}"
     }
    },
    {
     "say": "Two kilos, a hundred kilometres. The key is the pair, two and one hundred. Not in the cache.",
     "line": [
      11,
      4,
      5
     ],
     "vars": {
      "key": "(2, 100)",
      "price_cache": "{}"
     }
    },
    {
     "say": "So we calculate: five plus ten, fifteen. Store it, and return it.",
     "line": [
      7,
      8,
      9
     ],
     "vars": {
      "key": "(2, 100)",
      "cost": 15.0,
      "price_cache": "{(2, 100): 15.0}"
     },
     "out": "15.0"
    },
    {
     "say": "Same inputs again. This time the key is in the cache, so it returns straight away.",
     "line": [
      12,
      5,
      6
     ],
     "vars": {
      "key": "(2, 100)",
      "price_cache": "{(2, 100): 15.0}"
     },
     "out": "15.0"
    },
    {
     "say": "Only one result is stored. It's caching, applied to a calculation.",
     "line": 13,
     "out": "1"
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
     "say": "That's Module 11.",
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
