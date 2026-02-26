# Section 02: Types, Content Utilities, and Category Metadata

## Overview

This section defines the TypeScript types, Zod validation schema, content utility functions, and category metadata that form the data layer of the knowledge base. All code created here runs exclusively at build time in Server Components. Every downstream section depends on this section.

**Files to create:**
- `lib/knowledge.ts` -- Types, Zod schema, and all content utility functions
- `lib/data/knowledge-categories.ts` -- Category metadata (display names, descriptions, icons)
- `__tests__/lib/knowledge.test.ts` -- Tests for all content utilities
- `__tests__/lib/data/knowledge-categories.test.ts` -- Tests for category metadata

**Dependencies:** Section 01 (packages `gray-matter`, `reading-time`, `zod` must be installed)

---

## Tests -- Write These First

### Test file: `__tests__/lib/knowledge.test.ts`

Mock `fs` with `vi.mock('fs')`. Create inline fixture MDX strings. Reset module-level cache between tests.

**Zod Validation Tests:**

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

Valid frontmatter fixture:

```typescript
const validFrontmatter = {
  title: 'Test Article Title',
  category: 'parents',
  pillar: ['retention', 'multi-sport'],
  sport: ['general'],
  age_group: ['youth'],
  description: 'A short description of the article.',
  last_reviewed: '2025-01-15',
};
```

**`getAllArticles()` Tests:**

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
```

**`getArticlesByCategory()` Tests:**

```
# Test: getArticlesByCategory returns only articles matching given category
# Test: getArticlesByCategory returns empty array for category with no articles
```

**`getArticle()` Tests:**

```
# Test: getArticle returns article for valid category/slug pair
# Test: getArticle returns null for nonexistent slug
# Test: getArticle returns null for nonexistent category
```

**`getRelatedArticles()` Tests:**

```
# Test: getRelatedArticles scores articles by Jaccard similarity on pillar arrays
# Test: getRelatedArticles scores articles by Jaccard similarity on sport arrays
# Test: getRelatedArticles applies +0.2 boost for same category
# Test: getRelatedArticles applies +0.1 boost for shared age_group values
# Test: getRelatedArticles excludes the source article from results
# Test: getRelatedArticles returns top 3 results by default
# Test: getRelatedArticles respects custom limit parameter
# Test: getRelatedArticles returns only articles with score > 0
# Test: getRelatedArticles returns empty array when no articles share tags
```

**`getFilteredArticles()` Tests:**

```
# Test: getFilteredArticles with sport filter returns articles matching any sport (OR logic)
# Test: getFilteredArticles with age_group filter returns articles matching any age group (OR logic)
# Test: getFilteredArticles with pillar filter returns articles matching any pillar (OR logic)
# Test: getFilteredArticles with multiple filter types applies AND logic between filters
# Test: getFilteredArticles with empty/undefined filters returns all articles
# Test: getFilteredArticles returns empty array when no articles match
```

**`extractHeadings()` Tests:**

```
# Test: extractHeadings extracts ## headings with correct level (2)
# Test: extractHeadings extracts ### headings with correct level (3)
# Test: extractHeadings generates slugified id from heading text
# Test: extractHeadings ignores # (h1) headings
# Test: extractHeadings returns empty array for content with no headings
# Test: extractHeadings handles headings with special characters
```

### Test file: `__tests__/lib/data/knowledge-categories.test.ts`

```
# Test: knowledge categories array contains all 6 categories
# Test: each category has slug, label, description, and icon fields
# Test: category slugs match the Category type values
```

---

## Implementation Details

### TypeScript Types

Define in `lib/knowledge.ts`:

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

interface Heading {
  text: string;
  level: number;
  id: string;
}

interface FilterOptions {
  sport?: string[];
  age_group?: AgeGroup[];
  pillar?: Pillar[];
}
```

### Zod Validation Schema

Use `z.enum()` for `Category`, `Pillar`, and `AgeGroup`. Catch `ZodError`, enhance with file path, re-throw.

### Content Utility Functions

**`getAllArticles(): Article[]`** -- Read all MDX files from `content/` using `path.join(process.cwd(), 'content', ...)`. Parse with `gray-matter`, validate with Zod, calculate reading time from `matter(fileContent).content`, derive slug from filename, category from directory. Sort by `last_reviewed` descending. Module-level cache (`let cache: Article[] | null = null`). Expose `_clearCache()` for testing.

**`getArticlesByCategory(category: Category): Article[]`** -- Filter `getAllArticles()` by category.

**`getArticle(category: string, slug: string): Article | null`** -- Read single file directly (does NOT use cache). Return null if not found.

**`getRelatedArticles(article: Article, allArticles: Article[], limit?: number): Article[]`** -- Jaccard similarity on pillar and sport arrays (average). +0.2 boost same category, +0.1 boost shared age_group. Exclude source. Return top `limit` (default 3) with score > 0.

**`getFilteredArticles(articles: Article[], filters: FilterOptions): Article[]`** -- OR within filter, AND between filters. Empty filters return all.

**`extractHeadings(content: string): Heading[]`** -- Regex `/^(#{2,3})\s+(.+)$/gm`. Return `{ text, level, id }` where id is slugified (lowercase, hyphenated, matching rehype-slug output).

### Category Metadata (`lib/data/knowledge-categories.ts`)

```typescript
interface KnowledgeCategory {
  slug: Category;
  label: string;
  description: string;
  icon: string;
}
```

Six categories:

| slug | label | icon |
|------|-------|------|
| `parents` | Parent Guides | `Users` |
| `coaches` | Coaching Resources | `GraduationCap` |
| `development` | Player Development | `TrendingUp` |
| `community` | Community | `Heart` |
| `resources` | Resources | `BookOpen` |
| `pc-way` | The PC Way | `Flag` |

Export `getCategoryBySlug(slug: string): KnowledgeCategory | undefined` helper.

---

## Key Design Decisions

- **Module-level caching:** Build runs in single Node process, `getAllArticles()` called 100+ times. Cache prevents redundant file I/O.
- **Jaccard similarity:** Well-understood set metric. Average of pillar and sport Jaccard scores with category/age boosts.
- **Regex heading extraction:** Sufficient for standard markdown headings, avoids AST parser dependency. Slugification must match rehype-slug.
- **`getArticle()` bypasses cache:** More efficient for single file reads.

---

## Verification

Run `npx vitest run` -- all new tests pass. Content utilities will not find MDX files until Section 03.
