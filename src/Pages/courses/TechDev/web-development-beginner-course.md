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
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Three files build one button",
   "nodes": [
    {
     "id": "page",
     "label": "The page",
     "x": 80,
     "y": 50,
     "sub": "what you see",
     "art": "browser"
    },
    {
     "id": "html",
     "label": "HTML",
     "x": 18,
     "y": 18,
     "sub": "structure",
     "art": "doc"
    },
    {
     "id": "css",
     "label": "CSS",
     "x": 18,
     "y": 50,
     "sub": "presentation",
     "art": "palette"
    },
    {
     "id": "js",
     "label": "JavaScript",
     "x": 18,
     "y": 82,
     "sub": "behaviour",
     "art": "cursor"
    }
   ],
   "edges": [
    {
     "from": "html",
     "to": "page"
    },
    {
     "from": "css",
     "to": "page"
    },
    {
     "from": "js",
     "to": "page"
    }
   ],
   "beats": [
    {
     "say": "Let's follow one button, Say Hello, as the browser builds it.",
     "show": 1,
     "on": "page"
    },
    {
     "say": "HTML is the structure. It says a button exists, and what it says.",
     "show": 2,
     "on": "html",
     "send": {
      "from": "html",
      "to": "page",
      "label": "<button>Say Hello</button>"
     }
    },
    {
     "say": "CSS is the presentation. It makes that button blue, with rounded corners.",
     "show": 3,
     "on": "css",
     "send": {
      "from": "css",
      "to": "page",
      "label": "background-color: #2b6cb0;"
     }
    },
    {
     "say": "JavaScript is the behaviour. It decides what happens when someone clicks.",
     "show": 4,
     "on": "js",
     "send": {
      "from": "js",
      "to": "page",
      "label": "click → show a greeting"
     }
    },
    {
     "say": "Three layers, three separate jobs, one working button.",
     "show": 4,
     "on": [
      "html",
      "css",
      "js"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Something broke. Which layer do you open?",
   "columns": [
    "Symptom",
    "Look in"
   ],
   "rows": [
    [
     "The button isn't on the page",
     "HTML"
    ],
    [
     "The button is the wrong colour",
     "CSS"
    ],
    [
     "Clicking the button does nothing",
     "JavaScript"
    ],
    [
     "Text was passed where a number belongs",
     "TypeScript catches it"
    ],
    [
     "The page is cramped on a phone",
     "Responsive design"
    ]
   ],
   "beats": [
    {
     "say": "Knowing the split tells you where a problem lives."
    },
    {
     "say": "If the button is missing altogether, that's structure. Look in the HTML.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "Right button, wrong colour? That's presentation. Look in the CSS.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "Looks fine but does nothing when clicked? That's behaviour. Look in the JavaScript.",
     "hl": 2,
     "col": 1
    },
    {
     "say": "Two more ideas for later. TypeScript sits on top of JavaScript, and catches mistakes like this before the code runs.",
     "hl": 3,
     "col": 1
    },
    {
     "say": "And responsive design makes the page work on any screen, from a phone to a wide monitor.",
     "hl": 4,
     "dim": true,
     "col": 1
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Two more ideas you'll meet in Module 4",
   "nodes": [
    {
     "id": "ts",
     "label": "TypeScript",
     "x": 12,
     "y": 50,
     "sub": "JavaScript plus types",
     "art": "shield"
    },
    {
     "id": "js",
     "label": "JavaScript",
     "x": 40,
     "y": 50,
     "sub": "what browsers run",
     "art": "code"
    },
    {
     "id": "page",
     "label": "Your page",
     "x": 66,
     "y": 50,
     "sub": "one set of files",
     "art": "layout"
    },
    {
     "id": "phone",
     "label": "Phone",
     "x": 90,
     "y": 22,
     "sub": "narrow screen",
     "art": "phone"
    },
    {
     "id": "wide",
     "label": "Wide monitor",
     "x": 90,
     "y": 80,
     "sub": "wide screen",
     "art": "laptop"
    }
   ],
   "edges": [
    {
     "from": "ts",
     "to": "js"
    },
    {
     "from": "js",
     "to": "page"
    },
    {
     "from": "page",
     "to": "phone"
    },
    {
     "from": "page",
     "to": "wide"
    }
   ],
   "beats": [
    {
     "say": "TypeScript is JavaScript with types added. It checks your code before anything runs.",
     "show": 1,
     "on": "ts"
    },
    {
     "say": "Browsers don't run it directly. It's turned into plain JavaScript first.",
     "show": 2,
     "on": "js",
     "send": {
      "from": "ts",
      "to": "js",
      "label": "checked, then compiled"
     }
    },
    {
     "say": "That JavaScript becomes part of your page, alongside the HTML and CSS.",
     "show": 3,
     "on": "page",
     "send": {
      "from": "js",
      "to": "page",
      "label": "script.js"
     }
    },
    {
     "say": "Responsive design means that same page fits a narrow phone,",
     "show": 5,
     "on": "phone",
     "send": {
      "from": "page",
      "to": "phone",
      "label": "stacked layout"
     }
    },
    {
     "say": "and a wide monitor, without building two different sites.",
     "show": 5,
     "on": "wide",
     "send": {
      "from": "page",
      "to": "wide",
      "label": "side-by-side layout"
     }
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab",
   "title": "Look inside a real page",
   "nodes": [
    {
     "id": "page",
     "label": "Any website",
     "x": 22,
     "y": 50,
     "sub": "what you see",
     "art": "browser"
    },
    {
     "id": "panel",
     "label": "Inspect panel",
     "x": 78,
     "y": 50,
     "sub": "its raw HTML",
     "art": "search"
    }
   ],
   "edges": [
    {
     "from": "page",
     "to": "panel"
    }
   ],
   "beats": [
    {
     "say": "Open any website in your browser.",
     "show": 1,
     "on": "page"
    },
    {
     "say": "Right click the page, and choose Inspect.",
     "show": 2,
     "on": "panel",
     "send": {
      "from": "page",
      "to": "panel",
      "label": "right click → Inspect"
     }
    },
    {
     "say": "The panel that opens is the raw HTML structure of that real, live page.",
     "show": 2,
     "on": "panel"
    },
    {
     "say": "Click an element in the panel, like a heading.",
     "show": 2,
     "on": "panel"
    },
    {
     "say": "A highlighted box appears around the matching part of the page.",
     "show": 2,
     "on": "page",
     "send": {
      "from": "panel",
      "to": "page",
      "label": "highlight <h1>"
     }
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
   "art": "layout",
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
   "kind": "table",
   "kicker": "Syntax at a glance",
   "title": "The parts of an element",
   "columns": [
    "Part",
    "Example",
    "Job"
   ],
   "rows": [
    [
     "Opening tag",
     "<a href=\"https://example.com\">",
     "Starts the element"
    ],
    [
     "Attribute",
     "href=\"https://example.com\"",
     "Extra information"
    ],
    [
     "Content",
     "A link",
     "What the reader sees"
    ],
    [
     "Closing tag",
     "</a>",
     "Ends it, with a slash"
    ],
    [
     "Self-closing",
     "<img src=\"photo.jpg\" alt=\"A photo\">",
     "No content, no closing tag"
    ]
   ],
   "beats": [
    {
     "say": "Here's one link, taken apart.",
     "sql": "<a href=\"https://example.com\">A link</a>"
    },
    {
     "say": "The opening tag starts the element. A means a link.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "Inside it, an attribute adds extra information. H ref is the address the link goes to.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "Then the content, the words the reader actually sees.",
     "hl": 2,
     "col": 1
    },
    {
     "say": "And the closing tag, the same name with a slash, ends it.",
     "hl": 3,
     "col": 1
    },
    {
     "say": "Some elements have no content at all, so they close themselves, like an image or an input.",
     "hl": 4,
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 1 and 2",
   "title": "The browser reads your page from the top",
   "file": "index.html",
   "code": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>My First Page</title>\n</head>\n<body>\n  <h1>Welcome to My Site</h1>\n  <p>This is a paragraph describing what this site is about.</p>\n</body>\n</html>",
   "beats": [
    {
     "say": "Make a folder called my site, and inside it a file called index dot html.",
     "line": 1
    },
    {
     "say": "Doctype tells the browser this is a modern HTML page.",
     "line": 1
    },
    {
     "say": "Everything lives inside the html element, written in English.",
     "line": [
      2,
      11
     ]
    },
    {
     "say": "The head holds information about the page, not content on it.",
     "line": [
      3,
      6
     ]
    },
    {
     "say": "The title goes on the browser tab: My First Page.",
     "line": 5,
     "vars": {
      "tab": "My First Page"
     }
    },
    {
     "say": "The body holds what you actually see.",
     "line": [
      7,
      10
     ]
    },
    {
     "say": "An h one, the main heading.",
     "line": 8,
     "out": "Welcome to My Site   ← main heading"
    },
    {
     "say": "And a p, a paragraph below it.",
     "line": 9,
     "out": "This is a paragraph describing what this site is about."
    },
    {
     "say": "Double click the file, and it opens straight in your browser. No server needed.",
     "line": [
      8,
      9
     ]
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Nesting: elements inside elements",
   "nodes": [
    {
     "id": "html",
     "label": "<html>",
     "x": 50,
     "y": 15,
     "sub": "the whole page"
    },
    {
     "id": "head",
     "label": "<head>",
     "x": 25,
     "y": 48,
     "sub": "about the page"
    },
    {
     "id": "body",
     "label": "<body>",
     "x": 75,
     "y": 48,
     "sub": "what you see"
    },
    {
     "id": "title",
     "label": "<title>",
     "x": 25,
     "y": 84,
     "sub": "My First Page"
    },
    {
     "id": "h1",
     "label": "<h1>",
     "x": 62,
     "y": 84,
     "sub": "Welcome to My Site"
    },
    {
     "id": "p",
     "label": "<p>",
     "x": 88,
     "y": 84,
     "sub": "This is a paragraph…"
    }
   ],
   "edges": [
    {
     "from": "html",
     "to": "head"
    },
    {
     "from": "html",
     "to": "body"
    },
    {
     "from": "head",
     "to": "title"
    },
    {
     "from": "body",
     "to": "h1"
    },
    {
     "from": "body",
     "to": "p"
    }
   ],
   "beats": [
    {
     "say": "That page is really a set of boxes inside boxes.",
     "show": 1,
     "on": "html"
    },
    {
     "say": "Inside html sit two children: head and body.",
     "show": 3,
     "on": [
      "head",
      "body"
     ]
    },
    {
     "say": "The title is nested inside head, so it's part of the page's information.",
     "show": 4,
     "on": "title"
    },
    {
     "say": "The heading and the paragraph are nested inside body, so they're part of the visible content.",
     "show": 6,
     "on": [
      "h1",
      "p"
     ]
    },
    {
     "say": "The browser reads this structure to know what to show, and in what order.",
     "show": 6,
     "on": "body"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 3",
   "title": "Each tag makes one predictable piece",
   "file": "index.html",
   "code": "<h2>About Me</h2>\n<p>I'm learning web development, one module at a time.</p>\n\n<ul>\n  <li>HTML for structure</li>\n  <li>CSS for style</li>\n  <li>JavaScript for behavior</li>\n</ul>\n\n<img src=\"https://placehold.co/200x100\" alt=\"A placeholder image\">",
   "beats": [
    {
     "say": "Now add more structure inside the body.",
     "line": [
      1,
      10
     ]
    },
    {
     "say": "An h two is a subheading, one level below the h one.",
     "line": 1,
     "out": "About Me   ← subheading"
    },
    {
     "say": "Another paragraph.",
     "line": 2,
     "out": "I'm learning web development, one module at a time."
    },
    {
     "say": "U L opens an unordered list, a list with bullet points.",
     "line": [
      4,
      8
     ]
    },
    {
     "say": "Each L I is one item in it.",
     "line": [
      5,
      7
     ],
     "out": [
      "• HTML for structure",
      "• CSS for style",
      "• JavaScript for behavior"
     ]
    },
    {
     "say": "The image tag closes itself. Source says where the picture comes from.",
     "line": 10,
     "vars": {
      "src": "https://placehold.co/200x100"
     },
     "out": "[ 200 × 100 image ]"
    },
    {
     "say": "And alt describes it, for screen readers, and in case the image fails to load.",
     "line": 10,
     "vars": {
      "src": "https://placehold.co/200x100",
      "alt": "A placeholder image"
     }
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 4",
   "title": "A form, ready for JavaScript later",
   "nodes": [
    {
     "id": "label",
     "label": "<label>",
     "x": 15,
     "y": 30,
     "sub": "for=\"name\" · Your name:",
     "art": "pencil"
    },
    {
     "id": "input",
     "label": "<input>",
     "x": 55,
     "y": 30,
     "sub": "id=\"name\" · a text box",
     "art": "form"
    },
    {
     "id": "button",
     "label": "<button>",
     "x": 55,
     "y": 78,
     "sub": "type=\"submit\" · Say Hello",
     "art": "cursor"
    },
    {
     "id": "form",
     "label": "<form>",
     "x": 88,
     "y": 55,
     "sub": "wraps all three",
     "art": "doc"
    }
   ],
   "edges": [
    {
     "from": "label",
     "to": "input"
    },
    {
     "from": "input",
     "to": "form"
    },
    {
     "from": "button",
     "to": "form"
    }
   ],
   "beats": [
    {
     "say": "Last, a form with three parts.",
     "show": 4,
     "on": "form"
    },
    {
     "say": "The label's for attribute says name. The input's I D is also name. That match ties them together.",
     "on": [
      "label",
      "input"
     ],
     "send": {
      "from": "label",
      "to": "input",
      "label": "for=\"name\" = id=\"name\""
     }
    },
    {
     "say": "So a screen reader announces your name when the box is focused, and clicking the label focuses the box.",
     "on": "input"
    },
    {
     "say": "The button's type is submit, so clicking it submits the whole form.",
     "on": [
      "button",
      "form"
     ],
     "send": {
      "from": "button",
      "to": "form",
      "label": "submit"
     }
    },
    {
     "say": "Right now that just reloads the page. In Module 3, JavaScript takes over.",
     "on": "form"
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
   "kind": "table",
   "kicker": "Syntax at a glance",
   "title": "A selector picks which elements a rule styles",
   "columns": [
    "Tag",
    "class",
    "id",
    "Content"
   ],
   "rows": [
    [
     "h1",
     "",
     "",
     "Welcome to My Site"
    ],
    [
     "p",
     "",
     "",
     "This is a paragraph…"
    ],
    [
     "p",
     "",
     "",
     "I'm learning web development…"
    ],
    [
     "div",
     "card",
     "",
     "Item One, Two, Three"
    ],
    [
     "input",
     "",
     "name",
     "(text box)"
    ],
    [
     "button",
     "",
     "",
     "Say Hello"
    ]
   ],
   "beats": [
    {
     "say": "Here are some elements from your page, including the card you'll add in Module 4."
    },
    {
     "say": "A rule is a selector, then declarations in curly brackets: a property, a colon, a value, a semicolon.",
     "sql": "selector {\n  property: value;\n}"
    },
    {
     "say": "A plain tag name, like p, picks every paragraph. That's two rows.",
     "sql": "p { color: #222; }",
     "hl": [
      1,
      2
     ],
     "dim": true,
     "col": 0
    },
    {
     "say": "A dot and a name picks every element with that class. Only the card.",
     "sql": ".card { padding: 16px; }",
     "hl": 3,
     "dim": true,
     "col": 1
    },
    {
     "say": "A hash and a name picks the one element with that I D: the name box.",
     "sql": "#name { width: 200px; }",
     "hl": 4,
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 1",
   "title": "Read style.css one declaration at a time",
   "file": "style.css",
   "code": "body {\n  font-family: Arial, sans-serif;\n  background-color: #f4f4f4;\n  color: #222;\n  max-width: 700px;\n  margin: 0 auto;\n  padding: 20px;\n}\n\nh1 {\n  color: #2b6cb0;\n}",
   "beats": [
    {
     "say": "Create style dot css. The first rule targets the body, the whole visible page.",
     "line": [
      1,
      8
     ]
    },
    {
     "say": "Font family sets Arial, with any sans serif font as a backup.",
     "line": 2,
     "vars": {
      "font": "Arial"
     }
    },
    {
     "say": "A light grey background, and dark grey text.",
     "line": [
      3,
      4
     ],
     "vars": {
      "font": "Arial",
      "background": "#f4f4f4",
      "text colour": "#222"
     }
    },
    {
     "say": "Max width stops the page growing wider than seven hundred pixels.",
     "line": 5,
     "vars": {
      "font": "Arial",
      "background": "#f4f4f4",
      "text colour": "#222",
      "max width": "700px"
     }
    },
    {
     "say": "Margin zero auto centres it, and padding adds twenty pixels of breathing room inside.",
     "line": [
      6,
      7
     ],
     "vars": {
      "font": "Arial",
      "background": "#f4f4f4",
      "text colour": "#222",
      "max width": "700px",
      "position": "centred",
      "padding": "20px"
     }
    },
    {
     "say": "A second rule targets h one, and colours just the heading blue.",
     "line": [
      10,
      12
     ],
     "vars": {
      "font": "Arial",
      "background": "#f4f4f4",
      "text colour": "#222",
      "max width": "700px",
      "position": "centred",
      "padding": "20px",
      "h1 colour": "#2b6cb0"
     }
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 2",
   "title": "One link joins the two files",
   "nodes": [
    {
     "id": "html",
     "label": "index.html",
     "x": 15,
     "y": 25,
     "sub": "structure",
     "art": "doc"
    },
    {
     "id": "css",
     "label": "style.css",
     "x": 15,
     "y": 78,
     "sub": "presentation",
     "art": "palette"
    },
    {
     "id": "page",
     "label": "Browser",
     "x": 82,
     "y": 50,
     "sub": "the styled page",
     "art": "browser"
    }
   ],
   "edges": [
    {
     "from": "html",
     "to": "css"
    },
    {
     "from": "html",
     "to": "page"
    },
    {
     "from": "css",
     "to": "page"
    }
   ],
   "beats": [
    {
     "say": "On its own, style dot css does nothing. The HTML has to point to it.",
     "show": 2,
     "on": "css"
    },
    {
     "say": "Add a link tag inside the head of index dot html, naming the stylesheet.",
     "show": 2,
     "on": "html",
     "send": {
      "from": "html",
      "to": "css",
      "label": "<link rel=\"stylesheet\" href=\"style.css\">"
     }
    },
    {
     "say": "The browser reads your HTML for the content,",
     "show": 3,
     "on": "page",
     "send": {
      "from": "html",
      "to": "page",
      "label": "headings, list, form"
     }
    },
    {
     "say": "and the CSS file for how it should look.",
     "show": 3,
     "on": "page",
     "send": {
      "from": "css",
      "to": "page",
      "label": "font, colours, spacing"
     }
    },
    {
     "say": "Refresh, and the whole page changes, without touching a single line of HTML.",
     "show": 3,
     "on": "page"
    },
    {
     "say": "And because the styles live in their own file, many pages can share the same stylesheet.",
     "show": 3,
     "on": [
      "css",
      "html"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 3",
   "title": "Hover: a rule that waits for a state",
   "columns": [
    "Rule",
    "Property",
    "Value"
   ],
   "rows": [
    [
     "button",
     "background-color",
     "#2b6cb0"
    ],
    [
     "button",
     "color",
     "white"
    ],
    [
     "button:hover",
     "background-color",
     "#1e4e8c"
    ]
   ],
   "beats": [
    {
     "say": "Now style the form's button. Here are three of its declarations, from two rules."
    },
    {
     "say": "The button rule always applies: a blue background, and white text.",
     "hl": [
      0,
      1
     ],
     "dim": true
    },
    {
     "say": "Button colon hover is a pseudo class. It only applies while your mouse is over the button.",
     "hl": 2,
     "col": 0
    },
    {
     "say": "Mouse away: the hover rule is asleep, so the background stays blue.",
     "sql": "mouse away → background #2b6cb0",
     "hl": [
      0,
      1
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "Mouse over: both rules want to set the background, and they disagree.",
     "sql": "mouse over → ?",
     "hl": [
      0,
      2
     ],
     "col": 1
    },
    {
     "say": "The hover rule is more specific, and it comes later, so it wins. A darker blue.",
     "sql": "mouse over → background #1e4e8c",
     "hl": [
      1,
      2
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "That's the cascade: rules combine, and later or more specific ones override.",
     "hl": [
      1,
      2
     ],
     "dim": true
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 4",
   "title": "Two ul rules combine into one layout",
   "columns": [
    "Property",
    "Value",
    "From",
    "Effect"
   ],
   "rows": [
    [
     "line-height",
     "1.6",
     "Step 1",
     "Roomier lines"
    ],
    [
     "display",
     "flex",
     "Step 4",
     "Items sit side by side"
    ],
    [
     "gap",
     "12px",
     "Step 4",
     "Space between items"
    ],
    [
     "list-style",
     "none",
     "Step 4",
     "No bullet points"
    ],
    [
     "padding",
     "0",
     "Step 4",
     "No left indent"
    ]
   ],
   "beats": [
    {
     "say": "Your stylesheet now has two rules for the same list. They don't fight. They combine.",
     "col": 2
    },
    {
     "say": "Line height still comes from step one.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "Display flex is the layout property. The list items move into a row, side by side.",
     "hl": 1
    },
    {
     "say": "Gap puts twelve pixels between them.",
     "hl": 2
    },
    {
     "say": "List style none removes the bullets, and padding zero removes the usual indent.",
     "hl": [
      3,
      4
     ]
    },
    {
     "say": "All five declarations land on the same list.",
     "hl": [
      0,
      1,
      2,
      3,
      4
     ],
     "col": 3
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
     "say": "Why is CSS called cascading?",
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
   "kind": "walk",
   "kicker": "Syntax at a glance",
   "title": "Variables, functions and decisions",
   "file": "script.js",
   "code": "let x = 5;          // a variable that can change later\nconst y = \"hello\";  // a variable that cannot be reassigned\n\nfunction add(a, b) {\n  return a + b;\n}\n\nif (x > 3) {\n  console.log(\"big\");\n} else {\n  console.log(\"small\");\n}",
   "beats": [
    {
     "say": "Let makes a variable that can change later. X is five.",
     "line": 1,
     "vars": {
      "x": 5
     }
    },
    {
     "say": "Const makes one that can't be reassigned. Use const unless the value really needs to change.",
     "line": 2,
     "vars": {
      "x": 5,
      "y": "\"hello\""
     }
    },
    {
     "say": "Function defines reusable code called add. Nothing runs yet. It waits to be called by name.",
     "line": [
      4,
      6
     ]
    },
    {
     "say": "If checks a condition. Is five greater than three? Yes.",
     "line": 8
    },
    {
     "say": "So the first branch runs, and the console shows big.",
     "line": 9,
     "out": "big"
    },
    {
     "say": "The else branch is skipped entirely.",
     "line": [
      10,
      12
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 1 and 2",
   "title": "Find an element, then change it",
   "file": "script.js",
   "code": "const heading = document.querySelector(\"h1\");\nheading.textContent = \"Welcome, and thanks for stopping by!\";",
   "beats": [
    {
     "say": "Create script dot j s, and link it with a script tag just before the end of the body.",
     "line": 1
    },
    {
     "say": "Query selector finds the first element matching a selector. The same kind of selector CSS uses.",
     "line": 1,
     "vars": {
      "heading": "<h1>Welcome to My Site</h1>"
     }
    },
    {
     "say": "Setting its text content replaces the words inside it.",
     "line": 2,
     "vars": {
      "heading": "<h1>Welcome, and thanks for stopping by!</h1>"
     }
    },
    {
     "say": "Refresh, and the heading has changed. Driven by code, not by editing the HTML.",
     "line": 2
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "What happens when you press Say Hello",
   "nodes": [
    {
     "id": "user",
     "label": "You",
     "x": 8,
     "y": 50,
     "sub": "type Alex, press the button",
     "art": "cursor"
    },
    {
     "id": "form",
     "label": "<form>",
     "x": 32,
     "y": 50,
     "sub": "fires a submit event",
     "art": "form"
    },
    {
     "id": "code",
     "label": "Your listener",
     "x": 62,
     "y": 20,
     "sub": "event.preventDefault()",
     "art": "code"
    },
    {
     "id": "reload",
     "label": "Page reload",
     "x": 62,
     "y": 82,
     "sub": "the default",
     "art": "loop"
    },
    {
     "id": "page",
     "label": "The page",
     "x": 90,
     "y": 50,
     "sub": "new greeting",
     "art": "browser"
    }
   ],
   "edges": [
    {
     "from": "user",
     "to": "form"
    },
    {
     "from": "form",
     "to": "code"
    },
    {
     "from": "form",
     "to": "reload"
    },
    {
     "from": "code",
     "to": "page"
    }
   ],
   "beats": [
    {
     "say": "An event is something the browser notices, like a click, a keystroke, or a form being submitted.",
     "show": 2,
     "on": "form"
    },
    {
     "say": "You type a name and press Say Hello. The form fires a submit event.",
     "show": 2,
     "on": "form",
     "send": {
      "from": "user",
      "to": "form",
      "label": "submit"
     }
    },
    {
     "say": "Left alone, the browser's default is to reload the page, and your greeting would vanish.",
     "show": 4,
     "on": "reload",
     "send": {
      "from": "form",
      "to": "reload",
      "label": "default"
     }
    },
    {
     "say": "But you added an event listener. The browser hands the event to your function first.",
     "show": 5,
     "on": "code",
     "send": {
      "from": "form",
      "to": "code",
      "label": "event"
     }
    },
    {
     "say": "Prevent default cancels the reload, so your code decides what happens instead.",
     "show": 5,
     "on": "code"
    },
    {
     "say": "And your code updates the page directly. No reload at all.",
     "show": 5,
     "on": "page",
     "send": {
      "from": "code",
      "to": "page",
      "label": "Hello, Alex!"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 3",
   "title": "Respond to the form, line by line",
   "file": "script.js",
   "code": "const form = document.querySelector(\"form\");\n\nform.addEventListener(\"submit\", function (event) {\n  event.preventDefault();\n  const nameInput = document.querySelector(\"#name\");\n  const message = document.createElement(\"p\");\n  message.textContent = `Hello, ${nameInput.value}! Thanks for saying hi.`;\n  form.after(message);\n});",
   "beats": [
    {
     "say": "First, find the form and keep it in a constant.",
     "line": 1,
     "vars": {
      "form": "<form>"
     }
    },
    {
     "say": "Add event listener says: when this form is submitted, run this function. Nothing runs yet.",
     "line": [
      3,
      9
     ]
    },
    {
     "say": "Now you type Alex and press Say Hello. The function runs, with the event passed in.",
     "line": 3,
     "vars": {
      "form": "<form>",
      "event": "submit"
     }
    },
    {
     "say": "Prevent default stops the reload.",
     "line": 4
    },
    {
     "say": "Find the name box. Its value is whatever was typed: Alex.",
     "line": 5,
     "vars": {
      "form": "<form>",
      "event": "submit",
      "nameInput.value": "\"Alex\""
     }
    },
    {
     "say": "Create a brand new, empty paragraph element.",
     "line": 6,
     "vars": {
      "form": "<form>",
      "event": "submit",
      "nameInput.value": "\"Alex\"",
      "message": "<p></p>"
     }
    },
    {
     "say": "Fill it with the greeting, with Alex dropped into the template.",
     "line": 7,
     "vars": {
      "form": "<form>",
      "event": "submit",
      "nameInput.value": "\"Alex\"",
      "message": "<p>Hello, Alex! Thanks for saying hi.</p>"
     }
    },
    {
     "say": "Form dot after places it on the page, right after the form. It appears instantly.",
     "line": 8,
     "vars": {
      "form": "<form>",
      "event": "submit",
      "nameInput.value": "\"Alex\"",
      "message": "<p>Hello, Alex! Thanks for saying hi.</p>",
      "on the page": "Hello, Alex! Thanks for saying hi."
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 4",
   "title": "A click counter that remembers",
   "file": "script.js",
   "code": "const counterBtn = document.querySelector(\"#counter-btn\");\nlet count = 0;\n\ncounterBtn.addEventListener(\"click\", function () {\n  count = count + 1;\n  counterBtn.textContent = `Clicked ${count} times`;\n});",
   "beats": [
    {
     "say": "Find the counter button. It starts out saying clicked zero times.",
     "line": 1,
     "vars": {
      "button text": "Clicked 0 times"
     }
    },
    {
     "say": "Count starts at zero, outside the listener.",
     "line": 2,
     "vars": {
      "button text": "Clicked 0 times",
      "count": 0
     }
    },
    {
     "say": "Set up the click listener. It waits.",
     "line": [
      4,
      7
     ]
    },
    {
     "say": "First click. Count becomes one, and the text updates.",
     "line": [
      5,
      6
     ],
     "vars": {
      "button text": "Clicked 1 times",
      "count": 1
     }
    },
    {
     "say": "Second click. Count was one, so now it's two.",
     "line": [
      5,
      6
     ],
     "vars": {
      "button text": "Clicked 2 times",
      "count": 2
     }
    },
    {
     "say": "Third click. Three.",
     "line": [
      5,
      6
     ],
     "vars": {
      "button text": "Clicked 3 times",
      "count": 3
     }
    },
    {
     "say": "Count keeps its value between clicks, because it lives outside the function.",
     "line": 2
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Why it matters",
   "title": "Where you declare count changes everything",
   "columns": [
    "Click",
    "count outside the listener",
    "count inside the listener"
   ],
   "rows": [
    [
     "1st",
     "1",
     "1"
    ],
    [
     "2nd",
     "2",
     "1"
    ],
    [
     "3rd",
     "3",
     "1"
    ]
   ],
   "beats": [
    {
     "say": "Compare two versions of the counter, over three clicks."
    },
    {
     "say": "With count outside, each click builds on the last: one, two, three.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 1
    },
    {
     "say": "Move let count equals zero inside the function, and every click starts again from zero.",
     "col": 2
    },
    {
     "say": "So the button says one, every single time.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 2
    },
    {
     "say": "A variable declared inside the listener resets on every click. Outside, it persists.",
     "hl": 2,
     "dim": true,
     "col": 1
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
     "say": "What does event dot prevent default do on a form submission?",
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
   "kind": "walk",
   "kicker": "Lab · Part A",
   "title": "Say what type you expect",
   "file": "greet.ts",
   "code": "function greet(name: string, timesClicked: number): string {\n  return `Hello, ${name}! You've clicked ${timesClicked} times.`;\n}\n\nconsole.log(greet(\"Alex\", 3));\n\n// step 3: change the last line to\nconsole.log(greet(\"Alex\", \"three\"));",
   "beats": [
    {
     "say": "TypeScript is JavaScript with types. A colon after a name says what kind of value it must hold.",
     "line": 1
    },
    {
     "say": "Name must be a string. Times clicked must be a number. And the colon after the brackets says the function returns a string.",
     "line": 1,
     "vars": {
      "name": "string",
      "timesClicked": "number",
      "returns": "string"
     }
    },
    {
     "say": "Call it with Alex and three. Both match their types.",
     "line": 5,
     "vars": {
      "name": "\"Alex\"",
      "timesClicked": 3,
      "returns": "string"
     }
    },
    {
     "say": "The template fills in both, and the console shows the greeting.",
     "line": 2,
     "out": "Hello, Alex! You've clicked 3 times."
    },
    {
     "say": "Now step three. Pass the word three, in quotes, instead of the number.",
     "line": 8,
     "vars": {
      "name": "\"Alex\"",
      "timesClicked": "\"three\"",
      "returns": "string"
     }
    },
    {
     "say": "That's a string where a number was expected, and TypeScript flags it.",
     "line": [
      1,
      8
     ],
     "out": "error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Part A",
   "title": "Browsers never run TypeScript",
   "nodes": [
    {
     "id": "ts",
     "label": "greet.ts",
     "x": 12,
     "y": 50,
     "sub": "your TypeScript",
     "art": "file"
    },
    {
     "id": "tsc",
     "label": "tsc",
     "x": 45,
     "y": 50,
     "sub": "the TypeScript compiler",
     "art": "gear"
    },
    {
     "id": "js",
     "label": "greet.js",
     "x": 80,
     "y": 22,
     "sub": "plain JavaScript",
     "art": "file"
    },
    {
     "id": "err",
     "label": "Error report",
     "x": 80,
     "y": 80,
     "sub": "read it, fix it",
     "art": "bug"
    }
   ],
   "edges": [
    {
     "from": "ts",
     "to": "tsc"
    },
    {
     "from": "tsc",
     "to": "js"
    },
    {
     "from": "tsc",
     "to": "err"
    }
   ],
   "beats": [
    {
     "say": "Install TypeScript with N P M, then run t s c greet dot t s.",
     "show": 2,
     "on": "tsc",
     "send": {
      "from": "ts",
      "to": "tsc",
      "label": "tsc greet.ts"
     }
    },
    {
     "say": "The compiler checks every type, then writes greet dot j s, plain JavaScript a browser can run.",
     "show": 3,
     "on": "js",
     "send": {
      "from": "tsc",
      "to": "js",
      "label": "greet.js"
     }
    },
    {
     "say": "With the word three, it reports the error instead, while you're still writing code, long before any user.",
     "show": 4,
     "on": "err",
     "send": {
      "from": "tsc",
      "to": "err",
      "label": "string ≠ number"
     }
    },
    {
     "say": "Careful: by default, it still writes greet dot j s anyway. So always read the errors.",
     "show": 4,
     "on": [
      "js",
      "err"
     ],
     "send": {
      "from": "tsc",
      "to": "js",
      "label": "greet.js, written anyway"
     }
    },
    {
     "say": "To make it refuse while errors exist, add the no emit on error option.",
     "show": 4,
     "on": "tsc",
     "send": {
      "from": "ts",
      "to": "tsc",
      "label": "tsc --noEmitOnError greet.ts"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Part B",
   "title": "A media query only applies when its condition is true",
   "file": "style.css",
   "code": ".card {\n  display: flex;\n  gap: 16px;\n}\n\n@media (max-width: 600px) {\n  .card {\n    flex-direction: column;\n  }\n}",
   "beats": [
    {
     "say": "Now responsive design. Add a card with three items to your page.",
     "line": [
      1,
      4
     ]
    },
    {
     "say": "On a wide screen, say a thousand pixels, the card is a flex row: items side by side, sixteen pixels apart.",
     "line": [
      1,
      4
     ],
     "vars": {
      "screen width": "1000px",
      "flex-direction": "row (default)"
     },
     "out": "[ Item One ]  [ Item Two ]  [ Item Three ]"
    },
    {
     "say": "The media query asks: is the screen six hundred pixels wide or less? Not at a thousand, so its rules are skipped.",
     "line": 6
    },
    {
     "say": "Now narrow the window to four hundred pixels.",
     "line": 6,
     "vars": {
      "screen width": "400px",
      "flex-direction": "row (default)"
     }
    },
    {
     "say": "Four hundred is six hundred or less, so the condition is true, and the rule inside switches on.",
     "line": [
      6,
      8
     ],
     "vars": {
      "screen width": "400px",
      "flex-direction": "column"
     }
    },
    {
     "say": "The items now stack vertically.",
     "line": 8,
     "out": [
      "[ Item One ]",
      "[ Item Two ]",
      "[ Item Three ]"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 5",
   "title": "Why phones need the viewport tag",
   "columns": [
    "Viewport tag?",
    "Phone lays out the page at",
    "max-width: 600px?",
    "What you see"
   ],
   "rows": [
    [
     "No",
     "about 980px, then zooms out",
     "No",
     "A tiny desktop layout"
    ],
    [
     "Yes",
     "the device's real width, e.g. 375px",
     "Yes",
     "Items stacked, readable"
    ]
   ],
   "beats": [
    {
     "say": "There's a catch on real phones."
    },
    {
     "say": "Without the viewport tag, a mobile browser pretends to be a desktop, about nine hundred eighty pixels wide, then shrinks it to fit.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "Nine hundred eighty is wider than six hundred, so your media query never switches on. You get a tiny desktop layout.",
     "hl": 0,
     "dim": true,
     "col": 2
    },
    {
     "say": "Add the viewport tag inside the head.",
     "sql": "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
    },
    {
     "say": "Now the phone uses its real width, like three hundred seventy five pixels.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "That's under six hundred, so the media query applies, and the items stack, readable.",
     "hl": 1,
     "dim": true,
     "col": 3
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
     "say": "Does a browser run dot t s files directly?",
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
