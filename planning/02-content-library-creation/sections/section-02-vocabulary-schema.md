# Section 02: Vocabulary Schema -- Controlled Vocabulary and Frontmatter Validation

## Overview

This section creates the controlled vocabulary file and the frontmatter schema validation system that governs every MDX file in the content library. The controlled vocabulary defines all valid enumerated values (categories, subcategories, tags, audiences, age groups, LTAD stages, content types, pillars, difficulty levels, sport relevance). The frontmatter schema validator uses Zod to enforce these constraints at test time.

Without this section, no article can be validated. Every subsequent section that writes MDX content depends on the vocabulary and schema defined here.

**What gets created:**

| Deliverable | Path | Purpose |
|---|---|---|
| Controlled vocabulary | `/content/_vocabulary.yaml` | Single source of truth for all enumerated field values |
| Frontmatter schema | `lib/content/schema.ts` | Zod schema validating MDX frontmatter against the vocabulary |
| Vocabulary loader | `lib/content/vocabulary.ts` | Utility to load and parse the vocabulary file |
| Schema tests | `__tests__/content/vocabulary-schema.test.ts` | Tests for vocabulary loading, schema validation, and pillar mapping |

---

## Tests (Write First)

All tests use Vitest. Tests for this section live at `__tests__/content/vocabulary-schema.test.ts`. These tests validate that the vocabulary file loads correctly and that the Zod schema enforces all constraints.

The tests need `fs`, `path` from Node.js, `js-yaml` for YAML parsing, and `zod` for schema validation. Install `zod` as a production dependency (it will be used at build time too) and `js-yaml` as a dev dependency if not already installed from section-01.

```typescript
// File: __tests__/content/vocabulary-schema.test.ts

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const CONTENT_ROOT = path.resolve(__dirname, '../../content');
const VOCABULARY_PATH = path.join(CONTENT_ROOT, '_vocabulary.yaml');

describe('Controlled Vocabulary File', () => {
  it('vocabulary file exists at /content/_vocabulary.yaml', () => {
    expect(fs.existsSync(VOCABULARY_PATH)).toBe(true);
  });

  it('vocabulary file loads and parses as valid YAML', () => {
    const content = fs.readFileSync(VOCABULARY_PATH, 'utf-8');
    const parsed = yaml.load(content);
    expect(parsed).toBeDefined();
    expect(typeof parsed).toBe('object');
  });

  it('vocabulary file contains entries for all enumerated field types', () => {
    const content = fs.readFileSync(VOCABULARY_PATH, 'utf-8');
    const vocab = yaml.load(content) as Record<string, unknown>;
    const requiredKeys = [
      'categories',
      'subcategories',
      'tags',
      'audiences',
      'ageGroups',
      'ltadStages',
      'contentTypes',
      'pillars',
      'difficultyLevels',
      'sportRelevance',
    ];
    for (const key of requiredKeys) {
      expect(vocab).toHaveProperty(key);
    }
  });

  it('every subcategory maps to a valid parent category', () => {
    const content = fs.readFileSync(VOCABULARY_PATH, 'utf-8');
    const vocab = yaml.load(content) as any;
    const categoryNames = vocab.categories.map((c: any) => c.name);
    for (const sub of vocab.subcategories) {
      expect(categoryNames).toContain(sub.parent);
    }
  });

  it('pillar display names map correctly to slugs', () => {
    const content = fs.readFileSync(VOCABULARY_PATH, 'utf-8');
    const vocab = yaml.load(content) as any;
    const expectedMapping: Record<string, string> = {
      'Physical Literacy First': 'physical-literacy',
      'Development Over Results': 'development-over-results',
      'Health and Safety Above All': 'health-safety',
      'Character Through Sport': 'character-through-sport',
      'Community Ownership': 'community-ownership',
    };
    for (const pillar of vocab.pillars) {
      expect(expectedMapping[pillar.displayName]).toBe(pillar.slug);
    }
  });
});

describe('Frontmatter Schema Validation', () => {
  // These tests import the schema and vocabulary loader.
  // The actual import paths depend on your tsconfig paths.
  // Adjust the import if needed:
  //   import { frontmatterSchema } from '../../lib/content/schema';
  //   import { loadVocabulary } from '../../lib/content/vocabulary';

  it('valid frontmatter passes schema validation (all required fields present)', () => {
    // Provide a complete, valid frontmatter object. Expect no errors from schema.parse().
  });

  it('missing required field (e.g., no title) fails validation with descriptive error', () => {
    // Omit `title` from the frontmatter object. Expect schema.parse() to throw
    // a ZodError whose issues array includes an entry referencing "title".
  });

  it('invalid category value (not in controlled vocabulary) fails validation', () => {
    // Use category: "nonexistent-category". Expect validation failure.
  });

  it('invalid ageGroup value fails validation (e.g., "10-12" is not valid)', () => {
    // Use ageGroup: ["10-12"]. Expect validation failure.
  });

  it('ageGroup accepts valid values: 6-8, 9-11, 12-14, 15-18', () => {
    // Use ageGroup: ["6-8", "9-11", "12-14", "15-18"]. Expect validation success.
  });

  it('ltadStage accepts valid values', () => {
    // Use all five valid ltadStage values. Expect validation success.
  });

  it('pillar array values match slug mapping', () => {
    // Use pillar: ["physical-literacy", "development-over-results"]. Expect success.
    // Use pillar: ["invalid-pillar"]. Expect failure.
  });

  it('audience array only accepts: parent, coach, athlete, administrator', () => {
    // Use audience: ["parent", "coach"]. Expect success.
    // Use audience: ["teacher"]. Expect failure.
  });

  it('contentType only accepts valid values', () => {
    // Valid: guide, framework, checklist, case-study, research-summary, faq
  });

  it('status only accepts: draft, review, published, archived', () => {
    // Use status: "draft". Expect success. Use status: "pending". Expect failure.
  });

  it('description outside 150-160 character range produces warning', () => {
    // This is a soft validation. The schema should accept the value but the
    // validator utility function should return a warnings array.
  });

  it('slug is URL-safe (lowercase, hyphens only, no special characters)', () => {
    // Use slug: "valid-slug-here". Expect success.
    // Use slug: "Invalid Slug!". Expect failure.
  });

  it('date and lastUpdated are valid ISO 8601 dates', () => {
    // Use date: "2025-01-15". Expect success.
    // Use date: "not-a-date". Expect failure.
  });

  it('optional fields pass when present with valid values', () => {
    // Include all optional fields with valid values. Expect success.
  });

  it('optional fields are truly optional -- frontmatter validates without them', () => {
    // Provide only required fields. Expect success.
  });

  it('references array items have required shape: {title, url, accessed}', () => {
    // Use references: [{ title: "AAP", url: "https://...", accessed: "2025-01-15" }]. Expect success.
    // Use references: [{ title: "AAP" }]. Expect failure (missing url and accessed).
  });

  it('series object has required shape: {name, order} when present', () => {
    // Use series: { name: "Series A", order: 1 }. Expect success.
    // Use series: { name: "Series A" }. Expect failure (missing order).
  });

  it('estimatedReadTime is a positive integer when present', () => {
    // Use estimatedReadTime: 8. Expect success.
    // Use estimatedReadTime: -1. Expect failure.
  });
});
```

**Dependencies to install:**

```bash
npm install zod
npm install -D js-yaml @types/js-yaml  # if not already installed from section-01
```

---

## Implementation Details

### Step 1: Create the Controlled Vocabulary File

**File path:** `/content/_vocabulary.yaml`

This file is the single source of truth for every enumerated value used in article frontmatter. No ad-hoc values are permitted -- if a new tag or subcategory is needed, it must be explicitly added to this file first.

The vocabulary file must contain these top-level keys:

**`categories`** -- Array of objects with `name` and `description`. These are the 7 content categories matching the directory structure from section-01:

```yaml
categories:
  - name: parent-guides
    description: Articles targeting parents on supporting youth athletes
  - name: coach-resources
    description: Practical guidance for volunteer coaches
  - name: development-frameworks
    description: Evidence-based frameworks (LTAD, periodization, skill windows)
  - name: health-safety
    description: Injury prevention, concussion protocols, training limits, nutrition
  - name: community-building
    description: Program-level guidance for volunteers, fundraising, multi-sport culture
  - name: port-clinton-way
    description: The 5 Pillars of Program Success and philosophical foundation
  - name: resources
    description: Curated external resources page
```

**`subcategories`** -- Array of objects with `name`, `parent` (a valid category name), and `description`. Each category should have 2-4 subcategories to enable fine-grained filtering. Design the subcategories so that every article naturally falls into one. Examples:

- `parent-guides` subcategories: `supporting-your-athlete`, `development-expectations`, `mental-health-wellness`, `nutrition-basics`
- `coach-resources` subcategories: `getting-started`, `practice-planning`, `season-management`, `team-culture`
- `development-frameworks` subcategories: `ltad-model`, `multi-sport-development`, `physical-literacy`, `skill-development`
- `health-safety` subcategories: `injury-prevention`, `concussion-protocols`, `training-load`, `nutrition-recovery`
- `community-building` subcategories: `volunteer-development`, `program-management`, `fundraising`, `multi-sport-culture`
- `port-clinton-way` subcategories: `five-pillars`, `philosophy`, `identity-culture`
- `resources` subcategories: `organizations`, `research`, `tools`, `reading`

**`tags`** -- Array of approved tag strings. Start with a curated initial list covering the most common cross-cutting themes. Tags are intentionally smaller than subcategories and meant for secondary filtering. Examples: `multi-sport`, `early-specialization`, `physical-literacy`, `mental-health`, `volunteer`, `concussion`, `periodization`, `age-appropriate`, `sportsmanship`, `team-building`, `nutrition`, `rest-recovery`, `injury-prevention`, `parent-communication`, `coach-development`, `LTAD`, `AAP-guidelines`, `positive-coaching`, `character-development`, `inclusion`.

**`audiences`** -- Array of valid audience values:

```yaml
audiences:
  - parent
  - coach
  - athlete
  - administrator
```

**`ageGroups`** -- Array of valid age group range strings. These are clean, non-overlapping ranges aligned with the LTAD research:

```yaml
ageGroups:
  - "6-8"
  - "9-11"
  - "12-14"
  - "15-18"
```

**`ltadStages`** -- Array of valid LTAD stage values with their descriptions and typical age group mapping:

```yaml
ltadStages:
  - name: active-start
    description: Introduction to movement through play (typically ages 6-8)
    typicalAgeGroups: ["6-8"]
  - name: fundamentals
    description: Learning fundamental movement skills (typically ages 6-11)
    typicalAgeGroups: ["6-8", "9-11"]
  - name: learn-to-train
    description: Learning sport-specific skills (typically ages 9-14)
    typicalAgeGroups: ["9-11", "12-14"]
  - name: train-to-train
    description: Building aerobic base and sport skills (typically ages 12-18)
    typicalAgeGroups: ["12-14", "15-18"]
  - name: train-to-compete
    description: Sport-specific training and competition (typically ages 15-18)
    typicalAgeGroups: ["15-18"]
```

**`contentTypes`** -- Array of valid content type values:

```yaml
contentTypes:
  - guide
  - framework
  - checklist
  - case-study
  - research-summary
  - faq
```

**`pillars`** -- Array of objects with `displayName`, `slug`, and `description`. The slug is what appears in article frontmatter; the display name is for rendering:

```yaml
pillars:
  - displayName: Physical Literacy First
    slug: physical-literacy
    description: Every child develops fundamental movement skills before sport-specific training
  - displayName: Development Over Results
    slug: development-over-results
    description: Program success measured by athlete growth, not win-loss records
  - displayName: Health and Safety Above All
    slug: health-safety
    description: Training loads respect guidelines, mandatory rest, injury prevention
  - displayName: Character Through Sport
    slug: character-through-sport
    description: Athletics builds character traits that extend beyond the playing field
  - displayName: Community Ownership
    slug: community-ownership
    description: Every stakeholder shares responsibility for the athletic ecosystem
```

**`difficultyLevels`** -- Array of valid difficulty values:

```yaml
difficultyLevels:
  - beginner
  - intermediate
  - advanced
```

**`sportRelevance`** -- Array of valid sport relevance values:

```yaml
sportRelevance:
  - sport-general
  - team-sports
  - individual-sports
```

**Age Group to LTAD Stage Mapping** -- Include this as a reference mapping within the vocabulary file for programmatic use:

```yaml
ageGroupToLtad:
  "6-8": [active-start, fundamentals]
  "9-11": [fundamentals, learn-to-train]
  "12-14": [learn-to-train, train-to-train]
  "15-18": [train-to-train, train-to-compete]
```

### Step 2: Create the Vocabulary Loader Utility

**File path:** `lib/content/vocabulary.ts`

This utility module loads and parses the vocabulary YAML file and exports typed data for use in the schema validator and tests. It should:

1. Read `/content/_vocabulary.yaml` from disk
2. Parse it with `js-yaml`
3. Export the parsed vocabulary as a typed object
4. Export convenience functions for common lookups:
   - `getValidCategories(): string[]` -- returns array of valid category name strings
   - `getValidSubcategories(category?: string): string[]` -- returns subcategory names, optionally filtered by parent category
   - `getValidTags(): string[]` -- returns array of approved tag strings
   - `getValidAudiences(): string[]` -- returns `["parent", "coach", "athlete", "administrator"]`
   - `getValidAgeGroups(): string[]` -- returns `["6-8", "9-11", "12-14", "15-18"]`
   - `getValidLtadStages(): string[]` -- returns the five LTAD stage name strings
   - `getValidContentTypes(): string[]` -- returns the six content type strings
   - `getValidPillarSlugs(): string[]` -- returns array of pillar slug strings
   - `getPillarBySlug(slug: string): { displayName: string; slug: string; description: string } | undefined`
   - `getPillarByDisplayName(name: string): { displayName: string; slug: string; description: string } | undefined`
   - `getLtadStagesForAgeGroup(ageGroup: string): string[]` -- returns typical LTAD stages for a given age group

```typescript
// File: lib/content/vocabulary.ts
// Stub signature -- implement the loader and typed exports.

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface Vocabulary {
  categories: Array<{ name: string; description: string }>;
  subcategories: Array<{ name: string; parent: string; description: string }>;
  tags: string[];
  audiences: string[];
  ageGroups: string[];
  ltadStages: Array<{ name: string; description: string; typicalAgeGroups: string[] }>;
  contentTypes: string[];
  pillars: Array<{ displayName: string; slug: string; description: string }>;
  difficultyLevels: string[];
  sportRelevance: string[];
  ageGroupToLtad: Record<string, string[]>;
}

export function loadVocabulary(): Vocabulary {
  /** Read and parse /content/_vocabulary.yaml, return typed Vocabulary object. */
}

export function getValidCategories(): string[] {
  /** Return array of valid category name strings. */
}

// ... remaining convenience functions follow the same pattern
```

### Step 3: Create the Frontmatter Schema

**File path:** `lib/content/schema.ts`

This module defines a Zod schema that validates any MDX article's frontmatter against the controlled vocabulary. It should:

1. Import the vocabulary loader to get valid values dynamically
2. Define a Zod schema for the full frontmatter structure
3. Use `z.enum()` with values drawn from the vocabulary for all enumerated fields
4. Make optional fields truly optional (using `z.optional()`)
5. Add custom refinements for:
   - `slug` must be URL-safe: lowercase, hyphens and alphanumeric only, matching `/^[a-z0-9]+(-[a-z0-9]+)*$/`
   - `date` and `lastUpdated` must be valid ISO 8601 date strings
   - `estimatedReadTime` must be a positive integer
   - `references` items must have `{ title: string, url: string, accessed: string }`
   - `series` must have `{ name: string, order: number }` when present
6. Export a validation function that returns both errors (hard failures) and warnings (soft issues like description length outside 150-160 chars)

```typescript
// File: lib/content/schema.ts
// Stub signature -- implement using Zod with vocabulary-driven enums.

import { z } from 'zod';
import { loadVocabulary } from './vocabulary';

export function createFrontmatterSchema() {
  /**
   * Load the vocabulary and construct a Zod schema.
   * Required fields: title, description, slug, date, lastUpdated, category,
   *   subcategory, tags, audience, ageGroup, ltadStage, contentType, pillar, status.
   * Optional fields: excerpt, difficulty, estimatedReadTime, sportRelevance,
   *   featuredImage, relatedArticles, prerequisites, series, references, version, reviewDate.
   * Returns the Zod schema object.
   */
}

export interface ValidationResult {
  success: boolean;
  errors: Array<{ field: string; message: string }>;
  warnings: Array<{ field: string; message: string }>;
}

export function validateFrontmatter(frontmatter: unknown): ValidationResult {
  /**
   * Parse frontmatter against the schema.
   * Return structured result with errors (hard fails) and warnings (soft issues).
   * Warnings include: description outside 150-160 char range.
   */
}
```

---

## Verification Checklist

After implementation, verify:

- [ ] `/content/_vocabulary.yaml` exists and parses as valid YAML
- [ ] The vocabulary file contains all 10 required top-level keys: `categories`, `subcategories`, `tags`, `audiences`, `ageGroups`, `ltadStages`, `contentTypes`, `pillars`, `difficultyLevels`, `sportRelevance`
- [ ] The `ageGroupToLtad` mapping is present and correct
- [ ] All 7 category names match the directory names from section-01
- [ ] Every subcategory references a valid parent category
- [ ] The 5 pillar display-name-to-slug mappings are correct
- [ ] `lib/content/vocabulary.ts` exports `loadVocabulary()` and all convenience functions
- [ ] `lib/content/schema.ts` exports `createFrontmatterSchema()` and `validateFrontmatter()`
- [ ] `zod` is installed as a dependency
- [ ] All tests in `__tests__/content/vocabulary-schema.test.ts` pass when run with `npm test`
- [ ] Schema rejects invalid category, ageGroup, audience, and pillar values
- [ ] Schema accepts all valid enumerated values
- [ ] Schema enforces URL-safe slug format
- [ ] Schema enforces ISO 8601 date format
- [ ] Warnings are generated for description length outside 150-160 chars

---

## Dependencies and Downstream Sections

**This section depends on:**
- **section-01-foundation** -- The `/content/` directory and category subdirectories must exist. The vocabulary category names must match the directory names created in section-01.

**Sections that depend on this section:**
- **section-03-voice-alignment** -- Uses the vocabulary to validate terminology and frontmatter in the voice guide and alignment principles
- **sections 04-10** -- Every article's frontmatter is validated against the schema and vocabulary defined here
- **section-11-cross-references-qa** -- Uses the vocabulary to verify completeness (all subcategories covered, all audiences represented, etc.)
