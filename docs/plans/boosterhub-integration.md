# BoosterHub Integration Strategy & Requirements

> **Document Purpose:** Requirements and strategy document for improving the PC Athletic Boosters transaction and communication experience. Structured for `/deep-project` decomposition into implementation splits.
>
> **Date:** 2026-02-24
> **Audience:** PC Athletic Boosters board, volunteer web team
> **Decision Required:** Select one of four strategic options (A/B/C/D) to proceed with implementation.

---

## Table of Contents

1. [Current State Audit](#1-current-state-audit)
2. [Platform Landscape](#2-platform-landscape)
3. [Strategic Options](#3-strategic-options)
4. [Communication Platform Deep-Dive](#4-communication-platform-deep-dive)
5. [Recommendation](#5-recommendation)
6. [Implementation Requirements](#6-implementation-requirements)

---

## 1. Current State Audit

### 1.1 Architecture Today

The PC Athletic Boosters site follows a "St. Edward model": a custom-built Next.js marketing site handles branding and content, while BoosterHub (`pcathleticbooster.boosterhub.com`) acts as the backend "cash register" for all transactions. Every purchase, signup, or login requires users to leave the custom site and land on a BoosterHub-hosted page.

**URL management:** All BoosterHub URLs are centralized in `lib/constants.ts`:

```typescript
export const BOOSTERHUB_BASE = "https://pcathleticbooster.boosterhub.com";
export const BOOSTERHUB_URLS = {
  membership: `${BOOSTERHUB_BASE}/membership`,
  volunteer:  `${BOOSTERHUB_BASE}/volunteer`,
  store:      `${BOOSTERHUB_BASE}/store`,
  login:      `${BOOSTERHUB_BASE}/login`,
  donate:     `${BOOSTERHUB_BASE}/store`,
} as const;
```

### 1.2 BoosterHub Handoff Points (11 Links Across 8 Components)

Every handoff opens in a new tab (`target="_blank"`) with disclaimer text like "You'll be taken to our secure member portal."

| # | Component | Feature | BoosterHub Endpoint | File:Line |
|---|-----------|---------|---------------------|-----------|
| 1 | Navbar | Member Login | `/login` | `components/layout/Navbar.tsx:80` |
| 2 | Navbar | Donate Button | `/store` | `components/layout/Navbar.tsx:90` |
| 3 | Mobile Menu | Member Login | `/login` | `components/layout/MobileMenu.tsx:46` |
| 4 | Mobile Menu | Donate Button | `/store` | `components/layout/MobileMenu.tsx:55` |
| 5 | Footer | Member Login | `/login` | `components/layout/Footer.tsx:75` |
| 6 | Membership Page | Join Now (4 tier cards) | `/membership` | `app/membership/page.tsx:174` |
| 7 | Membership Page | Become a Member CTA | `/membership` | `app/membership/page.tsx:199` |
| 8 | Initiatives Page | Make a Donation | `/store` | `app/initiatives/page.tsx:127` |
| 9 | Store Page | Shop Now | `/store` | `app/store/page.tsx:94` |
| 10 | Volunteer Page | Sign Up to Volunteer | `/volunteer` | `app/volunteer/page.tsx:198` |
| 11 | Resources Page | FAQ text reference | *(inline text)* | `app/resources/page.tsx:47` |

**Unique transaction flows:** 5 (Login, Membership, Donate, Store, Volunteer). The 11 links are entry points across navigation and content pages that funnel into these 5 flows.

### 1.3 Pain Points

| Pain Point | Impact | Severity |
|------------|--------|----------|
| **Visual jarring**: Custom site is polished; BoosterHub pages are generic/dated | Users lose confidence at the moment of payment | High |
| **Brand disconnect**: BoosterHub subdomain, different fonts/colors/layout | Feels like a different organization | High |
| **No embed/API**: BoosterHub is a closed ecosystem with no public API, iframes, or widgets | Cannot integrate transactions into the custom site | Blocking |
| **Communication gaps**: No way to message "2017 boys basketball parents" specifically | Blanket emails or manual list management | High |
| **Chat reliability**: BoosterHub in-app chat loads slowly, messages delayed | Parents fall back to personal texting | Medium |
| **SMS costs**: $0.02/msg on Standard; 500 free/mo on Pro then $0.02 each | Limits communication volume or adds cost | Medium |
| **No cart**: BoosterHub store is one-item-at-a-time | Clunky for spirit wear + membership + donation bundles | Medium |
| **Volunteer turnover**: Technical knowledge walks out the door annually | Any solution must be low-maintenance | High |

### 1.4 What BoosterHub Does Well

Despite UX shortcomings, BoosterHub provides real operational value:

- **POS for concession stands** with cash tracking and fraud guardrails
- **Accounting module** (Advanced on Pro) with transaction tracking and reporting
- **Member database** with unlimited contacts, custom fields, tags
- **Student payment/invoicing** with payment plans
- **BoosterSTUB** QR ticketing (donor-paid fees, free for clubs)
- **BoosterBucks** fundraising (clubs retain 95%)
- **Mobile app** (iOS/Android) for on-the-go management
- **Volunteer coordinator** with one-click signup

**Key insight:** BoosterHub's value is as a *back-office operations platform*, not a customer-facing transaction UX. The strategy should preserve its operational strengths while replacing or bypassing its weak customer-facing pages.

---

## 2. Platform Landscape

### 2.1 All-in-One Booster Club Platforms

#### BoosterHub (Current Platform)

| Attribute | Details |
|-----------|---------|
| **Pricing** | Standard: $650/yr, **Pro: $850/yr**, Pro+Teams: $850/yr + $250/team |
| **Payment Processing** | Usio: 2.79% + $0.15 (credit), 1% + $0.50 (ACH) |
| **Website** | Auto-updating "Smart Website" on subdomain |
| **Communications** | Email (all plans), SMS ($0.02 or 500 free/mo on Pro), in-app chat |
| **POS** | Yes -- concessions, merchandise, events |
| **Mobile App** | iOS and Android |
| **API/Embeds** | None. Closed ecosystem. |
| **App Store Rating** | 3.4/5 (iOS, 18 ratings) |

#### BoosterSpark

| Attribute | Details |
|-----------|---------|
| **Pricing** | Starter: $39/mo, Standard: $59/mo, **Pro: $89/mo ($1,068/yr)** |
| **Payment Processing** | Stripe: 2.9% + $0.30, plus BoosterSpark commission (10%/3.5%/0% by tier) |
| **Website** | Template-based builder, free .COM domain, SSL, 15-language translation |
| **Communications** | Email only (15K/yr Standard, 30K/yr Pro). No SMS, no chat, no app. |
| **POS** | None |
| **Mobile App** | None (web-only, responsive) |
| **Sponsorship Mgmt** | Strong -- 56 customizable benefit ideas, auto logo placement |
| **Reviews** | Virtually no third-party reviews (G2, Capterra, Trustpilot) |

#### Membership Toolkit

| Attribute | Details |
|-----------|---------|
| **Pricing** | Essential: $550/yr, **Premium: $850/yr**, Concierge: $1,150/yr |
| **Payment Processing** | LumaPay (Stripe-powered): 2.89% + $0.30. PayPal discontinued. |
| **Website** | Customizable (Premium+), own domain, unlimited pages, blog |
| **Communications** | Email + push notifications + message boards. **Smart distribution lists** by sport/year/role. No SMS. |
| **POS** | None |
| **Mobile App** | Yes (all plans) |
| **Strength** | Best-in-class targeted group messaging and member directory |
| **Weakness** | Designed for PTAs/PTOs, not athletic boosters specifically |

### 2.2 Payment-Only Solutions

#### Stripe Payment Links + Buy Buttons

| Attribute | Details |
|-----------|---------|
| **Pricing** | No subscription fee. 2.9% + $0.30 per transaction. |
| **Setup** | Dashboard-only, zero code. Create link -> paste URL or embed button. |
| **Buy Button** | Embeddable `<stripe-buy-button>` web component; checkout opens as overlay on your site |
| **Customization** | Logo, custom hex colors, fonts (25 options), custom domain (`pay.yourboosterclub.org`) |
| **Custom Fields** | Up to 3 per link (text, dropdown, or number) |
| **Recurring** | Yes -- subscriptions for membership dues |
| **Limitations** | No cart (1 product per link), no inventory tracking, no variant dropdowns, 3 custom fields max |
| **Static Site Compatible** | Yes -- the entire point. No server code needed. |

**Key advantage:** Stripe checkout pages are professionally designed, mobile-optimized, and support Apple Pay / Google Pay. They look dramatically better than BoosterHub's transaction pages and keep users visually closer to the custom site experience.

### 2.3 Communication Platforms

| Platform | Cost | Sub-Groups | Channels | Ease of Use | Best For |
|----------|------|------------|----------|-------------|----------|
| **Band** | Free | Yes (separate groups) | App + push | High | Free sports-focused group chat |
| **GroupMe** | Free | Yes (separate groups) | App + SMS fallback | Very High | Simplest free chat with SMS reach |
| **Mailchimp** | Free-$20+/mo | Yes (tags, segments) | Email (SMS add-on) | Moderate | Polished newsletters, precise segmentation |
| **Remind** | Free-$15K/yr | Yes (classes) | App + SMS + email | Very High | Schools already using it |
| **Konstella** | Free | Yes (school groups) | App + email | High | PTA/PTO with volunteer sign-ups |

### 2.4 Platform Comparison: Cost Summary

Assuming the club is on the BoosterHub Pro plan today at $850/yr:

| Option | Annual Platform Cost | Transaction Fees | Notes |
|--------|---------------------|------------------|-------|
| BoosterHub Pro (current) | $850 | 2.79% + $0.15 | + SMS costs above 500/mo |
| BoosterSpark Pro | $1,068 | 2.9% + $0.30 | 0% BoosterSpark commission on Pro |
| Membership Toolkit Premium | $850 | 2.89% + $0.30 | LumaPay only (PayPal discontinued) |
| Stripe Payment Links only | $0 | 2.9% + $0.30 | No subscription; no back-office tools |
| BoosterHub Pro + Stripe | $850 + $0 | Stripe: 2.9% + $0.30 for web; BH: 2.79% + $0.15 for POS | Dual processing |
| Mailchimp Standard | ~$240/yr | N/A | Communication only |
| Band / GroupMe | $0 | N/A | Communication only |

---

## 3. Strategic Options

### Option A: Optimize BoosterHub (Lipstick on a Pig)

**Approach:** Keep BoosterHub as the sole transaction platform. Improve the handoff experience with better messaging, transition animations, and BoosterHub's built-in branding options.

**Implementation:**
- Update BoosterHub's "Smart Website" branding to match custom site colors/logo as closely as possible
- Add loading/transition interstitials on the custom site before opening BoosterHub tabs
- Improve disclaimer copy to set expectations ("You're being securely redirected to complete your purchase")
- Use BoosterHub's built-in communication tools for group messaging

**Pros:**
- Zero additional cost
- No new platform accounts or migrations
- Minimal development work (a few hours)
- Single platform for all operations

**Cons:**
- BoosterHub pages will still look dated and off-brand
- No API means no real integration -- it's still a full page redirect
- Chat reliability issues persist (slow loading, delayed messages)
- Communication targeting limited to BoosterHub's group structure
- Does not solve the core UX problem -- just makes it slightly less jarring

**Cost:** $0 additional (current $850/yr continues)
**Effort:** Low (< 1 week)
**UX Improvement:** Marginal

---

### Option B: Switch to BoosterSpark (All-in-One Replacement)

**Approach:** Migrate entirely from BoosterHub to BoosterSpark. Use BoosterSpark's website builder as the primary site, or continue using the custom site with BoosterSpark transaction links.

**Implementation:**
- Set up BoosterSpark Pro account ($89/mo)
- Migrate member database from BoosterHub
- Configure store, membership tiers, volunteer signups, and donation pages
- Either: replace custom site with BoosterSpark's website, or update `lib/constants.ts` to point to BoosterSpark URLs
- Set up email communications within BoosterSpark

**Pros:**
- Modern, cleaner interface than BoosterHub
- Uses Stripe for payment processing (trusted, professional checkout)
- Strong sponsorship management (56 customizable benefits, auto logo placement)
- Website builder included with free .COM domain
- 15-language translation

**Cons:**
- $218/yr more expensive than BoosterHub Pro ($1,068 vs $850)
- No POS for concession stands (must keep BoosterHub or find alternative for in-person sales)
- No mobile app
- No SMS messaging
- No in-app chat
- Very few third-party reviews -- hard to assess reliability and longevity
- BoosterSpark website builder is template-limited; custom site is far superior
- Still a redirect-based handoff if using custom site alongside BoosterSpark
- Email capped at 30K/yr on Pro

**Cost:** $1,068/yr (BoosterSpark Pro) -- or $1,918/yr if keeping BoosterHub for POS
**Effort:** Medium (2-4 weeks for migration)
**UX Improvement:** Moderate (Stripe checkout is better, but still a redirect)

---

### Option C: Stripe Payment Links + BoosterHub Backend (Minimal Dev, Pro UX)

**Approach:** Replace all customer-facing BoosterHub transaction links with Stripe Payment Links or embedded Buy Buttons. Keep BoosterHub for back-office operations (POS, accounting, member database) but remove it from the customer journey entirely.

**Implementation:**
- Create Stripe account and configure branding (logo, colors, fonts)
- Create Payment Links for each transaction type:
  - Donations (one-time + recurring, "pay what you want")
  - Membership dues (4 tier-specific links, recurring option)
  - Spirit wear (per-item links or Buy Buttons)
  - Volunteer signup (remains on BoosterHub or moves to a form)
- Replace all 11 BoosterHub links in `lib/constants.ts` with Stripe Payment Links
- Embed Buy Buttons directly on membership, store, and initiatives pages
- Optional: Set up custom Stripe domain (`pay.pcathleticboosters.org`)
- Keep BoosterHub for POS at events, accounting, and member database management
- Manually reconcile Stripe transactions in BoosterHub accounting (or export CSVs)

**Pros:**
- Dramatically better payment UX -- Stripe checkout is modern, mobile-optimized, supports Apple Pay / Google Pay
- Buy Buttons embed directly on the custom site (no redirect for checkout)
- Zero server code required -- fully static-site compatible
- No additional subscription cost (Stripe is pay-per-transaction only)
- BoosterHub retained for its operational strengths (POS, accounting, member DB)
- Custom domain option makes checkout feel on-brand
- Fastest path to professional transaction UX

**Cons:**
- Two payment systems to reconcile (Stripe for web, BoosterHub/Usio for POS)
- Stripe has no inventory management -- must manually deactivate sold-out items
- 3 custom fields max per Payment Link (limits spirit wear variants needing size + color + name + other)
- No cart -- each product is a separate checkout
- Member login still goes to BoosterHub (or remove member login from custom site entirely)
- Volunteer signup still needs a destination (BoosterHub, Google Form, or similar)
- Communication problem remains unsolved -- need a separate solution

**Cost:** $850/yr (BoosterHub continues) + Stripe transaction fees (2.9% + $0.30)
**Effort:** Low-Medium (1-2 weeks)
**UX Improvement:** High

---

### Option D: Best-in-Class Hybrid (Recommended)

**Approach:** Assemble a purpose-built stack:
- **Stripe** for all customer-facing web payments (Payment Links + Buy Buttons)
- **BoosterHub** for back-office operations (POS, accounting, member database)
- **Dedicated communication platform** for targeted group messaging by sport/year/role

This is Option C plus a proper communication solution.

**Implementation:**

#### Phase 1: Payment UX (Week 1-2)
- Set up Stripe account with branding
- Create Payment Links: donations, 4 membership tiers, spirit wear items
- Embed Buy Buttons on membership, store, and initiatives pages
- Update `lib/constants.ts` to use Stripe URLs
- Remove or relocate "Member Login" links (BoosterHub login is back-office, not customer-facing)
- Keep BoosterHub for POS at concession stands and events

#### Phase 2: Communication Platform (Week 2-3)
- Select and configure communication platform (see Section 4 recommendation)
- Build distribution lists: by sport, by year, by role (parent/coach/athlete)
- Migrate or rebuild contact lists from BoosterHub
- Add communication platform links/CTAs to custom site
- Establish communication workflows (who sends what, when, to whom)

#### Phase 3: Operational Cleanup (Week 3-4)
- Document reconciliation process: Stripe Dashboard exports -> BoosterHub accounting
- Create volunteer signup flow (Google Form, Stripe form, or BoosterHub -- TBD)
- Update FAQ and Resources page to reflect new flows
- Train board members on Stripe Dashboard and communication platform
- Write runbook for annual volunteer handoff

**Pros:**
- Best possible payment UX -- Stripe checkout embedded on-site via Buy Buttons
- Best possible communication -- dedicated platform with targeted sub-group messaging
- BoosterHub retained for what it does best -- POS, accounting, member management
- Each component is independently replaceable (no vendor lock-in)
- Stripe has no subscription fee
- Communication platforms like Band and GroupMe are free
- Custom site remains the single front door -- no brand disconnect

**Cons:**
- Three platforms to manage (Stripe + BoosterHub + comms)
- Volunteer training for multiple tools (mitigated by runbook)
- Manual reconciliation between Stripe and BoosterHub accounting
- More moving parts than a single all-in-one platform

**Cost:**
| Component | Annual Cost |
|-----------|-------------|
| BoosterHub Pro | $850 |
| Stripe | $0 subscription (2.9% + $0.30/txn) |
| Communication (Band/GroupMe) | $0 |
| Communication (Mailchimp Standard) | ~$240 if email blasts needed |
| **Total (budget option)** | **$850 + transaction fees** |
| **Total (with Mailchimp)** | **$1,090 + transaction fees** |

**Effort:** Medium (3-4 weeks)
**UX Improvement:** Highest

---

### Options Comparison Matrix

Weighted scoring (1-5 scale). Weights reflect organizational priorities.

| Criterion | Weight | A: Optimize BH | B: BoosterSpark | C: Stripe + BH | D: Hybrid |
|-----------|--------|----------------|-----------------|-----------------|-----------|
| **Payment UX Quality** | 25% | 1 | 3 | 5 | 5 |
| **Maintenance Burden** | 25% | 5 | 3 | 4 | 3 |
| **Communication Capabilities** | 20% | 2 | 2 | 2 | 5 |
| **Cost Efficiency** | 15% | 5 | 2 | 4 | 4 |
| **Implementation Risk** | 15% | 5 | 2 | 4 | 3 |
| **Weighted Score** | | **3.30** | **2.50** | **3.90** | **4.10** |

---

## 4. Communication Platform Deep-Dive

### 4.1 The Problem

The booster club needs to send targeted messages to specific groups:
- "All 2025 boys basketball parents"
- "Football concession volunteers for Friday"
- "Spring sports registration reminder -- track & field families only"
- "Board meeting reminder -- officers and committee chairs"

Currently, BoosterHub offers broadcast email and in-app chat, but:
- Chat is slow and unreliable (hour-long load times reported)
- No granular sub-group targeting beyond basic group structure
- SMS costs extra and is capped
- Parents fall back to personal group texts, fragmenting communication

### 4.2 Platform Evaluation

#### For Real-Time Group Chat: Band vs. GroupMe

| Criterion | Band | GroupMe |
|-----------|------|---------|
| Cost | Free | Free |
| Sports-focused | Yes (official NFHS app) | No (general purpose) |
| SMS fallback | No (app required) | Yes (works via text) |
| Max group size | 200 groups/org | 5,000+ per group |
| Shared calendar | Yes | Basic |
| Photo/video albums | Yes | Basic |
| Learning curve | Low | Very low |

**Verdict:** **GroupMe wins** for booster clubs because of SMS fallback. Not every parent will download another app, but everyone can receive a text. Band is better if the school athletic department already uses it.

#### For Targeted Email Blasts: Mailchimp

| Criterion | Details |
|-----------|---------|
| Free tier | 250 contacts, 500 emails/mo (very limited) |
| Essentials ($13/mo) | 500 contacts, 5,000 emails/mo, basic segments |
| Standard ($20/mo) | 500 contacts, 6,000 emails/mo, advanced segments, behavioral targeting |
| Nonprofit discount | 15% off paid plans |
| Segmentation | Tags + segments: "sport:basketball", "year:2025", "role:parent" |
| Templates | Drag-and-drop email builder, mobile-responsive |
| Learning curve | Moderate -- overkill for simple announcements |

**Verdict:** Mailchimp is the best option if polished email newsletters and precise audience segmentation are priorities. The free tier is too limited; budget ~$14-17/mo after nonprofit discount for Essentials or Standard.

#### For School-Integrated Messaging: Remind

| Criterion | Details |
|-----------|---------|
| Free tier | Basic class messaging for teachers |
| Hub pricing | $4,000-$15,000/yr (school-wide license) |
| Channels | App + SMS + email (strongest multi-channel reach) |
| SMS | Yes, without revealing personal numbers |

**Verdict:** Only viable if the school already has a Remind Hub license. Far too expensive for a booster club to purchase independently.

### 4.3 Communication Recommendation

**Recommended stack: GroupMe (real-time) + Mailchimp Essentials (email blasts)**

| Use Case | Platform | Why |
|----------|----------|-----|
| Game-day coordination | GroupMe | Free, SMS fallback, instant |
| Concession volunteer reminders | GroupMe | Quick, targeted group chat |
| Monthly newsletter | Mailchimp | Professional templates, tracking |
| Registration/renewal reminders | Mailchimp | Segmented by sport/year, scheduled |
| Board communications | GroupMe | Private group, fast |
| Emergency/weather alerts | GroupMe | SMS reaches everyone immediately |

**GroupMe group structure:**
- PC Athletic Boosters -- All Members
- PC Boosters -- Board & Officers
- PC Boosters -- Football Families
- PC Boosters -- Basketball (Boys)
- PC Boosters -- Basketball (Girls)
- PC Boosters -- *[one group per sport/season]*
- PC Boosters -- Concession Volunteers
- PC Boosters -- Event Volunteers

**Mailchimp tags for email segmentation:**
- `sport:football`, `sport:basketball`, `sport:track`, etc.
- `year:2025`, `year:2026`, etc.
- `role:parent`, `role:coach`, `role:athlete`, `role:board`
- `membership:mvp`, `membership:allstar`, `membership:captain`, `membership:rookie`

**Total annual cost:** $0 (GroupMe) + ~$170-200/yr (Mailchimp Essentials with nonprofit discount) = **~$170-200/yr**

---

## 5. Recommendation

### Primary Recommendation: Option D (Best-in-Class Hybrid)

**Why Option D over Option C:**
Option C solves the payment UX problem but leaves communication unaddressed. For $170-200/yr more, Option D adds targeted group messaging that solves the second biggest pain point. The total cost ($850 + ~$185 + transaction fees) is comparable to BoosterSpark Pro ($1,068) while delivering a dramatically better experience on every dimension.

**Why Option D over Option B:**
BoosterSpark costs more ($1,068/yr), has no POS, no mobile app, no SMS, limited communication tools, capped email, and virtually no third-party reviews. It would require keeping BoosterHub anyway for concession POS, doubling the platform cost. BoosterSpark's only advantage -- a built-in website -- is irrelevant since the custom site already exists and is superior.

**Why Option D over Option A:**
Option A does not solve the problem. BoosterHub has no API or embed capability, so the handoff UX cannot be materially improved. It is the lowest-effort option but delivers near-zero improvement.

### Decision Matrix Summary

| | UX | Maintenance | Comms | Cost | Risk | **Total** |
|---|---|---|---|---|---|---|
| **D: Hybrid** | 5 | 3 | 5 | 4 | 3 | **4.10** |
| **C: Stripe + BH** | 5 | 4 | 2 | 4 | 4 | **3.90** |
| **A: Optimize BH** | 1 | 5 | 2 | 5 | 5 | **3.30** |
| **B: BoosterSpark** | 3 | 3 | 2 | 2 | 2 | **2.50** |

### Fallback

If the board wants to minimize platforms and accept weaker communications, **Option C** (Stripe + BoosterHub) is the fallback. It delivers the payment UX improvement with the least additional complexity.

---

## 6. Implementation Requirements

> Structured for `/deep-project` decomposition. Each section below is an independent implementation split.

### Split 1: Stripe Account & Branding Setup

**Priority:** P0 (blocking for all payment work)
**Effort:** 2-4 hours
**Dependencies:** None

**Requirements:**
- [ ] Create Stripe account for PC Athletic Boosters
- [ ] Configure branding: upload logo, set brand colors to match custom site palette
- [ ] Select font closest to site typography (from Stripe's 25 options)
- [ ] Set border radius to match site component styling
- [ ] Configure success redirect URL to custom site confirmation page
- [ ] Optional: Set up custom domain (e.g., `pay.pcathleticboosters.org`)
- [ ] Set up Stripe Dashboard access for treasurer and president roles

### Split 2: Stripe Payment Links -- Donations

**Priority:** P0
**Effort:** 1-2 hours
**Dependencies:** Split 1

**Requirements:**
- [ ] Create donation product with "customer chooses amount" enabled
- [ ] Create one-time donation Payment Link
- [ ] Create recurring monthly donation Payment Link
- [ ] Add custom field: "Donor Name (for recognition)" (optional)
- [ ] Generate Buy Button embed code for initiatives page
- [ ] Update `app/initiatives/page.tsx:127` -- replace BoosterHub link with Stripe Buy Button
- [ ] Update `BOOSTERHUB_URLS.donate` in `lib/constants.ts` with Stripe Payment Link URL
- [ ] Update Navbar and Mobile Menu donate buttons to use Stripe link

### Split 3: Stripe Payment Links -- Membership Tiers

**Priority:** P0
**Effort:** 2-3 hours
**Dependencies:** Split 1

**Requirements:**
- [ ] Create 4 membership tier products in Stripe:
  - Rookie ($X/yr)
  - Captain ($X/yr)
  - All Star ($X/yr)
  - MVP ($X/yr)
- [ ] Create Payment Link for each tier (one-time annual)
- [ ] Optional: Create recurring annual subscription variant for auto-renewal
- [ ] Add custom fields (up to 3): "Member Name", "Primary Sport", "Student Grade"
- [ ] Generate Buy Button embed code for each tier
- [ ] Update `app/membership/page.tsx:174` -- replace tier card CTAs with tier-specific Stripe links
- [ ] Update `app/membership/page.tsx:199` -- replace bottom CTA with primary tier link or anchor to tier cards
- [ ] Update `BOOSTERHUB_URLS.membership` in `lib/constants.ts`
- [ ] Update confirmation/disclaimer copy: remove "You'll be taken to our secure member portal"

### Split 4: Stripe Payment Links -- Spirit Wear Store

**Priority:** P1
**Effort:** 3-4 hours
**Dependencies:** Split 1

**Requirements:**
- [ ] Create product entries in Stripe for each spirit wear item
- [ ] For items with variants (size/color): create separate Payment Links per variant, OR create a pre-purchase form (Google Form / Jotform) that collects variant details and redirects to payment
- [ ] Enable quantity selector on each link
- [ ] Generate Buy Button embed codes
- [ ] Update `app/store/page.tsx:94` -- replace single "Shop Now" link with per-item Buy Buttons or a product grid with embedded buttons
- [ ] Update `BOOSTERHUB_URLS.store` in `lib/constants.ts`
- [ ] Document manual process for deactivating sold-out items (no inventory tracking in Stripe)
- [ ] Design decision: keep BoosterHub store link as fallback for complex orders?

### Split 5: Volunteer Signup Flow

**Priority:** P1
**Effort:** 2-3 hours
**Dependencies:** None

**Requirements:**
- [ ] Decide: keep BoosterHub volunteer signup, or migrate to Google Form / custom form
- [ ] If keeping BoosterHub: no changes needed to `app/volunteer/page.tsx:198`
- [ ] If migrating: create form with fields (name, email, phone, available dates, preferred role)
- [ ] Update `BOOSTERHUB_URLS.volunteer` in `lib/constants.ts` if migrating
- [ ] Ensure volunteer data feeds into BoosterHub member database (manual import or Zapier)

### Split 6: Member Login Strategy

**Priority:** P2
**Effort:** 1-2 hours
**Dependencies:** None

**Requirements:**
- [ ] Decide: is member login needed on the custom site?
  - If BoosterHub is back-office only, login links can be removed from Navbar/MobileMenu/Footer
  - Alternatively: rename to "Board Login" or "Admin Portal" and keep link
- [ ] If removing: update `Navbar.tsx:80`, `MobileMenu.tsx:46`, `Footer.tsx:75`
- [ ] If keeping: update label and potentially move to footer-only
- [ ] Update `BOOSTERHUB_URLS.login` usage in `lib/constants.ts`

### Split 7: Communication Platform Setup

**Priority:** P1
**Effort:** 4-6 hours
**Dependencies:** None (can run parallel to payment splits)

**Requirements:**
- [ ] Create GroupMe account for PC Athletic Boosters
- [ ] Create group structure (all-members, board, per-sport, volunteer groups)
- [ ] Invite current members to join appropriate groups
- [ ] Create Mailchimp account (Essentials tier, apply nonprofit discount)
- [ ] Import contact list from BoosterHub export
- [ ] Set up tags: sport, year, role, membership tier
- [ ] Create email template matching custom site branding
- [ ] Build first segmented list: test with board members
- [ ] Add "Join Our GroupMe" and "Subscribe to Newsletter" CTAs to custom site
  - Potential locations: footer, membership confirmation page, about page

### Split 8: Reconciliation & Operations Documentation

**Priority:** P2
**Effort:** 3-4 hours
**Dependencies:** Splits 2-4 complete

**Requirements:**
- [ ] Document Stripe -> BoosterHub reconciliation process:
  - How to export Stripe transactions (CSV)
  - How to record in BoosterHub accounting module
  - Frequency: weekly? monthly?
- [ ] Create "Annual Handoff Runbook" for volunteer transition:
  - Stripe Dashboard: transfer ownership, update bank account
  - BoosterHub: transfer admin, update billing
  - Mailchimp: transfer account ownership
  - GroupMe: transfer admin roles
  - Custom site: GitHub repo access, deployment credentials
- [ ] Document spirit wear inventory management process (manual link activation/deactivation)
- [ ] Create FAQ updates for `app/resources/page.tsx` reflecting new payment and communication flows

### Split 9: Constants & Code Cleanup

**Priority:** P0 (after Splits 2-4)
**Effort:** 1-2 hours
**Dependencies:** Splits 2, 3, 4

**Requirements:**
- [ ] Refactor `lib/constants.ts`:
  ```typescript
  // Before: all BoosterHub
  export const BOOSTERHUB_URLS = { ... };

  // After: mixed sources
  export const PAYMENT_URLS = {
    donate: "https://buy.stripe.com/xxxxx",        // Stripe
    membership_rookie: "https://buy.stripe.com/xxxxx",
    membership_captain: "https://buy.stripe.com/xxxxx",
    membership_allstar: "https://buy.stripe.com/xxxxx",
    membership_mvp: "https://buy.stripe.com/xxxxx",
    store: "https://buy.stripe.com/xxxxx",          // or per-item
  } as const;

  export const BOOSTERHUB_URLS = {
    volunteer: `${BOOSTERHUB_BASE}/volunteer`,      // if keeping
    login: `${BOOSTERHUB_BASE}/login`,              // if keeping
  } as const;

  export const COMMUNITY_URLS = {
    groupme: "https://groupme.com/join_group/xxxxx",
    newsletter: "https://mailchimp.com/xxxxx",
  } as const;
  ```
- [ ] Update all component imports to use new constant structure
- [ ] Remove unused BoosterHub URL constants
- [ ] Update disclaimer/helper text on all affected pages
- [ ] Run full build to verify no broken references

### Split 10: Testing & QA

**Priority:** P0 (final gate)
**Effort:** 2-3 hours
**Dependencies:** All prior splits

**Requirements:**
- [ ] Test every Stripe Payment Link (one test transaction per link type)
- [ ] Test Buy Button embeds on all pages (mobile + desktop)
- [ ] Verify Stripe success redirects land on correct custom site pages
- [ ] Test GroupMe join links from custom site
- [ ] Test Mailchimp signup from custom site
- [ ] Verify BoosterHub POS still works independently
- [ ] Cross-browser testing: Chrome, Safari, Firefox, mobile Safari, mobile Chrome
- [ ] Verify no remaining broken BoosterHub links on the custom site
- [ ] Test with a non-technical board member (usability check)

---

## Appendix A: BoosterHub Capabilities Retained (Option D)

Even after removing BoosterHub from the customer-facing journey, retain it for:

| Capability | Use Case |
|------------|----------|
| POS / Concessions | In-person card + cash sales at games and events |
| Accounting Module | Transaction tracking, reporting, tax prep |
| Member Database | Contact records, custom fields, tags |
| Student Invoicing | Payment plans for families |
| BoosterSTUB | QR ticketing at events |
| BoosterBucks | Fundraising campaigns (95% retention) |
| Volunteer Coordinator | One-click signup (if not migrated) |

## Appendix B: Stripe Payment Links Quick Reference

| Transaction Type | Link Type | Custom Fields | Notes |
|------------------|-----------|---------------|-------|
| Donation (one-time) | One-time, customer-set amount | Donor Name | "Pay what you want" enabled |
| Donation (recurring) | Subscription, customer-set amount | Donor Name | Monthly recurring |
| Membership (per tier) | One-time or subscription | Member Name, Sport | 1 link per tier (4 total) |
| Spirit Wear (per item) | One-time, quantity enabled | Student Name | 1 link per item/variant |
| Event Tickets | One-time, quantity enabled | Attendee Name | 1 link per event |

## Appendix C: Annual Cost Projections

Assuming ~$15,000/yr in total transaction volume across all channels:

| Component | Option A | Option B | Option C | Option D |
|-----------|----------|----------|----------|----------|
| BoosterHub Pro | $850 | -- | $850 | $850 |
| BoosterSpark Pro | -- | $1,068 | -- | -- |
| Stripe txn fees (~$15K vol) | -- | -- | ~$465 | ~$465 |
| BoosterHub txn fees (~$15K vol) | ~$441 | -- | ~$100* | ~$100* |
| Mailchimp Essentials | -- | -- | -- | ~$185 |
| GroupMe | -- | -- | -- | $0 |
| **Annual Total** | **~$1,291** | **~$1,503** | **~$1,415** | **~$1,600** |

*\*BoosterHub transaction fees in C/D are lower because only POS volume (~$3K estimated) runs through BoosterHub; web volume shifts to Stripe.*

**Cost difference between cheapest (A) and recommended (D): ~$309/yr** -- roughly $26/month for dramatically better payment UX and targeted communications.

---

## Appendix D: Technical Integration Audit (from Support Docs & Technical Research)

> This appendix documents findings from each platform's actual technical documentation, support files, Terms of Service, knowledge bases, and developer docs -- not marketing materials. Research conducted 2026-02-24.

### D.1 BoosterHub -- Technical Limitations Confirmed

**Architecture:** Laravel + Livewire (PHP) server-rendered application. Marketing site built on Webflow. Knowledge base hosted on Helpjuice (`boosterhub.helpjuice.com`). Mobile apps: native iOS (requires 15.1+) and Android.

**Integration capabilities -- NONE:**

| Capability | Status | Evidence |
|------------|--------|----------|
| Public API | Does not exist | No documentation, no sitemap URLs, no pricing tier mentions |
| Embeddable widgets/iframes | Does not exist | No documentation, no help articles |
| Webhooks | Does not exist | No documentation anywhere |
| Zapier / Make integration | Does not exist | Not listed on Zapier's directory |
| CSV data export (self-service) | Uncertain | Not documented; "real-time reports" may be screen-only |
| CSV data import | Not available | Charms migration article acknowledges manual data move |
| Custom CSS injection | Not available | Livewire architecture = server-controlled rendering |
| White-labeling | Basic (logo/colors only) | Subdomain pattern persists; no custom domain docs found |
| Custom domain documentation | Not found | Pricing page mentions it as a feature but zero setup docs |

**Terms of Service restrictions (app.boosterhub.com/terms-of-use):**
- Scraping explicitly prohibited: cannot "systematically retrieve data...to create a collection, compilation, database"
- Automated access prohibited: cannot use "spider, robot, cheat utility, scraper, or offline reader"
- Reverse engineering prohibited
- No provision for authorized API access or data integration

**robots.txt:** Fully permissive (no hidden docs pages blocked). **Sitemap:** Zero technical documentation URLs. The 17-category Helpjuice knowledge base contains only user-facing how-to articles; zero articles about APIs, embeds, exports, or integrations.

**Key architectural insight:** Livewire components communicate through internal wire protocols tightly coupled to the Laravel session. This architecture is fundamentally incompatible with exposing a public API without significant re-engineering -- confirming this is not a "documentation gap" but a genuine technical limitation.

### D.2 BoosterSpark -- Technical Limitations Confirmed

**Architecture:** Closed-source web application. No public-facing help center, knowledge base, or technical documentation exists. Support is human-only (phone + email contact form).

**Integration capabilities -- NONE:**

| Capability | Status | Evidence |
|------------|--------|----------|
| Public API | Does not exist | Zero results across entire site |
| Developer documentation | Does not exist | No /docs, /help, /kb, /api, /developer paths in sitemap |
| Embeddable widgets/iframes | Does not exist | Store/donation pages live entirely within BoosterSpark CMS |
| Custom HTML/JS/CSS | Explicitly prohibited | Hosting policy: "custom websites are not permitted, nor are custom SQL tables" |
| Webhooks / Zapier | Does not exist | No mention on any page |
| White-labeling | Not available | No option at any tier |
| Data export (CSV) | Available | Reports exportable to CSV; up to 5 years historical data |
| Data bulk import | Not available | Manual entry only (no CSV import) |
| OAuth / SSO | Not available | Username/password only |

**Stripe integration model: Managed Stripe Connect (NOT bring-your-own):**
- BoosterSpark is the platform; each club gets a connected Stripe account
- Clubs cannot bring their own standalone Stripe account
- BoosterSpark's per-transaction fees (10%/3.5%/0% by tier) collected via Stripe Connect application fees
- "Additional financial data can be accessed in your Stripe dashboard" -- implies limited connected account dashboard access

**Hosting constraints (boosterspark.com/policies/hosting.php):**
- Bandwidth: 1 GB/month
- Custom code: not permitted
- Custom SQL: not permitted
- Shared hosting across customers

**Terms of Service:** Automated/bot access explicitly prohibited. All user feedback/suggestions become BoosterSpark's property.

### D.3 Membership Toolkit -- Technical Limitations Confirmed

**Critical correction from initial research:** PayPal has been discontinued as a payment processor. LumaPay (powered by Stripe, at 2.89% + $0.30) is the sole payment option. Organizations cannot bring their own processor. User reviews confirm this was a forced migration.

| Capability | Status | Evidence |
|------------|--------|----------|
| Public API | Does not exist | GetApp explicitly confirms "does not have an API available" |
| Embeddable forms/widgets | Does not exist | All transactions on MT-hosted subdomain only |
| Webhooks | Does not exist | No documentation |
| Zapier / third-party integrations | None | Only integration is a URL link to SignUpGenius (sibling company) |
| Data export | Limited | Contacts/reports as Excel spreadsheets; directories as PDF |
| Data import | Available | CSV/Excel bulk upload for contacts |
| Custom CSS/HTML | Premium+ only | For styling the MT-hosted site; does not enable external embedding |
| Custom domain | Premium+ only | For the MT-hosted website |

**Walled garden assessment:** Data goes in (bulk upload, self-registration) but has limited paths out (manual Excel/PDF downloads only). No automated exports, no QuickBooks format, no data portability guarantees in ToS.

**Communication tools are genuinely strong:** Built-in email newsletters with scheduling, delivery analytics (opens/clicks/bounces), smart distribution lists by custom field, push notifications via mobile app, and auto-populated message boards. But no SMS, no external email platform integration, and no way to automatically export email lists.

### D.4 Stripe Payment Links -- Technical Capabilities Confirmed

Research from official Stripe documentation (docs.stripe.com) reveals several corrections and important details:

**Custom fields: 3 (not 2 as initially reported):**
- 3 field types: Text (255 chars), Numeric (255 digits), Dropdown (up to 200 options via API, 10 in Dashboard)
- Labels max 50 characters, not translated for locale
- Cannot conditionally show different fields per product -- they are set per Payment Link

**Buy Button dynamic attributes (only 3):**
- `client-reference-id`: tracking string, up to 200 chars
- `customer-email`: pre-fills email (customer CANNOT edit once set)
- `customer-session-client-secret`: requires server-side generation (not usable on static site)
- Cannot pre-fill: name, custom fields, metadata, quantity, coupon codes

**Branding: Custom hex colors supported (not preset-only):**
- `background_color` and `button_color` accept hex values
- 25 fonts available (not unlimited)
- Brand color does NOT apply to Payment Links specifically (only accent color does)

**Stripe Tax works with Payment Links:** Enable `automatic_tax[enabled]=true` in Dashboard or API. Uses product tax codes and customer address for rate calculation.

**Donation links ("customer chooses amount"):**
- Can set minimum and maximum amounts
- Default max is $10,000 (increase by contacting Stripe)
- Limitation: only 1 line item, no promo codes, no recurring, no cross-sells

**Campaign tracking via URL parameters:**
- 5 UTM parameters supported (utm_source, utm_medium, utm_campaign, utm_content, utm_term) -- 150 chars each
- `client_reference_id` for custom tracking -- 200 chars
- Payment Link metadata auto-copies to checkout session and webhook

**Webhooks without a server: Zapier is officially recommended by Stripe:**
- `checkout.session.completed` event contains: customer email/name, custom field responses, line items, amount, metadata, UTM params
- Zapier catches webhooks -> writes to Google Sheets / sends email / updates inventory
- No server required for post-purchase automation

**Customer Portal:** Works with Payment Links subscriptions. Customers can update billing, payment methods, and cancel. Generating per-customer portal links typically requires server-side code, but can be bridged via Zapier or included in Stripe's built-in email receipts.

**Operational limits:**
- 20 line items max per Payment Link
- 3 custom fields max
- 200 dropdown options max (API); 10 (Dashboard)
- No documented limit on total number of Payment Links per account
- API rate limit: 100 operations/second (live mode)
- Promo codes incompatible with customer-chosen pricing (donations)
- Promo codes + guest customers: "first-time order" restrictions don't work as expected (every transaction creates a guest)

### D.5 GroupMe -- Technical Capabilities & Limitations

**Has a real API** (dev.groupme.com/docs/v3): Full CRUD for groups, members, messages, likes, bots. Token-based auth. Community-maintained docs fill gaps (GitHub: GroupMeCommunityDocs).

| Capability | Details |
|------------|---------|
| Group size | **5,000 members max** (hard cap, no exceptions) |
| Announcement mode | Fully supported -- admin-only posting |
| Topics (sub-channels) | Available within groups; but ALL members see ALL topics (no per-topic access control) |
| Programmatic member addition | Yes, via API: `POST /groups/:group_id/members/add` |
| SMS fallback | **US only; 400-message LIFETIME cap** then must install app |
| SMS initial throttle | New SMS members get only 12 messages, must text `#stay` to continue |
| SMS mode duration | Max 48 hours per activation |
| File sharing | 50 MB max; doc/docx/xls/xlsx/ppt/pptx/pdf/psd/ai |
| Message history | Indefinite for text; **5 years for media/files** |
| Data export | JSON format only, via web.groupme.com profile page |
| Admin visibility | **Cannot see phone numbers or emails** of members |
| Events/RSVP | Built-in with 3-option RSVP, map integration, reminders |
| Calendar integration | Google Calendar and Outlook via IFTTT |
| Microsoft account | NOT required (email, Apple, Facebook login options) |
| Phone number | Required for account creation regardless of sign-in method |

**Critical finding for booster clubs:** GroupMe's SMS fallback has a **400-message lifetime cap** -- far more limited than it appears. After 400 SMS messages, the user must install the app. This means SMS is a temporary onboarding bridge, not a permanent communication channel. Push app adoption aggressively.

### D.6 Mailchimp -- Technical Capabilities for Static Sites

**Embedded forms: Fully supported on static sites.** Generate HTML/JS embed code from Mailchimp's form builder, paste into site HTML. Forms submit directly to Mailchimp's servers -- no backend needed.

**Audience fields available on forms:** 13 types (text, number, radio, checkboxes, dropdown, date, birthday, address, zip, phone, website, image, language). Max 30 fields per audience (80 on Premium).

**Groups vs. Tags for sport selection:**
- **Groups** (recommended): Contact-facing. Subscribers self-select interests (e.g., "Football", "Basketball") via checkboxes/radio/dropdown on signup form. **Max 60 group names per audience.** Can be hidden and auto-assigned via HTML modification.
- **Tags**: Admin-assigned labels. Can be blanket-assigned per form (everyone gets same tag), but conditional per-response assignment requires API (server-side only). Dynamic content by tag requires Standard plan.

**No client-side JavaScript API.** Mailchimp explicitly does not support client-side API calls: "Mailchimp doesn't support client-side implementation of our API using CORS requests." Embedded forms and self-hosted form-action endpoints are the static-site integration methods.

**Import from BoosterHub CSV:** Supported (CSV/TXT only, no Excel). Email column required. Columns mapped during import wizard. Tags can be comma-separated in a column.

**Send limits by plan:**

| Plan | Formula | At 500 contacts |
|------|---------|-----------------|
| Free | 500/mo fixed | 500/mo |
| Essentials | 10x contacts | 5,000/mo |
| Standard | 12x contacts | 6,000/mo |
| Premium | 15x contacts | 7,500/mo |

**Automation: Essentials vs. Standard:**
- Essentials: 4 steps max per flow, no branching, no webhooks
- Standard: 200 steps, conditional branching (if Football -> send X; if Basketball -> send Y), webhook actions, behavioral targeting, send-time optimization

**Conditional content in emails:**
- All paid plans: `*|INTERESTED:SportInterest:Football|*` merge tags work with Groups
- Standard+: Dynamic Content blocks support Tags as conditions (up to 5 conditions per block)

**Segmentation:**
- Free/Essentials: 5 conditions, single AND/OR
- Standard/Premium: Unlimited conditions, nested AND/OR logic

**Compliance:** CAN-SPAM unsubscribe handled automatically. Physical address required in every email. GDPR tools provided (consent forms, double opt-in, permanent deletion).

### D.7 Integration Feasibility Summary

| Platform | Can embed on custom site? | Can export data? | Has API? | Can automate? |
|----------|--------------------------|------------------|----------|---------------|
| **BoosterHub** | No | Uncertain (maybe reports in-app) | No | No |
| **BoosterSpark** | No | Yes (CSV export) | No | No |
| **Membership Toolkit** | No | Yes (Excel/PDF) | No | No |
| **Stripe** | **Yes** (Buy Buttons, Payment Links) | **Yes** (Dashboard CSV, API, webhooks) | **Yes** (full REST API) | **Yes** (Zapier, webhooks) |
| **GroupMe** | Link only (join group URLs) | Yes (JSON export) | **Yes** (full REST API) | **Yes** (API, bots) |
| **Mailchimp** | **Yes** (embedded signup forms) | **Yes** (CSV export) | **Yes** (server-side only) | **Yes** (automations, Zapier) |

**Conclusion:** The technical research strongly reinforces Option D. BoosterHub, BoosterSpark, and Membership Toolkit are all walled gardens with no integration paths. Only Stripe, GroupMe, and Mailchimp offer the technical openness needed to build a cohesive experience on the custom site. The hybrid approach is not just strategically preferable -- it is the only approach that is technically feasible for embedding transactions and communication into the custom Next.js site.
