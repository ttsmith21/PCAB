# Section 03: Voice Alignment -- Voice Guide, Alignment Principles, Calibration Articles, and Alignment Checker

## Overview

This section creates the voice and alignment infrastructure that governs the quality and consistency of every article in the content library. It produces four deliverables: a brand voice guide, an alignment principles document, three calibration articles (scored at 1, 3, and 5), and an alignment checker tool. Together, these ensure that all content generated in sections 04-10 meets publication-ready quality standards.

The alignment checker has two components: deterministic checks (frontmatter validation against the vocabulary from section-02, terminology matching against the voice guide) and LLM-scored checks (content alignment against the principles document using calibration anchors). The deterministic checks run automatically; the LLM-scored checks are prompt-based until the pipeline tooling from split 01 is built.

**What gets created:**

| Deliverable | Path | Purpose |
|---|---|---|
| Voice guide | `/content/_voice-guide.md` | Brand voice, tone, terminology standards |
| Alignment principles | `/content/_alignment-principles.md` | Must-have signals and red-flag patterns for content validation |
| Calibration article (score 5) | `/content/port-clinton-way/calibration-score-5.mdx` | Exemplary article anchoring the top of the rubric |
| Calibration article (score 3) | `/content/port-clinton-way/calibration-score-3.mdx` | Needs-revision article anchoring the middle of the rubric |
| Calibration article (score 1) | `/content/port-clinton-way/calibration-score-1.mdx` | Fails-alignment article anchoring the bottom of the rubric |
| Alignment checker | `lib/content/alignment-checker.ts` | Deterministic checks + LLM scoring prompt template |
| Alignment checker tests | `__tests__/content/voice-alignment.test.ts` | Tests for all deliverables |

---

## Tests (Write First)

All tests use Vitest. Tests for this section live at `__tests__/content/voice-alignment.test.ts`.

```typescript
// File: __tests__/content/voice-alignment.test.ts

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const CONTENT_ROOT = path.resolve(__dirname, '../../content');

describe('Voice Guide', () => {
  const voiceGuidePath = path.join(CONTENT_ROOT, '_voice-guide.md');

  it('voice guide file exists at /content/_voice-guide.md', () => {
    expect(fs.existsSync(voiceGuidePath)).toBe(true);
  });

  it('voice guide contains terminology standards section', () => {
    const content = fs.readFileSync(voiceGuidePath, 'utf-8');
    expect(content).toMatch(/terminology/i);
    // Should contain a table or list of preferred vs. avoided terms
    expect(content).toContain('Preferred');
    expect(content).toContain('Avoid');
  });

  it('voice guide contains tone boundaries section', () => {
    const content = fs.readFileSync(voiceGuidePath, 'utf-8');
    expect(content).toMatch(/tone boundaries/i);
  });

  it('voice guide contains voice characteristics section', () => {
    const content = fs.readFileSync(voiceGuidePath, 'utf-8');
    // Should describe the key voice traits (approachable, evidence-based, etc.)
    expect(content).toMatch(/voice characteristics/i);
  });
});

describe('Alignment Principles', () => {
  const principlesPath = path.join(CONTENT_ROOT, '_alignment-principles.md');

  it('alignment principles file exists at /content/_alignment-principles.md', () => {
    expect(fs.existsSync(principlesPath)).toBe(true);
  });

  it('alignment principles contains must-have signals section', () => {
    const content = fs.readFileSync(principlesPath, 'utf-8');
    expect(content).toMatch(/must-have signals/i);
  });

  it('alignment principles contains red-flag patterns section', () => {
    const content = fs.readFileSync(principlesPath, 'utf-8');
    expect(content).toMatch(/red-flag patterns/i);
  });

  it('alignment principles contains terminology check list section', () => {
    const content = fs.readFileSync(principlesPath, 'utf-8');
    expect(content).toMatch(/terminology check/i);
  });

  it('alignment principles contains scoring rubric', () => {
    const content = fs.readFileSync(principlesPath, 'utf-8');
    // Should describe what scores 1, 3, and 5 look like
    expect(content).toMatch(/score 5/i);
    expect(content).toMatch(/score 3/i);
    expect(content).toMatch(/score 1/i);
  });
});

describe('Calibration Articles', () => {
  const calibrationDir = path.join(CONTENT_ROOT, 'port-clinton-way');

  it('calibration article at score 5 exists', () => {
    expect(fs.existsSync(path.join(calibrationDir, 'calibration-score-5.mdx'))).toBe(true);
  });

  it('calibration article at score 3 exists', () => {
    expect(fs.existsSync(path.join(calibrationDir, 'calibration-score-3.mdx'))).toBe(true);
  });

  it('calibration article at score 1 exists', () => {
    expect(fs.existsSync(path.join(calibrationDir, 'calibration-score-1.mdx'))).toBe(true);
  });

  it('score 5 calibration article has valid frontmatter with all required fields', () => {
    // Parse frontmatter from calibration-score-5.mdx using gray-matter or manual YAML extraction.
    // Validate against the schema from section-02.
  });

  it('score 5 calibration article demonstrates exemplary alignment', () => {
    const content = fs.readFileSync(
      path.join(calibrationDir, 'calibration-score-5.mdx'),
      'utf-8'
    );
    // Must cite 3+ established sources
    // Must use preferred terminology throughout
    // Must connect to a pillar with concrete examples
    expect(content).toMatch(/LTAD|AAP|NSCA|Positive Coaching Alliance/);
    expect(content).toContain('Key Takeaways');
    expect(content).toContain('Practical Application');
    expect(content).toContain('References');
  });

  it('score 1 calibration article demonstrates alignment failure', () => {
    const content = fs.readFileSync(
      path.join(calibrationDir, 'calibration-score-1.mdx'),
      'utf-8'
    );
    // Should contain red-flag patterns for demonstration purposes:
    // prescriptive coaching language, unsupported claims, or win-focused framing
  });
});

describe('Alignment Checker', () => {
  // These tests import the alignment checker module.
  // Adjust import path as needed:
  //   import { runDeterministicChecks } from '../../lib/content/alignment-checker';

  it('alignment checker returns structured report with overall score and per-category scores', () => {
    // The structured report should have: overallScore, categoryScores, issues, suggestions
  });

  it('deterministic checks catch invalid frontmatter', () => {
    // Run deterministic checks on an article with an invalid category.
    // Expect the report to include a frontmatter validation error.
  });

  it('deterministic checks flag red-flag terminology patterns', () => {
    // Run deterministic checks on text containing "you should always" or
    // "winning is everything". Expect red-flag issues in the report.
  });

  it('deterministic checks verify preferred terminology usage', () => {
    // Run deterministic checks on text using "kid" instead of "youth athlete".
    // Expect a terminology warning in the report.
  });

  it('LLM scoring prompt template includes calibration anchors', () => {
    // The prompt template string should reference all three calibration score levels
    // so the LLM has anchored examples for consistent scoring.
  });
});
```

---

## Implementation Details

### Step 1: Create the Voice Guide

**File path:** `/content/_voice-guide.md`

This document defines the PCAB content voice. Every article writer (human or LLM) should read this before writing. The voice guide must contain these sections:

**Voice Characteristics** -- Define the seven core voice traits:

1. **Knowledgeable but approachable** -- Expert information presented for a general audience. Avoid jargon without explanation. Use concrete examples.
2. **Encouraging, not preachy** -- Inspire action without lecturing. Frame guidance as opportunities, not mandates.
3. **Evidence-based, not opinion-based** -- Always cite sources. Attribute recommendations to specific research, guidelines, or frameworks.
4. **Inclusive** -- All ability levels, all sports, all family situations. Never assume a two-parent household, a specific income level, or a single-sport focus.
5. **Respectful of coach autonomy** -- Present frameworks and research. Never prescribe specific tactics, plays, or drills. Content authority flows from established research, not from the booster club.
6. **Community-oriented** -- Use "we" language and shared goals. Frame PCAB as a community resource, not an authority figure.
7. **Practical** -- Every article includes specific, actionable takeaways. Avoid purely theoretical content.

**Terminology Standards** -- A table of preferred and avoided terms:

| Preferred | Avoid | Reason |
|---|---|---|
| development | winning | Keeps focus on growth, not outcomes |
| physical literacy | athleticism | Specific, research-backed term (LTAD) |
| athlete development | player development | Inclusive of all sports, not just team |
| youth athlete | kid | Respectful, affirms identity |
| evidence suggests | you should | Non-prescriptive, cites authority |
| age-appropriate | for their level | Specific, ties to developmental stages |
| multi-sport participation | playing multiple sports | Precise, aligns with LTAD terminology |
| volunteer coach | youth coach | Acknowledges the volunteer nature of community coaching |
| training load | amount of practice | Technical accuracy, aligned with research terminology |
| fundamental movement skills | basic skills | Specific LTAD term with defined meaning |

**Tone Boundaries** -- Explicit rules about what the voice does and does not do:

- Research-cited specifics are appropriate (e.g., "AAP recommends limiting organized sport training hours to the child's age per week")
- Never prescribe coaching tactics, plays, formations, or specific drills
- Never position PCAB as telling coaches how to coach
- Content authority comes from citing LTAD, AAP, NSCA, PCA, and peer-reviewed research -- not from the booster club's own opinions
- When discussing multi-sport vs. specialization: present evidence clearly, acknowledge families may choose differently, avoid dogmatic positions, recognize small-school practical realities

**Multi-Sport vs. Specialization Guidance** -- Because this is the most philosophically charged area, include specific editorial guidance:

- Present the evidence for multi-sport participation clearly and thoroughly
- Acknowledge legitimate reasons families choose specialization (elite talent pathway, child's own passion)
- Frame as "here's what the evidence says" not "here's what you should do"
- Recognize the small-school practical reality: Port Clinton needs athletes in multiple sports to field teams
- Avoid both extremes: neither "specialization is always wrong" nor "let kids do whatever"

### Step 2: Create the Alignment Principles Document

**File path:** `/content/_alignment-principles.md`

This is the scoring rubric and validation standard for all articles. The alignment checker reads this document to evaluate content. It must contain:

**Must-Have Signals** (every published article must include all of these):

1. At least one citation to established research or framework (LTAD, AAP, NSCA, PCA, or peer-reviewed study)
2. Actionable takeaway for the stated audience (not purely theoretical)
3. Age-appropriate framing consistent with the article's stated `ageGroup` values
4. Connection to at least one of the 5 Pillars (explicit or clear implicit reference)

**Red-Flag Patterns** (any published article containing these fails alignment):

1. Prescriptive coaching tactics -- specific plays, drills, formations, or schemes
2. Win-at-all-costs framing -- measuring success primarily by wins/losses
3. Early specialization promotion without balanced counterpoint
4. Training recommendations exceeding AAP guidelines for the stated age group (hours per week exceeding chronological age, more than 16 hours/week total, no mandatory rest days)
5. Unsupported claims -- recommendations without citations to established sources
6. Language positioning PCAB as authority over coaches ("coaches should...", "the right way to coach...")
7. Exclusionary language or assumptions (single-sport, two-parent, high-income assumptions)

**Terminology Check List** -- Reference the voice guide terminology table. During validation, check that:
- Preferred terms are used consistently
- Avoided terms do not appear (or appear only in explicit contrast, e.g., "rather than focusing on winning, emphasize development")
- Tone remains encouraging and non-prescriptive throughout

**Scoring Rubric** -- Define what each alignment score means, with anchored descriptions:

- **Score 5 (Exemplary):** Cites 3+ established sources with specific references (author/organization and year). All recommendations are age-appropriate with specific citations. Uses preferred terminology throughout. Actionable takeaways clearly serve the stated audience. Connects to pillar(s) with concrete examples. No red-flag patterns.
- **Score 4 (Aligned):** Cites 1-2 established sources. Recommendations are age-appropriate. Uses preferred terminology with minor lapses (1-2 instances). Actionable takeaways present. Pillar connection present. No red-flag patterns.
- **Score 3 (Needs Revision):** References frameworks generically without specific citations ("research shows..."). Mixes appropriate and inappropriate terminology. Recommendations are reasonable but not tied to specific guidelines. Weak or missing pillar connection. No red-flag patterns.
- **Score 2 (Significant Issues):** Few or no citations. Some recommendations lack age-appropriate caveats. Multiple terminology issues. Weak takeaways. One or more soft red-flag patterns.
- **Score 1 (Fails Alignment):** Makes unsupported claims. Uses prescriptive language ("you should always..."). Recommends training loads without age-appropriate caveats. Positions PCAB as coaching authority. Or promotes early specialization without counterpoint.

**Target:** All published articles must score 4+. Articles scoring 3 are revised before publication. Articles scoring 1-2 are rewritten.

### Step 3: Create the Three Calibration Articles

These are full-length articles (2,000-3,000 words each) in the Port Clinton Way category that anchor the scoring rubric. They serve as concrete examples of what each score level looks like and are loaded by the alignment checker as reference material.

**Calibration Article at Score 5** -- `/content/port-clinton-way/calibration-score-5.mdx`

Write a full article on "Physical Literacy First: The Foundation of Youth Athletic Development" that demonstrates exemplary alignment:
- Full valid frontmatter (category: `port-clinton-way`, subcategory: `five-pillars`, pillar: `[physical-literacy]`, audience: `[parent, coach, administrator]`, ageGroup: `[6-8, 9-11, 12-14, 15-18]`, contentType: `guide`, status: `review`, adPlaceholderTier in AD comment: `critical`)
- Cites LTAD (Balyi & Hamilton), AAP (Council on Sports Medicine, 2016), NSCA (Lloyd & Oliver, 2012), and PCA (Thompson, 2010) with specific author/year references
- Uses preferred terminology exclusively (physical literacy, youth athlete, development, evidence suggests)
- Clear age-appropriate framing with specific recommendations per age group
- Explicit connection to the Physical Literacy First pillar with measurable indicators
- Contains Key Takeaways (3-5 bullets), Introduction, 3-5 main content sections, Practical Application, AD_INPUT_NEEDED block (Type: philosophy-statement, Priority: critical), and References
- No red-flag patterns

**Calibration Article at Score 3** -- `/content/port-clinton-way/calibration-score-3.mdx`

Write a full article on a Port Clinton Way topic that demonstrates score 3 (Needs Revision) characteristics:
- Valid frontmatter but demonstrates weaker content alignment
- References "research" generically without specific citations (e.g., "studies show that..." without naming the study)
- Mixes preferred and avoided terminology (uses "kid" and "youth athlete" interchangeably, says "winning" alongside "development")
- Recommendations are reasonable but not tied to specific age-appropriate guidelines
- Weak pillar connection (mentions a pillar in passing, does not develop it)
- Still has Key Takeaways and References, but references are vague
- No hard red-flag patterns, but overall quality is below publication standard

**Calibration Article at Score 1** -- `/content/port-clinton-way/calibration-score-1.mdx`

Write a full article that demonstrates score 1 (Fails Alignment) characteristics:
- Frontmatter present but content fails alignment
- Makes unsupported claims about training methods without any citations
- Uses prescriptive language ("coaches should always...", "the right way to...")
- Positions the booster club as an authority on coaching methods
- Promotes early specialization without presenting counterevidence
- Contains win-focused framing (measuring program success by championships)
- May include training load recommendations that exceed AAP guidelines without caveats

All three calibration articles should be added to the progress manifest (`/content/_progress.yaml`) with their alignment scores recorded.

### Step 4: Implement the Alignment Checker

**File path:** `lib/content/alignment-checker.ts`

The alignment checker has two layers:

**Layer 1: Deterministic Checks** -- These run programmatically without any LLM:

1. **Frontmatter validation** -- Use the schema from section-02 to validate all required fields and controlled vocabulary values
2. **Terminology matching** -- Scan article body text for:
   - Red-flag patterns (regex-based): prescriptive phrases like "you should always", "coaches must", "the right way to", "winning is what matters"
   - Avoided terminology from the voice guide: "kid" (when not in a quote), "winning" (as a goal rather than a description), "player development" (instead of "athlete development"), "athleticism" (instead of "physical literacy")
   - Missing preferred terminology: check that the article uses at least some of the preferred terms from the voice guide
3. **Required section checks** -- Verify the article body contains: Key Takeaways, Introduction, Practical Application, References
4. **AD placeholder validation** -- If the article's category is `port-clinton-way`, verify an AD_INPUT_NEEDED block is present with Priority: critical

**Layer 2: LLM-Scored Alignment** -- A prompt template that can be sent to Claude (or any LLM) for content scoring:

The prompt should:
1. Include the full text of the alignment principles document
2. Include the full text of the article under review
3. Include condensed versions of the three calibration articles as score anchors
4. Ask the LLM to score the article on the 1-5 scale with specific justification
5. Request a structured response with: overall score, per-category scores (citations, terminology, age-appropriateness, pillar connection, actionability, red-flags), specific issues with line references, and suggested fixes

```typescript
// File: lib/content/alignment-checker.ts
// Stub signatures for the alignment checker.

export interface AlignmentReport {
  overallScore: number | null; // null if only deterministic checks were run
  deterministic: {
    frontmatterValid: boolean;
    frontmatterErrors: Array<{ field: string; message: string }>;
    redFlagPatterns: Array<{ pattern: string; line: number; excerpt: string }>;
    terminologyIssues: Array<{ term: string; suggestion: string; line: number }>;
    requiredSectionsMissing: string[];
    adPlaceholderValid: boolean | null; // null if not applicable
  };
  llmScoring: {
    overallScore: number;
    categoryScores: Record<string, number>;
    issues: Array<{ category: string; description: string; lineRef?: number }>;
    suggestions: string[];
  } | null; // null if LLM scoring was not run
}

export function runDeterministicChecks(
  articlePath: string
): AlignmentReport['deterministic'] {
  /**
   * Run all deterministic validation checks on the article at the given path.
   * Returns the deterministic portion of the AlignmentReport.
   */
}

export function generateScoringPrompt(
  articleContent: string,
  principlesContent: string,
  calibrationArticles: { score5: string; score3: string; score1: string }
): string {
  /**
   * Generate the LLM prompt for content alignment scoring.
   * The prompt includes the principles, calibration anchors, and the article to score.
   * Returns the prompt string to send to the LLM.
   */
}

export function parseAlignmentResponse(
  llmResponse: string
): AlignmentReport['llmScoring'] {
  /**
   * Parse the LLM's structured response into the llmScoring portion of the report.
   */
}
```

The deterministic checks run fast and should be the first gate. Only articles passing deterministic checks (valid frontmatter, no red-flag patterns) should proceed to the more expensive LLM scoring step.

---

## Verification Checklist

After implementation, verify:

- [ ] `/content/_voice-guide.md` exists and contains: Voice Characteristics, Terminology Standards (with Preferred/Avoid table), Tone Boundaries, Multi-Sport vs. Specialization guidance
- [ ] `/content/_alignment-principles.md` exists and contains: Must-Have Signals, Red-Flag Patterns, Terminology Check List, Scoring Rubric (scores 1-5)
- [ ] `/content/port-clinton-way/calibration-score-5.mdx` exists with full valid frontmatter and exemplary content
- [ ] `/content/port-clinton-way/calibration-score-3.mdx` exists demonstrating needs-revision characteristics
- [ ] `/content/port-clinton-way/calibration-score-1.mdx` exists demonstrating alignment failure
- [ ] All three calibration articles are added to `/content/_progress.yaml` with alignment scores
- [ ] `lib/content/alignment-checker.ts` exports `runDeterministicChecks()`, `generateScoringPrompt()`, and `parseAlignmentResponse()`
- [ ] Deterministic checks catch invalid frontmatter values
- [ ] Deterministic checks flag red-flag terminology patterns
- [ ] Deterministic checks verify presence of required article sections
- [ ] LLM scoring prompt template includes all three calibration anchors
- [ ] All tests in `__tests__/content/voice-alignment.test.ts` pass

---

## Dependencies and Downstream Sections

**This section depends on:**
- **section-01-foundation** -- The `/content/` directory and `/content/port-clinton-way/` subdirectory must exist. The progress manifest must exist to record calibration articles.
- **section-02-vocabulary-schema** -- The controlled vocabulary and frontmatter schema are needed for deterministic frontmatter validation in the alignment checker. The calibration articles must have valid frontmatter per the schema.

**Sections that depend on this section:**
- **section-04-port-clinton-way** -- Runs the alignment checker on every article. Uses the voice guide and alignment principles to maintain consistency. The three calibration articles also live in the Port Clinton Way category.
- **sections 05-10** -- All run the alignment checker on every generated article
- **section-11-cross-references-qa** -- Uses the alignment checker as part of the final quality assurance pass
