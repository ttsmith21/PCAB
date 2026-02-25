# Section 02: CuratorFeed Component

## Overview

This section creates `components/ui/CuratorFeed.tsx`, a thin client component that wraps the Curator.io social media feed embed. The component renders a container `div` with the `data-crt-feed-id` attribute and loads the Curator.io published script via `next/script` with `strategy="lazyOnload"`. This is a low-level building block -- pages do not use this component directly; instead they use `SocialFeedSection` (section-03) which handles viewport detection and fallback rendering.

## Dependencies

- **section-01-constants-and-dependencies**: Must be completed first. Provides the `CURATOR_CONFIG` constant with the `feedId` value, and installs `react-intersection-observer` (not used in this component, but part of the broader setup).
- **next/script**: Built into Next.js, no installation needed.

## Background: Curator.io Published Script Approach

Curator.io offers two integration methods:

1. **Published script** (used here): A single JS file per feed at `https://cdn.curator.io/published/{feedId}.js` with all configuration baked in by the Curator.io dashboard. Simpler and less error-prone.
2. **Generic CDN** (`curator.embed.js` + manual `new Curator.Widgets.Waterfall(...)`): More control but requires managing `onReady` lifecycle and global `window.Curator`. Not needed for this project.

The component renders a `div` with `data-crt-feed-id={feedId}` which Curator.io uses as the injection point for the waterfall feed UI.

## Tests First

**Test file**: `__tests__/components/ui/CuratorFeed.test.tsx`

Write these tests before implementing the component. The testing pattern follows the existing `StripeBuyButton` test file exactly (same `next/script` mock approach).

```tsx
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import CuratorFeed from "@/components/ui/CuratorFeed";

// Mock next/script -- same pattern used in StripeBuyButton.test.tsx.
// Renders a plain <script> tag so we can assert src, strategy, and id.
vi.mock("next/script", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    return (
      <script
        data-testid="curator-script"
        src={props.src as string}
        data-strategy={props.strategy as string}
        id={props.id as string}
      />
    );
  },
}));

describe("CuratorFeed", () => {
  it("renders a container div with data-crt-feed-id matching the feedId prop", () => {
    // Verify the Curator.io injection point div is present with the correct attribute
  });

  it("renders a Script element with src pointing to the published feed URL", () => {
    // Verify src is https://cdn.curator.io/published/{feedId}.js
  });

  it("sets the Script strategy to lazyOnload", () => {
    // Verify the strategy data attribute equals "lazyOnload"
  });

  it("sets a unique Script id containing the feedId", () => {
    // Verify the id attribute contains the feedId to prevent duplicate script loading
  });

  it("applies optional className to the container div", () => {
    // Render with className="mt-4 w-full" and verify it appears on the container
  });

  it("renders the container div without className when the prop is omitted", () => {
    // Render without className and verify the container has no class attribute (or empty)
  });
});
```

### Mock Details

The `next/script` mock follows the exact same pattern already established in `__tests__/components/ui/StripeBuyButton.test.tsx`. The mock renders a plain `<script>` element with the relevant props mapped to inspectable attributes. Key additions over the StripeBuyButton mock:

- `data-strategy` attribute to verify the `strategy` prop
- `id` attribute to verify the script deduplication ID

### Test Notes

- Use `data-testid="curator-script"` on the mock script element for easy querying via `getByTestId`.
- For the container div, query by the `data-crt-feed-id` attribute using `container.querySelector('[data-crt-feed-id]')`.
- A test feedId value like `"abc123"` is sufficient for all tests.

## Implementation

**File to create**: `components/ui/CuratorFeed.tsx`

### Interface

```tsx
interface CuratorFeedProps {
  feedId: string;
  className?: string;
}
```

### Behavior

1. Mark the file with `"use client"` directive at the top (the component uses `next/script` which requires client-side execution).
2. Import `Script` from `next/script`.
3. Return a fragment or wrapper containing:
   - A `div` element with `data-crt-feed-id={feedId}` attribute. This is the DOM node that the Curator.io script targets for injecting feed content. Apply the optional `className` prop to this div.
   - A `Script` element with:
     - `src` set to `` `https://cdn.curator.io/published/${feedId}.js` ``
     - `strategy` set to `"lazyOnload"` -- this defers loading until browser idle time, protecting LCP and FCP metrics
     - `id` set to `` `curator-${feedId}` `` -- prevents duplicate script tags if the component is rendered more than once

### Design Notes

- This component is intentionally minimal. It does NOT handle viewport detection, fallback content, or error states. Those responsibilities belong to `SocialFeedSection` (section-03).
- The component is similar in structure to the existing `StripeBuyButton.tsx` -- both are client components that wrap an external script via `next/script` and provide a DOM mounting point.
- The `feedId` is a public value (visible in the Curator.io embed URL), so there is no security concern with including it in client-side code.
- During development before the Curator.io account is created, using a placeholder feedId like `"placeholder"` is fine -- the script will 404 and the container div will remain empty. The parent `SocialFeedSection` component handles displaying useful fallback content in this scenario.

### Reference Pattern

The implementation mirrors `components/ui/StripeBuyButton.tsx`, which follows the same pattern of wrapping an external script with `next/script`. The CuratorFeed component uses `strategy="lazyOnload"` instead of StripeBuyButton's `strategy="afterInteractive"` because the feed is typically below the fold and does not need to load as eagerly.

## File Summary

| Action | File Path |
|--------|-----------|
| **Create** | `components/ui/CuratorFeed.tsx` |
| **Create** | `__tests__/components/ui/CuratorFeed.test.tsx` |

## Verification

After implementing, run:

```bash
npm test -- --run __tests__/components/ui/CuratorFeed.test.tsx
```

All six tests should pass. The component is ready for consumption by `SocialFeedSection` (section-03).
