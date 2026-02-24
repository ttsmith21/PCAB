# Section 02: Constants Refactoring

## Overview

This section refactors `lib/constants.ts` to remove all BoosterHub references and replace them with Stripe payment URLs, community URLs, and Stripe configuration. This is the foundational change that all subsequent sections depend on -- every component that currently imports `BOOSTERHUB_URLS` will need to be updated (handled in later sections).

## Dependencies

- **section-01-test-setup** must be completed first (Vitest and React Testing Library installed and configured)

## Blocked Sections

This section blocks sections 03 through 09. All downstream work depends on the new constant exports defined here.

---

## File to Modify

**`lib/constants.ts`** (absolute path: `C:/Users/tsmith/OneDrive - Northern Manufacturing Co., Inc/Documents/GitHub/PC-Boosters-Web/lib/constants.ts`)

### Current Contents

The file currently exports these constants:

```ts
export const BOOSTERHUB_BASE = "https://pcathleticbooster.boosterhub.com";

export const BOOSTERHUB_URLS = {
  membership: `${BOOSTERHUB_BASE}/membership`,
  volunteer: `${BOOSTERHUB_BASE}/volunteer`,
  store: `${BOOSTERHUB_BASE}/store`,
  login: `${BOOSTERHUB_BASE}/login`,
  donate: `${BOOSTERHUB_BASE}/store`,
} as const;

export const SITE_CONFIG = { /* ... unchanged ... */ } as const;

export const MAILCHIMP_CONFIG = { /* ... unchanged ... */ } as const;

export const MAILCHIMP_GROUPS = { /* ... unchanged ... */ } as const;

export const COMMUNITY_URLS = {
  join: "/join",
  facebookPage: "https://www.facebook.com/PCathleticboosters",
  facebookGroup: "https://facebook.com/groups/<GROUP_SLUG>",
  signupGenius: "https://www.signupgenius.com/<SIGNUP_SLUG>",
} as const;
```

### What to Remove

Delete `BOOSTERHUB_BASE` and `BOOSTERHUB_URLS` entirely (lines 1-9). These two exports must not exist after this section is complete.

**Important**: Removing these exports will intentionally break 8+ files that currently import `BOOSTERHUB_URLS`. Those import errors are resolved in later sections (05, 06, 07, 08). The build will not pass until those sections are also completed. This is expected.

### What to Add

Add two new exported constants: `PAYMENT_URLS` and `STRIPE_CONFIG`. Also update the existing `COMMUNITY_URLS` to include a `mailchimpPreferences` key.

#### `PAYMENT_URLS`

An object containing all Stripe Payment Link URLs for memberships and donations, plus the Stripe Customer Portal URL. Use placeholder `https://buy.stripe.com/placeholder_*` URLs until the real Stripe products are created in the Dashboard.

Required keys:
- `membership_rookie` -- Rookie tier ($25/year) Payment Link
- `membership_captain` -- Captain tier ($50/year) Payment Link
- `membership_allstar` -- All Star tier ($100/year) Payment Link
- `membership_mvp` -- MVP tier ($250/year) Payment Link
- `donate` -- One-time flexible donation Payment Link
- `donate_monthly_5` -- $5/month recurring Payment Link
- `donate_monthly_10` -- $10/month recurring Payment Link
- `donate_monthly_25` -- $25/month recurring Payment Link
- `donate_monthly_50` -- $50/month recurring Payment Link
- `donate_monthly_100` -- $100/month recurring Payment Link
- `customer_portal` -- Stripe Customer Portal URL

All values must be strings starting with `https://`. Use `as const` for type safety.

#### `STRIPE_CONFIG`

An object containing the Stripe publishable key used by the StripeBuyButton component (created in section-03). The publishable key (`pk_live_...` or `pk_test_...`) is safe to expose client-side. Use a placeholder value until the real key is obtained from the Stripe Dashboard.

Required keys:
- `publishableKey` -- Stripe publishable API key

Use `as const` for type safety.

#### `COMMUNITY_URLS` Updates

The existing `COMMUNITY_URLS` object must be updated to include a `mailchimpPreferences` key pointing to the Mailchimp preference center URL. This is used by the "Manage Membership" dropdown in the navigation (section-05). The existing keys (`join`, `facebookPage`, `facebookGroup`, `signupGenius`) remain unchanged.

Keep the existing camelCase convention to avoid unnecessary changes in files that already import these keys.

### What to Leave Unchanged

- `SITE_CONFIG` -- no changes
- `MAILCHIMP_CONFIG` -- no changes
- `MAILCHIMP_GROUPS` -- no changes

---

## Test File to Create

**`__tests__/lib/constants.test.ts`**

Write tests BEFORE implementing the changes. The tests verify the shape of the new exports and confirm the old exports are gone.

### Test Specifications

The test file should contain the following test cases organized in `describe` blocks:

**`describe("PAYMENT_URLS")`**

- Test that `PAYMENT_URLS` exports all expected membership keys: `membership_rookie`, `membership_captain`, `membership_allstar`, `membership_mvp`.
- Test that `PAYMENT_URLS` exports all expected donation keys: `donate`, `donate_monthly_5`, `donate_monthly_10`, `donate_monthly_25`, `donate_monthly_50`, `donate_monthly_100`.
- Test that `PAYMENT_URLS` exports a `customer_portal` key.
- Test that ALL values in `PAYMENT_URLS` are strings starting with `"https://"`.

**`describe("COMMUNITY_URLS")`**

- Test that `COMMUNITY_URLS` exports `mailchimpPreferences`, `facebookGroup`, and `signupGenius` keys.

**`describe("STRIPE_CONFIG")`**

- Test that `STRIPE_CONFIG` exports a `publishableKey` key.

**`describe("BoosterHub removal")`**

- Test that the module does NOT export `BOOSTERHUB_URLS`. Import everything with `import * as constants from "@/lib/constants"` and assert that `constants` does not have a `BOOSTERHUB_URLS` property.
- Test that the module does NOT export `BOOSTERHUB_BASE`. Assert that `constants` does not have a `BOOSTERHUB_BASE` property.

### Placeholder Values

All URLs should be valid-looking `https://` URLs even though they are placeholders. This ensures the URL validation tests pass immediately. Example patterns:

- `https://buy.stripe.com/placeholder_membership_rookie`
- `https://billing.stripe.com/p/login/placeholder`
- `https://mailchimp.com/preferences/placeholder`

The `STRIPE_CONFIG.publishableKey` should be `"pk_test_placeholder"` -- it does not need to start with `https://` since it is a key, not a URL.

---

## Implementation Guidance

### Step-by-step

1. **Create the test file** at `__tests__/lib/constants.test.ts` with all the tests listed above. Run `npx vitest run __tests__/lib/constants.test.ts` to confirm tests fail (red phase).

2. **Edit `lib/constants.ts`**:
   - Delete the `BOOSTERHUB_BASE` and `BOOSTERHUB_URLS` declarations.
   - Add the `PAYMENT_URLS` export with all 11 keys, each set to a placeholder `https://buy.stripe.com/placeholder_<key_name>` URL. Use `as const`.
   - Add the `STRIPE_CONFIG` export with a `publishableKey` set to `"pk_test_placeholder"`. Use `as const`.
   - Update the existing `COMMUNITY_URLS` object to add `mailchimpPreferences: "https://mailchimp.com/preferences/placeholder"`. Keep the existing keys intact.

3. **Run the tests** again: `npx vitest run __tests__/lib/constants.test.ts`. All tests should pass (green phase).

4. **Do NOT fix broken imports** in other files. Those files (Navbar, MobileMenu, Footer, ActionCards, Hero, membership page, initiatives page, store page) currently import `BOOSTERHUB_URLS` and will show TypeScript/build errors. This is expected and will be resolved in sections 05-08.

---

## Consumers of These Constants (Reference Only)

The following files will need to be updated to import the new constants instead of `BOOSTERHUB_URLS`. These updates are handled in other sections and listed here only for awareness:

| File | Current Import | Updated In |
|------|---------------|------------|
| `components/layout/Navbar.tsx` | `BOOSTERHUB_URLS` | section-05 |
| `components/layout/MobileMenu.tsx` | `BOOSTERHUB_URLS` | section-05 |
| `components/layout/Footer.tsx` | `BOOSTERHUB_URLS` | section-05 |
| `components/home/ActionCards.tsx` | `BOOSTERHUB_URLS` | section-08 |
| `components/home/Hero.tsx` | `BOOSTERHUB_URLS` | section-08 |
| `app/membership/page.tsx` | `BOOSTERHUB_URLS` | section-06 |
| `app/initiatives/page.tsx` | `BOOSTERHUB_URLS` | section-07 |
| `app/store/page.tsx` | `BOOSTERHUB_URLS` | section-08 |

---

## Checklist

- [ ] Create `__tests__/lib/constants.test.ts` with tests for PAYMENT_URLS, COMMUNITY_URLS, STRIPE_CONFIG, and BoosterHub removal
- [ ] Run tests -- verify they fail (red phase)
- [ ] Delete BOOSTERHUB_BASE and BOOSTERHUB_URLS from `lib/constants.ts`
- [ ] Add PAYMENT_URLS with all 11 placeholder keys
- [ ] Add STRIPE_CONFIG with placeholder publishableKey
- [ ] Add mailchimpPreferences to COMMUNITY_URLS
- [ ] Run tests -- verify they all pass (green phase)
