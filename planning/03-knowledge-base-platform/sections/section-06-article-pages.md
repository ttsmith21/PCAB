# Section 06: Article Pages

## Overview

This section builds individual article pages at `/knowledge/[category]/[slug]`. Each page renders MDX content using `next-mdx-remote`, displays an article hero with metadata, shows related articles, and includes `data-pagefind-body` for search indexing. Two new components: `ArticleHero` and `RelatedArticles`.

**Dependencies:** Sections 01 (dependencies), 02 (content utilities), 03 (sample content).

**Blocks:** Section 08 (Table of Contents integration).

---

## Files to Create

| File | Description |
|------|-------------|
| `components/knowledge/ArticleHero.tsx` | Hero section for article pages |
| `components/knowledge/RelatedArticles.tsx` | Related articles grid |
| `app/knowledge/[category]/[slug]/page.tsx` | Article page with MDX rendering |
| `__tests__/components/knowledge/ArticleHero.test.tsx` | ArticleHero tests |
| `__tests__/components/knowledge/RelatedArticles.test.tsx` | RelatedArticles tests |
| `__tests__/app/knowledge/article-page.test.tsx` | Article page tests |

---

## Tests

### ArticleHero Tests (`__tests__/components/knowledge/ArticleHero.test.tsx`)

```
# Test: renders article title in dark hero section
# Test: renders category badge
# Test: renders reading time
# Test: renders pillar, sport, and age_group tags
# Test: follows standard dark hero pattern (bg-pc-dark, pt-32, pb-20)
```

### RelatedArticles Tests (`__tests__/components/knowledge/RelatedArticles.test.tsx`)

```
# Test: renders 3 ArticleCard components
# Test: renders section heading
# Test: handles empty related articles array gracefully
```

### Article Page Tests (`__tests__/app/knowledge/article-page.test.tsx`)

Mock `lib/knowledge.ts` functions, `next-mdx-remote/rsc` MDXRemote, child components.

```
# Test: article page renders article hero with title, category badge, reading time
# Test: article page renders MDX content area with data-pagefind-body attribute
# Test: article page renders related articles section with 3 articles
# Test: article page renders table of contents when heading count > 5
# Test: article page does not render table of contents when heading count <= 5
# Test: article page renders breadcrumbs (Home > Knowledge > Category > Title)
# Test: generateStaticParams returns { category, slug } for all MDX files
# Test: generateMetadata returns title, description, and OG tags from frontmatter
```

---

## Implementation

### ArticleHero (`components/knowledge/ArticleHero.tsx`)

Server Component. **Props:** `{ article: Article; categoryLabel: string }`

- `section` with `pt-32 pb-20 bg-pc-dark text-white`
- `max-w-4xl mx-auto px-4`
- Category badge linking to `/knowledge/[category]` -- `bg-pc-red` pill
- Title as `h1`: `font-oswald uppercase text-4xl md:text-5xl`
- `ReadingTime` component
- Row of `TagBadge` components for pillar, sport, age_group arrays
- Wrap in `FadeIn`

### RelatedArticles (`components/knowledge/RelatedArticles.tsx`)

Server Component. **Props:** `{ articles: Article[] }`

- Return `null` if empty array
- Section with `bg-gray-50 py-16`
- `SectionHeading` with "Related Articles"
- Grid `grid-cols-1 md:grid-cols-3 gap-8` of `ArticleCard` with stagger

### Article Page (`app/knowledge/[category]/[slug]/page.tsx`)

**Static generation:**

```typescript
export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({
    category: a.frontmatter.category,
    slug: a.slug,
  }));
}
```

**Metadata:**

```typescript
export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.description,
      type: 'article',
    },
  };
}
```

**Page logic:**

1. Get `category` and `slug` from params (await -- Next.js 16)
2. Call `getArticle(category, slug)` -- if null, call `notFound()`
3. Call `getAllArticles()` and `getRelatedArticles(article, allArticles)`
4. Call `extractHeadings(article.content)`
5. Look up category metadata for display label

**Rendering:**

```
<ArticleHero article={article} categoryLabel={categoryLabel} />

<div className="max-w-7xl mx-auto px-4 py-12">
  <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">

    {/* Main content */}
    <article data-pagefind-body>
      <div data-pagefind-meta="title:{title}" />
      <div data-pagefind-meta="description:{description}" />
      <div data-pagefind-meta="category:{category}" />
      <div data-pagefind-meta="readingTime:{readingTime} min read" />

      <MDXRemote
        source={article.content}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />
    </article>

    {/* Sidebar TOC (desktop) */}
    {headings.length > 5 && (
      <aside className="hidden lg:block">
        <TableOfContents headings={headings} />
      </aside>
    )}
  </div>

  {/* Mobile TOC */}
  {headings.length > 5 && (
    <div className="lg:hidden mb-8">
      <TableOfContents headings={headings} mobile />
    </div>
  )}
</div>

<RelatedArticles articles={relatedArticles} />
```

**Key details:**
- `MDXRemote` imported from `next-mdx-remote/rsc` (RSC-compatible)
- `data-pagefind-body` marks content for search indexing (Section 09)
- `data-pagefind-meta` provides structured metadata for search results
- Two-column desktop layout (content + 280px sidebar), single-column mobile
- TOC conditional on `headings.length > 5` (component built in Section 08, use placeholder/stub until then)
- `notFound()` from `next/navigation` for 404 case
