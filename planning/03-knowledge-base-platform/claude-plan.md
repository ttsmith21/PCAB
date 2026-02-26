# Implementation Plan: Knowledge Base Platform

## 1. Project Overview

### What We're Building

A complete `/knowledge` section for the PCAB (Port Clinton Athletic Boosters) website — a youth sports community organization in Port Clinton, Ohio. The knowledge base will house 75-100+ articles organized into 6 categories aimed at parents, coaches, and community members involved in youth sports development.

The PCAB site is an existing Next.js 16.1.6 static site deployed on Vercel. It currently has ~12 pages (about, membership, sponsors, initiatives, youth, volunteer, store, resources, news, join, payment) with no content management system. All page content is hardcoded in JSX. This project introduces the first content-presentation separation via MDX files.

### Why This Architecture

The site must remain a static export (`output: "export"`) — no server functions until Phase 3 (AI chatbot). This means all content processing happens at build time, and search must work client-side. MDX was chosen because the content (created in Split 02) needs rich formatting, embedded components, and structured frontmatter metadata for filtering and discovery.

### Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| MDX library | `next-mdx-remote` + `gray-matter` | Compiles MDX strings from `content/` dir at build time in Server Components; gray-matter for frontmatter parsing |
| Search | Pagefind | Zero-config post-build WASM indexer, chunked loading, handles scaling to hundreds of articles |
| Content organization | Category folders | Maps cleanly to `[category]/[slug]` route pattern |
| Navigation | Dropdown with categories | Immediate access to all 6 categories from navbar |
| Filters | URL query params | Shareable, bookmarkable filtered views for parent-to-parent sharing |
| TOC | Auto-generated, threshold-based | Only shown when >5 headings; sticky desktop, collapsible mobile |
| Nav label | "Knowledge" | Clean, matches URL path, clear to parents and coaches |

---

## 2. Existing Codebase Context

### Design System

The site uses a consistent visual language that the knowledge base must follow:

- **Typography:** Inter for body text, Oswald for headings/buttons/nav (always uppercase with tracking). These are defined as `--font-sans` and `--font-oswald` in the Tailwind v4 `@theme` block in `app/globals.css`.
- **Brand colors:** `pc-red` (#CC0033) as primary accent, `pc-dark` (#111111) for dark sections, with lighter variants `pc-red-dark`, `pc-red-light`, `pc-gray`, `pc-gray-light`, `pc-gray-dark`.
- **Page pattern:** Every page opens with a dark hero (`pt-32 pb-20 bg-pc-dark text-white`) followed by alternating light sections (`bg-white`, `bg-gray-50`, `bg-gray-100`). The `pt-32` clears the fixed navbar.
- **Animation:** All scroll-triggered animations go through the `FadeIn` component (Framer Motion). Grid items use staggered delays (`delay={index * 0.1}`). Hover effects are pure Tailwind CSS transitions.
- **Components:** `Card`, `Button`, `SectionHeading`, `FadeIn` are the reusable UI primitives.

### Navigation

Navigation is driven by `lib/data/nav-links.ts` — a flat array of `{ label, href }` objects consumed by both `Navbar.tsx` and `Footer.tsx`. The navbar is fixed-position, transparent at top, frosted white when scrolled. Mobile uses a full-screen hamburger overlay (`MobileMenu.tsx`). The navbar already has a CSS hover dropdown pattern for "Manage Membership" using `group-hover` with opacity/visibility transitions — this pattern should be reused for the Knowledge dropdown. Note: the Footer uses `navLinks.slice(0, 6)` for its "Quick Links" section, so adding "Knowledge" to the navLinks array requires updating this slice logic.

### Testing

Vitest v4 with jsdom, @testing-library/react, @testing-library/jest-dom. Tests live in `__tests__/` mirroring source structure. Common patterns: mock `next/link`, `next/image`, `framer-motion`, and `FadeIn` as pass-throughs.

### Build

Static export via `output: "export"` in `next.config.ts`. No API routes, no server-side rendering. Scripts: `next build` for production, `vitest run` for tests.

---

## 3. New Dependencies

### Production

| Package | Purpose |
|---|---|
| `next-mdx-remote` | Compile and render MDX strings in Server Components |
| `gray-matter` | YAML frontmatter parsing from MDX files |
| `reading-time` | Calculate reading time from content |
| `remark-gfm` | GitHub Flavored Markdown (tables, strikethrough, etc.) |
| `rehype-slug` | Add `id` attributes to headings for TOC anchor links |
| `zod` | Runtime validation of frontmatter schemas at build time |

### Development

| Package | Purpose |
|---|---|
| `pagefind` | Post-build search index generator |

---

## 4. Configuration Changes

### Next.js Config

The existing `next.config.ts` stays as-is (no migration to `.mjs` needed — Next.js 16 supports TypeScript config natively with ESM imports). No webpack MDX loader configuration is needed because `next-mdx-remote` compiles MDX programmatically in Server Components, not via the webpack module graph.

The only config addition: if `pageExtensions` is needed for any reason, add it directly in `next.config.ts`. Preserve existing `output: "export"` and `images: { unoptimized: true }`.

### MDX Components Map

Create `lib/mdx-components.tsx` — a components map object (not the root `mdx-components.tsx` file, which is only needed for `@next/mdx` file-based routing). This map is passed to `next-mdx-remote`'s `MDXRemote` component to override standard HTML elements rendered from MDX content.

Customize:
- Headings (`h1`-`h4`): Apply Oswald font, uppercase, appropriate sizing
- Paragraphs: Apply `text-gray-600 leading-relaxed`
- Links: Apply `text-pc-red hover:text-pc-red-dark` styling
- Lists: Proper spacing and marker styling
- Code blocks: Styled with a subtle background
- Images: Responsive with proper margins
- Blockquotes: Styled with left border accent
- Tables: Responsive container with proper styling

### Build Scripts

Add a `postbuild` script to `package.json` that runs Pagefind after the Next.js build:

```
"postbuild": "pagefind --site out --output-path out/pagefind"
```

This generates the search index from the static HTML output.

---

## 5. Content Infrastructure

### Directory Structure

```
content/
├── parents/
│   └── *.mdx
├── coaches/
│   └── *.mdx
├── development/
│   └── *.mdx
├── community/
│   └── *.mdx
├── resources/
│   └── *.mdx
└── pc-way/
    └── *.mdx
```

Each MDX file has YAML frontmatter at the top followed by MDX content.

### Frontmatter Types

```typescript
type Category = 'parents' | 'coaches' | 'development' | 'community' | 'resources' | 'pc-way';
type Pillar = 'participation-depth' | 'retention' | 'multi-sport' | 'character-development' | 'competitive-trajectory';
type AgeGroup = 'youth' | 'middle-school' | 'high-school' | 'general';

interface ArticleFrontmatter {
  title: string;
  category: Category;
  pillar: Pillar[];
  sport: string[];
  age_group: AgeGroup[];
  description: string;
  last_reviewed: string;
}

interface Article {
  frontmatter: ArticleFrontmatter;
  slug: string;
  content: string;
  readingTime: number;
}
```

### Frontmatter Validation

Define a Zod schema matching `ArticleFrontmatter` in `lib/knowledge.ts`. Every MDX file's frontmatter is validated at build time — invalid frontmatter causes the build to fail with a descriptive error including the file path and which field failed. This catches authoring errors early, especially important with 75-100+ articles from different sources.

### Content Utility Library

Create `lib/knowledge.ts` with these functions:

```typescript
function getAllArticles(): Article[]
/**
 * Read all MDX files from content/ directory using path.join(process.cwd(), 'content', ...).
 * For each file: parse frontmatter with gray-matter, validate with Zod schema,
 * calculate reading time from matter(fileContent).content (NOT raw file — avoids
 * counting frontmatter YAML in the reading time), derive slug from filename
 * (strip .mdx), derive category from parent directory name.
 * Sort by last_reviewed descending.
 *
 * Uses module-level cache (let cache: Article[] | null = null) to avoid
 * redundant file I/O during build — the build runs in a single Node process,
 * so getAllArticles() may be called 100+ times (once per article page for
 * related articles) and caching prevents re-reading all files each time.
 */

function getArticlesByCategory(category: Category): Article[]
/** Filter getAllArticles() by category. */

function getArticle(category: string, slug: string): Article | null
/** Read single file at content/{category}/{slug}.mdx. Return null if not found. */

function getRelatedArticles(article: Article, allArticles: Article[], limit?: number): Article[]
/**
 * Score each candidate article using Jaccard similarity across
 * pillar and sport arrays. Apply a +0.2 boost for same category,
 * +0.1 boost for shared age_group values. Exclude the source article.
 * Return top `limit` (default 3) results with score > 0.
 */

function getFilteredArticles(articles: Article[], filters: FilterOptions): Article[]
/**
 * Apply sport, age_group, and pillar filters (all optional).
 * Each filter is an array — article matches if it has at least one
 * overlapping value with the filter array (OR logic within a filter,
 * AND logic between filters).
 */

function extractHeadings(content: string): Heading[]
/**
 * Extract headings from raw MDX content using regex matching for
 * lines starting with ## or ### patterns. Returns array of
 * { text, level, id } objects where id is the slugified heading text
 * (matching what rehype-slug generates). Used to pass heading data
 * to the TableOfContents component as props.
 */
```

All functions run at build time only (Server Components). They use `fs.readFileSync` and `path.join(process.cwd(), ...)` — safe because static export processes everything at build.

### Category Metadata

Create `lib/data/knowledge-categories.ts` with display names, descriptions, icons, and URL slugs for each category. This drives the hub page cards, category page heroes, breadcrumbs, and the navbar dropdown.

```typescript
interface KnowledgeCategory {
  slug: Category;
  label: string;
  description: string;
  icon: string; // Lucide icon name
}
```

---

## 6. Route Architecture

### File Structure

```
app/knowledge/
├── layout.tsx                        # Knowledge section layout
├── page.tsx                          # Hub landing page
└── [category]/
    ├── page.tsx                      # Category landing page
    └── [slug]/
        └── page.tsx                  # Article page
```

### Knowledge Layout (`app/knowledge/layout.tsx`)

A thin wrapper that adds breadcrumb navigation to all knowledge pages. It does NOT replace the root layout — it nests inside it (Navbar + Footer remain). Children render below the breadcrumbs.

### Hub Page (`/knowledge`)

**Hero:** Standard dark hero with "Knowledge" title and subtitle about the knowledge base purpose.

**Search section:** Prominent search bar centered below the hero. The search component lazy-loads Pagefind on first interaction.

**Category grid:** 6 cards, one per category, each showing the category icon, title, description, and article count. Cards use the existing `Card` component style with `FadeIn` stagger animation. Cards link to `/knowledge/[category]`.

**Recent articles:** A small section showing 3-4 most recently reviewed articles across all categories.

**Static params:** None needed — this is a static page.

### Category Landing Pages (`/knowledge/[category]`)

**Static params:** `generateStaticParams` returns the 6 known category slugs.

**Hero:** Category-specific title and description (from category metadata).

**Filter bar:** Client component wrapped in a `<Suspense>` boundary (required for `useSearchParams()` with static export). Dropdowns/chips for sport, age_group, and pillar. Filters sync to URL query params via `useSearchParams()` and `useRouter().replace()`. When filters change, the URL updates without a navigation (shallow update). The filter component reads initial values from the URL in `useEffect` (not during render) to avoid hydration mismatch.

**Article list:** The Server Component renders ALL articles in the grid (for SEO and initial paint). The client-side `CategoryFilter` wrapper applies filtering after hydration. To prevent flash of unfiltered content (FOUC) when URL params are present: the article grid wrapper starts with CSS `opacity-0` and transitions to `opacity-100` once client-side filtering is applied. This creates a smooth reveal rather than a jarring flash. `FadeIn` stagger animation on each card.

**Sort:** Toggle between "Newest" (by `last_reviewed`) and alphabetical.

**Empty state:** If filters produce zero results, show a friendly message with a button to clear filters.

### Article Pages (`/knowledge/[category]/[slug]`)

**Static params:** `generateStaticParams` returns `{ category, slug }` for every MDX file discovered.

**Metadata:** `generateMetadata` returns title, description, and Open Graph tags derived from frontmatter.

**Layout structure:**
- Article hero: title, category badge, reading time, pillar/sport/age tags
- Two-column on desktop: main content (left, wider) + sidebar (right)
- Single-column on mobile: TOC collapsible at top, content, then related articles

**Main content area:**
- Use `next-mdx-remote`'s `MDXRemote` component to compile and render the MDX content string (from `getArticle().content`) at build time in the Server Component
- Pass the custom components map from `lib/mdx-components.tsx` and remark/rehype plugins (`remark-gfm`, `rehype-slug`)
- Wrap with `data-pagefind-body` for search indexing

**Table of contents (sidebar on desktop):**
- Generated from headings extracted via `extractHeadings()` utility (regex-based, passed as props)
- Only displayed when the article has more than 5 headings
- Desktop: sticky sidebar that scrolls with the page, highlights active section
- Mobile: collapsible accordion at the top of the article
- This is a Client Component (needs scroll observer for active heading tracking)

**Related articles section:**
- Below the main content
- 3 related articles displayed as `ArticleCard` components
- Computed at build time using the Jaccard similarity algorithm

**Back navigation:**
- Breadcrumbs in the knowledge layout handle this: Home > Knowledge > [Category] > [Article Title]

---

## 7. Navigation Changes

### NavLink Interface Extension

The current `NavLink` interface in `lib/data/nav-links.ts` is `{ label, href }`. Extend it to support an optional `children` array:

```typescript
interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}
```

Add a "Knowledge" entry to the `navLinks` array with children for each of the 6 categories. Position it prominently (e.g., as the 3rd or 4th item). Note: the Footer uses `navLinks.slice(0, 6)` for "Quick Links" — when adding "Knowledge", update this slice logic to ensure the correct links appear in the footer (either increase the slice count or explicitly include/exclude items).

### Navbar Dropdown

The navbar already has a CSS hover dropdown pattern for "Manage Membership" using `group` + `group-hover:opacity-100 group-hover:visible`. Reuse this same pattern for the Knowledge dropdown to maintain consistency.

Update `Navbar.tsx` to detect when a nav link has `children` and render a dropdown using the existing `group-hover` pattern. The parent item ("Knowledge") should still be clickable and link to `/knowledge`.

**Desktop dropdown:**
- Uses the existing `group-hover` CSS pattern (opacity + visibility transition)
- Absolute positioned below the nav link
- Styled consistent with the frosted/white navbar background
- Items are the 6 category links

**Mobile:**
- In `MobileMenu.tsx`, "Knowledge" appears as a direct link to `/knowledge` (consistent with other items — all links close the menu on tap). Additionally, show an expand chevron that reveals category sub-links as indented items below. This preserves the existing mobile interaction pattern (tap link = navigate + close menu) while adding category discoverability.

### Footer Update

The footer uses the same `navLinks` array. Update the Footer "Quick Links" `slice()` logic to accommodate the new "Knowledge" entry. "Knowledge" should appear as a flat link (no dropdown in footer — just links to `/knowledge`).

---

## 8. Search Implementation

### Pagefind Integration

**Build pipeline:**
1. `next build` generates static HTML in `out/`
2. `postbuild` script runs `pagefind --site out --output-path out/pagefind`
3. Pagefind crawls the HTML, identifies content within `data-pagefind-body` elements, and generates a chunked WASM index in `out/pagefind/`

**Content targeting:**
- Add `data-pagefind-body` to the article content wrapper in article pages
- Add `data-pagefind-ignore` to navigation, footer, sidebar, and any non-content elements that shouldn't be indexed

**Pagefind metadata:**
- Use `data-pagefind-meta` attributes to surface structured data in search results: title, description, category, reading time

### SearchBar Component

A Client Component that:
1. Lazy-loads the Pagefind library on first focus/click of the search input
2. Uses `pagefind.debouncedSearch()` for instant results
3. Displays results in a dropdown below the input with: title, description excerpt (with highlighting), category badge, reading time
4. Supports keyboard navigation (arrow keys, Enter to select)
5. Wraps the Pagefind import in try/catch with a graceful fallback for dev mode (where Pagefind index doesn't exist)

The search bar appears on:
- The knowledge hub page (large, centered, prominent)
- Optionally in the knowledge section breadcrumb bar (smaller inline version)

---

## 9. New UI Components

### Components Directory

```
components/knowledge/
├── ArticleCard.tsx
├── ArticleHero.tsx
├── CategoryCard.tsx
├── CategoryFilter.tsx
├── SearchBar.tsx
├── TableOfContents.tsx
├── RelatedArticles.tsx
├── Breadcrumbs.tsx
├── ReadingTime.tsx
└── TagBadge.tsx
```

### Component Details

**ArticleCard (Presentational Component — no `"use client"` directive)**
Displays an article preview in a card layout: title (Oswald, uppercase), description (Inter, gray-600), reading time badge, category badge, and 2-3 tag badges for pillars/sports. Uses the existing Card styling pattern. Wraps in `FadeIn` for animation. Links to the article page. Has no hooks or state — can be rendered by both Server Components (hub page, related articles) and Client Component parents (category filter wrapper).

**ArticleHero (Server Component)**
The hero section for individual article pages. Renders the article title, category badge, reading time, and metadata tags in the standard dark hero pattern.

**CategoryCard (Server Component)**
A card for the hub page showing a category: icon (Lucide), title (Oswald), description, article count. Uses the existing Card styling with hover lift effect.

**CategoryFilter (Client Component)**
Multi-select filter controls for sport, age_group, and pillar. Renders as a horizontal bar of filter groups with dropdown/chip selectors. Must be wrapped in a `<Suspense>` boundary on the category page. Syncs state bidirectionally with URL query params using `useSearchParams()` — reads params only in `useEffect` (not during render) to avoid hydration mismatch with static export. Receives all articles as props and applies client-side filtering, controlling visibility of the article grid.

**SearchBar (Client Component)**
Pagefind search input. Lazy-loads Pagefind on first interaction. Debounced search with results dropdown. Described in detail in Section 8.

**TableOfContents (Client Component)**
Extracts headings from the article content at build time (passed as props). Renders a list of heading links. On desktop: sticky sidebar (`position: sticky; top: ...`). On mobile: collapsible accordion at the top. Uses Intersection Observer to highlight the active section as the user scrolls. Only renders when heading count exceeds threshold (5).

**RelatedArticles (Server Component)**
Grid of 3 `ArticleCard` components showing related articles. Receives the pre-computed related articles as props.

**Breadcrumbs (Server Component)**
Renders the breadcrumb trail: Home > Knowledge > [Category] > [Article Title]. Uses the route segments and category metadata to build the trail. Styled with `text-pc-gray` with the current page segment in `text-pc-dark`.

**ReadingTime (Server Component)**
Small badge displaying "X min read". Uses the `text-pc-gray` color with a clock icon from Lucide.

**TagBadge (Server Component)**
Small pill badge for displaying pillar, sport, or age group tags. Different subtle background colors per tag type (e.g., pillars in pc-red-light, sports in gray-100).

---

## 10. Youth Page Update

Add a new section to the existing `app/youth/page.tsx` that links into the knowledge base. This section should:

1. Query for articles where `age_group` includes `'youth'` using the content utility library
2. Display 3-4 featured articles as `ArticleCard` components
3. Include a "See all youth content" button linking to `/knowledge?age=youth` (or similar filtered view)
4. Follow the existing page section pattern (alternating background, `FadeIn`, `SectionHeading`)
5. Place this section logically within the existing youth page content (near the bottom, before the CTA)

---

## 11. Sample Content

Create 2-3 minimal MDX stub files to verify the entire pipeline:

1. `content/parents/sample-parent-guide.mdx` — A short article with all frontmatter fields filled, 2-3 headings, basic paragraph content. Category: parents, multiple pillars, sport: general, age_group: youth.

2. `content/coaches/sample-coaching-tips.mdx` — A longer article (enough to trigger TOC, so 6+ headings). Category: coaches, different pillar/sport combinations to test filtering.

3. `content/pc-way/sample-pc-way.mdx` — A brief article to verify the pc-way category works. Different frontmatter values from the other two to test related articles algorithm.

These stubs exist only to exercise the build pipeline, routing, filtering, search indexing, and related articles. They will be replaced by real content from Split 02.

---

## 12. Implementation Sequence

This is the recommended build order, where each step builds on the previous:

### Phase A: Foundation
1. **Install dependencies and config** — Install `next-mdx-remote`, `gray-matter`, `reading-time`, `remark-gfm`, `rehype-slug`, `zod`, `pagefind`. No `next.config.ts` changes needed (MDX compilation is programmatic via `next-mdx-remote`, not webpack-based). Create `lib/mdx-components.tsx` with styled component overrides. Verify `next build` still works.
2. **Types and content utilities** — Define frontmatter types and Zod validation schema. Build `lib/knowledge.ts` with all content functions (including `extractHeadings()` and module-level caching for `getAllArticles()`). Create category metadata in `lib/data/knowledge-categories.ts`.
3. **Sample content** — Create the 2-3 stub MDX files. Verify `getAllArticles()` reads and validates them correctly.

### Phase B: Core Pages
4. **Knowledge layout and hub page** — Create `app/knowledge/layout.tsx` with breadcrumbs. Build the hub page with category cards and recent articles.
5. **Category landing pages** — Build `[category]/page.tsx` with article list, sort controls. Create `ArticleCard`, `CategoryCard`, `TagBadge`, `ReadingTime` components.
6. **Article pages** — Build `[category]/[slug]/page.tsx` with `MDXRemote` rendering (passing content string, components map, and remark/rehype plugins), article hero, related articles. Create `ArticleHero`, `RelatedArticles` components.

### Phase C: Interactive Features
7. **Category filters** — Build `CategoryFilter` client component with URL param sync. Integrate into category landing pages.
8. **Table of contents** — Build `TableOfContents` client component with scroll tracking. Integrate into article pages.
9. **Search** — Install Pagefind, add postbuild script, add data-pagefind attributes, build `SearchBar` component. Integrate into hub page.

### Phase D: Navigation & Integration
10. **Navbar dropdown** — Extend `NavLink` interface with optional `children`. Reuse existing `group-hover` dropdown pattern in `Navbar.tsx`. Update `MobileMenu.tsx` with expand chevron for category sub-links. Update Footer `slice()` logic.
11. **Youth page update** — Add knowledge base links section to `/youth`.
12. **Final polish** — Cross-browser testing, mobile responsiveness, Lighthouse audit, verify all existing pages unaffected.

---

## 13. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Pagefind WASM import fails in production | Medium | Test full build + postbuild locally; verify import path matches Vercel output structure |
| Pagefind unavailable in `next dev` | Low | Try/catch wrapper with dev-mode stub showing "Search available after build" |
| `next-mdx-remote` compilation fails for specific MDX syntax | Medium | Test with sample content immediately; ensure remark-gfm and rehype-slug plugins are passed correctly |
| Static export with dynamic MDX imports | Medium | Use `generateStaticParams` with `dynamicParams = false`; test that all articles resolve at build time |
| Dropdown nav breaks existing mobile menu | Medium | Test mobile menu thoroughly after NavLink extension; ensure backward compatibility for links without children |
| URL query param filters cause FOUC | Medium | Wrap `CategoryFilter` in `<Suspense>`, read params in `useEffect`, use opacity transition to reveal filtered grid |
| Footer `slice(0, 6)` breaks when navLinks grows | Low | Update slice logic explicitly when adding "Knowledge" to navLinks |
| Invalid MDX frontmatter in authored content | Medium | Zod schema validation at build time with descriptive error messages including file path |
| Build time scaling with 100+ articles | Low | Module-level cache on `getAllArticles()` prevents redundant file I/O across build invocations |

---

## 14. Testing Strategy

The existing codebase has comprehensive tests (Vitest v4, jsdom, @testing-library/react). All new code should follow the same patterns and conventions found in `__tests__/`.

### Unit Tests — Content Utilities (`lib/knowledge.ts`)

- `getAllArticles()`: Mock `fs.readFileSync` and `fs.readdirSync` to return fixture MDX content. Verify frontmatter parsing, reading time calculation, sorting, and caching behavior.
- `getArticlesByCategory()`: Verify filtering by category.
- `getRelatedArticles()`: Test Jaccard similarity scoring with known inputs — verify same-category boost, shared pillar/sport scoring, correct ranking and limit.
- `getFilteredArticles()`: Test OR logic within filters, AND logic between filters, empty filters return all, no-match returns empty.
- `extractHeadings()`: Test heading extraction from MDX content strings with various heading levels.
- **Zod validation:** Test that invalid frontmatter throws descriptive errors.

### Component Tests

- **ArticleCard:** Renders title, description, reading time, tag badges. Links to correct article URL.
- **CategoryFilter:** Reads URL params on mount, updates URL on filter change, shows correct active filter state. Mock `useSearchParams` and `useRouter`.
- **Breadcrumbs:** Renders correct trail for hub, category, and article depths.
- **TableOfContents:** Renders heading links, conditionally renders based on heading count threshold.
- **SearchBar:** Renders input, handles Pagefind unavailability gracefully (dev mode fallback).

### Navigation Tests

- **Navbar:** Update existing `Navbar.test.tsx` to test dropdown rendering for nav links with `children`. Verify backward compatibility for links without children. Test hover interaction.
- **MobileMenu:** Test expand/collapse behavior for Knowledge sub-links. Verify other links still close menu on click.
- **Footer:** Verify "Knowledge" appears in Quick Links after navLinks update.

### Mocking Strategy

- Mock `fs` module for all content utility tests (content files are read from disk at build time, not available in test environment)
- Mock `next/link`, `next/image`, `framer-motion`, `FadeIn` as pass-throughs (matching existing test patterns)
- Pagefind is explicitly excluded from unit tests — search functionality verified via manual integration testing after `next build`

---

## 15. Success Validation

After implementation, verify:

1. **All category pages render** — Visit each of the 6 `/knowledge/[category]` URLs
2. **Articles render with full layout** — Title, reading time, tags, TOC (if enough headings), related articles, breadcrumbs
3. **Filters work and persist** — Select filters, verify URL updates, refresh page, verify filters restore
4. **Search returns results** — After `next build && postbuild`, search for article content
5. **Dropdown navigation works** — Desktop hover, mobile expand, "Knowledge" link goes to hub
6. **Youth page shows knowledge links** — New section appears with relevant articles
7. **Mobile is excellent** — Test on mobile viewport: all layouts responsive, TOC collapses, filters usable
8. **Lighthouse > 90** — Run audit on hub, a category page, and an article page
9. **Existing pages unaffected** — Spot-check homepage, about, membership, etc.
10. **Build succeeds** — `next build` completes without errors, `postbuild` generates Pagefind index
