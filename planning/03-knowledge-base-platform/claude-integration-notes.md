# Integration Notes: Opus Review Feedback

## Changes Integrated

### 1. MDX Rendering Architecture (Critical #1) -- INTEGRATING
**Why:** The reviewer is correct. `@next/mdx` compiles files in the webpack module graph, not files read from disk with `fs.readFileSync`. The current plan has a fundamental gap: `getArticle()` returns a raw MDX string but there's no compilation step to render it.

**Resolution:** Switch to `next-mdx-remote` (specifically the RSC-compatible approach). This allows keeping content in `content/` directory (clean separation) while compiling MDX strings at build time in Server Components. Update dependency list: remove `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`; add `next-mdx-remote`. Keep `gray-matter`, `remark-gfm`, `rehype-slug` as they're passed to the MDX compiler.

### 2. Keep `next.config.ts` (Critical #2) -- INTEGRATING
**Why:** Reviewer is correct. Next.js 16 supports TypeScript config natively with ESM imports. Converting to `.mjs` loses type checking for no benefit. The risk identified in the plan's own risks table is entirely self-inflicted.

**Resolution:** Remove the `.mjs` migration section. MDX configuration (if still needed for `pageExtensions`) stays in `next.config.ts`. With `next-mdx-remote`, we may not need `createMDX()` wrapper at all -- MDX compilation happens programmatically, not via webpack loader.

### 3. `useSearchParams()` + Static Export FOUC (Critical #3) -- INTEGRATING
**Why:** Valid concern. With `output: "export"`, search params are empty during SSG and only available after client hydration. Users arriving via a shared filtered URL will see all articles flash before filtering applies.

**Resolution:** Add explicit `Suspense` boundary around `CategoryFilter` in the plan. Use a loading skeleton/shimmer for the article grid that shows until params are read and filtering is applied. Render all articles server-side (for SEO), apply CSS `opacity-0` initially on the grid wrapper, then reveal after client-side filter application.

### 4. Missing Test Plan (Significant #4) -- INTEGRATING
**Why:** The codebase has comprehensive tests. Omitting test guidance for 10 new components and 3 page routes is a clear gap.

**Resolution:** Add a testing section to the plan covering:
- Unit tests for `lib/knowledge.ts` (all content utility functions)
- Component tests for key components (ArticleCard, CategoryFilter, SearchBar, Breadcrumbs, TableOfContents)
- Updated Navbar/MobileMenu tests for dropdown behavior
- `fs` mocking strategy for content utilities in test environment
- Pagefind explicitly excluded from unit tests (integration-only)

### 5. Existing Navbar Dropdown Pattern (Significant #5) -- INTEGRATING
**Why:** The reviewer found an existing CSS `group-hover` dropdown pattern on the Navbar. The plan should reference and reuse it for consistency.

**Resolution:** Update Section 7 to reference the existing pattern and specify reusing the same CSS hover approach. This is simpler than Framer Motion and consistent with the codebase.

### 6. Footer `slice(0, 6)` Issue (Significant #6) -- INTEGRATING
**Why:** Real hidden dependency. Adding "Knowledge" to `navLinks` at the wrong position silently breaks the footer.

**Resolution:** Specify exact position for "Knowledge" in `navLinks` array and note that footer's `slice(0, 6)` must be updated to accommodate the new item (or explicitly decide which items appear in footer).

### 7. `ArticleCard` Server/Client Boundary (Minor #10) -- INTEGRATING
**Why:** Valid. If filtering is client-side, ArticleCard must be renderable within a Client Component boundary.

**Resolution:** ArticleCard remains a presentational component without `"use client"` directive (it has no hooks/state). It can be imported and rendered by a Client Component parent. The category page renders the full list server-side, then the client-side `CategoryFilter` wrapper handles show/hide. Clarify this in the plan.

### 8. Reading Time on Parsed Content (Minor #11) -- INTEGRATING
**Why:** Simple but important correctness fix.

**Resolution:** Specify that `reading-time` is applied to `matter(fileContent).content`, not the raw file.

### 9. TOC Heading Extraction (Minor #12) -- INTEGRATING
**Why:** Ambiguity that will cause implementation delay.

**Resolution:** Use regex matching on the raw MDX content for `## ` patterns (heading lines). This is simple, reliable for MDX authored content, and doesn't require additional remark plugins. Extract heading text and level, then pass as structured data to the TOC component.

### 10. `getAllArticles()` Memoization (Minor #15) -- INTEGRATING
**Why:** With 100+ articles and 100+ build-time invocations, redundant file I/O is wasteful.

**Resolution:** Add module-level cache to `getAllArticles()`. Since the build runs in a single Node process, a simple `let cache: Article[] | null = null` pattern works.

### 11. Content Validation (Minor #19) -- INTEGRATING
**Why:** With 75-100+ articles from multiple sources, invalid frontmatter will happen.

**Resolution:** Add Zod schema validation for frontmatter in `lib/knowledge.ts`. Throw descriptive error at build time if frontmatter is invalid (fail fast with file path and field details).

### 12. Content Directory Path Resolution (Minor #18) -- INTEGRATING
**Why:** Simple but prevents a common pitfall.

**Resolution:** Specify `process.cwd()` as the base path for content directory resolution.

---

## Changes NOT Integrated

### Pagefind Dev Mode (Significant #7) -- NOT INTEGRATING
**Why not:** The plan already mentions try/catch with dev-mode fallback in the Risks table. The reviewer wants more emphasis, but the existing guidance is sufficient. The implementer will discover this naturally.

### Custom 404 (Significant #8) -- NOT INTEGRATING
**Why not:** The default Next.js 404 is acceptable. Custom 404 is a nice-to-have but out of scope for this split. `dynamicParams = false` correctly returns 404 for unknown routes.

### tsconfig MDX Include (Significant #9) -- NOT INTEGRATING
**Why not:** With the switch to `next-mdx-remote`, MDX files are read as strings via `fs`, not compiled by TypeScript/webpack. They don't need to be in tsconfig's `include`. If we were using `@next/mdx` with file-based routing, this would matter.

### SEO/Sitemap Updates (Minor #13) -- NOT INTEGRATING
**Why not:** The site already has `app/sitemap.ts`. Adding knowledge routes there is a trivial addition that doesn't need plan-level guidance. It can be handled during implementation.

### Accessibility Details (Minor #14) -- NOT INTEGRATING
**Why not:** Good suggestions but too granular for an implementation plan. ARIA attributes, focus management, and skip links are implementation details that belong in the component code, not the plan. Lighthouse > 90 (which includes accessibility score) is the right level of guidance.

### Category Icon Type (Minor #16) -- NOT INTEGRATING
**Why not:** Using string icon names with a lookup map is a common, pragmatic pattern. It allows category metadata to be serializable (JSON-friendly) and the lookup is trivial. `React.ComponentType` in the metadata interface would complicate serialization.

### Mobile Menu Accordion (Minor #17) -- PARTIALLY INTEGRATING
**Why not full integration:** The reviewer suggests linking directly to `/knowledge` instead of an accordion. This is simpler but loses the benefit of quick category access on mobile. Compromise: the mobile menu shows "Knowledge" as a direct link to `/knowledge` (like other items), plus an expand chevron that reveals category sub-links. This maintains consistency while adding discoverability.

### Remove `@mdx-js/react` (Minor #20) -- INTEGRATING (via #1)
**Why:** Already handled by the MDX architecture change. Switching to `next-mdx-remote` removes the need for `@mdx-js/react`, `@mdx-js/loader`, and `@next/mdx`.
