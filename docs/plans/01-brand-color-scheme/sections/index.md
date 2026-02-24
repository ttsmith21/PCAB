<!-- PROJECT_CONFIG
runtime: typescript-npm
test_command: npm run build
END_PROJECT_CONFIG -->

<!-- SECTION_MANIFEST
section-01-theme-tokens
section-02-hover-migrations
section-03-build-verification
section-04-visual-verification
END_MANIFEST -->

# Implementation Sections Index

## Dependency Graph

| Section | Depends On | Blocks | Parallelizable |
|---------|------------|--------|----------------|
| section-01-theme-tokens | - | 02, 03 | Yes |
| section-02-hover-migrations | 01 | 03 | No |
| section-03-build-verification | 01, 02 | 04 | No |
| section-04-visual-verification | 03 | - | No |

## Execution Order

1. section-01-theme-tokens (no dependencies)
2. section-02-hover-migrations (after 01)
3. section-03-build-verification (after 01 AND 02)
4. section-04-visual-verification (after 03)

All sections are sequential -- each depends on the previous.

## Section Summaries

### section-01-theme-tokens
Update the `@theme` block in `app/globals.css`:
- Change `--color-pc-red` from `#EF2B24` to `#CC0033`
- Change `--color-pc-dark` from `#0f172a` to `#111111`
- Update `--shadow-glow` rgba values to match new red
- Add 5 new tokens: `pc-red-dark`, `pc-red-light`, `pc-gray`, `pc-gray-light`, `pc-gray-dark`

**Files:** `app/globals.css`

### section-02-hover-migrations
Replace 4 instances of Tailwind built-in red hover colors with token-based equivalents:
- `Navbar.tsx`: `hover:bg-red-700` -> `hover:bg-pc-red-dark`
- `MobileMenu.tsx`: `hover:bg-red-700` -> `hover:bg-pc-red-dark`
- `Button.tsx`: `hover:bg-red-600` -> `hover:bg-pc-red-dark`
- `resources/page.tsx`: `hover:text-red-600` -> `hover:text-pc-red-dark`

**Files:** `components/layout/Navbar.tsx`, `components/layout/MobileMenu.tsx`, `components/ui/Button.tsx`, `app/resources/page.tsx`

### section-03-build-verification
Run `npm run build` to validate:
- CSS syntax in @theme block is correct
- All new Tailwind utility classes resolve
- Static export generates HTML for all 10 routes
- Zero build errors

**Files:** None (verification only)

### section-04-visual-verification
Manual inspection of all 10 pages:
- Confirm red elements are crimson (not orange)
- Confirm dark sections are near-black (not navy)
- Test hover states on buttons, nav links, and cards
- Verify text selection highlight color
- Check mobile menu overlay
- Spot-check WCAG readability

**Files:** None (verification only)
