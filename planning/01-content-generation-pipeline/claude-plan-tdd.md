# TDD Plan: Content Generation Pipeline

Test-first companion to `claude-plan.md`. For each implementation section, defines what tests to write BEFORE implementing.

**Testing framework:** Vitest (existing in project)
**Test location:** `__tests__/scripts/content-pipeline/` mirroring source structure
**Conventions:** `vi.mock` for dependencies, descriptive test names, `data-testid` for any UI (none expected here)

---

## 1. Project Setup & Configuration

No tests for this section — it's dependency installation, directory creation, and configuration. Validated by subsequent sections' tests importing correctly.

---

## 2. Shared Schema & Types

### `__tests__/lib/content-schema.test.ts`

```ts
// Test: articleFrontmatterSchema accepts valid frontmatter with all required fields
// Test: articleFrontmatterSchema rejects missing title
// Test: articleFrontmatterSchema rejects missing category
// Test: articleFrontmatterSchema rejects invalid category enum value
// Test: articleFrontmatterSchema rejects invalid pillar enum value
// Test: articleFrontmatterSchema accepts valid pillar array with multiple values
// Test: articleFrontmatterSchema accepts empty sport array
// Test: articleFrontmatterSchema accepts empty age_group array
// Test: articleFrontmatterSchema rejects invalid difficulty enum
// Test: articleFrontmatterSchema rejects invalid content_type enum
// Test: articleFrontmatterSchema validates sources as array of {title, url, accessed}
// Test: articleFrontmatterSchema rejects source with missing url
// Test: articleFrontmatterSchema validates last_reviewed as ISO date string
// Test: articleFrontmatterSchema validates generated_by enum (human | ai-assisted | ai-generated)
// Test: inferred ArticleFrontmatter type matches expected shape (type-level test via satisfies)
```

### `__tests__/scripts/content-pipeline/types.test.ts`

```ts
// Test: TopicDefinition type accepts valid topic with all fields
// Test: TopicDefinition type allows optional outline_notes
// Test: GenerationResult type accepts success status with article
// Test: GenerationResult type accepts validation_failed status with scores
// Test: GenerationResult type accepts error status with error message
// Test: RubricScores overall calculation matches weighted sum
// Test: PipelineConfig has sensible defaults
```

---

## 3. Prompt Templates & Loader

### `__tests__/scripts/content-pipeline/prompts/prompt-loader.test.ts`

```ts
// Test: loadPrompt reads a template file and returns its content
// Test: loadPrompt throws if file does not exist
// Test: interpolate replaces {{variable}} with provided value
// Test: interpolate replaces multiple different variables
// Test: interpolate replaces same variable appearing multiple times
// Test: interpolate throws on missing variable (template has {{foo}} but no foo provided)
// Test: interpolate throws on extra variable (foo provided but {{foo}} not in template)
// Test: interpolate handles empty string values
// Test: interpolate handles multiline values
// Test: interpolate does not replace partial matches (e.g., {{foobar}} when foo is provided)
```

### `__tests__/scripts/content-pipeline/prompts/prompt-snapshots.test.ts`

```ts
// Test: system-prompt.md interpolated with known inputs matches snapshot
// Test: research-prompt.md interpolated with known inputs matches snapshot
// Test: outline-generation.md interpolated with known inputs matches snapshot
// Test: article-generation.md interpolated with known inputs matches snapshot
// Test: alignment-check.md interpolated with known inputs matches snapshot
```

---

## 4. Topic Management & Content Matrix

### `__tests__/scripts/content-pipeline/topics/topic-loader.test.ts`

```ts
// Test: loadTopics reads all YAML files from topics directory
// Test: loadTopics returns flat array of TopicDefinition objects
// Test: loadTopics validates required fields (slug, title, category)
// Test: loadTopics rejects topic with invalid slug (contains spaces)
// Test: loadTopics rejects topic with invalid slug (contains uppercase)
// Test: loadTopics rejects topic with invalid slug (contains special chars)
// Test: loadTopics accepts valid slug (lowercase alphanumeric with hyphens)
// Test: loadTopics validates category against enum values
// Test: loadTopics handles empty YAML file gracefully
// Test: loadTopics handles malformed YAML (syntax error) with clear error
// Test: filterTopics by category returns only matching topics
// Test: filterTopics by audience returns topics containing that audience
// Test: filterTopics by difficulty returns only matching topics
// Test: loadTopics handles optional outline_notes field (present and absent)
```

### `__tests__/scripts/content-pipeline/topics/content-matrix.test.ts`

```ts
// Test: buildMatrix creates correct dimensions (category x audience x difficulty)
// Test: buildMatrix counts defined topics per cell
// Test: buildMatrix counts existing articles per cell (from MDX frontmatter)
// Test: identifyGaps returns cells where actual < target (target = defined topic count)
// Test: identifyGaps returns empty array when all cells are covered
// Test: suggestNext returns topics from most underserved cells first
// Test: suggestNext respects count parameter
// Test: generateReport includes planned vs actual counts per cell
// Test: generateReport includes difficulty distribution analysis
// Test: buildMatrix handles empty topic list
// Test: buildMatrix handles empty article directory
// Test: buildMatrix handles topics with multiple audiences (counted in each cell)
```

---

## 5. Gemini Research Integration

### `__tests__/scripts/content-pipeline/research/gemini-client.test.ts`

```ts
// Test: GeminiClient initializes with API key from environment
// Test: GeminiClient throws clear error if GEMINI_API_KEY is missing
// Test: startResearch creates an interaction with correct agent model
// Test: startResearch passes the research prompt correctly
// Test: pollForCompletion returns result when interaction is complete
// Test: pollForCompletion times out after configured max duration (5 min)
// Test: pollForCompletion respects poll interval configuration
// Test: extractReport returns the research text from interaction outputs
// Test: extractReport returns null on empty outputs
// Test: fallback to standard Gemini generation when Interactions API fails
// Test: fallback generates research-oriented prompt and returns result
```

### `__tests__/scripts/content-pipeline/research/research-service.test.ts`

```ts
// Test: researchTopic loads and interpolates research prompt template
// Test: researchTopic passes topic title, description, category, audience, outline_notes to template
// Test: researchTopic returns research report string on success
// Test: researchTopic retries once on failure then returns null
// Test: researchTopic logs warning when returning null (no research)
// Test: researchTopic respects timeout configuration
```

---

## 6. Claude Writing Integration

### `__tests__/scripts/content-pipeline/writing/claude-client.test.ts`

```ts
// Test: ClaudeClient initializes with API key from environment
// Test: ClaudeClient throws clear error if ANTHROPIC_API_KEY is missing
// Test: sendMessage sends with adaptive thinking enabled
// Test: sendMessage handles rate limit (429) with backoff
// Test: sendMessage detects truncated response (stop_reason === "max_tokens")
// Test: sendMessage retries truncated response with higher max_tokens
// Test: sendMessage handles API auth error (401) without retry
```

### `__tests__/scripts/content-pipeline/writing/outline-service.test.ts`

```ts
// Test: generateOutline loads outline prompt template
// Test: generateOutline interpolates topic metadata including outline_notes
// Test: generateOutline parses Claude response into structured outline
// Test: generateOutline returns sections with titles, word counts, key points
// Test: generateOutline includes frontmatter values derived from topic
// Test: generateOutline handles missing research report (null) gracefully
```

### `__tests__/scripts/content-pipeline/writing/article-service.test.ts`

```ts
// Test: generateArticle loads system prompt and article prompt templates
// Test: generateArticle interpolates research report, outline, and metadata
// Test: generateArticle extracts frontmatter YAML block from response
// Test: generateArticle extracts MDX body from response
// Test: generateArticle validates frontmatter against shared Zod schema
// Test: generateArticle returns full MDX string (frontmatter + body)
// Test: generateArticle rejects response with invalid frontmatter
// Test: generateArticle handles response without frontmatter block
```

---

## 7. Alignment Validation

### `__tests__/scripts/content-pipeline/validation/rubric.test.ts`

```ts
// Test: calculateOverallScore returns correct weighted sum
// Test: calculateOverallScore with all 4s returns 4.0
// Test: calculateOverallScore with all 1s returns 1.0
// Test: calculateOverallScore with mixed scores returns correct weighted value
// Test: isPass returns true when overall >= 3.0
// Test: isPass returns false when overall < 3.0
// Test: isPass returns false when any single dimension scores 1 (auto-fail)
// Test: isPass returns false when dimension is 1 even if overall >= 3.0
// Test: RUBRIC_DIMENSIONS has correct weights summing to 1.0
// Test: RUBRIC_DIMENSIONS defines 5 dimensions
```

### `__tests__/scripts/content-pipeline/validation/validator.test.ts`

```ts
// Test: validateArticle loads alignment check prompt template
// Test: validateArticle interpolates article, rubric, and PC Way principles
// Test: validateArticle parses JSON response into RubricScores
// Test: validateArticle calculates pass/fail correctly
// Test: validateArticle returns per-dimension reasoning
// Test: validateArticle returns recommendations array
// Test: validateArticle retries on JSON parse failure
// Test: validateArticle fails article after retry limit on parse errors
// Test: generateFeedback extracts failing dimensions and reasoning
// Test: generateFeedback creates regeneration prompt with specific feedback
```

---

## 8. Pipeline Orchestration

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
// Test: generateArticle (mocked APIs) runs full pipeline: research → outline → write → validate
// Test: generateArticle returns success with article and scores when validation passes
// Test: generateArticle retries writing when validation fails
// Test: generateArticle returns validation_failed after max_attempts exceeded
// Test: generateArticle returns error on API failure
// Test: generateArticle proceeds without research when Gemini fails (returns null)
// Test: generateArticle respects dry-run flag (stops at specified stage, no file writes)
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
// Test: getBatchSummary returns correct counts (completed, failed, pending)
```

---

## 9. Output & Publishing

### `__tests__/scripts/content-pipeline/output/mdx-writer.test.ts`

```ts
// Test: writeArticle creates correct path: content/articles/{category}/{slug}.mdx
// Test: writeArticle creates category directory if it doesn't exist
// Test: writeArticle writes frontmatter + body as file content
// Test: writeArticle returns the written file path
// Test: writeArticle uses path.join for cross-platform path construction
// Test: writeArticle throws on file system error
```

### `__tests__/scripts/content-pipeline/output/git-publisher.test.ts`

```ts
// Test: createBranch uses execFile (not exec) to run git commands
// Test: createBranch generates correct branch name for single: content/{category}/{slug}
// Test: createBranch generates correct branch name for batch: content/batch/{batch-id}
// Test: createPR calls gh pr create with correct title and body
// Test: createPR includes validation scores in PR description
// Test: publisher passes arguments as arrays, not interpolated strings
// Test: publisher rejects slug that doesn't match /^[a-z0-9-]+$/
// Test: publisher normalizes file paths for Windows compatibility
// Test: publisher logs error but doesn't throw on git failure
```

---

## 10. Polish (Error Handling & Logging)

### `__tests__/scripts/content-pipeline/error-handling.test.ts`

```ts
// Test: retryWithBackoff retries on 429 with exponential delay
// Test: retryWithBackoff respects Retry-After header
// Test: retryWithBackoff adds jitter to delay
// Test: retryWithBackoff gives up after max retries
// Test: retryWithBackoff does not retry on 401/403
// Test: sanitizeError removes API key patterns from error messages
// Test: sanitizeError removes environment variable values from error messages
// Test: logTokenUsage extracts usage from Claude API response
// Test: logTokenUsage extracts usage from Gemini API response
// Test: logTokenUsage accumulates batch totals correctly
```
