<!-- PROJECT_CONFIG
runtime: typescript-npm
test_command: npx vitest run
END_PROJECT_CONFIG -->

<!-- SECTION_MANIFEST
section-01-dependencies-config
section-02-types-content-utils
section-03-sample-content
section-04-hub-page
section-05-category-pages
section-06-article-pages
section-07-category-filters
section-08-table-of-contents
section-09-search
section-10-navigation
section-11-youth-page
section-12-polish-validation
END_MANIFEST -->

# Implementation Sections Index

## Dependency Graph

| Section | Depends On | Blocks | Parallelizable |
|---------|------------|--------|----------------|
| section-01-dependencies-config | - | 02 | Yes |
| section-02-types-content-utils | 01 | 03, 04, 05, 06 | No |
| section-03-sample-content | 02 | 04, 05, 06, 07, 08, 09 | No |
| section-04-hub-page | 02, 03 | 09 | Yes |
| section-05-category-pages | 02, 03 | 07 | Yes |
| section-06-article-pages | 02, 03 | 08 | Yes |
| section-07-category-filters | 05 | 12 | Yes |
| section-08-table-of-contents | 06 | 12 | Yes |
| section-09-search | 04 | 12 | Yes |
| section-10-navigation | 01 | 12 | Yes |
| section-11-youth-page | 02, 03 | 12 | Yes |
| section-12-polish-validation | 07, 08, 09, 10, 11 | - | No |

## Execution Order

1. section-01-dependencies-config (no dependencies)
2. section-02-types-content-utils (after 01)
3. section-03-sample-content (after 02)
4. section-04-hub-page, section-05-category-pages, section-06-article-pages, section-10-navigation, section-11-youth-page (parallel after 03)
5. section-07-category-filters, section-08-table-of-contents, section-09-search (parallel after their respective dependencies)
6. section-12-polish-validation (final — after all others)

## Section Summaries

### section-01-dependencies-config
Install production and dev dependencies (`next-mdx-remote`, `gray-matter`, `reading-time`, `remark-gfm`, `rehype-slug`, `zod`, `pagefind`). Create `lib/mdx-components.tsx` with styled component overrides for MDX rendering. Add `postbuild` script to `package.json`. Verify `next build` still works.

**Plan sections:** 3 (New Dependencies), 4 (Configuration Changes)
**TDD sections:** 4 (Configuration Changes)

### section-02-types-content-utils
Define TypeScript types for frontmatter, articles, categories, and filters. Create Zod validation schema. Build `lib/knowledge.ts` with all content utility functions (`getAllArticles`, `getArticlesByCategory`, `getArticle`, `getRelatedArticles`, `getFilteredArticles`, `extractHeadings`) including module-level caching. Create `lib/data/knowledge-categories.ts` with category metadata.

**Plan sections:** 5 (Content Infrastructure)
**TDD sections:** 5 (Content Infrastructure)

### section-03-sample-content
Create 2-3 minimal MDX stub files (`content/parents/sample-parent-guide.mdx`, `content/coaches/sample-coaching-tips.mdx`, `content/pc-way/sample-pc-way.mdx`) with valid frontmatter and content. Verify `getAllArticles()` reads and validates them. These stubs exercise the build pipeline and will be replaced by real content.

**Plan sections:** 11 (Sample Content)
**TDD sections:** 11 (Sample Content)

### section-04-hub-page
Create `app/knowledge/layout.tsx` with breadcrumb navigation. Build the knowledge hub page (`app/knowledge/page.tsx`) with dark hero, search bar placeholder, category grid (6 cards), and recent articles section. Create `Breadcrumbs`, `CategoryCard`, `ReadingTime`, `TagBadge` components.

**Plan sections:** 6 (Route Architecture — Layout, Hub Page), 9 (Breadcrumbs, CategoryCard, ReadingTime, TagBadge)
**TDD sections:** 6 (Hub Page), 9 (CategoryCard, Breadcrumbs, ReadingTime, TagBadge)

### section-05-category-pages
Build category landing pages (`app/knowledge/[category]/page.tsx`) with `generateStaticParams`, category-specific hero, article list grid, sort toggle, and empty state. Create `ArticleCard` presentational component.

**Plan sections:** 6 (Route Architecture — Category Landing Pages), 9 (ArticleCard)
**TDD sections:** 6 (Category Landing Pages), 9 (ArticleCard)

### section-06-article-pages
Build article pages (`app/knowledge/[category]/[slug]/page.tsx`) with `generateStaticParams`, `generateMetadata`, MDXRemote rendering with custom components, article hero, related articles section, `data-pagefind-body` attribute. Create `ArticleHero` and `RelatedArticles` components.

**Plan sections:** 6 (Route Architecture — Article Pages), 9 (ArticleHero, RelatedArticles)
**TDD sections:** 6 (Article Pages), 9 (ArticleHero, RelatedArticles)

### section-07-category-filters
Build `CategoryFilter` client component with `useSearchParams()` URL param sync, `Suspense` boundary, FOUC mitigation (opacity transition), multi-select filter controls for sport/age_group/pillar, clear-all functionality. Integrate into category landing pages.

**Plan sections:** 6 (Category Landing Pages — filter bar detail), 9 (CategoryFilter)
**TDD sections:** 9 (CategoryFilter)

### section-08-table-of-contents
Build `TableOfContents` client component with Intersection Observer for active heading tracking, sticky desktop sidebar, collapsible mobile accordion, threshold-based rendering (>5 headings). Integrate into article pages.

**Plan sections:** 6 (Article Pages — TOC detail), 9 (TableOfContents)
**TDD sections:** 9 (TableOfContents)

### section-09-search
Configure Pagefind `postbuild` script. Add `data-pagefind-body` and `data-pagefind-meta` attributes to article pages. Build `SearchBar` client component with lazy Pagefind loading, debounced search, results dropdown, keyboard navigation, and dev-mode fallback. Integrate into hub page.

**Plan sections:** 8 (Search Implementation), 9 (SearchBar)
**TDD sections:** 8 (Search Implementation), 9 (SearchBar)

### section-10-navigation
Extend `NavLink` interface with optional `children`. Add "Knowledge" entry to `navLinks` array with 6 category children. Update `Navbar.tsx` to render dropdown using existing `group-hover` pattern. Update `MobileMenu.tsx` with expand chevron for category sub-links. Update Footer `slice()` logic.

**Plan sections:** 7 (Navigation Changes)
**TDD sections:** 7 (Navigation Changes)

### section-11-youth-page
Add a knowledge base section to existing `app/youth/page.tsx`. Query articles by `age_group: 'youth'`, display 3-4 `ArticleCard` components, include "See all youth content" button linking to filtered knowledge view. Follow existing page section patterns.

**Plan sections:** 10 (Youth Page Update)
**TDD sections:** 10 (Youth Page Update)

### section-12-polish-validation
Final integration verification: cross-browser testing, mobile responsiveness audit, Lighthouse performance check (>90), verify all existing pages unaffected. Run full test suite. Build verification (`next build` + Pagefind postbuild).

**Plan sections:** 12 (Implementation Sequence — Phase D step 12), 15 (Success Validation)
**TDD sections:** N/A (manual validation)
