# Opus Review

**Model:** claude-opus-4
**Generated:** 2026-02-26T00:00:00Z

---

## Plan Review: PCAB Content Library Creation

**File reviewed:** `C:\GitHub\PCAB\.claude\worktrees\content-library-deep-plan\planning\02-content-library-creation\claude-plan.md`

---

### 1. Major Architectural Concern: "Framework-Agnostic" Is Contradicted by the Existing Codebase

The plan repeatedly emphasizes that MDX files must be "framework-agnostic" because "the platform (split 03) isn't decided yet" (Section 1, Key Constraints). However, the project is already a **Next.js 16 application** using React 19, Tailwind CSS 4, and static export (`output: "export"` in `next.config.ts`). The `package.json` confirms this is `pc-boosters-web` running Next.js 16.1.6.

This creates a real tension. The plan treats the platform as unknowable, but the existing site is already deployed on Next.js. If the "split 03" decision is genuinely open, that is fine, but the plan should acknowledge the existing codebase and address what happens when the platform is decided. Specifically:

- Will the `/content` directory live inside or outside the Next.js app directory?
- If Next.js is chosen, the MDX files will need `@next/mdx` or `next-mdx-remote` or Velite integration. The frontmatter schema should be tested for compatibility with these tools now, not later.
- If Astro is chosen, the entire existing site needs to be ported or the content library becomes a separate deployment. The plan does not mention this tradeoff.

**Recommendation:** Add a section acknowledging the existing Next.js codebase and specifying whether `/content` is co-located in the repo or a separate repo. State explicitly what "framework-agnostic" means in practice -- YAML frontmatter with no JSX imports in the body, presumably.

---

### 2. The Plan Has No Execution Strategy for LLM-Generated Content at Scale

The plan says "75-100+ expert-quality articles" at "2,000-3,000 words each" (Sections 1 and 7.4). That is 150,000-300,000 words of content. The plan describes the *what* (templates, frontmatter, validation) but not the *how* of actually generating this volume. Key missing details:

- **Context window limits:** A single Claude conversation cannot hold 75+ articles in context simultaneously. How will cross-referencing work in practice? Will a manifest of existing articles be maintained and fed into each new generation prompt?
- **Research quality:** Section 7.3 says "Research the topic (web sources, established frameworks, published guidelines)." How? Does the implementer have web search access? Are references expected to be real, verified URLs, or can they cite well-known publications by name without linking?
- **Session continuity:** Generating 75+ articles will span many sessions. How is state preserved between sessions? The plan mentions no tracking file (e.g., a progress manifest showing which articles are complete, in progress, or pending).
- **Batch size:** The per-category process (Section 7.2) says "Generate articles in dependency order" but does not say how many articles per session, or how to handle the reality that later articles need awareness of earlier ones.

**Recommendation:** Add a section on practical generation logistics -- a progress tracking file, a condensed article manifest (slug + title + description + pillar + category) that can be fed into each session, and explicit guidance on how to handle cross-references before all articles exist (e.g., leave `relatedArticles` partially populated and do a final cross-reference pass).

---

### 3. Age Group Ranges Have Gaps and Overlaps That Will Confuse Filtering

Section 2.2 defines `ageGroup` values as: `6-8, 9-11, 10-12, 13-15, 16-18`.

The overlaps are acknowledged ("development doesn't follow clean age cutoffs") but the specific choices create problems:

- Ages 10 and 11 appear in both `9-11` and `10-12`. What is the semantic difference between these two ranges?
- There is no range covering ages under 6 (Active Start stage covers 0-6). The `ltadStage` includes `active-start` but there is no corresponding `ageGroup` value.
- The LTAD stage-to-age mapping in the research document uses different ranges than the spec. The plan's age groups do not align with either the LTAD ranges or the research document's own taxonomy recommendations (`6-8, 9-11, 12-14, 15-18` from Section 3.3).

**Recommendation:** Reconcile the age groups. Either align with the LTAD stages, the research document's own recommendation, or provide a clear mapping table showing which `ageGroup` values correspond to which `ltadStage` values, with rationale for the overlaps.

---

### 4. The Alignment Checker Is Underspecified and Risks Being Theater

Section 5.2-5.3 describes an LLM-based alignment checker that scores articles 1-5. This is the single gate between "generated" and "published." Several concerns:

- **Self-grading:** If Claude generates the article and Claude also checks the article, you are having the same model grade its own homework.
- **Scoring reliability:** LLM-based 1-5 scoring is notoriously inconsistent. The same article checked twice may receive different scores.
- **No rubric examples:** The plan defines categories (must-have signals, red-flag patterns) but provides no scored example articles at each level.
- **No human review:** The entire pipeline is automated with no human-in-the-loop step, despite the research document explicitly recommending one.

**Recommendation:** Add calibration articles -- write 3-5 short example passages at score levels 1, 3, and 5 to anchor the rubric. Add a spot-check protocol (e.g., human reviews a random 10% of articles). Consider using a different model or a structured deterministic check for frontmatter validation and terminology, reserving LLM scoring only for tone and philosophy alignment.

---

### 5. The AD Placeholder System Bakes In Technical Debt

Section 6.1 defines AD placeholder blocks as MDX comments. Concerns:

- **Volume:** If every article gets an AD placeholder, that is 75-100+ blocks the AD must fill. This is a massive demand on a single person.
- **Discoverability:** MDX comments are invisible when rendered. If content is published before split 06, readers see no indication a section is missing.
- **Format ambiguity:** Is the AD expected to write MDX?

**Recommendation:** Add a tiering system for AD placeholders -- "critical" (Port Clinton Way pillar articles -- maybe 5-8), "valuable" (articles that directly reference program philosophy -- maybe 15-20), and "optional" (the remaining 50-70). Define what happens to articles published before split 06.

---

### 6. No Content Freshness or Staleness Strategy

The plan mentions `reviewDate` in the frontmatter and says content should be "evergreen" with an "annual review cycle." But there is no process for:

- Who triggers a review when `reviewDate` passes?
- What happens if a cited reference is updated or retracted?
- How are the `references` URLs validated over time?
- The `version` field exists but no versioning protocol is defined.

**Recommendation:** Explicitly note this as deferred and describe the minimum viable approach (e.g., a script that checks `reviewDate` against the current date and flags stale articles).

---

### 7. The `relatedArticles` Reciprocity Requirement Is Fragile

Section 5.2, Step 3 says `relatedArticles` slugs must "exist and be reciprocal." At scale:

- **Expensive to maintain:** Every cross-reference addition requires editing two files.
- **Potentially misleading:** Reciprocity is not always logical. An advanced article might link to a foundational one, but not vice versa.

**Recommendation:** Drop strict reciprocity. Validate that slugs resolve (no broken references) and run a report showing orphan articles for manual review.

---

### 8. Missing: How the Content Library Integrates with the Existing Site

The existing site already has a Resources page. The plan places curated resources at `/content/resources/curated-external-resources.mdx`. There is no discussion of:

- How the existing Resources page relates to the new content library.
- Whether the knowledge base content will be served from the same Next.js app or separately.
- Navigation and content discovery.
- Static export compatibility with MDX rendering.

**Recommendation:** Add a brief integration section acknowledging the existing site structure and noting that navigation/rendering are split 03's responsibility, but that the content directory structure should be compatible with the existing project layout.

---

### 9. No Mention of Image or Media Assets

75-100 articles at 2,000-3,000 words with no images will be walls of text. Youth sports content benefits from visual aids (LTAD stage diagrams, growth charts, practice templates).

**Recommendation:** Acknowledge that visual assets are deferred or out of scope, and add `featuredImage` or `heroImage` as an optional frontmatter field so the schema doesn't need to change later.

---

### 10. Controlled Vocabulary File Has No Governance Process

Section 2.3 says "New tags require explicit addition to the vocabulary" but does not define who approves additions or the process.

**Recommendation:** Add a simple rule: the content creator proposes new vocabulary in a comment at the top of `_vocabulary.yaml`, and the vocabulary is expanded before the article is finalized.

---

### 11. Smaller Issues

- **`description` length:** 150-160 chars is good for meta descriptions, but consider a separate `excerpt` field for RSS/cards.
- **Pillar naming:** No mapping between display names ("Physical Literacy First") and frontmatter slugs (`physical-literacy`). Should be in `_vocabulary.yaml`.
- **Generation order discrepancy:** Plan says Port Clinton Way first; spec lists Parent Guides first. Plan's ordering is better but discrepancy should be noted.
- **Unused `review` status:** Articles go directly to `published` after validation. The `review` status is never used in the workflow.
- **MDX compilation testing:** "All MDX files compile without errors" -- with what compiler? No MDX tooling is configured in the project.

---

### 12. Risk Table Gaps

| Missing Risk | Why It Matters |
|---|---|
| LLM hallucination in citations | Claude may generate plausible-sounding but non-existent references. No verification step for reference URLs. |
| Content homogeneity | 75+ articles generated by the same model may all sound the same. |
| Scope creep on article count | "75-100+" is open-ended with no stopping criteria. |
| Legal liability for medical/safety content | Concussion protocols and return-to-play content carries liability implications. No disclaimer strategy. |
| Split 06 AD rejection | The AD may reject the entire 5 Pillars construct, requiring wholesale revision. |

---

### Summary

The plan is well-structured and thoughtful about content architecture, taxonomy, and philosophy alignment. Its strengths are the controlled vocabulary approach, the iterative category-by-category generation order, and the clear separation of concerns between splits. The main weaknesses are:

1. **It is a content architecture plan, not an execution plan.** The how-to-actually-generate-75-articles-with-an-LLM problem is hand-waved.
2. **The alignment checker is the only quality gate and it is an LLM grading its own output.** Needs calibration and human spot-checks.
3. **The "framework-agnostic" stance ignores the reality that the project is already a Next.js app.**
4. **Age group values are internally inconsistent** with both the LTAD framework and the plan's own research document.
5. **Medical/safety content has no disclaimer or liability strategy.**
