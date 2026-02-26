# Section 09: Community Building -- Volunteer Recruitment, Program Health, Multi-Sport Culture, and Measuring Success

## Overview

This section creates 8-12 MDX articles in the `/content/community-building/` directory covering program-level guidance for administrators, booster members, and community stakeholders. Content addresses volunteer recruitment and retention, program health metrics, building a multi-sport culture, fundraising and sustainability, measuring success beyond wins, coordinating across sports and seasons, stakeholder roles and responsibilities, and inclusive program design. Articles reference the 5 Pillars from Port Clinton Way (section-04) as the framework for program evaluation, and draw on evidence from Development Frameworks (section-05) and Health & Safety (section-06) for program-design rationale.

This section runs after section-04 (Port Clinton Way) is complete. It can begin before sections 07 and 08 are finished, but may reference coach and parent content where those articles already exist.

**What gets created:**

| Deliverable | Path | Purpose |
|---|---|---|
| 8-12 MDX articles | `/content/community-building/*.mdx` | Program-level guidance for administrators and community stakeholders |
| Progress manifest entries | `/content/_progress.yaml` | Updated with new article metadata |
| Cross-references | Updated `relatedArticles` in relevant existing articles | Links from earlier articles to new community building articles |

---

## Tests (Write First)

All tests use Vitest. Tests for this section live at `__tests__/content/community-building.test.ts`. These tests validate audience targeting, the use of the 5 Pillars as a program evaluation framework, practical volunteer and fundraising guidance, and standard content quality checks.

```typescript
// File: __tests__/content/community-building.test.ts

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_ROOT = path.resolve(__dirname, '../../content');
const CATEGORY_DIR = path.join(CONTENT_ROOT, 'community-building');

function getMdxFiles(): string[] {
  if (!fs.existsSync(CATEGORY_DIR)) return [];
  return fs.readdirSync(CATEGORY_DIR).filter((f) => f.endsWith('.mdx'));
}

function parseFrontmatter(filename: string) {
  const filepath = path.join(CATEGORY_DIR, filename);
  const raw = fs.readFileSync(filepath, 'utf-8');
  return matter(raw);
}

describe('Community Building - Article Count', () => {
  it('has at least 8 articles', () => {
    const files = getMdxFiles();
    expect(files.length).toBeGreaterThanOrEqual(8);
  });
});

describe('Community Building - Audience Targeting', () => {
  it('every article includes "administrator" in its audience array', () => {
    const files = getMdxFiles();
    for (const f of files) {
      const { data } = parseFrontmatter(f);
      expect(Array.isArray(data.audience)).toBe(true);
      expect(data.audience).toContain('administrator');
    }
  });
});

describe('Community Building - 5 Pillars as Program Evaluation Framework', () => {
  it('at least half of articles reference the community-ownership pillar', () => {
    const files = getMdxFiles();
    let communityPillarCount = 0;
    for (const f of files) {
      const { data } = parseFrontmatter(f);
      const pillars = Array.isArray(data.pillar) ? data.pillar : [];
      if (pillars.includes('community-ownership')) communityPillarCount++;
    }
    expect(communityPillarCount).toBeGreaterThanOrEqual(Math.floor(files.length / 2));
  });

  it('all 5 pillar slugs appear across at least one article in this category', () => {
    const files = getMdxFiles();
    const allPillars = new Set<string>();
    for (const f of files) {
      const { data } = parseFrontmatter(f);
      if (Array.isArray(data.pillar)) {
        data.pillar.forEach((p: string) => allPillars.add(p));
      }
    }
    expect(allPillars).toContain('physical-literacy');
    expect(allPillars).toContain('development-over-results');
    expect(allPillars).toContain('health-safety');
    expect(allPillars).toContain('character-through-sport');
    expect(allPillars).toContain('community-ownership');
  });
});

describe('Community Building - Practical Guidance', () => {
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

  it('at least 2 articles address volunteer recruitment or retention', () => {
    const files = getMdxFiles();
    let volunteerCount = 0;
    for (const f of files) {
      const { data, content } = parseFrontmatter(f);
      const tags = Array.isArray(data.tags) ? data.tags : [];
      if (
        tags.includes('volunteer-recruitment') ||
        tags.includes('volunteer-retention') ||
        tags.includes('volunteers') ||
        content.toLowerCase().includes('volunteer recruitment') ||
        content.toLowerCase().includes('volunteer retention')
      ) {
        volunteerCount++;
      }
    }
    expect(volunteerCount).toBeGreaterThanOrEqual(2);
  });
});

describe('Community Building - Cross-References', () => {
  it('at least half of articles cross-reference Port Clinton Way articles', () => {
    const files = getMdxFiles();
    let crossRefCount = 0;

    const pcwDir = path.join(CONTENT_ROOT, 'port-clinton-way');
    const pcwSlugs = new Set<string>();

    if (fs.existsSync(pcwDir)) {
      for (const f of fs.readdirSync(pcwDir).filter((f) => f.endsWith('.mdx'))) {
        const { data } = matter(fs.readFileSync(path.join(pcwDir, f), 'utf-8'));
        if (data.slug) pcwSlugs.add(data.slug);
      }
    }

    for (const f of files) {
      const { data } = parseFrontmatter(f);
      const related = Array.isArray(data.relatedArticles) ? data.relatedArticles : [];
      const hasPcwRef = related.some((slug: string) => pcwSlugs.has(slug));
      if (hasPcwRef) crossRefCount++;
    }

    expect(crossRefCount).toBeGreaterThanOrEqual(Math.floor(files.length / 2));
  });
});

describe('Community Building - Frontmatter Validity', () => {
  it('every article has category "community-building"', () => {
    const files = getMdxFiles();
    for (const f of files) {
      const { data } = parseFrontmatter(f);
      expect(data.category).toBe('community-building');
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

describe('Community Building - Alignment', () => {
  it('no article uses discouraged terminology from voice guide', () => {
    const files = getMdxFiles();
    for (const f of files) {
      const { content } = parseFrontmatter(f);
      expect(content).not.toMatch(
        /PCAB (requires|demands|mandates) that coaches/i
      );
    }
  });

  it('no article prescribes coaching tactics', () => {
    const files = getMdxFiles();
    const prescriptivePatterns = [
      /run this drill/i,
      /use this play/i,
      /coaches must (use|run|implement) (this|these) drill/i,
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

### Background: What "Community Building" Covers

The Community Building category provides program-level guidance for the people who keep youth sports running: booster members, program administrators, volunteer coordinators, and community leaders. Where Parent Guides (section-07) and Coach Resources (section-08) target individuals in specific roles, Community Building targets the organizational layer -- the systems, structures, and culture that make the entire athletic ecosystem work.

Port Clinton is a small community. This means the same people often wear multiple hats (parent, coach, booster member, administrator). Community Building content acknowledges this reality and provides guidance that scales for a community where resources and volunteer pools are limited. The 5 Pillars of Program Success serve as the organizing framework for evaluating program health, measuring outcomes beyond wins and losses, and building a sustainable athletic culture.

**Key principle for community building content:** The 5 Pillars are not just philosophical statements -- they are program evaluation tools. Every article in this category should demonstrate how one or more pillars translate into measurable program actions, decisions, or outcomes.

### Tone Guidance for Community Building Content

Community-building articles have a distinct tone within the overall voice guide:

- **Collaborative** -- "we" language throughout; this is shared community work, not top-down directives
- **Realistic** -- acknowledge the constraints of a small community (limited volunteers, limited funding, overlapping roles)
- **Solutions-oriented** -- every challenge should come with practical approaches, not just identification of problems
- **Data-informed but not data-heavy** -- use metrics and indicators where appropriate, but keep the focus on people and relationships
- **Appreciative** -- volunteer work is the foundation of community youth sports; content should never take volunteers for granted
- **Big-picture framing** -- connect day-to-day operational guidance to the broader mission of youth development

### Article Topic List

Generate articles covering these topics (at minimum). The implementer should write 8-12 articles from this list. Each article targets 2,000-3,000 words.

| # | Slug | Title | Primary Pillar(s) | Audience | Content Focus |
|---|---|---|---|---|---|
| 1 | `volunteer-recruitment-retention` | Recruiting and Retaining Volunteer Coaches: A Community Playbook | community-ownership, character-through-sport | administrator, coach | Strategies for finding, onboarding, training, and keeping volunteer coaches engaged season after season |
| 2 | `measuring-program-success` | Measuring Program Success Beyond the Scoreboard | development-over-results, community-ownership | administrator | Defining and tracking meaningful program metrics (participation rates, retention, athlete development, volunteer satisfaction) using the 5 Pillars |
| 3 | `building-multi-sport-culture` | Building a Multi-Sport Culture in a Small Community | physical-literacy, community-ownership | administrator, coach, parent | How to coordinate schedules, reduce sport-vs-sport competition for athletes, and create a culture where multi-sport participation is the norm |
| 4 | `fundraising-sustainability` | Sustainable Fundraising for Youth Athletic Programs | community-ownership | administrator | Evidence-based fundraising approaches, building long-term sponsorship relationships, aligning fundraising with program mission |
| 5 | `stakeholder-roles-responsibilities` | Who Does What: Defining Stakeholder Roles in Youth Athletics | community-ownership, character-through-sport | administrator, coach, parent | Clarifying the distinct roles of parents, coaches, administrators, boosters, and athletes in a healthy athletic ecosystem |
| 6 | `coordinating-across-sports-seasons` | Coordinating Across Sports and Seasons: A Small-School Approach | community-ownership, health-safety | administrator, coach | Practical coordination strategies: shared calendars, communication protocols, athlete load tracking across sports, preventing schedule conflicts |
| 7 | `inclusive-program-design` | Designing Inclusive Athletic Programs for Every Child | community-ownership, physical-literacy | administrator, coach | Ensuring programs serve all ability levels, all family situations, and all backgrounds; removing barriers to participation |
| 8 | `program-health-assessment` | Assessing Program Health: An Annual Review Framework | community-ownership, development-over-results | administrator | Using the 5 Pillars as an annual program assessment tool with specific indicators, data collection methods, and action planning |
| 9 | `parent-engagement-strategy` | Engaging Parents as Partners in Program Success | community-ownership, character-through-sport | administrator, parent | Moving parents from spectators to stakeholders through communication, volunteer pathways, and shared mission alignment |
| 10 | `small-community-advantages` | The Small-Community Advantage: Turning Size Into Strength | community-ownership, development-over-results | administrator, coach, parent | How small communities like Port Clinton can leverage closeness, shared identity, and multi-sport necessity as strategic advantages |
| 11 | `creating-coach-development-pathway` | Creating a Coach Development Pathway for Your Program | community-ownership, development-over-results | administrator | Building a progressive development system for volunteer coaches: orientation, mentoring, continuing education, and recognition |
| 12 | `conflict-resolution-youth-sports` | Navigating Conflict in Youth Sports Programs | character-through-sport, community-ownership | administrator, coach | Frameworks for resolving common conflicts (parent-coach, coach-administrator, between-sport) in constructive ways |

### Per-Article Generation Process

For each article, follow this process:

1. **Set up frontmatter** using the controlled vocabulary from section-02. Every article in this section uses `category: community-building`. Every article must include `administrator` in the `audience` array (most will also include `coach` or `parent` as secondary audiences since community-level decisions affect everyone). Select appropriate values for `subcategory`, `tags`, `ageGroup`, `ltadStage`, `contentType`, `pillar`, and `difficulty`.

   **Age group note:** Many community building articles apply across all age groups because they address program-level structures. When an article applies to the entire program, use all four age groups (`6-8, 9-11, 12-14, 15-18`) and the full range of LTAD stages. When an article focuses on a specific developmental stage (e.g., building programs for the youngest athletes), narrow the age group selection accordingly.

2. **Write the article body** following the template from section-01:
   - **Key Takeaways** (3-5 bullet points)
   - **Introduction** (2-3 paragraphs setting context, collaborative "we" tone)
   - **Main Content Sections** (3-5 sections with evidence-based content, connecting to the 5 Pillars where applicable)
   - **Practical Application** (specific actions, checklists, or frameworks administrators and community leaders can implement)
   - **AD Placeholder** (format below)
   - **References** (cited sources)

3. **Add AD placeholder** -- community building articles use `valuable` tier (AD input is particularly important for these articles since they directly address program philosophy and operations):
   ```mdx
   {/* [AD_INPUT_NEEDED]
      Type: philosophy-statement | program-example
      Priority: valuable
      Context: [Brief description of article topic]
      Guidance: Share how Port Clinton's athletic programs approach this topic, including any specific policies, practices, or aspirations (2-3 paragraphs)
   */}
   ```

4. **Add cross-references** -- link to relevant Port Clinton Way articles (section-04) in the `relatedArticles` array since the 5 Pillars are the program evaluation framework. Also link to Development Frameworks (section-05) and Health & Safety (section-06) articles where program design draws on that evidence base. Where applicable, link to Coach Resources (section-08) and Parent Guides (section-07) articles. At least half of community building articles should cross-reference Port Clinton Way pillar articles.

5. **Update the progress manifest** (`/content/_progress.yaml`) with an entry for each new article.

### Frontmatter Example

```yaml
---
title: "Measuring Program Success Beyond the Scoreboard"
description: "A framework for defining and tracking meaningful youth sports program metrics using the 5 Pillars, from participation rates to athlete development."
slug: measuring-program-success
date: "2025-02-15"
lastUpdated: "2025-02-15"
category: community-building
subcategory: program-evaluation
tags:
  - program-metrics
  - program-evaluation
  - success-measurement
  - pillar-framework
  - data-informed
audience:
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
  - development-over-results
  - community-ownership
difficulty: intermediate
estimatedReadTime: 10
sportRelevance: sport-general
relatedArticles:
  - development-over-results
  - community-ownership-pillar
  - physical-literacy-first
  - program-health-assessment
  - building-multi-sport-culture
prerequisites: []
references:
  - title: "Positive Coaching Alliance - Program Assessment Resources"
    url: "https://positivecoach.org/"
    accessed: "2025-02-15"
  - title: "Aspen Institute - Sport for All, Play for Life"
    url: "https://www.aspenprojectplay.org/"
    accessed: "2025-02-15"
  - title: "Long-Term Athlete Development 2.0 - Canadian Sport for Life"
    url: "https://sportforlife.ca/long-term-development/"
    accessed: "2025-02-15"
status: review
---
```

### Content Guidelines Specific to Community Building

**Key principle: The 5 Pillars as a program evaluation framework.** Community Building articles should demonstrate how the 5 Pillars translate into operational decisions. Articles should not simply restate the pillars -- they should show what the pillars look like in practice at the program level.

| Pillar Slug | Program-Level Application |
|---|---|
| `physical-literacy` | Program design that ensures fundamental movement skills are developed across all sports; assessment of whether programs provide adequate motor development opportunities |
| `development-over-results` | Metrics that track athlete growth over win-loss records; season structures that prioritize training over competition; playing time approaches that favor development |
| `health-safety` | Program-wide safety protocols; coordinated training load management across sports; injury tracking and prevention systems; return-to-play policies |
| `character-through-sport` | Sportsmanship expectations across all programs; recognition systems that value character traits; coach behavior standards; identity-based program culture |
| `community-ownership` | Volunteer pipeline health; stakeholder engagement levels; inclusive access metrics; fundraising sustainability; cross-sport coordination effectiveness |

**Small-community framing:**
- Acknowledge that Port Clinton is a small community where everyone knows everyone
- Limited volunteer pool means the same people serve in multiple roles -- content should account for volunteer fatigue
- Multi-sport participation often happens by necessity (not enough athletes to fill single-sport rosters), which happens to align with the evidence base
- Fundraising resources are finite -- sustainability matters more than any single campaign
- Program decisions affect the whole community; there is no "anonymous" participation in a small town

**What to avoid:**
- Do not prescribe coaching tactics, plays, or drills (same rule as all other content)
- Do not assume unlimited resources or large volunteer pools
- Do not present "big program" solutions that require staff and budgets a booster organization would not have
- Do not position administrators or boosters as having authority over coaches' on-field decisions
- Do not use corporate management jargon that would feel alien to a small-town volunteer organization

### Pillar Connection Guide

Every article must connect to at least one of the 5 Pillars. Community Building has the strongest connection to `community-ownership` but should draw on all five pillars:

| Pillar Slug | Relevance to Community Building |
|---|---|
| `physical-literacy` | Inclusive program design ensuring physical literacy development for all youth; multi-sport culture that supports broad movement development. |
| `development-over-results` | Measuring program success through development metrics; advocating for training-over-competition at the program level. |
| `health-safety` | Cross-sport coordination to manage athlete load; program-wide safety policies; health-first culture. |
| `character-through-sport` | Program-wide character expectations; sportsmanship culture; conflict resolution frameworks; recognition systems. |
| `community-ownership` | Primary pillar for this category. Volunteer recruitment/retention, stakeholder roles, fundraising, coordination, inclusive access, shared responsibility for the athletic ecosystem. |

### Research Sources to Cite

Community Building articles should reference these established sources:

- **Positive Coaching Alliance** -- organizational culture resources, Creating a Positive Coaching Environment, Chapter and School Partnership models
- **Aspen Institute, Project Play** -- "Sport for All, Play for Life" framework, community-level youth sport recommendations, participation data
- **National Council of Youth Sports (NCYS)** -- standards for youth sport organizations, volunteer management guidelines
- **NSCA Position Statement on Long-Term Athletic Development** (Lloyd et al., 2016) -- pillar 2 (inclusive access), pillar 9 (qualified coaching oversight), community-level recommendations
- **LTAD / Canadian Sport for Life** -- community sport model, multi-sport system design, organizational implementation guides
- **Holt et al. (2017)** -- "A grounded theory of positive youth development through sport based on results from a qualitative meta-study" (community factors in youth sport outcomes)
- **Coakley (2011)** -- "Youth Sports: What Counts as 'Positive Development?'" (program-level analysis of youth sport benefits)
- **Doherty & Misener (2008)** -- community sport volunteer management research
- **National Alliance for Youth Sports** -- volunteer coach training standards, organizational guidelines
- **Farrey (2008)** -- "Game On: The All-American Race to Make Champions of Our Children" (community-level analysis of youth sport culture in America)

---

## Verification Checklist

After implementation, verify:

- [ ] At least 8 MDX articles exist in `/content/community-building/`
- [ ] Every article has `category: community-building` in frontmatter
- [ ] Every article includes `administrator` in its `audience` array
- [ ] At least half of articles include the `community-ownership` pillar
- [ ] All 5 Pillar slugs appear across at least one article in the category
- [ ] At least 2 articles specifically address volunteer recruitment or retention
- [ ] At least half of articles cross-reference Port Clinton Way (section-04) articles
- [ ] Every article connects to at least one of the 5 Pillars via `pillar` frontmatter
- [ ] Every article cites at least one established source in the `references` array
- [ ] Every article includes an `[AD_INPUT_NEEDED]` block (most with `valuable` priority tier)
- [ ] Every article follows the body template (Key Takeaways, Introduction, Practical Application, References)
- [ ] The progress manifest (`/content/_progress.yaml`) is updated with entries for all new articles
- [ ] No article prescribes coaching tactics, plays, or drills
- [ ] Articles use collaborative "we" language and small-community framing
- [ ] All articles use preferred terminology from the voice guide
- [ ] All tests in `__tests__/content/community-building.test.ts` pass

---

## Dependencies and Downstream Sections

**This section depends on:**
- **section-01-foundation** -- directory structure at `/content/community-building/`, progress manifest, article body template
- **section-02-vocabulary-schema** -- controlled vocabulary for frontmatter values, frontmatter schema validation
- **section-03-voice-alignment** -- voice guide, alignment principles, calibration articles for scoring
- **section-04-port-clinton-way** -- the 5 Pillars articles that serve as the program evaluation framework for all community building content

**Sections that may inform this section (not hard dependencies):**
- **section-05-development-frameworks** -- evidence-base articles that inform program design rationale (e.g., multi-sport culture is grounded in LTAD evidence)
- **section-06-health-safety** -- safety guidelines that inform program-wide safety policies
- **section-07-parent-guides** -- parent engagement articles inform the parent-as-partner perspective
- **section-08-coach-resources** -- volunteer coach onboarding and development content provides the coach-facing counterpart to community-level coach development

**Sections that depend on this section:**
- **section-10-curated-resources** -- sources cited in these articles feed into the curated resources compilation
- **section-11-cross-references-qa** -- final cross-reference and quality pass across all articles
