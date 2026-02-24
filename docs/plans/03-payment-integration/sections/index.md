<!-- PROJECT_CONFIG
runtime: typescript-npm
test_command: npx vitest run
END_PROJECT_CONFIG -->

<!-- SECTION_MANIFEST
section-01-test-setup
section-02-constants
section-03-buy-button
section-04-payment-thanks
section-05-navigation
section-06-membership
section-07-initiatives
section-08-other-pages
section-09-cleanup
END_MANIFEST -->

# Implementation Sections Index

## Dependency Graph

| Section | Depends On | Blocks | Parallelizable |
|---------|------------|--------|----------------|
| section-01-test-setup | - | all | Yes (standalone) |
| section-02-constants | 01 | 03, 04, 05, 06, 07, 08, 09 | No |
| section-03-buy-button | 02 | 06 | Yes |
| section-04-payment-thanks | 02 | 09 | Yes |
| section-05-navigation | 02 | 09 | Yes |
| section-06-membership | 03 | 09 | No |
| section-07-initiatives | 02 | 09 | Yes |
| section-08-other-pages | 02 | 09 | Yes |
| section-09-cleanup | 03, 04, 05, 06, 07, 08 | - | No (final) |

## Execution Order

1. **Batch 1**: section-01-test-setup (no dependencies)
2. **Batch 2**: section-02-constants (after 01)
3. **Batch 3**: section-03-buy-button, section-04-payment-thanks, section-05-navigation, section-07-initiatives, section-08-other-pages (parallel after 02)
4. **Batch 4**: section-06-membership (after 03 -- needs StripeBuyButton component)
5. **Batch 5**: section-09-cleanup (after all others complete)

## Section Summaries

### section-01-test-setup
Install Vitest, @testing-library/react, @testing-library/jest-dom, jsdom, @vitejs/plugin-react. Create vitest.config.ts with jsdom environment and path aliases matching tsconfig. Add "test" script to package.json. Verify with a trivial passing test.

### section-02-constants
Refactor `lib/constants.ts`: remove BOOSTERHUB_BASE and BOOSTERHUB_URLS, add PAYMENT_URLS (membership tiers + donation links + customer portal), COMMUNITY_URLS (mailchimp preferences, facebook, signupgenius), and STRIPE_CONFIG (publishable key). Write tests verifying all expected keys exist and old exports are removed.

### section-03-buy-button
Create `components/ui/StripeBuyButton.tsx` -- a `"use client"` component wrapping Stripe's `<stripe-buy-button>` web component. Uses Next.js Script to load Stripe JS with `strategy="afterInteractive"`. Accepts buyButtonId and optional publishableKey props. Write component tests.

### section-04-payment-thanks
Create `app/payment/thanks/page.tsx` -- post-payment confirmation page with thank you message, Mailchimp signup prompt (link to /join), social media links, and info about email receipts and Customer Portal. Follow existing /join/thanks page pattern. Write page render tests.

### section-05-navigation
Update Navbar, MobileMenu, and Footer: replace donate button href with PAYMENT_URLS.donate, replace "Member Login" with "Manage Membership" dropdown (desktop) or separate links (mobile) pointing to Stripe Customer Portal and Mailchimp preferences. Write tests for each component verifying correct links and no BoosterHub references.

### section-06-membership
Update `app/membership/page.tsx`: embed StripeBuyButton components for each of the 4 tiers (Rookie $25, Captain $50, All Star $100, MVP $250), update tier data with prices and Buy Button IDs, update bottom CTA to anchor link, remove "secure member portal" disclaimer. Write page tests.

### section-07-initiatives
Update `app/initiatives/page.tsx`: replace single donation CTA with a section showing monthly recurring tiers ($5/$10/$25/$50/$100 as Payment Link buttons) and one-time flexible donation option. Write page tests verifying correct links.

### section-08-other-pages
Update 4 files: ActionCards.tsx (membership link → /membership internal), store/page.tsx (remove BoosterHub link, add "coming soon" messaging), volunteer/page.tsx (link to SignUpGenius), resources/page.tsx (remove BoosterHub references from FAQ). Write tests for each.

### section-09-cleanup
Final BoosterHub removal sweep: grep codebase for any remaining "boosterhub" references. Run `npm run build` to verify static export succeeds. Run full test suite. Document any remaining manual steps (Stripe product creation, Buy Button ID insertion).
