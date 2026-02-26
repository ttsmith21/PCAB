# Research Findings: Knowledge Base Platform

## Part 1: Codebase Analysis

### Project Structure

```
/
├── app/                    # Next.js App Router pages
├── components/             # React components (3 subdirectories)
├── lib/                    # Utilities, constants, data
├── __tests__/              # Vitest test suite
├── docs/                   # Planning documents
├── planning/               # Project planning and spec files
├── public/                 # Static assets
├── next.config.ts
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── vitest.config.ts
└── eslint.config.mjs
```

### App Router Pages

All pages are flat `page.tsx` files with no nested layouts beyond root:

```
app/
├── layout.tsx              # Root layout: Navbar + children + Footer
├── page.tsx                # / (homepage)
├── globals.css             # Global styles + Tailwind v4 @theme
├── about/page.tsx
├── initiatives/page.tsx
├── join/page.tsx
├── membership/page.tsx
├── news/page.tsx
├── payment/page.tsx
├── resources/page.tsx
├── sponsors/page.tsx
├── store/page.tsx
├── volunteer/page.tsx
└── youth/page.tsx
```

No nested layouts exist. The root `layout.tsx` wraps everything with `<Navbar />` and `<Footer />`. The `/knowledge` section can introduce its own layout for sidebar/breadcrumbs or reuse root layout.

### Component Conventions

- **PascalCase** filenames: `Navbar.tsx`, `FadeIn.tsx`, `SectionHeading.tsx`
- Named default exports
- Props typed via local `interface` declarations
- No barrel `index.ts` re-exports — consumers import by full path: `@/components/ui/Button`

### "use client" Pattern

| Server Components | Client Components |
|---|---|
| All page files (`page.tsx`) | `Navbar.tsx`, `MobileMenu.tsx` |
| `Footer.tsx`, `SponsorShowcase.tsx`, `Hero.tsx` | `FadeIn.tsx`, `AnimatedCounter.tsx` |
| `SectionHeading.tsx`, `Card.tsx`, `Button.tsx` | `FaqAccordion.tsx`, `SignupForm.tsx` |
| | `SocialFeedSection.tsx`, `CuratorFeed.tsx`, `StripeBuyButton.tsx` |

Rule: anything with `useState`, `useEffect`, Framer Motion, or browser APIs gets `"use client"`.

### Page Structure Pattern

Every content page follows this identical pattern:

```tsx
import type { Metadata } from "next";
export const metadata: Metadata = { title: "...", description: "..." };

export default function PageNamePage() {
  return (
    <main>
      {/* Dark hero section */}
      <section className="pt-32 pb-20 bg-pc-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Page Title</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">Subtitle</p>
          </FadeIn>
        </div>
      </section>
      {/* Alternating bg-white / bg-gray-50 / bg-gray-100 content sections */}
      {/* CTA section at bottom, often bg-pc-dark text-white */}
    </main>
  );
}
```

Key structural characteristics:
- `pt-32` on hero to clear fixed navbar (`h-16 lg:h-20`)
- Alternating section backgrounds: `bg-white`, `bg-gray-50`, `bg-gray-100`, `bg-pc-dark`
- `container mx-auto px-4` as standard content wrapper
- `max-w-7xl` on navbar, `max-w-5xl` / `max-w-4xl` / `max-w-3xl` on content
- `FadeIn` wraps almost every content block

### Dependencies

**Production:**

| Package | Version | Usage |
|---|---|---|
| `next` | 16.1.6 | Framework |
| `react` / `react-dom` | 19.2.3 | React 19 |
| `framer-motion` | ^12.34.3 | Scroll-triggered fade animations via `FadeIn` component |
| `lucide-react` | ^0.575.0 | All icons throughout the site |
| `react-intersection-observer` | ^10.0.3 | Lazy-load trigger for `SocialFeedSection` |

**Dev:**

| Package | Version | Usage |
|---|---|---|
| `tailwindcss` | ^4 | Styling (v4) |
| `@tailwindcss/postcss` | ^4 | PostCSS plugin for Tailwind v4 |
| `@tailwindcss/forms` | ^0.5.11 | Form field reset styles |
| `vitest` | ^4.0.18 | Test runner |
| `@vitejs/plugin-react` | ^5.1.4 | React support for Vitest |
| `@testing-library/react` | ^16.3.2 | Component testing |
| `@testing-library/jest-dom` | ^6.9.1 | DOM matchers |
| `jsdom` | ^28.1.0 | Test environment |
| `typescript` | ^5 | TypeScript 5 |
| `eslint` + `eslint-config-next` | ^9 / 16.1.6 | Linting |

**Notable absences**: No MDX packages (`@next/mdx`, `next-mdx-remote`, `gray-matter`, `remark`, `rehype`). No search library (`flexsearch`, `pagefind`). These are all net-new.

### Tailwind CSS v4 Configuration

Configured entirely in `app/globals.css` — no `tailwind.config.js`:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap");
@import "tailwindcss";
@plugin "@tailwindcss/forms";

@theme {
  --color-pc-red: #CC0033;
  --color-pc-dark: #111111;
  --color-pc-red-dark: #A30B2B;
  --color-pc-red-light: #FEF2F2;
  --color-pc-gray: #6B7280;
  --color-pc-gray-light: #F3F4F6;
  --color-pc-gray-dark: #374151;
  --font-sans: "Inter", sans-serif;
  --font-oswald: "Oswald", sans-serif;
  --shadow-glow: 0 0 20px rgba(204, 0, 51, 0.6);
}
```

**Typography:**
- **Inter** = body text, descriptions, labels
- **Oswald** = all headings, buttons (`font-oswald` utility), nav links, uppercase labels

**Recurring class patterns:**
- Buttons: `font-oswald uppercase tracking-wider rounded-full px-8 py-3`
- Cards: `bg-white rounded-2xl shadow-lg p-8`
- Icons in cards: `w-16 h-16 bg-pc-red/10 rounded-full flex items-center justify-center`
- Section text: `text-gray-600 leading-relaxed`
- Hover motion: `hover:-translate-y-1 transition-all duration-300`

### Testing Setup

- **Runner**: Vitest v4 with `jsdom` environment
- **Libraries**: `@testing-library/react` + `@testing-library/jest-dom`
- **Setup file**: `__tests__/setup.ts`
- **Run command**: `vitest run`

Test organization mirrors source structure:
```
__tests__/
├── setup.ts
├── app/           # Page tests
├── components/    # Component tests
├── integration/   # Integration tests
└── lib/           # Utility tests
```

Common mock patterns:
- Next.js mocks: `next/link`, `next/image`, `next/script`
- Framer Motion: `motion.div` → plain `<div>`
- FadeIn: pass-through `<>{children}</>`

### Build and Deployment

`next.config.ts`:
```ts
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};
```

**Fully static site** — no SSR, no API routes. Images unoptimized. Deployed to Vercel.

### Navigation Structure

**Data source** (`lib/data/nav-links.ts`):
```ts
export interface NavLink { label: string; href: string; }
export const navLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Initiatives", href: "/initiatives" },
  { label: "Youth", href: "/youth" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Store", href: "/store" },
  { label: "Resources", href: "/resources" },
  { label: "News", href: "/news" },
  { label: "Join", href: "/join" },
];
```

**Navbar behavior:**
- Fixed position (`fixed top-0 w-full z-50`)
- Transparent at top → frosted white when scrolled > 50px
- Desktop: horizontal links; Mobile: hamburger → full-screen overlay
- Includes "Manage Membership" dropdown and "Donate" button

**To add a Knowledge nav item with dropdown**: The `NavLink` interface only supports `label` and `href` — no dropdown support. Must extend the interface and `Navbar.tsx`.

### Content Patterns

**No MDX infrastructure exists.** All content is hardcoded in JSX or typed TypeScript data files:
- `lib/data/initiatives.ts`, `lib/data/sports.ts`, `lib/data/board.ts`, `lib/data/nav-links.ts`
- No `content/` directory, no MDX files, no frontmatter parsing

The knowledge base will be the first place where content and presentation are decoupled.

### TypeScript

- `strict: true` in tsconfig
- Interfaces preferred over types
- `as const` for config objects
- String literal unions for enums
- `@/*` path alias → repo root
- `moduleResolution: "bundler"`

### Animation Patterns

Framer Motion used exclusively through `FadeIn` wrapper component:
- Configurable direction, delay, className
- `whileInView` with `viewport.once = true`, margin `-100px`
- Duration 0.6s, ease "easeOut", 40px translate
- Staggered with `delay={index * 0.1}` for grid items

All hover states use pure Tailwind CSS transitions.

---

## Part 2: Web Research — MDX, Search, and Static Export

### MDX Library Recommendation

| Use case | Recommended library |
|---|---|
| Local MDX files, simple blog | `@next/mdx` |
| Local MDX with strict typed frontmatter | `@next/mdx` + gray-matter in helper |
| Remote/CMS-sourced MDX strings | `next-mdx-remote-client` |
| Complex content schema validation | Velite or Contentlayer2 |

**Recommendation for this project: `@next/mdx`** with `gray-matter` + `reading-time` in a content helper library.

Key reasons:
- MDX files run as React Server Components — no MDX runtime shipped to client
- `mdx-components.tsx` is a required file convention for App Router
- First-class integration maintained by the Next.js team
- `next-mdx-remote` is not well maintained and has RSC instability

**Setup:**

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx gray-matter reading-time
```

**`next.config.mjs` (updated from .ts):**
```js
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

const nextConfig = {
  output: 'export',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
```

**Required `mdx-components.tsx` at project root.**

**Turbopack note:** Remark/rehype plugins must be specified as strings (not function references) for Turbopack compatibility.

### Frontmatter Pattern

`@next/mdx` does not support YAML frontmatter natively. Two approaches:

1. **MDX Export pattern** — `export const metadata = {...}` in each MDX file
2. **gray-matter** — YAML frontmatter parsed in content helper (for list pages, search indexing)

For this project, use gray-matter in the content helper library for building indexes, and the MDX export pattern is optional.

### Reading Time

Use `reading-time` npm package:
```ts
import readingTime from 'reading-time'
const stats = readingTime(content)
const displayTime = Math.ceil(stats.minutes)
```

### Client-Side Search Recommendation

| Library | Index size (100 posts) | Bundle | Maintenance | Best for |
|---|---|---|---|---|
| **Pagefind** | ~100KB (chunked WASM) | ~26KB WASM | Active | Large static sites, zero config |
| **MiniSearch** | ~50KB JSON (~10KB gzip) | ~25KB | Active | Small-medium sites, full control |
| **FlexSearch** | Larger | ~45KB | Declining | Performance-critical (avoid) |
| **Lunr** | Large | ~30KB | Unmaintained | Legacy only |

**Primary recommendation: Pagefind** — zero-configuration, post-build CLI, chunked loading, handles scaling.

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "pagefind --site out --output-path out/pagefind"
  }
}
```

**Alternative: MiniSearch** — more control over weighted fields, fuzzy matching, highlighting. Build-time JSON index (~10KB gzipped for 100 articles).

**Pagefind gotcha:** Only works after `next build` + `postbuild`. During `next dev`, the import will fail — wrap in try/catch with a dev-mode stub.

### Dynamic Routes with Static Export

**Critical Next.js 15/16 changes:**
- `params` is now a `Promise` — must be `await`ed before destructuring
- Set `dynamicParams = false` for 404 on unregistered routes
- Return `{ category, slug }` from `generateStaticParams`

**Content helper pattern:**
```ts
export function getAllPosts(): Post[] {
  // Read content dir recursively
  // Parse frontmatter with gray-matter
  // Calculate reading time
  // Sort by date
}

export function getPostBySlug(category: string, slug: string): Post | null {
  // Read specific file, parse, return
}
```

### Related Content Algorithm

**Jaccard similarity** on tag/pillar/sport sets:
- `score = |intersection| / |union|`
- Category boost factor: +0.2 for same category
- Pillar boost: +0.15 for shared pillars
- Filter to score > 0, sort descending, take top 3

### SEO for MDX Content

1. `generateMetadata` — does NOT break static rendering (confirmed Next.js 16)
2. JSON-LD structured data (`BlogPosting` schema)
3. Canonical URLs via `generateMetadata`
4. `app/sitemap.ts` for auto-generated sitemap
5. Open Graph images via `opengraph-image.tsx`

### Common `generateStaticParams` Errors

| Error | Fix |
|---|---|
| Param key name mismatch | Key must exactly match folder name |
| Using params synchronously | Always `await params` in Next.js 15/16 |
| Image optimization error | Use unoptimized or custom loader |

---

## Key Decisions for Implementation

### What needs to be built (net new):
1. MDX parsing pipeline (`@next/mdx` + `gray-matter` + `reading-time`)
2. `content/` directory with MDX files organized by category
3. Content utility library (`lib/knowledge.ts` or `lib/content.ts`)
4. Frontmatter TypeScript types matching spec schema
5. Route group under `app/knowledge/` — hub, 6 category pages, `[category]/[slug]`
6. Optional `app/knowledge/layout.tsx` for breadcrumbs/sidebar
7. Search (Pagefind as primary, MiniSearch as alternative)
8. New UI components: ArticleCard, ArticleLayout, CategoryFilter, SearchBar, TableOfContents, RelatedArticles, Breadcrumbs, ReadingTime
9. Navigation update: extend `NavLink` for dropdown support

### Patterns to reuse exactly:
- Hero: `pt-32 pb-20 bg-pc-dark text-white` with `FadeIn`
- `FadeIn` with staggered `delay={index * 0.1}` for grids
- `Card` component for article cards
- `Button` and `SectionHeading` components
- `font-oswald uppercase tracking-wide` for headings
- `text-pc-red` for accent color
- `container mx-auto px-4` + `max-w-*xl` content width
- Alternating section backgrounds
- Same `export const metadata` pattern for SEO

### Static export constraints:
- No server-side data fetching at request time
- MDX files read/parsed at build time only
- Search index built at build time, loaded client-side
- No API routes in Phase 2
- `next/image` unoptimized

### Sources
- [Next.js MDX Guide (v16.1.6)](https://nextjs.org/docs/app/guides/mdx)
- [Next.js Static Exports](https://nextjs.org/docs/app/guides/static-exports)
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Pagefind Documentation](https://pagefind.app/docs/)
- [MiniSearch](https://lucaong.github.io/minisearch/)
- [Introducing Pagefind - CloudCannon](https://cloudcannon.com/blog/introducing-pagefind/)
- [Building a Modern Blog with MDX and Next.js 16](https://www.yourtechpilot.com/blog/building-mdx-blog-nextjs)
