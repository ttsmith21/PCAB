<!-- SPLIT_MANIFEST
01-content-generation-pipeline
02-content-library-creation
03-knowledge-base-platform
04-ai-chatbot
05-interactive-development-pathways
06-ad-collaboration
07-community-features-advanced-ai
END_MANIFEST -->

# Project Manifest: PCAB Knowledge Base & AI Athletic Development Platform

## Overview

This project builds a comprehensive athletic development platform for Port Clinton Athletic Boosters — from content generation tooling and an initial 75+ article library through a knowledge base, AI chatbot, interactive tools, and community features. The platform establishes "The Port Clinton Way" as a unified athletic development philosophy for a small school district.

The project decomposes into 7 planning units spanning 4 phases. Splits 01, 02, and 03 form the Phase 1-2 parallel work. Split 01 (tooling) enables split 02 (content creation), and both feed into split 03 (the platform). Splits 04-07 are sequential or deferred.

## Split Structure

### 01-content-generation-pipeline (Phase 1 — Active)

**Purpose:** Automated tooling to generate, validate, and output expert-quality MDX articles via AI APIs.

**Scope:**
- API-based content generation using Claude API and/or Google Gemini
- Topic list management and outline system
- Article generation prompts with research-backed citation support
- AI alignment check against core philosophy principles
- MDX output with structured frontmatter (title, category, pillar, sport, age group, description, last reviewed date)
- Integrated into development workflow via npm scripts
- Human review workflow (review gate before content is committed)
- Alignment check tooling (validate article against philosophy principles)

**Key Decisions:**
- Uses Claude API and/or Gemini for generation (not manual web UI)
- Pipeline is a first-class development tool, not throwaway scripts
- Integrated via npm scripts, potentially CI/CD
- Produces MDX files with frontmatter matching the schema defined by 03

**Outputs:** Reusable content generation tooling in the repo (`/scripts` or `/tools` directory, npm scripts)

---

### 02-content-library-creation (Phase 1 — Active)

**Purpose:** Actually create the initial library of 75-100+ articles, topic lists, outlines, and curated resources using Claude Code's research capabilities and the pipeline tooling.

**Scope:**
- Define complete topic list across all content categories:
  - Parent Guides (supporting youth athletes, understanding development stages, nutrition, mental health)
  - Coach Resources (volunteer onboarding, practice planning, age-appropriate coaching, season structure)
  - Development Frameworks (LTAD model, multi-sport benefits, periodization, skill windows)
  - Community/Program Building (volunteer recruitment, program health metrics, fundraising, culture building)
  - Curated External Resources (vetted links with editorial context explaining alignment with PC philosophy)
  - The Port Clinton Way (foundational character-first philosophy content, 5 Pillars)
- Generate detailed outlines for each article
- Research and write 75-100+ articles (2,000-3,000 words each, research-backed, cited)
- Run alignment checks against core philosophy principles on each article
- Compile curated external resource list with editorial context for each link
- Write "The Port Clinton Way" foundational content (universally sound content any AD would endorse)
- Human review and approval workflow
- Organize all content in `/content` directory as MDX with structured frontmatter

**Key Decisions:**
- Claude Code does the actual research and writing — this is a content creation effort, not just tooling
- Content must be evidence-based, citing established frameworks (LTAD, Positive Coaching Alliance, NFHS)
- "The Port Clinton Way" content is written as universally sound foundations, not prescriptive philosophy (that comes from the AD in split 06)
- Evergreen focus — content that rarely needs updating (annual review, not weekly treadmill)
- Uses same MDX frontmatter structure as all other content

**Dependencies:**
- **Uses 01** — leverages the pipeline tooling for generation and alignment checks
- Can start topic list and outline work before 01 is complete

**Outputs:** `/content` directory populated with 75-100+ validated MDX files across all categories, complete topic taxonomy, curated external resource list

---

### 03-knowledge-base-platform (Phase 2 — Active)

**Purpose:** Full knowledge base UI and content infrastructure built from scratch on the existing Next.js 16 site.

**Scope:**
- MDX infrastructure: loading, parsing, frontmatter schema, rendering pipeline
- Content loading utilities and type definitions
- Category landing pages with filtering by sport, age group, and pillar
  - `/knowledge` hub landing page
  - `/knowledge/parents`, `/knowledge/coaches`, `/knowledge/development`, `/knowledge/community`, `/knowledge/resources`
  - `/knowledge/pc-way` — The Port Clinton Way section
- Individual article pages with consistent layout, reading time, related articles
- Full-text client-side search (Flexsearch or Pagefind, build-time index)
- Top-level navigation integration ("Development" dropdown)
- Existing `/youth` page gateway to knowledge base
- Mobile-responsive, consistent with existing site design language
- Lighthouse performance score maintained above 90

**Key Decisions:**
- Built entirely from scratch (no existing content infrastructure)
- One cohesive unit — MDX infra, UI, search, and navigation are too intertwined to separate
- Remains static export (no server functions needed yet)
- Search is client-side, built at deploy time

**Dependencies:**
- Needs sample MDX articles to develop and test against (can start with hand-written samples before 02 produces real content)
- Does not block on 01 or 02 completing — runs in parallel

**Outputs:** Fully functional `/knowledge` section integrated into existing site, with search, filtering, and responsive design

---

### 04-ai-chatbot (Phase 3 — Next)

**Purpose:** "Ask PC Athletics" AI chatbot with RAG pipeline, powered by the knowledge base content.

**Scope:**
- Migration from static export to hybrid rendering on Vercel
- Claude API route via Vercel AI SDK
- RAG pipeline: content indexing, embedding/retrieval from MDX library
- Dedicated `/ask` page with full chat interface
- Persistent chat widget accessible from any page
- System prompt with The Port Clinton Way philosophy, 5 Pillars, key principles
- Guardrails: no medical advice, no philosophy contradiction, sport-specific tactical questions redirected to coaches
- Session-based chat history persistence
- Response time under 3 seconds for initial response
- Ensure existing static pages unaffected by hybrid migration

**Key Decisions:**
- Tightly coupled to 03's content infrastructure — RAG needs to understand frontmatter, categories, content relationships
- Static-to-hybrid migration bundled with chatbot (it's the motivating change)
- Vercel Pro tier needed for server functions

**Dependencies:**
- **Hard dependency on 03** — content infrastructure, frontmatter schema, and content organization must exist
- **Soft dependency on 02** — needs actual content to provide meaningful answers (can test with sample content)

**Outputs:** Working chatbot accessible via `/ask` page and persistent widget, backed by the full knowledge base via RAG

---

### 05-interactive-development-pathways (Phase 3 — Next)

**Purpose:** Interactive tools for visualizing and navigating athletic development paths.

**Scope:**
- Age/sport(s)/goals selection interface → recommended development path
- Multi-sport participation maps showing how sports complement each other
- Visual timeline of youth-to-varsity progression by sport
- Data-driven, structured content (not AI-generated at runtime)

**Key Decisions:**
- Static/structured data, not AI-powered at runtime
- Separate from chatbot — these are interactive data visualization tools

**Dependencies:**
- **Depends on 03** — lives within the knowledge base platform, uses its design patterns and navigation
- **Independent of 04** — does not need the chatbot

**Outputs:** Interactive pathway tools within the `/knowledge` section

---

### 06-ad-collaboration (Phase 4 — Deferred)

**Purpose:** Workflow and tooling for Athletic Director collaboration to formalize "The Port Clinton Way."

**Scope:**
- AD interview workflow (30-minute conversation → Claude drafts philosophy from transcript)
- AD review, refinement, and endorsement process
- Integration of official philosophy into chatbot system prompt (update 04)
- Content alignment audit: all existing articles re-checked against finalized philosophy
- Coach alignment sessions: varsity coaches review and buy-in process
- Content update pipeline for philosophy-aligned revisions

**Key Decisions:**
- This is the most important future piece — the platform reaches its full potential only when the AD's vision is integrated
- Political sensitivity: must feel like the AD's tool, not the Boosters' soapbox
- Timing depends on AD relationship development

**Dependencies:**
- **Depends on 02, 03, 04** — content library, platform, and chatbot must exist to update
- Sequentially last of the "core" work

**Outputs:** Official "Port Clinton Way" philosophy, re-aligned content library, updated chatbot system prompt

---

### 07-community-features-advanced-ai (Phase 4 — Deferred / Future)

**Purpose:** User accounts, community engagement features, and advanced AI capabilities.

**Scope:**
- User accounts with role-based views (parent, coach, athlete, volunteer)
- Coach-contributed content (practice plans, session notes)
- Parent Q&A moderated by AI for philosophical alignment
- Seasonal planning tools
- Program health tracking against 5 Pillars metrics
- Proactive seasonal content via Mailchimp integration
- Multimodal AI capabilities as they evolve
- Personalized content recommendations based on user role and interests
- Database introduction (Supabase)

**Key Decisions:**
- Deferred pending demand validation
- Introduces significant new infrastructure (database, auth, user management)
- Scope may be re-evaluated based on Phase 1-3 learnings

**Dependencies:**
- **Depends on 02, 03, 04, 06** — full platform and official philosophy must exist
- This is the most speculative split

**Outputs:** Community-driven platform with user accounts, contributions, and personalized AI features

---

## Execution Order & Parallelism

```
Parallel Group A (Phase 1-2, start immediately):
  ├── 01-content-generation-pipeline ──┐
  │                                    ├── 02-content-library-creation
  └── 03-knowledge-base-platform ──────┤
                                       │
Sequential (Phase 3):                  │
  ├── 04-ai-chatbot ◄─────────────────┘ (depends on 03, soft-depends on 02)
  └── 05-interactive-development-pathways ◄── (depends on 03, parallel with 04)

Sequential (Phase 4, deferred):
  ├── 06-ad-collaboration ◄───────────── (depends on 02, 03, 04)
  └── 07-community-features-advanced-ai ◄── (depends on all above)
```

## Dependency Map

| Split | Hard Dependencies | Soft Dependencies |
|-------|-------------------|-------------------|
| 01 | None | — |
| 02 | None (uses 01 tooling) | 01 (pipeline tools) |
| 03 | None | Sample content from 02 |
| 04 | 03 (content infra) | 02 (actual content) |
| 05 | 03 (platform, design patterns) | — |
| 06 | 02, 03, 04 | — |
| 07 | 02, 03, 04, 06 | — |

## Cross-Cutting Concerns

- **Frontmatter schema**: Defined in 03, consumed by 01 (for generation tooling), 02 (for content creation), 04 (for RAG), 05 (for pathway data)
- **Design language**: Established by existing site + 03, followed by 04, 05, 07
- **Content philosophy alignment**: Principles established in 02's content, referenced by 04's guardrails, formalized by AD in 06
- **TypeScript types**: Shared content types defined in 03, used across all splits

## /deep-plan Commands

```bash
# Phase 1-2 (can run in parallel)
/deep-plan @planning/01-content-generation-pipeline/spec.md
/deep-plan @planning/02-content-library-creation/spec.md
/deep-plan @planning/03-knowledge-base-platform/spec.md

# Phase 3 (after 03 is complete)
/deep-plan @planning/04-ai-chatbot/spec.md
/deep-plan @planning/05-interactive-development-pathways/spec.md

# Phase 4 (deferred)
/deep-plan @planning/06-ad-collaboration/spec.md
/deep-plan @planning/07-community-features-advanced-ai/spec.md
```
