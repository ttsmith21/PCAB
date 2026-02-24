# Section 06: Membership Page Update

## Overview

This section updates `app/membership/page.tsx` to embed Stripe Buy Buttons for each of the 4 membership tiers, update tier pricing, modernize the bottom CTA, and remove all BoosterHub references. After this section is complete, visitors can purchase memberships directly from the membership page via Stripe's hosted checkout overlay.

## Dependencies

- **section-02-constants** -- provides `PAYMENT_URLS` and removes `BOOSTERHUB_URLS` from `lib/constants.ts`
- **section-03-buy-button** -- provides the `StripeBuyButton` component at `components/ui/StripeBuyButton.tsx`

Key facts from dependencies:
1. `PAYMENT_URLS` is exported from `@/lib/constants` with keys `membership_rookie`, `membership_captain`, `membership_allstar`, `membership_mvp`.
2. `STRIPE_CONFIG` is exported from `@/lib/constants` with a `publishableKey` string.
3. `BOOSTERHUB_URLS` and `BOOSTERHUB_BASE` no longer exist.
4. `StripeBuyButton` is a `"use client"` component accepting `buyButtonId` (required), `publishableKey` (optional), and `className` (optional).

## File to Modify

`app/membership/page.tsx`

## Current State

- Imports `BOOSTERHUB_URLS` from `@/lib/constants`
- Defines 4 tiers with old prices: Rookie $15, Captain $25, All Star $50, MVP $100+
- Each tier card has a `Button` with `href={BOOSTERHUB_URLS.membership}` and `external` prop
- Bottom CTA ("Ready to Join?") has a `Button` linking to `BOOSTERHUB_URLS.membership` with `external` prop
- Disclaimer text: "You'll be taken to our secure member portal to complete registration."

## Tests (Write First)

Create `__tests__/app/membership/page.test.tsx`.

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock("@/components/ui/StripeBuyButton", () => ({
  default: ({ buyButtonId, className }: any) => (
    <div data-testid="stripe-buy-button" data-buy-button-id={buyButtonId} className={className} />
  ),
}));

describe("MembershipPage", () => {
  it("renders 4 membership tier names (Rookie, Captain, All Star, MVP)");
  it("displays updated prices ($25, $50, $100, $250)");
  it("renders a StripeBuyButton for each tier");
  it("each StripeBuyButton receives a distinct buyButtonId");
  it("does not contain any BoosterHub URL");
  it("does not contain 'secure member portal' disclaimer text");
  it("bottom CTA links to on-page anchor (not external URL)");
});
```

### Test Descriptions

- **"renders 4 tier names"** -- Assert "Rookie", "Captain", "All Star", "MVP" appear in the document.
- **"displays updated prices"** -- Assert "$25", "$50", "$100", "$250" appear. Old prices ($15, $100+) should not appear.
- **"renders a StripeBuyButton for each tier"** -- Query for `data-testid="stripe-buy-button"`, expect exactly 4.
- **"each StripeBuyButton receives a distinct buyButtonId"** -- Collect `data-buy-button-id` from each, all should be unique.
- **"does not contain any BoosterHub URL"** -- Assert `document.body.innerHTML` does not include "boosterhub".
- **"does not contain 'secure member portal' disclaimer"** -- Assert `screen.queryByText(/secure member portal/i)` returns null.
- **"bottom CTA links to on-page anchor"** -- The CTA should use `href="#tiers"` (not external).

## Implementation Details

### 1. Update Imports

Remove `BOOSTERHUB_URLS` import. Add:
```tsx
import StripeBuyButton from "@/components/ui/StripeBuyButton";
```

### 2. Update Tier Data

Update the tiers array with new prices and a `buyButtonId` field:

| Tier | Old Price | New Price | buyButtonId (placeholder) |
|------|-----------|-----------|--------------------------|
| Rookie | $15 | $25 | `buy_btn_rookie_placeholder` |
| Captain | $25 | $50 | `buy_btn_captain_placeholder` |
| All Star | $50 | $100 | `buy_btn_allstar_placeholder` |
| MVP | $100+ | $250 | `buy_btn_mvp_placeholder` |

### 3. Replace Tier Card Buttons

Replace each `<Button href={BOOSTERHUB_URLS.membership} external ...>Join Now</Button>` with:
```tsx
<StripeBuyButton buyButtonId={tier.buyButtonId} className="mt-4" />
```

### 4. Add ID to Tiers Section

Add `id="tiers"` to the tier comparison `<section>` element for anchor linking.

### 5. Update Bottom CTA

- Change button from `<Button href={BOOSTERHUB_URLS.membership} external>` to `<Button href="#tiers">Choose Your Membership</Button>`
- Delete the disclaimer paragraph about "secure member portal"
- Optionally update supporting text to reflect on-page checkout

---

## Checklist

- [x] Create `__tests__/app/membership/page.test.tsx` with 7 test cases
- [x] Run tests -- verify they fail (red phase) -- 7 tests failed
- [x] Remove BOOSTERHUB_URLS import, add StripeBuyButton import
- [x] Update tier prices to $25/$50/$100/$250
- [x] Add buyButtonId to each tier object
- [x] Replace tier card Button components with StripeBuyButton
- [x] Add `id="tiers"` to the tiers section
- [x] Update bottom CTA to anchor link, remove disclaimer
- [x] Run tests -- verify all pass (green phase) -- 7 tests passed

## Implementation Notes

- Implementation matched the plan exactly
- StripeBuyButton mock in tests uses data-testid for verification
- Bottom CTA changed to "Choose Your Membership" with href="#tiers"
