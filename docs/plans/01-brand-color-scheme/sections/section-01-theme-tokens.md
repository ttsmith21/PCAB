# Section 1: Update @theme Token Values

## Overview

This section updates the central CSS design token block in `app/globals.css`. The PC Athletic Boosters website uses Tailwind CSS v4 with a `@theme` block that defines all custom brand colors. Every component in the codebase references colors through Tailwind utility classes (e.g., `bg-pc-red`, `text-pc-dark`), so changing the token values here propagates automatically to all 87+ class references across 23 files.

The site currently uses two brand colors with problems:
- **PC Red (#EF2B24):** Fails WCAG AA contrast on white backgrounds (4.16:1 ratio, needs 4.5:1). Leans orange rather than the school's crimson.
- **PC Dark (#0f172a):** Tailwind Slate-900 (navy). Port Clinton High School's colors are red and white -- navy is not a school color.

The new primary red **#CC0033** (Vivid Crimson) comes from BSN Sports, PCHS's official merchandise provider. It passes WCAG AA at 5.80:1 on white. The new dark **#111111** (near-black) replaces navy as a neutral utility color.

## File to Modify

**`app/globals.css`** -- this is the only file modified in this section.

## Current State

The existing `@theme` block in `app/globals.css` contains exactly 5 declarations (2 colors, 2 fonts, 1 shadow):

```css
@theme {
  --color-pc-red: #EF2B24;
  --color-pc-dark: #0f172a;
  --font-sans: "Inter", sans-serif;
  --font-oswald: "Oswald", sans-serif;
  --shadow-glow: 0 0 20px rgba(239, 43, 36, 0.6);
}
```

The rest of `globals.css` contains a Google Fonts import, a Tailwind import, and base styles for `body`, headings, and `html`. None of those need to change.

## Verification Steps (Tests)

This project has no automated test framework. Verification is done via build checks and manual inspection.

### Pre-implementation verification

Before making changes, confirm the starting state:

1. Open `app/globals.css` and verify the `@theme` block has exactly 5 declarations.
2. Confirm the current values match:
   - `--color-pc-red: #EF2B24`
   - `--color-pc-dark: #0f172a`
   - `--shadow-glow` contains `rgba(239, 43, 36, 0.6)`

### Post-implementation verification

After making changes:

1. Run `npm run build` -- it must exit with code 0. This validates CSS syntax and confirms Tailwind can parse the `@theme` block and generate utility classes for all tokens.
2. Verify the new `@theme` block has exactly **10 declarations** (7 colors + 2 fonts + 1 shadow).
3. All 5 new color tokens should generate valid Tailwind utility classes. If any token name is malformed, the build will fail when components reference classes like `bg-pc-red-dark`.

## Implementation Details

### Changes to existing tokens

Three existing declarations need their values updated:

| Token | Old Value | New Value |
|-------|-----------|-----------|
| `--color-pc-red` | `#EF2B24` | `#CC0033` |
| `--color-pc-dark` | `#0f172a` | `#111111` |
| `--shadow-glow` | `0 0 20px rgba(239, 43, 36, 0.6)` | `0 0 20px rgba(204, 0, 51, 0.6)` |

The shadow-glow rgba values must be updated manually because the shadow is defined inline with hardcoded rgba values rather than referencing the `pc-red` token.

### New tokens to add

Five new color tokens must be added to the `@theme` block:

| Token | Value | Purpose |
|-------|-------|---------|
| `--color-pc-red-dark` | `#A30B2B` | Button hover states, pressed/active states |
| `--color-pc-red-light` | `#FEF2F2` | Light section backgrounds, alert tints |
| `--color-pc-gray` | `#6B7280` | Secondary text, captions |
| `--color-pc-gray-light` | `#F3F4F6` | Card/section backgrounds |
| `--color-pc-gray-dark` | `#374151` | Subheadings, footer text |

### What the final @theme block should look like

After all changes, the `@theme` block in `app/globals.css` should contain these 10 declarations (2 fonts + 7 colors + 1 shadow). The font declarations remain unchanged:

```css
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

Nothing else in `globals.css` changes. The Google Fonts import, the Tailwind import, and the `body`, heading, and `html` styles all remain exactly as they are.

### What does NOT need a token

- **White:** No `--color-pc-white` token is needed. Tailwind's built-in `bg-white` and `text-white` utilities are sufficient. Adding a redundant token would create unused dead code.
- **Gray migration:** The existing ~70 references to Tailwind's built-in `text-gray-*` / `bg-gray-*` / `border-gray-*` classes across the codebase are **out of scope** for this section (and this entire plan). The new `pc-gray` tokens are established for future development use -- new components and section backgrounds. Tailwind's built-in grays coexist with the custom tokens without conflict.

## WCAG Contrast Reference

These ratios apply to the new token values and should be validated visually in Section 4:

| Combination | Ratio | Passes |
|-------------|-------|--------|
| #CC0033 on #FFFFFF | 5.80:1 | AA normal text |
| #FFFFFF on #CC0033 | 5.80:1 | AA normal text |
| #FFFFFF on #111111 | 18.8:1 | AAA |
| #111111 on #FFFFFF | 18.8:1 | AAA |
| #A30B2B on #FFFFFF | 7.50:1 | AAA |

## What This Section Enables

Once this section is complete, all existing components that reference `bg-pc-red`, `text-pc-red`, `bg-pc-dark`, `text-pc-dark`, and `shadow-glow` will automatically render with the new crimson and near-black values. Transparency variants like `bg-pc-red/10` and `bg-pc-dark/95` also update automatically.

**Downstream dependency:** Section 2 (hover migrations) depends on the `--color-pc-red-dark` token added here. That token must exist before components can reference `hover:bg-pc-red-dark`.
