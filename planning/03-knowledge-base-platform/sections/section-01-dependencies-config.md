# Section 01: Dependencies and Configuration

## Overview

This section covers the foundational setup for the Knowledge Base Platform: installing all required npm packages, creating the MDX components map for styled rendering, and adding the Pagefind postbuild script. After completing this section, the project will have all dependencies available and the build will still pass without errors.

**Dependencies on other sections:** None -- this is the first section and has no prerequisites.

**Blocks:** Section 02 (Types and Content Utilities), Section 10 (Navigation).

---

## Tests First

Tests for this section validate that the MDX components map exports all expected HTML element overrides with correct styling. These tests live at `__tests__/lib/mdx-components.test.tsx`.

The project uses Vitest v4 with jsdom, `@testing-library/react`, and `@testing-library/jest-dom`. Tests follow the existing pattern of importing from `@/` path aliases and mocking Next.js modules as pass-throughs. The test setup file at `__tests__/setup.ts` already configures `@testing-library/jest-dom/vitest` matchers.

### Test File: `__tests__/lib/mdx-components.test.tsx`

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { mdxComponents } from "@/lib/mdx-components";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

describe("mdxComponents", () => {
  it("exports all expected HTML element overrides (h1-h4, p, a, ul, ol, blockquote, table, img, pre/code)", () => {
    const expectedKeys = [
      "h1", "h2", "h3", "h4",
      "p", "a", "ul", "ol",
      "blockquote", "table", "img",
      "pre", "code",
    ];
    expectedKeys.forEach((key) => {
      expect(mdxComponents).toHaveProperty(key);
    });
  });

  it("heading overrides apply Oswald font class and uppercase styling", () => {
    const H2 = mdxComponents.h2 as React.FC<any>;
    const { container } = render(<H2>Test Heading</H2>);
    const el = container.firstElementChild!;
    expect(el.className).toMatch(/font-oswald/);
    expect(el.className).toMatch(/uppercase/);
  });

  it("paragraph override applies text-gray-600 and leading-relaxed classes", () => {
    const P = mdxComponents.p as React.FC<any>;
    const { container } = render(<P>Test paragraph</P>);
    const el = container.firstElementChild!;
    expect(el.className).toMatch(/text-gray-600/);
    expect(el.className).toMatch(/leading-relaxed/);
  });

  it("link override applies pc-red color and hover styling", () => {
    const A = mdxComponents.a as React.FC<any>;
    const { container } = render(<A href="/test">Link text</A>);
    const el = container.firstElementChild!;
    expect(el.className).toMatch(/text-pc-red/);
    expect(el.className).toMatch(/hover:text-pc-red-dark/);
  });

  it("blockquote override renders with left border accent", () => {
    const Blockquote = mdxComponents.blockquote as React.FC<any>;
    const { container } = render(<Blockquote>Quote text</Blockquote>);
    const el = container.firstElementChild!;
    expect(el.className).toMatch(/border-l/);
  });

  it("table override wraps content in responsive container", () => {
    const Table = mdxComponents.table as React.FC<any>;
    const { container } = render(
      <Table>
        <tbody>
          <tr>
            <td>Cell</td>
          </tr>
        </tbody>
      </Table>
    );
    const wrapper = container.firstElementChild!;
    expect(wrapper.className).toMatch(/overflow-x-auto/);
  });
});
```

---

## Implementation Details

### Step 1: Install Dependencies

Run from the project root:

```bash
npm install next-mdx-remote gray-matter reading-time remark-gfm rehype-slug zod
npm install --save-dev pagefind
```

**Production dependencies:**

| Package | Purpose |
|---|---|
| `next-mdx-remote` | Compile and render MDX strings in Server Components at build time |
| `gray-matter` | Parse YAML frontmatter from MDX files |
| `reading-time` | Calculate estimated reading time from article content |
| `remark-gfm` | GitHub Flavored Markdown support (tables, strikethrough, task lists) |
| `rehype-slug` | Add `id` attributes to heading elements for anchor links (used by TOC) |
| `zod` | Runtime schema validation for frontmatter at build time |

**Development dependencies:**

| Package | Purpose |
|---|---|
| `pagefind` | Post-build WASM search index generator |

### Step 2: No Config Changes to `next.config.ts`

The existing `next.config.ts` requires **no modifications**. No webpack MDX loader configuration is needed because `next-mdx-remote` compiles MDX programmatically in Server Components.

### Step 3: Add Postbuild Script to `package.json`

Add to scripts section:

```json
"postbuild": "pagefind --site out --output-path out/pagefind"
```

### Step 4: Create MDX Components Map

Create `lib/mdx-components.tsx` -- a mapping of standard HTML element names to styled React components. This is passed to `MDXRemote` in article pages.

**Elements to override:**

| Element | Styling |
|---|---|
| `h1` | `font-oswald uppercase text-3xl font-bold tracking-wide mt-8 mb-4` |
| `h2` | `font-oswald uppercase text-2xl font-bold tracking-wide mt-8 mb-4` |
| `h3` | `font-oswald uppercase text-xl font-semibold tracking-wide mt-6 mb-3` |
| `h4` | `font-oswald uppercase text-lg font-semibold tracking-wide mt-6 mb-2` |
| `p` | `text-gray-600 leading-relaxed mb-4` |
| `a` | `text-pc-red hover:text-pc-red-dark underline transition-colors` |
| `ul` | `list-disc list-inside space-y-2 mb-4 text-gray-600` |
| `ol` | `list-decimal list-inside space-y-2 mb-4 text-gray-600` |
| `blockquote` | `border-l-4 border-pc-red pl-4 italic text-gray-500 my-6` |
| `table` | Wrapped in `div.overflow-x-auto`, table gets `min-w-full divide-y divide-gray-200` |
| `img` | `max-w-full h-auto rounded-lg my-6` |
| `pre` | `bg-gray-100 rounded-lg p-4 overflow-x-auto my-6` |
| `code` | Inline: `bg-gray-100 rounded px-1.5 py-0.5 text-sm text-pc-red-dark` |

Export as named `mdxComponents` object.

### Step 5: Verify Build

Run `npm run build` and `npx vitest run` to confirm nothing is broken.

---

## Files Created or Modified

| File | Action | Description |
|---|---|---|
| `package.json` | Modified | Add 6 production deps, 1 dev dep, and `postbuild` script |
| `lib/mdx-components.tsx` | Created | MDX component overrides map for styled rendering |
| `__tests__/lib/mdx-components.test.tsx` | Created | Tests for the MDX components map |

---

## Verification Checklist

1. All 7 new packages in `package.json`
2. `next.config.ts` unchanged
3. `postbuild` script added
4. `lib/mdx-components.tsx` exports overrides for h1-h4, p, a, ul, ol, blockquote, table, img, pre, code
5. `npx vitest run` passes all tests
6. `npm run build` completes without errors
