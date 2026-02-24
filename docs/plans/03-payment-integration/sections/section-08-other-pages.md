# Section 08: Other Pages (ActionCards, Store, Volunteer, Resources)

## Overview

This section updates four files that still reference BoosterHub or need link/content changes as part of the Stripe payment integration migration. These are smaller, targeted changes compared to the major page rewrites in other sections.

**Files to modify:**
- `components/home/ActionCards.tsx` -- change membership link from external BoosterHub to internal `/membership` route
- `app/store/page.tsx` -- remove BoosterHub store link, add "coming soon" messaging
- `app/volunteer/page.tsx` -- confirm volunteer link points to SignUpGenius (verify no BoosterHub references remain)
- `app/resources/page.tsx` -- remove BoosterHub reference from FAQ answer text

**Dependencies:** Section 02 (Constants) must be completed first. The `BOOSTERHUB_URLS` export will have been removed and replaced with `PAYMENT_URLS` and `COMMUNITY_URLS` in `lib/constants.ts`.

---

## Tests First

### ActionCards Tests

**File:** `__tests__/components/home/ActionCards.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ActionCards from "@/components/home/ActionCards";

describe("ActionCards", () => {
  it("renders the membership action card with a link to /membership (internal route)", () => {
    render(<ActionCards />);
    const joinLink = screen.getByRole("link", { name: /join now/i });
    expect(joinLink).toHaveAttribute("href", "/membership");
  });

  it("membership action card is NOT an external link (no target=_blank)", () => {
    render(<ActionCards />);
    const joinLink = screen.getByRole("link", { name: /join now/i });
    expect(joinLink).not.toHaveAttribute("target", "_blank");
  });

  it("does not contain any BoosterHub URL in any action card link", () => {
    const { container } = render(<ActionCards />);
    const allLinks = container.querySelectorAll("a");
    allLinks.forEach((link) => {
      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
    });
  });
});
```

**Mocking note:** The `ActionCards` component uses `FadeIn` which may need mocking. Mock it to render children directly if tests fail due to animation errors.

### Store Page Tests

**File:** `__tests__/app/store/page.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StorePage from "@/app/store/page";

describe("StorePage", () => {
  it("does not link to the BoosterHub store", () => {
    const { container } = render(<StorePage />);
    const allLinks = container.querySelectorAll("a");
    allLinks.forEach((link) => {
      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
    });
  });

  it("indicates spirit wear is coming soon", () => {
    render(<StorePage />);
    expect(screen.getByText(/coming soon/i)).toBeTruthy();
  });

  it("links to /join or mailing list signup", () => {
    const { container } = render(<StorePage />);
    const joinLink = container.querySelector('a[href="/join"]');
    expect(joinLink).toBeTruthy();
  });
});
```

### Volunteer Page Tests

**File:** `__tests__/app/volunteer/page.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { COMMUNITY_URLS } from "@/lib/constants";
import VolunteerPage from "@/app/volunteer/page";

describe("VolunteerPage", () => {
  it("volunteer signup link points to SignUpGenius", () => {
    const { container } = render(<VolunteerPage />);
    const allLinks = container.querySelectorAll("a");
    const signupLink = Array.from(allLinks).find((link) =>
      link.getAttribute("href")?.includes("signupgenius")
    );
    expect(signupLink).toBeTruthy();
  });

  it("does not contain any BoosterHub URL", () => {
    const { container } = render(<VolunteerPage />);
    const allLinks = container.querySelectorAll("a");
    allLinks.forEach((link) => {
      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
    });
  });
});
```

### Resources Page Tests

**File:** `__tests__/app/resources/page.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ResourcesPage from "@/app/resources/page";

describe("ResourcesPage", () => {
  it('does not contain "BoosterHub" text in FAQ content', () => {
    const { container } = render(<ResourcesPage />);
    expect(container.textContent).not.toMatch(/boosterhub/i);
  });

  it("does not contain any BoosterHub URL in any link", () => {
    const { container } = render(<ResourcesPage />);
    const allLinks = container.querySelectorAll("a");
    allLinks.forEach((link) => {
      expect(link.getAttribute("href")).not.toMatch(/boosterhub/i);
    });
  });
});
```

---

## Implementation Details

### 1. ActionCards (`components/home/ActionCards.tsx`)

**Current state:** Imports `BOOSTERHUB_URLS` and uses `BOOSTERHUB_URLS.membership` as href for the "Join Now" button with `external: true`.

**Changes:**
1. Remove `BOOSTERHUB_URLS` import. Keep `COMMUNITY_URLS` import.
2. Change membership action card `href` from `BOOSTERHUB_URLS.membership` to `"/membership"` (internal route)
3. Change `external` from `true` to `false`

### 2. Store Page (`app/store/page.tsx`)

**Current state:** Imports `BOOSTERHUB_URLS` and uses `BOOSTERHUB_URLS.store` for "Shop Now" button (line 94). Has disclaimer about "online store."

**Changes:**
1. Remove `BOOSTERHUB_URLS` import entirely.
2. Replace bottom CTA section with:
   - Heading: "Coming Soon" or "Spirit Wear Coming Soon"
   - Body text: Spirit wear will be available in a future release
   - Button: "Join Our Mailing List" linking to `/join` (internal, not external)
   - Remove the old disclaimer
3. Keep product grid section as-is (preview of future offerings)
4. Keep page route active

### 3. Volunteer Page (`app/volunteer/page.tsx`)

**Current state:** Imports `COMMUNITY_URLS` and uses `COMMUNITY_URLS.signupGenius` for volunteer signup (line 198). Does NOT import `BOOSTERHUB_URLS`.

**Changes:**
- Minimal. Verify SignUpGenius link resolves correctly after constants refactor.
- If section 02 renamed any keys, update references accordingly.
- May need zero code changes if constants keys are unchanged.

### 4. Resources Page (`app/resources/page.tsx`)

**Current state:** FAQ answer (line 47) contains "complete registration through BoosterHub."

**Changes:**
1. Update FAQ answer text: "complete registration through BoosterHub" becomes "complete your purchase right on the page" or similar
2. No import changes needed (page doesn't import `BOOSTERHUB_URLS`)
3. Scan all remaining FAQ answers for any other BoosterHub mentions

---

## Checklist

- [ ] Create all 4 test files. Run `npx vitest run` to verify they fail (red phase)
- [ ] Update `components/home/ActionCards.tsx`: remove BOOSTERHUB_URLS, change membership to internal /membership
- [ ] Update `app/store/page.tsx`: remove BOOSTERHUB_URLS, replace CTA with "coming soon" + /join link
- [ ] Verify `app/volunteer/page.tsx`: confirm SignUpGenius link, no BoosterHub references
- [ ] Update `app/resources/page.tsx`: remove "BoosterHub" from FAQ answer text
- [ ] Run `npx vitest run` to verify all tests pass (green phase)
- [ ] Run `npm run build` to verify static export completes
