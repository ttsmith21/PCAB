# Integration Notes: Opus Review Feedback

## Suggestions INTEGRATED

### 1. Acknowledge the Existing Next.js Codebase (Review #1)
**Integrating.** The reviewer is right — the project is already a Next.js 16 app. The plan should acknowledge this and clarify that "framework-agnostic" means no JSX imports in article bodies, standard YAML frontmatter, and that `/content` lives at the project root. The platform rendering decision (split 03) may still add Astro or stay with Next.js, but the content should be designed for compatibility with the existing repo structure.

### 2. Add Execution Strategy for LLM Content at Scale (Review #2)
**Integrating.** This is a critical gap. Adding a section on: progress tracking manifest, condensed article manifest for cross-session context, batch sizing guidance, deferred cross-reference final pass, and reference verification approach.

### 3. Reconcile Age Group Ranges (Review #3)
**Integrating.** Switching to clean, non-overlapping ranges aligned with the research document's own recommendation: `6-8, 9-11, 12-14, 15-18`. Adding a mapping table between ageGroup and ltadStage values.

### 4. Strengthen the Alignment Checker (Review #4)
**Partially integrating.** Adding calibration examples and a human spot-check protocol. However, keeping LLM-based scoring as the primary mechanism — the alternative (fully manual review of 75+ articles) is not practical for this project. The self-grading concern is valid but mitigated by structured rubrics with concrete anchoring examples.

### 5. Tier the AD Placeholder System (Review #5)
**Integrating.** Adding a 3-tier system (critical/valuable/optional) with clear guidance on article behavior when AD input is missing. This reduces AD burden and clarifies rendering behavior.

### 6. Drop Strict Reciprocity for relatedArticles (Review #7)
**Integrating.** Changing to: all slugs must resolve (no broken refs), but reciprocity is not required. Adding an orphan article report instead.

### 7. Add Missing Risks to Risk Table (Review #12)
**Integrating.** Adding: citation hallucination risk + verification step, content homogeneity mitigation, scope stopping criteria, medical disclaimer strategy, AD rejection contingency.

### 8. Add featuredImage Frontmatter Field (Review #9)
**Integrating.** Adding as optional field to future-proof the schema. Images themselves are out of scope for this split.

### 9. Add excerpt Field (Review #11)
**Integrating.** Adding optional `excerpt` field separate from `description` for longer summaries used in cards/RSS.

### 10. Pillar Name-to-Slug Mapping (Review #11)
**Integrating.** Adding explicit mapping in the vocabulary specification.

### 11. Fix review Status Workflow (Review #11)
**Integrating.** Incorporating `review` status between alignment check and `published` for the human spot-check step.

## Suggestions NOT Integrated

### Content Freshness Strategy (Review #6)
**Not integrating.** This is explicitly deferred to ongoing operations. The plan already notes content should be evergreen. Adding a detailed freshness monitoring system is premature — the content doesn't exist yet. Will add a one-line note that freshness monitoring is deferred.

### Existing Site Integration Details (Review #8)
**Not integrating in detail.** Navigation, content discovery, and rendering are split 03's responsibility. Adding a brief acknowledgment but not designing the integration — that would cross split boundaries.

### Controlled Vocabulary Governance (Review #10)
**Not integrating as a formal process.** For the initial content generation, vocabulary expansion is part of the generation workflow — the content creator (Claude) adds terms as needed and the vocabulary file is the tracking mechanism. Formal governance matters for multi-contributor scenarios that don't apply yet.

### MDX Compilation Testing (Review #11)
**Not integrating.** The reviewer is correct that no MDX compiler is configured. Removing the "all MDX files compile" validation claim. Replacing with: all files pass frontmatter schema validation and standard MDX syntax linting (checking for unclosed tags, valid comment blocks). Full compilation testing happens in split 03.

### Generation Order Discrepancy Note (Review #11)
**Not integrating.** The plan's ordering (philosophy first) is correct and was a deliberate decision in the interview. The spec's different ordering was from an earlier stage. No need to call out the discrepancy.
