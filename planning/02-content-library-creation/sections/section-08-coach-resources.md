# Section 08: Coach Resources -- Onboarding, Practice Planning, Age-Appropriate Methods, and Volunteer Coach Development

## Overview

This section creates 12-18 MDX articles in the `/content/coach-resources/` directory targeting volunteer coaches. Content covers onboarding new volunteer coaches, practice planning fundamentals, age-appropriate coaching methods for each developmental stage, season structure and periodization, managing parent relationships, building positive team culture, connecting to the multi-sport athletic pipeline, creating inclusive environments, and understanding the coach's role within the PCAB philosophy. Articles reference the evidence base from Development Frameworks (section-05), the safety guidelines from Health & Safety (section-06), and the philosophical foundation from Port Clinton Way (section-04).

This section runs in parallel with section-07 (Parent Guides) after sections 05 and 06 are complete. Coach Resources is the second-highest priority audience category, as volunteer coaches are often parents themselves with limited formal coaching education.

**What gets created:**

| Deliverable | Path | Purpose |
|---|---|---|
| 12-18 MDX articles | `/content/coach-resources/*.mdx` | Practical guidance for volunteer coaches |
| Progress manifest entries | `/content/_progress.yaml` | Updated with new article metadata |
| Cross-references | Updated `relatedArticles` in relevant existing articles | Links from earlier articles to new coach resource articles |

---

## Tests (Write First)

All tests use Vitest. Tests for this section live at `__tests__/content/coach-resources.test.ts`. These tests validate audience targeting, coach autonomy requirements, cross-references to earlier sections, practical/actionable content, and standard content quality checks.

```typescript
// File: __tests__/content/coach-resources.test.ts

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_ROOT = path.resolve(__dirname, '../../content');
const CATEGORY_DIR = path.join(CONTENT_ROOT, 'coach-resources');

function getMdxFiles(): string[] {
  if (!fs.existsSync(CATEGORY_DIR)) return [];
  return fs.readdirSync(CATEGORY_DIR).filter((f) => f.endsWith('.mdx'));
}

function parseFrontmatter(filename: string) {
  const filepath = path.join(CATEGORY_DIR, filename);
  const raw = fs.readFileSync(filepath, 'utf-8');
  return matter(raw);
}

describe('Coach Resources - Article Count', () => {
  it('has at least 12 articles', () => {
    const files = getMdxFiles();
    expect(files.length).toBeGreaterThanOrEqual(12);
  });
});

describe('Coach Resources - Audience Targeting', () => {
  it('every article includes "coach" in its audience array', () => {
    const files = getMdxFiles();
    for (const f of files) {
      const { data } = parseFrontmatter(f);
      expect(Array.isArray(data.audience)).toBe(true);
      expect(data.audience).toContain('coach');
    }
  });
});

describe('Coach Resources - Respects Coach Autonomy', () => {
  it('no article prescribes specific plays, drills, or tactical schemes', () => {
    const files = getMdxFiles();
    const prescriptivePatterns = [
      /run this drill/i,
      /use this play/i,
      /run this scheme/i,
      /execute this formation/i,
      /you must run/i,
      /you should always run/i,
      /PCAB (requires|demands|mandates) that coaches/i,
      /coaches must (use|run|implement) (this|these)/i,
    ];
    for (const f of files) {
      const { content } = parseFrontmatter(f);
      for (const pattern of prescriptivePatterns) {
        expect(content).not.toMatch(pattern);
      }
    }
  });
});

describe('Coach Resources - Practical Actionable Takeaways', () => {
  it('every article contains a "Key Takeaways" section', () => {
    const files = getMdxFiles();
    for (const f of files) {
      const { content } = parseFrontmatter(f);
      expect(content).toContain('Key Takeaways');
    }
  });

  it('every article contains a "Practical Application" section', () => {
    const files = getMdxFiles();
    for (const f of files) {
      const { content } = parseFrontmatter(f);
      expect(content).toContain('Practical Application');
    }
  });
});

describe('Coach Resources - Cross-References', () => {
  it('at least half of articles cross-reference development framework or health-safety articles', () => {
    const files = getMdxFiles();
    let crossRefCount = 0;

    const frameworkDir = path.join(CONTENT_ROOT, 'development-frameworks');
    const healthDir = path.join(CONTENT_ROOT, 'health-safety');
    const frameworkSlugs = new Set<string>();
    const healthSlugs = new Set<string>();

    if (fs.existsSync(frameworkDir)) {
      for (const f of fs.readdirSync(frameworkDir).filter((f) => f.endsWith('.mdx'))) {
        const { data } = matter(fs.readFileSync(path.join(frameworkDir, f), 'utf-8'));
        if (data.slug) frameworkSlugs.add(data.slug);
      }
    }
    if (fs.existsSync(healthDir)) {
      for (const f of fs.readdirSync(healthDir).filter((f) => f.endsWith('.mdx'))) {
        const { data } = matter(fs.readFileSync(path.join(healthDir, f), 'utf-8'));
        if (data.slug) healthSlugs.add(data.slug);
      }
    }

    for (const f of files) {
      const { data } = parseFrontmatter(f);
      const related = Array.isArray(data.relatedArticles) ? data.relatedArticles : [];
      const hasFrameworkRef = related.some((slug: string) => frameworkSlugs.has(slug));
      const hasHealthRef = related.some((slug: string) => healthSlugs.has(slug));
      if (hasFrameworkRef || hasHealthRef) crossRefCount++;
    }

    expect(crossRefCount).toBeGreaterThanOrEqual(Math.floor(files.length / 2));
  });
});

describe('Coach Resources - Frontmatter Validity', () => {
  it('every article has category "coach-resources"', () => {
    const files = getMdxFiles();
    for (const f of files) {
      const { data } = parseFrontmatter(f);
      expect(data.category).toBe('coach-resources');
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

describe('Coach Resources - Age Group Coverage', () => {
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

describe('Coach Resources - Alignment', () => {
  it('no article uses discouraged terminology from voice guide', () => {
    const files = getMdxFiles();
    for (const f of files) {
      const { content } = parseFrontmatter(f);
      expect(content).not.toMatch(
        /PCAB (requires|demands|mandates) that coaches/i
      );
    }
  });
});
```

**Dev dependency** (if not already present): `gray-matter` for parsing MDX frontmatter in tests.

```bash
npm install -D gray-matter
```

---

## Implementation Details

### Background: What "Coach Resources" Covers

The Coach Resources category provides practical, evidence-informed guidance for volunteer coaches in Port Clinton's youth sports programs. Most coaches in a small community like Port Clinton are parent volunteers with limited formal coaching education. These articles help volunteer coaches understand developmental principles, plan effective practices, create positive team environments, and navigate relationships with parents and administrators -- all without prescribing specific plays, drills, or tactical schemes.

**Critical principle for coach content: Respect coach autonomy.** Coach resource articles must present frameworks, principles, and general approaches. They must never tell coaches what drills to run, what plays to use, or what tactical schemes to adopt. The content authority comes from established research (LTAD, NSCA, AAP, PCA), not from PCAB. PCAB's role is to share the evidence and let coaches make informed decisions about how to apply it in their own programs.

### Tone Guidance for Coach Content

Coach-facing articles have a distinct tone within the overall voice guide:

- **Peer-to-peer** -- write as a fellow coach sharing insights, not as an authority dictating methods
- **Practical and time-conscious** -- volunteer coaches have limited time; get to the point with actionable guidance
- **Framework-oriented** -- share mental models and principles that coaches can adapt, not rigid instructions
- **Appreciative** -- acknowledge the significant time and effort volunteer coaches contribute
- **Confidence-building** -- many volunteer coaches feel underqualified; reinforce that caring about doing it well is the most important qualification
- **Non-prescriptive** -- present options and evidence, never mandates

### Article Topic List

Generate articles covering these topics (at minimum). The implementer should write 12-18 articles from this list. Each article targets 2,000-3,000 words.

| # | Slug | Title | Primary Pillar(s) | Age Groups | LTAD Stages |
|---|---|---|---|---|---|
| 1 | `volunteer-coach-onboarding` | The Volunteer Coach Onboarding Guide: Getting Started Right | community-ownership, development-over-results | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |
| 2 | `practice-planning-fundamentals` | Practice Planning Fundamentals: Making Every Minute Count | development-over-results, physical-literacy | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train |
| 3 | `coaching-ages-6-8` | Coaching Ages 6-8: Creating a Foundation Through Fun | physical-literacy, development-over-results | 6-8 | active-start, fundamentals |
| 4 | `coaching-ages-9-11` | Coaching Ages 9-11: Building Skills During the Golden Age of Learning | physical-literacy, development-over-results | 9-11 | fundamentals, learn-to-train |
| 5 | `coaching-ages-12-14` | Coaching Ages 12-14: Navigating Puberty and Peak Skill Development | development-over-results, health-safety | 12-14 | learn-to-train, train-to-train |
| 6 | `coaching-ages-15-18` | Coaching Ages 15-18: Competitive Readiness and Athlete Autonomy | development-over-results, health-safety | 15-18 | train-to-train, train-to-compete |
| 7 | `season-structure-planning` | Structuring Your Season: A Framework for Youth Sport Coaches | development-over-results, health-safety | 9-11, 12-14, 15-18 | learn-to-train, train-to-train, train-to-compete |
| 8 | `managing-parent-relationships` | Managing Parent Relationships: Communication Strategies for Coaches | community-ownership, character-through-sport | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |
| 9 | `building-team-culture` | Building Positive Team Culture From Day One | character-through-sport, community-ownership | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |
| 10 | `playing-time-philosophy` | Developing a Playing Time Philosophy That Supports Growth | development-over-results, character-through-sport | 9-11, 12-14, 15-18 | fundamentals, learn-to-train, train-to-train, train-to-compete |
| 11 | `creating-inclusive-environment` | Creating an Inclusive Environment for All Athletes | community-ownership, character-through-sport | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |
| 12 | `multi-sport-coach-perspective` | The Multi-Sport Advantage: A Coach's Perspective | physical-literacy, development-over-results | 6-8, 9-11, 12-14 | active-start, fundamentals, learn-to-train |
| 13 | `coach-athlete-communication` | Effective Coach-Athlete Communication by Age Group | character-through-sport, development-over-results | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |
| 14 | `recognizing-developmental-differences` | Recognizing Developmental Differences on Your Roster | physical-literacy, development-over-results | 9-11, 12-14 | fundamentals, learn-to-train, train-to-train |
| 15 | `connecting-athletic-pipeline` | Connecting to the Athletic Pipeline: Coaching Within a Broader System | community-ownership, development-over-results | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |

### Per-Article Generation Process

For each article, follow this process:

1. **Set up frontmatter** using the controlled vocabulary from section-02. Every article in this section uses `category: coach-resources`. Every article must include `coach` in the `audience` array (some may also include `parent` or `administrator` as secondary audiences). Select appropriate values for `subcategory`, `tags`, `ageGroup`, `ltadStage`, `contentType`, `pillar`, and `difficulty`.

2. **Write the article body** following the template from section-01:
   - **Key Takeaways** (3-5 bullet points)
   - **Introduction** (2-3 paragraphs setting context, peer-to-peer tone)
   - **Main Content Sections** (3-5 sections with evidence-based content)
   - **Practical Application** (specific frameworks, checklists, or approaches coaches can adapt)
   - **AD Placeholder** (format below)
   - **References** (cited sources)

3. **Add AD placeholder** -- most coach resource articles use `valuable` tier (AD input strengthens the content by providing Port Clinton-specific program context, but articles stand on established research without it):
   ```mdx
   {/* [AD_INPUT_NEEDED]
      Type: program-example | endorsement
      Priority: valuable
      Context: [Brief description of article topic]
      Guidance: Share a specific example or expectation from Port Clinton's coaching program that illustrates this principle (1-2 paragraphs)
   */}
   ```

4. **Add cross-references** -- link to relevant Development Frameworks articles (section-05), Health & Safety articles (section-06), and Port Clinton Way articles (section-04) in the `relatedArticles` array. Also link to relevant Parent Guides articles (section-07) where applicable, since some coach articles have corresponding parent-facing content (e.g., managing parent relationships pairs with what coaches want from parents). At least half of coach resource articles should cross-reference framework or safety content.

5. **Update the progress manifest** (`/content/_progress.yaml`) with an entry for each new article.

### Frontmatter Example

```yaml
---
title: "The Volunteer Coach Onboarding Guide: Getting Started Right"
description: "A practical onboarding guide for new volunteer coaches covering developmental philosophy, practice planning basics, and building a positive team culture."
slug: volunteer-coach-onboarding
date: "2025-02-01"
lastUpdated: "2025-02-01"
category: coach-resources
subcategory: coaching-fundamentals
tags:
  - volunteer-coaching
  - onboarding
  - coaching-basics
  - getting-started
audience:
  - coach
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
contentType: guide
pillar:
  - community-ownership
  - development-over-results
difficulty: beginner
estimatedReadTime: 10
sportRelevance: sport-general
relatedArticles:
  - development-over-results
  - physical-literacy-first
  - understanding-ltad-model
  - practice-planning-fundamentals
  - what-coaches-want-from-parents
prerequisites: []
references:
  - title: "Positive Coaching Alliance - Double-Goal Coach"
    url: "https://positivecoach.org/double-goal-coach/"
    accessed: "2025-02-01"
  - title: "Long-Term Athlete Development 2.0 - Canadian Sport for Life"
    url: "https://sportforlife.ca/long-term-development/"
    accessed: "2025-02-01"
  - title: "NFHS Coach Education Resources"
    url: "https://nfhslearn.com/"
    accessed: "2025-02-01"
status: review
---
```

### Content Guidelines Specific to Coach Resources

**Critical rule: Respect coach autonomy.** Coach resource articles must never:
- Prescribe specific plays, drills, formations, or tactical schemes
- Dictate how a coach should structure their game-day lineup
- Tell coaches what exercises or conditioning methods to use
- Position PCAB or any booster organization as having authority over coaching decisions
- Suggest there is only one correct way to coach a particular sport or age group

**What to include instead:**
- Evidence-based principles that apply across sports (e.g., "research suggests a 70/30 training-to-competition ratio for ages 9-11" rather than "run these specific drills")
- Frameworks coaches can adapt to their sport and situation (e.g., the concept of progressive overload, not a specific weight program)
- Communication strategies backed by sport psychology research
- General practice structure principles (warm-up, skill development, game play, cool-down) without specifying content
- How to recognize developmental readiness signals in young athletes
- How to build relationships with parents, athletes, and the broader program

**Age-specific coaching approach:**

| Age Group | Coaching Content Focus |
|---|---|
| 6-8 | Fun-first environment, games over drills, basic movement literacy, short attention spans, positive reinforcement, managing parent expectations at this stage |
| 9-11 | Skill introduction windows opening, still multi-sport focused, growing capacity for instruction, beginning of team concepts, the "golden age" of motor learning |
| 12-14 | Puberty variability on the roster, emotional development, increasing tactical understanding, managing early vs. late developers, competition readiness varies widely |
| 15-18 | Athlete-led leadership, preparation for higher-level competition, respecting growing autonomy, managing time demands of academics and athletics, transition planning |

### Pillar Connection Guide

Every article must connect to at least one of the 5 Pillars. Here is how each pillar relates to Coach Resources content:

| Pillar Slug | Relevance to Coach Resources |
|---|---|
| `physical-literacy` | Age-appropriate skill development, movement foundations, multi-sport coaching benefits, practice design for physical literacy. |
| `development-over-results` | Practice planning, season structure, playing time philosophy, training-to-competition ratios, developmental focus over win-loss. |
| `health-safety` | Training load management, recognizing injury warning signs, concussion awareness, age-appropriate physical demands, rest requirements. |
| `character-through-sport` | Team culture building, coach-athlete communication, inclusive environments, sportsmanship modeling, identity-based motivation. |
| `community-ownership` | Volunteer coach development, parent relationship management, connecting to the athletic pipeline, program-level coordination, multi-sport scheduling. |

### Research Sources to Cite

Coach resource articles should reference these established sources as well as cross-reference Development Frameworks (section-05) and Health & Safety (section-06) articles:

- **Positive Coaching Alliance** -- Double-Goal Coach framework, Coaching for Mastery approach, "filling emotional tanks," "honoring the game"
- **LTAD / Canadian Sport for Life** -- developmental stage descriptions, what coaches should emphasize at each stage, training-to-competition ratios
- **NSCA Position Statement on Long-Term Athletic Development** (Lloyd et al., 2016) -- age-appropriate training guidelines, youth resistance training, qualified coaching
- **AAP Council on Sports Medicine and Fitness** (2016) -- training hour limits, rest requirements, specialization guidelines
- **NFHS (National Federation of State High School Associations)** -- coach education resources, Fundamentals of Coaching course, state-specific requirements
- **Jim Thompson, "Positive Coaching" and "The Double-Goal Coach"** -- frameworks for creating positive sporting environments
- **Vealey & Chase (2016)** -- "Best Practice for Youth Sport" (coaching psychology research)
- **Côté & Gilbert (2009)** -- coaching effectiveness framework (competence, confidence, connection, character)
- **Smith & Smoll** -- Mastery Approach to Coaching, research on coach behaviors and youth athlete outcomes
- **National Alliance for Youth Sports** -- volunteer coach education standards

---

## Verification Checklist

After implementation, verify:

- [ ] At least 12 MDX articles exist in `/content/coach-resources/`
- [ ] Every article has `category: coach-resources` in frontmatter
- [ ] Every article includes `coach` in its `audience` array
- [ ] No article prescribes specific plays, drills, or tactical schemes
- [ ] No article positions PCAB as having authority over coaching decisions
- [ ] All four age groups (6-8, 9-11, 12-14, 15-18) are represented across articles
- [ ] At least half of articles cross-reference Development Frameworks or Health & Safety articles
- [ ] Every article connects to at least one of the 5 Pillars via `pillar` frontmatter
- [ ] Every article cites at least one established source in the `references` array
- [ ] Every article includes an `[AD_INPUT_NEEDED]` block (most with `valuable` priority tier)
- [ ] Every article follows the body template (Key Takeaways, Introduction, Practical Application, References)
- [ ] The progress manifest (`/content/_progress.yaml`) is updated with entries for all new articles
- [ ] Cross-references (`relatedArticles`) link to existing articles from sections 04, 05, and 06
- [ ] All articles use preferred terminology from the voice guide (e.g., "development" not "winning," "youth athlete" not "kid")
- [ ] Articles present frameworks and principles, not prescriptive instructions
- [ ] All tests in `__tests__/content/coach-resources.test.ts` pass

---

## Dependencies and Downstream Sections

**This section depends on:**
- **section-01-foundation** -- directory structure at `/content/coach-resources/`, progress manifest, article body template
- **section-02-vocabulary-schema** -- controlled vocabulary for frontmatter values, frontmatter schema validation
- **section-03-voice-alignment** -- voice guide, alignment principles, calibration articles for scoring
- **section-04-port-clinton-way** -- the 5 Pillars articles that coach resources will reference for philosophical grounding
- **section-05-development-frameworks** -- evidence-base articles that coach resources cite for scientific backing (LTAD stages, training ratios, skill windows, periodization)
- **section-06-health-safety** -- health and safety articles that coach resources reference for training limits, injury prevention, concussion awareness, and rest requirements

**Sections that depend on this section:**
- **section-09-community-building** -- community/program articles may reference coach development and volunteer coaching content
- **section-10-curated-resources** -- sources cited in these articles feed into the curated resources compilation
- **section-11-cross-references-qa** -- final cross-reference and quality pass across all articles
