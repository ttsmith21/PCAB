# Interview Transcript: Content Generation Pipeline

**Date:** 2026-02-25
**Spec:** planning/01-content-generation-pipeline/spec.md
**Research:** planning/01-content-generation-pipeline/claude-research.md

---

## Q1: AI Provider Strategy

**Question:** Research found the best approach might be hybrid (Gemini Deep Research for source gathering + Claude for writing). Which approach — hybrid from day one, Claude only with Gemini later, or flexible provider system?

**Answer:** **Hybrid from day one.** Build the pipeline to use Gemini for research + Claude for writing from the start.

**Implication:** Pipeline needs both `@anthropic-ai/sdk` and `@google/genai`. Two-phase generation: Gemini Deep Research → Claude article writing. More complex architecture but best quality output.

---

## Q2: MDX Tooling

**Question:** Research recommends Velite (Zod schema validation, type-safe TypeScript, Next.js integration). Contentlayer is deprecated. Use Velite, simpler approach, or let deep-plan decide?

**Answer:** **Velite sounds great.** Use Velite with Zod schemas for type-safe, build-time validated MDX content.

**Implication:** `velite.config.ts` defines the content schema with Zod. Build-time validation catches malformed generated content. Type-safe TypeScript output for consumption by the knowledge base platform.

---

## Q3: Alignment Validation Rubric

**Question:** Research recommends 5 dimensions scored 1-4 (Factual Accuracy, Values Alignment, Audience Appropriateness, Actionability, Writing Quality) with 3.0/4.0 pass threshold. Good, add philosophy alignment, or simplify?

**Answer:** **Rubric looks good.** The 5 dimensions and 3.0 threshold are a solid starting point. Can tune later.

**Implication:** Implement the full 5-dimension rubric from the start. Use a different model for judging than generating (e.g., generate with Sonnet, judge with Opus or vice versa).

---

## Q4: Human Review Workflow

**Question:** When pipeline generates an article that passes alignment checks, what does the review gate look like?

**Answer:** **Git PR workflow.** Each article is a PR. Review in GitHub, approve to merge into content directory.

**Implication:** Pipeline outputs articles to a branch, creates PRs. Reviewer approves in GitHub. This means the pipeline needs git operations — create branch, commit, push, create PR (via `gh` CLI or GitHub API). Each article (or batch) gets its own PR.

---

## Q5: Topic Management

**Question:** Should the pipeline include full topic management (definition, coverage tracking, gap analysis), simple topic list only, or topic list + tracking?

**Answer:** **Full topic management.** Build topic list definition, coverage tracking, and gap analysis tooling into the pipeline.

**Implication:** Significant feature scope: topic list definition format (YAML/JSON), content matrix tracking domain × audience × difficulty, gap analysis suggesting which articles to generate next, coverage reporting.

---

## Q6: Cost vs Quality Trade-off

**Question:** Full multi-step flow (4-5 API calls per article, 300-500 total) or optimize for fewer calls?

**Answer:** **Quality over cost.** Use the full multi-step flow. Budget is not the constraint — quality is. The Boosters have the funds.

**Implication:** Implement the full pipeline: (1) Gemini Deep Research, (2) Claude outline generation, (3) Claude article writing from outline + research, (4) Claude validation via rubric, (5) regeneration if failing. Cost per article estimated at $1-3 depending on models used. Total for 100 articles: $100-300.

---

## Q7: Error Handling

**Question:** What happens when API calls fail mid-batch?

**Answer:** **Robust retry + resume.** Build retry logic with exponential backoff, save progress so batch runs can resume from where they stopped, log all failures for review.

**Implication:** Pipeline needs persistent state — track which articles in a batch have been completed, which failed, which are pending. Resume capability. Exponential backoff for rate limits. Failure logs.

---

## Q8: Run Modes

**Question:** Single article mode + batch mode, batch only, or single + batch + dry-run?

**Answer:** **Both modes.** Single article mode (for testing, iterating on prompts) AND batch mode (for bulk generation). Essential for development.

**Implication:** Two run modes via npm scripts: `npm run generate:article -- --topic "topic-slug"` and `npm run generate:batch -- --category coaching`. Single mode is critical for prompt iteration during development.

---

## Q9: Prompt Management

**Question:** Store prompts as versioned template files or embedded in TypeScript code?

**Answer:** **Versioned template files.** Prompts as separate .md files in the repo. Easy to iterate on without changing code. Version controlled.

**Implication:** Create a `/scripts/prompts/` directory with template files: `system-prompt.md`, `article-generation.md`, `outline-generation.md`, `alignment-check.md`, etc. Pipeline reads these at runtime. Supports rapid prompt iteration.

---

## Q10: Configuration & CI/CD

**Question:** Where should API keys be configured? Local only, local + CI/CD, or local for now with CI later?

**Answer:** **Local for now, CI later.** Start with local .env only. Design the pipeline so CI can be added later without major refactoring.

**Implication:** Use `.env` for API keys (ANTHROPIC_API_KEY, GEMINI_API_KEY). Design with CI in mind (no hardcoded paths, config via environment variables) but don't build CI integration now.

---

## Summary of Key Decisions

| Decision | Choice | Impact |
|----------|--------|--------|
| AI providers | Hybrid: Gemini research + Claude writing | Both SDKs, two-phase generation |
| MDX tooling | Velite with Zod schemas | Build-time validation, type safety |
| Validation rubric | 5 dimensions, 3.0/4.0 threshold | Full rubric from day one |
| Review workflow | Git PR per article/batch | Pipeline needs git/GitHub operations |
| Topic management | Full: definition + tracking + gap analysis | Significant feature scope |
| Quality vs cost | Quality over cost, full multi-step flow | 4-5 API calls per article |
| Error handling | Robust retry + resume | Persistent state, backoff, logging |
| Run modes | Single article + batch | Two npm scripts |
| Prompt storage | Versioned template files | `/scripts/prompts/` directory |
| Config/CI | Local .env now, CI-ready design | Environment variables, no hardcoded paths |
