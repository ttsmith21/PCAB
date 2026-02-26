# Combined Specification: Content Generation Pipeline

## Overview

Build an automated content generation pipeline for the PCAB (Port Clinton Athletic Boosters) website that produces expert-quality MDX articles for a knowledge base about youth athletic development. The pipeline uses a hybrid AI approach — Gemini Deep Research API for source gathering and Claude API for article writing — with automated alignment validation, topic management, and Git-based review workflows.

This is part of a larger project to build "The Port Clinton Way," a character-first athletic development philosophy platform for a small school district. The content generation pipeline is one of 7 project splits, running in parallel with the knowledge base platform (split 03) and feeding content to it.

## Context

### The Problem
Port Clinton needs 75-100+ expert-quality articles covering youth athletic development, coaching resources, parent guides, community building, and a foundational philosophy document. These articles must be evidence-based, aligned with core principles (character-first, multi-sport, age-appropriate development), and written for non-technical audiences (parents, volunteer coaches, community leaders).

### The Existing Codebase
- **Framework**: Next.js 16 App Router, TypeScript (strict mode), Tailwind CSS v4, Framer Motion
- **Data patterns**: All content currently lives as typed TypeScript constants in `lib/data/` with interfaces
- **Testing**: Vitest + @testing-library/react + jsdom. 21 test files, 108 tests. Tests mirror source structure in `__tests__/`
- **Build**: Static export to Vercel. No server functions.
- **No existing content infrastructure**: Zero MDX, no markdown processing, no CMS
- **npm scripts**: Standard (`dev`, `build`, `start`, `lint`, `test`). No custom scripts yet.
- **Path aliases**: `@/*` maps to project root

### Content Schema (Shared with Split 03)
The knowledge base platform (split 03) will use Velite with Zod schemas. The pipeline must output MDX files matching this frontmatter schema:

```typescript
{
  title: string           // max 120 chars
  slug: string            // URL-safe, auto-derived from filename
  description: string     // max 260 chars
  category: enum          // parents | coaches | development | community | resources | pc-way
  pillar: enum[]          // participation-depth | retention | multi-sport | character-development | competitive-trajectory
  sport: string[]         // football | basketball | soccer | baseball | ... | general
  age_group: string[]     // youth | middle-school | high-school | general
  audience: enum[]        // coaches | parents | administrators | youth-leaders | volunteers
  difficulty: enum        // beginner | intermediate | advanced
  content_type: enum      // guide | research-summary | case-study | quick-tip | deep-dive
  theme: string[]         // growth-mindset | communication | safety | inclusion | leadership | ...
  last_reviewed: date     // ISO date
  generated_by: enum      // human | ai-assisted | ai-generated
  sources: array           // { title, url, accessed }
}
```

## Requirements

### 1. Hybrid AI Generation (Gemini Research + Claude Writing)

**Two-phase generation per article:**

**Phase 1 — Research (Gemini Deep Research API):**
- Use `@google/genai` SDK with Interactions API
- Agent: `deep-research-pro-preview-12-2025` (or latest)
- Input: topic description and research prompt
- Output: multi-page research report with citations from 100+ web sources
- Background mode for long-running research tasks with polling

**Phase 2 — Article Writing (Claude API):**
- Use `@anthropic-ai/sdk`
- Multi-step: (1) Generate outline from research, (2) Write full article from outline + research
- Model: Claude Sonnet 4.6 for standard articles, configurable per topic
- Adaptive thinking enabled
- Streaming for long content
- `max_tokens: 16384` (articles are ~4,000-5,000 tokens but need headroom for thinking)

**Full generation flow per article:**
1. Gemini Deep Research gathers sources → research report
2. Claude generates outline from research report → structured outline
3. Claude writes article from outline + research → MDX with frontmatter
4. Claude validates via rubric (different model) → pass/fail + scores
5. If failing: regenerate with feedback, up to 3 attempts

### 2. Alignment Validation (LLM-as-Judge)

**5-dimension rubric, scored 1-4:**

| Dimension | Weight | Description |
|-----------|--------|-------------|
| Factual Accuracy | 0.25 | Claims supported, sources credible, no fabrication |
| Values Alignment | 0.25 | Aligns with PC Way principles (character-first, multi-sport, no early specialization, process over outcomes) |
| Audience Appropriateness | 0.20 | Right level for target audience (parents aren't coaches, volunteers aren't PhDs) |
| Actionability | 0.15 | Practical, implementable advice with specific steps |
| Writing Quality | 0.15 | Well-structured, engaging, accessible |

**Pass threshold**: Overall weighted score >= 3.0 out of 4.0
**Failure handling**: Regenerate with rubric feedback. After 3 failures, flag for human review.
**Bias mitigation**: Use a different model for judging than generating.

### 3. Topic Management System

**Topic list definition:**
- YAML file(s) defining the full topic taxonomy
- Each topic: slug, title, category, audience, difficulty, age_group, sport, theme, description, outline notes
- Organized by content category

**Content matrix tracking:**
- Track articles per domain × audience × difficulty intersection
- Set minimum targets per cell
- Difficulty distribution targets: 40% beginner, 40% intermediate, 20% advanced

**Gap analysis:**
- Identify underserved intersections in the content matrix
- Suggest which articles to generate next based on gaps
- Coverage report: what exists vs. what's planned

### 4. Pipeline Infrastructure

**Run modes:**
- **Single article**: `npm run generate:article -- --topic "topic-slug"` — for testing and prompt iteration
- **Batch**: `npm run generate:batch -- --category coaching` — for bulk generation

**Error handling:**
- Retry with exponential backoff for rate limits
- Persistent state: track completed/failed/pending articles in a batch
- Resume capability: restart a batch from where it stopped
- Failure logs for review

**Prompt management:**
- Versioned template files in `/scripts/prompts/`
- Templates: `system-prompt.md`, `article-generation.md`, `outline-generation.md`, `alignment-check.md`, `research-prompt.md`
- Pipeline reads templates at runtime, supports variable interpolation

**Configuration:**
- API keys via `.env` file (ANTHROPIC_API_KEY, GEMINI_API_KEY)
- Environment variable-based config (CI-ready design, no hardcoded paths)
- Pipeline config in a config file (model selection, thresholds, retry counts)

### 5. Git PR Review Workflow

- Pipeline generates articles to a working branch
- Creates GitHub PR per article or per batch
- PR includes: generated MDX file(s), validation scores, generation metadata
- Human reviews in GitHub, approves to merge into `/content` directory

### 6. Output Format

- MDX files written to `/content/{category}/{slug}.mdx`
- Frontmatter matches the Zod schema defined above
- Article body: 2,000-3,000 words, research-backed, cited where appropriate
- Content standards: evidence-based, audience-appropriate, evergreen, actionable, non-prescriptive on coaching tactics

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| AI providers | Gemini + Claude hybrid | Gemini's web research + Claude's prose quality |
| MDX validation | Velite + Zod (build-time) | Type-safe, catches schema violations before deployment |
| Prompt storage | Versioned .md template files | Easy iteration without code changes |
| Review workflow | Git PRs | Familiar, auditable, supports async review |
| Topic management | Full: definition + tracking + gaps | Ensures balanced, comprehensive coverage |
| Error handling | Robust retry + resume | Essential for 300-500 API call batch runs |
| Config | .env + environment variables | CI-ready design, local-first |
| Generation quality | Full multi-step flow (4-5 calls/article) | Quality over cost — budget is not the constraint |

## Directory Structure (Proposed)

```
scripts/
  content-pipeline/
    generate.ts              # Main entry point (single + batch modes)
    research.ts              # Gemini Deep Research integration
    writer.ts                # Claude article writing (outline + full article)
    validator.ts             # LLM-as-judge alignment validation
    topics.ts                # Topic list loading and management
    matrix.ts                # Content matrix tracking and gap analysis
    state.ts                 # Batch state persistence and resume
    config.ts                # Pipeline configuration
    types.ts                 # Shared TypeScript types
  prompts/
    system-prompt.md         # Base system prompt for article generation
    article-generation.md    # Article writing prompt template
    outline-generation.md    # Outline generation prompt template
    alignment-check.md       # Validation rubric prompt template
    research-prompt.md       # Gemini research prompt template
content/
  topics/
    coaching.yaml            # Topic definitions by category
    parenting.yaml
    development.yaml
    community.yaml
    resources.yaml
    pc-way.yaml
  articles/                  # Generated MDX files (output directory)
    coaching/
    parenting/
    development/
    community/
    resources/
    pc-way/
```

## Constraints

- **No sport-specific tactical content**: No plays, schemes, drills — that's the coach's domain
- **Political sensitivity**: Content authority flows from established research, not the booster club
- **Evergreen focus**: Content that rarely needs updating (annual review cycle)
- **Safety**: No medical advice, no PII about minors, cite established frameworks (LTAD, Positive Coaching Alliance, NFHS)
- **"The Port Clinton Way" uses same structure**: No special infrastructure treatment

## Dependencies

- **Produces for split 02**: Tooling that split 02 uses to generate the actual 75-100+ article library
- **Consumes from split 03**: Frontmatter schema (can be defined early as shared contract via Velite config)
- **SDKs**: `@anthropic-ai/sdk` (Node.js 20+), `@google/genai` (Node.js 18+)

## Success Criteria

1. `npm run generate:article -- --topic "topic-slug"` produces a properly formatted, validated MDX file
2. `npm run generate:batch -- --category coaching` processes a batch with resume capability
3. Alignment validation catches articles that contradict core philosophy
4. Topic management tracks coverage and identifies gaps
5. Generated MDX validates against the Zod frontmatter schema at build time
6. Pipeline handles API failures gracefully with retry and resume
7. Prompts are iterable without code changes
