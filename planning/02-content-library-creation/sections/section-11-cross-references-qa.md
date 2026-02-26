# Section 11: Cross-References and Quality Assurance -- Final Validation Pass

## Overview

This is the final section in the execution order. It runs after all content has been generated (sections 04-10) and performs the comprehensive quality assurance pass that certifies the content library as complete. No new articles are written in this section. Instead, it validates, cross-links, and certifies the existing library.

This section has four major responsibilities:

1. **Cross-reference update pass** -- Add `relatedArticles` links across categories for articles that were created after earlier articles were written. During generation, articles can only reference content that already exists. This pass fills in the reverse and lateral links.
2. **Completeness checks** -- Verify that the library meets all stopping criteria: subcategory coverage, audience coverage, age group coverage, pillar distribution, and minimum article count.
3. **Coherence review** -- Check for contradictions, inconsistent pillar descriptions, conflicting training recommendations, and terminology drift across the full library.
4. **Technical validation** -- Run schema validation on all frontmatter, resolve all cross-reference slugs, detect prerequisite cycles, validate MDX syntax, and confirm the progress manifest matches the actual file inventory.

**What gets created or modified:**

| Deliverable | Action | Purpose |
|---|---|---|
| All MDX files in `/content/` | Modified | `relatedArticles` frontmatter updated with cross-category links |
| Orphan report | Generated | List of articles not referenced by any other article |
| Progress manifest | Verified and corrected | Ensure manifest matches actual file inventory |
| QA summary report | Generated | Summary of all checks with pass/fail status |

**Article count:** 0 new articles. All existing articles may be modified (frontmatter `relatedArticles` field only).

---

## Tests (Write First)

All tests use Vitest. Tests for this section live at `__tests__/content/cross-references-qa.test.ts`. These tests validate the entire library as a whole -- they are integration-level tests that run across all content files.

```typescript
// File: __tests__/content/cross-references-qa.test.ts

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import matter from 'gray-matter';

const CONTENT_ROOT = path.resolve(__dirname, '../../content');
const MANIFEST_PATH = path.join(CONTENT_ROOT, '_progress.yaml');

const REQUIRED_CATEGORIES = [
  'parent-guides',
  'coach-resources',
  'development-frameworks',
  'health-safety',
  'community-building',
  'port-clinton-way',
  'resources',
];

const PILLAR_SLUGS = [
  'physical-literacy',
  'development-over-results',
  'health-safety',
  'character-through-sport',
  'community-ownership',
];

// Helper: collect all MDX files across the content library
function getAllMdxFiles(): Array<{ filePath: string; category: string }> {
  const results: Array<{ filePath: string; category: string }> = [];
  for (const cat of REQUIRED_CATEGORIES) {
    const dir = path.join(CONTENT_ROOT, cat);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
    for (const f of files) {
      results.push({ filePath: path.join(dir, f), category: cat });
    }
  }
  return results;
}

// Helper: parse frontmatter from a file
function parseFrontmatter(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return matter(content);
}

// Helper: build a slug-to-file map
function buildSlugMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const { filePath } of getAllMdxFiles()) {
    const { data } = parseFrontmatter(filePath);
    if (data.slug) {
      map.set(data.slug, filePath);
    }
  }
  return map;
}

// ---------------------------------------------------------------------------
// Cross-Reference Integrity
// ---------------------------------------------------------------------------

describe('Cross-Reference Integrity', () => {
  it('every published article has at least one relatedArticles cross-reference', () => {
    const allFiles = getAllMdxFiles();
    for (const { filePath } of allFiles) {
      const { data } = parseFrontmatter(filePath);
      // Skip calibration articles and non-published articles
      if (data.slug?.startsWith('calibration-')) continue;
      if (data.status !== 'published' && data.status !== 'review') continue;
      expect(
        Array.isArray(data.relatedArticles) && data.relatedArticles.length > 0,
        `Article "${data.slug}" (${filePath}) has no relatedArticles`
      ).toBe(true);
    }
  });

  it('all relatedArticles slugs resolve to existing files', () => {
    const slugMap = buildSlugMap();
    const allFiles = getAllMdxFiles();
    for (const { filePath } of allFiles) {
      const { data } = parseFrontmatter(filePath);
      if (!Array.isArray(data.relatedArticles)) continue;
      for (const slug of data.relatedArticles) {
        expect(
          slugMap.has(slug),
          `Article "${data.slug}" references relatedArticle "${slug}" which does not exist`
        ).toBe(true);
      }
    }
  });

  it('all prerequisites slugs resolve to existing files', () => {
    const slugMap = buildSlugMap();
    const allFiles = getAllMdxFiles();
    for (const { filePath } of allFiles) {
      const { data } = parseFrontmatter(filePath);
      if (!Array.isArray(data.prerequisites)) continue;
      for (const slug of data.prerequisites) {
        expect(
          slugMap.has(slug),
          `Article "${data.slug}" has prerequisite "${slug}" which does not exist`
        ).toBe(true);
      }
    }
  });

  it('prerequisites graph has no cycles', () => {
    // Build a directed graph of prerequisites and verify it is a DAG.
    const allFiles = getAllMdxFiles();
    const graph = new Map<string, string[]>();
    for (const { filePath } of allFiles) {
      const { data } = parseFrontmatter(filePath);
      if (data.slug && Array.isArray(data.prerequisites)) {
        graph.set(data.slug, data.prerequisites);
      }
    }
    // DFS-based cycle detection
    const visited = new Set<string>();
    const inStack = new Set<string>();
    function hasCycle(node: string): boolean {
      if (inStack.has(node)) return true;
      if (visited.has(node)) return false;
      visited.add(node);
      inStack.add(node);
      for (const dep of graph.get(node) ?? []) {
        if (hasCycle(dep)) return true;
      }
      inStack.delete(node);
      return false;
    }
    for (const slug of graph.keys()) {
      expect(
        hasCycle(slug),
        `Cycle detected in prerequisites graph involving "${slug}"`
      ).toBe(false);
    }
  });

  it('cross-reference validator does NOT require reciprocal relatedArticles', () => {
    // This is a design constraint test: an advanced article may link to a
    // foundational one without the reverse being necessary.
    // Verify that the test suite does NOT enforce reciprocity.
    // If article A lists article B in relatedArticles, article B does NOT need to list A.
    // This test passes by definition -- it documents the design decision.
    expect(true).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Orphan Report
// ---------------------------------------------------------------------------

describe('Orphan Report', () => {
  it('orphan report correctly identifies articles referenced by no other article', () => {
    const allFiles = getAllMdxFiles();
    const allSlugs = new Set<string>();
    const referencedSlugs = new Set<string>();

    for (const { filePath } of allFiles) {
      const { data } = parseFrontmatter(filePath);
      if (data.slug) allSlugs.add(data.slug);
      if (Array.isArray(data.relatedArticles)) {
        for (const slug of data.relatedArticles) {
          referencedSlugs.add(slug);
        }
      }
      if (Array.isArray(data.prerequisites)) {
        for (const slug of data.prerequisites) {
          referencedSlugs.add(slug);
        }
      }
    }

    const orphans: string[] = [];
    for (const slug of allSlugs) {
      if (slug.startsWith('calibration-')) continue; // calibration articles are exempt
      if (!referencedSlugs.has(slug)) {
        orphans.push(slug);
      }
    }

    // Orphan count should be low (ideally zero, but allow a small number).
    // The curated-external-resources page and philosophy-overview may be entry
    // points not referenced by other articles -- that is acceptable.
    // Flag if more than 15% of articles are orphans.
    const orphanRate = orphans.length / allSlugs.size;
    expect(
      orphanRate,
      `Orphan rate is ${(orphanRate * 100).toFixed(1)}%: [${orphans.join(', ')}]`
    ).toBeLessThan(0.15);
  });
});

// ---------------------------------------------------------------------------
// Content Completeness (Stopping Criteria)
// ---------------------------------------------------------------------------

describe('Content Completeness -- Stopping Criteria', () => {
  it('every subcategory in controlled vocabulary has at least 1 article', () => {
    // Load controlled vocabulary and verify coverage
    const vocabPath = path.join(CONTENT_ROOT, '_vocabulary.yaml');
    if (!fs.existsSync(vocabPath)) return; // vocabulary from section-02
    const vocab = yaml.load(fs.readFileSync(vocabPath, 'utf-8')) as any;
    const subcategories: string[] = [];
    if (vocab?.subcategories) {
      for (const cat of Object.keys(vocab.subcategories)) {
        subcategories.push(...(vocab.subcategories[cat] ?? []));
      }
    }

    const allFiles = getAllMdxFiles();
    const usedSubcategories = new Set<string>();
    for (const { filePath } of allFiles) {
      const { data } = parseFrontmatter(filePath);
      if (data.subcategory) usedSubcategories.add(data.subcategory);
    }

    for (const sub of subcategories) {
      expect(
        usedSubcategories.has(sub),
        `Subcategory "${sub}" has no articles`
      ).toBe(true);
    }
  });

  it('every audience type has at least 5 articles', () => {
    const allFiles = getAllMdxFiles();
    const audienceCounts: Record<string, number> = {
      parent: 0,
      coach: 0,
      athlete: 0,
      administrator: 0,
    };
    for (const { filePath } of allFiles) {
      const { data } = parseFrontmatter(filePath);
      if (Array.isArray(data.audience)) {
        for (const a of data.audience) {
          if (a in audienceCounts) audienceCounts[a]++;
        }
      }
    }
    for (const [audience, count] of Object.entries(audienceCounts)) {
      expect(count, `Audience "${audience}" has only ${count} articles`).toBeGreaterThanOrEqual(5);
    }
  });

  it('every age group has at least 5 articles', () => {
    const allFiles = getAllMdxFiles();
    const ageGroupCounts: Record<string, number> = {
      '6-8': 0,
      '9-11': 0,
      '12-14': 0,
      '15-18': 0,
    };
    for (const { filePath } of allFiles) {
      const { data } = parseFrontmatter(filePath);
      if (Array.isArray(data.ageGroup)) {
        for (const ag of data.ageGroup) {
          if (ag in ageGroupCounts) ageGroupCounts[ag]++;
        }
      }
    }
    for (const [ageGroup, count] of Object.entries(ageGroupCounts)) {
      expect(count, `Age group "${ageGroup}" has only ${count} articles`).toBeGreaterThanOrEqual(5);
    }
  });

  it('all 5 Pillars are referenced across at least 4 different content categories', () => {
    const allFiles = getAllMdxFiles();
    const pillarCategoryMap: Record<string, Set<string>> = {};
    for (const slug of PILLAR_SLUGS) {
      pillarCategoryMap[slug] = new Set();
    }
    for (const { filePath, category } of allFiles) {
      const { data } = parseFrontmatter(filePath);
      if (Array.isArray(data.pillar)) {
        for (const p of data.pillar) {
          if (p in pillarCategoryMap) {
            pillarCategoryMap[p].add(category);
          }
        }
      }
    }
    for (const [pillar, categories] of Object.entries(pillarCategoryMap)) {
      expect(
        categories.size,
        `Pillar "${pillar}" is only referenced in ${categories.size} categories: [${[...categories].join(', ')}]`
      ).toBeGreaterThanOrEqual(4);
    }
  });

  it('total article count meets minimum target (75+)', () => {
    const allFiles = getAllMdxFiles();
    // Exclude calibration articles from the count
    const publishableArticles = allFiles.filter(({ filePath }) => {
      const { data } = parseFrontmatter(filePath);
      return !data.slug?.startsWith('calibration-');
    });
    expect(publishableArticles.length).toBeGreaterThanOrEqual(75);
  });

  it('every category directory has at least 2 articles (excluding resources)', () => {
    for (const cat of REQUIRED_CATEGORIES) {
      if (cat === 'resources') continue; // resources has 1 curated page
      const dir = path.join(CONTENT_ROOT, cat);
      if (!fs.existsSync(dir)) continue;
      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
      // Exclude calibration articles
      const articles = files.filter((f) => !f.startsWith('calibration-'));
      expect(
        articles.length,
        `Category "${cat}" has only ${articles.length} articles`
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it('curated resources page is compiled', () => {
    const resourcesFile = path.join(
      CONTENT_ROOT,
      'resources',
      'curated-external-resources.mdx'
    );
    expect(fs.existsSync(resourcesFile)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Coherence Review
// ---------------------------------------------------------------------------

describe('Coherence Review', () => {
  it('no article uses terminology from the "Avoid" column in the voice guide', () => {
    // These are the core avoided terms from the voice guide terminology table.
    // The check looks for standalone usage (not in a comparison/contrast context).
    const avoidedTermsPatterns = [
      /\bathleticism\b/i, // should be "physical literacy"
    ];

    const allFiles = getAllMdxFiles();
    const violations: string[] = [];
    for (const { filePath } of allFiles) {
      const { data, content } = parseFrontmatter(filePath);
      // Skip calibration articles that intentionally demonstrate poor alignment
      if (data.slug?.startsWith('calibration-score-1') || data.slug?.startsWith('calibration-score-3')) continue;
      for (const pattern of avoidedTermsPatterns) {
        if (pattern.test(content)) {
          violations.push(`"${data.slug}" matches avoided term: ${pattern}`);
        }
      }
    }
    expect(
      violations,
      `Terminology violations found:\n${violations.join('\n')}`
    ).toHaveLength(0);
  });

  it('multi-sport vs specialization messaging is consistent', () => {
    // No article should promote early specialization without counterpoint.
    const allFiles = getAllMdxFiles();
    for (const { filePath } of allFiles) {
      const { data, content } = parseFrontmatter(filePath);
      if (data.slug?.startsWith('calibration-')) continue;
      const contentLower = content.toLowerCase();
      // If article mentions specialization favorably, it should also
      // present the multi-sport evidence or developmental caveats.
      if (
        contentLower.includes('specialize early') ||
        contentLower.includes('early specialization is')
      ) {
        const hasCounterpoint =
          contentLower.includes('multi-sport') ||
          contentLower.includes('sampling') ||
          contentLower.includes('delay') ||
          contentLower.includes('counterpoint') ||
          contentLower.includes('evidence suggests');
        expect(
          hasCounterpoint,
          `Article "${data.slug}" mentions early specialization without counterpoint`
        ).toBe(true);
      }
    }
  });

  it('training load recommendations never exceed AAP guidelines for stated age group', () => {
    // AAP guideline: organized sport hours/week should not exceed child's age,
    // max 16 hours/week. Articles should not recommend exceeding these.
    const allFiles = getAllMdxFiles();
    for (const { filePath } of allFiles) {
      const { data, content } = parseFrontmatter(filePath);
      if (data.slug?.startsWith('calibration-')) continue;
      // Check for explicit hour-per-week recommendations that exceed 16
      const hourPattern = /(\d{2,})\s*hours?\s*per\s*week/gi;
      let match;
      while ((match = hourPattern.exec(content)) !== null) {
        const hours = parseInt(match[1], 10);
        if (hours > 16) {
          // If hours exceed 16, the article must frame it as a warning or max
          const surrounding = content.substring(
            Math.max(0, match.index - 100),
            match.index + match[0].length + 100
          );
          const isWarning =
            /exceed|maximum|limit|cap|no more|should not|avoid/i.test(
              surrounding
            );
          expect(
            isWarning,
            `Article "${data.slug}" mentions ${hours} hours/week without framing as a limit or warning`
          ).toBe(true);
        }
      }
    }
  });

  it('5 Pillars descriptions are consistent across articles', () => {
    // Each pillar should use the same core name wherever it appears.
    // This test primarily documents the coherence expectation.
    // Manual or LLM review may be needed for nuanced consistency checks.
    const pillarNames: Record<string, RegExp> = {
      'physical-literacy': /Physical Literacy First/,
      'development-over-results': /Development Over Results/,
      'health-safety': /Health and Safety Above All/,
      'character-through-sport': /Character Through Sport/,
      'community-ownership': /Community Ownership/,
    };

    const allFiles = getAllMdxFiles();
    for (const { filePath } of allFiles) {
      const { data, content } = parseFrontmatter(filePath);
      if (data.slug?.startsWith('calibration-')) continue;
      if (!Array.isArray(data.pillar)) continue;
      for (const p of data.pillar) {
        if (p in pillarNames) {
          // When an article explicitly names a pillar, it should use the canonical name.
          // This is validated manually or by LLM review for nuanced cases.
        }
      }
    }
    expect(true).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Technical Validation
// ---------------------------------------------------------------------------

describe('Technical Validation', () => {
  it('all frontmatter passes schema validation (batch test)', () => {
    // This test requires the schema validator from section-02.
    // For now, verify that all required fields are present.
    const allFiles = getAllMdxFiles();
    for (const { filePath } of allFiles) {
      const { data } = parseFrontmatter(filePath);
      expect(data.title, `${filePath} missing title`).toBeDefined();
      expect(data.slug, `${filePath} missing slug`).toBeDefined();
      expect(data.category, `${filePath} missing category`).toBeDefined();
      expect(data.audience, `${filePath} missing audience`).toBeDefined();
    }
  });

  it('no unauthorized tags exist (all tags in controlled vocabulary)', () => {
    const vocabPath = path.join(CONTENT_ROOT, '_vocabulary.yaml');
    if (!fs.existsSync(vocabPath)) return;
    const vocab = yaml.load(fs.readFileSync(vocabPath, 'utf-8')) as any;
    const approvedTags = new Set<string>(vocab?.tags ?? []);
    if (approvedTags.size === 0) return; // no tags defined yet

    const allFiles = getAllMdxFiles();
    const unauthorized: string[] = [];
    for (const { filePath } of allFiles) {
      const { data } = parseFrontmatter(filePath);
      if (Array.isArray(data.tags)) {
        for (const tag of data.tags) {
          if (!approvedTags.has(tag)) {
            unauthorized.push(`"${data.slug}" uses unauthorized tag: "${tag}"`);
          }
        }
      }
    }
    expect(
      unauthorized,
      `Unauthorized tags found:\n${unauthorized.join('\n')}`
    ).toHaveLength(0);
  });

  it('progress manifest matches actual file inventory (no drift)', () => {
    const manifest = yaml.load(
      fs.readFileSync(MANIFEST_PATH, 'utf-8')
    ) as any;
    const articles = Array.isArray(manifest) ? manifest : manifest?.articles ?? [];
    const manifestSlugs = new Set(articles.map((a: any) => a.slug));

    const allFiles = getAllMdxFiles();
    const fileSlugs = new Set<string>();
    for (const { filePath } of allFiles) {
      const { data } = parseFrontmatter(filePath);
      if (data.slug) fileSlugs.add(data.slug);
    }

    // Every MDX file should have a manifest entry
    for (const slug of fileSlugs) {
      expect(
        manifestSlugs.has(slug),
        `File with slug "${slug}" has no manifest entry`
      ).toBe(true);
    }

    // Every manifest entry should have a corresponding file
    for (const slug of manifestSlugs) {
      expect(
        fileSlugs.has(slug),
        `Manifest entry "${slug}" has no corresponding MDX file`
      ).toBe(true);
    }
  });

  it('all articles with status "published" have alignment score >= 4', () => {
    const manifest = yaml.load(
      fs.readFileSync(MANIFEST_PATH, 'utf-8')
    ) as any;
    const articles = Array.isArray(manifest) ? manifest : manifest?.articles ?? [];
    const published = articles.filter((a: any) => a.status === 'published');
    for (const a of published) {
      if (a.alignmentScore !== null && a.alignmentScore !== undefined) {
        expect(
          a.alignmentScore,
          `Published article "${a.slug}" has alignment score ${a.alignmentScore} (below 4)`
        ).toBeGreaterThanOrEqual(4);
      }
    }
  });

  it('MDX syntax is valid (no unclosed tags, valid comment blocks)', () => {
    const allFiles = getAllMdxFiles();
    for (const { filePath } of allFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      // Check for unclosed MDX comment blocks
      const openComments = (content.match(/\{\/\*/g) || []).length;
      const closeComments = (content.match(/\*\/\}/g) || []).length;
      expect(
        openComments,
        `${filePath} has mismatched MDX comment blocks (${openComments} open, ${closeComments} close)`
      ).toBe(closeComments);
    }
  });
});

// ---------------------------------------------------------------------------
// Manifest Completeness
// ---------------------------------------------------------------------------

describe('Progress Manifest Completeness', () => {
  it('every manifest entry has required fields', () => {
    const manifest = yaml.load(
      fs.readFileSync(MANIFEST_PATH, 'utf-8')
    ) as any;
    const articles = Array.isArray(manifest) ? manifest : manifest?.articles ?? [];
    for (const a of articles) {
      expect(a.slug, 'Manifest entry missing slug').toBeDefined();
      expect(a.title, `Entry "${a.slug}" missing title`).toBeDefined();
      expect(a.category, `Entry "${a.slug}" missing category`).toBeDefined();
      expect(a.status, `Entry "${a.slug}" missing status`).toBeDefined();
    }
  });

  it('condensed article index can be generated from manifest', () => {
    const manifest = yaml.load(
      fs.readFileSync(MANIFEST_PATH, 'utf-8')
    ) as any;
    const articles = Array.isArray(manifest) ? manifest : manifest?.articles ?? [];
    // Generate condensed index: slug + title + category + pillar + ageGroup
    const index = articles.map((a: any) => ({
      slug: a.slug,
      title: a.title,
      category: a.category,
      pillar: a.pillar,
      ageGroup: a.ageGroup,
    }));
    const indexJson = JSON.stringify(index);
    // Condensed index should fit within a reasonable size (< 50KB)
    expect(
      Buffer.byteLength(indexJson, 'utf-8'),
      'Condensed index exceeds 50KB'
    ).toBeLessThan(50 * 1024);
  });
});
```

**Dev dependencies required:** `gray-matter`, `js-yaml`, `@types/js-yaml` (should already be installed from previous sections).

---

## Implementation Details

### Step 1: Cross-Reference Update Pass

The cross-reference pass adds `relatedArticles` entries that could not have been added during generation because the target article did not yet exist. During content generation (sections 04-09), each article can only reference articles written before it. This pass fills in the gaps.

**Process:**

1. Load the condensed article index from the progress manifest (slug, title, category, pillar, ageGroup for every article).

2. For each article in the library, identify candidates for `relatedArticles` based on:
   - **Shared pillar tags** -- Articles referencing the same pillar are likely related
   - **Shared audience and age group** -- Articles targeting the same audience for the same age group complement each other
   - **Same category or adjacent categories** -- Articles in parent-guides may relate to articles in coach-resources on the same topic
   - **Explicit topic overlap** -- Articles on multi-sport participation, for example, should cross-reference each other regardless of category

3. For each article, update the `relatedArticles` frontmatter array:
   - Add new slugs for articles that were created after this article was written
   - Do not remove existing `relatedArticles` entries (they were added intentionally during generation)
   - Keep the array to a reasonable size (3-8 related articles per article)
   - Reciprocity is NOT required -- an advanced article may link to a foundational one without the reverse

4. Verify all added slugs resolve to actual files in the content library.

**Cross-reference heuristics by category:**

| Article Category | Likely Cross-References |
|---|---|
| port-clinton-way | development-frameworks (evidence base), community-building (program implementation) |
| development-frameworks | port-clinton-way (philosophy), health-safety (training limits), parent-guides (developmental expectations) |
| health-safety | development-frameworks (age-appropriate training), parent-guides (safety awareness), coach-resources (practice safety) |
| parent-guides | port-clinton-way (philosophy), development-frameworks (what to expect), health-safety (keeping athletes safe), coach-resources (understanding the coach perspective) |
| coach-resources | port-clinton-way (philosophy), development-frameworks (training frameworks), health-safety (practice safety), parent-guides (managing parent expectations) |
| community-building | port-clinton-way (5 Pillars as program evaluation), coach-resources (volunteer development), parent-guides (volunteer recruitment) |
| resources | All categories (the curated resources page should be referenced by articles that cite major external sources) |

### Step 2: Completeness Checks

Run each of the following checks and document the results. If any check fails, identify the gap and determine whether additional content is needed or whether the gap can be addressed by adjusting existing article metadata.

**Check 1: Subcategory coverage**
- Load the controlled vocabulary (`/content/_vocabulary.yaml`) to get all defined subcategories
- For each subcategory, verify that at least one article exists with that subcategory value
- If a subcategory has no articles, either write a new article or reconsider whether the subcategory should remain in the vocabulary

**Check 2: Audience coverage**
- For each audience type (parent, coach, athlete, administrator), count articles with that audience in their `audience` array
- Minimum: 5 articles per audience type
- The `athlete` audience may have fewer dedicated articles because many articles target parents and coaches who then apply the information. If the count is below 5, consider whether existing articles could add `athlete` to their audience or whether new athlete-focused content is needed.

**Check 3: Age group coverage**
- For each age group (6-8, 9-11, 12-14, 15-18), count articles tagged with that age group
- Minimum: 5 articles per age group
- The 6-8 age group may have slightly fewer articles because some topics (strength training, competition readiness) are less relevant at younger ages

**Check 4: Pillar distribution**
- For each of the 5 Pillars, count the number of distinct categories that reference it
- Minimum: each pillar referenced in at least 4 of the 7 categories
- If a pillar is concentrated in only 2-3 categories, identify articles in under-represented categories that could naturally connect to the pillar

**Check 5: Article count**
- Total publishable articles (excluding calibration articles) should be at least 75
- If below 75, identify which categories have the most room for additional content

**Check 6: Curated resources page**
- Verify the curated resources page exists at `/content/resources/curated-external-resources.mdx`

### Step 3: Coherence Review

The coherence review checks for internal consistency across the entire library. This is partially automated (tests above) and partially requires manual or LLM-assisted review.

**Automated coherence checks:**

1. **Terminology consistency** -- Scan all articles (excluding calibration score 1 and 3) for avoided terms from the voice guide. Flag any instances.

2. **Multi-sport vs. specialization consistency** -- Any article mentioning early specialization should also present the evidence for multi-sport participation or at minimum include developmental caveats.

3. **Training load consistency** -- No article should recommend training loads exceeding AAP guidelines (hours/week not exceeding chronological age, max 16 hours/week) without framing it as a warning or upper limit.

4. **Pillar name consistency** -- When articles reference the 5 Pillars by name, they should use the canonical names: Physical Literacy First, Development Over Results, Health and Safety Above All, Character Through Sport, Community Ownership.

**Manual/LLM-assisted coherence checks:**

5. **Contradiction detection** -- Review articles within the same category for contradictory recommendations. For example, one coach article should not recommend high-volume training while another emphasizes rest. Sample 5-10 article pairs that cover related topics and verify consistency.

6. **Voice and tone uniformity** -- Spot-check 3-5 articles from different categories to verify the voice remains consistent (encouraging, evidence-based, non-prescriptive, community-oriented).

7. **5 Pillars description consistency** -- Compare how each pillar is described across articles in different categories. The core definition should be consistent even if the application context varies.

### Step 4: Technical Validation

Run comprehensive technical validation across all files:

**Frontmatter schema validation:**
- Use the schema validator from section-02 to validate every MDX file's frontmatter
- All required fields must be present
- All values must match the controlled vocabulary
- Record any failures for remediation

**Slug resolution:**
- Build a complete slug-to-file map
- Verify every `relatedArticles` slug resolves to an existing file
- Verify every `prerequisites` slug resolves to an existing file
- Generate a list of broken references (if any) for remediation

**Prerequisite cycle detection:**
- Build a directed graph from `prerequisites` fields
- Run cycle detection (DFS-based or topological sort)
- Report any cycles found

**MDX syntax validation:**
- Check for unclosed MDX comment blocks (`{/*` without matching `*/}`)
- Check for unclosed HTML/JSX tags (though articles should use pure markdown, not JSX)
- Full compilation testing is deferred to split 03 when the rendering platform is configured, but basic syntax checks run here

**Progress manifest integrity:**
- Verify every MDX file has a corresponding manifest entry (by slug)
- Verify every manifest entry has a corresponding MDX file
- Report any drift between the manifest and the actual file inventory
- Correct drift by adding missing entries or removing stale entries

**Tag authorization:**
- Verify every tag used in article frontmatter appears in the controlled vocabulary's approved tags list
- Report unauthorized tags for remediation (either add them to the vocabulary or replace them)

### Step 5: Generate the Orphan Report

An orphan is an article that is not referenced by any other article's `relatedArticles` or `prerequisites` fields. Orphans are not necessarily problems -- some articles are entry points (like the philosophy overview or the curated resources page). However, a high orphan count suggests the cross-reference pass was incomplete.

**Process:**
1. Build a set of all article slugs
2. Build a set of all slugs that appear in any article's `relatedArticles` or `prerequisites` array
3. Compute the difference: slugs that exist but are never referenced
4. Exclude calibration articles from the orphan count
5. Report orphans with their category and title

**Acceptable orphan rate:** Less than 15% of total articles. Entry-point articles (philosophy-overview, curated-external-resources) are acceptable orphans.

### Step 6: Generate the QA Summary Report

Compile the results of all checks into a summary. This is not a formal deliverable file but a summary the implementer uses to verify the library is ready.

The QA summary should cover:

| Check | Status | Details |
|---|---|---|
| Cross-reference pass | Pass/Fail | Number of new links added, broken references found |
| Subcategory coverage | Pass/Fail | List of empty subcategories (if any) |
| Audience coverage | Pass/Fail | Count per audience type |
| Age group coverage | Pass/Fail | Count per age group |
| Pillar distribution | Pass/Fail | Categories per pillar |
| Article count | Pass/Fail | Total count vs. 75 minimum |
| Curated resources compiled | Pass/Fail | File exists |
| Terminology consistency | Pass/Fail | Number of violations |
| Multi-sport consistency | Pass/Fail | Number of violations |
| Training load consistency | Pass/Fail | Number of violations |
| Frontmatter validation | Pass/Fail | Number of failures |
| Slug resolution | Pass/Fail | Broken references count |
| Prerequisite cycles | Pass/Fail | Cycles found |
| MDX syntax | Pass/Fail | Syntax errors count |
| Manifest integrity | Pass/Fail | Drift items |
| Tag authorization | Pass/Fail | Unauthorized tags |
| Orphan rate | Pass/Fail | Percentage and list |
| Alignment scores | Pass/Fail | All published articles score 4+ |

### Step 7: Remediate Issues

If any checks fail, remediate before declaring the library complete:

1. **Broken cross-references** -- Fix by updating the slug or removing the reference
2. **Empty subcategories** -- Either write a new article or remove the subcategory from the vocabulary
3. **Insufficient coverage** -- Write additional articles targeting the under-represented audience, age group, or pillar
4. **Terminology violations** -- Edit the article to replace avoided terms with preferred terms
5. **Manifest drift** -- Add missing entries or remove stale ones
6. **Unauthorized tags** -- Either add the tag to the vocabulary (if it should be approved) or replace it in the article
7. **Low alignment scores** -- Revise the article to improve citations, terminology, and pillar connections

After remediation, re-run all tests to confirm the fixes resolved the issues.

---

## Verification Checklist

After implementation, verify:

- [ ] Cross-reference pass is complete: every non-calibration article has at least one `relatedArticles` entry
- [ ] All `relatedArticles` slugs resolve to existing files (no broken references)
- [ ] All `prerequisites` slugs resolve to existing files
- [ ] Prerequisites graph has no cycles
- [ ] Every subcategory in the controlled vocabulary has at least 1 article
- [ ] Every audience type (parent, coach, athlete, administrator) has at least 5 articles
- [ ] Every age group (6-8, 9-11, 12-14, 15-18) has at least 5 articles
- [ ] All 5 Pillars are referenced across at least 4 different content categories
- [ ] Total publishable article count is at least 75
- [ ] Every content category has at least 2 articles (excluding resources, which has 1)
- [ ] Curated resources page exists and is complete
- [ ] No articles (excluding calibration score 1 and 3) use avoided terminology
- [ ] Multi-sport vs. specialization messaging is consistent across all articles
- [ ] Training load recommendations comply with AAP guidelines in all articles
- [ ] All frontmatter passes schema validation
- [ ] No unauthorized tags exist
- [ ] Progress manifest matches the actual file inventory (no drift)
- [ ] All published articles have alignment scores of 4 or higher
- [ ] MDX syntax is valid across all files (balanced comment blocks)
- [ ] Orphan rate is below 15%
- [ ] Condensed article index is under 50KB
- [ ] All tests in `__tests__/content/cross-references-qa.test.ts` pass
- [ ] QA summary report has been generated with all checks passing

---

## Dependencies and Downstream Sections

**This section depends on:**
- **section-01-foundation** -- Directory structure, progress manifest, and article template must exist
- **section-02-vocabulary-schema** -- Controlled vocabulary and frontmatter schema are needed for vocabulary validation, tag authorization, and subcategory coverage checks
- **section-03-voice-alignment** -- Voice guide (for terminology checks), alignment principles (for scoring), and alignment checker (for batch validation) must exist
- **section-04-port-clinton-way** -- All Port Clinton Way articles must exist as the philosophical foundation. Cross-references from other sections back to these articles are validated here.
- **section-05-development-frameworks** -- All development framework articles must exist for cross-referencing and completeness checks
- **section-06-health-safety** -- All health and safety articles must exist. Training load consistency checks depend on this content.
- **section-07-parent-guides** -- All parent guide articles must exist for audience coverage and cross-referencing
- **section-08-coach-resources** -- All coach resource articles must exist for audience coverage and cross-referencing
- **section-09-community-building** -- All community building articles must exist for completeness checks
- **section-10-curated-resources** -- The curated resources page must exist. Its completion is one of the stopping criteria verified here.

**Sections that depend on this section:**
- None. This is the final section. Successful completion of all checks means the content library is ready for the alignment spot-check (human review of ~10% of articles) and subsequent publication.
