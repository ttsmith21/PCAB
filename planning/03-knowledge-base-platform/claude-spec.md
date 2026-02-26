# Knowledge Base Platform — Complete Specification

## Overview

Build a complete `/knowledge` section for the PCAB Next.js 16 site that displays, organizes, and makes searchable 75-100+ articles about youth sports development. This is a new section built from scratch — no MDX infrastructure currently exists in the codebase.

## Technical Foundation

- **Framework:** Next.js 16.1.6 App Router, React 19, TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (configured in `app/globals.css` via `@theme`)
- **Animations:** Framer Motion v12 (exclusively through `FadeIn` wrapper component)
- **Icons:** Lucide React
- **Deployment:** Vercel, static export (`output: "export"`, `images: { unoptimized: true }`)
- **Testing:** Vitest v4 + @testing-library/react + @testing-library/jest-dom
- **Path alias:** `@/*` → repo root

## Design System Constraints

All new components must follow established patterns:

- **Fonts:** Inter (body), Oswald (headings, buttons, nav — uppercase, tracking-wide)
- **Brand colors:** `pc-red` (#CC0033), `pc-dark` (#111111), `pc-red-dark` (#A30B2B), `pc-red-light` (#FEF2F2)
- **Hero sections:** `pt-32 pb-20 bg-pc-dark text-white` with `FadeIn` wrapper
- **Content width:** `container mx-auto px-4` + `max-w-*xl mx-auto`
- **Alternating sections:** `bg-white`, `bg-gray-50`, `bg-gray-100`
- **Cards:** `bg-white rounded-2xl shadow-lg p-8`
- **Buttons:** `font-oswald uppercase tracking-wider rounded-full px-8 py-3`
- **Hover:** `hover:-translate-y-1 transition-all duration-300`
- **Grid stagger:** `FadeIn` with `delay={index * 0.1}`

## Content Infrastructure

### MDX Pipeline

**Package choices:**
- `@next/mdx` + `@mdx-js/loader` + `@mdx-js/react` + `@types/mdx` — MDX rendering
- `gray-matter` — frontmatter parsing for content helpers
- `reading-time` — reading time calculation
- `remark-gfm` — GitHub Flavored Markdown support
- `rehype-slug` — heading IDs for TOC linking

**Configuration changes:**
- `next.config.ts` → `next.config.mjs` (required for `createMDX` import)
- Add `pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx']`
- Wrap config with `withMDX()`
- Create `mdx-components.tsx` at project root (required by App Router)

### Filesystem Organization

```
content/
├── parents/
│   ├── understanding-youth-sports.mdx
│   └── ...
├── coaches/
│   └── ...
├── development/
│   └── ...
├── community/
│   └── ...
├── resources/
│   └── ...
└── pc-way/
    └── ...
```

One category per article (maps to `[category]` route param). Cross-cutting concerns (pillars, sports, age groups) are frontmatter arrays.

### Frontmatter Schema

```typescript
interface ArticleFrontmatter {
  title: string;
  category: 'parents' | 'coaches' | 'development' | 'community' | 'resources' | 'pc-way';
  pillar: Array<'participation-depth' | 'retention' | 'multi-sport' | 'character-development' | 'competitive-trajectory'>;
  sport: string[];              // ['football', 'basketball', 'soccer', 'baseball', 'general', ...]
  age_group: string[];          // ['youth', 'middle-school', 'high-school', 'general']
  description: string;
  last_reviewed: string;        // ISO date string
}
```

### Content Utility Library (`lib/knowledge.ts`)

Functions:
- `getAllArticles(): Article[]` — read all MDX files, parse frontmatter, calculate reading time, sort by date
- `getArticlesByCategory(category: string): Article[]` — filter by category
- `getArticle(category: string, slug: string): Article | null` — single article
- `getRelatedArticles(article: Article, allArticles: Article[], limit?: number): Article[]` — Jaccard similarity on pillars/sports + category boost
- `getFilteredArticles(articles: Article[], filters: FilterOptions): Article[]` — filter by sport, age_group, pillar

## Route Structure

```
app/knowledge/
├── page.tsx                          # /knowledge — hub landing page
├── layout.tsx                        # Knowledge section layout (breadcrumbs)
├── [category]/
│   ├── page.tsx                      # /knowledge/parents, etc. — category landing pages
│   └── [slug]/
│       └── page.tsx                  # /knowledge/parents/understanding-youth-sports
```

All routes use `generateStaticParams` with `dynamicParams = false`.

### Hub Page (`/knowledge`)
- Dark hero section (standard pattern) with "Knowledge" title
- Overview of all 6 categories as clickable cards
- Featured/recent articles section
- Search bar (prominent placement)

### Category Landing Pages (`/knowledge/[category]`)
- Category hero with title and description
- Article list: title, description, reading time, pillars/sport tags
- Filter controls: sport, age group, pillar (multi-select)
- Filters persist as URL query params (`?sport=football&age=youth`)
- Sort options: newest, most relevant
- Responsive grid/list layout

### Article Pages (`/knowledge/[category]/[slug]`)
- Article hero with title, category, reading time
- MDX rendered content with custom components
- Metadata display: category, pillars, sports, age groups
- Table of contents: auto-generated, threshold-based (show when >5 headings), sticky on desktop, collapsible on mobile
- Related articles section (3 articles, Jaccard similarity)
- Back-to-category breadcrumb navigation
- `data-pagefind-body` attribute for search indexing

## Search

**Technology:** Pagefind (post-build WASM indexer)

**Implementation:**
- `postbuild` script: `pagefind --site out --output-path out/pagefind`
- Dynamic import: `await import(/* webpackIgnore: true */ '/pagefind/pagefind.js')`
- `data-pagefind-body` on article content wrapper
- `data-pagefind-ignore` on nav/footer elements
- Dev mode: try/catch with stub (Pagefind only works after build)

**Search UI:**
- Accessible from knowledge hub page (prominent search bar)
- Results show: title, description, category, reading time, excerpt highlight
- Instant results as user types (debounced)
- Keyboard accessible

## Navigation Integration

### Top-Level Nav Item
- Label: **"Knowledge"**
- Links to `/knowledge` hub

### Dropdown
- Extend `NavLink` interface to support optional `children: NavLink[]`
- Update `Navbar.tsx` and `MobileMenu.tsx` to render dropdown
- Dropdown items: Parents, Coaches, Development, Community, Resources, The PC Way

### Breadcrumbs
- Knowledge section layout provides breadcrumbs: Home > Knowledge > [Category] > [Article Title]
- Breadcrumb component in knowledge layout

### Youth Page Update
- Add a new section to existing `/youth` page with curated links to relevant knowledge base articles
- Filter for youth-oriented content (age_group includes 'youth')
- Keep existing /youth content intact

## New UI Components

| Component | Type | Purpose |
|---|---|---|
| `ArticleCard` | Server | Card displaying article title, description, reading time, tags |
| `ArticleLayout` | Server | Layout wrapper for individual articles |
| `CategoryFilter` | Client | Filter controls for sport, age group, pillar with URL param sync |
| `SearchBar` | Client | Pagefind search input with results dropdown |
| `TableOfContents` | Client | Auto-generated from headings, sticky sidebar on desktop |
| `RelatedArticles` | Server | Grid of related article cards |
| `Breadcrumbs` | Server | Breadcrumb navigation for knowledge section |
| `ReadingTime` | Server | Reading time badge display |
| `TagBadge` | Server | Small badge for displaying pillar/sport/age tags |

## Performance & Constraints

- Lighthouse performance score > 90
- Static export — no server-side anything in Phase 2
- MDX files read/parsed at build time only
- Mobile-first (most parents access from phones)
- All existing site functionality unaffected
- Keep accessibility simple — semantic HTML, proper headings, keyboard navigation

## Sample Content

Create minimal MDX stubs (2-3 articles across different categories) to verify the pipeline works. Not realistic content — just enough to test frontmatter parsing, rendering, filtering, search indexing, and related articles.

## Dependencies (from spec)

| Direction | Split | What |
|-----------|-------|------|
| Consumes from | 02 | MDX content files in `/content` directory |
| Defines for | 01 | Frontmatter schema that the pipeline must output |
| Produces for | 04 | Content infrastructure that the chatbot's RAG pipeline builds on |
| Produces for | 05 | Design patterns and navigation structure for pathway tools |

## Success Criteria

1. All content accessible via `/knowledge` section with category landing pages
2. Full-text search returns relevant results across all articles
3. Articles render with consistent layout, reading time, related content suggestions
4. Navigation seamlessly integrates knowledge base with existing site (dropdown)
5. Mobile experience is excellent
6. Lighthouse performance score remains above 90
7. All existing site functionality unaffected
8. Filters persist in URL and are shareable
