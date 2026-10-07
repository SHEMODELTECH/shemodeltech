<!-- order: 2 -->
# No-Code Website and CMS Developer (Webflow): Hands-On Project Tutorials

This course turns each project into a step-by-step, hands-on build. You learn each idea at the moment you need it, while building the thing, and every project hands its result to the next one, ending in a live, content-managed website. Follow the projects in order.

**Plan check:** Every required step in this course works on Webflow's free Starter site plan, which you get when you create a site. On the free plan at the time of writing (2026), a site has a small limit on static pages (2), a cap on CMS items, a cap on form submissions, and publishes only to a free `webflow.io` subdomain; check Webflow's current plan page, because limits change. This course builds within those limits: a Home page, a Contact page, and a CMS template page. These parts need a paid site plan and are marked optional: extra static pages (separate About and Work pages) in Project 3, and connecting a custom domain in Project 6.

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

---

## Project 3 (Module 3): Build a Multi-Page Site with Navigation

**Goal:** Turn a single page into a real, navigable website with shared navigation, within the free plan's page limit.

**Time:** about 2.5 hours

**Step 1: Plan your pages within the free limit.**
On the free Starter plan at the time of writing, a site can have only 2 static pages (check the current plan page). So the free path uses two static pages: `Home` and `Contact`. Instead of separate About and Work pages, add two sections to Home and give them the IDs `about` and `work` (Element settings, ID field). In Project 4 a CMS template page will add one real page per project, which does not count as a static page. Planning pages up front keeps navigation simple.

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
A collection page is a single template that generates one live page per item, using that item's fields. One template becomes as many pages as you have items, each with its own content and URL. On the free plan at the time of writing, this template page does not count toward the static page limit.

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
