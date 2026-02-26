# Section 04: Gemini Deep Research Integration

## Overview

This section implements the Gemini Deep Research integration layer that powers the research phase of the content generation pipeline. It consists of two modules:

1. **Gemini Client** (`scripts/content-pipeline/research/gemini-client.ts`) -- A wrapper around the `@google/genai` SDK that manages Deep Research interactions, polling, and fallback logic.
2. **Research Service** (`scripts/content-pipeline/research/research-service.ts`) -- An orchestrator that loads and interpolates the research prompt template, calls the Gemini client, and handles retry/fallback behavior.

The research phase is the first step in the article generation pipeline. For each topic, Gemini Deep Research reads 100+ web pages and produces a comprehensive research report. This report is then passed to the Claude-based outline and article writing stages (section-05).

## Dependencies

- **section-01-setup**: Dependencies installed (`@google/genai`, `dotenv`), directory structure created, `PipelineConfig` type defined, pipeline config file.
- **section-02-prompts**: Prompt loader and research prompt template (`scripts/prompts/research-prompt.md`) exist.

**Blocks:** section-07-orchestration.

## Files to Create

| File | Purpose |
|------|---------|
| `scripts/content-pipeline/research/gemini-client.ts` | Gemini SDK wrapper with Deep Research and fallback |
| `scripts/content-pipeline/research/research-service.ts` | Research orchestration for a single topic |
| `__tests__/scripts/content-pipeline/research/gemini-client.test.ts` | Unit tests for Gemini client |
| `__tests__/scripts/content-pipeline/research/research-service.test.ts` | Unit tests for research service |

## Tests (Write First)

### `__tests__/scripts/content-pipeline/research/gemini-client.test.ts`

```ts
// Mock @google/genai SDK before importing the client
vi.mock("@google/genai");

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
// Mock the gemini-client module and prompt-loader module
vi.mock("@/scripts/content-pipeline/research/gemini-client");
vi.mock("@/scripts/content-pipeline/prompts/prompt-loader");

// Test: researchTopic loads and interpolates research prompt template
// Test: researchTopic passes topic title, description, category, audience, outline_notes to template
// Test: researchTopic returns research report string on success
// Test: researchTopic retries once on failure then returns null
// Test: researchTopic logs warning when returning null (no research)
// Test: researchTopic respects timeout configuration
```

## Implementation Details

### Gemini Client (`scripts/content-pipeline/research/gemini-client.ts`)

**Initialization:**
- Import `GoogleGenAI` from `@google/genai`.
- Read `GEMINI_API_KEY` from `process.env`. Throw clear error if missing.
- Instantiate `GoogleGenAI` with the API key.

**Primary research method -- Deep Research via Interactions API:**
- Use configured research agent model (e.g., `deep-research-pro-preview-12-2025`). Model identifier read from `PipelineConfig.research_model`.
- Create interaction, run in background mode (30-120 seconds).
- Poll at configurable interval (default: 5 seconds). Max: 5 minutes.
- Extract final research report text from interaction outputs.

**Exported interface:**
```ts
export class GeminiClient {
  constructor(apiKey?: string);
  async research(prompt: string, config?: Partial<ResearchConfig>): Promise<string>;
}

interface ResearchConfig {
  model: string;
  pollIntervalMs: number;
  timeoutMs: number;
}
```

**Fallback to standard generation:**
- If Interactions API throws, fall back to standard `generateContent` with research-oriented prompt.
- Log warning when falling back.

**API stability note:** The model identifier and Interactions API surface may change. The fallback ensures the pipeline functions even if the Deep Research API is deprecated.

### Research Service (`scripts/content-pipeline/research/research-service.ts`)

**Exported interface:**
```ts
export async function researchTopic(
  topic: TopicDefinition,
  config: PipelineConfig
): Promise<string | null>;
```

**Flow:**
1. Load research prompt template using prompt loader.
2. Interpolate: `{{title}}`, `{{description}}`, `{{category}}`, `{{audiences}}`, `{{age_groups}}`, `{{outline_notes}}` (empty string if absent).
3. Call `GeminiClient.research()`.
4. Return report string on success.
5. On failure: retry once, then return null with warning logged.

## Key Design Decisions

1. **Retry-once-then-null**: Research failure is not fatal. Pipeline degrades gracefully.
2. **Fallback to standard generation**: Ensures pipeline is not blocked by API changes.
3. **Polling rather than webhooks**: Simpler to implement and test.
4. **Client class, service function**: Client manages connection lifecycle, service orchestrates business logic.
5. **No caching**: Fresh research per invocation for v1.
