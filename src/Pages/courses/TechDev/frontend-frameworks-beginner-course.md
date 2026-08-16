# Frontend Frameworks for Builders: A Practical Beginner's Course

## Course Overview

**Who this is for:** Beginners who already know HTML, CSS, and JavaScript basics, and want to understand why frameworks exist, how the major ones differ, and how to build something real with each.

**How the course works:** Five modules. Every topic follows the same pattern:
- **Concept** - what it is, in plain language
- **Syntax at a Glance** - the core patterns you'll actually type
- **Where you'd actually use this** - a real product scenario
- **Lab** - hands-on, runnable examples
- **Checkpoint**
- **Quiz** - five questions with answers

**Tools needed:** [Node.js](https://nodejs.org) installed, a terminal, and a text editor (such as [VS Code](https://code.visualstudio.com)).

---

## Module 0: Why Frameworks Exist

### Concept

Plain JavaScript works fine for small pages, but as an app grows, manually finding elements and updating them (`document.querySelector`, `element.textContent = ...`) becomes repetitive and error prone. A **frontend framework** provides a structured way to build **components**, self contained, reusable pieces of UI, and automatically keeps the page in sync with your data, so you describe *what* the page should look like, and the framework figures out *how* to update it.

**React**, **Vue**, and **Angular** are three of the most widely used frameworks (React is technically a library, but is used the same way). **Next.js** is a framework built on top of React that adds routing, server rendering, and other application level features.

### Syntax at a Glance

The shared idea across all of them is **declarative UI**: you describe the current state, and the framework renders it, rather than you writing step by step instructions to change the page.
```
Plain JavaScript (imperative):     Framework (declarative):
"find the button,                  "the button's text is
 change its text"                   {count}, re-render when
                                     count changes"
```

### Where you'd actually use this

Any app with meaningful interactivity or state, a shopping cart, a dashboard, a social feed, gets harder to maintain in plain JavaScript as it grows. Frameworks exist to keep that growth manageable.

### Lab

Look at a website you use daily (a social media feed, an email inbox, a shopping cart). Identify three separate, reusable pieces you can see, a post, a button, a sidebar item. Each of those is likely implemented as a component in whatever framework built that site. This is the mental shift this whole course builds on: thinking in components, not in one giant page.

### Checkpoint
You can explain what a "component" is and why manually updating the DOM becomes harder to maintain as an app grows.

### Quiz
1. What problem do frontend frameworks solve that plain JavaScript alone struggles with as an app grows?
2. What is a component?
3. What is the difference between React and Next.js?
4. What does "declarative" mean, compared to "imperative"?
5. Is React the only widely used frontend framework?

*Answers: 1) Manually finding and updating elements becomes repetitive and error prone as an app's interactivity and data grow; frameworks manage that syncing automatically. 2) A self contained, reusable piece of UI, combining structure, styling, and behavior. 3) React is a library for building UI with components; Next.js is a framework built on top of React that adds routing, server rendering, and other application level features. 4) Declarative means describing the desired result and letting the framework handle the steps; imperative means writing out the steps yourself. 5) No, Vue and Angular are also widely used, each with a different approach to the same underlying problem.*

---

## Module 1: React - Components and State

### Concept

**React** builds UI out of **components**, JavaScript functions that return markup (written in a syntax called **JSX**, which looks like HTML inside JavaScript). A component can hold **state**, data that changes over time, and React automatically re-renders the component whenever that state changes.

### Syntax at a Glance

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

export default Counter;
```
- A component is a function, its name starts with a capital letter, and it returns JSX
- `useState(initialValue)` returns a pair: the current value (`count`) and a function to update it (`setCount`)
- Calling the setter (`setCount(...)`) tells React to re-render, showing the new value
- `{expression}` inside JSX embeds any JavaScript value or expression directly into the markup
- `onClick={...}` (and similarly `onChange`, `onSubmit`) attaches event handlers, written in camelCase, unlike plain HTML's lowercase attributes

### Where you'd actually use this

Any interactive piece of UI that needs to remember something between renders, a counter, a form's input value, a toggled menu, whether an item is in a cart.

### Lab

1. **Create a React project:**
```bash
npx create-vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```
Open the local URL shown in the terminal, typically `http://localhost:5173`.

2. **Replace `src/App.jsx`** with a small component:
```jsx
import { useState } from "react";

function App() {
  const [name, setName] = useState("");

  return (
    <div>
      <h1>Say Hello</h1>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Enter your name"
      />
      {name && <p>Hello, {name}!</p>}
    </div>
  );
}

export default App;
```
Save, then type into the input in the browser. The greeting appears and updates on every keystroke, without any manual DOM code.

3. **Split it into two components,** the core React pattern of breaking UI into pieces:
```jsx
function Greeting({ name }) {
  if (!name) return null;
  return <p>Hello, {name}!</p>;
}

function App() {
  const [name, setName] = useState("");

  return (
    <div>
      <h1>Say Hello</h1>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Enter your name"
      />
      <Greeting name={name} />
    </div>
  );
}
```
`name` is passed into `Greeting` as a **prop**, data handed down from a parent component to a child.

### Checkpoint
You have a running React app where typing into an input updates a separate child component in real time.

### Quiz
1. What does `useState` return?
2. What triggers React to re-render a component?
3. What is a "prop"?
4. What is JSX?
5. Why does the component function's name need to start with a capital letter?

*Answers: 1) A pair, the current state value and a function used to update that value. 2) Calling the state's update function (the setter returned by `useState`) with a new value. 3) Data passed from a parent component to a child component, received as an argument to the child function. 4) A syntax that lets you write markup that looks like HTML directly inside JavaScript, which React converts into actual page elements. 5) React distinguishes custom components from regular HTML tags by capitalization, a lowercase name would be treated as a plain HTML element instead.*

---

## Module 2: Next.js - Routing and Full Applications

### Concept

**Next.js** is a framework built on top of React that adds the pieces a full application typically needs: **file based routing** (a file's location in the project determines its URL), **server rendering** (pages can be built on the server before reaching the browser, improving speed and search engine visibility), and built in tools for data fetching and layouts.

### Syntax at a Glance

```
app/
  page.jsx           -> /
  about/
    page.jsx         -> /about
  blog/
    [slug]/
      page.jsx        -> /blog/anything (dynamic route)
```
```jsx
// app/about/page.jsx
export default function AboutPage() {
  return <h1>About Us</h1>;
}
```
- Each `page.jsx` file's folder path becomes its URL, no separate router configuration needed
- A folder name in square brackets, like `[slug]`, creates a **dynamic route**, matching any value in that URL position
- The `Link` component (`import Link from "next/link"`) navigates between pages without a full page reload: `<Link href="/about">About</Link>`

### Where you'd actually use this

Any multi page site or app, a blog, a store with individual product pages, a dashboard with multiple sections, where React alone would require manually wiring up a routing library.

### Lab

1. **Create a Next.js project:**
```bash
npx create-next-app@latest my-next-app
cd my-next-app
npm run dev
```
Open `http://localhost:3000`.

2. **Add a second page.** Create `app/about/page.jsx`:
```jsx
export default function AboutPage() {
  return (
    <div>
      <h1>About This Site</h1>
      <p>Built while learning Next.js.</p>
    </div>
  );
}
```
Visit `http://localhost:3000/about`, no router setup was needed, the file's location defined the URL.

3. **Link the two pages together.** Edit `app/page.jsx`:
```jsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Welcome Home</h1>
      <Link href="/about">Go to About</Link>
    </div>
  );
}
```
Click the link. The page changes instantly, without a full browser reload.

4. **Add a dynamic route.** Create `app/blog/[slug]/page.jsx`:
```jsx
export default function BlogPost({ params }) {
  return <h1>Reading post: {params.slug}</h1>;
}
```
Visit `http://localhost:3000/blog/hello-world` and `http://localhost:3000/blog/anything-else`. One file handles every possible slug.

### Checkpoint
You have a multi page Next.js app with a working link between pages and one dynamic route driven entirely by file structure.

### Quiz
1. How does Next.js decide a page's URL?
2. What does a folder name like `[slug]` create?
3. Why use the `Link` component instead of a plain `<a>` tag for internal navigation?
4. What does "server rendering" mean, in plain terms?
5. Does Next.js replace React, or build on top of it?

*Answers: 1) By the file's location inside the `app` folder, its path maps directly to the URL. 2) A dynamic route, matching any value placed in that position of the URL. 3) `Link` navigates without a full page reload, keeping the app feeling instant, whereas a plain `<a>` tag reloads the entire page. 4) Building the page's content on the server before sending it to the browser, rather than assembling it entirely with JavaScript after the page loads. 5) It builds on top of React, adding routing, rendering, and application level features around React's component model.*

---

## Module 3: Vue - Templates and Reactivity

### Concept

**Vue** builds UI from components similar to React, but uses HTML-like **templates** with special attributes, rather than JSX, and its **reactivity system** automatically tracks which parts of the template depend on which data, updating only what's needed when that data changes.

### Syntax at a Glance

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);
</script>

<template>
  <div>
    <p>Clicked {{ count }} times</p>
    <button @click="count++">Click me</button>
  </div>
</template>
```
- `ref(initialValue)` creates a reactive value; read or write it through `.value` in `<script>` (`count.value++`), but reference it directly (without `.value`) inside the `<template>`
- `{{ expression }}` embeds a value into the template, similar to `{expression}` in JSX
- `@click="..."` (short for `v-on:click`) attaches an event handler directly as a template attribute
- `v-if="condition"` conditionally renders an element; `v-for="item in list"` renders one element per item in a list

### Where you'd actually use this

Any project where a template that reads close to plain HTML is preferred over JSX, Vue is common in projects that want a gentler learning curve while still getting full component based reactivity.

### Lab

1. **Create a Vue project:**
```bash
npm create vue@latest my-vue-app
cd my-vue-app
npm install
npm run dev
```
Open the local URL shown in the terminal.

2. **Replace `src/App.vue`** with a small component:
```vue
<script setup>
import { ref } from "vue";

const name = ref("");
</script>

<template>
  <div>
    <h1>Say Hello</h1>
    <input v-model="name" placeholder="Enter your name" />
    <p v-if="name">Hello, {{ name }}!</p>
  </div>
</template>
```
`v-model` two way binds the input's value directly to the `name` ref, no manual event handler needed. Type into the input, the greeting appears and updates instantly.

3. **Add a list with `v-for`:**
```vue
<script setup>
import { ref } from "vue";

const name = ref("");
const tasks = ref(["Learn Vue", "Build something small", "Ship it"]);
</script>

<template>
  <div>
    <h1>Say Hello</h1>
    <input v-model="name" placeholder="Enter your name" />
    <p v-if="name">Hello, {{ name }}!</p>

    <h2>Tasks</h2>
    <ul>
      <li v-for="task in tasks" :key="task">{{ task }}</li>
    </ul>
  </div>
</template>
```
`:key` (short for `v-bind:key`) gives each list item a unique identity, helping Vue track changes efficiently.

### Checkpoint
You have a running Vue app with a two way bound input and a rendered list, both driven from reactive data.

### Quiz
1. What does `ref()` do in Vue?
2. What does `v-model` do, compared to manually writing `@input` and updating a value yourself?
3. What does `v-for` do?
4. Why does a `v-for` loop need a `:key`?
5. Inside `<template>`, do you need to write `count.value` or just `count`?

*Answers: 1) Creates a reactive value that Vue tracks, automatically updating any part of the template that depends on it when it changes. 2) `v-model` automatically keeps an input's displayed value and a reactive variable in sync in both directions, without writing the event handler and update logic by hand. 3) It renders one element for each item in a list or array. 4) It gives Vue a stable, unique identity for each item, so it can correctly track additions, removals, and reordering. 5) Just `count`, the `.value` unwrapping is only needed in the `<script>` section; templates access refs directly.*

---

## Module 4: Angular - A Full Platform

### Concept

**Angular** is a complete application platform, more opinionated and structured than React or Vue. Components are defined with **classes** and **decorators** (special annotations that add metadata), templates use their own syntax, and Angular includes built-in tools for routing, forms, and HTTP requests as part of the framework itself, rather than separate libraries.

### Syntax at a Glance

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-counter",
  template: `
    <p>Clicked {{ count }} times</p>
    <button (click)="increment()">Click me</button>
  `
})
export class CounterComponent {
  count = 0;

  increment() {
    this.count++;
  }
}
```
- `@Component({...})` is a **decorator**, attaching configuration (like the template and a CSS selector) to the class below it
- Data and methods are defined as regular class properties and methods (`count`, `increment()`), and referenced in the template without a prefix
- `{{ expression }}` embeds a value into the template, same as Vue
- `(click)="..."` attaches an event handler, parentheses mark an event binding, square brackets like `[value]="..."` mark a property binding

### Where you'd actually use this

Larger, longer lived applications, often in enterprise settings, where Angular's built-in structure (routing, forms, HTTP client, dependency injection) reduces the need to choose and wire together separate libraries yourself.

### Lab

1. **Create an Angular project:**
```bash
npm install -g @angular/cli
ng new my-angular-app
cd my-angular-app
ng serve
```
Open `http://localhost:4200`.

2. **Generate a new component:**
```bash
ng generate component greeting
```
This creates `src/app/greeting/greeting.component.ts` along with its template and styles.

3. **Edit `greeting.component.ts`:**
```typescript
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-greeting",
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1>Say Hello</h1>
    <input [(ngModel)]="name" placeholder="Enter your name" />
    <p *ngIf="name">Hello, {{ name }}!</p>
  `
})
export class GreetingComponent {
  name = "";
}
```
`[(ngModel)]` is Angular's two way binding syntax, equivalent to Vue's `v-model`. `*ngIf` conditionally renders an element, equivalent to Vue's `v-if`.

4. **Use the component.** In `src/app/app.component.ts`, add `GreetingComponent` to the `imports` array and reference it in the template:
```typescript
template: `<app-greeting></app-greeting>`
```
Save and check the browser, typing into the input updates the greeting live.

### Checkpoint
You have a running Angular app with a generated component using two way binding, embedded inside the root component.

### Quiz
1. What does the `@Component` decorator do?
2. What is the Angular equivalent of Vue's `v-model`?
3. What is the difference between `(click)="..."` and `[value]="..."` in Angular templates?
4. What does `ng generate component <name>` do?
5. What makes Angular more "opinionated" than React or Vue?

*Answers: 1) It attaches configuration, such as the template, styles, and a CSS selector, to the class that follows it, turning that class into a component. 2) `[(ngModel)]`, Angular's two way binding syntax. 3) Parentheses `(click)` bind to an event, running code in response; square brackets `[value]` bind a property, passing a value into the element. 4) It scaffolds a new component's files automatically, the class, template, styles, and registers it within the project. 5) Angular includes built-in, official tools for routing, forms, and HTTP requests as part of the framework itself, rather than leaving those choices to separate libraries the developer picks.*

---

## Capstone: The Same App, Four Ways

Build the same small "Say Hello" app (a text input and a live greeting) in each framework covered in this course:

1. In React (Module 1), using `useState` and a child component receiving a prop
2. In Next.js (Module 2), as one page in a multi page app, linked from a home page
3. In Vue (Module 3), using `ref` and `v-model`
4. In Angular (Module 4), using a generated component and `[(ngModel)]`
5. Compare the four side by side. Notice the underlying idea, a value that changes, a template or JSX that reflects it automatically, is identical in every one. Only the syntax and surrounding structure differ.

### Course completion checklist
- [ ] Explained why frameworks exist and what a component is
- [ ] Built a React component with state and a child component receiving a prop
- [ ] Built a multi page Next.js app with file based routing and a dynamic route
- [ ] Built a Vue component using `ref`, `v-model`, and `v-for`
- [ ] Built an Angular component using a decorator and two way binding
- [ ] Built the same small app in all four frameworks, and can point out what stayed the same versus what changed

Every piece of this course exists to answer one question, repeatedly and reliably: **given the same interactive idea, can I recognize and build it, no matter which framework a project happens to use?**
