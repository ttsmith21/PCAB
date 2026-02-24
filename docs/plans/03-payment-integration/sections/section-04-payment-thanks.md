# Section 04: Payment Confirmation Page

## Overview

This section creates the post-payment confirmation page at `/payment/thanks`. After a user completes any Stripe checkout (membership or donation), the Stripe Payment Link redirects them to this page. It provides a thank-you message, prompts to join the mailing list, shows social links, and notes that Stripe will send an email receipt.

This is a **new file** with no existing code to modify. The page follows the established pattern of the existing `/join/thanks` page.

## Dependencies

- **section-01-test-setup**: Vitest and React Testing Library must be installed and configured before writing tests.
- **section-02-constants**: The `PAYMENT_URLS` (for `customer_portal`) and `COMMUNITY_URLS` (for `facebookPage`, `facebookGroup`) constants must exist in `lib/constants.ts`.

## Files to Create

| File | Purpose |
|------|---------|
| `__tests__/app/payment/thanks/page.test.tsx` | Tests for the confirmation page |
| `app/payment/thanks/page.tsx` | Post-payment confirmation page |

## Tests First

Create the test file at `__tests__/app/payment/thanks/page.test.tsx`. The tests verify that the page renders expected content sections.

### Test file: `__tests__/app/payment/thanks/page.test.tsx`

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ThanksPage from "@/app/payment/thanks/page";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("Payment Thanks Page", () => {
  it("renders a thank you heading/message", () => {
    /** Verify the page has a prominent thank-you heading */
  });

  it("contains Mailchimp signup prompt (link to /join or embedded form)", () => {
    /** Verify there is a link to /join for mailing list signup */
  });

  it("contains social media links (Facebook group)", () => {
    /** Verify the page includes Facebook page and/or group links from COMMUNITY_URLS */
  });

  it("mentions email receipt from Stripe", () => {
    /** Verify text about receiving a Stripe email receipt is present */
  });

  it("mentions Customer Portal for subscription management", () => {
    /** Verify the page references managing subscriptions via the Stripe Customer Portal,
        with a link to PAYMENT_URLS.customer_portal */
  });
});
```

## Implementation Details

### File: `app/payment/thanks/page.tsx`

This is a **server component** (no `"use client"` directive needed) that exports static metadata and a default page component.

### Pattern to Follow

The page should mirror the structure of the existing `/join/thanks` page located at `app/join/thanks/page.tsx`. That page uses:

- **Metadata export**: `export const metadata: Metadata` for SEO title/description.
- **Hero section**: Dark background (`bg-pc-dark text-white`) with `pt-32 pb-20` padding, containing a `FadeIn`-wrapped heading and subtitle.
- **Content section**: White background with a `Card` component (`hover={false}`) containing numbered steps as an ordered list.
- **CTA section**: Light gray background with a `Button` component linking back to home or another relevant page.

### Imports

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { COMMUNITY_URLS, PAYMENT_URLS } from "@/lib/constants";
```

### Metadata

```tsx
export const metadata: Metadata = {
  title: "Thank You!",
  description:
    "Thank you for your support of PC Athletic Boosters. Your payment was successful.",
};
```

### Page Structure

The page should have three main sections:

**1. Hero Section** -- A dark-background banner with a thank-you heading such as "Thank You!" and a subtitle like "Your support makes a difference for PC student-athletes."

**2. Next Steps Section** -- A `Card` with numbered steps:

- **Step 1: Check Your Email** -- Inform the user that Stripe will send an email receipt for their transaction. For subscription memberships, note that the receipt confirms their recurring plan.
- **Step 2: Join Our Mailing List** -- Prompt users to join the mailing list. Include a link to `/join` (the existing signup page).
- **Step 3: Follow Us on Facebook** -- Link to the Facebook page (`COMMUNITY_URLS.facebookPage`) and community group (`COMMUNITY_URLS.facebookGroup`). Use external anchor tags with `target="_blank"` and `rel="noopener noreferrer"`.
- **Step 4: Manage Your Membership** -- Note they can manage billing, update payment methods, or cancel via the Stripe Customer Portal. Include a link to `PAYMENT_URLS.customer_portal` opening in a new tab.

**3. Bottom CTA Section** -- A `Button` component linking back to the home page (`/`).

### Styling Details

Follow the exact Tailwind class patterns from the `/join/thanks` page:

- Hero: `section` with `className="pt-32 pb-20 bg-pc-dark text-white"`, container with `container mx-auto px-4 text-center`
- Heading: `text-5xl md:text-6xl font-bold mb-4`
- Step numbers: Red circles with `bg-pc-red text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0`
- Step headings: `font-oswald text-xl font-bold uppercase mb-1`
- Links: `text-pc-red hover:underline font-semibold`
- CTA section: `py-16 bg-gray-50 text-center`

### URL Parameters

Stripe appends a `{CHECKOUT_SESSION_ID}` query parameter to the redirect URL after checkout. Since this is a static site with no server-side logic, the page does not read or use this parameter. The page renders generic thank-you content regardless of query parameters.

---

## Checklist

- [ ] Create `__tests__/app/payment/thanks/page.test.tsx` with the 5 test cases
- [ ] Run tests -- they should all fail (red phase)
- [ ] Create `app/payment/thanks/page.tsx` following the structure and patterns above
- [ ] Run tests -- they should all pass (green phase)
- [ ] Verify the page builds correctly with `npm run build`
