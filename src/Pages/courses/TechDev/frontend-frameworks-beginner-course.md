<!-- order: 5 -->
# Frontend Frameworks for Builders: A Practical Beginner's Course

## Course Overview

**By the end of this course, you'll be able to:**
- Explain why frameworks exist and where React, Next.js, Vue, Angular and Svelte fit
- Build React components with JSX and props, and make them interactive with state and event handlers
- Render lists with keys, show content conditionally, and build validated forms with controlled inputs
- Load data with `useEffect` (including cleanup, loading and error states), and share state between components by lifting it up or using context
- Apply accessibility basics: labelled inputs, real buttons, useful alt text and announced errors
- Build a multi-page Next.js app with the App Router: layouts, links, dynamic routes, Server and Client Components, server-side data fetching, Route Handlers and a Server Action form
- Build your app for production and deploy it

**Who this is for:** Beginners who know HTML, CSS and JavaScript basics (functions, arrays, `fetch`) and want to build real interfaces with React and Next.js.

**How the course works:** Thirteen modules, building **one app, a Reading List**: first in React (Modules 1 to 7), then as a multi-page Next.js app with a server (Modules 8 to 12). Every module follows the same pattern:
- **Concept** - what it is, in plain language
- **Where you'd actually use this** - a real product scenario
- **Lab** - hands-on steps that add to the Reading List
- **Checkpoint**
- **Quiz** - five questions with answers

**Time:** about 24 hours in total.

**Tools needed:** [Node.js](https://nodejs.org) (a current LTS version, 22 or newer), a terminal, a text editor such as [VS Code](https://code.visualstudio.com), and a web browser. The code in this course was checked with Vite 8, React 19.2 and Next.js 16.4.

---

## Module 0: Why Frameworks Exist

**Time: about 1 hour**

### Concept

As an app grows, manually finding and changing elements (`document.querySelector(...)`, `element.textContent = ...`) gets repetitive and error prone: whenever data changes, you must update every place that shows it.

A **frontend framework** lets you build the page from **components**, reusable pieces of UI, and keeps the page in sync with your data. You describe *what* the page should look like for the current data (**declarative**), and the framework works out *how* to update it. Writing each DOM change yourself is **imperative** code.

```
Plain JavaScript (imperative):     Framework (declarative):
"find the counter element,         "the counter shows {count}"
 change its text to 5"              -> change count, the page follows
```

**React** is a library for building UI from components. **Next.js** is a framework built on React that adds routing, server rendering and data fetching. This course focuses on these two; the ideas transfer to the others.

**Other frameworks you'll hear about**

| Framework | What it is | When teams choose it |
|---|---|---|
| **Vue** | Components with HTML-like templates (`v-if`, `v-for`, `v-model`) and automatic reactivity | Teams wanting templates close to plain HTML and a gentle learning curve |
| **Angular** | A complete, opinionated TypeScript platform from Google with built-in routing, forms and HTTP client | Large, long-lived (often enterprise) apps where one official way of doing things keeps big teams consistent |
| **Svelte** | A compiler that turns components into small plain JavaScript; SvelteKit is its full-stack framework | Teams wanting small bundles and little boilerplate |

Once you know components, props, state and routing, picking up any of these is mostly new syntax.

### Where you'd actually use this

Shopping carts, dashboards, inboxes and feeds have lots of changing data. Frameworks keep them maintainable and let teams reuse pieces.

### Lab

1. Open a site you use daily. Write down five reusable pieces of UI, such as "message row", "star button" or "product card".
2. For each, note what data it needs (a message row: sender, subject, date, read status) and what changes as you use it.
3. Sketch the Reading List on paper: a header, an "add a book" form, a filter bar (All / To read / Finished), a list and a book card. Note the data each box needs. Each box will become a component.

### Checkpoint
You can explain components and declarative UI, and you have a component sketch of the Reading List.

### Quiz

1. What problem do frontend frameworks solve as an app grows?
2. What is a component?
3. What is the difference between React and Next.js?
4. What does "declarative" mean, compared to "imperative"?
5. Why might a large enterprise team choose Angular?

*Answers: 1) Keeping the page in sync with changing data; manual DOM updates become repetitive and error prone, while a framework updates the page for you. 2) A self-contained, reusable piece of UI that combines structure, behavior and often styling. 3) React is a library for building UI from components; Next.js is a framework built on React that adds routing, server rendering, data fetching and deployment features. 4) Declarative means describing what the UI should look like for the current data and letting the framework handle the updates; imperative means writing each update step yourself. 5) It is an opinionated, complete platform with built-in routing, forms and HTTP tools, so a big team follows one consistent way of building.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "blocks",
   "kicker": "Module 0 · Why frameworks exist",
   "title": "Build pages from pieces",
   "beats": [
    {
     "say": "Welcome to Frontend Frameworks for Builders."
    },
    {
     "say": "Across this course you'll build one app, a Reading List: first in React, then as a multi-page Next dot js app with a server."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "The problem",
   "title": "Imperative: you update every place by hand",
   "nodes": [
    {
     "id": "data",
     "label": "books.length",
     "x": 14,
     "y": 50,
     "sub": "3 → 4",
     "art": "code"
    },
    {
     "id": "list",
     "label": "The book list",
     "x": 82,
     "y": 18,
     "sub": "shows each book",
     "art": "layout"
    },
    {
     "id": "stats",
     "label": "Stats line",
     "x": 82,
     "y": 50,
     "sub": "\"0 of 4 finished\"",
     "art": "bars"
    },
    {
     "id": "tab",
     "label": "Tab title",
     "x": 82,
     "y": 82,
     "sub": "\"Reading List (4)\"",
     "art": "browser"
    }
   ],
   "edges": [
    {
     "from": "data",
     "to": "list"
    },
    {
     "from": "data",
     "to": "stats"
    },
    {
     "from": "data",
     "to": "tab"
    }
   ],
   "beats": [
    {
     "say": "Picture the Reading List. One piece of data, how many books there are, shows up in three places.",
     "show": 4
    },
    {
     "say": "You add a book, so the count goes from three to four.",
     "on": "data"
    },
    {
     "say": "In plain JavaScript, you find the list element and add a new row yourself.",
     "on": "list",
     "send": {
      "from": "data",
      "to": "list",
      "label": "querySelector(...).append(...)"
     }
    },
    {
     "say": "Then you find the stats line and change its text.",
     "on": "stats",
     "send": {
      "from": "data",
      "to": "stats",
      "label": "element.textContent = ..."
     }
    },
    {
     "say": "And then the tab title. Forget any one of these, and the page is out of sync with your data.",
     "on": "tab",
     "send": {
      "from": "data",
      "to": "tab",
      "label": "document.title = ..."
     }
    },
    {
     "say": "That's imperative code: you write every step of how the page changes.",
     "on": [
      "list",
      "stats",
      "tab"
     ]
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "The fix",
   "title": "Declarative: describe the page, React keeps it in sync",
   "nodes": [
    {
     "id": "data",
     "label": "books",
     "x": 14,
     "y": 50,
     "sub": "your data",
     "art": "code"
    },
    {
     "id": "react",
     "label": "React",
     "x": 46,
     "y": 50,
     "sub": "works out the changes",
     "art": "gear"
    },
    {
     "id": "list",
     "label": "<BookList books={books} />",
     "x": 84,
     "y": 18,
     "sub": "component",
     "art": "layout"
    },
    {
     "id": "stats",
     "label": "<Stats total={books.length} />",
     "x": 84,
     "y": 50,
     "sub": "component",
     "art": "bars"
    },
    {
     "id": "tab",
     "label": "Reading List ({books.length})",
     "x": 84,
     "y": 82,
     "sub": "tab title",
     "art": "browser"
    }
   ],
   "edges": [
    {
     "from": "data",
     "to": "react"
    },
    {
     "from": "react",
     "to": "list"
    },
    {
     "from": "react",
     "to": "stats"
    },
    {
     "from": "react",
     "to": "tab"
    }
   ],
   "beats": [
    {
     "say": "With a framework, each piece of the page simply says what it shows, for the current data.",
     "show": 5
    },
    {
     "say": "Now you change only the data: the books list gets a fourth book.",
     "on": "data",
     "send": {
      "from": "data",
      "to": "react",
      "label": "books: 4 items"
     }
    },
    {
     "say": "React works out what's different, and updates the list,",
     "on": "list",
     "send": {
      "from": "react",
      "to": "list",
      "label": "+1 row"
     }
    },
    {
     "say": "the stats line,",
     "on": "stats",
     "send": {
      "from": "react",
      "to": "stats",
      "label": "4"
     }
    },
    {
     "say": "and the tab title. You never touched them. That's declarative: change the data, and the page follows.",
     "on": "tab",
     "send": {
      "from": "react",
      "to": "tab",
      "label": "4"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "The landscape",
   "title": "Frameworks you'll hear about",
   "columns": [
    "Name",
    "What it is",
    "Teams choose it for"
   ],
   "rows": [
    [
     "React",
     "A library: UI from components",
     "Most popular starting point"
    ],
    [
     "Next.js",
     "Built on React",
     "Routing, server rendering, data"
    ],
    [
     "Vue",
     "HTML-like templates",
     "Gentle learning curve"
    ],
    [
     "Angular",
     "Complete TypeScript platform",
     "Big teams, one official way"
    ],
    [
     "Svelte",
     "A compiler to small plain JS",
     "Small bundles, little boilerplate"
    ]
   ],
   "beats": [
    {
     "say": "Here are the five names you'll hear most.",
     "col": 0
    },
    {
     "say": "React is a library for building user interfaces from components.",
     "hl": 0
    },
    {
     "say": "Next dot js is a framework built on React. It adds routing, server rendering and data fetching.",
     "hl": 1
    },
    {
     "say": "This course focuses on these two.",
     "hl": [
      0,
      1
     ],
     "dim": true
    },
    {
     "say": "Vue uses templates close to plain H T M L. Angular is a complete platform, popular with large enterprise teams. Svelte compiles to small, plain JavaScript.",
     "hl": [
      2,
      3,
      4
     ]
    },
    {
     "say": "Once you know components, props, state and routing, any of them is mostly new syntax.",
     "col": 2
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab",
   "title": "Sketch the Reading List as components",
   "nodes": [
    {
     "id": "app",
     "label": "App",
     "x": 50,
     "y": 15,
     "sub": "the whole page",
     "art": "layout"
    },
    {
     "id": "hdr",
     "label": "Header",
     "x": 10,
     "y": 55,
     "sub": "title, owner"
    },
    {
     "id": "form",
     "label": "AddBookForm",
     "x": 32,
     "y": 55,
     "sub": "title, author, genre",
     "art": "form"
    },
    {
     "id": "filt",
     "label": "FilterBar",
     "x": 55,
     "y": 55,
     "sub": "All · To read · Finished"
    },
    {
     "id": "list",
     "label": "BookList",
     "x": 80,
     "y": 55,
     "sub": "an array of books",
     "art": "array"
    },
    {
     "id": "card",
     "label": "BookCard",
     "x": 80,
     "y": 87,
     "sub": "one book's data",
     "art": "book"
    }
   ],
   "edges": [
    {
     "from": "app",
     "to": "hdr"
    },
    {
     "from": "app",
     "to": "form"
    },
    {
     "from": "app",
     "to": "filt"
    },
    {
     "from": "app",
     "to": "list"
    },
    {
     "from": "list",
     "to": "card"
    }
   ],
   "beats": [
    {
     "say": "Your lab is on paper. Sketch the Reading List as boxes.",
     "show": 1,
     "on": "app"
    },
    {
     "say": "A header, an add a book form, and a filter bar: all, to read, finished.",
     "show": 4,
     "on": [
      "hdr",
      "form",
      "filt"
     ]
    },
    {
     "say": "A list, which holds one book card for every book.",
     "show": 6,
     "on": [
      "list",
      "card"
     ]
    },
    {
     "say": "Next to each box, note the data it needs. A book card needs a title, an author and a genre.",
     "on": "card"
    },
    {
     "say": "Each box becomes a component. You'll build every one of them in this course.",
     "on": [
      "app",
      "hdr",
      "form",
      "filt",
      "list",
      "card"
     ]
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does \"declarative\" mean?",
   "options": [
    "Writing each DOM update step yourself",
    "Describing what the UI should look like for the data, and letting the framework update it",
    "Declaring every variable at the top"
   ],
   "answer": 1,
   "good": "That's right. You describe what the page should look like for the current data, and the framework works out how to update it.",
   "bad": "Not quite. You describe what the page should look like for the current data, and the framework works out how to update it.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does declarative mean?",
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
     "You can explain components and declarative UI",
     ""
    ],
    [
     "You have a component sketch",
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
     "say": "you can explain components and declarative UI,",
     "show": 1
    },
    {
     "say": "and you have a component sketch of the Reading List.",
     "show": 2
    },
    {
     "say": "Next, in Module 1, your first React components.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 1: React Components, JSX and Props

**Time: about 2 hours**

### Concept

A React **component** is a function whose name starts with a capital letter and which returns **JSX**, HTML-like markup inside JavaScript. Vite, a build tool, turns JSX into plain JavaScript for the browser.

JSX rules:
- Return **one parent element**. If you don't want an extra `<div>`, wrap siblings in an empty **fragment** `<>...</>`.
- Use `className` instead of `class`, and `htmlFor` instead of `for`.
- Close every tag, including `<img />` and `<input />`.
- Put any JavaScript expression inside curly braces: `<p>{author}</p>`.

**Props** are a component's inputs, passed like attributes: `<BookCard title="Kindred" />`. The component receives them as one object, usually destructured: `function BookCard({ title })`. Props flow **down** from parent to child, and a component never changes its own props.

### Where you'd actually use this

Product cards, avatars and notification rows: written once, reused with different props.

### Lab

1. **Create the project.** In your terminal:
```bash
npm create vite@latest reading-list -- --template react
cd reading-list
npm install
npm run dev
```
If asked whether to install and start now, choose **No** and run the commands yourself. Open the URL shown (usually `http://localhost:5173`) and leave `npm run dev` running; the page reloads when you save.

2. **Replace the styles.** Replace everything in `src/index.css` with:
```css
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #fafafa;
  color: #222;
}

main {
  max-width: 640px;
  margin: 0 auto;
  padding: 1rem;
}

.book-list {
  list-style: none;
  padding: 0;
}

.book-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.book-card h2 {
  margin: 0 0 0.25rem;
  font-size: 1.2rem;
}

.add-form {
  display: grid;
  gap: 0.4rem;
  margin-bottom: 1.5rem;
}

.error {
  color: #b00020;
}

button {
  margin-right: 0.5rem;
}
```

3. **Create your first component.** Create a new file `src/BookCard.jsx`:
```jsx
function BookCard({ title, author, genre }) {
  return (
    <article className="book-card">
      <h2>{title}</h2>
      <p>
        by {author} · {genre}
      </p>
    </article>
  );
}

export default BookCard;
```

4. **Use it.** Replace everything in `src/App.jsx` with:
```jsx
import BookCard from "./BookCard.jsx";

function Header({ owner }) {
  return (
    <header>
      <h1>My Reading List</h1>
      <p>Books {owner} wants to read this year.</p>
    </header>
  );
}

function App() {
  return (
    <main>
      <Header owner="Ope" />
      <BookCard title="Kindred" author="Octavia E. Butler" genre="Science fiction" />
      <BookCard title="Hidden Figures" author="Margot Lee Shetterly" genre="History" />
      <BookCard title="Things Fall Apart" author="Chinua Achebe" genre="Fiction" />
    </main>
  );
}

export default App;
```
Three cards from one component. `App` is the **parent**; `Header` and `BookCard` are **children**. (`src/main.jsx` puts `App` on the page; leave it as is.)

5. **Your turn.** Change `owner="Ope"` to your own name. Then add a fourth `BookCard` for a book you want to read.

### Checkpoint
Your page shows a header and four book cards rendered from components with props.

### Quiz

1. What is a React component?
2. Why must a component's name start with a capital letter?
3. What is a prop, and which direction does it flow?
4. Why do you write `className` instead of `class` in JSX?
5. When would you use a fragment `<>...</>`?

*Answers: 1) A JavaScript function that returns JSX describing a piece of UI. 2) React treats lowercase tags as built-in HTML elements, so a capitalized name tells React it is your own component. 3) A value passed from a parent component to a child, like an attribute; props flow down from parent to child. 4) JSX is JavaScript, and `class` is a reserved word in JavaScript, so React uses the DOM property name `className`. 5) When a component needs to return several sibling elements without adding an extra wrapper element to the page.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "blocks",
   "kicker": "Module 1 · Components, JSX and props",
   "title": "Your first components",
   "beats": [
    {
     "say": "Welcome to Module 1."
    },
    {
     "say": "A React component is a function whose name starts with a capital letter, and which returns J S X: HTML-like markup inside JavaScript."
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Render it",
   "title": "A component is a function that returns JSX",
   "file": "BookCard.jsx + App.jsx",
   "code": "function BookCard({ title, author, genre }) {\n  return (\n    <article className=\"book-card\">\n      <h2>{title}</h2>\n      <p>\n        by {author} · {genre}\n      </p>\n    </article>\n  );\n}\n\n// in App.jsx\n<BookCard title=\"Kindred\" author=\"Octavia E. Butler\" genre=\"Science fiction\" />\n<BookCard title=\"Hidden Figures\" author=\"Margot Lee Shetterly\" genre=\"History\" />",
   "beats": [
    {
     "say": "Book Card is just a function. Its name starts with a capital letter, and it returns J S X.",
     "line": [
      1,
      10
     ]
    },
    {
     "say": "In App, we use it like a tag, and pass three props, like attributes.",
     "line": 13
    },
    {
     "say": "React calls Book Card with one object holding those props. The curly braces unpack it into title, author and genre.",
     "line": 1,
     "vars": {
      "title": "\"Kindred\"",
      "author": "\"Octavia E. Butler\"",
      "genre": "\"Science fiction\""
     }
    },
    {
     "say": "Curly braces in J S X drop a JavaScript value into the markup. The heading shows Kindred.",
     "line": 4,
     "out": "Kindred"
    },
    {
     "say": "And the paragraph fills in the author and genre.",
     "line": 6,
     "out": "by Octavia E. Butler · Science fiction"
    },
    {
     "say": "The second card calls the very same function, with different props.",
     "line": [
      14,
      1
     ],
     "vars": {
      "title": "\"Hidden Figures\"",
      "author": "\"Margot Lee Shetterly\"",
      "genre": "\"History\""
     }
    },
    {
     "say": "Same code, new card. Write it once, reuse it with different props.",
     "line": [
      4,
      6
     ],
     "out": [
      "Hidden Figures",
      "by Margot Lee Shetterly · History"
     ]
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Props flow down from parent to child",
   "nodes": [
    {
     "id": "app",
     "label": "App",
     "x": 50,
     "y": 15,
     "sub": "the parent",
     "art": "layout"
    },
    {
     "id": "hdr",
     "label": "Header",
     "x": 12,
     "y": 72,
     "sub": "owner",
     "art": "pencil"
    },
    {
     "id": "c1",
     "label": "BookCard",
     "x": 37,
     "y": 72,
     "sub": "Kindred",
     "art": "book"
    },
    {
     "id": "c2",
     "label": "BookCard",
     "x": 63,
     "y": 72,
     "sub": "Hidden Figures",
     "art": "book"
    },
    {
     "id": "c3",
     "label": "BookCard",
     "x": 88,
     "y": 72,
     "sub": "Things Fall Apart",
     "art": "book"
    }
   ],
   "edges": [
    {
     "from": "app",
     "to": "hdr"
    },
    {
     "from": "app",
     "to": "c1"
    },
    {
     "from": "app",
     "to": "c2"
    },
    {
     "from": "app",
     "to": "c3"
    }
   ],
   "beats": [
    {
     "say": "App is the parent. Header and three book cards are its children.",
     "show": 5,
     "on": "app"
    },
    {
     "say": "App hands Header one prop: owner equals Ope.",
     "on": "hdr",
     "send": {
      "from": "app",
      "to": "hdr",
      "label": "owner=\"Ope\""
     }
    },
    {
     "say": "It hands the first card the details of Kindred.",
     "on": "c1",
     "send": {
      "from": "app",
      "to": "c1",
      "label": "title=\"Kindred\" …"
     }
    },
    {
     "say": "And the other two cards get their own books.",
     "on": [
      "c2",
      "c3"
     ],
     "send": {
      "from": "app",
      "to": "c3",
      "label": "title=\"Things Fall Apart\" …"
     }
    },
    {
     "say": "Props only flow down, from parent to child. A component never changes its own props.",
     "on": [
      "hdr",
      "c1",
      "c2",
      "c3"
     ]
    },
    {
     "say": "Your turn: change owner to your name, and add a fourth card for a book you want to read.",
     "on": "app"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "JSX rules",
   "title": "Where JSX differs from HTML",
   "columns": [
    "Rule",
    "HTML habit",
    "JSX"
   ],
   "rows": [
    [
     "One parent element",
     "<h1>…</h1><p>…</p>",
     "<>…</>  (a fragment)"
    ],
    [
     "class is reserved in JS",
     "class=\"book-card\"",
     "className=\"book-card\""
    ],
    [
     "for is reserved too",
     "for=\"title\"",
     "htmlFor=\"title\""
    ],
    [
     "Close every tag",
     "<img> <input>",
     "<img /> <input />"
    ],
    [
     "Values in braces",
     "-",
     "<p>{author}</p>"
    ],
    [
     "Capital = your component",
     "<article>",
     "<BookCard />"
    ]
   ],
   "beats": [
    {
     "say": "J S X looks like H T M L, with a few rules.",
     "col": 0
    },
    {
     "say": "A component returns one parent element. To return siblings without an extra div, wrap them in an empty fragment.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "Class is a reserved word in JavaScript, so J S X uses class name.",
     "hl": 1,
     "col": 2
    },
    {
     "say": "For the same reason, a label's for becomes html for.",
     "hl": 2,
     "col": 2
    },
    {
     "say": "Every tag must close, including image and input.",
     "hl": 3,
     "col": 2
    },
    {
     "say": "Any JavaScript value goes inside curly braces.",
     "hl": 4,
     "col": 2
    },
    {
     "say": "And lowercase tags are built-in H T M L, while a capital letter tells React it's your own component.",
     "hl": 5,
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why must a component's name start with a capital letter?",
   "options": [
    "It's just a style convention",
    "React treats lowercase tags as built-in HTML elements",
    "Capital letters render faster"
   ],
   "answer": 1,
   "good": "That's right. React treats lowercase tags as HTML elements, so a capital letter tells React it's your own component.",
   "bad": "Not quite. React treats lowercase tags as HTML elements, so a capital letter tells React it's your own component.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why must a component's name start with a capital letter?",
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
     "A header and four cards from components",
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
     "say": "your page shows a header and four book cards, rendered from components with props.",
     "show": 1
    },
    {
     "say": "Next, in Module 2, state and events.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 2: React State and Events

**Time: about 2 hours**

### Concept

**State** is data a component remembers and that changes while the page is used. You create it with the `useState` **hook** (hooks are React functions starting with `use`):

```jsx
const [isRead, setIsRead] = useState(false);
```

`useState` returns the current value and a **setter**. Calling the setter stores the new value and **re-renders** the component: React calls your function again and updates the page.

Rules:
- Never assign state directly; always call the setter.
- When the new value depends on the old one, pass a function: `setPagesRead((pages) => pages + 10)`. React supplies the latest value.
- Each copy of a component has its **own** state.
- Call hooks only at the top level of a component, never inside `if` statements or loops.

**Events** use camelCase props like `onClick` and `onChange`, and take a function. Write `onClick={() => setIsRead(true)}`, not `onClick={setIsRead(true)}`, which runs immediately during rendering.

### Where you'd actually use this

Like buttons, open/closed menus, selected tabs, quantity pickers.

### Lab

1. Replace everything in `src/BookCard.jsx` with:
```jsx
import { useState } from "react";

function BookCard({ title, author, genre }) {
  const [isRead, setIsRead] = useState(false);
  const [pagesRead, setPagesRead] = useState(0);

  return (
    <article className="book-card">
      <h2>{title}</h2>
      <p>
        by {author} · {genre}
      </p>
      <p>Pages read: {pagesRead}</p>
      <button type="button" onClick={() => setPagesRead((pages) => pages + 10)}>
        +10 pages
      </button>
      <button type="button" onClick={() => setIsRead(!isRead)}>
        {isRead ? "Mark as unread" : "Mark as read"}
      </button>
    </article>
  );
}

export default BookCard;
```
2. Click **+10 pages** on one card. Only that card changes: each has its own state.
3. Click **Mark as read**. The label switches thanks to the **ternary** (`condition ? a : b`).
4. **See a common bug.** Temporarily make the +10 handler `onClick={() => { setPagesRead(pagesRead + 10); setPagesRead(pagesRead + 10); }}` and click. It adds only 10, because both calls read the same old value. Calling `setPagesRead((pages) => pages + 10)` twice adds 20. Restore the original.
5. **Your turn.** Add a **Reset** button that sets `pagesRead` back to 0.

### Checkpoint
Each card tracks its own pages and read status.

### Quiz

1. What does `useState` return?
2. What happens when you call a state setter?
3. Why should you write `onClick={() => setIsRead(true)}` and not `onClick={setIsRead(true)}`?
4. When should you pass a function to the setter, like `setPagesRead((pages) => pages + 10)`?
5. If you render three `BookCard` components, how many `pagesRead` values exist?

*Answers: 1) A pair: the current value and a setter function to update it. 2) React stores the new value and re-renders the component so the page shows it. 3) The second form calls the setter immediately while rendering; the first passes a function that React calls only when the button is clicked. 4) When the new value depends on the previous value, so React gives you the latest value even if several updates happen together. 5) Three, because every copy of a component has its own separate state.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "cursor",
   "kicker": "Module 2 · State and events",
   "title": "Make it interactive",
   "beats": [
    {
     "say": "Welcome to Module 2."
    },
    {
     "say": "State is data a component remembers, which changes while the page is used."
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Trace it",
   "title": "Click, set state, re-render",
   "file": "BookCard.jsx (inside the function)",
   "code": "const [isRead, setIsRead] = useState(false);\nconst [pagesRead, setPagesRead] = useState(0);\nreturn (\n  <article className=\"book-card\">\n    <h2>{title}</h2>\n    <p>Pages read: {pagesRead}</p>\n    <button type=\"button\" onClick={() => setPagesRead((pages) => pages + 10)}>\n      +10 pages\n    </button>\n    <button type=\"button\" onClick={() => setIsRead(!isRead)}>\n      {isRead ? \"Mark as unread\" : \"Mark as read\"}\n    </button>\n  </article>\n);",
   "beats": [
    {
     "say": "Use state gives back a pair: the current value, and a setter to change it.",
     "line": [
      1,
      2
     ],
     "vars": {
      "isRead": false,
      "pagesRead": 0
     }
    },
    {
     "say": "On the first render, the card shows pages read zero.",
     "line": 6,
     "out": "Pages read: 0"
    },
    {
     "say": "Is read is false, so the ternary picks the label: mark as read.",
     "line": 11,
     "out": "[ Mark as read ]"
    },
    {
     "say": "Now you click plus ten pages. The arrow function runs, and calls the setter.",
     "line": 7
    },
    {
     "say": "React stores ten, and calls the whole function again. That's a re-render.",
     "line": 2,
     "vars": {
      "pagesRead": 10
     }
    },
    {
     "say": "This time the paragraph reads ten.",
     "line": 6,
     "out": "Pages read: 10"
    },
    {
     "say": "Click mark as read. Set is read gets not false, which is true.",
     "line": 10,
     "vars": {
      "isRead": true
     }
    },
    {
     "say": "Another re-render, and the label flips.",
     "line": 11,
     "out": "[ Mark as unread ]"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Every setter call starts a re-render",
   "nodes": [
    {
     "id": "click",
     "label": "Click",
     "x": 12,
     "y": 50,
     "sub": "+10 pages",
     "art": "cursor"
    },
    {
     "id": "set",
     "label": "setPagesRead",
     "x": 38,
     "y": 18,
     "sub": "the setter",
     "art": "code"
    },
    {
     "id": "react",
     "label": "React",
     "x": 74,
     "y": 18,
     "sub": "stores the new value",
     "art": "gear"
    },
    {
     "id": "fn",
     "label": "BookCard()",
     "x": 88,
     "y": 66,
     "sub": "runs again",
     "art": "code"
    },
    {
     "id": "page",
     "label": "The page",
     "x": 45,
     "y": 84,
     "sub": "updated",
     "art": "browser"
    }
   ],
   "edges": [
    {
     "from": "click",
     "to": "set"
    },
    {
     "from": "set",
     "to": "react"
    },
    {
     "from": "react",
     "to": "fn"
    },
    {
     "from": "fn",
     "to": "page"
    }
   ],
   "beats": [
    {
     "say": "Here's that loop as a picture.",
     "show": 5
    },
    {
     "say": "A click runs your handler, which calls the setter.",
     "on": "set",
     "send": {
      "from": "click",
      "to": "set",
      "label": "onClick"
     }
    },
    {
     "say": "The setter hands React the new value.",
     "on": "react",
     "send": {
      "from": "set",
      "to": "react",
      "label": "pages + 10"
     }
    },
    {
     "say": "React calls your component function again, with the new state.",
     "on": "fn",
     "send": {
      "from": "react",
      "to": "fn",
      "label": "pagesRead = 10"
     }
    },
    {
     "say": "And updates only what changed on the page.",
     "on": "page",
     "send": {
      "from": "fn",
      "to": "page",
      "label": "Pages read: 10"
     }
    },
    {
     "say": "So never assign state directly. Always call the setter, or React never hears about the change.",
     "on": "set"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Concept",
   "title": "Each copy of a component has its own state",
   "values": [
    "Kindred: 0 pages",
    "Hidden Figures: 0 pages",
    "Things Fall Apart: 0 pages"
   ],
   "beats": [
    {
     "say": "Three book cards, made from the same component."
    },
    {
     "say": "Click plus ten on Hidden Figures.",
     "hl": 1,
     "ptr": {
      "click": 1
     },
     "vals": [
      "Kindred: 0 pages",
      "Hidden Figures: 10 pages",
      "Things Fall Apart: 0 pages"
     ]
    },
    {
     "say": "Only that card changes. The other two keep their own zero.",
     "hl": 1,
     "ok": [
      0,
      2
     ],
     "note": "three cards → three separate pagesRead values"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "A common bug",
   "title": "Two updates, but only +10?",
   "columns": [
    "Call",
    "pages it reads",
    "stores"
   ],
   "rows": [
    [
     "setPagesRead(pagesRead + 10)",
     "0",
     "10"
    ],
    [
     "setPagesRead(pagesRead + 10)",
     "0",
     "10"
    ],
    [
     "setPagesRead((pages) => pages + 10)",
     "0",
     "10"
    ],
    [
     "setPagesRead((pages) => pages + 10)",
     "10",
     "20"
    ]
   ],
   "beats": [
    {
     "say": "Try calling the setter twice in one click. Pages read starts at zero."
    },
    {
     "say": "Written as pages read plus ten, both calls read the same old value: zero.",
     "hl": [
      0,
      1
     ],
     "col": 1
    },
    {
     "say": "So both store ten. You clicked once, asked for twenty, and got ten.",
     "hl": [
      0,
      1
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "Pass a function instead, and React hands each call the latest value.",
     "hl": [
      2,
      3
     ],
     "col": 1
    },
    {
     "say": "Zero becomes ten, then ten becomes twenty. When the new value depends on the old one, pass a function.",
     "hl": [
      2,
      3
     ],
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Events",
   "title": "Pass a function, don't call one",
   "columns": [
    "You write",
    "When it runs",
    "Result"
   ],
   "rows": [
    [
     "onClick={() => setIsRead(true)}",
     "When clicked",
     "Works"
    ],
    [
     "onClick={setIsRead(true)}",
     "During rendering",
     "Runs immediately"
    ]
   ],
   "beats": [
    {
     "say": "Events use camel case props like on click, and take a function."
    },
    {
     "say": "An arrow function is a function waiting to be called. React calls it when the button is clicked.",
     "hl": 0
    },
    {
     "say": "Without the arrow, you call the setter right now, while rendering, not on click.",
     "hl": 1,
     "dim": true,
     "col": 1
    },
    {
     "say": "Your turn: add a reset button that sets pages read back to zero, using an arrow function.",
     "hl": 0,
     "col": 0
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "You render three BookCards. How many pagesRead values exist?",
   "options": [
    "One, shared by all",
    "Three, one per card",
    "None until clicked"
   ],
   "answer": 1,
   "good": "That's right. Three. Every copy of a component has its own separate state.",
   "bad": "Not quite. Three. Every copy of a component has its own separate state.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "You render three book cards. How many pages read values exist?",
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
     "Each card tracks its own pages and status",
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
     "say": "each card tracks its own pages and read status.",
     "show": 1
    },
    {
     "say": "Next, in Module 3, lists, keys and conditional rendering.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 3: Lists, Keys and Conditional Rendering

**Time: about 1.5 hours**

### Concept

Real data arrives as **arrays**. You turn an array into elements with `.map()`:

```jsx
{books.map((book) => <li key={book.id}>{book.title}</li>)}
```

Each item needs a **key**: unique among its siblings and stable for that item, such as a database ID. React uses keys to match items between renders; without stable keys it can attach state to the wrong item when the list changes. Avoid array indexes as keys for changing lists.

**Conditional rendering** patterns:
- `if` with an early `return` (for example, an empty-list message)
- `condition && <Element />` to show something only when true
- `condition ? <A /> : <B />` to choose between two things

Watch out: `{count && <p>...</p>}` shows a literal `0` when `count` is 0. Use `{count > 0 && ...}`.

### Where you'd actually use this

Search results, product grids, comments; "No results" messages and "Sale" badges.

### Lab

1. Create `src/books.js` with the data:
```js
export const starterBooks = [
  {
    id: 1,
    title: "Kindred",
    author: "Octavia E. Butler",
    genre: "Science fiction",
    note: "Recommended by a friend",
  },
  { id: 2, title: "Hidden Figures", author: "Margot Lee Shetterly", genre: "History" },
  { id: 3, title: "Things Fall Apart", author: "Chinua Achebe", genre: "Fiction" },
];
```
2. Create `src/BookList.jsx`:
```jsx
import BookCard from "./BookCard.jsx";

function BookList({ books }) {
  if (books.length === 0) {
    return <p>Your list is empty. Add a book to get started.</p>;
  }

  return (
    <ul className="book-list">
      {books.map((book) => (
        <li key={book.id}>
          <BookCard
            title={book.title}
            author={book.author}
            genre={book.genre}
            note={book.note}
          />
        </li>
      ))}
    </ul>
  );
}

export default BookList;
```
3. Replace `src/BookCard.jsx` to accept an optional `note` and show a "Finished" badge:
```jsx
import { useState } from "react";

function BookCard({ title, author, genre, note }) {
  const [isRead, setIsRead] = useState(false);
  const [pagesRead, setPagesRead] = useState(0);

  return (
    <article className="book-card">
      <h2>
        {title} {isRead && <span>✓ Finished</span>}
      </h2>
      <p>
        by {author} · {genre}
      </p>
      {note && <p>Note: {note}</p>}
      <p>Pages read: {pagesRead}</p>
      <button type="button" onClick={() => setPagesRead((pages) => pages + 10)}>
        +10 pages
      </button>
      <button type="button" onClick={() => setIsRead(!isRead)}>
        {isRead ? "Mark as unread" : "Mark as read"}
      </button>
    </article>
  );
}

export default BookCard;
```
4. Replace `src/App.jsx` with:
```jsx
import BookList from "./BookList.jsx";
import { starterBooks } from "./books.js";

function App() {
  return (
    <main>
      <h1>My Reading List</h1>
      <BookList books={starterBooks} />
    </main>
  );
}

export default App;
```
Only Kindred shows a note, because the others have no `note` property.

5. Temporarily pass `books={[]}` to see the empty message, then change it back.
6. Open developer tools (F12) > Console and temporarily delete `key={book.id}`. React warns that list children need a unique "key". Put it back.
7. **Your turn.** Add a fourth book with `id: 4` and a `note`. No component changes needed.

### Checkpoint
The list renders from an array with stable keys, notes show only when present, and the empty state works.

### Quiz

1. How do you turn an array of data into a list of elements in React?
2. What makes a good key?
3. Why is the array index a risky key for a list that can change?
4. What does `{note && <p>Note: {note}</p>}` do?
5. Why can `{count && <p>You have items</p>}` show a stray "0" on the page?

*Answers: 1) Call `.map()` on the array and return a JSX element for each item. 2) A value that is unique among the siblings and stays the same for that item over time, such as an ID from the data. 3) When items are added, removed or reordered, indexes shift, so React may match state to the wrong item. 4) It renders the paragraph only when `note` has a truthy value, and renders nothing otherwise. 5) When `count` is zero, the expression evaluates to the number zero, and React renders numbers; use a real boolean such as `count > 0`.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "array",
   "kicker": "Module 3 · Lists, keys and conditions",
   "title": "Render from real data",
   "beats": [
    {
     "say": "Welcome to Module 3."
    },
    {
     "say": "Real data arrives as arrays, and you turn an array into elements with dot map."
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · map",
   "title": "books.map() turns data into elements",
   "values": [
    "id 1 · Kindred",
    "id 2 · Hidden Figures",
    "id 3 · Things Fall Apart"
   ],
   "beats": [
    {
     "say": "Here's the starter books array from books dot j s: three objects, each with an I D."
    },
    {
     "say": "Map visits the first book, and returns a list item with key one, holding a book card.",
     "hl": 0,
     "ptr": {
      "book": 0
     },
     "note": "<li key={1}><BookCard title=\"Kindred\" … /></li>"
    },
    {
     "say": "Then the second, with key two.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "book": 1
     },
     "note": "<li key={2}><BookCard title=\"Hidden Figures\" … /></li>"
    },
    {
     "say": "Then the third, with key three. Three items in, three list items out.",
     "ok": [
      0,
      1,
      2
     ],
     "ptr": {
      "book": 2
     },
     "note": "<li key={3}><BookCard title=\"Things Fall Apart\" … /></li>"
    },
    {
     "say": "Add a fourth book with I D four to the array, and a fourth card appears. No component changes.",
     "vals": [
      "id 1 · Kindred",
      "id 2 · Hidden Figures",
      "id 3 · Things Fall Apart",
      "id 4 · your book"
     ],
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Why keys matter",
   "title": "Index keys attach state to the wrong book",
   "values": [
    "key 0 · Kindred · 30 pages",
    "key 1 · Hidden Figures · 0",
    "key 2 · Things Fall Apart · 0"
   ],
   "beats": [
    {
     "say": "React uses keys to match items between renders. Suppose we used the array index as the key."
    },
    {
     "say": "You've read thirty pages of Kindred. That state belongs to the card with key zero.",
     "hl": 0,
     "note": "pagesRead lives in the card React knows as key 0"
    },
    {
     "say": "Now Kindred is removed. The other two books shift up, and get new indexes.",
     "vals": [
      "key 0 · Hidden Figures · 30 pages",
      "key 1 · Things Fall Apart · 0"
     ],
     "hl": 0,
     "note": "key 0 still exists, so React keeps its state"
    },
    {
     "say": "React still sees a key zero, so it keeps that card's state. Hidden Figures now claims thirty pages. Wrong.",
     "vals": [
      "key 0 · Hidden Figures · 30 pages",
      "key 1 · Things Fall Apart · 0"
     ],
     "gone": [
      0
     ],
     "note": "index keys → state on the wrong item"
    },
    {
     "say": "With key equals book dot I D instead, key one disappears with Kindred, and each book keeps its own state.",
     "vals": [
      "key 2 · Hidden Figures · 0",
      "key 3 · Things Fall Apart · 0"
     ],
     "ok": [
      0,
      1
     ],
     "note": "key={book.id}: unique and stable"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Conditional rendering",
   "title": "Show it only when it applies",
   "columns": [
    "Data",
    "Code",
    "Shows"
   ],
   "rows": [
    [
     "note: \"Recommended by a friend\"",
     "{note && <p>Note: {note}</p>}",
     "Note: Recommended by a friend"
    ],
    [
     "no note",
     "{note && <p>Note: {note}</p>}",
     "(nothing)"
    ],
    [
     "isRead: true",
     "{isRead && <span>✓ Finished</span>}",
     "✓ Finished"
    ],
    [
     "isRead: false",
     "{isRead ? \"Mark as unread\" : \"Mark as read\"}",
     "Mark as read"
    ],
    [
     "books: []",
     "if (books.length === 0) return <p>…</p>",
     "Your list is empty. Add a book…"
    ]
   ],
   "beats": [
    {
     "say": "Three patterns decide what appears.",
     "col": 1
    },
    {
     "say": "Double ampersand shows something only when the left side is true. Kindred has a note, so it shows.",
     "hl": 0
    },
    {
     "say": "Hidden Figures has no note, so nothing renders at all.",
     "hl": 1
    },
    {
     "say": "The same pattern adds a finished badge once a book is read.",
     "hl": 2
    },
    {
     "say": "A question mark ternary chooses between two things, like the button label.",
     "hl": 3
    },
    {
     "say": "And an if with an early return handles the empty list. Pass an empty array to try it.",
     "hl": 4,
     "dim": true
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "A common bug",
   "title": "Why a stray 0 appears",
   "columns": [
    "count",
    "count && <p>…</p>",
    "count > 0 && <p>…</p>"
   ],
   "rows": [
    [
     "0",
     "\"0\" on the page",
     "(nothing)"
    ],
    [
     "2",
     "<p>You have items</p>",
     "<p>You have items</p>"
    ]
   ],
   "beats": [
    {
     "say": "Watch out with numbers on the left of double ampersand."
    },
    {
     "say": "When count is two, both versions show the paragraph.",
     "hl": 1
    },
    {
     "say": "But when count is zero, the expression is the number zero, and React renders numbers. A stray zero appears.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "Use a real true or false, like count greater than zero, and nothing shows.",
     "hl": 0,
     "col": 2,
     "dim": true
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why can {count && <p>…</p>} show a stray \"0\"?",
   "options": [
    "React has a bug with numbers",
    "When count is zero, the expression is the number 0, and React renders numbers",
    "Paragraphs can't be conditional"
   ],
   "answer": 1,
   "good": "That's right. When count is zero, the expression evaluates to zero, and React renders numbers. Use a real boolean like count greater than zero.",
   "bad": "Not quite. When count is zero, the expression evaluates to zero, and React renders numbers. Use a real boolean like count greater than zero.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why can count, double ampersand, a paragraph, show a stray zero?",
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
     "Rendered from an array with stable keys",
     ""
    ],
    [
     "Notes and empty state work",
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
     "say": "the list renders from an array with stable keys,",
     "show": 1
    },
    {
     "say": "notes show only when present, and the empty state works.",
     "show": 2
    },
    {
     "say": "Next, in Module 4, forms.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 4: Forms with Controlled Inputs

**Time: about 2 hours**

### Concept

A **controlled input** gets its value from state (`value={title}`) and updates it in `onChange`. State is the single source of truth, so you can validate or reset it any time.

A React form usually has:
- state for each field
- an `onSubmit` handler on the `<form>`, so pressing Enter works too
- `event.preventDefault()`, because browsers reload the page on submit by default
- validation (after `.trim()`) with a clear error message
- a `<label htmlFor="...">` matching each input's `id`

The list lives in `App`, so `App` holds it in state and passes an `onAdd` function down. Data goes **down** through props; events go **up** through callback props. Update arrays by creating a **new** array (`[...currentBooks, newBook]`), not `.push()`: React only notices new values.

### Where you'd actually use this

Sign-up, checkout, search, comment and settings forms.

### Lab

1. Create `src/AddBookForm.jsx`:
```jsx
import { useState } from "react";

function AddBookForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("Fiction");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page

    const cleanTitle = title.trim();
    const cleanAuthor = author.trim();

    if (cleanTitle === "" || cleanAuthor === "") {
      setError("Please enter both a title and an author.");
      return;
    }
    if (cleanTitle.length > 100) {
      setError("Titles can be at most 100 characters.");
      return;
    }

    onAdd({
      id: crypto.randomUUID(),
      title: cleanTitle,
      author: cleanAuthor,
      genre: genre,
    });

    setTitle("");
    setAuthor("");
    setGenre("Fiction");
    setError("");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit} noValidate>
      <h2>Add a book</h2>

      <label htmlFor="title">Title</label>
      <input
        id="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label htmlFor="author">Author</label>
      <input
        id="author"
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
      />

      <label htmlFor="genre">Genre</label>
      <select id="genre" value={genre} onChange={(event) => setGenre(event.target.value)}>
        <option>Fiction</option>
        <option>Science fiction</option>
        <option>History</option>
        <option>Tech</option>
      </select>

      {error && <p className="error">{error}</p>}

      <button type="submit">Add book</button>
    </form>
  );
}

export default AddBookForm;
```
`crypto.randomUUID()` (built into browsers) creates a unique ID. `noValidate` turns off the browser's own checks so you see your React validation.

2. Replace `src/App.jsx` so `App` owns the list in state:
```jsx
import { useState } from "react";
import AddBookForm from "./AddBookForm.jsx";
import BookList from "./BookList.jsx";
import { starterBooks } from "./books.js";

function App() {
  const [books, setBooks] = useState(starterBooks);

  function addBook(newBook) {
    setBooks((currentBooks) => [...currentBooks, newBook]);
  }

  return (
    <main>
      <h1>My Reading List</h1>
      <AddBookForm onAdd={addBook} />
      <BookList books={books} />
    </main>
  );
}

export default App;
```
3. Submit an empty form, then only spaces (both errors), then a real book: it appears and the form clears.
4. Click the "Title" label: the cursor jumps into its input, because `htmlFor` and `id` match.
5. **Your turn.** Add a rule: the author name must be at least 2 characters. Show "Author names need at least 2 characters." when it fails.

### Checkpoint
Valid books are added; invalid input shows an error.

### Quiz

1. What makes an input "controlled"?
2. Why does the submit handler call `event.preventDefault()`?
3. Why put the handler on the form's `onSubmit` rather than the button's `onClick`?
4. How does `AddBookForm` add a book to a list that lives in `App`?
5. Why use `[...currentBooks, newBook]` instead of `currentBooks.push(newBook)`?

*Answers: 1) Its value comes from React state through `value`, and every change goes through `onChange` to update that state. 2) Submitting a form makes the browser reload the page by default, which would wipe the app's state. 3) `onSubmit` also runs when the user presses Enter in a field, and it is the natural place to handle the whole form. 4) `App` passes its `addBook` function down as the `onAdd` prop, and the form calls it with the new book. 5) React detects changes by getting a new value; `.push()` changes the existing array in place, so React may not re-render.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "form",
   "kicker": "Module 4 · Forms",
   "title": "Controlled inputs",
   "beats": [
    {
     "say": "Welcome to Module 4."
    },
    {
     "say": "A controlled input gets its value from state, and updates that state on every change. State is the single source of truth."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "A controlled input goes round a loop",
   "nodes": [
    {
     "id": "input",
     "label": "Title input",
     "x": 12,
     "y": 50,
     "sub": "what you see",
     "art": "form"
    },
    {
     "id": "change",
     "label": "onChange",
     "x": 45,
     "y": 15,
     "sub": "setTitle(event.target.value)",
     "art": "code"
    },
    {
     "id": "state",
     "label": "title state",
     "x": 86,
     "y": 50,
     "sub": "the source of truth",
     "art": "boxes"
    },
    {
     "id": "value",
     "label": "value={title}",
     "x": 45,
     "y": 85,
     "sub": "re-render",
     "art": "code"
    }
   ],
   "edges": [
    {
     "from": "input",
     "to": "change"
    },
    {
     "from": "change",
     "to": "state"
    },
    {
     "from": "state",
     "to": "value"
    },
    {
     "from": "value",
     "to": "input"
    }
   ],
   "beats": [
    {
     "say": "Four parts: the input, its on change handler, the title state, and value equals title.",
     "show": 4
    },
    {
     "say": "You type the letter K. On change receives the event.",
     "on": "change",
     "send": {
      "from": "input",
      "to": "change",
      "label": "\"K\""
     }
    },
    {
     "say": "It calls set title, so state now holds K.",
     "on": "state",
     "send": {
      "from": "change",
      "to": "state",
      "label": "setTitle(\"K\")"
     }
    },
    {
     "say": "React re-renders, and value equals title gives the input K.",
     "on": "value",
     "send": {
      "from": "state",
      "to": "value",
      "label": "title = \"K\""
     }
    },
    {
     "say": "The box shows K because state says so.",
     "on": "input",
     "send": {
      "from": "value",
      "to": "input",
      "label": "value=\"K\""
     }
    },
    {
     "say": "That's why you can validate or clear it any time: set title to empty, and the box empties.",
     "on": "state",
     "send": {
      "from": "state",
      "to": "value",
      "label": "title = \"\""
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Trace it",
   "title": "Validate on submit",
   "file": "AddBookForm.jsx",
   "code": "function handleSubmit(event) {\n  event.preventDefault(); // stop the browser from reloading the page\n  const cleanTitle = title.trim();\n  const cleanAuthor = author.trim();\n  if (cleanTitle === \"\" || cleanAuthor === \"\") {\n    setError(\"Please enter both a title and an author.\");\n    return;\n  }\n  // ...plus a check that titles are at most 100 characters\n  onAdd({ id: crypto.randomUUID(), title: cleanTitle, author: cleanAuthor, genre: genre });\n  setTitle(\"\"); setAuthor(\"\"); setGenre(\"Fiction\"); setError(\"\");\n}",
   "beats": [
    {
     "say": "The handler sits on the form's on submit, so pressing Enter works too.",
     "line": 1
    },
    {
     "say": "First, prevent default. Browsers reload the page on submit, which would wipe our state.",
     "line": 2
    },
    {
     "say": "Try one: both boxes hold only spaces.",
     "line": [
      3,
      4
     ],
     "vars": {
      "title": "\"   \"",
      "author": "\"   \""
     }
    },
    {
     "say": "Trim removes the spaces, leaving empty text.",
     "line": [
      3,
      4
     ],
     "vars": {
      "cleanTitle": "\"\"",
      "cleanAuthor": "\"\""
     }
    },
    {
     "say": "Empty fails the check, so we set the error message and return. Nothing is added.",
     "line": [
      5,
      7
     ],
     "vars": {
      "error": "\"Please enter both a title and an author.\""
     },
     "out": "Please enter both a title and an author."
    },
    {
     "say": "Try two: Atomic Habits, by James Clear, genre Tech.",
     "line": [
      3,
      4
     ],
     "vars": {
      "title": "\"Atomic Habits\"",
      "author": "\"James Clear\"",
      "cleanTitle": "\"Atomic Habits\"",
      "cleanAuthor": "\"James Clear\"",
      "genre": "\"Tech\""
     }
    },
    {
     "say": "Both have text, so the check passes, and on add receives the new book with a fresh I D.",
     "line": [
      5,
      10
     ]
    },
    {
     "say": "Finally, every field resets, and the error clears. The form is empty again.",
     "line": 11,
     "vars": {
      "title": "\"\"",
      "author": "\"\"",
      "genre": "\"Fiction\"",
      "error": "\"\""
     }
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Data goes down, events go up",
   "nodes": [
    {
     "id": "app",
     "label": "App",
     "x": 50,
     "y": 15,
     "sub": "useState(starterBooks)",
     "art": "layout"
    },
    {
     "id": "form",
     "label": "AddBookForm",
     "x": 18,
     "y": 78,
     "sub": "onAdd",
     "art": "form"
    },
    {
     "id": "list",
     "label": "BookList",
     "x": 82,
     "y": 78,
     "sub": "books",
     "art": "array"
    }
   ],
   "edges": [
    {
     "from": "app",
     "to": "form"
    },
    {
     "from": "app",
     "to": "list"
    }
   ],
   "beats": [
    {
     "say": "The list lives in App, so App holds the books in state.",
     "show": 3,
     "on": "app"
    },
    {
     "say": "App passes the books down to Book List.",
     "on": "list",
     "send": {
      "from": "app",
      "to": "list",
      "label": "books (3)"
     }
    },
    {
     "say": "And passes its add book function down to the form, as the on add prop.",
     "on": "form",
     "send": {
      "from": "app",
      "to": "form",
      "label": "onAdd={addBook}"
     }
    },
    {
     "say": "When you submit, the form calls on add. The event travels up to App.",
     "on": "app",
     "send": {
      "from": "form",
      "to": "app",
      "label": "onAdd({ title: \"Atomic Habits\", … })"
     }
    },
    {
     "say": "App sets new state and re-renders, so Book List receives four books.",
     "on": "list",
     "send": {
      "from": "app",
      "to": "list",
      "label": "books (4)"
     }
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Concept",
   "title": "Make a new array, don't push",
   "values": [
    "Kindred",
    "Hidden Figures",
    "Things Fall Apart"
   ],
   "beats": [
    {
     "say": "Here are the current books."
    },
    {
     "say": "Add book builds a new array: spread out every current book, then add the new one at the end.",
     "vals": [
      "Kindred",
      "Hidden Figures",
      "Things Fall Apart",
      "Atomic Habits"
     ],
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3,
     "note": "[...currentBooks, newBook] → a new array"
    },
    {
     "say": "React compares old and new. It's a different array, so React re-renders.",
     "vals": [
      "Kindred",
      "Hidden Figures",
      "Things Fall Apart",
      "Atomic Habits"
     ],
     "hl": 3,
     "note": "new value → re-render"
    },
    {
     "say": "Push would change the existing array in place. Same array, so React may not notice, and the page may not update.",
     "vals": [
      "Kindred",
      "Hidden Figures",
      "Things Fall Apart",
      "Atomic Habits"
     ],
     "gone": [
      0,
      1,
      2,
      3
     ],
     "note": "currentBooks.push(newBook) → same array, changed in place"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why does the submit handler call event.preventDefault()?",
   "options": [
    "To validate the inputs",
    "Submitting a form reloads the page by default, wiping the app's state",
    "To clear the form"
   ],
   "answer": 1,
   "good": "That's right. By default the browser reloads the page on submit, which would wipe the app's state.",
   "bad": "Not quite. By default the browser reloads the page on submit, which would wipe the app's state.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why does the submit handler call event dot prevent default?",
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
     "Valid books are added",
     ""
    ],
    [
     "Invalid input shows an error",
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
     "say": "valid books are added,",
     "show": 1
    },
    {
     "say": "and invalid input shows an error.",
     "show": 2
    },
    {
     "say": "Next, in Module 5, effects and fetching data.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 5: Effects and Fetching Data

**Time: about 2.5 hours**

### Concept

Rendering should only calculate JSX. Work that reaches **outside** React (fetching, the tab title, timers) is a **side effect** and goes in `useEffect`:

```jsx
useEffect(() => {
  // runs after React has updated the page
  return () => {
    // optional cleanup: runs before the effect runs again, and when the component is removed
  };
}, [dependencies]);
```

The **dependency array** controls when it runs: `[]` once after the first render; `[books.length]` after the first render and whenever `books.length` changes; no array, after every render (rarely wanted).

Fetching takes time and can fail, so the UI needs **loading**, **error** and **ready** states. The **cleanup** function cancels work no longer needed; for `fetch`, an `AbortController` aborts the request if the component disappears first.

In development, `StrictMode` (in `src/main.jsx`) runs each effect, its cleanup, then the effect again, to expose missing cleanup. A "cancelled" first request in the Network tab is your cleanup working.

**Note:** fetching in `useEffect` suits apps that run fully in the browser, like this one. Frameworks like Next.js often fetch **on the server** instead, so the page arrives with data (Module 10). Many teams also use a library such as TanStack Query for caching and retries.

### Where you'd actually use this

Loading a profile or search results, showing an unread count in the tab title, cancelling an outdated search.

### Lab

1. Create `public/starter-books.json` (in `public`, not `src`). Files there are served as-is, so this acts like a tiny API:
```json
[
  {
    "id": 1,
    "title": "Kindred",
    "author": "Octavia E. Butler",
    "genre": "Science fiction",
    "note": "Recommended by a friend"
  },
  { "id": 2, "title": "Hidden Figures", "author": "Margot Lee Shetterly", "genre": "History" },
  { "id": 3, "title": "Things Fall Apart", "author": "Chinua Achebe", "genre": "Fiction" }
]
```
2. Replace `src/App.jsx` with:
```jsx
import { useEffect, useState } from "react";
import AddBookForm from "./AddBookForm.jsx";
import BookList from "./BookList.jsx";

function App() {
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading", "ready" or "error"

  // Effect 1: load the starter books once, when App first appears
  useEffect(() => {
    const controller = new AbortController();

    async function loadBooks() {
      try {
        const response = await fetch("/starter-books.json", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();
        setBooks(data);
        setStatus("ready");
      } catch (error) {
        if (error.name === "AbortError") return; // we cancelled it on purpose
        console.error(error);
        setStatus("error");
      }
    }

    loadBooks();

    // Cleanup: cancel the request if App disappears before it finishes
    return () => controller.abort();
  }, []);

  // Effect 2: keep the browser tab title in sync with the number of books
  useEffect(() => {
    document.title = `Reading List (${books.length})`;
  }, [books.length]);

  function addBook(newBook) {
    setBooks((currentBooks) => [...currentBooks, newBook]);
  }

  return (
    <main>
      <h1>My Reading List</h1>
      <AddBookForm onAdd={addBook} />
      {status === "loading" && <p>Loading your books...</p>}
      {status === "error" && (
        <p className="error">Could not load your books. Refresh to try again.</p>
      )}
      {status === "ready" && <BookList books={books} />}
    </main>
  );
}

export default App;
```
`src/books.js` is no longer used; you can delete it.

3. In developer tools > **Network**, set throttling to a slow option and refresh: "Loading your books..." shows first. Turn throttling off.
4. Change the `fetch` URL to `"/missing.json"`: you get the error message, not a crash. Change it back.
5. Add a book: the tab title updates (Effect 2).
6. **Your turn.** Add an effect that runs `localStorage.setItem("books", JSON.stringify(books))` whenever `books` changes, and check it in developer tools under Application (or Storage) > Local Storage.

### Checkpoint
Books load with a loading state, failures show an error, cleanup aborts the request, and the tab title stays in sync.

### Quiz

1. What kind of code belongs in `useEffect`?
2. What does an empty dependency array `[]` mean?
3. What is the cleanup function for, and what does it do in this lab?
4. Why does the UI need separate loading, error and ready states?
5. How does Next.js often avoid fetching in `useEffect`?

*Answers: 1) Side effects: work that reaches outside React's rendering, such as fetching data, timers, subscriptions or changing the document title. 2) Run the effect once after the component first appears, and not again on later re-renders. 3) It undoes or cancels the effect's work; here it aborts the fetch if the component is removed before the response arrives. 4) A request takes time and can fail, so the user needs feedback while waiting and a clear message if it fails, instead of a blank page or a crash. 5) It fetches data on the server, so the HTML arrives with the data already in it.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "api",
   "kicker": "Module 5 · Effects and fetching",
   "title": "Reaching outside React",
   "beats": [
    {
     "say": "Welcome to Module 5."
    },
    {
     "say": "Rendering should only calculate J S X. Work that reaches outside React, like fetching, timers or the tab title, is a side effect, and goes in use effect."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "One status, three screens",
   "columns": [
    "status",
    "What App renders"
   ],
   "rows": [
    [
     "\"loading\"",
     "<p>Loading your books...</p>"
    ],
    [
     "\"error\"",
     "<p>Could not load your books. Refresh to try again.</p>"
    ],
    [
     "\"ready\"",
     "<BookList books={books} />"
    ]
   ],
   "beats": [
    {
     "say": "Fetching takes time and can fail, so App keeps a status in state.",
     "sql": "const [status, setStatus] = useState(\"loading\");"
    },
    {
     "say": "It starts as loading, so the first thing you see is a loading message.",
     "hl": 0
    },
    {
     "say": "If the request fails, status becomes error, and you get a clear message instead of a crash.",
     "hl": 1
    },
    {
     "say": "When the data arrives, status becomes ready, and the list renders.",
     "hl": 2
    },
    {
     "say": "Exactly one of these shows at a time.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 0
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Trace it",
   "title": "Load the books, or fail gracefully",
   "file": "App.jsx (inside the effect)",
   "code": "async function loadBooks() {\n  try {\n    const response = await fetch(\"/starter-books.json\", { signal: controller.signal });\n    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);\n    const data = await response.json();\n    setBooks(data);\n    setStatus(\"ready\");\n  } catch (error) {\n    if (error.name === \"AbortError\") return; // we cancelled it on purpose\n    console.error(error);\n    setStatus(\"error\");\n  }\n}",
   "beats": [
    {
     "say": "Before anything loads, books is empty and status is loading.",
     "line": 1,
     "vars": {
      "books": "[]",
      "status": "\"loading\""
     }
    },
    {
     "say": "Fetch asks for starter books dot j s o n, from the public folder.",
     "line": 3
    },
    {
     "say": "The server answers two hundred, so response dot ok is true, and we don't throw.",
     "line": [
      3,
      4
     ],
     "vars": {
      "response.status": 200,
      "response.ok": true
     }
    },
    {
     "say": "We read the J S O N: an array of three books.",
     "line": 5,
     "vars": {
      "data": "[3 books]"
     }
    },
    {
     "say": "Set books, then set status to ready. The list appears.",
     "line": [
      6,
      7
     ],
     "vars": {
      "books": "[3 books]",
      "status": "\"ready\""
     }
    },
    {
     "say": "Now suppose the file is missing, and the server answers four oh four.",
     "line": 3,
     "vars": {
      "books": "[]",
      "status": "\"loading\"",
      "response.status": 404,
      "response.ok": false,
      "data": "—"
     }
    },
    {
     "say": "Response dot ok is false, so we throw an error, and jump straight to catch.",
     "line": [
      4,
      8
     ]
    },
    {
     "say": "It isn't an abort, so we log it, and set status to error. The user sees a message, not a crash.",
     "line": [
      9,
      11
     ],
     "vars": {
      "status": "\"error\""
     },
     "out": "Error: Request failed with status 404"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "The dependency array decides when an effect runs",
   "columns": [
    "Moment",
    "books.length",
    "Effect 1: []",
    "Effect 2: [books.length]"
   ],
   "rows": [
    [
     "First render",
     "0",
     "runs: fetch",
     "runs: \"Reading List (0)\""
    ],
    [
     "Books loaded",
     "3",
     "skipped",
     "runs: \"Reading List (3)\""
    ],
    [
     "Book added",
     "4",
     "skipped",
     "runs: \"Reading List (4)\""
    ]
   ],
   "beats": [
    {
     "say": "App has two effects. Here's each moment App renders."
    },
    {
     "say": "After the first render, both run. Effect one starts the fetch. Effect two sets the tab title to zero books.",
     "hl": 0
    },
    {
     "say": "An empty array means run once, after the first render. So effect one never runs again.",
     "col": 2,
     "hl": [
      1,
      2
     ]
    },
    {
     "say": "Effect two lists books dot length, so it runs whenever that number changes: three, then four.",
     "col": 3,
     "hl": [
      1,
      2
     ]
    },
    {
     "say": "With no array at all, an effect runs after every render. That's rarely what you want.",
     "col": 0
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Cleanup",
   "title": "In development, StrictMode runs effects twice",
   "values": [
    "effect runs",
    "cleanup",
    "effect runs again",
    "response arrives"
   ],
   "beats": [
    {
     "say": "In development, strict mode runs each effect, its cleanup, then the effect again, to expose missing cleanup."
    },
    {
     "say": "The effect runs, makes an abort controller, and sends request one.",
     "hl": 0,
     "ptr": {
      "now": 0
     },
     "note": "request 1 sent"
    },
    {
     "say": "The cleanup runs: controller dot abort cancels request one.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "now": 1
     },
     "note": "controller.abort() → request 1 cancelled"
    },
    {
     "say": "Request one fails with an abort error, and catch quietly returns. We cancelled it on purpose.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "now": 1
     },
     "note": "error.name === \"AbortError\" → return"
    },
    {
     "say": "The effect runs again, with a new controller, and sends request two.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "now": 2
     },
     "note": "request 2 sent"
    },
    {
     "say": "Request two succeeds, and the books appear. A cancelled first request in the Network tab is your cleanup working.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "ptr": {
      "now": 3
     },
     "note": "setBooks(data) · setStatus(\"ready\")"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does an empty dependency array [] mean?",
   "options": [
    "Run after every render",
    "Run once, after the component first appears",
    "Never run"
   ],
   "answer": 1,
   "good": "That's right. Run the effect once, after the component first appears, and not on later re-renders.",
   "bad": "Not quite. Run the effect once, after the component first appears, and not on later re-renders.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does an empty dependency array mean?",
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
     "Loading and error states work",
     ""
    ],
    [
     "Cleanup aborts; the title stays in sync",
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
     "say": "books load with a loading state, and failures show an error,",
     "show": 1
    },
    {
     "say": "cleanup aborts the request, and the tab title stays in sync.",
     "show": 2
    },
    {
     "say": "Next, in Module 6, sharing state.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 6: Lifting State Up and Sharing It

**Time: about 2.5 hours**

### Concept

Each `BookCard` keeps its own `isRead`, so `App` can't show "1 of 3 finished" or filter by status. The fix is **lifting state up**: move state to the **closest common parent** of the components that need it and pass it down with functions to change it. Each book gets a `read` field owned by `App`; cards call `onToggleRead(id)`.

Guidelines:
- **Keep state as low as possible.** `pagesRead` is used by one card, so it stays there.
- **Don't store what you can calculate.** Counts and filtered lists are **derived values**: compute them during render so they can't get out of sync.

Passing props through components that don't use them (`BookList` only forwards `onToggleRead`) is **prop drilling**. When many deep components need the same thing (the current user, a theme, app-wide actions), **context** lets a parent provide a value any descendant reads with `useContext`. Use it sparingly; props are easier to follow.

### Where you'd actually use this

A header cart badge and the cart page share cart state; search filters and results share the page's filter state.

### Lab

**Step 1: Lift the read status with props.**

1. Create `src/Stats.jsx`:
```jsx
function Stats({ total, read }) {
  return (
    <p>
      {read} of {total} books finished
    </p>
  );
}

export default Stats;
```
2. Create `src/FilterBar.jsx`:
```jsx
const FILTERS = [
  { value: "all", label: "All" },
  { value: "unread", label: "To read" },
  { value: "read", label: "Finished" },
];

function FilterBar({ filter, onChange }) {
  return (
    <div>
      {FILTERS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          disabled={filter === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
```
3. Replace `src/BookList.jsx`. `{...book}` **spreads** each property of `book` as a prop:
```jsx
import BookCard from "./BookCard.jsx";

function BookList({ books, onToggleRead, onRemove }) {
  if (books.length === 0) {
    return <p>No books to show here.</p>;
  }

  return (
    <ul className="book-list">
      {books.map((book) => (
        <li key={book.id}>
          <BookCard {...book} onToggleRead={onToggleRead} onRemove={onRemove} />
        </li>
      ))}
    </ul>
  );
}

export default BookList;
```
4. Replace `src/BookCard.jsx`. The `isRead` state is gone; `read` now arrives as a prop:
```jsx
import { useState } from "react";

function BookCard({ id, title, author, genre, note, read, onToggleRead, onRemove }) {
  const [pagesRead, setPagesRead] = useState(0); // only this card needs it, so it stays here

  return (
    <article className="book-card">
      <h2>
        {title} {read && <span>✓ Finished</span>}
      </h2>
      <p>
        by {author} · {genre}
      </p>
      {note && <p>Note: {note}</p>}
      <p>Pages read: {pagesRead}</p>
      <button type="button" onClick={() => setPagesRead((pages) => pages + 10)}>
        +10 pages
      </button>
      <button type="button" onClick={() => onToggleRead(id)}>
        {read ? "Mark as unread" : "Mark as read"}
      </button>
      <button type="button" onClick={() => onRemove(id)}>
        Remove
      </button>
    </article>
  );
}

export default BookCard;
```
5. Replace `src/App.jsx`:
```jsx
import { useEffect, useState } from "react";
import AddBookForm from "./AddBookForm.jsx";
import BookList from "./BookList.jsx";
import FilterBar from "./FilterBar.jsx";
import Stats from "./Stats.jsx";

function App() {
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState("loading");
  const [filter, setFilter] = useState("all"); // "all", "unread" or "read"

  useEffect(() => {
    const controller = new AbortController();

    async function loadBooks() {
      try {
        const response = await fetch("/starter-books.json", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();
        setBooks(data);
        setStatus("ready");
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error(error);
        setStatus("error");
      }
    }

    loadBooks();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    document.title = `Reading List (${books.length})`;
  }, [books.length]);

  function addBook(newBook) {
    setBooks((currentBooks) => [...currentBooks, { ...newBook, read: false }]);
  }

  function toggleRead(id) {
    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.id === id ? { ...book, read: !book.read } : book
      )
    );
  }

  function removeBook(id) {
    setBooks((currentBooks) => currentBooks.filter((book) => book.id !== id));
  }

  // Derived values: calculated from state on every render, not stored in state
  const readCount = books.filter((book) => book.read).length;
  const visibleBooks = books.filter((book) => {
    if (filter === "read") return book.read;
    if (filter === "unread") return !book.read;
    return true;
  });

  return (
    <main>
      <h1>My Reading List</h1>
      <AddBookForm onAdd={addBook} />
      {status === "loading" && <p>Loading your books...</p>}
      {status === "error" && (
        <p className="error">Could not load your books. Refresh to try again.</p>
      )}
      {status === "ready" && (
        <>
          <Stats total={books.length} read={readCount} />
          <FilterBar filter={filter} onChange={setFilter} />
          <BookList books={visibleBooks} onToggleRead={toggleRead} onRemove={removeBook} />
        </>
      )}
    </main>
  );
}

export default App;
```
`toggleRead` builds a new array with `.map()`, replacing only the matching book with an updated copy; `removeBook` builds one with `.filter()`. Neither changes the old array.

6. Mark a book as read, switch filters and remove a book.

**Step 2: Share the actions with context.**

`BookList` only passes `onToggleRead` and `onRemove` along. Replace that drilling with context.

7. Create `src/BooksContext.js`:
```js
import { createContext } from "react";

export const BooksContext = createContext(null);
```
8. In `src/App.jsx`, add the import below the other imports:
```jsx
import { BooksContext } from "./BooksContext.js";
```
Then wrap the returned JSX in the context, and give `BookList` only `books`:
```jsx
  return (
    <BooksContext value={{ toggleRead, removeBook }}>
      <main>
        <h1>My Reading List</h1>
        <AddBookForm onAdd={addBook} />
        {status === "loading" && <p>Loading your books...</p>}
        {status === "error" && (
          <p className="error">Could not load your books. Refresh to try again.</p>
        )}
        {status === "ready" && (
          <>
            <Stats total={books.length} read={readCount} />
            <FilterBar filter={filter} onChange={setFilter} />
            <BookList books={visibleBooks} />
          </>
        )}
      </main>
    </BooksContext>
  );
```
(In React 19 the context itself is the provider; older code writes `<BooksContext.Provider>`.)

9. Replace `src/BookList.jsx`:
```jsx
import BookCard from "./BookCard.jsx";

function BookList({ books }) {
  if (books.length === 0) {
    return <p>No books to show here.</p>;
  }

  return (
    <ul className="book-list">
      {books.map((book) => (
        <li key={book.id}>
          <BookCard {...book} />
        </li>
      ))}
    </ul>
  );
}

export default BookList;
```
10. In `src/BookCard.jsx`, replace everything above `return (` with:
```jsx
import { useContext, useState } from "react";
import { BooksContext } from "./BooksContext.js";

function BookCard({ id, title, author, genre, note, read }) {
  const { toggleRead, removeBook } = useContext(BooksContext);
  const [pagesRead, setPagesRead] = useState(0);
```
and in the two buttons, change `onToggleRead(id)` to `toggleRead(id)` and `onRemove(id)` to `removeBook(id)`.
11. **Your turn.** Add `"read": true` to Hidden Figures in `public/starter-books.json` and refresh; stats and filters reflect it.

### Checkpoint
`App` owns books, read status and filter; stats and filters work; `BookCard` gets its actions from context.

### Quiz

1. What does "lifting state up" mean?
2. Why did `pagesRead` stay inside `BookCard`?
3. Why are `readCount` and `visibleBooks` calculated instead of stored in state?
4. What is prop drilling, and how does context help?
5. How does `toggleRead` update one book without changing the original array?

*Answers: 1) Moving state to the closest common parent of all components that need it, then passing the value and update functions down as props. 2) Only that one card uses it, and state should stay as low in the tree as possible. 3) They can always be computed from `books` and `filter`; storing them separately could let them get out of sync. 4) Prop drilling is passing props through components that don't use them just to reach a deeper child; context lets a parent provide a value any descendant reads with `useContext`. 5) It uses `.map()` to create a new array, replacing only the matching book with a copy that has `read` flipped.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "tree",
   "kicker": "Module 6 · Lifting state up",
   "title": "Share state between components",
   "beats": [
    {
     "say": "Welcome to Module 6."
    },
    {
     "say": "Each card keeps its own is read, so App can't show how many are finished, or filter by status."
    },
    {
     "say": "The fix is lifting state up."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "App owns the state. Props go down, events come up",
   "nodes": [
    {
     "id": "app",
     "label": "App",
     "x": 50,
     "y": 14,
     "sub": "books · filter",
     "art": "layout"
    },
    {
     "id": "stats",
     "label": "Stats",
     "x": 12,
     "y": 52,
     "sub": "total · read",
     "art": "bars"
    },
    {
     "id": "filt",
     "label": "FilterBar",
     "x": 45,
     "y": 52,
     "sub": "filter · onChange"
    },
    {
     "id": "list",
     "label": "BookList",
     "x": 82,
     "y": 52,
     "sub": "books · onToggleRead",
     "art": "array"
    },
    {
     "id": "card",
     "label": "BookCard",
     "x": 82,
     "y": 86,
     "sub": "read · pagesRead",
     "art": "book"
    }
   ],
   "edges": [
    {
     "from": "app",
     "to": "stats"
    },
    {
     "from": "app",
     "to": "filt"
    },
    {
     "from": "app",
     "to": "list"
    },
    {
     "from": "list",
     "to": "card"
    }
   ],
   "beats": [
    {
     "say": "Read status moves up to the closest common parent of everything that needs it: App.",
     "show": 5,
     "on": "app"
    },
    {
     "say": "App tells Stats the totals. Nothing is read yet.",
     "on": "stats",
     "send": {
      "from": "app",
      "to": "stats",
      "label": "total=3 read=0"
     }
    },
    {
     "say": "It gives the filter bar the current filter, and the function to change it.",
     "on": "filt",
     "send": {
      "from": "app",
      "to": "filt",
      "label": "filter=\"all\""
     }
    },
    {
     "say": "Books go down through Book List, and each card gets its book's data, including read.",
     "on": "card",
     "send": {
      "from": "list",
      "to": "card",
      "label": "{...book}  read=false"
     }
    },
    {
     "say": "You click mark as read on Kindred. The card calls on toggle read with Kindred's I D, one.",
     "on": "card",
     "send": {
      "from": "card",
      "to": "list",
      "label": "onToggleRead(1)"
     }
    },
    {
     "say": "That function came down through Book List, so the call reaches App's toggle read.",
     "on": "app",
     "send": {
      "from": "list",
      "to": "app",
      "label": "toggleRead(1)"
     }
    },
    {
     "say": "App updates its books and re-renders, so Stats now says one of three books finished.",
     "on": "stats",
     "send": {
      "from": "app",
      "to": "stats",
      "label": "total=3 read=1"
     }
    },
    {
     "say": "Pages read is used by one card only, so it stays in that card. Keep state as low as possible.",
     "on": "card"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Trace it",
   "title": "toggleRead(1) builds a new array with map",
   "values": [
    "1 · Kindred · unread",
    "2 · Hidden Figures · unread",
    "3 · Things Fall Apart · unread"
   ],
   "beats": [
    {
     "say": "Toggle read must change one book without touching the original array. Map builds a new one."
    },
    {
     "say": "Book one: its I D matches. So map returns a copy, with read flipped to true.",
     "hl": 0,
     "ptr": {
      "book": 0
     },
     "vals": [
      "1 · Kindred · read ✓",
      "2 · Hidden Figures · unread",
      "3 · Things Fall Apart · unread"
     ],
     "note": "{ ...book, read: !book.read }"
    },
    {
     "say": "Book two doesn't match, so the same book is passed through unchanged.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "book": 1
     },
     "note": "book.id === id ? … : book"
    },
    {
     "say": "Book three, the same.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "book": 2
     },
     "note": "unchanged"
    },
    {
     "say": "The result is a brand new array, so React re-renders. Remove book works the same way, with filter.",
     "ok": [
      0,
      1,
      2
     ],
     "note": "currentBooks.filter((book) => book.id !== id)"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Don't store what you can calculate",
   "columns": [
    "id",
    "title",
    "read"
   ],
   "rows": [
    [
     "1",
     "Kindred",
     "true"
    ],
    [
     "2",
     "Hidden Figures",
     "false"
    ],
    [
     "3",
     "Things Fall Apart",
     "false"
    ]
   ],
   "beats": [
    {
     "say": "Here are the books after marking Kindred as read."
    },
    {
     "say": "Read count is worked out on every render: keep the books that are read, and count them. One.",
     "sql": "const readCount = books.filter((book) => book.read).length;",
     "hl": 0,
     "col": 2
    },
    {
     "say": "Choose the to read filter. Visible books keeps the two that aren't read.",
     "sql": "filter = \"unread\"  →  visibleBooks",
     "hl": [
      1,
      2
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "Choose finished, and only Kindred shows.",
     "sql": "filter = \"read\"  →  visibleBooks",
     "hl": 0,
     "dim": true,
     "col": 2
    },
    {
     "say": "These are derived values. Calculated from books and filter, they can never drift out of sync.",
     "sql": "filter = \"all\"  →  visibleBooks",
     "hl": [
      0,
      1,
      2
     ]
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 2",
   "title": "Context skips the middleman",
   "nodes": [
    {
     "id": "app",
     "label": "App",
     "x": 15,
     "y": 20,
     "sub": "toggleRead · removeBook",
     "art": "layout"
    },
    {
     "id": "ctx",
     "label": "BooksContext",
     "x": 82,
     "y": 20,
     "sub": "value={{ toggleRead, removeBook }}",
     "art": "plug"
    },
    {
     "id": "list",
     "label": "BookList",
     "x": 15,
     "y": 80,
     "sub": "only books now",
     "art": "array"
    },
    {
     "id": "card",
     "label": "BookCard",
     "x": 82,
     "y": 80,
     "sub": "useContext(BooksContext)",
     "art": "book"
    }
   ],
   "edges": [
    {
     "from": "app",
     "to": "ctx"
    },
    {
     "from": "app",
     "to": "list"
    },
    {
     "from": "list",
     "to": "card"
    },
    {
     "from": "ctx",
     "to": "card"
    }
   ],
   "beats": [
    {
     "say": "Book List never used on toggle read. It only passed it along. That's prop drilling.",
     "show": 4,
     "on": "list"
    },
    {
     "say": "So App provides its two actions through context.",
     "on": "ctx",
     "send": {
      "from": "app",
      "to": "ctx",
      "label": "{ toggleRead, removeBook }"
     }
    },
    {
     "say": "Book List now gets only the books.",
     "on": "list",
     "send": {
      "from": "app",
      "to": "list",
      "label": "books"
     }
    },
    {
     "say": "And hands each card its book.",
     "on": "card",
     "send": {
      "from": "list",
      "to": "card",
      "label": "{...book}"
     }
    },
    {
     "say": "The card reads the actions straight from context, with use context.",
     "on": "card",
     "send": {
      "from": "ctx",
      "to": "card",
      "label": "useContext"
     }
    },
    {
     "say": "Use it sparingly, for things many deep components need. Plain props are easier to follow.",
     "on": [
      "app",
      "card"
     ]
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why are readCount and visibleBooks calculated, not stored in state?",
   "options": [
    "State is too slow",
    "They can always be computed from books and filter, so storing them could let them drift out of sync",
    "Context can't hold them"
   ],
   "answer": 1,
   "good": "That's right. They can always be computed from books and filter. Storing them separately could let them get out of sync.",
   "bad": "Not quite. They can always be computed from books and filter. Storing them separately could let them get out of sync.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why are read count and visible books calculated, not stored in state?",
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
     "App owns books, read status and filter",
     ""
    ],
    [
     "Stats, filters and context work",
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
     "say": "App owns the books, read status and filter,",
     "show": 1
    },
    {
     "say": "stats and filters work, and Book Card gets its actions from context.",
     "show": 2
    },
    {
     "say": "Next, in Module 7, accessibility.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 7: Accessibility Basics

**Time: about 1.5 hours**

### Concept

**Accessibility (a11y)** means people can use your app with a keyboard, screen reader, zoom or other assistive technology. Most fixes are about using the right HTML:

- **Labels:** every input needs a `<label>` linked by `htmlFor`/`id`. A placeholder is not a label; it vanishes as you type.
- **Buttons vs divs:** actions are `<button>`s; navigation is a link. A `<div onClick>` can't be reached with Tab, ignores Enter and Space, and isn't announced as a button.
- **Clear names:** many buttons all called "Remove" confuse screen reader users; `aria-label="Remove Kindred"` fixes that.
- **States:** `aria-pressed="true"` marks the active toggle button. Don't use `disabled` for "selected": disabled buttons are skipped by the keyboard.
- **Announcements:** `role="alert"` reads errors immediately; `role="status"` reads updates like "Loading..." politely. `aria-describedby` links an input to its error, and `aria-invalid` marks it invalid.
- **Alt text:** informative images describe what matters (`alt="Cover of Kindred"`); decorative ones get `alt=""` so screen readers skip them; an image that is a button's only content describes the action. Never leave `alt` out.
- **Focus:** keep a visible focus outline and a Tab order that follows the visual order.

### Where you'd actually use this

Everywhere. Accessible apps work for more people, and many organizations have legal accessibility requirements.

### Lab

1. **Try the bad version.** Temporarily change the Remove button to `<div onClick={() => removeBook(id)}>Remove</div>` and press Tab repeatedly: it's never focused. Change it back.

2. **Give Remove a clear name.** In `src/BookCard.jsx`, change the Remove button's opening tag to:
```jsx
      <button type="button" onClick={() => removeBook(id)} aria-label={`Remove ${title}`}>
```
Hide the decorative check mark from screen readers:
```jsx
        {title} {read && <span><span aria-hidden="true">✓</span> Finished</span>}
```

3. **Mark the active filter.** In `src/FilterBar.jsx`, change `<div>` to `<div role="group" aria-label="Filter books">` and replace the `disabled=...` line with:
```jsx
          aria-pressed={filter === option.value}
```

4. **Announce loading and errors.** In `src/App.jsx`, change the two status paragraphs to:
```jsx
        {status === "loading" && <p role="status">Loading your books...</p>}
        {status === "error" && (
          <p className="error" role="alert">Could not load your books. Refresh to try again.</p>
        )}
```

5. **Connect form errors to inputs.** In `src/AddBookForm.jsx`, add to **both** text inputs:
```jsx
        aria-invalid={error !== ""}
        aria-describedby={error ? "form-error" : undefined}
```
and replace the error line with:
```jsx
      {error && (
        <p id="form-error" className="error" role="alert">
          {error}
        </p>
      )}
```

6. Add to the end of `src/index.css`:
```css
button[aria-pressed="true"] {
  font-weight: bold;
  text-decoration: underline;
}

:focus-visible {
  outline: 3px solid #1a73e8;
  outline-offset: 2px;
}
```

7. **Keyboard-only test.** Without the mouse (Tab, Shift+Tab, Enter, Space), add a book, mark it read, filter and remove it. Focus should always be visible.
8. In Chrome or Edge developer tools, run a **Lighthouse** audit with only "Accessibility" checked and fix what it reports. Automated tools catch only some problems, so step 7 still matters.
9. **Your turn.** Write `alt` text for a book cover, a decorative swirl, and a magnifying-glass icon that is a search button's only content. (Suggested: "Cover of {title}"; `alt=""`; "Search".)

### Checkpoint
The app works by keyboard alone, focus is visible, errors are announced, and the Lighthouse accessibility audit passes.

### Quiz

1. Why is `<div onClick>` a poor replacement for `<button>`?
2. Why is a placeholder not a substitute for a label?
3. When should an image have `alt=""`?
4. What do `role="alert"` and `aria-describedby` do for the form error?
5. Why use `aria-pressed` on the active filter button instead of `disabled`?

*Answers: 1) A div can't be reached with Tab, doesn't respond to Enter or Space, and isn't announced as a button, so keyboard and screen reader users can't use it. 2) The placeholder disappears when the user types and is often hard to read, and it isn't reliably announced as the field's name. 3) When the image is purely decorative and adds no information, so screen readers skip it. 4) `role="alert"` makes screen readers announce the error as soon as it appears, and `aria-describedby` links the input to the error text so it is read when the input is focused. 5) `aria-pressed` announces which filter is active while keeping the button focusable; disabled buttons are skipped by the keyboard.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "access",
   "kicker": "Module 7 · Accessibility basics",
   "title": "Usable by everyone",
   "beats": [
    {
     "say": "Welcome to Module 7."
    },
    {
     "say": "Accessibility means people can use your app with a keyboard, a screen reader, zoom or other assistive technology. Most fixes are just the right HTML."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Most fixes are the right HTML",
   "columns": [
    "Problem",
    "Fix"
   ],
   "rows": [
    [
     "A placeholder used as a label",
     "<label htmlFor=\"title\">"
    ],
    [
     "<div onClick>",
     "<button>"
    ],
    [
     "Every button just says \"Remove\"",
     "aria-label={`Remove ${title}`}"
    ],
    [
     "disabled to mean \"selected\"",
     "aria-pressed={filter === option.value}"
    ],
    [
     "Errors appear silently",
     "role=\"alert\" + aria-describedby"
    ],
    [
     "Images with no alt",
     "alt=\"Cover of Kindred\" or alt=\"\""
    ],
    [
     "Focus outline removed",
     ":focus-visible { outline: … }"
    ]
   ],
   "beats": [
    {
     "say": "Here are the problems this lab fixes, and the fix for each.",
     "col": 0
    },
    {
     "say": "A placeholder vanishes as you type, so every input needs a real label, linked by html for and I D.",
     "hl": 0
    },
    {
     "say": "Actions are buttons. A div with on click can't be reached with the keyboard.",
     "hl": 1
    },
    {
     "say": "Many buttons all called remove confuse screen reader users, so each gets a clear name.",
     "hl": 2
    },
    {
     "say": "Aria pressed marks the active filter, and announced states and errors come next.",
     "hl": [
      3,
      4
     ]
    },
    {
     "say": "Images need alt text, and focus must always be visible.",
     "hl": [
      5,
      6
     ],
     "dim": true
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Keyboard test",
   "title": "Tab moves through everything you can use",
   "values": [
    "Title",
    "Author",
    "Genre",
    "Add book",
    "All",
    "To read",
    "Finished",
    "+10 pages",
    "Mark as read",
    "Remove Kindred"
   ],
   "beats": [
    {
     "say": "These are the stops the Tab key visits, in order, through the form, the filters and the first card."
    },
    {
     "say": "Tab lands on the title input first.",
     "hl": 0,
     "ptr": {
      "tab": 0
     }
    },
    {
     "say": "Keep pressing Tab, and focus walks through every control, in the same order you see them.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
     ],
     "hl": 9,
     "ptr": {
      "tab": 9
     },
     "note": "Remove Kindred · a real <button>"
    },
    {
     "say": "Now swap the remove button for a div with on click. Tab skips right past it.",
     "vals": [
      "Title",
      "Author",
      "Genre",
      "Add book",
      "All",
      "To read",
      "Finished",
      "+10 pages",
      "Mark as read",
      "<div> Remove"
     ],
     "gone": [
      9
     ],
     "ptr": {
      "tab": 8
     },
     "note": "never focused, ignores Enter and Space"
    },
    {
     "say": "And the old filter bar disabled the active button. Disabled buttons are skipped too.",
     "vals": [
      "Title",
      "Author",
      "Genre",
      "Add book",
      "All (disabled)",
      "To read",
      "Finished",
      "+10 pages",
      "Mark as read",
      "Remove Kindred"
     ],
     "gone": [
      4
     ],
     "note": "disabled → skipped by the keyboard"
    },
    {
     "say": "With aria pressed instead, All stays reachable, and is announced as pressed.",
     "vals": [
      "Title",
      "Author",
      "Genre",
      "Add book",
      "All (pressed)",
      "To read",
      "Finished",
      "+10 pages",
      "Mark as read",
      "Remove Kindred"
     ],
     "hl": 4,
     "ok": [
      0,
      1,
      2,
      3,
      5,
      6,
      7,
      8,
      9
     ],
     "note": "aria-pressed=\"true\""
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab",
   "title": "Errors that screen readers announce",
   "nodes": [
    {
     "id": "form",
     "label": "Add book",
     "x": 12,
     "y": 25,
     "sub": "submitted empty",
     "art": "form"
    },
    {
     "id": "err",
     "label": "#form-error",
     "x": 50,
     "y": 25,
     "sub": "role=\"alert\"",
     "art": "warning"
    },
    {
     "id": "sr",
     "label": "Screen reader",
     "x": 88,
     "y": 50,
     "sub": "speaks it",
     "art": "access"
    },
    {
     "id": "input",
     "label": "Title input",
     "x": 50,
     "y": 78,
     "sub": "aria-invalid · aria-describedby",
     "art": "pencil"
    }
   ],
   "edges": [
    {
     "from": "form",
     "to": "err"
    },
    {
     "from": "err",
     "to": "sr"
    },
    {
     "from": "input",
     "to": "err"
    },
    {
     "from": "input",
     "to": "sr"
    }
   ],
   "beats": [
    {
     "say": "Here's how the form error reaches someone who can't see it.",
     "show": 4
    },
    {
     "say": "You submit an empty form, and the error paragraph appears.",
     "on": "err",
     "send": {
      "from": "form",
      "to": "err",
      "label": "Please enter both a title and an author."
     }
    },
    {
     "say": "Role alert means the screen reader reads it out at once.",
     "on": "sr",
     "send": {
      "from": "err",
      "to": "sr",
      "label": "announced immediately"
     }
    },
    {
     "say": "Aria described by points the title input at that error, by its I D, form error.",
     "on": "input",
     "send": {
      "from": "input",
      "to": "err",
      "label": "aria-describedby=\"form-error\""
     }
    },
    {
     "say": "So when focus returns to the input, it's read as invalid, followed by the error text.",
     "on": "sr",
     "send": {
      "from": "input",
      "to": "sr",
      "label": "Title, invalid entry, Please enter both…"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Alt text",
   "title": "Describe what matters, or nothing",
   "columns": [
    "Image",
    "alt",
    "Why"
   ],
   "rows": [
    [
     "A book cover",
     "\"Cover of Kindred\"",
     "It carries information"
    ],
    [
     "A decorative swirl",
     "\"\"",
     "Screen readers skip it"
    ],
    [
     "Magnifying glass, the search button's only content",
     "\"Search\"",
     "Describe the action"
    ],
    [
     "Any image",
     "(left out)",
     "Never: it may read the file name"
    ]
   ],
   "beats": [
    {
     "say": "Your turn: alt text for three images.",
     "col": 1
    },
    {
     "say": "A book cover carries information, so describe it: cover of, and the title.",
     "hl": 0
    },
    {
     "say": "A decorative swirl adds nothing, so alt is empty, and screen readers skip it.",
     "hl": 1
    },
    {
     "say": "When an icon is a button's only content, describe the action: search.",
     "hl": 2
    },
    {
     "say": "And never leave alt out completely.",
     "hl": 3,
     "dim": true
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "When should an image have alt=\"\"?",
   "options": [
    "Never; every image needs a description",
    "When it's purely decorative, so screen readers skip it",
    "When it's a button"
   ],
   "answer": 1,
   "good": "That's right. An empty alt is for purely decorative images, so screen readers skip them. Never leave alt out entirely.",
   "bad": "Not quite. An empty alt is for purely decorative images, so screen readers skip them. Never leave alt out entirely.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "When should an image have an empty alt?",
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
     "Works by keyboard, focus visible",
     ""
    ],
    [
     "Errors announced; Lighthouse passes",
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
     "say": "the app works by keyboard alone, with visible focus,",
     "show": 1
    },
    {
     "say": "errors are announced, and the Lighthouse accessibility audit passes.",
     "show": 2
    },
    {
     "say": "Next, in Module 8, Next dot js.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 8: Next.js Routing, Layouts and Links

**Time: about 2 hours**

### Concept

Real products have many pages. **Next.js** adds pages and a server on top of React. In its **App Router**, folders inside `app/` define URLs:

```
app/
  layout.js            -> wraps every page (header, nav)
  page.js              -> /
  about/page.js        -> /about
  books/page.js        -> /books
  books/[id]/page.js   -> /books/1, /books/2, ... (dynamic route)
  books/[id]/loading.js -> shown while that page loads
```

- Only a `page.js` file makes a folder a visitable page.
- A `layout.js` wraps the pages below it and **stays on screen** during navigation. The root layout contains `<html>` and `<body>`.
- A folder like `[id]` is a **dynamic segment**: one file handles every value. Its `params` prop is a **Promise** (Next.js 15+), so the page is `async` and uses `await params`.
- `Link` (from `next/link`) navigates without a full reload and prefetches pages.
- `notFound()` shows the 404 page.

New projects have **Cache Components** on (`cacheComponents: true` in `next.config.mjs`). Next.js prerenders as much as possible at build time, and anything that needs the request (dynamic `params`, fresh data) must sit inside a loading boundary: a `loading.js` file or a `<Suspense>` component. If you forget, Next.js shows an error explaining the fix.

### Where you'd actually use this

Shops (`/products/[id]`), blogs (`/blog/[slug]`), dashboards sharing one sidebar layout.

### Lab

1. **Create the project** (in a new terminal, outside the `reading-list` folder):
```bash
npx create-next-app@latest reading-list-next --js --no-tailwind --eslint --app --no-src-dir --yes
cd reading-list-next
npm run dev
```
`--js` gives JavaScript files (the default is TypeScript); `--yes` accepts the recommended defaults for everything else. Open `http://localhost:3000`.

2. **Clean up the starter page.** Delete `app/page.module.css`. Replace everything in `app/globals.css` with:
```css
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #fafafa;
  color: #222;
}

.site-header nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #222;
}

.site-header a {
  color: white;
}

main {
  max-width: 640px;
  margin: 0 auto;
  padding: 1rem;
}

.add-form {
  display: grid;
  gap: 0.4rem;
  max-width: 400px;
}

.error {
  color: #b00020;
}
```

3. **Create the data** in a new `lib` folder next to `app`, as `lib/books.js`:
```js
// A stand-in for a real database: a list kept in the server's memory.
export const books = [
  { id: "1", title: "Kindred", author: "Octavia E. Butler", genre: "Science fiction", read: false },
  { id: "2", title: "Hidden Figures", author: "Margot Lee Shetterly", genre: "History", read: true },
  { id: "3", title: "Things Fall Apart", author: "Chinua Achebe", genre: "Fiction", read: false },
];
```
IDs are strings because URL segments are strings.

4. **Write the root layout.** Replace `app/layout.js`:
```jsx
import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Reading List",
  description: "Books I want to read, built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <nav aria-label="Main">
            <Link href="/">Home</Link>
            <Link href="/books">Books</Link>
            <Link href="/about">About</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
```
`children` is the current page; `metadata` sets the `<title>`.

5. **Add the pages.** Replace `app/page.js`:
```jsx
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <h1>My Reading List</h1>
      <p>Track the books you want to read and the ones you have finished.</p>
      <Link href="/books">See all books</Link>
    </>
  );
}
```
Create `app/about/page.js`:
```jsx
export const metadata = { title: "About | Reading List" };

export default function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>A small app built while learning React and Next.js.</p>
    </>
  );
}
```
Create `app/books/page.js`:
```jsx
import Link from "next/link";
import { books } from "@/lib/books";

export default function BooksPage() {
  return (
    <>
      <h1>Books</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <Link href={`/books/${book.id}`}>{book.title}</Link> by {book.author}
          </li>
        ))}
      </ul>
    </>
  );
}
```
`@/` means the project root.

6. **Add the dynamic route** `app/books/[id]/page.js` (the folder name includes the brackets):
```jsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { books } from "@/lib/books";

export default async function BookPage({ params }) {
  const { id } = await params;
  const book = books.find((b) => b.id === id);

  if (!book) {
    notFound(); // shows the built-in 404 page
  }

  return (
    <>
      <h1>{book.title}</h1>
      <p>
        by {book.author} · {book.genre}
      </p>
      <p>Status: {book.read ? "Finished" : "To read"}</p>
      <Link href="/books">Back to all books</Link>
    </>
  );
}
```
Create its loading boundary, `app/books/[id]/loading.js`:
```jsx
export default function Loading() {
  return <p>Loading book...</p>;
}
```
7. Click around: the header never flickers, because the layout stays. Visit `/books/999` for the 404 page.
8. **Your turn.** Create `app/books/layout.js` returning `<section><p>Your library</p>{children}</section>` (it receives `{ children }`). Only pages under `/books` show the line.

### Checkpoint
A Next.js app with a shared layout, four kinds of page, a dynamic route and a 404.

### Quiz

1. How does the App Router decide a page's URL?
2. What does a `layout.js` file do?
3. What does a folder named `[id]` create, and how does the page read the value?
4. Why use `Link` instead of a plain `<a>` for pages inside your app?
5. With Cache Components on, why did `/books/[id]` need a `loading.js` file?

*Answers: 1) From the folder path inside `app/`; a folder becomes a URL segment and its `page.js` file is the page shown there. 2) It wraps all pages below it with shared UI such as a header, and stays on screen without re-rendering when navigating between those pages. 3) A dynamic route matching any value in that position; the page awaits its `params` prop and reads `id` from it. 4) `Link` navigates without a full page reload and prefetches pages, so navigation feels instant. 5) The page depends on the requested URL value, which only exists at request time, so Next.js needs a loading boundary to show while it renders.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "browser",
   "kicker": "Module 8 · Next.js routing",
   "title": "Pages, layouts and links",
   "beats": [
    {
     "say": "Welcome to Module 8."
    },
    {
     "say": "Real products have many pages. Next dot js adds pages and a server on top of React."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Folders inside app/ become URLs",
   "columns": [
    "File",
    "URL"
   ],
   "rows": [
    [
     "app/layout.js",
     "wraps every page"
    ],
    [
     "app/page.js",
     "/"
    ],
    [
     "app/about/page.js",
     "/about"
    ],
    [
     "app/books/page.js",
     "/books"
    ],
    [
     "app/books/[id]/page.js",
     "/books/1, /books/2, …"
    ],
    [
     "app/books/[id]/loading.js",
     "shown while that page loads"
    ]
   ],
   "beats": [
    {
     "say": "In the App Router, the folder path decides the U R L.",
     "col": 0
    },
    {
     "say": "Page dot j s in the app folder is the home page, slash.",
     "hl": 1
    },
    {
     "say": "An about folder with a page dot j s becomes slash about. Books becomes slash books.",
     "hl": [
      2,
      3
     ]
    },
    {
     "say": "Only a page dot j s file makes a folder visitable.",
     "hl": [
      1,
      2,
      3,
      4
     ],
     "col": 0
    },
    {
     "say": "A folder in square brackets is a dynamic segment. One file handles every book.",
     "hl": 4,
     "col": 1
    },
    {
     "say": "Loading dot j s shows while that page loads, and layout dot j s wraps all the pages below it.",
     "hl": [
      0,
      5
     ],
     "dim": true
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "The layout stays. Only the page swaps",
   "nodes": [
    {
     "id": "lay",
     "label": "RootLayout",
     "x": 50,
     "y": 14,
     "sub": "<html> · header · nav",
     "art": "layout"
    },
    {
     "id": "home",
     "label": "Home",
     "x": 12,
     "y": 72,
     "sub": "/",
     "art": "browser"
    },
    {
     "id": "books",
     "label": "Books",
     "x": 37,
     "y": 72,
     "sub": "/books",
     "art": "array"
    },
    {
     "id": "book",
     "label": "Book",
     "x": 63,
     "y": 72,
     "sub": "/books/2",
     "art": "book"
    },
    {
     "id": "about",
     "label": "About",
     "x": 88,
     "y": 72,
     "sub": "/about",
     "art": "file"
    }
   ],
   "edges": [
    {
     "from": "lay",
     "to": "home"
    },
    {
     "from": "lay",
     "to": "books"
    },
    {
     "from": "lay",
     "to": "book"
    },
    {
     "from": "lay",
     "to": "about"
    }
   ],
   "beats": [
    {
     "say": "The root layout holds the H T M L, the body, and the header with its links.",
     "show": 5,
     "on": "lay"
    },
    {
     "say": "On the home page, the layout's children is the home page.",
     "on": [
      "lay",
      "home"
     ],
     "send": {
      "from": "lay",
      "to": "home",
      "label": "children"
     }
    },
    {
     "say": "Click the Books link. Only the children swap. The header stays on screen, and never flickers.",
     "on": [
      "lay",
      "books"
     ],
     "send": {
      "from": "lay",
      "to": "books",
      "label": "<Link href=\"/books\">"
     }
    },
    {
     "say": "Click a book, and the dynamic page fills the same slot.",
     "on": [
      "lay",
      "book"
     ],
     "send": {
      "from": "lay",
      "to": "book",
      "label": "/books/2"
     }
    },
    {
     "say": "Link navigates without a full reload, and prefetches pages, so it feels instant.",
     "on": "lay"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Trace it",
   "title": "One file, every book",
   "file": "app/books/[id]/page.js",
   "code": "import { notFound } from \"next/navigation\";\nimport { books } from \"@/lib/books\";\nexport default async function BookPage({ params }) {\n  const { id } = await params;\n  const book = books.find((b) => b.id === id);\n  if (!book) notFound(); // shows the built-in 404 page\n  return (\n    <>\n      <h1>{book.title}</h1>\n      <p>by {book.author} · {book.genre}</p>\n      <p>Status: {book.read ? \"Finished\" : \"To read\"}</p>\n    </>\n  );\n}",
   "beats": [
    {
     "say": "You visit slash books slash two.",
     "line": 3
    },
    {
     "say": "Params is a promise, so the page is async and awaits it. I D is the text two.",
     "line": 4,
     "vars": {
      "id": "\"2\""
     }
    },
    {
     "say": "Find looks for a book whose I D equals two. That's why the I Ds in lib slash books are strings: U R L parts are text.",
     "line": 5,
     "vars": {
      "book": "{ id: \"2\", title: \"Hidden Figures\", … }"
     }
    },
    {
     "say": "A book was found, so we skip not found.",
     "line": 6
    },
    {
     "say": "The page renders Hidden Figures.",
     "line": [
      9,
      10
     ],
     "out": [
      "Hidden Figures",
      "by Margot Lee Shetterly · History"
     ]
    },
    {
     "say": "Its read field is true, so the status says finished.",
     "line": 11,
     "out": "Status: Finished"
    },
    {
     "say": "Now visit slash books slash nine nine nine.",
     "line": 4,
     "vars": {
      "id": "\"999\""
     }
    },
    {
     "say": "No book matches, so find gives undefined.",
     "line": 5,
     "vars": {
      "book": "undefined"
     }
    },
    {
     "say": "Not found stops the page and shows the four oh four page instead.",
     "line": 6,
     "out": "404 | This page could not be found."
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does a folder named [id] create?",
   "options": [
    "A private folder",
    "A dynamic route that matches any value in that position",
    "A folder only admins can see"
   ],
   "answer": 1,
   "good": "That's right. A dynamic route. One file handles every value, and the page awaits its params to read the I D.",
   "bad": "Not quite. A dynamic route. One file handles every value, and the page awaits its params to read the I D.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does a folder named I D, in square brackets, create?",
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
     "Layout, pages, dynamic route and 404",
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
     "say": "you have a Next dot js app with a shared layout, several pages, a dynamic route and a four oh four.",
     "show": 1
    },
    {
     "say": "Next, in Module 9, Server and Client Components.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 9: Server and Client Components

**Time: about 1.5 hours**

### Concept

In the App Router, components are **Server Components** by default: they run on the server (or at build time), the browser gets HTML, and their code is never sent to the browser. They can be `async`, read databases and secrets safely, and keep big libraries out of the download. But they can't use `useState`, `useEffect`, event handlers or browser APIs.

A **Client Component** has `"use client";` at the top of its file. It's rendered to HTML on the server, then its JavaScript runs in the browser so it can hold state and respond to clicks (**hydration**). Components imported into a client file become client code too.

| Use a Server Component when... | Use a Client Component when... |
|---|---|
| fetching data or reading a database | you need `useState`, `useEffect` or other hooks |
| using secrets (API keys) | you need event handlers like `onClick` or `onChange` |
| rendering mostly static content | you need browser APIs like `localStorage` |

Keep pages as Server Components and make **small interactive pieces** Client Components. Props from server to client must be **serializable** (strings, numbers, arrays, plain objects), not ordinary functions, because they travel over the network. (Server Actions, Module 11, are the exception.)

### Where you'd actually use this

A product page renders details on the server; the "Add to cart" button is a small Client Component.

### Lab

1. Add `console.log("Rendering BooksPage");` inside `BooksPage` and visit `/books`. The message appears in your **terminal**, not the browser console. Remove it.
2. Temporarily add `import { useState } from "react";` and `const [x, setX] = useState(0);` to `BookPage`. Next.js errors: `useState` needs a Client Component. Remove both lines.
3. **Create a Client Component** `app/ui/PagesCounter.js` (your counter from the React app):
```jsx
"use client";

import { useState } from "react";

export default function PagesCounter({ title }) {
  const [pagesRead, setPagesRead] = useState(0);

  return (
    <section>
      <p>
        Pages of {title} read this session: {pagesRead}
      </p>
      <button type="button" onClick={() => setPagesRead((pages) => pages + 10)}>
        +10 pages
      </button>
    </section>
  );
}
```
4. **Use it inside the Server Component page.** In `app/books/[id]/page.js`, add the import:
```jsx
import PagesCounter from "@/app/ui/PagesCounter";
```
and put `<PagesCounter title={book.title} />` above the "Back to all books" link. Only the counter's code goes to the browser.
5. **Your turn.** In developer tools > Sources, search loaded files for "Pages of". The counter's code is there; `BookPage` and `lib/books.js` aren't.

### Checkpoint
The detail page (server) renders an interactive counter (client).

### Quiz

1. Where do Server Components run, and are they the default?
2. How do you make a component a Client Component?
3. Name two things a Server Component cannot do.
4. Why must props passed from a Server Component to a Client Component be serializable?
5. Why keep Client Components small and push them down to the "leaves" of the page?

*Answers: 1) On the server (or at build time), and yes, every component in the App Router is a Server Component unless marked otherwise. 2) Put the `"use client"` directive at the very top of its file. 3) Use hooks such as `useState` or `useEffect`, attach event handlers like `onClick`, or use browser APIs such as `localStorage` (any two). 4) They are sent from the server to the browser over the network, so they must be plain data such as strings, numbers, arrays and plain objects. 5) Only Client Component code is sent to the browser, so small client pieces mean less JavaScript to download while the rest renders on the server.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "architecture",
   "kicker": "Module 9 · Server and Client Components",
   "title": "Where does this code run?",
   "beats": [
    {
     "say": "Welcome to Module 9."
    },
    {
     "say": "In the App Router, components are Server Components by default. They run on the server, and their code is never sent to the browser."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "A server page with one client piece",
   "nodes": [
    {
     "id": "data",
     "label": "lib/books.js",
     "x": 12,
     "y": 22,
     "sub": "server only",
     "art": "database"
    },
    {
     "id": "page",
     "label": "BookPage",
     "x": 46,
     "y": 22,
     "sub": "Server Component",
     "art": "server"
    },
    {
     "id": "counter",
     "label": "PagesCounter",
     "x": 46,
     "y": 80,
     "sub": "\"use client\"",
     "art": "cursor"
    },
    {
     "id": "browser",
     "label": "Browser",
     "x": 86,
     "y": 50,
     "sub": "HTML + a little JS",
     "art": "browser"
    }
   ],
   "edges": [
    {
     "from": "data",
     "to": "page"
    },
    {
     "from": "page",
     "to": "counter"
    },
    {
     "from": "page",
     "to": "browser"
    },
    {
     "from": "counter",
     "to": "browser"
    }
   ],
   "beats": [
    {
     "say": "Book Page is a Server Component. It runs on the server, so it can read the data directly.",
     "show": 2,
     "on": "page",
     "send": {
      "from": "data",
      "to": "page",
      "label": "Hidden Figures"
     }
    },
    {
     "say": "Inside it sits Pages Counter, which starts with use client. That makes it a Client Component.",
     "show": 3,
     "on": "counter",
     "send": {
      "from": "page",
      "to": "counter",
      "label": "title=\"Hidden Figures\""
     }
    },
    {
     "say": "The server renders everything to H T M L, and sends it.",
     "show": 4,
     "on": "browser",
     "send": {
      "from": "page",
      "to": "browser",
      "label": "HTML"
     }
    },
    {
     "say": "Only the counter's JavaScript follows, so it can come alive in the browser. That's hydration.",
     "on": "browser",
     "send": {
      "from": "counter",
      "to": "browser",
      "label": "PagesCounter.js"
     }
    },
    {
     "say": "Book Page's code and lib slash books never reach the browser.",
     "on": [
      "data",
      "page"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Server or client?",
   "columns": [
    "You need to…",
    "Use a"
   ],
   "rows": [
    [
     "Fetch data or read a database",
     "Server Component"
    ],
    [
     "Use a secret, like an API key",
     "Server Component"
    ],
    [
     "Render mostly static content",
     "Server Component"
    ],
    [
     "useState, useEffect or other hooks",
     "Client Component"
    ],
    [
     "onClick or onChange",
     "Client Component"
    ],
    [
     "Browser APIs like localStorage",
     "Client Component"
    ]
   ],
   "beats": [
    {
     "say": "How do you choose?",
     "col": 0
    },
    {
     "say": "Data, secrets and mostly static content stay on the server. That's the default, so you write nothing.",
     "hl": [
      0,
      1,
      2
     ]
    },
    {
     "say": "Hooks, event handlers and browser A P Is need the browser.",
     "sql": "\"use client\";   ← first line of the file",
     "hl": [
      3,
      4,
      5
     ]
    },
    {
     "say": "Try use state in Book Page, and Next dot js stops you with an error.",
     "hl": 3,
     "dim": true,
     "col": 1
    },
    {
     "say": "So keep pages on the server, and make small interactive pieces client components.",
     "hl": [
      0,
      4
     ],
     "col": 1
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab",
   "title": "The counter runs in the browser",
   "file": "app/ui/PagesCounter.js",
   "code": "\"use client\";\nimport { useState } from \"react\";\nexport default function PagesCounter({ title }) {\n  const [pagesRead, setPagesRead] = useState(0);\n  return (\n    <section>\n      <p>Pages of {title} read this session: {pagesRead}</p>\n      <button type=\"button\" onClick={() => setPagesRead((pages) => pages + 10)}>\n        +10 pages\n      </button>\n    </section>\n  );\n}",
   "beats": [
    {
     "say": "Line one, use client, marks this file as client code.",
     "line": 1
    },
    {
     "say": "The server page passes one prop: a plain string, the title.",
     "line": 3,
     "vars": {
      "title": "\"Hidden Figures\""
     }
    },
    {
     "say": "The server renders the first H T M L, with pages read at zero.",
     "line": [
      4,
      7
     ],
     "vars": {
      "pagesRead": 0
     },
     "out": "Pages of Hidden Figures read this session: 0"
    },
    {
     "say": "After hydration, the button works. Click it, and state updates right in the browser.",
     "line": 8,
     "vars": {
      "pagesRead": 10
     },
     "out": "Pages of Hidden Figures read this session: 10"
    },
    {
     "say": "No trip to the server for that. The rest of the page was server-rendered H T M L.",
     "line": 7
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Props from server to client must be plain data",
   "columns": [
    "Prop",
    "Can it cross?"
   ],
   "rows": [
    [
     "title=\"Hidden Figures\"",
     "Yes: a string"
    ],
    [
     "pages={10}",
     "Yes: a number"
    ],
    [
     "book={{ id: \"2\", read: true }}",
     "Yes: a plain object"
    ],
    [
     "onDone={() => …}",
     "No: a function"
    ]
   ],
   "beats": [
    {
     "say": "Props from a server component travel over the network to the browser."
    },
    {
     "say": "So they must be serializable: strings, numbers,",
     "hl": [
      0,
      1
     ]
    },
    {
     "say": "arrays and plain objects.",
     "hl": 2
    },
    {
     "say": "An ordinary function can't be sent. Server Actions, in Module 11, are the one exception.",
     "hl": 3,
     "dim": true
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why must props from a Server to a Client Component be serializable?",
   "options": [
    "To make them faster",
    "They travel over the network, so they must be plain data",
    "Client Components can't read objects"
   ],
   "answer": 1,
   "good": "That's right. They're sent from the server to the browser over the network, so they must be plain data like strings, numbers, arrays and plain objects.",
   "bad": "Not quite. They're sent from the server to the browser over the network, so they must be plain data like strings, numbers, arrays and plain objects.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why must props from a Server Component to a Client Component be serializable?",
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
     "A server page with a client counter",
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
     "say": "the detail page, on the server, renders an interactive counter, on the client.",
     "show": 1
    },
    {
     "say": "Next, in Module 10, fetching data on the server.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 10: Server Data Fetching and Route Handlers

**Time: about 2 hours**

### Concept

Instead of `useEffect` in the browser, a Server Component can be `async` and `await` its data (`fetch()` or a database query). Secrets stay on the server and the HTML arrives with the data.

With Cache Components on:
- **Mark request-time data.** Our fake in-memory database is instant, so Next.js would bake the list into the page at build time. `await connection()` (from `next/server`) says "wait for a real request", as a real database call would. (Caching with `"use cache"` is a later topic.)
- **Stream with Suspense.** Wrap the data-loading part in `<Suspense fallback={...}>`; the rest of the page is sent at once and the list streams in. It's the server version of your React loading state.

A **Route Handler** is an API endpoint returning data (usually JSON) instead of a page. In `app/api/books/route.js`, export functions named after HTTP methods (`GET`, `POST`, ...) using the standard `Request` and `Response` objects. Use them when something **other than your pages** needs the data: a mobile app, another service, a webhook.

### Where you'd actually use this

A dashboard loading account data on the server; an `/api/products` endpoint for a mobile app.

### Lab

1. **Turn the data into async functions.** Replace `lib/books.js`:
```js
import { connection } from "next/server";

// A stand-in for a real database: a list kept in the server's memory.
// We store it on globalThis so pages, Server Actions and Route Handlers all
// share one copy. It starts over every time the server restarts.
globalThis.readingListBooks ??= [
  { id: "1", title: "Kindred", author: "Octavia E. Butler", genre: "Science fiction", read: false },
  { id: "2", title: "Hidden Figures", author: "Margot Lee Shetterly", genre: "History", read: true },
  { id: "3", title: "Things Fall Apart", author: "Chinua Achebe", genre: "Fiction", read: false },
];
const books = globalThis.readingListBooks;

export async function getBooks() {
  await connection(); // like a database query: run it for each request, not at build time
  return books;
}

export async function getBook(id) {
  await connection();
  return books.find((book) => book.id === id);
}

export function validateBook({ title, author }) {
  if (!title || !author) {
    return "Please enter both a title and an author.";
  }
  if (title.length > 100) {
    return "Titles can be at most 100 characters.";
  }
  return "";
}

export async function createBook({ title, author, genre }) {
  const book = {
    id: crypto.randomUUID(),
    title,
    author,
    genre: genre || "Fiction",
    read: false,
  };
  books.push(book);
  return book;
}
```
Why `globalThis`? Next.js bundles pages and Route Handlers separately, so a plain module-level array can become two copies that don't see each other's changes. (`??=` assigns only if not already set.) Real apps use a database.

2. **Fetch on the server with streaming.** Replace `app/books/page.js`:
```jsx
import { Suspense } from "react";
import Link from "next/link";
import { getBooks } from "@/lib/books";

async function BookList() {
  const books = await getBooks(); // runs on the server

  if (books.length === 0) {
    return <p>No books yet.</p>;
  }

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>
          <Link href={`/books/${book.id}`}>{book.title}</Link> by {book.author}
          {book.read && " (finished)"}
        </li>
      ))}
    </ul>
  );
}

export default function BooksPage() {
  return (
    <>
      <h1>Books</h1>
      <p>
        <Link href="/books/new">Add a book</Link>
      </p>
      <Suspense fallback={<p>Loading books...</p>}>
        <BookList />
      </Suspense>
    </>
  );
}
```
No `useEffect` or loading variables. (The "Add a book" link 404s until Module 11.)

3. **Update the detail page.** In `app/books/[id]/page.js`, change the data import to `import { getBook } from "@/lib/books";` and the `books.find(...)` line to:
```jsx
  const book = await getBook(id);
```

4. **Create a Route Handler.** Create `app/api/books/route.js`:
```js
import { createBook, getBooks, validateBook } from "@/lib/books";

// GET /api/books -> the whole list as JSON
export async function GET() {
  const books = await getBooks();
  return Response.json(books);
}

// POST /api/books -> add a book from a JSON body like {"title": "...", "author": "..."}
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send a JSON body." }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  const author = String(body.author ?? "").trim();
  const genre = String(body.genre ?? "Fiction");

  const error = validateBook({ title, author });
  if (error) {
    return Response.json({ error }, { status: 400 });
  }

  const book = await createBook({ title, author, genre });
  return Response.json(book, { status: 201 });
}
```
Status `400` means "bad request"; `201` means "created".

5. **Test the API.** Open `http://localhost:3000/api/books` to see JSON. In a second terminal, add a book (in Windows PowerShell, type `curl.exe`):
```bash
curl -X POST http://localhost:3000/api/books -H "Content-Type: application/json" -d "{\"title\": \"Atomic Habits\", \"author\": \"James Clear\", \"genre\": \"Tech\"}"
```
Refresh `/books` to see it. Send an empty title to see the 400 error.
6. **Your turn.** Create `app/api/books/[id]/route.js` with `GET(request, { params })` that awaits `params`, calls `getBook(id)`, and returns the book, or `Response.json({ error: "Not found" }, { status: 404 })`.

### Checkpoint
Pages load data on the server, `/books` streams with a fallback, and `/api/books` handles `GET` and validated `POST`. Data resets on restart; real apps use a database (see the Databases course).

### Quiz

1. How does a Server Component fetch data, compared with the React `useEffect` approach?
2. What does `<Suspense fallback={...}>` do around `BookList`?
3. Why does `getBooks` call `await connection()` in this app?
4. Where does a Route Handler for `/api/books` live, and what does it export?
5. When do you need a Route Handler rather than fetching inside a Server Component?

*Answers: 1) It is an `async` function that awaits the data directly on the server, so the HTML arrives with the data and no loading state variables or effects are needed in the browser. 2) It shows the fallback immediately and streams the list into the page once its data is ready, while the rest of the page is sent right away. 3) The in-memory list is instant, so without it Next.js would bake the list into the page at build time; `connection()` marks it as request-time data like a real database query. 4) In `app/api/books/route.js`, exporting functions named after HTTP methods such as `GET` and `POST`. 5) When something other than your own pages needs the data or needs to send data, such as a mobile app, another service or a webhook.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "database",
   "kicker": "Module 10 · Server data and Route Handlers",
   "title": "Fetch on the server",
   "beats": [
    {
     "say": "Welcome to Module 10."
    },
    {
     "say": "Instead of use effect in the browser, a Server Component can be async, and await its data. Secrets stay on the server, and the HTML arrives with the data."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Suspense streams the list in",
   "nodes": [
    {
     "id": "browser",
     "label": "Browser",
     "x": 12,
     "y": 50,
     "sub": "visits /books",
     "art": "browser"
    },
    {
     "id": "page",
     "label": "BooksPage",
     "x": 50,
     "y": 18,
     "sub": "heading · link · fallback",
     "art": "layout"
    },
    {
     "id": "list",
     "label": "BookList",
     "x": 50,
     "y": 82,
     "sub": "async · await getBooks()",
     "art": "array"
    },
    {
     "id": "data",
     "label": "lib/books.js",
     "x": 88,
     "y": 82,
     "sub": "await connection()",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "browser",
     "to": "page"
    },
    {
     "from": "browser",
     "to": "list"
    },
    {
     "from": "list",
     "to": "data"
    }
   ],
   "beats": [
    {
     "say": "You visit slash books.",
     "show": 4,
     "on": "browser",
     "send": {
      "from": "browser",
      "to": "page",
      "label": "GET /books"
     }
    },
    {
     "say": "The heading, the link and the fallback are sent straight away. You see loading books.",
     "on": "page",
     "send": {
      "from": "page",
      "to": "browser",
      "label": "Books · Loading books..."
     }
    },
    {
     "say": "Meanwhile, on the server, Book List awaits get books.",
     "on": "list",
     "send": {
      "from": "list",
      "to": "data",
      "label": "getBooks()"
     }
    },
    {
     "say": "Connection says: wait for a real request, as a database query would. Then the books come back.",
     "on": "data",
     "send": {
      "from": "data",
      "to": "list",
      "label": "3 books"
     }
    },
    {
     "say": "The finished list streams into the page, replacing the fallback. No use effect, no loading variables.",
     "on": "browser",
     "send": {
      "from": "list",
      "to": "browser",
      "label": "<ul> 3 books </ul>"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Trace it",
   "title": "A Route Handler for POST /api/books",
   "file": "app/api/books/route.js",
   "code": "export async function POST(request) {\n  let body;\n  try { body = await request.json(); }\n  catch { return Response.json({ error: \"Send a JSON body.\" }, { status: 400 }); }\n  const title = String(body.title ?? \"\").trim();\n  const author = String(body.author ?? \"\").trim();\n  const genre = String(body.genre ?? \"Fiction\");\n  const error = validateBook({ title, author });\n  if (error) return Response.json({ error }, { status: 400 });\n  const book = await createBook({ title, author, genre });\n  return Response.json(book, { status: 201 });\n}",
   "beats": [
    {
     "say": "A Route Handler returns data, not a page. The function's name is the H T T P method: post.",
     "line": 1
    },
    {
     "say": "Curl sends a J S O N body: Atomic Habits, by James Clear, genre Tech.",
     "line": 3,
     "vars": {
      "body": "{ title: \"Atomic Habits\", author: \"James Clear\", genre: \"Tech\" }"
     }
    },
    {
     "say": "We pull out each field as text, and trim the title and author.",
     "line": [
      5,
      7
     ],
     "vars": {
      "title": "\"Atomic Habits\"",
      "author": "\"James Clear\"",
      "genre": "\"Tech\""
     }
    },
    {
     "say": "Validate book finds nothing wrong, so error is empty.",
     "line": 8,
     "vars": {
      "error": "\"\""
     }
    },
    {
     "say": "Create book adds it, and we answer two oh one: created.",
     "line": [
      10,
      11
     ],
     "out": "201 {\"id\":\"…\",\"title\":\"Atomic Habits\",…,\"read\":false}"
    },
    {
     "say": "Now send an empty title.",
     "line": 5,
     "vars": {
      "body": "{ title: \"\", author: \"James Clear\" }",
      "title": "\"\"",
      "genre": "\"Fiction\""
     }
    },
    {
     "say": "Validate book returns a message, so we answer four hundred: bad request.",
     "line": [
      8,
      9
     ],
     "vars": {
      "error": "\"Please enter both a title and an author.\""
     },
     "out": "400 {\"error\":\"Please enter both a title and an author.\"}"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Concept",
   "title": "One shared list in server memory",
   "values": [
    "Kindred",
    "Hidden Figures",
    "Things Fall Apart"
   ],
   "beats": [
    {
     "say": "Here's the stand-in database: an array on global this, shared by pages and Route Handlers."
    },
    {
     "say": "The post pushes Atomic Habits onto it. Push is fine here: this is a server list, not React state.",
     "vals": [
      "Kindred",
      "Hidden Figures",
      "Things Fall Apart",
      "Atomic Habits"
     ],
     "hl": 3,
     "note": "books.push(book)"
    },
    {
     "say": "Refresh slash books, or slash A P I slash books, and both see the same four books.",
     "vals": [
      "Kindred",
      "Hidden Figures",
      "Things Fall Apart",
      "Atomic Habits"
     ],
     "ok": [
      0,
      1,
      2,
      3
     ],
     "note": "globalThis.readingListBooks"
    },
    {
     "say": "But restart the server, and memory starts over. Real apps use a database.",
     "vals": [
      "Kindred",
      "Hidden Figures",
      "Things Fall Apart"
     ],
     "note": "restart → back to the starter books"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Test it",
   "title": "What /api/books answers",
   "columns": [
    "Request",
    "Status",
    "Body"
   ],
   "rows": [
    [
     "GET /api/books",
     "200",
     "the whole list as JSON"
    ],
    [
     "POST Atomic Habits",
     "201",
     "the new book"
    ],
    [
     "POST with an empty title",
     "400",
     "{ error: \"Please enter both…\" }"
    ],
    [
     "POST that isn't JSON",
     "400",
     "{ error: \"Send a JSON body.\" }"
    ],
    [
     "GET /api/books/999 (your turn)",
     "404",
     "{ error: \"Not found\" }"
    ]
   ],
   "beats": [
    {
     "say": "Here's every answer your A P I can give.",
     "col": 1
    },
    {
     "say": "Open slash A P I slash books in the browser to see the list as J S O N.",
     "hl": 0
    },
    {
     "say": "A valid post gets two oh one, created.",
     "hl": 1
    },
    {
     "say": "Bad input gets four hundred, with a message.",
     "hl": [
      2,
      3
     ]
    },
    {
     "say": "Your turn: a handler for one book, which answers four oh four when it's missing.",
     "hl": 4,
     "dim": true
    },
    {
     "say": "Use Route Handlers when something other than your pages needs the data, like a mobile app or a webhook.",
     "col": 0
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does <Suspense fallback={…}> do around BookList?",
   "options": [
    "Hides the list forever",
    "Shows the fallback at once, then streams the list in when ready",
    "Caches the list in the browser"
   ],
   "answer": 1,
   "good": "That's right. The fallback shows immediately, and the list streams into the page once its data is ready.",
   "bad": "Not quite. The fallback shows immediately, and the list streams into the page once its data is ready.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does Suspense, with a fallback, do around Book List?",
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
     "Server data with a streaming fallback",
     ""
    ],
    [
     "/api/books handles GET and POST",
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
     "say": "pages load data on the server, and books streams with a fallback,",
     "show": 1
    },
    {
     "say": "and the A P I handles get, and a validated post.",
     "show": 2
    },
    {
     "say": "Next, in Module 11, Server Actions.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 11: Forms with Server Actions

**Time: about 2 hours**

### Concept

A **Server Action** is an `async` function marked `"use server"` that runs on the server but can be passed straight to a form's `action` prop. React sends the form data, runs the function and updates the page, with no API route or `fetch` code.

- In `app/actions.js`, `"use server";` at the top makes every export a Server Action.
- The action reads fields from a **FormData** object (`formData.get("title")`), so inputs need a `name`.
- For errors and a pending state, a Client Component uses `useActionState(action, initialState)`, which returns `[state, formAction, isPending]`. The action receives the previous state and the FormData, and whatever it **returns** becomes the new `state`.
- After saving, `revalidatePath("/books")` avoids showing a stale cached list and `redirect("/books")` sends the user there.
- **Validate on the server.** Anyone can call a Server Action directly, so real apps also check the user is logged in and allowed.
- A real `<form>` works even before JavaScript loads (**progressive enhancement**).

These inputs are **uncontrolled** (`defaultValue`; the browser holds the value): form actions read the data once, on submit.

### Where you'd actually use this

Contact forms, "create post" pages, settings: any form that saves data on the server.

### Lab

1. **Create the Server Action.** Create `app/actions.js`:
```js
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createBook, validateBook } from "@/lib/books";

export async function addBookAction(previousState, formData) {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const genre = String(formData.get("genre") ?? "Fiction");

  // Always validate on the server, even if the browser also checks
  const error = validateBook({ title, author });
  if (error) {
    return { error, title, author, genre }; // send the typed values back so the form keeps them
  }

  await createBook({ title, author, genre });
  revalidatePath("/books"); // make sure no cached copy of /books is shown
  redirect("/books");
}
```
It reuses `validateBook`, so the API and the form share rules.

2. **Create the form (a Client Component).** Create `app/ui/AddBookForm.js`:
```jsx
"use client";

import { useActionState } from "react";
import { addBookAction } from "@/app/actions";

const initialState = { error: "", title: "", author: "", genre: "Fiction" };

export default function AddBookForm() {
  const [state, formAction, isPending] = useActionState(addBookAction, initialState);

  return (
    <form action={formAction} className="add-form">
      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        defaultValue={state.title}
        aria-invalid={state.error !== ""}
        aria-describedby={state.error ? "form-error" : undefined}
      />

      <label htmlFor="author">Author</label>
      <input
        id="author"
        name="author"
        defaultValue={state.author}
        aria-invalid={state.error !== ""}
        aria-describedby={state.error ? "form-error" : undefined}
      />

      <label htmlFor="genre">Genre</label>
      <select id="genre" name="genre" defaultValue={state.genre}>
        <option>Fiction</option>
        <option>Science fiction</option>
        <option>History</option>
        <option>Tech</option>
      </select>

      {state.error && (
        <p id="form-error" className="error" role="alert">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={isPending}>
        {isPending ? "Adding..." : "Add book"}
      </button>
    </form>
  );
}
```
Your Module 7 accessibility patterns carry over.

3. **Create the page.** Create `app/books/new/page.js` (a Server Component that renders the form):
```jsx
import AddBookForm from "@/app/ui/AddBookForm";

export const metadata = { title: "Add a book | Reading List" };

export default function NewBookPage() {
  return (
    <>
      <h1>Add a book</h1>
      <AddBookForm />
    </>
  );
}
```
4. From `/books`, click **Add a book** and submit with only an author: the error shows and your typing is kept. Add a real book: you land on `/books` with it listed, and `/api/books` sees it too.
5. Add `await new Promise((resolve) => setTimeout(resolve, 1500));` as the first line of `addBookAction` and submit: the button shows "Adding..." and is disabled. Remove the line.
6. **Your turn.** Add an optional labelled `<textarea id="note" name="note">`, save it in `createBook`, and show it on the detail page only when present.

### Checkpoint
`/books/new` adds books via a Server Action with server-side validation, a pending state and a redirect.

### Quiz

1. What is a Server Action, and how do you mark one?
2. How does the action read the submitted values, and what must each input have?
3. What does `useActionState` return, and where does `state` come from?
4. Why must you validate inside the Server Action even if the browser also validates?
5. What do `revalidatePath("/books")` and `redirect("/books")` do after saving?

*Answers: 1) An async function that runs on the server but can be passed to a form's `action`; you mark it with the `"use server"` directive, here at the top of `app/actions.js`. 2) From the FormData object using `formData.get("fieldName")`, so each input needs a `name` attribute. 3) The current state, a form action to pass to the form, and an `isPending` flag; `state` is whatever the action last returned, starting with the initial state. 4) Anyone can send a request to a Server Action directly, skipping the browser checks, so the server must enforce the rules. 5) `revalidatePath` makes sure no stale cached copy of the list is shown, and `redirect` sends the user to the books page after a successful save.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "form",
   "kicker": "Module 11 · Server Actions",
   "title": "Forms that save on the server",
   "beats": [
    {
     "say": "Welcome to Module 11."
    },
    {
     "say": "A Server Action is an async function marked use server. It runs on the server, but you can pass it straight to a form's action."
    },
    {
     "say": "No A P I route, and no fetch code."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "From form to server and back",
   "nodes": [
    {
     "id": "form",
     "label": "AddBookForm",
     "x": 12,
     "y": 50,
     "sub": "Client Component",
     "art": "form"
    },
    {
     "id": "action",
     "label": "addBookAction",
     "x": 50,
     "y": 18,
     "sub": "\"use server\"",
     "art": "server"
    },
    {
     "id": "db",
     "label": "lib/books.js",
     "x": 88,
     "y": 18,
     "sub": "createBook",
     "art": "database"
    },
    {
     "id": "list",
     "label": "/books",
     "x": 88,
     "y": 82,
     "sub": "the updated list",
     "art": "browser"
    }
   ],
   "edges": [
    {
     "from": "form",
     "to": "action"
    },
    {
     "from": "action",
     "to": "db"
    },
    {
     "from": "action",
     "to": "list"
    }
   ],
   "beats": [
    {
     "say": "The form's action is a function that runs on the server.",
     "show": 4
    },
    {
     "say": "You submit with only an author. React sends the form data to the action.",
     "on": "action",
     "send": {
      "from": "form",
      "to": "action",
      "label": "FormData: title=\"\", author=\"James Clear\""
     }
    },
    {
     "say": "Validation fails, so the action returns the error and the typed values. The form shows the error and keeps your typing.",
     "on": "form",
     "send": {
      "from": "action",
      "to": "form",
      "label": "{ error, title, author, genre }"
     }
    },
    {
     "say": "You fill in the title and submit again. This time the action saves the book.",
     "on": "db",
     "send": {
      "from": "action",
      "to": "db",
      "label": "createBook({ title: \"Atomic Habits\", … })"
     }
    },
    {
     "say": "Then revalidate path makes sure no stale copy of books is shown, and redirect takes you there.",
     "on": "list",
     "send": {
      "from": "action",
      "to": "list",
      "label": "redirect(\"/books\")"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Trace it",
   "title": "The action validates on the server",
   "file": "app/actions.js",
   "code": "\"use server\";\n// imports: revalidatePath, redirect, createBook, validateBook\nexport async function addBookAction(previousState, formData) {\n  const title = String(formData.get(\"title\") ?? \"\").trim();\n  const author = String(formData.get(\"author\") ?? \"\").trim();\n  const genre = String(formData.get(\"genre\") ?? \"Fiction\");\n  const error = validateBook({ title, author });\n  if (error) {\n    return { error, title, author, genre }; // send the typed values back so the form keeps them\n  }\n  await createBook({ title, author, genre });\n  revalidatePath(\"/books\"); // make sure no cached copy of /books is shown\n  redirect(\"/books\");\n}",
   "beats": [
    {
     "say": "Use server at the top makes every export in this file a Server Action.",
     "line": 1
    },
    {
     "say": "The action reads each field from form data by its name. That's why every input needs a name.",
     "line": [
      4,
      6
     ],
     "vars": {
      "title": "\"\"",
      "author": "\"James Clear\"",
      "genre": "\"Fiction\""
     }
    },
    {
     "say": "The same validate book as the A P I. The title is empty, so there's an error.",
     "line": 7,
     "vars": {
      "error": "\"Please enter both a title and an author.\""
     }
    },
    {
     "say": "Whatever the action returns becomes the form's new state.",
     "line": [
      8,
      9
     ],
     "out": "state = { error: \"Please enter both…\", title: \"\", author: \"James Clear\", genre: \"Fiction\" }"
    },
    {
     "say": "Second try: Atomic Habits, by James Clear. Validation passes.",
     "line": [
      4,
      7
     ],
     "vars": {
      "title": "\"Atomic Habits\"",
      "error": "\"\""
     }
    },
    {
     "say": "Create book saves it. Revalidate path and redirect send you to the fresh list.",
     "line": [
      11,
      13
     ]
    },
    {
     "say": "Always validate here. Anyone can call a Server Action directly, skipping the browser.",
     "line": 7
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "useActionState tracks each submit",
   "columns": [
    "Moment",
    "isPending",
    "state.error",
    "Button"
   ],
   "rows": [
    [
     "Page loads",
     "false",
     "\"\"",
     "Add book"
    ],
    [
     "Submitted, waiting",
     "true",
     "\"\"",
     "Adding... (disabled)"
    ],
    [
     "Action returned an error",
     "false",
     "\"Please enter both…\"",
     "Add book"
    ]
   ],
   "beats": [
    {
     "say": "Use action state returns three things: the state, a form action, and is pending.",
     "sql": "const [state, formAction, isPending] = useActionState(addBookAction, initialState);"
    },
    {
     "say": "When the page loads, state is the initial state: no error.",
     "hl": 0
    },
    {
     "say": "While the action runs, is pending is true, so the button says adding, and is disabled.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "When the action returns, its result becomes the state, and the error shows.",
     "hl": 2,
     "col": 2
    },
    {
     "say": "Add a one and a half second delay to the action to watch the pending state yourself.",
     "hl": 1,
     "dim": true,
     "col": 3
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Compare",
   "title": "Controlled vs uncontrolled inputs",
   "columns": [
    "",
    "Module 4 form",
    "Server Action form"
   ],
   "rows": [
    [
     "The value lives in",
     "React state: value=",
     "The browser: defaultValue="
    ],
    [
     "It's read",
     "On every keystroke",
     "Once, on submit"
    ],
    [
     "Each input needs",
     "value + onChange",
     "a name"
    ],
    [
     "Works before JS loads",
     "No",
     "Yes"
    ]
   ],
   "beats": [
    {
     "say": "These inputs work differently from the Module 4 form."
    },
    {
     "say": "There, React state held every value. Here, the browser holds it, and default value only sets the start.",
     "hl": 0
    },
    {
     "say": "Form actions read the data once, on submit, so each input just needs a name.",
     "hl": [
      1,
      2
     ]
    },
    {
     "say": "And because it's a real form, it works even before JavaScript loads. That's progressive enhancement.",
     "hl": 3,
     "col": 2
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why validate inside the Server Action if the browser also checks?",
   "options": [
    "It's faster",
    "Anyone can call a Server Action directly, skipping browser checks",
    "Browsers can't validate"
   ],
   "answer": 1,
   "good": "That's right. Anyone can send a request straight to a Server Action, so the server must enforce the rules.",
   "bad": "Not quite. Anyone can send a request straight to a Server Action, so the server must enforce the rules.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why validate inside the Server Action if the browser also checks?",
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
     "Server Action form with validation, pending and redirect",
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
     "say": "books new adds books through a Server Action, with server-side validation, a pending state and a redirect.",
     "show": 1
    },
    {
     "say": "Next, in the last module, build and deploy.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 12: Building and Deploying

**Time: about 1.5 hours**

### Concept

`npm run dev` is for development. For users you make a **production build**: `npm run build` compiles, minifies and prerenders what it can, and fails on errors (run it before every deploy); `npm start` serves that build like a host would.

The build output marks each route:
```
○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
ƒ  (Dynamic)            server-rendered on demand
```
**Deploying** puts the build on a server with a public URL:
- **Vercel** (from the makers of Next.js): connect a GitHub repository and every push deploys, with preview URLs for branches.
- Other platforms with Next.js support (such as Netlify or Cloudflare), or any server that can run `npm run build` and `npm start`.
- The Vite app is a **static site**: its `dist` folder of plain files can be hosted almost anywhere, including GitHub Pages.

Check each provider's current plans and limits yourself.

**Environment variables** hold settings and secrets. Locally they go in `.env.local` (already in `.gitignore`); on the host, in project settings. Only names starting with `NEXT_PUBLIC_` reach the browser, so never give a secret that prefix.

**Limitation:** the book list lives in server memory. Hosts may run several copies of your app and restart them at any time, so added books can vanish. For real data, replace the functions in `lib/books.js` with database calls; the rest of the app stays the same.

### Where you'd actually use this

Typical team flow: push a branch, review its preview URL, merge, and main deploys automatically.

### Lab

1. **Build both apps.** Stop the dev servers (Ctrl+C). In `reading-list-next`:
```bash
npm run build
npm start
```
Click around `http://localhost:3000`. In the build output, `/` and `/about` are static (○), `/books` and `/books/[id]` stream their data (◐), and `/api/books` is dynamic (ƒ). In `reading-list` (the Vite app):
```bash
npm run build
npm run preview
```
The `dist` folder holds only HTML, CSS and JavaScript.

2. Delete the closing `</p>` in `app/about/page.js` and run `npm run build`: it fails and names the file and line. Fix it.
3. Create an empty GitHub repository and push `reading-list-next` using the commands GitHub shows (see the Version Control course). If there's no `.git` folder yet, first run `git init`, `git add .` and `git commit -m "Reading List"`.
4. Sign in at [vercel.com](https://vercel.com) with GitHub, add a new project, import the repository, keep the detected Next.js settings and deploy. Test every page at the public URL.
5. Change the About text, commit and push: a new deployment starts automatically.
6. **Your turn.** Put `NEXT_PUBLIC_SITE_NAME=My Reading List` in `.env.local`, show `process.env.NEXT_PUBLIC_SITE_NAME` in the home heading, and restart `npm run dev`. Then add the variable in Vercel's project settings and redeploy.

### Checkpoint
Both apps build cleanly and your Reading List is live, redeploying on every push.

### Quiz

1. What is the difference between `npm run dev` and `npm run build` followed by `npm start`?
2. What do the ○ and ◐ symbols in the build output mean?
3. Why does the Vite React app's `dist` folder work on almost any static host?
4. Which environment variables reach the browser in Next.js, and what does that mean for secrets?
5. Why will added books not reliably persist in the deployed app, and what's the fix?

*Answers: 1) `npm run dev` runs a development server with fast refresh and detailed errors; `npm run build` creates an optimized production build and `npm start` serves it like a real host would. 2) ○ means the route is fully prerendered as static content; ◐ means it is prerendered as a static shell with dynamic content streamed in from the server per request. 3) The build produces only static HTML, CSS and JavaScript files, which need no Node.js server to run. 4) Only variables whose names start with `NEXT_PUBLIC_`; secrets must never use that prefix and should only be read in server code. 5) The list lives in server memory, and hosted apps can run on several servers and restart at any time; the fix is storing the data in a real database.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "rocket",
   "kicker": "Module 12 · Building and deploying",
   "title": "Go live",
   "beats": [
    {
     "say": "Welcome to the last module."
    },
    {
     "say": "N P M run dev is for development. For users, you make a production build."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Read the build",
   "title": "npm run build marks every route",
   "columns": [
    "Route",
    "Mark",
    "Meaning"
   ],
   "rows": [
    [
     "/",
     "○",
     "Static: prerendered"
    ],
    [
     "/about",
     "○",
     "Static: prerendered"
    ],
    [
     "/books",
     "◐",
     "Static shell, data streamed per request"
    ],
    [
     "/books/[id]",
     "◐",
     "Static shell, data streamed per request"
    ],
    [
     "/api/books",
     "ƒ",
     "Dynamic: run on demand"
    ],
    [
     "dist/ (the Vite app)",
     "-",
     "Plain HTML, CSS and JS files"
    ]
   ],
   "beats": [
    {
     "say": "N P M run build compiles, minifies and prerenders what it can. Then N P M start serves it, like a host would.",
     "sql": "npm run build && npm start"
    },
    {
     "say": "Home and about need no request data, so they're fully static. The mark is an empty circle.",
     "hl": [
      0,
      1
     ],
     "col": 1
    },
    {
     "say": "Books and a single book are a half circle: a static shell, with data streamed in for each request.",
     "hl": [
      2,
      3
     ],
     "col": 1
    },
    {
     "say": "The A P I route is an f: dynamic, run on demand.",
     "hl": 4,
     "col": 1
    },
    {
     "say": "And the Vite app builds to a dist folder of plain files, which almost any static host can serve.",
     "hl": 5,
     "dim": true
    },
    {
     "say": "If anything is broken, the build fails and names the file and line. Run it before every deploy.",
     "col": 0
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab",
   "title": "Push a branch, preview it, merge, go live",
   "nodes": [
    {
     "id": "you",
     "label": "Your laptop",
     "x": 10,
     "y": 50,
     "sub": "git push",
     "art": "laptop"
    },
    {
     "id": "gh",
     "label": "GitHub",
     "x": 37,
     "y": 50,
     "sub": "repository",
     "art": "git"
    },
    {
     "id": "v",
     "label": "Vercel",
     "x": 63,
     "y": 50,
     "sub": "npm run build",
     "art": "cloud"
    },
    {
     "id": "prev",
     "label": "Preview URL",
     "x": 90,
     "y": 18,
     "sub": "for a branch",
     "art": "eye"
    },
    {
     "id": "live",
     "label": "Live site",
     "x": 90,
     "y": 82,
     "sub": "main",
     "art": "globe"
    }
   ],
   "edges": [
    {
     "from": "you",
     "to": "gh"
    },
    {
     "from": "gh",
     "to": "v"
    },
    {
     "from": "v",
     "to": "prev"
    },
    {
     "from": "v",
     "to": "live"
    }
   ],
   "beats": [
    {
     "say": "Here's the usual team flow.",
     "show": 5
    },
    {
     "say": "You push a branch to GitHub.",
     "on": "gh",
     "send": {
      "from": "you",
      "to": "gh",
      "label": "git push"
     }
    },
    {
     "say": "Vercel is connected to the repository, so it builds every push.",
     "on": "v",
     "send": {
      "from": "gh",
      "to": "v",
      "label": "new commit"
     }
    },
    {
     "say": "A branch gets its own preview U R L, for the team to review.",
     "on": "prev",
     "send": {
      "from": "v",
      "to": "prev",
      "label": "preview deploy"
     }
    },
    {
     "say": "Merge into main, and the live site deploys automatically.",
     "on": "live",
     "send": {
      "from": "v",
      "to": "live",
      "label": "production deploy"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Only NEXT_PUBLIC_ reaches the browser",
   "columns": [
    "Variable",
    "Set in",
    "Reaches the browser?"
   ],
   "rows": [
    [
     "NEXT_PUBLIC_SITE_NAME=My Reading List",
     ".env.local · Vercel settings",
     "Yes"
    ],
    [
     "A secret, e.g. an API key",
     ".env.local · Vercel settings",
     "No: server code only"
    ]
   ],
   "beats": [
    {
     "say": "Environment variables hold settings and secrets.",
     "col": 0
    },
    {
     "say": "Locally, they go in dot env dot local, which is already in git ignore. On the host, in the project settings.",
     "col": 1
    },
    {
     "say": "A name starting with next public is copied into the browser code, so a page can show the site name.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "Anything else stays on the server. So never give a secret that prefix.",
     "hl": 1,
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Limitation",
   "title": "Why added books can vanish",
   "nodes": [
    {
     "id": "you",
     "label": "Visitor",
     "x": 10,
     "y": 50,
     "sub": "adds a book",
     "art": "people"
    },
    {
     "id": "a",
     "label": "Server copy A",
     "x": 52,
     "y": 20,
     "sub": "books: 4",
     "art": "server"
    },
    {
     "id": "b",
     "label": "Server copy B",
     "x": 52,
     "y": 80,
     "sub": "books: 3",
     "art": "server"
    },
    {
     "id": "db",
     "label": "Database",
     "x": 90,
     "y": 50,
     "sub": "the real fix",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "you",
     "to": "a"
    },
    {
     "from": "you",
     "to": "b"
    },
    {
     "from": "a",
     "to": "db"
    },
    {
     "from": "b",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "The book list lives in server memory. Hosts may run several copies of your app.",
     "show": 3
    },
    {
     "say": "You add a book. It lands in copy A's memory.",
     "on": "a",
     "send": {
      "from": "you",
      "to": "a",
      "label": "POST Atomic Habits"
     }
    },
    {
     "say": "Your next visit reaches copy B, which never saw it. And any copy can restart, and forget.",
     "on": "b",
     "send": {
      "from": "b",
      "to": "you",
      "label": "3 books"
     }
    },
    {
     "say": "The fix: replace the functions in lib slash books with database calls. Every copy reads the same data.",
     "show": 4,
     "on": "db",
     "send": {
      "from": "a",
      "to": "db",
      "label": "createBook → INSERT"
     }
    },
    {
     "say": "The rest of the app stays the same.",
     "on": [
      "a",
      "b",
      "db"
     ]
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Which environment variables reach the browser in Next.js?",
   "options": [
    "All of them",
    "Only names starting with NEXT_PUBLIC_",
    "None of them"
   ],
   "answer": 1,
   "good": "That's right. Only names starting with next public. Secrets must never use that prefix.",
   "bad": "Not quite. Only names starting with next public. Secrets must never use that prefix.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Which environment variables reach the browser in Next dot js?",
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
     "Both apps build cleanly",
     ""
    ],
    [
     "Your Reading List is live",
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
     "say": "both apps build cleanly,",
     "show": 1
    },
    {
     "say": "and your Reading List is live, redeploying on every push.",
     "show": 2
    },
    {
     "say": "You've finished Frontend Frameworks for Builders. Well done.",
     "show": 2
    }
   ]
  }
 ]
}
```
