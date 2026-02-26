# Implementation Plan: Content Generation Pipeline

## 1. Overview

### What We're Building

An automated content generation pipeline for the PCAB (Port Clinton Athletic Boosters) website that produces expert-quality MDX articles about youth athletic development. The pipeline:

1. **Researches** topics using Gemini Deep Research API (reads 100+ web pages per topic)
2. **Outlines** articles using Claude API from the research findings
3. **Writes** full 2,000-3,000 word articles using Claude API from the outline + research
4. **Validates** each article against a 5-dimension alignment rubric using LLM-as-judge
5. **Manages** a topic taxonomy with coverage tracking and gap analysis
6. **Publishes** via Git PR workflow for human review

The pipeline integrates into the PCAB repository as npm scripts and is designed for both single-article iteration and batch generation of the full 75-100+ article library.

### Why This Architecture

Port Clinton needs a large volume of high-quality, philosophically consistent content across multiple domains (coaching, parenting, youth development, community building) and audiences (parents, coaches, volunteers, youth leaders). Manual writing at this scale is impractical. A hybrid AI approach — Gemini for web research breadth, Claude for prose quality — combined with automated validation ensures both quantity and quality.

The pipeline is a first-class development tool, not a throwaway script. It lives in the repository, has versioned prompts, tracks state, and produces output that integrates with the Git-based review workflow the team already uses.

### How It Fits

This is split 01 of 7 in the PCAB Knowledge Base project. It runs in parallel with split 03 (Knowledge Base Platform, which builds the Velite/MDX rendering infrastructure). Split 02 (Content Library Creation) uses this pipeline's tooling to actually generate the 75-100+ articles. The pipeline must output MDX files matching the frontmatter schema defined in a shared schema file (`lib/content-schema.ts`) that both split 01 and split 03 import as a single source of truth.

---

## 2. Project Setup & Configuration

### 2.1 Dependencies

**New production dependencies:**
- `@anthropic-ai/sdk` — Claude API client (article writing, validation)
- `@google/genai` — Gemini API client (deep research)
- `gray-matter` — Parse/stringify YAML frontmatter in MDX files
- `zod` — Schema validation (shared with Velite config from split 03)
- `dotenv` — Load environment variables from `.env`
- `js-yaml` — Parse topic definition YAML files (with `@types/js-yaml` in dev)
- `commander` — CLI argument parsing for npm scripts

**New dev dependencies:**
- `tsx` — TypeScript execute for running pipeline scripts without a compile step
- `chalk` — Terminal output formatting for pipeline status (dev-only, used in pipeline scripts)
- `@types/js-yaml` — Type definitions for js-yaml

### 2.2 Environment Configuration

**`.env` file** (gitignored, already in `.gitignore` pattern):
```
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AI...
```

**`.env.example`** (committed to repo with placeholder values):
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
GEMINI_API_KEY=your-gemini-key-here
```

**Pipeline config file** (`scripts/content-pipeline/pipeline.config.ts`):
- Model selection per pipeline stage (research model, outline model, writing model, validation model)
- Retry counts and backoff parameters
- Validation threshold (default 3.0)
- Max regeneration attempts (default 3)
- Output directory path
- Batch concurrency (default: 1 — sequential execution, configurable up to N)

All values configurable via environment variable overrides for future CI compatibility.

**Note on batch wall-clock time:** At default concurrency of 1, generating 100 articles at ~3-5 minutes each means ~5-8 hours of wall-clock time. Sequential execution is the safest default — it avoids concurrent rate-limit pressure on both Gemini and Claude APIs. Concurrency can be increased after verifying rate limit headroom.

### 2.3 npm Scripts

Add to `package.json`:
```json
"generate:article": "tsx scripts/content-pipeline/generate.ts --mode single",
"generate:batch": "tsx scripts/content-pipeline/generate.ts --mode batch",
"generate:status": "tsx scripts/content-pipeline/generate.ts --mode status",
"generate:matrix": "tsx scripts/content-pipeline/generate.ts --mode matrix"
```

Uses `tsx` (TypeScript execute, added as a dev dependency) for running TypeScript scripts directly without a compile step.

**Additional global CLI flags** (available in all modes):
- `--dry-run [stage]` — Run pipeline up to the specified stage (`research`, `outline`, `write`, `validate`) and print intermediate output to stdout without writing files. Defaults to `write` if no stage specified. Critical for prompt iteration.
- `--publish` — Enable Git branch/PR creation after generation. Off by default — default behavior writes files locally only.
- `--overwrite` — Allow overwriting existing MDX files. Off by default — if the target file already exists, the pipeline warns and aborts (single mode) or skips (batch mode).

### 2.4 Directory Structure

```
lib/
  content-schema.ts          # Shared Zod schema — single source of truth for both
                             # pipeline validation (split 01) and Velite config (split 03)
scripts/
  content-pipeline/
    generate.ts              # CLI entry point — parses args, dispatches to modes
    pipeline.config.ts       # Configuration with env var overrides
    types.ts                 # Shared TypeScript types (ArticleMeta, TopicDef, etc.)
    research/
      gemini-client.ts       # Gemini Deep Research API wrapper
      research-service.ts    # Orchestrates research: start, poll, extract results
    writing/
      claude-client.ts       # Claude API wrapper (outline + article)
      outline-service.ts     # Generates structured outline from research
      article-service.ts     # Generates full article from outline + research
    validation/
      validator.ts           # LLM-as-judge orchestrator
      rubric.ts              # Rubric definition and scoring logic
    topics/
      topic-loader.ts        # Loads topic YAML files from data/topics/
      content-matrix.ts      # Coverage tracking and gap analysis
      topic-types.ts         # Topic-specific types
    state/
      batch-state.ts         # Persistent batch state (JSON file)
      progress-tracker.ts    # Tracks generation progress
    prompts/
      prompt-loader.ts       # Reads and interpolates prompt templates
    output/
      mdx-writer.ts          # Writes validated MDX files to content directory
      git-publisher.ts       # Creates branches and PRs via gh CLI (execFile, not exec)
  prompts/
    system-prompt.md
    research-prompt.md
    outline-generation.md
    article-generation.md
    alignment-check.md
data/
  topics/                    # Topic definition YAML files (pipeline input, NOT Velite content)
    coaching.yaml
    parenting.yaml
    development.yaml
    community.yaml
    resources.yaml
    pc-way.yaml
content/
  articles/                  # Generated MDX output only (by category subdirectory)
```

**Key separation:** Topic definition YAML files live in `data/topics/`, not `content/`. The `content/` directory is reserved exclusively for Velite-renderable MDX output. This prevents Velite from trying to parse YAML files and avoids merge conflicts with split 03.

### 2.5 Gitignore Additions

Add to `.gitignore`:
```
.content-pipeline-state/
```

---

## 3. Shared Schema & Types

### 3.0 Shared Content Schema (`lib/content-schema.ts`)

Define the authoritative Zod schema for article frontmatter in `lib/content-schema.ts`. This file is the **single source of truth** shared between:
- **Split 01** (this pipeline): validates generated MDX frontmatter before writing
- **Split 03** (knowledge base platform): configures Velite to parse MDX at build time

The schema is owned by split 01 initially (since it's needed first) but must be agreed upon with split 03. Any changes to the schema must be coordinated across both splits.

Export both the Zod schema (`articleFrontmatterSchema`) and the inferred TypeScript type (`ArticleFrontmatter`).

### 3.1 Core Types (`types.ts`)

Define TypeScript interfaces for:

**`ArticleFrontmatter`** — Imported from `lib/content-schema.ts` (inferred from the Zod schema). Fields: title, slug, description, category (enum), pillar (enum array), sport (string array), age_group (string array), audience (enum array), difficulty (enum), content_type (enum), theme (string array), last_reviewed (ISO date string), generated_by (enum), sources (array of {title, url, accessed}).

**`TopicDefinition`** — Represents a single topic in the YAML topic list. Fields: slug, title, category, audiences, difficulty, age_groups, sports, themes, content_type, description, outline_notes (optional free-text guidance for the AI), pillar_alignment (which pillars this topic maps to).

**`GenerationResult`** — Output of one article generation attempt. Fields: topic_slug, status (enum: success | validation_failed | error), article (MDX string or null), frontmatter (ArticleFrontmatter or null), validation_scores (RubricScores or null), error (string or null), attempts (number), duration_ms (number).

**`RubricScores`** — Validation output. Fields: factual_accuracy (1-4), values_alignment (1-4), audience_appropriateness (1-4), actionability (1-4), writing_quality (1-4), overall (weighted float), pass (boolean), reasoning (per-dimension string explanations), recommendations (string array).

**`BatchState`** — Persistent state for batch runs. Fields: batch_id, started_at, topics (array of {slug, status, attempts, last_error}), completed_count, failed_count, pending_count.

**`PipelineConfig`** — Runtime configuration. Fields: research_model, outline_model, writing_model, validation_model, max_tokens, validation_threshold, max_attempts, retry_delay_ms, batch_concurrency, output_dir.

---

## 4. Gemini Deep Research Integration

### 4.1 Gemini Client (`research/gemini-client.ts`)

Wraps `@google/genai` SDK. Responsibilities:
- Initialize `GoogleGenAI` with API key from environment
- Create research interactions using the Interactions API with the configured research agent model
- Run in background mode (research can take 30-120 seconds)
- Poll for completion with configurable interval
- Extract the final research report text from the interaction outputs
- Handle errors: timeout (max 5 minutes), API failures, empty results
- **Fallback:** If the Interactions API is unavailable, fall back to standard Gemini generation with a research-oriented prompt (lower quality but functional)

**API stability note:** The Gemini Deep Research API (`deep-research-pro-preview-12-2025`) is a preview/beta API. The model identifier and Interactions API surface may change. The `research_model` config value must be verified against current Gemini documentation at implementation time. The fallback to standard generation ensures the pipeline functions even if the Deep Research API is deprecated or changed.

### 4.2 Research Service (`research/research-service.ts`)

Orchestrates the research phase for a single topic:
1. Load the research prompt template from `scripts/prompts/research-prompt.md`
2. Interpolate topic-specific variables (title, description, category, audience, outline notes)
3. Call Gemini client to start a deep research interaction
4. Poll until complete or timeout
5. Return the research report as a string
6. On failure: retry once, then return null (article proceeds without research, logging a warning)

The research prompt template instructs Gemini to focus on:
- Evidence-based approaches relevant to the topic
- Published research and established frameworks (LTAD, Positive Coaching Alliance, NFHS)
- Practical applications and real-world examples
- Age-appropriate considerations
- Avoiding sport-specific tactical content

---

## 5. Claude Article Writing

### 5.1 Claude Client (`writing/claude-client.ts`)

Wraps `@anthropic-ai/sdk`. Responsibilities:
- Initialize Anthropic client with API key from environment
- Send messages with adaptive thinking enabled
- Stream responses for long content
- Handle token limits, rate limits, and API errors
- Support both outline generation and full article generation via different prompt configurations

### 5.2 Outline Service (`writing/outline-service.ts`)

Generates a structured article outline from the research report:
1. Load outline prompt template from `scripts/prompts/outline-generation.md`
2. Interpolate: topic metadata (including `outline_notes` if present), research report, frontmatter schema requirements
3. Call Claude with the outline prompt
4. Parse the returned outline (structured headings with key points per section)
5. Return the outline as a structured object

The outline includes: title, target word count per section, key arguments per section, sources to cite, frontmatter values (derived from topic metadata + research).

**`outline_notes` usage:** The optional `outline_notes` field from topic definitions is injected into both the research prompt (to focus Gemini's search on specific angles) and the outline prompt (to guide Claude's section structure). For example, `outline_notes: "Focus on first practices, team expectations, parent communication"` tells Gemini to prioritize research on those subtopics and tells Claude to structure the outline around those themes.

### 5.3 Article Service (`writing/article-service.ts`)

Generates the full article from outline + research:
1. Load system prompt from `scripts/prompts/system-prompt.md` and article prompt from `scripts/prompts/article-generation.md`
2. Interpolate: topic metadata, research report, outline, frontmatter schema, content guidelines
3. Call Claude with the article prompt (system prompt sets the persona and constraints)
4. Parse the response: extract frontmatter YAML block and MDX body
5. Validate frontmatter against the schema (quick schema check, not the full LLM rubric)
6. Return the full MDX string (frontmatter + body)

The system prompt establishes:
- Expert content writer persona specializing in youth athletic development
- Writing voice: warm, authoritative, evidence-based, avoids jargon, speaks directly to reader
- Content constraints: no medical advice, no tactical coaching, no PII about minors, cite sources
- Output format: MDX with YAML frontmatter matching the exact schema
- Length target: 2,000-3,000 words
- Structure: subheadings every 300-400 words, practical takeaways per section

---

## 6. Alignment Validation

### 6.1 Rubric Definition (`validation/rubric.ts`)

Defines the 5-dimension validation rubric as a TypeScript constant:

**Dimensions with weights:**
1. Factual Accuracy (0.25) — Scored 1-4 with explicit criteria per score level
2. Values Alignment (0.25) — Checks against PC Way principles: character-first, process over outcomes, multi-sport encouraged, age-appropriate progression, no early specialization pressure, voluntary hardship / earned confidence
3. Audience Appropriateness (0.20) — Matches the declared audience level
4. Actionability (0.15) — Provides implementable advice with specific steps
5. Writing Quality (0.15) — Structure, engagement, accessibility

**Scoring logic:**
- Each dimension scored independently (1-4 integer)
- Overall score = weighted sum
- Pass if overall >= 3.0
- Any single dimension scoring 1 = automatic fail regardless of overall score

### 6.2 Validator (`validation/validator.ts`)

Orchestrates validation of a generated article:
1. Load alignment check prompt from `scripts/prompts/alignment-check.md`
2. Interpolate: the generated article, the rubric definition with score criteria, the PC Way principles
3. Call Claude with the validation model (default: `claude-sonnet-4-6`, same model family as writing but with a specialized validation system prompt — the rubric prompt itself provides sufficient bias mitigation)
4. Parse the JSON response into RubricScores
5. Calculate overall weighted score and pass/fail
6. Return RubricScores with per-dimension reasoning

**Default model choices:** Both writing and validation default to `claude-sonnet-4-6`. Cross-model validation (e.g., writing with Sonnet, validating with Opus) is configurable but not the default — it significantly increases cost ($75/1M output for Opus) without proven quality improvement. The well-crafted rubric prompt with explicit scoring criteria per dimension is sufficient for v1.

**If validation fails:**
- Extract the failing dimensions and their reasoning
- Feed these back into a regeneration prompt: "The article failed validation on {dimensions}. Specific feedback: {reasoning}. Please revise to address these issues."
- Re-generate with feedback (up to max_attempts, default 3)

---

## 7. Topic Management

### 7.1 Topic Definitions (`data/topics/*.yaml`)

Each category has a YAML file defining its topics. Structure per topic:

```yaml
- slug: building-team-culture-youth
  title: "Building Team Culture at the Youth Level"
  category: coaching
  audiences: [coaches, parents]
  difficulty: beginner
  age_groups: [youth]
  sports: [general]
  themes: [leadership, communication, inclusion]
  content_type: guide
  pillars: [character-development, retention]
  description: "How volunteer coaches can create a positive team culture from day one"
  outline_notes: "Focus on first practices, team expectations, parent communication"
```

### 7.2 Topic Loader (`topics/topic-loader.ts`)

Reads all YAML files from `data/topics/`, parses them with `js-yaml`, validates against the TopicDefinition type, and returns a flat array of all topics. Supports filtering by category, audience, difficulty, etc.

### 7.3 Content Matrix (`topics/content-matrix.ts`)

Tracks coverage across the faceted taxonomy:

**Matrix dimensions:** domain (category) × audience × difficulty

**Functionality:**
- `buildMatrix(topics, existingArticles)` — Compares defined topics against existing MDX files in `/content/articles/`
- `identifyGaps()` — Returns underserved intersections. Target per cell = count of topics defined in YAML for that cell. Actual = count of existing MDX files. Gap = difference.
- `suggestNext(count)` — Returns the top N topics to generate next, prioritizing underserved areas
- `generateReport()` — Human-readable coverage report showing planned vs. actual per cell
- Distribution analysis: actual vs. target difficulty distribution (40/40/20)

**Existing article detection:** Scans `/content/articles/` for MDX files, reads their frontmatter to classify into the matrix. This bridges the pipeline and the content library.

---

## 8. Pipeline Orchestration

### 8.1 CLI Entry Point (`generate.ts`)

Uses `commander` for argument parsing. Four modes:

**Single mode** (`--mode single --topic <slug>`):
1. Load topic definition from YAML
2. Check if output file already exists — if so, abort with warning unless `--overwrite` is set
3. Run full pipeline: research → outline → write → validate → (retry if needed)
4. If `--dry-run [stage]`: print intermediate output to stdout and exit (no file writes)
5. Write MDX to output directory
6. If `--publish`: create branch and PR via git publisher
7. Print validation scores, estimated token usage, and status

**Batch mode** (`--mode batch --category <category> [--resume] [--concurrency <n>]`):
1. Load topics for the specified category (or all if not specified)
2. Load or create batch state
3. For each pending topic: run full pipeline sequentially (default concurrency: 1)
4. Skip topics whose output file already exists (unless `--overwrite` is set)
5. Save state after each article (for resume capability)
6. Log estimated token usage per article to console
7. If `--publish`: create branch and PR for the batch
8. Print batch summary at end

**Status mode** (`--mode status`):
1. Load latest batch state
2. Print: completed, failed, pending counts
3. List failed articles with error details

**Matrix mode** (`--mode matrix`):
1. Load all topics and scan existing articles
2. Build content matrix
3. Print coverage report and gap analysis
4. Suggest next topics to generate

### 8.2 Generation Pipeline (`generate.ts` internal)

The core generation function for a single article:

```
generateArticle(topic: TopicDefinition): Promise<GenerationResult>
```

Steps:
1. **Research phase**: Call research service → get research report (or null on failure)
2. **Outline phase**: Call outline service with research → get structured outline
3. **Writing phase**: Call article service with outline + research → get MDX string
4. **Quick schema check**: Parse frontmatter with gray-matter, validate required fields exist
5. **Validation phase**: Call validator → get RubricScores
6. **If pass**: Return success with article and scores
7. **If fail**: Extract feedback, regenerate from step 3 with feedback (up to max_attempts)
8. **If max attempts exceeded**: Return validation_failed with last attempt's scores
9. **On any error**: Return error status with error message

### 8.3 Batch State Persistence (`state/batch-state.ts`)

Saves batch state as JSON to `.content-pipeline-state/{batch-id}.json` (gitignored):

- Created on batch start with all topics marked pending
- Updated after each article completes or fails
- Supports resume: `--resume` flag loads existing state and skips completed articles
- Stores: topic statuses, attempt counts, timestamps, last errors
- Batch ID derived from: category + timestamp (or provided via CLI)

---

## 9. Prompt Templates

### 9.1 Prompt Loader (`prompts/prompt-loader.ts`)

Reads `.md` files from `scripts/prompts/`, replaces `{{variable}}` placeholders with provided values. **Bidirectional** template variable validation:
1. All `{{variables}}` in the template must have values provided — missing variables throw errors
2. All values provided must correspond to a `{{variable}}` in the template — extra values throw errors (catches typos and stale templates)

### 9.2 Template Files

**`scripts/prompts/system-prompt.md`** — The base system prompt for Claude during article writing. Establishes the expert content writer persona, voice guidelines, content constraints, and output format requirements. This prompt is long (~500-1000 words) and versioned separately from code so it can be iterated rapidly.

**`scripts/prompts/research-prompt.md`** — Instructs Gemini Deep Research on what to research for a given topic. Includes: topic context, audience, what frameworks to prioritize, what to avoid (tactical coaching content, medical advice).

**`scripts/prompts/outline-generation.md`** — Asks Claude to generate a structured outline from the research report. Specifies: section count, key points per section, target word counts, which sources to prioritize.

**`scripts/prompts/article-generation.md`** — The main article writing prompt. Includes: the research report, the outline, frontmatter schema, example frontmatter block, writing guidelines, citation format.

**`scripts/prompts/alignment-check.md`** — The validation prompt. Includes: the full rubric with score criteria per dimension, the PC Way principles, the article to evaluate. Instructs the judge to return JSON matching the RubricScores schema.

---

## 10. Output & Publishing

### 10.1 MDX Writer (`output/mdx-writer.ts`)

Writes generated articles to the content directory:
1. Receive validated MDX string and frontmatter
2. Determine output path: `content/articles/{category}/{slug}.mdx`
3. Ensure directory exists
4. Write the file
5. Return the file path

### 10.2 Git Publisher (`output/git-publisher.ts`)

Handles the Git PR workflow (only runs when `--publish` flag is set):
1. Create a branch: `content/{category}/{slug}` (single) or `content/batch/{batch-id}` (batch)
2. Stage the MDX file(s)
3. Commit with a descriptive message including validation scores
4. Push the branch
5. Create a PR via `gh pr create` with: title, description including validation scores, labels

For batch mode: accumulate all articles on one branch, create a single PR with a summary table of all generated articles and their scores.

The publisher shells out to `git` and `gh` CLI tools using `child_process.execFile` (NOT `exec`) or `spawn` with argument arrays. Never interpolate topic slugs or other user-controllable values into shell command strings — this prevents command injection. Topic slugs are validated against `/^[a-z0-9-]+$/` at load time by the topic loader.

**Windows compatibility:** All file path construction uses `path.join()` or `path.resolve()` from Node's `path` module. Never concatenate paths with `/` string literals. The git publisher normalizes paths before passing them to shell commands.

---

## 11. Error Handling & Resilience

### 11.1 Retry Strategy

All API calls use exponential backoff:
- Initial delay: 1 second
- Multiplier: 2x per retry
- Max retries: 3 (configurable)
- Jitter: random 0-500ms added to prevent thundering herd
- Rate limit errors (429): respect `Retry-After` header if present

### 11.2 Error Categories

| Error Type | Handling |
|-----------|----------|
| API rate limit (429) | Backoff + retry, respect Retry-After |
| API timeout | Retry once, then fail article |
| API auth error (401/403) | Fail immediately, log clear message about API key |
| Gemini research timeout (>5min) | Proceed without research, log warning |
| Claude truncated response (`stop_reason === "max_tokens"`) | Retry with higher max_tokens |
| Validation parse error | Retry validation call, then fail article |
| File write error | Fail immediately (likely permissions issue) |
| Git operation failure | Log error, don't fail the batch (articles are still generated locally) |

### 11.3 Logging

Structured logging to stdout with levels (info, warn, error):
- INFO: Article generation started/completed, validation scores, estimated token usage per article
- WARN: Retry triggered, research failed (proceeding without), regeneration attempt
- ERROR: Article failed all attempts, API auth error, file system error

**Cost awareness:** Log estimated token counts (input + output) per article and cumulative for batch runs. Both Claude and Gemini SDK responses include usage metadata. This gives the developer visibility into API spend without requiring a budget-limit mechanism.

**Security:** Error logging must never include API keys. Never log the full environment, config objects, or raw SDK error details that might contain credentials. Sanitize error output before logging.

---

## 12. Testing Strategy

### 12.1 Unit Tests

**Topic loader**: Load YAML, validate schema, handle malformed files
**Content matrix**: Build matrix, identify gaps, suggest next topics, handle edge cases (empty library, all topics complete)
**Prompt loader**: Template interpolation, bidirectional variable validation, file loading
**Prompt snapshots**: Snapshot tests for all 5 interpolated prompts with known inputs — if a prompt template changes, the snapshot fails and the developer must intentionally update it (review checkpoint for prompt changes)
**Rubric scoring**: Weighted score calculation, auto-fail on any dimension scoring 1, threshold comparison
**MDX writer**: Correct path generation, directory creation, file content
**Batch state**: Create, update, resume, handle corrupt state files

### 12.2 Integration Tests

**Pipeline flow** (mocked API calls): Full single-article flow from topic → research → outline → write → validate → output. Mock the Gemini and Claude API responses to test the orchestration without real API calls.

**Validation flow**: Feed known good and bad articles through the validator (mocked Claude responses) to verify pass/fail logic and feedback generation.

**Git publisher** (mocked git/gh): Verify correct branch names, commit messages, PR creation commands.

### 12.3 Smoke Test (Manual)

A documented manual verification step: generate a single article from a known topic against the real APIs. This is not automated (it costs money) but should be performed at least once during development to verify end-to-end functionality. Document the specific topic and expected outcome in the pipeline's usage docs.

### 12.4 Test Structure

Tests go in `__tests__/scripts/content-pipeline/` mirroring the source structure. Follow existing project conventions: Vitest, descriptive test names, mock external dependencies.

---

## 13. Build Sequence

The implementation should proceed in this order, with each section building on the previous:

1. **Project setup**: Dependencies, directory structure, shared schema (`lib/content-schema.ts`), types, config, npm scripts, `.env.example`, `.gitignore` additions
2. **Prompt templates**: Write all 5 prompt template files, build the prompt loader with bidirectional validation
3. **Topic management & content matrix**: YAML schema, topic loader (with slug validation), sample topic files, content matrix (coverage tracking, gap analysis, reporting). The matrix is fundamentally about topics — build it alongside topic management, not as a separate late step.
4. **Gemini research integration**: Client wrapper, research service, fallback to standard generation, error handling
5. **Claude writing integration**: Client wrapper, outline service (with outline_notes), article service
6. **Alignment validation**: Rubric definition, validator, scoring logic, feedback loop
7. **Pipeline orchestration**: CLI entry point with all flags (`--dry-run`, `--publish`, `--overwrite`), single mode, batch mode (sequential default), state persistence, status/matrix modes
8. **Output & publishing**: MDX writer (with overwrite protection), Git publisher (execFile, slug sanitization, Windows path handling)
9. **Polish**: Cost logging, error handling hardening, smoke test documentation

Each section should have its tests written alongside or slightly before the implementation (TDD approach to be defined in the TDD plan).
