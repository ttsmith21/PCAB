# Section 07: Parent Guides -- Supporting Youth Athletes by Age, Development Expectations, and Family Guidance

## Overview

This section creates 15-20 MDX articles in the `/content/parent-guides/` directory targeting parents and families of youth athletes. Content covers supporting youth athletes at each age group, development expectations by stage, mental health awareness, being a supportive sports parent, understanding what coaches want from parents, nutrition basics for families, managing the multi-sport schedule, and navigating the specialization decision. Articles reference the evidence base from Development Frameworks (section-05) and the safety guidelines from Health & Safety (section-06).

This section runs in parallel with section-08 (Coach Resources) after sections 05 and 06 are complete. Parent Guides are the highest-volume content category, reflecting parents as the primary audience for the PCAB website.

**What gets created:**

| Deliverable | Path | Purpose |
|---|---|---|
| 15-20 MDX articles | `/content/parent-guides/*.mdx` | Parent-facing guidance on youth sports |
| Progress manifest entries | `/content/_progress.yaml` | Updated with new article metadata |
| Cross-references | Updated `relatedArticles` in relevant existing articles | Links from earlier articles to new parent guide articles |

---

## Tests (Write First)

All tests use Vitest. Tests for this section live at `__tests__/content/parent-guides.test.ts`. These tests validate audience targeting, age group coverage, the non-prescriptive coaching requirement, cross-references to earlier sections, and standard content quality checks.

```typescript
// File: __tests__/content/parent-guides.test.ts

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_ROOT = path.resolve(__dirname, '../../content');
const CATEGORY_DIR = path.join(CONTENT_ROOT, 'parent-guides');

function getMdxFiles(): string[] {
  if (!fs.existsSync(CATEGORY_DIR)) return [];
  return fs.readdirSync(CATEGORY_DIR).filter((f) => f.endsWith('.mdx'));
}

function parseFrontmatter(filename: string) {
  const filepath = path.join(CATEGORY_DIR, filename);
  const raw = fs.readFileSync(filepath, 'utf-8');
  return matter(raw);
}

describe('Parent Guides - Article Count', () => {
  it('has at least 15 articles', () => {
    const files = getMdxFiles();
    expect(files.length).toBeGreaterThanOrEqual(15);
  });
});

describe('Parent Guides - Audience Targeting', () => {
  it('every article includes "parent" in its audience array', () => {
    const files = getMdxFiles();
    for (const f of files) {
      const { data } = parseFrontmatter(f);
      expect(Array.isArray(data.audience)).toBe(true);
      expect(data.audience).toContain('parent');
    }
  });
});

describe('Parent Guides - Never Prescriptive About Coaching', () => {
  it('no article prescribes coaching tactics, plays, or drills', () => {
    const files = getMdxFiles();
    const prescriptivePatterns = [
      /tell (your|the) coach to/i,
      /coaches? should run/i,
      /coaches? should use (this|these) drill/i,
      /coaches? need to change/i,
      /demand that (your|the) coach/i,
      /insist (your|the) coach/i,
    ];
    for (const f of files) {
      const { content } = parseFrontmatter(f);
      for (const pattern of prescriptivePatterns) {
        expect(content).not.toMatch(pattern);
      }
    }
  });
});

describe('Parent Guides - Age Group Coverage', () => {
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

describe('Parent Guides - Cross-References', () => {
  it('at least half of articles cross-reference development framework or health-safety articles', () => {
    const files = getMdxFiles();
    let crossRefCount = 0;

    // Load all development-frameworks and health-safety slugs for reference
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

describe('Parent Guides - Frontmatter Validity', () => {
  it('every article has category "parent-guides"', () => {
    const files = getMdxFiles();
    for (const f of files) {
      const { data } = parseFrontmatter(f);
      expect(data.category).toBe('parent-guides');
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

describe('Parent Guides - Alignment', () => {
  it('no article uses discouraged terminology from voice guide', () => {
    const files = getMdxFiles();
    // Check that articles use "youth athlete" not just "kid" in isolation,
    // "development" framing not "winning" framing
    for (const f of files) {
      const { content } = parseFrontmatter(f);
      // Should not position PCAB as telling coaches what to do
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

### Background: What "Parent Guides" Covers

The Parent Guides category is the largest content category by article count (15-20 articles). Parents are the primary audience for the PCAB website. These articles help parents understand youth athlete development, set appropriate expectations, support their children through the sports journey, and be constructive members of the athletic community.

**Key principle for parent content:** Parent guides must never be prescriptive about coaching. Parents are not coaches. The content should help parents understand what coaches are doing and why, support their child's development at home, and be positive contributors to the sports environment. Articles should never suggest that parents tell coaches how to coach, question coaching decisions publicly, or demand specific approaches.

### Tone Guidance for Parent Content

Parent-facing articles have a distinct tone within the overall voice guide:

- **Empathetic** -- parents are navigating an unfamiliar system with high emotional stakes (their children)
- **Reassuring** -- normalize common concerns ("It is completely normal for a 9-year-old to seem uncoordinated")
- **Practical** -- every article should give parents something concrete they can do at home
- **Non-judgmental** -- never shame parents for past decisions (e.g., early specialization), always frame as "going forward"
- **Empowering** -- help parents feel confident in their role without overstepping into the coaching role

### Article Topic List

Generate articles covering these topics (at minimum). The implementer should write 15-20 articles from this list. Each article targets 2,000-3,000 words.

| # | Slug | Title | Primary Pillar(s) | Age Groups | LTAD Stages |
|---|---|---|---|---|---|
| 1 | `supporting-young-athletes-6-8` | Supporting Your Young Athlete: Ages 6-8 | physical-literacy, development-over-results | 6-8 | active-start, fundamentals |
| 2 | `supporting-young-athletes-9-11` | Supporting Your Young Athlete: Ages 9-11 | physical-literacy, development-over-results | 9-11 | fundamentals, learn-to-train |
| 3 | `supporting-young-athletes-12-14` | Supporting Your Young Athlete: Ages 12-14 | development-over-results, health-safety | 12-14 | learn-to-train, train-to-train |
| 4 | `supporting-young-athletes-15-18` | Supporting Your Young Athlete: Ages 15-18 | development-over-results, health-safety | 15-18 | train-to-train, train-to-compete |
| 5 | `development-expectations-by-age` | What to Expect: Developmental Milestones for Youth Athletes | physical-literacy, development-over-results | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train |
| 6 | `being-supportive-sports-parent` | The Supportive Sports Parent: Helping Without Hovering | character-through-sport, development-over-results | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |
| 7 | `what-coaches-want-from-parents` | What Volunteer Coaches Wish Parents Knew | community-ownership, character-through-sport | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |
| 8 | `youth-athlete-mental-health-parents` | Your Child's Mental Health in Sports: A Parent's Guide | health-safety, character-through-sport | 9-11, 12-14, 15-18 | learn-to-train, train-to-train, train-to-compete |
| 9 | `nutrition-basics-for-families` | Feeding Your Young Athlete: Practical Nutrition for Families | health-safety | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |
| 10 | `multi-sport-decision-parents` | The Multi-Sport Decision: What Parents Need to Know | physical-literacy, development-over-results | 9-11, 12-14 | fundamentals, learn-to-train |
| 11 | `specialization-conversation-parents` | Navigating the Specialization Conversation with Your Child | development-over-results, health-safety | 12-14, 15-18 | learn-to-train, train-to-train |
| 12 | `managing-multi-sport-schedule` | Managing the Multi-Sport Schedule: A Family Survival Guide | community-ownership, health-safety | 6-8, 9-11, 12-14 | active-start, fundamentals, learn-to-train |
| 13 | `car-ride-home` | The Car Ride Home: How to Talk About the Game | character-through-sport | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |
| 14 | `understanding-playing-time` | Understanding Playing Time: A Parent's Perspective | development-over-results, character-through-sport | 9-11, 12-14, 15-18 | fundamentals, learn-to-train, train-to-train, train-to-compete |
| 15 | `when-child-wants-to-quit` | When Your Child Wants to Quit: A Thoughtful Approach | character-through-sport, development-over-results | 9-11, 12-14, 15-18 | fundamentals, learn-to-train, train-to-train |
| 16 | `parent-sideline-behavior` | Sideline Behavior: Being the Parent Every Coach Wants | character-through-sport, community-ownership | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |
| 17 | `recognizing-burnout-in-youth-athletes` | Recognizing and Preventing Burnout in Young Athletes | health-safety, development-over-results | 12-14, 15-18 | learn-to-train, train-to-train, train-to-compete |
| 18 | `sleep-screens-and-sports` | Sleep, Screens, and Sports: The Recovery Triangle for Families | health-safety | 9-11, 12-14, 15-18 | learn-to-train, train-to-train, train-to-compete |
| 19 | `building-resilience-through-sport` | Building Resilience Through Sport: A Parent's Role | character-through-sport | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train |
| 20 | `parent-role-in-physical-literacy` | Your Role in Building Physical Literacy at Home | physical-literacy | 6-8, 9-11 | active-start, fundamentals |

### Per-Article Generation Process

For each article, follow this process:

1. **Set up frontmatter** using the controlled vocabulary from section-02. Every article in this section uses `category: parent-guides`. Every article must include `parent` in the `audience` array (some may also include `athlete` or `coach` as secondary audiences). Select appropriate values for `subcategory`, `tags`, `ageGroup`, `ltadStage`, `contentType`, `pillar`, and `difficulty`.

2. **Write the article body** following the template from section-01:
   - **Key Takeaways** (3-5 bullet points)
   - **Introduction** (2-3 paragraphs setting context, empathetic tone)
   - **Main Content Sections** (3-5 sections with evidence-based content)
   - **Practical Application** (specific things parents can do at home or at events)
   - **AD Placeholder** (format below)
   - **References** (cited sources)

3. **Add AD placeholder** -- most parent guides use `valuable` tier (AD input strengthens the content but is not required):
   ```mdx
   {/* [AD_INPUT_NEEDED]
      Type: program-example | endorsement
      Priority: valuable
      Context: [Brief description of article topic]
      Guidance: Share a specific example from Port Clinton's programs that illustrates this principle (1-2 paragraphs)
   */}
   ```

4. **Add cross-references** -- link to relevant Development Frameworks articles (section-05) and Health & Safety articles (section-06) in the `relatedArticles` array. Also link to relevant Port Clinton Way articles (section-04). At least half of parent guide articles should cross-reference framework or safety content.

5. **Update the progress manifest** (`/content/_progress.yaml`) with an entry for each new article.

### Frontmatter Example

```yaml
---
title: "Supporting Your Young Athlete: Ages 6-8"
description: "A parent's guide to supporting children ages 6-8 in youth sports, focusing on fun, fundamental movement skills, and building a love for activity."
slug: supporting-young-athletes-6-8
date: "2025-02-01"
lastUpdated: "2025-02-01"
category: parent-guides
subcategory: age-specific-guidance
tags:
  - early-childhood
  - physical-literacy
  - multi-sport
  - parent-support
  - fun-first
audience:
  - parent
ageGroup:
  - "6-8"
ltadStage:
  - active-start
  - fundamentals
contentType: guide
pillar:
  - physical-literacy
  - development-over-results
difficulty: beginner
estimatedReadTime: 10
sportRelevance: sport-general
relatedArticles:
  - physical-literacy-first
  - understanding-ltad-model
  - age-appropriate-skill-windows
  - being-supportive-sports-parent
  - parent-role-in-physical-literacy
prerequisites: []
references:
  - title: "Long-Term Athlete Development 2.0 - Canadian Sport for Life"
    url: "https://sportforlife.ca/long-term-development/"
    accessed: "2025-02-01"
  - title: "Positive Coaching Alliance - Resources for Parents"
    url: "https://positivecoach.org/for-parents/"
    accessed: "2025-02-01"
status: review
---
```

### Content Guidelines Specific to Parent Guides

**Critical rule: Never prescriptive about coaching.** Parent guide articles must never:
- Tell parents to instruct coaches on what drills to run
- Suggest parents demand specific playing time arrangements
- Position parents as having authority over coaching decisions
- Encourage parents to question coaching methods publicly
- Frame coach-parent relationship as adversarial

**What to include instead:**
- How to communicate constructively with coaches (ask questions, share concerns privately)
- How to support what coaches are teaching at home
- How to recognize good developmental coaching (without implying parents should evaluate coaches)
- The parent's unique role: emotional support, logistics, nutrition, sleep, enthusiasm

**Age-specific content approach:**

| Age Group | Parent Content Focus |
|---|---|
| 6-8 | Fun first, fundamental movement at home, managing expectations (they will not look coordinated), positive car rides home, letting them try everything |
| 9-11 | Skill development becomes visible, managing the urge to compare, multi-sport scheduling, recognizing growing independence |
| 12-14 | Puberty impacts, increased social pressure, specialization questions begin, mental health awareness, supporting through ups and downs |
| 15-18 | Increasing athlete autonomy, college athletics reality check, healthy competition, managing time demands, supporting the transition away from sport when applicable |

### Multi-Sport vs. Specialization in Parent Content

When addressing multi-sport participation and specialization from the parent perspective:

- Present the evidence for multi-sport participation (citing Development Frameworks articles from section-05)
- Acknowledge that the specialization question is real and emotionally charged for families
- Never shame families who have already specialized -- frame as "going forward, here is what to consider"
- Provide a decision framework, not a directive ("Questions to ask yourself" rather than "You should...")
- Note the small-school reality: in Port Clinton, multi-sport participation often happens naturally because the community needs athletes across sports
- Reference the AAP guideline on delaying specialization until 15-16 (citing Health & Safety articles from section-06)

### Pillar Connection Guide

Every article must connect to at least one of the 5 Pillars. Here is how each pillar relates to Parent Guides content:

| Pillar Slug | Relevance to Parent Guides |
|---|---|
| `physical-literacy` | Ages 6-8 and 9-11 content, home activities for fundamental movement, multi-sport sampling support. |
| `development-over-results` | Managing expectations, understanding playing time, focusing on growth over wins, development milestones. |
| `health-safety` | Nutrition at home, sleep and recovery, recognizing burnout and overuse, mental health awareness. |
| `character-through-sport` | Car ride home conversations, building resilience, being a supportive sports parent, handling adversity. |
| `community-ownership` | Sideline behavior, what coaches want from parents, managing multi-sport schedules, volunteering. |

### Research Sources to Cite

Parent guide articles should reference these established sources as well as cross-reference Development Frameworks (section-05) and Health & Safety (section-06) articles:

- **Positive Coaching Alliance** -- parent resources, the "Car Ride Home" concept, Double-Goal framework for parents
- **LTAD / Canadian Sport for Life** -- developmental stage descriptions, what parents should expect at each stage
- **AAP Council on Sports Medicine and Fitness** (2016) -- sport specialization and intensive training guidelines
- **Jayanthi et al. (2013)** -- sports specialization evidence (useful for the specialization conversation articles)
- **John O'Sullivan, "Changing the Game Project"** -- parent behavior in youth sports, the car ride home, intrinsic motivation
- **Jim Thompson, Positive Coaching Alliance** -- "The High School Sports Parent" and related parent-focused frameworks
- **National Alliance for Youth Sports** -- parent education resources
- **Merkel (2013)** -- youth sport: positive and negative impact on young athletes (Pediatric Clinics of North America)

---

## Verification Checklist

After implementation, verify:

- [ ] At least 15 MDX articles exist in `/content/parent-guides/`
- [ ] Every article has `category: parent-guides` in frontmatter
- [ ] Every article includes `parent` in its `audience` array
- [ ] No article contains prescriptive coaching language (telling parents to instruct coaches)
- [ ] All four age groups (6-8, 9-11, 12-14, 15-18) are represented across articles
- [ ] At least half of articles cross-reference Development Frameworks or Health & Safety articles
- [ ] Every article connects to at least one of the 5 Pillars via `pillar` frontmatter
- [ ] Every article cites at least one established source in the `references` array
- [ ] Every article includes an `[AD_INPUT_NEEDED]` block (most with `valuable` priority tier)
- [ ] Every article follows the body template (Key Takeaways, Introduction, Practical Application, References)
- [ ] The progress manifest (`/content/_progress.yaml`) is updated with entries for all new articles
- [ ] Cross-references (`relatedArticles`) link to existing articles from sections 04, 05, and 06
- [ ] All articles use preferred terminology from the voice guide
- [ ] Articles about specialization present evidence without being dogmatic or judgmental
- [ ] All tests in `__tests__/content/parent-guides.test.ts` pass

---

## Dependencies and Downstream Sections

**This section depends on:**
- **section-01-foundation** -- directory structure at `/content/parent-guides/`, progress manifest, article body template
- **section-02-vocabulary-schema** -- controlled vocabulary for frontmatter values, frontmatter schema validation
- **section-03-voice-alignment** -- voice guide, alignment principles, calibration articles for scoring
- **section-04-port-clinton-way** -- the 5 Pillars articles that parent guides will reference for philosophical grounding
- **section-05-development-frameworks** -- evidence-base articles that parent guides cite for scientific backing (LTAD stages, multi-sport evidence, skill windows)
- **section-06-health-safety** -- health and safety articles that parent guides reference for training limits, nutrition, concussion awareness, and injury prevention

**Sections that depend on this section:**
- **section-09-community-building** -- community/program articles may reference parent engagement content
- **section-10-curated-resources** -- sources cited in these articles feed into the curated resources compilation
- **section-11-cross-references-qa** -- final cross-reference and quality pass across all articles
