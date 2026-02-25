# Section 03: StripeBuyButton Component

## Overview

This section creates a reusable `"use client"` React component that wraps Stripe's `<stripe-buy-button>` web component for use in the statically-exported Next.js 16 site. Stripe Buy Buttons are custom HTML elements that load from Stripe's CDN and render a payment button inside a shadow DOM. They open Stripe's hosted checkout as an overlay with support for Apple Pay, Google Pay, and card payments. No server-side code is required.

The component will be located at `components/ui/StripeBuyButton.tsx` and will be used by the membership page (section-06) and potentially other pages that embed Stripe payment buttons.

## Dependencies

- **section-01-test-setup**: Vitest, React Testing Library, and jsdom must be installed and configured before writing the tests below.
- **section-02-constants**: `STRIPE_CONFIG.publishableKey` must exist in `lib/constants.ts`. The component imports and uses this value as the default publishable key.

## Tests First

Create the test file at `__tests__/components/ui/StripeBuyButton.test.tsx`.

These tests validate that the component renders the correct DOM structure and passes the right attributes to the Stripe web component. Because `<stripe-buy-button>` is a custom element unknown to jsdom, the tests focus on attribute presence and wrapper behavior rather than Stripe's internal rendering.

### Test file: `__tests__/components/ui/StripeBuyButton.test.tsx`

```tsx
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import StripeBuyButton from "@/components/ui/StripeBuyButton";
import { STRIPE_CONFIG } from "@/lib/constants";

// Mock next/script since it is a Next.js-specific component that does not
// render in a plain jsdom environment. The mock renders a <script> tag
// so we can assert the correct src is used.
vi.mock("next/script", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    return <script data-testid="stripe-script" src={props.src as string} />;
  },
}));

describe("StripeBuyButton", () => {
  it("renders a stripe-buy-button element with the correct buy-button-id attribute", () => {
    /** Verify the custom element receives the buyButtonId prop as an attribute. */
  });

  it("renders a stripe-buy-button element with the correct publishable-key attribute", () => {
    /** Verify an explicitly provided publishableKey is passed through. */
  });

  it("uses the default publishable key from STRIPE_CONFIG when not explicitly provided", () => {
    /** Verify the component falls back to STRIPE_CONFIG.publishableKey. */
  });

  it("renders a Script element with the correct Stripe JS URL", () => {
    /** Verify the script src is https://js.stripe.com/v3/buy-button.js */
  });

  it("applies an optional className to the wrapper element", () => {
    /** Verify the className prop is forwarded to the outer container. */
  });

  it("does not crash when rendered without optional props", () => {
    /** Verify rendering with only the required buyButtonId prop succeeds. */
  });
});
```

**Key testing notes:**

- The `next/script` module must be mocked because it relies on Next.js internals unavailable in a jsdom test environment. The mock renders a plain `<script>` tag so the test can verify the `src` attribute.
- The `<stripe-buy-button>` custom element will appear in the DOM as an unknown element. Use `container.querySelector("stripe-buy-button")` to find it and `getAttribute()` to check its attributes.
- The expected Stripe JS URL is `https://js.stripe.com/v3/buy-button.js`.
- The default publishable key value should match `STRIPE_CONFIG.publishableKey` from `lib/constants.ts`.

## Implementation Details

### File to create: `components/ui/StripeBuyButton.tsx`

This is a client component (requires `"use client"` directive) that renders two things:

1. A Next.js `Script` tag to load the Stripe Buy Button JavaScript from their CDN.
2. The `<stripe-buy-button>` custom HTML element with the appropriate attributes.

### Component interface

The component accepts the following props:

- **`buyButtonId`** (string, required): The Stripe Buy Button ID (format: `buy_btn_...`), obtained from the Stripe Dashboard after creating a Buy Button for a product.
- **`publishableKey`** (string, optional): The Stripe publishable key. Defaults to `STRIPE_CONFIG.publishableKey` from `lib/constants.ts`. This is a public client-side key and is safe to expose.
- **`className`** (string, optional): CSS class name(s) applied to the wrapper `<div>` for layout and spacing control. The Buy Button itself renders inside Stripe's shadow DOM and cannot be styled externally.

### Script loading strategy

Use the Next.js `Script` component from `next/script` with `strategy="afterInteractive"`. This loads the Stripe script after the page becomes interactive, which is the recommended approach for third-party payment scripts. The Next.js `Script` component automatically deduplicates -- if multiple `StripeBuyButton` instances appear on the same page (as on the membership page with 4 tiers), the script is loaded only once.

### TypeScript and the custom element

TypeScript does not recognize `<stripe-buy-button>` as a valid JSX element because it is a web component, not a standard HTML element or React component. Place a `@ts-expect-error` comment immediately above the `<stripe-buy-button>` JSX tag to suppress the type error. The comment should explain: "Stripe Buy Button is a web component loaded via external script."

### Component structure sketch

```tsx
"use client";

import Script from "next/script";
import { STRIPE_CONFIG } from "@/lib/constants";

interface StripeBuyButtonProps {
  buyButtonId: string;
  publishableKey?: string;
  className?: string;
}

export default function StripeBuyButton({
  buyButtonId,
  publishableKey = STRIPE_CONFIG.publishableKey,
  className,
}: StripeBuyButtonProps) {
  // 1. Render Script tag loading https://js.stripe.com/v3/buy-button.js
  //    with strategy="afterInteractive"
  // 2. Render wrapper div with optional className
  // 3. Inside wrapper, render the <stripe-buy-button> custom element
  //    with buy-button-id and publishable-key attributes
  //    (use @ts-expect-error above it)
}
```

### Attribute mapping

The `<stripe-buy-button>` web component expects kebab-case HTML attributes:

| Prop | HTML Attribute |
|------|---------------|
| `buyButtonId` | `buy-button-id` |
| `publishableKey` | `publishable-key` |

### File location context

The component lives alongside existing UI components:

```
components/
  ui/
    AnimatedCounter.tsx
    Button.tsx
    Card.tsx
    FacebookFeed.tsx
    FadeIn.tsx
    FaqAccordion.tsx
    SectionHeading.tsx
    SignupForm.tsx
    StripeBuyButton.tsx    <-- NEW
```

This follows the established convention: all generic, reusable UI components live in `components/ui/` as default exports. The existing `FacebookFeed.tsx` is the closest analogy -- it is also a `"use client"` component that embeds a third-party widget via an external script/iframe.

## Verification

After implementing the component and tests:

1. Run `npx vitest run __tests__/components/ui/StripeBuyButton.test.tsx` -- all 6 tests should pass.
2. Run `npx vitest run` -- the full suite (including any tests from prior sections) should remain green.
3. Run `npm run build` -- the static export should succeed without TypeScript errors (the `@ts-expect-error` comment suppresses the custom element warning).

---

## Checklist

- [x] Create `__tests__/components/ui/StripeBuyButton.test.tsx` with 6 test cases
- [x] Run tests -- verify they fail (red phase) -- 6 tests failed as expected
- [x] Create `components/ui/StripeBuyButton.tsx` with `"use client"`, Script loading, and web component rendering
- [x] Run tests -- verify all pass (green phase) -- 6 tests passed
- [ ] Run `npm run build` to verify no TypeScript errors (deferred to section-09 cleanup -- build currently broken due to BoosterHub removal in section-02)

## Implementation Notes

- Implementation matched the plan exactly with no deviations
- Build verification deferred: removing BOOSTERHUB_URLS in section-02 breaks 8+ files that still import it; build will pass after sections 05-08 fix those imports
- Code review found only minor test-style nitpicks, all triaged as "let go"
