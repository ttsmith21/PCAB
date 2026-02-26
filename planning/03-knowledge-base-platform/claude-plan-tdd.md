# TDD Plan: Knowledge Base Platform

Testing framework: Vitest v4, jsdom, @testing-library/react, @testing-library/jest-dom
Test location: `__tests__/` mirroring source structure
Setup file: `__tests__/setup.ts`
Run command: `vitest run`

---

## 4. Configuration Changes

### MDX Components Map (`lib/mdx-components.tsx`)

```
# Test: mdx components map exports all expected HTML element overrides (h1-h4, p, a, ul, ol, blockquote, table, img, pre/code)
# Test: heading overrides apply Oswald font class and uppercase styling
# Test: paragraph override applies text-gray-600 and leading-relaxed classes
# Test: link override applies pc-red color and hover styling
# Test: blockquote override renders with left border accent
# Test: table override wraps content in responsive container
```

---

## 5. Content Infrastructure

### Frontmatter Types and Zod Validation

```
# Test: valid frontmatter passes Zod schema validation
# Test: missing required field (title) throws ZodError with field path
# Test: invalid category value throws ZodError listing valid options
# Test: invalid pillar value in array throws ZodError
# Test: empty pillar array passes validation (allowed)
# Test: invalid age_group value throws ZodError
# Test: last_reviewed as valid date string passes validation
# Test: error message includes file path for debugging
```

### Content Utility Library (`lib/knowledge.ts`)

```
# Test: getAllArticles reads MDX files from content/ subdirectories
# Test: getAllArticles parses frontmatter correctly with gray-matter
# Test: getAllArticles calculates reading time from content body (not frontmatter)
# Test: getAllArticles derives slug from filename (strips .mdx extension)
# Test: getAllArticles derives category from parent directory name
# Test: getAllArticles sorts results by last_reviewed descending
# Test: getAllArticles returns cached results on subsequent calls (module-level cache)
# Test: getAllArticles validates frontmatter with Zod schema
# Test: getAllArticles throws on invalid frontmatter with descriptive error

# Test: getArticlesByCategory returns only articles matching given category
# Test: getArticlesByCategory returns empty array for category with no articles

# Test: getArticle returns article for valid category/slug pair
# Test: getArticle returns null for nonexistent slug
# Test: getArticle returns null for nonexistent category

# Test: getRelatedArticles scores articles by Jaccard similarity on pillar arrays
# Test: getRelatedArticles scores articles by Jaccard similarity on sport arrays
# Test: getRelatedArticles applies +0.2 boost for same category
# Test: getRelatedArticles applies +0.1 boost for shared age_group values
# Test: getRelatedArticles excludes the source article from results
# Test: getRelatedArticles returns top 3 results by default
# Test: getRelatedArticles respects custom limit parameter
# Test: getRelatedArticles returns only articles with score > 0
# Test: getRelatedArticles returns empty array when no articles share tags

# Test: getFilteredArticles with sport filter returns articles matching any sport (OR logic)
# Test: getFilteredArticles with age_group filter returns articles matching any age group (OR logic)
# Test: getFilteredArticles with pillar filter returns articles matching any pillar (OR logic)
# Test: getFilteredArticles with multiple filter types applies AND logic between filters
# Test: getFilteredArticles with empty/undefined filters returns all articles
# Test: getFilteredArticles returns empty array when no articles match

# Test: extractHeadings extracts ## headings with correct level (2)
# Test: extractHeadings extracts ### headings with correct level (3)
# Test: extractHeadings generates slugified id from heading text
# Test: extractHeadings ignores # (h1) headings
# Test: extractHeadings returns empty array for content with no headings
# Test: extractHeadings handles headings with special characters
```

### Category Metadata (`lib/data/knowledge-categories.ts`)

```
# Test: knowledge categories array contains all 6 categories
# Test: each category has slug, label, description, and icon fields
# Test: category slugs match the Category type values
```

---

## 6. Route Architecture

### Hub Page (`app/knowledge/page.tsx`)

```
# Test: hub page renders hero section with "Knowledge" heading
# Test: hub page renders 6 category cards with correct titles
# Test: hub page renders recent articles section
# Test: category cards link to correct /knowledge/[category] URLs
# Test: hub page renders search bar component
```

### Category Landing Pages (`app/knowledge/[category]/page.tsx`)

```
# Test: category page renders hero with category-specific title and description
# Test: category page renders article cards for articles in that category
# Test: category page renders filter bar component
# Test: category page renders sort toggle (newest, alphabetical)
# Test: category page renders empty state when no articles match filters
# Test: generateStaticParams returns all 6 category slugs
# Test: generateMetadata returns category-appropriate title and description
```

### Article Pages (`app/knowledge/[category]/[slug]/page.tsx`)

```
# Test: article page renders article hero with title, category badge, reading time
# Test: article page renders MDX content area with data-pagefind-body attribute
# Test: article page renders related articles section with 3 articles
# Test: article page renders table of contents when heading count > 5
# Test: article page does not render table of contents when heading count <= 5
# Test: article page renders breadcrumbs (Home > Knowledge > Category > Title)
# Test: generateStaticParams returns { category, slug } for all MDX files
# Test: generateMetadata returns title, description, and OG tags from frontmatter
```

---

## 7. Navigation Changes

### NavLink Interface and Data (`lib/data/nav-links.ts`)

```
# Test: navLinks array includes "Knowledge" entry with href "/knowledge"
# Test: Knowledge nav link has children array with 6 category entries
# Test: each Knowledge child has correct href (/knowledge/[category])
# Test: existing nav links without children still work (backward compatibility)
```

### Navbar Dropdown (`components/layout/Navbar.tsx`)

```
# Test: navbar renders "Knowledge" link
# Test: nav link with children renders dropdown container
# Test: dropdown contains links for all 6 categories
# Test: nav links without children render as direct links (no dropdown)
# Test: parent "Knowledge" link is clickable and navigates to /knowledge
# Test: dropdown uses group-hover CSS pattern (opacity/visibility classes present)
```

### Mobile Menu (`components/layout/MobileMenu.tsx`)

```
# Test: mobile menu renders "Knowledge" link
# Test: Knowledge link navigates to /knowledge and closes menu
# Test: expand chevron reveals category sub-links
# Test: category sub-links are indented
# Test: other nav links still close menu on click (no regression)
```

### Footer (`components/layout/Footer.tsx`)

```
# Test: footer Quick Links includes "Knowledge" link
# Test: Knowledge link in footer navigates to /knowledge (flat, no dropdown)
# Test: footer slice logic correctly includes Knowledge after navLinks update
```

---

## 8. Search Implementation

### SearchBar Component (`components/knowledge/SearchBar.tsx`)

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

---

## 9. New UI Components

### ArticleCard (`components/knowledge/ArticleCard.tsx`)

```
# Test: renders article title with Oswald font styling
# Test: renders article description
# Test: renders reading time badge
# Test: renders category badge
# Test: renders pillar/sport tag badges
# Test: links to correct article URL (/knowledge/[category]/[slug])
# Test: wraps content in FadeIn component
```

### ArticleHero (`components/knowledge/ArticleHero.tsx`)

```
# Test: renders article title in dark hero section
# Test: renders category badge
# Test: renders reading time
# Test: renders pillar, sport, and age_group tags
# Test: follows standard dark hero pattern (bg-pc-dark, pt-32, pb-20)
```

### CategoryCard (`components/knowledge/CategoryCard.tsx`)

```
# Test: renders category title with Oswald font
# Test: renders category description
# Test: renders article count
# Test: renders Lucide icon
# Test: links to correct /knowledge/[category] URL
# Test: has hover lift effect
```

### CategoryFilter (`components/knowledge/CategoryFilter.tsx`)

```
# Test: renders filter controls for sport, age_group, and pillar
# Test: reads initial filter values from URL params on mount (useEffect)
# Test: selecting a filter updates URL query params
# Test: clearing a filter removes it from URL params
# Test: multiple selections within a filter group work (OR logic display)
# Test: "clear all" button resets all filters and URL params
# Test: renders within Suspense boundary without error
```

### TableOfContents (`components/knowledge/TableOfContents.tsx`)

```
# Test: renders list of heading links from headings prop
# Test: does not render when heading count <= 5
# Test: renders when heading count > 5
# Test: heading links have correct href (anchor to heading id)
# Test: heading levels are visually distinguished (h2 vs h3 indentation)
# Test: mobile view renders as collapsible accordion
# Test: desktop view renders as sticky sidebar
```

### Breadcrumbs (`components/knowledge/Breadcrumbs.tsx`)

```
# Test: renders "Home" link to /
# Test: renders "Knowledge" link to /knowledge
# Test: renders category name with link to /knowledge/[category] when on article page
# Test: renders article title as non-linked current page
# Test: current page segment uses text-pc-dark styling
# Test: separator characters between breadcrumb items
```

### ReadingTime (`components/knowledge/ReadingTime.tsx`)

```
# Test: renders reading time in "X min read" format
# Test: uses text-pc-gray color
# Test: renders clock icon
```

### TagBadge (`components/knowledge/TagBadge.tsx`)

```
# Test: renders tag text in pill badge
# Test: pillar tags use pc-red-light background
# Test: sport tags use gray-100 background
# Test: age_group tags use appropriate distinct background
```

### RelatedArticles (`components/knowledge/RelatedArticles.tsx`)

```
# Test: renders 3 ArticleCard components
# Test: renders section heading
# Test: handles empty related articles array gracefully
```

---

## 10. Youth Page Update

```
# Test: youth page renders knowledge base section
# Test: section shows articles filtered by age_group: 'youth'
# Test: section displays 3-4 ArticleCard components
# Test: "See all youth content" button links to /knowledge with age filter
# Test: section follows existing page pattern (SectionHeading, FadeIn)
```

---

## 11. Sample Content

```
# Test: sample MDX files have valid frontmatter (passes Zod validation)
# Test: getAllArticles() successfully reads and parses all sample files
# Test: sample files cover at least 2 different categories
# Test: sample coaching-tips file has 6+ headings (triggers TOC)
# Test: sample files have distinct frontmatter values (tests related articles algorithm)
```

---

## Mocking Strategy

### File System Mocking

All content utility tests mock `fs` module:
```
# Mock fs.readFileSync to return fixture MDX content (frontmatter + body)
# Mock fs.readdirSync to return fixture directory listings
# Mock fs.existsSync for getArticle null-path testing
# Fixture files defined inline in test or as test fixtures in __tests__/fixtures/
```

### Component Mocking (matching existing patterns)

```
# Mock next/link as pass-through anchor element
# Mock next/image as pass-through img element
# Mock framer-motion AnimatePresence and motion.div as pass-throughs
# Mock FadeIn component as pass-through div
# Mock next/navigation (useSearchParams, useRouter, usePathname) for client component tests
# Mock Pagefind dynamic import for SearchBar tests
```
