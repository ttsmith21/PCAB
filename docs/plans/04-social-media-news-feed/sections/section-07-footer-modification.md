# Section 07: Footer Modification

## Overview

This section modifies `components/layout/Footer.tsx` to use the centralized `SOCIAL_URLS` constant for social media links and adds proper `aria-label` attributes for accessibility. It also updates the existing Footer test file with new test cases.

**Dependencies**: Section 01 (Constants & Dependencies) must be completed first. It provides the `SOCIAL_URLS` constant in `lib/constants.ts`.

---

## Current State of the Footer

The file `components/layout/Footer.tsx` already contains a "Connect" column with social media links to Facebook, Instagram, X/Twitter, and YouTube. These currently use individual properties from `SITE_CONFIG`:

- `SITE_CONFIG.facebookPageUrl` for Facebook
- `SITE_CONFIG.instagramUrl` for Instagram
- `SITE_CONFIG.xUrl` for X/Twitter
- `SITE_CONFIG.youtubeUrl` for YouTube

All social links already have `target="_blank"` and `rel="noopener noreferrer"`. They use `lucide-react` icons (`Facebook`, `Instagram`, `Twitter`, `Youtube`) with `h-5 w-5` sizing. Links are styled with `text-gray-400` and `hover:text-white transition-colors`.

---

## Changes Required

### 1. Import `SOCIAL_URLS` from constants

Update the import from `@/lib/constants` to include `SOCIAL_URLS`:

```tsx
import { SITE_CONFIG, PAYMENT_URLS, COMMUNITY_URLS, SOCIAL_URLS } from "@/lib/constants";
```

### 2. Replace individual SITE_CONFIG URLs with SOCIAL_URLS

- Change `href={SITE_CONFIG.facebookPageUrl}` to `href={SOCIAL_URLS.facebook}`
- Change `href={SITE_CONFIG.instagramUrl}` to `href={SOCIAL_URLS.instagram}`
- Change `href={SITE_CONFIG.youtubeUrl}` to `href={SOCIAL_URLS.youtube}`

The X/Twitter link stays as `SITE_CONFIG.xUrl` (not part of `SOCIAL_URLS`).

### 3. Add aria-label attributes

- Facebook: `aria-label="Follow us on Facebook"`
- Instagram: `aria-label="Follow us on Instagram"`
- X/Twitter: `aria-label="Follow us on X"`
- YouTube: `aria-label="Follow us on YouTube"`
- Community Group: `aria-label="Join our Facebook community group"`

### 4. No layout or styling changes

Existing structure, icons, spacing, and hover effects remain unchanged.

---

## Tests

**Test file**: `__tests__/components/layout/Footer.test.tsx` (existing file, add tests)

### New Tests to Add

```tsx
import { SOCIAL_URLS } from "@/lib/constants";

it("renders Facebook link with correct URL from SOCIAL_URLS", () => {
  // Find link with aria-label /follow us on facebook/i
  // Assert href equals SOCIAL_URLS.facebook
});

it("renders Instagram link with correct URL from SOCIAL_URLS", () => {
  // Find link with name /instagram/i
  // Assert href equals SOCIAL_URLS.instagram
});

it("renders YouTube link with correct URL from SOCIAL_URLS", () => {
  // Find link with name /youtube/i
  // Assert href equals SOCIAL_URLS.youtube
});

it("social links have target='_blank' and rel='noopener noreferrer'", () => {
  // Find Facebook, Instagram, YouTube links
  // Assert each has target="_blank" and rel="noopener noreferrer"
});

it("social links have accessible aria-label attributes", () => {
  // Query for links with aria-labels:
  // "Follow us on Facebook", "Follow us on Instagram", "Follow us on YouTube"
  // Assert each exists
});
```

### Mocking Notes

Existing mocks for `next/link` and `next/image` remain. No additional mocks needed. Use real `SOCIAL_URLS` values.

---

## Implementation Checklist

1. Write new test cases in `__tests__/components/layout/Footer.test.tsx`
2. Run `npm test` -- new tests should fail
3. Update `components/layout/Footer.tsx`:
   - Add `SOCIAL_URLS` to import
   - Replace `SITE_CONFIG.facebookPageUrl` with `SOCIAL_URLS.facebook`
   - Replace `SITE_CONFIG.instagramUrl` with `SOCIAL_URLS.instagram`
   - Replace `SITE_CONFIG.youtubeUrl` with `SOCIAL_URLS.youtube`
   - Add `aria-label` attributes to all social links
4. Run `npm test` -- all tests pass
5. Visual verify Footer renders correctly

## File Summary

| File | Action |
|------|--------|
| `components/layout/Footer.tsx` | **Modify** -- update imports, URLs, add aria-labels |
| `__tests__/components/layout/Footer.test.tsx` | **Modify** -- add 5 new tests |
