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
