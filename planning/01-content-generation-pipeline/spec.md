# 01: Content Generation Pipeline

## Purpose

Build automated tooling that generates, validates, and outputs expert-quality MDX articles for the PCAB knowledge base. This is a reusable development tool integrated into the repo's npm workflow — not throwaway scripts.

## Context

- **Full project requirements:** `../requirements.md`
- **Project manifest:** `../project-manifest.md`
- **This split is part of:** Phase 1 (Active, start immediately)
- **Parallel with:** 02-content-library-creation, 03-knowledge-base-platform

## What This Split Delivers

A content generation tooling system that:
1. Takes a topic/outline as input and generates a research-backed 2,000-3,000 word article via AI API
2. Outputs properly formatted MDX with structured frontmatter
3. Runs an alignment check against core philosophy principles
4. Integrates into the development workflow via npm scripts
5. Supports human review gates before content is committed

## Key Requirements

### AI API Integration
- Support Claude API as primary generation engine
- Support Google Gemini as an alternative (the user mentioned both)
- Research-backed articles with citations where appropriate
- Multi-step generation: outline → research → draft → alignment check → MDX output

### Content Output Format
- MDX files with structured frontmatter matching this schema:
  - `title`, `category`, `pillar`, `sport` (array), `age_group` (array), `description`, `last_reviewed`
- Categories: Parent Guides, Coach Resources, Development Frameworks, Community/Program Building, Curated External Resources, The Port Clinton Way
- Pillars: Participation Depth, Retention, Multi-Sport, Character Development, Competitive Trajectory

### Alignment Check
- Automated check that each article aligns with core philosophy principles:
  - Character-first development
  - Process over outcomes
  - Multi-sport participation encouraged
  - Age-appropriate progression
  - No early specialization pressure
  - Voluntary hardship / earned confidence
- Flag articles that may contradict philosophy for human review

### Topic Management
- Topic list definition format (likely YAML or JSON)
- Outline templates per content category
- Tracking of which topics have been generated, reviewed, approved

### Developer Workflow Integration
- npm scripts for: generating a single article, batch generation, running alignment checks
- Clear CLI interface
- Output to `/content` directory structure

## Technical Context

- **Existing stack:** Next.js 16, TypeScript, existing in repo at `C:\GitHub\PCAB`
- **No existing content infrastructure** — everything built from scratch
- **Deployment:** Vercel (static export currently)
- **AI APIs:** Claude API (Anthropic SDK), Google Gemini API

## Decisions from Interview

- Pipeline is a first-class development tool, not throwaway scripts
- Integrated via npm scripts, potentially CI/CD
- "The Port Clinton Way" uses same MDX structure as all other content (no special treatment)
- Human review happens on the finished MDX output

## Dependencies

| Direction | Split | What |
|-----------|-------|------|
| **Produces for** | 02 | Tooling that 02 uses to generate the actual article library |
| **Consumes from** | 03 | Frontmatter schema definition (can be defined early as a shared contract) |

## What This Split Does NOT Cover

- Actually writing the 75-100+ articles (that's split 02)
- The knowledge base UI, routing, or rendering (that's split 03)
- The chatbot or RAG pipeline (that's split 04)
- Sport-specific tactical coaching content (out of scope per requirements)

## Success Criteria

1. A developer can run `npm run generate:article -- --topic "topic-name"` and get a properly formatted MDX file
2. Alignment check catches articles that contradict core philosophy
3. Batch generation works for producing multiple articles
4. Output MDX validates against the frontmatter schema
5. Clear documentation for how to use the pipeline
