# Section 08: Table of Contents

## Overview

This section builds the `TableOfContents` client component and integrates it into the article pages created in Section 06. The component provides:

- A sticky sidebar on desktop with heading anchor links
- A collapsible accordion on mobile
- Active heading tracking via Intersection Observer as the user scrolls
- Threshold-based rendering: only appears when an article has more than 5 headings

**Dependencies:** Section 06 (article pages must exist to integrate the TOC).

**Blocks:** Section 12 (polish/validation).

---

## Files to Create

| File | Description |
|------|-------------|
| `components/knowledge/TableOfContents.tsx` | Client component for article TOC |
| `__tests__/components/knowledge/TableOfContents.test.tsx` | TableOfContents tests |

## Files to Modify

| File | Description |
|------|-------------|
| `app/knowledge/[category]/[slug]/page.tsx` | Integrate TOC component (may already have stub/placeholder from Section 06) |

---

## Tests

Write tests first in `__tests__/components/knowledge/TableOfContents.test.tsx`.

**Test file:** `__tests__/components/knowledge/TableOfContents.test.tsx`

The tests use the existing project conventions: Vitest v4, jsdom, @testing-library/react, @testing-library/jest-dom. The setup file at `__tests__/setup.ts` provides `@testing-library/jest-dom/vitest` matchers globally.

### Mocking Strategy

- Mock `next/link` as a pass-through anchor element (standard project pattern)
- The component is a client component (`"use client"`) so it renders directly in jsdom
- Mock `IntersectionObserver` since jsdom does not provide it -- create a minimal stub that captures the callback for testing active heading behavior

### Test Stubs

```
# Test: renders list of heading links from headings prop
# Test: does not render when heading count <= 5
# Test: renders when heading count > 5
# Test: heading links have correct href (anchor to heading id)
# Test: heading levels are visually distinguished (h2 vs h3 indentation)
# Test: mobile view renders as collapsible accordion
# Test: desktop view renders as sticky sidebar
```

**Test file skeleton:**

```typescript
// __tests__/components/knowledge/TableOfContents.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TableOfContents from "@/components/knowledge/TableOfContents";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock IntersectionObserver -- jsdom does not provide it
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", vi.fn((callback) => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: vi.fn(),
  })));
});

// Heading fixtures
const fewHeadings = [
  { text: "Heading One", level: 2, id: "heading-one" },
  { text: "Heading Two", level: 2, id: "heading-two" },
  { text: "Heading Three", level: 3, id: "heading-three" },
];

const manyHeadings = [
  { text: "Introduction", level: 2, id: "introduction" },
  { text: "Background", level: 2, id: "background" },
  { text: "Details", level: 3, id: "details" },
  { text: "Methods", level: 2, id: "methods" },
  { text: "Results", level: 2, id: "results" },
  { text: "Discussion", level: 2, id: "discussion" },
];

describe("TableOfContents", () => {
  it("does not render when heading count <= 5", () => {
    /** Render with fewHeadings (3 items), assert nothing renders */
  });

  it("renders when heading count > 5", () => {
    /** Render with manyHeadings (6 items), assert heading links appear */
  });

  it("renders list of heading links from headings prop", () => {
    /** Render with manyHeadings, assert each heading text is in the document */
  });

  it("heading links have correct href (anchor to heading id)", () => {
    /** Each link should have href="#heading-id" */
  });

  it("heading levels are visually distinguished (h2 vs h3 indentation)", () => {
    /** h3 items should have a left padding/margin class that h2 items do not */
  });

  it("mobile view renders as collapsible accordion", () => {
    /** When mobile prop is true, render a collapsible/expandable wrapper.
     *  Assert a toggle button exists. Click it and verify content toggles. */
  });

  it("desktop view renders as sticky sidebar", () => {
    /** When mobile prop is falsy (default), the wrapper should have sticky positioning class */
  });
});
```

---

## Implementation

### Heading Type

The component receives headings as props. The `Heading` type is defined in Section 02 (`lib/knowledge.ts`) and looks like:

```typescript
interface Heading {
  text: string;
  level: number; // 2 for ##, 3 for ###
  id: string;    // slugified heading text, matches rehype-slug output
}
```

### TableOfContents Component (`components/knowledge/TableOfContents.tsx`)

This is a **Client Component** (needs `"use client"` directive) because it uses:
- `useState` for mobile accordion open/close state
- `useEffect` for Intersection Observer setup
- `useRef` for tracking the active heading

**Props interface:**

```typescript
interface TableOfContentsProps {
  headings: Heading[];
  mobile?: boolean; // if true, render as collapsible accordion
}
```

**Threshold gate:** If `headings.length <= 5`, return `null`. This is enforced both in the component itself and in the article page (belt and suspenders). The article page conditionally renders the component only when `headings.length > 5`, but the component also guards internally.

**Desktop mode (default, `mobile` is falsy):**

- Render a `nav` element with `sticky top-24` positioning (clears the fixed navbar) and `max-h-[calc(100vh-8rem)] overflow-y-auto`
- Title: "On This Page" styled with `font-oswald uppercase text-sm tracking-wider text-pc-gray-dark mb-4`
- Ordered list of heading links
- Each link: `<a href={`#${heading.id}`}>` with the heading text
- h2 headings: no indentation, `font-medium` text
- h3 headings: `pl-4` (left padding for visual nesting)
- Active heading gets `text-pc-red font-semibold` styling; inactive headings get `text-gray-500 hover:text-gray-800`
- Smooth scroll: add `scroll-behavior: smooth` or use `scrollIntoView({ behavior: 'smooth' })` on click

**Mobile mode (`mobile` prop is true):**

- Render a collapsible accordion panel
- Toggle button: "Table of Contents" with a chevron icon (rotates on open)
- Collapsed by default (`useState(false)`)
- When expanded, show the same heading link list as desktop (without sticky positioning)
- Wrap in a container with `border rounded-lg p-4 bg-gray-50`

**Active heading tracking with Intersection Observer:**

```typescript
// Inside useEffect:
// 1. Query all heading elements on the page that match the heading ids
// 2. Create an IntersectionObserver with rootMargin: "0px 0px -80% 0px"
//    (triggers when heading enters top 20% of viewport)
// 3. In the callback, find the intersecting entry and update activeId state
// 4. Observe all heading elements
// 5. Return cleanup function that calls observer.disconnect()
```

The `rootMargin: "0px 0px -80% 0px"` setting means a heading is considered "active" when it crosses into the top 20% of the viewport. This provides a natural reading experience where the TOC highlights the heading you are currently reading, not the one that just scrolled past.

**State management:**

```typescript
const [activeId, setActiveId] = useState<string>("");
const [isOpen, setIsOpen] = useState(false); // mobile only
```

### Integration into Article Page

Section 06 builds the article page at `app/knowledge/[category]/[slug]/page.tsx`. That section already includes the TOC integration points with the following structure:

```tsx
{/* Sidebar TOC (desktop) */}
{headings.length > 5 && (
  <aside className="hidden lg:block">
    <TableOfContents headings={headings} />
  </aside>
)}

{/* Mobile TOC */}
{headings.length > 5 && (
  <div className="lg:hidden mb-8">
    <TableOfContents headings={headings} mobile />
  </div>
)}
```

If Section 06 has already been implemented with a stub or placeholder for `TableOfContents`, replace the stub import with the real component. If Section 06 left the import commented out or deferred, add:

```typescript
import TableOfContents from "@/components/knowledge/TableOfContents";
```

The `headings` data is already computed in the article page via `extractHeadings(article.content)` from `lib/knowledge.ts` (Section 02). No additional data fetching is needed.

**Key layout detail:** The article page uses a two-column grid on desktop: `lg:grid lg:grid-cols-[1fr_280px] lg:gap-12`. The desktop TOC sits in the 280px right column within an `<aside>`. The mobile TOC sits above the main content in a `lg:hidden` div. This means the TOC appears in two locations in the DOM but only one is visible at any viewport size.

### Styling Details

The component should follow the existing project design system:

- **Font:** Oswald for the "On This Page" heading, Inter for the heading links (body text)
- **Colors:** `text-pc-red` for active heading, `text-gray-500` for inactive, `text-pc-gray-dark` for the section title
- **Transitions:** `transition-colors duration-200` on heading links for smooth hover/active state changes
- **Mobile accordion:** `transition-all duration-300` on the collapsible content panel for smooth expand/collapse
- **Chevron rotation:** `transform transition-transform duration-200` with `rotate-180` when open

### Accessibility

- The `nav` element should have `aria-label="Table of contents"`
- The mobile toggle button should have `aria-expanded` attribute reflecting the open state
- The collapsible content should use `aria-hidden` when collapsed
- Heading links should be keyboard-focusable (default for `<a>` elements)

---

## Verification

After implementing:

1. Run `npx vitest run __tests__/components/knowledge/TableOfContents.test.tsx` to verify all tests pass
2. Run `npx vitest run` to verify no regressions in the full test suite
3. Manually verify with a sample article that has 6+ headings (the `sample-coaching-tips.mdx` from Section 03 is designed for this):
   - Desktop: TOC appears as a sticky sidebar on the right, heading links highlight as you scroll
   - Mobile: TOC appears as a collapsed accordion above the article, expands on tap
4. Verify with an article with fewer than 6 headings that the TOC does not render at all
