# Section 8: Cleanup and Integration

## Overview

This is the final section of the social media and news feed integration plan. After sections 5 (News Page Redesign), 6 (Homepage Modification), and 7 (Footer Modification) have been completed, all references to `FacebookFeed` have been replaced by the new `SocialFeedSection` and `CuratorFeed` components. This section handles deleting the old `FacebookFeed` component, verifying no stale references remain, and writing integration tests that confirm the entire feature set works together end-to-end.

**Dependencies**: This section must be executed after sections 05, 06, and 07 are complete. All pages and layout components must already be using the new social feed components before proceeding with deletion.

---

## Tests First

This section produces two categories of tests:

1. **Cleanup verification tests** -- Confirm that `FacebookFeed` has been fully removed from the codebase
2. **Integration tests** -- Confirm that all new social feed components are wired up correctly across all pages

### 1. Cleanup Verification Tests

**Test file**: `__tests__/integration/no-facebook-feed.test.ts`

This test follows the exact same pattern as the existing `__tests__/integration/no-boosterhub.test.ts` file, which uses `grep` to search source files for stale references.

```ts
import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

describe("FacebookFeed removal verification", () => {
  const rootDir = path.resolve(__dirname, "../..");

  function normalizePath(p: string): string {
    return p.replace(/\\/g, "/");
  }

  function grepSourceFiles(pattern: string): string[] {
    // Same helper pattern as no-boosterhub.test.ts:
    // grep -r -i -l for the pattern in .ts/.tsx files,
    // exclude node_modules/.next/out,
    // filter out docs/plans/ and __tests__/integration/ matches
    // Return empty array if grep exit code is 1 (no matches)
  }

  it("has zero 'FacebookFeed' references in source files", () => {
    // Use grepSourceFiles("FacebookFeed"), filter out __tests__/ and docs/plans/
    // Expect empty array
  });

  it("FacebookFeed.tsx file does not exist", () => {
    const filePath = path.resolve(rootDir, "components/ui/FacebookFeed.tsx");
    expect(fs.existsSync(filePath)).toBe(false);
  });
});
```

### 2. Integration Tests

**Test file**: `__tests__/integration/social-feed.test.tsx`

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock SocialFeedSection so we can verify it receives correct props
vi.mock("@/components/ui/SocialFeedSection", () => ({
  default: ({ feedId, className }: any) => (
    <div data-testid="social-feed-section" data-feed-id={feedId} className={className} />
  ),
}));

// Mock SocialFollowBanner
vi.mock("@/components/ui/SocialFollowBanner", () => ({
  default: () => <div data-testid="social-follow-banner" />,
}));

// Mock other heavy child components to keep tests focused

describe("Social feed integration", () => {
  it("News page renders SocialFeedSection with correct Curator.io feedId", () => {
    // Render the News page, verify data-feed-id matches CURATOR_CONFIG.feedId
  });

  it("Homepage renders SocialFeedSection with correct Curator.io feedId", () => {
    // Render the Homepage, verify data-feed-id matches CURATOR_CONFIG.feedId
  });

  it("Footer contains all three social media links (Facebook, Instagram, YouTube)", () => {
    // Render Footer, query for links containing the social profile URLs
  });

  it("All social URLs across components are consistent with SOCIAL_URLS constants", () => {
    // Import SOCIAL_URLS, render Footer, verify hrefs match
  });

  it("SocialFollowBanner renders on the News page", () => {
    // Render News page, verify data-testid="social-follow-banner" is present
  });
});
```

---

## Implementation Steps

### Step 1: Delete FacebookFeed Component

Delete `components/ui/FacebookFeed.tsx` -- the old Facebook Page Plugin iframe wrapper. After sections 05 and 06 are complete, no page imports this component.

### Step 2: Delete FacebookFeed Test File (If It Exists)

Check for and delete any test file at `__tests__/components/ui/FacebookFeed.test.tsx`. Currently no test file exists, but verify before proceeding.

### Step 3: Verify No Remaining Imports

Search the entire codebase for remaining references to `FacebookFeed`:
- Search all `.ts` and `.tsx` files
- Exclude `node_modules/`, `.next/`, `out/`, `docs/plans/`, and `__tests__/integration/`
- Should return zero results

Files that previously imported FacebookFeed (should already be updated):
- `app/page.tsx` -- had `import FacebookFeed from "@/components/ui/FacebookFeed"`
- `app/news/page.tsx` -- had `import FacebookFeed from "@/components/ui/FacebookFeed"`

### Step 4: Review SITE_CONFIG.facebookPageUrl Usage

After deleting `FacebookFeed.tsx`, check whether `SITE_CONFIG.facebookPageUrl` is still referenced. If section 07 updated the Footer to use `SOCIAL_URLS.facebook`, then `SITE_CONFIG.facebookPageUrl` may be unused. Either keep it (safe) or remove it (cleaner, verify with grep first).

### Step 5: Write the Cleanup Verification Tests

Create `__tests__/integration/no-facebook-feed.test.ts` following the pattern from `__tests__/integration/no-boosterhub.test.ts`:
- Use `execSync` with `grep -r -i -l`
- Include only `*.ts` and `*.tsx` files
- Exclude `node_modules`, `.next`, `out` directories
- Normalize paths for Windows compatibility
- Filter out `docs/plans/` and `__tests__/integration/` matches
- Handle grep exit code 1 (no matches) by returning empty array

### Step 6: Write the Integration Tests

Create `__tests__/integration/social-feed.test.tsx`:
- Import actual page components and render them
- Mock child components not under test
- Use `data-testid` and `data-feed-id` to verify composition
- Import `CURATOR_CONFIG` and `SOCIAL_URLS` to verify prop values
- Render real Footer for social link verification

### Step 7: Run Full Test Suite

```bash
npm test
```

All tests should pass including new cleanup and integration tests.

### Step 8: Run Build Verification

```bash
npm run build
```

Build should complete without errors.

---

## Files Created

| File | Purpose |
|------|---------|
| `__tests__/integration/no-facebook-feed.test.ts` | Verifies FacebookFeed has been fully removed |
| `__tests__/integration/social-feed.test.tsx` | Integration tests for social feed across all pages |

## Files Deleted

| File | Reason |
|------|--------|
| `components/ui/FacebookFeed.tsx` | Replaced by CuratorFeed and SocialFeedSection |

## Verification Checklist

- [ ] `components/ui/FacebookFeed.tsx` no longer exists on disk
- [ ] No source file (outside tests and docs) references `FacebookFeed`
- [ ] `__tests__/integration/no-facebook-feed.test.ts` exists and passes
- [ ] `__tests__/integration/social-feed.test.tsx` exists and passes
- [ ] `npm test` passes with zero failures
- [ ] `npm run build` completes without errors
- [ ] News page renders SocialFeedSection with correct feedId
- [ ] Homepage renders SocialFeedSection with correct feedId
- [ ] Footer contains links to Facebook, Instagram, and YouTube
- [ ] SocialFollowBanner appears on the News page
