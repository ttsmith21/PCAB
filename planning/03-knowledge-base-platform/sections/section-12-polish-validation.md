# Section 12: Polish and Validation

## Overview

This is the final section in the knowledge base platform implementation. It depends on all prior sections being complete (sections 01-11). The goal is to perform comprehensive integration verification, ensure mobile responsiveness, validate performance, confirm no regressions on existing pages, and verify the full build pipeline including Pagefind search indexing.

There are no new source files to create in this section. Instead, this section consists of validation tasks, potential minor fixes, and a final build verification. All testing here is manual or semi-automated (Lighthouse CLI, browser testing, full test suite run).

---

## Dependencies

All previous sections must be complete before starting this section:

- **Section 01** (Dependencies and Config) -- all packages installed, `lib/mdx-components.tsx` created, `postbuild` script in `package.json`
- **Section 02** (Types and Content Utils) -- `lib/knowledge.ts`, types, Zod schema, `lib/data/knowledge-categories.ts`
- **Section 03** (Sample Content) -- MDX stub files in `content/` directories
- **Section 04** (Hub Page) -- `app/knowledge/page.tsx`, `app/knowledge/layout.tsx`, `Breadcrumbs`, `CategoryCard`, `ReadingTime`, `TagBadge` components
- **Section 05** (Category Pages) -- `app/knowledge/[category]/page.tsx`, `ArticleCard` component
- **Section 06** (Article Pages) -- `app/knowledge/[category]/[slug]/page.tsx`, `ArticleHero`, `RelatedArticles` components
- **Section 07** (Category Filters) -- `CategoryFilter` client component integrated into category pages
- **Section 08** (Table of Contents) -- `TableOfContents` client component integrated into article pages
- **Section 09** (Search) -- Pagefind postbuild, `data-pagefind-body`/`data-pagefind-meta` attributes, `SearchBar` component on hub page
- **Section 10** (Navigation) -- `NavLink` interface extended with `children`, "Knowledge" entry in `navLinks`, navbar dropdown, mobile menu expand, footer slice update
- **Section 11** (Youth Page) -- Knowledge base section added to `app/youth/page.tsx`

---

## Tests

This section has no new automated test files to create. The TDD plan explicitly marks this section as "N/A (manual validation)". The validation tasks below replace traditional unit tests.

### Run the Full Existing Test Suite

Execute the complete test suite to confirm no regressions:

```
npx vitest run
```

All tests from sections 01-11 must pass, plus all pre-existing tests. The test files involved include (but are not limited to):

- `__tests__/components/layout/Navbar.test.tsx` -- must pass with new dropdown logic for "Knowledge"
- `__tests__/components/layout/MobileMenu.test.tsx` -- must pass with expand chevron for category sub-links
- `__tests__/components/layout/Footer.test.tsx` -- must pass with updated slice logic including "Knowledge"
- `__tests__/lib/knowledge.test.ts` -- all content utility tests
- `__tests__/components/knowledge/*.test.tsx` -- all new knowledge component tests (ArticleCard, CategoryCard, CategoryFilter, TableOfContents, SearchBar, Breadcrumbs, ReadingTime, TagBadge, ArticleHero, RelatedArticles)
- `__tests__/app/knowledge/*.test.tsx` -- hub page, category page, article page tests
- `__tests__/app/youth/page.test.tsx` -- youth page with knowledge section

Every test must pass with zero failures. If any test fails, the cause must be diagnosed and fixed before proceeding.

---

## Validation Checklist

### 1. Build Verification

Run the full production build pipeline to confirm static export succeeds:

```bash
npm run build
```

This triggers `next build` which produces static HTML in the `out/` directory. Verify:

- The build completes without errors or warnings related to knowledge base pages
- All knowledge routes are statically generated (check `out/knowledge/` directory structure):
  - `out/knowledge/index.html` (hub page)
  - `out/knowledge/parents/index.html` (category page)
  - `out/knowledge/coaches/index.html` (category page)
  - `out/knowledge/development/index.html` (category page)
  - `out/knowledge/community/index.html` (category page)
  - `out/knowledge/resources/index.html` (category page)
  - `out/knowledge/pc-way/index.html` (category page)
  - `out/knowledge/parents/sample-parent-guide/index.html` (article page)
  - `out/knowledge/coaches/sample-coaching-tips/index.html` (article page)
  - `out/knowledge/pc-way/sample-pc-way/index.html` (article page)
- All pre-existing pages are still generated (homepage, about, membership, sponsors, initiatives, youth, volunteer, store, resources, news, join, payment)

### 2. Pagefind Postbuild Verification

After `next build`, the `postbuild` script should automatically run:

```bash
npx pagefind --site out --output-path out/pagefind
```

Verify:

- The `out/pagefind/` directory is created
- It contains WASM files (`pagefind.js`, `pagefind-ui.js`, or similar Pagefind output files)
- Pagefind indexed content from the article pages (look for fragment files in `out/pagefind/`)
- The `data-pagefind-body` attribute is present in the generated article HTML files (inspect `out/knowledge/coaches/sample-coaching-tips/index.html` for the attribute on the content wrapper)

### 3. All Category Pages Render

Serve the built output locally and visit each URL:

```bash
npx serve out
```

Visit and verify each page loads without errors:

- `/knowledge` -- Hub page with dark hero, search bar, 6 category cards, recent articles
- `/knowledge/parents` -- Category page with hero, article list, filter bar
- `/knowledge/coaches` -- Category page
- `/knowledge/development` -- Category page (may show empty state if no sample content in this category)
- `/knowledge/community` -- Category page (may show empty state)
- `/knowledge/resources` -- Category page (may show empty state)
- `/knowledge/pc-way` -- Category page

### 4. Article Pages Render with Full Layout

Visit each sample article and verify the complete layout:

- `/knowledge/parents/sample-parent-guide`
  - Article hero with title, category badge ("Parents"), reading time
  - Pillar, sport, and age_group tag badges displayed
  - MDX content rendered with styled components (Oswald headings, Inter body, pc-red links)
  - Breadcrumbs: Home > Knowledge > Parents > [Article Title]
  - Related articles section at bottom (may show articles from other categories)
  - Table of contents NOT shown (this article has fewer than 6 headings)

- `/knowledge/coaches/sample-coaching-tips`
  - Same layout verification as above
  - Table of contents IS shown (this article has 6+ headings)
  - Desktop: TOC appears as sticky sidebar on the right
  - Mobile: TOC appears as collapsible accordion at top of article

- `/knowledge/pc-way/sample-pc-way`
  - Same layout verification
  - Different category badge ("The PC Way")
  - Related articles section shows relevant articles from other categories

### 5. Filters Work and Persist

On a category page (e.g., `/knowledge/coaches`):

- Filter controls for sport, age_group, and pillar are visible
- Selecting a filter updates the URL query params (e.g., `?pillar=retention`)
- The article grid filters to show only matching articles
- No flash of unfiltered content (FOUC) -- the grid reveals smoothly via opacity transition
- Selecting multiple filters within a group uses OR logic (shows articles matching any selected value)
- Selecting filters across groups uses AND logic (articles must match at least one value in each active filter group)
- "Clear all" button resets all filters and removes query params from URL
- Refreshing the page with query params in the URL restores the filter state
- Empty state message appears when no articles match the current filters, with a button to clear filters

### 6. Search Returns Results

After a full build (which runs Pagefind postbuild):

- Navigate to `/knowledge`
- Click/focus the search bar
- Type a term that appears in sample content (e.g., "coaching" or "parent")
- Results dropdown appears with matching articles showing title, description excerpt, category badge
- Keyboard navigation works: arrow keys move selection, Enter navigates to selected article, Escape closes dropdown
- Empty query clears results
- In dev mode (`npm run dev`), the search bar shows a graceful fallback message ("Search available after build" or similar) instead of crashing

### 7. Dropdown Navigation Works

**Desktop:**

- Hover over "Knowledge" in the navbar
- Dropdown appears with 6 category links using the same `group-hover` pattern as "Manage Membership"
- Clicking "Knowledge" navigates to `/knowledge`
- Clicking a category in the dropdown navigates to `/knowledge/[category]`
- Dropdown dismisses when mouse leaves

**Mobile:**

- Open hamburger menu
- "Knowledge" link is visible
- Tapping "Knowledge" navigates to `/knowledge` and closes the menu
- An expand chevron is present next to "Knowledge"
- Tapping the chevron reveals 6 indented category sub-links
- Tapping a category sub-link navigates to the correct URL and closes the menu
- All other nav links still close the menu on tap (no regression)

**Footer:**

- "Knowledge" appears in the "Quick Links" section
- It links to `/knowledge` (flat link, no dropdown)

### 8. Youth Page Shows Knowledge Links

Visit `/youth` and verify:

- A new section exists showing articles filtered by `age_group: 'youth'`
- 3-4 `ArticleCard` components are displayed (based on available sample content matching youth age group)
- A "See all youth content" button links to `/knowledge` with an age filter query param
- The section follows existing page patterns (alternating background, `FadeIn`, `SectionHeading`)
- The section is positioned logically within the page (near bottom, before CTA)

### 9. Mobile Responsiveness Audit

Test all knowledge pages at mobile viewport widths (375px, 414px) and tablet (768px):

- **Hub page:** Category cards stack to single column on mobile, 2 columns on tablet. Search bar is full width. Hero text is readable.
- **Category pages:** Article cards stack to single column. Filter bar wraps properly or becomes scrollable. Sort toggle is accessible.
- **Article pages:** Single-column layout. TOC collapses into accordion. Content text is readable. Tag badges wrap properly. Related articles stack vertically.
- **Navigation:** Mobile menu works correctly with Knowledge dropdown. Breadcrumbs truncate or wrap gracefully.
- **Touch targets:** All buttons and links have adequate tap target size (minimum 44x44px).
- **No horizontal overflow:** No pages produce horizontal scrollbars on mobile.

### 10. Lighthouse Performance Check

Run Lighthouse audits on three representative pages. The target score is > 90 for Performance, Accessibility, Best Practices, and SEO.

```bash
npx lighthouse http://localhost:3000/knowledge --output=json --output-path=./lighthouse-hub.json
npx lighthouse http://localhost:3000/knowledge/coaches --output=json --output-path=./lighthouse-category.json
npx lighthouse http://localhost:3000/knowledge/coaches/sample-coaching-tips --output=json --output-path=./lighthouse-article.json
```

Key areas to watch:

- **Performance > 90:** Lazy-loaded Pagefind should not impact initial load. Image optimization (all images are unoptimized per config, but should have explicit width/height). No large JS bundles from client components.
- **Accessibility > 90:** Proper heading hierarchy (h1 > h2 > h3). ARIA labels on interactive elements. Color contrast ratios meet WCAG AA. Keyboard navigation works on all interactive components.
- **Best Practices > 90:** No console errors. HTTPS links. Proper meta tags.
- **SEO > 90:** `generateMetadata` produces correct title, description, and OG tags. Breadcrumbs provide structured navigation. Headings are properly nested.

If scores fall below 90, identify and fix the specific issues. Common fixes:

- Add `width` and `height` to images to prevent CLS
- Reduce client-side JS by keeping components as Server Components where possible
- Ensure `aria-label` attributes on icon-only buttons
- Add `lang` attribute if missing
- Fix heading hierarchy gaps

### 11. Existing Pages Unaffected

Spot-check the following pre-existing pages to confirm no regressions:

- `/` (homepage) -- hero, action cards, all sections render
- `/about` -- page loads correctly
- `/membership` -- page loads correctly
- `/sponsors` -- page loads correctly
- `/initiatives` -- page loads correctly
- `/youth` -- existing content intact, plus new knowledge section
- `/volunteer` -- page loads correctly
- `/store` -- page loads correctly
- `/resources` -- page loads correctly
- `/news` -- social feed section renders
- `/join` -- page loads correctly

The navbar and footer should function identically to before on all these pages, with the addition of the "Knowledge" dropdown.

### 12. Cross-Browser Testing

Test the knowledge base pages in at least these browsers:

- **Chrome** (latest) -- primary target
- **Safari** (latest) -- test CSS compatibility (sticky positioning, backdrop-filter, grid layout)
- **Firefox** (latest) -- verify Pagefind WASM loads correctly
- **Mobile Safari (iOS)** -- test touch interactions, TOC accordion, filter dropdowns
- **Chrome Mobile (Android)** -- same mobile checks

Key areas that may vary across browsers:

- CSS `position: sticky` for TOC sidebar
- `backdrop-filter: blur()` on navbar (used by existing navbar)
- Intersection Observer for active heading tracking in TOC
- WASM loading for Pagefind search
- CSS opacity transitions for FOUC mitigation on filtered views

---

## Potential Fixes

During validation, common issues that may need addressing:

### Build Errors

- **Missing `generateStaticParams` entries:** If any category or article route is not statically generated, add the missing params. All 6 categories and all sample articles must be included.
- **Frontmatter validation failures:** If Zod schema validation fails for any sample MDX file, fix the frontmatter to match the schema exactly.
- **Import resolution errors:** Verify all imports use the `@/` alias correctly and reference files that exist.

### Visual Issues

- **Heading font mismatch:** Ensure MDX-rendered headings use Oswald font (check `lib/mdx-components.tsx` maps h1-h4 correctly).
- **Spacing inconsistencies:** Compare knowledge pages against existing pages (e.g., `/about`) to ensure hero padding, section spacing, and card margins match.
- **Color inconsistencies:** All accent colors should use `pc-red` (#CC0033). Links in MDX content should be `text-pc-red`.

### Functional Issues

- **Search not working after build:** Verify `postbuild` script runs and `data-pagefind-body` attribute is on article content wrapper. Check browser console for Pagefind loading errors.
- **Filters not restoring from URL:** Ensure `CategoryFilter` reads `useSearchParams()` in `useEffect` (not during render) and the `Suspense` boundary is in place on the category page.
- **TOC not highlighting active heading:** Verify Intersection Observer thresholds are set correctly. The active heading should update as the user scrolls.
- **Related articles empty:** Ensure at least 2 sample articles share some pillar or sport values so the Jaccard similarity algorithm produces matches.

### Performance Issues

- **Large bundle size:** If the Lighthouse performance score is low, check that Pagefind is lazy-loaded (not imported at the top level). Verify `SearchBar`, `CategoryFilter`, and `TableOfContents` are the only client components and they are properly code-split.
- **Layout shift:** Add explicit dimensions to any images or dynamic content that could cause CLS.

---

## Files Modified in This Section

No new files are created in this section. Files that may require minor fixes based on validation findings:

| File | Potential Changes |
|---|---|
| `app/knowledge/page.tsx` | Fix layout issues, spacing, or accessibility problems found during audit |
| `app/knowledge/[category]/page.tsx` | Fix filter integration, empty state, or responsive layout issues |
| `app/knowledge/[category]/[slug]/page.tsx` | Fix TOC integration, article rendering, or metadata issues |
| `components/knowledge/*.tsx` | Fix component-level visual or accessibility issues |
| `components/layout/Navbar.tsx` | Fix dropdown behavior across browsers |
| `components/layout/MobileMenu.tsx` | Fix mobile knowledge dropdown interaction |
| `components/layout/Footer.tsx` | Fix slice logic if Knowledge link is missing |
| `lib/mdx-components.tsx` | Fix MDX rendering styles |
| `content/**/*.mdx` | Fix frontmatter values if validation or related articles are broken |
| `package.json` | Fix `postbuild` script if Pagefind output path is wrong |

---

## Completion Criteria

This section (and the entire knowledge base implementation) is complete when ALL of the following are true:

1. `npx vitest run` passes with zero failures
2. `npm run build` completes without errors (static export to `out/`)
3. Pagefind `postbuild` generates search index in `out/pagefind/`
4. All 6 category pages render with correct content
5. All sample article pages render with full layout (hero, content, TOC where applicable, related articles, breadcrumbs)
6. Filters work on category pages with URL persistence
7. Search returns results after build
8. Navigation dropdown works on desktop and mobile
9. Youth page shows knowledge base section
10. Mobile responsiveness is verified at 375px, 414px, and 768px viewports
11. Lighthouse scores are > 90 on hub, category, and article pages
12. All pre-existing pages render without regression
13. No console errors on any knowledge base page
