# Implementation Plan: PCAB Content Library Creation

## 1. Overview

### What We're Building

A publication-ready content library of 75-100+ expert-quality articles for the Port Clinton Athletic Boosters (PCAB). The library serves parents, volunteer coaches, athletes (K-12), and program administrators with evidence-based guidance on youth sports development. All content is stored as MDX files with structured frontmatter metadata, organized by category in a `/content` directory.

### Why This Approach

PCAB needs a knowledge base that earns trust through quality, not volume. The content must:
- Stand on established research (LTAD, AAP, NSCA, Positive Coaching Alliance) rather than opinion
- Respect coach autonomy — never prescribe tactics, plays, or drills
- Use framework-agnostic MDX — standard YAML frontmatter, no JSX imports in article bodies, no platform-specific features. This means content works with the existing Next.js 16 app or a future Astro migration.
- Include placeholder blocks (`[AD_INPUT_NEEDED]`) for Athletic Director input that comes later (split 06)
- Be iteratively generated category-by-category, with earlier content informing later articles

### Existing Codebase Context

The project is already a **Next.js 16 application** (`pc-boosters-web`) using React 19, Tailwind CSS 4, and static export. The `/content` directory lives at the project root, co-located with the existing app. Split 03 will decide the rendering approach (e.g., `next-mdx-remote`, Velite, or a migration to Astro), but the content files produced here must be compatible with any of those paths. In practice, "framework-agnostic" means:
- Standard YAML frontmatter (no framework-specific fields)
- No JSX component imports in article bodies
- No framework-specific directives or shortcodes
- Pure MDX content that any MDX-compatible renderer can process

### Key Constraints

1. **No pipeline tooling yet** — Split 01 (content generation pipeline) hasn't been built. This plan produces MDX files and a philosophy document that the pipeline will later consume. Content creation proceeds independently.
2. **Framework-agnostic content** — MDX files use standard YAML frontmatter with no platform-specific features. Compatible with the existing Next.js 16 app and any future platform decision in split 03.
3. **No AD input** — Content uses universally sound principles from established frameworks. The AD's personal philosophy is injected later via placeholder blocks.
4. **Publication-ready quality** — Articles must be ready to publish after alignment checks (automated + human spot-check). No "draft for human editing" tier.

---

## 2. Content Architecture

### 2.1 Directory Structure

```
/content/
├── parent-guides/
├── coach-resources/
├── development-frameworks/
├── health-safety/
├── community-building/
├── port-clinton-way/
└── resources/
```

Category-based folder structure chosen over flat organization because:
- At 75-100+ files, flat directories become unwieldy
- Folder structure provides implicit categorization that survives metadata schema changes
- Most MDX frameworks (Astro Content Collections, Velite) map directory structure to content types naturally

### 2.2 Frontmatter Schema

Every MDX file includes structured YAML frontmatter with these field groups:

**Required fields:**
- `title`, `description` (150-160 chars), `slug`, `date`, `lastUpdated`
- `category` (single-select from controlled vocabulary)
- `subcategory`, `tags` (array from controlled vocabulary)
- `audience` (array: parent, coach, athlete, administrator)
- `ageGroup` (array: 6-8, 9-11, 12-14, 15-18)
- `ltadStage` (array: active-start, fundamentals, learn-to-train, train-to-train, train-to-compete)
- `contentType` (guide, framework, checklist, case-study, research-summary, faq)
- `pillar` (array mapping to the 5 Pillars)
- `status` (draft, review, published, archived)

**Optional fields:**
- `excerpt` (longer summary for content cards, RSS feeds — no character limit)
- `difficulty` (beginner, intermediate, advanced)
- `estimatedReadTime` (minutes)
- `sportRelevance` (sport-general, team-sports, individual-sports)
- `featuredImage` (path to hero/featured image — images themselves are out of scope for this split)
- `relatedArticles` (array of slugs)
- `prerequisites` (array of slugs)
- `series` (name + order for multi-part content)
- `references` (array of {title, url, accessed} objects)
- `version`, `reviewDate`

**Design decisions:**
- Single-select `category` for primary navigation, multi-select facets for filtering
- `ageGroup` uses clean, non-overlapping ranges (`6-8, 9-11, 12-14, 15-18`) aligned with the LTAD research. Articles are multi-tagged when they span age groups.
- `ltadStage` is separate from `ageGroup` because LTAD emphasizes developmental age over chronological age
- `pillar` connects every article back to the 5 Pillars, enabling philosophy-based content discovery

**Age Group to LTAD Stage Mapping:**

| ageGroup | Primary ltadStage(s) | Notes |
|----------|---------------------|-------|
| 6-8 | active-start, fundamentals | FUNdamentals emphasis, multi-sport sampling |
| 9-11 | fundamentals, learn-to-train | Transition period, skill windows opening |
| 12-14 | learn-to-train, train-to-train | Peak skill learning, puberty onset varies |
| 15-18 | train-to-train, train-to-compete | Sport refinement, competition readiness |

**Pillar Name-to-Slug Mapping:**

| Display Name | Frontmatter Slug |
|---|---|
| Physical Literacy First | `physical-literacy` |
| Development Over Results | `development-over-results` |
| Health and Safety Above All | `health-safety` |
| Character Through Sport | `character-through-sport` |
| Community Ownership | `community-ownership` |

### 2.3 Controlled Vocabulary

A controlled vocabulary file defines the valid values for all enumerated frontmatter fields. This prevents taxonomy drift as the library grows.

**File:** `/content/_vocabulary.yaml`

Contains:
- All valid `category` values with descriptions
- All valid `subcategory` values mapped to parent categories
- Approved `tags` list (starts small, grows with content)
- Valid `audience`, `ageGroup`, `ltadStage`, `contentType`, `pillar`, `difficulty`, `sportRelevance` values

New tags require explicit addition to the vocabulary — no ad-hoc tagging.

---

## 3. The 5 Pillars of Program Success

### 3.1 Derivation Approach

The 5 Pillars are synthesized from four established frameworks:
1. **LTAD's 7 core principles** (physical literacy, developmental age, multi-sport, etc.)
2. **Positive Coaching Alliance's Double-Goal Coach** (winning + teaching life lessons)
3. **NSCA's 10 Pillars of LTAD** (individual development, early sampling, qualified oversight, etc.)
4. **AAP youth sports guidelines** (training limits, rest requirements, specialization timing)

### 3.2 Proposed 5 Pillars

These pillars distill the common themes across all four frameworks into actionable principles:

1. **Physical Literacy First** — Every child develops fundamental movement skills (agility, balance, coordination) before sport-specific training. Multi-sport participation is the primary vehicle. Grounded in LTAD stages 1-3 and NSCA pillars 3-4.

2. **Development Over Results** — Program success is measured by athlete growth, not win-loss records. Training-to-competition ratios favor development. Age-appropriate expectations at every level. Grounded in LTAD's long-term perspective and PCA's Double-Goal framework.

3. **Health and Safety Above All** — Training loads respect AAP guidelines (hours ≤ age, max 16/week). Mandatory rest days. Concussion protocols. Injury prevention through proper progression. Delay specialization until 15-16. Grounded in AAP clinical reports and NSCA pillar 5.

4. **Character Through Sport** — Athletics builds character traits (resilience, teamwork, discipline, sportsmanship) that extend beyond the playing field. Identity-based motivation ("We are the kind of people who..."). Grounded in PCA's Second-Goal Teaching and community-level research on youth development.

5. **Community Ownership** — Every stakeholder (parents, coaches, athletes, administrators, boosters) shares responsibility for the athletic ecosystem. Volunteer development, inclusive programs, coordinated multi-sport scheduling. Grounded in NSCA pillars 2 and 9 on inclusive access and qualified oversight.

Each pillar article in the Port Clinton Way section will:
- Define the pillar with specific citations
- Explain why it matters with research evidence
- Provide measurable indicators of success
- Include `[AD_INPUT_NEEDED]` block for the AD's perspective

---

## 4. Brand Voice & Tone Guide

### 4.1 Voice Document

Create `/content/_voice-guide.md` defining the PCAB content voice:

**Voice characteristics:**
- Knowledgeable but approachable — expert information for a general audience
- Encouraging, not preachy — inspire action without lecturing
- Evidence-based, not opinion-based — always cite sources
- Inclusive — all ability levels, all sports, all family situations
- Respectful of coach autonomy — present frameworks, never prescribe
- Community-oriented — "we" language, shared goals
- Practical — every article includes specific takeaways

**Terminology standards:**

| Preferred | Avoid |
|-----------|-------|
| development | winning |
| physical literacy | athleticism |
| athlete development | player development |
| youth athlete | kid |
| evidence suggests | you should |
| age-appropriate | for their level |

**Tone boundaries:**
- Research-cited specifics are OK (e.g., "NSCA recommends 2-3 sets of 8-15 reps")
- Never prescribe coaching tactics, plays, or drills
- Never position PCAB as telling coaches how to coach
- Content authority flows from established research, not from the booster club

### 4.2 Multi-Sport vs. Specialization

This is the most philosophically charged content area. The approach:
- Present evidence for multi-sport participation clearly and thoroughly
- Acknowledge legitimate reasons families choose specialization
- Avoid dogmatic positions — let research speak for itself
- Recognize the small-school practical reality (you need athletes in multiple sports)
- Frame as "here's what the evidence says" not "here's what you should do"

---

## 5. Content Alignment System

### 5.1 Philosophy Principles Document

Create `/content/_alignment-principles.md` defining what alignment means:

**Must-have signals** (articles must include):
- At least one citation to established research or framework
- Actionable takeaway for the stated audience
- Age-appropriate framing consistent with stated `ageGroup`
- Connection to at least one of the 5 Pillars

**Red-flag patterns** (articles must not include):
- Prescriptive coaching tactics (plays, drills, schemes)
- Win-at-all-costs framing
- Early specialization promotion (without balanced counterpoint)
- Training recommendations exceeding AAP guidelines for stated age group
- Unsupported claims (recommendations without citations)
- Language positioning PCAB as authority over coaches

**Terminology check list** (from the voice guide):
- Uses preferred terms
- Avoids discouraged terms
- Maintains consistent tone

### 5.2 Alignment Validation Process

Each article goes through a 4-step validation:

**Step 1 — Frontmatter validation (deterministic):**
- All required fields present
- Values match controlled vocabulary
- Cross-references resolve to existing articles

**Step 2 — Content alignment check (LLM-scored):**
- LLM-based scoring against the principles document
- Score each article on a 1-5 scale using calibrated rubric (see 5.4)
- Check for red-flag patterns
- Verify terminology alignment
- Confirm age-appropriateness of recommendations

**Step 3 — Cross-reference integrity (deterministic):**
- `relatedArticles` slugs resolve to existing articles (reciprocity not required — an advanced article may link to a foundational one without the reverse being necessary)
- `prerequisites` form a valid dependency graph (no cycles)
- Category coverage is balanced (no empty subcategories)
- Orphan report: flag articles that are not referenced by any other article

**Step 4 — Human spot-check:**
- Randomly select ~10% of articles (minimum 8) for human review
- Prioritize articles scoring 4 (borderline) and Health & Safety content
- Human reviewer confirms alignment score is appropriate
- Any article the human flags as misscored triggers re-evaluation of similar articles

**Target:** All published articles score 4+ on alignment. Articles scoring 3 or below are revised before publication. Status workflow: `draft` → alignment check → `review` → spot-check (if selected) → `published`.

### 5.3 Alignment Checker Implementation

The alignment checker is a prompt-based tool that:
1. Reads the philosophy principles document
2. Reads the article under review
3. Scores the article against each principle category using calibration anchors
4. Returns a structured report with:
   - Overall score (1-5)
   - Per-category scores
   - Specific issues found (with line references)
   - Suggested fixes for any issues

This can be implemented as a Claude prompt (no external tooling needed) until the pipeline tooling from split 01 is built. Frontmatter validation and terminology checks should use deterministic validation (schema check, word list matching) rather than LLM scoring.

### 5.4 Alignment Calibration Anchors

To ensure consistent scoring, the alignment checker uses anchored examples at three levels:

**Score 5 (Exemplary):** Article cites 3+ established sources, all recommendations are age-appropriate with specific citations, uses preferred terminology throughout, actionable takeaways for stated audience, connects to pillar with concrete examples.

**Score 3 (Needs Revision):** Article references frameworks generically without specific citations ("research shows..."), mixes appropriate and inappropriate terminology, recommendations are reasonable but not tied to specific guidelines, weak connection to pillars.

**Score 1 (Fails Alignment):** Article makes unsupported claims, uses prescriptive language ("you should always..."), recommends training loads without age-appropriate caveats, positions PCAB as coaching authority, or promotes early specialization without counterpoint.

Three full-length calibration articles (one at each level) will be written as part of the Port Clinton Way category to anchor the rubric before bulk content generation begins.

---

## 6. Article Body Template

Every article follows a consistent structure:

```
## Key Takeaways
- 3-5 bullet points summarizing actionable insights

## Introduction
Brief context setting (2-3 paragraphs)

## [Main Content Sections]
Organized logically for the topic (3-5 sections)

## Practical Application
What readers can do with this information

## [AD_INPUT_NEEDED]
Placeholder for Athletic Director's perspective

## References
Cited sources with links
```

### 6.1 AD Placeholder Format

```mdx
{/* [AD_INPUT_NEEDED]
   Type: philosophy-statement | program-example | endorsement
   Priority: critical | valuable | optional
   Context: Brief description of what this article covers
   Guidance: What kind of input is expected (2-3 paragraphs, a quote, an example)
*/}
```

These blocks are:
- Searchable with a simple grep for `[AD_INPUT_NEEDED]`
- Self-documenting (the `Type`, `Context`, `Priority`, and `Guidance` fields tell the AD what's needed)
- Valid MDX comments (won't render or break compilation)

### 6.2 AD Placeholder Tiering

Not all articles need AD input equally. Tier the placeholders to manage AD workload:

| Tier | Count | Articles | AD Action |
|------|-------|----------|-----------|
| **Critical** | 5-8 | Port Clinton Way pillar articles, program philosophy overview | AD must contribute before publication |
| **Valuable** | 15-20 | Articles directly referencing program philosophy, community building | AD input strengthens content; publish without if needed |
| **Optional** | 50-70 | Evidence-based guides, frameworks, safety content | Articles are complete without AD input; placeholder available if AD wants to add perspective |

**Pre-split-06 rendering:** Articles published before the AD completes split 06 render without the AD section (MDX comments are invisible). No visible gap or "coming soon" placeholder — the article stands on its own.

---

## 7. Content Generation Workflow

### 7.0 Execution Strategy for LLM-Generated Content at Scale

Generating 75-100+ articles (150,000-300,000 words) requires explicit logistics for session management, cross-referencing, and progress tracking.

**Progress Manifest:** A YAML file at `/content/_progress.yaml` tracks every article's status:
```yaml
# Example entry
- slug: physical-literacy-first
  title: "Physical Literacy First: The Foundation of Youth Athletic Development"
  category: port-clinton-way
  pillar: [physical-literacy]
  audience: [parent, coach, administrator]
  ageGroup: [6-8, 9-11, 12-14, 15-18]
  status: published  # draft | review | published
  alignmentScore: 5
  adPlaceholderTier: critical
  wordCount: 2450
```

This manifest is the cross-session state file. Each generation session reads it to understand what exists, what's in progress, and what cross-references are available.

**Condensed Article Index:** At the start of each generation session, the implementer loads a condensed index (slug + title + category + pillar + ageGroup) of all existing articles. This fits within context limits and enables accurate cross-referencing without loading full article text.

**Batch Sizing:** Generate 3-5 articles per session within a single category. This balances context usage (research + voice guide + alignment principles + article manifest + the articles themselves) against quality.

**Cross-Reference Strategy:**
- During generation: add `relatedArticles` for articles that already exist (check the manifest)
- After each category is complete: run a cross-reference pass to add links to newly created articles from earlier ones
- After all categories are complete: run a final cross-reference pass across the entire library

**Reference Verification:** References should cite well-known publications and organizations by name (e.g., "AAP Council on Sports Medicine and Fitness, 2016"). URLs are included where available and verified, but the primary citation is by author/organization and year. This avoids link rot and hallucinated URLs. A reference verification pass after generation checks that cited organizations and publications exist.

**Stopping Criteria:** The library is "done" when:
- Every subcategory in the controlled vocabulary has at least 2 articles
- All 5 Pillars are referenced across at least 4 categories
- All age groups and audiences have minimum coverage (at least 5 articles each)
- The curated resources page is compiled
- All articles pass alignment validation (score 4+)

### 7.1 Category-by-Category Iteration

Generate content in this order (each category informs the next):

1. **The Port Clinton Way** (first — establishes the philosophical foundation and 5 Pillars that all other content references)
2. **Development Frameworks** (second — establishes the evidence base that parent and coach content will cite)
3. **Health & Safety** (third — injury prevention, concussion protocols, and training limits inform both parent and coach content)
4. **Parent Guides** (fourth — can now reference the philosophy, frameworks, and safety content)
5. **Coach Resources** (fifth — builds on everything above, targeted at volunteer coaches)
6. **Community/Program Building** (sixth — program-level guidance informed by all individual-level content)
7. **Curated External Resources** (last — compiled from sources cited throughout all articles)

### 7.2 Per-Category Process

For each category:
1. Define the topic list (10-20 article titles with brief descriptions)
2. Identify inter-article dependencies (which articles should be written first)
3. Generate articles in dependency order
4. Run alignment check on each completed article
5. Update cross-references (`relatedArticles`) as new articles are added
6. Review category for completeness and coherence

### 7.3 Per-Article Process

For each article:
1. Research the topic using established frameworks and published guidelines. Cite by organization/author and year; include URLs where verifiable.
2. Draft the article following the body template
3. Complete all frontmatter fields (use controlled vocabulary, check manifest for available cross-references)
4. Write 3-5 actionable Key Takeaways
5. Add `[AD_INPUT_NEEDED]` block with appropriate type, priority tier, and guidance
6. Add cited sources to the `references` frontmatter array
7. Run alignment validation (deterministic frontmatter check + LLM content scoring)
8. Fix any issues flagged by the validator
9. Add cross-references to related existing articles (check progress manifest)
10. Set status to `review`
11. Update progress manifest with article metadata
12. After human spot-check (if selected) or batch review, set status to `published`

### 7.4 Article Length

Target: 2,000-3,000 words per article. This is long enough for depth and credibility, short enough to read in one sitting. The `estimatedReadTime` frontmatter field should be calculated at ~250 words/minute.

---

## 8. Curated External Resources

### 8.1 Resource Collection

As articles are written, track all external sources cited. After all categories are complete, compile the curated resources page.

### 8.2 Resource Categories

Organize resources by:
- **Organizations** (Positive Coaching Alliance, NFHS, Canadian Sport for Life, NSCA, AAP)
- **Research** (key peer-reviewed studies and clinical reports)
- **Tools** (practice planning templates, assessment guides)
- **Reading** (books and long-form articles for deeper learning)

### 8.3 Editorial Context

**Key resources** (5-10 major organizations/documents): Full editorial write-up (150-250 words) covering what it is, why it matters, alignment with PCAB pillars, and who should read it.

**Standard resources** (20-30 supplementary links): Brief annotation (2-3 sentences) covering what it is and why it's included.

### 8.4 Selection Criteria

- Published by established organizations
- Evidence-based, not opinion-based
- Aligned with development-first philosophy
- Freely accessible (note if paywalled)
- Current (updated within last 3 years)

---

## 9. Quality Assurance

### 9.1 Content Completeness Checks

After all categories are generated:
- Every category has at least the minimum target article count
- No subcategory is empty
- Every article has at least one `relatedArticles` cross-reference
- The 5 Pillars are referenced across all categories (not concentrated in Port Clinton Way)
- Age groups 6-8 through 16-18 are all represented
- All audiences (parent, coach, athlete, administrator) have content

### 9.2 Coherence Review

- Articles within a category don't contradict each other
- The multi-sport vs. specialization treatment is consistent across articles
- Training recommendations in different articles don't conflict
- The 5 Pillars are described consistently wherever referenced
- Voice and tone are uniform across the entire library

### 9.3 Technical Validation

- All frontmatter passes schema validation against controlled vocabulary
- All `relatedArticles` and `prerequisites` slugs resolve to existing articles
- All `references` cite identifiable organizations/publications (URL verification where possible)
- MDX syntax is valid (no unclosed tags, valid comment blocks) — full compilation testing deferred to split 03 when the rendering platform is configured
- Controlled vocabulary is consistent (no unauthorized tags)
- Progress manifest is complete and matches the actual file inventory

---

## 10. Deliverables Summary

| Deliverable | Location | Description |
|-------------|----------|-------------|
| Content articles (75-100+) | `/content/{category}/*.mdx` | Publication-ready MDX files with full frontmatter |
| Progress manifest | `/content/_progress.yaml` | Article inventory with status, scores, and metadata |
| Controlled vocabulary | `/content/_vocabulary.yaml` | Valid values for all enumerated frontmatter fields |
| Voice guide | `/content/_voice-guide.md` | Brand voice, tone, and terminology standards |
| Alignment principles | `/content/_alignment-principles.md` | Philosophy principles for content validation |
| Calibration articles (3) | `/content/port-clinton-way/` | Score-anchored examples at levels 1, 3, and 5 |
| 5 Pillars definition | Within Port Clinton Way articles | Research-derived foundational principles |
| Curated resources | `/content/resources/curated-external-resources.mdx` | Vetted links with editorial context |
| Alignment checker | Prompt-based tool | Validates articles against principles document |

---

## 11. Risk Considerations

| Risk | Mitigation |
|------|------------|
| Content drifts from philosophy as library grows | Alignment checker runs on every article; voice guide enforced; calibration anchors prevent score drift |
| Frontmatter schema evolves after articles are written | Controlled vocabulary file is the single source of truth; schema migration script can update existing files |
| Platform decision (split 03) requires MDX changes | Framework-agnostic frontmatter; no platform-specific features in MDX; compatible with existing Next.js 16 app |
| AD (split 06) disagrees with 5 Pillars framing | Pillars are derived from universally accepted research; AD blocks are clearly marked for customization; tiered placeholder system limits blast radius of revisions |
| AD (split 06) rejects the 5 Pillars construct entirely | Pillars synthesize four established frameworks (LTAD, PCA, NSCA, AAP) — any AD would recognize these principles. If rejected, the pillar *names* change but the underlying research-backed principles remain valid. Content revision would be cosmetic, not structural. |
| Article quality inconsistent across categories | Same template, same alignment checker, same voice guide for every article; human spot-check on 10% |
| Cross-references become stale as articles are added/removed | Integrity check validates all `relatedArticles` and `prerequisites` resolve; orphan report flags unlinked articles |
| LLM hallucination in citations | References cite by organization/author and year, not just URLs. Verification pass checks that cited organizations and publications exist. URLs verified where included. |
| Content homogeneity across 75+ LLM-generated articles | Voice guide provides variety guidance; articles vary by audience, content type, and age group; calibration articles model tonal range |
| Scope creep on article count | Explicit stopping criteria defined (Section 7.0): coverage across subcategories, pillars, age groups, and audiences. Library is "done" when criteria are met, not when a number is reached. |
| Medical/safety content liability | Health & Safety articles include standard disclaimer: "This content is for educational purposes and does not constitute medical advice. Consult qualified medical professionals for specific health concerns." Concussion protocol content defers to NFHS and state-mandated protocols rather than creating original medical guidance. |
| Content freshness over time | Deferred to ongoing operations. `reviewDate` frontmatter field enables future automated staleness detection. Content is designed to be evergreen (citing established frameworks, not current events). |
