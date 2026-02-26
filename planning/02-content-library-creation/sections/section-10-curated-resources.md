# Section 10: Curated Resources -- Compiled External Resources Page with Editorial Context

## Overview

This section compiles the curated external resources page from all sources cited across articles in sections 04-09. It is the second-to-last section in the execution order because it draws on references accumulated throughout the entire content library. The output is a single MDX resource page plus supporting metadata updates.

The curated resources page serves as a trusted gateway to external information. Rather than a raw link dump, it provides editorial context that explains why each resource matters and how it connects to PCAB's development-first philosophy. Resources are organized into four categories (Organizations, Research, Tools, Reading) and tiered into "key" resources (5-10 with full editorial write-ups) and "standard" resources (20-30 with brief annotations).

**What gets created:**

| Deliverable | Path | Purpose |
|---|---|---|
| Curated resources page | `/content/resources/curated-external-resources.mdx` | Vetted external links with editorial context |
| Updated progress manifest | `/content/_progress.yaml` | New article entry for the resources page |

**Article count:** 1 MDX file (the curated resources page itself).

---

## Tests (Write First)

All tests use Vitest. Tests for this section live at `__tests__/content/curated-resources.test.ts`.

```typescript
// File: __tests__/content/curated-resources.test.ts

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import matter from 'gray-matter';

const CONTENT_ROOT = path.resolve(__dirname, '../../content');
const RESOURCES_DIR = path.join(CONTENT_ROOT, 'resources');
const RESOURCES_FILE = path.join(
  RESOURCES_DIR,
  'curated-external-resources.mdx'
);
const MANIFEST_PATH = path.join(CONTENT_ROOT, '_progress.yaml');

describe('Curated Resources -- File Existence', () => {
  it('curated resources file exists at /content/resources/curated-external-resources.mdx', () => {
    expect(fs.existsSync(RESOURCES_FILE)).toBe(true);
  });

  it('curated resources file has valid frontmatter', () => {
    const content = fs.readFileSync(RESOURCES_FILE, 'utf-8');
    const { data } = matter(content);
    expect(data.title).toBeDefined();
    expect(data.slug).toBe('curated-external-resources');
    expect(data.category).toBe('resources');
    expect(data.contentType).toBeDefined();
    expect(data.audience).toBeDefined();
    expect(data.status).toBeDefined();
  });
});

describe('Curated Resources -- Organization by Category', () => {
  it('resources are organized by category (Organizations, Research, Tools, Reading)', () => {
    const content = fs.readFileSync(RESOURCES_FILE, 'utf-8');
    expect(content).toMatch(/organizations/i);
    expect(content).toMatch(/research/i);
    expect(content).toMatch(/tools/i);
    expect(content).toMatch(/reading/i);
  });
});

describe('Curated Resources -- Key Resources Editorial', () => {
  it('key resources (5-10) have editorial write-ups of 150-250 words', () => {
    const content = fs.readFileSync(RESOURCES_FILE, 'utf-8');
    // Key resources are identified by a heading pattern followed by a substantial
    // write-up. Count sections that appear under a "Key Resources" or similar heading
    // and verify word count of accompanying text.
    //
    // Strategy: split the content by key resource headings (### level within each
    // category) and count words in each write-up block. At least 5 key resources
    // should have 150+ words of editorial context.
    //
    // This is an approximation -- the implementer should verify by reading the output.
    const keyResourcePattern = /### .+/g;
    const keyResourceMatches = content.match(keyResourcePattern);
    // At minimum 5 key resources with dedicated subsections
    expect(keyResourceMatches).not.toBeNull();
    expect(keyResourceMatches!.length).toBeGreaterThanOrEqual(5);
  });
});

describe('Curated Resources -- Standard Resources Annotations', () => {
  it('standard resources (20-30) have annotations of 2-3 sentences', () => {
    const content = fs.readFileSync(RESOURCES_FILE, 'utf-8');
    // Standard resources appear as list items with a link and annotation text.
    // Count markdown links that have accompanying descriptive text.
    const linkPattern = /\[.+?\]\(https?:\/\/.+?\)/g;
    const links = content.match(linkPattern);
    // Total links (key + standard) should be at least 25
    expect(links).not.toBeNull();
    expect(links!.length).toBeGreaterThanOrEqual(25);
  });
});

describe('Curated Resources -- Selection Criteria', () => {
  it('resources come from established organizations', () => {
    const content = fs.readFileSync(RESOURCES_FILE, 'utf-8');
    // At minimum, the major organizations referenced throughout the library
    // should appear on the resources page.
    expect(content).toMatch(/Positive Coaching Alliance|PCA/);
    expect(content).toMatch(/NSCA|National Strength and Conditioning/i);
    expect(content).toMatch(/AAP|American Academy of Pediatrics/i);
    expect(content).toMatch(/LTAD|Long-Term Athlete Development/i);
    expect(content).toMatch(/NFHS|National Federation of State High School/i);
  });

  it('paywalled resources are noted', () => {
    // If any resources are behind a paywall, the annotation should note it.
    // This test checks that the term "paywall" or "subscription" or
    // "freely accessible" appears if relevant. At minimum, the page should
    // contain language about accessibility.
    const content = fs.readFileSync(RESOURCES_FILE, 'utf-8');
    expect(
      content.match(/free|freely accessible|open access|paywall|subscription/i)
    ).not.toBeNull();
  });
});

describe('Curated Resources -- Progress Manifest', () => {
  it('curated resources page has an entry in the progress manifest', () => {
    const manifest = yaml.load(
      fs.readFileSync(MANIFEST_PATH, 'utf-8')
    ) as any;
    const articles = Array.isArray(manifest) ? manifest : manifest?.articles ?? [];
    const entry = articles.find(
      (a: any) => a.slug === 'curated-external-resources'
    );
    expect(entry).toBeDefined();
    expect(entry.category).toBe('resources');
  });
});
```

**Dev dependencies required:** `gray-matter`, `js-yaml`, `@types/js-yaml` (should already be installed from previous sections).

---

## Implementation Details

### Step 1: Collect All Cited Sources from Sections 04-09

Before writing the resources page, gather every external source cited across the content library. The primary method is to scan the `references` frontmatter arrays and in-body citations from all MDX files in the following directories:

- `/content/port-clinton-way/` (section-04)
- `/content/development-frameworks/` (section-05)
- `/content/health-safety/` (section-06)
- `/content/parent-guides/` (section-07)
- `/content/coach-resources/` (section-08)
- `/content/community-building/` (section-09)

For each cited source, record:
- Organization or author name
- Publication title or document name
- Year of publication
- URL (if available and verified)
- Which articles in the library cite it (to determine "key" vs. "standard" status)

Sources cited by 3 or more articles across different categories are strong candidates for "key resource" status. Sources cited once or twice are candidates for "standard resource" status.

### Step 2: Classify Resources into Categories

Organize the collected resources into four categories:

**Organizations** -- Entities that publish ongoing resources relevant to youth sports development:
- Positive Coaching Alliance (PCA)
- National Federation of State High School Associations (NFHS)
- Canadian Sport for Life / LTAD
- National Strength and Conditioning Association (NSCA)
- American Academy of Pediatrics (AAP)
- Aspen Institute Project Play / Sport for All, Play for Life
- Other organizations cited in the articles

**Research** -- Peer-reviewed studies, clinical reports, and position statements:
- AAP clinical reports on youth sports (2016 and subsequent updates)
- NSCA position statements on long-term athletic development
- LaPrade et al. (2016) AOSSM early sport specialization consensus statement
- Brenner (2016) on sports specialization and injury risk
- Crane & Temple (2015) on youth sport dropout
- Moesch et al. (2011) on late specialization in elite athletes
- Holt et al. (2017) systematic review on positive youth development through sport
- Other peer-reviewed work cited in the library

**Tools** -- Practical resources that coaches, parents, or administrators can use directly:
- Practice planning templates (if cited or referenced)
- Physical literacy assessment guides (PHE Canada)
- Concussion protocol checklists (NFHS)
- Season planning templates
- Age-appropriate training load calculators or guidelines

**Reading** -- Books and long-form articles for deeper learning:
- Books by Balyi on LTAD
- PCA's Double-Goal Coach framework resources
- Lerner et al. on Positive Youth Development
- Danish, Forneris, & Wallace on sport-based life skills
- Oyserman on identity-based motivation
- Deci & Ryan on Self-Determination Theory
- Other books and long-form references cited in articles

### Step 3: Tier Resources into Key and Standard

**Key resources (5-10):** These get full editorial write-ups of 150-250 words each. A key resource write-up covers:
1. What it is -- the organization, publication, or tool and its primary purpose
2. Why it matters -- how it connects to evidence-based youth sports development
3. PCAB pillar alignment -- which of the 5 Pillars it supports and how
4. Who should read it -- which audience (parent, coach, administrator, athlete) benefits most

Key resource candidates (at minimum):
1. **Canadian Sport for Life / LTAD model** -- Foundational framework for the entire content library
2. **Positive Coaching Alliance (PCA)** -- Double-Goal Coach framework and culture-building
3. **AAP Clinical Reports on Youth Sports** -- Evidence-based health and safety guidelines
4. **NSCA Position Statement on Long-Term Athletic Development** -- Training and development guidelines
5. **NFHS (National Federation of State High School Associations)** -- Concussion protocols, coaching education
6. **Aspen Institute Project Play** -- Community-level sport ecosystem design and advocacy

Additional key resources may be added if certain sources are heavily cited across many articles.

**Standard resources (20-30):** These get brief annotations of 2-3 sentences each. Each annotation covers what the resource is and why it is included on this page. Standard resources include the remaining cited sources that meet the selection criteria.

### Step 4: Apply Selection Criteria

Every resource on the page must meet these criteria. If a cited source does not meet the criteria, it should be excluded from the curated page (it can still appear in individual article reference lists).

Selection criteria:
- **Published by an established organization** -- University, professional association, government body, or recognized nonprofit. No personal blogs or unvetted websites.
- **Evidence-based, not opinion-based** -- The resource itself is grounded in research or established frameworks, not individual commentary.
- **Aligned with development-first philosophy** -- The resource supports (or at least does not contradict) the 5 Pillars. Resources promoting early specialization or win-at-all-costs approaches are excluded.
- **Freely accessible (note if paywalled)** -- Prefer resources that readers can access without payment. If a critical resource is paywalled (e.g., a peer-reviewed journal article), include it but clearly note the access restriction and suggest the abstract or a freely available summary.
- **Current** -- Updated within the last 3 years for organizational resources. For foundational research (e.g., Balyi's LTAD model from 2004), older publication dates are acceptable when the work remains the canonical reference in its field.

### Step 5: Write the Curated Resources MDX File

**File path:** `/content/resources/curated-external-resources.mdx`

The file should follow the standard article structure with adaptations appropriate for a resources page:

**Frontmatter:**
```yaml
---
title: "Curated Resources for Youth Sports Development"
description: "Vetted external resources organized by category -- organizations, research, tools, and reading for parents, coaches, and administrators."
slug: curated-external-resources
date: # current date in ISO 8601 format
lastUpdated: # current date in ISO 8601 format
category: resources
subcategory: external-resources
tags: [resources, reference, organizations, research]
audience: [parent, coach, athlete, administrator]
ageGroup: [6-8, 9-11, 12-14, 15-18]
ltadStage: [active-start, fundamentals, learn-to-train, train-to-train, train-to-compete]
contentType: guide
pillar: [physical-literacy, development-over-results, health-safety, character-through-sport, community-ownership]
status: review
difficulty: beginner
estimatedReadTime: # calculate based on final word count at ~250 words/minute
---
```

**Body structure:**

```
## Key Takeaways
- 3-5 bullet points summarizing what this resources page offers and how to use it

## Introduction
Brief overview (2-3 paragraphs) explaining:
- What this page is and how resources were selected
- The selection criteria (established, evidence-based, development-aligned, accessible, current)
- How the page is organized (four categories, key vs. standard resources)

## Organizations
### [Key Resource Name]
150-250 word editorial write-up for each key organization

**Standard Resources:**
- [Resource Name](URL) -- 2-3 sentence annotation
- ...

## Research
### [Key Research Publication/Report]
150-250 word editorial write-up for key research

**Standard Resources:**
- [Resource Name](URL) -- 2-3 sentence annotation
- ...

## Tools
### [Key Tool Name] (if any tools qualify as key resources)
150-250 word editorial write-up

**Standard Resources:**
- [Tool Name](URL) -- 2-3 sentence annotation
- ...

## Reading
### [Key Book/Long-Form Resource]
150-250 word editorial write-up

**Standard Resources:**
- [Book/Article Name](URL) -- 2-3 sentence annotation
- ...

## How to Use These Resources
Practical Application section explaining:
- How parents can use these resources to support their youth athletes
- How coaches can use these for professional development
- How administrators can use these for program design

{/* [AD_INPUT_NEEDED]
   Type: endorsement
   Priority: optional
   Context: Curated resources page listing vetted external sources for youth sports development
   Guidance: The AD may wish to highlight 2-3 resources that particularly resonate with the Port Clinton program, or add local/regional resources specific to Ohio high school athletics.
*/}

## References
Cited sources from the editorial write-ups (distinct from the resource links themselves)
```

### Step 6: Verify URL Accessibility (Separate Pass)

After writing the resources page, verify that resource URLs return valid responses (HTTP 200 or 301). This verification may be slow and should be run as a separate pass rather than blocking the writing process.

For URLs that fail verification:
- If the organization exists but the specific URL has moved, find the updated URL
- If the resource is no longer available, note it or remove it
- For paywalled resources, verify that the paywall landing page itself is accessible

This URL verification pass can also be deferred to section-11 (QA) if preferred, but the resources page should be written with the best-known URLs.

### Step 7: Update the Progress Manifest

Append an entry to `/content/_progress.yaml` for the curated resources page:

```yaml
- slug: curated-external-resources
  title: "Curated Resources for Youth Sports Development"
  category: resources
  pillar: [physical-literacy, development-over-results, health-safety, character-through-sport, community-ownership]
  audience: [parent, coach, athlete, administrator]
  ageGroup: ["6-8", "9-11", "12-14", "15-18"]
  status: review
  alignmentScore: null  # scored during QA pass in section-11
  adPlaceholderTier: optional
  wordCount: # approximate word count of the finished page
```

---

## Verification Checklist

After implementation, verify:

- [ ] `/content/resources/curated-external-resources.mdx` exists with valid frontmatter
- [ ] Resources are organized into four categories: Organizations, Research, Tools, Reading
- [ ] At least 5 key resources have editorial write-ups of 150-250 words each
- [ ] At least 20 standard resources have brief annotations of 2-3 sentences each
- [ ] Total resource links (key + standard) number at least 25
- [ ] All major organizations cited across the library appear (PCA, NSCA, AAP, LTAD, NFHS)
- [ ] Paywalled resources are noted as such
- [ ] Selection criteria are met: established organizations, evidence-based, development-aligned, accessible, current
- [ ] The page includes an Introduction explaining selection criteria and organization
- [ ] The page includes a Practical Application / "How to Use These Resources" section
- [ ] The page includes an AD_INPUT_NEEDED placeholder (Priority: optional)
- [ ] An entry for `curated-external-resources` exists in `/content/_progress.yaml`
- [ ] URL verification has been attempted (or deferred to section-11 QA with a note)
- [ ] All tests in `__tests__/content/curated-resources.test.ts` pass

---

## Dependencies and Downstream Sections

**This section depends on:**
- **section-01-foundation** -- The `/content/resources/` directory must exist. The progress manifest must exist.
- **section-02-vocabulary-schema** -- The controlled vocabulary must include the `resources` category and `external-resources` subcategory for valid frontmatter.
- **section-04-port-clinton-way** -- Sources cited in the 5 Pillars articles feed into the resource collection. The 5 Pillar definitions are needed to write pillar-alignment descriptions in editorial write-ups.
- **section-05-development-frameworks** -- Sources cited in development framework articles feed into the resource collection.
- **section-06-health-safety** -- Sources cited in health and safety articles (AAP guidelines, NFHS concussion protocols) feed into the resource collection.
- **section-07-parent-guides** -- Sources cited in parent guide articles feed into the resource collection.
- **section-08-coach-resources** -- Sources cited in coach resource articles feed into the resource collection.
- **section-09-community-building** -- Sources cited in community building articles feed into the resource collection.

**Sections that depend on this section:**
- **section-11-cross-references-qa** -- The final QA pass validates the resources page, checks URL accessibility, verifies that the curated resources page is properly cross-referenced from relevant articles, and confirms that the progress manifest entry exists. The stopping criteria in section-11 include "The curated resources page is compiled" as one of the conditions for the library being "done."
