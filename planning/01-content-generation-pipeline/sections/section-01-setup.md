# Section 01: Project Setup & Configuration

This section establishes the entire project foundation for the content generation pipeline. It covers dependency installation, directory structure creation, the shared Zod schema for article frontmatter, all TypeScript type definitions, the pipeline configuration file, npm scripts, environment variable setup, and `.gitignore` additions. Every subsequent section depends on the artifacts created here.

**No other sections need to be completed before this one.** This section blocks all others.

---

## Tests First

The TDD plan specifies that section 01 itself has no behavioral tests -- "validated by subsequent sections' tests importing correctly." However, the shared schema and types defined here do have tests. Write these tests before implementing the schema and types.

### Test File: `C:\GitHub\PCAB\__tests__\lib\content-schema.test.ts`

This test file validates the Zod schema exported from `lib/content-schema.ts`. The schema is the single source of truth shared between the content pipeline (this split) and the knowledge base platform (split 03).

```ts
import { articleFrontmatterSchema, type ArticleFrontmatter } from "@/lib/content-schema";

describe("articleFrontmatterSchema", () => {
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
});
```

Each test should call `articleFrontmatterSchema.safeParse(input)` with appropriate valid or invalid input and assert on `success` being `true` or `false`. For the type-level test, use a `satisfies ArticleFrontmatter` assertion on a known-good object literal to verify the inferred type has the expected shape at compile time.

**Valid frontmatter fixture** (use in tests throughout the project):

```ts
const validFrontmatter = {
  title: "Building Team Culture at the Youth Level",
  slug: "building-team-culture-youth",
  description: "How volunteer coaches can create a positive team culture from day one",
  category: "coaching",
  pillar: ["character-development", "retention"],
  sport: ["general"],
  age_group: ["youth"],
  audience: ["coaches", "parents"],
  difficulty: "beginner",
  content_type: "guide",
  theme: ["leadership", "communication", "inclusion"],
  last_reviewed: "2026-02-26",
  generated_by: "ai-generated",
  sources: [
    {
      title: "Positive Coaching Alliance",
      url: "https://positivecoach.org",
      accessed: "2026-02-26",
    },
  ],
};
```

### Test File: `C:\GitHub\PCAB\__tests__\scripts\content-pipeline\types.test.ts`

These are lightweight sanity tests confirming that the type definitions and any runtime validation helpers work correctly.

```ts
import type {
  TopicDefinition,
  GenerationResult,
  RubricScores,
  PipelineConfig,
} from "@/scripts/content-pipeline/types";

describe("Pipeline types", () => {
  // Test: TopicDefinition type accepts valid topic with all fields
  // Test: TopicDefinition type allows optional outline_notes
  // Test: GenerationResult type accepts success status with article
  // Test: GenerationResult type accepts validation_failed status with scores
  // Test: GenerationResult type accepts error status with error message
  // Test: RubricScores overall calculation matches weighted sum
  // Test: PipelineConfig has sensible defaults
});
```

Since these are primarily TypeScript interfaces (not Zod schemas), most tests are compile-time assertions using `satisfies`. For `RubricScores`, include a runtime test that manually calculates the weighted sum to verify the formula documented in the types matches expectations. For `PipelineConfig`, import the default config from `pipeline.config.ts` and assert on its default values.

---

## Implementation Details

### Step 1: Install Dependencies

Run the following in the project root (`C:\GitHub\PCAB`):

**Production dependencies:**
```
npm install @anthropic-ai/sdk @google/genai gray-matter zod dotenv js-yaml commander
```

**Dev dependencies:**
```
npm install -D tsx chalk @types/js-yaml
```

The project already uses Vitest, TypeScript, and has the `@` path alias configured. No changes needed to the test infrastructure.

Note: `zod` may or may not already be present. If split 03 has added it, the install is a no-op. Install it regardless.

### Step 2: Create Directory Structure

Create the following directories (all paths relative to `C:\GitHub\PCAB`):

```
scripts/
  content-pipeline/
    research/
    writing/
    validation/
    topics/
    state/
    prompts/
    output/
  prompts/
data/
  topics/
content/
  articles/
```

Also create the test directory:
```
__tests__/
  scripts/
    content-pipeline/
  lib/
```

Note: `__tests__/lib/` already exists (contains `constants.test.ts`). The `__tests__/scripts/content-pipeline/` tree is new.

Each directory should contain the appropriate files as listed below. Empty directories that have no files yet should get a `.gitkeep` file so they are tracked by Git. Specifically, these directories will be populated by later sections but need to exist now:
- `scripts/content-pipeline/research/`
- `scripts/content-pipeline/writing/`
- `scripts/content-pipeline/validation/`
- `scripts/content-pipeline/topics/`
- `scripts/content-pipeline/state/`
- `scripts/content-pipeline/prompts/`
- `scripts/content-pipeline/output/`
- `scripts/prompts/`
- `data/topics/`
- `content/articles/`

### Step 3: Create `.env.example`

**File:** `C:\GitHub\PCAB\.env.example`

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
GEMINI_API_KEY=your-gemini-key-here
```

The existing `.gitignore` already has the pattern `.env*` which covers `.env` files. However, `.env.example` is intended to be committed. The current pattern `.env*` would gitignore it. You must add an exception to `.gitignore` so `.env.example` is tracked.

### Step 4: Update `.gitignore`

**File:** `C:\GitHub\PCAB\.gitignore`

Add the following lines (at the end of the file, or in the appropriate section):

```
# content pipeline state (resumable batch state, not committed)
.content-pipeline-state/

# allow .env.example to be committed (overrides .env* pattern above)
!.env.example
```

The `.env*` pattern already present in `.gitignore` covers `.env` itself. The `!.env.example` exception ensures the example file is committed.

### Step 5: Create Shared Zod Schema

**File:** `C:\GitHub\PCAB\lib\content-schema.ts`

This is the single source of truth for article frontmatter. Both the pipeline (this split) and the Velite config (split 03) import from this file.

Export two things:
1. `articleFrontmatterSchema` -- a Zod object schema
2. `ArticleFrontmatter` -- the inferred TypeScript type (`z.infer<typeof articleFrontmatterSchema>`)

**Schema fields and their Zod types:**

- `title` -- `z.string().min(1)` -- Article title
- `slug` -- `z.string().regex(/^[a-z0-9-]+$/)` -- URL-safe identifier
- `description` -- `z.string().min(1)` -- Short summary for SEO/previews
- `category` -- `z.enum(["coaching", "parenting", "development", "community", "resources", "pc-way"])` -- Primary content domain
- `pillar` -- `z.array(z.enum(["character-development", "retention", "community-building", "athletic-excellence", "family-engagement"]))` -- PC Way alignment pillars
- `sport` -- `z.array(z.string())` -- Applicable sports (empty array = general/all)
- `age_group` -- `z.array(z.string())` -- Target age groups
- `audience` -- `z.array(z.enum(["parents", "coaches", "volunteers", "youth-leaders", "athletes"]))` -- Target reader audience(s)
- `difficulty` -- `z.enum(["beginner", "intermediate", "advanced"])` -- Content complexity level
- `content_type` -- `z.enum(["guide", "article", "checklist", "framework", "case-study", "faq"])` -- Format of the content
- `theme` -- `z.array(z.string())` -- Thematic tags for cross-referencing
- `last_reviewed` -- `z.string()` -- ISO date string (YYYY-MM-DD) of last review
- `generated_by` -- `z.enum(["human", "ai-assisted", "ai-generated"])` -- Content provenance
- `sources` -- `z.array(z.object({ title: z.string(), url: z.string().url(), accessed: z.string() }))` -- Citation sources

The schema should use `.strict()` so that unknown/extra fields cause validation failure. This ensures the pipeline and Velite stay in sync on the exact shape.

### Step 6: Create Pipeline Types

**File:** `C:\GitHub\PCAB\scripts\content-pipeline\types.ts`

Define the following TypeScript interfaces and types. Import `ArticleFrontmatter` from `@/lib/content-schema` for use in `GenerationResult`.

**`TopicDefinition`:**
```ts
export interface TopicDefinition {
  slug: string;
  title: string;
  category: string;
  audiences: string[];
  difficulty: string;
  age_groups: string[];
  sports: string[];
  themes: string[];
  content_type: string;
  pillars: string[];
  description: string;
  outline_notes?: string;
}
```

**`GenerationResult`:**
```ts
export interface GenerationResult {
  topic_slug: string;
  status: "success" | "validation_failed" | "error";
  article: string | null;
  frontmatter: ArticleFrontmatter | null;
  validation_scores: RubricScores | null;
  error: string | null;
  attempts: number;
  duration_ms: number;
}
```

**`RubricScores`:**
```ts
export interface RubricScores {
  factual_accuracy: number;
  values_alignment: number;
  audience_appropriateness: number;
  actionability: number;
  writing_quality: number;
  overall: number;
  pass: boolean;
  reasoning: Record<string, string>;
  recommendations: string[];
}
```

**`BatchState`:**
```ts
export interface BatchState {
  batch_id: string;
  started_at: string;
  topics: Array<{
    slug: string;
    status: "pending" | "completed" | "failed";
    attempts: number;
    last_error?: string;
  }>;
  completed_count: number;
  failed_count: number;
  pending_count: number;
}
```

**`PipelineConfig`:**
```ts
export interface PipelineConfig {
  research_model: string;
  outline_model: string;
  writing_model: string;
  validation_model: string;
  max_tokens: number;
  validation_threshold: number;
  max_attempts: number;
  retry_delay_ms: number;
  batch_concurrency: number;
  output_dir: string;
}
```

### Step 7: Create Pipeline Configuration

**File:** `C:\GitHub\PCAB\scripts\content-pipeline\pipeline.config.ts`

This file exports a `getConfig()` function that returns a `PipelineConfig` object. Each field has a sensible default but can be overridden via environment variables for CI/customization.

**Default values:**
- `research_model`: `"deep-research-pro-preview-12-2025"` (override: `PIPELINE_RESEARCH_MODEL`)
- `outline_model`: `"claude-sonnet-4-6"` (override: `PIPELINE_OUTLINE_MODEL`)
- `writing_model`: `"claude-sonnet-4-6"` (override: `PIPELINE_WRITING_MODEL`)
- `validation_model`: `"claude-sonnet-4-6"` (override: `PIPELINE_VALIDATION_MODEL`)
- `max_tokens`: `8192` (override: `PIPELINE_MAX_TOKENS`)
- `validation_threshold`: `3.0` (override: `PIPELINE_VALIDATION_THRESHOLD`)
- `max_attempts`: `3` (override: `PIPELINE_MAX_ATTEMPTS`)
- `retry_delay_ms`: `1000` (override: `PIPELINE_RETRY_DELAY_MS`)
- `batch_concurrency`: `1` (override: `PIPELINE_BATCH_CONCURRENCY`)
- `output_dir`: `"content/articles"` (override: `PIPELINE_OUTPUT_DIR`)

Use `dotenv` to load `.env` at the top of this module. Parse numeric overrides with `parseInt`/`parseFloat` and fall back to defaults if the env var is not set or not a valid number.

Export both the `getConfig` function and a `DEFAULT_CONFIG` constant (for testing).

### Step 8: Add npm Scripts to `package.json`

Add the following scripts to the `"scripts"` block:

```json
"generate:article": "tsx scripts/content-pipeline/generate.ts --mode single",
"generate:batch": "tsx scripts/content-pipeline/generate.ts --mode batch",
"generate:status": "tsx scripts/content-pipeline/generate.ts --mode status",
"generate:matrix": "tsx scripts/content-pipeline/generate.ts --mode matrix"
```

### Step 9: Create Stub CLI Entry Point

**File:** `C:\GitHub\PCAB\scripts\content-pipeline\generate.ts`

Create a minimal stub so that the npm scripts do not error out before section 07 is implemented:

```ts
#!/usr/bin/env node
console.log("Content pipeline CLI - not yet implemented. See section-07-orchestration.");
process.exit(0);
```

This will be replaced entirely by section 07.

---

## File Summary

Files **created** by this section:

| File Path | Purpose |
|-----------|---------|
| `.env.example` | API key placeholders for developer setup |
| `lib/content-schema.ts` | Shared Zod schema for article frontmatter |
| `scripts/content-pipeline/types.ts` | All TypeScript interfaces for the pipeline |
| `scripts/content-pipeline/pipeline.config.ts` | Pipeline configuration with env var overrides |
| `scripts/content-pipeline/generate.ts` | Stub CLI entry point (replaced by section 07) |
| `__tests__/lib/content-schema.test.ts` | Schema validation tests |
| `__tests__/scripts/content-pipeline/types.test.ts` | Type shape and default config tests |

Files **modified** by this section:

| File Path | Change |
|-----------|--------|
| `package.json` | Add production deps, dev deps, and 4 npm scripts |
| `.gitignore` | Add `.content-pipeline-state/` and `!.env.example` exception |

Directories **created** by this section (with `.gitkeep` where no files exist yet):

- `scripts/content-pipeline/` (and all subdirectories: `research/`, `writing/`, `validation/`, `topics/`, `state/`, `prompts/`, `output/`)
- `scripts/prompts/`
- `data/topics/`
- `content/articles/`
- `__tests__/scripts/content-pipeline/`

---

## Verification Checklist

After completing this section, verify:

1. `npm install` succeeds with all new dependencies in `node_modules/`
2. `npx tsx --version` runs successfully (tsx is installed)
3. `npm run generate:article` prints the stub message and exits cleanly
4. `npm test` still passes all existing tests (no regressions)
5. The new test files run and pass
6. `.env.example` is tracked by Git (check `git status` -- it should NOT appear as ignored)
7. `.content-pipeline-state/` is ignored by Git
8. The `@/lib/content-schema` import path resolves correctly
9. `lib/content-schema.ts` compiles without errors and exports both `articleFrontmatterSchema` and `ArticleFrontmatter`
10. `scripts/content-pipeline/types.ts` compiles without errors and exports all five interfaces
