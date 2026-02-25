# Section 06: Homepage Modification

## Overview

This section covers a surgical replacement on the homepage (`app/page.tsx`): swapping the existing `FacebookFeed` component in the "Live From the Field" section with the new `SocialFeedSection` component. The section structure, heading, and surrounding layout remain intact. Only the feed component and its subtitle text change.

### Dependencies

- **section-01-constants-and-dependencies**: `CURATOR_CONFIG` must exist in `lib/constants.ts`
- **section-03-social-feed-section-component**: `SocialFeedSection` component must exist at `components/ui/SocialFeedSection.tsx`

### Files Modified

- `app/page.tsx` -- Replace `FacebookFeed` import/usage with `SocialFeedSection`

### Files Created

- `__tests__/app/page.test.tsx` -- New test file for the homepage (none exists currently)

---

## Tests First

**Test file**: `__tests__/app/page.test.tsx`

Mock all child components as simple stubs and verify the homepage renders the correct set of components with the correct props.

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/components/home/Hero", () => ({
  default: () => <div data-testid="hero">Hero</div>,
}));
vi.mock("@/components/home/ImpactStats", () => ({
  default: () => <div data-testid="impact-stats">ImpactStats</div>,
}));
vi.mock("@/components/home/ActionCards", () => ({
  default: () => <div data-testid="action-cards">ActionCards</div>,
}));
vi.mock("@/components/home/InitiativePreview", () => ({
  default: () => <div data-testid="initiative-preview">InitiativePreview</div>,
}));
vi.mock("@/components/home/SponsorShowcase", () => ({
  default: () => <div data-testid="sponsor-showcase">SponsorShowcase</div>,
}));
vi.mock("@/components/ui/FadeIn", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/components/ui/SectionHeading", () => ({
  default: ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div data-testid="section-heading"><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
  ),
}));
vi.mock("@/components/ui/Button", () => ({
  default: ({ children, href }: { children: React.ReactNode; href?: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("@/components/ui/SocialFeedSection", () => ({
  default: ({ feedId, className }: { feedId: string; className?: string }) => (
    <div data-testid="social-feed-section" data-feed-id={feedId} className={className}>SocialFeedSection</div>
  ),
}));

import Home from "@/app/page";
import { CURATOR_CONFIG } from "@/lib/constants";

describe("Homepage", () => {
  it("renders SocialFeedSection in the Live From the Field section", () => {
    render(<Home />);
    expect(screen.getByTestId("social-feed-section")).toBeInTheDocument();
  });

  it("does NOT render FacebookFeed component", () => {
    const { container } = render(<Home />);
    expect(container.querySelector('iframe[title="Facebook Feed"]')).toBeNull();
  });

  it("SocialFeedSection receives correct feedId from CURATOR_CONFIG", () => {
    render(<Home />);
    const feed = screen.getByTestId("social-feed-section");
    expect(feed).toHaveAttribute("data-feed-id", CURATOR_CONFIG.feedId);
  });

  it("all other homepage sections remain present", () => {
    render(<Home />);
    expect(screen.getByTestId("hero")).toBeInTheDocument();
    expect(screen.getByTestId("impact-stats")).toBeInTheDocument();
    expect(screen.getByTestId("action-cards")).toBeInTheDocument();
    expect(screen.getByTestId("initiative-preview")).toBeInTheDocument();
    expect(screen.getByTestId("sponsor-showcase")).toBeInTheDocument();
    expect(screen.getByText("Stay Connected")).toBeInTheDocument();
    expect(screen.getByText("Live From the Field")).toBeInTheDocument();
  });
});
```

---

## Implementation Details

### Current State

The homepage imports `FacebookFeed` and renders it in the "Live From the Field" section with `width={500}` and `height={600}`.

### Changes Required (3 changes)

**1. Update imports**

Remove: `import FacebookFeed from "@/components/ui/FacebookFeed";`

Add:
```tsx
import SocialFeedSection from "@/components/ui/SocialFeedSection";
import { CURATOR_CONFIG } from "@/lib/constants";
```

**2. Replace the component**

Replace `<FacebookFeed width={500} height={600} />` with `<SocialFeedSection feedId={CURATOR_CONFIG.feedId} />`

**3. Update subtitle text**

Change from "Follow us on Facebook for the latest updates, photos, and game results." to "Follow us on Facebook, Instagram, and YouTube for the latest updates, photos, and game results."

### What Stays the Same

Everything else: Hero, ImpactStats, ActionCards, InitiativePreview, "Stay Connected" CTA, SponsorShowcase, and the "Live From the Field" section wrapper.

### Edge Cases

- `SocialFeedSection` handles its own loading/error states
- No layout shift concerns -- `SocialFeedSection` manages its own `min-height`
- Server component compatibility -- homepage is server, SocialFeedSection is client, Next.js handles the boundary

## Verification

1. All 4 tests pass
2. Full test suite passes (`npm test`)
3. Visual: homepage "Live From the Field" shows feed fallback links
4. `FacebookFeed` no longer imported on homepage
