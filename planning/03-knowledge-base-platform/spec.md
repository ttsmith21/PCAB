# 03: Knowledge Base Platform

## Purpose

Build the full knowledge base UI and content infrastructure from scratch on the existing Next.js 16 PCAB site. This is the platform that displays, organizes, and makes searchable the 75-100+ articles created in split 02.

## Context

- **Full project requirements:** `../requirements.md`
- **Project manifest:** `../project-manifest.md`
- **This split is part of:** Phase 2 (Active, start immediately — parallel with 01 and 02)

## What This Split Delivers

A complete `/knowledge` section integrated into the existing PCAB website:
1. MDX content infrastructure (loading, parsing, rendering)
2. Category landing pages with filtering
3. Article template and layout component
4. Full-text client-side search
5. Navigation integration with existing site
6. Mobile-responsive, performant, consistent with existing design

## Technical Requirements

### MDX Infrastructure
- MDX loading and parsing pipeline for Next.js 16 App Router
- Frontmatter schema definition and TypeScript types:
  - `title: string`
  - `category: enum` (parents, coaches, development, community, resources, pc-way)
  - `pillar: enum[]` (participation-depth, retention, multi-sport, character-development, competitive-trajectory)
  - `sport: string[]` (football, basketball, soccer, baseball, etc. — plus "general")
  - `age_group: string[]` (youth, middle-school, high-school, general)
  - `description: string`
  - `last_reviewed: date`
- Content loading utilities (get all articles, filter by category/pillar/sport/age)
- Reading time calculation
- Related articles algorithm (by shared tags/category/pillar)

### Route Structure
- `/knowledge` — hub landing page (overview of all categories, featured content)
- `/knowledge/parents` — Parent Guides category page
- `/knowledge/coaches` — Coach Resources category page
- `/knowledge/development` — Development Frameworks category page
- `/knowledge/community` — Community/Program Building category page
- `/knowledge/resources` — Curated External Resources page
- `/knowledge/pc-way` — The Port Clinton Way section
- `/knowledge/[category]/[slug]` — Individual article pages

### Category Landing Pages
- List of articles in category with title, description, reading time
- Filtering by sport, age group, and pillar
- Sort options (newest, most relevant)
- Responsive grid/list layout

### Article Pages
- Consistent layout with MDX rendering
- Reading time display
- Article metadata (category, pillars, sports, age groups)
- Related articles sidebar/section
- Back-to-category navigation
- Table of contents for longer articles

### Search
- Full-text client-side search (Flexsearch or Pagefind)
- Index built at deploy time (no server required)
- Search UI accessible from knowledge hub
- Results show title, description, category, reading time
- Fast — instant results as user types

### Navigation Integration
- New top-level navigation item ("Development" or similar)
- Dropdown with links to category pages
- Existing `/youth` page updated to gateway into knowledge base
- Breadcrumb navigation within knowledge section

### Performance & Design
- Mobile-responsive (most parents access from phones)
- Consistent with existing site design language (Tailwind CSS v4, Framer Motion)
- Lighthouse performance score maintained above 90
- All existing site functionality unaffected

## Technical Context

- **Framework:** Next.js 16 App Router, TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Deployment:** Vercel, currently static export (stays static for this split)
- **No existing content infrastructure** — built entirely from scratch
- **Content source:** MDX files in `/content` directory with frontmatter

## Key Decisions from Interview

- One cohesive unit — MDX infra, UI, search, and navigation are too intertwined to separate
- Remains static export (no server functions needed yet)
- Search is client-side, built at deploy time
- "The Port Clinton Way" uses same structure as other categories (no special UI treatment)
- Can start with hand-written sample MDX files before real content from split 02 is ready

## Dependencies

| Direction | Split | What |
|-----------|-------|------|
| **Consumes from** | 02 | MDX content files in `/content` directory |
| **Defines for** | 01 | Frontmatter schema that the pipeline must output |
| **Produces for** | 04 | Content infrastructure that the chatbot's RAG pipeline builds on |
| **Produces for** | 05 | Design patterns and navigation structure for pathway tools |

## What This Split Does NOT Cover

- Content generation tooling (split 01)
- Actual article content (split 02)
- AI chatbot or server-side functionality (split 04)
- Interactive pathway tools (split 05)
- Migration to hybrid rendering (split 04)

## Success Criteria

1. All content accessible via `/knowledge` section with category landing pages
2. Full-text search returns relevant results across all articles
3. Articles render with consistent layout, reading time, related content suggestions
4. Navigation seamlessly integrates knowledge base with existing site
5. Mobile experience is excellent (most parents will access from phones)
6. Lighthouse performance score remains above 90
7. All existing site functionality unaffected
