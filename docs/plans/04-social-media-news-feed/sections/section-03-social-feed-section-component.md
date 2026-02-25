# Section 03: SocialFeedSection Component

## Overview

This section creates `components/ui/SocialFeedSection.tsx`, a client component that orchestrates viewport-triggered loading of the Curator.io social feed. It uses `react-intersection-observer` to detect when the section scrolls near the viewport, then dynamically imports the `CuratorFeed` component (from section-02) with SSR disabled. Before the feed loads (or if it fails to load), a meaningful fallback is displayed with direct links to the boosters' Facebook, Instagram, and YouTube profiles.

**File to create:** `components/ui/SocialFeedSection.tsx`

**Test file to create:** `__tests__/components/ui/SocialFeedSection.test.tsx`

## Dependencies on Other Sections

- **section-01-constants-and-dependencies**: Provides `SOCIAL_URLS` constant (with `facebook`, `instagram`, `youtube` keys) in `lib/constants.ts`, and the `react-intersection-observer` npm package must be installed.
- **section-02-curator-feed-component**: Provides `components/ui/CuratorFeed.tsx`, the client component that renders the Curator.io embed `div` and loads its script via `next/script`.

## Background Context

### Architecture Rationale

The Curator.io widget injects HTML/CSS/JS directly into the DOM and cannot run during server-side rendering. The architecture uses three layers of protection for performance:

1. **Viewport-triggered loading** via `react-intersection-observer` with `useInView({ triggerOnce: true, rootMargin: '200px 0px' })`. The feed is typically below the fold on both the homepage and News page, so loading its ~1MB script is deferred until the user scrolls near it.
2. **`next/dynamic` with `{ ssr: false }`** ensures the CuratorFeed component is never rendered server-side.
3. **`lazyOnload` strategy** on the `next/script` inside CuratorFeed defers the external script until browser idle time.

### Fallback Strategy

Instead of a skeleton/shimmer loading state, the fallback shows direct links to the social profiles. This serves double duty:
- It is the **loading state** while the feed is being imported and the Curator.io script is loading.
- It is the **error state** if Curator.io fails to load (network error, free tier 2K view limit exceeded, placeholder feedId during development).

The user always sees useful content in this section.

### Interface

```tsx
interface SocialFeedSectionProps {
  feedId: string;
  className?: string;
}
```

### Existing Project Patterns

The project uses the following conventions (observed from existing components):
- **Vitest** with `@testing-library/react` for testing, `jsdom` environment
- **Global test setup** in `__tests__/setup.ts` (imports `@testing-library/jest-dom/vitest`)
- **`next/script` mock pattern**: render a simple `<script>` tag that exposes props
- **`next/link` mock pattern**: render a simple `<a>` tag
- **Icons from `lucide-react`** are already used extensively in the Footer and elsewhere
- **`SOCIAL_URLS`** will contain `facebook`, `instagram`, `youtube` keys with `https://` URL values (provided by section-01)

---

## Tests (Write First)

Create the test file at `__tests__/components/ui/SocialFeedSection.test.tsx`.

The tests mock `react-intersection-observer` to control the `inView` state, and mock `next/dynamic` to avoid actually loading `CuratorFeed`. The `SOCIAL_URLS` constant is imported directly from `lib/constants`.

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// --- Mocks ---

// Mock react-intersection-observer. The mockInView variable controls
// whether the component believes it is in the viewport.
let mockInView = false;
vi.mock("react-intersection-observer", () => ({
  useInView: () => ({
    ref: vi.fn(),
    inView: mockInView,
  }),
}));

// Mock next/dynamic to return a simple stand-in component that renders
// a data attribute so tests can detect when CuratorFeed would appear.
vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => {
    const MockCuratorFeed = (props: Record<string, unknown>) => (
      <div data-testid="curator-feed" data-feed-id={props.feedId as string} />
    );
    MockCuratorFeed.displayName = "MockCuratorFeed";
    return MockCuratorFeed;
  },
}));

import SocialFeedSection from "@/components/ui/SocialFeedSection";
import { SOCIAL_URLS } from "@/lib/constants";

describe("SocialFeedSection", () => {
  beforeEach(() => {
    mockInView = false;
  });

  it("renders fallback social links when not in viewport (initial state)", () => {
    mockInView = false;
    render(<SocialFeedSection feedId="test-feed-123" />);
    expect(screen.getByText(/follow us on social media/i)).toBeInTheDocument();
  });

  it("fallback contains links to Facebook, Instagram, and YouTube profiles", () => {
    mockInView = false;
    render(<SocialFeedSection feedId="test-feed-123" />);
    const facebookLink = screen.getByRole("link", { name: /facebook/i });
    const instagramLink = screen.getByRole("link", { name: /instagram/i });
    const youtubeLink = screen.getByRole("link", { name: /youtube/i });
    expect(facebookLink).toBeInTheDocument();
    expect(instagramLink).toBeInTheDocument();
    expect(youtubeLink).toBeInTheDocument();
  });

  it("fallback links use URLs from SOCIAL_URLS constants", () => {
    mockInView = false;
    render(<SocialFeedSection feedId="test-feed-123" />);
    const facebookLink = screen.getByRole("link", { name: /facebook/i });
    const instagramLink = screen.getByRole("link", { name: /instagram/i });
    const youtubeLink = screen.getByRole("link", { name: /youtube/i });
    expect(facebookLink).toHaveAttribute("href", SOCIAL_URLS.facebook);
    expect(instagramLink).toHaveAttribute("href", SOCIAL_URLS.instagram);
    expect(youtubeLink).toHaveAttribute("href", SOCIAL_URLS.youtube);
  });

  it("all fallback links have target=_blank and rel=noopener noreferrer", () => {
    mockInView = false;
    render(<SocialFeedSection feedId="test-feed-123" />);
    const links = [
      screen.getByRole("link", { name: /facebook/i }),
      screen.getByRole("link", { name: /instagram/i }),
      screen.getByRole("link", { name: /youtube/i }),
    ];
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("all fallback links have descriptive aria-label attributes", () => {
    mockInView = false;
    render(<SocialFeedSection feedId="test-feed-123" />);
    const facebookLink = screen.getByRole("link", { name: /follow us on facebook/i });
    const instagramLink = screen.getByRole("link", { name: /follow us on instagram/i });
    const youtubeLink = screen.getByRole("link", { name: /follow us on youtube/i });
    expect(facebookLink).toBeInTheDocument();
    expect(instagramLink).toBeInTheDocument();
    expect(youtubeLink).toBeInTheDocument();
  });

  it("when in viewport, renders the CuratorFeed component", () => {
    mockInView = true;
    render(<SocialFeedSection feedId="test-feed-123" />);
    const curatorFeed = screen.getByTestId("curator-feed");
    expect(curatorFeed).toBeInTheDocument();
    expect(curatorFeed).toHaveAttribute("data-feed-id", "test-feed-123");
  });

  it("applies optional className to root element", () => {
    mockInView = false;
    const { container } = render(
      <SocialFeedSection feedId="test-feed-123" className="my-custom-class" />
    );
    expect(container.firstElementChild?.className).toContain("my-custom-class");
  });
});
```

### Mocking Notes

- **`react-intersection-observer`**: Mocked at module level. A `let mockInView` variable is toggled per-test.
- **`next/dynamic`**: Mocked to return a simple component that renders `<div data-testid="curator-feed" />`.
- **`SOCIAL_URLS`**: Imported directly from `@/lib/constants` (section-01 must be complete).

---

## Implementation Details

### Component Structure

1. Imports `useInView` from `react-intersection-observer`.
2. Imports `dynamic` from `next/dynamic`.
3. Imports `SOCIAL_URLS` from `@/lib/constants`.
4. Imports `Facebook`, `Instagram`, `Youtube` icons from `lucide-react`.
5. Defines a `SocialFallbackLinks` inline component for the fallback content.
6. Uses `next/dynamic` to create a lazy-loaded `CuratorFeed` with `{ ssr: false, loading: () => <SocialFallbackLinks /> }`.
7. Calls `useInView({ triggerOnce: true, rootMargin: '200px 0px' })`.
8. Conditionally renders: if `inView`, render CuratorFeedDynamic; otherwise, render SocialFallbackLinks.

### Component Signature

```tsx
"use client";

import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { SOCIAL_URLS } from "@/lib/constants";

interface SocialFeedSectionProps {
  feedId: string;
  className?: string;
}
```

### Key Implementation Points

**Dynamic import at module scope:**

```tsx
const CuratorFeedDynamic = dynamic(
  () => import("@/components/ui/CuratorFeed"),
  {
    ssr: false,
    loading: () => <SocialFallbackLinks />,
  }
);
```

**Fallback component:**

- Centered text: "Follow us on social media for the latest updates"
- Three icon links in horizontal row (flex, gap, centered)
- Each link: `target="_blank"`, `rel="noopener noreferrer"`, `aria-label`
- Styled with `text-pc-red` or similar brand colors

**Social links data:**

```tsx
const socialLinks = [
  { label: "Facebook", href: SOCIAL_URLS.facebook, icon: Facebook, ariaLabel: "Follow us on Facebook" },
  { label: "Instagram", href: SOCIAL_URLS.instagram, icon: Instagram, ariaLabel: "Follow us on Instagram" },
  { label: "YouTube", href: SOCIAL_URLS.youtube, icon: Youtube, ariaLabel: "Follow us on YouTube" },
];
```

**Container sizing:**

Root `div` includes `min-h-[400px]` to prevent CLS. Combines with optional `className` prop.

**Conditional rendering:**

```tsx
const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px 0px" });

return (
  <div ref={ref} className={`min-h-[400px] ${className ?? ""}`}>
    {inView ? <CuratorFeedDynamic feedId={feedId} /> : <SocialFallbackLinks />}
  </div>
);
```

### Styling Notes

- Fallback centered with `flex items-center justify-center`
- Icons sized `h-6 w-6` or `h-8 w-8`
- Hover effects: `hover:text-pc-red` or `hover:opacity-80`

---

## File Summary

| Action | File Path |
|--------|-----------|
| **Create** | `components/ui/SocialFeedSection.tsx` |
| **Create** | `__tests__/components/ui/SocialFeedSection.test.tsx` |

## Verification

Run `npm test` -- all 7 tests should pass.
