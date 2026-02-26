# Section 06: Health & Safety -- Nutrition, Concussion Protocols, Training Loads, and Injury Prevention

## Overview

This section creates 10-12 MDX articles in the `/content/health-safety/` directory covering health, safety, and medical-adjacent topics for youth athletes. Content includes nutrition and recovery by age group, concussion protocols, training load guidelines, injury prevention strategies, rest and recovery requirements, and return-to-play procedures. Every article includes a standard medical disclaimer. Articles defer to established medical authorities (AAP, NFHS, state-mandated protocols) rather than creating original medical guidance.

This section runs in parallel with section-05 (Development Frameworks) after section-04 (Port Clinton Way) is complete. Health & Safety articles provide the safety evidence base that parent guides (section-07) and coach resources (section-08) will reference.

**What gets created:**

| Deliverable | Path | Purpose |
|---|---|---|
| 10-12 MDX articles | `/content/health-safety/*.mdx` | Health, safety, and medical-adjacent content |
| Progress manifest entries | `/content/_progress.yaml` | Updated with new article metadata |
| Cross-references | Updated `relatedArticles` in relevant existing articles | Links from Port Clinton Way articles to new health/safety articles |

---

## Tests (Write First)

All tests use Vitest. Tests for this section live at `__tests__/content/health-safety.test.ts`. These tests validate the medical disclaimer requirement, AAP guideline compliance, concussion protocol handling, and standard content quality checks.

```typescript
// File: __tests__/content/health-safety.test.ts

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_ROOT = path.resolve(__dirname, '../../content');
const CATEGORY_DIR = path.join(CONTENT_ROOT, 'health-safety');

const MEDICAL_DISCLAIMER_PATTERN =
  /This content is for educational purposes and does not constitute medical advice/i;

function getMdxFiles(): string[] {
  if (!fs.existsSync(CATEGORY_DIR)) return [];
  return fs.readdirSync(CATEGORY_DIR).filter((f) => f.endsWith('.mdx'));
}

function parseFrontmatter(filename: string) {
  const filepath = path.join(CATEGORY_DIR, filename);
  const raw = fs.readFileSync(filepath, 'utf-8');
  return matter(raw);
}

describe('Health & Safety - Article Count', () => {
  it('has at least 10 articles', () => {
    const files = getMdxFiles();
    expect(files.length).toBeGreaterThanOrEqual(10);
  });
});

describe('Health & Safety - Medical Disclaimer', () => {
  it('every article contains the standard medical disclaimer', () => {
    const files = getMdxFiles();
    for (const f of files) {
      const { content } = parseFrontmatter(f);
      expect(content).toMatch(MEDICAL_DISCLAIMER_PATTERN);
    }
  });
});

describe('Health & Safety - Training Load Guidelines', () => {
  it('training load articles respect AAP guidelines (hours <= age, max 16/week)', () => {
    const files = getMdxFiles();
    for (const f of files) {
      const { content } = parseFrontmatter(f);
      // Articles should never recommend exceeding AAP limits
      // Check that no article recommends training hours that contradict AAP
      expect(content).not.toMatch(
        /train(ing)?\s+(more than|over|exceeding)\s+16\s+hours?\s+(per|a)\s+week/i
      );
    }
  });
});

describe('Health & Safety - Concussion Content', () => {
  it('concussion content defers to NFHS or state-mandated protocols', () => {
    const files = getMdxFiles();
    for (const f of files) {
      const { data, content } = parseFrontmatter(f);
      const tags = Array.isArray(data.tags) ? data.tags : [];
      if (
        tags.includes('concussion') ||
        content.toLowerCase().includes('concussion')
      ) {
        // Concussion articles should reference NFHS or state protocols
        const referencesNFHS =
          content.includes('NFHS') || content.includes('National Federation of State High School');
        const referencesState =
          content.toLowerCase().includes('state protocol') ||
          content.toLowerCase().includes('state-mandated') ||
          content.toLowerCase().includes('state law');
        expect(referencesNFHS || referencesState).toBe(true);
      }
    }
  });
});

describe('Health & Safety - Frontmatter Validity', () => {
  it('every article has category "health-safety"', () => {
    const files = getMdxFiles();
    for (const f of files) {
      const { data } = parseFrontmatter(f);
      expect(data.category).toBe('health-safety');
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

  it('every article includes "health-safety" in its pillar array', () => {
    const files = getMdxFiles();
    for (const f of files) {
      const { data } = parseFrontmatter(f);
      expect(data.pillar).toContain('health-safety');
    }
  });
});

describe('Health & Safety - Alignment', () => {
  it('no article uses prescriptive coaching language', () => {
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

**Dev dependency** (if not already present): `gray-matter` for parsing MDX frontmatter in tests.

```bash
npm install -D gray-matter
```

---

## Implementation Details

### Background: What "Health & Safety" Covers

The Health & Safety category addresses the medical and physiological side of youth sports. This is the most liability-sensitive content in the library. Every article must include a standard medical disclaimer and defer to established medical authorities rather than creating original medical guidance.

**Key principle:** PCAB provides educational information that helps parents and coaches understand established guidelines. PCAB does not provide medical advice. Articles should inform readers about what guidelines exist and why, then direct them to qualified medical professionals for specific concerns.

### Standard Medical Disclaimer

Every article in this category must include the following disclaimer, placed prominently near the beginning of the article (typically right after the Introduction section or as a callout within it):

> **Important:** This content is for educational purposes and does not constitute medical advice. Always consult qualified medical professionals for specific health concerns related to your young athlete. Follow your school's, league's, and state's official protocols for injury management, concussion procedures, and return-to-play decisions.

### Article Topic List

Generate articles covering these topics (at minimum). The implementer should write 10-12 articles from this list. Each article targets 2,000-3,000 words.

| # | Slug | Title | Primary Pillar(s) | Age Groups | LTAD Stages |
|---|---|---|---|---|---|
| 1 | `youth-nutrition-by-age` | Fueling Young Athletes: Nutrition Guidelines by Age Group | health-safety | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |
| 2 | `concussion-awareness-protocols` | Concussion Awareness: Understanding Protocols and Your Role | health-safety | 9-11, 12-14, 15-18 | learn-to-train, train-to-train, train-to-compete |
| 3 | `training-load-guidelines` | Training Load Guidelines: How Much Is Too Much for Young Athletes | health-safety, development-over-results | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |
| 4 | `overuse-injury-prevention` | Preventing Overuse Injuries in Youth Athletes | health-safety | 9-11, 12-14, 15-18 | learn-to-train, train-to-train, train-to-compete |
| 5 | `rest-and-recovery-requirements` | Rest and Recovery: Why Young Athletes Need Downtime | health-safety, development-over-results | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |
| 6 | `return-to-play-guidelines` | Return-to-Play: Safely Getting Back After Injury | health-safety | 9-11, 12-14, 15-18 | learn-to-train, train-to-train, train-to-compete |
| 7 | `hydration-for-young-athletes` | Hydration Essentials for Youth Sports | health-safety | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |
| 8 | `growth-plate-injuries` | Understanding Growth Plate Injuries in Youth Athletes | health-safety | 9-11, 12-14, 15-18 | learn-to-train, train-to-train |
| 9 | `sleep-and-athletic-performance` | Sleep and Young Athletes: The Often-Overlooked Recovery Tool | health-safety, development-over-results | 9-11, 12-14, 15-18 | learn-to-train, train-to-train, train-to-compete |
| 10 | `heat-illness-prevention` | Heat Illness Prevention in Youth Sports | health-safety | 6-8, 9-11, 12-14, 15-18 | active-start, fundamentals, learn-to-train, train-to-train, train-to-compete |
| 11 | `mental-health-youth-athletes` | Mental Health and Youth Sports: Recognizing Warning Signs | health-safety, character-through-sport | 9-11, 12-14, 15-18 | learn-to-train, train-to-train, train-to-compete |
| 12 | `age-appropriate-strength-training` | Age-Appropriate Strength Training for Youth Athletes | health-safety, physical-literacy | 9-11, 12-14, 15-18 | learn-to-train, train-to-train, train-to-compete |

### Per-Article Generation Process

For each article, follow this process:

1. **Set up frontmatter** using the controlled vocabulary from section-02. Every article in this section uses `category: health-safety`. All articles must include `health-safety` in the `pillar` array. Select appropriate values for `subcategory`, `tags`, `audience`, `ageGroup`, `ltadStage`, `contentType`, and `difficulty`.

2. **Write the article body** following the template from section-01:
   - **Key Takeaways** (3-5 bullet points)
   - **Introduction** (2-3 paragraphs setting context)
   - **Medical Disclaimer** (standard text, placed after Introduction or as a callout within it)
   - **Main Content Sections** (3-5 sections with evidence-based content)
   - **Practical Application** (actionable guidance for the stated audience)
   - **AD Placeholder** (format below)
   - **References** (cited sources)

3. **Add AD placeholder** with `optional` tier (health & safety articles are complete without AD input):
   ```mdx
   {/* [AD_INPUT_NEEDED]
      Type: endorsement
      Priority: optional
      Context: [Brief description of article topic]
      Guidance: Share how Port Clinton's programs implement these safety guidelines (1-2 paragraphs)
   */}
   ```

4. **Add cross-references** -- check the progress manifest for existing articles (Port Clinton Way pillar articles from section-04 and Development Frameworks articles from section-05 if available) and add relevant slugs to the `relatedArticles` frontmatter array.

5. **Update the progress manifest** (`/content/_progress.yaml`) with an entry for each new article.

### Frontmatter Example

```yaml
---
title: "Concussion Awareness: Understanding Protocols and Your Role"
description: "An educational guide to understanding concussion protocols, recognition signs, and the responsibilities of parents and coaches in youth sports."
slug: concussion-awareness-protocols
date: "2025-01-20"
lastUpdated: "2025-01-20"
category: health-safety
subcategory: injury-prevention
tags:
  - concussion
  - safety-protocols
  - injury-prevention
  - return-to-play
audience:
  - parent
  - coach
ageGroup:
  - "9-11"
  - "12-14"
  - "15-18"
ltadStage:
  - learn-to-train
  - train-to-train
  - train-to-compete
contentType: guide
pillar:
  - health-safety
difficulty: beginner
estimatedReadTime: 10
sportRelevance: sport-general
relatedArticles:
  - health-and-safety-above-all
  - return-to-play-guidelines
  - overuse-injury-prevention
prerequisites: []
references:
  - title: "NFHS Concussion in Sport"
    url: "https://nfhslearn.com/courses/concussion-in-sports"
    accessed: "2025-01-20"
  - title: "CDC Heads Up Program"
    url: "https://www.cdc.gov/heads-up/"
    accessed: "2025-01-20"
  - title: "AAP Council on Sports Medicine and Fitness - Sport-Related Concussion in Children and Adolescents"
    url: "https://publications.aap.org/"
    accessed: "2025-01-20"
status: review
---
```

### Content Guidelines Specific to Health & Safety

**What to include:**
- Established guidelines from recognized medical authorities (AAP, NFHS, CDC, NSCA)
- Signs and symptoms that parents and coaches should recognize
- When and how to seek professional medical help
- Age-appropriate considerations (what applies at 6-8 differs from 15-18)
- Practical steps that non-medical people can take (hydration schedules, rest day planning, etc.)

**What NOT to include:**
- Original medical advice or diagnosis guidance
- Specific treatment protocols (defer to medical professionals)
- Specific medication or supplement recommendations
- Content that could substitute for professional medical consultation
- Concussion return-to-play clearance procedures (defer to NFHS and state-mandated protocols)

**Concussion content specifically must:**
- Reference NFHS concussion training requirements
- Reference applicable state concussion laws (Ohio's "Return to Play" law as the local example)
- Clearly state that only licensed healthcare providers can clear an athlete for return to play
- Focus on recognition, immediate response, and the parent/coach role -- not medical management

**Training load content specifically must:**
- Reference the AAP guideline that weekly training hours should not exceed the child's age
- Reference the AAP maximum of 16 hours per week regardless of age
- Include mandatory rest day guidance (at least 1-2 days per week off from organized sport)
- Include seasonal rest guidance (at least 2-3 months per year away from a single sport)

### AAP Training Load Guidelines Reference

These are the key AAP guidelines that articles must respect. No article should recommend training loads that exceed these limits:

| Guideline | Source |
|---|---|
| Weekly training hours should not exceed the child's age in years | AAP Council on Sports Medicine and Fitness, 2016 |
| Maximum training hours: 16 hours per week regardless of age | AAP Council on Sports Medicine and Fitness, 2016 |
| At least 1-2 days per week off from organized sport | AAP Council on Sports Medicine and Fitness, 2016 |
| At least 2-3 months per year away from a single sport | AAP Council on Sports Medicine and Fitness, 2016 |
| Delay sport specialization until at least age 15-16 | AAP Council on Sports Medicine and Fitness, 2016 |

### Pillar Connection Guide

Every article in this section must include `health-safety` in its `pillar` array. Additional pillar connections:

| Pillar Slug | Relevance to Health & Safety |
|---|---|
| `health-safety` | **Primary pillar for every article in this section.** Training limits, injury prevention, concussion protocols, nutrition, recovery. |
| `development-over-results` | Training load guidelines, rest requirements, and the long-term perspective on athlete health over short-term competitive results. |
| `physical-literacy` | Age-appropriate strength training, growth plate awareness, movement quality as injury prevention. |
| `character-through-sport` | Mental health in youth sports, recognizing burnout, healthy competitive mindset. |
| `community-ownership` | Shared responsibility for athlete safety, coach education requirements, program-level safety policies. |

### Research Sources to Cite

Articles should reference these established sources (cite by author/organization and year; include URLs where verifiable):

- **AAP Council on Sports Medicine and Fitness** (2016) -- clinical report on sport specialization and intensive training in young athletes; training load guidelines
- **AAP Clinical Report: Overuse Injuries** (Brenner, 2007; updated 2016) -- overuse injury prevention, rest requirements
- **NFHS (National Federation of State High School Associations)** -- concussion training course, state high school athletic association protocols
- **CDC Heads Up Program** -- concussion recognition and response resources for coaches, parents, and athletes
- **NSCA Position Statement on Youth Resistance Training** (Faigenbaum et al., 2009) -- age-appropriate strength training guidelines
- **Ohio Revised Code Section 3707.511 / 3313.539** -- Ohio's concussion and head injury law for youth athletes (local relevance)
- **National Athletic Trainers' Association (NATA)** -- heat illness prevention position statement, youth-specific considerations
- **American College of Sports Medicine (ACSM)** -- hydration guidelines, exercise in heat
- **Sleep Foundation / AAP Sleep Guidelines** -- sleep requirements by age, impact on athletic recovery

---

## Verification Checklist

After implementation, verify:

- [ ] At least 10 MDX articles exist in `/content/health-safety/`
- [ ] Every article has `category: health-safety` in frontmatter
- [ ] Every article includes `health-safety` in its `pillar` array
- [ ] Every article contains the standard medical disclaimer text
- [ ] Concussion articles reference NFHS or state-mandated protocols
- [ ] No article recommends training loads exceeding AAP guidelines
- [ ] No article provides specific medical treatment advice or diagnosis guidance
- [ ] Every article includes an `[AD_INPUT_NEEDED]` block with `optional` priority tier
- [ ] Every article follows the body template (Key Takeaways, Introduction, Practical Application, References)
- [ ] Every article cites at least one established medical or research source in the `references` array
- [ ] No article contains prescriptive coaching language
- [ ] The progress manifest (`/content/_progress.yaml`) is updated with entries for all new articles
- [ ] Cross-references (`relatedArticles`) link to existing Port Clinton Way and Development Framework articles where relevant
- [ ] All articles use preferred terminology from the voice guide
- [ ] All tests in `__tests__/content/health-safety.test.ts` pass

---

## Dependencies and Downstream Sections

**This section depends on:**
- **section-01-foundation** -- directory structure at `/content/health-safety/`, progress manifest, article body template
- **section-02-vocabulary-schema** -- controlled vocabulary for frontmatter values, frontmatter schema validation
- **section-03-voice-alignment** -- voice guide, alignment principles, calibration articles for scoring
- **section-04-port-clinton-way** -- the 5 Pillars articles (especially "Health and Safety Above All" pillar) that this section's articles will reference

**Sections that depend on this section:**
- **section-07-parent-guides** -- parent-facing articles will cite health & safety content (nutrition, training loads, concussion awareness, injury prevention)
- **section-08-coach-resources** -- coach-facing articles will reference safety guidelines, concussion protocols, and training load limits
- **section-09-community-building** -- community/program articles may reference program-level safety policies
- **section-10-curated-resources** -- sources cited in these articles feed into the curated resources compilation
- **section-11-cross-references-qa** -- final cross-reference and quality pass across all articles
