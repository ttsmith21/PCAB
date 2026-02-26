# Section 02: Prompt Templates and Loader

## Overview

This section implements the prompt template infrastructure for the content generation pipeline. It includes:

1. A **prompt loader** module (`scripts/content-pipeline/prompts/prompt-loader.ts`) that reads Markdown template files from disk and performs `{{variable}}` interpolation with bidirectional validation.
2. Five **Markdown prompt template files** stored in `scripts/prompts/` that define the instructions sent to Gemini and Claude at each pipeline stage.
3. **Tests** for the prompt loader (unit tests) and **snapshot tests** that freeze the interpolated output of each prompt template.

This section depends on **section-01-setup** having completed the project foundation (directory structure, dependencies, shared schema, types, npm scripts).

---

## Dependencies

- **section-01-setup**: Provides the directory structure, `types.ts`, `lib/content-schema.ts`, and installed dependencies.
- **Node built-ins**: `fs/promises` for reading template files, `path` for cross-platform path construction.
- No new npm dependencies are introduced by this section.

---

## Files to Create

| File | Purpose |
|------|---------|
| `scripts/content-pipeline/prompts/prompt-loader.ts` | Reads `.md` template files and interpolates `{{variable}}` placeholders |
| `scripts/prompts/system-prompt.md` | Base system prompt for Claude during article writing |
| `scripts/prompts/research-prompt.md` | Instructs Gemini Deep Research on what to research |
| `scripts/prompts/outline-generation.md` | Asks Claude to generate a structured article outline |
| `scripts/prompts/article-generation.md` | Main article writing prompt for Claude |
| `scripts/prompts/alignment-check.md` | Validation prompt with rubric for LLM-as-judge |
| `__tests__/scripts/content-pipeline/prompts/prompt-loader.test.ts` | Unit tests for the prompt loader |
| `__tests__/scripts/content-pipeline/prompts/prompt-snapshots.test.ts` | Snapshot tests for all 5 interpolated prompts |

---

## Tests (Write First)

### Unit Tests: `__tests__/scripts/content-pipeline/prompts/prompt-loader.test.ts`

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("loadPrompt", () => {
  // Test: loadPrompt reads a template file and returns its content
  // Test: loadPrompt throws if file does not exist
});

describe("interpolate", () => {
  // Test: interpolate replaces {{variable}} with provided value
  // Input: "Hello {{name}}", { name: "World" } => "Hello World"

  // Test: interpolate replaces multiple different variables
  // Input: "{{greeting}} {{name}}", { greeting: "Hi", name: "World" } => "Hi World"

  // Test: interpolate replaces same variable appearing multiple times
  // Input: "{{x}} and {{x}}", { x: "A" } => "A and A"

  // Test: interpolate throws on missing variable (template has {{foo}} but no foo provided)
  // Input: "Hello {{foo}}", {} => throws Error mentioning "foo"

  // Test: interpolate throws on extra variable (foo provided but {{foo}} not in template)
  // Input: "Hello world", { foo: "bar" } => throws Error mentioning "foo"

  // Test: interpolate handles empty string values
  // Input: "Before {{x}} after", { x: "" } => "Before  after"

  // Test: interpolate handles multiline values
  // Input: "Start\n{{content}}\nEnd", { content: "line1\nline2" } => "Start\nline1\nline2\nEnd"

  // Test: interpolate does not replace partial matches (e.g., {{foobar}} when foo is provided)
  // Input: "{{foobar}}", { foo: "X", foobar: "Y" } => "Y"
});
```

### Snapshot Tests: `__tests__/scripts/content-pipeline/prompts/prompt-snapshots.test.ts`

```ts
import { describe, it, expect } from "vitest";

// Define a set of known test inputs covering all variables used across templates.

describe("Prompt snapshot tests", () => {
  // Test: system-prompt.md interpolated with known inputs matches snapshot
  // Test: research-prompt.md interpolated with known inputs matches snapshot
  // Test: outline-generation.md interpolated with known inputs matches snapshot
  // Test: article-generation.md interpolated with known inputs matches snapshot
  // Test: alignment-check.md interpolated with known inputs matches snapshot
});
```

These snapshot tests serve as a review checkpoint: if any prompt template is modified, the corresponding snapshot fails and the developer must intentionally update it with `vitest --update`.

---

## Implementation Details

### Prompt Loader: `scripts/content-pipeline/prompts/prompt-loader.ts`

This module exports two functions:

**`loadPrompt(templateName: string): Promise<string>`**

- Reads a Markdown file from `scripts/prompts/{templateName}` using `fs/promises.readFile` with `utf-8` encoding.
- Constructs the path using `path.resolve()` relative to the project root for Windows compatibility.
- Returns the raw template string.
- Throws a descriptive error if the file does not exist, including the resolved path.

**`interpolate(template: string, variables: Record<string, string>): string`**

- Finds all `{{variableName}}` patterns in the template using a regex like `/\{\{(\w+)\}\}/g`.
- Performs **bidirectional validation**:
  1. **Missing variable check**: Collects all unique variable names found in the template. If any variable name does not have a corresponding key in the `variables` object, throws an error listing the missing variables.
  2. **Extra variable check**: Checks that every key in the `variables` object corresponds to at least one `{{key}}` occurrence in the template. If any key has no corresponding placeholder, throws an error listing the extra variables.
- After validation passes, performs replacement.
- Empty string values are valid. Multiline values are inserted as-is.

### Prompt Template Files

#### 1. `scripts/prompts/system-prompt.md`

**Purpose**: Base system prompt for Claude during article writing.

**Variables**: None typically (static system prompt).

**Content guidance** (~500-1000 words):
- **Persona**: Expert content writer specializing in youth athletic development for Port Clinton Athletic Boosters.
- **Voice**: Warm, authoritative, evidence-based. Avoids jargon. Uses "you" language.
- **Content constraints**: No medical advice, no sport-specific tactical instructions, no PII about minors. Cite sources.
- **Output format**: MDX with YAML frontmatter matching the exact schema.
- **Length target**: 2,000-3,000 words.
- **Structure**: Subheadings every 300-400 words, practical takeaways per section.
- **Philosophical alignment**: Character-first, process over outcomes, multi-sport encouraged, age-appropriate progression, no early specialization pressure, voluntary hardship and earned confidence.

#### 2. `scripts/prompts/research-prompt.md`

**Purpose**: Sent to Gemini Deep Research.

**Variables**: `{{topic_title}}`, `{{topic_description}}`, `{{topic_category}}`, `{{topic_audiences}}`, `{{topic_age_groups}}`, `{{outline_notes}}`

**Content guidance**: Research evidence-based approaches. Prioritize LTAD, PCA, NFHS, ADM frameworks. Seek practical examples. Focus on age-appropriate considerations. Avoid tactical content and medical advice. Use `{{outline_notes}}` to focus research.

#### 3. `scripts/prompts/outline-generation.md`

**Purpose**: Asks Claude to generate a structured outline.

**Variables**: `{{topic_title}}`, `{{topic_description}}`, `{{topic_category}}`, `{{topic_audiences}}`, `{{topic_difficulty}}`, `{{topic_age_groups}}`, `{{topic_themes}}`, `{{topic_content_type}}`, `{{topic_pillars}}`, `{{outline_notes}}`, `{{research_report}}`, `{{frontmatter_schema}}`

**Content guidance**: Request 5-8 sections with headings, key points, word counts. Request proposed frontmatter values. Use `{{outline_notes}}` for structural guidance.

#### 4. `scripts/prompts/article-generation.md`

**Purpose**: Main article writing prompt.

**Variables**: `{{topic_title}}`, `{{topic_description}}`, `{{topic_category}}`, `{{topic_audiences}}`, `{{topic_difficulty}}`, `{{research_report}}`, `{{outline}}`, `{{frontmatter_schema}}`, `{{content_guidelines}}`, `{{citation_format}}`

**Content guidance**: Write full article following outline. Output begins with YAML frontmatter block. Set `generated_by: ai-generated`, `last_reviewed` to today. Include sources from research.

#### 5. `scripts/prompts/alignment-check.md`

**Purpose**: Validation prompt for LLM-as-judge.

**Variables**: `{{article}}`, `{{rubric_definition}}`, `{{pc_way_principles}}`

**Content guidance**: Evaluate against 5 dimensions independently. Score 1-4 per dimension. Return valid JSON matching RubricScores structure. Do NOT calculate `overall` or `pass` (computed server-side).

---

## Design Decisions

### Why Bidirectional Validation

Extra-variable check catches stale templates and typos in variable names that unidirectional validation would miss.

### Why Markdown Files for Prompts

- Clean Git diffs
- Snapshot safety via tests
- Editor support (syntax highlighting, spell-check)
- Non-developer accessibility for prompt review

### Why Snapshot Tests

Every prompt change is intentional (must run `vitest --update`), visible in code review, and documented via snapshot files.

---

## Integration Points

- **section-04-gemini**: Calls `loadPrompt("research-prompt.md")` and `interpolate()`.
- **section-05-claude**: Calls `loadPrompt("system-prompt.md")`, `loadPrompt("outline-generation.md")`, `loadPrompt("article-generation.md")` with `interpolate()`.
- **section-06-validation**: Calls `loadPrompt("alignment-check.md")` and `interpolate()`.
