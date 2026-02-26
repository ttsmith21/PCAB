<!-- PROJECT_CONFIG
runtime: typescript-npm
test_command: npm test
END_PROJECT_CONFIG -->

<!-- SECTION_MANIFEST
section-01-setup
section-02-prompts
section-03-topics
section-04-gemini
section-05-claude
section-06-validation
section-07-orchestration
section-08-output
section-09-polish
END_MANIFEST -->

# Implementation Sections Index

## Dependency Graph

| Section | Depends On | Blocks | Parallelizable |
|---------|------------|--------|----------------|
| section-01-setup | - | all | Yes |
| section-02-prompts | 01 | 04, 05, 06 | Yes |
| section-03-topics | 01 | 07 | Yes |
| section-04-gemini | 01, 02 | 07 | Yes |
| section-05-claude | 01, 02 | 06, 07 | Yes |
| section-06-validation | 01, 02, 05 | 07 | No |
| section-07-orchestration | 03, 04, 05, 06 | 08 | No |
| section-08-output | 01, 07 | 09 | No |
| section-09-polish | all | - | No |

## Execution Order

1. **Batch 1**: section-01-setup (no dependencies)
2. **Batch 2**: section-02-prompts, section-03-topics (parallel after 01)
3. **Batch 3**: section-04-gemini, section-05-claude (parallel after 01+02)
4. **Batch 4**: section-06-validation (after 05)
5. **Batch 5**: section-07-orchestration (after 03+04+05+06)
6. **Batch 6**: section-08-output (after 07)
7. **Batch 7**: section-09-polish (after all)

## Section Summaries

### section-01-setup
**Plan sections:** 2 (Project Setup & Configuration), 3 (Shared Schema & Types)

Project foundation: install dependencies (production + dev), create directory structure (`lib/`, `scripts/content-pipeline/`, `data/topics/`, `content/articles/`, `scripts/prompts/`), create shared Zod schema (`lib/content-schema.ts`), define all TypeScript types (`types.ts`), pipeline config file with env var overrides, npm scripts in package.json, `.env.example`, `.gitignore` additions.

**Tests:** Schema validation tests, type shape tests.

### section-02-prompts
**Plan sections:** 9 (Prompt Templates)

Prompt loader with bidirectional `{{variable}}` validation (missing AND extra variable detection), all 5 markdown prompt template files (system-prompt, research-prompt, outline-generation, article-generation, alignment-check), snapshot tests for interpolated prompts.

**Tests:** Prompt loader unit tests, prompt snapshot tests.

### section-03-topics
**Plan sections:** 7 (Topic Management including Content Matrix)

Topic definition YAML schema, topic loader reading from `data/topics/` with `js-yaml`, slug validation (`/^[a-z0-9-]+$/`), filtering by category/audience/difficulty, sample topic YAML files for each category. Content matrix: coverage tracking across category x audience x difficulty, gap analysis, `suggestNext()`, `generateReport()`, difficulty distribution analysis (40/40/20).

**Tests:** Topic loader tests, content matrix tests.

### section-04-gemini
**Plan sections:** 4 (Gemini Deep Research Integration)

Gemini client wrapper using `@google/genai` SDK, Interactions API integration with configured research agent model, background mode polling, timeout handling (5 min max), fallback to standard Gemini generation when Interactions API unavailable. Research service: loads research prompt template, interpolates topic variables including `outline_notes`, orchestrates research flow, retry-once-then-null strategy.

**Tests:** Gemini client tests (mocked SDK), research service tests.

### section-05-claude
**Plan sections:** 5 (Claude Article Writing)

Claude client wrapper using `@anthropic-ai/sdk`, adaptive thinking, streaming, token/rate limit handling, `stop_reason === "max_tokens"` truncation detection. Outline service: loads outline template, interpolates topic metadata + `outline_notes` + research, parses structured outline. Article service: loads system + article templates, generates full MDX with frontmatter, validates frontmatter against shared Zod schema.

**Tests:** Claude client tests (mocked SDK), outline service tests, article service tests.

### section-06-validation
**Plan sections:** 6 (Alignment Validation)

Rubric definition as TypeScript constant (5 dimensions with weights summing to 1.0, scoring 1-4), scoring logic (weighted sum, pass >= 3.0, auto-fail on any dimension scoring 1). Validator: loads alignment-check prompt, interpolates article + rubric + PC Way principles, calls Claude (default `claude-sonnet-4-6`), parses JSON response into RubricScores, generates feedback for failed validations, regeneration prompt construction.

**Tests:** Rubric scoring tests, validator tests.

### section-07-orchestration
**Plan sections:** 8 (Pipeline Orchestration)

CLI entry point with `commander`: 4 modes (single, batch, status, matrix) + global flags (`--dry-run`, `--publish`, `--overwrite`, `--resume`, `--concurrency`). Core `generateArticle()` pipeline function: research -> outline -> write -> schema check -> validate -> retry loop. Batch state persistence (JSON in `.content-pipeline-state/`), resume capability, sequential execution (default concurrency 1).

**Tests:** CLI argument parsing tests, pipeline integration tests (mocked APIs), batch state tests.

### section-08-output
**Plan sections:** 10 (Output & Publishing)

MDX writer: determines output path (`content/articles/{category}/{slug}.mdx`), creates directories, writes files, uses `path.join()` for Windows compatibility, overwrite protection. Git publisher: `child_process.execFile` (not `exec`), argument arrays (no string interpolation), branch naming, commit messages with scores, PR creation via `gh`, slug validation, path normalization.

**Tests:** MDX writer tests, git publisher tests (mocked git/gh).

### section-09-polish
**Plan sections:** 11 (Error Handling & Resilience), final touches

Retry utility with exponential backoff (jitter, Retry-After support), error categorization, per-provider error handling. Structured logging with cost awareness (token usage per article, cumulative batch totals). Error sanitization (strip API keys from logs). Smoke test documentation. Final integration verification.

**Tests:** Retry/backoff tests, error sanitization tests, token usage logging tests.
