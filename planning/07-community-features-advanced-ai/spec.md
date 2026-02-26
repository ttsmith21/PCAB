# 07: Community Features & Advanced AI

## Purpose

Add user accounts, community engagement features, and advanced AI capabilities to transform the platform from a content delivery system into a community-driven athletic development ecosystem.

## Context

- **Full project requirements:** `../requirements.md`
- **Project manifest:** `../project-manifest.md`
- **This split is part of:** Phase 4 (Deferred / Future — build if demand warrants)

## What This Split Delivers

1. User accounts with role-based views
2. Coach-contributed content
3. AI-moderated parent Q&A
4. Seasonal planning tools
5. Program health tracking against 5 Pillars
6. Proactive content delivery via Mailchimp
7. Personalized content recommendations

## Requirements

### User Accounts & Roles
- Authentication system (likely Supabase Auth)
- Roles: parent, coach, athlete, volunteer
- Role-based views: each role sees content and tools relevant to them
- Profile management

### Coach-Contributed Content
- Coaches can submit practice plans, session notes
- Content moderation workflow (likely AI-assisted for philosophy alignment)
- Integration with existing MDX content system or separate contribution system

### Parent Q&A
- Parents can ask questions
- AI moderates for philosophical alignment before publishing
- Coaches or AD can respond
- Knowledge base articles suggested as relevant context

### Seasonal Planning Tools
- Sport-specific seasonal calendars
- Training phase recommendations by time of year
- Coordination across sports (when does football overlap with basketball conditioning?)

### Program Health Tracking
- Dashboard tracking the 5 Pillars metrics:
  1. Participation depth (% of eligible kids playing)
  2. Retention across levels (youth → MS → HS drop-off rates)
  3. Multi-sport participation rates
  4. Character development markers
  5. Competitive trajectory
- Data input mechanism (manual or integrated)
- Trend visualization over time

### Advanced AI Features
- Proactive seasonal content via Mailchimp ("It's September — here's what every new youth basketball coach needs")
- Multimodal capabilities as AI evolves
- Personalized content recommendations based on user role, interests, and history

## Technical Context

- **Database:** Supabase (new — first introduction of a database)
- **Auth:** Supabase Auth
- **AI:** Claude API via Vercel AI SDK (existing from split 04)
- **Email:** Mailchimp (existing integration, extended for proactive content)
- **Framework:** Next.js 16 (already hybrid from split 04)

## Key Decisions from Interview

- Deferred pending demand validation
- Introduces significant new infrastructure (database, auth, user management)
- Scope may be re-evaluated based on Phase 1-3 learnings
- This is the most speculative split

## Dependencies

| Direction | Split | What |
|-----------|-------|------|
| **Depends on** | 02 | Content library as foundation |
| **Depends on** | 03 | Platform infrastructure |
| **Depends on** | 04 | AI chatbot infrastructure and hybrid rendering |
| **Depends on** | 06 | Official philosophy for alignment moderation |

## What This Split Does NOT Cover

- The core content, platform, or chatbot (splits 01-04)
- AD collaboration process (split 06)
- E-commerce or fundraising (already handled by Stripe)
- Social media management (handled by Curator.io)
- Mobile app (responsive web is sufficient per requirements)

## Success Criteria

1. Users can create accounts and see role-appropriate content
2. Coaches can contribute practice plans that are moderated for alignment
3. Parents get proactive, seasonally relevant content via email
4. Program health dashboard shows meaningful trends over time
5. Platform requires less than 1 hour/month of maintenance (per overall project success criteria)
