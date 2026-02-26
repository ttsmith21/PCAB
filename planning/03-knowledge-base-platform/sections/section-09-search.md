# Section 09: Search

## Overview

This section configures Pagefind search indexing and builds the `SearchBar` client component for the knowledge hub page. Pagefind is a post-build WASM search engine that indexes the static HTML output. The `SearchBar` lazy-loads Pagefind on first interaction, provides debounced search with a results dropdown, keyboard navigation, and a graceful fallback for dev mode (where the Pagefind index does not exist).

**Dependencies:**
- Section 01 (installed `pagefind` as a dev dependency, added `postbuild` script to `package.json`)
- Section 04 (hub page at `app/knowledge/page.tsx` with a search bar placeholder area)
- Section 06 (article pages with `data-pagefind-body` and `data-pagefind-meta` attributes already in place)

**Blocks:** Section 12 (Polish and Validation).

---

## Files to Create or Modify

| File | Action | Description |
|------|--------|-------------|
| `components/knowledge/SearchBar.tsx` | Create | Client component: Pagefind-powered search with lazy loading, debounce, results dropdown, keyboard nav |
| `app/knowledge/page.tsx` | Modify | Replace search placeholder with actual `SearchBar` component |
| `__tests__/components/knowledge/SearchBar.test.tsx` | Create | SearchBar component tests |

---

## Tests First

All tests go in `__tests__/components/knowledge/SearchBar.test.tsx`. The project uses Vitest v4 with jsdom, `@testing-library/react`, and `@testing-library/jest-dom`. The setup file at `__tests__/setup.ts` configures jest-dom matchers globally. Follow the existing mock patterns: mock `next/link` as a pass-through anchor, mock `next/navigation` for `useRouter`.

### SearchBar Tests (`__tests__/components/knowledge/SearchBar.test.tsx`)

```
# Test: search bar renders input element
# Test: search bar shows placeholder text
# Test: search bar handles Pagefind unavailability gracefully (dev mode fallback message)
# Test: search bar shows results dropdown when results are present
# Test: search results display title, description excerpt, category badge
# Test: keyboard navigation with arrow keys updates selected result
# Test: Enter key on selected result navigates to article
# Test: Escape key closes results dropdown
# Test: empty query clears results
```

**Mocking approach:**

The Pagefind library is loaded dynamically at runtime via `import("/pagefind/pagefind.js")`. For tests, mock this dynamic import to return a stub Pagefind object:

```typescript
// Mock Pagefind as a module-level variable the test controls
const mockPagefind = {
  init: vi.fn(),
  debouncedSearch: vi.fn(),
};

// Mock the dynamic import
vi.stubGlobal("__pagefindPromise", Promise.resolve(mockPagefind));

// Or alternatively, mock at the component level by controlling what the
// lazy import resolves to. The SearchBar wraps the import in try/catch,
// so rejecting the promise tests the dev-mode fallback path.
```

Mock `next/link` and `next/navigation` (`useRouter`) following the existing project patterns:

```typescript
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));
```

To test the results dropdown, configure `mockPagefind.debouncedSearch` to resolve with structured results matching the Pagefind response format:

```typescript
mockPagefind.debouncedSearch.mockResolvedValue({
  results: [
    {
      id: "1",
      data: () => Promise.resolve({
        url: "/knowledge/parents/sample-parent-guide",
        meta: {
          title: "Parent Guide to Youth Sports",
          description: "A comprehensive guide for parents...",
          category: "parents",
          readingTime: "5 min read",
        },
        excerpt: "A comprehensive guide for <mark>parents</mark>...",
      }),
    },
  ],
});
```

For testing keyboard navigation, use `fireEvent.keyDown` on the input with `ArrowDown`, `ArrowUp`, `Enter`, and `Escape` keys. Track the selected index by verifying an `aria-selected` attribute or a highlight CSS class on the active result item.

For the dev-mode fallback test, make the dynamic import reject:

```typescript
// Simulate Pagefind not available (dev mode)
// The component should catch the error and show a fallback message
```

---

## Implementation Details

### SearchBar Component (`components/knowledge/SearchBar.tsx`)

This is a Client Component (`"use client"` directive). It provides the full search experience for the knowledge hub page.

**File:** `components/knowledge/SearchBar.tsx`

**Behavior:**

1. **Lazy loading:** Pagefind is NOT loaded on page load. On first focus or click of the search input, the component dynamically imports the Pagefind library from `/pagefind/pagefind.js` and calls `pagefind.init()`. The import is wrapped in `try/catch` because the Pagefind index only exists after a production build (`next build` + `postbuild`). In development mode, the import will fail.

2. **Dev-mode fallback:** When the dynamic import fails (dev mode or if the index is missing), display a subtle message like "Search available after build" inside the results area. Do not throw or show an error state.

3. **Debounced search:** Use `pagefind.debouncedSearch(query)` (Pagefind's built-in debounce, typically 300ms). This returns a promise with `{ results }` where each result has an async `.data()` method that returns the actual result content (title, URL, excerpt, meta).

4. **Results dropdown:** Below the input, show a dropdown container with search results. Each result displays:
   - Title (from `data-pagefind-meta="title:..."`)
   - Description excerpt with search term highlighting (Pagefind returns `excerpt` with `<mark>` tags)
   - Category badge (from `data-pagefind-meta="category:..."`)
   - Reading time (from `data-pagefind-meta="readingTime:..."`)

5. **Keyboard navigation:**
   - `ArrowDown` moves selection to next result
   - `ArrowUp` moves selection to previous result
   - `Enter` navigates to the selected result's URL via `router.push()`
   - `Escape` closes the dropdown and clears the query

6. **Click outside:** Close the dropdown when clicking outside the search component. Use a `ref` and a `mousedown` event listener.

7. **Empty state:** When query is empty, clear all results and hide the dropdown.

**Component structure outline:**

```typescript
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
}

export default function SearchBar() {
  /**
   * State:
   * - query: string (input value)
   * - results: SearchResult[]
   * - selectedIndex: number (-1 = none selected)
   * - isOpen: boolean (dropdown visible)
   * - pagefind: Pagefind instance or null
   * - isLoading: boolean
   * - fallbackMessage: string | null (shown when Pagefind unavailable)
   *
   * Refs:
   * - containerRef: for click-outside detection
   * - inputRef: for focus management
   *
   * Effects:
   * - Click-outside listener to close dropdown
   * - Cleanup on unmount
   *
   * Handlers:
   * - loadPagefind(): lazy import on first interaction
   * - handleSearch(query): calls pagefind.debouncedSearch, loads result data
   * - handleKeyDown(e): arrow keys, enter, escape
   * - handleResultClick(url): navigate with router.push
   */
}
```

**Key implementation notes:**

- The Pagefind import path is `/pagefind/pagefind.js` (relative to site root). This works because the `postbuild` script outputs to `out/pagefind/` and Vercel serves from `out/`.
- Each search result from Pagefind has a `.data()` async method. Resolve the first 5-8 results to avoid loading too many at once.
- The `excerpt` field from Pagefind contains HTML with `<mark>` tags for highlighting. To render this safely, use a dedicated excerpt rendering approach. Since Pagefind generates this markup internally (not from user input), it is safe to render. Use a sanitization library like DOMPurify as a belt-and-suspenders approach, or render the excerpt as plain text with custom highlighting logic.
- Style the dropdown with `absolute top-full left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 mt-2 max-h-96 overflow-y-auto z-50`.
- The selected result should have a visual highlight (e.g., `bg-gray-50` background).
- Include `aria-label`, `role="combobox"`, `role="listbox"`, and `aria-selected` attributes for accessibility.

**Styling:**

The search bar on the hub page should be prominent. Use a large input with:
- `w-full max-w-2xl mx-auto`
- `px-6 py-4 text-lg`
- `rounded-full` for pill shape
- `border-2 border-gray-200 focus:border-pc-red focus:ring-2 focus:ring-pc-red/20`
- `bg-white shadow-lg`
- Lucide `Search` icon positioned inside the input (left side)
- `placeholder="Search articles..."` or similar

---

### Hub Page Integration (`app/knowledge/page.tsx`)

Section 04 creates the hub page with a placeholder for the search bar. This section replaces that placeholder with the actual `SearchBar` component.

**Modification:** In `app/knowledge/page.tsx`, import and render `SearchBar`:

```typescript
import SearchBar from "@/components/knowledge/SearchBar";
```

Place the `SearchBar` in the search section area between the hero and the category grid. Wrap in a container for centering:

```tsx
<section className="relative -mt-8 z-10 px-4">
  <div className="max-w-2xl mx-auto">
    <SearchBar />
  </div>
</section>
```

The `-mt-8` pulls the search bar up to overlap slightly with the hero section, creating a visually connected feel. The `z-10` ensures the results dropdown appears above the category cards below.

---

### Pagefind Content Targeting (Already Done in Section 06)

Section 06 already added the necessary `data-pagefind-body` and `data-pagefind-meta` attributes to article pages. For reference, the article page template includes:

```tsx
<article data-pagefind-body>
  <div data-pagefind-meta="title:{title}" />
  <div data-pagefind-meta="description:{description}" />
  <div data-pagefind-meta="category:{category}" />
  <div data-pagefind-meta="readingTime:{readingTime} min read" />
  {/* MDX content */}
</article>
```

If these are not yet in place when implementing this section, add them to the article page `<article>` wrapper and as hidden `<div>` elements with `data-pagefind-meta` attributes.

---

### Pagefind Postbuild Script (Already Done in Section 01)

Section 01 added the `postbuild` script to `package.json`:

```json
"postbuild": "pagefind --site out --output-path out/pagefind"
```

This runs automatically after `npm run build` (npm convention: `postbuild` runs after `build`). It scans `out/` for HTML files with `data-pagefind-body`, extracts content and metadata, and generates the WASM search index at `out/pagefind/`.

---

### Pagefind Ignore Attributes

To prevent non-article content from being indexed, add `data-pagefind-ignore` to elements that should be excluded. The primary exclusion targets are:

- Navigation (`<nav>` elements)
- Footer
- Sidebar / Table of Contents
- Related articles section
- Breadcrumbs

If these elements are outside `data-pagefind-body`, they are already excluded (Pagefind only indexes content within `data-pagefind-body` elements when that attribute is present anywhere on the page). Since article pages use `data-pagefind-body` on the `<article>` element, only the MDX content is indexed. No additional `data-pagefind-ignore` attributes should be necessary.

---

## Existing Codebase Patterns

The project follows these conventions that `SearchBar` should match:

- **Client components:** Use `"use client"` directive at the top of the file
- **Router:** Import `useRouter` from `next/navigation`
- **Icons:** Import from `lucide-react`
- **Colors:** `text-pc-red`, `bg-pc-red`, `text-pc-gray`, `bg-pc-dark` (brand colors)
- **Typography:** `font-oswald uppercase tracking-wide` for headings, `font-sans` (Inter) for body
- **Animations:** CSS transitions for interactive elements; `FadeIn` for scroll-triggered animations
- **Card styling:** `bg-white rounded-2xl shadow-lg` with hover effects

---

## Verification Checklist

1. `__tests__/components/knowledge/SearchBar.test.tsx` passes all 9 tests via `npx vitest run`
2. `SearchBar` renders on the hub page at `/knowledge`
3. In dev mode (`npm run dev`), search input shows graceful fallback message when typing
4. After production build (`npm run build` triggers `postbuild`), `out/pagefind/` directory exists with index files
5. Search returns relevant results matching article content and metadata
6. Keyboard navigation works (arrow keys, Enter, Escape)
7. Click outside closes the results dropdown
8. Results show title, excerpt with highlighting, category badge, and reading time
9. Clicking a result navigates to the correct article page
