# Section 03: Sample Content

## Overview

This section creates 2-3 minimal MDX stub files that exercise the entire knowledge base pipeline. These stubs validate frontmatter parsing, Zod validation, reading time calculation, category derivation, slug derivation, related articles scoring, and filtering. Files will be replaced by real content later.

**Dependencies:** Section 02 (types, Zod schema, content utilities)

---

## Tests

### Test File: `__tests__/content/sample-content.test.ts`

Integration tests reading actual files from `content/` (no fs mocking).

```
# Test: sample MDX files have valid frontmatter (passes Zod validation)
# Test: getAllArticles() successfully reads and parses all sample files
# Test: sample files cover at least 2 different categories
# Test: sample coaching-tips file has 6+ headings (triggers TOC)
# Test: sample files have distinct frontmatter values (tests related articles algorithm)
```

Use `vi.resetModules()` before each test to clear module-level cache.

---

## Implementation

### Directory Structure

```
content/
├── parents/
│   └── sample-parent-guide.mdx
├── coaches/
│   └── sample-coaching-tips.mdx
└── pc-way/
    └── sample-pc-way.mdx
```

### File 1: `content/parents/sample-parent-guide.mdx`

Short article, 3 headings (below TOC threshold of 5).

**Frontmatter:**
- `title`: "A Parent's Guide to Youth Sports Success"
- `category`: `parents`
- `pillar`: `['participation-depth', 'character-development']`
- `sport`: `['general']`
- `age_group`: `['youth']`
- `description`: "Essential guidance for parents supporting their young athletes through youth sports."
- `last_reviewed`: `'2025-01-15'`

**Content:** 3 `##` headings, several paragraphs, at least one bulleted list. Thematically appropriate for parents.

### File 2: `content/coaches/sample-coaching-tips.mdx`

Longer article, 6+ headings (triggers TOC).

**Frontmatter:**
- `title`: "Coaching Tips for Youth Development"
- `category`: `coaches`
- `pillar`: `['multi-sport', 'retention']`
- `sport`: `['basketball', 'soccer']`
- `age_group`: `['middle-school', 'high-school']`
- `description`: "Practical coaching strategies for developing well-rounded young athletes."
- `last_reviewed`: `'2025-02-01'`

**Content:** 7+ headings (mix of `##` and `###`), numbered and bulleted lists, a blockquote. Thematically appropriate for coaches.

### File 3: `content/pc-way/sample-pc-way.mdx`

Brief article bridging frontmatter overlap between other files.

**Frontmatter:**
- `title`: "The Port Clinton Way: Our Athletic Philosophy"
- `category`: `pc-way`
- `pillar`: `['character-development', 'multi-sport', 'competitive-trajectory']`
- `sport`: `['general', 'football']`
- `age_group`: `['youth', 'middle-school', 'general']`
- `description`: "Exploring the core athletic philosophy that guides Port Clinton's approach to youth sports."
- `last_reviewed`: `'2025-03-10'`

**Content:** 3-4 headings, paragraphs about PC Way philosophy, at least one list.

---

## Frontmatter Diversity Matrix

| Field | parents/sample-parent-guide | coaches/sample-coaching-tips | pc-way/sample-pc-way |
|---|---|---|---|
| `category` | `parents` | `coaches` | `pc-way` |
| `pillar` | `participation-depth`, `character-development` | `multi-sport`, `retention` | `character-development`, `multi-sport`, `competitive-trajectory` |
| `sport` | `general` | `basketball`, `soccer` | `general`, `football` |
| `age_group` | `youth` | `middle-school`, `high-school` | `youth`, `middle-school`, `general` |
| `last_reviewed` | `2025-01-15` | `2025-02-01` | `2025-03-10` |
| Heading count | 3 (no TOC) | 7+ (triggers TOC) | 4 (no TOC) |

**Why this diversity matters:**
- **Filtering:** Each dimension has unique values, shared values, and no universal values. Tests OR/AND filter logic.
- **Related articles:** Overlapping pillar/sport/age_group values create measurable Jaccard scores between all pairs.
- **Sorting:** Distinct `last_reviewed` dates. Expected order: pc-way > coaches > parents.
- **TOC threshold:** Only coaches article triggers TOC (6+ headings).

---

## Verification

1. `npx vitest run` passes all sample content tests
2. `getAllArticles()` returns 3 articles sorted correctly
3. Category derivation matches directory names
4. Slugs match filenames minus `.mdx`
5. Reading time is non-zero for all articles
6. `extractHeadings()` returns 6+ for coaching tips
7. `getRelatedArticles()` returns non-empty for any article
8. `next build` completes without errors
