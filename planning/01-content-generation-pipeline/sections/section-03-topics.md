# Section 03: Topic Management and Content Matrix

## Overview

This section implements the topic management system and content matrix. It covers:

1. **Topic definition YAML schema** -- structure for defining articles in `data/topics/*.yaml`
2. **Topic loader** -- reads, validates, and filters topic definitions from YAML files
3. **Topic-specific types** -- TypeScript interfaces, constants, and slug regex
4. **Content matrix** -- tracks coverage across category x audience x difficulty; identifies gaps; suggests next topics
5. **Sample topic YAML files** -- one per category with realistic topic entries

## Dependencies

- **section-01-setup**: Shared schema, pipeline types, `js-yaml` and `zod` installed, directory structure.

**Blocks:** section-07-orchestration.

## Files to Create

| File | Purpose |
|------|---------|
| `scripts/content-pipeline/topics/topic-types.ts` | Topic-specific types, constants, slug regex |
| `scripts/content-pipeline/topics/topic-loader.ts` | Loads and validates topic YAML files, filtering |
| `scripts/content-pipeline/topics/content-matrix.ts` | Coverage tracking, gap analysis, suggestions, reporting |
| `data/topics/coaching.yaml` | Coaching topic definitions (5 topics) |
| `data/topics/parenting.yaml` | Parenting topic definitions (4 topics) |
| `data/topics/development.yaml` | Development topic definitions (3 topics) |
| `data/topics/community.yaml` | Community topic definitions (3 topics) |
| `data/topics/resources.yaml` | Resources topic definitions (3 topics) |
| `data/topics/pc-way.yaml` | PC Way topic definitions (3 topics) |
| `__tests__/scripts/content-pipeline/topics/topic-loader.test.ts` | Topic loader unit tests |
| `__tests__/scripts/content-pipeline/topics/content-matrix.test.ts` | Content matrix unit tests |

## Tests (Write First)

### `__tests__/scripts/content-pipeline/topics/topic-loader.test.ts`

```ts
// Test: loadTopics reads all YAML files from topics directory
// Test: loadTopics returns flat array of TopicDefinition objects
// Test: loadTopics validates required fields (slug, title, category)
// Test: loadTopics rejects topic with invalid slug (contains spaces)
// Test: loadTopics rejects topic with invalid slug (contains uppercase)
// Test: loadTopics rejects topic with invalid slug (contains special chars)
// Test: loadTopics accepts valid slug (lowercase alphanumeric with hyphens)
// Test: loadTopics validates category against enum values
// Test: loadTopics handles empty YAML file gracefully
// Test: loadTopics handles malformed YAML (syntax error) with clear error
// Test: loadTopics handles optional outline_notes field (present and absent)

// Test: filterTopics by category returns only matching topics
// Test: filterTopics by audience returns topics containing that audience
// Test: filterTopics by difficulty returns only matching topics
```

### `__tests__/scripts/content-pipeline/topics/content-matrix.test.ts`

```ts
// Test: buildMatrix creates correct dimensions (category x audience x difficulty)
// Test: buildMatrix counts defined topics per cell
// Test: buildMatrix counts existing articles per cell (from MDX frontmatter)
// Test: buildMatrix handles empty topic list
// Test: buildMatrix handles empty article directory
// Test: buildMatrix handles topics with multiple audiences (counted in each cell)

// Test: identifyGaps returns cells where actual < target
// Test: identifyGaps returns empty array when all cells are covered

// Test: suggestNext returns topics from most underserved cells first
// Test: suggestNext respects count parameter

// Test: generateReport includes planned vs actual counts per cell
// Test: generateReport includes difficulty distribution analysis
```

## Implementation Details

### Topic Types (`scripts/content-pipeline/topics/topic-types.ts`)

```ts
export const TOPIC_CATEGORIES = ["coaching", "parenting", "development", "community", "resources", "pc-way"] as const;
export type TopicCategory = (typeof TOPIC_CATEGORIES)[number];

export const TOPIC_AUDIENCES = ["parents", "coaches", "volunteers", "youth-leaders", "athletes"] as const;
export type TopicAudience = (typeof TOPIC_AUDIENCES)[number];

export const TOPIC_DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export type TopicDifficulty = (typeof TOPIC_DIFFICULTIES)[number];

export const SLUG_REGEX = /^[a-z0-9-]+$/;

export const TARGET_DIFFICULTY_DISTRIBUTION = { beginner: 0.4, intermediate: 0.4, advanced: 0.2 } as const;

export interface MatrixCell {
  category: TopicCategory;
  audience: TopicAudience;
  difficulty: TopicDifficulty;
  target: number;
  actual: number;
  gap: number;
  topicSlugs: string[];
  existingSlugs: string[];
}

export interface ContentMatrix {
  cells: MatrixCell[];
  totalTopics: number;
  totalArticles: number;
}

export interface TopicFilter {
  category?: TopicCategory;
  audience?: TopicAudience;
  difficulty?: TopicDifficulty;
}
```

### Topic Loader (`scripts/content-pipeline/topics/topic-loader.ts`)

**Exported functions:**

```ts
export function loadTopics(topicsDir?: string): TopicDefinition[];
export function filterTopics(topics: TopicDefinition[], filter: TopicFilter): TopicDefinition[];
export function getTopicBySlug(slug: string, topicsDir?: string): TopicDefinition | undefined;
```

**Key responsibilities:**
1. Read all `*.yaml` files from `data/topics/` using `fs.readdirSync`. Use `path.join()` for Windows compatibility.
2. Parse with `js-yaml`'s `load()`. Each file contains a YAML array.
3. Validate each topic: slug matches `/^[a-z0-9-]+$/`, required fields present, category in enum.
4. Error messages include filename and topic slug for debugging.
5. Empty files treated as zero topics (not an error).
6. Malformed YAML re-thrown with filename in message.

### Content Matrix (`scripts/content-pipeline/topics/content-matrix.ts`)

**Exported functions:**

```ts
export function buildMatrix(topics: TopicDefinition[], articlesDir?: string): ContentMatrix;
export function identifyGaps(matrix: ContentMatrix): MatrixCell[];
export function suggestNext(matrix: ContentMatrix, topics: TopicDefinition[], count: number): TopicDefinition[];
export function generateReport(matrix: ContentMatrix): string;
```

**Existing article detection:** Scan `content/articles/` for `.mdx` files, parse frontmatter with `gray-matter`, extract category/audience/difficulty. Each audience value creates a separate cell entry.

**Gap logic:** Target = count of defined YAML topics per cell. Actual = count of existing MDX files. Gap = target - actual.

**Difficulty distribution:** Report compares actual distribution against 40/40/20 target.

### Sample Topic YAML Files

Six files in `data/topics/` with realistic topics:
- `coaching.yaml` (5 topics): team culture, age-appropriate training, playing time, practice planning, diverse skill levels
- `parenting.yaml` (4 topics): supporting athletes, sideline behavior, when kids want to quit, multi-sport benefits
- `development.yaml` (3 topics): LTAD intro, physical literacy, growth mindset
- `community.yaml` (3 topics): volunteer coaching, fundraising, inclusive programs
- `resources.yaml` (3 topics): concussion awareness, sports nutrition, heat safety
- `pc-way.yaml` (3 topics): philosophy overview, character-first, process over outcomes

## Key Design Decisions

1. **Slug regex enforced at load time** -- security measure (prevents command injection in git publisher).
2. **Multiple audiences = multiple matrix cells** -- reflects coverage goal across all audience segments.
3. **Content matrix scans `content/articles/` with `gray-matter`** -- accurate even with manually added articles.
4. **YAML files in `data/topics/`** (not `content/`) -- prevents Velite from parsing them.
5. **`topicsDir`/`articlesDir` parameters** -- exist for testability.
