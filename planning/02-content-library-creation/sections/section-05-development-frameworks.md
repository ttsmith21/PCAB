# Section 05: Development Frameworks -- LTAD, Multi-Sport Evidence, Skill Windows, and Periodization

## Overview

This section creates 10-15 MDX articles in the `/content/development-frameworks/` directory covering the evidence base for youth athlete development. These articles establish the scientific foundation that parent guides (section-07) and coach resources (section-08) will cite. Topics include the Long-Term Athlete Development (LTAD) model, multi-sport participation evidence, age-appropriate skill windows, physical literacy progression, periodization basics, injury prevention through proper progression, and the specialization trap.

Every article follows the standard article body template (created in section-01), uses the controlled vocabulary and frontmatter schema (created in section-02), adheres to the voice guide and alignment principles (created in section-03), and references the 5 Pillars philosophical foundation (created in section-04).

**What gets created:**

| Deliverable | Path | Purpose |
|---|---|---|
| 10-15 MDX articles | `/content/development-frameworks/*.mdx` | Evidence-based development framework content |
| Progress manifest entries | `/content/_progress.yaml` | Updated with new article metadata |
| Cross-references | Updated `relatedArticles` in existing articles | Links from Port Clinton Way articles to new framework articles |

---

## Tests (Write First)

All tests use Vitest. Tests for this section live at `__tests__/content/development-frameworks.test.ts`. These tests validate article count, coverage requirements, frontmatter correctness, and alignment quality.

```typescript
// File: __tests__/content/development-frameworks.test.ts

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_ROOT = path.resolve(__dirname, '../../content');
const CATEGORY_DIR = path.join(CONTENT_ROOT, 'development-frameworks');

function getMdxFiles(): string[] {
  if (!fs.existsSync(CATEGORY_DIR)) return [];
  return fs.readdirSync(CATEGORY_DIR).filter((f) => f.endsWith('.mdx'));
}

function parseFrontmatter(filename: string) {
  const filepath = path.join(CATEGORY_DIR, filename);
  const raw = fs.readFileSync(filepath, 'utf-8');
  return matter(raw);
}

describe('Development Frameworks - Article Count', () => {
  it('has at least 10 articles', () => {
    const files = getMdxFiles();
    expect(files.length).toBeGreaterThanOrEqual(10);
  });
});

describe('Development Frameworks - Age Group Coverage', () => {
  it('all age groups are represented across articles', () => {
    const files = getMdxFiles();
    const allAgeGroups = new Set<string>();
    for (const f of files) {
      const { data } = parseFrontmatter(f);
      if (Array.isArray(data.ageGroup)) {
        data.ageGroup.forEach((ag: string) => allAgeGroups.add(ag));
      }
    }
    expect(allAgeGroups).toContain('6-8');
    expect(allAgeGroups).toContain('9-11');
    expect(allAgeGroups).toContain('12-14');
    expect(allAgeGroups).toContain('15-18');
  });
});

describe('Development Frameworks - LTAD Stage Coverage', () => {
  it('all LTAD stages are covered across articles', () => {
    const files = getMdxFiles();
    const allStages = new Set<string>();
    for (const f of files) {
      const { data } = parseFrontmatter(f);
      if (Array.isArray(data.ltadStage)) {
        data.ltadStage.forEach((s: string) => allStages.add(s));
      }
    }
    expect(allStages).toContain('active-start');
    expect(allStages).toContain('fundamentals');
    expect(allStages).toContain('learn-to-train');
    expect(allStages).toContain('train-to-train');
    expect(allStages).toContain('train-to-compete');
  });
});

describe('Development Frameworks - Multi-Sport Content Balance', () => {
  it('contains at least 2 articles addressing multi-sport participation', () => {
    const files = getMdxFiles();
    let multiSportCount = 0;
    for (const f of files) {
      const { data, content } = parseFrontmatter(f);
      const tags = Array.isArray(data.tags) ? data.tags : [];
      if (
        tags.includes('multi-sport') ||
        content.toLowerCase().includes('multi-sport') ||
        content.toLowerCase().includes('sport sampling')
      ) {
        multiSportCount++;
      }
    }
    expect(multiSportCount).toBeGreaterThanOrEqual(2);
  });
});

describe('Development Frameworks - Frontmatter Validity', () => {
  it('every article has category "development-frameworks"', () => {
    const files = getMdxFiles();
    for (const f of files) {
      const { data } = parseFrontmatter(f);
      expect(data.category).toBe('development-frameworks');
    }
  });

  it('every article has at least one pillar reference', () => {
    const files = getMdxFiles();
    for (const f of files) {
      const { data } = parseFrontmatter(f);
      expect(Array.isArray(data.pillar)).toBe(true);
      expect(data.pillar.length).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('Development Frameworks - Alignment', () => {
  it('all articles pass basic alignment (no prescriptive coaching language)', () => {
    const files = getMdxFiles();
    const prescriptivePatterns = [
      /you should always/i,
      /you must always/i,
      /run this drill/i,
      /use this play/i,
    ];
    for (const f of files) {
      const { content } = parseFrontmatter(f);
      for (const pattern of prescriptivePatterns) {
        expect(content).not.toMatch(pattern);
      }
    }
  });
});
```

**Dev dependency to install** (if not already present): `gray-matter` for parsing MDX frontmatter in tests.

```bash
npm install -D gray-matter
```

---

## Implementation Details

### Background: What "Development Frameworks" Covers

The Development Frameworks category provides the evidence base for the entire content library. Where the Port Clinton Way (section-04) establishes *what* PCAB believes, Development Frameworks establishes *why* those beliefs are grounded in science. Every article in this category should cite specific research from at least one of the four source frameworks:

1. **LTAD (Long-Term Athlete Development)** -- Developed by Istvan Balyi and the Canadian Sport for Life initiative. Defines developmental stages from Active Start through Train to Compete. Emphasizes developmental age over chronological age.
2. **NSCA (National Strength and Conditioning Association)** -- Published 10 Pillars of LTAD. Provides strength and conditioning guidelines by developmental stage.
3. **AAP (American Academy of Pediatrics)** -- Clinical reports on overuse injuries, training limits, and specialization timing. Key guideline: training hours per week should not exceed the child's age, with a maximum of 16 hours/week.
4. **Positive Coaching Alliance (PCA)** -- Double-Goal Coach framework (winning + teaching life lessons). Research on motivation, character development, and parent behavior.

### Article Topic List

Generate articles covering these topics (at minimum). The implementer should write 10-15 articles from this list. Each article targets 2,000-3,000 words.

| # | Slug | Title | Primary Pillar(s) | Age Groups | LTAD Stages |
|---|---|---|---|---|---|
| 1 | `understanding-ltad-model` | Understanding the Long-Term Athlete Development Model | physical-literacy, development-over-results | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |
| 2 | `multi-sport-participation-evidence` | The Case for Multi-Sport Participation: What Research Tells Us | physical-literacy, development-over-results | 6-8, 9-11, 12-14 | active-start, fundamentals, learn-to-train |
| 3 | `age-appropriate-skill-windows` | Age-Appropriate Skill Windows: When Youth Athletes Learn Best | physical-literacy | 6-8, 9-11, 12-14 | active-start, fundamentals, learn-to-train |
| 4 | `physical-literacy-progression` | Building Physical Literacy: A Progression Framework for Youth Athletes | physical-literacy | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train |
| 5 | `periodization-basics-youth` | Periodization Basics for Youth Sports Programs | development-over-results, health-safety | 9-11, 12-14, 15-18 | learn-to-train, train-to-train, train-to-compete |
| 6 | `injury-prevention-proper-progression` | Injury Prevention Through Proper Progression | health-safety | 9-11, 12-14, 15-18 | learn-to-train, train-to-train, train-to-compete |
| 7 | `specialization-trap` | The Specialization Trap: Risks of Early Single-Sport Focus | physical-literacy, health-safety, development-over-results | 9-11, 12-14 | fundamentals, learn-to-train |
| 8 | `training-to-competition-ratios` | Getting the Training-to-Competition Ratio Right | development-over-results | 9-11, 12-14, 15-18 | learn-to-train, train-to-train, train-to-compete |
| 9 | `developmental-age-vs-chronological` | Developmental Age vs. Chronological Age: Why It Matters | physical-literacy, development-over-results | 6-8, 9-11, 12-14 | active-start, fundamentals, learn-to-train, train-to-train |
| 10 | `fundamentals-over-fitness` | Fundamentals Over Fitness: Prioritizing Skill in Early Development | physical-literacy | 6-8, 9-11 | active-start, fundamentals |
| 11 | `growth-and-maturation-in-sport` | Growth and Maturation: How Puberty Affects Young Athletes | health-safety, development-over-results | 12-14, 15-18 | learn-to-train, train-to-train |
| 12 | `sport-sampling-pathway` | The Sport Sampling Pathway: From Play to Performance | physical-literacy, development-over-results | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |

### Per-Article Generation Process

For each article, follow this process:

1. **Set up frontmatter** using the controlled vocabulary from section-02. Every article in this section uses `category: development-frameworks`. Select appropriate values for `subcategory`, `tags`, `audience`, `ageGroup`, `ltadStage`, `contentType`, `pillar`, and `difficulty` from the controlled vocabulary.

2. **Write the article body** following the template from section-01:
   - **Key Takeaways** (3-5 bullet points)
   - **Introduction** (2-3 paragraphs setting context)
   - **Main Content Sections** (3-5 sections with evidence-based content)
   - **Practical Application** (actionable guidance for the stated audience)
   - **AD Placeholder** (format below)
   - **References** (cited sources)

3. **Add AD placeholder** with `optional` tier (development framework articles are complete without AD input):
   ```mdx
   {/* [AD_INPUT_NEEDED]
      Type: endorsement
      Priority: optional
      Context: [Brief description of article topic]
      Guidance: Share how this framework applies to Port Clinton's athletic programs (1-2 paragraphs)
   */}
   ```

4. **Add cross-references** -- check the progress manifest for existing articles (especially Port Clinton Way pillar articles from section-04) and add relevant slugs to the `relatedArticles` frontmatter array.

5. **Update the progress manifest** (`/content/_progress.yaml`) with an entry for each new article.

### Frontmatter Example

Here is an example of a complete frontmatter block for one article in this category:

```yaml
---
title: "Understanding the Long-Term Athlete Development Model"
description: "A comprehensive guide to the LTAD framework and how its developmental stages apply to youth sports programs in Port Clinton."
slug: understanding-ltad-model
date: "2025-01-15"
lastUpdated: "2025-01-15"
category: development-frameworks
subcategory: ltad-stages
tags:
  - ltad
  - developmental-stages
  - youth-development
  - long-term-development
audience:
  - parent
  - coach
  - administrator
ageGroup:
  - "6-8"
  - "9-11"
  - "12-14"
  - "15-18"
ltadStage:
  - active-start
  - fundamentals
  - learn-to-train
  - train-to-train
  - train-to-compete
contentType: framework
pillar:
  - physical-literacy
  - development-over-results
difficulty: beginner
estimatedReadTime: 10
sportRelevance: sport-general
relatedArticles:
  - physical-literacy-first
  - development-over-results
  - multi-sport-participation-evidence
prerequisites: []
references:
  - title: "Long-Term Athlete Development 2.0"
    url: "https://sportforlife.ca/long-term-development/"
    accessed: "2025-01-15"
  - title: "NSCA Position Statement on Long-Term Athletic Development"
    url: "https://journals.lww.com/nsca-jscr/"
    accessed: "2025-01-15"
status: review
---
```

### Content Voice Reminders

All articles in this section must adhere to the voice guide (section-03):

- **Evidence-based, not opinion-based** -- cite specific research for every recommendation
- **Present frameworks, never prescribe** -- describe the LTAD model; do not tell coaches how to implement it in practice
- **Inclusive framing** -- all ability levels, all sports, all family situations
- **Use preferred terminology** -- "development" not "winning," "physical literacy" not "athleticism," "youth athlete" not "kid"
- **Acknowledge nuance** -- when discussing multi-sport vs. specialization, present the evidence clearly but acknowledge legitimate reasons families may choose differently
- **Small-school reality** -- Port Clinton is a small community; athletes often participate in multiple sports out of necessity, which aligns naturally with the evidence base

### Multi-Sport vs. Specialization Treatment

This is the most philosophically charged content area in the library. Articles covering this topic must:

- Present evidence for multi-sport participation thoroughly and with specific citations (e.g., Myer et al., 2015; Jayanthi et al., 2013)
- Acknowledge that some families and athletes choose early specialization, and present the associated evidence (increased overuse injury risk, burnout rates) without being judgmental
- Frame as "here is what the evidence says" rather than "here is what you should do"
- Recognize the small-school practical reality: Port Clinton needs athletes across multiple sports, which happens to align with the research
- Never position PCAB as telling families what to do -- the organization's role is to present evidence and let families make informed decisions

### Age Group to LTAD Stage Mapping Reference

Use this mapping when assigning `ageGroup` and `ltadStage` values:

| ageGroup | Primary ltadStage(s) | Notes |
|----------|---------------------|-------|
| 6-8 | active-start, fundamentals | FUNdamentals emphasis, multi-sport sampling |
| 9-11 | fundamentals, learn-to-train | Transition period, skill windows opening |
| 12-14 | learn-to-train, train-to-train | Peak skill learning, puberty onset varies |
| 15-18 | train-to-train, train-to-compete | Sport refinement, competition readiness |

### Pillar Connection Guide

Every article must connect to at least one of the 5 Pillars. Here is how each pillar relates to Development Frameworks content:

| Pillar Slug | Relevance to Development Frameworks |
|---|---|
| `physical-literacy` | Core pillar for this category. LTAD stages, skill windows, physical literacy progression, fundamentals, sport sampling. |
| `development-over-results` | Training-to-competition ratios, periodization, developmental age emphasis, long-term perspective. |
| `health-safety` | Injury prevention, specialization risks, growth/maturation impacts, training load guidelines. |
| `character-through-sport` | Less primary, but relevant to articles on identity-based motivation and intrinsic drive through multi-sport. |
| `community-ownership` | Less primary, but relevant when discussing community-level benefits of multi-sport programs. |

### Research Sources to Cite

Articles should reference these established sources (cite by author/organization and year; include URLs where verifiable):

- **Canadian Sport for Life / Istvan Balyi** -- LTAD 2.0 framework, developmental stages, 10 Key Factors of LTAD
- **NSCA Position Statement on Long-Term Athletic Development** (Lloyd et al., 2016) -- 10 Pillars, youth resistance training guidelines
- **AAP Council on Sports Medicine and Fitness** (2016) -- clinical report on sport specialization and intensive training in young athletes
- **Jayanthi et al. (2013)** -- sports specialization in young athletes, evidence-based recommendations (American Journal of Sports Medicine)
- **Myer et al. (2015)** -- sport specialization, overuse injuries, and the youth athlete (Orthopaedic Journal of Sports Medicine)
- **Côté, Lidor, & Hackfort (2009)** -- ISSP position stand on sampling sports during childhood
- **Ericsson, Krampe, & Tesch-Römer (1993)** -- deliberate practice (often miscited to justify early specialization; articles should present the actual findings)
- **Bridge & Toms (2013)** -- the specialising decision in elite youth sport
- **Brenner (2007, updated 2016)** -- AAP clinical report on overuse injuries, sport specialization, and burnout

---

## Verification Checklist

After implementation, verify:

- [ ] At least 10 MDX articles exist in `/content/development-frameworks/`
- [ ] Every article has `category: development-frameworks` in frontmatter
- [ ] All four age groups (6-8, 9-11, 12-14, 15-18) are represented across articles
- [ ] All five LTAD stages are covered across articles
- [ ] At least 2 articles address multi-sport participation
- [ ] Every article connects to at least one of the 5 Pillars via `pillar` frontmatter
- [ ] Every article cites at least one established research source in the `references` array
- [ ] No article contains prescriptive coaching language (plays, drills, schemes)
- [ ] Every article includes an `[AD_INPUT_NEEDED]` block with `optional` priority tier
- [ ] Every article follows the body template (Key Takeaways, Introduction, Practical Application, References)
- [ ] The progress manifest (`/content/_progress.yaml`) is updated with entries for all new articles
- [ ] Cross-references (`relatedArticles`) link to existing Port Clinton Way articles where relevant
- [ ] All articles use preferred terminology from the voice guide
- [ ] All tests in `__tests__/content/development-frameworks.test.ts` pass

---

## Dependencies and Downstream Sections

**This section depends on:**
- **section-01-foundation** -- directory structure at `/content/development-frameworks/`, progress manifest, article body template
- **section-02-vocabulary-schema** -- controlled vocabulary for frontmatter values, frontmatter schema validation
- **section-03-voice-alignment** -- voice guide, alignment principles, calibration articles for scoring
- **section-04-port-clinton-way** -- the 5 Pillars articles that this section's articles will reference via `relatedArticles`

**Sections that depend on this section:**
- **section-07-parent-guides** -- parent-facing articles will cite development framework evidence (e.g., LTAD stages, multi-sport evidence, skill windows)
- **section-08-coach-resources** -- coach-facing articles will reference framework content for evidence-based coaching approaches
- **section-09-community-building** -- community/program articles may reference development models for program design
- **section-10-curated-resources** -- sources cited in these articles feed into the curated resources compilation
- **section-11-cross-references-qa** -- final cross-reference and quality pass across all articles
