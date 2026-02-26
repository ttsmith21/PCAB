# Section 04: Knowledge Hub Page

## Overview

This section creates the knowledge hub landing page at `/knowledge`, the knowledge section layout, and supporting UI components: Breadcrumbs, CategoryCard, ReadingTime, TagBadge. This is the main entry point for the knowledge base.

**Dependencies:** Section 02 (content utilities, category metadata), Section 03 (sample content files).

**Blocks:** Section 09 (Search integration into hub page).

---

## Files to Create

| File | Type | Description |
|------|------|-------------|
| `app/knowledge/layout.tsx` | Server Component | Knowledge section layout |
| `app/knowledge/page.tsx` | Server Component | Hub landing page |
| `components/knowledge/Breadcrumbs.tsx` | Server Component | Breadcrumb navigation trail |
| `components/knowledge/CategoryCard.tsx` | Server Component | Category card for hub grid |
| `components/knowledge/ReadingTime.tsx` | Server Component | Reading time badge |
| `components/knowledge/TagBadge.tsx` | Server Component | Pill badge for tags |
| `__tests__/app/knowledge/page.test.tsx` | Test | Hub page tests |
| `__tests__/components/knowledge/Breadcrumbs.test.tsx` | Test | Breadcrumbs tests |
| `__tests__/components/knowledge/CategoryCard.test.tsx` | Test | CategoryCard tests |
| `__tests__/components/knowledge/ReadingTime.test.tsx` | Test | ReadingTime tests |
| `__tests__/components/knowledge/TagBadge.test.tsx` | Test | TagBadge tests |

---

## Tests

### Hub Page Tests (`__tests__/app/knowledge/page.test.tsx`)

Mock content utilities and category metadata. Mock child components as pass-throughs.

```
# Test: hub page renders hero section with "Knowledge" heading
# Test: hub page renders 6 category cards with correct titles
# Test: hub page renders recent articles section
# Test: category cards link to correct /knowledge/[category] URLs
# Test: hub page renders search bar component
```

### Breadcrumbs Tests (`__tests__/components/knowledge/Breadcrumbs.test.tsx`)

```
# Test: renders "Home" link to /
# Test: renders "Knowledge" link to /knowledge
# Test: renders category name with link to /knowledge/[category] when on article page
# Test: renders article title as non-linked current page
# Test: current page segment uses text-pc-dark styling
# Test: separator characters between breadcrumb items
```

### CategoryCard Tests (`__tests__/components/knowledge/CategoryCard.test.tsx`)

```
# Test: renders category title with Oswald font
# Test: renders category description
# Test: renders article count
# Test: renders Lucide icon
# Test: links to correct /knowledge/[category] URL
# Test: has hover lift effect
```

### ReadingTime Tests (`__tests__/components/knowledge/ReadingTime.test.tsx`)

```
# Test: renders reading time in "X min read" format
# Test: uses text-pc-gray color
# Test: renders clock icon
```

### TagBadge Tests (`__tests__/components/knowledge/TagBadge.test.tsx`)

```
# Test: renders tag text in pill badge
# Test: pillar tags use pc-red-light background
# Test: sport tags use gray-100 background
# Test: age_group tags use appropriate distinct background
```

---

## Implementation Details

### Knowledge Layout (`app/knowledge/layout.tsx`)

Minimal wrapper -- passes children through. Individual pages handle their own breadcrumbs.

```typescript
export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

### Breadcrumbs (`components/knowledge/Breadcrumbs.tsx`)

**Props:** `{ items: { label: string; href?: string }[] }`

- `<nav aria-label="Breadcrumb">` wrapper
- All items except last render as `Link` elements
- Last item renders as plain text with `text-pc-dark font-semibold`
- Separators between items (ChevronRight icon or `>`)
- Links use `text-gray-500 hover:text-pc-red`
- Compact: `text-sm`

### CategoryCard (`components/knowledge/CategoryCard.tsx`)

**Props:** `{ slug, label, description, icon, articleCount }`

- Wraps in `Link` to `/knowledge/${slug}`
- Uses existing `Card` component styling (rounded-2xl, shadow-lg, hover lift)
- Lucide icon in circular container with `bg-pc-red/10 text-pc-red`
- Title: `font-oswald text-xl font-bold uppercase`
- Description: `text-gray-600`
- Article count badge

Icon mapping:
```typescript
import { BookOpen, Users, TrendingUp, Heart, FileText, Flag } from "lucide-react";
const iconMap: Record<string, React.ComponentType<any>> = { BookOpen, Users, TrendingUp, Heart, FileText, Flag };
```

### ReadingTime (`components/knowledge/ReadingTime.tsx`)

**Props:** `{ minutes: number }`

- Inline flex with `items-center gap-1`
- Lucide `Clock` icon (w-4 h-4)
- Text: `"{minutes} min read"` in `text-sm text-pc-gray`

### TagBadge (`components/knowledge/TagBadge.tsx`)

**Props:** `{ label: string; type: 'pillar' | 'sport' | 'age_group' }`

- Pill: `inline-block rounded-full px-3 py-1 text-xs font-medium`
- Colors by type:
  - `pillar`: `bg-red-50 text-pc-red`
  - `sport`: `bg-gray-100 text-gray-700`
  - `age_group`: `bg-blue-50 text-blue-700`

### Hub Page (`app/knowledge/page.tsx`)

**Metadata:** `title: "Knowledge"`, description about the knowledge base.

**Structure:**
1. **Hero:** `pt-32 pb-20 bg-pc-dark text-white`, FadeIn-wrapped h1 "Knowledge", subtitle, breadcrumbs
2. **Search placeholder:** Centered area for SearchBar (section-09). Render placeholder div.
3. **Category grid:** `SectionHeading` + `grid md:grid-cols-2 lg:grid-cols-3 gap-8`. Map 6 categories, compute article counts via `getArticlesByCategory(slug).length`, render `CategoryCard` in `FadeIn` with stagger.
4. **Recent articles:** `SectionHeading` + first 3-4 articles from `getAllArticles()`. Simple card previews (title, description, reading time, link). Background `bg-gray-50 py-20`.

---

## Existing Codebase Patterns

- **Hero:** `<section className="relative pt-32 pb-20 text-white overflow-hidden">` with `bg-pc-dark`
- **Sections:** Alternating `bg-white`, `bg-gray-50`, `bg-gray-100` with `py-20`
- **FadeIn stagger:** `<FadeIn delay={index * 0.1}>`
- **Card:** `bg-white rounded-2xl shadow-lg p-8` with hover effect
- **SectionHeading:** Centered titles with optional subtitles
- **Path alias:** `@/*` maps to project root
