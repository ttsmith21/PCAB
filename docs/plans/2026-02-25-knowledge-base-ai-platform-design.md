# PCAB Knowledge Base & AI Athletic Development Platform - Design Document

**Date:** 2026-02-25
**Status:** Approved

---

## Summary

Expand the Port Clinton Athletic Boosters website from a community engagement platform into a world-class athletic development resource. The platform will serve as the trusted editorial authority for youth-through-varsity athletic development in Port Clinton — combining an AI-generated expert knowledge base, curated external resources, and an AI chatbot, all filtered through a unified philosophy ("The Port Clinton Way").

## Context

- **10-Year Target**: "We have Built a Sustainable Winning Culture in each Athletic Program, from Youth through Varsity"
- **Current state**: 12-page Next.js site with membership, donations, social feed, volunteer, and email signup features — all working. Zero educational or developmental content.
- **Core problem**: Content chaos. Parents and coaches get conflicting advice from social media. No shared philosophy unites youth through varsity programs. Volunteer coaches have no onboarding resources.
- **Key insight**: The problem isn't content scarcity — it's the absence of a trusted, philosophically consistent source of truth.

## What "Winning Culture" Means

Not championships at all costs. Character-first athletic development where sports are the vehicle for building young people who are disciplined, resilient, team-oriented, and capable of sustained effort. The scoreboard is a byproduct of doing the real work.

### The 5 Pillars of Program Success

1. **Participation depth** — percentage of eligible kids playing
2. **Retention across levels** — youth → middle school → high school drop-off rates
3. **Multi-sport participation** — three-sport athletes celebrated, specialization discouraged
4. **Character development markers** — mentoring, community service, academics, explicit life skills
5. **Competitive trajectory** — trending up over 3-5 years, not single-season snapshots

## Strategic Positioning

**The Boosters are the catalyst and infrastructure, not the author.**

- The AD owns "The Port Clinton Way" philosophy
- The Boosters fund, facilitate, and house the platform
- Content authority flows from the school's athletic leadership
- Positioning: "We built the infrastructure. We'd love to support you in defining and communicating a unified philosophy. But it's yours to define."

The new full-time AD (currently MS, taking over HS+MS next year) is the ideal partner. This is a gift to an incoming leader, not an overstep by the booster club.

## Approach: Knowledge Base + AI Guide (Approach B)

Selected from three options:
- ~~A: Static knowledge base only~~ — too passive
- **B: Knowledge base + AI chatbot** — accessible, high-impact, architecturally ready for growth
- ~~C: Full community platform~~ — premature, risk of ghost town, adds maintenance burden

## Content Architecture

### The Content Pyramid

```
            ┌─────────────────────┐
            │  The Port Clinton   │  Foundational philosophy
            │       Way           │  AD-authored, coach-aligned
            ├─────────────────────┤
            │  Development        │  Age-by-age frameworks
            │  Frameworks         │  Sport pathways, multi-sport guides
            ├─────────────────────┤
            │  Audience Guides    │  Tailored to parents, coaches,
            │                     │  volunteers, athletes
            ├─────────────────────┤
            │  Curated External   │  Links to best existing content
            │  Resources          │  with editorial alignment notes
            └─────────────────────┘
                      ▲
            ┌─────────────────────┐
            │   AI Chatbot        │  Conversational access to
            │  "Ask PC Athletics" │  everything above
            └─────────────────────┘
```

### Content Categories

**1. The Port Clinton Way** (created with AD over time)
- Core values and principles
- Development beliefs by age
- Expectations for coaches, parents, athletes
- How success is defined (5 Pillars)

**2. Parent Guides** (~20-30 AI-generated articles)
- First season expectations by age
- Supporting your athlete without undermining the coach
- Multi-sport case for small schools
- Age-appropriate competition
- When your kid wants to quit
- College athletics reality check
- Sport-specific parent guides

**3. Coach Resources** (~20-30 AI-generated articles)
- Volunteer coach survival guide
- Practice planning by age group
- Building team culture at different ages
- Managing parent expectations
- Age-appropriate skill development
- Running a positive tryout process
- Season planning templates

**4. Development Frameworks** (~15-20 AI-generated articles)
- LTAD principles adapted for small schools
- Sport-specific pathways by age
- Multi-sport participation maps
- Physical literacy and age-appropriate training
- Mental game development by age

**5. Community & Program Building** (~10-15 AI-generated articles)
- Starting a youth league
- Running fundraisers
- Building the youth-to-varsity pipeline
- Measuring program success beyond wins
- Volunteer recruitment and retention

**6. Curated External Resources** (links with editorial context)
- Positive Coaching Alliance, NFHS, LTAD frameworks
- Recommended books, podcasts, YouTube channels
- Each linked with: why we recommend it, how it aligns with our principles

### Content Generation Process

1. Define topic list and outlines per category
2. Claude Deep Research generates draft articles (~2,000-3,000 words, research-backed)
3. AI alignment check against "The Port Clinton Way" principles
4. Human review and approval
5. Articles stored as MDX files — static, versioned, searchable

### AI Philosophical Filter

Every piece of content gets tagged with which Pillars it serves and checked against core philosophy. The chatbot uses the same filter — its system prompt includes the philosophy and it won't give contradictory advice.

## Site Integration

### URL Structure

```
Existing Site (engagement)          New Wing (knowledge & development)
─────────────────────────          ──────────────────────────────────
/                 Homepage          /knowledge            Hub landing
/about            About Us          /knowledge/parents    Parent guides
/membership       Join              /knowledge/coaches    Coach resources
/initiatives      Projects          /knowledge/development Frameworks
/sponsors         Sponsors          /knowledge/community  Program building
/volunteer        Volunteer         /knowledge/resources  Curated links
/join             Signup            /knowledge/pc-way     The PC Way
/news             Social Feed       /ask                  AI Chatbot
/resources        Docs/FAQ
/store            Spirit Wear
/youth            Youth Vision → gateway to knowledge base
```

### Navigation

New top-level nav item ("Development") with dropdown to knowledge base sections. Existing `/youth` page becomes the gateway to the knowledge base.

## Technical Changes

| Component | Current | New | Reason |
|---|---|---|---|
| Rendering | Static export | Hybrid (static + server) | Chatbot needs API routes |
| Content | Hardcoded in components | MDX in `/content` | Scalable, searchable |
| Search | None | Flexsearch or Pagefind | Client-side, build-time |
| AI | None | Vercel AI SDK + Claude API | Chatbot |
| Hosting | Vercel Free | Vercel Pro (~$20/mo) | Server functions |

### Content File Structure

```
content/
├── pc-way/
├── parents/
├── coaches/
├── development/
│   └── pathways/        (per-sport)
├── community/
└── curated/
```

MDX frontmatter schema:
```yaml
title: string
category: parents | coaches | development | community | curated | pc-way
pillar: [participation | retention | multi-sport | character | trajectory]
sport: all | baseball | basketball | ...
ageGroup: [8-10 | 11-13 | 14-16 | 17-18]
description: string
lastReviewed: date
```

### AI Chatbot ("Ask PC Athletics")

- Dedicated page at `/ask` + persistent site-wide widget
- Vercel AI SDK + Claude API
- RAG pipeline: questions trigger content search, relevant articles fed as context
- System prompt: Port Clinton Way philosophy + 5 Pillars + guardrails
- Guardrails: no medical advice, no philosophy contradictions, defers tactical coaching questions
- Response time target: <3 seconds initial response

## Audience Priority

1. **Parents** — gatekeepers of participation
2. **Coaches** — delivery mechanism for the experience
3. **Community leaders** — program builders and organizers
4. **Student-athletes** — the beneficiaries

## Budget

- Baseline: $20-50/month (Claude API + Vercel Pro)
- Willing to scale with demonstrated impact
- The Boosters have $700K — cost is not the constraint, impact is

## Build Sequence

```
Phase 1: Content Generation                    (Weeks 1-4)
Phase 2: Knowledge Base Platform               (Weeks 5-8)
Phase 3: AI Chatbot                            (Weeks 9-12)
Phase 4: AD Collaboration & Enhancement        (Ongoing)
```

## Key Decisions

1. **Approach B** — Knowledge base + AI chatbot. Not just static content (A), not full community platform yet (C).
2. **AI generates content, human builds platform** — Claude Deep Research writes articles to a defined standard. Owner builds and controls the technical platform with Claude Code.
3. **Curate over create where possible** — link to great existing content with editorial context rather than reinventing the wheel.
4. **Evergreen, not a content treadmill** — core content reviewed annually, not updated weekly. The social feed handles "what's happening now."
5. **Boosters facilitate, AD authors** — the philosophy comes from the school's athletic leadership. The platform is the delivery vehicle.
6. **Build for layers** — static content first, chatbot second, community features only if demand warrants. Each layer plugs into the one below it.
7. **Trust is the product** — consistent, philosophically aligned, expert-quality content that parents and coaches can rely on. Better to have 50 excellent articles than 200 mediocre ones.
