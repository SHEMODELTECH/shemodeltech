# Data Structures & Algorithms for Builders: A Practical Beginner's Course

## Course Overview

**Who this is for:** Beginners who can write basic Python (variables, functions, loops) and want to understand data structures and algorithms not as interview trivia, but as tools you reach for when building real software.

**How the course works:** Twelve modules. Every topic follows the same pattern:
- **Concept** - what it is, in plain language
- **Code** - a working implementation
- **Where you'd actually use this** - a real product scenario, not a puzzle
- **Lab** - something to build yourself
- **Checkpoint**
- **Quiz** - five questions with answers

**Tools needed:** Python 3.10+, a code editor, and a terminal. (If you completed the previous "Build Your First Product" course, you already have everything set up.)

---

## Module 0: Why This Matters - Big O and How to Think About Speed

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

### Checkpoint
You ran the timing comparison and can explain, in your own words, why the fast version wins.

### Quiz
1. What does Big O actually measure?
2. Is O(n) always slower than O(1) in absolute terms?
3. Why might an O(n²) function feel fine during development but fail in production?
4. What's the growth difference between O(n) and O(n²) as data doubles?
5. Why does `has_duplicates_fast` avoid the nested loop?

*Answers: 1) How an algorithm's cost grows as input size grows, not the exact runtime. 2) Not necessarily for small inputs - but as data grows, O(1) wins. 3) Test data is often small; the cost only becomes visible at real-world scale. 4) O(n) roughly doubles; O(n²) roughly quadruples. 5) It uses a set for instant membership checks instead of comparing every pair.*

---

## Module 1: Arrays & Strings - The Structures You Already Use

### Concept

An **array** (Python's `list`) stores items in order, each accessible instantly by position (index). Strings behave similarly - a sequence of characters.

Key operations and their costs:
- Access by index: O(1)
- Search for a value: O(n)
- Insert/remove at the end: O(1)
- Insert/remove at the start or middle: O(n) - everything after has to shift

### Where you'd actually use this

A product's activity feed, a shopping cart, a list of search results - anything ordered and iterated over sequentially is an array. Knowing that inserting at the *front* is expensive is why systems that need fast inserts at both ends use a different structure (see Module 4: deques).

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

### Checkpoint
You can explain why appending to a list is fast but inserting at position 0 is slow.

### Quiz
1. What is the cost of accessing `my_list[500]` directly?
2. Why is removing an item from the front of a list slower than removing from the end?
3. What real product feature is naturally an array?
4. What does `cleaned[::-1]` do?
5. Why check `item in cart` before calling `.remove()`?

*Answers: 1) O(1) - instant, regardless of list size. 2) Every remaining item has to shift over by one position. 3) An ordered feed, list, or history (many valid answers). 4) Reverses the string. 5) To avoid an error if the item isn't in the cart at all.*

---

## Module 2: Hash Maps - The Structure Behind Fast Lookups

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

### Checkpoint
You can explain why looking up a user in a dictionary is faster than looping through a list of users checking each email.

### Quiz
1. What does a hash map trade extra memory for?
2. Why is `users_by_email.get(email)` faster than looping through a list of user objects?
3. What happens if you use `counts[word] += 1` instead of `.get(word, 0)` on a new word?
4. Name two real product features that rely on hash maps.
5. Is dictionary order guaranteed in modern Python?

*Answers: 1) Speed - O(1) lookups at the cost of using more memory than a plain list. 2) The dictionary jumps directly to the value via the hashed key instead of checking every item one by one. 3) It would raise a `KeyError` because the key doesn't exist yet. 4) User lookup by email/username, caching, deduplication, counting/analytics (any two). 5) Yes, as of Python 3.7+, dictionaries preserve insertion order - but you should not rely on this for correctness-critical logic.*

---

## Module 3: Sets - Fast Membership and Uniqueness

### Concept

A **set** stores unique, unordered values, with no duplicates allowed. Like a dictionary, it's built on hashing, so checking "is this value in the set?" is O(1), the same speed no matter how large the set gets. Sets also give you fast mathematical operations: union (combine), intersection (overlap), and difference (what's in one but not the other).

### Where you'd actually use this

Deduplicating a list of emails before sending a campaign, checking if a user has already performed an action ("has this user already voted?"), finding shared interests between two users (intersection), or filtering out already-processed IDs in a pipeline. Any time the question is "have I seen this before?" or "what do these two groups have in common?", a set is the right tool.

### Lab

```python
# Deduplicating email addresses before a send
raw_emails = ["a@x.com", "b@x.com", "a@x.com", "c@x.com", "b@x.com"]
unique_emails = set(raw_emails)
print(unique_emails)          # {'a@x.com', 'b@x.com', 'c@x.com'}
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

print("Shared:", shared)          # {'chess', 'coding'}
print("Only Alice:", only_alice)  # {'hiking', 'reading'}
print("Everyone:", everyone)      # union of both sets
```

### Checkpoint
You can explain why `order_id in processed_order_ids` stays fast even as the set grows to a million entries, and you've used at least one set operation (`&`, `-`, or `|`).

### Quiz
1. What's the main difference between a set and a list?
2. Why is checking membership in a set O(1) instead of O(n)?
3. What does `&` do when used between two sets?
4. Why would deduplicating a list with `set()` be faster than checking for duplicates manually with a loop?
5. Name a real feature where "has this user already done X?" logic would use a set.

*Answers: 1) A set stores only unique values with no guaranteed order; a list allows duplicates and preserves order. 2) It uses the same hashing approach as a dictionary, jumping directly to where a value would be rather than scanning everything. 3) Returns the intersection, the values present in both sets. 4) Because `set()` uses O(1) hashing internally instead of comparing every item against every other item. 5) Rate-limiting, "already voted" checks, deduplicating processed webhook or order IDs (any valid example).*

---

## Module 4: Linked Lists - When Order Matters More Than Instant Access

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

### Checkpoint
You can explain why `add_front` is O(1) for a linked list but O(n) for a Python list.

### Quiz
1. What's the main trade-off of a linked list compared to an array?
2. Why is inserting at the front O(1) for a linked list?
3. What real feature resembles a linked list (chain of connected items)?
4. Can you access the 100th item of a linked list in O(1)? Why or why not?
5. What does `current = current.next` do in `to_list`?

*Answers: 1) You lose instant indexed access, but gain fast insert/delete at known positions. 2) You only update a couple of pointers, no shifting of other elements. 3) Undo/redo history, browser back/forward (either is valid). 4) No - you must walk from the head, node by node, which is O(n). 5) Moves to the next node in the chain, one step at a time.*

---

## Module 5: Stacks & Queues - Order of Operations

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

### Checkpoint
You can explain, without looking back, why undo uses a stack and background jobs use a queue.

### Quiz
1. What does LIFO stand for, and what real object works that way?
2. What does FIFO stand for, and what real object works that way?
3. Why use `deque` instead of a plain list for a queue?
4. In the undo example, why does `.pop()` (not `.pop(0)`) give the correct "most recent" action?
5. Name one real backend feature that's a queue.

*Answers: 1) Last-In-First-Out; a stack of plates. 2) First-In-First-Out; a checkout line. 3) `deque.popleft()` is O(1); a plain list's `.pop(0)` is O(n) because everything shifts. 4) `.pop()` removes the last item added, which is exactly the most recent action. 5) Background job/task processing, email sending queues, print queues (any valid example).*

---

## Module 6: Recursion - Functions That Call Themselves

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

### Checkpoint
You can identify the base case and recursive step in both examples above without re-reading them.

### Quiz
1. What are the two required parts of any recursive function?
2. What happens if a recursive function has no base case?
3. Why is recursion a natural fit for nested folder structures?
4. In `deep_sum`, what triggers the recursive call versus the base case?
5. Could you solve `deep_sum` with loops alone? Why might recursion be cleaner here?

*Answers: 1) A base case that stops the recursion, and a step that moves toward it. 2) It calls itself forever (or until it crashes with a stack overflow / max recursion depth error). 3) Folders can contain folders arbitrarily deep, and recursion naturally mirrors that nested structure. 4) Encountering a nested list triggers recursion; encountering a plain number is the base case. 5) Yes, with a manual stack - but recursion mirrors the nested structure directly, making the code shorter and easier to reason about.*

---

## Module 7: Trees - Hierarchies in Code

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

### Checkpoint
You can explain why searching a balanced BST is roughly O(log n) instead of O(n).

### Quiz
1. What makes a binary tree "binary"?
2. In a BST, where do smaller values go relative to a node?
3. Why is BST search close to O(log n) instead of O(n)?
4. Name a real menu or navigation structure that's naturally a tree.
5. What could make a BST perform closer to O(n) instead of O(log n)?

*Answers: 1) Each node has at most two children. 2) To the left. 3) Each comparison eliminates roughly half the remaining nodes, similar to binary search. 4) A category menu, org chart, or nested comment thread (any valid example). 5) If the tree becomes unbalanced (e.g., values inserted in sorted order), it degrades into a structure closer to a linked list.*

---

## Module 8: Graphs - Modeling Real Relationships

### Concept

A **graph** is nodes connected by edges, without the strict parent-child limits of a tree - any node can connect to any other. **BFS** (breadth-first search) explores level by level, good for finding the shortest path. **DFS** (depth-first search) explores as deep as possible before backtracking, good for exploring all possibilities.

### Where you'd actually use this

Social networks (who's connected to whom), recommendation systems ("people who bought X also bought Y"), road/route navigation, dependency graphs (which packages depend on which others - this is literally how `pip` and `npm` resolve installs).

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

### Checkpoint
You can explain why BFS, not DFS, is the right choice when you specifically need the *shortest* path.

### Quiz
1. What's the key structural difference between a tree and a graph?
2. Why does BFS use a queue instead of a stack?
3. What does BFS guarantee that DFS does not?
4. Name a real feature powered by graph traversal.
5. In the social graph example, why might "Carol" not appear in the returned path even though she's connected to Dave?

*Answers: 1) A graph allows arbitrary connections between any nodes; a tree has a strict single-parent hierarchy with no cycles. 2) A queue processes nodes level by level (FIFO), which is what produces the shortest path first. 3) That the first path found to the target is the shortest one, in terms of number of connections. 4) "Shortest path" navigation, "degrees of connection" on social networks, dependency resolution (any valid example). 5) BFS found a path through Bob first because Bob was explored before Carol reached Dave - either path is valid-length, but BFS returns whichever shortest path it finds first.*

---

## Module 9: Sorting - Order Matters, and So Does Cost

### Concept

Python's built-in `sorted()` uses an efficient O(n log n) algorithm - you'll use it constantly. But understanding *how* sorting works matters when you need custom ordering logic, and understanding the cost matters when deciding whether to sort at all versus using a structure (like the heap from the previous course) that avoids full re-sorting.

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
print([p["name"] for p in sorted_products])
```

### Checkpoint
You can sort a list of dictionaries by one field, and by two fields with a tiebreaker.

### Quiz
1. What does `key=lambda p: p["price"]` tell `sorted()` to do?
2. Why sort by `(category, price)` as a tuple instead of two separate sort calls?
3. What's the time complexity of Python's built-in sort?
4. If you need "top 5 most urgent items" repeatedly, why might a heap beat re-sorting every time?
5. Does `sorted()` change the original list?

*Answers: 1) Use each item's price as the value to compare when ordering. 2) Sorting by a tuple sorts by the first value, then breaks ties with the second, in one pass. 3) O(n log n). 4) Because re-sorting the whole list every time repeats work; a heap keeps the top item accessible in O(log n) per update. 5) No - `sorted()` returns a new list; `.sort()` would modify the original in place.*

---

## Module 10: Searching & Binary Search

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

### Checkpoint
You can explain why binary search requires sorted data and what happens if you run it on unsorted data.

### Quiz
1. What's the one requirement binary search has that linear search doesn't?
2. Why is binary search O(log n) instead of O(n)?
3. What happens if you run binary search on unsorted data?
4. If your data changes constantly (frequent inserts), is keeping it sorted for binary search always worth it?
5. Name a real feature where fast lookup on sorted data matters.

*Answers: 1) The data must already be sorted. 2) Each step eliminates half the remaining search space. 3) It can give incorrect or missing results, since it relies on the sorted order to decide which half to search. 4) Not always - maintaining sorted order on every insert has its own cost, so the right choice depends on how often you search vs. insert. 5) Database index lookups, searching a sorted product catalog by ID (any valid example).*

---

## Module 11: Dynamic Programming - Avoiding Repeated Work

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
```

### Checkpoint
You can explain, in plain language, why `fib_fast` avoids the repeated work that makes `fib_slow` so much slower.

### Quiz
1. What problem does memoization solve?
2. Why does `fib_slow` get dramatically slower as `n` grows?
3. What does `memo[n] = ...` accomplish in `fib_fast`?
4. How is `calculate_shipping_cost`'s caching similar to dynamic programming?
5. Is DP useful for every problem? Why or why not?

*Answers: 1) Repeated recomputation of the same subproblem. 2) It recalculates the same smaller values exponentially many times without remembering past results. 3) Stores the result so future calls with the same `n` return instantly instead of recomputing. 4) It stores already-computed results (keyed by input) to skip redundant work on repeat calls, the same core idea as memoization. 5) No - it only helps when a problem has overlapping subproblems; if every subproblem is unique, there's nothing to cache.*

---

## Capstone: Build a Feature Using Multiple Structures Together

Real products rarely use one data structure in isolation. For your capstone, build a simple **"Trending Search" feature** that uses several structures from this course together:

1. **Hash map** - count how many times each search term has been searched
2. **Heap** - keep the top 5 most-searched terms accessible without re-sorting everything each time
3. **Cache (memoization)** - store recent search results so repeated identical searches don't recompute

```python
import heapq

search_counts = {}          # hash map: term -> count

def record_search(term):
    search_counts[term] = search_counts.get(term, 0) + 1

def top_5_trending():
    return heapq.nlargest(5, search_counts.items(), key=lambda pair: pair[1])

record_search("python")
record_search("python")
record_search("javascript")
record_search("python")
record_search("rust")

print(top_5_trending())
# [('python', 3), ('javascript', 1), ('rust', 1)]
```

### Course completion checklist
- [ ] Explained Big O growth rates in your own words
- [ ] Built and timed a slow vs. fast duplicate check
- [ ] Implemented a shopping cart with array operations
- [ ] Built a hash-map-based user lookup and word counter
- [ ] Deduplicated data and used at least one set operation (union, intersection, or difference)
- [ ] Built a linked list and explained its trade-offs
- [ ] Implemented a stack (undo) and a queue (job processing)
- [ ] Written two working recursive functions
- [ ] Built and searched a binary search tree
- [ ] Implemented BFS for shortest path on a graph
- [ ] Sorted data by single and multiple fields
- [ ] Implemented and compared linear vs. binary search
- [ ] Implemented memoization and explained why it helps
- [ ] Combined at least two structures in the capstone feature

Every structure in this course exists to answer one question: **what operation do I need to be fast, and what am I willing to trade for it?** That question - not memorized syntax - is the actual skill.
