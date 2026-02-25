# Section 1: Constants and Dependencies

## Overview

This section adds two new constant objects (`SOCIAL_URLS` and `CURATOR_CONFIG`) to the existing `lib/constants.ts` file and installs the `react-intersection-observer` npm package. These are foundational pieces that all subsequent sections depend on.

**No other sections need to be completed before this one.** This section blocks every other section in the plan.

---

## Background

The project is replacing the existing `FacebookFeed.tsx` iframe component with a Curator.io aggregated social media feed. The Curator.io widget pulls content from Facebook, Instagram, and YouTube into a single waterfall display. To support this, the codebase needs:

1. A centralized `SOCIAL_URLS` constant containing the URLs for all three social media profiles (used by the feed fallback, the social follow banner, and the footer).
2. A `CURATOR_CONFIG` constant containing the Curator.io published feed ID (used by the feed components on the homepage and news page).
3. The `react-intersection-observer` package (used by `SocialFeedSection` in section 03 for viewport-triggered lazy loading).

### Current State of `lib/constants.ts`

The file already exports `PAYMENT_URLS`, `STRIPE_CONFIG`, `SITE_CONFIG`, `MAILCHIMP_CONFIG`, `MAILCHIMP_GROUPS`, and `COMMUNITY_URLS`. Notably, `SITE_CONFIG` already contains social URLs:

```ts
export const SITE_CONFIG = {
  // ...
  facebookPageUrl: "https://www.facebook.com/PortClintonAthleticBoosters",
  instagramUrl: "https://www.instagram.com/portclintonathleticboosters/",
  xUrl: "https://x.com/PCAthleticBoost",
  youtubeUrl: "https://www.youtube.com/@PCAthleticBoosters",
  // ...
} as const;
```

The new `SOCIAL_URLS` constant consolidates the three relevant URLs (Facebook, Instagram, YouTube) into a single object specifically for the social feed feature. This avoids tight coupling to `SITE_CONFIG` and makes it clear which URLs are used by the social media components.

---

## Tests First

**Test file**: `__tests__/lib/constants.test.ts`

This file already exists and contains tests for `PAYMENT_URLS`, `COMMUNITY_URLS`, `STRIPE_CONFIG`, and the BoosterHub removal verification. Append the following new `describe` blocks to the end of the file.

### Test Stubs to Add

```ts
import { SOCIAL_URLS, CURATOR_CONFIG } from "@/lib/constants";

describe("SOCIAL_URLS", () => {
  it("exports an object with facebook, instagram, and youtube keys", () => {
    expect(SOCIAL_URLS).toHaveProperty("facebook");
    expect(SOCIAL_URLS).toHaveProperty("instagram");
    expect(SOCIAL_URLS).toHaveProperty("youtube");
  });

  it("has all values as valid https:// URL strings", () => {
    for (const [key, value] of Object.entries(SOCIAL_URLS)) {
      expect(value, `${key} should start with https://`).toMatch(/^https:\/\//);
    }
  });
});

describe("CURATOR_CONFIG", () => {
  it("exports an object with a feedId key", () => {
    expect(CURATOR_CONFIG).toHaveProperty("feedId");
  });

  it("has feedId as a non-empty string", () => {
    expect(typeof CURATOR_CONFIG.feedId).toBe("string");
    expect(CURATOR_CONFIG.feedId.length).toBeGreaterThan(0);
  });
});
```

Note: the existing import line at the top of the file `import { PAYMENT_URLS, COMMUNITY_URLS, STRIPE_CONFIG } from "@/lib/constants";` must be updated to also import `SOCIAL_URLS` and `CURATOR_CONFIG`. The wildcard import `import * as constants from "@/lib/constants";` already present will also cover the new exports for the BoosterHub removal tests.

### Dependency Installation Verification

These are not unit tests but build verification steps to run after installing the package:

- Confirm `react-intersection-observer` appears in the `dependencies` section of `package.json`.
- Confirm `npm run build` succeeds with the new dependency installed.
- Confirm `npm test` passes (including the new constants tests above).

---

## Implementation Details

### Step 1: Install `react-intersection-observer`

Run the following command from the project root:

```bash
npm install react-intersection-observer
```

This adds the package to the `dependencies` section of `package.json`. Key facts about this package:

- Approximately 2KB gzipped
- Provides the `useInView` hook for detecting when an element enters the viewport
- Well-maintained, widely used in React and Next.js projects
- Will be consumed by `SocialFeedSection.tsx` (section 03)

No other packages need to be installed. `next/script`, `next/dynamic`, and `lucide-react` are already available in the project.

### Step 2: Add Constants to `lib/constants.ts`

**File to modify**: `lib/constants.ts`

Add two new exported constant objects at the end of the file (after the existing `COMMUNITY_URLS` export):

**`SOCIAL_URLS`** -- an object with three keys:

- `facebook` -- The Facebook page URL. Use the same URL as `SITE_CONFIG.facebookPageUrl`: `"https://www.facebook.com/PortClintonAthleticBoosters"`
- `instagram` -- The Instagram profile URL. Use the same URL as `SITE_CONFIG.instagramUrl`: `"https://www.instagram.com/portclintonathleticboosters/"`
- `youtube` -- The YouTube channel URL. Use the same URL as `SITE_CONFIG.youtubeUrl`: `"https://www.youtube.com/@PCAthleticBoosters"`

Mark with `as const` for type safety, consistent with all other constants in the file.

**`CURATOR_CONFIG`** -- an object with one key:

- `feedId` -- The Curator.io published feed ID (string). Use `"placeholder"` as the initial value. This is a public value (it appears in the published script URL `https://cdn.curator.io/published/{feedId}.js`) so it does not need to be an environment variable. When the Curator.io account is created and the feed is published, replace `"placeholder"` with the actual feed ID from the Curator.io dashboard. During development, the placeholder causes the Curator.io script to 404, which is handled gracefully -- the fallback social links display instead.

Mark with `as const` for type safety.

### Design Notes

- The URLs in `SOCIAL_URLS` intentionally duplicate values from `SITE_CONFIG`. This is deliberate: `SOCIAL_URLS` is a focused constant for the social feed feature, while `SITE_CONFIG` is a general site metadata object. Keeping both avoids breaking changes if `SITE_CONFIG` is refactored later. Whether to consolidate them into one is a future cleanup decision (covered in section 08).
- X/Twitter is intentionally excluded from `SOCIAL_URLS`. The Curator.io free plan supports 3 sources (Facebook, Instagram, YouTube) and the social feed feature focuses on those three platforms.
- The `as const` assertion ensures TypeScript infers literal types for all values, enabling type-safe access patterns downstream.

### Step 3: Update the Test File Import

**File to modify**: `__tests__/lib/constants.test.ts`

Update the named import at the top of the file to include the two new exports:

```ts
import { PAYMENT_URLS, COMMUNITY_URLS, STRIPE_CONFIG, SOCIAL_URLS, CURATOR_CONFIG } from "@/lib/constants";
```

Then add the two new `describe` blocks shown in the "Tests First" section above.

### Step 4: Verify

Run the test suite to confirm the new tests pass:

```bash
npm test
```

All four new test cases (two in `SOCIAL_URLS` describe, two in `CURATOR_CONFIG` describe) should pass, along with all existing tests.

---

## Files Summary

| File | Action | Description |
|------|--------|-------------|
| `lib/constants.ts` | Modify | Add `SOCIAL_URLS` and `CURATOR_CONFIG` exports |
| `__tests__/lib/constants.test.ts` | Modify | Add test cases for `SOCIAL_URLS` and `CURATOR_CONFIG` |
| `package.json` | Modify (via npm install) | Add `react-intersection-observer` to dependencies |

---

## Downstream Dependencies

The following sections depend on this section being complete:

- **Section 02 (CuratorFeed Component)** -- uses `CURATOR_CONFIG.feedId`
- **Section 03 (SocialFeedSection Component)** -- uses `react-intersection-observer` and `SOCIAL_URLS`
- **Section 04 (SocialFollowBanner Component)** -- uses `SOCIAL_URLS`
- **Section 05 (News Page Redesign)** -- uses `CURATOR_CONFIG`
- **Section 06 (Homepage Modification)** -- uses `CURATOR_CONFIG`
- **Section 07 (Footer Modification)** -- uses `SOCIAL_URLS`
