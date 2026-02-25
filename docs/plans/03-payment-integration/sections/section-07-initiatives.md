# Section 07: Initiatives Page -- Donation Options

## Overview

This section updates `app/initiatives/page.tsx` to replace the single BoosterHub donation CTA with a rich donation section presenting monthly recurring tiers and a one-time flexible donation option, all powered by Stripe Payment Links.

### What Changes

The current initiatives page has a single "Make a Donation" button at the bottom (line 127) linking to `BOOSTERHUB_URLS.donate`. This section replaces that with a donation section showing:

1. **Five monthly recurring donation buttons** at $5, $10, $25, $50, and $100, each linking to its respective Stripe Payment Link
2. **One flexible one-time donation button** linking to `PAYMENT_URLS.donate`

All BoosterHub imports are removed from this file.

### Dependencies

- **section-01-test-setup**: Vitest and React Testing Library must be installed
- **section-02-constants**: `PAYMENT_URLS` must be defined with keys `donate`, `donate_monthly_5`, `donate_monthly_10`, `donate_monthly_25`, `donate_monthly_50`, `donate_monthly_100`

---

## Tests First

Create `__tests__/app/initiatives/page.test.tsx`.

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import InitiativesPage from "@/app/initiatives/page";
import { PAYMENT_URLS } from "@/lib/constants";

vi.mock("@/components/ui/FadeIn", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("InitiativesPage", () => {
  it("renders monthly donation options ($5, $10, $25, $50, $100)", () => {
    /** Verify all five monthly dollar amounts appear on the page. */
  });

  it("renders one-time donation option", () => {
    /** Verify a one-time / flexible donation option is present. */
  });

  it("monthly donation links point to correct PAYMENT_URLS keys", () => {
    /**
     * For each monthly tier, find the link and verify its href:
     * $5 -> PAYMENT_URLS.donate_monthly_5
     * $10 -> PAYMENT_URLS.donate_monthly_10
     * $25 -> PAYMENT_URLS.donate_monthly_25
     * $50 -> PAYMENT_URLS.donate_monthly_50
     * $100 -> PAYMENT_URLS.donate_monthly_100
     */
  });

  it("one-time donation link points to PAYMENT_URLS.donate", () => {
    /** Find the one-time donation link and verify href === PAYMENT_URLS.donate. */
  });

  it("does not contain any BoosterHub URL", () => {
    /** Render the page, check container.innerHTML does not contain "boosterhub". */
  });
});
```

---

## Implementation Details

### File to Modify: `app/initiatives/page.tsx`

#### Import Changes

```tsx
// REMOVE:
import { BOOSTERHUB_URLS } from "@/lib/constants";

// ADD:
import { PAYMENT_URLS } from "@/lib/constants";
```

No new component imports needed. The existing `Button` component with `external` prop is used for Payment Links.

#### Donation Tier Data

Define monthly tiers as a local array:

```tsx
const monthlyTiers = [
  { amount: 5, label: "$5/mo", url: PAYMENT_URLS.donate_monthly_5 },
  { amount: 10, label: "$10/mo", url: PAYMENT_URLS.donate_monthly_10 },
  { amount: 25, label: "$25/mo", url: PAYMENT_URLS.donate_monthly_25 },
  { amount: 50, label: "$50/mo", url: PAYMENT_URLS.donate_monthly_50 },
  { amount: 100, label: "$100/mo", url: PAYMENT_URLS.donate_monthly_100 },
];
```

#### CTA Section Replacement

Replace the existing bottom CTA section (lines 117-132) with a donation section that:

1. Keeps the dark background (`bg-pc-dark text-white`) for visual consistency.
2. Shows a heading like "Support Our Initiatives".
3. Renders the 5 monthly tier buttons in a responsive grid (`grid grid-cols-3 md:grid-cols-5 gap-4`). Use `Button` with `variant="outline"` and `external` prop. Each opens its Stripe Payment Link in a new tab.
4. Below the monthly grid, renders a "or" separator.
5. Renders a "Give Any Amount" one-time donation button linking to `PAYMENT_URLS.donate` with `Button variant="primary" external`.
6. Wraps content in `FadeIn` for animation consistency.

#### Why Payment Links (Not Buy Buttons)

Regular `Button` components linking to Payment Links are used instead of embedded `StripeBuyButton` components. Embedding 5+ Buy Buttons would be visually cluttered and each renders in its own Stripe shadow DOM with fixed styling. Payment Link buttons give full design control.

#### No Other Page Changes

The hero section, featured initiative section, and initiatives grid all remain unchanged. Only the final CTA section is replaced.

---

## Checklist

- [x] Create `__tests__/app/initiatives/page.test.tsx` with 5 test cases
- [x] Run tests -- verify they fail (red phase) -- 5 tests failed
- [x] Update imports: remove `BOOSTERHUB_URLS`, add `PAYMENT_URLS`
- [x] Define monthly donation tier data (inline in map call)
- [x] Replace bottom CTA with donation grid (5 monthly + 1 one-time)
- [x] All buttons use existing `Button` component with `external` prop
- [x] Run tests -- verify all pass (green phase) -- 5 tests passed
- [x] Verify no "boosterhub" string remains in the file

## Implementation Notes

- Monthly tiers defined inline rather than as separate constant (more concise, used once)
- Code review auto-fix: added explicit `variant="primary"` to one-time button
- "or" separator between monthly grid and one-time button
