# Web Development for Builders: A Practical Beginner's Course

## Course Overview

**Who this is for:** Beginners who want to build real, working pages for the web, understanding not just the syntax but why each piece exists and how they fit together.

**How the course works:** Five modules. Every topic follows the same pattern:
- **Concept** - what it is, in plain language
- **Where you'd actually use this** - a real product scenario
- **Lab** - hands-on, runnable examples
- **Checkpoint**
- **Quiz** - five questions with answers

**Tools needed:** A text editor (such as [VS Code](https://code.visualstudio.com)), a web browser, and optionally [Node.js](https://nodejs.org) installed for the TypeScript module.

---

## Module 0: How a Web Page Actually Works

### Concept

A web page is built from three layers, each with its own job:
- **HTML** provides structure and content, the headings, paragraphs, images, and buttons that exist on the page
- **CSS** provides presentation, colors, spacing, fonts, and layout
- **JavaScript** provides behavior, what happens when someone clicks, types, or scrolls

**TypeScript** is a layer on top of JavaScript that catches certain mistakes before the code ever runs. **Responsive design** is the practice of making all of this work well on any screen size, from a phone to a wide monitor.

### Where you'd actually use this

Every website and web app you've ever used is built from this same stack, structure, presentation, and behavior, working together. Understanding the split makes it far easier to find where a problem lives when something breaks.

### Lab

Open any website in your browser, right click on the page, and choose "Inspect" (or "Inspect Element"). Look at the panel that opens. You're looking at the raw HTML structure of a real, live page. Try clicking on a few elements and notice how a highlighted box appears around the matching part of the page.

### Checkpoint
You can name the three layers of a web page and explain what each one is responsible for.

### Quiz
1. What is HTML responsible for?
2. What is CSS responsible for?
3. What is JavaScript responsible for?
4. What does TypeScript add on top of JavaScript?
5. What does "responsive design" mean?

*Answers: 1) The structure and content of a page, headings, text, images, and other elements. 2) The presentation of a page, colors, spacing, fonts, and layout. 3) The behavior of a page, what happens in response to clicks, typing, or other actions. 4) A way to catch certain kinds of mistakes before the code runs, by checking the types of values used. 5) Designing a page so it works and looks correct across different screen sizes, from phones to desktop monitors.*

---

## Module 1: HTML - Structure and Content

### Concept

**HTML (HyperText Markup Language)** describes the structure of a page using **elements**, marked by tags like `<p>` for a paragraph or `<img>` for an image. Elements can be nested inside each other, forming a structure, and browsers read this structure to know what to display and in what order.

### Syntax at a Glance

```html
<tagname attribute="value">Content goes here</tagname>
```
- `<tagname>` is the **opening tag**, `</tagname>` is the **closing tag**, together they wrap the content
- `attribute="value"` sets extra information on the tag, such as `href`, `src`, or `class`
- Some elements are **self-closing** and have no content or closing tag, like `<img src="photo.jpg">`, `<br>`, and `<input>`
- Common tags: `<h1>` to `<h6>` for headings, `<p>` for paragraphs, `<a href="...">` for links, `<ul>`/`<ol>`/`<li>` for lists, `<div>` and `<span>` as generic containers, `<form>`/`<input>`/`<button>` for user input

### Where you'd actually use this

Any time you're building the actual content of a page, a blog post, a product listing, a contact form, HTML is the layer that holds it all and gives it meaning, before any styling or interactivity is added.

### Lab

1. **Create a project folder and an HTML file:**
```bash
mkdir my-site
cd my-site
```
Create a file named `index.html` with this content:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First Page</title>
</head>
<body>
  <h1>Welcome to My Site</h1>
  <p>This is a paragraph describing what this site is about.</p>
</body>
</html>
```

2. **Open it in your browser.** Double click `index.html`, or drag it into a browser window. You should see the heading and paragraph rendered as actual page content.

3. **Add more structure:**
```html
<h1>Welcome to My Site</h1>
<p>This is a paragraph describing what this site is about.</p>

<h2>About Me</h2>
<p>I'm learning web development, one module at a time.</p>

<ul>
  <li>HTML for structure</li>
  <li>CSS for style</li>
  <li>JavaScript for behavior</li>
</ul>

<img src="https://placehold.co/200x100" alt="A placeholder image">
```
Refresh the browser tab. Notice each tag produced a distinct, predictable piece of the page.

4. **Add a form,** the kind of element that later connects to JavaScript:
```html
<form>
  <label for="name">Your name:</label>
  <input type="text" id="name" name="name">
  <button type="submit">Say Hello</button>
</form>
```

### Checkpoint
You have a real HTML file, opened directly in a browser, containing headings, a paragraph, a list, an image, and a form.

### Quiz
1. What does the `<h1>` tag represent, compared to `<h2>`?
2. What is the `alt` attribute on an `<img>` tag for?
3. Why does `index.html` open directly in a browser without needing a server?
4. What does nesting elements inside each other represent?
5. Does HTML alone control how a page looks, colors and spacing included?

*Answers: 1) `<h1>` represents the main, top level heading; `<h2>` represents a subheading, one level below it. 2) It provides alternate text describing the image, used by screen readers and shown if the image fails to load. 3) Browsers can read HTML files directly from disk, no server is required just to view static structure and content. 4) A structural relationship, an element nested inside another is considered part of, or contained within, that outer element. 5) No, HTML controls structure and content only, presentation is CSS's job.*

---

## Module 2: CSS - Presentation and Layout

### Concept

**CSS (Cascading Style Sheets)** controls how HTML elements look. A CSS **rule** targets one or more elements using a **selector**, then applies **properties**, like color, size, or spacing, to them. "Cascading" refers to how rules can combine and override each other based on specificity and order.

### Syntax at a Glance

```css
selector {
  property: value;
  property: value;
}
```
- A **selector** picks which elements the rule applies to: `p` (every paragraph), `.classname` (every element with that class), `#idname` (the one element with that id)
- Each line inside the braces is a **declaration**, a `property: value;` pair, always ending in a semicolon
- Selectors can be combined: `.card h1` targets an `<h1>` inside any element with class `card`
- A **pseudo class** like `:hover` or `:focus` targets an element only in a certain state: `button:hover { ... }`

### Where you'd actually use this

Any time HTML content exists but looks plain and unstyled, default black text on a white background. CSS is what turns that raw structure into something that matches a design, a brand, or simply looks intentional.

### Lab

1. **Create a CSS file** named `style.css` in the same folder:
```css
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  color: #222;
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #2b6cb0;
}

ul {
  line-height: 1.6;
}
```

2. **Link it to your HTML.** Add this inside the `<head>` of `index.html`:
```html
<link rel="stylesheet" href="style.css">
```
Refresh the browser. The page now has a font, a background color, spacing, and a colored heading, without changing any HTML.

3. **Style the form** you added in Module 1:
```css
form {
  margin-top: 20px;
}

input[type="text"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #2b6cb0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #1e4e8c;
}
```
Refresh again. Notice `:hover` only applies while your mouse is over the button, a small taste of how CSS responds to state, not just static structure.

4. **Try a layout property.** Add this rule and watch the list items rearrange:
```css
ul {
  display: flex;
  gap: 12px;
  list-style: none;
  padding: 0;
}
```

### Checkpoint
Your page is visibly styled, fonts, colors, spacing, and a hover effect on the button, all driven from a separate CSS file linked to your HTML.

### Quiz
1. What is a CSS selector?
2. What does linking a `.css` file with `<link>` accomplish, compared to writing styles directly in HTML?
3. What does the `:hover` pseudo class do?
4. Why is CSS described as "cascading"?
5. Does changing CSS require editing the HTML file's content?

*Answers: 1) The part of a CSS rule that identifies which HTML elements the rule applies to, such as a tag name, class, or ID. 2) It keeps structure and presentation separate, one CSS file can style many HTML pages, and changes don't require touching the content itself. 3) It applies a set of styles only while the user's mouse is positioned over that element. 4) Because rules can combine, and later or more specific rules can override earlier or less specific ones, cascading down to a final result. 5) No, styling can be changed entirely within the CSS file, without modifying the HTML structure or content at all.*

---

## Module 3: JavaScript - Behavior and Interactivity

### Concept

**JavaScript** runs in the browser and lets a page respond to events, a click, a keystroke, a page load, by changing content, styling, or data on the fly. Where HTML and CSS describe a static page, JavaScript is what makes it dynamic and interactive.

### Syntax at a Glance

```javascript
let x = 5;          // a variable that can change later
const y = "hello";  // a variable that cannot be reassigned

function add(a, b) {
  return a + b;
}

if (x > 3) {
  console.log("big");
} else {
  console.log("small");
}

element.addEventListener("click", function (event) {
  // code to run when the element is clicked
});
```
- `let` and `const` declare variables; use `const` unless the value genuinely needs to change later
- A **function** is a reusable block of code, defined once and called by name wherever needed
- `document.querySelector("selector")` finds an element on the page using the same kind of selector CSS uses
- `element.addEventListener("eventName", callbackFunction)` runs `callbackFunction` whenever `eventName` (like `"click"` or `"submit"`) occurs on `element`

### Where you'd actually use this

Any time a page needs to react to a user, validating a form before it submits, showing or hiding content, updating a counter, or fetching new data without reloading the whole page.

### Lab

1. **Create a JavaScript file** named `script.js`, and link it at the bottom of `index.html`, just before `</body>`:
```html
<script src="script.js"></script>
```

2. **Select an element and change it:**
```javascript
// script.js
const heading = document.querySelector("h1");
heading.textContent = "Welcome, and thanks for stopping by!";
```
Refresh the page. The heading text changed, driven by code, not by editing the HTML directly.

3. **Respond to the form from Module 1.** Prevent the default page reload, and greet the user instead:
```javascript
const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const nameInput = document.querySelector("#name");
  const message = document.createElement("p");
  message.textContent = `Hello, ${nameInput.value}! Thanks for saying hi.`;
  form.after(message);
});
```
Type a name into the form and submit it. A new greeting appears on the page instantly, with no reload.

4. **Add a counter,** a common small interactive pattern:
```html
<button id="counter-btn">Clicked 0 times</button>
```
```javascript
const counterBtn = document.querySelector("#counter-btn");
let count = 0;

counterBtn.addEventListener("click", function () {
  count = count + 1;
  counterBtn.textContent = `Clicked ${count} times`;
});
```

### Checkpoint
Your page responds to at least two real user actions, a form submission and a button click, both updating the page without a reload.

### Quiz
1. What is an "event" in the context of JavaScript?
2. What does `document.querySelector` do?
3. What does `event.preventDefault()` do when called on a form submission?
4. Why does the counter example use a variable (`count`) outside the event listener, rather than inside it?
5. What is the key difference between what HTML/CSS do and what JavaScript does?

*Answers: 1) An action or occurrence the browser can detect and respond to, such as a click, a keystroke, or a page finishing loading. 2) It finds the first HTML element matching a given selector, so it can be read or changed with code. 3) It stops the form's default behavior, which would otherwise reload the page, letting custom code run instead. 4) A variable declared inside the listener would reset to its starting value on every click; declaring it outside lets it persist and accumulate between clicks. 5) HTML and CSS describe static structure and appearance; JavaScript adds behavior, letting the page change in response to what a user does.*

---

## Module 4: TypeScript and Responsive Design - Safer Code, Any Screen

### Concept

**TypeScript** is JavaScript with an added **type system**, you can declare what kind of value a variable should hold (a number, a string, a specific shape of object), and tools catch mismatches before the code ever runs in a browser. It compiles down to regular JavaScript, so browsers never run TypeScript directly.

**Responsive design** makes a page adapt to different screen sizes using CSS tools like **media queries**, rules that apply only when the screen matches certain conditions, and flexible layout units instead of fixed pixel widths.

### Syntax at a Glance

**TypeScript**, type annotations are added with a colon after a name:
```typescript
let age: number = 30;
let name: string = "Alex";
let isActive: boolean = true;

function greet(name: string, timesClicked: number): string {
  return `Hello, ${name}`;
}

interface User {
  name: string;
  age: number;
}
```
- `variable: type` declares the type a variable is allowed to hold
- `function name(param: type): returnType` also types each parameter and what the function returns
- `interface` describes the required shape of an object, its property names and their types

**Responsive CSS**, media queries wrap normal CSS rules in a condition:
```css
@media (max-width: 600px) {
  .card {
    flex-direction: column;
  }
}
```
- `@media (condition) { ... }` applies the rules inside it only when the condition is true, most often a `max-width` or `min-width`
- Flexible units like `%`, `vw`, `vh`, and `rem` scale with the screen or root font size, unlike a fixed `px` value

### Where you'd actually use this

TypeScript matters as soon as a project grows past a page or two, catching typos and mismatched data before they become bugs a user encounters. Responsive design matters immediately, since real visitors arrive on phones, tablets, and desktops, all expecting the page to work well.

### Lab

**Part A: TypeScript**

1. **Set up TypeScript:**
```bash
npm install -g typescript
```
Create a file named `greet.ts`:
```typescript
function greet(name: string, timesClicked: number): string {
  return `Hello, ${name}! You've clicked ${timesClicked} times.`;
}

console.log(greet("Alex", 3));
```

2. **Compile it to JavaScript:**
```bash
tsc greet.ts
```
This produces `greet.js`, plain JavaScript a browser can run.

3. **Trigger a type error on purpose.** Change the last line to:
```typescript
console.log(greet("Alex", "three"));
```
Run `tsc greet.ts` again. TypeScript refuses to compile cleanly, and reports that `"three"` is a string where a `number` was expected, catching the mistake before it ever reaches a browser or a user.

**Part B: Responsive Design**

4. **Add a media query** to `style.css`, so the layout changes on small screens:
```css
.card {
  display: flex;
  gap: 16px;
}

@media (max-width: 600px) {
  .card {
    flex-direction: column;
  }
}
```
```html
<div class="card">
  <div>Item One</div>
  <div>Item Two</div>
  <div>Item Three</div>
</div>
```
Resize your browser window, or open your page on a phone, narrower than 600px. The items stack vertically instead of sitting side by side.

5. **Make the viewport behave correctly on mobile.** Confirm this tag is present in `<head>`, it tells mobile browsers to render at the device's actual width rather than zooming out:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Checkpoint
You caught a real type error with TypeScript before it ran, and you have a layout that visibly changes shape when the screen narrows below 600px.

### Quiz
1. What does TypeScript add to plain JavaScript?
2. Does a browser run `.ts` files directly?
3. What does a media query like `@media (max-width: 600px)` do?
4. What does the viewport meta tag control?
5. If TypeScript catches a type mismatch, does that mean the bug would have definitely appeared for a real user, or is it usually caught earlier than that?

*Answers: 1) A type system, letting you declare what kind of values variables and functions expect, so mismatches are caught before the code runs. 2) No, TypeScript is compiled into plain JavaScript first, and browsers only ever run the compiled `.js` output. 3) It applies the CSS rules inside it only when the screen matches the given condition, here, a width of 600px or less. 4) How a mobile browser sizes and scales the page, so it renders at the device's real width instead of a shrunk down desktop layout. 5) It's usually caught earlier, that's the point, the error is found while writing or compiling the code, well before it could reach a real user.*

---

## Capstone: A Complete, Responsive Page

Combine every module into one working page:

1. HTML provides the structure, headings, content, a form, and a card layout (Module 1)
2. CSS styles it, colors, spacing, hover effects, and a responsive card layout (Module 2)
3. JavaScript adds behavior, a working form submission and an interactive counter (Module 3)
4. TypeScript catches a mismatched type before it ever reaches the page, compiled down to the JavaScript that actually runs (Module 4)
5. A media query makes the layout adapt when the screen narrows (Module 4)
6. Open your finished page on both a wide browser window and a narrow one (or your phone), and confirm it looks correct, and works correctly, in both.

### Course completion checklist
- [ ] Built a real HTML page with headings, a list, an image, and a form
- [ ] Linked and applied a separate CSS file to style that page
- [ ] Used JavaScript to respond to a form submission and a button click
- [ ] Compiled a TypeScript file to JavaScript
- [ ] Caught a real type error using TypeScript before running the code
- [ ] Added a media query that changes the layout on a narrow screen
- [ ] Confirmed the finished page works correctly on both a wide and a narrow screen

Every piece of this course exists to answer one question, repeatedly and reliably: **does this page communicate clearly, look right, and work correctly, for anyone, on any screen?**
