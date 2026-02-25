# Section 09: Cleanup and Verification

## Overview

This is the final section. It runs after all other sections (01-08) are complete. Its purpose is to sweep the codebase for any remaining BoosterHub references, verify the build succeeds, run the full test suite, and document manual steps for going live.

**Dependencies**: Sections 03, 04, 05, 06, 07, and 08 must all be complete.

---

## Background

The site previously linked to BoosterHub (`pcathleticbooster.boosterhub.com`) for memberships, donations, store, volunteer signups, and member login. Sections 02-08 replaced these references. This section ensures nothing was missed.

### Known BoosterHub Reference Locations (Pre-Migration)

| File | Reference Type |
|------|---------------|
| `lib/constants.ts` | `BOOSTERHUB_BASE` and `BOOSTERHUB_URLS` definitions |
| `components/layout/Navbar.tsx` | `BOOSTERHUB_URLS.login`, `BOOSTERHUB_URLS.donate` |
| `components/layout/MobileMenu.tsx` | `BOOSTERHUB_URLS.login`, `BOOSTERHUB_URLS.donate` |
| `components/layout/Footer.tsx` | `BOOSTERHUB_URLS.login` |
| `components/home/ActionCards.tsx` | `BOOSTERHUB_URLS.membership` |
| `components/home/Hero.tsx` | `BOOSTERHUB_URLS.membership`, `BOOSTERHUB_URLS.donate` |
| `app/membership/page.tsx` | `BOOSTERHUB_URLS.membership` |
| `app/initiatives/page.tsx` | `BOOSTERHUB_URLS.donate` |
| `app/store/page.tsx` | `BOOSTERHUB_URLS.store` |
| `app/resources/page.tsx` | FAQ text mentioning "BoosterHub" |

**IMPORTANT**: `components/home/Hero.tsx` contains BoosterHub references but was NOT explicitly assigned to any prior section. This file must be checked and fixed here if missed.

---

## Tests First

### Integration Tests: `__tests__/integration/no-boosterhub.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import path from "path";

describe("BoosterHub removal verification", () => {
  const rootDir = path.resolve(__dirname, "../..");

  function grepSourceFiles(pattern: string): string[] {
    // Use grep to search .ts/.tsx files
    // Exclude: docs/plans/**, node_modules/**, .next/**, out/**, __tests__/integration/**
    // Return empty array if no matches (grep exit code 1 = no matches = success)
  }

  it("has zero case-insensitive 'boosterhub' matches in source files", () => {
    // Search for "boosterhub" (case-insensitive) in all .ts/.tsx files
    // Expect: matches array length === 0
  });

  it("has zero 'BOOSTERHUB_BASE' references in source files", () => {
    // Expect: matches array length === 0
  });

  it("has zero 'BOOSTERHUB_URLS' references in source files", () => {
    // Expect: matches array length === 0
  });

  it("has zero references to the old BoosterHub domain", () => {
    // Search for "pcathleticbooster.boosterhub.com"
    // Expect: matches array length === 0
  });
});
```

---

## Implementation Details

### Step 1: Grep for Remaining BoosterHub References

Search the codebase for any remaining references. Patterns to search (case-insensitive):
- `boosterhub`
- `BOOSTERHUB_BASE`
- `BOOSTERHUB_URLS`
- `pcathleticbooster.boosterhub.com`

Exclude `docs/plans/`, `node_modules/`, `.next/`, `out/` directories.

### Step 2: Fix `components/home/Hero.tsx` (Likely Missed)

This file was not assigned to prior sections. Current state:

```typescript
import { BOOSTERHUB_URLS } from "@/lib/constants";
// ...
<Button href={BOOSTERHUB_URLS.membership} external>Become a Member</Button>
<Button href={BOOSTERHUB_URLS.donate} variant="outline" external ...>Make a Donation</Button>
```

Required changes:
- Change import from `BOOSTERHUB_URLS` to `PAYMENT_URLS` (from `@/lib/constants`)
- "Become a Member" button: change href to `/membership` (internal route), remove `external` prop
- "Make a Donation" button: change href to `PAYMENT_URLS.donate`

### Step 3: Fix Any Other Remaining References

For each file found in the grep:
1. Replace `BOOSTERHUB_URLS.membership` with `/membership` or `PAYMENT_URLS` equivalent
2. Replace `BOOSTERHUB_URLS.donate` with `PAYMENT_URLS.donate`
3. Replace `BOOSTERHUB_URLS.store` with appropriate reference
4. Replace `BOOSTERHUB_URLS.login` with Manage Membership links
5. Replace `BOOSTERHUB_URLS.volunteer` with `COMMUNITY_URLS.signupGenius`
6. Replace string literal "BoosterHub" mentions in user-facing copy

### Step 4: Write the Integration Test File

Create `__tests__/integration/no-boosterhub.test.ts` with the stubs above. The helper function should use `execSync` with grep, handling exit code 1 (no matches) as success.

### Step 5: Run Full Test Suite

```bash
npx vitest run
```

All tests from sections 01-09 must pass.

### Step 6: Verify the Build

```bash
npm run build
```

The static export must complete without errors. Verify `/out/payment/thanks/index.html` exists.

### Step 7: Document Remaining Manual Steps

**Pre-Launch Manual Checklist:**

1. **Create Stripe Products** -- In Dashboard, create 4 membership products ($25/$50/$100/$250 annual) and 6 donation products (5 monthly tiers + 1 flexible one-time). Configure custom fields (Member Name, Sport, Grade). Set success redirect to `https://pcathleticboosters.org/payment/thanks`.

2. **Generate Buy Button IDs** -- For each membership product, create a Buy Button. Copy `buy-button-id` values into `app/membership/page.tsx` tier data.

3. **Insert Payment Link URLs** -- Copy generated URLs into `PAYMENT_URLS` in `lib/constants.ts`.

4. **Insert Stripe Publishable Key** -- Copy `pk_live_...` from Dashboard into `STRIPE_CONFIG.publishableKey`.

5. **Activate Customer Portal** -- Enable in Dashboard > Settings > Billing. Copy URL into `PAYMENT_URLS.customer_portal`.

6. **Configure Stripe Branding** -- Brand color `#CC0033`, accent `#111111`, font Inter, border radius Rounded, upload logo/icon.

7. **Set Up SignUpGenius** -- Create volunteer page, insert URL into `COMMUNITY_URLS.signupGenius`.

8. **Set Up Facebook Group** -- Insert URL into `COMMUNITY_URLS.facebookGroup`.

9. **Configure Mailchimp Preferences URL** -- Insert into `COMMUNITY_URLS.mailchimpPreferences`.

10. **Manual Browser Testing** -- After deploying with real credentials:
    - Verify all navigation links
    - Verify Buy Buttons render and open Stripe Checkout
    - Verify Manage Membership dropdown on desktop and mobile
    - Verify `/payment/thanks` page after test checkout
    - Verify no broken links or 404s
    - Verify store shows "coming soon"
    - Test mobile responsiveness

---

## Verification Checklist

- [x] Grep for `boosterhub` (case-insensitive) in source files returns zero results
- [x] Grep for `BOOSTERHUB_BASE` returns zero results
- [x] Grep for `BOOSTERHUB_URLS` returns zero results
- [x] Grep for `pcathleticbooster.boosterhub.com` returns zero results
- [x] `components/home/Hero.tsx` is updated (no BoosterHub references)
- [x] `__tests__/integration/no-boosterhub.test.ts` created and passing (4 tests)
- [x] `npx vitest run` passes all tests (14 files, 62 tests)
- [x] `npm run build` completes with zero errors (16 pages generated)
- [x] Pre-launch manual checklist documented in this section file (Step 7 above)

## Implementation Notes

- Only Hero.tsx had remaining BoosterHub references in source code; all other grep matches were in test assertions (expected)
- Code review auto-fix: added path normalization for Windows compatibility in integration test
- Code review auto-fix: improved error handling in grep helper (re-throws non-"no match" errors)
- Build output format: Next.js 16 uses `out/payment/thanks.html` (not `index.html` subdirectory)
