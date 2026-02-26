# Section 01: Foundation -- Directory Structure, Progress Manifest, and Article Template

## Overview

This section establishes the physical directory layout, progress manifest, and article body template that every subsequent section depends on. Nothing in the content library can be created until these foundations exist. This section has no dependencies and blocks all other sections.

**What gets created:**

| Deliverable | Path | Purpose |
|---|---|---|
| Content root directory | `/content/` | Root for all content files |
| 7 category subdirectories | `/content/{category}/` | One per content category |
| Progress manifest | `/content/_progress.yaml` | Cross-session state file tracking every article |
| Article body template | `/content/_article-template.md` | Reference document for article structure |

---

## Tests (Write First)

All tests use Vitest. Tests for this section live at `__tests__/content/foundation.test.ts`. These tests validate the directory structure, progress manifest, and article template created by this section.

The tests need `fs` and `path` from Node.js and `js-yaml` (install as a dev dependency: `npm install -D js-yaml @types/js-yaml`). The `yaml` package is also acceptable -- the key requirement is that the manifest parses as valid YAML.

```typescript
// File: __tests__/content/foundation.test.ts

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const CONTENT_ROOT = path.resolve(__dirname, '../../content');

const REQUIRED_CATEGORIES = [
  'parent-guides',
  'coach-resources',
  'development-frameworks',
  'health-safety',
  'community-building',
  'port-clinton-way',
  'resources',
];

describe('Content Directory Structure', () => {
  it('content root directory exists', () => {
    expect(fs.existsSync(CONTENT_ROOT)).toBe(true);
  });

  it.each(REQUIRED_CATEGORIES)(
    'category subdirectory "%s" exists',
    (category) => {
      const dir = path.join(CONTENT_ROOT, category);
      expect(fs.existsSync(dir)).toBe(true);
      expect(fs.statSync(dir).isDirectory()).toBe(true);
    }
  );

  it('no MDX files exist outside of recognized category directories', () => {
    // Scan the content root for any .mdx files not inside recognized category directories.
    // Files prefixed with underscore (like _progress.yaml) and non-mdx files are allowed at root.
  });

  it('category directory names match controlled vocabulary categories', () => {
    const entries = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true });
    const dirs = entries
      .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
      .map((e) => e.name);
    expect(dirs.sort()).toEqual([...REQUIRED_CATEGORIES].sort());
  });
});

describe('Progress Manifest', () => {
  const manifestPath = path.join(CONTENT_ROOT, '_progress.yaml');

  it('progress manifest file exists at /content/_progress.yaml', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);
  });

  it('progress manifest parses as valid YAML', () => {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    const parsed = yaml.load(content);
    expect(parsed).toBeDefined();
  });

  it('progress manifest has the expected top-level structure', () => {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    const parsed = yaml.load(content) as any;
    const articles = Array.isArray(parsed) ? parsed : parsed?.articles;
    expect(Array.isArray(articles)).toBe(true);
  });
});

describe('Article Body Template', () => {
  const templatePath = path.join(CONTENT_ROOT, '_article-template.md');

  it('article body template file exists', () => {
    expect(fs.existsSync(templatePath)).toBe(true);
  });

  it('template contains required sections', () => {
    const content = fs.readFileSync(templatePath, 'utf-8');
    expect(content).toContain('Key Takeaways');
    expect(content).toContain('Introduction');
    expect(content).toContain('Practical Application');
    expect(content).toContain('References');
    expect(content).toContain('AD_INPUT_NEEDED');
  });
});
```

**Dev dependency to install:** `js-yaml` and `@types/js-yaml` (for YAML parsing in tests).

```bash
npm install -D js-yaml @types/js-yaml
```

---

## Implementation Details

### Step 1: Create the `/content/` Directory and Category Subdirectories

Create the following directory tree at the project root. Each directory should contain a `.gitkeep` file so Git tracks the empty directories.

```
/content/
  parent-guides/.gitkeep
  coach-resources/.gitkeep
  development-frameworks/.gitkeep
  health-safety/.gitkeep
  community-building/.gitkeep
  port-clinton-way/.gitkeep
  resources/.gitkeep
```

**Why these 7 categories:** The category names are drawn from the content architecture (Section 2.1 of the plan). They map one-to-one with the `category` values in the controlled vocabulary (created in section-02). The directory structure provides implicit categorization that survives metadata schema changes, and most MDX frameworks (Astro Content Collections, Velite) map directory structure to content types naturally.

**Category purposes:**

| Directory | Purpose |
|---|---|
| `parent-guides/` | Articles targeting parents on supporting youth athletes |
| `coach-resources/` | Practical guidance for volunteer coaches |
| `development-frameworks/` | Evidence-based frameworks (LTAD, periodization, skill windows) |
| `health-safety/` | Injury prevention, concussion protocols, training limits, nutrition |
| `community-building/` | Program-level guidance: volunteers, fundraising, multi-sport culture |
| `port-clinton-way/` | The 5 Pillars of Program Success and philosophical foundation |
| `resources/` | Curated external resources page |

### Step 2: Create the Progress Manifest

**File path:** `/content/_progress.yaml`

The progress manifest is the cross-session state file for the entire content library. Every article generated in subsequent sections gets an entry here. It starts as an empty array with header comments explaining the structure.

```yaml
# Progress Manifest - PCAB Content Library
#
# This file tracks every article in the content library.
# Each generation session reads this to understand what exists,
# what's in progress, and what cross-references are available.
#
# Required fields per entry:
#   slug: URL-safe article identifier (lowercase, hyphens only)
#   title: Full article title
#   category: One of the controlled vocabulary categories
#   pillar: Array of pillar slugs this article connects to
#   audience: Array of target audiences
#   ageGroup: Array of age group ranges
#   status: draft | review | published
#   alignmentScore: 1-5 alignment score (null until checked)
#   adPlaceholderTier: critical | valuable | optional
#   wordCount: Approximate word count
#
# Example entry:
# - slug: physical-literacy-first
#   title: "Physical Literacy First: The Foundation of Youth Athletic Development"
#   category: port-clinton-way
#   pillar: [physical-literacy]
#   audience: [parent, coach, administrator]
#   ageGroup: [6-8, 9-11, 12-14, 15-18]
#   status: published
#   alignmentScore: 5
#   adPlaceholderTier: critical
#   wordCount: 2450

articles: []
```

### Step 3: Create the Article Body Template

**File path:** `/content/_article-template.md`

This is a reference document (not an MDX file itself) that shows the required structure for every article in the library. It includes the frontmatter schema outline, the required body sections, and the AD placeholder format.

The template should contain:

1. **Frontmatter block** showing all required and optional fields with placeholder values and inline comments
2. **Key Takeaways section** -- 3-5 bullet points summarizing actionable insights
3. **Introduction** -- brief context setting (2-3 paragraphs)
4. **Main Content Sections placeholder** -- note that there will be 3-5 topic-specific sections
5. **Practical Application** -- what readers can do with the information
6. **AD_INPUT_NEEDED placeholder** -- the exact comment format for AD input blocks
7. **References section** -- format for cited sources

**AD Placeholder Format** (must appear exactly as shown):

```mdx
{/* [AD_INPUT_NEEDED]
   Type: philosophy-statement | program-example | endorsement
   Priority: critical | valuable | optional
   Context: Brief description of what this article covers
   Guidance: What kind of input is expected (2-3 paragraphs, a quote, an example)
*/}
```

**AD Placeholder Tiering** (document in the template for reference):

| Tier | Expected Count | Articles | AD Action |
|---|---|---|---|
| **Critical** | 5-8 | Port Clinton Way pillar articles, program philosophy overview | AD must contribute before publication |
| **Valuable** | 15-20 | Articles directly referencing program philosophy, community building | AD input strengthens content; publish without if needed |
| **Optional** | 50-70 | Evidence-based guides, frameworks, safety content | Articles complete without AD input; placeholder available if AD wants to add perspective |

---

## Verification Checklist

After implementation, verify:

- [ ] `/content/` directory exists at the project root
- [ ] All 7 category subdirectories exist and are tracked by Git (via `.gitkeep`)
- [ ] No extra directories exist under `/content/` (other than underscore-prefixed files)
- [ ] `/content/_progress.yaml` exists and parses as valid YAML
- [ ] The progress manifest contains documented field definitions and an empty `articles` array
- [ ] `/content/_article-template.md` exists with all required sections (Key Takeaways, Introduction, Practical Application, References, AD_INPUT_NEEDED)
- [ ] `js-yaml` and `@types/js-yaml` are installed as dev dependencies
- [ ] All tests in `__tests__/content/foundation.test.ts` pass when run with `npm test`

---

## Dependencies and Downstream Sections

**This section depends on:** Nothing. It is the first section.

**Sections that depend on this section:**
- **section-02-vocabulary-schema** -- creates `/content/_vocabulary.yaml` and the frontmatter validation schema
- **section-03-voice-alignment** -- creates `_voice-guide.md` and `_alignment-principles.md` in the `/content/` root
- **sections 04-10** -- all write MDX files into the category subdirectories and append entries to the progress manifest
- **section-11-cross-references-qa** -- reads the progress manifest and validates the entire file inventory against it
