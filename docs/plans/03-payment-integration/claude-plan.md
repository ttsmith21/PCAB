# Implementation Plan: Stripe Payment Integration

## 1. Overview

### What We're Building

The PC Athletic Boosters website is a statically-exported Next.js site (Next.js 16, `output: "export"`) that currently links to BoosterHub for memberships, donations, and a store. BoosterHub was never launched, costs $850/year, and provides no embed or API capabilities. We are replacing all BoosterHub references with Stripe Payment Links and Buy Buttons -- a zero-platform-fee, embeddable payment solution that works entirely client-side on a static site.

### What Changes

- **4 annual membership subscriptions** ($25/$50/$100/$250 per year, auto-renewing) with embedded Buy Buttons
- **6 donation Payment Links** (5 fixed monthly recurring tiers + 1 flexible one-time)
- **"Member Login" → "Manage Membership" dropdown** with links to Stripe Customer Portal and Mailchimp email preferences
- **New `/payment/thanks` confirmation page** with Mailchimp signup prompt and social links
- **Volunteer page** updated to point to SignUpGenius instead of BoosterHub
- **All BoosterHub references removed** from constants, components, and page copy
- **Spirit wear is deferred** to a later iteration

### Why This Approach

Stripe Buy Buttons are web components (`<stripe-buy-button>`) that load from Stripe's CDN and render entirely in the browser. They require zero server-side code, making them the only Stripe payment UI compatible with a static Next.js export. Each button opens Stripe's hosted checkout as an overlay with Apple Pay, Google Pay, and card support. Branding (colors, Inter font, logo) is configured once in the Stripe Dashboard and applies across all payment surfaces.

### Architecture Constraints

- **Static site**: No API routes, no server-side rendering, no webhooks
- **3 custom fields max** per Stripe Payment Link
- **One product per Buy Button**: Each membership tier and donation amount needs its own button
- **No "customer chooses price" for recurring**: Monthly donations use fixed-amount tiers
- **No cart**: Each purchase is a separate Stripe checkout session

---

## 2. Prerequisites (Manual Stripe Dashboard Setup)

Before any code changes, the following must be configured in the Stripe Dashboard. These are manual steps, not code.

### 2.1 Stripe Account & Branding

Create a Stripe account for PC Athletic Boosters. In Dashboard > Settings > Branding:
- Upload square icon (PC monogram, JPG/PNG, <512KB, min 128x128px)
- Upload wider logo (full "PC Boosters" wordmark)
- Set brand/button color to `#CC0033` (site primary red)
- Set accent color to `#111111` (site dark)
- Select **Inter** font (exact match to site body font)
- Set border radius to **Rounded** (matches site component styling)

### 2.2 Create Membership Products

Create 4 products, each with an annual recurring price:

| Product Name | Price | Billing Cycle | Custom Fields |
|-------------|-------|---------------|---------------|
| Rookie Membership | $25/year | Annual | Member Name (text), Sport (dropdown), Grade (dropdown) |
| Captain Membership | $50/year | Annual | Member Name (text), Sport (dropdown), Grade (dropdown) |
| All Star Membership | $100/year | Annual | Member Name (text), Sport (dropdown), Grade (dropdown) |
| MVP Membership | $250/year | Annual | Member Name (text), Sport (dropdown), Grade (dropdown) |

For each: generate a Payment Link, configure success redirect to `https://pcathleticboosters.org/payment/thanks`, and generate a Buy Button from the Payment Link.

The **Sport** dropdown should list school sports (Football, Basketball, Baseball, Softball, Track & Field, Cross Country, Volleyball, Soccer, Golf, Tennis, Swimming, Wrestling, etc.). The **Grade** dropdown: 9, 10, 11, 12.

### 2.3 Create Donation Products

| Product Name | Price | Billing |
|-------------|-------|---------|
| Monthly Donation - $5 | $5/month | Monthly recurring |
| Monthly Donation - $10 | $10/month | Monthly recurring |
| Monthly Donation - $25 | $25/month | Monthly recurring |
| Monthly Donation - $50 | $50/month | Monthly recurring |
| Monthly Donation - $100 | $100/month | Monthly recurring |
| One-Time Donation | Customer chooses | One-time |

Each gets a Payment Link with optional "Donor Name" custom field and success redirect to `/payment/thanks`.

### 2.4 Activate Customer Portal

In Dashboard > Settings > Billing > Customer Portal:
- Enable "Activate link"
- Allow: update payment methods, view invoices, cancel subscriptions
- Configure cancellation flow with reason capture
- Note the portal URL for use in constants

---

## 3. Constants Refactoring (`lib/constants.ts`)

### Current State

The file defines `BOOSTERHUB_BASE` (a URL string) and `BOOSTERHUB_URLS` (an object mapping keys like `membership`, `volunteer`, `store`, `login`, `donate` to BoosterHub paths). These are imported by 8+ components.

### Target State

Remove `BOOSTERHUB_BASE` and `BOOSTERHUB_URLS` entirely. Replace with three new constant objects:

**`PAYMENT_URLS`**: Contains all Stripe Payment Link URLs for memberships and donations, plus the Customer Portal URL. Keys should follow the pattern `membership_rookie`, `membership_captain`, `membership_allstar`, `membership_mvp` for membership tiers, `donate` for one-time, `donate_monthly_5` through `donate_monthly_100` for monthly tiers, and `customer_portal` for the portal link. All values are placeholder `buy.stripe.com` URLs until the Stripe products are created.

**`COMMUNITY_URLS`**: Contains non-payment external links -- `mailchimp_preferences` (Mailchimp preference center URL), `facebook_group`, and `signupgenius` (volunteer signup).

**`STRIPE_CONFIG`**: Contains the publishable key (`pk_live_...`) used by the Buy Button component. This is safe to expose client-side.

Also update the existing `MAILCHIMP_CONFIG` if needed to ensure the Mailchimp preference center URL is accessible.

### Migration Strategy

Every import of `BOOSTERHUB_URLS` across the codebase must be updated to use the appropriate new constant. A find-and-replace for `BOOSTERHUB` will catch all references.

---

## 4. StripeBuyButton Component

### Purpose

A reusable client component that wraps Stripe's `<stripe-buy-button>` web component for use in Next.js. This is the primary payment UI on the membership and initiatives pages.

### Location

`components/ui/StripeBuyButton.tsx`

### Design

The component should:
- Accept `buyButtonId` (string) and optionally `publishableKey` (string, defaulting to `STRIPE_CONFIG.publishableKey`)
- Use Next.js `Script` component from `next/script` to load `https://js.stripe.com/v3/buy-button.js` with `strategy="afterInteractive"`
- Render the `<stripe-buy-button>` web component with the provided attributes
- Use `@ts-expect-error` comment above the web component JSX (TypeScript doesn't know about custom elements)
- Be marked as `"use client"` since it uses browser APIs via Script

### Script Loading

The Stripe script should only be loaded once even if multiple Buy Buttons are on the page. The Next.js `Script` component handles deduplication automatically -- if the same `src` is rendered by multiple instances, Next.js loads it once.

### Styling

The Buy Button renders inside a shadow DOM controlled by Stripe. The wrapper component should accept an optional `className` prop for positioning/spacing, but internal button styling is configured in the Stripe Dashboard's Buy Button editor.

---

## 5. Navigation Updates

### 5.1 Navbar (`components/layout/Navbar.tsx`)

**Current state**: Desktop nav has a "Member Login" link (line ~80) pointing to `BOOSTERHUB_URLS.login` and a red "Donate" button (line ~90) pointing to `BOOSTERHUB_URLS.donate`.

**Changes**:

1. **Donate button**: Update href to `PAYMENT_URLS.donate` (one-time donation Payment Link). Keep the red styling and external link behavior.

2. **Member Login → Manage Membership dropdown**: Replace the single login link with a dropdown menu. On hover/click, show two items:
   - "Billing & Subscription" → `PAYMENT_URLS.customer_portal` (external, opens Stripe)
   - "Email Preferences" → `COMMUNITY_URLS.mailchimp_preferences` (external, opens Mailchimp)

   The dropdown should follow the same styling patterns as existing nav elements. Use a simple hover-triggered dropdown with Tailwind -- the site already uses `group` and `group-hover` patterns in the Navbar for similar interactions.

### 5.2 MobileMenu (`components/layout/MobileMenu.tsx`)

**Current state**: Has "Member Login" link (line ~46) and "Donate" button (line ~55).

**Changes**: Same as Navbar -- update Donate href, replace Login with two separate links (no dropdown needed in mobile -- just list both "Billing & Subscription" and "Email Preferences" as separate menu items under a "Manage Membership" heading).

### 5.3 Footer (`components/layout/Footer.tsx`)

**Current state**: Has "Member Login" link (line ~75) in the Connect section.

**Changes**: Replace with two links under a "Member Services" or similar heading: "Billing & Subscription" and "Email Preferences" pointing to the same destinations.

---

## 6. Membership Page (`app/membership/page.tsx`)

### Current State

The page displays 4 membership tiers as cards. Each card has a "Join Now" button (line ~174) linking to `BOOSTERHUB_URLS.membership`. There's also a bottom CTA section (line ~217) with another "Become a Member" button.

### Changes

**Tier cards**: Replace each "Join Now" button/link with a `StripeBuyButton` component, passing the appropriate `buyButtonId` for that tier. The Buy Button IDs will come from the Stripe Dashboard after products are created. For now, define placeholder IDs in a tier data structure.

Consider updating the tier data (likely in `lib/data/` or inline in the page) to include a `buyButtonId` field alongside the existing tier name, price, and benefits. Tier prices should be updated to $25, $50, $100, $250.

**Bottom CTA**: Replace with a link to the membership tiers section (anchor scroll) rather than an external link, since the Buy Buttons are now embedded on the page itself.

**Copy updates**: Remove any disclaimer text about being "taken to our secure member portal." The checkout now happens via an overlay directly from the page.

---

## 7. Initiatives Page (`app/initiatives/page.tsx`)

### Current State

Has a "Make a Donation" CTA button (line ~127) linking to `BOOSTERHUB_URLS.donate`.

### Changes

Replace the donation link with a donation section that presents:
1. **Monthly recurring options**: Display the 5 monthly tiers ($5, $10, $25, $50, $100) as selectable buttons or a row of amount cards, each linking to its respective Payment Link
2. **One-time option**: A "Give Any Amount" button linking to the flexible one-time donation Payment Link

This could be structured as a simple grid of amount buttons with a toggle or tabs between "Monthly" and "One-Time" giving. Keep the design consistent with existing card/button patterns on the site.

Alternatively, if embedding Buy Buttons for all 5 monthly tiers would be visually cluttered, use regular `Button` components linking to the Payment Links (which redirect to Stripe checkout) rather than embedding Buy Buttons inline.

---

## 8. Store Page (`app/store/page.tsx`)

### Current State

Has a "Shop Now" button (line ~94) linking to `BOOSTERHUB_URLS.store`.

### Changes

Spirit wear is deferred to a later iteration. Options:
1. Update the page to say "Spirit wear coming soon" with a prompt to join the mailing list for updates
2. Remove the store link and simplify the page

Keep the page route active (don't delete it) but update the content to reflect that spirit wear will be available in a future release. Link to the `/join` signup page so interested visitors can be notified.

---

## 9. Volunteer Page (`app/volunteer/page.tsx`)

### Current State

Has a signup destination (line ~198) pointing to BoosterHub volunteer.

### Changes

Update the volunteer signup link to point to `COMMUNITY_URLS.signupgenius`. Update any surrounding copy that references BoosterHub. The volunteer page itself stays structurally the same -- only the destination URL changes.

---

## 10. Other Page Updates

### 10.1 Home Page Action Cards (`components/home/ActionCards.tsx`)

The "Join Now" action card (line ~14) links to `BOOSTERHUB_URLS.membership`. Update to link to `/membership` (the on-site membership page where Buy Buttons are now embedded) rather than an external URL. Change `external` prop to `false`.

### 10.2 Resources Page (`app/resources/page.tsx`)

Has FAQ text (line ~47) that may reference BoosterHub. Search for and update any BoosterHub-related copy. Replace with Stripe/payment-appropriate language.

---

## 11. Payment Confirmation Page (`app/payment/thanks/page.tsx`)

### Purpose

A single confirmation page displayed after any successful Stripe payment (membership or donation). The Stripe Payment Link redirects here after checkout.

### Design

Follow the existing `/join/thanks` page pattern:
- **Thank you heading** with a confirmation message
- **Mailchimp signup section**: Prompt the user to join the mailing list if they haven't already. Can reuse or adapt the `SignupForm` component, or provide a simpler link to `/join`
- **Social links**: Facebook group link, other community links
- **Next steps**: Brief note that they'll receive an email receipt from Stripe, and for members, information about managing their subscription via the Customer Portal

### URL Parameters

Stripe can append `{CHECKOUT_SESSION_ID}` to the redirect URL, but since this is a static site with no server-side logic, we cannot look up session details. The page should be generic and work without query parameters. The session ID parameter can be included in the redirect URL for future use if server-side capabilities are added later.

---

## 12. Cleanup & Verification

### BoosterHub Removal Checklist

After all changes are made:
1. Search the entire codebase for "BoosterHub", "boosterhub", "BOOSTERHUB" -- there should be zero references
2. Search for the old BoosterHub base URL domain
3. Verify `lib/constants.ts` has no BoosterHub exports
4. Verify no component imports `BOOSTERHUB_URLS`

### Build Verification

Run `npm run build` to verify the static export completes successfully. The build should produce:
- Updated pages in `/out`
- New `/payment/thanks` page
- No build errors from removed constants or changed imports

### Manual Testing Checklist

Since there is no test framework configured:
- Verify all navigation links point to correct destinations
- Verify Buy Buttons render on the membership page (requires Stripe products to be created)
- Verify the Manage Membership dropdown works on desktop and mobile
- Verify the /payment/thanks page renders correctly
- Verify no broken links or 404s
- Verify the volunteer page links to SignUpGenius
- Test mobile responsiveness of all changed components

---

## 13. File Change Summary

### New Files
| File | Purpose |
|------|---------|
| `components/ui/StripeBuyButton.tsx` | Reusable Stripe Buy Button wrapper component |
| `app/payment/thanks/page.tsx` | Post-payment confirmation page |

### Modified Files
| File | Changes |
|------|---------|
| `lib/constants.ts` | Remove BOOSTERHUB_*, add PAYMENT_URLS, COMMUNITY_URLS, STRIPE_CONFIG |
| `components/layout/Navbar.tsx` | Update donate link, replace login with Manage Membership dropdown |
| `components/layout/MobileMenu.tsx` | Update donate link, replace login with Manage Membership links |
| `components/layout/Footer.tsx` | Replace login link with Member Services links |
| `components/home/ActionCards.tsx` | Update membership link to /membership (internal) |
| `app/membership/page.tsx` | Embed Buy Buttons for 4 tiers, update prices, update bottom CTA |
| `app/initiatives/page.tsx` | Replace donation CTA with donation amount options |
| `app/store/page.tsx` | Update to "coming soon" with mailing list prompt |
| `app/volunteer/page.tsx` | Update signup link to SignUpGenius |
| `app/resources/page.tsx` | Remove BoosterHub references from FAQ copy |

### Deleted Code
- `BOOSTERHUB_BASE` constant
- `BOOSTERHUB_URLS` constant
- All imports of the above

---

## 14. Implementation Order

The recommended implementation sequence:

1. **Constants refactoring** (Section 3) -- establishes new URL structure, breaks existing imports intentionally
2. **StripeBuyButton component** (Section 4) -- creates the reusable payment UI component
3. **Payment confirmation page** (Section 11) -- new page, no dependencies on other changes
4. **Navigation updates** (Section 5) -- Navbar, MobileMenu, Footer
5. **Membership page** (Section 6) -- the most complex page change with Buy Button embeds
6. **Initiatives page** (Section 7) -- donation section redesign
7. **Other page updates** (Section 10) -- ActionCards, Resources, Store, Volunteer
8. **Cleanup & verification** (Section 12) -- final BoosterHub sweep and build check
