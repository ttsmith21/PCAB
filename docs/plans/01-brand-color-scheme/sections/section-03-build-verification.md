# Section 3: Build Verification

## Overview

This section is a verification gate. After completing Section 1 (theme token updates in `app/globals.css`) and Section 2 (hover class migrations across four component files), you must run the production build to confirm everything compiles cleanly. No files are created or modified in this section -- it is purely a validation step.

## Dependencies

- **Section 1 (Theme Tokens)** must be complete: the `@theme` block in `app/globals.css` should contain all 10 declarations (7 colors, 2 fonts, 1 shadow) with the updated hex values.
- **Section 2 (Hover Migrations)** must be complete: the four files (`Navbar.tsx`, `MobileMenu.tsx`, `Button.tsx`, `resources/page.tsx`) should reference `pc-red-dark` instead of Tailwind's built-in red scale for hover states.

## Background

This project is a Next.js App Router site configured for static export (`output: "export"` in `next.config.ts`). It uses Tailwind CSS v4 with `@tailwindcss/postcss`. The build command is `npm run build`, which invokes `next build`. Because the site uses static export, the build produces pre-rendered HTML and CSS for every route.

The site has exactly 10 routes:

| Route | File |
|-------|------|
| `/` | `app/page.tsx` |
| `/about` | `app/about/page.tsx` |
| `/initiatives` | `app/initiatives/page.tsx` |
| `/membership` | `app/membership/page.tsx` |
| `/news` | `app/news/page.tsx` |
| `/resources` | `app/resources/page.tsx` |
| `/sponsors` | `app/sponsors/page.tsx` |
| `/store` | `app/store/page.tsx` |
| `/volunteer` | `app/volunteer/page.tsx` |
| `/youth` | `app/youth/page.tsx` |

There is no automated test framework in this project. The build itself is the test.

## Verification Steps

### Step 1: Run the build

```bash
npm run build
```

This runs `next build`, which performs:
1. TypeScript compilation of all `.tsx`/`.ts` files
2. PostCSS processing (Tailwind CSS v4 compiling the `@theme` block)
3. Static page generation for all 10 routes
4. Output of the static export to the `out/` directory

### Step 2: Confirm exit code 0

The build must complete with exit code 0. Common failure scenarios:

| Failure | Likely Cause |
|---------|-------------|
| CSS parse error in `globals.css` | Syntax error in the `@theme` block (missing semicolon, malformed hex, unclosed block) |
| Unknown utility class | A component references `hover:bg-pc-red-dark` but `--color-pc-red-dark` was not added to `@theme` in Section 1 |
| TypeScript error | Unrelated to this migration, but would still block the build |

### Step 3: Check for warnings

Review build output for warnings about unknown CSS custom properties or unresolved Tailwind classes. A clean build should show standard Next.js output with route generation for all 10 pages.

### Step 4: Confirm static export generated all 10 routes

After a successful build, verify the `out/` directory contains HTML for all routes:

```bash
find out -name "*.html" | sort
```

All 10 routes must be present.

### Step 5: Confirm no Tailwind built-in red hover classes remain

```bash
grep -r "hover:bg-red-\|hover:text-red-" components/ app/
```

This should return zero results. Exception: `hover:bg-black` in Button.tsx is intentional.

## Pass/Fail Criteria

This section passes if **all** of the following are true:

1. `npm run build` exits with code 0
2. No warnings about unknown CSS custom properties or unresolved Tailwind classes
3. The `out/` directory contains generated HTML for all 10 routes
4. Grep for `hover:bg-red-` and `hover:text-red-` returns zero results

If any criterion fails, do not proceed to Section 4. Diagnose and fix the issue in Section 1 or Section 2 and re-run the build.
