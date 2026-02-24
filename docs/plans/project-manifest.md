<!-- SPLIT_MANIFEST
01-brand-color-scheme
02-communication-hub
03-payment-integration
04-social-media-news-feed
END_MANIFEST -->

# Project Manifest: PC Athletic Boosters Platform Integration

> **Decision:** Drop BoosterHub. Build a community-first platform using Stripe + Mailchimp (email + SMS) + Canva + Curator.io on the existing Next.js site. GroupMe dropped -- Mailchimp handles all outbound communication; Facebook Group handles real-time discussion.

---

## Split Overview

### 01-brand-color-scheme (Foundation)

**Purpose:** Update the site's color palette from the current WCAG-failing colors to proper PCHS school colors, establishing correct branding before all other integrations.

**Scope:**
- Replace `--color-pc-red: #EF2B24` with `#CC0033` (Vivid Crimson, matches BSN Sports, passes WCAG AA at 5.80:1)
- Replace `--color-pc-dark: #0f172a` (navy) with `#111111` (near-black, matches red/white school convention)
- Add supporting palette tokens (red-dark, red-light, grays)
- Update `--shadow-glow` to use new red rgba
- Verify all components render correctly with new colors
- Run accessibility audit on key pages

**Key decisions needed:**
- Whether to keep `#EF2B24` as a highlight/glow variant
- Whether to add the optional gold accent color (`#D4A843`)
- How to handle any components that depend on navy-specific styling

**Outputs:** Updated `globals.css` @theme block, verified build, accessibility check

**Effort estimate:** Small (1-2 sessions)

---

### 02-communication-hub (Core -- Highest Priority)

**Purpose:** Build the self-registration and targeted communication system that makes the booster club the central hub for PC athletics families.

**Scope:**
- Set up Mailchimp Essentials account (~$133/yr with 15% nonprofit discount)
- Enable Mailchimp SMS add-on ($20/mo = ~$240/yr) for text message blasts
- Configure Mailchimp Groups for sport/age/gender self-selection
- Design and build signup form (embedded Mailchimp form or custom Next.js form)
- Include communication preference field: email, SMS, or both
- Create membership signup flow on the site (interest-based, not just payment)
- Add "Join Our Community" / "Stay Connected" CTAs to the site
- Build email template matching site branding (PCHS colors)
- Configure segmentation tags: sport, age group, role (parent/coach/volunteer)
- Set up volunteer signup workflow (Google Form or SignUpGenius -> Mailchimp "volunteer" tag)
- Document admin procedures for sending targeted vs. broadcast emails and SMS
- Create Facebook Group for real-time discussion/coordination (complements Mailchimp broadcasts)

**Key decisions needed:**
- Embedded Mailchimp form vs. custom Next.js form (UX control vs. simplicity)
- Which sports/age groups to list (youth flag football through varsity)
- Signup flow: standalone page vs. modal vs. section on existing pages
- Whether to expose a "communication preferences" page for existing members
- How to handle the "boosters as bridge" vision -- separate youth vs. HS sections?
- Google Form vs. SignUpGenius for volunteer signups
- Facebook Group naming and moderation strategy

**Outputs:** Working signup flow, Mailchimp configured with Groups + SMS, email template, volunteer signup workflow, Facebook Group created, admin documentation

**Total annual cost for this split:** ~$373/yr (Mailchimp Essentials + SMS)

**Effort estimate:** Large (3-5 sessions)

---

### 03-payment-integration (Medium Priority)

**Purpose:** Replace all BoosterHub transaction links with Stripe Payment Links and Buy Buttons for professional, on-site payment UX.

**Scope:**
- Set up Stripe account with branding (PCHS colors, logo, font)
- Create Payment Links:
  - Annual recurring memberships (4 tiers: Rookie, Captain, All Star, MVP)
  - Monthly recurring donations ("customer chooses amount")
  - One-time donations
  - Spirit wear items (per-item links)
- Embed Buy Buttons on membership, initiatives, and store pages
- Refactor `lib/constants.ts` from `BOOSTERHUB_URLS` to `PAYMENT_URLS` + `COMMUNITY_URLS`
- Update all 11 BoosterHub link references across 8 components
- Remove or rename "Member Login" links (BoosterHub is being dropped)
- Update disclaimer copy on all affected pages
- Configure Stripe success redirect URLs
- Document Stripe Dashboard usage for treasurer

**Key decisions needed:**
- Membership tier pricing (currently placeholder $X/yr)
- Whether to offer monthly membership option or annual-only
- Spirit wear variant handling (separate links per size/color, or pre-purchase form)
- Success page design (confirmation + prompt to join Mailchimp list)
- Whether to set up Stripe custom domain (`pay.pcathleticboosters.org`)
- Volunteer signup destination (keep BoosterHub link? Google Form? Custom form?)

**Outputs:** Stripe account configured, Payment Links created, Buy Buttons embedded, constants refactored, all pages updated

**Effort estimate:** Medium (2-3 sessions)

---

### 04-social-media-news-feed (Supporting)

**Purpose:** Establish the booster club's social media presence and embed live content feeds on the site.

**Scope:**
- Apply for Canva for Nonprofits (free Pro for 501(c)(3))
- Set up Meta Business Suite for Facebook Page and Instagram
- Create booster club social media accounts if they don't exist
- Configure Curator.io (free plan) to aggregate Facebook + Instagram + 1 more source
- Build social feed component on the News page using `next/script` with `lazyOnload`
- Evaluate RSS widgets for local sports news (Port Clinton News Herald, Sandusky Register)
- Add social media follow links to the site (header, footer, or sidebar)
- Performance optimization: lazy-load all widgets below the fold
- Document social media posting workflow for board members (Canva -> schedule)

**Key decisions needed:**
- Which social platforms to launch on (Facebook + Instagram + X? TikTok?)
- Where on the site to place the social feed (News page? Homepage section? Both?)
- Layout for the Curator.io feed (grid, waterfall, carousel, list)
- Whether to include RSS news feeds from local papers
- Social media content strategy (what to post, how often, who posts)
- Whether the News page needs a redesign to accommodate feeds

**Outputs:** Social accounts created, Canva for Nonprofits approved, Curator.io feed embedded, social links on site, posting workflow documented

**Effort estimate:** Medium (2-3 sessions)

---

## Dependency Graph

```
01-brand-color-scheme (foundation)
         |
         v
    ┌────┴────┬────────────────┐
    │         │                │
    v         v                v
02-comms   03-payments   04-social
  hub      integration   media/news
```

**Split 01** is the only blocking dependency. All other splits can run in **parallel** after 01 completes.

**Light coupling between 02 and 03:** Stripe success pages could prompt users to join the Mailchimp list. This is a nice-to-have cross-integration, not a blocking dependency. Plan for it in both specs but implement last.

---

## Execution Order

| Priority | Split | Can Start After | Parallel Group |
|----------|-------|----------------|----------------|
| **P0** | 01-brand-color-scheme | Immediately | -- |
| **P0** | 02-communication-hub | 01 complete | Group A |
| **P1** | 03-payment-integration | 01 complete | Group A |
| **P1** | 04-social-media-news-feed | 01 complete | Group A |

**Recommended execution:**
1. Start with `01-brand-color-scheme` (small, foundational)
2. Then `02-communication-hub` (the core of the project, highest value)
3. Then `03-payment-integration` (needed but lower urgency given $700K in bank)
4. Then `04-social-media-news-feed` (supporting, enhances presence)

---

## Cross-Cutting Concerns

### Operations Runbook
Each split should include its own admin documentation as a deliverable. No separate "operations" split -- documentation is embedded in each piece:
- Split 02: Mailchimp admin guide (email + SMS), volunteer signup workflow, Facebook Group moderation
- Split 03: Stripe Dashboard guide for treasurer
- Split 04: Social media posting workflow, Canva guide

### Annual Handoff
A consolidated handoff document should be created after all splits are complete, pulling admin guides from each split into a single runbook. This can be a final task in the last split executed.

### BoosterHub Cancellation
Cancel BoosterHub subscription after Split 03 is complete and Stripe is live. Don't cancel before payments are working.

---

## /deep-plan Commands

```bash
/deep-plan @docs/plans/01-brand-color-scheme/spec.md
/deep-plan @docs/plans/02-communication-hub/spec.md
/deep-plan @docs/plans/03-payment-integration/spec.md
/deep-plan @docs/plans/04-social-media-news-feed/spec.md
```
