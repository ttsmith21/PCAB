# Project: PCAB Knowledge Base & AI Athletic Development Platform

## Problem Statement

Port Clinton's 10-Year Target is to "Build a Sustainable Winning Culture in each Athletic Program, from Youth through Varsity." Today, there is no unified athletic development philosophy, no shared definition of what "winning culture" means, and no central resource for the coaches, parents, volunteers, and athletes who make the pipeline work.

The problems are:
- **Content chaos**: Parents and volunteer coaches get conflicting advice from Instagram, YouTube, and well-meaning friends. No one knows what to trust or whether it aligns with what varsity coaches are actually teaching.
- **No shared philosophy**: "The Port Clinton Way" doesn't exist as a documented, communicated framework. Each youth league, each coach, each family operates with their own assumptions.
- **Volunteer coach barrier**: Port Clinton needs volunteer coaches to sustain youth programs, but coaching is intimidating. There are no onboarding resources, practice planning tools, or guidance for first-timers.
- **Fragmented youth-to-varsity pipeline**: Kids drop out of sports at alarming rates (national average: 70% quit by age 13). There's no developmental roadmap showing what age-appropriate progression looks like or why multi-sport participation matters for a small school.
- **Small school survival**: With limited enrollment, every sport needs maximum participation. Programs that pressure early specialization cannibalize each other. There's no coordinated strategy for multi-sport athlete development.

## Users

### Primary: Parents
- **Role**: Gatekeepers of youth participation. Drive kids to practice, pay fees, decide whether sports are worth the family's investment.
- **Technical level**: Comfortable with smartphones, social media, web browsing. Not technical.
- **Need**: Trustworthy, consistent guidance on supporting their athlete. Understanding of development stages. Confidence that the advice aligns with what coaches are teaching.
- **Location**: Home, bleachers, car (mobile-first).

### Secondary: Coaches (Youth Volunteers through Varsity Staff)
- **Role**: Deliver the athletic experience. Youth volunteers are often parents who played in high school and are figuring it out. Varsity coaches are experienced but time-strapped.
- **Technical level**: Varies widely. Youth volunteers may struggle with anything beyond basic web browsing.
- **Need**: Youth volunteers need onboarding, practice plans, age-appropriate frameworks. All coaches need alignment on philosophy and expectations.
- **Location**: Field, gym, home during planning.

### Tertiary: Community Leaders & Volunteers
- **Role**: Run youth leagues, organize events, recruit participants.
- **Need**: Program-building guides, volunteer recruitment strategies, measuring program health.

### Quaternary: Student-Athletes
- **Role**: The beneficiaries. Especially middle school and high school athletes.
- **Need**: Mindset and goal-setting content, understanding of multi-sport benefits, connection to the bigger picture.

## Current Process

- **Philosophy**: None documented. Each coach operates independently. No shared language or values from youth through varsity.
- **Parent education**: Word of mouth, social media, whatever they find on Instagram. Contradictory and unfiltered.
- **Coach onboarding**: Sink or swim. Volunteer coaches get a roster and a practice schedule. No training, no resources, no mentorship.
- **Content**: The current PCAB website is an engagement platform (membership, donations, volunteering, social feed). There is zero educational or developmental content.
- **Youth development**: No documented pathways, no age-appropriate frameworks, no multi-sport coordination strategy.
- **What goes wrong**: Coaches burn out and quit. Parents make decisions based on bad information. Kids specialize too early, get injured, or burn out. Sports compete against each other for the same small pool of athletes.

## Vision: "The Port Clinton Way"

A character-first athletic development philosophy where:
- **The process is the product** — dedication, hard work, perseverance, teamwork, leadership, discipline
- **Identity over outcomes** — "We are the kind of people who show up, work hard, and lift each other up"
- **Developmental progression** — character milestones at each age, not just skill milestones
- **Earned confidence** — kids experience the cause-and-effect loop of effort leading to improvement
- **Voluntary hardship** — choosing to do difficult things and discovering capability
- **Community pride as feedback loop** — town engagement raises effort, raises results, brings the town out more

### The 5 Pillars of Program Success
1. **Participation depth** — percentage of eligible kids playing (existential for a small school)
2. **Retention across levels** — youth to middle school to high school drop-off rates
3. **Multi-sport participation** — three-sport athletes celebrated, not pressured to specialize
4. **Character development markers** — mentoring, community service, academics, explicit life skills teaching
5. **Competitive trajectory** — trending up over 3-5 years matters more than any single season

## Requirements

### Must Have (MVP — Phase 1 & 2)

#### Content Knowledge Base
- AI-generated library of 75-100+ expert-quality articles organized by audience and topic
- Content categories: Parent Guides, Coach Resources, Development Frameworks, Community/Program Building, Curated External Resources
- MDX-based content with structured frontmatter (title, category, pillar, sport, age group, description, last reviewed date)
- Category landing pages with filtering by sport, age group, and pillar
- Individual article pages with consistent layout, reading time, related articles
- Full-text search across all articles (client-side, built at deploy time)
- Curated external resource links with editorial context explaining alignment with PC philosophy
- "The Port Clinton Way" section — placeholder structure ready for AD collaboration, with foundational content that any reasonable athletic leader would endorse

#### Site Integration
- New top-level navigation item ("Development" or similar) with dropdown to knowledge base sections
- `/knowledge` hub landing page
- `/knowledge/parents`, `/knowledge/coaches`, `/knowledge/development`, `/knowledge/community`, `/knowledge/resources` category pages
- `/knowledge/pc-way` — The Port Clinton Way philosophy section
- Existing `/youth` page becomes gateway to knowledge base
- Mobile-responsive, consistent with existing site design language

#### Content Generation Pipeline
- Defined topic list and outlines for each content category
- Claude Deep Research used to generate articles (~2,000-3,000 words, research-backed, cited where appropriate)
- AI alignment check process: each article validated against core philosophy principles
- Human review and approval workflow before publishing
- Evergreen focus — content that rarely needs updating (annual review, not weekly treadmill)

### Should Have (Phase 3)

#### AI Chatbot — "Ask PC Athletics"
- Dedicated `/ask` page with full chat interface
- Persistent chat widget accessible from any page on the site
- Powered by Vercel AI SDK + Claude API
- RAG (Retrieval Augmented Generation) pipeline: user questions trigger search of MDX content library, relevant articles fed as context to Claude
- System prompt includes The Port Clinton Way philosophy, 5 Pillars framework, and key principles
- Guardrails: won't contradict defined philosophy, won't give medical advice, directs sport-specific tactical questions to coaches
- Conversational access to the entire knowledge base (e.g., "My kid is 12 and plays soccer and basketball — what should the next 3 years look like?")
- Move from static export to hybrid rendering (static pages + server API routes for chat)

#### Interactive Development Pathway Tools
- Select age, sport(s), and goals → get recommended development path
- Multi-sport participation maps showing how sports complement each other
- Visual timeline of youth-to-varsity progression by sport
- Data-driven, structured content (not AI-generated at runtime)

### Nice to Have (Phase 4 — Future)

#### The Port Clinton Way — Full AD Collaboration
- Interview AD (30-minute conversation, Claude drafts philosophy from transcript)
- AD reviews, refines, and officially endorses
- Integrated into chatbot system prompt as authoritative source
- Content alignment audit: all existing articles re-checked against finalized philosophy
- Coach alignment sessions: varsity coaches review and buy in

#### Community Features (Year 2, if demand warrants)
- User accounts with role-based views (parent, coach, athlete, volunteer)
- Coach-contributed content (practice plans, session notes)
- Parent Q&A moderated by AI for philosophical alignment
- Seasonal planning tools
- Program health tracking against 5 Pillars metrics

#### Advanced AI Features (Year 2+)
- Proactive seasonal content via Mailchimp integration ("It's September — here's what every new youth basketball coach needs")
- Multimodal capabilities as AI evolves
- Personalized content recommendations based on user role and interests

### Won't Do (Out of Scope)
- Sport-specific tactical coaching content (plays, schemes, drills) — that's the coach's domain
- Replacing or competing with the AD's authority over coaching philosophy
- Real-time game stats, scores, or schedule management
- Social media content creation or management (Curator.io handles aggregation)
- E-commerce or fundraising features (already handled by Stripe integration)
- CMS or admin dashboard for content management (content lives in repo as MDX)
- User-generated content in MVP (community features are Phase 4)
- Mobile app (responsive web is sufficient)

## System Integration

- **Current site**: Next.js 16 App Router, Tailwind CSS v4, Framer Motion, deployed on Vercel
- **Payments**: Stripe (already integrated, not affected by this project)
- **Email**: Mailchimp (already integrated, potential future integration for proactive content delivery)
- **Social**: Curator.io feed (already integrated, not affected)
- **AI**: Claude API via Vercel AI SDK (new, for chatbot)
- **Search**: Flexsearch or Pagefind (new, client-side, build-time index)
- **Content**: MDX files in repository (new)
- **Hosting**: Vercel (existing, may upgrade to Pro for server functions in Phase 3)

## Safety & Domain Constraints

**Does this code control physical manufacturing operations?** No

**Content safety considerations:**
- All AI-generated content must be reviewed by a human before publishing
- Chatbot must not provide medical, injury diagnosis, or treatment advice
- Chatbot must not contradict the AD-endorsed philosophy
- Content must be age-appropriate
- No personally identifiable information about minors in any content
- External resource links must be vetted for alignment with stated principles

**What happens if this software gives wrong advice?**
- A parent could make a poor decision about their child's sports participation
- A volunteer coach could use inappropriate training methods for an age group
- Trust in the platform and the Boosters organization could be damaged
- Mitigation: all content is evidence-based, reviewed, and aligned with established youth development frameworks (LTAD, Positive Coaching Alliance, NFHS guidelines)

## Tech Stack

- **Language**: TypeScript (existing)
- **Framework**: Next.js 16 App Router (existing, moving from static export to hybrid for Phase 3)
- **Content**: MDX with frontmatter, stored in `/content` directory
- **Search**: Flexsearch or Pagefind (client-side, build-time index)
- **AI**: Claude API + Vercel AI SDK (Phase 3)
- **Styling**: Tailwind CSS v4 (existing)
- **Animations**: Framer Motion (existing)
- **Deployment**: Vercel (existing, Pro tier for Phase 3 server functions)
- **Database**: None for MVP. Supabase if community features are added in Phase 4.
- **Testing**: Vitest + Testing Library (existing)

## Success Criteria

### Phase 1 — Content Generation (Weeks 1-4)
1. 75+ articles generated, reviewed, and ready to publish across all content categories
2. Each article has complete frontmatter (category, pillar, sport, age group)
3. Every article passes an AI alignment check against core philosophy principles
4. Curated external resource list compiled with editorial context for each link
5. "The Port Clinton Way" placeholder section written with universally sound foundational content

### Phase 2 — Knowledge Base Platform (Weeks 5-8)
1. All content accessible via `/knowledge` section with category landing pages
2. Full-text search returns relevant results across all articles
3. Articles render with consistent layout, reading time, related content suggestions
4. Navigation seamlessly integrates knowledge base with existing site
5. Mobile experience is excellent (most parents will access from phones)
6. Lighthouse performance score remains above 90
7. All existing site functionality unaffected

### Phase 3 — AI Chatbot (Weeks 9-12)
1. User can ask a natural language question and receive a helpful, philosophy-aligned answer
2. Chatbot responses cite specific articles from the knowledge base
3. Chatbot refuses to give medical advice or contradict established philosophy
4. Response time under 3 seconds for initial response
5. Chat history persists within a session
6. Hybrid rendering works without breaking existing static pages

### Overall Success
1. The AD sees this as a valuable tool for his programs, not an overstep by the Boosters
2. A new volunteer coach can go from "I have no idea what I'm doing" to "I feel prepared" in one sitting
3. A parent can find trustworthy, consistent answers to their youth sports questions
4. The content reflects a coherent philosophy, not a random collection of articles
5. The platform requires less than 1 hour/month of maintenance

## Stakeholder Context

- **Boosters role**: Catalyst, funder, and infrastructure provider — NOT the author of coaching philosophy
- **AD role**: Owner of "The Port Clinton Way" philosophy. The platform is his tool, not the Boosters' soapbox.
- **Positioning**: "We built the infrastructure and researched best practices. We'd love to support you in defining and communicating a unified athletic development philosophy."
- **AD relationship**: New full-time AD, currently MS, taking over HS+MS next year. Good but new relationship with Boosters president. New AD is a golden window — they're establishing expectations and looking for resources.
- **Political sensitivity**: Must not feel like the booster club is overstepping or telling coaches how to coach. Content authority flows from the school's athletic leadership.

## Build Sequence

```
Phase 1: Content Generation                    (Weeks 1-4)
  ├── Define complete topic list and outlines
  ├── Generate articles with Claude Deep Research
  ├── AI alignment check each article
  ├── Human review and refinement
  └── Create Port Clinton Way placeholder content

Phase 2: Knowledge Base Platform               (Weeks 5-8)
  ├── MDX infrastructure (content loading, frontmatter, rendering)
  ├── Category landing pages with filtering
  ├── Article template and layout component
  ├── Search implementation (Flexsearch/Pagefind)
  ├── Navigation integration with existing site
  └── Youth page gateway integration

Phase 3: AI Chatbot                            (Weeks 9-12)
  ├── Migrate from static export to hybrid rendering
  ├── Claude API route via Vercel AI SDK
  ├── RAG pipeline (content indexing + retrieval)
  ├── Chat UI component (page + persistent widget)
  ├── System prompt with philosophy guardrails
  └── Testing and refinement

Phase 4: AD Collaboration & Enhancement        (Ongoing)
  ├── AD interview and philosophy drafting
  ├── Coach alignment and buy-in
  ├── Content alignment audit against finalized philosophy
  ├── Chatbot system prompt update with official philosophy
  └── Evaluate demand for community features
```

## Notes

- The current site was built in Feb 2026 and is live on Vercel. All engagement features (membership, donations, social feed, volunteer, email signup) are working.
- Stripe keys are still in test mode — payment go-live is a separate workstream.
- Some placeholder URLs remain (Facebook Group slug, SignUpGenius slug).
- The Boosters have ~$700K in the bank from pull tab fundraising. Budget is not the primary constraint — impact and quality are.
- This project is about earning trust: trust from the AD, trust from coaches, trust from parents. The content must be excellent, not just voluminous.
- "The Port Clinton Way" is the single most important piece. Everything else is a delivery mechanism for a philosophy that doesn't exist yet. The platform can launch with universally sound content, but it reaches its full potential only when the AD's vision is integrated.
