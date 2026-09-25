<!-- order: 2 -->
# No-Code Website and CMS Developer (Webflow): Hands-On Project Tutorials

This course turns each project into a step-by-step, hands-on build. You learn each idea at the moment you need it, while building the thing, and every project hands its result to the next one, ending in a live, content-managed website. Follow the projects in order.

---

## Project 1 (Module 1): Build Your First Structured Page

**Goal:** Build one clean, responsive page and understand the box model that all web layout relies on.

**Step 1: Create your Webflow account and a blank site.**
Go to webflow.com, sign up, and create a new blank site named `portfolio-site`. Starting blank rather than from a template forces you to learn how layout actually works.

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

### Final Project Structure
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

---

## Project 2 (Module 2): Design a Reusable Style System

**Goal:** Build a consistent visual system with reusable classes, so your whole site stays coherent.

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

### Final Project Structure
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

---

## Project 3 (Module 3): Build a Multi-Page Site with Navigation

**Goal:** Turn a single page into a real, navigable multi-page website.

**Step 1: Create additional pages.**
Add pages for `About`, `Work`, and `Contact`. Most sites are a small set of focused pages, so planning them up front keeps navigation simple.

**Step 2: Understand the navbar.**
A navbar is the navigation bar, usually at the top, that links to your main pages. It is how users move around your site and one of the strongest signals of a well-built site.

**Step 3: Build and style the navbar.**
Add the Navbar element, set its links to your pages, and style it with your Project 2 classes so it stays consistent with the rest of the site.

**Step 4: Understand shared components.**
A shared component appears on every page but is edited in one place. A navbar and footer should be identical everywhere, so making them components means one edit updates every page.

**Step 5: Make the navbar and footer components.**
Convert your navbar and a footer into components and place them on every page. This guarantees consistency and saves you from updating the same navbar four times.

**Step 6: Show the current page.**
The current state styles the nav link for the page you are on, so users always know where they are. It is a small touch that makes navigation feel intentional.

**Step 7: Add responsive mobile navigation.**
Configure the navbar's mobile menu (the hamburger) and test it at mobile width. Desktop navbars do not fit phones, and most visits are on phones.

**Step 8: Test all navigation.**
Click through every link on every page, on desktop and mobile. Broken links are the most noticeable flaw a visitor can hit, and a quick full click-through catches them.

### Final Project Structure
```text
Multi-page site
│
├── Pages: Home, About, Work, Contact
├── Navbar (component, on every page, with current state)
├── Footer (component, on every page)
└── Mobile menu tested
```

### What You Learned
- ✅ Building a multi-page site with a shared frame
- ✅ What a navbar is and how to style it consistently
- ✅ Using components for site-wide shared elements
- ✅ Showing the current page in navigation
- ✅ Building and testing responsive mobile navigation

### Portfolio Project
**Navigable Multi-Page Site**: Built a consistent, multi-page website with shared components and working responsive navigation.
**Skills:** Webflow, Site Structure, Navigation, Components, Responsive Design.

**Deliverable:** A multi-page site with a consistent navbar and footer and working mobile navigation.

---

## Project 4 (Module 4): Add a CMS for Dynamic Content

**Goal:** Replace hand-built pages with a content management system that generates pages from data.

**Step 1: Understand what a CMS is.**
A CMS (content management system) stores content as structured records and generates pages from a template. It separates content from design, so you design once and then add unlimited content without touching the layout.

**Step 2: Understand collections.**
A collection is a set of similar content items, like Blog Posts or Projects, each with defined fields. Choosing your collections is like choosing your data types: it defines the content your site can hold.

**Step 3: Create a Projects collection.**
In the CMS, create a collection `Projects` with fields for name (text), summary (text), image, and slug. These fields will feed both the list of projects and each project's own page.

**Step 4: Add a few collection items.**
Add three sample projects with real content, so you have something to build and test the templates against.

**Step 5: Understand collection lists.**
A collection list displays items from a collection, one block per item, like a repeating group for content. This is how you build a blog index or portfolio grid that grows automatically.

**Step 6: Build a project grid with a collection list.**
On the Work page, add a Collection List bound to Projects and design one card using the collection fields. You design one card and every project appears in that style.

**Step 7: Understand collection page templates.**
A collection page is a single template that generates one live page per item, using that item's fields. One template becomes as many pages as you have items, each with its own content and URL.

**Step 8: Design the detail template and link the cards.**
Design the Projects template page (name, image, summary), then link each card to its collection page. Now every project has its own real page and URL, all from one template.

### Final Project Structure
```text
CMS
│
├── Collection: Projects (name, summary, image, slug)
│   └── 3 sample items
├── Work page: Collection List -> project card design
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

---

## Project 5 (Module 5): Add Interactions and a Working Form

**Goal:** Bring the site to life with subtle motion and a contact form that actually delivers messages.

**Step 1: Understand interactions.**
An interaction is an animation triggered by an event, like an element fading in as it scrolls into view. Well-judged motion guides attention and signals quality, while too much of it distracts, so restraint is part of the skill.

**Step 2: Add a scroll-into-view animation.**
Select your cards and add a "while scrolling into view" interaction that fades them in and moves them up slightly. This is the most common, tasteful interaction on modern sites.

**Step 3: Add a hover interaction.**
Add a hover state to buttons and cards, such as a slight lift or colour change. Hover feedback tells users what is clickable.

**Step 4: Understand web forms.**
A form collects user input (name, email, message) and submits it somewhere, such as your email. On many business sites, the form is the whole point.

**Step 5: Build the contact form.**
On the Contact page, add a Form with name, email, and message fields and a submit button. Match the fields to what you actually need, since short forms get completed far more often.

**Step 6: Add form validation.**
Mark email and message as required and set the email field type so invalid emails are rejected. Validation stops junk and incomplete submissions.

**Step 7: Add success and error states.**
A success state confirms a submission worked, and an error state tells the user something went wrong. Without feedback, users resubmit or assume the form is broken.

**Step 8: Test the form end to end.**
Publish, submit the form yourself, and confirm the message arrives and the success state shows. A form that looks fine but never delivers is worse than none.

### Final Project Structure
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

---

## Project 6 (Module 6): Optimize, Publish, and Connect a Domain

**Goal:** Make the site fast, findable, and live on a real domain.

**Step 1: Understand SEO settings.**
SEO (search engine optimization) settings, like page titles and meta descriptions, tell search engines what each page is about. If people cannot find a site, its design does not matter.

**Step 2: Set titles and meta descriptions.**
For each page and CMS template, write a clear title and description. These are what show up in search results and link previews, so they directly affect whether people click.

**Step 3: Understand accessibility and alt text.**
Alt text describes an image for screen readers and search engines, and accessibility means the site works for everyone. Accessible sites reach more people and rank better.

**Step 4: Add alt text and check contrast.**
Add alt text to every meaningful image and confirm text has enough contrast against its background. These two fixes cover the most common accessibility gaps.

**Step 5: Optimize images and performance.**
Compress large images and confirm the site loads quickly in the responsive preview. Large images are the top cause of slow sites, and slow sites lose visitors within seconds.

**Step 6: Understand publishing and staging.**
Publishing pushes your work to the live web. Webflow publishes to a staging subdomain and, once connected, to your custom domain, which lets you review the live build before pointing your real domain at it.

**Step 7: Publish and connect a domain.**
Publish to the staging URL, then connect a custom domain, or note the steps if you do not own one yet. A custom domain is what makes a site look like a real business rather than a demo.

**Step 8: Write a launch checklist and README.**
Document the pages, CMS collections, SEO settings, and the live URL. This is what you hand a client, and what you check the next time you update the site.

### Final Project Structure
```text
Production
│
├── SEO titles + meta descriptions per page/template
├── Alt text + contrast checked
├── Images compressed, load time checked
├── Published (staging + custom domain steps)
└── launch_checklist.md
```

### What You Learned
- ✅ Basic SEO: titles and meta descriptions
- ✅ Accessibility: alt text and contrast
- ✅ Optimizing images for performance
- ✅ Publishing, staging, and connecting a domain
- ✅ Documenting a launch

### Portfolio Project
**Published, Optimized Website**: Optimized a site for search, accessibility, and speed, then published it to a real domain.
**Skills:** SEO, Accessibility, Performance, Publishing, Webflow.

**Deliverable:** A live, optimized, search-ready website on a real or staging domain with a launch checklist.

---

## Final Capstone: Design and Ship a Complete Client-Ready Website

**Goal:** Combine every project into one original, content-managed, published website. This is an integration exercise, not new material.

**Step 1: Choose a real subject.**
Build for a real or realistic client, such as a local business, a portfolio, a small nonprofit, or an event. A site with a real purpose is far more convincing than a generic template.

**Step 2: Build the structure and style system.**
Using your Project 1 and 2 skills, lay out the pages and define your classes, swatches, and components first. A defined system up front keeps the whole build consistent and fast.

**Step 3: Build multi-page navigation.**
Using your Project 3 skills, create the pages and shared navbar and footer components so the pages feel like one coherent site.

**Step 4: Add a CMS.**
Using your Project 4 skills, model at least one collection and generate its pages from a template. This is the skill that separates a page builder from a web developer.

**Step 5: Add interactions and a form.**
Using your Project 5 skills, add tasteful motion and a working, validated contact form.

**Step 6: Optimize and publish.**
Using your Project 6 skills, handle SEO, accessibility, and performance, then publish to a domain.

**Step 7: Write the capstone document.**
Combine the subject, sitemap, CMS model, interactions, and live URL with screenshots. This is what you hand a client or employer to prove the site is real and yours.

### Final Project Structure
```text
capstone_site (Webflow)
│
├── Pages + style system (classes, swatches, components)
├── Navbar + footer components
├── CMS collection + template pages
├── Interactions + working contact form
├── SEO + accessibility + performance
├── Published to a domain
└── capstone_summary.md
```

### What You Learned
- ✅ Taking a real subject from blank canvas to live site
- ✅ Combining layout, style systems, CMS, and interactions
- ✅ Optimizing and publishing a professional website
- ✅ Documenting a site for a client or employer
- ✅ Shipping a finished, original, content-managed website

### Portfolio Project
**Complete Client-Ready Website (Capstone)**: Designed, built, content-managed, optimized, and published an original multi-page website with a CMS, interactions, a working form, and a live domain.
**Skills:** Webflow, Design Systems, CMS, Interactions, Forms, SEO, Accessibility, Publishing, No-Code Development.

**Deliverable:** A live, original, content-managed website, plus a written summary connecting it back to every project that built it.
