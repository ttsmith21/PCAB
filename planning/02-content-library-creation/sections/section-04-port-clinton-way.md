# Section 04: Port Clinton Way -- 5 Pillars and Philosophical Foundation Articles

## Overview

This section produces the philosophical foundation of the entire content library: 8-10 articles for the Port Clinton Way category. These are the first "real" content articles written (the calibration articles from section-03 are scoring anchors, not publication content). Every subsequent content section (05-10) references the philosophy, pillar definitions, and citations established here.

The Port Clinton Way articles include one article per pillar (5 articles), plus additional articles covering the program philosophy overview, age-appropriate character development milestones, identity-based motivation, and the multi-sport philosophy. All pillar articles receive "critical" AD placeholder tier because the Athletic Director must contribute personal perspective before publication.

**What gets created:**

| Deliverable | Path | Purpose |
|---|---|---|
| 5 Pillar articles | `/content/port-clinton-way/{pillar-slug}.mdx` | One article defining each of the 5 Pillars |
| Philosophy overview | `/content/port-clinton-way/philosophy-overview.mdx` | High-level introduction to The Port Clinton Way |
| Character milestones | `/content/port-clinton-way/character-development-milestones.mdx` | Age-appropriate character development progression |
| Identity motivation | `/content/port-clinton-way/identity-based-motivation.mdx` | "We are the kind of people who..." identity framework |
| Multi-sport philosophy | `/content/port-clinton-way/multi-sport-philosophy.mdx` | Evidence-based case for multi-sport participation |
| Updated progress manifest | `/content/_progress.yaml` | All new articles registered with metadata |

**Article count:** 9 articles (5 pillars + 4 supporting articles). A 10th article may be added if the implementer identifies a gap during writing.

---

## Tests (Write First)

All tests use Vitest. Tests for this section live at `__tests__/content/port-clinton-way.test.ts`.

```typescript
// File: __tests__/content/port-clinton-way.test.ts

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import matter from 'gray-matter';

const CONTENT_ROOT = path.resolve(__dirname, '../../content');
const PCW_DIR = path.join(CONTENT_ROOT, 'port-clinton-way');
const MANIFEST_PATH = path.join(CONTENT_ROOT, '_progress.yaml');

const PILLAR_SLUGS = [
  'physical-literacy',
  'development-over-results',
  'health-safety',
  'character-through-sport',
  'community-ownership',
];

// Helper: get all MDX files in a directory (excluding calibration articles)
function getArticleFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') && !f.startsWith('calibration-'));
}

// Helper: parse frontmatter from an MDX file
function parseFrontmatter(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return matter(content);
}

describe('Port Clinton Way -- Pillar Articles', () => {
  it('exactly 5 pillar articles exist (one per pillar)', () => {
    // Each pillar slug should have a corresponding MDX file.
    // Files may be named by pillar slug or have the pillar in frontmatter.
    const files = getArticleFiles(PCW_DIR);
    const pillarArticles = files.filter((f) => {
      const { data } = parseFrontmatter(path.join(PCW_DIR, f));
      return (
        data.subcategory === 'five-pillars' &&
        Array.isArray(data.pillar) &&
        data.pillar.length === 1
      );
    });
    expect(pillarArticles.length).toBe(5);
  });

  it("each pillar article's frontmatter includes its own pillar slug", () => {
    const files = getArticleFiles(PCW_DIR);
    for (const slug of PILLAR_SLUGS) {
      const pillarFile = files.find((f) => {
        const { data } = parseFrontmatter(path.join(PCW_DIR, f));
        return Array.isArray(data.pillar) && data.pillar.includes(slug);
      });
      expect(pillarFile).toBeDefined();
    }
  });

  it('pillar articles cite all 4 source frameworks (LTAD, PCA, NSCA, AAP)', () => {
    const files = getArticleFiles(PCW_DIR);
    const pillarFiles = files.filter((f) => {
      const { data } = parseFrontmatter(path.join(PCW_DIR, f));
      return data.subcategory === 'five-pillars';
    });
    // Across all 5 pillar articles combined, all 4 frameworks should be cited.
    const allContent = pillarFiles
      .map((f) => fs.readFileSync(path.join(PCW_DIR, f), 'utf-8'))
      .join('\n');
    expect(allContent).toMatch(/LTAD|Long-Term Athlete Development/i);
    expect(allContent).toMatch(/Positive Coaching Alliance|PCA/);
    expect(allContent).toMatch(/NSCA|National Strength and Conditioning/i);
    expect(allContent).toMatch(/AAP|American Academy of Pediatrics/i);
  });

  it('all pillar articles have AD placeholder with "critical" priority', () => {
    const files = getArticleFiles(PCW_DIR);
    const pillarFiles = files.filter((f) => {
      const { data } = parseFrontmatter(path.join(PCW_DIR, f));
      return data.subcategory === 'five-pillars';
    });
    for (const f of pillarFiles) {
      const content = fs.readFileSync(path.join(PCW_DIR, f), 'utf-8');
      expect(content).toContain('AD_INPUT_NEEDED');
      expect(content).toMatch(/Priority:\s*critical/i);
    }
  });
});

describe('Port Clinton Way -- Supporting Articles', () => {
  it('philosophy overview article exists', () => {
    const files = getArticleFiles(PCW_DIR);
    const overview = files.find((f) => {
      const { data } = parseFrontmatter(path.join(PCW_DIR, f));
      return data.slug === 'philosophy-overview' || f.includes('philosophy-overview');
    });
    expect(overview).toBeDefined();
  });

  it('character development milestones article exists', () => {
    const files = getArticleFiles(PCW_DIR);
    const milestones = files.find((f) => {
      const { data } = parseFrontmatter(path.join(PCW_DIR, f));
      return (
        data.slug === 'character-development-milestones' ||
        f.includes('character-development')
      );
    });
    expect(milestones).toBeDefined();
  });

  it('identity-based motivation article exists', () => {
    const files = getArticleFiles(PCW_DIR);
    const identity = files.find((f) => {
      const { data } = parseFrontmatter(path.join(PCW_DIR, f));
      return (
        data.slug === 'identity-based-motivation' ||
        f.includes('identity-based-motivation')
      );
    });
    expect(identity).toBeDefined();
  });

  it('multi-sport philosophy article exists', () => {
    const files = getArticleFiles(PCW_DIR);
    const multiSport = files.find((f) => {
      const { data } = parseFrontmatter(path.join(PCW_DIR, f));
      return (
        data.slug === 'multi-sport-philosophy' || f.includes('multi-sport')
      );
    });
    expect(multiSport).toBeDefined();
  });

  it('minimum 8 articles exist in /content/port-clinton-way/ (excluding calibration)', () => {
    const files = getArticleFiles(PCW_DIR);
    expect(files.length).toBeGreaterThanOrEqual(8);
  });
});

describe('Port Clinton Way -- Content Quality', () => {
  it('all articles contain required sections', () => {
    const files = getArticleFiles(PCW_DIR);
    for (const f of files) {
      const content = fs.readFileSync(path.join(PCW_DIR, f), 'utf-8');
      expect(content).toContain('Key Takeaways');
      expect(content).toContain('Practical Application');
      expect(content).toContain('References');
    }
  });

  it('all articles contain AD_INPUT_NEEDED placeholder', () => {
    const files = getArticleFiles(PCW_DIR);
    for (const f of files) {
      const content = fs.readFileSync(path.join(PCW_DIR, f), 'utf-8');
      expect(content).toContain('AD_INPUT_NEEDED');
    }
  });

  it('all articles have valid frontmatter with category port-clinton-way', () => {
    const files = getArticleFiles(PCW_DIR);
    for (const f of files) {
      const { data } = parseFrontmatter(path.join(PCW_DIR, f));
      expect(data.category).toBe('port-clinton-way');
      expect(data.title).toBeDefined();
      expect(data.slug).toBeDefined();
      expect(data.audience).toBeDefined();
      expect(data.ageGroup).toBeDefined();
      expect(data.pillar).toBeDefined();
    }
  });

  it('all articles pass alignment score of 4+', () => {
    // This test requires the alignment checker from section-03.
    // Run runDeterministicChecks() on each article.
    // For LLM scoring, verify that the manifest records alignmentScore >= 4.
    const manifest = yaml.load(
      fs.readFileSync(MANIFEST_PATH, 'utf-8')
    ) as any;
    const articles = Array.isArray(manifest) ? manifest : manifest?.articles ?? [];
    const pcwArticles = articles.filter(
      (a: any) =>
        a.category === 'port-clinton-way' &&
        !a.slug?.startsWith('calibration-')
    );
    for (const a of pcwArticles) {
      if (a.alignmentScore !== null) {
        expect(a.alignmentScore).toBeGreaterThanOrEqual(4);
      }
    }
  });
});

describe('Port Clinton Way -- Progress Manifest', () => {
  it('all Port Clinton Way articles have entries in the progress manifest', () => {
    const files = getArticleFiles(PCW_DIR);
    const manifest = yaml.load(
      fs.readFileSync(MANIFEST_PATH, 'utf-8')
    ) as any;
    const articles = Array.isArray(manifest) ? manifest : manifest?.articles ?? [];
    const manifestSlugs = articles.map((a: any) => a.slug);
    for (const f of files) {
      const { data } = parseFrontmatter(path.join(PCW_DIR, f));
      expect(manifestSlugs).toContain(data.slug);
    }
  });

  it('manifest entries have required fields', () => {
    const manifest = yaml.load(
      fs.readFileSync(MANIFEST_PATH, 'utf-8')
    ) as any;
    const articles = Array.isArray(manifest) ? manifest : manifest?.articles ?? [];
    const pcwArticles = articles.filter(
      (a: any) => a.category === 'port-clinton-way'
    );
    for (const a of pcwArticles) {
      expect(a.slug).toBeDefined();
      expect(a.title).toBeDefined();
      expect(a.category).toBe('port-clinton-way');
      expect(a.status).toBeDefined();
    }
  });
});
```

**Dev dependency to install:** `gray-matter` for frontmatter parsing in tests.

```bash
npm install -D gray-matter
```

---

## Implementation Details

### Step 1: Write the 5 Pillar Articles

Each pillar gets a dedicated article that defines the pillar with research citations, explains why it matters, provides measurable indicators of success, and includes an AD input placeholder. All 5 pillar articles share common structural elements:

**Shared frontmatter fields for all pillar articles:**
- `category`: `port-clinton-way`
- `subcategory`: `five-pillars`
- `audience`: `[parent, coach, administrator]` (all stakeholders need to understand the pillars)
- `ageGroup`: `[6-8, 9-11, 12-14, 15-18]` (pillars span all ages)
- `contentType`: `guide`
- `status`: `review`
- AD placeholder Priority: `critical`

**Shared body structure for all pillar articles:**
1. Key Takeaways (3-5 bullets)
2. Introduction -- What this pillar is and why it's one of the five
3. Research Foundation -- Specific citations to LTAD, AAP, NSCA, and/or PCA that support this pillar
4. What This Looks Like in Practice -- Age-by-age breakdown of how the pillar manifests
5. Measurable Indicators of Success -- How a program knows it is living this pillar
6. Practical Application -- What parents, coaches, and administrators can do
7. AD_INPUT_NEEDED block (Type: philosophy-statement, Priority: critical, Guidance: 2-3 paragraphs on how the AD sees this pillar manifesting in Port Clinton)
8. References

#### Article 1: Physical Literacy First

**File:** `/content/port-clinton-way/physical-literacy-first.mdx`
**Slug:** `physical-literacy-first`
**Pillar:** `[physical-literacy]`

This article defines the Physical Literacy First pillar. It should explain that every child develops fundamental movement skills (agility, balance, coordination, or "ABCs") before sport-specific training, and that multi-sport participation is the primary vehicle.

Key research to cite:
- LTAD model (Balyi & Hamilton, 2004) stages 1-3 emphasize fundamental movement skills before sport specialization
- NSCA pillars 3-4 on physical literacy and multi-sport sampling
- Canadian Sport for Life's definition of physical literacy as the motivation, confidence, physical competence, knowledge, and understanding to value and take responsibility for engagement in physical activities for life
- PHE Canada's work on physical literacy assessment

Measurable indicators: percentage of athletes participating in 2+ sports, fundamental movement skill assessments at younger ages, coaches reporting on movement quality in practice.

#### Article 2: Development Over Results

**File:** `/content/port-clinton-way/development-over-results.mdx`
**Slug:** `development-over-results`
**Pillar:** `[development-over-results]`

Defines the Development Over Results pillar. Program success is measured by athlete growth (skill acquisition, confidence, continued participation, character development), not win-loss records. Training-to-competition ratios favor development.

Key research to cite:
- LTAD's long-term perspective principle: it takes 10+ years to develop an elite athlete
- PCA's Double-Goal Coach framework: winning AND teaching life lessons
- Research on dropout rates in youth sports and their correlation with outcome-focused environments (Crane & Temple, 2015)
- NSCA position statement on long-term athletic development

Measurable indicators: athlete retention rates year-over-year, training-to-competition ratios by age group, athlete self-reported enjoyment and confidence.

#### Article 3: Health and Safety Above All

**File:** `/content/port-clinton-way/health-safety-above-all.mdx`
**Slug:** `health-safety-above-all`
**Pillar:** `[health-safety]`

Defines the Health and Safety Above All pillar. Training loads respect AAP guidelines (organized sport hours per week should not exceed the child's age, maximum 16 hours/week, mandatory rest days). Covers concussion protocols, injury prevention through proper progression, and the evidence for delaying single-sport specialization until 15-16.

Key research to cite:
- AAP Council on Sports Medicine and Fitness clinical reports (2016, updated guidance)
- AAP guidelines: hours per week not to exceed child's age, max 16 hours/week, at least 1-2 rest days per week
- NFHS concussion protocol guidelines
- Brenner (2016) on sports specialization and injury risk in young athletes
- NSCA pillar 5 on health and well-being

Measurable indicators: compliance with training hour guidelines, rest day policies in place, concussion protocol awareness among coaches, injury rates by sport and age group.

#### Article 4: Character Through Sport

**File:** `/content/port-clinton-way/character-through-sport.mdx`
**Slug:** `character-through-sport`
**Pillar:** `[character-through-sport]`

Defines the Character Through Sport pillar. Athletics builds resilience, teamwork, discipline, and sportsmanship that extend beyond the playing field. Uses the identity-based motivation concept: "We are the kind of people who show respect, give full effort, compete with integrity."

Key research to cite:
- PCA's Second-Goal Teaching framework (life lessons through sports)
- Lerner et al. on the 5 C's of Positive Youth Development (Competence, Confidence, Connection, Character, Caring)
- Holt et al. (2017) systematic review on positive youth development through sport
- Danish, Forneris, & Wallace (2005) on sport-based life skills programs

Measurable indicators: sportsmanship awards or recognition programs, athlete self-reported character growth, community feedback on athlete behavior, presence of team values statements.

#### Article 5: Community Ownership

**File:** `/content/port-clinton-way/community-ownership.mdx`
**Slug:** `community-ownership`
**Pillar:** `[community-ownership]`

Defines the Community Ownership pillar. Every stakeholder (parents, coaches, athletes, administrators, boosters) shares responsibility for the athletic ecosystem. Covers volunteer development, inclusive programs, and coordinated multi-sport scheduling.

Key research to cite:
- NSCA pillars 2 and 9 on inclusive access and qualified oversight
- Aspen Institute's Sport for All, Play for Life initiative on community-level sport ecosystem design
- Fraser-Thomas, Cote, & Deakin (2005) on the role of community programs in youth sport development
- Research on volunteer coach development and retention

Measurable indicators: volunteer recruitment and retention rates, program accessibility (cost, location, scheduling), cross-sport coordination meetings, booster club engagement metrics.

### Step 2: Write the Supporting Articles

#### Article 6: Philosophy Overview

**File:** `/content/port-clinton-way/philosophy-overview.mdx`
**Slug:** `philosophy-overview`
**Subcategory:** `philosophy`
**Pillar:** `[physical-literacy, development-over-results, health-safety, character-through-sport, community-ownership]` (references all 5)
**Audience:** `[parent, coach, athlete, administrator]`
**AD placeholder Priority:** `critical`

This is the entry point to the entire philosophy. It introduces The Port Clinton Way as a synthesis of four established frameworks (LTAD, PCA, NSCA, AAP) distilled into 5 actionable pillars. It briefly introduces each pillar (2-3 sentences each, with links to the detailed pillar articles) and explains the derivation approach. It should position the philosophy as a community agreement, not a top-down mandate.

This article must include `relatedArticles` linking to all 5 pillar articles once they exist.

#### Article 7: Age-Appropriate Character Development Milestones

**File:** `/content/port-clinton-way/character-development-milestones.mdx`
**Slug:** `character-development-milestones`
**Subcategory:** `philosophy`
**Pillar:** `[character-through-sport, development-over-results]`
**Audience:** `[parent, coach]`
**AgeGroup:** `[6-8, 9-11, 12-14, 15-18]`
**AD placeholder Priority:** `valuable`

This article provides a progression of character development expectations by age group:
- **Ages 6-8:** Learning to take turns, following rules, basic sportsmanship (handshakes, congratulating opponents), effort over outcome
- **Ages 9-11:** Teamwork, handling disappointment, encouraging teammates, beginning to self-regulate emotions during competition
- **Ages 12-14:** Leadership, accountability, managing pressure, respecting officials, representing school/community
- **Ages 15-18:** Mentoring younger athletes, integrity under pressure, self-advocacy, connecting sport values to life goals

Cite developmental psychology research (Piaget's stages, Kohlberg's moral development) alongside sport-specific character development literature (PCA, Holt et al.).

#### Article 8: Identity-Based Motivation

**File:** `/content/port-clinton-way/identity-based-motivation.mdx`
**Slug:** `identity-based-motivation`
**Subcategory:** `identity-culture`
**Pillar:** `[character-through-sport, community-ownership]`
**Audience:** `[coach, administrator]`
**AgeGroup:** `[9-11, 12-14, 15-18]`
**AD placeholder Priority:** `valuable`

This article introduces the "We are the kind of people who..." framework for identity-based motivation. Rather than external incentives (trophies, rankings), programs build intrinsic motivation by creating a shared identity: "We are the kind of people who give full effort, support our teammates, respect our opponents, and represent Port Clinton with pride."

Cite:
- Oyserman's identity-based motivation theory
- PCA's culture-building approaches
- Research on intrinsic vs. extrinsic motivation in youth sport (Deci & Ryan, Self-Determination Theory)

This concept is central to the Character Through Sport pillar and should be cross-referenced by many subsequent articles.

#### Article 9: Multi-Sport Philosophy

**File:** `/content/port-clinton-way/multi-sport-philosophy.mdx`
**Slug:** `multi-sport-philosophy`
**Subcategory:** `philosophy`
**Pillar:** `[physical-literacy, development-over-results, health-safety]`
**Audience:** `[parent, coach, administrator]`
**AgeGroup:** `[6-8, 9-11, 12-14, 15-18]`
**AD placeholder Priority:** `valuable`

This is the most philosophically charged article. Follow the tone guidance from the voice guide carefully:
- Present the evidence for multi-sport participation clearly and thoroughly
- Acknowledge legitimate reasons families choose specialization (elite talent pathway, child's own passion)
- Frame as "here's what the evidence says" not "here's what you should do"
- Recognize the small-school practical reality: Port Clinton needs athletes in multiple sports to field competitive teams
- Reference AAP guidelines on specialization timing (delay until 15-16)
- Cite LaPrade et al. (2016) AOSSM early sport specialization consensus statement
- Cite Moesch et al. (2011) on late specialization in elite athletes

This article should explicitly avoid dogmatic anti-specialization positioning while making the evidence-based case compelling.

### Step 3: Run Alignment Checks

After writing each article, run the alignment checker from section-03:

1. Run deterministic checks (frontmatter validation, terminology matching, required sections, AD placeholder)
2. Fix any deterministic issues before proceeding
3. Run LLM scoring (or manually score against the rubric) -- target score 4+
4. If an article scores below 4, revise it:
   - Add missing citations
   - Replace avoided terminology with preferred terms
   - Strengthen pillar connections
   - Ensure age-appropriate framing
5. Record the final alignment score in the progress manifest

### Step 4: Update the Progress Manifest

After all articles are written and validated, append entries to `/content/_progress.yaml` for each new article. Each entry should include:

```yaml
- slug: physical-literacy-first
  title: "Physical Literacy First: The Foundation of Youth Athletic Development"
  category: port-clinton-way
  pillar: [physical-literacy]
  audience: [parent, coach, administrator]
  ageGroup: ["6-8", "9-11", "12-14", "15-18"]
  status: review
  alignmentScore: 5  # or whatever score the article received
  adPlaceholderTier: critical
  wordCount: 2500  # approximate
```

Repeat for all 9 articles. Also verify that the 3 calibration articles from section-03 already have manifest entries; if not, add them.

### Step 5: Add Cross-References

After all Port Clinton Way articles exist, update the `relatedArticles` field in each article's frontmatter:

- Each pillar article should reference the philosophy overview and 1-2 other pillar articles
- The philosophy overview should reference all 5 pillar articles
- The character milestones article should reference the character-through-sport pillar article and the identity-based motivation article
- The identity-based motivation article should reference the character-through-sport pillar article and the character milestones article
- The multi-sport philosophy article should reference physical-literacy-first, development-over-results, and health-safety-above-all pillar articles

Cross-references to articles in other categories (sections 05-10) will be added later as those articles are created.

---

## Verification Checklist

After implementation, verify:

- [ ] 5 pillar articles exist in `/content/port-clinton-way/`, one per pillar
- [ ] Each pillar article's frontmatter `pillar` field includes its own pillar slug
- [ ] All 4 source frameworks (LTAD, PCA, NSCA, AAP) are cited across the 5 pillar articles
- [ ] All pillar articles have AD_INPUT_NEEDED blocks with Priority: critical
- [ ] Philosophy overview, character milestones, identity-based motivation, and multi-sport philosophy articles exist
- [ ] Minimum 8 non-calibration articles exist in `/content/port-clinton-way/`
- [ ] All articles contain Key Takeaways, Practical Application, and References sections
- [ ] All articles have valid frontmatter with `category: port-clinton-way`
- [ ] All articles pass deterministic alignment checks (valid frontmatter, no red-flag patterns)
- [ ] All articles score 4+ on alignment (recorded in manifest)
- [ ] All articles have entries in `/content/_progress.yaml`
- [ ] Cross-references (`relatedArticles`) link related articles within the category
- [ ] `gray-matter` is installed as a dev dependency
- [ ] All tests in `__tests__/content/port-clinton-way.test.ts` pass

---

## Dependencies and Downstream Sections

**This section depends on:**
- **section-01-foundation** -- The `/content/port-clinton-way/` directory and progress manifest must exist
- **section-02-vocabulary-schema** -- The controlled vocabulary and frontmatter schema must be in place so articles have valid frontmatter
- **section-03-voice-alignment** -- The voice guide, alignment principles, and alignment checker must exist so every article can be validated. The three calibration articles already exist in the Port Clinton Way directory.

**Sections that depend on this section:**
- **section-05-development-frameworks** -- References the 5 Pillars and cites the same research foundations. Articles cross-reference Port Clinton Way content.
- **section-06-health-safety** -- References the Health and Safety pillar specifically. Training load guidelines reference the same AAP guidelines cited here.
- **section-07-parent-guides** -- Parent-facing content references the philosophy, pillars, and specific articles from this section.
- **section-08-coach-resources** -- Coach-facing content references the philosophy and alignment principles established here.
- **section-09-community-building** -- Community Building articles use the 5 Pillars as a program evaluation framework, directly referencing the Community Ownership pillar and philosophy overview.
