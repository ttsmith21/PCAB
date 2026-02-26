# 04: AI Chatbot — "Ask PC Athletics"

## Purpose

Build an AI-powered chatbot that provides conversational access to the entire knowledge base, powered by RAG (Retrieval Augmented Generation) over the MDX content library. Includes the migration from static export to hybrid rendering on Vercel.

## Context

- **Full project requirements:** `../requirements.md`
- **Project manifest:** `../project-manifest.md`
- **This split is part of:** Phase 3 (starts after split 03 is complete)

## What This Split Delivers

1. A dedicated `/ask` page with full chat interface
2. A persistent chat widget accessible from any page on the site
3. RAG pipeline that retrieves relevant articles and feeds them to Claude as context
4. System prompt with philosophy, 5 Pillars, and guardrails
5. Migration from static export to hybrid rendering on Vercel
6. All existing static pages continue to work

## Technical Requirements

### Architecture Migration
- Migrate Next.js 16 from static export (`output: 'export'`) to hybrid rendering
- API routes for chat endpoint
- Vercel Pro tier required for server functions
- Ensure all existing pages remain statically generated (no regression)
- Only the chat API routes and chat pages use server-side functionality

### RAG Pipeline
- Content indexing: process MDX library into searchable embeddings/index
- Retrieval: given a user question, find the most relevant articles
- Context assembly: compose retrieved content + metadata into Claude prompt context
- Must understand frontmatter structure (categories, pillars, sports, age groups) for filtering relevance
- Tightly coupled to split 03's content infrastructure — uses same content loading utilities, types, and organization

### Chat API
- Claude API integration via Vercel AI SDK
- Streaming responses for real-time feel
- System prompt includes:
  - The Port Clinton Way philosophy and 5 Pillars framework
  - Key principles (character-first, process over outcomes, multi-sport, etc.)
  - Behavioral guardrails
- Context window management for multi-turn conversations

### Guardrails
- Will NOT provide medical, injury diagnosis, or treatment advice
- Will NOT contradict the defined philosophy
- Will redirect sport-specific tactical questions (plays, schemes, drills) to coaches
- Will NOT include personally identifiable information about minors
- Responses cite specific articles when relevant (link to knowledge base pages)

### Chat UI
- **Dedicated page:** `/ask` with full chat interface
  - Message input with send button
  - Scrollable message history
  - Article citations rendered as clickable links
  - Welcome message explaining what the chatbot can help with
- **Persistent widget:** Accessible from any page
  - Floating chat button (bottom-right or similar)
  - Expandable chat panel
  - Minimizable without losing conversation

### Session Management
- Chat history persists within a browser session
- No user accounts required (session-based only)
- Conversation context maintained across messages within a session

### Performance
- Initial response time under 3 seconds
- Streaming for longer responses
- Widget doesn't impact page load performance (lazy loaded)

## Technical Context

- **Framework:** Next.js 16 App Router, TypeScript
- **AI:** Claude API via Vercel AI SDK (`ai` package)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Deployment:** Vercel Pro (needed for server functions)
- **Content infrastructure:** Built by split 03 (MDX loading, types, frontmatter schema)

## Key Decisions from Interview

- Tightly coupled to split 03's content infrastructure — RAG needs to understand frontmatter, categories, content relationships
- Static-to-hybrid migration bundled here (it's the motivating change for hybrid rendering)
- Vercel Pro tier needed for server functions

## Dependencies

| Direction | Split | What |
|-----------|-------|------|
| **Hard depends on** | 03 | Content infrastructure, frontmatter schema, content loading utilities, TypeScript types |
| **Soft depends on** | 02 | Actual content for meaningful answers (can test with sample content) |
| **Updated by** | 06 | AD collaboration will update system prompt with official philosophy |

## What This Split Does NOT Cover

- Content generation or the articles themselves (splits 01, 02)
- The knowledge base UI pages (split 03)
- Interactive development pathway tools (split 05)
- User accounts or personalization (split 07)

## Success Criteria

1. User can ask a natural language question and receive a helpful, philosophy-aligned answer
2. Chatbot responses cite specific articles from the knowledge base
3. Chatbot refuses to give medical advice or contradict established philosophy
4. Response time under 3 seconds for initial response
5. Chat history persists within a session
6. Hybrid rendering works without breaking existing static pages
7. Parent can ask "My kid is 12 and plays soccer and basketball — what should the next 3 years look like?" and get a useful, personalized answer grounded in the knowledge base
