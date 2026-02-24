# TDD Plan: Stripe Payment Integration

> Companion to `claude-plan.md`. Defines tests to write BEFORE implementing each section.
> Framework: Vitest + React Testing Library (new setup -- no existing test framework)

---

## Testing Setup (Prerequisite)

Before writing any feature tests, set up the test infrastructure:
- Install vitest, @testing-library/react, @testing-library/jest-dom, @vitejs/plugin-react, jsdom
- Create vitest.config.ts with jsdom environment and path aliases matching tsconfig
- Add "test" script to package.json
- Verify setup with a trivial passing test

---

## 3. Constants Refactoring

### Tests to write first (`__tests__/lib/constants.test.ts`)

- Test: PAYMENT_URLS exports all expected membership keys (membership_rookie, membership_captain, membership_allstar, membership_mvp)
- Test: PAYMENT_URLS exports all expected donation keys (donate, donate_monthly_5, donate_monthly_10, donate_monthly_25, donate_monthly_50, donate_monthly_100)
- Test: PAYMENT_URLS exports customer_portal key
- Test: COMMUNITY_URLS exports mailchimp_preferences, facebook_group, signupgenius keys
- Test: STRIPE_CONFIG exports publishableKey
- Test: BOOSTERHUB_URLS is NOT exported (verify removal)
- Test: BOOSTERHUB_BASE is NOT exported (verify removal)
- Test: All PAYMENT_URLS values are strings starting with "https://"

---

## 4. StripeBuyButton Component

### Tests to write first (`__tests__/components/ui/StripeBuyButton.test.tsx`)

- Test: Renders a stripe-buy-button element with correct buy-button-id attribute
- Test: Renders a stripe-buy-button element with correct publishable-key attribute
- Test: Uses default publishable key from STRIPE_CONFIG when not explicitly provided
- Test: Renders Script element with correct Stripe JS URL
- Test: Applies optional className to wrapper element
- Test: Does not crash when rendered without optional props

---

## 5. Navigation Updates

### 5.1 Navbar Tests (`__tests__/components/layout/Navbar.test.tsx`)

- Test: Donate button links to PAYMENT_URLS.donate
- Test: Donate button opens in new tab (external link behavior)
- Test: "Manage Membership" dropdown renders with correct label
- Test: Dropdown contains "Billing & Subscription" link pointing to PAYMENT_URLS.customer_portal
- Test: Dropdown contains "Email Preferences" link pointing to COMMUNITY_URLS.mailchimp_preferences
- Test: No "Member Login" text appears anywhere in the navbar
- Test: No BoosterHub URL appears in any link

### 5.2 MobileMenu Tests (`__tests__/components/layout/MobileMenu.test.tsx`)

- Test: Donate button links to PAYMENT_URLS.donate
- Test: "Billing & Subscription" link present with correct href
- Test: "Email Preferences" link present with correct href
- Test: No "Member Login" text in mobile menu
- Test: No BoosterHub URL in any link

### 5.3 Footer Tests (`__tests__/components/layout/Footer.test.tsx`)

- Test: "Billing & Subscription" link present with correct href
- Test: "Email Preferences" link present with correct href
- Test: No "Member Login" text in footer
- Test: No BoosterHub URL in any link

---

## 6. Membership Page

### Tests to write first (`__tests__/app/membership/page.test.tsx`)

- Test: Page renders 4 membership tiers (Rookie, Captain, All Star, MVP)
- Test: Each tier displays correct price ($25, $50, $100, $250)
- Test: Each tier renders a StripeBuyButton component
- Test: No BoosterHub URL appears on the page
- Test: No "secure member portal" disclaimer text on page
- Test: Bottom CTA links to membership section (anchor/scroll), not external URL

---

## 7. Initiatives Page

### Tests to write first (`__tests__/app/initiatives/page.test.tsx`)

- Test: Page renders monthly donation options ($5, $10, $25, $50, $100)
- Test: Page renders one-time donation option
- Test: Monthly donation links point to correct PAYMENT_URLS keys
- Test: One-time donation link points to PAYMENT_URLS.donate
- Test: No BoosterHub URL appears on the page

---

## 8. Store Page

### Tests to write first (`__tests__/app/store/page.test.tsx`)

- Test: Page does not link to BoosterHub store
- Test: Page indicates spirit wear is coming soon (or equivalent messaging)
- Test: Page links to /join or mailing list signup

---

## 9. Volunteer Page

### Tests to write first (`__tests__/app/volunteer/page.test.tsx`)

- Test: Volunteer signup link points to COMMUNITY_URLS.signupgenius
- Test: No BoosterHub URL appears on the page

---

## 10. Other Page Updates

### 10.1 ActionCards Tests (`__tests__/components/home/ActionCards.test.tsx`)

- Test: Membership action card links to /membership (internal route)
- Test: Membership action card is NOT an external link
- Test: No BoosterHub URL in any action card

### 10.2 Resources Page Tests (`__tests__/app/resources/page.test.tsx`)

- Test: No "BoosterHub" text appears in FAQ content
- Test: No BoosterHub URL in any link

---

## 11. Payment Confirmation Page

### Tests to write first (`__tests__/app/payment/thanks/page.test.tsx`)

- Test: Page renders thank you heading/message
- Test: Page contains Mailchimp signup prompt (link to /join or embedded form)
- Test: Page contains social media links (Facebook group)
- Test: Page mentions email receipt from Stripe
- Test: Page mentions Customer Portal for subscription management

---

## 12. Cleanup & Verification

### Integration Tests (`__tests__/integration/no-boosterhub.test.ts`)

- Test: grep entire codebase for "boosterhub" (case-insensitive) returns zero matches outside planning docs
- Test: grep for BOOSTERHUB_BASE returns zero matches
- Test: grep for BOOSTERHUB_URLS returns zero matches

### Build Verification

- Test: `npm run build` completes without errors (run as part of CI or manual check)
