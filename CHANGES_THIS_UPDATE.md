# Changes in this update (latest)

> The previous changelog is preserved as `CHANGES_PREVIOUS_UPDATE.md`.

## 1. Rebrand: Ascivan → She Model Tech

- 269 display-name references across 74 files now read **She Model Tech**.
- New brand assets generated from the She Model Tech logo:
 - The glasses mark was extracted and rendered as the full square icon set,
 reusing the existing filenames so every reference kept working:
 `512X512.png`, `192x192.png`, `144x144.png`, `96X96.png`, `72X72.png`,
 `48X48.png`, `1080.png`, and `favicon.ico`.
 - The full horizontal lockup was added as
 `/Images/she-model-tech-logo.png` and is now used in the Navbar, the
 Footer, and both LandingPage logo slots (where there's room for a
 wordmark). Tight square slots (sidebar, post composer, Project Vault
 certificate) keep the square mark.
 - `public/Images/ascivan-logo.png` was deleted.
- Service-worker cache key renamed (`Ascivan-v1` → `she-model-tech-v1`), which
 also busts stale caches on deploy.
- `package.json` name changed from the stale `loomiq` to `she-model-tech`.
- Firestore rules header renamed from `Loomiqe` to `She Model Tech`.

### New: `src/config/brand.js`

Single source of truth for the brand: name, domain, support email, social
handles, logo paths, and the logo's colour values.

### Deliberately NOT renamed (live infrastructure)

These still say "ascivan" on purpose - renaming them before the replacements
exist would break production:

| Value | Where | Why |
|---|---|---|
| `ascivan-5b4f4` | `src/firebase/config.js`, `lib/firebaseAdmin.js`, `vercel.json` | The actual Firebase project ID |
| `shemodeltech.com` | auth emails, digest emails, notification links | The live domain |
| `info.ascivan@gmail.com` | Support, Privacy, Terms, dashboard | The live support mailbox |
| `linkedin.com/company/ascivan*` | DigitalSolutionsHome | The live LinkedIn pages |

The first three are centralised in `src/config/brand.js`. When the new domain
and mailbox are live, update them there (plus the matching env vars and the
`vercel.json` route).

---

## 2. Everything is free - the Premium tier is gone

There are no longer any paid tiers, plan checks, quotas, or paywalls.

### Removed features / gates

- **Talent Board paywall** - the board is now open to every signed-in member.
- **Messaging restrictions** - free company accounts could not start any
 conversation, and free individuals could not message company accounts. Both
 gates removed; messaging is unlimited for everyone.
- **Recruiter outreach cap** (was 5 new contacts/month) - removed.
- **Job post cap** (was 2 posts/month) - removed.
- **Paid-project posting gate** - previously required a Premium plan. Anyone
 can now post a paid project. (Paid projects themselves still work: a company
 pays members per role. That's money to your members, not a platform fee.)
- **PRO badge** - removed from profiles, the members directory, the dashboard,
 the support page, and the sidebar nav.

### Deleted files

- `src/Pages/PremiumSuccess.jsx` (route `/premium-success` now redirects to
 `/dashboard`)
- `src/config/payment.js`
- `api/webhooks/stripe.js`, `api/webhooks/paypal.js`
- `api/admin/auto-subscribe-users.js`, `api/admin/check-premium-expiry.js`
- `src/components/DirectoryAccessControl.jsx` - dead code containing a $29.99
 members-directory paywall (was not referenced by any route)
- `src/Pages/admin/DirectoryAccessManager.jsx` - dead admin screen for managing
 paid directory subscriptions (also unreferenced)

### Compatibility shims (kept so no call site breaks)

- `src/components/PremiumBadge.jsx` - `<PremiumBadge />` renders `null`;
 `isPremium()` always returns `true`, so any gate it still guards is open.
- `src/utils/recruiterOutreach.js` - every status check reports unlimited; the
 recording functions are no-ops.

New code should not import from either.

### Rewritten copy

- **Settings** - the "Membership" tab is now **"What's included"**: a single
 free panel listing everything every member gets. The two-plan comparison
 grid and the Stripe/PayPal buttons are gone.
- **Dashboard** - the "Current Plan" card no longer shows a plan name or an
 upgrade link. The Talent Board card is shown to everyone.
- **Support FAQ** - Premium questions removed; "Is it free?" rewritten; the
 Talent Board and paid-project answers no longer mention plans. The direct
 email contact box is now shown to every member, not just Premium.
- **Terms of Service** - §10 "Membership Tiers" replaced with a plain
 statement that the platform is free and has no tiers.

### Firestore

- `firestore.rules`: the `isPremium()` function and the `outreach` /
 `jobposts_quota` rule blocks were removed (no rule = deny; nothing writes
 them any more). `directory_access` rules removed too.
- `vercel.json`: the `check-premium-expiry` cron job was removed.
- The `outreach`, `jobposts_quota`, and `directory_access` collections are now
 unused and can be deleted from Firestore whenever convenient.

---

## 3. Pre-existing bugs fixed along the way

- **`src/components/Navbar.jsx` - conditional hooks.** `useState` and two
 `useEffect` calls sat *after* an `if (inAppShell) return null;` early return,
 violating the rules of hooks. This is a real crash risk when navigating
 between shell and non-shell layouts, and it was invisible because `npm run
 build` sets `DISABLE_ESLINT_PLUGIN=true`. The early return now happens after
 all hooks.
- **`lib/firebaseAdmin.js` - wrong fallback project.** Both `project_id` and
 `projectId` fell back to `loomiq-8c3e9`, which is not this project. If
 `FIREBASE_PROJECT_ID` were ever unset in the Vercel environment, all
 server-side Firebase calls would silently target the wrong project. Now
 falls back to `ascivan-5b4f4`, matching the client config.

### Still open (not changed - may be intentional)

- **`src/Pages/PostJobs.jsx` ~line 247**: `category` is assigned twice in the
 same object literal - `category: 'job'` is immediately overwritten by
 `category: formData.category`. ESLint flags this as `no-dupe-keys`.

---

## 4. Worth deciding: there is no longer a company trust signal

The Premium badge was quietly doing double duty as **company verification**.
The old Support FAQ told members to prefer companies with the verified badge
and warned that unverified companies "carry more risk."

With the paid tier gone, that signal no longer exists. The FAQ now says
company accounts are self-declared and advises real due diligence (check the
profile and posting history, search for the organisation independently, be
wary of anyone asking for money, bank details, or ID documents).

That's the honest version, but members are applying to these companies and
sometimes doing unpaid work for them. A free verification path - manual
review, domain-email confirmation, or similar - is worth considering.

---

## Build status

`npm run build` compiles successfully. Verified against a baseline build of
the original code: **zero new ESLint warnings introduced**. All remaining
warnings pre-date this update.

---

## 5. Domain, email, and brand identity (second pass)

### Domain → shemodeltech.com
- Swapped across 16 files, including auth emails, digest emails, notification
 links, and the **certificate footer** (the most visible leak, certificates
 get posted to LinkedIn).
- `SITE_URL` env var now overrides it everywhere, so a future domain change is
 configuration, not a code edit.

### Email → shemodeltech@gmail.com
- **Found and fixed a live breakage:** every notification email was still
 branded "Favored Online ProjectX" and linked to `favoredonline.com`, a dead
 domain, application rejections, badge awards, project reviews, all of it.
 Support was directed to `info.favoredonline@gmail.com`.
- Fixed in `api/notifications/[type].js`, `functions/index.js`, and
 `lib/nodemailer.js`. Site URL and support address now read from `SITE_URL`
 and `SUPPORT_EMAIL`.
- The GitHub-collaborator requirement in the review-rejection email (inherited
 from Favored Online) now names the `SHEMODELTECH` org explicitly.

### Brand identity
- Palette sampled directly from the supplied artwork and stored in
 `BRAND.colors`: pink `#F544CB` (primary), pinkDeep `#F72585`, magenta
 `#EB48D5`, purple `#8948EB`, green `#00E78E`, mint `#48EB94`, mintPale
 `#E5F2E4`, ink `#353331`.
- Tagline stored as `BRAND.tagline` / `BRAND.taglineWords`.
- Brand shapes installed at `public/Images/brand/` (arc, sparkle, wave, bar,
 star, burst) and the team photo as `team-hero.png`.
- **New `src/components/BrandLockup.jsx`**, rebuilds the "Empower / Connect /
 Thrive" artwork: Archivo Black, outlined words via `-webkit-text-stroke`
 with `paint-order`, "Connect" solid pink, decorative shapes positioned
 around it. Accessible (`aria-label` on the heading, shapes `aria-hidden`).
- The landing hero previously read "Ascend Achieve Advance", the old Ascivan
 tagline. Replaced with the lockup, and the hero copy now names the actual
 audience.
- `theme-color` updated from the old orange to brand pink.

---

## 6. OPEN, critical security hole in firestore.rules

Not yet fixed. In the live rules:

```
match /member_badges/{id} { allow read: if isSignedIn(); allow write: if isSignedIn(); }
match /certificates/{id} { allow read: if isSignedIn(); allow write: if isSignedIn(); }
```

`allow write: if isSignedIn()` means **any logged-in user can create, edit, or
delete any badge or certificate, including other people's.** Security rules
protect the database, not the UI: anyone with a free account and the Firebase
JS SDK can award themselves a Gold badge from a browser console, or delete
someone else's.

This is the platform's core value (verified proof of work), so it must be
fixed before launch. Badges should be writable only by the project owner
completing an approved project, or an admin, never by the recipient.

The same `read, write: if isSignedIn()` pattern applies to `groups`,
`applications`, `tech_events`, `companies`, and `career_analyses`.

Also note: the **live rules are newer than this repo** (the deployed
`isPremium()` includes `role == 'editor'`, this repo's did not). Check for
other drift before deploying.

---

## 7. Cohort system (build in progress)

### New Firebase project
`she-model-tech` (nam5). Config swapped across 8 files. Storage bucket is now
`she-model-tech.firebasestorage.app`, no "ascivan" in image URLs.

### firestore.rules v2
- **Closed a critical hole**: `member_badges` and `certificates` were
 `allow write: if isSignedIn()`, meaning any logged-in user could award
 themselves a Gold badge from a browser console, or delete someone else's.
 Now only the owner of the originating project (or an admin) can create one,
 and they're immutable after award.
- Removed the lead self-claim path (`submitterId` is reviewer-writable only).
- `editor` is a real reviewer role: runs cohorts, reviews lead applications,
 approves submissions, no delete powers.
- New collections: `cohorts`, `lead_applications`, `waitlist`.
- Old rules kept as `firestore.rules.v1-backup`.

### Cohorts (`src/utils/cohorts.js`)
8-week back-to-back cycles. Reveal at week 2, lead applications close week 3,
leads assigned week 4, contributors open week 5, teams lock week 7. 7-day
grace period. `getCohortStats()` gives completion rate, the number that
matters to partners.

### Generation
`batchGenerateProjects` now defaults to **6** (was 24) and tags every project
with `cohortId`, `cohortNumber`, `startDate`, `endDate`. Created as drafts
(`isActive: false`) so briefs are reviewed before reveal.

### Lead selection (`src/utils/leadApplications.js`)
Replaces first-come self-claim. Applicants rank up to 3 projects. Reviewers
interview (Google Meet link + time stored, no calendar OAuth), take private
notes, then assign / offer a contributor role / reject.
`rejectAsLeadInviteAsContributor()` is one click, someone confident enough to
apply to lead is exactly who you want on a team.
`getFallbackCandidates()` surfaces people who ranked an unled project 2nd/3rd.

- `/cohort/apply-to-lead`, member application form
- `/admin/lead-applications`, reviewer queue, grouped by project

### Lead responsiveness (`src/utils/leadHealth.js`)
Three signals: passive workspace activity (10+ days quiet), a weekly lead
check-in dead-man's switch (2 misses = flag), and member flags (2 independent
members required). All feed a reviewer queue, **nothing auto-removes a lead**.
On reassignment the outgoing lead stays on the project and can still earn a
contributor badge.

### Reminder cron (`api/cron/project-reminders.js`, daily 08:00)
Emails the **whole team** at T-14/7/3/1/0, moves projects into grace, lapses
after grace, and computes lead health server-side.
- Idempotent via `reminder_log`, retries cannot double-email.
- Concurrency-capped (4) over a pooled connection, 400/run ceiling.
- Fail-soft per project; `CRON_SECRET` bearer auth.

**Performance:** `getProjectsNeedingReview()` was an N+1 (201 sequential reads
at 200 projects, a ~20s frozen tab). The cron now writes `leadHealth` onto
the project doc, so the reviewer queue is ONE indexed query with a limit of 50.

### GitHub submission
`src/utils/githubSubmission.js` + `SubmissionForm.jsx`. Requires a valid repo
URL (rejects gists, profiles, org pages) **and** confirmation that
`SHEMODELTECH` was invited as a collaborator, a public link proves a project
exists, commit history proves who built it. Submit stays disabled until both
are satisfied. Reviewer verifies before approving
(`collaboratorConfirmedByReviewer`).

### Review rounds
`reviewRound` and `changesRequestedCount` are tracked and shown as "Attempt 3".
No hard cap, but you can now see when a team is on attempt 5, which is the
signal to stop reviewing async and talk to the lead.

### Permissions (`src/utils/permissions.js`)
Mirrors `firestore.rules`. Fixed a real bug: `AdminDashboard` gated on an
`adminUsers` collection keyed by email while `AdminPanel` used `users.role`, under v2 rules the email-based check would have **locked you out of your own
dashboard**. Both now use `users.role`.

### Extensions & grace
`DeadlineBanner.jsx` shows countdown, grace, and lapsed states. Leads request
a one-week extension with a reason; **a reviewer must approve**, automatic
extensions make the deadline meaningless.

Lapsed projects are never deleted or marked failed. Work stays visible, late
submission is allowed, and a reviewer can still award badges for genuine
contributions.

### Still to build
Cohort admin panel (create cycle, reveal, advance phase), extension
approval UI, certificate IDs + public verification page, waitlist UI,
upcoming-projects section in the weekly digest.

---

## 8. Revenue structure: sponsorship, talent access, company-hosted cohorts

**Women pay nothing, ever.** All revenue is charged to companies. No bundle
tier (deliberately dropped, it muddied the sponsorship/access separation).

### Free for companies (`src/config/companyAccess.js`)
Activity Wall, claps, unlimited role posting, **5 outbound DMs**, and
**unlimited replies** to any member who contacts them first. Members are
never metered, a member can message any company, without limit, always.

An empty platform is worth nothing, and blocking a company from reaching a
member blocks the member's opportunity. We sell TOOLING (search, badge
filtering, verified evidence, volume), never permission to see members exist.

### 1. Cohort sponsorship (`src/utils/sponsorships.js`)
One-off, funds stipends for **one team** (easier sale than a whole cohort; a
cohort can carry several sponsors or mix sponsored and unsponsored teams).

- **22% retained for overhead** (`OVERHEAD_RATE`). Passing through 100% means
 the organisation runs on the founder's own money.
- `SPONSOR_ENTITLEMENTS`: read-only progress, name + logo, weekly-email
 acknowledgement, impact report, 14-day first look, demo day invite.
- `SPONSOR_LIMITS`: no workspace access, no team seat, no specifying
 requirements, no reviewing deliverables. **The team owns its code.**
- Sponsors may WATCH, ACKNOWLEDGE and RECRUIT, never DIRECT, REVIEW or OWN.
 Crossing that line turns a stipend into a wage and makes us a staffing
 intermediary.
- `SponsorTag.jsx` shows sponsor name + logo on the funded project, visible to
 members too. Unsponsored teams show "Community cohort" so no sponsor never
 reads as lesser.

### 2. Talent Access (recurring)
Talent Board search, badge filtering, verified evidence, saved candidates,
unlimited outreach. Independent of sponsorship, either can be bought alone.

**Verification is NOT sold.** The verified badge is how a member traces who
she's dealing with. It's earned by submitting registration details and is
free. If purchased, a scammer would simply stay unverified while a legitimate
small company looked untrustworthy, inverting the safety signal.

### 3. Company-hosted cohorts (`src/utils/companyCohorts.js`)
A verified, subscribing company runs its own project: writes the brief, sets
the timeline, hires **every** role including the lead, reviews and interviews
its own applicants, approves completion, and pays members directly.

| | SMT cohort | Company cohort |
|----------------|-----------------------|-----------------------|
| Brief | SMT generates | Company writes |
| Timeline | Fixed 8 weeks | Company decides |
| Lead | SMT interviews/assigns| Company hires |
| Final review | SMT approves | Company approves |
| **Badges** | **Yes, SMT verified**| **No. Never.** |
| Money | None / SMT stipend | Company pays members |
| Certificate | Issued by SMT | In company's name |

**Companies can never award badges.** The badge's entire value is that *we*
verified it. If a company could mint one, anyone could register a company
account, run a token project, and issue credentials, collapsing the asset we
sell to every other employer. `awardsBadges: false` is enforced in
firestore.rules on create AND update.

**Members get a Verified Work Experience record** (`work_records`) instead:
paid, dated, role-attributed, issued in the company's name with She Model Tech
named as facilitator. Different claim ("she was hired and paid" vs "we
assessed her work"), so it carries weight without diluting the badge. Rules
prevent a member creating her own.

**Badge-gated applications:** members need ≥1 earned badge to apply. This makes
the free SMT cohort the on-ramp to paid work, gives companies pre-vetted
applicants, and gives the badge cash value. Fails CLOSED on read error.

**Non-payment defences:** verified companies only; the existing
payment-confirmation + dispute room (a member can confirm or dispute only her
own entry and can never change what she is owed, enforced in rules); and the
subscription as leverage. Either side can report the other.

**Every role must carry pay.** Unpaid company work is rejected at creation.

### Retired
"Post a paid project" is gone, it made us look like a freelancer marketplace.
Company accounts are redirected to `/company/host-cohort`. The payment
*machinery* was kept and repurposed for stipends and company payouts.

### New routes
- `/company/host-cohort`, company creates its own project
- `/cohort/apply-to-lead`, member lead application (ranked choices)
- `/admin/lead-applications`, reviewer queue

### Firestore rules
Added `company_cohorts`, `company_cohort_applications`, `work_records`,
`sponsorships`, `outreach`. 552 lines, braces balanced.

### Not built yet
Payment collection/payout (invoiced manually for now, marked "coming soon"),
sponsor read-only dashboard, partner pitch page (`/partner`), company cohort
detail/apply pages, cohort admin panel, certificate verification.

---

## 9. Payments, partner pages, company cohort browse/apply

### Stripe, MONEY IN ONLY (deliberate)
`api/payments/create-checkout.js` + `api/payments/stripe-webhook.js`.
Handles Talent Access subscriptions (recurring) and cohort sponsorships
(one-off). `stripe` added to package.json.

**Stripe does NOT pay members.** On company-hosted cohorts the company pays
members directly and we never touch the funds. That's not a gap, it's what
keeps the structure safe:
1. Collecting a company's money and paying it out to members makes the
 substance "company bought labour, platform was middleman", the staffing
 intermediary position we deliberately avoided, with worker-classification
 exposure attached.
2. Moving other people's money is money transmission, Stripe Connect,
 per-member KYC, much heavier compliance.

Sponsorship stipends are different: sponsor pays the nonprofit, the nonprofit
pays a participant stipend. Our own money going out, not a passthrough. Paid
manually until volume justifies Connect.

**Security:** the webhook is the ONLY place partner access is granted, never
the browser, never the success page (anyone can navigate to a success URL).
Signature verified against raw body (`bodyParser: false`), events deduped via
`stripe_events` so Stripe's retries can't double-apply. `create-checkout`
verifies the Firebase ID token server-side rather than trusting a uid from the
client, and refuses payment from member accounts entirely.

A single failed invoice flags the account but does **not** cut access, cards
expire, and abrupt cut-off mid-hiring punishes everyone.

### New pages
- `/partner`, two products side by side, **no bundle**. Free tier listed
 first so companies see they can participate without paying.
- `/sponsor/dashboard`, read-only progress, stipend split, impact report.
 States `SPONSOR_LIMITS` on the page itself: sponsors drift toward
 involvement once they've paid, so the boundary is said out loud rather than
 discovered in week six. Repo link appears only after SMT approval.
- `/company-cohorts`, browse open paid projects. **Visible to members without
 a badge**, who simply can't apply yet; hiding paid work from them would
 remove the reason to earn a badge.
- `/company-cohorts/:id`, roles with pay shown BEFORE applying, badge-gated
 apply, and a "report a problem with this company" action wired to the
 dispute flow. States plainly that no badge is awarded and why.

### Env needed
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
`REACT_APP_STRIPE_PRICE_MONTHLY`, `REACT_APP_STRIPE_PRICE_ANNUAL`.
Webhook endpoint: `https://shemodeltech.com/api/payments/stripe-webhook`
(events: `checkout.session.completed`, `customer.subscription.updated`,
`customer.subscription.deleted`, `invoice.payment_failed`).

---

## 10. Membership built but DORMANT + secure activation

### One flag controls everything
`src/config/membership.js` → `MEMBERSHIP_ENFORCED = false`

While false: every company gets full Talent Access free, nothing is gated, no
payment prompts appear anywhere. Flip to `true` when the talent pool is worth
paying for and the entire system wakes up, no other code changes.

This is deliberate: a paywall with nothing behind it drives companies away
before there's anything to sell them.

### SECURITY: the redirect URL does NOT grant access
The requested flow was "paste a payment link, redirect users to a page, they
get premium." **That would make your paid tier public within a week of the
first sale.** A redirect URL is just a web address, anyone who sees it once
can share, bookmark, or guess it. Payment platforms also redirect on
*completion of the flow*, not *confirmed settlement*; users can often reach
the redirect without money moving.

Implemented instead:
- `/partner/activate` (the redirect target) records a **claim**, company,
 plan, and payment reference, and notifies an admin. It grants nothing.
 It auto-captures the reference from common URL params (`reference`,
 `trxref`, `session_id`, `transaction_id`, `tx_ref`).
- `/admin/activations` is where access is switched on, after you confirm the
 payment landed. One click. Also supports granting access directly (for
 invoiced/comped partners) and revoking it.
- Firestore rules enforce this: a company can only create a claim with
 `status: 'claimed'`; only a reviewer can change it or set `tier: partner`.

At a handful of sales this is seconds of work per sale and cannot be gamed.
When volume justifies automation, set `ACTIVATION_MODE = 'stripe_webhook'`, that path is already built and verifies payment cryptographically.

While dormant, `/partner/activate` tells visitors everything is free and
offers a refund if they were charged in error.

### Payment links
`PAYMENT_LINKS` in `membership.js` reads from
`REACT_APP_PAYMENT_LINK_MONTHLY`, `_ANNUAL`, `_SPONSOR`. Leave unset to hide
the buttons. Works with any provider, Stripe Payment Links, Paystack,
Flutterwave.

### New routes
`/partner/activate`, `/admin/activations`

---

## 11. Early bird access (not "Founding Partner")

Talent Access is **open to every company now**, free. Gating an empty Talent
Board protects nothing and makes it look like you're charging for air, and you need company accounts present to test verification, messaging and hosting
at all.

Deliberately NOT called "Founding Partner": that implies a permanent status
you'd have to honour later. "Early access" expires on its own.

### The trial clock starts at ENFORCEMENT, not signup
`TRIAL_MONTHS = 3`, `ENFORCEMENT_START_DATE = null`.

A company joining today would otherwise burn its 3-month trial during a period
when everything was free anyway, it would read as "expired" while nothing was
gated, and they'd have had no real trial when charging actually began.

So while dormant, **no trial is consumed**. On the day you flip
`MEMBERSHIP_ENFORCED = true`, set `ENFORCEMENT_START_DATE`. Every existing
company then gets 3 months from that date; later signups get 3 months from
their own signup. `trialEndsAt()` takes whichever is later.

### AccessBanner.jsx
Shown on the Talent Board (companies only, invisible to members). Three states:
- **Dormant**, "Free early access… when paid plans begin you'll get 3 months
 free before anything is charged."
- **In trial**, days remaining, turning amber under 14 days. States plainly:
 no card on file, nothing charged automatically.
- **Trial ended**, what's still free (posting roles, replying, community) vs
 what needs a plan.

The point is honesty about timing. Free for a year followed by a surprise
paywall reads as a bait and switch and loses the companies. Saying it from the
first screen costs nothing now and makes charging later expected.

---

## 12. New logo, tagline, and certificate verification

### Logo
New lockup installed. White background made transparent, portrait mark
extracted for square slots (512/192/144/96/72/48/1080 + favicon), full lockup
for hero and footer.

### Tagline: Achieve · Ascend · Advance
`BRAND.taglineWords` drives `BrandLockup.jsx` (which now maps over the array
rather than hardcoding words), so the lockup and the logo can never drift
apart again.

### Certificate verification, this is what makes certificates evidence
Previously a certificate was a rendered image with no ID. Anyone could edit
the name in Photoshop and produce something indistinguishable from the real
thing; a recruiter had no way to check.

Now:
- Every certificate gets a unique ID: `SMT-4K2P-9XRT`. The alphabet excludes
 O/0 and I/1/L, these IDs get read aloud, retyped from print, and OCR'd.
- **`/verify/:id` is PUBLIC**, no login, no account. If verification required
 signing up, nobody would use it and certificates would be decoration again.
- The certificate itself now carries a **QR code** plus the ID, on both the
 on-screen and print/PDF versions. One scan.
- `certificate_verifications` is publicly readable in firestore.rules, and
 holds ONLY what's already printed on the certificate: name, project, role,
 dates, badges. No email, no uid, no contact details, you cannot walk
 backwards from a certificate to a member's private data.
- Records are immutable once issued; revocation is an admin action, and a
 revoked certificate verifies as explicitly invalid rather than missing.
- `ensureCertificateId()` back-fills IDs onto certificates issued before this
 existed.

### When to flip MEMBERSHIP_ENFORCED
Not a date, a threshold. Roughly 50–100 badge holders, 2–3 completed
cohorts, ideally one company that has already hired. At 8-week cycles of ~30
women that's 4–5 cohorts, realistically mid-to-late 2027. Charging before the
board has depth is what makes companies cancel.

---

## 13. Calendar invite, cohort manager, sponsor page

### Google Calendar button (previously promised, now actually built)
`src/utils/calendarInvite.js` + a button on the lead review screen.

Pick a time → "Open in Google Calendar" opens a pre-filled event: title, time,
description, and **the applicant already added as a guest**. Reviewer clicks
"Add Google Meet", saves, and Google emails the invitation. The Meet link is
then pasted back so it also reaches her in-app notification.

No OAuth. The Calendar API would create the event and Meet link automatically,
but it needs a calendar scope, a scarier consent screen for every user at
signup, token storage and refresh, to save two clicks on ~6 interviews per
8-week cycle. Revisit at 30 interviews a cycle.

### `/admin/cohorts`, CohortManager
Create a cohort (dates computed from the 8-week schedule and previewed before
you commit), generate 6 draft projects, read the briefs, reveal, advance
phases, watch completion.

- **Generation is a button, not a cron.** Auto-publishing six unreviewed
 AI-written briefs into a live cohort means one weak brief wastes five
 women's eight weeks.
- Projects generate as `isActive: false` and are revealed in a single
 `writeBatch`, members hit the page the moment it flips, so it lands
 atomically rather than half-visible.
- Warns while drafts are unrevealed; shows leads assigned, member count, and
 completion rate (the number you show partners).

### `/sponsor`, Sponsor page
Three tiers (one team / two teams / full cohort). States the stipend split
honestly: what reaches the women vs the 22% covering programme costs.

Lists `SPONSOR_ENTITLEMENTS` and, right beneath, `SPONSOR_LIMITS`, no
workspace access, no team seat, no specifying requirements, no reviewing
deliverables. A sponsor expecting to direct the work is really buying client
services, and finding that out on this page is far cheaper than in week six.

While `MEMBERSHIP_ENFORCED` is false the page shows "talk to us about
sponsoring" with a mailto instead of checkout. If `PAYMENT_LINKS.sponsorship`
is set, that takes priority over Stripe.

---

## 14. Foundations courses removed

Learning is a different product with a different quality bar. A shallow course
library sitting beside genuinely verified project work undermines the thing
that makes the badges credible. Removed entirely rather than half-supported.

**Deleted:** `src/Pages/Foundations.jsx`, `src/utils/foundationsCourses.js`,
`foundationsCoursesData.js`, `foundationsContributions.js`, and the
`src/Pages/courses/` content tree.

**Unwired from:** the `/foundations` route, sidebar nav (both member and
company variants), global search (course index, results section, placeholder
copy), AI recommendations (now projects only, prompt rewritten), the admin
contributions review tab (~180 lines), the dashboard cold-start nudge, the
workspace "contribute a lesson" button, and `deleteUserContent`.

**Copy rewritten:** Support FAQ ("I'm new to tech, where do I start?" now
points at joining a cohort, since you learn by building here), Settings
"What's included", Terms §10, the About mission line, and the dashboard
account panel.

**Firestore:** the `foundationsContributions` rule block removed. The
collection is now unused and can be deleted.

### Repairs made during this change
Three self-inflicted issues, all fixed and verified:

1. **Em-dash script flattened indentation across 57 files.** The regex
   collapsed every run of multiple spaces, including leading indentation.
   Code was never broken (JS ignores whitespace) but formatting was mangled.
   Fixed by running Prettier over the affected files; a `.prettierrc` is now
   committed so formatting is reproducible.
2. **Line-range deletion over-cut the dashboard**, removing the stats cards,
   AI recommendations, first-project prompt and track discovery along with the
   Foundations block. Restored from the original, minus Foundations.
3. **Orphaned JSX/catch tails** in `ProjectWorkspace.jsx` and
   `deleteUserContent.js` from the same over-cutting. Repaired.

Verified: build compiles, **zero new ESLint warnings vs baseline**, and the
dashboard section-by-section matches the original.

---

## 15. Members can no longer post paid projects

A gap left over from the earlier company-side change: company accounts were
correctly redirected to `/company/host-cohort`, but **individual members still
saw a "Paid Project" option** with pay-per-role fields (and a stale "PRO"
label from the retired premium tier). That is exactly the freelancer-
marketplace behaviour the model moved away from.

Removed from `ProjectSubmission.jsx`:
- the Free/Paid project type selector
- per-role pay amount inputs
- the total budget summary
- the "roles and pay are locked" confirmation dialog
- paid-branch validation and the company-must-post-paid rule

`projectKind` is gone; submissions always write `isPaid: false`,
`totalBudget: 0`, `payAmount: 0`. The open-role rule (at least one Beginner or
Any Level role) now applies to every project, which is the point of
collaborative work.

**Why removed rather than badge-gated:** member-to-member payment puts us in
the middle of disputes with no way to resolve them. If a member doesn't pay
another member, the complaint lands on us and we have no leverage. A company
holds a subscription and hosting access that can be revoked, so the same
dispute has a real remedy. There is also no revenue upside, since the model
takes nothing from member-to-member payment.

Paid work now comes from companies only: a sponsored cohort, or a
company-hosted project.

Verified: build compiles, zero new ESLint warnings vs baseline.

---

## 16. "Coming soon" pattern on every paid surface

`src/components/ComingSoon.jsx` - one reusable pattern, driven by the same
`MEMBERSHIP_ENFORCED` flag:

- `<ComingSoonRibbon />` - corner tag on the card
- `<ComingSoonButton />` - renders a real `<button disabled aria-disabled>`,
  not a styled div, so assistive tech announces it as unavailable rather than
  as a working control
- `<Price />` - **hides the amount entirely** while dormant, showing "Pricing
  to be announced". The first price a company sees is the one they remember,
  so anchoring a number that may change before launch is worse than showing
  none
- `<ComingSoonNotice />` - one per page, explaining why everything is greyed

Applied to: `/partner` (Talent Access + sponsorship cards),
`/sponsor` (tier list, and the "where your money goes" split, which is
meaningless without a committed price), and `/company/host-cohort` (the
hosting gate).

The `/sponsor` page itself stays reachable and its "talk to us about
sponsoring" mailto stays live - a company that wants to fund a cohort this
year should be able to reach you. Only the self-serve checkout is inert.

Flipping `MEMBERSHIP_ENFORCED` to true reverts every one of these to a live
button with real pricing, with no further edits.

---

## 17. Admins and editors bypass all "coming soon" gating

Reviewers need to exercise checkout, sponsorship and hosting BEFORE launch. A
paywall they cannot get past means those paths ship untested, and the first
person to hit a bug in them would be a paying customer.

`usePaidFeaturesVisible(uid)` in `permissions.js` is the single question every
paid surface now asks: **enforced OR reviewer**. Wired into:
- all four `ComingSoon` components (ribbon, button, price, notice)
- the Sponsor page's inline gates
- the HostCohort gate
- `companyAccess.isPartner()` - reviewers always have partner capabilities
- `canHostCohort()` - reviewers bypass verification AND subscription
- `canApplyToCompanyCohort()` - reviewers bypass the badge requirement

Reviewers see a purple **"Reviewer preview"** notice instead of "coming soon",
so a preview is never mistaken for the member-facing experience.

### Permission caching (required by the above)
The Partner page renders ten permission-aware components. Naively each would
issue its own Firestore read on mount: ten round trips to answer one question.

`permissions.js` now has a module-level cache keyed by uid, plus an in-flight
map so concurrent mounts share a single read. Two deliberate details:
- **Failures are not cached.** A transient network error must not lock someone
  out of the admin panel for the whole session.
- **`clearPermissionCache()` is called on logout** (`AuthContext`), so on a
  shared device the next person to sign in cannot inherit the previous user's
  role.
