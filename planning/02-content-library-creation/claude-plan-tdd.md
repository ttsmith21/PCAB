# TDD Plan: PCAB Content Library Creation

This companion document defines what tests to write BEFORE implementing each part of the content library plan. The project uses **Vitest** with `@testing-library/react`.

Since this is primarily a content library (MDX files + supporting configuration), testing focuses on validation tooling, schema enforcement, and content quality gates — not UI rendering (that's split 03).

---

## 2. Content Architecture

### 2.1 Directory Structure

```
# Test: /content directory exists with all required category subdirectories
# Test: no MDX files exist outside of recognized category directories
# Test: category directory names match controlled vocabulary categories
```

### 2.2 Frontmatter Schema

```typescript
// Test: valid frontmatter passes schema validation (all required fields present)
// Test: missing required field (e.g., no `title`) fails validation with descriptive error
// Test: invalid `category` value (not in controlled vocabulary) fails validation
// Test: invalid `ageGroup` value fails validation (e.g., "10-12" is not valid, "12-14" is)
// Test: `ageGroup` accepts valid values: 6-8, 9-11, 12-14, 15-18
// Test: `ltadStage` accepts valid values: active-start, fundamentals, learn-to-train, train-to-train, train-to-compete
// Test: `pillar` array values match slug mapping (physical-literacy, development-over-results, etc.)
// Test: `audience` array only accepts: parent, coach, athlete, administrator
// Test: `contentType` only accepts: guide, framework, checklist, case-study, research-summary, faq
// Test: `status` only accepts: draft, review, published, archived
// Test: `description` within 150-160 character range produces warning if outside bounds
// Test: `slug` is URL-safe (lowercase, hyphens only, no special characters)
// Test: `date` and `lastUpdated` are valid ISO 8601 dates
// Test: optional fields (excerpt, featuredImage, difficulty, etc.) pass when present with valid values
// Test: optional fields are truly optional — frontmatter validates without them
// Test: `references` array items have required shape: {title, url, accessed}
// Test: `series` object has required shape: {name, order} when present
// Test: `estimatedReadTime` is a positive integer when present
```

### 2.3 Controlled Vocabulary

```typescript
// Test: vocabulary file loads and parses as valid YAML
// Test: every `category` value used in any MDX frontmatter exists in vocabulary
// Test: every `subcategory` value maps to a valid parent `category` in vocabulary
// Test: every `tag` used in any MDX frontmatter exists in the approved tags list
// Test: pillar display names map correctly to slugs (e.g., "Physical Literacy First" → "physical-literacy")
// Test: vocabulary file contains entries for all enumerated field types
```

---

## 3. The 5 Pillars of Program Success

```
# Test: exactly 5 pillar articles exist in /content/port-clinton-way/
# Test: each pillar article's `pillar` frontmatter includes its own pillar slug
# Test: all 5 pillar slugs are referenced across at least 4 different content categories
# Test: pillar articles contain at least one citation to each of the 4 source frameworks (LTAD, PCA, NSCA, AAP)
```

---

## 4. Brand Voice & Tone Guide

```
# Test: voice guide file exists at /content/_voice-guide.md
# Test: voice guide contains terminology standards section
# Test: voice guide contains tone boundaries section
```

---

## 5. Content Alignment System

### 5.1 Philosophy Principles Document

```
# Test: alignment principles file exists at /content/_alignment-principles.md
# Test: alignment principles contains must-have signals section
# Test: alignment principles contains red-flag patterns section
# Test: alignment principles contains terminology check list section
```

### 5.2-5.4 Alignment Validation

```typescript
// Test: frontmatter validator catches missing required fields and returns specific field name
// Test: frontmatter validator catches vocabulary violations and returns the invalid value
// Test: cross-reference validator detects broken slugs in `relatedArticles`
// Test: cross-reference validator detects cycles in `prerequisites` graph
// Test: cross-reference validator does NOT require reciprocal relatedArticles
// Test: orphan report correctly identifies articles referenced by no other article
// Test: alignment scorer returns structured report with overall score and per-category scores
// Test: calibration article at score 5 receives score >= 4
// Test: calibration article at score 1 receives score <= 2
// Test: alignment scorer flags red-flag patterns (prescriptive coaching language, unsupported claims)
// Test: alignment scorer verifies terminology alignment against voice guide
// Test: articles with status "published" all have alignment score >= 4
```

---

## 6. Article Body Template

```
# Test: every published article contains a "Key Takeaways" section
# Test: Key Takeaways section has 3-5 bullet points
# Test: every published article contains an "Introduction" section
# Test: every published article contains a "Practical Application" section
# Test: every published article contains a "References" section
# Test: articles with AD placeholder tier "critical" contain an [AD_INPUT_NEEDED] block
# Test: AD placeholder blocks have valid Type (philosophy-statement | program-example | endorsement)
# Test: AD placeholder blocks have valid Priority (critical | valuable | optional)
```

### 6.2 AD Placeholder Tiering

```
# Test: Port Clinton Way pillar articles have AD placeholder tier "critical"
# Test: critical-tier AD placeholder count is 5-8
# Test: valuable-tier AD placeholder count is 15-20
# Test: optional-tier articles render correctly without AD content (no visible gap)
```

---

## 7. Content Generation Workflow

### 7.0 Execution Strategy

```typescript
// Test: progress manifest file exists at /content/_progress.yaml
// Test: progress manifest parses as valid YAML
// Test: every MDX file in /content has a corresponding entry in progress manifest
// Test: every entry in progress manifest has a corresponding MDX file
// Test: progress manifest entry has required fields: slug, title, category, status
// Test: condensed article index can be generated from manifest (slug + title + category + pillar + ageGroup)
// Test: condensed index fits within a reasonable size limit (< 50KB for context window management)
```

### 7.1-7.4 Generation and Length

```
# Test: every category directory has at least 2 articles (stopping criteria)
# Test: article word count is between 1,500 and 4,000 words (with tolerance around 2,000-3,000 target)
# Test: estimatedReadTime matches word count at ~250 words/minute (within 1 minute tolerance)
# Test: articles generated later in the order reference articles from earlier categories where relevant
```

---

## 8. Curated External Resources

```
# Test: curated resources file exists at /content/resources/curated-external-resources.mdx
# Test: key resources (5-10) have editorial write-ups of 150-250 words
# Test: standard resources (20-30) have annotations of 2-3 sentences
# Test: all resource URLs are valid (HTTP 200 or 301 response) — may be slow, run separately
# Test: resources are organized by category (Organizations, Research, Tools, Reading)
# Test: resources meet selection criteria (established organizations, freely accessible noted)
```

---

## 9. Quality Assurance

### 9.1 Content Completeness

```
# Test: every subcategory in controlled vocabulary has at least 1 article
# Test: every audience type (parent, coach, athlete, administrator) has at least 5 articles
# Test: every age group (6-8, 9-11, 12-14, 15-18) has at least 5 articles
# Test: every published article has at least one relatedArticles cross-reference
# Test: all 5 Pillars are referenced across at least 4 categories
# Test: total article count meets minimum target (75+)
```

### 9.2 Coherence

```
# Test: multi-sport vs specialization messaging is consistent — no article promotes early specialization without counterpoint
# Test: training load recommendations never exceed AAP guidelines for the stated age group
# Test: 5 Pillars descriptions are consistent across articles (same names, same core definitions)
# Test: no article uses terminology from the "Avoid" column in the voice guide
```

### 9.3 Technical Validation

```typescript
// Test: all frontmatter passes schema validation (batch test across all files)
// Test: all relatedArticles slugs resolve to existing files
// Test: all prerequisites slugs resolve to existing files
// Test: prerequisites graph has no cycles
// Test: no unauthorized tags exist (all tags in controlled vocabulary)
// Test: MDX syntax is valid (no unclosed tags, valid comment blocks)
// Test: progress manifest matches actual file inventory (no drift)
```

---

## 10. Deliverables Verification

```
# Test: all deliverables from Section 10 table exist at their specified locations
# Test: calibration articles (3) exist in /content/port-clinton-way/
# Test: alignment checker prompt/tool produces structured output matching expected schema
```

---

## 11. Health & Safety Disclaimer

```
# Test: all articles in /content/health-safety/ contain the standard medical disclaimer
# Test: concussion protocol content references NFHS or state-mandated protocols, not original medical guidance
# Test: training recommendation articles include age-appropriate caveats
```
