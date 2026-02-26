# Interview Transcript — Knowledge Base Platform

## Q1: Navigation Approach
**Question:** The spec mentions a dropdown in the navbar for knowledge base categories, but the current NavLink interface only supports {label, href}. Should we add a full mega-menu/dropdown for the 6 knowledge categories, or a simpler approach like a single 'Knowledge' link that leads to the hub page where users pick categories?

**Answer:** Dropdown with categories — extend NavLink and Navbar to support a dropdown showing all 6 category links.

## Q2: Search Implementation
**Question:** For search implementation, Pagefind (post-build WASM, zero-config, scales well) is recommended, while MiniSearch (build-time JSON index, more UI control) is the alternative. The site has 75-100+ articles planned. Which approach?

**Answer:** Pagefind (Recommended) — zero-config post-build CLI with chunked WASM index, automatic excerpt highlighting, instant results.

## Q3: Content Filesystem Organization
**Question:** How should articles be organized in the filesystem? The spec has 6 categories and articles can belong to multiple pillars/sports/age groups.

**Answer:** Claude to decide. (Decision: organize by category folder — `content/parents/article.mdx`, `content/coaches/article.mdx` — maps cleanly to the `/knowledge/[category]/[slug]` route pattern. Pillars, sports, and age groups are cross-cutting concerns handled as frontmatter arrays.)

## Q4: Youth Page Integration
**Question:** The spec says the existing /youth page should be 'updated to gateway into knowledge base.' What does this mean concretely?

**Answer:** Add knowledge links section — keep /youth as-is but add a new section with curated links to relevant knowledge base articles (youth sports, age-appropriate content).

## Q5: Table of Contents Design
**Question:** For the table of contents on longer articles, how should it work?

**Answer:** Auto-generated, threshold-based — only show TOC when article exceeds ~5 headings. Sticky on desktop, collapsible on mobile.

## Q6: Sample Content
**Question:** Are there sample/seed MDX articles to create as part of this plan?

**Answer:** Minimal stubs only — just enough content to verify the MDX pipeline works, not realistic content.

## Q7: Navigation Label
**Question:** What should the top-level navigation item be called for the knowledge base section?

**Answer:** "Knowledge" — clean, matches the /knowledge URL path, immediately clear to parents and coaches.

## Q8: Filter URL Persistence
**Question:** Should category filter UI persist in the URL as query params so filtered views are shareable/bookmarkable?

**Answer:** Yes, URL query params — e.g., `/knowledge/parents?sport=football&age=youth` — shareable, bookmarkable.

## Q9: Accessibility Requirements
**Question:** Any specific performance or accessibility requirements beyond the spec's 'Lighthouse score above 90'?

**Answer:** Keep it simple — make it work well, don't over-engineer accessibility beyond normal React/HTML best practices.
