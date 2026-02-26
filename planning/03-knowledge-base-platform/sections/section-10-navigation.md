# Section 10: Navigation Changes

## Overview

This section adds a "Knowledge" entry to the site navigation with dropdown support for the 6 knowledge base categories. It involves four files:

1. **`lib/data/nav-links.ts`** -- Extend the `NavLink` interface with an optional `children` array and add the "Knowledge" entry
2. **`components/layout/Navbar.tsx`** -- Render a dropdown for nav links that have `children`, reusing the existing `group-hover` CSS pattern
3. **`components/layout/MobileMenu.tsx`** -- Add an expand chevron for "Knowledge" that reveals category sub-links as indented items
4. **`components/layout/Footer.tsx`** -- Update the `slice()` logic for Quick Links to correctly include "Knowledge"

## Dependencies

- **section-01-dependencies-config** must be complete (project builds, dependencies installed). No knowledge-specific dependencies are needed for this section -- it uses only existing packages (Next.js, Lucide icons, Tailwind).
- The `lib/data/knowledge-categories.ts` file (from section-02) provides category metadata. However, this section can hardcode the 6 category slugs/labels directly in `nav-links.ts` children to remain independent. If `knowledge-categories.ts` already exists, you may import from it instead.

---

## Tests First

All tests live in `__tests__/` mirroring the source structure. The testing stack is Vitest v4 with jsdom, `@testing-library/react`, and `@testing-library/jest-dom`. The setup file at `__tests__/setup.ts` imports `@testing-library/jest-dom/vitest`.

The existing test files must be **updated** (not replaced) -- they already contain tests for Donate buttons, Manage Membership dropdown, BoosterHub URL checks, and social links. New tests are added alongside existing ones.

### NavLink Data Tests

**File:** `__tests__/lib/data/nav-links.test.ts`

This is a new test file.

```
# Test: navLinks array includes "Knowledge" entry with href "/knowledge"
# Test: Knowledge nav link has children array with 6 category entries
# Test: each Knowledge child has correct href (/knowledge/[category])
# Test: existing nav links without children still work (backward compatibility)
```

The 6 expected category children with their hrefs:

| Label | href |
|-------|------|
| Parents | `/knowledge/parents` |
| Coaches | `/knowledge/coaches` |
| Development | `/knowledge/development` |
| Community | `/knowledge/community` |
| Resources | `/knowledge/resources` |
| The PC Way | `/knowledge/pc-way` |

Tests should import `navLinks` directly from `lib/data/nav-links.ts` and assert structure -- no rendering needed for this pure data file. Verify that the `NavLink` interface supports optional `children` by confirming existing entries (e.g., "About") have `children` as `undefined` and "Knowledge" has `children` as an array of 6 items.

### Navbar Dropdown Tests

**File:** `__tests__/components/layout/Navbar.test.tsx` (update existing file)

Add new tests to the existing `describe("Navbar", ...)` block. The file already has mocks for `next/link`, `next/image`, and `MobileMenu`.

```
# Test: navbar renders "Knowledge" link
# Test: nav link with children renders dropdown container
# Test: dropdown contains links for all 6 categories
# Test: nav links without children render as direct links (no dropdown)
# Test: parent "Knowledge" link is clickable and navigates to /knowledge
# Test: dropdown uses group-hover CSS pattern (opacity/visibility classes present)
```

For the dropdown container test, query for the dropdown wrapper element and verify it contains the CSS classes for the `group-hover` pattern: specifically, look for `group-hover:opacity-100` and `group-hover:visible` (or equivalent classes). The "Knowledge" link itself should be an anchor element with `href="/knowledge"` that is a direct child of the `group` container, making it clickable independently of the dropdown.

For the "nav links without children" test, verify that links like "About" and "Membership" do NOT have an adjacent dropdown container -- they render as simple `<a>` elements.

### Mobile Menu Tests

**File:** `__tests__/components/layout/MobileMenu.test.tsx` (update existing file)

Add new tests to the existing `describe("MobileMenu", ...)` block. The file already has a mock for `next/link` and uses `defaultProps = { isOpen: true, onClose: vi.fn() }`.

```
# Test: mobile menu renders "Knowledge" link
# Test: Knowledge link navigates to /knowledge and closes menu
# Test: expand chevron reveals category sub-links
# Test: category sub-links are indented
# Test: other nav links still close menu on click (no regression)
```

For the expand chevron test: render the component, find the chevron button (by `aria-label` or test id), simulate a click with `fireEvent.click()`, and then verify that the 6 category sub-links become visible. The sub-links should appear as indented items (check for a CSS class like `pl-8` or `ml-6` on the sub-link container).

For the "Knowledge link navigates" test: clicking the "Knowledge" text link should call `onClose` (matching the existing pattern where all nav links call `onClose` on click).

### Footer Tests

**File:** `__tests__/components/layout/Footer.test.tsx` (update existing file)

Add new tests to the existing `describe("Footer", ...)` block.

```
# Test: footer Quick Links includes "Knowledge" link
# Test: Knowledge link in footer navigates to /knowledge (flat, no dropdown)
# Test: footer slice logic correctly includes Knowledge after navLinks update
```

The "Knowledge" link should appear as a flat link in the Quick Links column (no dropdown, no children rendering). It should link to `/knowledge`.

For the slice logic test: verify that the Quick Links section contains the expected set of links after the navLinks array has been modified. The current code uses `navLinks.slice(0, 6)` which yields the first 6 items. After inserting "Knowledge", the slice must be updated to ensure "Knowledge" is included in Quick Links. One approach: increase the slice to `slice(0, 7)` or use a different strategy like filtering by a set of slugs.

---

## Implementation Details

### 1. Extend NavLink Interface and Add Knowledge Entry

**File:** `lib/data/nav-links.ts`

The current file defines:

```typescript
export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Initiatives", href: "/initiatives" },
  { label: "Youth", href: "/youth" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Store", href: "/store" },
  { label: "Resources", href: "/resources" },
  { label: "News", href: "/news" },
  { label: "Join", href: "/join" },
];
```

Changes:

- Add an optional `children?: NavLink[]` field to the `NavLink` interface.
- Add a "Knowledge" entry to the `navLinks` array positioned prominently (recommended: 3rd or 4th position, after "Membership" or "Sponsors"). The entry should have `children` containing 6 items, one for each knowledge category.
- The children should use labels matching the category display names and hrefs of the form `/knowledge/[category-slug]`.

The 6 category slugs are: `parents`, `coaches`, `development`, `community`, `resources`, `pc-way`.

### 2. Update Navbar with Dropdown

**File:** `components/layout/Navbar.tsx`

The navbar currently renders all nav links as flat `<Link>` elements in a simple `map()`. The file already contains a CSS hover dropdown for "Manage Membership" using this pattern:

```tsx
<div className="... relative group">
  <span className="...">Manage Membership</span>
  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
    <div className="bg-white rounded-lg shadow-lg py-2 min-w-[220px]">
      {/* child links */}
    </div>
  </div>
</div>
```

Reuse this exact pattern for the Knowledge dropdown. Update the desktop nav `map()` to check whether each link has `children`. If it does, render a `group` wrapper with the parent link and a dropdown container. If it does not, render the existing simple `<Link>`.

Key implementation details:

- The parent "Knowledge" text should be a clickable `<Link>` to `/knowledge` (not a `<span>` like "Manage Membership"), so users can click it to go to the hub page.
- The dropdown container uses `absolute left-0 top-full` positioning (use `left-0` instead of `right-0` since Knowledge is in the middle of the nav, not at the right edge).
- The dropdown items are `<Link>` elements to `/knowledge/[category]`.
- Include a small chevron-down icon from Lucide (`ChevronDown`) next to the "Knowledge" label to indicate the dropdown.
- Maintain the same font styling: `font-oswald text-sm uppercase tracking-wide`.
- The dropdown items use the same styles as the Manage Membership dropdown items: `block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-pc-red transition-colors`.

### 3. Update MobileMenu with Expandable Sub-links

**File:** `components/layout/MobileMenu.tsx`

The mobile menu currently renders all nav links as flat `<Link>` elements, each calling `onClose` on click.

Update the `map()` to detect links with `children`. For a link with children:

- Render the main "Knowledge" link as a clickable `<Link>` to `/knowledge` that calls `onClose` on click (consistent with other links).
- Next to the link text, render an expand/collapse chevron button (`ChevronDown` from Lucide).
- When the chevron is clicked, toggle visibility of the category sub-links below. Use local `useState` for the expanded state.
- The sub-links are indented (e.g., `pl-8` or `ml-6`) and rendered in a smaller font size (e.g., `text-lg` instead of `text-2xl`).
- Each sub-link is a `<Link>` to `/knowledge/[category]` that also calls `onClose` on click.
- The chevron rotates 180 degrees when expanded (using a Tailwind `rotate-180` transition).

Important: The chevron click should NOT navigate or close the menu -- it only toggles the sub-links. The main "Knowledge" text link handles navigation. This requires the chevron to be a separate `<button>` element next to the `<Link>`.

### 4. Update Footer Slice Logic

**File:** `components/layout/Footer.tsx`

The footer currently uses:

```typescript
const quickLinks = navLinks.slice(0, 6);
```

With the current 10-item array, this returns: About, Membership, Sponsors, Initiatives, Youth, Volunteer. After adding "Knowledge" (likely at position 3 or 4), the slice needs to be updated so that "Knowledge" appears in Quick Links.

Options (choose one):

- **Increase the slice:** `navLinks.slice(0, 7)` to include the new entry. This is the simplest approach and keeps the pattern consistent.
- **Filter approach:** Use a curated list of slugs to pick which items appear, e.g. `navLinks.filter(link => ['About', 'Membership', 'Knowledge', ...].includes(link.label))`. More explicit but more maintenance.

The recommended approach is to increase the slice to 7 items. The footer renders "Knowledge" as a flat link -- it does NOT render a dropdown or children. It simply renders `link.label` and `link.href` like any other Quick Link entry.

### Existing Patterns to Preserve

The following existing behaviors must not regress:

- All current nav links continue to render and function in Navbar, MobileMenu, and Footer.
- The "Manage Membership" dropdown in Navbar continues to work.
- The "Manage Membership" section at the bottom of MobileMenu continues to work.
- The Donate button continues to appear in both Navbar and MobileMenu.
- The mobile hamburger menu open/close behavior is unaffected.
- The navbar scroll behavior (transparent at top, frosted white when scrolled) is unaffected.
- Social links and all other Footer content is unaffected.

---

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `lib/data/nav-links.ts` | Modify | Add `children?` to interface, add Knowledge entry with 6 children |
| `components/layout/Navbar.tsx` | Modify | Add dropdown rendering for links with children using `group-hover` pattern |
| `components/layout/MobileMenu.tsx` | Modify | Add expandable chevron and indented sub-links for Knowledge |
| `components/layout/Footer.tsx` | Modify | Update `slice()` from `slice(0, 6)` to `slice(0, 7)` |
| `__tests__/lib/data/nav-links.test.ts` | Create | New test file for NavLink data structure |
| `__tests__/components/layout/Navbar.test.tsx` | Modify | Add dropdown-related tests |
| `__tests__/components/layout/MobileMenu.test.tsx` | Modify | Add expand chevron and sub-link tests |
| `__tests__/components/layout/Footer.test.tsx` | Modify | Add Knowledge link presence tests |
