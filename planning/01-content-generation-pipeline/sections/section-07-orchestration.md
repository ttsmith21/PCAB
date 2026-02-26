# Section 07: Pipeline Orchestration

## Overview

This section implements the CLI entry point, core article generation pipeline function, and batch state persistence. The CLI (`scripts/content-pipeline/generate.ts`) is the primary interface offering four modes (single, batch, status, matrix) and global flags. The core `generateArticle()` function chains research, outline, writing, and validation into a retry-capable pipeline.

## Dependencies

| Section | What It Provides |
|---------|-----------------|
| section-01-setup | Types, config |
| section-03-topics | Topic loader, content matrix |
| section-04-gemini | Research service |
| section-05-claude | Outline service, article service |
| section-06-validation | Validator, rubric scoring |

**Blocks:** section-08-output.

## Files to Create

| File | Purpose |
|------|---------|
| `scripts/content-pipeline/generate.ts` | CLI entry point (replaces stub from section-01) |
| `scripts/content-pipeline/state/batch-state.ts` | Batch state persistence |
| `scripts/content-pipeline/state/progress-tracker.ts` | Console progress logging |
| `__tests__/scripts/content-pipeline/generate.test.ts` | CLI parsing tests |
| `__tests__/scripts/content-pipeline/generate.integration.test.ts` | Pipeline integration tests |
| `__tests__/scripts/content-pipeline/state/batch-state.test.ts` | Batch state tests |

## Tests (Write First)

### `__tests__/scripts/content-pipeline/generate.test.ts`

```ts
// Test: CLI parses --mode single --topic <slug> correctly
// Test: CLI parses --mode batch --category <category> correctly
// Test: CLI parses --mode status correctly
// Test: CLI parses --mode matrix correctly
// Test: CLI parses --dry-run flag (defaults to "write" stage)
// Test: CLI parses --dry-run outline (specific stage)
// Test: CLI parses --publish flag
// Test: CLI parses --overwrite flag
// Test: CLI parses --resume flag for batch mode
// Test: CLI parses --concurrency <n> for batch mode
// Test: CLI exits with error for unknown mode
// Test: CLI exits with error when --topic missing in single mode
```

### `__tests__/scripts/content-pipeline/generate.integration.test.ts`

```ts
// Mock all external service modules

// Test: generateArticle runs full pipeline: research -> outline -> write -> validate
// Test: generateArticle returns success when validation passes
// Test: generateArticle retries writing when validation fails
// Test: generateArticle returns validation_failed after max_attempts exceeded
// Test: generateArticle returns error on API failure
// Test: generateArticle proceeds without research when Gemini fails (null)
// Test: generateArticle respects dry-run flag
// Test: single mode aborts if file exists and --overwrite not set
// Test: single mode overwrites if --overwrite is set
// Test: batch mode skips existing files unless --overwrite is set
// Test: batch mode saves state after each article
// Test: batch mode resumes from saved state on --resume
```

### `__tests__/scripts/content-pipeline/state/batch-state.test.ts`

```ts
// Test: createBatchState initializes all topics as pending
// Test: createBatchState generates batch_id from category + timestamp
// Test: updateBatchState marks article as completed
// Test: updateBatchState marks article as failed with error
// Test: updateBatchState increments attempt count
// Test: loadBatchState reads existing state from JSON file
// Test: loadBatchState returns null for non-existent file
// Test: loadBatchState handles corrupt JSON gracefully
// Test: getPendingTopics returns only topics with pending status
// Test: getBatchSummary returns correct counts
```

## Implementation Details

### CLI Entry Point (`scripts/content-pipeline/generate.ts`)

Uses `commander`. Extract parsing into testable `parseCLI(argv)` function.

```ts
interface CLIOptions {
  mode: "single" | "batch" | "status" | "matrix";
  topic?: string;
  category?: string;
  dryRun?: "research" | "outline" | "write" | "validate" | false;
  publish: boolean;
  overwrite: boolean;
  resume: boolean;
  concurrency: number;
}
```

**Modes:**

| Mode | Required | Optional |
|------|----------|----------|
| `single` | `--topic <slug>` | `--dry-run`, `--publish`, `--overwrite` |
| `batch` | (none) | `--category`, `--resume`, `--concurrency`, `--publish`, `--overwrite` |
| `status` | (none) | (none) |
| `matrix` | (none) | (none) |

### Core Pipeline: `generateArticle()`

```ts
async function generateArticle(topic: TopicDefinition, options: CLIOptions): Promise<GenerationResult>
```

**Steps:**
1. **Research**: Call research service -> report (or null on failure)
2. **Outline**: Call outline service with research -> structured outline
3. **Write**: Call article service with outline + research -> MDX string
4. **Schema check**: Parse frontmatter with gray-matter, validate against Zod schema
5. **Validate**: Call validator -> RubricScores
6. **If pass**: Return success
7. **If fail**: Re-run writing (step 3) with feedback, up to max_attempts
8. **Max attempts exceeded**: Return validation_failed
9. **Any error**: Return error status

**Dry-run**: Stops at specified stage, prints output, returns early.

| `--dry-run` | Executes | Prints |
|-------------|----------|--------|
| `research` | Research only | Report text |
| `outline` | Research + Outline | Outline |
| `write` | Research + Outline + Write | Full MDX |
| `validate` | Full pipeline | Article + scores |

**Retry loop**: Only re-runs writing (not research/outline) with feedback from validator.

### Batch State (`scripts/content-pipeline/state/batch-state.ts`)

```ts
function createBatchState(category: string, topicSlugs: string[]): BatchState;
function updateBatchState(state: BatchState, slug: string, status: "completed" | "failed", error?: string): BatchState;
function loadBatchState(batchId: string): BatchState | null;
function saveBatchState(state: BatchState): void;
function getPendingTopics(state: BatchState): string[];
function getBatchSummary(state: BatchState): { completed: number; failed: number; pending: number };
```

**Persistence:** JSON files in `.content-pipeline-state/`. Saved after EVERY article. Batch ID = `{category}-{ISO timestamp}`. Corrupt JSON throws (never silently creates new state).

### Progress Tracker (`scripts/content-pipeline/state/progress-tracker.ts`)

Lightweight console logger for batch progress. Reports current index, elapsed time, estimated remaining, token usage.

## Key Design Decisions

1. **Sequential default** (concurrency 1) avoids rate-limit pressure on both APIs.
2. **State saved per-article** enables crash-resume.
3. **Retry only re-runs writing** (not research/outline) for efficiency.
4. **`parseCLI` extracted as function** for testability.
5. **`--publish` off by default** prevents accidental branch/PR creation during development.
