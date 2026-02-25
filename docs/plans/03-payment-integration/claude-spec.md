# Complete Specification: Payment Integration (Split 03)

> Synthesized from: original spec, codebase research, web research, and stakeholder interview

---

## Objective

Replace all BoosterHub transaction links with Stripe Payment Links and Buy Buttons, providing professional, on-site payment UX for memberships and donations. Spirit wear integration is deferred to a later iteration.

## Background

### Why Stripe
- $0 platform fee (vs. BoosterHub at $850/yr)
- Professional checkout UX (Apple Pay, Google Pay, mobile-optimized)
- Buy Buttons embed directly on the site as web components (no redirect for the user to see)
- Supports recurring subscriptions (annual memberships, monthly donations)
- Customer Portal for self-service subscription management
- At <200 transactions/year, dramatically better value

### Why Drop BoosterHub
- Never launched -- zero migration cost
- $850/yr for <200 transactions = $4+/transaction in platform fees
- No embeds, no API, closed ecosystem
- Back-office features not needed at this scale

### Technical Context
- **Site**: Next.js 16.1.6 with `output: "export"` (fully static, no SSR/API routes)
- **Styling**: Tailwind CSS v4, Inter (body) + Oswald (display) fonts
- **Colors**: #CC0033 (primary red), #111111 (dark), #A30B2B (dark red accent)
- **Components**: Reusable Button (primary/secondary/outline), Card, FadeIn, Accordion
- **Existing patterns**: Client components with `"use client"`, Framer Motion animations
- **Mailchimp**: Already integrated via SignupForm component with honeypot, groups, redirect to /join/thanks

---

## Stripe Account Setup (Manual -- Not Code)

- Create Stripe account for PC Athletic Boosters
- Configure branding:
  - Upload logo (square icon + wider wordmark, JPG/PNG, <512KB, min 128x128)
  - Set brand color to #CC0033, accent/button color to match
  - Select **Inter** font (exact match -- available in Stripe's 25 options)
  - Set border radius to match site component styling (rounded)
- Set up Dashboard access for treasurer and president
- Activate Customer Portal (no-code, in Dashboard > Settings > Billing)
- Skip custom domain (use buy.stripe.com, save $120/yr)

---

## Payment Products to Create in Stripe Dashboard

### Memberships (4 Annual Recurring Subscriptions)

| Tier | Price | Billing | Custom Fields |
|------|-------|---------|---------------|
| Rookie | $25/year | Annual recurring | Member Name (text), Sport (dropdown), Grade (dropdown) |
| Captain | $50/year | Annual recurring | Member Name (text), Sport (dropdown), Grade (dropdown) |
| All Star | $100/year | Annual recurring | Member Name (text), Sport (dropdown), Grade (dropdown) |
| MVP | $250/year | Annual recurring | Member Name (text), Sport (dropdown), Grade (dropdown) |

- All memberships auto-renew until canceled (no one-time membership option)
- 3 custom fields per link (Stripe maximum):
  - **Member Name**: Text field
  - **Sport**: Dropdown (school sports list)
  - **Grade**: Dropdown (9, 10, 11, 12)
- Success redirect: `/payment/thanks`
- Each tier gets a Payment Link AND a Buy Button generated from Dashboard

### Donations (6 Payment Links)

| Type | Amount | Billing | Custom Fields |
|------|--------|---------|---------------|
| Monthly $5 | $5/month | Monthly recurring | Donor Name (optional) |
| Monthly $10 | $10/month | Monthly recurring | Donor Name (optional) |
| Monthly $25 | $25/month | Monthly recurring | Donor Name (optional) |
| Monthly $50 | $50/month | Monthly recurring | Donor Name (optional) |
| Monthly $100 | $100/month | Monthly recurring | Donor Name (optional) |
| One-Time | Customer chooses | One-time | Donor Name (optional) |

- Monthly tiers are required because "customer chooses price" doesn't support recurring in Stripe
- One-time donation uses "customer chooses what to pay" pricing
- Success redirect: `/payment/thanks`

### Spirit Wear
**Deferred to later iteration.** Store page will be updated to remove BoosterHub link but spirit wear Buy Buttons are out of scope.

---

## Site Code Changes

### 1. Refactor `lib/constants.ts`

**Remove:** `BOOSTERHUB_BASE` and `BOOSTERHUB_URLS`

**Add:**
```typescript
export const PAYMENT_URLS = {
  membership_rookie: "https://buy.stripe.com/xxxxx",
  membership_captain: "https://buy.stripe.com/xxxxx",
  membership_allstar: "https://buy.stripe.com/xxxxx",
  membership_mvp: "https://buy.stripe.com/xxxxx",
  donate: "https://buy.stripe.com/xxxxx",          // one-time flexible
  donate_monthly_5: "https://buy.stripe.com/xxxxx",
  donate_monthly_10: "https://buy.stripe.com/xxxxx",
  donate_monthly_25: "https://buy.stripe.com/xxxxx",
  donate_monthly_50: "https://buy.stripe.com/xxxxx",
  donate_monthly_100: "https://buy.stripe.com/xxxxx",
  customer_portal: "https://billing.stripe.com/p/login/xxxxx",
} as const;

export const COMMUNITY_URLS = {
  mailchimp_signup: "/join",
  mailchimp_preferences: "https://...",  // Mailchimp preference center URL
  facebook_group: "https://...",
  signupgenius: "https://...",           // Volunteer signup
} as const;

export const STRIPE_CONFIG = {
  publishableKey: "pk_live_xxxxxxxxxxxxx",
} as const;
```

### 2. Create `StripeBuyButton` Component

New client component at `components/ui/StripeBuyButton.tsx`:
- Uses Next.js `Script` component with `strategy="afterInteractive"`
- Accepts `buyButtonId` and `publishableKey` props
- Renders `<stripe-buy-button>` web component
- TypeScript: use `@ts-expect-error` for the web component element

### 3. Create `/payment/thanks` Page

New page at `app/payment/thanks/page.tsx`:
- Thank you message acknowledging payment
- Mailchimp signup prompt (reuse or adapt SignupForm pattern)
- Social media links (Facebook group, etc.)
- Follow the existing `/join/thanks` page pattern

### 4. Update Navigation -- "Manage Membership" Dropdown

**Navbar.tsx, MobileMenu.tsx, Footer.tsx:**
- Remove "Member Login" link
- Replace donate button link with Stripe donate Payment Link
- Add "Manage Membership" dropdown with two sub-links:
  - "Billing & Subscription" → Stripe Customer Portal
  - "Email Preferences" → Mailchimp preference center

### 5. Update Page Components

| File | Change |
|------|--------|
| `components/layout/Navbar.tsx` | Replace donate link, add Manage Membership dropdown |
| `components/layout/MobileMenu.tsx` | Replace donate link, add Manage Membership links |
| `components/layout/Footer.tsx` | Replace login with Manage Membership links |
| `components/home/ActionCards.tsx` | Replace membership link |
| `app/membership/page.tsx` | Replace tier CTAs with Buy Buttons (4 tiers), update bottom CTA |
| `app/initiatives/page.tsx` | Replace donation link with Buy Button or Payment Link |
| `app/store/page.tsx` | Remove BoosterHub store link. Add temporary "coming soon" or keep minimal |
| `app/volunteer/page.tsx` | Update signup destination to SignUpGenius URL |
| `app/resources/page.tsx` | Update FAQ text removing BoosterHub references |

### 6. Remove BoosterHub References

- Delete `BOOSTERHUB_BASE` and `BOOSTERHUB_URLS` from constants
- Remove disclaimer copy: "You'll be taken to our secure member portal"
- Search entire codebase for "BoosterHub" or "boosterhub" and clean up

---

## Current BoosterHub Link Inventory (from Codebase Research)

| File | Line(s) | Current Usage | New Target |
|------|---------|---------------|------------|
| `lib/constants.ts` | 1-9 | `BOOSTERHUB_URLS` object | `PAYMENT_URLS` + `COMMUNITY_URLS` |
| `components/layout/Navbar.tsx` | 79-96 | `.donate`, `.login` | Stripe donate link, Manage Membership dropdown |
| `components/layout/MobileMenu.tsx` | 45-62 | `.donate`, `.login` | Stripe donate link, Manage Membership links |
| `components/layout/Footer.tsx` | 95 | `.login` | Manage Membership links |
| `components/home/ActionCards.tsx` | 14 | `.membership` | Stripe membership link or /membership page |
| `app/membership/page.tsx` | 174, 217 | `.membership` x2 | Buy Buttons for each tier |
| `app/initiatives/page.tsx` | 127 | `.donate` | Stripe donate link |
| `app/store/page.tsx` | 94 | `.store` | Temporary placeholder (spirit wear deferred) |

---

## Integration Points

- **From Split 01 (Brand/Color):** Stripe branding uses #CC0033 and #111111
- **From Split 02 (Communication Hub):** Success page prompts Mailchimp signup; Manage Membership includes Mailchimp preferences
- **To BoosterHub:** Cancel subscription after Stripe is verified live

## Constraints

- **Static site:** No server-side code. Stripe Buy Buttons and Payment Links work without backend.
- **3 custom fields max** per Payment Link (Stripe limitation)
- **No cart:** Each product is a separate checkout
- **No "customer chooses price" for recurring:** Monthly donations use fixed tiers
- **One product per Buy Button:** Need 4 membership buttons + donation buttons
- **No spirit wear in this iteration**

## Out of Scope

- Spirit wear / store integration (deferred)
- Custom Stripe domain ($10/month -- skipped)
- Webhook-based fulfillment (static site -- rely on Stripe Dashboard + email receipts)
- Stripe.js or custom checkout (requires backend)
- Automated Mailchimp subscription from payment (would need webhooks/server)
