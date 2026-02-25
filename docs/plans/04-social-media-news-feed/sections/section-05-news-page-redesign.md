# Section 5: News Page Redesign

## Overview

This section modifies `app/news/page.tsx` to replace the legacy `FacebookFeed` component with the new `SocialFeedSection` component, remove the hardcoded "Upcoming Events" section, add the `SocialFollowBanner` component, and update the hero copy. After these changes, the News page becomes a dynamic social content hub.

## Dependencies

- **Section 01 (Constants & Dependencies)**: `SOCIAL_URLS` and `CURATOR_CONFIG` must exist in `lib/constants.ts`
- **Section 03 (SocialFeedSection Component)**: `components/ui/SocialFeedSection.tsx` must be built
- **Section 04 (SocialFollowBanner Component)**: `components/ui/SocialFollowBanner.tsx` must be built

## Files to Modify

| File | Action |
|------|--------|
| `app/news/page.tsx` | **Modify** -- replace content, remove events, add new components |
| `__tests__/app/news/page.test.tsx` | **Create** -- new test file (none exists currently) |

## Tests First

**Test file**: `__tests__/app/news/page.test.tsx`

### Mocking Strategy

- `framer-motion` -- replace `motion.div` with plain `div`
- `@/components/ui/SocialFeedSection` -- render `div` with `data-testid="social-feed-section"` and `data-feed-id`
- `@/components/ui/SocialFollowBanner` -- render `div` with `data-testid="social-follow-banner"`
- `@/components/ui/SectionHeading` -- render title/subtitle for heading queries
- `@/components/ui/FadeIn` -- render children directly

Do NOT mock `FacebookFeed` -- it should no longer be imported.

### Test Cases

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock("@/components/ui/SocialFeedSection", () => ({
  default: ({ feedId, className }: any) => (
    <div data-testid="social-feed-section" data-feed-id={feedId} className={className} />
  ),
}));

vi.mock("@/components/ui/SocialFollowBanner", () => ({
  default: () => <div data-testid="social-follow-banner" />,
}));

vi.mock("@/components/ui/FadeIn", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

import NewsPage from "@/app/news/page";
import { CURATOR_CONFIG } from "@/lib/constants";

describe("NewsPage", () => {
  it("renders SocialFeedSection component", () => {
    // Verify SocialFeedSection mock is present
  });

  it("passes correct feedId to SocialFeedSection", () => {
    // Verify data-feed-id matches CURATOR_CONFIG.feedId
  });

  it("renders SocialFollowBanner component", () => {
    // Verify SocialFollowBanner mock is present
  });

  it("renders hero section with page heading", () => {
    // Verify h1 heading is rendered
  });

  it("does not render FacebookFeed component", () => {
    // Verify no iframe with Facebook plugin src or title="Facebook Feed"
  });

  it("does not render Upcoming Events section", () => {
    // Verify "Upcoming Events" text does not appear
    // Verify none of the old event titles appear
  });
});
```

## Current News Page Structure (Before)

1. **Hero section** -- Dark bg, title "News & Events", subtitle
2. **Facebook Feed section** -- `py-20 bg-white`, SectionHeading "Latest Updates", `FacebookFeed` component
3. **Upcoming Events section** -- `py-20 bg-gray-50`, SectionHeading "Upcoming Events", grid of 3 hardcoded event cards

## Implementation Details

### Changes to `app/news/page.tsx`

**1. Update imports**

Remove: `Calendar` from `lucide-react`, `Card` from `@/components/ui/Card`, `FacebookFeed` from `@/components/ui/FacebookFeed`

Add: `SocialFeedSection` from `@/components/ui/SocialFeedSection`, `SocialFollowBanner` from `@/components/ui/SocialFollowBanner`, `CURATOR_CONFIG` from `@/lib/constants`

Keep: `Metadata`, `SectionHeading`, `FadeIn`

**2. Update metadata**

Update page title/description to reflect new content focus (remove "Events" reference if desired).

**3. Remove the `events` array**

Delete the entire hardcoded events array.

**4. Update the Hero section**

Update title (e.g., "Latest Updates" or keep "News & Events") and subtitle to mention aggregated social content.

**5. Replace Facebook Feed section**

Replace `FacebookFeed` with `SocialFeedSection`:

```tsx
<section className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <SectionHeading
      title="Latest Updates"
      subtitle="Follow along with the latest from our Facebook, Instagram, and YouTube channels."
    />
    <FadeIn>
      <SocialFeedSection feedId={CURATOR_CONFIG.feedId} />
    </FadeIn>
  </div>
</section>
```

**6. Remove Upcoming Events section**

Delete the entire third section block.

**7. Add SocialFollowBanner**

Add `<SocialFollowBanner />` after the social feed section.

### Final Page Structure (After)

```
<main>
  1. Hero section (updated title/subtitle)
  2. Social Feed section (SectionHeading + SocialFeedSection)
  3. SocialFollowBanner
</main>
```

### Edge Cases

- Placeholder feedId causes script 404 -- fallback links display instead
- Page remains a server component (exports metadata); client components compose within it

## Verification

1. All tests in `__tests__/app/news/page.test.tsx` pass
2. `npm run build` succeeds
3. Visual check: `/news` shows feed section, banner, no events, no Facebook iframe

## Implementation Notes

- **Deviation from plan**: Changed hero h1 from "Latest Updates" to "News" during code review to avoid duplicate heading text (SectionHeading below also says "Latest Updates").
- **Test addition**: Added "Back-to-School Night" assertion to events removal test for full coverage of all 3 old events.
- SectionHeading mock omitted from tests since the real component is simple and works fine in jsdom.
- All 6 tests pass. Page fully restructured per plan.
