# Section 04: SocialFollowBanner Component

## Overview

This section creates `components/ui/SocialFollowBanner.tsx`, a server component that renders a horizontal banner CTA encouraging visitors to follow PC Boosters on social media. The banner displays a heading, tagline, and social icon links (Facebook, Instagram, YouTube) using `lucide-react`. It is placed on the News page below the feed (section-05) and optionally on the homepage.

Because the component is purely static (links and text, no interactivity), it does **not** need the `"use client"` directive, keeping it out of the client JS bundle entirely.

### Dependencies on Other Sections

- **section-01-constants-and-dependencies**: This component imports `SOCIAL_URLS` from `lib/constants.ts`. That constant must exist before this component can be built.

---

## Tests First

**Test file**: `__tests__/components/ui/SocialFollowBanner.test.tsx`

Write these tests before implementing the component.

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SocialFollowBanner from "@/components/ui/SocialFollowBanner";
import { SOCIAL_URLS } from "@/lib/constants";

describe("SocialFollowBanner", () => {
  it("renders a section element with appropriate heading", () => {
    render(<SocialFollowBanner />);
    const section = screen.getByRole("region");
    expect(section).toBeInTheDocument();
    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
  });

  it("contains 'Follow PC Boosters' heading text (or similar)", () => {
    render(<SocialFollowBanner />);
    expect(screen.getByRole("heading")).toHaveTextContent(/follow.*pc.*boosters/i);
  });

  it("renders links for Facebook, Instagram, and YouTube", () => {
    render(<SocialFollowBanner />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(3);
  });

  it("links use correct URLs from SOCIAL_URLS", () => {
    render(<SocialFollowBanner />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((link) => link.getAttribute("href"));
    expect(hrefs).toContain(SOCIAL_URLS.facebook);
    expect(hrefs).toContain(SOCIAL_URLS.instagram);
    expect(hrefs).toContain(SOCIAL_URLS.youtube);
  });

  it("all links have target='_blank' and rel='noopener noreferrer'", () => {
    render(<SocialFollowBanner />);
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("all links have accessible aria-label attributes", () => {
    render(<SocialFollowBanner />);
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("aria-label");
      expect(link.getAttribute("aria-label")).not.toBe("");
    });
  });

  it("renders social media icons (lucide-react)", () => {
    const { container } = render(<SocialFollowBanner />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(3);
  });
});
```

### Testing Notes

- No mocking needed -- server component with plain HTML, no client interactivity.
- `SOCIAL_URLS` imported directly from `@/lib/constants`.
- `lucide-react` icons render as `<svg>` elements in jsdom.
- The `section` element needs `aria-labelledby` to be found by `getByRole("region")`.

---

## Implementation Details

**File to create**: `components/ui/SocialFollowBanner.tsx`

### Design

- **No `"use client"` directive** -- this is a server component
- Full-width section with `bg-pc-dark` background
- Centered content layout
- Heading using `font-oswald`, uppercase: "Follow PC Boosters"
- Tagline: "Stay connected with game day updates, highlights, and announcements"
- Row of social icon links (Facebook, Instagram, YouTube)

### Styling

- **Brand colors**: `bg-pc-dark` (#111111) background, white text
- **Heading font**: `font-oswald uppercase tracking-wide`
- **Section pattern**: `py-16` vertical padding, container centered
- **Icon sizing**: `h-8 w-8` or `h-10 w-10` for emphasis
- **Hover effects**: `hover:scale-110 transition-transform` or `opacity-80 hover:opacity-100`

### Accessibility

- `<section>` with `aria-labelledby` pointing to heading's `id`
- `<h2>` heading level
- Each link: `aria-label` like "Follow us on Facebook"
- All links: `target="_blank"`, `rel="noopener noreferrer"`

### Social Link Data

```tsx
const socialLinks = [
  { href: SOCIAL_URLS.facebook, icon: Facebook, label: "Follow us on Facebook" },
  { href: SOCIAL_URLS.instagram, icon: Instagram, label: "Follow us on Instagram" },
  { href: SOCIAL_URLS.youtube, icon: Youtube, label: "Follow us on YouTube" },
];
```

## File Summary

| Action | File Path |
|--------|-----------|
| **Create** | `components/ui/SocialFollowBanner.tsx` |
| **Create** | `__tests__/components/ui/SocialFollowBanner.test.tsx` |

## Verification

Run `npm test` -- all 7 tests should pass.
