# Research Findings: Content Generation Pipeline

## Part 1: Codebase Analysis

### Project Structure

The PCAB site is a Next.js 16 App Router project with static export (`output: "export"`). Key architecture:

```
app/                          # Next.js App Router pages (about, membership, news, resources, etc.)
components/
  ui/                         # Reusable: Button, Card, FadeIn, FaqAccordion, SectionHeading
  home/                       # Homepage: Hero, ImpactStats, ActionCards, InitiativePreview
  layout/                     # Navbar, Footer, MobileMenu
lib/
  constants.ts                # All config: PAYMENT_URLS, SOCIAL_URLS, SITE_CONFIG, etc.
  data/                       # Typed data: initiatives.ts, board.ts, sponsors.ts, sports.ts, nav-links.ts
__tests__/                    # Mirrors source structure: app/, components/, integration/, lib/
```

### Conventions & Patterns

- **Components**: PascalCase files, default exports, `{Name}Props` interfaces
- **Data**: TypeScript constants in `lib/data/`, typed arrays with interfaces, exported as const
- **Constants**: SCREAMING_SNAKE_CASE in `lib/constants.ts`
- **Path aliases**: `@/*` maps to project root
- **No content infrastructure**: Zero MDX, no markdown, no CMS. All content hardcoded in TS constants
- **TypeScript**: Strict mode, typed props, enums for variants

### Dependencies

**Production**: next 16.1.6, react 19.2.3, framer-motion, lucide-react, react-intersection-observer
**Dev**: tailwindcss v4, vitest, @testing-library/react, jsdom, eslint
**No content libs**: No MDX processor, no content management, no headless CMS

### Build & Deployment

- **Static export**: `output: "export"` in next.config.ts, images unoptimized
- **Vercel**: Static hosting, no server functions
- **CSS**: Tailwind CSS v4 with custom theme (pc-red, pc-dark, pc-gray, fonts Inter/Oswald)

### npm Scripts

```json
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "eslint",
"test": "vitest run"
```

No custom scripts, no preprocessing, no content generation tooling exists yet.

### Testing Setup

- **Framework**: Vitest + @testing-library/react + jsdom
- **Config**: `vitest.config.ts` with globals, setupFiles, path aliases
- **Structure**: `__tests__/` mirrors source — `app/`, `components/`, `integration/`, `lib/`
- **Patterns**: vi.mock for dependencies (next/image, next/link, react-intersection-observer), data-testid queries, attribute/accessibility checks
- **Coverage**: 21 test files, 108 tests, all passing
- **Integration tests**: Multi-component tests, data flow validation, constants usage verification

### Key Insight for Pipeline

The existing data pattern (typed TS constants in `lib/data/`) is the natural pattern to follow. Content generation pipeline should output MDX files that follow similar type-safe patterns. The testing patterns (interface validation, data completeness, component integration) translate directly to content validation tests.

---

## Part 2: Web Research

### 1. Claude API for Long-Form Content Generation

**Model Selection:**
- **Claude Opus 4.6**: 128K output tokens, 200K context (1M beta). Best for deep analysis, complex synthesis. $75/1M output tokens.
- **Claude Sonnet 4.6**: 64K output tokens, 200K context. Fast, cost-effective. $15/1M output tokens.
- A 3,000-word article ≈ 4,000-5,000 tokens — well within all models' limits.

**Prompt Engineering Best Practices:**
- Use XML tags for structured prompts (`<instructions>`, `<context>`, `<output_format>`)
- Provide 1-2 example articles in `<example>` tags for tone/structure calibration
- "Quote first, then synthesize" pattern for citation-heavy content
- Explicit uncertainty rules: "If unsure, say so rather than fabricating"
- Tell what TO do, not what NOT to do

**Extended/Adaptive Thinking:**
- Opus 4.6 and Sonnet 4.6 support adaptive thinking (`thinking: { type: "adaptive" }`)
- For content generation, start with `effort: "low"` or `"medium"`, increase if quality is insufficient
- Set `max_tokens: 8192-16384` to give room for thinking + output

**Multi-Step Generation (Recommended for Quality):**
1. Generate outline with key points and sources (call 1)
2. Generate each section based on outline (call 2)
3. Review and refine (call 3)

**Batch Processing:**
```typescript
const batch = await client.messages.batches.create({
  requests: articles.map((article, i) => ({
    custom_id: `article-${i}`,
    params: { model: "claude-sonnet-4-6", max_tokens: 16384, system: systemPrompt, messages: [...] },
  })),
});
```

**SDK**: `@anthropic-ai/sdk` — Node.js 20+, TypeScript >= 4.9. Streaming recommended for long content.

### 2. Gemini API for Content Generation

**Model Selection:**
- Gemini 2.5 Pro: 65K output, 1M context, $10/1M output — most cost-effective
- Gemini 3.1 Pro: 65K output, 1M context, $12/1M output — best reasoning
- **Critical**: Default `maxOutputTokens` is only 8,192 — must set explicitly

**Deep Research API (Key Differentiator):**
- Uses Gemini 3 Pro reasoning core, reads 100+ web pages
- Available via Interactions API (beta)
- Returns multi-page reports with proper citations
- Can chain: Deep Research → standard model for formatting

```typescript
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const interaction = await ai.interactions.create({
  input: 'Research evidence-based approaches to youth coaching...',
  agent: 'deep-research-pro-preview-12-2025',
  background: true,
});
```

**SDK**: `@google/genai` (NOT the deprecated `@google/generative-ai`). Node.js 18+.

**Claude vs Gemini Recommendation:**
- Use Gemini Deep Research for source gathering (broader web access)
- Use Claude for final article writing (superior prose quality, better tone control)
- Or use Claude Sonnet 4.6 as single-model approach for simplicity

### 3. MDX Content Pipeline Architecture

**Recommended Tool: Velite**
- Type-safe MDX with Zod schemas, build-time validation
- Contentlayer is deprecated — avoid for new projects
- Alternatives: Content Collections, Fumadocs MDX, next-mdx-remote

**Content Directory Structure:**
```
content/
  articles/
    coaching/           # Domain-organized
    parenting/
    youth-development/
    community/
velite.config.ts        # Zod schema definitions
```

**Frontmatter Schema (Zod via Velite):**
```typescript
s.object({
  title: s.string().max(120),
  slug: s.slug('articles'),
  description: s.string().max(260),
  category: s.enum(['coaching', 'parenting', 'youth-development', 'community']),
  tags: s.array(s.string()),
  audience: s.array(s.enum(['coaches', 'parents', 'administrators', 'youth'])),
  difficulty: s.enum(['beginner', 'intermediate', 'advanced']),
  readingTime: s.number(),
  generatedBy: s.enum(['human', 'ai-assisted', 'ai-generated']).optional(),
  sources: s.array(s.object({ title: s.string(), url: s.string().url() })).optional(),
  content: s.mdx(),
})
```

**Pipeline Pattern:**
```
PLAN → RESEARCH → GENERATE → VALIDATE → REVIEW → PUBLISH → BUILD
```

### 4. AI Content Alignment/Validation

**LLM-as-a-Judge Pattern:**
- Use multi-dimensional rubric scoring (1-4 scale per dimension)
- Use a different model for judging than generating (e.g., generate with Sonnet, judge with Opus)
- 80%+ agreement with human preferences at 500x-5000x lower cost

**Recommended Rubric Dimensions:**
1. **Factual Accuracy** (weight: 0.25) — claims supported, sources credible
2. **Values Alignment** (weight: 0.25) — aligns with organizational principles
3. **Audience Appropriateness** (weight: 0.20) — right level for target audience
4. **Actionability** (weight: 0.15) — practical, implementable advice
5. **Writing Quality** (weight: 0.15) — well-structured, engaging

**Pass threshold**: Overall weighted score >= 3.0 (out of 4.0)

**Self-Correction Chain:**
1. Generate draft (call 1)
2. Review against rubric (call 2, different model)
3. Refine incorporating review (call 3)

**Frameworks**: Promptfoo (YAML rubric assertions), DeepEval (pytest-like), TruLens (tracking)

### 5. Knowledge Domain Structuring

**Faceted Taxonomy (Recommended):**
| Facet | Values |
|-------|--------|
| Domain | Coaching, Parenting, Youth Development, Community Building |
| Audience | Coaches, Parents, Administrators, Youth Leaders, Volunteers |
| Difficulty | Beginner, Intermediate, Advanced |
| Content Type | Guide, Research Summary, Case Study, Quick Tip, Deep Dive |
| Age Group | Early Childhood (5-8), Youth (9-12), Teen (13-17), All Ages |
| Theme | Growth Mindset, Communication, Safety, Inclusion, Leadership |

**Content Matrix for Balance:**
- Track articles per domain × audience × difficulty intersection
- Set minimum targets per cell (e.g., 5 beginner articles per domain-audience pair)
- Difficulty distribution: 40% beginner, 40% intermediate, 20% advanced
- Regular automated audits: count per facet, flag gaps, identify stale content

**Cross-Cutting Content:**
- Some topics span domains (e.g., "Communication" applies to coaching, parenting, community)
- Tag with cross-cutting themes for discovery
- Frame differently per audience rather than duplicating

**Key Principle**: Categories answer "where does this live?" Tags enable "how might users search for this?" Use categories for structure, tags for discovery.
