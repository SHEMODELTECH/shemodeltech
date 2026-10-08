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
     "say": "Across this course you'll build one app, a Reading List: first in React, then as a multi-page Next.js app with a server."
    }
   ]
  },
  {
   "kind": "quote",
   "art": "mess",
   "kicker": "The problem",
   "title": "Every change, by hand",
   "quote": "Whenever data changes, you must update every place that shows it.",
   "beats": [
    {
     "say": "As an app grows, finding and changing page elements by hand gets repetitive and error prone.",
     "show": 0
    },
    {
     "say": "Whenever data changes, you must update every place that shows it.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "blocks",
   "kicker": "Concept",
   "title": "Imperative versus declarative",
   "items": [
    [
     "Imperative",
     "\"Find it, change its text\""
    ],
    [
     "Declarative",
     "\"The counter shows {count}\""
    ],
    [
     "Components",
     "Reusable pieces of UI"
    ]
   ],
   "beats": [
    {
     "say": "A framework changes how you think.",
     "show": 0
    },
    {
     "say": "Imperative code says how: find the counter element, change its text to five.",
     "show": 1
    },
    {
     "say": "Declarative code says what: the counter shows count. Change count, and the page follows.",
     "show": 2
    },
    {
     "say": "And you build the page from components, reusable pieces of UI.",
     "show": 3
    }
   ]
  },
  {
   "kind": "list",
   "art": "layers",
   "kicker": "The landscape",
   "title": "Frameworks you'll hear about",
   "items": [
    [
     "React",
     "UI from components"
    ],
    [
     "Next.js",
     "React + routing + server"
    ],
    [
     "Vue",
     "HTML-like templates"
    ],
    [
     "Angular",
     "Complete, opinionated platform"
    ],
    [
     "Svelte",
     "Compiles to small JS"
    ]
   ],
   "beats": [
    {
     "say": "React is a library for building UI from components.",
     "show": 1
    },
    {
     "say": "Next dot js is built on React, adding routing, server rendering and data fetching.",
     "show": 2
    },
    {
     "say": "Vue uses HTML-like templates, with a gentle learning curve.",
     "show": 3
    },
    {
     "say": "Angular is a complete, opinionated platform, popular with large enterprise teams.",
     "show": 4
    },
    {
     "say": "And Svelte is a compiler that produces small, plain JavaScript.",
     "show": 5
    },
    {
     "say": "Once you know components, props, state and routing, any of them is mostly new syntax.",
     "show": 5
    }
   ]
  },
  {
   "kind": "flow",
   "art": "pencil",
   "kicker": "Lab",
   "title": "Sketch the Reading List",
   "steps": [
    "Spot 5 reusable pieces",
    "Note their data",
    "Sketch the Reading List"
   ],
   "beats": [
    {
     "say": "Your lab is on paper.",
     "show": 0
    },
    {
     "say": "Pick a site you use daily, and spot five reusable pieces, like a message row or a product card.",
     "show": 1
    },
    {
     "say": "For each, note the data it needs, and what changes as you use it.",
     "show": 2
    },
    {
     "say": "Then sketch the Reading List: a header, an add-a-book form, a filter bar, a list and a book card. Each box becomes a component.",
     "show": 3
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
     "say": "What does \"declarative\" mean?",
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
   "art": "code",
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
   "kind": "list",
   "art": "code",
   "kicker": "Concept",
   "title": "JSX rules",
   "items": [
    [
     "One parent",
     "Or a fragment <>…</>"
    ],
    [
     "className",
     "Not class"
    ],
    [
     "Close every tag",
     "<img />, <input />"
    ],
    [
     "{ }",
     "JavaScript inside JSX"
    ]
   ],
   "beats": [
    {
     "say": "J S X has a few rules.",
     "show": 0
    },
    {
     "say": "Return one parent element, or wrap siblings in an empty fragment.",
     "show": 1
    },
    {
     "say": "Use class name instead of class, and html for instead of for.",
     "show": 2
    },
    {
     "say": "Close every tag, including image and input.",
     "show": 3
    },
    {
     "say": "And put any JavaScript expression inside curly braces.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "blocks",
   "kicker": "Lab · Step 3",
   "title": "A BookCard component",
   "file": "src/BookCard.jsx",
   "code": "function BookCard({ title, author, genre }) {\n  return (\n    <article className=\"book-card\">\n      <h2>{title}</h2>\n      <p>by {author} · {genre}</p>\n    </article>\n  );\n}\n\nexport default BookCard;",
   "beats": [
    {
     "say": "Create the project with Vite, then your first component: Book Card.",
     "show": 0
    },
    {
     "say": "Props are a component's inputs. Book Card receives title, author and genre, destructured from one object.",
     "show": 1
    },
    {
     "say": "It returns an article showing them in curly braces.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "layers",
   "kicker": "Lab · Step 4",
   "title": "Reuse it with different props",
   "file": "src/App.jsx",
   "code": "function App() {\n  return (\n    <main>\n      <Header owner=\"Ope\" />\n      <BookCard title=\"Kindred\" author=\"Octavia E. Butler\" genre=\"Science fiction\" />\n      <BookCard title=\"Hidden Figures\" author=\"Margot Lee Shetterly\" genre=\"History\" />\n      <BookCard title=\"Things Fall Apart\" author=\"Chinua Achebe\" genre=\"Fiction\" />\n    </main>\n  );\n}",
   "beats": [
    {
     "say": "Now use it in App.",
     "show": 0
    },
    {
     "say": "Three cards, from one component, each with different props.",
     "show": 1
    },
    {
     "say": "App is the parent; Header and Book Card are children. Props flow down, and a component never changes its own props.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quote",
   "art": "pencil",
   "kicker": "Your turn",
   "title": "Make it yours",
   "quote": "Your name in the header. A fourth book on the list.",
   "beats": [
    {
     "say": "Your turn.",
     "show": 0
    },
    {
     "say": "Change the owner to your own name, and add a fourth book you want to read.",
     "show": 1
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
   "kind": "code",
   "art": "code",
   "kicker": "Concept",
   "title": "useState",
   "file": "BookCard.jsx",
   "code": "const [isRead, setIsRead] = useState(false);",
   "beats": [
    {
     "say": "You create state with the use state hook.",
     "show": 0
    },
    {
     "say": "It returns the current value, and a setter.",
     "show": 1
    },
    {
     "say": "Calling the setter stores the new value, and re-renders the component, so the page updates.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "warning",
   "kicker": "Concept",
   "title": "The rules",
   "items": [
    [
     "Always use the setter",
     "Never assign directly"
    ],
    [
     "Depends on old value?",
     "setX((old) => old + 10)"
    ],
    [
     "Each copy",
     "Has its own state"
    ],
    [
     "Hooks at the top level",
     "Not in ifs or loops"
    ]
   ],
   "beats": [
    {
     "say": "A few rules.",
     "show": 0
    },
    {
     "say": "Never assign state directly. Always call the setter.",
     "show": 1
    },
    {
     "say": "When the new value depends on the old one, pass a function, so React supplies the latest value.",
     "show": 2
    },
    {
     "say": "Each copy of a component has its own state.",
     "show": 3
    },
    {
     "say": "And call hooks only at the top level, never inside ifs or loops.",
     "show": 4
    }
   ]
  },
  {
   "kind": "list",
   "art": "cursor",
   "kicker": "Events",
   "title": "Pass a function, don't call it",
   "items": [
    [
     "onClick={() => setIsRead(true)}",
     "Runs on click ✓"
    ],
    [
     "onClick={setIsRead(true)}",
     "Runs while rendering ✗"
    ]
   ],
   "beats": [
    {
     "say": "Events use camel case props, like on click.",
     "show": 0
    },
    {
     "say": "Write an arrow function, so React calls it when the button is clicked.",
     "show": 1
    },
    {
     "say": "If you write set is read of true directly, it runs immediately, during rendering.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "cursor",
   "kicker": "Lab · Step 1",
   "title": "Pages and read status",
   "file": "src/BookCard.jsx",
   "code": "const [isRead, setIsRead] = useState(false);\nconst [pagesRead, setPagesRead] = useState(0);\n\n<button onClick={() => setPagesRead((pages) => pages + 10)}>\n  +10 pages\n</button>\n<button onClick={() => setIsRead(!isRead)}>\n  {isRead ? \"Mark as unread\" : \"Mark as read\"}\n</button>",
   "beats": [
    {
     "say": "Give Book Card two pieces of state: is read, and pages read.",
     "show": 0
    },
    {
     "say": "Plus ten pages uses the function form of the setter.",
     "show": 1
    },
    {
     "say": "The read button flips is read, and a ternary switches its label.",
     "show": 1
    },
    {
     "say": "Click one card, and only that card changes. Each has its own state.",
     "show": 1
    }
   ]
  },
  {
   "kind": "big",
   "art": "warning",
   "kicker": "Lab · Step 4",
   "title": "See a common bug",
   "big": "+10, not +20",
   "sub": "both calls read the same old value",
   "beats": [
    {
     "say": "Now see a common bug.",
     "show": 0
    },
    {
     "say": "Call set pages read with pages read plus ten, twice in one click. It only adds ten, because both calls read the same old value.",
     "show": 1
    },
    {
     "say": "With the function form, twice adds twenty.",
     "show": 2
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
     "say": "You render three BookCards. How many pagesRead values exist?",
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
   "art": "table",
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
   "kind": "code",
   "art": "key",
   "kicker": "Concept",
   "title": "Every item needs a key",
   "file": "BookList.jsx",
   "code": "{books.map((book) => (\n  <li key={book.id}>{book.title}</li>\n))}",
   "beats": [
    {
     "say": "Each item needs a key.",
     "show": 0
    },
    {
     "say": "Unique among its siblings, and stable for that item, like a database I D.",
     "show": 1
    },
    {
     "say": "React uses keys to match items between renders. Array indexes are risky for changing lists, because state can attach to the wrong item.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "fork",
   "kicker": "Concept",
   "title": "Conditional rendering",
   "items": [
    [
     "if + early return",
     "Empty-list message"
    ],
    [
     "cond && <A />",
     "Only when true"
    ],
    [
     "cond ? <A /> : <B />",
     "Choose between two"
    ],
    [
     "{count && …}",
     "Shows a stray 0 ✗"
    ]
   ],
   "beats": [
    {
     "say": "Three ways to show things conditionally.",
     "show": 0
    },
    {
     "say": "An if, with an early return, for example an empty-list message.",
     "show": 1
    },
    {
     "say": "Condition and-and element, to show something only when true.",
     "show": 2
    },
    {
     "say": "And a ternary, to choose between two things.",
     "show": 3
    },
    {
     "say": "Watch out: count and-and paragraph shows a literal zero when count is zero. Use count greater than zero.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "table",
   "kicker": "Lab · Steps 1 and 2",
   "title": "A BookList from an array",
   "file": "src/BookList.jsx",
   "code": "function BookList({ books }) {\n  if (books.length === 0) {\n    return <p>Your list is empty. Add a book to get started.</p>;\n  }\n  return (\n    <ul className=\"book-list\">\n      {books.map((book) => (\n        <li key={book.id}><BookCard {...} /></li>\n      ))}\n    </ul>\n  );\n}",
   "beats": [
    {
     "say": "Move the books into an array in books dot j s, then create Book List.",
     "show": 0
    },
    {
     "say": "If the list is empty, return a friendly message.",
     "show": 1
    },
    {
     "say": "Otherwise, map each book to a list item, keyed by its I D.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "test",
   "kicker": "Lab · Steps 3 to 6",
   "title": "Try every case",
   "steps": [
    "Note & badge only when present",
    "Empty array → message",
    "No key → console warning"
   ],
   "beats": [
    {
     "say": "Book Card now shows a note only when one exists, and a Finished badge when read.",
     "show": 1
    },
    {
     "say": "Pass an empty array, and you see the empty message.",
     "show": 2
    },
    {
     "say": "Delete the key, and React warns in the console. Put it back.",
     "show": 3
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
     "say": "Why can {count && <p>…</p>} show a stray \"0\"?",
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
   "art": "pencil",
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
   "kind": "list",
   "art": "doc",
   "kicker": "Concept",
   "title": "What a React form needs",
   "items": [
    [
     "State per field",
     "value + onChange"
    ],
    [
     "onSubmit on the form",
     "Enter works too"
    ],
    [
     "preventDefault()",
     "No page reload"
    ],
    [
     "Validate after .trim()",
     "Clear error message"
    ],
    [
     "<label htmlFor>",
     "Matches the input id"
    ]
   ],
   "beats": [
    {
     "say": "A React form usually has five things.",
     "show": 0
    },
    {
     "say": "State for each field.",
     "show": 1
    },
    {
     "say": "An on submit handler on the form, so pressing Enter works too.",
     "show": 2
    },
    {
     "say": "Event dot prevent default, because browsers reload the page on submit.",
     "show": 3
    },
    {
     "say": "Validation after trimming, with a clear error.",
     "show": 4
    },
    {
     "say": "And a label for each input, linked by matching I Ds.",
     "show": 5
    }
   ]
  },
  {
   "kind": "code",
   "art": "shield",
   "kicker": "Lab · Step 1",
   "title": "The submit handler",
   "file": "src/AddBookForm.jsx",
   "code": "function handleSubmit(event) {\n  event.preventDefault();\n  const cleanTitle = title.trim();\n  const cleanAuthor = author.trim();\n  if (cleanTitle === \"\" || cleanAuthor === \"\") {\n    setError(\"Please enter both a title and an author.\");\n    return;\n  }\n  onAdd({ id: crypto.randomUUID(), title: cleanTitle, author: cleanAuthor, genre });\n  setTitle(\"\"); setAuthor(\"\"); setError(\"\");\n}",
   "beats": [
    {
     "say": "Here's the heart of Add Book Form.",
     "show": 0
    },
    {
     "say": "Stop the reload. Trim the values. If either is empty, set an error and stop.",
     "show": 1
    },
    {
     "say": "Otherwise, call on add with a new book, using crypto random U U I D for its I D, then clear the form.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "path",
   "kicker": "Concept",
   "title": "Data down, events up",
   "steps": [
    "App owns the books",
    "Passes onAdd down",
    "Form calls onAdd(book)",
    "List re-renders"
   ],
   "beats": [
    {
     "say": "The list lives in App, so App holds it in state.",
     "show": 0
    },
    {
     "say": "App passes its add book function down, as the on add prop.",
     "show": 1
    },
    {
     "say": "The form calls on add with the new book.",
     "show": 2
    },
    {
     "say": "App updates its state, and the list re-renders.",
     "show": 3
    }
   ]
  },
  {
   "kind": "list",
   "art": "warning",
   "kicker": "Concept",
   "title": "A new array, not push",
   "items": [
    [
     "[...currentBooks, newBook]",
     "New array ✓"
    ],
    [
     "currentBooks.push(newBook)",
     "Same array ✗"
    ]
   ],
   "beats": [
    {
     "say": "One more rule.",
     "show": 0
    },
    {
     "say": "Update arrays by making a new array, with the spread operator.",
     "show": 1
    },
    {
     "say": "Don't use push. It changes the old array in place, and React only notices new values.",
     "show": 2
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
     "say": "Why does the submit handler call event.preventDefault()?",
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
   "kind": "list",
   "art": "loop",
   "kicker": "Concept",
   "title": "The dependency array",
   "items": [
    [
     "[]",
     "Once, after first render"
    ],
    [
     "[books.length]",
     "When that value changes"
    ],
    [
     "(none)",
     "After every render"
    ]
   ],
   "beats": [
    {
     "say": "The dependency array controls when the effect runs.",
     "show": 0
    },
    {
     "say": "An empty array: once, after the first render.",
     "show": 1
    },
    {
     "say": "With values: after the first render, and whenever those values change.",
     "show": 2
    },
    {
     "say": "No array at all: after every render. Rarely what you want.",
     "show": 3
    }
   ]
  },
  {
   "kind": "list",
   "art": "stopwatch",
   "kicker": "Concept",
   "title": "Three states for every fetch",
   "items": [
    [
     "loading",
     "Loading your books..."
    ],
    [
     "error",
     "Could not load your books"
    ],
    [
     "ready",
     "Show the list"
    ]
   ],
   "beats": [
    {
     "say": "Fetching takes time, and can fail, so the UI needs three states.",
     "show": 0
    },
    {
     "say": "Loading.",
     "show": 1
    },
    {
     "say": "Error.",
     "show": 2
    },
    {
     "say": "And ready.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "api",
   "kicker": "Lab · Step 2",
   "title": "Load the books, with cleanup",
   "file": "src/App.jsx",
   "code": "useEffect(() => {\n  const controller = new AbortController();\n  async function loadBooks() {\n    try {\n      const response = await fetch(\"/starter-books.json\", { signal: controller.signal });\n      if (!response.ok) throw new Error(`Status ${response.status}`);\n      setBooks(await response.json());\n      setStatus(\"ready\");\n    } catch (error) {\n      if (error.name === \"AbortError\") return;\n      setStatus(\"error\");\n    }\n  }\n  loadBooks();\n  return () => controller.abort();\n}, []);",
   "beats": [
    {
     "say": "Here's the loading effect.",
     "show": 0
    },
    {
     "say": "Fetch the J S O N file. If the response isn't ok, throw. Otherwise, store the books and set status to ready.",
     "show": 1
    },
    {
     "say": "The cleanup function aborts the request if App disappears before it finishes.",
     "show": 1
    },
    {
     "say": "In development, Strict Mode runs effects twice, so a cancelled first request means your cleanup works.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "test",
   "kicker": "Lab · Steps 3 to 5",
   "title": "Test each state",
   "steps": [
    "Slow network → Loading",
    "Missing file → Error",
    "Add a book → tab title updates"
   ],
   "beats": [
    {
     "say": "Throttle the network, and you see Loading first.",
     "show": 1
    },
    {
     "say": "Point fetch at a missing file, and you get the error message, not a crash.",
     "show": 2
    },
    {
     "say": "Add a book, and a second effect updates the tab title.",
     "show": 3
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
     "say": "What does an empty dependency array [] mean?",
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
   "kind": "flow",
   "art": "tree",
   "kicker": "Concept",
   "title": "Lift it to the common parent",
   "steps": [
    "Find the common parent",
    "App owns read",
    "Pass value + function down",
    "Card calls onToggleRead(id)"
   ],
   "beats": [
    {
     "say": "Move the state to the closest common parent of everything that needs it.",
     "show": 0
    },
    {
     "say": "App now owns each book's read field.",
     "show": 1
    },
    {
     "say": "It passes the value down, with a function to change it.",
     "show": 2
    },
    {
     "say": "The card calls on toggle read, with its I D.",
     "show": 3
    }
   ]
  },
  {
   "kind": "list",
   "art": "bulb",
   "kicker": "Guidelines",
   "title": "Two guidelines",
   "items": [
    [
     "Keep state low",
     "pagesRead stays in the card"
    ],
    [
     "Derive, don't store",
     "readCount, visibleBooks"
    ]
   ],
   "beats": [
    {
     "say": "Keep state as low as possible. Pages read is used by one card, so it stays there.",
     "show": 1
    },
    {
     "say": "And don't store what you can calculate. Counts and filtered lists are derived values. Compute them while rendering, so they can't get out of sync.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "calc",
   "kicker": "Lab · Step 1",
   "title": "Update immutably, derive the rest",
   "file": "src/App.jsx",
   "code": "function toggleRead(id) {\n  setBooks((current) =>\n    current.map((b) => (b.id === id ? { ...b, read: !b.read } : b))\n  );\n}\nfunction removeBook(id) {\n  setBooks((current) => current.filter((b) => b.id !== id));\n}\n\n// Derived values\nconst readCount = books.filter((b) => b.read).length;\nconst visibleBooks = books.filter((b) =>\n  filter === \"read\" ? b.read : filter === \"unread\" ? !b.read : true\n);",
   "beats": [
    {
     "say": "Toggle read builds a new array with map, replacing only the matching book with an updated copy.",
     "show": 0
    },
    {
     "say": "Remove book builds one with filter.",
     "show": 1
    },
    {
     "say": "Read count and visible books are calculated on every render, not stored.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "layers",
   "kicker": "Step 2",
   "title": "From prop drilling to context",
   "items": [
    [
     "Prop drilling",
     "Passing props through just to reach a child"
    ],
    [
     "createContext",
     "BooksContext"
    ],
    [
     "useContext",
     "Any descendant reads it"
    ]
   ],
   "beats": [
    {
     "say": "Book List only passes the actions along. That's prop drilling.",
     "show": 1
    },
    {
     "say": "Context lets a parent provide a value that any descendant reads, with use context.",
     "show": 2
    },
    {
     "say": "App wraps everything in Books Context, and Book Card reads toggle read and remove book directly. Use it sparingly; props are easier to follow.",
     "show": 3
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
     "say": "Why are readCount and visibleBooks calculated, not stored in state?",
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
   "art": "people",
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
   "kind": "list",
   "art": "cursor",
   "kicker": "Concept",
   "title": "Buttons, not divs",
   "items": [
    [
     "<button>",
     "Tab, Enter, Space, announced ✓"
    ],
    [
     "<div onClick>",
     "Unreachable by keyboard ✗"
    ]
   ],
   "beats": [
    {
     "say": "A real button can be reached with Tab, works with Enter and Space, and is announced as a button.",
     "show": 1
    },
    {
     "say": "A div with on click does none of those.",
     "show": 2
    }
   ]
  },
  {
   "kind": "list",
   "art": "people",
   "kicker": "Concept",
   "title": "The essentials",
   "items": [
    [
     "Labels",
     "Not placeholders"
    ],
    [
     "Clear names",
     "aria-label=\"Remove Kindred\""
    ],
    [
     "aria-pressed",
     "Not disabled"
    ],
    [
     "role=\"alert\" / \"status\"",
     "Announce changes"
    ],
    [
     "alt text",
     "alt=\"\" if decorative"
    ]
   ],
   "beats": [
    {
     "say": "Every input needs a real label. A placeholder vanishes as you type.",
     "show": 1
    },
    {
     "say": "Give repeated buttons clear names, like aria label: Remove Kindred.",
     "show": 2
    },
    {
     "say": "Mark the active toggle with aria pressed, not disabled, because disabled buttons are skipped by the keyboard.",
     "show": 3
    },
    {
     "say": "Announce errors with role alert, and updates like Loading with role status.",
     "show": 4
    },
    {
     "say": "And alt text: describe informative images, and give decorative ones an empty alt.",
     "show": 5
    }
   ]
  },
  {
   "kind": "code",
   "art": "shield",
   "kicker": "Lab · Step 5",
   "title": "Connect errors to inputs",
   "file": "src/AddBookForm.jsx",
   "code": "<input\n  id=\"title\"\n  aria-invalid={error !== \"\"}\n  aria-describedby={error ? \"form-error\" : undefined}\n/>\n\n{error && (\n  <p id=\"form-error\" className=\"error\" role=\"alert\">{error}</p>\n)}",
   "beats": [
    {
     "say": "In the form, mark the inputs invalid when there's an error, and point them at the error text.",
     "show": 0
    },
    {
     "say": "Role alert makes the screen reader announce the error the moment it appears.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "test",
   "kicker": "Lab · Steps 7 and 8",
   "title": "Test it for real",
   "steps": [
    "Keyboard-only test",
    "Lighthouse audit",
    "Fix what it finds"
   ],
   "beats": [
    {
     "say": "Put the mouse away. Using only Tab, Shift Tab, Enter and Space, add a book, mark it read, filter, and remove it. Focus should always be visible.",
     "show": 1
    },
    {
     "say": "Then run a Lighthouse accessibility audit, and fix what it reports.",
     "show": 2
    },
    {
     "say": "Automated tools catch only some problems, so the keyboard test still matters.",
     "show": 2
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
     "say": "When should an image have alt=\"\"?",
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
   "kind": "code",
   "art": "tree",
   "kicker": "Concept",
   "title": "Folders become URLs",
   "file": "app/",
   "code": "app/\n  layout.js            -> wraps every page\n  page.js              -> /\n  about/page.js        -> /about\n  books/page.js        -> /books\n  books/[id]/page.js   -> /books/1, /books/2, ...\n  books/[id]/loading.js -> shown while it loads",
   "beats": [
    {
     "say": "In the App Router, folders inside app define the URLs.",
     "show": 0
    },
    {
     "say": "Only a page dot js file makes a folder visitable.",
     "show": 1
    },
    {
     "say": "A layout wraps every page below it, and stays on screen as you navigate.",
     "show": 1
    },
    {
     "say": "A folder in square brackets is a dynamic segment: one file handles every I D.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "browser",
   "kicker": "Lab · Step 6",
   "title": "The dynamic route",
   "file": "app/books/[id]/page.js",
   "code": "export default async function BookPage({ params }) {\n  const { id } = await params;\n  const book = books.find((b) => b.id === id);\n  if (!book) notFound();\n  return (\n    <>\n      <h1>{book.title}</h1>\n      <p>Status: {book.read ? \"Finished\" : \"To read\"}</p>\n      <Link href=\"/books\">Back to all books</Link>\n    </>\n  );\n}",
   "beats": [
    {
     "say": "Here's the book page.",
     "show": 0
    },
    {
     "say": "Params is a promise, so the page is async, and awaits it.",
     "show": 1
    },
    {
     "say": "Find the book. If there isn't one, not found shows the four oh four page.",
     "show": 1
    },
    {
     "say": "Because this page needs the request, it sits behind a loading dot js file.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "path",
   "kicker": "Concept",
   "title": "Link and layouts",
   "items": [
    [
     "<Link>",
     "No full reload, prefetches"
    ],
    [
     "layout.js",
     "Stays on screen"
    ],
    [
     "notFound()",
     "/books/999 → 404"
    ]
   ],
   "beats": [
    {
     "say": "Link navigates without a full reload, and prefetches pages, so navigation feels instant.",
     "show": 1
    },
    {
     "say": "Click around, and the header never flickers, because the layout stays.",
     "show": 2
    },
    {
     "say": "Visit books slash nine nine nine, and you get the four oh four page.",
     "show": 3
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
     "say": "What does a folder named [id] create?",
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
   "art": "cloud",
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
   "kind": "list",
   "art": "cloud",
   "kicker": "Concept",
   "title": "Server Components",
   "items": [
    [
     "Can",
     "async, databases, secrets"
    ],
    [
     "Can't",
     "useState, onClick, localStorage"
    ]
   ],
   "beats": [
    {
     "say": "Server Components can be async, read databases and secrets safely, and keep big libraries out of the download.",
     "show": 1
    },
    {
     "say": "But they can't use state, effects, event handlers or browser A P Is.",
     "show": 2
    }
   ]
  },
  {
   "kind": "list",
   "art": "cursor",
   "kicker": "Concept",
   "title": "Client Components",
   "items": [
    [
     "\"use client\";",
     "First line of the file"
    ],
    [
     "Hydration",
     "JS takes over in the browser"
    ],
    [
     "Keep them small",
     "At the leaves of the page"
    ]
   ],
   "beats": [
    {
     "say": "A Client Component has use client at the top of its file.",
     "show": 1
    },
    {
     "say": "It's rendered to HTML on the server, then its JavaScript runs in the browser, so it can hold state and respond to clicks. That's hydration.",
     "show": 2
    },
    {
     "say": "Keep pages on the server, and make small interactive pieces client components.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "cursor",
   "kicker": "Lab · Step 3",
   "title": "A small Client Component",
   "file": "app/ui/PagesCounter.js",
   "code": "\"use client\";\n\nimport { useState } from \"react\";\n\nexport default function PagesCounter({ title }) {\n  const [pagesRead, setPagesRead] = useState(0);\n  return (\n    <button onClick={() => setPagesRead((p) => p + 10)}>\n      {title}: {pagesRead} pages · +10\n    </button>\n  );\n}",
   "beats": [
    {
     "say": "Bring back your pages counter as a client component.",
     "show": 0
    },
    {
     "say": "Use client at the top, then the same use state code as before.",
     "show": 1
    },
    {
     "say": "Drop it into the server-rendered book page. Only the counter's code goes to the browser.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "terminal",
   "kicker": "Lab · Steps 1, 2 and 5",
   "title": "Prove where code runs",
   "steps": [
    "console.log → terminal",
    "useState on server → error",
    "Only client code in the browser"
   ],
   "beats": [
    {
     "say": "Log from the books page, and it appears in your terminal, not the browser.",
     "show": 1
    },
    {
     "say": "Add use state to a server page, and Next dot js errors.",
     "show": 2
    },
    {
     "say": "Search the browser's loaded files: the counter's there, but the book page and its data aren't.",
     "show": 3
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
     "say": "Why must props from a Server to a Client Component be serializable?",
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
   "kind": "code",
   "art": "database",
   "kicker": "Lab · Step 2",
   "title": "Stream the list with Suspense",
   "file": "app/books/page.js",
   "code": "async function BookList() {\n  const books = await getBooks(); // runs on the server\n  return <ul>{books.map((b) => <li key={b.id}>{b.title}</li>)}</ul>;\n}\n\nexport default function BooksPage() {\n  return (\n    <>\n      <h1>Books</h1>\n      <Suspense fallback={<p>Loading books...</p>}>\n        <BookList />\n      </Suspense>\n    </>\n  );\n}",
   "beats": [
    {
     "say": "Book List is now an async server component that awaits get books.",
     "show": 0
    },
    {
     "say": "Wrap it in Suspense, with a fallback. The rest of the page is sent at once, and the list streams in.",
     "show": 1
    },
    {
     "say": "No use effect, and no loading variables. It's the server version of your React loading state.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quote",
   "art": "stopwatch",
   "kicker": "Concept",
   "title": "Mark request-time data",
   "quote": "await connection() — run this per request, not at build time.",
   "beats": [
    {
     "say": "One detail.",
     "show": 0
    },
    {
     "say": "Our fake database is instant, so Next dot js would bake the list into the page at build time.",
     "show": 1
    },
    {
     "say": "Await connection says: wait for a real request, as a real database call would.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "api",
   "kicker": "Lab · Step 4",
   "title": "A Route Handler",
   "file": "app/api/books/route.js",
   "code": "export async function GET() {\n  return Response.json(await getBooks());\n}\n\nexport async function POST(request) {\n  const body = await request.json();\n  const error = validateBook(body);\n  if (error) return Response.json({ error }, { status: 400 });\n  const book = await createBook(body);\n  return Response.json(book, { status: 201 });\n}",
   "beats": [
    {
     "say": "A Route Handler is an A P I endpoint that returns data, not a page.",
     "show": 0
    },
    {
     "say": "Export functions named after H T T P methods. Get returns the whole list as J S O N.",
     "show": 1
    },
    {
     "say": "Post reads the body, validates it, and returns four hundred for bad input, or two oh one with the new book.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "api",
   "kicker": "When",
   "title": "When you need a Route Handler",
   "items": [
    [
     "Your pages",
     "Fetch in the Server Component"
    ],
    [
     "Others",
     "Mobile app, service, webhook → Route Handler"
    ]
   ],
   "beats": [
    {
     "say": "Your own pages can fetch directly on the server.",
     "show": 1
    },
    {
     "say": "You need a Route Handler when something else needs the data: a mobile app, another service, or a webhook.",
     "show": 2
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
     "say": "What does <Suspense fallback={…}> do around BookList?",
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
   "art": "pencil",
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
   "kind": "code",
   "art": "shield",
   "kicker": "Lab · Step 1",
   "title": "The Server Action",
   "file": "app/actions.js",
   "code": "\"use server\";\n\nexport async function addBookAction(previousState, formData) {\n  const title = String(formData.get(\"title\") ?? \"\").trim();\n  const author = String(formData.get(\"author\") ?? \"\").trim();\n  const error = validateBook({ title, author });\n  if (error) return { error, title, author };\n\n  await createBook({ title, author });\n  revalidatePath(\"/books\");\n  redirect(\"/books\");\n}",
   "beats": [
    {
     "say": "Here's the action.",
     "show": 0
    },
    {
     "say": "It reads each field from form data, so every input needs a name.",
     "show": 1
    },
    {
     "say": "Always validate on the server. Anyone can call an action directly. If it fails, return the error and the typed values.",
     "show": 1
    },
    {
     "say": "Otherwise, create the book, revalidate the books page, and redirect there.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "cursor",
   "kicker": "Lab · Step 2",
   "title": "useActionState",
   "file": "app/ui/AddBookForm.js",
   "code": "const [state, formAction, isPending] =\n  useActionState(addBookAction, initialState);\n\n<form action={formAction}>\n  <input name=\"title\" defaultValue={state.title} />\n  {state.error && <p role=\"alert\">{state.error}</p>}\n  <button disabled={isPending}>\n    {isPending ? \"Adding...\" : \"Add book\"}\n  </button>\n</form>",
   "beats": [
    {
     "say": "The form is a client component.",
     "show": 0
    },
    {
     "say": "Use action state returns three things: the state, a form action, and is pending.",
     "show": 1
    },
    {
     "say": "Whatever the action returns becomes the new state, so errors and typed values come back.",
     "show": 1
    },
    {
     "say": "The button shows Adding, and is disabled while pending.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "bulb",
   "kicker": "Concept",
   "title": "Worth knowing",
   "items": [
    [
     "Uncontrolled inputs",
     "defaultValue; read on submit"
    ],
    [
     "Progressive enhancement",
     "Works before JS loads"
    ]
   ],
   "beats": [
    {
     "say": "These inputs are uncontrolled. The browser holds the value, and the action reads it once, on submit.",
     "show": 1
    },
    {
     "say": "And a real form works even before JavaScript loads. That's progressive enhancement.",
     "show": 2
    }
   ]
  },
  {
   "kind": "flow",
   "art": "test",
   "kicker": "Lab · Steps 4 and 5",
   "title": "Try it",
   "steps": [
    "Bad input → error, typing kept",
    "Good input → redirect to /books",
    "Slow save → \"Adding...\""
   ],
   "beats": [
    {
     "say": "Submit with only an author: the error shows, and your typing is kept.",
     "show": 1
    },
    {
     "say": "Add a real book: you land on books, with it listed. The A P I sees it too.",
     "show": 2
    },
    {
     "say": "Add a fake delay, and the button shows Adding, and disables itself.",
     "show": 3
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
   "kind": "list",
   "art": "terminal",
   "kicker": "Concept",
   "title": "Build, then start",
   "items": [
    [
     "npm run build",
     "Optimised build; fails on errors"
    ],
    [
     "npm start",
     "Serve it like a host"
    ]
   ],
   "beats": [
    {
     "say": "N P M run build compiles, minifies, and prerenders what it can. It fails on errors, so run it before every deploy.",
     "show": 1
    },
    {
     "say": "N P M start serves that build, like a host would.",
     "show": 2
    }
   ]
  },
  {
   "kind": "list",
   "art": "layers",
   "kicker": "Concept",
   "title": "Reading the build output",
   "items": [
    [
     "○ Static",
     "/ and /about"
    ],
    [
     "◐ Partial Prerender",
     "/books, /books/[id]"
    ],
    [
     "ƒ Dynamic",
     "/api/books"
    ]
   ],
   "beats": [
    {
     "say": "The build output marks each route.",
     "show": 0
    },
    {
     "say": "A circle means static: prerendered.",
     "show": 1
    },
    {
     "say": "A half circle means partial prerender: a static shell, with dynamic content streamed in.",
     "show": 2
    },
    {
     "say": "And f means dynamic: rendered on demand.",
     "show": 3
    }
   ]
  },
  {
   "kind": "flow",
   "art": "cloud",
   "kicker": "Lab · Steps 3 to 5",
   "title": "Deploy to Vercel",
   "steps": [
    "Push to GitHub",
    "Import into Vercel",
    "Test the public URL",
    "Push → auto-deploy"
   ],
   "beats": [
    {
     "say": "Push the app to a GitHub repository.",
     "show": 1
    },
    {
     "say": "Sign in to Vercel with GitHub, import the repository, keep the detected settings, and deploy.",
     "show": 2
    },
    {
     "say": "Test every page at the public address.",
     "show": 3
    },
    {
     "say": "Change the About text and push. A new deployment starts automatically.",
     "show": 4
    }
   ]
  },
  {
   "kind": "list",
   "art": "key",
   "kicker": "Concept",
   "title": "Environment variables",
   "items": [
    [
     "NEXT_PUBLIC_…",
     "Reaches the browser"
    ],
    [
     "Everything else",
     "Server only: secrets live here"
    ]
   ],
   "beats": [
    {
     "say": "Settings and secrets go in environment variables: dot env dot local on your machine, and project settings on the host.",
     "show": 0
    },
    {
     "say": "Only names starting with next public reach the browser.",
     "show": 1
    },
    {
     "say": "So never give a secret that prefix.",
     "show": 2
    }
   ]
  },
  {
   "kind": "quote",
   "art": "warning",
   "kicker": "Limitation",
   "title": "Memory isn't a database",
   "quote": "For real data, replace lib/books.js with database calls.",
   "beats": [
    {
     "say": "One limitation.",
     "show": 0
    },
    {
     "say": "The book list lives in server memory. Hosts run several copies and restart them, so added books can vanish.",
     "show": 1
    },
    {
     "say": "For real data, swap the functions in lib slash books for database calls. The rest of the app stays the same.",
     "show": 1
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
     "say": "Which environment variables reach the browser in Next.js?",
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
