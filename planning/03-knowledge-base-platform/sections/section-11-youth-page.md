# Section 11: Youth Page Update

## Overview

This section adds a knowledge base section to the existing `app/youth/page.tsx` page. The new section queries articles tagged with `age_group: 'youth'`, displays 3-4 of them as `ArticleCard` components, and includes a "See all youth content" button linking to a filtered knowledge base view. The section follows the existing page patterns (alternating backgrounds, `FadeIn` animations, `SectionHeading`).

## Dependencies

This section depends on:

- **Section 02 (Types and Content Utils):** The `getAllArticles()` function from `lib/knowledge.ts`, `Article` and `AgeGroup` types, and `getFilteredArticles()` for filtering by `age_group`.
- **Section 03 (Sample Content):** At least one sample MDX file must have `age_group: ['youth']` in its frontmatter for the query to return results.
- **Section 05 (Category Pages):** The `ArticleCard` component from `components/knowledge/ArticleCard.tsx` must exist.

---

## Files to Create or Modify

| File | Action | Purpose |
|------|--------|---------|
| `__tests__/app/youth/page.test.tsx` | Create | Tests for the updated youth page |
| `app/youth/page.tsx` | Modify | Add knowledge base section |

---

## Tests

Create `__tests__/app/youth/page.test.tsx`. This test file follows the same patterns used throughout the project: mock `next/link` as a pass-through anchor, mock `next/image` as a pass-through img, mock `FadeIn` as a pass-through wrapper, and mock `framer-motion` as pass-throughs.

Because the youth page is a Server Component that calls `getAllArticles()` (a function that reads from the filesystem), the `lib/knowledge.ts` module must be mocked to return fixture article data instead of performing real file I/O.

The `ArticleCard` component (from `components/knowledge/ArticleCard.tsx`) should also be mocked as a simple pass-through that renders the article title, since testing ArticleCard rendering in detail is the responsibility of Section 05.

### Test Stubs

```typescript
// __tests__/app/youth/page.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock dependencies following project patterns
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock("@/components/ui/FadeIn", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("framer-motion", () => ({
  motion: { div: ({ children, ...props }: any) => <div {...props}>{children}</div> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the knowledge content utility module
vi.mock("@/lib/knowledge", () => ({
  getAllArticles: vi.fn(),
  getFilteredArticles: vi.fn(),
}));

// Mock ArticleCard as a simple pass-through
vi.mock("@/components/knowledge/ArticleCard", () => ({
  default: ({ article }: any) => (
    <div data-testid="article-card">{article.frontmatter.title}</div>
  ),
}));

// Fixture data: articles with age_group including 'youth'
const mockYouthArticles = [
  /* 3-4 fixture Article objects with age_group: ['youth'] */
];

const mockNonYouthArticles = [
  /* articles without 'youth' in age_group, for verifying filtering */
];

describe("YouthPage", () => {
  beforeEach(() => {
    // Configure mocks to return fixture data
  });

  // Test: youth page renders knowledge base section
  it("renders a knowledge base section with heading", () => {
    /**
     * Render YouthPage and verify a section heading related to
     * knowledge/articles is present (e.g., "Youth Resources from
     * the Knowledge Base" or similar).
     */
  });

  // Test: section shows articles filtered by age_group: 'youth'
  it("displays only articles filtered by age_group youth", () => {
    /**
     * Verify that getFilteredArticles (or equivalent filtering logic)
     * is called with age_group: ['youth'] and that the rendered output
     * contains only youth-tagged articles.
     */
  });

  // Test: section displays 3-4 ArticleCard components
  it("renders 3-4 ArticleCard components for youth articles", () => {
    /**
     * Verify that the correct number of ArticleCard components are
     * rendered (at most 4, based on available youth articles).
     * Use data-testid="article-card" from the mock.
     */
  });

  // Test: "See all youth content" button links to /knowledge with age filter
  it('renders a "See all youth content" button linking to filtered knowledge view', () => {
    /**
     * Find a link/button with text matching "see all youth content"
     * (case insensitive). Verify its href includes /knowledge and
     * an age_group query param for youth (e.g., /knowledge?age_group=youth
     * or a category-filtered path).
     */
  });

  // Test: section follows existing page pattern (SectionHeading, FadeIn)
  it("follows existing page section patterns with SectionHeading and FadeIn", () => {
    /**
     * Verify that the new section uses the SectionHeading component
     * (by checking for the heading text rendered by SectionHeading)
     * and that the section renders within the page's alternating
     * background pattern.
     */
  });

  // Existing page content tests (regression)
  it("still renders the hero section", () => {
    /**
     * Verify the page hero with "Youth & Community" heading still renders.
     */
  });

  it("still renders the existing page sections", () => {
    /**
     * Verify existing sections like "The Challenge", "Our Vision",
     * "Youth Resources", and "How You Can Help" still render.
     */
  });
});
```

---

## Implementation Details

### Modifying `app/youth/page.tsx`

The existing youth page is a Server Component (no `"use client"` directive) located at `app/youth/page.tsx`. It currently has these sections in order:

1. **Hero** -- dark hero with "Youth & Community" title (`pt-32 pb-20 bg-pc-dark`)
2. **The Challenge** -- white background (`py-20 bg-white`)
3. **Our Vision** -- gray background (`py-20 bg-gray-50`)
4. **Youth Resources** -- white background, 3 cards with icons (`py-20 bg-white`)
5. **How You Can Help** -- dark CTA section (`py-16 bg-pc-dark`)

The new knowledge base section should be inserted **between "Youth Resources" and "How You Can Help"** (between sections 4 and 5 above). This placement is logical because:
- It follows the existing informational resource cards.
- It sits before the CTA section, which serves as a natural page closer.
- It continues the alternating background pattern with `bg-gray-50` (since Youth Resources is `bg-white`).

### New Section Structure

The new section should:

1. **Import** `getAllArticles` and `getFilteredArticles` from `@/lib/knowledge` at the top of the file.
2. **Import** `ArticleCard` from `@/components/knowledge/ArticleCard`.
3. **Query articles** inside the component function body by calling `getAllArticles()` then `getFilteredArticles()` with `{ age_group: ['youth'] }`, and slicing the result to 3 or 4 items.
4. **Conditionally render** the section only if there are youth articles available (guard with `if (youthArticles.length > 0)` around the JSX, or render the section unconditionally but show a fallback message if empty).
5. **Follow the existing section pattern:**
   - Wrap in `<section className="py-20 bg-gray-50">`
   - Use `<SectionHeading>` with a title like "From the Knowledge Base" and a subtitle like "Articles and guides for youth athletes and their families."
   - Render `ArticleCard` components in a responsive grid (`grid md:grid-cols-2 lg:grid-cols-3 gap-8`)
   - Wrap each card in `<FadeIn>` with staggered delay (`delay={index * 0.1}`)
   - Include a `<Button>` at the bottom linking to the filtered knowledge view

### Button Link Target

The "See all youth content" button should link to `/knowledge?age_group=youth`. This URL will load the knowledge hub page, and if the hub page or a category page supports reading the `age_group` query parameter, it will show filtered results. Alternatively, the link could point to a specific category page. The simplest approach is `/knowledge?age_group=youth` since the filter infrastructure (from Section 07) already syncs with URL query params.

Use the existing `Button` component with `variant="primary"` or `variant="outline"` to match the page's styling.

### Import Changes

Add the following imports to the top of `app/youth/page.tsx`:

```typescript
import { getAllArticles, getFilteredArticles } from "@/lib/knowledge";
import ArticleCard from "@/components/knowledge/ArticleCard";
```

The existing imports (`BookOpen`, `Calendar`, `Dumbbell`, `SectionHeading`, `Card`, `Button`, `FadeIn`) remain unchanged.

### Article Query Logic

Inside the `YouthPage` component function, before the `return` statement, add the article query:

```typescript
const allArticles = getAllArticles();
const youthArticles = getFilteredArticles(allArticles, {
  age_group: ["youth"],
}).slice(0, 4);
```

This is safe to call in a Server Component because `getAllArticles()` uses `fs.readFileSync` which runs at build time during static export. The `slice(0, 4)` limits to 4 articles maximum for the preview section.

### JSX for the New Section

The new section JSX should be placed in the `return` statement between the "Youth Resources" section and the "How You Can Help" section. The structure follows the exact same pattern already used in the page:

```tsx
{/* Knowledge Base Articles */}
{youthArticles.length > 0 && (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-4">
      <SectionHeading
        title="From the Knowledge Base"
        subtitle="Articles and guides for youth athletes and their families."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
        {youthArticles.map((article, index) => (
          <FadeIn key={article.slug} delay={index * 0.1}>
            <ArticleCard article={article} />
          </FadeIn>
        ))}
      </div>
      <div className="text-center">
        <Button href="/knowledge?age_group=youth">
          See All Youth Content
        </Button>
      </div>
    </div>
  </section>
)}
```

Key points:
- The section is conditionally rendered (`youthArticles.length > 0`) so the page does not break if no youth-tagged articles exist yet.
- The grid uses `md:grid-cols-2 lg:grid-cols-3` to be responsive (1 column on mobile, 2 on tablet, 3 on desktop), matching the pattern from the existing "Youth Resources" card grid.
- `max-w-5xl mx-auto` constrains width consistently with other sections on the page.
- `mb-10` on the grid adds spacing before the button.
- The `Button` is centered with `text-center` on its wrapper div.

### No Other File Changes

This section does not create new components or utility functions. It only modifies the existing `app/youth/page.tsx` file and creates the corresponding test file. All dependencies (`ArticleCard`, `getAllArticles`, `getFilteredArticles`) are created by earlier sections.

---

## Background Context for Implementer

### Existing Youth Page Structure

The existing `app/youth/page.tsx` is a Server Component exporting a `YouthPage` function and `metadata` object. It has no `"use client"` directive. The page uses these components: `SectionHeading`, `Card`, `Button`, `FadeIn`, and Lucide icons (`BookOpen`, `Calendar`, `Dumbbell`). It follows the site-wide pattern of a dark hero followed by alternating white/gray sections.

### Design System Conventions

- **Typography:** Headings use the Oswald font (`font-oswald`), always uppercase with tracking. Body text uses Inter (the default `--font-sans`).
- **Brand colors:** `pc-red` (#CC0033) as primary accent, `pc-dark` (#111111) for dark sections.
- **Section pattern:** Each section is `py-16` to `py-20` with alternating backgrounds (`bg-white`, `bg-gray-50`, `bg-gray-100`). Content is wrapped in `container mx-auto px-4`.
- **Animation:** `FadeIn` wraps animated elements. Grid items use staggered delays (`delay={index * 0.1}`).

### Testing Patterns

Tests are located in `__tests__/` mirroring the source structure. Standard mocks include:
- `next/link` mocked as a pass-through `<a>` element
- `next/image` mocked as a pass-through `<img>` element
- `FadeIn` mocked as a pass-through wrapper (renders children directly)
- `framer-motion` mocked with pass-through `motion.div` and `AnimatePresence`

For this section, additionally mock `@/lib/knowledge` (the content utilities that read from the filesystem) and `@/components/knowledge/ArticleCard` (the presentational card component from Section 05).

### Content Utility API

The functions used from `lib/knowledge.ts`:

- `getAllArticles(): Article[]` -- Returns all MDX articles from the `content/` directory, sorted by `last_reviewed` descending. Uses module-level caching.
- `getFilteredArticles(articles: Article[], filters: FilterOptions): Article[]` -- Filters articles by `sport`, `age_group`, and/or `pillar` arrays. OR logic within each filter, AND logic between filters. Passing `{ age_group: ['youth'] }` returns all articles where `age_group` includes `'youth'`.

The `Article` type:
```typescript
interface Article {
  frontmatter: ArticleFrontmatter;
  slug: string;
  content: string;
  readingTime: number;
}
```

Where `ArticleFrontmatter` includes `age_group: AgeGroup[]` and `AgeGroup` is `'youth' | 'middle-school' | 'high-school' | 'general'`.
