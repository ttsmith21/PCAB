# 05: Interactive Development Pathways

## Purpose

Build interactive tools that let users visualize and navigate athletic development paths — selecting age, sport(s), and goals to see recommended progressions, multi-sport complementarity maps, and youth-to-varsity timelines.

## Context

- **Full project requirements:** `../requirements.md`
- **Project manifest:** `../project-manifest.md`
- **This split is part of:** Phase 3 (starts after split 03 is complete, parallel with split 04)

## What This Split Delivers

1. An age/sport(s)/goals selection interface that generates a recommended development path
2. Multi-sport participation maps showing how sports complement each other
3. Visual timeline of youth-to-varsity progression by sport
4. All data-driven and structured (not AI-generated at runtime)

## Requirements

### Development Path Selector
- User selects: current age, current sport(s), goals/interests
- System generates: recommended development path through high school
- Includes: suggested sports combinations, key development windows, character milestones
- Grounded in LTAD and youth development frameworks
- Emphasizes multi-sport benefits, especially for a small school context

### Multi-Sport Participation Maps
- Visual representation of how sports complement each other
- Skill transfer relationships (e.g., soccer footwork → basketball agility)
- Seasonal compatibility (fall/winter/spring sport combinations)
- Port Clinton-specific: which sports are offered at which levels

### Youth-to-Varsity Timeline
- Visual progression from youth leagues through middle school to varsity
- By sport: what the pathway looks like
- Key transition points and what to expect at each level
- Where athletes commonly drop off and how to prevent it

### Data Model
- Structured data (JSON/YAML), not AI-generated at runtime
- Sports catalog: all sports offered at Port Clinton, by level (youth, MS, HS)
- Season information: when each sport runs
- Skill transfer data: how sports complement each other
- Development milestones: what's age-appropriate at each stage

## Technical Context

- **Framework:** Next.js 16 App Router, TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion (existing, useful for timeline/map visualizations)
- **Lives within:** the `/knowledge` section (uses split 03's design patterns and navigation)
- **Data-driven:** Static structured data, rendered client-side

## Key Decisions from Interview

- Static/structured data, not AI-powered at runtime
- Separate from the chatbot — these are interactive data visualization tools
- Lives within the knowledge base platform, follows its design patterns

## Dependencies

| Direction | Split | What |
|-----------|-------|------|
| **Depends on** | 03 | Knowledge base platform design patterns, navigation, and route structure |
| **Independent of** | 04 | Does not need the chatbot |

## What This Split Does NOT Cover

- The knowledge base articles or platform (splits 02, 03)
- AI chatbot functionality (split 04)
- Sport-specific tactical content (plays, drills — out of scope per requirements)

## Success Criteria

1. User can select age, sport(s), and goals and see a clear development path recommendation
2. Multi-sport maps visually show how sports complement each other at Port Clinton
3. Timeline gives a clear picture of youth-to-varsity progression
4. All data is accurate to Port Clinton's actual sports offerings and schedule
5. Interactive tools are mobile-friendly (parents access from phones)
6. Consistent with knowledge base design language
