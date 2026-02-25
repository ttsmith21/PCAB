# Research Findings: Payment Integration (Split 03)

## Part 1: Codebase Analysis

### 1. Project Structure & Architecture

- **Next.js 16.1.6** with React 19.2.3, App Router
- **Static Export**: `output: "export"` in next.config.ts -- fully static site, no SSR/API routes
- Builds to `/out` directory with pre-rendered HTML
- **Cannot use** server-side Stripe integrations or dynamic APIs

**Key Configuration:**
- `/next.config.ts` -- output: "export", images unoptimized for static hosting
- `/tsconfig.json` -- Strict TypeScript, path alias `@/*`
- `/package.json` -- No test frameworks configured

### 2. Existing Patterns & Conventions

**Component Structure:**
- Layout Components: `/components/layout/` -- Navbar, MobileMenu, Footer (Client components with `"use client"`)
- UI Components: `/components/ui/` -- Button, Card, SignupForm, FadeIn, Accordion
- Home Components: `/components/home/` -- Hero, ActionCards, ImpactStats, InitiativePreview, SponsorShowcase
- Pages: Server components by default in `/app`

**Styling:**
- Tailwind CSS v4 with `@tailwindcss/forms` plugin
- Display Font: Oswald (Google Fonts) -- uppercase, tracking-wide
- Body Font: Inter (Google Fonts)
- Color System (defined in globals.css as Tailwind theme):
  - Primary: `--color-pc-red: #CC0033`
  - Dark: `--color-pc-dark: #111111`
  - Dark red accent: `--color-pc-red-dark: #A30B2B`
  - Light backgrounds: `--color-pc-red-light: #FEF2F2`, `--color-pc-gray-light: #F3F4F6`
  - Glow shadow: `--shadow-glow: 0 0 20px rgba(204, 0, 51, 0.6)`

**Animation:** Framer Motion v12.34.3 for animations (FadeIn component)

**Button Component Pattern:**
```tsx
<Button href={url} external={true|false} variant="primary|secondary|outline">
  Label
</Button>
```

### 3. Current BoosterHub Integration

**Constants File** (`lib/constants.ts`):
```typescript
BOOSTERHUB_BASE = "https://pcathleticbooster.boosterhub.com"

BOOSTERHUB_URLS = {
  membership: "/membership",
  volunteer: "/volunteer",
  store: "/store",
  login: "/login",
  donate: "/store"  // Currently points to store
}
```

**All BoosterHub Link References:**

| File | Current Link | Purpose | Line(s) |
|------|-------------|---------|---------|
| `lib/constants.ts` | `BOOSTERHUB_URLS` object | Central config | 1-9 |
| `components/layout/Navbar.tsx` | `.donate`, `.login` | Donate button, Member Login | 79-96 |
| `components/layout/MobileMenu.tsx` | `.donate`, `.login` | Mobile donate, login | 45-62 |
| `components/layout/Footer.tsx` | `.login` | Footer login link | 95 |
| `components/home/ActionCards.tsx` | `.membership` | "Join Now" on homepage | 14 |
| `app/membership/page.tsx` | `.membership` x2 | Tier CTAs, bottom CTA | 174, 217 |
| `app/initiatives/page.tsx` | `.donate` | "Make a Donation" CTA | 127 |
| `app/store/page.tsx` | `.store` | "Shop Now" button | 94 |

### 4. Dependencies

**Production:**
- `next`: 16.1.6, `react`: 19.2.3, `react-dom`: 19.2.3
- `framer-motion`: 12.34.3
- `lucide-react`: 0.575.0

**Dev:**
- `tailwindcss`: 4, `@tailwindcss/forms`
- `typescript`: 5 (strict), `eslint`: 9

**Notable Absences:**
- No testing framework (Jest, Vitest, Testing Library)
- No validation library (Zod, Yup)
- No payment libraries (stripe package) -- not needed for static site
- Mailchimp integration exists (form-based)

### 5. Existing Mailchimp/Signup Integration

**Configuration** (`lib/constants.ts`):
- `MAILCHIMP_CONFIG.formAction` -- POST endpoint to Mailchimp list-manage

**SignupForm Component** (`components/ui/SignupForm.tsx`):
- Client component with form state management
- Fields: First Name, Last Name, Email, Phone, Communication preference, Sports (multi-select by season), Levels, Role
- Client-side validation, honeypot spam protection
- Redirects to `/join/thanks` after submission
- Custom Mailchimp groups via `MAILCHIMP_GROUPS`

**Confirmation Page** (`app/join/thanks/page.tsx`):
- Thank you messaging, check email prompt
- Links to Facebook, community resources
- **Pattern can be adapted for payment confirmation flow**

### 6. Testing Setup

**Current State: No testing framework installed**
- No Jest, Vitest, or Testing Library
- No test scripts in package.json
- No existing test files
- For link-based integration, manual testing may suffice
- Static export limits testable surface area

### 7. Key Directories
```
PC-Boosters-Web/
├── app/                           # Pages (server components)
│   ├── layout.tsx                 # Root layout with Navbar/Footer
│   ├── page.tsx                   # Home
│   ├── membership/page.tsx
│   ├── initiatives/page.tsx
│   ├── store/page.tsx
│   ├── volunteer/page.tsx
│   ├── join/page.tsx              # Community signup form
│   └── join/thanks/page.tsx       # Signup confirmation
├── components/
│   ├── layout/                    # Navbar, MobileMenu, Footer
│   ├── ui/                        # Button, Card, SignupForm, etc.
│   └── home/                      # Hero, ActionCards, etc.
├── lib/
│   ├── constants.ts               # *** CENTRAL CONFIG ***
│   └── data/                      # nav-links, sports, initiatives, etc.
├── public/                        # Static assets
└── app/globals.css                # Tailwind + theme definitions
```

---

## Part 2: Web Research -- Stripe Best Practices

### 1. Stripe Buy Button + Next.js Integration

**What It Is:** A no-code web component that embeds directly in HTML:
```html
<script async src="https://js.stripe.com/v3/buy-button.js"></script>
<stripe-buy-button
  buy-button-id="buy_btn_xxxxxxxxxxxxx"
  publishable-key="pk_live_xxxxxxxxxxxxx"
/>
```

**Static Export Compatibility:** Fully compatible with `output: 'export'`. The Buy Button is pure client-side -- loads Stripe's JS from CDN, renders in browser. Zero server code needed. This is the ideal pairing for a static Next.js site.

**Recommended Next.js Implementation:**
```tsx
'use client';
import Script from 'next/script';

export function StripeBuyButton({
  buyButtonId,
  publishableKey,
}: {
  buyButtonId: string;
  publishableKey: string;
}) {
  return (
    <>
      <Script src="https://js.stripe.com/v3/buy-button.js" strategy="afterInteractive" />
      {/* @ts-expect-error -- stripe-buy-button is a web component */}
      <stripe-buy-button
        buy-button-id={buyButtonId}
        publishable-key={publishableKey}
      />
    </>
  );
}
```

**Key Considerations:**
- Requires `'use client'` for Script component and browser APIs
- `strategy="afterInteractive"` -- loads after hydration
- TypeScript: needs `@ts-expect-error` or custom type declaration for web component
- Hydration: No issues -- empty element on both server and client sides
- CSP: Add `frame-src https://js.stripe.com` and `script-src https://js.stripe.com` if using CSP
- Uses **publishable key** (safe to expose client-side)

**Buy Button Customization:** Layout (button or card), colors, border radius, fonts, CTA text, language -- all configured from Dashboard.

**Advanced Attributes:** `client-reference-id`, `customer-email` (prefill), `customer-session-client-secret`

**Limitations:**
- One product per button (need multiple buttons for multiple products)
- Checkout appearance controlled by Dashboard branding, not embed code
- Cannot customize checkout page from the embed itself

Sources: [Stripe Buy Button Docs](https://docs.stripe.com/payment-links/buy-button), [Next.js Script Component](https://nextjs.org/docs/app/api-reference/components/script)

### 2. Stripe Payment Links -- Subscriptions & Custom Fields

**Annual Recurring Memberships:**
- Create product with **recurring price** set to **Yearly** billing
- Payment Links with recurring prices automatically create Stripe Subscriptions
- Managed via Customer Portal for self-service

**Custom Fields (3 max per Payment Link):**

| Field | Recommended Type | Rationale |
|-------|-----------------|-----------|
| Member Name | Text | Free-form entry |
| Sport | Dropdown | Constrained list of school sports |
| Grade | Dropdown | 9, 10, 11, 12 |

- Fields required by default; set `optional: true` via API
- Data captured in Dashboard and webhook events
- Can be exported with payment records

**Donations:**
- **One-time:** "Customers choose what to pay" pricing -- works for flexible donations
- **CRITICAL:** "Customer chooses price" does NOT support recurring payments
- **Monthly recurring workaround:** Create fixed-amount tiers ($10, $25, $50, $100/month) as separate Payment Links

**Success Redirect URL:**
- Configure in Dashboard: Payment Link > "After the payment" > "Redirect to URL"
- Can include `{CHECKOUT_SESSION_ID}` placeholder for personalization
- UTM parameters auto-forwarded to redirect URL
- Example: `https://pcboosters.org/membership/thanks?session_id={CHECKOUT_SESSION_ID}`

**Customer Portal (No-Code):**
- Activate in Dashboard > Settings > Billing > Customer Portal
- Customers authenticate via email OTP (no password)
- Features: update payment methods, view invoices, cancel/modify subscriptions
- Inherits branding settings
- Can configure cancellation reasons and retention coupons
- Access URL: `?prefilled_email=member@example.com` to pre-populate email

Sources: [Stripe Payment Links](https://docs.stripe.com/payment-links/create), [Stripe Custom Fields](https://docs.stripe.com/payments/checkout/custom-fields), [Stripe Customer Portal](https://docs.stripe.com/customer-management)

### 3. Stripe Branding Customization

**Colors:**
- Brand color (receipts, invoices, portal)
- Accent color (email/page backgrounds)
- Background color (checkout page)
- Button color (checkout "Pay" button)
- All set as hex values in Dashboard > Settings > Branding

**Fonts -- Inter Is Available!**
Stripe's 25 font options include **Inter** -- an exact match for the site's body font. No approximation needed.

Full list: Be Vietnam Pro, Bitter, Chakra Petch, Hahmlet, Inconsolata, **Inter**, Lato, Lora, M PLUS 1 Code, Montserrat, Nunito, Noto Sans, Noto Serif, Open Sans, PT Sans, PT Serif, Pridi, Raleway, Roboto, Roboto Slab, Source Sans Pro, Titillium Web, Ubuntu Mono, Zen Maru Gothic

**Border Radius / Shape:**
- **Rounded** (default)
- **Sharp** (rectangular corners)
- **Pill** (fully rounded)

**Logo Requirements:**
- Format: JPG or PNG, < 512 KB
- Minimum: 128px x 128px
- Upload both icon (square) and logo (wider wordmark)

**Branding applies uniformly to:** Payment Links, Buy Buttons, Customer Portal, receipts, invoices.

**Custom Domain (`pay.pcboosters.org`):**
- Cost: **$10/month** add-on
- Only one custom domain per account
- DNS: CNAME to `hosted-checkout.stripecdn.com` + TXT for verification
- Replaces `buy.stripe.com` URLs
- Not available in test mode

Sources: [Stripe Checkout Appearance](https://docs.stripe.com/payments/checkout/customization/appearance), [Stripe Branding](https://docs.stripe.com/get-started/account/branding), [Stripe Custom Domains](https://docs.stripe.com/payments/checkout/custom-domains)

### 4. Stripe Nonprofit Fee Discount

- Standard nonprofit rate: **2.2% + $0.30** (vs. 2.9% + $0.30)
- Eligibility: 501(c)(3) with >80% of Stripe funds being tax-deductible donations
- Apply: Email `nonprofit@stripe.com` with EIN/IRS letter + Stripe account email
- **Caveat:** Membership dues are NOT eligible -- only tax-deductible donations qualify

---

## Key Takeaways for Implementation

1. **Stripe Buy Buttons are the correct integration pattern** for this static Next.js site
2. **Create a reusable `StripeBuyButton` client component** using Next.js Script
3. **Inter font is available** in Stripe's options -- exact brand match
4. **"Customer chooses price" cannot be recurring** -- use fixed tiers for monthly donations
5. **3 custom fields** on membership links: Member Name (text), Sport (dropdown), Grade (dropdown)
6. **Existing `/join/thanks` pattern** can be adapted for payment confirmation pages
7. **Replace `BOOSTERHUB_URLS` in constants.ts** with `PAYMENT_URLS` and `COMMUNITY_URLS`
8. **11 link references across 8 files** need updating (detailed in codebase analysis)
9. **No testing framework exists** -- consider adding for this integration or use manual QA
10. **Custom domain is $10/month** -- optional but nice for brand consistency

---

## Testing Approach (New -- No Existing Framework)

**Current state**: No testing framework installed. No test files, no test scripts in package.json.

**Recommended setup for this project:**
- **Framework**: Vitest (fast, native ESM, excellent Next.js compatibility)
- **DOM Testing**: @testing-library/react + @testing-library/jest-dom
- **Test location**: `__tests__/` directory at project root, mirroring source structure
- **Naming convention**: `*.test.tsx` for component tests, `*.test.ts` for utility tests
- **Run command**: `npx vitest` or add `"test": "vitest"` to package.json scripts

**Packages to install**: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@vitejs/plugin-react`, `jsdom`

**Configuration**: `vitest.config.ts` at project root with jsdom environment, path aliases matching tsconfig
