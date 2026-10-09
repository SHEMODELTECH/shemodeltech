<!-- order: 2 -->
# No-Code Website and CMS Developer (Webflow): Hands-On Project Tutorials

This course turns each project into a step-by-step, hands-on build. You learn each idea at the moment you need it, while building the thing, and every project hands its result to the next one, ending in a live, content-managed website. Follow the projects in order.

**By the end of this course, you'll be able to:**
- Build a responsive page with sections, containers, and flexbox that stacks on mobile
- Create a reusable style system with classes, combo classes, color swatches, and components
- Build site navigation with shared navbar and footer components and a mobile menu
- Set up a CMS collection with a collection list and a template page for each item
- Add tasteful interactions and a validated contact form, and test it end to end
- Set SEO titles, alt text, and image sizes, then publish to a live webflow.io address

**Plan check:** Every required step in this course works on Webflow's free Starter site plan, which you get when you create a site. The free plan has a very small limit on static pages, caps on CMS items and form submissions, and publishes only to a free `webflow.io` subdomain; check Webflow's current plan page, because limits change. This course is designed to need only two static pages (Home and Contact) plus a CMS template page. These parts need a paid site plan and are marked optional: extra static pages (separate About and Work pages) in Project 3, and connecting a custom domain in Project 6.

---

## Project 1 (Module 1): Build Your First Structured Page

**Goal:** Build one clean, responsive page and understand the box model that all web layout relies on.

**Time:** about 2 hours

**Step 1: Create your Webflow account and a blank site.**
Go to webflow.com, sign up for a free account, and create a new blank site named `portfolio-site`. It starts on the free Starter plan, which is all you need. Starting blank rather than from a template forces you to learn how layout actually works.

**Step 2: Understand the box model.**
Every element on a page is a box with four layers: content, padding (space inside), a border, and margin (space outside). Almost every spacing problem in web design comes down to padding or margin.

**Step 3: Understand div blocks.**
A div block is an empty container box you use to group and arrange other elements. Structured pages are built from nested containers, and divs are the skeleton everything else hangs on.

**Step 4: Add a section and a container.**
Drag in a Section, then a Container inside it, and add a heading and a paragraph inside the container. Section then container is the standard pattern for full-width backgrounds with centred, readable content.

**Step 5: Understand flexbox.**
Flexbox is a layout mode that arranges child elements in a row or column and controls their spacing and alignment. Learning it once unlocks navbars, card rows, and centred content everywhere.

**Step 6: Build a two-column layout with flexbox.**
Set a div to Display: Flex, add two child divs, and use gap and alignment to space them evenly. Two-column layouts, like text beside an image, are everywhere, and flexbox makes them responsive by default.

**Step 7: Understand breakpoints.**
A breakpoint is a screen width at which your design changes. Webflow has desktop, tablet, and mobile views that you edit separately, which is how you make one page look right on every device.

**Step 8: Preview and check responsiveness.**
Use the responsive preview to check tablet and mobile, then adjust the flex layout so the columns stack on mobile. Stacking columns on small screens is the single most common responsive fix.

### Project Structure
```text
portfolio-site (Webflow)
│
└── Home (page)
    └── Section
        └── Container (flex)
            ├── Column div (heading + paragraph)
            └── Column div (image or text)
```

### What You Learned
- ✅ The box model: content, padding, border, margin
- ✅ Structuring pages with sections, containers, and divs
- ✅ Building layouts with flexbox
- ✅ What breakpoints are and editing per device
- ✅ Making columns stack responsively on mobile

### Portfolio Project
**Structured Responsive Page**: Built a clean, responsive page from scratch using the box model, flexbox, and per-breakpoint editing.
**Skills:** Webflow, Box Model, Flexbox, Responsive Design, Web Layout.

**Deliverable:** A responsive page built from scratch that stacks correctly on mobile.

### Quiz

1. What is the difference between padding and margin?
2. Why do you put a Container inside a Section?
3. What does setting a div to Display: Flex let you control?
4. What is a breakpoint, and what is the most common fix you make at the mobile breakpoint?

*Answers: 1) Padding is space inside an element's border; margin is space outside it, between the element and its neighbours. 2) The Section gives a full-width band (for backgrounds) while the Container keeps the content centred and at a readable width. 3) How its child elements are arranged in a row or column, plus their spacing and alignment. 4) A screen width where the design can change; the most common fix is making side-by-side columns stack vertically.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "layout",
   "kicker": "Project 1 · Your first structured page",
   "title": "Boxes all the way down",
   "beats": [
    {
     "say": "Welcome to No-Code Website and C M S Developer, with Webflow."
    },
    {
     "say": "Across six projects you'll build a live, content-managed website. First, one clean, responsive page."
    },
    {
     "say": "Sign up at webflow dot com, and create a blank site called portfolio site, on the free Starter plan."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept · Step 2",
   "title": "Every element is a box with four layers",
   "columns": [
    "Layer",
    "What it is",
    "Where"
   ],
   "rows": [
    [
     "Content",
     "The element itself",
     "Centre"
    ],
    [
     "Padding",
     "Space inside",
     "Inside the border"
    ],
    [
     "Border",
     "The edge",
     "Around the padding"
    ],
    [
     "Margin",
     "Space outside",
     "Outside the border"
    ]
   ],
   "beats": [
    {
     "say": "Every element on a page is a box, built from four layers."
    },
    {
     "say": "In the middle is the content itself: the text or the image.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Around it is padding, the space inside the box.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "Then the border, the box's edge.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "And outside the border, margin: the space between this box and its neighbours.",
     "hl": 3,
     "dim": true
    },
    {
     "say": "Almost every spacing problem comes down to these two: padding inside, margin outside.",
     "hl": [
      1,
      3
     ],
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 3 and 4",
   "title": "Section, then container, then columns",
   "nodes": [
    {
     "id": "home",
     "label": "Home",
     "x": 12,
     "y": 50,
     "sub": "page",
     "art": "browser"
    },
    {
     "id": "sec",
     "label": "Section",
     "x": 36,
     "y": 50,
     "sub": "full-width band"
    },
    {
     "id": "con",
     "label": "Container",
     "x": 62,
     "y": 50,
     "sub": "centred, flex"
    },
    {
     "id": "c1",
     "label": "Column div",
     "x": 88,
     "y": 22,
     "sub": "heading + paragraph"
    },
    {
     "id": "c2",
     "label": "Column div",
     "x": 88,
     "y": 78,
     "sub": "image or text"
    }
   ],
   "edges": [
    {
     "from": "home",
     "to": "sec"
    },
    {
     "from": "sec",
     "to": "con"
    },
    {
     "from": "con",
     "to": "c1"
    },
    {
     "from": "con",
     "to": "c2"
    }
   ],
   "beats": [
    {
     "say": "A div block is an empty box for grouping things. Pages are built from boxes nested inside boxes.",
     "show": 1
    },
    {
     "say": "On your Home page, drag in a Section. It's a full-width band, perfect for backgrounds.",
     "show": 2,
     "on": "sec"
    },
    {
     "say": "Inside it goes a Container, which keeps your content centred and at a readable width.",
     "show": 3,
     "on": "con"
    },
    {
     "say": "Inside the container, add two column divs. The first holds a heading and a paragraph.",
     "show": 4,
     "on": "c1"
    },
    {
     "say": "The second holds an image or more text. That's the whole skeleton of the page.",
     "show": 5,
     "on": "c2"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Steps 5 and 6",
   "title": "Two columns with flexbox",
   "values": [
    "Container div",
    "Display: Flex",
    "Child div 1",
    "Child div 2",
    "Gap",
    "Alignment"
   ],
   "beats": [
    {
     "say": "Flexbox arranges a box's children in a row or a column, and controls their spacing and alignment."
    },
    {
     "say": "Select the container div.",
     "hl": 0,
     "ptr": {
      "now": 0
     }
    },
    {
     "say": "Set its Display to Flex. Its children now sit side by side in a row.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "now": 1
     },
     "note": "Children line up in a row"
    },
    {
     "say": "Add the two child divs, one for each column.",
     "ok": [
      0,
      1
     ],
     "hl": [
      2,
      3
     ],
     "ptr": {
      "now": 2
     }
    },
    {
     "say": "Add a gap, so the columns don't touch.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "hl": 4,
     "ptr": {
      "now": 4
     }
    },
    {
     "say": "And set the alignment, so they line up evenly. Text beside an image, done.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5
     ],
     "ptr": {
      "now": 5
     },
     "note": "Two even columns"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 7 and 8",
   "title": "One page, three breakpoints",
   "columns": [
    "View",
    "Columns",
    "What you do"
   ],
   "rows": [
    [
     "Desktop",
     "Side by side",
     "Design here first"
    ],
    [
     "Tablet",
     "Side by side",
     "Preview and check"
    ],
    [
     "Mobile",
     "Stacked",
     "Flex direction: column"
    ]
   ],
   "beats": [
    {
     "say": "A breakpoint is a screen width where your design can change. Webflow gives you desktop, tablet and mobile views."
    },
    {
     "say": "On desktop, your two columns sit side by side.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Switch to tablet in the responsive preview. They still fit, so just check it looks right.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "On mobile, side-by-side columns get squashed, so change the flex direction to column, and they stack.",
     "hl": 2,
     "dim": true,
     "col": 1
    },
    {
     "say": "Stacking columns on small screens is the single most common responsive fix.",
     "hl": 2,
     "col": 2
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What's the difference between padding and margin?",
   "options": [
    "Padding is outside the border; margin is inside",
    "They're the same thing",
    "Padding is space inside the border; margin is space outside it"
   ],
   "answer": 2,
   "good": "That's right. Padding is space inside an element's border. Margin is space outside it, between the element and its neighbours.",
   "bad": "Not quite. Padding is space inside an element's border. Margin is space outside it, between the element and its neighbours.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What's the difference between padding and margin?",
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
     "A responsive page built from scratch",
     ""
    ],
    [
     "Columns stack on mobile",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 1.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a responsive page built from scratch,",
     "show": 1
    },
    {
     "say": "that stacks correctly on mobile.",
     "show": 2
    },
    {
     "say": "Next, in Module 2, a reusable style system.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 2 (Module 2): Design a Reusable Style System

**Goal:** Build a consistent visual system with reusable classes, so your whole site stays coherent.

**Time:** about 2 hours

**Step 1: Understand classes.**
A class is a named bundle of styles you apply to elements, and every element with that class shares those styles. Classes are the difference between a site you can maintain and one you cannot.

**Step 2: Create a base text style.**
Style a paragraph (font, size, colour, line height) and give it the class `body-text`. Defining text once and reusing it keeps your typography consistent across the site.

**Step 3: Understand combo classes.**
A combo class adds a variation on top of a base class, like `button` plus `button-large`. It lets you build variations without duplicating styles.

**Step 4: Build a button system.**
Create a `button` class, then combo classes `button-primary` and `button-secondary` for colour variants. Now every button matches and updates together.

**Step 5: Understand color swatches.**
A color swatch is a saved, named colour you reuse, and changing the swatch updates every element that uses it. This is how you rebrand a whole site in minutes.

**Step 6: Define your palette as swatches.**
Save your brand colours as swatches (primary, secondary, text, background) and apply them through your classes. A defined palette keeps a site from looking like a patchwork of slightly different colours.

**Step 7: Build a reusable card component.**
Create a card (image, heading, text, button) styled with your classes, and save it as a Component. Components let you reuse a whole block and edit every copy at once.

**Step 8: Document your style system.**
List your classes, swatches, and components in a notes doc. This is what lets you or a teammate extend the site later without breaking its consistency.

### Project Structure
```text
Style system
│
├── Classes: body-text, button (+ button-primary / button-secondary)
├── Swatches: primary, secondary, text, background
├── Component: Card
└── style_system.md
```

### What You Learned
- ✅ What classes and combo classes are
- ✅ Building reusable text and button systems
- ✅ Using color swatches for site-wide consistency
- ✅ Creating reusable components
- ✅ Documenting a style system

### Portfolio Project
**Reusable Style System**: Built a consistent, maintainable design system of classes, swatches, and components.
**Skills:** Webflow Classes, Design Systems, Components, Visual Consistency.

**Deliverable:** A documented style system with reusable classes, a color palette, and at least one component.

### Quiz

1. Why use a class instead of styling each element one by one?
2. What does a combo class like `button-primary` add on top of the base `button` class?
3. What happens to your site when you change the value of a color swatch?
4. What is the benefit of saving the card as a Component?

*Answers: 1) Every element with the class shares its styles, so one change updates them all and the site stays consistent. 2) A variation, such as a different colour, while reusing all the base button styles without duplicating them. 3) Every element that uses that swatch updates to the new colour. 4) You can reuse the whole card block and editing the component updates every copy at once.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "blueprint",
   "kicker": "Project 2 · Style system",
   "title": "Style once, reuse everywhere",
   "beats": [
    {
     "say": "Welcome to Project 2."
    },
    {
     "say": "A class is a named bundle of styles. Every element with that class shares them, so one change updates them all."
    },
    {
     "say": "Classes are the difference between a site you can maintain and one you can't."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 1 and 2",
   "title": "One class, many elements",
   "nodes": [
    {
     "id": "cls",
     "label": "body-text",
     "x": 14,
     "y": 50,
     "sub": "font, size, colour",
     "art": "palette"
    },
    {
     "id": "p1",
     "label": "Hero paragraph",
     "x": 82,
     "y": 18,
     "sub": "Home"
    },
    {
     "id": "p2",
     "label": "About paragraph",
     "x": 82,
     "y": 50,
     "sub": "Home"
    },
    {
     "id": "p3",
     "label": "Contact paragraph",
     "x": 82,
     "y": 82,
     "sub": "Contact"
    }
   ],
   "edges": [
    {
     "from": "cls",
     "to": "p1"
    },
    {
     "from": "cls",
     "to": "p2"
    },
    {
     "from": "cls",
     "to": "p3"
    }
   ],
   "beats": [
    {
     "say": "Style one paragraph: its font, size, colour and line height. Save that as a class called body text.",
     "show": 1,
     "on": "cls"
    },
    {
     "say": "Give another paragraph the same class, and it picks up the same styles.",
     "show": 2,
     "send": {
      "from": "cls",
      "to": "p1",
      "label": "body-text"
     }
    },
    {
     "say": "And another, and another. You never restyle them one by one.",
     "show": 4,
     "on": [
      "p2",
      "p3"
     ],
     "send": {
      "from": "cls",
      "to": "p3",
      "label": "body-text"
     }
    },
    {
     "say": "Now change the class's line height once, and every paragraph using it updates together.",
     "show": 4,
     "on": [
      "p1",
      "p2",
      "p3"
     ],
     "send": {
      "from": "cls",
      "to": "p2",
      "label": "new line height"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 3 and 4",
   "title": "Combo classes: a base, plus a variation",
   "columns": [
    "Class",
    "Built on",
    "Adds"
   ],
   "rows": [
    [
     "button",
     "(base class)",
     "Shared button styles"
    ],
    [
     "button-primary",
     "button",
     "Primary colour"
    ],
    [
     "button-secondary",
     "button",
     "Secondary colour"
    ],
    [
     "button-large",
     "button",
     "A bigger size"
    ]
   ],
   "beats": [
    {
     "say": "First, create a base class called button, with the styles every button shares.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "A combo class adds a variation on top of a base class, without copying its styles.",
     "sql": "combo class = base class + one variation"
    },
    {
     "say": "Button primary is button, plus the primary colour.",
     "hl": 1,
     "dim": true,
     "col": 2
    },
    {
     "say": "Button secondary is button, plus the secondary colour.",
     "hl": 2,
     "dim": true,
     "col": 2
    },
    {
     "say": "The same idea works for size, like a large button.",
     "hl": 3,
     "dim": true,
     "col": 2
    },
    {
     "say": "Every one is built on button, so change the base, and every button updates together.",
     "hl": [
      0,
      1,
      2,
      3
     ],
     "col": 1
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 5 and 6",
   "title": "Change a swatch, rebrand the site",
   "nodes": [
    {
     "id": "sw",
     "label": "primary swatch",
     "x": 12,
     "y": 50,
     "sub": "a saved colour",
     "art": "palette"
    },
    {
     "id": "cls",
     "label": "button-primary",
     "x": 46,
     "y": 50,
     "sub": "uses the swatch"
    },
    {
     "id": "b1",
     "label": "Hero button",
     "x": 86,
     "y": 18,
     "sub": "Home"
    },
    {
     "id": "b2",
     "label": "Card button",
     "x": 86,
     "y": 50,
     "sub": "Work section"
    },
    {
     "id": "b3",
     "label": "Send button",
     "x": 86,
     "y": 82,
     "sub": "Contact"
    }
   ],
   "edges": [
    {
     "from": "sw",
     "to": "cls"
    },
    {
     "from": "cls",
     "to": "b1"
    },
    {
     "from": "cls",
     "to": "b2"
    },
    {
     "from": "cls",
     "to": "b3"
    }
   ],
   "beats": [
    {
     "say": "A color swatch is a saved, named colour. Save four: primary, secondary, text and background.",
     "show": 1,
     "on": "sw"
    },
    {
     "say": "Then apply them through your classes. Button primary takes its colour from the primary swatch.",
     "show": 2,
     "send": {
      "from": "sw",
      "to": "cls",
      "label": "primary"
     }
    },
    {
     "say": "And that class is on buttons all over the site.",
     "show": 5,
     "on": [
      "b1",
      "b2",
      "b3"
     ]
    },
    {
     "say": "Now edit the primary swatch to a new colour.",
     "show": 5,
     "on": "sw",
     "send": {
      "from": "sw",
      "to": "cls",
      "label": "new colour"
     }
    },
    {
     "say": "Every element using it updates at once. That's how you rebrand a whole site in minutes.",
     "show": 5,
     "on": [
      "b1",
      "b2",
      "b3"
     ],
     "send": {
      "from": "cls",
      "to": "b2",
      "label": "new colour"
     }
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Step 7",
   "title": "Build a card, save it as a Component",
   "values": [
    "Image",
    "Heading",
    "Text",
    "Button",
    "Save as Component"
   ],
   "beats": [
    {
     "say": "A card is four pieces, each styled with the classes you've already made."
    },
    {
     "say": "An image, and a heading.",
     "hl": [
      0,
      1
     ]
    },
    {
     "say": "Some text, using body text. And a button, using button primary.",
     "ok": [
      0,
      1
     ],
     "hl": [
      2,
      3
     ]
    },
    {
     "say": "Now save the whole card as a Component.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "hl": 4,
     "note": "One block, reusable anywhere"
    },
    {
     "say": "Drop copies anywhere. Edit the component once, and every copy changes with it.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "note": "Edit once → every copy updates"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 8",
   "title": "Write the system down",
   "columns": [
    "Type",
    "What you list"
   ],
   "rows": [
    [
     "Classes",
     "body-text, button"
    ],
    [
     "Combo classes",
     "-primary, -secondary"
    ],
    [
     "Swatches",
     "primary, secondary, …"
    ],
    [
     "Components",
     "Card"
    ]
   ],
   "beats": [
    {
     "say": "Last, list everything in a notes doc, called style system dot m d.",
     "sql": "style_system.md"
    },
    {
     "say": "Your classes, and the combo classes built on them.",
     "hl": [
      0,
      1
     ],
     "dim": true
    },
    {
     "say": "Your four swatches.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "And your components, starting with the card.",
     "hl": 3,
     "dim": true
    },
    {
     "say": "That's what lets you, or a teammate, extend the site later without breaking its consistency.",
     "hl": [
      0,
      1,
      2,
      3
     ]
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What happens when you change the value of a color swatch?",
   "options": [
    "Every element that uses that swatch updates to the new colour",
    "Only new elements get the colour",
    "Webflow creates a second swatch"
   ],
   "answer": 0,
   "good": "That's right. Every element that uses that swatch updates to the new colour.",
   "bad": "Not quite. Every element that uses that swatch updates to the new colour.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What happens when you change the value of a color swatch?",
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
     "Reusable, documented classes",
     ""
    ],
    [
     "A swatch palette",
     ""
    ],
    [
     "At least one component",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 2.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a documented style system with reusable classes,",
     "show": 1
    },
    {
     "say": "a colour palette,",
     "show": 2
    },
    {
     "say": "and at least one component.",
     "show": 3
    },
    {
     "say": "Next, in Module 3, a multi-page site with navigation.",
     "show": 3
    }
   ]
  }
 ]
}
```

---

## Project 3 (Module 3): Build a Multi-Page Site with Navigation

**Goal:** Turn a single page into a real, navigable website with shared navigation, within the free plan's page limit.

**Time:** about 2.5 hours

**Step 1: Plan your pages within the free limit.**
The free Starter plan allows very few static pages (check the current plan). So the free path uses just two static pages: `Home` and `Contact`. Instead of separate About and Work pages, add two sections to Home and give them the IDs `about` and `work` (Element settings, ID field). In Project 4 a CMS template page will add one real page per project, which does not count as a static page. Planning pages up front keeps navigation simple.

*Optional (needs a paid site plan):* if your site is on a paid plan, you can make `About` and `Work` separate pages instead. The rest of the course works either way.

**Step 2: Understand the navbar.**
A navbar is the navigation bar, usually at the top, that links to your main pages and sections. It is how users move around your site and one of the strongest signals of a well-built site.

**Step 3: Build and style the navbar.**
Add the Navbar element with four links: Home (the Home page), About and Work (link type Section, pointing to the `about` and `work` sections on Home), and Contact (the Contact page). Style it with your Project 2 classes so it stays consistent with the rest of the site.

**Step 4: Understand shared components.**
A shared component appears on every page but is edited in one place. A navbar and footer should be identical everywhere, so making them components means one edit updates every page.

**Step 5: Make the navbar and footer components.**
Convert your navbar and a footer into components and place them on Home and Contact (and later on the CMS template page). This guarantees consistency and saves you from updating the same navbar on every page by hand.

**Step 6: Show the current page.**
The Current state styles the nav link for the page you are on, so users always know where they are. Style the Current state of your Home and Contact links. It is a small touch that makes navigation feel intentional.

**Step 7: Add responsive mobile navigation.**
Configure the navbar's mobile menu (the hamburger) and test it at mobile width. Desktop navbars do not fit phones, and most visits are on phones.

**Step 8: Test all navigation.**
Click through every link on every page, on desktop and mobile, including the About and Work section links from the Contact page. Broken links are the most noticeable flaw a visitor can hit, and a quick full click-through catches them.

### Project Structure
```text
Site (free plan path)
│
├── Pages: Home (with #about and #work sections), Contact
├── Navbar (component, on every page, with current state)
├── Footer (component, on every page)
└── Mobile menu tested

Optional (paid site plan): separate About and Work pages
```

### What You Learned
- ✅ Planning a site's pages within a plan's limits
- ✅ What a navbar is and how to link it to pages and page sections
- ✅ Using components for site-wide shared elements
- ✅ Showing the current page in navigation
- ✅ Building and testing responsive mobile navigation

### Portfolio Project
**Navigable Website**: Built a consistent website with shared components, section links, and working responsive navigation.
**Skills:** Webflow, Site Structure, Navigation, Components, Responsive Design.

**Deliverable:** A site with a Home page (About and Work sections) and a Contact page, a consistent navbar and footer, and working mobile navigation.

### Quiz

1. On the free plan, how does this project fit About and Work content within the static page limit?
2. Why make the navbar and footer components?
3. What does the Current state on a nav link do?
4. Why test navigation at mobile width as well as desktop?

*Answers: 1) About and Work become sections on the Home page with IDs, and the navbar links to those sections. 2) So they are identical on every page and one edit updates them everywhere. 3) It styles the link for the page you are currently on, so visitors know where they are. 4) Desktop navbars do not fit phones, so the mobile menu must be checked separately, and most visits are on phones.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "compass",
   "kicker": "Project 3 · Navigation",
   "title": "From one page to a real site",
   "beats": [
    {
     "say": "Welcome to Project 3."
    },
    {
     "say": "Now your single page becomes a navigable website, within the free plan's page limit."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 1",
   "title": "Plan pages inside the free limit",
   "columns": [
    "Content",
    "Built as",
    "Static page?"
   ],
   "rows": [
    [
     "Home",
     "Static page",
     "Yes"
    ],
    [
     "Contact",
     "Static page",
     "Yes"
    ],
    [
     "About",
     "Home section, #about",
     "No"
    ],
    [
     "Work",
     "Home section, #work",
     "No"
    ],
    [
     "Each project",
     "CMS template page",
     "No"
    ]
   ],
   "beats": [
    {
     "say": "The free Starter plan allows only a few static pages, so plan them first."
    },
    {
     "say": "You'll use just two static pages: Home and Contact.",
     "hl": [
      0,
      1
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "About and Work become sections on Home, with the I Ds about and work, set in Element settings.",
     "hl": [
      2,
      3
     ],
     "dim": true,
     "col": 1
    },
    {
     "say": "And in Project 4, a C M S template gives every project its own page, without counting as a static page.",
     "hl": 4,
     "dim": true
    },
    {
     "say": "On a paid plan, About and Work could be separate pages instead. The course works either way.",
     "hl": [
      2,
      3
     ]
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 2 and 3",
   "title": "Four links, two kinds",
   "nodes": [
    {
     "id": "nav",
     "label": "Navbar",
     "x": 50,
     "y": 15,
     "sub": "4 links",
     "art": "compass"
    },
    {
     "id": "home",
     "label": "Home page",
     "x": 12,
     "y": 55
    },
    {
     "id": "about",
     "label": "#about",
     "x": 36,
     "y": 85,
     "sub": "section on Home"
    },
    {
     "id": "work",
     "label": "#work",
     "x": 64,
     "y": 85,
     "sub": "section on Home"
    },
    {
     "id": "contact",
     "label": "Contact page",
     "x": 88,
     "y": 55
    }
   ],
   "edges": [
    {
     "from": "nav",
     "to": "home"
    },
    {
     "from": "nav",
     "to": "about"
    },
    {
     "from": "nav",
     "to": "work"
    },
    {
     "from": "nav",
     "to": "contact"
    }
   ],
   "beats": [
    {
     "say": "The navbar is how visitors move around your site. Add the Navbar element, styled with your Project 2 classes.",
     "show": 1,
     "on": "nav"
    },
    {
     "say": "Home links to the Home page.",
     "show": 2,
     "send": {
      "from": "nav",
      "to": "home",
      "label": "Page link"
     }
    },
    {
     "say": "About uses the link type Section, pointing at the about section on Home.",
     "show": 3,
     "send": {
      "from": "nav",
      "to": "about",
      "label": "Section link"
     }
    },
    {
     "say": "Work does the same, pointing at the work section.",
     "show": 4,
     "send": {
      "from": "nav",
      "to": "work",
      "label": "Section link"
     }
    },
    {
     "say": "And Contact links to the Contact page.",
     "show": 5,
     "send": {
      "from": "nav",
      "to": "contact",
      "label": "Page link"
     }
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 4 and 5",
   "title": "Shared components: edit once, update everywhere",
   "nodes": [
    {
     "id": "nav",
     "label": "Navbar",
     "x": 14,
     "y": 30,
     "sub": "component",
     "art": "blocks"
    },
    {
     "id": "foot",
     "label": "Footer",
     "x": 14,
     "y": 72,
     "sub": "component",
     "art": "blocks"
    },
    {
     "id": "home",
     "label": "Home",
     "x": 84,
     "y": 18,
     "sub": "page"
    },
    {
     "id": "contact",
     "label": "Contact",
     "x": 84,
     "y": 50,
     "sub": "page"
    },
    {
     "id": "tmpl",
     "label": "Project template",
     "x": 84,
     "y": 82,
     "sub": "added in Project 4"
    }
   ],
   "edges": [
    {
     "from": "nav",
     "to": "home"
    },
    {
     "from": "nav",
     "to": "contact"
    },
    {
     "from": "nav",
     "to": "tmpl"
    },
    {
     "from": "foot",
     "to": "home"
    },
    {
     "from": "foot",
     "to": "contact"
    },
    {
     "from": "foot",
     "to": "tmpl"
    }
   ],
   "beats": [
    {
     "say": "A navbar and footer should be identical on every page, so turn both into components.",
     "show": 2,
     "on": [
      "nav",
      "foot"
     ]
    },
    {
     "say": "Place them on Home and on Contact.",
     "show": 4,
     "on": [
      "home",
      "contact"
     ],
     "send": {
      "from": "nav",
      "to": "home",
      "label": "Navbar"
     }
    },
    {
     "say": "Later, they go on the C M S template page too.",
     "show": 5,
     "on": "tmpl",
     "send": {
      "from": "foot",
      "to": "tmpl",
      "label": "Footer"
     }
    },
    {
     "say": "Now change a link in the navbar component, once.",
     "show": 5,
     "on": "nav"
    },
    {
     "say": "Every page gets the change. No updating the same navbar by hand.",
     "show": 5,
     "on": [
      "home",
      "contact",
      "tmpl"
     ],
     "send": {
      "from": "nav",
      "to": "contact",
      "label": "updated"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 6",
   "title": "The Current state shows where you are",
   "columns": [
    "You're on",
    "Home link",
    "Contact link"
   ],
   "rows": [
    [
     "Home page",
     "Current style",
     "Normal"
    ],
    [
     "Contact page",
     "Normal",
     "Current style"
    ]
   ],
   "beats": [
    {
     "say": "The Current state styles the nav link for the page you're on."
    },
    {
     "say": "On the Home page, the Home link shows its Current style.",
     "hl": 0,
     "dim": true,
     "col": 1
    },
    {
     "say": "On the Contact page, the Contact link does instead.",
     "hl": 1,
     "dim": true,
     "col": 2
    },
    {
     "say": "Style the Current state of both links. It's a small touch, but visitors always know where they are.",
     "hl": [
      0,
      1
     ]
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Steps 7 and 8",
   "title": "Click every link, on desktop and mobile",
   "values": [
    "Home → Home",
    "Home → About",
    "Home → Work",
    "Home → Contact",
    "Contact → About",
    "Contact → Work",
    "Contact → Home",
    "Mobile menu"
   ],
   "beats": [
    {
     "say": "Desktop navbars don't fit phones, so set up the navbar's mobile menu, the hamburger.",
     "hl": 7
    },
    {
     "say": "Then test. From Home, click each of the four links.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "ptr": {
      "from": 0
     }
    },
    {
     "say": "From Contact, try About and Work too. Those section links have to jump back to Home.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5
     ],
     "hl": [
      4,
      5
     ],
     "ptr": {
      "from": 4
     }
    },
    {
     "say": "And back to Home.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
     ],
     "ptr": {
      "from": 6
     }
    },
    {
     "say": "Finally, repeat it at mobile width, through the hamburger menu. Most visits are on phones.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7
     ],
     "ptr": {
      "from": 7
     },
     "note": "Every link works, everywhere"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why make the navbar and footer components?",
   "options": [
    "Components load faster",
    "So they're identical everywhere and one edit updates every page",
    "Webflow requires it for links"
   ],
   "answer": 1,
   "good": "That's right. Components keep them identical on every page, and one edit updates them everywhere.",
   "bad": "Not quite. Components keep them identical on every page, and one edit updates them everywhere.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why make the navbar and footer components?",
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
     "Home with sections, plus Contact",
     ""
    ],
    [
     "Shared navbar and footer",
     ""
    ],
    [
     "Working mobile navigation",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 3.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a Home page with About and Work sections, and a Contact page,",
     "show": 1
    },
    {
     "say": "a consistent navbar and footer,",
     "show": 2
    },
    {
     "say": "and working mobile navigation.",
     "show": 3
    },
    {
     "say": "Next, in Module 4, a C M S for dynamic content.",
     "show": 3
    }
   ]
  }
 ]
}
```

---

## Project 4 (Module 4): Add a CMS for Dynamic Content

**Goal:** Replace hand-built pages with a content management system that generates pages from data.

**Time:** about 2.5 hours

**Step 1: Understand what a CMS is.**
A CMS (content management system) stores content as structured records and generates pages from a template. It separates content from design, so you design once and then add content without touching the layout.

**Step 2: Understand collections.**
A collection is a set of similar content items, like Blog Posts or Projects, each with defined fields. Choosing your collections is like choosing your data types: it defines the content your site can hold.

**Step 3: Create a Projects collection.**
In the CMS, create a collection `Projects` with fields for name (text), summary (text), image, and slug. These fields will feed both the list of projects and each project's own page. Creating a collection also creates its template page automatically.

**Step 4: Add a few collection items.**
Add three sample projects with real content, so you have something to build and test the templates against. The free plan caps the number of CMS items (check the current plan page), but three is well within it.

**Step 5: Understand collection lists.**
A collection list displays items from a collection, one block per item, like a repeating group for content. This is how you build a blog index or portfolio grid that grows automatically.

**Step 6: Build a project grid with a collection list.**
In the `work` section of your Home page (or on the Work page if you made one on a paid plan), add a Collection List bound to Projects and design one card using the collection fields. You design one card and every project appears in that style.

**Step 7: Understand collection page templates.**
A collection page is a single template that generates one live page per item, using that item's fields. One template becomes as many pages as you have items, each with its own content and URL. On the free plan, this template page has not counted toward the static page limit (check the current plan).

**Step 8: Design the detail template and link the cards.**
Open the Projects template page, add your navbar and footer components, and design it with the name, image, and summary bound to the item's fields. Then link each card in the collection list to its collection page. Now every project has its own real page and URL, all from one template.

### Project Structure
```text
CMS
│
├── Collection: Projects (name, summary, image, slug)
│   └── 3 sample items
├── Home page, work section: Collection List -> project card design
└── Projects template page -> generates one page per project
```

### What You Learned
- ✅ What a CMS, collection, and collection item are
- ✅ Designing collection fields for your content
- ✅ Building a collection list (auto-updating content grid)
- ✅ Using a collection page template to generate many pages
- ✅ Linking list items to their generated detail pages

### Portfolio Project
**CMS-Powered Content Section**: Built a content-managed section where a single template generates a page per item from CMS data.
**Skills:** Webflow CMS, Content Modeling, Dynamic Pages, Templating.

**Deliverable:** A CMS collection, an auto-updating list, and template-generated detail pages.

### Quiz

1. What does a CMS separate, and why does that help?
2. What is the difference between a collection list and a collection page template?
3. If you add a fourth project item, what changes on the site without any design work?
4. Why is the CMS template page useful on the free plan?

*Answers: 1) It separates content from design, so you design once and add content without touching the layout. 2) A collection list shows many items on one page as repeated cards; a collection page template generates one separate page per item. 3) A new card appears in the collection list and a new detail page with its own URL is generated. 4) It gives every project its own page without using up the limited static pages.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "database",
   "kicker": "Project 4 · The CMS",
   "title": "Design once, add content forever",
   "beats": [
    {
     "say": "Welcome to Project 4."
    },
    {
     "say": "A C M S, a content management system, stores content as structured records, and generates pages from a template."
    },
    {
     "say": "It separates content from design, so you design once and add content without touching the layout."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 2 and 3",
   "title": "A Projects collection and its fields",
   "columns": [
    "Field",
    "Type",
    "Holds"
   ],
   "rows": [
    [
     "name",
     "Text",
     "Project title"
    ],
    [
     "summary",
     "Text",
     "A short description"
    ],
    [
     "image",
     "Image",
     "The main picture"
    ],
    [
     "slug",
     "Text",
     "The page's URL part"
    ]
   ],
   "beats": [
    {
     "say": "A collection is a set of similar items, each with the same fields. Like choosing a data type for your content."
    },
    {
     "say": "In the C M S, create a collection called Projects.",
     "sql": "Collection: Projects"
    },
    {
     "say": "Give it a name and a summary, both text.",
     "hl": [
      0,
      1
     ],
     "dim": true
    },
    {
     "say": "An image field.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "And a slug, the part of the U R L that's unique to each project.",
     "hl": 3,
     "dim": true
    },
    {
     "say": "Creating the collection also creates its template page, automatically.",
     "hl": [
      0,
      1,
      2,
      3
     ],
     "col": 0
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 4",
   "title": "Three sample items",
   "columns": [
    "name",
    "slug",
    "summary"
   ],
   "rows": [
    [
     "Bakery Website",
     "bakery-website",
     "A menu and order page"
    ],
    [
     "Brand Refresh",
     "brand-refresh",
     "New logo and colours"
    ],
    [
     "Event Landing",
     "event-landing",
     "A one-page signup"
    ]
   ],
   "beats": [
    {
     "say": "Now add three sample projects. These ones are just examples. Use your own real work."
    },
    {
     "say": "Each item fills in the same fields. Here's the first.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Then the second, and the third.",
     "hl": [
      0,
      1,
      2
     ]
    },
    {
     "say": "Each slug is unique, so each project will get its own address.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 1
    },
    {
     "say": "The free plan caps C M S items, but three is well within it.",
     "col": 0
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 5 to 8",
   "title": "One collection, a list, and a page per item",
   "nodes": [
    {
     "id": "coll",
     "label": "Projects",
     "x": 12,
     "y": 50,
     "sub": "collection · 3 items",
     "art": "database"
    },
    {
     "id": "list",
     "label": "Collection List",
     "x": 50,
     "y": 20,
     "sub": "Home · work section",
     "art": "layout"
    },
    {
     "id": "tmpl",
     "label": "Template page",
     "x": 50,
     "y": 80,
     "sub": "Projects template",
     "art": "blueprint"
    },
    {
     "id": "live",
     "label": "Live pages",
     "x": 88,
     "y": 50,
     "sub": "one URL per project",
     "art": "browser"
    }
   ],
   "edges": [
    {
     "from": "coll",
     "to": "list"
    },
    {
     "from": "coll",
     "to": "tmpl"
    },
    {
     "from": "tmpl",
     "to": "live"
    },
    {
     "from": "list",
     "to": "live"
    }
   ],
   "beats": [
    {
     "say": "Here's the whole system. It starts with your Projects collection.",
     "show": 1,
     "on": "coll"
    },
    {
     "say": "In the work section on Home, add a Collection List bound to Projects.",
     "show": 2,
     "send": {
      "from": "coll",
      "to": "list",
      "label": "3 items"
     }
    },
    {
     "say": "Design one card from the fields, and every project appears in that style. Three items, three cards.",
     "show": 2,
     "on": "list"
    },
    {
     "say": "Next, the template page. Add your navbar and footer, and bind the name, image and summary to the item's fields.",
     "show": 3,
     "send": {
      "from": "coll",
      "to": "tmpl",
      "label": "item fields"
     }
    },
    {
     "say": "That one template generates a live page for every item, each with its own U R L.",
     "show": 4,
     "send": {
      "from": "tmpl",
      "to": "live",
      "label": "3 pages"
     }
    },
    {
     "say": "Last, link each card to its collection page. Click a card, land on that project.",
     "show": 4,
     "send": {
      "from": "list",
      "to": "live",
      "label": "card link"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Collection list or template page?",
   "columns": [
    "",
    "Collection list",
    "Template page"
   ],
   "rows": [
    [
     "Shows",
     "Many items, one page",
     "One item per page"
    ],
    [
     "Looks like",
     "Repeated cards",
     "A full detail page"
    ],
    [
     "Lives on",
     "Home, work section",
     "Projects template"
    ],
    [
     "Static page?",
     "Part of Home",
     "Not counted"
    ]
   ],
   "beats": [
    {
     "say": "These two are easy to mix up, so let's compare."
    },
    {
     "say": "A collection list shows many items on one page.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "A template page shows one item, and makes a separate page for each.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "The list repeats a card. The template is a full detail page.",
     "hl": 1,
     "col": 1
    },
    {
     "say": "And on the free plan, the template page hasn't counted toward the static page limit. Do check the current plan.",
     "hl": 3,
     "col": 2
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Concept",
   "title": "Add a fourth project, and watch",
   "values": [
    "Bakery Website",
    "Brand Refresh",
    "Event Landing",
    "(empty slot)"
   ],
   "beats": [
    {
     "say": "Your site shows three projects, so it has three cards and three detail pages.",
     "hl": [
      0,
      1,
      2
     ]
    },
    {
     "say": "Now add a fourth item in the C M S. No design work at all.",
     "vals": [
      "Bakery Website",
      "Brand Refresh",
      "Event Landing",
      "Portfolio Site"
     ],
     "hl": 3
    },
    {
     "say": "A new card appears in the collection list.",
     "ok": [
      3
     ],
     "note": "+1 card in the work section"
    },
    {
     "say": "And a new detail page is generated, with its own U R L. That's content without touching the layout.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "note": "+1 page at /projects/portfolio-site"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does a C M S separate, and why does it help?",
   "options": [
    "Mobile from desktop, so pages load faster",
    "Text from images, so files are smaller",
    "Content from design, so you add content without touching the layout"
   ],
   "answer": 2,
   "good": "That's right. A C M S separates content from design, so you design once and add content without touching the layout.",
   "bad": "Not quite. A C M S separates content from design, so you design once and add content without touching the layout.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does a C M S separate, and why does it help?",
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
     "A Projects collection",
     ""
    ],
    [
     "An auto-updating list",
     ""
    ],
    [
     "Template-generated detail pages",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 4.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a C M S collection,",
     "show": 1
    },
    {
     "say": "an auto-updating collection list,",
     "show": 2
    },
    {
     "say": "and template-generated detail pages.",
     "show": 3
    },
    {
     "say": "Next, in Module 5, interactions and a working form.",
     "show": 3
    }
   ]
  }
 ]
}
```

---

## Project 5 (Module 5): Add Interactions and a Working Form

**Goal:** Bring the site to life with subtle motion and a contact form that actually delivers messages.

**Time:** about 2 hours

**Step 1: Understand interactions.**
An interaction is an animation triggered by an event, like an element fading in as it scrolls into view. Well-judged motion guides attention and signals quality, while too much of it distracts, so restraint is part of the skill.

**Step 2: Add a scroll-into-view animation.**
Select your cards and add a "while scrolling into view" interaction that fades them in and moves them up slightly. This is the most common, tasteful interaction on modern sites.

**Step 3: Add a hover interaction.**
Add a hover state to buttons and cards, such as a slight lift or colour change. Hover feedback tells users what is clickable.

**Step 4: Understand web forms.**
A form collects user input (name, email, message) and submits it somewhere, such as your email. On many business sites, the form is the whole point.

**Step 5: Build the contact form.**
On the Contact page, add a Form with name, email, and message fields and a submit button. Match the fields to what you actually need, since short forms get completed far more often. In Site settings, under Forms, check which email address receives form notifications.

**Step 6: Add form validation.**
Mark email and message as required and set the email field type to Email so invalid emails are rejected. Validation stops junk and incomplete submissions.

**Step 7: Add success and error states.**
A success state confirms a submission worked, and an error state tells the user something went wrong. Edit the text of both states that come with the Form element. Without feedback, users resubmit or assume the form is broken.

**Step 8: Test the form end to end.**
Publish to your free `webflow.io` address, submit the form yourself, and confirm the message arrives and the success state shows. The free plan limits how many form submissions you get (check the current plan page), so a few tests are fine but don't spam it. A form that looks fine but never delivers is worse than none.

### Project Structure
```text
Interactions + form
│
├── Scroll-into-view animation on cards
├── Hover states on buttons and cards
└── Contact form (name, email, message)
    ├── validation (required + email type)
    └── success / error states, tested end to end
```

### What You Learned
- ✅ What interactions are and how to use them tastefully
- ✅ Building scroll and hover animations
- ✅ What web forms are and how to build one
- ✅ Adding validation to prevent junk submissions
- ✅ Handling success and error states and testing delivery

### Portfolio Project
**Interactive Site with Working Form**: Added tasteful animations and a validated, working contact form with clear feedback states.
**Skills:** Webflow Interactions, Forms, Validation, UX Polish.

**Deliverable:** A site with tasteful interactions and a tested contact form that delivers messages.

### Quiz

1. Why is restraint part of using interactions well?
2. What does a hover state tell the user?
3. Which two settings stop junk or incomplete form submissions in this project?
4. Why must you publish and send a real test submission instead of just previewing the form?

*Answers: 1) Subtle motion guides attention, but too much animation distracts and makes the site feel less polished. 2) That the element is clickable. 3) Marking fields as required and setting the email field type to Email. 4) Only a real submission on the published site proves the message is delivered and the success state shows.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "bolt",
   "kicker": "Project 5 · Interactions and forms",
   "title": "Bring it to life",
   "beats": [
    {
     "say": "Welcome to Project 5."
    },
    {
     "say": "An interaction is an animation triggered by an event. Well-judged motion guides attention, but too much distracts, so restraint is part of the skill."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 1 to 3",
   "title": "Two tasteful interactions",
   "columns": [
    "Interaction",
    "Trigger",
    "Effect"
   ],
   "rows": [
    [
     "Scroll into view",
     "Card enters the screen",
     "Fade in, move up a bit"
    ],
    [
     "Hover",
     "Pointer over it",
     "Slight lift or colour"
    ]
   ],
   "beats": [
    {
     "say": "Every interaction is a trigger, plus an effect.",
     "col": 1
    },
    {
     "say": "Select your cards, and add a while scrolling into view interaction.",
     "hl": 0,
     "dim": true,
     "col": 1
    },
    {
     "say": "As each card enters the screen, it fades in and moves up slightly. The most common, tasteful animation.",
     "hl": 0,
     "dim": true,
     "col": 2
    },
    {
     "say": "Then add a hover state to buttons and cards: a slight lift, or a colour change.",
     "hl": 1,
     "dim": true,
     "col": 2
    },
    {
     "say": "Hover feedback tells visitors what's clickable. Two interactions are plenty.",
     "hl": [
      0,
      1
     ]
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 4 to 7",
   "title": "Where a form submission goes",
   "nodes": [
    {
     "id": "you",
     "label": "Visitor",
     "x": 10,
     "y": 50,
     "sub": "on Contact",
     "art": "phone"
    },
    {
     "id": "form",
     "label": "Contact form",
     "x": 34,
     "y": 50,
     "sub": "name, email, message",
     "art": "form"
    },
    {
     "id": "check",
     "label": "Validation",
     "x": 60,
     "y": 50,
     "sub": "required + Email type",
     "art": "shield"
    },
    {
     "id": "mail",
     "label": "Your inbox",
     "x": 88,
     "y": 22,
     "sub": "Site settings › Forms",
     "art": "mail"
    },
    {
     "id": "state",
     "label": "Success state",
     "x": 88,
     "y": 78,
     "sub": "or error state",
     "art": "bell"
    }
   ],
   "edges": [
    {
     "from": "you",
     "to": "form"
    },
    {
     "from": "form",
     "to": "check"
    },
    {
     "from": "check",
     "to": "mail"
    },
    {
     "from": "check",
     "to": "state"
    },
    {
     "from": "state",
     "to": "you"
    }
   ],
   "beats": [
    {
     "say": "A form collects what visitors type and sends it somewhere. On many business sites, it's the whole point.",
     "show": 2
    },
    {
     "say": "On Contact, add a Form with name, email and message, plus a submit button. Short forms get finished.",
     "show": 2,
     "send": {
      "from": "you",
      "to": "form",
      "label": "fills it in"
     }
    },
    {
     "say": "Mark email and message as required, and set the email field type to Email. Junk gets stopped here.",
     "show": 3,
     "send": {
      "from": "form",
      "to": "check",
      "label": "submit"
     }
    },
    {
     "say": "A valid message goes to the notification email set in Site settings, under Forms.",
     "show": 4,
     "send": {
      "from": "check",
      "to": "mail",
      "label": "new message"
     }
    },
    {
     "say": "And the visitor sees your success state, or the error state if something went wrong.",
     "show": 5,
     "send": {
      "from": "state",
      "to": "you",
      "label": "Thank you!"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 6",
   "title": "Validation, case by case",
   "columns": [
    "Email",
    "Message",
    "Result"
   ],
   "rows": [
    [
     "ada@mail.com",
     "Hi, let's talk",
     "Sent"
    ],
    [
     "ada.mail.com",
     "Hi, let's talk",
     "Blocked: not an email"
    ],
    [
     "(empty)",
     "Hi, let's talk",
     "Blocked: required"
    ],
    [
     "ada@mail.com",
     "(empty)",
     "Blocked: required"
    ]
   ],
   "beats": [
    {
     "say": "Let's try four submissions against your rules.",
     "sql": "email: required, type Email\nmessage: required"
    },
    {
     "say": "A real email and a message. It goes through.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "An email with no at sign isn't an email, so the Email type rejects it.",
     "hl": 1,
     "dim": true,
     "col": 0
    },
    {
     "say": "A blank email is blocked, because it's required.",
     "hl": 2,
     "dim": true,
     "col": 0
    },
    {
     "say": "And so is a blank message. Only the first one ever reaches your inbox.",
     "hl": 3,
     "dim": true,
     "col": 1
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Step 8",
   "title": "Test it end to end",
   "values": [
    "Publish to webflow.io",
    "Submit the form",
    "Success state shows",
    "Message arrives"
   ],
   "beats": [
    {
     "say": "A form that looks fine but never delivers is worse than none. So test it for real."
    },
    {
     "say": "Publish to your free webflow dot i o address. Preview mode isn't enough.",
     "hl": 0,
     "ptr": {
      "step": 0
     }
    },
    {
     "say": "Submit the form yourself.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "step": 1
     }
    },
    {
     "say": "Check the success state shows.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "step": 2
     }
    },
    {
     "say": "And confirm the message actually arrives in your inbox.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3,
     "ptr": {
      "step": 3
     }
    },
    {
     "say": "The free plan limits submissions, so a few tests are fine. Just don't spam it.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "note": "Delivered: the form really works"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why publish and send a real test instead of just previewing the form?",
   "options": [
    "Only a real submission on the published site proves the message is delivered",
    "Preview mode hides the form",
    "Webflow charges for previews"
   ],
   "answer": 0,
   "good": "That's right. Only a real submission on the published site proves the message is delivered and the success state shows.",
   "bad": "Not quite. Only a real submission on the published site proves the message is delivered and the success state shows.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why publish and send a real test instead of just previewing the form?",
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
     "Tasteful interactions",
     ""
    ],
    [
     "A tested, working contact form",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 5.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "your site has tasteful interactions,",
     "show": 1
    },
    {
     "say": "and a tested contact form that delivers messages.",
     "show": 2
    },
    {
     "say": "Next, in Module 6, you optimize, publish and connect a domain.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 6 (Module 6): Optimize, Publish, and Connect a Domain

**Goal:** Make the site fast, findable, and live on the web, with a custom domain as an optional paid step.

**Time:** about 2 hours

**Step 1: Understand SEO settings.**
SEO (search engine optimization) settings, like page titles and meta descriptions, tell search engines what each page is about. If people cannot find a site, its design does not matter.

**Step 2: Set titles and meta descriptions.**
For each page and the CMS template, write a clear title and description (in page settings). On the template you can insert collection fields, so each project page gets its own title. These are what show up in search results and link previews, so they directly affect whether people click.

**Step 3: Understand accessibility and alt text.**
Alt text describes an image for screen readers and search engines, and accessibility means the site works for everyone. Accessible sites reach more people and are easier for search engines to understand.

**Step 4: Add alt text and check contrast.**
Add alt text to every meaningful image and confirm text has enough contrast against its background. These two fixes cover the most common accessibility gaps.

**Step 5: Optimize images and performance.**
Compress large images before uploading and confirm the site loads quickly on your published URL. Large images are the top cause of slow sites, and slow sites lose visitors within seconds.

**Step 6: Understand publishing and domains.**
Publishing pushes your work to the live web. Every Webflow site can publish for free to a `webflow.io` subdomain, such as `portfolio-site.webflow.io`. Connecting your own custom domain needs a paid site plan.

**Step 7: Publish, and optionally connect a domain.**
Publish to your `webflow.io` address and check every page on desktop and phone. This is your live site.

*Optional (needs a paid site plan):* if you buy a site plan and own a domain, add it under Site settings, Publishing, Custom domains, and follow Webflow's DNS instructions. If not, just write the steps in your checklist so you know what to do later.

**Step 8: Write a launch checklist and README.**
Document the pages, CMS collections, SEO settings, and the live URL. This is what you hand a client, and what you check the next time you update the site.

### Project Structure
```text
Production
│
├── SEO titles + meta descriptions per page/template
├── Alt text + contrast checked
├── Images compressed, load time checked
├── Published to webflow.io (custom domain optional, paid plan)
└── launch_checklist.md
```

### What You Learned
- ✅ Basic SEO: titles and meta descriptions
- ✅ Accessibility: alt text and contrast
- ✅ Optimizing images for performance
- ✅ Publishing to the web, and what connecting a domain involves
- ✅ Documenting a launch

### Portfolio Project
**Published, Optimized Website**: Optimized a site for search, accessibility, and speed, then published it live on the web.
**Skills:** SEO, Accessibility, Performance, Publishing, Webflow.

**Deliverable:** A live, optimized, search-ready website on its `webflow.io` address (or a custom domain on a paid plan) with a launch checklist.

### Quiz

1. Where do a page's title and meta description show up, and why do they matter?
2. What two accessibility fixes does this project cover?
3. What is the most common cause of a slow-loading site?
4. Where can a free Webflow site be published, and what needs a paid site plan?

*Answers: 1) In search results and link previews; they affect whether people find and click your page. 2) Adding alt text to meaningful images and checking text contrast. 3) Large, uncompressed images. 4) To a free webflow.io subdomain; connecting a custom domain needs a paid site plan.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "rocket",
   "kicker": "Project 6 · Optimize and publish",
   "title": "Fast, findable, live",
   "beats": [
    {
     "say": "Welcome to the last project."
    },
    {
     "say": "You make the site fast, findable and live on the web."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 1 and 2",
   "title": "A title and description for every page",
   "columns": [
    "Page",
    "Title",
    "Description"
   ],
   "rows": [
    [
     "Home",
     "Portfolio | Your Name",
     "Web designer and…"
    ],
    [
     "Contact",
     "Contact | Your Name",
     "Get in touch about…"
    ],
    [
     "Projects template",
     "[name] | Projects",
     "[summary]"
    ]
   ],
   "beats": [
    {
     "say": "S E O settings tell search engines what each page is about. If people can't find a site, its design doesn't matter."
    },
    {
     "say": "In page settings, give Home a clear title and meta description. These are examples. Write your own.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Do the same for Contact.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "On the C M S template, insert collection fields: the project's name in the title, its summary as the description.",
     "hl": 2,
     "dim": true,
     "sql": "Title = name field + \" | Projects\""
    },
    {
     "say": "So every project page gets its own title. These show up in search results and link previews.",
     "hl": 2,
     "col": 1
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 3 and 4",
   "title": "The two most common accessibility fixes",
   "columns": [
    "Check",
    "Example",
    "Fix"
   ],
   "rows": [
    [
     "Alt text",
     "Your profile photo",
     "Describe what it shows"
    ],
    [
     "Alt text",
     "Each project image",
     "Describe the work"
    ],
    [
     "Contrast",
     "Pale text on pink",
     "Darken the text"
    ]
   ],
   "beats": [
    {
     "say": "Accessibility means the site works for everyone, including people using screen readers."
    },
    {
     "say": "Alt text describes an image for screen readers and search engines. Add it to every meaningful image.",
     "hl": [
      0,
      1
     ],
     "dim": true,
     "col": 0
    },
    {
     "say": "Your photo, and each project image, gets a short, plain description.",
     "hl": [
      0,
      1
     ],
     "dim": true,
     "col": 2
    },
    {
     "say": "Then check contrast. Text needs to stand out clearly from its background.",
     "hl": 2,
     "dim": true,
     "col": 0
    },
    {
     "say": "These two fixes cover the most common accessibility gaps.",
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
   "kicker": "Lab · Steps 5 to 7",
   "title": "Publish to the live web",
   "nodes": [
    {
     "id": "des",
     "label": "Webflow Designer",
     "x": 12,
     "y": 50,
     "sub": "your site",
     "art": "laptop"
    },
    {
     "id": "wf",
     "label": "webflow.io address",
     "x": 50,
     "y": 22,
     "sub": "free on every site",
     "art": "globe"
    },
    {
     "id": "dom",
     "label": "Custom domain",
     "x": 50,
     "y": 80,
     "sub": "optional · paid plan",
     "art": "key"
    },
    {
     "id": "vis",
     "label": "Visitors",
     "x": 88,
     "y": 50,
     "sub": "desktop and phone",
     "art": "phone"
    }
   ],
   "edges": [
    {
     "from": "des",
     "to": "wf"
    },
    {
     "from": "des",
     "to": "dom"
    },
    {
     "from": "wf",
     "to": "vis"
    },
    {
     "from": "dom",
     "to": "vis"
    }
   ],
   "beats": [
    {
     "say": "Before you publish, compress large images. They're the top cause of slow sites.",
     "show": 1,
     "on": "des"
    },
    {
     "say": "Publishing pushes your work to the live web. Every site can publish free to a webflow dot i o address, like portfolio site dot webflow dot i o.",
     "show": 2,
     "send": {
      "from": "des",
      "to": "wf",
      "label": "Publish"
     }
    },
    {
     "say": "Visitors can reach it right away. Check every page on desktop and phone, and check it loads quickly.",
     "show": 4,
     "send": {
      "from": "wf",
      "to": "vis",
      "label": "fast pages"
     }
    },
    {
     "say": "Connecting your own domain is optional, and needs a paid site plan.",
     "show": 4,
     "on": "dom"
    },
    {
     "say": "If you have one, add it under Site settings, Publishing, Custom domains, and follow the D N S steps. If not, just note the steps for later.",
     "show": 4,
     "send": {
      "from": "des",
      "to": "dom",
      "label": "DNS setup"
     }
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Step 8",
   "title": "Your launch checklist",
   "values": [
    "Pages",
    "CMS collections",
    "SEO titles",
    "Alt text",
    "Contrast",
    "Images compressed",
    "Live URL"
   ],
   "beats": [
    {
     "say": "Last, write a launch checklist and README. It's what you hand a client."
    },
    {
     "say": "Document your pages and your C M S collections.",
     "hl": [
      0,
      1
     ]
    },
    {
     "say": "Your S E O settings, alt text and contrast checks.",
     "ok": [
      0,
      1
     ],
     "hl": [
      2,
      3,
      4
     ]
    },
    {
     "say": "That images are compressed.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "hl": 5
    },
    {
     "say": "And your live U R L.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5
     ],
     "hl": 6
    },
    {
     "say": "Next time you update the site, this is the list you check.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
     ],
     "note": "launch_checklist.md"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Where can a free Webflow site be published?",
   "options": [
    "Only on a custom domain",
    "To a free webflow.io subdomain",
    "Nowhere until you upgrade"
   ],
   "answer": 1,
   "good": "That's right. A free site publishes to a webflow dot i o subdomain. Connecting a custom domain needs a paid site plan.",
   "bad": "Not quite. A free site publishes to a webflow dot i o subdomain. Connecting a custom domain needs a paid site plan.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Where can a free Webflow site be published?",
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
     "A live, optimized site",
     ""
    ],
    [
     "A launch checklist",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's the final project.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "your site is live, optimized and search-ready on its webflow dot i o address, or a custom domain on a paid plan,",
     "show": 1
    },
    {
     "say": "with a launch checklist.",
     "show": 2
    },
    {
     "say": "You've finished No-Code Website and C M S Developer with Webflow. Well done.",
     "show": 2
    }
   ]
  }
 ]
}
```
