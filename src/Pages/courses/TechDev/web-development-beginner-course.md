<!-- order: 4 -->
<!-- runnable: html -->
# Web Development for Builders: A Practical Beginner's Course

## Course Overview

**By the end of this course, you'll be able to:**
- Explain the separate jobs of HTML, CSS, and JavaScript on a web page
- Build a page in HTML with headings, lists, images, and an accessible form
- Style a page from a separate CSS file using selectors, a hover state, and a flexbox layout
- Write JavaScript that responds to clicks and form submissions and updates the page without reloading
- Catch a type error with TypeScript, and make a layout adapt to phone screens with a media query and the viewport tag

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

**Time: about 1 hour**

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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "browser",
   "kicker": "Module 0 · How a web page works",
   "title": "Three layers, three jobs",
   "beats": [
    {
     "say": "Welcome to Web Development for Builders."
    },
    {
     "say": "Every website you've ever used is built from the same three layers."
    }
   ]
  },
  {
   "kind": "list",
   "art": "layers",
   "kicker": "Concept",
   "title": "Structure, presentation, behaviour",
   "items": [
    [
     "HTML",
     "Structure and content"
    ],
    [
     "CSS",
     "Presentation and layout"
    ],
    [
     "JavaScript",
     "Behaviour"
    ]
   ],
   "beats": [
    {
     "say": "Each layer has its own job.",
     "show": 0
    },
    {
     "say": "HTML is the structure and content: the headings, paragraphs, images and buttons on the page.",
     "show": 1
    },
    {
     "say": "CSS is the presentation: colours, spacing, fonts and layout.",
     "show": 2
    },
    {
     "say": "And JavaScript is the behaviour: what happens when someone clicks, types or scrolls.",
     "show": 3
    }
   ]
  },
  {
   "kind": "list",
   "art": "phone",
   "kicker": "Concept",
   "title": "Two more ideas",
   "items": [
    [
     "TypeScript",
     "Catches mistakes before code runs"
    ],
    [
     "Responsive design",
     "Works on any screen size"
    ]
   ],
   "beats": [
    {
     "say": "Two more ideas you'll meet later in the course.",
     "show": 0
    },
    {
     "say": "TypeScript sits on top of JavaScript, and catches certain mistakes before the code ever runs.",
     "show": 1
    },
    {
     "say": "And responsive design makes all of this work on any screen, from a phone to a wide monitor.",
     "show": 2
    }
   ]
  },
  {
   "kind": "flow",
   "art": "browser",
   "kicker": "Lab",
   "title": "Look inside a real page",
   "steps": [
    "Right click",
    "Inspect",
    "Click elements to see them highlighted"
   ],
   "beats": [
    {
     "say": "Now look inside a real website.",
     "show": 0
    },
    {
     "say": "Right click any page,",
     "show": 1
    },
    {
     "say": "choose Inspect,",
     "show": 2
    },
    {
     "say": "and you're looking at its raw HTML. Click elements and watch the matching part of the page light up.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What is CSS responsible for?",
   "options": [
    "What happens when you click",
    "Colours, spacing, fonts and layout",
    "The text and images on the page"
   ],
   "answer": 1,
   "good": "That's right. CSS is the presentation layer: colours, spacing, fonts and layout.",
   "bad": "Not quite. CSS is the presentation layer: colours, spacing, fonts and layout.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What is CSS responsible for?",
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
     "You can name the three layers and their jobs",
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
     "say": "you can name the three layers of a web page and what each one does.",
     "show": 1
    },
    {
     "say": "Next, in Module 1, you write HTML.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 1: HTML - Structure and Content

**Time: about 2 hours**

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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "code",
   "kicker": "Module 1 · HTML",
   "title": "Structure and content",
   "beats": [
    {
     "say": "Welcome to Module 1."
    },
    {
     "say": "HTML describes the structure of a page using elements, marked by tags."
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Syntax at a glance",
   "title": "How a tag works",
   "file": "HTML",
   "code": "<tagname attribute=\"value\">Content goes here</tagname>\n\n<a href=\"https://example.com\">A link</a>\n<img src=\"photo.jpg\" alt=\"A photo\">",
   "beats": [
    {
     "say": "Here's the pattern.",
     "show": 0
    },
    {
     "say": "An opening tag, the content, then a closing tag with a slash.",
     "show": 1
    },
    {
     "say": "Attributes add extra information, like an address for a link, or a source for an image.",
     "show": 1
    },
    {
     "say": "And some elements close themselves, like an image or an input.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "code",
   "kicker": "Common tags",
   "title": "The tags you'll use most",
   "items": [
    [
     "<h1> … <h6>",
     "Headings"
    ],
    [
     "<p>",
     "Paragraphs"
    ],
    [
     "<a href>",
     "Links"
    ],
    [
     "<ul> <ol> <li>",
     "Lists"
    ],
    [
     "<div> <span>",
     "Containers"
    ],
    [
     "<form> <input> <button>",
     "User input"
    ]
   ],
   "beats": [
    {
     "say": "The tags you'll use most.",
     "show": 0
    },
    {
     "say": "H one to h six for headings. H one is the main one.",
     "show": 1
    },
    {
     "say": "P for paragraphs.",
     "show": 2
    },
    {
     "say": "A for links.",
     "show": 3
    },
    {
     "say": "U L, O L and L I for lists.",
     "show": 4
    },
    {
     "say": "Div and span as general containers.",
     "show": 5
    },
    {
     "say": "And form, input and button for user input.",
     "show": 6
    }
   ]
  },
  {
   "kind": "code",
   "art": "browser",
   "kicker": "Lab · Steps 1 and 2",
   "title": "Your first page",
   "file": "index.html",
   "code": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>My First Page</title>\n</head>\n<body>\n  <h1>Welcome to My Site</h1>\n  <p>This is a paragraph about this site.</p>\n</body>\n</html>",
   "beats": [
    {
     "say": "Make a folder called my site, and a file called index dot html.",
     "show": 0
    },
    {
     "say": "It has a head, with the page title, and a body with a heading and a paragraph.",
     "show": 1
    },
    {
     "say": "Double click it, and it opens straight in your browser. No server needed.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "code",
   "kicker": "Lab · Steps 3 and 4",
   "title": "Add more structure",
   "steps": [
    "<h2> About Me",
    "<ul> list",
    "<img alt=…>",
    "<form>"
   ],
   "beats": [
    {
     "say": "Then add more.",
     "show": 0
    },
    {
     "say": "A subheading,",
     "show": 1
    },
    {
     "say": "a list,",
     "show": 2
    },
    {
     "say": "an image, with alt text describing it for screen readers,",
     "show": 3
    },
    {
     "say": "and a form, with a label, a text box and a button. You'll connect it to JavaScript later.",
     "show": 4
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What is the alt attribute on an image for?",
   "options": [
    "It sets the image size",
    "It describes the image for screen readers, and shows if it fails to load",
    "It links the image to another page"
   ],
   "answer": 1,
   "good": "That's right. Alt text describes the image for screen readers, and shows if the image fails to load.",
   "bad": "Not quite. Alt text describes the image for screen readers, and shows if the image fails to load.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What is the alt attribute on an image for?",
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
     "Headings, paragraph, list, image and form, in your browser",
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
     "say": "you have an HTML file open in your browser with headings, a paragraph, a list, an image and a form.",
     "show": 1
    },
    {
     "say": "Next, in Module 2, you style it with CSS.",
     "show": 1
    }
   ]
  }
 ]
}
```

---

## Module 2: CSS - Presentation and Layout

**Time: about 2 hours**

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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "palette",
   "kicker": "Module 2 · CSS",
   "title": "Presentation and layout",
   "beats": [
    {
     "say": "Welcome to Module 2."
    },
    {
     "say": "CSS turns plain HTML into something that looks designed."
    }
   ]
  },
  {
   "kind": "code",
   "art": "palette",
   "kicker": "Syntax at a glance",
   "title": "How a CSS rule works",
   "file": "CSS",
   "code": "selector {\n  property: value;\n}\n\np       { color: #222; }      /* every paragraph */\n.card   { padding: 16px; }    /* class=\"card\" */\n#name   { width: 200px; }     /* id=\"name\" */",
   "beats": [
    {
     "say": "A rule has a selector, then declarations in curly brackets.",
     "show": 0
    },
    {
     "say": "The selector picks which elements the rule applies to.",
     "show": 1
    },
    {
     "say": "P means every paragraph. Dot name means every element with that class. Hash name means the one element with that ID.",
     "show": 1
    },
    {
     "say": "Each declaration is a property, a colon, a value, and a semicolon.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "palette",
   "kicker": "Lab · Steps 1 and 2",
   "title": "A separate stylesheet",
   "file": "index.html",
   "code": "<link rel=\"stylesheet\" href=\"style.css\">",
   "beats": [
    {
     "say": "Create style dot css, with a font, a background colour, spacing, and a coloured heading.",
     "show": 0
    },
    {
     "say": "Link it from the head of your HTML.",
     "show": 1
    },
    {
     "say": "Refresh, and the whole page changes, without touching the HTML at all.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "palette",
   "kicker": "Lab · Step 3",
   "title": "States, like hover",
   "file": "style.css",
   "code": "button {\n  background-color: #2b6cb0;\n  color: white;\n}\n\nbutton:hover {\n  background-color: #1e4e8c;\n}",
   "beats": [
    {
     "say": "Next, style the form's button.",
     "show": 0
    },
    {
     "say": "Button colon hover is a pseudo class. It only applies while your mouse is over the button.",
     "show": 1
    },
    {
     "say": "CSS can respond to state, not just structure.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "layers",
   "kicker": "Lab · Step 4",
   "title": "Your first layout",
   "file": "style.css",
   "code": "ul {\n  display: flex;\n  gap: 12px;\n  list-style: none;\n  padding: 0;\n}",
   "beats": [
    {
     "say": "Finally, a layout property.",
     "show": 0
    },
    {
     "say": "Display flex puts the list items side by side, and gap adds space between them.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why is CSS called \"cascading\"?",
   "options": [
    "Because it loads from the top of the page",
    "Rules combine, and later or more specific rules override earlier ones",
    "Because colours fade down the page"
   ],
   "answer": 1,
   "good": "That's right. Rules combine, and later or more specific rules override earlier or less specific ones.",
   "bad": "Not quite. Rules combine, and later or more specific rules override earlier or less specific ones.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why is CSS called \"cascading\"?",
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
     "Fonts, colours, spacing and a hover effect",
     ""
    ],
    [
     "All from a separate CSS file",
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
     "say": "your page has fonts, colours, spacing and a hover effect,",
     "show": 1
    },
    {
     "say": "all from a separate CSS file.",
     "show": 2
    },
    {
     "say": "Next, in Module 3, you make it interactive with JavaScript.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 3: JavaScript - Behavior and Interactivity

**Time: about 3 hours**

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

4. **Add a counter,** a common small interactive pattern. Put the button in `index.html` above the `<script>` tag, and the code at the end of `script.js`:
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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "cursor",
   "kicker": "Module 3 · JavaScript",
   "title": "Behaviour and interactivity",
   "beats": [
    {
     "say": "Welcome to Module 3."
    },
    {
     "say": "JavaScript runs in the browser, and lets your page respond to clicks, typing and more."
    }
   ]
  },
  {
   "kind": "list",
   "art": "code",
   "kicker": "Syntax at a glance",
   "title": "Four things you'll use constantly",
   "items": [
    [
     "let / const",
     "Variables"
    ],
    [
     "function",
     "Reusable code"
    ],
    [
     "querySelector",
     "Find an element"
    ],
    [
     "addEventListener",
     "React to events"
    ]
   ],
   "beats": [
    {
     "say": "Four things you'll use constantly.",
     "show": 0
    },
    {
     "say": "Let and const create variables. Use const unless the value really needs to change.",
     "show": 1
    },
    {
     "say": "Functions are reusable blocks of code.",
     "show": 2
    },
    {
     "say": "Query selector finds an element, using the same selectors as CSS.",
     "show": 3
    },
    {
     "say": "And add event listener runs your code when something happens, like a click.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Lab · Steps 1 and 2",
   "title": "Change the page with code",
   "file": "script.js",
   "code": "const heading = document.querySelector(\"h1\");\nheading.textContent = \"Welcome, and thanks for stopping by!\";",
   "beats": [
    {
     "say": "Create script dot j s and link it just before the end of the body.",
     "show": 0
    },
    {
     "say": "Find the h one, and change its text.",
     "show": 1
    },
    {
     "say": "Refresh, and the heading has changed, driven by code instead of HTML.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "cursor",
   "kicker": "Lab · Step 3",
   "title": "Respond to the form",
   "file": "script.js",
   "code": "form.addEventListener(\"submit\", function (event) {\n  event.preventDefault();\n  const message = document.createElement(\"p\");\n  message.textContent = `Hello, ${nameInput.value}!`;\n  form.after(message);\n});",
   "beats": [
    {
     "say": "Now the form from Module 1.",
     "show": 0
    },
    {
     "say": "Prevent default stops the page from reloading.",
     "show": 1
    },
    {
     "say": "Then read the name, create a new paragraph with a greeting, and add it after the form.",
     "show": 1
    },
    {
     "say": "Submit it, and the greeting appears instantly, without a reload.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "calc",
   "kicker": "Lab · Step 4",
   "title": "A click counter",
   "file": "script.js",
   "code": "let count = 0;\ncounterBtn.addEventListener(\"click\", function () {\n  count = count + 1;\n  counterBtn.textContent = `Clicked ${count} times`;\n});",
   "beats": [
    {
     "say": "Finally, a counter.",
     "show": 0
    },
    {
     "say": "Count lives outside the click listener. If it lived inside, it would reset to zero on every click.",
     "show": 1
    },
    {
     "say": "Each click adds one, and updates the button's text.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does event.preventDefault() do on a form submission?",
   "options": [
    "It deletes the form",
    "It stops the page from reloading, so your own code can run",
    "It sends the form to a server"
   ],
   "answer": 1,
   "good": "That's right. It stops the form's default reload, so your own code can run instead.",
   "bad": "Not quite. It stops the form's default reload, so your own code can run instead.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does event.preventDefault() do on a form submission?",
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
     "Responds to a form submit and a button click",
     ""
    ],
    [
     "Updates without reloading",
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
     "say": "your page responds to a form submission and a button click,",
     "show": 1
    },
    {
     "say": "and updates without reloading.",
     "show": 2
    },
    {
     "say": "Next, in the last module, safer code and any screen size.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 4: TypeScript and Responsive Design - Safer Code, Any Screen

**Time: about 2 hours**

### Concept

**TypeScript** is JavaScript with an added **type system**, you can declare what kind of value a variable should hold (a number, a string, a specific shape of object), and tools catch mismatches before the code ever runs in a browser. It compiles down to regular JavaScript, so browsers never run TypeScript directly.

**Responsive design** makes a page adapt to different screen sizes using CSS tools like **media queries**, rules that apply only when the screen matches certain conditions, and flexible layout units instead of fixed pixel widths.

### Syntax at a Glance

**TypeScript**, type annotations are added with a colon after a name:
```typescript
let age: number = 30;
let userName: string = "Alex";
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
If you get a permissions error, skip the install and type `npx tsc` wherever this module says `tsc`.

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
Run `tsc greet.ts` again. TypeScript reports an error saying that `"three"` is a string where a `number` was expected, catching the mistake before it ever reaches a browser or a user. Note that by default `tsc` still writes `greet.js` even when there are errors, so always read the error output and fix it. To make TypeScript refuse to produce JavaScript while errors exist, run `tsc --noEmitOnError greet.ts` (or set `"noEmitOnError": true` in a `tsconfig.json` file).

**Part B: Responsive Design**

4. **Add a media query** to `style.css`, so the layout changes on small screens, and add the `card` HTML below it to the `<body>` of `index.html`:
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

5. **Make the viewport behave correctly on mobile.** Add this tag inside the `<head>` of your HTML page (if it isn't there already), it tells mobile browsers to render at the device's actual width rather than zooming out:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Checkpoint
You caught a real type error with TypeScript before it ran, you added the viewport tag, and you have a layout that visibly changes shape when the screen narrows below 600px.

### Quiz
1. What does TypeScript add to plain JavaScript?
2. Does a browser run `.ts` files directly?
3. What does a media query like `@media (max-width: 600px)` do?
4. What does the viewport meta tag control?
5. If TypeScript catches a type mismatch, does that mean the bug would have definitely appeared for a real user, or is it usually caught earlier than that?

*Answers: 1) A type system, letting you declare what kind of values variables and functions expect, so mismatches are caught before the code runs. 2) No, TypeScript is compiled into plain JavaScript first, and browsers only ever run the compiled `.js` output. 3) It applies the CSS rules inside it only when the screen matches the given condition, here, a width of 600px or less. 4) How a mobile browser sizes and scales the page, so it renders at the device's real width instead of a shrunk down desktop layout. 5) It's usually caught earlier, that's the point, the error is found while writing or compiling the code, well before it could reach a real user.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "phone",
   "kicker": "Module 4 · TypeScript and responsive design",
   "title": "Safer code, any screen",
   "beats": [
    {
     "say": "Welcome to the last module."
    },
    {
     "say": "Two topics: TypeScript, which catches mistakes early, and responsive design, which fits any screen."
    }
   ]
  },
  {
   "kind": "code",
   "art": "shield",
   "kicker": "Concept · TypeScript",
   "title": "Say what type you expect",
   "file": "TypeScript",
   "code": "let age: number = 30;\nlet userName: string = \"Alex\";\n\nfunction greet(name: string, timesClicked: number): string {\n  return `Hello, ${name}`;\n}",
   "beats": [
    {
     "say": "TypeScript is JavaScript with types.",
     "show": 0
    },
    {
     "say": "Add a colon and a type after a name, like age colon number.",
     "show": 1
    },
    {
     "say": "Functions can say what each input is, and what they return.",
     "show": 1
    },
    {
     "say": "Browsers don't run TypeScript. It's compiled into plain JavaScript first.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "warning",
   "kicker": "Lab · Part A",
   "title": "Catch a mistake before it runs",
   "steps": [
    "tsc greet.ts",
    "greet(\"Alex\", \"three\")",
    "Error: string is not a number"
   ],
   "beats": [
    {
     "say": "In the lab, write greet dot t s and compile it with t s c.",
     "show": 1
    },
    {
     "say": "Then pass the text three, where a number was expected.",
     "show": 2
    },
    {
     "say": "TypeScript reports the mistake right away, before it ever reaches a user.",
     "show": 3
    },
    {
     "say": "By default it still writes the JavaScript file, so always read the errors. The no emit on error option makes it refuse.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "phone",
   "kicker": "Concept · Responsive design",
   "title": "Media queries",
   "file": "style.css",
   "code": ".card {\n  display: flex;\n  gap: 16px;\n}\n\n@media (max-width: 600px) {\n  .card {\n    flex-direction: column;\n  }\n}",
   "beats": [
    {
     "say": "Now responsive design.",
     "show": 0
    },
    {
     "say": "A media query wraps CSS rules in a condition.",
     "show": 1
    },
    {
     "say": "Here, when the screen is six hundred pixels or narrower, the card's items stack into a column.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quote",
   "art": "phone",
   "kicker": "Lab · Step 5",
   "title": "The viewport tag",
   "quote": "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
   "beats": [
    {
     "say": "One more line makes phones behave.",
     "show": 0
    },
    {
     "say": "The viewport tag tells mobile browsers to use the device's real width, instead of zooming out a desktop layout.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Does a browser run .ts files directly?",
   "options": [
    "Yes, all modern browsers do",
    "No, TypeScript is compiled into JavaScript first",
    "Only Chrome does"
   ],
   "answer": 1,
   "good": "That's right. TypeScript is compiled into plain JavaScript, and browsers run the compiled file.",
   "bad": "Not quite. TypeScript is compiled into plain JavaScript, and browsers run the compiled file.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Does a browser run .ts files directly?",
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
     "You caught a type error with TypeScript",
     ""
    ],
    [
     "You added the viewport tag",
     ""
    ],
    [
     "Your layout stacks below 600px",
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
     "say": "you caught a real type error with TypeScript,",
     "show": 1
    },
    {
     "say": "added the viewport tag,",
     "show": 2
    },
    {
     "say": "and your layout changes shape below six hundred pixels.",
     "show": 3
    },
    {
     "say": "You've finished Web Development for Builders. Well done.",
     "show": 3
    }
   ]
  }
 ]
}
```
