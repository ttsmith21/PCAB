# Section 09: Polish -- Error Handling, Resilience, Cost Logging, and Smoke Test Documentation

## Overview

This is the final section of the content generation pipeline. It adds production-quality error handling, retry logic, cost-aware logging, error sanitization, and smoke test documentation. This section depends on **all prior sections** (01 through 08) being complete, as it hardens infrastructure used across the entire pipeline.

**Plan references:** Section 11 (Error Handling & Resilience), Section 12.3 (Smoke Test), and final integration verification from `claude-plan.md`.

---

## Dependencies

- **section-01-setup**: Project structure, dependencies (`chalk` for formatting), `pipeline.config.ts` (retry config values)
- **section-02-prompts**: Prompt loader (used in retry scenarios during validation)
- **section-04-gemini**: Gemini client (receives retry wrapper, error categorization)
- **section-05-claude**: Claude client (receives retry wrapper, truncation detection, error categorization)
- **section-06-validation**: Validator (receives retry logic for parse failures)
- **section-07-orchestration**: Pipeline orchestration (integrates cost logging, retry utility, error handling)
- **section-08-output**: Git publisher (error handling for git failures -- log but do not throw)

---

## Files to Create

| File | Purpose |
|------|---------|
| `scripts/content-pipeline/utils/retry.ts` | Retry utility with exponential backoff, jitter, and Retry-After support |
| `scripts/content-pipeline/utils/errors.ts` | Error categorization and sanitization utilities |
| `scripts/content-pipeline/utils/logger.ts` | Structured logging with cost/token tracking |
| `__tests__/scripts/content-pipeline/error-handling.test.ts` | Tests for retry, sanitization, and token logging |

## Files to Modify

| File | Change |
|------|--------|
| `scripts/content-pipeline/research/gemini-client.ts` | Wrap API calls with `retryWithBackoff`, add error categorization |
| `scripts/content-pipeline/writing/claude-client.ts` | Wrap API calls with `retryWithBackoff`, add error categorization, truncation handling |
| `scripts/content-pipeline/validation/validator.ts` | Wrap validation call with retry for parse failures |
| `scripts/content-pipeline/output/git-publisher.ts` | Catch git errors, log them, but do not throw (do not fail the batch) |
| `scripts/content-pipeline/generate.ts` | Integrate token usage logging per article and cumulative for batch runs |
| `scripts/content-pipeline/pipeline.config.ts` | Ensure retry config values are exported (initial_delay_ms, multiplier, max_retries, jitter_max_ms) |

---

## Tests (Write First)

All tests go in `__tests__/scripts/content-pipeline/error-handling.test.ts`. Use `vi.mock` to mock timers and dependencies as needed.

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Retry with Backoff ─────────────────────────────────────────────────────

describe('retryWithBackoff', () => {
  // Test: retryWithBackoff retries on 429 with exponential delay
  // - Create a function that fails twice with a 429-status error then succeeds
  // - Verify retryWithBackoff calls the function 3 times total
  // - Verify delays between attempts double (1s, 2s baseline before jitter)

  // Test: retryWithBackoff respects Retry-After header
  // - Create a function that fails once with a 429 error and a Retry-After header of 5 seconds
  // - Verify the delay before the next attempt is at least 5 seconds (not the default backoff)

  // Test: retryWithBackoff adds jitter to delay
  // - Run retryWithBackoff multiple times on a function that always fails once then succeeds
  // - Verify the actual delays are not identical (jitter introduces randomness 0-500ms)

  // Test: retryWithBackoff gives up after max retries
  // - Create a function that always throws a 429 error
  // - Set max_retries to 3
  // - Verify the function is called exactly 4 times (1 initial + 3 retries)
  // - Verify retryWithBackoff throws the last error

  // Test: retryWithBackoff does not retry on 401/403
  // - Create a function that throws a 401 auth error
  // - Verify retryWithBackoff calls the function exactly once (no retries)
  // - Verify the error is re-thrown immediately
  // - Repeat for 403
});

// ─── Error Sanitization ─────────────────────────────────────────────────────

describe('sanitizeError', () => {
  // Test: sanitizeError removes API key patterns from error messages
  // - Input: "Error calling API with key sk-ant-abc123xyz at endpoint..."
  // - Verify the output does not contain "sk-ant-abc123xyz"
  // - Verify it is replaced with "[REDACTED]" or similar

  // Test: sanitizeError removes environment variable values from error messages
  // - Set process.env.ANTHROPIC_API_KEY to a known value
  // - Pass an error message containing that value
  // - Verify the value is replaced with "[REDACTED_ANTHROPIC_API_KEY]" or similar
  // - Set process.env.GEMINI_API_KEY to a known value
  // - Same verification
});

// ─── Token Usage Logging ────────────────────────────────────────────────────

describe('logTokenUsage', () => {
  // Test: logTokenUsage extracts usage from Claude API response
  // - Provide a mock Claude response with usage: { input_tokens: 1500, output_tokens: 3000 }
  // - Verify logTokenUsage correctly extracts and records both values

  // Test: logTokenUsage extracts usage from Gemini API response
  // - Provide a mock Gemini response with usageMetadata: { promptTokenCount: 2000, candidatesTokenCount: 5000 }
  // - Verify logTokenUsage correctly extracts and records both values

  // Test: logTokenUsage accumulates batch totals correctly
  // - Log usage for 3 separate articles
  // - Verify cumulative totals equal the sum of all individual usages
  // - Verify the accumulator tracks articles-count, total-input-tokens, total-output-tokens
});
```

---

## Implementation Details

### 1. Retry Utility (`scripts/content-pipeline/utils/retry.ts`)

This module exports a single generic retry wrapper function. All API call sites across the pipeline use this utility instead of implementing their own retry logic.

**Function signature:**

```ts
/**
 * Retries an async function with exponential backoff and jitter.
 *
 * Behavior:
 * - On retryable errors (429 rate limit, 5xx server errors, timeouts): retry with backoff
 * - On non-retryable errors (401, 403 auth errors): throw immediately, no retry
 * - Respects Retry-After header when present on rate limit responses
 * - Adds random jitter (0 to jitter_max_ms) to each delay to prevent thundering herd
 *
 * @param fn - The async function to execute and potentially retry
 * @param options - Retry configuration
 * @returns The result of fn on success
 * @throws The last error if all retries are exhausted
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options?: {
    max_retries?: number;       // default: 3
    initial_delay_ms?: number;  // default: 1000
    multiplier?: number;        // default: 2
    jitter_max_ms?: number;     // default: 500
  }
): Promise<T>;
```

**Error classification logic:**

Implement a helper `isRetryable(error: unknown): boolean` that returns `true` for:
- HTTP status 429 (rate limit)
- HTTP status 500, 502, 503, 504 (server errors)
- Network timeout errors (ETIMEDOUT, ECONNRESET)

Returns `false` (immediate throw, no retry) for:
- HTTP status 401 (unauthorized)
- HTTP status 403 (forbidden)
- Any other client-side error (4xx range, except 429)

**Retry-After handling:**

When a 429 response includes a `Retry-After` header (or equivalent field on the SDK error object), the delay for the next attempt should be `max(retry_after_value_in_ms, calculated_backoff_delay)`. Check for:
- `error.headers?.['retry-after']` (Anthropic SDK)
- `error.retryAfter` (if exposed as a parsed property)
- Fall back to the standard backoff calculation if neither is available

**Backoff calculation:**

```
delay = initial_delay_ms * (multiplier ^ attempt_number) + random(0, jitter_max_ms)
```

Where `attempt_number` is 0-indexed (first retry = attempt 0).

### 2. Error Categorization and Sanitization (`scripts/content-pipeline/utils/errors.ts`)

**Error categories:**

```ts
export enum PipelineErrorCategory {
  RATE_LIMIT = 'rate_limit',           // 429 -> backoff + retry
  API_TIMEOUT = 'api_timeout',         // -> retry once, then fail
  AUTH_ERROR = 'auth_error',           // 401/403 -> fail immediately
  RESEARCH_TIMEOUT = 'research_timeout', // Gemini >5min -> proceed without research
  TRUNCATED_RESPONSE = 'truncated',    // stop_reason max_tokens -> retry with higher limit
  VALIDATION_PARSE = 'validation_parse', // JSON parse fail -> retry validation
  FILE_SYSTEM = 'file_system',         // -> fail immediately
  GIT_FAILURE = 'git_failure',         // -> log error, don't fail batch
  UNKNOWN = 'unknown'                  // -> fail article
}
```

**Categorization function:**

```ts
/**
 * Inspects an error and returns the appropriate PipelineErrorCategory.
 * Checks HTTP status codes, error message patterns, and SDK-specific fields.
 */
export function categorizeError(error: unknown): PipelineErrorCategory;
```

**Sanitization function:**

```ts
/**
 * Removes sensitive information from error messages before logging.
 *
 * Strips:
 * - Anthropic API key patterns (sk-ant-...)
 * - Gemini API key patterns (AI...)
 * - Any values of ANTHROPIC_API_KEY and GEMINI_API_KEY environment variables
 * - Bearer tokens
 *
 * Replaces matched content with "[REDACTED]".
 */
export function sanitizeError(message: string): string;
```

The sanitization function should apply multiple regex patterns sequentially:
1. `sk-ant-[a-zA-Z0-9_-]+` -- Anthropic key pattern
2. `AIza[a-zA-Z0-9_-]+` -- Google API key pattern
3. `Bearer [a-zA-Z0-9._-]+` -- Bearer tokens
4. Exact matches of `process.env.ANTHROPIC_API_KEY` and `process.env.GEMINI_API_KEY` values (if set and non-empty)

### 3. Structured Logger with Cost Tracking (`scripts/content-pipeline/utils/logger.ts`)

**Logger interface:**

```ts
/**
 * Structured logger for the content pipeline.
 * All output goes to stdout. Error messages are sanitized before output.
 * Uses chalk for terminal formatting (imported from dev dependencies).
 */
export const logger: {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
};
```

Every log call should:
1. Prefix with a timestamp (ISO format) and log level
2. If `context` is provided, format key-value pairs on the same line or as structured JSON
3. Run all string values through `sanitizeError` before outputting
4. Use `chalk` for coloring: info = blue/default, warn = yellow, error = red

**Token usage tracker:**

```ts
export class TokenUsageTracker {
  /**
   * Records token usage from a single API call.
   * Accepts either Claude-style or Gemini-style usage objects.
   */
  recordUsage(provider: 'claude' | 'gemini', usage: {
    input_tokens?: number;
    output_tokens?: number;
    promptTokenCount?: number;
    candidatesTokenCount?: number;
  }): void;

  /** Returns usage totals for the current article being tracked. */
  getArticleTotals(): { input_tokens: number; output_tokens: number };

  /** Marks the current article as complete and rolls its totals into the batch accumulator. */
  finalizeArticle(slug: string): void;

  /** Returns cumulative totals across all finalized articles in the batch. */
  getBatchTotals(): {
    articles_count: number;
    total_input_tokens: number;
    total_output_tokens: number;
  };

  /** Resets per-article counters for the next article. Called by finalizeArticle internally. */
  resetArticle(): void;

  /** Logs the current article's token usage via the logger. */
  logArticleSummary(slug: string): void;

  /** Logs the full batch summary via the logger. */
  logBatchSummary(): void;
}
```

**Claude usage extraction:** `response.usage.input_tokens` and `response.usage.output_tokens`.

**Gemini usage extraction:** `response.usageMetadata.promptTokenCount` and `response.usageMetadata.candidatesTokenCount`.

The `recordUsage` method normalizes both formats into `input_tokens` / `output_tokens` internally.

### 4. Integrating Retry into Existing Clients

After creating the utility modules, update existing API clients to use them.

**Gemini client (`scripts/content-pipeline/research/gemini-client.ts`):**
- Wrap interaction creation and polling calls with `retryWithBackoff`
- On `RESEARCH_TIMEOUT` (>5 min), return `null` and log a warning (do not retry)
- On `AUTH_ERROR`, throw immediately with a clear message about `GEMINI_API_KEY`
- After each API response, call `tokenUsageTracker.recordUsage('gemini', response.usageMetadata)` if usage metadata is present

**Claude client (`scripts/content-pipeline/writing/claude-client.ts`):**
- Wrap `messages.create` calls with `retryWithBackoff`
- On `TRUNCATED_RESPONSE` (`stop_reason === "max_tokens"`): retry once with `max_tokens` increased by 50%, then fail if still truncated
- On `AUTH_ERROR`, throw immediately with a clear message about `ANTHROPIC_API_KEY`
- After each API response, call `tokenUsageTracker.recordUsage('claude', response.usage)`

**Validator (`scripts/content-pipeline/validation/validator.ts`):**
- If the Claude response for validation cannot be parsed as JSON (`VALIDATION_PARSE`), retry the validation call (not the whole article generation) up to 2 times
- Log a warning on each parse retry

**Git publisher (`scripts/content-pipeline/output/git-publisher.ts`):**
- Catch all errors from `execFile` calls
- On any git/gh failure: log the error via `logger.error`, but do **not** throw
- The caller (orchestrator) should receive a result indicating publish failure but article success

**Pipeline orchestrator (`scripts/content-pipeline/generate.ts`):**
- Create a `TokenUsageTracker` instance at the start of execution
- Pass it through to the client wrappers (or make it a singleton accessible via import)
- In single mode: call `tracker.logArticleSummary(slug)` after each article completes
- In batch mode: call `tracker.logArticleSummary(slug)` after each article, then `tracker.logBatchSummary()` at the end
- Wrap top-level error handling: catch unhandled errors, sanitize them, log them, and exit with a non-zero code

### 5. Pipeline Config Retry Values

Ensure `scripts/content-pipeline/pipeline.config.ts` exports these retry-related defaults:

```ts
retry: {
  max_retries: Number(process.env.PIPELINE_MAX_RETRIES) || 3,
  initial_delay_ms: Number(process.env.PIPELINE_RETRY_DELAY_MS) || 1000,
  multiplier: 2,
  jitter_max_ms: 500,
},
```

These values should be read by `retryWithBackoff` when no explicit options are passed.

### 6. Smoke Test Documentation

Create `scripts/content-pipeline/README.md` with the smoke test section:

```markdown
## Smoke Test (Manual Verification)

This test verifies end-to-end pipeline functionality against real APIs.
It is NOT automated because it incurs API costs (~$0.10-0.50 per run).

### Prerequisites
- Valid `ANTHROPIC_API_KEY` in `.env`
- Valid `GEMINI_API_KEY` in `.env`
- `gh` CLI authenticated (only if testing --publish)

### Steps

1. Ensure at least one topic YAML file exists in `data/topics/` with a
   known slug (e.g., `building-team-culture-youth` in `coaching.yaml`).

2. Run a dry-run first to verify prompt interpolation:
   ```bash
   npm run generate:article -- --topic building-team-culture-youth --dry-run
   ```
   Verify: Research prompt, outline, and article are printed to stdout.
   No files should be written.

3. Run a full single-article generation:
   ```bash
   npm run generate:article -- --topic building-team-culture-youth --overwrite
   ```
   Verify:
   - Research phase completes (or falls back with warning)
   - Outline is generated
   - Article is written
   - Validation scores are printed (expect overall >= 3.0)
   - MDX file appears at `content/articles/coaching/building-team-culture-youth.mdx`
   - Frontmatter is valid YAML matching the schema
   - Article body is 2000-3000 words
   - Token usage summary is printed

4. Run the matrix report to verify topic tracking:
   ```bash
   npm run generate:matrix
   ```
   Verify: The generated article appears as "existing" in the matrix.

### Expected Outcome
- One MDX file generated with valid frontmatter and body
- Console output shows all pipeline stages completing
- Validation passes on first or second attempt
- Token usage is logged (expect ~2000-5000 input, ~3000-6000 output per article for Claude)
```

### 7. Final Integration Verification Checklist

This checklist should be verified by the implementer after all 9 sections are complete:

- All API calls (Gemini client, Claude client, validator) go through `retryWithBackoff`
- All error log output passes through `sanitizeError` -- no raw API keys can leak
- The `TokenUsageTracker` is integrated into both single and batch modes
- Git publisher failures are caught and logged but do not abort the batch
- `--dry-run` mode never makes API calls beyond the specified stage
- Batch mode saves state after every article (crash resilience)
- `--resume` correctly skips already-completed articles
- The config file exposes all retry parameters with environment variable overrides
- All test files pass: `npm test`
- The smoke test has been run at least once against real APIs and documented outcomes

---

## Implementation Order

1. Write the test file (`__tests__/scripts/content-pipeline/error-handling.test.ts`) with all test stubs listed above
2. Implement `scripts/content-pipeline/utils/retry.ts` -- the retry utility
3. Implement `scripts/content-pipeline/utils/errors.ts` -- error categorization and sanitization
4. Implement `scripts/content-pipeline/utils/logger.ts` -- structured logger and `TokenUsageTracker`
5. Run tests, ensure they pass
6. Modify existing clients (gemini-client, claude-client, validator, git-publisher) to integrate retry, error categorization, sanitization, and token tracking
7. Modify `generate.ts` to wire up `TokenUsageTracker` for per-article and batch summaries
8. Ensure retry config values exist in `pipeline.config.ts`
9. Write `scripts/content-pipeline/README.md` with the smoke test documentation
10. Run the full test suite (`npm test`) to verify nothing is broken across all sections
11. Walk through the final integration verification checklist
