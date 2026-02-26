# Section 05: Claude Article Writing

## Overview

This section implements the Claude API integration for the content generation pipeline. Three components:

1. **Claude Client** (`scripts/content-pipeline/writing/claude-client.ts`) -- wrapper around `@anthropic-ai/sdk` handling adaptive thinking, streaming, token/rate limit handling, and truncation detection.
2. **Outline Service** (`scripts/content-pipeline/writing/outline-service.ts`) -- generates structured article outline from research findings.
3. **Article Service** (`scripts/content-pipeline/writing/article-service.ts`) -- generates full MDX article with frontmatter from outline and research.

## Dependencies

- **section-01-setup**: `@anthropic-ai/sdk` installed, directory structure, shared Zod schema, types, pipeline config.
- **section-02-prompts**: Prompt loader and template files (`system-prompt.md`, `outline-generation.md`, `article-generation.md`).

**Blocks:** section-06-validation, section-07-orchestration.

## Files to Create

| File | Purpose |
|------|---------|
| `scripts/content-pipeline/writing/claude-client.ts` | Claude API wrapper |
| `scripts/content-pipeline/writing/outline-service.ts` | Outline generation service |
| `scripts/content-pipeline/writing/article-service.ts` | Full article generation service |
| `__tests__/scripts/content-pipeline/writing/claude-client.test.ts` | Claude client tests |
| `__tests__/scripts/content-pipeline/writing/outline-service.test.ts` | Outline service tests |
| `__tests__/scripts/content-pipeline/writing/article-service.test.ts` | Article service tests |

## Tests (Write First)

### `__tests__/scripts/content-pipeline/writing/claude-client.test.ts`

```ts
vi.mock('@anthropic-ai/sdk');

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
vi.mock('@/scripts/content-pipeline/writing/claude-client');
vi.mock('@/scripts/content-pipeline/prompts/prompt-loader');

// Test: generateOutline loads outline prompt template
// Test: generateOutline interpolates topic metadata including outline_notes
// Test: generateOutline parses Claude response into structured outline
// Test: generateOutline returns sections with titles, word counts, key points
// Test: generateOutline includes frontmatter values derived from topic
// Test: generateOutline handles missing research report (null) gracefully
```

### `__tests__/scripts/content-pipeline/writing/article-service.test.ts`

```ts
vi.mock('@/scripts/content-pipeline/writing/claude-client');
vi.mock('@/scripts/content-pipeline/prompts/prompt-loader');

// Test: generateArticle loads system prompt and article prompt templates
// Test: generateArticle interpolates research report, outline, and metadata
// Test: generateArticle extracts frontmatter YAML block from response
// Test: generateArticle extracts MDX body from response
// Test: generateArticle validates frontmatter against shared Zod schema
// Test: generateArticle returns full MDX string (frontmatter + body)
// Test: generateArticle rejects response with invalid frontmatter
// Test: generateArticle handles response without frontmatter block
```

## Implementation Details

### Claude Client (`scripts/content-pipeline/writing/claude-client.ts`)

```ts
export class ClaudeClient {
  constructor(apiKey?: string);
  sendMessage(params: {
    systemPrompt: string;
    userMessage: string;
    model?: string;
    maxTokens?: number;
    thinkingBudget?: number;
  }): Promise<{ text: string; stopReason: string; usage: { inputTokens: number; outputTokens: number } }>;
}
```

**Initialization:** Read `ANTHROPIC_API_KEY` from `process.env`. Throw clear error if missing.

**`sendMessage`:**
- Call `client.messages.create()` with adaptive thinking (`{ type: "enabled", budget_tokens }`)
- Check `stop_reason`: `"end_turn"` = normal, `"max_tokens"` = truncated (retry with doubled max_tokens)
- 401/403: throw immediately (no retry). 429: propagate for upstream backoff handling.

### Outline Service (`scripts/content-pipeline/writing/outline-service.ts`)

```ts
export interface ArticleOutline {
  title: string;
  sections: Array<{
    heading: string;
    target_word_count: number;
    key_points: string[];
    sources_to_cite: string[];
  }>;
  frontmatter: Partial<ArticleFrontmatter>;
  total_target_words: number;
}

export async function generateOutline(
  topic: TopicDefinition,
  research: string | null,
  client: ClaudeClient,
  config: PipelineConfig
): Promise<ArticleOutline>;
```

**Flow:**
1. Load outline prompt template.
2. Interpolate: title, description, category, audiences, difficulty, outline_notes (empty string if absent), research_report (fallback if null), age_groups, sports, themes, pillars, content_type, frontmatter_schema.
3. Call Claude with thinking budget 4096.
4. Parse response into `ArticleOutline`.

**`outline_notes`**: Prominently placed in prompt to steer outline structure.

### Article Service (`scripts/content-pipeline/writing/article-service.ts`)

```ts
export async function generateArticle(
  topic: TopicDefinition,
  research: string | null,
  outline: ArticleOutline,
  client: ClaudeClient,
  config: PipelineConfig
): Promise<{ mdx: string; frontmatter: ArticleFrontmatter }>;
```

**Flow:**
1. Load system prompt and article generation prompt.
2. Interpolate article prompt with: title, description, category, audiences, difficulty, research_report, outline (serialized), frontmatter_schema, content_guidelines, citation_format.
3. Call Claude with system prompt, thinking budget 8192.
4. Parse response with `gray-matter` to separate frontmatter from body.
5. Validate frontmatter against `articleFrontmatterSchema.safeParse()`.
6. Return full MDX string and parsed frontmatter.

**Error cases:** Missing frontmatter block (no `---` delimiters) throws. Invalid schema throws with Zod error details.

## Key Design Decisions

1. **Adaptive thinking** improves quality for complex, multi-requirement articles.
2. **`gray-matter`** handles YAML parsing edge cases that naive regex would miss.
3. **Schema validation in article service** catches structural issues before expensive LLM validation.
4. **Separate outline and article steps** produces better quality and enables `--dry-run outline`.
5. **`ClaudeClient` is reused by validator** (section-06), so design is generic.
