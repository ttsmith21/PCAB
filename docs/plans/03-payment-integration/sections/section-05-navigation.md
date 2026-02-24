# Section 05: Navigation Updates

## Overview

This section updates three layout components -- Navbar, MobileMenu, and Footer -- to replace all BoosterHub references with Stripe and Mailchimp links. The "Donate" button hrefs change to `PAYMENT_URLS.donate`, and the "Member Login" link is replaced by a "Manage Membership" dropdown (desktop) or separate links (mobile/footer) pointing to the Stripe Customer Portal and Mailchimp email preferences.

**Depends on**: section-02-constants (provides `PAYMENT_URLS` and `COMMUNITY_URLS` with `customer_portal` and `mailchimpPreferences`)

**Files to modify**:
- `components/layout/Navbar.tsx`
- `components/layout/MobileMenu.tsx`
- `components/layout/Footer.tsx`

**Test files to create**:
- `__tests__/components/layout/Navbar.test.tsx`
- `__tests__/components/layout/MobileMenu.test.tsx`
- `__tests__/components/layout/Footer.test.tsx`

---

## Tests First

### 5.1 Navbar Tests

**File**: `__tests__/components/layout/Navbar.test.tsx`

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "@/components/layout/Navbar";
import { PAYMENT_URLS, COMMUNITY_URLS } from "@/lib/constants";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

describe("Navbar", () => {
  it("renders a Donate button linking to PAYMENT_URLS.donate", () => {});
  it("renders the Donate button with target=_blank for external link behavior", () => {});
  it("renders a 'Manage Membership' dropdown trigger with correct label", () => {});
  it("dropdown contains 'Billing & Subscription' link pointing to PAYMENT_URLS.customer_portal", () => {});
  it("dropdown contains 'Email Preferences' link pointing to COMMUNITY_URLS.mailchimpPreferences", () => {});
  it("does not render 'Member Login' text anywhere", () => {});
  it("does not contain any BoosterHub URL in any link", () => {});
});
```

### 5.2 MobileMenu Tests

**File**: `__tests__/components/layout/MobileMenu.test.tsx`

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MobileMenu from "@/components/layout/MobileMenu";
import { PAYMENT_URLS, COMMUNITY_URLS } from "@/lib/constants";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("MobileMenu", () => {
  const defaultProps = { isOpen: true, onClose: vi.fn() };

  it("renders a Donate button linking to PAYMENT_URLS.donate", () => {});
  it("renders 'Billing & Subscription' link with correct href", () => {});
  it("renders 'Email Preferences' link with correct href", () => {});
  it("does not render 'Member Login' text", () => {});
  it("does not contain any BoosterHub URL in any link", () => {});
});
```

### 5.3 Footer Tests

**File**: `__tests__/components/layout/Footer.test.tsx`

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/layout/Footer";
import { PAYMENT_URLS, COMMUNITY_URLS } from "@/lib/constants";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

describe("Footer", () => {
  it("renders 'Billing & Subscription' link with correct href", () => {});
  it("renders 'Email Preferences' link with correct href", () => {});
  it("does not render 'Member Login' text", () => {});
  it("does not contain any BoosterHub URL in any link", () => {});
});
```

---

## Implementation Details

### Constants Dependency

Section 02 adds these keys consumed by this section:
- `PAYMENT_URLS.donate` -- Stripe Payment Link URL for one-time donations
- `PAYMENT_URLS.customer_portal` -- Stripe Customer Portal URL
- `COMMUNITY_URLS.mailchimpPreferences` -- Mailchimp preference center URL

The import in each component changes from:
```ts
import { BOOSTERHUB_URLS } from "@/lib/constants";
```
to:
```ts
import { PAYMENT_URLS, COMMUNITY_URLS } from "@/lib/constants";
```

---

### 5.1 Navbar (`components/layout/Navbar.tsx`)

**Current state**: A `"use client"` component with:
- A "Member Login" anchor tag (lines 79-88) pointing to `BOOSTERHUB_URLS.login`, hidden on mobile (`hidden lg:inline-block`), opening in a new tab.
- A "Donate" anchor tag (lines 89-96) pointing to `BOOSTERHUB_URLS.donate`, styled as a red pill button, opening in a new tab.

**Changes**:

1. **Update the import** -- replace `BOOSTERHUB_URLS` with `PAYMENT_URLS, COMMUNITY_URLS`.

2. **Donate button** -- change `href={BOOSTERHUB_URLS.donate}` to `href={PAYMENT_URLS.donate}`. Keep all existing styling, `target="_blank"`, and `rel="noopener noreferrer"`.

3. **Replace "Member Login" with "Manage Membership" dropdown** -- remove the single "Member Login" anchor and replace with a dropdown container:
   - Display a "Manage Membership" label styled consistently with existing nav link text (font-oswald, text-sm, uppercase, tracking-wide).
   - Use a `relative` + `group` pattern with `opacity-0 invisible group-hover:opacity-100 group-hover:visible` for smooth hover reveal.
   - Two dropdown items:
     - "Billing & Subscription" → `PAYMENT_URLS.customer_portal` (external, new tab)
     - "Email Preferences" → `COMMUNITY_URLS.mailchimpPreferences` (external, new tab)
   - Dropdown panel: white background, shadow, rounded corners, comfortable padding.
   - Remain `hidden lg:block` so it only appears on desktop.

---

### 5.2 MobileMenu (`components/layout/MobileMenu.tsx`)

**Current state**: A `"use client"` component with:
- A "Member Login" anchor (lines 45-53) styled as an outlined pill button.
- A "Donate" anchor (lines 54-62) styled as a filled red pill button.

**Changes**:

1. **Update the import** -- replace `BOOSTERHUB_URLS` with `PAYMENT_URLS, COMMUNITY_URLS`.

2. **Donate button** -- change href to `PAYMENT_URLS.donate`. Keep all existing styling.

3. **Replace "Member Login"** with two separate links (no dropdown needed on mobile):
   - An optional "Manage Membership" heading above the two links.
   - "Billing & Subscription" → `PAYMENT_URLS.customer_portal` (external, new tab, calls `onClose` on click)
   - "Email Preferences" → `COMMUNITY_URLS.mailchimpPreferences` (external, new tab, calls `onClose` on click)

---

### 5.3 Footer (`components/layout/Footer.tsx`)

**Current state**: A server component. In the "Connect" column, has a "Member Login" link (lines 93-102) using `BOOSTERHUB_URLS.login`.

**Changes**:

1. **Update the import** -- change from `BOOSTERHUB_URLS` to `PAYMENT_URLS`.

2. **Replace "Member Login"** list item with two list items:
   - "Billing & Subscription" → `PAYMENT_URLS.customer_portal` (external, new tab)
   - "Email Preferences" → `COMMUNITY_URLS.mailchimpPreferences` (external, new tab)

   Follow existing list item styling:
   ```tsx
   <li>
     <a href={PAYMENT_URLS.customer_portal} target="_blank" rel="noopener noreferrer"
        className="text-gray-400 text-sm hover:text-white transition-colors">
       Billing & Subscription
     </a>
   </li>
   ```

---

## Implementation Checklist

- [ ] Write all three test files first. Run `npx vitest run` to verify they all fail (red phase).
- [ ] Update `components/layout/Navbar.tsx`: change import, update Donate href, replace Member Login with Manage Membership hover dropdown
- [ ] Update `components/layout/MobileMenu.tsx`: change import, update Donate href, replace Member Login with two separate links
- [ ] Update `components/layout/Footer.tsx`: change import, replace Member Login with two list items
- [ ] Run `npx vitest run` to verify all tests pass (green phase)
- [ ] Run `npm run build` to verify the static export completes

## Verification Criteria

- No component in `components/layout/` imports `BOOSTERHUB_URLS`
- The string "Member Login" does not appear in Navbar.tsx, MobileMenu.tsx, or Footer.tsx
- The string "boosterhub" (case-insensitive) does not appear in any href
- The "Manage Membership" dropdown on desktop shows two items on hover
- Both dropdown items open in new tabs
- The Donate button in both Navbar and MobileMenu points to the Stripe donation Payment Link
- The mobile menu displays "Billing & Subscription" and "Email Preferences" as separate tappable links
- All tests pass via `npx vitest run`
