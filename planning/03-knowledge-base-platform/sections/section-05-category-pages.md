# Section 05: Category Pages

## Overview

This section builds category landing pages at `/knowledge/[category]` and the `ArticleCard` component. Each page uses `generateStaticParams` for all 6 categories, displays a category-specific hero, article grid, sort toggle, and empty state.

**Dependencies:** Section 01 (dependencies), Section 02 (types, content utils, category metadata), Section 03 (sample content).

**Blocks:** Section 07 (category filters integrate into these pages).

---

## Files to Create

| File | Description |
|------|-------------|
| `components/knowledge/ArticleCard.tsx` | Presentational card for article previews |
| `app/knowledge/[category]/page.tsx` | Category landing page with static generation |
| `__tests__/components/knowledge/ArticleCard.test.tsx` | ArticleCard tests |
| `__tests__/app/knowledge/category-page.test.tsx` | Category page tests |

---

## Tests

### ArticleCard Tests (`__tests__/components/knowledge/ArticleCard.test.tsx`)

```
# Test: renders article title with Oswald font styling
# Test: renders article description
# Test: renders reading time badge
# Test: renders category badge
# Test: renders pillar/sport tag badges
# Test: links to correct article URL (/knowledge/[category]/[slug])
# Test: wraps content in FadeIn component
```

Use fixture `Article` object. Mock `next/link`, `next/image`, `FadeIn` as pass-throughs.

### Category Page Tests (`__tests__/app/knowledge/category-page.test.tsx`)

Mock `lib/knowledge.ts` functions and category metadata. Mock child components.

```
# Test: category page renders hero with category-specific title and description
# Test: category page renders article cards for articles in that category
# Test: category page renders filter bar component
# Test: category page renders sort toggle (newest, alphabetical)
# Test: category page renders empty state when no articles match filters
# Test: generateStaticParams returns all 6 category slugs
# Test: generateMetadata returns category-appropriate title and description
```

---

## Implementation

### ArticleCard (`components/knowledge/ArticleCard.tsx`)

**Presentational Component -- no `"use client"` directive.** Can be rendered by both Server Components and Client Component parents.

**Props:** `{ article: Article; delay?: number }`

Structure:
- `FadeIn` wrapper with optional delay
- `Link` to `/knowledge/${article.frontmatter.category}/${article.slug}`
- Card styling: `bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`
- Title: `font-oswald text-xl font-bold uppercase tracking-wide`
- Description: `text-gray-600 leading-relaxed text-sm line-clamp-3`
- Bottom row: ReadingTime badge, category badge, TagBadge pills (limit to 2-3 visible)

### Category Landing Page (`app/knowledge/[category]/page.tsx`)

**Static generation:**

```typescript
export async function generateStaticParams() {
  return knowledgeCategories.map((cat) => ({ category: cat.slug }));
}
```

**Metadata (Next.js 16 -- params is Promise):**

```typescript
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryMeta = knowledgeCategories.find((c) => c.slug === category);
  return {
    title: categoryMeta?.label ?? "Knowledge",
    description: categoryMeta?.description ?? "Browse knowledge base articles.",
  };
}
```

**Page structure:**

1. **Category hero:** `pt-32 pb-20 bg-pc-dark text-white` with category label as h1, description as subtitle. FadeIn.
2. **Filter bar placeholder:** `<Suspense>` boundary wrapping a placeholder div for CategoryFilter (section-07).
3. **Sort toggle:** Default to "Newest" order (as returned by `getArticlesByCategory`). Defer full sort UI to section-07.
4. **Article grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8` of `ArticleCard` with stagger animation. Grid wrapper has `id="article-grid"` for FOUC prep.
5. **Empty state:** Friendly message when no articles exist.

**FOUC preparation:** The article grid wrapper renders normally now. Section-07 will add opacity transition.
